# Pack catalog

Ids are `gate.pack.version`. Questions are Jev `noul` | `choice` | `score` only.

## Search Command

| Pack | Required evidence | Job |
|------|-------------------|-----|
| `G0.source_of_truth.v1` | artifact_role, artifact_excerpt | governing / proposal / superseded / unknown |
| `G1.territory.v1` | query, brand_territory | on-territory noul + owner room |
| `G2.audience_job.v1` | query | reader job + ICP fit score |
| `G3.purity.v1` | query | wrong sense / exclusion / territory / disposition |
| `G3.serp_shape.v1` | query | v5.1 shape token + AIO domain class |
| `G4.response_unit.v1` | query | page/section/tool/hold + unit_fit |
| `G5.public_ia.v1` | query | room + cannibal noul |
| `G6.claim_authority.v1` | query | claim class + evidence. Never auto. |
| `G7.priority.v1` | query | priority band (uses computed attainability) |
| `G8.ship_soft.v1` | query | soft checklist nouls |
| `QA.semantic_cannibal.v1` | query_a, query_b | same_serp noul + recommended_owner |

## Keyword

| Pack | Job |
|------|-----|
| `KW.keep_drop.v1` | keep noul + sense |
| `KW.intent.v1` | info / commercial / transactional / navigational / local |
| `KW.cluster_assign.v1` | choice among `candidate_clusters` (dynamic, ≤255) |
| `KW.hub_spoke.v1` | hub / spoke / orphan |
| `KW.funnel.v1` | funnel stage |
| `KW.aeo_question.v1` | question-shaped + answerability |
| `KW.geo_entity.v1` | entity noul + brand association |

Volume, KD, and live SERP stay measured.

## Audit

| Pack | Unit | Job |
|------|------|-----|
| `AUDIT.tech_severity.v1` | URL / issue | severity, category, blocks_indexing |
| `AUDIT.onpage_quality.v1` | URL | intent match, thin/dup/outdated |
| `AUDIT.content_gap.v1` | competitor query | opportunity, unit, brand-fit |
| `AUDIT.aeo_cite.v1` | query × page | cite-worthiness, missing FAQ/entity/schema |
| `AUDIT.geo_citation.v1` | query × engine | citation likelihood |
| `AUDIT.finding_priority.v1` | finding | merge, priority, visibility, workstream |

LLM narrative is a later step on top-N findings only. This pack does not write it.

## QA

| Pack | Job |
|------|-----|
| `QA.brief_compliance.v1` | brief checklist nouls |
| `QA.intent_match.v1` | matches_primary + alignment score |
| `QA.aeo_pack.v1` | direct answer / entities / FAQ / schema |
| `QA.content_publish.v1` | publish soft-gate + ship readiness |
| `QA.internal_link.v1` | choice among `candidate_urls` |
| `QA.eeat_claim.v1` | claim risk + reviewer. Never auto. |
| `QA.voice_fit.v1` | voice score only |

## Ops / extra

`INTAKE.precheck.v1`, `COMP.teardown_lens.v1`, `OPS.clickup_route.v1`, `AEO.panel_filter.v1`, `G3.serp_drift.v1`, `RESPIRA.patch_qa.v1`.
