"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { DocsFileTree } from "@/components/docs/docs-file-tree";
import { ContentViewer } from "@/components/context/content-viewer";

function DocsContent() {
  const searchParams = useSearchParams();
  const fileParam = searchParams.get("file");

  const [selectedPath, setSelectedPath] = useState<string | null>(fileParam || "CLAUDE.md");
  const [refreshKey, setRefreshKey] = useState(0);

  // Sync with URL query param when it changes
  useEffect(() => {
    if (fileParam) {
      setSelectedPath(fileParam);
    }
  }, [fileParam]);

  const handleFileDeleted = useCallback(() => {
    setSelectedPath(null);
    setRefreshKey((k) => k + 1);
  }, []);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "300px 1fr",
        gap: 16,
        minHeight: "calc(100vh - 200px)",
      }}
    >
      {/* File tree sidebar */}
      <div
        style={{
          backgroundColor: "#F6F3F1",
          borderRadius: "0.5rem",
          overflowY: "auto",
          maxHeight: "calc(100vh - 200px)",
        }}
      >
        <DocsFileTree key={refreshKey} onSelectFile={setSelectedPath} selectedPath={selectedPath} />
      </div>

      {/* Content viewer */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "0.5rem",
          minHeight: 400,
        }}
      >
        <ContentViewer selectedPath={selectedPath} onFileDeleted={handleFileDeleted} />
      </div>
    </div>
  );
}

export default function DocsPage() {
  return (
    <AppShell title="Docs">
      <Suspense>
        <DocsContent />
      </Suspense>
    </AppShell>
  );
}
