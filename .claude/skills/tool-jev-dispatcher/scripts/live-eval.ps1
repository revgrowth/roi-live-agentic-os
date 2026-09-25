# Dry-run the dispatcher over the labeled eval set against live Jev.
# Does not create ENABLED.on. Does not print TYPESAFE_API_KEY.
$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$skillRoot = (Resolve-Path (Join-Path $scriptDir "..")).Path
$repoRoot = (Resolve-Path (Join-Path $skillRoot "..\..\..")).Path

if ([string]::IsNullOrWhiteSpace($env:TYPESAFE_API_KEY)) {
    $envFile = Join-Path $repoRoot ".env"
    if (Test-Path -LiteralPath $envFile) {
        foreach ($line in Get-Content -LiteralPath $envFile) {
            if ($line -match '^\s*#' -or [string]::IsNullOrWhiteSpace($line)) { continue }
            if ($line -match '^\s*TYPESAFE_API_KEY\s*=\s*(.*)$') {
                $value = $Matches[1].Trim()
                if (
                    ($value.StartsWith('"') -and $value.EndsWith('"') -and $value.Length -ge 2) -or
                    ($value.StartsWith("'") -and $value.EndsWith("'") -and $value.Length -ge 2)
                ) {
                    $value = $value.Substring(1, $value.Length - 2)
                }
                if (-not [string]::IsNullOrWhiteSpace($value)) {
                    $env:TYPESAFE_API_KEY = $value
                }
                break
            }
        }
    }
}

if ([string]::IsNullOrWhiteSpace($env:TYPESAFE_API_KEY)) {
    Write-Error "TYPESAFE_API_KEY is not set. Set it in this session or in the repo-root .env. This script does not print the key."
    exit 2
}

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
