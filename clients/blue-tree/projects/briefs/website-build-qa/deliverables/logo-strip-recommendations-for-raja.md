---
project: website-build-qa
deliverable: Logo-strip trust badge recommendations for Raja
audit_owner: Jason Spencer (ROI.LIVE)
recipient: Raja Sheryar (ROI.LIVE Designer)
created: 2026-05-13
relates_to: figma-audit.md A8 (logo strip placeholder issue)
status: ready for Raja
---

# Logo Strip — Replace Template Defaults With Trust Badges

## Problem

The deployed About page (and likely Home + others) carries a logo strip filled with Breakdance template defaults: brave, circle, discord, google, jump, lollapalooza, magiceden, meta, shopify, stripe. These are tech-startup brand marks with zero relevance to Blue Tree and zero trust value for a residential landscape design-build buyer.

## Recommendation

Blue Tree does not have vendor/partner logos worth showcasing in a strip (they're not a SaaS or distributor — they're a service provider). Instead, **convert the logo strip into a trust/authority/credibility strip** that surfaces the credentials a homeowner actually weighs when shopping:

- Real industry certifications and association memberships
- Custom-designed trust seals that signal longevity, ownership, and guarantees

A 5-8 badge mix usually reads cleanest on desktop. Aim for visual rhythm: roughly half real third-party marks, half custom Blue Tree seals.

---

## Option A — Real third-party logos to source

These are licensed marks from associations Blue Tree is genuinely affiliated with. Pull official logos from each org's brand/press kit page. Use the white/single-color variant on a dark strip background so they read as a coherent set.

| # | Badge | Why | Where to get logo |
|---|---|---|---|
| 1 | **NALP** — National Association of Landscape Professionals | Recognized industry membership; Blue Tree is NALP affiliated per stats band | landscapeprofessionals.org → Member Resources → Logo |
| 2 | **ICPI** — Interlocking Concrete Pavement Institute | Chad Ochnich is ICPI Certified (hardscape credential); strong proof on patios/walls work | icpi.org → Certified Installer page (logo via member portal) |
| 3 | **PLNA** — Pennsylvania Landscape & Nursery Association | State-level affiliation; resonates with Southeastern PA buyers | plna.com → Member Center |
| 4 | **PHTA** — Pool & Hot Tub Alliance (formerly APSP) | If Blue Tree is a member — confirm with Jeff. Major credibility for the pool division | phta.org → Members section |
| 5 | **BBB** — Better Business Bureau (Accredited Business) | Confirm Blue Tree's accreditation and rating. The BBB torch is a universally recognized homeowner signal | bbb.org → search Blue Tree → "Accredited Business" badge embed code |
| 6 | **Google Reviews** — 4.6★ aggregated rating widget | If Trustindex is wired up (per reviews page audit it isn't yet), the Google logo + star rating is high-trust | google.com/business → Marketing kit → "Reviews on Google" badge |
| 7 | **Houzz** — Pro / "Best of Houzz" if won | Houzz is the dominant remodeling-research platform; "Best of Houzz" badges have a yearly cycle | houzz.com/pro/bluetree → marketing materials |
| 8 | **Angi** — Certified / Super Service Award if applicable | Confirm Blue Tree's Angi presence | angi.com → business portal |

**Confirm with Jeff/Maureen before committing:** Which of these affiliations Blue Tree actually holds active membership in. Don't display a badge unless the membership is current — it's a brand-trust risk if a homeowner verifies and finds it expired.

---

## Option B — Custom-designed trust seals (5 recommended)

These don't exist as third-party logos — Raja designs them. Each functions as a "stamp" or "seal" that compresses a Blue Tree credential into an icon + short text lockup. Use ChatGPT (or Midjourney / DALL-E 3) to generate the base concept, then refine in Figma/Illustrator into a vector that matches the design system.

### Design system constraints for all custom badges

- **Primary color:** Navy `#0F2537` for stroke/fill on light backgrounds; pure white `#FFFFFF` for strokes on dark strip
- **Accent:** Orange `#FB8C00` (Accent 2) sparingly for highlight elements only — don't dilute it
- **Secondary accent:** Deep green `#285140` (Primary 2) for landscape/Healthy Yards references
- **Style:** Flat geometric, single-weight strokes, circle or shield silhouette, vintage-stamp feel without going kitsch
- **Output:** SVG vector; export 80px × 80px PNG transparent fallback
- **Type inside seals:** Archivo (matches site H1/H2 font stack)
- **Consistency:** All 5 seals should read as a single set — same stroke weight, same silhouette family, same type treatment

### Seal 1 — "43 Years Family-Owned · Since 1983"

**Purpose:** The single highest-trust signal for residential service buyers. Longevity + ownership continuity.

**ChatGPT prompt:**
```
Design a circular monochromatic trust seal badge, 1:1 aspect ratio, vintage-stamp style with modern minimal execution. Outer ring contains the text "43 YEARS · FAMILY-OWNED · SINCE 1983" in uppercase Archivo ExtraBold, evenly spaced. Inner center icon: a stylized geometric tree silhouette (two abstract triangular layers for canopy, simple rectangular trunk). Single-weight 2px strokes throughout. Use pure white #FFFFFF on a transparent background. Flat vector aesthetic, no gradients, no shadows, no skeuomorphism. Output as a clean SVG-style flat design suitable for display on a dark navy strip. Keep the silhouette circle and ensure all type sits on the ring with consistent letter spacing.
```

### Seal 2 — "Lifetime Structural Warranty"

**Purpose:** Blue Tree's lifetime pool-shell warranty is a real differentiator. The badge codifies it.

**ChatGPT prompt:**
```
Design a circular monochromatic trust seal badge, 1:1 aspect ratio, in the same visual family as a vintage stamp redrawn for modern web. Outer ring text: "LIFETIME · STRUCTURAL · WARRANTY" uppercase Archivo ExtraBold. Inner center icon: a stylized geometric shield with a small checkmark inside. Single-weight 2px strokes. Pure white #FFFFFF on transparent background. Flat vector, no gradient, no drop shadow, no glow. Match the silhouette and stroke weight of a sibling badge that has a tree-canopy icon centered — these need to read as a set. Output: SVG-ready flat design.
```

### Seal 3 — "Co-Owned · Jeff & Chad · Partners Since 1994"

**Purpose:** Owner-operator continuity. Two principals, three decades of partnership. Trust = "the person who builds your pool is the same person who answers the phone."

**ChatGPT prompt:**
```
Design a circular monochromatic trust seal badge, 1:1 aspect ratio, same vintage-stamp-meets-modern-flat family as siblings. Outer ring text: "CO-OWNED · PARTNERS SINCE 1994" uppercase Archivo ExtraBold. Inner center icon: two overlapping geometric circles (slightly offset, abstract handshake / partnership symbolism) inside a smaller inner ring. Single-weight 2px strokes throughout. Pure white #FFFFFF on transparent background. Flat vector, no gradient. Match the silhouette circle and stroke weight of sibling badges (tree-canopy badge, shield-checkmark badge). Output: SVG-ready flat design.
```

### Seal 4 — "Licensed · Bonded · Insured"

**Purpose:** Table stakes legal/operational signal. Homeowners check this; absence is a red flag.

**ChatGPT prompt:**
```
Design a circular monochromatic trust seal badge, 1:1 aspect ratio, in the same vintage-stamp-modern-flat family as siblings. Outer ring text: "LICENSED · BONDED · INSURED" uppercase Archivo ExtraBold. Inner center icon: a stylized document / certificate with a ribbon detail at the bottom, drawn geometrically with single-weight 2px strokes. Pure white #FFFFFF on transparent background. Flat vector, no gradient, no shadow. Match silhouette and stroke weight of sibling tree-canopy, shield-checkmark, and overlapping-circles badges. Output: SVG-ready flat design.
```

### Seal 5 — "Design · Build · Maintain · One Team"

**Purpose:** Operational moat — most competitors are siloed; Blue Tree owns the entire lifecycle. Use this to differentiate from one-trick contractors.

**ChatGPT prompt:**
```
Design a circular monochromatic trust seal badge, 1:1 aspect ratio, same vintage-stamp-modern-flat family as siblings. Outer ring text: "DESIGN · BUILD · MAINTAIN" uppercase Archivo ExtraBold. Inner center icon: three small triangular wedges arranged in a triangle formation (representing three integrated services), inside a smaller inner ring. Single-weight 2px strokes. Pure white #FFFFFF on transparent background. Flat vector, no gradient, no glow. Match silhouette and stroke weight of sibling badges. Output: SVG-ready flat design.
```

---

## Recommended final mix (8 total for desktop strip)

Best balance of authority + differentiation:

1. NALP logo (real, sourced)
2. ICPI logo (real, sourced)
3. **43 Years Family-Owned** (Seal 1, custom)
4. **Lifetime Structural Warranty** (Seal 2, custom)
5. PHTA logo (real, sourced — *if confirmed member*)
6. **Co-Owned · Partners Since 1994** (Seal 3, custom)
7. BBB Accredited (real, sourced — *if accredited*)
8. **Design · Build · Maintain** (Seal 5, custom)

For mobile, collapse to 4 badges — typically 1 real + 3 custom (longevity wins on mobile attention).

## Implementation notes for Raja

- **Spacing:** The Figma logo strip is 1159px wide, 10 slots × 88.88px width with 30px gaps. Going to 8 badges relaxes the spacing — bump per-badge width to ~100-110px.
- **Background:** The current Figma BG of the About hero is a diagonal-gradient image. The logo strip sits below the hero. If the strip overlays the hero gradient area, white badges read well. If it sits on white background, switch to navy-stroke versions of each seal.
- **Vertical rhythm:** All 8 badges must align to a common visual baseline. Build seals on a 64px or 80px artboard with identical inner-padding so they sit on the strip uniformly.
- **Accessibility:** Each badge needs an `alt` attribute describing the credential ("43 years family-owned since 1983", "NALP affiliated landscape professional", etc.). Don't ship as decorative-only `alt=""`.
- **Schema impact:** The custom seals are not third-party verifications; do NOT include them in JSON-LD `award` or `hasCredential` fields. Only real associations (NALP, ICPI, PHTA, BBB) belong in schema.

## Open questions for Jeff/Maureen before final design

1. Confirm active membership: NALP, ICPI, PLNA, PHTA. Provide membership numbers if Raja needs them for any embed badges.
2. Confirm BBB accreditation status and current letter rating.
3. Confirm Houzz Pro and Angi presence and current "Best of" / Super Service status.
4. Approve the 5 custom seal concepts before Raja invests design time — especially "Co-Owned · Partners Since 1994" wording (date confirmed via voice profile §1.6; old reference docs that say 1995 are wrong).
5. Decide whether to display the Trustindex Google reviews widget separately on Reviews page only or also as a logo-strip badge.

---

*Generated 2026-05-13 during Phase 0 Figma audit. Surfaced by A8 finding (placeholder tech-brand logos on About page logo strip). Send to Raja once Jason approves the seal concepts.*
