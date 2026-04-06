#!/usr/bin/env bash
# ==========================================================
# Bootstrap updater — solves the chicken-and-egg problem.
#
# Always fetches the latest update.sh from origin before running it.
# This script is tiny and should never need updating itself.
#
# Usage: bash scripts/bootstrap-update.sh
# ==========================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$REPO_ROOT"

# Fetch latest from origin (just refs, no merge)
git fetch origin main --quiet 2>/dev/null || {
    echo "  Failed to fetch from origin. Check your internet connection and access token."
    exit 1
}

# Pull the latest update.sh before running it
git checkout origin/main -- scripts/update.sh 2>/dev/null || {
    echo "  Failed to fetch latest update script."
    exit 1
}

# Run the freshly pulled update script
exec bash scripts/update.sh
