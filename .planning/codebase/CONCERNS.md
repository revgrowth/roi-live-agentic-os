# Concerns

**Analysis Date:** 2026-04-13

## 1. Cron Runtime Is Very Large and Central

**Evidence:**
- `projects/briefs/command-centre/src/lib/cron-runtime.js` is about 1359 lines

**Why it matters:**
- It mixes job discovery, locking, database access, subprocess spawning, output capture, retries, and lifecycle control in one file
- Changes here carry a high regression risk because many behaviors are tightly coupled

## 2. Update Script Is Also Very Large

**Evidence:**
- `scripts/update.sh` is about 1348 lines

**Why it matters:**
- The updater handles backups, reconciliation, reinstallation, and recovery behavior in one procedural script
- Large operational scripts are hard to test and hard to reason about during failures

## 3. TypeScript Build Errors Are Explicitly Ignored

**Evidence:**
- `projects/briefs/command-centre/next.config.ts` sets `typescript.ignoreBuildErrors = true`

**Why it matters:**
- The build can pass while type problems still exist
- This weakens one of the main safety checks for a TypeScript codebase

## 4. Declared Cron Test Is Missing

**Evidence:**
- `package.json` exposes `npm run test:cron`
- The referenced file `src/lib/cron-runtime.test.cjs` is not present

**Why it matters:**
- The codebase signals test coverage that does not actually exist
- The riskiest automation area currently lacks its named test entrypoint

## 5. Event Streaming Depends on a Process-Local Global Bus

**Evidence:**
- `src/lib/event-bus.ts` stores an EventEmitter on `globalThis`
- `/api/events` streams updates from that in-process emitter

**Why it matters:**
- This is simple, but fragile if execution model changes
- Multi-process or scaled execution would not naturally share these events

## 6. Web UI Can Launch Bash Scripts

**Evidence:**
- `/api/settings/scripts/run` uses Bash to run registered scripts
- `script-registry.ts` currently whitelists a small set of scripts

**Why it matters:**
- It creates a strong coupling between the web UI and the host shell environment
- Portability and security need careful handling, especially on Windows-heavy setups

## 7. Client Workspaces Duplicate Shared Material

**Evidence:**
- `scripts/add-client.sh` copies skills, hooks, settings, scripts, and other structure into each client folder

**Why it matters:**
- This helps isolation, but duplicated material can drift from the root over time
- Debugging becomes harder when root and client copies do not match exactly

## 8. Route Handlers and Data Logic Are Tightly Coupled

**Evidence:**
- API routes call database and process helpers directly from `src/lib/*`
- There is no obvious service boundary or shared validation layer

**Why it matters:**
- Quick to build, but harder to test in isolation
- Business logic can spread across routes and utilities instead of staying in one clear layer

## 9. Mixed Runtime Model Raises Maintenance Cost

**Evidence:**
- The real system spans Next.js, React, SQLite, Bash, PowerShell, Python, Claude CLI, and markdown-driven skills

**Why it matters:**
- A simple feature change can touch more than one language and runtime
- New contributors need to understand both the app and the surrounding operating-system layer

## Concern Summary

The codebase is workable, but several core areas combine high responsibility with low automated coverage. The biggest planning assumption should be that changes around cron execution, updating, and cross-workspace behavior need extra care and direct verification.

*Concern analysis: 2026-04-13*
