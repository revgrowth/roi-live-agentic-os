import { NextRequest, NextResponse } from "next/server";
import { processManager } from "@/lib/process-manager";
import { getDb } from "@/lib/db";
import { emitTaskEvent } from "@/lib/event-bus";
import type { Task, LogEntry } from "@/types/task";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const entries = processManager.getLogEntries(id);
  return NextResponse.json(entries);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();

    const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id) as Task | undefined;
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const body = await request.json();
    const { type, content, toolName, toolArgs, toolResult } = body as {
      type: string;
      content: string;
      toolName?: string;
      toolArgs?: string;
      toolResult?: string;
    };

    if (!type || !content) {
      return NextResponse.json({ error: "type and content are required" }, { status: 400 });
    }

    const entry: LogEntry = {
      id: crypto.randomUUID(),
      type: type as LogEntry["type"],
      timestamp: new Date().toISOString(),
      content,
      ...(toolName ? { toolName } : {}),
      ...(toolArgs ? { toolArgs } : {}),
      ...(toolResult ? { toolResult } : {}),
    };

    db.prepare(
      "INSERT INTO task_logs (id, taskId, type, timestamp, content, toolName, toolArgs, toolResult, isCollapsed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).run(entry.id, id, entry.type, entry.timestamp, entry.content, toolName ?? null, toolArgs ?? null, toolResult ?? null, 0);

    emitTaskEvent({
      type: "task:log",
      task: { ...task, needsInput: Boolean(task.needsInput) },
      timestamp: entry.timestamp,
      logEntry: entry,
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error("POST /api/tasks/[id]/logs error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
