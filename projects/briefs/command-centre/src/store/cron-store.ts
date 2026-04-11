import { create } from "zustand";
import { useClientStore } from "./client-store";
import type { CronJob, CronRun, CronJobCreateInput } from "@/types/cron";
import type { TaskStatus } from "@/types/task";

const CRON_ORDER_KEY = "cron-job-order";
const CRON_PINNED_KEY = "cron-job-pinned";

function loadCronOrder(): string[] | null {
  try {
    const stored =
      typeof window !== "undefined"
        ? localStorage.getItem(CRON_ORDER_KEY)
        : null;
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function saveCronOrder(slugs: string[]) {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(CRON_ORDER_KEY, JSON.stringify(slugs));
    }
  } catch {
    // Ignore
  }
}

function loadPinnedSlugs(): string[] {
  try {
    const stored =
      typeof window !== "undefined"
        ? localStorage.getItem(CRON_PINNED_KEY)
        : null;
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function savePinnedSlugs(slugs: string[]) {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(CRON_PINNED_KEY, JSON.stringify(slugs));
    }
  } catch {
    // Ignore
  }
}

function applySavedOrder(jobs: CronJob[]): CronJob[] {
  const order = loadCronOrder();
  const pinned = new Set(loadPinnedSlugs());
  const sorted = [...jobs];

  // First apply saved order
  if (order) {
    sorted.sort((a, b) => {
      const ai = order.indexOf(a.slug);
      const bi = order.indexOf(b.slug);
      if (ai === -1 && bi === -1) return 0;
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
  }

  // Then float pinned items to top (preserving relative order among pinned)
  if (pinned.size > 0) {
    const pinnedJobs = sorted.filter((j) => pinned.has(j.slug));
    const unpinnedJobs = sorted.filter((j) => !pinned.has(j.slug));
    return [...pinnedJobs, ...unpinnedJobs];
  }

  return sorted;
}

function withClientQuery(path: string): string {
  const clientId = useClientStore.getState().selectedClientId;
  if (!clientId) {
    return path;
  }

  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}clientId=${encodeURIComponent(clientId)}`;
}

/** Tracks the status of a manually triggered cron run */
export interface ActiveCronRun {
  taskId: string;
  status: TaskStatus;
  activityLabel: string | null;
}

interface CronStore {
  jobs: CronJob[];
  isLoading: boolean;
  error: string | null;
  expandedJob: string | null;
  runHistory: Record<string, CronRun[]>;
  showCreatePanel: boolean;
  /** slug → active run info (persists until task reaches review/done) */
  activeRuns: Record<string, ActiveCronRun>;
  /** Slugs pinned to the top of the list */
  pinnedSlugs: string[];

  fetchJobs: () => Promise<void>;
  toggleJob: (slug: string) => Promise<void>;
  deleteJob: (slug: string) => Promise<void>;
  createJob: (input: CronJobCreateInput) => Promise<void>;
  runJobNow: (slug: string) => Promise<void>;
  expandJob: (slug: string | null) => void;
  fetchRunHistory: (slug: string) => Promise<void>;
  setShowCreatePanel: (show: boolean) => void;
  moveJob: (fromIndex: number, toIndex: number) => void;
  togglePin: (slug: string) => void;
}

export const useCronStore = create<CronStore>((set, get) => ({
  jobs: [],
  isLoading: false,
  error: null,
  expandedJob: null,
  runHistory: {},
  showCreatePanel: false,
  activeRuns: {},
  pinnedSlugs: typeof window !== "undefined" ? loadPinnedSlugs() : [],

  fetchJobs: async () => {
    set({ isLoading: true, error: null });
    try {
      const clientId = useClientStore.getState().selectedClientId;
      const url = clientId
        ? `/api/cron?clientId=${encodeURIComponent(clientId)}`
        : "/api/cron";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch cron jobs");
      const jobs = applySavedOrder(await res.json());
      set({ jobs, isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Unknown error",
        isLoading: false,
      });
    }
  },

  toggleJob: async (slug: string) => {
    try {
      const res = await fetch(withClientQuery(`/api/cron/${slug}/toggle`), {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Failed to toggle cron job");
      const updated = await res.json();
      set((state) => ({
        jobs: state.jobs.map((j) => (j.slug === slug ? updated : j)),
      }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  },

  runJobNow: async (slug: string) => {
    // Prevent double-runs
    if (get().activeRuns[slug]) return;

    try {
      const res = await fetch(withClientQuery(`/api/cron/${slug}/run`), { method: "POST" });
      if (!res.ok) throw new Error("Failed to trigger cron job");
      const task = await res.json();

      // Track this active run
      set((state) => ({
        activeRuns: {
          ...state.activeRuns,
          [slug]: {
            taskId: task.id,
            status: task.status as TaskStatus,
            activityLabel: task.activityLabel,
          },
        },
      }));

      // Immediately refresh run history so the "Running" row appears
      if (get().expandedJob === slug) {
        get().fetchRunHistory(slug);
      }

      // Poll the task status until it reaches a terminal state
      const pollInterval = setInterval(async () => {
        try {
          const statusRes = await fetch(`/api/tasks/${task.id}/status`);
          if (!statusRes.ok) return;
          const statusData = await statusRes.json();

          const isTerminal = statusData.status === "review" || statusData.status === "done";

          set((state) => ({
            activeRuns: isTerminal
              ? (() => {
                  const { [slug]: _, ...rest } = state.activeRuns;
                  return rest;
                })()
              : {
                  ...state.activeRuns,
                  [slug]: {
                    taskId: task.id,
                    status: statusData.status,
                    activityLabel: statusData.activityLabel,
                  },
                },
          }));

          if (isTerminal) {
            clearInterval(pollInterval);
            // Refresh this job's metadata and history
            get().fetchJobs();
            if (get().expandedJob === slug) {
              get().fetchRunHistory(slug);
            }
          }
        } catch {
          // Silent fail on poll
        }
      }, 2000);
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  },

  deleteJob: async (slug: string) => {
    const prev = get().jobs;
    set((state) => ({
      jobs: state.jobs.filter((j) => j.slug !== slug),
    }));

    try {
      const res = await fetch(withClientQuery(`/api/cron/${slug}`), { method: "DELETE" });
      if (!res.ok) {
        set({ jobs: prev });
        throw new Error("Failed to delete cron job");
      }
    } catch (err) {
      set({
        jobs: prev,
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  },

  createJob: async (input: CronJobCreateInput) => {
    try {
      const url = withClientQuery("/api/cron");
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Failed to create cron job");
      const job = await res.json();
      set((state) => ({
        jobs: [job, ...state.jobs],
        showCreatePanel: false,
      }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  },

  expandJob: (slug: string | null) => {
    set({ expandedJob: slug });
    if (slug) {
      get().fetchRunHistory(slug);
      // Also refresh this job's metadata (last run, stats) from the server
      fetch(withClientQuery(`/api/cron/${slug}`))
        .then((res) => res.ok ? res.json() : null)
        .then((updated) => {
          if (updated) {
            set((state) => ({
              jobs: state.jobs.map((j) => (j.slug === slug ? updated : j)),
            }));
          }
        })
        .catch(() => {});
    }
  },

  fetchRunHistory: async (slug: string) => {
    try {
      const res = await fetch(withClientQuery(`/api/cron/${slug}/history`));
      if (!res.ok) return;
      const history = await res.json();
      set((state) => ({
        runHistory: { ...state.runHistory, [slug]: history },
      }));
    } catch {
      // Silently fail -- run history is non-critical
    }
  },

  setShowCreatePanel: (show: boolean) => {
    set({ showCreatePanel: show });
  },

  moveJob: (fromIndex: number, toIndex: number) => {
    const jobs = [...get().jobs];
    const pinned = new Set(get().pinnedSlugs);
    if (fromIndex < 0 || fromIndex >= jobs.length || toIndex < 0 || toIndex >= jobs.length) return;
    // Don't allow dragging into or out of the pinned zone
    const fromPinned = pinned.has(jobs[fromIndex].slug);
    const toPinned = toIndex < jobs.filter((j) => pinned.has(j.slug)).length;
    if (fromPinned !== toPinned) return;
    const [moved] = jobs.splice(fromIndex, 1);
    jobs.splice(toIndex, 0, moved);
    saveCronOrder(jobs.map((j) => j.slug));
    set({ jobs });
  },

  togglePin: (slug: string) => {
    const current = get().pinnedSlugs;
    const next = current.includes(slug)
      ? current.filter((s) => s !== slug)
      : [...current, slug];
    savePinnedSlugs(next);
    set({ pinnedSlugs: next });
    // Re-sort jobs with updated pins
    const jobs = applySavedOrder(get().jobs);
    set({ jobs });
  },
}));
