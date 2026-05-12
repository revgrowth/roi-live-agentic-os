import {
  spawn,
  spawnSync,
  type ChildProcess,
  type SpawnOptions,
} from "child_process";

const isWindows = process.platform === "win32";

function withQuietWindowsOptions(options: SpawnOptions = {}): SpawnOptions {
  if (!isWindows) {
    return options;
  }

  return {
    ...options,
    windowsHide: true,
  };
}

// Node's spawn with { shell: true } on Windows does NOT escape args — it just
// concatenates command + args with spaces, so any arg containing whitespace is
// split into multiple tokens by cmd.exe. Build the full command line ourselves
// with cmd-safe quoting and pass it as a single string.
function quoteCmdArg(arg: string): string {
  if (arg.length === 0) return '""';
  if (!/[\s"&|<>()^%!]/.test(arg)) return arg;
  return `"${arg.replace(/"/g, '""')}"`;
}

function buildWindowsShellCommand(command: string, args: readonly string[]): string {
  const quotedCommand = /\s/.test(command) ? `"${command}"` : command;
  if (args.length === 0) return quotedCommand;
  return `${quotedCommand} ${args.map(quoteCmdArg).join(" ")}`;
}

export function spawnUiProcess(
  command: string,
  args: readonly string[],
  options: SpawnOptions = {},
): ChildProcess {
  const quietOptions = withQuietWindowsOptions(options);
  if (isWindows) {
    return spawn(buildWindowsShellCommand(command, args), { ...quietOptions, shell: true });
  }
  return spawn(command, [...args], quietOptions);
}

export function spawnManagedTaskProcess(
  command: string,
  args: readonly string[],
  options: SpawnOptions = {},
): ChildProcess {
  const quietOptions = withQuietWindowsOptions(options);

  if (isWindows) {
    const { detached: _ignored, ...rest } = quietOptions;
    return spawn(buildWindowsShellCommand(command, args), { ...rest, shell: true });
  }

  return spawn(command, [...args], {
    ...quietOptions,
    detached: options.detached ?? true,
  });
}

export function killChildProcessTree(
  proc: ChildProcess,
  signal: NodeJS.Signals = "SIGTERM",
): void {
  if (!proc.pid) {
    return;
  }

  if (isWindows) {
    const taskkillArgs = ["/PID", String(proc.pid), "/T"];
    if (signal === "SIGKILL") {
      taskkillArgs.push("/F");
    }

    const result = spawnSync("taskkill", taskkillArgs, {
      stdio: "ignore",
      windowsHide: true,
    });

    if (!result.error && result.status === 0) {
      return;
    }
  }

  try {
    process.kill(-proc.pid, signal);
  } catch {
    try {
      proc.kill(signal);
    } catch {
      // Process already exited.
    }
  }
}
