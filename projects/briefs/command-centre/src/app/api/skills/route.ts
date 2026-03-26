import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getClientAgenticOsDir } from "@/lib/config";

export interface SkillEntry {
  name: string;
  folder: string;
  description: string;
  triggers: string;
  category: string;
}

function parseSkillFrontmatter(content: string): Record<string, string> {
  const result: Record<string, string> = {};
  const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) return result;

  const lines = match[1].split("\n");
  for (const line of lines) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim();
    result[key] = value;
  }
  return result;
}

function extractCategory(folder: string): string {
  const match = folder.match(/^([a-z]+)-/);
  return match ? match[1] : "general";
}

export async function GET(request: NextRequest) {
  try {
    const clientId = request.nextUrl.searchParams.get("clientId");
    const baseDir = getClientAgenticOsDir(clientId);
    const skillsDir = path.join(baseDir, ".claude", "skills");

    if (!fs.existsSync(skillsDir)) {
      return NextResponse.json([]);
    }

    const entries = fs.readdirSync(skillsDir, { withFileTypes: true });
    const skills: SkillEntry[] = [];

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (entry.name.startsWith("_")) continue; // skip _catalog etc.

      const skillMdPath = path.join(skillsDir, entry.name, "SKILL.md");
      let description = "";
      let triggers = "";

      if (fs.existsSync(skillMdPath)) {
        try {
          const content = fs.readFileSync(skillMdPath, "utf-8");
          const frontmatter = parseSkillFrontmatter(content);
          description = frontmatter.description || "";
          triggers = frontmatter.triggers || "";
        } catch {
          // Skill file unreadable -- continue with empty metadata
        }
      }

      skills.push({
        name: entry.name,
        folder: entry.name,
        description,
        triggers,
        category: extractCategory(entry.name),
      });
    }

    return NextResponse.json(skills);
  } catch (error) {
    console.error("GET /api/skills error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
