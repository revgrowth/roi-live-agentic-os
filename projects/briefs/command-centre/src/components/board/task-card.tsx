"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.9 : 1,
    scale: isDragging ? "1.02" : "1",
  };

  const isRunning = task.status === "running";
  const hasError = task.errorMessage !== null;
  const borderColor = hasError ? "#EF4444" : statusColors[task.status];

  // Child tasks for project/gsd cards
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
        border: `1px solid ${isHovered ? "#D1D5DB" : "#E5E7EB"}`,
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
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...attributes}
      {...listeners}
    >
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
        <span
          style={{
            fontSize: 12,
            color: "#9CA3AF",
            marginLeft: "auto",
          }}
        >
          {timeAgo(task.updatedAt)}
        </span>
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
            color: "#4B5563",
            marginTop: 4,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical" as const,
          }}
        >
          {task.errorMessage}
        </div>
      )}

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
              color: "#9CA3AF",
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

          {expanded && (
            <div style={{ marginTop: 6, paddingLeft: 4 }}>
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
