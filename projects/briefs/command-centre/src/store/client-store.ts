import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Client } from "@/types/client";

interface ClientStore {
  clients: Client[];
  rootName: string;
  /**
   * Feed-only visibility filter.
   * null  = show all clients in Feed
   * []    = show nothing
   * [...] = show only the listed client slugs (supports "_root")
   */
  activeClientSlugs: string[] | null;
  /**
   * Global app scope used by workspace-level UI like cron, docs, and context.
   * null = root workspace / all clients
   */
  selectedClientId: string | null;
  isLoading: boolean;
  error: string | null;

  fetchClients: () => Promise<void>;
  toggleClient: (slug: string) => void;
  setAllActive: () => void;
  isClientActive: (slug: string) => boolean;
  setSelectedClient: (clientId: string | null) => void;
  getSelectedClient: () => Client | null;
}

function normalizeClientId(clientId: string | null): string | null {
  if (!clientId || clientId === "root") {
    return null;
  }
  return clientId;
}

function getDefaultFeedScope(clientId: string | null): string[] | null {
  return clientId ? [clientId] : null;
}

export const useClientStore = create<ClientStore>()(
  persist(
    (set, get) => ({
      clients: [],
      rootName: "Root",
      activeClientSlugs: null,
      selectedClientId: null,
      isLoading: false,
      error: null,

      fetchClients: async () => {
        set({ isLoading: true, error: null });
        try {
          const res = await fetch("/api/clients");
          if (!res.ok) throw new Error("Failed to fetch clients");
          const data = await res.json();
          if (Array.isArray(data)) {
            set({ clients: data, isLoading: false });
            return;
          }

          set({
            clients: data.clients ?? [],
            rootName: data.rootName ?? "Root",
            isLoading: false,
          });
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : "Unknown error",
            isLoading: false,
          });
        }
      },

      toggleClient: (slug: string) => {
        const { activeClientSlugs, clients } = get();
        const allSlugs = ["_root", ...clients.map((c) => c.slug)];

        let next: string[] | null;
        if (activeClientSlugs === null) {
          next = allSlugs.filter((s) => s !== slug);
        } else if (activeClientSlugs.includes(slug)) {
          next = activeClientSlugs.filter((s) => s !== slug);
        } else {
          next = [...activeClientSlugs, slug];
        }

        const nextSelection = next;
        if (Array.isArray(nextSelection) && allSlugs.every((s) => nextSelection.includes(s))) {
          next = null;
        }

        set({ activeClientSlugs: next });
      },

      setAllActive: () => {
        set({ activeClientSlugs: null });
      },

      isClientActive: (slug: string) => {
        const { activeClientSlugs } = get();
        if (activeClientSlugs === null) return true;
        return activeClientSlugs.includes(slug);
      },

      setSelectedClient: (clientId: string | null) => {
        const normalized = normalizeClientId(clientId);
        set({
          selectedClientId: normalized,
          activeClientSlugs: getDefaultFeedScope(normalized),
        });
      },

      getSelectedClient: () => {
        const { clients, selectedClientId } = get();
        if (!selectedClientId) return null;
        return clients.find((c) => c.slug === selectedClientId) || null;
      },
    }),
    {
      name: "command-centre-client",
      partialize: (state) => ({
        activeClientSlugs: state.activeClientSlugs,
        selectedClientId: state.selectedClientId,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;

        state.selectedClientId = normalizeClientId(state.selectedClientId ?? null);

        if (state.activeClientSlugs === undefined) {
          state.activeClientSlugs = getDefaultFeedScope(state.selectedClientId);
        }
      },
    }
  )
);
