"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { FileText, Folder, FolderOpen } from "lucide-react";
import type { FileNode } from "@/types/file";
import { useClientId, appendClientId } from "@/hooks/use-client-id";
import { asFileNodes, fetchFileNodes } from "@/lib/file-node-response";

interface DocsFileTreeProps {
  onSelectFile: (path: string) => void;
  selectedPath: string | null;
}

const ROOT_FILES = ["AGENTS.md", "CLAUDE.md", "README.md"];

const DOCS_ORDER_KEY = "docs-section-order";
const DOCS_NODE_ORDER_PREFIX = "docs-node-order-";

function loadOrder(key: string): string[] | null {
  try {
    const stored = typeof window !== "undefined" ? localStorage.getItem(key) : null;
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function saveOrder(key: string, items: string[]) {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(items));
    }
  } catch {
    // Ignore
  }
}

function applySavedNodeOrder(nodes: FileNode[], parentDir: string): FileNode[] {
  const order = loadOrder(DOCS_NODE_ORDER_PREFIX + parentDir);
  if (!order) return nodes;
  const sorted = [...nodes];
  sorted.sort((a, b) => {
    const ai = order.indexOf(a.path);
    const bi = order.indexOf(b.path);
    if (ai === -1 && bi === -1) return 0;
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
  return sorted;
}

interface SectionData {
  label: string;
  dir: string;
  nodes: FileNode[];
  defaultExpanded: boolean;
}

export function DocsFileTree({ onSelectFile, selectedPath }: DocsFileTreeProps) {
  const clientId = useClientId();
  const [sections, setSections] = useState<SectionData[]>([]);
  const [rootFiles, setRootFiles] = useState<FileNode[]>([]);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());
  const [childrenMap, setChildrenMap] = useState<Record<string, FileNode[]>>({});
  const [loading, setLoading] = useState(true);

  // Drag state for file-to-folder moves
  const [dragOverDir, setDragOverDir] = useState<string | null>(null);
  const [draggingPath, setDraggingPath] = useState<string | null>(null);
  const dragCounter = useRef(0);

  // Drag state for section reordering
  const [dragSectionIndex, setDragSectionIndex] = useState<number | null>(null);
  const [dragOverSectionIndex, setDragOverSectionIndex] = useState<number | null>(null);

  // Drag state for node reordering within a section
  const [dragNodeKey, setDragNodeKey] = useState<string | null>(null); // "sectionDir:nodeIndex"
  const [dragOverNodeKey, setDragOverNodeKey] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const sectionDefs = [
        { label: "context", dir: "context", defaultExpanded: true },
        { label: "brand_context", dir: "brand_context", defaultExpanded: true },
        { label: "docs", dir: "docs", defaultExpanded: true },
        { label: "projects", dir: "projects", defaultExpanded: true },
        { label: ".planning", dir: ".planning", defaultExpanded: false },
      ];

      const [rootFileResults, ...dirResults] = await Promise.all([
        Promise.all(
          ROOT_FILES.map((f) =>
            fetch(appendClientId(`/api/files/${encodeURIComponent(f)}`, clientId))
              .then((r) => (r.ok ? r.json() : null))
              .catch(() => null)
          )
        ),
        ...sectionDefs.map((s) =>
          fetchFileNodes(appendClientId(`/api/files?dir=${encodeURIComponent(s.dir)}`, clientId))
            .catch(() => [])
        ),
      ]);

      if (!mounted) return;

      const foundRootFiles: FileNode[] = [];
      for (let i = 0; i < ROOT_FILES.length; i++) {
        const data = rootFileResults[i];
        if (data && data.path) {
          foundRootFiles.push({
            name: ROOT_FILES[i],
            path: ROOT_FILES[i],
            type: "file" as const,
            lastModified: data.lastModified || new Date().toISOString(),
            size: data.content ? new Blob([data.content]).size : 0,
          });
        }
      }
      setRootFiles(foundRootFiles);

      const loadedSections: SectionData[] = [];
      const defaultExpanded = new Set<string>();
      for (let i = 0; i < sectionDefs.length; i++) {
        const nodes = dirResults[i] as FileNode[];
        if (nodes.length > 0) {
          loadedSections.push({
            ...sectionDefs[i],
            nodes: applySavedNodeOrder(nodes, sectionDefs[i].dir),
          });
          if (sectionDefs[i].defaultExpanded) {
            defaultExpanded.add(sectionDefs[i].dir);
          }
        }
      }

      // Apply saved section order
      const sectionOrder = loadOrder(DOCS_ORDER_KEY);
      if (sectionOrder) {
        loadedSections.sort((a, b) => {
          const ai = sectionOrder.indexOf(a.dir);
          const bi = sectionOrder.indexOf(b.dir);
          if (ai === -1 && bi === -1) return 0;
          if (ai === -1) return 1;
          if (bi === -1) return -1;
          return ai - bi;
        });
      }

      setSections(loadedSections);
      setExpandedSections(defaultExpanded);
      setLoading(false);
    }

    load();
    return () => { mounted = false; };
  }, [clientId]);

  const toggleSection = useCallback((dir: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(dir)) next.delete(dir);
      else next.add(dir);
      return next;
    });
  }, []);

  const toggleDir = useCallback(
    (dirPath: string) => {
      setExpandedDirs((prev) => {
        const next = new Set(prev);
        if (next.has(dirPath)) {
          next.delete(dirPath);
        } else {
          next.add(dirPath);
          if (!childrenMap[dirPath]) {
            fetch(appendClientId(`/api/files?dir=${encodeURIComponent(dirPath)}`, clientId))
              .then(async (r) => {
                if (!r.ok) return [];
                const payload: unknown = await r.json();
                return asFileNodes(payload);
              })
              .then((children) => {
                setChildrenMap((prev) => ({ ...prev, [dirPath]: children }));
              })
              .catch(() => {
                setChildrenMap((prev) => ({ ...prev, [dirPath]: [] }));
              });
          }
        }
        return next;
      });
    },
    [childrenMap, clientId]
  );

  // ── File-to-folder drag handlers ──

  const handleFileDragStart = useCallback((e: React.DragEvent, nodePath: string) => {
    e.dataTransfer.setData("text/plain", nodePath);
    e.dataTransfer.setData("drag-type", "file");
    e.dataTransfer.effectAllowed = "move";
    setDraggingPath(nodePath);
  }, []);

  const handleFileDragEnd = useCallback(() => {
    setDraggingPath(null);
    setDragOverDir(null);
    dragCounter.current = 0;
  }, []);

  const handleDragEnterDir = useCallback((e: React.DragEvent, dirPath: string) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    setDragOverDir(dirPath);
  }, []);

  const handleDragLeaveDir = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current <= 0) {
      setDragOverDir(null);
      dragCounter.current = 0;
    }
  }, []);

  const handleDragOverGeneric = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleFileDrop = useCallback(
    async (e: React.DragEvent, targetDir: string) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOverDir(null);
      dragCounter.current = 0;

      const sourcePath = e.dataTransfer.getData("text/plain");
      if (!sourcePath) return;

      const sourceDir = sourcePath.substring(0, sourcePath.lastIndexOf("/"));
      if (sourceDir === targetDir || sourcePath === targetDir) return;

      const fileName = sourcePath.split("/").pop();
      const destination = `${targetDir}/${fileName}`;

      try {
        const res = await fetch(
          appendClientId(`/api/files/${encodeURIComponent(sourcePath)}`, clientId),
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ destination }),
          }
        );
        if (res.ok) {
          setChildrenMap((prev) => {
            const next = { ...prev };
            if (next[sourceDir]) {
              next[sourceDir] = next[sourceDir].filter((n) => n.path !== sourcePath);
            }
            delete next[targetDir];
            return next;
          });
          setSections((prev) =>
            prev.map((section) => {
              if (section.dir === sourceDir) {
                return { ...section, nodes: section.nodes.filter((n) => n.path !== sourcePath) };
              }
              return section;
            })
          );
          if (expandedDirs.has(targetDir)) {
            fetch(appendClientId(`/api/files?dir=${encodeURIComponent(targetDir)}`, clientId))
              .then(async (r) => {
                if (!r.ok) return [];
                const payload: unknown = await r.json();
                return asFileNodes(payload);
              })
              .then((children) => {
                setChildrenMap((prev) => ({ ...prev, [targetDir]: children }));
              })
              .catch(() => {
                setChildrenMap((prev) => ({ ...prev, [targetDir]: [] }));
              });
          }
          if (selectedPath === sourcePath) {
            onSelectFile(destination);
          }
        }
      } catch {
        // silently fail
      }
    },
    [clientId, expandedDirs, selectedPath, onSelectFile]
  );

  // ── Section reorder drag handlers ──

  const handleSectionDragStart = useCallback((e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("drag-type", "section");
    e.dataTransfer.setData("text/plain", String(index));
    e.dataTransfer.effectAllowed = "move";
    setDragSectionIndex(index);
  }, []);

  const handleSectionDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverSectionIndex(index);
  }, []);

  const handleSectionDrop = useCallback((e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragSectionIndex !== null && dragSectionIndex !== toIndex) {
      setSections((prev) => {
        const next = [...prev];
        const [moved] = next.splice(dragSectionIndex, 1);
        next.splice(toIndex, 0, moved);
        saveOrder(DOCS_ORDER_KEY, next.map((s) => s.dir));
        return next;
      });
    }
    setDragSectionIndex(null);
    setDragOverSectionIndex(null);
  }, [dragSectionIndex]);

  const handleSectionDragEnd = useCallback(() => {
    setDragSectionIndex(null);
    setDragOverSectionIndex(null);
  }, []);

  // ── Node reorder within section drag handlers ──

  const handleNodeDragStart = useCallback((e: React.DragEvent, sectionDir: string, nodeIndex: number) => {
    e.dataTransfer.setData("drag-type", "node-reorder");
    e.dataTransfer.setData("text/plain", `${sectionDir}:${nodeIndex}`);
    e.dataTransfer.effectAllowed = "move";
    setDragNodeKey(`${sectionDir}:${nodeIndex}`);
  }, []);

  const handleNodeDragOver = useCallback((e: React.DragEvent, sectionDir: string, nodeIndex: number) => {
    e.preventDefault();
    setDragOverNodeKey(`${sectionDir}:${nodeIndex}`);
  }, []);

  const handleNodeDrop = useCallback((e: React.DragEvent, sectionDir: string, toIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!dragNodeKey) return;
    const [fromDir, fromIndexStr] = dragNodeKey.split(":");
    const fromIndex = parseInt(fromIndexStr, 10);
    if (fromDir === sectionDir && fromIndex !== toIndex) {
      setSections((prev) =>
        prev.map((section) => {
          if (section.dir !== sectionDir) return section;
          const nodes = [...section.nodes];
          const [moved] = nodes.splice(fromIndex, 1);
          nodes.splice(toIndex, 0, moved);
          saveOrder(DOCS_NODE_ORDER_PREFIX + sectionDir, nodes.map((n) => n.path));
          return { ...section, nodes };
        })
      );
    }
    setDragNodeKey(null);
    setDragOverNodeKey(null);
  }, [dragNodeKey]);

  const handleNodeDragEnd = useCallback(() => {
    setDragNodeKey(null);
    setDragOverNodeKey(null);
  }, []);

  // ── Render helpers ──

  const renderNode = (node: FileNode, depth: number = 0) => {
    const isDir = node.type === "directory";
    const isExpanded = expandedDirs.has(node.path);
    const isSelected = node.path === selectedPath;
    const isDragOver = dragOverDir === node.path;
    const isDragging = draggingPath === node.path;
    const children = childrenMap[node.path] || node.children || [];

    return (
      <div key={node.path}>
        <button
          draggable={!isDir}
          onDragStart={!isDir ? (e) => handleFileDragStart(e, node.path) : undefined}
          onDragEnd={!isDir ? handleFileDragEnd : undefined}
          onDragEnter={isDir ? (e) => handleDragEnterDir(e, node.path) : undefined}
          onDragLeave={isDir ? handleDragLeaveDir : undefined}
          onDragOver={isDir ? handleDragOverGeneric : undefined}
          onDrop={isDir ? (e) => handleFileDrop(e, node.path) : undefined}
          onClick={() => (isDir ? toggleDir(node.path) : onSelectFile(node.path))}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            width: "100%",
            padding: "8px 12px",
            paddingLeft: 12 + depth * 16,
            border: "none",
            background: isSelected
              ? "#FFDBCF"
              : isDragOver
              ? "rgba(147, 69, 42, 0.08)"
              : "transparent",
            color: isSelected ? "#390C00" : "#1B1C1B",
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontSize: 13,
            cursor: isDir ? "pointer" : isDragging ? "grabbing" : "pointer",
            borderRadius: "0.25rem",
            textAlign: "left",
            transition: "background 150ms ease",
            opacity: isDragging ? 0.4 : 1,
            outline: isDragOver ? "2px dashed #93452A" : "none",
            outlineOffset: -2,
          }}
          onMouseEnter={(e) => {
            if (!isSelected && !isDragOver) e.currentTarget.style.background = "#F6F3F1";
          }}
          onMouseLeave={(e) => {
            if (!isSelected && !isDragOver) e.currentTarget.style.background = "transparent";
          }}
        >
          {isDir ? (
            isExpanded ? (
              <FolderOpen size={16} style={{ color: "#93452A", flexShrink: 0 }} />
            ) : (
              <Folder size={16} style={{ color: isDragOver ? "#93452A" : "#5E5E65", flexShrink: 0 }} />
            )
          ) : (
            <FileText size={16} style={{ color: "#5E5E65", flexShrink: 0 }} />
          )}
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
            {node.name}
          </span>
        </button>

        {isDir && isExpanded && (
          <div>
            {children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderSectionHeader = (section: SectionData, sectionIndex: number) => {
    const isExpanded = expandedSections.has(section.dir);
    const isDragOverFolder = dragOverDir === section.dir;
    const isSectionDragOver = dragOverSectionIndex === sectionIndex;
    const isSectionDragging = dragSectionIndex === sectionIndex;

    return (
      <button
        draggable
        onDragStart={(e) => handleSectionDragStart(e, sectionIndex)}
        onDragOver={(e) => { handleDragOverGeneric(e); handleSectionDragOver(e, sectionIndex); }}
        onDrop={(e) => {
          // Check if this is a section reorder or a file drop
          if (dragSectionIndex !== null) {
            handleSectionDrop(e, sectionIndex);
          } else {
            handleFileDrop(e, section.dir);
          }
        }}
        onDragEnd={handleSectionDragEnd}
        onDragEnter={(e) => handleDragEnterDir(e, section.dir)}
        onDragLeave={handleDragLeaveDir}
        onClick={() => toggleSection(section.dir)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          width: "100%",
          padding: "8px 12px",
          border: "none",
          background: isDragOverFolder ? "rgba(147, 69, 42, 0.08)" : "transparent",
          color: "#1B1C1B",
          fontFamily: "var(--font-inter), Inter, sans-serif",
          fontSize: 13,
          cursor: "grab",
          borderRadius: "0.25rem",
          textAlign: "left",
          transition: "background 150ms ease",
          outline: isDragOverFolder ? "2px dashed #93452A" : "none",
          outlineOffset: -2,
          opacity: isSectionDragging ? 0.4 : 1,
          borderTop: isSectionDragOver && !isSectionDragging ? "2px solid #93452A" : "2px solid transparent",
        }}
        onMouseEnter={(e) => {
          if (!isDragOverFolder) e.currentTarget.style.background = "#F6F3F1";
        }}
        onMouseLeave={(e) => {
          if (!isDragOverFolder) e.currentTarget.style.background = "transparent";
        }}
      >
        {isExpanded ? (
          <FolderOpen size={16} style={{ color: "#93452A", flexShrink: 0 }} />
        ) : (
          <Folder size={16} style={{ color: isDragOverFolder ? "#93452A" : "#5E5E65", flexShrink: 0 }} />
        )}
        <span style={{ fontWeight: 500 }}>{section.label}</span>
        <span
          style={{
            marginLeft: "auto",
            fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
            fontSize: 10,
            color: "#9C9CA0",
          }}
        >
          {section.nodes.length}
        </span>
      </button>
    );
  };

  const renderSectionNode = (node: FileNode, section: SectionData, nodeIndex: number) => {
    const nodeKey = `${section.dir}:${nodeIndex}`;
    const isNodeDragging = dragNodeKey === nodeKey;
    const isNodeDragOver = dragOverNodeKey === nodeKey && !isNodeDragging;

    return (
      <div
        key={node.path}
        draggable
        onDragStart={(e) => handleNodeDragStart(e, section.dir, nodeIndex)}
        onDragOver={(e) => handleNodeDragOver(e, section.dir, nodeIndex)}
        onDrop={(e) => handleNodeDrop(e, section.dir, nodeIndex)}
        onDragEnd={handleNodeDragEnd}
        style={{
          opacity: isNodeDragging ? 0.4 : 1,
          borderTop: isNodeDragOver ? "2px solid #93452A" : "2px solid transparent",
          cursor: "grab",
        }}
      >
        {renderNode(node, 1)}
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            style={{
              height: 16,
              width: `${60 + Math.random() * 40}%`,
              backgroundColor: "#EAE8E6",
              borderRadius: 4,
              animation: "pulse-dot 1.5s ease-in-out infinite",
            }}
          />
        ))}
      </div>
    );
  }

  const hasContent = rootFiles.length > 0 || sections.length > 0;

  if (!hasContent) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <FileText size={32} style={{ color: "#5E5E65", margin: "0 auto 8px" }} />
        <p style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 13, color: "#5E5E65" }}>
          No documentation files found
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: "8px 0" }}>
      {/* Root Files */}
      {rootFiles.length > 0 && (
        <div>
          <div
            style={{
              padding: "6px 12px",
              fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
              fontSize: 10,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#9C9CA0",
            }}
          >
            Root
          </div>
          {rootFiles.map((node) => renderNode(node, 0))}
        </div>
      )}

      {/* Directory Sections */}
      {sections.map((section, sectionIndex) => (
        <div key={section.dir} style={{ marginTop: 8 }}>
          {renderSectionHeader(section, sectionIndex)}
          {expandedSections.has(section.dir) && (
            <div>
              {section.nodes.map((node, nodeIndex) =>
                renderSectionNode(node, section, nodeIndex)
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
