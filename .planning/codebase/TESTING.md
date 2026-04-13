# Testing

**Analysis Date:** 2026-04-13

## Current Testing Posture

Automated test coverage appears light.

The repository contains a few operational test scripts, but there is no clear broad test suite for the embedded Next.js app. The current posture looks closer to manual verification plus targeted smoke checks than full unit or integration coverage.

## Declared App Test Command

Inside `projects/briefs/command-centre/package.json`:
- `npm run test:cron`

That script points to:
- `src/lib/cron-runtime.test.cjs`

Current finding:
- The referenced file does not exist in the repo

This means the main declared app test command is presently broken or incomplete.

## Test-like Files Found

The scan found a small number of operational test scripts:
- `scripts/test-update.sh`
- `scripts/test-crons.ps1`
- `scripts/test-windows-notify.ps1`

These look like environment or script checks, not a complete application test suite.

## What Was Not Found

- No obvious collocated unit tests under `projects/briefs/command-centre/src`
- No visible Playwright or Cypress end-to-end suite
- No dedicated API route integration tests
- No visible database migration test coverage
- No working cron runtime test file matching the declared npm script

## Likely Real Validation Method Today

Based on the repo structure, the system is probably validated through:
- Manual use of the command centre UI
- Manual running of launcher/install/update scripts
- Manual cron execution and log inspection
- Targeted smoke checks on operational scripts

## High-Risk Untested Areas

- `src/lib/cron-runtime.js`, which is large and central to automation
- SQLite migrations inside `src/lib/db.ts`
- SSE update flow through `src/app/api/events/route.ts`
- Script execution through `/api/settings/scripts/run`
- Multi-client workspace path resolution

## Practical Testing Guidance for Future Work

If work touches the embedded app, expect to rely on manual verification unless you add tests as part of the change.

The first high-value automated test targets would be:
- Cron runtime job discovery and execution behavior
- Database migration safety
- Task API routes
- Workspace root and client path resolution

## Testing Summary

The repo has some test intent, but not a reliable automated safety net yet. Any plan built on top of this codebase should assume higher regression risk until the missing cron test and core app coverage are addressed.

*Testing analysis: 2026-04-13*
