"use client";

import { useState, useRef, useCallback } from "react";
import { X, Upload, FolderUp, FileText, Check, AlertCircle } from "lucide-react";

interface UploadedFile {
  name: string;
  relativePath: string;
}

interface SkillUploadModalProps {
  onClose: () => void;
  onComplete: () => void;
}

export function SkillUploadModal({ onClose, onComplete }: SkillUploadModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [skillFolder, setSkillFolder] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(async (files: FileList) => {
    if (files.length === 0) return;

    setUploading(true);
    setError(null);

    // Determine the skill folder name from the first file's path
    const firstFile = files[0];
    const relativePath = firstFile.webkitRelativePath || firstFile.name;
    const topFolder = relativePath.split("/")[0];
    setSkillFolder(topFolder);

    const results: UploadedFile[] = [];

    for (const file of Array.from(files)) {
      const relPath = file.webkitRelativePath || file.name;
      // Build the target path: .claude/skills/{folder structure}
      const targetPath = `.claude/skills/${relPath}`;
      const targetDir = targetPath.substring(0, targetPath.lastIndexOf("/"));

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("dir", targetDir);

        const res = await fetch("/api/files/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || `Failed to upload ${file.name}`);
        }

        results.push({ name: file.name, relativePath: relPath });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
        setUploading(false);
        return;
      }
    }

    setUploadedFiles(results);
    setUploading(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const items = e.dataTransfer.items;
    if (items && items.length > 0) {
      // Try to get folder entries
      const allFiles: File[] = [];
      let pending = 0;

      const processEntry = (entry: FileSystemEntry, path: string) => {
        if (entry.isFile) {
          pending++;
          (entry as FileSystemFileEntry).file((file) => {
            // Attach the relative path
            Object.defineProperty(file, "webkitRelativePath", {
              value: path + file.name,
              writable: false,
            });
            allFiles.push(file);
            pending--;
            if (pending === 0) {
              const dt = new DataTransfer();
              allFiles.forEach((f) => dt.items.add(f));
              handleFiles(dt.files);
            }
          });
        } else if (entry.isDirectory) {
          pending++;
          const reader = (entry as FileSystemDirectoryEntry).createReader();
          reader.readEntries((entries) => {
            for (const child of entries) {
              processEntry(child, path + entry.name + "/");
            }
            pending--;
            if (pending === 0 && allFiles.length > 0) {
              const dt = new DataTransfer();
              allFiles.forEach((f) => dt.items.add(f));
              handleFiles(dt.files);
            }
          });
        }
      };

      for (let i = 0; i < items.length; i++) {
        const entry = items[i].webkitGetAsEntry?.();
        if (entry) {
          processEntry(entry, "");
        }
      }
    }
  }, [handleFiles]);

  const handleFolderInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 12,
          width: 480,
          maxHeight: "80vh",
          overflow: "auto",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid rgba(218, 193, 185, 0.2)",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
              fontSize: 16,
              fontWeight: 600,
              color: "#1B1C1B",
            }}
          >
            Add Skill
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#5E5E65",
              padding: 4,
              display: "flex",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 20 }}>
          {uploadedFiles.length > 0 ? (
            // Success state
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "20px 0" }}>
              <Check size={40} color="#6B8E6B" />
              <p
                style={{
                  fontFamily: "var(--font-inter), Inter, sans-serif",
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#1B1C1B",
                  margin: 0,
                }}
              >
                {skillFolder} uploaded
              </p>
              <p
                style={{
                  fontFamily: "var(--font-inter), Inter, sans-serif",
                  fontSize: 13,
                  color: "#5E5E65",
                  margin: 0,
                }}
              >
                {uploadedFiles.length} file{uploadedFiles.length !== 1 ? "s" : ""} added to .claude/skills/
              </p>
              <div
                style={{
                  width: "100%",
                  maxHeight: 160,
                  overflow: "auto",
                  backgroundColor: "#F6F3F1",
                  borderRadius: 8,
                  padding: 12,
                  marginTop: 4,
                }}
              >
                {uploadedFiles.map((f) => (
                  <div
                    key={f.relativePath}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "4px 0",
                      fontFamily: "var(--font-inter), Inter, sans-serif",
                      fontSize: 12,
                      color: "#5E5E65",
                    }}
                  >
                    <FileText size={14} style={{ flexShrink: 0 }} />
                    {f.relativePath}
                  </div>
                ))}
              </div>
              <button
                onClick={onComplete}
                style={{
                  marginTop: 8,
                  padding: "8px 20px",
                  backgroundColor: "#93452A",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "0.375rem",
                  fontFamily: "var(--font-inter), Inter, sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Done
              </button>
            </div>
          ) : (
            // Upload state
            <>
              <p
                style={{
                  fontFamily: "var(--font-inter), Inter, sans-serif",
                  fontSize: 13,
                  color: "#5E5E65",
                  margin: "0 0 16px 0",
                  lineHeight: 1.5,
                }}
              >
                Upload a skill folder containing SKILL.md and any references, scripts, or assets.
              </p>

              <input
                ref={inputRef}
                type="file"
                onChange={handleFolderInput}
                style={{ display: "none" }}
                {...{ webkitdirectory: "", directory: "", mozdirectory: "" } as React.InputHTMLAttributes<HTMLInputElement>}
              />

              <div
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onClick={() => inputRef.current?.click()}
                style={{
                  border: `2px dashed ${isDragging ? "#93452A" : "rgba(218, 193, 185, 0.4)"}`,
                  borderRadius: 12,
                  padding: "40px 24px",
                  textAlign: "center",
                  cursor: uploading ? "wait" : "pointer",
                  backgroundColor: isDragging ? "rgba(147, 69, 42, 0.04)" : "transparent",
                  transition: "all 200ms ease",
                }}
              >
                {uploading ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        border: "3px solid #EAE8E6",
                        borderTopColor: "#93452A",
                        animation: "spin 1s linear infinite",
                      }}
                    />
                    <span style={{ fontSize: 14, color: "#5E5E65", fontFamily: "var(--font-inter), Inter, sans-serif" }}>
                      Uploading files...
                    </span>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <FolderUp size={36} color={isDragging ? "#93452A" : "#DAC1B9"} />
                    <span
                      style={{
                        fontSize: 14,
                        color: isDragging ? "#93452A" : "#1B1C1B",
                        fontFamily: "var(--font-inter), Inter, sans-serif",
                        fontWeight: 500,
                      }}
                    >
                      Drop a skill folder here or click to browse
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        color: "#9C9CA0",
                        fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                      }}
                    >
                      Select the folder containing SKILL.md
                    </span>
                  </div>
                )}
              </div>

              {error && (
                <div
                  style={{
                    marginTop: 12,
                    padding: "10px 12px",
                    backgroundColor: "#FFF5F3",
                    borderRadius: 6,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <AlertCircle size={16} color="#C04030" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: "#C04030", fontFamily: "var(--font-inter), Inter, sans-serif" }}>
                    {error}
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}
