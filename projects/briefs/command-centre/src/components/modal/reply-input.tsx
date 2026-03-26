"use client";

import { useState, useRef, useCallback } from "react";
import { ArrowUp } from "lucide-react";
import type { LogEntry } from "@/types/task";
import { useTaskStore } from "@/store/task-store";
import { SlashCommandMenu } from "@/components/shared/slash-command-menu";
import type { SlashCommand } from "@/lib/slash-commands";

interface ReplyInputProps {
  taskId: string;
  isVisible: boolean;
  needsInput?: boolean;
  taskStatus?: string;
  onOptimisticReply?: (entry: LogEntry) => void;
}

export function ReplyInput({ taskId, isVisible, needsInput, taskStatus, onOptimisticReply }: ReplyInputProps) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashQuery, setSlashQuery] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const createTask = useTaskStore((s) => s.createTask);
  const updateTask = useTaskStore((s) => s.updateTask);

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
        body: JSON.stringify({ message: trimmed }),
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
  }, [message, isSending, taskId, onOptimisticReply]);

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
    } else {
      setShowSlashMenu(false);
      setSlashQuery("");
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Let slash menu handle its own keys
      if (showSlashMenu && ["ArrowDown", "ArrowUp", "Enter", "Tab", "Escape"].includes(e.key)) return;
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit, showSlashMenu]
  );

  if (!isVisible) return null;

  const placeholder = needsInput
    ? "Reply to Claude...  Type / for commands"
    : taskStatus === "review" || taskStatus === "done"
      ? "Send a follow-up or type / for commands..."
      : "Send a message...  Type / for commands";

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
      <div style={{ position: "relative" }}>
        {showSlashMenu && (
          <SlashCommandMenu
            query={slashQuery}
            onSelect={handleSlashSelect}
            onClose={() => { setShowSlashMenu(false); setSlashQuery(""); }}
            anchor="above"
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
            padding: "12px 48px 12px 16px",
            backgroundColor: "#FFFFFF",
            outline: "1px solid rgba(218, 193, 185, 0.3)",
            borderRadius: "0.5rem",
            border: "none",
            resize: "none",
            lineHeight: 1.5,
            color: "#1B1C1B",
          }}
          onFocus={(e) => {
            (e.target as HTMLTextAreaElement).style.outlineColor = "#93452A";
          }}
          onBlur={(e) => {
            (e.target as HTMLTextAreaElement).style.outlineColor =
              "rgba(218, 193, 185, 0.3)";
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={!message.trim() || isSending}
          style={{
            position: "absolute",
            right: 6,
            top: "50%",
            transform: "translateY(-50%)",
            width: 36,
            height: 36,
            borderRadius: "0.375rem",
            border: "none",
            background:
              message.trim() && !isSending
                ? "linear-gradient(135deg, #93452A, #B25D3F)"
                : "#EAE8E6",
            color: message.trim() && !isSending ? "#FFFFFF" : "#5E5E65",
            cursor: message.trim() && !isSending ? "pointer" : "default",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 150ms ease",
          }}
        >
          <ArrowUp size={18} />
        </button>
      </div>
    </div>
  );
}
