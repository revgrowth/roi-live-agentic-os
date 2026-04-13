# Structure

**Analysis Date:** 2026-04-13

## Top-Level Layout

```text
agentic-os/
├── AGENTS.md
├── CLAUDE.md
├── .agents/
├── .claude/
├── .codex/
├── brand_context/
├── clients/
├── context/
├── cron/
├── docs/
├── projects/
├── scripts/
└── .planning/
```

## Key Root Directories

**`.agents/`**
- Additional shared skills and agent support assets

**`.claude/`**
- Claude-oriented skills, hooks, settings, and installation catalog

**`.codex/`**
- Codex/GSD support material and installed skill packages

**`brand_context/`**
- Brand voice, ICP, positioning, and related client context

**`clients/`**
- Client-specific workspaces that mirror the root operating model
- Current example present: `clients/acme-inc`

**`context/`**
- Memory, learnings, soul, and user-preference files

**`cron/`**
- Scheduled job definitions, status, and logs

**`docs/`**
- Project documentation, guides, and setup material

**`projects/`**
- User project outputs and briefs
- Important embedded app lives under `projects/briefs/command-centre`

**`scripts/`**
- Launch, install, update, cron, skill, and client-management scripts
- Bash and PowerShell variants exist for many operational tasks

**`.planning/`**
- GSD requirements, roadmap, phase state, and now the codebase map docs

## Embedded Command Centre App

```text
projects/briefs/command-centre/
├── package.json
├── next.config.ts
├── tsconfig.json
├── scripts/
└── src/
    ├── app/
    ├── components/
    ├── hooks/
    ├── lib/
    ├── store/
    └── types/
```

## Important App Subdirectories

**`src/app/`**
- Next.js App Router pages and API routes
- Main page plus API folders such as `tasks`, `events`, `settings`, `cron`, `files`, and `skills`

**`src/components/`**
- UI grouped by feature area
- Notable groups include `board`, `cron`, `dashboard`, `modal`, `panel`, `settings`, and `tasks`

**`src/lib/`**
- Shared server/client utility layer
- Holds config discovery, DB access, cron runtime, script registry, subprocess helpers, and parsers

**`src/store/`**
- Zustand stores, especially task-related state

**`src/types/`**
- Shared TypeScript types for app features

## Structure Observations

- The root repo is the true system boundary, not just the Next.js app folder
- The embedded command centre is where most interactive product code lives
- The repo favors feature folders more than strict technical slicing in the UI
- Infrastructure logic is concentrated in `src/lib/`
- Client workspaces duplicate many root capabilities, which helps isolation but increases drift risk

## Planning Files Added by This Map

```text
.planning/codebase/
├── ARCHITECTURE.md
├── CONCERNS.md
├── CONVENTIONS.md
├── INTEGRATIONS.md
├── STACK.md
├── STRUCTURE.md
└── TESTING.md
```

*Structure analysis: 2026-04-13*
