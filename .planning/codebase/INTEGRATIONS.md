# Integrations

**Analysis Date:** 2026-04-13

## Integration Overview

This codebase mixes local integrations and optional external services.

The local integrations matter most in daily operation:
- Claude CLI for scheduled job execution
- SQLite for persistent task and cron state
- The local filesystem for workspace discovery, client folders, jobs, and content files
- Browser launching from helper scripts

External services are mostly skill-driven and enabled through environment variables when available.

## Local Runtime Integrations

**Claude CLI:**
- `src/lib/cron-runtime.js` shells out to `claude -p`
- Scheduled jobs depend on the Claude CLI being installed and usable from the host machine
- This is a hard runtime dependency for cron execution

**SQLite:**
- `src/lib/db.ts` opens `.command-centre/data.db`
- Schema comes from `src/lib/schema.sql` plus additive migrations in code
- Used for tasks, logs, cron runs, conversations, messages, and projects

**Filesystem Workspace Model:**
- `src/lib/config.ts` finds the workspace root by locating `AGENTS.md` or `CLAUDE.md`
- Client workspaces are resolved under `clients/<clientId>`
- Scripts, docs, skills, and cron job files are all read directly from disk

**Event Streaming:**
- `src/app/api/events/route.ts` exposes Server-Sent Events
- `src/lib/event-bus.ts` broadcasts in-process updates to connected clients

**Script Execution:**
- `src/app/api/settings/scripts/run/route.ts` runs registered scripts through Bash
- `src/lib/script-registry.ts` currently exposes `add-client` and `update`

## Optional External Services

These are documented in `.env.example` and README rather than hard-coded in the app runtime.

| Service | Config | Main Use |
|---------|--------|----------|
| Firecrawl | `FIRECRAWL_API_KEY` | Scraping and branding extraction |
| OpenAI | `OPENAI_API_KEY` | Reddit/web-assisted research |
| xAI | `XAI_API_KEY` | X/Twitter research |
| YouTube Data API | `YOUTUBE_API_KEY` | Channel listing and video lookup |
| Google Gemini | `GEMINI_API_KEY` | Image generation |
| HeyGen | `HEYGEN_API_KEY` | Avatar video generation |
| Google Workspace CLI | `GOOGLE_WORKSPACE_CLI_CLIENT_ID`, `GOOGLE_WORKSPACE_CLI_CLIENT_SECRET` | Gmail, Drive, Calendar, and related workflows |
| Google Stitch | gcloud auth | UI design generation/export |

## Integration Boundaries

**Inside the Next.js app:**
- API routes call local libraries directly
- There is no strong service boundary between route handlers and database logic

**Inside scripts and skills:**
- Scripts operate on the workspace directly
- Skills depend on environment variables, external CLIs, and markdown files

## Fallback Behavior

- Most external APIs are optional and documented as enhancements
- The installer creates `.env` from `.env.example`, but empty keys are allowed
- Skills are expected to explain when an API key would help and what fallback remains
- Google Stitch and HeyGen are documented as having no real fallback

## Practical Notes

- The real integration center is the local machine, not a cloud backend
- Running the system well depends on local tools being present: Node, npm, Git, Bash, Python, and Claude CLI
- The command centre is tightly coupled to the workspace layout, so changing folder structure will affect integrations quickly

*Integration analysis: 2026-04-13*
