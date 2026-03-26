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

  // Recovery: reset orphaned queued/running tasks back to backlog
  // (these are from a previous server session that crashed or was stopped)
  try {
    const db = getDb();
    const now = new Date().toISOString();

    const orphanedTasks = db
      .prepare("SELECT * FROM tasks WHERE status IN ('queued', 'running') ORDER BY columnOrder ASC")
      .all() as Task[];

    if (orphanedTasks.length > 0) {
      console.log(`[queue-watcher] Resetting ${orphanedTasks.length} orphaned task(s) to backlog`);
      db.prepare(
        "UPDATE tasks SET status = 'backlog', updatedAt = ?, activityLabel = NULL, startedAt = NULL, errorMessage = NULL WHERE status IN ('queued', 'running')"
      ).run(now);

      // Emit events so SSE clients update
      for (const task of orphanedTasks) {
        const updated = db.prepare("SELECT * FROM tasks WHERE id = ?").get(task.id) as Task;
        emitTaskEvent({ type: "task:status", task: updated, timestamp: now });
      }
    }
  } catch (err) {
    console.error("[queue-watcher] Error during recovery scan:", err);
  }

  console.log("[queue-watcher] Queue watcher ready");
}
