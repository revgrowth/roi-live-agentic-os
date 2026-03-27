import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { emitTaskEvent } from "@/lib/event-bus";
import type { Task } from "@/types/task";

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    const { sessionId, cwd, projectSlug } = body as {
      sessionId: string;
      cwd?: string;
      projectSlug?: string | null;
    };

    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json(
        { error: "sessionId is required" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    // Check if a task with this sessionId already exists
    const existing = db
      .prepare("SELECT * FROM tasks WHERE claudeSessionId = ?")
      .get(sessionId) as Task | undefined;

    if (existing) {
      // Resume — update status back to running
      db.prepare(
        "UPDATE tasks SET status = 'running', updatedAt = ?, startedAt = COALESCE(startedAt, ?) WHERE id = ?"
      ).run(now, now, existing.id);

      const updated = db
        .prepare("SELECT * FROM tasks WHERE id = ?")
        .get(existing.id) as Task;
      emitTaskEvent({
        type: "task:status",
        task: { ...updated, needsInput: Boolean(updated.needsInput) },
        timestamp: now,
      });

      return NextResponse.json({ taskId: existing.id, isNew: false });
    }

    // Create new task
    const title = projectSlug
      ? `${projectSlug} session`
      : cwd
        ? cwd.split("/").pop() || "Terminal session"
        : "Terminal session";

    // Get min columnOrder in running column
    const minOrder = db
      .prepare(
        "SELECT COALESCE(MIN(columnOrder), 1) as minOrder FROM tasks WHERE status = 'running'"
      )
      .get() as { minOrder: number };

    const id = crypto.randomUUID();
    const task: Task = {
      id,
      title,
      description: cwd ? `Working directory: ${cwd}` : null,
      status: "running",
      level: "task",
      parentId: null,
      projectSlug: projectSlug || null,
      columnOrder: minOrder.minOrder - 1,
      createdAt: now,
      updatedAt: now,
      costUsd: null,
      tokensUsed: null,
      durationMs: null,
      activityLabel: "Session started",
      errorMessage: null,
      startedAt: now,
      completedAt: null,
      clientId: null,
      needsInput: false,
      phaseNumber: null,
      gsdStep: null,
      contextSources: null,
      cronJobSlug: null,
      claudeSessionId: sessionId,
    };

    db.prepare(
      `INSERT INTO tasks (id, title, description, status, level, parentId, projectSlug, columnOrder, createdAt, updatedAt, costUsd, tokensUsed, durationMs, activityLabel, errorMessage, startedAt, completedAt, clientId, needsInput, phaseNumber, gsdStep, contextSources, cronJobSlug, claudeSessionId)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      task.id, task.title, task.description, task.status, task.level,
      task.parentId, task.projectSlug, task.columnOrder, task.createdAt,
      task.updatedAt, task.costUsd, task.tokensUsed, task.durationMs,
      task.activityLabel, task.errorMessage, task.startedAt, task.completedAt,
      task.clientId, task.needsInput ? 1 : 0, task.phaseNumber, task.gsdStep,
      task.contextSources, task.cronJobSlug, task.claudeSessionId
    );

    emitTaskEvent({ type: "task:created", task, timestamp: now });

    return NextResponse.json({ taskId: id, isNew: true }, { status: 201 });
  } catch (error) {
    console.error("POST /api/tasks/sync-session error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
