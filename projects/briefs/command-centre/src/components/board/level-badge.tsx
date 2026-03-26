"use client";

import type { TaskLevel } from "@/types/task";
import { LEVEL_LABELS } from "@/types/task";

const levelConfig: Record<
  TaskLevel,
  { bg: string; text: string }
> = {
  task: {
    bg: "#EAE8E6",
    text: "#5E5E65",
  },
  project: {
    bg: "#EFF6FF",
    text: "#1D4ED8",
  },
  gsd: {
    bg: "#F5F3FF",
    text: "#6D28D9",
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
      {LEVEL_LABELS[level]}
    </span>
  );
}
