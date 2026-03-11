#!/usr/bin/env bash
#
# Agentic OS — Cron Job Installer
#
# Reads job files from cron/jobs/, builds crontab entries, and installs them.
# Usage:
#   bash cron/install.sh              # Install/update all enabled jobs
#   bash cron/install.sh --uninstall  # Remove all Agentic OS cron entries
#   bash cron/install.sh --dry-run    # Show what would be installed without doing it
#   bash cron/install.sh --list       # List currently installed Agentic OS jobs

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
JOBS_DIR="$SCRIPT_DIR/jobs"
LOGS_DIR="$SCRIPT_DIR/logs"
MARKER_BEGIN="# BEGIN agentic-os-cron"
MARKER_END="# END agentic-os-cron"

# Find claude CLI
CLAUDE_BIN="$(which claude 2>/dev/null || echo "")"
if [[ -z "$CLAUDE_BIN" ]]; then
    echo "Error: claude CLI not found in PATH"
    echo "Install it from: https://claude.ai/code"
    exit 1
fi

# Ensure logs directory exists
mkdir -p "$LOGS_DIR"

# --- Parse YAML frontmatter from a job file ---
parse_frontmatter() {
    local file="$1"
    local key="$2"
    local default="${3:-}"

    # Extract value between --- markers
    local value
    value=$(sed -n '/^---$/,/^---$/p' "$file" | grep "^${key}:" | head -1 | sed "s/^${key}:[[:space:]]*//" | sed 's/^"//;s/"$//' | sed "s/^'//;s/'$//")

    if [[ -z "$value" ]]; then
        echo "$default"
    else
        echo "$value"
    fi
}

# --- Extract prompt body (everything after second ---) ---
extract_prompt() {
    local file="$1"
    sed '1,/^---$/d; 1,/^---$/d' "$file"
}

# --- Build crontab entries from job files ---
build_entries() {
    local entries=""

    if [[ ! -d "$JOBS_DIR" ]] || [[ -z "$(ls -A "$JOBS_DIR"/*.md 2>/dev/null)" ]]; then
        echo ""
        return
    fi

    for job_file in "$JOBS_DIR"/*.md; do
        local name schedule description model permission_mode max_budget allowed_tools enabled

        name=$(parse_frontmatter "$job_file" "name" "")
        schedule=$(parse_frontmatter "$job_file" "schedule" "")
        description=$(parse_frontmatter "$job_file" "description" "No description")
        model=$(parse_frontmatter "$job_file" "model" "sonnet")
        permission_mode=$(parse_frontmatter "$job_file" "permission_mode" "auto")
        max_budget=$(parse_frontmatter "$job_file" "max_budget_usd" "0.50")
        allowed_tools=$(parse_frontmatter "$job_file" "allowed_tools" "")
        enabled=$(parse_frontmatter "$job_file" "enabled" "true")

        # Skip disabled jobs
        if [[ "$enabled" == "false" ]]; then
            continue
        fi

        # Validate required fields
        if [[ -z "$name" ]] || [[ -z "$schedule" ]]; then
            echo "Warning: Skipping $job_file — missing name or schedule" >&2
            continue
        fi

        # Build the claude command
        local cmd="cd ${PROJECT_DIR} && ${CLAUDE_BIN} -p \"\$(sed '1,/^---\$/d; 1,/^---\$/d' cron/jobs/${name}.md)\" --model ${model} --permission-mode ${permission_mode} --max-budget-usd ${max_budget} --no-session-persistence"

        # Add allowed tools if specified
        if [[ -n "$allowed_tools" ]]; then
            cmd="${cmd} --allowed-tools \"${allowed_tools}\""
        fi

        # Add logging
        cmd="${cmd} >> cron/logs/${name}.log 2>&1"

        # Add comment and entry
        entries="${entries}# [agentic-os] ${name}: ${description}\n"
        entries="${entries}${schedule} ${cmd}\n"
    done

    echo -e "$entries"
}

# --- Remove existing Agentic OS entries from crontab ---
remove_entries() {
    local current
    current=$(crontab -l 2>/dev/null || echo "")

    if [[ -z "$current" ]]; then
        return
    fi

    # Remove everything between markers (inclusive)
    echo "$current" | sed "/${MARKER_BEGIN}/,/${MARKER_END}/d" | crontab -
}

# --- Main ---
case "${1:-install}" in
    --uninstall)
        echo "Removing Agentic OS cron entries..."
        remove_entries
        echo "Done. Your other crontab entries are untouched."
        ;;

    --dry-run)
        echo "=== Dry Run — would install these entries ==="
        echo ""
        echo "$MARKER_BEGIN"
        build_entries
        echo "$MARKER_END"
        ;;

    --list)
        echo "=== Currently installed Agentic OS cron jobs ==="
        current=$(crontab -l 2>/dev/null || echo "")
        if echo "$current" | grep -q "$MARKER_BEGIN"; then
            echo "$current" | sed -n "/${MARKER_BEGIN}/,/${MARKER_END}/p"
        else
            echo "No Agentic OS jobs installed."
        fi
        ;;

    install|"")
        entries=$(build_entries)

        if [[ -z "$entries" ]]; then
            echo "No enabled job files found in $JOBS_DIR/"
            echo "Create a job file first, then run install again."
            exit 0
        fi

        echo "Installing Agentic OS cron entries..."

        # Remove old entries first
        remove_entries

        # Get current crontab and append new entries
        current=$(crontab -l 2>/dev/null || echo "")

        {
            if [[ -n "$current" ]]; then
                echo "$current"
            fi
            echo ""
            echo "$MARKER_BEGIN"
            echo -e "$entries"
            echo "$MARKER_END"
        } | crontab -

        echo "Done. Installed jobs:"
        echo ""

        # Show summary
        for job_file in "$JOBS_DIR"/*.md; do
            local name schedule description enabled
            name=$(parse_frontmatter "$job_file" "name" "")
            schedule=$(parse_frontmatter "$job_file" "schedule" "")
            description=$(parse_frontmatter "$job_file" "description" "")
            enabled=$(parse_frontmatter "$job_file" "enabled" "true")

            if [[ "$enabled" != "false" ]] && [[ -n "$name" ]]; then
                echo "  $name    $schedule    $description"
            fi
        done

        echo ""
        echo "Logs: $LOGS_DIR/"
        echo "Uninstall: bash cron/install.sh --uninstall"
        ;;

    *)
        echo "Usage: bash cron/install.sh [--uninstall|--dry-run|--list]"
        exit 1
        ;;
esac
