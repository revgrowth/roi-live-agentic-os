"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Task, TaskStatus } from "@/types/task";
import { TaskCard } from "./task-card";

const statusColors: Record<TaskStatus, string> = {
  backlog: "#9CA3AF",
  queued: "#6B7280",
  running: "#3B82F6",
  review: "#F59E0B",
  done: "#10B981",
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
        minWidth: 220,
        backgroundColor: "#F3F4F6",
        borderRadius: 8,
        padding: 12,
        display: "flex",
        flexDirection: "column",
        maxHeight: "calc(100vh - 180px)",
      }}
    >
      {/* Header with colour indicator */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 12,
          paddingBottom: 8,
          borderTop: `3px solid ${color}`,
          borderRadius: "2px 2px 0 0",
          paddingTop: 8,
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#111827",
          }}
        >
          {columnLabels[status]}
        </span>
        <span
          style={{
            fontSize: 12,
            color: "#9CA3AF",
            backgroundColor: "#E5E7EB",
            padding: "1px 8px",
            borderRadius: 10,
            fontWeight: 500,
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
                border: `2px dashed ${isOver ? "#3B82F6" : "#D1D5DB"}`,
                borderRadius: 8,
                padding: "24px 16px",
                textAlign: "center",
                color: "#9CA3AF",
                fontSize: 13,
                backgroundColor: isOver ? "#EFF6FF" : "transparent",
                transition: "all 150ms",
              }}
            >
              Drag tasks here
            </div>
          ) : (
            tasks.map((task) => <TaskCard key={task.id} task={task} />)
          )}
        </SortableContext>

        {/* Drop zone indicator when column has cards */}
        {tasks.length > 0 && isOver && (
          <div
            style={{
              border: "2px dashed #3B82F6",
              borderRadius: 8,
              padding: 12,
              backgroundColor: "#EFF6FF",
              transition: "all 150ms",
            }}
          />
        )}
      </div>
    </div>
  );
}
