import { NextResponse } from "next/server";
import { detectClients } from "../../../lib/clients";

export async function GET() {
  try {
    const clients = detectClients();
    return NextResponse.json(clients);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to detect clients";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
