# Changelog

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
