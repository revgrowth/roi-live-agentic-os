"use client";

import { useState, useEffect, Fragment, type ReactNode } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import type { Task } from "@/types/task";

const MONO = "'DM Mono', 'JetBrains Mono', 'SF Mono', ui-monospace, monospace";
const PAGE_SIZE = 5;

type ColKey = "inProgress" | "inReview" | "done";

export interface SwimLane {
  /** null = root / general */
  clientSlug: string | null;
  clientName: string;
  clientColor: string;
  inProgress: Task[];
  inReview: Task[];
  done: Task[];
}

export interface KanbanBoardProps {
  lanes: SwimLane[];
  singleLane: boolean;
  renderCard: (task: Task, column: ColKey) => ReactNode;
  draggingId: string | null;
  onDropColumn: (column: ColKey, e: React.DragEvent) => void;
  onDragOverColumn: (column: ColKey, e: React.DragEvent) => void;
  onDragLeaveColumn: (column: ColKey) => void;
  dropOverColumn: ColKey | null;
  isEmpty: boolean;
  /** When true, hide the Done column entirely (e.g. when drawer is wide) */
  hideDone?: boolean;
}

const COL_META: { key: ColKey; label: string; emptyText: string }[] = [
  { key: "inProgress", label: "Claude's Turn", emptyText: "No active tasks" },
  { key: "inReview", label: "Your Turn", emptyText: "Nothing to review" },
  { key: "done", label: "Done", emptyText: "No completed tasks" },
];

const STACK_BREAKPOINT = 768;

function useIsNarrow() {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(`(max-width: ${STACK_BREAKPOINT}px)`);
    setNarrow(mq.matches);
    const handler = (e: MediaQueryListEvent) => setNarrow(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return narrow;
}

export function KanbanBoard({
  lanes,
  singleLane,
  renderCard,
  draggingId,
  onDropColumn,
  onDragOverColumn,
  onDragLeaveColumn,
  dropOverColumn,
  isEmpty,
  hideDone,
}: KanbanBoardProps) {
  const isDragging = !!draggingId;
  const isNarrow = useIsNarrow();
  const visibleCols = hideDone ? COL_META.filter((c) => c.key !== "done") : COL_META;

  // Build grid template with 1px divider columns between content columns
  // e.g. "minmax(0,1fr) 1px minmax(0,1fr) 1px minmax(0,1fr)" for 3 content columns
  // minmax(0,1fr) forces truly equal widths regardless of content
  const gridTemplate = isNarrow
    ? undefined
    : visibleCols.map(() => "minmax(0,1fr)").join(" 1px ");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {/* Column headers — desktop only */}
      {!isNarrow && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: gridTemplate,
            marginBottom: 0,
          }}
        >
          {visibleCols.map((col, i) => {
            const count = lanes.reduce((sum, l) => sum + l[col.key].length, 0);
            return (
              <Fragment key={col.key}>
                {i > 0 && <div />}
                <div
                  style={{
                    fontSize: 11,
                    fontFamily: MONO,
                    fontWeight: 600,
                    color: "#999",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    padding: "6px 4px",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    borderBottom: "1px solid rgba(218, 193, 185, 0.35)",
                  }}
                >
                  {col.label}
                  {count > 0 && (
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily: MONO,
                        color: "#bbb",
                        backgroundColor: "rgba(218, 193, 185, 0.15)",
                        padding: "1px 6px",
                        borderRadius: 8,
                      }}
                    >
                      {count}
                    </span>
                  )}
                </div>
              </Fragment>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {lanes.length === 0 && isEmpty && (
        <div
          style={{
            display: isNarrow ? "flex" : "grid",
            flexDirection: isNarrow ? "column" : undefined,
            gridTemplateColumns: gridTemplate,
          }}
        >
          {visibleCols.map((col, i) => (
            <Fragment key={col.key}>
              {!isNarrow && i > 0 && <div style={{ backgroundColor: "rgba(218, 193, 185, 0.35)" }} />}
              <EmptyColumn text="No goals yet — enter one above to get started" />
            </Fragment>
          ))}
        </div>
      )}

      {/* Swim lanes */}
      {lanes.map((lane) => (
        <LaneRow
          key={lane.clientSlug ?? "_root"}
          lane={lane}
          singleLane={singleLane}
          renderCard={renderCard}
          isDragging={isDragging}
          dropOverColumn={dropOverColumn}
          onDropColumn={onDropColumn}
          onDragOverColumn={onDragOverColumn}
          onDragLeaveColumn={onDragLeaveColumn}
          isNarrow={isNarrow}
          visibleCols={visibleCols}
          gridTemplate={gridTemplate}
        />
      ))}
    </div>
  );
}

function LaneRow({
  lane,
  singleLane,
  renderCard,
  isDragging,
  dropOverColumn,
  onDropColumn,
  onDragOverColumn,
  onDragLeaveColumn,
  isNarrow,
  visibleCols,
  gridTemplate,
}: {
  lane: SwimLane;
  singleLane: boolean;
  renderCard: (task: Task, column: ColKey) => ReactNode;
  isDragging: boolean;
  dropOverColumn: ColKey | null;
  onDropColumn: (column: ColKey, e: React.DragEvent) => void;
  onDragOverColumn: (column: ColKey, e: React.DragEvent) => void;
  onDragLeaveColumn: (column: ColKey) => void;
  isNarrow: boolean;
  visibleCols: typeof COL_META;
  gridTemplate: string | undefined;
}) {
  const [laneCollapsed, setLaneCollapsed] = useState(false);
  const totalTasks = lane.inProgress.length + lane.inReview.length + lane.done.length;

  return (
    <div style={{ marginBottom: singleLane ? 0 : 4 }}>
      {/* Swim lane header — only when multiple clients */}
      {!singleLane && (
        <button
          onClick={() => setLaneCollapsed((v) => !v)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 8px 6px",
            margin: 0,
            background: "none",
            border: "none",
            borderBottom: "1px solid rgba(218, 193, 185, 0.2)",
            cursor: "pointer",
            width: "100%",
            textAlign: "left",
          }}
        >
          <ChevronRight
            size={12}
            color="#999"
            style={{
              transition: "transform 150ms ease",
              transform: laneCollapsed ? "rotate(0deg)" : "rotate(90deg)",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 12,
              fontFamily: MONO,
              fontWeight: 600,
              color: "#555",
            }}
          >
            {lane.clientName}
          </span>
          <span
            style={{
              fontSize: 10,
              fontFamily: MONO,
              color: "#bbb",
              marginLeft: 2,
            }}
          >
            {totalTasks}
          </span>
        </button>
      )}

      {/* Lane content */}
      {!laneCollapsed && (
        <div
          style={{
            display: isNarrow ? "flex" : "grid",
            flexDirection: isNarrow ? "column" : undefined,
            gridTemplateColumns: gridTemplate,
            alignItems: "start",
            paddingTop: singleLane ? 0 : 8,
          }}
        >
          {visibleCols.map((col, i) => (
            <Fragment key={col.key}>
              {!isNarrow && i > 0 && (
                <div style={{ backgroundColor: "rgba(218, 193, 185, 0.35)", alignSelf: "stretch" }} />
              )}
              <ColumnCell
                col={col}
                tasks={lane[col.key]}
                isNarrow={isNarrow}
                isDragging={isDragging}
                dropOverColumn={dropOverColumn}
                onDropColumn={onDropColumn}
                onDragOverColumn={onDragOverColumn}
                onDragLeaveColumn={onDragLeaveColumn}
                renderCard={renderCard}
              />
            </Fragment>
          ))}
        </div>
      )}
    </div>
  );
}

/** Column cell — shows PAGE_SIZE tasks, with expand/collapse when more exist */
function ColumnCell({
  col,
  tasks: allTasks,
  isNarrow,
  isDragging,
  dropOverColumn,
  onDropColumn,
  onDragOverColumn,
  onDragLeaveColumn,
  renderCard,
}: {
  col: { key: ColKey; label: string; emptyText: string };
  tasks: Task[];
  isNarrow: boolean;
  isDragging: boolean;
  dropOverColumn: ColKey | null;
  onDropColumn: (column: ColKey, e: React.DragEvent) => void;
  onDragOverColumn: (column: ColKey, e: React.DragEvent) => void;
  onDragLeaveColumn: (column: ColKey) => void;
  renderCard: (task: Task, column: ColKey) => ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);

  const hasOverflow = allTasks.length > PAGE_SIZE;
  const visibleTasks = expanded ? allTasks : allTasks.slice(0, PAGE_SIZE);
  const hiddenCount = allTasks.length - PAGE_SIZE;

  const isDoneCol = col.key === "done";
  const isOver = dropOverColumn === col.key;
  const borderColor = isDragging
    ? isOver
      ? isDoneCol ? "#7ab87a" : "rgba(99, 102, 241, 0.5)"
      : isDoneCol ? "rgba(122, 184, 122, 0.4)" : "rgba(218, 193, 185, 0.3)"
    : "transparent";
  const bgColor = isDragging
    ? isOver
      ? isDoneCol ? "rgba(122, 184, 122, 0.06)" : "rgba(99, 102, 241, 0.03)"
      : "transparent"
    : "transparent";

  return (
    <div>
      {/* Narrow-mode column label */}
      {isNarrow && (
        <div
          style={{
            fontSize: 10,
            fontFamily: MONO,
            fontWeight: 600,
            color: "#999",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            padding: "8px 8px 4px",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {col.label}
          {allTasks.length > 0 && (
            <span
              style={{
                fontSize: 10,
                fontFamily: MONO,
                color: "#bbb",
                backgroundColor: "rgba(218, 193, 185, 0.15)",
                padding: "1px 6px",
                borderRadius: 8,
              }}
            >
              {allTasks.length}
            </span>
          )}
        </div>
      )}

      {/* Column drop zone + cards */}
      <div
        onDrop={(e) => { e.preventDefault(); onDropColumn(col.key, e); }}
        onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; onDragOverColumn(col.key, e); }}
        onDragLeave={() => onDragLeaveColumn(col.key)}
        style={{
          minHeight: isNarrow ? 40 : 80,
          borderRadius: 10,
          border: isDragging
            ? isOver
              ? `2px solid ${borderColor}`
              : `2px dashed ${borderColor}`
            : "2px solid transparent",
          backgroundColor: bgColor,
          padding: 4,
          transition: "all 150ms ease",
          display: "flex",
          flexDirection: "column",
          gap: 0,
        }}
      >
        {allTasks.length === 0 ? (
          <EmptyColumn text={col.emptyText} compact={isNarrow} />
        ) : (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 0,
                borderRadius: 10,
                overflow: "hidden",
                borderBottom: "1px solid rgba(218, 193, 185, 0.35)",
              }}
            >
              {visibleTasks.map((task) => renderCard(task, col.key))}
            </div>

            {/* Expand / Collapse toggle */}
            {hasOverflow && (
              <button
                onClick={() => setExpanded((v) => !v)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  padding: "6px 12px",
                  marginTop: 6,
                  borderRadius: 6,
                  border: "1px dashed rgba(218, 193, 185, 0.35)",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: 11,
                  fontFamily: MONO,
                  color: "#999",
                  transition: "all 120ms ease",
                  width: "100%",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(218, 193, 185, 0.08)";
                  e.currentTarget.style.color = "#666";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#999";
                }}
              >
                {expanded ? (
                  <>
                    <ChevronDown size={11} style={{ transform: "rotate(180deg)" }} />
                    Show less
                  </>
                ) : (
                  <>
                    <ChevronDown size={11} />
                    +{hiddenCount} more
                  </>
                )}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function EmptyColumn({ text, compact }: { text: string; compact?: boolean }) {
  return (
    <div
      style={{
        borderRadius: 10,
        border: "1.5px dashed rgba(218, 193, 185, 0.35)",
        padding: compact ? "14px 12px" : "28px 16px",
        textAlign: "center",
        color: "#bbb",
        fontSize: 12,
        fontFamily: MONO,
      }}
    >
      {text}
    </div>
  );
}
