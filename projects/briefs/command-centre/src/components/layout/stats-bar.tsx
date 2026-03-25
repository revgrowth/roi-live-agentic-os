"use client";

import { useTaskStore } from "@/store/task-store";

export function StatsBar() {
  const tasks = useTaskStore((s) => s.tasks);

  const runningCount = tasks.filter((t) => t.status === "running").length;
  const doneCount = tasks.filter((t) => t.status === "done").length;

  // Sum costUsd for tasks completed today
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
        backgroundColor: "#F9FAFB",
        borderBottom: "1px solid #F3F4F6",
        display: "flex",
        alignItems: "center",
        padding: "0 24px",
        gap: 48,
        flexShrink: 0,
      }}
    >
      <StatItem label="Tasks Running" value={runningCount.toString()} />
      <StatItem label="Tasks Completed" value={doneCount.toString()} />
      <StatItem label="Today's Spend" value={`$${todaySpend.toFixed(2)}`} />
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        style={{
          fontSize: 24,
          fontWeight: 600,
          color: "#111827",
          fontFamily: "var(--font-jetbrains-mono), monospace",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 12,
          color: "#9CA3AF",
          marginTop: 4,
        }}
      >
        {label}
      </div>
    </div>
  );
}
