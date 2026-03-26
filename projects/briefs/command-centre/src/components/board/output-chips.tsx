"use client";

import { FileText } from "lucide-react";
import type { OutputFile } from "@/types/task";

function truncateFilename(name: string, maxLen = 20): string {
  if (name.length <= maxLen) return name;
  return name.slice(0, maxLen - 3) + "...";
}

export function OutputChips({
  files,
  onFileClick,
}: {
  files: OutputFile[];
  onFileClick: (file: OutputFile) => void;
}) {
  if (files.length === 0) return null;

  const visible = files.slice(0, 2);
  const remaining = files.length - 2;

  return (
    <div
      style={{
        display: "flex",
        gap: 4,
        flexWrap: "wrap",
        marginTop: 8,
      }}
    >
      {visible.map((file) => (
        <button
          key={file.id}
          onClick={(e) => {
            e.stopPropagation();
            onFileClick(file);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            fontSize: 11,
            fontFamily:
              "var(--font-space-grotesk), Space Grotesk, sans-serif",
            padding: "2px 8px",
            borderRadius: 4,
            backgroundColor: "#FFDBCF",
            color: "#390C00",
            border: "none",
            cursor: "pointer",
            lineHeight: "16px",
          }}
        >
          <FileText size={10} />
          {truncateFilename(file.fileName)}
        </button>
      ))}
      {remaining > 0 && (
        <span
          style={{
            fontSize: 11,
            color: "#5E5E65",
            fontFamily:
              "var(--font-space-grotesk), Space Grotesk, sans-serif",
            lineHeight: "20px",
          }}
        >
          +{remaining} more
        </span>
      )}
    </div>
  );
}
