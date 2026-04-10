import path from "path";
import fs from "fs";

interface Config {
  agenticOsDir: string;
  dbPath: string;
}

let cachedConfig: Config | null = null;
const workspaceMarkers = ["AGENTS.md", "CLAUDE.md"];

function isAgenticOsRoot(targetDir: string): boolean {
  return workspaceMarkers.some((marker) => fs.existsSync(path.join(targetDir, marker)));
}

function findAgenticOsRoot(startDir: string): string | null {
  let currentDir = startDir;

  for (let depth = 0; depth < 10; depth += 1) {
    if (isAgenticOsRoot(currentDir)) {
      return currentDir;
    }

    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      break;
    }

    currentDir = parentDir;
  }

  return null;
}

function resolveAgenticOsRoot(): string {
  const configuredRoot = process.env.AGENTIC_OS_DIR;
  if (configuredRoot) {
    const resolvedRoot = path.resolve(configuredRoot);
    if (!isAgenticOsRoot(resolvedRoot)) {
      throw new Error(
        `AGENTIC_OS_DIR must point to an Agentic OS workspace containing ${workspaceMarkers.join(" or ")}: ${resolvedRoot}`
      );
    }
    return resolvedRoot;
  }

  const detectedRoot = findAgenticOsRoot(__dirname);
  if (!detectedRoot) {
    throw new Error("Unable to locate the Agentic OS workspace root from command-centre.");
  }

  return detectedRoot;
}

export function getConfig(): Config {
  if (cachedConfig) return cachedConfig;

  const agenticOsDir = resolveAgenticOsRoot();
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
