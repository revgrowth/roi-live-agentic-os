"use client";

import { useState, useEffect, useCallback } from "react";
import {
  type QuestionSpec,
  type QuestionAnswers,
  areAnswersComplete,
} from "@/types/question-spec";

/**
 * Reusable structured-question form. Renders as an inline block in the
 * scoping wizard, or as an overlay modal when a running task pauses
 * for clarification. A single component handles both layouts via the
 * `variant` prop.
 */

interface QuestionModalProps {
  questions: QuestionSpec[];
  /** Controlled answer map (optional — component manages internal state if absent) */
  value?: QuestionAnswers;
  onChange?: (answers: QuestionAnswers) => void;
  /** Only meaningful for overlay variant */
  open?: boolean;
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  cancelLabel?: string;
  onSubmit?: (answers: QuestionAnswers) => void | Promise<void>;
  onCancel?: () => void;
  initialAnswers?: QuestionAnswers;
  variant?: "inline" | "overlay";
  /** Hide the footer / submit button (inline mode: parent provides its own Next button) */
  hideFooter?: boolean;
}

function buildInitialAnswers(
  questions: QuestionSpec[],
  seed?: QuestionAnswers,
): QuestionAnswers {
  const out: QuestionAnswers = {};
  for (const q of questions) {
    if (seed && q.id in seed) {
      out[q.id] = seed[q.id];
    } else if (q.type === "multiselect") {
      out[q.id] = [];
    } else {
      out[q.id] = "";
    }
  }
  return out;
}

export function QuestionModal({
  questions,
  value,
  onChange,
  open = true,
  title,
  subtitle,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  onSubmit,
  onCancel,
  initialAnswers,
  variant = "overlay",
  hideFooter = false,
}: QuestionModalProps) {
  const controlled = value !== undefined;
  const [internalAnswers, setInternalAnswers] = useState<QuestionAnswers>(() =>
    buildInitialAnswers(questions, initialAnswers),
  );
  const [submitting, setSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(variant === "inline");

  const answers = controlled ? value : internalAnswers;

  // Re-seed on question list change (new overlay opening with new spec)
  useEffect(() => {
    if (controlled) return;
    setInternalAnswers(buildInitialAnswers(questions, initialAnswers));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions]);

  useEffect(() => {
    if (variant !== "overlay") return;
    if (open) {
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      setIsVisible(false);
    }
  }, [open, variant]);

  const updateAnswer = useCallback(
    (id: string, next: string | string[]) => {
      if (controlled) {
        onChange?.({ ...(value ?? {}), [id]: next });
      } else {
        setInternalAnswers((prev) => {
          const updated = { ...prev, [id]: next };
          onChange?.(updated);
          return updated;
        });
      }
    },
    [controlled, value, onChange],
  );

  const canSubmit = areAnswersComplete(questions, answers) && !submitting;

  const handleSubmit = useCallback(async () => {
    if (!canSubmit || !onSubmit) return;
    setSubmitting(true);
    try {
      await onSubmit(answers);
    } finally {
      setSubmitting(false);
    }
  }, [canSubmit, onSubmit, answers]);

  // Keyboard shortcuts (overlay only)
  useEffect(() => {
    if (variant !== "overlay" || !open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onCancel && !submitting) {
        e.preventDefault();
        onCancel();
      } else if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [variant, open, onCancel, submitting, handleSubmit]);

  if (variant === "overlay" && !open) return null;

  const body = (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {subtitle && (
        <div
          style={{
            fontSize: 12,
            color: "#5E5E65",
            fontFamily: "var(--font-inter), Inter, sans-serif",
            lineHeight: 1.5,
          }}
        >
          {subtitle}
        </div>
      )}
      {questions.map((q, i) => (
        <QuestionField
          key={q.id}
          index={i}
          question={q}
          value={answers[q.id]}
          onChange={(next) => updateAnswer(q.id, next)}
        />
      ))}
    </div>
  );

  if (variant === "inline") {
    return (
      <div>
        {body}
        {!hideFooter && onSubmit && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
              marginTop: 14,
            }}
          >
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={submitting}
                style={{
                  padding: "6px 14px",
                  fontSize: 13,
                  fontWeight: 500,
                  border: "1px solid rgba(218, 193, 185, 0.35)",
                  borderRadius: 6,
                  backgroundColor: "transparent",
                  color: "#5E5E65",
                  cursor: submitting ? "default" : "pointer",
                  fontFamily:
                    "var(--font-space-grotesk), Space Grotesk, sans-serif",
                }}
              >
                {cancelLabel}
              </button>
            )}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              style={{
                padding: "6px 16px",
                fontSize: 13,
                fontWeight: 600,
                border: "none",
                borderRadius: 6,
                background: canSubmit
                  ? "linear-gradient(135deg, #93452A, #B25D3F)"
                  : "#D1C7C2",
                color: "#FFFFFF",
                cursor: canSubmit ? "pointer" : "default",
                fontFamily:
                  "var(--font-space-grotesk), Space Grotesk, sans-serif",
              }}
            >
              {submitting ? "Submitting..." : submitLabel}
            </button>
          </div>
        )}
      </div>
    );
  }

  // Overlay variant
  return (
    <>
      <div
        onClick={() => !submitting && onCancel?.()}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.35)",
          zIndex: 300,
          opacity: isVisible ? 1 : 0,
          pointerEvents: isVisible ? "auto" : "none",
          transition: "opacity 200ms ease-out",
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: isVisible
            ? "translate(-50%, -50%) scale(1)"
            : "translate(-50%, -50%) scale(0.97)",
          width: "min(560px, calc(100vw - 32px))",
          maxHeight: "calc(100vh - 48px)",
          backgroundColor: "#FFFFFF",
          borderRadius: 12,
          boxShadow: "0px 24px 56px rgba(27, 28, 27, 0.22)",
          zIndex: 301,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          opacity: isVisible ? 1 : 0,
          transition: "opacity 200ms ease-out, transform 200ms ease-out",
          fontFamily: "var(--font-inter), Inter, sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 24px 12px",
            borderBottom: "1px solid #EAE8E6",
            flexShrink: 0,
            backgroundColor: "#FAFAF9",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 15,
              fontWeight: 600,
              color: "#1B1C1B",
              fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
            }}
          >
            {title ?? "A few questions"}
          </h2>
        </div>

        {/* Body */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "18px 24px",
          }}
        >
          {body}
        </div>

        {/* Footer */}
        {!hideFooter && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
              padding: "14px 24px",
              borderTop: "1px solid #EAE8E6",
              backgroundColor: "#FAFAF9",
              flexShrink: 0,
            }}
          >
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={submitting}
                style={{
                  padding: "6px 14px",
                  fontSize: 13,
                  fontWeight: 500,
                  border: "1px solid rgba(218, 193, 185, 0.35)",
                  borderRadius: 6,
                  backgroundColor: "transparent",
                  color: "#5E5E65",
                  cursor: submitting ? "default" : "pointer",
                  fontFamily:
                    "var(--font-space-grotesk), Space Grotesk, sans-serif",
                }}
              >
                {cancelLabel}
              </button>
            )}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              style={{
                padding: "6px 16px",
                fontSize: 13,
                fontWeight: 600,
                border: "none",
                borderRadius: 6,
                background: canSubmit
                  ? "linear-gradient(135deg, #93452A, #B25D3F)"
                  : "#D1C7C2",
                color: "#FFFFFF",
                cursor: canSubmit ? "pointer" : "default",
                fontFamily:
                  "var(--font-space-grotesk), Space Grotesk, sans-serif",
              }}
            >
              {submitting ? "Submitting..." : submitLabel}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ── Individual field renderer ──────────────────────────────────────────

function QuestionField({
  index,
  question,
  value,
  onChange,
}: {
  index: number;
  question: QuestionSpec;
  value: string | string[] | undefined;
  onChange: (next: string | string[]) => void;
}) {
  const label = (
    <div
      style={{
        fontSize: 13,
        color: "#1B1C1B",
        lineHeight: 1.5,
        marginBottom: 8,
        fontWeight: 500,
      }}
    >
      <span style={{ color: "#93452A", marginRight: 6, fontWeight: 700 }}>
        {index + 1}.
      </span>
      {question.prompt}
      {question.required && (
        <span style={{ color: "#93452A", marginLeft: 4 }}>*</span>
      )}
    </div>
  );

  const containerStyle: React.CSSProperties = {
    padding: "12px 14px",
    borderRadius: 8,
    backgroundColor: "#FFF5F0",
    border: "1px solid rgba(147, 69, 42, 0.18)",
  };

  const inputBaseStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px 12px",
    fontSize: 13,
    fontFamily: "var(--font-inter), Inter, sans-serif",
    backgroundColor: "#FFFFFF",
    border: "1px solid rgba(218, 193, 185, 0.4)",
    borderRadius: 6,
    outline: "none",
    color: "#1B1C1B",
    boxSizing: "border-box",
    transition: "border-color 150ms ease",
  };

  if (question.type === "text") {
    return (
      <div style={containerStyle}>
        {label}
        <input
          type="text"
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder ?? "Your answer..."}
          style={inputBaseStyle}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#93452A";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "rgba(218, 193, 185, 0.4)";
          }}
        />
      </div>
    );
  }

  if (question.type === "multiline") {
    return (
      <div style={containerStyle}>
        {label}
        <textarea
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder ?? "Your answer..."}
          rows={3}
          style={{
            ...inputBaseStyle,
            minHeight: 60,
            maxHeight: 160,
            resize: "vertical",
            lineHeight: 1.4,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#93452A";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "rgba(218, 193, 185, 0.4)";
          }}
        />
      </div>
    );
  }

  if (question.type === "select") {
    const options = question.options ?? [];
    const selected = typeof value === "string" ? value : "";
    return (
      <div style={containerStyle}>
        {label}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {options.map((opt) => {
            const isSelected = selected === opt;
            return (
              <label
                key={opt}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 10px",
                  fontSize: 13,
                  backgroundColor: isSelected ? "#FFFFFF" : "transparent",
                  border: isSelected
                    ? "1px solid #93452A"
                    : "1px solid rgba(218, 193, 185, 0.4)",
                  borderRadius: 6,
                  cursor: "pointer",
                  color: "#1B1C1B",
                  transition: "all 120ms ease",
                }}
              >
                <input
                  type="radio"
                  name={question.id}
                  value={opt}
                  checked={isSelected}
                  onChange={() => onChange(opt)}
                  style={{ accentColor: "#93452A" }}
                />
                {opt}
              </label>
            );
          })}
        </div>
      </div>
    );
  }

  // multiselect
  const options = question.options ?? [];
  const selected = Array.isArray(value) ? value : [];
  return (
    <div style={containerStyle}>
      {label}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {options.map((opt) => {
          const isSelected = selected.includes(opt);
          return (
            <label
              key={opt}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 10px",
                fontSize: 13,
                backgroundColor: isSelected ? "#FFFFFF" : "transparent",
                border: isSelected
                  ? "1px solid #93452A"
                  : "1px solid rgba(218, 193, 185, 0.4)",
                borderRadius: 6,
                cursor: "pointer",
                color: "#1B1C1B",
                transition: "all 120ms ease",
              }}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => {
                  if (e.target.checked) {
                    onChange([...selected, opt]);
                  } else {
                    onChange(selected.filter((s) => s !== opt));
                  }
                }}
                style={{ accentColor: "#93452A" }}
              />
              {opt}
            </label>
          );
        })}
      </div>
    </div>
  );
}
