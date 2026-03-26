"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Paperclip, X, Image, FileType, FileText, Sunrise, Moon } from "lucide-react";
import type { TaskLevel } from "@/types/task";
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

import { LEVEL_LABELS, LEVEL_HINTS } from "@/types/task";

const levels: { value: TaskLevel; label: string; hint: string }[] = [
  { value: "task", label: LEVEL_LABELS.task, hint: LEVEL_HINTS.task },
  { value: "project", label: LEVEL_LABELS.project, hint: LEVEL_HINTS.project },
  { value: "gsd", label: LEVEL_LABELS.gsd, hint: LEVEL_HINTS.gsd },
];

export function TaskCreateInput() {
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState<TaskLevel>("task");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Attachments state
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        attachments.length === 0
      ) {
        setIsExpanded(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [description, attachments.length]);

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
      // Auto-expand if not already
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

  const handleSubmit = useCallback(async () => {
    const trimmedDesc = description.trim();
    if (!trimmedDesc || isSubmitting) return;
    setIsSubmitting(true);

    // Build description with attachment paths
    let fullDescription = trimmedDesc;
    if (attachments.length > 0) {
      const attachmentLines = attachments.map((a) => `- ${a.relativePath}`).join("\n");
      const attachmentBlock = `\n\nAttached files:\n${attachmentLines}`;
      fullDescription = fullDescription + attachmentBlock;
    }

    // Quick fallback title from first line
    const firstLine = fullDescription.split("\n")[0];
    const firstSentence = firstLine.match(/^[^.!?]+[.!?]?/)?.[0] || firstLine;
    const fallbackTitle = firstSentence.length <= 60
      ? firstSentence
      : firstSentence.slice(0, 57).replace(/\s+\S*$/, "") + "...";

    // Clear form immediately
    setDescription("");
    setAttachments([]);
    setIsExpanded(false);

    // Create with fallback title right away
    await createTask(fallbackTitle, fullDescription, level, null);

    // AI title generation in the background
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
          if (created) {
            updateTask(created.id, { title: data.title });
          }
        }
      })
      .catch(() => { /* fallback title is fine */ });

    setIsSubmitting(false);
  }, [description, attachments, level, isSubmitting, createTask, updateTask]);

  const handleQuickStart = useCallback(async (type: "start-here" | "wrap-up") => {
    if (quickStarting) return;
    setQuickStarting(type);
    try {
      const taskTitle = type === "start-here" ? "Start Here" : "Wrap Up";
      const taskDesc = type === "start-here"
        ? "Run /start-here"
        : "Run /wrap-up";
      await createTask(taskTitle, taskDesc, "task");
      // Find the just-created task and queue it
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

    // Create task and auto-queue it
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

  return (
    <div
      ref={formRef}
      style={{
        marginBottom: 16,
        backgroundColor: "#FFFFFF",
        borderRadius: shouldExpand ? "0.5rem" : "0.375rem",
        boxShadow: shouldExpand
          ? "0px 12px 32px rgba(147, 69, 42, 0.06)"
          : "none",
        padding: shouldExpand ? 16 : 0,
        outline: shouldExpand
          ? "none"
          : "1px solid rgba(218, 193, 185, 0.2)",
        transition: "all 200ms ease",
      }}
    >
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
          placeholder="What would you like Claude to do?  Type / for commands"
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
        <div
          style={{
            display: "flex",
            gap: 8,
            padding: "6px 16px 10px",
          }}
        >
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
          maxHeight: shouldExpand ? 600 : 0,
          overflow: "hidden",
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

        {/* Bottom bar: level chips + hint + submit button */}
        <div style={{ marginTop: 8 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* Level selector chips + attach button */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
                {levels.map((l) => (
                  <button
                    key={l.value}
                    onClick={() => setLevel(l.value)}
                    title={l.hint}
                    style={{
                      padding: "0 14px",
                      fontSize: 12,
                      fontWeight: 500,
                      fontFamily:
                        "var(--font-space-grotesk), Space Grotesk, sans-serif",
                      border: "none",
                      cursor: "pointer",
                      borderRadius: 4,
                      height: 28,
                      backgroundColor:
                        level === l.value ? "#FFDBCF" : "transparent",
                      color: level === l.value ? "#390C00" : "#5E5E65",
                      transition: "all 150ms ease",
                    }}
                  >
                    {l.label}
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
              fontFamily:
                "var(--font-space-grotesk), Space Grotesk, sans-serif",
              cursor: description.trim() ? "pointer" : "default",
              opacity: isSubmitting ? 0.6 : 1,
              transition: "all 150ms ease",
            }}
          >
            Send to Claude
          </button>
          </div>

          {/* Active level hint */}
          <div
            style={{
              fontSize: 11,
              fontFamily: "var(--font-inter), Inter, sans-serif",
              color: "#9C9CA0",
              marginTop: 6,
              paddingLeft: 2,
              minHeight: 16,
            }}
          >
            {levels.find((l) => l.value === level)?.hint}
          </div>
        </div>
      </div>
    </div>
  );
}
