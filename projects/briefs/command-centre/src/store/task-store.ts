import { create } from "zustand";
import type { Task, TaskLevel, TaskUpdateInput, OutputFile, LogEntry } from "@/types/task";
import type { TaskEvent } from "@/lib/event-bus";
import { useClientStore } from "./client-store";

// SSE dedup: track IDs we created so SSE echoes are suppressed
const _recentlyCreatedIds = new Set<string>();
// Track pending optimistic creates by tempId -> title for SSE reconciliation
const _pendingCreates = new Map<string, string>();

interface TaskStore {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  outputFiles: Record<string, OutputFile[]>;
  logEntries: Record<string, LogEntry[]>;
  selectedTaskId: string | null;

  // Actions
  fetchTasks: () => Promise<void>;
  createTask: (title: string, description: string | null, level: TaskLevel, projectSlug?: string | null, parentId?: string | null, permissionMode?: string, initialStatus?: string) => Promise<void>;
  updateTask: (id: string, updates: TaskUpdateInput) => Promise<void>;
  moveTask: (id: string, newStatus: string, newOrder: number) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  cancelTask: (id: string) => Promise<void>;
  applySSEEvent: (event: TaskEvent) => void;
  fetchOutputFiles: (taskId: string) => Promise<void>;
  fetchLogEntries: (taskId: string) => Promise<void>;
  appendLogEntry: (taskId: string, entry: LogEntry) => void;
  syncPhases: (parentTaskId: string) => Promise<void>;
  syncProjects: () => Promise<void>;
  openPanel: (taskId: string) => void;
  closePanel: () => void;

  // Selectors
  getTasksByStatus: (status: string) => Task[];
  getChildTasks: (parentId: string) => Task[];
  getRunningCount: () => number;
  getOutputFiles: (taskId: string) => OutputFile[];
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,
  outputFiles: {},
  logEntries: {},
  selectedTaskId: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const clientId = useClientStore.getState().selectedClientId;
      const url = clientId ? `/api/tasks?clientId=${encodeURIComponent(clientId)}` : "/api/tasks";
      const res = await fetch(url);
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

  createTask: async (title: string, description: string | null, level: TaskLevel, projectSlug?: string | null, parentId?: string | null, permissionMode?: string, initialStatus?: string) => {
    const tempId = "temp-" + crypto.randomUUID();
    const now = new Date().toISOString();
    const currentClientId = useClientStore.getState().selectedClientId;
    const tempTask: Task = {
      id: tempId,
      title,
      description: description || null,
      status: (initialStatus as Task["status"]) || "queued",
      level,
      parentId: parentId || null,
      projectSlug: projectSlug || null,
      columnOrder: -Date.now(),
      createdAt: now,
      updatedAt: now,
      costUsd: null,
      tokensUsed: null,
      durationMs: null,
      activityLabel: null,
      errorMessage: null,
      startedAt: null,
      completedAt: null,
      clientId: currentClientId,
      needsInput: false,
      phaseNumber: null,
      gsdStep: null,
      contextSources: null,
      cronJobSlug: null,
      claudeSessionId: null,
      permissionMode: (permissionMode as Task["permissionMode"]) || "default",
      lastReplyAt: null,
      goalGroup: null,
    };

    // Track pending create for SSE reconciliation
    _pendingCreates.set(tempId, title);

    // Optimistic: add temp task to state immediately
    set((state) => ({ tasks: [tempTask, ...state.tasks] }));

    try {
      const clientId = useClientStore.getState().selectedClientId;
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, level, projectSlug, clientId, parentId, permissionMode: permissionMode || "default", status: initialStatus }),
      });
      if (!res.ok) throw new Error("Failed to create task");
      const realTask = await res.json();

      _pendingCreates.delete(tempId);
      _recentlyCreatedIds.add(realTask.id);
      setTimeout(() => _recentlyCreatedIds.delete(realTask.id), 10000);

      set((state) => {
        // Check if SSE already added this task (SSE beat the API response)
        const sseAlreadyAdded = state.tasks.some(
          (t) => t.id === realTask.id
        );
        if (sseAlreadyAdded) {
          // Just remove the temp — SSE already has the real task in state
          return { tasks: state.tasks.filter((t) => t.id !== tempId) };
        }
        // Normal: replace temp with real
        return {
          tasks: state.tasks.map((t) => (t.id === tempId ? realTask : t)),
        };
      });
    } catch (err) {
      _pendingCreates.delete(tempId);
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== tempId),
        error: err instanceof Error ? err.message : "Unknown error",
      }));
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

    // Optimistic: reorder properly by removing the task, inserting at new position,
    // and reindexing all columnOrder values in affected columns
    set((state) => {
      const task = state.tasks.find((t) => t.id === id);
      if (!task) return state;

      const oldStatus = task.status;
      const now = new Date().toISOString();

      // Build updated tasks array
      let updated = state.tasks.map((t) => {
        if (t.id === id) {
          const patch: Partial<Task> = { status: newStatus as Task["status"], columnOrder: newOrder };
          // Optimistically set startedAt when transitioning to running/review/done
          if (["running", "review", "done"].includes(newStatus) && !t.startedAt) {
            patch.startedAt = now;
          }
          return { ...t, ...patch };
        }
        return t;
      });

      // Get tasks in the destination column (sorted), reindex their columnOrder
      const destTasks = updated
        .filter((t) => t.status === newStatus && !t.parentId)
        .sort((a, b) => {
          // Put the moved task at the desired position
          if (a.id === id) return newOrder - 0.5 - b.columnOrder;
          if (b.id === id) return a.columnOrder - (newOrder - 0.5);
          return a.columnOrder - b.columnOrder;
        });

      // Reindex destination column
      const destOrderMap = new Map<string, number>();
      destTasks.forEach((t, i) => destOrderMap.set(t.id, i));

      // If moved across columns, also reindex source column
      const sourceOrderMap = new Map<string, number>();
      if (oldStatus !== newStatus) {
        const sourceTasks = updated
          .filter((t) => t.status === oldStatus && !t.parentId && t.id !== id)
          .sort((a, b) => a.columnOrder - b.columnOrder);
        sourceTasks.forEach((t, i) => sourceOrderMap.set(t.id, i));
      }

      updated = updated.map((t) => {
        if (destOrderMap.has(t.id)) {
          return { ...t, columnOrder: destOrderMap.get(t.id)! };
        }
        if (sourceOrderMap.has(t.id)) {
          return { ...t, columnOrder: sourceOrderMap.get(t.id)! };
        }
        return t;
      });

      return { tasks: updated };
    });

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, columnOrder: newOrder }),
      });
      if (!res.ok) {
        set({ tasks: prev });
        throw new Error("Failed to move task");
      }
      // Apply server response to get authoritative values (startedAt, etc.)
      const serverTask = await res.json();
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...serverTask } : t)),
      }));
    } catch {
      set({ tasks: prev });
    }
  },

  deleteTask: async (id: string) => {
    // Optimistic: remove immediately
    const prev = get().tasks;
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id && t.parentId !== id),
    }));

    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (!res.ok) {
        // Revert on error
        set({ tasks: prev });
        throw new Error("Failed to delete task");
      }
    } catch (err) {
      set({
        tasks: prev,
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  },

  cancelTask: async (id: string) => {
    try {
      const res = await fetch(`/api/tasks/${id}/cancel`, { method: "POST" });
      if (res.ok) {
        const updated = await res.json();
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updated } : t)),
        }));
      }
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Failed to cancel task" });
    }
  },

  applySSEEvent: (event: TaskEvent) => {
    switch (event.type) {
      case "task:created":
        // Skip self-echo
        if (_recentlyCreatedIds.has(event.task.id)) {
          _recentlyCreatedIds.delete(event.task.id);
          break;
        }
        set((state) => {
          // Already exists — skip
          if (state.tasks.some((t) => t.id === event.task.id)) return state;

          // Check if this matches a pending optimistic create (SSE arrived before API response)
          const pendingEntry = [..._pendingCreates.entries()].find(
            ([, title]) => title === event.task.title
          );
          if (pendingEntry) {
            const [tempId] = pendingEntry;
            // Mark as recently created so if API response also arrives, it's handled
            _recentlyCreatedIds.add(event.task.id);
            _pendingCreates.delete(tempId);
            // Replace temp with real task from SSE
            return {
              tasks: state.tasks.map((t) =>
                t.id === tempId ? event.task : t
              ),
            };
          }

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
      case "task:output":
        // Re-fetch outputs for this task
        get().fetchOutputFiles(event.task.id);
        break;
      case "task:question":
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === event.task.id ? event.task : t
          ),
        }));
        break;
      case "task:log":
        // Append log entry if present
        if (event.logEntry) {
          get().appendLogEntry(event.task.id, event.logEntry);
        }
        break;
      case "task:deleted":
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== event.task.id),
        }));
        break;
    }
  },

  fetchOutputFiles: async (taskId: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}/outputs`);
      if (!res.ok) return;
      const files = await res.json();
      set((state) => ({
        outputFiles: { ...state.outputFiles, [taskId]: files },
      }));
    } catch {
      // Silently fail -- outputs are non-critical
    }
  },

  fetchLogEntries: async (taskId: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}/logs`);
      if (!res.ok) return;
      const entries = await res.json();
      set((state) => ({
        logEntries: { ...state.logEntries, [taskId]: entries },
      }));
    } catch {
      // Silently fail
    }
  },

  appendLogEntry: (taskId: string, entry: LogEntry) => {
    set((state) => {
      const existing = state.logEntries[taskId] || [];
      // Deduplicate: skip if this entry ID already exists (from initial fetch)
      if (existing.some((e) => e.id === entry.id)) return state;
      // Deduplicate user_reply: optimistic entry uses "local-" ID, server uses a different UUID.
      // Match by type + content to prevent double display.
      if (entry.type === "user_reply") {
        const isDuplicate = existing.some(
          (e) => e.type === "user_reply" && e.content === entry.content
        );
        if (isDuplicate) return state;
      }
      return {
        logEntries: { ...state.logEntries, [taskId]: [...existing, entry] },
      };
    });
  },

  syncPhases: async (parentTaskId: string) => {
    try {
      const res = await fetch(`/api/tasks/${parentTaskId}/sync-phases`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to sync phases");
      // Re-fetch all tasks to pick up the new children
      await get().fetchTasks();
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  },

  syncProjects: async () => {
    try {
      const clientId = useClientStore.getState().selectedClientId;
      const url = clientId
        ? `/api/tasks/sync-projects?clientId=${encodeURIComponent(clientId)}`
        : "/api/tasks/sync-projects";
      const res = await fetch(url, { method: "POST" });
      if (!res.ok) return;
      const { synced } = await res.json();
      if (synced > 0) {
        await get().fetchTasks();
      }
    } catch {
      // Non-critical — silently fail
    }
  },

  openPanel: (taskId: string) => {
    set({ selectedTaskId: taskId });
  },

  closePanel: () => {
    set({ selectedTaskId: null });
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

  getOutputFiles: (taskId: string) => {
    return get().outputFiles[taskId] || [];
  },
}));
