import { NextRequest, NextResponse } from "next/server";
import { listDirectory } from "@/lib/file-service";

const ALLOWED_ROOTS = ["context", "brand_context"];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dir = searchParams.get("dir");

    if (!dir) {
      return NextResponse.json(
        { error: "dir query parameter is required" },
        { status: 400 }
      );
    }

    // Validate that the requested directory starts with an allowed root
    const isAllowed = ALLOWED_ROOTS.some(
      (root) => dir === root || dir.startsWith(root + "/")
    );
    if (!isAllowed) {
      return NextResponse.json(
        { error: "Access denied: only context and brand_context directories are accessible" },
        { status: 403 }
      );
    }

    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    const nodes = listDirectory(dir, limit ? { limit } : undefined);
    return NextResponse.json(nodes);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    const status = message.includes("not found") ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
