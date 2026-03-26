"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { StatsBar } from "./stats-bar";
import { ScopeBar } from "./scope-bar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main style={{ flex: 1, minHeight: "100vh" }}>
        {/* Sticky header */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 32px",
            height: 64,
            position: "sticky",
            top: 0,
            zIndex: 50,
            backgroundColor: "rgba(252, 249, 247, 0.8)",
            backdropFilter: "blur(12px)",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
              fontWeight: 700,
              fontSize: 20,
              color: "#93452A",
              margin: 0,
            }}
          >
            Command Centre
          </h2>
        </header>
        <ScopeBar />
        <div style={{ padding: "0 32px" }}>
          <StatsBar />
        </div>
        <div style={{ padding: "0 32px 32px", display: "flex", flexDirection: "column", gap: 24, marginTop: 24 }}>
          {children}
        </div>
      </main>
    </div>
  );
}
