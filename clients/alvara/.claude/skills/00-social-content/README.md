# 00-social-content

Social content pipeline â€” from inspiration to published post. One command, seven scenarios.

> See the system-level [README](../../README.md) for full installation, configuration, and the canonical pipeline diagram.

---

## What it does

Takes whatever you have (a YouTube video, a topic, a web article, a local file, your LinkedIn feed, or a finished caption) and produces a post with images, ready to publish on LinkedIn, Instagram, Twitter, Threads, or any other platform via Zernio.

Every run is saved to `{output_base}/{YYYY-MM-DD}/{post-slug}/` with `post.yaml`, `caption.md`, and image files. Working data + per-run logs land in `{output_base}/{YYYY-MM-DD}/logs/`.

---

## Pipeline Flow

```
/00-social-content
        â”‚
        â–¼
â”Œâ”€ Phase 1: CONFIG â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  Load pipeline.config.yaml + sys-config + brand_context  â”‚
â”‚  (run /mkt-brand-voice if missing)                       â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
        â”‚
        â–¼
â”Œâ”€ Phase 2: DETECT SCENARIO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                                                           â”‚
â”‚  YouTube/video URL â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–º Scenario B     â”‚
â”‚  Topic / idea â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–º Scenario C     â”‚
â”‚  "from my sources" / empty â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–º Scenario D     â”‚
â”‚  Existing post + "adapt for X" â”€â”€â”€â”€â”€â”€â”€â”€â”€â–º Scenario E     â”‚
â”‚  Web article URL (non-video) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–º Scenario F     â”‚
â”‚  Local video/audio file â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–º Scenario G     â”‚
â”‚  Finished caption + "generate image" â”€â”€â”€â–º Scenario A     â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
        â”‚
        â–¼
â”Œâ”€ Phase 3: GATHER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  B â†’ tool-youtube transcript                              â”‚
â”‚  C â†’ str-trending-research                                â”‚
â”‚  D â†’ tool-linkedin-scraper + tool-youtube digest          â”‚
â”‚  F â†’ tool-web-screenshot + extraction                     â”‚
â”‚  G â†’ tool-transcription (WhisperX)                        â”‚
â”‚  A/E â†’ skip                                               â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
        â”‚
        â–¼ (B/C/D/F/G)
â”Œâ”€ Phase 4: BRIEFING â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  Objective Â· Format Â· Platform                            â”‚
â”‚  (skipped if all three known from trigger)                â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
        â”‚
        â–¼
â”Œâ”€ Phase 5: DRAFT + FORMAT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  Brand voice Â· Objective Â· Platform rules                 â”‚
â”‚  Decide: single image or carousel                         â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
        â”‚
        â–¼
â”Œâ”€ Phase 6: HUMANIZER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  Remove AI patterns Â· Match brand voice                   â”‚
â”‚  (deep mode if voice-profile exists, else standard)       â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
        â”‚
        â–¼
â”Œâ”€ Phase 7: GENERATE IMAGES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  Spawn ssc-image-generator sub-agent                      â”‚
â”‚  Style auto-selected from post structure                  â”‚
â”‚  Carousel slides anchor to slide 1                        â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
        â”‚
        â–¼
â”Œâ”€ Phase 8: SAVE AND PRESENT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  post.yaml Â· caption.md Â· image(s)                        â”‚
â”‚  pipeline-log.md timing table                             â”‚
â”‚  â†’ /tool-publisher {slug} when ready                      â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

---

## Scenarios

| # | You provide | What happens |
|---|-------------|--------------|
| **A** | Finished caption + "generate image" | Humanizer (optional) â†’ Images |
| **B** | YouTube or video URL (Vimeo, Loom, TikTok, etc.) | Transcript (yt-dlp) â†’ Draft â†’ Humanizer â†’ Images |
| **C** | Topic, angle, or idea | Trending research â†’ Draft â†’ Humanizer â†’ Images |
| **D** | Nothing / "from my sources" | Scrape LinkedIn + YouTube â†’ Draft â†’ Humanizer â†’ Images |
| **E** | Existing post + "adapt for X" | Routes to `/mkt-content-repurposing` â†’ Images |
| **F** | Article, blog, thread, or any non-video URL | Screenshot â†’ Extract content â†’ Draft â†’ Humanizer â†’ Images |
| **G** | Local video/audio file (.mp4, .mov, .mp3, etc.) | Transcribe (WhisperX) â†’ Draft â†’ Humanizer â†’ Images |

---

## Output Structure

```
{output_base}/
├── publish-log.md                          ← system-wide publish history
└── {YYYY-MM-DD}/                           ← one folder per run date
    ├── logs/                               ← pipeline working data
    │   ├── pipeline-log.md                 ← per-phase timing
    │   └── inspiration/                    ← saved transcripts (Scenarios B/F/G)
    └── {post-slug}/                        ← FINAL OUTPUT
        ├── post.yaml                       ← metadata
        ├── caption.md                      ← post text only
        └── image.png                       ← single image, OR
            slide-1.png, slide-2.png ...    ← carousel
```


`{output_base}` resolves from `.claude/skills/00-social-content/skill-pack/config/sys-config.md` (set by installer to `projects/00-social-content/`).

### post.yaml schema

```yaml
slug: 2026-05-01-autonomous-agents
platform: linkedin
date: 2026-05-01
status: draft                 # draft | published | failed
inspiration_source: youtube   # from_user | youtube | linkedin | linkedin,youtube | trending_research | screenshot | local_file | none
format: carousel              # single | carousel | text
slides: 4                     # carousel only
ratio: "4:5"
width: 1080
height: 1350

publish:
  status: ~
  published_at: ~
  platform_post_id: ~
  post_url: ~
  error: ~
```

---

## Required API Keys

| Key | Used for | Required? |
|-----|----------|-----------|
| `GEMINI_API_KEY` | Image generation (default) | Yes (or OpenAI) |
| `OPENAI_API_KEY` | Image generation + Reddit research | Yes (or Gemini) |
| `APIFY_API_KEY` | LinkedIn scraping | Scenario D |
| `YOUTUBE_API_KEY` | YouTube channel digest | Scenario D |
| `XAI_API_KEY` | X/Twitter research | Optional (Scenario C) |
| `SCREENSHOTONE_API_KEY` | Cloud screenshots (bot bypass, ad blocking) | Scenario F â€” falls back to local Playwright |
| `ZERNIO_API_KEY` | Publishing | `/tool-publisher` only |

---

## Dependent Skills

| Skill | Used in |
|-------|---------|
| `mkt-brand-voice` | Phase 0 onboarding, Phase 1 config check, Phase 5 draft |
| `str-trending-research` | Scenario C |
| `tool-linkedin-scraper` | Scenario D |
| `tool-youtube` | Scenarios B and D |
| `tool-web-screenshot` | Scenario F (articles, blogs, threads, any non-video URL) |
| `tool-transcription` | Scenario G (local video/audio files) |
| `tool-humanizer` | Phase 6 |
| `viz-image-gen` | Phase 7 (via ssc-image-generator) |
| `mkt-content-repurposing` | Scenario E |
| `tool-publisher` | Post-pipeline publishing |

---

## Self-Improvement

After any correction, the pipeline proposes a permanent fix to the source file (voice-profile.md, SKILL.md, or ssc-image-generator.md). Confirmed fixes are applied immediately â€” no separate logging.
