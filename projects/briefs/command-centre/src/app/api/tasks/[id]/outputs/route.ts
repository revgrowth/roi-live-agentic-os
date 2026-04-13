import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getConfig, getClientAgenticOsDir } from "@/lib/config";
import { classifyFileWithDisk, type FileSnapshot } from "@/lib/file-diff";
import type { OutputFile } from "@/types/task";
import path from "path";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;

  const db = getDb();

  // Verify task exists and get snapshot + projectSlug
  const task = db.prepare("SELECT id, startSnapshot, projectSlug, clientId FROM tasks WHERE id = ?").get(id) as
    | { id: string; startSnapshot: string | null; projectSlug: string | null; clientId: string | null }
    | undefined;
  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  const outputs = db
    .prepare("SELECT * FROM task_outputs WHERE taskId = ? ORDER BY createdAt ASC")
    .all(id) as OutputFile[];

  // Enrich with diff status if snapshot exists
  if (task.startSnapshot && task.projectSlug) {
    try {
      const snapshot: FileSnapshot = JSON.parse(task.startSnapshot);
      const config = getConfig();
      const cwd = task.clientId ? getClientAgenticOsDir(task.clientId) : config.agenticOsDir;
      const projectDir = path.join(cwd, "projects", "briefs", task.projectSlug);

      for (const file of outputs) {
        // Derive relative-to-project path from the full relativePath
        const projectPrefix = `projects/briefs/${task.projectSlug}/`;
        const relToProject = file.relativePath.startsWith(projectPrefix)
          ? file.relativePath.slice(projectPrefix.length)
          : file.relativePath;
        file.diffStatus = classifyFileWithDisk(snapshot, projectDir, relToProject);
      }
    } catch {
      // If parsing fails, leave diffStatus undefined
    }
  }

  return NextResponse.json(outputs);
}
