"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Image, FileType, Download, ExternalLink } from "lucide-react";
import { useTaskStore } from "@/store/task-store";
import type { OutputFile } from "@/types/task";

const IMAGE_EXTENSIONS = new Set(["png", "jpg", "jpeg", "gif", "webp", "svg"]);
const PDF_EXTENSIONS = new Set(["pdf"]);

function formatBytes(bytes: number | null): string {
  if (bytes === null) return "--";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(ext: string) {
  if (IMAGE_EXTENSIONS.has(ext)) return Image;
  if (PDF_EXTENSIONS.has(ext)) return FileType;
  return FileText;
}

export function PanelOutputs({ taskId, onFileClick }: { taskId: string; onFileClick?: (file: OutputFile) => void }) {
  const outputFiles = useTaskStore((s) => s.outputFiles[taskId]) ?? [];
  const fetchOutputFiles = useTaskStore((s) => s.fetchOutputFiles);
  const [hoveredFileId, setHoveredFileId] = useState<string | null>(null);

  useEffect(() => {
    fetchOutputFiles(taskId);
  }, [taskId, fetchOutputFiles]);

  return (
    <div>
      {/* Section header */}
      <div
        style={{
          padding: "24px 24px 12px 24px",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
            color: "#1B1C1B",
          }}
        >
          Output Files
        </span>
        <span
          style={{
            fontSize: 11,
            fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
            color: "#5E5E65",
          }}
        >
          {outputFiles.length}
        </span>
      </div>

      {/* Empty state */}
      {outputFiles.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "32px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <FileText size={32} color="#DAC1B9" />
          <span
            style={{
              fontSize: 14,
              fontFamily: "var(--font-inter), Inter, sans-serif",
              color: "#5E5E65",
            }}
          >
            No output files yet
          </span>
        </div>
      )}

      {/* File list */}
      {outputFiles.length > 0 && (
        <div
          style={{
            padding: "0 24px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {outputFiles.map((file) => {
            const Icon = getFileIcon(file.extension);
            const docsHref = `/docs?file=${encodeURIComponent(file.relativePath)}`;
            const isImage = IMAGE_EXTENSIONS.has(file.extension);

            return (
              <div
                key={file.id}
                onClick={() => onFileClick?.(file)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  borderRadius: "0.375rem",
                  backgroundColor:
                    hoveredFileId === file.id ? "#F6F3F1" : "#FFFFFF",
                  cursor: onFileClick ? "pointer" : "default",
                }}
                onMouseEnter={() => setHoveredFileId(file.id)}
                onMouseLeave={() => setHoveredFileId(null)}
              >
                {/* Left: icon + filename + extension chip */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  {/* Thumbnail for images */}
                  {isImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`/api/files/preview?path=${encodeURIComponent(file.relativePath)}`}
                      alt=""
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 4,
                        objectFit: "cover",
                        flexShrink: 0,
                        backgroundColor: "#F6F3F1",
                      }}
                    />
                  ) : (
                    <Icon
                      size={16}
                      color="#5E5E65"
                      style={{ flexShrink: 0 }}
                    />
                  )}
                  <span
                    style={{
                      fontSize: 14,
                      fontFamily: "var(--font-inter), Inter, sans-serif",
                      color: "#1B1C1B",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {file.fileName}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontFamily:
                        "var(--font-space-grotesk), Space Grotesk, sans-serif",
                      color: "#5E5E65",
                      backgroundColor: "#EAE8E6",
                      padding: "1px 6px",
                      borderRadius: "0.25rem",
                      flexShrink: 0,
                    }}
                  >
                    .{file.extension}
                  </span>
                </div>

                {/* Right: size + actions */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexShrink: 0,
                    marginLeft: 12,
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      fontFamily:
                        "var(--font-space-grotesk), Space Grotesk, sans-serif",
                      color: "#5E5E65",
                    }}
                  >
                    {formatBytes(file.sizeBytes)}
                  </span>
                  <Link
                    href={docsHref}
                    title="Open in Docs"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 4,
                      display: "flex",
                      alignItems: "center",
                      color: "#93452A",
                      borderRadius: "0.25rem",
                      textDecoration: "none",
                    }}
                  >
                    <ExternalLink size={16} />
                  </Link>
                  <button
                    onClick={() => {
                      window.open(
                        `/api/files/download?path=${encodeURIComponent(file.relativePath)}`,
                        "_blank"
                      );
                    }}
                    title="Download"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 4,
                      display: "flex",
                      alignItems: "center",
                      color: "#5E5E65",
                      borderRadius: "0.25rem",
                    }}
                  >
                    <Download size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
