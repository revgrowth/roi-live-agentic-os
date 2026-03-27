"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Task } from "@/types/task";
import { TaskCard } from "./task-card";

export type DisplayColumn = "backlog" | "queued" | "in_progress" | "completed";

const columnColors: Record<DisplayColumn, string> = {
  backlog: "#9C9CA0",
  queued: "#5E5E65",
  in_progress: "#D2783C",
  completed: "#6B8E6B",
};

const columnLabels: Record<DisplayColumn, string> = {
  backlog: "Backlog",
  queued: "Queued",
  in_progress: "In Progress",
  completed: "Completed",
};

interface KanbanColumnProps {
  column: DisplayColumn;
  tasks: Task[];
}

export function KanbanColumn({ column, tasks }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column });
  const color = columnColors[column];

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
      {/* Header */}
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
          {columnLabels[column]}
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
