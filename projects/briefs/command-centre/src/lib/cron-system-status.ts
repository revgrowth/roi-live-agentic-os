import { execFileSync } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";
import type { CronSystemStatus } from "@/types/cron";

function toProjectSlug(agenticOsDir: string): string {
  return path
    .basename(agenticOsDir)
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function isWindowsTaskInstalled(taskName: string): boolean {
  try {
    const output = execFileSync(
      "powershell.exe",
      [
        "-NoProfile",
        "-Command",
        `$task = Get-ScheduledTask -TaskName '${taskName.replace(/'/g, "''")}' -ErrorAction SilentlyContinue; if ($task) { 'installed' }`,
      ],
      {
        encoding: "utf-8",
        stdio: ["ignore", "pipe", "ignore"],
      }
    );
    return output.trim() === "installed";
  } catch {
    return false;
  }
}

function isCrontabInstalled(dispatcherPath: string): boolean {
  try {
    const output = execFileSync("crontab", ["-l"], {
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    return output.includes(dispatcherPath);
  } catch {
    return false;
  }
}

export function getCronSystemStatus(agenticOsDir: string): CronSystemStatus {
  const projectSlug = toProjectSlug(agenticOsDir);

  if (process.platform === "win32") {
    const identifier = `AgenticOS-${projectSlug}`;
    return {
      platform: "windows",
      scheduler: "task-scheduler",
      installed: isWindowsTaskInstalled(identifier),
      identifier,
      installCommand: "powershell -NoProfile -ExecutionPolicy Bypass -File scripts\\install-crons.ps1",
      uninstallCommand: "powershell -NoProfile -ExecutionPolicy Bypass -File scripts\\uninstall-crons.ps1",
    };
  }

  if (process.platform === "darwin") {
    const identifier = path.join(
      os.homedir(),
      "Library",
      "LaunchAgents",
      `com.agentic-os.${projectSlug}.plist`
    );
    return {
      platform: "macos",
      scheduler: "launchd",
      installed: fs.existsSync(identifier),
      identifier,
      installCommand: "bash scripts/install-crons.sh",
      uninstallCommand: "bash scripts/uninstall-crons.sh",
    };
  }

  const dispatcherPath = path.join(agenticOsDir, "scripts", "run-crons.sh");
  return {
    platform: "linux",
    scheduler: "crontab",
    installed: isCrontabInstalled(dispatcherPath),
    identifier: `* * * * * ${dispatcherPath}`,
    installCommand: "bash scripts/install-crons.sh",
    uninstallCommand: "bash scripts/uninstall-crons.sh",
  };
}
