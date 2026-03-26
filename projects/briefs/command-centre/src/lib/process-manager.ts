import { spawn, type ChildProcess } from "child_process";
import { createInterface } from "readline";
import { getDb } from "./db";
import { getConfig, getClientAgenticOsDir } from "./config";
import { emitTaskEvent } from "./event-bus";
import { ClaudeOutputParser } from "./claude-parser";
import { fileWatcher } from "./file-watcher";
import type { Task, LogEntry } from "@/types/task";

/**
 * Manages Claude CLI child processes for task execution.
 * Supports multi-turn conversations via --continue for follow-up replies.
 * Singleton -- one instance per server process.
 */
interface SessionEntry {
  proc: ChildProcess;
  /** Set when a question was detected during this turn — prevents handleComplete from finalising */
  pendingQuestion: boolean;
  /** Accumulated cost across multiple turns */
  totalCostUsd: number;
  totalTokensUsed: number;
  totalDurationMs: number;
  /** True when this turn was resumed from "review" status — if it completes without a question, move to "done" */
  resumedFromReview: boolean;
}

class ProcessManager {
  private sessions = new Map<string, SessionEntry>();
  private lastProgressEmit = new Map<string, number>();
  /** Track which tasks are waiting for user reply (process exited, awaiting --continue) */
  private waitingForReply = new Set<string>();

  constructor() {
    const cleanup = () => this.cleanup();
    process.on("exit", cleanup);
    process.on("SIGTERM", cleanup);
    process.on("SIGINT", cleanup);
  }

  /**
   * Execute a task by spawning a Claude CLI session.
   */
  async executeTask(taskId: string): Promise<void> {
    console.log(`[process-manager] executeTask called for ${taskId}`);

    if (this.sessions.has(taskId)) {
      console.warn(`[process-manager] Task ${taskId} is already running, skipping`);
      return;
    }

    const db = getDb();
    const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(taskId) as Task | undefined;

    if (!task) {
      console.error(`[process-manager] Task ${taskId} not found in database`);
      return;
    }

    const now = new Date().toISOString();

    // Update status to running, clear needsInput
    db.prepare("UPDATE tasks SET status = ?, startedAt = ?, updatedAt = ?, activityLabel = ?, errorMessage = NULL, needsInput = 0 WHERE id = ?").run(
      "running", now, now, "Starting Claude session...", taskId
    );

    // Clear stale log entries from previous runs
    db.prepare("DELETE FROM task_logs WHERE taskId = ?").run(taskId);
    // Clear stale output files from previous runs
    db.prepare("DELETE FROM task_outputs WHERE taskId = ?").run(taskId);

    const updatedTask = db.prepare("SELECT * FROM tasks WHERE id = ?").get(taskId) as Task;
    emitTaskEvent({ type: "task:status", task: this.normalizeTask(updatedTask), timestamp: now });

    // Start file watcher
    try {
      await fileWatcher.startWatching(taskId);
    } catch (err) {
      console.error(`[process-manager] fileWatcher.startWatching failed:`, err);
    }

    // Build the initial prompt
    const config = getConfig();
    const cwd = task.clientId ? getClientAgenticOsDir(task.clientId) : config.agenticOsDir;

    if (task.clientId) {
      const fs = await import("fs");
      if (!fs.existsSync(cwd)) {
        this.handleTaskError(taskId, `Client directory not found: clients/${task.clientId}`);
        return;
      }
    }

    // Detect available context sources in the working directory
    const fs = require("fs") as typeof import("fs");
    const pathMod = require("path") as typeof import("path");
    const contextSources: { type: string; label: string; path?: string }[] = [];

    // Check for CLAUDE.md (always loaded by Claude CLI automatically)
    const claudeMdPath = pathMod.join(cwd, "CLAUDE.md");
    if (fs.existsSync(claudeMdPath)) {
      contextSources.push({ type: "system", label: "CLAUDE.md", path: "CLAUDE.md" });
    }

    // Check for SOUL.md and USER.md
    for (const contextFile of ["SOUL.md", "USER.md", "learnings.md"]) {
      const filePath = pathMod.join(cwd, "context", contextFile);
      if (fs.existsSync(filePath)) {
        contextSources.push({ type: "system", label: contextFile, path: `context/${contextFile}` });
      }
    }

    // Check for brand context files
    const brandDir = pathMod.join(cwd, "brand_context");
    if (fs.existsSync(brandDir)) {
      try {
        const brandFiles = fs.readdirSync(brandDir).filter((f: string) => f.endsWith(".md"));
        for (const bf of brandFiles) {
          const fullPath = pathMod.join(brandDir, bf);
          const stat = fs.statSync(fullPath);
          if (stat.size > 0) {
            contextSources.push({ type: "brand", label: bf, path: `brand_context/${bf}` });
          }
        }
      } catch { /* ignore */ }
    }

    // Build prompt — detect special task types first
    let prompt = "";
    const isSlashCommand = task.description?.match(/^Run \/[\w:.-]+/);
    const taskRow = db.prepare("SELECT gsdStep FROM tasks WHERE id = ?").get(taskId) as { gsdStep: string | null } | undefined;
    const gsdStep = taskRow?.gsdStep;
    const isTopLevelParent = !task.parentId;

    if (isSlashCommand) {
      // Slash command task — pass the description as-is (e.g. "Run /start-here", "Run /gsd:plan-phase 6")
      prompt = task.description!;
    } else if (gsdStep) {
      const gsdPrompts: Record<string, string> = {
        discuss: "Run /gsd:discuss-phase for the current phase. Ask the user interactive questions — do NOT use --auto. Wait for their replies.",
        plan: "Run /gsd:plan-phase for the current phase.",
        execute: "Run /gsd:execute-phase for the current phase.",
        verify: "Run /gsd:verify-work for the current phase.",
      };
      prompt = gsdPrompts[gsdStep] || task.title;
    } else if (task.level === "project" && isTopLevelParent) {
      // Project scoping — follow the Level 2 process from CLAUDE.md
      prompt = this.buildProjectScopingPrompt(task);
    } else if (task.level === "gsd" && isTopLevelParent) {
      // GSD project — run /gsd:new-project which handles interviews, research, and roadmap creation
      prompt = `Run /gsd:new-project "${task.title}"${task.description ? `\n\nContext from user: ${task.description}` : ""}`;
    } else {
      if (task.projectSlug) {
        const briefPath = pathMod.join(cwd, "projects", "briefs", task.projectSlug, "brief.md");
        try {
          if (fs.existsSync(briefPath)) {
            const briefContent = fs.readFileSync(briefPath, "utf-8");
            prompt += `[Project Context: ${task.projectSlug}]\n${briefContent}\n\n---\n\n`;
            contextSources.push({ type: "project", label: `brief.md (${task.projectSlug})`, path: `projects/briefs/${task.projectSlug}/brief.md` });
          }
        } catch { /* proceed without context */ }
      }
      prompt += task.description ? `Task: ${task.title}\n\n${task.description}` : task.title;
    }

    // Inject session activity summary for wrap-up and session-aware tasks
    const needsSessionContext = this.isSessionContextTask(task);
    console.log(`[process-manager] Session context check for "${task.title}" (desc: "${task.description?.slice(0, 50)}"): ${needsSessionContext}`);
    if (needsSessionContext) {
      const sessionSummary = this.buildSessionSummary(cwd, taskId);
      console.log(`[process-manager] Session summary length: ${sessionSummary.length} chars`);
      prompt = `IMPORTANT: The following session activity summary contains the complete record of what was done today across ALL tasks in the Command Centre. Use this as your primary source of truth for the session wrap-up — do NOT rely solely on git status or your own conversation history, as you are running in a fresh context window without visibility into other task conversations.\n\n${sessionSummary}\nNow proceed with the task:\n\n${prompt}`;
      contextSources.push({ type: "system", label: "Session Activity Summary" });
    }

    // Persist context sources to DB
    if (contextSources.length > 0) {
      db.prepare("UPDATE tasks SET contextSources = ? WHERE id = ?")
        .run(JSON.stringify(contextSources), taskId);
    }

    // Spawn the initial turn
    this.spawnClaudeTurn(taskId, prompt, cwd, false);
  }

  /**
   * Reply to a task that's waiting for user input.
   * Spawns a new Claude process with --continue to continue the conversation.
   *
   * Handles two states:
   * 1. Process already exited → task is in waitingForReply set
   * 2. Process still running but question detected → session.pendingQuestion is true
   *    (race condition: UI shows reply input before process exits)
   */
  async replyToTask(taskId: string, message: string): Promise<boolean> {
    const session = this.sessions.get(taskId);
    const isWaiting = this.waitingForReply.has(taskId);
    const isPendingQuestion = session?.pendingQuestion === true;

    console.log(`[process-manager] replyToTask(${taskId.slice(0, 8)}): isWaiting=${isWaiting}, hasSession=${!!session}, pendingQuestion=${isPendingQuestion}, sessionCount=${this.sessions.size}, waitingCount=${this.waitingForReply.size}`);
    console.log(`[process-manager] replyToTask sessions:`, [...this.sessions.keys()].map(k => k.slice(0, 8)));
    console.log(`[process-manager] replyToTask waitingForReply:`, [...this.waitingForReply].map(k => k.slice(0, 8)));

    // Also check if the DB says needsInput — if so, trust the DB over in-memory state
    // (handles HMR or other edge cases where in-memory state was lost)
    if (!isWaiting && !isPendingQuestion) {
      const db = getDb();
      const dbTask = db.prepare("SELECT needsInput FROM tasks WHERE id = ?").get(taskId) as { needsInput: number } | undefined;
      const dbNeedsInput = dbTask?.needsInput === 1;
      console.log(`[process-manager] In-memory state empty — DB needsInput=${dbNeedsInput}`);

      if (!dbNeedsInput) {
        console.warn(`[process-manager] Task ${taskId} is not waiting for a reply (both in-memory and DB)`);
        return false;
      }

      // DB says needsInput but in-memory state is gone — proceed anyway
      console.log(`[process-manager] DB says needsInput=true, proceeding with reply despite empty in-memory state`);
    }

    // If the process is still running (user replied before process exited),
    // kill it — we'll spawn a new --continue process
    if (session) {
      console.log(`[process-manager] Killing running process for ${taskId} before reply`);
      try { session.proc.kill("SIGTERM"); } catch { /* already gone */ }
      this.sessions.delete(taskId);
    }

    // The reply route already persisted the log entry and updated the DB.
    // Just kill any running process and spawn the resume turn.
    this.waitingForReply.delete(taskId);

    const db = getDb();
    const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(taskId) as Task | undefined;
    if (!task) return false;

    const config = getConfig();
    const cwd = task.clientId ? getClientAgenticOsDir(task.clientId) : config.agenticOsDir;

    // If replying to a task already in review/done, mark so handleTurnComplete
    // knows to graduate to "done" instead of looping back to "review"
    const wasInReview = task.status === "review" || task.status === "done";
    this.spawnClaudeTurn(taskId, message, cwd, true, wasInReview);

    return true;
  }

  /**
   * Cancel a running or waiting task.
   */
  async cancelTask(taskId: string): Promise<void> {
    const session = this.sessions.get(taskId);
    if (session) {
      session.proc.kill("SIGTERM");
      const killTimer = setTimeout(() => {
        try { session.proc.kill("SIGKILL"); } catch { /* gone */ }
      }, 5000);
      session.proc.on("close", () => clearTimeout(killTimer));
      this.sessions.delete(taskId);
    }

    this.waitingForReply.delete(taskId);
    this.lastProgressEmit.delete(taskId);

    await fileWatcher.stopWatching(taskId);

    const db = getDb();
    const now = new Date().toISOString();
    db.prepare(
      "UPDATE tasks SET status = ?, updatedAt = ?, activityLabel = NULL, costUsd = NULL, tokensUsed = NULL, durationMs = NULL, errorMessage = NULL, startedAt = NULL, completedAt = NULL, needsInput = 0 WHERE id = ?"
    ).run("backlog", now, taskId);

    const updated = db.prepare("SELECT * FROM tasks WHERE id = ?").get(taskId) as Task;
    emitTaskEvent({ type: "task:status", task: this.normalizeTask(updated), timestamp: now });
  }

  // ── Prompt builders for interactive scoping ─────────────────────

  private buildProjectScopingPrompt(task: Task): string {
    const userContext = task.description ? `\n\nContext from user: ${task.description}` : "";
    return `Scope the project "${task.title}" as a Level 2 planned project following the process in CLAUDE.md.${userContext}

Run the interactive scoping conversation — ask about goal, deliverables, acceptance criteria, timeline, and constraints. Ask one question at a time and wait for the user's reply.

Once scoping is complete, save the brief to projects/briefs/${this.slugify(task.title)}/brief.md with proper frontmatter.

Then output the key deliverables as subtasks in this format at the end of your final message:

\`\`\`subtasks
[
  {"title": "Deliverable name", "description": "What this deliverable involves and its acceptance criteria"}
]
\`\`\`

Keep subtasks high-level — one per major deliverable, not every granular step.`;
  }

  private slugify(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  /**
   * Build a session activity summary for context-aware tasks (e.g. wrap-up).
   * Pulls from: today's tasks in DB, task logs, git history, and memory file.
   */
  private buildSessionSummary(cwd: string, currentTaskId: string): string {
    const db = getDb();
    const fs = require("fs") as typeof import("fs");
    const pathMod = require("path") as typeof import("path");
    const { execSync } = require("child_process") as typeof import("child_process");

    const todayStr = new Date().toISOString().slice(0, 10);
    const parts: string[] = ["[Session Activity Summary]", ""];

    // 1. Today's tasks from DB (exclude the current wrap-up task)
    const todayTasks = db.prepare(
      `SELECT id, title, status, level, costUsd, tokensUsed, durationMs, startedAt, completedAt, projectSlug
       FROM tasks
       WHERE date(createdAt) = ? AND id != ?
       ORDER BY createdAt ASC`
    ).all(todayStr, currentTaskId) as Array<{
      id: string; title: string; status: string; level: string;
      costUsd: number | null; tokensUsed: number | null; durationMs: number | null;
      startedAt: string | null; completedAt: string | null; projectSlug: string | null;
    }>;

    // Also include tasks from earlier that were active today
    const activeTodayTasks = db.prepare(
      `SELECT id, title, status, level, costUsd, tokensUsed, durationMs, startedAt, completedAt, projectSlug
       FROM tasks
       WHERE date(createdAt) < ? AND id != ?
         AND (date(startedAt) = ? OR date(completedAt) = ? OR date(updatedAt) = ?)
       ORDER BY updatedAt ASC`
    ).all(todayStr, currentTaskId, todayStr, todayStr, todayStr) as typeof todayTasks;

    const allTasks = [...activeTodayTasks, ...todayTasks];

    if (allTasks.length > 0) {
      parts.push("## Tasks Today", "");
      for (const t of allTasks) {
        const cost = t.costUsd ? ` ($${t.costUsd.toFixed(2)})` : "";
        const project = t.projectSlug ? ` [${t.projectSlug}]` : "";
        parts.push(`- **${t.title}**${project} — ${t.status}${cost}`);

        // Get skills invoked by this task
        const skillMentions = db.prepare(
          `SELECT content FROM task_logs
           WHERE taskId = ? AND type = 'text'
             AND (content LIKE '%/mkt-%' OR content LIKE '%/str-%' OR content LIKE '%/viz-%'
               OR content LIKE '%/ops-%' OR content LIKE '%/tool-%' OR content LIKE '%/meta-%'
               OR content LIKE '%Running skill%' OR content LIKE '%Invoking skill%'
               OR content LIKE '%skill:%')
           LIMIT 5`
        ).all(t.id) as Array<{ content: string }>;

        const skills = new Set<string>();
        for (const s of skillMentions) {
          const matches = s.content.match(/\/(mkt|str|viz|ops|tool|meta)-[\w-]+/g);
          if (matches) matches.forEach((m) => skills.add(m));
        }
        // Also check the task description for skill references
        if (t.title) {
          const titleMatches = t.title.match(/\/(mkt|str|viz|ops|tool|meta)-[\w-]+/g);
          if (titleMatches) titleMatches.forEach((m) => skills.add(m));
        }
        if (skills.size > 0) {
          parts.push(`  Skills: ${[...skills].join(", ")}`);
        }

        // Get condensed activity: text entries and questions
        const logs = db.prepare(
          `SELECT type, content, timestamp FROM task_logs
           WHERE taskId = ? AND type IN ('text', 'question', 'user_reply')
           ORDER BY timestamp ASC`
        ).all(t.id) as Array<{ type: string; content: string; timestamp: string }>;

        if (logs.length > 0) {
          const keyLogs = logs.filter((l) =>
            l.type === "question" || l.type === "user_reply" || l.content.length > 50
          );
          const condensed = keyLogs.slice(-6);
          for (const log of condensed) {
            const prefix = log.type === "question" ? "  Claude asked" : log.type === "user_reply" ? "  User replied" : "  Claude";
            const content = log.content.length > 200 ? log.content.slice(0, 200) + "…" : log.content;
            parts.push(`${prefix}: ${content}`);
          }
        }

        // Get output files
        const outputs = db.prepare(
          `SELECT fileName FROM task_outputs WHERE taskId = ?`
        ).all(t.id) as Array<{ fileName: string }>;
        if (outputs.length > 0) {
          parts.push(`  Outputs: ${outputs.map((o) => o.fileName).join(", ")}`);
        }
        parts.push("");
      }
    }

    // 2. Git history — commits from today
    try {
      const gitLog = execSync(
        `git log --since="today 00:00" --format="%h %s" --no-merges 2>/dev/null`,
        { cwd, encoding: "utf-8", timeout: 5000 }
      ).trim();
      if (gitLog) {
        parts.push("## Git Commits Today", "", gitLog, "");
      }
    } catch { /* no git or no commits */ }

    // 3. Unstaged changes summary
    try {
      const gitDiffStat = execSync(
        `git diff --stat HEAD 2>/dev/null`,
        { cwd, encoding: "utf-8", timeout: 5000 }
      ).trim();
      if (gitDiffStat) {
        parts.push("## Uncommitted Changes", "", gitDiffStat, "");
      }
    } catch { /* ignore */ }

    // 4. Today's memory file
    const memoryPath = pathMod.join(cwd, "context", "memory", `${todayStr}.md`);
    try {
      if (fs.existsSync(memoryPath)) {
        const memoryContent = fs.readFileSync(memoryPath, "utf-8").trim();
        if (memoryContent.length > 0) {
          parts.push("## Today's Memory File", "", memoryContent, "");
        }
      }
    } catch { /* ignore */ }

    parts.push("---", "");
    return parts.join("\n");
  }

  /**
   * Check if a task needs session context injected into its prompt.
   */
  private isSessionContextTask(task: Task): boolean {
    const title = (task.title || "").toLowerCase();
    const desc = (task.description || "").toLowerCase();
    return (
      title.includes("wrap") ||
      title.includes("session") ||
      desc.includes("/wrap-up") ||
      desc.includes("meta-wrap-up") ||
      desc.includes("/gsd:session-report") ||
      desc.includes("session summary") ||
      desc.includes("what did we do") ||
      desc.includes("what have we done")
    );
  }

  // ── GSD phase sync (reads .planning/ROADMAP.md) ────────────────

  private async autoSyncPhases(parentTaskId: string): Promise<void> {
    try {
      console.log(`[process-manager] Auto-syncing GSD phases for ${parentTaskId.slice(0, 8)}`);
      const res = await fetch(`http://localhost:${process.env.PORT || 3000}/api/tasks/${parentTaskId}/sync-phases`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        console.log(`[process-manager] Synced ${data.created} phase tasks (${data.phases} phases)`);
      } else {
        console.warn(`[process-manager] Phase sync failed: ${res.status}`);
      }
    } catch (err) {
      console.error(`[process-manager] Phase sync error:`, err);
    }
  }

  // ── Subtask extraction from structured output ──────────────────

  private extractAndCreateSubtasks(parentTaskId: string, parentTask: Task): void {
    const db = getDb();
    const now = new Date().toISOString();

    // Scan log entries for ```subtasks JSON block
    const logs = db.prepare(
      "SELECT content FROM task_logs WHERE taskId = ? AND type = 'text' ORDER BY rowid DESC LIMIT 10"
    ).all(parentTaskId) as Array<{ content: string }>;

    let subtaskJson: string | null = null;
    for (const log of logs) {
      const match = log.content.match(/```subtasks\s*\n([\s\S]*?)```/);
      if (match) {
        subtaskJson = match[1].trim();
        break;
      }
    }

    if (!subtaskJson) {
      console.log(`[process-manager] No subtask block found for ${parentTaskId.slice(0, 8)}`);
      return;
    }

    let subtasks: Array<{ title: string; description?: string; phaseNumber?: number; gsdStep?: string }>;
    try {
      subtasks = JSON.parse(subtaskJson);
      if (!Array.isArray(subtasks) || subtasks.length === 0) return;
    } catch (err) {
      console.error(`[process-manager] Failed to parse subtask JSON for ${parentTaskId.slice(0, 8)}:`, err);
      return;
    }

    console.log(`[process-manager] Creating ${subtasks.length} subtasks for ${parentTaskId.slice(0, 8)}`);

    // Get min columnOrder to insert subtasks in order
    const minOrder = db.prepare(
      "SELECT COALESCE(MIN(columnOrder), 1) as minOrder FROM tasks WHERE parentId = ?"
    ).get(parentTaskId) as { minOrder: number };
    let order = minOrder.minOrder - subtasks.length;

    for (const sub of subtasks) {
      if (!sub.title || typeof sub.title !== "string") continue;

      const childLevel = parentTask.level === "gsd" ? "gsd" : "task";
      const childId = crypto.randomUUID();
      const child: Task = {
        id: childId,
        title: sub.title.trim(),
        description: sub.description?.trim() || null,
        status: "backlog",
        level: childLevel as Task["level"],
        parentId: parentTaskId,
        projectSlug: parentTask.projectSlug,
        columnOrder: order++,
        createdAt: now,
        updatedAt: now,
        costUsd: null,
        tokensUsed: null,
        durationMs: null,
        activityLabel: null,
        errorMessage: null,
        startedAt: null,
        completedAt: null,
        clientId: parentTask.clientId,
        needsInput: false,
        phaseNumber: sub.phaseNumber ?? null,
        gsdStep: (sub.gsdStep as Task["gsdStep"]) ?? null,
        contextSources: null,
        cronJobSlug: null,
      };

      db.prepare(
        `INSERT INTO tasks (id, title, description, status, level, parentId, projectSlug, columnOrder, createdAt, updatedAt, costUsd, tokensUsed, durationMs, activityLabel, errorMessage, startedAt, completedAt, clientId, needsInput, phaseNumber, gsdStep)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).run(
        child.id, child.title, child.description, child.status, child.level,
        child.parentId, child.projectSlug, child.columnOrder, child.createdAt,
        child.updatedAt, child.costUsd, child.tokensUsed, child.durationMs,
        child.activityLabel, child.errorMessage, child.startedAt, child.completedAt,
        child.clientId, 0, child.phaseNumber, child.gsdStep
      );

      emitTaskEvent({ type: "task:created", task: child, timestamp: now });
    }

    console.log(`[process-manager] Created ${subtasks.length} subtasks for parent ${parentTaskId.slice(0, 8)}`);
  }

  getActiveCount(): number {
    return this.sessions.size;
  }

  isWaitingForReply(taskId: string): boolean {
    return this.waitingForReply.has(taskId);
  }

  cleanup(): void {
    for (const [taskId, session] of this.sessions) {
      console.log(`[process-manager] Cleaning up session for task ${taskId}`);
      try { session.proc.kill("SIGTERM"); } catch { /* gone */ }
    }
    this.sessions.clear();
    this.waitingForReply.clear();
    this.lastProgressEmit.clear();
    fileWatcher.cleanupAll();
  }

  getLogEntries(taskId: string): LogEntry[] {
    const db = getDb();
    const rows = db.prepare(
      "SELECT id, type, timestamp, content, toolName, toolArgs, toolResult, isCollapsed FROM task_logs WHERE taskId = ? ORDER BY rowid ASC"
    ).all(taskId) as Array<{
      id: string; type: string; timestamp: string; content: string;
      toolName: string | null; toolArgs: string | null; toolResult: string | null; isCollapsed: number;
    }>;

    return rows.map((row) => ({
      id: row.id,
      type: row.type as LogEntry["type"],
      timestamp: row.timestamp,
      content: row.content,
      ...(row.toolName ? { toolName: row.toolName } : {}),
      ...(row.toolArgs ? { toolArgs: row.toolArgs } : {}),
      ...(row.toolResult ? { toolResult: row.toolResult } : {}),
      ...(row.isCollapsed ? { isCollapsed: true } : {}),
    }));
  }

  /**
   * Public entry point to spawn a --continue turn.
   * Used by the reply route as a fallback when in-memory state is stale.
   */
  async spawnContinueTurn(taskId: string, message: string, resumedFromReview: boolean = false): Promise<void> {
    const db = getDb();
    const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(taskId) as Task | undefined;
    if (!task) throw new Error(`Task ${taskId} not found`);

    const config = getConfig();
    const cwd = task.clientId ? getClientAgenticOsDir(task.clientId) : config.agenticOsDir;

    this.waitingForReply.delete(taskId);
    this.spawnClaudeTurn(taskId, message, cwd, true, resumedFromReview);
  }

  // ── Private: spawn a single Claude CLI turn ──────────────────────

  private spawnClaudeTurn(
    taskId: string,
    prompt: string,
    cwd: string,
    isContinuation: boolean,
    resumedFromReview: boolean = false,
  ): void {
    const cleanEnv = { ...process.env };
    delete cleanEnv.CLAUDECODE;

    // Build args
    const args = [
      "--output-format", "stream-json",
      "--verbose",
      "-p", prompt,
      "--permission-mode", "default",
    ];

    // Pre-approve safe read-only tools
    args.push("--allowedTools", "Read,Glob,Grep,WebSearch,WebFetch");

    if (isContinuation) {
      // Use --resume with the stored session ID to continue the correct conversation.
      // Falls back to --continue if no session ID is stored (shouldn't happen, but safe).
      const db = getDb();
      const row = db.prepare("SELECT claudeSessionId FROM tasks WHERE id = ?").get(taskId) as { claudeSessionId: string | null } | undefined;
      const sessionId = row?.claudeSessionId;

      if (sessionId) {
        args.push("--resume", sessionId);
        console.log(`[process-manager] Using --resume ${sessionId} for ${taskId.slice(0, 8)}`);
      } else {
        args.push("--continue");
        console.warn(`[process-manager] No claudeSessionId for ${taskId.slice(0, 8)}, falling back to --continue`);
      }
    }

    console.log(`[process-manager] Spawning${isContinuation ? " (resume)" : ""}: claude -p "${prompt.slice(0, 80)}..."`);
    console.log(`[process-manager] CWD: ${cwd}`);

    let proc: ChildProcess;
    try {
      proc = spawn("claude", args, {
        cwd,
        stdio: ["pipe", "pipe", "pipe"],
        env: cleanEnv,
      });
      console.log(`[process-manager] Spawn succeeded, pid=${proc.pid}`);

      // Close stdin immediately — in -p mode the prompt is in the flag.
      // For replies, we use --continue with a new process instead of stdin.
      if (proc.stdin) {
        proc.stdin.end();
      }
    } catch (err) {
      console.error(`[process-manager] Spawn failed:`, err);
      this.handleSpawnError(taskId, err);
      return;
    }

    // Carry forward accumulated metrics from previous turns
    const prevSession = this.sessions.get(taskId);
    const session: SessionEntry = {
      proc,
      pendingQuestion: false,
      totalCostUsd: prevSession?.totalCostUsd ?? 0,
      totalTokensUsed: prevSession?.totalTokensUsed ?? 0,
      totalDurationMs: prevSession?.totalDurationMs ?? 0,
      resumedFromReview,
    };
    this.sessions.set(taskId, session);

    const parser = new ClauseOutputParserWithTurnAwareness(taskId, session, this);

    proc.on("error", (err) => {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") {
        this.handleTaskError(taskId, "Claude CLI not found. Ensure 'claude' is installed and in your PATH.");
      } else {
        this.handleTaskError(taskId, `Process error: ${err.message}`);
      }
    });

    if (proc.stdout) {
      const rl = createInterface({ input: proc.stdout });
      rl.on("line", (line) => {
        console.log(`[process-manager] stdout(${taskId.slice(0, 8)}): ${line.slice(0, 120)}`);
        parser.feedLine(line);
      });
    }

    let stderrBuffer = "";
    if (proc.stderr) {
      proc.stderr.on("data", (chunk: Buffer) => {
        const text = chunk.toString();
        console.log(`[process-manager] stderr(${taskId.slice(0, 8)}): ${text.trim().slice(0, 200)}`);
        stderrBuffer += text;
      });
    }

    proc.on("close", (code) => {
      // Check if this process is still the current one for this task.
      // If not (e.g., replyToTask killed it and spawned a new one), ignore this close.
      const currentSession = this.sessions.get(taskId);
      if (currentSession && currentSession.proc !== proc) {
        console.log(`[process-manager] Stale close for ${taskId.slice(0, 8)} (replaced by new turn) — ignoring`);
        return;
      }

      // If the parser already fired onComplete/onError, it handled cleanup — skip
      if (parser.isCompleted) {
        if (currentSession?.proc === proc) {
          this.sessions.delete(taskId);
        }
        this.lastProgressEmit.delete(taskId);
        return;
      }

      // No current session means it was killed (e.g., by replyToTask or cancelTask)
      if (!currentSession) {
        console.log(`[process-manager] Close for ${taskId.slice(0, 8)} with no active session — ignoring`);
        this.lastProgressEmit.delete(taskId);
        return;
      }

      // Parser didn't fire — handle based on exit code
      // NOTE: Do NOT delete the session yet — handleTurnComplete/handleTaskError need it
      if (code !== 0) {
        const errorMsg = stderrBuffer.trim()
          ? `Claude CLI exited with code ${code}: ${stderrBuffer.trim().slice(0, 500)}`
          : `Claude CLI exited with code ${code}`;
        this.handleTaskError(taskId, errorMsg);
      } else {
        this.handleTurnComplete(taskId, { costUsd: 0, tokensUsed: 0, durationMs: 0 });
      }

      this.lastProgressEmit.delete(taskId);
    });
  }

  // ── Internal event handlers (called by parser wrapper) ───────────

  handleProgress(
    taskId: string,
    data: { costUsd?: number; tokensUsed?: number; activityLabel?: string }
  ): void {
    const now = Date.now();
    const lastEmit = this.lastProgressEmit.get(taskId) || 0;
    if (now - lastEmit < 1000) return;
    this.lastProgressEmit.set(taskId, now);

    const db = getDb();
    const updates: string[] = ["updatedAt = ?"];
    const values: unknown[] = [new Date().toISOString()];

    if (data.costUsd !== undefined) {
      updates.push("costUsd = ?");
      values.push(data.costUsd);
    }
    if (data.tokensUsed !== undefined) {
      updates.push("tokensUsed = ?");
      values.push(data.tokensUsed);
    }
    if (data.activityLabel !== undefined) {
      updates.push("activityLabel = ?");
      values.push(data.activityLabel);
    }

    values.push(taskId);
    db.prepare(`UPDATE tasks SET ${updates.join(", ")} WHERE id = ?`).run(...values);

    const updated = db.prepare("SELECT * FROM tasks WHERE id = ?").get(taskId) as Task;
    emitTaskEvent({ type: "task:progress", task: this.normalizeTask(updated), timestamp: new Date().toISOString() });
  }

  /**
   * Called when a single Claude turn completes (result message received).
   * If a question was asked during this turn, the task stays in "running"
   * with needsInput — waiting for user to reply via --continue.
   * Otherwise, the task is finalised to "review".
   */
  handleTurnComplete(
    taskId: string,
    data: { costUsd: number; tokensUsed: number; durationMs: number; sessionId?: string }
  ): void {
    const session = this.sessions.get(taskId);

    // Accumulate metrics across turns
    const totalCost = (session?.totalCostUsd ?? 0) + data.costUsd;
    const totalTokens = (session?.totalTokensUsed ?? 0) + data.tokensUsed;
    const totalDuration = (session?.totalDurationMs ?? 0) + data.durationMs;

    const db = getDb();
    const now = new Date().toISOString();

    // Persist Claude CLI session ID for --resume support
    if (data.sessionId) {
      db.prepare("UPDATE tasks SET claudeSessionId = ? WHERE id = ?").run(data.sessionId, taskId);
      console.log(`[process-manager] Stored claudeSessionId=${data.sessionId} for ${taskId.slice(0, 8)}`);
    }

    // Check if a question was asked during this turn
    const questionAsked = session?.pendingQuestion ?? false;
    console.log(`[process-manager] handleTurnComplete(${taskId.slice(0, 8)}): questionAsked=${questionAsked}, hasSession=${!!session}`);

    if (questionAsked) {
      // Turn ended but Claude asked a question — keep task running, wait for reply
      console.log(`[process-manager] Turn complete with pending question for ${taskId} — adding to waitingForReply`);

      db.prepare(
        "UPDATE tasks SET updatedAt = ?, costUsd = ?, tokensUsed = ?, durationMs = ?, activityLabel = ?, needsInput = 1 WHERE id = ?"
      ).run(now, totalCost, totalTokens, totalDuration, "Waiting for input...", taskId);

      this.waitingForReply.add(taskId);
      this.sessions.delete(taskId);

      const updated = db.prepare("SELECT * FROM tasks WHERE id = ?").get(taskId) as Task;
      emitTaskEvent({ type: "task:status", task: this.normalizeTask(updated), timestamp: now });
    } else {
      // No question — task is done.
      // If this was a follow-up reply on an already-reviewed task, graduate to "done".
      // Otherwise, move to "review" for the user to check.
      const finalStatus = (session?.resumedFromReview) ? "done" : "review";
      console.log(`[process-manager] Task ${taskId} completed — moving to ${finalStatus}${session?.resumedFromReview ? " (follow-up on reviewed task)" : ""}`);

      fileWatcher.stopWatching(taskId).catch(() => {});

      db.prepare(
        "UPDATE tasks SET status = ?, completedAt = ?, updatedAt = ?, costUsd = ?, tokensUsed = ?, durationMs = ?, activityLabel = NULL, needsInput = 0 WHERE id = ?"
      ).run(finalStatus, now, now, totalCost, totalTokens, totalDuration, taskId);

      this.sessions.delete(taskId);
      this.waitingForReply.delete(taskId);

      const updated = db.prepare("SELECT * FROM tasks WHERE id = ?").get(taskId) as Task;
      emitTaskEvent({ type: "task:status", task: this.normalizeTask(updated), timestamp: now });

      // Auto-create subtasks for parent tasks on completion
      if (!updated.parentId) {
        if (updated.level === "gsd") {
          // GSD: sync phases from .planning/ROADMAP.md (created by /gsd:new-project)
          this.autoSyncPhases(taskId);
        } else if (updated.level === "project") {
          // Project: extract deliverable subtasks from the conversation output
          this.extractAndCreateSubtasks(taskId, updated);
        }
      }
    }

    this.lastProgressEmit.delete(taskId);
  }

  handleQuestion(taskId: string, questionText: string): void {
    const session = this.sessions.get(taskId);
    if (session) {
      session.pendingQuestion = true;
    }
    console.log(`[process-manager] handleQuestion(${taskId.slice(0, 8)}): pendingQuestion=${session?.pendingQuestion}, hasSession=${!!session}`);

    const db = getDb();
    const now = new Date().toISOString();

    db.prepare("UPDATE tasks SET updatedAt = ?, activityLabel = ?, needsInput = 1 WHERE id = ?")
      .run(now, "Waiting for input...", taskId);

    const updated = db.prepare("SELECT * FROM tasks WHERE id = ?").get(taskId) as Task;
    emitTaskEvent({ type: "task:question", task: this.normalizeTask(updated), timestamp: now, questionText });

    this.addLogEntry(taskId, {
      id: crypto.randomUUID(),
      type: "question",
      timestamp: now,
      content: questionText,
    });
  }

  handleTaskError(taskId: string, errorMessage: string): void {
    fileWatcher.stopWatching(taskId).catch(() => {});

    const db = getDb();
    const now = new Date().toISOString();

    // Errors stay in "running" with needsInput flag
    db.prepare(
      "UPDATE tasks SET updatedAt = ?, errorMessage = ?, activityLabel = ?, needsInput = 1 WHERE id = ?"
    ).run(now, errorMessage, "Error — needs attention", taskId);

    this.waitingForReply.add(taskId);
    this.sessions.delete(taskId);
    this.lastProgressEmit.delete(taskId);

    const updated = db.prepare("SELECT * FROM tasks WHERE id = ?").get(taskId) as Task;
    emitTaskEvent({ type: "task:status", task: this.normalizeTask(updated), timestamp: now });
  }

  addLogEntry(taskId: string, entry: LogEntry): void {
    const db = getDb();
    db.prepare(
      "INSERT INTO task_logs (id, taskId, type, timestamp, content, toolName, toolArgs, toolResult, isCollapsed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).run(
      entry.id, taskId, entry.type, entry.timestamp, entry.content,
      entry.toolName ?? null, entry.toolArgs ?? null, entry.toolResult ?? null,
      entry.isCollapsed ? 1 : 0
    );

    const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(taskId) as Task | undefined;
    if (task) {
      emitTaskEvent({
        type: "task:log",
        task: this.normalizeTask(task),
        timestamp: entry.timestamp,
        logEntry: entry,
      });
    }
  }

  private handleSpawnError(taskId: string, err: unknown): void {
    const message = err instanceof Error ? err.message : "Unknown spawn error";
    this.handleTaskError(taskId, `Failed to start Claude CLI: ${message}`);
  }

  normalizeTask(row: Task): Task {
    return { ...row, needsInput: Boolean(row.needsInput) };
  }
}

/**
 * Thin wrapper around ClaudeOutputParser that routes callbacks
 * to the ProcessManager's methods (which are now turn-aware).
 */
class ClauseOutputParserWithTurnAwareness {
  private parser: ClaudeOutputParser;

  constructor(
    private taskId: string,
    private session: SessionEntry,
    private pm: ProcessManager,
  ) {
    this.parser = new ClaudeOutputParser({
      onProgress: (data) => pm.handleProgress(taskId, data),
      onComplete: (data) => pm.handleTurnComplete(taskId, data),
      onError: (error) => pm.handleTaskError(taskId, error),
      onLogEntry: (entry) => pm.addLogEntry(taskId, entry),
      onQuestion: (questionText) => pm.handleQuestion(taskId, questionText),
    });
  }

  feedLine(line: string): void {
    this.parser.feedLine(line);
  }

  get isCompleted(): boolean {
    return this.parser.isCompleted;
  }
}

// Singleton instance — use globalThis to survive Next.js HMR in dev mode
const globalForPM = globalThis as unknown as { __processManager?: ProcessManager };
export const processManager = globalForPM.__processManager ?? new ProcessManager();
if (process.env.NODE_ENV !== "production") {
  globalForPM.__processManager = processManager;
}
