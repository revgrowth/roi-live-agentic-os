import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import { getDb } from "@/lib/db";

interface ActiveProject {
  slug: string;
  name: string;
  goal: string | null;
}

interface ActiveTask {
  id: string;
  title: string;
  projectSlug: string | null;
}

export interface ScopeResult {
  level: "task" | "project" | "gsd";
  confidence: number;
  overlaps: { slug: string; name: string; reason: string }[];
  clarifications: string[];
  suggestedSubtasks: {
    title: string;
    description: string;
    dependsOn: number[];
    wave: number;
    acceptanceCriteria: string[];
  }[];
}

/**
 * POST /api/tasks/scope-goal
 *
 * Intelligent routing: takes a raw goal text and determines level,
 * detects overlaps with active projects, suggests clarifications,
 * and decomposes into subtasks with dependency info.
 */
export async function POST(request: NextRequest) {
  try {
    const { goal } = (await request.json()) as { goal: string };
    if (!goal || typeof goal !== "string" || goal.trim().length === 0) {
      return NextResponse.json(
        { error: "goal is required" },
        { status: 400 }
      );
    }

    const db = getDb();

    // Fetch active projects from DB projects table
    const activeProjects = db
      .prepare(
        `SELECT slug, name, goal FROM projects WHERE status = 'active' ORDER BY updatedAt DESC LIMIT 20`
      )
      .all() as ActiveProject[];

    // Fetch active non-done task titles
    const activeTasks = db
      .prepare(
        `SELECT id, title, projectSlug FROM tasks
         WHERE status NOT IN ('done')
         AND parentId IS NULL
         ORDER BY updatedAt DESC
         LIMIT 30`
      )
      .all() as ActiveTask[];

    const projectContext =
      activeProjects.length > 0
        ? `\n\nActive projects:\n${activeProjects.map((p) => `- ${p.slug}: ${p.name}${p.goal ? ` — ${p.goal}` : ""}`).join("\n")}`
        : "";

    const taskContext =
      activeTasks.length > 0
        ? `\n\nActive tasks:\n${activeTasks.map((t) => `- ${t.title}${t.projectSlug ? ` [project: ${t.projectSlug}]` : ""}`).join("\n")}`
        : "";

    const prompt = `You are a goal routing and breakdown assistant. Classify and decompose this goal.

## Decision Tree

Assess across three dimensions:
1. **Deliverable count:** One clear output → "task". 2-8 related outputs → "project" with subtasks. Many outputs across domains → "gsd".
2. **Ambiguity:** Low (done is obvious) → "task". Medium (clear scope, details needed) → "project". High (broad, strategic) → "gsd".
3. **Duration:** Single session → "task". Multi-session campaign → "project". Multi-phase with architecture → "gsd".

Signal words:
- task: "write a...", "fix the...", "send a...", single-verb requests
- project: "launch...", "set up...", "create a [thing] with [parts]", "I need X, Y, and Z", "campaign", "series of..."
- gsd: "build an app", "redesign the system", "create a platform", "automate the whole..."

## Subtask Decomposition (for "project" level)

Break into 2-8 subtasks. Each MUST have:
- A title starting with an action verb (Build, Write, Design, Configure, Test, etc.)
- A wave number: Wave 1 = foundation (must complete first). Wave 2+ = can run in parallel after dependencies met. Same-wave tasks have no dependencies on each other.
- At least one acceptance criterion (observable truth, not vague)
- Dependency list (by subtask index, 0-based). Wave 1 tasks have empty dependsOn.

Verify completeness: if every subtask's acceptance criteria are met, is the original goal achieved? If not, add a subtask.

## Overlap Detection

Check if the goal overlaps with any active project or task. Only flag genuine overlaps — not vague similarity.${projectContext}${taskContext}

## Clarifications

Only ask clarifications if the goal is genuinely ambiguous and you cannot decompose without answers. Max 2 questions. Prefer making reasonable assumptions over asking.

## Goal

"${goal.trim()}"

Return ONLY valid JSON (no markdown, no explanation):
{
  "level": "task" | "project" | "gsd",
  "confidence": number (0-1),
  "overlaps": [{"slug": string, "name": string, "reason": string}],
  "clarifications": [string],
  "suggestedSubtasks": [{"title": string, "description": string, "dependsOn": [number], "wave": number, "acceptanceCriteria": [string]}]
}`;

    const result = await runClaude(prompt);

    if (!result) {
      // Fallback: return task level with no analysis
      return NextResponse.json({
        level: "task",
        confidence: 0.5,
        overlaps: [],
        clarifications: [],
        suggestedSubtasks: [],
      } satisfies ScopeResult);
    }

    // Parse the JSON response
    let scopeResult: ScopeResult;
    try {
      const jsonStr = result
        .replace(/```json?\s*/g, "")
        .replace(/```/g, "")
        .trim();
      scopeResult = JSON.parse(jsonStr);

      // Validate and sanitize
      if (!["task", "project", "gsd"].includes(scopeResult.level)) {
        scopeResult.level = "task";
      }
      if (
        typeof scopeResult.confidence !== "number" ||
        scopeResult.confidence < 0 ||
        scopeResult.confidence > 1
      ) {
        scopeResult.confidence = 0.5;
      }
      if (!Array.isArray(scopeResult.overlaps)) scopeResult.overlaps = [];
      if (!Array.isArray(scopeResult.clarifications))
        scopeResult.clarifications = [];
      if (!Array.isArray(scopeResult.suggestedSubtasks))
        scopeResult.suggestedSubtasks = [];
    } catch {
      console.error(
        "[scope-goal] Failed to parse AI response:",
        result.slice(0, 200)
      );
      return NextResponse.json({
        level: "task",
        confidence: 0.5,
        overlaps: [],
        clarifications: [],
        suggestedSubtasks: [],
      } satisfies ScopeResult);
    }

    // Persist the scoping decision to agent_decisions
    try {
      const decisionId = crypto.randomUUID();
      const now = new Date().toISOString();
      // Create a conversation for tracking
      const conversationId = crypto.randomUUID();
      db.prepare(
        `INSERT INTO conversations (id, title, status, createdAt, updatedAt)
         VALUES (?, ?, 'active', ?, ?)`
      ).run(conversationId, `Scope: ${goal.slice(0, 60)}`, now, now);

      db.prepare(
        `INSERT INTO agent_decisions (id, conversationId, decisionType, reasoning, level, createdAt)
         VALUES (?, ?, 'scope', ?, ?, ?)`
      ).run(
        decisionId,
        conversationId,
        JSON.stringify(scopeResult),
        scopeResult.level,
        now
      );
    } catch (err) {
      console.error("[scope-goal] Failed to persist decision:", err);
    }

    return NextResponse.json(scopeResult);
  } catch (error) {
    console.error("POST /api/tasks/scope-goal error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function runClaude(prompt: string): Promise<string | null> {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      try {
        proc.kill("SIGTERM");
      } catch {
        /* gone */
      }
      resolve(null);
    }, 15000);

    const cleanEnv = { ...process.env };
    delete cleanEnv.CLAUDECODE;

    const proc = spawn(
      "claude",
      ["-p", prompt, "--output-format", "text", "-m", "haiku"],
      {
        stdio: ["pipe", "pipe", "pipe"],
        env: cleanEnv,
      }
    );

    if (proc.stdin) proc.stdin.end();

    let stdout = "";
    proc.stdout?.on("data", (chunk: Buffer) => {
      stdout += chunk.toString();
    });

    proc.on("close", (code) => {
      clearTimeout(timeout);
      if (code === 0 && stdout.trim()) {
        resolve(stdout.trim());
      } else {
        resolve(null);
      }
    });

    proc.on("error", () => {
      clearTimeout(timeout);
      resolve(null);
    });
  });
}
