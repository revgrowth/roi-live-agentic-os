"use client";

import { useState, useEffect, useCallback } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { PhasePipeline } from "@/components/gsd/phase-pipeline";
import { PhaseDetail } from "@/components/gsd/phase-detail";
import { ContentViewer } from "@/components/context/content-viewer";
import type { GsdProject } from "@/types/gsd";

export default function GsdPage() {
  const [project, setProject] = useState<GsdProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
  const [viewingFile, setViewingFile] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/gsd")
      .then((r) => r.json())
      .then((data) => {
        setProject(data as GsdProject);
        if (data.hasPlanning && data.phases?.length > 0) {
          // Select first non-complete phase, or last phase
          const current = data.phases.find((p: { status: string }) => p.status !== "complete");
          setSelectedPhase(current?.number ?? data.phases[data.phases.length - 1].number);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleViewFile = useCallback((path: string) => {
    setViewingFile(path);
  }, []);

  if (loading) {
    return (
      <AppShell title="GSD">
        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          {[300, 720, 500].map((w, i) => (
            <div
              key={i}
              style={{
                height: i === 1 ? 80 : 20,
                width: Math.min(w, 720),
                backgroundColor: "#EAE8E6",
                borderRadius: 8,
                animation: "pulse-dot 1.5s ease-in-out infinite",
              }}
            />
          ))}
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell title="GSD">
        <div style={{ padding: 24 }}>
          <div style={{ backgroundColor: "#FEF2F2", padding: 16, borderRadius: 8 }}>
            <p style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontSize: 14, color: "#EF4444", margin: 0 }}>
              Failed to load GSD data: {error}
            </p>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!project?.hasPlanning) {
    return (
      <AppShell title="GSD">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 400,
            gap: 12,
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontSize: 14,
              color: "#5E5E65",
            }}
          >
            No GSD project found. Start one with{" "}
            <code
              style={{
                fontFamily: "var(--font-space-grotesk), Space Grotesk, monospace",
                backgroundColor: "#F6F3F1",
                padding: "2px 6px",
                borderRadius: 4,
                fontSize: 13,
              }}
            >
              /gsd:new-project
            </code>
          </p>
        </div>
      </AppShell>
    );
  }

  const selectedPhaseData = project.phases.find((p) => p.number === selectedPhase);

  // File viewer overlay
  if (viewingFile) {
    return (
      <AppShell title="GSD">
        <div>
          {/* Back button */}
          <button
            onClick={() => setViewingFile(null)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              margin: "0 0 16px",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontSize: 13,
              fontWeight: 500,
              color: "#93452A",
            }}
          >
            &#8592; Back to GSD
          </button>
          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid rgba(218, 193, 185, 0.2)",
              borderRadius: 12,
              minHeight: 400,
            }}
          >
            <ContentViewer selectedPath={viewingFile} />
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="GSD">
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Project header */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid rgba(218, 193, 185, 0.2)",
            borderRadius: 12,
            padding: 20,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
                  fontWeight: 700,
                  fontSize: 20,
                  color: "#1B1C1B",
                  margin: "0 0 4px",
                }}
              >
                {project.name}
              </h2>
              {project.coreValue && (
                <p
                  style={{
                    fontFamily: "var(--font-inter), Inter, sans-serif",
                    fontSize: 13,
                    color: "#5E5E65",
                    margin: 0,
                    maxWidth: 600,
                  }}
                >
                  {project.coreValue}
                </p>
              )}
            </div>

            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <div style={{ textAlign: "right" }}>
                <span
                  style={{
                    fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                    fontSize: 11,
                    color: "#9C9CA0",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    display: "block",
                  }}
                >
                  {project.milestone}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                    fontSize: 22,
                    fontWeight: 700,
                    color: "#93452A",
                  }}
                >
                  {project.completedPhases}/{project.totalPhases}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                    fontSize: 11,
                    color: "#9C9CA0",
                    display: "block",
                  }}
                >
                  phases
                </span>
              </div>

              {/* Overall progress ring */}
              <div style={{ position: "relative", width: 48, height: 48 }}>
                <svg width="48" height="48" viewBox="0 0 48 48">
                  <circle cx="24" cy="24" r="20" fill="none" stroke="#EAE8E6" strokeWidth="4" />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="#93452A"
                    strokeWidth="4"
                    strokeDasharray={`${(project.completedPhases / project.totalPhases) * 125.6} 125.6`}
                    strokeLinecap="round"
                    transform="rotate(-90 24 24)"
                    style={{ transition: "stroke-dasharray 500ms ease" }}
                  />
                </svg>
                <span
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#93452A",
                  }}
                >
                  {Math.round((project.completedPhases / project.totalPhases) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Phase pipeline */}
        <PhasePipeline
          phases={project.phases}
          selectedPhase={selectedPhase}
          onSelectPhase={setSelectedPhase}
        />

        {/* Phase detail */}
        {selectedPhaseData && (
          <PhaseDetail phase={selectedPhaseData} onViewFile={handleViewFile} />
        )}
      </div>
    </AppShell>
  );
}
