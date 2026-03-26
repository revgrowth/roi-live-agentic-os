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
  const createTask = useTaskStore((s) => s.createTask);

  const handleSubmit = async () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    await createTask(trimmed, level);
    setTitle("");
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

      {/* Run button */}
      <button
        onClick={handleSubmit}
        style={{
          padding: "0 16px",
          fontSize: 14,
          fontWeight: 500,
          backgroundColor: "#3B82F6",
          color: "#FFFFFF",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          height: 36,
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          transition: "background-color 150ms ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#2563EB";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#3B82F6";
        }}
      >
        Run
      </button>
    </div>
  );
}
