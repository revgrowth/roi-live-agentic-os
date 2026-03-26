"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { useTaskStore } from "@/store/task-store";
import { PanelHeader } from "./panel-header";
import { PanelStats } from "./panel-stats";
import { PanelOutputs } from "./panel-outputs";

export function TaskDetailPanel() {
  const selectedTaskId = useTaskStore((s) => s.selectedTaskId);
  const closePanel = useTaskStore((s) => s.closePanel);
  const tasks = useTaskStore((s) => s.tasks);

  const task = selectedTaskId
    ? tasks.find((t) => t.id === selectedTaskId)
    : null;

  // Keyboard: Escape to close
  useEffect(() => {
    if (!selectedTaskId) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closePanel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedTaskId, closePanel]);

  if (!selectedTaskId || !task) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={closePanel}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.4)",
          zIndex: 49,
          opacity: 1,
          transition: "opacity 200ms ease-out",
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: 480,
          height: "100vh",
          backgroundColor: "#FFFFFF",
          boxShadow: "-4px 0 16px rgba(0,0,0,0.08)",
          transform: "translateX(0)",
          transition: "transform 200ms ease-out",
          zIndex: 50,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <PanelHeader task={task} onClose={closePanel} />

        {/* Spacer */}
        <div style={{ height: 16 }} />

        <PanelStats task={task} />

        {/* Spacer */}
        <div style={{ height: 8 }} />

        <PanelOutputs taskId={task.id} />

        {/* Error section */}
        {task.errorMessage && (
          <div
            style={{
              margin: "16px 24px",
              padding: "16px 24px",
              backgroundColor: "#FFF5F3",
              borderRadius: "0.5rem",
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
            }}
          >
            <AlertCircle
              size={16}
              color="#C04030"
              style={{ flexShrink: 0, marginTop: 1 }}
            />
            <span
              style={{
                fontSize: 13,
                fontFamily: "var(--font-inter), Inter, sans-serif",
                color: "#C04030",
                lineHeight: 1.4,
              }}
            >
              {task.errorMessage}
            </span>
          </div>
        )}
      </div>
    </>
  );
}
