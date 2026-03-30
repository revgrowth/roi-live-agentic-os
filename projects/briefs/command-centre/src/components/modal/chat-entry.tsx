"use client";

import { useState } from "react";
import { FileText, FolderOpen, Wrench, ChevronDown, ChevronRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
        opacity: 0.5,
      }}
    >
      {formatTime(iso)}
    </span>
  );
}

const markdownComponents = {
  p: ({ children }: { children?: React.ReactNode }) => <p style={{ margin: "6px 0" }}>{children}</p>,
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
    <a href={href} style={{ color: "#93452A", textDecoration: "underline" }} target="_blank" rel="noopener noreferrer">{children}</a>
  ),
  code: ({ children, className: cn }: { children?: React.ReactNode; className?: string }) => cn
    ? <code style={{ fontFamily: "var(--font-space-grotesk), Space Grotesk, monospace", fontSize: 13 }}>{children}</code>
    : <code style={{ backgroundColor: "rgba(0,0,0,0.06)", padding: "1px 4px", borderRadius: 3, fontFamily: "var(--font-space-grotesk), Space Grotesk, monospace", fontSize: 13 }}>{children}</code>,
  pre: ({ children }: { children?: React.ReactNode }) => <pre style={{ backgroundColor: "rgba(0,0,0,0.04)", padding: 12, borderRadius: 6, overflow: "auto", margin: "8px 0", fontSize: 13 }}>{children}</pre>,
  ul: ({ children }: { children?: React.ReactNode }) => <ul style={{ paddingLeft: 20, margin: "4px 0" }}>{children}</ul>,
  ol: ({ children }: { children?: React.ReactNode }) => <ol style={{ paddingLeft: 20, margin: "4px 0" }}>{children}</ol>,
  li: ({ children }: { children?: React.ReactNode }) => <li style={{ margin: "2px 0" }}>{children}</li>,
  h1: ({ children }: { children?: React.ReactNode }) => <h1 style={{ fontSize: 18, fontWeight: 700, margin: "12px 0 6px" }}>{children}</h1>,
  h2: ({ children }: { children?: React.ReactNode }) => <h2 style={{ fontSize: 16, fontWeight: 700, margin: "10px 0 4px" }}>{children}</h2>,
  h3: ({ children }: { children?: React.ReactNode }) => <h3 style={{ fontSize: 14, fontWeight: 600, margin: "8px 0 4px" }}>{children}</h3>,
  blockquote: ({ children }: { children?: React.ReactNode }) => <blockquote style={{ borderLeft: "3px solid #93452A", paddingLeft: 12, margin: "6px 0", color: "#5E5E65", fontStyle: "italic" }}>{children}</blockquote>,
  table: ({ children }: { children?: React.ReactNode }) => <table style={{ width: "100%", borderCollapse: "collapse", margin: "8px 0", fontSize: 13 }}>{children}</table>,
  th: ({ children }: { children?: React.ReactNode }) => <th style={{ padding: "4px 8px", textAlign: "left" as const, fontWeight: 600, borderBottom: "1px solid rgba(0,0,0,0.1)" }}>{children}</th>,
  td: ({ children }: { children?: React.ReactNode }) => <td style={{ padding: "4px 8px", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>{children}</td>,
  hr: () => <hr style={{ border: "none", borderTop: "1px solid rgba(218, 193, 185, 0.3)", margin: "12px 0" }} />,
};

/**
 * Render a group of consecutive Claude text entries.
 * Short "working" entries (< 200 chars) are shown muted/compact.
 * Substantial entries get full markdown rendering with a card background.
 */
export function TextGroup({ entries }: { entries: LogEntry[] }) {
  return (
    <>
      {entries.map((entry) => {
        const isSubstantial = entry.content.length > 200;

        if (!isSubstantial) {
          return (
            <div key={entry.id} style={{ width: "100%", display: "flex", alignItems: "baseline", gap: 8 }}>
              <div
                className="chat-markdown"
                style={{
                  fontSize: 13,
                  fontFamily: "var(--font-inter), Inter, sans-serif",
                  color: "#5E5E65",
                  lineHeight: 1.5,
                }}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                  {entry.content}
                </ReactMarkdown>
              </div>
              <Timestamp iso={entry.timestamp} />
            </div>
          );
        }

        return (
          <div key={entry.id} style={{ width: "100%" }}>
            <div
              className="chat-markdown"
              style={{
                backgroundColor: "#F9F8F7",
                borderRadius: "0.5rem",
                border: "1px solid rgba(218, 193, 185, 0.15)",
                padding: "16px 20px",
                fontSize: 14,
                fontFamily: "var(--font-inter), Inter, sans-serif",
                color: "#1B1C1B",
                lineHeight: 1.6,
              }}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {entry.content}
              </ReactMarkdown>
            </div>
            <Timestamp iso={entry.timestamp} />
          </div>
        );
      })}
    </>
  );
}

/**
 * Extract a human-readable label from a tool_use entry.
 */
function extractToolLabel(entry: LogEntry): string {
  const name = entry.toolName || "Tool";
  let detail = "";
  if (entry.toolArgs) {
    try {
      const parsed = JSON.parse(entry.toolArgs);
      // Read/Write/Edit — show file path
      if (parsed.file_path) {
        const parts = String(parsed.file_path).split("/");
        detail = parts.slice(-2).join("/");
      } else if (parsed.path) {
        const parts = String(parsed.path).split("/");
        detail = parts.slice(-2).join("/");
      } else if (parsed.pattern) {
        detail = String(parsed.pattern);
      } else if (parsed.command) {
        const cmd = String(parsed.command);
        detail = cmd.length > 50 ? cmd.slice(0, 50) + "..." : cmd;
      } else {
        const firstKey = Object.keys(parsed)[0];
        if (firstKey) {
          const val = String(parsed[firstKey]);
          detail = val.length > 50 ? val.slice(0, 50) + "..." : val;
        }
      }
    } catch {
      detail = entry.toolArgs.slice(0, 50);
    }
  }
  return detail ? `${name}: ${detail}` : name;
}

/**
 * Categorise a tool_use entry for the business summary.
 */
function categoriseTool(entry: LogEntry): "context" | "output" | "action" {
  const name = (entry.toolName || "").toLowerCase();
  const args = entry.toolArgs || "";

  // Read-like tools = context loading
  if (name === "read" || name === "glob" || name === "grep" || name === "webfetch" || name === "websearch") {
    return "context";
  }

  // Write/Edit = output
  if (name === "write" || name === "edit") {
    return "output";
  }

  // Bash with git, npm build, etc = action
  if (name === "bash") {
    if (args.includes("git") || args.includes("npm") || args.includes("node")) return "action";
    // Bash reads (cat, ls) = context
    if (args.includes("cat ") || args.includes("ls ") || args.includes("head ")) return "context";
    return "action";
  }

  return "action";
}

/**
 * A collapsed summary of tool operations, grouped by category.
 * Shows "Context loaded", "Files created/edited", "Actions run" with expand toggle.
 */
export function ToolSummaryBlock({ entries }: { entries: LogEntry[] }) {
  const [expanded, setExpanded] = useState(false);

  const contextItems: string[] = [];
  const outputItems: string[] = [];
  const actionItems: string[] = [];

  for (const entry of entries) {
    if (entry.type !== "tool_use") continue;
    const category = categoriseTool(entry);
    const label = extractToolLabel(entry);
    if (category === "context") contextItems.push(label);
    else if (category === "output") outputItems.push(label);
    else actionItems.push(label);
  }

  const hasSummary = contextItems.length > 0 || outputItems.length > 0 || actionItems.length > 0;
  if (!hasSummary) return null;

  const chipStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    padding: "3px 10px",
    borderRadius: "0.375rem",
    fontSize: 12,
    fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
    fontWeight: 500,
    backgroundColor: "#F6F3F1",
    color: "#5E5E65",
    whiteSpace: "nowrap",
  };

  return (
    <div style={{ width: "100%" }}>
      {/* Collapsed summary chips */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          alignItems: "center",
        }}
      >
        {contextItems.length > 0 && (
          <span style={chipStyle}>
            <FolderOpen size={12} />
            {contextItems.length} file{contextItems.length !== 1 ? "s" : ""} read
          </span>
        )}
        {outputItems.length > 0 && (
          <span style={{ ...chipStyle, backgroundColor: "#FFDBCF", color: "#390C00" }}>
            <FileText size={12} />
            {outputItems.length} file{outputItems.length !== 1 ? "s" : ""} written
          </span>
        )}
        {actionItems.length > 0 && (
          <span style={chipStyle}>
            <Wrench size={12} />
            {actionItems.length} action{actionItems.length !== 1 ? "s" : ""}
          </span>
        )}
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "2px 4px",
            display: "inline-flex",
            alignItems: "center",
            gap: 3,
            fontSize: 11,
            fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
            color: "#93452A",
            fontWeight: 500,
          }}
        >
          {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          {expanded ? "Hide" : "Details"}
        </button>
      </div>

      {/* Expanded detail list */}
      {expanded && (
        <div
          style={{
            marginTop: 8,
            padding: "10px 14px",
            backgroundColor: "#F9F8F7",
            borderRadius: "0.375rem",
            border: "1px solid #EAE8E6",
            fontSize: 12,
            fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
            color: "#5E5E65",
            lineHeight: 1.8,
          }}
        >
          {contextItems.length > 0 && (
            <div>
              <div style={{ fontWeight: 600, color: "#1B1C1B", marginBottom: 2 }}>Context loaded</div>
              {contextItems.map((item, i) => (
                <div key={i} style={{ paddingLeft: 12 }}>{item}</div>
              ))}
            </div>
          )}
          {outputItems.length > 0 && (
            <div style={{ marginTop: contextItems.length > 0 ? 8 : 0 }}>
              <div style={{ fontWeight: 600, color: "#1B1C1B", marginBottom: 2 }}>Files created / edited</div>
              {outputItems.map((item, i) => (
                <div key={i} style={{ paddingLeft: 12 }}>{item}</div>
              ))}
            </div>
          )}
          {actionItems.length > 0 && (
            <div style={{ marginTop: (contextItems.length > 0 || outputItems.length > 0) ? 8 : 0 }}>
              <div style={{ fontWeight: 600, color: "#1B1C1B", marginBottom: 2 }}>Actions</div>
              {actionItems.map((item, i) => (
                <div key={i} style={{ paddingLeft: 12 }}>{item}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function QuestionEntry({ entry }: { entry: LogEntry }) {
  return (
    <div style={{ width: "100%" }}>
      <div
        className="chat-markdown"
        style={{
          borderLeft: "3px solid #93452A",
          backgroundColor: "#FFF5F3",
          padding: "12px 16px",
          borderRadius: "0 0.5rem 0.5rem 0",
          fontSize: 14,
          fontFamily: "var(--font-inter), Inter, sans-serif",
          color: "#1B1C1B",
          lineHeight: 1.6,
        }}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
          {entry.content}
        </ReactMarkdown>
      </div>
      <Timestamp iso={entry.timestamp} />
    </div>
  );
}

function UserReplyEntry({ entry }: { entry: LogEntry }) {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
      }}
    >
      <div
        style={{
          maxWidth: "70%",
          backgroundColor: "rgba(147, 69, 42, 0.06)",
          border: "1px solid rgba(218, 193, 185, 0.3)",
          color: "#1B1C1B",
          borderRadius: "0.75rem 0.75rem 0.25rem 0.75rem",
          padding: "10px 14px",
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
    <div style={{ width: "100%", textAlign: "center" }}>
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
    </div>
  );
}

/**
 * Single entry renderer — used for non-grouped entries.
 */
export function ChatEntry({ entry }: { entry: LogEntry }) {
  switch (entry.type) {
    case "text":
      return <TextGroup entries={[entry]} />;
    case "tool_use":
    case "tool_result":
      // These are handled by ToolSummaryBlock in grouped rendering
      return null;
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
