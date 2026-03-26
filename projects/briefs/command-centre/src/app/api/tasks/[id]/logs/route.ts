import { NextRequest, NextResponse } from "next/server";
import { processManager } from "@/lib/process-manager";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const entries = processManager.getLogEntries(id);
  return NextResponse.json(entries);
}
