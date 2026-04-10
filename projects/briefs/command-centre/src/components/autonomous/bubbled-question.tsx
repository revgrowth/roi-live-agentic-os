"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircleQuestion, Send } from "lucide-react";
import type { Message } from "@/types/chat";
import {
  insertTextareaNewline,
  shouldInsertModifierNewline,
  shouldSubmitOnPlainEnter,
  syncComposerTextareaHeight,
} from "@/lib/composer";

interface BubbledQuestionProps {
  message: Message;
  onReply: (messageId: string, content: string) => void;
}

export function BubbledQuestion({ message, onReply }: BubbledQuestionProps) {
  const [replyText, setReplyText] = useState("");
  const [showReply, setShowReply] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const maxHeight = 120;

  const taskTitle = message.metadata?.questionText || message.content;

  useEffect(() => {
    if (!showReply) return;
    syncComposerTextareaHeight(textareaRef.current, { maxHeight });
  }, [replyText, showReply]);

  const handleSend = useCallback(() => {
    const trimmed = replyText.trim();
    if (!trimmed) return;

    onReply(message.id, trimmed);
    setReplyText("");
    setShowReply(false);
  }, [message.id, onReply, replyText]);

  return (
    <div style={{
      border: "1px solid rgba(212, 165, 116, 0.3)",
      borderRadius: 10,
      padding: "12px 14px",
      backgroundColor: "rgba(212, 165, 116, 0.04)",
      maxWidth: 480,
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        marginBottom: 6,
      }}>
        <MessageCircleQuestion size={13} style={{ color: "#D4A574" }} />
        <span style={{
          fontSize: 10,
          fontWeight: 600,
          fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: "#D4A574",
        }}>
          Needs your input
        </span>
      </div>

      <p style={{
        fontSize: 13,
        fontFamily: "var(--font-inter), Inter, sans-serif",
        color: "#1B1C1B",
        lineHeight: 1.5,
        margin: "0 0 8px",
      }}>
        {taskTitle}
      </p>

      {!showReply ? (
        <button
          onClick={() => setShowReply(true)}
          style={{
            fontSize: 12,
            fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
            fontWeight: 500,
            color: "#93452A",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          Reply to this &darr;
        </button>
      ) : (
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, marginTop: 4 }}>
          <textarea
            ref={textareaRef}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={(e) => {
              if (shouldInsertModifierNewline(e)) {
                e.preventDefault();
                insertTextareaNewline(e.currentTarget, setReplyText);
                return;
              }
              if (shouldSubmitOnPlainEnter(e)) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type your reply..."
            rows={1}
            autoFocus
            style={{
              flex: 1,
              border: "1px solid rgba(218, 193, 185, 0.3)",
              borderRadius: 6,
              padding: "6px 10px",
              fontSize: 12,
              fontFamily: "var(--font-inter), Inter, sans-serif",
              outline: "none",
              backgroundColor: "#FFFFFF",
              resize: "none",
              lineHeight: 1.5,
              minHeight: 32,
              maxHeight,
              overflowY: "hidden",
            }}
          />
          <button
            onClick={handleSend}
            disabled={!replyText.trim()}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 28,
              height: 28,
              borderRadius: 6,
              border: "none",
              backgroundColor: replyText.trim() ? "#93452A" : "rgba(147, 69, 42, 0.15)",
              color: replyText.trim() ? "#FFFFFF" : "#9C9CA0",
              cursor: replyText.trim() ? "pointer" : "default",
            }}
          >
            <Send size={12} />
          </button>
        </div>
      )}
    </div>
  );
}
