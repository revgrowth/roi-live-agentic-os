# ENABLED.on / Audit / Dry-run→Apply Kill-Switch SOP (Jev Noise Archive)

**Owner:** Tempo (Jason Spencer / ROI.LIVE efficiency architect)  
**Authority:** COO context authoritative for intake gates; Polaris DF authoritative for Decision Fabric confidence routing. Tempo packages the **shared** efficiency layer — does not fork Polaris.  
**Status:** Design + ops SOP. Speculative items marked **PROPOSAL** — need Jason/COO/Polaris confirm.  
**Related:**  
- COO shadow: `agentic-os/clients/roi-live/projects/jev-intake-shadow-2026-09/`  
- COO noise archive (in flight): `jev-noise-archive-2026-09/`  
- Polaris DF (shipped): `.claude/skills/tool-polaris-df/` + CLI `scripts/polaris-df`  
- Shared thresholds: [`joint-confidence-kill-schema.md`](./joint-confidence-kill-schema.md)  
**Date:** 2026-09-21 (ET)

**Explicit:** No second pack catalog. Do **not** rewrite `tool-polaris-df`. This SOP + joint schema are importable conventions only.

---

## 0. Hard rules (non-negotiable)

| Rule | Value |
|------|--------|
| Shadow classify (COO) | Labels only. No auto-exec of work. |
| Junk auto-archive (COO) | ON only under: `NOISE` + `bucket_confidence >= 0.95` + `safety >= 0.70` |
| Action | **Archive, not delete** |
| Gate | `ENABLED.on` present = live apply; absent or `ENABLED.off` = dry-run/disabled |
| Order | Dry-run first; log audit; kill on first miss |
| `BOT_EXEC` | **Stays OFF** |
| Classify model (prod policy) | **Pin `jev-1.13.0`** (not floating `jev-latest` in apply) |
| Typesafe endpoint | `POST https://api.typesafe.ai/v1/systemone` |
| Polaris DF | Confidence outcomes: `auto` \| `llm_escalate` \| `human`. YMYL / claim packs **never** auto-approve. |
| JSONL | COO noise-archive audit **and** Polaris decision log must stay compatible via joint schema |

Buckets (COO classifier): `BOT_EXEC` | `INTERNAL_HUMAN` | `CLARIFY` | `CLIENT_HUMAN` | `CLICKUP_MUTATE` | `BRIEF_ONLY` | `DYING` | `SECURITY_FINANCE` | `NOISE` | `MULTI`  
Flags: `VAULT_WRITE` | `CALENDAR` | `HANDOFF_SPECIALIST` | `WAITING`

---

## 1. ENABLED.on gate — concrete convention

**Shared across COO intake Jev and Polaris DF automations.**

**PROPOSAL** (confirm Jason/COO/Polaris): sibling gate file next to automation root.

```
# COO lane
agentic-os/clients/roi-live/projects/<automation-slug>/ENABLED.on

# Polaris DF lane — gate beside the skill/CLI invoke context, not inside forked copies
# PROPOSAL: agentic-os/.../gates/polaris-df-<surface>/ENABLED.on
# Do NOT fork .claude/skills/tool-polaris-df/
```

### Semantics

| Gate state | Behavior |
|------------|----------|
| `ENABLED.on` **present** | Live apply permitted after dry-run sign-off + kill-switch armed |
| `ENABLED.on` **absent** | Dry-run / disabled — classify + log proposed actions only |
| `ENABLED.off` **present** | Forced dry-run / disabled |
| Conflict (`on` + `off`) | **PROPOSAL:** treat as **disabled** + alert |

### Lane-specific notes

| Lane | With `ENABLED.on` may… | Must never… |
|------|------------------------|-------------|
| COO shadow (`jev-intake-shadow-2026-09`) | Write `out/labels.jsonl` | Archive / mutate / BOT_EXEC |
| COO noise archive | Archive when joint schema auto thresholds met for NOISE | Delete; archive non-NOISE; BOT_EXEC |
| Polaris DF | Execute only `auto` outcomes allowed by DF policy | Auto-approve YMYL / claim packs; invent new pack catalog |

### Bot check (any bot, every run)

1. Resolve automation root / DF surface.  
2. If `ENABLED.off` → dry-run / abort apply.  
3. Else if `ENABLED.on` → apply path allowed (kill-switch + joint thresholds).  
4. Else → dry-run only.  
5. Log `gate` on every decision line (joint schema).

---

## 2. Dry-run vs apply phases

### Phase A — Dry-run (mandatory before first apply)

**Mutations:** none. No archive, delete, ClickUp mutate, BOT_EXEC, or DF auto-approve of forbidden packs.

**Must log (per item)** — fields aligned with [`joint-confidence-kill-schema.md`](./joint-confidence-kill-schema.md):

| Field | Example |
|-------|---------|
| `phase` | `dry-run` |
| `timestamp` | ISO-8601 with offset |
| `item_id` / `decision_id` | source id |
| `lane` | `coo_noise_archive` \| `polaris_df` |
| `bucket` | `NOISE` (COO) or DF claim type |
| `bucket_confidence` / `confidence` | `0.97` |
| `safety` | `0.82` (COO; DF may omit if N/A) |
| `router_outcome` | `auto` \| `llm_escalate` \| `human` |
| `would_action` | `archive` \| `skip` \| `escalate_llm` \| `escalate_human` |
| `gate` | `ENABLED.on` \| `absent` \| `ENABLED.off` |
| `operator_or_bot` | bot id / human |
| `jev_model` | `jev-1.13.0` when classify used |
| `result` | `would_succeed` |

**Exit criteria (ops — COO/Polaris):** **PROPOSAL:** 50 items or 7 calendar days dry-run, 0 would-false-positives on review sample — confirm.

### Phase B — Apply

**Preconditions:** dry-run exit met; `ENABLED.on`; kill armed; `BOT_EXEC` OFF; classify pinned to `jev-1.13.0` when Jev is in path.

**COO archive allowed only when:**  
`bucket == NOISE` AND `bucket_confidence >= 0.95` AND `safety >= 0.70` AND `router_outcome` maps to `auto` (see joint schema).

**Polaris DF apply:** honor DF's own `auto` / `llm_escalate` / `human` router; YMYL/claim packs never `auto`.

**Log:** same as dry-run + `action`, `result` (`ok`\|`error`\|`skipped`\|`killed`), `error`, `api_latency_ms`.

---

## 3. Audit log fields (canonical + Polaris-compatible)

**PROPOSAL:** append-only JSONL. COO path example:  
`.../jev-noise-archive-2026-09/out/audit.jsonl`  
Polaris: existing DF decision JSONL — **extend with shared fields**, do not replace DF log format.

| Field | Required | Notes |
|-------|----------|-------|
| `timestamp` | yes | ISO-8601 |
| `item_id` or `decision_id` | yes | Stable id |
| `lane` | yes | `coo_noise_archive` \| `polaris_df` \| other |
| `bucket` | COO yes | Classifier bucket |
| `bucket_confidence` / `confidence` | yes | 0–1 |
| `safety` | COO yes | 0–1 |
| `router_outcome` | yes | `auto` \| `llm_escalate` \| `human` |
| `flags` | no | VAULT_WRITE, CALENDAR, YMYL, etc. |
| `phase` | yes | `dry-run` \| `apply` |
| `action` / `would_action` | yes | archive / skip / escalate_* |
| `result` | yes | ok / error / skipped / would_succeed / killed |
| `operator_or_bot` | yes | |
| `gate` | yes | |
| `jev_model` | when classify | **Pin `jev-1.13.0` in prod** |
| `miss` | no | true on FP |
| `kill_reason` | no | |
| `error` | no | |

No secrets / tokens / credential-bearing bodies in logs.

Full shared table: [`joint-confidence-kill-schema.md`](./joint-confidence-kill-schema.md).

---

## 4. Kill conditions

On any kill: stop apply → remove/rename `ENABLED.on` / write `ENABLED.off` → `out/KILL.md` + audit `kill_reason` → no resume without §5.

| # | Condition | Threshold |
|---|-----------|-----------|
| K1 | **First miss** (FP archive or FP `auto` that should have been human/escalate) | **n=1** |
| K2 | Confidence / safety breach vs joint schema | any |
| K3 | Wrong bucket archived (not NOISE) | any |
| K4 | YMYL / claim pack auto-approved | any — kill + escalate |
| K5 | API error rate | **PROPOSAL:** ≥10% in rolling 20 or ≥3 consecutive |
| K6 | Delete attempted | any |
| K7 | `BOT_EXEC` or ClickUp mutate from classifier-only path | any |
| K8 | Classify model drift (apply used non-pinned Jev) | **PROPOSAL:** kill if not `jev-1.13.0` |

---

## 5. Restart / re-enable checklist

- [ ] Root cause in `out/KILL.md` (id, miss type, timestamp ET).  
- [ ] Restore archived / reverse bad auto if applicable.  
- [ ] Fix thresholds / prompt / DF routing; or COO/Polaris accept-risk note.  
- [ ] Dry-run sample (**PROPOSAL: 20** items, 0 would-misses).  
- [ ] Audit + Polaris JSONL reviewed for silent failures.  
- [ ] Confirm still no fork of `tool-polaris-df`.  
- [ ] Confirm classify still pinned `jev-1.13.0`.  
- [ ] Remove `ENABLED.off`; recreate `ENABLED.on` by named operator.  
- [ ] Kill watcher re-armed.  
- [ ] Jason / COO / Polaris explicit re-enable recorded.

---

## 6. What is NEVER allowed

| Forbidden | Why |
|-----------|-----|
| Delete | Archive only |
| `BOT_EXEC` from this pipeline | Stays OFF |
| ClickUp mutate from classifier alone | Label ≠ permission |
| Archive below joint auto thresholds | Hard rule |
| Archive non-NOISE | |
| Auto-approve YMYL / claim packs | Polaris DF rule |
| Fork / rewrite `tool-polaris-df` | Shipped source of truth |
| Second pack catalog under Tempo | Efficiency layer only |
| Skip dry-run on new env/model | Model bump → re-dry-run (**PROPOSAL**) |
| Ignore first miss / auto-re-enable | Human gate |
| Floating `jev-latest` in prod apply | Pin `jev-1.13.0` |

---

## 7. How other bots adopt this packaging

1. Package under `agentic-os/.../projects/<slug>/` (or DF surface gate — no skill fork).  
2. `ENABLED.on` / `ENABLED.off` per §1.  
3. Import thresholds from [`joint-confidence-kill-schema.md`](./joint-confidence-kill-schema.md).  
4. Dry-run → apply; JSONL audit with §3 fields (`lane`, `router_outcome`).  
5. Kill on first miss; `out/KILL.md`.  
6. If using Jev: shadow first (`classifier.py`, `out/labels.jsonl`); pin `jev-1.13.0` for apply.  
7. If using Polaris: call existing `scripts/polaris-df` / skill — do not duplicate packs.  
8. README: owner, gate path, pointer to this SOP + joint schema.

**Adoption checklist:**

```
[ ] Gate files
[ ] Joint schema thresholds imported
[ ] Dry-run logs would_* only
[ ] Audit JSONL compatible with Polaris + COO fields
[ ] Kill on first miss
[ ] BOT_EXEC / mutate unreachable from classify
[ ] No tool-polaris-df fork
[ ] jev-1.13.0 pinned if classify in apply path
[ ] Jason/COO/Polaris confirm PROPOSAL knobs
```

---

## Appendix A — Threshold quick ref

See [`joint-confidence-kill-schema.md`](./joint-confidence-kill-schema.md) for the single importable table.

| Knob | Value | Status |
|------|-------|--------|
| COO auto-archive | NOISE + conf≥0.95 + safety≥0.70 | COO hard rule |
| Polaris router | auto / llm_escalate / human | Shipped DF |
| YMYL / claim packs | never auto | Polaris hard rule |
| Prod Jev pin | `jev-1.13.0` | Prod policy |
| Dry-run exit N | 50 items or 7 days | **PROPOSAL** |
| Post-kill dry-run | 20 items | **PROPOSAL** |
| API error kill | 10%/20 or 3 consec | **PROPOSAL** |

---

## Appendix B — Shadow vs noise-archive vs Polaris DF

| Package | Mutate? | Gate meaning |
|---------|---------|--------------|
| `jev-intake-shadow-2026-09` | Labels only | Even with ENABLED.on → labels.jsonl only |
| `jev-noise-archive-2026-09` | Archive under §0 | ENABLED.on = live archive |
| `tool-polaris-df` | Per DF policy | Tempo gates apply around it; never fork skill |
