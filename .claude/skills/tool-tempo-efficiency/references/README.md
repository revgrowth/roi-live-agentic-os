# Tempo efficiency layer

**Owner:** Tempo (Jason Spencer / ROI.LIVE efficiency architect)  
**vs COO / Polaris:** Tempo owns packaging — gate/audit/kill conventions, joint schema, and the post-`llm_escalate` model router. **COO** owns intake ops judgment (noise archive hard rules, re-enable). **Polaris** owns Decision Fabric (`.claude/skills/tool-polaris-df/`, `scripts/polaris-df`) — Tempo does **not** fork it or ship a second pack catalog.

**Date:** 2026-09-21 (ET)

## Docs

| File | What |
|------|------|
| [`kill-switch-sop-noise-archive.md`](./kill-switch-sop-noise-archive.md) | ENABLED.on / dry-run→apply / audit / kill SOP for COO Jev noise archive, aligned with Polaris DF |
| [`model-router-policy-draft.md`](./model-router-policy-draft.md) | Post-`llm_escalate` tier ladder (T0–T3). Jason approved the build. `BOT_EXEC` still OFF. Cost-cap dollars are placeholders. |
| [`joint-confidence-kill-schema.md`](./joint-confidence-kill-schema.md) | Shared threshold table + JSONL field contract both lanes import |

## Runtime (this skill)

| Path | What Tempo owns |
|------|-----------------|
| `tempo_efficiency.gate` | `ENABLED.on` / `ENABLED.off` / conflict helpers |
| `tempo_efficiency.config` | Shared threshold table + Jev pin + `$` cap placeholders |
| `tempo_efficiency.audit` | JSONL writer (minimum shared fields) |
| `tempo_efficiency.kill` | Kill-on-first-miss + disable-gate |
| `tempo_efficiency.router` | Layer A pin → Layer B DF outcome → Layer C tiers |
| `tempo_efficiency.adapters.polaris_df` | Import-only DF types / `router_outcome` mapping |
| `scripts/tempo-router` | Dry-run resolve CLI (no Typesafe, no ClickUp) |

## Hard pins (both lanes)

- Prod classify: **`jev-1.13.0`**
- Archive not delete; `BOT_EXEC` OFF
- YMYL / claim packs: never auto-approve (Polaris)
- Kill on first miss; re-enable is human/COO/Polaris judgment

## Non-goals

- Calling Typesafe from this packaging  
- Mutating ClickUp  
- Forking or rewriting `tool-polaris-df`  
- A second pack catalog under Tempo  
- Turning `BOT_EXEC` ON  
