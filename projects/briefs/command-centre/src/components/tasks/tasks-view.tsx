"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  Clock,
  ArrowUp,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ExternalLink,
  Eye,
} from "lucide-react";
import { useTaskStore } from "@/store/task-store";
import type { Task, LogEntry } from "@/types/task";
import { LevelBadge } from "@/components/board/level-badge";

// ─── Formatters ──────────────────────────────────────────────────────────────

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

function formatElapsedLive(startedAt: string | null): string {
  if (!startedAt) return "...";
  const start = new Date(startedAt).getTime();
  if (isNaN(start)) return "...";
  const ms = Math.max(0, Date.now() - start);
  const sec = Math.floor(ms / 1000);
  if (sec < 60) return `${sec}s`;
  const min = Math.floor(sec / 60);
  const rem = sec % 60;
  if (min < 60) return `${min}m ${rem.toString().padStart(2, "0")}s`;
  const hr = Math.floor(min / 60);
  const remMin = min % 60;
  return `${hr}h ${remMin}m`;
}

/** Extract the action summary — what does the operator need to do? */
function getActionSummary(task: Task, logEntries: LogEntry[]): string | null {
  if (task.errorMessage) {
    return `Error: ${task.errorMessage.length > 120 ? task.errorMessage.slice(0, 120) + "..." : task.errorMessage}`;
  }

  // Find the last question Claude asked
  const lastQuestion = [...logEntries]
    .reverse()
    .find((e) => e.type === "question");
  if (lastQuestion) {
    const content = lastQuestion.content.trim();
    return content.length > 160 ? content.slice(0, 160).trimEnd() + "..." : content;
  }

  if (task.status === "review") {
    return "Claude has finished — review the outputs and mark as done.";
  }

  if (task.needsInput) {
    return "Claude is waiting for your input to continue.";
  }

  return null;
}

// ─── Inline reply ────────────────────────────────────────────────────────────

function InlineReply({ taskId }: { taskId: string }) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const appendLogEntry = useTaskStore((s) => s.appendLogEntry);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = useCallback(async () => {
    const trimmed = message.trim();
    if (!trimmed || isSending) return;
    setIsSending(true);

    const entry: LogEntry = {
      id: "local-" + crypto.randomUUID(),
      type: "user_reply",
      timestamp: new Date().toISOString(),
      content: trimmed,
    };
    appendLogEntry(taskId, entry);
    setMessage("");

    try {
      const res = await fetch(`/api/tasks/${taskId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      if (!res.ok) console.error("Reply failed:", await res.text());
    } catch (err) {
      console.error("Reply error:", err);
    } finally {
      setIsSending(false);
    }
  }, [message, isSending, taskId, appendLogEntry]);

  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        alignItems: "flex-end",
        padding: "12px 16px",
        backgroundColor: "#FFFAF8",
        borderRadius: 8,
        border: "1px solid rgba(210, 120, 60, 0.2)",
      }}
    >
      <textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
        placeholder="Reply to this task..."
        rows={1}
        style={{
          flex: 1,
          resize: "none",
          border: "none",
          outline: "none",
          backgroundColor: "transparent",
          fontFamily: "var(--font-inter), Inter, sans-serif",
          fontSize: 13,
          color: "#1B1C1B",
          lineHeight: "20px",
        }}
      />
      <button
        onClick={handleSubmit}
        disabled={!message.trim() || isSending}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 28,
          height: 28,
          borderRadius: 6,
          border: "none",
          backgroundColor: message.trim() ? "#93452A" : "#EAE8E6",
          color: message.trim() ? "#FFFFFF" : "#9C9CA0",
          cursor: message.trim() ? "pointer" : "default",
          flexShrink: 0,
          transition: "all 150ms ease",
        }}
      >
        <ArrowUp size={14} />
      </button>
    </div>
  );
}

// ─── Expanded detail ─────────────────────────────────────────────────────────

function TaskDetail({ task, parentTask }: { task: Task; parentTask: Task | null }) {
  const allLogEntries = useTaskStore((s) => s.logEntries);
  const fetchLogEntries = useTaskStore((s) => s.fetchLogEntries);
  const openPanel = useTaskStore((s) => s.openPanel);
  const logEntries = allLogEntries[task.id] ?? [];

  useEffect(() => {
    fetchLogEntries(task.id);
  }, [task.id, fetchLogEntries]);

  const recentEntries = logEntries
    .filter((e) => ["text", "question", "user_reply"].includes(e.type))
    .slice(-5);

  const needsHuman = task.status === "review" || task.needsInput === true;
  const actionSummary = getActionSummary(task, logEntries);

  return (
    <div
      style={{
        padding: "16px 20px 20px 52px",
        borderTop: "1px solid rgba(218, 193, 185, 0.15)",
        backgroundColor: "#FAFAF9",
      }}
    >
      {/* Action summary — the key thing the operator needs to know */}
      {actionSummary && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            padding: "12px 16px",
            backgroundColor: task.errorMessage ? "#FFF5F3" : "#FFFAF8",
            borderRadius: 8,
            border: `1px solid ${task.errorMessage ? "rgba(192, 64, 48, 0.15)" : "rgba(210, 120, 60, 0.15)"}`,
            marginBottom: 16,
          }}
        >
          {task.errorMessage ? (
            <AlertCircle size={14} color="#C04030" style={{ flexShrink: 0, marginTop: 2 }} />
          ) : (
            <Eye size={14} color="#D2783C" style={{ flexShrink: 0, marginTop: 2 }} />
          )}
          <div
            style={{
              fontSize: 13,
              fontFamily: "var(--font-inter), Inter, sans-serif",
              color: task.errorMessage ? "#C04030" : "#1B1C1B",
              lineHeight: "20px",
            }}
          >
            {actionSummary}
          </div>
        </div>
      )}

      {/* Description */}
      {task.description && (
        <div
          style={{
            fontSize: 13,
            color: "#5E5E65",
            fontFamily: "var(--font-inter), Inter, sans-serif",
            marginBottom: 12,
            lineHeight: "20px",
            whiteSpace: "pre-wrap",
            maxHeight: 80,
            overflow: "hidden",
          }}
        >
          {task.description}
        </div>
      )}

      {/* Recent activity log */}
      {recentEntries.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={sectionLabel}>Recent activity</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {recentEntries.map((entry) => (
              <div
                key={entry.id}
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "flex-start",
                  padding: "3px 0",
                }}
              >
                <span style={timeCell}>
                  {new Date(entry.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
                <DigestIcon type={entry.type as "text" | "question" | "reply"} />
                <div
                  style={{
                    fontSize: 13,
                    color: entry.type === "user_reply" ? "#93452A" : entry.type === "question" ? "#D2783C" : "#5E5E65",
                    fontFamily: "var(--font-inter), Inter, sans-serif",
                    fontWeight: entry.type === "question" ? 500 : 400,
                    lineHeight: "18px",
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical" as const,
                    flex: 1,
                  }}
                >
                  {entry.type === "user_reply" && (
                    <span style={{ fontWeight: 600, marginRight: 4 }}>You:</span>
                  )}
                  {entry.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reply input for tasks needing human action */}
      {needsHuman && <InlineReply taskId={task.id} />}

      {/* Open full detail */}
      <button
        onClick={() => openPanel(task.id)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          marginTop: 16,
          padding: "8px 16px",
          borderRadius: 8,
          border: "1px solid rgba(147, 69, 42, 0.2)",
          backgroundColor: "#FFFFFF",
          color: "#93452A",
          fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
          fontSize: 13,
          fontWeight: 500,
          cursor: "pointer",
          transition: "all 150ms ease",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#FFF5F0"; e.currentTarget.style.borderColor = "#93452A"; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#FFFFFF"; e.currentTarget.style.borderColor = "rgba(147, 69, 42, 0.2)"; }}
      >
        <ExternalLink size={13} />
        Open full detail
      </button>
    </div>
  );
}

function DigestIcon({ type }: { type: "text" | "question" | "reply" }) {
  const s = { flexShrink: 0, marginTop: 2 } as const;
  switch (type) {
    case "text": return <MessageSquare size={13} color="#5E5E65" style={s} />;
    case "question": return <Eye size={13} color="#D2783C" style={s} />;
    case "reply": return <MessageSquare size={13} color="#93452A" style={s} />;
  }
}

// ─── Task row ────────────────────────────────────────────────────────────────

function TaskRow({ task, parentTask }: { task: Task; parentTask: Task | null }) {
  const [expanded, setExpanded] = useState(false);
  const [, setTick] = useState(0);
  const allLogEntries = useTaskStore((s) => s.logEntries);
  const fetchLogEntries = useTaskStore((s) => s.fetchLogEntries);

  const isRunning = task.status === "running" && !task.needsInput;
  const needsHuman = task.status === "review" || task.needsInput === true;
  const hasError = task.errorMessage !== null;

  // Pre-fetch logs for action summary even when collapsed
  useEffect(() => {
    if (needsHuman || hasError) {
      fetchLogEntries(task.id);
    }
  }, [task.id, needsHuman, hasError, fetchLogEntries]);

  const logEntries = allLogEntries[task.id] ?? [];
  const actionSummary = (needsHuman || hasError) ? getActionSummary(task, logEntries) : null;

  // Tick for live elapsed time
  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [isRunning]);

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        border: needsHuman
          ? "1.5px dashed rgba(210, 120, 60, 0.5)"
          : hasError
            ? "1px solid rgba(192, 64, 48, 0.25)"
            : "1px solid rgba(218, 193, 185, 0.15)",
        overflow: "hidden",
        opacity: isRunning ? 0.75 : 1,
        transition: "all 150ms ease",
      }}
    >
      {/* Main row */}
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "14px 20px",
          cursor: "pointer",
          transition: "background 100ms ease",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(218, 193, 185, 0.06)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
      >
        {/* Expand chevron */}
        <span style={{ flexShrink: 0, color: "#9C9CA0" }}>
          {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </span>

        {/* Status indicator */}
        <span
          style={{
            display: "inline-block",
            width: 8,
            height: 8,
            borderRadius: "50%",
            flexShrink: 0,
            backgroundColor: needsHuman
              ? "#D2783C"
              : isRunning
                ? "#93452A"
                : hasError
                  ? "#C04030"
                  : "#6B8E6B",
            animation: (needsHuman || isRunning) ? "pulse-dot 2s ease-in-out infinite" : undefined,
          }}
        />

        {/* Title + parent breadcrumb + level */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                fontSize: 14,
                fontWeight: 500,
                fontFamily: "var(--font-inter), Inter, sans-serif",
                color: "#1B1C1B",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {task.title}
            </span>
            <LevelBadge level={task.level} />
          </div>
          {/* Parent breadcrumb */}
          {parentTask && (
            <div
              style={{
                fontSize: 11,
                fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                color: "#9C9CA0",
                marginTop: 2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              ↳ {parentTask.title}
            </div>
          )}
          {/* Action summary preview — visible when collapsed */}
          {!expanded && actionSummary && (
            <div
              style={{
                fontSize: 12,
                fontFamily: "var(--font-inter), Inter, sans-serif",
                color: hasError ? "#C04030" : "#D2783C",
                marginTop: 3,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {actionSummary}
            </div>
          )}
        </div>

        {/* Live status label */}
        <span
          style={{
            fontSize: 12,
            fontWeight: 500,
            fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
            color: needsHuman ? "#D2783C" : isRunning ? "#93452A" : hasError ? "#C04030" : "#6B8E6B",
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}
        >
          {needsHuman
            ? "Awaiting input"
            : isRunning
              ? task.activityLabel || "Working..."
              : hasError
                ? "Error"
                : "Done"}
        </span>

        {/* Time */}
        <span
          style={{
            fontSize: 11,
            color: "#9C9CA0",
            fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Clock size={11} />
          {isRunning ? formatElapsedLive(task.startedAt) : timeAgo(task.updatedAt)}
        </span>
      </div>

      {/* Expanded detail */}
      {expanded && <TaskDetail task={task} parentTask={parentTask} />}
    </div>
  );
}

// ─── Section header ──────────────────────────────────────────────────────────

function SectionHeader({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 10,
      }}
    >
      <span
        style={{
          display: "inline-block",
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: color,
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          color: "#1B1C1B",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 11,
          fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
          color: "#5E5E65",
          backgroundColor: "#EAE8E6",
          padding: "2px 10px",
          borderRadius: 10,
          fontWeight: 500,
        }}
      >
        {count}
      </span>
    </div>
  );
}

// ─── Main view ───────────────────────────────────────────────────────────────

export function TasksView() {
  const tasks = useTaskStore((s) => s.tasks);

  const taskById = new Map(tasks.map((t) => [t.id, t]));

  // Waiting on you: review, needsInput, or errors
  const waitingTasks = tasks
    .filter((t) => t.status === "review" || t.needsInput === true || t.errorMessage !== null)
    .sort((a, b) => {
      const aWeight = a.errorMessage ? 0 : (a.status === "review" || a.needsInput) ? 1 : 2;
      const bWeight = b.errorMessage ? 0 : (b.status === "review" || b.needsInput) ? 1 : 2;
      if (aWeight !== bWeight) return aWeight - bWeight;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  // Running in background: actively running (not needing input), exclude backlog
  const runningTasks = tasks
    .filter((t) => t.status === "running" && !t.needsInput && !t.errorMessage)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const isEmpty = waitingTasks.length === 0 && runningTasks.length === 0;

  return (
    <div>
      {isEmpty ? (
        <div
          style={{
            padding: "64px 24px",
            textAlign: "center",
            color: "#9C9CA0",
            fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
            fontSize: 14,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <CheckCircle2 size={32} color="#6B8E6B" strokeWidth={1.5} />
            <span>Nothing active right now</span>
          </div>
        </div>
      ) : (
        <>
          {/* Waiting on you */}
          {waitingTasks.length > 0 && (
            <div style={{ marginBottom: runningTasks.length > 0 ? 24 : 0 }}>
              <SectionHeader label="Waiting on you" count={waitingTasks.length} color="#D2783C" />
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {waitingTasks.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    parentTask={task.parentId ? taskById.get(task.parentId) ?? null : null}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Running in background */}
          {runningTasks.length > 0 && (
            <div>
              <SectionHeader label="Running" count={runningTasks.length} color="#93452A" />
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {runningTasks.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    parentTask={task.parentId ? taskById.get(task.parentId) ?? null : null}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Shared styles ───────────────────────────────────────────────────────────

const sectionLabel: React.CSSProperties = {
  fontSize: 11,
  fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: "#9C9CA0",
  fontWeight: 600,
  marginBottom: 8,
};

const timeCell: React.CSSProperties = {
  fontSize: 10,
  color: "#9C9CA0",
  fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
  flexShrink: 0,
  marginTop: 2,
  width: 40,
};
