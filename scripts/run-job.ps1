# Manual job trigger - run any job by name, ignoring schedule.
# Usage: powershell scripts/run-job.ps1 <job-name>

param(
    [Parameter(Mandatory = $true, Position = 0)]
    [string]$JobName
)

Set-StrictMode -Version 3.0

. (Join-Path $PSScriptRoot "lib\cron-windows.ps1")

$ProjectDir = Get-AgenticOsProjectDir -ScriptRoot $PSScriptRoot
$JobFile = Join-Path $ProjectDir "cron\jobs\$JobName.md"
$LogsDir = Join-Path $ProjectDir "cron\logs"
$StatusDir = Join-Path $ProjectDir "cron\status"
$WindowsNotifyScript = Join-Path $ProjectDir "scripts\windows-notify.ps1"

if (-not (Test-Path $JobFile)) {
    Write-Host "Error: No job file at $JobFile"
    Write-Host ""
    Write-Host "Available jobs:"
    Get-ChildItem -Path (Join-Path $ProjectDir "cron\jobs") -Filter "*.md" -ErrorAction SilentlyContinue | ForEach-Object {
        Write-Host "  $($_.BaseName)"
    }
    exit 1
}

try {
    $ClaudeCommand = Resolve-AgenticOsClaudeCommand
} catch {
    Write-Host $_.Exception.Message
    exit 1
}
$ClaudeInvocation = Get-AgenticOsProcessInvocation -CommandPath $ClaudeCommand

New-Item -ItemType Directory -Force -Path $LogsDir | Out-Null
New-Item -ItemType Directory -Force -Path $StatusDir | Out-Null

$job = Get-AgenticOsJobDefinition -FilePath $JobFile
if ([string]::IsNullOrWhiteSpace($job.Prompt)) {
    Write-Host "Error: No prompt body found in $JobFile"
    exit 1
}

$timeoutMs = ConvertTo-AgenticOsTimeoutMs -Value $job.Timeout
$logFile = Join-Path $LogsDir "$JobName.log"
$statusFile = Join-Path $StatusDir "$JobName.json"
$previousStatus = Read-AgenticOsStatusFile -Path $statusFile
$previousRunCount = if ($previousStatus -and $previousStatus.run_count) { [int]$previousStatus.run_count } else { 0 }
$previousFailCount = if ($previousStatus -and $previousStatus.fail_count) { [int]$previousStatus.fail_count } else { 0 }

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

Write-Host "Running job: $($job.Name) (model: $($job.Model), timeout: $($job.Timeout), retry: $($job.Retry))"
Write-Host ""

$attempt = 0
$maxAttempts = $job.Retry + 1
$success = $false
$timedOut = $false
$lastExitCode = 1
$capturedOutput = ""
$totalDuration = 0

Remove-Item Env:CLAUDECODE -ErrorAction SilentlyContinue

while ($attempt -lt $maxAttempts) {
    $attempt++
    $attemptTag = if ($maxAttempts -gt 1) { " (attempt $attempt/$maxAttempts)" } else { "" }
    $startTimestamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
    Add-Content $logFile "`n=== [$startTimestamp] MANUAL START: $($job.Name)$attemptTag ==="
    $startTime = Get-Date

    $tempOut = [System.IO.Path]::GetTempFileName()
    $tempErr = [System.IO.Path]::GetTempFileName()
    $timedOut = $false

    try {
        $processArgs = $ClaudeInvocation.Arguments + @("-p", $job.Prompt, "--model", $job.Model, "--dangerously-skip-permissions")
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
                $capturedOutput = $outContent
                Write-Host $outContent
                Add-Content $logFile $outContent
            }
        }

        if (Test-Path $tempErr) {
            $errContent = Get-Content $tempErr -Raw -ErrorAction SilentlyContinue
            if ($errContent) {
                Write-Host $errContent
                Add-Content $logFile "[stderr] $errContent"
            }
        }
    } catch {
        Write-Host "Error: $_"
        Add-Content $logFile "[run-job] Error: $_"
        $lastExitCode = 1
        $timedOut = $false
    } finally {
        Remove-Item $tempOut -ErrorAction SilentlyContinue
        Remove-Item $tempErr -ErrorAction SilentlyContinue
    }

    $duration = [int]((Get-Date) - $startTime).TotalSeconds
    $totalDuration += $duration
    $durationHuman = Format-AgenticOsDuration -Seconds $duration
    $endTimestamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")

    if ($lastExitCode -eq 0 -and -not $timedOut) {
        Add-Content $logFile "=== [$endTimestamp] MANUAL END: $($job.Name) ($durationHuman)$attemptTag ==="
        $success = $true
        break
    }

    if ($timedOut) {
        Add-Content $logFile "=== [$endTimestamp] MANUAL TIMEOUT: $($job.Name) after $durationHuman$attemptTag ==="
    } else {
        Add-Content $logFile "=== [$endTimestamp] MANUAL FAIL: $($job.Name) (exit $lastExitCode, $durationHuman)$attemptTag ==="
    }

    if ($attempt -lt $maxAttempts) {
        Write-Host "Attempt $attempt failed (exit $lastExitCode). Retrying..."
        Add-Content $logFile "[run-job] Attempt $attempt failed (exit $lastExitCode). Retrying..."
    }
}

$result = if ($timedOut) { "timeout" } elseif ($success) { "success" } else { "failure" }
$runCount = $previousRunCount + 1
$failCount = if ($result -eq "success") { $previousFailCount } else { $previousFailCount + 1 }
$durationHuman = Format-AgenticOsDuration -Seconds $totalDuration

Write-AgenticOsStatusFile -Path $statusFile -Data @{
    last_run = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
    result = $result
    duration = $totalDuration
    exit_code = $lastExitCode
    run_count = $runCount
    fail_count = $failCount
}

$isSilent = $success -and $capturedOutput -match "\[SILENT\]"
$notifySuccess = $job.Notify -in @("on_finish", "on_success")
$notifyFailure = $job.Notify -in @("on_finish", "on_failure")

if (-not $isSilent) {
    if ($success -and $notifySuccess) {
        Send-Notification -Event "success" -Context @{
            jobName = $job.Name
            duration = $durationHuman
            timeout = $job.Timeout
            exitCode = $lastExitCode
            catchUpSuffix = ""
        } -LogFile $logFile
    } elseif ($result -eq "timeout" -and $notifyFailure) {
        Send-Notification -Event "timeout" -Context @{
            jobName = $job.Name
            duration = $durationHuman
            timeout = $job.Timeout
            exitCode = $lastExitCode
            catchUpSuffix = ""
        } -LogFile $logFile
    } elseif ($result -eq "failure" -and $notifyFailure) {
        Send-Notification -Event "failure" -Context @{
            jobName = $job.Name
            duration = $durationHuman
            timeout = $job.Timeout
            exitCode = $lastExitCode
            catchUpSuffix = ""
        } -LogFile $logFile
    }
}

exit $lastExitCode
