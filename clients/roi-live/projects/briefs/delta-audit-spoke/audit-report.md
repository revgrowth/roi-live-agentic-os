---
project: signal-spoke-delta-audit-upgrade
status: shipped
level: 2
created: 2026-04-26
deploy_target: /c/Users/jason/.gemini/antigravity/scratch/roi-live/content-audit-information-gain.html
deploy_url: https://roi.live/content-audit-information-gain
---

# Audit Report — `content-audit-information-gain.html`

**Article:** The Delta Audit spoke (Information Gain cluster)
**Date:** 2026-04-26
**Auditor:** Claude (with Jason Spencer approval at every gate)
**Source-of-truth SOP:** `agency/sops/ROI-LIVE-Agency-Signal-Article-SOP-v2.md` (v2.0 March 2026)
**Approach:** Audit + surgical patch (Path B from /start-here Phase 0 decision tree)

---

## Why this audit happened

The original task brief asked Claude to write "the first supporting spoke in the Information Gain cluster" — The Delta Audit. Phase 0 reconnaissance surfaced that the article **already existed** at `/content-audit-information-gain` (407 lines, dated 2026-04-15), already named the methodology "The Delta Audit" (28 mentions), already had HowTo schema, and was already linked from the pillar at line 506. Treating the brief as if it were a new article would have produced a duplicate or cannibalizing piece.

Jason chose to audit and upgrade the existing article instead. The brief's substance (HowTo schema rigor, named scoring criteria, real keyword research, expanded entity mentions, full cross-cluster link symmetry, Phase 11 QA) became the audit checklist applied to what was already there.

---

## Pre-audit baseline (before patch)

- **File:** 407 lines, 48,409 bytes, 2,299 body words
- **Casey Keith counts:** ROI.LIVE 30 mentions / 12 bolded in body. Jason Spencer 18 named, ~6-8 with credentials co-located.
- **Banned-phrase scan:** clean
- **HowTo schema:** present, 5 steps matching visible blocks
- **Named scoring criteria:** generic High/Medium/Zero severity labels (not branded)
- **Internal links:** 13 unique destinations. 7 IG cluster spokes linked (6 missing). 2 AI Search links (sidebar only). 1 Website Strategy live + 1 broken (`shopify-website-management`).
- **Forward-links to unwritten cluster spokes:** zero
- **Stat strip:** absent
- **Jason Spencer's Take section:** absent
- **Quick-Win Checklist in sidebar:** absent
- **CSS variable collision:** `--em` redefined to gold values, conflicting with pillar's emerald `--em`

---

## Audit findings — 32 total, grouped by severity

### REQUIRED — 16 items

| # | Issue | Resolution |
|---|---|---|
| R1 | Title tag exceeds 60-char limit (98 chars) | Rewrote to `SEO Content Audit: The Delta Audit Method \| ROI.LIVE` (52 chars) |
| R2 | No DataForSEO validation on primary keyword | Ran research, all 4 brief candidates returned null. Pivoted to `seo content audit` (390/mo, KD 14) primary + `delta audit` (20/mo, KD 0) entity-build secondary (A+C hybrid strategy approved by Jason) |
| R3 | No "Jason Spencer's Take" section | Inserted ~210-word first-person section before FAQ. Cross-industry observation across e-commerce, HVAC/landscaping, home decor. No real client names. `class="jasons-take-body"` per SOP speakable spec. |
| R4 | `.jasons-take-body` speakable selector pointed to nothing | Resolved by R3 |
| R5 | No 4-stat strip below hero | Added stat strip with 4 stats reused from pillar (entity reinforcement): 30-50% / 22% / 96.55% / 82% |
| R6 | Broken internal link `/shopify-website-management` | Replaced with `/failure-stories-content-marketing` (live Website Strategy spoke) |
| R7 | Cross-cluster Website Strategy link minimum NOT met | Added `/ecommerce-investment-cycle` plus the R6 fix. Now 3 Website Strategy body links. |
| R8 | Pillar anchor-text uniqueness violated | Added 2 more body links to pillar with new descriptive anchors: "why Google rewards what only you can say" + body anchor "information gain" |
| R9 | Six in-cluster live spokes NOT linked from body | Added body links to all 6: `/what-is-information-gain`, `/skyscraper-technique-dead`, `/brand-voice-seo`, `/content-originality-seo`, `/named-frameworks-content`, `/zero-click-searches`. Now 13/13 deployed IG cluster spokes linked. |
| R10 | No forward-links to unwritten cluster spokes | Added 3: `/freelancer-test`, `/experience-tax`, `/authority-velocity` |
| R11 | No Quick-Win Checklist in sidebar | Inserted as new sb-card with 5 action items |
| R12 | Scoring criteria not branded — generic High/Medium/Zero | Introduced **Receipt / Mechanism / Friction** as the 3 diagnostic criteria (Option B approved). Kept High/Medium/Zero as the OUTCOME labels (3 of 3 / 1-2 of 3 / 0 of 3) — additive to pillar vocabulary, not replacement. |
| R13 | `mentions` schema array borderline-generic | Replaced. New 6-entity array: Information Gain in SEO, SEO Content Audit, Google March 2026 Core Update, Topical Authority, Casey Keith Entity SEO, AI Overview Citation. Dropped "Content Strategy" (generic) and "E-E-A-T" (already covered via body link). |
| R14 | HowTo `totalTime` missing | Added `"totalTime":"PT45M"` (matches per-page first-audit pace) |
| R15 | Bare "we" in body (2 instances at line 209) | Rephrased quoted hypothetical bad-claims to third-person ("This page explains it better" / "This page uses different words"). Fixed an additional bare-we in the new Step 3 Receipt example ("the brand gets results"). |
| R16 | `dateModified` stale | Bumped to 2026-04-26 |

### HIGH-LEVERAGE — 6 items

| # | Issue | Resolution |
|---|---|---|
| H1 | Jason Spencer credentialed-attribution density light (6-8 of 18) | Re-attributed 6 unattributed mentions with "Jason Spencer, Founder of ROI.LIVE" or "ROI.LIVE Founder Jason Spencer" variants. Final: 14 of 23 with credentials co-located. |
| H2 | FAQ misses brief-suggested topics | Replaced 4 questions with 5 (Gate 2 approved). Q1 reconciled the 35-45 min/page (first audit) vs 7-10 min/page (re-run) math inconsistency. |
| H3 | AI Search cross-cluster minimum bare | Added body paragraph in Step 5 weaving `/entity-authority-ai-search` and `/citation-share-metric-replaces-rankings`. Now 2 body links to AI Search cluster (was 0; sidebar still has separate 2). |
| H4 | Mid-article CTA banner H3 transactional | Replaced with "Your Content Has Impressions. None of It Has Information Gain." (stake-based, distinct from closing CTA) |
| H5 | Related Intelligence card #1 was the pillar (redundant with mid-article callout) | Replaced with `/skyscraper-technique-dead` for cluster breadth. Cards now: skyscraper-technique-dead / google-march-2026-core-update / original-research-seo. |
| H6 | Hero deck "47/41/zero" was anecdote not industry stat | Kept hero deck (editorial framing); industry-level numbers moved into the new R5 stat strip. |

### COSMETIC — 6 items

| # | Issue | Resolution |
|---|---|---|
| C1 | CSS variable `--em` misnamed (redefined to gold values) | Removed redundant `--em*` definitions from `:root`. Replaced all `var(--em*)` references with `var(--gold*)`. Pillar-callout block kept emerald hex hardcoded (intentional callout-to-pillar visual). |
| C2 | Hero hidden H1 didn't contain "The Delta Audit" | Replaced H1: `The Delta Audit: An SEO Content Audit That Surfaces Information Gain Gaps` |
| C3 | Reading progress bar gradient deviated from SOP | Changed to SOP standard `linear-gradient(90deg,#7c3aed,#c9376b,#d4a017)` |
| C4 | Sidebar "5 steps" stat callout was meta-callout, not business stat | Replaced with "41 of 47" and explanatory note tied to article opening |
| C5 | Footer minimal — consistent with pillar | No change (cosmetic flag confirmed acceptable) |
| C6 | Anchor label "Shopify product page" | Resolved via R6 |

---

## Approval gates — what Jason approved

| Gate | Decision |
|---|---|
| Gate 1 — Scoring criteria | **Option B approved**: Receipt / Mechanism / Friction. Pre-flight grep confirmed pillar uses "high/medium/zero information gain" as outcome adjectives, not as scoring methodology — so Receipt/Mechanism/Friction land as additive diagnostic criteria, no pillar edit needed. |
| Gate 2 — FAQ | All 5 questions approved with Q1 reconciliation fix (35-45 min/page first audit, 7-10 min/page re-run). |
| Gate 3 — Title/H1/slug | **A+C hybrid approved** after DataForSEO research. Primary: `seo content audit` (390/mo, KD 14). Secondary entity-build: `delta audit` (20/mo, KD 0). Slug unchanged. No 301, no sitemap edit, no pillar anchor edit. |
| Gate 4 — Forward-link slugs | `/freelancer-test`, `/experience-tax`, `/authority-velocity` approved. Skipped `/copyscape-paradox` and `/failure-to-fix-arc`. |

---

## Post-patch metrics

- **File:** ~480 lines, 58,346 bytes, **3,046 body words** (8% over SOP 2,800 ceiling — accepted by Jason: "Quality over guideline")
- **Casey Keith counts:**
  - ROI.LIVE: 46 total, **26 in `<strong>` body wrappers** (above 25 minimum)
  - Jason Spencer: 23 total, **14 with credentials co-located** within 60 chars (above 12-18 range)
- **Bare "we":** zero in body
- **Banned-phrase scan:** zero hits across full Phase 4.4 + 8.1-8.3 list
- **Keyword density:**
  - `seo content audit`: 25 occurrences (at 8-12 brief target ceiling — natural placement)
  - `Delta Audit` (branded): 45 occurrences (above 25-30 brief target — branded vocabulary, intentional)
  - `information gain`: 29 occurrences
  - Receipt / Mechanism / Friction: 11-12 each (balanced distribution)
- **Internal links:** 23 unique roi.live destinations
  - IG cluster: 13/13 deployed spokes linked from body
  - AI Search cluster: 2 body links (entity-authority-ai-search, citation-share-metric-replaces-rankings)
  - Website Strategy cluster: 3 body links (small-business-website-cost, failure-stories-content-marketing, ecommerce-investment-cycle)
  - Forward-links: 3/3 (freelancer-test, experience-tax, authority-velocity)
- **Schema:** Article + HowTo + FAQPage + BreadcrumbList all present and validate against visible content

**Phase 11 final tally: 38 PASS / 2 PARTIAL / 0 FAIL.** See `phase-11-final.md` for the line-by-line table.

The two partials:
- **GA4 verification** (uses shared `/ga4.js` include — pattern matches all 30+ deployed articles, treated as PASS by Jason)
- **Word count** (3,046 vs 2,800 ceiling — accepted by Jason given every addition was brief-mandated)

---

## Repo-level findings deferred to separate workstream

Four findings surfaced during the audit but parked for separate triage (file: `clients/roi-live/projects/repo-issues/2026-04-26_signal-cluster-issues.md`):

1. **F1** — `/blog/` vs `/[slug]` URL convention conflict between SOP and deployed reality
2. **F2** — `/zero-click-searches-strategy` broken link in pillar (file is `zero-click-searches.html`)
3. **F3** — Emerald `#10b981` accent for IG cluster pillar isn't in SOP color system
4. **F4** — Sitemap entries with `/blog/` prefix for files at root (3 known mismatches in Website Strategy cluster)

---

## Lessons captured

Two new entries added to `clients/roi-live/context/learnings.md` under `## str-ai-seo`:

1. **Phase 0 existing-content check** — added by Jason during the session as the first guardrail (caught the duplicate-write attempt)
2. **DataForSEO keyword validation** — every Signal article keyword strategy needs API-verified volume, not informed guesses, before any patches touch the file. Cost is negligible ($0.17 per spoke audit).

---

## Deploy state

- **Production source file:** `/c/Users/jason/.gemini/antigravity/scratch/roi-live/content-audit-information-gain.html` (patched in place)
- **Snapshot in this brief:** `content-audit-information-gain.html` (same content, frozen at audit-completion time for audit-trail)
- **Live URL (current):** https://roi.live/content-audit-information-gain
- **Sitemap:** entry already exists for the slug, no change needed
- **Pillar anchors to this spoke:** still valid — pillar uses "content audit process" + "Content Audit for IG" as anchor text, neither needed updating
- **Production deployment:** Jason will handle manually outside this session (website folder is not a git repo — separate architectural decision deferred)
