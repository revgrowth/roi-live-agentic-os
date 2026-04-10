import { NextRequest, NextResponse } from "next/server";
import {
  getCronJob,
  updateCronJob,
  deleteCronJob,
  getCronScheduleValidationError,
} from "@/lib/cron-service";
import type { CronJobUpdateInput } from "@/types/cron";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const job = getCronJob(name);

    if (!job) {
      return NextResponse.json({ error: "Cron job not found" }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error("GET /api/cron/[name] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const existing = getCronJob(name);
    if (!existing) {
      return NextResponse.json({ error: "Cron job not found" }, { status: 404 });
    }

    const body = (await request.json()) as CronJobUpdateInput;
    if (body.time !== undefined || body.days !== undefined) {
      const nextTime = body.time ?? existing.time;
      const nextDays = body.days ?? existing.days;
      const scheduleError = getCronScheduleValidationError(nextTime, nextDays);
      if (scheduleError) {
        return NextResponse.json({ error: scheduleError }, { status: 400 });
      }
    }

    const updated = updateCronJob(name, body);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/cron/[name] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const existing = getCronJob(name);
    if (!existing) {
      return NextResponse.json({ error: "Cron job not found" }, { status: 404 });
    }

    deleteCronJob(name);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("DELETE /api/cron/[name] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
