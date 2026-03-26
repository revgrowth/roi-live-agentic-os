import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getConfig, getClientAgenticOsDir } from "@/lib/config";
import type { ProjectBrief } from "@/types/project";

/**
 * GET /api/projects?clientId=xxx
 * Scans projects/briefs/{name}/brief.md and returns parsed project metadata.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get("clientId");

    const baseDir = clientId && clientId !== "root"
      ? getClientAgenticOsDir(clientId)
      : getConfig().agenticOsDir;

    const briefsDir = path.join(baseDir, "projects", "briefs");

    if (!fs.existsSync(briefsDir)) {
      return NextResponse.json([]);
    }

    const entries = fs.readdirSync(briefsDir, { withFileTypes: true });
    const projects: ProjectBrief[] = [];

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const briefPath = path.join(briefsDir, entry.name, "brief.md");
      if (!fs.existsSync(briefPath)) continue;

      const content = fs.readFileSync(briefPath, "utf-8");
      const parsed = parseBriefFrontmatter(content, entry.name, briefPath);
      if (parsed) {
        projects.push(parsed);
      }
    }

    // Sort by created date, most recent first
    projects.sort((a, b) => b.created.localeCompare(a.created));

    return NextResponse.json(projects);
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function parseBriefFrontmatter(content: string, slug: string, briefPath: string): ProjectBrief | null {
  // Extract YAML frontmatter between --- delimiters
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const frontmatter = match[1];
  const fields: Record<string, string> = {};

  for (const line of frontmatter.split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim();
    fields[key] = value;
  }

  // Extract goal from the body (first line after "## Goal")
  let goal: string | null = null;
  const goalMatch = content.match(/## Goal\s*\n+(.+)/);
  if (goalMatch) {
    goal = goalMatch[1].trim();
  }

  // Convert slug to display name: "command-centre" -> "Command Centre"
  const name = fields.project
    || slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  return {
    slug,
    name,
    status: fields.status || "unknown",
    level: parseInt(fields.level || "2", 10),
    created: fields.created || "",
    goal,
    path: briefPath,
  };
}
