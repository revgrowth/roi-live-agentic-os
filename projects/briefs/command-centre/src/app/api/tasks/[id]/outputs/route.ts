import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import type { OutputFile } from "@/types/task";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;

  const db = getDb();

  // Verify task exists
  const task = db.prepare("SELECT id FROM tasks WHERE id = ?").get(id);
  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  const outputs = db
    .prepare("SELECT * FROM task_outputs WHERE taskId = ? ORDER BY createdAt ASC")
    .all(id) as OutputFile[];

  return NextResponse.json(outputs);
}
