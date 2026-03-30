import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { emitTaskEvent } from "@/lib/event-bus";
import type { Task, TaskUpdateInput } from "@/types/task";
import type Database from "better-sqlite3";

/** When a child task completes, auto-queue the next backlog sibling for user go-ahead */
function autoQueueNextSibling(db: Database.Database, completedChild: Task, now: string): void {
  if (!completedChild.parentId) return;

  const nextSibling = db.prepare(
    `SELECT * FROM tasks WHERE parentId = ? AND status = 'backlog' ORDER BY columnOrder ASC LIMIT 1`
  ).get(completedChild.parentId) as Task | undefined;

  if (!nextSibling) {
    // Check if all siblings are done
    const remaining = db.prepare(
      `SELECT COUNT(*) as count FROM tasks WHERE parentId = ? AND status != 'done'`
    ).get(completedChild.parentId) as { count: number };

    if (remaining.count === 0) {
      db.prepare(
        "UPDATE tasks SET status = 'review', updatedAt = ?, activityLabel = NULL, needsInput = 0 WHERE id = ?"
      ).run(now, completedChild.parentId);
      const updatedParent = db.prepare("SELECT * FROM tasks WHERE id = ?").get(completedChild.parentId) as Task;
      emitTaskEvent({ type: "task:status", task: { ...updatedParent, needsInput: Boolean(updatedParent.needsInput) }, timestamp: now });
    }
    return;
  }

  // Queue the next sibling — needs user go-ahead
  db.prepare(
    "UPDATE tasks SET status = 'review', updatedAt = ?, needsInput = 1, activityLabel = ? WHERE id = ?"
  ).run(now, "Ready to start — waiting for go-ahead", nextSibling.id);
  const updatedSibling = db.prepare("SELECT * FROM tasks WHERE id = ?").get(nextSibling.id) as Task;
  emitTaskEvent({ type: "task:status", task: { ...updatedSibling, needsInput: Boolean(updatedSibling.needsInput) }, timestamp: now });

  // Update parent progress
  const completedCount = db.prepare(
    `SELECT COUNT(*) as count FROM tasks WHERE parentId = ? AND status = 'done'`
  ).get(completedChild.parentId) as { count: number };
  const totalCount = db.prepare(
    `SELECT COUNT(*) as count FROM tasks WHERE parentId = ?`
  ).get(completedChild.parentId) as { count: number };

  db.prepare(
    "UPDATE tasks SET status = 'running', updatedAt = ?, activityLabel = ?, startedAt = COALESCE(startedAt, ?) WHERE id = ?"
  ).run(now, `${completedCount.count}/${totalCount.count} tasks done — next task queued`, now, completedChild.parentId);
  const updatedParent = db.prepare("SELECT * FROM tasks WHERE id = ?").get(completedChild.parentId) as Task;
  emitTaskEvent({ type: "task:status", task: { ...updatedParent, needsInput: Boolean(updatedParent.needsInput) }, timestamp: now });
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();
    const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id) as
      | Task
      | undefined;

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ ...task, needsInput: Boolean(task.needsInput) });
  } catch (error) {
    console.error("GET /api/tasks/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();

    const existing = db
      .prepare("SELECT * FROM tasks WHERE id = ?")
      .get(id) as Task | undefined;
    if (!existing) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const body = (await request.json()) as TaskUpdateInput;
    const now = new Date().toISOString();

    // Build dynamic update
    const updates: string[] = ["updatedAt = ?"];
    const values: unknown[] = [now];

    const allowedFields: (keyof TaskUpdateInput)[] = [
      "title",
      "description",
      "status",
      "level",
      "parentId",
      "columnOrder",
      "costUsd",
      "tokensUsed",
      "durationMs",
      "activityLabel",
      "errorMessage",
      "startedAt",
      "completedAt",
      "phaseNumber",
      "gsdStep",
      "permissionMode",
    ];

    for (const field of allowedFields) {
      if (field in body) {
        updates.push(`${field} = ?`);
        values.push(body[field] ?? null);
      }
    }

    // Auto-set startedAt when transitioning to running/review/done if not already set
    const newStatus = body.status;
    if (newStatus && ["running", "review", "done"].includes(newStatus) && !existing.startedAt && !("startedAt" in body)) {
      updates.push("startedAt = ?");
      values.push(now);
    }

    values.push(id);

    db.prepare(`UPDATE tasks SET ${updates.join(", ")} WHERE id = ?`).run(
      ...values
    );

    const updated = db
      .prepare("SELECT * FROM tasks WHERE id = ?")
      .get(id) as Task;

    const normalized = { ...updated, needsInput: Boolean(updated.needsInput) };
    emitTaskEvent({
      type: "task:updated",
      task: normalized,
      timestamp: now,
    });

    // Auto-queue next sibling when a child task is manually marked done
    if (body.status === "done" && updated.parentId) {
      autoQueueNextSibling(db, updated, now);
    }

    // When a parent task is moved to "queued", auto-queue its first backlog child
    if (body.status === "queued" && !updated.parentId) {
      const firstChild = db.prepare(
        `SELECT * FROM tasks WHERE parentId = ? AND status = 'backlog' ORDER BY columnOrder ASC LIMIT 1`
      ).get(id) as Task | undefined;

      if (firstChild) {
        db.prepare(
          "UPDATE tasks SET status = 'queued', updatedAt = ? WHERE id = ?"
        ).run(now, firstChild.id);
        const updatedChild = db.prepare("SELECT * FROM tasks WHERE id = ?").get(firstChild.id) as Task;
        emitTaskEvent({ type: "task:status", task: { ...updatedChild, needsInput: Boolean(updatedChild.needsInput) }, timestamp: now });
      }
    }

    return NextResponse.json(normalized);
  } catch (error) {
    console.error("PATCH /api/tasks/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();

    const existing = db
      .prepare("SELECT * FROM tasks WHERE id = ?")
      .get(id) as Task | undefined;
    if (!existing) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Delete child tasks first
    db.prepare("DELETE FROM tasks WHERE parentId = ?").run(id);
    // Delete the task itself
    db.prepare("DELETE FROM tasks WHERE id = ?").run(id);

    emitTaskEvent({
      type: "task:deleted",
      task: existing,
      timestamp: new Date().toISOString(),
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("DELETE /api/tasks/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
