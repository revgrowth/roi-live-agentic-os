"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Tag, X, Check } from "lucide-react";

const MONO = "'DM Mono', monospace";

interface TagPickerProps {
  value: string | null;
  onChange: (tag: string | null) => void;
  /** Inline mode renders just the pill (click to edit). Panel mode renders the full dropdown. */
  mode?: "inline" | "panel";
}

export function TagPicker({ value, onChange, mode = "inline" }: TagPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch existing tags when dropdown opens
  useEffect(() => {
    if (!open) return;
    fetch("/api/tasks/tags")
      .then((r) => r.json())
      .then((data: string[]) => setTags(data))
      .catch(() => {});
    // Focus input after opening
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const filtered = tags.filter(
    (t) => !query || t.toLowerCase().includes(query.toLowerCase())
  );
  const exactMatch = tags.some((t) => t.toLowerCase() === query.toLowerCase());
  const showCreate = query.trim().length > 0 && !exactMatch;

  const selectTag = useCallback(
    (tag: string) => {
      onChange(tag);
      setOpen(false);
      setQuery("");
    },
    [onChange]
  );

  const clearTag = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange(null);
    },
    [onChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && query.trim()) {
        e.preventDefault();
        selectTag(query.trim());
      }
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    },
    [query, selectTag]
  );

  return (
    <div ref={containerRef} style={{ position: "relative", display: "inline-flex" }}>
      {/* Trigger — tag pill or "add tag" button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          padding: "3px 8px",
          fontSize: 11,
          fontFamily: MONO,
          fontWeight: 500,
          border: "1px solid rgba(218, 193, 185, 0.4)",
          borderRadius: 5,
          backgroundColor: value ? "rgba(218, 193, 185, 0.1)" : "transparent",
          color: value ? "#666" : "#aaa",
          cursor: "pointer",
          transition: "all 120ms ease",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(218, 193, 185, 0.7)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(218, 193, 185, 0.4)";
        }}
      >
        <Tag size={11} />
        {value || "tag"}
        {value && (
          <span
            onClick={clearTag}
            style={{
              display: "inline-flex",
              alignItems: "center",
              marginLeft: 1,
              cursor: "pointer",
            }}
          >
            <X size={10} />
          </span>
        )}
      </button>

      {/* Dropdown — uses fixed positioning to escape parent opacity */}
      {open && (
        <div
          style={{
            position: "fixed",
            top: (containerRef.current?.getBoundingClientRect().bottom ?? 0) + 4,
            left: containerRef.current?.getBoundingClientRect().left ?? 0,
            backgroundColor: "#FFFFFF",
            borderRadius: 8,
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.12)",
            border: "1px solid #e5e1dc",
            padding: 4,
            zIndex: 300,
            width: 200,
          }}
        >
          {/* Search/create input */}
          <div style={{ padding: "4px 6px" }}>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search or create..."
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                fontSize: 12,
                fontFamily: MONO,
                border: "1px solid #e5e1dc",
                borderRadius: 5,
                padding: "5px 8px",
                outline: "none",
                color: "#1B1C1B",
                background: "#faf9f7",
              }}
            />
          </div>

          {/* Existing tags */}
          <div style={{ maxHeight: 160, overflowY: "auto" }}>
            {filtered.map((tag) => (
              <button
                key={tag}
                onClick={(e) => {
                  e.stopPropagation();
                  selectTag(tag);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: "5px 10px",
                  fontSize: 12,
                  fontFamily: MONO,
                  border: "none",
                  borderRadius: 5,
                  backgroundColor: value === tag ? "#f3f0ee" : "transparent",
                  color: "#1B1C1B",
                  cursor: "pointer",
                  textAlign: "left" as const,
                }}
                onMouseEnter={(e) => {
                  if (value !== tag) e.currentTarget.style.backgroundColor = "#faf9f7";
                }}
                onMouseLeave={(e) => {
                  if (value !== tag) e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <span>{tag}</span>
                {value === tag && <Check size={12} color="#93452A" />}
              </button>
            ))}

            {/* Create new tag option */}
            {showCreate && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  selectTag(query.trim());
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  width: "100%",
                  padding: "5px 10px",
                  fontSize: 12,
                  fontFamily: MONO,
                  border: "none",
                  borderRadius: 5,
                  backgroundColor: "transparent",
                  color: "#93452A",
                  cursor: "pointer",
                  textAlign: "left" as const,
                  fontWeight: 500,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#faf9f7";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                Create &quot;{query.trim()}&quot;
              </button>
            )}

            {filtered.length === 0 && !showCreate && (
              <div
                style={{
                  padding: "8px 10px",
                  fontSize: 11,
                  fontFamily: MONO,
                  color: "#9C9CA0",
                  textAlign: "center",
                }}
              >
                No tags yet
              </div>
            )}
          </div>

          {/* Remove tag option (when a tag is set) */}
          {value && (
            <div style={{ borderTop: "1px solid #e5e1dc", marginTop: 2, paddingTop: 2 }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(null);
                  setOpen(false);
                  setQuery("");
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  width: "100%",
                  padding: "5px 10px",
                  fontSize: 11,
                  fontFamily: MONO,
                  border: "none",
                  borderRadius: 5,
                  backgroundColor: "transparent",
                  color: "#9C9CA0",
                  cursor: "pointer",
                  textAlign: "left" as const,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#faf9f7";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <X size={10} />
                Remove tag
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** Simple display-only tag pill (no editing). */
export function TagPill({ tag }: { tag: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 3,
        padding: "1px 5px",
        fontSize: 10,
        fontFamily: MONO,
        fontWeight: 500,
        border: "1px solid rgba(218, 193, 185, 0.25)",
        borderRadius: 4,
        backgroundColor: "rgba(218, 193, 185, 0.08)",
        color: "#888",
        whiteSpace: "nowrap",
      }}
    >
      <Tag size={8} />
      {tag}
    </span>
  );
}

/** Tag filter bar — shows all distinct tags as toggle chips. */
export function TagFilterBar({
  tasks,
  activeTag,
  onTagChange,
}: {
  tasks: Array<{ tag: string | null }>;
  activeTag: string | null;
  onTagChange: (tag: string | null) => void;
}) {
  const distinctTags = useMemo(() => {
    const set = new Set<string>();
    for (const t of tasks) {
      if (t.tag) set.add(t.tag);
    }
    return Array.from(set).sort();
  }, [tasks]);

  if (distinctTags.length === 0) return null;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
      <button
        onClick={() => onTagChange(null)}
        style={{
          padding: "2px 8px",
          fontSize: 11,
          fontFamily: MONO,
          fontWeight: activeTag === null ? 600 : 400,
          border: "1px solid rgba(218, 193, 185, 0.3)",
          borderRadius: 4,
          backgroundColor: activeTag === null ? "rgba(218, 193, 185, 0.15)" : "transparent",
          color: activeTag === null ? "#1B1C1B" : "#9C9CA0",
          cursor: "pointer",
          transition: "all 120ms ease",
        }}
      >
        All
      </button>
      {distinctTags.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagChange(activeTag === tag ? null : tag)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            padding: "2px 8px",
            fontSize: 11,
            fontFamily: MONO,
            fontWeight: activeTag === tag ? 600 : 400,
            border: "1px solid rgba(218, 193, 185, 0.3)",
            borderRadius: 4,
            backgroundColor: activeTag === tag ? "rgba(218, 193, 185, 0.15)" : "transparent",
            color: activeTag === tag ? "#1B1C1B" : "#9C9CA0",
            cursor: "pointer",
            transition: "all 120ms ease",
          }}
        >
          <Tag size={9} />
          {tag}
        </button>
      ))}
    </div>
  );
}

