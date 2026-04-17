"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { ArrowUp, Paperclip, X, Image, FileType, FileText } from "lucide-react";
import type { LogEntry, PermissionMode, ClaudeModel, Todo } from "@/types/task";
import { useTaskStore } from "@/store/task-store";
import { SlashCommandMenu } from "@/components/shared/slash-command-menu";
import type { TagItem } from "@/components/shared/slash-command-menu";
import { PermissionPicker } from "@/components/shared/permission-picker";
import { ModelPicker } from "@/components/shared/model-picker";
import { TasksPopover, type SubtaskSummary } from "@/components/shared/tasks-popover";
import { parseTodosFromInput } from "@/lib/claude-parser";
import {
  getExecutionPermissionMode,
  getPermissionStateForPickerChange,
  getPickerPermissionMode,
  normalizePermissionMode,
} from "@/lib/permission-mode";
import type { SlashCommand } from "@/lib/slash-commands";
import { recordTagUsage } from "@/components/board/goal-chips";

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

/** Renders a highlight mirror behind a transparent textarea so @tags and
 *  /commands appear colored while the user types normally. */
export function HighlightMirror({ text, style }: { text: string; style: React.CSSProperties }) {
  // Split text into segments: @tag, /command, or plain text
  const parts: { text: string; kind: "tag" | "command" | "plain" }[] = [];
  const re = /((?:^|\s)(@[\w\/-]+))|((?:^|\s)(\/[\w:.-]+))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    const fullMatch = match[0];
    const start = match.index;
    if (start > lastIndex) {
      parts.push({ text: text.slice(lastIndex, start), kind: "plain" });
    }
    if (match[2]) {
      // Leading whitespace stays plain
      const leading = fullMatch.slice(0, fullMatch.indexOf("@"));
      if (leading) parts.push({ text: leading, kind: "plain" });
      parts.push({ text: match[2], kind: "tag" });
    } else if (match[4]) {
      const leading = fullMatch.slice(0, fullMatch.indexOf("/"));
      if (leading) parts.push({ text: leading, kind: "plain" });
      parts.push({ text: match[4], kind: "command" });
    }
    lastIndex = start + fullMatch.length;
  }
  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), kind: "plain" });
  }

  return (
    <div
      aria-hidden
      style={{
        ...style,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        pointerEvents: "none",
        whiteSpace: "pre-wrap",
        wordWrap: "break-word",
        color: "#1B1C1B",
      }}
    >
      {parts.map((p, i) =>
        p.kind === "tag" ? (
          <span key={i} style={{ color: "#93452A" }}>{p.text}</span>
        ) : p.kind === "command" ? (
          <span key={i} style={{ color: "#6D28D9" }}>{p.text}</span>
        ) : (
          <span key={i}>{p.text}</span>
        )
      )}
      {/* Trailing space to match textarea line height */}
      {"\u200B"}
    </div>
  );
}

interface ReplyInputProps {
  taskId: string;
  isVisible: boolean;
  needsInput?: boolean;
  taskStatus?: string;
  onOptimisticReply?: (entry: LogEntry) => void;
  /** Initial permission mode (sourced from the task row). */
  initialPermissionMode?: PermissionMode;
  /** Execution mode staged while the task is in plan mode. */
  initialExecutionPermissionMode?: PermissionMode | null;
  /** Initial model selection (sourced from the task row). */
  initialModel?: ClaudeModel | null;
  /** Real child subtasks for the Subtasks popover. */
  subtasks?: SubtaskSummary[];
  /** Click handler for a subtask row. */
  onSelectSubtask?: (id: string) => void;
  /** Execute a subtask — POST /api/tasks/:id/execute */
  onRunSubtask?: (id: string) => void;
  /** Execute a subtask in a new chat pane */
  onRunSubtaskInNewChat?: (id: string, title: string) => void;
  /** Execute all backlog subtasks */
  onRunAll?: () => void;
  /** Mark a subtask as done */
  onMarkDone?: (id: string) => void;
  /** Available chat panes for "Add to existing chat" picker */
  availablePanes?: Array<{ id: string; label: string; isMain?: boolean }>;
  /** Run a subtask in a specific existing pane */
  onRunSubtaskInPane?: (subtaskId: string, paneId: string) => void;
  /** When set, the first message creates a new pane task instead of replying.
   *  Returns the new task ID on success, null on failure. */
  onCreatePaneTask?: (message: string, permissionMode: string, model: ClaudeModel | null) => Promise<string | null>;
  /** Compact mode — shrink toolbar elements (for multi-pane layouts) */
  compact?: boolean;
  /** Project slug — used to pin the relevant brief at the top of the @ menu */
  projectSlug?: string | null;
  /** Hide the tasks/todos popover (e.g. for single tasks without a plan) */
  hideTasksPopover?: boolean;
}

export function ReplyInput({
  taskId,
  isVisible,
  needsInput,
  taskStatus,
  onOptimisticReply,
  initialPermissionMode = "bypassPermissions",
  initialExecutionPermissionMode = null,
  initialModel = null,
  subtasks,
  onSelectSubtask,
  onRunSubtask,
  onRunSubtaskInNewChat,
  onRunAll,
  onMarkDone,
  availablePanes,
  onRunSubtaskInPane,
  onCreatePaneTask,
  compact,
  projectSlug,
  hideTasksPopover,
}: ReplyInputProps) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashQuery, setSlashQuery] = useState("");
  const [showTagMenu, setShowTagMenu] = useState(false);
  const [tagQuery, setTagQuery] = useState("");
  const [promptTags, setPromptTags] = useState<TagItem[]>([]);
  const [activePermissionMode, setActivePermissionMode] = useState<PermissionMode>(
    normalizePermissionMode(initialPermissionMode, "bypassPermissions"),
  );
  const [executionPermissionMode, setExecutionPermissionMode] = useState<PermissionMode>(
    getExecutionPermissionMode(
      initialExecutionPermissionMode ?? initialPermissionMode,
      "bypassPermissions",
    ),
  );
  const [model, setModel] = useState<ClaudeModel | null>(initialModel);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createTask = useTaskStore((s) => s.createTask);
  const updateTask = useTaskStore((s) => s.updateTask);
  const logEntries = useTaskStore((s) => s.logEntries[taskId]) ?? [];

  const permissionMode = useMemo(
    () => getPickerPermissionMode(activePermissionMode, executionPermissionMode, taskStatus),
    [activePermissionMode, executionPermissionMode, taskStatus],
  );

  // Fetch prompt tags on mount
  useEffect(() => {
    fetch("/api/prompt-tags")
      .then((r) => r.json())
      .then((data) => setPromptTags((data.tags ?? []).map((t: { name: string; body: string; category?: string; description?: string }) => ({ name: t.name, body: t.body, category: t.category, description: t.description }))))
      .catch(() => {});
  }, []);

  // Re-sync when switching tasks
  useEffect(() => {
    setActivePermissionMode(normalizePermissionMode(initialPermissionMode, "bypassPermissions"));
    setExecutionPermissionMode(
      getExecutionPermissionMode(
        initialExecutionPermissionMode ?? initialPermissionMode,
        "bypassPermissions",
      ),
    );
    setModel(initialModel);
  }, [taskId, initialPermissionMode, initialExecutionPermissionMode, initialModel]);

  const latestTodos: Todo[] = useMemo(() => {
    for (let i = logEntries.length - 1; i >= 0; i--) {
      const entry = logEntries[i];
      if (entry.type === "tool_use" && entry.toolName === "TodoWrite" && entry.toolArgs) {
        try {
          const parsed = parseTodosFromInput(JSON.parse(entry.toolArgs));
          if (parsed) return parsed;
        } catch {
          // ignore
        }
      }
    }
    return [];
  }, [logEntries]);

  const handleFileUpload = useCallback(async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("dir", ".tmp/attachments");
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

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) handleFileUpload(file);
        return;
      }
    }
    // Large text paste — collapse into a placeholder, expand on submit
    const text = e.clipboardData?.getData("text/plain") ?? "";
    const lineCount = text.split("\n").length;
    if (lineCount > 10) {
      e.preventDefault();
      const label = `[Pasted text +${lineCount} lines]`;
      const ta = textareaRef.current;
      if (ta) {
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const before = message.slice(0, start);
        const after = message.slice(end);
        const pastedBlocks = (ta.dataset.pastedBlocks ? JSON.parse(ta.dataset.pastedBlocks) : []) as Array<{ label: string; text: string }>;
        pastedBlocks.push({ label, text });
        ta.dataset.pastedBlocks = JSON.stringify(pastedBlocks);
        setMessage(before + label + after);
      }
    }
  }, [handleFileUpload, message]);

  const handlePermissionModeChange = useCallback((nextMode: "bypassPermissions" | "default" | "plan") => {
    const nextState = getPermissionStateForPickerChange(
      nextMode,
      activePermissionMode,
      executionPermissionMode,
      "bypassPermissions",
    );
    setActivePermissionMode(nextState.permissionMode);
    setExecutionPermissionMode(nextState.executionPermissionMode);
    if (!onCreatePaneTask) {
      void updateTask(taskId, nextState);
    }
  }, [activePermissionMode, executionPermissionMode, onCreatePaneTask, taskId, updateTask]);

  const handleModelChange = useCallback((nextModel: ClaudeModel | null) => {
    setModel(nextModel);
    if (!onCreatePaneTask) {
      void updateTask(taskId, { model: nextModel });
    }
  }, [onCreatePaneTask, taskId, updateTask]);

  const handleSubmit = useCallback(async () => {
    const trimmed = message.trim();
    if (!trimmed && attachments.length === 0) return;
    if (isSending) return;

    // Expand collapsed pasted text blocks back to full content
    let expanded = trimmed;
    if (textareaRef.current?.dataset.pastedBlocks) {
      try {
        const blocks = JSON.parse(textareaRef.current.dataset.pastedBlocks) as Array<{ label: string; text: string }>;
        for (const block of blocks) {
          expanded = expanded.replace(block.label, block.text);
        }
      } catch { /* ignore */ }
      textareaRef.current.dataset.pastedBlocks = "";
    }

    // Build final message with attachment paths
    let finalMessage = expanded;
    if (attachments.length > 0) {
      const attachmentLines = attachments.map((a) => `- ${a.relativePath}`).join("\n");
      finalMessage = finalMessage
        ? `${finalMessage}\n\nAttached files:\n${attachmentLines}`
        : `Attached files:\n${attachmentLines}`;
    }

    setIsSending(true);

    // If this is an empty pane, create a new task instead of replying
    if (onCreatePaneTask) {
      setMessage("");
      setAttachments([]);
      try {
        await onCreatePaneTask(
          finalMessage,
          activePermissionMode === "plan" ? "plan" : permissionMode,
          model,
        );
      } catch {
        setError("Failed to start conversation");
        setTimeout(() => setError(null), 3000);
      } finally {
        setIsSending(false);
      }
      return;
    }

    // Optimistic: add user_reply entry locally
    if (onOptimisticReply) {
      const entry: LogEntry = {
        id: "local-" + crypto.randomUUID(),
        type: "user_reply",
        timestamp: new Date().toISOString(),
        content: finalMessage,
        permissionMode: activePermissionMode === "plan" ? "plan" : permissionMode,
      };
      onOptimisticReply(entry);
    }

    // Optimistic: mark task as running (clears needsInput so card lights up purple)
    useTaskStore.getState().setTaskFields(taskId, {
      status: "running",
      needsInput: false,
      activityLabel: null,
      lastReplyAt: new Date().toISOString(),
    });

    setMessage("");
    setAttachments([]);

    try {
      const res = await fetch(`/api/tasks/${taskId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: finalMessage,
          permissionMode: activePermissionMode === "plan" ? "plan" : permissionMode,
          executionPermissionMode,
          model,
        }),
      });
      if (!res.ok) {
        console.error(`[reply-input] Reply failed: ${res.status}`);
        setError("Reply failed — try again");
        setTimeout(() => setError(null), 3000);
      }
    } catch {
      setError("Reply failed — try again");
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsSending(false);
    }
  }, [
    message,
    attachments,
    isSending,
    taskId,
    onOptimisticReply,
    onCreatePaneTask,
    activePermissionMode,
    permissionMode,
    executionPermissionMode,
    model,
  ]);

  const handleSlashSelect = useCallback(async (cmd: SlashCommand) => {
    setShowSlashMenu(false);
    setSlashQuery("");
    setMessage("");

    // Create a new task from the slash command and auto-queue it
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

  const handleChange = useCallback((value: string) => {
    setMessage(value);
    if (value.startsWith("/")) {
      setShowSlashMenu(true);
      setSlashQuery(value);
      setShowTagMenu(false);
    } else {
      setShowSlashMenu(false);
      setSlashQuery("");
    }
    // Detect @tag trigger
    const el = textareaRef.current;
    if (el && !value.startsWith("/")) {
      const cursor = el.selectionStart ?? value.length;
      const before = value.slice(0, cursor);
      const match = before.match(/(^|[\s])@([\w\/-]*)$/);
      if (match) {
        setShowTagMenu(true);
        setTagQuery(match[2]);
        setShowSlashMenu(false);
      } else {
        setShowTagMenu(false);
        setTagQuery("");
      }
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((showSlashMenu || showTagMenu) && ["ArrowDown", "ArrowUp", "Enter", "Tab", "Escape"].includes(e.key)) return;
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit, showSlashMenu, showTagMenu]
  );

  if (!isVisible) return null;

  const placeholder = needsInput
    ? "Reply to Claude...  Type / for commands or skills, @ for tags"
    : taskStatus === "review" || taskStatus === "done"
      ? "Send a follow-up or type / for commands or skills..."
      : "Send a message...  Type / for commands or skills, @ for tags";

  return (
    <div
      style={{
        padding: compact ? "6px 12px 8px 12px" : "12px 24px 16px 24px",
        borderTop: "1px solid #EAE8E6",
      }}
    >
      {error && (
        <div style={{ fontSize: 12, color: "#C04030", marginBottom: 6, fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif" }}>
          {error}
        </div>
      )}
      <div
        style={{
          background: "#f3f0ee",
          border: "1px solid #e5e1dc",
          borderRadius: 10,
          overflow: "visible",
          position: "relative",
        }}
      >
        <div style={{ position: "relative", padding: compact ? "6px 10px 4px" : "12px 14px 8px" }}>
          {showSlashMenu && (
            <SlashCommandMenu
              query={slashQuery}
              onSelect={handleSlashSelect}
              onClose={() => { setShowSlashMenu(false); setSlashQuery(""); }}
              anchor="above"
            />
          )}
          {showTagMenu && promptTags.length > 0 && (
            <SlashCommandMenu
              query={tagQuery}
              onSelect={() => {}}
              onClose={() => { setShowTagMenu(false); setTagQuery(""); }}
              anchor="above"
              mode="tag"
              tagItems={promptTags
                .filter((t) => !tagQuery || t.name.toLowerCase().includes(tagQuery.toLowerCase()))
                .sort((a, b) => {
                  // Pin the current project's brief to the top
                  if (projectSlug) {
                    const aIsBrief = a.name === `brief/${projectSlug}`;
                    const bIsBrief = b.name === `brief/${projectSlug}`;
                    if (aIsBrief && !bIsBrief) return -1;
                    if (!aIsBrief && bIsBrief) return 1;
                  }
                  return 0;
                })}
              onTagSelect={(tag) => {
                const el = textareaRef.current;
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
                textareaRef.current?.focus();
              }}
            />
          )}
          {/* Inner wrapper — position:relative so the highlight mirror
              aligns exactly with the textarea (not offset by parent padding). */}
          <div style={{ position: "relative" }}>
            {(message.includes("@") || message.includes("/")) && (
              <HighlightMirror
                text={message}
                style={{
                  fontSize: 14,
                  fontFamily: "var(--font-inter), Inter, sans-serif",
                  padding: "4px 0",
                  lineHeight: 1.5,
                }}
              />
            )}
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => handleChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              placeholder={placeholder}
              rows={compact ? 1 : 3}
              style={{
                width: "100%",
                fontSize: compact ? 13 : 14,
                fontFamily: "var(--font-inter), Inter, sans-serif",
                padding: compact ? "2px 0" : "4px 0",
                minHeight: compact ? 28 : 60,
                backgroundColor: "transparent",
                outline: "none",
                border: "none",
                resize: "none",
                lineHeight: 1.5,
                color: (message.includes("@") || message.includes("/")) ? "transparent" : "#1B1C1B",
                caretColor: "#1B1C1B",
                position: "relative",
                zIndex: 1,
              }}
            />
          </div>
        </div>
        {/* Attachment chips */}
        {attachments.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", padding: compact ? "4px 8px" : "4px 14px 6px" }}>
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
                    fontFamily: "'DM Mono', monospace",
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

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            padding: compact ? "4px 6px" : "6px 8px",
            borderTop: "1px solid #e5e1dc",
          }}
        >
          {/* Attach file */}
          <button
            type="button"
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
          <ModelPicker value={model} onChange={handleModelChange} />
          <PermissionPicker value={permissionMode} onChange={handlePermissionModeChange} />
          {!hideTasksPopover && (
          <TasksPopover
            todos={latestTodos}
            subtasks={subtasks}
            onSelectSubtask={onSelectSubtask}
            onRunSubtask={onRunSubtask}
            onRunSubtaskInNewChat={onRunSubtaskInNewChat}
            onRunAll={onRunAll}
            onMarkDone={onMarkDone}
            availablePanes={availablePanes}
            onRunSubtaskInPane={onRunSubtaskInPane}
            compact={compact}
          />
          )}
          <div style={{ flex: 1 }} />
          <button
            type="button"
            onClick={handleSubmit}
            disabled={(!message.trim() && attachments.length === 0) || isSending}
            style={{
              width: 28,
              height: 26,
              borderRadius: 6,
              border: "none",
              background:
                (message.trim() || attachments.length > 0) && !isSending
                  ? "linear-gradient(135deg, #93452A, #B25D3F)"
                  : "#e8e4df",
              color: (message.trim() || attachments.length > 0) && !isSending ? "#FFFFFF" : "#5E5E65",
              cursor: (message.trim() || attachments.length > 0) && !isSending ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 150ms ease",
            }}
          >
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
