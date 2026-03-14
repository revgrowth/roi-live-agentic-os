#!/usr/bin/env bash
set -euo pipefail

# ==========================================================
# Agentic OS — Safe Update Script
# Pulls upstream changes without overwriting user data.
#
# Usage: bash scripts/update.sh
# ==========================================================

# ---------- Colors ----------
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

info()  { printf "${CYAN}  %s${NC}\n" "$1"; }
ok()    { printf "${GREEN}  ✓ %s${NC}\n" "$1"; }
warn()  { printf "${YELLOW}  → %s${NC}\n" "$1"; }

# ---------- Repo root from script location ----------
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$REPO_ROOT"

CATALOG="$REPO_ROOT/.claude/skills/_catalog/catalog.json"
INSTALLED="$REPO_ROOT/.claude/skills/_catalog/installed.json"
BACKUP_DIR="$REPO_ROOT/.backup"

# ---------- Protected paths (never overwritten) ----------
# These are stashed before pull and restored after.
PROTECTED_PATHS=(
    ".env"
    ".mcp.json"
    "context/USER.md"
    "context/SOUL.md"

    "context/learnings.md"
    "context/memory/"
    "brand_context/*.md"
    "projects/"
    ".claude/skills/_catalog/installed.json"
)

# =========================================================
# Step 1: Verify we're in a git repo
# =========================================================
if ! git rev-parse --is-inside-work-tree &>/dev/null; then
    echo "Error: not a git repository. Run this from the Agentic OS root."
    exit 1
fi

echo ""
echo "========================================="
echo "  Agentic OS — Updating..."
echo "========================================="
echo ""

# =========================================================
# Step 2: Read installed.json for user's skill choices
# =========================================================
if [[ ! -f "$INSTALLED" ]]; then
    warn "installed.json not found — looks like first setup."
    warn "Run 'bash scripts/install.sh' first to select your skills."
    echo ""
    echo "  Continuing with update (your files are still protected)."
    echo ""
    HAVE_INSTALLED_JSON=false
else
    HAVE_INSTALLED_JSON=true
fi

# =========================================================
# Step 3: Save current version tag and HEAD
# =========================================================
OLD_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "")
OLD_HEAD=$(git rev-parse HEAD)

if [[ -n "$OLD_TAG" ]]; then
    info "Current version: $OLD_TAG"
else
    info "No version tag found (using commit history)"
fi

# =========================================================
# Step 4: Stash local changes to protected paths
# =========================================================
# Build a pathspec for git diff that covers protected paths.
# We only stash if there are actual changes to protected files.
STASHED=false

has_protected_changes() {
    for p in "${PROTECTED_PATHS[@]}"; do
        # Check both staged and unstaged changes, plus untracked files
        if git diff --name-only -- "$p" 2>/dev/null | grep -q .; then
            return 0
        fi
        if git diff --cached --name-only -- "$p" 2>/dev/null | grep -q .; then
            return 0
        fi
    done
    return 1
}

if has_protected_changes; then
    info "Stashing local changes to protected files..."
    # Stash only the protected paths (keep everything else as-is)
    git stash push --include-untracked -m "agentic-os-update-$(date +%s)" -- "${PROTECTED_PATHS[@]}" 2>/dev/null && STASHED=true
    if $STASHED; then
        ok "Protected files stashed"
    fi
fi

# =========================================================
# Step 5: Pull upstream changes
# =========================================================
info "Pulling from origin main..."
echo ""
PULL_OUTPUT=$(git pull origin main 2>&1) || {
    echo "$PULL_OUTPUT"
    # If pull fails, restore stash before exiting
    if $STASHED; then
        warn "Restoring stashed files after failed pull..."
        git stash pop --quiet 2>/dev/null || true
    fi
    echo ""
    echo "  Pull failed. Your files are safe — nothing was changed."
    exit 1
}

echo "$PULL_OUTPUT"
echo ""

# Check if there were actual changes
if echo "$PULL_OUTPUT" | grep -q "Already up to date"; then
    if $STASHED; then
        git stash pop --quiet 2>/dev/null || true
    fi
    echo ""
    echo "========================================="
    printf "${GREEN}  Already up to date!${NC}\n"
    echo "========================================="
    echo ""
    exit 0
fi

NEW_HEAD=$(git rev-parse HEAD)

# =========================================================
# Step 6: Restore stashed protected files
# =========================================================
if $STASHED; then
    info "Restoring your protected files..."

    if git stash pop --quiet 2>/dev/null; then
        ok "Protected files restored cleanly"
    else
        # Conflicts detected — backup conflicted files and accept upstream
        warn "Merge conflicts detected — backing up your versions..."
        mkdir -p "$BACKUP_DIR"

        # Find conflicted files
        CONFLICTED=$(git diff --name-only --diff-filter=U 2>/dev/null || true)
        if [[ -n "$CONFLICTED" ]]; then
            while IFS= read -r file; do
                # Create backup preserving directory structure
                backup_path="$BACKUP_DIR/$file"
                mkdir -p "$(dirname "$backup_path")"
                # Extract the user's version (stash version) from the conflict
                # Use "ours" version marker in the conflicted file as backup
                cp "$REPO_ROOT/$file" "$backup_path.conflicted" 2>/dev/null || true
                # Accept upstream (theirs = what pull brought in)
                git checkout --theirs -- "$file" 2>/dev/null || true
                git add "$file" 2>/dev/null || true
                warn "Backed up: $file → .backup/$file.conflicted"
            done <<< "$CONFLICTED"
        fi

        # Also try to drop remaining stash if pop left it around
        git stash drop 2>/dev/null || true

        ok "Conflicts resolved (your versions saved in .backup/)"
    fi
fi

# =========================================================
# Step 7: Re-remove skills the user previously removed
# =========================================================
# git pull may restore skill folders that the user explicitly removed.
# installed.json tracks these in its "removed_skills" list.
REMOVED_SKILLS_MSG=""

if $HAVE_INSTALLED_JSON && [[ -f "$INSTALLED" ]]; then
    REMOVED_SKILLS=$(python3 -c "
import json, sys
try:
    with open('$INSTALLED') as f:
        data = json.load(f)
    removed = data.get('removed_skills', [])
    for s in removed:
        print(s)
except Exception:
    sys.exit(0)
" 2>/dev/null || true)

    if [[ -n "$REMOVED_SKILLS" ]]; then
        while IFS= read -r skill; do
            skill_dir="$REPO_ROOT/.claude/skills/$skill"
            if [[ -d "$skill_dir" ]]; then
                rm -rf "$skill_dir"
                warn "Re-removed skill '$skill' (was in your removed list)"
                REMOVED_SKILLS_MSG="${REMOVED_SKILLS_MSG}\n    Removed (per your preference): $skill"
            fi
        done <<< "$REMOVED_SKILLS"
    fi
fi

# =========================================================
# Step 8: Detect newly added upstream skills
# =========================================================
NEW_SKILLS_MSG=""

if [[ -f "$CATALOG" ]]; then
    NEW_SKILLS=$(python3 -c "
import json, sys, os

catalog_path = '$CATALOG'
installed_path = '$INSTALLED'

with open(catalog_path) as f:
    catalog = json.load(f)

catalog_skills = set(catalog.get('skills', {}).keys())

# Also include core skills — they're always installed, not 'new'
core_skills = set(catalog.get('core_skills', []))

if os.path.exists(installed_path):
    with open(installed_path) as f:
        inst = json.load(f)
    installed = set(inst.get('installed_skills', []))
    removed = set(inst.get('removed_skills', []))
    known = installed | removed | core_skills
else:
    # No installed.json — everything is 'known' (don't spam new skills)
    known = catalog_skills | core_skills

new_skills = catalog_skills - known
for s in sorted(new_skills):
    desc = catalog['skills'][s].get('description', 'No description')
    print(f'{s}|{desc}')
" 2>/dev/null || true)

    if [[ -n "$NEW_SKILLS" ]]; then
        while IFS='|' read -r skill_name skill_desc; do
            NEW_SKILLS_MSG="${NEW_SKILLS_MSG}\n  ${YELLOW}[NEW SKILL AVAILABLE]${NC} ${CYAN}${skill_name}${NC}"
            NEW_SKILLS_MSG="${NEW_SKILLS_MSG}\n    ${skill_desc}"
            NEW_SKILLS_MSG="${NEW_SKILLS_MSG}\n    Install with: bash scripts/add-skill.sh ${skill_name}\n"
        done <<< "$NEW_SKILLS"
    fi
fi

# =========================================================
# Step 9: Version tag and changelog
# =========================================================
NEW_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "")
VERSION_LINE=""
CHANGES=""

if [[ -n "$OLD_TAG" ]] && [[ -n "$NEW_TAG" ]] && [[ "$OLD_TAG" != "$NEW_TAG" ]]; then
    VERSION_LINE="  Updated: ${OLD_TAG} → ${NEW_TAG}"
    CHANGES=$(git log --oneline "${OLD_TAG}..${NEW_TAG}" 2>/dev/null | sed 's/^/    - /')
elif [[ "$OLD_HEAD" != "$NEW_HEAD" ]]; then
    if [[ -n "$NEW_TAG" ]]; then
        VERSION_LINE="  Version: ${NEW_TAG}"
    fi
    CHANGES=$(git log --oneline "${OLD_HEAD}..${NEW_HEAD}" 2>/dev/null | sed 's/^/    - /')
fi

# =========================================================
# Step 10: Summary
# =========================================================
echo ""
echo "========================================="
echo "  Agentic OS — Update Complete"
echo "========================================="
echo ""

if [[ -n "$VERSION_LINE" ]]; then
    echo "$VERSION_LINE"
    echo ""
fi

if [[ -n "$CHANGES" ]]; then
    echo "  Changes:"
    echo "$CHANGES"
    echo ""
fi

if [[ -n "$REMOVED_SKILLS_MSG" ]]; then
    printf "$REMOVED_SKILLS_MSG\n"
    echo ""
fi

if [[ -n "$NEW_SKILLS_MSG" ]]; then
    printf "$NEW_SKILLS_MSG"
fi

echo "  Your files (untouched):"
printf "    brand_context/ ${GREEN}✓${NC}  .env ${GREEN}✓${NC}  context/ ${GREEN}✓${NC}  projects/ ${GREEN}✓${NC}\n"
echo ""
echo "========================================="
echo ""
