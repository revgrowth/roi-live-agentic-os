"use client";

import { useState } from "react";
import type { TaskLevel } from "@/types/task";
import { useTaskStore } from "@/store/task-store";

const levels: { value: TaskLevel; label: string }[] = [
  { value: "task", label: "Task" },
  { value: "project", label: "Project" },
  { value: "gsd", label: "GSD" },
];

export function TaskCreateInput() {
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState<TaskLevel>("task");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createTask = useTaskStore((s) => s.createTask);

  const handleSubmit = () => {
    const trimmed = title.trim();
    if (!trimmed || isSubmitting) return;
    setIsSubmitting(true);
    setTitle("");
    // Fire and forget — createTask is now optimistic
    createTask(trimmed, level).finally(() => {
      setIsSubmitting(false);
    });
  };

  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSubmit();
          }
        }}
        disabled={isSubmitting}
        placeholder="Describe what you need done..."
        style={{
          flex: 1,
          padding: "8px 12px",
          fontSize: 14,
          backgroundColor: "#FFFFFF",
          border: "1px solid #E5E7EB",
          borderRadius: 6,
          outline: "none",
          color: "#111827",
          height: 36,
          opacity: isSubmitting ? 0.6 : 1,
          transition: "opacity 150ms ease",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "#3B82F6";
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.1)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "#E5E7EB";
          e.currentTarget.style.boxShadow = "none";
        }}
      />

      {/* Level selector */}
      <div
        style={{
          display: "flex",
          border: "1px solid #E5E7EB",
          borderRadius: 6,
          overflow: "hidden",
          backgroundColor: "#FFFFFF",
          height: 36,
        }}
      >
        {levels.map((l, i) => (
          <button
            key={l.value}
            onClick={() => setLevel(l.value)}
            style={{
              padding: "0 12px",
              fontSize: 12,
              fontWeight: 500,
              border: "none",
              cursor: "pointer",
              backgroundColor:
                level === l.value ? "#EFF6FF" : "transparent",
              color: level === l.value ? "#3B82F6" : "#9CA3AF",
              borderRight:
                i < levels.length - 1 ? "1px solid #E5E7EB" : "none",
              transition: "all 150ms ease",
            }}
          >
            {l.label}
          </button>
        ))}
      </div>

    </div>
  );
}
