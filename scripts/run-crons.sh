#!/usr/bin/env bash
set -euo pipefail

echo "run-crons is deprecated. Automatic scheduling no longer uses the OS scheduler."
echo "Use 'bash scripts/start-crons.sh' to start the managed daemon or keep the Command Centre server running for in-process scheduling."
