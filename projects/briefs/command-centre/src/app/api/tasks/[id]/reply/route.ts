import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { emitTaskEvent } from "@/lib/event-bus";
import { processManager } from "@/lib/process-manager";
import type { Task } from "@/types/task";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let body: { message?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { message } = body;

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }

  const db = getDb();
  const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id) as Task | undefined;

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  const needsInput = Boolean(task.needsInput);
  const isResuming = task.status === "review" || task.status === "done";
  const isRunning = task.status === "running";

  console.log(`[reply-route] POST /reply for ${id.slice(0, 8)}: needsInput=${needsInput}, status=${task.status}, isResuming=${isResuming}`);

  // Allow reply if: task needs input, OR task is in review/done (follow-up), OR running with pending question
  if (!needsInput && !isResuming && !isRunning) {
    return NextResponse.json(
      { error: "Task cannot receive messages in its current state" },
      { status: 409 }
    );
  }

  const now = new Date().toISOString();
  const trimmed = message.trim();

  // Persist user reply as log entry
  const entryId = crypto.randomUUID();
  db.prepare(
    "INSERT INTO task_logs (id, taskId, type, timestamp, content, toolName, toolArgs, toolResult, isCollapsed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).run(entryId, id, "user_reply", now, trimmed, null, null, null, 0);

  // Reactivate the task to running (set startedAt if not already set)
  db.prepare(
    "UPDATE tasks SET status = 'running', updatedAt = ?, activityLabel = ?, needsInput = 0, errorMessage = NULL, startedAt = COALESCE(startedAt, ?) WHERE id = ?"
  ).run(now, "Processing reply...", now, id);

  const updated = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id) as Task;
  emitTaskEvent({
    type: "task:status",
    task: { ...updated, needsInput: false },
    timestamp: now,
  });
  emitTaskEvent({
    type: "task:log",
    task: { ...updated, needsInput: false },
    timestamp: now,
    logEntry: {
      id: entryId,
      type: "user_reply",
      timestamp: now,
      content: trimmed,
    },
  });

  // Try in-memory path first (can kill running processes if needed)
  const success = await processManager.replyToTask(id, trimmed);

  if (!success) {
    // In-memory state was stale — spawn resume turn directly
    console.log(`[reply-route] In-memory replyToTask returned false — spawning via DB path`);
    try {
      await processManager.spawnContinueTurn(id, trimmed, isResuming);
    } catch (err) {
      console.error(`[reply-route] Failed to spawn continue turn:`, err);
    }
  }

  return NextResponse.json({ ok: true });
}
