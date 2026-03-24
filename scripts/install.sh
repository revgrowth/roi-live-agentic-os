#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# Agentic OS — Installer
# =============================================================================
# Main installer for new users. Run after `git clone`:
#   bash scripts/install.sh
#
# What it does:
#   1. Checks prerequisites (git, bash, python3)
#   2. Creates .env from .env.example if missing
#   3. Runs scripts/setup.sh for system dependencies
#   4. Installs all skills (selection happens during first Claude session)
#   5. Writes installed.json
#   6. Prints next steps
#
# Idempotent — safe to run multiple times.
# =============================================================================

# ---------- Resolve repo root from script location ----------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"

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
PYTHON_CMD="python3"

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

# Python 3 — check python3 first, fall back to python (Windows often uses 'python')
printf "  python3 ...... "
if command -v python3 &>/dev/null; then
    printf "${GREEN}$(python3 --version 2>&1 | awk '{print $2}')${NC}\n"
    PYTHON_CMD="python3"
elif command -v python &>/dev/null; then
    PY_VER=$(python --version 2>&1 | awk '{print $2}')
    case "$PY_VER" in
        3.*) printf "${GREEN}${PY_VER} (as 'python')${NC}\n"
             PYTHON_CMD="python" ;;
        *)   printf "${RED}found python ${PY_VER} — need Python 3${NC}\n"
             fail "Install Python 3: https://www.python.org/downloads/"
             PREREQ_FAIL=1 ;;
    esac
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
# 3. Create .env from .env.example if missing
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
echo ""

# =============================================================================
# 4. Run system dependency setup
# =============================================================================
info "Installing system dependencies..."
echo ""

if [[ -f "$REPO_ROOT/scripts/setup.sh" ]]; then
    PYTHON_CMD="$PYTHON_CMD" bash "$REPO_ROOT/scripts/setup.sh" || true
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

$PYTHON_CMD << PYEOF
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

# ---------- Install cron dispatcher ----------
echo ""
echo "  Installing cron dispatcher..."
bash "$SCRIPT_DIR/install-crons.sh"

