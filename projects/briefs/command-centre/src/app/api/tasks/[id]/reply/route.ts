import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { emitTaskEvent } from "@/lib/event-bus";
import { processManager } from "@/lib/process-manager";
import type { Task, PermissionMode, ClaudeModel } from "@/types/task";
import {
  parseQuestionSpecs,
  serializeAnswersToProse,
  type QuestionAnswers,
} from "@/types/question-spec";

const VALID_PERMISSION_MODES: PermissionMode[] = [
  "plan",
  "default",
  "acceptEdits",
  "auto",
  "bypassPermissions",
];
const VALID_MODELS: ClaudeModel[] = ["opus", "sonnet", "haiku"];

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let body: {
    message?: string;
    structuredAnswers?: QuestionAnswers;
    permissionMode?: PermissionMode;
    model?: ClaudeModel | null;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { message, structuredAnswers, permissionMode, model } = body;

  const db = getDb();
  const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id) as Task | undefined;

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  // If structured answers were provided, find the most recent unanswered
  // structured_question log entry and serialise its spec + the answers into
  // a prose message for the Claude continuation.
  let resolvedMessage: string | null =
    typeof message === "string" && message.trim().length > 0 ? message.trim() : null;
  let answeredLogId: string | null = null;

  if (structuredAnswers && typeof structuredAnswers === "object") {
    const pending = db
      .prepare(
        `SELECT id, questionSpec FROM task_logs
         WHERE taskId = ? AND type = 'structured_question' AND (questionAnswers IS NULL OR questionAnswers = '')
         ORDER BY rowid DESC LIMIT 1`
      )
      .get(id) as { id: string; questionSpec: string | null } | undefined;

    if (pending?.questionSpec) {
      try {
        const spec = parseQuestionSpecs(JSON.parse(pending.questionSpec));
        if (spec.length > 0) {
          resolvedMessage = serializeAnswersToProse(spec, structuredAnswers);
          answeredLogId = pending.id;
        }
      } catch (err) {
        console.error("[reply-route] Failed to parse pending questionSpec:", err);
      }
    }
  }

  if (!resolvedMessage || resolvedMessage.trim().length === 0) {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
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
  const trimmed = resolvedMessage.trim();

  // If this reply answers a structured_question entry, store the answers on it
  if (answeredLogId && structuredAnswers) {
    db.prepare(
      "UPDATE task_logs SET questionAnswers = ? WHERE id = ?"
    ).run(JSON.stringify(structuredAnswers), answeredLogId);
  }

  // Persist user reply as log entry — include the permissionMode active at reply time
  const entryId = crypto.randomUUID();
  const replyPermMode = (permissionMode && VALID_PERMISSION_MODES.includes(permissionMode)) ? permissionMode : (task.permissionMode || null);
  db.prepare(
    "INSERT INTO task_logs (id, taskId, type, timestamp, content, toolName, toolArgs, toolResult, isCollapsed, questionSpec, questionAnswers, permissionMode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).run(entryId, id, "user_reply", now, trimmed, null, null, null, 0, null, null, replyPermMode);

  // Title is set once at creation (via AI generation or fallback).
  // User replies are follow-ups, not new goals — don't overwrite the title.

  // Persist permissionMode + model on the task BEFORE spawning so the next
  // turn picks them up. The reply input is the source of truth.
  if (permissionMode && VALID_PERMISSION_MODES.includes(permissionMode)) {
    db.prepare("UPDATE tasks SET permissionMode = ? WHERE id = ?").run(permissionMode, id);
  }
  if (model === null) {
    db.prepare("UPDATE tasks SET model = NULL WHERE id = ?").run(id);
  } else if (model && VALID_MODELS.includes(model)) {
    db.prepare("UPDATE tasks SET model = ? WHERE id = ?").run(model, id);
  }

  // Reactivate the task to running (set startedAt if not already set, track lastReplyAt)
  db.prepare(
    "UPDATE tasks SET status = 'running', updatedAt = ?, lastReplyAt = ?, activityLabel = ?, needsInput = 0, errorMessage = NULL, startedAt = COALESCE(startedAt, ?) WHERE id = ?"
  ).run(now, now, "Processing reply...", now, id);

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
      permissionMode: replyPermMode ?? undefined,
    },
  });

  // The picker on the reply input persists permissionMode + model on the
  // task itself, so spawnClaudeTurn just reads them from the DB. We always
  // spawn a fresh turn so picker changes are picked up immediately.
  try {
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
  } catch (err) {
    console.error(`[reply-route] Reply spawn failed:`, err);
  }

  return NextResponse.json({ ok: true });
}
