# Green Llama Clean — Brand Assets & Design System

> **Updated 2026-05-01.** Canonical source is the live Green Llama Minimog Shopify theme — values pulled from theme CSS variables. The earlier draft of this file was extracted from a single reference article and used a stale palette + non-brand fonts (Playfair Display + DM Sans). Both have been corrected. The non-toxic-laundry-detergent pillar HTML in `projects/mkt-pillar-rewrites/` is a reference implementation that matches the spec below.

## Logo

- **File:** [`assets/logo.png`](./assets/logo.png)
- **Source:** Decoded from base64 PNG embedded in the reference article (4 instances in the source HTML, all identical — same logo used in nav and footer)
- **File size:** 10,621 bytes
- **Format:** PNG (the article HTML uses inline base64; for Shopify use, this real PNG file is the canonical reference)
- **Note:** If higher-resolution or vector versions exist (SVG, original Adobe files), they should replace this PNG. This file is the extracted reference, not necessarily the master.

## Color tokens (CSS :root variables, exact values from reference)

### Greens scale (primary brand palette — derived from live theme `--color-button: 53,141,117`)

| Token | Hex | Use |
|---|---|---|
| `--g9` | `#1a4a3d` | Deep green, hero overlays |
| `--g8` | `#24614f` | Brand dark green, primary headlines |
| `--g7` | `#2d7a64` | Mid-dark green, H3, links |
| `--g6` | `#358d75` | **Primary brand green**, primary CTAs (matches theme `--color-button`) |
| `--g5` | `#4ba88e` | Mid-light green |
| `--g2` | `#b3ddd0` | Light green tint, borders |
| `--g1` | `#dff8ef` | Lighter green tint, section backgrounds (matches theme light-green sections) |
| `--g0` | `#f4f8f3` | Lightest green tint, page backgrounds |

Note: no `--g3` or `--g4` tokens defined. Reserved for future expansion.

### Earth-tone accents

| Token | Hex | Use |
|---|---|---|
| `--sage` | `#6a9e8a` | Sage accent |
| `--sage-l` | `#a8d5c4` | Sage light |
| `--sage-bg` | `#f4f8f3` | Sage background tint (same as `--g0`) |
| `--kraft` | `#8a7a5c` | Kraft brown accent |
| `--kraft-l` | `#c4b89a` | Kraft light |
| `--kraft-bg` | `#f7f5f0` | Kraft background tint |
| `--terra` | `#b5704f` | Terracotta accent (article-level component use) |
| `--terra-l` | `#d4a882` | Terracotta light |
| `--terra-bg` | `#faf3ed` | Terracotta background tint |
| `--amber` | `#ff9421` | Amber accent (announcement bar, warm highlights) |
| `--btn-hover` | `#d7740d` | Button hover state (matches theme `--color-button-hover: 215,116,13`) |
| `--cream` | `#fafcfa` | Cream, soft section backgrounds |
| `--ww` | `#ffffff` | Pure white, card backgrounds |

### Alert / destructive

| Token | Hex | Use |
|---|---|---|
| `--alert` | `#c0392b` | Alert red |
| `--alert-bg` | `#fdf2f0` | Alert background tint |
| `--alert-l` | `#e6b0aa` | Alert light |

### Ink scale (text — matches theme `--color-foreground: 34,34,34`)

| Token | Hex | Use |
|---|---|---|
| `--ink` | `#222222` | Primary text |
| `--ink2` | `#666666` | Secondary text |
| `--ink3` | `#999999` | Tertiary text, metadata |

## Typography

- **Display font (headers):** Open Sans. Loaded by Minimog theme as the primary header font. Weights 300, 400, 700. Fallback `sans-serif`. CSS variable `--fd: "Open Sans", sans-serif`.
- **Body font:** Jost. Loaded by Minimog theme as `M-Body-Font`. Weights 400, 500, 600. Fallback stack: `system-ui, sans-serif`. CSS variable `--fb: 'Jost', system-ui, sans-serif`.

Google Fonts import URL (use only when the article CSS is rendered outside the live Shopify theme — the live theme already loads both fonts):

```
https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;700&family=Jost:wght@400;500;600&display=swap
```

**Important:** Earlier reference articles loaded Playfair Display + DM Sans. That treatment was a one-off draft and does not match the live brand. Do not propagate it to new articles.

## Layout tokens

| Token | Value | Use |
|---|---|---|
| `--mw` | `780px` | Article max width |
| `--gx` | `clamp(1.25rem, 4vw, 2.5rem)` | Responsive horizontal gutter |

## Component class inventory

These class names are confirmed present in the reference article. Class counts indicate how many times each appears in the source HTML; useful for understanding which components are heavily used.

| Class | Occurrences | Likely purpose |
|---|---|---|
| `.hero` | 26 | Hero / above-fold treatment |
| `.stats` | 4 | Stats strip |
| `.aeo` | 4 | AEO direct-answer block |
| `.gw` | 6 | (GL "go-wide" or feature block, confirm with design lead) |
| `.dim` | 7 | Dimmed / muted treatment |
| `.sc` | 15 | Section container |
| `.tl` | 10 | Timeline / list element |
| `.co` | 5 | Comparison / column block |
| `.voice` | 9 | Founder voice / expert-take treatment |
| `.cta` | 8 | Call-to-action button or banner |
| `.faq` | 9 | FAQ block |
| `.cn` | 4 | Conclusion / closing block |
| `.qs` | 10 | Quick-stats or query-snippet block |
| `.fail` | 7 | "What fails" / negative-example block |
| `.rel` | 3 | Related-content cards |
| `.prod` | 35 | Product mention / product card |
| `.sticky-bar` | 16 | Sticky CTA bar |

The `.prod` class with 35 occurrences indicates heavy product mention density throughout the article, consistent with the Casey Keith brand-entity-density pattern in agency Core Standards §3.2 and §3.3. Verify each `.prod` usage matches actual product names per [`sops/GL_Blog_Content_SOP_v1_1.md`](./sops/GL_Blog_Content_SOP_v1_1.md) rules: no liquid products, names match greenllamaclean.com.

## Cross-references

- Logo file: [`assets/logo.png`](./assets/logo.png)
- Voice profile: [voice-profile.md](./voice-profile.md)
- Brand SOP: [sops/GL_Blog_Content_SOP_v1_1.md](./sops/GL_Blog_Content_SOP_v1_1.md)
- Editorial overlay: [sops/GL_Editorial_Overlay_v1.md](./sops/GL_Editorial_Overlay_v1.md)
- KPI dashboard refresh SOP: [sops/GLC_KPI_Dashboard_Update_SOP.md](./sops/GLC_KPI_Dashboard_Update_SOP.md)
- **Canonical source:** Green Llama Minimog Shopify theme (live homepage CSS variables)
- **Reference implementation:** `projects/mkt-pillar-rewrites/2026-04-30_non-toxic-laundry-detergent-pillar.html` and `2026-04-30_eco-friendly-laundry-detergent-spoke.html` — both align to the spec above

## Changelog

- **2026-05-01** — Brand spec corrected against live Minimog theme. Display font moved from Playfair Display to **Open Sans**. Body font moved from DM Sans to **Jost**. Greens shifted from saturated palette (`--g6 #2d8a50`) to lighter sage-leaning palette (`--g6 #358d75`, matching theme primary CTA). Ink scale moved from warm `#2c2c2a` to neutral `#222222` (matching theme `--color-foreground`). Amber moved from `#e8973f` to `#ff9421` (matching announcement bar). Added `--btn-hover #d7740d` token for CTA hover states. Eco-friendly spoke article CSS updated in same pass.
- **2026-04-29** — Initial extraction (stale; superseded by 2026-05-01).
