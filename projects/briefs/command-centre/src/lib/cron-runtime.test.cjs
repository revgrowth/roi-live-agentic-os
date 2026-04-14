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
  try {
    cronRuntime.getDb(workspaceDir).close();
  } catch {
    // Best-effort cleanup for tests only.
  }
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

test("completeCronRunForTask updates the existing running row instead of inserting a second row", () => {
  const workspaceDir = makeTempWorkspace();
  const db = cronRuntime.getDb(workspaceDir);
  const startedAt = new Date().toISOString();
  const completedAt = new Date(Date.now() + 5_000).toISOString();
  const taskId = "task-complete-existing-row";

  try {
    db.prepare(
      `INSERT INTO tasks (
        id, title, description, status, level, parentId, columnOrder, createdAt, updatedAt,
        costUsd, tokensUsed, durationMs, activityLabel, errorMessage, startedAt, completedAt,
        clientId, needsInput, phaseNumber, gsdStep, cronJobSlug, permissionMode
      ) VALUES (?, ?, ?, 'done', 'task', NULL, 0, ?, ?, NULL, NULL, NULL, NULL, NULL, ?, NULL, NULL, 0, NULL, NULL, ?, 'default')`
    ).run(
      taskId,
      "Complete cron row",
      "Uses the runtime helper",
      startedAt,
      startedAt,
      startedAt,
      "existing-row-job"
    );

    db.prepare(
      `INSERT INTO cron_runs (jobSlug, taskId, startedAt, result, trigger, clientId, scheduledFor)
       VALUES (?, ?, ?, 'running', 'manual', NULL, ?)`
    ).run("existing-row-job", taskId, startedAt, startedAt);

    const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(taskId);

    cronRuntime.completeCronRunForTask(workspaceDir, task, {
      result: "success",
      exitCode: 0,
      durationMs: 4200,
      costUsd: 1.25,
      completedAt,
      trigger: "manual",
    });

    const rows = db
      .prepare(
        `SELECT result, durationSec, costUsd, exitCode, trigger
         FROM cron_runs
         WHERE taskId = ?`
      )
      .all(taskId);

    assert.equal(rows.length, 1);
    assert.equal(rows[0].result, "success");
    assert.equal(rows[0].durationSec, 4);
    assert.equal(rows[0].costUsd, 1.25);
    assert.equal(rows[0].exitCode, 0);
    assert.equal(rows[0].trigger, "manual");
  } finally {
    cleanupTempWorkspace(workspaceDir);
  }
});

test("scheduled retry attempts are capped at exactly twice even when retry is higher", async () => {
  const workspaceDir = makeTempWorkspace();
  const jobsDir = path.join(workspaceDir, "cron", "jobs");
  const wrapperPath = path.join(workspaceDir, "fake-claude.cmd");
  const attemptsPath = path.join(workspaceDir, "attempt-count.txt");
  const scheduledFor = new Date().toISOString();
  const originalClaudeBin = process.env.AGENTIC_OS_CLAUDE_BIN;

  try {
    fs.writeFileSync(path.join(workspaceDir, "AGENTS.md"), "# test workspace\n", "utf-8");
    fs.mkdirSync(jobsDir, { recursive: true });
    fs.writeFileSync(
      path.join(jobsDir, "retry-cap-job.md"),
      [
        "---",
        "name: Retry Cap Job",
        "time: 00:00",
        "days: daily",
        "active: true",
        "model: sonnet",
        "timeout: 30s",
        "retry: 5",
        "---",
        "",
        "Fail on purpose so the scheduler retry cap can be measured.",
        "",
      ].join("\n"),
      "utf-8"
    );
    fs.writeFileSync(
      wrapperPath,
      [
        "@echo off",
        "setlocal EnableDelayedExpansion",
        "set COUNT=0",
        "if exist attempt-count.txt set /p COUNT=<attempt-count.txt",
        "set /a COUNT+=1",
        "> attempt-count.txt echo !COUNT!",
        "exit /b 1",
        "",
      ].join("\r\n"),
      "utf-8"
    );

    process.env.AGENTIC_OS_CLAUDE_BIN = wrapperPath;

    const job = cronRuntime.getCronJob(workspaceDir, "retry-cap-job", null);
    const queued = cronRuntime.enqueueCronJob(workspaceDir, job, {
      trigger: "scheduled",
      scheduledFor,
    });

    const result = await cronRuntime.executeCronTask(workspaceDir, queued.task.id);
    const attempts = Number(fs.readFileSync(attemptsPath, "utf-8").trim());
    const cronRun = cronRuntime
      .getDb(workspaceDir)
      .prepare("SELECT result, trigger FROM cron_runs WHERE taskId = ?")
      .get(queued.task.id);

    assert.equal(result.result, "failure");
    assert.equal(attempts, 2);
    assert.equal(cronRun.result, "failure");
    assert.equal(cronRun.trigger, "scheduled");
  } finally {
    if (originalClaudeBin === undefined) {
      delete process.env.AGENTIC_OS_CLAUDE_BIN;
    } else {
      process.env.AGENTIC_OS_CLAUDE_BIN = originalClaudeBin;
    }
    cleanupTempWorkspace(workspaceDir);
  }
});

test("resolveWindowsClaudeLaunchPlan keeps plain claude and exe paths on the direct launch path", () => {
  const bashPath = path.join(os.tmpdir(), "cron-runtime-test-bash.exe");

  try {
    fs.writeFileSync(bashPath, "", "utf-8");
    cronRuntime.setCronRuntimeTestHooks({
      findCommandOnPath(command) {
        if (command === "claude" || command === "claude.exe") {
          return "C:\\Users\\gmsal\\.local\\bin\\claude.exe";
        }
        if (command === "bash.exe" || command === "bash") {
          return bashPath;
        }
        return null;
      },
    });

    const plainPlan = cronRuntime.resolveWindowsClaudeLaunchPlan({
      claudeCommand: "claude",
      env: {},
    });
    const exePlan = cronRuntime.resolveWindowsClaudeLaunchPlan({
      claudeCommand: "C:\\Users\\gmsal\\.local\\bin\\claude.exe",
      env: {},
    });

    assert.equal(plainPlan.mode, "direct");
    assert.equal(plainPlan.env.CLAUDE_CODE_GIT_BASH_PATH, bashPath);
    assert.equal(exePlan.mode, "direct");
    assert.equal(exePlan.command, "C:\\Users\\gmsal\\.local\\bin\\claude.exe");
  } finally {
    cronRuntime.resetCronRuntimeTestHooks();
    fs.rmSync(bashPath, { force: true });
  }
});

test("resolveWindowsClaudeLaunchPlan uses the wrapper path for .cmd overrides", () => {
  const bashPath = path.join(os.tmpdir(), "cron-runtime-test-wrapper-bash.exe");

  try {
    fs.writeFileSync(bashPath, "", "utf-8");
    cronRuntime.setCronRuntimeTestHooks({
      findCommandOnPath(command) {
        if (command === "bash.exe" || command === "bash") {
          return bashPath;
        }
        return null;
      },
    });

    const launchPlan = cronRuntime.resolveWindowsClaudeLaunchPlan({
      claudeCommand: "C:\\tools\\fake-claude.cmd",
      env: {},
    });

    assert.equal(launchPlan.mode, "wrapper");
    assert.equal(launchPlan.extension, ".cmd");
    assert.equal(launchPlan.env.CLAUDE_CODE_GIT_BASH_PATH, bashPath);
  } finally {
    cronRuntime.resetCronRuntimeTestHooks();
    fs.rmSync(bashPath, { force: true });
  }
});

test("resolveGitBashPath preserves CLAUDE_CODE_GIT_BASH_PATH or discovers bash.exe", () => {
  const discoveredBashPath = path.join(os.tmpdir(), "cron-runtime-test-discovered-bash.exe");

  try {
    fs.writeFileSync(discoveredBashPath, "", "utf-8");
    cronRuntime.setCronRuntimeTestHooks({
      findCommandOnPath(command) {
        if (command === "bash.exe" || command === "bash") {
          return discoveredBashPath;
        }
        return null;
      },
    });

    assert.equal(
      cronRuntime.resolveGitBashPath({
        CLAUDE_CODE_GIT_BASH_PATH: "C:\\Custom\\Git\\bin\\bash.exe",
      }),
      "C:\\Custom\\Git\\bin\\bash.exe"
    );
    assert.equal(cronRuntime.resolveGitBashPath({}), discoveredBashPath);
  } finally {
    cronRuntime.resetCronRuntimeTestHooks();
    fs.rmSync(discoveredBashPath, { force: true });
  }
});
