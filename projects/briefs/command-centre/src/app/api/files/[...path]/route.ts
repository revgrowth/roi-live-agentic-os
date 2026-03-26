import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "@/lib/file-service";

const ALLOWED_ROOTS = ["context", "brand_context"];

function validateFilePath(segments: string[]): string | null {
  const filePath = segments.join("/");
  const isAllowed = ALLOWED_ROOTS.some(
    (root) => filePath === root || filePath.startsWith(root + "/")
  );
  if (!isAllowed) return null;
  return filePath;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: segments } = await params;
    const filePath = validateFilePath(segments);
    if (!filePath) {
      return NextResponse.json(
        { error: "Access denied: only context and brand_context files are accessible" },
        { status: 403 }
      );
    }

    const file = readFile(filePath);
    return NextResponse.json(file);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    const status = message.includes("not found") ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: segments } = await params;
    const filePath = validateFilePath(segments);
    if (!filePath) {
      return NextResponse.json(
        { error: "Access denied: only context and brand_context files are accessible" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { content, lastModified } = body as { content: string; lastModified?: string };

    if (typeof content !== "string") {
      return NextResponse.json(
        { error: "content is required and must be a string" },
        { status: 400 }
      );
    }

    const result = writeFile(filePath, content, lastModified);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    const status = message.includes("modified since you loaded") ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
