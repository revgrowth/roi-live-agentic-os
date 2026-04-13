import fs from "fs";
import path from "path";
import { getConfig } from "./config";
import { Client, getClientColor, slugToName } from "../types/client";

/**
 * Detect client folders by scanning the clients/ directory
 * inside the configured agentic-os root.
 * Returns an empty array if the clients/ directory does not exist.
 */
export function detectClients(): Client[] {
  const config = getConfig();
  const clientsDir = path.join(config.agenticOsDir, "clients");

  if (!fs.existsSync(clientsDir)) {
    return [];
  }

  const entries = fs.readdirSync(clientsDir, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .map((entry) => ({
      slug: entry.name,
      name: slugToName(entry.name),
      path: `clients/${entry.name}`,
      color: getClientColor(entry.name),
    }));
}

/**
 * Return the display name for the root workspace (folder basename).
 */
export function getRootName(): string {
  const config = getConfig();
  return path.basename(config.agenticOsDir);
}

/**
 * Resolve the absolute directory for a given client.
 * If clientId is null/undefined, returns the agentic-os root.
 * Throws if the resolved directory does not exist.
 */
export function getClientDir(clientId: string | null): string {
  const config = getConfig();

  if (!clientId) {
    return config.agenticOsDir;
  }

  const dir = path.join(config.agenticOsDir, "clients", clientId);

  if (!fs.existsSync(dir)) {
    throw new Error(`Client directory not found: ${dir}`);
  }

  return dir;
}
