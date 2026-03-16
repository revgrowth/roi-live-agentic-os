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
RED='\033[0;31m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m'

info()  { printf "  ${CYAN}%b${NC}\n" "$1"; }
ok()    { printf "  ${GREEN}✓ %b${NC}\n" "$1"; }
warn()  { printf "  ${YELLOW}→ %b${NC}\n" "$1"; }
bullet(){ printf "    ${DIM}•${NC} %b\n" "$1"; }

# ---------- Repo root from script location ----------
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
case "$(uname -s)" in MINGW*|MSYS*|CYGWIN*) REPO_ROOT="$(cygpath -m "$REPO_ROOT")" ;; esac
PYTHON_CMD="python3"; command -v python3 &>/dev/null || PYTHON_CMD="python"
cd "$REPO_ROOT"

CATALOG="$REPO_ROOT/.claude/skills/_catalog/catalog.json"
INSTALLED="$REPO_ROOT/.claude/skills/_catalog/installed.json"
BACKUP_DIR="$REPO_ROOT/.backup"

# ---------- Protected paths (never overwritten) ----------
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
    echo ""
    printf "  ${RED}Not a git repository.${NC} Run this from the Agentic OS root.\n"
    exit 1
fi

echo ""
printf "${CYAN}${BOLD}"
cat << 'BANNER'
    ╔══════════════════════════════════════════════╗
    ║                                              ║
    ║            A G E N T I C   O S               ║
    ║                                              ║
    ║               Update Check                   ║
    ║                                              ║
    ╚══════════════════════════════════════════════╝
BANNER
printf "${NC}"
echo ""

# =========================================================
# Step 2: Read installed.json for user's skill choices
# =========================================================
if [[ ! -f "$INSTALLED" ]]; then
    warn "No installed.json found — looks like first setup."
    info "Run ${BOLD}bash scripts/install.sh${NC} first to select your skills."
    echo ""
    info "Continuing with update (your files are still protected)."
    echo ""
    HAVE_INSTALLED_JSON=false
else
    HAVE_INSTALLED_JSON=true
fi

# =========================================================
# Step 3: Save current HEAD
# =========================================================
OLD_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "")
OLD_HEAD=$(git rev-parse HEAD)
LAST_UPDATED=$(git log -1 --format="%cd" --date=format:"%d %b %Y at %H:%M" 2>/dev/null || echo "unknown")

# =========================================================
# Step 4: Stash local changes to protected paths
# =========================================================
STASHED=false

has_protected_changes() {
    for p in "${PROTECTED_PATHS[@]}"; do
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
    git stash push --include-untracked -m "agentic-os-update-$(date +%s)" -- "${PROTECTED_PATHS[@]}" 2>/dev/null && STASHED=true
fi

# =========================================================
# Step 5: Scan local skill modifications before pull
# =========================================================
SKILL_BACKUP_DIR="$BACKUP_DIR/skills-$(date +%s)"
MODIFIED_SKILLS=()
MODIFIED_SKILL_FILES=()  # parallel array: pipe-separated file list per skill
USER_CREATED_SKILLS=()

if [[ -d "$REPO_ROOT/.claude/skills" ]]; then
    for skill_dir in "$REPO_ROOT/.claude/skills"/*/; do
        [[ -d "$skill_dir" ]] || continue
        skill_name=$(basename "$skill_dir")
        [[ "$skill_name" == "_catalog" ]] && continue

        # Untracked = user-created skill
        tracked_files=$(git ls-files -- ".claude/skills/$skill_name/" 2>/dev/null || true)
        if [[ -z "$tracked_files" ]]; then
            USER_CREATED_SKILLS+=("$skill_name")
            continue
        fi

        # Check for local modifications
        modified_files=$(git diff --name-only -- ".claude/skills/$skill_name/" 2>/dev/null || true)
        if [[ -n "$modified_files" ]]; then
            mkdir -p "$SKILL_BACKUP_DIR/$skill_name"
            cp -r "$skill_dir"* "$SKILL_BACKUP_DIR/$skill_name/" 2>/dev/null || true
            MODIFIED_SKILLS+=("$skill_name")
            # Store as pipe-separated list of basenames
            file_list=$(echo "$modified_files" | while IFS= read -r f; do basename "$f"; done | tr '\n' '|' | sed 's/|$//')
            MODIFIED_SKILL_FILES+=("$file_list")
        fi
    done
fi

# =========================================================
# Step 6: Pull upstream changes
# =========================================================
info "Checking for updates..."
echo ""

PULL_OUTPUT=$(git pull origin main 2>&1) || {
    if $STASHED; then
        git stash pop --quiet 2>/dev/null || true
    fi

    if echo "$PULL_OUTPUT" | grep -qi "authentication\|403\|could not read\|repository not found\|invalid credentials"; then
        echo ""
        printf "${YELLOW}${BOLD}═══════════════════════════════════════════════${NC}\n"
        printf "${YELLOW}${BOLD}  Authentication Failed${NC}\n"
        printf "${YELLOW}${BOLD}═══════════════════════════════════════════════${NC}\n"
        echo ""
        warn "Your access token may have been rotated."
        echo ""
        info "To fix this:"
        echo ""
        echo "  1. Get the latest token from:"
        printf "     ${CYAN}https://www.skool.com/scrapes/classroom/d1cfafed?md=552b0ba753df4c738843913fb3eb8312${NC}\n"
        echo ""
        echo "  2. Update your remote URL:"
        printf "     ${BOLD}git remote set-url origin https://<NEW-TOKEN>@github.com/simonc602/agentic-os.git${NC}\n"
        echo ""
        echo "  3. Run this script again:"
        printf "     ${BOLD}bash scripts/update.sh${NC}\n"
        echo ""
        info "Nothing was changed — your local files are untouched."
    else
        echo "$PULL_OUTPUT"
        echo ""
        echo "  Pull failed. Your files are safe — nothing was changed."
    fi
    exit 1
}

# =========================================================
# Determine if anything changed
# =========================================================
HAS_UPSTREAM_CHANGES=true
if echo "$PULL_OUTPUT" | grep -q "Already up to date"; then
    HAS_UPSTREAM_CHANGES=false
    if $STASHED; then
        git stash pop --quiet 2>/dev/null || true
    fi
fi

NEW_HEAD=$(git rev-parse HEAD)
COMMIT_COUNT=0
if $HAS_UPSTREAM_CHANGES; then
    COMMIT_COUNT=$(git log --oneline "${OLD_HEAD}..${NEW_HEAD}" 2>/dev/null | wc -l | tr -d ' ')
fi

# =========================================================
# STEP 1 OF 4: Updates from the Main Repo
# =========================================================
echo ""
printf "${CYAN}${BOLD}═══════════════════════════════════════════════${NC}\n"
printf "${CYAN}${BOLD}  Step 1: Updates from the Main Repo${NC}\n"
printf "${CYAN}${BOLD}═══════════════════════════════════════════════${NC}\n"
echo ""

if ! $HAS_UPSTREAM_CHANGES; then
    ok "No new updates — you're on the latest version."
    info "Last updated: ${BOLD}${LAST_UPDATED}${NC}"
    echo ""
    info "Scripts:              ${GREEN}no changes${NC}"
    info "System files:         ${GREEN}no changes${NC}  ${DIM}(CLAUDE.md, README.md, etc.)${NC}"
    info "Skill catalog:        ${GREEN}no changes${NC}"
    info "Skills:               ${GREEN}no changes${NC}"
    echo ""
else
    ok "Pulled ${COMMIT_COUNT} new commit(s) from main."
    echo ""

    CHANGED_FILES=$(git diff --name-only "${OLD_HEAD}..${NEW_HEAD}" 2>/dev/null || true)

    # Categorise into buckets
    CHANGED_SCRIPTS=""
    CHANGED_SYSTEM=""
    CHANGED_CATALOG=""
    CHANGED_SKILL_FILES=""
    CHANGED_OTHER=""
    SCRIPT_COUNT=0; SYSTEM_COUNT=0; CATALOG_COUNT=0; SKILL_COUNT=0; OTHER_COUNT=0

    if [[ -n "$CHANGED_FILES" ]]; then
        while IFS= read -r file; do
            case "$file" in
                scripts/*)
                    CHANGED_SCRIPTS="${CHANGED_SCRIPTS}${file}\n"
                    SCRIPT_COUNT=$((SCRIPT_COUNT + 1))
                    ;;
                CLAUDE.md|PRD.md|README.md|.gitignore|.gitattributes)
                    CHANGED_SYSTEM="${CHANGED_SYSTEM}${file}\n"
                    SYSTEM_COUNT=$((SYSTEM_COUNT + 1))
                    ;;
                .claude/skills/_catalog/*)
                    CHANGED_CATALOG="${CHANGED_CATALOG}${file}\n"
                    CATALOG_COUNT=$((CATALOG_COUNT + 1))
                    ;;
                .claude/skills/*)
                    CHANGED_SKILL_FILES="${CHANGED_SKILL_FILES}${file}\n"
                    SKILL_COUNT=$((SKILL_COUNT + 1))
                    ;;
                context/*|brand_context/*|projects/*|.env*)
                    ;; # Protected — skip
                *)
                    CHANGED_OTHER="${CHANGED_OTHER}${file}\n"
                    OTHER_COUNT=$((OTHER_COUNT + 1))
                    ;;
            esac
        done <<< "$CHANGED_FILES"
    fi

    # Always show every category — with "no changes" when empty
    if [[ $SCRIPT_COUNT -gt 0 ]]; then
        printf "  ${BOLD}Scripts${NC} ${DIM}(%d updated)${NC}\n" "$SCRIPT_COUNT"
        printf "$CHANGED_SCRIPTS" | while IFS= read -r f; do [[ -n "$f" ]] && bullet "$f"; done
    else
        info "Scripts:              ${GREEN}no changes${NC}"
    fi

    if [[ $SYSTEM_COUNT -gt 0 ]]; then
        printf "  ${BOLD}System files${NC} ${DIM}(%d updated)${NC}\n" "$SYSTEM_COUNT"
        printf "$CHANGED_SYSTEM" | while IFS= read -r f; do [[ -n "$f" ]] && bullet "$f"; done
    else
        info "System files:         ${GREEN}no changes${NC}  ${DIM}(CLAUDE.md, README.md, etc.)${NC}"
    fi

    if [[ $CATALOG_COUNT -gt 0 ]]; then
        printf "  ${BOLD}Skill catalog${NC} ${DIM}(%d updated)${NC}\n" "$CATALOG_COUNT"
        printf "$CHANGED_CATALOG" | while IFS= read -r f; do [[ -n "$f" ]] && bullet "$f"; done
    else
        info "Skill catalog:        ${GREEN}no changes${NC}"
    fi

    if [[ $SKILL_COUNT -gt 0 ]]; then
        printf "  ${BOLD}Skills${NC} ${DIM}(%d file(s) updated)${NC}\n" "$SKILL_COUNT"
        printf "$CHANGED_SKILL_FILES" | while IFS= read -r f; do [[ -n "$f" ]] && bullet "$f"; done
    else
        info "Skills:               ${GREEN}no changes${NC}"
    fi

    if [[ $OTHER_COUNT -gt 0 ]]; then
        printf "  ${BOLD}Other${NC} ${DIM}(%d updated)${NC}\n" "$OTHER_COUNT"
        printf "$CHANGED_OTHER" | while IFS= read -r f; do [[ -n "$f" ]] && bullet "$f"; done
    fi

    echo ""

    # Offer to show full diff for system files
    SYS_FILES_FOR_DIFF=""
    [[ -n "$CHANGED_SCRIPTS" ]] && SYS_FILES_FOR_DIFF="${SYS_FILES_FOR_DIFF}${CHANGED_SCRIPTS}"
    [[ -n "$CHANGED_SYSTEM" ]] && SYS_FILES_FOR_DIFF="${SYS_FILES_FOR_DIFF}${CHANGED_SYSTEM}"
    [[ -n "$CHANGED_CATALOG" ]] && SYS_FILES_FOR_DIFF="${SYS_FILES_FOR_DIFF}${CHANGED_CATALOG}"
    [[ -n "$CHANGED_OTHER" ]] && SYS_FILES_FOR_DIFF="${SYS_FILES_FOR_DIFF}${CHANGED_OTHER}"

    if [[ -n "$SYS_FILES_FOR_DIFF" ]]; then
        printf "  ${BOLD}Want to see the full diff?${NC} [y/n] "
        read -r show_diff
        if [[ "$show_diff" =~ ^[yY]$ ]]; then
            echo ""
            printf "$SYS_FILES_FOR_DIFF" | while IFS= read -r file; do
                file=$(echo "$file" | sed 's/^[[:space:]]*//')
                [[ -z "$file" ]] && continue
                printf "\n  ${CYAN}${BOLD}── %s ──${NC}\n\n" "$file"
                git diff "${OLD_HEAD}..${NEW_HEAD}" -- "$file" 2>/dev/null | while IFS= read -r line; do
                    case "$line" in
                        +*)   printf "  ${GREEN}%s${NC}\n" "$line" ;;
                        -*)   printf "  ${YELLOW}%s${NC}\n" "$line" ;;
                        @*)   printf "  ${CYAN}%s${NC}\n" "$line" ;;
                        diff*|index*|---*|+++*) ;; # skip noise
                        *)    printf "  %s\n" "$line" ;;
                    esac
                done
            done
            echo ""
        fi
    fi
fi

# =========================================================
# STEP 2 OF 4: Your Local Skill Changes
# =========================================================
echo ""
printf "${CYAN}${BOLD}═══════════════════════════════════════════════${NC}\n"
printf "${CYAN}${BOLD}  Step 2: Your Local Changes${NC}\n"
printf "${CYAN}${BOLD}═══════════════════════════════════════════════${NC}\n"
echo ""

SKILL_REVIEW_MSG=""

if [[ ${#MODIFIED_SKILLS[@]} -eq 0 ]] && [[ ${#USER_CREATED_SKILLS[@]} -eq 0 ]]; then
    ok "No local skill modifications detected."
    info "All your installed skills match the upstream versions."
    echo ""
elif [[ ${#MODIFIED_SKILLS[@]} -eq 0 ]]; then
    ok "No modifications to upstream skills."
    echo ""
fi

if [[ ${#USER_CREATED_SKILLS[@]} -gt 0 ]]; then
    ok "${#USER_CREATED_SKILLS[@]} custom skill(s) you've created ${DIM}(untouched by updates):${NC}"
    for uc_skill in "${USER_CREATED_SKILLS[@]}"; do
        printf "    ${GREEN}✓${NC} %s\n" "$uc_skill"
    done
    echo ""
fi

if [[ ${#MODIFIED_SKILLS[@]} -gt 0 ]]; then
    info "You've modified ${#MODIFIED_SKILLS[@]} skill(s) locally:"
    for i in "${!MODIFIED_SKILLS[@]}"; do
        IFS='|' read -ra files <<< "${MODIFIED_SKILL_FILES[$i]}"
        printf "    ${YELLOW}~${NC} ${BOLD}%s${NC} ${DIM}(%s)${NC}\n" "${MODIFIED_SKILLS[$i]}" "${files[*]}"
    done
    echo ""

    if $HAS_UPSTREAM_CHANGES; then
        info "We'll check if any of these also changed upstream and walk you through"
        info "each file so you can pick what to keep."
        echo ""
    else
        ok "No upstream changes to these skills — your local versions are kept as-is."
        echo ""
    fi

    for skill_name in "${MODIFIED_SKILLS[@]}"; do
        skill_dir="$REPO_ROOT/.claude/skills/$skill_name"
        backup_skill_dir="$SKILL_BACKUP_DIR/$skill_name"

        # Skill removed upstream
        if [[ ! -d "$skill_dir" ]]; then
            warn "$skill_name was removed upstream, but you had local changes."
            mkdir -p "$skill_dir"
            cp -r "$backup_skill_dir"/* "$skill_dir/" 2>/dev/null || true
            ok "Kept your version of $skill_name"
            SKILL_REVIEW_MSG="${SKILL_REVIEW_MSG}\n    ${YELLOW}~${NC} $skill_name: kept (removed upstream)"
            continue
        fi

        echo "  ─────────────────────────────────────────"
        printf "  ${BOLD}%s${NC}\n" "$skill_name"
        echo "  ─────────────────────────────────────────"

        # Find file-level differences
        changed_files=$(diff -rq "$backup_skill_dir" "$skill_dir" 2>/dev/null | grep "^Files " | sed 's/^Files //;s/ and / → /;s/ differ$//' || true)
        new_upstream=$(diff -rq "$backup_skill_dir" "$skill_dir" 2>/dev/null | grep "^Only in $skill_dir" | sed "s|^Only in $skill_dir[/]*: ||" || true)
        removed_upstream=$(diff -rq "$backup_skill_dir" "$skill_dir" 2>/dev/null | grep "^Only in $backup_skill_dir" | sed "s|^Only in $backup_skill_dir[/]*: ||" || true)

        if [[ -z "$changed_files" ]] && [[ -z "$new_upstream" ]] && [[ -z "$removed_upstream" ]]; then
            echo ""
            info "No upstream changes to this skill — keeping your version."
            cp -r "$backup_skill_dir"/* "$skill_dir/" 2>/dev/null || true
            SKILL_REVIEW_MSG="${SKILL_REVIEW_MSG}\n    ${GREEN}✓${NC} $skill_name: kept yours (no upstream changes)"
            echo ""
            continue
        fi

        # Track decisions
        file_decisions=""
        accepted_count=0
        kept_count=0

        # --- Per-file review for changed files ---
        if [[ -n "$changed_files" ]]; then
            while IFS= read -r pair; do
                backup_file=$(echo "$pair" | sed 's/ → .*//')
                upstream_file=$(echo "$pair" | sed 's/.* → //')
                rel_name=$(echo "$upstream_file" | sed "s|$skill_dir/||;s|$skill_dir||")
                [[ -z "$rel_name" ]] && rel_name=$(basename "$upstream_file")

                echo ""
                printf "  ${BOLD}File: %s${NC}\n" "$rel_name"
                echo "  ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄"
                echo ""

                file_diff=$(diff -u "$backup_file" "$upstream_file" 2>/dev/null || true)
                if [[ -n "$file_diff" ]]; then
                    echo "$file_diff" | while IFS= read -r line; do
                        case "$line" in
                            ---*) printf "  ${YELLOW}%s${NC}\n" "$line" ;;
                            +++*) printf "  ${GREEN}%s${NC}\n" "$line" ;;
                            +*)   printf "  ${GREEN}%s${NC}\n" "$line" ;;
                            -*)   printf "  ${YELLOW}%s${NC}\n" "$line" ;;
                            @*)   printf "  ${CYAN}%s${NC}\n" "$line" ;;
                            *)    printf "  %s\n" "$line" ;;
                        esac
                    done
                fi
                echo ""

                printf "  ${BOLD}Accept this change?${NC} [y/n/a/k]\n"
                printf "  ${DIM}y = accept upstream  n = keep yours  a = accept ALL remaining  k = keep ALL remaining${NC}\n"
                printf "  > "
                while true; do
                    read -r choice
                    case "$choice" in
                        [yY])
                            ok "Accepted upstream: $rel_name"
                            file_decisions="${file_decisions}\n    ${GREEN}✓${NC} $rel_name (accepted upstream)"
                            accepted_count=$((accepted_count + 1))
                            break ;;
                        [nN])
                            cp "$backup_file" "$upstream_file" 2>/dev/null || true
                            ok "Kept yours: $rel_name"
                            file_decisions="${file_decisions}\n    ${YELLOW}○${NC} $rel_name (kept yours)"
                            kept_count=$((kept_count + 1))
                            break ;;
                        [aA])
                            ok "Accepted upstream: $rel_name"
                            file_decisions="${file_decisions}\n    ${GREEN}✓${NC} $rel_name (accepted upstream)"
                            accepted_count=$((accepted_count + 1))
                            ACCEPT_ALL_REMAINING=true
                            break ;;
                        [kK])
                            cp "$backup_file" "$upstream_file" 2>/dev/null || true
                            ok "Kept yours: $rel_name"
                            file_decisions="${file_decisions}\n    ${YELLOW}○${NC} $rel_name (kept yours)"
                            kept_count=$((kept_count + 1))
                            KEEP_ALL_REMAINING=true
                            break ;;
                        *)
                            printf "  Please enter y, n, a, or k: " ;;
                    esac
                done

                if [[ "${ACCEPT_ALL_REMAINING:-false}" == "true" ]] || [[ "${KEEP_ALL_REMAINING:-false}" == "true" ]]; then
                    break
                fi
            done <<< "$changed_files"

            # Process remaining files after bulk decision
            if [[ "${ACCEPT_ALL_REMAINING:-false}" == "true" ]]; then
                remaining=$(echo "$changed_files" | tail -n +$((accepted_count + kept_count + 1)))
                if [[ -n "$remaining" ]]; then
                    while IFS= read -r pair; do
                        upstream_file=$(echo "$pair" | sed 's/.* → //')
                        rel_name=$(echo "$upstream_file" | sed "s|$skill_dir/||;s|$skill_dir||")
                        [[ -z "$rel_name" ]] && rel_name=$(basename "$upstream_file")
                        ok "Accepted upstream: $rel_name"
                        file_decisions="${file_decisions}\n    ${GREEN}✓${NC} $rel_name (accepted upstream)"
                        accepted_count=$((accepted_count + 1))
                    done <<< "$remaining"
                fi
            fi
            if [[ "${KEEP_ALL_REMAINING:-false}" == "true" ]]; then
                remaining=$(echo "$changed_files" | tail -n +$((accepted_count + kept_count + 1)))
                if [[ -n "$remaining" ]]; then
                    while IFS= read -r pair; do
                        backup_file=$(echo "$pair" | sed 's/ → .*//')
                        upstream_file=$(echo "$pair" | sed 's/.* → //')
                        rel_name=$(echo "$upstream_file" | sed "s|$skill_dir/||;s|$skill_dir||")
                        [[ -z "$rel_name" ]] && rel_name=$(basename "$upstream_file")
                        cp "$backup_file" "$upstream_file" 2>/dev/null || true
                        ok "Kept yours: $rel_name"
                        file_decisions="${file_decisions}\n    ${YELLOW}○${NC} $rel_name (kept yours)"
                        kept_count=$((kept_count + 1))
                    done <<< "$remaining"
                fi
            fi
            ACCEPT_ALL_REMAINING=false
            KEEP_ALL_REMAINING=false
        fi

        # New files added upstream
        if [[ -n "$new_upstream" ]]; then
            while IFS= read -r new_file; do
                [[ -z "$new_file" ]] && continue
                printf "\n  ${GREEN}+${NC} %s ${DIM}(new from upstream)${NC}\n" "$new_file"
                file_decisions="${file_decisions}\n    ${GREEN}+${NC} $new_file (new from upstream)"
                accepted_count=$((accepted_count + 1))
            done <<< "$new_upstream"
        fi

        # Files removed upstream
        if [[ -n "$removed_upstream" ]]; then
            while IFS= read -r rm_file; do
                [[ -z "$rm_file" ]] && continue
                printf "\n  ${YELLOW}−${NC} %s ${DIM}(removed upstream — kept your version)${NC}\n" "$rm_file"
                cp "$backup_skill_dir/$rm_file" "$skill_dir/$rm_file" 2>/dev/null || true
                file_decisions="${file_decisions}\n    ${YELLOW}○${NC} $rm_file (kept yours, removed upstream)"
                kept_count=$((kept_count + 1))
            done <<< "$removed_upstream"
        fi

        echo ""
        SKILL_REVIEW_MSG="${SKILL_REVIEW_MSG}\n    ${BOLD}$skill_name${NC}: $accepted_count accepted, $kept_count kept"
        printf "$file_decisions\n"
    done
    echo ""
fi

# =========================================================
# Restore stashed protected files
# =========================================================
if $STASHED; then
    if git stash pop --quiet 2>/dev/null; then
        : # silently restored
    else
        warn "Merge conflicts detected — backing up your versions..."
        mkdir -p "$BACKUP_DIR"

        CONFLICTED=$(git diff --name-only --diff-filter=U 2>/dev/null || true)
        if [[ -n "$CONFLICTED" ]]; then
            while IFS= read -r file; do
                backup_path="$BACKUP_DIR/$file"
                mkdir -p "$(dirname "$backup_path")"
                cp "$REPO_ROOT/$file" "$backup_path.conflicted" 2>/dev/null || true
                git checkout --theirs -- "$file" 2>/dev/null || true
                git add "$file" 2>/dev/null || true
            done <<< "$CONFLICTED"
        fi
        git stash drop 2>/dev/null || true
    fi
fi

# =========================================================
# Re-remove skills the user previously removed
# =========================================================
REMOVED_SKILLS_MSG=""

if $HAVE_INSTALLED_JSON && [[ -f "$INSTALLED" ]]; then
    REMOVED_SKILLS=$($PYTHON_CMD -c "
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
                REMOVED_SKILLS_MSG="${REMOVED_SKILLS_MSG}\n    ${DIM}✗ $skill (re-removed per your preference)${NC}"
            fi
        done <<< "$REMOVED_SKILLS"
    fi
fi

# =========================================================
# STEP 3 OF 4: Skill Catalog
# =========================================================
echo ""
printf "${CYAN}${BOLD}═══════════════════════════════════════════════${NC}\n"
printf "${CYAN}${BOLD}  Step 3: Skill Catalog${NC}\n"
printf "${CYAN}${BOLD}═══════════════════════════════════════════════${NC}\n"
echo ""

INSTALLED_NEW_SKILLS_MSG=""

if [[ -f "$CATALOG" ]]; then
    # Python outputs two sections separated by "---":
    #   Section 1: NEW skills (never seen before) — name|category|desc|services|deps
    #   Section 2: AVAILABLE skills (previously removed, not installed) — same format
    CATALOG_OUTPUT=$($PYTHON_CMD -c "
import json, sys, os

catalog_path = '$CATALOG'
installed_path = '$INSTALLED'

with open(catalog_path) as f:
    catalog = json.load(f)

catalog_skills = catalog.get('skills', {})
core_skills = set(catalog.get('core_skills', []))

if os.path.exists(installed_path):
    with open(installed_path) as f:
        inst = json.load(f)
    installed = set(inst.get('installed_skills', []))
    removed = set(inst.get('removed_skills', []))
else:
    installed = set()
    removed = set()

known = installed | removed | core_skills
new_skills = set(catalog_skills.keys()) - known
available_skills = removed  # previously removed = available but not installed

order = {'utility': 1, 'strategy': 2, 'execution': 3, 'visual': 4, 'operations': 5}

def format_skill(name):
    info = catalog_skills[name]
    services = ','.join(info.get('requires_services', []))
    deps = ','.join(info.get('dependencies', []))
    return f'{name}|{info[\"category\"]}|{info[\"description\"]}|{services}|{deps}'

# New skills
for s in sorted(new_skills, key=lambda n: (order.get(catalog_skills[n].get('category',''), 99), n)):
    print(format_skill(s))
print('---')
# Available (previously removed)
for s in sorted(available_skills, key=lambda n: (order.get(catalog_skills.get(n,{}).get('category',''), 99), n)):
    if s in catalog_skills:
        print(format_skill(s))
" 2>/dev/null || true)

    # Split into new and available
    NEW_SKILLS=$(echo "$CATALOG_OUTPUT" | sed '/^---$/,$d')
    AVAILABLE_SKILLS=$(echo "$CATALOG_OUTPUT" | sed '1,/^---$/d')

    # --- New skills section ---
    if [[ -n "$NEW_SKILLS" ]] && [[ "$NEW_SKILLS" != "" ]]; then
        ok "New skills added since your last update:"
        echo ""

        declare -a NS_NAMES=()
        declare -a NS_CATEGORIES=()
        declare -a NS_DESCRIPTIONS=()
        declare -a NS_SERVICES=()
        declare -a NS_DEPS=()
        CURRENT_CATEGORY=""

        while IFS='|' read -r name category description services deps; do
            [[ -z "$name" ]] && continue
            NS_NAMES+=("$name")
            NS_CATEGORIES+=("$category")
            NS_DESCRIPTIONS+=("$description")
            NS_SERVICES+=("$services")
            NS_DEPS+=("$deps")
        done <<< "$NEW_SKILLS"

        for i in "${!NS_NAMES[@]}"; do
            NUM=$((i + 1))
            cat="${NS_CATEGORIES[$i]}"

            if [[ "$cat" != "$CURRENT_CATEGORY" ]]; then
                first="$(echo "${cat:0:1}" | tr '[:lower:]' '[:upper:]')"
                printf "\n    ${BOLD}%s${NC}\n" "${first}${cat:1}"
                CURRENT_CATEGORY="$cat"
            fi

            svc_note=""
            [[ -n "${NS_SERVICES[$i]}" ]] && svc_note=" ${DIM}(needs ${NS_SERVICES[$i]})${NC}"
            dep_note=""
            [[ -n "${NS_DEPS[$i]}" ]] && dep_note=" ${DIM}(auto-adds: ${NS_DEPS[$i]})${NC}"

            printf "     ${BOLD}[%2d]${NC} %-26s ${DIM}— %s${NC}%b%b\n" \
                "$NUM" "${NS_NAMES[$i]}" "${NS_DESCRIPTIONS[$i]}" "$svc_note" "$dep_note"
        done
        echo ""

        printf "  Enter numbers to install (e.g. ${BOLD}1 3${NC}), ${BOLD}all${NC}, or press Enter to skip: "
        read -r NS_INPUT

        if [[ -n "$NS_INPUT" ]]; then
            SELECTED_NS=()
            if [[ "${NS_INPUT,,}" == "all" ]]; then
                SELECTED_NS=("${NS_NAMES[@]}")
            else
                for token in $NS_INPUT; do
                    if [[ "$token" =~ ^[0-9]+$ ]] && [[ "$token" -ge 1 ]] && [[ "$token" -le "${#NS_NAMES[@]}" ]]; then
                        SELECTED_NS+=("${NS_NAMES[$((token - 1))]}")
                    else
                        warn "Ignoring invalid selection: $token"
                    fi
                done
            fi

            if [[ ${#SELECTED_NS[@]} -gt 0 ]]; then
                echo ""
                for ns in "${SELECTED_NS[@]}"; do
                    bash "$REPO_ROOT/scripts/add-skill.sh" "$ns" 2>&1 | sed 's/^/    /'
                    INSTALLED_NEW_SKILLS_MSG="${INSTALLED_NEW_SKILLS_MSG}\n    ${GREEN}✓${NC} $ns"
                done
                echo ""
            fi
        else
            echo ""
        fi
    else
        ok "No new skills since your last update."
        echo ""
    fi

    # --- Available (not installed) skills section ---
    if [[ -n "$AVAILABLE_SKILLS" ]] && [[ "$AVAILABLE_SKILLS" != "" ]]; then
        AVAIL_COUNT=$(echo "$AVAILABLE_SKILLS" | grep -c '|' || true)
        info "You also have ${BOLD}${AVAIL_COUNT} skill(s)${NC} ${CYAN}available that you haven't installed:${NC}"
        echo ""

        CURRENT_CATEGORY=""
        while IFS='|' read -r name category description services deps; do
            [[ -z "$name" ]] && continue
            cat="$category"

            if [[ "$cat" != "$CURRENT_CATEGORY" ]]; then
                first="$(echo "${cat:0:1}" | tr '[:lower:]' '[:upper:]')"
                printf "    ${BOLD}%s${NC}\n" "${first}${cat:1}"
                CURRENT_CATEGORY="$cat"
            fi

            svc_note=""
            [[ -n "$services" ]] && svc_note=" ${DIM}(needs ${services})${NC}"

            printf "      ${DIM}•${NC} %-26s ${DIM}— %s${NC}%b\n" "$name" "$description" "$svc_note"
        done <<< "$AVAILABLE_SKILLS"
        echo ""
        info "Install with: ${BOLD}bash scripts/add-skill.sh <name>${NC}"
        echo ""
    fi
else
    warn "Skill catalog not found — skipping skill check."
    echo ""
fi

# =========================================================
# STEP 4 OF 4: Summary
# =========================================================
echo ""
printf "${CYAN}${BOLD}═══════════════════════════════════════════════${NC}\n"
printf "${CYAN}${BOLD}  Step 4: Summary${NC}\n"
printf "${CYAN}${BOLD}═══════════════════════════════════════════════${NC}\n"
echo ""

# Main repo status
NEW_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "")
if $HAS_UPSTREAM_CHANGES; then
    if [[ -n "$OLD_TAG" ]] && [[ -n "$NEW_TAG" ]] && [[ "$OLD_TAG" != "$NEW_TAG" ]]; then
        ok "Main repo: updated ${OLD_TAG} → ${NEW_TAG}"
    else
        ok "Main repo: pulled ${COMMIT_COUNT} new commit(s)"
    fi

    # Commit log
    CHANGES=$(git log --oneline "${OLD_HEAD}..${NEW_HEAD}" 2>/dev/null | sed 's/^/      /')
    if [[ -n "$CHANGES" ]]; then
        echo "$CHANGES"
    fi
else
    ok "Main repo: already up to date"
fi

# Skill review results
if [[ -n "$SKILL_REVIEW_MSG" ]]; then
    printf "\n  ${BOLD}Skill review:${NC}"
    printf "$SKILL_REVIEW_MSG\n"
    info "Backups saved to ${BOLD}.backup/${NC} if you change your mind."
elif [[ ${#MODIFIED_SKILLS[@]} -gt 0 ]]; then
    printf "\n"
    ok "Local skill changes: kept as-is (no upstream conflicts)"
fi

# Newly installed skills
if [[ -n "$INSTALLED_NEW_SKILLS_MSG" ]]; then
    printf "\n  ${BOLD}Newly installed:${NC}"
    printf "$INSTALLED_NEW_SKILLS_MSG\n"
fi

# Re-removed skills
if [[ -n "$REMOVED_SKILLS_MSG" ]]; then
    printf "$REMOVED_SKILLS_MSG\n"
fi

# Protected files
echo ""
ok "Your data is safe:"
printf "    brand_context/  ${GREEN}✓${NC}   .env  ${GREEN}✓${NC}   context/  ${GREEN}✓${NC}   projects/  ${GREEN}✓${NC}\n"
echo ""
printf "${CYAN}${BOLD}═══════════════════════════════════════════════${NC}\n"
echo ""
