# Running Agentic OS for Multiple Clients

## The Key Principle

Agentic OS has two layers:

1. **Methodology** — CLAUDE.md, SOUL.md, USER.md, skills, scripts. Version-controlled and shared. Lives at the root of your Agentic OS folder.
2. **Client data** — brand_context/, memory/, learnings, projects/, cron/jobs/. Unique per client. Lives inside `clients/{client-name}/`.

Everyone starts as a solo operator working from the root folder. When you need a second client, run `add-client.sh` — it creates a client workspace and seeds it with your existing learnings as a starting point.

The root folder keeps its own memory and learnings for system-wide work (building skills, testing methodology, non-client tasks). Client folders each have their own.

---

## How Parent CLAUDE.md Works

Claude Code has a built-in feature: it reads CLAUDE.md files from parent directories and merges them together. This is the foundation of multi-client.

```
agentic-os/
├── CLAUDE.md                    <- Claude Code reads this (parent)
└── clients/
    └── client-one/
        ├── CLAUDE.md            <- Claude Code reads this too (project root)
        └── ...                     Both are merged. Parent provides methodology,
                                    client provides overrides.
```

When you `cd clients/client-one && claude`:
- The root `CLAUDE.md` loads automatically — all methodology, skill registry, context matrix, heartbeat rules
- The client's `CLAUDE.md` adds client-specific instructions on top
- You never need to duplicate or sync the main CLAUDE.md

---

## What's Shared vs What's Separate

| What | Where | How clients get it |
|------|-------|-------------------|
| `CLAUDE.md` (methodology) | Root | Auto-inherited via parent CLAUDE.md — no copy needed |
| `context/SOUL.md` | Root | Read by heartbeat fallback — no copy needed |
| `context/USER.md` | Root | Read by heartbeat fallback — no copy needed |
| `.claude/skills/` | Root + each client | Copied on client creation, auto-synced on update |
| `scripts/` | Root + each client | Copied on client creation, auto-synced on update |
| `CLAUDE.md` (client-specific) | Each client | Created by `add-client.sh` — your space for client notes |
| `brand_context/` | Each client | Built automatically on first session — unique per brand |
| `context/learnings.md` | Root + each client | Root has system-wide learnings. Client starts with a copy, then diverges |
| `context/memory/` | Root + each client | Root has system-wide memory. Client has its own session history |
| `projects/` | Each client | Per-client deliverables |
| `.env` | Each client | API keys — usually the same, copied from root on creation |
| `cron/jobs/` | Each client | Per-client scheduled tasks |

### What stays in sync automatically

- **CLAUDE.md methodology** — parent directory inheritance, instant
- **SOUL.md and USER.md** — heartbeat reads from root, instant
- **Skills and scripts** — `update.sh` syncs to all client folders automatically when it detects a `clients/` directory

### What you manage manually

- **Brand context** — unique per client, built automatically on first session
- **Learnings** — accumulate independently per client
- **API keys** — copy your `.env` to new clients if needed (done automatically on creation)

---

## How Skills Stay in Sync

Skills live in the root folder as the master copy. Each client folder gets its own working copy. **You never need to think about keeping these in sync** — it happens automatically in two situations:

1. **When you create a new client** — `add-client.sh` copies the latest skills into the client folder
2. **When you update Agentic OS** — `update.sh` pulls the latest from upstream and pushes skills, scripts, and settings to all client folders in one step

You run `update.sh` whenever you want new features, skills, or improvements. It's a single command from the root folder:

```bash
cd ~/Projects/agentic-os
bash scripts/update.sh
```

That's it. All clients are synced. Your client data (brand context, memory, learnings, projects) is never touched.

### Important: Where to Edit Skills

**Always edit skills at the root level**, not inside a client folder. Root is the source of truth — when `update.sh` runs, it overwrites client copies with whatever's at root. If you edit a skill inside a client folder, the next update will replace your changes.

```
Edit here:     agentic-os/.claude/skills/mkt-copywriting/SKILL.md     ← ✓ root
Not here:      agentic-os/clients/client-one/.claude/skills/mkt-copywriting/SKILL.md  ← ✗ overwritten on update
```

### Client-Only Skills

If you need a skill that's specific to one client, you can create it directly in that client's `.claude/skills/` folder. Client-only skills are preserved during updates — the sync only overwrites skills that exist at root, and leaves everything else alone.

```
agentic-os/.claude/skills/                          ← shared skills (synced to all clients)
clients/client-one/.claude/skills/
├── mkt-copywriting/                                ← from root (overwritten on update)
├── mkt-brand-voice/                                ← from root (overwritten on update)
└── custom-client-reporting/                        ← client-only (preserved on update)
```

### Managing Skills

You can ask Claude to list, add, or remove skills — or use these commands from the root folder:

```bash
bash scripts/list-skills.sh              # See what's installed
bash scripts/add-skill.sh skill-name     # Add a skill
bash scripts/remove-skill.sh skill-name  # Remove a skill
```

When you add or remove a skill at root, it takes effect in all client folders the next time you run `update.sh`. If you want it to take effect immediately, run `bash scripts/update-clients.sh` — but most people just wait for the next update.

---

## Scenario 1: Solo Operator, One Business

```
~/Projects/agentic-os/
├── CLAUDE.md
├── context/
│   ├── SOUL.md
│   ├── USER.md
│   ├── learnings.md              <- your accumulated learnings
│   └── memory/                   <- your session history
├── brand_context/
├── .claude/skills/
├── projects/
├── cron/jobs/
└── .env
```

**This is the default. You're already here.** You work directly in the root folder. No clients/ directory needed. Everything in this guide is optional until you need a second client.

---

## Scenario 2: Multiple Clients

One Agentic OS installation. One client folder per brand. You `cd` into a client folder and open Claude Code there.

```
~/Projects/agentic-os/                         <- your single installation
├── CLAUDE.md                                  <- shared methodology (auto-inherited)
├── context/
│   ├── SOUL.md                                <- shared personality (auto-inherited)
│   ├── USER.md                                <- shared operator profile (auto-inherited)
│   ├── learnings.md                           <- system-wide learnings (non-client work)
│   └── memory/                                <- system-wide session history
├── .claude/skills/                            <- master copy of all skills
├── scripts/                                   <- master copy of all scripts
│
├── clients/
│   ├── client-one/                            <- you work HERE
│   │   ├── CLAUDE.md                          <- client-specific instructions
│   │   ├── .claude/skills/                    <- copied from root, auto-synced
│   │   ├── scripts/                           <- copied from root, auto-synced
│   │   ├── brand_context/                     <- Client One voice, positioning, ICP
│   │   ├── context/
│   │   │   ├── learnings.md                   <- Client One feedback (seeded from root)
│   │   │   └── memory/                        <- Client One session history
│   │   ├── projects/                          <- Client One deliverables
│   │   ├── cron/
│   │   │   ├── jobs/                          <- Client One scheduled tasks
│   │   │   ├── logs/
│   │   │   └── status/
│   │   └── .env                               <- API keys
│   │
│   └── client-two/                            <- same structure
│       └── ...
```

### Adding a New Client

```bash
cd ~/Projects/agentic-os
bash scripts/add-client.sh "Client One"
```

This creates `clients/client-one/` with:
- Skills and scripts copied from root
- Learnings seeded from your root `context/learnings.md` (so the client starts with your accumulated knowledge, then diverges)
- Empty brand_context/, projects/, memory/ directories
- A starter CLAUDE.md for client-specific instructions
- A copy of your .env (if one exists at the root)

Then start working:

```bash
cd clients/client-one
claude
```

Claude automatically detects it's a new client and walks you through building the brand foundation. The heartbeat picks up SOUL.md and USER.md from the root, loads the client's brand context and memory, and you're ready to go.

### What Claude Sees When You Open a Client Folder

When you `cd clients/client-one && claude`:

1. **CLAUDE.md (root)** — loaded automatically via parent directory inheritance. All methodology, skill registry, heartbeat rules, context matrix.
2. **CLAUDE.md (client)** — loaded from the client folder. Client-specific instructions layered on top.
3. **context/SOUL.md** — the heartbeat reads this from the root (two directories up). Shared personality.
4. **context/USER.md** — same as SOUL.md, read from root. Your operator profile.
5. **brand_context/** — read from the client folder. This client's voice, positioning, ICP.
6. **context/memory/** — read from the client folder. This client's session history.
7. **context/learnings.md** — read from the client folder. This client's accumulated feedback.
8. **.claude/skills/** — loaded from the client folder. Skills are identical across clients but must exist locally for Claude Code to discover them.

### The Client CLAUDE.md

Each client gets its own `CLAUDE.md`. This is where you put client-specific instructions that go beyond brand context. It layers on top of the root methodology — it doesn't replace it.

Examples of what goes here:

```markdown
# Client: Client One

## Client-Specific Instructions
- This client prefers formal British English
- Always include regulatory disclaimers on financial content
- Their approval process requires draft -> review -> final versions
- Primary contact: Sarah (Marketing Director)

## Active Campaigns
- Q1 product launch — landing page + email sequence
- LinkedIn thought leadership series (weekly)
```

Leave it minimal or fill it out — either way, the root CLAUDE.md provides all the methodology.

### Updating

```bash
cd ~/Projects/agentic-os
bash scripts/update.sh
```

That's it. `update.sh` pulls the latest from upstream and automatically syncs skills, scripts, and settings to all client folders. It never touches client data (brand_context, memory, learnings, projects).

### Sharing API Keys

If all clients use the same API keys, just copy your `.env`:

```bash
cp .env clients/client-two/.env
```

The `add-client.sh` script does this automatically when creating a new client (if a root `.env` exists).

### Cron Across Clients

Each client can have its own cron dispatcher. The dispatcher name is derived from the folder path, so they don't conflict:

```bash
cd clients/client-one && bash scripts/install-crons.sh
cd clients/client-two && bash scripts/install-crons.sh
```

Manage all dispatchers:

```bash
# Install all
for dir in clients/*/; do (cd "$dir" && bash scripts/install-crons.sh); done

# Uninstall all
for dir in clients/*/; do (cd "$dir" && bash scripts/uninstall-crons.sh); done
```

---

## Scenario 3: One Business, Multiple Workstreams

One folder, multiple Claude Code windows open at the same time.

```
~/Projects/agentic-os/
├── brand_context/                  <- one brand
├── context/memory/                 <- captures all sessions
└── projects/
    ├── mkt-linkedin-carousel/      <- Window 1: marketing
    ├── str-keyword-plan/           <- Window 2: strategy
    └── ops-client-onboarding/      <- Window 3: operations
```

### When This Works

- Same brand, different tasks running in parallel
- Marketing in one window, product work in another, ops in a third
- `projects/` already separates output by category prefix — no collisions
- Memory files capture multiple sessions per day (`## Session 1`, `## Session 2`, etc.)

### When to Use Multi-Client Instead

- Genuinely different businesses or brands
- Client work where you need clean separation
- Different compliance requirements per client

---

## Session Management

### Where You Work

| Scenario | Working directory | How to start |
|----------|------------------|-------------|
| Solo / one business | `~/Projects/agentic-os/` | `cd ~/Projects/agentic-os && claude` |
| Multi-client | `~/Projects/agentic-os/clients/client-one/` | `cd ~/Projects/agentic-os/clients/client-one && claude` |

You always `cd` into the folder you're working in, then run `claude`. Everything else is picked up automatically.

### Key Commands

| Command | What it does | When to use |
|---------|-------------|-------------|
| **Onboarding** | Builds brand foundation (voice, positioning, ICP) | Runs automatically on first session per client |
| **Wrap-up** | Finalizes session block in memory, captures learnings | Runs automatically when you signal you're done |
| **/clear** | Resets Claude's context without saving | When you want a fresh start (end session first) |

### Switching Between Clients

```bash
# In your current Claude window: say "done" or "that's it" — wrap-up runs automatically

# Open a new terminal window
cd ~/Projects/agentic-os/clients/client-two
claude
```

Each window is fully isolated. Different brand context, different memory, different output. No bleed between clients.

---

## Projects

For how projects work within a workspace (single tasks, planned projects, GSD projects), see [docs/projects-guide.md](projects-guide.md).

The project system works the same whether you're in the root folder or a client folder — all paths are relative to your working directory.

---

## FAQ

**Can I share learnings across clients?**
Not automatically. Each client's `context/learnings.md` accumulates feedback tuned to that brand. When you create a new client, it starts with a copy of your root learnings so you don't lose general knowledge — but from there it diverges.

**Can I share skills across clients?**
Already handled. Skills live in the root `.claude/skills/` as the master copy. `update.sh` syncs them to all client folders automatically.

**What if I want to customize a shared skill?**
Edit it at the root level — the change propagates to all clients on the next `update.sh`. Don't edit shared skills inside a client folder; the next update will overwrite your changes.

**What if I need a skill for just one client?**
Create it directly in that client's `.claude/skills/` folder. Client-only skills (ones that don't exist at root) are preserved during updates — they won't be touched.

**Do I need separate API keys per client?**
Usually no — the same Firecrawl, OpenAI, or YouTube key works across all clients. Copy the same `.env` file. Only separate them if a client has their own API accounts.

**What if I edit CLAUDE.md at the root?**
All clients see the change immediately on their next session — parent CLAUDE.md inheritance is automatic. No syncing needed.

**What if I edit SOUL.md or USER.md?**
Edit at the root. All clients pick it up automatically — the heartbeat reads these from the root directory. If you want a different personality for one client, put a `context/SOUL.md` in that client's folder and the heartbeat will use the local copy instead.

**Where does the global `~/.claude/` fit in?**
That's Claude Code's own configuration — model defaults, plugins, MCP servers. Agentic OS lives entirely at the project level. The global config is separate and shared across all your Claude Code usage.

**Can I go back to single-client mode?**
Yes. Just work from the root folder. The `clients/` directory doesn't interfere with solo use — both modes coexist.

**How many clients can I run?**
As many as you want. Each client folder is lightweight — skills and scripts are small files, and client data (brand context, memory, output) grows modestly over time. The limiting factor is your Claude plan credits, not disk space.
