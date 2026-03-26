"use client";

import { useState, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import type { Task, TaskStatus, OutputFile } from "@/types/task";
import { LevelBadge } from "./level-badge";
import { useTaskStore } from "@/store/task-store";
import { OutputChips } from "./output-chips";
import { FilePreviewModal } from "./file-preview-modal";

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

export function TaskCard({ task, isOverlay }: { task: Task; isOverlay?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isTrashHovered, setIsTrashHovered] = useState(false);
  const [previewFile, setPreviewFile] = useState<OutputFile | null>(null);
  const getChildTasks = useTaskStore((s) => s.getChildTasks);
  const deleteTask = useTaskStore((s) => s.deleteTask);
  const outputFiles = useTaskStore((s) => s.outputFiles[task.id] || []);
  const fetchOutputFiles = useTaskStore((s) => s.fetchOutputFiles);
  const openPanel = useTaskStore((s) => s.openPanel);

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

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        backgroundColor: hasError ? "#FFF5F3" : "#FFFFFF",
        border: `1px solid ${hasError ? "rgba(192, 64, 48, 0.25)" : "rgba(218, 193, 185, 0.2)"}`,
        borderLeft: `3px solid ${borderColor}`,
        borderRadius: 8,
        padding: 16,
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
        }}
      >
        <LevelBadge level={task.level} />
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

      {/* Running state: pulsing dot + activity + counters */}
      {isRunning && (
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
              gap: 12,
              fontSize: 11,
              color: "#5E5E65",
              fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
            }}
          >
            {task.costUsd !== null && (
              <span>${task.costUsd.toFixed(2)}</span>
            )}
            {task.tokensUsed !== null && (
              <span>{formatTokens(task.tokensUsed)} tokens</span>
            )}
          </div>
        </div>
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

      {/* Output file chips */}
      <OutputChips files={outputFiles} onFileClick={setPreviewFile} />

      {/* Child task count + expand for project/gsd */}
      {isParent && hasChildren && (
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
              {completedChildren}/{childTasks.length} tasks
            </span>
          </button>

          {/* Progress bar */}
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
                width: `${childTasks.length > 0 ? (completedChildren / childTasks.length) * 100 : 0}%`,
                background: "linear-gradient(135deg, #93452A 0%, #B25D3F 100%)",
                borderRadius: 2,
                transition: "width 300ms ease",
              }}
            />
          </div>

          {expanded && (
            <div style={{ marginTop: 8, paddingLeft: 4 }}>
              {childTasks.map((child) => (
                <div
                  key={child.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "3px 0",
                  }}
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
                    }}
                  >
                    {child.title}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* File preview modal */}
      <FilePreviewModal
        file={previewFile}
        onClose={() => setPreviewFile(null)}
      />
    </div>
  );
}
