import { NextRequest, NextResponse } from "next/server";
import { getCronJob } from "@/lib/cron-service";
import { getDb } from "@/lib/db";
import { emitTaskEvent } from "@/lib/event-bus";
import type { Task } from "@/types/task";

/**
 * POST /api/cron/[name]/run
 * Run a cron job immediately by creating a task from its prompt and queuing it.
 */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const job = getCronJob(name);

    if (!job) {
      return NextResponse.json({ error: "Cron job not found" }, { status: 404 });
    }

    const db = getDb();
    const now = new Date().toISOString();

    // Get min columnOrder so the new task sorts to top of backlog
    const minOrder = db
      .prepare(
        "SELECT COALESCE(MIN(columnOrder), 1) as minOrder FROM tasks WHERE status = 'backlog'"
      )
      .get() as { minOrder: number };

    const task: Task = {
      id: crypto.randomUUID(),
      title: `${job.name} (manual run)`,
      description: job.prompt,
      status: "queued",
      level: "task",
      parentId: null,
      projectSlug: null,
      columnOrder: minOrder.minOrder - 1,
      createdAt: now,
      updatedAt: now,
      costUsd: null,
      tokensUsed: null,
      durationMs: null,
      activityLabel: "Queued — manual trigger",
      errorMessage: null,
      startedAt: null,
      completedAt: null,
      clientId: null,
      needsInput: false,
      phaseNumber: null,
      gsdStep: null,
      contextSources: null,
      cronJobSlug: job.slug,
      claudeSessionId: null,
      permissionMode: "default",
      lastReplyAt: null,
      goalGroup: null,
    };

    db.prepare(
      `INSERT INTO tasks (id, title, description, status, level, parentId, projectSlug, columnOrder, createdAt, updatedAt, costUsd, tokensUsed, durationMs, activityLabel, errorMessage, startedAt, completedAt, clientId, needsInput, phaseNumber, gsdStep, cronJobSlug)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      task.id,
      task.title,
      task.description,
      task.status,
      task.level,
      task.parentId,
      task.projectSlug,
      task.columnOrder,
      task.createdAt,
      task.updatedAt,
      task.costUsd,
      task.tokensUsed,
      task.durationMs,
      task.activityLabel,
      task.errorMessage,
      task.startedAt,
      task.completedAt,
      task.clientId,
      0,
      task.phaseNumber,
      task.gsdStep,
      task.cronJobSlug
    );

    // Insert an immediate cron_runs row so run history shows "Running" right away
    db.prepare(
      `INSERT INTO cron_runs (jobSlug, taskId, startedAt, result, trigger)
       VALUES (?, ?, ?, 'running', 'manual')`
    ).run(job.slug, task.id, now);

    // Emit events so the board updates in real-time and queue watcher picks it up
    emitTaskEvent({
      type: "task:created",
      task,
      timestamp: now,
    });

    emitTaskEvent({
      type: "task:status",
      task,
      timestamp: now,
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("POST /api/cron/[name]/run error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
