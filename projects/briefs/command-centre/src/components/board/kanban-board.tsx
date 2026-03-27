"use client";

import { useEffect, useMemo, useState } from "react";
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { LayoutDashboard, ListTodo, X, ChevronDown } from "lucide-react";
import { useTaskStore } from "@/store/task-store";
import { useClientStore } from "@/store/client-store";
import type { Task, TaskStatus } from "@/types/task";
import { KanbanColumn, DisplayColumn } from "./kanban-column";
import { TaskCreateInput } from "./task-create-input";
import { TaskCard } from "./task-card";
import { TasksView } from "@/components/tasks/tasks-view";

import { BrandContextBanner } from "./brand-context-banner";

type BoardView = "board" | "tasks";

const displayColumns: DisplayColumn[] = ["backlog", "queued", "in_progress", "completed"];

/** Map a TaskStatus to its display column */
function statusToColumn(status: TaskStatus): DisplayColumn {
  switch (status) {
    case "backlog":
      return "backlog";
    case "queued":
      return "queued";
    case "running":
    case "review":
      return "in_progress";
    case "done":
      return "completed";
  }
}

/** Map a display column to the default TaskStatus when dropping */
function columnToDefaultStatus(column: DisplayColumn): TaskStatus {
  switch (column) {
    case "backlog":
      return "backlog";
    case "queued":
      return "queued";
    case "in_progress":
      return "running";
    case "completed":
      return "done";
  }
}

export function KanbanBoard({ initialProjectFilter, initialView }: { initialProjectFilter?: string | null; initialView?: "board" | "tasks" | null } = {}) {
  const tasks = useTaskStore((s) => s.tasks);
  const moveTask = useTaskStore((s) => s.moveTask);
  const clients = useClientStore((s) => s.clients);
  const selectedClientId = useClientStore((s) => s.selectedClientId);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [clientFilter, setClientFilter] = useState<string | null>(null);
  const [projectFilter, setProjectFilter] = useState<string | null>(initialProjectFilter ?? null);
  const [view, setView] = useState<BoardView>(initialView === "tasks" ? "tasks" : "board");

  const actionCount = tasks.filter(
    (t) => t.status === "review" || t.needsInput === true || t.errorMessage !== null
  ).length;

  // Distinct client IDs present in current tasks
  const activeClientIds = useMemo(() => {
    const ids = new Set<string>();
    for (const task of tasks) {
      if (task.clientId && !task.parentId) ids.add(task.clientId);
    }
    return Array.from(ids);
  }, [tasks]);

  // Project slugs from tasks + active briefs for the filter dropdown
  const [briefSlugs, setBriefSlugs] = useState<Array<{ slug: string; name: string }>>([]);
  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.ok ? r.json() : [])
      .then((projects: Array<{ slug: string; name: string; status: string }>) => {
        setBriefSlugs(
          projects
            .filter((p) => p.status === "active")
            .map((p) => ({ slug: p.slug, name: p.name }))
        );
      })
      .catch(() => {});
  }, []);

  const allProjectOptions = useMemo(() => {
    const map = new Map<string, string>();
    // Add briefs first
    for (const b of briefSlugs) {
      map.set(b.slug, b.name);
    }
    // Add any task slugs not already in briefs
    for (const task of tasks) {
      if (task.projectSlug && !task.parentId && !map.has(task.projectSlug)) {
        map.set(
          task.projectSlug,
          task.projectSlug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
        );
      }
    }
    return Array.from(map.entries())
      .map(([slug, name]) => ({ slug, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [tasks, briefSlugs]);

  // Build a set of task IDs that match the project filter.
  // Priority: exact projectSlug match → title-based fuzzy match (for unlinked tasks).
  const projectMatchIds = useMemo(() => {
    if (!projectFilter) return null;
    const ids = new Set<string>();

    // 1. Exact projectSlug match
    for (const task of tasks) {
      if (task.projectSlug === projectFilter) {
        ids.add(task.id);
        if (task.parentId) ids.add(task.parentId);
      }
    }

    // 2. If no exact matches, fall back to title-based matching.
    //    Convert slug to keywords and match against task titles.
    if (ids.size === 0) {
      const projectName = briefSlugs.find((b) => b.slug === projectFilter)?.name
        || projectFilter.split("-").join(" ");
      const keywords = projectName.toLowerCase().split(/\s+/).filter((w) => w.length > 2);

      for (const task of tasks) {
        if (task.parentId) continue;
        const titleLower = task.title.toLowerCase();
        // Match if most keywords appear in the title
        const matchCount = keywords.filter((kw) => titleLower.includes(kw)).length;
        if (keywords.length > 0 && matchCount >= Math.ceil(keywords.length * 0.5)) {
          ids.add(task.id);
        }
      }
    }

    return ids;
  }, [tasks, projectFilter, briefSlugs]);

  const tasksByColumn = useMemo(() => {
    const grouped: Record<DisplayColumn, Task[]> = {
      backlog: [],
      queued: [],
      in_progress: [],
      completed: [],
    };
    for (const task of tasks) {
      if (task.parentId) continue;
      if (clientFilter && task.clientId !== clientFilter) continue;
      if (projectMatchIds && !projectMatchIds.has(task.id)) continue;
      const col = statusToColumn(task.status);
      grouped[col].push(task);
    }
    for (const col of displayColumns) {
      grouped[col].sort((a, b) => a.columnOrder - b.columnOrder);
    }
    return grouped;
  }, [tasks, clientFilter, projectMatchIds]);

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

    let destinationColumn: DisplayColumn;

    if (displayColumns.includes(overId as DisplayColumn)) {
      destinationColumn = overId as DisplayColumn;
    } else {
      const overTask = tasks.find((t) => t.id === overId);
      if (!overTask) return;
      destinationColumn = statusToColumn(overTask.status);
    }

    // Determine status: if task already belongs to this column, keep its status.
    // Otherwise assign the column's default status.
    const draggedTask = tasks.find((t) => t.id === taskId);
    const currentColumn = draggedTask ? statusToColumn(draggedTask.status) : null;
    const destinationStatus = currentColumn === destinationColumn && draggedTask
      ? draggedTask.status
      : columnToDefaultStatus(destinationColumn);

    const destTasks = tasksByColumn[destinationColumn];

    let newOrder: number;
    if (displayColumns.includes(overId as DisplayColumn)) {
      newOrder = destTasks.length;
    } else {
      const overIndex = destTasks.findIndex((t) => t.id === overId);
      newOrder = overIndex >= 0 ? overIndex : destTasks.length;
    }

    moveTask(taskId, destinationStatus, newOrder);
  };

  // Show filter pills when viewing root (all clients) and there are multiple clients with tasks
  const showClientFilters = !selectedClientId && activeClientIds.length > 1;

  const viewOptions: { key: BoardView; label: string; icon: typeof LayoutDashboard; badge?: number }[] = [
    { key: "board", label: "Board", icon: LayoutDashboard },
    { key: "tasks", label: "Tasks", icon: ListTodo, badge: actionCount > 0 ? actionCount : undefined },
  ];

  return (
    <div>
      <BrandContextBanner />

      {/* Toolbar: view toggle + project filter */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 16,
        }}
      >
        {/* View toggle pills */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            backgroundColor: "#F6F3F1",
            borderRadius: 8,
            padding: 3,
          }}
        >
          {viewOptions.map((opt) => {
            const Icon = opt.icon;
            const isActive = view === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => setView(opt.key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 12,
                  fontWeight: 500,
                  fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                  padding: "6px 14px",
                  borderRadius: 6,
                  border: "none",
                  backgroundColor: isActive ? "#FFFFFF" : "transparent",
                  color: isActive ? "#1B1C1B" : "#5E5E65",
                  cursor: "pointer",
                  boxShadow: isActive ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                  transition: "all 150ms ease",
                }}
              >
                <Icon size={14} />
                {opt.label}
                {opt.badge !== undefined && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      backgroundColor: isActive ? "#D2783C" : "rgba(210, 120, 60, 0.15)",
                      color: isActive ? "#FFFFFF" : "#D2783C",
                      padding: "1px 6px",
                      borderRadius: 8,
                      lineHeight: "16px",
                    }}
                  >
                    {opt.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Project filter — inline with toggle */}
        {(allProjectOptions.length > 0 || projectFilter) && (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ position: "relative" }}>
              <select
                value={projectFilter || ""}
                onChange={(e) => setProjectFilter(e.target.value || null)}
                style={{
                  appearance: "none",
                  fontSize: 12,
                  fontWeight: 500,
                  fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                  padding: "6px 28px 6px 10px",
                  borderRadius: 6,
                  border: projectFilter
                    ? "1px solid #93452A"
                    : "1px solid rgba(218, 193, 185, 0.3)",
                  backgroundColor: projectFilter
                    ? "rgba(147, 69, 42, 0.06)"
                    : "transparent",
                  color: projectFilter ? "#93452A" : "#5E5E65",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <option value="">All projects</option>
                {allProjectOptions.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={12}
                color={projectFilter ? "#93452A" : "#9C9CA0"}
                style={{
                  position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                }}
              />
            </div>
            {projectFilter && (
              <button
                onClick={() => setProjectFilter(null)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: 4,
                  borderRadius: 4,
                  border: "none",
                  backgroundColor: "transparent",
                  color: "#93452A",
                  cursor: "pointer",
                }}
                title="Clear project filter"
              >
                <X size={14} />
              </button>
            )}
          </div>
        )}
      </div>

      {view === "tasks" ? (
        <TasksView />
      ) : (
      <>
      <TaskCreateInput projectSlug={projectFilter} />
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
          {displayColumns.map((col) => (
            <KanbanColumn
              key={col}
              column={col}
              tasks={tasksByColumn[col]}
            />
          ))}
        </div>
        <DragOverlay dropAnimation={{ duration: 200, easing: "ease" }}>
          {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
        </DragOverlay>
      </DndContext>
      </>
      )}
    </div>
  );
}
