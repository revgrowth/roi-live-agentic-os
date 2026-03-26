"use client";

import { useEffect, useState, useCallback } from "react";
import { useTaskStore } from "@/store/task-store";
import type { LogEntry, OutputFile } from "@/types/task";
import { ModalHeader } from "./modal-header";
import { ModalChat } from "./modal-chat";
import { ReplyInput } from "./reply-input";
import { ModalFilePreview } from "./modal-file-preview";
import { ModalSummaryTab } from "./modal-summary-tab";
import { ModalNewTaskForm } from "./modal-new-task-form";
import { TaskProgress } from "./task-progress";
import { PanelOutputs } from "../panel/panel-outputs";

// Stable reference to avoid infinite re-render loop in Zustand selector
const EMPTY_LOG_ENTRIES: LogEntry[] = [];

/** Which drilldown view is active, or null for the dashboard */
type DrillView = "chat" | "outputs" | null;

export function TaskModal() {
  const selectedTaskId = useTaskStore((s) => s.selectedTaskId);
  const closePanel = useTaskStore((s) => s.closePanel);
  const tasks = useTaskStore((s) => s.tasks);
  const fetchLogEntries = useTaskStore((s) => s.fetchLogEntries);

  const [isVisible, setIsVisible] = useState(false);
  const [activeFile, setActiveFile] = useState<OutputFile | null>(null);
  const [drillView, setDrillView] = useState<DrillView>(null);
  const [newTaskAttachment, setNewTaskAttachment] = useState<{ fileName: string; relativePath: string } | null>(null);

  // Navigation stack for viewing subtasks within the modal
  const [navStack, setNavStack] = useState<string[]>([]);
  const viewingTaskId = navStack.length > 0 ? navStack[navStack.length - 1] : selectedTaskId;

  const task = viewingTaskId
    ? tasks.find((t) => t.id === viewingTaskId)
    : null;

  // Get child tasks for parent tasks (level !== "task")
  const isParentTask = task && task.level !== "task";
  const childTasks = isParentTask
    ? tasks.filter((t) => t.parentId === viewingTaskId).sort((a, b) => a.columnOrder - b.columnOrder)
    : [];

  // Navigate into a subtask without closing the modal
  const navigateToChild = useCallback((childId: string) => {
    setNavStack((prev) => [...prev, childId]);
    setActiveFile(null);
    setDrillView(null);
  }, []);

  // Navigate back to parent
  const navigateBack = useCallback(() => {
    setNavStack((prev) => prev.slice(0, -1));
    setActiveFile(null);
    setDrillView(null);
  }, []);

  const hasNavHistory = navStack.length > 0;

  // Fetch log entries into the store when task changes
  useEffect(() => {
    if (!selectedTaskId) {
      setIsVisible(false);
      setActiveFile(null);
      setDrillView(null);
      setNewTaskAttachment(null);
      setNavStack([]);
      return;
    }

    setActiveFile(null);
    setDrillView(null);
    setNewTaskAttachment(null);
    setNavStack([]);

    // Animate in
    requestAnimationFrame(() => {
      setIsVisible(true);
    });

    // Load persisted logs into the store (SSE will append to the same store entry)
    fetchLogEntries(selectedTaskId);
  }, [selectedTaskId, fetchLogEntries]);

  // Fetch log entries for the currently viewed task + its children
  useEffect(() => {
    if (!viewingTaskId) return;
    fetchLogEntries(viewingTaskId);
  }, [viewingTaskId, fetchLogEntries]);

  // Fetch log entries for all child tasks
  useEffect(() => {
    if (!isParentTask || childTasks.length === 0) return;
    for (const child of childTasks) {
      fetchLogEntries(child.id);
    }
    // Only re-fetch when the set of child IDs changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isParentTask, childTasks.map((c) => c.id).join(","), fetchLogEntries]);

  // Read logs directly from the store — single source of truth
  const allLogEntries = useTaskStore((s) => s.logEntries);
  const logEntries = (viewingTaskId ? allLogEntries[viewingTaskId] : undefined) ?? EMPTY_LOG_ENTRIES;

  // Build child log entries record
  const childLogEntries: Record<string, LogEntry[]> = {};
  if (isParentTask) {
    for (const child of childTasks) {
      childLogEntries[child.id] = allLogEntries[child.id] ?? EMPTY_LOG_ENTRIES;
    }
  }

  // Escape to close (or go back through nav stack)
  useEffect(() => {
    if (!selectedTaskId) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (activeFile) {
          setActiveFile(null);
        } else if (newTaskAttachment) {
          setNewTaskAttachment(null);
        } else if (drillView) {
          setDrillView(null);
        } else if (hasNavHistory) {
          navigateBack();
        } else {
          closePanel();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedTaskId, closePanel, activeFile, newTaskAttachment, drillView, hasNavHistory, navigateBack]);

  // Optimistic reply handler
  const appendLogEntry = useTaskStore((s) => s.appendLogEntry);
  const handleOptimisticReply = useCallback((entry: LogEntry) => {
    if (viewingTaskId) {
      appendLogEntry(viewingTaskId, entry);
    }
  }, [viewingTaskId, appendLogEntry]);

  const handleFileClick = useCallback((file: OutputFile) => {
    setActiveFile(file);
  }, []);

  const handleNewTaskFromOutput = useCallback(
    (fileName: string, relativePath: string) => {
      setNewTaskAttachment({ fileName, relativePath });
      setActiveFile(null);
    },
    []
  );

  const handleNewTaskCancel = useCallback(() => {
    setNewTaskAttachment(null);
  }, []);

  const handleNewTaskCreated = useCallback(() => {
    setNewTaskAttachment(null);
    closePanel();
  }, [closePanel]);

  const handleBack = useCallback(() => {
    setDrillView(null);
  }, []);

  if (!selectedTaskId || !task) return null;

  const isRunning = task.status === "running";
  // Show the input whenever the task has been executed at least once
  // (running, review, or done — anything except backlog/queued)
  const hasBeenExecuted = task.status === "running" || task.status === "review" || task.status === "done";
  const showReplyInput = hasBeenExecuted;

  // Determine what's showing
  const showDashboard = !activeFile && !newTaskAttachment && !drillView;
  const showChat = !activeFile && !newTaskAttachment && drillView === "chat";
  const showOutputs = !activeFile && !newTaskAttachment && drillView === "outputs";

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

        {/* Back bar for nav stack (subtask → parent) */}
        {hasNavHistory && !showChat && !showOutputs && (
          <button
            onClick={navigateBack}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 24px",
              border: "none",
              borderBottom: "1px solid #EAE8E6",
              background: "transparent",
              color: "#93452A",
              fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              flexShrink: 0,
              transition: "background 150ms ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(147, 69, 42, 0.04)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            ← Back to parent task
          </button>
        )}

        {/* Back bar for drill-in views */}
        {(showChat || showOutputs) && (
          <button
            onClick={handleBack}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 24px",
              border: "none",
              borderBottom: "1px solid #EAE8E6",
              background: "transparent",
              color: "#93452A",
              fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              flexShrink: 0,
              transition: "background 150ms ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(147, 69, 42, 0.04)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            ← Back to Summary
          </button>
        )}

        {/* Progress bar — visible on chat drill-in */}
        {showChat && (
          <TaskProgress logEntries={logEntries} status={task.status} startedAt={task.startedAt} />
        )}

        {/* Content area */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {newTaskAttachment ? (
            <ModalNewTaskForm
              attachedFile={newTaskAttachment}
              projectSlug={task.projectSlug ?? null}
              onCancel={handleNewTaskCancel}
              onCreated={handleNewTaskCreated}
            />
          ) : activeFile ? (
            <ModalFilePreview
              fileName={activeFile.fileName}
              relativePath={activeFile.relativePath}
              onBack={() => setActiveFile(null)}
              onNewTask={handleNewTaskFromOutput}
            />
          ) : showChat ? (
            <>
              <ModalChat
                taskId={task.id}
                logEntries={logEntries}
                isRunning={isRunning}
                needsInput={task.needsInput === true}
                status={task.status}
                childTasks={childTasks}
                childLogEntries={childLogEntries}
              />
              <ReplyInput
                taskId={task.id}
                isVisible={showReplyInput}
                needsInput={task.needsInput === true}
                taskStatus={task.status}
                onOptimisticReply={handleOptimisticReply}
              />
            </>
          ) : showOutputs ? (
            <div style={{ flex: 1, overflowY: "auto" }}>
              <PanelOutputs taskId={task.id} onFileClick={handleFileClick} />
            </div>
          ) : (
            /* Dashboard — the default view */
            <>
              <ModalSummaryTab
                task={task}
                logEntries={logEntries}
                onDrillChat={() => setDrillView("chat")}
                onDrillOutputs={() => setDrillView("outputs")}
                onFileClick={handleFileClick}
                onViewSubtask={navigateToChild}
              />
              <ReplyInput
                taskId={task.id}
                isVisible={showReplyInput}
                needsInput={task.needsInput === true}
                taskStatus={task.status}
                onOptimisticReply={handleOptimisticReply}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}
