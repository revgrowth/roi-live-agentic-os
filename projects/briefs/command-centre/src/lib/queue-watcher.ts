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

  // Listen for task status changes — only execute on explicit queued transitions
  onTaskEvent((event: TaskEvent) => {
    // Only trigger on status change events (not created/deleted/progress)
    if (event.type !== "task:status" && event.type !== "task:updated") return;
    if (event.task.status !== "queued") return;

    console.log(`[queue-watcher] Task ${event.task.id} entered queued status, triggering execution`);
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
  } catch (err) {
    console.error("[queue-watcher] Error during recovery scan:", err);
  }

  console.log("[queue-watcher] Queue watcher ready");
}
