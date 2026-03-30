"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  ArrowUp, ChevronLeft, ChevronRight, X, MessageCircle,
  CheckCircle2, Paperclip,
} from "lucide-react";
import type { Task, LogEntry, PermissionMode } from "@/types/task";
import { PERMISSION_MODE_LABELS, PERMISSION_MODE_HINTS } from "@/types/task";
import { useTaskStore } from "@/store/task-store";

const ALL_MODES: PermissionMode[] = ["plan", "default", "acceptEdits", "auto", "bypassPermissions"];

const MODE_BG: Record<PermissionMode, string> = {
  plan: "#E0E7FF", default: "#F3F4F6", acceptEdits: "#FEF3C7",
  auto: "#D1FAE5", bypassPermissions: "#FEE2E2",
};
const MODE_TEXT: Record<PermissionMode, string> = {
  plan: "#3730A3", default: "#374151", acceptEdits: "#92400E",
  auto: "#065F46", bypassPermissions: "#991B1B",
};

function timeAgo(dateStr: string): string {
  const ts = new Date(dateStr).getTime();
  if (isNaN(ts)) return "--";
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  return `${Math.floor(hr / 24)}d ago`;
}

const SHORT_AFFIRMATION = /^(yes|no|ok|okay|sure|go\s*ahead|looks?\s*good|that'?s?\s*(fine|great|it)|perfect|great|thanks|y|n|approve|continue|proceed|done|ship\s*it|lgtm)\s*[.!?]*$/i;

/** Turn technical error messages into plain English */
function cleanErrorMessage(msg: string): string {
  if (/Claude CLI exited with code/i.test(msg)) return "The task ran into a problem and couldn\u2019t finish.";
  if (/timeout/i.test(msg)) return "The task took too long and was stopped.";
  if (/SIGTERM|SIGKILL|killed/i.test(msg)) return "The task was interrupted.";
  if (/ENOENT|not found/i.test(msg)) return "A required file or tool couldn\u2019t be found.";
  if (/permission denied/i.test(msg)) return "The task was blocked by a permission issue.";
  if (/rate limit/i.test(msg)) return "Hit an API rate limit \u2014 try again shortly.";
  // Strip file paths and code from the message
  return cleanText(msg);
}

/** Clean noise from raw text — strip markdown, code fences, system lines, file paths */
function cleanText(text: string): string {
  return text
    .replace(/^Working directory:\s*.+$/gm, "")
    .replace(/^You are running as a scheduled job.*/gm, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/\[SILENT\]/gi, "")
    .replace(/^#{1,4}\s+/gm, "")
    .replace(/\*{1,2}([^*]+)\*{1,2}/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^\s*[-*]\s+/gm, "")
    .replace(/(?:\/[\w.-]+){2,}/g, "")              // remove absolute file paths
    .replace(/[\w.-]+\/[\w.-]+\/[\w.-]+/g, "")       // remove relative paths
    .replace(/\b\w+\.(md|json|ts|tsx|js|py|sh|yaml|csv|txt|log)\b/gi, "")
    .replace(/\n{2,}/g, "\n")
    .replace(/\s+/g, " ")
    .trim();
}

/** Extract a readable one-liner from text, max length */
function oneLiner(text: string, max = 80): string {
  const cleaned = cleanText(text);
  if (!cleaned) return "";

  // Split into sentences, skip purely technical ones
  const lines = cleaned.split(/[.\n]/)
    .map((l) => l.trim())
    .filter((l) => l.length > 10)
    .filter((l) => !/^(Saved|Wrote|Created|Report saved|Output saved)\s+(to|at|in)\b/i.test(l));

  const sentence = lines[0] || cleaned.split("\n")[0]?.trim() || cleaned;
  return sentence.length > max ? sentence.slice(0, max - 1) + "\u2026" : sentence;
}

/** Find the last substantive user reply (skip short affirmations) */
function getLastUserIntent(entries: LogEntry[]): { text: string | null; timestamp: string | null } {
  for (let i = entries.length - 1; i >= 0; i--) {
    const e = entries[i];
    if (e.type === "user_reply" && e.content.trim()) {
      const raw = e.content.trim();
      // Skip short affirmations — find the actual intent
      if (!SHORT_AFFIRMATION.test(raw)) {
        return { text: oneLiner(raw, 80), timestamp: e.timestamp };
      }
    }
  }
  return { text: null, timestamp: null };
}

export function ReviewQueue({ tasks }: { tasks: Task[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [justSent, setJustSent] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{ name: string; path: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const appendLogEntry = useTaskStore((s) => s.appendLogEntry);
  const fetchLogEntries = useTaskStore((s) => s.fetchLogEntries);
  const allLogEntries = useTaskStore((s) => s.logEntries);
  const openPanel = useTaskStore((s) => s.openPanel);
  const updateTask = useTaskStore((s) => s.updateTask);

  const [viewingId, setViewingId] = useState<string | null>(null);

  const queue = tasks.filter((t) => !dismissed.has(t.id)).sort((a, b) => {
    const p = (t: Task) => t.needsInput ? 0 : (t.errorMessage && t.status !== "done") ? 1 : 2;
    return p(a) !== p(b) ? p(a) - p(b) : new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const viewingIndex = viewingId ? queue.findIndex((t) => t.id === viewingId) : -1;
  const safeIndex = viewingIndex >= 0 ? viewingIndex : Math.min(currentIndex, Math.max(0, queue.length - 1));
  const current = queue[safeIndex] ?? null;

  useEffect(() => { if (current && current.id !== viewingId) setViewingId(current.id); }, [current?.id]);
  useEffect(() => { if (current) fetchLogEntries(current.id); }, [current?.id, fetchLogEntries]);
  useEffect(() => { if (safeIndex !== currentIndex) setCurrentIndex(safeIndex); }, [safeIndex, currentIndex]);
  useEffect(() => { if (current && textareaRef.current) textareaRef.current.focus(); setAttachedFile(null); }, [current?.id]);
  useEffect(() => { if (!justSent) return; const t = setTimeout(() => setJustSent(false), 1500); return () => clearTimeout(t); }, [justSent]);

  const logEntries = current ? (allLogEntries[current.id] ?? []) : [];
  const userIntent = getLastUserIntent(logEntries);
  const lastInteracted = userIntent.timestamp || current?.lastReplyAt;

  // Claude's summary: prefer activityLabel (set by hooks, already curated)
  // Only fall back to log parsing if activityLabel is missing/generic
  const claudeSummary = (() => {
    const label = current?.activityLabel;
    if (label && label !== "Waiting for input" && label !== "Processing reply...") {
      return label.length > 100 ? label.slice(0, 97) + "\u2026" : label;
    }
    // Fallback: last text entry from Claude
    for (let i = logEntries.length - 1; i >= 0; i--) {
      if (logEntries[i].type === "text" && logEntries[i].content.trim()) {
        return oneLiner(logEntries[i].content, 100);
      }
    }
    return null;
  })();

  const handleSubmit = useCallback(async () => {
    if (!current || !message.trim() || isSending) return;
    let trimmed = message.trim();
    if (attachedFile) trimmed = `[Attached: ${attachedFile.name} at ${attachedFile.path}]\n\n${trimmed}`;
    setIsSending(true);
    appendLogEntry(current.id, { id: "local-" + crypto.randomUUID(), type: "user_reply", timestamp: new Date().toISOString(), content: trimmed });
    setMessage(""); setAttachedFile(null);
    try {
      const res = await fetch(`/api/tasks/${current.id}/reply`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: trimmed }) });
      if (!res.ok) console.error(`[review-queue] Reply failed: ${res.status}`);
    } catch { console.error("[review-queue] Reply failed"); }
    finally {
      setIsSending(false); setJustSent(true);
      if (queue.length > 1) { const n = safeIndex < queue.length - 1 ? safeIndex + 1 : 0; setCurrentIndex(n); setViewingId(queue[n]?.id ?? null); }
    }
  }, [current, message, isSending, appendLogEntry, queue, safeIndex, attachedFile]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
  }, [handleSubmit]);

  const nav = useCallback((dir: 1 | -1) => {
    if (queue.length <= 1) return;
    const n = (safeIndex + dir + queue.length) % queue.length;
    setCurrentIndex(n); setViewingId(queue[n]?.id ?? null); setMessage("");
  }, [queue, safeIndex]);

  const handleFileUpload = useCallback(async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData(); fd.append("file", file);
      const res = await fetch("/api/files/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const r = await res.json();
      setAttachedFile({ name: r.fileName, path: r.relativePath });
    } catch (err) { console.error("[review-queue] Upload failed:", err); }
    finally { setUploading(false); }
  }, []);

  if (!current || queue.length === 0) return null;

  const isInput = current.needsInput === true;
  const isError = !!(current.errorMessage && current.status !== "done");
  const accentColor = isError ? "#C04030" : isInput ? "#D2783C" : "#93452A";
  const labelText = isError ? "Error" : isInput ? "Waiting for you" : "Review";
  const currentMode = current.permissionMode || "default";

  // The prompt — only for needsInput/error, not review (review just needs the exchange lines)
  // Clean up technical language into plain English
  const rawPrompt = isError
    ? cleanErrorMessage(current.errorMessage || "Something went wrong.")
    : isInput
      ? cleanText(current.errorMessage || current.activityLabel || "Claude needs your input.")
      : null;
  const prompt = rawPrompt && rawPrompt !== claudeSummary
    ? (rawPrompt.length > 200 ? rawPrompt.slice(0, 197) + "\u2026" : rawPrompt)
    : null;

  return (
    <div style={{
      marginBottom: 12, borderRadius: 10, overflow: "hidden",
      border: `1px solid ${isInput || isError ? "rgba(210, 120, 60, 0.25)" : "rgba(218, 193, 185, 0.25)"}`,
      backgroundColor: isInput || isError ? "rgba(210, 120, 60, 0.03)" : "rgba(147, 69, 42, 0.02)",
    }}>
      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 12px", borderBottom: "1px solid rgba(218, 193, 185, 0.12)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: accentColor, flexShrink: 0, animation: isInput || isError ? "pulse-dot 2s ease-in-out infinite" : undefined }} />
          <span style={{ fontSize: 11, fontWeight: 600, fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif", color: accentColor, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            {labelText}
          </span>
          {queue.length > 1 && (
            <span style={{ fontSize: 10, fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif", color: "#9C9CA0" }}>
              {safeIndex + 1}/{queue.length}
            </span>
          )}
          {lastInteracted && (
            <span style={{ fontSize: 10, fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif", color: "#B0B0B5" }}>
              · {timeAgo(lastInteracted)}
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Compact mode selector */}
          <div style={{ display: "flex", gap: 0, backgroundColor: "rgba(234, 232, 230, 0.6)", borderRadius: 3, padding: 1, height: 18, alignItems: "center", marginRight: 4 }}>
            {ALL_MODES.map((mode) => {
              const active = currentMode === mode;
              return (
                <button key={mode} onClick={() => updateTask(current.id, { permissionMode: mode })} title={PERMISSION_MODE_HINTS[mode]}
                  style={{
                    padding: "0 5px", fontSize: 8, fontWeight: 600, fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                    border: "none", cursor: "pointer", borderRadius: 2, height: 14, lineHeight: "14px",
                    backgroundColor: active ? MODE_BG[mode] : "transparent",
                    color: active ? MODE_TEXT[mode] : "#C0C0C4", transition: "all 150ms ease",
                  }}
                >{PERMISSION_MODE_LABELS[mode]}</button>
              );
            })}
          </div>
          {queue.length > 1 && (<>
            <Btn onClick={() => nav(-1)} label="Previous"><ChevronLeft size={14} /></Btn>
            <Btn onClick={() => nav(1)} label="Next"><ChevronRight size={14} /></Btn>
          </>)}
          <Btn onClick={() => { if (current) updateTask(current.id, { status: "done" }); setMessage(""); }} label="Done" hover="#6B8E6B"><CheckCircle2 size={14} /></Btn>
          <Btn onClick={() => { if (current) { setDismissed((p) => new Set(p).add(current.id)); setMessage(""); } }} label="Skip"><X size={14} /></Btn>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ padding: "10px 14px 8px" }}>
        {/* Title */}
        <div
          onClick={() => openPanel(current.id)}
          style={{
            fontSize: 14, fontWeight: 700, fontFamily: "var(--font-inter), Inter, sans-serif",
            color: "#1B1C1B", cursor: "pointer", marginBottom: 8,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}
          title="Open full conversation"
        >
          {current.title}
        </div>

        {/* Exchange: you → claude, compact */}
        {(userIntent.text || claudeSummary) && (
          <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: prompt ? 8 : 4, fontSize: 12, fontFamily: "var(--font-inter), Inter, sans-serif", lineHeight: 1.4 }}>
            {userIntent.text && (
              <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#7A5638" }}>
                <span style={{ color: "#B0B0B5", fontSize: 10, fontWeight: 600, fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif", marginRight: 6 }}>You</span>
                {userIntent.text}
              </div>
            )}
            {claudeSummary && (
              <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#5E5E65" }}>
                <span style={{ color: "#B0B0B5", fontSize: 10, fontWeight: 600, fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif", marginRight: 6 }}>Claude</span>
                {claudeSummary}
              </div>
            )}
          </div>
        )}

        {/* Prompt — only when Claude is asking something or there's an error */}
        {prompt && (
          <div style={{
            fontSize: 13, fontFamily: "var(--font-inter), Inter, sans-serif",
            color: isError ? "#8B3A2E" : "#5E5E65", lineHeight: 1.45,
            padding: "6px 10px", backgroundColor: "rgba(218, 193, 185, 0.08)",
            borderRadius: 6, borderLeft: `2px solid ${accentColor}`, marginBottom: 4,
          }}>
            {prompt}
          </div>
        )}
      </div>

      {/* ── Input ── */}
      <div style={{ padding: "6px 14px 10px", borderTop: "1px solid rgba(218, 193, 185, 0.08)" }}>
        {justSent ? (
          <div style={{ fontSize: 12, fontFamily: "var(--font-inter), Inter, sans-serif", color: "#6B8E6B", padding: "5px 0", display: "flex", alignItems: "center", gap: 6 }}>
            <MessageCircle size={12} /> Sent{queue.length > 1 ? " — next" : ""}
          </div>
        ) : (
          <>
            {attachedFile && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 7px", marginBottom: 5, backgroundColor: "rgba(147, 69, 42, 0.06)", borderRadius: 4, fontSize: 11, fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif", color: "#93452A" }}>
                <Paperclip size={9} /> {attachedFile.name}
                <button onClick={() => setAttachedFile(null)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "#9C9CA0", display: "flex" }}><X size={9} /></button>
              </div>
            )}
            <div style={{ position: "relative" }}>
              <input ref={fileInputRef} type="file" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); e.target.value = ""; }} style={{ display: "none" }} accept="image/*,.pdf,.md,.txt,.csv,.json,.html" />
              <textarea
                ref={textareaRef} value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={handleKeyDown}
                placeholder={isInput ? "Reply to Claude\u2026" : "Follow up or approve\u2026"} rows={1}
                style={{
                  width: "100%", fontSize: 13, fontFamily: "var(--font-inter), Inter, sans-serif",
                  padding: "8px 62px 8px 12px", backgroundColor: "#FFFFFF",
                  outline: "1px solid rgba(218, 193, 185, 0.2)", borderRadius: 8,
                  border: "none", resize: "none", lineHeight: 1.5, color: "#1B1C1B", boxSizing: "border-box",
                }}
                onFocus={(e) => { (e.target as HTMLTextAreaElement).style.outlineColor = accentColor; }}
                onBlur={(e) => { (e.target as HTMLTextAreaElement).style.outlineColor = "rgba(218, 193, 185, 0.3)"; }}
              />
              <div style={{ position: "absolute", right: 4, top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center", gap: 2 }}>
                <button onClick={() => fileInputRef.current?.click()} disabled={uploading} title="Attach file"
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 6, border: "none", background: "none", cursor: uploading ? "wait" : "pointer", color: attachedFile ? "#93452A" : "#B0B0B5", transition: "color 100ms ease" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#93452A"; }} onMouseLeave={(e) => { e.currentTarget.style.color = attachedFile ? "#93452A" : "#B0B0B5"; }}
                >{uploading ? <span style={{ width: 11, height: 11, borderRadius: "50%", border: "2px solid #EAE8E6", borderTopColor: "#93452A", animation: "spin 1s linear infinite", display: "inline-block" }} /> : <Paperclip size={14} />}</button>
                <button onClick={handleSubmit} disabled={!message.trim() || isSending}
                  style={{
                    width: 26, height: 26, borderRadius: 5, border: "none",
                    background: message.trim() && !isSending ? accentColor : "transparent",
                    color: message.trim() && !isSending ? "#FFFFFF" : "#C0C0C4",
                    cursor: message.trim() && !isSending ? "pointer" : "default",
                    display: "flex", alignItems: "center", justifyContent: "center", transition: "all 150ms ease",
                  }}
                ><ArrowUp size={13} /></button>
              </div>
            </div>
          </>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function Btn({ onClick, label, children, hover }: { onClick: () => void; label: string; children: React.ReactNode; hover?: string }) {
  return (
    <button onClick={(e) => { e.stopPropagation(); onClick(); }} title={label}
      style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", padding: 4, borderRadius: 4, color: "#9C9CA0", transition: "color 100ms ease" }}
      onMouseEnter={(e) => { e.currentTarget.style.color = hover || "#5E5E65"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "#9C9CA0"; }}
    >{children}</button>
  );
}
