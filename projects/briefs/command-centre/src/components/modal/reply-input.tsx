"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { ArrowUp } from "lucide-react";
import type { LogEntry, PermissionMode, ClaudeModel, Todo } from "@/types/task";
import { useTaskStore } from "@/store/task-store";
import { SlashCommandMenu } from "@/components/shared/slash-command-menu";
import type { TagItem } from "@/components/shared/slash-command-menu";
import { PermissionPicker } from "@/components/shared/permission-picker";
import { ModelPicker } from "@/components/shared/model-picker";
import { TasksPopover, type SubtaskSummary } from "@/components/shared/tasks-popover";
import { parseTodosFromInput } from "@/lib/claude-parser";
import type { SlashCommand } from "@/lib/slash-commands";
import { recordTagUsage } from "@/components/board/goal-chips";

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
  /** Initial model selection (sourced from the task row). */
  initialModel?: ClaudeModel | null;
  /** Real child subtasks for the Subtasks popover. */
  subtasks?: SubtaskSummary[];
  /** Click handler for a subtask row. */
  onSelectSubtask?: (id: string) => void;
}

export function ReplyInput({
  taskId,
  isVisible,
  needsInput,
  taskStatus,
  onOptimisticReply,
  initialPermissionMode = "bypassPermissions",
  initialModel = null,
  subtasks,
  onSelectSubtask,
}: ReplyInputProps) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashQuery, setSlashQuery] = useState("");
  const [showTagMenu, setShowTagMenu] = useState(false);
  const [tagQuery, setTagQuery] = useState("");
  const [promptTags, setPromptTags] = useState<TagItem[]>([]);
  const [permissionMode, setPermissionMode] = useState<PermissionMode>(initialPermissionMode);
  const [model, setModel] = useState<ClaudeModel | null>(initialModel);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const createTask = useTaskStore((s) => s.createTask);
  const updateTask = useTaskStore((s) => s.updateTask);
  const logEntries = useTaskStore((s) => s.logEntries[taskId]) ?? [];

  // Fetch prompt tags on mount
  useEffect(() => {
    fetch("/api/prompt-tags")
      .then((r) => r.json())
      .then((data) => setPromptTags((data.tags ?? []).map((t: { name: string; body: string; category?: string; description?: string }) => ({ name: t.name, body: t.body, category: t.category, description: t.description }))))
      .catch(() => {});
  }, []);

  // Re-sync when switching tasks
  useEffect(() => {
    setPermissionMode(initialPermissionMode);
    setModel(initialModel);
  }, [taskId, initialPermissionMode, initialModel]);

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

  const handleSubmit = useCallback(async () => {
    const trimmed = message.trim();
    if (!trimmed || isSending) return;

    setIsSending(true);

    // Optimistic: add user_reply entry locally
    if (onOptimisticReply) {
      const entry: LogEntry = {
        id: "local-" + crypto.randomUUID(),
        type: "user_reply",
        timestamp: new Date().toISOString(),
        content: trimmed,
      };
      onOptimisticReply(entry);
    }

    setMessage("");

    try {
      const res = await fetch(`/api/tasks/${taskId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, permissionMode, model }),
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
  }, [message, isSending, taskId, onOptimisticReply, permissionMode, model]);

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
        padding: "12px 24px 16px 24px",
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
        <div style={{ position: "relative", padding: "10px 12px 6px" }}>
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
              tagItems={promptTags.filter((t) => !tagQuery || t.name.toLowerCase().includes(tagQuery.toLowerCase()))}
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
              placeholder={placeholder}
              rows={1}
              style={{
                width: "100%",
                fontSize: 14,
                fontFamily: "var(--font-inter), Inter, sans-serif",
                padding: "4px 0",
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            padding: "6px 8px",
            borderTop: "1px solid #e5e1dc",
          }}
        >
          <ModelPicker value={model} onChange={setModel} />
          <PermissionPicker value={permissionMode} onChange={setPermissionMode} />
          <TasksPopover
            todos={latestTodos}
            subtasks={subtasks}
            onSelectSubtask={onSelectSubtask}
          />
          <div style={{ flex: 1 }} />
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!message.trim() || isSending}
            style={{
              width: 28,
              height: 26,
              borderRadius: 6,
              border: "none",
              background:
                message.trim() && !isSending
                  ? "linear-gradient(135deg, #93452A, #B25D3F)"
                  : "#e8e4df",
              color: message.trim() && !isSending ? "#FFFFFF" : "#5E5E65",
              cursor: message.trim() && !isSending ? "pointer" : "default",
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
