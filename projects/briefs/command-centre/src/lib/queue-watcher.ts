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

    // Tasks that were actively running (no pending question) — re-queue them
    // so they restart on this server session. Parent tasks with children
    // stay as-is (container tasks, not executed directly).
    const orphanedRunning = db
      .prepare(
        `SELECT t.* FROM tasks t
         WHERE t.status = 'running' AND t.needsInput = 0
         AND NOT EXISTS (SELECT 1 FROM tasks c WHERE c.parentId = t.id)
         ORDER BY t.columnOrder ASC`
      )
      .all() as Task[];

    // Tasks that were waiting for input → move to review (work was done, just can't continue the conversation)
    const orphanedWaiting = db
      .prepare("SELECT * FROM tasks WHERE status = 'running' AND needsInput = 1 ORDER BY columnOrder ASC")
      .all() as Task[];

    // Queued tasks that never started → re-queue (they'll execute immediately)
    const orphanedQueued = db
      .prepare("SELECT * FROM tasks WHERE status = 'queued' ORDER BY columnOrder ASC")
      .all() as Task[];

    if (orphanedRunning.length > 0) {
      console.log(`[queue-watcher] Re-queuing ${orphanedRunning.length} orphaned running task(s)`);
      for (const task of orphanedRunning) {
        db.prepare(
          "UPDATE tasks SET status = 'queued', updatedAt = ?, activityLabel = NULL, startedAt = NULL, errorMessage = NULL, needsInput = 0 WHERE id = ?"
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

    // Orphaned queued tasks will be picked up by the event listener above
    // since they're already in 'queued' status — no action needed.
    if (orphanedQueued.length > 0) {
      console.log(`[queue-watcher] Found ${orphanedQueued.length} queued task(s) — re-triggering execution`);
      for (const task of orphanedQueued) {
        emitTaskEvent({ type: "task:status", task: { ...task, needsInput: Boolean(task.needsInput) }, timestamp: now });
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
          // Cron tasks go to "done" (no one to review). Interactive tasks go to
          // "review" so the user can check the work before marking it done.
          const isCronTask = !!task.cronJobSlug;
          const reaperStatus = isCronTask ? "done" : "review";
          console.log(
            `[queue-watcher] Reaper: Claude PID ${task.claudePid} for task ${task.id} is dead — marking ${reaperStatus}`
          );
          db.prepare(
            `UPDATE tasks SET status = ?, completedAt = COALESCE(completedAt, ?), updatedAt = ?,
             activityLabel = 'Session ended — review output', claudePid = NULL,
             durationMs = CASE WHEN startedAt IS NOT NULL
               THEN CAST((julianday(?) - julianday(startedAt)) * 86400000 AS INTEGER)
               ELSE durationMs END
             WHERE id = ?`
          ).run(reaperStatus, now, now, now, task.id);
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

      // 2. Null-PID reaping: tasks in "running" with claudePid=NULL, needsInput=0,
      //    and no active in-memory session. These lost their process reference
      //    (e.g. server restarted but recovery didn't catch them because they're
      //    parent/container tasks, or PID was never written).
      const nullPidRunning = db
        .prepare(
          `SELECT * FROM tasks
           WHERE status = 'running'
             AND claudePid IS NULL
             AND needsInput = 0`
        )
        .all() as Task[];

      for (const task of nullPidRunning) {
        if (processManager.hasActiveSession(task.id)) continue;

        // Check if this is a parent task with active children — if so, it's
        // legitimately "running" as a container. Only reap if all children are terminal.
        const activeChildren = db
          .prepare(
            `SELECT COUNT(*) as count FROM tasks
             WHERE parentId = ? AND status IN ('running', 'queued')`
          )
          .get(task.id) as { count: number };

        if (activeChildren.count > 0) continue; // Container still has active work

        // Check if it has any children at all — if so, it's a completed container
        const totalChildren = db
          .prepare("SELECT COUNT(*) as count FROM tasks WHERE parentId = ?")
          .get(task.id) as { count: number };

        const isCronTask = !!task.cronJobSlug;
        const reaperStatus = isCronTask ? "done" : "review";
        const label = totalChildren.count > 0
          ? "All subtasks finished — review output"
          : "Session ended — review output";

        console.log(
          `[queue-watcher] Reaper: Task ${task.id.slice(0, 8)} "${task.title}" stuck in running with null PID and no active session — marking ${reaperStatus}`
        );
        db.prepare(
          `UPDATE tasks SET status = ?, completedAt = COALESCE(completedAt, ?), updatedAt = ?,
           activityLabel = ?, claudePid = NULL,
           durationMs = CASE WHEN startedAt IS NOT NULL
             THEN CAST((julianday(?) - julianday(startedAt)) * 86400000 AS INTEGER)
             ELSE durationMs END
           WHERE id = ?`
        ).run(reaperStatus, now, now, label, now, task.id);
        const updated = db
          .prepare("SELECT * FROM tasks WHERE id = ?")
          .get(task.id) as Task;
        emitTaskEvent({
          type: "task:status",
          task: { ...updated, needsInput: Boolean(updated.needsInput) },
          timestamp: now,
        });
      }

      // 3. Stuck needsInput reaping: tasks in "running" + needsInput=1 with no active
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
