import { EventEmitter } from "events";
import type { Task } from "@/types/task";

export type TaskEventType =
  | "task:created"
  | "task:updated"
  | "task:deleted"
  | "task:status"
  | "task:progress";

export interface TaskEvent {
  type: TaskEventType;
  task: Task;
  timestamp: string;
}

const emitter = new EventEmitter();
emitter.setMaxListeners(100); // Support many SSE clients

type TaskEventCallback = (event: TaskEvent) => void;

export function emitTaskEvent(event: TaskEvent): void {
  emitter.emit("task-event", event);
}

export function onTaskEvent(callback: TaskEventCallback): void {
  emitter.on("task-event", callback);
}

export function offTaskEvent(callback: TaskEventCallback): void {
  emitter.off("task-event", callback);
}
