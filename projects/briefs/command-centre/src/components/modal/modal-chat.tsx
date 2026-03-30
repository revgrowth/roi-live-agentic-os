"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ArrowUp } from "lucide-react";
import type { Task, LogEntry } from "@/types/task";
import { ChatEntry, TextGroup, ToolSummaryBlock } from "./chat-entry";

/**
 * Group consecutive entries for business-focused rendering:
 * - Consecutive text entries → TextGroup (merged prose)
 * - Consecutive tool_use / tool_result entries → ToolSummaryBlock (collapsed summary)
 * - Everything else (question, user_reply, system) → individual ChatEntry
 */
type RenderItem =
  | { kind: "text-group"; entries: LogEntry[] }
  | { kind: "tool-group"; entries: LogEntry[] }
  | { kind: "single"; entry: LogEntry }
  | { kind: "child-question"; childTask: Task; entry: LogEntry }
  | { kind: "child-review"; childTask: Task };

/** A merged timeline entry with a sort key */
type TimelineEntry =
  | { kind: "parent"; entry: LogEntry }
  | { kind: "child-question"; childTask: Task; entry: LogEntry }
  | { kind: "child-review"; childTask: Task; timestamp: string };

function groupEntries(entries: LogEntry[]): RenderItem[] {
  const items: RenderItem[] = [];
  let currentTextGroup: LogEntry[] = [];
  let currentToolGroup: LogEntry[] = [];

  const flushTextGroup = () => {
    if (currentTextGroup.length > 0) {
      items.push({ kind: "text-group", entries: [...currentTextGroup] });
      currentTextGroup = [];
    }
  };

  const flushToolGroup = () => {
    if (currentToolGroup.length > 0) {
      items.push({ kind: "tool-group", entries: [...currentToolGroup] });
      currentToolGroup = [];
    }
  };

  for (const entry of entries) {
    if (entry.type === "text") {
      flushToolGroup();
      currentTextGroup.push(entry);
    } else if (entry.type === "tool_use" || entry.type === "tool_result") {
      flushTextGroup();
      currentToolGroup.push(entry);
    } else {
      flushTextGroup();
      flushToolGroup();
      items.push({ kind: "single", entry });
    }
  }
  flushTextGroup();
  flushToolGroup();

  return items;
}

/**
 * Build a merged timeline of parent log entries and child task events,
 * then group the parent entries as before while inserting child events
 * at the correct chronological position.
 */
function buildMergedTimeline(
  parentEntries: LogEntry[],
  childTasks: Task[],
  childLogEntries: Record<string, LogEntry[]>,
): RenderItem[] {
  // Collect all timeline entries
  const timeline: TimelineEntry[] = [];

  // Add all parent entries
  for (const entry of parentEntries) {
    timeline.push({ kind: "parent", entry });
  }

  // Add child question entries and review banners
  for (const child of childTasks) {
    const childLogs = childLogEntries[child.id] || [];
    for (const entry of childLogs) {
      if (entry.type === "question") {
        timeline.push({ kind: "child-question", childTask: child, entry });
      }
    }
    // If child is in review status, add a review banner
    if (child.status === "review") {
      timeline.push({
        kind: "child-review",
        childTask: child,
        timestamp: child.updatedAt,
      });
    }
  }

  // Sort by timestamp
  timeline.sort((a, b) => {
    const tsA = a.kind === "parent" ? a.entry.timestamp
      : a.kind === "child-question" ? a.entry.timestamp
      : a.timestamp;
    const tsB = b.kind === "parent" ? b.entry.timestamp
      : b.kind === "child-question" ? b.entry.timestamp
      : b.timestamp;
    return tsA.localeCompare(tsB);
  });

  // Now group: collect consecutive parent entries and group them,
  // insert child events as standalone items
  const result: RenderItem[] = [];
  let parentBuffer: LogEntry[] = [];

  const flushParentBuffer = () => {
    if (parentBuffer.length > 0) {
      result.push(...groupEntries(parentBuffer));
      parentBuffer = [];
    }
  };

  for (const item of timeline) {
    if (item.kind === "parent") {
      parentBuffer.push(item.entry);
    } else if (item.kind === "child-question") {
      flushParentBuffer();
      result.push({ kind: "child-question", childTask: item.childTask, entry: item.entry });
    } else if (item.kind === "child-review") {
      flushParentBuffer();
      result.push({ kind: "child-review", childTask: item.childTask });
    }
  }
  flushParentBuffer();

  return result;
}

/** Compact inline reply input for child task questions */
function ChildReplyInput({ childTaskId, onReplySent }: { childTaskId: string; onReplySent: (childId: string, message: string) => void }) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = useCallback(async () => {
    const trimmed = message.trim();
    if (!trimmed || isSending) return;

    setIsSending(true);
    setMessage("");

    try {
      const res = await fetch(`/api/tasks/${childTaskId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      if (res.ok) {
        onReplySent(childTaskId, trimmed);
      }
    } catch {
      // Silently fail
    } finally {
      setIsSending(false);
    }
  }, [message, isSending, childTaskId, onReplySent]);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
        placeholder="Reply to this subtask..."
        style={{
          flex: 1,
          fontSize: 13,
          fontFamily: "var(--font-inter), Inter, sans-serif",
          padding: "6px 10px",
          backgroundColor: "#FFFFFF",
          border: "1px solid rgba(218, 193, 185, 0.4)",
          borderRadius: "0.375rem",
          color: "#1B1C1B",
          outline: "none",
          lineHeight: 1.4,
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = "#93452A"; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(218, 193, 185, 0.4)"; }}
      />
      <button
        onClick={handleSubmit}
        disabled={!message.trim() || isSending}
        style={{
          width: 28,
          height: 28,
          borderRadius: "0.375rem",
          border: "none",
          background: message.trim() && !isSending
            ? "linear-gradient(135deg, #93452A, #B25D3F)"
            : "#EAE8E6",
          color: message.trim() && !isSending ? "#FFFFFF" : "#5E5E65",
          cursor: message.trim() && !isSending ? "pointer" : "default",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "background 150ms ease",
        }}
      >
        <ArrowUp size={14} />
      </button>
    </div>
  );
}

interface ModalChatProps {
  taskId: string;
  logEntries: LogEntry[];
  isRunning: boolean;
  needsInput: boolean;
  status: string;
  childTasks?: Task[];
  childLogEntries?: Record<string, LogEntry[]>;
}

export function ModalChat({
  logEntries,
  isRunning,
  needsInput,
  status,
  childTasks = [],
  childLogEntries = {},
}: ModalChatProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const prevLengthRef = useRef(logEntries.length);

  // Auto-scroll on new entries
  useEffect(() => {
    if (logEntries.length > prevLengthRef.current && isAutoScrolling) {
      const el = scrollRef.current;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    }
    prevLengthRef.current = logEntries.length;
  }, [logEntries.length, isAutoScrolling]);

  // Detect user scroll
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const isNearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 40;
    setIsAutoScrolling(isNearBottom);
  }, []);

  const jumpToLatest = useCallback(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
    setIsAutoScrolling(true);
  }, []);

  // Track child replies sent inline so they appear immediately
  const [childReplies, setChildReplies] = useState<Record<string, string[]>>({});

  const handleChildReplySent = useCallback((childId: string, message: string) => {
    setChildReplies((prev) => ({
      ...prev,
      [childId]: [...(prev[childId] || []), message],
    }));
  }, []);

  const hasChildren = childTasks.length > 0;
  const hasEntries = logEntries.length > 0;
  const neverStarted = status === "backlog" || status === "queued";
  const showEmpty = !hasEntries && !hasChildren && neverStarted;
  const showLoading = !hasEntries && !hasChildren && !neverStarted && !isRunning;
  const showTyping = isRunning && !hasEntries && !needsInput;

  // Build merged timeline when there are child tasks, otherwise use simple grouping
  const renderItems = hasChildren
    ? buildMergedTimeline(logEntries, childTasks, childLogEntries)
    : groupEntries(logEntries);

  // Set of child task IDs that currently need input (have unanswered questions)
  const childrenNeedingInput = new Set(
    childTasks.filter((c) => c.needsInput).map((c) => c.id)
  );

  return (
    <div
      style={{
        flex: 1,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px 24px 16px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {/* Empty state */}
        {showEmpty && (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: 14,
                fontFamily: "var(--font-inter), Inter, sans-serif",
                color: "#5E5E65",
              }}
            >
              Task has not been executed yet
            </span>
          </div>
        )}

        {/* Loading state */}
        {showLoading && (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: 14,
                fontFamily: "var(--font-inter), Inter, sans-serif",
                color: "#5E5E65",
              }}
            >
              Loading logs...
            </span>
          </div>
        )}

        {/* Typing indicator */}
        {showTyping && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "14px 18px",
            }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: "#93452A",
                  animation: `typing-dot 1.4s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
            <style>{`
              @keyframes typing-dot {
                0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
                40% { opacity: 1; transform: scale(1); }
              }
            `}</style>
          </div>
        )}

        {/* Log entries — business-focused grouping with child task events */}
        {renderItems.map((item) => {
          if (item.kind === "text-group") {
            return (
              <TextGroup
                key={item.entries[0].id}
                entries={item.entries}
              />
            );
          }
          if (item.kind === "tool-group") {
            return (
              <ToolSummaryBlock
                key={item.entries[0].id}
                entries={item.entries}
              />
            );
          }
          if (item.kind === "child-question") {
            const replied = (childReplies[item.childTask.id] || []).length > 0;
            const showReplyInput = childrenNeedingInput.has(item.childTask.id) && !replied;
            return (
              <div
                key={`child-q-${item.entry.id}`}
                style={{
                  width: "100%",
                  backgroundColor: "#FFF5F0",
                  borderLeft: "3px solid #93452A",
                  borderRadius: "0 0.5rem 0.5rem 0",
                  padding: "12px 16px",
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                    fontWeight: 600,
                    color: "#93452A",
                    marginBottom: 6,
                    textTransform: "uppercase",
                    letterSpacing: "0.02em",
                  }}
                >
                  {item.childTask.title} is asking:
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontFamily: "var(--font-inter), Inter, sans-serif",
                    color: "#1B1C1B",
                    lineHeight: 1.6,
                  }}
                >
                  {item.entry.content}
                </div>
                {/* Show inline replies already sent */}
                {(childReplies[item.childTask.id] || []).map((reply, ri) => (
                  <div
                    key={`cr-${ri}`}
                    style={{
                      marginTop: 8,
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "rgba(147, 69, 42, 0.06)",
                        border: "1px solid rgba(218, 193, 185, 0.3)",
                        color: "#1B1C1B",
                        borderRadius: "0.5rem 0.5rem 0.25rem 0.5rem",
                        padding: "6px 10px",
                        fontSize: 13,
                        fontFamily: "var(--font-inter), Inter, sans-serif",
                        maxWidth: "80%",
                      }}
                    >
                      {reply}
                    </div>
                  </div>
                ))}
                {showReplyInput && (
                  <ChildReplyInput
                    childTaskId={item.childTask.id}
                    onReplySent={handleChildReplySent}
                  />
                )}
              </div>
            );
          }
          if (item.kind === "child-review") {
            return (
              <div
                key={`child-rev-${item.childTask.id}`}
                style={{
                  width: "100%",
                  backgroundColor: "#FFF5F0",
                  borderLeft: "3px solid #93452A",
                  borderRadius: "0 0.5rem 0.5rem 0",
                  padding: "10px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    fontFamily: "var(--font-inter), Inter, sans-serif",
                    color: "#1B1C1B",
                    lineHeight: 1.5,
                  }}
                >
                  <strong style={{ color: "#93452A" }}>{item.childTask.title}</strong> is ready for review
                </span>
              </div>
            );
          }
          if (item.kind === "single") {
            return <ChatEntry key={item.entry.id} entry={item.entry} />;
          }
          return null;
        })}

        {/* Question indicator */}
        {needsInput === true && logEntries.length > 0 && (
          <div
            style={{
              fontSize: 12,
              fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
              color: "#93452A",
              fontStyle: "italic",
              textAlign: "center",
              padding: "8px 0",
            }}
          >
            Waiting for your reply...
          </div>
        )}
      </div>

      {/* Jump to latest button */}
      {!isAutoScrolling && hasEntries && (
        <button
          onClick={jumpToLatest}
          style={{
            position: "absolute",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            backgroundColor: "rgba(252, 249, 247, 0.9)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(218, 193, 185, 0.3)",
            borderRadius: "1rem",
            padding: "8px 16px",
            fontSize: 12,
            fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
            color: "#93452A",
            cursor: "pointer",
          }}
        >
          Jump to latest
        </button>
      )}
    </div>
  );
}
