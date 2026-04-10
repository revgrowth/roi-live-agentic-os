#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# Agentic OS — Command Centre Launcher
# =============================================================================
# Launches the local command centre (Next.js app) with one command.
#
# Usage:
#   bash scripts/centre.sh              # from repo root
#   centre                              # from anywhere, if alias is installed
#   centre --clean                      # wipe .next/ cache before starting
#
# What it does:
#   1. Resolves the repo root from the script's own location.
#   2. If the centre is already serving on the port, just opens the browser.
#   3. Installs npm dependencies on first run.
#   4. Optionally clears the .next/ cache (--clean).
#   5. Starts the Next.js dev server and opens http://localhost:PORT.
# =============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
CENTRE_DIR="$REPO_ROOT/projects/briefs/command-centre"
PORT="${PORT:-3000}"
URL="http://localhost:${PORT}"

CLEAN=0
for arg in "$@"; do
    case "$arg" in
        --clean) CLEAN=1 ;;
        -h|--help)
            sed -n '4,20p' "$0"
            exit 0
            ;;
    esac
done

GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m'

info()    { printf "${CYAN}%s${NC}\n" "$1"; }
success() { printf "${GREEN}  ✓ %s${NC}\n" "$1"; }
warn()    { printf "${YELLOW}  ! %s${NC}\n" "$1"; }
fail()    { printf "${RED}  ✗ %s${NC}\n" "$1"; }

open_browser() {
    if command -v open &>/dev/null; then
        open "$URL" 2>/dev/null || true
    elif command -v xdg-open &>/dev/null; then
        xdg-open "$URL" 2>/dev/null || true
    fi
}

if [[ ! -d "$CENTRE_DIR" ]]; then
    fail "Command centre not found at: $CENTRE_DIR"
    exit 1
fi

if ! command -v node &>/dev/null; then
    fail "Node.js is required. Install from https://nodejs.org/"
    exit 1
fi

if ! command -v npm &>/dev/null; then
    fail "npm is required (ships with Node.js)."
    exit 1
fi

# If the centre already responds on the port, just open the browser and exit.
# This prevents a second `centre` invocation from killing the first one.
if command -v curl &>/dev/null && curl -sf -o /dev/null --max-time 1 "$URL"; then
    info "Command centre already running at $URL — opening browser."
    open_browser
    exit 0
fi

cd "$CENTRE_DIR"

if [[ "$CLEAN" -eq 1 ]] && [[ -d ".next" ]]; then
    info "Cleaning .next/ cache..."
    rm -rf .next
    success "Cache cleared"
fi

if [[ ! -d "node_modules" ]]; then
    info "First run — installing command centre dependencies..."
    npm install
    success "Dependencies installed"
    echo ""
fi

printf "${CYAN}${BOLD}"
cat << 'BANNER'
    ╔══════════════════════════════════════════════╗
    ║          A G E N T I C   O S                 ║
    ║              Command Centre                  ║
    ╚══════════════════════════════════════════════╝
BANNER
printf "${NC}\n"
info "Starting on ${URL}"
echo ""

# Best-effort auto-open after a short delay, in the background.
(
    sleep 3
    open_browser
) &

exec npm run dev
