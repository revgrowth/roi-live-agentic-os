"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { TaskLevel } from "@/types/task";
import { useTaskStore } from "@/store/task-store";

const levels: { value: TaskLevel; label: string }[] = [
  { value: "task", label: "Task" },
  { value: "project", label: "Project" },
  { value: "gsd", label: "GSD" },
];

export function TaskCreateInput() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState<TaskLevel>("task");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const createTask = useTaskStore((s) => s.createTask);

  const nameRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const descFocusedRef = useRef(false);

  // Auto-grow textarea
  const adjustTextareaHeight = useCallback(() => {
    const el = descRef.current;
    if (!el) return;
    el.style.height = "60px";
    const scrollH = el.scrollHeight;
    el.style.height = Math.min(Math.max(scrollH, 60), 160) + "px";
  }, []);

  // Collapse when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        formRef.current &&
        !formRef.current.contains(e.target as Node) &&
        !title.trim() &&
        !description.trim()
      ) {
        setIsExpanded(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [title, description]);

  const handleSubmit = useCallback(() => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle || isSubmitting) return;
    setIsSubmitting(true);
    setTitle("");
    setDescription("");
    setIsExpanded(false);
    descFocusedRef.current = false;
    createTask(trimmedTitle, description.trim() || null, level).finally(() => {
      setIsSubmitting(false);
    });
  }, [title, description, level, isSubmitting, createTask]);

  const shouldExpand = isExpanded || (title.trim().length > 0);

  return (
    <div
      ref={formRef}
      style={{
        marginBottom: 24,
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
      {/* Name input */}
      <input
        ref={nameRef}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onFocus={() => setIsExpanded(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !descFocusedRef.current) {
            e.preventDefault();
            handleSubmit();
          }
          if (e.key === "Tab" && !e.shiftKey && title.trim()) {
            e.preventDefault();
            descRef.current?.focus();
          }
        }}
        disabled={isSubmitting}
        placeholder="What would you like Claude to do?"
        style={{
          width: "100%",
          padding: shouldExpand ? "0" : "8px 16px",
          fontSize: 15,
          fontFamily: "var(--font-inter), Inter, sans-serif",
          fontWeight: 500,
          backgroundColor: "transparent",
          border: "none",
          borderRadius: 6,
          outline: "none",
          color: "#1B1C1B",
          height: shouldExpand ? 28 : 40,
          opacity: isSubmitting ? 0.6 : 1,
          transition: "all 150ms ease",
          boxSizing: "border-box" as const,
        }}
      />

      {/* Expandable description area */}
      <div
        style={{
          maxHeight: shouldExpand ? 220 : 0,
          overflow: "hidden",
          transition: "max-height 200ms ease",
        }}
      >
        {/* Description textarea */}
        <textarea
          ref={descRef}
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            adjustTextareaHeight();
          }}
          onFocus={() => {
            descFocusedRef.current = true;
          }}
          onBlur={() => {
            descFocusedRef.current = false;
          }}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
              e.preventDefault();
              handleSubmit();
            }
          }}
          disabled={isSubmitting}
          placeholder="Add details, context, or specific instructions..."
          style={{
            width: "100%",
            marginTop: 8,
            padding: "8px 0",
            fontSize: 14,
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontWeight: 400,
            backgroundColor: "transparent",
            border: "none",
            borderTop: "1px solid rgba(218, 193, 185, 0.15)",
            outline: "none",
            color: "#1B1C1B",
            resize: "none",
            minHeight: 60,
            maxHeight: 160,
            lineHeight: "1.5",
            boxSizing: "border-box" as const,
          }}
        />

        {/* Bottom bar: level chips + submit button */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 8,
          }}
        >
          {/* Level selector chips */}
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

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || isSubmitting}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                e.preventDefault();
                handleSubmit();
              }
            }}
            style={{
              background: title.trim()
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
              cursor: title.trim() ? "pointer" : "default",
              opacity: isSubmitting ? 0.6 : 1,
              transition: "all 150ms ease",
            }}
          >
            Send to Claude
          </button>
        </div>
      </div>
    </div>
  );
}
