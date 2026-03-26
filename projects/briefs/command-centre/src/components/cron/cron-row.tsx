"use client";

import { Play, Pause, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { useCronStore } from "@/store/cron-store";
import { RunHistory } from "./run-history";
import type { CronJob } from "@/types/cron";

interface CronRowProps {
  job: CronJob;
}

function formatSchedule(days: string, time: string): string {
  const dayMap: Record<string, string> = {
    daily: "Daily",
    weekdays: "Weekdays",
    weekends: "Weekends",
    mon: "Monday",
    tue: "Tuesday",
    wed: "Wednesday",
    thu: "Thursday",
    fri: "Friday",
    sat: "Saturday",
    sun: "Sunday",
  };

  const dayParts = days.split(",").map((d) => dayMap[d.trim()] || d.trim());
  const dayLabel = dayParts.join(", ");
  return `${dayLabel} at ${time}`;
}

function formatRelativeTime(iso: string | null): string {
  if (!iso) return "--";
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const future = diffMs < 0;
  const absDiffMs = Math.abs(diffMs);
  const diffMin = Math.floor(absDiffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHr / 24);

  if (diffMin < 1) return future ? "in < 1m" : "just now";
  if (diffMin < 60) return future ? `in ${diffMin}m` : `${diffMin}m ago`;
  if (diffHr < 24) return future ? `in ${diffHr}h` : `${diffHr}h ago`;
  if (diffDays < 30) return future ? `in ${diffDays}d` : `${diffDays}d ago`;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

function formatDuration(sec: number): string {
  if (sec < 60) return `${Math.round(sec)}s`;
  const min = Math.floor(sec / 60);
  const remaining = Math.round(sec % 60);
  return `${min}m ${remaining}s`;
}

export function CronRow({ job }: CronRowProps) {
  const expandedJob = useCronStore((s) => s.expandedJob);
  const runHistory = useCronStore((s) => s.runHistory);
  const expandJob = useCronStore((s) => s.expandJob);
  const toggleJob = useCronStore((s) => s.toggleJob);
  const deleteJob = useCronStore((s) => s.deleteJob);

  const isExpanded = expandedJob === job.slug;
  const runs = runHistory[job.slug] || [];

  return (
    <div style={{ marginBottom: 10 }}>
      {/* Main row */}
      <div
        onClick={() => expandJob(isExpanded ? null : job.slug)}
        style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr 0.8fr 0.8fr 0.7fr 90px 80px",
          gap: 12,
          alignItems: "center",
          padding: "14px 16px",
          backgroundColor: "#FFFFFF",
          borderRadius: isExpanded ? "0.5rem 0.5rem 0 0" : "0.5rem",
          cursor: "pointer",
          transition: "background-color 150ms ease",
          fontFamily: "var(--font-inter), Inter, sans-serif",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#F6F3F1";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#FFFFFF";
        }}
      >
        {/* Name */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {isExpanded ? (
            <ChevronDown size={14} color="#5E5E65" />
          ) : (
            <ChevronRight size={14} color="#5E5E65" />
          )}
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: "#1B1C1B" }}>
              {job.name}
            </div>
            {job.description && (
              <div
                style={{
                  fontSize: 12,
                  color: "#5E5E65",
                  marginTop: 2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: 280,
                }}
              >
                {job.description}
              </div>
            )}
          </div>
        </div>

        {/* Schedule */}
        <div>
          <div
            style={{
              fontSize: 13,
              color: "#1B1C1B",
              fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
            }}
          >
            {formatSchedule(job.days, job.time)}
          </div>
        </div>

        {/* Last Run */}
        <div style={{ fontSize: 13, color: "#5E5E65" }}>
          {job.lastRun ? (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span>{formatRelativeTime(job.lastRun.lastRun)}</span>
              <span
                style={{
                  display: "inline-block",
                  padding: "1px 6px",
                  borderRadius: 4,
                  fontSize: 10,
                  fontWeight: 500,
                  backgroundColor:
                    job.lastRun.result === "success" ? "#ECFDF5" : "#FEF2F2",
                  color:
                    job.lastRun.result === "success" ? "#10B981" : "#EF4444",
                }}
              >
                {job.lastRun.result === "success" ? "OK" : "Fail"}
              </span>
            </div>
          ) : (
            "--"
          )}
        </div>

        {/* Next Run */}
        <div style={{ fontSize: 13, color: "#5E5E65" }}>
          {job.active ? formatRelativeTime(job.nextRun) : "Paused"}
        </div>

        {/* Avg Duration */}
        <div
          style={{
            fontSize: 13,
            color: "#5E5E65",
            fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
          }}
        >
          {job.stats.totalRuns > 0
            ? formatDuration(job.stats.avgDurationSec)
            : "--"}
        </div>

        {/* Status chip */}
        <div>
          <span
            style={{
              display: "inline-block",
              padding: "4px 10px",
              borderRadius: "0.375rem",
              fontSize: 12,
              fontWeight: 500,
              backgroundColor: job.active ? "#FFDBCF" : "#EAE8E6",
              color: job.active ? "#390C00" : "#5E5E65",
            }}
          >
            {job.active ? "Active" : "Paused"}
          </span>
        </div>

        {/* Actions */}
        <div
          style={{ display: "flex", gap: 4 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => toggleJob(job.slug)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 6,
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              color: "#5E5E65",
              transition: "color 150ms ease",
            }}
            title={job.active ? "Pause" : "Play"}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#93452A";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#5E5E65";
            }}
          >
            {job.active ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button
            onClick={() => deleteJob(job.slug)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 6,
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              color: "#5E5E65",
              transition: "color 150ms ease",
            }}
            title="Delete"
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#EF4444";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#5E5E65";
            }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Expanded run history */}
      {isExpanded && <RunHistory runs={runs} />}
    </div>
  );
}
