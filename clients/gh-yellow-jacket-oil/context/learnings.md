<!--
  Canonical template seeded into clients/{slug}/context/learnings.md by scripts/add-client.sh.

  Skill headers below must match .claude/skills/ and agency/skills/registry.md.
  Update when skills are added or removed.

  Per-client learnings (voice rules, positioning angles, brand-specific overrides) live here.
  Cross-client / system-level patterns live in the root context/learnings.md.
-->

# Learnings Journal

> Auto-maintained by Agentic OS skills. Newest entries at the bottom of each section.
> Skills append here after deliverable feedback. Never delete entries.
> Section headings match skill folder names exactly. New skills add their own section when created.
> Skills read only their own section before running. Cross-skill insights go in `general`.

# General

## What works well


## What doesn't work well


# Individual Skills

## mkt-brand-voice

## mkt-positioning

## mkt-icp

## mkt-copywriting

## mkt-content-repurposing

## mkt-ugc-scripts

## str-trending-research

## str-ai-seo

- 2026-04-28: Head-term keywords in this engagement return AI Overviews dominated by wrong-industry intent. Phase 1 examples: `frac plug` returns 71% saltwater-aquarium AIO citations (the aquarium hardware sense of "frac plug"); `shot density` returns 57% shotgun-ammunition citations. Targeting these as AEO measurement keywords is leverage-poor — Yellow Jacket can win organic SEO but AIO citations won't flow until Google's intent classification shifts. Refine to longer-tail oilfield-disambiguating variants (e.g., `composite frac plug`, `perforating shot density`). The `analyze-cached-serps.js` helper under this client's projects has a working intent-mismatch detector.

## tool-firecrawl-scraper

## tool-humanizer

## tool-youtube

## tool-stitch

## tool-dataforseo

- 2026-04-28: First version of the skill was built during Phase 1 keyword validation work for this engagement. Per-keyword JSON cache requirement was introduced after the earlier client-level helper lost ~$0.10 of paid SERP output to a mid-run filesystem reset because raw responses lived only in memory until end-of-run.

## viz-nano-banana

## viz-ugc-heygen

## viz-excalidraw-diagram

## viz-interface-design

## viz-stitch-design

## ops-cron

## ops-new-feature

## ops-release

## meta-skill-creator

## meta-wrap-up

## meta-goal-breakdown
