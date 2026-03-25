export type TaskStatus = "backlog" | "queued" | "running" | "review" | "done";
export type TaskLevel = "task" | "project" | "gsd";

export interface Task {
  id: string;
  title: string;
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
}

export interface TaskCreateInput {
  title: string;
  level: TaskLevel;
}

export type TaskUpdateInput = Partial<
  Pick<
    Task,
    | "title"
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
  >
>;
