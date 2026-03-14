# Agentic OS

Turn Claude Code into your business assistant.

Agentic OS gives Claude Code personality, memory, and skills so it works like a team member, not a chatbot. It remembers your brand voice, learns your preferences over time, and runs proven methodologies instead of winging it every session.

---

## Quickstart

```bash
git clone <repo-url> my-business
cd my-business
bash scripts/install.sh
```

The installer checks your system, sets up dependencies, and lets you pick which skills to install.

When it finishes, open Claude Code and say **"start here"**. That walks you through building your brand foundation -- voice, positioning, and ideal customer profile.

---

## What You Get

Agentic OS is built on three layers:

1. **Agent Identity** -- Personality (SOUL.md), your profile (USER.md), and session memory. This is what makes it feel like working with someone who knows your business.

2. **Skills** -- Modular capabilities that can be added or removed. Each skill follows a tested methodology and gets better as you give feedback.

3. **Brand Context** -- Your voice, positioning, and ideal customer profile. Skills load only what they need, so output stays focused and on-brand.

---

## Core Skills (always installed)

| Skill | What it does |
|-------|-------------|
| `meta-skill-creator` | Build custom skills for your business |
| `meta-wrap-up` | End-of-session memory and learning capture |
| `mkt-brand-voice` | Extract your brand voice from content or build it from scratch |
| `mkt-positioning` | Find angles that make your offer stand out |
| `mkt-icp` | Define your ideal customer so every skill speaks to them |

---

## Optional Skills

| Skill | What it does | API key needed |
|-------|-------------|----------------|
| `tool-humanizer` | Strip AI patterns from any output | -- |
| `tool-firecrawl-scraper` | Scrape JS-heavy websites | `FIRECRAWL_API_KEY` |
| `tool-youtube` | Pull YouTube transcripts and channel listings | `YOUTUBE_API_KEY` (channel mode only) |
| `str-trending-research` | Research trending topics across Reddit, X, and the web | `OPENAI_API_KEY` + `XAI_API_KEY` |
| `mkt-copywriting` | Sales copy with 7-dimension scoring | -- |
| `mkt-content-repurposing` | Turn one piece of content into posts for 8 platforms | -- |
| `mkt-ugc-scripts` | Short-form video scripts with hook library | -- |
| `viz-excalidraw-diagram` | Architecture and workflow diagrams | -- |
| `viz-nano-banana` | AI image generation in 5 visual styles | `GEMINI_API_KEY` |
| `viz-ugc-heygen` | AI avatar videos via HeyGen | `HEYGEN_API_KEY` |
| `ops-cron` | Schedule recurring Claude Code tasks | -- |

---

## Managing Skills

```bash
bash scripts/list-skills.sh                  # See what's installed and available
bash scripts/add-skill.sh mkt-copywriting    # Add a skill
bash scripts/remove-skill.sh viz-nano-banana # Remove a skill
```

Dependencies are resolved automatically. If you add a skill that needs another skill, both get installed.

---

## Updating

```bash
bash scripts/update.sh
```

This pulls the latest changes from upstream -- new skills, improved methodologies, bug fixes. Your brand context, memory, projects, and API keys are never overwritten. If new skills are available, the script tells you what was added and how to install them.

---

## API Keys

Most skills work without any API keys. Some are enhanced with external services (web scraping, image generation, video creation). All keys go in your `.env` file.

To see every available key with descriptions and signup links:

```bash
cat .env.example
```

Skills will tell you when they could use a key you haven't added yet, and they always offer a fallback so your work isn't blocked.

---

## Always-On Scheduled Jobs

Want your jobs to run even when Claude Code is closed? Install the watchdog:

**Mac:**
```bash
bash scripts/install-watchdog.sh
```

**Windows (PowerShell as admin):**
```powershell
powershell scripts/install-watchdog.ps1
```

That's it. The watchdog checks your jobs every hour in the background. It runs them using your Claude plan credits -- each job has a built-in spending cap (`max_budget_usd` in the job file).

To stop it:
- **Mac:** `bash scripts/uninstall-watchdog.sh`
- **Windows:** `powershell scripts/uninstall-watchdog.ps1`

Your job files in `cron/jobs/` are never deleted -- only the background scheduler is removed.

---

## File Structure

```
├── context/           <- Your agent's identity + memory
├── brand_context/     <- Your brand data (voice, positioning, ICP)
├── .claude/skills/    <- Installed skill packs
├── cron/jobs/         <- Scheduled job definitions
├── projects/          <- All generated output
├── scripts/           <- Install, update, manage skills, watchdog
└── CLAUDE.md          <- Agent orchestration (don't edit manually)
```

---

## Your Data is Safe

These are yours and are never overwritten by updates:

- **brand_context/** -- your voice profile, positioning, ICP
- **context/** -- your memory, learnings, session history
- **projects/** -- everything the system generates for you
- **.env** -- your API keys (gitignored, never leaves your machine)

---

## Need Help?

Head to the Agentic Academy Skool community. Post your question and the team or another member will help you out.

---

Built by Simon Scrapes @ Agentic Academy
