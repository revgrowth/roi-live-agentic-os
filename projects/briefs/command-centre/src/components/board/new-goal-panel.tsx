"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { X, ArrowUp, ChevronDown, Paperclip, Image, FileType, FileText } from "lucide-react";
import type { TaskLevel, PermissionMode, ClaudeModel } from "@/types/task";
import { useTaskStore } from "@/store/task-store";
import { useClientStore } from "@/store/client-store";
import { SlashCommandMenu } from "@/components/shared/slash-command-menu";
import type { TagItem } from "@/components/shared/slash-command-menu";
import type { SlashCommand } from "@/lib/slash-commands";
import { HighlightMirror } from "@/components/modal/reply-input";
import { ModelPicker } from "@/components/shared/model-picker";
import { PermissionPicker } from "@/components/shared/permission-picker";
import { recordTagUsage } from "./goal-chips";
import { LEVEL_LABELS, LEVEL_HINTS } from "@/lib/levels";

// ── Attachment helpers ──────────────────────────────────────────

interface Attachment {
  fileName: string;
  relativePath: string;
  extension: string;
  sizeBytes: number;
}

const IMAGE_EXTS = new Set(["png", "jpg", "jpeg", "gif", "webp", "svg"]);

function getAttachmentIcon(ext: string) {
  if (IMAGE_EXTS.has(ext)) return Image;
  if (ext === "pdf") return FileType;
  return FileText;
}

const MONO = "'DM Mono', monospace";

// ── Static fallback suggestions ─────────────────────────────────
const STATIC_SUGGESTIONS = [
  {
    title: "Manage skills",
    desc: "Install, edit, or import a skill into the system",
    prompt: "I want to work with skills. Show me what's currently installed with `bash scripts/list-skills.sh`, then ask me whether I want to: (1) install a new skill from the catalog, (2) edit or improve an existing skill, or (3) import/create a brand new skill from scratch. Use /meta-skill-creator for editing or creating skills.",
  },
  {
    title: "Create a scheduled task",
    desc: "Automate something on a recurring schedule",
    prompt: "/ops-cron Create a new scheduled cron job. Ask me what I want to automate and how often it should run.",
  },
  {
    title: "Use a skill...",
    desc: "See what's installed and run one",
    prompt: "List all my installed skills with `bash scripts/list-skills.sh` and briefly describe what each one does, so I can pick one to use.",
  },
  {
    title: "Connect to your apps (MCP)...",
    desc: "Link an external service like Notion, Slack, etc.",
    prompt: "I want to connect an external app via MCP. Show me what MCP servers are currently configured in .claude/settings.json, and help me add a new one. Ask which app or service I want to connect.",
  },
  {
    title: "Add a client",
    desc: "Set up a new client workspace",
    prompt: "I want to add a new client. Ask me for the client name, then run `bash scripts/add-client.sh` with it.",
  },
  {
    title: "Perform some research",
    desc: "Find what's trending in your industry",
    prompt: "/str-trending-research Research what's trending in my industry. Ask me what topic or niche to focus on.",
  },
];

const FLAG_OPTIONS: { flag: string; label: string; hint: string; level: TaskLevel }[] = [
  { flag: "--project", label: "--project", hint: "Planned project — multi-deliverable", level: "project" },
  { flag: "--gsd", label: "--gsd", hint: "GSD project — complex multi-phase", level: "gsd" },
];

interface NewGoalPanelProps {
  drawerWidth?: number | null;
  onClose: () => void;
  onCreated: (taskId: string) => void;
  onStartDrawerDrag?: (e: React.MouseEvent) => void;
}

export function NewGoalPanel({
  drawerWidth,
  onClose,
  onCreated,
  onStartDrawerDrag,
}: NewGoalPanelProps) {
  const [message, setMessage] = useState("");
  const [level, setLevel] = useState<TaskLevel>("task");
  const [showLevelMenu, setShowLevelMenu] = useState(false);
  const [model, setModel] = useState<ClaudeModel | null>(null);
  const [permissionMode, setPermissionMode] = useState<PermissionMode>("bypassPermissions");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashQuery, setSlashQuery] = useState("");
  const [showTagMenu, setShowTagMenu] = useState(false);
  const [tagQuery, setTagQuery] = useState("");
  const [showFlagMenu, setShowFlagMenu] = useState(false);
  const [flagQuery, setFlagQuery] = useState("");
  const [flagMenuIndex, setFlagMenuIndex] = useState(0);
  const [promptTags, setPromptTags] = useState<TagItem[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [showClientMenu, setShowClientMenu] = useState(false);

  const descRef = useRef<HTMLTextAreaElement>(null);
  const levelMenuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const clientMenuRef = useRef<HTMLDivElement>(null);

  const createTask = useTaskStore((s) => s.createTask);
  const clients = useClientStore((s) => s.clients);
  const rootName = useClientStore((s) => s.rootName);

  // Fetch prompt tags
  useEffect(() => {
    fetch("/api/prompt-tags")
      .then((r) => r.json())
      .then((data) =>
        setPromptTags(
          (data.tags ?? []).map((t: { name: string; body: string; category?: string; description?: string }) => ({
            name: t.name, body: t.body, category: t.category, description: t.description,
          }))
        )
      )
      .catch(() => {});
  }, []);

  // Auto-focus textarea
  useEffect(() => { descRef.current?.focus(); }, []);

  // Close level menu on outside click
  useEffect(() => {
    if (!showLevelMenu) return;
    const handler = (e: MouseEvent) => {
      if (levelMenuRef.current && !levelMenuRef.current.contains(e.target as Node)) {
        setShowLevelMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showLevelMenu]);

  // Close client menu on outside click
  useEffect(() => {
    if (!showClientMenu) return;
    const handler = (e: MouseEvent) => {
      if (clientMenuRef.current && !clientMenuRef.current.contains(e.target as Node)) {
        setShowClientMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showClientMenu]);

  // Auto-grow textarea
  const autoGrow = useCallback(() => {
    const el = descRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(120, el.scrollHeight)}px`;
  }, []);

  useEffect(() => { autoGrow(); }, [message, autoGrow]);

  const createWithLevel = useCallback(
    async (goalTitle: string, fullDescription: string, taskLevel: TaskLevel) => {
      let taskProjectSlug: string | null = null;
      if (taskLevel === "project" || taskLevel === "gsd") {
        taskProjectSlug = goalTitle
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
          .slice(0, 40);
        try {
          await fetch("/api/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              slug: taskProjectSlug,
              name: goalTitle,
              level: taskLevel === "gsd" ? 3 : 2,
              goal: fullDescription.slice(0, 200),
            }),
          });
        } catch { /* non-critical */ }
      }

      await createTask(goalTitle, fullDescription, taskLevel, taskProjectSlug, undefined, permissionMode, undefined, selectedClientId);

      const tasks = useTaskStore.getState().tasks;
      const created = tasks.find((t) => t.title === goalTitle && t.description === fullDescription);
      return created?.id ?? null;
    },
    [createTask, permissionMode, selectedClientId]
  );

  const handleSubmit = useCallback(async () => {
    const trimmed = message.trim();
    if (!trimmed || isSubmitting) return;

    // Detect and strip --project / --gsd flags
    const flagMatch = trimmed.match(/\s*--(project|gsd)\s*/i);
    let detectedLevel: TaskLevel = level;
    if (flagMatch) {
      detectedLevel = flagMatch[1].toLowerCase() as TaskLevel;
    }
    const cleanMessage = trimmed.replace(/\s*--(project|gsd)\s*/gi, " ").trim();

    // Derive title from first line
    const lines = cleanMessage.split("\n");
    const firstLine = lines[0];
    const goalTitle = firstLine.length <= 60
      ? firstLine
      : firstLine.slice(0, 57).replace(/\s+\S*$/, "") + "...";

    // Build description with attachment paths
    let fullDescription = cleanMessage;
    if (attachments.length > 0) {
      const attachmentLines = attachments.map((a) => `- ${a.relativePath}`).join("\n");
      fullDescription = fullDescription
        ? `${fullDescription}\n\nAttached files:\n${attachmentLines}`
        : `Attached files:\n${attachmentLines}`;
    }

    setIsSubmitting(true);
    const taskId = await createWithLevel(goalTitle, fullDescription || goalTitle, detectedLevel);
    setIsSubmitting(false);
    if (taskId) onCreated(taskId);
  }, [message, attachments, isSubmitting, level, createWithLevel, onCreated]);

  const handleMessageChange = useCallback((value: string) => {
    setMessage(value);

    // Real-time level detection from completed inline flags
    const completedFlag = value.match(/--(project|gsd)\b/i);
    if (completedFlag) {
      setLevel(completedFlag[1].toLowerCase() as TaskLevel);
    }

    const el = descRef.current;
    const cursor = el?.selectionStart ?? value.length;
    const before = value.slice(0, cursor);

    // Check for /command at cursor position (after start-of-string or whitespace)
    const slashMatch = before.match(/(^|[\s])\/([\w:/-]*)$/);
    if (slashMatch) {
      setShowSlashMenu(true);
      setSlashQuery("/" + slashMatch[2]);
      setShowTagMenu(false);
      setTagQuery("");
      setShowFlagMenu(false);
      return;
    }
    setShowSlashMenu(false);
    setSlashQuery("");

    // Check for @tag at cursor position
    const tagMatch = before.match(/(^|[\s])@([\w\/-]*)$/);
    if (tagMatch) {
      setShowTagMenu(true);
      setTagQuery(tagMatch[2]);
      setShowFlagMenu(false);
      return;
    }
    setShowTagMenu(false);
    setTagQuery("");

    // Check for --flag at cursor position (incomplete, for autocomplete)
    const dashMatch = before.match(/(^|[\s])--([\w]*)$/);
    if (dashMatch) {
      setShowFlagMenu(true);
      setFlagQuery(dashMatch[2].toLowerCase());
      setFlagMenuIndex(0);
    } else {
      setShowFlagMenu(false);
      setFlagQuery("");
    }
  }, []);

  const handleSlashSelect = useCallback(
    (cmd: SlashCommand) => {
      setShowSlashMenu(false);
      setSlashQuery("");

      const el = descRef.current;
      const cursor = el?.selectionStart ?? message.length;
      const before = message.slice(0, cursor);
      const after = message.slice(cursor);

      // Replace the partial /query with the full command, add a trailing space
      const replaced = before.replace(/(^|[\s])\/[\w:/-]*$/, `$1${cmd.command} `);
      const newMsg = replaced + after;
      setMessage(newMsg);

      // Re-focus and place cursor right after the inserted command
      requestAnimationFrame(() => {
        if (descRef.current) {
          descRef.current.focus();
          const pos = replaced.length;
          descRef.current.setSelectionRange(pos, pos);
        }
      });
    },
    [message]
  );

  const filteredFlags = FLAG_OPTIONS.filter((f) =>
    !flagQuery || f.flag.slice(2).startsWith(flagQuery)
  );

  const handleFlagSelect = useCallback(
    (option: typeof FLAG_OPTIONS[number]) => {
      setShowFlagMenu(false);
      setFlagQuery("");
      setLevel(option.level);

      const el = descRef.current;
      const cursor = el?.selectionStart ?? message.length;
      const before = message.slice(0, cursor);
      const after = message.slice(cursor);

      // Replace the partial --query with the full flag + trailing space
      const replaced = before.replace(/(^|[\s])--[\w]*$/, `$1${option.flag} `);
      const newMsg = replaced + after;
      setMessage(newMsg);

      requestAnimationFrame(() => {
        if (descRef.current) {
          descRef.current.focus();
          const pos = replaced.length;
          descRef.current.setSelectionRange(pos, pos);
        }
      });
    },
    [message]
  );

  const handleFileUpload = useCallback(async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("dir", "projects");
      const res = await fetch("/api/files/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const result: Attachment = await res.json();
      setAttachments((prev) => [...prev, result]);
    } catch { /* silently fail */ } finally {
      setIsUploading(false);
    }
  }, []);

  const removeAttachment = useCallback((relativePath: string) => {
    setAttachments((prev) => prev.filter((a) => a.relativePath !== relativePath));
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((showSlashMenu || showTagMenu) && ["ArrowDown", "ArrowUp", "Enter", "Tab", "Escape"].includes(e.key)) return;

      // Flag menu keyboard navigation
      if (showFlagMenu && filteredFlags.length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setFlagMenuIndex((i) => (i + 1) % filteredFlags.length);
          return;
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setFlagMenuIndex((i) => (i - 1 + filteredFlags.length) % filteredFlags.length);
          return;
        }
        if (e.key === "Enter" || e.key === "Tab") {
          e.preventDefault();
          handleFlagSelect(filteredFlags[flagMenuIndex]);
          return;
        }
        if (e.key === "Escape") {
          e.preventDefault();
          setShowFlagMenu(false);
          return;
        }
      }

      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit, showSlashMenu, showTagMenu, showFlagMenu, filteredFlags, flagMenuIndex, handleFlagSelect]
  );

  const hasHighlight = message.includes("@") || message.includes("/") || message.includes("--");
  const canSubmit = message.trim().length > 0 && !isSubmitting;

  const suggestions = STATIC_SUGGESTIONS;
  const suggestionsLabel = "Try something like";

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        width: drawerWidth ?? 720,
        background: "white",
        borderLeft: "1px solid #d4cfc9",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        zIndex: 100,
        boxShadow: "-4px 0 24px rgba(0, 0, 0, 0.08)",
      }}
    >
      {/* Resize handle */}
      {onStartDrawerDrag && (
        <div
          onMouseDown={onStartDrawerDrag}
          title="Drag to resize"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 6,
            cursor: "col-resize",
            zIndex: 60,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget.firstChild as HTMLElement | null)?.style?.setProperty("background", "#93452A");
          }}
          onMouseLeave={(e) => {
            (e.currentTarget.firstChild as HTMLElement | null)?.style?.setProperty("background", "transparent");
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 2,
              width: 2,
              background: "transparent",
              transition: "background 150ms ease",
              borderRadius: 1,
            }}
          />
        </div>
      )}

      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 16px",
        borderBottom: "1px solid #e8e4df",
        background: "#faf9f7",
        flexShrink: 0,
      }}>
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            fontFamily: MONO,
            color: "#666",
          }}
        >
          New Goal
        </span>
        <button
          onClick={onClose}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 28,
            height: 28,
            border: "none",
            borderRadius: 6,
            background: "transparent",
            color: "#9C9CA0",
            cursor: "pointer",
          }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Message textarea + suggestions */}
      <div style={{ flex: 1, overflow: "auto", padding: "16px 20px 0" }}>
        <div style={{ position: "relative" }}>
          {showSlashMenu && (
            <SlashCommandMenu
              query={slashQuery}
              onSelect={handleSlashSelect}
              onClose={() => { setShowSlashMenu(false); setSlashQuery(""); }}
              anchor="below"
            />
          )}
          {showTagMenu && promptTags.length > 0 && (
            <SlashCommandMenu
              query={tagQuery}
              onSelect={() => {}}
              onClose={() => { setShowTagMenu(false); setTagQuery(""); }}
              anchor="below"
              mode="tag"
              tagItems={promptTags.filter((t) => !tagQuery || t.name.toLowerCase().includes(tagQuery.toLowerCase()))}
              onTagSelect={(tag) => {
                const el = descRef.current;
                if (el) {
                  const cursor = el.selectionStart ?? message.length;
                  const before = message.slice(0, cursor);
                  const after = message.slice(cursor);
                  const replaced = before.replace(/(^|[\s])@[\w\/-]*$/, `$1@${tag.name} `);
                  setMessage(replaced + after);
                } else {
                  setMessage((prev) => prev + `@${tag.name} `);
                }
                recordTagUsage(tag.name);
                setShowTagMenu(false);
                setTagQuery("");
                descRef.current?.focus();
              }}
            />
          )}
          {showFlagMenu && filteredFlags.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 300,
                marginTop: 28,
                backgroundColor: "#FFFFFF",
                borderRadius: 8,
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.12)",
                border: "1px solid #e5e1dc",
                padding: 4,
                width: 260,
              }}
            >
              <div style={{
                fontSize: 10,
                fontFamily: MONO,
                color: "#9C9CA0",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                padding: "4px 10px 2px",
              }}>
                Level flag
              </div>
              {filteredFlags.map((opt, i) => (
                <button
                  key={opt.flag}
                  onClick={() => handleFlagSelect(opt)}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "7px 10px",
                    fontSize: 12,
                    fontFamily: MONO,
                    border: "none",
                    borderRadius: 5,
                    backgroundColor: i === flagMenuIndex ? "#f3f0ee" : "transparent",
                    color: "#1B1C1B",
                    cursor: "pointer",
                    textAlign: "left" as const,
                    fontWeight: 400,
                  }}
                  onMouseEnter={() => setFlagMenuIndex(i)}
                >
                  <div style={{ fontWeight: 600 }}>{opt.label}</div>
                  <div style={{ fontSize: 10, color: "#9C9CA0", marginTop: 1 }}>
                    {opt.hint}
                  </div>
                </button>
              ))}
            </div>
          )}
          <div style={{ position: "relative" }}>
            {hasHighlight && (
              <HighlightMirror
                text={message}
                style={{
                  fontSize: 15,
                  fontFamily: "var(--font-inter), Inter, sans-serif",
                  lineHeight: 1.6,
                  padding: 0,
                }}
              />
            )}
            <textarea
              ref={descRef}
              value={message}
              onChange={(e) => handleMessageChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What do you want to do? (/ commands, @ tags, -- flags)"
              style={{
                width: "100%",
                fontSize: 15,
                fontFamily: "var(--font-inter), Inter, sans-serif",
                color: hasHighlight ? "transparent" : "#1B1C1B",
                caretColor: "#1B1C1B",
                lineHeight: 1.6,
                border: "none",
                outline: "none",
                background: "transparent",
                resize: "none",
                padding: 0,
                minHeight: 120,
                position: "relative",
                zIndex: 1,
              }}
            />
          </div>
        </div>

        {/* Suggestion chips — visible when textarea is empty */}
        {!message && (
          <div style={{ marginTop: 16 }}>
            <div style={{
              fontSize: 11,
              fontFamily: MONO,
              color: "#9C9CA0",
              textTransform: "uppercase" as const,
              letterSpacing: "0.06em",
              marginBottom: 10,
            }}>
              {suggestionsLabel}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {suggestions.map((s) => (
                <button
                  key={s.title}
                  onClick={() => {
                    setMessage(s.prompt ?? (s.title + (s.desc ? "\n" + s.desc : "")));
                    descRef.current?.focus();
                  }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    padding: "8px 10px",
                    border: "1px solid rgba(218, 193, 185, 0.2)",
                    borderRadius: 8,
                    backgroundColor: "transparent",
                    cursor: "pointer",
                    textAlign: "left" as const,
                    transition: "all 120ms ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#faf9f7";
                    e.currentTarget.style.borderColor = "rgba(218, 193, 185, 0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.borderColor = "rgba(218, 193, 185, 0.2)";
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 600, fontFamily: "var(--font-epilogue), Epilogue, sans-serif", color: "#1B1C1B" }}>
                    {s.title}
                  </span>
                  <span style={{ fontSize: 12, fontFamily: MONO, color: "#9C9CA0" }}>
                    {s.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Attachment chips */}
        {attachments.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", padding: "8px 0" }}>
            {attachments.map((att) => {
              const Icon = getAttachmentIcon(att.extension);
              return (
                <div
                  key={att.relativePath}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "3px 8px",
                    borderRadius: 6,
                    backgroundColor: "rgba(218, 193, 185, 0.15)",
                    fontSize: 11,
                    fontFamily: MONO,
                    color: "#5E5E65",
                  }}
                >
                  <Icon size={12} />
                  <span style={{ maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {att.fileName}
                  </span>
                  <button
                    onClick={() => removeAttachment(att.relativePath)}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", color: "#9C9CA0" }}
                  >
                    <X size={10} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(file);
          e.target.value = "";
        }}
        style={{ display: "none" }}
        accept="image/*,.pdf,.md,.txt,.csv,.json,.html"
      />

      {/* Bottom toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "10px 20px",
          borderTop: "1px solid #e8e4df",
          background: "#faf9f7",
          flexShrink: 0,
        }}
      >
        {/* Attach file */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "4px 6px",
            border: "none",
            borderRadius: 5,
            backgroundColor: "transparent",
            color: isUploading ? "#bbb" : "#5E5E65",
            cursor: isUploading ? "not-allowed" : "pointer",
          }}
          onMouseEnter={(e) => { if (!isUploading) e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.04)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
          title="Attach file"
        >
          <Paperclip size={14} />
        </button>

        <ModelPicker value={model} onChange={setModel} />
        <PermissionPicker value={permissionMode} onChange={setPermissionMode} />

        {/* Level pill — in toolbar */}
        <div ref={levelMenuRef} style={{ position: "relative" }}>
          <button
            onClick={() => setShowLevelMenu(!showLevelMenu)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              padding: "3px 8px",
              fontSize: 11,
              fontWeight: 500,
              fontFamily: MONO,
              border: "1px solid rgba(218, 193, 185, 0.4)",
              borderRadius: 5,
              backgroundColor: "transparent",
              color: "#666",
              cursor: "pointer",
              transition: "all 120ms ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(218, 193, 185, 0.7)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(218, 193, 185, 0.4)"; }}
          >
            {LEVEL_LABELS[level]}
            <ChevronDown size={10} />
          </button>
          {showLevelMenu && (
            <div
              style={{
                position: "absolute",
                bottom: "100%",
                left: 0,
                marginBottom: 4,
                backgroundColor: "#FFFFFF",
                borderRadius: 8,
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.12)",
                border: "1px solid #e5e1dc",
                padding: 4,
                zIndex: 200,
                width: 220,
              }}
            >
              {(["task", "project", "gsd"] as TaskLevel[]).map((l) => {
                const label = LEVEL_LABELS[l];
                const hint = LEVEL_HINTS[l];
                return (
                  <button
                    key={l}
                    onClick={() => { setLevel(l); setShowLevelMenu(false); }}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "7px 10px",
                      fontSize: 12,
                      fontFamily: MONO,
                      border: "none",
                      borderRadius: 5,
                      backgroundColor: level === l ? "#f3f0ee" : "transparent",
                      color: "#1B1C1B",
                      cursor: "pointer",
                      textAlign: "left" as const,
                      fontWeight: level === l ? 600 : 400,
                    }}
                    onMouseEnter={(e) => { if (level !== l) e.currentTarget.style.backgroundColor = "#faf9f7"; }}
                    onMouseLeave={(e) => { if (level !== l) e.currentTarget.style.backgroundColor = "transparent"; }}
                  >
                    <div>{label}</div>
                    <div style={{ fontSize: 10, fontWeight: 400, color: "#9C9CA0", marginTop: 1 }}>
                      {hint}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Client picker — only show when clients exist */}
        {clients.length > 0 && (
          <div ref={clientMenuRef} style={{ position: "relative" }}>
            <button
              onClick={() => setShowClientMenu(!showClientMenu)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "3px 8px",
                fontSize: 11,
                fontWeight: 500,
                fontFamily: MONO,
                border: "1px solid rgba(218, 193, 185, 0.4)",
                borderRadius: 5,
                backgroundColor: "transparent",
                color: "#666",
                cursor: "pointer",
                transition: "all 120ms ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(218, 193, 185, 0.7)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(218, 193, 185, 0.4)"; }}
            >
              {selectedClientId
                ? (clients.find((c) => c.slug === selectedClientId)?.name ?? selectedClientId)
                : rootName
              }
              <ChevronDown size={10} />
            </button>
            {showClientMenu && (
              <div
                style={{
                  position: "absolute",
                  bottom: "100%",
                  left: 0,
                  marginBottom: 4,
                  backgroundColor: "#FFFFFF",
                  borderRadius: 8,
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.12)",
                  border: "1px solid #e5e1dc",
                  padding: 4,
                  zIndex: 200,
                  width: 200,
                }}
              >
                {/* Root option */}
                <button
                  onClick={() => { setSelectedClientId(null); setShowClientMenu(false); }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    width: "100%",
                    padding: "6px 10px",
                    fontSize: 12,
                    fontFamily: MONO,
                    border: "none",
                    borderRadius: 5,
                    backgroundColor: selectedClientId === null ? "#f3f0ee" : "transparent",
                    color: "#1B1C1B",
                    cursor: "pointer",
                    textAlign: "left" as const,
                    fontWeight: selectedClientId === null ? 600 : 400,
                  }}
                  onMouseEnter={(e) => { if (selectedClientId !== null) e.currentTarget.style.backgroundColor = "#faf9f7"; }}
                  onMouseLeave={(e) => { if (selectedClientId !== null) e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  {rootName}
                </button>
                {/* Client options */}
                {clients.map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => { setSelectedClientId(c.slug); setShowClientMenu(false); }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      width: "100%",
                      padding: "6px 10px",
                      fontSize: 12,
                      fontFamily: MONO,
                      border: "none",
                      borderRadius: 5,
                      backgroundColor: selectedClientId === c.slug ? "#f3f0ee" : "transparent",
                      color: "#1B1C1B",
                      cursor: "pointer",
                      textAlign: "left" as const,
                      fontWeight: selectedClientId === c.slug ? 600 : 400,
                    }}
                    onMouseEnter={(e) => { if (selectedClientId !== c.slug) e.currentTarget.style.backgroundColor = "#faf9f7"; }}
                    onMouseLeave={(e) => { if (selectedClientId !== c.slug) e.currentTarget.style.backgroundColor = "transparent"; }}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div style={{ flex: 1 }} />

        {/* Send button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "6px 14px",
            fontSize: 12,
            fontWeight: 600,
            fontFamily: MONO,
            background: canSubmit
              ? "linear-gradient(135deg, #93452A, #B25D3F)"
              : "#e8e4df",
            color: canSubmit ? "#FFFFFF" : "#999",
            border: "none",
            borderRadius: 6,
            cursor: canSubmit ? "pointer" : "default",
            transition: "all 150ms ease",
          }}
          onMouseEnter={(e) => { if (canSubmit) e.currentTarget.style.opacity = "0.9"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
        >
          <ArrowUp size={12} />
          {isSubmitting ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
