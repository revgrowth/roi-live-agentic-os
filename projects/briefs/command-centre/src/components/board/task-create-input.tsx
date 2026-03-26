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
          padding: "8px 16px",
          fontSize: 14,
          fontFamily: "var(--font-inter), Inter, sans-serif",
          backgroundColor: "#FFFFFF",
          border: "1px solid rgba(218, 193, 185, 0.2)",
          borderRadius: 6,
          outline: "none",
          color: "#1B1C1B",
          height: 40,
          opacity: isSubmitting ? 0.6 : 1,
          transition: "all 150ms ease",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "#93452A";
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(147, 69, 42, 0.1)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "rgba(218, 193, 185, 0.2)";
          e.currentTarget.style.boxShadow = "none";
        }}
      />

      {/* Level selector — selection chips */}
      <div
        style={{
          display: "flex",
          gap: 2,
          backgroundColor: "#EAE8E6",
          borderRadius: 6,
          padding: 2,
          height: 40,
          alignItems: "center",
        }}
      >
        {levels.map((l) => (
          <button
            key={l.value}
            onClick={() => setLevel(l.value)}
            style={{
              padding: "0 14px",
              fontSize: 12,
              fontWeight: 500,
              fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
              border: "none",
              cursor: "pointer",
              borderRadius: 4,
              height: 32,
              backgroundColor:
                level === l.value ? "#FFDBCF" : "transparent",
              color: level === l.value ? "#390C00" : "#5E5E65",
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
