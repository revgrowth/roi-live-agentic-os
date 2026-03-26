import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import type { Task } from "@/types/task";

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "100", 10), 500);
    const offset = parseInt(searchParams.get("offset") || "0", 10);
    const clientId = searchParams.get("clientId");

    const conditions: string[] = [];
    const params: unknown[] = [];

    // Only completed/review tasks (history = things that ran)
    conditions.push("status IN ('done', 'review')");

    if (clientId && clientId !== "root") {
      conditions.push("clientId = ?");
      params.push(clientId);
    }

    const where = conditions.length > 0 ? ` WHERE ${conditions.join(" AND ")}` : "";

    const rows = db
      .prepare(
        `SELECT * FROM tasks${where} ORDER BY COALESCE(completedAt, updatedAt) DESC LIMIT ? OFFSET ?`
      )
      .all(...params, limit, offset) as Task[];

    const countRow = db
      .prepare(`SELECT COUNT(*) as total FROM tasks${where}`)
      .get(...params) as { total: number };

    const tasks = rows.map((t) => ({ ...t, needsInput: Boolean(t.needsInput) }));

    return NextResponse.json({ tasks, total: countRow.total });
  } catch (error) {
    console.error("GET /api/tasks/history error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
