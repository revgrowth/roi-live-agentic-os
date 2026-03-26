import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { emitTaskEvent } from "@/lib/event-bus";
import type { Task, TaskCreateInput } from "@/types/task";

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const clientId = searchParams.get("clientId");

    // Build query with optional filters
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (status) {
      conditions.push("status = ?");
      params.push(status);
    }

    // clientId filter: if provided and not "root", scope to that client
    // If "root" or absent, return all tasks (root sees everything)
    if (clientId && clientId !== "root") {
      conditions.push("clientId = ?");
      params.push(clientId);
    }

    const where = conditions.length > 0 ? ` WHERE ${conditions.join(" AND ")}` : "";
    const rows = db
      .prepare(`SELECT * FROM tasks${where} ORDER BY columnOrder ASC`)
      .all(...params) as Task[];

    // Normalize SQLite integer to boolean for needsInput
    const tasks = rows.map((t) => ({ ...t, needsInput: Boolean(t.needsInput) }));

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
    const { title, description, level, projectSlug: bodyProjectSlug, clientId: bodyClientId, parentId: bodyParentId, phaseNumber: bodyPhaseNumber, gsdStep: bodyGsdStep, cronJobSlug: bodyCronJobSlug } = body as TaskCreateInput & { cronJobSlug?: string };
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

    // Get min columnOrder in backlog — new tasks get lowest value to sort to top
    const minOrder = db
      .prepare(
        "SELECT COALESCE(MIN(columnOrder), 1) as minOrder FROM tasks WHERE status = 'backlog'"
      )
      .get() as { minOrder: number };

    const now = new Date().toISOString();
    const task: Task = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description?.trim() || null,
      status: "backlog",
      level,
      parentId: bodyParentId || null,
      projectSlug: bodyProjectSlug || null,
      columnOrder: minOrder.minOrder - 1,
      createdAt: now,
      updatedAt: now,
      costUsd: null,
      tokensUsed: null,
      durationMs: null,
      activityLabel: null,
      errorMessage: null,
      startedAt: null,
      completedAt: null,
      clientId: bodyClientId || null,
      needsInput: false,
      phaseNumber: bodyPhaseNumber ?? null,
      gsdStep: bodyGsdStep ?? null,
      contextSources: null,
      cronJobSlug: bodyCronJobSlug || null,
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
