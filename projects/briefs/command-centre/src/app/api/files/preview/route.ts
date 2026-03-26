import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { getConfig } from "@/lib/config";

const MAX_PREVIEW_SIZE = 1024 * 1024; // 1MB

const PREVIEWABLE_EXTENSIONS = new Set(["md", "txt", "csv", "json", "html", "log"]);

export async function GET(request: NextRequest): Promise<NextResponse> {
  const filePath = request.nextUrl.searchParams.get("path");

  if (!filePath) {
    return NextResponse.json({ error: "Missing path parameter" }, { status: 400 });
  }

  // Path traversal protection: reject paths containing ..
  if (filePath.includes("..")) {
    return NextResponse.json({ error: "Path traversal not allowed" }, { status: 403 });
  }

  const config = getConfig();
  const resolvedPath = path.resolve(config.agenticOsDir, filePath);

  // Path traversal protection: ensure resolved path is within agenticOsDir
  if (!resolvedPath.startsWith(config.agenticOsDir)) {
    return NextResponse.json({ error: "Path traversal not allowed" }, { status: 403 });
  }

  // Check extension is previewable
  const ext = path.extname(resolvedPath).replace(".", "").toLowerCase();
  if (!PREVIEWABLE_EXTENSIONS.has(ext)) {
    return NextResponse.json(
      { error: `Extension .${ext} is not previewable` },
      { status: 400 }
    );
  }

  // Check file exists
  if (!fs.existsSync(resolvedPath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const stat = fs.statSync(resolvedPath);

  // Check file size
  if (stat.size > MAX_PREVIEW_SIZE) {
    return NextResponse.json({
      content: null,
      truncated: true,
      size: stat.size,
      extension: ext,
    });
  }

  const content = fs.readFileSync(resolvedPath, "utf-8");

  return NextResponse.json({
    content,
    truncated: false,
    size: stat.size,
    extension: ext,
  });
}
