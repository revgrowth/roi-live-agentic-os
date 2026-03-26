import { EventEmitter } from "events";
import type { Task } from "@/types/task";

export type TaskEventType =
  | "task:created"
  | "task:updated"
  | "task:deleted"
  | "task:status"
  | "task:progress"
  | "task:output"
  | "task:question"
  | "task:log";

export interface TaskEvent {
  type: TaskEventType;
  task: Task;
  timestamp: string;
  questionText?: string;
  logEntry?: import("@/types/task").LogEntry;
}

// Use globalThis to ensure a single EventEmitter instance across all
// Next.js module instances (route handlers, instrumentation, etc.)
// Without this, dev mode / Turbopack creates separate instances per import.
const globalKey = "__command_centre_event_bus__";
const globalObj = globalThis as Record<string, unknown>;
if (!globalObj[globalKey]) {
  const em = new EventEmitter();
  em.setMaxListeners(100);
  globalObj[globalKey] = em;
}
const emitter = globalObj[globalKey] as EventEmitter;

type TaskEventCallback = (event: TaskEvent) => void;

export function emitTaskEvent(event: TaskEvent): void {
  const count = emitter.listenerCount("task-event");
  console.log(`[event-bus] Emitting ${event.type} for task ${event.task.id.slice(0, 8)} (${count} listeners)`);
  emitter.emit("task-event", event);
}

export function onTaskEvent(callback: TaskEventCallback): void {
  emitter.on("task-event", callback);
}

export function offTaskEvent(callback: TaskEventCallback): void {
  emitter.off("task-event", callback);
}
