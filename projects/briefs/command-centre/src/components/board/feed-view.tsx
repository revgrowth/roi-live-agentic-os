"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, CheckCircle2, Paperclip, Download, Eye, FileText } from "lucide-react";
import { useTaskStore } from "@/store/task-store";
import type { Task, LogEntry } from "@/types/task";
import { TaskCreateInput } from "./task-create-input";
import { useClientStore } from "@/store/client-store";
import type { Client } from "@/types/client";
import { useCronStore } from "@/store/cron-store";
import type { CronJob } from "@/types/cron";
import { ChatEntry } from "@/components/modal/chat-entry";
import { SlashCommandMenu } from "@/components/shared/slash-command-menu";
import type { SlashCommand } from "@/lib/slash-commands";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const mdComponents = {
  p: ({ children }: { children?: React.ReactNode }) => <p style={{ margin: "6px 0" }}>{children}</p>,
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
    <a href={href} style={{ color: "#93452A", textDecoration: "underline" }} target="_blank" rel="noopener noreferrer">{children}</a>
  ),
  code: ({ children, className: cn }: { children?: React.ReactNode; className?: string }) => cn
    ? <code style={{ fontFamily: "'DM Mono', monospace", fontSize: 12 }}>{children}</code>
    : <code style={{ backgroundColor: "rgba(0,0,0,0.06)", padding: "1px 4px", borderRadius: 3, fontFamily: "'DM Mono', monospace", fontSize: 12 }}>{children}</code>,
  pre: ({ children }: { children?: React.ReactNode }) => <pre style={{ backgroundColor: "rgba(0,0,0,0.04)", padding: 12, borderRadius: 6, overflow: "auto", margin: "8px 0", fontSize: 12 }}>{children}</pre>,
  ul: ({ children }: { children?: React.ReactNode }) => <ul style={{ paddingLeft: 20, margin: "4px 0" }}>{children}</ul>,
  ol: ({ children }: { children?: React.ReactNode }) => <ol style={{ paddingLeft: 20, margin: "4px 0" }}>{children}</ol>,
  li: ({ children }: { children?: React.ReactNode }) => <li style={{ margin: "2px 0" }}>{children}</li>,
  h1: ({ children }: { children?: React.ReactNode }) => <h1 style={{ fontSize: 16, fontWeight: 700, margin: "12px 0 6px" }}>{children}</h1>,
  h2: ({ children }: { children?: React.ReactNode }) => <h2 style={{ fontSize: 14, fontWeight: 700, margin: "10px 0 4px" }}>{children}</h2>,
  h3: ({ children }: { children?: React.ReactNode }) => <h3 style={{ fontSize: 13, fontWeight: 600, margin: "8px 0 4px" }}>{children}</h3>,
  blockquote: ({ children }: { children?: React.ReactNode }) => <blockquote style={{ borderLeft: "3px solid #93452A", paddingLeft: 12, margin: "6px 0", color: "#5E5E65", fontStyle: "italic" }}>{children}</blockquote>,
  table: ({ children }: { children?: React.ReactNode }) => <table style={{ width: "100%", borderCollapse: "collapse", margin: "8px 0", fontSize: 12 }}>{children}</table>,
  th: ({ children }: { children?: React.ReactNode }) => <th style={{ padding: "4px 8px", textAlign: "left" as const, fontWeight: 600, borderBottom: "1px solid rgba(0,0,0,0.1)" }}>{children}</th>,
  td: ({ children }: { children?: React.ReactNode }) => <td style={{ padding: "4px 8px", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>{children}</td>,
  hr: () => <hr style={{ border: "none", borderTop: "1px solid rgba(218, 193, 185, 0.3)", margin: "12px 0" }} />,
};

// ── Paste chip type ─────────────────────────────────────────────

interface PastedChip {
  kind: "text" | "image";
  label: string;          // e.g. "47 lines" or "screenshot.png"
  content: string;        // full text or base64 data URI
}

const PASTE_LINE_THRESHOLD = 5;

function buildPasteLabel(text: string): string {
  const lines = text.split("\n").length;
  return `${lines.toLocaleString()} line${lines === 1 ? "" : "s"}`;
}

// ── Helpers ──────────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
  const ts = new Date(dateStr).getTime();
  if (isNaN(ts)) return "--";
  const diff = Date.now() - ts;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatElapsed(startedAt: string): string {
  const ms = Date.now() - new Date(startedAt).getTime();
  const sec = Math.floor(ms / 1000);
  if (sec < 60) return `${sec}s`;
  const min = Math.floor(sec / 60);
  const rem = sec % 60;
  if (min < 60) return `${min}m ${rem.toString().padStart(2, "0")}s`;
  const hr = Math.floor(min / 60);
  return `${hr}h ${min % 60}m`;
}

function taskNeedsInput(t: Task): boolean {
  return t.needsInput || !!t.errorMessage || t.status === "review";
}

function isAchieved(t: Task): boolean {
  return t.status === "done" && !taskNeedsInput(t);
}

function isTerminalTask(t: Task): boolean {
  return !!(t.description && /^Working directory:\s/m.test(t.description));
}

// ── GoalCard ─────────────────────────────────────────────────────

function GoalCard({
  task,
  allTasks,
  clients,
  isSelected,
  dimmed,
  compact,
  onSelect,
  onDragStart,
}: {
  task: Task;
  allTasks: Task[];
  clients: Client[];
  isSelected: boolean;
  dimmed: boolean;
  compact?: boolean;
  onSelect: (id: string) => void;
  onDragStart: (id: string, e: React.DragEvent) => void;
}) {
  const needs = taskNeedsInput(task);
  const isRunning = task.status === "running" && !needs;
  const isDone = isAchieved(task);
  const client = task.clientId ? clients.find((c) => c.slug === task.clientId) : null;

  const children = allTasks.filter(
    (t) => t.parentId === task.id || (task.projectSlug && t.projectSlug === task.projectSlug && t.id !== task.id)
  );
  const hasChildren = children.length > 0;
  const childDone = children.filter((t) => t.status === "done").length;
  const progress = hasChildren
    ? Math.round((childDone / children.length) * 100)
    : isDone ? 100 : isRunning ? 50 : task.status === "queued" ? 10 : 0;

  const [elapsed, setElapsed] = useState("");
  useEffect(() => {
    if (!isRunning || !task.startedAt) return;
    const tick = () => setElapsed(formatElapsed(task.startedAt!));
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, [isRunning, task.startedAt]);

  const statusLabel = needs
    ? "Needs input"
    : isRunning
    ? (elapsed ? `Running \u00b7 ${elapsed}` : "Running")
    : task.status === "queued"
    ? "Queued"
    : task.status === "backlog"
    ? "Backlog"
    : "In progress";

  const statusColor = needs ? "#e8956d" : isRunning ? "rgba(147, 69, 42, 0.7)" : "#999";

  const badgeContent = needs
    ? "needs input"
    : isRunning
    ? (elapsed || "running")
    : task.createdAt
    ? timeAgo(task.createdAt)
    : null;

  const badgeColor = needs ? "#e8956d" : isRunning ? "rgba(147, 69, 42, 0.6)" : "#bbb";

  return (
    <div
      data-card
      draggable
      onDragStart={(e) => onDragStart(task.id, e)}
      onClick={() => onSelect(task.id)}
      style={{
        background: needs ? "#fffcfa" : isDone ? "#fafaf9" : "white",
        border: isSelected
          ? "1px solid rgba(147, 69, 42, 0.35)"
          : needs
          ? "1px solid rgba(232, 149, 109, 0.35)"
          : isDone
          ? "1px solid rgba(218, 193, 185, 0.2)"
          : "1px solid rgba(218, 193, 185, 0.18)",
        borderRadius: compact ? 8 : 10,
        padding: compact ? 10 : 14,
        cursor: "grab",
        position: "relative",
        overflow: "hidden",
        transition: "border-color 0.15s, box-shadow 0.15s, opacity 0.2s, filter 0.2s",
        opacity: dimmed ? 0.4 : isDone ? 0.6 : 1,
        filter: dimmed ? "saturate(0.3)" : "none",
        boxShadow: isSelected
          ? "0 0 0 1px rgba(147, 69, 42, 0.2)"
          : isDone ? "none" : "0 1px 3px rgba(0, 0, 0, 0.03)",
      }}
    >
      {badgeContent && (
        <div style={{
          position: "absolute",
          top: 8,
          right: 10,
          fontSize: 9,
          color: badgeColor,
          fontFamily: "'DM Mono', monospace",
          letterSpacing: "0.04em",
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}>
          {(needs || isRunning) && (
            <span style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              backgroundColor: badgeColor,
              animation: "pulse-dot 2s ease-in-out infinite",
            }} />
          )}
          {badgeContent}
        </div>
      )}

      <div style={{
        fontSize: compact ? 12 : 13,
        fontWeight: 600,
        color: isDone ? "#aaa" : "#2c2c2c",
        marginBottom: compact ? 2 : 4,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        paddingRight: badgeContent ? 80 : 0,
      }}>
        {task.title}
      </div>

      {isDone ? (
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 3,
          fontSize: 9,
          color: "#7ab87a",
          fontFamily: "'DM Mono', monospace",
          marginTop: 6,
        }}>
          <Check size={10} />
          complete
        </div>
      ) : (
        <>
          <div style={{
            fontSize: compact ? 10 : 11,
            color: statusColor,
            fontFamily: "'DM Mono', monospace",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}>
            <span>
              {statusLabel}
              {hasChildren ? ` \u00b7 ${childDone}/${children.length}` : ""}
            </span>
            {client && (
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 3,
                fontSize: 9,
                color: "#999",
                background: "rgba(0,0,0,0.04)",
                padding: "1px 6px 1px 4px",
                borderRadius: 8,
              }}>
                <span style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: client.color || "#999",
                  flexShrink: 0,
                }} />
                {client.name}
              </span>
            )}
          </div>

          {isRunning && task.activityLabel && (
            <div style={{
              fontSize: 10,
              color: "#aaa",
              fontFamily: "'DM Mono', monospace",
              marginTop: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>
              {task.activityLabel}
            </div>
          )}

          {!compact && (
            <div style={{
              marginTop: 10,
              height: 3,
              background: "rgba(218, 193, 185, 0.2)",
              borderRadius: 2,
              overflow: "hidden",
            }}>
              <div style={{
                height: "100%",
                background: needs ? "rgba(232, 149, 109, 0.5)" : "rgba(147, 69, 42, 0.4)",
                borderRadius: 2,
                width: `${progress}%`,
                transition: "width 300ms ease",
              }} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── DoneDropZone ─────────────────────────────────────────────────

function DoneDropZone({
  visible,
  isOver,
  onDrop,
  onDragOver,
  onDragLeave,
}: {
  visible: boolean;
  isOver: boolean;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
}) {
  if (!visible) return null;

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      style={{
        border: isOver ? "2px solid #7ab87a" : "2px dashed #ccc",
        borderRadius: 10,
        padding: "20px 24px",
        textAlign: "center",
        background: isOver ? "rgba(122, 184, 122, 0.08)" : "rgba(0,0,0,0.02)",
        transition: "all 150ms ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      }}
    >
      <CheckCircle2 size={16} color={isOver ? "#7ab87a" : "#aaa"} />
      <span style={{
        fontSize: 13,
        fontWeight: 500,
        color: isOver ? "#7ab87a" : "#aaa",
        fontFamily: "'DM Mono', monospace",
        transition: "color 150ms ease",
      }}>
        Drop here to mark done
      </span>
    </div>
  );
}

// ── HistorySidebar ───────────────────────────────────────────────

function HistorySidebar({
  tasks,
  selectedId,
  onSelect,
}: {
  tasks: Task[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const router = useRouter();
  const hasSelection = !!selectedId;

  const dateGrouped = useMemo(() => {
    const sorted = [...tasks]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 30);

    const groups: { label: string; sortKey: number; items: Task[] }[] = [];
    const groupMap = new Map<string, Task[]>();

    for (const t of sorted) {
      const d = new Date(t.updatedAt);
      const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      if (!groupMap.has(key)) groupMap.set(key, []);
      groupMap.get(key)!.push(t);
    }

    for (const [, items] of groupMap) {
      groups.push({
        label: formatDateLabel(items[0].updatedAt),
        sortKey: new Date(items[0].updatedAt).getTime(),
        items,
      });
    }

    return groups.sort((a, b) => b.sortKey - a.sortKey);
  }, [tasks]);

  return (
    <div data-card style={{
      background: "white",
      borderRadius: 10,
      padding: 14,
      border: "1px solid #e0dbd4",
    }}>
      <div style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 10,
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        color: "#999",
        marginBottom: 12,
      }}>
        History
      </div>

      {dateGrouped.map((group) => (
        <div key={group.label}>
          <div style={{
            fontSize: 9,
            fontFamily: "'DM Mono', monospace",
            color: "#c0b8b0",
            letterSpacing: "0.06em",
            padding: "6px 0 3px",
          }}>
            {group.label}
          </div>
          {group.items.map((t) => {
            const isSel = selectedId === t.id;
            const dimmed = hasSelection && !isSel;
            return (
              <div
                key={t.id}
                onClick={() => onSelect(t.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "5px 0",
                  borderBottom: "1px dashed #e8e4df",
                  fontSize: 12,
                  color: isSel ? "#1a1a1a" : dimmed ? "#ccc" : "#555",
                  fontWeight: isSel ? 600 : 400,
                  cursor: "pointer",
                  transition: "color 0.2s, opacity 0.2s",
                  opacity: dimmed ? 0.5 : 1,
                }}
              >
                <span style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: dimmed ? "#ddd"
                    : isAchieved(t) ? "#7ab87a"
                    : t.status === "running" && !taskNeedsInput(t) ? "#1a1a1a"
                    : taskNeedsInput(t) ? "#e8956d"
                    : "#ccc",
                  flexShrink: 0,
                  animation: !dimmed && t.status === "running" && !taskNeedsInput(t) ? "pulse-dot 2s ease-in-out infinite" : undefined,
                  transition: "background 0.2s",
                }} />
                <span style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}>
                  {t.title}
                </span>
              </div>
            );
          })}
        </div>
      ))}

      {tasks.filter((t) => isAchieved(t)).length > 30 && (
        <div
          onClick={() => router.push("/history")}
          style={{
            fontSize: 11,
            color: "#1a1a1a",
            fontFamily: "'DM Mono', monospace",
            padding: "8px 0 0",
            cursor: "pointer",
          }}
        >
          View all &rarr;
        </div>
      )}
    </div>
  );
}

// ── DetailPanel ──────────────────────────────────────────────────

/** Split log entries into "latest exchange" (last user msg + subsequent agent msgs) and "older history" */
function splitLogEntries(entries: LogEntry[]): { latest: LogEntry[]; older: LogEntry[] } {
  if (entries.length === 0) return { latest: [], older: [] };

  // Find the last user_reply or question entry — that marks the start of the latest exchange
  let splitIdx = entries.length;
  for (let i = entries.length - 1; i >= 0; i--) {
    if (entries[i].type === "user_reply" || entries[i].type === "question") {
      splitIdx = i;
      break;
    }
  }

  // If no user message found, show the last few agent messages as "latest"
  if (splitIdx === entries.length) {
    // Take the last cluster of text entries as the latest
    let start = entries.length;
    for (let i = entries.length - 1; i >= 0; i--) {
      if (entries[i].type === "text" || entries[i].type === "question") {
        start = i;
      } else {
        break;
      }
    }
    return {
      latest: entries.slice(start),
      older: entries.slice(0, start),
    };
  }

  return {
    latest: entries.slice(splitIdx),
    older: entries.slice(0, splitIdx),
  };
}

// ── SubtasksList (truncated with expand) ────────────────────────

const SUBTASK_FOLD = 5;

function SubtasksList({ subtasks }: { subtasks: Task[] }) {
  const [expanded, setExpanded] = useState(false);

  if (subtasks.length === 0) {
    return (
      <div style={{ fontSize: 11, color: "#ccc", fontFamily: "'DM Mono', monospace", padding: "8px 0" }}>
        No subtasks yet
      </div>
    );
  }

  const visible = expanded ? subtasks : subtasks.slice(0, SUBTASK_FOLD);
  const hiddenCount = subtasks.length - SUBTASK_FOLD;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {visible.map((st) => {
        const stNeeds = taskNeedsInput(st);
        const stDone = st.status === "done";
        const stRunning = st.status === "running" && !stNeeds;
        return (
          <div
            key={st.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 6px",
              borderRadius: 5,
              fontSize: 11,
              color: stDone ? "#aaa" : stNeeds ? "#e8956d" : "#555",
              background: stNeeds ? "rgba(232, 149, 109, 0.06)" : "transparent",
              borderLeft: stNeeds ? "2px solid #e8956d" : stRunning ? "2px solid rgba(147, 69, 42, 0.5)" : "2px solid transparent",
              textDecoration: stDone ? "line-through" : "none",
            }}
          >
            <span style={{
              width: 5, height: 5, borderRadius: "50%", flexShrink: 0,
              background: stDone ? "#7ab87a" : stRunning ? "#1a1a1a" : stNeeds ? "#e8956d" : st.status === "queued" ? "#ccc" : "#e0dcd6",
              animation: stRunning ? "pulse-dot 2s ease-in-out infinite" : undefined,
            }} />
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
              {st.title}
            </span>
            <span style={{
              fontSize: 9, fontFamily: "'DM Mono', monospace",
              color: stDone ? "#bbb" : stNeeds ? "#e8956d" : "#bbb", flexShrink: 0,
            }}>
              {stDone ? "done" : stNeeds ? "input" : stRunning ? "running" : st.status}
            </span>
          </div>
        );
      })}
      {hiddenCount > 0 && !expanded && (
        <button
          onClick={() => setExpanded(true)}
          style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            background: "none", border: "none", cursor: "pointer",
            fontSize: 10, fontFamily: "'DM Mono', monospace", color: "#aaa",
            padding: "4px 6px", marginTop: 2,
          }}
        >
          <span style={{ fontSize: 8 }}>&#9654;</span>
          {hiddenCount} more
        </button>
      )}
      {expanded && hiddenCount > 0 && (
        <button
          onClick={() => setExpanded(false)}
          style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            background: "none", border: "none", cursor: "pointer",
            fontSize: 10, fontFamily: "'DM Mono', monospace", color: "#aaa",
            padding: "4px 6px", marginTop: 2,
          }}
        >
          <span style={{ fontSize: 8, transform: "rotate(90deg)", display: "inline-block" }}>&#9654;</span>
          show less
        </button>
      )}
    </div>
  );
}

// ── GSD Phases Overview ─────────────────────────────────────────

interface GsdPhaseGroup {
  phaseNumber: number;
  phaseName: string;
  steps: Task[];
}

interface PlanningFile {
  name: string;
  relativePath: string;
  size: number;
}

function PlanningDocViewer({ relativePath, onClose }: { relativePath: string; onClose: () => void }) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/gsd/files?file=${encodeURIComponent(relativePath)}`)
      .then((r) => r.json())
      .then((data) => setContent(data.content ?? null))
      .catch(() => setContent(null))
      .finally(() => setLoading(false));
  }, [relativePath]);

  return (
    <div style={{
      background: "#fafaf9",
      border: "1px solid #e8e4df",
      borderRadius: 8,
      overflow: "hidden",
      maxHeight: 400,
      display: "flex",
      flexDirection: "column",
      marginTop: 8,
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "6px 10px",
        borderBottom: "1px solid #e8e4df",
        background: "#f3f0ee",
      }}>
        <span style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: "#999" }}>
          {relativePath.split("/").pop()}
        </span>
        <button
          onClick={onClose}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#999", display: "flex", padding: 2 }}
        >
          <X size={12} />
        </button>
      </div>
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: 12,
        fontSize: 12,
        lineHeight: 1.6,
        color: "#333",
        wordBreak: "break-word",
      }}>
        {loading ? (
          <span style={{ color: "#bbb" }}>Loading...</span>
        ) : content ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents as never}>
            {content}
          </ReactMarkdown>
        ) : (
          <span style={{ color: "#bbb" }}>File not found</span>
        )}
      </div>
    </div>
  );
}

function GsdPhasesOverview({ subtasks, parentTask }: { subtasks: Task[]; parentTask: Task }) {
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null);
  const [phaseFiles, setPhaseFiles] = useState<PlanningFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<string | null>(null);
  const [showProjectDocs, setShowProjectDocs] = useState(false);
  const [projectFiles, setProjectFiles] = useState<PlanningFile[]>([]);
  const [researchFiles, setResearchFiles] = useState<PlanningFile[]>([]);

  // Group subtasks by phase number
  const phases = useMemo(() => {
    const map = new Map<number, GsdPhaseGroup>();
    for (const st of subtasks) {
      if (st.phaseNumber == null) continue;
      if (!map.has(st.phaseNumber)) {
        const nameMatch = st.title.match(/Phase \d+:\s*\w+\s*—\s*(.+)/);
        map.set(st.phaseNumber, {
          phaseNumber: st.phaseNumber,
          phaseName: nameMatch ? nameMatch[1].trim() : `Phase ${st.phaseNumber}`,
          steps: [],
        });
      }
      map.get(st.phaseNumber)!.steps.push(st);
    }
    const stepOrder: Record<string, number> = { discuss: 0, plan: 1, execute: 2, verify: 3 };
    for (const group of map.values()) {
      group.steps.sort((a, b) => (stepOrder[a.gsdStep || ""] ?? 99) - (stepOrder[b.gsdStep || ""] ?? 99));
    }
    return [...map.values()].sort((a, b) => a.phaseNumber - b.phaseNumber);
  }, [subtasks]);

  // Fetch project-level files on mount
  useEffect(() => {
    fetch("/api/gsd/files")
      .then((r) => r.json())
      .then((data) => {
        if (data.projectFiles) setProjectFiles(data.projectFiles);
        if (data.researchFiles) setResearchFiles(data.researchFiles);
      })
      .catch(() => {});
  }, []);

  // Fetch phase files when a phase is expanded
  useEffect(() => {
    if (expandedPhase == null) { setPhaseFiles([]); return; }
    setLoadingFiles(true);
    setViewingDoc(null);
    fetch(`/api/gsd/files?phase=${expandedPhase}`)
      .then((r) => r.json())
      .then((data) => setPhaseFiles(data.files || []))
      .catch(() => setPhaseFiles([]))
      .finally(() => setLoadingFiles(false));
  }, [expandedPhase]);

  const totalPhases = phases.length;
  const donePhases = phases.filter((p) => p.steps.every((s) => s.status === "done")).length;

  if (phases.length === 0) {
    return (
      <div style={{ fontSize: 13, color: "#999", fontFamily: "'DM Mono', monospace", padding: "12px 0" }}>
        {parentTask.description || "No phases synced yet"}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Project docs toggle */}
      {(projectFiles.length > 0 || researchFiles.length > 0) && (
        <div>
          <button
            onClick={() => { setShowProjectDocs(!showProjectDocs); setExpandedPhase(null); setViewingDoc(null); }}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: showProjectDocs ? "rgba(147, 69, 42, 0.05)" : "none",
              border: showProjectDocs ? "1px solid rgba(147, 69, 42, 0.15)" : "1px solid transparent",
              borderRadius: 6, cursor: "pointer", padding: "6px 10px",
              fontSize: 11, fontFamily: "'DM Mono', monospace", color: "#93452A",
              fontWeight: 500, width: "100%", transition: "all 150ms ease",
            }}
          >
            <FileText size={12} />
            <span>Project Documents</span>
            <span style={{
              fontSize: 8, display: "inline-block",
              transition: "transform 150ms ease",
              transform: showProjectDocs ? "rotate(90deg)" : "rotate(0deg)",
              marginLeft: "auto",
            }}>&#9654;</span>
          </button>

          {showProjectDocs && (
            <div style={{ paddingLeft: 8, paddingTop: 6, display: "flex", flexDirection: "column", gap: 3 }}>
              {projectFiles.map((f) => (
                <button
                  key={f.relativePath}
                  onClick={() => setViewingDoc(viewingDoc === f.relativePath ? null : f.relativePath)}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    background: viewingDoc === f.relativePath ? "rgba(147, 69, 42, 0.06)" : "transparent",
                    border: "none", borderRadius: 4, cursor: "pointer",
                    padding: "4px 8px", fontSize: 11, color: "#555", textAlign: "left",
                    fontFamily: "'DM Mono', monospace", transition: "background 100ms ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.03)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = viewingDoc === f.relativePath ? "rgba(147, 69, 42, 0.06)" : "transparent"; }}
                >
                  <FileText size={10} color="#bbb" />
                  {f.name}
                </button>
              ))}
              {researchFiles.length > 0 && (
                <>
                  <div style={{ fontSize: 9, color: "#bbb", fontFamily: "'DM Mono', monospace", padding: "4px 8px", marginTop: 4 }}>
                    Research
                  </div>
                  {researchFiles.map((f) => (
                    <button
                      key={f.relativePath}
                      onClick={() => setViewingDoc(viewingDoc === f.relativePath ? null : f.relativePath)}
                      style={{
                        display: "flex", alignItems: "center", gap: 6,
                        background: viewingDoc === f.relativePath ? "rgba(147, 69, 42, 0.06)" : "transparent",
                        border: "none", borderRadius: 4, cursor: "pointer",
                        padding: "4px 8px", fontSize: 11, color: "#555", textAlign: "left",
                        fontFamily: "'DM Mono', monospace", transition: "background 100ms ease",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.03)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = viewingDoc === f.relativePath ? "rgba(147, 69, 42, 0.06)" : "transparent"; }}
                    >
                      <FileText size={10} color="#bbb" />
                      {f.name}
                    </button>
                  ))}
                </>
              )}
              {viewingDoc && !viewingDoc.startsWith("phases/") && (
                <PlanningDocViewer relativePath={viewingDoc} onClose={() => setViewingDoc(null)} />
              )}
            </div>
          )}
        </div>
      )}

      {/* Summary bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          flex: 1, height: 4, borderRadius: 2, background: "#e8e4df", overflow: "hidden",
        }}>
          <div style={{
            width: `${totalPhases > 0 ? (donePhases / totalPhases) * 100 : 0}%`,
            height: "100%", borderRadius: 2,
            background: "linear-gradient(90deg, #7ab87a, #5a9a5a)",
            transition: "width 0.3s ease",
          }} />
        </div>
        <span style={{
          fontSize: 10, fontFamily: "'DM Mono', monospace", color: "#999", flexShrink: 0,
        }}>
          {donePhases}/{totalPhases} phases
        </span>
      </div>

      {/* Phase rows */}
      {phases.map((phase) => {
        const allDone = phase.steps.every((s) => s.status === "done");
        const inProgress = phase.steps.some((s) => s.status === "running" || s.status === "queued" || taskNeedsInput(s));
        const currentStep = phase.steps.find((s) => s.status !== "done" && s.status !== "backlog");
        const isExpanded = expandedPhase === phase.phaseNumber;

        return (
          <div key={phase.phaseNumber} style={{
            padding: "8px 10px",
            borderRadius: 6,
            background: allDone ? "rgba(122, 184, 122, 0.04)" : inProgress ? "#fffcfa" : "#fafaf9",
            border: isExpanded
              ? "1px solid rgba(147, 69, 42, 0.25)"
              : inProgress ? "1px solid rgba(147, 69, 42, 0.15)" : "1px solid rgba(218, 193, 185, 0.15)",
            cursor: "pointer",
            transition: "border-color 150ms ease",
          }}
            onClick={() => {
              setShowProjectDocs(false);
              setExpandedPhase(isExpanded ? null : phase.phaseNumber);
            }}
          >
            {/* Phase header */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8, marginBottom: 6,
            }}>
              <span style={{
                fontSize: 9, fontFamily: "'DM Mono', monospace", fontWeight: 600,
                color: allDone ? "#7ab87a" : inProgress ? "#93452A" : "#bbb",
                minWidth: 14,
              }}>
                {phase.phaseNumber}
              </span>
              <span style={{
                fontSize: 12, fontWeight: 500,
                color: allDone ? "#999" : "#1a1a1a",
                textDecoration: allDone ? "line-through" : "none",
                flex: 1,
              }}>
                {phase.phaseName}
              </span>
              {allDone && <CheckCircle2 size={12} color="#7ab87a" />}
              <span style={{
                fontSize: 8, display: "inline-block",
                transition: "transform 150ms ease",
                transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                color: "#bbb",
              }}>&#9654;</span>
            </div>

            {/* Step pills */}
            <div style={{ display: "flex", gap: 4, paddingLeft: 22 }}>
              {phase.steps.map((step) => {
                const isDone = step.status === "done";
                const isActive = step.status === "running" || step.status === "queued" || taskNeedsInput(step);
                const label = step.gsdStep || "?";
                return (
                  <span
                    key={step.id}
                    style={{
                      fontSize: 9,
                      fontFamily: "'DM Mono', monospace",
                      padding: "2px 6px",
                      borderRadius: 3,
                      background: isDone ? "rgba(122, 184, 122, 0.12)"
                        : isActive ? "rgba(147, 69, 42, 0.08)"
                        : "rgba(0,0,0,0.03)",
                      color: isDone ? "#5a9a5a"
                        : isActive ? "#93452A"
                        : "#bbb",
                      fontWeight: isActive ? 600 : 400,
                    }}
                  >
                    {label}
                  </span>
                );
              })}
            </div>

            {/* Current step activity */}
            {currentStep && (
              <div style={{
                fontSize: 10, fontFamily: "'DM Mono', monospace",
                color: taskNeedsInput(currentStep) ? "#e8956d" : "rgba(147, 69, 42, 0.6)",
                paddingLeft: 22, marginTop: 4,
              }}>
                {taskNeedsInput(currentStep)
                  ? `Needs input — ${currentStep.gsdStep}`
                  : currentStep.activityLabel || `${currentStep.gsdStep} ${currentStep.status}`}
              </div>
            )}

            {/* Expanded: phase documents */}
            {isExpanded && (
              <div
                onClick={(e) => e.stopPropagation()}
                style={{ paddingLeft: 22, paddingTop: 8, borderTop: "1px dashed #e8e4df", marginTop: 8 }}
              >
                {loadingFiles ? (
                  <span style={{ fontSize: 11, color: "#bbb", fontFamily: "'DM Mono', monospace" }}>Loading...</span>
                ) : phaseFiles.length === 0 ? (
                  <span style={{ fontSize: 11, color: "#bbb", fontFamily: "'DM Mono', monospace" }}>No documents for this phase</span>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {phaseFiles.map((f) => (
                      <button
                        key={f.relativePath}
                        onClick={() => setViewingDoc(viewingDoc === f.relativePath ? null : f.relativePath)}
                        style={{
                          display: "flex", alignItems: "center", gap: 6,
                          background: viewingDoc === f.relativePath ? "rgba(147, 69, 42, 0.06)" : "transparent",
                          border: "none", borderRadius: 4, cursor: "pointer",
                          padding: "4px 6px", fontSize: 11, color: "#555", textAlign: "left",
                          fontFamily: "'DM Mono', monospace", transition: "background 100ms ease",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.03)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = viewingDoc === f.relativePath ? "rgba(147, 69, 42, 0.06)" : "transparent"; }}
                      >
                        <FileText size={10} color="#bbb" />
                        {f.name}
                      </button>
                    ))}
                  </div>
                )}
                {viewingDoc && viewingDoc.startsWith("phases/") && (
                  <PlanningDocViewer relativePath={viewingDoc} onClose={() => setViewingDoc(null)} />
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Goal from description */}
      {parentTask.description && (
        <div style={{
          fontSize: 11, color: "#999", fontStyle: "italic",
          padding: "4px 0", borderTop: "1px dashed #e8e4df", marginTop: 4,
        }}>
          {parentTask.description}
        </div>
      )}
    </div>
  );
}

// ── FilePreviewInline ────────────────────────────────────────────

const PREVIEWABLE = new Set(["md", "txt", "csv", "json", "html"]);

function FilePreviewInline({ relativePath, extension, onClose }: {
  relativePath: string;
  extension: string;
  onClose: () => void;
}) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/files/preview?path=${encodeURIComponent(relativePath)}`)
      .then((r) => r.json())
      .then((data) => { setContent(data.content ?? null); })
      .catch(() => setContent(null))
      .finally(() => setLoading(false));
  }, [relativePath]);

  return (
    <div style={{
      background: "#fafaf9",
      border: "1px solid #e8e4df",
      borderRadius: 8,
      overflow: "hidden",
      maxHeight: 400,
      display: "flex",
      flexDirection: "column",
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "6px 10px",
        borderBottom: "1px solid #e8e4df",
        background: "#f3f0ee",
      }}>
        <span style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: "#999" }}>
          Preview
        </span>
        <div style={{ display: "flex", gap: 4 }}>
          <button
            onClick={() => window.open(`/api/files/download?path=${encodeURIComponent(relativePath)}`, "_blank")}
            title="Download"
            style={{ background: "none", border: "none", cursor: "pointer", color: "#999", display: "flex", padding: 2 }}
          >
            <Download size={12} />
          </button>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#999", display: "flex", padding: 2 }}
          >
            <X size={12} />
          </button>
        </div>
      </div>
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: 12,
        fontSize: 12,
        fontFamily: extension === "md" ? "inherit" : "'JetBrains Mono', 'DM Mono', monospace",
        lineHeight: 1.6,
        color: "#333",
        whiteSpace: extension !== "md" ? "pre" : undefined,
        wordBreak: "break-word",
      }}>
        {loading ? (
          <span style={{ color: "#bbb" }}>Loading...</span>
        ) : content ? (
          extension === "md" ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents as never}>
              {content}
            </ReactMarkdown>
          ) : content
        ) : (
          <span style={{ color: "#bbb" }}>Preview unavailable</span>
        )}
      </div>
    </div>
  );
}

// ── DetailPanel ──────────────────────────────────────────────────

function DetailPanel({
  task,
  onClose,
  onMarkDone,
}: {
  task: Task;
  onClose: () => void;
  onMarkDone: (id: string) => void;
}) {
  const logEntries = useTaskStore((s) => s.logEntries[task.id]) ?? [];
  const outputFiles = useTaskStore((s) => s.outputFiles[task.id]) ?? [];
  const allTasks = useTaskStore((s) => s.tasks);
  const fetchLogEntries = useTaskStore((s) => s.fetchLogEntries);
  const fetchOutputFiles = useTaskStore((s) => s.fetchOutputFiles);
  const appendLogEntry = useTaskStore((s) => s.appendLogEntry);

  // Subtasks: child tasks for Level 2/GSD parent tasks
  const subtasks = useMemo(() => {
    if (task.level === "task") return [];
    return allTasks
      .filter((t) => t.parentId === task.id)
      .sort((a, b) => a.columnOrder - b.columnOrder);
  }, [allTasks, task.id, task.level]);

  const [historyExpanded, setHistoryExpanded] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [replyAttachments, setReplyAttachments] = useState<{ fileName: string; relativePath: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashQuery, setSlashQuery] = useState("");
  const [pastedChips, setPastedChips] = useState<PastedChip[]>([]);
  const [rightTab, setRightTab] = useState<"subtasks" | "files">(task.level !== "task" ? "subtasks" : "files");
  const [previewFile, setPreviewFile] = useState<{ relativePath: string; extension: string } | null>(null);
  const [planningFiles, setPlanningFiles] = useState<{ projectFiles: PlanningFile[]; phases: { phaseNumber: number; dirName: string; files: PlanningFile[] }[]; researchFiles: PlanningFile[] } | null>(null);
  const [viewingPlanningDoc, setViewingPlanningDoc] = useState<string | null>(null);
  const [rightPanelWidth, setRightPanelWidth] = useState(280);
  const resizeRef = useRef<{ startX: number; startWidth: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    resizeRef.current = { startX: e.clientX, startWidth: rightPanelWidth };
    const onMove = (ev: MouseEvent) => {
      if (!resizeRef.current) return;
      const delta = resizeRef.current.startX - ev.clientX;
      setRightPanelWidth(Math.max(200, Math.min(600, resizeRef.current.startWidth + delta)));
    };
    const onUp = () => {
      resizeRef.current = null;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, [rightPanelWidth]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    // Handle image paste
    const items = Array.from(e.clipboardData.items);
    const imageItem = items.find((i) => i.type.startsWith("image/"));
    if (imageItem) {
      e.preventDefault();
      const file = imageItem.getAsFile();
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const dataUri = reader.result as string;
          setPastedChips((prev) => [...prev, { kind: "image", label: file.name || "screenshot.png", content: dataUri }]);
        };
        reader.readAsDataURL(file);
      }
      return;
    }
    // Handle large text paste
    const text = e.clipboardData.getData("text/plain");
    if (text && text.split("\n").length > PASTE_LINE_THRESHOLD) {
      e.preventDefault();
      setPastedChips((prev) => [...prev, { kind: "text", label: buildPasteLabel(text), content: text }]);
    }
  }, []);

  useEffect(() => {
    fetchLogEntries(task.id);
    fetchOutputFiles(task.id);
  }, [task.id, fetchLogEntries, fetchOutputFiles]);

  // Fetch .planning/ files for GSD tasks only; reset when switching tasks
  useEffect(() => {
    setPlanningFiles(null);
    setViewingPlanningDoc(null);
    if (task.level !== "gsd") return;
    fetch("/api/gsd/files")
      .then((r) => r.json())
      .then((data) => {
        if (data.projectFiles) setPlanningFiles(data);
      })
      .catch(() => {});
  }, [task.id, task.level]);

  const router = useRouter();
  const createTask = useTaskStore((s) => s.createTask);
  const updateTask = useTaskStore((s) => s.updateTask);
  const needsInput = taskNeedsInput(task);
  const isDone = isAchieved(task);
  const { latest, older } = useMemo(() => splitLogEntries(logEntries), [logEntries]);

  const handleFileUpload = useCallback(async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("dir", "projects");
      const res = await fetch("/api/files/upload", { method: "POST", body: formData });
      if (!res.ok) return;
      const result = await res.json();
      setReplyAttachments((prev) => [...prev, { fileName: result.fileName, relativePath: result.relativePath }]);
    } catch { /* silently fail */ }
    finally { setIsUploading(false); }
  }, []);

  const handleSlashSelect = useCallback((cmd: SlashCommand) => {
    setShowSlashMenu(false);
    setSlashQuery("");
    setReplyText(cmd.command + " ");
  }, []);

  const handleReplyChange = useCallback((value: string) => {
    setReplyText(value);
    if (value.startsWith("/")) {
      setShowSlashMenu(true);
      setSlashQuery(value);
    } else {
      setShowSlashMenu(false);
      setSlashQuery("");
    }
  }, []);

  const handleReply = async () => {
    const trimmed = replyText.trim();
    if ((!trimmed && replyAttachments.length === 0 && pastedChips.length === 0) || isSending) return;
    setIsSending(true);

    let fullMessage = trimmed;

    // Append pasted text chips
    const pastedTexts = pastedChips.filter((c) => c.kind === "text").map((c) => c.content);
    if (pastedTexts.length > 0) {
      const pastedBlock = pastedTexts.join("\n\n---\n\n");
      fullMessage = fullMessage ? `${fullMessage}\n\n${pastedBlock}` : pastedBlock;
    }

    // Append pasted images as data URIs
    const pastedImages = pastedChips.filter((c) => c.kind === "image");
    if (pastedImages.length > 0) {
      const imageBlock = pastedImages.map((c) => `[Pasted image: ${c.label}]\n${c.content}`).join("\n\n");
      fullMessage = fullMessage ? `${fullMessage}\n\n${imageBlock}` : imageBlock;
    }

    if (replyAttachments.length > 0) {
      const paths = replyAttachments.map((a) => `- ${a.relativePath}`).join("\n");
      fullMessage = fullMessage ? `${fullMessage}\n\nAttached files:\n${paths}` : `Attached files:\n${paths}`;
    }

    setReplyText("");
    setReplyAttachments([]);
    setPastedChips([]);

    appendLogEntry(task.id, {
      id: "local-" + crypto.randomUUID(),
      type: "user_reply",
      content: fullMessage,
      timestamp: new Date().toISOString(),
    });

    try {
      await fetch(`/api/tasks/${task.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: fullMessage }),
      });
    } catch { /* silently fail */ }
    finally {
      setIsSending(false);
      onClose(); // Return to feed after sending
    }
  };

  return (
    <div data-card style={{
      background: "white",
      border: "1.5px solid #d4cfc9",
      borderRadius: 10,
      overflow: "hidden",
    }}>
      {/* Header bar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 16px",
        borderBottom: "1px solid #e8e4df",
        background: "#faf9f7",
      }}>
        <div style={{
          fontSize: 13,
          fontWeight: 600,
          color: "#1a1a1a",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          flex: 1,
        }}>
          {task.title}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button
            onClick={() => router.push(`/history?task=${task.id}`)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "5px 10px",
              fontSize: 11,
              fontFamily: "'DM Mono', monospace",
              border: "1px solid #ddd",
              borderRadius: 6,
              background: "transparent",
              color: "#999",
              cursor: "pointer",
              transition: "all 150ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#93452A";
              e.currentTarget.style.color = "#93452A";
              e.currentTarget.style.background = "rgba(147, 69, 42, 0.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#ddd";
              e.currentTarget.style.color = "#999";
              e.currentTarget.style.background = "transparent";
            }}
          >
            full history
          </button>
          {!isDone && (
            <button
              onClick={async () => {
                if (task.level === "gsd") {
                  await createTask("Archive GSD Project", "Run /archive-gsd", "task");
                  const latestTasks = useTaskStore.getState().tasks;
                  const found = latestTasks.find((t) => t.title === "Archive GSD Project" && t.status === "backlog");
                  if (found) await updateTask(found.id, { status: "queued" });
                }
                onMarkDone(task.id);
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "5px 10px",
                fontSize: 11,
                fontFamily: "'DM Mono', monospace",
                border: "1px solid #ddd",
                borderRadius: 6,
                background: "transparent",
                color: "#999",
                cursor: "pointer",
                transition: "all 150ms ease",
              }}
              onMouseEnter={(e) => {
                const c = task.level === "gsd" ? "#93452A" : "#7ab87a";
                const bg = task.level === "gsd" ? "rgba(147, 69, 42, 0.06)" : "rgba(122, 184, 122, 0.08)";
                e.currentTarget.style.borderColor = c;
                e.currentTarget.style.color = task.level === "gsd" ? c : "#5a9a5a";
                e.currentTarget.style.background = bg;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#ddd";
                e.currentTarget.style.color = "#999";
                e.currentTarget.style.background = "transparent";
              }}
            >
              <Check size={12} />
              {task.level === "gsd" ? "archive project" : "mark done"}
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#aaa",
              padding: "4px",
              display: "flex",
              alignItems: "center",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#1a1a1a"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#aaa"; }}
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Body: two-column — summary left, files right */}
      <div style={{
        display: "grid",
        gridTemplateColumns: `1fr auto ${rightPanelWidth}px`,
        minHeight: 120,
        maxHeight: "calc(100vh - 260px)",
        overflow: "hidden",
      }}>
        {/* Left: summary + activity */}
        <div style={{ padding: 16, overflowY: "auto" }}>
          {/* GSD parent: show phases overview instead of chat */}
          {task.level === "gsd" && subtasks.length > 0 ? (
            <GsdPhasesOverview subtasks={subtasks} parentTask={task} />
          ) : (
            <>
              {/* Expandable older history */}
              {older.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <button
                    onClick={() => setHistoryExpanded(!historyExpanded)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 11,
                      fontFamily: "'DM Mono', monospace",
                      color: "#aaa",
                      padding: 0,
                      marginBottom: historyExpanded ? 8 : 0,
                    }}
                  >
                    <span style={{
                      display: "inline-block",
                      transition: "transform 150ms ease",
                      transform: historyExpanded ? "rotate(90deg)" : "rotate(0deg)",
                      fontSize: 10,
                    }}>&#9654;</span>
                    {older.length} earlier message{older.length !== 1 ? "s" : ""}
                  </button>

                  {historyExpanded && (
                    <div style={{
                      maxHeight: 300,
                      overflowY: "auto",
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                      padding: "8px 0",
                      borderBottom: "1px dashed #e8e4df",
                      marginBottom: 8,
                    }}>
                      {older.map((entry) => (
                        <ChatEntry key={entry.id} entry={entry} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Latest exchange */}
              {latest.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {latest.map((entry) => (
                    <ChatEntry key={entry.id} entry={entry} />
                  ))}
                </div>
              ) : logEntries.length === 0 && (
                <div style={{
                  fontSize: 13,
                  color: "#999",
                  fontFamily: "'DM Mono', monospace",
                  padding: "12px 0",
                }}>
                  {task.status === "queued" || task.status === "backlog"
                    ? "Waiting to start..."
                    : task.status === "running"
                    ? "Working..."
                    : "No activity yet"}
                </div>
              )}
            </>
          )}

          {/* Reply input */}
          {needsInput && (
            <div style={{
              marginTop: 12,
              paddingTop: 12,
              borderTop: "1px solid #e8e4df",
            }}>
              {/* Attachment + pasted chips */}
              {(replyAttachments.length > 0 || pastedChips.length > 0) && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
                  {replyAttachments.map((a) => (
                    <div key={a.relativePath} style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "3px 8px",
                      borderRadius: 4,
                      backgroundColor: "#f3f0ee",
                      fontSize: 11,
                      color: "#555",
                    }}>
                      <Paperclip size={10} />
                      <span style={{ maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {a.fileName}
                      </span>
                      <button
                        onClick={() => setReplyAttachments((prev) => prev.filter((x) => x.relativePath !== a.relativePath))}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", color: "#aaa" }}
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                  {pastedChips.map((chip, i) => (
                    <div key={`paste-${i}`} style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "3px 8px",
                      borderRadius: 4,
                      backgroundColor: chip.kind === "image" ? "rgba(147, 69, 42, 0.06)" : "rgba(59, 130, 246, 0.06)",
                      fontSize: 11,
                      color: chip.kind === "image" ? "#93452A" : "#3b6ec2",
                      fontFamily: "'DM Mono', monospace",
                    }}>
                      {chip.kind === "image" ? (
                        <span style={{ fontSize: 10 }}>&#128247;</span>
                      ) : (
                        <FileText size={10} />
                      )}
                      <span>Pasted {chip.label}</span>
                      <button
                        onClick={() => setPastedChips((prev) => prev.filter((_, j) => j !== i))}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", color: "#aaa" }}
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {/* Attach button */}
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                    e.target.value = "";
                  }}
                  style={{ display: "none" }}
                  accept="image/*,.pdf,.md,.txt,.csv,.json,.html"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  title="Attach file"
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 6,
                    border: "none",
                    background: replyAttachments.length > 0 ? "rgba(147, 69, 42, 0.08)" : "transparent",
                    color: replyAttachments.length > 0 ? "#93452A" : "#aaa",
                    cursor: isUploading ? "wait" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    opacity: isUploading ? 0.5 : 1,
                    transition: "all 150ms ease",
                  }}
                  onMouseEnter={(e) => { if (!replyAttachments.length) e.currentTarget.style.color = "#93452A"; }}
                  onMouseLeave={(e) => { if (!replyAttachments.length) e.currentTarget.style.color = "#aaa"; }}
                >
                  <Paperclip size={14} />
                </button>

                <div style={{ flex: 1, position: "relative" }}>
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => handleReplyChange(e.target.value)}
                    onPaste={handlePaste}
                    onKeyDown={(e) => {
                      if (showSlashMenu && ["ArrowDown", "ArrowUp", "Enter", "Tab", "Escape"].includes(e.key)) return;
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleReply();
                      }
                    }}
                    placeholder="Reply...  Type / for commands"
                    style={{
                      width: "100%",
                      fontSize: 13,
                      fontFamily: "inherit",
                      padding: "8px 12px",
                      backgroundColor: "#fafaf9",
                      border: "1px solid rgba(218, 193, 185, 0.4)",
                      borderRadius: 6,
                      color: "#1a1a1a",
                      outline: "none",
                      boxSizing: "border-box" as const,
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(147, 69, 42, 0.5)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(218, 193, 185, 0.4)"; }}
                  />
                  {showSlashMenu && (
                    <SlashCommandMenu
                      query={slashQuery}
                      onSelect={handleSlashSelect}
                      onClose={() => { setShowSlashMenu(false); setSlashQuery(""); }}
                      anchor="above"
                    />
                  )}
                </div>
                <button
                  onClick={handleReply}
                  disabled={(!replyText.trim() && replyAttachments.length === 0) || isSending}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 6,
                    border: "none",
                    background: (replyText.trim() || replyAttachments.length > 0) && !isSending
                      ? "linear-gradient(135deg, #93452A, #B25D3F)"
                      : "#e8e4df",
                    color: (replyText.trim() || replyAttachments.length > 0) && !isSending ? "#fff" : "#999",
                    cursor: (replyText.trim() || replyAttachments.length > 0) && !isSending ? "pointer" : "default",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    fontSize: 14,
                  }}
                >
                  &#8593;
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Resize handle */}
        <div
          onMouseDown={handleResizeStart}
          style={{
            width: 6,
            cursor: "col-resize",
            backgroundColor: "transparent",
            borderLeft: "1px solid #e8e4df",
            transition: "background 150ms",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(147, 69, 42, 0.08)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
        />

        {/* Right: tabs — subtasks + files */}
        <div style={{ padding: "12px 12px", overflowY: "auto" }}>
          {/* Tab bar */}
          <div style={{
            display: "flex",
            gap: 0,
            marginBottom: 10,
            borderBottom: "1px solid #e8e4df",
          }}>
            {task.level !== "task" && (
              <button
                onClick={() => setRightTab("subtasks")}
                style={{
                  fontSize: 10,
                  fontFamily: "'DM Mono', monospace",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: rightTab === "subtasks" ? "#1a1a1a" : "#bbb",
                  background: "none",
                  border: "none",
                  borderBottom: rightTab === "subtasks" ? "2px solid #93452A" : "2px solid transparent",
                  padding: "4px 8px 6px",
                  cursor: "pointer",
                  transition: "color 0.15s",
                }}
              >
                Subtasks ({subtasks.length})
              </button>
            )}
            <button
              onClick={() => setRightTab("files")}
              style={{
                fontSize: 10,
                fontFamily: "'DM Mono', monospace",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: rightTab === "files" ? "#1a1a1a" : "#bbb",
                background: "none",
                border: "none",
                borderBottom: rightTab === "files" ? "2px solid #93452A" : "2px solid transparent",
                padding: "4px 8px 6px",
                cursor: "pointer",
                transition: "color 0.15s",
              }}
            >
              Files ({outputFiles.length + (task.level === "gsd" && planningFiles ? planningFiles.projectFiles.length + planningFiles.phases.reduce((n, p) => n + p.files.length, 0) + planningFiles.researchFiles.length : 0)})
            </button>
          </div>

          {/* Subtasks tab */}
          {rightTab === "subtasks" && task.level !== "task" && (
            <SubtasksList subtasks={subtasks} />
          )}

          {/* Files tab */}
          {rightTab === "files" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {/* Planning files for GSD tasks only */}
              {task.level === "gsd" && planningFiles && (
                <>
                  {/* Project-level docs */}
                  {planningFiles.projectFiles.length > 0 && (
                    <div style={{ marginBottom: 4 }}>
                      <div style={{ fontSize: 9, fontFamily: "'DM Mono', monospace", color: "#bbb", letterSpacing: "0.06em", marginBottom: 4, textTransform: "uppercase" }}>
                        Project
                      </div>
                      {planningFiles.projectFiles.map((f) => (
                        <button
                          key={f.relativePath}
                          onClick={() => setViewingPlanningDoc(viewingPlanningDoc === f.relativePath ? null : f.relativePath)}
                          style={{
                            display: "flex", alignItems: "center", gap: 6, width: "100%",
                            background: viewingPlanningDoc === f.relativePath ? "rgba(147, 69, 42, 0.06)" : "transparent",
                            border: "none", borderRadius: 4, cursor: "pointer",
                            padding: "4px 6px", fontSize: 11, color: "#555", textAlign: "left",
                            fontFamily: "'DM Mono', monospace", transition: "background 100ms ease",
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.03)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = viewingPlanningDoc === f.relativePath ? "rgba(147, 69, 42, 0.06)" : "transparent"; }}
                        >
                          <FileText size={10} color="#bbb" />
                          {f.name}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Per-phase docs */}
                  {planningFiles.phases.map((phase) => (
                    <div key={phase.phaseNumber} style={{ marginBottom: 4 }}>
                      <div style={{ fontSize: 9, fontFamily: "'DM Mono', monospace", color: "#bbb", letterSpacing: "0.06em", marginBottom: 4, textTransform: "uppercase" }}>
                        Phase {phase.phaseNumber}
                      </div>
                      {phase.files.map((f) => (
                        <button
                          key={f.relativePath}
                          onClick={() => setViewingPlanningDoc(viewingPlanningDoc === f.relativePath ? null : f.relativePath)}
                          style={{
                            display: "flex", alignItems: "center", gap: 6, width: "100%",
                            background: viewingPlanningDoc === f.relativePath ? "rgba(147, 69, 42, 0.06)" : "transparent",
                            border: "none", borderRadius: 4, cursor: "pointer",
                            padding: "4px 6px", fontSize: 11, color: "#555", textAlign: "left",
                            fontFamily: "'DM Mono', monospace", transition: "background 100ms ease",
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.03)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = viewingPlanningDoc === f.relativePath ? "rgba(147, 69, 42, 0.06)" : "transparent"; }}
                        >
                          <FileText size={10} color="#bbb" />
                          {f.name}
                        </button>
                      ))}
                    </div>
                  ))}

                  {/* Research docs */}
                  {planningFiles.researchFiles.length > 0 && (
                    <div style={{ marginBottom: 4 }}>
                      <div style={{ fontSize: 9, fontFamily: "'DM Mono', monospace", color: "#bbb", letterSpacing: "0.06em", marginBottom: 4, textTransform: "uppercase" }}>
                        Research
                      </div>
                      {planningFiles.researchFiles.map((f) => (
                        <button
                          key={f.relativePath}
                          onClick={() => setViewingPlanningDoc(viewingPlanningDoc === f.relativePath ? null : f.relativePath)}
                          style={{
                            display: "flex", alignItems: "center", gap: 6, width: "100%",
                            background: viewingPlanningDoc === f.relativePath ? "rgba(147, 69, 42, 0.06)" : "transparent",
                            border: "none", borderRadius: 4, cursor: "pointer",
                            padding: "4px 6px", fontSize: 11, color: "#555", textAlign: "left",
                            fontFamily: "'DM Mono', monospace", transition: "background 100ms ease",
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.03)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = viewingPlanningDoc === f.relativePath ? "rgba(147, 69, 42, 0.06)" : "transparent"; }}
                        >
                          <FileText size={10} color="#bbb" />
                          {f.name}
                        </button>
                      ))}
                    </div>
                  )}

                  {viewingPlanningDoc && (
                    <PlanningDocViewer relativePath={viewingPlanningDoc} onClose={() => setViewingPlanningDoc(null)} />
                  )}

                  {/* Separator between planning files and output files */}
                  {outputFiles.length > 0 && (
                    <div style={{ height: 1, background: "#e8e4df", margin: "4px 0" }} />
                  )}
                </>
              )}

              {/* Regular output files */}
              {outputFiles.length === 0 && !(task.level === "gsd" && planningFiles) ? (
                <div style={{ fontSize: 11, color: "#ccc", fontFamily: "'DM Mono', monospace", padding: "8px 0" }}>
                  No files yet
                </div>
              ) : (
                outputFiles.map((file) => {
                  const canPreview = PREVIEWABLE.has(file.extension);
                  const isActive = previewFile?.relativePath === file.relativePath;
                  return (
                    <div key={file.id}>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "6px 8px",
                        borderRadius: 6,
                        backgroundColor: isActive ? "rgba(147, 69, 42, 0.05)" : "#fafaf9",
                        border: isActive ? "1px solid rgba(147, 69, 42, 0.2)" : "1px solid rgba(218, 193, 185, 0.15)",
                        transition: "background 150ms ease",
                      }}>
                        <div style={{
                          width: 24, height: 24, borderRadius: 4, backgroundColor: "#e8e4df",
                          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                        }}>
                          <span style={{ fontSize: 8, color: "#999", fontFamily: "'DM Mono', monospace" }}>
                            .{file.extension}
                          </span>
                        </div>
                        <span style={{
                          fontSize: 11, color: "#555", overflow: "hidden",
                          textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1,
                        }}>
                          {file.fileName}
                        </span>
                        <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
                          {canPreview && (
                            <button
                              onClick={() => setPreviewFile(isActive ? null : { relativePath: file.relativePath, extension: file.extension })}
                              title="Preview"
                              style={{
                                background: "none", border: "none", cursor: "pointer",
                                color: isActive ? "#93452A" : "#bbb", display: "flex", padding: 3,
                                transition: "color 0.15s",
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.color = "#93452A"; }}
                              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = "#bbb"; }}
                            >
                              <Eye size={12} />
                            </button>
                          )}
                          <button
                            onClick={() => window.open(`/api/files/download?path=${encodeURIComponent(file.relativePath)}`, "_blank")}
                            title="Download"
                            style={{
                              background: "none", border: "none", cursor: "pointer",
                              color: "#bbb", display: "flex", padding: 3, transition: "color 0.15s",
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = "#93452A"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = "#bbb"; }}
                          >
                            <Download size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              {/* Inline preview */}
              {previewFile && (
                <FilePreviewInline
                  relativePath={previewFile.relativePath}
                  extension={previewFile.extension}
                  onClose={() => setPreviewFile(null)}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── AchievedRow ──────────────────────────────────────────────────

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const taskDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.round((today.getTime() - taskDay.getTime()) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

function groupByDate(tasks: Task[]): { label: string; tasks: Task[]; sortKey: number }[] {
  const groups = new Map<string, Task[]>();
  for (const t of tasks) {
    const ts = t.completedAt || t.updatedAt;
    const d = new Date(ts);
    const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(t);
  }
  return [...groups.entries()]
    .map(([, tasks]) => {
      const ts = tasks[0].completedAt || tasks[0].updatedAt;
      return {
        label: formatDateLabel(ts),
        tasks,
        sortKey: new Date(ts).getTime(),
      };
    })
    .sort((a, b) => b.sortKey - a.sortKey); // newest date group first
}

function isToday(dateStr: string): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}

function AchievedChip({
  task,
  isSelected,
  onSelect,
}: {
  task: Task;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <div
      data-card
      onClick={() => onSelect(task.id)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "5px 10px",
        borderRadius: 6,
        border: isSelected ? "1px solid rgba(147, 69, 42, 0.3)" : "1px dashed rgba(218, 193, 185, 0.3)",
        background: isSelected ? "white" : "#fafaf9",
        cursor: "pointer",
        fontSize: 12,
        color: "#888",
        transition: "border-color 0.15s",
        opacity: 0.75,
      }}
    >
      <Check size={10} color="#7ab87a" />
      <span style={{
        maxWidth: 180,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}>
        {task.title}
      </span>
    </div>
  );
}

/** Check if a task's completion date falls within the last N days */
function daysAgo(dateStr: string): number {
  const d = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const taskDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  return Math.round((today.getTime() - taskDay.getTime()) / 86400000);
}

function AchievedRow({
  goals,
  selectedId,
  onSelect,
  compact,
}: {
  goals: Task[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  /** When true (detail panel open), only show today above the fold. When false, show up to 5 days. */
  compact: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  const allGroups = useMemo(() => groupByDate(goals), [goals]);

  // "Above the fold" groups: compact mode = today only, normal = today + yesterday
  const { aboveFold, belowFold } = useMemo(() => {
    const maxDays = compact ? 0 : 1; // 0 = today only, 1 = today + yesterday
    const above: typeof allGroups = [];
    const below: typeof allGroups = [];
    for (const group of allGroups) {
      const age = daysAgo(group.tasks[0].completedAt || group.tasks[0].updatedAt);
      if (age <= maxDays) above.push(group);
      else below.push(group);
    }
    return { aboveFold: above, belowFold: below };
  }, [allGroups, compact]);

  if (goals.length === 0) return null;

  const belowFoldCount = belowFold.reduce((n, g) => n + g.tasks.length, 0);

  return (
    <div>
      <div style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 10,
        color: "#aaa",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        display: "flex",
        alignItems: "center",
        gap: 6,
        marginBottom: 8,
      }}>
        <div style={{ flex: 1, height: 1, borderTop: "1px dashed #ccc" }} />
        <span>Achieved ({goals.length})</span>
        <div style={{ flex: 1, height: 1, borderTop: "1px dashed #ccc" }} />
      </div>

      {/* Above the fold — date-grouped */}
      {aboveFold.map((group) => (
        <div key={group.label} style={{ marginBottom: 6 }}>
          <div style={{
            fontSize: 9,
            fontFamily: "'DM Mono', monospace",
            color: "#c0b8b0",
            letterSpacing: "0.06em",
            marginBottom: 4,
            paddingLeft: 2,
          }}>
            {group.label}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {group.tasks.map((t) => (
              <AchievedChip key={t.id} task={t} isSelected={selectedId === t.id} onSelect={onSelect} />
            ))}
          </div>
        </div>
      ))}

      {/* Below the fold — behind expand toggle */}
      {belowFoldCount > 0 && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              padding: "5px 10px",
              borderRadius: 6,
              border: "1px dashed rgba(218, 193, 185, 0.3)",
              background: "#fafaf9",
              cursor: "pointer",
              fontSize: 11,
              color: "#aaa",
              fontFamily: "'DM Mono', monospace",
              marginTop: aboveFold.length > 0 ? 6 : 0,
              marginBottom: expanded ? 8 : 0,
            }}
          >
            <span style={{
              display: "inline-block",
              transition: "transform 150ms ease",
              transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
              fontSize: 8,
            }}>&#9654;</span>
            {belowFoldCount} older
          </button>

          {expanded && belowFold.map((group) => (
            <div key={group.label} style={{ marginBottom: 6 }}>
              <div style={{
                fontSize: 9,
                fontFamily: "'DM Mono', monospace",
                color: "#c0b8b0",
                letterSpacing: "0.06em",
                marginBottom: 4,
                paddingLeft: 2,
              }}>
                {group.label}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {group.tasks.map((t) => (
                  <AchievedChip key={t.id} task={t} isSelected={selectedId === t.id} onSelect={onSelect} />
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

// ── ScheduledSection ────────────────────────────────────────────

function ScheduledSection({ jobs, onNavigate, dimmed }: { jobs: CronJob[]; onNavigate?: () => void; dimmed?: boolean }) {
  const activeJobs = jobs.filter((j) => j.active);

  return (
    <div data-card style={{
      background: "white",
      borderRadius: 10,
      padding: 14,
      border: "1px solid #e0dbd4",
      opacity: dimmed ? 0.4 : 1,
      filter: dimmed ? "saturate(0.3)" : "none",
      transition: "opacity 0.2s, filter 0.2s",
    }}>
      <div
        onClick={onNavigate}
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          textTransform: "uppercase" as const,
          letterSpacing: "0.1em",
          color: "#999",
          marginBottom: 10,
          cursor: onNavigate ? "pointer" : "default",
        }}
      >
        Scheduled ({activeJobs.length})
      </div>
      {activeJobs.map((job) => {
        const isRunning = false;
        const lastResult = job.lastRun?.result;
        return (
          <div
            key={job.slug}
            onClick={onNavigate}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "5px 0",
              borderBottom: "1px dashed #e8e4df",
              fontSize: 12,
              color: "#555",
              cursor: onNavigate ? "pointer" : "default",
              transition: "background 0.1s",
              borderRadius: 4,
              margin: "0 -4px",
              paddingLeft: 4,
              paddingRight: 4,
            }}
            onMouseEnter={(e) => { if (onNavigate) e.currentTarget.style.background = "rgba(0,0,0,0.03)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            <span style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: isRunning ? "#1a1a1a" : "#ccc",
              flexShrink: 0,
              marginTop: 4,
              alignSelf: "flex-start",
              animation: isRunning ? "pulse-dot 2s ease-in-out infinite" : undefined,
            }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap" as const,
              }}>
                {job.name}
              </div>
              <div style={{
                fontSize: 9,
                fontFamily: "'DM Mono', monospace",
                color: "#bbb",
                display: "flex",
                gap: 8,
                marginTop: 1,
              }}>
                <span>{formatScheduleCompact(job.days, job.time)}</span>
                {job.lastRun && (
                  <span>last: {formatNextRun(job.lastRun.lastRun)}</span>
                )}
                {job.nextRun && (
                  <span>next: {formatNextRun(job.nextRun)}</span>
                )}
              </div>
            </div>
            {lastResult && (
              <span style={{
                fontSize: 8,
                fontFamily: "'DM Mono', monospace",
                padding: "1px 4px",
                borderRadius: 3,
                background: lastResult === "success" ? "rgba(122,184,122,0.15)" : "rgba(239,68,68,0.1)",
                color: lastResult === "success" ? "#5a9a5a" : "#ef4444",
                flexShrink: 0,
              }}>
                {lastResult === "success" ? "OK" : "FAIL"}
              </span>
            )}
          </div>
        );
      })}
      {activeJobs.length === 0 && (
        <div style={{
          fontSize: 11,
          color: "#bbb",
          fontFamily: "'DM Mono', monospace",
          padding: "4px 0",
        }}>
          No scheduled tasks
        </div>
      )}
    </div>
  );
}

function formatScheduleCompact(days: string, time: string): string {
  const dayMap: Record<string, string> = {
    daily: "Daily", weekdays: "Wkdays", weekends: "Wkends",
    mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun",
  };
  const parts = days.split(",").map((d) => dayMap[d.trim()] || d.trim());
  return `${parts.join(",")} ${time}`;
}

function formatNextRun(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "--";
  const now = Date.now();
  const diffMs = d.getTime() - now;
  if (diffMs < 0) return "overdue";
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `in ${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `in ${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `in ${days}d`;
}

// ── RecentOutputsSection ────────────────────────────────────────

interface RecentOutput {
  id: string;
  taskId: string;
  fileName: string;
  relativePath: string;
  extension: string;
  sizeBytes: number | null;
  createdAt: string;
  taskTitle: string;
  taskLevel: string;
  projectSlug: string | null;
}

function RecentOutputsSection({
  outputs,
  onSelectTask,
  dimmed,
}: {
  outputs: RecentOutput[];
  onSelectTask: (taskId: string) => void;
  dimmed?: boolean;
}) {
  const [previewOutput, setPreviewOutput] = useState<RecentOutput | null>(null);

  return (
    <div data-card style={{
      background: "white",
      borderRadius: 10,
      padding: 14,
      border: "1px solid #e0dbd4",
      opacity: dimmed ? 0.4 : 1,
      filter: dimmed ? "saturate(0.3)" : "none",
      transition: "opacity 0.2s, filter 0.2s",
    }}>
      <div style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 10,
        textTransform: "uppercase" as const,
        letterSpacing: "0.1em",
        color: "#999",
        marginBottom: 10,
      }}>
        Recent outputs ({outputs.length})
      </div>
      {outputs.length === 0 ? (
        <div style={{ fontSize: 11, color: "#bbb", fontFamily: "'DM Mono', monospace", padding: "4px 0" }}>
          No outputs yet
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {outputs.map((o) => {
            const canPreview = PREVIEWABLE.has(o.extension);
            const isActive = previewOutput?.id === o.id;
            return (
              <div key={o.id}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "5px 4px", borderBottom: "1px dashed #e8e4df",
                  borderRadius: 4, margin: "0 -4px", paddingLeft: 4, paddingRight: 4,
                  transition: "background 0.1s",
                  cursor: "pointer",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.03)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  <FileText size={12} color="#ccc" style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      onClick={() => {
                        if (canPreview) {
                          setPreviewOutput(isActive ? null : o);
                        } else {
                          window.open(`/api/files/download?path=${encodeURIComponent(o.relativePath)}`, "_blank");
                        }
                      }}
                      style={{
                        fontSize: 12, color: "#555",
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const,
                      }}
                    >
                      {o.fileName}
                    </div>
                    <div style={{
                      fontSize: 9, fontFamily: "'DM Mono', monospace", color: "#bbb",
                      display: "flex", gap: 8, marginTop: 1,
                    }}>
                      <span
                        onClick={() => onSelectTask(o.taskId)}
                        style={{ cursor: "pointer", textDecoration: "underline", textDecorationStyle: "dotted" as const }}
                      >
                        {o.taskTitle.length > 30 ? o.taskTitle.slice(0, 30) + "..." : o.taskTitle}
                      </span>
                      <span>{timeAgo(o.createdAt)}</span>
                    </div>
                  </div>
                  <span style={{
                    fontSize: 8, fontFamily: "'DM Mono', monospace",
                    padding: "1px 4px", borderRadius: 3,
                    background: "rgba(0,0,0,0.04)", color: "#bbb", flexShrink: 0,
                  }}>
                    .{o.extension}
                  </span>
                </div>
                {isActive && canPreview && (
                  <div style={{ marginTop: 4, marginBottom: 4 }}>
                    <FilePreviewInline
                      relativePath={o.relativePath}
                      extension={o.extension}
                      onClose={() => setPreviewOutput(null)}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── FeedView (main export) ───────────────────────────────────────

export function FeedView({
  clientFilter,
  onSwitchTab,
}: {
  clientFilter: string | null;
  onSwitchTab?: (tab: string) => void;
}) {
  const tasks = useTaskStore((s) => s.tasks);
  const updateTask = useTaskStore((s) => s.updateTask);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropZoneOver, setDropZoneOver] = useState(false);

  const toggleSelect = useCallback((id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (clientFilter && t.clientId !== clientFilter) return false;
      if (isTerminalTask(t)) return false;
      return true;
    });
  }, [tasks, clientFilter]);

  const topLevelTasks = useMemo(() => {
    return filtered.filter((t) => !t.parentId);
  }, [filtered]);

  const activeGoals = useMemo(() => {
    return topLevelTasks
      .filter((t) => !isAchieved(t))
      .sort((a, b) => {
        const aTime = new Date(a.updatedAt).getTime();
        const bTime = new Date(b.updatedAt).getTime();
        return bTime - aTime;
      });
  }, [topLevelTasks]);

  const yourTurn = useMemo(() => {
    return activeGoals.filter((t) => taskNeedsInput(t));
  }, [activeGoals]);

  const claudesTurn = useMemo(() => {
    return activeGoals.filter((t) => !taskNeedsInput(t));
  }, [activeGoals]);

  const achievedGoals = useMemo(() => {
    return topLevelTasks
      .filter((t) => isAchieved(t))
      .sort((a, b) => {
        const aTime = a.completedAt ? new Date(a.completedAt).getTime() : new Date(a.updatedAt).getTime();
        const bTime = b.completedAt ? new Date(b.completedAt).getTime() : new Date(b.updatedAt).getTime();
        return bTime - aTime;
      });
  }, [topLevelTasks]);

  const selectedTask = selectedId ? tasks.find((t) => t.id === selectedId) : null;

  const handleDragStart = useCallback((id: string, e: React.DragEvent) => {
    setDraggingId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggingId(null);
    setDropZoneOver(false);
  }, []);

  const handleDropDone = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain") || draggingId;
    if (id) updateTask(id, { status: "done", needsInput: false, errorMessage: null, completedAt: new Date().toISOString() });
    setDraggingId(null);
    setDropZoneOver(false);
  }, [draggingId, updateTask]);

  const handleDragOverDone = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDropZoneOver(true);
  }, []);

  const clients = useClientStore((s) => s.clients);
  const fetchClients = useClientStore((s) => s.fetchClients);
  const selectedClientId = useClientStore((s) => s.selectedClientId);
  const setSelectedClient = useClientStore((s) => s.setSelectedClient);
  const fetchTasks = useTaskStore((s) => s.fetchTasks);
  const syncProjects = useTaskStore((s) => s.syncProjects);

  const cronJobs = useCronStore((s) => s.jobs);
  const fetchCronJobs = useCronStore((s) => s.fetchJobs);

  const [recentOutputs, setRecentOutputs] = useState<RecentOutput[]>([]);

  const fetchRecentOutputs = useCallback(async () => {
    try {
      const params = new URLSearchParams({ limit: "10" });
      if (clientFilter && clientFilter !== "root") params.set("clientId", clientFilter);
      const res = await fetch(`/api/files/recent?${params}`);
      if (res.ok) setRecentOutputs(await res.json());
    } catch { /* ignore */ }
  }, [clientFilter]);

  useEffect(() => { fetchClients(); }, [fetchClients]);
  useEffect(() => { fetchCronJobs(); }, [fetchCronJobs]);
  useEffect(() => { fetchRecentOutputs(); }, [fetchRecentOutputs]);
  // Sync active project briefs → task records on mount
  useEffect(() => { syncProjects(); }, [syncProjects]);

  const handleClientFilter = useCallback(async (slug: string | null) => {
    setSelectedClient(slug);
    await fetchTasks();
    fetchCronJobs();
  }, [setSelectedClient, fetchTasks, fetchCronJobs]);

  // Click-to-deselect: if click lands on a "blank" area (not inside a card, button, or input), deselect
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (!selectedId) return;
    const target = e.target as HTMLElement;
    // Check if click is inside an interactive element
    if (target.closest("[data-card], button, input, textarea, a, [role='button']")) return;
    setSelectedId(null);
  }, [selectedId]);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 12 }}
      onDragEnd={handleDragEnd}
      onMouseDown={handleBackdropClick}
    >
      <TaskCreateInput />

      {clients.length > 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <button
            onClick={() => handleClientFilter(null)}
            style={{
              padding: "4px 12px",
              borderRadius: 20,
              border: "1px solid",
              borderColor: !selectedClientId ? "#1a1a1a" : "#e0dcd6",
              background: !selectedClientId ? "#1a1a1a" : "white",
              color: !selectedClientId ? "white" : "#666",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            All
          </button>
          {clients.map((c) => (
            <button
              key={c.slug}
              onClick={() => handleClientFilter(c.slug)}
              style={{
                padding: "4px 12px",
                borderRadius: 20,
                border: "1px solid",
                borderColor: selectedClientId === c.slug ? "#1a1a1a" : "#e0dcd6",
                background: selectedClientId === c.slug ? "#1a1a1a" : "white",
                color: selectedClientId === c.slug ? "white" : "#666",
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.15s",
              }}
            >
              <span style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: c.color || "#999",
                flexShrink: 0,
              }} />
              {c.name}
            </button>
          ))}
        </div>
      )}

      <div style={{
        display: "grid",
        gridTemplateColumns: "180px 1fr",
        gap: 12,
      }}>
        <HistorySidebar
          tasks={filtered}
          selectedId={selectedId}
          onSelect={toggleSelect}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: 16, overflow: "hidden" }}>
              {/* Your Turn — 3/4 width, cards in up to 3 columns */}
              <div style={{ minWidth: 0, overflow: "hidden" }}>
                <div style={{
                  fontSize: 10,
                  fontFamily: "'DM Mono', monospace",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: yourTurn.length > 0 ? "#e8956d" : "#bbb",
                  marginBottom: 8,
                }}>
                  Your turn ({yourTurn.length})
                </div>
                {yourTurn.length > 0 ? (
                  <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(yourTurn.length, 3)}, 1fr)`, gap: 10 }}>
                    {yourTurn.map((t) => (
                      <GoalCard
                        key={t.id}
                        task={t}
                        allTasks={filtered}
                        clients={clients}
                        isSelected={selectedId === t.id}
                        dimmed={!!selectedId && selectedId !== t.id}
                        onSelect={toggleSelect}
                        onDragStart={handleDragStart}
                      />
                    ))}
                  </div>
                ) : null}
              </div>

              {/* Claude's Turn — 1/4 width, stacked */}
              <div style={{ minWidth: 0, overflow: "hidden" }}>
                <div style={{
                  fontSize: 10,
                  fontFamily: "'DM Mono', monospace",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: claudesTurn.length > 0 ? "rgba(147, 69, 42, 0.6)" : "#bbb",
                  marginBottom: 8,
                }}>
                  Claude&apos;s turn ({claudesTurn.length})
                </div>
                {claudesTurn.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {claudesTurn.map((t) => (
                      <GoalCard
                        key={t.id}
                        task={t}
                        allTasks={filtered}
                        clients={clients}
                        isSelected={selectedId === t.id}
                        dimmed={!!selectedId && selectedId !== t.id}
                        compact
                        onSelect={toggleSelect}
                        onDragStart={handleDragStart}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

          <DoneDropZone
            visible={!!draggingId}
            isOver={dropZoneOver}
            onDrop={handleDropDone}
            onDragOver={handleDragOverDone}
            onDragLeave={() => setDropZoneOver(false)}
          />

          {activeGoals.length === 0 && achievedGoals.length === 0 && (
            <div style={{
              background: "white",
              borderRadius: 10,
              border: "1.5px dashed #d4cfc9",
              padding: "40px 24px",
              textAlign: "center",
              color: "#999",
              fontSize: 13,
            }}>
              No goals yet — enter one above to get started
            </div>
          )}

          {selectedTask && (
            <DetailPanel
              task={selectedTask}
              onClose={() => setSelectedId(null)}
              onMarkDone={(id) => {
                updateTask(id, { status: "done", needsInput: false, errorMessage: null, completedAt: new Date().toISOString() });
                setSelectedId(null);
              }}
            />
          )}

          <AchievedRow
            goals={achievedGoals}
            selectedId={selectedId}
            onSelect={toggleSelect}
            compact={!!selectedTask}
          />

          <ScheduledSection jobs={cronJobs} onNavigate={onSwitchTab ? () => onSwitchTab("scheduled") : undefined} dimmed={!!selectedId} />

          {recentOutputs.length > 0 && (
            <RecentOutputsSection outputs={recentOutputs} onSelectTask={toggleSelect} dimmed={!!selectedId} />
          )}
        </div>
      </div>
    </div>
  );
}
