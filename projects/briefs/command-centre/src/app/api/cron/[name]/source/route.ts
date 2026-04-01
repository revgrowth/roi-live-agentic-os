import { NextRequest, NextResponse } from "next/server";
import { getRawJobFile } from "@/lib/cron-service";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const content = getRawJobFile(name);

    if (content === null) {
      return NextResponse.json({ error: "Cron job file not found" }, { status: 404 });
    }

    return NextResponse.json({ content });
  } catch (error) {
    console.error("GET /api/cron/[name]/source error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
