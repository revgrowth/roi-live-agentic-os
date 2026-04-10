# Install the cron dispatcher - registers a Task Scheduler entry that runs every minute.
# Windows only. For Mac/Linux, use install-crons.sh.

Set-StrictMode -Version 3.0
. (Join-Path $PSScriptRoot "lib\cron-windows.ps1")

$ProjectDir = Get-AgenticOsProjectDir -ScriptRoot $PSScriptRoot
$Dispatcher = Join-Path $ProjectDir "scripts\run-crons.ps1"
$TaskName = Get-AgenticOsScheduledTaskName -ProjectDir $ProjectDir
$DryRun = Test-AgenticOsBooleanEnv -Name "AGENTIC_OS_CRON_DRY_RUN"

Write-Host "Cron installer target: task-scheduler"
Write-Host "  Installer: scripts/install-crons.ps1"
Write-Host "  Identifier: $TaskName"

if ($DryRun) {
    Write-Host "  Dry run enabled via AGENTIC_OS_CRON_DRY_RUN - skipping installation."
    exit 0
}

try {
    $ClaudeCommand = Resolve-AgenticOsClaudeCommand
} catch {
    Write-Host $_.Exception.Message
    exit 1
}

$existing = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
if ($existing) {
    Write-Host "Cron dispatcher is already installed as scheduled task '$TaskName'."
    exit 0
}

$enabled = 0
Get-ChildItem -Path (Join-Path $ProjectDir "cron\jobs") -Filter "*.md" -ErrorAction SilentlyContinue | ForEach-Object {
    $job = Get-AgenticOsJobDefinition -FilePath $_.FullName
    if ($job.Active) {
        $enabled++
    }
}

$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$Dispatcher`""
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Minutes 1) -RepetitionDuration (New-TimeSpan -Days 365)
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries

Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Settings $settings -Description "Agentic OS cron dispatcher - checks cron/jobs/ every minute" | Out-Null

Write-Host "Cron dispatcher installed as scheduled task '$TaskName'."
Write-Host "  Checks cron/jobs/ every minute for due jobs."
Write-Host "  Uses Claude CLI at: $ClaudeCommand"
Write-Host "  $enabled enabled job(s) found."
Write-Host "  Logs go to cron/logs/"
Write-Host ""
Write-Host "To remove: powershell scripts/uninstall-crons.ps1"
