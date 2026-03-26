"use client";

import { useEffect, useState } from "react";
import { Download, Plus, ArrowLeft } from "lucide-react";
import { MarkdownPreview } from "../shared/markdown-preview";

interface ModalFilePreviewProps {
  fileName: string;
  relativePath: string;
  onBack: () => void;
  onNewTask: (fileName: string, relativePath: string) => void;
}

export function ModalFilePreview({
  fileName,
  relativePath,
  onBack,
  onNewTask,
}: ModalFilePreviewProps) {
  const [content, setContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    fetch(`/api/files/${relativePath}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load file");
        const json = await res.json();
        setContent(json.content);
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [relativePath]);

  const isMarkdown = fileName.endsWith(".md") || fileName.endsWith(".mdx");
  const isImage = /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(fileName);

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 24px",
          borderBottom: "1px solid #EAE8E6",
          backgroundColor: "#FAFAF9",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={onBack}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 13,
              fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
              color: "#93452A",
              padding: "4px 8px",
              borderRadius: 4,
            }}
          >
            <ArrowLeft size={14} />
            Output Files
          </button>
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "var(--font-inter), Inter, sans-serif",
              color: "#1B1C1B",
            }}
          >
            {fileName}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button
            onClick={() => onNewTask(fileName, relativePath)}
            title="New task from this output"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 12,
              fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
              color: "#93452A",
              backgroundColor: "rgba(147, 69, 42, 0.08)",
              border: "none",
              borderRadius: 6,
              padding: "6px 12px",
              cursor: "pointer",
              transition: "background 150ms ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(147, 69, 42, 0.15)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(147, 69, 42, 0.08)"; }}
          >
            <Plus size={12} />
            New task from output
          </button>
          <button
            onClick={() => {
              window.open(
                `/api/files/download?path=${encodeURIComponent(relativePath)}`,
                "_blank"
              );
            }}
            title="Download"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 12,
              fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
              color: "#5E5E65",
              backgroundColor: "#EAE8E6",
              border: "none",
              borderRadius: 6,
              padding: "6px 12px",
              cursor: "pointer",
              transition: "background 150ms ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#DDD"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#EAE8E6"; }}
          >
            <Download size={12} />
            Download
          </button>
        </div>
      </div>

      {/* Content area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px",
        }}
      >
        {isLoading && (
          <div style={{ textAlign: "center", padding: 32, color: "#5E5E65", fontSize: 14, fontFamily: "var(--font-inter), Inter, sans-serif" }}>
            Loading file...
          </div>
        )}

        {error && (
          <div style={{ textAlign: "center", padding: 32, color: "#C04030", fontSize: 14, fontFamily: "var(--font-inter), Inter, sans-serif" }}>
            {error}
          </div>
        )}

        {!isLoading && !error && content !== null && (
          <>
            {isImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`/api/files/preview?path=${encodeURIComponent(relativePath)}`}
                alt={fileName}
                style={{ maxWidth: "100%", borderRadius: 8 }}
              />
            ) : isMarkdown ? (
              <MarkdownPreview content={content} />
            ) : (
              <pre
                style={{
                  fontSize: 13,
                  fontFamily: "var(--font-space-grotesk), Space Grotesk, monospace",
                  color: "#1B1C1B",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  lineHeight: 1.6,
                }}
              >
                {content}
              </pre>
            )}
          </>
        )}
      </div>
    </div>
  );
}
