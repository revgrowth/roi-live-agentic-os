import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const configDir = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = resolve(configDir, "..", "..", "..");

const nextConfig: NextConfig = {
  outputFileTracingRoot: workspaceRoot,
  serverExternalPackages: ["better-sqlite3"],
  turbopack: {
    root: workspaceRoot,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
