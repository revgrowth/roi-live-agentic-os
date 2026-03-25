"use client";

import { DndContext, DragEndEvent, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { useTaskStore } from "@/store/task-store";
import type { TaskStatus } from "@/types/task";
import { KanbanColumn } from "./kanban-column";
import { TaskCreateInput } from "./task-create-input";

const columns: TaskStatus[] = ["backlog", "queued", "running", "review", "done"];

export function KanbanBoard() {
  const getTasksByStatus = useTaskStore((s) => s.getTasksByStatus);
  const moveTask = useTaskStore((s) => s.moveTask);

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

    // Determine destination column
    let destinationStatus: TaskStatus;

    // Check if dropped on a column directly
    if (columns.includes(overId as TaskStatus)) {
      destinationStatus = overId as TaskStatus;
    } else {
      // Dropped on another task -- find which column that task is in
      const allTasks = useTaskStore.getState().tasks;
      const overTask = allTasks.find((t) => t.id === overId);
      if (!overTask) return;
      destinationStatus = overTask.status;
    }

    // Get tasks in destination column to determine order
    const destTasks = useTaskStore
      .getState()
      .getTasksByStatus(destinationStatus);

    // If dropping on a task, place near it; otherwise at end
    let newOrder: number;
    if (columns.includes(overId as TaskStatus)) {
      // Dropped on empty column area
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
          }}
        >
          {columns.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={getTasksByStatus(status)}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}
