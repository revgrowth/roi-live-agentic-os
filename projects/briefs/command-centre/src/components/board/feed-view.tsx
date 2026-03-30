"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronDown, ChevronUp, Clock, Check, ArrowRight, GripVertical, Trash2, Play } from "lucide-react";
import { useTaskStore } from "@/store/task-store";
import { useCronStore } from "@/store/cron-store";
import type { Task } from "@/types/task";
import { FeedCard } from "./feed-card";
import { ReviewQueue } from "./review-queue";
import { TaskCreateInput } from "./task-create-input";

function timeAgo(dateStr: string): string {
  const ts = new Date(dateStr).getTime();
  if (isNaN(ts)) return "--";
  const diff = Date.now() - ts;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/** Polsia-style section divider with status summary */
function SectionDivider({
  label,
  running,
  queued,
  review,
  isActive,
  isGoalGroup,
}: {
  label: string;
  running?: number;
  queued?: number;
  review?: number;
  isActive?: boolean;
  isGoalGroup?: boolean;
}) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginTop: 16,
      marginBottom: 6,
    }}>
      {isGoalGroup && (
        <span style={{
          fontSize: 9,
          fontWeight: 600,
          fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
          color: "#9C9CA0",
          backgroundColor: "rgba(218, 193, 185, 0.15)",
          padding: "1px 5px",
          borderRadius: 3,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          flexShrink: 0,
        }}>
          Goal
        </span>
      )}
      <span style={{
        fontSize: 13,
        fontWeight: isActive ? 700 : 600,
        fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
        color: isActive ? "#1B1C1B" : "#5E5E65",
        whiteSpace: "nowrap",
      }}>
        {label}
      </span>
      {/* Status breakdown dots */}
      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {(running ?? 0) > 0 && (
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 3,
            fontSize: 10,
            fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
            color: "#93452A",
          }}>
            <span style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              backgroundColor: "#D2783C",
              animation: "pulse-dot 2s ease-in-out infinite",
            }} />
            {running}
          </span>
        )}
        {(review ?? 0) > 0 && (
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 3,
            fontSize: 10,
            fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
            color: "#D2783C",
          }}>
            <span style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              backgroundColor: "#D2783C",
            }} />
            {review}
          </span>
        )}
        {(queued ?? 0) > 0 && (
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 3,
            fontSize: 10,
            fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
            color: "#9C9CA0",
          }}>
            {queued}
          </span>
        )}
      </span>
      <div style={{
        flex: 1,
        height: 1,
        backgroundColor: isActive
          ? "rgba(210, 120, 60, 0.2)"
          : "rgba(218, 193, 185, 0.25)",
      }} />
    </div>
  );
}

function ColumnHeader({
  label,
  count,
  dotColor,
  pulse,
}: {
  label: string;
  count: number;
  dotColor: string;
  pulse?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 6,
        paddingBottom: 8,
        borderBottom: "2px solid rgba(218, 193, 185, 0.15)",
      }}
    >
      <span
        style={{
          display: "inline-block",
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: dotColor,
          flexShrink: 0,
          animation: pulse ? "pulse-dot 2s ease-in-out infinite" : undefined,
        }}
      />
      <span
        style={{
          fontSize: 14,
          fontWeight: 700,
          fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
          color: "#1B1C1B",
        }}
      >
        {label}
      </span>
      {count > 0 && (
        <span
          style={{
            fontSize: 11,
            fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
            color: "#5E5E65",
            backgroundColor: "#EAE8E6",
            padding: "1px 8px",
            borderRadius: 8,
            fontWeight: 500,
          }}
        >
          {count}
        </span>
      )}
    </div>
  );
}

function IdeaRow({ task }: { task: Task }) {
  const openPanel = useTaskStore((s) => s.openPanel);
  const updateTask = useTaskStore((s) => s.updateTask);
  const deleteTask = useTaskStore((s) => s.deleteTask);
  const [isHovered, setIsHovered] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const dndTransform = CSS.Transform.toString(transform);

  return (
    <div
      ref={setNodeRef}
      onClick={() => openPanel(task.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "4px 8px",
        borderRadius: 4,
        cursor: isDragging ? "grabbing" : "pointer",
        backgroundColor: isHovered ? "rgba(218, 193, 185, 0.08)" : "transparent",
        transition: transition || "background 100ms ease",
        transform: dndTransform || undefined,
        opacity: isDragging ? 0.5 : 1,
      }}
      {...attributes}
    >
      <div
        {...listeners}
        onClick={(e) => e.stopPropagation()}
        style={{
          display: "flex",
          alignItems: "center",
          cursor: isDragging ? "grabbing" : "grab",
          color: isHovered ? "#B0B0B5" : "transparent",
          transition: "color 120ms ease",
          flexShrink: 0,
        }}
      >
        <GripVertical size={10} />
      </div>
      <span style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: "#D1D5DB", flexShrink: 0 }} />
      <span
        style={{
          fontSize: 12,
          fontFamily: "var(--font-inter), Inter, sans-serif",
          color: "#9C9CA0",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          flex: 1,
        }}
      >
        {task.title}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          updateTask(task.id, { status: "queued" });
        }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 2,
          color: isHovered ? "#93452A" : "transparent",
          transition: "color 120ms ease",
          flexShrink: 0,
          borderRadius: 3,
        }}
        title="Queue task"
      >
        <Play size={10} />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          deleteTask(task.id);
        }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 2,
          color: isHovered ? "#C04030" : "transparent",
          transition: "color 120ms ease",
          flexShrink: 0,
          borderRadius: 3,
        }}
        title="Delete idea"
      >
        <Trash2 size={10} />
      </button>
    </div>
  );
}

function DoneItem({ task }: { task: Task }) {
  const openPanel = useTaskStore((s) => s.openPanel);
  const fetchOutputFiles = useTaskStore((s) => s.fetchOutputFiles);
  const allOutputFiles = useTaskStore((s) => s.outputFiles);
  const outputFiles = allOutputFiles[task.id] ?? [];
  const [isHovered, setIsHovered] = useState(false);

  // Fetch output files on mount
  useEffect(() => { fetchOutputFiles(task.id); }, [task.id, fetchOutputFiles]);

  return (
    <div
      onClick={() => openPanel(task.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: "6px 8px",
        borderRadius: 6,
        cursor: "pointer",
        backgroundColor: isHovered ? "rgba(107, 142, 107, 0.06)" : "transparent",
        transition: "background 100ms ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            fontFamily: "var(--font-inter), Inter, sans-serif",
            color: task.errorMessage ? "#C04030" : "#6B8E6B",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flex: 1,
            minWidth: 0,
          }}
        >
          <Check size={12} style={{ flexShrink: 0 }} />
          {task.title}
          {task.cronJobSlug && (
            <span style={{
              fontSize: 9,
              fontWeight: 600,
              fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
              color: "#3B82F6",
              backgroundColor: "rgba(59, 130, 246, 0.08)",
              padding: "0 4px",
              borderRadius: 3,
              flexShrink: 0,
            }}>
              Scheduled
            </span>
          )}
        </span>
        <span style={{ fontSize: 10, color: "#B0B0B5", whiteSpace: "nowrap", flexShrink: 0 }}>
          {task.completedAt ? timeAgo(task.completedAt) : timeAgo(task.updatedAt)}
        </span>
      </div>
      {/* Subtitle: activity label, description, or error */}
      {(task.activityLabel || task.description || task.errorMessage) && outputFiles.length === 0 && (
        <div style={{
          fontSize: 10,
          fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
          color: task.errorMessage ? "#C04030" : "#5E5E65",
          marginTop: 2,
          paddingLeft: 18,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}>
          {task.errorMessage
            ? (task.errorMessage.length > 80 ? task.errorMessage.slice(0, 77) + "\u2026" : task.errorMessage)
            : task.activityLabel
              ? task.activityLabel
              : task.description
                ? (task.description.length > 80 ? task.description.slice(0, 77) + "\u2026" : task.description)
                : null}
        </div>
      )}
      {outputFiles.length > 0 && (
        <div style={{
          display: "flex",
          gap: 4,
          flexWrap: "wrap",
          marginTop: 3,
          paddingLeft: 18,
        }}>
          {outputFiles.slice(0, 3).map((f) => (
            <span
              key={f.id}
              style={{
                fontSize: 10,
                fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                color: "#93452A",
                backgroundColor: "rgba(147, 69, 42, 0.06)",
                padding: "1px 6px",
                borderRadius: 3,
                whiteSpace: "nowrap",
              }}
            >
              {f.fileName}
            </span>
          ))}
          {outputFiles.length > 3 && (
            <span style={{
              fontSize: 10,
              fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
              color: "#9C9CA0",
            }}>
              +{outputFiles.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/** Cron jobs summary — clicks switch to Scheduled tab */
function ScheduledSection({ onNavigate }: { onNavigate: () => void }) {
  const jobs = useCronStore((s) => s.jobs);
  const fetchJobs = useCronStore((s) => s.fetchJobs);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const activeJobs = jobs.filter((j) => j.active);
  if (activeJobs.length === 0) return null;

  const failedCount = activeJobs.filter((j) => j.lastRun?.result === "failure").length;

  return (
    <div>
      <div
        onClick={onNavigate}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginTop: 16,
          marginBottom: 6,
          cursor: "pointer",
          padding: "2px 4px",
          borderRadius: 4,
        }}
      >
        <Clock size={12} color="#5E5E65" style={{ flexShrink: 0 }} />
        <span style={{
          fontSize: 13,
          fontWeight: 700,
          fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
          color: "#1B1C1B",
          whiteSpace: "nowrap",
        }}>
          Scheduled
        </span>
        <span style={{
          fontSize: 10,
          fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
          color: "#9C9CA0",
        }}>
          {activeJobs.length}
        </span>
        {failedCount > 0 && (
          <span style={{
            fontSize: 10,
            fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
            color: "#C04030",
            fontWeight: 600,
          }}>
            {failedCount} failed
          </span>
        )}
        <div style={{ flex: 1, height: 1, backgroundColor: "rgba(218, 193, 185, 0.25)" }} />
        <ArrowRight size={10} color="#9C9CA0" style={{ flexShrink: 0 }} />
      </div>
      {activeJobs.slice(0, 5).map((job) => {
        const isFailed = job.lastRun?.result === "failure";
        return (
          <div
            key={job.slug}
            onClick={onNavigate}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
              padding: "4px 8px",
              borderRadius: 4,
              cursor: "pointer",
              transition: "background 100ms ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(218, 193, 185, 0.08)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
          >
            <span style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              fontFamily: "var(--font-inter), Inter, sans-serif",
              color: isFailed ? "#C04030" : "#5E5E65",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flex: 1,
              minWidth: 0,
            }}>
              <span style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                backgroundColor: isFailed ? "#C04030" : "#6B8E6B",
                flexShrink: 0,
              }} />
              {job.name}
            </span>
            <span style={{ fontSize: 10, color: "#9C9CA0", whiteSpace: "nowrap", flexShrink: 0 }}>
              {job.lastRun ? timeAgo(job.lastRun.lastRun) : "\u2014"}
            </span>
          </div>
        );
      })}
      {activeJobs.length > 5 && (
        <div
          onClick={onNavigate}
          style={{
            fontSize: 11,
            fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
            color: "#93452A",
            padding: "4px 8px",
            cursor: "pointer",
          }}
        >
          +{activeJobs.length - 5} more &rarr;
        </div>
      )}
    </div>
  );
}

/** Group tasks by projectSlug, then by goalGroup, with status counts per group */
function groupByProject(tasks: Task[]): Array<{
  key: string;
  label: string;
  tasks: Task[];
  running: number;
  queued: number;
  review: number;
  isGoalGroup?: boolean;
}> {
  const projectMap = new Map<string, Task[]>();
  const goalMap = new Map<string, Task[]>();
  const ungrouped: Task[] = [];

  for (const task of tasks) {
    if (task.projectSlug) {
      if (!projectMap.has(task.projectSlug)) projectMap.set(task.projectSlug, []);
      projectMap.get(task.projectSlug)!.push(task);
    } else if (task.goalGroup) {
      if (!goalMap.has(task.goalGroup)) goalMap.set(task.goalGroup, []);
      goalMap.get(task.goalGroup)!.push(task);
    } else {
      ungrouped.push(task);
    }
  }

  type Group = {
    key: string;
    label: string;
    tasks: Task[];
    running: number;
    queued: number;
    review: number;
    isGoalGroup?: boolean;
  };

  const groups: Group[] = [];

  function countStatuses(groupTasks: Task[]) {
    let running = 0, queued = 0, review = 0;
    for (const t of groupTasks) {
      if (t.status === "running" && !t.needsInput && !t.errorMessage) running++;
      else if (t.status === "queued") queued++;
      else if (t.status === "review" || t.needsInput) review++;
    }
    return { running, queued, review };
  }

  // Project groups (explicit)
  for (const [slug, groupTasks] of projectMap) {
    const label = slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    const counts = countStatuses(groupTasks);
    groups.push({ key: `project:${slug}`, label, tasks: groupTasks, ...counts });
  }

  // Goal groups (semantic / AI-inferred)
  for (const [goal, groupTasks] of goalMap) {
    const counts = countStatuses(groupTasks);
    groups.push({ key: `goal:${goal}`, label: goal, tasks: groupTasks, ...counts, isGoalGroup: true });
  }

  // Most recently updated groups first
  groups.sort((a, b) => {
    const aTime = Math.max(...a.tasks.map(t => new Date(t.updatedAt).getTime()));
    const bTime = Math.max(...b.tasks.map(t => new Date(t.updatedAt).getTime()));
    return bTime - aTime;
  });

  // Ungrouped tasks at the bottom
  if (ungrouped.length > 0) {
    const counts = countStatuses(ungrouped);
    groups.push({ key: "_tasks", label: "Tasks", tasks: ungrouped, ...counts });
  }

  return groups;
}

export function FeedView({
  clientFilter,
  onSwitchTab,
}: {
  clientFilter: string | null;
  onSwitchTab?: (tab: string) => void;
}) {
  const tasks = useTaskStore((s) => s.tasks);
  const moveTask = useTaskStore((s) => s.moveTask);
  const [doneExpanded, setDoneExpanded] = useState(true);
  const [doneHovered, setDoneHovered] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [yourTurnTab, setYourTurnTab] = useState<"review" | "tasks">("review");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (t.parentId) return false;
      if (clientFilter && t.clientId !== clientFilter) return false;
      return true;
    });
  }, [tasks, clientFilter]);

  const claudeTasks = useMemo(() => {
    return filtered
      .filter((t) =>
        (t.status === "running" || t.status === "queued") &&
        !t.needsInput &&
        !t.errorMessage
      )
      .sort((a, b) => {
        if (a.status === "running" && b.status !== "running") return -1;
        if (a.status !== "running" && b.status === "running") return 1;
        if (a.status === "running") {
          const aStart = a.startedAt ? new Date(a.startedAt).getTime() : 0;
          const bStart = b.startedAt ? new Date(b.startedAt).getTime() : 0;
          return bStart - aStart;
        }
        return a.columnOrder - b.columnOrder;
      });
  }, [filtered]);

  const yourTurnTasks = useMemo(() => {
    return filtered
      .filter((t) =>
        t.status === "review" ||
        t.needsInput === true ||
        (t.errorMessage !== null && t.status !== "done")
      )
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [filtered]);

  const ideaTasks = useMemo(() => {
    return filtered
      .filter((t) => t.status === "backlog")
      .sort((a, b) => a.columnOrder - b.columnOrder);
  }, [filtered]);

  const doneTasks = useMemo(() => {
    return filtered
      .filter((t) => t.status === "done")
      .sort((a, b) => {
        const aTime = a.completedAt ? new Date(a.completedAt).getTime() : new Date(a.updatedAt).getTime();
        const bTime = b.completedAt ? new Date(b.completedAt).getTime() : new Date(b.updatedAt).getTime();
        return bTime - aTime;
      })
      .slice(0, 6);
  }, [filtered]);

  const totalDone = filtered.filter((t) => t.status === "done").length;
  const hasRunning = claudeTasks.some((t) => t.status === "running");

  // Group by project for dynamic section headers
  const claudeGroups = useMemo(() => groupByProject(claudeTasks), [claudeTasks]);
  const yourTurnGroups = useMemo(() => groupByProject(yourTurnTasks), [yourTurnTasks]);
  // Show section dividers when there are multiple groups, or any goal groups exist
  const hasGoalGroups = claudeGroups.some((g) => g.isGoalGroup) || yourTurnGroups.some((g) => g.isGoalGroup);
  const showSections = claudeGroups.length > 1 || yourTurnGroups.length > 1 || hasGoalGroups;

  // IDs for sortable contexts
  const claudeIds = useMemo(() => claudeTasks.map((t) => t.id), [claudeTasks]);
  const yourTurnIds = useMemo(() => yourTurnTasks.map((t) => t.id), [yourTurnTasks]);
  const ideaIds = useMemo(() => ideaTasks.map((t) => t.id), [ideaTasks]);

  const handleDragStart = (event: DragStartEvent) => {
    const task = filtered.find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const taskId = active.id as string;
    const overId = over.id as string;
    const draggedTask = filtered.find((t) => t.id === taskId);
    if (!draggedTask) return;

    // Determine which list the task belongs to and find the new index
    const findNewOrder = (list: Task[]) => {
      const overIndex = list.findIndex((t) => t.id === overId);
      return overIndex >= 0 ? overIndex : list.length;
    };

    if (claudeIds.includes(taskId) && claudeIds.includes(overId)) {
      moveTask(taskId, draggedTask.status, findNewOrder(claudeTasks));
    } else if (yourTurnIds.includes(taskId) && yourTurnIds.includes(overId)) {
      moveTask(taskId, draggedTask.status, findNewOrder(yourTurnTasks));
    } else if (ideaIds.includes(taskId) && ideaIds.includes(overId)) {
      moveTask(taskId, draggedTask.status, findNewOrder(ideaTasks));
    }
  };

  return (
    <div>
      <TaskCreateInput />

      {/* Two-column layout: Your Turn (left) | Claude's Turn (right) */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveTask(null)}
      >
      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
        {/* LEFT: Your Turn — subtle warm tint when items need attention */}
        <div style={{
          flex: 1,
          minWidth: 0,
          backgroundColor: yourTurnTasks.length > 0 ? "rgba(210, 120, 60, 0.02)" : "transparent",
          borderRadius: 8,
          padding: yourTurnTasks.length > 0 ? "0 4px 8px" : 0,
          transition: "background 200ms ease",
        }}>
          <ColumnHeader
            label="Your Turn"
            count={yourTurnTasks.length}
            dotColor="#D2783C"
            pulse={yourTurnTasks.length > 0}
          />

          {/* Tab switcher: Review / Tasks */}
          {yourTurnTasks.length > 0 && (
            <div style={{
              display: "flex",
              gap: 0,
              marginBottom: 8,
              backgroundColor: "rgba(234, 232, 230, 0.5)",
              borderRadius: 6,
              padding: 2,
            }}>
              {(["review", "tasks"] as const).map((tab) => {
                const active = yourTurnTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setYourTurnTab(tab)}
                    style={{
                      flex: 1,
                      padding: "5px 0",
                      fontSize: 11,
                      fontWeight: 600,
                      fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                      border: "none",
                      borderRadius: 4,
                      cursor: "pointer",
                      backgroundColor: active ? "#FFFFFF" : "transparent",
                      color: active ? "#1B1C1B" : "#9C9CA0",
                      boxShadow: active ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                      transition: "all 120ms ease",
                      textTransform: "capitalize",
                    }}
                  >
                    {tab === "review" ? "Review" : "Tasks"}
                  </button>
                );
              })}
            </div>
          )}

          {yourTurnTab === "review" ? (
            <ReviewQueue tasks={yourTurnTasks} />
          ) : (
            <SortableContext items={yourTurnIds} strategy={verticalListSortingStrategy}>
              {showSections && yourTurnGroups.length > 0 ? (
                yourTurnGroups.map((group) => (
                  <div key={group.key}>
                    <SectionDivider
                      label={group.label}
                      review={group.review}
                      isActive={group.review > 0}
                      isGoalGroup={group.isGoalGroup}
                    />
                    {group.tasks.map((task) => (
                      <FeedCard key={task.id} task={task} />
                    ))}
                  </div>
                ))
              ) : (
                yourTurnTasks.map((task) => (
                  <FeedCard key={task.id} task={task} />
                ))
              )}
            </SortableContext>
          )}

          {yourTurnTasks.length === 0 && (
            <div style={{
              padding: "24px 8px",
              textAlign: "center",
              fontFamily: "var(--font-inter), Inter, sans-serif",
            }}>
              <Check size={16} color="#6B8E6B" style={{ marginBottom: 4 }} />
              <div style={{ fontSize: 12, color: "#6B8E6B", fontWeight: 500 }}>
                You&apos;re all set
              </div>
            </div>
          )}

          {/* Ideas */}
          {ideaTasks.length > 0 && (
            <div>
              <SectionDivider label="Ideas" queued={ideaTasks.length} />
              <SortableContext items={ideaIds} strategy={verticalListSortingStrategy}>
              {ideaTasks.map((task) => (
                <IdeaRow key={task.id} task={task} />
              ))}
              </SortableContext>
            </div>
          )}
        </div>

        {/* RIGHT: Claude's Turn + Scheduled + Done */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <ColumnHeader
            label="Claude's Turn"
            count={claudeTasks.length}
            dotColor="#93452A"
            pulse={hasRunning}
          />

          <SortableContext items={claudeIds} strategy={verticalListSortingStrategy}>
          {claudeTasks.length === 0 ? (
            <div style={{
              padding: "24px 8px",
              textAlign: "center",
              fontFamily: "var(--font-inter), Inter, sans-serif",
            }}>
              <div style={{ fontSize: 12, color: "#B0B0B5" }}>
                Queue empty
              </div>
            </div>
          ) : showSections && claudeGroups.length > 0 ? (
            claudeGroups.map((group) => (
              <div key={group.key}>
                <SectionDivider
                  label={group.label}
                  running={group.running}
                  queued={group.queued}
                  isActive={group.running > 0}
                  isGoalGroup={group.isGoalGroup}
                />
                {group.tasks.map((task) => (
                  <FeedCard key={task.id} task={task} />
                ))}
              </div>
            ))
          ) : (
            claudeTasks.map((task) => (
              <FeedCard key={task.id} task={task} />
            ))
          )}
          </SortableContext>
        </div>
      </div>

      {/* ── Below the fold: Scheduled + Recently Done ─────────────── */}
      {(doneTasks.length > 0 || true /* ScheduledSection handles its own empty */) && (
        <div style={{
          display: "flex",
          gap: 24,
          marginTop: 20,
          paddingTop: 16,
          borderTop: "1px solid rgba(218, 193, 185, 0.2)",
        }}>
          {/* Scheduled */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <ScheduledSection onNavigate={() => onSwitchTab?.("scheduled")} />
          </div>

          {/* Recently Done */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {doneTasks.length > 0 && (
              <div>
                <div
                  onClick={() => setDoneExpanded(!doneExpanded)}
                  onMouseEnter={() => setDoneHovered(true)}
                  onMouseLeave={() => setDoneHovered(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginTop: 16,
                    marginBottom: 6,
                    cursor: "pointer",
                    padding: "2px 4px",
                    borderRadius: 4,
                    backgroundColor: doneHovered ? "rgba(107, 142, 107, 0.04)" : "transparent",
                    transition: "background 100ms ease",
                  }}
                >
                  <Check size={12} color="#6B8E6B" style={{ flexShrink: 0 }} />
                  <span style={{
                    fontSize: 13,
                    fontWeight: 700,
                    fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                    color: "#1B1C1B",
                    whiteSpace: "nowrap",
                  }}>
                    Recently Done
                  </span>
                  <span style={{
                    fontSize: 10,
                    fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                    color: "#6B8E6B",
                  }}>
                    {totalDone}
                  </span>
                  <div style={{ flex: 1, height: 1, backgroundColor: "rgba(107, 142, 107, 0.15)" }} />
                  {doneExpanded
                    ? <ChevronUp size={14} color={doneHovered ? "#6B8E6B" : "#9C9CA0"} />
                    : <ChevronDown size={14} color={doneHovered ? "#6B8E6B" : "#9C9CA0"} />}
                  <ArrowRight
                    size={10}
                    color="#9C9CA0"
                    style={{ flexShrink: 0, cursor: "pointer" }}
                    onClick={(e) => { e.stopPropagation(); onSwitchTab?.("history"); }}
                  />
                </div>
                {doneExpanded && (
                  <div>
                    {doneTasks.map((task) => (
                      <DoneItem key={task.id} task={task} />
                    ))}
                    {totalDone > 6 && (
                      <div
                        onClick={() => onSwitchTab?.("history")}
                        style={{
                          display: "block",
                          fontSize: 11,
                          fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                          color: "#93452A",
                          padding: "4px 8px",
                          cursor: "pointer",
                        }}
                      >
                        View all {totalDone} &rarr;
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <DragOverlay dropAnimation={{ duration: 200, easing: "ease" }}>
        {activeTask ? <FeedCard task={activeTask} isOverlay /> : null}
      </DragOverlay>
      </DndContext>
    </div>
  );
}
