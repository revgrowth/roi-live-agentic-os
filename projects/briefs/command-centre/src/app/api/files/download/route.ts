import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { getConfig } from "@/lib/config";

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

  const fileBuffer = fs.readFileSync(resolvedPath);
  const fileName = path.basename(resolvedPath);

  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Content-Type": "application/octet-stream",
    },
  });
}
