"use client";

import { useTaskStore } from "@/store/task-store";

export function StatsBar() {
  const tasks = useTaskStore((s) => s.tasks);

  const runningCount = tasks.filter((t) => t.status === "running").length;
  const doneCount = tasks.filter((t) => t.status === "done").length;

  const today = new Date().toISOString().slice(0, 10);
  const todaySpend = tasks
    .filter(
      (t) =>
        t.status === "done" &&
        t.completedAt &&
        t.completedAt.slice(0, 10) === today
    )
    .reduce((sum, t) => sum + (t.costUsd ?? 0), 0);

  return (
    <div
      style={{
        height: 72,
        backgroundColor: "#F6F3F1",
        display: "flex",
        alignItems: "center",
        padding: "0 40px",
        gap: 0,
        flexShrink: 0,
        borderRadius: 12,
      }}
    >
      <StatItem
        label="Tasks Running"
        value={runningCount.toString()}
        showDot={runningCount > 0}
      />
      <Separator />
      <StatItem label="Tasks Completed" value={doneCount.toString()} />
      <Separator />
      <StatItem label="Active Crons" value="0" />
      <Separator />
      <StatItem label="Today's Spend" value={`$${todaySpend.toFixed(2)}`} mono />
    </div>
  );
}

function Separator() {
  return (
    <div
      style={{
        width: 1,
        height: 32,
        backgroundColor: "rgba(218, 193, 185, 0.2)",
        margin: "0 32px",
      }}
    />
  );
}

function StatItem({
  label,
  value,
  showDot,
  mono,
}: {
  label: string;
  value: string;
  showDot?: boolean;
  mono?: boolean;
}) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {showDot && (
          <span
            style={{
              display: "inline-block",
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#93452A",
              animation: "pulse-dot 2s ease-in-out infinite",
              flexShrink: 0,
            }}
          />
        )}
        <span
          style={{
            fontSize: 24,
            fontWeight: 600,
            color: "#1B1C1B",
            fontFamily: mono
              ? "var(--font-space-grotesk), Space Grotesk, sans-serif"
              : "var(--font-epilogue), Epilogue, sans-serif",
            lineHeight: 1,
          }}
        >
          {value}
        </span>
      </div>
      <div
        style={{
          fontSize: 11,
          fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "#5E5E65",
          marginTop: 4,
        }}
      >
        {label}
      </div>
    </div>
  );
}
