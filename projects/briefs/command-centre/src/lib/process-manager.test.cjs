const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const ts = require("typescript");

const processManagerSourcePath = path.resolve(__dirname, "process-manager.ts");

function makeTempWorkspace() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "command-centre-process-manager-"));
}

function cleanupTempWorkspace(workspaceDir) {
  fs.rmSync(workspaceDir, { recursive: true, force: true });
}

function createFakeDb(task) {
  const state = {
    task: { ...task },
    logsDeleted: 0,
    outputsDeleted: 0,
  };

  function cloneTask() {
    return { ...state.task };
  }

  return {
    state,
    prepare(sql) {
      const normalized = sql.replace(/\s+/g, " ").trim();

      return {
        get(...args) {
          if (normalized.includes("SELECT * FROM tasks WHERE id = ?")) {
            return args[0] === state.task.id ? cloneTask() : undefined;
          }

          if (normalized.includes("SELECT COUNT(*) as count FROM tasks WHERE parentId = ?")) {
            return { count: 0 };
          }

          if (normalized.includes("SELECT gsdStep, phaseNumber FROM tasks WHERE id = ?")) {
            return args[0] === state.task.id
              ? { gsdStep: state.task.gsdStep ?? null, phaseNumber: state.task.phaseNumber ?? null }
              : undefined;
          }

          if (normalized.includes("SELECT id, level, claudeSessionId FROM tasks WHERE id = ?")) {
            return undefined;
          }

          throw new Error(`Unhandled get SQL: ${normalized}`);
        },
        run(...args) {
          if (normalized.includes("WHERE id = ? AND status = 'queued'")) {
            const [status, startedAt, updatedAt, activityLabel, taskId] = args;
            if (taskId !== state.task.id || state.task.status !== "queued") {
              return { changes: 0 };
            }

            state.task.status = status;
            state.task.startedAt = state.task.startedAt ?? startedAt;
            state.task.updatedAt = updatedAt;
            state.task.activityLabel = activityLabel;
            state.task.errorMessage = null;
            state.task.needsInput = 0;
            return { changes: 1 };
          }

          if (normalized.startsWith("DELETE FROM task_logs")) {
            state.logsDeleted += 1;
            return { changes: 1 };
          }

          if (normalized.startsWith("DELETE FROM task_outputs")) {
            state.outputsDeleted += 1;
            return { changes: 1 };
          }

          if (normalized.includes("UPDATE tasks SET contextSources = ? WHERE id = ?")) {
            const [contextSources, taskId] = args;
            if (taskId === state.task.id) {
              state.task.contextSources = contextSources;
            }
            return { changes: 1 };
          }

          if (normalized.includes("UPDATE tasks SET startSnapshot = ? WHERE id = ?")) {
            const [snapshot, taskId] = args;
            if (taskId === state.task.id) {
              state.task.startSnapshot = snapshot;
            }
            return { changes: 1 };
          }

          if (normalized.includes("UPDATE tasks SET claudeSessionId = ? WHERE id = ?")) {
            const [claudeSessionId, taskId] = args;
            if (taskId === state.task.id) {
              state.task.claudeSessionId = claudeSessionId;
            }
            return { changes: 1 };
          }

          throw new Error(`Unhandled run SQL: ${normalized}`);
        },
        all() {
          if (normalized.includes("SELECT * FROM tasks WHERE parentId = ? AND status = 'backlog'")) {
            return [];
          }

          throw new Error(`Unhandled all SQL: ${normalized}`);
        },
      };
    },
  };
}

function createCronQuestionDb(task, runningRowSequence = [true]) {
  const state = {
    task: { ...task },
    runningRowSequence: [...runningRowSequence],
  };

  function cloneTask() {
    return { ...state.task };
  }

  return {
    state,
    prepare(sql) {
      const normalized = sql.replace(/\s+/g, " ").trim();

      return {
        get(...args) {
          if (normalized.includes("SELECT cronJobSlug FROM tasks WHERE id = ?")) {
            return args[0] === state.task.id
              ? { cronJobSlug: state.task.cronJobSlug }
              : undefined;
          }

          if (normalized.includes("SELECT status FROM tasks WHERE id = ?")) {
            return args[0] === state.task.id ? { status: state.task.status } : undefined;
          }

          if (normalized.includes("SELECT level, parentId, completedAt FROM tasks WHERE id = ?")) {
            return args[0] === state.task.id
              ? {
                  level: state.task.level,
                  parentId: state.task.parentId,
                  completedAt: state.task.completedAt ?? null,
                }
              : undefined;
          }

          if (normalized.includes("SELECT * FROM tasks WHERE id = ?")) {
            return args[0] === state.task.id ? cloneTask() : undefined;
          }

          if (normalized.includes("SELECT id FROM cron_runs WHERE taskId = ? AND result = 'running' LIMIT 1")) {
            const next = state.runningRowSequence.length > 0
              ? state.runningRowSequence.shift()
              : false;
            return next ? { id: 1 } : undefined;
          }

          throw new Error(`Unhandled get SQL: ${normalized}`);
        },
        run(...args) {
          if (normalized.includes("UPDATE tasks SET updatedAt = ?, activityLabel = ?, needsInput = 1 WHERE id = ?")) {
            const [updatedAt, activityLabel, taskId] = args;
            if (taskId === state.task.id) {
              state.task.updatedAt = updatedAt;
              state.task.activityLabel = activityLabel;
              state.task.needsInput = 1;
            }
            return { changes: 1 };
          }

          if (normalized.includes("UPDATE tasks SET status = 'review', completedAt = NULL, updatedAt = ?, costUsd = ?, tokensUsed = ?, durationMs = ?, needsInput = 1 WHERE id = ?")) {
            const [updatedAt, costUsd, tokensUsed, durationMs, taskId] = args;
            if (taskId === state.task.id) {
              state.task.status = "review";
              state.task.completedAt = null;
              state.task.updatedAt = updatedAt;
              state.task.costUsd = costUsd;
              state.task.tokensUsed = tokensUsed;
              state.task.durationMs = durationMs;
              state.task.needsInput = 1;
            }
            return { changes: 1 };
          }

          throw new Error(`Unhandled run SQL: ${normalized}`);
        },
        all() {
          throw new Error(`Unhandled all SQL: ${normalized}`);
        },
      };
    },
  };
}

function loadProcessManagerModule(stubs = {}) {
  delete global.__processManager;

  const mergedStubs = {
    "./config": {
      getConfig: () => ({ agenticOsDir: process.cwd() }),
      getClientAgenticOsDir: (clientId) => path.join(process.cwd(), "clients", clientId),
    },
    "./subprocess": {
      spawnManagedTaskProcess: () => {
        throw new Error("spawnManagedTaskProcess stub not provided");
      },
      killChildProcessTree: () => {},
    },
    "./file-watcher": {
      fileWatcher: {
        startWatching: async () => {},
        stopWatching: async () => {},
        cleanupAll: () => {},
      },
    },
    "./gather-context": {
      buildSiblingContextBlock: () => "",
    },
    "./cron-service": {
      completeCronRunForTask: () => {},
    },
    "./prompt-tags": {
      expandPromptTags: (prompt) => prompt,
    },
    ...stubs,
  };

  const source = fs.readFileSync(processManagerSourcePath, "utf-8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
      jsx: ts.JsxEmit.ReactJSX,
    },
  });

  const module = { exports: {} };
  const localRequire = (request) => {
    if (Object.prototype.hasOwnProperty.call(mergedStubs, request)) {
      return mergedStubs[request];
    }

    if (request.startsWith("./") || request.startsWith("../")) {
      return require(path.resolve(path.dirname(processManagerSourcePath), request));
    }

    return require(request);
  };

  const compiled = new Function("require", "module", "exports", "__dirname", "__filename", outputText);
  compiled(localRequire, module, module.exports, path.dirname(processManagerSourcePath), processManagerSourcePath);
  return module.exports;
}

test("executeTask only claims one start for near-simultaneous queued cron calls", async () => {
  const workspaceDir = makeTempWorkspace();
  const now = new Date().toISOString();
  const task = {
    id: "task-queued-once",
    title: "Queued cron task",
    description: "This scheduled task should only start once.",
    status: "queued",
    level: "task",
    parentId: null,
    projectSlug: null,
    clientId: null,
    needsInput: 0,
    phaseNumber: null,
    gsdStep: null,
    cronJobSlug: "duplicate-start-job",
    permissionMode: "default",
    createdAt: now,
    updatedAt: now,
  };
  const db = createFakeDb(task);
  const logEntries = [];
  const emitEvents = [];
  let spawnCalls = 0;
  let resolveWatcher;
  const watcherPromise = new Promise((resolve) => {
    resolveWatcher = resolve;
  });

  try {
    const { processManager } = loadProcessManagerModule({
      "./db": { getDb: () => db },
      "./config": {
        getConfig: () => ({ agenticOsDir: workspaceDir }),
        getClientAgenticOsDir: (clientId) => path.join(workspaceDir, "clients", clientId),
      },
      "./event-bus": {
        emitTaskEvent: (event) => {
          emitEvents.push(event);
        },
      },
      "./claude-parser": {
        ClaudeOutputParser: class {},
      },
      "./file-watcher": {
        fileWatcher: {
          startWatching: () => watcherPromise,
          stopWatching: async () => {},
          cleanupAll: () => {},
        },
      },
      "./gather-context": {
        buildSiblingContextBlock: () => "",
      },
      "./file-diff": {
        captureSnapshot: () => ({}),
      },
      "./cron-service": {
        completeCronRunForTask: () => {},
      },
      "./prompt-tags": {
        expandPromptTags: (prompt) => prompt,
      },
    });

    processManager.addLogEntry = (_taskId, entry) => {
      logEntries.push(entry);
    };
    processManager.normalizeTask = (value) => value;
    processManager.isSessionContextTask = () => false;
    processManager.spawnClaudeTurn = () => {
      spawnCalls += 1;
    };

    const firstRun = processManager.executeTask(task.id);
    const secondRun = processManager.executeTask(task.id);

    await Promise.resolve();
    assert.equal(processManager.hasActiveSession(task.id), true);

    resolveWatcher();
    await Promise.all([firstRun, secondRun]);

    assert.equal(spawnCalls, 1);
    assert.equal(logEntries.length, 1);
    assert.equal(db.state.logsDeleted, 1);
    assert.equal(db.state.outputsDeleted, 1);
    assert.equal(db.state.task.status, "running");
    assert.equal(processManager.hasActiveSession(task.id), false);
    assert.equal(
      emitEvents.filter((event) => event.type === "task:status").length,
      1
    );
  } finally {
    delete global.__processManager;
    cleanupTempWorkspace(workspaceDir);
  }
});

test("cron prose questions stay in review and record needs_input instead of done", () => {
  const workspaceDir = makeTempWorkspace();
  const now = new Date().toISOString();
  const task = {
    id: "task-cron-question",
    title: "Cron question task",
    description: "Ask a follow-up",
    status: "running",
    level: "task",
    parentId: null,
    projectSlug: null,
    clientId: null,
    needsInput: 0,
    phaseNumber: null,
    gsdStep: null,
    cronJobSlug: "cron-question-job",
    permissionMode: "default",
    createdAt: now,
    updatedAt: now,
    completedAt: null,
    costUsd: null,
    tokensUsed: null,
    durationMs: null,
    activityLabel: null,
    errorMessage: null,
  };
  const db = createCronQuestionDb(task, [true]);
  const emittedEvents = [];
  const cronRunPayloads = [];
  const killedPids = [];

  try {
    const { processManager } = loadProcessManagerModule({
      "./db": { getDb: () => db },
      "./event-bus": {
        emitTaskEvent: (event) => emittedEvents.push(event),
      },
      "./cron-service": {
        completeCronRunForTask: (_task, payload) => {
          cronRunPayloads.push(payload);
        },
      },
      "./subprocess": {
        spawnManagedTaskProcess: () => {
          throw new Error("spawnManagedTaskProcess should not be called in this test");
        },
        killChildProcessTree: (proc) => {
          killedPids.push(proc.pid);
        },
      },
      "./file-watcher": {
        fileWatcher: {
          startWatching: async () => {},
          stopWatching: async () => {},
          cleanupAll: () => {},
        },
      },
      "./claude-parser": {
        ClaudeOutputParser: class {},
      },
      "./gather-context": {
        buildSiblingContextBlock: () => "",
      },
    });

    processManager.handleQuestion(task.id, "What should I test next?");
    processManager.sessions.set(task.id, {
      proc: { pid: 4321 },
      pendingQuestion: true,
      totalCostUsd: 0,
      totalTokensUsed: 0,
      totalDurationMs: 0,
      resumedFromReview: false,
    });

    processManager.handleTurnComplete(task.id, {
      costUsd: 1.5,
      tokensUsed: 24,
      durationMs: 2500,
    });

    assert.equal(db.state.task.status, "review");
    assert.equal(db.state.task.needsInput, 1);
    assert.equal(db.state.task.completedAt, null);
    assert.equal(db.state.task.activityLabel, "What should I test next?");
    assert.deepEqual(killedPids, [4321]);
    assert.equal(cronRunPayloads.length, 1);
    assert.equal(cronRunPayloads[0].result, "failure");
    assert.equal(cronRunPayloads[0].completionReason, "needs_input");
    assert.equal(
      emittedEvents.some((event) => event.type === "task:question"),
      true
    );
  } finally {
    delete global.__processManager;
    cleanupTempWorkspace(workspaceDir);
  }
});

test("a resumed cron task that asks again stays in review and does not create a second cron run", () => {
  const workspaceDir = makeTempWorkspace();
  const now = new Date().toISOString();
  const task = {
    id: "task-cron-question-twice",
    title: "Cron question twice",
    description: "Ask again on resume",
    status: "running",
    level: "task",
    parentId: null,
    projectSlug: null,
    clientId: null,
    needsInput: 0,
    phaseNumber: null,
    gsdStep: null,
    cronJobSlug: "cron-question-twice-job",
    permissionMode: "default",
    createdAt: now,
    updatedAt: now,
    completedAt: null,
    costUsd: null,
    tokensUsed: null,
    durationMs: null,
    activityLabel: null,
    errorMessage: null,
  };
  const db = createCronQuestionDb(task, [true, false]);
  const cronRunPayloads = [];

  try {
    const { processManager } = loadProcessManagerModule({
      "./db": { getDb: () => db },
      "./event-bus": {
        emitTaskEvent: () => {},
      },
      "./cron-service": {
        completeCronRunForTask: (_task, payload) => {
          cronRunPayloads.push(payload);
        },
      },
      "./subprocess": {
        spawnManagedTaskProcess: () => {
          throw new Error("spawnManagedTaskProcess should not be called in this test");
        },
        killChildProcessTree: () => {},
      },
      "./file-watcher": {
        fileWatcher: {
          startWatching: async () => {},
          stopWatching: async () => {},
          cleanupAll: () => {},
        },
      },
      "./claude-parser": {
        ClaudeOutputParser: class {},
      },
      "./gather-context": {
        buildSiblingContextBlock: () => "",
      },
    });

    processManager.sessions.set(task.id, {
      proc: { pid: 111 },
      pendingQuestion: true,
      totalCostUsd: 0,
      totalTokensUsed: 0,
      totalDurationMs: 0,
      resumedFromReview: false,
    });
    processManager.handleTurnComplete(task.id, {
      costUsd: 0.4,
      tokensUsed: 10,
      durationMs: 1000,
    });

    db.state.task.status = "running";
    db.state.task.needsInput = 0;
    db.state.task.updatedAt = new Date(Date.now() + 1000).toISOString();

    processManager.sessions.set(task.id, {
      proc: { pid: 222 },
      pendingQuestion: true,
      totalCostUsd: 0.4,
      totalTokensUsed: 10,
      totalDurationMs: 1000,
      resumedFromReview: true,
    });
    processManager.handleTurnComplete(task.id, {
      costUsd: 0.2,
      tokensUsed: 8,
      durationMs: 800,
    });

    assert.equal(db.state.task.status, "review");
    assert.equal(db.state.task.needsInput, 1);
    assert.equal(db.state.task.completedAt, null);
    assert.equal(cronRunPayloads.length, 1);
    assert.equal(cronRunPayloads[0].completionReason, "needs_input");
  } finally {
    delete global.__processManager;
    cleanupTempWorkspace(workspaceDir);
  }
});
