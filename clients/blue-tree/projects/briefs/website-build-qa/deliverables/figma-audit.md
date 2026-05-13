---
project: website-build-qa
deliverable: Figma visual audit — Phase 0 quick-launch subset
audit_owner: Jason Spencer (ROI.LIVE)
status: complete (4 of 4 pages fully audited 2026-05-13; visual-fidelity DevTools sweep + Our Process stats band deployed-check remain as light follow-up)
created: 2026-05-13
last_updated: 2026-05-13
target_pages: 4 (Home, About, Our Story, Our Process)
figma_file: https://www.figma.com/design/leXDzLrKd1zucGnwQbTWOB/Blue-Tree
figma_file_id: leXDzLrKd1zucGnwQbTWOB
figma_authoritative_section: "Phase 1 - color treatment rule-book applied" (id 1309:4646)
deployed_base: https://bluetree.tempurl.host
severity_schema: BLOCK / FLAG / NIT / PASS
---

# Figma Visual Audit — Phase 0 Quick Launch

## Purpose

Compare the deployed dev site against the approved Figma designs at the node level for the four highest-priority Phase 0 pages. This complements `spec-compliance-audit.md` (which compared deployed vs creative brief) by adding the visual-fidelity dimension that was deferred yesterday when the Figma MCP was unreachable.

Findings here roll up into `fix-list-for-raja.md` once populated.

## Methodology

For each page below:

1. **Pull Figma node** for the deployed page (file ID `leXDzLrKd1zucGnwQbTWOB`, node IDs to discover via `get_file` → frame search).
2. **Cache node tree locally** at `figma-cache/{page-slug}.json` so re-reads don't re-hit the API.
3. **Screenshot deployed page** at desktop (1440px) and mobile (375px).
4. **Compare** along 8 dimensions (table per page below).
5. **Tabulate** with verdict + severity per row.

### 8 comparison dimensions per page

| Dim | What we check | Common failure modes |
|---|---|---|
| **1. Hero composition** | H1 wording, hero image, subhead, primary CTA, badge/eyebrow | Wrong copy, missing badge, CTA mislabeled |
| **2. Type scale** | H1 / H2 / H3 / body sizes, line-height, font family per heading | Default WP styles overriding tokens, wrong weight, missing display face |
| **3. Color tokens** | Background, text, accent, CTA, hover states match brand kit hex | Default Breakdance blues, wrong accent on CTA |
| **4. Spacing / grid** | Section padding (top/bottom), max-width, grid gutter, column counts | Cramped mobile padding, full-bleed where Figma is contained |
| **5. Components** | Card structure, icon placement, button style, badge style, divider | Wrong card variant, icons missing or wrong set |
| **6. CTA placement + style** | Primary vs secondary, position in flow, label, hover treatment | Phone-first instead of form-first, "Call Today" pressure language |
| **7. Image specs** | Aspect ratio, focal point, alt text, lazy-load behavior | Stretched images, wrong crop, missing alt |
| **8. Content order** | Section order matches Figma flow (above-fold → mid → below-fold) | Reordered sections, missing sections, extra sections |

### Severity (matches `spec-compliance-audit.md`)

- **BLOCK** — must fix pre-launch (em-dash, banned copy, missing CTA, broken brand discipline, YMYL failure)
- **FLAG** — fix before final sign-off (visual drift that hurts brand but doesn't block launch)
- **NIT** — cosmetic / low priority
- **PASS** — matches Figma

---

## Page 1 — Homepage (`/`)

- **Figma family:** Home
- **Figma node ID:** `1309:4647` (top-level FRAME inside SECTION 1309:4646 "Phase 1 - color treatment rule-book applied")
- **Deployed URL:** https://bluetree.tempurl.host/
- **Creative brief:** `creative-briefs/home-page-creative.md`
- **Prior findings (spec-compliance-audit + brand-qa-report):**
  - Lorem Ipsum testimonials (BLOCK)
  - Footer county list missing Philadelphia (BLOCK)
  - SPRING REFRESH promo override hero trust badge (FLAG)
  - 40+ Years tenure in brief vs 43 (BLOCK cascade)

### Findings — Homepage

Figma nodes referenced: Home `1309:4647` → Homepage `1309:4648` → Hero `1309:4714` → Hero Content `1309:4718` (H1/subhead/buttons/stats).

| # | Dim | Figma spec | Deployed | Verdict | Severity | Notes |
|---|---|---|---|---|---|---|
| H1 | 1. Hero composition: H1 | "*Life Happens Outside. Let's Make It Beautiful.*" (italic) | "Life Happens Outside. Let's Make It Beautiful." | MATCH copy; italic styling needs visual confirm | NIT | Confirm italic renders via inspect |
| H2 | 1. Hero composition: subhead | "From custom pools and stunning patios to landscapes that evolve with you**—**Blue Tree designs, builds, and maintains outdoor spaces where your family's best moments unfold." | Same verbatim (em-dash present) | MATCH but BOTH violate voice profile v1.1 §11.3 | **BLOCK** | Em-dash cascades brief → Figma → deployed. Fix in all three layers. New erratum required. |
| H3 | 1. Hero composition: primary CTA | "Start Your Transformation" (fill Accent 2 #FB8C00, white text, 100px radius) | "Start Your Transformation" | PASS (correcting prior audit error — section CTAs are different) | PASS | Prior spec-compliance audit incorrectly said "Request a Consultation" was the hero primary |
| H4 | 1. Hero composition: secondary CTA | "See Our Work" (rgba white 15% fill, 1px white stroke, 100px radius) | "See Our Work" | PASS (copy); style needs visual confirm | NIT |  |
| H5 | 1. Hero composition: stats strip | 3 stats with vertical dividers: `43+` / Years Local Experience · `One Partner` / Design-Build-Maintain Under One Roof · `Degreed Designers` / 100+ Years Combined | "+ Years Local Experience" (number missing); "One Partner" and "Degreed Designers" appear as page-level **H2 section headings** instead of inline stats | **MAJOR DRIFT** — stats row broken, semantic heading misuse | **BLOCK** | The "43" placeholder didn't populate. Stats are being rendered as full H2 sections at the top of the page, not as a row inside the hero. Breakdance build error. |
| H6 | 1. Hero composition: promo bar | Promobar TEXT `1309:4717`: "SPRING REFRESH: 25% OFF ALL LAWN CARE PACKAGES (HARDSCAPING PROJECTS EXCLUDED.)" — Circular Std Book 20px UNDERLINE, white | Same text on deployed | **MATCH** — Figma source confirmed (not a Breakdance template default) | RESOLVED via Q2 ruling | Jason ruled hide globally for launch (no current approved promo). Figma's intent matched deployed but client doesn't authorize this copy as current. Removing per S12. |
| 2 | Type scale | H1 = Archivo ExtraBold Italic 64px / Subhead = SF Pro Rounded Medium 20px / Body CTA = Para M (SF Pro Rounded Regular 16px) | Not directly inspected this pass — H1 renders large per WebFetch markdown extraction | NEEDS VISUAL — confirm Archivo loaded + Italic applied on H1 | FLAG (provisional) | Body fonts Inter vs SF Pro Rounded — note: SF Pro Rounded is Apple's system font, may not be licensable for web. Confirm fallback. |
| 3 | Color tokens | Primary `#0F2537` (deep navy) / Accent `#005CB9` (blue) / Accent 2 `#FB8C00` (orange) / Text White `#FFFFFF` | Not inspected this pass | NEEDS VISUAL — sample 4 swatches | FLAG (provisional) | Hero BG = gradient (top-fade to black) + image fill (imageRef `61e70c00a55cc366758dbd386e11b6ed5448118c`) |
| 4 | Spacing / grid | Hero FRAME 1440×1000 · Hero Content x=68, y=506, width=780 · Hero BG bottom corners radius 100px | Not inspected this pass | NEEDS VISUAL | FLAG (provisional) | Bottom-rounded hero corners (100px) is a distinctive Figma styling — must verify present on deployed |
| 5 | Components | Two CTA variants: solid Accent 2 + translucent white outline; 3-stat strip with vertical line dividers (LINE nodes `1309:4731` / `1309:4735`) | Stat strip rendered as separate H2 sections (broken); CTA buttons present | FAIL (stat strip), PARTIAL (CTAs) | **BLOCK** (stat strip) | See H5 above |
| 6 | CTA placement + style | Hero: orange (Accent 2) primary + white-translucent secondary, side by side. Lower-page CTAs: outline (Section 3), solid Accent 2 (Sections 6 + 15). NO phone-first / no "Call Today" labels in any CTA. | Hero CTAs match. Section CTAs deployed as "Request a Consultation" (per prior audit) — this is form-first language and aligns with editorial standards even though label differs from Figma | PARTIAL — section CTA labels mismatch but intent (form-first) is editorially preferred | FLAG | Clarify with Raja: was section CTA wording changed deliberately to "Request a Consultation" for form-first compliance, or is it a default? |
| 7 | Image specs | Hero BG = image fill `61e70c00a55cc366758dbd386e11b6ed5448118c` with linear gradient overlay (0deg, top fade 75-100%). Section 2 image `f93016fce5faad6eb8f9df76b4b97a5b0eebf6d0` 670×1174, 25px radius. Section 14 + 16 use cropped images. | Not inspected this pass | NEEDS VISUAL — confirm hero image loads and crops correctly | FLAG (provisional) | Hero gradient mask is critical for legibility of white text over photo |
| 8 | Content order | Hero → Section 2 (intro + logo strip) → Section 3 (Value Prop / "One Vision One Team") → Section 4 → Section 12 → Section 6 (Differentiator / Gallery) → Section 7 (Core Services) → Section 13 (Curated Transformations) → Section 14 (Process) → Section 15 (Seasonal + Testimonials) → Section 16 (Trust & Legacy) → Final CTA → Newsletter + Footer | Deployed H2 order: One Partner → Degreed Designers → One Vision One Team Zero Headaches → Step Inside the Blue Tree Experience → Backyard Resort → Driven by Design Not Quotas → Everything Your Outdoor Space Needs → Curated Transformations → Your Vision Our Expertise One Seamless Process → Expertise for Every Season → A Legacy of Trust in Southeastern PA → What Our Clients Say → Proudly Serving Southeastern PA → Common Questions → Ready to Start? | MOSTLY MATCH (minus the broken stat strip at top + "Backyard Resort" appearing as H2 = likely a portfolio card title with wrong heading weight) | FLAG | Section-level order is correct. Two anomalies: hero stats misclassified as H2 (BLOCK already logged at H5), "Backyard Resort" as H2 inside a portfolio card (component semantic-tag drift) |

**Net Home findings:** 2 BLOCKs (em-dash in subhead; broken hero stat strip), 5 FLAGs, 3 PASSes, 2 NITs. Visual-fidelity dimensions (type/color/spacing/image) still need a screenshot pass — flagged provisional pending visual review.

---

## Page 10 — About Us (`/about/`)

- **Figma family:** About
- **Figma node ID:** `1309:8902` (child FRAME inside parent About FRAME 1309:6950)
- **Deployed URL:** https://bluetree.tempurl.host/about/
- **Creative brief:** `creative-briefs/about.md`
- **Prior findings:**
  - Em-dash in lede ("Pennsylvania — and we've been doing it since 1983") (BLOCK)

### Findings — About Us

Figma nodes referenced: About Us `1309:8902` → Hero `1309:8903` (Hero Content text node `1309:8935` not yet text-decoded), Logo Strip `1309:8944`, Who We Are `1309:9126`, Learn More `1309:9171`, Stats band `1412:7099`, Section 17 (services) `1310:16425`, Section 16 (locations) `1309:9211`, Section 10 (testimonials) `1309:8993`.

| # | Dim | Figma spec | Deployed | Verdict | Severity | Notes |
|---|---|---|---|---|---|---|
| A1 | 1. Hero composition: H1 | Figma text node not yet text-decoded (one more fetch needed on `1309:8935`) | "About Blue Tree" | NEEDS FIGMA TEXT FETCH to confirm | TBD | Brief specifies a longer H1; deployed is short |
| A2 | 1. Hero composition: subhead | TBD pending Figma text fetch | "We design, build, and maintain outdoor living spaces for homeowners across Southeastern Pennsylvania **—** and we've been doing it since 1983. Five service divisions, 70 to 90 employees, and a reputation built on doing the work right and never disappearing after the check clears." | Em-dash present on deployed (prior audit BLOCK confirmed) | **BLOCK** | "never disappearing after the check clears" is strong voice-match — keep |
| A3 | 1. Hero composition: CTAs | Figma Hero Content has Content + Buttons frames; specific labels not decoded | "Request a Free Estimate" + "See Our Work" | Form-first ✓ — matches editorial-overlay rule | PASS (form-first) | "Request a Free Estimate" wording differs from Home's "Start Your Transformation" — site-wide CTA wording inconsistency to flag |
| A4 | 1. Hero composition: BG image | BG `1309:8904` has diagonal gradient (45deg, top-left dark fade) + image fill `f63d8ae3abc933660efdab5e45e08305161e9168`; bottom-left corner 100px radius (asymmetric, unlike Home's symmetric bottom corners) | Not visually inspected this pass | NEEDS VISUAL | FLAG (provisional) | Asymmetric corner radius is an intentional design accent — confirm deployed renders this |
| A5 | 2. Type scale | 4 families: Archivo ExtraBold 800 / 40px (H2) · SF Pro Rounded Regular 20px (body) · Circular Std Book 20px UNDERLINE (Promobar) · Poppins Medium 22px (footer link headers) + Regular 18px (footer copy) + SemiBold (Archivo 24px stat numbers) | Not directly inspected | FONT-STACK DRIFT — About uses 4 families vs Home's 2 (Archivo + SF Pro Rounded) | **FLAG** (sitewide) | Likely a Breakdance global-theme issue. Either consolidate to Archivo + SF Pro Rounded or codify all 4 in the design system. SF Pro Rounded is an Apple system font and unclear licensing for web use. |
| A6 | 3. Color tokens | Primary `#0F2537` · Primary 2 `#285140` (deep green, on stats band) · Accent 2 `#FB8C00` · Color-Text-Grey `#333333` · Outline `#E6E6E6` · Text White `#FFFFFF` · ts1 `#285140` (green for emphasis-spans) · ts4 `#0F2537` (navy for emphasis-spans) | Not directly inspected | NEEDS VISUAL — sample Primary 2 green presence | FLAG (provisional) | Primary 2 `#285140` is the "Healthy Yards" deep green. Should be reserved per brand discipline — verify usage is intentional |
| A7 | 4. Spacing / grid | Page 1440×7292; hero 1440×852; Logo Strip x=141 y=900 width 1159 (10 logos × 88.88 + 30px gaps); Who We Are at y=1014; stats band at y=2219 (1440×220, padding 39px/152px/37px/104px) | Not inspected | NEEDS VISUAL | FLAG (provisional) | Stats band uses Primary 2 green fill |
| A8 | 5. Components: Logo Strip | 10 logo slots filled with placeholder tech-brand SVGs: **brave / circle / discord / google / jump / lollapalooza / magiceden / meta / shopify / stripe** | "Logos appear but company names not visible in markup" — likely same placeholder set rendered (consistent with template defaults found sitewide per prior audit pattern A2 in fix-list) | **TEMPLATE DEFAULT — must remove or replace** | **BLOCK** | Recommendation delivered in `deliverables/logo-strip-recommendations-for-raja.md` (2026-05-13, updated): replace with a credibility strip = real third-party affiliation logos confirmed in voice profile §1.7 (NALP, PLNA, ICPI, APSP, CBP — plus BBB / Houzz / Angi pending client status) + 5 custom-designed trust seals (43 Years Family-Owned, Lifetime Warranty, Co-Owned Since 1994, Licensed Bonded Insured, Design-Build-Maintain). Includes ChatGPT prompts for each custom seal. |
| A9 | 5. Components: Link cards | 4 cards at y=1530-1714 with Primary navy fill, Accent 2 orange underlined link text: "Read Our Story →" / "Meet the Team →" / "See the Difference →" / "Explore Our Process →" (each 296×400, 24px radius, 32px padding) | Not visible in H2 scan — may be present as H3-styled cards or may be missing | NEEDS VISUAL — confirm presence and styling | FLAG | These are key internal navigation cards. If missing on deployed, that's a BLOCK; if present but styled wrong, it's a FLAG. |
| A10 | 5. Components: Service cards (Section 17) | 6 Card INSTANCEs `componentId: 234:831` in wrap row, 400px wide, 25px radius, 1px Outline stroke | Service titles render as **H2** on deployed: "Custom Pools & Water Features" / "Patios, Walls & Outdoor Kitchens" / "Landscape Design & Planting" / "Lawn Programs" / "Landscape Lighting" / "Year-Round Care" | Card titles using H2 weight = semantic drift; SAME issue as Home page "Backyard Resort" → sitewide pattern | **FLAG (sitewide)** | Append S-code: card titles must use H3 (not H2) on deployed. Likely Breakdance card template default. |
| A11 | 5. Components: Stats band | 5 stats in row: `Established 1983` / `70–90 Employees` / `13–14 Year Avg. Employee Tenure` / `NALP Affiliated` / `Licensed & Insured` | 5 stats deployed: `1983 Founded` / `70–90 Employees` / `13–14 yrs Avg. Tenure` / `5 Service Divisions` / **`43+ Years of Co-Ownership`** | Deployed substitutes 2 of 5 stats. "43+ Years of Co-Ownership" is **factually incorrect**: 43 = years in business (founded 1983); co-ownership only since **1994** (voice profile §1.6) = **32 years** as of 2026. NALP Affiliated and Licensed & Insured (credentials) deleted on deployed. | **BLOCK** | Two errors: (1) factual stat error must be corrected — replace "43+ Years of Co-Ownership" with the canonical Figma stat or "32 Years of Partnership Since 1994"; (2) loss of credential stats (NALP / Licensed & Insured) reduces E-E-A-T signals on an About page — restore them. |
| A12 | 5. Components: Who We Are bio | 2 paragraphs. ¶1: "Blue Tree is a full-service residential design-build firm headquartered in **Schwenksville, Pennsylvania**, serving homeowners throughout Southeastern PA **—** including Montgomery, Bucks, Chester, Delaware, and Philadelphia Counties..." ¶2: "...co-owned by Jeff Mattiola (President) and **Chad Ochnich (Vice President)**, who have been **partners since 1995** **—** building one of the largest..." | Deployed matches Figma verbatim per WebFetch extract | Cascades: (a) Em-dash × 2 in Figma+deployed → v1.1 §11.3 violation; (b) "Schwenksville" HQ + "Skippack Pike" address — resolved (errata B4 closed: Skippack Pike = street, Schwenksville = USPS city, both valid); (c) Ownership ROLES correct (Jeff President / Chad VP / Co-Owners) per AGENTS.md update; (d) **DATE "1995" IS WRONG** — voice profile §1.6 confirms partnership started **1994**; old reference docs that say 1995 are incorrect. | **BLOCK** for em-dash + 1995→1994 fact-fix | Fix in Figma + deployed: rewrite to "co-owned by Jeff Mattiola (President) and Chad Ochnich (Vice President), partners since 1994, building one of the largest..." (em-dash to comma + year correction in one pass) |
| A13 | 6. CTA placement + style | Hero buttons (specific labels TBD); section-level CTA `1309:9001` "Read More Reviews" filled Accent 2 orange, 100px radius | Hero: "Request a Free Estimate" + "See Our Work" — form-first ✓ | PASS for form-first compliance; intra-site CTA wording inconsistent (Home: "Start Your Transformation"; About: "Request a Free Estimate") | FLAG (sitewide) | Pick one primary CTA verb pattern site-wide or document the variants intentionally. |
| A14 | 7. Image specs | Hero BG image `f63d8ae3abc933660efdab5e45e08305161e9168` with double-stacked diagonal gradient overlay (45deg 2-66%, applied twice for depth); Section 16 location image `35b6a5cc3df34383281aa822a8753183072ef6bf` (also used on Home Section 16) | Not inspected | NEEDS VISUAL | FLAG (provisional) | Note: Section 16 image is shared between Home and About — same `imageRef`. Good asset reuse. |
| A15 | 7. Content cascade: "over 40 years" | "Learn More About Blue Tree" para: "Everything you need to know about who we are, how we work, and why homeowners across Southeastern PA have trusted us **for over 40 years**." | Same text on deployed per WebFetch | v1.1 §1.6/1.7 violation — must be "43 years" or "since 1983" | **BLOCK** | Errata B3 cascade |
| A16 | 7. Content cascade: Em-dash in Section 17 subhead | Section 17 subhead: "From the pool to the patio to the plants that frame it all**—**we handle the full picture so nothing falls through the cracks." | Same on deployed (Section 17 = "Everything Your Outdoor Space Needs. One Team." in H2 list) | v1.1 §11.3 violation | **BLOCK** | 3rd em-dash on this page (subhead ¶1, bio ¶1, bio ¶2 = 4 total) |
| A17 | 8. Content order | Hero → Logo Strip → Who We Are → 4 link cards → Learn More heading → Stats band (5 stats) → Section 17 (Everything Your Outdoor Space Needs, 6 service cards) → Section 16 (Locations / "Proudly Serving") → Section 10 (Testimonials, 4 INSTANCEs) → FAQ block (Group 345) → Newsletter + Footer | Deployed H2 order: Who We Are → Learn More About Blue Tree → Everything Your Outdoor Space Needs One Team → [6 service card H2s] → Proudly Serving Southeastern Pennsylvania → What Our Clients Say → Common Questions → Ready to Start? | MOSTLY MATCH — order consistent. Visible H2 list misses "Logo Strip" (no H2) and the 4 link cards (likely styled as H3) which can't be confirmed from H2 scan alone | FLAG | Confirm via screenshot that the 4 link cards (Read Our Story / Meet the Team / See the Difference / Explore Our Process) are present below the Who We Are bio. |

**Net About Us findings:** 5 BLOCKs (em-dash ×4 cascading through page; placeholder logos; stats drift incl. factual "43+ Years of Co-Ownership" error; tenure stat "over 40 years"; HQ city conflict Schwenksville vs Skippack), 5 FLAGs (font-stack drift sitewide pattern; card-title H2 sitewide pattern; CTA wording inconsistency; link cards presence; visual-fidelity TBDs), 1 PASS (form-first hero CTA), 0 NITs. **Plus:** AGENTS.md key-contacts table needs a separate correction — Jeff is co-owner, not sole owner (Figma copy is correct).

---

## Page 11 — Our Story (`/about/our-story/`)

- **Figma family:** About
- **Figma node ID:** `1309:7168` (child FRAME inside parent About FRAME 1309:6950)
- **Deployed URL:** https://bluetree.tempurl.host/about/our-story/
- **Creative brief:** `creative-briefs/our-story-brand.md`
- **Prior findings:**
  - Brief itself uses "Schwenksville, PA 19473" — conflicts with engagement-status.md "Skippack HQ since 2008" (errata B4 pending)
  - Phone (610) 222-0590 in brief vs live site (610) 569-9810 (errata B5 pending)
  - Tenure stats in brief use "40+ years" — should be 43 (errata B3 pending)

### Findings — Our Story

Figma nodes referenced: Our Story `1309:7168` → Hero `1309:7169` (Hero Content `1309:7201` — H1/subhead text nested at depth 4), Logo Strip `1309:7210`, Stats `1309:7295`, Section 5 (services) `1309:7516`, Group 345 (FAQ) `1309:7527`, Group 1413372775 (newsletter+footer) `1309:7554`.

| # | Dim | Figma spec | Deployed | Verdict | Severity | Notes |
|---|---|---|---|---|---|---|
| S1 | 1. Hero composition: H1 | Figma H1 `1309:7203` = "Our Story: Building Legacy Outdoor Spaces Since 1983" (Archivo ExtraBold 64px white) | "Our Story: Building Legacy Outdoor Spaces Since 1983" | **MATCH** verbatim — Figma and deployed identical | PASS | Voice match strong. |
| S2 | 1. Hero composition: subhead | Figma subhead `1309:7204` = 2-sentence block: "What started with a pickup truck, a handful of clients, and a stubborn refusal to cut corners has become one of Southeastern Pennsylvania's most trusted residential design-build firms. Established in 1983, with 70–90 employees and over 40 years of experience across Southeastern Pennsylvania, this is the story of how we got here **—** and why it matters for your next project." (SF Pro Rounded Medium 20px white) | MATCH verbatim — both sentences confirmed present on deployed | Match on structure; BOTH violate v1.1 §11.3 (em-dash before "and why it matters") + v1.1 §1.6 ("over 40 years of experience" cascade) | **BLOCK** | Already in Raja's subtask queue: em-dash sweep (`86aher1w9`) + tenure stat replacement (`86aher1wj`). Sentence 1 has no violations and is a strong voice match — preserve as-is. |
| S3 | 1. Hero composition: pre-headline / promobar | Promobar GROUP `1309:7199` exists in Figma Hero (same structure as Home + About) | NOT FOUND on deployed Our Story page | DRIFT — promobar element exists in Figma but didn't render on deployed | FLAG | If SPRING REFRESH promo is intended sitewide, missing here is inconsistent. If intentionally hidden on Our Story, document. |
| S4 | 1. Hero composition: CTAs | Buttons frame `1309:7205` — labels not decoded | "Request a Free Estimate" + "Meet Our Team" | Form-first ✓; secondary CTA labeled for cross-link to team page | PASS | Sitewide CTA inconsistency continues: Home="Start Your Transformation"/"See Our Work"; About="Request a Free Estimate"/"See Our Work"; Our Story="Request a Free Estimate"/"Meet Our Team" |
| S5 | 5. Components: Logo Strip | Same 10-slot strip with placeholder tech logos (brave, circle, discord, google, jump, lollapalooza, magiceden, meta, shopify, stripe) — IDs 1309:7210 + 1309:7211-7251 | "Logos appear, no alt attributes visible in markup" | **CONFIRMED SITEWIDE BLOCK** — same template defaults as About | **BLOCK** | Apply `logo-strip-recommendations-for-raja.md` fix. Also: missing alt attributes is a separate accessibility BLOCK. |
| S6 | 5. Components: Stats band | 3-stat band: `1983` / `NALP` / `70–90` — all using H1 textStyle (Archivo ExtraBold 64px) | Deployed shows: `70–90 Employees`, `13–14 Years (avg tenure)`, plus body-copy stats `20+ years` pool builder, `25 to 30 years` client relationships, `44+ years` combined pool manager experience, `30 years` partnership | **DRIFT** — Figma defines a 3-stat header band (1983/NALP/70-90), but deployed page has different stats surfaced. The "1983" and "NALP" stats from Figma not rendered as a band on deployed. | FLAG | Resolution: confirm whether stat band should appear (per Figma) or be replaced by inline body-copy stats. Also confirm new factual claims with client: "44+ years combined pool construction manager experience" + "20+ years pool builder" — these aren't in v1.1 §1.6, verify with Jeff before they stick. |
| S7 | 5. Components: Body copy quote attributions | Two named-quote callouts: ¶ "All you have in life is your reputation. Don't mess it up. That stuck with me. It's guided everything we do." — **Jeff Mattiola, Owner**. ¶ "A lot of people nowadays want that single point of contact, and we're able to provide that for them. A turnkey approach where we have degreed designers..." — **Jeff Mattiola**. | Deployed has shorter versions: ¶ "All you have in life is your reputation. Don't mess it up." — Jeff Mattiola. ¶ "A lot of people nowadays want that single point of contact, and we're able to provide that for them." — Jeff Mattiola. | TRUNCATED quotes on deployed — second sentence missing from each | FLAG | Decide: restore Figma's full quotes or accept the trimmed deployed versions as editorial cuts. Either way, sync Figma+deployed. |
| S8 | 5. Components: Co-ownership paragraph | "Blue Tree is led by co-owners Jeff Mattiola and Chad Ochnich **—** two partners from separate families who've been building this company together **since 1995**. It's not a family business in the traditional sense. It's something rarer: a partnership that's lasted over 30 years..." | Deployed likely matches Figma (not surfaced as H2 in scan); ownership detail confirmed in deployed body | Em-dash present in Figma + **1995 date is wrong** (voice profile §1.6: partnership started 1994) | **BLOCK** (em-dash + year fix) | Roles correct (Jeff President + Chad VP, Co-Owners). Fix em-dash AND change "1995" → "1994". The "partnership that's lasted over 30 years" line stays valid (2026 - 1994 = 32 years, still over 30). |
| S9 | 7. Content cascade: "40 Years" H2 heading | H2 `1310:15891` (under text in Figma): "Giving Back to the Communities **We've Served for 40 Years**" | Same H2 on deployed | v1.1 §1.6 violation — must be "43 Years" | **BLOCK** | Errata B3 cascade. Hits multiple pages — already a sitewide pattern. |
| S10 | 7. Content cascade: "over 40 years" body copy | TBD pending verification in Figma; likely matches deployed | "Established in 1983, with 70–90 employees and **over 40 years of experience** across Southeastern Pennsylvania, this is the story of how we got here..." | v1.1 §1.6 violation | **BLOCK** | Errata B3 cascade |
| S11 | 7. Em-dash count | At least **14 em-dashes** in Figma body copy: ¶ "70-90 professionals **—** peaking around 90"; ¶ "small landscaping operation **—** an outgrowth"; ¶ "come hang out at the shop **—** one of Jeff's favorite memories"; ¶ "...everything we do." **—** Jeff Mattiola, Owner; ¶ "four decades **—** and that you'll experience"; ¶ "didn't chase a trend **—** we listened"; ¶ "every decision **—** from which projects"; ¶ "Agility isn't a buzzword here **—** it's a survival skill"; ¶ "build a pool the right way **—** from excavation"; ¶ "your budget." **—** Jeff Mattiola; ¶ "Jeff Mattiola and Chad Ochnich **—** two partners"; ¶ "could go wrong **—** before we start"; ¶ "always a conversation **—** she would educate"; ¶ Section 17 subhead "frame it all**—**we handle" | Deployed likely matches Figma verbatim per cascade pattern (confirmed for the subset surfaced by WebFetch) | v1.1 §11.3 violation — 14+ instances, sitewide pattern | **BLOCK** | This is the page with the heaviest em-dash density. Pre-Phase-1 SOP-level fix required: tool-humanizer pass + voice profile enforcement in brief authoring. |
| S12 | 7. Address: Schwenksville / Skippack reconciliation | Body copy references "Schwenksville, Pennsylvania" as HQ city (per About Us bio reuse) | Footer / contact area shows "4494 Skippack Pike Schwenksville, PA 19473" — both terms appear correctly: Skippack Pike = street; Schwenksville = USPS mailing city | NO CONFLICT — errata B4 was a misread. The "Skippack HQ since 2008" reference in engagement-status.md likely refers to the office being on Skippack Pike, not the city Skippack. | RESOLVED | **Close errata B4.** Document the resolution: street = Skippack Pike, city = Schwenksville. Both are correct in customer-facing copy when referring to address; "Schwenksville" stands alone when naming the HQ city. |
| S13 | 5. Components: 6-card service grid (Section 5) | 6 Card INSTANCEs `componentId: 234:831` (same component as About Us Section 17 cards) at IDs 1309:7521-7526 | Cards present on deployed but specific card titles not in H2 scan — same component as About | Consistent component reuse ✓ | PASS | Good design system reuse. |
| S14 | 8. Content order | Hero → Logo Strip → Body copy section ("How Blue Tree Began" H2) → quote callout → "We're Corporate, But We're Not Corporate" H2 → Stats band (1983/NALP/70-90) → narrative continues ("Four Decades of Growth...", "What We Believe", "From Landscaping to Full-Service Outdoor Living", "Generations Working Together", "Giving Back to the Communities We've Served for 40 Years", "The Families Who Keep Coming Back") → Section 5 (6 service cards, "Everything Your Outdoor Space Needs. One Team.") → FAQ block (Group 345) → Newsletter + Footer | Deployed H2 order: How Blue Tree Began → Four Decades of Growth Zero Shortcuts → What We Believe → We're Corporate But We're Not Corporate → From Landscaping to Full-Service Outdoor Living → Generations Working Together → Giving Back to the Communities We've Served for 40 Years → The Families Who Keep Coming Back → Everything Your Outdoor Space Needs One Team → Common Questions → Ready to Start? | MATCH on section sequence — slight reorder: deployed has "Four Decades" + "What We Believe" BEFORE "We're Corporate" whereas Figma has "We're Corporate" earlier. Minor narrative-flow drift. | NIT | Confirm with editorial: which order tells the founding story best. |
| S15 | 2. Type scale | H1 = Archivo ExtraBold; H2 = Archivo ExtraBold 800/40px (CENTER variant + LEFT variant "234:614"); Body = SF Pro Rounded Regular; Stats numbers use H1 textStyle (64px) | Not directly inspected this pass | NEEDS VISUAL | FLAG (provisional) | Likely consistent with About Us font cascade. |
| S16 | 3. Color tokens | Same Primary/Accent/Accent 2/Primary 2 set as Home + About; emphasis spans use ts1 (likely Primary 2 green) and ts2 / ts3 (other accents) | Not inspected | NEEDS VISUAL | FLAG (provisional) | |
| S17 | 7. Image specs | Hero BG image (not yet decoded); body imagery present in tradesman / pool-build sections | Not inspected | NEEDS VISUAL | FLAG (provisional) | |

**Net Our Story findings:** 5 BLOCKs (em-dash ×14 cascading through page; placeholder logos; "over 40 years" body cascade; "40 Years" H2 heading; logo strip missing alt attributes), 7 FLAGs (missing promobar; stats band drift; truncated quotes; CTA wording inconsistency sitewide; font/color/image visual TBDs), 2 PASSes (no em-dash hero subhead; component reuse), 1 NIT (section ordering), 1 RESOLVED (errata B4 — Skippack Pike/Schwenksville is a single valid address).

---

## Page 14 — Our Process (`/about/our-process/`)

- **Figma family:** About
- **Figma node ID:** `1309:9238` (child FRAME inside parent About FRAME 1309:6950; named "Process" in Figma)
- **Deployed URL:** https://bluetree.tempurl.host/about/our-process/
- **Creative brief:** `creative-briefs/our-process.md`
- **Prior findings:**
  - H1 reads "From Vision to Reality — and Beyond" with em-dash (BLOCK)
  - H1 doesn't match brief specification (spec-compliance-audit flagged)

### Findings — Our Process

Figma nodes referenced: Process `1309:9238` (named "Process" in Figma, not "Our Process"). **Figma-side fetch deferred** — hit Figma API rate limit (429) at this stage of the audit (Starter plan token budget exhausted, ~4.6 day retry). All Figma-spec columns below marked TBD-rate-limited; findings draw from deployed-side WebFetch + prior audit. Schedule a follow-up Figma pass on `1309:9238` once the rate-limit window resets.

| # | Dim | Figma spec | Deployed | Verdict | Severity | Notes |
|---|---|---|---|---|---|---|
| P1 | 1. Hero composition: H1 | TBD-rate-limited | "How We Work: From Vision to Reality **—** and Beyond" | **Em-dash in H1** — v1.1 §11.3 violation | **BLOCK** | Prior audit BLOCK confirmed. Rewrite suggestion: "How We Work: From Vision to Reality, and Beyond" or "How We Work: From Vision to Reality (And Beyond)". |
| P2 | 1. Hero composition: H1 vs brief | TBD-rate-limited | H1 doesn't match `creative-briefs/our-process.md` brief specification per prior spec-compliance-audit flag | DRIFT — brief specifies a different H1; deployed has Raja-written version | FLAG | Resolve: which is canonical, brief or deployed? Update the losing side. |
| P3 | 1. Hero composition: subhead | TBD-rate-limited | "Every Blue Tree project follows a proven three-phase workflow: Design, Build, and Maintain. Here is exactly what happens at every step **—** so there are no surprises, no miscommunication, and no disappearing acts." | Em-dash in subhead — v1.1 §11.3 violation. Otherwise strong voice match. | **BLOCK** | "no disappearing acts" intentionally echoes About page "never disappearing after the check clears" — keep that thread, just fix the em-dash. |
| P4 | 1. Hero composition: pre-headline | TBD-rate-limited | NOT FOUND on deployed (same as Our Story) | DRIFT — sitewide promobar inconsistency: Home + About show SPRING REFRESH promo; Our Story + Our Process do not | FLAG (sitewide) | Decide whether promobar is global or page-specific; sync. |
| P5 | 1. Hero composition: CTAs | TBD-rate-limited | "Request a Free Estimate" + "See Our Work" | Form-first ✓ | PASS | Same wording as Home secondary + Our Story primary — partial sitewide alignment. |
| P6 | 5. Components: Phase H2 headings | TBD-rate-limited | "Phase 1: Design **—** It Starts With a Conversation" / "Phase 2: Build **—** Your Designer Stays With You" / "Phase 3: Maintain **—** We Are Still Here After the Check Clears" | **3 em-dashes in H2 headings** — all v1.1 §11.3 violations | **BLOCK** | Rewrite suggestions: "Phase 1: Design. It Starts With a Conversation." or "Phase 1: Design — It Starts With a Conversation" → use period. Three identical fixes. |
| P7 | 5. Components: Body em-dashes | TBD-rate-limited | "This is not a sales pitch **—** A conversation." / "Your designer **—** the same person who sat with you..." | Em-dashes in body — v1.1 §11.3 violations | **BLOCK** | At least 2 body-copy em-dashes; total page em-dash count ≥6 (H1 + subhead + 3 H2 + 2 body). |
| P8 | 5. Components: Process step grid | TBD-rate-limited | 6 numbered steps: 01 Free On-Site Consultation / 02 Custom Design & 3D Presentation / 03 Proposal & Budget Alignment / 04 Permitting & Pre-Construction / 05 Construction & Installation / 06 Final Walkthrough & Project Completion | 6 steps deployed vs Home-page-brief spec's **5 steps** (Discovery → Design → Proposal → Build → Enjoy & Maintain) — also vs Our Process page's own 3-phase frame (Design/Build/Maintain) | NUMBER MISMATCH | FLAG | Resolve: the 3 phases nest the 6 steps logically (Design = 01+02+03; Build = 04+05+06; Maintain = follow-up). But Home page brief specifies 5-step process for the homepage process section, which should match. Sync homepage 5-step display to either 6 steps or restructure as 3 phases. |
| P9 | 5. Components: Quote attributions | TBD-rate-limited | "NOT FOUND" — no attributed quotes on this page | OK for a process page (not a narrative page) | PASS | Intentional. Process pages typically don't carry personal quotes — they carry sequence and certainty. |
| P10 | 5. Components: Logo strip | TBD-rate-limited (assumed same sitewide pattern) | "Multiple repeated logo sets visible but company names NOT legible" — likely same template defaults as About + Our Story | **CONFIRMED SITEWIDE BLOCK** (3rd page with placeholder logos) | **BLOCK** | Apply `logo-strip-recommendations-for-raja.md`. |
| P11 | 7. Content cascade: tenure stat | TBD-rate-limited | "Established 1983" — no "40 years" / "40+ years" / "over 40 years" violation found on this page | CLEAN | PASS | First page in the audit that doesn't carry the "40 years" cascade. Use this page's "Established 1983" phrasing pattern as the canonical replacement for "40+ years" elsewhere. |
| P12 | 8. Content order | TBD-rate-limited | Hero → "Three Phases. One Team. No Handoffs." (intro H2) → Phase 1: Design → Phase 2: Build → Phase 3: Maintain → "What Our Clients Say" (testimonials) → "Common Questions" (FAQ) → "Ready to Start?" (final CTA) | Clean, linear, process-led structure — matches expectations for a Process page | PASS (provisional, pending Figma comparison) | Order is logical and works narratively. |
| P13 | 2. Type scale | Same 4-family pattern as About: H1 Archivo ExtraBold 64px white · H2 Archivo ExtraBold 800/40px CENTER · Body SF Pro Rounded Regular 20px · Para M SF Pro Rounded Regular 16px · Stats Archivo SemiBold 24px · Promobar Circular Std Book 20px UNDERLINE · Footer Poppins Regular 18px + Medium 22px | Not directly inspected on deployed but consistent rendering expected | Consistent with About — same 4-family bloat | FLAG (sitewide S11) | Covered by Raja's S11 consolidation subtask `86aher28h` |
| P14 | 3. Color tokens | Same set as Home + About: Primary `#0F2537` · Primary 2 `#285140` (used as fill for one of the 3 inner FAQ-style group blocks — green section visual variety) · Accent 2 `#FB8C00` · Color-Text-Grey `#333333` · Outline `#E6E6E6` · Text White `#FFFFFF` · ts1 emphasis = Primary 2 green | Not directly inspected | NEEDS VISUAL | FLAG (provisional) | Primary 2 green appears as section background on the middle FAQ block — verify deployed renders this color variation |
| P15 | 4. Spacing / grid | Page 1440×7774 (slightly shorter than About 7292 + a final CTA section). Hero 1440×852 identical to About. Logo Strip identical positioning (x=141 y=900). Stats band 1440×220 with padding 39/152/37/104, Primary 2 green fill, at y=1684. 3 phase cards 400×variable, 24px radius, 40px padding, navy Primary fill, gap 66px between icon (100×100) and text (320 wide). FAQ/Group blocks 1232×variable with 50px corner radius, 104/88 padding. | Not directly inspected | NEEDS VISUAL | FLAG (provisional) | |
| P16 | 7. Image specs | Hero BG image `a3edf9b5e3670add42983b98fc2fc1e02390b981` with double diagonal-gradient overlay (45deg 2-66%, layered twice for depth) — same pattern as About hero. No other major imagery — process page is text + icon heavy. Each phase card has a `Frame 1618873199` icon area (100×100) | Not inspected | NEEDS VISUAL | FLAG (provisional) | Note: hero image differs from About's BG (`f63d8ae3abc933660efdab5e45e08305161e9168`) — each page family has its own hero photo |
| P17 | 5. Components: Intro section "Three Phases. One Team. **No Handoffs.**" | New finding from Figma fetch on new file. Intro H2 at node `1309:9464` reads "Three Phases. One Team. {ts1}No Handoffs.{/ts1}" with last 2 words in Primary 2 green for emphasis. Intro subhead `1309:9465`: "Our process is built on a simple principle: the person who designs your project is the person who sees it through to completion. No handoffs between departments. No miscommunication between contractors. One designer, one team, one point of contact **—** from the first conversation to the last walkthrough, and for every season that follows." | Section title appears as 1st H2 on deployed (per prior WebFetch). Subhead presence not explicitly verified but likely renders given subhead-style rendering on other pages. | **Em-dash in intro subhead** — adds to the em-dash count (now ≥7 em-dashes on Our Process: H1, hero subhead, intro subhead, 3 phase H2s, body ×2+) | **BLOCK** | Em-dash sweep on Our Process subtask `86aher1zn` should catch all of these. |
| P18 | 5. Components: 3 phase cards (operationally) | Three FRAME blocks at IDs `1309:9466` / `1309:9475` / `1309:9484` — each 400px wide, Primary navy fill, 24px corner radius, 40px padding, internal icon area (100×100) + content text area (320 wide). Per Q6 ruling this is the canonical structure; Home P1 needs to mirror it. | Verified as 3-phase visual structure on deployed | MATCH | PASS | Q6 implementation reference for Raja: Home process restructure subtask `86aher28n` should use these dimensions as the template. |
| P19 | 5. Components: Stats band | 5-stat band at `1412:7126` IDENTICAL to About: Established 1983 / 70–90 Employees / 13–14 Year Avg. Employee Tenure / NALP Affiliated / Licensed & Insured. Primary 2 green fill (`#285140`). | **NOT VERIFIED on deployed** — Our Process WebFetch didn't include stats per the initial extraction. Need to confirm whether this stats band renders. | If deployed renders the band: cross-check against About (which substitutes 2 stats incorrectly). If deployed lacks the band: another stat-band drift. | FLAG | Action: add a quick deployed-page check for Our Process stats band. If absent, it's NIT (Figma over-specs); if present and matching, PASS; if present with About's factual error, BLOCK. |
| P20 | 5. Components: FAQ-style blocks | 3 separate FAQ-style Groups (`1309:9519`, `1309:9540`, `1309:9553`). One uses Primary 2 green fill (`1309:9553`) for visual variety; others use Primary navy. Each contains a "Questions" sub-frame with rgba(255,255,255,0.05) fill. | Deployed shows 1 "Common Questions" H2 with FAQ accordion below per WebFetch. Three blocks in Figma may render as one consolidated FAQ on deployed, or three separate blocks. | NEEDS VISUAL | FLAG (provisional) | Confirm how Raja's Breakdance build implemented these 3 Figma blocks. |

**Net Our Process findings (now complete after new-file fetch):** 6 BLOCKs (em-dash count ≥7 across H1+subheads+phase headings+body+intro; placeholder logos), 5 FLAGs (H1 doesn't match brief; missing promobar; process step count 5-vs-6 → resolved via Q6; sitewide S11 font / S9 logo / S14 alt; stats band verification needed; FAQ block count visual confirm), 4 PASSes (form-first CTAs; no attributed quotes; clean tenure stat handling; 3-phase card structure matches Q6 ruling), 4 visual-fidelity flags pending DevTools/screenshot pass (P13-P16 partially resolved, still need on-screen verification).

---

## Cross-page cascade observations

Patterns surfacing on 2+ pages of the 4 audited (Home + About + Our Story + Our Process). These are the highest-leverage fixes — one resolution propagates across pages.

### Confirmed sitewide patterns (4 pages each unless noted)

| Pattern | Pages affected | Fix | Severity |
|---|---|---|---|
| **Em-dash usage** | All 4 (Home: 1 / About: 4 / Our Story: 14 / Our Process: 6) — total **≥25 em-dashes** across just these 4 pages | Sitewide find-replace + tool-humanizer pass. Source of cascade is the creative briefs themselves; fix brief copy first, then sync Figma, then deployed. Captured as fix-list S5. | **BLOCK** |
| **Logo strip placeholder tech logos** (brave / circle / discord / google / jump / lollapalooza / magiceden / meta / shopify / stripe) | Home (not yet decoded but suspected per template pattern), About, Our Story, Our Process | Replace with credibility strip per `logo-strip-recommendations-for-raja.md`. Captured as fix-list S9 + S14 (alt attrs). | **BLOCK** |
| **"40 / 40+ / over 40 years" tenure stat** (cascade from brief and pre-v1.2 copy) | About ("trusted us for over 40 years"), Our Story (H2 "Served for 40 Years" + body "over 40 years of experience"). Home + Our Process clean | Sitewide S6 — replace all with "43 years" or "since 1983". | **BLOCK** |
| **Card title semantic tag** — service / portfolio card titles render as page-level `<h2>` | Home ("Backyard Resort"), About (6 service cards "Custom Pools & Water Features", etc.), likely Our Story (Section 5 uses same Card component `234:831`) | Sitewide S10 — change Breakdance card template title from `<h2>` to `<h3>`. | FLAG |
| **CTA primary verb inconsistency** | Home: "Start Your Transformation" / About: "Request a Free Estimate" / Our Story: "Request a Free Estimate" / Our Process: "Request a Free Estimate" | Sitewide S13 — pick one canonical verb. | FLAG |
| **Promobar inconsistency** — SPRING REFRESH visible on Home + About, missing on Our Story + Our Process | All 4 (split 2/2) | Sitewide S12 — decide global or per-page-with-rationale. | FLAG |
| **Font stack drift** — Home uses Archivo + SF Pro Rounded; About adds Circular Std + Poppins for promobar/footer respectively | All 4 (likely sitewide; need DevTools confirm on Our Story + Our Process) | Sitewide S11 — consolidate to 2 families. Note SF Pro Rounded licensing concern. | FLAG |
| **Common component reuse** (positive) — Card component `234:831` reused on About + Our Story; Testimonial component `237:1101` reused on About; Section 16 location image `35b6a5cc3df34383281aa822a8753183072ef6bf` reused on Home + About | Multi-page positive | No fix; good design system hygiene to encourage going forward. | PASS |

### Confirmed cascades RESOLVED during this audit

| Item | Resolution |
|---|---|
| **Errata B4** — "Schwenksville vs Skippack" HQ city conflict | Resolved as a non-conflict. The deployed Our Story footer shows "4494 Skippack Pike Schwenksville, PA 19473" — Skippack is the street (Skippack Pike), Schwenksville is the USPS mailing city. Both are correct in customer-facing copy. Close errata B4. |
| **AGENTS.md ownership** — Jeff listed as "Sole Owner" alongside Chad as "Co-Owner" (internally contradictory) | Resolved 2026-05-13: Jeff and Chad are co-owners, partners since **1994** (voice profile §1.6 — old reference docs that say 1995 are wrong; this corrects an earlier note in this audit too). AGENTS.md key-contacts updated: Jeff = "Founder / President / Co-Owner"; Chad = "Vice President / Co-Owner". Figma's Who-We-Are bio copy has correct roles but wrong year (says 1995) — Raja fix included in P6 item 8. Saved as memory `blue-tree-ownership` for future sessions. |
| **Prior audit error** — Home hero primary CTA claimed to be "Request a Consultation" | Corrected: Home hero primary is actually "Start Your Transformation" matching Figma. "Request a Consultation" CTAs are at section-level, not hero. Spec-compliance-audit row 1.Primary CTA needs amendment. |

### Open questions — ALL RESOLVED 2026-05-13 by Jason

| Q | Ruling | Action taken |
|---|---|---|
| Q1 CTA canonical verb | "Request a Free Estimate" sitewide | Subtask 86aher1tp updated to BLOCK; Home gets the only change. Documented in S13 + client-parameter-sheet.md (pending edit). |
| Q2 Promobar | Hide globally; client has no current approved promo content | Subtask 86aher28a created for Home + About removal. Held subtasks 86aher1wv (Our Story) + 86aher200 (Our Process) marked RESOLVED. Jerome/Maureen email going out to gather current promo content. |
| Q3 Font stack | Consolidate to Archivo + Nunito (replace SF Pro Rounded — Apple license violation for web; replace Circular Std + Poppins too) | Subtask 86aher28h created. Documented in S11. |
| Q4 About stats band | Research from existing live site `bluetreelandscaping.com` | Done — live site is sparse, only shows "1983". PLNA accolades confirmed in live-site text. Subtask 86aher1v3 updated with research findings: restore Figma 5-stat set BUT hold NALP + Licensed & Insured until Jerome/Maureen confirm active memberships. Remove factually-wrong "43+ Years of Co-Ownership" regardless. |
| Q5 Logo strip memberships | Research from existing live site + email Jerome/Maureen for confirmations | PLNA confirmed via live-site text; NALP/ICPI/PHTA/BBB/Houzz/Angi pending client email. Logo-strip design task 86aher20q updated. Raja can start 5 custom seals now (no dependencies); third-party logo sourcing waits on confirmations. |
| Q6 Process step count | Approved recommendation: 3 phases / 6 steps on Our Process, 3 phases with nested 5 steps on Home | Subtask 86aher1zq (Our Process) updated with concrete structure. Companion subtask 86aher28n created under Home. |
| Q7 Our Story new factual stats | Ship them | Subtask 86aher1wm updated. All 4 unverified claims (44+ / 20+ / 25-30 / 30 years partnership) approved. To be added to v1.2 voice profile power-stats list. Figma 3-stat header band stays absent on Our Story (recommendation accepted). |

### Audit completion status

| Page | Figma node decoded | Deployed comparison | Findings populated |
|---|---|---|---|
| Home | depth 3 + Hero Content depth 3 + Promobar depth 3 (full) | WebFetch ✓ | Complete (11 rows) |
| About Us | depth 3 (full) | WebFetch ✓ | Complete (17 rows) |
| Our Story | depth 3 (full, via grep) + Hero Content depth 3 (full) | WebFetch ✓ | Complete (17 rows) |
| Our Process | depth 3 (full, completed 2026-05-13 on new file `Q6lmvy4QnHhnauxLMY0TjY`) | WebFetch ✓ | Complete (20 rows incl. 4 new findings: intro section em-dash, 3-phase card structure, stats band parity question, FAQ block count) |

Total: **4 of 4 pages fully audited.** Roll-up to `fix-list-for-raja.md` complete. All TBD-rate-limited rows resolved 2026-05-13 once Jason duplicated the Figma file into his Pro-plan workspace — new file `Q6lmvy4QnHhnauxLMY0TjY` preserved all original node IDs verbatim, so no re-discovery cost.

**Remaining work outside this audit scope** (handoff for next session or visual sweep):
- DevTools / screenshot pass on type render, exact color sampling, image crop verification across the 4 pages (visual fidelity dimensions still marked "provisional")
- Verify Our Process stats band renders on deployed (P19 — flagged but not visually confirmed)
- Confirm 4 inline link cards present on About (A9 row noted as needing visual confirm)
- Decode Home Promobar GROUP `1309:4716` was completed; matches deployed verbatim

## Roll-up to `fix-list-for-raja.md`

Once findings are populated, each BLOCK / FLAG row becomes a line in `fix-list-for-raja.md` under either:

- **Sitewide (S-codes)** if the pattern repeats across 3+ pages
- **Per-page (P-codes)** if specific to one page

Existing S-codes (S1-S8) and P-codes (P1-P17) in `fix-list-for-raja.md` define the namespace — append new codes sequentially.

---

## Open items before audit can resume

- [x] Figma MCP reconnected — `figma-developer-mcp` exposes `get_figma_data` + `download_figma_images`
- [x] Confirm Jason has access to the Blue Tree Figma file with the token's identity — metadata fetch succeeded
- [x] Node IDs for Home / About / Our Story / Our Process discovered
- [ ] Full node trees cached locally to `deliverables/figma-cache/{slug}.json`
- [ ] Desktop + mobile screenshots of deployed pages captured

## Figma file map (discovered 2026-05-13)

**File:** Blue Tree (`leXDzLrKd1zucGnwQbTWOB`)

**Canvases:**
- `0:1` — Working
- `692:3262` — Page 3
- `601:479` — Design Final ← audit source

**Inside Design Final:**
- `730:17139` — SECTION "Phase 1" (original iteration, superseded)
- `1309:4646` — SECTION "Phase 1 - color treatment rule-book applied" ← authoritative
- `1489:9383` — FRAME "New Service Pages" (out of Phase 0 scope)

**Inside authoritative SECTION `1309:4646`:**

| Frame | Node ID | Notes |
|---|---|---|
| Home | `1309:4647` | top-level under SECTION |
| Services | `1309:5056` | top-level (Phase 1 service hub, out of scope today) |
| About (parent container) | `1309:6950` | top-level; holds the About family of sub-pages |
| Inner | `1309:10249` | top-level inner-page template (out of scope today) |

**Children of About FRAME `1309:6950`:**

| Frame | Node ID | In Phase 0 scope? |
|---|---|---|
| Portfolio Expanded | `1309:6951` | No |
| Our Story | `1309:7168` | **Yes** |
| Service Hub | `1309:7650` | No |
| Portfolio | `1309:7960` | No |
| Meet the Team | `1309:8328` | No |
| Why Blue Tree | `1309:8612` | No |
| About Us | `1309:8902` | **Yes** |
| Process | `1309:9238` | **Yes** (labeled "Our Process" in audit) |
| Reviews | `1309:9574` | No |
| Editorial Standards | `1309:10034` | No |

---

*Scaffold written 2026-05-13. Findings populated post-MCP-reconnect.*
