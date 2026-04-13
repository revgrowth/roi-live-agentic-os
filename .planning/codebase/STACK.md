# Technology Stack

**Analysis Date:** 2026-04-13

## Languages

**Primary:**
- TypeScript 5.9.3 - Main application code in `projects/briefs/command-centre`
- SQL - SQLite schema and migrations in `src/lib/schema.sql` and `src/lib/db.ts`

**Secondary:**
- JavaScript - Node scripts, cron runtime, Claude/GSD tooling, and hooks
- Bash - Installer, launcher, updater, cron management, and skill management scripts
- PowerShell - Windows equivalents for launcher and cron operations
- Python - Small helper scripts such as cron database utilities and skill selection
- Markdown - Product docs, workspace instructions, skills, and planning artifacts

## Runtime

**Environment:**
- Node.js - Main runtime for the command-centre app, scripts, and hooks
- Browser - React UI served by Next.js
- SQLite - Local persistence in `.command-centre/data.db`
- Claude CLI - Used by the cron runtime to execute scheduled jobs

**Package Manager:**
- npm - Used inside `projects/briefs/command-centre`
- Lockfile: `projects/briefs/command-centre/package-lock.json` is present

## Frameworks

**Core:**
- Next.js 16.2.1 - Full-stack web app framework for the command centre
- React 19.2.4 - UI rendering for the dashboard and task views
- Zustand 5.0.12 - Client-side state store for tasks and live updates
- Tailwind CSS 4.2.2 - Styling foundation, alongside many inline style objects

**Testing:**
- Node built-in test runner - Declared via `npm run test:cron`, but the referenced test file is currently missing
- Shell and PowerShell smoke scripts - Used for some operational checks outside the app

**Build/Dev:**
- TypeScript 5.9.3 - Static typing for the app
- ESLint 9.39.4 with `eslint-config-next` 16.2.1 - Linting
- Turbopack through Next.js - Dev/build pipeline

## Key Dependencies

**Critical:**
- `better-sqlite3` 12.8.0 - Embedded database access for tasks, cron runs, logs, and conversations
- `croner` 10.0.1 - Cron schedule parsing and execution timing
- `chokidar` 5.0.0 - File watching for workspace and queue updates
- `gray-matter` 4.0.3 - Frontmatter parsing for markdown-based content
- `react-markdown` 10.1.0 and `remark-gfm` 4.0.1 - Markdown rendering in the UI

**UI/Interaction:**
- `@dnd-kit/*` - Drag and drop behavior in board/task interfaces
- `lucide-react` 1.7.0 - Icon set used across the UI

## Configuration

**Environment:**
- Root `.env.example` documents optional API keys and OAuth credentials
- Root `.env` is expected for local secrets, but is gitignored
- `AGENTIC_OS_DIR` can override automatic workspace-root detection

**Build and Runtime Config:**
- `projects/briefs/command-centre/next.config.ts`
- `projects/briefs/command-centre/tsconfig.json`
- `.claude/settings.json` for Claude permissions, hooks, and MCP settings
- `AGENTS.md` as the main operating-rule document for the repo

## Platform Requirements

**Development:**
- Cross-platform in intent, but some features still assume Bash is available
- Node.js and npm are required for the command-centre app
- Python is required for some helper scripts
- Git is expected by install/update and GSD workflows

**Production / Deployment Style:**
- Local or self-hosted workspace model rather than a packaged SaaS deployment
- Next.js app runs inside the workspace and reads/writes local files
- SQLite lives inside the workspace under `.command-centre/`
- Scheduled automation depends on local scripts plus the Claude CLI

## Stack Summary

This repo is not a single plain web app. It combines a workspace template, automation scripts, skill packs, and a full-stack Next.js dashboard. The most important execution path is the command centre in `projects/briefs/command-centre`, but the surrounding Bash, PowerShell, and Python tooling is part of the real runtime and cannot be treated as optional background material.

*Stack analysis: 2026-04-13*
