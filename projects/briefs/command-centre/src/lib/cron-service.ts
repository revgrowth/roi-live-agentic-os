import matter from "gray-matter";
import fs from "fs";
import path from "path";
import { getConfig, getClientAgenticOsDir } from "./config";
import { getDb } from "./db";
import type {
  CronJob,
  CronRunStatus,
  CronStats,
  CronRun,
  CronJobCreateInput,
  CronJobUpdateInput,
  CronResult,
  CronRunResult,
} from "@/types/cron";

const DAY_MAP: Record<string, string> = {
  daily: "*",
  weekdays: "1-5",
  weekends: "0,6",
  mon: "1",
  tue: "2",
  wed: "3",
  thu: "4",
  fri: "5",
  sat: "6",
  sun: "0",
};

const WEEKDAY_TOKENS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
const WEEKDAY_SET = new Set<string>(WEEKDAY_TOKENS);
const DAY_SHORTCUTS = new Set<string>(["daily", "weekdays", "weekends"]);
const FIXED_TIME_RE = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
const INTERVAL_TIME_RE = /^every_([1-9]\d*)([mh])$/;
const DEFAULT_TIMEOUT = "30m";

function normalizeDayTokens(days: string): string[] {
  return days
    .split(",")
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean);
}

function normalizeTimeTokens(time: string): string[] {
  return time
    .split(",")
    .map((token) => token.trim())
    .filter(Boolean);
}

export function isSupportedCronDays(days: string): boolean {
  const tokens = normalizeDayTokens(days);
  if (tokens.length === 0) return false;

  if (tokens.length === 1) {
    return DAY_SHORTCUTS.has(tokens[0]) || WEEKDAY_SET.has(tokens[0]);
  }

  return tokens.every((token) => WEEKDAY_SET.has(token));
}

export function isSupportedCronTime(time: string): boolean {
  const trimmed = time.trim();
  if (!trimmed) return false;

  if (INTERVAL_TIME_RE.test(trimmed)) {
    return true;
  }

  const parts = normalizeTimeTokens(trimmed);
  return parts.length > 0 && parts.every((part) => FIXED_TIME_RE.test(part));
}

export function isSupportedCronSchedule(time: string, days: string): boolean {
  return isSupportedCronTime(time) && isSupportedCronDays(days);
}

export function getCronScheduleValidationError(
  time: string,
  days: string
): string | null {
  if (!isSupportedCronTime(time)) {
    return "Unsupported time schedule. Use HH:MM, comma-separated HH:MM values, every_Nm, or every_Nh.";
  }

  if (!isSupportedCronDays(days)) {
    return "Unsupported day schedule. Use daily, weekdays, weekends, or comma-separated weekday tokens like mon,wed.";
  }

  return null;
}

function matchesDays(date: Date, days: string): boolean {
  const tokens = normalizeDayTokens(days);
  if (tokens.length === 0) return false;

  const dayToken = WEEKDAY_TOKENS[date.getDay() === 0 ? 6 : date.getDay() - 1];
  if (tokens.length === 1) {
    switch (tokens[0]) {
      case "daily":
        return true;
      case "weekdays":
        return dayToken !== "sat" && dayToken !== "sun";
      case "weekends":
        return dayToken === "sat" || dayToken === "sun";
      default:
        return tokens[0] === dayToken;
    }
  }

  return tokens.includes(dayToken);
}

function getNextFixedRun(time: string, days: string, now: Date): Date | null {
  const times = normalizeTimeTokens(time);
  if (times.length === 0) return null;

  let earliest: Date | null = null;

  for (let offset = 0; offset < 14; offset++) {
    const day = new Date(now);
    day.setDate(now.getDate() + offset);
    day.setSeconds(0, 0);

    if (!matchesDays(day, days)) {
      continue;
    }

    for (const fixedTime of times) {
      const [hours, minutes] = fixedTime.split(":").map(Number);
      const candidate = new Date(day);
      candidate.setHours(hours, minutes, 0, 0);

      if (candidate <= now) {
        continue;
      }

      if (!earliest || candidate < earliest) {
        earliest = candidate;
      }
    }

    if (earliest) {
      return earliest;
    }
  }

  return null;
}

function getNextIntervalRun(time: string, days: string, now: Date): Date | null {
  const match = time.trim().match(INTERVAL_TIME_RE);
  if (!match) return null;

  const interval = Number(match[1]);
  const unit = match[2];
  const cursor = new Date(now);
  cursor.setSeconds(0, 0);

  if (unit === "m") {
    cursor.setMinutes(cursor.getMinutes() + 1);
    for (let i = 0; i < 60 * 24 * 14; i++) {
      if (matchesDays(cursor, days) && cursor.getMinutes() % interval === 0) {
        return new Date(cursor);
      }
      cursor.setMinutes(cursor.getMinutes() + 1);
    }
    return null;
  }

  cursor.setMinutes(0, 0, 0);
  if (cursor <= now) {
    cursor.setHours(cursor.getHours() + 1);
  }

  for (let i = 0; i < 24 * 14; i++) {
    if (matchesDays(cursor, days) && cursor.getHours() % interval === 0) {
      return new Date(cursor);
    }
    cursor.setHours(cursor.getHours() + 1);
  }

  return null;
}

function getNextRunForSchedule(time: string, days: string, active: boolean): string | null {
  if (!active || !isSupportedCronSchedule(time, days)) {
    return null;
  }

  const now = new Date();
  const next =
    INTERVAL_TIME_RE.test(time.trim())
      ? getNextIntervalRun(time, days, now)
      : getNextFixedRun(time, days, now);

  return next ? next.toISOString() : null;
}

export function toCronExpression(
  time: string,
  days: string
): string | null {
  if (!isSupportedCronSchedule(time, days)) {
    return null;
  }

  const cronDays = normalizeDayTokens(days)
    .map((token) => DAY_MAP[token] ?? token)
    .join(",");

  const intervalMatch = time.trim().match(INTERVAL_TIME_RE);
  if (intervalMatch) {
    const interval = Number(intervalMatch[1]);
    const unit = intervalMatch[2];
    return unit === "m"
      ? `*/${interval} * * * ${cronDays}`
      : `0 */${interval} * * ${cronDays}`;
  }

  const times = normalizeTimeTokens(time);
  const uniqueMinutes = [...new Set(times.map((token) => token.split(":")[1]))];
  if (uniqueMinutes.length !== 1) {
    return null;
  }

  const minute = uniqueMinutes[0];
  const hours = times.map((token) => token.split(":")[0]).join(",");
  return `${minute} ${hours} * * ${cronDays}`;
}

function readRunStatus(slug: string): CronRunStatus | null {
  const config = getConfig();
  const statusPath = path.join(
    config.agenticOsDir,
    "cron",
    "status",
    `${slug}.json`
  );

  try {
    const raw = fs.readFileSync(statusPath, "utf-8");
    const data = JSON.parse(raw) as {
      last_run?: string;
      result?: CronResult;
      duration?: number;
      exit_code?: number;
      run_count?: number;
      fail_count?: number;
    };

    if (!data.last_run || !data.result) {
      return null;
    }

    return {
      lastRun: data.last_run,
      result: data.result,
      duration: data.duration ?? 0,
      exitCode: data.exit_code ?? 0,
      runCount: data.run_count ?? 0,
      failCount: data.fail_count ?? 0,
    };
  } catch {
    return null;
  }
}

function parseJobFile(
  filePath: string,
  slug: string
): CronJob {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  const active = String(data.active ?? "true").toLowerCase() === "true";
  const retry = parseInt(String(data.retry || "0"), 10);
  const time = String(data.time || "00:00");
  const days = String(data.days || "daily");

  const nextRun = getNextRunForSchedule(time, days, active);
  const lastRun = readRunStatus(slug);

  const db = getDb();
  const statsRow = db
    .prepare(
      `SELECT
        COUNT(*) as totalRuns,
        COALESCE(AVG(durationSec), 0) as avgDurationSec,
        COALESCE(AVG(costUsd), 0) as avgCostUsd
      FROM cron_runs
      WHERE jobSlug = ?`
    )
    .get(slug) as { totalRuns: number; avgDurationSec: number; avgCostUsd: number };

  const stats: CronStats = {
    totalRuns: statsRow?.totalRuns ?? 0,
    avgDurationSec: statsRow?.avgDurationSec ?? 0,
    avgCostUsd: statsRow?.avgCostUsd ?? 0,
  };

  return {
    name: String(data.name || slug),
    slug,
    description: String(data.description || ""),
    time,
    days,
    active,
    model: String(data.model || "sonnet"),
    notify: String(data.notify || "on_finish"),
    timeout: String(data.timeout || DEFAULT_TIMEOUT),
    retry: Number.isFinite(retry) ? retry : 0,
    nextRun,
    lastRun,
    stats,
    prompt: content.trim(),
  };
}

export function listCronJobs(clientId?: string | null): CronJob[] {
  const baseDir = getClientAgenticOsDir(clientId ?? null);
  const jobsDir = path.join(baseDir, "cron", "jobs");

  try {
    const files = fs.readdirSync(jobsDir);
    return files
      .filter((f) => f.endsWith(".md"))
      .map((f) => {
        const slug = f.replace(/\.md$/, "");
        return parseJobFile(path.join(jobsDir, f), slug);
      });
  } catch {
    return [];
  }
}

export function getCronJob(slug: string): CronJob | null {
  const config = getConfig();
  const filePath = path.join(
    config.agenticOsDir,
    "cron",
    "jobs",
    `${slug}.md`
  );

  try {
    return parseJobFile(filePath, slug);
  } catch {
    return null;
  }
}

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+$/, "")
    .replace(/^-+/, "");
}

export function createCronJob(input: CronJobCreateInput): CronJob {
  const config = getConfig();
  const slug = toSlug(input.name);
  const jobsDir = path.join(config.agenticOsDir, "cron", "jobs");

  fs.mkdirSync(jobsDir, { recursive: true });

  const frontmatter: Record<string, string> = {
    name: input.name,
    time: input.time,
    days: input.days,
    active: "true",
    model: input.model || "sonnet",
    notify: input.notify || "on_finish",
    description: input.description,
    timeout: input.timeout || DEFAULT_TIMEOUT,
    retry: String(input.retry ?? 0),
  };

  const fileContent = matter.stringify(input.prompt, frontmatter);
  const tmpPath = path.join(jobsDir, `${slug}.tmp`);
  const finalPath = path.join(jobsDir, `${slug}.md`);
  fs.writeFileSync(tmpPath, fileContent, "utf-8");
  fs.renameSync(tmpPath, finalPath);

  return parseJobFile(finalPath, slug);
}

export function updateCronJob(
  slug: string,
  input: CronJobUpdateInput
): CronJob {
  const config = getConfig();
  const jobsDir = path.join(config.agenticOsDir, "cron", "jobs");
  const filePath = path.join(jobsDir, `${slug}.md`);

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  if (input.name !== undefined) data.name = input.name;
  if (input.description !== undefined) data.description = input.description;
  if (input.time !== undefined) data.time = input.time;
  if (input.days !== undefined) data.days = input.days;
  if (input.active !== undefined) data.active = String(input.active);
  if (input.model !== undefined) data.model = input.model;
  if (input.notify !== undefined) data.notify = input.notify;
  if (input.timeout !== undefined) data.timeout = input.timeout;
  if (input.retry !== undefined) data.retry = String(input.retry);

  const newPrompt = input.prompt !== undefined ? input.prompt : content.trim();
  const fileContent = matter.stringify(newPrompt, data);

  const tmpPath = path.join(jobsDir, `${slug}.tmp`);
  fs.writeFileSync(tmpPath, fileContent, "utf-8");
  fs.renameSync(tmpPath, filePath);

  return parseJobFile(filePath, slug);
}

export function deleteCronJob(slug: string): void {
  const config = getConfig();
  const filePath = path.join(
    config.agenticOsDir,
    "cron",
    "jobs",
    `${slug}.md`
  );
  fs.unlinkSync(filePath);
}

export function getCronRunHistory(slug: string): CronRun[] {
  const db = getDb();

  interface CronRunRow {
    id: number;
    jobSlug: string;
    taskId: string | null;
    startedAt: string;
    completedAt: string | null;
    result: CronRunResult;
    durationSec: number | null;
    costUsd: number | null;
    exitCode: number | null;
    trigger: "manual" | "scheduled" | null;
  }

  const rows = db
    .prepare(
      `SELECT id, jobSlug, taskId, startedAt, completedAt, result, durationSec, costUsd, exitCode, trigger
       FROM cron_runs
       WHERE jobSlug = ?
       ORDER BY startedAt DESC
       LIMIT 50`
    )
    .all(slug) as CronRunRow[];

  if (rows.length > 0) {
    return rows.map((row) => {
      let outputs: CronRun["outputs"] = [];
      if (row.taskId) {
        outputs = db
          .prepare(
            `SELECT fileName, filePath, extension FROM task_outputs WHERE taskId = ? ORDER BY createdAt ASC`
          )
          .all(row.taskId) as CronRun["outputs"];
      }
      return { ...row, trigger: row.trigger || "scheduled", outputs };
    });
  }

  const status = readRunStatus(slug);
  if (!status || !status.lastRun) return [];

  const startedAt = status.lastRun;
  const durationSec = status.duration ?? 0;
  const completedAt = new Date(
    new Date(startedAt).getTime() + durationSec * 1000
  ).toISOString();

  return [
    {
      id: -1,
      jobSlug: slug,
      taskId: null,
      startedAt,
      completedAt,
      result: status.result ?? "success",
      durationSec,
      costUsd: 0,
      exitCode: status.exitCode ?? 0,
      trigger: "scheduled" as const,
      outputs: [],
    },
  ];
}

export function getRawJobFile(slug: string): string | null {
  const config = getConfig();
  const filePath = path.join(
    config.agenticOsDir,
    "cron",
    "jobs",
    `${slug}.md`
  );
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return null;
  }
}

export function getCronJobLog(slug: string): string {
  const config = getConfig();
  const logPath = path.join(config.agenticOsDir, "cron", "logs", `${slug}.log`);
  try {
    const content = fs.readFileSync(logPath, "utf-8");
    if (content.length > 50000) {
      return "... (truncated)\n" + content.slice(-50000);
    }
    return content;
  } catch {
    return "";
  }
}
