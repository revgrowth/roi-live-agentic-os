# ROI.LIVE Agency Client Onboarding SOP v1.0

**Last updated:** 2026-05-12
**Authority:** Agency-level. Applies to all new client onboardings into Agentic OS.
**Pattern source:** Codified from G&H (April 2026), ALVARA (April 2026), GLC (April 2026), and Blue Tree (May 2026) onboardings.

## Purpose

Every new ROI.LIVE client gets a structured onboarding into Agentic OS following the four-phase pattern below. This SOP captures the pattern so future onboardings are repeatable and consistent. The output of a successful onboarding is a fully populated `clients/{slug}/` workspace with brand_context, standards, context, projects, and AGENTS.md ready for production work.

## Variant detection

Three onboarding variants based on source-material maturity at intake. Detect at start; route to the appropriate variant.

### Variant A — Raw-source onboarding

Client provides raw materials (transcripts, founder interviews, brand voice samples, competitive analysis) but no consolidated brand voice document. Voice extraction is part of the onboarding.

- **Example:** GLC (April 2026)
- **Phase 2 emphasis:** Voice extraction from raw materials. Tight index and full voice profile both built from scratch.
- **Estimated total time:** 8 to 12 hours of Claude Code work plus Jason review cycles.

### Variant B — Partial-source onboarding

Client provides a brand voice document plus raw materials. The voice doc has gaps or hasn't been audited against source.

- **Example:** ALVARA (April 2026), G&H (April 2026)
- **Phase 2 emphasis:** Audit existing voice doc against raw materials. Resolve conflicts; fill gaps. Standardize structure.
- **Estimated total time:** 6 to 10 hours of Claude Code work.

### Variant C — Pre-built-master-doc onboarding

Client arrives with a complete master brand voice document (DNA Guide or equivalent). Voice extraction is unnecessary; the work is decompose-and-restructure-into-Agentic-OS-architecture.

- **Example:** Blue Tree (May 2026)
- **Phase 2 emphasis:** Decompose master doc into Agentic OS brand_context structure. Tight index derived from full doc; positioning, ICP, samples, assets all derive from the master.
- **Estimated total time:** 4 to 8 hours of Claude Code work, but the operational layer (Phase 3) can be larger if the client engagement is full-stack with many service lines.

## Four-phase structure (applies to all variants)

### Phase 1 — Intake + Conflict Map

**Goal:** Take stock. Identify what exists, what conflicts, what's missing.

Tasks:

1. Scaffold integrity check (verify client folder structure)
2. Scaffold contamination check (grep `learnings.md` for other-client references; wipe if found)
3. File inventory and naming verification
4. Source material read with provenance capture
5. Conflict map produced at `context/onboarding/phase-1-conflict-map.md`
6. Open question list surfaced for Jason ruling

Conflict map dimensions (apply all that fit):

- A: Master voice doc vs. legacy/superseded voice doc
- B: Voice doc vs. sitemap
- C: Voice doc vs. client feedback master reference
- D: Voice doc vs. raw transcripts (spot check)
- E: Citation Discipline SOP applicability + source tier mapping
- F: Missing inputs
- G: Promotion candidates (agency-level reusable patterns)

**Checkpoint:** Jason rules on conflicts before Phase 2 begins.

### Phase 2 — Brand Context Derivation

**Goal:** Build the five `brand_context/` files plus `voice-recordings-reference.md`. Wipe `learnings.md`. Clean up master doc.

- **Variant A:** Voice extraction from raw materials (Phase 2A reads all sources; Phase 2B derives five files).
- **Variant B:** Voice audit + gap-fill (Phase 2A surfaces conflicts between doc and source; Phase 2B derives standardized files).
- **Variant C:** Master decompose (Phase 2A archives supporting materials including creative briefs via ClickUp MCP; Phase 2B derives five files referencing the master).

Required outputs (all variants):

- `brand_context/voice-profile.md` (tight index, 6 to 12 KB)
- `brand_context/voice-profile-full-{version}.md` (full reference)
- `brand_context/positioning.md`
- `brand_context/icp.md`
- `brand_context/samples.md`
- `brand_context/assets.md`
- `inputs/source-materials/voice-recordings-reference.md` (or equivalent) — real index, not duplicate
- `context/learnings.md` — wiped to clean shell

**Checkpoint:** Jason rules on any ambiguities surfaced before Phase 3.

### Phase 3 — Operational Layer

**Goal:** Build the operational scaffolding so the engagement runs cleanly from this point forward.

Tasks:

1. Apply any v1.x cleanup edits from Phase 2 rulings
2. Build `context/engagement-status.md` (single-page operational snapshot)
3. Build `brand_context/services.md` (engagement scope-of-work)
4. Build `standards/client-parameter-sheet.md` (from agency template, populated from voice doc)
5. Build `projects/` subdirectories for any recurring deliverables (Fractional CMO Dashboard project folder if applicable)
6. Build `context/errata-consolidated.md` (single source of truth for known errata)

**Checkpoint:** Jason reviews operational layer before Phase 4.

### Phase 4 — Final Close

**Goal:** Customize agent instructions, build editorial overlay, resolve mechanical errata, create PR.

Tasks:

1. Customize `AGENTS.md` (client-specific overrides on agency inheritance)
2. Build `standards/editorial-overlay.md` (extends Citation Discipline SOP with client-specific source tiers, review chain, hallucination catalog, YMYL protocol)
3. Resolve mechanical errata from `errata-consolidated.md` (sitemap typos, brief corrections, anything that doesn't require client decision)
4. Draft courtesy notes for any client-facing changes (sitemap revisions need a note to the contract holder or approver)
5. Draft any agency-level SOPs promoted from the onboarding (this SOP, plus any new patterns discovered)
6. Create PR with comprehensive description; merge

**Checkpoint:** Final review before merge.

## Cross-cutting principles

### Phase 0 reconnaissance (every task)

Every content task starts by checking whether the work has already been done. Before drafting:

1. Does this article or page already exist in the website repo?
2. What existing brand context applies?
3. What inputs are missing?
4. What SOP governs this deliverable type?

### Feature branch + PR discipline

All onboarding work happens on `feature/onboard-{client-slug}`. Direct commits to main are not allowed. PR description carries the engagement audit trail.

### Cascading-edit authorization

By Phase 3, Claude Code is authorized to make internal-consistency edits without per-instance approval. By Phase 4, broader cleanup authorizations apply. Document each cascade in changelogs and in the audit-trail entry of the resolved erratum.

### Stop Slop applies throughout

Every prose deliverable (engagement-status, services, editorial overlay, courtesy notes, this SOP itself) follows Core Standards §8 writing rules: no em dashes, no -ly adverbs, no softeners, no throat-clearing openers, no banned marketing phrases, no three-item lists.

## Promotion candidate identification

Every onboarding generates at least two or three promotion candidates for agency-level SOPs. The Blue Tree onboarding surfaced six:

- G1: Voice Attribution Hierarchy (advance to standalone SOP)
- G2: Schema-Voice Alignment (advance as Core Standards extension or standalone SOP)
- G3: Multi-Author E-E-A-T Architecture (HOLD — single instance; promote on 2nd instance)
- G4: Trade-Vertical Source Tier mapping (advance as Citation Discipline SOP appendix)
- G5: YMYL Protocol for trade-vertical safety adjacencies (advance to standalone SOP)
- G6: Fractional CMO Dashboard SOP (HOLD — single instance; promote on 2nd FCMO client)

When patterns reach 2+ instances across clients, promote.

## Variant-specific notes

### Variant C ClickUp brief archival

For Pre-built-master-doc onboardings where the client has an active ClickUp project with creative briefs in ClickUp Docs:

- Use ClickUp MCP to pull all Docs, not task descriptions (task descriptions are often empty pointers to linked Google Docs).
- Hard-gate on `hierarchy.category.id` to prevent cross-client contamination (workspace-level Docs include other clients).
- Apply content-gate identifier check (at least 2 distinct client identifiers OR at least 2 brand-name occurrences) for workspace-level Docs without a category.
- Deduplicate by normalized title plus content MD5 hash.
- Archive duplicates and superseded versions in separate folders (`_duplicates/`, `_superseded/`) for audit.
- Output an `INDEX.md` that catalogs canonical briefs, dup audit, and SKIP audit trail.

### Recurring-deliverable project folders

When a client has a recurring deliverable (monthly Fractional CMO Dashboard, weekly content batch), build a project folder under `projects/{deliverable-slug}/` with:

- `sops/` — operating procedures
- `canonical-numbers/` or `source-data/` — per-cycle inputs
- `deliverables/{YYYY-MM}/` — per-cycle outputs

### Parallel work delegation

For phases with high context burden (Phase 2 derivation, Phase 3 operational layer, Phase 4 final close), delegate the heavy work to a general-purpose subagent. Main thread orchestrates and verifies. Pattern: main thread does pre-cleanup and git operations directly; subagent handles content authoring.

Watch for subagent stream timeouts on very long runs. If a subagent times out mid-task, verify partial outputs on disk before re-dispatching or completing in main thread.

## Changelog

### v1.0 — 2026-05-12

Initial SOP. Promoted from Blue Tree onboarding (May 2026), with patterns also drawn from G&H, ALVARA, and GLC onboardings (all April 2026).
