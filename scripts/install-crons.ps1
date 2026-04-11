[CmdletBinding()]
param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$Arguments
)

Write-Host "install-crons is deprecated. Starting the managed cron daemon instead."
& (Join-Path $PSScriptRoot "start-crons.ps1") @Arguments
