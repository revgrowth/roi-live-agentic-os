import { NextRequest, NextResponse } from "next/server";
import { processManager } from "@/lib/process-manager";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let body: { message?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { message } = body;

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }

  const success = await processManager.replyToTask(id, message.trim());
  if (!success) {
    return NextResponse.json(
      { error: "Task is not running or stdin unavailable" },
      { status: 409 }
    );
  }

  return NextResponse.json({ ok: true });
}
