import { create } from "zustand";
import { useClientStore } from "./client-store";
import type { CronJob, CronRun, CronJobCreateInput } from "@/types/cron";

const CRON_ORDER_KEY = "cron-job-order";

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

function applySavedOrder(jobs: CronJob[]): CronJob[] {
  const order = loadCronOrder();
  if (!order) return jobs;
  const sorted = [...jobs];
  sorted.sort((a, b) => {
    const ai = order.indexOf(a.slug);
    const bi = order.indexOf(b.slug);
    if (ai === -1 && bi === -1) return 0;
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
  return sorted;
}

interface CronStore {
  jobs: CronJob[];
  isLoading: boolean;
  error: string | null;
  expandedJob: string | null;
  runHistory: Record<string, CronRun[]>;
  showCreatePanel: boolean;

  fetchJobs: () => Promise<void>;
  toggleJob: (slug: string) => Promise<void>;
  deleteJob: (slug: string) => Promise<void>;
  createJob: (input: CronJobCreateInput) => Promise<void>;
  expandJob: (slug: string | null) => void;
  fetchRunHistory: (slug: string) => Promise<void>;
  setShowCreatePanel: (show: boolean) => void;
  moveJob: (fromIndex: number, toIndex: number) => void;
}

export const useCronStore = create<CronStore>((set, get) => ({
  jobs: [],
  isLoading: false,
  error: null,
  expandedJob: null,
  runHistory: {},
  showCreatePanel: false,

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
      const res = await fetch(`/api/cron/${slug}/toggle`, {
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

  deleteJob: async (slug: string) => {
    const prev = get().jobs;
    set((state) => ({
      jobs: state.jobs.filter((j) => j.slug !== slug),
    }));

    try {
      const res = await fetch(`/api/cron/${slug}`, { method: "DELETE" });
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
      const clientId = useClientStore.getState().selectedClientId;
      const url = clientId
        ? `/api/cron?clientId=${encodeURIComponent(clientId)}`
        : "/api/cron";
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
    }
  },

  fetchRunHistory: async (slug: string) => {
    try {
      const res = await fetch(`/api/cron/${slug}/history`);
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
    if (fromIndex < 0 || fromIndex >= jobs.length || toIndex < 0 || toIndex >= jobs.length) return;
    const [moved] = jobs.splice(fromIndex, 1);
    jobs.splice(toIndex, 0, moved);
    saveCronOrder(jobs.map((j) => j.slug));
    set({ jobs });
  },
}));
