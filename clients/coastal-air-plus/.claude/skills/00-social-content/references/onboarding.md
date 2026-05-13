# Onboarding â€” Social Content Pipeline

## What This Does

Takes whatever you have (a YouTube video, a topic, a web article, a local file, or your existing LinkedIn/YouTube feed) and produces a platform-native social post with images â€” drafted in your voice, humanized, and ready to publish on LinkedIn, Instagram, Twitter, Threads, and 10+ other platforms via Zernio. After the first-run setup below, every subsequent run is fully automated.

## Inputs

| Input | Required | Example | Scenario |
|-------|----------|---------|----------|
| YouTube/video URL | Either | `https://youtube.com/watch?v=abc` | B |
| Topic or idea | Either | `"why most ai agents fail in production"` | C |
| Nothing / "from my sources" | Either | (empty) | D |
| Web article URL | Either | `https://example.com/post` | F |
| Local video/audio file | Either | `/path/to/video.mp4` | G |
| Finished caption + "generate image" | Either | `"My post: ... â€” generate image"` | A |
| Existing post + "adapt for X" | Either | `"adapt this for instagram: ..."` | E |

## Outputs

| What | Where | Format |
|------|-------|--------|
| Final post folder | `projects/00-social-content/{YYYY-MM-DD}/{post-slug}/` | `post.yaml` + `caption.md` + `image.png` (or `slide-N.png`) |
| Pipeline log | `projects/00-social-content/{YYYY-MM-DD}/logs/pipeline-log.md` | Markdown with phase timing table |
| Inspiration archive | `projects/00-social-content/{YYYY-MM-DD}/logs/inspiration/` | Saved transcripts, scraped posts, screenshot extracts |
| Published post | Platform-dependent (when `/tool-publisher` is run) | Live URL or draft URL in Zernio |

## How It Works (Phases)

1. **Config** â€” Reads `pipeline.config.yaml` and `.claude/skills/00-social-content/skill-pack/config/sys-config.md`. Verifies brand voice exists.
2. **Detect Scenario** â€” Inspects the trigger and routes to one of A-G (URL, topic, file, etc.).
3. **Gather Inspiration** â€” Transcript (B/G), trending research (C), feed scraping (D), or screenshot extraction (F).
4. **Briefing** â€” One-shot question for objective, format, and platform â€” only what wasn't in the trigger.
5. **Draft + Format** â€” Voice-matched post; carousel vs. single decided from content shape.
6. **Humanizer** â€” Strips AI tells, matches brand voice (deep mode if voice-profile exists).
7. **Generate Images** â€” Sub-agent (`ssc-image-generator`) renders single or 3-5 slide carousel via Gemini or OpenAI. Carousel slides anchor to slide 1 for visual consistency.
8. **Save and Present** â€” Writes `post.yaml`, `caption.md`, image files, plus a `pipeline-log.md` timing table. Asks if you want to publish.

End-to-end: typically 2-5 minutes for a single post, 4-8 minutes for a carousel.

## Checkpoints

**First run only:** Interactive onboarding (this guide) walks you through brand voice, API keys, and preferences. Takes ~5 minutes. Sets `_customized: true` in `sys-config.md` so subsequent runs skip onboarding.

**Every run:** Two pause points â€” Phase 4 briefing (skipped if all three answers are in the trigger), and Phase 8 review before publishing. Everything else runs automatically.

**Scenario E (repurpose):** Routes to `/mkt-content-repurposing`, which has its own per-platform review.

## Setup Checklist

### Step O1 â€” Show what I can do

The orchestrator surfaces the 7 scenarios in a single table on first run:

```
What you give me              â†’ What I produce
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
A YouTube/video URL           â†’ Transcript â†’ Post + Images       (B)
A topic or idea               â†’ Trend research â†’ Post + Images   (C)
Nothing / "from my sources"   â†’ Scrape feed â†’ Post + Images      (D)
A web article URL             â†’ Screenshot extract â†’ Post + Imgs (F)
A local video/audio file      â†’ Transcribe â†’ Post + Images       (G)
Finished caption + "image"    â†’ Images only                      (A)
Existing post + "adapt for X" â†’ Repurpose for platform           (E)
```

### Step O2 â€” Check API keys

Reads `.env` if it exists. Shows a status line for each key:

```
API Keys status:
âœ“/âœ— GEMINI_API_KEY        â€” image generation (primary)
âœ“/âœ— OPENAI_API_KEY        â€” image generation (alt) + Reddit research
âœ“/âœ— APIFY_API_KEY         â€” Scenario D: scrape LinkedIn
âœ“/âœ— YOUTUBE_API_KEY       â€” Scenario D: YouTube digest
âœ“/âœ— XAI_API_KEY           â€” Scenario C: X/Twitter trending
âœ“/âœ— SCREENSHOTONE_API_KEY â€” Scenario F: cloud screenshots (optional)
âœ“/âœ— ZERNIO_API_KEY        â€” publishing via /tool-publisher
```

For any missing key: "You can add it to `.env` anytime. Let's continue with what you have."

### Step O3 â€” Brand voice setup

Tell the user:
> "Now let's capture your brand voice â€” this makes every post sound like you, not AI."

Invoke `mkt-brand-voice`. After it completes, confirm: "Brand voice saved âœ“"

### Step O4 â€” Set preferences

Use `AskUserQuestion` to ask **one preference at a time**. After each answer, run the conditional dependency check before moving to the next.

**Q1 â€” Default platform**
- options: `linkedin`, `instagram`, `twitter`, `threads`
- default: `linkedin`
- check: if `instagram`/`twitter`/`threads`, verify `ZERNIO_API_KEY` is in `.env`

**Q2 â€” Language**
- options: `pt-BR`, `en`, `es`, `other`
- default: `pt-BR`
- if `other`: ask which language via plain-text follow-up

**Q3 â€” Default format**
- options: `auto` (decide from content), `carousel`, `single`, `text`
- default: `auto`

**Q4 â€” Image style**
- options: `technical`, `notebook`, `comic`, `color`, `mono`
- default: `color`
- preview if available: `projects/00-social-content/examples/image-style/{style}.png`

### Step O5 â€” Save and confirm

Write pipeline behaviour answers to `pipeline.config.yaml` and operational/path answers to `.claude/skills/00-social-content/skill-pack/config/sys-config.md`. Set `_customized: true` in `sys-config.md`. Tell the user:

> "All set! Saved:
> Platform: {platform} Â· Language: {language} Â· Format: {format} Â· Style: {style}
>
> Edit anytime in `.claude/skills/00-social-content/skill-pack/config/pipeline.config.yaml`
>
> Ready. Try: `/00-social-content` â€” give me a topic, a URL, or just say 'from my sources'."

### Conditional dependency map

| User choice | Requires | How to check | What to tell them |
|-------------|----------|--------------|-------------------|
| Platform: instagram/twitter/threads | `ZERNIO_API_KEY` | grep `.env` | zernio.com to get key â†’ add to `.env` |
| Format: carousel/single | `GEMINI_API_KEY` or `OPENAI_API_KEY` | grep `.env` | need at least one image key |
| Source mode: "from my sources" | `APIFY_API_KEY` + `YOUTUBE_API_KEY` | grep `.env` | both keys for full Scenario D |

## Configuration Files

After first-run onboarding, your choices live in two places:

```
Pipeline config (technical â€” image provider, sources, publishing mode):
  .claude/skills/00-social-content/skill-pack/config/pipeline.config.yaml

Operational config (output paths, source toggles):
  .claude/skills/00-social-content/skill-pack/config/sys-config.md

Brand voice:
  brand_context/voice-profile.md
```

All three files have inline comments. Edit them anytime to change defaults for future runs.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| "Voice profile missing" | Run `/mkt-brand-voice` â€” onboarding will resume after |
| "Both image keys missing" | Add `GEMINI_API_KEY` or `OPENAI_API_KEY` to `.env` |
| Scenario B fails (no transcript) | Pipeline auto-falls back to Scenario F (screenshot) |
| Scenario D returns nothing | Check `tool-linkedin-scraper/config/sources.md` and `tool-youtube/config/sources.md` |
| Scenario G fails (transcription) | Verify `python3` + `whisperx` available; install ffmpeg if missing |
| Images come out off-brand | Update `brand_context/assets.md` and add reference images to `brand_context/visual_refs/` (both at project root) |
| Carousel slides drift visually | Sub-agent always anchors to slide 1; if drifting, regenerate slide 1 first |
| `/tool-publisher` says "MCP not connected" | Copy `.mcp.example.json` â†’ `.mcp.json`, set `ZERNIO_API_KEY` in `.env`, restart Claude Code |
