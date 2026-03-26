export type TaskStatus = "backlog" | "queued" | "running" | "review" | "done";
export type TaskLevel = "task" | "project" | "gsd";

export type LogEntryType = "text" | "tool_use" | "tool_result" | "question" | "user_reply" | "system";

export interface LogEntry {
  id: string;
  type: LogEntryType;
  timestamp: string;
  content: string;
  toolName?: string;
  toolArgs?: string;
  toolResult?: string;
  isCollapsed?: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  level: TaskLevel;
  parentId: string | null;
  columnOrder: number;
  createdAt: string;
  updatedAt: string;
  costUsd: number | null;
  tokensUsed: number | null;
  durationMs: number | null;
  activityLabel: string | null;
  errorMessage: string | null;
  startedAt: string | null;
  completedAt: string | null;
  clientId: string | null;
}

export interface OutputFile {
  id: string;
  taskId: string;
  fileName: string;
  filePath: string;
  relativePath: string;
  extension: string;
  sizeBytes: number | null;
  createdAt: string;
}

export interface TaskCreateInput {
  title: string;
  description?: string | null;
  level: TaskLevel;
  clientId?: string | null;
}

export type TaskUpdateInput = Partial<
  Pick<
    Task,
    | "title"
    | "description"
    | "status"
    | "level"
    | "parentId"
    | "columnOrder"
    | "costUsd"
    | "tokensUsed"
    | "durationMs"
    | "activityLabel"
    | "errorMessage"
    | "startedAt"
    | "completedAt"
    | "clientId"
  >
>;
