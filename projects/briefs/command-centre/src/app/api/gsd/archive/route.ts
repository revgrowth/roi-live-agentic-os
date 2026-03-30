import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getConfig } from "@/lib/config";

export async function POST(request: NextRequest) {
  try {
    const { slug } = (await request.json()) as { slug: string };
    if (!slug) {
      return NextResponse.json({ error: "slug is required" }, { status: 400 });
    }

    const baseDir = getConfig().agenticOsDir;
    const planningDir = path.join(baseDir, ".planning");
    const briefPath = path.join(baseDir, "projects", "briefs", slug, "brief.md");

    // Validate .planning/ exists
    if (!fs.existsSync(planningDir)) {
      return NextResponse.json(
        { error: "No .planning/ directory found" },
        { status: 404 }
      );
    }

    // Validate brief exists
    if (!fs.existsSync(briefPath)) {
      return NextResponse.json(
        { error: `No brief found at projects/briefs/${slug}/brief.md` },
        { status: 404 }
      );
    }

    const archiveDest = path.join(baseDir, "projects", "briefs", slug, "planning-archive");

    // Don't overwrite an existing archive
    if (fs.existsSync(archiveDest)) {
      return NextResponse.json(
        { error: "planning-archive/ already exists in this project" },
        { status: 409 }
      );
    }

    // Move .planning/ → projects/briefs/{slug}/planning-archive/
    fs.renameSync(planningDir, archiveDest);

    // Update brief frontmatter: status: active → status: complete
    let briefContent = fs.readFileSync(briefPath, "utf-8");
    briefContent = briefContent.replace(
      /^(---\n[\s\S]*?)status:\s*active([\s\S]*?\n---)/,
      "$1status: complete$2"
    );
    fs.writeFileSync(briefPath, briefContent);

    return NextResponse.json({
      success: true,
      archivePath: `projects/briefs/${slug}/planning-archive/`,
      message: `Archived .planning/ into ${slug} and marked brief as complete.`,
    });
  } catch (error) {
    console.error("POST /api/gsd/archive error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
