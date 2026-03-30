"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Activity, Clock, History, Cpu, FileText, Settings,
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
import type { DashboardSummary } from "@/types/dashboard";
import type { Task } from "@/types/task";

type Tab = "feed" | "scheduled" | "history" | "skills" | "docs" | "settings";

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(n);
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/** Token usage badge for the top bar */
function TokenBadge({ usage, weekCost }: {
  usage: DashboardSummary["claudeUsage"];
  weekCost: number;
}) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      fontSize: 11,
      fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
      color: "#5E5E65",
    }}>
      <span>
        Today <strong style={{ color: "#1B1C1B", fontWeight: 600 }}>{formatTokens(usage.todayTokens)}</strong>
      </span>
      <span style={{ width: 1, height: 12, backgroundColor: "rgba(218, 193, 185, 0.3)" }} />
      <span>
        Week <strong style={{ color: "#1B1C1B", fontWeight: 600 }}>{formatTokens(usage.weekTokens)}</strong>
      </span>
      {weekCost > 0 && (
        <>
          <span style={{ width: 1, height: 12, backgroundColor: "rgba(218, 193, 185, 0.3)" }} />
          <span>
            <strong style={{ color: "#1B1C1B", fontWeight: 600 }}>${weekCost.toFixed(2)}</strong>
          </span>
        </>
      )}
    </div>
  );
}

/** History tab content */
function HistoryTab() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const openTaskPanel = useTaskStore((s) => s.openPanel);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/tasks/history?limit=50&offset=0&sortBy=completedAt&sortDir=desc")
      .then((r) => r.ok ? r.json() : { tasks: [] })
      .then((data) => { setTasks(data.tasks || []); setIsLoading(false); })
      .catch(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <div style={{ padding: 40, textAlign: "center", color: "#9C9CA0", fontSize: 13 }}>Loading...</div>;
  }

  if (tasks.length === 0) {
    return <div style={{ padding: 40, textAlign: "center", color: "#9C9CA0", fontSize: 13 }}>No completed tasks yet</div>;
  }

  return (
    <div style={{ maxWidth: 720 }}>
      {tasks.map((task) => (
        <HistoryCard key={task.id} task={task} onOpen={openTaskPanel} />
      ))}
    </div>
  );
}

function HistoryCard({ task, onOpen }: { task: Task; onOpen: (id: string) => void }) {
  const [outputFiles, setOutputFiles] = useState<{ id: string; fileName: string; extension: string }[]>([]);

  useEffect(() => {
    fetch(`/api/tasks/${task.id}/outputs`)
      .then((r) => r.ok ? r.json() : [])
      .then((files) => setOutputFiles(files || []))
      .catch(() => {});
  }, [task.id]);

  // Filter "Working directory:" from description
  const desc = task.description
    ? task.description.replace(/^Working directory:\s*.+$/m, "").trim() || null
    : null;

  return (
    <div
      onClick={() => onOpen(task.id)}
      style={{
        padding: "10px 12px",
        borderRadius: 8,
        cursor: "pointer",
        border: "1px solid rgba(218, 193, 185, 0.15)",
        marginBottom: 8,
        transition: "all 120ms ease",
        backgroundColor: task.errorMessage ? "rgba(192, 64, 48, 0.02)" : "transparent",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = task.errorMessage ? "rgba(192, 64, 48, 0.05)" : "rgba(218, 193, 185, 0.06)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = task.errorMessage ? "rgba(192, 64, 48, 0.02)" : "transparent"; }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "var(--font-inter), Inter, sans-serif",
            color: "#1B1C1B",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>
            {task.title}
          </div>
          {desc && (
            <div style={{
              fontSize: 12,
              color: "#5E5E65",
              fontFamily: "var(--font-inter), Inter, sans-serif",
              marginTop: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>
              {desc}
            </div>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0, marginTop: 1 }}>
          <span style={{
            fontSize: 10,
            fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
            color: "#9C9CA0",
            whiteSpace: "nowrap",
          }}>
            {task.completedAt ? timeAgo(task.completedAt) : timeAgo(task.updatedAt)}
          </span>
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            fontSize: 10,
            fontWeight: 500,
            fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
            padding: "2px 7px",
            borderRadius: 4,
            backgroundColor: task.errorMessage ? "#C04030" : "#6B8E6B",
            color: "#FFFFFF",
            lineHeight: "14px",
          }}>
            {task.errorMessage ? "Failed" : "Done"}
          </span>
        </div>
      </div>

      {/* Stats row */}
      <div style={{
        display: "flex",
        gap: 12,
        marginTop: 4,
        fontSize: 11,
        fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
        color: "#9C9CA0",
      }}>
        {task.durationMs != null && task.durationMs > 0 && (
          <span>{Math.floor(task.durationMs / 1000)}s</span>
        )}
        {task.tokensUsed != null && task.tokensUsed > 0 && (
          <span>{formatTokens(task.tokensUsed)} tokens</span>
        )}
        {task.costUsd != null && task.costUsd > 0 && (
          <span>${task.costUsd.toFixed(2)}</span>
        )}
      </div>

      {/* Output files */}
      {outputFiles.length > 0 && (
        <div style={{
          display: "flex",
          gap: 4,
          flexWrap: "wrap",
          marginTop: 6,
        }}>
          {outputFiles.slice(0, 4).map((f) => (
            <span
              key={f.id}
              style={{
                fontSize: 10,
                fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                color: "#93452A",
                backgroundColor: "rgba(147, 69, 42, 0.06)",
                padding: "2px 8px",
                borderRadius: 3,
                whiteSpace: "nowrap",
              }}
            >
              {f.fileName}
            </span>
          ))}
          {outputFiles.length > 4 && (
            <span style={{
              fontSize: 10,
              fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
              color: "#9C9CA0",
              padding: "2px 4px",
            }}>
              +{outputFiles.length - 4} more
            </span>
          )}
        </div>
      )}
    </div>
  );
}

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
  const [activeTab, setActiveTab] = useState<Tab>("feed");
  const [usage, setUsage] = useState<DashboardSummary["claudeUsage"] | null>(null);
  const [weekCost, setWeekCost] = useState(0);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  // Fetch token usage
  useEffect(() => {
    fetch("/api/dashboard/summary")
      .then((r) => r.ok ? r.json() : null)
      .then((data: DashboardSummary | null) => {
        if (data) {
          setUsage(data.claudeUsage);
          setWeekCost(data.weekStats.totalCostUsd);
        }
      })
      .catch(() => {});
  }, []);

  const switchTab = useCallback((tab: string) => {
    setActiveTab(tab as Tab);
  }, []);

  const tabs: { key: Tab; label: string; icon: typeof Activity }[] = [
    { key: "feed", label: "Feed", icon: Activity },
    { key: "scheduled", label: "Scheduled", icon: Clock },
    { key: "history", label: "History", icon: History },
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
        borderBottom: "1px solid rgba(218, 193, 185, 0.15)",
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

        {/* Right: token usage */}
        {usage && <TokenBadge usage={usage} weekCost={weekCost} />}
      </header>

      <ScopeBar />
      <BrandContextBanner />

      {/* Content */}
      <main style={{ padding: "16px 24px 24px" }}>
        {activeTab === "feed" && (
          <FeedView clientFilter={null} onSwitchTab={switchTab} />
        )}
        {activeTab === "scheduled" && <CronJobsView />}
        {activeTab === "history" && <HistoryTab />}
        {activeTab === "skills" && <SkillsTab />}
        {activeTab === "docs" && <DocsTab />}
        {activeTab === "settings" && <SettingsTab />}
      </main>
    </div>
  );
}
