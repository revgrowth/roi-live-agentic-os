"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Paperclip, X, Image, FileType, FileText, Sunrise, Moon, AlertTriangle, ChevronDown, Zap, ClipboardList, Layers } from "lucide-react";
import type { TaskLevel, PermissionMode } from "@/types/task";
import { useTaskStore } from "@/store/task-store";

import { SlashCommandMenu } from "@/components/shared/slash-command-menu";
import type { SlashCommand } from "@/lib/slash-commands";

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

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

import { PERMISSION_MODE_LABELS, PERMISSION_MODE_HINTS, LEVEL_LABELS } from "@/types/task";

const permissionModes: { value: PermissionMode; label: string; hint: string }[] = [
  { value: "default", label: PERMISSION_MODE_LABELS.default, hint: PERMISSION_MODE_HINTS.default },
  { value: "bypassPermissions", label: PERMISSION_MODE_LABELS.bypassPermissions, hint: PERMISSION_MODE_HINTS.bypassPermissions },
];

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

const LEVEL_COLORS: Record<TaskLevel, { bg: string; text: string }> = {
  task: { bg: "#E8E6E4", text: "#5E5E65" },
  project: { bg: "#FFDBCF", text: "#390C00" },
  gsd: { bg: "#DBEAFE", text: "#1E40AF" },
};

interface GsdStatus {
  exists: boolean;
  projectName?: string;
  currentPhase?: number | null;
  totalPhases?: number | null;
}

type ScopingState =
  | { phase: "idle" }
  | { phase: "picking"; description: string }
  | { phase: "error"; message: string };

export function TaskCreateInput({ projectSlug }: { projectSlug?: string | null }) {
  const [description, setDescription] = useState("");
  const [permissionMode, setPermissionMode] = useState<PermissionMode>("default");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Scoping state
  const [scopingState, setScopingState] = useState<ScopingState>({ phase: "idle" });
  const [levelOverride, setLevelOverride] = useState<TaskLevel | null>(null);
  const [showLevelOverride, setShowLevelOverride] = useState(false);
  const [confirmationBadge, setConfirmationBadge] = useState<string | null>(null);

  // Level picker modal state
  const [pickedLevel, setPickedLevel] = useState<TaskLevel | null>(null);
  const [notes, setNotes] = useState("");
  const notesRef = useRef<HTMLTextAreaElement>(null);

  // Attachments state
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // GSD conflict state
  const [gsdStatus, setGsdStatus] = useState<GsdStatus | null>(null);

  const createTask = useTaskStore((s) => s.createTask);
  const updateTask = useTaskStore((s) => s.updateTask);
  const [quickStarting, setQuickStarting] = useState<string | null>(null);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashQuery, setSlashQuery] = useState("");

  const descRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // Auto-grow textarea
  const adjustTextareaHeight = useCallback(() => {
    const el = descRef.current;
    if (!el) return;
    el.style.height = "44px";
    const scrollH = el.scrollHeight;
    el.style.height = Math.min(Math.max(scrollH, 44), 160) + "px";
  }, []);

  // Collapse when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        formRef.current &&
        !formRef.current.contains(e.target as Node) &&
        !description.trim() &&
        attachments.length === 0 &&
        scopingState.phase === "idle"
      ) {
        setIsExpanded(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [description, attachments.length, scopingState.phase]);

  // Clear confirmation badge after 3s
  useEffect(() => {
    if (!confirmationBadge) return;
    const timer = setTimeout(() => setConfirmationBadge(null), 3000);
    return () => clearTimeout(timer);
  }, [confirmationBadge]);

  const handleFileUpload = useCallback(async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("dir", "projects");

      const res = await fetch("/api/files/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }

      const result: Attachment = await res.json();
      setAttachments((prev) => [...prev, result]);
      setIsExpanded(true);
    } catch {
      // Silently fail — user can retry
    } finally {
      setIsUploading(false);
    }
  }, []);

  const removeAttachment = useCallback((relativePath: string) => {
    setAttachments((prev) => prev.filter((a) => a.relativePath !== relativePath));
  }, []);

  /** Create the task (and project if needed) with the determined level */
  const createWithLevel = useCallback(async (
    fullDescription: string,
    level: TaskLevel,
  ) => {
    // Quick fallback title from first line
    const firstLine = fullDescription.split("\n")[0];
    const firstSentence = firstLine.match(/^[^.!?]+[.!?]?/)?.[0] || firstLine;
    const fallbackTitle = firstSentence.length <= 60
      ? firstSentence
      : firstSentence.slice(0, 57).replace(/\s+\S*$/, "") + "...";

    // For project/gsd levels, create a project row
    let taskProjectSlug = projectSlug || null;
    if ((level === "project" || level === "gsd") && !taskProjectSlug) {
      const slug = fallbackTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 40);
      taskProjectSlug = slug;

      // Check for GSD conflicts
      if (level === "gsd") {
        try {
          const gsdRes = await fetch("/api/gsd/status");
          const gsdData = await gsdRes.json();
          if (gsdData?.exists) {
            setGsdStatus(gsdData);
            return; // Block — show conflict
          }
        } catch { /* proceed */ }
      }

      // Create project brief (projects/briefs/{slug}/brief.md)
      try {
        await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug,
            name: fallbackTitle,
            level: level === "gsd" ? 3 : 2,
            goal: fullDescription.slice(0, 200),
          }),
        });
      } catch { /* non-critical */ }
    }

    // Create task as "queued" — goes straight to Claude's Turn
    await createTask(fallbackTitle, fullDescription, level, taskProjectSlug, undefined, permissionMode);

    // AI title generation in background
    fetch("/api/tasks/generate-title", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: fullDescription }),
    })
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data?.title && data.title !== fallbackTitle) {
          const tasks = useTaskStore.getState().tasks;
          const created = tasks.find(
            (t) => t.title === fallbackTitle && t.description === fullDescription
          );
          // Only update title within 30s of creation — after that, lock the title
          if (created && (Date.now() - new Date(created.createdAt).getTime()) < 30000) {
            updateTask(created.id, { title: data.title });
          }
        }
      })
      .catch(() => { /* fallback title is fine */ });
  }, [createTask, updateTask, permissionMode, projectSlug]);

  /** Handle level selection from the modal */
  const handleLevelSelect = useCallback(async (level: TaskLevel) => {
    if (scopingState.phase !== "picking") return;
    let desc = scopingState.description;
    if (notes.trim()) {
      desc += `\n\nNotes: ${notes.trim()}`;
    }

    setScopingState({ phase: "idle" });
    setIsExpanded(false);
    setNotes("");
    setPickedLevel(null);
    setConfirmationBadge(`Queued — ${LEVEL_LABELS[level]}`);
    setIsSubmitting(true);
    await createWithLevel(desc, level);
    setIsSubmitting(false);
  }, [scopingState, notes, createWithLevel]);

  // Keyboard shortcuts for level picker modal
  useEffect(() => {
    if (scopingState.phase !== "picking") return;
    const handler = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in notes textarea
      if (document.activeElement === notesRef.current) return;
      if (e.key === "1") handleLevelSelect("task");
      else if (e.key === "2") handleLevelSelect("project");
      else if (e.key === "3") handleLevelSelect("gsd");
      else if (e.key === "Escape") {
        setScopingState({ phase: "idle" });
        setPickedLevel(null);
        setNotes("");
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [scopingState.phase, handleLevelSelect]);

  const handleSubmit = useCallback(async () => {
    const trimmedDesc = description.trim();
    if (!trimmedDesc || isSubmitting) return;
    setGsdStatus(null);

    // Build description with attachment paths
    let fullDescription = trimmedDesc;
    if (attachments.length > 0) {
      const attachmentLines = attachments.map((a) => `- ${a.relativePath}`).join("\n");
      const attachmentBlock = `\n\nAttached files:\n${attachmentLines}`;
      fullDescription = fullDescription + attachmentBlock;
    }

    // Clear form immediately
    setDescription("");
    setAttachments([]);

    // If user has overridden the level, skip the modal
    if (levelOverride) {
      setIsExpanded(false);
      const level = levelOverride;
      setLevelOverride(null);
      setShowLevelOverride(false);
      setConfirmationBadge(`Queued — ${LEVEL_LABELS[level]}`);
      setIsSubmitting(true);
      await createWithLevel(fullDescription, level);
      setIsSubmitting(false);
      return;
    }

    // Show level picker modal
    setScopingState({ phase: "picking", description: fullDescription });
  }, [description, attachments, isSubmitting, levelOverride, createWithLevel]);

  const handleQuickStart = useCallback(async (type: "start-here" | "wrap-up") => {
    if (quickStarting) return;
    setQuickStarting(type);
    try {
      const taskTitle = type === "start-here" ? "Start Here" : "Wrap Up";
      const taskDesc = type === "start-here" ? "Run /start-here" : "Run /wrap-up";
      await createTask(taskTitle, taskDesc, "task");
      const tasks = useTaskStore.getState().tasks;
      const newTask = tasks.find(
        (t) => t.title === taskTitle && t.status === "backlog"
      );
      if (newTask) {
        await updateTask(newTask.id, { status: "queued" });
      }
    } finally {
      setQuickStarting(null);
    }
  }, [quickStarting, createTask, updateTask]);

  const handleSlashSelect = useCallback(async (cmd: SlashCommand) => {
    setShowSlashMenu(false);
    setSlashQuery("");
    setDescription("");
    setIsExpanded(false);

    const taskTitle = cmd.label;
    const taskDesc = `Run ${cmd.command}`;
    await createTask(taskTitle, taskDesc, "task");
    const tasks = useTaskStore.getState().tasks;
    const newTask = tasks.find(
      (t) => t.title === taskTitle && t.status === "backlog"
    );
    if (newTask) {
      await updateTask(newTask.id, { status: "queued" });
    }
  }, [createTask, updateTask]);

  const handleDescChange = useCallback((value: string) => {
    setDescription(value);
    if (value.startsWith("/")) {
      setShowSlashMenu(true);
      setSlashQuery(value);
    } else {
      setShowSlashMenu(false);
      setSlashQuery("");
    }
  }, []);

  const shouldExpand = isExpanded || description.trim().length > 0 || attachments.length > 0;
  const hasGsdConflict = gsdStatus?.exists === true && scopingState.phase === "idle" && levelOverride === "gsd";

  return (
    <div
      ref={formRef}
      style={{
        marginBottom: 16,
        backgroundColor: "#FFFFFF",
        borderRadius: shouldExpand ? "0.5rem" : "0.375rem",
        boxShadow: shouldExpand ? "0px 12px 32px rgba(147, 69, 42, 0.06)" : "none",
        padding: shouldExpand ? 16 : 0,
        outline: shouldExpand ? "none" : "1px solid rgba(218, 193, 185, 0.2)",
        transition: "all 200ms ease",
      }}
    >
      {/* Confirmation badge */}
      {confirmationBadge && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 12px",
          marginBottom: 8,
          backgroundColor: "rgba(107, 142, 107, 0.08)",
          borderRadius: 6,
          fontSize: 12,
          fontWeight: 500,
          fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
          color: "#6B8E6B",
          animation: "fadeIn 200ms ease",
        }}>
          {confirmationBadge}
        </div>
      )}

      {/* Single textarea input + slash command menu */}
      <div style={{ position: "relative" }}>
        <textarea
          ref={descRef}
          value={description}
          onChange={(e) => {
            handleDescChange(e.target.value);
            adjustTextareaHeight();
          }}
          onFocus={() => setIsExpanded(true)}
          onKeyDown={(e) => {
            if (showSlashMenu && ["ArrowDown", "ArrowUp", "Enter", "Tab", "Escape"].includes(e.key)) return;
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
              e.preventDefault();
              handleSubmit();
            }
          }}
          disabled={isSubmitting}
          placeholder="What's your goal?  Type / for commands"
          style={{
            width: "100%",
            padding: shouldExpand ? "0" : "8px 16px",
            fontSize: 15,
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontWeight: 400,
            backgroundColor: "transparent",
            border: "none",
            borderRadius: 6,
            outline: "none",
            color: "#1B1C1B",
            minHeight: shouldExpand ? 44 : 40,
            maxHeight: shouldExpand ? 160 : 40,
            resize: "none",
            lineHeight: "1.5",
            opacity: isSubmitting ? 0.6 : 1,
            transition: "all 150ms ease",
            boxSizing: "border-box" as const,
            overflow: shouldExpand ? "auto" : "hidden",
          }}
        />
        {showSlashMenu && (
          <SlashCommandMenu
            query={slashQuery}
            onSelect={handleSlashSelect}
            onClose={() => { setShowSlashMenu(false); setSlashQuery(""); }}
            anchor="below"
          />
        )}
      </div>

      {/* Quick-start buttons — visible when collapsed */}
      {!shouldExpand && (
        <div style={{ display: "flex", gap: 8, padding: "6px 16px 10px" }}>
          <button
            onClick={() => handleQuickStart("start-here")}
            disabled={quickStarting !== null}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "5px 12px",
              fontSize: 12,
              fontWeight: 500,
              fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
              border: "1px solid rgba(218, 193, 185, 0.3)",
              borderRadius: 6,
              backgroundColor: "transparent",
              color: "#93452A",
              cursor: quickStarting ? "not-allowed" : "pointer",
              opacity: quickStarting === "wrap-up" ? 0.5 : 1,
              transition: "all 150ms ease",
            }}
            onMouseEnter={(e) => { if (!quickStarting) e.currentTarget.style.backgroundColor = "rgba(147, 69, 42, 0.06)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
          >
            <Sunrise size={13} />
            {quickStarting === "start-here" ? "Starting..." : "Start Here"}
          </button>
          <button
            onClick={() => handleQuickStart("wrap-up")}
            disabled={quickStarting !== null}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "5px 12px",
              fontSize: 12,
              fontWeight: 500,
              fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
              border: "1px solid rgba(218, 193, 185, 0.3)",
              borderRadius: 6,
              backgroundColor: "transparent",
              color: "#5E5E65",
              cursor: quickStarting ? "not-allowed" : "pointer",
              opacity: quickStarting === "start-here" ? 0.5 : 1,
              transition: "all 150ms ease",
            }}
            onMouseEnter={(e) => { if (!quickStarting) e.currentTarget.style.backgroundColor = "rgba(94, 94, 101, 0.06)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
          >
            <Moon size={13} />
            {quickStarting === "wrap-up" ? "Wrapping up..." : "Wrap Up"}
          </button>
        </div>
      )}

      {/* Expandable bottom section */}
      <div
        style={{
          maxHeight: shouldExpand ? 800 : 0,
          overflow: shouldExpand ? "visible" : "hidden",
          transition: "max-height 200ms ease",
        }}
      >
        {/* Attachments */}
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

        {attachments.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
              marginTop: 8,
              padding: "8px 0",
              borderTop: "1px solid rgba(218, 193, 185, 0.15)",
            }}
          >
            {attachments.map((att) => {
              const Icon = getAttachmentIcon(att.extension);
              const isImage = IMAGE_EXTS.has(att.extension);
              return (
                <div
                  key={att.relativePath}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "4px 8px",
                    borderRadius: 6,
                    backgroundColor: "#F6F3F1",
                    fontSize: 12,
                    fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                    color: "#1B1C1B",
                  }}
                >
                  {isImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`/api/files/preview?path=${encodeURIComponent(att.relativePath)}`}
                      alt=""
                      style={{ width: 20, height: 20, borderRadius: 3, objectFit: "cover" }}
                    />
                  ) : (
                    <Icon size={14} style={{ color: "#5E5E65" }} />
                  )}
                  <span style={{ maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {att.fileName}
                  </span>
                  <span style={{ fontSize: 10, color: "#9C9CA0" }}>
                    {formatBytes(att.sizeBytes)}
                  </span>
                  <button
                    onClick={() => removeAttachment(att.relativePath)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      display: "flex",
                      color: "#9C9CA0",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#C04030"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "#9C9CA0"; }}
                  >
                    <X size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* GSD conflict warning */}
        {hasGsdConflict && (
          <div style={conflictPanelStyle}>
            <div style={{ ...guidanceHeaderStyle, justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <AlertTriangle size={14} color="#D97706" />
                <span style={{ ...guidanceTitleStyle, color: "#92400E" }}>Active deep build detected</span>
              </div>
              <button
                onClick={() => setGsdStatus(null)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 2,
                  color: "#9C9CA0",
                  display: "flex",
                }}
              >
                <X size={14} />
              </button>
            </div>
            <p style={conflictTextStyle}>
              <strong>{gsdStatus?.projectName}</strong> is currently in progress
              {gsdStatus?.currentPhase && gsdStatus?.totalPhases
                ? ` (phase ${gsdStatus.currentPhase} of ${gsdStatus.totalPhases})`
                : ""
              }.
              Only one deep build can run at a time.
            </p>
            <p style={{ ...conflictTextStyle, marginTop: 6 }}>
              To start a new deep build, first archive the current one. You can do this by asking Claude to run <code style={codeStyle}>/archive-gsd</code>, or complete the remaining phases.
            </p>
          </div>
        )}

        {/* Bottom bar: permission mode + level override + submit button */}
        <div style={{ marginTop: 8 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* Left: permission mode + attach + level override */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {/* Permission mode selector */}
              <div
                style={{
                  display: "flex",
                  gap: 2,
                  backgroundColor: "#EAE8E6",
                  borderRadius: 6,
                  padding: 2,
                  height: 32,
                  alignItems: "center",
                }}
              >
                {permissionModes.map((m) => (
                  <button
                    key={m.value}
                    onClick={() => setPermissionMode(m.value)}
                    title={m.hint}
                    style={{
                      padding: "0 10px",
                      fontSize: 11,
                      fontWeight: 500,
                      fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                      border: "none",
                      cursor: "pointer",
                      borderRadius: 4,
                      height: 28,
                      backgroundColor: permissionMode === m.value
                        ? MODE_BG[m.value]
                        : "transparent",
                      color: permissionMode === m.value
                        ? MODE_TEXT[m.value]
                        : "#9C9CA0",
                      transition: "all 150ms ease",
                    }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Attach file button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                title="Attach file"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 32,
                  height: 32,
                  border: "none",
                  borderRadius: 6,
                  backgroundColor: attachments.length > 0 ? "#FFDBCF" : "transparent",
                  color: attachments.length > 0 ? "#93452A" : "#5E5E65",
                  cursor: isUploading ? "wait" : "pointer",
                  opacity: isUploading ? 0.5 : 1,
                  transition: "all 150ms ease",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  if (!attachments.length) e.currentTarget.style.backgroundColor = "#F6F3F1";
                }}
                onMouseLeave={(e) => {
                  if (!attachments.length) e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <Paperclip size={16} />
                {attachments.length > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: -2,
                      right: -2,
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      backgroundColor: "#93452A",
                      color: "#FFFFFF",
                      fontSize: 9,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                    }}
                  >
                    {attachments.length}
                  </span>
                )}
              </button>

              {/* Level override dropdown */}
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setShowLevelOverride(!showLevelOverride)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "4px 8px",
                    fontSize: 11,
                    fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                    border: "none",
                    borderRadius: 4,
                    backgroundColor: levelOverride ? LEVEL_COLORS[levelOverride].bg : "#F6F3F1",
                    color: levelOverride ? LEVEL_COLORS[levelOverride].text : "#9C9CA0",
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  {levelOverride ? LEVEL_LABELS[levelOverride] : "Level"}
                  <ChevronDown size={10} />
                </button>
                {showLevelOverride && (
                  <div style={{
                    position: "absolute",
                    bottom: "100%",
                    left: 0,
                    marginBottom: 4,
                    backgroundColor: "#FFFFFF",
                    borderRadius: 8,
                    boxShadow: "0 4px 16px rgba(147, 69, 42, 0.12)",
                    border: "1px solid rgba(218, 193, 185, 0.2)",
                    padding: 6,
                    zIndex: 100,
                    width: 260,
                  }}>
                    <div style={{
                      fontSize: 10,
                      color: "#9C9CA0",
                      fontFamily: "var(--font-inter), Inter, sans-serif",
                      padding: "4px 8px 6px",
                    }}>
                      Optional — skip to pick after submit
                    </div>
                    {([
                      { level: "task" as TaskLevel, desc: "One-off deliverable, no planning" },
                      { level: "project" as TaskLevel, desc: "Multi-deliverable with a brief and scope" },
                      { level: "gsd" as TaskLevel, desc: "Phased build with milestones and verification" },
                    ]).map((opt) => (
                      <button
                        key={opt.level}
                        onClick={async () => {
                          const newLevel = levelOverride === opt.level ? null : opt.level;
                          setLevelOverride(newLevel);
                          setShowLevelOverride(false);
                          if (newLevel === "gsd") {
                            try {
                              const res = await fetch("/api/gsd/status");
                              const data = await res.json();
                              if (data?.exists) setGsdStatus(data);
                            } catch { /* ignore */ }
                          } else {
                            setGsdStatus(null);
                          }
                        }}
                        style={{
                          display: "block",
                          width: "100%",
                          padding: "8px 10px",
                          fontSize: 12,
                          fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                          border: "none",
                          borderRadius: 5,
                          backgroundColor: levelOverride === opt.level ? LEVEL_COLORS[opt.level].bg : "transparent",
                          color: LEVEL_COLORS[opt.level].text,
                          cursor: "pointer",
                          textAlign: "left",
                          fontWeight: 500,
                        }}
                      >
                        <div>{LEVEL_LABELS[opt.level]}</div>
                        <div style={{
                          fontSize: 10,
                          fontWeight: 400,
                          color: "#9C9CA0",
                          fontFamily: "var(--font-inter), Inter, sans-serif",
                          marginTop: 1,
                        }}>
                          {opt.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={!description.trim() || isSubmitting}
              style={{
                background: description.trim()
                  ? "linear-gradient(135deg, #93452A, #B25D3F)"
                  : "#D1C7C2",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "0.375rem",
                padding: "6px 16px",
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                cursor: description.trim() ? "pointer" : "default",
                opacity: isSubmitting ? 0.6 : 1,
                transition: "all 150ms ease",
              }}
            >
              Send to Claude
            </button>
          </div>

          {/* Permission mode hint */}
          <div
            style={{
              display: "flex",
              gap: 16,
              fontSize: 11,
              fontFamily: "var(--font-inter), Inter, sans-serif",
              color: "#9C9CA0",
              marginTop: 6,
              paddingLeft: 2,
              minHeight: 16,
            }}
          >
            <span />
            <span style={{ color: MODE_TEXT[permissionMode] }}>
              {permissionModes.find((m) => m.value === permissionMode)?.hint}
            </span>
          </div>
        </div>
      </div>

      {/* Level picker modal */}
      {scopingState.phase === "picking" && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => {
            setScopingState({ phase: "idle" });
            setPickedLevel(null);
            setNotes("");
          }}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 12,
              padding: 24,
              maxWidth: 420,
              width: "90%",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                fontSize: 16,
                fontWeight: 700,
                fontFamily: "var(--font-space-grotesk)",
                color: "#1B1C1B",
                marginBottom: 16,
                marginTop: 0,
              }}
            >
              How structured do you want this?
            </h3>

            {/* Goal preview */}
            <div
              style={{
                fontSize: 12,
                color: "#5E5E65",
                fontFamily: "var(--font-inter)",
                padding: "8px 12px",
                backgroundColor: "rgba(218, 193, 185, 0.08)",
                borderRadius: 6,
                marginBottom: 16,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {scopingState.description.slice(0, 100)}
              {scopingState.description.length > 100 ? "..." : ""}
            </div>

            {/* Three level options */}
            {([
              {
                level: "task" as TaskLevel,
                icon: Zap,
                title: "Single task",
                desc: "I'll just get it done. Best for one-off deliverables.",
                key: "1",
              },
              {
                level: "project" as TaskLevel,
                icon: ClipboardList,
                title: "Planned project",
                desc: "I'll scope it first — goal, deliverables, what 'done' looks like. Best for multi-deliverable work.",
                key: "2",
              },
              {
                level: "gsd" as TaskLevel,
                icon: Layers,
                title: "GSD project",
                desc: "Full structured planning with phases, milestones, and verification. Best for complex builds.",
                key: "3",
              },
            ]).map((opt) => (
              <div key={opt.level}>
                <button
                  onClick={() => {
                    setPickedLevel(opt.level);
                    setTimeout(() => notesRef.current?.focus(), 50);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    width: "100%",
                    padding: "12px 14px",
                    border: pickedLevel === opt.level
                      ? "1px solid rgba(147, 69, 42, 0.4)"
                      : "1px solid rgba(218, 193, 185, 0.2)",
                    borderRadius: 8,
                    marginBottom: pickedLevel === opt.level ? 0 : 8,
                    backgroundColor: pickedLevel === opt.level
                      ? "rgba(147, 69, 42, 0.04)"
                      : "transparent",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 100ms ease",
                  }}
                  onMouseEnter={(e) => {
                    if (pickedLevel !== opt.level) {
                      e.currentTarget.style.backgroundColor = "rgba(147, 69, 42, 0.04)";
                      e.currentTarget.style.borderColor = "rgba(147, 69, 42, 0.3)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (pickedLevel !== opt.level) {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.borderColor = "rgba(218, 193, 185, 0.2)";
                    }
                  }}
                >
                  <opt.icon size={18} color="#93452A" style={{ flexShrink: 0, marginTop: 1 }} />
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        fontFamily: "var(--font-space-grotesk)",
                        color: "#1B1C1B",
                      }}
                    >
                      {opt.title}
                      <span style={{ fontSize: 10, color: "#B0B0B5", marginLeft: 6 }}>
                        ({opt.key})
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#9C9CA0",
                        fontFamily: "var(--font-inter)",
                        marginTop: 2,
                        lineHeight: "1.4",
                      }}
                    >
                      {opt.desc}
                    </div>
                  </div>
                </button>

                {/* Notes area — shown when this level is selected */}
                {pickedLevel === opt.level && (
                  <div
                    style={{
                      padding: "10px 14px 14px",
                      marginBottom: 8,
                      borderLeft: "1px solid rgba(147, 69, 42, 0.2)",
                      borderRight: "1px solid rgba(147, 69, 42, 0.2)",
                      borderBottom: "1px solid rgba(147, 69, 42, 0.2)",
                      borderRadius: "0 0 8px 8px",
                      backgroundColor: "rgba(147, 69, 42, 0.02)",
                    }}
                  >
                    <textarea
                      ref={notesRef}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add notes or context (optional)"
                      style={{
                        width: "100%",
                        fontSize: 12,
                        fontFamily: "var(--font-inter)",
                        border: "1px solid rgba(218, 193, 185, 0.3)",
                        borderRadius: 6,
                        padding: "8px 10px",
                        minHeight: 60,
                        maxHeight: 120,
                        resize: "vertical",
                        outline: "none",
                        backgroundColor: "#FAFAF9",
                        boxSizing: "border-box",
                      }}
                      onKeyDown={(e) => {
                        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                          e.preventDefault();
                          handleLevelSelect(opt.level);
                        }
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginTop: 8,
                        gap: 8,
                      }}
                    >
                      <button
                        onClick={() => {
                          setPickedLevel(null);
                          setNotes("");
                        }}
                        style={{
                          fontSize: 12,
                          color: "#9C9CA0",
                          fontFamily: "var(--font-space-grotesk)",
                          background: "none",
                          border: "1px solid rgba(218, 193, 185, 0.3)",
                          borderRadius: 6,
                          padding: "6px 12px",
                          cursor: "pointer",
                        }}
                      >
                        Back
                      </button>
                      <button
                        onClick={() => handleLevelSelect(opt.level)}
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          fontFamily: "var(--font-space-grotesk)",
                          color: "#FFFFFF",
                          background: "linear-gradient(135deg, #93452A, #B25D3F)",
                          border: "none",
                          borderRadius: 6,
                          padding: "6px 16px",
                          cursor: "pointer",
                          transition: "opacity 150ms ease",
                        }}
                      >
                        Go
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <button
              onClick={() => {
                setScopingState({ phase: "idle" });
                setPickedLevel(null);
                setNotes("");
              }}
              style={{
                fontSize: 12,
                color: "#9C9CA0",
                fontFamily: "var(--font-space-grotesk)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px 0 0",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Styles ──

const conflictPanelStyle: React.CSSProperties = {
  marginTop: 10,
  padding: "12px 14px",
  backgroundColor: "#FFFBEB",
  borderRadius: 8,
  border: "1px solid rgba(217, 119, 6, 0.2)",
};

const guidanceHeaderStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  marginBottom: 10,
};

const guidanceTitleStyle: React.CSSProperties = {
  fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
  fontSize: 12,
  fontWeight: 600,
  color: "#93452A",
};

const conflictTextStyle: React.CSSProperties = {
  fontFamily: "var(--font-inter), Inter, sans-serif",
  fontSize: 12,
  color: "#78350F",
  lineHeight: 1.5,
  margin: 0,
};

const codeStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono, monospace)",
  fontSize: 11,
  backgroundColor: "rgba(217, 119, 6, 0.1)",
  padding: "1px 5px",
  borderRadius: 3,
};
