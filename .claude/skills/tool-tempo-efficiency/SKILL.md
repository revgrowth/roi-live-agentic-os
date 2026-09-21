---
name: tool-tempo-efficiency
description: >
  Tempo shared efficiency layer: ENABLED.on/off gates, joint
  confidence/kill thresholds, JSONL audit, and post-llm_escalate
  model-tier routing (T0-T3). Use for noise-archive gates, kill
  switch, hop limits, and dry-run resolve of bucket/router_outcome
  to a work tier. Classify stays jev-1.13.0. BOT_EXEC stays OFF.
  Triggers: tempo router, ENABLED.on, kill switch, noise archive
  gate, model tier, llm_escalate hop, joint confidence schema.
  Does not fork tool-polaris-df, call Typesafe, mutate ClickUp,
  or enable BOT_EXEC. Does not replace Polaris pack catalog.
---

# Tempo Efficiency Layer

Shared packaging for COO noise-archive callers and Polaris DF consumers.
Tempo owns the gate, joint thresholds, JSONL contract, kill-on-first-miss,
and the post-`llm_escalate` work-tier map. Polaris owns Decision Fabric.
COO owns intake ops judgment. This skill does not fork DF or ship packs.

**Principle:** Classify with pinned Jev. Honor DF `auto` / `llm_escalate` /
`human`. Recommend a work tier only after escalate. Never auto-exec work.

## Outcome

Dry-run recommendations and append-only audit JSONL under
`projects/tool-tempo-efficiency/` (or a caller-supplied automation root):

- gate state: `ENABLED.on` | `absent` | `ENABLED.off` | `conflict`
- shared threshold check (COO NOISE archive mins)
- `work_tier` / `work_model` after `llm_escalate` only
- kill record + disabled gate on first miss

Always save output to disk. After saving, show the full absolute path.

## Context Needs

| File | Load level | Purpose |
|------|-----------|---------|
| `context/learnings.md` | `## tool-tempo-efficiency` | Gate/router gotchas |
| `references/joint-confidence-kill-schema.md` | full | Thresholds + JSONL keys |
| `references/kill-switch-sop-noise-archive.md` | full | Gate / kill SOP |
| `references/model-router-policy-draft.md` | full | T0–T3 ladder |

No brand_context required. Do not load DF pack catalog into this skill.

## Dependencies

| Skill / service | Required? | What it provides | Without it |
|-----------------|-----------|------------------|------------|
| `tool-polaris-df` | Optional import | `Route`, YMYL claim classes, pack `never_auto` | Local literals + caller flags. No second catalog. |
| TypeSafe Jev | Do not call | Classify stays COO/Polaris | This CLI never hits the API |
| ClickUp | Forbidden | — | Do not mutate |

## Commands

```bash
bash scripts/tempo-router resolve --bucket NOISE --router-outcome auto
bash scripts/tempo-router resolve --bucket CLIENT_HUMAN --router-outcome llm_escalate --decision-id d1
bash scripts/tempo-router resolve --bucket CLARIFY --router-outcome llm_escalate --hops 2
bash scripts/tempo-router gate --root path/to/automation
bash scripts/tempo-router thresholds
```

`--dry-run` is the default. There is no `--live` Typesafe path.

## Layers (do not collapse)

| Layer | Owner | This skill |
|-------|-------|------------|
| A Classify | COO + Jev | Pin `jev-1.13.0`. Never substitute another model. |
| B Confidence | Polaris DF | Import `router_outcome`. Do not re-route packs. |
| C Work model | Tempo | T0–T3 after `llm_escalate` only. Hop max 2. |

If Layer B is `human` → stop. If `auto` → lane-allowed action only (COO: NOISE archive under joint mins). If `llm_escalate` → pick a tier. YMYL / claim packs never auto-approve.

## Hard pins

- Prod classify: **`jev-1.13.0`** (not floating `jev-latest`)
- `BOT_EXEC` stays **OFF** — this package cannot turn it on
- Archive, not delete
- Kill on first miss; re-enable is human/COO/Polaris
- Dollar cost caps are `null` until Jason sets numbers — hop limits still enforce

## Jev / Tempo must not

Call Typesafe. Mutate ClickUp. Enable `BOT_EXEC`. Fork `tool-polaris-df`.
Auto-approve YMYL / claim packs. Use a work LLM for classify.
