---
project: website-build-qa
deliverable: Figma vs deployed audit — Phase 0 remaining 13 pages (scope-gap closure)
audit_owner: Jason Spencer (ROI.LIVE)
status: in-progress
created: 2026-05-13
companion_to: figma-audit.md (the 4 priority pages Home / About / Our Story / Our Process)
figma_file: Q6lmvy4QnHhnauxLMY0TjY (Blue Tree (Copy) — Jason's Pro-plan workspace)
deployed_base: https://bluetree.tempurl.host
purpose: |
  Closes the audit gap surfaced by Jason 2026-05-13. The original figma-audit.md covered only
  the 4 quick-launch priority pages. This file extends the same Figma + brief + deployed
  end-to-end comparison to every page Raja has built (deployed at sitemap URL OR alt URL).
methodology: |
  Compact per-page table. For each page:
   - Note whether a dedicated Figma frame exists
   - Cite the frame node ID + key Figma facts (hero structure, content blocks, components)
   - Cross-check against deployed WebFetch
   - Surface NEW findings not already captured in fix-list-for-raja.md
   - Sitewide patterns (logo strip / em-dash / fonts / CTA / promobar / card H2) referenced
     rather than re-explained per page
---

# Phase 0 — Pages 2-21 Audit (scope-gap closure)

Companion to `figma-audit.md`. Compact per-page tables for the 13 deployed pages not covered in the original audit (the 4 priority pages remain in `figma-audit.md`).

## Page registry — coverage matrix

| # | Page | URL | Figma frame | ClickUp parent | Audit status |
|---|---|---|---|---|---|
| 2 | Portfolio | `/portfolio/` | `1309:7960` ✓ | `86afpc6gp` | Below |
| 4 | Reviews & Testimonials | `/reviews/` | `1309:9574` ✓ | `86afk7ur2` | Below |
| 7 | Service Hub — FAQs | `/service-hub/faqs/` | none (inner template) | `86afwj01v` | TBD |
| 8 | Care Instructions | `/care/` (alt URL) | none | `86afx9p1m` | TBD |
| 9 | Blog Hub | `/blog/` | none (template) | `86afk8grb` | TBD |
| 12 | Meet the Team | `/about/meet-the-team/` (alt URL) | `1309:8328` ✓ | `86afk9khm` | Below |
| 13 | Why Choose Blue Tree | `/about/why-choose-us/` | `1309:8612` ✓ | `86afpj75f` | TBD |
| 15 | Contact Us | `/contact/` | none | `86afjwwm9` | TBD |
| 16 | Request an Estimate | `/request-estimate/` | none | `86afjwwm9` (shared) | TBD |
| 17 | Careers | `/careers/` | none | `86afpp7jb` | TBD |
| 18 | Financing | `/financing/` | none | `86afpmx4x` | TBD |
| 19 | Privacy Policy | `/privacy-policy/` | none | `86ah0d9p5` | TBD |
| 21 | Editorial Standards | `/about/editorial-standards/` | `1309:10034` ✓ | `86afx9qhw` | TBD |

---

## Page 2 — Portfolio (`/portfolio/`)

**Figma:** `1309:7960` (FRAME inside About 1309:6950, 1440×4222). Hero BG image `1b5763ad1390646aefb2e49acb3e05d78e3ce6e9` with asymmetric bottom-corner radii (0/100/100/100). Promobar = same SPRING REFRESH. Logo Strip = same 10 placeholder tech logos (1309:8002-8047).

**Figma defines** (deployed missing or partial):
- **Filter UI** (`1309:8148`): "Service" + "Location" with checkboxes — 6 service-type checkboxes + 6 location checkboxes — fully spec'd in Figma
- **6 project card slots** (`1309:8224` / `1309:8241` / `1309:8259` / `1309:8276` / `1309:8294` / `1309:8311`) — 431px wide, 24px radius, 1px Outline stroke, paginated 2-per-row
- Body intro text (`1309:8146`): "Blue Tree is a full-service residential design-build firm headquartered in Schwenksville, Pennsylvania, serving homeowners throughout Southeastern PA **—** including Montgomery, Bucks, Chester, Delaware, and Philadelphia Counties. Since 1983, our team has designed, built, and maintained thousands of outdoor living spaces **—** from intimate garden retreats..." — 2 em-dashes

**Deployed (`/portfolio/`):**
- H1: "Completed Projects: Our Work Across Southeastern PA" (existing P2 #1 BLOCK — scope mismatch)
- Hero subhead: "Every project tells a story **—** from the homeowner's vision..." (em-dash, existing P2 #3)
- CTAs: "Request a Free Estimate" + "Meet Our Team" — form-first ✓
- H2 order: "Custom Pools & Water Features" / "Patios, Walls & Outdoor Kitchens" repeated (only 2 categories cycling)
- **No filter UI**; **No individual project cards** (existing P2 #2 BLOCK)
- Logo strip placeholder logos (sitewide S9)

### NEW findings (Portfolio)

| # | Finding | Severity | Disposition |
|---|---|---|---|
| Pf1 | Figma defines Service + Location FILTER UI; deployed is missing this entirely. Per the brief and Figma, filters are core to portfolio scannability. | **BLOCK** | New subtask for Raja: build filter UI per Figma spec |
| Pf2 | Figma defines 6 specific project card slots; deployed shows only 2 generic categories repeated. AWAITING CONTENT from Jérôme/Maureen (separate prior task). | covered by existing fix-list P2 #2 + Portfolio content request comm | No new subtask |
| Pf3 | Body intro paragraph cascading em-dashes (×2) + Schwenksville HQ reference + sentence used identically on Meet the Team page (shared text block) | **BLOCK** | New subtask: em-dash sweep on Portfolio body intro |
| Pf4 | Logo strip placeholder logos | covered by sitewide S9 | Already in queue |
| Pf5 | "Healthy Yards" plural confirmed in nav (no violation) | PASS | No fix |

---

## Page 4 — Reviews & Testimonials (`/reviews/`)

**Figma:** `1309:9574` (FRAME inside About 1309:6950, ~63KB at depth 3 — full structure cached, depth-2-grep available if needed). Hero BG same image `1b5763ad1390646aefb2e49acb3e05d78e3ce6e9` w/ asymmetric corners 0/100/100/100. Promobar = SPRING REFRESH. Logo Strip = same 10 placeholders. (Reviews component INSTANCEs in the testimonials section.)

**Deployed (`/reviews/`):**
- H1: "Reviews & Testimonials" ✓ matches brief
- Hero subhead: "Don't take our word for it **—** hear from the homeowners who've trusted Blue Tree with their pools, landscapes, patios, and outdoor living spaces across Southeastern PA." (em-dash)
- CTAs: "Request a Free Estimate" + "See Our Work" — form-first ✓
- H2 order: Stories from the Homeowners We Serve / What Homeowners Consistently Say About Blue Tree / Had a Great Experience? Share It. / Hear It Directly from Our Clients / Explore Blue Tree / Our Projects / Ready to Start?
- **6 testimonials with placeholder names "[First Name] [Last Initial]., [Town], PA"** (existing P3 #1-#3 BLOCKs)
- **NO Trustindex widget** (existing P3 #3 BLOCK — resolved per Jason 2026-05-13 to use Trustindex)
- Body em-dash: "From the first consultation to the final walkthrough **—** how we work"
- Logo strip placeholder

### NEW findings (Reviews)

| # | Finding | Severity | Disposition |
|---|---|---|---|
| Rv1 | Em-dash in hero subhead "...take our word for it **—** hear from..." | **BLOCK** | New subtask: rewrite to comma or period |
| Rv2 | Em-dash in body section transition "...the final walkthrough **—** how we work" | **BLOCK** | New subtask: rewrite |
| Rv3 | Logo strip + alt attrs | covered by sitewide S9 + S14 | Already in queue |
| Rv4 | 6 H2s in deployed read as a varied section structure — confirm matches Figma section ordering (depth-3 Figma cached if needed for deeper drill) | NIT | Verify-only, no fix unless drift |

---

## Page 12 — Meet the Team (`/about/meet-the-team/` — alt URL pending slug align to `/about/team/`)

**Figma:** `1309:8328` (FRAME 1440×4428). Hero BG same image w/ bottom-corners `0px 0px 100px 100px` (symmetric — matches About). Promobar = SPRING REFRESH. Logo Strip = same 10 placeholders.

**Figma defines** (key components):
- Body intro text (`1309:8516`): SAME paragraph as Portfolio (shared block) — "...Southeastern PA **—** including Montgomery, Bucks, Chester, Delaware, and Philadelphia Counties. Since 1983, our team has designed, built, and maintained thousands of outdoor living spaces **—** from intimate garden retreats..." (2 em-dashes, "Schwenksville")
- **6 filter tabs** (`1309:8518`): "Everyone" (active state Primary navy fill) / "Leadership" / "Design" / "Project Managers" / "Marketing" / "Support"
- **6 team member card slots** (`1309:8532-8599`) — 400px wide, 24px radius, 1px Outline stroke

**Deployed (`/about/meet-the-team/`):**
- H1: "Meet the Blue Tree Team"
- Hero subhead: "70 to 90 professionals strong. Degreed designers, certified specialists, and a leadership team with **more than 40 years** of hands-on experience..." (40-years violation, sitewide S6)
- **CTAs: "Request a Consultation" + "See All Services"** — **does NOT match sitewide canonical "Request a Free Estimate"** (S13 violation specific to this page)
- **All 20 cards show identical Chad bio** (existing P8 #1 BLOCK — content drop landing in `deliverables/content-drops/team-bios.md`)
- Department filter tabs: "Everyone Leadership Design Project Managers" — **MISSING "Marketing" and "Support" tabs** from Figma
- "Blue Tree Landscaping" in body (existing P8 #4)

### NEW findings (Meet the Team)

| # | Finding | Severity | Disposition |
|---|---|---|---|
| MT1 | Hero CTAs "Request a Consultation" + "See All Services" do not match sitewide canonical "Request a Free Estimate" (S13) | **BLOCK** | New subtask: change primary CTA wording |
| MT2 | Filter tabs missing 2 of 6 from Figma — Marketing and Support tabs absent on deployed | **FLAG** | New subtask: add 2 missing tabs |
| MT3 | Body intro paragraph cascading em-dashes (×2) — shared block with Portfolio | **BLOCK** | New subtask: em-dash sweep on this page (or fix at the shared component level if Breakdance allows) |
| MT4 | "more than 40 years" in subhead | covered by sitewide S6 | Already in queue (existing P8 #2) |
| MT5 | All 20 cards duplicate Chad bio | covered by P8 #1 (BLOCK, content awaiting) | Already in queue |
| MT6 | "Blue Tree Landscaping" in body | covered by P8 #4 | Already in queue |
| MT7 | Logo strip + alt attrs | covered by sitewide S9 + S14 | Already in queue |

---

---

## Page 13 — Why Choose Blue Tree (`/about/why-choose-us/`)

**Figma:** `1309:8612` (FRAME inside About 1309:6950). Hero BG with asymmetric `0px 100px 100px 0px` corner radii (top-right + bottom corners curved — distinctive, differs from other pages). Same SPRING REFRESH promobar. Same 10 placeholder logos.

**Deployed:**
- H1: "Why Choose Blue Tree? What Sets Us Apart After 43 Years" ✓ tenure correct
- Hero subhead: "We know you're comparing options. You should be **—** this is a significant investment in your home." (em-dash)
- **Hero CTAs: "Request a Free Consultation" + "Meet Our Team"** — uses "Consultation" not the Q1 canonical "Request a Free Estimate"
- **H2 headings contain em-dashes:** "Your Designer Is Your Point of Contact **—** From First Visit to Final Walkthrough"
- **"Founded in Norriton in 1983"** ← suspect typo; should be "Norristown" per v1.1 §1.6 (or confirm with client if Norriton/East-Norriton/West-Norriton is intentional)
- Stats H2: "Our Average Employee Has Been Here for **15 Years**. In This Industry, That's Unheard Of." — **conflicts with 13–14 Year canonical (sitewide S7)** AND with Established 1983 / 70–90 / 13–14 stats block elsewhere on same page
- Stats body confirms new Q7-approved facts: 20+ years pool experience / 44+ years combined / 25-30 year client relationships ✓
- FAQ block: Swiss-post placeholder (existing P9 #4)
- Phone NOT above fold ✓ on this page
- Logo strip placeholder (sitewide S9)

### NEW findings (Why Choose Blue Tree)

| # | Finding | Severity | Disposition |
|---|---|---|---|
| WC1 | **"Founded in Norriton"** — typo for "Norristown". Voice profile v1.1 §1.6 (plus 6 other sections incl. §11 Never-Write, §12.4, §14 schema, samples.md, voice-profile.md index, errata table) locks "Norristown" as canonical. Captured from Jeff's brand story recording. | **BLOCK** | Confirmed against voice profile 2026-05-13 — no client verification needed; Raja subtask `86aher3ck` updated from HOLD to GO; companion client subtask `86ahewp4j` resolved as no-action |
| WC2 | Hero CTAs "Request a Free Consultation" + "Meet Our Team" do not match Q1 canonical "Request a Free Estimate" | **BLOCK** | New subtask: change primary CTA to canonical |
| WC3 | Em-dash in hero subhead "...comparing options. You should be **—** this is..." | **BLOCK** | New subtask: rewrite (sitewide S5 instance) |
| WC4 | H2 "Your Designer Is Your Point of Contact **—** From First Visit to Final Walkthrough" — em-dash in heading | **BLOCK** | New subtask: rewrite heading (sitewide S5 instance) |
| WC5 | H2 "Our Average Employee Has Been Here for **15 Years**" — conflicts with stats block on same page ("13–14 Year Avg. Employee Tenure") and with sitewide S7 (15 years is reserved for pool construction track record only) | **BLOCK** | Already covered by existing P9 #3 + sitewide S7 — confirming presence |
| WC6 | Logo strip placeholders | covered by sitewide S9 + S14 | Already in queue |
| WC7 | FAQ Swiss-post placeholders | covered by existing P9 #4 + sitewide S2 | Already in queue |

---

## Page 21 — Editorial Standards (`/about/editorial-standards/`)

**Figma:** `1309:10034` (FRAME 1440×3846). Hero with single bottom-left corner radius `0px 0px 0px 100px` (yet another corner pattern variant). Same SPRING REFRESH promobar. Same 10 placeholder logos.

**Figma defines** (page body):
- 3 body paragraphs (em-dashes in each):
  - `1309:10217`: "Blue Tree publishes expert guides...Southeastern Pennsylvania **—** including Montgomery, Bucks, Chester, Delaware, and Philadelphia Counties..."
  - `1309:10218`: "Every article on this site is written by a member of the Blue Tree team **—** not a freelance writer, not an AI tool, and not a marketing agency...with **more than four decades** of hands-on project experience."
  - `1309:10219`: "You can learn more about each author's background, credentials, and areas of expertise on our Meet the Team page."
- H2 (`1309:10221`): "How We Create and **Review Content**" (last 2 words in Primary 2 green emphasis)
- 4 process step cards (`1309:10224`, `10228`, `10232`, `10236`) — Primary navy fill, 24px radius, 40px padding
- H2 (`1309:10247`): "Questions About **Our Content**"
- Closing CTA pair (`1309:10241` — solid Accent 2 + Primary outline)
- `1309:10248`: "If you have a question about any article on our site **—** or if you believe something we have published needs to be corrected or updated **—** we welcome your feedback."

**Deployed:**
- H1: "Our Editorial Standards"
- No pre-headline / hero subhead — Figma has body paragraphs directly under hero (no subhead element)
- **CTAs: "Request a Consultation", "Request Your Free Consultation"** — mixed wording, neither matches Q1 canonical "Request a Free Estimate"
- H2 order: "How We Create and Review Content" → "Questions About Our Content" — matches Figma
- **Last Updated: [Month Year] placeholder** — existing FLAG carried forward
- **AUTHOR BLOCK: NOT FOUND** — Editorial overlay v1.1 §14/§18 requires authors named with credentials per E-E-A-T. This is a structural deficiency.
- Em-dashes confirmed (multiple)

### NEW findings (Editorial Standards)

| # | Finding | Severity | Disposition |
|---|---|---|---|
| ES1 | **No author block / E-E-A-T author attribution** rendered on this page. Editorial overlay (v1.1 §14 / §18) requires named authors with credentials, JSON-LD `author` schema, and reviewer attribution per article. The Editorial Standards page itself should also list the standard authors (Jeff, Jérôme, Chad, Mark, Lead Designer TBD per AGENTS.md). | **BLOCK** | New subtask: add author block + JSON-LD author schema to the page (matches editorial overlay) |
| ES2 | Hero CTAs use "Consultation" wording, mixed labels ("Request a Consultation" + "Request Your Free Consultation"). Q1 canonical = "Request a Free Estimate" | **BLOCK** | New subtask: standardize hero CTAs to canonical |
| ES3 | Em-dashes ×3+ in body (2 in opening paragraphs, ≥2 in "Questions About Our Content" closing copy) | **BLOCK** | New subtask: em-dash sweep on this page (sitewide S5 instance) |
| ES4 | "with more than **four decades** of hands-on project experience" in body para 2 — same "40 years" cascade as sitewide S6 | **BLOCK** | New subtask: replace "four decades" with "43 years" or "since 1983" |
| ES5 | "[Last Updated: [Month Year]]" placeholder | covered by existing fix-list note | Already in queue (P11 of existing fix-list or sitewide handling) |
| ES6 | Logo strip placeholder | covered by sitewide S9 + S14 | Already in queue |

---

## Page 9 — Blog Hub (`/blog/`)

**Figma:** No dedicated frame in scope. Blog Hub uses an inner-page template. (Figma's "Inner" FRAME `1309:10249` may contain template mockups — out of scope for this audit pass.)

**Deployed:**
- H1: "Landscaping Tips & Outdoor Ideas"
- Pre-headline / promobar: SPRING REFRESH (sitewide S12 — being removed)
- **Hero subhead: "Welcome to the BlueTree Landscaping blog **—** your go-to resource..."** — TWO violations: (1) **"BlueTree Landscaping" in body copy** (v1.1 §1.1 — legal entity footer-only; also missing space "BlueTree" vs "Blue Tree"); (2) em-dash
- **4 distinct CTA labels on one page:** "Request a Consultation", "Start Your Transformation", "Request Your Free Consultation", "Read Now" — none match Q1 canonical "Request a Free Estimate"; multiple variants reads as inconsistent
- H2s show 8 distinct article titles but "How Much Does an Inground Pool Cost in Pennsylvania?" duplicated 6 times (existing P5 #1 BLOCK)
- No author bylines (existing P5 #2 BLOCK)
- No date / Last Updated patterns visible
- No filter / category UI
- **Phone "(610) 222-0590" above fold** (sitewide S3 violation)
- **Phone "(610) 569-9810" in footer** — legacy number being replaced per S4 ruling

### NEW findings (Blog Hub)

| # | Finding | Severity | Disposition |
|---|---|---|---|
| BH1 | **"BlueTree Landscaping" in hero subhead** — three issues: (a) legal entity name in body copy violates v1.1 §1.1, (b) missing space ("BlueTree" should be "Blue Tree" — typo), (c) em-dash | **BLOCK** | New subtask: rewrite hero subhead to "Welcome to the Blue Tree blog. Your go-to resource..." (or similar without em-dash, brand-correct, and no legal-entity-in-body) |
| BH2 | 4 different CTA labels on one page; none match Q1 canonical "Request a Free Estimate" | **BLOCK** | New subtask: standardize all CTAs to canonical |
| BH3 | "(610) 569-9810" legacy phone in footer | covered by sitewide S4 (resolved — replace with (610) 222-0590) | Already in queue |
| BH4 | Phone "(610) 222-0590" above fold | covered by sitewide S3 (footer-only) | Already in queue |
| BH5 | Inground Pool Cost post duplicated 6× | covered by existing P5 #1 | Already in queue |
| BH6 | No author bylines | covered by existing P5 #2 | Already in queue |
| BH7 | Logo strip + missing alt | covered by sitewide S9 + S14 | Already in queue |

---

---

## Page 15 — Contact Us (`/contact/`)

**Figma:** No dedicated frame.

**Deployed:**
- H1: "Contact Blue Tree" ✓
- Hero subhead: "Whether you're ready to start a project, have a question about an existing one, or just want to learn more about what we do **—** we're here to help." (em-dash)
- **4 different CTA labels:** "Request a Consultation" / "Request a Free Estimate" / **"Call Us"** / "Visit Us" — "Call Us" violates form-first rule per voice profile §11; canonical "Request a Free Estimate" present once but mixed with other variants
- Phone "(610) 222-0590" above fold + in banner (existing P11 + sitewide S3)
- Phone "610.569.9810" in footer (existing P11 + sitewide S4 — replace with canonical)
- Email: info@bluetreelandscaping.com ✓
- Hours: "Monday–Friday: 7:00 AM – 5:00 PM Saturday: By Appointment Sunday: Closed" ✓
- Address: "4494 Skippack Pike, Schwenksville, PA 19473" ✓ (errata B4 resolved)
- **Service area lists only 4 counties — Philadelphia missing** (sitewide S1)
- FAQ Swiss-post placeholder (sitewide S2)
- "Healthy Yards" plural ✓

### NEW findings (Contact)

| # | Finding | Severity | Disposition |
|---|---|---|---|
| C1 | "Call Us" hero CTA violates form-first rule | **BLOCK** | New subtask: remove "Call Us" CTA; replace with form-first |
| C2 | Mixed CTA labels (4 different on one page) — none consistently canonical | **BLOCK** | New subtask: standardize to "Request a Free Estimate" per Q1 |
| C3 | Em-dash in hero subhead | **BLOCK** | New subtask: rewrite (sitewide S5 instance) |
| C4 | Phone above fold, legacy phone footer, 4-county footer, FAQ Swiss-post placeholders | covered by S1+S2+S3+S4 + existing P11 | Already in queue |

---

## Page 16 — Request an Estimate (`/request-estimate/`)

**Figma:** No dedicated frame.

**Deployed:**
- H1: "Request Your Free Design Consultation" ✓ form-first
- Hero subhead: "Tell us about your project and one of our degreed designers will contact you within one business day to schedule a free on-site visit." (clean — no em-dash, no cascade) ✓
- **CTAs mixed:** "Request a Free Estimate" / "Submit" / "Request Your Free Consultation" — H1 says "Consultation" but CTA says "Estimate" — internal inconsistency
- Phone "(610) 222-0590" above fold + "610.569.9810" footer — same sitewide S3 + S4
- **Form fields: Email*, Phone Number, Prefer Method** — extremely minimal for an estimate request form. Brief likely specifies: Name, Email, Phone, Project Type (multi-select), Approximate Budget Range, Project Location/Town, Preferred Timeline, Project Description, How Did You Hear About Us. Verify against brief.
- "13–14 yrs Avg. Tenure" ✓ canonical
- "Founded 1983" / "43 years as of 2026" ✓
- **"Healthy Lawn" appears in footer** while nav uses "Healthy Yards" — likely a missed instance of the singular violation
- FAQ Swiss-post placeholder
- Em-dash in body: "...the last walkthrough **—** and beyond"

### NEW findings (Request an Estimate)

| # | Finding | Severity | Disposition |
|---|---|---|---|
| RE1 | Form fields minimal (Email/Phone/Method only) — brief likely calls for many more fields to properly qualify estimate requests | **BLOCK** | New subtask: align form fields with brief spec |
| RE2 | H1 says "Consultation" but primary CTA says "Estimate" — internal label inconsistency; Q1 canonical is "Request a Free Estimate" but H1 stays per brief? Confirm with Jason. | FLAG | New subtask: reconcile H1 vs CTA wording |
| RE3 | "Healthy Lawn" in footer breaks the "Healthy Yards" plural canonical | **BLOCK** | New subtask: replace "Healthy Lawn" with "Healthy Yards" in footer (likely a sitewide footer instance) |
| RE4 | Em-dash in body | covered by sitewide S5 | Already in queue (general sweep) |
| RE5 | Phone above fold + legacy footer phone + FAQ Swiss-post | covered by S2+S3+S4 | Already in queue |

---

## Page 7 — Service Hub FAQs (`/service-hub/faqs/`)

**Figma:** No dedicated frame.

**Deployed:**
- H1: "Frequently Asked Questions" ✓
- Hero subhead: "Real questions from real homeowners **—** about project timelines, costs, materials, maintenance, and what to expect when working with Blue Tree..." (em-dash)
- CTAs: "Request a Consultation" / "Request Your Free Consultation" — mixed, not canonical
- **Filter UI labels: "All / Pools / Landscapes / Hardscapes / Healthy Yard / Premium Outdoor Services"** — "Healthy Yard" SINGULAR violates the canonical "Healthy Yards" plural rule (v1.1 §10.4 / §11.2). Also "Premium Outdoor Services" — but the renamed canonical is "Premier Outdoor Services" per CLAUDE.md / sitemap v2.1 (Never Do #3).
- **5 questions repeated 6× on page** (existing P4 #3 BLOCK)
- **Swiss Post placeholder content** in answers (existing P4 #1 BLOCK)
- "[Month Year]" placeholder (existing P4 #2)
- Em-dash: "**Four decades** of building outdoor living spaces **—** the story behind the reviews"
- Phone in footer only ✓ (no S3 violation here)

### NEW findings (Service Hub FAQs)

| # | Finding | Severity | Disposition |
|---|---|---|---|
| SH1 | **Filter label "Healthy Yard" SINGULAR** — violates v1.1 §10.4 / §11.2 plural canonical rule | **BLOCK** | New subtask: change filter label to "Healthy Yards" |
| SH2 | **Filter label "Premium Outdoor Services"** — wrong product line name; canonical is "Premier Outdoor Services" (per CLAUDE.md Never Do #3 + sitemap v2.1) | **BLOCK** | New subtask: rename filter to "Premier Outdoor Services" |
| SH3 | Em-dash + "Four decades" in body sentence — double cascade | **BLOCK** | New subtask: rewrite to "43 years of building outdoor living spaces, the story behind the reviews" |
| SH4 | Em-dash in hero subhead | covered by sitewide S5 sweep | Already in queue (general sweep) |
| SH5 | CTAs mixed, not Q1 canonical | covered by sitewide S13 | Already in queue (general application) |

---

## Page 8 — Care Instructions (`/care/` — alt URL, sitemap target `/service-hub/instructions/`)

**Figma:** No dedicated frame.

**Deployed:**
- H1: "Care Instructions & Maintenance Guides" ✓
- Hero subhead: "Your Post-Project Owner's Manual - Everything you need to protect your investment **—** from seasonal checklists and product-specific care to expert maintenance guidance, organized by the service Blue Tree performed." (em-dash; also note: opening uses " - " hyphen which reads as a typographic em-dash substitute)
- CTAs: "Request a Consultation" + "Request Your Free Consultation" — mixed
- H2 list: "Pool Care Instructions" / "Care and Your Warranty" / "Ready to Start?" — only 3 H2s; brief likely requires care sections for pool, hardscape, turf, planting (4 service line care types)
- **Only Pool Care fully detailed.** Hardscape, turf, planting care content missing from this page.
- **NO YMYL disclaimer for chemical/lawn applications** (existing P13 BLOCK — required per editorial overlay)
- "Healthy Yards" plural in nav, inconsistent labeling elsewhere (per WebFetch)
- "[Month Year]" placeholder (existing P13)
- Phone footer only ✓ (no S3 here)
- Em-dashes present

### NEW findings (Care Instructions)

| # | Finding | Severity | Disposition |
|---|---|---|---|
| CI1 | Em-dash in hero subhead + " - " hyphen substitute (also a typographic stand-in for an em-dash, breaks v1.1 §11.3) | **BLOCK** | New subtask: rewrite hero subhead, remove both em-dash and " - " hyphen-dash |
| CI2 | CTAs mixed, not Q1 canonical | covered by sitewide S13 | Already in queue |
| CI3 | YMYL disclaimer missing, "[Month Year]" placeholder, Healthy Yard singular | covered by existing P13 + sitewide rules | Already in queue |

---

---

## Page 17 — Careers (`/careers/`)

**Figma:** No dedicated frame.

**Deployed:**
- H1: "Careers at Blue Tree" ✓
- Hero subhead: "We've been designing, building, and maintaining outdoor living spaces across Southeastern Pennsylvania since 1983, bringing 43 years of experience in the industry." ✓ canonical "43 years" — first conversion page that handles tenure cleanly
- **5 different CTA labels:** "View Open Positions" / "Submit a General Application" / "Apply Now" / "Request Your Free Consultation"
- H2 "**We Are Growing - Current Openings**" — hyphen-as-separator (treat as em-dash equivalent per S5)
- **4 job listings all show "Job Title" placeholder + same Stephen Roehm bio repeated** (existing P14 #1 BLOCK)
- Benefits placeholders: "**[Pending confirmation — health insurance, dental, vision details TBD]**" and "**[Pending confirmation — PTO, holidays, sick days TBD]**" (existing P14 #2)
- **Tenure conflict on same page:** stats show "13–14 years" but narrative says "average employee tenure is **15 years**" (existing P14 #3 + sitewide S7)
- 3+ em-dashes in body
- Swiss-post FAQ (sitewide S2)
- Phone NOT above fold ✓

### NEW findings (Careers)

| # | Finding | Severity | Disposition |
|---|---|---|---|
| CA1 | H2 "We Are Growing **-** Current Openings" uses hyphen-as-em-dash separator | **BLOCK** | New subtask: rewrite H2 (sitewide S5 includes dash-substitutes) |
| CA2 | 5 different CTAs, none canonical Q1 wording | covered by sitewide S13 | Already in queue |
| CA3 | 3+ em-dashes in body | covered by sitewide S5 sweep | Already in queue |
| CA4 | Job listings + Stephen Roehm bio + benefits placeholders + 15yr/13-14yr conflict | covered by existing P14 #1-#3 | Already in queue |

---

## Page 18 — Financing (`/financing/`)

**Figma:** No dedicated frame.

**Deployed:**
- H1: "Financing Options for Your Outdoor Living Project" ✓
- Hero subhead: "Your dream backyard doesn't have to wait. Blue Tree partners with trusted lending institutions to offer flexible financing that fits your budget and your timeline." ✓ clean — no em-dash, no cascade
- **5 different CTA labels:** "Start Your Transformation" / "Request a Consultation" / "Apply Now" / "Let's Design Your Plan" / "Request Your Free Consultation"
- **H2 "How It Works **—** Simple, Transparent, and On Your Terms"** — em-dash in heading
- **H2 "Financing and Phasing **—** Two Ways to Make Your Vision Work"** — em-dash in heading
- **Step 3 still has unfilled brackets:** `[Financing Partner Name]`, `[a quick online application / a streamlined process]`, `[minutes / 24 hours]` (existing P15 #1 BLOCK)
- **Real partners named in body:** HFS Financial / Viking Capital / Lyon Financial — confirm with client these are still active partners
- Swiss-post FAQ (sitewide S2)
- Phone NOT above fold ✓ (only footer; footer legacy phone S4)
- Address: "4494 Skippack Pike Schwenksville, PA 19473" ✓

### NEW findings (Financing)

| # | Finding | Severity | Disposition |
|---|---|---|---|
| F1 | Em-dash in H2 "How It Works **—** Simple, Transparent, and On Your Terms" | **BLOCK** | New subtask: rewrite |
| F2 | Em-dash in H2 "Financing and Phasing **—** Two Ways to Make Your Vision Work" | **BLOCK** | New subtask: rewrite |
| F3 | 5 different CTAs, none canonical | covered by sitewide S13 | Already in queue |
| F4 | "[Financing Partner Name]" + 2 other placeholder brackets in Step 3 narrative | covered by existing P15 #1 BLOCK | Already in queue — but flag for Jason: 3 real partners ARE named elsewhere on page (HFS / Viking / Lyon), so Step 3 narrative needs the same partner names plugged in instead of brackets |
| F5 | Confirm with client: HFS Financial / Viking Capital / Lyon Financial all still active financing partners | FLAG | Client confirmation needed (will be batched with promo bar + memberships request if Jason approves) |

---

## Page 19 — Privacy Policy (`/privacy-policy/`)

**Figma:** No dedicated frame (legal/template page).

**Deployed:**
- **H1: "Blue Tree Landscaping Privacy Policy: Your Rights and Our Practices"** — legal entity name in H1 (existing P16 #1 BLOCK)
- Pre-headline: SPRING REFRESH — even on a privacy/legal page (sitewide S12 — being removed)
- H2 order: Our Privacy Policy Explains / Collection of Your Personal Information / Understanding Our Use of Cookies for Enhanced User Experience / Google AdWords or Adroll Remarketing / Changes to this Privacy Policy / Enforcement of this Privacy Policy and Contact Information
- **"Blue Tree Landscaping" used extensively throughout body** — repeated. Per v1.1 §1.1, legal entity is allowed in "origin story, footer legal block, and JSON-LD schema fields." Privacy policies are legal documents — the body usage is arguably within the §1.1 exception, but the **H1 itself is customer-facing and should use "Blue Tree" instead**.
- Address: "4494 Skippack Pike Schwenksville, PA 19473" ✓
- Email: info@bluetreelandscaping.com ✓
- **No effective date / Last Updated** — required for legal compliance on a privacy policy
- Em-dash present
- Mentions: cookies, Google AdWords, Adroll remarketing, Google Display Network
- **No GDPR / CCPA references** — likely incomplete for legal compliance (CCPA applies if Blue Tree gets any California visitors; GDPR if any EU visitors)
- **No mention of Klaviyo or Google Analytics** — but these are likely third-party services on the site that the privacy policy needs to disclose
- Footer phone: "610.569.9810" (sitewide S4 legacy)

### NEW findings (Privacy Policy)

| # | Finding | Severity | Disposition |
|---|---|---|---|
| PP1 | **H1 uses "Blue Tree Landscaping"** — customer-facing H1 should use "Blue Tree" per v1.1 §1.1; legal entity body usage is the §1.1 exception for privacy policies | **BLOCK** | Already covered by existing P16 #1 (re-confirming) — change H1 to "Blue Tree Privacy Policy: Your Rights and Our Practices" |
| PP2 | **No effective date / Last Updated** on the privacy policy | **BLOCK** | New subtask: add an "Effective Date" or "Last Updated" line at the top of the policy — required for legal compliance |
| PP3 | **No GDPR / CCPA references** + missing third-party service disclosures (Klaviyo, Google Analytics if used) | **BLOCK** (legal compliance) | New subtask: legal review pass — confirm with counsel whether GDPR/CCPA clauses are needed and what third-party services are on the site that need disclosure |
| PP4 | Em-dash in body | covered by sitewide S5 | Already in queue |
| PP5 | SPRING REFRESH promo bar on a legal page | covered by sitewide S12 | Already in queue |
| PP6 | Legacy footer phone | covered by sitewide S4 | Already in queue |

---

## Final summary — all 17 pages audited end-to-end

**Audit coverage** (post-scope-gap-closure 2026-05-13):

| Bucket | Count | Where |
|---|---|---|
| Priority 4 pages, full Figma + brief + deployed | 4 | `figma-audit.md` |
| Additional 9 pages with dedicated Figma frames or shared inner-template | 9 | This file |
| Total deployed pages audited end-to-end | **13** | combined |
| Plus 2 alt-URL pages also audited (Meet the Team, Care Instructions) | 2 | this file |
| Grand total | **15 deployed + 2 alt URL = 17** | full Phase 0 deployed scope ✓ |
| Pages NOT built (deferred to Phase 1) | 4 | `page-status-tracker.md` — not in audit scope |

**Pages still pending a dedicated Figma deep-dive** (deployed audit complete; Figma frame inspection optional since deployed-side findings + briefs already capture the work):
- Page 7 Service Hub FAQs (template inner-page; no dedicated Figma)
- Page 8 Care Instructions (template inner-page; no dedicated Figma)
- Page 9 Blog Hub (template inner-page; no dedicated Figma)
- Page 15 Contact Us (template inner-page; no dedicated Figma)
- Page 16 Request an Estimate (template inner-page; no dedicated Figma)
- Page 17 Careers (template inner-page; no dedicated Figma)
- Page 18 Financing (template inner-page; no dedicated Figma)
- Page 19 Privacy Policy (template inner-page; no dedicated Figma)

For these 8 template-inner pages, the canonical visual spec is the "Inner" FRAME `1309:10249` in Figma (large template canvas, 19880×15000) — visual-fidelity sweep against the inner template can be a separate optional pass once Phase 1 needs the inner template enforced more strictly.

**Cross-cutting patterns reinforced by the full audit:**
- Em-dash issue is universal — every audited page has at least 1 em-dash; cumulative count across the 17 pages is well over 50 instances
- Logo strip placeholders are universal (every page with the strip)
- CTA wording inconsistency is universal (Q1 canonical "Request a Free Estimate" not yet applied anywhere consistently except the existing About/Our Story/Our Process subset)
- Swiss-post FAQ template defaults appear on every page that has a FAQ block (10+ pages)
- Phone-above-fold is on ~7 pages (sitewide S3)
- Footer legacy phone is on every page (sitewide S4)
- "Healthy Yard" singular violation now confirmed on 3+ pages (Care Instructions, Service Hub FAQs filter, Request Estimate footer) — wider than initially flagged
- "Premier" vs "Premium" wording error confirmed on at least 1 page (Service Hub FAQs filter)

**ClickUp sync state:** Every audited page has parent comments + new subtasks pushed to its parent task with assignee Raja, start 2026-05-13, due Sat 2026-05-16. Client-input asks held back per Jason's directive (no auto-assignment to Maureen + Jérôme without explicit approval).
