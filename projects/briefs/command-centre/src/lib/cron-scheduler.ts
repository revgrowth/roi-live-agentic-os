/**
 * In-Process Cron Scheduler
 *
 * Runs inside the Command Centre (Next.js server) process. Ticks every 60
 * seconds, scans cron/jobs/*.md for due jobs, and executes them through the
 * existing processManager.executeTask() pipeline.
 *
 * When the server shuts down, this scheduler stops — no jobs run while the
 * service is down.  This replaces the external OS-level schedulers (Windows
 * Task Scheduler, launchd, crontab) for Command Centre users.
 */

import fs from "fs";
import path from "path";
import { getConfig } from "./config";
import { listCronJobs, isSupportedCronSchedule } from "./cron-service";
import { getDb } from "./db";
import { emitTaskEvent } from "./event-bus";
import type { Task } from "@/types/task";
import type { CronJob } from "@/types/cron";

const TICK_INTERVAL_MS = 60_000; // 1 minute
const CATCHUP_MAX_GAP_SEC = 86_400; // 24 hours

const globalKey = "__cron_scheduler__";
const globalObj = globalThis as Record<string, unknown>;

// ── Schedule matching (mirrors run-crons.ps1 / run-crons.sh logic) ──────

const WEEKDAY_TOKENS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
const INTERVAL_TIME_RE = /^every_([1-9]\d*)([mh])$/;

function normalizeDayTokens(days: string): string[] {
  return days
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
}

function matchesDays(now: Date, days: string): boolean {
  const tokens = normalizeDayTokens(days);
  if (tokens.length === 0) return false;

  const dayToken = WEEKDAY_TOKENS[now.getDay() === 0 ? 6 : now.getDay() - 1];

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

function matchesTime(now: Date, schedule: string): boolean {
  const trimmed = schedule.trim();

  // Interval: every_Nm — run when minute is divisible by N
  const intervalMatch = trimmed.match(INTERVAL_TIME_RE);
  if (intervalMatch) {
    const interval = Number(intervalMatch[1]);
    const unit = intervalMatch[2];
    if (unit === "m") {
      return now.getMinutes() % interval === 0;
    }
    // every_Nh — run on the hour when hour is divisible by N
    return now.getMinutes() === 0 && now.getHours() % interval === 0;
  }

  // Fixed time(s): "09:00" or "09:00,13:00"
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const times = trimmed
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return times.includes(currentTime);
}

function isFixedTimeSchedule(schedule: string): boolean {
  return !INTERVAL_TIME_RE.test(schedule.trim());
}

/**
 * Check whether a fixed-time schedule was missed between `start` and `end`.
 */
function wasScheduleMissedInRange(
  schedule: string,
  days: string,
  start: Date,
  end: Date
): boolean {
  if (!isFixedTimeSchedule(schedule)) return false;

  const times = schedule
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  // Walk day by day
  const cursor = new Date(start);
  cursor.setHours(0, 0, 0, 0);

  while (cursor <= end) {
    if (matchesDays(cursor, days)) {
      for (const time of times) {
        const [hours, minutes] = time.split(":").map(Number);
        const candidate = new Date(cursor);
        candidate.setHours(hours, minutes, 0, 0);

        if (candidate > start && candidate < end) {
          return true;
        }
      }
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return false;
}

// ── Scheduler state ──────────────────────────────────────────────────────

interface SchedulerState {
  interval: ReturnType<typeof setInterval> | null;
  /** Track last-fired minute per job slug to prevent double-fires */
  lastFiredMinute: Map<string, string>;
}

function getState(): SchedulerState {
  if (!globalObj[globalKey]) {
    globalObj[globalKey] = {
      interval: null,
      lastFiredMinute: new Map(),
    } satisfies SchedulerState;
  }
  return globalObj[globalKey] as SchedulerState;
}

// ── Task creation (mirrors /api/cron/[name]/run) ─────────────────────────

function createCronTask(job: CronJob, trigger: "scheduled" | "catchup"): void {
  try {
    const db = getDb();
    const now = new Date().toISOString();

    const minOrder = db
      .prepare(
        "SELECT COALESCE(MIN(columnOrder), 1) as minOrder FROM tasks WHERE status = 'backlog'"
      )
      .get() as { minOrder: number };

    const label = trigger === "catchup" ? " (catch-up)" : "";
    const task: Task = {
      id: crypto.randomUUID(),
      title: `${job.name}${label}`,
      description: job.prompt,
      status: "queued",
      level: "task",
      parentId: null,
      projectSlug: null,
      columnOrder: minOrder.minOrder - 1,
      createdAt: now,
      updatedAt: now,
      costUsd: null,
      tokensUsed: null,
      durationMs: null,
      activityLabel: `Queued — ${trigger === "catchup" ? "catch-up" : "scheduled"}`,
      errorMessage: null,
      startedAt: null,
      completedAt: null,
      clientId: null,
      needsInput: false,
      phaseNumber: null,
      gsdStep: null,
      contextSources: null,
      cronJobSlug: job.slug,
      claudeSessionId: null,
      permissionMode: "default",
      lastReplyAt: null,
      goalGroup: null,
    };

    db.prepare(
      `INSERT INTO tasks (id, title, description, status, level, parentId, projectSlug, columnOrder, createdAt, updatedAt, costUsd, tokensUsed, durationMs, activityLabel, errorMessage, startedAt, completedAt, clientId, needsInput, phaseNumber, gsdStep, cronJobSlug)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      task.id,
      task.title,
      task.description,
      task.status,
      task.level,
      task.parentId,
      task.projectSlug,
      task.columnOrder,
      task.createdAt,
      task.updatedAt,
      task.costUsd,
      task.tokensUsed,
      task.durationMs,
      task.activityLabel,
      task.errorMessage,
      task.startedAt,
      task.completedAt,
      task.clientId,
      0,
      task.phaseNumber,
      task.gsdStep,
      task.cronJobSlug
    );

    // Insert a cron_runs row so run history shows "Running" right away
    db.prepare(
      `INSERT INTO cron_runs (jobSlug, taskId, startedAt, result, trigger)
       VALUES (?, ?, ?, 'running', 'scheduled')`
    ).run(job.slug, task.id, now);

    // Emit events so the kanban board updates and queue-watcher picks it up
    emitTaskEvent({ type: "task:created", task, timestamp: now });
    emitTaskEvent({ type: "task:status", task, timestamp: now });

    console.log(
      `[cron-scheduler] Queued "${job.name}" (slug: ${job.slug}) as task ${task.id.slice(0, 8)} [${trigger}]`
    );
  } catch (err) {
    console.error(`[cron-scheduler] Error creating task for "${job.name}":`, err);
  }
}

// ── Dispatcher heartbeat ─────────────────────────────────────────────────

function readDispatcherTimestamp(): Date | null {
  try {
    const config = getConfig();
    const statusPath = path.join(config.agenticOsDir, "cron", "status", "dispatcher.json");
    if (!fs.existsSync(statusPath)) return null;
    const raw = JSON.parse(fs.readFileSync(statusPath, "utf-8"));
    if (raw.last_dispatch) {
      return new Date(raw.last_dispatch);
    }
  } catch {
    // Ignore malformed file
  }
  return null;
}

function writeDispatcherTimestamp(): void {
  try {
    const config = getConfig();
    const statusDir = path.join(config.agenticOsDir, "cron", "status");
    fs.mkdirSync(statusDir, { recursive: true });
    const statusPath = path.join(statusDir, "dispatcher.json");
    const data = JSON.stringify({
      last_dispatch: new Date().toISOString(),
      pid: process.pid,
      source: "command-centre",
    });
    fs.writeFileSync(statusPath, data, "utf-8");
  } catch {
    // Non-fatal
  }
}

// ── Catch-up: run missed fixed-time jobs ─────────────────────────────────

function runCatchUp(): void {
  const lastDispatch = readDispatcherTimestamp();
  if (!lastDispatch) return;

  const now = new Date();
  const gapSec = (now.getTime() - lastDispatch.getTime()) / 1000;

  // Only catch up if gap > 2 minutes
  if (gapSec <= 120) return;

  const effectiveStart =
    gapSec > CATCHUP_MAX_GAP_SEC
      ? new Date(now.getTime() - CATCHUP_MAX_GAP_SEC * 1000)
      : lastDispatch;

  console.log(
    `[cron-scheduler] Catch-up: gap of ${Math.round(gapSec)}s detected since last dispatch`
  );

  try {
    const jobs = listCronJobs(null);
    const todayStr = now.toISOString().slice(0, 10);
    const config = getConfig();

    for (const job of jobs) {
      if (!job.active || !job.prompt) continue;
      if (!isSupportedCronSchedule(job.time, job.days)) continue;
      if (!isFixedTimeSchedule(job.time)) continue; // Don't catch up intervals

      // Check if this schedule was missed in the gap
      if (!wasScheduleMissedInRange(job.time, job.days, effectiveStart, now)) continue;

      // One catch-up per job per day (marker file)
      const markerPath = path.join(
        config.agenticOsDir,
        "cron",
        "status",
        `${job.slug}.catchup`
      );
      try {
        if (fs.existsSync(markerPath)) {
          const marker = fs.readFileSync(markerPath, "utf-8").trim();
          if (marker === todayStr) continue;
        }
      } catch {
        // OK to proceed
      }

      // Write marker before queuing to prevent duplicates
      try {
        fs.writeFileSync(markerPath, todayStr, "utf-8");
      } catch {
        // Non-fatal
      }

      createCronTask(job, "catchup");
    }
  } catch (err) {
    console.error("[cron-scheduler] Catch-up error:", err);
  }
}

// ── Main tick ────────────────────────────────────────────────────────────

function tick(): void {
  const now = new Date();
  const minuteKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}-${now.getMinutes()}`;
  const state = getState();

  try {
    const jobs = listCronJobs(null);
    const todayStr = now.toISOString().slice(0, 10);
    const config = getConfig();

    for (const job of jobs) {
      if (!job.active || !job.prompt) continue;
      if (!isSupportedCronSchedule(job.time, job.days)) continue;
      if (!matchesDays(now, job.days)) continue;
      if (!matchesTime(now, job.time)) continue;

      // Prevent double-fire in the same minute
      const fireKey = `${job.slug}:${minuteKey}`;
      if (state.lastFiredMinute.has(fireKey)) continue;

      // For fixed-time jobs, skip if catch-up already fired today
      if (isFixedTimeSchedule(job.time)) {
        const markerPath = path.join(
          config.agenticOsDir,
          "cron",
          "status",
          `${job.slug}.catchup`
        );
        try {
          if (fs.existsSync(markerPath)) {
            const marker = fs.readFileSync(markerPath, "utf-8").trim();
            if (marker === todayStr) continue;
          }
        } catch {
          // OK to proceed
        }
      }

      // Mark as fired
      state.lastFiredMinute.set(fireKey, now.toISOString());

      // Create and queue the task (parallel — each goes through processManager independently)
      createCronTask(job, "scheduled");
    }

    // Prune old entries from lastFiredMinute (keep only current minute)
    for (const key of state.lastFiredMinute.keys()) {
      if (!key.endsWith(`:${minuteKey}`)) {
        state.lastFiredMinute.delete(key);
      }
    }
  } catch (err) {
    console.error("[cron-scheduler] Tick error:", err);
  }

  // Write dispatcher heartbeat
  writeDispatcherTimestamp();
}

// ── Public API ───────────────────────────────────────────────────────────

let initialized = false;

/**
 * Initialize the in-process cron scheduler.
 * Call once on server startup (from instrumentation.ts).
 * Idempotent — safe to call multiple times.
 */
export function initCronScheduler(): void {
  if (initialized) return;
  initialized = true;

  const state = getState();
  if (state.interval) return; // Already running (e.g. HMR reload)

  console.log("[cron-scheduler] Starting in-process cron scheduler (60s interval)");

  // Run catch-up for missed jobs since last dispatch
  try {
    runCatchUp();
  } catch (err) {
    console.error("[cron-scheduler] Catch-up on init failed:", err);
  }

  // Write initial dispatcher heartbeat
  writeDispatcherTimestamp();

  // Start the ticker
  state.interval = setInterval(tick, TICK_INTERVAL_MS);

  // Clean up on process exit
  const cleanup = () => {
    console.log("[cron-scheduler] Shutting down cron scheduler");
    if (state.interval) {
      clearInterval(state.interval);
      state.interval = null;
    }
  };

  process.on("exit", cleanup);
  process.on("SIGTERM", cleanup);
  process.on("SIGINT", cleanup);
}

/**
 * Returns true if the in-process scheduler is running.
 * Used by cron-system-status to report scheduler state.
 */
export function isCronSchedulerRunning(): boolean {
  const state = getState();
  return state.interval !== null;
}
