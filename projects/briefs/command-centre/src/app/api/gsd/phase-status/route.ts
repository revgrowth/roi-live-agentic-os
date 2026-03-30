import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getConfig } from "@/lib/config";

/**
 * PATCH /api/gsd/phase-status
 * Body: { phaseNumber: number, status: "complete" | "in-progress" | "not-started" }
 *
 * Updates the ## Progress table in ROADMAP.md and the phase checklist.
 */
export async function PATCH(request: NextRequest) {
  try {
    const { phaseNumber, status } = (await request.json()) as {
      phaseNumber: number;
      status: "complete" | "in-progress" | "not-started";
    };

    if (!phaseNumber || !status) {
      return NextResponse.json({ error: "phaseNumber and status required" }, { status: 400 });
    }

    const { agenticOsDir } = getConfig();
    const roadmapPath = path.join(agenticOsDir, ".planning", "ROADMAP.md");

    if (!fs.existsSync(roadmapPath)) {
      return NextResponse.json({ error: "ROADMAP.md not found" }, { status: 404 });
    }

    let content = fs.readFileSync(roadmapPath, "utf-8");
    const today = new Date().toISOString().slice(0, 10);

    // 1. Update the ## Progress table row for this phase
    const progressTableRegex = new RegExp(
      `^(\\|\\s*${phaseNumber}\\.\\s*.+?\\|.+?\\|)\\s*([^|]+?)\\s*\\|\\s*([^|]+?)\\s*\\|`,
      "m"
    );
    const progressMatch = content.match(progressTableRegex);
    if (progressMatch) {
      const statusText = status === "complete" ? "Complete" : status === "in-progress" ? "In Progress" : "Not Started";
      const dateText = status === "complete" ? today : "-";
      content = content.replace(
        progressTableRegex,
        `${progressMatch[1]} ${statusText} | ${dateText} |`
      );
    }

    // 2. Update the phase checklist line: - [x] **Phase N: or - [ ] **Phase N:
    const checklistRegex = new RegExp(
      `^- \\[[ x]\\] (\\*\\*Phase ${phaseNumber}:.+)$`,
      "m"
    );
    const checklistMatch = content.match(checklistRegex);
    if (checklistMatch) {
      const check = status === "complete" ? "x" : " ";
      let line = `- [${check}] ${checklistMatch[1]}`;
      // Add/update completion date for complete phases
      if (status === "complete") {
        // Remove any existing date annotation
        line = line.replace(/\s*\(completed [^)]+\)\s*$/, "");
        line += ` (completed ${today})`;
      }
      content = content.replace(checklistRegex, line);
    }

    fs.writeFileSync(roadmapPath, content);

    return NextResponse.json({ success: true, phaseNumber, status });
  } catch (error) {
    console.error("PATCH /api/gsd/phase-status error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
