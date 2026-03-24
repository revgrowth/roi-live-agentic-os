# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Heartbeat

Before doing anything else in any session:
1. **Brand context gate** — scan `brand_context/` for populated `.md` files. If none exist, this is a first-time user. Skip steps 2-9 and go straight to step 10 (which runs `/start-here` in first-run mode to build brand context). No point loading memory, scanning projects, or checking crons if the foundation isn't set up yet.
2. Read `context/SOUL.md` — who you are, how you behave. If not found (multi-client mode), read `../../context/SOUL.md` from the root.
3. Read `context/USER.md` — who you're helping and their preferences. If not found, read `../../context/USER.md` from the root.
4. Read `context/memory/{today}.md` + `context/memory/{yesterday}.md` — recent session context. Pay special attention to `### Open threads` from the last session — these are your starting point.
5. **Create or open today's memory file** — if `context/memory/{YYYY-MM-DD}.md` doesn't exist, create it with a session start timestamp. If it already exists (second session today), append a new session header. See **Daily Memory** below.
6. Flag stale brand context — anything in `brand_context/` older than 30 days: "Your [file] is from [date]. Want to refresh, or keep going?"
7. **Active projects** — scan `projects/briefs/*/brief.md` for briefs with `status: active` in frontmatter. If any found, report: *"You have N active projects: {names}."* Skip silently if none.
8. Scan `.claude/skills/` — know what skills are installed and available
9. **Sync check** — run the skill & MCP reconciliation (see below)
10. **Scheduled jobs** — check if the cron dispatcher is installed. On Mac, derive the project slug (`basename` of project dir, lowercased, non-alphanumeric replaced with `-`) and look for `~/Library/LaunchAgents/com.agentic-os.{slug}.plist`. If installed, read `cron/status/` files and report: *"Cron dispatcher is active — N enabled jobs. Last run: {job} at {time} ({result})."* If any jobs failed on their last run, flag them: *"{job} failed on last run — check logs?"* If not installed, silently note it — the dispatcher is installed automatically during `bash scripts/install.sh`. Only mention it if the user asks about cron or scheduling: *"The cron dispatcher isn't set up yet. Run `bash scripts/install-crons.sh` to enable it."*
11. **Auto start-here** — after completing the heartbeat checks above, automatically run the `/start-here` flow. Do NOT prompt the user to type it — just do it. The `/start-here` command detects state (first-run vs returning) and handles everything: first-time onboarding, session recaps, goal-setting, and work scoping. The user should never need to type `/start-here` manually — the heartbeat runs it for them. (The command still exists for manual re-invocation if needed.)

### Daily Memory

Every session writes to `context/memory/{YYYY-MM-DD}.md`. This is how continuity works across sessions.

**One file per day**, with numbered session blocks (`## Session 1`, `## Session 2`, etc.).

**At session start:** Create the file if it doesn't exist, or append a new session block if it does:
```
## Session N

### Project
[Project folder name if working on a Level 2 or 3 project — e.g., q2-product-launch. Omit for single tasks.]

### Goal
[One line — filled once the user states their goal]

### Deliverables
- `path/to/file` — what it is

### Decisions
- [Decision and rationale]

### Open threads
- [Anything unfinished for the next session]
```

When Claude reads yesterday's memory and sees a `### Project` reference, it loads `projects/briefs/{project-name}/brief.md` for full context. For Level 1 sessions (single tasks), omit the `### Project` field.

**During the session:** Update the current session block incrementally as events happen. Don't wait for wrap-up — if a deliverable is produced or a decision is made, log it immediately.

**At session end (automatic):** Wrap-up runs automatically when the user signals they're done — no need to type `/wrap-up`. Detect session-ending signals like: "thanks", "that's it", "done for today", "bye", "I'm done", "all good", "that's all", "cheers", "signing off", or any message that clearly indicates the conversation is ending. When detected, run the full `meta-wrap-up` skill (review deliverables, collect feedback, update learnings, finalise memory, commit). The `/wrap-up` command still exists for manual invocation mid-session or if the auto-detection doesn't trigger.

The wrap-up skill finalises the **existing** session block — replacing any placeholder text with real content. It does NOT create a new session block. Wrap-up completes the block that was started, not a separate one. Even without wrap-up, the file should have useful context because it was written incrementally.

Keep entries concise — bullet points, not paragraphs. This file is read at the start of every future session.

### Skill & MCP Reconciliation

Compare what's on disk against what's registered in this file. Fix any drift silently for additions; confirm with the user for removals.

**Skills — compare `.claude/skills/` folders vs the Skill Registry and Context Matrix tables above:**

1. **New skill on disk, not in CLAUDE.md?** → Read its YAML frontmatter and full SKILL.md, then:
   - Add a row to the **Skill Registry** table (under the correct category heading)
   - Add a row to the **Context Matrix** table (read `## Context Needs` from its SKILL.md)
   - Add a `## {folder-name}` section to `context/learnings.md` under `# Individual Skills`
   - Add the skill to the **README.md** skill tables and file structure diagram
   - **Scan for external service dependencies** (see below)
   - Tell the user: "Registered `{skill-name}` — added to CLAUDE.md Skill Registry, Context Matrix, README.md, and context/learnings.md."

2. **Skill in CLAUDE.md but folder missing from disk?** → Ask the user: "`{skill-name}` is in the CLAUDE.md Skill Registry but the folder is gone. Remove it from CLAUDE.md Skill Registry, Context Matrix, README.md, and context/learnings.md?"

**MCPs — compare `.claude/settings.json` MCP server entries vs a tracked list:**

3. **New MCP server in settings.json, not documented?** → Add it to the README.md under a Connected Tools section (create the section if it doesn't exist). Tell the user what was added.

4. **Documented MCP removed from settings.json?** → Ask the user: "`{mcp-name}` is documented but no longer in settings.json. Remove from README.md?"

**External service detection — runs as part of step 1 above (new skill registration):**

5. **Scan the new skill's SKILL.md and references/ for external API dependencies.** Look for:
   - Environment variable references (e.g. `FIRECRAWL_API_KEY`, `OPENAI_API_KEY`, any `*_API_KEY` or `*_SECRET` pattern)
   - API endpoint URLs (e.g. `api.firecrawl.dev`, `api.openai.com`)
   - SDK imports (e.g. `from firecrawl import`, `import openai`)
   - Explicit mentions of requiring API keys or external services

6. **For each external service found**, check if it's already documented:
   - **Not in CLAUDE.md Service Registry?** → Add a row to the **External Services & API Keys → Service Registry** table with: service name, key name, which skills use it, what it enables, fallback without it
   - **Not in `.env.example`?** → Add the key with a comment explaining the service, signup URL if found, and which skill uses it
   - **Not in README.md External Services table?** → Add a row
   - Tell the user: "Found external dependency: `{service}` (`{KEY_NAME}`). Added to Service Registry, `.env.example`, and README. Add your key to `.env` when ready — the skill works without it using [fallback]."

7. **If a skill is removed** and was the last skill using a particular service → ask the user: "`{service}` is no longer used by any skill. Remove from Service Registry, `.env.example`, and README?"

### Task Routing

When the user asks a question or requests a task:
1. **Check system operations first.** If the request matches a built-in operation (see table below), execute it directly. These are NOT skills — they're core system functions that always work.
2. **Search installed skills.** Check `.claude/skills/` frontmatter for a matching skill.
3. **Skill found** → invoke it. Always prefer the dedicated skill over base knowledge.
4. **No matching skill** → inform the user explicitly and offer the choice:
   - **(a) Find or build a skill** — search for an existing skill to install, or build one with `meta-skill-creator`, so the system handles this task well every time
   - **(b) Handle it now with base knowledge** — complete the task without a skill, understanding output won't benefit from a tested methodology or the learnings loop

Never silently fall back to base knowledge when a skill exists. Never silently handle a task without telling the user a skill gap was found.

### Built-in Operations

These are system-level commands handled by scripts — not skills. **Check these BEFORE searching skills.** Execute them directly without offering alternatives.

| User says | Action |
|-----------|--------|
| "add a client", "new client", "set up a client" | See **Add Client Flow** below. |
| "remove a skill", "uninstall {skill}" | Run `bash scripts/remove-skill.sh {skill-name}` |
| "add a skill", "install {skill}" | Run `bash scripts/add-skill.sh {skill-name}` |
| "list skills", "what skills are installed" | Run `bash scripts/list-skills.sh` |

### Add Client Flow

When the user asks to add a client:

1. **Ask for the client name** (if not already provided).
2. **Run the script:** `bash scripts/add-client.sh "{name}"`
3. **Show the user what was created and how it fits:**

```
Here's what I set up for {name}:

agentic-os/
├── clients/
│   └── {slug}/                      ← {name}'s workspace
│       ├── brand_context/           ← their voice, positioning, ICP (built on first /start-here)
│       ├── context/
│       │   ├── SOUL.md → ../../context/SOUL.md    ← inherited from root
│       │   ├── USER.md                             ← unique to this client
│       │   ├── learnings.md                        ← builds up over time for this client
│       │   └── memory/                             ← session history for this client
│       ├── projects/                               ← all outputs for this client
│       ├── cron/                                   ← scheduled jobs for this client
│       └── .claude/skills/                  ← copied from root + any client-only skills
├── CLAUDE.md                        ← shared methodology (all clients use this)
├── context/SOUL.md                  ← shared personality
└── .claude/skills/                  ← shared skills (edit once, all clients benefit)

**What's shared:** Skills, CLAUDE.md, and SOUL.md come from the root — so improvements
apply to every client automatically.

**What's unique:** Brand context, memory, learnings, USER.md, and projects are all
separate — each client gets their own voice, history, and outputs.

**Editing skills:** Always edit at the root — client copies are overwritten on
`update.sh`. Need a client-specific skill? Create it in the client's `.claude/skills/`
folder — client-only skills are preserved during updates.
```

4. **Tell them how to switch — use the full absolute path:**
> "To work with {name}, open a new terminal and run:
> `cd {absolute path to current working directory}/clients/{slug} && claude`
> On your first session there, I'll run through the brand setup automatically."
>
> Use `pwd` to get the absolute path. Never give just `cd clients/{slug}` — the user may not be in the project directory.

5. **Link to the full guide:** "For more on how multi-client works, see [docs/multi-client-guide.md](docs/multi-client-guide.md)."

### Before Major Deliverables
- Is the relevant brand_context file loaded per the context matrix below?
- Are there learnings in `context/learnings.md` for this skill's section?
- If brand_context is missing, offer to build it (the heartbeat already runs start-here automatically) — never block work because context is missing

### After Major Deliverables
- Ask: "How did this land? Any adjustments?"
- Log feedback to `context/learnings.md` under the skill's section
- If gaps were spotted, mention once with opportunity framing: "I can make this more targeted once we build your ICP profile — want to do that now or after?"

---

## What This Project Is

Agentic OS is a Claude Code project template that turns Claude into an intelligent business assistant. It is **agent-first**: personality lives in `context/SOUL.md`, user preferences in `context/USER.md`, session continuity in `context/memory/`, accumulated learnings in `context/learnings.md`, brand memory in `brand_context/`, and functionality in `.claude/skills/`.

**Every session starts automatically** — the heartbeat runs `/start-here` without the user needing to type it. Everything else is a skill that triggers automatically or gets invoked by the orchestrator.

The full specification lives in `PRD.md`. Read it when building any new component.

---

## Multi-Client Architecture

Agentic OS supports multiple clients from a single install. The root folder holds shared methodology (CLAUDE.md, SOUL.md, skills, scripts). Each client gets a subfolder under `clients/` with its own brand context, memory, projects, and learnings.

```
agentic-os/                          ← shared methodology (skills, scripts, CLAUDE.md)
├── clients/
│   ├── abc-client/                  ← ABC Client's workspace
│   │   ├── brand_context/           ← their voice, positioning, ICP
│   │   ├── context/                 ← their memory, learnings, USER.md
│   │   ├── projects/                ← their outputs
│   │   └── .claude/skills/ ← copied from root, plus any client-only skills
│   └── xyz-agency/                  ← another client
│       ├── brand_context/
│       ├── context/
│       └── projects/
├── brand_context/                   ← solo/default brand context (if not using clients/)
├── context/                         ← solo/default context
└── .claude/skills/                  ← shared skills (all clients use these)
```

**How it works:**
- `bash scripts/add-client.sh "Client Name"` creates the client workspace with the correct structure
- Each client inherits CLAUDE.md, SOUL.md, and skills from the root — edit once, all clients benefit
- Each client has its own brand_context/, context/memory/, context/learnings.md, USER.md, and projects/
- To work with a client: `cd clients/{slug} && claude` — onboarding runs automatically on first session
- Solo users don't need clients/ at all — just work from the root folder

**Skill editing rule:** Always edit shared skills at the root level — client copies are overwritten by `update.sh`. If you need a client-specific skill, create it directly in that client's `.claude/skills/` folder. Client-only skills are preserved during updates.

**When the user says "add a client":** Run the script directly (see Built-in Operations). Don't suggest cloning a new repo, creating a separate workspace, or any other approach. Multi-client is built in.

Full guide: [docs/multi-client-guide.md](docs/multi-client-guide.md)

---

## Three-Layer Architecture

| Layer | Files | Purpose |
|-------|-------|---------|
| **Agent Identity** | CLAUDE.md, `context/SOUL.md`, `context/USER.md` | Who the agent is and how it behaves |
| **Skills Pack** | `.claude/skills/{category}-{skill-name}/` | Capabilities. Grows over time. |
| **Brand Context** | `brand_context/` | Client brand data. Version controlled. |

`.env`, `.mcp.json`, `installed.json`, user data dirs (`context/memory/`, `projects/`, `brand_context/*.md`) are gitignored. See `.gitignore` for full list.

---

## Skill Categories

Every skill and its output folder uses a category prefix. This keeps skills, outputs, and learnings sections consistently named.

| Prefix | Domain | Examples |
|--------|--------|----------|
| `mkt` | Marketing | `mkt-brand-voice`, `mkt-positioning`, `mkt-icp`, `mkt-email-sequence` |
| `str` | Strategy | `str-keyword-plan`, `str-competitor-analysis` |
| `ops` | Operations / File Mgmt | `ops-client-onboarding`, `ops-gdrive-sync` |
| `viz` | Visual / Video | `viz-thumbnail-creator`, `viz-ugc-generator` |
| `acc` | Accounting | `acc-invoice-generator`, `acc-expense-tracker` |
| `meta` | System / Meta | `meta-skill-creator`, `meta-wrap-up` |
| `tool` | Utility / Integration | `tool-firecrawl-scraper` — backend tools used by other skills |

**Rules:**
- Skill folder name = `{category}-{skill-name}` in kebab-case
- YAML frontmatter `name` field must match the folder name exactly
- Output folders use the same category prefix: `projects/{category}-{output-type}/`
- Learnings sections in `context/learnings.md` use `## {folder-name}` (e.g., `## mkt-brand-voice`)
- Add new categories only when the first skill in a new domain is built

---

## Skill Registry

*Auto-populated as skills are installed. Each entry includes: name, trigger conditions, context needs.*

### Meta Skills

| Skill | Triggers on |
|-------|------------|
| `meta-skill-creator` | "create a skill", "build a skill", "new skill", "make a skill", "optimize skill description" |
| `meta-wrap-up` | "wrap up", "close session", "end session", "we're done", "session done" |

### Foundation Skills (build first — these write brand_context/)

| Skill | Triggers on | Writes to |
|-------|------------|-----------|
| `mkt-brand-voice` | "tone", "writing style", "brand voice", "how we sound" | `voice-profile.md`, `samples.md` |
| `mkt-positioning` | "differentiation", "angle", "hooks", "USP" | `positioning.md` |
| `mkt-icp` | "target audience", "buyer persona", "ideal customer" | `icp.md` |

### Strategy Skills

| Skill | Triggers on |
|-------|------------|
| `str-ai-seo` | "AI SEO", "AEO", "GEO", "LLMO", "answer engine optimization", "AI citations", "AI visibility", "optimize for ChatGPT/Perplexity/Claude", "show up in AI answers" |

*Optional skills are auto-registered by the Heartbeat reconciliation when their folders appear on disk. Install optional skills with `bash scripts/add-skill.sh <name>`. See `.claude/skills/_catalog/catalog.json` for the full list.*

*Add new skills to this table when built and registered.*

---

## Context Matrix

Which `brand_context/` files each skill reads. Load only what's listed — no skill gets more context than it needs.

| Skill | voice-profile | positioning | icp | samples | assets | learnings |
|-------|:---:|:---:|:---:|:---:|:---:|:---:|
| `mkt-brand-voice` | **writes** | summary | — | **writes** | **writes** (via firecrawl branding) | `## mkt-brand-voice` |
| `mkt-positioning` | — | **writes** | full | — | — | `## mkt-positioning` |
| `mkt-icp` | — | summary | **writes** | — | — | `## mkt-icp` |
| `meta-wrap-up` | — | — | — | — | — | `## meta-wrap-up` |
| `str-ai-seo` | tone only | summary | full | — | — | `## str-ai-seo` |

*Optional skills auto-add their row here via Heartbeat reconciliation when installed. New skills declare their own row when added.*

**Matrix key:** `writes` = creates file | `full` = entire file | `summary` = 1-2 sentences | `angle only` = chosen angle | `tone only` = tone + vocabulary | `language section` = words-they-use section | `## skill-name` = read only that section from context/learnings.md | `—` = don't load

**Learnings rule:** Every skill reads and writes to its own section in `context/learnings.md`. Section headings match the skill's folder name exactly (e.g., `## mkt-brand-voice`). Cross-skill insights go under `# General` (`## What works well` / `## What doesn't work well`). Skill-specific entries go under `# Individual Skills` → `## {folder-name}`.

---

## Output Standards

- **Single tasks (Level 1):** Save to `projects/{category}-{output-type}/`. The category prefix matches the skill's category (e.g., `mkt-brand-voice` skill → `projects/mkt-*/` outputs). Folder naming: `{category}-{output-type}` in kebab-case (e.g., `mkt-linkedin-carousel`, `str-keyword-plan`).
- **Planned/GSD projects (Level 2/3):** Save ALL outputs inside the project folder — `projects/briefs/{project-name}/`. Never scatter project outputs across category folders.
- Filename format: `{descriptive-name}_{YYYY-MM-DD}.md` (folder provides context, no skill-name prefix needed)
- Folders are created on first use by the skill. No empty pre-scaffolding.
- Default format: markdown unless user specifies otherwise
- After major deliverables: ask for feedback, log to `context/learnings.md`
- **Auto-download binary outputs.** After saving any non-markdown file (PNG, PDF, SVG, video, JSON diagrams, etc.), copy it to `~/Downloads/` using `cp <filepath> ~/Downloads/`. This applies to all skills — the user should never have to manually navigate to a generated file.
- **Show clickable file path.** After saving any output, show the user the full absolute file path so they can click it directly to open the file. Example: "Saved to `/Users/simoncoton/Desktop/agentic-os/projects/mkt-copywriting/landing-page_2026-03-14.md`". This applies to all skills — the user should never have to navigate to find what was just created.

### Projects

Work scopes into three levels. The level determines where output goes and how much planning happens upfront.

| Level | Name | When | Where |
|-------|------|------|-------|
| **1** | Single task | One or a few small deliverables, no project scoping needed | `projects/{category}/` |
| **2** | Planned project | Multi-deliverable work that benefits from a brief — campaigns, launches, client deliverables | `projects/briefs/{project-name}/` |
| **3** | GSD project | Complex multi-phase work with dependencies and milestones | `projects/briefs/{project-name}/` + `.planning/` |

**Level 1 (single tasks):** Just ask Claude. Output goes to category folders — `projects/{category}-{type}/{name}_{date}.md`. Use Shift+Tab twice for plan mode if upfront thinking helps, but output still goes to category folders.

**Level 2 (planned projects):** The project gets its own folder under `projects/briefs/` with a `brief.md`. Run an interactive scoping conversation to define the project: goal, deliverables, acceptance criteria, timeline, constraints. Save as `brief.md` inside the project folder. ALL outputs for that project go inside the project folder, not in category folders. Projects are listed most-recent-first (by `created` date in frontmatter) when reporting to the user.

```
projects/briefs/kanban-dashboard/
├── brief.md                         ← project scope, deliverables, acceptance criteria
├── landing-page_2026-03-24.md
├── email-sequence_2026-03-25.md
└── competitor-scan_2026-03-22.md
```

When creating a Level 2 brief, cover: project goal (one sentence), deliverables (checklist), acceptance criteria (how you'll know it's done), timeline/constraints, and any dependencies. Keep it to one page — this is a working document, not a formal PRD.

**Level 3 (GSD projects):** Same as Level 2 (project folder under `projects/briefs/` with `brief.md` + outputs), but GSD's `.planning/` directory lives at the project root (hardcoded across 50+ references). The brief links to `.planning/`.

```
projects/briefs/website-rebuild/
├── brief.md                         ← links to .planning/
├── homepage-copy_2026-03-24.md
└── sitemap_2026-03-25.excalidraw

.planning/                           ← GSD artifacts (at project root, not inside projects/)
├── PROJECT.md
├── ROADMAP.md
└── phases/
```

**One GSD project at a time per workspace.** `.planning/` is shared — finish or archive one before starting another. When complete, run `/archive-gsd` to move `.planning/` into the project folder and mark the brief as complete. If a user tries to start a new GSD project while `.planning/` exists, offer to run `/archive-gsd` first.

**How to tell folders apart:** Category folders live directly under `projects/` using `{category}-{type}` naming (e.g., `projects/mkt-copywriting/`) — no `brief.md` inside. Project folders live under `projects/briefs/` using descriptive names (e.g., `projects/briefs/kanban-dashboard/`) — always have a `brief.md`. When listing projects for the user, sort by `created` date in frontmatter, most recent first.

**Brief frontmatter format:**
```yaml
---
project: q2-product-launch
status: active
level: 2
created: 2026-03-24
---
```

### Humanizer Gate

**Every skill that produces publishable text must run its output through `tool-humanizer` as a final step before saving.** This is not optional.

- Execution skills (copywriting, content repurposing, email sequences, blog posts, etc.) call the humanizer in pipeline mode after generating content
- The humanizer uses `deep` mode when `brand_context/voice-profile.md` exists, `standard` mode otherwise
- Only show the score summary to the user if the change was significant (delta > 2 points)
- Skills that produce non-publishable output (research briefs, ICP profiles, positioning docs) skip this step

When building new skills, include a humanizer step in the methodology if the skill writes content meant for an audience. Reference `tool-humanizer` in pipeline mode.

---

## Building New Skills

**Always ask for reference skills first.** Never guess at methodology — the user provides examples, Claude Code learns the pattern, then scaffolds. Use the `meta-skill-creator` skill to scaffold and iterate.

### Skill structure
```
.claude/skills/{category}-{skill-name}/
├── SKILL.md          ← YAML frontmatter + methodology (~200 lines max)
├── references/       ← Depth material, one topic per file (~200-300 lines each)
├── scripts/          ← Executable scripts including setup.sh for auto-install (optional)
└── assets/           ← Example outputs, design references, templates (optional)
```

### Auto-Setup Convention

Skills that need external binaries (e.g. `uv`, `yt-dlp`, `ffmpeg`) must include a `scripts/setup.sh` that auto-detects and installs them. The SKILL.md should include a **Step 0: Auto-Setup** that runs this script before any other operation.

**Rules:**
- The setup script checks `command -v` first — never reinstall what already exists
- Uses `brew` on macOS if available, falls back to `curl`/`pip`/other package managers
- Reports clear success/failure per dependency
- Only runs once per machine — skip on subsequent calls if all binaries are present
- Never requires user interaction (no prompts, no sudo unless absolutely necessary)

### YAML frontmatter rules
- ~100 words, under 1024 characters
- Include trigger phrases AND negative triggers
- No XML angle brackets

### Skill Dependencies

Skills can depend on other skills. Declare dependencies in a `## Dependencies` section in SKILL.md so the system knows what's needed.

```markdown
## Dependencies

| Skill | Required? | What it provides | Without it |
|-------|-----------|-----------------|------------|
| `tool-youtube` | Optional | YouTube transcript fetching | Ask user to paste content manually |
```

**Rules:**
- **Required** dependencies must be installed for the skill to function at all
- **Optional** dependencies enhance the skill but it works without them — always declare the fallback
- At session start, if a skill is invoked and a required dependency is missing, tell the user which skill to install
- Dependencies are one-way — utility (`tool-`) skills never depend on execution skills

### Registration checklist
- [ ] Folder name = `{category}-{skill-name}` matching the Skill Categories table
- [ ] `name` field in frontmatter matches the folder name exactly
- [ ] Add to skill registry table above
- [ ] Add row to context matrix above
- [ ] Frontmatter < 1024 chars
- [ ] SKILL.md < 200 lines
- [ ] References are self-contained
- [ ] If the skill depends on other skills: add a `## Dependencies` section to SKILL.md
- [ ] Declare which `projects/` subfolder(s) the skill writes to (must use same category prefix)
- [ ] **External services**: If the skill uses any external API, ensure the key is in the Service Registry (CLAUDE.md), `.env.example`, and README.md External Services table. The reconciliation does this automatically, but verify it ran.
- [ ] **Humanizer gate**: If the skill produces publishable text (blog posts, social content, copy, emails), include a step that runs output through `tool-humanizer` in pipeline mode before saving

### Folder naming
- Format: `{category}-{skill-name}` in kebab-case (e.g., `mkt-brand-voice`, `ops-client-onboarding`)
- Cannot contain "claude" or "anthropic"

---

## Graceful Degradation

Skills work at all context levels:
- **No brand_context/**: Standalone mode — ask what's needed, produce solid generic output
- **Partial**: Use what exists, default for the rest
- **Full**: Fully personalised

Brand context **enhances**. It never gates functionality.

---

## External Services & API Keys

Some skills use external services for enhanced functionality. API keys are stored in `.env` (gitignored). `.env.example` documents all available keys.

### Service Registry

| Service | API Key | Used by | What it enables | Without it |
|---------|---------|---------|----------------|------------|
| Firecrawl | `FIRECRAWL_API_KEY` | `tool-firecrawl-scraper`, `mkt-brand-voice` (Auto-Scrape) | JS-heavy site scraping, anti-bot bypass, brand asset extraction (logo, colors, fonts) | Falls back to WebFetch (free). If that also fails, asks user to paste content manually |
| OpenAI | `OPENAI_API_KEY` | `str-trending-research` | Reddit search via Responses API with `web_search` tool — real upvotes, comments, top comment insights | Falls back to WebSearch (free, no engagement metrics) |
| xAI | `XAI_API_KEY` | `str-trending-research` | X/Twitter search via xAI API with `x_search` tool — real likes, reposts, reply counts | Falls back to WebSearch (free, no engagement metrics) |
| YouTube Data API v3 | `YOUTUBE_API_KEY` | `tool-youtube` | Channel video listing, @handle resolution, search | Transcript mode still works with direct URLs (free via yt-dlp). Channel listing unavailable |
| Google Gemini | `GEMINI_API_KEY` | `viz-nano-banana` | Image generation via Gemini 3 Pro Image | No fallback — image generation requires the API key. Free tier available |
| HeyGen | `HEYGEN_API_KEY` | `viz-ugc-heygen` | AI avatar video generation with cloned avatars and custom voices | No fallback — video generation requires the API key and HeyGen plan credits |

*Add new services to this table and to `.env.example` when skills are built that use them.*

### Rules for Skills Using External Services

1. **Check before using.** Before calling any external API, check `.env` for the required key. Never assume it's there.
2. **Tell the user what they're missing.** If the key is absent, explain clearly:
   - What the service does
   - What they'll miss without it
   - How to get a key (signup URL, free tier info)
   - Where to put it: "Add `KEY_NAME=your-key` to your `.env` file"
3. **Always have a fallback.** No skill should break because an API key is missing. Degrade gracefully — use free tools first, then prompt for the key only when the free path fails.
4. **Don't block work.** If the fallback produces usable (even if less rich) output, proceed and note what would improve with the API key.
5. **Update `.env.example`** when adding a new external service dependency.

---

## Permissions

`.claude/settings.json` allows: `cat`, `ls`, `npm run *`, basic git commands, edits to `/src/**`

Denied: package installs, `rm`/`curl`/`wget`/`ssh`, reading `.env`/`.env.local` or credential files. `.env.example` is readable and editable (it's a template, not secrets).
