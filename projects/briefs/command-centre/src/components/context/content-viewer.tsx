"use client";

import { useState, useEffect, useCallback } from "react";
import { Pencil, Eye } from "lucide-react";
import { MarkdownPreview } from "@/components/shared/markdown-preview";
import { MarkdownEditor } from "@/components/shared/markdown-editor";
import type { FileContent } from "@/types/file";

interface ContentViewerProps {
  selectedPath: string | null;
}

function formatRelativeTime(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function ContentViewer({ selectedPath }: ContentViewerProps) {
  const [file, setFile] = useState<FileContent | null>(null);
  const [mode, setMode] = useState<"preview" | "edit">("preview");
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [conflict, setConflict] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFile = useCallback(async (path: string) => {
    setLoading(true);
    setError(null);
    setConflict(false);
    setMode("preview");
    try {
      const res = await fetch(`/api/files/${encodeURIComponent(path)}`);
      if (!res.ok) throw new Error("Failed to load file");
      const data: FileContent = await res.json();
      setFile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load file");
      setFile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedPath) {
      fetchFile(selectedPath);
    } else {
      setFile(null);
      setMode("preview");
    }
  }, [selectedPath, fetchFile]);

  const handleSave = async (content: string) => {
    if (!file || !selectedPath) return;
    setIsSaving(true);
    setConflict(false);
    try {
      const res = await fetch(`/api/files/${encodeURIComponent(selectedPath)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, lastModified: file.lastModified }),
      });
      if (res.status === 409) {
        setConflict(true);
        return;
      }
      if (!res.ok) throw new Error("Save failed");
      const updated: FileContent = await res.json();
      setFile(updated);
      setMode("preview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  // Empty state
  if (!selectedPath) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          minHeight: 400,
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontSize: 14,
            color: "#5E5E65",
          }}
        >
          Select a file from the tree to view its contents
        </p>
      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
        {[720, 200, 500, 350].map((w, i) => (
          <div
            key={i}
            style={{
              height: 16,
              width: Math.min(w, 720),
              maxWidth: "100%",
              backgroundColor: "#EAE8E6",
              borderRadius: 4,
              animation: "pulse-dot 1.5s ease-in-out infinite",
            }}
          />
        ))}
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <div
          style={{
            backgroundColor: "#FEF2F2",
            padding: 16,
            borderRadius: "0.5rem",
          }}
        >
          <p style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 14, color: "#EF4444", fontWeight: 500, margin: 0 }}>
            Unable to read file
          </p>
          <p style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 13, color: "#5E5E65", margin: "8px 0 12px" }}>
            {error}
          </p>
          <button
            onClick={() => selectedPath && fetchFile(selectedPath)}
            style={{
              background: "none",
              border: "none",
              color: "#93452A",
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              padding: 0,
              textDecoration: "underline",
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!file) return null;

  const fileName = selectedPath.split("/").pop() || selectedPath;

  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 16,
          paddingBottom: 16,
          borderBottom: "1px solid rgba(218, 193, 185, 0.2)",
        }}
      >
        <div>
          <h3
            style={{
              fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
              fontWeight: 700,
              fontSize: 16,
              color: "#1B1C1B",
              margin: 0,
            }}
          >
            {fileName}
          </h3>
          <p
            style={{
              fontFamily: "var(--font-space-grotesk), Space Grotesk, monospace",
              fontSize: 11,
              color: "#5E5E65",
              margin: "4px 0 0",
            }}
          >
            {selectedPath}
          </p>
          <p
            style={{
              fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
              fontSize: 11,
              color: "#5E5E65",
              margin: "2px 0 0",
            }}
          >
            last modified: {formatRelativeTime(file.lastModified)}
          </p>
        </div>

        <button
          onClick={() => setMode(mode === "preview" ? "edit" : "preview")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 14px",
            border: "none",
            borderRadius: "0.25rem",
            backgroundColor: mode === "edit" ? "#FFDBCF" : "#F6F3F1",
            color: mode === "edit" ? "#390C00" : "#5E5E65",
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            transition: "background 150ms ease",
          }}
        >
          {mode === "preview" ? (
            <>
              <Pencil size={14} /> Edit
            </>
          ) : (
            <>
              <Eye size={14} /> Preview
            </>
          )}
        </button>
      </div>

      {/* Conflict warning */}
      {conflict && (
        <div
          style={{
            backgroundColor: "#FFFBEB",
            padding: 12,
            borderRadius: "0.375rem",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 13, color: "#92400E", margin: 0 }}>
            This file was modified by another process. Reload?
          </p>
          <button
            onClick={() => selectedPath && fetchFile(selectedPath)}
            style={{
              background: "none",
              border: "none",
              color: "#93452A",
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Reload
          </button>
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1 }}>
        {mode === "preview" ? (
          <MarkdownPreview content={file.content} />
        ) : (
          <MarkdownEditor
            content={file.content}
            onSave={handleSave}
            onCancel={() => setMode("preview")}
            isSaving={isSaving}
          />
        )}
      </div>
    </div>
  );
}
