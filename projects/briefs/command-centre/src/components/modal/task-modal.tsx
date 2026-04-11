"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useTaskStore } from "@/store/task-store";
import type { LogEntry, OutputFile } from "@/types/task";
import { ModalHeader } from "./modal-header";
import { ModalChat } from "./modal-chat";
import { ReplyInput } from "./reply-input";
import { ModalFilePreview } from "./modal-file-preview";
import { ModalNewTaskForm } from "./modal-new-task-form";
import { PanelOutputs } from "../panel/panel-outputs";

// Stable reference to avoid infinite re-render loop in Zustand selector
const EMPTY_LOG_ENTRIES: LogEntry[] = [];

type ModalTab = "activity" | "files";

const TAB_CONFIG: { key: ModalTab; label: string }[] = [
  { key: "activity", label: "Activity" },
  { key: "files", label: "Files" },
];

export function TaskModal() {
  const selectedTaskId = useTaskStore((s) => s.selectedTaskId);
  const closePanel = useTaskStore((s) => s.closePanel);
  const tasks = useTaskStore((s) => s.tasks);
  const fetchLogEntries = useTaskStore((s) => s.fetchLogEntries);

  const [isVisible, setIsVisible] = useState(false);
  const [activeFile, setActiveFile] = useState<OutputFile | null>(null);
  const [activeTab, setActiveTab] = useState<ModalTab>("activity");
  const [newTaskAttachment, setNewTaskAttachment] = useState<{ fileName: string; relativePath: string } | null>(null);

  // Resizable panel
  const [panelWidth, setPanelWidth] = useState(580);
  const isResizing = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(580);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    startX.current = e.clientX;
    startWidth.current = panelWidth;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const handleMouseMove = (ev: MouseEvent) => {
      if (!isResizing.current) return;
      const delta = startX.current - ev.clientX;
      const newWidth = Math.min(Math.max(startWidth.current + delta, 360), window.innerWidth - 40);
      setPanelWidth(newWidth);
    };

    const handleMouseUp = () => {
      isResizing.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, [panelWidth]);

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
    setActiveTab("activity");
  }, []);

  // Navigate back to parent
  const navigateBack = useCallback(() => {
    setNavStack((prev) => prev.slice(0, -1));
    setActiveFile(null);
    setActiveTab("activity");
  }, []);

  const hasNavHistory = navStack.length > 0;

  // Fetch log entries into the store when task changes
  useEffect(() => {
    if (!selectedTaskId) {
      setIsVisible(false);
      setActiveFile(null);
      setActiveTab("activity");
      setNewTaskAttachment(null);
      setNavStack([]);
      return;
    }

    setActiveFile(null);
    setActiveTab("activity");
    setNewTaskAttachment(null);
    setNavStack([]);

    // Animate in
    requestAnimationFrame(() => {
      setIsVisible(true);
    });

    // Load persisted logs into the store (SSE will append to the same store entry)
    fetchLogEntries(selectedTaskId);
  }, [selectedTaskId, fetchLogEntries]);

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
        } else if (hasNavHistory) {
          navigateBack();
        } else {
          closePanel();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedTaskId, closePanel, activeFile, newTaskAttachment, hasNavHistory, navigateBack]);

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

  if (!selectedTaskId || !task) return null;

  const isRunning = task.status === "running";
  const hasBeenExecuted = task.status === "running" || task.status === "review" || task.status === "done";
  const showReplyInput = hasBeenExecuted || task.needsInput === true;

  // Filter "Working directory:" from description
  const displayDescription = task.description
    ? task.description.replace(/^Working directory:\s*.+$/m, "").trim() || null
    : null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={closePanel}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.15)",
          zIndex: 100,
          opacity: isVisible ? 1 : 0,
          pointerEvents: isVisible ? "auto" : "none",
          transition: "opacity 250ms ease-out",
        }}
      />

      {/* Side panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: panelWidth,
          maxWidth: "100vw",
          backgroundColor: "#FFFFFF",
          borderRadius: "0.75rem 0 0 0.75rem",
          boxShadow: "0px 12px 32px rgba(147, 69, 42, 0.06)",
          zIndex: 101,
          display: "flex",
          flexDirection: "row",
          overflow: "hidden",
          transform: isVisible ? "translateX(0)" : "translateX(100%)",
          transition: isResizing.current ? "none" : "transform 250ms ease-out",
        }}
      >
        {/* Resize handle */}
        <div
          onMouseDown={handleResizeStart}
          style={{
            width: 6,
            cursor: "col-resize",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget.firstChild as HTMLElement).style.backgroundColor = "#93452A";
            (e.currentTarget.firstChild as HTMLElement).style.opacity = "0.4";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget.firstChild as HTMLElement).style.backgroundColor = "#D1D5DB";
            (e.currentTarget.firstChild as HTMLElement).style.opacity = "0";
          }}
        >
          <div style={{
            width: 3,
            height: 40,
            borderRadius: 2,
            backgroundColor: "#D1D5DB",
            opacity: 0,
            transition: "opacity 150ms ease, background-color 150ms ease",
          }} />
        </div>

        {/* Panel content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        {/* Header */}
        <ModalHeader task={task} onClose={closePanel} />

        {/* Back bar for nav stack (subtask → parent) */}
        {hasNavHistory && !activeFile && !newTaskAttachment && (
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
            &larr; Back to parent task
          </button>
        )}

        {/* Description (if exists and not just working directory) */}
        {displayDescription && !activeFile && !newTaskAttachment && (
          <div
            style={{
              padding: "10px 24px",
              borderBottom: "1px solid #EAE8E6",
              fontSize: 13,
              fontFamily: "var(--font-inter), Inter, sans-serif",
              color: "#5E5E65",
              lineHeight: 1.5,
            }}
          >
            {displayDescription}
          </div>
        )}

        {/* Tab bar */}
        {!activeFile && !newTaskAttachment && (
          <div
            style={{
              display: "flex",
              gap: 0,
              padding: "0 24px",
              borderBottom: "1px solid #EAE8E6",
              flexShrink: 0,
            }}
          >
            {TAB_CONFIG.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    padding: "10px 16px",
                    fontSize: 12,
                    fontWeight: isActive ? 600 : 500,
                    fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                    border: "none",
                    borderBottom: isActive ? "2px solid #93452A" : "2px solid transparent",
                    backgroundColor: "transparent",
                    color: isActive ? "#93452A" : "#9C9CA0",
                    cursor: "pointer",
                    transition: "all 120ms ease",
                    marginBottom: -1,
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
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
          ) : activeTab === "activity" ? (
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
          ) : activeTab === "files" ? (
            <div style={{ flex: 1, overflowY: "auto" }}>
              <PanelOutputs taskId={task.id} onFileClick={handleFileClick} />
            </div>
          ) : null}
        </div>
        </div>
      </div>
    </>
  );
}
