import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { emitTaskEvent } from "@/lib/event-bus";
import type { Task, TaskCreateInput } from "@/types/task";

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let tasks: Task[];
    if (status) {
      tasks = db
        .prepare("SELECT * FROM tasks WHERE status = ? ORDER BY columnOrder ASC")
        .all(status) as Task[];
    } else {
      tasks = db
        .prepare("SELECT * FROM tasks ORDER BY columnOrder ASC")
        .all() as Task[];
    }

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("GET /api/tasks error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();

    // Validate input
    const { title, level } = body as TaskCreateInput;
    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json(
        { error: "title is required and must be a non-empty string" },
        { status: 400 }
      );
    }
    if (!level || !["task", "project", "gsd"].includes(level)) {
      return NextResponse.json(
        { error: 'level is required and must be "task", "project", or "gsd"' },
        { status: 400 }
      );
    }

    // Get max columnOrder in backlog
    const maxOrder = db
      .prepare(
        "SELECT COALESCE(MAX(columnOrder), -1) as maxOrder FROM tasks WHERE status = 'backlog'"
      )
      .get() as { maxOrder: number };

    const now = new Date().toISOString();
    const task: Task = {
      id: crypto.randomUUID(),
      title: title.trim(),
      status: "backlog",
      level,
      parentId: null,
      columnOrder: maxOrder.maxOrder + 1,
      createdAt: now,
      updatedAt: now,
      costUsd: null,
      tokensUsed: null,
      durationMs: null,
      activityLabel: null,
      errorMessage: null,
      startedAt: null,
      completedAt: null,
    };

    db.prepare(
      `INSERT INTO tasks (id, title, status, level, parentId, columnOrder, createdAt, updatedAt, costUsd, tokensUsed, durationMs, activityLabel, errorMessage, startedAt, completedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      task.id,
      task.title,
      task.status,
      task.level,
      task.parentId,
      task.columnOrder,
      task.createdAt,
      task.updatedAt,
      task.costUsd,
      task.tokensUsed,
      task.durationMs,
      task.activityLabel,
      task.errorMessage,
      task.startedAt,
      task.completedAt
    );

    emitTaskEvent({
      type: "task:created",
      task,
      timestamp: now,
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("POST /api/tasks error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
