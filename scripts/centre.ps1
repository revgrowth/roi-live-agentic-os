# =============================================================================
# Agentic OS — Command Centre Launcher (Windows / PowerShell)
# =============================================================================
# Usage:
#   powershell -File scripts\centre.ps1
#   centre                              # from anywhere, if profile function installed
#   centre -Clean                       # wipe .next\ cache before starting
# =============================================================================

[CmdletBinding()]
param(
    [switch]$Clean
)

$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot  = Split-Path -Parent $ScriptDir
$CentreDir = Join-Path $RepoRoot "projects\briefs\command-centre"
$Port      = if ($env:PORT) { $env:PORT } else { "3000" }
$Url       = "http://localhost:$Port"

function Info    ($msg) { Write-Host $msg -ForegroundColor Cyan }
function Success ($msg) { Write-Host "  ✓ $msg" -ForegroundColor Green }
function Warn    ($msg) { Write-Host "  ! $msg" -ForegroundColor Yellow }
function Fail    ($msg) { Write-Host "  ✗ $msg" -ForegroundColor Red }

if (-not (Test-Path $CentreDir)) {
    Fail "Command centre not found at: $CentreDir"
    exit 1
}

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Fail "Node.js is required. Install from https://nodejs.org/"
    exit 1
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Fail "npm is required (ships with Node.js)."
    exit 1
}

# If the centre is already serving on the port, just open the browser and exit.
try {
    $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 1 -ErrorAction Stop
    if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 500) {
        Info "Command centre already running at $Url — opening browser."
        Start-Process $Url
        exit 0
    }
} catch {
    # Not running — continue to start it.
}

Set-Location $CentreDir

if ($Clean -and (Test-Path ".next")) {
    Info "Cleaning .next\ cache..."
    Remove-Item -Recurse -Force ".next"
    Success "Cache cleared"
}

if (-not (Test-Path "node_modules")) {
    Info "First run — installing command centre dependencies..."
    npm install
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
    Success "Dependencies installed"
    Write-Host ""
}

Write-Host ""
Write-Host "    ╔══════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "    ║          A G E N T I C   O S                 ║" -ForegroundColor Cyan
Write-Host "    ║              Command Centre                  ║" -ForegroundColor Cyan
Write-Host "    ╚══════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Info "Starting on $Url"
Write-Host ""

# Best-effort auto-open after a short delay.
Start-Job -ScriptBlock {
    param($u)
    Start-Sleep -Seconds 3
    Start-Process $u
} -ArgumentList $Url | Out-Null

npm run dev
