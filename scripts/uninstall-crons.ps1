[CmdletBinding()]
param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$Arguments
)

Write-Host "uninstall-crons is deprecated. Stopping the managed cron daemon instead."
& (Join-Path $PSScriptRoot "stop-crons.ps1") @Arguments
