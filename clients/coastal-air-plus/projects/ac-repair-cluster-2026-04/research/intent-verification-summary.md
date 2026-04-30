# SERP Intent Verification — 4 Symptom Spokes

**Date:** 2026-04-30
**Endpoint:** DataForSEO `serp/google/organic/live/advanced`
**Location:** Summerville, SC (`location_code` 1025666)
**Device:** desktop
**Depth:** 20
**AI Overview async fetch:** enabled
**Total cost:** $0.0140 (4 calls × $0.0035 each)

Raw SERP responses saved to `research/serp/{slug}.json`. The skill writes per-keyword files as `{slug}.json` (e.g. `ac-not-cooling.json`); the project spec asked for the prefix `serp-intent-{slug}.json`. Path-grouped under `serp/` instead — same content, easier to scan.

## Per-keyword verdict

### `ac not cooling`

- **AIO present:** YES (11 citations)
- **Dominant intent in top 10:** HVAC home AC (Bryant, Lennox, Carrier, Coolray, Town Oil, Daikin all HVAC; Reddit + Quora general; **1 automotive outlier — meineke.com at rank 4**)
- **Top 3 AIO citation domains:** reddit.com, youtube.com, carrier.com
- **Recommendation:** **proceed** — HVAC dominant, automotive intent leakage is one ranked result not the SERP majority

### `ac blowing warm air`

- **AIO present:** YES (10 citations)
- **Dominant intent in top 10:** HVAC home AC (aquariushomeservices, carrier, mechanicalone, calldreamteam, bryant, downeastheating, koch-white all HVAC contractor / brand; **1 automotive outlier — autozone.com at rank 5**)
- **Top 3 AIO citation domains:** youtube.com, bryant.com, carrier.com
- **Recommendation:** **proceed** — HVAC dominant; automotive presence is a known crossover risk for the "warm air" symptom phrasing but doesn't dominate

### `ac won't turn on`

- **AIO present:** YES (10 citations)
- **Dominant intent in top 10:** HVAC home AC, **no automotive leakage** (Lennox, Trane, Carrier, A1 Mechanical, AireServ, Aspen Aire, Fred F Collis all HVAC; Reddit + Facebook + JustAnswer general)
- **Top 3 AIO citation domains:** reddit.com, lennox.com, carrier.com
- **Recommendation:** **proceed** — cleanest of the four. Brand-authoritative answers + community content with no automotive contamination

### `ac frozen`

- **AIO present:** YES (10 citations)
- **Dominant intent in top 10:** HVAC home AC, **no automotive leakage** (Petro, Burgesons, Carrier, Trane, tcomfort, AireServ, Paschal all HVAC; Reddit + Facebook general)
- **Top 3 AIO citation domains:** youtube.com, petro.com, trane.com
- **Recommendation:** **proceed** — HVAC dominant, brand-authoritative. AIO citation set leans contractor / brand rather than community

## Cross-keyword AIO observations

All four keywords trigger an AI Overview at Summerville geo. That's the AEO surface area we're targeting.

**Citation pattern across the four AIO sets:**

| Domain class | Keywords appearing in AIO top 3 |
|---|---|
| reddit.com | ac not cooling, ac won't turn on |
| youtube.com | ac not cooling, ac blowing warm air, ac frozen |
| carrier.com | ac not cooling, ac blowing warm air, ac won't turn on |
| bryant.com | ac blowing warm air |
| lennox.com | ac won't turn on |
| trane.com | ac frozen |
| petro.com | ac frozen |

The AEO play implications:

- Reddit and YouTube show up in 3 of 4 AIO citation sets. Citing them in our content (or responding to common positions from those threads) is a tactical lever
- HVAC brand sites (Carrier, Bryant, Lennox, Trane) are the institutional authority Google trusts. Content that aligns with brand-authoritative positions while adding Charleston-area service context is the angle that beats brand sites locally
- Petro on `ac frozen` is interesting — a regional HVAC service company breaking into a brand-dominated AIO citation set. That's a proof point for the strategy

## Phrase mining — PAA + Related Searches

Searched all four SERP responses for variants that could anchor the two zero-volume symptom spokes.

### Noise-related variants (for `ac making strange noises` zero-volume finding)

Only one hit:
- `Thermostat clicks but AC does not turn on` — Related search on `ac won't turn on`

The canonical "noise" search phrasing did not surface. The four SERPs we pulled are adjacent to but don't cover the noise-symptom space. The clicks pattern above is a specific failure mode, not the category-level phrasing.

**Implication:** the canonical noise spoke title needs a targeted lookup before drafting. Recommend a $0.02 DataForSEO Labs `keyword_suggestions` call for "ac making noise" to surface the actual top-volume phrasing.

### Airflow-related variants (for `ac running but no air from vents` zero-volume finding)

Two hits:
- `Air conditioner not blowing cold air but running` — Related search on `ac not cooling`
- `How to reset AC not blowing cold air?` — PAA on `ac blowing warm air`

Both reframe the spoke around the "not blowing cold air" intent. Note: `not blowing cold air` semantically overlaps with `ac not cooling` and `ac blowing warm air` — these may be the same intent expressed three ways. The original spoke title (`ac running but no air from vents`) describes a distinct mechanical symptom — air physically not moving from vents (blower failure or duct issue) — which the SERPs we pulled don't cover.

**Implication:** the canonical airflow spoke title also needs a targeted lookup. Likely candidates: `ac not blowing air at all`, `no air coming from vents`, `blower not working`. Same recommendation — $0.02 `keyword_suggestions` call before drafting.

## Verdict

All four locked symptom spokes (`ac not cooling`, `ac blowing warm air`, `ac won't turn on`, `ac frozen`) verified for HVAC-home intent and AIO presence at Summerville geo. Proceed to drafting on these four.

The two unlocked symptom spokes (`ac making strange noises`, `ac running but no air from vents`) need a $0.04 phrasing-validation pass before drafting. Defer to Jason's call.
