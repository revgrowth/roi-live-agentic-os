"use client";

import { useEffect, useState, useCallback } from "react";
import { AppShell } from "@/components/layout/app-shell";
import {
  Timer, CheckCircle2, AlertCircle, Clock, ChevronLeft, ChevronRight,
  ChevronDown, MessageSquare, Wrench, FileText, ExternalLink, Eye,
} from "lucide-react";
import type { Task, TaskLevel, LogEntry, OutputFile } from "@/types/task";
import { LEVEL_LABELS } from "@/types/task";
import { useTaskStore } from "@/store/task-store";

const PAGE_SIZE = 50;

// ─── Formatters ──────────────────────────────────────────────────────────────

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m < 60) return `${m}m ${s.toString().padStart(2, "0")}s`;
  const h = Math.floor(m / 60);
  const rm = m % 60;
  return `${h}h ${rm}m`;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "--";
  const d = new Date(dateStr);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = d.toDateString() === yesterday.toDateString();

  const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (isToday) return `Today ${time}`;
  if (isYesterday) return `Yesterday ${time}`;
  return `${d.toLocaleDateString([], { month: "short", day: "numeric" })} ${time}`;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", hour12: false });
}

function formatTokens(tokens: number): string {
  if (tokens >= 1000) return `${(tokens / 1000).toFixed(1)}k`;
  return tokens.toString();
}

// ─── Chat digest (reused from modal-summary-tab pattern) ─────────────────────

type DigestEntry = { type: "text" | "tools" | "question" | "reply"; label: string; time: string };

function buildChatDigest(logEntries: LogEntry[]): DigestEntry[] {
  const digest: DigestEntry[] = [];
  let pendingTools: { reads: number; writes: number; actions: number; lastTime: string } | null = null;

  const flushTools = () => {
    if (!pendingTools) return;
    const parts: string[] = [];
    if (pendingTools.reads > 0) parts.push(`${pendingTools.reads} read${pendingTools.reads !== 1 ? "s" : ""}`);
    if (pendingTools.writes > 0) parts.push(`${pendingTools.writes} write${pendingTools.writes !== 1 ? "s" : ""}`);
    if (pendingTools.actions > 0) parts.push(`${pendingTools.actions} action${pendingTools.actions !== 1 ? "s" : ""}`);
    digest.push({ type: "tools", label: parts.join(", "), time: pendingTools.lastTime });
    pendingTools = null;
  };

  for (const entry of logEntries) {
    if (entry.type === "tool_use") {
      if (!pendingTools) pendingTools = { reads: 0, writes: 0, actions: 0, lastTime: entry.timestamp };
      pendingTools.lastTime = entry.timestamp;
      const name = (entry.toolName || "").toLowerCase();
      if (["read", "glob", "grep", "webfetch", "websearch"].includes(name)) pendingTools.reads++;
      else if (["write", "edit"].includes(name)) pendingTools.writes++;
      else pendingTools.actions++;
      continue;
    }
    flushTools();
    if (entry.type === "text" && entry.content.length > 30) {
      digest.push({ type: "text", label: entry.content.length > 140 ? entry.content.slice(0, 140).trimEnd() + "..." : entry.content, time: entry.timestamp });
    } else if (entry.type === "question") {
      digest.push({ type: "question", label: entry.content.length > 140 ? entry.content.slice(0, 140).trimEnd() + "..." : entry.content, time: entry.timestamp });
    } else if (entry.type === "user_reply") {
      digest.push({ type: "reply", label: entry.content.length > 100 ? entry.content.slice(0, 100).trimEnd() + "..." : entry.content, time: entry.timestamp });
    }
  }
  flushTools();
  return digest;
}

// ─── Small components ────────────────────────────────────────────────────────

function StatusBadge({ status, hasError }: { status: string; hasError: boolean }) {
  if (hasError) {
    return (
      <span style={{ ...badgeBase, backgroundColor: "rgba(192, 64, 48, 0.1)", color: "#C04030" }}>
        <AlertCircle size={12} /> Failed
      </span>
    );
  }
  if (status === "review") {
    return (
      <span style={{ ...badgeBase, backgroundColor: "rgba(178, 93, 63, 0.1)", color: "#B25D3F" }}>
        <Clock size={12} /> Review
      </span>
    );
  }
  return (
    <span style={{ ...badgeBase, backgroundColor: "rgba(107, 142, 107, 0.1)", color: "#6B8E6B" }}>
      <CheckCircle2 size={12} /> Done
    </span>
  );
}

function DigestIcon({ type }: { type: DigestEntry["type"] }) {
  const s = { flexShrink: 0, marginTop: 2 } as const;
  switch (type) {
    case "text": return <MessageSquare size={13} color="#5E5E65" style={s} />;
    case "tools": return <Wrench size={13} color="#9C9CA0" style={s} />;
    case "question": return <Eye size={13} color="#93452A" style={s} />;
    case "reply": return <MessageSquare size={13} color="#93452A" style={s} />;
  }
}

// ─── Expandable row ──────────────────────────────────────────────────────────

function HistoryRow({ task }: { task: Task }) {
  const [expanded, setExpanded] = useState(false);
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [outputFiles, setOutputFiles] = useState<OutputFile[]>([]);
  const [detailLoaded, setDetailLoaded] = useState(false);
  const openPanel = useTaskStore((s) => s.openPanel);

  // Fetch logs + outputs on first expand
  useEffect(() => {
    if (!expanded || detailLoaded) return;
    setDetailLoaded(true);

    fetch(`/api/tasks/${task.id}/logs`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setLogEntries)
      .catch(() => {});

    fetch(`/api/tasks/${task.id}/outputs`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setOutputFiles)
      .catch(() => {});
  }, [expanded, detailLoaded, task.id]);

  const digest = expanded ? buildChatDigest(logEntries) : [];

  return (
    <>
      {/* Main row */}
      <tr
        onClick={() => setExpanded(!expanded)}
        style={{
          borderBottom: expanded ? "none" : "1px solid rgba(218, 193, 185, 0.15)",
          cursor: "pointer",
          transition: "background 100ms ease",
          backgroundColor: expanded ? "rgba(218, 193, 185, 0.06)" : "transparent",
        }}
        onMouseEnter={(e) => { if (!expanded) e.currentTarget.style.backgroundColor = "rgba(218, 193, 185, 0.06)"; }}
        onMouseLeave={(e) => { if (!expanded) e.currentTarget.style.backgroundColor = "transparent"; }}
      >
        <td style={tdStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ChevronDown
              size={14}
              color="#9C9CA0"
              style={{
                flexShrink: 0,
                transform: expanded ? "rotate(0deg)" : "rotate(-90deg)",
                transition: "transform 150ms ease",
              }}
            />
            <div style={{ overflow: "hidden", minWidth: 0 }}>
              <div
                style={{
                  fontWeight: 500,
                  color: "#1B1C1B",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: 380,
                }}
              >
                {task.title}
              </div>
              {task.description && !expanded && (
                <div
                  style={{
                    fontSize: 12,
                    color: "#5E5E65",
                    marginTop: 2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: 380,
                  }}
                >
                  {task.description}
                </div>
              )}
            </div>
          </div>
        </td>
        <td style={tdStyle}>
          {task.cronJobSlug ? (
            <span style={{ ...badgeBase, backgroundColor: "rgba(59, 130, 246, 0.1)", color: "#3B82F6" }}>
              <Timer size={10} /> Cron
            </span>
          ) : (
            <span
              style={{
                fontSize: 12, fontWeight: 500,
                fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                padding: "2px 8px", borderRadius: 4,
                backgroundColor: "rgba(94, 94, 101, 0.08)", color: "#5E5E65",
              }}
            >
              {LEVEL_LABELS[task.level as TaskLevel] || task.level}
            </span>
          )}
        </td>
        <td style={tdStyle}>
          <StatusBadge status={task.status} hasError={task.errorMessage !== null} />
        </td>
        <td style={{ ...tdStyle, ...monoCell }}>{formatDate(task.startedAt)}</td>
        <td style={{ ...tdStyle, ...monoCell }}>{formatDate(task.completedAt)}</td>
        <td style={{ ...tdStyle, ...monoCell, textAlign: "right" }}>
          {task.durationMs ? formatDuration(task.durationMs) : "--"}
        </td>
        <td style={{ ...tdStyle, ...monoCell, textAlign: "right" }}>
          {task.costUsd != null ? `$${task.costUsd.toFixed(2)}` : "--"}
        </td>
      </tr>

      {/* Expanded detail row */}
      {expanded && (
        <tr style={{ borderBottom: "1px solid rgba(218, 193, 185, 0.15)" }}>
          <td colSpan={7} style={{ padding: 0 }}>
            <div
              style={{
                padding: "16px 24px 20px 46px",
                backgroundColor: "#FAFAF9",
                borderTop: "1px solid rgba(218, 193, 185, 0.15)",
              }}
            >
              {/* Stats row */}
              <div style={{ display: "flex", gap: 24, marginBottom: 16, flexWrap: "wrap" }}>
                <StatPill label="Duration" value={task.durationMs ? formatDuration(task.durationMs) : "--"} />
                <StatPill label="Cost" value={task.costUsd != null ? `$${task.costUsd.toFixed(2)}` : "--"} />
                <StatPill label="Tokens" value={task.tokensUsed != null ? formatTokens(task.tokensUsed) : "--"} />
                {task.cronJobSlug && <StatPill label="Cron Job" value={task.cronJobSlug} />}
              </div>

              {/* Error banner */}
              {task.errorMessage && (
                <div
                  style={{
                    display: "flex", alignItems: "flex-start", gap: 8,
                    padding: "10px 14px", backgroundColor: "#FFF5F3",
                    borderRadius: 8, marginBottom: 16,
                  }}
                >
                  <AlertCircle size={14} color="#C04030" style={{ flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 13, fontFamily: "var(--font-inter), Inter, sans-serif", color: "#C04030", lineHeight: 1.4 }}>
                    {task.errorMessage}
                  </span>
                </div>
              )}

              {/* Description */}
              {task.description && (
                <p
                  style={{
                    fontSize: 13, fontFamily: "var(--font-inter), Inter, sans-serif",
                    color: "#5E5E65", margin: "0 0 16px 0", lineHeight: 1.5,
                  }}
                >
                  {task.description}
                </p>
              )}

              {/* Activity digest */}
              {digest.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={sectionLabel}>Activity</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {digest.slice(-6).map((item, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "4px 0" }}>
                        <span style={{ fontSize: 10, fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif", color: "#9C9CA0", minWidth: 38, flexShrink: 0, marginTop: 2 }}>
                          {formatTime(item.time)}
                        </span>
                        <DigestIcon type={item.type} />
                        <span
                          style={{
                            fontSize: 13, fontFamily: "var(--font-inter), Inter, sans-serif",
                            color: item.type === "tools" ? "#5E5E65" : item.type === "reply" ? "#93452A" : "#1B1C1B",
                            fontWeight: item.type === "question" ? 500 : 400,
                            lineHeight: 1.4, flex: 1,
                            overflow: "hidden", display: "-webkit-box",
                            WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const,
                          }}
                        >
                          {item.label}
                        </span>
                      </div>
                    ))}
                    {digest.length > 6 && (
                      <div style={{ fontSize: 12, color: "#9C9CA0", fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif", paddingTop: 4 }}>
                        +{digest.length - 6} more entries
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Output files */}
              {outputFiles.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={sectionLabel}>Output Files ({outputFiles.length})</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {outputFiles.slice(0, 6).map((file) => (
                      <span
                        key={file.id}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 5,
                          padding: "5px 10px", borderRadius: 6,
                          backgroundColor: "#F6F3F1", fontSize: 12,
                          fontFamily: "var(--font-inter), Inter, sans-serif",
                          fontWeight: 500, color: "#1B1C1B",
                        }}
                      >
                        <FileText size={12} color="#93452A" />
                        {file.fileName}
                        <span style={{ fontSize: 10, color: "#9C9CA0", backgroundColor: "#FFFFFF", padding: "1px 5px", borderRadius: 3 }}>
                          .{file.extension}
                        </span>
                      </span>
                    ))}
                    {outputFiles.length > 6 && (
                      <span style={{ fontSize: 12, color: "#9C9CA0", fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif", padding: "5px 0", alignSelf: "center" }}>
                        +{outputFiles.length - 6} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* View full log button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openPanel(task.id);
                }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "8px 16px", borderRadius: 8,
                  border: "1px solid rgba(147, 69, 42, 0.2)",
                  backgroundColor: "#FFFFFF", color: "#93452A",
                  fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                  fontSize: 13, fontWeight: 500, cursor: "pointer",
                  transition: "all 150ms ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#FFF5F0"; e.currentTarget.style.borderColor = "#93452A"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#FFFFFF"; e.currentTarget.style.borderColor = "rgba(147, 69, 42, 0.2)"; }}
              >
                <ExternalLink size={13} />
                View full log
              </button>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ fontSize: 11, fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif", textTransform: "uppercase", letterSpacing: "0.06em", color: "#9C9CA0", fontWeight: 600 }}>
        {label}
      </span>
      <span style={{ fontSize: 14, fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif", fontWeight: 600, color: "#1B1C1B" }}>
        {value}
      </span>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function HistoryPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const fetchStoreTasks = useTaskStore((s) => s.fetchTasks);

  // Load all tasks into Zustand store so the TaskModal can find them
  useEffect(() => {
    fetchStoreTasks();
  }, [fetchStoreTasks]);

  const fetchHistory = useCallback(async (pageNum: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/tasks/history?limit=${PAGE_SIZE}&offset=${pageNum * PAGE_SIZE}`
      );
      if (!res.ok) throw new Error("Failed to fetch history");
      const data = await res.json();
      setTasks(data.tasks);
      setTotal(data.total);
    } catch (err) {
      console.error("History fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory(page);
  }, [page, fetchHistory]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <AppShell>
      <div style={{ padding: "32px 40px", maxWidth: 1200 }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
              fontSize: 28, fontWeight: 700, color: "#1B1C1B",
              letterSpacing: "-0.02em", margin: 0,
            }}
          >
            Task History
          </h1>
          <p
            style={{
              fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
              fontSize: 14, color: "#5E5E65", marginTop: 8,
            }}
          >
            {total} completed task{total !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Table */}
        <div
          style={{
            backgroundColor: "#FFFFFF", borderRadius: 12,
            border: "1px solid rgba(218, 193, 185, 0.2)", overflow: "hidden",
          }}
        >
          <table
            style={{
              width: "100%", borderCollapse: "collapse",
              fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 14,
            }}
          >
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(218, 193, 185, 0.3)", backgroundColor: "#FAFAF9" }}>
                <th style={thStyle}>Task</th>
                <th style={{ ...thStyle, width: 80 }}>Type</th>
                <th style={{ ...thStyle, width: 100 }}>Status</th>
                <th style={{ ...thStyle, width: 150 }}>Started</th>
                <th style={{ ...thStyle, width: 150 }}>Completed</th>
                <th style={{ ...thStyle, width: 90, textAlign: "right" }}>Duration</th>
                <th style={{ ...thStyle, width: 80, textAlign: "right" }}>Cost</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && tasks.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: 40, textAlign: "center", color: "#5E5E65" }}>
                    Loading...
                  </td>
                </tr>
              ) : tasks.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: 40, textAlign: "center", color: "#5E5E65" }}>
                    No completed tasks yet
                  </td>
                </tr>
              ) : (
                tasks.map((task) => <HistoryRow key={task.id} task={task} />)
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: 16, marginTop: 24,
              fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
              fontSize: 14, color: "#5E5E65",
            }}
          >
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              style={paginationBtnStyle}
            >
              <ChevronLeft size={16} /> Prev
            </button>
            <span>Page {page + 1} of {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              style={paginationBtnStyle}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}

// ─── Shared styles ───────────────────────────────────────────────────────────

const badgeBase: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 4,
  fontSize: 12, fontWeight: 500,
  fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
  padding: "3px 10px", borderRadius: 6,
};

const thStyle: React.CSSProperties = {
  padding: "12px 16px", textAlign: "left",
  fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
  fontSize: 12, fontWeight: 600, textTransform: "uppercase",
  letterSpacing: "0.06em", color: "#5E5E65",
};

const tdStyle: React.CSSProperties = {
  padding: "14px 16px",
};

const monoCell: React.CSSProperties = {
  fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
  fontSize: 13, color: "#5E5E65",
};

const sectionLabel: React.CSSProperties = {
  fontSize: 11, fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
  textTransform: "uppercase", letterSpacing: "0.08em",
  color: "#9C9CA0", fontWeight: 600, marginBottom: 8,
};

const paginationBtnStyle: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 4,
  padding: "8px 16px", borderRadius: 8,
  border: "1px solid rgba(218, 193, 185, 0.3)",
  backgroundColor: "#FFFFFF", color: "#5E5E65", cursor: "pointer",
  fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
  fontSize: 13, fontWeight: 500,
};
