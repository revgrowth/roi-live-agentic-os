import type Database from "better-sqlite3";
import type { LogEntry, LogEntryType } from "@/types/task";

const TEXT_LIKE_LOG_TYPES = new Set<LogEntryType>([
  "text",
  "question",
  "user_reply",
  "system",
]);

export const TASK_LOG_DUPLICATE_WINDOW_MS = 5000;

type TaskLogRow = {
  id: string;
  type: string;
  timestamp: string;
  content: string;
  toolName: string | null;
  toolArgs: string | null;
  toolResult: string | null;
  isCollapsed: number;
};

export type InsertTaskLogInput = {
  id?: string;
  type: LogEntryType;
  timestamp?: string;
  content: string;
  toolName?: string | null;
  toolArgs?: string | null;
  toolResult?: string | null;
  isCollapsed?: boolean;
};

export type InsertTaskLogResult =
  | { inserted: true; entry: LogEntry }
  | { inserted: false; reason: "empty" | "duplicate"; entry?: LogEntry };

const TASK_LOG_SELECT = `
  SELECT id, type, timestamp, content, toolName, toolArgs, toolResult, isCollapsed
  FROM task_logs
`;

function getTimestampMs(timestamp: string): number {
  const parsed = Date.parse(timestamp);
  return Number.isFinite(parsed) ? parsed : Date.now();
}

function toIsoTimestamp(timestamp?: string): string {
  return new Date(timestamp ? getTimestampMs(timestamp) : Date.now()).toISOString();
}

export function isTextLikeTaskLogType(type: LogEntryType): boolean {
  return TEXT_LIKE_LOG_TYPES.has(type);
}

export function normalizeTaskLogContent(type: LogEntryType, content: string): string {
  const normalizedLineEndings = String(content ?? "").replace(/\r\n?/g, "\n");
  return isTextLikeTaskLogType(type)
    ? normalizedLineEndings.trim()
    : normalizedLineEndings;
}

export function getTaskLogDuplicateSignature(
  entry: Pick<LogEntry, "type" | "content">
): string | null {
  if (!isTextLikeTaskLogType(entry.type)) {
    return null;
  }

  const normalizedContent = normalizeTaskLogContent(entry.type, entry.content);
  return normalizedContent.length > 0 ? `${entry.type}:${normalizedContent}` : null;
}

export function normalizeTaskLogEntry(entry: LogEntry): LogEntry | null {
  const normalizedContent = normalizeTaskLogContent(entry.type, entry.content);
  if (normalizedContent.length === 0) {
    return null;
  }

  return normalizedContent === entry.content
    ? entry
    : { ...entry, content: normalizedContent };
}

export function taskLogRowToEntry(row: TaskLogRow): LogEntry | null {
  return normalizeTaskLogEntry({
    id: row.id,
    type: row.type as LogEntryType,
    timestamp: row.timestamp,
    content: row.content,
    ...(row.toolName ? { toolName: row.toolName } : {}),
    ...(row.toolArgs ? { toolArgs: row.toolArgs } : {}),
    ...(row.toolResult ? { toolResult: row.toolResult } : {}),
    ...(row.isCollapsed ? { isCollapsed: true } : {}),
  });
}

export function prepareTaskLogEntry(input: InsertTaskLogInput): LogEntry | null {
  return normalizeTaskLogEntry({
    id: input.id ?? crypto.randomUUID(),
    type: input.type,
    timestamp: toIsoTimestamp(input.timestamp),
    content: input.content,
    ...(input.toolName ? { toolName: input.toolName } : {}),
    ...(input.toolArgs ? { toolArgs: input.toolArgs } : {}),
    ...(input.toolResult ? { toolResult: input.toolResult } : {}),
    ...(input.isCollapsed ? { isCollapsed: true } : {}),
  });
}

export function compactTaskLogEntries(entries: LogEntry[]): LogEntry[] {
  const recentTextLikeEntries = new Map<string, number>();
  const compacted: LogEntry[] = [];

  for (const entry of entries) {
    const normalizedEntry = normalizeTaskLogEntry(entry);
    if (!normalizedEntry) {
      continue;
    }

    const signature = getTaskLogDuplicateSignature(normalizedEntry);
    if (signature) {
      const timestampMs = getTimestampMs(normalizedEntry.timestamp);
      const lastSeen = recentTextLikeEntries.get(signature);
      if (
        lastSeen !== undefined &&
        timestampMs - lastSeen <= TASK_LOG_DUPLICATE_WINDOW_MS
      ) {
        continue;
      }
      recentTextLikeEntries.set(signature, timestampMs);
    }

    compacted.push(normalizedEntry);
  }

  return compacted;
}

export function getTaskLogEntries(
  db: Database.Database,
  taskId: string
): LogEntry[] {
  const rows = db
    .prepare(`${TASK_LOG_SELECT} WHERE taskId = ? ORDER BY rowid ASC`)
    .all(taskId) as TaskLogRow[];

  return compactTaskLogEntries(
    rows
      .map((row) => taskLogRowToEntry(row))
      .filter((entry): entry is LogEntry => entry !== null)
  );
}

export function insertTaskLog(
  db: Database.Database,
  taskId: string,
  input: InsertTaskLogInput
): InsertTaskLogResult {
  const entry = prepareTaskLogEntry(input);
  if (!entry) {
    return { inserted: false, reason: "empty" };
  }

  const signature = getTaskLogDuplicateSignature(entry);
  if (signature) {
    const cutoffIso = new Date(
      getTimestampMs(entry.timestamp) - TASK_LOG_DUPLICATE_WINDOW_MS
    ).toISOString();

    const recentRows = db
      .prepare(
        `${TASK_LOG_SELECT}
         WHERE taskId = ? AND type = ? AND timestamp >= ?
         ORDER BY rowid ASC`
      )
      .all(taskId, entry.type, cutoffIso) as TaskLogRow[];

    for (const row of recentRows) {
      const existingEntry = taskLogRowToEntry(row);
      if (!existingEntry) {
        continue;
      }

      if (getTaskLogDuplicateSignature(existingEntry) === signature) {
        return { inserted: false, reason: "duplicate", entry: existingEntry };
      }
    }
  }

  db.prepare(
    `INSERT INTO task_logs (
      id, taskId, type, timestamp, content, toolName, toolArgs, toolResult, isCollapsed
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    entry.id,
    taskId,
    entry.type,
    entry.timestamp,
    entry.content,
    entry.toolName ?? null,
    entry.toolArgs ?? null,
    entry.toolResult ?? null,
    entry.isCollapsed ? 1 : 0
  );

  return { inserted: true, entry };
}
