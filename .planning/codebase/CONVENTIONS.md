# Conventions

**Analysis Date:** 2026-04-13

## Repository Conventions

- `AGENTS.md` is treated as the main operating-instruction file for the repo
- The root workspace is shared infrastructure; client-specific data lives under `clients/<slug>`
- Skills use category-prefixed folder names such as `mkt-*`, `viz-*`, `ops-*`, and `tool-*`
- Planning artifacts live under `.planning/`
- Project deliverables are meant to live under `projects/`

## Naming Patterns

**Scripts and folders:**
- Mostly kebab-case
- Bash and PowerShell script pairs use the same base name when both exist

**React/UI files:**
- Many component filenames are also kebab-case instead of PascalCase
- Feature grouping is preferred over one flat component directory

**Client workspaces:**
- Created as slug folders under `clients/`
- Shared structure is copied into each client workspace

## TypeScript and Next.js Style

- App code uses TypeScript with the `@/*` path alias
- Imports commonly use double quotes and semicolons
- Shared logic is collected under `src/lib`
- State containers live under `src/store`
- API behavior is implemented through App Router route handlers in `src/app/api`

## UI Conventions

- The command centre mixes Tailwind availability with a strong use of inline style objects
- Large page composition happens in `src/app/page.tsx`
- Components are organized by domain areas like `tasks`, `cron`, `dashboard`, `panel`, and `settings`
- Markdown content is rendered in-app rather than precompiled

## Data and State Conventions

- Local SQLite is the main durable store
- Database path is derived from the detected workspace root
- Schema changes are handled with additive migration code inside `src/lib/db.ts`
- Live server-to-client updates use SSE plus a process-local event bus

## Script and Ops Conventions

- Root shell scripts are generally defensive and operationally focused
- Bash remains the primary script language even though Windows counterparts exist for many flows
- The settings UI only exposes a small allowlist of scripts through `script-registry.ts`
- Install and update flows assume a local developer-style environment with Git, Node, npm, and Python available

## Documentation and Skill Conventions

- Skills are documented in `SKILL.md` files with frontmatter-driven triggers
- External service keys are documented in `.env.example`, not hard-coded in source
- README and `AGENTS.md` act as rule and capability registries
- Client and root workspaces both rely on markdown-based memory and brand context files

## Notable Deviations

- `next.config.ts` sets `typescript.ignoreBuildErrors = true`, which weakens the normal TypeScript quality gate
- Some validation and error handling is inline and route-specific rather than centralized
- The codebase uses both app-level modern TypeScript patterns and large procedural script files, so style consistency is uneven across layers

*Conventions analysis: 2026-04-13*
