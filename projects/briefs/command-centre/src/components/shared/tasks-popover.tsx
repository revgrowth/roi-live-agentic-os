"use client";

import { useEffect, useRef, useState } from "react";
import { ListChecks, Check, Loader2, ChevronRight } from "lucide-react";
import type { Todo } from "@/types/task";

export interface SubtaskSummary {
  id: string;
  title: string;
  status: string;
}

interface TasksPopoverProps {
  /** Claude's internal TodoWrite progress for the current run. */
  todos: Todo[];
  /** Real child subtasks of the parent task, if any. Takes precedence
   *  over `todos` when non-empty. */
  subtasks?: SubtaskSummary[];
  /** Optional click handler for a subtask row (e.g. open subtask). */
  onSelectSubtask?: (id: string) => void;
}

const SUBTASK_DONE = new Set(["done", "completed", "review"]);
const SUBTASK_RUNNING = new Set(["running", "queued"]);

function subtaskBucket(status: string): "done" | "running" | "pending" {
  if (SUBTASK_DONE.has(status)) return "done";
  if (SUBTASK_RUNNING.has(status)) return "running";
  return "pending";
}

export function TasksPopover({ todos, subtasks, onSelectSubtask }: TasksPopoverProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const hasSubtasks = (subtasks?.length ?? 0) > 0;
  const total = hasSubtasks ? subtasks!.length : todos.length;
  const completed = hasSubtasks
    ? subtasks!.filter((s) => subtaskBucket(s.status) === "done").length
    : todos.filter((t) => t.status === "completed").length;
  const progress = total > 0 ? completed / total : 0;

  const headerLabel = hasSubtasks ? "Subtasks" : "Todos";
  const buttonLabel = hasSubtasks ? "Subtasks" : "Todos";

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title={buttonLabel}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          height: 26,
          padding: "0 8px",
          borderRadius: 6,
          border: "none",
          background: "transparent",
          color: "#5E5E65",
          fontSize: 12,
          fontWeight: 500,
          fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(0,0,0,0.04)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
        }}
      >
        <ListChecks size={13} />
        {buttonLabel}
        {total > 0 ? ` · ${completed}/${total}` : ""}
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: "100%",
            marginBottom: 6,
            width: 320,
            maxHeight: 360,
            backgroundColor: "#FFFFFF",
            border: "1px solid rgba(218, 193, 185, 0.3)",
            borderRadius: 10,
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
            zIndex: 200,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: "10px 12px 8px",
              borderBottom: "1px solid #EAE8E6",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: 12,
                fontWeight: 600,
                fontFamily:
                  "var(--font-space-grotesk), Space Grotesk, sans-serif",
                color: "#1B1C1B",
                marginBottom: 6,
              }}
            >
              <span>{headerLabel}</span>
              <span style={{ color: "#5E5E65", fontWeight: 500 }}>
                {completed}/{total} completed
              </span>
            </div>
            <div
              style={{
                height: 4,
                borderRadius: 2,
                background: "#EAE8E6",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progress * 100}%`,
                  background: "#22a06b",
                  transition: "width 200ms ease",
                }}
              />
            </div>
          </div>
          <div style={{ overflowY: "auto", padding: "4px 0" }}>
            {total === 0 && (
              <div style={{
                padding: "12px",
                fontSize: 12,
                color: "#9C9CA0",
                fontFamily: "var(--font-inter), Inter, sans-serif",
                textAlign: "center",
              }}>
                No {hasSubtasks ? "subtasks" : "todos"} yet.
              </div>
            )}
            {hasSubtasks &&
              subtasks!.map((st) => {
                const bucket = subtaskBucket(st.status);
                const done = bucket === "done";
                const running = bucket === "running";
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => {
                      if (onSelectSubtask) {
                        onSelectSubtask(st.id);
                        setOpen(false);
                      }
                    }}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 8,
                      padding: "8px 12px",
                      width: "100%",
                      textAlign: "left",
                      border: "none",
                      background: "transparent",
                      cursor: onSelectSubtask ? "pointer" : "default",
                      fontSize: 12,
                      fontFamily: "var(--font-inter), Inter, sans-serif",
                      color: done ? "#9C9CA0" : "#1B1C1B",
                    }}
                    onMouseEnter={(e) => {
                      if (onSelectSubtask)
                        e.currentTarget.style.background = "rgba(0,0,0,0.04)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <div
                      style={{
                        flexShrink: 0,
                        width: 14,
                        height: 14,
                        borderRadius: 4,
                        border: `1.5px solid ${
                          done ? "#22a06b" : running ? "#93452A" : "#d4cfc9"
                        }`,
                        background: done ? "#22a06b" : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 1,
                      }}
                    >
                      {done && <Check size={10} color="#fff" strokeWidth={3} />}
                      {running && (
                        <Loader2 size={9} color="#93452A" className="animate-spin" />
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span
                        style={{
                          textDecoration: done ? "line-through" : "none",
                          lineHeight: 1.4,
                          fontWeight: running ? 600 : 400,
                        }}
                      >
                        {st.title}
                      </span>
                      {running && (
                        <div
                          style={{
                            fontSize: 10,
                            fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                            color: "#93452A",
                            marginTop: 2,
                          }}
                        >
                          {st.status === "running" ? "working..." : "queued"}
                        </div>
                      )}
                    </div>
                    {onSelectSubtask && (
                      <ChevronRight
                        size={12}
                        color="#b5b3b0"
                        style={{ flexShrink: 0 }}
                      />
                    )}
                  </button>
                );
              })}
            {!hasSubtasks &&
              todos.map((todo, i) => {
                const done = todo.status === "completed";
                const inProgress = todo.status === "in_progress";
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 8,
                      padding: "8px 12px",
                      fontSize: 12,
                      fontFamily: "var(--font-inter), Inter, sans-serif",
                      color: done ? "#9C9CA0" : "#1B1C1B",
                    }}
                  >
                    <div
                      style={{
                        flexShrink: 0,
                        width: 14,
                        height: 14,
                        borderRadius: 4,
                        border: `1.5px solid ${
                          done ? "#22a06b" : inProgress ? "#93452A" : "#d4cfc9"
                        }`,
                        background: done ? "#22a06b" : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 1,
                      }}
                    >
                      {done && <Check size={10} color="#fff" strokeWidth={3} />}
                    </div>
                    <span
                      style={{
                        textDecoration: done ? "line-through" : "none",
                        lineHeight: 1.4,
                        fontWeight: inProgress ? 600 : 400,
                      }}
                    >
                      {inProgress && todo.activeForm ? todo.activeForm : todo.content}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
