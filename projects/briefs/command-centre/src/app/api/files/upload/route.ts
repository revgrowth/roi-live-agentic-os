import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { getConfig } from "@/lib/config";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const ALLOWED_EXTENSIONS = new Set([
  "png", "jpg", "jpeg", "gif", "webp", "svg",
  "pdf",
  "md", "txt", "csv", "json", "html", "log",
  "yaml", "yml", "sh", "ts", "js", "py",
]);

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const targetDir = formData.get("dir") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { error: `File type .${ext} is not allowed` },
        { status: 400 }
      );
    }

    // Default to projects/ directory
    const dir = targetDir || "projects";

    // Path traversal protection
    if (dir.includes("..")) {
      return NextResponse.json({ error: "Path traversal not allowed" }, { status: 403 });
    }

    const config = getConfig();
    const resolvedDir = path.resolve(config.agenticOsDir, dir);

    if (!resolvedDir.startsWith(config.agenticOsDir)) {
      return NextResponse.json({ error: "Path traversal not allowed" }, { status: 403 });
    }

    // Ensure directory exists
    fs.mkdirSync(resolvedDir, { recursive: true });

    // Sanitize filename: keep only safe chars
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const resolvedPath = path.join(resolvedDir, safeName);

    // Write file
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(resolvedPath, buffer);

    const relativePath = path.relative(config.agenticOsDir, resolvedPath);

    return NextResponse.json({
      fileName: safeName,
      filePath: resolvedPath,
      relativePath,
      extension: ext,
      sizeBytes: file.size,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
