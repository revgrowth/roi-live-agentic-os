const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const Database = require("better-sqlite3");
const { spawn } = require("child_process");
const { randomUUID } = require("crypto");

const workspaceMarkers = ["AGENTS.md", "CLAUDE.md"];
const WEEKDAY_TOKENS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const WEEKDAY_SET = new Set(WEEKDAY_TOKENS);
const DAY_SHORTCUTS = new Set(["daily", "weekdays", "weekends"]);
const FIXED_TIME_RE = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
const INTERVAL_TIME_RE = /^every_([1-9]\d*)([mh])$/;
const DEFAULT_TIMEOUT = "30m";
const RUNTIME_STALE_MS = 120_000;
const RUNTIME_LOCK_FILE = "cron-runtime-lock.json";
const RUNTIME_PID_FILE = "cron-daemon.pid";
const RUNTIME_LOG_FILE = "cron-daemon.log";
const OUTPUT_SCAN_ROOTS = ["projects", "brand_context", "context"];
const OUTPUT_SCAN_IGNORES = new Set([
  ".git",
  ".next",
  "node_modules",
  ".command-centre",
]);

let cachedDbPath = null;
let cachedDb = null;

function normalizeClientId(clientId) {
  if (!clientId || clientId === "root") {
    return null;
  }
  return clientId;
}

function workspaceKeyFor(clientId) {
  return normalizeClientId(clientId) || "root";
}

function toClientLabel(clientId) {
  if (!clientId) return "Root";
  return clientId
    .split("-")
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
    .join(" ");
}

function isWorkspaceRoot(targetDir) {
  return workspaceMarkers.some((marker) => fs.existsSync(path.join(targetDir, marker)));
}

function resolveAgenticOsRoot(explicitRoot) {
  const configuredRoot = explicitRoot || process.env.AGENTIC_OS_DIR || process.cwd();
  let currentDir = path.resolve(configuredRoot);

  for (let depth = 0; depth < 10; depth += 1) {
    if (isWorkspaceRoot(currentDir)) {
      return currentDir;
    }

    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      break;
    }
    currentDir = parentDir;
  }

  throw new Error(
    `Unable to locate the Agentic OS workspace root from ${configuredRoot}. Expected one of: ${workspaceMarkers.join(", ")}`
  );
}

function getDataDir(agenticOsDir) {
  const dataDir = path.join(agenticOsDir, ".command-centre");
  fs.mkdirSync(dataDir, { recursive: true });
  return dataDir;
}

function getRuntimePaths(agenticOsDir) {
  const dataDir = getDataDir(agenticOsDir);
  return {
    dataDir,
    lockPath: path.join(dataDir, RUNTIME_LOCK_FILE),
    pidPath: path.join(dataDir, RUNTIME_PID_FILE),
    logPath: path.join(dataDir, RUNTIME_LOG_FILE),
  };
}

function getRuntimeCommands() {
  if (process.platform === "win32") {
    return {
      startCommand: "powershell -NoProfile -ExecutionPolicy Bypass -File scripts\\start-crons.ps1",
      stopCommand: "powershell -NoProfile -ExecutionPolicy Bypass -File scripts\\stop-crons.ps1",
      statusCommand: "powershell -NoProfile -ExecutionPolicy Bypass -File scripts\\status-crons.ps1",
      logsCommand: "powershell -NoProfile -ExecutionPolicy Bypass -File scripts\\logs-crons.ps1",
    };
  }

  return {
    startCommand: "bash scripts/start-crons.sh",
    stopCommand: "bash scripts/stop-crons.sh",
    statusCommand: "bash scripts/status-crons.sh",
    logsCommand: "bash scripts/logs-crons.sh",
  };
}

function safeParseJson(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function readJsonFile(filePath) {
  try {
    return safeParseJson(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return null;
  }
}

function writeJsonFileAtomic(filePath, value) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  const tmpPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify(value, null, 2), "utf-8");
  fs.renameSync(tmpPath, filePath);
}

function listWorkspaceDescriptors(agenticOsDir) {
  const workspaces = [
    {
      clientId: null,
      workspaceKey: "root",
      label: "Root",
      workspaceDir: agenticOsDir,
    },
  ];

  const clientsDir = path.join(agenticOsDir, "clients");
  if (!fs.existsSync(clientsDir)) {
    return workspaces;
  }

  const entries = fs.readdirSync(clientsDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith(".")) {
      continue;
    }

    const clientId = entry.name;
    workspaces.push({
      clientId,
      workspaceKey: workspaceKeyFor(clientId),
      label: toClientLabel(clientId),
      workspaceDir: path.join(clientsDir, clientId),
    });
  }

  return workspaces;
}

function getWorkspaceDescriptor(agenticOsDir, clientId) {
  const normalizedClientId = normalizeClientId(clientId);
  if (!normalizedClientId) {
    return {
      clientId: null,
      workspaceKey: "root",
      label: "Root",
      workspaceDir: agenticOsDir,
    };
  }

  const workspaceDir = path.join(agenticOsDir, "clients", normalizedClientId);
  if (!fs.existsSync(workspaceDir)) {
    throw new Error(`Client directory not found: ${workspaceDir}`);
  }

  return {
    clientId: normalizedClientId,
    workspaceKey: workspaceKeyFor(normalizedClientId),
    label: toClientLabel(normalizedClientId),
    workspaceDir,
  };
}

function getWorkspacePaths(agenticOsDir, clientId) {
  const descriptor = getWorkspaceDescriptor(agenticOsDir, clientId);
  return {
    ...descriptor,
    jobsDir: path.join(descriptor.workspaceDir, "cron", "jobs"),
    logsDir: path.join(descriptor.workspaceDir, "cron", "logs"),
    statusDir: path.join(descriptor.workspaceDir, "cron", "status"),
  };
}

function normalizeDayTokens(days) {
  return String(days || "")
    .split(",")
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean);
}

function normalizeTimeTokens(time) {
  return String(time || "")
    .split(",")
    .map((token) => token.trim())
    .filter(Boolean);
}

function isSupportedCronDays(days) {
  const tokens = normalizeDayTokens(days);
  if (tokens.length === 0) return false;

  if (tokens.length === 1) {
    return DAY_SHORTCUTS.has(tokens[0]) || WEEKDAY_SET.has(tokens[0]);
  }

  return tokens.every((token) => WEEKDAY_SET.has(token));
}

function isSupportedCronTime(time) {
  const trimmed = String(time || "").trim();
  if (!trimmed) return false;

  if (INTERVAL_TIME_RE.test(trimmed)) {
    return true;
  }

  const parts = normalizeTimeTokens(trimmed);
  return parts.length > 0 && parts.every((part) => FIXED_TIME_RE.test(part));
}

function isSupportedCronSchedule(time, days) {
  return isSupportedCronTime(time) && isSupportedCronDays(days);
}

function getCronScheduleValidationError(time, days) {
  if (!isSupportedCronTime(time)) {
    return "Unsupported time schedule. Use HH:MM, comma-separated HH:MM values, every_Nm, or every_Nh.";
  }

  if (!isSupportedCronDays(days)) {
    return "Unsupported day schedule. Use daily, weekdays, weekends, or comma-separated weekday tokens like mon,wed.";
  }

  return null;
}

function matchesDays(date, days) {
  const tokens = normalizeDayTokens(days);
  if (tokens.length === 0) return false;

  const dayToken = WEEKDAY_TOKENS[date.getDay() === 0 ? 6 : date.getDay() - 1];
  if (tokens.length === 1) {
    switch (tokens[0]) {
      case "daily":
        return true;
      case "weekdays":
        return dayToken !== "sat" && dayToken !== "sun";
      case "weekends":
        return dayToken === "sat" || dayToken === "sun";
      default:
        return tokens[0] === dayToken;
    }
  }

  return tokens.includes(dayToken);
}

function matchesTime(date, schedule) {
  const trimmed = String(schedule || "").trim();
  const intervalMatch = trimmed.match(INTERVAL_TIME_RE);
  if (intervalMatch) {
    const interval = Number(intervalMatch[1]);
    const unit = intervalMatch[2];

    if (unit === "m") {
      return date.getMinutes() % interval === 0;
    }

    return date.getMinutes() === 0 && date.getHours() % interval === 0;
  }

  const currentTime = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  return normalizeTimeTokens(trimmed).includes(currentTime);
}

function isFixedTimeSchedule(schedule) {
  return !INTERVAL_TIME_RE.test(String(schedule || "").trim());
}

function toMinuteDate(date) {
  const minute = new Date(date);
  minute.setSeconds(0, 0);
  return minute;
}

function toMinuteIso(date) {
  return toMinuteDate(date).toISOString();
}

function getNextFixedRun(time, days, now) {
  const times = normalizeTimeTokens(time);
  if (times.length === 0) return null;

  let earliest = null;
  for (let offset = 0; offset < 14; offset += 1) {
    const day = new Date(now);
    day.setDate(now.getDate() + offset);
    day.setSeconds(0, 0);

    if (!matchesDays(day, days)) {
      continue;
    }

    for (const fixedTime of times) {
      const [hours, minutes] = fixedTime.split(":").map(Number);
      const candidate = new Date(day);
      candidate.setHours(hours, minutes, 0, 0);

      if (candidate <= now) {
        continue;
      }

      if (!earliest || candidate < earliest) {
        earliest = candidate;
      }
    }

    if (earliest) {
      return earliest;
    }
  }

  return null;
}

function getNextIntervalRun(time, days, now) {
  const intervalMatch = String(time || "").trim().match(INTERVAL_TIME_RE);
  if (!intervalMatch) return null;

  const interval = Number(intervalMatch[1]);
  const unit = intervalMatch[2];
  const cursor = toMinuteDate(now);

  if (unit === "m") {
    cursor.setMinutes(cursor.getMinutes() + 1);
    for (let i = 0; i < 60 * 24 * 14; i += 1) {
      if (matchesDays(cursor, days) && cursor.getMinutes() % interval === 0) {
        return new Date(cursor);
      }
      cursor.setMinutes(cursor.getMinutes() + 1);
    }
    return null;
  }

  cursor.setMinutes(0, 0, 0);
  if (cursor <= now) {
    cursor.setHours(cursor.getHours() + 1);
  }

  for (let i = 0; i < 24 * 14; i += 1) {
    if (matchesDays(cursor, days) && cursor.getHours() % interval === 0) {
      return new Date(cursor);
    }
    cursor.setHours(cursor.getHours() + 1);
  }

  return null;
}

function getNextRunForSchedule(time, days, active, now = new Date()) {
  if (!active || !isSupportedCronSchedule(time, days)) {
    return null;
  }

  const next = INTERVAL_TIME_RE.test(String(time || "").trim())
    ? getNextIntervalRun(time, days, now)
    : getNextFixedRun(time, days, now);

  return next ? next.toISOString() : null;
}

function getMissedFixedRuns(schedule, days, start, end) {
  if (!isFixedTimeSchedule(schedule)) {
    return [];
  }

  const startMinute = toMinuteDate(start);
  const endMinute = toMinuteDate(end);
  if (endMinute <= startMinute) {
    return [];
  }

  const matches = [];
  const times = normalizeTimeTokens(schedule);
  const cursor = new Date(startMinute);
  cursor.setHours(0, 0, 0, 0);

  while (cursor <= endMinute) {
    if (matchesDays(cursor, days)) {
      for (const fixedTime of times) {
        const [hours, minutes] = fixedTime.split(":").map(Number);
        const candidate = new Date(cursor);
        candidate.setHours(hours, minutes, 0, 0);

        if (candidate > startMinute && candidate < endMinute) {
          matches.push(candidate);
        }
      }
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return matches.sort((left, right) => left.getTime() - right.getTime());
}

function getStatusFilePath(agenticOsDir, clientId, slug) {
  return path.join(getWorkspacePaths(agenticOsDir, clientId).statusDir, `${slug}.json`);
}

function readRunStatus(agenticOsDir, clientId, slug) {
  const statusPath = getStatusFilePath(agenticOsDir, clientId, slug);
  const data = readJsonFile(statusPath);
  if (!data || !data.last_run || !data.result) {
    return null;
  }

  return {
    lastRun: data.last_run,
    result: data.result,
    duration: data.duration || 0,
    exitCode: data.exit_code || 0,
    runCount: data.run_count || 0,
    failCount: data.fail_count || 0,
  };
}

function readSchemaSql() {
  try {
    return fs.readFileSync(path.join(__dirname, "schema.sql"), "utf-8");
  } catch {
    // Turbopack inlines __dirname as a virtual path in bundled API routes, so
    // fall back to a cwd-relative lookup (next dev runs from command-centre/).
    return fs.readFileSync(
      path.join(process.cwd(), "src", "lib", "schema.sql"),
      "utf-8"
    );
  }
}

function ensureColumn(db, tableName, columnName, alterSql) {
  const columns = db.prepare(`PRAGMA table_info(${tableName})`).all();
  if (!columns.some((column) => column.name === columnName)) {
    db.exec(alterSql);
  }
}

function getDb(agenticOsDir) {
  const dbPath = path.join(getDataDir(agenticOsDir), "data.db");
  if (cachedDb && cachedDbPath === dbPath) {
    return cachedDb;
  }

  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.exec(readSchemaSql());

  ensureColumn(db, "tasks", "clientId", "ALTER TABLE tasks ADD COLUMN clientId TEXT");
  ensureColumn(db, "tasks", "description", "ALTER TABLE tasks ADD COLUMN description TEXT");
  ensureColumn(db, "tasks", "projectSlug", "ALTER TABLE tasks ADD COLUMN projectSlug TEXT");
  ensureColumn(db, "tasks", "needsInput", "ALTER TABLE tasks ADD COLUMN needsInput INTEGER NOT NULL DEFAULT 0");
  ensureColumn(db, "tasks", "phaseNumber", "ALTER TABLE tasks ADD COLUMN phaseNumber INTEGER");
  ensureColumn(
    db,
    "tasks",
    "gsdStep",
    "ALTER TABLE tasks ADD COLUMN gsdStep TEXT CHECK (gsdStep IN ('discuss', 'plan', 'execute', 'verify'))"
  );
  ensureColumn(db, "tasks", "cronJobSlug", "ALTER TABLE tasks ADD COLUMN cronJobSlug TEXT");
  ensureColumn(db, "tasks", "claudePid", "ALTER TABLE tasks ADD COLUMN claudePid INTEGER");
  ensureColumn(db, "tasks", "permissionMode", "ALTER TABLE tasks ADD COLUMN permissionMode TEXT DEFAULT 'default'");
  ensureColumn(db, "tasks", "contextSources", "ALTER TABLE tasks ADD COLUMN contextSources TEXT");
  ensureColumn(db, "tasks", "claudeSessionId", "ALTER TABLE tasks ADD COLUMN claudeSessionId TEXT");
  ensureColumn(db, "tasks", "lastReplyAt", "ALTER TABLE tasks ADD COLUMN lastReplyAt TEXT");
  ensureColumn(db, "tasks", "goalGroup", "ALTER TABLE tasks ADD COLUMN goalGroup TEXT");

  ensureColumn(db, "cron_runs", "taskId", "ALTER TABLE cron_runs ADD COLUMN taskId TEXT");
  ensureColumn(db, "cron_runs", "trigger", "ALTER TABLE cron_runs ADD COLUMN trigger TEXT DEFAULT 'scheduled'");
  ensureColumn(db, "cron_runs", "clientId", "ALTER TABLE cron_runs ADD COLUMN clientId TEXT");
  ensureColumn(db, "cron_runs", "scheduledFor", "ALTER TABLE cron_runs ADD COLUMN scheduledFor TEXT");

  db.exec("CREATE INDEX IF NOT EXISTS idx_tasks_clientId ON tasks(clientId)");
  db.exec("CREATE INDEX IF NOT EXISTS idx_tasks_cronJobSlug ON tasks(cronJobSlug)");
  db.exec("CREATE INDEX IF NOT EXISTS idx_cron_runs_clientId ON cron_runs(clientId)");
  db.exec("CREATE INDEX IF NOT EXISTS idx_cron_runs_job_client_schedule ON cron_runs(jobSlug, clientId, scheduledFor)");

  cachedDbPath = dbPath;
  cachedDb = db;
  return db;
}

function getCronStats(agenticOsDir, slug, clientId) {
  const db = getDb(agenticOsDir);
  const row = db
    .prepare(
      `SELECT
         COUNT(*) as totalRuns,
         COALESCE(AVG(durationSec), 0) as avgDurationSec,
         COALESCE(AVG(costUsd), 0) as avgCostUsd
       FROM cron_runs
       WHERE jobSlug = ?
         AND COALESCE(clientId, '') = COALESCE(?, '')`
    )
    .get(slug, normalizeClientId(clientId));

  return {
    totalRuns: row && row.totalRuns ? row.totalRuns : 0,
    avgDurationSec: row && row.avgDurationSec ? row.avgDurationSec : 0,
    avgCostUsd: row && row.avgCostUsd ? row.avgCostUsd : 0,
  };
}

function parseJobFile(agenticOsDir, workspace, filePath) {
  const slug = path.basename(filePath, ".md");
  const raw = fs.readFileSync(filePath, "utf-8");
  const parsed = matter(raw);
  const active = String(parsed.data.active ?? "true").toLowerCase() === "true";
  const retry = Number.parseInt(String(parsed.data.retry ?? "0"), 10);
  const time = String(parsed.data.time ?? "00:00");
  const days = String(parsed.data.days ?? "daily");

  return {
    name: String(parsed.data.name || slug),
    slug,
    description: String(parsed.data.description || ""),
    time,
    days,
    active,
    model: String(parsed.data.model || "sonnet"),
    notify: String(parsed.data.notify || "on_finish"),
    timeout: String(parsed.data.timeout || DEFAULT_TIMEOUT),
    retry: Number.isFinite(retry) ? retry : 0,
    nextRun: getNextRunForSchedule(time, days, active),
    lastRun: readRunStatus(agenticOsDir, workspace.clientId, slug),
    stats: getCronStats(agenticOsDir, slug, workspace.clientId),
    prompt: parsed.content.trim(),
    clientId: workspace.clientId,
    workspaceKey: workspace.workspaceKey,
    workspaceLabel: workspace.label,
    workspaceDir: workspace.workspaceDir,
  };
}

function listCronJobs(agenticOsDir, clientId) {
  const workspace = getWorkspaceDescriptor(agenticOsDir, clientId);
  const jobsDir = path.join(workspace.workspaceDir, "cron", "jobs");

  try {
    return fs
      .readdirSync(jobsDir)
      .filter((fileName) => fileName.endsWith(".md"))
      .map((fileName) => parseJobFile(agenticOsDir, workspace, path.join(jobsDir, fileName)));
  } catch {
    return [];
  }
}

function listAllCronJobs(agenticOsDir) {
  return listWorkspaceDescriptors(agenticOsDir).flatMap((workspace) => listCronJobs(agenticOsDir, workspace.clientId));
}

function resolveUniqueJob(agenticOsDir, slug, clientId) {
  const normalizedClientId = normalizeClientId(clientId);
  if (clientId !== undefined) {
    const workspace = getWorkspaceDescriptor(agenticOsDir, normalizedClientId);
    const filePath = path.join(workspace.workspaceDir, "cron", "jobs", `${slug}.md`);
    if (!fs.existsSync(filePath)) {
      return null;
    }
    return parseJobFile(agenticOsDir, workspace, filePath);
  }

  const matches = listAllCronJobs(agenticOsDir).filter((job) => job.slug === slug);
  if (matches.length === 0) {
    return null;
  }
  if (matches.length > 1) {
    throw new Error(
      `Cron job slug "${slug}" exists in multiple workspaces. Pass a clientId to disambiguate.`
    );
  }
  return matches[0];
}

function getCronJob(agenticOsDir, slug, clientId) {
  return resolveUniqueJob(agenticOsDir, slug, clientId);
}

function toSlug(name) {
  return String(name || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function createCronJob(agenticOsDir, clientId, input) {
  const workspace = getWorkspacePaths(agenticOsDir, clientId);
  const slug = toSlug(input.name);
  const filePath = path.join(workspace.jobsDir, `${slug}.md`);

  fs.mkdirSync(workspace.jobsDir, { recursive: true });
  const frontmatter = {
    name: input.name,
    description: input.description || "",
    time: input.time,
    days: input.days,
    active: "true",
    model: input.model || "sonnet",
    notify: input.notify || "on_finish",
    timeout: input.timeout || DEFAULT_TIMEOUT,
    retry: String(input.retry ?? 0),
  };

  const content = matter.stringify(String(input.prompt || "").trim(), frontmatter);
  const tempPath = `${filePath}.${process.pid}.tmp`;
  fs.writeFileSync(tempPath, content, "utf-8");
  fs.renameSync(tempPath, filePath);
  return parseJobFile(agenticOsDir, workspace, filePath);
}

function updateCronJob(agenticOsDir, clientId, slug, input) {
  const workspace = getWorkspacePaths(agenticOsDir, clientId);
  const filePath = path.join(workspace.jobsDir, `${slug}.md`);
  const raw = fs.readFileSync(filePath, "utf-8");
  const parsed = matter(raw);

  if (input.name !== undefined) parsed.data.name = input.name;
  if (input.description !== undefined) parsed.data.description = input.description;
  if (input.time !== undefined) parsed.data.time = input.time;
  if (input.days !== undefined) parsed.data.days = input.days;
  if (input.active !== undefined) parsed.data.active = String(input.active);
  if (input.model !== undefined) parsed.data.model = input.model;
  if (input.notify !== undefined) parsed.data.notify = input.notify;
  if (input.timeout !== undefined) parsed.data.timeout = input.timeout;
  if (input.retry !== undefined) parsed.data.retry = String(input.retry);

  const nextPrompt = input.prompt !== undefined ? String(input.prompt).trim() : parsed.content.trim();
  const tempPath = `${filePath}.${process.pid}.tmp`;
  fs.writeFileSync(tempPath, matter.stringify(nextPrompt, parsed.data), "utf-8");
  fs.renameSync(tempPath, filePath);

  return parseJobFile(agenticOsDir, workspace, filePath);
}

function deleteCronJob(agenticOsDir, clientId, slug) {
  const workspace = getWorkspacePaths(agenticOsDir, clientId);
  fs.rmSync(path.join(workspace.jobsDir, `${slug}.md`), { force: true });
}

function getCronRunHistory(agenticOsDir, slug, clientId) {
  const normalizedClientId = normalizeClientId(clientId);
  const db = getDb(agenticOsDir);
  const rows = db
    .prepare(
      `SELECT id, jobSlug, taskId, startedAt, completedAt, result, durationSec, costUsd, exitCode, trigger
       FROM cron_runs
       WHERE jobSlug = ?
         AND COALESCE(clientId, '') = COALESCE(?, '')
       ORDER BY startedAt DESC
       LIMIT 50`
    )
    .all(slug, normalizedClientId);

  if (rows.length > 0) {
    return rows.map((row) => {
      let outputs = [];
      if (row.taskId) {
        outputs = db
          .prepare(
            `SELECT fileName, filePath, extension
             FROM task_outputs
             WHERE taskId = ?
             ORDER BY createdAt ASC`
          )
          .all(row.taskId);
      }

      return {
        ...row,
        trigger: row.trigger || "scheduled",
        outputs,
      };
    });
  }

  const status = readRunStatus(agenticOsDir, normalizedClientId, slug);
  if (!status) return [];

  const startedAt = status.lastRun;
  const durationSec = status.duration || 0;
  const completedAt = new Date(new Date(startedAt).getTime() + durationSec * 1000).toISOString();

  return [
    {
      id: -1,
      jobSlug: slug,
      taskId: null,
      startedAt,
      completedAt,
      result: status.result,
      durationSec,
      costUsd: 0,
      exitCode: status.exitCode || 0,
      trigger: "scheduled",
      outputs: [],
    },
  ];
}

function getRawJobFile(agenticOsDir, slug, clientId) {
  try {
    const job = resolveUniqueJob(agenticOsDir, slug, clientId);
    if (!job) return null;
    return fs.readFileSync(path.join(job.workspaceDir, "cron", "jobs", `${job.slug}.md`), "utf-8");
  } catch {
    return null;
  }
}

function getCronJobLog(agenticOsDir, slug, clientId) {
  try {
    const workspace = getWorkspacePaths(agenticOsDir, clientId);
    const content = fs.readFileSync(path.join(workspace.logsDir, `${slug}.log`), "utf-8");
    if (content.length > 50_000) {
      return `... (truncated)\n${content.slice(-50_000)}`;
    }
    return content;
  } catch {
    return "";
  }
}

function appendCronLog(agenticOsDir, clientId, slug, line) {
  const workspace = getWorkspacePaths(agenticOsDir, clientId);
  fs.mkdirSync(workspace.logsDir, { recursive: true });
  fs.appendFileSync(path.join(workspace.logsDir, `${slug}.log`), `${line}${line.endsWith("\n") ? "" : "\n"}`, "utf-8");
}

function readRuntimeRecord(agenticOsDir) {
  return readJsonFile(getRuntimePaths(agenticOsDir).lockPath);
}

function readDaemonPid(agenticOsDir) {
  const raw = (() => {
    try {
      return fs.readFileSync(getRuntimePaths(agenticOsDir).pidPath, "utf-8").trim();
    } catch {
      return "";
    }
  })();

  if (!raw) return null;
  const pid = Number.parseInt(raw, 10);
  return Number.isFinite(pid) ? pid : null;
}

function isProcessAlive(pid) {
  if (!pid) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function isRuntimeRecordStale(record, now = Date.now()) {
  if (!record || !record.heartbeatAt) {
    return true;
  }

  const heartbeatAt = Date.parse(record.heartbeatAt);
  if (!Number.isFinite(heartbeatAt)) {
    return true;
  }

  return now - heartbeatAt > RUNTIME_STALE_MS;
}

function writeDaemonPid(agenticOsDir, pid) {
  fs.writeFileSync(getRuntimePaths(agenticOsDir).pidPath, String(pid), "utf-8");
}

function removeDaemonPid(agenticOsDir) {
  fs.rmSync(getRuntimePaths(agenticOsDir).pidPath, { force: true });
}

function claimRuntimeLeadership(agenticOsDir, candidate) {
  const runtimePaths = getRuntimePaths(agenticOsDir);
  const commands = getRuntimeCommands();
  const nowIso = new Date().toISOString();
  const record = {
    runtime: candidate.runtime,
    leader: true,
    identifier: candidate.identifier,
    pid: candidate.pid || process.pid,
    startedAt: candidate.startedAt || nowIso,
    heartbeatAt: nowIso,
    lastSweepAt: candidate.lastSweepAt || null,
    workspaceCount: candidate.workspaceCount || listWorkspaceDescriptors(agenticOsDir).length,
    startCommand: commands.startCommand,
    stopCommand: commands.stopCommand,
  };

  try {
    const handle = fs.openSync(runtimePaths.lockPath, "wx");
    fs.writeFileSync(handle, JSON.stringify(record, null, 2), "utf-8");
    fs.closeSync(handle);
    return record;
  } catch (error) {
    if (!error || error.code !== "EEXIST") {
      throw error;
    }
  }

  const current = readRuntimeRecord(agenticOsDir);
  if (!current) {
    fs.rmSync(runtimePaths.lockPath, { force: true });
    return claimRuntimeLeadership(agenticOsDir, candidate);
  }

  if (current.identifier === candidate.identifier) {
    const updated = {
      ...current,
      ...record,
      startedAt: current.startedAt || record.startedAt,
      heartbeatAt: nowIso,
    };
    writeJsonFileAtomic(runtimePaths.lockPath, updated);
    return updated;
  }

  if (isRuntimeRecordStale(current)) {
    fs.rmSync(runtimePaths.lockPath, { force: true });
    return claimRuntimeLeadership(agenticOsDir, candidate);
  }

  return null;
}

function refreshRuntimeHeartbeat(agenticOsDir, identifier, updates = {}) {
  const runtimePaths = getRuntimePaths(agenticOsDir);
  const current = readRuntimeRecord(agenticOsDir);
  if (!current || current.identifier !== identifier) {
    return null;
  }

  const updated = {
    ...current,
    ...updates,
    heartbeatAt: new Date().toISOString(),
  };
  writeJsonFileAtomic(runtimePaths.lockPath, updated);
  return updated;
}

function releaseRuntimeLeadership(agenticOsDir, identifier) {
  const runtimePaths = getRuntimePaths(agenticOsDir);
  const current = readRuntimeRecord(agenticOsDir);
  if (current && current.identifier !== identifier && !isRuntimeRecordStale(current)) {
    return false;
  }

  fs.rmSync(runtimePaths.lockPath, { force: true });
  if (!current || current.runtime === "daemon" || String(identifier || "").startsWith("daemon")) {
    removeDaemonPid(agenticOsDir);
  }
  return true;
}

function getManagedRuntimeStatus(agenticOsDir, localIdentifier) {
  const commands = getRuntimeCommands();
  const workspaceCount = listWorkspaceDescriptors(agenticOsDir).length;
  const current = readRuntimeRecord(agenticOsDir);
  const active = current && !isRuntimeRecordStale(current);
  const daemonPid = readDaemonPid(agenticOsDir);

  if (!active) {
    if (daemonPid && isProcessAlive(daemonPid)) {
      return {
        runtime: "daemon",
        leader: false,
        identifier: current?.identifier || `daemon-${daemonPid}`,
        startCommand: commands.startCommand,
        stopCommand: commands.stopCommand,
        statusCommand: commands.statusCommand,
        logsCommand: commands.logsCommand,
        workspaceCount,
        heartbeatAt: current?.heartbeatAt || null,
        pid: daemonPid,
      };
    }

    if (localIdentifier) {
      return {
        runtime: "in-process",
        leader: false,
        identifier: localIdentifier,
        startCommand: commands.startCommand,
        stopCommand: commands.stopCommand,
        statusCommand: commands.statusCommand,
        logsCommand: commands.logsCommand,
        workspaceCount,
        heartbeatAt: null,
        pid: process.pid,
      };
    }

    return {
      runtime: "stopped",
      leader: false,
      identifier: null,
      startCommand: commands.startCommand,
      stopCommand: commands.stopCommand,
      statusCommand: commands.statusCommand,
      logsCommand: commands.logsCommand,
      workspaceCount,
      heartbeatAt: null,
      pid: daemonPid,
    };
  }

  return {
    runtime: current.runtime,
    leader: localIdentifier ? current.identifier === localIdentifier : true,
    identifier: current.identifier || null,
    startCommand: current.startCommand || commands.startCommand,
    stopCommand: current.stopCommand || commands.stopCommand,
    statusCommand: commands.statusCommand,
    logsCommand: commands.logsCommand,
    workspaceCount: current.workspaceCount || workspaceCount,
    heartbeatAt: current.heartbeatAt || null,
    pid: current.pid || null,
  };
}

function getNextBacklogOrder(db) {
  const row = db
    .prepare("SELECT COALESCE(MIN(columnOrder), 1) as minOrder FROM tasks WHERE status = 'backlog'")
    .get();
  return (row && row.minOrder) ? row.minOrder - 1 : 0;
}

function enqueueCronJob(agenticOsDir, job, options = {}) {
  const db = getDb(agenticOsDir);
  const now = new Date().toISOString();
  const normalizedClientId = normalizeClientId(job.clientId);
  const scheduledFor = options.scheduledFor ? toMinuteIso(new Date(options.scheduledFor)) : toMinuteIso(new Date());

  if (options.dedupeByMinute) {
    const existing = db
      .prepare(
        `SELECT taskId, id
         FROM cron_runs
         WHERE jobSlug = ?
           AND COALESCE(clientId, '') = COALESCE(?, '')
           AND scheduledFor = ?
         LIMIT 1`
      )
      .get(job.slug, normalizedClientId, scheduledFor);

    if (existing) {
      return {
        duplicate: true,
        cronRunId: existing.id,
        task: existing.taskId
          ? db.prepare("SELECT * FROM tasks WHERE id = ?").get(existing.taskId)
          : null,
      };
    }
  }

  const task = {
    id: randomUUID(),
    title: options.title || `${job.name}${options.titleSuffix || ""}`,
    description: job.prompt,
    status: "queued",
    level: "task",
    parentId: null,
    projectSlug: null,
    columnOrder: getNextBacklogOrder(db),
    createdAt: now,
    updatedAt: now,
    costUsd: null,
    tokensUsed: null,
    durationMs: null,
    activityLabel: options.activityLabel || `Queued — ${options.trigger || "scheduled"}`,
    errorMessage: null,
    startedAt: null,
    completedAt: null,
    clientId: normalizedClientId,
    needsInput: 0,
    phaseNumber: null,
    gsdStep: null,
    cronJobSlug: job.slug,
    permissionMode: "default",
  };

  db.prepare(
    `INSERT INTO tasks (
      id, title, description, status, level, parentId, projectSlug, columnOrder, createdAt,
      updatedAt, costUsd, tokensUsed, durationMs, activityLabel, errorMessage, startedAt,
      completedAt, clientId, needsInput, phaseNumber, gsdStep, cronJobSlug, permissionMode
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    task.id,
    task.title,
    task.description,
    task.status,
    task.level,
    task.parentId,
    task.projectSlug,
    task.columnOrder,
    task.createdAt,
    task.updatedAt,
    task.costUsd,
    task.tokensUsed,
    task.durationMs,
    task.activityLabel,
    task.errorMessage,
    task.startedAt,
    task.completedAt,
    task.clientId,
    task.needsInput,
    task.phaseNumber,
    task.gsdStep,
    task.cronJobSlug,
    task.permissionMode
  );

  const cronRun = db
    .prepare(
      `INSERT INTO cron_runs (jobSlug, taskId, startedAt, result, trigger, clientId, scheduledFor)
       VALUES (?, ?, ?, 'running', ?, ?, ?)
       RETURNING id`
    )
    .get(job.slug, task.id, now, options.trigger || "scheduled", normalizedClientId, scheduledFor);

  return {
    duplicate: false,
    task: db.prepare("SELECT * FROM tasks WHERE id = ?").get(task.id),
    cronRunId: cronRun ? cronRun.id : null,
    scheduledFor,
  };
}

function updateCronStatusFile(agenticOsDir, clientId, slug, payload) {
  const statusPath = getStatusFilePath(agenticOsDir, clientId, slug);
  const existing = readJsonFile(statusPath) || { run_count: 0, fail_count: 0 };

  writeJsonFileAtomic(statusPath, {
    last_run: payload.completedAt,
    result: payload.result,
    duration: payload.durationSec,
    exit_code: payload.exitCode,
    run_count: Number(existing.run_count || 0) + 1,
    fail_count: Number(existing.fail_count || 0) + (payload.result === "success" ? 0 : 1),
  });
}

function completeCronRunForTask(agenticOsDir, task, payload = {}) {
  if (!task || !task.cronJobSlug) {
    return;
  }

  const db = getDb(agenticOsDir);
  const completedAt = payload.completedAt || new Date().toISOString();
  const durationSec = payload.durationSec ?? Math.round((payload.durationMs || 0) / 1000);
  const result = payload.result || (task.errorMessage ? "failure" : "success");
  const exitCode =
    payload.exitCode !== undefined
      ? payload.exitCode
      : result === "success"
        ? 0
        : result === "timeout"
          ? 124
          : 1;
  const normalizedClientId = normalizeClientId(task.clientId);

  const existing = db
    .prepare("SELECT id FROM cron_runs WHERE taskId = ? AND result = 'running' LIMIT 1")
    .get(task.id);

  if (existing) {
    db.prepare(
      `UPDATE cron_runs
       SET completedAt = ?, result = ?, durationSec = ?, costUsd = ?, exitCode = ?, clientId = COALESCE(clientId, ?)
       WHERE id = ?`
    ).run(
      completedAt,
      result,
      durationSec,
      payload.costUsd ?? null,
      exitCode,
      normalizedClientId,
      existing.id
    );
  } else {
    db.prepare(
      `INSERT INTO cron_runs (
         jobSlug, taskId, startedAt, completedAt, result, durationSec, costUsd, exitCode,
         trigger, clientId, scheduledFor
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      task.cronJobSlug,
      task.id,
      task.startedAt || completedAt,
      completedAt,
      result,
      durationSec,
      payload.costUsd ?? null,
      exitCode,
      payload.trigger || "scheduled",
      normalizedClientId,
      payload.scheduledFor || (task.startedAt ? toMinuteIso(new Date(task.startedAt)) : toMinuteIso(new Date(completedAt)))
    );
  }

  updateCronStatusFile(agenticOsDir, normalizedClientId, task.cronJobSlug, {
    completedAt,
    result,
    durationSec,
    exitCode,
  });
}

function parseTimeoutToMs(timeoutValue) {
  const raw = String(timeoutValue || DEFAULT_TIMEOUT).trim();
  if (/^\d+$/.test(raw)) {
    return Number(raw) * 1000;
  }
  if (/^\d+s$/.test(raw)) {
    return Number(raw.slice(0, -1)) * 1000;
  }
  if (/^\d+m$/.test(raw)) {
    return Number(raw.slice(0, -1)) * 60 * 1000;
  }
  if (/^\d+h$/.test(raw)) {
    return Number(raw.slice(0, -1)) * 60 * 60 * 1000;
  }
  return 30 * 60 * 1000;
}

function walkFiles(rootDir, callback, relativePrefix = "") {
  if (!fs.existsSync(rootDir)) {
    return;
  }

  const entries = fs.readdirSync(rootDir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(rootDir, entry.name);
    const relativePath = relativePrefix ? path.join(relativePrefix, entry.name) : entry.name;

    if (entry.isDirectory()) {
      if (OUTPUT_SCAN_IGNORES.has(entry.name)) {
        continue;
      }
      walkFiles(fullPath, callback, relativePath);
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    callback(fullPath, relativePath);
  }
}

function takeOutputSnapshot(workspaceDir) {
  const snapshot = new Map();

  for (const rootName of OUTPUT_SCAN_ROOTS) {
    const rootDir = path.join(workspaceDir, rootName);
    walkFiles(rootDir, (fullPath, relativePath) => {
      const stat = fs.statSync(fullPath);
      snapshot.set(relativePath, `${stat.size}:${stat.mtimeMs}`);
    }, rootName);
  }

  return snapshot;
}

function collectOutputFiles(workspaceDir, beforeSnapshot, startMs, endMs) {
  const files = [];

  for (const rootName of OUTPUT_SCAN_ROOTS) {
    const rootDir = path.join(workspaceDir, rootName);
    walkFiles(rootDir, (fullPath, relativePath) => {
      const stat = fs.statSync(fullPath);
      const previous = beforeSnapshot.get(relativePath);
      const current = `${stat.size}:${stat.mtimeMs}`;

      if (previous === current) {
        return;
      }

      if (stat.mtimeMs < startMs - 2_000 || stat.mtimeMs > endMs + 2_000) {
        return;
      }

      files.push({
        fileName: path.basename(fullPath),
        filePath: fullPath,
        relativePath,
        extension: path.extname(fullPath).replace(/^\./, ""),
        sizeBytes: stat.size,
      });
    }, rootName);
  }

  return files;
}

function persistTaskOutputs(agenticOsDir, taskId, files) {
  const db = getDb(agenticOsDir);
  db.prepare("DELETE FROM task_outputs WHERE taskId = ?").run(taskId);

  for (const file of files) {
    db.prepare(
      `INSERT INTO task_outputs (id, taskId, fileName, filePath, relativePath, extension, sizeBytes, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      randomUUID(),
      taskId,
      file.fileName,
      file.filePath,
      file.relativePath,
      file.extension,
      file.sizeBytes,
      new Date().toISOString()
    );
  }
}

function markTaskRunning(agenticOsDir, taskId) {
  const db = getDb(agenticOsDir);
  const now = new Date().toISOString();
  db.prepare(
    `UPDATE tasks
     SET status = 'running',
         startedAt = COALESCE(startedAt, ?),
         updatedAt = ?,
         activityLabel = 'Running scheduled job...',
         errorMessage = NULL,
         needsInput = 0
     WHERE id = ?`
  ).run(now, now, taskId);
  return db.prepare("SELECT * FROM tasks WHERE id = ?").get(taskId);
}

function finalizeTask(agenticOsDir, taskId, payload) {
  const db = getDb(agenticOsDir);
  const completedAt = payload.completedAt || new Date().toISOString();
  const nextStatus = payload.result === "success" ? "done" : "review";
  db.prepare(
    `UPDATE tasks
     SET status = ?,
         updatedAt = ?,
         completedAt = ?,
         durationMs = ?,
         errorMessage = ?,
         activityLabel = ?,
         claudePid = NULL
     WHERE id = ?`
  ).run(
    nextStatus,
    completedAt,
    completedAt,
    payload.durationMs,
    payload.errorMessage || null,
    payload.activityLabel || (payload.result === "success" ? "Completed" : "Failed"),
    taskId
  );

  return db.prepare("SELECT * FROM tasks WHERE id = ?").get(taskId);
}

function spawnClaudeRun(job, cwd, logFilePath) {
  return new Promise((resolve, reject) => {
    const env = { ...process.env };
    delete env.CLAUDECODE;
    const claudeCommand = env.AGENTIC_OS_CLAUDE_BIN || "claude";
    const claudeArgs = ["-p", job.prompt, "--model", job.model, "--dangerously-skip-permissions"];
    const useWindowsCmdShell =
      process.platform === "win32" && /\.(cmd|bat)$/i.test(String(claudeCommand));

    const child = spawn(claudeCommand, claudeArgs, {
      shell: useWindowsCmdShell,
      cwd,
      env,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    let timedOut = false;
    let settled = false;
    const timeoutMs = parseTimeoutToMs(job.timeout);

    const onStreamData = (streamName, chunk) => {
      const text = chunk.toString();
      if (streamName === "stdout") {
        stdout += text;
      } else {
        stderr += text;
      }
      fs.appendFileSync(logFilePath, text, "utf-8");
    };

    child.stdout.on("data", (chunk) => onStreamData("stdout", chunk));
    child.stderr.on("data", (chunk) => onStreamData("stderr", chunk));
    child.on("error", (error) => {
      if (settled) return;
      settled = true;
      reject(error);
    });

    const timeoutHandle = setTimeout(() => {
      timedOut = true;
      try {
        child.kill("SIGTERM");
      } catch {
        // Ignore kill errors.
      }

      setTimeout(() => {
        try {
          child.kill("SIGKILL");
        } catch {
          // Ignore kill errors.
        }
      }, 5_000).unref();
    }, timeoutMs);

    child.on("close", (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeoutHandle);
      resolve({
        exitCode: timedOut ? 124 : (code || 0),
        timedOut,
        stdout,
        stderr,
      });
    });
  });
}

async function executeCronTask(agenticOsDir, taskId) {
  const db = getDb(agenticOsDir);
  const originalTask = db.prepare("SELECT * FROM tasks WHERE id = ?").get(taskId);
  if (!originalTask || !originalTask.cronJobSlug) {
    throw new Error(`Queued cron task not found: ${taskId}`);
  }

  const job = getCronJob(agenticOsDir, originalTask.cronJobSlug, originalTask.clientId);
  if (!job) {
    const missingTask = finalizeTask(agenticOsDir, taskId, {
      result: "failure",
      errorMessage: `Cron job definition not found: ${originalTask.cronJobSlug}`,
      durationMs: 0,
      activityLabel: "Cron job missing",
    });
    completeCronRunForTask(agenticOsDir, missingTask, {
      result: "failure",
      exitCode: 1,
      durationMs: 0,
    });
    return {
      task: missingTask,
      result: "failure",
      exitCode: 1,
      durationMs: 0,
    };
  }

  const workspace = getWorkspacePaths(agenticOsDir, originalTask.clientId);
  fs.mkdirSync(workspace.logsDir, { recursive: true });
  fs.mkdirSync(workspace.statusDir, { recursive: true });
  const logFilePath = path.join(workspace.logsDir, `${job.slug}.log`);
  const startIso = new Date().toISOString();
  const startMs = Date.now();
  const beforeSnapshot = takeOutputSnapshot(workspace.workspaceDir);

  appendCronLog(
    agenticOsDir,
    job.clientId,
    job.slug,
    `\n=== [${startIso}] START: ${job.name} ===`
  );

  markTaskRunning(agenticOsDir, taskId);

  let attempt = 0;
  let lastRun = { exitCode: 1, timedOut: false, stdout: "", stderr: "" };
  const maxAttempts = Math.max(1, Number(job.retry || 0) + 1);

  while (attempt < maxAttempts) {
    attempt += 1;
    if (maxAttempts > 1) {
      appendCronLog(
        agenticOsDir,
        job.clientId,
        job.slug,
        `--- Attempt ${attempt}/${maxAttempts} ---`
      );
    }

    try {
      lastRun = await spawnClaudeRun(job, workspace.workspaceDir, logFilePath);
    } catch (error) {
      lastRun = {
        exitCode: 1,
        timedOut: false,
        stdout: "",
        stderr: error instanceof Error ? error.message : String(error),
      };
      appendCronLog(agenticOsDir, job.clientId, job.slug, `[cron-daemon] ${lastRun.stderr}`);
    }

    if (!lastRun.timedOut && lastRun.exitCode === 0) {
      break;
    }
  }

  const completedAt = new Date().toISOString();
  const endMs = Date.now();
  const durationMs = endMs - startMs;
  const result = lastRun.timedOut ? "timeout" : lastRun.exitCode === 0 ? "success" : "failure";
  const outputs = collectOutputFiles(workspace.workspaceDir, beforeSnapshot, startMs, endMs);
  persistTaskOutputs(agenticOsDir, taskId, outputs);

  appendCronLog(
    agenticOsDir,
    job.clientId,
    job.slug,
    `=== [${completedAt}] ${result.toUpperCase()}: ${job.name} (${Math.round(durationMs / 1000)}s) ===`
  );

  const updatedTask = finalizeTask(agenticOsDir, taskId, {
    result,
    errorMessage: result === "success" ? null : lastRun.stderr || `Exit code ${lastRun.exitCode}`,
    durationMs,
    completedAt,
    activityLabel:
      result === "success"
        ? "Scheduled job completed"
        : result === "timeout"
          ? `Timed out after ${job.timeout}`
          : `Failed with exit code ${lastRun.exitCode}`,
  });

  completeCronRunForTask(agenticOsDir, updatedTask, {
    result,
    exitCode: lastRun.exitCode,
    durationMs,
    completedAt,
  });

  return {
    task: updatedTask,
    result,
    exitCode: lastRun.exitCode,
    durationMs,
    outputs,
  };
}

async function runCronJobNow(agenticOsDir, slug, clientId) {
  const job = getCronJob(agenticOsDir, slug, clientId);
  if (!job) {
    throw new Error(`Cron job not found: ${slug}`);
  }

  const queued = enqueueCronJob(agenticOsDir, job, {
    trigger: "manual",
    dedupeByMinute: false,
    titleSuffix: " (manual run)",
    activityLabel: "Queued — manual trigger",
    scheduledFor: new Date().toISOString(),
  });

  return executeCronTask(agenticOsDir, queued.task.id);
}

function hasActiveCronJobs(agenticOsDir) {
  return listAllCronJobs(agenticOsDir).some(
    (job) => job.active && job.prompt && isSupportedCronSchedule(job.time, job.days)
  );
}

module.exports = {
  DEFAULT_TIMEOUT,
  RUNTIME_LOG_FILE,
  RUNTIME_STALE_MS,
  resolveAgenticOsRoot,
  normalizeClientId,
  workspaceKeyFor,
  listWorkspaceDescriptors,
  getWorkspacePaths,
  isSupportedCronDays,
  isSupportedCronTime,
  isSupportedCronSchedule,
  getCronScheduleValidationError,
  matchesDays,
  matchesTime,
  isFixedTimeSchedule,
  getNextRunForSchedule,
  getMissedFixedRuns,
  toMinuteIso,
  getDb,
  listCronJobs,
  listAllCronJobs,
  getCronJob,
  createCronJob,
  updateCronJob,
  deleteCronJob,
  getCronRunHistory,
  getRawJobFile,
  getCronJobLog,
  appendCronLog,
  readRunStatus,
  readRuntimeRecord,
  readDaemonPid,
  isProcessAlive,
  isRuntimeRecordStale,
  writeDaemonPid,
  removeDaemonPid,
  claimRuntimeLeadership,
  refreshRuntimeHeartbeat,
  releaseRuntimeLeadership,
  getManagedRuntimeStatus,
  getRuntimePaths,
  getRuntimeCommands,
  enqueueCronJob,
  completeCronRunForTask,
  executeCronTask,
  runCronJobNow,
  hasActiveCronJobs,
};
