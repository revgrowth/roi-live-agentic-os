import { NextRequest, NextResponse } from "next/server";
import { getCronJob, updateCronJob } from "@/lib/cron-service";

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const current = getCronJob(name);

    if (!current) {
      return NextResponse.json({ error: "Cron job not found" }, { status: 404 });
    }

    const updated = updateCronJob(name, { active: !current.active });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/cron/[name]/toggle error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
