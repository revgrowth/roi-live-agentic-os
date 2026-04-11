#!/usr/bin/env bash
set -euo pipefail

echo "install-crons is deprecated. Starting the managed cron daemon instead."
bash "$(cd "$(dirname "$0")" && pwd)/start-crons.sh" "$@"
