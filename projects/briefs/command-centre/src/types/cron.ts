export type CronResult = "success" | "failure" | "timeout";
export type CronRunResult = CronResult | "running";

export interface CronJob {
  name: string;
  slug: string;
  description: string;
  time: string;
  days: string;
  active: boolean;
  model: string;
  notify: string;
  timeout: string;
  retry: number;
  nextRun: string | null;
  lastRun: CronRunStatus | null;
  stats: CronStats;
  prompt: string;
  clientId: string | null;
  workspaceKey: string;
  workspaceLabel: string;
  workspaceDir: string;
}

export interface CronRunStatus {
  lastRun: string;
  result: CronResult;
  duration: number;
  exitCode: number;
  runCount: number;
  failCount: number;
}

export interface CronStats {
  totalRuns: number;
  avgDurationSec: number;
  avgCostUsd: number;
}

export interface CronRunOutput {
  fileName: string;
  filePath: string;
  extension: string;
}

export interface CronRun {
  id: number;
  jobSlug: string;
  taskId: string | null;
  startedAt: string;
  completedAt: string | null;
  result: CronRunResult;
  durationSec: number | null;
  costUsd: number | null;
  exitCode: number | null;
  trigger: "manual" | "scheduled";
  outputs: CronRunOutput[];
}

export interface CronJobCreateInput {
  name: string;
  description: string;
  time: string;
  days: string;
  model?: string;
  notify?: string;
  timeout?: string;
  retry?: number;
  prompt: string;
}

export interface CronJobUpdateInput {
  name?: string;
  description?: string;
  time?: string;
  days?: string;
  active?: boolean;
  model?: string;
  notify?: string;
  timeout?: string;
  retry?: number;
  prompt?: string;
}

export interface CronSystemStatus {
  runtime: "in-process" | "daemon" | "stopped";
  leader: boolean;
  identifier: string | null;
  startCommand: string;
  stopCommand: string;
  statusCommand: string;
  logsCommand: string;
  workspaceCount: number;
  heartbeatAt: string | null;
  pid: number | null;
}
