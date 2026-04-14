#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# Agentic OS — Installer
# =============================================================================
# Main installer for new users. Run after `git clone`:
#   bash scripts/install.sh
#
# What it does:
#   1. Checks prerequisites (git, bash, Python 3, node)
#   2. Creates .env from .env.example if missing
#   3. Runs scripts/setup.sh for system dependencies
#   4. Installs all skills (selection happens during first Claude session)
#   5. Writes installed.json
#   6. Installs GSD project framework (get-shit-done-cc)
#   7. Prints next steps
#
# Idempotent — safe to run multiple times.
# =============================================================================

# ---------- Resolve repo root from script location ----------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
source "$SCRIPT_DIR/lib/python.sh"

# Convert MSYS/Git Bash paths to Windows-native for Python compatibility
case "$(uname -s)" in
    MINGW*|MSYS*|CYGWIN*) REPO_ROOT="$(cygpath -m "$REPO_ROOT")" ;;
esac

# ---------- Colors ----------
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m'

# ---------- Helpers ----------
info()    { printf "${CYAN}%s${NC}\n" "$1"; }
success() { printf "${GREEN}  ✓ %s${NC}\n" "$1"; }
warn()    { printf "${YELLOW}  ! %s${NC}\n" "$1"; }
fail()    { printf "${RED}  ✗ %s${NC}\n" "$1"; }

# ---------- Paths ----------
CATALOG="$REPO_ROOT/.claude/skills/_catalog/catalog.json"
INSTALLED_JSON="$REPO_ROOT/.claude/skills/_catalog/installed.json"
SKILLS_DIR="$REPO_ROOT/.claude/skills"
CRON_DRY_RUN="${AGENTIC_OS_CRON_DRY_RUN:-0}"

# =============================================================================
# 1. Welcome banner
# =============================================================================
clear 2>/dev/null || true
echo ""
printf "${CYAN}${BOLD}"
cat << 'BANNER'
    ╔══════════════════════════════════════════════╗
    ║                                              ║
    ║            A G E N T I C   O S               ║
    ║                                              ║
    ║      Your AI-powered business assistant      ║
    ║                                              ║
    ╚══════════════════════════════════════════════╝
BANNER
printf "${NC}"
echo ""
printf "${DIM}  Installer v1.0${NC}\n"
echo ""

# =============================================================================
# 2. Check prerequisites
# =============================================================================
info "Checking prerequisites..."
echo ""

PREREQ_FAIL=0

# Git
printf "  git .......... "
if command -v git &>/dev/null; then
    printf "${GREEN}$(git --version | awk '{print $3}')${NC}\n"
else
    printf "${RED}not found${NC}\n"
    fail "Install git: https://git-scm.com/downloads"
    PREREQ_FAIL=1
fi

# Bash (version 3+ is fine for this script)
printf "  bash ......... "
if command -v bash &>/dev/null; then
    printf "${GREEN}${BASH_VERSION}${NC}\n"
else
    printf "${RED}not found${NC}\n"
    fail "bash is required"
    PREREQ_FAIL=1
fi

# Node.js (required for GSD project framework)
printf "  node ......... "
if command -v node &>/dev/null; then
    printf "${GREEN}$(node --version 2>&1)${NC}\n"
else
    printf "${YELLOW}not found${NC}\n"
    warn "Node.js is recommended for GSD project management."
    warn "Install from: https://nodejs.org/"
fi

# Python 3 — validate by executing it, not just by checking PATH
printf "  Python 3 ..... "
if resolve_python_cmd; then
    printf "${GREEN}${PYTHON_VERSION} (via ${PYTHON_LABEL})${NC}\n"
    if is_windows_shell && [[ $PYTHON3_DIAGNOSTIC_BROKEN -eq 1 ]]; then
        warn "Windows exposes a non-working python3 at ${PYTHON3_DIAGNOSTIC_PATH}."
        warn "Agentic OS will use '${PYTHON_LABEL}' instead. Manual cleanup is optional: disable the App Execution Alias or adjust PATH."
    fi
else
    printf "${RED}not found${NC}\n"
    fail "Install Python 3: https://www.python.org/downloads/"
    PREREQ_FAIL=1
fi

echo ""

if [[ $PREREQ_FAIL -ne 0 ]]; then
    fail "Missing prerequisites — install them and re-run this script."
    exit 1
fi

success "All prerequisites met"
echo ""

# =============================================================================
# 3. Set up YOUR private GitHub repository
# =============================================================================
# Agentic OS stores your brand voice, client data, session memory, and project
# outputs. Backing this up to your own private GitHub repo keeps it safe and
# means you can pull framework updates from upstream without losing your work.
#
# This step runs every time install.sh is called. If a personal repo is already
# configured it skips silently.
# =============================================================================

setup_github_repo() {
    local UPSTREAM_OWNER="simonc602"
    local UPSTREAM_REPO="agentic-os"

    # Detect current origin
    local ORIGIN_URL=""
    ORIGIN_URL=$(git -C "$REPO_ROOT" remote get-url origin 2>/dev/null || echo "")

    # Check if origin points to the upstream (template) repo
    local IS_UPSTREAM=0
    if [[ "$ORIGIN_URL" == *"${UPSTREAM_OWNER}/${UPSTREAM_REPO}"* ]]; then
        IS_UPSTREAM=1
    fi

    # If origin is already the user's own repo (not upstream), skip
    if [[ -n "$ORIGIN_URL" ]] && [[ $IS_UPSTREAM -eq 0 ]]; then
        success "GitHub repo configured: $ORIGIN_URL"
        return 0
    fi

    # No origin, or origin is still the upstream template repo
    echo ""
    printf "${CYAN}${BOLD}═══════════════════════════════════════════════${NC}\n"
    printf "${CYAN}${BOLD}  Back up your data to GitHub${NC}\n"
    printf "${CYAN}${BOLD}═══════════════════════════════════════════════${NC}\n"
    echo ""
    echo "  Agentic OS stores your brand voice, client data, and project"
    echo "  outputs locally. To keep it safe, you should back it up to"
    printf "  your own ${BOLD}private${NC} GitHub repository.\n"
    echo ""
    printf "  ${DIM}Only you can access a private repo — your business data${NC}\n"
    printf "  ${DIM}stays private. The upstream Agentic OS repo is kept as a${NC}\n"
    printf "  ${DIM}separate remote so you can still pull framework updates.${NC}\n"
    echo ""

    # Check if gh CLI is available
    if ! command -v gh &>/dev/null; then
        warn "GitHub CLI (gh) not found."
        echo ""
        echo "  To set up your private repo manually:"
        echo ""
        echo "    1. Create a new PRIVATE repo on GitHub (e.g. my-agentic-os)"
        echo "    2. Run these commands:"
        echo ""
        if [[ $IS_UPSTREAM -eq 1 ]]; then
            echo "       git remote rename origin upstream"
            echo "       git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
        else
            echo "       git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
        fi
        echo "       git push -u origin main"
        echo ""
        echo "  Or install the GitHub CLI for automatic setup:"
        echo "    brew install gh  (macOS)  |  winget install GitHub.cli  (Windows)"
        echo ""
        printf "  ${DIM}You can re-run this installer anytime to complete this step.${NC}\n"
        echo ""
        return 0
    fi

    # Check if user is authenticated with gh
    if ! gh auth status &>/dev/null 2>&1; then
        warn "GitHub CLI found but not authenticated."
        echo ""
        echo "  Run: gh auth login"
        echo "  Then re-run this installer to set up your private repo."
        echo ""
        return 0
    fi

    # Get GitHub username
    local GH_USER=""
    GH_USER=$(gh api user --jq '.login' 2>/dev/null || echo "")
    if [[ -z "$GH_USER" ]]; then
        warn "Could not determine your GitHub username."
        return 0
    fi

    echo "  Logged in as: ${BOLD}${GH_USER}${NC}"
    echo ""

    # Ask user if they want to create a repo now
    printf "  Create a private GitHub repo to back up your data? ${BOLD}[Y/n]${NC} "
    read -r REPLY
    REPLY="${REPLY:-Y}"

    if [[ ! "$REPLY" =~ ^[Yy] ]]; then
        warn "Skipped — you can re-run the installer anytime to set this up."
        echo ""
        return 0
    fi

    # Ask for repo name
    local DEFAULT_REPO="agentic-os"
    printf "  Repo name? ${DIM}[${DEFAULT_REPO}]${NC} "
    read -r REPO_NAME
    REPO_NAME="${REPO_NAME:-$DEFAULT_REPO}"

    echo ""
    info "Creating private repo: ${GH_USER}/${REPO_NAME}..."
    echo ""

    # Create the private repo on GitHub
    if gh repo create "${REPO_NAME}" --private --source="$REPO_ROOT" --remote=origin 2>/dev/null; then
        # If upstream was the old origin, it's already been handled by --source
        # But let's make sure upstream remote exists for pulling updates
        if [[ $IS_UPSTREAM -eq 1 ]]; then
            # gh repo create with --source may have replaced origin already
            # Ensure upstream remote points to the template repo
            git -C "$REPO_ROOT" remote remove upstream 2>/dev/null || true
            git -C "$REPO_ROOT" remote add upstream "$ORIGIN_URL" 2>/dev/null || true
        fi
        success "Private repo created: https://github.com/${GH_USER}/${REPO_NAME}"
        echo ""

        # Push current state
        info "Pushing your data to your private repo..."
        if git -C "$REPO_ROOT" push -u origin main 2>/dev/null; then
            success "All data backed up"
        else
            # Try pushing current branch if main doesn't exist
            local CURRENT_BRANCH
            CURRENT_BRANCH=$(git -C "$REPO_ROOT" branch --show-current 2>/dev/null || echo "main")
            git -C "$REPO_ROOT" push -u origin "$CURRENT_BRANCH" 2>/dev/null || true
            success "Data pushed to ${CURRENT_BRANCH}"
        fi

        echo ""
        printf "  ${GREEN}${BOLD}Your data is safe.${NC} Only you can access this repo.\n"
        echo ""
        echo "  To pull framework updates later:"
        echo "    git pull upstream main"
        echo ""
    else
        # Repo might already exist
        local EXISTING_URL="https://github.com/${GH_USER}/${REPO_NAME}.git"
        warn "Could not create repo (it may already exist)."
        echo ""
        echo "  Connecting to: ${EXISTING_URL}"

        if [[ $IS_UPSTREAM -eq 1 ]]; then
            git -C "$REPO_ROOT" remote rename origin upstream 2>/dev/null || true
        fi
        git -C "$REPO_ROOT" remote remove origin 2>/dev/null || true
        git -C "$REPO_ROOT" remote add origin "$EXISTING_URL" 2>/dev/null || true

        if git -C "$REPO_ROOT" push -u origin main 2>/dev/null; then
            success "Connected and backed up to: ${EXISTING_URL}"
        else
            local CURRENT_BRANCH
            CURRENT_BRANCH=$(git -C "$REPO_ROOT" branch --show-current 2>/dev/null || echo "main")
            git -C "$REPO_ROOT" push -u origin "$CURRENT_BRANCH" 2>/dev/null || warn "Push failed — check repo permissions"
        fi
        echo ""
    fi
}

setup_github_repo
echo ""

# =============================================================================
# 4. Create .env from .env.example if missing (was step 3)
# =============================================================================
info "Checking environment..."
echo ""

if [[ -f "$REPO_ROOT/.env" ]]; then
    success ".env already exists"
else
    if [[ -f "$REPO_ROOT/.env.example" ]]; then
        cp "$REPO_ROOT/.env.example" "$REPO_ROOT/.env"
        success "Created .env from .env.example"
        warn "Add your API keys to .env later — skills work without them"
    else
        warn "No .env.example found — skipping .env creation"
    fi
fi

# Create user data directories and files from templates
mkdir -p "$REPO_ROOT/brand_context"
success "brand_context/ directory ready"

if [[ ! -f "$REPO_ROOT/context/USER.md" ]]; then
    cp "$REPO_ROOT/context/USER.md.template" "$REPO_ROOT/context/USER.md"
    rm -f "$REPO_ROOT/context/USER.md.template"
    success "Created context/USER.md from template"
else
    rm -f "$REPO_ROOT/context/USER.md.template"
    success "context/USER.md already exists"
fi

if [[ ! -f "$REPO_ROOT/context/learnings.md" ]]; then
    cp "$REPO_ROOT/context/learnings.md.template" "$REPO_ROOT/context/learnings.md"
    rm -f "$REPO_ROOT/context/learnings.md.template"
    success "Created context/learnings.md from template"
else
    rm -f "$REPO_ROOT/context/learnings.md.template"
    success "context/learnings.md already exists"
fi

# Copy skill config templates
AVATAR_CFG="$REPO_ROOT/.claude/skills/viz-ugc-heygen/references/avatar-config.md"
if [[ ! -f "$AVATAR_CFG" ]] && [[ -f "${AVATAR_CFG}.template" ]]; then
    cp "${AVATAR_CFG}.template" "$AVATAR_CFG"
    rm -f "${AVATAR_CFG}.template"
    success "Created avatar-config.md from template"
else
    rm -f "${AVATAR_CFG}.template" 2>/dev/null
fi
echo ""

# =============================================================================
# 4. Run system dependency setup
# =============================================================================
info "Installing system dependencies..."
echo ""

if [[ -f "$REPO_ROOT/scripts/setup.sh" ]]; then
    bash "$REPO_ROOT/scripts/setup.sh" || true
else
    warn "scripts/setup.sh not found — skipping dependency install"
fi
echo ""

# =============================================================================
# 5. Verify catalog exists
# =============================================================================
if [[ ! -f "$CATALOG" ]]; then
    fail "Catalog not found at $CATALOG"
    fail "Your clone may be incomplete. Try: git checkout -- .claude/skills/_catalog/"
    exit 1
fi

# =============================================================================
# 6. Write installed.json with all skills (selection happens during onboarding)
# =============================================================================
echo ""

"${PYTHON_CMD[@]}" << PYEOF
import json, datetime, os

catalog_path = "$CATALOG"
installed_json = "$INSTALLED_JSON"

with open(catalog_path) as f:
    catalog = json.load(f)

core = catalog['core_skills']
optional = catalog['skills']

# Install all skills — the user picks which to keep during their first session
all_skills = sorted(set(core) | set(optional.keys()))

# Write installed.json
os.makedirs(os.path.dirname(installed_json), exist_ok=True)
data = {
    'installed_at': datetime.date.today().isoformat(),
    'version': catalog['version'],
    'installed_skills': all_skills,
    'removed_skills': [],
    'selection_pending': True
}
with open(installed_json, 'w') as f:
    json.dump(data, f, indent=2)
    f.write('\n')

# Print summary
print()
print("\033[0;36m\033[1m═══════════════════════════════════════════════\033[0m")
print("\033[0;36m\033[1m  Installation Complete\033[0m")
print("\033[0;36m\033[1m═══════════════════════════════════════════════\033[0m")
print()
print(f"  \033[1m{len(all_skills)} skills ready\033[0m — you'll choose which to keep")
print("  during your first session.")
print()
print("  \033[1mNext steps:\033[0m")
print("    1. Run \033[1mclaude\033[0m — it'll walk you through brand setup + skill selection")
print("    2. Add API keys to .env later if any skills need them")
print()
PYEOF

# =============================================================================
# 7. Install GSD project framework
# =============================================================================
echo ""
info "Installing GSD project framework..."
echo ""

if [[ "$CRON_DRY_RUN" == "1" ]]; then
    warn "AGENTIC_OS_CRON_DRY_RUN=1 set — skipping GSD install during installer dry run."
elif command -v node &>/dev/null; then
    GSD_GLOBAL="$HOME/.claude/commands/gsd"
    GSD_LOCAL="$REPO_ROOT/.claude/commands/gsd"
    if [[ -d "$GSD_GLOBAL" ]] && [[ $(ls -1 "$GSD_GLOBAL"/*.md 2>/dev/null | wc -l) -gt 10 ]]; then
        success "GSD already installed globally ($(ls -1 "$GSD_GLOBAL"/*.md | wc -l | tr -d ' ') commands)"
    else
        if npx get-shit-done-cc --global --claude 2>/dev/null; then
            success "GSD installed globally"
        else
            warn "GSD installation failed — you can install it later with: npx get-shit-done-cc --global --claude"
        fi
    fi
    # Clean up any local GSD install (migrating to global)
    if [[ -d "$GSD_LOCAL" ]]; then
        rm -rf "$GSD_LOCAL"
        # Also clean local GSD agents
        find "$REPO_ROOT/.claude/agents" -name "gsd-*.md" -delete 2>/dev/null || true
        success "Cleaned up local GSD files (now global)"
    fi
else
    warn "Skipping GSD — Node.js not found. Install Node.js, then run: npx get-shit-done-cc --global --claude"
fi
echo ""

if [[ "$CRON_DRY_RUN" == "1" ]]; then
    warn "Installer dry run complete — skipping alias installation."
    exit 0
fi

# =============================================================================
# 7. Install `centre` shell alias
# =============================================================================
echo ""
info "Installing 'centre' launcher alias..."
echo ""

CENTRE_SCRIPT="$SCRIPT_DIR/centre.sh"
ALIAS_LINE="alias centre='bash \"$CENTRE_SCRIPT\"'"
ALIAS_MARKER="# Agentic OS — command centre launcher"

install_alias_into() {
    local rc="$1"
    [[ -z "$rc" ]] && return 0
    # Create the rc file if it doesn't exist
    touch "$rc"
    if grep -Fq "$ALIAS_MARKER" "$rc" 2>/dev/null; then
        success "Alias already present in $(basename "$rc")"
        return 0
    fi
    {
        echo ""
        echo "$ALIAS_MARKER"
        echo "$ALIAS_LINE"
    } >> "$rc"
    success "Added 'centre' alias to $(basename "$rc")"
}

USER_SHELL_NAME="$(basename "${SHELL:-}")"
RELOAD_HINT=""

case "$(uname -s)" in
    Darwin|Linux)
        case "$USER_SHELL_NAME" in
            zsh)
                install_alias_into "$HOME/.zshrc"
                RELOAD_HINT="source ~/.zshrc"
                ;;
            bash)
                # macOS bash login shells read .bash_profile; Linux non-login reads .bashrc.
                if [[ "$(uname -s)" == "Darwin" ]]; then
                    install_alias_into "$HOME/.bash_profile"
                    RELOAD_HINT="source ~/.bash_profile"
                else
                    install_alias_into "$HOME/.bashrc"
                    RELOAD_HINT="source ~/.bashrc"
                fi
                ;;
            fish)
                mkdir -p "$HOME/.config/fish"
                FISH_LINE="alias centre 'bash \"$CENTRE_SCRIPT\"'"
                FISH_RC="$HOME/.config/fish/config.fish"
                touch "$FISH_RC"
                if grep -Fq "$ALIAS_MARKER" "$FISH_RC"; then
                    success "Alias already present in config.fish"
                else
                    { echo ""; echo "$ALIAS_MARKER"; echo "$FISH_LINE"; } >> "$FISH_RC"
                    success "Added 'centre' alias to config.fish"
                fi
                RELOAD_HINT="source ~/.config/fish/config.fish"
                ;;
            *)
                warn "Unrecognised shell '\$SHELL=$USER_SHELL_NAME' — install the alias manually:"
                echo "    $ALIAS_LINE"
                ;;
        esac
        echo ""
        if [[ -n "$RELOAD_HINT" ]]; then
            warn "Open a new terminal (or run '$RELOAD_HINT') to activate the alias."
        fi
        info "Then launch the command centre from anywhere with: centre"
        ;;
    MINGW*|MSYS*|CYGWIN*)
        # Git Bash on Windows — install bash alias AND a PowerShell profile function.
        [[ -f "$HOME/.bashrc" ]] && install_alias_into "$HOME/.bashrc"
        if command -v powershell.exe &>/dev/null; then
            info "Installing PowerShell 'centre' function into \$PROFILE..."
            powershell.exe -NoProfile -ExecutionPolicy Bypass -File "$(cygpath -w "$SCRIPT_DIR/install-centre-alias.ps1" 2>/dev/null || echo "$SCRIPT_DIR/install-centre-alias.ps1")" \
                || warn "PowerShell alias install failed — you can run scripts\\install-centre-alias.ps1 manually."
        else
            warn "PowerShell not found — skipping \$PROFILE install."
            warn "On Windows, prefer: powershell -File scripts\\centre.ps1"
        fi
        ;;
    *)
        warn "Unknown shell environment — install the alias manually:"
        echo "    $ALIAS_LINE"
        ;;
esac
echo ""
