"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { SettingsTabs } from "@/components/settings/settings-tabs";

type TabId = "scripts" | "env" | "mcp" | "claude";

const tabLabels: Record<TabId, string> = {
  scripts: "Scripts",
  env: "Environment",
  mcp: "MCP",
  claude: "Claude Settings",
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("scripts");

  return (
    <AppShell title="Settings">
      <SettingsTabs activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab as TabId)} />
      <div style={{ padding: 24, minHeight: 400 }}>
        <div
          style={{
            color: "#5E5E65",
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontSize: 14,
          }}
        >
          {tabLabels[activeTab]} — Coming soon...
        </div>
      </div>
    </AppShell>
  );
}
