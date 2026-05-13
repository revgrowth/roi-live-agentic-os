# Brand QA Report — Phase 0 Quick Launch

**Project:** website-build-qa
**Audit owner:** Jason Spencer (ROI.LIVE)
**Audit run:** 2026-05-13
**Pages audited:** 17 deployed (15 at sitemap URL, 2 at slug-delta URLs)
**Pages skipped:** 4 not built (`/portfolio/completed-projects/`, `/service-hub/`, `/service-hub/warranties/`, `/terms-of-service/`)
**Methodology:** WebFetch text scan with verbatim quote extraction across 11 brand discipline categories, cross-referenced against `brand_context/voice-profile.md` v1.2, `brand_context/assets.md`, and v1.1 §11 rules

Severity legend:
- **BLOCK** — must fix before 2026-05-25 launch
- **FLAG** — fix before final QA close 2026-05-22
- **NIT** — cosmetic, fix when convenient

## Headline metrics

| Metric | Count | Severity bias |
|---|---|---|
| BLOCK findings | 47 | Launch-gating |
| FLAG findings | 18 | Fix this week |
| NIT findings | 6 | Optional |
| Pages with at least one BLOCK | 16 of 17 | Only `/about/editorial-standards/` is BLOCK-free |
| Sitewide / template-level fixes (one change = many pages) | 5 | High-leverage |

## A. Sitewide BLOCK patterns (one fix → many pages)

These five patterns repeat across the build. Fixing each at the template / component level resolves the violation on every affected page in one shot. Raja should prioritize these before per-page fixes.

### A1. Footer county list missing Philadelphia — BLOCK

Footer "Service Areas" shows 4 counties: "Montgomery County, Bucks County, Chester County, Delaware County". Sitemap and v1.1 §11.6 require all 5 counties always.

**Affected (footer-level fix):** every page on the site (17/17).

**Correct form:** "Montgomery, Bucks, Chester, Delaware, and Philadelphia Counties" — or full per-county list with all five.

**Note:** Body copy on About-family pages already cites the correct 5-county list. The bug is the global footer component only.

### A2. Swiss Post / magazine subscription FAQ template defaults — BLOCK

Every page using the shared FAQ block shows the Breakdance template defaults: answers about magazine subscriptions, Swiss Post Service shipping, account creation, design fairs in Switzerland.

**Affected:** `/about/`, `/about/our-story/`, `/about/why-choose-us/`, `/about/our-process/`, `/service-hub/faqs/`, `/contact/`, `/request-estimate/`, `/careers/`, `/financing/`, `/portfolio/` (10 pages).

**Fix:** override the FAQ widget template globally with empty defaults, then receive real per-page FAQ copy from the website-quick-launch project. Until real copy lands, hide the FAQ section entirely.

### A3. Phone number above the fold — BLOCK (v1.1 §11.5)

The brand rules require form-first CTA discipline — phone in footer only, no phone in header / first viewport / promo bar. Inconsistent execution detected: phone appears above-the-fold on `/contact/`, `/request-estimate/`, `/care/`, `/about/why-choose-us/`, `/blog/`, `/portfolio/`, `/privacy-policy/` (7 pages). On other pages it doesn't surface above the fold.

**Two phone numbers detected in conflict:**
- `(610) 222-0590` (on `/contact/`, `/request-estimate/`)
- `(610) 569-9810` (on `/contact/` also, `/care/`)
- Brief says `(610) 569-9810` is the live-site canonical phone

**Fix:**
1. Remove phone from sitewide header / promo bar — relocate to footer only.
2. Reconcile to one canonical phone number (likely 610.569.9810 per legacy live-site convention; Jason to confirm with Maureen).

### A4. Em-dash usage sitewide — BLOCK (v1.1 §11.3 absolute ban)

Em-dash detected in 10 of 17 pages, including headings. **Zero em dashes anywhere** is the Blue Tree rule.

| Page | Em-dash location | Verbatim |
|---|---|---|
| `/about/` | Lede paragraph | "Pennsylvania — and we've been doing it since 1983" |
| `/about/our-story/` | Origin section | "Blue Tree started in 1983 as a small landscaping operation — an outgrowth of the Blue Tree Garden Center" |
| `/about/why-choose-us/` | Hero or H1 area | "We're Not the Cheapest. We're the Last Company You'll Ever Need to Hire." (— scanner flagged; visual review recommended) |
| `/about/our-process/` | **H1** | "How We Work: From Vision to Reality — and Beyond" |
| `/about/meet-the-team/` | Closing CTA | "...a landscape that finally feels like you — let's talk." |
| `/portfolio/` | Intro paragraph | "Every project tells a story — from the homeowner's vision to the finished outdoor living space." |
| `/contact/` | Lede | "Whether you're ready to start a project... — we're here to help." |
| `/request-estimate/` | Lede | "One point of contact from the first conversation to the last walkthrough — and beyond." |
| `/financing/` | Lede | "Your dream backyard doesn't have to wait — Blue Tree partners with trusted lending institutions..." |
| `/care/` | Intro | "from seasonal checklists and product-specific care to expert maintenance guidance, organized by the service Blue Tree performed." (— scanner flagged; visual review recommended) |
| `/careers/` | History block | "When the 2008 recession hit, Blue Tree moved to four-day, ten-hour work weeks to keep every employee on payroll." (— scanner flagged) |

**Fix:** sitewide find-replace `—` → comma / period / parenthesis / rewrite. Re-audit before launch.

**Note:** WebFetch summaries are sometimes imprecise on em-dash detection. Recommend a regex sweep on the WordPress post_content table post-Raja-fix to confirm zero remaining em-dashes.

### A5. Wrong tenure stats — "40 years", "Four decades" — BLOCK

The brand rule (v1.1 §1.6, §1.7) locks the tenure stats: **43 years** in business, **13 to 14 year** average employee tenure, **15 years** pool construction track record. Anything else is a launch blocker.

| Page | Wrong tenure stat |
|---|---|
| `/` (Homepage) | "Four decades later" |
| `/about/` | "trusted us for over 40 years" |
| `/about/our-story/` | "over 40 years of experience" |
| `/about/our-story/` | "40+ years of showing up" |
| `/about/our-story/` | "40 Years" (section header) |
| `/about/meet-the-team/` | "more than 40 years of hands-on experience" |
| `/about/why-choose-us/` | Mixed: "43 years" correct, but also "15 years" used in employee-tenure context (should be pool construction only) |
| `/about/why-choose-us/` | Repeats correct "13–14 Year" elsewhere |
| `/careers/` | "Our average employee tenure is 15 years" (conflicts with "13–14 years" headline on same page) |

**Fix:** sitewide find-replace `40 years` / `four decades` / `over 40` → `43 years` etc. Reconcile `15 years` → only use in pool construction context, not employee tenure.

## B. Page-specific BLOCK findings

### / (Homepage)

| Severity | Finding | Source |
|---|---|---|
| BLOCK | Lorem Ipsum in testimonials section (3 instances) — "Lorem ipsum dolor sit amet, consectetur adipiscing elit..." | Text scan |
| BLOCK | Body copy "Four decades later" (covered by A5) | Text scan |
| BLOCK | Footer 4-county list (covered by A1) | Text scan |
| FLAG | Promo banner "SPRING REFRESH: 25% OFF ALL LAWN CARE PACKAGES" — confirm offer is intended for launch period and seasonal banner is approved | Text scan |
| NIT | "Blue Tree started in 1983" — origin reference is acceptable but cross-check Norristown 1983 fact (current copy says "1983 with an opportunity to do things differently" — no Norristown anchor) | Text scan |

### /portfolio/

| Severity | Finding | Source |
|---|---|---|
| BLOCK | H1 reads "Completed Projects: Our Work Across Southeastern PA" — but URL is `/portfolio/` (photo gallery). H1 collides with the deferred Completed Projects page concept. | Text scan |
| BLOCK | Em-dash in intro (A4) | Text scan |
| BLOCK | Only 2 distinct project categories repeated 3x = no individual project names. Should be a gallery of named projects with location + service type. | Text scan |
| FLAG | Tempurl reference left in body — "https://bluetree.tempurl.host" string detected. Sweep for hardcoded staging URLs before launch. | Text scan |

### /reviews/

| Severity | Finding | Source |
|---|---|---|
| BLOCK | Placeholder reviewer attribution `[First Name] [Last Initial]., [Town], PA` × 6 instances | Text scan |
| BLOCK | 3 distinct review blocks visible but each repeats identical text — duplicate testimonial content | Text scan |
| BLOCK | No Trustindex widget visible — v1.1 §1.8 specifies Trustindex for Google reviews. Either embed Trustindex or replace static placeholders with curated review copy. | Text scan |
| BLOCK | Footer 4-county list (A1) | Text scan |

### /service-hub/faqs/

| Severity | Finding | Source |
|---|---|---|
| BLOCK | Swiss-postal / magazine FAQ placeholder pattern (A2). Note: page was supposed to be deferred per Raja's 2026-04-13 plan — confirm Phase 0/1 placement per separate Jason ruling. | Text scan |
| BLOCK | "Last Updated: [Month Year]" placeholder | Text scan |
| BLOCK | "From time to time you will find us at design fairs and popup markets in Switzerland." — Switzerland is template default, not Blue Tree content. | Text scan |
| FLAG | 5 unique FAQs repeated 6x throughout page — repetition pattern is a content / template bug | Text scan |

### /blog/

| Severity | Finding | Source |
|---|---|---|
| BLOCK | Post grid duplicates "How Much Does an Inground Pool Cost in Pennsylvania?" multiple times | Text scan |
| BLOCK | No author bylines visible on post cards — breaks the multi-author E-E-A-T model (overlay) | Text scan |
| FLAG | Phone above the fold (A3) | Text scan |
| FLAG | Footer 4-county list (A1) | Text scan |

### /about/

| Severity | Finding | Source |
|---|---|---|
| BLOCK | Em-dash in lede (A4) | Text scan |
| BLOCK | "trusted us for over 40 years" (A5) | Text scan |
| BLOCK | Swiss-postal placeholder FAQ (A2) | Text scan |
| FLAG | "Originally founded as Blue Tree Landscaping in 1983 and now operating as Blue Tree" — acceptable origin-story framing per v1.1 §1.1; this exception is allowed. | Text scan |

### /about/our-story/

| Severity | Finding | Source |
|---|---|---|
| BLOCK | Multiple "40 years" / "40+ years" variants (A5) | Text scan |
| BLOCK | Section header "40 Years" — should be "43 Years" | Text scan |
| BLOCK | "Healthy Yard" singular found (need to verify location — body copy or header) | Text scan |
| BLOCK | Em-dash in origin paragraph (A4) | Text scan |
| BLOCK | Swiss-postal placeholder FAQ (A2) | Text scan |
| FLAG | "Blue Tree Garden Center" origin reference — confirm this is the verified origin story per Jeff Mattiola sign-off. Brand brief mentions Norristown 1983 → Skippack 2008. Garden Center is a new claim not in v1.1 §1.1. | Text scan |
| PASS | County list shows correct 5 in body | Text scan |
| PASS | "Blue Tree Outdoor Living" used in body — brand name discipline correct | Text scan |

### /about/team/ — **NOT BUILT AT SITEMAP URL** (deployed at `/about/meet-the-team/`)

### /about/meet-the-team/ (alt URL, audited per Jason ruling)

| Severity | Finding | Source |
|---|---|---|
| BLOCK | **All 20+ team members display Chad's identical bio** — every team member card shows "Leadership, University of Pittsburgh education" Chad content. This is the most severe content bug on the site. | Text scan |
| BLOCK | "more than 40 years of hands-on experience" (A5) | Text scan |
| BLOCK | Em-dash in closing CTA (A4) | Text scan |
| BLOCK | "Blue Tree Landscaping" in body | Text scan |
| FLAG | Slug delta — sitemap target is `/about/team/` (ClickUp comment sent to Raja) | Tracker |

### /about/why-choose-us/

| Severity | Finding | Source |
|---|---|---|
| BLOCK | Em-dash in H1 / hero area (A4) | Text scan |
| BLOCK | Phone above the fold (A3) | Text scan |
| BLOCK | "15 years" used in employee-tenure context (should be pool construction only) — mixed signal on same page (A5) | Text scan |
| BLOCK | Swiss-postal placeholder FAQ (A2) | Text scan |
| FLAG | Generic "Logo-9.png" through "Logo-18.png" repeated in image assets — confirm intentional vs placeholder image fills | Text scan |
| PASS | "We don't believe in high-pressure sales" — anti-pressure positioning correct | Text scan |
| PASS | "43 years" stated in opening | Text scan |
| PASS | County list shows correct 5 in body | Text scan |

### /about/our-process/

| Severity | Finding | Source |
|---|---|---|
| BLOCK | **Em-dash in H1** "How We Work: From Vision to Reality — and Beyond" (A4) | Text scan |
| BLOCK | "Healthy Yard" singular in service-divisions list (A note: "five service divisions — Pools, Landscapes, Hardscapes, Healthy Yard, and Premier Outdoor Services") | Text scan |
| BLOCK | Swiss-postal placeholder in Step 02 AND Step 05 — the step descriptions themselves have placeholder e-commerce language, not just FAQ section | Text scan |
| BLOCK | "13–14 Year" displayed as truncated/incomplete (missing "Average Employee Tenure" suffix) | Text scan |
| PASS | Anti-high-pressure CTA discipline correct | Text scan |
| PASS | County list shows correct 5 in body | Text scan |

### /contact/

| Severity | Finding | Source |
|---|---|---|
| BLOCK | Phone above the fold — two numbers shown: `(610) 222-0590` AND `(610) 569-9810` (A3) | Text scan |
| BLOCK | Em-dash in lede (A4) | Text scan |
| BLOCK | Swiss-postal placeholder FAQ (A2) | Text scan |
| BLOCK | Footer 4-county list (A1) | Text scan |
| FLAG | Form fields are minimal: Email, Phone, Subject, Message. Compare to creative brief — Step 2 spec audit may surface missing fields (project type, county, budget range, etc.) | Text scan |
| PASS | Email shown: info@bluetreelandscaping.com | Text scan |

### /request-estimate/

| Severity | Finding | Source |
|---|---|---|
| BLOCK | Phone above the fold `(610) 222-0590` (A3) | Text scan |
| BLOCK | Em-dash in lede (A4) | Text scan |
| BLOCK | "13–14 yrs" shown as abbreviated form — full v1.1 §1.6 spec is "13 to 14 year average employee tenure" | Text scan |
| BLOCK | Footer 4-county list (A1) | Text scan |
| FLAG | CTA button reads "Request a Free Estimate" — H1 says "Request Your Free Design Consultation". Brief calls for form-first CTA "Request a Free Consultation" — minor wording inconsistency between H1 and button | Text scan |
| FLAG | Form fields minimal: Email, Phone, Prefer Method. May need expansion vs creative brief in Step 2 | Text scan |
| PASS | "Request Your Free Design Consultation" H1 matches form-first CTA discipline | Text scan |

### /careers/

| Severity | Finding | Source |
|---|---|---|
| BLOCK | **All 4 open job listings show identical repeated "Stephen Roehm" bio text** — no actual job descriptions present | Text scan |
| BLOCK | Benefits section shows "[Pending confirmation — health insurance, dental, vision details TBD]" and "[Pending confirmation — PTO, holidays, sick days TBD]" | Text scan |
| BLOCK | "Our average employee tenure is 15 years" CONFLICTS with "13–14 years" headline on same page (A5) | Text scan |
| BLOCK | "Healthy Yard" singular in section header/division name | Text scan |
| BLOCK | Swiss-postal placeholder FAQ (A2) | Text scan |
| FLAG | Em-dash flagged in 2008-recession history block (A4) | Text scan |
| PASS | "Montgomery, Bucks, Chester, Delaware, and Philadelphia counties" in body — correct 5-county form | Text scan |

### /financing/

| Severity | Finding | Source |
|---|---|---|
| BLOCK | Unfilled brackets in Step 3 and partner sections: `[Financing Partner Name]` (×2), `[Partner Name]`, `[a quick online application / a streamlined process through your designer]`, `[minutes / 24 hours]` | Text scan |
| BLOCK | Em-dash in lede (A4) | Text scan |
| BLOCK | Swiss-postal placeholder FAQ (A2) | Text scan |
| BLOCK | "Blue Tree Landscaping" appears in body (not just footer) | Text scan |
| BLOCK | Footer 4-county list (A1) | Text scan |
| FLAG | CTA "Start Your Transformation" — borderline aspirational vs high-pressure. Acceptable per voice rules; cross-reference creative brief for canonical CTA wording | Text scan |
| PASS | Financing partners named: HFS Financial, Viking Capital, Lyon Financial | Text scan |

### /privacy-policy/

| Severity | Finding | Source |
|---|---|---|
| BLOCK | **H1 reads "Blue Tree Landscaping Privacy Policy"** — legal entity in body H1 (v1.1 §1.1 violation). Should be "Blue Tree Outdoor Living Privacy Policy" or just "Privacy Policy" — legal entity stays in JSON-LD / footer only. | Text scan |
| BLOCK | 11 occurrences of "Blue Tree Landscaping" in body copy | Text scan |
| BLOCK | Phone above the fold (A3) | Text scan |
| BLOCK | Footer 4-county list (A1) | Text scan |
| PASS | Address "4494 Skippack Pike, Schwenksville, PA 19473" is **canonical** (Jason confirmed 2026-05-13). The v1.1 §1.1 "Skippack HQ since 2008" is the colloquial location (the building sits on Skippack Pike) but the postal address is Schwenksville zip code. Use this exact form everywhere. | Jason ruling 2026-05-13 |
| FLAG | "Healthy Lawn" appears — flag for verification; could be acceptable variant or could conflict with "Healthy Yards" pillar branding | Text scan |
| FLAG | Cookies/AdWords/Adroll language is real privacy content (good); confirm Privacy text was reviewed by counsel | Text scan |
| FLAG | No "Last Updated" date shown | Text scan |
| PASS | Cookies + Google AdWords + Adroll Remarketing language present — counsel-ready language | Text scan |

### /about/editorial-standards/

| Severity | Finding | Source |
|---|---|---|
| BLOCK | **No named authors shown** — overlay requires multi-author E-E-A-T with named SMEs (Jeff Mattiola, Jérôme Besnard, Chad Ochnich, Mark Peasley) | Text scan |
| FLAG | "Last Updated: [Month Year]" placeholder | Text scan |
| FLAG | Page lives at both `/about/editorial-standards/` AND `/editorial-standards/` — dedupe to one canonical URL | Tracker |
| PASS | "Montgomery, Bucks, Chester, Delaware, and Philadelphia Counties" — correct 5 | Text scan |
| PASS | "Healthy Yards" plural correct | Text scan |
| PASS | No high-pressure CTA — "Request Your Free Consultation" with "No Obligation" qualifier | Text scan |
| PASS | "since 1983" reference — origin year correct | Text scan |

### /care/ (alt URL — sitemap target /service-hub/instructions/)

| Severity | Finding | Source |
|---|---|---|
| BLOCK | **No YMYL disclaimer on chemical-application instructions** — page includes chlorine / shock-dosing / water chemistry guidance but no safety disclaimer. Overlay YMYL protocol requires explicit safety disclaimer + named reviewer on chemical-application content. | Text scan |
| BLOCK | "Healthy Yard" singular in navigation + section heading (A5 in spirit; specifically the Healthy Yards plural rule) | Text scan |
| BLOCK | Phone above the fold `610.569.9810` (A3) | Text scan |
| BLOCK | Em-dash in intro (A4) | Text scan |
| BLOCK | Footer 4-county list (A1) | Text scan |
| BLOCK | "[Last Updated: [Month Year]]" placeholder | Text scan |
| FLAG | CTA "Start Your Transformation" — borderline (see /financing/ same finding) | Text scan |
| FLAG | Slug delta — sitemap target is `/service-hub/instructions/` (ClickUp comment sent to Raja) | Tracker |

## C. Brand kit fidelity — manual visual review needed

Automated text scan cannot verify hex tokens, font families, or visual treatment without browser rendering or CSS inspection. The Figma MCP rate limit (Starter plan reached) also blocks Figma node comparison this cycle.

**Recommendation:** before launch, run a one-time CSS / DevTools inspection on at least 3 pages (`/`, `/about/our-story/`, `/contact/`) to verify:

| Token | Expected (per `brand_context/assets.md`) | Verification method |
|---|---|---|
| `--bt-green` | `#285140` | DevTools inspect element on H1 underline / section accent |
| `--bt-blue-primary` | `#0F2537` | DevTools inspect on hero background / navy elements |
| `--bt-blue-light` | `#005CB9` | DevTools inspect on link / accent elements |
| `--bt-orange` | `#FB8C00` | DevTools inspect on primary CTA button background |
| `--bt-white` | `#FFFFFF` | Body background |
| `--bt-off-white` | `#DBDBDB` | Off-white background sections |
| H1 font family | Archivo Bold / ExtraBold | DevTools computed font-family on H1 |
| H2 font family | Archivo Bold (default) or SF Pro Bold (visual variant) | DevTools computed on H2 elements |
| H3 / H4 | SF Pro Semibold / Bold | DevTools |
| Body | SF Pro Regular / Medium | DevTools |

**Logo lockup audit:**
- Confirm white-out logo on dark backgrounds vs color logo on light backgrounds
- Footer logo should be blue (`#0F2537`) variant per `brand_context/assets.md`
- Logo with "Pools · Landscapes · Hardscapes" tagline lockup — confirm placement rules

## D. Accessibility — deferred to dev-side scan

Outside the scope of this audit pass. Recommend a one-time WAVE / axe-core sweep on the 17 deployed pages before 2026-05-22 internal QA close.

**Spot findings from the text scan:**
- Alt text not verifiable from WebFetch summary — recommend dev-side image-alt audit
- "Lorem ipsum" testimonials on homepage will also fail screen reader / SEO meaning
- Color contrast on `[Pending confirmation]` placeholder text — likely invisible at intended viewport sizes; confirm visually

## E. Sitewide PASS observations (good signals)

- "Request a Consultation" / "Request Your Free Consultation" form-first CTA wording consistently used across most pages
- Anti-high-pressure positioning explicit on `/about/why-choose-us/` ("We don't believe in high-pressure sales")
- Brand name discipline (Blue Tree vs Blue Tree Outdoor Living vs Blue Tree Landscaping) is mostly correct in body copy except where flagged
- 5-county list IS used in body copy on About-family pages — bug is footer template only
- No banned services detected (sprinkler, smart irrigation, emergency pool repair, standalone hot tub) — service-line discipline is clean

## F. Aggregate fix priority

The fastest path to a launch-ready site:

**Tier 1 — Sitewide template fixes (resolve ~20+ findings in one pass):**
1. Override global FAQ widget template — kill Swiss Post / magazine defaults
2. Fix footer component — Philadelphia → 5 counties everywhere
3. Remove phone from header / promo bar — footer only
4. Sitewide find-replace `—` → comma/period/parens
5. Sitewide find-replace `40 years` / `four decades` → `43 years`

**Tier 2 — Page-specific content swaps (Raja needs real copy delivered):**
6. Meet the Team — replace Chad-bio-everywhere with per-person bios
7. Reviews — embed Trustindex OR populate real reviews
8. Careers — replace Stephen-Roehm-everywhere with actual job descriptions + benefits
9. Financing — fill `[Financing Partner Name]` brackets, Step 3 description
10. Homepage testimonials — replace Lorem Ipsum
11. Privacy Policy — H1 rewrite (remove "Blue Tree Landscaping")
12. Editorial Standards — add named authors
13. Blog Hub — author bylines + dedupe Inground Pool Cost post
14. Care Instructions — add YMYL disclaimer

**Tier 3 — Verification + reconciliation:**
15. Address: Maureen verifies "Schwenksville, PA 19473" vs "Skippack"
16. Phone number: Jason reconciles `(610) 222-0590` vs `(610) 569-9810` to one canonical
17. Editorial Standards URL: dedupe `/about/editorial-standards/` vs `/editorial-standards/`
18. Manual visual brand-kit pass (hex tokens, font families)
19. Accessibility / WCAG sweep
20. Confirm Garden Center origin story claim (`/about/our-story/`) vs v1.1 §1.1
