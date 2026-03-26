"use client";

import { useClientStore } from "@/store/client-store";
import { useTaskStore } from "@/store/task-store";

export function ScopeBar() {
  const selectedClientId = useClientStore((s) => s.selectedClientId);
  const getSelectedClient = useClientStore((s) => s.getSelectedClient);
  const setSelectedClient = useClientStore((s) => s.setSelectedClient);
  const fetchTasks = useTaskStore((s) => s.fetchTasks);

  // Only render when a non-Root client is selected
  if (!selectedClientId) return null;

  const client = getSelectedClient();
  const clientName = client ? client.name : selectedClientId;

  const handleSwitchToRoot = () => {
    setSelectedClient(null);
    fetchTasks();
  };

  return (
    <div
      style={{
        height: 32,
        backgroundColor: "#FFDBCF",
        borderBottom: "1px solid rgba(218, 193, 185, 0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        fontFamily: "var(--font-inter), Inter, sans-serif",
      }}
    >
      <span
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: "#390C00",
        }}
      >
        Viewing: {clientName}
      </span>
      <button
        onClick={handleSwitchToRoot}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: 12,
          fontFamily: "var(--font-inter), Inter, sans-serif",
          color: "#93452A",
          padding: 0,
          textDecoration: "none",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.textDecoration = "underline";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.textDecoration = "none";
        }}
      >
        Switch to Root
      </button>
    </div>
  );
}
