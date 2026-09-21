# Changelog

## 0.1.1 - 2026-09-21

- Do not unify numeric auto bands: COO 0.95/0.70 vs DF ~0.85 stay lane-local.
- JSONL accepts `route` and `router_outcome` (prefer `route`). `safety` / `phase` / `gate` / `kill_reason` optional on `polaris_df`.
- Shared DF `confidence`: min(choice/score confidences) or noul `|p-0.5|*2`. No invented DF safety.
- Polaris post-`llm_escalate` defaults: keyword/purity T1; audit T1 (T3 if client-facing); QA/AEO/GEO T3; YMYL/claim human only.
- Model-router docs flipped to approved-to-build.

## 0.1.0 - 2026-09-21

- Shared `ENABLED.on` / `ENABLED.off` / conflict gate helpers.
- Joint confidence / kill threshold table as importable config (COO NOISE archive mins).
- JSONL audit writer emitting the shared field contract (union extras allowed).
- Kill-on-first-miss + disable-gate (`ENABLED.off`, `out/KILL.md`).
- Model router: Layer A pin `jev-1.13.0` → Layer B DF `router_outcome` → Layer C T0–T3.
- Max 2 escalate hops per `decision_id`; `$` caps are null placeholders.
- `BOT_EXEC` hard-off. YMYL / claim packs never auto. No Typesafe / ClickUp calls.
- Import-only Polaris DF adapter (no pack catalog fork).
- CLI: `scripts/tempo-router` resolve / gate / thresholds.
