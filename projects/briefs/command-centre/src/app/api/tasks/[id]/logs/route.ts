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

  // First try direct logs for this task
  let entries = processManager.getLogEntries(id);

  // If no logs and this is a parent/container task, aggregate child task logs
  if (entries.length === 0) {
    const db = getDb();
    const childCount = db.prepare(
      "SELECT COUNT(*) as count FROM tasks WHERE parentId = ?"
    ).get(id) as { count: number };

    if (childCount.count > 0) {
      // Fetch logs from all child tasks, ordered by timestamp
      const childLogs = db.prepare(
        `SELECT tl.id, tl.type, tl.timestamp, tl.content, tl.toolName, tl.toolArgs,
                tl.toolResult, tl.isCollapsed, t.title as taskTitle, t.phaseNumber, t.gsdStep
         FROM task_logs tl
         JOIN tasks t ON tl.taskId = t.id
         WHERE t.parentId = ?
         ORDER BY tl.timestamp ASC`
      ).all(id) as Array<{
        id: string; type: string; timestamp: string; content: string;
        toolName: string | null; toolArgs: string | null; toolResult: string | null;
        isCollapsed: number; taskTitle: string; phaseNumber: number | null; gsdStep: string | null;
      }>;

      // Group by child task and insert header entries so the user knows
      // which subtask each block of logs came from
      let lastTaskTitle = "";
      entries = [];
      for (const row of childLogs) {
        // Insert a divider when switching between child tasks
        if (row.taskTitle !== lastTaskTitle) {
          lastTaskTitle = row.taskTitle;
          const label = row.phaseNumber != null
            ? `Phase ${row.phaseNumber}${row.gsdStep ? ` (${row.gsdStep})` : ""}: ${row.taskTitle}`
            : row.taskTitle;
          entries.push({
            id: `header-${row.id}`,
            type: "text" as LogEntry["type"],
            timestamp: row.timestamp,
            content: `--- ${label} ---`,
          });
        }

        entries.push({
          id: row.id,
          type: row.type as LogEntry["type"],
          timestamp: row.timestamp,
          content: row.content,
          ...(row.toolName ? { toolName: row.toolName } : {}),
          ...(row.toolArgs ? { toolArgs: row.toolArgs } : {}),
          ...(row.toolResult ? { toolResult: row.toolResult } : {}),
          ...(row.isCollapsed ? { isCollapsed: true } : {}),
        });
      }
    }
  }

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
