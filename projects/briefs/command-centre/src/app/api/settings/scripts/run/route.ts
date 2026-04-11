import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getConfig } from "@/lib/config";
import { getScriptById } from "@/lib/script-registry";
import { spawnUiProcess } from "@/lib/subprocess";

const runningScripts = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { scriptId, args } = body as { scriptId: string; args?: Record<string, string> };

    if (!scriptId || typeof scriptId !== "string") {
      return NextResponse.json({ error: "scriptId is required" }, { status: 400 });
    }

    const script = getScriptById(scriptId);
    if (!script) {
      return NextResponse.json({ error: `Script not found: ${scriptId}` }, { status: 404 });
    }

    const config = getConfig();
    const scriptPath = path.join(config.agenticOsDir, "scripts", script.file);

    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json({ error: `Script file not found: ${script.file}` }, { status: 404 });
    }

    // Validate required args
    for (const argDef of script.args) {
      if (argDef.required && (!args || !args[argDef.name])) {
        return NextResponse.json(
          { error: `Missing required argument: ${argDef.label}` },
          { status: 400 }
        );
      }
    }

    // Check if script is already running
    if (runningScripts.has(scriptId)) {
      return NextResponse.json({ error: "Script already running" }, { status: 409 });
    }

    runningScripts.add(scriptId);

    // Build args array from definitions
    const argValues: string[] = [];
    for (const argDef of script.args) {
      if (args && args[argDef.name]) {
        argValues.push(args[argDef.name]);
      }
    }

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      start(controller) {
        const proc = spawnUiProcess("bash", [scriptPath, ...argValues], {
          cwd: config.agenticOsDir,
          stdio: ["pipe", "pipe", "pipe"],
        });

        if (proc.stdin) {
          proc.stdin.end();
        }

        const enqueue = (obj: Record<string, unknown>) => {
          try {
            controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));
          } catch {
            // Stream may have been closed by client
          }
        };

        if (proc.stdout) {
          proc.stdout.on("data", (chunk: Buffer) => {
            enqueue({ type: "stdout", data: chunk.toString() });
          });
        }

        if (proc.stderr) {
          proc.stderr.on("data", (chunk: Buffer) => {
            enqueue({ type: "stderr", data: chunk.toString() });
          });
        }

        proc.on("error", (err) => {
          enqueue({ type: "stderr", data: `Process error: ${err.message}` });
          enqueue({ type: "exit", code: 1 });
          runningScripts.delete(scriptId);
          controller.close();
        });

        proc.on("close", (code) => {
          enqueue({ type: "exit", code: code ?? 1 });
          runningScripts.delete(scriptId);
          controller.close();
        });
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "application/x-ndjson",
        "Cache-Control": "no-cache",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to execute script";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
