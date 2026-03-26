import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { getConfig } from "@/lib/config";

const MAX_PREVIEW_SIZE = 1024 * 1024; // 1MB

const TEXT_EXTENSIONS = new Set(["md", "txt", "csv", "json", "html", "log"]);
const IMAGE_EXTENSIONS = new Set(["png", "jpg", "jpeg", "gif", "webp", "svg", "ico"]);
const BINARY_PREVIEW_EXTENSIONS = new Set(["pdf"]);

const MIME_TYPES: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
  ico: "image/x-icon",
  pdf: "application/pdf",
};

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

  // Check file exists
  if (!fs.existsSync(resolvedPath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const ext = path.extname(resolvedPath).replace(".", "").toLowerCase();
  const stat = fs.statSync(resolvedPath);

  // Binary preview: serve the raw file with proper content-type
  if (IMAGE_EXTENSIONS.has(ext) || BINARY_PREVIEW_EXTENSIONS.has(ext)) {
    const mimeType = MIME_TYPES[ext] || "application/octet-stream";
    const fileBuffer = fs.readFileSync(resolvedPath);
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": mimeType,
        "Content-Length": stat.size.toString(),
        "Cache-Control": "private, max-age=300",
      },
    });
  }

  // Text preview
  if (!TEXT_EXTENSIONS.has(ext)) {
    return NextResponse.json(
      { error: `Extension .${ext} is not previewable` },
      { status: 400 }
    );
  }

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
