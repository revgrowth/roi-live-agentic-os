"use client";

import { useMemo } from "react";
import { DndContext, DragEndEvent, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { useTaskStore } from "@/store/task-store";
import type { Task, TaskStatus } from "@/types/task";
import { KanbanColumn } from "./kanban-column";
import { TaskCreateInput } from "./task-create-input";

const columns: TaskStatus[] = ["backlog", "queued", "running", "review", "done"];

export function KanbanBoard() {
  const tasks = useTaskStore((s) => s.tasks);
  const moveTask = useTaskStore((s) => s.moveTask);

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

  const handleDragEnd = (event: DragEndEvent) => {
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
        onDragEnd={handleDragEnd}
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
      </DndContext>
    </div>
  );
}
