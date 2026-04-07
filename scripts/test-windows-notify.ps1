param(
    [ValidateSet("success", "info", "warning", "error")]
    [string]$Variant = "info",
    [string]$Title = "Agentic OS",
    [string]$Subtitle = "Windows notification test",
    [string]$Message = "",
    [ValidateSet("short", "long")]
    [string]$Duration = "short"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($Message)) {
    $Message = "This is a $Variant test for the shared Windows toast helper."
}

$projectDir = Split-Path -Parent $PSScriptRoot
$helperPath = Join-Path $projectDir "scripts\windows-notify.ps1"
$powershellExe = Join-Path $env:WINDIR "System32\WindowsPowerShell\v1.0\powershell.exe"

$args = @(
    "-NoProfile",
    "-ExecutionPolicy", "Bypass",
    "-File", $helperPath,
    "-Variant", $Variant,
    "-Title", $Title,
    "-Subtitle", $Subtitle,
    "-Message", $Message,
    "-Duration", $Duration
)

$output = & $powershellExe @args 2>&1
$exitCode = $LASTEXITCODE

if ($output) {
    $output | ForEach-Object { Write-Output $_ }
}

exit $exitCode
