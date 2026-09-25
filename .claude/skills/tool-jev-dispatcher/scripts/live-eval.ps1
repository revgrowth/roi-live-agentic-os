# Dry-run the dispatcher over the labeled eval set against live Jev.
# Does not create ENABLED.on. Does not print TYPESAFE_API_KEY.
$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($env:TYPESAFE_API_KEY)) {
    Write-Error "TYPESAFE_API_KEY is not set. Set it in this session. This script does not read a key file and does not print the key."
    exit 2
}

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$skillRoot = (Resolve-Path (Join-Path $scriptDir "..")).Path
$repoRoot = (Resolve-Path (Join-Path $skillRoot "..\..\..")).Path
$tempo = Join-Path $repoRoot ".claude\skills\tool-tempo-efficiency"
$polaris = Join-Path $repoRoot ".claude\skills\tool-polaris-df"
$parts = @($skillRoot, $tempo, $polaris)
if (-not [string]::IsNullOrWhiteSpace($env:PYTHONPATH)) {
    $parts += $env:PYTHONPATH
}
$env:PYTHONPATH = $parts -join [IO.Path]::PathSeparator

$jobs = Join-Path $repoRoot "clients\roi-live\projects\jev-dispatcher-2026-09\eval\jobs.jsonl"
$root = Join-Path $repoRoot "clients\roi-live\projects\jev-dispatcher-2026-09\eval-run"
$report = Join-Path $root "live-eval-report.json"
New-Item -ItemType Directory -Force -Path $root | Out-Null

$python = $null
if (Get-Command python -ErrorAction SilentlyContinue) {
    $python = "python"
} elseif (Get-Command py -ErrorAction SilentlyContinue) {
    $python = "py"
} else {
    Write-Error "Python was not found on PATH. Install Python 3.10+ and retry."
    exit 2
}

& $python -m jev_dispatcher.live_eval --jobs $jobs --root $root --report $report
exit $LASTEXITCODE
