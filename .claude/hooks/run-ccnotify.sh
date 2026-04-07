#!/usr/bin/env bash
set -euo pipefail

HOOK_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$(dirname "$HOOK_DIR")")"

source "$PROJECT_DIR/scripts/lib/python.sh"

if ! resolve_python_cmd; then
    echo "Agentic OS hook error: Python 3 is required for ccnotify.py" >&2
    exit 1
fi

"${PYTHON_CMD[@]}" "$PROJECT_DIR/.claude/hooks_info/ccnotify.py" "$@"
