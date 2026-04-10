Set-StrictMode -Version 3.0
$ErrorActionPreference = "Stop"

$RepoRoot = Split-Path -Parent $PSScriptRoot

function Assert-True {
    param(
        [bool]$Condition,
        [string]$Message
    )

    if (-not $Condition) {
        throw $Message
    }
}

function Resolve-PythonCommand {
    $candidates = @(
        @{ FilePath = "py"; Arguments = @("-3") },
        @{ FilePath = "python"; Arguments = @() },
        @{ FilePath = "python3"; Arguments = @() }
    )

    foreach ($candidate in $candidates) {
        $probe = & $candidate.FilePath @($candidate.Arguments + @("-c", "import sys; print(sys.version_info[0])")) 2>$null
        if ($LASTEXITCODE -eq 0 -and ($probe | Out-String).Trim() -eq "3") {
            return $candidate
        }
    }

    throw "Python 3 is required for cron smoke tests."
}

function Invoke-PythonScript {
    param(
        [hashtable]$Python,
        [string]$Script,
        [string[]]$Arguments
    )

    $scriptPath = Join-Path ([System.IO.Path]::GetTempPath()) ("agentic-os-python-" + [guid]::NewGuid().ToString("N") + ".py")
    Set-Content -Path $scriptPath -Value $Script -Encoding UTF8

    try {
        $output = & $Python.FilePath @($Python.Arguments + @($scriptPath) + $Arguments)
        if ($LASTEXITCODE -ne 0) {
            throw "Python invocation failed."
        }

        return $output
    } finally {
        Remove-Item -LiteralPath $scriptPath -ErrorAction SilentlyContinue
    }
}

function Invoke-PythonJson {
    param(
        [hashtable]$Python,
        [string]$Script,
        [string[]]$Arguments
    )

    $output = Invoke-PythonScript -Python $Python -Script $Script -Arguments $Arguments
    return ($output | Out-String) | ConvertFrom-Json
}

function Write-TestJob {
    param(
        [string]$Path,
        [string]$Name,
        [string]$Time,
        [string]$Days,
        [string]$Prompt,
        [string]$Timeout = "30m"
    )

    $content = @"
---
name: "$Name"
time: "$Time"
days: "$Days"
active: "true"
model: "sonnet"
notify: "silent"
timeout: "$Timeout"
retry: "0"
---
$Prompt
"@

    Set-Content -Path $Path -Value $content -Encoding UTF8
}

$python = Resolve-PythonCommand
$tempRoot = Join-Path ([System.IO.Path]::GetTempPath()) ("agentic-os-cron-smoke-" + [guid]::NewGuid().ToString("N"))

try {
    New-Item -ItemType Directory -Force -Path $tempRoot | Out-Null
    New-Item -ItemType Directory -Force -Path (Join-Path $tempRoot "scripts\lib") | Out-Null
    New-Item -ItemType Directory -Force -Path (Join-Path $tempRoot "cron\jobs") | Out-Null
    New-Item -ItemType Directory -Force -Path (Join-Path $tempRoot "cron\logs") | Out-Null
    New-Item -ItemType Directory -Force -Path (Join-Path $tempRoot "cron\status") | Out-Null
    New-Item -ItemType Directory -Force -Path (Join-Path $tempRoot "projects\test") | Out-Null
    New-Item -ItemType Directory -Force -Path (Join-Path $tempRoot ".command-centre") | Out-Null

    Copy-Item -LiteralPath (Join-Path $RepoRoot "scripts\run-job.ps1") -Destination (Join-Path $tempRoot "scripts\run-job.ps1")
    Copy-Item -LiteralPath (Join-Path $RepoRoot "scripts\run-crons.ps1") -Destination (Join-Path $tempRoot "scripts\run-crons.ps1")
    Copy-Item -LiteralPath (Join-Path $RepoRoot "scripts\lib\cron-windows.ps1") -Destination (Join-Path $tempRoot "scripts\lib\cron-windows.ps1")
    Copy-Item -LiteralPath (Join-Path $RepoRoot "scripts\lib\cron-db.py") -Destination (Join-Path $tempRoot "scripts\lib\cron-db.py")

    $dbPath = Join-Path $tempRoot ".command-centre\data.db"
    $schemaScript = @'
import sqlite3, sys

conn = sqlite3.connect(sys.argv[1])
conn.execute("CREATE TABLE tasks (id TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT, status TEXT NOT NULL DEFAULT 'backlog', level TEXT NOT NULL DEFAULT 'task', columnOrder INTEGER NOT NULL DEFAULT 0, createdAt TEXT NOT NULL, updatedAt TEXT NOT NULL, durationMs INTEGER, errorMessage TEXT, startedAt TEXT, completedAt TEXT, cronJobSlug TEXT)")
conn.execute("CREATE TABLE task_outputs (id TEXT PRIMARY KEY, taskId TEXT NOT NULL, fileName TEXT NOT NULL, filePath TEXT NOT NULL, relativePath TEXT NOT NULL, extension TEXT NOT NULL DEFAULT '', sizeBytes INTEGER, createdAt TEXT NOT NULL)")
conn.execute("CREATE TABLE cron_runs (id INTEGER PRIMARY KEY AUTOINCREMENT, jobSlug TEXT NOT NULL, taskId TEXT, startedAt TEXT NOT NULL, completedAt TEXT, result TEXT NOT NULL DEFAULT 'running' CHECK (result IN ('success', 'failure', 'timeout', 'running')), durationSec REAL, costUsd REAL, exitCode INTEGER, trigger TEXT DEFAULT 'scheduled', createdAt TEXT NOT NULL DEFAULT (datetime('now')))")
conn.commit()
conn.close()
'@
    [void](Invoke-PythonScript -Python $python -Script $schemaScript -Arguments @($dbPath))

    $stubCmdPath = Join-Path $tempRoot "claude-stub.cmd"
    $stubPyPath = Join-Path $tempRoot "claude-stub.py"
    $pythonCommandLine = @(
        ('"{0}"' -f $python.FilePath)
        $python.Arguments
        '"%~dp0claude-stub.py"'
        '%*'
    ) -join ' '
    Set-Content -Path $stubCmdPath -Encoding ASCII -Value @"
@echo off
$pythonCommandLine
exit /b %ERRORLEVEL%
"@
    Set-Content -Path $stubPyPath -Encoding UTF8 -Value @'
import os
import pathlib
import re
import sys
import time

joined = " ".join(sys.argv[1:])
project_dir = pathlib.Path(os.environ["AGENTIC_OS_TEST_PROJECT_DIR"])

match = re.search(r"\[WRITE:([^\]]+)\]", joined)
if match:
    target = project_dir / match.group(1)
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text("generated by claude stub", encoding="utf-8")

if "[TIMEOUT]" in joined:
    time.sleep(3)
    print("stub timeout payload")
    sys.exit(0)

if "[FAIL]" in joined:
    print("stub failure payload")
    sys.exit(9)

print("stub success payload")
sys.exit(0)
'@

    Write-TestJob -Path (Join-Path $tempRoot "cron\jobs\manual-success.md") `
        -Name "Manual Success" `
        -Time "23:59" `
        -Days "daily" `
        -Prompt "Manual smoke test [WRITE:projects/test/manual-success.md]"

    Write-TestJob -Path (Join-Path $tempRoot "cron\jobs\fixed-success.md") `
        -Name "Fixed Success" `
        -Time "09:15" `
        -Days "fri" `
        -Prompt "Scheduled success [WRITE:projects/test/fixed-success.md]"

    Write-TestJob -Path (Join-Path $tempRoot "cron\jobs\failure-job.md") `
        -Name "Failure Job" `
        -Time "09:15" `
        -Days "fri" `
        -Prompt "Scheduled failure [FAIL]"

    Write-TestJob -Path (Join-Path $tempRoot "cron\jobs\timeout-job.md") `
        -Name "Timeout Job" `
        -Time "09:15" `
        -Days "fri" `
        -Timeout "1s" `
        -Prompt "Scheduled timeout [TIMEOUT]"

    Write-TestJob -Path (Join-Path $tempRoot "cron\jobs\multi-day.md") `
        -Name "Multi Day" `
        -Time "09:15" `
        -Days "mon,wed" `
        -Prompt "Multi day success [WRITE:projects/test/multi-day.md]"

    Write-Host "1. Verifying installer dry-run selects the PowerShell cron installer..."
    $oldDryRun = $env:AGENTIC_OS_CRON_DRY_RUN
    try {
        $env:AGENTIC_OS_CRON_DRY_RUN = "1"
        Push-Location $RepoRoot
        $installOutput = (& bash "scripts/install.sh" 2>&1 | Out-String)
    } finally {
        Pop-Location
        $env:AGENTIC_OS_CRON_DRY_RUN = $oldDryRun
    }

    Assert-True ($installOutput.Contains("Windows Task Scheduler installer")) "Installer dry run did not select the Windows cron installer."
    Assert-True ($installOutput.Contains("scripts/install-crons.ps1")) "Installer dry run did not report the PowerShell cron installer path."
    Assert-True (-not $installOutput.Contains("crontab: command not found")) "Installer dry run still attempted to call crontab on Windows."

    Write-Host "2. Verifying scripts/run-job.ps1 with a stub Claude binary..."
    $oldClaude = $env:AGENTIC_OS_CLAUDE_BIN
    $oldProject = $env:AGENTIC_OS_TEST_PROJECT_DIR
    try {
        $env:AGENTIC_OS_CLAUDE_BIN = $stubCmdPath
        $env:AGENTIC_OS_TEST_PROJECT_DIR = $tempRoot
        Push-Location $tempRoot
        & powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\scripts\run-job.ps1" "manual-success"
        $manualExit = $LASTEXITCODE
    } finally {
        Pop-Location
        $env:AGENTIC_OS_CLAUDE_BIN = $oldClaude
        $env:AGENTIC_OS_TEST_PROJECT_DIR = $oldProject
    }

    Assert-True ($manualExit -eq 0) "run-job.ps1 did not exit successfully with the stub Claude binary."
    $manualStatus = Get-Content (Join-Path $tempRoot "cron\status\manual-success.json") -Raw | ConvertFrom-Json
    Assert-True ($manualStatus.result -eq "success") "run-job.ps1 did not record a success result."
    Assert-True ($manualStatus.run_count -eq 1) "run-job.ps1 did not increment the manual run count."
    Assert-True (Test-Path (Join-Path $tempRoot "projects\test\manual-success.md")) "run-job.ps1 did not create the expected output artifact."

    Write-Host "3. Verifying scripts/run-crons.ps1 for success, failure, timeout, and multi-day schedules..."
    $oldNow = $env:AGENTIC_OS_CRON_NOW
    $oldClaude = $env:AGENTIC_OS_CLAUDE_BIN
    $oldProject = $env:AGENTIC_OS_TEST_PROJECT_DIR
    try {
        $env:AGENTIC_OS_CLAUDE_BIN = $stubCmdPath
        $env:AGENTIC_OS_TEST_PROJECT_DIR = $tempRoot

        Push-Location $tempRoot

        $env:AGENTIC_OS_CRON_NOW = "2026-04-10T09:15:00-03:00"
        & powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\scripts\run-crons.ps1"
        $dispatchExitOne = $LASTEXITCODE

        $env:AGENTIC_OS_CRON_NOW = "2026-04-08T09:15:00-03:00"
        & powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\scripts\run-crons.ps1"
        $dispatchExitTwo = $LASTEXITCODE
    } finally {
        Pop-Location
        $env:AGENTIC_OS_CRON_NOW = $oldNow
        $env:AGENTIC_OS_CLAUDE_BIN = $oldClaude
        $env:AGENTIC_OS_TEST_PROJECT_DIR = $oldProject
    }

    Assert-True ($dispatchExitOne -eq 0) "First dispatcher smoke run failed."
    Assert-True ($dispatchExitTwo -eq 0) "Second dispatcher smoke run failed."

    $fixedStatus = Get-Content (Join-Path $tempRoot "cron\status\fixed-success.json") -Raw | ConvertFrom-Json
    $failureStatus = Get-Content (Join-Path $tempRoot "cron\status\failure-job.json") -Raw | ConvertFrom-Json
    $timeoutStatus = Get-Content (Join-Path $tempRoot "cron\status\timeout-job.json") -Raw | ConvertFrom-Json
    $multiDayStatus = Get-Content (Join-Path $tempRoot "cron\status\multi-day.json") -Raw | ConvertFrom-Json

    Assert-True ($fixedStatus.result -eq "success") "Fixed-time dispatcher run did not record success."
    Assert-True ($failureStatus.result -eq "failure") "Failure dispatcher run did not record failure."
    Assert-True ($timeoutStatus.result -eq "timeout") "Timeout dispatcher run did not record timeout."
    Assert-True ($multiDayStatus.result -eq "success") "Quoted comma-separated weekday schedule did not execute on the matching day."
    Assert-True ($multiDayStatus.run_count -eq 1) "Multi-day dispatcher run count is incorrect."
    Assert-True (Test-Path (Join-Path $tempRoot "projects\test\fixed-success.md")) "Dispatcher did not create the fixed-success output artifact."
    Assert-True (Test-Path (Join-Path $tempRoot "projects\test\multi-day.md")) "Dispatcher did not create the multi-day output artifact."

    $rows = Invoke-PythonJson -Python $python -Script @'
import json, sqlite3, sys

conn = sqlite3.connect(sys.argv[1])
conn.row_factory = sqlite3.Row
rows = {
    "cron_runs": [dict(row) for row in conn.execute("SELECT jobSlug, result FROM cron_runs ORDER BY id ASC")],
    "tasks": [dict(row) for row in conn.execute("SELECT cronJobSlug, status, errorMessage FROM tasks ORDER BY createdAt ASC")],
    "outputs": [dict(row) for row in conn.execute("SELECT relativePath FROM task_outputs ORDER BY relativePath ASC")],
}
print(json.dumps(rows))
'@ -Arguments @($dbPath)

    $cronRunMap = @{}
    foreach ($row in $rows.cron_runs) {
        $cronRunMap[$row.jobSlug] = $row.result
    }

    Assert-True ($cronRunMap["fixed-success"] -eq "success") "SQLite cron_runs entry missing fixed-success result."
    Assert-True ($cronRunMap["failure-job"] -eq "failure") "SQLite cron_runs entry missing failure-job result."
    Assert-True ($cronRunMap["timeout-job"] -eq "timeout") "SQLite cron_runs entry missing timeout-job result."
    Assert-True ($cronRunMap["multi-day"] -eq "success") "SQLite cron_runs entry missing multi-day result."

    $outputPaths = @($rows.outputs | ForEach-Object { $_.relativePath })
    Assert-True ($outputPaths -contains "projects/test/fixed-success.md") "SQLite task_outputs entry missing fixed-success artifact."
    Assert-True ($outputPaths -contains "projects/test/multi-day.md") "SQLite task_outputs entry missing multi-day artifact."

    Write-Host ""
    Write-Host "Cron smoke tests passed."
} finally {
    if (Test-Path $tempRoot) {
        Remove-Item -LiteralPath $tempRoot -Recurse -Force
    }
}
