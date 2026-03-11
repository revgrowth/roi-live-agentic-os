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

- `context/` — agent & session context: it's identity, your identity and preferences, learnings from each session, memories
- `brand_context/` — your brand data: voice, positioning, ICP, samples, asset links

The first time you run `/start-here`, it creates your brand foundation:
- `brand_context/voice-profile.md` — How your brand sounds
- `brand_context/positioning.md` — Your market angle and differentiators
- `brand_context/icp.md` — Your ideal customer profile
- `brand_context/samples.md` — Gold-standard copy from real sources
- `brand_context/assets.md` — Business and personal links, handles, and visual brand references
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

### Strategy Skills

| Skill | What it does |
|-------|-------------|
| `str-trending-research` | Research what's trending in the last 30 days across Reddit, X, and the web. Uses OpenAI + xAI APIs for real engagement data (upvotes, likes, comments) with WebSearch fallback. Produces research briefs other skills consume. Adapted from [last30days by Ronnie-Nutrition](https://github.com/Ronnie-Nutrition/last30days-skill). |

### Utility Skills

| Skill | What it does |
|-------|-------------|
| `tool-firecrawl-scraper` | Web scraping backend — JS rendering, anti-bot bypass, branding extraction. Used by other skills when default tools fail |
| `tool-humanizer` | Strips AI writing patterns from text. 50+ pattern detection, human-ness scoring, voice-matched replacements. Called automatically by execution skills before saving output |
| `tool-youtube` | Fetch latest YouTube videos from channels and pull full transcripts. Two modes: channel listing (YouTube Data API) and transcript extraction (yt-dlp). Used by content repurposing as a source |

### Execution Skills

| Skill | What it does |
|-------|-------------|
| `mkt-content-repurposing` | Repurpose one piece of content into platform-native posts across LinkedIn, X, Instagram, TikTok, YouTube, Threads, Bluesky, and Reddit |
| `mkt-copywriting` | Write persuasive copy that converts — landing pages, sales pages, emails, ads, social posts. Scores on 7 dimensions with variant generation |
| `viz-excalidraw-diagram` | Generate Excalidraw diagram JSON files that argue visually — workflows, architectures, concepts, protocols. Renders to PNG via Playwright with validation loop |
| `viz-nano-banana` | Generate images and infographics via Gemini 3 Pro Image. Five styles: technical (annotated schematics), notebook (sketchnotes), comic (B&W storyboard), color (warm illustrated), mono (sketchy ink). Direct prompt or SVG blueprint mode |
| `viz-ugc-heygen` | Create UGC-style avatar videos via HeyGen API. Two modes: Video Agent (prompt-driven, one-shot) and Precise (exact script, specific avatar look + voice). Loads brand voice for scripting. Polls for completion and returns download URL |
| `mkt-ugc-scripts` | Write short-form UGC video scripts for talking-head and avatar delivery. Research-driven topic selection via trending research, 10 script frameworks, hook library. Feeds into viz-ugc-heygen for video generation |

### Operations Skills

| Skill | What it does |
|-------|-------------|
| `ops-cron` | Schedule persistent cron jobs that run Claude Code headlessly. Job files in `cron/jobs/` with YAML frontmatter, installed to system crontab. Survives reboots, no 3-day limit |

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
| `ops` | Operations / File Mgmt | `ops-client-onboarding`, `ops-gdrive-sync` |
| `viz` | Visual / Video | `viz-thumbnail-creator`, `viz-ugc-generator` |
| `acc` | Accounting | `acc-invoice-generator`, `acc-expense-tracker` |
| `meta` | System / Meta | `meta-skill-creator`, `meta-wrap-up` |
| `tool` | Utility / Integration | `tool-firecrawl-scraper` |

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
├── .env.example                       <- Template showing available keys
│
├── .claude/
│   ├── hooks_info/                    <- Hook scripts (bundled)
│   │   └── ccnotify.py                <- Native OS desktop notifications
│   │
│   ├── settings.json                  <- Permissions, hooks, MCP servers
│   ├── commands/
│   │   └── start-here.md              <- The one command you need
│   └── skills/
│       ├── mkt-brand-voice/           <- Voice extraction and building
│       ├── mkt-positioning/           <- Market angle discovery
│       ├── mkt-icp/                   <- Ideal customer profiling
│       ├── meta-wrap-up/              <- End-of-session checklist + sync
│       ├── str-trending-research/     <- Trending topic research (last 30 days)
│       │   └── scripts/              <- Python backend for Reddit/X API access
│       ├── meta-skill-creator/        <- Build new skills
│       ├── mkt-content-repurposing/    <- Content repurposing across platforms
│       ├── mkt-copywriting/           <- Persuasive copy (landing pages, emails, ads)
│       ├── tool-firecrawl-scraper/    <- Web scraping backend (Firecrawl API)
│       ├── tool-humanizer/           <- AI pattern removal + human voice restoration
│       ├── tool-youtube/            <- YouTube channel listing + transcript extraction
│       ├── viz-excalidraw-diagram/    <- Excalidraw diagram generation with render validation
│       ├── viz-nano-banana/           <- Image generation via Gemini (5 styles + SVG blueprint mode)
│       ├── viz-ugc-heygen/           <- UGC avatar video creation via HeyGen API
│       ├── mkt-ugc-scripts/         <- Short-form UGC script writing (10 frameworks + hook library)
│       ├── ops-cron/                 <- Persistent cron job scheduling
│       └── ...                        <- New skills added over time
│
├── cron/                              <- Scheduled jobs (system crontab)
│   ├── jobs/                         <- Job definitions (YAML + prompt)
│   ├── logs/                         <- Run output (gitignored)
│   └── install.sh                    <- Register/unregister with crontab
│
├── brand_context/                     <- Client brand data (version controlled)
│   ├── schemas/                       <- Data contracts for brand context
│   │   └── voice-profile.schema.json
│   ├── voice-profile.md
│   ├── positioning.md
│   ├── icp.md
│   ├── samples.md
│   └── assets.md                      <- Website, socials, handles, visual refs
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
├── references/       <- Deep knowledge, one topic per file
└── assets/           <- Example outputs, design references, templates
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

Agentic OS bundles CCNotify for desktop notifications. You get alerted
when Claude finishes a task or needs your input — no need to watch the
terminal.

**What it does:**
- Desktop notification when a task completes
- Desktop notification when Claude needs your input
- Task duration tracking
- Click-to-jump to the VS Code project

**Setup:**

The script is bundled at `.claude/hooks_info/ccnotify.py` and hooks are
pre-configured in `.claude/settings.json`. No external dependencies —
it uses native OS notifications (`osascript` on macOS, PowerShell toast
notifications on Windows 10+).

Hooks fire automatically on `UserPromptSubmit`, `Stop`, and
`Notification` events.

**Logs:** `.claude/hooks_info/ccnotify.log` (created on first run)

---

## Connected Tools (MCP Servers)

| Server | Transport | What it provides |
|--------|-----------|-----------------|
| HeyGen | stdio (`uvx heygen-mcp`) | AI avatar video generation — list avatars, voices, generate videos, check status, credits |

MCP servers are configured in `.mcp.json` at the project root. When you add a new
server, the Heartbeat detects and documents it automatically.

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
category prefix system (`ops-`, `str-`, `viz-`, `acc-`) is already in place.

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
- macOS or Windows 10+ (for desktop notifications)

**Optional:**
- API keys for connected tools added to `.env` (see `.env.example` for all available keys)
- MCP servers configured in `.claude/settings.json`
- Skills detect connected tools automatically and adapt

### External Services

Some skills use external APIs for enhanced functionality. None are required —
everything works without them, they just unlock extra features.

| Service | Key | What it adds | Without it |
|---------|-----|-------------|------------|
| [Firecrawl](https://www.firecrawl.dev) | `FIRECRAWL_API_KEY` | JS-heavy site scraping, brand asset auto-detection (logo, colors, fonts) | Falls back to WebFetch, then manual paste |
| [OpenAI](https://platform.openai.com) | `OPENAI_API_KEY` | Reddit search with real upvotes, comments, and discussion insights | Falls back to WebSearch (no engagement data) |
| [xAI](https://console.x.ai) | `XAI_API_KEY` | X/Twitter search with real likes, reposts, and reply counts | Falls back to WebSearch (no engagement data) |
| [YouTube Data API v3](https://console.cloud.google.com/) | `YOUTUBE_API_KEY` | Channel video listing, @handle resolution, video search | Transcript mode still works with direct URLs. Channel listing unavailable |
| [Google Gemini](https://ai.google.dev/) | `GEMINI_API_KEY` | Image generation via Gemini 3 Pro Image (5 visual styles) | No fallback — image generation requires the API key. Free tier available |
| [HeyGen](https://app.heygen.com) | `HEYGEN_API_KEY` | AI avatar video generation with cloned avatars and custom voices | No fallback — video generation requires the API key and HeyGen plan credits |

Copy `.env.example` to `.env` and add your keys:
```
cp .env.example .env
```

Skills will prompt you if they need a key you haven't added yet, and always
offer a fallback so work isn't blocked.

---

Built March 2026 by Simon Scrapes @ Agentic Academy
