"use client";

import { useState } from "react";
import { CheckCircle2, Circle, FileText, ChevronDown, ChevronRight } from "lucide-react";
import type { GsdPhase, GsdPlan } from "@/types/gsd";

interface PhaseDetailProps {
  phase: GsdPhase;
  onViewFile: (path: string) => void;
}

function PlanRow({ plan, phaseDir, onViewFile }: { plan: GsdPlan; phaseDir: string; onViewFile: (p: string) => void }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 0",
        borderBottom: "1px solid rgba(218, 193, 185, 0.12)",
      }}
    >
      {plan.completed ? (
        <CheckCircle2 size={16} style={{ color: "#6B8E6B", flexShrink: 0 }} />
      ) : (
        <Circle size={16} style={{ color: "#D1D5DB", flexShrink: 0 }} />
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <span
          style={{
            fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
            fontSize: 12,
            fontWeight: 600,
            color: "#93452A",
            marginRight: 8,
          }}
        >
          {plan.id}
        </span>
        <span
          style={{
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontSize: 13,
            color: "#1B1C1B",
          }}
        >
          {plan.description}
        </span>
      </div>

      <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
        {plan.hasPlanFile && (
          <button
            onClick={() => onViewFile(`${phaseDir}/${plan.id}-PLAN.md`)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "4px 8px",
              border: "none",
              borderRadius: 4,
              backgroundColor: "#F6F3F1",
              color: "#5E5E65",
              fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
              fontSize: 11,
              cursor: "pointer",
              transition: "all 150ms ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#FFDBCF"; e.currentTarget.style.color = "#390C00"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#F6F3F1"; e.currentTarget.style.color = "#5E5E65"; }}
          >
            <FileText size={12} /> Plan
          </button>
        )}
        {plan.hasSummaryFile && (
          <button
            onClick={() => onViewFile(`${phaseDir}/${plan.id}-SUMMARY.md`)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "4px 8px",
              border: "none",
              borderRadius: 4,
              backgroundColor: "#F6F3F1",
              color: "#5E5E65",
              fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
              fontSize: 11,
              cursor: "pointer",
              transition: "all 150ms ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#FFDBCF"; e.currentTarget.style.color = "#390C00"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#F6F3F1"; e.currentTarget.style.color = "#5E5E65"; }}
          >
            <FileText size={12} /> Summary
          </button>
        )}
      </div>
    </div>
  );
}

export function PhaseDetail({ phase, onViewFile }: PhaseDetailProps) {
  const [criteriaExpanded, setCriteriaExpanded] = useState(false);

  const statusLabel = phase.status === "complete" ? "Complete" : phase.status === "in-progress" ? "In Progress" : "Not Started";
  const statusColor = phase.status === "complete" ? "#6B8E6B" : phase.status === "in-progress" ? "#93452A" : "#9C9CA0";

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid rgba(218, 193, 185, 0.2)",
        borderRadius: 12,
        padding: 24,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span
              style={{
                fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                fontSize: 12,
                fontWeight: 600,
                color: statusColor,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Phase {phase.number}
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                padding: "2px 8px",
                borderRadius: 4,
                backgroundColor: phase.status === "complete" ? "#F0F7F0" : phase.status === "in-progress" ? "#FFF8F5" : "#F6F3F1",
                color: statusColor,
              }}
            >
              {statusLabel}
            </span>
            {phase.completedDate && (
              <span
                style={{
                  fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                  fontSize: 11,
                  color: "#9C9CA0",
                }}
              >
                {phase.completedDate}
              </span>
            )}
          </div>
          <h3
            style={{
              fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
              fontWeight: 700,
              fontSize: 18,
              color: "#1B1C1B",
              margin: 0,
            }}
          >
            {phase.name}
          </h3>
        </div>

        {/* Phase file links */}
        {phase.phaseDir && (
          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={() => onViewFile(`${phase.phaseDir}/${String(phase.number).padStart(2, "0")}-CONTEXT.md`)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "6px 10px",
                border: "none",
                borderRadius: 6,
                backgroundColor: "#F6F3F1",
                color: "#5E5E65",
                fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
                fontSize: 11,
                cursor: "pointer",
                transition: "all 150ms ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#FFDBCF"; e.currentTarget.style.color = "#390C00"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#F6F3F1"; e.currentTarget.style.color = "#5E5E65"; }}
            >
              <FileText size={12} /> Context
            </button>
          </div>
        )}
      </div>

      {/* Goal */}
      <div style={{ marginBottom: 20 }}>
        <p
          style={{
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontSize: 14,
            color: "#5E5E65",
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          {phase.goal}
        </p>
      </div>

      {/* Metadata chips */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
        {phase.dependsOn && (
          <span
            style={{
              fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
              fontSize: 11,
              color: "#5E5E65",
              backgroundColor: "#F6F3F1",
              padding: "4px 10px",
              borderRadius: 4,
            }}
          >
            Depends: {phase.dependsOn}
          </span>
        )}
        {phase.requirements.length > 0 && (
          <span
            style={{
              fontFamily: "var(--font-space-grotesk), Space Grotesk, sans-serif",
              fontSize: 11,
              color: "#5E5E65",
              backgroundColor: "#F6F3F1",
              padding: "4px 10px",
              borderRadius: 4,
            }}
          >
            {phase.requirements.length} requirements
          </span>
        )}
      </div>

      {/* Success Criteria (collapsible) */}
      {phase.successCriteria.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <button
            onClick={() => setCriteriaExpanded(!criteriaExpanded)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontSize: 13,
              fontWeight: 600,
              color: "#1B1C1B",
              padding: 0,
              marginBottom: criteriaExpanded ? 8 : 0,
            }}
          >
            {criteriaExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            Success Criteria ({phase.successCriteria.length})
          </button>
          {criteriaExpanded && (
            <div style={{ paddingLeft: 20 }}>
              {phase.successCriteria.map((sc, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 8,
                    padding: "4px 0",
                    fontFamily: "var(--font-inter), Inter, sans-serif",
                    fontSize: 13,
                    color: "#5E5E65",
                    lineHeight: 1.5,
                  }}
                >
                  <span style={{ color: "#9C9CA0", flexShrink: 0 }}>{i + 1}.</span>
                  <span>{sc}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Plans */}
      <div>
        <h4
          style={{
            fontFamily: "var(--font-inter), Inter, sans-serif",
            fontSize: 13,
            fontWeight: 600,
            color: "#1B1C1B",
            margin: "0 0 8px",
          }}
        >
          Plans ({phase.plansComplete}/{phase.plansTotal})
        </h4>
        <div>
          {phase.plans.map((plan) => (
            <PlanRow key={plan.id} plan={plan} phaseDir={phase.phaseDir} onViewFile={onViewFile} />
          ))}
          {phase.plans.length === 0 && (
            <p
              style={{
                fontFamily: "var(--font-inter), Inter, sans-serif",
                fontSize: 13,
                color: "#9C9CA0",
                fontStyle: "italic",
              }}
            >
              No plans created yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
