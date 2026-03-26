"use client";

import { useTaskStore } from "@/store/task-store";

/** Max Pro plan: ~45M tokens/month ≈ 1.5M/day */
const DAILY_TOKEN_LIMIT = 1_500_000;

function formatTokens(n: number): string {
  if (n === 0) return "0";
  if (n < 1000) return n.toString();
  if (n < 1_000_000) return `${(n / 1000).toFixed(1)}k`;
  return `${(n / 1_000_000).toFixed(1)}M`;
}

export function StatsBar() {
  const tasks = useTaskStore((s) => s.tasks);

  const runningCount = tasks.filter((t) => t.status === "running").length;
  const doneCount = tasks.filter((t) => t.status === "done").length;

  const today = new Date().toISOString().slice(0, 10);
  const todayTokens = tasks
    .filter(
      (t) =>
        t.tokensUsed !== null &&
        (t.status === "done" || t.status === "running" || t.status === "review") &&
        (
          (t.completedAt && t.completedAt.slice(0, 10) === today) ||
          (t.startedAt && t.startedAt.slice(0, 10) === today)
        )
    )
    .reduce((sum, t) => sum + (t.tokensUsed ?? 0), 0);

  const usagePct = Math.min(100, Math.round((todayTokens / DAILY_TOKEN_LIMIT) * 100));

  return (
    <div
      style={{
        height: 64,
        backgroundColor: "#F6F3F1",
        display: "flex",
        alignItems: "center",
        padding: "0 24px",
        gap: 0,
        flexShrink: 0,
        borderRadius: 10,
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
      <UsageStat label="Token Usage" used={todayTokens} pct={usagePct} />
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
        margin: "0 20px",
      }}
    />
  );
}

function StatItem({
  label,
  value,
  showDot,
}: {
  label: string;
  value: string;
  showDot?: boolean;
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
            fontSize: 20,
            fontWeight: 600,
            color: "#1B1C1B",
            fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
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

function UsageStat({
  label,
  used,
  pct,
}: {
  label: string;
  used: number;
  pct: number;
}) {
  const barColor = pct >= 90 ? "#C0392B" : pct >= 70 ? "#D4762C" : "#93452A";

  return (
    <div style={{ minWidth: 120 }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 6,
        }}
      >
        <span
          style={{
            fontSize: 20,
            fontWeight: 600,
            color: "#1B1C1B",
            fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
            lineHeight: 1,
          }}
        >
          {formatTokens(used)}
        </span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: "#5E5E65",
            fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
            lineHeight: 1,
          }}
        >
          / {formatTokens(DAILY_TOKEN_LIMIT)}
        </span>
      </div>
      <div
        style={{
          height: 4,
          backgroundColor: "rgba(218, 193, 185, 0.3)",
          borderRadius: 2,
          marginTop: 6,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            backgroundColor: barColor,
            borderRadius: 2,
            transition: "width 0.3s ease",
          }}
        />
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
