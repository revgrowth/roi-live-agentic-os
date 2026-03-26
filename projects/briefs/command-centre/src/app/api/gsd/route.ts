import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getConfig } from "@/lib/config";
import { parseRoadmap } from "@/lib/gsd-parser";
import type { GsdProject } from "@/types/gsd";

function readFileOrNull(filePath: string): string | null {
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const { agenticOsDir } = getConfig();
    const planningDir = path.join(agenticOsDir, ".planning");

    if (!fs.existsSync(planningDir)) {
      return NextResponse.json({ hasPlanning: false } as Partial<GsdProject>);
    }

    const roadmapContent = readFileOrNull(path.join(planningDir, "ROADMAP.md"));
    const stateContent = readFileOrNull(path.join(planningDir, "STATE.md"));
    const projectContent = readFileOrNull(path.join(planningDir, "PROJECT.md"));

    if (!roadmapContent) {
      return NextResponse.json({ hasPlanning: false } as Partial<GsdProject>);
    }

    // Parse project name from ROADMAP header
    const nameMatch = roadmapContent.match(/^# Roadmap:\s*(.+)/m);
    const name = nameMatch ? nameMatch[1].trim() : "GSD Project";

    // Parse core value from PROJECT.md or STATE.md
    let coreValue = "";
    if (stateContent) {
      const cvMatch = stateContent.match(/\*\*Core value:\*\*\s*(.+)/);
      if (cvMatch) coreValue = cvMatch[1].trim();
    }
    if (!coreValue && projectContent) {
      const cvMatch = projectContent.match(/## Core Value\s*\n\s*(.+)/);
      if (cvMatch) coreValue = cvMatch[1].trim();
    }

    // Parse state
    let currentPhaseNumber = 1;
    let milestone = "v1.0";
    let lastUpdated = "";
    if (stateContent) {
      const phaseMatch = stateContent.match(/^Phase:\s*(\d+)/m);
      if (phaseMatch) currentPhaseNumber = parseInt(phaseMatch[1]);
      const milestoneMatch = stateContent.match(/^milestone:\s*(.+)/m);
      if (milestoneMatch) milestone = milestoneMatch[1].trim();
      const updatedMatch = stateContent.match(/^last_updated:\s*"?([^"\n]+)"?/m);
      if (updatedMatch) lastUpdated = updatedMatch[1].trim();
    }

    const phasesDir = path.join(planningDir, "phases");
    const phases = parseRoadmap(roadmapContent, phasesDir);

    const completedPhases = phases.filter((p) => p.status === "complete").length;

    const project: GsdProject = {
      name,
      coreValue,
      currentPhaseNumber,
      totalPhases: phases.length,
      completedPhases,
      milestone,
      lastUpdated,
      phases,
      hasPlanning: true,
    };

    return NextResponse.json(project);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
