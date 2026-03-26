import { watch, type FSWatcher } from "chokidar";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { getConfig } from "./config";
import { getDb } from "./db";
import { emitTaskEvent } from "./event-bus";
import type { Task } from "@/types/task";

/**
 * Watches the agentic-os projects/ directory for new files created
 * during a task's execution. Detected files are stored in task_outputs
 * and broadcast via the event bus.
 */
class FileWatcher {
  private watchers = new Map<string, FSWatcher>();

  /**
   * Start watching the projects/ directory for a given task.
   * New files (not initial) are recorded as task outputs.
   */
  async startWatching(taskId: string): Promise<void> {
    if (this.watchers.has(taskId)) {
      return;
    }

    const config = getConfig();
    const watchDir = path.join(config.agenticOsDir, "projects");

    // Ensure the directory exists before watching
    if (!fs.existsSync(watchDir)) {
      console.warn(`[file-watcher] Projects directory does not exist: ${watchDir}`);
      return;
    }

    const watcher = watch(watchDir, {
      ignoreInitial: true,
      depth: 5,
      ignored: [
        /(^|[/\\])\./,       // dotfiles
        /node_modules/,       // node_modules
        /\.next/,             // Next.js build output
      ],
    });

    watcher.on("add", (filePath: string) => {
      this.handleNewFile(taskId, filePath, config.agenticOsDir);
    });

    watcher.on("error", (error: unknown) => {
      const msg = error instanceof Error ? error.message : String(error);
      console.error(`[file-watcher] Error watching for task ${taskId}:`, msg);
    });

    this.watchers.set(taskId, watcher);
  }

  /**
   * Stop watching for a given task.
   */
  async stopWatching(taskId: string): Promise<void> {
    const watcher = this.watchers.get(taskId);
    if (watcher) {
      await watcher.close();
      this.watchers.delete(taskId);
    }
  }

  /**
   * Close all active watchers. Called on server shutdown.
   */
  cleanupAll(): void {
    for (const [taskId, watcher] of this.watchers) {
      console.log(`[file-watcher] Cleaning up watcher for task ${taskId}`);
      watcher.close().catch(() => {});
    }
    this.watchers.clear();
  }

  private handleNewFile(taskId: string, filePath: string, agenticOsDir: string): void {
    try {
      const stat = fs.statSync(filePath);
      const fileName = path.basename(filePath);
      const relativePath = path.relative(agenticOsDir, filePath);
      const extension = path.extname(filePath).replace(".", "");
      const id = crypto.randomUUID();
      const now = new Date().toISOString();

      const db = getDb();

      // Insert into task_outputs
      db.prepare(
        "INSERT INTO task_outputs (id, taskId, fileName, filePath, relativePath, extension, sizeBytes, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
      ).run(id, taskId, fileName, filePath, relativePath, extension, stat.size, now);

      // Fetch fresh task for event emission
      const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(taskId) as Task | undefined;
      if (task) {
        emitTaskEvent({ type: "task:output", task, timestamp: now });
      }
    } catch (err) {
      console.error(`[file-watcher] Error recording file ${filePath} for task ${taskId}:`, err);
    }
  }
}

// Singleton instance
export const fileWatcher = new FileWatcher();
