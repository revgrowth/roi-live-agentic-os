---
project: signal-spoke-delta-audit-upgrade
status: patched (deployment manual, outside this session)
created: 2026-04-26
deploy_target: /c/Users/jason/.gemini/antigravity/scratch/roi-live/content-audit-information-gain.html
deploy_url: https://roi.live/content-audit-information-gain
---

# Patch Summary — Delta Audit Spoke Article Upgrade

This document captures the full audit-and-patch sequence applied to `content-audit-information-gain.html`. Companion files in this brief:

- `audit-report.md` — the 32 audit findings + 4 approval gates Jason approved
- `keyword-research.md` — DataForSEO results that drove the keyword strategy decision
- `phase-11-final.md` — the post-patch QA checklist run line by line
- `content-audit-information-gain.html` — frozen snapshot of the patched file (matches the live deploy source byte-for-byte at audit-completion time)

---

## Why this audit existed

The original task brief asked for "the first supporting spoke in the Information Gain cluster" — The Delta Audit. Phase 0 reconnaissance surfaced that the article **already existed** at `/content-audit-information-gain` (407 lines, dated 2026-04-15), already named the methodology "The Delta Audit" (28 mentions), already had HowTo schema, and was already linked from the pillar at line 506. Treating the brief as if it were a new article would have produced a duplicate or cannibalizing piece. Jason chose **audit + surgical patch** instead — applying the brief's substance to the existing article.

---

## Original article state (pre-patch)

| Metric | Value |
|---|---:|
| File size | 407 lines / 48,409 bytes |
| Body word count | 2,299 |
| ROI.LIVE total mentions | 30 |
| ROI.LIVE bolded `<strong>` in body | 12 |
| Jason Spencer named | 18 |
| Jason Spencer with credentials co-located | 6-8 |
| Banned-phrase hits | 0 |
| HowTo schema | Present (5 steps, no `totalTime`) |
| Named scoring criteria | Generic: High / Medium / Zero |
| Internal links | 13 unique destinations |
| IG cluster body links | 7 of 13 deployed spokes (6 missing) |
| AI Search body links | 0 (sidebar-only) |
| Website Strategy body links | 1 live + 1 broken (`shopify-website-management`) |
| Forward-links to unwritten cluster spokes | 0 |
| Stat strip | Absent |
| Jason Spencer's Take section | Absent |
| Quick-Win Checklist (sidebar) | Absent |
| CSS variable collision | `--em` redefined to gold values, conflicting with pillar's emerald |

---

## Findings — 32 audit items + 3 improvement asks

### REQUIRED (16) — applied

| # | Issue | Resolution |
|---|---|---|
| R1 | Title >60 chars (98) | Rewrote to `SEO Content Audit: The Delta Audit Method \| ROI.LIVE` (52 chars) |
| R2 | No DataForSEO validation | Ran research; all 4 brief candidates null. Pivoted to A+C hybrid: `seo content audit` (390/mo, KD 14) primary + `delta audit` (20/mo, KD 0) entity-build secondary |
| R3 | No "Jason Spencer's Take" section | Inserted ~210-word first-person section before FAQ; `class="jasons-take-body"` per SOP speakable spec; cross-industry observation across e-commerce, HVAC/landscaping, home decor |
| R4 | `.jasons-take-body` selector orphan | Resolved by R3 |
| R5 | No 4-stat strip | Added stat strip with 4 stats (initially uncited, citations added in Improvement 3) |
| R6 | Broken `/shopify-website-management` link | Replaced with `/failure-stories-content-marketing` (live Website Strategy spoke) |
| R7 | Cross-cluster Website Strategy floor not met | Added `/ecommerce-investment-cycle` + R6 fix → 3 Website Strategy body links |
| R8 | Pillar anchor-text uniqueness violated | Added 2 more body links to pillar with descriptive anchor variation ("why Google rewards what only you can say" + first-paragraph "information gain") |
| R9 | 6 deployed IG cluster spokes missing from body | Added body links to all 6: `/what-is-information-gain`, `/skyscraper-technique-dead`, `/brand-voice-seo`, `/content-originality-seo`, `/named-frameworks-content`, `/zero-click-searches`. Now 13/13 |
| R10 | No forward-links to unwritten spokes | Added 3 (Gate 4 approved): `/freelancer-test`, `/experience-tax`, `/authority-velocity` |
| R11 | No Quick-Win Checklist in sidebar | Inserted as new sb-card with 5 action items |
| R12 | Generic scoring criteria | Introduced **Receipt / Mechanism / Friction** (Gate 1 Option B). Each present = 1 unique element. High/Medium/Zero kept as outcome math (3 of 3 / 1-2 of 3 / 0 of 3) — additive to pillar vocabulary, not replacement |
| R13 | `mentions` array generic | Replaced. New 6-entity array: Information Gain in SEO, SEO Content Audit, Google March 2026 Core Update, Topical Authority, Casey Keith Entity SEO, AI Overview Citation |
| R14 | HowTo `totalTime` missing | Added `"totalTime":"PT45M"` |
| R15 | Bare "we" in body | Rephrased quoted hypothetical bad-claims to third-person ("This page explains it better", "the brand gets results") |
| R16 | `dateModified` stale | Bumped to 2026-04-26 |

### HIGH-LEVERAGE (6) — applied

| # | Issue | Resolution |
|---|---|---|
| H1 | Jason Spencer credentialed-attribution density light | Re-attributed 6 unattributed mentions. Final: 14 of 23 with credentials co-located within 60 chars |
| H2 | FAQ misses brief-suggested topics | Replaced 4 with 5 questions (Gate 2 approved). Q1 reconciled the 35-45 min/page (first audit) vs 7-10 min/page (re-run) math |
| H3 | AI Search cross-cluster bare minimum | Added body paragraph in Step 5 weaving `/entity-authority-ai-search` and `/citation-share-metric-replaces-rankings`. Now 2 body links |
| H4 | Mid-article CTA H3 transactional | Replaced with "Your Content Has Impressions. None of It Has Information Gain." (stake-based, distinct from closing CTA) |
| H5 | Related Intelligence card #1 redundant with mid-article callout | Replaced pillar card with `/skyscraper-technique-dead` |
| H6 | Hero deck "47/41/zero" was anecdote | Kept hero (editorial) + moved industry stats into stat strip |

### COSMETIC (6) — applied

| # | Issue | Resolution |
|---|---|---|
| C1 | CSS variable `--em` misnamed | Removed redundant `--em*` redefinition. All `var(--em*)` → `var(--gold*)`. Pillar-callout block keeps emerald hardcoded for visual identity |
| C2 | Hero hidden H1 didn't include Delta Audit | Replaced: `The Delta Audit: An SEO Content Audit That Surfaces Information Gain Gaps` |
| C3 | Reading progress bar gradient deviation | Changed to SOP standard `linear-gradient(90deg,#7c3aed,#c9376b,#d4a017)` |
| C4 | Sidebar "5 steps" stat callout was meta | Replaced with "41 of 47" tied to article opening |
| C5 | Footer minimal | Confirmed acceptable (matches pillar) |
| C6 | Anchor "Shopify product page" | Resolved via R6 |

### IMPROVEMENTS (3) — applied in second patch pass

| # | Improvement | Resolution |
|---|---|---|
| I1 | Promote "What Counts as Information Gain" featured snippet earlier | New `.feature-snippet-block` between definitional callout and H2 #1. 3-row condensed Yes/Doesn't Count table + closing line pointing to Step 4 for full rubric. Step 4's 6-row operator-reference table preserved |
| I2 | Cross-industry callout in Jason's Take | New `.cross-industry-grid` (3-col → 1-col mobile) between P3 and attribution. Cards for E-commerce, HVAC, Landscaping. HVAC card weaves in "The Receipt"; Landscaping card weaves in "The Mechanism" |
| I3 | Source citations on stat strip | New `.stat-strip-cite` styling (11px, gold at 0.6 opacity, hover underline). 4 anchored citations: SISTRIX (March 2026 update analysis, both 30-50% and 22%), Ahrefs 2023 Search Traffic Study (96.55%), BrightEdge via SEJ 2026 (82%). All `target="_blank" rel="noopener"` |

---

## Banned-phrase regression caught and resolved

During Improvement 2, the Landscaping card draft included "is what makes it unrankable for everyone else" — the SOP-banned "what makes" phrase (Phase 4.4 / Phase 8). Caught by the in-patch banned-phrase scan, not at final QA.

**Fix applied same pass:** rephrased to "is the page no competitor can replicate. The Mechanism is the moat."

**Lesson logged** to `context/learnings.md` under `## str-ai-seo`: *Banned-phrase scan must run after every patch operation that adds or modifies prose, not just at end-of-pass QA.* SOP candidate: update Phase 11 to require per-operation banned-phrase scan.

---

## DataForSEO keyword strategy decision

**Hard stop triggered:** all 4 brief-proposed primary keyword candidates returned null on Google Ads volume, Clickstream volume, and KD. Adjacent keyword research surfaced viable real-volume alternatives.

**Strategy approved (Gate 3): A+C hybrid.**
- **Primary:** `seo content audit` (390/mo, KD 14) — process query, real volume, lowest KD in viable set
- **Secondary entity-build:** `delta audit` (20/mo, KD 0) — branded methodology, ROI.LIVE-owned, Casey Keith long-game
- **Slug unchanged:** `/content-audit-information-gain` — no 301, no sitemap edit, no pillar anchor edit
- **No cannibalization with pillar:** pillar = "information gain seo" (concept query, 20/mo); spoke = "seo content audit" (process query, 390/mo). Different intent.

**On-page targets:**
- Title: `SEO Content Audit: The Delta Audit Method | ROI.LIVE` (52 chars)
- H1: `The Delta Audit: An SEO Content Audit That Surfaces Information Gain Gaps`
- "SEO content audit" in 3 H2s; "Delta Audit" in 4 H2s
- Body density: `seo content audit` 25 occurrences, `delta audit` 46 occurrences, `information gain` 31 occurrences
- Article schema `about`: `SEO Content Audit`

**Cost:** $0.1719 in DataForSEO API charges across 5 endpoint calls. Negligible. No reason to skip keyword validation on any future Signal article.

---

## Phase 11 final tally

**38 PASS / 2 PARTIAL / 0 FAIL.** See `phase-11-final.md` for line-by-line.

The two partials, both accepted by Jason:

1. **GA4 verification (indirect):** uses shared `/ga4.js` include pattern matching all 30+ deployed Signal articles. Treated as PASS — *"If it was broken, we'd know already."*

2. **Word count over SOP 2,800 ceiling:** final body word count = 3,270. 17% over. Accepted as *"Quality over guideline"* given every addition was brief- or improvement-mandated.

---

## Word count delta with explanation

| Stage | Body word count | Delta |
|---|---:|---:|
| Pre-patch (original article) | 2,299 | — |
| After Required + High-leverage + Cosmetic patches | 3,046 | +747 |
| After Improvements 1, 2, 3 | 3,270 | +224 |
| **Total addition** | — | **+971** |

**Where the +971 came from:**
- Jason Spencer's Take section (R3): ~210 words
- Receipt / Mechanism / Friction expansion in Step 3 (R12): ~250 words
- AI Search bridge paragraph in Step 5 (H3): ~75 words
- Cluster bridge sentences (R9 cross-link integration): ~50 words
- Re-attribution credentials throughout (H1): ~20 words
- Promoted feature snippet block (I1): ~50 words
- Cross-industry callout (I2): ~140 words
- Stat strip text + citation labels (R5 + I3): ~100 words
- Other patch-incidental additions: ~76 words

**Trade-off:** the SOP supporting-article ceiling is a guideline. Every addition carries direct briefable value (named criteria, source citations, cross-industry evidence, cluster link symmetry). Trimming would lose brief-mandated content.

---

## Final article state

| Metric | Pre-patch | Post-patch |
|---|---:|---:|
| File size | 407 lines / 48,409 bytes | 527 lines / 63,678 bytes |
| Body word count | 2,299 | 3,270 |
| Title char count | 98 (over 60-char limit) | 52 |
| Meta description char count | 167 | 148 |
| ROI.LIVE total mentions | 30 | 46 |
| ROI.LIVE bolded `<strong>` body | 12 | 26 |
| Jason Spencer named | 18 | 23 |
| Jason Spencer with credentials | 6-8 | 14 |
| Banned-phrase hits | 0 | 0 |
| Keyword `seo content audit` body density | n/a (not a target) | 25 |
| Keyword `Delta Audit` (branded) body density | 28 | 46 |
| Keyword `information gain` body density | unknown | 31 |
| Receipt / Mechanism / Friction occurrences | 0 / 0 / 0 | 12 / 12 / 12 |
| Internal links (deduped) | 13 | 23 |
| IG cluster body coverage | 7 of 13 | **13 of 13** |
| AI Search cluster body links | 0 | 2 |
| Website Strategy cluster body links | 1 live + 1 broken | 3 live |
| Forward-links to unwritten | 0 | 3 |
| External citation links | 0 | 4 |
| Schema blocks | Article + HowTo + FAQPage + BreadcrumbList | Same 4 (HowTo + `totalTime` added; mentions/about updated) |
| `dateModified` | 2026-04-15 | 2026-04-26 |

---

## Deploy state

- **Production source file:** `/c/Users/jason/.gemini/antigravity/scratch/roi-live/content-audit-information-gain.html` — patched in place
- **Snapshot in this brief:** `content-audit-information-gain.html` — synced to match (63,678 bytes both files)
- **Live URL (current):** https://roi.live/content-audit-information-gain
- **Sitemap:** entry already exists for the slug; no change needed
- **Pillar anchors to this spoke:** still valid — pillar uses generic anchors ("content audit process", "Content Audit for IG"), no edit required
- **Production deployment:** Jason will handle manually outside this session (website folder is not a git repo — separate architectural decision deferred)

---

## Open repo-level findings (separate workstream)

5 findings surfaced during the audit but parked for separate triage. See `clients/roi-live/projects/repo-issues/2026-04-26_signal-cluster-issues.md`:

- **F1** — `/blog/` vs `/[slug]` URL convention conflict between SOP and deployed reality
- **F2** — `/zero-click-searches-strategy` broken link in pillar (file is `zero-click-searches.html`)
- **F3** — Emerald `#10b981` accent for IG cluster pillar isn't in SOP color system
- **F4** — Sitemap entries with `/blog/` prefix for files at root (3 known mismatches)
- **F5** — Pillar `/information-gain-seo` carries 4 stats without source attribution. Marked **Required** severity. Backport the citation pattern from this spoke patch to the pillar.

---

## Lessons captured to `context/learnings.md`

Three new entries under `## str-ai-seo`:

1. **Phase 0 must check for existing article before any production work** — the duplicate-write catch
2. **Keyword research must validate brief assumptions before article work** — the DataForSEO null-volume catch
3. **Banned-phrase scan must run after every patch pass, not just final QA** — the "what makes" regression catch

Each entry has a SOP candidate proposal for future v2.x revisions.
