"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import type { CronRun } from "@/types/cron";

interface RunHistoryProps {
  runs: CronRun[];
  jobSlug: string;
}

function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHr / 24);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDuration(sec: number | null): string {
  if (sec === null) return "--";
  if (sec < 60) return `${Math.round(sec)}s`;
  const min = Math.floor(sec / 60);
  const remaining = Math.round(sec % 60);
  return `${min}m ${remaining}s`;
}

export function RunHistory({ runs, jobSlug }: RunHistoryProps) {
  const [log, setLog] = useState<string | null>(null);
  const [loadingLog, setLoadingLog] = useState(false);

  const toggleLog = async () => {
    if (log !== null) {
      setLog(null);
      return;
    }
    setLoadingLog(true);
    try {
      const res = await fetch(`/api/cron/${jobSlug}/logs`);
      if (res.ok) {
        const data = await res.json();
        setLog(data.log || "(empty log)");
      } else {
        setLog("(failed to load log)");
      }
    } catch {
      setLog("(failed to load log)");
    } finally {
      setLoadingLog(false);
    }
  };

  if (runs.length === 0) {
    return (
      <div
        style={{
          backgroundColor: "#F6F3F1",
          padding: 16,
          borderRadius: "0 0 0.5rem 0.5rem",
          textAlign: "center",
          fontFamily: "var(--font-inter), Inter, sans-serif",
          fontSize: 13,
          color: "#5E5E65",
        }}
      >
        No run history yet
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#F6F3F1",
        padding: 16,
        borderRadius: "0 0 0.5rem 0.5rem",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 100px 100px 80px",
          gap: 8,
          padding: "0 8px 8px",
          fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "#5E5E65",
        }}
      >
        <span>Date</span>
        <span>Result</span>
        <span>Duration</span>
        <span>Cost</span>
      </div>

      {/* Rows */}
      {runs.map((run) => (
        <div
          key={run.id}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 100px 100px 80px",
            gap: 8,
            padding: "6px 8px",
            alignItems: "center",
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontSize: 13,
          }}
        >
          <span style={{ color: "#1B1C1B" }}>
            {formatRelativeTime(run.startedAt)}
          </span>
          <span>
            <span
              style={{
                display: "inline-block",
                padding: "2px 8px",
                borderRadius: 4,
                fontSize: 11,
                fontWeight: 500,
                backgroundColor:
                  run.result === "success"
                    ? "#ECFDF5"
                    : run.result === "failure"
                      ? "#FEF2F2"
                      : "#EFF6FF",
                color:
                  run.result === "success"
                    ? "#10B981"
                    : run.result === "failure"
                      ? "#EF4444"
                      : "#3B82F6",
              }}
            >
              {run.result === "success"
                ? "Success"
                : run.result === "failure"
                  ? "Failed"
                  : "Running"}
            </span>
          </span>
          <span
            style={{
              fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
              color: "#5E5E65",
            }}
          >
            {formatDuration(run.durationSec)}
          </span>
          <span
            style={{
              fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
              color: "#5E5E65",
            }}
          >
            {run.costUsd !== null && run.costUsd > 0
              ? `$${run.costUsd.toFixed(2)}`
              : "--"}
          </span>
        </div>
      ))}

      {/* View Log button */}
      <div style={{ marginTop: 8, paddingLeft: 8 }}>
        <button
          onClick={toggleLog}
          disabled={loadingLog}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "none",
            border: "none",
            cursor: loadingLog ? "wait" : "pointer",
            padding: "4px 0",
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontSize: 12,
            fontWeight: 500,
            color: "#93452A",
          }}
        >
          <FileText size={13} />
          {loadingLog ? "Loading..." : log !== null ? "Hide Log" : "View Log"}
        </button>
      </div>

      {/* Log output */}
      {log !== null && (
        <pre
          style={{
            marginTop: 8,
            padding: 12,
            backgroundColor: "#F6F3F1",
            color: "#1B1C1B",
            border: "1px solid #EAE8E6",
            borderRadius: "0.375rem",
            fontFamily: "var(--font-space-grotesk), Space Grotesk, monospace",
            fontSize: 11,
            lineHeight: 1.5,
            maxHeight: 300,
            overflowY: "auto",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {log}
        </pre>
      )}
    </div>
  );
}
