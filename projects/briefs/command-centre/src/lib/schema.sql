CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'backlog' CHECK (status IN ('backlog', 'queued', 'running', 'review', 'done')),
  level TEXT NOT NULL DEFAULT 'task' CHECK (level IN ('task', 'project', 'gsd')),
  parentId TEXT,
  columnOrder INTEGER NOT NULL DEFAULT 0,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  costUsd REAL,
  tokensUsed INTEGER,
  durationMs INTEGER,
  activityLabel TEXT,
  errorMessage TEXT,
  startedAt TEXT,
  completedAt TEXT,
  FOREIGN KEY (parentId) REFERENCES tasks(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_parentId ON tasks(parentId);

CREATE TABLE IF NOT EXISTS task_outputs (
  id TEXT PRIMARY KEY,
  taskId TEXT NOT NULL,
  fileName TEXT NOT NULL,
  filePath TEXT NOT NULL,
  relativePath TEXT NOT NULL,
  extension TEXT NOT NULL DEFAULT '',
  sizeBytes INTEGER,
  createdAt TEXT NOT NULL,
  FOREIGN KEY (taskId) REFERENCES tasks(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_task_outputs_taskId ON task_outputs(taskId);
