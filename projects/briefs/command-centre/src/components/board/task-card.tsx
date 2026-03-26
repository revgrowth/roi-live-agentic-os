"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, Rocket, Clock, Plus, Play, Timer } from "lucide-react";
import type { Task, TaskStatus } from "@/types/task";
import { LevelBadge } from "./level-badge";
import { useTaskStore } from "@/store/task-store";
import { useClientStore } from "@/store/client-store";
import { OutputChips } from "./output-chips";

const statusColors: Record<TaskStatus, string> = {
  backlog: "#5E5E65",
  queued: "#5E5E65",
  running: "#93452A",
  review: "#B25D3F",
  done: "#6B8E6B",
};

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

function formatTokens(tokens: number): string {
  if (tokens >= 1000) return `${(tokens / 1000).toFixed(1)}k`;
  return tokens.toString();
}

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

function formatElapsedLive(startedAt: string | null): string {
  if (!startedAt) return "0s";
  const ms = Date.now() - new Date(startedAt).getTime();
  const sec = Math.floor(ms / 1000);
  if (sec < 60) return `${sec}s`;
  const min = Math.floor(sec / 60);
  const rem = sec % 60;
  if (min < 60) return `${min}m ${rem.toString().padStart(2, "0")}s`;
  const hr = Math.floor(min / 60);
  const remMin = min % 60;
  return `${hr}h ${remMin}m`;
}

function RunningState({ task }: { task: Task }) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ marginTop: 4 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 4,
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: "#93452A",
            animation: "pulse-dot 2s ease-in-out infinite",
            flexShrink: 0,
          }}
        />
        {task.activityLabel && (
          <span
            style={{
              fontSize: 12,
              color: "#5E5E65",
              fontStyle: "italic",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flex: 1,
            }}
          >
            {task.activityLabel}
          </span>
        )}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          fontSize: 11,
          color: "#5E5E65",
          fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
        }}
      >
        <Clock size={11} />
        <span>{formatElapsedLive(task.startedAt)}</span>
      </div>
    </div>
  );
}

export function TaskCard({ task, isOverlay }: { task: Task; isOverlay?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isTrashHovered, setIsTrashHovered] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const getChildTasks = useTaskStore((s) => s.getChildTasks);
  const createTask = useTaskStore((s) => s.createTask);
  const updateTask = useTaskStore((s) => s.updateTask);
  const deleteTask = useTaskStore((s) => s.deleteTask);
  const syncPhases = useTaskStore((s) => s.syncPhases);
  const outputFiles = useTaskStore((s) => s.outputFiles[task.id]) ?? [];
  const fetchOutputFiles = useTaskStore((s) => s.fetchOutputFiles);
  const openPanel = useTaskStore((s) => s.openPanel);
  const clients = useClientStore((s) => s.clients);
  const taskClient = task.clientId ? clients.find((c) => c.slug === task.clientId) : null;

  // Fetch output files for completed/review tasks
  useEffect(() => {
    if (task.status === "review" || task.status === "done") {
      fetchOutputFiles(task.id);
    }
  }, [task.status, task.id, fetchOutputFiles]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const dndTransform = CSS.Transform.toString(transform);
  const style = {
    transform: isOverlay ? "scale(1.03)" : dndTransform || undefined,
    transition: transition ?? "all 150ms ease",
    opacity: isDragging && !isOverlay ? 0.3 : 1,
  };

  // When dragging (original card position), render as a dashed placeholder
  if (isDragging && !isOverlay) {
    return (
      <div
        ref={setNodeRef}
        style={{
          ...style,
          border: "2px dashed rgba(218, 193, 185, 0.4)",
          borderRadius: 8,
          padding: 16,
          minHeight: 80,
          backgroundColor: "transparent",
        }}
        {...attributes}
        {...listeners}
      />
    );
  }

  const isRunning = task.status === "running";
  const isDone = task.status === "done";
  const hasError = task.errorMessage !== null;
  const borderColor = hasError ? "#C04030" : statusColors[task.status];

  const isParent = task.level !== "task";
  const childTasks = isParent ? getChildTasks(task.id) : [];
  const hasChildren = childTasks.length > 0;
  const completedChildren = childTasks.filter(
    (c) => c.status === "done"
  ).length;
  const runningChildren = childTasks.filter(
    (c) => c.status === "running"
  );
  const reviewChildren = childTasks.filter(
    (c) => c.status === "review"
  );

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        backgroundColor: hasError ? "#FFF5F3" : "#FFFFFF",
        border: `1px solid ${hasError ? "rgba(192, 64, 48, 0.25)" : "rgba(218, 193, 185, 0.2)"}`,
        borderLeft: `3px solid ${borderColor}`,
        borderRadius: 8,
        padding: 14,
        boxShadow: isOverlay
          ? "0 16px 40px rgba(147, 69, 42, 0.15)"
          : "none",
        cursor: isOverlay ? "grabbing" : "grab",
        userSelect: "none" as const,
        position: "relative" as const,
      }}
      onClick={() => openPanel(task.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...attributes}
      {...listeners}
    >
      {/* Hover actions: grab handle + delete */}
      {isHovered && !isDragging && (
        <div
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <GripVertical size={14} style={{ color: "#D1D5DB" }} />
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteTask(task.id);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseEnter={() => setIsTrashHovered(true)}
            onMouseLeave={() => setIsTrashHovered(false)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 2,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Trash2
              size={14}
              style={{ color: isTrashHovered ? "#C04030" : "#5E5E65" }}
            />
          </button>
        </div>
      )}

      {/* Title */}
      <div
        style={{
          fontSize: 14,
          fontWeight: 500,
          fontFamily: "var(--font-inter), Inter, sans-serif",
          color: "#1B1C1B",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          marginBottom: 8,
          paddingRight: 20,
        }}
      >
        {task.title}
      </div>

      {/* Badge row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 8,
          flexWrap: "wrap",
        }}
      >
        <LevelBadge level={task.level} />
        {task.cronJobSlug && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontSize: 11,
              fontWeight: 500,
              fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
              padding: "2px 8px",
              borderRadius: 4,
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              color: "#3B82F6",
              lineHeight: "16px",
            }}
          >
            <Timer size={10} />
            Cron
          </span>
        )}
        {taskClient && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontSize: 11,
              fontWeight: 500,
              fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
              padding: "2px 8px",
              borderRadius: 4,
              backgroundColor: `${taskClient.color}14`,
              color: taskClient.color,
              lineHeight: "16px",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: taskClient.color,
                flexShrink: 0,
              }}
            />
            {taskClient.name}
          </span>
        )}
        {task.projectSlug && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              fontSize: 11,
              fontWeight: 500,
              fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
              padding: "2px 8px",
              borderRadius: 4,
              backgroundColor: "rgba(107, 142, 107, 0.1)",
              color: "#4A7A4A",
              lineHeight: "16px",
            }}
          >
            {task.projectSlug}
          </span>
        )}
        {task.needsInput === true && (
          <span
            style={{
              display: "inline-block",
              fontSize: 11,
              fontWeight: 500,
              fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
              padding: "2px 8px",
              borderRadius: 4,
              backgroundColor: "rgba(178, 93, 63, 0.12)",
              color: "#B25D3F",
              lineHeight: "16px",
              animation: "pulse-badge 2s ease-in-out infinite",
            }}
          >
            Needs input
          </span>
        )}
        {hasError && (
          <span
            style={{
              display: "inline-block",
              fontSize: 11,
              fontWeight: 500,
              fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
              padding: "2px 8px",
              borderRadius: 4,
              backgroundColor: "rgba(192, 64, 48, 0.1)",
              color: "#C04030",
              lineHeight: "16px",
            }}
          >
            Error
          </span>
        )}
      </div>

      {/* GSD project link + sync button */}
      {task.level === "gsd" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 8,
          }}
        >
          <Link
            href="/gsd"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 10px",
              borderRadius: 6,
              backgroundColor: "rgba(147, 69, 42, 0.06)",
              color: "#93452A",
              fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
              fontSize: 12,
              fontWeight: 500,
              textDecoration: "none",
              transition: "background 150ms ease",
              flex: 1,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(147, 69, 42, 0.12)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(147, 69, 42, 0.06)"; }}
          >
            <Rocket size={12} />
            View Phases
          </Link>
          <button
            onClick={async (e) => {
              e.stopPropagation();
              setIsSyncing(true);
              try { await syncPhases(task.id); } finally { setIsSyncing(false); }
            }}
            onPointerDown={(e) => e.stopPropagation()}
            disabled={isSyncing}
            style={{
              padding: "6px 10px",
              borderRadius: 6,
              border: "1px solid rgba(147, 69, 42, 0.2)",
              backgroundColor: "transparent",
              color: "#93452A",
              fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
              fontSize: 12,
              fontWeight: 500,
              cursor: isSyncing ? "not-allowed" : "pointer",
              opacity: isSyncing ? 0.6 : 1,
              whiteSpace: "nowrap",
            }}
          >
            {isSyncing ? "Syncing..." : "Sync Phases"}
          </button>
        </div>
      )}

      {/* Running state: pulsing dot + activity + elapsed time */}
      {isRunning && (
        <RunningState task={task} />
      )}

      {/* Error message preview */}
      {hasError && (
        <div
          style={{
            fontSize: 12,
            color: "#C04030",
            marginTop: 4,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical" as const,
          }}
        >
          {task.errorMessage}
        </div>
      )}

      {/* Bottom row: timestamp + cost */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 8,
        }}
      >
        <span
          style={{
            fontSize: 12,
            color: "#5E5E65",
            fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
          }}
        >
          {timeAgo(task.updatedAt)}
        </span>
        <div
          style={{
            display: "flex",
            gap: 8,
            fontSize: 12,
            color: "#5E5E65",
            fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
          }}
        >
          {isDone && task.durationMs !== null && (
            <span>{formatDuration(task.durationMs)}</span>
          )}
          {isDone && task.costUsd !== null && (
            <span>${task.costUsd.toFixed(2)}</span>
          )}
        </div>
      </div>

      {/* Output file chips — link to Docs */}
      <OutputChips files={outputFiles} />

      {/* Child tasks + expand for project/gsd */}
      {isParent && (
        <div style={{ marginTop: 8 }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 12,
              fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
              color: "#5E5E65",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <span
              style={{
                display: "inline-block",
                transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
                transition: "transform 150ms",
                fontSize: 10,
              }}
            >
              &#9654;
            </span>
            <span>
              {hasChildren ? `${completedChildren}/${childTasks.length} tasks` : "0 tasks"}
            </span>
          </button>

          {/* Progress bar */}
          {hasChildren && (
            <div
              style={{
                marginTop: 6,
                height: 4,
                backgroundColor: "#EAE8E6",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${(completedChildren / childTasks.length) * 100}%`,
                  background: "linear-gradient(135deg, #93452A 0%, #B25D3F 100%)",
                  borderRadius: 2,
                  transition: "width 300ms ease",
                }}
              />
            </div>
          )}

          {/* Subtask status indicators — always visible when collapsed */}
          {(runningChildren.length > 0 || reviewChildren.length > 0) && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                marginTop: 8,
              }}
            >
              {runningChildren.length > 0 && (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    fontSize: 11,
                    fontWeight: 500,
                    fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                    padding: "3px 8px",
                    borderRadius: 6,
                    backgroundColor: "rgba(147, 69, 42, 0.08)",
                    color: "#93452A",
                    lineHeight: "16px",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      backgroundColor: "#93452A",
                      animation: "pulse-dot 2s ease-in-out infinite",
                      flexShrink: 0,
                    }}
                  />
                  {runningChildren.length === 1
                    ? runningChildren[0].title.length > 20
                      ? runningChildren[0].title.slice(0, 20) + "..."
                      : runningChildren[0].title
                    : `${runningChildren.length} running`}
                </div>
              )}
              {reviewChildren.length > 0 && (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    fontSize: 11,
                    fontWeight: 500,
                    fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                    padding: "3px 8px",
                    borderRadius: 6,
                    backgroundColor: "#FFF5F0",
                    color: "#93452A",
                    border: "1px solid rgba(147, 69, 42, 0.2)",
                    lineHeight: "16px",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      backgroundColor: "#B25D3F",
                      flexShrink: 0,
                    }}
                  />
                  {reviewChildren.length === 1
                    ? "1 awaiting review"
                    : `${reviewChildren.length} awaiting review`}
                </div>
              )}
            </div>
          )}

          {expanded && (
            <div style={{ marginTop: 8, paddingLeft: 4 }}>
              {childTasks.map((child) => (
                <div
                  key={child.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    openPanel(child.id);
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "4px 4px",
                    borderRadius: 4,
                    cursor: "pointer",
                    transition: "background 100ms ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(218, 193, 185, 0.15)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      backgroundColor: statusColors[child.status],
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 12,
                      color: "#5E5E65",
                      fontFamily: "var(--font-inter), Inter, sans-serif",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      flex: 1,
                    }}
                  >
                    {child.title}
                  </span>
                  {child.gsdStep && (
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 500,
                        fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                        padding: "1px 5px",
                        borderRadius: 3,
                        backgroundColor: "rgba(94, 94, 101, 0.08)",
                        color: "#5E5E65",
                        flexShrink: 0,
                      }}
                    >
                      {child.gsdStep}
                    </span>
                  )}
                  {child.status === "backlog" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateTask(child.id, { status: "queued" });
                      }}
                      onPointerDown={(e) => e.stopPropagation()}
                      title="Queue this task"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 20,
                        height: 20,
                        borderRadius: 4,
                        border: "none",
                        backgroundColor: "rgba(147, 69, 42, 0.08)",
                        color: "#93452A",
                        cursor: "pointer",
                        flexShrink: 0,
                        transition: "background 100ms ease",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(147, 69, 42, 0.2)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(147, 69, 42, 0.08)"; }}
                    >
                      <Play size={10} />
                    </button>
                  )}
                </div>
              ))}
              <InlineSubtaskInput
                parentId={task.id}
                projectSlug={task.projectSlug}
                createTask={createTask}
              />
            </div>
          )}
        </div>
      )}

    </div>
  );
}

function InlineSubtaskInput({
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
        onClick={(e) => {
          e.stopPropagation();
          setIsAdding(true);
        }}
        onPointerDown={(e) => e.stopPropagation()}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          fontSize: 12,
          fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
          color: "#9C9CA0",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "4px 0",
          marginTop: 2,
        }}
      >
        <Plus size={12} />
        Add subtask
      </button>
    );
  }

  return (
    <div
      style={{ marginTop: 4 }}
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          e.stopPropagation();
          if (e.key === "Enter") handleSubmit();
          if (e.key === "Escape") { setIsAdding(false); setValue(""); }
        }}
        onBlur={() => {
          if (!value.trim()) { setIsAdding(false); setValue(""); }
        }}
        placeholder="Subtask title..."
        style={{
          width: "100%",
          fontSize: 12,
          fontFamily: "var(--font-inter), Inter, sans-serif",
          padding: "4px 6px",
          border: "1px solid rgba(218, 193, 185, 0.4)",
          borderRadius: 4,
          outline: "none",
          backgroundColor: "#FAFAF9",
          color: "#1B1C1B",
        }}
      />
    </div>
  );
}
