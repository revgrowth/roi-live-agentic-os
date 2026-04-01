"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Activity, Clock, Cpu, FileText, Settings,
} from "lucide-react";
import { useTaskStore } from "@/store/task-store";
import { useGsdSync } from "@/hooks/use-gsd-sync";
import { FeedView } from "@/components/board/feed-view";
import { BrandContextBanner } from "@/components/board/brand-context-banner";
import { ScopeBar } from "@/components/layout/scope-bar";
import { CronJobsView } from "@/components/cron/cron-table";
import { SkillsFileTree } from "@/components/skills/skills-file-tree";
import { SkillsSummary } from "@/components/skills/skills-summary";
import { SkillUploadModal } from "@/components/skills/skill-upload-modal";
import { ContentViewer } from "@/components/context/content-viewer";
import { DocsFileTree } from "@/components/docs/docs-file-tree";
import { SettingsTabs } from "@/components/settings/settings-tabs";
import { ScriptList } from "@/components/settings/script-list";
import { EnvEditor } from "@/components/settings/env-editor";
import { JsonEditor } from "@/components/settings/json-editor";
import { useClientStore } from "@/store/client-store";
type Tab = "feed" | "scheduled" | "skills" | "docs" | "settings";

/** Skills tab content */
function SkillsTab() {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showUpload, setShowUpload] = useState(false);

  return (
    <>
      <div style={{
        display: "flex",
        minHeight: "calc(100vh - 140px)",
        borderRadius: 8,
        overflow: "hidden",
        border: "1px solid rgba(218, 193, 185, 0.15)",
      }}>
        <div style={{
          width: 260,
          flexShrink: 0,
          backgroundColor: "#F6F3F1",
          overflowY: "auto",
          borderRight: "1px solid rgba(218, 193, 185, 0.2)",
        }}>
          <SkillsFileTree
            key={refreshKey}
            onSelectFile={setSelectedPath}
            selectedPath={selectedPath}
          />
        </div>
        <div style={{ flex: 1, backgroundColor: "#FFFFFF", minHeight: 400 }}>
          {selectedPath ? (
            <div>
              <button
                onClick={() => setSelectedPath(null)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 16px",
                  border: "none",
                  borderBottom: "1px solid rgba(218, 193, 185, 0.2)",
                  background: "transparent",
                  color: "#93452A",
                  fontFamily: "var(--font-inter), Inter, sans-serif",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                  width: "100%",
                  transition: "background 150ms ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(147, 69, 42, 0.04)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                &larr; All Skills
              </button>
              <ContentViewer
                selectedPath={selectedPath}
                onFileDeleted={() => { setSelectedPath(null); setRefreshKey((k) => k + 1); }}
              />
            </div>
          ) : (
            <SkillsSummary
              onSelectSkill={setSelectedPath}
              onAddSkill={() => setShowUpload(true)}
            />
          )}
        </div>
      </div>
      {showUpload && (
        <SkillUploadModal
          onClose={() => setShowUpload(false)}
          onComplete={() => { setShowUpload(false); setRefreshKey((k) => k + 1); }}
        />
      )}
    </>
  );
}

/** Docs tab content */
function DocsTab() {
  const [selectedPath, setSelectedPath] = useState<string | null>("CLAUDE.md");
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "260px 1fr",
      gap: 12,
      minHeight: "calc(100vh - 140px)",
    }}>
      <div style={{
        backgroundColor: "#F6F3F1",
        borderRadius: 8,
        overflowY: "auto",
        maxHeight: "calc(100vh - 140px)",
      }}>
        <DocsFileTree key={refreshKey} onSelectFile={setSelectedPath} selectedPath={selectedPath} />
      </div>
      <div style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        minHeight: 400,
      }}>
        <ContentViewer
          selectedPath={selectedPath}
          onFileDeleted={() => { setSelectedPath(null); setRefreshKey((k) => k + 1); }}
        />
      </div>
    </div>
  );
}

/** Settings tab content */
function SettingsTab() {
  const [activeSubTab, setActiveSubTab] = useState<string>("scripts");

  return (
    <div>
      <SettingsTabs activeTab={activeSubTab} onTabChange={setActiveSubTab} />
      <div style={{ minHeight: 400 }}>
        {activeSubTab === "env" && <EnvEditor />}
        {activeSubTab === "mcp" && (
          <JsonEditor
            apiEndpoint="/api/settings/mcp"
            title="MCP Configuration"
            description="Edit .mcp.json \u2014 MCP server connections and their environment variables"
            emptyMessage="No .mcp.json file found. Create one to configure MCP servers."
            maskSecrets
          />
        )}
        {activeSubTab === "claude" && (
          <JsonEditor
            apiEndpoint="/api/settings/claude-settings"
            title="Claude Settings"
            description="Edit .claude/settings.json \u2014 permissions, allowed tools, and deny patterns"
            emptyMessage="No .claude/settings.json file found. Create one to configure Claude CLI settings."
          />
        )}
        {activeSubTab === "scripts" && <ScriptList />}
      </div>
    </div>
  );
}

export default function CommandCentrePage() {
  useGsdSync();
  const fetchTasks = useTaskStore((s) => s.fetchTasks);
  const selectedClientId = useClientStore((s) => s.selectedClientId);
  const [activeTab, setActiveTab] = useState<Tab>("feed");

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const switchTab = useCallback((tab: string) => {
    setActiveTab(tab as Tab);
  }, []);

  const tabs: { key: Tab; label: string; icon: typeof Activity }[] = [
    { key: "feed", label: "Feed", icon: Activity },
    { key: "scheduled", label: "Scheduled", icon: Clock },
    { key: "skills", label: "Skills", icon: Cpu },
    { key: "docs", label: "Docs", icon: FileText },
    { key: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FCF9F7" }}>
      {/* Top bar */}
      <header style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        height: 52,
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: "rgba(252, 249, 247, 0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(218, 193, 185, 0.1)",
      }}>
        {/* Left: branding + tabs */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <h1 style={{
            fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
            fontWeight: 700,
            fontSize: 18,
            color: "#93452A",
            letterSpacing: "-0.02em",
            margin: 0,
            whiteSpace: "nowrap",
          }}>
            Agentic OS
          </h1>

          <div style={{
            width: 1,
            height: 20,
            backgroundColor: "rgba(218, 193, 185, 0.3)",
          }} />

          <nav style={{ display: "flex", alignItems: "center", gap: 0 }}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "6px 12px",
                    fontSize: 12,
                    fontWeight: isActive ? 600 : 500,
                    fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                    border: "none",
                    borderRadius: 6,
                    backgroundColor: isActive ? "rgba(147, 69, 42, 0.08)" : "transparent",
                    color: isActive ? "#93452A" : "#5E5E65",
                    cursor: "pointer",
                    transition: "all 120ms ease",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Icon size={13} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right: spacer */}
        <div />
      </header>

      <ScopeBar />
      <BrandContextBanner />

      {/* Content */}
      <main style={{ padding: "16px 24px 24px" }}>
        {activeTab === "feed" && (
          <FeedView clientFilter={selectedClientId} onSwitchTab={switchTab} />
        )}
        {activeTab === "scheduled" && <CronJobsView />}
        {activeTab === "skills" && <SkillsTab />}
        {activeTab === "docs" && <DocsTab />}
        {activeTab === "settings" && <SettingsTab />}
      </main>
    </div>
  );
}
