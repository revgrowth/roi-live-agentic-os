"use client";

import { useState } from "react";
import { Wrench } from "lucide-react";
import type { LogEntry } from "@/types/task";

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function Timestamp({ iso }: { iso: string }) {
  return (
    <span
      style={{
        fontSize: 10,
        fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
        color: "#5E5E65",
        opacity: 0.6,
        marginTop: 4,
        display: "block",
      }}
    >
      {formatTime(iso)}
    </span>
  );
}

function TextEntry({ entry }: { entry: LogEntry }) {
  return (
    <div style={{ maxWidth: "85%", alignSelf: "flex-start" }}>
      <span
        style={{
          fontSize: 11,
          fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
          color: "#5E5E65",
          display: "block",
          marginBottom: 4,
        }}
      >
        Claude
      </span>
      <div
        style={{
          backgroundColor: "#F6F3F1",
          borderRadius: "0.75rem",
          padding: "14px 18px",
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontFamily: "var(--font-inter), Inter, sans-serif",
            color: "#1B1C1B",
            lineHeight: 1.6,
            whiteSpace: "pre-wrap",
          }}
        >
          {entry.content}
        </span>
      </div>
      <Timestamp iso={entry.timestamp} />
    </div>
  );
}

function ToolUseEntry({ entry }: { entry: LogEntry }) {
  const [expanded, setExpanded] = useState(false);

  // Extract first arg value for preview
  let argPreview = "";
  if (entry.toolArgs) {
    try {
      const parsed = JSON.parse(entry.toolArgs);
      const firstKey = Object.keys(parsed)[0];
      if (firstKey) {
        const val = String(parsed[firstKey]);
        argPreview = val.length > 40 ? val.slice(0, 40) + "..." : val;
      }
    } catch {
      argPreview = entry.toolArgs.slice(0, 40);
    }
  }

  return (
    <div style={{ maxWidth: "85%", alignSelf: "flex-start" }}>
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          backgroundColor: "#EAE8E6",
          borderRadius: "0.375rem",
          padding: "8px 12px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <Wrench size={14} color="#5E5E65" style={{ flexShrink: 0 }} />
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
            color: "#1B1C1B",
          }}
        >
          {entry.toolName || "Tool"}
        </span>
        {argPreview && (
          <span
            style={{
              fontSize: 12,
              fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
              color: "#5E5E65",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {argPreview}
          </span>
        )}
      </div>
      {expanded && entry.toolArgs && (
        <pre
          style={{
            fontSize: 12,
            fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
            color: "#5E5E65",
            backgroundColor: "#F6F3F1",
            padding: 12,
            borderRadius: "0.25rem",
            marginTop: 4,
            overflow: "auto",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {entry.toolArgs}
        </pre>
      )}
      <Timestamp iso={entry.timestamp} />
    </div>
  );
}

function ToolResultEntry({ entry }: { entry: LogEntry }) {
  return (
    <div style={{ maxWidth: "85%", alignSelf: "flex-start" }}>
      <div
        style={{
          fontSize: 12,
          fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
          color: "#5E5E65",
          backgroundColor: "#F6F3F1",
          padding: 12,
          borderRadius: "0.25rem",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {entry.content}
      </div>
      <Timestamp iso={entry.timestamp} />
    </div>
  );
}

function QuestionEntry({ entry }: { entry: LogEntry }) {
  return (
    <div style={{ maxWidth: "85%", alignSelf: "flex-start" }}>
      <span
        style={{
          fontSize: 11,
          fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
          color: "#93452A",
          display: "block",
          marginBottom: 4,
        }}
      >
        Claude is asking
      </span>
      <div
        style={{
          borderLeft: "3px solid #93452A",
          backgroundColor: "#FFF5F3",
          padding: "14px 18px",
          borderRadius: "0.5rem",
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: 500,
            fontFamily: "var(--font-inter), Inter, sans-serif",
            color: "#1B1C1B",
            lineHeight: 1.6,
            whiteSpace: "pre-wrap",
          }}
        >
          {entry.content}
        </span>
      </div>
      <Timestamp iso={entry.timestamp} />
    </div>
  );
}

function UserReplyEntry({ entry }: { entry: LogEntry }) {
  return (
    <div
      style={{
        maxWidth: "70%",
        alignSelf: "flex-end",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
      }}
    >
      <span
        style={{
          fontSize: 11,
          fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
          color: "#5E5E65",
          display: "block",
          marginBottom: 4,
        }}
      >
        You
      </span>
      <div
        style={{
          backgroundColor: "#93452A",
          color: "#FFFFFF",
          borderRadius: "0.75rem",
          padding: "12px 16px",
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontFamily: "var(--font-inter), Inter, sans-serif",
            lineHeight: 1.6,
            whiteSpace: "pre-wrap",
          }}
        >
          {entry.content}
        </span>
      </div>
      <Timestamp iso={entry.timestamp} />
    </div>
  );
}

function SystemEntry({ entry }: { entry: LogEntry }) {
  return (
    <div style={{ alignSelf: "center", textAlign: "center" }}>
      <span
        style={{
          fontSize: 12,
          fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
          color: "#5E5E65",
          fontStyle: "italic",
        }}
      >
        {entry.content}
      </span>
      <Timestamp iso={entry.timestamp} />
    </div>
  );
}

export function ChatEntry({ entry }: { entry: LogEntry }) {
  switch (entry.type) {
    case "text":
      return <TextEntry entry={entry} />;
    case "tool_use":
      return <ToolUseEntry entry={entry} />;
    case "tool_result":
      return <ToolResultEntry entry={entry} />;
    case "question":
      return <QuestionEntry entry={entry} />;
    case "user_reply":
      return <UserReplyEntry entry={entry} />;
    case "system":
      return <SystemEntry entry={entry} />;
    default:
      return null;
  }
}
