"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import type { Task, TaskStatus } from "@/types/task";
import { LevelBadge } from "./level-badge";
import { useTaskStore } from "@/store/task-store";

const statusColors: Record<TaskStatus, string> = {
  backlog: "#9CA3AF",
  queued: "#6B7280",
  running: "#3B82F6",
  review: "#F59E0B",
  done: "#10B981",
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

export function TaskCard({ task }: { task: Task }) {
  const [expanded, setExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const getChildTasks = useTaskStore((s) => s.getChildTasks);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const dndTransform = CSS.Transform.toString(transform);
  const dragScale = isDragging ? " scale(1.02)" : "";
  const style = {
    transform: dndTransform ? `${dndTransform}${dragScale}` : dragScale || undefined,
    transition: transition ?? "all 150ms ease",
    opacity: isDragging ? 0.9 : 1,
  };

  const isRunning = task.status === "running";
  const isDone = task.status === "done";
  const hasError = task.errorMessage !== null;
  const borderColor = hasError ? "#EF4444" : statusColors[task.status];

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
        backgroundColor: hasError ? "#FEF2F2" : "#FFFFFF",
        border: `1px solid ${hasError ? "#FCA5A5" : isHovered ? "#D1D5DB" : "#E5E7EB"}`,
        borderLeft: `3px solid ${borderColor}`,
        borderRadius: 8,
        padding: 16,
        boxShadow: isDragging
          ? "0 8px 16px rgba(0,0,0,0.12)"
          : isHovered
            ? "0 4px 6px rgba(0,0,0,0.07)"
            : "0 1px 2px rgba(0,0,0,0.05)",
        cursor: "grab",
        userSelect: "none" as const,
        position: "relative" as const,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...attributes}
      {...listeners}
    >
      {/* Grab handle - visible on hover */}
      {isHovered && !isDragging && (
        <div
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "#D1D5DB",
          }}
        >
          <GripVertical size={14} />
        </div>
      )}

      {/* Title */}
      <div
        style={{
          fontSize: 14,
          fontWeight: 500,
          color: "#111827",
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
              padding: "2px 8px",
              borderRadius: 4,
              backgroundColor: "#FEE2E2",
              color: "#DC2626",
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
                backgroundColor: "#3B82F6",
                animation: "pulse 2s ease-in-out infinite",
                flexShrink: 0,
              }}
            />
            {task.activityLabel && (
              <span
                style={{
                  fontSize: 12,
                  color: "#4B5563",
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
              color: "#9CA3AF",
              fontFamily: "var(--font-jetbrains-mono), monospace",
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
            color: "#EF4444",
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
        <span style={{ fontSize: 12, color: "#9CA3AF" }}>
          {timeAgo(task.updatedAt)}
        </span>
        <div
          style={{
            display: "flex",
            gap: 8,
            fontSize: 12,
            color: "#9CA3AF",
            fontFamily: "var(--font-jetbrains-mono), monospace",
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
              color: "#4B5563",
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
              backgroundColor: "#E5E7EB",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${childTasks.length > 0 ? (completedChildren / childTasks.length) * 100 : 0}%`,
                backgroundColor: "#3B82F6",
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
                      color: "#4B5563",
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
    </div>
  );
}
