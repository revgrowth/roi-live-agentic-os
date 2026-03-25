"use client";

import { Sidebar } from "./sidebar";
import { StatsBar } from "./stats-bar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <StatsBar />
        <main style={{ flex: 1, padding: "24px", overflow: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
