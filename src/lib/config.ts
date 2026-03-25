import path from "path";
import fs from "fs";

interface Config {
  agenticOsDir: string;
  dbPath: string;
}

let cachedConfig: Config | null = null;

export function getConfig(): Config {
  if (cachedConfig) return cachedConfig;

  const agenticOsDir = process.env.AGENTIC_OS_DIR || process.cwd();
  const dataDir = path.join(agenticOsDir, ".command-centre");
  const dbPath = path.join(dataDir, "data.db");

  // Ensure .command-centre directory exists
  fs.mkdirSync(dataDir, { recursive: true });

  cachedConfig = { agenticOsDir, dbPath };
  return cachedConfig;
}
