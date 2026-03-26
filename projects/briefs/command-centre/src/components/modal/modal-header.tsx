"use client";

import { X } from "lucide-react";
import type { Task } from "@/types/task";
import { LevelBadge } from "../board/level-badge";

const statusColorMap: Record<string, string> = {
  backlog: "#5E5E65",
  queued: "#5E5E65",
  running: "#93452A",
  review: "#B25D3F",
  done: "#6B8E6B",
};

export function ModalHeader({
  task,
  onClose,
}: {
  task: Task;
  onClose: () => void;
}) {
  const statusColor = statusColorMap[task.status] || "#5E5E65";

  return (
    <div style={{ flexShrink: 0 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: 56,
          padding: "0 24px",
        }}
      >
        {/* Left: title + status + level */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            flex: 1,
            minWidth: 0,
          }}
        >
          <span
            style={{
              fontSize: 16,
              fontWeight: 600,
              fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
              color: "#1B1C1B",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {task.title}
          </span>

          {/* Status badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              flexShrink: 0,
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: statusColor,
                animation:
                  task.status === "running"
                    ? "pulse-dot 2s ease-in-out infinite"
                    : undefined,
              }}
            />
            <span
              style={{
                fontSize: 12,
                fontFamily:
                  "var(--font-space-grotesk), Space Grotesk, sans-serif",
                color: "#5E5E65",
              }}
            >
              {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
            </span>
          </div>

          <LevelBadge level={task.level} />
        </div>

        {/* Right: close button */}
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "0.25rem",
            color: "#5E5E65",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "#F6F3F1";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "transparent";
          }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Bottom separator */}
      <div style={{ height: 1, backgroundColor: "#EAE8E6" }} />
    </div>
  );
}
