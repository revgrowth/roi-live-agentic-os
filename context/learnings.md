# Learnings Journal

> Auto-maintained by Agentic OS skills. Newest entries at the bottom of each section.
> Skills append here after deliverable feedback. Never delete entries.
> Section headings match skill folder names exactly. New skills add their own section when created.
> Skills read only their own section before running. Cross-skill insights go in `general`.

# General
## What works well

## What doesn't work well

- 2026-03-11: Skills were inconsistently saving outputs — some to /tmp, some not at all. Audited all 14 and fixed tool-youtube and viz-nano-banana. Strengthened meta-skill-creator to enforce output saving as non-optional for all new skills.


# Individual Skills
## mkt-brand-voice

## mkt-positioning

## mkt-icp

## tool-firecrawl-scraper

## tool-humanizer

## mkt-content-repurposing

## mkt-copywriting

## viz-excalidraw-diagram

## tool-youtube

## str-trending-research

## viz-nano-banana

## viz-ugc-heygen

- 2026-03-10: MCP `generate_avatar_video` tool doesn't support dimensions, captions, or background config. Always use precise API (`POST /v2/video/generate` via python3 urllib) for platform-specific content. MCP tool only good for quick defaults.
- 2026-03-10: MCP `get_remaining_credits` and `get_voices` have Pydantic validation bugs — some HeyGen responses have null/s3 URLs that fail validation. Use direct API via python3 as fallback.
- 2026-03-10: `MOVIO_PAYMENT_INSUFFICIENT_CREDIT` error — check credits before generating. Credits endpoint also buggy via MCP, use direct API.
- 2026-03-10: HeyGen video URLs are signed and expire quickly. Always download the MP4 immediately after generation completes. Save to `projects/viz-ugc-heygen/` as `.mp4` alongside the metadata `.md` file.
- 2026-03-10: Always use `video_url_caption` (not `video_url`) — captions baked in by default per user preference.

## mkt-ugc-scripts

- 2026-03-10: Scripts must be spoken-words-only (no timestamps, no stage directions) for HeyGen compatibility. Use SSML `<break time="Xs"/>` sparingly. On-screen text goes in a separate section after the script body.
- 2026-03-10: Personal experience framing works better than teaching/selling. "I will never use X again because..." beats "Stop using X. Here's why." Reference script saved in assets/ as quality bar.
- 2026-03-10: Max 90s duration. Every script ends with soft Skool CTA (vary phrasing across batches).

## ops-cron

## meta-wrap-up

- 2026-03-10: Daily memory file was created by heartbeat with placeholder text and wrap-up didn't replace it. Fixed Step 3c to require real content and never leave placeholders. Also standardised on one file per day with `## Session N` blocks instead of per-session files.
