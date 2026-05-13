# Fix List for Raja — Phase 0 Quick Launch

**For:** Raja Sheryar (dev lead, Breakdance)
**From:** Jason Spencer (ROI.LIVE)
**Date:** 2026-05-13
**Target:** All BLOCK items resolved by 2026-05-21 EOD so internal QA can close 2026-05-22 for the 2026-05-25 launch.

This is the single source of truth for what needs fixing on the 21-page Phase 0 site at `bluetree.tempurl.host`. Items are grouped first by **sitewide fixes** (one template change resolves many pages) and then by **per-page fixes** (Raja sprint-ready, ordered by page).

Severity codes: **BLOCK** = launch-gating · **FLAG** = fix before final QA · **NIT** = optional.

Pages NOT included in this list because they're not built: `/portfolio/completed-projects/`, `/service-hub/`, `/service-hub/warranties/`, `/terms-of-service/`. See `page-status-tracker.md` for the build-gap discussion (pending Jason ruling).

## How to work this list

For each item, Raja's workflow is:
1. **Verify** the issue on the staging site (URL given).
2. **Fix** the issue (Breakdance template or per-page edit).
3. **Mark done** by leaving a ✅ in a ClickUp comment on the relevant task with a screenshot.
4. Once all BLOCKs on a page are done, **move the ClickUp task** to "Ready for QA" or equivalent.

Where copy is missing (real reviews, real team bios, real job descriptions, etc.), wait for Jason to send the content drop — don't fabricate copy. Items marked **AWAITING CONTENT** mean the dev fix unlocks the slot but real text comes from us.

---

## SECTION 1 — Sitewide template fixes (do these FIRST — one fix resolves many pages)

### S1. Footer "Service Areas" — add Philadelphia — BLOCK

**Where:** Global footer component.
**Current:** "Montgomery County, Bucks County, Chester County, Delaware County" (4 counties).
**Fix to:** "Montgomery County, Bucks County, Chester County, Delaware County, Philadelphia County" — or use the prose form "Montgomery, Bucks, Chester, Delaware, and Philadelphia Counties" if that fits the layout better.
**Affects:** every page (17 of 17 audited).

### S2. Override the global FAQ widget defaults — BLOCK

**Where:** Breakdance FAQ block / module — likely a shared widget with template fallback Q&As.
**Current:** Every FAQ block shows the template defaults: Swiss Post Service shipping, magazine subscriptions, "create a new account at the end of the order process", design fairs in Switzerland.
**Fix:** override the global FAQ widget template so it does NOT render any default Q&As. If no FAQ content is provided for a page, the section should hide entirely (display:none) rather than render placeholders.
**Affects:** `/about/`, `/about/our-story/`, `/about/why-choose-us/`, `/about/our-process/`, `/service-hub/faqs/`, `/contact/`, `/request-estimate/`, `/careers/`, `/financing/`, `/portfolio/` (10 pages).
**Real FAQ copy** will be sent per-page by Jason after this fix lands.

### S3. Remove phone number from header / promo bar — BLOCK (v1.1 §11.5)

**Where:** Sitewide header navigation / top promo bar.
**Current:** Phone visible above the fold on `/contact/`, `/request-estimate/`, `/care/`, `/about/why-choose-us/`, `/blog/`, `/portfolio/`, `/privacy-policy/` (and likely others — inconsistent rendering across pages suggests two header variants in play).
**Fix:** phone number lives in footer only. No phone in header, no phone in any promo/banner bar above the hero, no phone in "Contact" callout boxes above-the-fold on conversion pages.
**Affects:** sitewide (7+ pages observed).
**Brand reason:** Blue Tree is form-first per voice-profile rules. Phone in header diverts conversions away from the qualified-lead form path.

### S4. Phone number reconciliation — BLOCK (RESOLVED 2026-05-13)

**Where:** All pages that show a phone number.
**Current:** Two different phone numbers appearing:
- `(610) 222-0590` on `/contact/`, `/request-estimate/`
- `(610) 569-9810` on `/contact/`, `/care/` (legacy number from current live site `bluetreelandscaping.com`)
**Fix — CANONICAL:** **(610) 222-0590** is the only phone number for the new website. Replace every instance of `(610) 569-9810` / `610.569.9810` / variants sitewide with `(610) 222-0590`. The legacy number on the current live site does NOT carry over.
**Affects:** every page where a phone appears. Combined with S3 (remove from header), all phone instances should be (610) 222-0590 in the footer only.

### S5. Sitewide em-dash sweep — BLOCK (v1.1 §11.3 absolute ban)

**Where:** Body copy, headings, captions on every page.
**Current:** Em-dashes confirmed on at least 10 pages, including in the H1 of `/about/our-process/`.
**Fix:** sitewide find-replace `—` → comma / period / parenthesis / rewrite. After find-replace, do a visual sweep to catch em-dashes Raja may not have touched. Particular hot spots:
- H1: "How We Work: From Vision to Reality — and Beyond" → use the brief's H1 instead (see P10 below)
- Lede paragraphs on most pages
- Origin paragraph on `/about/our-story/`
- Step 02 / Step 05 descriptions on `/about/our-process/`
- Closing CTA copy across multiple pages

Re-audit before launch by running a regex search on the WordPress post_content table:
```sql
SELECT ID, post_title, post_status FROM wp_posts WHERE post_content LIKE '%—%';
```

### S6. Tenure stat — "40 years" / "four decades" → "43 years" — BLOCK (v1.1 §1.6)

**Where:** Body copy on multiple pages.
**Current:** "40+ years", "Four decades later", "more than 40 years", "trusted us for over 40 years", "40 Years" (as section header on `/about/our-story/`).
**Fix to:** "43 years" wherever a tenure stat is used. Note: the creative briefs themselves still say "40+ years" in places — this is being corrected at the brief level too, but the deployed pages should use the v1.2 voice profile number (43) regardless.
**Affects:** Homepage, `/about/`, `/about/our-story/`, `/about/meet-the-team/`, `/about/why-choose-us/` (mixed), `/careers/` (conflict with 13–14 number).

### S7. Tenure stat — "15 years" employee → "13 to 14 year" — BLOCK (v1.1 §1.6)

**Where:** `/careers/` and `/about/why-choose-us/`.
**Current:** "Our average employee tenure is 15 years" on `/careers/` (conflicts with "13–14 years" headline on same page).
**Fix to:** "13 to 14 year average employee tenure" — `15 years` is reserved for the pool construction track record only.
**Affects:** 2 pages confirmed; sweep the rest.

### S8. Footer copyright / legal entity — VERIFY — NIT/FLAG

**Where:** Footer.
**Current:** "© 2026 Blue Tree Landscaping. All Rights Reserved." (acceptable — legal entity correctly used in footer).
**Fix:** no fix; this is correct per v1.1 §1.1. Do NOT remove the "Blue Tree Landscaping" footer reference. The legal entity ONLY appears in footer / JSON-LD schema / origin story — never in H1 or body copy.

### S9. Logo strip — replace placeholder tech logos sitewide — BLOCK (Figma audit 2026-05-13)

**Where:** Logo strip component on `/about/` (10 logos), `/about/our-story/` (10 logos), likely `/about/why-choose-us/` and others — any page using the logo strip block.
**Current:** Placeholder Breakdance demo set: brave / circle / discord / google / jump / lollapalooza / magiceden / meta / shopify / stripe. These are tech-startup brands with zero relevance to a residential design-build firm.
**Fix:** Replace with credibility strip per `deliverables/logo-strip-recommendations-for-raja.md` — combination of real third-party affiliation logos (NALP, PLNA, ICPI, APSP/CBP — all confirmed in voice profile §1.7; plus BBB / Houzz / Angi pending client status) plus 5 custom-designed trust seals (43 Years Family-Owned · Lifetime Structural Warranty · Co-Owned Since 1994 · Licensed Bonded Insured · Design-Build-Maintain). ChatGPT prompts for each custom seal are in the recommendations doc.
**Affects:** every page with a logo strip; confirmed visually on About + Our Story; suspected on Why Choose Us + others. Sweep all pages with the strip.

### S10. Service / portfolio card titles — semantic tag fix from H2 to H3 — FLAG (Figma audit 2026-05-13)

**Where:** Service card components site-wide (About Section 17, Our Story Section 5, Home gallery components). Likely the Breakdance card template's title element is set to H2.
**Current:** Card titles render as page-level H2 in the document outline. Examples:
- Homepage: "Backyard Resort" (portfolio card title) appears as H2
- About: "Custom Pools & Water Features" / "Patios, Walls & Outdoor Kitchens" / "Landscape Design & Planting" / "Lawn Programs" / "Landscape Lighting" / "Year-Round Care" all render as H2

**Fix:** In the Breakdance card template, change the title element's HTML tag from `<h2>` to `<h3>`. Style can stay the same — only the semantic tag changes. This protects the page's H1→H2 outline integrity for SEO and accessibility.
**Affects:** Home, About, likely Our Story, likely Service pages (Phase 1 prep).

### S11. Font stack consolidation to Archivo + Nunito — BLOCK (Jason ruling 2026-05-13)

**Where:** Sitewide CSS / Breakdance theme font settings.
**Current:** About page renders 4 font families: Archivo (display) + SF Pro Rounded (body) + Circular Std (promobar) + Poppins (footer). Home renders 2. Inconsistent.
**Jason ruling:** SF Pro Rounded is licensed by Apple ONLY for registered developers building Apple-platform UI mockups. Using it on a public website violates Apple's license. Consolidate to 2 web-licensed families.
**Canonical font stack:**
- **Archivo** (Google Fonts, SIL OFL) — display: H1, H2, page titles, stat numbers, button text on display elements. Weights needed: ExtraBold 800, SemiBold 600.
- **Nunito** (Google Fonts, SIL OFL) — body, subheads, paragraph, UI, CTA labels, footer copy. Weights needed: Regular 400, Medium 500, SemiBold 600, Bold 700.
**Why Nunito:** closest visual match to SF Pro Rounded (humanist rounded sans), web-safe license, full weight range.
**Remove from theme:** SF Pro Rounded (license violation), Circular Std (was for promobar; promobar being removed anyway per S12), Poppins (was for footer link headers + copy).
**Affects:** Theme-wide. Test rendering on every page after change.
**ClickUp subtask:** `86aher28h` (under Home parent).

### S12. Promobar — hide globally for Phase 0 launch — BLOCK (Jason ruling 2026-05-13)

**Where:** Sitewide top-of-page promo banner element.
**Current:** SPRING REFRESH promo banner appears on `/` and `/about/` but is absent on `/about/our-story/` and `/about/our-process/`. Inconsistent.
**Jason ruling:** Promobar must be consistent sitewide. Client (Jeff/Maureen/Jerome) doesn't have current approved promo content yet — Jason is emailing them. For Phase 0 launch: **hide the promobar globally** until content lands.
**Fix:** Remove or globally hide the promobar element across all pages. Either:
- Set Breakdance global show/hide toggle to false on the promobar element
- OR set `display: none` on the promobar selector in global CSS
**Affects:** Home + About (currently showing — remove SPRING REFRESH); all other pages are already compliant.
**Re-enable later:** When client supplies new promo content, re-enable the promobar globally with the new copy.
**ClickUp subtask:** `86aher28a` (under Home parent). Held subtasks under Our Story (`86aher1wv`) + Our Process (`86aher200`) are marked RESOLVED — close when the Home + About removal lands.

### S13. CTA primary verb canonical = "Request a Free Estimate" — BLOCK (Jason ruling 2026-05-13)

**Where:** Hero primary CTAs across all pages.
**Current:**
- Home: "Start Your Transformation" ← must change
- About: "Request a Free Estimate" ✓
- Our Story: "Request a Free Estimate" ✓
- Our Process: "Request a Free Estimate" ✓

**Jason ruling:** Canonical sitewide hero primary CTA = **"Request a Free Estimate"**.
**Fix:** Change Homepage hero primary CTA text from "Start Your Transformation" to "Request a Free Estimate". Secondary CTA "See Our Work" stays as-is.
**Phase 1 prep:** Every hero CTA on Phase 1 service pages must use "Request a Free Estimate" as the primary verb pattern.
**Document the canonical choice:** Add a note to `clients/blue-tree/standards/client-parameter-sheet.md` under a CTA discipline section.
**Affects:** Just Home for Phase 0; all Phase 1 pages going forward.
**ClickUp subtask:** `86aher1tp` (under Home parent — updated from FLAG to BLOCK).

### S14. Logo strip alt attribute accessibility — BLOCK (Figma audit 2026-05-13)

**Where:** Logo strip images on every page using the strip.
**Current:** Logo images render without descriptive `alt` attributes. Screen readers cannot announce what each badge represents.
**Fix:** When S9 lands (real logos + custom seals), each image must include a descriptive `alt` attribute: "NALP — National Association of Landscape Professionals member", "43 years family-owned since 1983", etc. See `deliverables/logo-strip-recommendations-for-raja.md` for the full alt-text list per badge. Decorative-only `alt=""` is NOT acceptable for trust badges.
**Affects:** Every page with a logo strip. WCAG 2.1 SC 1.1.1 compliance.

---

## SECTION 2 — Per-page fixes (work top-to-bottom)

### P1. Homepage — `/`

| # | Severity | Item | What to do |
|---|---|---|---|
| 1 | **BLOCK** | Lorem Ipsum × 3 in testimonials section | AWAITING CONTENT — Jason will send 3 real testimonials or confirm Trustindex placement here. Until then, hide testimonials section. |
| 2 | **BLOCK** (Q2 ruling 2026-05-13) | Promo banner "SPRING REFRESH 25% OFF" must be removed — client has no approved current promo content | Sitewide S12 — hide promobar globally until client supplies new content (Jason emailing Jerome + Maureen). Same removal lands on About. ClickUp subtask: `86aher28a`. |
| 3 | **BLOCK** | "Four decades later" tenure stat | Replace with "43 years" (S6). |
| 4 | BLOCK | Service area body shows 4 counties only (missing Philadelphia in some sections) | Verify body copy lists "Montgomery, Bucks, Chester, Delaware, and Philadelphia Counties" — fix if not. |
| 5 | FLAG | Footer 4-county list | Sitewide S1. |
| 6 | FLAG | Hero trust bar — confirm 4 items match brief: "40+ Years Local Experience · 7 Designers, 100+ Years Combined · One Team, Start to Finish · Design-Build-Maintain Under One Roof" | Compare to brief; update if missing/different. |
| 7 | NIT | Verify Trustindex widget placement under testimonials (brief calls for it) | If using Trustindex, ensure widget renders correctly. If using static testimonials, replace Lorem Ipsum. |
| 8 | **BLOCK** | Hero stat strip broken — "43" number doesn't render (deployed shows "+ Years Local Experience") AND stats `One Partner` + `Degreed Designers` are rendering as full page-level H2 sections at the top of the page instead of as inline stats inside the hero | Wire the "43+" value into the stat element. Restructure the Hero Stats element so the three stats (43+ Years Local Experience / One Partner Design-Build-Maintain Under One Roof / Degreed Designers 100+ Years Combined) render as an INLINE 3-column stat strip inside the hero — NOT as standalone H2 sections. The stat numbers use H1-style typography per Figma but the elements must be semantic `<div>` with a small/medium heading inside, not page-level `<h2>`. (Figma audit A5.) |
| 9 | **BLOCK** | Em-dash in hero subhead "evolve with you**—**Blue Tree designs" | Sitewide S5. Note: this em-dash cascades from brief → Figma → deployed. Three-tier fix required. (Figma audit H2.) |
| 10 | FLAG | Card titles in portfolio / curated transformations section render as H2 (e.g., "Backyard Resort") | Sitewide S10 — change card template title tag to H3. (Figma audit dim 8.) |
| 11 | FLAG | Primary CTA wording "Start Your Transformation" inconsistent with About / Our Story / Our Process "Request a Free Estimate" | Sitewide S13 — pick one canonical primary CTA verb. (Figma audit dim 6.) |

**ClickUp task:** [Home Page Design (Figma)](https://app.clickup.com/t/86aex9jkd) + [Developed Home Page Revisions](https://app.clickup.com/t/86ahbuny7)

---

### P2. Portfolio — `/portfolio/`

| # | Severity | Item | What to do |
|---|---|---|---|
| 1 | **BLOCK** | H1 reads "Completed Projects: Our Work Across Southeastern PA" — wrong for photo gallery scope | Replace H1 with photo gallery-appropriate H1 per brief (e.g., "Portfolio — Outdoor Living Across Southeastern PA"). "Completed Projects" is a separate deferred page. |
| 2 | **BLOCK** | Only 2 distinct categories repeated 3x = no individual project names | AWAITING CONTENT — Jason will deliver project gallery items: each with name + location + service type + image. Until then, gallery should show real projects from the live site / Drive folder, not repeated category cards. |
| 3 | **BLOCK** | Em-dash in intro "Every project tells a story —" | Sitewide S5. |
| 4 | FLAG | "https://bluetree.tempurl.host" string detected in body | Sweep for hardcoded staging URLs before launch — replace with relative URLs or `https://bluetreelandscaping.com`. |
| 5 | FLAG | Confirm portfolio filtering / CPT decision per your 2026-05-12 DM | Awaiting Jason confirmation on Custom Post Type vs page-based approach. |

**ClickUp task:** [Portfolio Case Study Completed Projects Page Template](https://app.clickup.com/t/86afjw7c8) — note: task references the deferred Completed Projects page; the deployed `/portfolio/` is a different scope.

---

### P3. Reviews — `/reviews/`

| # | Severity | Item | What to do |
|---|---|---|---|
| 1 | **BLOCK** | Placeholder reviewer attribution "[First Name] [Last Initial]., [Town], PA" × 6 | **RESOLVED — embed Trustindex.** Jason confirmed 2026-05-13: all reviews come from Trustindex (live Google reviews via widget). Remove all static placeholder review blocks. |
| 2 | **BLOCK** | 3 distinct review blocks but content is duplicated | Resolved by #1 — static blocks get replaced entirely by Trustindex widget. |
| 3 | **BLOCK** | No Trustindex widget visible per v1.1 §1.8 | Embed Trustindex Google rating badge + full review carousel. The Trustindex widget replaces all static review content site-wide. |
| 4 | FLAG | Footer 4-county list | Sitewide S1. |

**ClickUp task:** [Reviews/Testimonials Page Template Design](https://app.clickup.com/t/86afk7ur2)

---

### P4. Service Hub — FAQs — `/service-hub/faqs/`

| # | Severity | Item | What to do |
|---|---|---|---|
| 1 | **BLOCK** | Swiss-Post / Switzerland design fair template defaults | Sitewide S2. |
| 2 | **BLOCK** | "[Month Year]" Last Updated placeholder | Bind to real date or hide. |
| 3 | **BLOCK** | 5 unique questions repeated 6x throughout page | Configure FAQ widget to render each question once. |
| 4 | FLAG | Scope question — was this page intentionally deployed for Phase 0 or built ahead of Phase 1? | Awaiting Jason ruling per ClickUp comment on task 86afwj01v. |

**ClickUp task:** [FAQs Library Page Template Design](https://app.clickup.com/t/86afwj01v)

---

### P5. Blog Hub — `/blog/`

| # | Severity | Item | What to do |
|---|---|---|---|
| 1 | **BLOCK** | "How Much Does an Inground Pool Cost in Pennsylvania?" duplicated in post grid | Ensure each post renders once in the grid. Likely a query / template issue. |
| 2 | **BLOCK** | No author bylines visible on post cards | Add author byline (name + link to bio page) to every post card. Required for E-E-A-T per editorial overlay. AWAITING author bio pages (Phase 1) — for now, render byline text without link if bio page doesn't exist yet. |
| 3 | FLAG | Phone above fold | Sitewide S3. |
| 4 | FLAG | Footer 4-county list | Sitewide S1. |

**ClickUp task:** [Blog Hub Page Template Design](https://app.clickup.com/t/86afk8grb)

---

### P6. About Us — `/about/`

| # | Severity | Item | What to do |
|---|---|---|---|
| 1 | **BLOCK** | Em-dash in lede "Pennsylvania — and we've been doing it since 1983" | Sitewide S5. |
| 2 | **BLOCK** | "trusted us for over 40 years" | Sitewide S6. |
| 3 | **BLOCK** | Swiss-Post FAQ placeholder | Sitewide S2. |
| 4 | FLAG | "Originally founded as Blue Tree Landscaping in 1983 and now operating as Blue Tree" — origin reference acceptable | No fix needed; this is brand-name discipline exception per v1.1 §1.1. |
| 5 | FLAG | Footer 4-county list | Sitewide S1. |
| 6 | **BLOCK** | Logo strip uses tech-startup placeholders | Sitewide S9 — apply credibility-strip recommendation. (Figma audit A8.) |
| 7 | **BLOCK** | Stats band shows "5 Service Divisions" + **"43+ Years of Co-Ownership"** — the co-ownership number is factually wrong (Jeff + Chad have been co-owners since 1995 = 31 years, not 43; 43 is years in business since 1983) | Fix the factually wrong stat. Recommended replacement: restore Figma's stats: `Established 1983` / `70–90 Employees` / `13–14 Year Avg. Employee Tenure` / `NALP Affiliated` / `Licensed & Insured` — these are the credentials that drive trust on an About page. (Figma audit A11.) |
| 8 | **BLOCK** | Em-dashes AND incorrect year in "Who We Are" body copy: ¶1 "Southeastern PA **—** including Montgomery..." and ¶2 "**partners since 1995** **—** building one of the largest...". The year 1995 is wrong — voice profile §1.6 confirms partnership started **1994**; old reference docs that say 1995 are incorrect. | Sitewide S5 + new fact-fix: rewrite both as commas AND change "1995" → "1994". (Figma audit A12.) |
| 9 | **BLOCK** | Em-dash in Section 17 subhead "frame it all**—**we handle the full picture" | Sitewide S5 — rewrite as comma. (Figma audit A16.) |
| 10 | **BLOCK** | "trusted us for **over 40 years**" in "Learn More About Blue Tree" para | Sitewide S6 — replace with "for 43 years" or "since 1983". (Figma audit A15.) |
| 11 | FLAG | Service card titles ("Custom Pools & Water Features", etc.) rendering as page H2 | Sitewide S10. (Figma audit A10.) |
| 12 | FLAG | 4 inline link cards present in Figma (Read Our Story → / Meet the Team → / See the Difference → / Explore Our Process →) | Verify deployed renders these as H3-styled card with underlined orange Accent 2 link text per Figma 1309:9150. If missing, add. (Figma audit A9.) |
| 13 | NIT | Ownership wording: "co-owned by Jeff Mattiola (President) and Chad Ochnich (Vice President)" — **CORRECT roles**, but the "partners since 1995" date elsewhere on the page is wrong | Roles confirmed correct 2026-05-13 (Jeff President / Chad VP / Co-Owners). AGENTS.md key-contacts corrected. **Date fix:** voice profile §1.6 confirms partnership started 1994, not 1995 — covered by P6 item 8. |

**ClickUp task:** [About Us Page Template Design](https://app.clickup.com/t/86afkbt7z)

---

### P7. Our Story — `/about/our-story/`

| # | Severity | Item | What to do |
|---|---|---|---|
| 1 | **BLOCK** | "Healthy Yard" singular (location TBD) | Replace with "Healthy Yards" plural. |
| 2 | **BLOCK** | Multiple "40 years" / "40+ years" / "Section header: 40 Years" | Sitewide S6 — replace all with "43 years". |
| 3 | **BLOCK** | Em-dash in origin paragraph "an outgrowth of the Blue Tree Garden Center" | Sitewide S5 — rewrite as comma or period. |
| 4 | **BLOCK** | Swiss-Post FAQ placeholder | Sitewide S2. |
| 5 | **BLOCK** | Trustindex widgets missing per brief (multiple placements specified) | Embed Trustindex in hero trust bar + below origin section per brief 2.6, 2.9, 2.13. |
| 6 | FLAG | "Last Updated" date placeholder per brief 2.1 | Bind to real date. |
| 7 | NIT | Confirm "Blue Tree Garden Center" origin reference (intentional per brief 2.3) | No fix; verified. |
| 8 | **BLOCK** | Logo strip uses tech-startup placeholders | Sitewide S9. (Figma audit S5.) |
| 9 | **BLOCK** | 14+ em-dashes in body copy — heaviest em-dash density of any audited page. Hot spots: "70-90 professionals **—** peaking around 90"; "small landscaping operation **—** an outgrowth"; "shop **—** one of Jeff's favorite memories"; "everything we do." **—** Jeff Mattiola; "four decades **—** and that you'll experience"; "didn't chase a trend **—** we listened"; "every decision **—** from which projects"; "buzzword here **—** it's a survival skill"; "pool the right way **—** from excavation"; "budget." **—** Jeff Mattiola; "Jeff Mattiola and Chad Ochnich **—** two partners"; "could go wrong **—** before we start"; "always a conversation **—** she would educate" | Sitewide S5 — full em-dash sweep on this page is non-trivial. Recommend tool-humanizer pass + manual review. (Figma audit S11.) |
| 10 | **BLOCK** | H2 "Giving Back to the Communities We've Served for **40 Years**" | Sitewide S6 — change to "43 Years" in heading. (Figma audit S9.) |
| 11 | **BLOCK** | Body sentence "Established in 1983, with 70–90 employees and **over 40 years of experience**..." | Sitewide S6 — replace "over 40 years of experience" with "43 years of experience" or "since 1983". (Figma audit S10.) |
| 12 | **BLOCK** | Logo strip missing alt attributes (accessibility) | Sitewide S14. |
| 13 | FLAG → SHIP (Q7 ruling 2026-05-13) | Stats band drift — Jason approved shipping the new factual stats. Keep: "44+ years combined pool construction manager experience" / "20+ years pool builder experience" / "25 to 30 years client relationships" / "30 years partnership duration" / "70–90 Employees" / "13–14 Years avg tenure". Recommended: keep deployed inline body stats; do NOT add the Figma 3-stat header band — inline stats are richer than the band would be. Add the approved new claims to the v1.2 voice-profile power-stats list. ClickUp subtask: `86aher1wm`. (Figma audit S6.) |
| 14 | FLAG | Quotes attributed to Jeff are truncated vs Figma. Figma: "All you have in life is your reputation. Don't mess it up. That stuck with me. It's guided everything we do." Deployed: "All you have in life is your reputation. Don't mess it up." Similarly the "turnkey approach" quote drops the second sentence. | Decide whether to restore Figma's full quotes or accept the trimmed versions as editorial cuts. Sync Figma and deployed. (Figma audit S7.) |
| 15 | FLAG | Hero promobar missing | Sitewide S12. (Figma audit S3.) |
| 16 | NIT | Address: footer shows "4494 Skippack Pike Schwenksville, PA 19473" — both "Skippack" (street name) and "Schwenksville" (USPS mailing city) appear correctly. The earlier "errata B4" concern about HQ-city conflict was a misread. | **RESOLVED** — Skippack Pike + Schwenksville is a single valid address. Close errata B4 in `context/errata-consolidated.md`. (Figma audit S12.) |

**ClickUp task:** [Our Story Page Template](https://app.clickup.com/t/86afjvu2p)

---

### P8. Meet the Team — slug delta `/about/meet-the-team/` → `/about/team/`

| # | Severity | Item | What to do |
|---|---|---|---|
| 1 | **BLOCK** | **All 20+ team cards show identical "Chad" bio** | **CONTENT READY** — see `deliverables/content-drops/team-bios.md` (21 members with verbatim bios, department tags, credentials, tenure). Source: current live site `bluetreelandscaping.com/about/meet-the-team/`. Fix the data binding so each card renders its own bio, wire in the 21 bios from the content drop, pull existing headshots from the live-site team page. Brand-voice-cleaned final copy lands 2026-05-21 for swap. This is the #1 most-visible bug on the site. |
| 2 | **BLOCK** | "more than 40 years of hands-on experience" | Sitewide S6. |
| 3 | **BLOCK** | Em-dash "a landscape that finally feels like you — let's talk" | Sitewide S5. |
| 4 | **BLOCK** | "Blue Tree Landscaping" in body copy | Replace with "Blue Tree" or "Blue Tree Outdoor Living" — legal entity is footer-only. |
| 5 | FLAG | Slug align to `/about/team/` with 301 redirect from `/about/meet-the-team/` | See ClickUp comment on task 86afk9khm. |
| 6 | FLAG | Department filter tags (Design / Project Managers / Support / Leadership / Marketing) per brief | Verify filter UI exists once real bios populate. |
| 7 | NIT | Individual author bio child pages `/about/team/[slug]/` per brief | Phase 1 deliverable; not blocking Phase 0 launch but required before blog posts launch. |

**ClickUp task:** [Meet the Team Page Template Design](https://app.clickup.com/t/86afk9khm)

---

### P9. Why Choose Blue Tree — `/about/why-choose-us/`

| # | Severity | Item | What to do |
|---|---|---|---|
| 1 | **BLOCK** | Em-dash in hero / H1 area | Sitewide S5. |
| 2 | **BLOCK** | Phone above fold | Sitewide S3. |
| 3 | **BLOCK** | "15 years" used in employee-tenure context (conflicts with "13–14 Year" elsewhere on same page) | Sitewide S7. |
| 4 | **BLOCK** | Swiss-Post FAQ placeholder | Sitewide S2. |
| 5 | FLAG | Generic image filenames "Logo-9.png" through "Logo-18.png" repeated | Confirm whether these are placeholder fills (replace with real client logos) or intentional patterns (rename for clarity). |

**ClickUp task:** [Why Choose Blue Tree Competitive Differentiation Page Template](https://app.clickup.com/t/86afpj75f)

---

### P10. Our Process — `/about/our-process/`

| # | Severity | Item | What to do |
|---|---|---|---|
| 1 | **BLOCK** | **H1 is "How We Work: From Vision to Reality — and Beyond" — brief specifies "How We Work: Design, Build, Maintain"** | Change H1 to match brief: **"How We Work: Design, Build, Maintain"**. Also resolves the em-dash. |
| 2 | **BLOCK** | "Healthy Yard" singular in service-divisions list ("five service divisions — Pools, Landscapes, Hardscapes, Healthy Yard, and Premier Outdoor Services") | Replace "Healthy Yard" with "Healthy Yards" (plural). Also sweep the em-dash here. |
| 3 | **BLOCK** | Step 02 + Step 05 contain Swiss-Post e-commerce placeholder language | The step content itself has placeholders — replace with brief's phase descriptions (Design / Build / Maintain). Step text is in the brief's "The Three Phases" section. |
| 4 | **BLOCK** | "13–14 Year" displayed as truncated/incomplete | Bind to full "13 to 14 Year Average Employee Tenure" per brief. |
| 5 | **BLOCK** | Swiss-Post FAQ placeholder | Sitewide S2. |
| 6 | FLAG | 8-step Complete Backyard Process list (brief specifies named steps) | Verify all 8 steps render: Discovery → Custom Design & 3D → Material Selection → Permitting → Site Prep → Construction → Landscape Integration → Final Walkthrough. |
| 7 | FLAG | Internal links to all 5 pillar pages, Portfolio, Meet the Team, Our Story, Request Estimate, Premier Outdoor Services | Verify each link resolves. Note slug deltas (Meet the Team will go to `/about/team/` after S in P8). |
| 8 | **BLOCK** | 3 phase H2 headings carry em-dashes: "Phase 1: Design **—** It Starts With a Conversation" / "Phase 2: Build **—** Your Designer Stays With You" / "Phase 3: Maintain **—** We Are Still Here After the Check Clears" | Sitewide S5 — change each em-dash to a period or rewrite. Suggestion: "Phase 1: Design. It Starts With a Conversation." (Figma audit P6.) |
| 9 | **BLOCK** | Em-dash in hero subhead "at every step **—** so there are no surprises" | Sitewide S5. (Figma audit P3.) |
| 10 | **BLOCK** | Em-dashes in body copy "not a sales pitch **—** A conversation"; "Your designer **—** the same person who sat with you..." | Sitewide S5 — at least 2 body-copy em-dashes; full em-dash sweep needed for this page (≥6 total including H1 + subhead + 3 H2). (Figma audit P7.) |
| 11 | FLAG → BLOCK (Q6 ruling 2026-05-13) | Process step structure: nest the 6 detail steps under 3 phases on Our Process AND restructure Home to show 3 phases with nested steps | **Approved structure:** Phase 1 Design = Step 01 Free On-Site Consultation + Step 02 Custom Design & 3D Presentation + Step 03 Proposal & Budget Alignment. Phase 2 Build = Step 04 Permitting & Pre-Construction + Step 05 Construction & Installation + Step 06 Final Walkthrough & Project Completion. Phase 3 Maintain = ongoing care + warranty support. Our Process keeps the 6-step grid + adds 3-phase grouping above; Home gets restructured to lead with 3 phases (large cards) with steps nested below. ClickUp subtask Our Process side: `86aher1zq`; Home side: `86aher28n`. |
| 12 | FLAG | Hero promobar missing | Sitewide S12. (Figma audit P4.) |
| 13 | FLAG | Logo strip uses tech-startup placeholders | Sitewide S9 + S14 (alt text). (Figma audit P10.) |
| 14 | NIT | "Established 1983" used cleanly on this page (no "40 years" violation) — use this page's phrasing pattern as the canonical replacement for "40+ years" elsewhere | No fix; first page in the audit that handles tenure correctly. (Figma audit P11.) |

**Note:** Figma-side comparison for Our Process is incomplete — Figma API hit the Starter plan rate limit during this audit pass. Schedule a follow-up Figma fetch on node `1309:9238` once the rate-limit window resets (~4.6 days from 2026-05-13) to confirm type / color / spacing / image specs and complete dimensions P13-P16 of the Figma audit table.

**ClickUp task:** [Our Process Page Template](https://app.clickup.com/t/86afpk9wv)

---

### P11. Contact Us — `/contact/`

| # | Severity | Item | What to do |
|---|---|---|---|
| 1 | **BLOCK** | Two different phone numbers on same page | Sitewide S4 (pending Jason's canonical phone number). |
| 2 | **BLOCK** | Phone above fold | Sitewide S3. |
| 3 | **BLOCK** | Em-dash in lede "...we do — we're here to help" | Sitewide S5. |
| 4 | **BLOCK** | Swiss-Post FAQ placeholder | Sitewide S2. |
| 5 | **BLOCK** | Form fields incomplete vs spec — currently Email + Phone + Subject + Message; brief specifies project type, county, budget, timeline | Add: Project type (Pools / Landscapes / Hardscapes / Healthy Yards / Premier / Multiple), County (Montgomery / Bucks / Chester / Delaware / Philadelphia), Budget range, Timeline. |
| 6 | FLAG | Footer 4-county list | Sitewide S1. |

**ClickUp task:** [Contact + Request an Estimate Page Templates](https://app.clickup.com/t/86afjwwm9)

---

### P12. Request an Estimate — `/request-estimate/`

| # | Severity | Item | What to do |
|---|---|---|---|
| 1 | **BLOCK** | Phone above fold `(610) 222-0590` | Sitewide S3 + S4. |
| 2 | **BLOCK** | Em-dash in lede "...last walkthrough — and beyond" | Sitewide S5. |
| 3 | **BLOCK** | "13–14 yrs" abbreviated | Use full "13 to 14 year average employee tenure" per v1.1 §1.6. |
| 4 | **BLOCK** | Form fields incomplete — currently Email + Phone + Preferred Method; same expansion needed as `/contact/` | Add: project type, county, budget, timeline (see P11 #5). |
| 5 | FLAG | CTA button "Request a Free Estimate" vs H1 "Request Your Free Design Consultation" — minor wording mismatch | Reconcile button copy to match H1 framing ("Request a Free Consultation" or "Start My Free Consultation"). |
| 6 | FLAG | Footer 4-county list | Sitewide S1. |

**ClickUp task:** [Contact + Request an Estimate Page Templates](https://app.clickup.com/t/86afjwwm9) (shared with P11)

---

### P13. Careers — `/careers/`

| # | Severity | Item | What to do |
|---|---|---|---|
| 1 | **BLOCK** | **All 4 open job listings show repeated "Stephen Roehm" placeholder bio text instead of job descriptions** | **CONTENT READY** — see `deliverables/content-drops/job-openings.md` (4 real openings: Lawn Care Technician, Pool Service Technician, Hardscape Foreperson, Landscape Foreperson — full descriptions, qualifications). Source: live site `bluetreelandscaping.com/careers/`. Fix the listing template so each role renders unique content, then wire in these 4 listings. Apply mechanism still TBD — confirm with Maureen if it's form-on-page, email, or external ATS. |
| 2 | **BLOCK** | Benefits items: "[Pending confirmation — health insurance, dental, vision details TBD]" + "[Pending confirmation — PTO, holidays, sick days TBD]" | **CONTENT READY** — real benefits are: Healthcare, Dental & Vision · PTO · 401K · Paid Holidays. Identical across all 4 jobs, so recommend a single sitewide "Working at Blue Tree — Benefits" block above/below the openings rather than per-job repetition. Detail in `content-drops/job-openings.md`. |
| 3 | **BLOCK** | "Our average employee tenure is 15 years" body claim conflicts with "13–14 years" headline on same page | Sitewide S7. |
| 4 | **BLOCK** | "Healthy Yard" singular in section header / division name | Replace with "Healthy Yards" plural. |
| 5 | **BLOCK** | Swiss-Post FAQ placeholder | Sitewide S2. |
| 6 | FLAG | Em-dash in 2008 recession history block | Sitewide S5. |

**ClickUp task:** [Careers Page Template](https://app.clickup.com/t/86afpp7jb)

---

### P14. Financing — `/financing/`

| # | Severity | Item | What to do |
|---|---|---|---|
| 1 | **BLOCK** | Unfilled brackets in Step 3 and partner sections: `[Financing Partner Name]` × 2, `[Partner Name]`, `[a quick online application / a streamlined process through your designer]`, `[minutes / 24 hours]` | Brief specifies HFS Financial / Viking Capital / Lyon Financial — fill each partner name. Resolve the application-process placeholder per brief language or AWAITING CONTENT. |
| 2 | **BLOCK** | Em-dash in lede "doesn't have to wait — Blue Tree partners with..." | Sitewide S5. |
| 3 | **BLOCK** | Swiss-Post FAQ placeholder | Sitewide S2. |
| 4 | **BLOCK** | "Blue Tree Landscaping" in body copy | Replace with "Blue Tree". |
| 5 | FLAG | Footer 4-county list | Sitewide S1. |
| 6 | NIT | CTA "Start Your Transformation" — acceptable per brief; do not change | No fix. |

**ClickUp task:** [Financing Page Template](https://app.clickup.com/t/86afpmx4x)

---

### P15. Privacy Policy — `/privacy-policy/`

| # | Severity | Item | What to do |
|---|---|---|---|
| 1 | **BLOCK** | **H1 reads "Blue Tree Landscaping Privacy Policy: Your Rights and Our Practices"** — legal entity in H1 violates v1.1 §1.1 | Change H1 to: **"Privacy Policy"** or **"Blue Tree Outdoor Living Privacy Policy"**. Legal entity "Blue Tree Landscaping" only in JSON-LD / footer. |
| 2 | **BLOCK** | "Blue Tree Landscaping" appears 11 times in body copy | Replace with "Blue Tree" or "Blue Tree Outdoor Living" except where strictly required for legal disclosure. |
| 3 | **BLOCK** | Phone above fold | Sitewide S3. |
| 4 | PASS | Address "4494 Skippack Pike, Schwenksville, PA 19473" — **canonical confirmed by Jason 2026-05-13.** This is the only address for the new website. | No fix. Use exactly this form everywhere address appears. |
| 5 | FLAG | "Healthy Lawn" appears once — verify intent vs "Healthy Yards" pillar name | Replace with "Healthy Yards" if pillar reference; otherwise leave if it's a generic descriptive phrase. |
| 6 | FLAG | No "Last Updated" date displayed | Add Last Updated date. |
| 7 | FLAG | Counsel review confirmation pending | Awaiting Jason to confirm with Blue Tree's counsel. |
| 8 | FLAG | Split this task from Terms of Service (task 86ah0d9p5) — Privacy is deployed, Terms is 404 | See ClickUp comment on task 86ah0d9p5. |

**ClickUp task:** [Privacy Policy and Terms and Conditions](https://app.clickup.com/t/86ah0d9p5)

---

### P16. Editorial Standards — `/about/editorial-standards/` (also at `/editorial-standards/`)

| # | Severity | Item | What to do |
|---|---|---|---|
| 1 | **BLOCK** | **No named authors / review chain visible** — page describes editorial process generically but doesn't name Jeff Mattiola, Jérôme Besnard, Chad Ochnich, Mark Peasley as authors / reviewers | AWAITING CONTENT — Jason will send named-author block + review chain per overlay. Fix the page template to support named-author display. |
| 2 | FLAG | URL exists at both `/about/editorial-standards/` and `/editorial-standards/` | Dedupe to one canonical URL (sitemap target is `/about/editorial-standards/`). 301 redirect the other. See ClickUp comment on task 86afx9qhw. |
| 3 | FLAG | "Last Updated: [Month Year]" placeholder | Bind to real date. |
| 4 | NIT | Move ClickUp task status from "in progress" to deployed/in-QA | See ClickUp comment on task 86afx9qhw. |

**ClickUp task:** [Editorial Standards Page Template Design](https://app.clickup.com/t/86afx9qhw)

---

### P17. Care Instructions — slug delta `/care/` → `/service-hub/instructions/`

| # | Severity | Item | What to do |
|---|---|---|---|
| 1 | **BLOCK** | **No YMYL disclaimer on chemical-application content** — page covers chlorine/shock-dosing/water chemistry without safety warning | Add YMYL disclaimer block above chemical-application sections: "Pool chemistry and chemical-application content has been reviewed by [Reviewer Name, qualification]. Always read product labels and consult a certified pool professional before applying chemicals. Blue Tree is not responsible for outcomes from DIY application." (Final disclaimer language to come from Jason + editorial overlay.) |
| 2 | **BLOCK** | "Healthy Yard" singular in nav + section heading | Replace with "Healthy Yards" plural. |
| 3 | **BLOCK** | Phone above fold `610.569.9810` | Sitewide S3 + S4. |
| 4 | **BLOCK** | Em-dash in intro | Sitewide S5. |
| 5 | **BLOCK** | "[Last Updated: [Month Year]]" placeholder | Bind to real date. |
| 6 | FLAG | Slug align to `/service-hub/instructions/` with 301 redirect from `/care/` | See ClickUp comment on task 86afx9p1m. |
| 7 | NIT | CTA "Start Your Transformation" — acceptable | No fix. |

**ClickUp task:** [Care Instructions Page Template Design](https://app.clickup.com/t/86afx9p1m)

---

## SECTION 3 — Build-gap discussion (pending Jason ruling)

These items are pages in the brief.md 21-page scope that are NOT deployed:

| Page | URL | Status | Action |
|---|---|---|---|
| Portfolio — Completed Projects | `/portfolio/completed-projects/` | 404 | Awaiting Jason ruling — Phase 0 or Phase 1? Raja's 2026-04-13 plan defers to Phase 1. |
| Service Hub | `/service-hub/` | 404 | Awaiting Jason ruling — Phase 0 or Phase 1? Raja's plan defers to Phase 1. |
| Service Hub — Warranties | `/service-hub/warranties/` | 404 | No canonical creative brief exists; Jason ruling needed. |
| Terms of Service | `/terms-of-service/` | 404 | Build pending; possibly blocked on counsel-supplied text. |

## SECTION 4 — Audits deferred this cycle

- **Figma node fidelity** — **PARTIALLY COMPLETE 2026-05-13.** Figma MCP reconnected via `figma-developer-mcp` server. Audit completed for Home (1309:4647), About Us (1309:8902), Our Story (1309:7168). Our Process (1309:9238) Figma fetch was deferred — Starter plan API rate limit hit mid-audit; deployed-side findings populated, Figma comparison pending (~4.6 day retry window). Findings rolled up here (S9-S14, P1 items 8-11, P6 items 6-13, P7 items 8-16, P10 items 8-14). Full audit table in `deliverables/figma-audit.md`. Visual-fidelity dimensions (type render / color sample / image crop) still need a screenshot pass — recommend WAVE / browser DevTools spot check during S11 font consolidation and S9 logo strip work.
- **Brand kit hex / font validation** — requires DevTools inspection; recommend 3-page spot check pre-launch (`/`, `/about/our-story/`, `/contact/`).
- **Schema validation** — requires JSON-LD inspection; recommend Schema.org validator + Google Rich Results Test pre-launch.
- **Accessibility (WCAG AA)** — recommend WAVE / axe-core sweep pre-launch. Note S14 (logo strip alt attributes) is one accessibility gap already documented; assume more will surface during full sweep.
- **Internal link integrity** — recommend Screaming Frog or similar link checker.

## How to confirm a fix is done

When each BLOCK is resolved, leave a ClickUp comment on the relevant task with:
1. ✅ marker
2. Screenshot of the fixed state on `bluetree.tempurl.host`
3. One-line summary

Once a page has zero BLOCKs outstanding, move the ClickUp task to "Ready for QA" / "In QA" / equivalent. Jason will sweep all moved-to-QA pages before 2026-05-22 internal QA close.

## Targets

| Date | Milestone |
|---|---|
| 2026-05-14 to 2026-05-19 | Raja sprint — sitewide S1–S8 first, then per-page P1–P17 in priority order |
| 2026-05-20 | Content drops from Jason land (team bios, reviews, jobs, financing partner text, FAQ copy, editorial standards author block) |
| 2026-05-21 EOD | All BLOCK items resolved, all "AWAITING CONTENT" slots filled |
| 2026-05-22 | Internal QA close — Jason sweeps all 17 pages, signs off |
| 2026-05-25 | Phase 0 production launch |
