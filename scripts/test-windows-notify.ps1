param(
    [ValidateSet("success", "info", "warning", "error")]
    [string]$Variant = "info",
    [string]$Status = "",
    [string]$Subject = "Windows notification test",
    [string]$Detail = "",
    [string]$Duration = "",
    [ValidateSet("", "compact", "hero")]
    [string]$Layout = "",
    [ValidateSet("", "interactive", "cron")]
    [string]$Channel = "",
    [ValidateSet("", "waiting", "permission", "actionRequired", "complete", "success", "timeout", "failure")]
    [string]$Event = "",
    [string]$ContextJson = ""
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($Detail)) {
    $Detail = "This is a $Variant test for the shared Windows toast helper."
}

$projectDir = Split-Path -Parent $PSScriptRoot
$helperPath = Join-Path $projectDir "scripts\windows-notify.ps1"
$powershellExe = Join-Path $env:WINDIR "System32\WindowsPowerShell\v1.0\powershell.exe"

$args = @("-NoProfile", "-ExecutionPolicy", "Bypass", "-File", $helperPath)

if (-not [string]::IsNullOrWhiteSpace($Channel) -or -not [string]::IsNullOrWhiteSpace($Event)) {
    if ([string]::IsNullOrWhiteSpace($Channel) -or [string]::IsNullOrWhiteSpace($Event)) {
        throw "Channel and Event must be provided together."
    }

    if ([string]::IsNullOrWhiteSpace($ContextJson)) {
        $ContextJson = "{}"
    }

    $args += @(
        "-Channel", $Channel,
        "-Event", $Event,
        "-ContextBase64", [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($ContextJson))
    )
    if (-not [string]::IsNullOrWhiteSpace($Layout)) {
        $args += @("-Layout", $Layout)
    }
} else {
    $args += @("-Variant", $Variant)
    if (-not [string]::IsNullOrWhiteSpace($Status)) { $args += @("-Status", $Status) }
    if (-not [string]::IsNullOrWhiteSpace($Subject)) { $args += @("-Subject", $Subject) }
    if (-not [string]::IsNullOrWhiteSpace($Detail)) { $args += @("-Detail", $Detail) }
    if (-not [string]::IsNullOrWhiteSpace($Layout)) { $args += @("-Layout", $Layout) }

    if (-not [string]::IsNullOrWhiteSpace($Duration)) {
        $args += @("-Duration", $Duration)
    }
}

$output = & $powershellExe @args 2>&1
$exitCode = $LASTEXITCODE

if ($output) {
    $output | ForEach-Object { Write-Output $_ }
}

exit $exitCode
