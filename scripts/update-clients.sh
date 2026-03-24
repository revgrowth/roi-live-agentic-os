#!/usr/bin/env bash
# Sync skills and scripts from the root to all client workspaces.
# Run this after update.sh to push the latest methodology to all clients.
# Usage: bash scripts/update-clients.sh

set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
CLIENTS_DIR="${PROJECT_DIR}/clients"

if [[ ! -d "$CLIENTS_DIR" ]]; then
  echo "No clients/ directory found. Nothing to sync."
  echo "Create a client first: bash scripts/add-client.sh \"Client Name\""
  exit 0
fi

# Find client folders (any directory directly under clients/)
CLIENT_COUNT=0
SYNCED=0

for CLIENT_DIR in "${CLIENTS_DIR}"/*/; do
  [[ -d "$CLIENT_DIR" ]] || continue
  CLIENT_NAME=$(basename "$CLIENT_DIR")
  CLIENT_COUNT=$((CLIENT_COUNT + 1))

  echo "Syncing ${CLIENT_NAME}..."

  # Sync skills — copy root skills over, but preserve client-only skills
  if [[ -d "${PROJECT_DIR}/.claude/skills" ]]; then
    mkdir -p "${CLIENT_DIR}/.claude/skills"

    # Copy each root skill folder to the client (overwrite if exists)
    for root_skill in "${PROJECT_DIR}/.claude/skills"/*/; do
      [[ -d "$root_skill" ]] || continue
      skill_name=$(basename "$root_skill")
      rm -rf "${CLIENT_DIR}/.claude/skills/${skill_name}"
      cp -R "$root_skill" "${CLIENT_DIR}/.claude/skills/${skill_name}"
    done

    # Copy catalog files
    if [[ -d "${PROJECT_DIR}/.claude/skills/_catalog" ]]; then
      rm -rf "${CLIENT_DIR}/.claude/skills/_catalog"
      cp -R "${PROJECT_DIR}/.claude/skills/_catalog" "${CLIENT_DIR}/.claude/skills/_catalog"
    fi

    # Count client-only skills (exist in client but not in root)
    CLIENT_ONLY=0
    for client_skill in "${CLIENT_DIR}/.claude/skills"/*/; do
      [[ -d "$client_skill" ]] || continue
      skill_name=$(basename "$client_skill")
      [[ "$skill_name" == "_catalog" ]] && continue
      if [[ ! -d "${PROJECT_DIR}/.claude/skills/${skill_name}" ]]; then
        CLIENT_ONLY=$((CLIENT_ONLY + 1))
      fi
    done

    if [[ $CLIENT_ONLY -gt 0 ]]; then
      echo "  Skills synced (${CLIENT_ONLY} client-only skill(s) preserved)"
    else
      echo "  Skills synced"
    fi
  fi

  # Sync Claude Code settings
  if [[ -f "${PROJECT_DIR}/.claude/settings.json" ]]; then
    cp "${PROJECT_DIR}/.claude/settings.json" "${CLIENT_DIR}/.claude/settings.json"
    echo "  Settings synced"
  fi

  # Sync hooks_info (required by hooks in settings.json)
  if [[ -d "${PROJECT_DIR}/.claude/hooks_info" ]]; then
    rm -rf "${CLIENT_DIR}/.claude/hooks_info"
    cp -R "${PROJECT_DIR}/.claude/hooks_info" "${CLIENT_DIR}/.claude/hooks_info"
    echo "  Hooks synced"
  fi

  # Sync scripts
  rm -rf "${CLIENT_DIR}/scripts"
  cp -R "${PROJECT_DIR}/scripts" "${CLIENT_DIR}/scripts"
  echo "  Scripts synced"

  # Sync cron templates
  if [[ -d "${PROJECT_DIR}/cron/templates" ]]; then
    mkdir -p "${CLIENT_DIR}/cron/templates"
    cp -R "${PROJECT_DIR}/cron/templates/." "${CLIENT_DIR}/cron/templates/"
    echo "  Cron templates synced"
  fi

  SYNCED=$((SYNCED + 1))
  echo ""
done

if [[ $CLIENT_COUNT -eq 0 ]]; then
  echo "No client folders found in clients/."
  echo "Create a client first: bash scripts/add-client.sh \"Client Name\""
else
  echo "Done. Synced ${SYNCED} client(s)."
  echo ""
  echo "What was synced: skills, scripts, settings, hooks, cron templates."
  echo "What was NOT touched: brand_context, memory, learnings, projects, .env, cron jobs."
fi
