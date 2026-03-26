import { create } from "zustand";
import type { CronJob, CronRun, CronJobCreateInput } from "@/types/cron";

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
      const res = await fetch("/api/cron");
      if (!res.ok) throw new Error("Failed to fetch cron jobs");
      const jobs = await res.json();
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
      const res = await fetch("/api/cron", {
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
}));
