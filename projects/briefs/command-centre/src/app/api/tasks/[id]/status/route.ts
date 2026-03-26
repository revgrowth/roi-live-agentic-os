import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { emitTaskEvent } from "@/lib/event-bus";
import type { Task } from "@/types/task";

interface StatusUpdateInput {
  status: string;
  activityLabel?: string;
  costUsd?: number;
  tokensUsed?: number;
  errorMessage?: string;
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

    const body = (await request.json()) as StatusUpdateInput;

    // Validate status
    const validStatuses = ["backlog", "queued", "running", "review", "done"];
    if (!body.status || !validStatuses.includes(body.status)) {
      return NextResponse.json(
        {
          error: `status is required and must be one of: ${validStatuses.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const updates: string[] = ["status = ?", "updatedAt = ?"];
    const values: unknown[] = [body.status, now];

    // Set startedAt when transitioning to running
    if (body.status === "running" && !existing.startedAt) {
      updates.push("startedAt = ?");
      values.push(now);
    }

    // Set completedAt when transitioning to review or done
    if (
      (body.status === "review" || body.status === "done") &&
      !existing.completedAt
    ) {
      updates.push("completedAt = ?");
      values.push(now);

      // Calculate duration if we have startedAt
      if (existing.startedAt) {
        const durationMs =
          new Date(now).getTime() - new Date(existing.startedAt).getTime();
        updates.push("durationMs = ?");
        values.push(durationMs);
      }
    }

    // Optional fields from agent self-reporting
    if (body.activityLabel !== undefined) {
      updates.push("activityLabel = ?");
      values.push(body.activityLabel);
    }
    if (body.costUsd !== undefined) {
      updates.push("costUsd = ?");
      values.push(body.costUsd);
    }
    if (body.tokensUsed !== undefined) {
      updates.push("tokensUsed = ?");
      values.push(body.tokensUsed);
    }
    if (body.errorMessage !== undefined) {
      updates.push("errorMessage = ?");
      values.push(body.errorMessage);
    }

    values.push(id);

    db.prepare(`UPDATE tasks SET ${updates.join(", ")} WHERE id = ?`).run(
      ...values
    );

    const updated = db
      .prepare("SELECT * FROM tasks WHERE id = ?")
      .get(id) as Task;

    emitTaskEvent({
      type: "task:status",
      task: updated,
      timestamp: now,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/tasks/[id]/status error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
