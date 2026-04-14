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

function loadProcessManagerModule(stubs = {}) {
  delete global.__processManager;

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
    if (Object.prototype.hasOwnProperty.call(stubs, request)) {
      return stubs[request];
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
