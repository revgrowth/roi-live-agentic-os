import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Client } from "@/types/client";

interface ClientStore {
  clients: Client[];
  rootName: string;
  /**
   * Which clients are visible.
   * null  = "All" is selected (show everything)
   * []   = nothing selected (empty board)
   * [...] = specific clients selected
   */
  activeClientSlugs: string[] | null;
  isLoading: boolean;
  error: string | null;

  // Legacy compat — derived from activeClientSlugs
  selectedClientId: string | null;

  fetchClients: () => Promise<void>;
  toggleClient: (slug: string) => void;
  setAllActive: () => void;
  isClientActive: (slug: string) => boolean;

  // Legacy — maps to toggleClient / setAllActive
  setSelectedClient: (clientId: string | null) => void;
  getSelectedClient: () => Client | null;
}

/** Derive selectedClientId from slugs array */
function deriveSelectedId(slugs: string[] | null): string | null {
  if (!slugs || slugs.length !== 1) return null;
  return slugs[0];
}

export const useClientStore = create<ClientStore>()(
  persist(
    (set, get) => ({
      clients: [],
      rootName: "Root",
      activeClientSlugs: null, // null = "All"
      selectedClientId: null,
      isLoading: false,
      error: null,

      fetchClients: async () => {
        set({ isLoading: true, error: null });
        try {
          const res = await fetch("/api/clients");
          if (!res.ok) throw new Error("Failed to fetch clients");
          const data = await res.json();
          // API returns { clients, rootName } or legacy array
          if (Array.isArray(data)) {
            set({ clients: data, isLoading: false });
          } else {
            set({
              clients: data.clients ?? [],
              rootName: data.rootName ?? "Root",
              isLoading: false,
            });
          }
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

        let current: string[];
        if (activeClientSlugs === null) {
          // "All" is active → untoggle this one = all except this one
          current = allSlugs.filter((s) => s !== slug);
        } else if (activeClientSlugs.includes(slug)) {
          // Remove it
          current = activeClientSlugs.filter((s) => s !== slug);
        } else {
          // Add it
          current = [...activeClientSlugs, slug];
        }

        // If all are now selected, collapse to null (= "All")
        const next: string[] | null = allSlugs.every((s) => current.includes(s))
          ? null
          : current;

        set({ activeClientSlugs: next, selectedClientId: deriveSelectedId(next) });
      },

      setAllActive: () => {
        set({ activeClientSlugs: null, selectedClientId: null });
      },

      isClientActive: (slug: string) => {
        const { activeClientSlugs } = get();
        if (activeClientSlugs === null) return true; // "All"
        return activeClientSlugs.includes(slug);
      },

      // Legacy compat
      setSelectedClient: (clientId: string | null) => {
        const next = clientId === null ? null : [clientId];
        set({ activeClientSlugs: next, selectedClientId: deriveSelectedId(next) });
      },

      getSelectedClient: () => {
        const { clients, activeClientSlugs } = get();
        if (!activeClientSlugs || activeClientSlugs.length !== 1) return null;
        return clients.find((c) => c.slug === activeClientSlugs[0]) || null;
      },
    }),
    {
      name: "command-centre-client",
      partialize: (state) => ({ activeClientSlugs: state.activeClientSlugs }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.selectedClientId = deriveSelectedId(state.activeClientSlugs);
        }
      },
    }
  )
);
