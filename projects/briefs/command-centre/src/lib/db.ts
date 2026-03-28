import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { getConfig } from "./config";

let db: Database.Database | null = null;

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

  // Migration: add permissionMode column for controlling Claude CLI permission mode per task
  const permCol = db.prepare("PRAGMA table_info(tasks)").all() as Array<{ name: string }>;
  if (!permCol.some((c) => c.name === "permissionMode")) {
    db.exec("ALTER TABLE tasks ADD COLUMN permissionMode TEXT DEFAULT 'default'");
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

  // Migration: add surfacedToConversation to task_logs
  const logSurfCol = db.prepare("PRAGMA table_info(task_logs)").all() as Array<{ name: string }>;
  if (!logSurfCol.some((c) => c.name === "surfacedToConversation")) {
    db.exec("ALTER TABLE task_logs ADD COLUMN surfacedToConversation INTEGER DEFAULT 0");
  }

  return db;
}
