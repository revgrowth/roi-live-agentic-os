# Pipeline Phases â€” 00-social-content

Detailed phase logic for the social content orchestrator. SKILL.md keeps the high-level summary; this file holds the full per-phase rules.

---

## Phase 0: ONBOARD (first run only)

Skip entirely if `sys-config.md` has `_customized: true` AND `voice-profile.md` exists. In sub-agent / automated context: skip silently, use saved config + defaults.

See `references/onboarding.md` for full onboarding instructions.

---

## Phase 1: CONFIG (every run)

1. Read `pipeline.config.yaml` and `.claude/skills/00-social-content/skill-pack/config/sys-config.md`. Extract: `output_base`, `defaults.platform`, `defaults.format`, `images.style`, `images.provider`, `defaults.language`.
2. **Brand context check** â€” look for `brand_context/voice-profile.md` at the project root (the working directory where Claude Code was launched).
3. If `brand_context/` doesn't exist OR `voice-profile.md` is missing â†’ **offer to run `/mkt-brand-voice` or proceed with neutral defaults.**
   - If user accepts â†’ invoke `/mkt-brand-voice` (which writes to `brand_context/voice-profile.md` at project root), then resume.
   - If user declines â†’ continue with neutral defaults; humanizer falls back to `standard` mode, image-generator skips visual_refs anchoring.
4. Print: `Environment: brand_context [loaded|missing â€” neutral mode]`

This guard runs before scenario detection â€” Scenarios A and E also benefit from brand context if available, but never block on its absence.

---

## Phase 2: DETECT SCENARIO

Platform detection order: (1) explicit in trigger â†’ (2) `defaults.platform` from pipeline.config.yaml â†’ (3) `linkedin`.

| Signal | Scenario |
|--------|----------|
| Full post text + "just the image(s)" / "generate image" | A â€” images only |
| `youtube.com/watch?v=` or `youtu.be/` URL | B â€” YouTube |
| Video URL (vimeo.com, loom.com, tiktok.com, instagram.com/reel, .mp4, etc.) | B â€” video URL |
| Local file path (`.mp4`, `.mov`, `.mp3`, `.wav`, `.m4a`, etc.) | G â€” local file |
| Any non-video URL (article, blog, thread, landing page, tweet) | F â€” web page |
| Topic, angle, or idea (no URL, no full post) | C â€” topic |
| Empty message / "from my sources" / "use my sources" | D â€” auto-scrape |
| References existing post + "adapt for" / "repurpose" / "version for" | E â€” repurpose |

Initialize `{date}/logs/pipeline-log.md` with the detected scenario, source, and start timestamp.

---

## Phase 3: GATHER INSPIRATION

**Scenario A:** store text as `post_text` â†’ skip to Phase 7.

**Scenario B:** invoke `tool-youtube` transcript mode with `{URL}`. Merge ideas into `inspiration_pool`. Save cleaned transcript to `{output_base}/{date}/logs/inspiration/{slug}.md`. If transcript fails (no captions): fall back to Scenario F using same URL. â†’ Phase 4.

**Scenario C:** check `projects/str-trending-research/` for a matching brief younger than `sources.trending_research_freshness_days` (config). If found, use it. Otherwise invoke `str-trending-research` with `{topic}`. Build `inspiration_pool` from key findings + user's topic. â†’ Phase 4.

**Scenario D:** invoke `tool-linkedin-scraper` and `tool-youtube` digest mode silently (skip on failure). Merge output into `inspiration_pool`. If empty, continue with brand_context only. â†’ Phase 4.

**Scenario E:** identify source (pasted text or `{output_base}/{date}/{slug}/caption.md`). If unclear, ask. Invoke `mkt-content-repurposing` with source + target platform(s). After it completes, offer to generate images â†’ Phase 7.

**Scenario F:** invoke `tool-web-screenshot` with `{URL}`. Read the captured screenshot â€” extract: page title, main argument, 4-6 key points, notable quotes/data. Build `inspiration_pool` from extracted content. Save to `{output_base}/{date}/logs/inspiration/{slug}.md`. â†’ Phase 4.

**Scenario G:** invoke `tool-transcription` with the local file path. Read transcript output â€” merge ideas into `inspiration_pool`. Save to `{output_base}/{date}/logs/inspiration/{slug}.md`. â†’ Phase 4.

Log Phase 3 completion in `pipeline-log.md` with elapsed seconds.

---

## Phase 4: PRE-GENERATION BRIEFING *(Scenarios B, C, D, F, G only)*

Skip items already known from the trigger. If all three are known, skip the briefing entirely.

Ask only what's missing:
> Quick briefing before I start:
> 1. **Objective** â€” teach / engage / generate leads / brand awareness / announce?
> 2. **Format** â€” carousel, single image, or text only? (or "auto")
> 3. **Platform** â€” confirm {target_platform}, or different?
>
> Say **"defaults"** to use saved preferences.

Store: `post_objective`, `chosen_format`, `target_platform`.

---

## Phase 5: DRAFT + FORMAT *(Scenarios B, C, D, F, G)*

Read `voice-profile.md` fully (tone, vocabulary, platform adaptations). Read `visual_refs/` text files if present.

**Draft rules:** declarative hook, no question openers, platform length from voice-profile, hashtags per `drafting.hashtag_strategy`, flowing paragraphs, declarative close.

**Calibrate via `post_objective`:** teach â†’ insight close; engage â†’ surprising angle; lead gen â†’ soft CTA; brand awareness â†’ conviction lead; announce â†’ announcement first + why-it-matters.

**Format decision** (override if `chosen_format` was set by user):
- Carousel if input > 250 words OR content is process / comparison / named list of 3+ / multi-moment story
- Single otherwise

Assign slug: `{YYYY-MM-DD}-{topic-slug}`. Log Phase 5 completion with elapsed seconds.

---

## Phase 6: HUMANIZER *(Scenarios B, C, D, F, G)*

Run `tool-humanizer` in pipeline mode. Mode: `deep` if voice-profile exists, `standard` otherwise (or override from `drafting.humanizer_mode`). Surface score delta only if > 2 points. Log Phase 6 with elapsed seconds.

---

## Phase 7: GENERATE IMAGES

Skip if `chosen_format == "text"`. Spawn sub-agent `subagent_type: "ssc-image-generator"`. Pass: `post_text`, `date` (run date, `YYYY-MM-DD`), `slug` (post slug), `format`, `aspect_ratio` (from voice-profile â†’ target_platform), `working_dir` (absolute), `style`:

| Post structure | Style |
|---|---|
| Opinion, announcement | `color` |
| Architecture, system, tool | `technical` |
| Educational, how-to | `notebook` |
| Before/after, story | `comic` |
| Minimalist process | `mono` |

Carousel + before/after structure â†’ prefer `comic`. If both image API keys are missing, skip and notify. Log Phase 7 with elapsed seconds.

Sub-agent writes images directly to `{output_base}/{date}/{slug}/`.

---

## Phase 8: SAVE AND PRESENT

Write to `{output_base}/{date}/{slug}/`: `post.yaml` (see README for schema), `caption.md`. Sub-agent already wrote the images.

Append the run summary to `pipeline-log.md` with the timing table:

```
| Phase | Action | Elapsed |
|-------|--------|---------|
| 1 | CONFIG | 1s |
| 2 | DETECT (Scenario {X}) | <1s |
| 3 | GATHER | {N}s |
| 4 | BRIEFING | {N}s |
| 5 | DRAFT | {N}s |
| 6 | HUMANIZER | {N}s |
| 7 | IMAGES | {N}s |
| 8 | SAVE | <1s |
| Total | | {N}s |
```

Report to the user:
```
{slug}
Platform: {platform} Â· Format: {format} Â· Source: {source}
Elapsed: {total}s

{full post text}

Saved to: {output_base}/{date}/{slug}/
Log:      {output_base}/{date}/logs/pipeline-log.md
```

Ask: "Any adjustments before publishing? When ready: `/tool-publisher {slug}`"
