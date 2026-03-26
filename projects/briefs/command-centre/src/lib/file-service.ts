import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getConfig } from "./config";
import type { FileNode, FileContent, SkillDependency, InstalledSkill } from "@/types/file";

/**
 * Validate that a resolved path is within the agentic-os directory.
 * Prevents directory traversal attacks.
 */
function validatePath(resolved: string): void {
  const { agenticOsDir } = getConfig();
  const normalizedRoot = path.resolve(agenticOsDir);
  const normalizedTarget = path.resolve(resolved);
  if (!normalizedTarget.startsWith(normalizedRoot + path.sep) && normalizedTarget !== normalizedRoot) {
    throw new Error("Path traversal detected: access denied");
  }
}

/**
 * Resolve a relative path to an absolute path within the agentic-os directory.
 */
function resolvePath(relativePath: string): string {
  const { agenticOsDir } = getConfig();
  const resolved = path.join(agenticOsDir, relativePath);
  validatePath(resolved);
  return resolved;
}

/**
 * List immediate children of a directory.
 * For context/memory/ specifically: sort by filename descending, limit entries.
 */
export function listDirectory(relativePath: string, options?: { limit?: number }): FileNode[] {
  const resolved = resolvePath(relativePath);

  if (!fs.existsSync(resolved) || !fs.statSync(resolved).isDirectory()) {
    throw new Error(`Directory not found: ${relativePath}`);
  }

  const entries = fs.readdirSync(resolved, { withFileTypes: true });

  let nodes: FileNode[] = entries
    .filter((entry) => !entry.name.startsWith("."))
    .map((entry) => {
      const fullPath = path.join(resolved, entry.name);
      const stat = fs.statSync(fullPath);
      return {
        name: entry.name,
        path: path.join(relativePath, entry.name),
        type: entry.isDirectory() ? ("directory" as const) : ("file" as const),
        lastModified: stat.mtime.toISOString(),
        size: stat.size,
      };
    });

  // For context/memory/ specifically: sort newest first and limit
  if (relativePath === "context/memory" || relativePath === "context/memory/") {
    nodes.sort((a, b) => b.name.localeCompare(a.name));
    const limit = options?.limit || 30;
    nodes = nodes.slice(0, limit);
  }

  return nodes;
}

/**
 * Read a file's content and metadata.
 */
export function readFile(relativePath: string): FileContent {
  const resolved = resolvePath(relativePath);

  if (!fs.existsSync(resolved)) {
    throw new Error(`File not found: ${relativePath}`);
  }

  const content = fs.readFileSync(resolved, "utf-8");
  const stat = fs.statSync(resolved);

  return {
    path: relativePath,
    content,
    lastModified: stat.mtime.toISOString(),
  };
}

/**
 * Write a file with atomic write and optimistic concurrency check.
 */
export function writeFile(relativePath: string, content: string, expectedLastModified?: string): FileContent {
  const resolved = resolvePath(relativePath);

  // Optimistic concurrency check
  if (expectedLastModified && fs.existsSync(resolved)) {
    const stat = fs.statSync(resolved);
    const currentModified = stat.mtime.toISOString();
    if (currentModified !== expectedLastModified) {
      throw new Error("File was modified since you loaded it. Reload and try again.");
    }
  }

  // Atomic write: write to temp file, then rename
  const tmpPath = resolved + ".tmp";
  fs.writeFileSync(tmpPath, content, "utf-8");
  fs.renameSync(tmpPath, resolved);

  const stat = fs.statSync(resolved);
  return {
    path: relativePath,
    content,
    lastModified: stat.mtime.toISOString(),
  };
}

/**
 * Parse ## Dependencies markdown table from SKILL.md body.
 */
function parseDependencies(markdownBody: string): SkillDependency[] {
  const depsMatch = markdownBody.match(
    /## Dependencies\s*\n[\s\S]*?\|[\s\S]*?\n\|[-\s|]+\n([\s\S]*?)(?=\n##|\n*$)/
  );
  if (!depsMatch) return [];

  const rows = depsMatch[1]
    .trim()
    .split("\n")
    .filter((r) => r.includes("|"));

  return rows
    .map((row) => {
      const cells = row
        .split("|")
        .map((c) => c.trim())
        .filter(Boolean);
      return {
        skill: cells[0]?.replace(/`/g, "") || "",
        required: (cells[1] || "").toLowerCase().includes("required"),
        description: cells[2] || "",
        fallback: cells[3] || "",
      };
    })
    .filter((d) => d.skill);
}

/**
 * List all installed skills by reading .claude/skills/ SKILL.md files.
 */
export function listSkills(): InstalledSkill[] {
  const { agenticOsDir } = getConfig();
  const skillsDir = path.join(agenticOsDir, ".claude", "skills");

  if (!fs.existsSync(skillsDir)) return [];

  const entries = fs.readdirSync(skillsDir, { withFileTypes: true });
  const skills: InstalledSkill[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name === "_catalog") continue;

    const skillMdPath = path.join(skillsDir, entry.name, "SKILL.md");
    if (!fs.existsSync(skillMdPath)) continue;

    try {
      const raw = fs.readFileSync(skillMdPath, "utf-8");
      const { data, content } = matter(raw);

      skills.push({
        name: (data.name as string) || entry.name,
        category: entry.name.split("-")[0],
        description: (data.description as string) || "",
        triggers: (data.triggers as string[]) || [],
        folderName: entry.name,
        dependencies: parseDependencies(content),
      });
    } catch {
      skills.push({
        name: entry.name,
        category: entry.name.split("-")[0],
        description: "Unable to read skill details",
        triggers: [],
        folderName: entry.name,
        dependencies: [],
      });
    }
  }

  return skills;
}
