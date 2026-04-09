import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";
import path from "path";

// command-centre lives at {root}/projects/briefs/command-centre.
// Auto-detect the repo root for local development unless the user overrides it.
if (!process.env.AGENTIC_OS_DIR) {
  process.env.AGENTIC_OS_DIR = path.resolve(__dirname, "../../..");
}

const rootDir = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  serverExternalPackages: ["better-sqlite3"],
  turbopack: {
    root: rootDir,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
