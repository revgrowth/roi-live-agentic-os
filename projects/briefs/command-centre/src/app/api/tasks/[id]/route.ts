import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { emitTaskEvent } from "@/lib/event-bus";
import type { Task, TaskUpdateInput } from "@/types/task";

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

    return NextResponse.json(task);
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
    ];

    for (const field of allowedFields) {
      if (field in body) {
        updates.push(`${field} = ?`);
        values.push(body[field] ?? null);
      }
    }

    values.push(id);

    db.prepare(`UPDATE tasks SET ${updates.join(", ")} WHERE id = ?`).run(
      ...values
    );

    const updated = db
      .prepare("SELECT * FROM tasks WHERE id = ?")
      .get(id) as Task;

    emitTaskEvent({
      type: "task:updated",
      task: updated,
      timestamp: now,
    });

    return NextResponse.json(updated);
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
