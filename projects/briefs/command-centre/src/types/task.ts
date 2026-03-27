export type TaskStatus = "backlog" | "queued" | "running" | "review" | "done";
export type TaskLevel = "task" | "project" | "gsd";

/** Human-friendly labels for task depth levels */
export const LEVEL_LABELS: Record<TaskLevel, string> = {
  task: "Quick task",
  project: "Campaign",
  gsd: "Deep build",
};

/** Short descriptions explaining what each level means */
export const LEVEL_HINTS: Record<TaskLevel, string> = {
  task: "A single deliverable — write an email, fix a bug, run research",
  project: "Several related deliverables — a launch needs a page, emails, and social posts",
  gsd: "Something that needs building in stages — an app, a system, a complex workflow",
};
export type GsdStep = "discuss" | "plan" | "execute" | "verify";

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
  projectSlug: string | null;
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
  needsInput: boolean;
  phaseNumber: number | null;
  gsdStep: GsdStep | null;
  contextSources: string | null;
  cronJobSlug: string | null;
  claudeSessionId: string | null;
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
  projectSlug?: string | null;
  clientId?: string | null;
  parentId?: string | null;
  phaseNumber?: number | null;
  gsdStep?: GsdStep | null;
}

export type TaskUpdateInput = Partial<
  Pick<
    Task,
    | "title"
    | "description"
    | "status"
    | "level"
    | "parentId"
    | "projectSlug"
    | "columnOrder"
    | "costUsd"
    | "tokensUsed"
    | "durationMs"
    | "activityLabel"
    | "errorMessage"
    | "startedAt"
    | "completedAt"
    | "clientId"
    | "needsInput"
    | "phaseNumber"
    | "gsdStep"
  >
>;
