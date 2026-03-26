"use client";

import { useMemo, useState } from "react";
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { useTaskStore } from "@/store/task-store";
import { useClientStore } from "@/store/client-store";
import type { Task, TaskStatus } from "@/types/task";
import { KanbanColumn } from "./kanban-column";
import { TaskCreateInput } from "./task-create-input";
import { TaskCard } from "./task-card";

import { BrandContextBanner } from "./brand-context-banner";

const columns: TaskStatus[] = ["backlog", "queued", "running", "review", "done"];

export function KanbanBoard() {
  const tasks = useTaskStore((s) => s.tasks);
  const moveTask = useTaskStore((s) => s.moveTask);
  const clients = useClientStore((s) => s.clients);
  const selectedClientId = useClientStore((s) => s.selectedClientId);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [clientFilter, setClientFilter] = useState<string | null>(null);

  // Distinct client IDs present in current tasks
  const activeClientIds = useMemo(() => {
    const ids = new Set<string>();
    for (const task of tasks) {
      if (task.clientId && !task.parentId) ids.add(task.clientId);
    }
    return Array.from(ids);
  }, [tasks]);

  const tasksByStatus = useMemo(() => {
    const grouped: Record<TaskStatus, Task[]> = {
      backlog: [],
      queued: [],
      running: [],
      review: [],
      done: [],
    };
    for (const task of tasks) {
      if (task.parentId) continue;
      if (clientFilter && task.clientId !== clientFilter) continue;
      if (grouped[task.status]) {
        grouped[task.status].push(task);
      }
    }
    for (const status of columns) {
      grouped[status].sort((a, b) => a.columnOrder - b.columnOrder);
    }
    return grouped;
  }, [tasks, clientFilter]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    let destinationStatus: TaskStatus;

    if (columns.includes(overId as TaskStatus)) {
      destinationStatus = overId as TaskStatus;
    } else {
      const overTask = tasks.find((t) => t.id === overId);
      if (!overTask) return;
      destinationStatus = overTask.status;
    }

    const destTasks = tasksByStatus[destinationStatus];

    let newOrder: number;
    if (columns.includes(overId as TaskStatus)) {
      newOrder = destTasks.length;
    } else {
      const overIndex = destTasks.findIndex((t) => t.id === overId);
      newOrder = overIndex >= 0 ? overIndex : destTasks.length;
    }

    moveTask(taskId, destinationStatus, newOrder);
  };

  // Show filter pills when viewing root (all clients) and there are multiple clients with tasks
  const showClientFilters = !selectedClientId && activeClientIds.length > 1;

  return (
    <div>
      <BrandContextBanner />
      <TaskCreateInput />
      {showClientFilters && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 12,
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => setClientFilter(null)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              fontSize: 12,
              fontWeight: 500,
              fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
              padding: "4px 10px",
              borderRadius: 6,
              border: clientFilter === null ? "1px solid #93452A" : "1px solid rgba(218, 193, 185, 0.3)",
              backgroundColor: clientFilter === null ? "rgba(147, 69, 42, 0.08)" : "transparent",
              color: clientFilter === null ? "#93452A" : "#5E5E65",
              cursor: "pointer",
              transition: "all 150ms ease",
            }}
          >
            All clients
          </button>
          {activeClientIds.map((cid) => {
            const client = clients.find((c) => c.slug === cid);
            if (!client) return null;
            const isActive = clientFilter === cid;
            return (
              <button
                key={cid}
                onClick={() => setClientFilter(isActive ? null : cid)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 12,
                  fontWeight: 500,
                  fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                  padding: "4px 10px",
                  borderRadius: 6,
                  border: isActive ? `1px solid ${client.color}` : "1px solid rgba(218, 193, 185, 0.3)",
                  backgroundColor: isActive ? `${client.color}14` : "transparent",
                  color: isActive ? client.color : "#5E5E65",
                  cursor: "pointer",
                  transition: "all 150ms ease",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: client.color,
                    flexShrink: 0,
                  }}
                />
                {client.name}
              </button>
            );
          })}
        </div>
      )}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveTask(null)}
      >
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
            overflowX: "auto",
          }}
        >
          {columns.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={tasksByStatus[status]}
            />
          ))}
        </div>
        <DragOverlay dropAnimation={{ duration: 200, easing: "ease" }}>
          {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
