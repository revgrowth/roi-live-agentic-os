"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, CheckCircle2, Paperclip, Download, Eye, FileText, Play, ArrowLeft, Maximize2, Minimize2, Plus, Pencil, Terminal, Copy } from "lucide-react";
import { useTaskStore } from "@/store/task-store";
import type { Task, LogEntry, TaskLevel, PermissionMode, ClaudeModel, Todo } from "@/types/task";
import { PERMISSION_MODE_LABELS, PERMISSION_MODE_HINTS } from "@/types/task";
import { PermissionPicker } from "@/components/shared/permission-picker";
import { ModelPicker } from "@/components/shared/model-picker";
import { TasksPopover } from "@/components/shared/tasks-popover";
import { parseTodosFromInput } from "@/lib/claude-parser";
import { NewGoalPanel } from "./new-goal-panel";
import { LevelBadge } from "./level-badge";
import { RoutingDecisionCard } from "./routing-decision-card";
import { ReviewBanner } from "./review-banner";
import { SubtaskStatusStrip } from "./subtask-status-strip";
import { ClientFilterBar } from "./client-filter-bar";
import { KanbanBoard, type SwimLane } from "./kanban-board";
import { ScopingWizardInline } from "../modal/scoping-wizard-panel";
import { GsdGuardrailModal } from "../modal/gsd-guardrail-modal";
import type { ScopeResult } from "@/app/api/tasks/scope-goal/route";
import { useClientStore } from "@/store/client-store";
import type { Client } from "@/types/client";
import { useCronStore } from "@/store/cron-store";
import type { CronJob } from "@/types/cron";
import { ModalChat } from "@/components/modal/modal-chat";
import { ReplyInput, HighlightMirror } from "@/components/modal/reply-input";
import { SlashCommandMenu, type TagItem } from "@/components/shared/slash-command-menu";
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

// For project/gsd parents, a child awaiting input should make the parent
// surface as "your turn" too. For regular tasks, this is identical to
// taskNeedsInput.
function effectiveNeedsInput(t: Task, allTasks: Task[]): boolean {
  if (taskNeedsInput(t)) return true;
  if (t.level !== "project" && t.level !== "gsd") return false;
  const children = allTasks.filter(
    (c) => c.parentId === t.id || (t.projectSlug && c.projectSlug === t.projectSlug && c.id !== t.id)
  );
  return children.some(taskNeedsInput);
}

function isAchieved(t: Task): boolean {
  return t.status === "done" && !taskNeedsInput(t);
}

function isTerminalTask(t: Task): boolean {
  return !!(t.description && /^Working directory:\s/m.test(t.description));
}

// ── GoalCard (terminal style with nested subtask rows) ──────────

const MONO = "'DM Mono', 'JetBrains Mono', 'SF Mono', ui-monospace, monospace";

// Terminal-lines palette — light cream, mono typography, dashed rules.
// Looks like a terminal readout rendered into the cream page, not a dark
// terminal window.
const T = {
  bg: "#ffffff",
  bgNeeds: "#fffcfa",
  bgDone: "#fafaf9",
  border: "rgba(218, 193, 185, 0.35)",
  borderDashed: "rgba(218, 193, 185, 0.6)",
  borderSelected: "rgba(147, 69, 42, 0.45)",
  borderNeeds: "rgba(232, 149, 109, 0.4)",
  text: "#2c2c2c",
  textDim: "#7a7570",
  textMuted: "#b0a9a2",
  accent: "#e8956d",
  accentRun: "#6366F1",
  green: "#7ab87a",
};

/** Inline-editable title — double-click to rename */
function InlineTitle({ title, taskId, color }: { title: string; taskId: string; color: string }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(title);
  const [hover, setHover] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const updateTask = useTaskStore((s) => s.updateTask);

  useEffect(() => { setValue(title); }, [title]);
  useEffect(() => { if (editing) inputRef.current?.select(); }, [editing]);

  const commit = () => {
    const trimmed = value.trim();
    if (trimmed && trimmed !== title) updateTask(taskId, { title: trimmed });
    else setValue(title);
    setEditing(false);
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") { setValue(title); setEditing(false); } }}
        onClick={(e) => e.stopPropagation()}
        style={{
          fontSize: 14, fontWeight: 600, fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
          color, flex: 1, minWidth: 0, border: "none", outline: "none",
          background: "rgba(0,0,0,0.03)",
          borderBottom: "1.5px solid rgba(147, 69, 42, 0.4)",
          borderRadius: 0, padding: "1px 2px", margin: "-1px -2px",
        }}
      />
    );
  }

  return (
    <span
      onClick={(e) => { e.stopPropagation(); setEditing(true); }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        fontSize: 14, fontWeight: 600, fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
        color, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, minWidth: 0,
        cursor: "text",
        borderBottom: hover ? "1px solid rgba(0,0,0,0.15)" : "1px solid transparent",
        transition: "border-color 120ms ease",
        padding: "1px 2px", margin: "-1px -2px",
        borderRadius: 0,
      }}
    >
      {title}
    </span>
  );
}

function GoalCard({
  task,
  allTasks,
  clients,
  isSelected,
  dimmed,
  onSelect,
  onDragStart,
  onDragEnd,
  onDragOverCard,
  onDropOnCard,
  onMarkDone,
  dropIndicator,
  isDragging,
  unseen,
}: {
  task: Task;
  allTasks: Task[];
  clients: Client[];
  isSelected: boolean;
  dimmed?: boolean;
  onSelect: (id: string) => void;
  onDragStart: (id: string, e: React.DragEvent) => void;
  onDragEnd?: () => void;
  onDragOverCard?: (id: string, position: "before" | "after", e: React.DragEvent) => void;
  onDropOnCard?: (id: string, e: React.DragEvent) => void;
  onMarkDone?: (id: string) => void;
  /** When set, renders a blue line above/below the card to show the drop slot */
  dropIndicator?: "before" | "after" | null;
  /** True when this specific card is being dragged (dim it) */
  isDragging?: boolean;
  /** True when task needs input but hasn't been opened yet */
  unseen?: boolean;
}) {
  const [hover, setHover] = useState(false);
  const isProjectParent = task.level === "project" || task.level === "gsd";
  const client = task.clientId ? clients.find((c) => c.slug === task.clientId) : null;

  const children = allTasks.filter(
    (t) => t.parentId === task.id || (task.projectSlug && t.projectSlug === task.projectSlug && t.id !== task.id)
  );
  const hasChildren = children.length > 0;
  const childDone = children.filter((t) => t.status === "done").length;
  const childNeeds = isProjectParent && children.some(taskNeedsInput);
  const childRunning = isProjectParent && children.some((c) => c.status === "running");

  const isRunning = task.status === "running" || childRunning;
  const needs = !isRunning && (taskNeedsInput(task) || childNeeds);
  const isDone = isAchieved(task);

  const [elapsed, setElapsed] = useState("");
  useEffect(() => {
    if (!isRunning || !task.startedAt) return;
    const tick = () => setElapsed(formatElapsed(task.startedAt!));
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, [isRunning, task.startedAt]);

  // Brief snippet: prefer description, fall back to activity label
  const briefSnippet = (task.description || "")
    .replace(/^Working directory:.*$/m, "")
    .trim()
    .split("\n")
    .find((l) => l.trim().length > 0) || "";
  const truncatedBrief = briefSnippet.length > 120
    ? briefSnippet.slice(0, 117) + "..."
    : briefSnippet;

  // Left-edge accent — 3px coloured strip for running/done only
  const accentColor = isDone
    ? T.green
    : isRunning
    ? T.accentRun
    : "transparent";

  return (
    <div
      data-card
      draggable
      onDragStart={(e) => onDragStart(task.id, e)}
      onDragEnd={() => onDragEnd?.()}
      onDragOver={(e) => {
        if (!onDragOverCard) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        const rect = e.currentTarget.getBoundingClientRect();
        const midY = rect.top + rect.height / 2;
        const position: "before" | "after" = e.clientY < midY ? "before" : "after";
        onDragOverCard(task.id, position, e);
      }}
      onDrop={(e) => {
        if (!onDropOnCard) return;
        e.preventDefault();
        e.stopPropagation();
        onDropOnCard(task.id, e);
      }}
      onClick={() => onSelect(task.id)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={isRunning && !isDone ? "card-running" : undefined}
      style={{
        background: T.bg,
        borderTop: isRunning && !isDone
          ? `1.5px solid rgba(99, 102, 241, 0.35)`
          : `1px solid ${isSelected ? T.borderSelected : T.border}`,
        borderRight: isRunning && !isDone
          ? `1.5px solid rgba(99, 102, 241, 0.35)`
          : `1px solid ${isSelected ? T.borderSelected : T.border}`,
        borderBottom: "none",
        borderLeft: `3px solid ${accentColor}`,
        borderRadius: 0,
        padding: "8px 12px",
        cursor: "pointer",
        position: "relative",
        overflow: "visible",
        color: T.text,
        transition: "border-color 0.15s, opacity 0.2s, box-shadow 0.15s",
        opacity: isDragging ? 0.35 : dimmed ? 0.4 : isDone ? 0.65 : 1,
        filter: dimmed ? "saturate(0.4)" : "none",
        boxShadow: isRunning && !isDone
          ? "inset 0 0 0 0.5px rgba(99, 102, 241, 0.1)"
          : isSelected
          ? "inset 0 0 0 0.5px rgba(147, 69, 42, 0.1)"
          : "none",
      }}
    >
      {dropIndicator && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            [dropIndicator === "before" ? "top" : "bottom"]: -3,
            height: 3,
            borderRadius: 2,
            background: "#93452A",
            boxShadow: "0 0 0 2px rgba(147, 69, 42, 0.15)",
            pointerEvents: "none",
            zIndex: 5,
          }}
        />
      )}
      {/* Running shimmer — gradient sweep along bottom edge */}
      {isRunning && !isDone && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 3,
            right: 0,
            height: 2,
            background: `linear-gradient(90deg, transparent 0%, rgba(99, 102, 241, 0.6) 50%, transparent 100%)`,
            backgroundSize: "200% 100%",
            animation: "running-shimmer 1.8s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Title row */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}>
        {client && (
          <span style={{
            fontSize: 10,
            fontFamily: MONO,
            color: "#9C9CA0",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}>
            {client.name}
          </span>
        )}
        <InlineTitle
          title={task.title}
          taskId={task.id}
          color={isDone ? T.textDim : T.text}
        />
      </div>

      {/* Description — one line, muted */}
      {truncatedBrief && (
        <div style={{
          marginTop: 4,
          fontSize: 12,
          fontFamily: "var(--font-inter), Inter, sans-serif",
          color: T.textDim,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          lineHeight: 1.4,
        }}>
          {truncatedBrief}
        </div>
      )}

      {/* Metadata — vertically stacked, Notion-style */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 6 }}>
        {task.level !== "task" && (
          <div><LevelBadge level={task.level} projectSlug={task.projectSlug} /></div>
        )}
        {needs && (
          <span style={{
            fontSize: 10,
            fontFamily: MONO,
            fontWeight: 500,
            color: T.accent,
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
          }}>
            needs input
            {unseen && (
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  backgroundColor: "#93452A",
                  flexShrink: 0,
                }}
                title="Not yet viewed"
              />
            )}
          </span>
        )}
        {isRunning && !needs && (
          <span style={{
            fontSize: 10,
            fontFamily: MONO,
            color: T.accentRun,
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
          }}>
            {hasChildren && childRunning ? "running a task" : "running"}
            {elapsed && <span style={{ color: T.textMuted }}>{elapsed}</span>}
          </span>
        )}
        {isRunning && task.activityLabel && (
          <span style={{
            fontSize: 11,
            fontFamily: MONO,
            color: "#8a8a8d",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "100%",
          }}>
            {task.activityLabel.length > 60 ? task.activityLabel.slice(0, 59) + "…" : task.activityLabel}
          </span>
        )}
        {isDone && !needs && !isRunning && (
          <span style={{ fontSize: 10, fontFamily: MONO, color: T.green }}>done</span>
        )}
      </div>
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

// ── DetailPanel ──────────────────────────────────────────────────

// ── SubtasksList (truncated with expand) ────────────────────────

const SUBTASK_FOLD = 5;

function SubtasksList({
  subtasks,
  onSelectSubtask,
  onRunSubtask,
  onRunAll,
  childLogEntries,
}: {
  subtasks: Task[];
  onSelectSubtask?: (id: string) => void;
  onRunSubtask?: (id: string, currentStatus: string) => void;
  onRunAll?: () => void;
  childLogEntries?: Record<string, LogEntry[]>;
}) {
  const [expanded, setExpanded] = useState(false);

  const backlogCount = subtasks.filter((s) => s.status === "backlog").length;

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
      {onRunAll && backlogCount > 0 && (
        <button
          onClick={onRunAll}
          style={{
            alignSelf: "flex-start",
            display: "inline-flex", alignItems: "center", gap: 4,
            padding: "4px 8px", marginBottom: 6,
            fontSize: 10, fontFamily: "'DM Mono', monospace", fontWeight: 600,
            border: "1px solid rgba(147, 69, 42, 0.3)",
            borderRadius: 5,
            background: "rgba(147, 69, 42, 0.06)",
            color: "#93452A",
            cursor: "pointer",
          }}
          title={`Run all ${backlogCount} backlog subtasks`}
        >
          <Play size={10} />
          Run all ({backlogCount})
        </button>
      )}
      {visible.map((st) => {
        // Mutually-exclusive display state — priority order matters.
        // done > needsInput > running > queued > backlog
        type DisplayState = "done" | "needs" | "running" | "queued" | "backlog";
        const rawNeeds = taskNeedsInput(st);
        const displayState: DisplayState =
          st.status === "done"
            ? "done"
            : rawNeeds
            ? "needs"
            : st.status === "running"
            ? "running"
            : st.status === "queued"
            ? "queued"
            : "backlog";

        const canRun = st.status === "backlog" || st.status === "review" || st.status === "done";
        const runLabel = st.status === "backlog" ? "run" : st.status === "review" ? "requeue" : "rerun";

        // Only surface a waiting-on-input preview if we're actually in needs state.
        const logs = childLogEntries?.[st.id] || [];
        let questionPreview: string | null = null;
        if (displayState === "needs") {
          for (let i = logs.length - 1; i >= 0; i--) {
            const e = logs[i];
            if ((e.type === "question" || e.type === "structured_question") && !e.questionAnswers) {
              questionPreview = e.content.slice(0, 110) || "Claude is asking for input";
              break;
            }
          }
          if (!questionPreview) questionPreview = "Waiting for your reply";
        }

        // Per-state visual tokens (one source of truth).
        const visuals: Record<DisplayState, {
          bg: string; bgHover: string; border: string; borderLeft: string;
          textColor: string; dotColor: string; pulse: boolean;
          statusLabel: string; statusColor: string; strike: boolean;
        }> = {
          done: {
            bg: "transparent", bgHover: "rgba(0,0,0,0.03)",
            border: "1px solid transparent", borderLeft: "3px solid transparent",
            textColor: "#aaa", dotColor: "#7ab87a", pulse: false,
            statusLabel: "done", statusColor: "#bbb", strike: true,
          },
          needs: {
            bg: "rgba(232, 149, 109, 0.06)", bgHover: "rgba(232, 149, 109, 0.12)",
            border: "1px solid rgba(232, 149, 109, 0.35)", borderLeft: "3px solid #e8956d",
            textColor: "#e8956d", dotColor: "#e8956d", pulse: false,
            statusLabel: "input", statusColor: "#e8956d", strike: false,
          },
          running: {
            bg: "transparent", bgHover: "rgba(0,0,0,0.03)",
            border: "1px solid transparent", borderLeft: "3px solid rgba(147, 69, 42, 0.5)",
            textColor: "#555", dotColor: "#1a1a1a", pulse: true,
            statusLabel: "running", statusColor: "#bbb", strike: false,
          },
          queued: {
            bg: "transparent", bgHover: "rgba(0,0,0,0.03)",
            border: "1px solid transparent", borderLeft: "3px solid transparent",
            textColor: "#555", dotColor: "#ccc", pulse: false,
            statusLabel: "queued", statusColor: "#bbb", strike: false,
          },
          backlog: {
            bg: "transparent", bgHover: "rgba(0,0,0,0.03)",
            border: "1px solid transparent", borderLeft: "3px solid transparent",
            textColor: "#555", dotColor: "#e0dcd6", pulse: false,
            statusLabel: st.status, statusColor: "#bbb", strike: false,
          },
        };
        const v = visuals[displayState];

        return (
          <div
            key={st.id}
            onClick={onSelectSubtask ? () => onSelectSubtask(st.id) : undefined}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 6,
              padding: "6px 8px",
              borderRadius: 6,
              fontSize: 11,
              color: v.textColor,
              background: v.bg,
              border: v.border,
              borderLeft: v.borderLeft,
              cursor: onSelectSubtask ? "pointer" : "default",
              transition: "background 120ms ease, border-color 120ms ease",
            }}
            onMouseEnter={(e) => {
              if (!onSelectSubtask) return;
              e.currentTarget.style.background = v.bgHover;
            }}
            onMouseLeave={(e) => {
              if (!onSelectSubtask) return;
              e.currentTarget.style.background = v.bg;
            }}
          >
            <span style={{
              width: 6, height: 6, borderRadius: "50%", flexShrink: 0, marginTop: 5,
              background: v.dotColor,
              animation: v.pulse ? "pulse-dot 2s ease-in-out infinite" : undefined,
            }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                textDecoration: v.strike ? "line-through" : "none",
              }}>
                {st.title}
              </div>
              {questionPreview && (
                <div style={{
                  marginTop: 2,
                  fontSize: 10,
                  fontStyle: "italic",
                  color: "#c37650",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  ↳ {questionPreview}
                </div>
              )}
            </div>
            {onRunSubtask && canRun && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRunSubtask(st.id, st.status);
                }}
                style={{
                  padding: "2px 6px",
                  fontSize: 9,
                  fontFamily: "'DM Mono', monospace",
                  fontWeight: 600,
                  color: "#93452A",
                  background: "#fff",
                  border: "1px solid rgba(147, 69, 42, 0.3)",
                  borderRadius: 4,
                  cursor: "pointer",
                  flexShrink: 0,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
                title={`${runLabel} this subtask`}
              >
                {runLabel}
              </button>
            )}
            <span style={{
              fontSize: 9, fontFamily: "'DM Mono', monospace",
              color: v.statusColor, flexShrink: 0, marginTop: 3,
            }}>
              {v.statusLabel}
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

function GsdPhasesOverview({
  subtasks,
  parentTask,
  onSelectSubtask,
  onStepLaunched,
  onCommand,
}: {
  subtasks: Task[];
  parentTask: Task;
  onSelectSubtask?: (id: string) => void;
  onStepLaunched?: () => void;
  /** Fill the reply input with a /gsd command instead of queuing directly. */
  onCommand?: (command: string) => void;
}) {
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null);
  const [phaseFiles, setPhaseFiles] = useState<PlanningFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<string | null>(null);
  const [showProjectDocs, setShowProjectDocs] = useState(false);
  const [projectFiles, setProjectFiles] = useState<PlanningFile[]>([]);
  const [researchFiles, setResearchFiles] = useState<PlanningFile[]>([]);
  const updateTask = useTaskStore((s) => s.updateTask);

  // Click chip → fill the reply input with the /gsd command
  const handleLaunchStep = useCallback(
    (commandName: string, phaseNumber: number, e: React.MouseEvent) => {
      e.stopPropagation();
      if (onCommand) {
        onCommand(`/gsd:${commandName} ${phaseNumber}`);
      }
    },
    [onCommand]
  );

  // Separate affordance: hover-revealed ✓ marks that step complete without running it
  const handleMarkStepDone = useCallback(
    async (step: Task, e: React.MouseEvent) => {
      e.stopPropagation();
      if (step.status === "done") return;
      await updateTask(step.id, {
        status: "done",
        needsInput: false,
        errorMessage: null,
        completedAt: new Date().toISOString(),
      });
    },
    [updateTask]
  );

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
              {onSelectSubtask && (currentStep || phase.steps[0]) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectSubtask((currentStep || phase.steps[0]).id);
                  }}
                  title="Open conversation"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 3,
                    padding: "2px 6px",
                    fontSize: 9,
                    fontFamily: "'DM Mono', monospace",
                    border: "1px solid rgba(147, 69, 42, 0.25)",
                    borderRadius: 4,
                    background: "#fff",
                    color: "#93452A",
                    cursor: "pointer",
                  }}
                >
                  open
                </button>
              )}
              {allDone && <CheckCircle2 size={12} color="#7ab87a" />}
              <span style={{
                fontSize: 8, display: "inline-block",
                transition: "transform 150ms ease",
                transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                color: "#bbb",
              }}>&#9654;</span>
            </div>

            {/* Step pills — always clickable, fills reply input with the /gsd command */}
            <div style={{ display: "flex", gap: 4, paddingLeft: 22 }}>
              {phase.steps.map((step) => {
                const isDone = step.status === "done";
                const isActive = step.status === "running" || step.status === "queued" || taskNeedsInput(step);
                const label = step.gsdStep || "?";
                const commandName =
                  step.gsdStep === "execute" ? "execute-phase"
                    : step.gsdStep === "verify" ? "verify-work"
                    : step.gsdStep === "plan" ? "plan-phase"
                    : "discuss-phase";
                return (
                  <span
                    key={step.id}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 2,
                      borderRadius: 4,
                      background: isDone ? "rgba(122, 184, 122, 0.12)"
                        : isActive ? "rgba(147, 69, 42, 0.08)"
                        : "rgba(147, 69, 42, 0.04)",
                      border: "1px solid transparent",
                      transition: "border-color 120ms ease",
                    }}
                    onMouseEnter={(e) => {
                      const checkBtn = e.currentTarget.querySelector("[data-mark-done]") as HTMLElement | null;
                      if (checkBtn && !isDone) checkBtn.style.display = "inline-flex";
                      e.currentTarget.style.borderColor = "rgba(147, 69, 42, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                      const checkBtn = e.currentTarget.querySelector("[data-mark-done]") as HTMLElement | null;
                      if (checkBtn) checkBtn.style.display = "none";
                      e.currentTarget.style.borderColor = "transparent";
                    }}
                  >
                    <button
                      onClick={(e) => handleLaunchStep(commandName, phase.phaseNumber, e)}
                      title={`Run /gsd:${commandName} ${phase.phaseNumber}`}
                      style={{
                        fontSize: 10,
                        fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                        padding: "3px 8px",
                        borderRadius: 4,
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        color: isDone ? "#5a9a5a"
                          : isActive ? "#93452A"
                          : "#93452A",
                        fontWeight: 500,
                        transition: "background 120ms ease",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(147, 69, 42, 0.08)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                    >
                      {label}
                    </button>
                    {!isDone && (
                      <button
                        data-mark-done
                        onClick={(e) => handleMarkStepDone(step, e)}
                        title={`Mark ${label} complete without running it`}
                        style={{
                          display: "none",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "0 4px 0 2px",
                          marginRight: 2,
                          border: "none",
                          background: "transparent",
                          cursor: "pointer",
                          color: "#5a9a5a",
                        }}
                      >
                        <Check size={9} />
                      </button>
                    )}
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
  const router = useRouter();
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

  const parts = relativePath.split("/").filter(Boolean);
  const dirParts = parts.slice(0, -1);
  const fileName = parts[parts.length - 1] || relativePath;

  const openPath = (subPath: string) => {
    router.push(`/?tab=docs&file=${encodeURIComponent(subPath)}`);
  };

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
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 8,
        padding: "8px 10px",
        borderBottom: "1px solid #e8e4df",
        background: "#f3f0ee",
      }}>
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
          {dirParts.length > 0 && (
            <div
              style={{
                fontSize: 10,
                fontFamily: "'DM Mono', monospace",
                color: "#9C9CA0",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 2,
                letterSpacing: "0.02em",
              }}
            >
              {dirParts.map((segment, i) => {
                const segPath = dirParts.slice(0, i + 1).join("/");
                return (
                  <span key={segPath} style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
                    <button
                      onClick={() => openPath(segPath)}
                      title={`Reveal ${segPath} in file explorer`}
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        color: "#93452A",
                        fontFamily: "inherit",
                        fontSize: "inherit",
                        textDecoration: "underline",
                        textDecorationColor: "rgba(147, 69, 42, 0.3)",
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.textDecorationColor = "#93452A"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.textDecorationColor = "rgba(147, 69, 42, 0.3)"; }}
                    >
                      {segment}
                    </button>
                    {i < dirParts.length - 1 && <span style={{ color: "#ccc" }}>›</span>}
                  </span>
                );
              })}
            </div>
          )}
          <button
            onClick={() => openPath(relativePath)}
            title={`Open ${fileName} in Docs`}
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#1B1C1B",
              fontFamily: "'DM Mono', monospace",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              textAlign: "left",
              textDecoration: "underline",
              textDecorationColor: "rgba(27, 28, 27, 0.25)",
              textUnderlineOffset: 2,
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.textDecorationColor = "#93452A"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.textDecorationColor = "rgba(27, 28, 27, 0.25)"; }}
          >
            {fileName}
          </button>
        </div>
        <button
          onClick={onClose}
          title="Close preview"
          style={{ background: "none", border: "none", cursor: "pointer", color: "#999", display: "flex", padding: 2, flexShrink: 0 }}
        >
          <X size={12} />
        </button>
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
  onSelectSubtask,
  onNavigateToParent,
  isFullscreen = false,
  onToggleFullscreen,
  drawerWidth,
  onStartDrawerDrag,
  pendingScope,
  onScopeComplete,
}: {
  task: Task;
  onClose: () => void;
  onMarkDone: (id: string) => void;
  onSelectSubtask?: (id: string) => void;
  onNavigateToParent?: (parentId: string) => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  /** Current drawer width in px (managed by parent FeedView). */
  drawerWidth?: number | null;
  /** Callback to start a left-edge drag resize. */
  onStartDrawerDrag?: (e: React.MouseEvent) => void;
  /** Scope data for project planning wizard (shown inline) */
  pendingScope?: { scope: ScopeResult; goal: string } | null;
  /** Called when the scoping wizard finishes creating the project */
  onScopeComplete?: () => void;
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

  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [replyAttachments, setReplyAttachments] = useState<{ fileName: string; relativePath: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashQuery, setSlashQuery] = useState("");
  const [showInlineTagMenu, setShowInlineTagMenu] = useState(false);
  const [inlineTagQuery, setInlineTagQuery] = useState("");
  const [inlinePromptTags, setInlinePromptTags] = useState<TagItem[]>([]);
  const [pastedChips, setPastedChips] = useState<PastedChip[]>([]);
  const [previewFile, setPreviewFile] = useState<{ relativePath: string; extension: string } | null>(null);
  const [planningFiles, setPlanningFiles] = useState<{ projectFiles: PlanningFile[]; phases: { phaseNumber: number; dirName: string; files: PlanningFile[] }[]; researchFiles: PlanningFile[] } | null>(null);
  const [viewingPlanningDoc, setViewingPlanningDoc] = useState<string | null>(null);
  const [mainTab, setMainTab] = useState<"chat" | "subtasks" | "files">("chat");
  const [permissionMode, setPermissionMode] = useState<PermissionMode>(task.permissionMode ?? "bypassPermissions");
  const [model, setModel] = useState<ClaudeModel | null>(task.model ?? null);
  const [changedOnly, setChangedOnly] = useState(false);
  const [scrollToTaskId, setScrollToTaskId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replyTextareaRef = useRef<HTMLTextAreaElement>(null);
  const activityRef = useRef<HTMLDivElement>(null);

  // Drawer width + resize are managed by the parent FeedView so the grid
  // layout can respond. We receive them as props.

  // Re-sync picker state when switching to a different task
  useEffect(() => {
    setPermissionMode(task.permissionMode ?? "bypassPermissions");
    setModel(task.model ?? null);
  }, [task.id, task.permissionMode, task.model]);

  // Derive latest TodoWrite snapshot from streamed log entries.
  const latestTodos: Todo[] = useMemo(() => {
    for (let i = logEntries.length - 1; i >= 0; i--) {
      const entry = logEntries[i];
      if (entry.type === "tool_use" && entry.toolName === "TodoWrite" && entry.toolArgs) {
        try {
          const parsed = parseTodosFromInput(JSON.parse(entry.toolArgs));
          if (parsed) return parsed;
        } catch {
          // ignore
        }
      }
    }
    return [];
  }, [logEntries]);

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
  const isParentTask = task.level !== "task";

  // Fetch log entries for all subtasks so we can show question previews.
  // The subtask IDs list is stable across re-renders except when the set changes.
  const subtaskIdsKey = subtasks.map((s) => s.id).join(",");
  useEffect(() => {
    if (subtasks.length === 0) return;
    for (const st of subtasks) {
      fetchLogEntries(st.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtaskIdsKey, fetchLogEntries]);

  const allLogEntries = useTaskStore((s) => s.logEntries);
  const childLogEntries: Record<string, LogEntry[]> = {};
  for (const st of subtasks) {
    childLogEntries[st.id] = allLogEntries[st.id] ?? [];
  }

  // For project/gsd parents: merge the parent's scoping log with every
  // subtask's run log, sorted by timestamp. Because all subtasks resume
  // into the parent's claudeSessionId, these are literally the same
  // conversation — the merged feed is what the user is actually talking to.
  // Each entry is tagged with sourceTaskId so we can scroll to a subtask's
  // section when clicking it.
  const projectConversation = useMemo(() => {
    if (!isParentTask) return logEntries;
    const merged: LogEntry[] = logEntries.map((e) => ({ ...e, sourceTaskId: task.id }));
    for (const st of subtasks) {
      for (const e of (childLogEntries[st.id] ?? [])) {
        merged.push({ ...e, sourceTaskId: st.id });
      }
    }
    merged.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    return merged;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isParentTask, logEntries, subtasks, allLogEntries, task.id]);

  const anyChildRunning = subtasks.some((s) => s.status === "running");

  // Run a single subtask: POST /execute, fall back to direct queue update.
  const handleRunSubtask = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`/api/tasks/${id}/execute`, { method: "POST" });
        if (res.ok) return;
      } catch { /* fall through */ }
      await updateTask(id, { status: "queued", needsInput: false, errorMessage: null });
    },
    [updateTask],
  );

  const handleRunAllSubtasks = useCallback(async () => {
    const backlog = subtasks.filter((s) => s.status === "backlog");
    for (const s of backlog) {
      await handleRunSubtask(s.id);
    }
  }, [subtasks, handleRunSubtask]);

  const parentOfCurrent = task.parentId ? allTasks.find((t) => t.id === task.parentId) : null;

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

  // Fetch prompt tags for inline reply @-tag menu
  useEffect(() => {
    fetch("/api/prompt-tags")
      .then((r) => r.json())
      .then((data) => setInlinePromptTags((data.tags ?? []).map((t: { name: string; body: string; category?: string; description?: string }) => ({ name: t.name, body: t.body, category: t.category, description: t.description }))))
      .catch(() => {});
  }, []);

  const handleReplyChange = useCallback((value: string) => {
    setReplyText(value);
    if (value.startsWith("/")) {
      setShowSlashMenu(true);
      setSlashQuery(value);
      setShowInlineTagMenu(false);
    } else {
      setShowSlashMenu(false);
      setSlashQuery("");
    }
    // Detect @tag trigger in inline reply (cursor-aware)
    const el = replyTextareaRef.current;
    if (!value.startsWith("/")) {
      const cursor = el?.selectionStart ?? value.length;
      const before = value.slice(0, cursor);
      const match = before.match(/(^|[\s])@([\w\/-]*)$/);
      if (match) {
        setShowInlineTagMenu(true);
        setInlineTagQuery(match[2]);
        setShowSlashMenu(false);
      } else {
        setShowInlineTagMenu(false);
        setInlineTagQuery("");
      }
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
        body: JSON.stringify({ message: fullMessage, permissionMode, model }),
      });
    } catch { /* silently fail */ }
    finally {
      setIsSending(false);
    }
  };

  return (
    <div
      data-card
      style={
        isFullscreen
          ? {
              // Full-screen overlay mode — cover the viewport so the user can
              // focus entirely on the conversation + files for a tall task.
              position: "fixed",
              top: 16,
              left: 16,
              right: 16,
              bottom: 16,
              background: "white",
              border: "1.5px solid #d4cfc9",
              borderRadius: 10,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              zIndex: 1000,
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.25)",
            }
          : {
              // Drawer mode — fixed overlay covering the full viewport height
              // including the nav and goal bar. The page content reflows via
              // marginRight on the FeedView wrapper.
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: drawerWidth ?? 720,
              background: "white",
              borderLeft: "1px solid #d4cfc9",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              zIndex: 100,
              boxShadow: "-4px 0 24px rgba(0, 0, 0, 0.08)",
            }
      }
    >
      {/* Left-edge resize handle (drawer mode only) */}
      {!isFullscreen && onStartDrawerDrag && (
        <div
          onMouseDown={onStartDrawerDrag}
          title="Drag to resize"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 6,
            cursor: "col-resize",
            zIndex: 60,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget.firstChild as HTMLElement | null)?.style?.setProperty("background", "#93452A");
          }}
          onMouseLeave={(e) => {
            (e.currentTarget.firstChild as HTMLElement | null)?.style?.setProperty("background", "transparent");
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 2,
              width: 2,
              background: "transparent",
              transition: "background 150ms ease",
              borderRadius: 1,
            }}
          />
        </div>
      )}

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
          display: "flex",
          alignItems: "center",
          gap: 8,
          flex: 1,
          minWidth: 0,
        }}>
          {parentOfCurrent && onNavigateToParent ? (
            <button
              onClick={() => onNavigateToParent(parentOfCurrent.id)}
              title={`Back to ${parentOfCurrent.title}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "3px 8px",
                fontSize: 10,
                fontFamily: "'DM Mono', monospace",
                color: "#93452A",
                background: "rgba(147, 69, 42, 0.06)",
                border: "1px solid rgba(147, 69, 42, 0.2)",
                borderRadius: 5,
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <ArrowLeft size={10} />
              parent
            </button>
          ) : (
            <InlineTitle title={task.title} taskId={task.id} color="#1B1C1B" />
          )}
          {task.level === "gsd" && task.phaseNumber != null && task.gsdStep && parentOfCurrent && (
            <span style={{
              display: "inline-block",
              fontSize: 10,
              fontWeight: 600,
              fontFamily: "'DM Mono', monospace",
              padding: "2px 6px",
              borderRadius: 4,
              backgroundColor: "#F5F3FF",
              color: "#6D28D9",
              flexShrink: 0,
            }}>
              Phase {task.phaseNumber} · {task.gsdStep}
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {/* Permission mode + model badges */}
          {task.permissionMode && (
            <span
              title={PERMISSION_MODE_HINTS[task.permissionMode] ?? ""}
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "3px 7px",
                fontSize: 10,
                fontFamily: "'DM Mono', monospace",
                fontWeight: 500,
                color: "#999",
                background: "rgba(218, 193, 185, 0.12)",
                borderRadius: 4,
                cursor: "default",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {PERMISSION_MODE_LABELS[task.permissionMode] ?? task.permissionMode}
            </span>
          )}
          {task.model && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "3px 7px",
                fontSize: 10,
                fontFamily: "'DM Mono', monospace",
                fontWeight: 500,
                color: "#8B7355",
                background: "rgba(218, 193, 185, 0.12)",
                borderRadius: 4,
                cursor: "default",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {task.model}
            </span>
          )}
          {task.claudeSessionId && (
            <ResumeClipButton sessionId={task.claudeSessionId} />
          )}
          {!isDone && (
            <button
              onClick={async () => {
                if (task.level === "gsd" && task.projectSlug) {
                  await fetch("/api/gsd/complete", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ projectSlug: task.projectSlug }),
                  });
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
                e.currentTarget.style.borderColor = "#7ab87a";
                e.currentTarget.style.color = "#5a9a5a";
                e.currentTarget.style.background = "rgba(122, 184, 122, 0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#ddd";
                e.currentTarget.style.color = "#999";
                e.currentTarget.style.background = "transparent";
              }}
            >
              <Check size={12} />
              mark done
            </button>
          )}
          {onToggleFullscreen && (
            <button
              onClick={onToggleFullscreen}
              title={isFullscreen ? "Exit full screen" : "Full screen"}
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
              {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
          )}
          <button
            onClick={onClose}
            title="Close"
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

      {/* Subtask status strip — compact dot row for parent tasks */}
      {isParentTask && subtasks.length > 0 && (
        <SubtaskStatusStrip
          subtasks={subtasks.map((s) => ({ id: s.id, title: s.title, status: s.status }))}
          onJump={(id) => {
            setMainTab("subtasks");
            // Scroll to row handled by DOM after tab switch
          }}
        />
      )}

      {/* Scoping wizard — shown inline when a project goal needs planning */}
      {pendingScope && (
        <ScopingWizardInline
          scope={pendingScope.scope}
          goal={pendingScope.goal}
          clientId={task.clientId ?? undefined}
          onClose={onClose}
          onCreated={async (result) => {
            // Update this task to point at the new project
            await updateTask(task.id, { projectSlug: result.projectSlug });
            onScopeComplete?.();
          }}
        />
      )}

      {/* Body: tabbed — Chat / Subtasks / Files. Each tab fills the full
          drawer height. Chat lays out as flex column so the conversation
          scrolls and the reply input pins to the bottom. */}
      {!pendingScope && (<div style={{
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        flex: 1,
      }}>
        {/* Tab bar */}
        <div style={{
          display: "flex",
          gap: 0,
          borderBottom: "1px solid #e8e4df",
          padding: "0 16px",
          flexShrink: 0,
        }}>
          {([
            { key: "chat" as const, label: "Chat" },
            ...(isParentTask
              ? [{ key: "subtasks" as const, label: task.level === "gsd" ? `Phases (${subtasks.length})` : `Subtasks (${subtasks.length})` }]
              : []),
            { key: "files" as const, label: `Files (${outputFiles.length + (task.level === "gsd" && planningFiles ? planningFiles.projectFiles.length + planningFiles.phases.reduce((n, p) => n + p.files.length, 0) + planningFiles.researchFiles.length : 0)})` },
          ]).map((t) => (
            <button
              key={t.key}
              onClick={() => setMainTab(t.key)}
              style={{
                fontSize: 11,
                fontFamily: "'DM Mono', monospace",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: mainTab === t.key ? "#1a1a1a" : "#bbb",
                background: "transparent",
                border: "none",
                borderBottom: mainTab === t.key ? "2px solid #93452A" : "2px solid transparent",
                padding: "8px 12px 8px",
                cursor: "pointer",
                marginBottom: -1,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Chat tab */}
        {mainTab === "chat" && (
        <div style={{
          padding: 16,
          minWidth: 0,
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        }}>
          {isParentTask ? (
            (() => {
              const hasConversation = projectConversation.length > 0;
              return (
                <>
                <ReviewBanner task={task} onApprove={() => onMarkDone(task.id)} onIterate={(text) => {
                  // Focus the ReplyInput — it's inside the parent path below
                  const ta = activityRef.current?.querySelector("textarea");
                  if (ta) { ta.focus(); ta.value = text; ta.dispatchEvent(new Event("input", { bubbles: true })); }
                }} />
                <div
                  ref={activityRef}
                  style={{
                    border: "1px solid #e8e4df",
                    borderRadius: 8,
                    overflow: "hidden",
                    background: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    minHeight: 0,
                  }}
                >
                  {hasConversation ? (
                    <div style={{
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                      minHeight: 0,
                    }}>
                      <ModalChat
                        taskId={task.id}
                        logEntries={projectConversation}
                        isRunning={anyChildRunning}
                        needsInput={false}
                        status={anyChildRunning ? "running" : task.status}
                        childTasks={[]}
                        childLogEntries={{}}
                        activePreviewPath={previewFile?.relativePath ?? null}
                        onPreviewFile={(f) => setPreviewFile({ relativePath: f.relativePath, extension: f.extension })}
                        readOnly
                        scrollToTaskId={scrollToTaskId}
                        onScrollComplete={() => setScrollToTaskId(null)}
                        permissionMode={task.permissionMode}
                        activityLabel={task.activityLabel}
                        startedAt={task.startedAt}
                        costUsd={task.costUsd}
                        tokensUsed={task.tokensUsed}
                        errorMessage={task.errorMessage}
                        durationMs={task.durationMs}
                      />
                    </div>
                  ) : (
                    <div style={{
                      padding: "24px 12px",
                      fontSize: 12,
                      color: "#999",
                      fontFamily: "'DM Mono', monospace",
                      textAlign: "center",
                    }}>
                      Waiting for first run
                    </div>
                  )}
                  <div style={{
                    borderTop: "1px solid #e8e4df",
                    background: "#fff",
                    padding: "10px 12px",
                    flexShrink: 0,
                  }}>
                    <ReplyInput
                      taskId={task.id}
                      isVisible={true}
                      needsInput={needsInput}
                      taskStatus={task.status}
                      initialPermissionMode={task.permissionMode ?? "bypassPermissions"}
                      initialModel={task.model ?? null}
                      subtasks={subtasks.map((s) => ({ id: s.id, title: s.title, status: s.status }))}
                      onSelectSubtask={(id) => {
                        setMainTab("chat");
                        setScrollToTaskId(id);
                      }}
                      onOptimisticReply={(entry) => appendLogEntry(task.id, entry)}
                    />
                  </div>
                </div>
                </>
              );
            })()
          ) : logEntries.length > 0 ? (
            <>
            <ReviewBanner task={task} onApprove={() => onMarkDone(task.id)} onIterate={(text) => setReplyText(text)} />
            <div style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              minHeight: 0,
              border: "1px solid #e8e4df",
              borderRadius: 8,
              overflow: "hidden",
              background: "#fff",
            }}>
              <ModalChat
                taskId={task.id}
                logEntries={logEntries}
                isRunning={task.status === "running"}
                needsInput={needsInput}
                status={task.status}
                childTasks={[]}
                childLogEntries={{}}
                activePreviewPath={previewFile?.relativePath ?? null}
                onPreviewFile={(f) => setPreviewFile({ relativePath: f.relativePath, extension: f.extension })}
                readOnly
                permissionMode={task.permissionMode}
                activityLabel={task.activityLabel}
                startedAt={task.startedAt}
                costUsd={task.costUsd}
                tokensUsed={task.tokensUsed}
                errorMessage={task.errorMessage}
                durationMs={task.durationMs}
              />
            </div>
            </>
          ) : (
            <SuggestedActions
              status={task.status}
              onSelect={(prompt) => {
                setReplyText(prompt);
                requestAnimationFrame(() => replyTextareaRef.current?.focus());
              }}
            />
          )}

          {/* Leaf reply input — always shown for leaf tasks so the user can
              reply/follow up whenever the detail panel is open. Covers every
              state (needsInput, running, review, done, queued, backlog,
              error), including edge cases like queued-with-needsInput. */}
          {!isParentTask && (
            <div style={{
              marginTop: 12,
              flexShrink: 0,
              background: "#f3f0ee",
              border: "1px solid #e5e1dc",
              borderRadius: 10,
              overflow: "visible",
            }}>
              {/* Attachment + pasted chips */}
              {(replyAttachments.length > 0 || pastedChips.length > 0) && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, padding: "8px 10px 0" }}>
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

              {/* Hidden file input */}
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

              {/* Textarea on top */}
              <div style={{ position: "relative", padding: "10px 12px 6px" }}>
                {showInlineTagMenu && inlinePromptTags.length > 0 && (
                  <SlashCommandMenu
                    query={inlineTagQuery}
                    onSelect={() => {}}
                    onClose={() => { setShowInlineTagMenu(false); setInlineTagQuery(""); }}
                    anchor="above"
                    mode="tag"
                    tagItems={inlinePromptTags.filter((t) => !inlineTagQuery || t.name.toLowerCase().includes(inlineTagQuery.toLowerCase()))}
                    onTagSelect={(tag) => {
                      const el = replyTextareaRef.current;
                      const cursor = el?.selectionStart ?? replyText.length;
                      const before = replyText.slice(0, cursor);
                      const after = replyText.slice(cursor);
                      const replaced = before.replace(/(^|[\s])@[\w\/-]*$/, `$1@${tag.name} `);
                      setReplyText(replaced + after);
                      setShowInlineTagMenu(false);
                      setInlineTagQuery("");
                      el?.focus();
                    }}
                  />
                )}
                <div style={{ position: "relative" }}>
                  {(replyText.includes("@") || replyText.includes("/")) && (
                    <HighlightMirror
                      text={replyText}
                      style={{
                        fontSize: 13,
                        fontFamily: "inherit",
                        padding: "4px 0",
                        lineHeight: 1.5,
                      }}
                    />
                  )}
                  <textarea
                    ref={replyTextareaRef}
                    value={replyText}
                    onChange={(e) => handleReplyChange(e.target.value)}
                    onPaste={handlePaste}
                    onKeyDown={(e) => {
                      if ((showSlashMenu || showInlineTagMenu) && ["ArrowDown", "ArrowUp", "Enter", "Tab", "Escape"].includes(e.key)) return;
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleReply();
                      }
                    }}
                    placeholder="Reply...  Type / for commands, @ for tags"
                    rows={1}
                    style={{
                      width: "100%",
                      fontSize: 13,
                      fontFamily: "inherit",
                      padding: "4px 0",
                      backgroundColor: "transparent",
                      border: "none",
                      color: (replyText.includes("@") || replyText.includes("/")) ? "transparent" : "#1a1a1a",
                      caretColor: "#1a1a1a",
                      outline: "none",
                      resize: "none",
                      boxSizing: "border-box" as const,
                      lineHeight: 1.5,
                      position: "relative",
                      zIndex: 1,
                    }}
                  />
                </div>
                {showSlashMenu && (
                  <SlashCommandMenu
                    query={slashQuery}
                    onSelect={handleSlashSelect}
                    onClose={() => { setShowSlashMenu(false); setSlashQuery(""); }}
                    anchor="above"
                  />
                )}
              </div>

              {/* Controls strip — bottom */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                padding: "6px 8px",
                borderTop: "1px solid #e5e1dc",
              }}>
                {/* Attach (left, primary) */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  title="Attach file"
                  style={{
                    width: 28,
                    height: 26,
                    borderRadius: 6,
                    border: "none",
                    background: replyAttachments.length > 0 ? "rgba(147, 69, 42, 0.08)" : "transparent",
                    color: replyAttachments.length > 0 ? "#93452A" : "#5E5E65",
                    cursor: isUploading ? "wait" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    opacity: isUploading ? 0.5 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!isUploading && replyAttachments.length === 0)
                      e.currentTarget.style.background = "rgba(0,0,0,0.04)";
                  }}
                  onMouseLeave={(e) => {
                    if (replyAttachments.length === 0)
                      e.currentTarget.style.background = "transparent";
                  }}
                >
                  <Paperclip size={14} />
                </button>

                <ModelPicker value={model} onChange={setModel} />
                <PermissionPicker value={permissionMode} onChange={setPermissionMode} />
                <TasksPopover
                  todos={latestTodos}
                  subtasks={subtasks.map((s) => ({ id: s.id, title: s.title, status: s.status }))}
                  onSelectSubtask={onSelectSubtask}
                />

                <div style={{ flex: 1 }} />

                <button
                  type="button"
                  onClick={handleReply}
                  disabled={(!replyText.trim() && replyAttachments.length === 0) || isSending}
                  title="Send"
                  style={{
                    width: 28,
                    height: 26,
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

        )}

        {/* Subtasks tab */}
        {mainTab === "subtasks" && isParentTask && (
          <div style={{
            padding: 16,
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
          }}>
            {task.level === "gsd" && subtasks.length > 0 ? (
              <GsdPhasesOverview
                subtasks={subtasks}
                parentTask={task}
                onCommand={(cmd) => setReplyText(cmd)}
                onSelectSubtask={(id) => {
                  setMainTab("chat");
                  setScrollToTaskId(id);
                }}
              />
            ) : (
              <SubtasksList
                subtasks={subtasks}
                onRunSubtask={handleRunSubtask}
                onRunAll={handleRunAllSubtasks}
                childLogEntries={childLogEntries}
              />
            )}
          </div>
        )}

        {/* Files tab */}
        {mainTab === "files" && (
        <div style={{
          padding: 16,
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
        }}>
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

              {/* Regular output files — with diff status badges + filter */}
              {outputFiles.length === 0 && !(task.level === "gsd" && planningFiles) ? (
                <div style={{ fontSize: 11, color: "#ccc", fontFamily: "'DM Mono', monospace", padding: "8px 0" }}>
                  No files yet
                </div>
              ) : (
                <>
                {outputFiles.some((f) => f.diffStatus && f.diffStatus !== "unchanged") && (
                  <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 4 }}>
                    <button
                      onClick={() => setChangedOnly(!changedOnly)}
                      style={{
                        fontSize: 10,
                        fontFamily: "'DM Mono', monospace",
                        padding: "3px 8px",
                        borderRadius: 4,
                        border: changedOnly ? "1px solid rgba(147, 69, 42, 0.3)" : "1px solid #ddd",
                        background: changedOnly ? "rgba(147, 69, 42, 0.06)" : "transparent",
                        color: changedOnly ? "#93452A" : "#999",
                        cursor: "pointer",
                        transition: "all 120ms ease",
                      }}
                    >
                      {changedOnly ? "Show all" : "Changed only"}
                    </button>
                  </div>
                )}
                {(changedOnly ? outputFiles.filter((f) => f.diffStatus !== "unchanged") : outputFiles).map((file) => {
                  const canPreview = PREVIEWABLE.has(file.extension);
                  const isActive = previewFile?.relativePath === file.relativePath;
                  const diffBadge = file.diffStatus === "added" ? { label: "A", color: "#22C55E", bg: "rgba(34, 197, 94, 0.1)" }
                    : file.diffStatus === "modified" ? { label: "M", color: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)" }
                    : null;
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
                        {diffBadge && (
                          <span style={{
                            fontSize: 9,
                            fontWeight: 700,
                            fontFamily: "'DM Mono', monospace",
                            color: diffBadge.color,
                            background: diffBadge.bg,
                            padding: "1px 5px",
                            borderRadius: 3,
                            flexShrink: 0,
                          }}>
                            {diffBadge.label}
                          </span>
                        )}
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
                })}
                </>
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
        </div>
        )}
      </div>
      )}
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
  const borderColor = task.level === "gsd"
    ? "rgba(109, 40, 217, 0.35)"
    : task.level === "project"
    ? "rgba(147, 69, 42, 0.35)"
    : "rgba(218, 193, 185, 0.3)";
  return (
    <div
      data-card
      onClick={() => onSelect(task.id)}
      title={`${task.title} · click to reopen`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "5px 10px",
        borderRadius: 6,
        border: isSelected
          ? `1px solid ${task.level === "gsd" ? "#6D28D9" : task.level === "project" ? "#93452A" : "rgba(147, 69, 42, 0.35)"}`
          : `1px dashed ${borderColor}`,
        background: isSelected ? "white" : "#fafaf9",
        cursor: "pointer",
        fontSize: 12,
        color: "#666",
        transition: "border-color 0.15s, background 0.15s",
        opacity: 0.85,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "white"; e.currentTarget.style.opacity = "1"; }}
      onMouseLeave={(e) => { if (!isSelected) { e.currentTarget.style.background = "#fafaf9"; e.currentTarget.style.opacity = "0.85"; } }}
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
      <LevelBadge level={task.level} />
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
  const [levelFilter, setLevelFilter] = useState<TaskLevel | "all">("all");

  // Count per level for the filter chip labels (use the unfiltered set)
  const levelCounts = useMemo(() => {
    const counts: Record<TaskLevel | "all", number> = { all: goals.length, task: 0, project: 0, gsd: 0 };
    for (const g of goals) counts[g.level as TaskLevel]++;
    return counts;
  }, [goals]);

  const filteredGoals = useMemo(
    () => (levelFilter === "all" ? goals : goals.filter((g) => g.level === levelFilter)),
    [goals, levelFilter],
  );

  const allGroups = useMemo(() => groupByDate(filteredGoals), [filteredGoals]);

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
                background: lastResult === "success"
                  ? "rgba(122,184,122,0.15)"
                  : lastResult === "timeout"
                    ? "rgba(234,88,12,0.12)"
                    : "rgba(239,68,68,0.1)",
                color: lastResult === "success"
                  ? "#5a9a5a"
                  : lastResult === "timeout"
                    ? "#c2410c"
                    : "#ef4444",
                flexShrink: 0,
              }}>
                {lastResult === "success" ? "OK" : lastResult === "timeout" ? "TIMEOUT" : "FAIL"}
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
  foldLimit,
}: {
  outputs: RecentOutput[];
  onSelectTask: (taskId: string) => void;
  dimmed?: boolean;
  /** When set, show only the first N outputs with an expand toggle. */
  foldLimit?: number;
}) {
  const [previewOutput, setPreviewOutput] = useState<RecentOutput | null>(null);
  const [expanded, setExpanded] = useState(false);
  const visibleOutputs = foldLimit != null && !expanded ? outputs.slice(0, foldLimit) : outputs;
  const hiddenCount = outputs.length - visibleOutputs.length;

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
          {visibleOutputs.map((o) => {
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
          {hiddenCount > 0 && (
            <button
              onClick={() => setExpanded(true)}
              style={{
                marginTop: 6,
                padding: "4px 8px",
                border: "1px dashed rgba(218, 193, 185, 0.4)",
                borderRadius: 5,
                background: "transparent",
                fontSize: 10,
                fontFamily: "'DM Mono', monospace",
                color: "#aaa",
                cursor: "pointer",
                alignSelf: "flex-start",
              }}
            >
              + {hiddenCount} older
            </button>
          )}
          {expanded && foldLimit != null && (
            <button
              onClick={() => setExpanded(false)}
              style={{
                marginTop: 2,
                padding: "4px 8px",
                border: "none",
                background: "transparent",
                fontSize: 10,
                fontFamily: "'DM Mono', monospace",
                color: "#bbb",
                cursor: "pointer",
                alignSelf: "flex-start",
              }}
            >
              show fewer
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── FeedView (main export) ───────────────────────────────────────

export function FeedView({
  onSwitchTab,
}: {
  onSwitchTab?: (tab: string) => void;
}) {
  const tasks = useTaskStore((s) => s.tasks);
  const updateTask = useTaskStore((s) => s.updateTask);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailFullscreen, setDetailFullscreen] = useState(false);
  // Track which needsInput tasks have been opened so we can show a notification dot
  const seenTaskIdsRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (selectedId) seenTaskIdsRef.current.add(selectedId);
  }, [selectedId]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropZoneOver, setDropZoneOver] = useState(false);
  // Drop-between-cards indicator: which card is being hovered and which half
  const [dropTarget, setDropTarget] = useState<{ id: string; position: "before" | "after" } | null>(null);
  const [routingDecision, setRoutingDecision] = useState<{ scope: ScopeResult; goal: string } | null>(null);
  const [gsdGuardrail, setGsdGuardrail] = useState<{ scope: ScopeResult; goal: string } | null>(null);
  const [showNewGoalPanel, setShowNewGoalPanel] = useState(false);
  const createTaskAction = useTaskStore((s) => s.createTask);
  // Scope data for a task that needs project planning in the detail panel
  const [pendingScope, setPendingScope] = useState<{ taskId: string; scope: ScopeResult; goal: string } | null>(null);

  // ── Drawer width (shared with DetailPanel so grid columns respond) ───
  const DRAWER_STORAGE_KEY = "command-centre.detail-drawer-width";
  const DRAWER_MIN = 480;
  const DRAWER_MAX_RATIO = 0.6; // never wider than 60% of viewport
  const [drawerWidth, setDrawerWidth] = useState<number | null>(null);
  const drawerDraggingRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(DRAWER_STORAGE_KEY);
    const initial = stored ? parseInt(stored, 10) : NaN;
    const maxW = Math.floor(window.innerWidth * DRAWER_MAX_RATIO);
    const fallback = Math.max(DRAWER_MIN, Math.min(maxW, window.innerWidth - 396));
    const next = !Number.isNaN(initial) ? Math.min(maxW, initial) : fallback;
    setDrawerWidth(Math.max(DRAWER_MIN, next));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!drawerDraggingRef.current) return;
      const maxW = Math.floor(window.innerWidth * DRAWER_MAX_RATIO);
      const next = Math.max(
        DRAWER_MIN,
        Math.min(maxW, window.innerWidth - e.clientX)
      );
      setDrawerWidth(next);
    };
    const onUp = () => {
      if (!drawerDraggingRef.current) return;
      drawerDraggingRef.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      setDrawerWidth((w) => {
        if (w != null) {
          try {
            window.localStorage.setItem(DRAWER_STORAGE_KEY, String(w));
          } catch { /* ignore */ }
        }
        return w;
      });
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const startDrawerDrag = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    drawerDraggingRef.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  const toggleSelect = useCallback((id: string) => {
    setShowNewGoalPanel(false);
    setSelectedId((prev) => {
      if (prev === id) {
        setDetailFullscreen(false);
        return null;
      }
      return id;
    });
  }, []);

  // Drop-between-cards reorder: given a dragged task id, the target card id
  // in the level list, and a position ("before" or "after"), compute a new
  // columnOrder that slots the dragged row into that gap. Effective order
  // is sorted DESC, so "before" means "higher rank" (bigger columnOrder).
  const dropCardAt = useCallback(async (
    draggedId: string,
    targetId: string,
    position: "before" | "after",
    levelTasks: Task[],
  ) => {
    if (draggedId === targetId) return;
    const targetIdx = levelTasks.findIndex((t) => t.id === targetId);
    if (targetIdx < 0) return;

    const orderOf = (t: Task) =>
      t.columnOrder && t.columnOrder > 0 ? t.columnOrder : new Date(t.updatedAt).getTime();

    // Neighbor on the other side of the drop gap (may be undefined at edges)
    const neighborIdx = position === "before" ? targetIdx - 1 : targetIdx + 1;
    const neighbor = levelTasks[neighborIdx];
    const target = levelTasks[targetIdx];

    const targetOrder = orderOf(target);
    let nextOrder: number;
    if (!neighbor) {
      // Dropping at the very top/bottom of the level
      nextOrder = position === "before" ? targetOrder + 1000 : targetOrder - 1000;
    } else {
      const neighborOrder = orderOf(neighbor);
      nextOrder = Math.round((targetOrder + neighborOrder) / 2);
      // Guarantee strict movement even when the midpoint collapses
      if (nextOrder === targetOrder || nextOrder === neighborOrder) {
        nextOrder = position === "before" ? targetOrder + 1 : targetOrder - 1;
      }
    }
    await updateTask(draggedId, { columnOrder: nextOrder });
  }, [updateTask]);

  const activeClientSlugs = useClientStore((s) => s.activeClientSlugs);
  const isClientActive = useClientStore((s) => s.isClientActive);
  const clients = useClientStore((s) => s.clients);
  const rootName = useClientStore((s) => s.rootName);

  const filtered = useMemo(() => {
    // null = "All", [] = nothing selected (empty board)
    if (activeClientSlugs !== null && activeClientSlugs.length === 0) return [];
    return tasks.filter((t) => {
      // Multi-select client filtering
      if (activeClientSlugs !== null) {
        const slug = t.clientId || "_root";
        if (!activeClientSlugs.includes(slug)) return false;
      }
      if (isTerminalTask(t)) return false;
      return true;
    });
  }, [tasks, activeClientSlugs]);

  // Slugs of projects (or GSD roots) that have a materialized parent row in
  // the feed. Any sibling task sharing that slug should be hidden from the
  // top-level feed and only appear inside the project parent's drill-in.
  const projectParentSlugs = useMemo(() => {
    const set = new Set<string>();
    for (const t of filtered) {
      if (!t.parentId && (t.level === "project" || t.level === "gsd") && t.projectSlug) {
        set.add(t.projectSlug);
      }
    }
    return set;
  }, [filtered]);

  const topLevelTasks = useMemo(() => {
    return filtered.filter((t) => {
      if (t.parentId) return false;
      // Hide flat siblings of a project parent (wizard subtasks, manual
      // Level-1 tasks tagged with the project slug, etc.).
      if (
        t.projectSlug &&
        projectParentSlugs.has(t.projectSlug) &&
        t.level !== "project" &&
        t.level !== "gsd"
      ) {
        return false;
      }
      return true;
    });
  }, [filtered, projectParentSlugs]);

  // Effective ordering: manual columnOrder wins; otherwise fall back to
  // createdAt timestamp so new tasks append at the bottom (stable order).
  const effectiveOrder = useCallback((t: Task) => {
    return t.columnOrder && t.columnOrder > 0 ? t.columnOrder : new Date(t.createdAt).getTime();
  }, []);

  const activeGoals = useMemo(() => {
    return topLevelTasks
      .filter((t) => t.status !== "done")
      .sort((a, b) => effectiveOrder(a) - effectiveOrder(b));
  }, [topLevelTasks, effectiveOrder]);

  const achievedGoals = useMemo(() => {
    return topLevelTasks
      .filter((t) => t.status === "done")
      .sort((a, b) => {
        const aTime = a.completedAt ? new Date(a.completedAt).getTime() : new Date(a.updatedAt).getTime();
        const bTime = b.completedAt ? new Date(b.completedAt).getTime() : new Date(b.updatedAt).getTime();
        return bTime - aTime;
      });
  }, [topLevelTasks]);

  // ── 3-column bucketing: inProgress / inReview / done ──────────
  const isInReview = useCallback((t: Task): boolean => {
    return effectiveNeedsInput(t, filtered);
  }, [filtered]);

  const bucketedLanes = useMemo(() => {
    const allTopLevel = [...activeGoals, ...achievedGoals];

    // Group by clientSlug
    const byClient = new Map<string, Task[]>();
    for (const t of allTopLevel) {
      const key = t.clientId || "_root";
      if (!byClient.has(key)) byClient.set(key, []);
      byClient.get(key)!.push(t);
    }

    const lanes: SwimLane[] = [];

    for (const [slug, tasks] of byClient) {
      const client = slug !== "_root" ? clients.find((c) => c.slug === slug) : null;
      const inProgress: Task[] = [];
      const inReview: Task[] = [];
      const done: Task[] = [];

      for (const t of tasks) {
        // User explicitly marked done → always in done column, even if children still need input
        if (t.status === "done") {
          done.push(t);
        } else if (isInReview(t)) {
          inReview.push(t);
        } else {
          inProgress.push(t);
        }
      }

      // Sort "Your Turn" so needsInput tasks float to the top (newest first)
      inReview.sort((a, b) => {
        const aNeed = taskNeedsInput(a) ? 0 : 1;
        const bNeed = taskNeedsInput(b) ? 0 : 1;
        if (aNeed !== bNeed) return aNeed - bNeed;
        // Within needsInput group, newest first (by updatedAt)
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });

      lanes.push({
        clientSlug: slug === "_root" ? null : slug,
        clientName: client?.name || (slug === "_root" ? rootName : slug),
        clientColor: client?.color || "#999",
        inProgress,
        inReview,
        done,
      });
    }

    // Show swim lane headers when multiple clients have active or review tasks
    // (done-only lanes don't count — they shouldn't trigger headers by themselves)
    const lanesWithActiveWork = lanes.filter((l) => l.inProgress.length > 0 || l.inReview.length > 0);
    const singleLane = lanesWithActiveWork.length <= 1 && lanes.length <= 1;

    return { lanes, singleLane };
  }, [activeGoals, achievedGoals, activeClientSlugs, clients, isInReview]);

  const [dropOverColumn, setDropOverColumn] = useState<"inProgress" | "inReview" | "done" | null>(null);

  const selectedTask = (selectedId ? tasks.find((t) => t.id === selectedId) : null) ?? null;

  // If a subtask is selected, find the project parent so we can hoist the
  // parent card (with the subtask row highlighted) rather than the bare
  // subtask. Falls back to the selected task itself if no parent exists.
  const focusCardTask = useMemo(() => {
    if (!selectedTask) return null;
    if (!selectedTask.parentId && selectedTask.level !== "task") return selectedTask;
    if (selectedTask.parentId) {
      const parent = tasks.find((t) => t.id === selectedTask.parentId);
      if (parent) return parent;
    }
    if (selectedTask.projectSlug) {
      const projectParent = tasks.find(
        (t) => !t.parentId && t.projectSlug === selectedTask.projectSlug && (t.level === "project" || t.level === "gsd")
      );
      if (projectParent) return projectParent;
    }
    return selectedTask;
  }, [selectedTask, tasks]);


  const handleDragStart = useCallback((id: string, e: React.DragEvent) => {
    setDraggingId(id);
    setSelectedId(null);
    setDetailFullscreen(false);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggingId(null);
    setDropZoneOver(false);
    setDropTarget(null);
    setDropOverColumn(null);
  }, []);

  const handleDropColumn = useCallback((column: "inProgress" | "inReview" | "done", e: React.DragEvent) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain") || draggingId;
    if (!id) return;
    console.log(`[feed-view] handleDropColumn: column=${column}, id=${id?.slice(0,8)}`);
    if (column === "done") {
      updateTask(id, { status: "done", needsInput: false, errorMessage: null, completedAt: new Date().toISOString() });
    } else if (column === "inReview") {
      // Moving to review means it needs input
      updateTask(id, { status: "running", needsInput: true, completedAt: null });
    } else {
      // Moving to in-progress: re-queue and clear review/done state
      updateTask(id, { status: "queued", needsInput: false, errorMessage: null, completedAt: null });
    }
    setDraggingId(null);
    setDropZoneOver(false);
    setDropOverColumn(null);
  }, [draggingId, updateTask]);

  const handleDragOverColumn = useCallback((_column: "inProgress" | "inReview" | "done", e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDropOverColumn(_column);
    setDropZoneOver(true);
  }, []);

  const handleDragLeaveColumn = useCallback((_column: "inProgress" | "inReview" | "done") => {
    setDropOverColumn((prev) => prev === _column ? null : prev);
  }, []);

  const fetchClients = useClientStore((s) => s.fetchClients);
  const selectedClientId = useClientStore((s) => s.selectedClientId);
  const fetchTasks = useTaskStore((s) => s.fetchTasks);
  const syncProjects = useTaskStore((s) => s.syncProjects);

  const cronJobs = useCronStore((s) => s.jobs);
  const fetchCronJobs = useCronStore((s) => s.fetchJobs);

  const [recentOutputs, setRecentOutputs] = useState<RecentOutput[]>([]);

  const fetchRecentOutputs = useCallback(async () => {
    try {
      const params = new URLSearchParams({ limit: "30" });
      // Use single active client for output filtering when available
      if (activeClientSlugs && activeClientSlugs.length === 1 && activeClientSlugs[0] !== "_root") {
        params.set("clientId", activeClientSlugs[0]);
      }
      const res = await fetch(`/api/files/recent?${params}`);
      if (res.ok) setRecentOutputs(await res.json());
    } catch { /* ignore */ }
  }, [activeClientSlugs]);

  useEffect(() => { fetchClients(); }, [fetchClients]);
  useEffect(() => { fetchCronJobs(); }, [fetchCronJobs]);
  useEffect(() => { fetchRecentOutputs(); }, [fetchRecentOutputs]);
  // Sync active project briefs → task records on mount
  useEffect(() => { syncProjects(); }, [syncProjects]);

  // Click-to-deselect: if click lands on a "blank" area (not inside a card, button, or input), deselect
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (!selectedId) return;
    const target = e.target as HTMLElement;
    // Check if click is inside an interactive element
    if (target.closest("[data-card], button, input, textarea, a, [role='button']")) return;
    setSelectedId(null);
  }, [selectedId]);

  // When the drawer is open, push the page content left so it doesn't sit
  // underneath the fixed-position drawer.
  const feedMarginRight = (selectedTask || showNewGoalPanel) && drawerWidth ? drawerWidth + 12 : 0;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        marginRight: feedMarginRight || undefined,
        transition: drawerDraggingRef.current ? undefined : "margin-right 200ms ease",
      }}
      onDragEnd={handleDragEnd}
      onMouseDown={handleBackdropClick}
    >
      {/* Unified toolbar: client filters + New Goal */}
      <ClientFilterBar
        onNewGoal={() => {
          setSelectedId(null);
          setDetailFullscreen(false);
          setShowNewGoalPanel(true);
        }}
      />

      {routingDecision && (
        <RoutingDecisionCard
          goal={routingDecision.goal}
          decision={{
            level: routingDecision.scope.level,
            confidence: routingDecision.scope.confidence,
            reasoning: routingDecision.scope.questions?.[0]?.prompt,
            bullets: routingDecision.scope.suggestedSubtasks?.map((s) => s.title),
            overlaps: routingDecision.scope.overlaps?.map((o) => ({
              taskId: o.slug,
              title: o.name,
            })),
            clarifications: routingDecision.scope.questions?.map((q) => q.prompt),
          }}
          onProceed={async () => {
            const { scope, goal } = routingDecision;
            if (scope.level === "task") {
              const firstLine = goal.split("\n")[0];
              const title = firstLine.length <= 60
                ? firstLine
                : firstLine.slice(0, 57).replace(/\s+\S*$/, "") + "...";
              await createTaskAction(title, goal, "task");
              setRoutingDecision(null);
            } else if (scope.level === "project") {
              // Create a placeholder parent task, open it, and show wizard inline
              const firstLine = goal.split("\n")[0];
              const title = firstLine.length <= 60
                ? firstLine
                : firstLine.slice(0, 57).replace(/\s+\S*$/, "") + "...";
              const taskId = await createTaskAction(title, goal, "project", null, null, undefined, "backlog");
              if (taskId) {
                setPendingScope({ taskId, scope, goal });
                setSelectedId(taskId);
              }
              setRoutingDecision(null);
            } else if (scope.level === "gsd") {
              setGsdGuardrail({ scope, goal });
              setRoutingDecision(null);
            }
          }}
          onChangeLevel={() => {
            setRoutingDecision(null);
            setShowNewGoalPanel(true);
          }}
          onDismiss={() => setRoutingDecision(null)}
        />
      )}

      {gsdGuardrail && (
        <GsdGuardrailModal
          open
          scope={gsdGuardrail.scope}
          goal={gsdGuardrail.goal}
          clientId={selectedClientId ?? undefined}
          onClose={() => setGsdGuardrail(null)}
          onCreated={async () => {
            setGsdGuardrail(null);
            await fetchTasks();
          }}
        />
      )}

      <KanbanBoard
        lanes={bucketedLanes.lanes}
        singleLane={bucketedLanes.singleLane}
        draggingId={draggingId}
        onDropColumn={handleDropColumn}
        onDragOverColumn={handleDragOverColumn}
        onDragLeaveColumn={handleDragLeaveColumn}
        dropOverColumn={dropOverColumn}
        isEmpty={activeGoals.length === 0 && achievedGoals.length === 0}
        hideDone={false}
        renderCard={(task, column) => {
          const focusId = focusCardTask?.id ?? null;
          const isFocus = task.id === focusId;
          const allColTasks = column === "done"
            ? achievedGoals
            : column === "inReview"
            ? bucketedLanes.lanes.flatMap((l) => l.inReview)
            : activeGoals;
          const dropIndicator =
            dropTarget && dropTarget.id === task.id && draggingId && draggingId !== task.id
              ? dropTarget.position
              : null;
          return (
            <GoalCard
              key={task.id}
              task={task}
              allTasks={filtered}
              clients={clients}
              isSelected={isFocus}
              dimmed={!!focusId && !isFocus}
              isDragging={draggingId === task.id}
              dropIndicator={dropIndicator}
              unseen={taskNeedsInput(task) && !seenTaskIdsRef.current.has(task.id)}
              onSelect={toggleSelect}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragOverCard={(id, position) => {
                if (!draggingId || draggingId === id) {
                  setDropTarget(null);
                  return;
                }
                setDropTarget((prev) =>
                  prev && prev.id === id && prev.position === position
                    ? prev
                    : { id, position }
                );
              }}
              onDropOnCard={(id) => {
                if (!draggingId || draggingId === id) return;
                const position = dropTarget && dropTarget.id === id ? dropTarget.position : "after";
                // When dropping onto a card in a different column, change status too
                const draggedTask = filtered.find((t) => t.id === draggingId);
                if (draggedTask) {
                  const draggedColumn = draggedTask.status === "done" ? "done"
                    : effectiveNeedsInput(draggedTask, filtered) ? "inReview" : "inProgress";
                  if (draggedColumn !== column) {
                    // Cross-column drop: update status to match destination
                    if (column === "done") {
                      updateTask(draggingId, { status: "done", needsInput: false, errorMessage: null, completedAt: new Date().toISOString() });
                    } else if (column === "inReview") {
                      updateTask(draggingId, { status: "running", needsInput: true, completedAt: null });
                    } else {
                      updateTask(draggingId, { status: "queued", needsInput: false, errorMessage: null, completedAt: null });
                    }
                  }
                }
                dropCardAt(draggingId, id, position, allColTasks);
                setDraggingId(null);
                setDropTarget(null);
                setDropZoneOver(false);
              }}
              onMarkDone={(id) => {
                updateTask(id, { status: "done", needsInput: false, errorMessage: null, completedAt: new Date().toISOString() });
              }}
            />
          );
        }}
      />

      {/* Detail drawer — fixed-position overlay covering the full viewport
          height (including nav/goal bar). The feed content is pushed left
          via marginRight on the outermost wrapper. */}
      {/* New Goal panel — shown when creating, hidden when a task is selected */}
      {showNewGoalPanel && !selectedTask && (
        <NewGoalPanel
          drawerWidth={drawerWidth}
          onClose={() => setShowNewGoalPanel(false)}
          onCreated={(taskId) => {
            setShowNewGoalPanel(false);
            setSelectedId(taskId);
          }}
          onStartDrawerDrag={startDrawerDrag}
        />
      )}

      {selectedTask && (
        <DetailPanel
          task={selectedTask}
          onClose={() => { setSelectedId(null); setDetailFullscreen(false); setPendingScope(null); }}
          onMarkDone={(id) => {
            updateTask(id, { status: "done", needsInput: false, errorMessage: null, completedAt: new Date().toISOString() });
            setSelectedId(null);
            setDetailFullscreen(false);
          }}
          onSelectSubtask={(id) => setSelectedId(id)}
          onNavigateToParent={(parentId) => setSelectedId(parentId)}
          isFullscreen={detailFullscreen}
          onToggleFullscreen={() => setDetailFullscreen((v) => !v)}
          drawerWidth={drawerWidth}
          onStartDrawerDrag={startDrawerDrag}
          pendingScope={pendingScope?.taskId === selectedTask.id ? { scope: pendingScope.scope, goal: pendingScope.goal } : null}
          onScopeComplete={async () => {
            setPendingScope(null);
            await syncProjects();
            await fetchTasks();
          }}
        />
      )}
    </div>
  );
}

function ResumeClipButton({ sessionId }: { sessionId: string }) {
  const [copied, setCopied] = useState(false);
  const command = `claude --resume ${sessionId}`;

  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(command);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      title={command}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "3px 7px",
        fontSize: 10,
        fontFamily: "'DM Mono', monospace",
        fontWeight: 500,
        border: "1px solid",
        borderColor: copied ? "rgba(107, 142, 107, 0.3)" : "rgba(147, 69, 42, 0.2)",
        borderRadius: 4,
        background: copied ? "rgba(107, 142, 107, 0.08)" : "rgba(147, 69, 42, 0.06)",
        color: copied ? "#6B8E6B" : "#93452A",
        cursor: "pointer",
        transition: "all 150ms ease",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        if (!copied) e.currentTarget.style.background = "rgba(147, 69, 42, 0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = copied
          ? "rgba(107, 142, 107, 0.08)"
          : "rgba(147, 69, 42, 0.06)";
      }}
    >
      {copied ? <Copy size={10} /> : <Terminal size={10} />}
      {copied ? "copied" : "resume"}
    </button>
  );
}

const SUGGESTED_ACTIONS = [
  {
    label: "Manage skills",
    prompt: "I want to work with skills. Show me what's currently installed with `bash scripts/list-skills.sh`, then ask me whether I want to: (1) install a new skill from the catalog, (2) edit or improve an existing skill, or (3) import/create a brand new skill from scratch. Use /meta-skill-creator for editing or creating skills.",
  },
  {
    label: "Create a scheduled task",
    prompt: "/ops-cron Create a new scheduled cron job. Ask me what I want to automate and how often it should run.",
  },
  {
    label: "Use a skill...",
    prompt: "List all my installed skills with `bash scripts/list-skills.sh` and briefly describe what each one does, so I can pick one to use.",
  },
  {
    label: "Connect to your apps (MCP)...",
    prompt: "I want to connect an external app via MCP. Show me what MCP servers are currently configured in .claude/settings.json, and help me add a new one. Ask which app or service I want to connect.",
  },
  {
    label: "Add a client",
    prompt: "I want to add a new client. Ask me for the client name, then run `bash scripts/add-client.sh` with it.",
  },
  {
    label: "Perform some research",
    prompt: "/str-trending-research Research what's trending in my industry. Ask me what topic or niche to focus on.",
  },
];

function SuggestedActions({
  status,
  onSelect,
}: {
  status: string;
  onSelect: (prompt: string) => void;
}) {
  if (status === "running") {
    return (
      <div style={{
        fontSize: 13,
        color: "#999",
        fontFamily: "'DM Mono', monospace",
        padding: "12px 0",
      }}>
        Working...
      </div>
    );
  }

  return (
    <div style={{ padding: "16px 0" }}>
      <div style={{
        fontSize: 10,
        fontFamily: "'DM Mono', monospace",
        color: "#9C9CA0",
        textTransform: "uppercase" as const,
        letterSpacing: "0.06em",
        marginBottom: 8,
      }}>
        Get started
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {SUGGESTED_ACTIONS.map((action) => (
          <button
            key={action.label}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(action.prompt);
            }}
            style={{
              display: "block",
              width: "100%",
              padding: "7px 10px",
              fontSize: 12,
              fontFamily: "'DM Mono', monospace",
              fontWeight: 500,
              border: "1px solid rgba(218, 193, 185, 0.15)",
              borderRadius: 6,
              backgroundColor: "transparent",
              color: "#5E5E65",
              cursor: "pointer",
              textAlign: "left" as const,
              transition: "all 120ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(147, 69, 42, 0.04)";
              e.currentTarget.style.borderColor = "rgba(218, 193, 185, 0.4)";
              e.currentTarget.style.color = "#93452A";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.borderColor = "rgba(218, 193, 185, 0.15)";
              e.currentTarget.style.color = "#5E5E65";
            }}
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
