"use client";

import { useMemo, useState } from "react";
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { useTaskStore } from "@/store/task-store";
import type { Task, TaskStatus } from "@/types/task";
import { KanbanColumn } from "./kanban-column";
import { TaskCreateInput } from "./task-create-input";
import { TaskCard } from "./task-card";
import { TaskDetailPanel } from "../panel/task-detail-panel";

const columns: TaskStatus[] = ["backlog", "queued", "running", "review", "done"];

export function KanbanBoard() {
  const tasks = useTaskStore((s) => s.tasks);
  const moveTask = useTaskStore((s) => s.moveTask);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const tasksByStatus = useMemo(() => {
    const grouped: Record<TaskStatus, Task[]> = {
      backlog: [],
      queued: [],
      running: [],
      review: [],
      done: [],
    };
    for (const task of tasks) {
      if (!task.parentId && grouped[task.status]) {
        grouped[task.status].push(task);
      }
    }
    for (const status of columns) {
      grouped[status].sort((a, b) => a.columnOrder - b.columnOrder);
    }
    return grouped;
  }, [tasks]);

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

  return (
    <div>
      <TaskCreateInput />
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
            gap: 24,
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
      <TaskDetailPanel />
    </div>
  );
}
