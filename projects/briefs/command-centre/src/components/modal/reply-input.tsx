"use client";

import { useState, useRef, useCallback } from "react";
import { ArrowUp } from "lucide-react";
import type { LogEntry } from "@/types/task";

interface ReplyInputProps {
  taskId: string;
  isVisible: boolean;
  onOptimisticReply?: (entry: LogEntry) => void;
}

export function ReplyInput({ taskId, isVisible, onOptimisticReply }: ReplyInputProps) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
      await fetch(`/api/tasks/${taskId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
    } catch {
      // Silently fail -- the optimistic entry is already shown
    } finally {
      setIsSending(false);
    }
  }, [message, isSending, taskId, onOptimisticReply]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  if (!isVisible) return null;

  return (
    <div
      style={{
        padding: "12px 24px 16px 24px",
        borderTop: "1px solid #EAE8E6",
      }}
    >
      <div style={{ position: "relative" }}>
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Reply to Claude..."
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
