import { create } from "zustand";
import type { Task, TaskLevel, TaskUpdateInput } from "@/types/task";
import type { TaskEvent } from "@/lib/event-bus";

interface TaskStore {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchTasks: () => Promise<void>;
  createTask: (title: string, level: TaskLevel) => Promise<void>;
  updateTask: (id: string, updates: TaskUpdateInput) => Promise<void>;
  moveTask: (id: string, newStatus: string, newOrder: number) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  applySSEEvent: (event: TaskEvent) => void;

  // Selectors
  getTasksByStatus: (status: string) => Task[];
  getChildTasks: (parentId: string) => Task[];
  getRunningCount: () => number;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch("/api/tasks");
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const tasks = await res.json();
      set({ tasks, isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Unknown error",
        isLoading: false,
      });
    }
  },

  createTask: async (title: string, level: TaskLevel) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, level }),
      });
      if (!res.ok) throw new Error("Failed to create task");
      const task = await res.json();
      set((state) => ({ tasks: [...state.tasks, task] }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  },

  updateTask: async (id: string, updates: TaskUpdateInput) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update task");
      const updated = await res.json();
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? updated : t)),
      }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  },

  moveTask: async (id: string, newStatus: string, newOrder: number) => {
    const prev = get().tasks;
    // Optimistic update
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id
          ? { ...t, status: newStatus as Task["status"], columnOrder: newOrder }
          : t
      ),
    }));
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, columnOrder: newOrder }),
      });
      if (!res.ok) {
        // Revert on error
        set({ tasks: prev });
        throw new Error("Failed to move task");
      }
    } catch {
      set({ tasks: prev });
    }
  },

  deleteTask: async (id: string) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete task");
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id && t.parentId !== id),
      }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  },

  applySSEEvent: (event: TaskEvent) => {
    switch (event.type) {
      case "task:created":
        set((state) => {
          // Avoid duplicates
          if (state.tasks.some((t) => t.id === event.task.id)) return state;
          return { tasks: [...state.tasks, event.task] };
        });
        break;
      case "task:updated":
      case "task:status":
      case "task:progress":
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === event.task.id ? event.task : t
          ),
        }));
        break;
      case "task:deleted":
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== event.task.id),
        }));
        break;
    }
  },

  getTasksByStatus: (status: string) => {
    return get()
      .tasks.filter((t) => t.status === status && !t.parentId)
      .sort((a, b) => a.columnOrder - b.columnOrder);
  },

  getChildTasks: (parentId: string) => {
    return get()
      .tasks.filter((t) => t.parentId === parentId)
      .sort((a, b) => a.columnOrder - b.columnOrder);
  },

  getRunningCount: () => {
    return get().tasks.filter((t) => t.status === "running").length;
  },
}));
