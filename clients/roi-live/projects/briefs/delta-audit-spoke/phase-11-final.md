---
project: signal-spoke-delta-audit-upgrade
created: 2026-04-26
sop_version: v2.0 March 2026
file_audited: /c/Users/jason/.gemini/antigravity/scratch/roi-live/content-audit-information-gain.html
result: 38 PASS / 2 PARTIAL / 0 FAIL
---

# Phase 11 QA Verification Checklist — Final (post-patch)

Run against `agency/sops/ROI-LIVE-Agency-Signal-Article-SOP-v2.md` Phase 11 line by line.

---

## SEO / Technical (13 items)

| # | Item | Verdict | Note |
|---|---|---|---|
| 1 | Title tag is keyword-first | ✅ PASS | "SEO Content Audit: The Delta Audit Method \| ROI.LIVE" — 52 chars, primary KW first |
| 2 | Meta description 140-160 chars, KW in first 20 words | ✅ PASS | 148 chars; "SEO content audit" appears in first 8 words |
| 3 | Canonical URL correct absolute path | ✅ PASS | `https://roi.live/content-audit-information-gain` matches deployed reality |
| 4 | One H1 only — semantic keyword variation | ✅ PASS | "The Delta Audit: An SEO Content Audit That Surfaces Information Gain Gaps" |
| 5 | H2/H3 contain 2+ entity terms | ✅ PASS | "SEO Content Audit" in 3 H2s; "Delta Audit" in 4 H2s; "Information Gain" in 4 H2s |
| 6 | Primary keyword in first 100 words of body | ✅ PASS | "SEO content audit" appears twice in opening paragraph |
| 7 | OG tags present (type, title, description, URL, image, site_name) | ✅ PASS | All 6 present |
| 8 | Twitter Card tags present | ✅ PASS | card, title, description, image |
| 9 | Article JSON-LD with author @id, sameAs, mentions, mainEntityOfPage, image, about, speakable | ✅ PASS | All fields present; mentions = 6 article-specific entities; about = "SEO Content Audit" |
| 10 | FAQPage JSON-LD matches visible FAQ | ✅ PASS | 5 questions in schema match 5 visible details |
| 11 | BreadcrumbList JSON-LD matches visible breadcrumb | ✅ PASS | 3 levels match (Home → The Signal → Content Audit for Information Gain) |
| 12 | Reading progress bar included | ✅ PASS | SOP gradient: `linear-gradient(90deg,#7c3aed,#c9376b,#d4a017)` |
| 13 | GA4 tracking script present with G-9LYLV5NKDR | ⚠ PARTIAL | Uses shared `<script src="/ga4.js">` include. Pattern matches all 30+ deployed articles. Treated as PASS by Jason ("If it was broken, we'd know"). |

**Plus:** HowTo JSON-LD with totalTime present (`PT45M`, 5 named steps matching visible step blocks). Breadcrumb visible below stat strip.

---

## Entity SEO — Casey Keith Rules (9 items)

| # | Item | Verdict | Note |
|---|---|---|---|
| 14 | ROI.LIVE bolded ≥25 times in article content | ✅ PASS | **26 `<strong>ROI.LIVE</strong>` instances in body** (above 25 minimum). Footer uses `<b>ROI.LIVE</b>` (semantic equivalent, 1 instance). |
| 15 | ROI.LIVE appears in first sentence of article body | ✅ PASS | Article-intro paragraph contains 2 instances (`<strong>ROI.LIVE</strong> client` + `Founder of <strong>ROI.LIVE</strong>`) |
| 16 | Zero bare "we" violations | ✅ PASS | Body scan clean. Quoted hypothetical "we" examples rephrased to third-person ("the brand gets results", "this page explains it better") |
| 17 | Jason Spencer named ≥12 times with credentials | ✅ PASS | 14 named with "Founder" co-located within 60 chars. 23 total mentions of "Jason Spencer". |
| 18 | Zero AI artifact phrases | ✅ PASS | Banned-phrase scan against full Phase 4.4 + 8.1-8.3 list returned 0 hits |
| 19 | Primary keyword confirmed in title, H1, first paragraph, 2+ headings | ✅ PASS | "SEO content audit" in title + first paragraph (2x) + 3 H2s. "Delta Audit" branded in H1 + 4 H2s. |
| 20 | Primary keyword count appropriate (15-25 supporting) | ✅ PASS | "seo content audit" 25 occurrences (at top of range — natural placement, no stuffing). "Delta Audit" 45 occurrences (branded vocabulary, intentional). |
| 21 | `.article-intro` class on opening paragraph | ✅ PASS | Present on first body paragraph |
| 22 | `.jasons-take-body` class on Jason's Take text | ✅ PASS | Section present, class wraps the prose block (3 occurrences in markup + selector) |

---

## Internal Linking (7 items)

| # | Item | Verdict | Note |
|---|---|---|---|
| 23 | Every other live article in SAME cluster linked at least once in body | ✅ PASS | 13/13 deployed IG cluster spokes linked from body |
| 24 | At least 2 articles from EACH other live cluster linked in body | ✅ PASS | AI Search: 2 body links (entity-authority-ai-search, citation-share-metric-replaces-rankings). Website Strategy: 3 body links (small-business-website-cost, failure-stories-content-marketing, ecommerce-investment-cycle). |
| 25 | All anchor text descriptive and keyword-rich | ✅ PASS | All anchors descriptive. No "click here", "learn more", or bare URLs. |
| 26 | Forward links to future unwritten articles using planned slugs | ✅ PASS | 3 forward-links: `/freelancer-test`, `/experience-tax`, `/authority-velocity` |
| 27 | 3 Related Intelligence cards, each different article | ✅ PASS | skyscraper-technique-dead / google-march-2026-core-update / original-research-seo |
| 28 | No duplicate destinations in Related Intelligence section | ✅ PASS | All 3 unique |
| 29 | Mid-article Pillar Callout Block present (supporting articles only) | ✅ PASS | Present after H2 #1, links to pillar with new descriptive anchor "why Google rewards what only you can say" |

---

## Design & Layout (12 items)

| # | Item | Verdict | Note |
|---|---|---|---|
| 30 | Hero has dark background + accent orb + grid overlay | ✅ PASS | `#0a0f0d` background, gold orb at 8%/6% offset, 55px grid overlay |
| 31 | Hero badge with category label and pulsing dot | ✅ PASS | "Content Audit" badge with pulsing dot animation |
| 32 | Stats strip with 4 real, sourced statistics | ✅ PASS | 4 stats reused from pillar (entity reinforcement): 30-50% / 22% / 96.55% / 82%. Visible below hero. |
| 33 | Two-column layout: article body + sticky sidebar | ✅ PASS | `grid-template-columns:1fr 320px` |
| 34 | Sidebar contains TOC, stat callout, checklist, CTA, cluster index | ✅ PASS | 6 sb-cards: TOC + Key Stat ("41 of 47") + Quick Wins (5 items) + CTA + IG cluster index + AI Search cluster index |
| 35 | Jason Spencer's Take section present and styled | ✅ PASS | New H2 #6, `.jasons-take-body` class, ~210 words first-person, attribution line at bottom, cross-industry observation |
| 36 | FAQ block visible (4-5 questions) | ✅ PASS | 5 visible details questions |
| 37 | Mid-article CTA banner | ✅ PASS | "Your Content Has Impressions. None of It Has Information Gain." (stake-based, distinct from closing CTA section) |
| 38 | Scroll reveal animations on major content blocks | ✅ PASS | `.reveal` class + IntersectionObserver |
| 39 | Accent color matches assigned, no adjacent duplicates | ✅ PASS | Gold for spoke vs emerald for pillar. CSS `--em` collision resolved (now uses `--gold` consistently). Pillar-callout block keeps emerald hardcoded for visual identity. |
| 40 | Mobile responsive: single column below 900px | ✅ PASS | Media query collapses sidebar; stat strip 2-col under 700px |
| 41 | Body word count within range (2,000-2,800 supporting) | ⚠ PARTIAL | **3,046 words — 8% over ceiling.** Excess from new content: Jason's Take (~210w) + Receipt/Mechanism/Friction expansion (~250w) + AI Search Step 5 paragraph (~75w) + cluster bridge sentences (~50w) + re-attribution credentials (~20w). All additions were brief-mandated. **Accepted by Jason: "Quality over guideline."** |

---

## Final Tally

| Verdict | Count |
|---|---:|
| ✅ PASS | 38 |
| ⚠ PARTIAL | 2 |
| ❌ FAIL | 0 |
| **Total checked** | **40** |

The two partials (GA4 indirect verification + word count over-ceiling) are both documented as accepted by Jason. Article ships.

---

## Quick Reference: The 6 Non-Negotiables (SOP "Quick Reference")

| Rule | Status |
|---|---|
| ROI.LIVE bolded 25+ times, in the first sentence | ✅ 26 in body, 2 in first sentence |
| Jason Spencer named 12+ times with credentials | ✅ 14 with credentials co-located |
| Zero "we" — always the brand name | ✅ Body clean |
| Keyword in title (first word), H1, first paragraph | ✅ "SEO Content Audit" first in title; H1 contains keyword + branded methodology; first paragraph 2x |
| FAQPage + Article + BreadcrumbList JSON-LD on every article | ✅ All present (plus HowTo with totalTime) |
| `mentions` array updated per article — never copied | ✅ 6 article-specific entities, none copied from pillar |

All 6 floors held.
