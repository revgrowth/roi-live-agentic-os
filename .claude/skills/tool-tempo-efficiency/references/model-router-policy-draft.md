# Model Router Policy Draft (Design Only — Not Approved to Build)

**Owner:** Tempo (Jason Spencer / ROI.LIVE efficiency architect)  
**Status:** **APPROVED TO BUILD** (Jason Spencer, 2026-09-21) for the post-`llm_escalate` tier ladder, hop limit, and `$` cap *structure*. Cost-cap dollar amounts remain placeholders (`null` / TODO) until Jason sets numbers. `BOT_EXEC` remains OFF.  
**Authority:** COO for intake buckets; Polaris DF for confidence router (`auto` / `llm_escalate` / `human`). Tempo maps work-model tiers after escalate — does **not** fork `.claude/skills/tool-polaris-df/`.  
**Companion:** [`joint-confidence-kill-schema.md`](./joint-confidence-kill-schema.md), [`kill-switch-sop-noise-archive.md`](./kill-switch-sop-noise-archive.md)  
**Date:** 2026-09-21 (ET)

---

## 0. Explicit constraints

| Constraint | Value |
|------------|--------|
| This doc | Tier ladder + hop limit **approved to build**. `$` caps are structure-only until Jason sets numbers |
| `BOT_EXEC` | **Still OFF** — bucket→work model map is speculative for a future when handoff/exec is allowed |
| Classify / route | **Jev only**, prod pin **`jev-1.13.0`** (Typesafe `POST https://api.typesafe.ai/v1/systemone`) |
| Polaris DF | Shipped; confidence outcomes already defined. Tempo maps **post-`llm_escalate`** model tiers only |
| Packs | No second pack catalog; YMYL / claim packs never auto-approve |
| Models named by Jason | Typesafe Jev, Claude, Codex/ChatGPT, Kimi K3, GLM 5.3 |

---

## 1. Routing layers (do not collapse)

```
Item/claim
  → [Layer A] Classify/route — Jev 1.13.0 only
  → [Layer B] Confidence router (Polaris DF) — auto | llm_escalate | human
  → [Layer C] Work model (THIS DRAFT) — only if BOT_EXEC or specialist handoff ever ON
```

| Layer | Who owns | Tempo role |
|-------|----------|------------|
| A Classify | COO intake + Jev | Pin version; log model id |
| B Confidence | Polaris DF (`tool-polaris-df`, `scripts/polaris-df`) | Import joint thresholds; no fork |
| C Work model | **PROPOSAL** — Jason approve before build | Draft map below |

If Layer B = `human` → stop; no work model.  
If Layer B = `auto` → only actions already allowed by lane policy (e.g. COO NOISE archive); **not** free-form BOT_EXEC.  
If Layer B = `llm_escalate` → pick work model from §3 (**PROPOSAL**).

---

## 2. Intake / classify → Jev (approved shadow; pin for prod)

| Use | Model | Status |
|-----|--------|--------|
| Bucket / label / route | Typesafe Jev **`jev-1.13.0`** | Shadow approved (labels only). Prod apply policy: **pin 1.13.0**, do not float `jev-latest` |
| Shadow pilot | `agentic-os/clients/roi-live/projects/jev-intake-shadow-2026-09/` | BRIEF, RESULT, SCHEMA, `classifier.py`, `out/labels.jsonl` |

Do not substitute Claude/Codex/Kimi/GLM for classify. Escalate *after* Jev+DF, not instead of Jev.

---

## 3. After `llm_escalate` — recommended work model (**PROPOSAL**)

**Reminder: `BOT_EXEC` remains OFF.** Table is design for future specialist handoff / gated exec only.

| Source signal | Recommended work model | Rationale |
|---------------|------------------------|-----------|
| `CLIENT_HUMAN` | Strongest Claude or ChatGPT tier | Client-facing quality; high regret cost |
| `SECURITY_FINANCE` | Strongest Claude or ChatGPT tier | YMYL-adjacent; never DF-auto |
| `INTERNAL_HUMAN` | Mid Claude **or** Codex when code-shaped | Balance cost vs clarity |
| `CLARIFY` | Cheaper: Kimi K3 / GLM 5.3, escalate up if stuck | Clarifying questions are low blast radius |
| `BRIEF_ONLY` | Kimi K3 / GLM 5.3 | Routine rewrite / brief |
| `NOISE` handling (non-archive text) | Kimi / GLM | Cheap; archive path itself needs no LLM work model |
| `CLICKUP_MUTATE` (label only today) | **Human** until separate mutate SOP | Classifier must not mutate |
| `MULTI` / `HANDOFF_SPECIALIST` | Claude or Codex per specialty | Split tasks; log parent `decision_id` |
| `DYING` / `WAITING` | No generative work model | Status hygiene only |
| `BOT_EXEC` | **N/A — OFF** | Do not map until Jason yes |
| Code / agentic build on A6 | Codex / Claude Code (as already used) | Keep existing practice |
| Polaris DF `llm_escalate` on non-YMYL | Tier by claim risk: high→Claude/GPT; low→Kimi/GLM | **PROPOSAL** — Polaris confirm |
| Polaris DF YMYL / claim packs | `human` only (no auto); if Jason later allows assist draft | Strongest Claude/GPT draft **for human approve** — never auto-send |

### Default tier names (**PROPOSAL** — map to exact SKUs later)

| Tier | Intended models | Use |
|------|-----------------|-----|
| T0 Classify | `jev-1.13.0` | Always Layer A |
| T1 Cheap | Kimi K3, GLM 5.3 | BRIEF_ONLY, CLARIFY, routine |
| T2 Code | Codex / Claude Code | A6 builds, agentic code |
| T3 Strong | Top Claude / ChatGPT | CLIENT_HUMAN, SECURITY_FINANCE, YMYL assist drafts |

---

## 4. Cost caps / when to downgrade (**PROPOSAL**)

| Cap | Draft default | Trigger |
|-----|---------------|---------|
| Per-item work-model max | Confirm with Jason (e.g. $0.50 T3, $0.05 T1) | Soft warn → downgrade tier if over |
| Daily lane budget | Confirm with Jason | Hit 80% → prefer T1; hit 100% → `human` queue only |
| Escalate loop limit | Max **2** llm_escalate hops per `decision_id` | Then `human` |
| Downgrade when | Bucket is BRIEF_ONLY / CLARIFY / NOISE-adjacent AND confidence in mid band | Use T1 |
| Upgrade when | Client-facing, security/finance, or DF flags YMYL | T3 or human |
| Never downgrade | SECURITY_FINANCE, YMYL claim assist, CLIENT_HUMAN final copy | Quality over cost |

Log `cost_estimate_usd` / `tokens` when available for later router training (§6).

---

## 5. Latency vs quality by bucket (**PROPOSAL**)

| Bucket / outcome | Latency bias | Quality bias | Model leaning |
|------------------|--------------|--------------|---------------|
| Classify (all) | Low latency | Enough for route | Jev 1.13.0 |
| DF `auto` (allowed actions only) | Lowest | Threshold-gated | No work LLM |
| NOISE archive | Lowest | High precision thresholds | No work LLM |
| BRIEF_ONLY / CLARIFY | Prefer fast | Accept good-enough | T1 Kimi/GLM |
| INTERNAL_HUMAN | Medium | Clear, correct | T2/T3 as needed |
| CLIENT_HUMAN | Accept higher latency | Highest | T3 |
| SECURITY_FINANCE | Accept higher latency | Highest + human | T3 → human |
| A6 code | Session-length OK | Correctness | T2 Codex/Claude Code |
| DF `llm_escalate` | Bounded (caps §4) | Match claim risk | Tier table §3 |
| DF `human` | N/A | Human | No model |

---

## 6. Self-improving loop (log now, route later)

Every Layer B/C decision should append JSONL compatible with joint schema +:

| Field | Purpose |
|-------|---------|
| `jev_model` | Always `jev-1.13.0` when classify ran |
| `router_outcome` | auto / llm_escalate / human |
| `work_model` / `work_tier` | T1/T2/T3 or null |
| `bucket` | COO bucket or DF claim class |
| `confidence` / `safety` | From joint schema |
| `latency_ms` | End-to-end and per hop |
| `cost_estimate_usd` | If available |
| `outcome` | success / reject / miss / human_override |
| `human_override_tier` | If human changed model or killed auto |

**Cadence (**PROPOSAL**):** weekly Tempo pass on miss rate + cost by tier; monthly Jason review before any auto-routing of work models. No closed-loop auto-change of prod pins without Jason yes.

---

## 7. What this draft does *not* authorize

- Building a router service or changing prod defaults  
- Turning `BOT_EXEC` ON  
- Floating Jev off `jev-1.13.0`  
- Forking Polaris DF or adding a Tempo pack catalog  
- Auto-approving YMYL / claim packs  
- Using work LLMs for classify instead of Jev  

---

## 8. Open questions for Jason

1. Exact SKUs for T1 (Kimi K3 vs GLM 5.3 default) and T3 (which Claude / which ChatGPT)?  
2. Hard $ caps per item and per day — numbers you want Tempo to enforce?  
3. When (if ever) may `BOT_EXEC` turn ON, and which buckets first?  
4. Should DF `llm_escalate` always enter T3 for client-facing claims, or allow T1 for low-risk internal?  
5. Is A6 always T2 (Codex/Claude Code), or can routine codegen drop to T1?  
6. Who signs weekly miss/cost review — Tempo alone or Tempo + Polaris + COO?  
7. Confirm prod pin stays `jev-1.13.0` until explicit bump + re-dry-run (see kill-switch SOP).  
8. Any bucket that must **never** call Kimi/GLM even for drafts?

---

## 9. Adoption note (if Jason later says yes)

1. Keep Layer A/B as-is (Jev pin + Polaris DF).  
2. Implement Layer C behind `ENABLED.on` + kill-switch SOP.  
3. Import [`joint-confidence-kill-schema.md`](./joint-confidence-kill-schema.md).  
4. Ship logging (§6) **before** any automatic tier selection.  
5. Dry-run work-model *recommendations* only until miss rate acceptable.
