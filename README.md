# Agentic OS

A self-maintaining operating system for your business. Built on Claude Code,
powered by skills that learn your brand, remember your context, and get
sharper with every session.

Designed for founders, solo marketers, and small teams who need senior-level
output without the senior-level headcount.

---

## Quick Start

```
/start-here
```

That is the only command you need. The orchestrator scans your project, asks
a few questions, builds your brand foundation, and routes you to the right
skill for whatever you are working on.

---

## How It Works

### Skill-First Routing

When you ask for anything, the system checks installed skills first. If a
matching skill exists, it runs automatically. If no skill covers the task,
you are told upfront and given the choice:

- **(a) Find or build a skill** — so the system handles this well every time
- **(b) Handle it now** — using base knowledge, no skill needed

This means gaps are surfaced, not silently worked around. Over time, every
repeated task earns its own skill.

### Brand Memory

Two folders hold everything the system knows about you:

- `brand_context/` — your brand data: voice, positioning, ICP, samples
- `context/` — agent state: identity, preferences, learnings, session logs

The first time you run `/start-here`, it creates your brand foundation:
- `brand_context/voice-profile.md` — How your brand sounds
- `brand_context/positioning.md` — Your market angle and differentiators
- `brand_context/icp.md` — Your ideal customer profile
- `brand_context/samples.md` — Gold-standard copy from real sources
- `context/learnings.md` — Performance feedback that makes future output sharper

Skills only load the brand files they need. Selective context keeps output
focused and specific.

### Learnings Loop

`context/learnings.md` is the system's long-term feedback memory. After
major deliverables, skills ask how the output landed. Responses are logged
under the skill's own section. Every skill reads its learnings before
running — the more you use it, the better it matches your preferences.

### Self-Maintenance

Agentic OS keeps itself in sync. You never need to manually update
registry files or remember to register a new skill.

**Heartbeat (every session start):**
The agent scans `.claude/skills/` and `.claude/settings.json`, then
compares what's on disk against what's documented in CLAUDE.md and
README.md.

- New skill folder found → auto-registered in CLAUDE.md (Skill Registry,
  Context Matrix), README.md, and `context/learnings.md`
- Registered skill missing from disk → asks you before removing
- New MCP server in settings → documented in README.md
- Documented MCP removed → asks you before removing

**Wrap-up (every session end):**
The same sync runs again before committing, catching anything that changed
mid-session. Skills that were built, modified, or removed during the
session are reconciled automatically.

**Skill ecosystem awareness:**
When building a new skill, the system reads every installed skill's
frontmatter first. It maps overlaps, upstream dependencies, downstream
consumers, and trigger conflicts — so new skills fit cleanly into the
existing ecosystem rather than duplicating or colliding with what's
already there.

---

## Skills

### Foundation Skills

These run first. They build your brand memory so every skill that follows
writes like you, for your audience, with your angle.

| Skill | What it does |
|-------|-------------|
| `mkt-brand-voice` | Extracts or builds a voice profile so every piece of content sounds like you |
| `mkt-positioning` | Finds the market angle that makes your offer stand out and sell |
| `mkt-icp` | Maps your ideal customer — their pain, language, objections, and buying triggers |

### Meta Skills

| Skill | What it does |
|-------|-------------|
| `meta-skill-creator` | Build, test, and validate new skills — extend the system for any domain |
| `meta-wrap-up` | End-of-session checklist: feedback, learnings, sync, commit |

### Skill Categories

Every skill uses a category prefix that matches its output folder.

| Prefix | Domain | Examples |
|--------|--------|----------|
| `mkt` | Marketing | `mkt-brand-voice`, `mkt-positioning`, `mkt-email-sequence` |
| `str` | Strategy | `str-keyword-plan`, `str-competitor-analysis` |
| `ops` | Operations | `ops-client-onboarding`, `ops-invoice-generator` |
| `vid` | Video / Visual | `vid-thumbnail-creator`, `vid-ugc-generator` |
| `meta` | System / Meta | `meta-skill-creator`, `meta-wrap-up` |

New categories are added when the first skill in a new domain is built.
The architecture supports unlimited skills across any domain.

---

## Projects

Output is organised by category, not by skill. Each output type gets its
own folder inside `projects/`:

```
projects/
├── mkt-landing-page/        <- Landing pages and sales pages
├── mkt-email-sequence/      <- Email flows
├── mkt-blog-post/           <- SEO articles
├── str-keyword-plan/        <- Keyword research
└── ...                      <- Folders created on first use
```

---

## File Structure

```
agentic-os/
├── CLAUDE.md                          <- System instructions, skill registry,
│                                         context matrix, self-maintenance rules
│
├── context/                           <- Agent, user, and session state
│   ├── SOUL.md                        <- Agent identity and behaviour
│   ├── USER.md                        <- Your preferences (built by /start-here)
│   ├── MEMORY.md                      <- Long-term business knowledge
│   ├── learnings.md                   <- Skill performance feedback
│   └── memory/                        <- Daily session logs (YYYY-MM-DD.md)
│
├── .env                               <- API keys (gitignored)
│
├── .claude/
│   ├── settings.json                  <- Permissions, hooks, MCP servers
│   ├── commands/
│   │   └── start-here.md              <- The one command you need
│   └── skills/
│       ├── mkt-brand-voice/           <- Voice extraction and building
│       ├── mkt-positioning/           <- Market angle discovery
│       ├── mkt-icp/                   <- Ideal customer profiling
│       ├── meta-wrap-up/              <- End-of-session checklist + sync
│       ├── meta-skill-creator/        <- Build new skills
│       └── ...                        <- New skills added over time
│
├── brand_context/                     <- Client brand data (version controlled)
│   ├── schemas/                       <- Data contracts for brand context
│   │   └── voice-profile.schema.json
│   ├── voice-profile.md
│   ├── positioning.md
│   ├── icp.md
│   └── samples.md
│
└── projects/                          <- Everything the system produces
    └── {category}-{output-type}/
        ├── 00-schemas/                <- Output-specific schemas (when needed)
        └── {name}_{YYYY-MM-DD}.md     <- Generated content
```

---

## Extending the System

Agentic OS is built to grow. The `meta-skill-creator` skill scaffolds new
skills that follow the architecture automatically.

Every skill is a self-contained folder:
```
.claude/skills/{category}-{skill-name}/
├── SKILL.md          <- Instructions (~200 lines max)
└── references/       <- Deep knowledge, one topic per file
```

Skills work at any context level:
- **No brand context** — standalone mode, solid generic output
- **Partial context** — uses what exists, defaults for the rest
- **Full context** — fully personalised to your brand

Brand context enhances. It never gates.

### Schemas

Schemas validate structured data and live next to what they describe:

| What it validates | Where the schema lives |
|-------------------|----------------------|
| Brand context data | `brand_context/schemas/` |
| Output files | `projects/{folder}/00-schemas/` |

Not every output needs a schema. They are created when structured,
repeatable data contracts are useful for downstream automation.

---

## Notifications

Agentic OS includes [CCNotify](https://github.com/dazuiba/CCNotify) for
desktop notifications. You get alerted when Claude finishes a task or
needs your input — no need to watch the terminal.

**What it does:**
- Desktop notification when a task completes
- Desktop notification when Claude needs your input
- Task duration tracking
- Click-to-jump to the VS Code project

**Setup:**

CCNotify is pre-configured in this project. To install on a fresh machine:

```bash
# 1. Install the notification dependency
brew install terminal-notifier

# 2. Set up the notify script
mkdir -p ~/.claude/ccnotify
cp ccnotify.py ~/.claude/ccnotify/ccnotify.py
chmod a+x ~/.claude/ccnotify/ccnotify.py

# 3. Verify it works
~/.claude/ccnotify/ccnotify.py   # Should output: ok
```

The hooks in `~/.claude/settings.json` handle the rest automatically.
Notifications fire on `UserPromptSubmit`, `Stop`, and `Notification`
events.

**Logs:** `~/.claude/ccnotify/ccnotify.log`

---

## FAQ

**How do I update my brand voice after it's set?**
Just talk about voice again. The skill detects the existing profile, shows
a summary, and offers targeted updates — adjust tone, update vocabulary,
add new samples, or full rebuild.

**How do I see my project status?**
Run `/start-here` at any time. It scans everything, shows what exists,
identifies gaps, and recommends the highest-impact next action.

**Can I edit the output files manually?**
Yes. Everything is human-readable markdown. Edit freely. Skills check for
existing files before overwriting and will show a diff before replacing
anything.

**Can I build skills for non-marketing work?**
Yes. The architecture is domain-agnostic. Use `meta-skill-creator` to build
skills for operations, sales, client onboarding, or anything else. The
category prefix system (`ops-`, `str-`, `vid-`) is already in place.

**What happens when I add a skill manually?**
Drop the folder into `.claude/skills/` and start a new session. The
Heartbeat detects it automatically and registers it across CLAUDE.md,
README.md, and context/learnings.md. No manual registration needed.

**What happens when I add an MCP server?**
Add it to `.claude/settings.json` and start a new session. The Heartbeat
picks it up and documents it in README.md.

---

## System Requirements

**Required:**
- Claude Code (Claude's official CLI)
- macOS (for CCNotify desktop notifications)

**Optional:**
- API keys for connected tools added to `.env`
- MCP servers configured in `.claude/settings.json`
- Skills detect connected tools automatically and adapt

---

Built March 2026 by Simon Scrapes @ Agentic Academy
