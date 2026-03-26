"use client";

import type { TaskLevel } from "@/types/task";

const levelConfig: Record<
  TaskLevel,
  { label: string; bg: string; text: string }
> = {
  task: {
    label: "Task",
    bg: "#EAE8E6",
    text: "#5E5E65",
  },
  project: {
    label: "Project",
    bg: "#FFDBCF",
    text: "#390C00",
  },
  gsd: {
    label: "GSD",
    bg: "rgba(147, 69, 42, 0.12)",
    text: "#93452A",
  },
};

export function LevelBadge({ level }: { level: TaskLevel }) {
  const config = levelConfig[level];
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: 11,
        fontWeight: 500,
        fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
        padding: "2px 8px",
        borderRadius: 4,
        backgroundColor: config.bg,
        color: config.text,
        lineHeight: "16px",
      }}
    >
      {config.label}
    </span>
  );
}
