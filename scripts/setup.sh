#!/usr/bin/env bash
set -euo pipefail

# Agentic OS — System Setup
# Installs all CLI dependencies needed by skills in this repo.
# Run once after cloning: bash scripts/setup.sh

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

ok()   { printf "${GREEN}  ✓ %s${NC}\n" "$1"; }
warn() { printf "${YELLOW}  → %s${NC}\n" "$1"; }
fail() { printf "${RED}  ✗ %s${NC}\n" "$1"; }

installed() { command -v "$1" &>/dev/null; }

# ---------- Load .env if it exists ----------
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
if [[ -f "$REPO_ROOT/.env" ]]; then
    set -a
    source "$REPO_ROOT/.env"
    set +a
fi

echo ""
echo "========================================="
echo "  Agentic OS — Dependency Setup"
echo "========================================="
echo ""

ERRORS=0

# ---------- Homebrew (macOS) ----------
if [[ "$(uname)" == "Darwin" ]]; then
    printf "Checking brew... "
    if installed brew; then
        ok "brew found"
    else
        fail "brew not found — install from https://brew.sh"
        ERRORS=$((ERRORS + 1))
    fi
fi

# ---------- Python 3 ----------
printf "Checking python3... "
if installed python3; then
    ok "python3 $(python3 --version 2>&1 | awk '{print $2}')"
else
    fail "python3 not found"
    if installed brew; then
        warn "Installing python3 via brew..."
        brew install python3 && ok "python3 installed" || { fail "python3 install failed"; ERRORS=$((ERRORS + 1)); }
    else
        fail "Install python3 manually"; ERRORS=$((ERRORS + 1))
    fi
fi

# ---------- uv (Python package manager) ----------
printf "Checking uv... "
if installed uv; then
    ok "uv $(uv --version 2>&1 | awk '{print $2}')"
else
    warn "Installing uv..."
    if installed brew; then
        brew install uv && ok "uv installed" || { fail "uv install failed"; ERRORS=$((ERRORS + 1)); }
    else
        curl -LsSf https://astral.sh/uv/install.sh | sh && ok "uv installed" || { fail "uv install failed"; ERRORS=$((ERRORS + 1)); }
    fi
fi

# ---------- yt-dlp (YouTube transcripts) ----------
printf "Checking yt-dlp... "
if installed yt-dlp; then
    ok "yt-dlp found"
else
    warn "Installing yt-dlp..."
    if installed brew; then
        brew install yt-dlp && ok "yt-dlp installed" || { fail "yt-dlp install failed"; ERRORS=$((ERRORS + 1)); }
    elif installed pip3; then
        pip3 install yt-dlp && ok "yt-dlp installed" || { fail "yt-dlp install failed"; ERRORS=$((ERRORS + 1)); }
    else
        fail "Cannot install yt-dlp — need brew or pip3"; ERRORS=$((ERRORS + 1))
    fi
fi

# ---------- ffmpeg (video processing) ----------
printf "Checking ffmpeg... "
if installed ffmpeg; then
    ok "ffmpeg found"
else
    warn "Installing ffmpeg..."
    if installed brew; then
        brew install ffmpeg && ok "ffmpeg installed" || { fail "ffmpeg install failed"; ERRORS=$((ERRORS + 1)); }
    else
        fail "Install ffmpeg manually — https://ffmpeg.org/download.html"; ERRORS=$((ERRORS + 1))
    fi
fi

# ---------- Google Workspace CLI (gws) ----------
printf "Checking gws... "
if installed gws; then
    ok "gws $(gws --version 2>&1 | head -1)"
else
    warn "Installing gws (Google Workspace CLI)..."
    GWS_INSTALLER=$(mktemp)
    if curl -sSfL "https://github.com/googleworkspace/cli/releases/latest/download/gws-installer.sh" -o "$GWS_INSTALLER" 2>/dev/null; then
        chmod +x "$GWS_INSTALLER"
        sh "$GWS_INSTALLER" && ok "gws installed" || { fail "gws install failed"; ERRORS=$((ERRORS + 1)); }
        rm -f "$GWS_INSTALLER"
    else
        fail "Could not download gws installer — install manually from https://github.com/googleworkspace/cli"
        ERRORS=$((ERRORS + 1))
    fi
fi

# ---------- gcloud CLI (Google Cloud SDK) ----------
printf "Checking gcloud... "
if installed gcloud; then
    ok "gcloud $(gcloud --version 2>&1 | head -1 | awk '{print $4}')"
else
    warn "Installing gcloud..."
    if [[ "$(uname)" == "Darwin" ]] && installed brew; then
        brew install --cask google-cloud-sdk && ok "gcloud installed" || {
            fail "gcloud brew install failed — install from https://cloud.google.com/sdk/docs/install"
            ERRORS=$((ERRORS + 1))
        }
    else
        fail "Install gcloud manually — https://cloud.google.com/sdk/docs/install"
        ERRORS=$((ERRORS + 1))
    fi
fi

# ---------- .env file ----------
echo ""
printf "Checking .env... "
if [[ -f "$REPO_ROOT/.env" ]]; then
    ok ".env exists"
else
    cp "$REPO_ROOT/.env.example" "$REPO_ROOT/.env"
    warn "Created .env from .env.example — add your API keys to .env"
fi

# ---------- gws auth (if credentials are in .env) ----------
if installed gws; then
    if [[ -n "${GOOGLE_WORKSPACE_CLI_CLIENT_ID:-}" ]] && [[ -n "${GOOGLE_WORKSPACE_CLI_CLIENT_SECRET:-}" ]]; then
        echo ""
        printf "Checking gws auth... "
        if gws auth status &>/dev/null; then
            ok "gws already authenticated"
        else
            warn "OAuth credentials found in .env — running gws auth login..."
            echo "  A browser window will open for Google sign-in."
            gws auth login && ok "gws authenticated" || fail "gws auth failed — try running 'gws auth login' manually"
        fi
    else
        echo ""
        warn "gws OAuth credentials not set in .env — skipping auth (see .env.example)"
    fi
fi

# ---------- Summary ----------
echo ""
echo "========================================="
if [[ $ERRORS -eq 0 ]]; then
    printf "${GREEN}  All dependencies installed!${NC}\n"
else
    printf "${YELLOW}  Done with %d issue(s) — see above.${NC}\n" "$ERRORS"
fi
echo "========================================="
echo ""
echo "Next steps:"
echo "  1. Add API keys to .env (see .env.example for details)"
echo "  2. Run: gcloud auth login (if not already authenticated)"
echo "  3. Run: gws auth login (after configuring OAuth — see README)"
echo ""
