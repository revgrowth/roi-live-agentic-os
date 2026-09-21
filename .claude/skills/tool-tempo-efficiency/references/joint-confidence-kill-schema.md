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
| Polaris DF `auto` | Per DF skill (do not restate packs here) | Per DF | `auto` | YMYL / claim packs **never** auto |
| Polaris DF escalate | Below DF auto band | — | `llm_escalate` | Work model per model-router draft (**PROPOSAL**) |
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

## Kill → re-enable (pointer)

Full checklist: [`kill-switch-sop-noise-archive.md`](./kill-switch-sop-noise-archive.md) §4–§5.  
Work-model after escalate: [`model-router-policy-draft.md`](./model-router-policy-draft.md) (approved tier ladder; `$` caps TBD).

---

## Non-goals

- Rewriting `tool-polaris-df`  
- Second pack catalog under Tempo  
- Turning `BOT_EXEC` ON  
- Floating classify off `jev-1.13.0` without explicit bump + re-dry-run  
