"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
  AlertCircle, FileText, Eye, CheckCircle2, Clock, Loader2, Inbox,
  ChevronRight, ChevronDown, MessageSquare, Wrench, Plus, Play,
  ArrowUp,
} from "lucide-react";
import type { Task, TaskUpdateInput, OutputFile, LogEntry } from "@/types/task";
import { useTaskStore } from "@/store/task-store";
import { TaskProgress } from "./task-progress";

const statusConfig: Record<string, { icon: typeof CheckCircle2; color: string; bg: string; label: string }> = {
  backlog: { icon: Inbox, color: "#5E5E65", bg: "#F3F0EE", label: "In Backlog" },
  queued: { icon: Clock, color: "#5E5E65", bg: "#F3F0EE", label: "Queued" },
  running: { icon: Loader2, color: "#93452A", bg: "#FFF5F0", label: "Running" },
  review: { icon: Eye, color: "#B25D3F", bg: "#FFF5F0", label: "Needs Review" },
  done: { icon: CheckCircle2, color: "#6B8E6B", bg: "#F0F7F0", label: "Complete" },
};

function formatDuration(ms: number): string {
  const sec = Math.floor(ms / 1000);
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

function formatTokens(tokens: number): string {
  if (tokens >= 1000) return `${(tokens / 1000).toFixed(1)}k`;
  return tokens.toString();
}

/** Extract a condensed chat log: text messages + tool summaries + skill invocations */
function buildChatDigest(logEntries: LogEntry[]): { type: "text" | "tools" | "question" | "reply" | "skill"; label: string; time: string }[] {
  const digest: { type: "text" | "tools" | "question" | "reply" | "skill"; label: string; time: string }[] = [];
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
      const name = (entry.toolName || "").toLowerCase();

      // Surface Skill invocations as distinct entries
      if (name === "skill" && entry.toolArgs) {
        flushTools();
        try {
          const args = JSON.parse(entry.toolArgs);
          const skillName = args.skill || args.name || "unknown";
          digest.push({ type: "skill", label: `Invoked /${skillName}`, time: entry.timestamp });
        } catch {
          digest.push({ type: "skill", label: "Invoked skill", time: entry.timestamp });
        }
        continue;
      }

      if (!pendingTools) pendingTools = { reads: 0, writes: 0, actions: 0, lastTime: entry.timestamp };
      pendingTools.lastTime = entry.timestamp;
      if (["read", "glob", "grep", "webfetch", "websearch"].includes(name)) pendingTools.reads++;
      else if (["write", "edit"].includes(name)) pendingTools.writes++;
      else pendingTools.actions++;
      continue;
    }

    // Non-tool entry — flush any pending tools first
    flushTools();

    if (entry.type === "text" && entry.content.length > 30) {
      const truncated = entry.content.length > 120
        ? entry.content.slice(0, 120).trimEnd() + "…"
        : entry.content;
      digest.push({ type: "text", label: truncated, time: entry.timestamp });
    } else if (entry.type === "question") {
      const truncated = entry.content.length > 120
        ? entry.content.slice(0, 120).trimEnd() + "…"
        : entry.content;
      digest.push({ type: "question", label: truncated, time: entry.timestamp });
    } else if (entry.type === "user_reply") {
      const truncated = entry.content.length > 80
        ? entry.content.slice(0, 80).trimEnd() + "…"
        : entry.content;
      digest.push({ type: "reply", label: truncated, time: entry.timestamp });
    }
  }

  flushTools();
  return digest;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", hour12: false });
}

interface SectionHeaderProps {
  label: string;
  count?: number;
  onClick?: () => void;
}

function SectionHeader({ label, count, onClick }: SectionHeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span
          style={{
            fontSize: 11,
            fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "#9C9CA0",
            fontWeight: 600,
          }}
        >
          {label}
        </span>
        {count !== undefined && (
          <span
            style={{
              fontSize: 11,
              fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
              color: "#5E5E65",
            }}
          >
            ({count})
          </span>
        )}
      </div>
      {onClick && (
        <button
          onClick={onClick}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 12,
            fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
            color: "#93452A",
            fontWeight: 500,
            padding: "2px 4px",
          }}
        >
          View all <ChevronRight size={12} />
        </button>
      )}
    </div>
  );
}

export function ModalSummaryTab({
  task,
  logEntries,
  onDrillChat,
  onDrillOutputs,
  onFileClick,
  onViewSubtask,
}: {
  task: Task;
  logEntries: LogEntry[];
  onDrillChat: () => void;
  onDrillOutputs: () => void;
  onFileClick: (file: OutputFile) => void;
  onViewSubtask?: (childId: string) => void;
}) {
  const allOutputFiles = useTaskStore((s) => s.outputFiles);
  const outputFiles = allOutputFiles[task.id] ?? [];
  const fetchOutputFiles = useTaskStore((s) => s.fetchOutputFiles);
  const getChildTasks = useTaskStore((s) => s.getChildTasks);
  const createTask = useTaskStore((s) => s.createTask);
  const updateTask = useTaskStore((s) => s.updateTask);
  const isParent = task.level !== "task";
  const childTasks = isParent ? getChildTasks(task.id) : [];

  // Fetch output files for parent + all children
  useEffect(() => {
    fetchOutputFiles(task.id);
    if (isParent) {
      childTasks.forEach((child) => fetchOutputFiles(child.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task.id, fetchOutputFiles, isParent, childTasks.length]);

  // Aggregate: parent outputs + child outputs grouped by child
  const childOutputGroups = isParent
    ? childTasks
        .map((child) => ({
          child,
          files: allOutputFiles[child.id] ?? [],
        }))
        .filter((g) => g.files.length > 0)
    : [];
  const totalOutputCount = outputFiles.length + childOutputGroups.reduce((sum, g) => sum + g.files.length, 0);

  const cfg = statusConfig[task.status] || statusConfig.backlog;
  const StatusIcon = cfg.icon;
  const isRunning = task.status === "running";
  const hasStarted = task.status !== "backlog" && task.status !== "queued";
  const chatDigest = buildChatDigest(logEntries);

  // Subtask progress metrics
  const completedChildren = childTasks.filter((c) => c.status === "done").length;
  const runningChildren = childTasks.filter((c) => c.status === "running").length;
  const reviewChildren = childTasks.filter((c) => c.status === "review").length;

  return (
    <div style={{ flex: 1, overflowY: "auto" }}>
      {/* Status banner */}
      <div
        style={{
          margin: "24px 24px 0 24px",
          padding: "16px 20px",
          backgroundColor: cfg.bg,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <StatusIcon
          size={24}
          color={cfg.color}
          style={{
            flexShrink: 0,
            animation: isRunning ? "spin-slow 2s linear infinite" : undefined,
          }}
        />
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
              color: cfg.color,
            }}
          >
            {cfg.label}
          </div>
          {task.status === "review" && (
            <div style={{ fontSize: 12, fontFamily: "var(--font-inter), Inter, sans-serif", color: "#5E5E65", marginTop: 2 }}>
              Claude has finished — check the outputs and mark as done.
            </div>
          )}
          {isRunning && task.activityLabel && (
            <div style={{ fontSize: 12, fontFamily: "var(--font-inter), Inter, sans-serif", color: "#5E5E65", marginTop: 2 }}>
              {task.activityLabel}
            </div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      {hasStarted && (
        <div style={{ margin: "0 24px" }}>
          <TaskProgress logEntries={logEntries} status={task.status} startedAt={task.startedAt} noBorder />
        </div>
      )}

      {/* Stats grid */}
      <div style={{ padding: "16px 24px 0 24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12,
          }}
        >
          <StatChip label="Status" value={cfg.label} color={cfg.color} />
          <StatChip
            label="Duration"
            value={task.durationMs !== null ? formatDuration(task.durationMs) : "--"}
          />
          <StatChip
            label="Cost"
            value={task.costUsd !== null ? `$${task.costUsd.toFixed(2)}` : "$0.00"}
          />
          <StatChip
            label="Tokens"
            value={task.tokensUsed !== null ? formatTokens(task.tokensUsed) : "--"}
          />
        </div>
      </div>

      {/* Project brief link */}
      {task.projectSlug && (
        <div style={{ padding: "16px 24px 0 24px" }}>
          <SectionHeader label="Project" />
          <button
            onClick={() => {
              // Open brief.md as a file preview
              onFileClick({
                id: `brief-${task.projectSlug}`,
                taskId: task.id,
                fileName: "brief.md",
                filePath: `projects/briefs/${task.projectSlug}/brief.md`,
                relativePath: `projects/briefs/${task.projectSlug}/brief.md`,
                extension: "md",
                sizeBytes: null,
                createdAt: task.createdAt,
              });
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 8,
              backgroundColor: "#F0F7F0",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
              width: "100%",
              transition: "background 150ms ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#E4F0E4"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#F0F7F0"; }}
          >
            <FileText size={16} style={{ color: "#6B8E6B", flexShrink: 0 }} />
            <span
              style={{
                fontSize: 13,
                fontWeight: 500,
                fontFamily: "var(--font-inter), Inter, sans-serif",
                color: "#1B1C1B",
                flex: 1,
              }}
            >
              {task.projectSlug} — brief.md
            </span>
            <ChevronRight size={14} color="#6B8E6B" />
          </button>
        </div>
      )}

      {/* Subtask progress metrics */}
      {isParent && childTasks.length > 0 && (
        <div style={{ padding: "16px 24px 0 24px" }}>
          <SectionHeader label="Progress" />
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div
              style={{
                flex: 1,
                height: 6,
                backgroundColor: "#EAE8E6",
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${childTasks.length > 0 ? (completedChildren / childTasks.length) * 100 : 0}%`,
                  backgroundColor: "#6B8E6B",
                  borderRadius: 3,
                  transition: "width 300ms ease",
                }}
              />
            </div>
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                color: "#1B1C1B",
                flexShrink: 0,
              }}
            >
              {completedChildren}/{childTasks.length}
            </span>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {completedChildren > 0 && (
              <span style={{ fontSize: 12, fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif", color: "#6B8E6B", fontWeight: 500 }}>
                {completedChildren} complete
              </span>
            )}
            {runningChildren > 0 && (
              <span style={{ fontSize: 12, fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif", color: "#93452A", fontWeight: 500 }}>
                {runningChildren} running
              </span>
            )}
            {reviewChildren > 0 && (
              <span style={{ fontSize: 12, fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif", color: "#B25D3F", fontWeight: 500 }}>
                {reviewChildren} awaiting review
              </span>
            )}
            {childTasks.length - completedChildren - runningChildren - reviewChildren > 0 && (
              <span style={{ fontSize: 12, fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif", color: "#9C9CA0", fontWeight: 500 }}>
                {childTasks.length - completedChildren - runningChildren - reviewChildren} pending
              </span>
            )}
          </div>
        </div>
      )}

      {/* Subtasks for project/gsd */}
      {isParent && (
        <div style={{ padding: "20px 24px 0 24px" }}>
          <SectionHeader label="Subtasks" count={childTasks.length} />
          {childTasks.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {childTasks.map((child) => (
                <ExpandableSubtaskRow
                  key={child.id}
                  child={child}
                  onViewFull={onViewSubtask ? (id: string) => onViewSubtask(id) : undefined}
                  updateTask={updateTask}
                />
              ))}
            </div>
          ) : (
            <div
              style={{
                padding: "12px 0",
                textAlign: "center",
                color: "#9C9CA0",
                fontSize: 13,
                fontFamily: "var(--font-inter), Inter, sans-serif",
              }}
            >
              No subtasks yet
            </div>
          )}
          <ModalSubtaskInput parentId={task.id} projectSlug={task.projectSlug} createTask={createTask} />
        </div>
      )}

      {/* Output files (parent + aggregated child outputs) */}
      <div style={{ padding: "20px 24px 0 24px" }}>
        <SectionHeader
          label="Output Files"
          count={totalOutputCount}
          onClick={totalOutputCount > 0 ? onDrillOutputs : undefined}
        />

        {totalOutputCount === 0 ? (
          <div
            style={{
              padding: "16px 0",
              textAlign: "center",
              color: "#9C9CA0",
              fontSize: 13,
              fontFamily: "var(--font-inter), Inter, sans-serif",
            }}
          >
            {isRunning ? "Files will appear here as they're created..." : "No output files"}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {/* Parent's own outputs */}
            {outputFiles.slice(0, 4).map((file) => (
              <OutputFileRow key={file.id} file={file} onFileClick={onFileClick} />
            ))}
            {outputFiles.length > 4 && (
              <button
                onClick={onDrillOutputs}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 12,
                  fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                  color: "#93452A",
                  fontWeight: 500,
                  padding: "6px 0",
                  textAlign: "center",
                }}
              >
                +{outputFiles.length - 4} more files
              </button>
            )}

            {/* Child task output groups */}
            {childOutputGroups.map(({ child, files }) => (
              <div key={`child-outputs-${child.id}`} style={{ marginTop: outputFiles.length > 0 ? 8 : 0 }}>
                <div
                  style={{
                    fontSize: 11,
                    fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                    color: "#9C9CA0",
                    fontWeight: 500,
                    marginBottom: 4,
                    paddingLeft: 2,
                  }}
                >
                  From: {child.title}
                </div>
                {files.slice(0, 3).map((file) => (
                  <OutputFileRow key={file.id} file={file} onFileClick={onFileClick} />
                ))}
                {files.length > 3 && (
                  <button
                    onClick={onDrillOutputs}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 11,
                      fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                      color: "#93452A",
                      fontWeight: 500,
                      padding: "4px 0",
                      textAlign: "center",
                    }}
                  >
                    +{files.length - 3} more
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chat log digest */}
      <div style={{ padding: "20px 24px 0 24px" }}>
        <SectionHeader
          label="Activity"
          count={logEntries.length > 0 ? logEntries.length : undefined}
          onClick={logEntries.length > 0 ? onDrillChat : undefined}
        />

        {chatDigest.length === 0 ? (
          <div
            style={{
              padding: "16px 0",
              textAlign: "center",
              color: "#9C9CA0",
              fontSize: 13,
              fontFamily: "var(--font-inter), Inter, sans-serif",
            }}
          >
            {isRunning ? "Activity will appear here..." : "No activity yet"}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {chatDigest.slice(-8).map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                  padding: "6px 0",
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                    color: "#9C9CA0",
                    minWidth: 40,
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  {formatTime(item.time)}
                </span>
                <DigestIcon type={item.type} />
                <span
                  style={{
                    fontSize: 13,
                    fontFamily: "var(--font-inter), Inter, sans-serif",
                    color: item.type === "tools" ? "#5E5E65" : item.type === "reply" || item.type === "skill" ? "#93452A" : "#1B1C1B",
                    fontWeight: item.type === "question" || item.type === "skill" ? 500 : 400,
                    lineHeight: 1.4,
                    flex: 1,
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical" as const,
                  }}
                >
                  {item.label}
                </span>
              </div>
            ))}
            {chatDigest.length > 8 && (
              <button
                onClick={onDrillChat}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 12,
                  fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                  color: "#93452A",
                  fontWeight: 500,
                  padding: "6px 0",
                  textAlign: "center",
                }}
              >
                View full conversation
              </button>
            )}
          </div>
        )}
      </div>

      {/* Description (collapsed at bottom) */}
      {task.description && (
        <div style={{ padding: "20px 24px 0 24px" }}>
          <SectionHeader label="Description" />
          <p
            style={{
              fontSize: 13,
              fontFamily: "var(--font-inter), Inter, sans-serif",
              color: "#5E5E65",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            {task.description}
          </p>
        </div>
      )}

      {/* Error */}
      {task.errorMessage && (
        <div
          style={{
            margin: "20px 24px 0 24px",
            padding: "14px 16px",
            backgroundColor: "#FFF5F3",
            borderRadius: 8,
            display: "flex",
            alignItems: "flex-start",
            gap: 8,
          }}
        >
          <AlertCircle size={16} color="#C04030" style={{ flexShrink: 0, marginTop: 1 }} />
          <span style={{ fontSize: 13, fontFamily: "var(--font-inter), Inter, sans-serif", color: "#C04030", lineHeight: 1.4 }}>
            {task.errorMessage}
          </span>
        </div>
      )}

      {/* Bottom padding */}
      <div style={{ height: 24 }} />

      <style>{`
        @keyframes spin-slow {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function StatChip({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div
      style={{
        backgroundColor: "#F6F3F1",
        borderRadius: 8,
        padding: "10px 12px",
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: "#9C9CA0",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 16,
          fontWeight: 700,
          fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
          color: color || "#1B1C1B",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function DigestIcon({ type }: { type: "text" | "tools" | "question" | "reply" | "skill" }) {
  const size = 14;
  const style = { flexShrink: 0, marginTop: 2 } as const;

  switch (type) {
    case "text":
      return <MessageSquare size={size} color="#5E5E65" style={style} />;
    case "tools":
      return <Wrench size={size} color="#9C9CA0" style={style} />;
    case "skill":
      return <Play size={size} color="#93452A" style={style} />;
    case "question":
      return <Eye size={size} color="#93452A" style={style} />;
    case "reply":
      return <MessageSquare size={size} color="#93452A" style={style} />;
  }
}

function ModalSubtaskInput({
  parentId,
  projectSlug,
  createTask,
}: {
  parentId: string;
  projectSlug: string | null;
  createTask: (title: string, description: string | null, level: "task" | "project" | "gsd", projectSlug?: string | null, parentId?: string | null) => Promise<void>;
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  const handleSubmit = async () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setValue("");
    await createTask(trimmed, null, "task", projectSlug, parentId);
  };

  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 12,
          fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
          color: "#9C9CA0",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "8px 0",
          marginTop: 4,
        }}
      >
        <Plus size={12} />
        Add subtask
      </button>
    );
  }

  return (
    <div style={{ marginTop: 8 }}>
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSubmit();
          if (e.key === "Escape") { setIsAdding(false); setValue(""); }
        }}
        onBlur={() => {
          if (!value.trim()) { setIsAdding(false); setValue(""); }
        }}
        placeholder="Subtask title..."
        style={{
          width: "100%",
          fontSize: 13,
          fontFamily: "var(--font-inter), Inter, sans-serif",
          padding: "8px 10px",
          border: "1px solid rgba(218, 193, 185, 0.4)",
          borderRadius: 6,
          outline: "none",
          backgroundColor: "#FAFAF9",
          color: "#1B1C1B",
        }}
      />
    </div>
  );
}

function ExpandableSubtaskRow({
  child,
  onViewFull,
  updateTask,
}: {
  child: Task;
  onViewFull?: (id: string) => void;
  updateTask: (id: string, updates: TaskUpdateInput) => Promise<void>;
}) {
  const [expanded, setExpanded] = useState(false);
  const childLogEntries = useTaskStore((s) => s.logEntries[child.id]) ?? [];
  const fetchLogEntries = useTaskStore((s) => s.fetchLogEntries);

  // Fetch log entries when expanded
  useEffect(() => {
    if (expanded) {
      fetchLogEntries(child.id);
    }
  }, [expanded, child.id, fetchLogEntries]);

  const childDigest = expanded ? buildChatDigest(childLogEntries) : [];
  const lastEntry = childLogEntries.length > 0 ? childLogEntries[childLogEntries.length - 1] : null;
  const needsReply = lastEntry?.type === "question";
  const childCfg = statusConfig[child.status] || statusConfig.backlog;

  return (
    <div>
      {/* Row header — click to expand/collapse */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 10px",
          borderRadius: expanded ? "6px 6px 0 0" : 6,
          backgroundColor: expanded ? "#EDE8E5" : "#F6F3F1",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          width: "100%",
          transition: "background 150ms ease",
        }}
        onMouseEnter={(e) => { if (!expanded) e.currentTarget.style.backgroundColor = "#EDE8E5"; }}
        onMouseLeave={(e) => { if (!expanded) e.currentTarget.style.backgroundColor = "#F6F3F1"; }}
      >
        {expanded
          ? <ChevronDown size={12} color="#5E5E65" style={{ flexShrink: 0 }} />
          : <ChevronRight size={12} color="#5E5E65" style={{ flexShrink: 0 }} />
        }
        <span
          style={{
            display: "inline-block",
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: childCfg.color,
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontSize: 13,
            fontWeight: 500,
            fontFamily: "var(--font-inter), Inter, sans-serif",
            color: "#1B1C1B",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flex: 1,
          }}
        >
          {child.title}
        </span>
        <span
          style={{
            fontSize: 10,
            fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
            color: "#9C9CA0",
            textTransform: "capitalize",
          }}
        >
          {child.status}
        </span>
        {child.status === "backlog" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              updateTask(child.id, { status: "queued" });
            }}
            title="Queue this task"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              padding: "4px 8px",
              borderRadius: 4,
              border: "none",
              backgroundColor: "rgba(147, 69, 42, 0.08)",
              color: "#93452A",
              cursor: "pointer",
              fontSize: 11,
              fontWeight: 500,
              fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
              flexShrink: 0,
              transition: "background 100ms ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(147, 69, 42, 0.2)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(147, 69, 42, 0.08)"; }}
          >
            <Play size={10} />
            Queue
          </button>
        )}
        {child.status !== "done" ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              updateTask(child.id, { status: "done", completedAt: new Date().toISOString() });
            }}
            title="Mark as done"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              padding: "4px 8px",
              borderRadius: 4,
              border: "none",
              backgroundColor: "rgba(107, 142, 107, 0.08)",
              color: "#6B8E6B",
              cursor: "pointer",
              fontSize: 11,
              fontWeight: 500,
              fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
              flexShrink: 0,
              transition: "background 100ms ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(107, 142, 107, 0.2)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(107, 142, 107, 0.08)"; }}
          >
            <CheckCircle2 size={10} />
            Done
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              updateTask(child.id, { status: "backlog" });
            }}
            title="Undo — move back to backlog"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              padding: "4px 8px",
              borderRadius: 4,
              border: "none",
              backgroundColor: "rgba(156, 156, 160, 0.08)",
              color: "#9C9CA0",
              cursor: "pointer",
              fontSize: 11,
              fontWeight: 500,
              fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
              flexShrink: 0,
              transition: "background 100ms ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(156, 156, 160, 0.2)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(156, 156, 160, 0.08)"; }}
          >
            Undo
          </button>
        )}
      </button>

      {/* Expanded panel */}
      {expanded && (
        <div
          style={{
            backgroundColor: "#FAFAF9",
            borderRadius: "0 0 6px 6px",
            border: "1px solid #EDE8E5",
            borderTop: "none",
            padding: "10px 12px",
          }}
        >
          {/* Needs Review banner */}
          {child.status === "review" && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                backgroundColor: "#FFF5F0",
                borderRadius: 6,
                marginBottom: 10,
              }}
            >
              <Eye size={14} color="#B25D3F" />
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                  color: "#B25D3F",
                }}
              >
                Needs Review
              </span>
            </div>
          )}

          {/* Condensed activity digest */}
          {childDigest.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 1, marginBottom: needsReply ? 10 : 0 }}>
              {childDigest.slice(-5).map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 6,
                    padding: "3px 0",
                  }}
                >
                  <span
                    style={{
                      fontSize: 9,
                      fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                      color: "#9C9CA0",
                      minWidth: 36,
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    {formatTime(item.time)}
                  </span>
                  <DigestIcon type={item.type} />
                  <span
                    style={{
                      fontSize: 12,
                      fontFamily: "var(--font-inter), Inter, sans-serif",
                      color: item.type === "tools" ? "#5E5E65" : item.type === "reply" || item.type === "skill" ? "#93452A" : "#1B1C1B",
                      fontWeight: item.type === "question" || item.type === "skill" ? 500 : 400,
                      lineHeight: 1.4,
                      flex: 1,
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical" as const,
                    }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                fontSize: 12,
                color: "#9C9CA0",
                fontFamily: "var(--font-inter), Inter, sans-serif",
                padding: "4px 0",
              }}
            >
              No activity yet
            </div>
          )}

          {/* Inline reply if child needs input */}
          {needsReply && (
            <InlineReplyInput childId={child.id} />
          )}

          {/* View full link */}
          {onViewFull && <button
            onClick={() => onViewFull(child.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 11,
              fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
              color: "#93452A",
              fontWeight: 500,
              padding: "6px 0 0 0",
              marginTop: 4,
            }}
          >
            View full <ChevronRight size={10} />
          </button>}
        </div>
      )}
    </div>
  );
}

function InlineReplyInput({ childId }: { childId: string }) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const appendLogEntry = useTaskStore((s) => s.appendLogEntry);

  const handleSubmit = useCallback(async () => {
    const trimmed = message.trim();
    if (!trimmed || isSending) return;

    setIsSending(true);

    // Optimistic: add reply to log
    appendLogEntry(childId, {
      id: "local-" + crypto.randomUUID(),
      type: "user_reply",
      timestamp: new Date().toISOString(),
      content: trimmed,
    });

    setMessage("");

    try {
      const res = await fetch(`/api/tasks/${childId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      if (!res.ok) {
        console.error(`[inline-reply] Reply failed: ${res.status}`);
      }
    } catch {
      // Silently fail
    } finally {
      setIsSending(false);
    }
  }, [message, isSending, childId, appendLogEntry]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 0",
      }}
    >
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") { e.preventDefault(); handleSubmit(); }
        }}
        placeholder="Reply to Claude..."
        style={{
          flex: 1,
          fontSize: 12,
          fontFamily: "var(--font-inter), Inter, sans-serif",
          padding: "6px 10px",
          border: "1px solid rgba(218, 193, 185, 0.4)",
          borderRadius: 6,
          outline: "none",
          backgroundColor: "#FFFFFF",
          color: "#1B1C1B",
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = "#93452A"; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(218, 193, 185, 0.4)"; }}
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
          background: message.trim() && !isSending
            ? "linear-gradient(135deg, #93452A, #B25D3F)"
            : "#EAE8E6",
          color: message.trim() && !isSending ? "#FFFFFF" : "#5E5E65",
          cursor: message.trim() && !isSending ? "pointer" : "default",
          flexShrink: 0,
          transition: "background 150ms ease",
        }}
      >
        <ArrowUp size={14} />
      </button>
    </div>
  );
}

function OutputFileRow({ file, onFileClick }: { file: OutputFile; onFileClick: (file: OutputFile) => void }) {
  return (
    <button
      onClick={() => onFileClick(file)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 12px",
        borderRadius: 8,
        backgroundColor: "#F6F3F1",
        border: "none",
        cursor: "pointer",
        textAlign: "left",
        width: "100%",
        transition: "background 150ms ease",
        marginBottom: 2,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#EDE8E5"; }}
      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#F6F3F1"; }}
    >
      <FileText size={16} style={{ color: "#93452A", flexShrink: 0 }} />
      <span
        style={{
          fontSize: 13,
          fontWeight: 500,
          fontFamily: "var(--font-inter), Inter, sans-serif",
          color: "#1B1C1B",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          flex: 1,
        }}
      >
        {file.fileName}
      </span>
      <span
        style={{
          fontSize: 10,
          fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
          color: "#9C9CA0",
          backgroundColor: "#FFFFFF",
          padding: "2px 8px",
          borderRadius: 4,
          flexShrink: 0,
        }}
      >
        .{file.extension}
      </span>
    </button>
  );
}
