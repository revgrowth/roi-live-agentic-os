# Polaris × Jev — Search Decision Fabric
**ROI.LIVE | SEO + AEO + GEO | Architecture v0.1**  
**Date:** 2026-09-21  
**Owner:** Polaris (in-house SEO + AEO + GEO)

---

## 1. Thesis

TypeSafe **Jev** is not a content model. It is a **System One decision engine**: you send program state + typed questions; it returns calibrated `noul` / `choice` / `score` answers with probabilities and confidence, in ~70–500ms, at ~$0.042 / M input tokens (outputs free).

ROI.LIVE’s Search Command SOP already separates **measured observation** from **labeled judgment**. Most of our spend and latency today sits on the judgment side — purity, intent collapse, SERP-shape classification, eligibility, claim risk, QA, priority — and we rent System Two (frontier LLMs) to do System One work.

**Polaris Decision Fabric** puts Jev under every judgment gate. LLMs write and synthesize only when a gate opens a generation lane. Deterministic code owns numbers, crawls, and provenance.

```
Measured facts (DataForSEO, crawl, GSC, schemas)
        ↓
   Jev Decision Layer   ← classify / route / score / gate (cheap, parallel, typed)
        ↓ confidence gate
   ┌────┴────┬──────────────┐
 Auto-pass  Escalate LLM   Human review
                ↓
         Generation / narrative (briefs, copy, audit prose)
```

---

## 2. What Jev is uniquely good at (for us)

| Strength | Why it matters for Search Command |
|---|---|
| Typed outputs only (`noul`, `choice`, `score`) | Gates become code, not prompt parsing |
| Calibrated confidence | Auto-pass easy rows; escalate only the uncertain ~10–30% |
| Parallel questions on one state | One call = purity + intent + YMYL + format + AEO fitness |
| ~100× cheaper / faster than frontier LLMs for decisions | Audits and keyword libraries at page/query scale |
| Cannot hallucinate strings | Safe inside CI, validators, and ship gates |
| Up to 255 choice options | SERP-shape taxonomy, disposition enums, competitor class, IA room |

**What Jev must NOT do:** write audit narrative, keyword lists, titles, schema JSON, or strategy prose. That stays LLM + human.

---

## 3. System architecture

### 3.1 Layers

1. **Ingest / Evidence** — DataForSEO, crawlers (Respira / Firecrawl / Screaming Frog exports), GSC, Ahrefs/Semrush dumps, brand charter, intake JSON, page HTML, content drafts.
2. **Feature packers** — Normalize each unit (query row, URL, draft, SERP pull, cluster pair) into a compact `state` object Jev can judge.
3. **Decision catalog** — Versioned packs of typed questions keyed by gate ID (`G0`…`G8`, `AUDIT.*`, `QA.*`, `AEO.*`, `GEO.*`).
4. **Jev client** — `POST https://api.typesafe.ai/v1/systemone`, pin `jev-1.x.x` in prod, batch questions per state.
5. **Confidence router** — Thresholds per question → `auto` | `llm_escalate` | `human`.
6. **Action adapters** — Write dispositions into Search Command artifacts (`DEMAND_LIBRARY`, `strategy-v5.json`, audit findings, ClickUp tasks).
7. **Generation lane** (existing) — LLM only on escalated or generation-required steps.
8. **Eval / calibration loop** — Store (state, answers, human override) → retune thresholds; never silent drift.

### 3.2 Core runtime objects

```ts
type DecisionState = {
  unit_id: string;           // query | url | draft | cluster_pair | finding
  gate: string;              // G3 | AUDIT.tech | QA.content | ...
  evidence: Record<string, unknown>;  // measured fields only
  context?: Record<string, unknown>;  // brand charter excerpts, ICP, exclusions
};

type DecisionPack = {
  id: string;
  version: string;           // pin with model version
  questions: Record<string, NoulQ | ChoiceQ | ScoreQ>;
};

type RoutedDecision = {
  answers: JevAnswers;
  route: "auto" | "llm_escalate" | "human";
  thresholds: Record<string, number>;
  model: string;             // e.g. jev-1.13.0
};
```

### 3.3 Confidence policy (default starting points)

Tune per gate against labeled overrides; start here:

| Signal | Auto | Escalate | Human |
|---|---|---|---|
| `choice.confidence` | ≥ 0.85 | 0.55–0.85 | < 0.55 |
| `score` extreme + conf ≥ 0.8 | auto band | mid band | conflict / low conf |
| `noul` | ≥ 0.85 or ≤ 0.15 | mid | near 0.5 + high stakes (YMYL) |

YMYL / claim / legal gates: **never auto-approve**; Jev only triages severity and routes to the right reviewer.

---

## 4. Decision catalog — mapped to ROI.LIVE work

### 4.1 Search Command SOP (v5 / v5.1) — primary insertion points

| Gate | Jev job | Question types (examples) |
|---|---|---|
| **G0 Source-of-truth** | Is this artifact governing vs proposal vs stale? | `choice`: governing / proposal / superseded / unknown |
| **G1 Territory / ownership** | On-brand territory? Canonical owner? | `noul` on-territory; `choice` owner room |
| **G2 Audience / reader-job** | Which reader job? | `choice` from ICP job enum; `score` fit |
| **G3 Demand integrity / purity** | Wrong sense? Excluded intent? Off-territory? Merge? | Parallel `noul`s + `choice` merge_target / reject_reason |
| **G3 SERP-shape (v5.1)** | Classify `serp_shape` token; AIO citation domain class | `choice` shape taxonomy; `choice` domain_class per citation |
| **G4 Response-unit eligibility** | Page vs section vs tool vs hold…; unit matches SERP? | `choice` response_unit; `noul` unit_fit |
| **G5 Public IA** | Room assignment; cannibal risk vs existing URL | `choice` room; `noul` cannibal_risk |
| **G6 Claim / authority** | Claim class + reviewer path | `choice` claim_class; `score` evidence_strength; **force human if YMYL** |
| **G7 Prioritization** | Priority band given attainability + business value | `score` priority_band (inputs include computed attainability) |
| **G8 Ship** | Ready to ship checklist judgment on soft items | Parallel `noul` checklist; hard measured checks stay code |

**Semantic cannibalization verify** (current LLM agent): replace with Jev `noul` same_serp + `choice` recommended_owner on cluster-pair state. Escalate medium only.

**Purity / shortlist top-row judge** (pre-swarm): Jev batch over shortlist rows — biggest early cost win.

### 4.2 Website audits (SEO + AEO + GEO)

Pattern matching Godshall’s / Wale / Pretzel Pete deliverables:

| Module | Unit | Jev decisions |
|---|---|---|
| **Tech triage** | URL or issue row | Severity `score`; category `choice`; `noul` blocks_indexing |
| **On-page quality** | URL | Intent match `score`; thin/duplicate/outdated `noul`s; primary intent `choice` |
| **Content gap triage** | Competitor keyword / topic | Opportunity `score`; response_unit `choice`; brand-fit `noul` |
| **AEO / AI Overview** | Query × citation set | Cite-worthiness `score`; missing entity/FAQ/schema `noul`s; answer_format `choice` |
| **GEO** | Query × engine (ChatGPT/Perplexity/Gemini) | Citation likelihood `score`; claim_support `noul`; competitor_owns `noul` |
| **Finding dedupe / prioritize** | Finding | Merge `noul`; priority `score`; client-facing vs internal `choice` |
| **Narrative generation gate** | Finding cluster | Only after Jev ranks top-N → LLM writes audit prose |

**Cost idea:** crawl 5k URLs × ~1–2k tokens state ≈ few cents of Jev vs dollars of LLM classification.

### 4.3 Keyword research

| Step | Jev |
|---|---|
| Seed expansion filter | Keep/drop `noul`; sense disambiguation `choice` |
| Intent labeling | `choice` info / commercial / transactional / navigational / local |
| Cluster assignment | `choice` among candidate cluster IDs (≤255) or `other` |
| Parent vs child | `choice` hub / spoke / orphan |
| Funnel stage | `choice` |
| AEO question fitness | `noul` is_question_shaped; `score` answerability |
| GEO entity fitness | `noul` has_clear_entity; `score` brand_association |

Measured volume/KD/SERP stay DataForSEO. Jev only labels and routes.

### 4.4 Content & site QA

| Check | Jev |
|---|---|
| Brief compliance | Parallel `noul`s vs brief checklist |
| Brand voice fit | `score` |
| Intent alignment vs target query | `score` + `noul` matches_primary |
| Cannibal vs URL inventory | `noul` conflicts; `choice` which URL wins |
| E-E-A-T / claim risk | `score` + `choice` reviewer |
| AEO pack completeness | FAQ / direct answer / entities / schema readiness `noul`s |
| Internal link target pick | `choice` among candidate URLs (Screpy pattern) |
| Publish gate | Aggregate soft checks; measured CWV/indexation stay code |

### 4.5 Additional high-leverage opportunities

1. **Intake confirmation pre-check** — Flag incomplete / conflicting intake fields before spend.
2. **Competitor page teardown routing** — Which teardown lens (content / links / UX / AEO).
3. **ClickUp task routing** — Auto-tag SEO vs content vs dev vs legal from finding text.
4. **Respira change QA** — Before/after patch: did we fix the intended issue without regressing?
5. **SERP feature module → playbook** — Map shape token → ROI.LIVE play (local_pack_first, feed_first, aio_citation, etc.).
6. **Answer-engine panel post-filter** — Score L40 raw answers for brand-safe / on-message before they enter the map.
7. **Continuous monitoring** — Nightly re-score priority keywords for SERP-shape drift; alert only on high-conf change.

---

## 5. Reference decision packs (sketches)

### Pack `G3.purity.v1`

State: `{ query, volume, seed_context, brand_territory, exclusions[], sample_serp_titles[] }`

```json
{
  "wrong_sense": { "type": "noul", "instructions": "Does this query use a different sense of the brand/category terms than our territory?" },
  "excluded_intent": { "type": "noul", "instructions": "Does this match an excluded intent in the intake exclusions?" },
  "off_territory": { "type": "noul", "instructions": "Is this outside approved market-entry and adjacent investigation territories?" },
  "disposition": {
    "type": "choice",
    "instructions": "Best demand-library disposition for this row.",
    "criteria": {
      "keep": "Eligible for portfolio consideration",
      "merge": "Same SERP/intent as another row; merge",
      "reject_sense": "Wrong sense",
      "reject_exclusion": "Excluded intent",
      "reject_territory": "Off territory",
      "hold_evidence": "Need more evidence",
      "other": "None of the above"
    }
  }
}
```

### Pack `G3.serp_shape.v1` (v5.1)

State: measured `item_type_composition`, `first_organic_rank_absolute`, AIO observations, citation domains.

```json
{
  "serp_shape": {
    "type": "choice",
    "instructions": "Classify the live SERP shape from measured features only.",
    "criteria": {
      "feature_heavy_local": "local_pack present; location/entity discovery first",
      "feature_heavy_commercial": "shopping/product modules; no local token",
      "aio_dominated": "stable AIO with ≥8 citations and weak/absent organic",
      "informational_clean": "organic ranks 1-3; ordinary informational features"
    }
  }
}
```

Domain class per citation = separate small call or batched state with one `choice` per domain (or map-reduce: score then choose).

### Pack `QA.content_publish.v1`

State: `{ url, target_query, h1, extract, brief_checks[], inventory_neighbors[] }`

Parallel `noul`s: `matches_brief`, `matches_intent`, `has_direct_answer`, `entities_clear`, `cannibal_risk`, `claim_risk_ymyl` + `score` overall_ship_readiness.

### Pack `AUDIT.finding_priority.v1`

State: finding + business goals + impact proxies.

`score` severity, `choice` workstream (tech/content/links/aeo/geo), `noul` client_visible.

---

## 6. Integration with existing Search Command skill

Do **not** rewrite the SOP. Wrap judgment call sites:

| Current | Becomes |
|---|---|
| LLM purity / shortlist judge | `jev.decide("G3.purity.v1", row)` |
| Semantic verify agent | `jev.decide("QA.semantic_cannibal.v1", pair)` |
| SERP-shape token (human/LLM) | `jev.decide("G3.serp_shape.v1", serp_record)` + code for attainability math |
| Response-unit pick | `jev.decide("G4.response_unit.v1", …)` |
| `validate_architecture.py` / gates | Keep deterministic C1–C12; add Jev for soft C-checks |

Artifacts gain:

```json
"judgment": {
  "gate": "G3.purity.v1",
  "model": "jev-1.13.0",
  "answers": { "...": {} },
  "route": "auto",
  "decided_at": "2026-09-21T14:00:00Z"
}
```

Preserve `measured: true` vs `judgment_added: true` labeling — Jev outputs are always judgment_added with machine provenance.

---

## 7. Cost & speed model (order of magnitude)

Assumptions: ~800 tokens state+questions per decision; $0.042 / MTok input.

| Workload | Decisions | Jev cost | Notes |
|---|---|---|---|
| Keyword shortlist 10k rows | 10k | ~$0.34 | vs multi-dollar LLM classify |
| Audit 2k URLs × 1 pack | 2k | ~$0.07 | |
| Semantic cannibal 20 pairs | 20 | ≪ $0.01 | |
| Full Search Command soft gates | ~5–20k | ~$0.20–$1 | Depends on universe size |

**Real savings** = (LLM tokens avoided) + (human hours on triage) + (faster cycle time). Generation LLMs still used for maps, briefs, audit narrative — but on 5–20% of units after confidence routing.

---

## 8. Build plan

### Phase 0 — Foundations (1 week)
- TypeSafe API key + pinned model
- `jev` client lib (TS or Python) with pack registry, logging, override capture
- Eval harness: 200 labeled rows from a past Search Command run (purity + intent)
- Dashboard: auto rate, escalate rate, override rate, cost

### Phase 1 — Highest ROI wedge (2 weeks)
1. **G3 purity + shortlist judge** on next Search Command client  
2. **Semantic cannibal pack** replacing the verify agent for `high` conf  
3. Wire dispositions into `DEMAND_LIBRARY` without changing operator UX

Success: ≥70% auto on purity, ≤5% harmful auto (caught in sample audit), measurable $ and hours down.

### Phase 2 — Audit accelerator (2–3 weeks)
- Ingest crawl + competitor keyword export  
- Packs: tech triage, on-page, gap triage, AEO cite-worthiness, finding priority  
- LLM writes only top findings narrative (Godshall’s-style sections)  
- Optional Respira hook for fix verification

### Phase 3 — QA + AEO/GEO continuous (ongoing)
- Content publish gate in CMS / ClickUp  
- Internal-link target chooser  
- Nightly SERP-shape drift monitor  
- GEO multi-engine citation likelihood scoring

### Phase 4 — Full Search Command Decision Layer
- All G0–G8 soft judgments versioned as packs  
- Pack CI: golden sets must not regress when bumping `jev` version  
- Operator UI: show confidence + one-click override (feeds calibration)

---

## 9. Risks & controls

| Risk | Control |
|---|---|
| Threshold drift when `jev-latest` moves | Pin version; golden-set CI |
| Over-auto on YMYL | Hard policy: claim gates never auto-approve |
| State too thin → bad conf | Feature packers with required measured fields; refuse if missing |
| Treating Jev as writer | Lint: no path from Jev to client-facing prose |
| Silent wrong purity drops | Sample 2% of autos weekly; log overrides |

---

## 10. Naming

**System:** Polaris Decision Fabric (PDF)  
**Runtime:** Search Decision Service (`sds`)  
**Packs:** `gate.pack.version` (e.g. `G3.purity.v1`)  
**Principle:** *Measure what you can. Decide what you must. Generate only what you ship.*

---

## 11. Immediate asks to proceed

1. TypeSafe / Jev access (API key) for ROI.LIVE  
2. Pick Phase 1 client / run folder for purity labeling  
3. Confirm stack preference: extend `str-search-command` Python scripts vs new TS service  
4. Whether audit accelerator (Phase 2) should target Bergey-style competitive audits or live-site technical audits first
