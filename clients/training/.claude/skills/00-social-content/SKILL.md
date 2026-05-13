---
name: 00-social-content
version: 1.0.1
description: >
  Parent orchestrator for the social content pipeline. Handles seven scenarios:
  (A) finished text â†’ images only; (B) YouTube/video URL â†’ post + images;
  (C) topic or idea â†’ trending research â†’ post + images;
  (D) no input / "from my sources" â†’ scrape LinkedIn + YouTube â†’ post + images;
  (E) existing post â†’ repurpose for another platform;
  (F) article/blog/non-video URL â†’ screenshot â†’ extract â†’ post + images;
  (G) local video/audio file â†’ WhisperX transcribe â†’ post + images.
  First run triggers onboarding. See README.md for the full pipeline diagram.
  Triggers: "run social content", "generate post", "create post", "generate content",
  "post linkedin", "post instagram", "just the images", "generate image",
  "use my sources", "from my sources", "generate linkedin content".
  Repurposing triggers (â†’ mkt-content-repurposing): "adapt for", "repurpose for",
  "version for", "turn this into", "reformat for", "convert to", "create version for".
argument-hint: "[topic | URL | local file path | nothing]"
allowed-tools:
  - Bash(*)
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Agent
  - mcp__zernio__*
dependencies:
  - mkt-brand-voice
  - mkt-content-repurposing
  - str-trending-research
  - tool-humanizer
  - tool-linkedin-scraper
  - tool-publisher
  - tool-transcription
  - tool-web-screenshot
  - tool-youtube
  - viz-image-gen
metadata:
  category: marketing
  version: 2.0
  phase: orchestrator
---

# Social Content Pipeline Orchestrator

Detects scenario from trigger, routes through the right gather phase, drafts the post in the brand voice, runs humanizer, generates images via sub-agent, and writes a per-run folder with `post.yaml` + `caption.md` + image(s). Publishing is one command away.

## Input

```
/00-social-content                                    # Scenario D â€” auto-scrape
/00-social-content "topic or idea"                    # Scenario C â€” trending research
/00-social-content https://youtube.com/watch?v=...    # Scenario B â€” YouTube
/00-social-content https://example.com/article        # Scenario F â€” web page
/00-social-content /path/to/video.mp4                 # Scenario G â€” local file
/00-social-content "Generate image for this post: â€¦"  # Scenario A â€” image only
/00-social-content "Adapt this post for instagram: â€¦" # Scenario E â€” repurpose
```

## Output Directory

```
{projects_base}/00-social-content/
  {YYYY-MM-DD}/
    logs/                  <- pipeline-log.md, working data, saved transcripts/scraped posts
    {post-slug}/           <- FINAL OUTPUT (post.yaml, caption.md, image.png or slide-N.png)
  publish-log.md           <- aggregated publish history (system-wide, not per run)
```

## Configuration

Read at start, use throughout:

1. `.claude/skills/00-social-content/skill-pack/config/sys-config.md` — operational config. Extract the `## Paths` section to resolve `decoupled_base`, `env_file`, `brand_context`, `projects_base`, `output_base`. Read other sections for `image_provider`, source toggles, and publish behavior.
2. `.claude/skills/00-social-content/skill-pack/config/pipeline.config.yaml` — pipeline settings (defaults, format rules, humanizer mode, publishing mode).

See README.md for full schemas and config file locations.

## Pipeline Log

Create `{projects_base}/00-social-content/{date}/logs/pipeline-log.md` at the start. Append timestamped entries as each phase completes. Write a timing summary table after the final phase.

---

## Phase Summary

Detailed rules per phase live in `references/pipeline-phases.md`. Read it before executing.

| Phase | Action | Skipped when |
|-------|--------|--------------|
| 0 | ONBOARD â€” first-run setup | `_customized: true` AND voice-profile exists |
| 1 | CONFIG â€” load configs + brand-context guard | (always runs) |
| 2 | DETECT SCENARIO â€” A/B/C/D/E/F/G | (always runs) |
| 3 | GATHER INSPIRATION â€” scenario-specific source fetch | Scenario A skips to 7 |
| 4 | PRE-GEN BRIEFING â€” fill missing trigger fields | Scenarios A, E |
| 5 | DRAFT + FORMAT â€” voice-matched post + format decision | Scenarios A, E |
| 6 | HUMANIZER â€” remove AI tells (deep or standard) | Scenarios A, E |
| 7 | GENERATE IMAGES â€” dispatch `ssc-image-generator` | `chosen_format == "text"` |
| 8 | SAVE + PRESENT â€” write outputs, log timing, hand off to publisher | (always runs) |

Phase 1 brand-context guard: if `{brand_context}/voice-profile.md` is missing, offer to run `/mkt-brand-voice` or proceed with neutral defaults. Never block on its absence.

Phase 2 platform detection order: (1) explicit in trigger â†’ (2) `defaults.platform` from pipeline.config.yaml â†’ (3) `linkedin`.

Phase 7 style mapping (opinionâ†’color, systemâ†’technical, how-toâ†’notebook, before/afterâ†’comic, minimalâ†’mono); carousel + before/after prefers `comic`.

---

## Hard-Won Rules (Never Break These)

1. **Brand context guard runs before scenario detection.** Humanizer + image-generator both need it, even on Scenarios A and E.
2. **Always log phase timings to pipeline-log.md.** Every phase records `date +%s` bookends. The timing table is written after Phase 8.
3. **Sub-agent writes images directly to `{date}/{post-slug}/`, not `{date}/logs/`.** Working data goes to `logs/`; final output goes to `{post-slug}/`.
4. **Never skip the humanizer on a generated draft.** Even at "standard" mode it catches the worst AI tells.
5. **Carousel anchors to slide 1.** Sub-agent passes slide 1 as `--input-image` to every subsequent slide â€” never the previous slide (drift).

---

## Sub-Agent Dispatch

| Phase | Sub-Agent | Agent File | What to pass | What comes back |
|-------|-----------|------------|--------------|-----------------|
| 7 (IMAGES) | Image Generator | `.claude/agents/ssc-image-generator.md` | `post_text`, `date`, `slug`, `format`, `aspect_ratio`, `style`, `working_dir` | File paths of generated images |

---

## Self-Improvement *(after any user adjustment)*

Apply the adjustment first. Then identify the root file (voice-profile.md for tone/vocabulary/platform rules; this SKILL.md for pipeline behavior; ssc-image-generator.md for image logic; tool-humanizer/SKILL.md for humanizer behavior). Propose the permanent fix, get confirmation, then edit the file directly. Skip silently if declined.

---

## References

| File | Purpose |
|------|---------|
| `references/pipeline-phases.md` | Full per-phase rules (scenarios, draft logic, style mapping, timing) |
| `references/onboarding.md` | First-run setup guide |
| `README.md` | Pipeline Flow diagram, Output Structure, post.yaml schema |
