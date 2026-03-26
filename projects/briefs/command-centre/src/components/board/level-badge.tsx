"use client";

import type { TaskLevel } from "@/types/task";

const levelConfig: Record<
  TaskLevel,
  { label: string; bg: string; text: string; border: string }
> = {
  task: { label: "Task", bg: "#F3F4F6", text: "#4B5563", border: "#E5E7EB" },
  project: {
    label: "Project",
    bg: "#EFF6FF",
    text: "#1D4ED8",
    border: "#BFDBFE",
  },
  gsd: { label: "GSD", bg: "#F5F3FF", text: "#6D28D9", border: "#DDD6FE" },
};

export function LevelBadge({ level }: { level: TaskLevel }) {
  const config = levelConfig[level];
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: 11,
        fontWeight: 500,
        padding: "2px 8px",
        borderRadius: 4,
        backgroundColor: config.bg,
        color: config.text,
        border: `1px solid ${config.border}`,
        lineHeight: "16px",
      }}
    >
      {config.label}
    </span>
  );
}
