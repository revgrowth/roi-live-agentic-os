"use client";

import { useState, useRef, useEffect, useCallback, KeyboardEvent } from "react";
import { Send } from "lucide-react";
import {
  insertTextareaNewline,
  shouldInsertModifierNewline,
  shouldSubmitOnPlainEnter,
  syncComposerTextareaHeight,
} from "@/lib/composer";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, disabled, placeholder }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const maxHeight = 160;

  useEffect(() => {
    syncComposerTextareaHeight(textareaRef.current, { maxHeight });
  }, [value]);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  }, [value, disabled, onSend]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (shouldInsertModifierNewline(e)) {
      e.preventDefault();
      insertTextareaNewline(e.currentTarget, setValue);
      return;
    }
    if (shouldSubmitOnPlainEnter(e)) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  return (
    <div style={{
      padding: "12px 16px",
      borderTop: "1px solid rgba(218, 193, 185, 0.15)",
      backgroundColor: "#FFFFFF",
    }}>
      <div style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 8,
        backgroundColor: "#F6F3F1",
        borderRadius: 12,
        padding: "8px 12px",
        border: "1px solid rgba(218, 193, 185, 0.2)",
        transition: "border-color 150ms ease",
      }}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "Type a message..."}
          disabled={disabled}
          rows={1}
          style={{
            flex: 1,
            border: "none",
            background: "transparent",
            resize: "none",
            outline: "none",
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontSize: 14,
            lineHeight: "20px",
            color: "#1B1C1B",
            maxHeight,
            overflowY: "hidden",
            padding: "2px 0",
          }}
        />
        <button
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            borderRadius: 8,
            border: "none",
            backgroundColor: value.trim() && !disabled ? "#93452A" : "rgba(147, 69, 42, 0.15)",
            color: value.trim() && !disabled ? "#FFFFFF" : "#9C9CA0",
            cursor: value.trim() && !disabled ? "pointer" : "default",
            flexShrink: 0,
            transition: "all 120ms ease",
          }}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
