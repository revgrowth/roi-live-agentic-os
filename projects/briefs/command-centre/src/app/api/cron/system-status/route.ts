import { NextResponse } from "next/server";
import { getConfig } from "@/lib/config";
import { getCronSystemStatus } from "@/lib/cron-system-status";

export async function GET() {
  try {
    return NextResponse.json(getCronSystemStatus(getConfig().agenticOsDir));
  } catch (error) {
    console.error("GET /api/cron/system-status error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
