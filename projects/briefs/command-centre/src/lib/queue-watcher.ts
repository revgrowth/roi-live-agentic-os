import { onTaskEvent, type TaskEvent } from "./event-bus";
import { processManager } from "./process-manager";
import { getDb } from "./db";
import type { Task } from "@/types/task";

let initialized = false;

/**
 * Initialize the queue watcher.
 * Listens for task events and auto-executes tasks that enter 'queued' status.
 * Also recovers any tasks left in 'queued' status from a previous server session.
 *
 * Idempotent -- safe to call multiple times.
 */
export function initQueueWatcher(): void {
  if (initialized) return;
  initialized = true;

  console.log("[queue-watcher] Initializing queue watcher");

  // Listen for task events that might indicate a task needs execution
  onTaskEvent((event: TaskEvent) => {
    if (event.task.status === "queued") {
      console.log(`[queue-watcher] Task ${event.task.id} entered queued status, triggering execution`);
      processManager.executeTask(event.task.id).catch((err) => {
        console.error(`[queue-watcher] Failed to execute task ${event.task.id}:`, err);
      });
    }
  });

  // Recovery: execute any tasks already in 'queued' status (e.g., after server restart)
  try {
    const db = getDb();
    const queuedTasks = db
      .prepare("SELECT * FROM tasks WHERE status = 'queued' ORDER BY columnOrder ASC")
      .all() as Task[];

    if (queuedTasks.length > 0) {
      console.log(`[queue-watcher] Recovering ${queuedTasks.length} queued task(s) from previous session`);
      for (const task of queuedTasks) {
        processManager.executeTask(task.id).catch((err) => {
          console.error(`[queue-watcher] Failed to recover task ${task.id}:`, err);
        });
      }
    }
  } catch (err) {
    console.error("[queue-watcher] Error during recovery scan:", err);
  }

  console.log("[queue-watcher] Queue watcher ready");
}
