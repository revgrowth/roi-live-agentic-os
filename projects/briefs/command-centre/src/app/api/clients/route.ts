import { NextResponse } from "next/server";
import { detectClients, getRootName } from "../../../lib/clients";

export async function GET() {
  try {
    const clients = detectClients();
    const rootName = getRootName();
    return NextResponse.json({ clients, rootName });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to detect clients";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
