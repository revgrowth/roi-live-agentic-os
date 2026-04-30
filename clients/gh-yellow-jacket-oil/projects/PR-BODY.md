PR title:

G&H Yellow Jacket Phase 1 — keyword validation + tool-dataforseo skill

PR body:

## Summary

- **New skill `tool-dataforseo`** — keyword research + SERP analysis utility wrapping DataForSEO Labs Keyword Overview and SERP Organic Live Advanced. Three scripts (keyword-overview, serp-advanced, validate-keywords) with shared client lib. All paid output is persisted per-keyword on disk before the next call starts; re-runs reuse cached files unless `--force`.
- **G&H Phase 1 keyword validation** — DataForSEO pulled volume / KD / competition / intent / SERP features / AI Overview citations for all 32 Phase 1 deliverables. Findings: 24/32 keywords show an AI Overview, `ghdiv.com` is already cited in 2 AIOs (perforating gun, perforating gun manufacturers), Repeat Precision is cited for shot density perforating, 0 keywords above KD 70.
- **Internal linking architecture** restored from prior session work; 204-line graph design with cross-cluster bridges (#13 plug-and-perf as the densest hub-of-hubs).
- **Monthly AIO citation tracking cron** — first-Monday-of-month re-pull with delta report against prior month, tracking `ghdiv.com` vs. Repeat Precision / WellBoss / DynaEnergetics / Hunting Titan citation movement. Self-skips on non-first Mondays.

## Test plan

- [ ] Verify `tool-dataforseo` skill registry entries appear in catalog.json, AGENTS.md (Skill Registry, Context Matrix, Service Registry), README.md, and context/learnings.md
- [ ] Verify `node .claude/skills/tool-dataforseo/scripts/validate-keywords.js --keywords "frac plug" --output-dir /tmp/test-dfs/` reuses cached SERP files when present, skips API calls
- [ ] Verify `clients/gh-yellow-jacket-oil/cron/jobs/monthly-aio-citation-tracking.md` parses correctly when the cron runtime picks it up (active=true)
- [ ] Verify `clients/gh-yellow-jacket-oil/projects/keyword-validation.md` renders cleanly and matches the data in `projects/raw/serp/`
- [ ] Verify the linking architecture's cross-cluster bridges align with the cluster map deliverables

## Out of scope (deferred)

- Tasks 2 (competitor content audit) and 3 (AEO opportunity map) from the original Phase 1 brief — raw SERP data is now cached in `projects/raw/serp/`, ready for next session
- Recording-derived voice work — pending Kelly / Lead Engineer / Sales Lead / Jimmy recordings
- Costa Rica manufacturing references — explicitly off-limits until Jimmy approves
