"use client";

import { useState } from "react";
import { Play, Pause, Trash2, ChevronDown, ChevronRight, Zap, Loader2, Pin } from "lucide-react";
import { useCronStore } from "@/store/cron-store";
import { RunHistory } from "./run-history";
import type { CronJob } from "@/types/cron";

interface CronRowProps {
  job: CronJob;
  index: number;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
  isDragOver: boolean;
  isDragging: boolean;
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
  if (isNaN(date.getTime())) return "--";
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

export function CronRow({
  job,
  index,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  isDragOver,
  isDragging,
}: CronRowProps) {
  const expandedJob = useCronStore((s) => s.expandedJob);
  const runHistory = useCronStore((s) => s.runHistory);
  const expandJob = useCronStore((s) => s.expandJob);
  const toggleJob = useCronStore((s) => s.toggleJob);
  const deleteJob = useCronStore((s) => s.deleteJob);
  const runJobNow = useCronStore((s) => s.runJobNow);
  const togglePin = useCronStore((s) => s.togglePin);
  const isPinned = useCronStore((s) => s.pinnedSlugs.includes(job.slug));
  const activeRun = useCronStore((s) => s.activeRuns[job.slug]);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const isActiveRun = !!activeRun;
  const isExpanded = expandedJob === job.slug;
  const runs = runHistory[job.slug] || [];

  // Derive a human-friendly status label for the active run
  const runStatusLabel =
    activeRun?.status === "queued"
      ? "Queued..."
      : activeRun?.status === "running"
        ? activeRun.activityLabel || "Running..."
        : null;

  return (
    <div
      style={{ marginBottom: 10 }}
      draggable={!isPinned}
      onDragStart={(e) => { if (isPinned) { e.preventDefault(); return; } onDragStart(e, index); }}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={(e) => onDrop(e, index)}
      onDragEnd={onDragEnd}
    >
      {/* Main row */}
      <div
        onClick={() => expandJob(isExpanded ? null : job.slug)}
        style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr 0.8fr 0.8fr 0.7fr 90px 110px",
          gap: 12,
          alignItems: "center",
          padding: "14px 16px",
          backgroundColor: isActiveRun ? "#FFFAF8" : isPinned ? "#FDFCFB" : "#FFFFFF",
          borderRadius: isExpanded ? "0.5rem 0.5rem 0 0" : "0.5rem",
          cursor: isPinned ? "default" : "grab",
          transition: "background-color 150ms ease, opacity 150ms ease",
          fontFamily: "var(--font-inter), Inter, sans-serif",
          opacity: isDragging ? 0.4 : 1,
          borderTop: isDragOver ? "2px solid #93452A" : "2px solid transparent",
          borderLeft: isPinned ? "3px solid #93452A" : "3px solid transparent",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = isActiveRun ? "#FFF5F0" : "#F6F3F1";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = isActiveRun ? "#FFFAF8" : "#FFFFFF";
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
            {/* Show activity label when running, otherwise show description */}
            {isActiveRun && runStatusLabel ? (
              <div
                style={{
                  fontSize: 12,
                  color: "#93452A",
                  marginTop: 2,
                  fontStyle: "italic",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: 280,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <Loader2
                  size={11}
                  style={{
                    animation: "spin 1s linear infinite",
                    flexShrink: 0,
                  }}
                />
                {runStatusLabel}
              </div>
            ) : (
              job.description && (
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
              )
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
          {isActiveRun ? (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "4px 10px",
                borderRadius: "0.375rem",
                fontSize: 12,
                fontWeight: 500,
                backgroundColor: "#FEF3CD",
                color: "#856404",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  backgroundColor: "#93452A",
                  animation: "pulse-dot 2s ease-in-out infinite",
                  flexShrink: 0,
                }}
              />
              Running
            </span>
          ) : (
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
          )}
        </div>

        {/* Actions */}
        <div
          style={{ display: "flex", gap: 4 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => runJobNow(job.slug)}
            disabled={isActiveRun}
            style={{
              background: "none",
              border: "none",
              cursor: isActiveRun ? "not-allowed" : "pointer",
              padding: 6,
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              color: isActiveRun ? "#B25D3F" : "#5E5E65",
              transition: "color 150ms ease",
              opacity: isActiveRun ? 0.5 : 1,
            }}
            title={isActiveRun ? "Job is running..." : "Run now"}
            onMouseEnter={(e) => {
              if (!isActiveRun) e.currentTarget.style.color = "#93452A";
            }}
            onMouseLeave={(e) => {
              if (!isActiveRun) e.currentTarget.style.color = "#5E5E65";
            }}
          >
            <Zap size={16} />
          </button>
          <button
            onClick={() => togglePin(job.slug)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 6,
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              color: isPinned ? "#93452A" : "#5E5E65",
              transition: "color 150ms ease",
              transform: isPinned ? "rotate(-45deg)" : "none",
            }}
            title={isPinned ? "Unpin from top" : "Pin to top"}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#93452A";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = isPinned ? "#93452A" : "#5E5E65";
            }}
          >
            <Pin size={14} />
          </button>
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
          {confirmingDelete ? (
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <button
                onClick={() => {
                  deleteJob(job.slug);
                  setConfirmingDelete(false);
                }}
                style={{
                  background: "#EF4444",
                  border: "none",
                  cursor: "pointer",
                  padding: "3px 8px",
                  borderRadius: 4,
                  fontSize: 11,
                  fontWeight: 500,
                  color: "#FFFFFF",
                  fontFamily: "var(--font-inter), Inter, sans-serif",
                }}
              >
                Delete
              </button>
              <button
                onClick={() => setConfirmingDelete(false)}
                style={{
                  background: "none",
                  border: "1px solid #D1D1D6",
                  cursor: "pointer",
                  padding: "3px 8px",
                  borderRadius: 4,
                  fontSize: 11,
                  fontWeight: 500,
                  color: "#5E5E65",
                  fontFamily: "var(--font-inter), Inter, sans-serif",
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmingDelete(true)}
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
          )}
        </div>
      </div>

      {/* Expanded run history */}
      {isExpanded && <RunHistory runs={runs} jobSlug={job.slug} prompt={job.prompt} />}

      {/* CSS for spinner animation */}
      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
