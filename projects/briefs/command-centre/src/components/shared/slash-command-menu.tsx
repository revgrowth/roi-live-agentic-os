"use client";

import { useRef, useEffect, useState } from "react";
import { filterCommands, CATEGORY_LABELS, type SlashCommand } from "@/lib/slash-commands";

interface SlashCommandMenuProps {
  query: string;
  onSelect: (command: SlashCommand) => void;
  onClose: () => void;
  /** Position the menu above or below the input */
  anchor?: "above" | "below";
}

export function SlashCommandMenu({ query, onSelect, onClose, anchor = "above" }: SlashCommandMenuProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  const filtered = filterCommands(query);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Scroll selected item into view
  useEffect(() => {
    const el = itemRefs.current.get(selectedIndex);
    if (el) el.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        if (filtered[selectedIndex]) onSelect(filtered[selectedIndex]);
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [filtered, selectedIndex, onSelect, onClose]);

  // Click outside to close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  if (filtered.length === 0) return null;

  // Group by category
  let lastCategory = "";

  return (
    <div
      ref={menuRef}
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        ...(anchor === "above" ? { bottom: "100%", marginBottom: 4 } : { top: "100%", marginTop: 4 }),
        backgroundColor: "#FFFFFF",
        border: "1px solid rgba(218, 193, 185, 0.3)",
        borderRadius: 8,
        boxShadow: "0 8px 24px rgba(147, 69, 42, 0.1)",
        maxHeight: 320,
        overflowY: "auto",
        zIndex: 60,
      }}
    >
      {filtered.map((cmd, i) => {
        const showCategory = cmd.category !== lastCategory;
        lastCategory = cmd.category;
        return (
          <div key={cmd.command}>
            {showCategory && (
              <div
                style={{
                  padding: "6px 12px 2px",
                  fontSize: 10,
                  fontWeight: 600,
                  fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                  color: "#9C9CA0",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  ...(i > 0 ? { borderTop: "1px solid #EAE8E6", marginTop: 4, paddingTop: 8 } : {}),
                }}
              >
                {CATEGORY_LABELS[cmd.category] || cmd.category}
              </div>
            )}
            <button
              ref={(el) => { if (el) itemRefs.current.set(i, el); }}
              onClick={() => onSelect(cmd)}
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 8,
                width: "100%",
                textAlign: "left",
                padding: "8px 12px",
                border: "none",
                cursor: "pointer",
                backgroundColor: i === selectedIndex ? "rgba(147, 69, 42, 0.06)" : "transparent",
                transition: "background 80ms ease",
              }}
              onMouseEnter={() => setSelectedIndex(i)}
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                  color: "#93452A",
                  whiteSpace: "nowrap",
                }}
              >
                {cmd.command}
              </span>
              <span
                style={{
                  fontSize: 12,
                  fontFamily: "var(--font-inter), Inter, sans-serif",
                  color: "#5E5E65",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {cmd.description}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
