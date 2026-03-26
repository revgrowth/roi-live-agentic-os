"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { FileTree } from "@/components/context/file-tree";
import { ContentViewer } from "@/components/context/content-viewer";

export default function ContextPage() {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  return (
    <AppShell title="Context">
      <div
        style={{
          display: "flex",
          minHeight: "calc(100vh - 200px)",
          borderRadius: "0.5rem",
          overflow: "hidden",
        }}
      >
        {/* File tree sidebar */}
        <div
          style={{
            width: 280,
            flexShrink: 0,
            backgroundColor: "#F6F3F1",
            overflowY: "auto",
            borderRight: "1px solid rgba(218, 193, 185, 0.2)",
          }}
        >
          <FileTree onSelectFile={setSelectedPath} selectedPath={selectedPath} />
        </div>

        {/* Content viewer */}
        <div style={{ flex: 1, backgroundColor: "#FFFFFF", minHeight: 400 }}>
          <ContentViewer selectedPath={selectedPath} />
        </div>
      </div>
    </AppShell>
  );
}
