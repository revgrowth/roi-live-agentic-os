# Dispatcher - runs every minute via Windows Task Scheduler.
# Scans cron/jobs/*.md, fires any jobs matching the current time and day.
# Supports exact times ("09:00"), multiple times ("09:00,13:00"),
# minute intervals ("every_1m", "every_5m"), and hour intervals ("every_1h", "every_2h").
# Features: timeout, retry, notifications, status tracking, and catch-up after sleep/reboot.

Set-StrictMode -Version 3.0
. (Join-Path $PSScriptRoot "lib\cron-windows.ps1")

$ProjectDir = Get-AgenticOsProjectDir -ScriptRoot $PSScriptRoot
$CronsDir = Join-Path $ProjectDir "cron\jobs"
$LogsDir = Join-Path $ProjectDir "cron\logs"
$StatusDir = Join-Path $ProjectDir "cron\status"
$WindowsNotifyScript = Join-Path $ProjectDir "scripts\windows-notify.ps1"
$CronDbScript = Join-Path $ProjectDir "scripts\lib\cron-db.py"

try {
    $ClaudeCommand = Resolve-AgenticOsClaudeCommand
} catch {
    Write-Host $_.Exception.Message
    exit 1
}
$ClaudeInvocation = Get-AgenticOsProcessInvocation -CommandPath $ClaudeCommand

$PythonCommand = Resolve-AgenticOsPythonCommand
$Now = Get-AgenticOsNow
$NowTime = $Now.ToString("HH:mm")
$NowDay = $Now.ToString("ddd", [System.Globalization.CultureInfo]::InvariantCulture).ToLowerInvariant()
$NowUtc = $Now.ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")

New-Item -ItemType Directory -Force -Path $LogsDir | Out-Null
New-Item -ItemType Directory -Force -Path $StatusDir | Out-Null

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

function Invoke-AgenticOsCronDb {
    param(
        [ValidateSet("start", "finish")]
        [string]$Action,
        [hashtable]$Payload,
        [string]$LogFile
    )

    if (-not $PythonCommand -or -not (Test-Path $CronDbScript)) {
        return $null
    }

    if (-not (Test-Path $Payload.db_path)) {
        return $null
    }

    $payloadJson = $Payload | ConvertTo-Json -Compress -Depth 10
    $commandOutput = $payloadJson | & $PythonCommand.FilePath @($PythonCommand.Arguments + @($CronDbScript, $Action)) 2>&1
    $exitCode = $LASTEXITCODE
    $rawOutput = if ($commandOutput) { ($commandOutput | Out-String).Trim() } else { "" }

    if ($exitCode -ne 0) {
        if ($LogFile) {
            Add-Content $LogFile "[db] cron-db.py $Action failed (${exitCode}): $rawOutput"
        }
        return $null
    }

    if ([string]::IsNullOrWhiteSpace($rawOutput)) {
        return $null
    }

    try {
        return $rawOutput | ConvertFrom-Json
    } catch {
        if ($LogFile) {
            Add-Content $LogFile "[db] cron-db.py $Action returned invalid JSON: $rawOutput"
        }
        return $null
    }
}

function Invoke-Job {
    param(
        [hashtable]$Job,
        [bool]$IsCatchUp = $false
    )

    $logFile = Join-Path $LogsDir "$($Job.Slug).log"
    $statusFile = Join-Path $StatusDir "$($Job.Slug).json"
    $pidFile = Join-Path $StatusDir "$($Job.Slug).pid"
    $timeoutMs = ConvertTo-AgenticOsTimeoutMs -Value $Job.Timeout

    if (Test-Path $pidFile) {
        $existingPid = Get-Content $pidFile -ErrorAction SilentlyContinue
        if ($existingPid) {
            try {
                $process = Get-Process -Id ([int]$existingPid) -ErrorAction Stop
                if (-not $process.HasExited) {
                    Add-Content $logFile "[dispatcher] Skipping $($Job.Name) - already running (PID ${existingPid})"
                    return
                }
            } catch {
                # Stale pid file.
            }
        }
        Remove-Item $pidFile -ErrorAction SilentlyContinue
    }

    $PID | Set-Content $pidFile -Encoding UTF8

    $previousStatus = Read-AgenticOsStatusFile -Path $statusFile
    $runCount = if ($previousStatus -and $previousStatus.run_count) { [int]$previousStatus.run_count } else { 0 }
    $failCount = if ($previousStatus -and $previousStatus.fail_count) { [int]$previousStatus.fail_count } else { 0 }

    $attempt = 0
    $maxAttempts = $Job.Retry + 1
    $success = $false
    $timedOut = $false
    $lastExitCode = 1
    $capturedOutput = ""
    $totalDuration = 0
    $catchUpSuffix = if ($IsCatchUp) { " (catch-up)" } else { "" }

    $jobStartedAt = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
    $jobStartEpoch = [DateTimeOffset](Get-Date)
    $dbPath = Join-Path $ProjectDir ".command-centre\data.db"
    $tracking = Invoke-AgenticOsCronDb -Action "start" -Payload @{
        db_path = $dbPath
        job_slug = $Job.Slug
        job_name = $Job.Name
        description = $Job.Description
        started_at = $jobStartedAt
    } -LogFile $logFile

    while ($attempt -lt $maxAttempts) {
        $attempt++
        $attemptTag = if ($maxAttempts -gt 1) { " (attempt $attempt/$maxAttempts)" } else { "" }
        $startTimestamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
        Add-Content $logFile "`n=== [$startTimestamp] START: $($Job.Name)$catchUpSuffix$attemptTag ==="
        $attemptStart = Get-Date

        $tempOut = [System.IO.Path]::GetTempFileName()
        $tempErr = [System.IO.Path]::GetTempFileName()
        $timedOut = $false

        Remove-Item Env:CLAUDECODE -ErrorAction SilentlyContinue

        try {
            $processArgs = $ClaudeInvocation.Arguments + @("-p", $Job.Prompt, "--model", $Job.Model, "--dangerously-skip-permissions")
            $processResult = Invoke-AgenticOsProcess `
                -FilePath $ClaudeInvocation.FilePath `
                -Arguments $processArgs `
                -TimeoutMs $timeoutMs `
                -StdOutPath $tempOut `
                -StdErrPath $tempErr

            $timedOut = [bool]$processResult.TimedOut
            $lastExitCode = [int]$processResult.ExitCode

            if (Test-Path $tempOut) {
                $outContent = Get-Content $tempOut -Raw -ErrorAction SilentlyContinue
                if ($outContent) {
                    Add-Content $logFile $outContent
                    $capturedOutput = $outContent
                }
            }

            if (Test-Path $tempErr) {
                $errContent = Get-Content $tempErr -Raw -ErrorAction SilentlyContinue
                if ($errContent) {
                    Add-Content $logFile "[stderr] $errContent"
                }
            }
        } catch {
            Add-Content $logFile "[dispatcher] Error: $_"
            $lastExitCode = 1
            $timedOut = $false
        } finally {
            Remove-Item $tempOut -ErrorAction SilentlyContinue
            Remove-Item $tempErr -ErrorAction SilentlyContinue
        }

        $duration = [int]((Get-Date) - $attemptStart).TotalSeconds
        $totalDuration += $duration
        $durationLabel = Format-AgenticOsDuration -Seconds $duration
        $endTimestamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")

        if ($lastExitCode -eq 0 -and -not $timedOut) {
            Add-Content $logFile "=== [$endTimestamp] END: $($Job.Name) ($durationLabel)$catchUpSuffix$attemptTag ==="
            $success = $true
            break
        }

        if ($timedOut) {
            Add-Content $logFile "=== [$endTimestamp] TIMEOUT: $($Job.Name) after $durationLabel$catchUpSuffix$attemptTag ==="
        } else {
            Add-Content $logFile "=== [$endTimestamp] FAIL: $($Job.Name) (exit $lastExitCode, $durationLabel)$catchUpSuffix$attemptTag ==="
        }

        if ($attempt -lt $maxAttempts) {
            Add-Content $logFile "[dispatcher] Retrying $($Job.Name)..."
        }
    }

    $result = if ($timedOut) { "timeout" } elseif ($success) { "success" } else { "failure" }
    $runCount++
    if ($result -ne "success") {
        $failCount++
    }

    Write-AgenticOsStatusFile -Path $statusFile -Data @{
        last_run = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
        result = $result
        duration = $totalDuration
        exit_code = $lastExitCode
        run_count = $runCount
        fail_count = $failCount
    }

    $completedAt = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
    [void](Invoke-AgenticOsCronDb -Action "finish" -Payload @{
        db_path = $dbPath
        job_slug = $Job.Slug
        task_id = if ($tracking -and $tracking.PSObject.Properties.Name -contains "taskId") { [string]$tracking.taskId } else { "" }
        cron_run_id = if ($tracking -and $tracking.PSObject.Properties.Name -contains "cronRunId") { [int]$tracking.cronRunId } else { 0 }
        started_at = $jobStartedAt
        completed_at = $completedAt
        duration_sec = $totalDuration
        exit_code = $lastExitCode
        result = $result
        timeout = $Job.Timeout
        project_dir = $ProjectDir
        start_epoch = [int]$jobStartEpoch.ToUnixTimeSeconds()
        end_epoch = [int]([DateTimeOffset](Get-Date)).ToUnixTimeSeconds()
    } -LogFile $logFile)

    Remove-Item $pidFile -ErrorAction SilentlyContinue

    $notifySuccess = $Job.Notify -in @("on_finish", "on_success")
    $notifyFailure = $Job.Notify -in @("on_finish", "on_failure")
    $isSilent = $success -and $capturedOutput -match "\[SILENT\]"
    $durationTotalLabel = Format-AgenticOsDuration -Seconds $totalDuration

    if (-not $isSilent) {
        if ($success -and $notifySuccess) {
            Send-Notification -Event "success" -Context @{
                jobName = $Job.Name
                duration = $durationTotalLabel
                timeout = $Job.Timeout
                exitCode = $lastExitCode
                catchUpSuffix = $catchUpSuffix
            } -LogFile $logFile
        } elseif ($result -eq "timeout" -and $notifyFailure) {
            Send-Notification -Event "timeout" -Context @{
                jobName = $Job.Name
                duration = $durationTotalLabel
                timeout = $Job.Timeout
                exitCode = $lastExitCode
                catchUpSuffix = $catchUpSuffix
            } -LogFile $logFile
        } elseif ($result -eq "failure" -and $notifyFailure) {
            Send-Notification -Event "failure" -Context @{
                jobName = $Job.Name
                duration = $durationTotalLabel
                timeout = $Job.Timeout
                exitCode = $lastExitCode
                catchUpSuffix = $catchUpSuffix
            } -LogFile $logFile
        }
    }
}

$dispatcherStatusFile = Join-Path $StatusDir "dispatcher.json"
$previousDispatcher = Read-AgenticOsStatusFile -Path $dispatcherStatusFile
$todayMarker = $Now.ToString("yyyy-MM-dd")

if ($previousDispatcher -and $previousDispatcher.last_dispatch) {
    try {
        $lastDispatch = [DateTimeOffset]::Parse($previousDispatcher.last_dispatch, [System.Globalization.CultureInfo]::InvariantCulture)
        $gapSeconds = ($Now - $lastDispatch).TotalSeconds

        if ($gapSeconds -gt 120) {
            $catchUpFrom = if ($gapSeconds -gt 86400) { $Now.AddHours(-24) } else { $lastDispatch }
            $dispatcherLog = Join-Path $LogsDir "dispatcher.log"
            Add-Content $dispatcherLog "`n=== [$NowUtc] CATCH-UP: gap of $(Format-AgenticOsDuration -Seconds ([int][Math]::Min($gapSeconds, 86400))) detected ==="

            Get-ChildItem -Path $CronsDir -Filter "*.md" -ErrorAction SilentlyContinue | Sort-Object Name | ForEach-Object {
                $job = Get-AgenticOsJobDefinition -FilePath $_.FullName
                if (-not $job.Active -or [string]::IsNullOrWhiteSpace($job.Prompt)) { return }
                if (-not (Test-AgenticOsSupportedDays -Days $job.Days) -or -not (Test-AgenticOsSupportedTime -Time $job.Time)) { return }
                if ($job.Time -match "^every_") { return }
                if (-not (Test-AgenticOsTimeInRange -Schedule $job.Time -Days $job.Days -Start $catchUpFrom -End $Now)) { return }

                $markerFile = Join-Path $StatusDir "$($job.Slug).catchup"
                if ((Test-Path $markerFile) -and ((Get-Content $markerFile -ErrorAction SilentlyContinue) -eq $todayMarker)) {
                    return
                }

                Set-Content $markerFile $todayMarker -NoNewline
                Invoke-Job -Job $job -IsCatchUp $true
            }
        }
    } catch {
        # Ignore malformed dispatcher timestamps.
    }
}

Write-AgenticOsStatusFile -Path $dispatcherStatusFile -Data @{
    last_dispatch = $NowUtc
    pid = $PID
}

Get-ChildItem -Path $CronsDir -Filter "*.md" -ErrorAction SilentlyContinue | Sort-Object Name | ForEach-Object {
    $job = Get-AgenticOsJobDefinition -FilePath $_.FullName

    if (-not $job.Active) { return }
    if ([string]::IsNullOrWhiteSpace($job.Prompt)) { return }
    if (-not (Test-AgenticOsSupportedDays -Days $job.Days) -or -not (Test-AgenticOsSupportedTime -Time $job.Time)) { return }
    if (-not (Test-AgenticOsDayMatch -Days $job.Days -Now $Now)) { return }
    if (-not (Test-AgenticOsTimeMatch -Schedule $job.Time -Now $Now)) { return }

    if ($job.Time -notmatch "^every_") {
        $markerFile = Join-Path $StatusDir "$($job.Slug).catchup"
        if ((Test-Path $markerFile) -and ((Get-Content $markerFile -ErrorAction SilentlyContinue) -eq $todayMarker)) {
            return
        }
    }

    Invoke-Job -Job $job -IsCatchUp $false
}
