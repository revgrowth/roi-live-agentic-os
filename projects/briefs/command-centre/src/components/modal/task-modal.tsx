"use client";

import { useEffect, useState, useCallback } from "react";
import { useTaskStore } from "@/store/task-store";
import type { LogEntry } from "@/types/task";
import { ModalHeader } from "./modal-header";
import { ModalChat } from "./modal-chat";
import { ModalSidebar } from "./modal-sidebar";
import { ReplyInput } from "./reply-input";

export function TaskModal() {
  const selectedTaskId = useTaskStore((s) => s.selectedTaskId);
  const closePanel = useTaskStore((s) => s.closePanel);
  const tasks = useTaskStore((s) => s.tasks);

  const task = selectedTaskId
    ? tasks.find((t) => t.id === selectedTaskId)
    : null;

  // Local log entries state -- fetched on mount, appended by SSE
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [questionText, setQuestionText] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Fetch log entries when task changes
  useEffect(() => {
    if (!selectedTaskId) {
      setLogEntries([]);
      setQuestionText(null);
      setIsVisible(false);
      return;
    }

    // Animate in
    requestAnimationFrame(() => {
      setIsVisible(true);
    });

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/tasks/${selectedTaskId}/logs`);
        if (!res.ok || cancelled) return;
        const entries = await res.json();
        if (!cancelled) setLogEntries(entries);
      } catch {
        // Silently fail
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedTaskId]);

  // Listen for SSE log and question events via store
  const storeLogEntries = useTaskStore((s) =>
    selectedTaskId ? s.logEntries[selectedTaskId] : undefined
  );
  const storeQuestionText = useTaskStore((s) => s.questionText);

  // Sync store log entries to local state
  useEffect(() => {
    if (storeLogEntries && storeLogEntries.length > 0) {
      setLogEntries(storeLogEntries);
    }
  }, [storeLogEntries]);

  // Sync question text
  useEffect(() => {
    setQuestionText(storeQuestionText);
  }, [storeQuestionText]);

  // Escape to close
  useEffect(() => {
    if (!selectedTaskId) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePanel();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedTaskId, closePanel]);

  // Optimistic reply handler
  const handleOptimisticReply = useCallback((entry: LogEntry) => {
    setLogEntries((prev) => [...prev, entry]);
    setQuestionText(null);
  }, []);

  if (!selectedTaskId || !task) return null;

  const isRunning = task.status === "running";
  const showReplyInput =
    task.status === "review" && questionText !== null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={closePanel}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(252, 249, 247, 0.8)",
          backdropFilter: "blur(12px)",
          zIndex: 100,
          opacity: isVisible ? 1 : 0,
          transition: "opacity 200ms ease-out",
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          inset: "24px",
          backgroundColor: "#FFFFFF",
          borderRadius: "0.75rem",
          boxShadow: "0px 12px 32px rgba(147, 69, 42, 0.06)",
          zIndex: 101,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          transform: isVisible ? "scale(1)" : "scale(0.98)",
          opacity: isVisible ? 1 : 0,
          transition: "transform 200ms ease-out, opacity 200ms ease-out",
        }}
      >
        {/* Header */}
        <ModalHeader task={task} onClose={closePanel} />

        {/* Main area */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            overflow: "hidden",
          }}
        >
          {/* Left: Chat + Reply */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <ModalChat
              taskId={task.id}
              logEntries={logEntries}
              isRunning={isRunning}
              questionText={questionText}
            />
            <ReplyInput
              taskId={task.id}
              isVisible={showReplyInput}
              onOptimisticReply={handleOptimisticReply}
            />
          </div>

          {/* Right: Sidebar */}
          <ModalSidebar task={task} />
        </div>
      </div>
    </>
  );
}
