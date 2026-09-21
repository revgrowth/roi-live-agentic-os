# Joint Confidence / Kill Schema (COO Intake Jev ∩ Polaris DF)

**Owner:** Tempo shared efficiency layer  
**Import into:** COO noise-archive / shadow audit **and** Polaris DF decision JSONL consumers  
**Do not:** fork `.claude/skills/tool-polaris-df/` or create a second pack catalog  
**Date:** 2026-09-21 (ET)

Items marked **PROPOSAL** need Jason / COO / Polaris confirm.

---

## Purpose

One threshold + field contract both lanes can import so:

- `ENABLED.on` gating, dry-run→apply, and kill-on-first-miss behave the same way  
- COO noise-archive audit JSONL and Polaris DF decision JSONL stay **compatible** (shared keys; lane-specific keys allowed)  
- Classify stays pinned to **`jev-1.13.0`** in prod policy  

---

## Shared gate

| State | Meaning |
|-------|---------|
| `ENABLED.on` present | Live apply allowed (after dry-run + kill armed) |
| `ENABLED.on` absent | Dry-run / disabled |
| `ENABLED.off` present | Forced dry-run / disabled |
| Both on + off | **PROPOSAL:** disabled + alert |

---

## Confidence router outcomes (Polaris DF — shipped)

| `router_outcome` | Meaning | Auto side effects? |
|------------------|---------|-------------------|
| `auto` | Confidence high enough for lane-allowed action | Only if lane policy permits (COO: NOISE archive under table below; Polaris: never YMYL/claim packs) |
| `llm_escalate` | Needs work LLM / specialist model | No mutate until work path separately gated; see model-router draft |
| `human` | Stop for human | Never auto |

---

## Shared threshold table (import this)

| Lane / action | Min confidence | Min safety | `router_outcome` required | Notes |
|---------------|----------------|------------|---------------------------|-------|
| COO classify → label only (shadow) | n/a (log all) | n/a | any | No mutate |
| COO **NOISE archive** (apply) | `bucket_confidence >= 0.95` | `safety >= 0.70` | `auto` (or treat as auto-eligible) | Archive **not** delete; `BOT_EXEC` OFF |
| COO any other bucket archive | — | — | — | **Forbidden** |
| Polaris DF `auto` | Per DF skill (~0.85 choice default; pack overrides) | Per DF | `auto` / `route` | YMYL / claim packs **never** auto. **Do NOT** lift DF bands to COO 0.95 |
| Polaris DF escalate | Below DF auto band | — | `llm_escalate` | Work model per model-router draft (**approved to build**) |
| Polaris DF human | Low / YMYL / claim | — | `human` | Always for YMYL/claim packs |
| Kill: first miss / FP | — | — | — | **n=1** → disable gate |
| Kill: threshold breach | archived/auto below row mins | — | — | Immediate kill |
| Kill: API errors | — | — | — | **PROPOSAL:** ≥10% / rolling 20 or ≥3 consecutive |
| Prod classify model | — | — | — | Pin **`jev-1.13.0`** |

---

## Shared JSONL fields (minimum)

Both lanes SHOULD emit these keys (null when N/A):

```
timestamp          # ISO-8601
lane               # coo_noise_archive | coo_shadow | polaris_df | ...
decision_id        # or item_id
item_id            # alias OK if decision_id unused
bucket             # COO bucket or DF claim class
confidence         # 0-1 (alias: bucket_confidence)
bucket_confidence  # COO preferred name; same value as confidence OK
safety             # 0-1; required COO archive; optional DF
router_outcome     # auto | llm_escalate | human
phase              # dry-run | apply
action             # archive | skip | escalate_llm | escalate_human | label | none | ...
would_action       # dry-run only
result             # ok | error | skipped | would_succeed | killed
gate               # ENABLED.on | absent | ENABLED.off
operator_or_bot
jev_model          # jev-1.13.0 when classify used
miss               # bool, optional
kill_reason        # string, optional
error              # string, optional
```

Polaris may keep additional DF-native fields. COO may keep shadow-only fields. **Do not strip** DF fields to fit COO or vice versa — union is fine; shared keys above are the contract.

---



## Field aliases and confidence mapping (Polaris DF 2026-09-21)

### `route` ↔ `router_outcome`
Polaris DF emits **`route`** with values `auto` | `llm_escalate` | `human`.  
COO / Tempo docs use **`router_outcome`** with the same values.  
**Consumers MUST accept either key** (prefer `route` if both present). Do not require DF to rename.

### Optional on Polaris DF lane
`safety`, `phase`, `gate`, `kill_reason` are **optional** for `polaris_df`. Required for COO noise-archive apply. Tempo ENABLED.on + kill n=1 wraps apply paths; DF honors when Search Command soft gates wire.

### Shared `confidence` mapping (do not invent DF safety)
| DF mode | Shared `confidence` |
|---------|---------------------|
| choice / score | `min` of the relevant choice/score confidences |
| noul | extremity `|p - 0.5| * 2` |
| COO buckets | `bucket_confidence` (alias of `confidence`) |

**Do not invent a `safety` score for DF.** Do **not** unify numeric auto bands across lanes: COO NOISE archive stays ≥0.95 conf + ≥0.70 safety; DF auto stays per DF skill (~0.85 choice defaults, pack overrides, YMYL never auto). Different blast radius is intentional.


## Kill → re-enable (pointer)

Full checklist: [`kill-switch-sop-noise-archive.md`](./kill-switch-sop-noise-archive.md) §4–§5.  
Work-model after escalate: [`model-router-policy-draft.md`](./model-router-policy-draft.md) (**approved to build**).

---

## Non-goals

- Rewriting `tool-polaris-df`  
- Second pack catalog under Tempo  
- Turning `BOT_EXEC` ON  
- Floating classify off `jev-1.13.0` without explicit bump + re-dry-run  
