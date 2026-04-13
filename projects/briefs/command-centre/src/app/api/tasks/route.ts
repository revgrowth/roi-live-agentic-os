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
      .all(...params) as Array<Task & { dependsOnTaskIds: string | string[] | null }>;

    // Normalize SQLite integer to boolean for needsInput, parse JSON fields
    const tasks: Task[] = rows.map((t) => ({
      ...t,
      needsInput: Boolean(t.needsInput),
      dependsOnTaskIds:
        typeof t.dependsOnTaskIds === "string" && t.dependsOnTaskIds.length > 0
          ? (() => {
              try {
                const parsed = JSON.parse(t.dependsOnTaskIds as string);
                return Array.isArray(parsed) ? (parsed as string[]) : null;
              } catch {
                return null;
              }
            })()
          : null,
    }));

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
    const { title, description, level, projectSlug: bodyProjectSlug, clientId: bodyClientId, parentId: bodyParentId, phaseNumber: bodyPhaseNumber, gsdStep: bodyGsdStep, cronJobSlug: bodyCronJobSlug, permissionMode: bodyPermissionMode, status: bodyStatus, dependsOnTaskIds: bodyDependsOnTaskIds } = body as TaskCreateInput & { cronJobSlug?: string; status?: string; dependsOnTaskIds?: string[] };
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

    // Get min columnOrder in queued — new tasks get lowest value to sort to top
    const minOrder = db
      .prepare(
        "SELECT COALESCE(MIN(columnOrder), 1) as minOrder FROM tasks WHERE status = 'queued'"
      )
      .get() as { minOrder: number };

    const now = new Date().toISOString();
    // Child tasks (with parentId) start as backlog — the auto-progression
    // system queues them when their turn comes. Top-level tasks start as queued
    // so the queue watcher picks them up immediately.
    // Allow explicit status override (e.g., "review" for scoping flow).
    const validStatuses = ["backlog", "queued", "review"];
    const initialStatus = (bodyStatus && validStatuses.includes(bodyStatus)
      ? bodyStatus
      : bodyParentId ? "backlog" : "queued") as Task["status"];
    const task: Task = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description?.trim() || null,
      status: initialStatus,
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
      claudeSessionId: null,
      permissionMode: bodyPermissionMode || "default",
      lastReplyAt: null,
      goalGroup: null,
      dependsOnTaskIds:
        Array.isArray(bodyDependsOnTaskIds) && bodyDependsOnTaskIds.length > 0
          ? bodyDependsOnTaskIds
          : null,
    };

    db.prepare(
      `INSERT INTO tasks (id, title, description, status, level, parentId, projectSlug, columnOrder, createdAt, updatedAt, costUsd, tokensUsed, durationMs, activityLabel, errorMessage, startedAt, completedAt, clientId, needsInput, phaseNumber, gsdStep, cronJobSlug, permissionMode, dependsOnTaskIds)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
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
      task.cronJobSlug,
      task.permissionMode,
      task.dependsOnTaskIds ? JSON.stringify(task.dependsOnTaskIds) : null
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
