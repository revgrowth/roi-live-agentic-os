import { NextRequest, NextResponse } from "next/server";
import { getCronRunHistory } from "@/lib/cron-service";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const history = getCronRunHistory(name);
    return NextResponse.json(history);
  } catch (error) {
    console.error("GET /api/cron/[name]/history error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
