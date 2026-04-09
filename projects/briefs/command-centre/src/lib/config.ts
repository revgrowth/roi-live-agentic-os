import path from "path";
import fs from "fs";

interface Config {
  agenticOsDir: string;
  dbPath: string;
}

let cachedConfig: Config | null = null;

function findAgenticOsRoot(startDir: string): string {
  let currentDir = startDir;

  for (let depth = 0; depth < 10; depth += 1) {
    if (fs.existsSync(path.join(currentDir, "AGENTS.md"))) {
      return currentDir;
    }

    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      break;
    }

    currentDir = parentDir;
  }

  return path.resolve(__dirname, "..", "..", "..", "..", "..");
}

export function getConfig(): Config {
  if (cachedConfig) return cachedConfig;

  const agenticOsDir =
    process.env.AGENTIC_OS_DIR || findAgenticOsRoot(__dirname);
  const dataDir = path.join(agenticOsDir, ".command-centre");
  const dbPath = path.join(dataDir, "data.db");

  // Ensure .command-centre directory exists
  fs.mkdirSync(dataDir, { recursive: true });

  cachedConfig = { agenticOsDir, dbPath };
  return cachedConfig;
}

/**
 * Resolve the agentic-os directory for a specific client,
 * or the root agentic-os directory if no clientId is provided.
 */
export function getClientAgenticOsDir(clientId: string | null): string {
  const config = getConfig();
  if (!clientId) return config.agenticOsDir;
  return path.join(config.agenticOsDir, "clients", clientId);
}
