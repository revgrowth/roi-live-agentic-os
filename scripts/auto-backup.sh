#!/bin/bash
# Silent nightly backup to Github
# Commits any pending changes in the Agentic OS vault

REPO_DIR="$HOME/agentic/agentic-os"
LOG_FILE="$REPO_DIR/scripts/auto-backup.log"
TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ)

cd "$REPO_DIR" || exit 1

if [[ -z $(git status --porcelain) ]]; then
    echo "[$TIMESTAMP] No changes to commit" >> "$LOG_FILE"
    exit 0
fi

git add -A

if git commit -m "Auto-backup $TIMESTAMP" >> "$LOG_FILE" 2>&1; then
    echo "[$TIMESTAMP] Commit succeeded" >> "$LOG_FILE"
else
    echo "[$TIMESTAMP] Commit failed" >> "$LOG_FILE"
    exit 1
fi

if git push origin main >> "$LOG_FILE" 2>&1; then
    echo "[$TIMESTAMP] Push succeeded" >> "$LOG_FILE"
else
    echo "[$TIMESTAMP] Push failed - check log" >> "$LOG_FILE"
    exit 1
fi
