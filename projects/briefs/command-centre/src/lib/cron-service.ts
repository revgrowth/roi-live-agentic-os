import matter from "gray-matter";
import { Cron } from "croner";
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

export function toCronExpression(
  time: string,
  days: string
): string | null {
  // Interval formats like "every_5m" cannot map to standard cron
  if (days.startsWith("every_") || time.startsWith("every_")) {
    return null;
  }

  // Parse time — could be "09:00" or "09:00,17:00" (multi-time)
  const times = time.split(",").map((t) => t.trim());
  const firstTime = times[0];
  const [hour, minute] = firstTime.split(":").map(Number);

  if (isNaN(hour) || isNaN(minute)) return null;

  // Parse days
  const dayParts = days
    .split(",")
    .map((d) => d.trim().toLowerCase());
  const cronDays = dayParts
    .map((d) => DAY_MAP[d] ?? d)
    .join(",");

  // Multi-time: combine hours
  if (times.length > 1) {
    const hours = times
      .map((t) => {
        const [h] = t.split(":").map(Number);
        return h;
      })
      .join(",");
    return `${minute} ${hours} * * ${cronDays}`;
  }

  return `${minute} ${hour} * * ${cronDays}`;
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
    const data = JSON.parse(raw);
    return {
      lastRun: data.last_run,
      result: data.result as "success" | "failure",
      duration: data.duration,
      exitCode: data.exit_code,
      runCount: data.run_count,
      failCount: data.fail_count,
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

  const active = String(data.active).toLowerCase() === "true";
  const retry = parseInt(String(data.retry || "0"), 10);

  const cronExpr = toCronExpression(
    data.time || "00:00",
    data.days || "daily"
  );

  let nextRun: string | null = null;
  if (cronExpr && active) {
    try {
      const cron = new Cron(cronExpr);
      const next = cron.nextRun();
      nextRun = next ? next.toISOString() : null;
    } catch {
      nextRun = null;
    }
  }

  const lastRun = readRunStatus(slug);

  // Calculate stats from SQLite run history
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
    name: data.name || slug,
    slug,
    description: data.description || "",
    time: data.time || "00:00",
    days: data.days || "daily",
    active,
    model: data.model || "sonnet",
    notify: data.notify || "on_finish",
    timeout: data.timeout || "5m",
    retry,
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

  // Ensure directory exists
  fs.mkdirSync(jobsDir, { recursive: true });

  const frontmatter: Record<string, string> = {
    name: input.name,
    time: input.time,
    days: input.days,
    active: "true",
    model: input.model || "sonnet",
    notify: input.notify || "on_finish",
    description: input.description,
    timeout: input.timeout || "5m",
    retry: String(input.retry ?? 0),
  };

  const fileContent = matter.stringify(input.prompt, frontmatter);

  // Atomic write: write to temp file then rename
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

  // Merge updates into frontmatter
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

  // Atomic write
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
    result: "success" | "failure" | "running";
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
    // Fetch outputs for each run that has a taskId
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

  // Fallback: synthesize a single entry from the status JSON file
  // (covers runs that happened before SQLite recording was added)
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
    // Return last 50KB max to avoid sending huge logs
    if (content.length > 50000) {
      return "... (truncated)\n" + content.slice(-50000);
    }
    return content;
  } catch {
    return "";
  }
}
