"use client";

import { X } from "lucide-react";
import type { Task, PermissionMode } from "@/types/task";
import { PERMISSION_MODE_LABELS, PERMISSION_MODE_HINTS } from "@/types/task";
import { LevelBadge } from "../board/level-badge";
import { useTaskStore } from "@/store/task-store";

function getSkillLabel(activityLabel: string | null): string {
  if (!activityLabel) return "General";
  // Match skill name patterns like mkt-*, str-*, viz-*, tool-*, ops-*, meta-*, acc-*
  const match = activityLabel.match(
    /\b(mkt|str|viz|tool|ops|meta|acc)-[a-z0-9-]+/i
  );
  return match ? match[0] : "General";
}

const MODE_BG: Record<PermissionMode, string> = {
  plan: "#E0E7FF",
  default: "#F3F4F6",
  acceptEdits: "#FEF3C7",
  auto: "#D1FAE5",
  bypassPermissions: "#FEE2E2",
};

const MODE_TEXT: Record<PermissionMode, string> = {
  plan: "#3730A3",
  default: "#374151",
  acceptEdits: "#92400E",
  auto: "#065F46",
  bypassPermissions: "#991B1B",
};

const ALL_MODES: PermissionMode[] = ["plan", "default", "acceptEdits", "auto", "bypassPermissions"];

export function PanelHeader({
  task,
  onClose,
}: {
  task: Task;
  onClose: () => void;
}) {
  const updateTask = useTaskStore((s) => s.updateTask);
  // Can change mode anytime except while actively running — next turn picks it up
  const canChangeMode = task.status !== "running";

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: 56,
          padding: "0 24px",
        }}
      >
        {/* Left side: title + meta */}
        <div style={{ flex: 1, minWidth: 0, marginRight: 12 }}>
          <div
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
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginTop: 2,
            }}
          >
            <LevelBadge level={task.level} />
            <span
              style={{
                fontSize: 11,
                fontFamily:
                  "var(--font-space-grotesk), Space Grotesk, sans-serif",
                color: "#5E5E65",
              }}
            >
              {getSkillLabel(task.activityLabel)}
            </span>
            {/* Permission mode selector */}
            <div
              style={{
                display: "flex",
                gap: 1,
                backgroundColor: "#EAE8E6",
                borderRadius: 4,
                padding: 1,
                height: 22,
                alignItems: "center",
                marginLeft: 4,
              }}
            >
              {ALL_MODES.map((mode) => {
                const isActive = (task.permissionMode || "default") === mode;
                return (
                  <button
                    key={mode}
                    onClick={() => {
                      if (canChangeMode) {
                        updateTask(task.id, { permissionMode: mode });
                      }
                    }}
                    disabled={!canChangeMode}
                    title={
                      canChangeMode
                        ? PERMISSION_MODE_HINTS[mode]
                        : "Mode locked while task is running — change takes effect on next turn"
                    }
                    style={{
                      padding: "0 6px",
                      fontSize: 9,
                      fontWeight: 600,
                      fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                      border: "none",
                      cursor: canChangeMode ? "pointer" : "default",
                      borderRadius: 3,
                      height: 20,
                      backgroundColor: isActive ? MODE_BG[mode] : "transparent",
                      color: isActive ? MODE_TEXT[mode] : "#9C9CA0",
                      opacity: canChangeMode ? 1 : 0.6,
                      transition: "all 150ms ease",
                    }}
                  >
                    {PERMISSION_MODE_LABELS[mode]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right side: close button */}
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

      {/* Bottom separator: bg shift, not a border line (No-Line Rule) */}
      <div style={{ height: 1, backgroundColor: "#EAE8E6" }} />
    </div>
  );
}
