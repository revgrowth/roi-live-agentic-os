import { NextRequest, NextResponse } from "next/server";
import { getCronJobLog } from "@/lib/cron-service";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const log = getCronJobLog(name);
    return NextResponse.json({ log });
  } catch (error) {
    console.error("GET /api/cron/[name]/logs error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
