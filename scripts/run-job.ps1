# Manual job trigger — run any job by name, ignoring schedule.
# Usage: powershell scripts/run-job.ps1 <job-name>

param(
    [Parameter(Mandatory=$true, Position=0)]
    [string]$JobName
)

$ProjectDir = Split-Path -Parent $PSScriptRoot
$JobFile = Join-Path $ProjectDir "cron\jobs\$JobName.md"
$LogsDir = Join-Path $ProjectDir "cron\logs"
$StatusDir = Join-Path $ProjectDir "cron\status"
$WindowsNotifyScript = Join-Path $ProjectDir "scripts\windows-notify.ps1"

if (-not (Test-Path $JobFile)) {
    Write-Host "Error: No job file at $JobFile"
    Write-Host ""
    Write-Host "Available jobs:"
    Get-ChildItem -Path (Join-Path $ProjectDir "cron\jobs") -Filter "*.md" | ForEach-Object {
        Write-Host "  $($_.BaseName)"
    }
    exit 1
}

New-Item -ItemType Directory -Force -Path $LogsDir | Out-Null
New-Item -ItemType Directory -Force -Path $StatusDir | Out-Null

# --- Parse YAML frontmatter ---
$content = Get-Content $JobFile -Raw

$JobDisplayName = if ($content -match '(?m)^name:\s*"?([^"\r\n]+)"?') { $Matches[1].Trim() } else { $JobName }
$model = if ($content -match '(?m)^model:\s*"?(\w+)"?') { $Matches[1] } else { "sonnet" }
$notify = if ($content -match '(?m)^notify:\s*"?([^"\r\n]+)"?') { $Matches[1].Trim() } else { "on_finish" }
$timeoutRaw = if ($content -match '(?m)^timeout:\s*"?([^"\r\n]+)"?') { $Matches[1].Trim() } else { "30m" }
$retry = if ($content -match '(?m)^retry:\s*"?(\d+)"?') { [int]$Matches[1] } else { 0 }

$parts = $content -split '---'
if ($parts.Count -lt 3) {
    Write-Host "Error: No prompt body found in $JobFile"
    exit 1
}
$prompt = ($parts[2..($parts.Count - 1)] -join '---').Trim()

# --- Helper functions ---

function Send-Notification {
    param(
        [ValidateSet("success", "timeout", "failure")]
        [string]$Event,
        [hashtable]$Context,
        [string]$LogFile
    )

    try {
        $contextJson = $Context | ConvertTo-Json -Compress
        $contextBase64 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($contextJson))
        $commandOutput = & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $WindowsNotifyScript `
            -Channel "cron" `
            -Event $Event `
            -ContextBase64 $contextBase64 2>&1

        $exitCode = $LASTEXITCODE
        $rawOutput = if ($commandOutput) { ($commandOutput | Out-String).Trim() } else { "" }

        if ($exitCode -ne 0) {
            if ($LogFile) {
                Add-Content $LogFile "[notify] windows-notify exit ${exitCode}: $rawOutput"
            }
            return
        }

        if ($rawOutput) {
            try {
                $result = $rawOutput | ConvertFrom-Json -ErrorAction Stop
                if ($result.delivery -ne "toast" -and $LogFile) {
                    Add-Content $LogFile "[notify] delivered via $($result.delivery): $($result.toast_error)"
                }
            } catch {
                if ($LogFile) {
                    Add-Content $LogFile "[notify] windows-notify output: $rawOutput"
                }
            }
        }
    } catch {
        if ($LogFile) {
            Add-Content $LogFile "[notify] windows-notify error: $_"
        }
    }
}

function ConvertTo-Seconds {
    param([string]$Value)
    if ($Value -match '^(\d+)m$') { return [int]$Matches[1] * 60 }
    elseif ($Value -match '^(\d+)h$') { return [int]$Matches[1] * 3600 }
    elseif ($Value -match '^(\d+)s$') { return [int]$Matches[1] }
    else { return [int]$Value }
}

function Format-Duration {
    param([int]$Seconds)
    if ($Seconds -ge 60) {
        $m = [math]::Floor($Seconds / 60)
        $s = $Seconds % 60
        return "${m}m ${s}s"
    } else {
        return "${Seconds}s"
    }
}

$timeoutSecs = ConvertTo-Seconds $timeoutRaw
$logFile = Join-Path $LogsDir "$JobName.log"
$statusFile = Join-Path $StatusDir "$JobName.json"

Write-Host "Running job: $JobDisplayName (model: $model, timeout: $timeoutRaw, retry: $retry)"
Write-Host ""

# --- Read previous status for run_count / fail_count ---
$prevRunCount = 0
$prevFailCount = 0
if (Test-Path $statusFile) {
    try {
        $prevStatus = Get-Content $statusFile -Raw | ConvertFrom-Json
        $prevRunCount = $prevStatus.run_count
        $prevFailCount = $prevStatus.fail_count
    } catch {
        # Corrupted status file — start fresh
    }
}

# --- Execute with retry loop ---
$attempt = 0
$maxAttempts = $retry + 1
$exitCode = 1
$runtime = 0

Remove-Item Env:CLAUDECODE -ErrorAction SilentlyContinue

while ($attempt -lt $maxAttempts) {
    $attempt++

    if ($maxAttempts -gt 1) {
        Write-Host "Attempt ${attempt}/${maxAttempts}..."
    }

    $timestamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
    Add-Content $logFile "`n=== [$timestamp] MANUAL START: $JobDisplayName (attempt ${attempt}/${maxAttempts}) ==="
    $startTime = Get-Date

    # Launch Claude with timeout
    try {
        $psi = New-Object System.Diagnostics.ProcessStartInfo
        $psi.FileName = "claude"
        $psi.Arguments = "-p `"$prompt`" --model $model --dangerously-skip-permissions"
        $psi.UseShellExecute = $false
        $psi.RedirectStandardOutput = $true
        $psi.RedirectStandardError = $true
        $psi.EnvironmentVariables.Remove("CLAUDECODE")

        $process = [System.Diagnostics.Process]::Start($psi)
        $timedOut = -not $process.WaitForExit($timeoutSecs * 1000)

        if ($timedOut) {
            try { $process.Kill() } catch {}
            $exitCode = 137
            $output = $process.StandardOutput.ReadToEnd()
            $errOutput = $process.StandardError.ReadToEnd()
        } else {
            $exitCode = $process.ExitCode
            $output = $process.StandardOutput.ReadToEnd()
            $errOutput = $process.StandardError.ReadToEnd()
        }

        if ($output) {
            Write-Host $output
            Add-Content $logFile $output
        }
        if ($errOutput) {
            Write-Host $errOutput
            Add-Content $logFile $errOutput
        }
    } catch {
        Write-Host "Error: $_"
        Add-Content $logFile "[run-job] Error: $_"
        $exitCode = 1
    }

    $runtime = [int]((Get-Date) - $startTime).TotalSeconds
    $durationHuman = Format-Duration $runtime
    $timestamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")

    if ($exitCode -eq 0) {
        Add-Content $logFile "=== [$timestamp] MANUAL END: $JobDisplayName (${durationHuman}) ==="
        break
    } elseif ($exitCode -eq 137 -or $exitCode -eq 143) {
        Add-Content $logFile "=== [$timestamp] MANUAL TIMEOUT: $JobDisplayName (killed after ${timeoutRaw}) ==="
    } else {
        Add-Content $logFile "=== [$timestamp] MANUAL FAIL: $JobDisplayName (exit ${exitCode}, ${durationHuman}) ==="
    }

    # If retries remain, log and continue
    if ($attempt -lt $maxAttempts) {
        Write-Host "Attempt $attempt failed (exit $exitCode). Retrying..."
        Add-Content $logFile "[run-job] Attempt $attempt failed (exit $exitCode). Retrying..."
    }
}

# --- Write status file ---
$durationHuman = Format-Duration $runtime
$newRunCount = $prevRunCount + 1
$newFailCount = $prevFailCount
$result = "success"

if ($exitCode -ne 0) {
    $newFailCount = $prevFailCount + 1
    if ($exitCode -eq 137 -or $exitCode -eq 143) {
        $result = "timeout"
    } else {
        $result = "failure"
    }
}

$timestamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
$statusJson = "{`"last_run`":`"$timestamp`",`"result`":`"$result`",`"duration`":$runtime,`"exit_code`":$exitCode,`"run_count`":$newRunCount,`"fail_count`":$newFailCount}"
Set-Content $statusFile $statusJson -NoNewline

# --- Send notification based on notify field ---
$notifySuccess = $notify -in @("on_finish", "on_success")
$notifyFailure = $notify -in @("on_finish", "on_failure")

if ($exitCode -eq 0 -and $notifySuccess) {
    Send-Notification -Event "success" -Context @{
        jobName = $JobDisplayName
        duration = $durationHuman
        timeout = $timeoutRaw
        exitCode = $exitCode
        catchUpSuffix = ""
    } -LogFile $logFile
} elseif ($result -eq "timeout" -and $notifyFailure) {
    Send-Notification -Event "timeout" -Context @{
        jobName = $JobDisplayName
        duration = $durationHuman
        timeout = $timeoutRaw
        exitCode = $exitCode
        catchUpSuffix = ""
    } -LogFile $logFile
} elseif ($exitCode -ne 0 -and $notifyFailure) {
    Send-Notification -Event "failure" -Context @{
        jobName = $JobDisplayName
        duration = $durationHuman
        timeout = $timeoutRaw
        exitCode = $exitCode
        catchUpSuffix = ""
    } -LogFile $logFile
}

exit $exitCode
