# Green Llama Clean — Brand Assets & Design System

> Extracted 2026-04-29 from `green-llama-eco-friendly-article (6).html` (the most recent reference article on disk in `~/Downloads/Green Llama/`). The same design system is the canonical reference for the in-progress Shopify migration: one extraction, two uses.

## Logo

- **File:** [`assets/logo.png`](./assets/logo.png)
- **Source:** Decoded from base64 PNG embedded in the reference article (4 instances in the source HTML, all identical — same logo used in nav and footer)
- **File size:** 10,621 bytes
- **Format:** PNG (the article HTML uses inline base64; for Shopify use, this real PNG file is the canonical reference)
- **Note:** If higher-resolution or vector versions exist (SVG, original Adobe files), they should replace this PNG. This file is the extracted reference, not necessarily the master.

## Color tokens (CSS :root variables, exact values from reference)

### Greens scale (primary brand palette)

| Token | Hex | Use |
|---|---|---|
| `--g9` | `#0f3d1e` | Darkest green, deep accent, hero overlays |
| `--g8` | `#1a5632` | Brand dark green, primary CTAs, headlines |
| `--g7` | `#1f6b3d` | Mid-dark green |
| `--g6` | `#2d8a50` | Mid green |
| `--g5` | `#3ea66a` | Mid-light green |
| `--g2` | `#b8ddc5` | Light green tint |
| `--g1` | `#daeee1` | Lighter green tint |
| `--g0` | `#eef7f1` | Lightest green tint, section backgrounds |

Note: no `--g3` or `--g4` tokens defined in the reference. Either intentional gap or future expansion slots.

### Earth-tone accents

| Token | Hex | Use |
|---|---|---|
| `--sage` | `#7d9b75` | Sage accent |
| `--sage-l` | `#c5d9bc` | Sage light |
| `--sage-bg` | `#f0f5ec` | Sage background tint |
| `--kraft` | `#a67c52` | Kraft brown accent |
| `--kraft-l` | `#d4b896` | Kraft light |
| `--kraft-bg` | `#faf5ee` | Kraft background tint |
| `--terra` | `#b5704f` | Terracotta accent |
| `--terra-l` | `#d4a882` | Terracotta light |
| `--terra-bg` | `#faf3ed` | Terracotta background tint |
| `--amber` | `#e8973f` | Amber accent (warm highlight) |
| `--cream` | `#faf7f0` | Cream, page background |
| `--ww` | `#fefcf8` | Warm white, card backgrounds |

### Alert / destructive

| Token | Hex | Use |
|---|---|---|
| `--alert` | `#c0392b` | Alert red |
| `--alert-bg` | `#fdf2f0` | Alert background tint |
| `--alert-l` | `#e6b0aa` | Alert light |

### Ink scale (text)

| Token | Hex | Use |
|---|---|---|
| `--ink` | `#2c2c2a` | Primary text |
| `--ink2` | `#5a5a56` | Secondary text |
| `--ink3` | `#8a8a84` | Tertiary text, metadata |

## Typography

- **Display font:** Playfair Display (Google Fonts; weights 400, 600, 700, 800, 900). Fallback stack: `Georgia, serif`. CSS variable `--fd: 'Playfair Display', Georgia, serif`.
- **Body font:** DM Sans (Google Fonts; opsz 9..40, weights 300, 400, 500, 600, 700). Fallback stack: `system-ui, sans-serif`. CSS variable `--fb: 'DM Sans', system-ui, sans-serif`.

Google Fonts import URL (used by reference article):

```
https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=Playfair+Display:wght@400;600;700;800;900&display=swap
```

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
- Reference article (source): `~/Downloads/Green Llama/green-llama-eco-friendly-article (6).html`
