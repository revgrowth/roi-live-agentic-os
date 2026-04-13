const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const cronRuntime = require("./cron-runtime.js");

function makeTempWorkspace() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "command-centre-cron-runtime-"));
}

function cleanupTempWorkspace(workspaceDir) {
  fs.rmSync(workspaceDir, { recursive: true, force: true });
}

test("buildRecoveredCronRunUpdate preserves inferred recovery truth", () => {
  const recovery = cronRuntime.buildRecoveredCronRunUpdate("recovered_from_stuck_needs_input", {
    durationMs: 4500,
    costUsd: 2.5,
  });

  assert.equal(recovery.resultSource, "inferred");
  assert.equal(recovery.result, "failure");
  assert.equal(recovery.completionReason, "recovered_from_stuck_needs_input");
  assert.equal(recovery.durationSec, 5);
  assert.equal(recovery.costUsd, 2.5);
  assert.equal(recovery.exitCode, 1);
});

test("getManagedRuntimeStatus treats a stale lock plus live daemon pid as stale ownership", () => {
  const workspaceDir = makeTempWorkspace();

  try {
    const { lockPath } = cronRuntime.getRuntimePaths(workspaceDir);
    fs.mkdirSync(path.dirname(lockPath), { recursive: true });
    cronRuntime.writeDaemonPid(workspaceDir, process.pid);

    const staleHeartbeat = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    fs.writeFileSync(
      lockPath,
      JSON.stringify(
        {
          runtime: "daemon",
          leader: true,
          identifier: "daemon-stale",
          pid: process.pid,
          startedAt: staleHeartbeat,
          heartbeatAt: staleHeartbeat,
          workspaceCount: 1,
          startCommand: "start",
          stopCommand: "stop",
        },
        null,
        2
      ),
      "utf-8"
    );

    const status = cronRuntime.getManagedRuntimeStatus(workspaceDir);

    assert.equal(status.leaderState, "stale");
    assert.equal(status.runtime, "daemon");
    assert.equal(status.leader, false);
    assert.equal(status.ownershipReason, "stale-leader-record");
    assert.equal(status.identifier, "daemon-stale");
    assert.equal(status.pid, process.pid);
  } finally {
    cleanupTempWorkspace(workspaceDir);
  }
});

test("getManagedRuntimeStatus treats the local identifier as leader only when the lock matches", () => {
  const workspaceDir = makeTempWorkspace();

  try {
    cronRuntime.claimRuntimeLeadership(workspaceDir, {
      runtime: "in-process",
      identifier: "in-process-123",
      pid: process.pid,
      workspaceCount: 1,
      startedAt: new Date().toISOString(),
    });

    const status = cronRuntime.getManagedRuntimeStatus(workspaceDir, "in-process-123");

    assert.equal(status.leaderState, "active");
    assert.equal(status.runtime, "in-process");
    assert.equal(status.leader, true);
    assert.equal(status.ownershipReason, "local-leader-active");
    assert.equal(status.identifier, "in-process-123");
  } finally {
    cleanupTempWorkspace(workspaceDir);
  }
});
