import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { getConfig } from "./config";

let db: Database.Database | null = null;

function cronRunsSupportsTimeout(database: Database.Database): boolean {
  const row = database
    .prepare("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'cron_runs'")
    .get() as { sql?: string } | undefined;

  return row?.sql?.includes("'timeout'") ?? false;
}

function migrateCronRunsForTimeout(database: Database.Database) {
  database.exec(`
    BEGIN;
    CREATE TABLE cron_runs_new (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      jobSlug TEXT NOT NULL,
      taskId TEXT,
      startedAt TEXT NOT NULL,
      completedAt TEXT,
      result TEXT NOT NULL DEFAULT 'running' CHECK (result IN ('success', 'failure', 'timeout', 'running')),
      durationSec REAL,
      costUsd REAL,
      exitCode INTEGER,
      trigger TEXT DEFAULT 'scheduled',
      createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    );
    INSERT INTO cron_runs_new (id, jobSlug, taskId, startedAt, completedAt, result, durationSec, costUsd, exitCode, trigger, createdAt)
    SELECT id, jobSlug, taskId, startedAt, completedAt, result, durationSec, costUsd, exitCode, trigger, createdAt
    FROM cron_runs;
    DROP TABLE cron_runs;
    ALTER TABLE cron_runs_new RENAME TO cron_runs;
    CREATE INDEX IF NOT EXISTS idx_cron_runs_jobSlug ON cron_runs(jobSlug);
    CREATE INDEX IF NOT EXISTS idx_cron_runs_startedAt ON cron_runs(startedAt);
    COMMIT;
  `);
}

export function getDb(): Database.Database {
  if (db) return db;

  const config = getConfig();

  db = new Database(config.dbPath);

  // Enable WAL mode for better concurrent read performance
  db.pragma("journal_mode = WAL");

  // Read and execute schema
  const schemaPath = path.join(__dirname, "schema.sql");
  let schemaSql: string;

  try {
    schemaSql = fs.readFileSync(schemaPath, "utf-8");
  } catch {
    // In Next.js bundled environment, __dirname may not resolve correctly.
    // Fall back to reading from src/lib/schema.sql relative to cwd.
    const fallbackPath = path.join(process.cwd(), "src", "lib", "schema.sql");
    schemaSql = fs.readFileSync(fallbackPath, "utf-8");
  }

  db.exec(schemaSql);

  // Migration: add clientId column if it doesn't exist
  const columns = db.prepare("PRAGMA table_info(tasks)").all() as Array<{ name: string }>;
  if (!columns.some((c) => c.name === "clientId")) {
    db.exec("ALTER TABLE tasks ADD COLUMN clientId TEXT");
    db.exec("CREATE INDEX IF NOT EXISTS idx_tasks_clientId ON tasks(clientId)");
  }

  // Migration: add description column if it doesn't exist
  const descCol = db.prepare("PRAGMA table_info(tasks)").all() as Array<{ name: string }>;
  if (!descCol.some((c) => c.name === "description")) {
    db.exec("ALTER TABLE tasks ADD COLUMN description TEXT");
  }

  // Migration: add projectSlug column if it doesn't exist
  const projCol = db.prepare("PRAGMA table_info(tasks)").all() as Array<{ name: string }>;
  if (!projCol.some((c) => c.name === "projectSlug")) {
    db.exec("ALTER TABLE tasks ADD COLUMN projectSlug TEXT");
    db.exec("CREATE INDEX IF NOT EXISTS idx_tasks_projectSlug ON tasks(projectSlug)");
  }

  // Migration: add needsInput column if it doesn't exist
  const needsCol = db.prepare("PRAGMA table_info(tasks)").all() as Array<{ name: string }>;
  if (!needsCol.some((c) => c.name === "needsInput")) {
    db.exec("ALTER TABLE tasks ADD COLUMN needsInput INTEGER NOT NULL DEFAULT 0");
  }

  // Migration: add claudeSessionId column for --resume support
  const sessionCol = db.prepare("PRAGMA table_info(tasks)").all() as Array<{ name: string }>;
  if (!sessionCol.some((c) => c.name === "claudeSessionId")) {
    db.exec("ALTER TABLE tasks ADD COLUMN claudeSessionId TEXT");
  }

  // Migration: add contextSources column — JSON of what context was loaded at task start
  const ctxCol = db.prepare("PRAGMA table_info(tasks)").all() as Array<{ name: string }>;
  if (!ctxCol.some((c) => c.name === "contextSources")) {
    db.exec("ALTER TABLE tasks ADD COLUMN contextSources TEXT");
  }

  // Migration: add phaseNumber and gsdStep columns for GSD sub-tasks
  const phaseCol = db.prepare("PRAGMA table_info(tasks)").all() as Array<{ name: string }>;
  if (!phaseCol.some((c) => c.name === "phaseNumber")) {
    db.exec("ALTER TABLE tasks ADD COLUMN phaseNumber INTEGER");
  }
  if (!phaseCol.some((c) => c.name === "gsdStep")) {
    db.exec("ALTER TABLE tasks ADD COLUMN gsdStep TEXT CHECK (gsdStep IN ('discuss', 'plan', 'execute', 'verify'))");
  }

  // Migration: add cronJobSlug column for cron-to-task linking
  const cronCol = db.prepare("PRAGMA table_info(tasks)").all() as Array<{ name: string }>;
  if (!cronCol.some((c) => c.name === "cronJobSlug")) {
    db.exec("ALTER TABLE tasks ADD COLUMN cronJobSlug TEXT");
    db.exec("CREATE INDEX IF NOT EXISTS idx_tasks_cronJobSlug ON tasks(cronJobSlug)");
  }

  // Migration: add claudePid column for process-alive reaper
  const pidCol = db.prepare("PRAGMA table_info(tasks)").all() as Array<{ name: string }>;
  if (!pidCol.some((c) => c.name === "claudePid")) {
    db.exec("ALTER TABLE tasks ADD COLUMN claudePid INTEGER");
  }

  // Migration: add taskId column to cron_runs for linking runs to task outputs
  const cronRunCols = db.prepare("PRAGMA table_info(cron_runs)").all() as Array<{ name: string }>;
  if (!cronRunCols.some((c) => c.name === "taskId")) {
    db.exec("ALTER TABLE cron_runs ADD COLUMN taskId TEXT");
  }

  // Migration: add trigger column to cron_runs for manual vs scheduled distinction
  const cronRunTriggerCol = db.prepare("PRAGMA table_info(cron_runs)").all() as Array<{ name: string }>;
  if (!cronRunTriggerCol.some((c) => c.name === "trigger")) {
    db.exec("ALTER TABLE cron_runs ADD COLUMN trigger TEXT DEFAULT 'scheduled'");
  }

  if (!cronRunsSupportsTimeout(db)) {
    migrateCronRunsForTimeout(db);
  }

  // Migration: add permissionMode column for controlling Claude CLI permission mode per task
  const permCol = db.prepare("PRAGMA table_info(tasks)").all() as Array<{ name: string }>;
  if (!permCol.some((c) => c.name === "permissionMode")) {
    db.exec("ALTER TABLE tasks ADD COLUMN permissionMode TEXT DEFAULT 'default'");
  }

  // Migration: add model column for selecting Claude model per task
  const modelCol = db.prepare("PRAGMA table_info(tasks)").all() as Array<{ name: string }>;
  if (!modelCol.some((c) => c.name === "model")) {
    db.exec("ALTER TABLE tasks ADD COLUMN model TEXT");
  }

  // Migration: add conversationId column to tasks for autonomous mode linkage
  const convCol = db.prepare("PRAGMA table_info(tasks)").all() as Array<{ name: string }>;
  if (!convCol.some((c) => c.name === "conversationId")) {
    db.exec("ALTER TABLE tasks ADD COLUMN conversationId TEXT");
    db.exec("CREATE INDEX IF NOT EXISTS idx_tasks_conversationId ON tasks(conversationId)");
  }

  // Migration: add originMessageId column to tasks
  if (!convCol.some((c) => c.name === "originMessageId")) {
    db.exec("ALTER TABLE tasks ADD COLUMN originMessageId TEXT");
  }

  // Migration: add teamId column to tasks for Claude teams
  if (!convCol.some((c) => c.name === "teamId")) {
    db.exec("ALTER TABLE tasks ADD COLUMN teamId TEXT");
  }

  // Migration: add coordinationLevel column to tasks
  if (!convCol.some((c) => c.name === "coordinationLevel")) {
    db.exec("ALTER TABLE tasks ADD COLUMN coordinationLevel TEXT");
  }

  // Migration: add lastReplyAt column — tracks when the user last interacted
  const replyAtCol = db.prepare("PRAGMA table_info(tasks)").all() as Array<{ name: string }>;
  if (!replyAtCol.some((c) => c.name === "lastReplyAt")) {
    db.exec("ALTER TABLE tasks ADD COLUMN lastReplyAt TEXT");
  }

  // Migration: add surfacedToConversation to task_logs
  const logSurfCol = db.prepare("PRAGMA table_info(task_logs)").all() as Array<{ name: string }>;
  if (!logSurfCol.some((c) => c.name === "surfacedToConversation")) {
    db.exec("ALTER TABLE task_logs ADD COLUMN surfacedToConversation INTEGER DEFAULT 0");
  }

  // Migration: add goalGroup column for semantic task clustering
  const goalCol = db.prepare("PRAGMA table_info(tasks)").all() as Array<{ name: string }>;
  if (!goalCol.some((c) => c.name === "goalGroup")) {
    db.exec("ALTER TABLE tasks ADD COLUMN goalGroup TEXT");
    db.exec("CREATE INDEX IF NOT EXISTS idx_tasks_goalGroup ON tasks(goalGroup)");
  }

  // Migration: add questionSpec + questionAnswers columns to task_logs for
  // the structured-question system (pre- and mid-execution).
  const logCols = db.prepare("PRAGMA table_info(task_logs)").all() as Array<{ name: string }>;
  if (!logCols.some((c) => c.name === "questionSpec")) {
    db.exec("ALTER TABLE task_logs ADD COLUMN questionSpec TEXT");
  }
  if (!logCols.some((c) => c.name === "questionAnswers")) {
    db.exec("ALTER TABLE task_logs ADD COLUMN questionAnswers TEXT");
  }

  // Migration: older installs have a CHECK constraint on task_logs.type that
  // doesn't include 'structured_question'. SQLite can't alter CHECK
  // constraints in place, so recreate the table if needed.
  try {
    const tableSql = db
      .prepare("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'task_logs'")
      .get() as { sql: string } | undefined;
    if (tableSql && !tableSql.sql.includes("structured_question")) {
      console.log("[db] Migrating task_logs CHECK constraint to include structured_question");
      db.exec("BEGIN");
      try {
        db.exec(`CREATE TABLE task_logs_new (
          id TEXT PRIMARY KEY,
          taskId TEXT NOT NULL,
          type TEXT NOT NULL CHECK (type IN ('text', 'tool_use', 'tool_result', 'question', 'structured_question', 'user_reply', 'system')),
          timestamp TEXT NOT NULL,
          content TEXT NOT NULL DEFAULT '',
          toolName TEXT,
          toolArgs TEXT,
          toolResult TEXT,
          isCollapsed INTEGER DEFAULT 0,
          surfacedToConversation INTEGER DEFAULT 0,
          questionSpec TEXT,
          questionAnswers TEXT,
          FOREIGN KEY (taskId) REFERENCES tasks(id) ON DELETE CASCADE
        )`);
        // Copy data — use only columns known to exist in both tables
        const oldCols = db.prepare("PRAGMA table_info(task_logs)").all() as Array<{ name: string }>;
        const colNames = oldCols.map((c) => c.name);
        const shared = [
          "id", "taskId", "type", "timestamp", "content",
          "toolName", "toolArgs", "toolResult", "isCollapsed",
          "surfacedToConversation", "questionSpec", "questionAnswers",
        ].filter((c) => colNames.includes(c));
        const colList = shared.join(", ");
        db.exec(`INSERT INTO task_logs_new (${colList}) SELECT ${colList} FROM task_logs`);
        db.exec("DROP TABLE task_logs");
        db.exec("ALTER TABLE task_logs_new RENAME TO task_logs");
        db.exec("CREATE INDEX IF NOT EXISTS idx_task_logs_taskId ON task_logs(taskId)");
        db.exec("COMMIT");
      } catch (err) {
        db.exec("ROLLBACK");
        throw err;
      }
    }
  } catch (err) {
    console.error("[db] Failed to migrate task_logs CHECK constraint:", err);
  }

  // Migration: add dependsOnTaskIds column — JSON array of task IDs this task depends on
  try {
    db.exec("ALTER TABLE tasks ADD COLUMN dependsOnTaskIds TEXT");
  } catch (err) {
    // SQLite doesn't support IF NOT EXISTS on ADD COLUMN — swallow duplicate column error
    const msg = err instanceof Error ? err.message : String(err);
    if (!/duplicate column/i.test(msg)) throw err;
  }

  // Migration: add startSnapshot column for diff-aware Files tab
  try {
    db.exec("ALTER TABLE tasks ADD COLUMN startSnapshot TEXT");
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (!/duplicate column/i.test(msg)) throw err;
  }

  return db;
}
