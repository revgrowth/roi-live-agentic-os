#!/usr/bin/env node
// Stop hook — logs Claude's response and marks task as "review"
// Stop fires after EVERY turn with `last_assistant_message` containing Claude's response.
// The UserPromptSubmit hook flips status back to "running" when the user replies.
// Fire-and-forget: spawns background process so it doesn't block

const fs = require("fs");
const path = require("path");
const os = require("os");
const { spawn } = require("child_process");

let input = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => (input += chunk));
process.stdin.on("end", () => {
  let data;
  try {
    data = JSON.parse(input);
  } catch {
    return;
  }

  const sessionId = data.session_id;
  if (!sessionId) return;

  const tmpFile = path.join(os.tmpdir(), "cc-session-" + sessionId + ".json");
  let mapping;
  try {
    mapping = JSON.parse(fs.readFileSync(tmpFile, "utf8"));
  } catch {
    return;
  }

  const { taskId, port } = mapping;
  if (!taskId) return;

  const safePort = JSON.stringify(String(port || "3000"));
  const response = data.last_assistant_message || "";
  // Truncate for log entry (keep it reasonable)
  const logContent = response.length > 4000 ? response.slice(0, 3997) + "..." : response;

  // Spawn background process for API calls
  const child = spawn(
    process.execPath,
    [
      "-e",
      `
    const http = require("http");

    // 1. Update status to review
    const statusPayload = JSON.stringify({ status: "review", activityLabel: "Waiting for input" });

    const statusReq = http.request({
      hostname: "localhost",
      port: ${safePort},
      path: "/api/tasks/${taskId}/status",
      method: "PATCH",
      headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(statusPayload) },
      timeout: 5000,
    }, () => {});
    statusReq.on("error", () => {});
    statusReq.on("timeout", () => statusReq.destroy());
    statusReq.write(statusPayload);
    statusReq.end();

    // 2. Log Claude's response as a text entry
    const responseText = ${JSON.stringify(logContent)};
    if (responseText) {
      const logPayload = JSON.stringify({
        type: "text",
        content: responseText,
      });

      const logReq = http.request({
        hostname: "localhost",
        port: ${safePort},
        path: "/api/tasks/${taskId}/logs",
        method: "POST",
        headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(logPayload) },
        timeout: 5000,
      }, () => {});
      logReq.on("error", () => {});
      logReq.on("timeout", () => logReq.destroy());
      logReq.write(logPayload);
      logReq.end();
    }
  `,
    ],
    {
      stdio: "ignore",
      windowsHide: true,
      detached: true,
    }
  );

  child.unref();
});
