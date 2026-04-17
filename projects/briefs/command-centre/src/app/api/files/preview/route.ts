import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { getClientAgenticOsDir } from "@/lib/config";

const MAX_PREVIEW_SIZE = 1024 * 1024; // 1MB

const IMAGE_EXTENSIONS = new Set(["png", "jpg", "jpeg", "gif", "webp", "svg", "ico"]);
const BINARY_EXTENSIONS = new Set(["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "zip", "tar", "gz", "mp4", "mp3", "wav", "ogg", "webm"]);
const RAW_TEXT_EXTENSIONS = new Set(["html", "htm"]);

const MIME_TYPES: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
  ico: "image/x-icon",
  pdf: "application/pdf",
  html: "text/html; charset=utf-8",
  htm: "text/html; charset=utf-8",
};

export async function GET(request: NextRequest): Promise<NextResponse> {
  const filePath = request.nextUrl.searchParams.get("path");
  const clientId = request.nextUrl.searchParams.get("clientId");

  if (!filePath) {
    return NextResponse.json({ error: "Missing path parameter" }, { status: 400 });
  }

  // Path traversal protection: reject paths containing ..
  if (filePath.includes("..")) {
    return NextResponse.json({ error: "Path traversal not allowed" }, { status: 403 });
  }

  const baseDir = getClientAgenticOsDir(clientId);
  const resolvedPath = path.resolve(baseDir, filePath);

  // Path traversal protection: ensure resolved path is within the active workspace
  if (!resolvedPath.startsWith(baseDir)) {
    return NextResponse.json({ error: "Path traversal not allowed" }, { status: 403 });
  }

  // Check file exists
  if (!fs.existsSync(resolvedPath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const ext = path.extname(resolvedPath).replace(".", "").toLowerCase();
  const stat = fs.statSync(resolvedPath);

  // Binary preview: serve the raw file with proper content-type (images, PDFs)
  if (IMAGE_EXTENSIONS.has(ext)) {
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

  // Non-previewable binary formats
  if (BINARY_EXTENSIONS.has(ext)) {
    return NextResponse.json(
      { error: `Binary file (.${ext}) — use download instead` },
      { status: 400 }
    );
  }

  // Raw HTML: serve as text/html so iframes can render it directly.
  // CSP prevents outbound navigation/scripts from escaping the iframe.
  if (RAW_TEXT_EXTENSIONS.has(ext)) {
    const html = fs.readFileSync(resolvedPath, "utf-8");
    return new NextResponse(html, {
      headers: {
        "Content-Type": MIME_TYPES[ext],
        "Cache-Control": "no-store",
        "Content-Security-Policy":
          "default-src 'self' data: blob: 'unsafe-inline' 'unsafe-eval' https: http:; frame-ancestors 'self';",
      },
    });
  }

  // Text preview: any extension not handled above is treated as text.
  // This covers md, txt, csv, json, log, xml, yaml, excalidraw, etc.
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
