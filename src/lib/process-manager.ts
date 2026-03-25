import { spawn, type ChildProcess } from "child_process";
import { createInterface } from "readline";
import { getDb } from "./db";
import { getConfig } from "./config";
import { emitTaskEvent } from "./event-bus";
import { ClaudeOutputParser } from "./claude-parser";
import type { Task } from "@/types/task";

/**
 * Manages Claude CLI child processes for task execution.
 * Singleton -- one instance per server process.
 */
class ProcessManager {
  private sessions = new Map<string, ChildProcess>();
  private lastProgressEmit = new Map<string, number>();

  constructor() {
    // Clean up all sessions on server shutdown
    const cleanup = () => this.cleanup();
    process.on("exit", cleanup);
    process.on("SIGTERM", cleanup);
    process.on("SIGINT", cleanup);
  }

  /**
   * Execute a task by spawning a Claude CLI session.
   * Task must exist in the database. Status is set to 'running'.
   */
  async executeTask(taskId: string): Promise<void> {
    // Guard: don't double-spawn
    if (this.sessions.has(taskId)) {
      console.warn(`[process-manager] Task ${taskId} is already running, skipping`);
      return;
    }

    const db = getDb();
    const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(taskId) as Task | undefined;

    if (!task) {
      console.error(`[process-manager] Task ${taskId} not found in database`);
      return;
    }

    const now = new Date().toISOString();

    // Update status to running
    db.prepare("UPDATE tasks SET status = ?, startedAt = ?, updatedAt = ?, activityLabel = ?, errorMessage = NULL WHERE id = ?").run(
      "running",
      now,
      now,
      "Starting Claude session...",
      taskId
    );

    const updatedTask = db.prepare("SELECT * FROM tasks WHERE id = ?").get(taskId) as Task;
    emitTaskEvent({ type: "task:status", task: updatedTask, timestamp: now });

    const config = getConfig();

    // Spawn Claude CLI
    let proc: ChildProcess;
    try {
      proc = spawn("claude", ["--output-format", "stream-json", "--verbose", "-p", task.title], {
        cwd: config.agenticOsDir,
        stdio: ["ignore", "pipe", "pipe"],
        env: { ...process.env },
      });
    } catch (err) {
      // Spawn itself can throw synchronously in rare cases
      this.handleSpawnError(taskId, err);
      return;
    }

    this.sessions.set(taskId, proc);

    // Set up parser with callbacks
    const parser = new ClaudeOutputParser({
      onProgress: (data) => {
        this.handleProgress(taskId, data);
      },
      onComplete: (data) => {
        this.handleComplete(taskId, data);
      },
      onError: (error) => {
        this.handleTaskError(taskId, error);
      },
    });

    // Handle spawn errors (e.g., ENOENT when claude CLI not found)
    proc.on("error", (err) => {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") {
        this.handleTaskError(
          taskId,
          "Claude CLI not found. Ensure 'claude' is installed and in your PATH."
        );
      } else {
        this.handleTaskError(taskId, `Process error: ${err.message}`);
      }
    });

    // Read stdout line by line
    if (proc.stdout) {
      const rl = createInterface({ input: proc.stdout });
      rl.on("line", (line) => {
        parser.feedLine(line);
      });
    }

    // Capture stderr for diagnostics
    let stderrBuffer = "";
    if (proc.stderr) {
      proc.stderr.on("data", (chunk: Buffer) => {
        stderrBuffer += chunk.toString();
      });
    }

    // Handle process exit
    proc.on("close", (code) => {
      this.sessions.delete(taskId);
      this.lastProgressEmit.delete(taskId);

      // If parser already handled result/error, nothing more to do
      if (parser.isCompleted) return;

      // Process exited without parser receiving a result -- treat as error
      if (code !== 0) {
        const errorMsg = stderrBuffer.trim()
          ? `Claude CLI exited with code ${code}: ${stderrBuffer.trim().slice(0, 500)}`
          : `Claude CLI exited with code ${code}`;
        this.handleTaskError(taskId, errorMsg);
      } else {
        // Exit 0 but no result message -- unusual, treat as completion with zero metrics
        this.handleComplete(taskId, { costUsd: 0, tokensUsed: 0, durationMs: 0 });
      }
    });
  }

  /**
   * Cancel a running task. Sends SIGTERM, then SIGKILL after 5s.
   */
  async cancelTask(taskId: string): Promise<void> {
    const proc = this.sessions.get(taskId);
    if (!proc) {
      console.warn(`[process-manager] No active session for task ${taskId}`);
      return;
    }

    // Send SIGTERM
    proc.kill("SIGTERM");

    // Force kill after 5 seconds if still alive
    const killTimer = setTimeout(() => {
      try {
        proc.kill("SIGKILL");
      } catch {
        // Process already exited
      }
    }, 5000);

    // Wait for process to exit, then clean up
    proc.on("close", () => {
      clearTimeout(killTimer);
    });

    // Remove from sessions immediately to prevent further event handling
    this.sessions.delete(taskId);
    this.lastProgressEmit.delete(taskId);

    // Update task to backlog (cancelled)
    const db = getDb();
    const now = new Date().toISOString();
    db.prepare(
      "UPDATE tasks SET status = ?, updatedAt = ?, activityLabel = NULL, costUsd = NULL, tokensUsed = NULL, durationMs = NULL, errorMessage = NULL, startedAt = NULL, completedAt = NULL WHERE id = ?"
    ).run("backlog", now, taskId);

    const updated = db.prepare("SELECT * FROM tasks WHERE id = ?").get(taskId) as Task;
    emitTaskEvent({ type: "task:status", task: updated, timestamp: now });
  }

  /** Number of currently running sessions. */
  getActiveCount(): number {
    return this.sessions.size;
  }

  /** Kill all active sessions. Called on server shutdown. */
  cleanup(): void {
    for (const [taskId, proc] of this.sessions) {
      console.log(`[process-manager] Cleaning up session for task ${taskId}`);
      try {
        proc.kill("SIGTERM");
      } catch {
        // Process may already be gone
      }
    }
    this.sessions.clear();
    this.lastProgressEmit.clear();
  }

  // -- Internal handlers --

  private handleProgress(
    taskId: string,
    data: { costUsd?: number; tokensUsed?: number; activityLabel?: string }
  ): void {
    // Throttle progress events to max 1 per second
    const now = Date.now();
    const lastEmit = this.lastProgressEmit.get(taskId) || 0;
    if (now - lastEmit < 1000) return;
    this.lastProgressEmit.set(taskId, now);

    const db = getDb();
    const updates: string[] = ["updatedAt = ?"];
    const values: unknown[] = [new Date().toISOString()];

    if (data.costUsd !== undefined) {
      updates.push("costUsd = ?");
      values.push(data.costUsd);
    }
    if (data.tokensUsed !== undefined) {
      updates.push("tokensUsed = ?");
      values.push(data.tokensUsed);
    }
    if (data.activityLabel !== undefined) {
      updates.push("activityLabel = ?");
      values.push(data.activityLabel);
    }

    values.push(taskId);
    db.prepare(`UPDATE tasks SET ${updates.join(", ")} WHERE id = ?`).run(...values);

    const updated = db.prepare("SELECT * FROM tasks WHERE id = ?").get(taskId) as Task;
    emitTaskEvent({ type: "task:progress", task: updated, timestamp: new Date().toISOString() });
  }

  private handleComplete(
    taskId: string,
    data: { costUsd: number; tokensUsed: number; durationMs: number }
  ): void {
    // Guard: session may have been cancelled
    if (!this.sessions.has(taskId) && !this.lastProgressEmit.has(taskId)) {
      // Task was cancelled, don't update
      return;
    }

    const db = getDb();
    const now = new Date().toISOString();

    db.prepare(
      "UPDATE tasks SET status = ?, completedAt = ?, updatedAt = ?, costUsd = ?, tokensUsed = ?, durationMs = ?, activityLabel = ? WHERE id = ?"
    ).run("review", now, now, data.costUsd, data.tokensUsed, data.durationMs, "Completed", taskId);

    const updated = db.prepare("SELECT * FROM tasks WHERE id = ?").get(taskId) as Task;
    emitTaskEvent({ type: "task:status", task: updated, timestamp: now });

    this.sessions.delete(taskId);
    this.lastProgressEmit.delete(taskId);
  }

  private handleTaskError(taskId: string, errorMessage: string): void {
    // Guard: session may have been cancelled
    if (!this.sessions.has(taskId) && !this.lastProgressEmit.has(taskId)) {
      return;
    }

    const db = getDb();
    const now = new Date().toISOString();

    db.prepare(
      "UPDATE tasks SET status = ?, completedAt = ?, updatedAt = ?, errorMessage = ?, activityLabel = ? WHERE id = ?"
    ).run("review", now, now, errorMessage, "Error", taskId);

    const updated = db.prepare("SELECT * FROM tasks WHERE id = ?").get(taskId) as Task;
    emitTaskEvent({ type: "task:status", task: updated, timestamp: now });

    this.sessions.delete(taskId);
    this.lastProgressEmit.delete(taskId);
  }

  private handleSpawnError(taskId: string, err: unknown): void {
    const message = err instanceof Error ? err.message : "Unknown spawn error";
    this.handleTaskError(taskId, `Failed to start Claude CLI: ${message}`);
  }
}

// Singleton instance
export const processManager = new ProcessManager();
