# Stack Research

**Domain:** Locally hosted AI agent dashboard (Kanban + process management + real-time updates)
**Researched:** 2026-03-25
**Confidence:** HIGH (core stack user-specified; supporting libraries verified via official sources and multiple credible references)

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended | Confidence |
|------------|---------|---------|-----------------|------------|
| Next.js | 15.x (latest stable) | Full-stack React framework | User-specified. Use 15 over 16 -- 15 is battle-tested and all ecosystem tooling (shadcn, Drizzle, etc.) is proven compatible. Next.js 16 switched default bundler to Turbopack which can break custom webpack configs, and its ecosystem compatibility is still settling. Since this is a local app (not Vercel-deployed), we get zero benefit from 16's cloud-focused optimizations. | HIGH |
| React | 19.x | UI library | Ships with Next.js 15. React 19 includes use() hook, Actions, and improved Suspense -- all useful for dashboard data loading patterns. | HIGH |
| Tailwind CSS | 4.x | Utility-first CSS | User-specified. v4 is a ground-up rewrite: 5x faster full builds, 100x faster incremental builds, CSS-first configuration (no tailwind.config.js needed), cascade layers. Fully compatible with Next.js 15. | HIGH |
| Zustand | 5.0.x | Client state management | User-specified. Tiny (~1kb), hook-based, no Provider wrapper needed. Persist middleware handles localStorage for offline state survival. Perfect for dashboard UI state (selected task, filter state, panel visibility). | HIGH |
| TypeScript | 5.x | Type safety | Non-negotiable for a project this complex. Drizzle ORM gives end-to-end type safety from schema to query results. Next.js 15 has first-class TS support. | HIGH |

### Database Layer

| Technology | Version | Purpose | Why Recommended | Confidence |
|------------|---------|---------|-----------------|------------|
| better-sqlite3 | 12.8.x | SQLite driver | Synchronous, fastest SQLite driver for Node.js. Perfect for local-only apps -- no async overhead, no connection pooling needed. Native addon (C++ binding) delivers near-native SQLite performance. Used as the driver underneath Drizzle. | HIGH |
| Drizzle ORM | 0.45.x | Type-safe query builder + schema | Lightweight, SQL-native ORM with zero runtime overhead. Has native better-sqlite3 driver support with synchronous API (.all(), .get(), .run()). Schema-as-code with TypeScript means the DB schema lives alongside the app. drizzle-kit push is ideal for local SQLite -- apply schema changes directly without managing migration files. | HIGH |
| drizzle-kit | 0.31.x | Schema management CLI | Companion to Drizzle ORM. `drizzle-kit push` applies schema changes directly to SQLite file -- no migration files to manage during development. `drizzle-kit generate` available when migration files are needed for production releases. | HIGH |

### Real-Time Layer

| Technology | Version | Purpose | Why Recommended | Confidence |
|------------|---------|---------|-----------------|------------|
| Native SSE via TransformStream | (built-in) | Server-to-client live updates | No library needed. Next.js App Router route handlers support SSE via the Web Streams API (TransformStream). One-way server-to-client is exactly what task status updates need. Simpler than WebSockets, works over standard HTTP, auto-reconnects via EventSource API. | HIGH |

**SSE Implementation Pattern (verified from Next.js discussions and community patterns):**

```typescript
// app/api/events/route.ts
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const encoder = new TextEncoder();

  // Start async work WITHOUT awaiting -- return Response immediately
  (async () => {
    // Subscribe to process manager events, write SSE-formatted messages
    writer.write(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
  })();

  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Prevents NGINX buffering if behind proxy
    },
  });
}
```

**Critical:** The async streaming work must start AFTER returning the Response. If you `await` inside the route handler before returning, Next.js buffers everything and sends it all at once when the handler completes. The pattern above uses an immediately-invoked async function that runs in the background.

### Process Management

| Technology | Version | Purpose | Why Recommended | Confidence |
|------------|---------|---------|-----------------|------------|
| Node.js child_process.spawn() | (built-in) | Spawn Claude CLI processes | Built-in Node.js module. spawn() is correct over exec() because: (1) stream-based stdout/stderr (no 200KB buffer limit), (2) non-blocking, (3) provides pid for tracking. Claude CLI sessions can run for minutes -- spawn handles long-running processes properly. | HIGH |
| tree-kill | 1.2.x | Process tree cleanup | Kills entire process tree (parent + all children). Critical because Claude CLI may spawn its own subprocesses. Platform-aware: uses pgrep on macOS, ps on Linux, taskkill on Windows. Without this, killing the parent leaves orphan processes. | HIGH |

**Process Manager Pattern:**

A singleton ProcessManager class manages all spawned Claude processes:
- Map of taskId -> ChildProcess
- Emits events on stdout/stderr/exit that feed into SSE
- Graceful shutdown on SIGTERM/SIGINT kills all child processes via tree-kill
- Tracks process state (running/completed/failed/cancelled) in SQLite

### UI Components

| Technology | Version | Purpose | Why Recommended | Confidence |
|------------|---------|---------|-----------------|------------|
| shadcn/ui | latest (Tailwind v4 compatible) | Component library | Not a dependency -- components are copied into your codebase. Fully compatible with Next.js 15 + React 19 + Tailwind v4. Provides Dialog, Sheet, Tabs, ScrollArea, Badge, Toast -- everything a dashboard needs. Customizable at the source level since you own the code. | HIGH |
| @dnd-kit/core + @dnd-kit/sortable | 6.x | Drag-and-drop for Kanban | Modern, accessible, performant DnD for React. Specifically designed for sortable lists (Kanban columns). Hook-based API integrates cleanly with React 19. Preferred over react-beautiful-dnd which is no longer maintained. | MEDIUM |
| Lucide React | latest | Icons | Default icon set for shadcn/ui. Tree-shakeable, consistent design. | HIGH |

### Supporting Libraries

| Library | Version | Purpose | When to Use | Confidence |
|---------|---------|---------|-------------|------------|
| zod | 3.x | Runtime validation | Validate API request bodies, task creation payloads, config files. Drizzle integrates with zod for schema validation. | HIGH |
| date-fns | 3.x | Date formatting | Display "2 minutes ago", format timestamps in task cards and logs. Lightweight, tree-shakeable alternative to moment.js. | HIGH |
| chokidar | 4.x | File system watching | Watch output directories for new files (output discovery feature). Efficient cross-platform fs watching using native OS events. | MEDIUM |
| glob / fast-glob | 3.x | File discovery | Scan agentic-os directory structure for client folders, project outputs, cron files. | HIGH |
| ansi-to-html | 0.7.x | Terminal output rendering | Convert ANSI color codes from Claude CLI stdout into HTML for display in the dashboard log viewer. | LOW |
| EventEmitter (node:events) | (built-in) | Internal pub/sub | Bridge between ProcessManager and SSE route handlers. Process events get emitted internally, SSE handlers subscribe and forward to clients. | HIGH |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| ESLint + @eslint/js | Linting | Next.js 15 built-in ESLint config. Use flat config format (eslint.config.mjs). |
| Prettier + prettier-plugin-tailwindcss | Formatting | Auto-sorts Tailwind classes. Essential with Tailwind v4. |
| drizzle-kit studio | DB browser | `npx drizzle-kit studio` opens a browser-based SQLite viewer. Invaluable during development. |

## Installation

```bash
# Create project
npx create-next-app@latest command-centre --typescript --tailwind --eslint --app --src-dir

# Core database
npm install drizzle-orm better-sqlite3
npm install -D drizzle-kit @types/better-sqlite3

# State management
npm install zustand

# UI components (shadcn copies files, not a dependency)
npx shadcn@latest init
npx shadcn@latest add button card dialog sheet tabs scroll-area badge toast dropdown-menu

# Drag and drop (for Kanban)
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities

# Utilities
npm install zod date-fns tree-kill
npm install -D @types/tree-kill

# File watching (for output discovery)
npm install chokidar

# Dev tools
npm install -D prettier prettier-plugin-tailwindcss
```

## Alternatives Considered

| Category | Recommended | Alternative | Why Not the Alternative |
|----------|-------------|-------------|------------------------|
| Framework | Next.js 15 | Next.js 16 | 16 defaults to Turbopack bundler which can break custom configs. Ecosystem compatibility still settling. No benefit for a local app. Revisit when 16.x matures (6+ months). |
| Database driver | better-sqlite3 | sql.js (Emscripten WASM) | sql.js runs SQLite compiled to WASM -- slower than native, larger bundle. Only use sql.js if you need SQLite in the browser (we don't, our DB is server-side). |
| Database driver | better-sqlite3 | @libsql/client | libSQL adds remote database capabilities (Turso). We are local-only -- no need for the remote protocol overhead. better-sqlite3 is simpler and faster for local files. |
| ORM | Drizzle | Prisma | Prisma requires a separate binary (query engine), has heavier runtime overhead, and its SQLite support is less mature than PostgreSQL support. Drizzle is SQL-native, lighter, and has sync API for better-sqlite3. Prisma also generates a client that increases bundle size. |
| ORM | Drizzle | Raw better-sqlite3 | Raw SQL works but you lose type safety, schema-as-code, and migration tooling. For a project with 10+ tables (tasks, sessions, clients, cron_jobs, token_usage, etc.), an ORM pays for itself in maintainability. |
| State mgmt | Zustand | Redux Toolkit | Redux has more boilerplate, larger bundle, requires Provider wrapping. Zustand does the same job with 1/10th the code for a dashboard this size. |
| State mgmt | Zustand | Jotai | Jotai is atom-based (bottom-up). Zustand is store-based (top-down). For a dashboard with interconnected state (selected task, filter, view mode), a single store is more intuitive than scattered atoms. |
| Real-time | SSE (native) | WebSockets (ws/socket.io) | WebSockets are bidirectional -- overkill when data only flows server-to-client. SSE auto-reconnects, works over standard HTTP (no upgrade), and requires zero additional dependencies. socket.io adds ~50KB to the client bundle for no benefit here. |
| Real-time | SSE (native) | Polling | Polling wastes resources checking for updates that may not exist. SSE pushes updates instantly with zero overhead between events. |
| DnD | @dnd-kit | react-beautiful-dnd | react-beautiful-dnd is in maintenance mode (no active development since Atlassian stopped sponsoring). @dnd-kit is actively maintained, more performant, and has better accessibility. |
| Components | shadcn/ui | Material UI / Ant Design | MUI and Ant are heavy dependency-based component libraries. shadcn/ui copies source code into your project -- you own it, customize it freely, no version lock-in. Perfect for a dashboard that needs custom styling. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| sql.js for server-side SQLite | WASM-compiled SQLite is 3-5x slower than native. Only appropriate for browser-side SQLite (which we do not need). | better-sqlite3 (native C++ binding) |
| Prisma for SQLite | Heavy query engine binary, async-only API, weaker SQLite support vs PostgreSQL. Schema changes require `prisma generate` step. | Drizzle ORM (lightweight, sync API, SQL-native) |
| socket.io / ws | Adds bidirectional complexity when data flows one way (server to client). Extra dependency, extra client bundle size, WebSocket upgrade complications. | Native SSE via TransformStream |
| exec() for child processes | Buffers entire stdout/stderr in memory (200KB limit by default). Claude sessions can produce megabytes of output. Blocks until process completes. | spawn() with stream-based stdout/stderr |
| react-beautiful-dnd | Unmaintained since 2024. No React 19 compatibility updates. | @dnd-kit |
| moment.js | 300KB+ bundle, mutable API, officially in maintenance mode. | date-fns (tree-shakeable, immutable) |
| Next.js custom server | Disables Automatic Static Optimization, complicates deployment, removes middleware support. Not needed -- API route handlers can spawn child processes directly. | Standard Next.js with API route handlers |
| Next.js Middleware for SSE | Middleware runs on the Edge runtime which does not support Node.js APIs (child_process, better-sqlite3). | Route handlers with `runtime = 'nodejs'` |

## Stack Patterns by Variant

**For npx distribution (eventual goal):**
- Use `output: 'standalone'` in next.config.js to create a minimal deployable bundle
- Wrap the standalone output in an npm package with a `bin` entry pointing to a CLI script
- CLI script: checks for Node.js, runs `node .next/standalone/server.js`, opens browser
- Pattern follows create-t3-app / create-next-app scaffolding approach but ships a pre-built app
- The npm package includes the built standalone output, not source code
- Alternative: ship source + build on install (slower first run, but smaller package)

**For multi-client scoping:**
- SQLite file lives at agentic-os root: `projects/briefs/command-centre/.command-centre/data.db`
- Client scoping is a DB column (client_slug), not separate databases
- Single DB simplifies cross-client views and global dashboards
- File paths in tasks/outputs reference client subdirectories

**For development mode:**
- `drizzle-kit push` for rapid schema iteration (no migration files)
- `drizzle-kit studio` for visual DB inspection
- `drizzle-kit generate` only when preparing releases (creates versioned migrations)

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| Next.js 15.x | React 19.x | Ships together. Do not mix React 18 with Next.js 15. |
| shadcn/ui (latest) | Tailwind CSS 4.x + React 19 | Use `shadcn@latest` (not shadcn@2.3.0 which is for Tailwind v3). |
| Drizzle ORM 0.45.x | better-sqlite3 12.x | Native driver support. Use `drizzle-orm/better-sqlite3` import path. |
| drizzle-kit 0.31.x | Drizzle ORM 0.45.x | Must stay in sync. Both from drizzle-team. |
| better-sqlite3 12.x | Node.js 18+ | Native addon requires node-gyp build. Pre-built binaries available for most platforms. |
| Tailwind CSS 4.x | Next.js 15.x | CSS-first config. No tailwind.config.js needed (use CSS @theme directive instead). |
| @dnd-kit 6.x | React 19.x | Verify on install -- React 19 compatibility was added in later 6.x releases. |
| Zustand 5.0.x | React 19.x | Full React 19 support. Uses useSyncExternalStore internally. |

## Critical Technical Notes

### better-sqlite3 is a Native Addon
better-sqlite3 compiles C++ code during `npm install`. This means:
- Requires node-gyp and a C++ compiler (Xcode Command Line Tools on macOS, build-essential on Linux)
- Pre-built binaries (prebuild-install) cover most platforms but not all
- For npx distribution, the package must be rebuilt on the user's machine OR ship platform-specific prebuilds
- This is the main friction point for "one-command install" -- mitigate with clear error messages and a setup script

### SSE Connection Limits
Browsers limit concurrent SSE connections to ~6 per domain (HTTP/1.1). Since this is localhost:
- Use a single SSE connection that multiplexes all task updates (not one per task)
- Send events with a `taskId` field so the client can route to the correct component
- Consider HTTP/2 if connection limits become an issue (unlikely for local use)

### Process Management is Server-Side Only
All child_process operations happen in API route handlers (server-side Node.js). The client never spawns processes directly. The flow is:
1. Client POSTs to `/api/tasks` to create a task
2. Server spawns `claude` CLI via child_process.spawn()
3. Server streams stdout/stderr events via SSE
4. Client receives events via EventSource and updates Zustand store

## Sources

- [Next.js 15 release blog](https://nextjs.org/blog/next-15) -- version confirmation, React 19 bundling
- [Next.js upgrade to v16 guide](https://nextjs.org/docs/app/guides/upgrading/version-16) -- breaking changes, Turbopack default
- [Drizzle ORM SQLite getting started](https://orm.drizzle.team/docs/get-started-sqlite) -- better-sqlite3 driver setup, sync API
- [Drizzle ORM migrations](https://orm.drizzle.team/docs/migrations) -- push vs generate vs migrate
- [better-sqlite3 npm](https://www.npmjs.com/package/better-sqlite3) -- version 12.8.x confirmed
- [shadcn/ui Next.js installation](https://ui.shadcn.com/docs/installation/next) -- React 19 + Tailwind v4 compatibility
- [Tailwind CSS v4.0 release](https://tailwindcss.com/blog/tailwindcss-v4) -- CSS-first config, performance
- [Next.js SSE discussion #48427](https://github.com/vercel/next.js/discussions/48427) -- TransformStream pattern, buffering gotchas
- [Next.js standalone output docs](https://nextjs.org/docs/app/api-reference/config/next-config-js/output) -- standalone mode for distribution
- [tree-kill npm](https://www.npmjs.com/package/tree-kill) -- cross-platform process tree cleanup
- [Node.js child_process docs](https://nodejs.org/api/child_process.html) -- spawn() vs exec() tradeoffs
- [Zustand GitHub](https://github.com/pmndrs/zustand) -- version 5.0.x, persist middleware
- [Long-running tasks with Next.js](https://dev.to/bardaq/long-running-tasks-with-nextjs-a-journey-of-reinventing-the-wheel-1cjg) -- ProcessManager pattern, SSE integration

---
*Stack research for: Agentic OS Command Centre*
*Researched: 2026-03-25*
