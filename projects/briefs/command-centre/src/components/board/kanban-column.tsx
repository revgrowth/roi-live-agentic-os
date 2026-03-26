"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Task, TaskStatus } from "@/types/task";
import { TaskCard } from "./task-card";

const statusColors: Record<TaskStatus, string> = {
  backlog: "#5E5E65",
  queued: "#5E5E65",
  running: "#93452A",
  review: "#B25D3F",
  done: "#6B8E6B",
};

const columnLabels: Record<TaskStatus, string> = {
  backlog: "Backlog",
  queued: "Queued",
  running: "Running",
  review: "Review",
  done: "Done",
};

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
}

export function KanbanColumn({ status, tasks }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const color = statusColors[status];

  return (
    <div
      ref={setNodeRef}
      style={{
        flex: 1,
        minWidth: 0,
        backgroundColor: "#F6F3F1",
        borderRadius: 12,
        padding: 12,
        display: "flex",
        flexDirection: "column",
        maxHeight: "calc(100vh - 200px)",
      }}
    >
      {/* Header — no border, uses spacing for separation */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          paddingBottom: 10,
          marginBottom: 8,
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
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
            color: "#1B1C1B",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          {columnLabels[status]}
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
            marginLeft: "auto",
          }}
        >
          {tasks.length}
        </span>
      </div>

      {/* Cards */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.length === 0 ? (
            <div
              style={{
                border: `2px dashed ${isOver ? "rgba(147, 69, 42, 0.4)" : "rgba(218, 193, 185, 0.3)"}`,
                borderRadius: 8,
                padding: "32px 16px",
                textAlign: "center",
                color: "#5E5E65",
                fontSize: 13,
                fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                backgroundColor: isOver ? "rgba(255, 219, 207, 0.15)" : "transparent",
                transition: "all 150ms ease",
              }}
            >
              Drag tasks here
            </div>
          ) : (
            tasks.map((task) => <TaskCard key={task.id} task={task} />)
          )}
        </SortableContext>

        {tasks.length > 0 && isOver && (
          <div
            style={{
              border: "2px dashed rgba(147, 69, 42, 0.4)",
              borderRadius: 8,
              padding: 16,
              backgroundColor: "rgba(255, 219, 207, 0.15)",
              transition: "all 150ms ease",
            }}
          />
        )}
      </div>
    </div>
  );
}
