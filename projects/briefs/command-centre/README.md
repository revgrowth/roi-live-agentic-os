# Command Centre Startup

Command Centre launches from `projects/briefs/command-centre`, but its explicit Next.js root is the workspace root so Turbopack and output tracing stop at the repo boundary instead of walking into ancestor folders above it.

## Supported commands

- `npm run dev`
- `npm run build`
- `npm run start`

These commands all run through `scripts/next-run.cjs`.

## Startup contract

- The launcher always uses the app-local Next CLI from `projects/briefs/command-centre/node_modules`.
- `dev` and `build` always run with Turbopack.
- `start` runs from the same launcher so runtime env and paths stay aligned with `dev` and `build`.
- The launcher `cwd` is `projects/briefs/command-centre`.
- The explicit Next.js root for Turbopack and output tracing is the workspace root.
- The Agentic OS workspace root is the repository root containing `AGENTS.md` or, on the current `dev` branch, `CLAUDE.md`.
- `AGENTIC_OS_DIR` is optional. If it is unset, the launcher and runtime auto-detect the workspace root.

## Unsupported paths

- `npm run dev -- --webpack`
- `npm run build -- --webpack`
- invoking a global `next` binary instead of the app-local one

## Direct launcher usage

```powershell
node scripts/next-run.cjs dev
node scripts/next-run.cjs build
node scripts/next-run.cjs start
```

You can also run from outside the app directory:

```powershell
npm --prefix projects/briefs/command-centre run dev
```
