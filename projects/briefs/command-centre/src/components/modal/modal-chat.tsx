"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import type { LogEntry } from "@/types/task";
import { ChatEntry } from "./chat-entry";

interface ModalChatProps {
  taskId: string;
  logEntries: LogEntry[];
  isRunning: boolean;
  questionText: string | null;
}

export function ModalChat({
  logEntries,
  isRunning,
  questionText,
}: ModalChatProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const prevLengthRef = useRef(logEntries.length);

  // Auto-scroll on new entries
  useEffect(() => {
    if (logEntries.length > prevLengthRef.current && isAutoScrolling) {
      const el = scrollRef.current;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    }
    prevLengthRef.current = logEntries.length;
  }, [logEntries.length, isAutoScrolling]);

  // Detect user scroll
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const isNearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 40;
    setIsAutoScrolling(isNearBottom);
  }, []);

  const jumpToLatest = useCallback(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
    setIsAutoScrolling(true);
  }, []);

  const hasEntries = logEntries.length > 0;
  const showEmpty = !hasEntries && !isRunning;
  const showTyping = isRunning && !hasEntries;

  return (
    <div
      style={{
        flex: 1,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px 24px 16px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {/* Empty state */}
        {showEmpty && (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: 14,
                fontFamily: "var(--font-inter), Inter, sans-serif",
                color: "#5E5E65",
              }}
            >
              Task has not been executed yet
            </span>
          </div>
        )}

        {/* Typing indicator */}
        {showTyping && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "14px 18px",
            }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: "#93452A",
                  animation: `typing-dot 1.4s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
            <style>{`
              @keyframes typing-dot {
                0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
                40% { opacity: 1; transform: scale(1); }
              }
            `}</style>
          </div>
        )}

        {/* Log entries */}
        {logEntries.map((entry) => (
          <ChatEntry key={entry.id} entry={entry} />
        ))}

        {/* Question indicator when running with question */}
        {questionText && isRunning && logEntries.length > 0 && (
          <div
            style={{
              fontSize: 12,
              fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
              color: "#93452A",
              fontStyle: "italic",
              textAlign: "center",
              padding: "8px 0",
            }}
          >
            Waiting for your reply...
          </div>
        )}
      </div>

      {/* Jump to latest button */}
      {!isAutoScrolling && hasEntries && (
        <button
          onClick={jumpToLatest}
          style={{
            position: "absolute",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            backgroundColor: "rgba(252, 249, 247, 0.9)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(218, 193, 185, 0.3)",
            borderRadius: "1rem",
            padding: "8px 16px",
            fontSize: 12,
            fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
            color: "#93452A",
            cursor: "pointer",
          }}
        >
          Jump to latest
        </button>
      )}
    </div>
  );
}
