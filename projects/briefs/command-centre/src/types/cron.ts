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
}

export interface CronRunStatus {
  lastRun: string;
  result: "success" | "failure";
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

export interface CronRun {
  id: number;
  jobSlug: string;
  startedAt: string;
  completedAt: string | null;
  result: "success" | "failure" | "running";
  durationSec: number | null;
  costUsd: number | null;
  exitCode: number | null;
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
