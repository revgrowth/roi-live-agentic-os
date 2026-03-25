# Feature Research

**Domain:** AI agent dashboard / command centre for non-technical business users
**Researched:** 2026-03-25
**Confidence:** HIGH

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete or broken.

#### Board & Task Management

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Kanban board with drag-and-drop | Every task management tool has this. Users will try to drag cards immediately. | MEDIUM | Backlog, Queued, Running, Review, Done columns per spec. Use dnd-kit or similar React DnD library. |
| Task creation with plain-language description | Core value proposition. If users have to fill forms or pick options, friction kills adoption. | LOW | Single text input + optional fields. Skill routing happens behind the scenes. |
| Task status indicators | Users need to know what's running, what's waiting, what's done at a glance. | LOW | Color-coded status badges on cards. Running = animated indicator (spinner or pulse). |
| Task detail panel (slide-out) | Clicking a card must show full detail. Every Kanban tool from Trello to Linear does this. | MEDIUM | Slide-out panel with task metadata, progress, stats, and output files. |
| Visual distinction between task levels | If Task/Project/GSD look identical, users can't scan the board. | LOW | Card variants with level badges. Project/GSD cards show child task count and progress bar. |
| Expandable parent tasks | Project and GSD cards must expand to show child tasks. Standard in any hierarchical task tool. | MEDIUM | Inline expansion or nested view within detail panel. |
| Persistent board state | Board must survive browser refresh and app restart. Users lose trust instantly if work disappears. | LOW | SQLite persistence. Already in spec. Non-negotiable. |
| One-command install | Target users are non-technical. Anything more than `npx agentic-kanban` and they abandon setup. | MEDIUM | Package must handle all dependencies. SQLite bundled (better-sqlite3), no Docker, no separate DB setup. |

#### Live Monitoring

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Real-time task status updates | If a task moves from Running to Done and the board does not update, users think it is broken. | MEDIUM | SSE from backend to frontend. Every competitor (Vibe Kanban, OpenClaw dashboards, Claude Task Viewer) does live updates. |
| Running task activity indicator | Users need to see that something is actually happening, not just a static "Running" label. | LOW | Animated card border, spinner, or live elapsed time counter on running cards. |
| Global stats bar | At-a-glance operational awareness. OpenClaw dashboards, Paperclip, and Sentry AI dashboards all show top-level metrics. | LOW | Tasks running, tasks completed today, active crons, today's spend. Persistent top bar. |

#### Output Management

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Output files listed on task cards | The whole point is "describe, watch, get output." If output is not surfaced on the card, users have to hunt in the filesystem. | LOW | File list with icons by type (md, csv, png, pdf). Read from Agentic OS output conventions. |
| Inline preview for text/markdown | Users should not leave the dashboard to read a blog post or email draft the agent wrote. | MEDIUM | Markdown renderer in detail panel. Support .md, .txt, .csv (tabular view). |
| File download | Users need to get files out. Non-negotiable for any file-producing tool. | LOW | Download button per file. Copy-to-clipboard for text content. |

#### Settings & Configuration

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Configurable agentic-os path | Dashboard is a separate app pointing at an install. Must let users set where their agentic-os lives. | LOW | Settings page with path input. Default to cwd. Persist in SQLite. |
| Clean, minimal light theme | Target users are business owners, not developers. Dark mode with terminal aesthetics signals "dev tool." | LOW | Light theme default. Clean typography. No emojis. Inspired by Vibe Kanban aesthetic. |

### Differentiators (Competitive Advantage)

Features that set this product apart. These are where the Command Centre competes against existing tools.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Business-user focus (not dev-focused)** | Every AI agent Kanban (Vibe Kanban, AgentsBoard, AI Agent Board, Claw-Kanban) is built for developers managing coding agents. This is the only one for business outputs -- content, reports, emails. No git, no diffs, no branches. | LOW | This is a design decision, not a feature to build. Enforce it in every UI choice: no dev jargon, no terminal concepts. |
| **Skill auto-routing** | Users describe work in plain language; the system picks the right skill. No other dashboard does NLP-based routing to skill files. Competitors require users to pick agents manually. | HIGH | Match task description against skill frontmatter trigger phrases. Start with keyword matching, upgrade to semantic matching later. This is the core UX differentiator. |
| **Three-level task hierarchy (Task/Project/GSD)** | Competitors have flat task lists or simple parent-child. The three-tier model (single task, multi-step project, product-level initiative) maps to real business work better than any competitor. | MEDIUM | GSD is unique to Agentic OS. Project/GSD decompose into child tasks. Progress rolls up. |
| **Cron job scheduling with output versioning** | Recurring agent work (weekly newsletter, daily competitor scan) with versioned outputs so users can compare run-to-run. No competitor dashboard combines scheduling + output diffing for business content. | HIGH | Cron expression builder (simple presets + advanced custom). Run history table. Side-by-side output comparison for recurring tasks. |
| **Context/Brand/Skills management tabs** | The dashboard is a window into the full Agentic OS -- not just a task board. Users can see and edit what their agents know (context), how they sound (brand), and what they can do (skills). No competitor offers this. | MEDIUM | File browser/editor for context/, brand_context/, and .claude/skills/. Read-only initially, editable as enhancement. |
| **Client switching** | Multi-client support scoped across all views. Agency builders manage multiple clients from one dashboard. Competitors are single-tenant or require separate instances. | MEDIUM | Nav bar dropdown. Scopes board, crons, context, brand, skills to client subfolder. Root view shows all. |
| **Agent-first API design** | Claude sessions self-report status and register outputs. The API is designed for agent consumption first, human UI second. This is what OpenClaw got right. Retrofitting agent access onto human tools (like Notion) creates friction. | HIGH | REST API + SSE endpoints. Claude CLI subprocess reports back via API. Agent writes status updates and file registrations. |
| **Cost/token tracking per task** | Per-task cost visibility. Users see exactly what each piece of work costs. OpenClaw dashboards show global costs; this shows per-task granularity. | MEDIUM | Tokens used, cost, duration per task. Rollup to daily/weekly/monthly. Today's spend in global stats bar. |
| **Local-only, no accounts** | Privacy and simplicity. No cloud, no login, no data leaving the machine. In a market where every tool wants your data, this is a trust differentiator for business users handling client work. | LOW | Architecture decision. SQLite local storage. No auth needed for single-user local app. |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems. Deliberately do NOT build these.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| **Real-time log streaming (terminal output in UI)** | "I want to see what Claude is doing line by line." | Exposes terminal complexity to non-technical users. Creates anxiety ("is that error bad?"). Massive data volume. Every dev-focused dashboard does this -- copying it means becoming a dev tool. | Show task status transitions and progress indicators. Surface output files as they appear. Users care about results, not process. |
| **Git/diff/branch visibility** | Developers expect this from code-focused Kanban tools. | Target users do not use git. Showing diffs, branches, or commit history makes the tool feel like a developer IDE. Vibe Kanban, AI Agent Board, and VS Code Agent Kanban all do this -- they are developer tools. | File versioning for cron outputs (compare run outputs, not git diffs). Business users understand "this week vs last week," not "this commit vs that commit." |
| **Manual skill selection** | "Let me pick which skill to use." | Adds friction and requires users to understand the skill system. The whole point is that the system routes automatically. Manual override creates a "power user trap" where the simple path gets neglected. | Skill auto-routing with a "suggested skill" display on the card. If routing is wrong, user can re-describe the task. Add manual override only if auto-routing proves insufficient after v1 validation. |
| **In-app file editing of outputs** | "Let me edit the blog post right in the dashboard." | Turns the dashboard into a document editor. Scope creep into competing with Google Docs. Preview is valuable; editing is a rabbit hole (formatting, autosave, conflict resolution). | Inline preview + download. Users edit in their preferred tool (Google Docs, Notion, Word). Add a "copy to clipboard" button for quick paste. |
| **Multi-user collaboration** | "My team should see the board too." | Requires auth, permissions, conflict resolution, real-time sync between users. Massively increases complexity. Single-user local app is the v1 constraint. | Single-user local install. If team use is validated as a need post-launch, consider a shared SQLite over LAN or a lightweight server mode in v2. |
| **Mobile app** | "I want to check tasks from my phone." | Responsive web is complex enough. Native mobile is a separate product. Non-technical users will expect App Store quality. | Responsive web design that works acceptably on tablet. Phone is out of scope for v1. |
| **Cloud sync / backup** | "What if I lose my data?" | Adds cloud dependency, accounts, auth, sync conflict resolution. Violates local-only principle. | Local SQLite with a documented backup path (copy the .db file). Future: optional export/import. |
| **AI chat interface in dashboard** | OpenClaw dashboards have a chat panel for querying agent status. | Duplicates what Claude Code already does. Users already have Claude in terminal (or will via the command centre). Adding another chat surface creates confusion about where to talk to the AI. | The task description IS the interface to the AI. Type what you want, submit it, watch it run. No chat needed. |
| **Custom Kanban columns** | "Let me add my own columns." | Five columns (Backlog, Queued, Running, Review, Done) map to the agent execution lifecycle. Custom columns break the semantic meaning (what does "In Progress" mean vs "Running" for an agent?). | Fixed columns that map to agent states. The column names ARE the workflow. If users need custom workflows, they need a different tool. |
| **Notification system (email/push/desktop)** | "Alert me when a task finishes." | Requires notification infrastructure, permissions, OS integration. Desktop notifications are reasonable but email/push is scope creep. | Browser tab title update ("(3) tasks done") and optional desktop notification via browser Notification API. No email or push. |

## Feature Dependencies

```
[Task Creation] ──requires──> [SQLite Persistence]
[Task Creation] ──requires──> [Skill Auto-Routing]

[Kanban Board] ──requires──> [SQLite Persistence]
[Kanban Board] ──requires──> [Task Creation]

[Live Status Updates] ──requires──> [SSE Backend]
[Live Status Updates] ──requires──> [Agent-First API]

[Agent-First API] ──requires──> [SQLite Persistence]
[Agent-First API] ──requires──> [Claude CLI Subprocess Management]

[Claude CLI Subprocess Management] ──requires──> [Configurable Agentic OS Path]

[Output File Management] ──requires──> [Agent-First API] (agents register files)
[Output File Management] ──requires──> [Agentic OS File Convention Reader]

[Inline Preview] ──requires──> [Output File Management]

[Cron Scheduling] ──requires──> [Task Creation]
[Cron Scheduling] ──requires──> [Claude CLI Subprocess Management]

[Output Versioning] ──requires──> [Cron Scheduling]
[Output Versioning] ──requires──> [Output File Management]

[Cost/Token Tracking] ──requires──> [Agent-First API] (agents report usage)

[Task Detail Panel] ──requires──> [Output File Management]
[Task Detail Panel] ──requires──> [Cost/Token Tracking]
[Task Detail Panel] ──enhances──> [Kanban Board]

[Context/Brand/Skills Tabs] ──requires──> [Configurable Agentic OS Path]
[Context/Brand/Skills Tabs] ──requires──> [Agentic OS File Convention Reader]

[Client Switching] ──requires──> [Configurable Agentic OS Path]
[Client Switching] ──enhances──> [Context/Brand/Skills Tabs]
[Client Switching] ──enhances──> [Kanban Board]
[Client Switching] ──enhances──> [Cron Scheduling]

[Three-Level Hierarchy] ──requires──> [Task Creation]
[Three-Level Hierarchy] ──enhances──> [Kanban Board]

[Global Stats Bar] ──requires──> [Cost/Token Tracking]
[Global Stats Bar] ──requires──> [SQLite Persistence]
```

### Dependency Notes

- **Agent-First API requires Claude CLI Subprocess Management:** Agents cannot self-report unless they are spawned and managed by the backend.
- **Output File Management requires Agent-First API:** Files are registered by agents as they work, not discovered by polling the filesystem.
- **Cron Scheduling requires Claude CLI Subprocess Management:** Recurring tasks spawn new Claude sessions on schedule.
- **Output Versioning requires both Cron and Output Management:** Versioning only makes sense for recurring tasks that produce comparable outputs.
- **Client Switching enhances everything:** It is a filter layer on top of board, crons, context, brand, and skills. Build the single-client versions first, then add the scoping layer.
- **Skill Auto-Routing is required for Task Creation:** The core UX promise is "describe and go." Without routing, users must manually pick skills, which defeats the value proposition.

## MVP Definition

### Launch With (v1)

Minimum viable product -- what is needed to validate the core promise: "describe a task, watch it run, get the output."

- [ ] **SQLite persistence** -- foundation for everything; board state, task history, run data
- [ ] **REST API + SSE backend** -- agent-first endpoints for status updates and file registration
- [ ] **Claude CLI subprocess spawning** -- run Claude sessions from within agentic-os directory, inheriting full context
- [ ] **Kanban board with 5 fixed columns** -- Backlog, Queued, Running, Review, Done with drag-and-drop
- [ ] **Task creation (single level only)** -- plain-language description input, skill auto-routing
- [ ] **Skill auto-routing (keyword matching)** -- match description to skill frontmatter triggers; good enough for v1
- [ ] **Real-time status updates via SSE** -- cards move automatically as agents report progress
- [ ] **Output file list on cards** -- files appear on cards as agents register them
- [ ] **Inline markdown preview** -- click a file to preview in detail panel without leaving dashboard
- [ ] **File download** -- download any output file
- [ ] **Task detail slide-out panel** -- metadata, status, skill used, output files
- [ ] **Global stats bar** -- tasks running, completed today, today's spend
- [ ] **Cost/token tracking per task** -- basic token and cost logging from Claude CLI output
- [ ] **Configurable agentic-os path** -- settings page to point at user's install
- [ ] **Clean light theme** -- minimal, business-friendly, no dev jargon

### Add After Validation (v1.x)

Features to add once core loop (describe, run, get output) is validated with real users.

- [ ] **Project level (multi-step tasks)** -- add when users confirm they want to chain multiple tasks
- [ ] **Cron job scheduling** -- add when users confirm recurring tasks are a real workflow (daily/weekly/monthly presets)
- [ ] **Cron run history view** -- table showing past runs, duration, cost, status
- [ ] **Output versioning for cron jobs** -- side-by-side comparison of recurring task outputs
- [ ] **Context tab (read-only)** -- view memory and context files
- [ ] **Brand tab (read-only)** -- view brand context files
- [ ] **Skills tab** -- browsable list of installed skills with triggers and dependencies
- [ ] **Client switching** -- nav bar dropdown to scope all views to a client

### Future Consideration (v2+)

Features to defer until product-market fit is established.

- [ ] **GSD level tasks** -- full product-level initiative management with .planning/ integration
- [ ] **Context/Brand inline editing** -- edit files directly from the dashboard (v1 is read-only views)
- [ ] **Semantic skill routing** -- upgrade from keyword matching to embedding-based matching
- [ ] **Budget limits per task level** -- set spending caps on tasks
- [ ] **Output comparison (non-cron)** -- compare different versions of the same deliverable
- [ ] **npm publish** -- distribute as installable package (local dev first)
- [ ] **Desktop notifications** -- browser Notification API for task completion
- [ ] **Responsive tablet layout** -- acceptable mobile/tablet experience
- [ ] **Export/import board state** -- backup and restore for migration

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Kanban board with drag-and-drop | HIGH | MEDIUM | P1 |
| Task creation with description | HIGH | LOW | P1 |
| Skill auto-routing (keyword) | HIGH | MEDIUM | P1 |
| Claude CLI subprocess management | HIGH | HIGH | P1 |
| Agent-first REST API + SSE | HIGH | HIGH | P1 |
| SQLite persistence | HIGH | LOW | P1 |
| Real-time status updates | HIGH | MEDIUM | P1 |
| Output file list on cards | HIGH | LOW | P1 |
| Inline markdown preview | MEDIUM | LOW | P1 |
| File download | HIGH | LOW | P1 |
| Task detail panel | HIGH | MEDIUM | P1 |
| Global stats bar | MEDIUM | LOW | P1 |
| Cost/token tracking | MEDIUM | MEDIUM | P1 |
| Configurable path | HIGH | LOW | P1 |
| Clean light theme | HIGH | MEDIUM | P1 |
| Project-level tasks | HIGH | MEDIUM | P2 |
| Cron job scheduling | HIGH | HIGH | P2 |
| Cron run history | MEDIUM | MEDIUM | P2 |
| Output versioning (cron) | MEDIUM | HIGH | P2 |
| Context tab (read-only) | MEDIUM | LOW | P2 |
| Brand tab (read-only) | MEDIUM | LOW | P2 |
| Skills tab | MEDIUM | LOW | P2 |
| Client switching | MEDIUM | MEDIUM | P2 |
| GSD-level tasks | MEDIUM | HIGH | P3 |
| Context/Brand editing | LOW | MEDIUM | P3 |
| Semantic skill routing | MEDIUM | HIGH | P3 |
| Budget limits | LOW | MEDIUM | P3 |
| npm publish | HIGH | MEDIUM | P3 |
| Desktop notifications | LOW | LOW | P3 |

**Priority key:**
- P1: Must have for launch -- validates core promise
- P2: Should have, add once core is validated
- P3: Nice to have, future consideration

## Competitor Feature Analysis

| Feature | Vibe Kanban | OpenClaw Dashboards | AgentsBoard | Paperclip | Claude Task Viewer | **Our Approach** |
|---------|-------------|---------------------|-------------|-----------|-------------------|-----------------|
| Target user | Developers | Developers | Developers | Developers (zero-human co.) | Developers | **Business owners** |
| Task creation | CLI + web | API-driven | Web form | Ticket system | Auto from hooks | **Plain language description** |
| Kanban board | Yes (code tasks) | Yes (agent tasks) | Yes (simple) | Ticket board | Status board | **Yes (business outputs)** |
| Skill/agent routing | Manual agent pick | Auto-assignment | Manual model pick | Goal-based delegation | N/A (monitoring only) | **Auto-route from description** |
| Live updates | Yes (SSE) | Yes (auto-refresh 60s) | No | Event-based | Yes (hooks) | **SSE real-time** |
| Output management | Code diffs | Log viewing | Markdown export | Trace logs | Session logs | **File preview + download** |
| Cost tracking | Per-agent | Global + per-model | No | Per-agent budget | No | **Per-task granular** |
| Cron/scheduling | No | Cron monitoring | No | Heartbeat scheduling | No | **Full scheduling + versioned outputs** |
| Multi-client | No | No | No | Org-based | No | **Client folder scoping** |
| Context management | No | Memory browser | No | Goal ancestry | No | **Context/Brand/Skills tabs** |
| Hierarchy | Flat tasks | Flat tasks | Flat (Todo/Done) | Task + goals | Flat sessions | **Three-level (Task/Project/GSD)** |
| Git/code features | Worktrees, diffs | No | No | No | No | **None (deliberately)** |
| Install | CLI + web | Self-hosted | Vercel deploy | Self-hosted | Local | **One command (npx)** |
| Auth required | No | Optional (TOTP MFA) | No | No | No | **No** |

### Key Competitor Insights

1. **Vibe Kanban** is the closest in UX quality but is entirely developer-focused (git worktrees, code review, parallel coding agents). Its MCP integration is worth studying -- agents can create tasks and move cards via MCP protocol.

2. **OpenClaw dashboards** pioneered the agent-first API pattern. Their lesson: build the API for agents first, human UI second. Cost tracking (per-model breakdown, projected monthly cost) and alert banners (high costs, failed crons) are patterns to adopt.

3. **Paperclip** shows the most mature task management model (ticket-based, threaded conversations, goal ancestry, budget enforcement). Its "every task traces back to the company mission" concept maps well to the GSD hierarchy. Atomic budget enforcement is a smart pattern.

4. **Claude Task Viewer** validates the "observation over control" philosophy -- the dashboard only shows what Claude is doing, it does not interfere. Sound effects and desktop notifications on task completion are simple UX wins.

5. **AgentsBoard** is the simplest competitor -- good for validating that the market wants Kanban for AI agents, but too basic to be competitive. Its use of Next.js + Tailwind + shadcn/ui validates the tech stack choice.

6. **No competitor serves business users.** Every tool assumes the user is a developer managing coding agents. The gap is real and validated across every competitor surveyed.

## Sources

- [Vibe Kanban](https://vibekanban.com/) -- orchestration platform for AI coding agents
- [Vibe Kanban blog (VirtusLab)](https://virtuslab.com/blog/ai/vibe-kanban) -- architecture and MCP integration details
- [Vibe Kanban GitHub](https://github.com/BloopAI/vibe-kanban) -- feature details and implementation
- [OpenClaw Dashboard (mudrii)](https://github.com/mudrii/openclaw-dashboard) -- zero-dependency command center
- [OpenClaw Dashboard (tugcantopaloglu)](https://github.com/tugcantopaloglu/openclaw-dashboard) -- auth, cost tracking, memory browser
- [OpenClaw Dashboard Guide (Skywork)](https://skywork.ai/skypage/en/openclaw-dashboard-guide/2036391546995998720) -- feature overview
- [Paperclip](https://paperclip.ing/) -- open-source orchestration for zero-human companies
- [Paperclip GitHub](https://github.com/paperclipai/paperclip) -- task management and budget features
- [AgentsBoard GitHub](https://github.com/Justmalhar/AgentsBoard) -- simple Kanban for AI agents
- [AI Agent Board (DanWahlin)](https://github.com/DanWahlin/ai-agent-board) -- drag-and-drop Kanban with agent delegation
- [Claude Task Viewer (Medium)](https://ai-engineering-trend.medium.com/claude-task-viewer-a-real-time-dashboard-for-visualizing-claude-codes-workflow-79d76e638d5a) -- observation-over-control philosophy
- [Claude Code Agent Monitor](https://github.com/hoangsonww/Claude-Code-Agent-Monitor) -- hooks-based monitoring with Kanban
- [VS Code Agent Kanban](https://www.appsoftware.com/blog/introducing-vs-code-agent-kanban-task-management-for-the-ai-assisted-developer) -- .md file-based task storage
- [Flux Kanban](https://paddo.dev/blog/flux-kanban-for-ai-agents/) -- MCP-native task management
- [KaibanJS](https://www.kaibanjs.com/) -- JavaScript framework with Kanban-inspired agent management
- [Businessmap Kanban Features 2026](https://businessmap.io/blog/best-kanban-board-features) -- business user expectations
- [Asrify Kanban AI 2026](https://asrify.com/blog/ai-kanban-boards-2026) -- AI-powered Kanban trends
- [Cronitor](https://cronitor.io/cron-job-monitoring) -- cron monitoring dashboard patterns
- [Sentry AI Agents Dashboard](https://docs.sentry.io/product/insights/ai/agents/dashboard/) -- agent monitoring metrics

---
*Feature research for: AI agent command centre / business-user dashboard*
*Researched: 2026-03-25*
