# =============================================================================
# Agentic OS — Install 'centre' PowerShell function into $PROFILE
# =============================================================================
# Adds a function called `centre` to the current user's PowerShell profile
# that launches scripts\centre.ps1 from anywhere. Idempotent.
# =============================================================================

$ErrorActionPreference = "Stop"

$ScriptDir   = Split-Path -Parent $MyInvocation.MyCommand.Path
$CentreScript = Join-Path $ScriptDir "centre.ps1"
$Marker      = "# Agentic OS — command centre launcher"

if (-not (Test-Path $CentreScript)) {
    Write-Host "  ✗ centre.ps1 not found at $CentreScript" -ForegroundColor Red
    exit 1
}

# Ensure the profile file exists.
if (-not (Test-Path $PROFILE)) {
    New-Item -ItemType File -Path $PROFILE -Force | Out-Null
}

$existing = Get-Content $PROFILE -Raw -ErrorAction SilentlyContinue
if ($existing -and ($existing -match [regex]::Escape($Marker))) {
    Write-Host "  ✓ 'centre' already present in `$PROFILE" -ForegroundColor Green
    exit 0
}

$functionBlock = @"

$Marker
function centre {
    & "$CentreScript" @Args
}
"@

Add-Content -Path $PROFILE -Value $functionBlock
Write-Host "  ✓ Added 'centre' function to `$PROFILE ($PROFILE)" -ForegroundColor Green
Write-Host "  ! Open a new PowerShell window (or run: . `$PROFILE) to activate it." -ForegroundColor Yellow
