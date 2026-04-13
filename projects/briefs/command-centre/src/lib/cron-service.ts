import { getConfig } from "./config";
import { getCronSystemStatus } from "./cron-system-status";
import type {
  CronJob,
  CronRun,
  CronJobCreateInput,
  CronJobUpdateInput,
  CronSystemStatus,
} from "@/types/cron";

const cronRuntime = require("./cron-runtime.js");

function getAgenticOsDir(): string {
  return getConfig().agenticOsDir;
}

export function isSupportedCronDays(days: string): boolean {
  return cronRuntime.isSupportedCronDays(days);
}

export function isSupportedCronTime(time: string): boolean {
  return cronRuntime.isSupportedCronTime(time);
}

export function isSupportedCronSchedule(time: string, days: string): boolean {
  return cronRuntime.isSupportedCronSchedule(time, days);
}

export function getCronScheduleValidationError(
  time: string,
  days: string
): string | null {
  return cronRuntime.getCronScheduleValidationError(time, days);
}

export function listCronJobs(clientId?: string | null): CronJob[] {
  return cronRuntime.listCronJobs(getAgenticOsDir(), clientId ?? null);
}

export function listAllCronJobs(): CronJob[] {
  return cronRuntime.listAllCronJobs(getAgenticOsDir());
}

export function getCronJob(slug: string, clientId?: string | null): CronJob | null {
  return cronRuntime.getCronJob(getAgenticOsDir(), slug, clientId ?? null);
}

export function createCronJob(
  input: CronJobCreateInput,
  clientId?: string | null
): CronJob {
  return cronRuntime.createCronJob(getAgenticOsDir(), clientId ?? null, input);
}

export function updateCronJob(
  slug: string,
  input: CronJobUpdateInput,
  clientId?: string | null
): CronJob {
  return cronRuntime.updateCronJob(getAgenticOsDir(), clientId ?? null, slug, input);
}

export function deleteCronJob(slug: string, clientId?: string | null): void {
  cronRuntime.deleteCronJob(getAgenticOsDir(), clientId ?? null, slug);
}

export function getCronRunHistory(
  slug: string,
  clientId?: string | null
): CronRun[] {
  return cronRuntime.getCronRunHistory(getAgenticOsDir(), slug, clientId ?? null);
}

export function getRawJobFile(
  slug: string,
  clientId?: string | null
): string | null {
  return cronRuntime.getRawJobFile(getAgenticOsDir(), slug, clientId ?? null);
}

export function getCronJobLog(
  slug: string,
  clientId?: string | null
): string {
  return cronRuntime.getCronJobLog(getAgenticOsDir(), slug, clientId ?? null);
}

export function enqueueCronJob(
  job: CronJob,
  options?: Record<string, unknown>
): { duplicate: boolean; task: any; cronRunId: number | null; scheduledFor?: string } {
  return cronRuntime.enqueueCronJob(getAgenticOsDir(), job, options || {});
}

export function completeCronRunForTask(
  task: any,
  payload?: Record<string, unknown>
): void {
  cronRuntime.completeCronRunForTask(getAgenticOsDir(), task, payload || {});
}

export function getManagedCronRuntimeStatus(
  localIdentifier?: string | null
): CronSystemStatus {
  return getCronSystemStatus(localIdentifier);
}

export function claimCronLeadership(candidate: Record<string, unknown>) {
  return cronRuntime.claimRuntimeLeadership(getAgenticOsDir(), candidate);
}

export function refreshCronHeartbeat(identifier: string, updates?: Record<string, unknown>) {
  return cronRuntime.refreshRuntimeHeartbeat(getAgenticOsDir(), identifier, updates || {});
}

export function releaseCronLeadership(identifier: string) {
  return cronRuntime.releaseRuntimeLeadership(getAgenticOsDir(), identifier);
}

export function hasActiveCronJobs(): boolean {
  return cronRuntime.hasActiveCronJobs(getAgenticOsDir());
}

export function getCronWorkspaceCount(): number {
  return cronRuntime.listWorkspaceDescriptors(getAgenticOsDir()).length;
}

export function getMissedFixedRuns(time: string, days: string, start: Date, end: Date): Date[] {
  return cronRuntime.getMissedFixedRuns(time, days, start, end);
}

export function matchesCronTime(now: Date, schedule: string): boolean {
  return cronRuntime.matchesTime(now, schedule);
}

export function toCronMinuteIso(date: Date): string {
  return cronRuntime.toMinuteIso(date);
}
