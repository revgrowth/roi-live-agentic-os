"use client";

import { useCallback, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronRight,
  Clock,
  Eye,
  FileText,
  Inbox,
  Loader2,
  Play,
  Plus,
  RotateCcw,
} from "lucide-react";
import type { LogEntry, OutputFile, Task } from "@/types/task";
import { useTaskStore } from "@/store/task-store";
import { LevelBadge } from "@/components/board/level-badge";
import { ModalChat } from "./modal-chat";
import { ReplyInput } from "./reply-input";

type StatusKey = "backlog" | "queued" | "running" | "review" | "done";

const statusConfig: Record<
  StatusKey,
  { icon: typeof CheckCircle2; color: string; label: string }
> = {
  backlog: { icon: Inbox, color: "#9C9CA0", label: "Backlog" },
  queued: { icon: Clock, color: "#9C9CA0", label: "Queued" },
  running: { icon: Loader2, color: "#93452A", label: "Running" },
  review: { icon: Eye, color: "#B25D3F", label: "Needs review" },
  done: { icon: CheckCircle2, color: "#6B8E6B", label: "Done" },
};

function getPendingQuestionPreview(
  child: Task,
  childLogs: LogEntry[],
): string | null {
  if (!child.needsInput) return null;
  for (let i = childLogs.length - 1; i >= 0; i--) {
    const e = childLogs[i];
    if (e.type === "question" && !e.questionAnswers) {
      return e.content.slice(0, 120);
    }
    if (e.type === "structured_question" && !e.questionAnswers) {
      return e.content.slice(0, 120) || "Claude is asking for structured input.";
    }
  }
  return "Waiting for your reply";
}

async function runTask(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/tasks/${id}/execute`, { method: "POST" });
    return res.ok;
  } catch {
    return false;
  }
}

interface ProjectDashboardProps {
  task: Task;
  childTasks: Task[];
  childLogEntries: Record<string, LogEntry[]>;
  logEntries: LogEntry[];
  isRunning: boolean;
  needsInput: boolean;
  status: string;
  showReplyInput: boolean;
  onViewSubtask: (childId: string) => void;
  onOptimisticReply: (entry: LogEntry) => void;
  onPreviewFile: (file: OutputFile) => void;
  onOpenBrief?: () => void;
  briefDescription: string | null;
}

// Width of the right-side subtasks rail in the two-column layout. On
// narrow viewports the flex-wrap collapses it below the conversation.
const SUBTASKS_RAIL_BASIS = 300;

export function ProjectDashboard({
  task,
  childTasks,
  childLogEntries,
  logEntries,
  isRunning,
  needsInput,
  status,
  showReplyInput,
  onViewSubtask,
  onOptimisticReply,
  onPreviewFile,
  onOpenBrief,
  briefDescription,
}: ProjectDashboardProps) {
  const updateTask = useTaskStore((s) => s.updateTask);
  const createTask = useTaskStore((s) => s.createTask);

  const [showAddSubtask, setShowAddSubtask] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [creatingSubtask, setCreatingSubtask] = useState(false);

  const backlogChildren = useMemo(
    () => childTasks.filter((c) => c.status === "backlog"),
    [childTasks],
  );

  // Flat merged timeline — parent's own log plus every child's full log,
  // sorted by timestamp. Children resume into the parent's session so
  // this is a single continuous conversation; rendering every entry as
  // a "parent" log entry keeps bubble styling identical for parent and
  // child authored messages.
  const mergedConversation = useMemo(() => {
    const merged: LogEntry[] = [...logEntries];
    for (const child of childTasks) {
      merged.push(...(childLogEntries[child.id] ?? []));
    }
    merged.sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );
    return merged;
  }, [logEntries, childTasks, childLogEntries]);

  const doneCount = childTasks.filter((c) => c.status === "done").length;

  const handleRun = useCallback(
    async (child: Task) => {
      const ok = await runTask(child.id);
      if (!ok) {
        // Fallback to direct status flip (matches the old Queue button pattern)
        await updateTask(child.id, { status: "queued" });
      }
    },
    [updateTask],
  );

  const handleRunAll = useCallback(async () => {
    for (const child of backlogChildren) {
      const ok = await runTask(child.id);
      if (!ok) {
        await updateTask(child.id, { status: "queued" });
      }
    }
  }, [backlogChildren, updateTask]);

  const handleAddSubtask = useCallback(async () => {
    const title = newSubtaskTitle.trim();
    if (!title || creatingSubtask) return;
    if (!task.projectSlug) return;
    setCreatingSubtask(true);
    try {
      await createTask(title, null, "task", task.projectSlug, task.id);
      setNewSubtaskTitle("");
      setShowAddSubtask(false);
    } finally {
      setCreatingSubtask(false);
    }
  }, [newSubtaskTitle, creatingSubtask, task.id, task.projectSlug, createTask]);

  const total = childTasks.length;

  return (
    <div
      className="dp-parent-split-modal"
      style={{
        flex: 1,
        display: "grid",
        gridTemplateColumns: `minmax(0, 1fr) minmax(240px, ${SUBTASKS_RAIL_BASIS}px)`,
        overflow: "hidden",
        minHeight: 0,
        minWidth: 0,
        containerType: "inline-size",
      } as React.CSSProperties}
    >
      {/* RIGHT rail — brief + subtasks. Placed in grid column 2. */}
      <div
        style={{
          gridColumn: 2,
          gridRow: 1,
          minWidth: 0,
          minHeight: 0,
          overflowY: "auto",
          padding: "16px 24px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          borderLeft: "1px solid #EAE8E6",
        }}
      >
        {/* Goal / brief strip */}
        {(briefDescription || onOpenBrief) && (
          <div
            style={{
              padding: "12px 14px",
              backgroundColor: "#FCFBFA",
              border: "1px solid #EAE8E6",
              borderRadius: 8,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            {briefDescription && (
              <div
                style={{
                  fontSize: 13,
                  fontFamily: "var(--font-inter), Inter, sans-serif",
                  color: "#1B1C1B",
                  lineHeight: 1.5,
                }}
              >
                {briefDescription}
              </div>
            )}
            {onOpenBrief && (
              <button
                onClick={onOpenBrief}
                style={{
                  alignSelf: "flex-start",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "2px 0",
                  border: "none",
                  background: "transparent",
                  color: "#93452A",
                  fontSize: 12,
                  fontWeight: 500,
                  fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                  cursor: "pointer",
                }}
              >
                <FileText size={12} />
                Open brief
              </button>
            )}
          </div>
        )}

        {/* Subtasks section header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span
              style={{
                fontSize: 11,
                fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                fontWeight: 600,
                color: "#5E5E65",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Subtasks
            </span>
            {total > 0 && (
              <span
                style={{
                  fontSize: 11,
                  fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                  color: "#9C9CA0",
                }}
              >
                {doneCount}/{total} done
              </span>
            )}
          </div>
          <button
            onClick={handleRunAll}
            disabled={backlogChildren.length === 0}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "5px 10px",
              border: "1px solid rgba(147, 69, 42, 0.3)",
              borderRadius: 6,
              backgroundColor:
                backlogChildren.length === 0 ? "#F6F3F1" : "rgba(147, 69, 42, 0.06)",
              color: backlogChildren.length === 0 ? "#9C9CA0" : "#93452A",
              fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
              fontSize: 11,
              fontWeight: 600,
              cursor: backlogChildren.length === 0 ? "default" : "pointer",
              transition: "background-color 120ms ease",
            }}
          >
            <Play size={11} />
            Run all
          </button>
        </div>

        {/* Subtask rows */}
        {total === 0 ? (
          <div
            style={{
              padding: "16px",
              fontSize: 13,
              fontFamily: "var(--font-inter), Inter, sans-serif",
              color: "#9C9CA0",
              fontStyle: "italic",
              textAlign: "center",
              border: "1px dashed #EAE8E6",
              borderRadius: 8,
            }}
          >
            No subtasks yet. Add one below or talk to Claude in Project chat.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {childTasks.map((child) => {
              const cfgKey = (statusConfig[child.status as StatusKey] ? child.status : "backlog") as StatusKey;
              const cfg = statusConfig[cfgKey];
              const Icon = cfg.icon;
              const needs = child.needsInput === true;
              const questionPreview = getPendingQuestionPreview(
                child,
                childLogEntries[child.id] || [],
              );
              const canRun =
                child.status === "backlog" ||
                child.status === "review" ||
                child.status === "done";
              const runLabel =
                child.status === "backlog"
                  ? "Run"
                  : child.status === "review"
                  ? "Requeue"
                  : "Rerun";
              const RunIcon = child.status === "backlog" ? Play : RotateCcw;

              return (
                <div
                  key={child.id}
                  onClick={() => onViewSubtask(child.id)}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    padding: "10px 12px",
                    border: needs
                      ? "1px solid rgba(147, 69, 42, 0.4)"
                      : "1px solid #EAE8E6",
                    borderRadius: 8,
                    backgroundColor: needs ? "#FFF5F0" : "#FFFFFF",
                    cursor: "pointer",
                    transition: "background 120ms ease, border-color 120ms ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = needs ? "#FFEDE3" : "#FCFBFA";
                    e.currentTarget.style.borderColor = needs
                      ? "rgba(147, 69, 42, 0.55)"
                      : "rgba(147, 69, 42, 0.25)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = needs ? "#FFF5F0" : "#FFFFFF";
                    e.currentTarget.style.borderColor = needs
                      ? "rgba(147, 69, 42, 0.4)"
                      : "#EAE8E6";
                  }}
                >
                  <Icon
                    size={16}
                    style={{
                      color: cfg.color,
                      flexShrink: 0,
                      marginTop: 2,
                      animation:
                        child.status === "running"
                          ? "spin 1.2s linear infinite"
                          : undefined,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        minWidth: 0,
                      }}
                    >
                      <span
                        style={{
                          flex: 1,
                          minWidth: 0,
                          fontSize: 13,
                          fontWeight: 500,
                          fontFamily: "var(--font-inter), Inter, sans-serif",
                          color: "#1B1C1B",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {child.title}
                      </span>
                      {child.level === "gsd" && child.phaseNumber != null ? (
                        <span
                          style={{
                            fontSize: 10,
                            fontFamily:
                              "var(--font-space-grotesk), Space Grotesk, sans-serif",
                            fontWeight: 600,
                            padding: "2px 6px",
                            borderRadius: 4,
                            backgroundColor: "#F5F3FF",
                            color: "#6D28D9",
                            flexShrink: 0,
                          }}
                        >
                          Phase {child.phaseNumber}
                          {child.gsdStep ? ` · ${child.gsdStep}` : ""}
                        </span>
                      ) : (
                        <LevelBadge level={child.level} />
                      )}
                    </div>
                    {questionPreview && (
                      <div
                        style={{
                          marginTop: 4,
                          fontSize: 12,
                          fontFamily: "var(--font-inter), Inter, sans-serif",
                          color: "#93452A",
                          fontStyle: "italic",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {needs && "↳ "}
                        {questionPreview}
                      </div>
                    )}
                    {!questionPreview && child.activityLabel && child.status !== "done" && (
                      <div
                        style={{
                          marginTop: 2,
                          fontSize: 11,
                          fontFamily: "var(--font-inter), Inter, sans-serif",
                          color: "#9C9CA0",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {child.activityLabel}
                      </div>
                    )}
                  </div>
                  {canRun && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRun(child);
                      }}
                      title={runLabel}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        padding: "4px 8px",
                        border: "1px solid rgba(147, 69, 42, 0.25)",
                        borderRadius: 5,
                        backgroundColor: "#FFFFFF",
                        color: "#93452A",
                        fontSize: 11,
                        fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                        fontWeight: 600,
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                    >
                      <RunIcon size={10} />
                      {runLabel}
                    </button>
                  )}
                  <ChevronRight
                    size={14}
                    style={{ color: "#9C9CA0", flexShrink: 0, marginTop: 4 }}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Add subtask */}
        {showAddSubtask ? (
          <div style={{ display: "flex", gap: 6 }}>
            <input
              autoFocus
              type="text"
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSubtask();
                } else if (e.key === "Escape") {
                  setShowAddSubtask(false);
                  setNewSubtaskTitle("");
                }
              }}
              placeholder="New subtask title..."
              style={{
                flex: 1,
                fontSize: 13,
                fontFamily: "var(--font-inter), Inter, sans-serif",
                padding: "8px 10px",
                backgroundColor: "#FFFFFF",
                border: "1px solid rgba(147, 69, 42, 0.35)",
                borderRadius: 6,
                color: "#1B1C1B",
                outline: "none",
              }}
            />
            <button
              onClick={handleAddSubtask}
              disabled={!newSubtaskTitle.trim() || creatingSubtask || !task.projectSlug}
              title={!task.projectSlug ? "Save the project brief first" : undefined}
              style={{
                padding: "0 12px",
                border: "none",
                borderRadius: 6,
                background: newSubtaskTitle.trim() && !creatingSubtask
                  ? "linear-gradient(135deg, #93452A, #B25D3F)"
                  : "#EAE8E6",
                color: newSubtaskTitle.trim() && !creatingSubtask ? "#FFFFFF" : "#9C9CA0",
                fontSize: 12,
                fontWeight: 600,
                fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                cursor: newSubtaskTitle.trim() && !creatingSubtask ? "pointer" : "default",
              }}
            >
              Add
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAddSubtask(true)}
            disabled={!task.projectSlug}
            title={!task.projectSlug ? "Save the project brief first" : undefined}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 12px",
              border: "1px dashed #EAE8E6",
              borderRadius: 8,
              background: "transparent",
              color: "#9C9CA0",
              fontSize: 12,
              fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
              fontWeight: 500,
              cursor: task.projectSlug ? "pointer" : "not-allowed",
              alignSelf: "flex-start",
              transition: "color 120ms ease, border-color 120ms ease",
            }}
            onMouseEnter={(e) => {
              if (!task.projectSlug) return;
              e.currentTarget.style.color = "#93452A";
              e.currentTarget.style.borderColor = "rgba(147, 69, 42, 0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#9C9CA0";
              e.currentTarget.style.borderColor = "#EAE8E6";
            }}
          >
            <Plus size={12} />
            Add subtask
          </button>
        )}
      </div>

      {/* LEFT column — aggregated project conversation in grid column 1. */}
      <div
        style={{
          gridColumn: 1,
          gridRow: 1,
          minHeight: 0,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <ModalChat
          taskId={task.id}
          logEntries={mergedConversation}
          isRunning={isRunning}
          needsInput={needsInput}
          status={status}
          childTasks={[]}
          childLogEntries={{}}
          activePreviewPath={null}
          onPreviewFile={(f) => {
            onPreviewFile({
              id: `chat-preview-${f.relativePath}`,
              taskId: task.id,
              fileName: f.fileName,
              filePath: f.relativePath,
              relativePath: f.relativePath,
              extension: f.extension,
              sizeBytes: null,
              createdAt: new Date().toISOString(),
            });
          }}
          durationMs={task.durationMs}
        />
        {/* Reply input — parents can keep the project conversation going
            (run /gsd:plan-phase, reply to scoping questions, etc.). The
            plan-first toggle is hidden since parents have their own planning
            built in. */}
        <ReplyInput
          taskId={task.id}
          isVisible={showReplyInput || needsInput || isRunning || status === "review" || status === "done" || status === "running"}
          needsInput={needsInput}
          taskStatus={status}
          initialPermissionMode={task.permissionMode ?? "bypassPermissions"}
          initialModel={task.model ?? null}
          onOptimisticReply={onOptimisticReply}
        />
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
