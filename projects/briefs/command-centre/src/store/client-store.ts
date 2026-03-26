import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Client } from "@/types/client";

interface ClientStore {
  clients: Client[];
  selectedClientId: string | null; // null = Root (all clients)
  isLoading: boolean;
  error: string | null;

  fetchClients: () => Promise<void>;
  setSelectedClient: (clientId: string | null) => void;
  getSelectedClient: () => Client | null;
}

export const useClientStore = create<ClientStore>()(
  persist(
    (set, get) => ({
      clients: [],
      selectedClientId: null,
      isLoading: false,
      error: null,

      fetchClients: async () => {
        set({ isLoading: true, error: null });
        try {
          const res = await fetch("/api/clients");
          if (!res.ok) throw new Error("Failed to fetch clients");
          const clients = await res.json();
          set({ clients, isLoading: false });
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : "Unknown error",
            isLoading: false,
          });
        }
      },

      setSelectedClient: (clientId: string | null) => {
        set({ selectedClientId: clientId });
      },

      getSelectedClient: () => {
        const { clients, selectedClientId } = get();
        if (!selectedClientId) return null;
        return clients.find((c) => c.slug === selectedClientId) || null;
      },
    }),
    {
      name: "command-centre-client",
      partialize: (state) => ({ selectedClientId: state.selectedClientId }),
    }
  )
);
