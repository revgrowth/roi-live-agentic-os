import { onTaskEvent, emitTaskEvent, type TaskEvent } from "./event-bus";
import { processManager } from "./process-manager";
import { getDb } from "./db";
import type { Task } from "@/types/task";

let initialized = false;

/**
 * Initialize the queue watcher.
 * Listens for task events and auto-executes tasks that enter 'queued' status.
 * Resets orphaned queued/running tasks from previous sessions back to backlog.
 *
 * Idempotent -- safe to call multiple times.
 */
export function initQueueWatcher(): void {
  if (initialized) return;
  initialized = true;

  console.log("[queue-watcher] Initializing queue watcher");

  // Listen for task events — execute when a task enters 'queued' status
  onTaskEvent((event: TaskEvent) => {
    // Trigger on status changes, updates, or newly created tasks that are already queued
    if (event.type !== "task:status" && event.type !== "task:updated" && event.type !== "task:created") return;
    if (event.task.status !== "queued") return;

    console.log(`[queue-watcher] Task ${event.task.id} entered queued status (via ${event.type}), triggering execution`);
    processManager.executeTask(event.task.id).catch((err) => {
      console.error(`[queue-watcher] Failed to execute task ${event.task.id}:`, err);
    });
  });

  // Recovery: handle orphaned tasks from previous server session
  try {
    const db = getDb();
    const now = new Date().toISOString();

    // Tasks that were actively running (no pending question) → back to backlog
    const orphanedRunning = db
      .prepare("SELECT * FROM tasks WHERE status = 'running' AND needsInput = 0 ORDER BY columnOrder ASC")
      .all() as Task[];

    // Tasks that were waiting for input → move to review (work was done, just can't continue the conversation)
    const orphanedWaiting = db
      .prepare("SELECT * FROM tasks WHERE status = 'running' AND needsInput = 1 ORDER BY columnOrder ASC")
      .all() as Task[];

    // Queued tasks that never started → back to backlog
    const orphanedQueued = db
      .prepare("SELECT * FROM tasks WHERE status = 'queued' ORDER BY columnOrder ASC")
      .all() as Task[];

    if (orphanedRunning.length > 0) {
      console.log(`[queue-watcher] Resetting ${orphanedRunning.length} orphaned running task(s) to backlog`);
      for (const task of orphanedRunning) {
        db.prepare(
          "UPDATE tasks SET status = 'backlog', updatedAt = ?, activityLabel = NULL, startedAt = NULL, errorMessage = NULL, needsInput = 0 WHERE id = ?"
        ).run(now, task.id);
        const updated = db.prepare("SELECT * FROM tasks WHERE id = ?").get(task.id) as Task;
        emitTaskEvent({ type: "task:status", task: updated, timestamp: now });
      }
    }

    if (orphanedWaiting.length > 0) {
      console.log(`[queue-watcher] Moving ${orphanedWaiting.length} waiting-for-input task(s) to review`);
      for (const task of orphanedWaiting) {
        db.prepare(
          "UPDATE tasks SET status = 'review', updatedAt = ?, activityLabel = NULL, needsInput = 0, errorMessage = NULL WHERE id = ?"
        ).run(now, task.id);
        const updated = db.prepare("SELECT * FROM tasks WHERE id = ?").get(task.id) as Task;
        emitTaskEvent({ type: "task:status", task: updated, timestamp: now });
      }
    }

    if (orphanedQueued.length > 0) {
      console.log(`[queue-watcher] Resetting ${orphanedQueued.length} queued task(s) to backlog`);
      for (const task of orphanedQueued) {
        db.prepare(
          "UPDATE tasks SET status = 'backlog', updatedAt = ?, activityLabel = NULL, startedAt = NULL, errorMessage = NULL WHERE id = ?"
        ).run(now, task.id);
        const updated = db.prepare("SELECT * FROM tasks WHERE id = ?").get(task.id) as Task;
        emitTaskEvent({ type: "task:status", task: updated, timestamp: now });
      }
    }

    // Reconcile stuck cron_runs: rows with result='running' whose linked tasks
    // are already in a terminal state (review/done) or were reset to backlog.
    // This handles cases where recordCronRun didn't fire (e.g. server restart mid-run).
    const stuckCronRuns = db
      .prepare(
        `SELECT cr.id as cronRunId, cr.taskId, cr.jobSlug, t.status as taskStatus,
                t.completedAt, t.errorMessage, t.costUsd, t.durationMs, t.startedAt as taskStartedAt
         FROM cron_runs cr
         LEFT JOIN tasks t ON cr.taskId = t.id
         WHERE cr.result = 'running'`
      )
      .all() as Array<{
        cronRunId: number; taskId: string | null; jobSlug: string;
        taskStatus: string | null; completedAt: string | null;
        errorMessage: string | null; costUsd: number | null;
        durationMs: number | null; taskStartedAt: string | null;
      }>;

    if (stuckCronRuns.length > 0) {
      console.log(`[queue-watcher] Reconciling ${stuckCronRuns.length} stuck cron_runs row(s)`);
      for (const row of stuckCronRuns) {
        if (!row.taskId || !row.taskStatus || row.taskStatus === "running" || row.taskStatus === "queued") {
          // Task is still active or missing — mark cron run as failure (orphaned)
          db.prepare(
            `UPDATE cron_runs SET completedAt = ?, result = 'failure', durationSec = 0 WHERE id = ?`
          ).run(now, row.cronRunId);
        } else {
          // Task reached a terminal state — update cron run to match
          const result = row.errorMessage ? "failure" : "success";
          const durationSec = row.durationMs ? Math.round(row.durationMs / 1000) : 0;
          db.prepare(
            `UPDATE cron_runs SET completedAt = ?, result = ?, durationSec = ?, costUsd = ? WHERE id = ?`
          ).run(row.completedAt || now, result, durationSec, row.costUsd || 0, row.cronRunId);
        }
      }
    }
  } catch (err) {
    console.error("[queue-watcher] Error during recovery scan:", err);
  }

  // Reaper: periodically check for stuck tasks
  const REAP_INTERVAL_MS = 10_000;
  setInterval(() => {
    try {
      const db = getDb();
      const now = new Date().toISOString();

      // 1. PID-based reaping: tasks stuck in 'running' with a dead PID
      // Only reap 'running' tasks — 'review' tasks already completed normally
      // via handleTurnComplete; their stale claudePid just needs clearing.
      const pidCandidates = db
        .prepare(
          `SELECT * FROM tasks
           WHERE status = 'running'
             AND claudePid IS NOT NULL`
        )
        .all() as Task[];

      for (const task of pidCandidates) {
        if (processManager.hasActiveSession(task.id)) continue;

        let alive = false;
        try {
          process.kill(task.claudePid!, 0);
          alive = true;
        } catch {
          alive = false;
        }

        if (!alive) {
          console.log(
            `[queue-watcher] Reaper: Claude PID ${task.claudePid} for task ${task.id} is dead — marking done`
          );
          db.prepare(
            `UPDATE tasks SET status = 'done', completedAt = COALESCE(completedAt, ?), updatedAt = ?,
             activityLabel = 'Session ended', claudePid = NULL,
             durationMs = CASE WHEN startedAt IS NOT NULL
               THEN CAST((julianday(?) - julianday(startedAt)) * 86400000 AS INTEGER)
               ELSE durationMs END
             WHERE id = ?`
          ).run(now, now, now, task.id);
          const updated = db
            .prepare("SELECT * FROM tasks WHERE id = ?")
            .get(task.id) as Task;
          emitTaskEvent({
            type: "task:status",
            task: { ...updated, needsInput: Boolean(updated.needsInput) },
            timestamp: now,
          });
        }
      }

      // Clear stale claudePid on review/done tasks (process already exited normally)
      db.prepare(
        `UPDATE tasks SET claudePid = NULL
         WHERE status IN ('review', 'done') AND claudePid IS NOT NULL`
      ).run();

      // 2. Stuck needsInput reaping: tasks in "running" + needsInput=1 with no active
      //    process-manager session. These are tasks where the Claude process exited but
      //    the task was left in "running" due to question detection. If no process is
      //    managing them, move to "review" so they're actionable.
      const stuckInputTasks = db
        .prepare(
          `SELECT * FROM tasks
           WHERE status = 'running'
             AND needsInput = 1`
        )
        .all() as Task[];

      for (const task of stuckInputTasks) {
        if (processManager.hasActiveSession(task.id)) continue;

        // Task is in "running" + needsInput but no process is managing it — it's stuck
        console.log(
          `[queue-watcher] Reaper: Task ${task.id.slice(0, 8)} "${task.title}" stuck in running+needsInput with no active session — moving to review`
        );
        db.prepare(
          `UPDATE tasks SET status = 'review', updatedAt = ?, completedAt = COALESCE(completedAt, ?), needsInput = 0 WHERE id = ?`
        ).run(now, now, task.id);

        const updated = db.prepare("SELECT * FROM tasks WHERE id = ?").get(task.id) as Task;
        emitTaskEvent({
          type: "task:status",
          task: { ...updated, needsInput: Boolean(updated.needsInput) },
          timestamp: now,
        });

        // Also close any stuck cron_runs for this task
        if (updated.cronJobSlug) {
          db.prepare(
            `UPDATE cron_runs SET completedAt = ?, result = 'success', durationSec = COALESCE(
              CAST((julianday(?) - julianday(startedAt)) * 86400 AS INTEGER), 0
            ) WHERE taskId = ? AND result = 'running'`
          ).run(now, now, task.id);
        }
      }
    } catch (err) {
      console.error("[queue-watcher] Reaper error:", err);
    }
  }, REAP_INTERVAL_MS);

  console.log("[queue-watcher] Queue watcher ready (reaper interval: 10s)");
}
