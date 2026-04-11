#!/usr/bin/env bash
set -euo pipefail

echo "uninstall-crons is deprecated. Stopping the managed cron daemon instead."
bash "$(cd "$(dirname "$0")" && pwd)/stop-crons.sh" "$@"
