"use client";

import Link from "next/link";
import { FolderOpen } from "lucide-react";
import type { DashboardSummary } from "@/types/dashboard";

interface ActiveProjectsProps {
  activeProjects: DashboardSummary["activeProjects"];
}

const LEVEL_INFO: Record<number, { bg: string; text: string; label: string }> = {
  1: { bg: "rgba(107, 142, 107, 0.1)", text: "#6B8E6B", label: "Quick task" },
  2: { bg: "rgba(147, 69, 42, 0.1)", text: "#93452A", label: "Campaign" },
  3: { bg: "rgba(59, 130, 246, 0.1)", text: "#3B82F6", label: "Deep build" },
};

export function ActiveProjects({ activeProjects }: ActiveProjectsProps) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={headerStyle}>
        <FolderOpen size={16} color="#93452A" />
        <span style={labelStyle}>Active Projects</span>
      </div>
      {activeProjects.length > 0 ? (
        <div style={gridStyle}>
          {activeProjects.map((project) => {
            const info = LEVEL_INFO[project.level] || LEVEL_INFO[2];
            const progress = project.totalItems > 0
              ? Math.round((project.completedItems / project.totalItems) * 100)
              : 0;

            return (
              <Link
                key={project.slug}
                href={`/board?project=${encodeURIComponent(project.slug)}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div
                  style={projectCardStyle}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 2px 12px rgba(147, 69, 42, 0.08)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ ...badgeStyle, backgroundColor: info.bg, color: info.text }}>
                      {info.label}
                    </span>
                  </div>
                  <div style={projectNameStyle}>{project.name}</div>
                  {project.goal && (
                    <p style={goalStyle}>{project.goal}</p>
                  )}
                  <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
                    {project.totalItems > 0 && (
                      <>
                        <div style={progressBarBgStyle}>
                          <div style={{ ...progressBarFillStyle, width: `${progress}%` }} />
                        </div>
                        <span style={progressLabelStyle}>
                          {project.completedItems}/{project.totalItems} deliverables
                        </span>
                      </>
                    )}
                    {project.boardTaskCount > 0 && (
                      <span style={progressLabelStyle}>
                        {project.boardTaskCount} task{project.boardTaskCount !== 1 ? "s" : ""} on board
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <p style={emptyStyle}>No active projects right now.</p>
      )}
    </div>
  );
}

const headerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  marginBottom: 16,
};

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
  fontSize: 11,
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "#5E5E65",
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: 16,
};

const projectCardStyle: React.CSSProperties = {
  backgroundColor: "#F6F3F1",
  borderRadius: 12,
  padding: "20px 24px",
  cursor: "pointer",
  transition: "box-shadow 150ms ease",
};

const badgeStyle: React.CSSProperties = {
  fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
  fontSize: 10,
  fontWeight: 700,
  padding: "2px 8px",
  borderRadius: 4,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const projectNameStyle: React.CSSProperties = {
  fontFamily: "var(--font-inter), Inter, sans-serif",
  fontSize: 15,
  fontWeight: 600,
  color: "#1B1C1B",
};

const goalStyle: React.CSSProperties = {
  fontFamily: "var(--font-inter), Inter, sans-serif",
  fontSize: 13,
  color: "#5E5E65",
  margin: "4px 0 0",
  lineHeight: 1.5,
  overflow: "hidden",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical" as const,
};

const progressBarBgStyle: React.CSSProperties = {
  height: 4,
  backgroundColor: "rgba(218, 193, 185, 0.3)",
  borderRadius: 2,
  overflow: "hidden",
};

const progressBarFillStyle: React.CSSProperties = {
  height: "100%",
  backgroundColor: "#93452A",
  borderRadius: 2,
  transition: "width 300ms ease",
};

const progressLabelStyle: React.CSSProperties = {
  fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
  fontSize: 11,
  color: "#9C9CA0",
};

const emptyStyle: React.CSSProperties = {
  fontFamily: "var(--font-inter), Inter, sans-serif",
  fontSize: 14,
  color: "#9C9CA0",
  margin: 0,
};
