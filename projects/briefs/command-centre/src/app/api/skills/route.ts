import { NextResponse } from "next/server";
import { listSkills } from "@/lib/file-service";

export async function GET() {
  try {
    const skills = listSkills();
    return NextResponse.json(skills);
  } catch (error) {
    console.error("GET /api/skills error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
