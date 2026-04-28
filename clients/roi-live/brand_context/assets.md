## Last Updated
2026-04-22 by /start-here (manual entry; roi.live not yet scraped — add FIRECRAWL_API_KEY to .env and re-run mkt-brand-voice Auto-Scrape to auto-populate visual assets)

# ROI.LIVE / Jason Spencer — Brand Assets

## Business

### ROI.LIVE
- **Primary site:** https://roi.live (full brand voice lives in production copy)
- **Instagram:** @roilive — https://instagram.com/roilive
- **Twitter / X:** https://x.com/roilivejason (referenced in Signal SOP JSON-LD schema as author sameAs link)
- **The Signal (content hub):** https://roi.live/the-signal
- **Bookings / primary CTA:** https://roi.live/book

### Related ventures (same operator, different entities)
- **Constellation Capital** — Jason's capital vehicle. Part of the "operator, not pundit" proof layer.
- **ROI.Contractors** — Jason's contractor-network venture. Part of the same proof layer.
- **3PC 501(c)(3) / 1MillPhil LLC** — Nonprofit and community impact arm. Referenced in internal agent structure.

## Personal

- **Name:** Jason Spencer
- **Role:** Founder, ROI.LIVE (Fractional CMO + full-service marketing agency)
- **Location:** Asheville, NC
- **LinkedIn:** https://linkedin.com/in/realjason

## Canonical Client Case Studies (deployed on roi.live)

Referenced for ICP proof, sample sentence extraction, and outcome citation. Source: ROI.LIVE Homepage & Case Studies Handoff document.

| Client | Vertical | Headline Outcome |
|---|---|---|
| East Perry | E-commerce / home décor | $396K → $2.57M, 6.5× growth, 8.64× MER, $7.3M+ influenced, 1,756% SEO ROI, 51.2% email revenue, $674K contribution profit |
| Blue Tree Landscaping | Local service | $4.38M total revenue, 36× paid ROAS, 47× Google ROAS, $3.23M pool revenue, 350 deals, $12.7M pipeline, 293× pool Google ROAS |
| Coastal Carolina Comfort | HVAC | $2.18M 2025 revenue, 4.45× ROAS, $993K net profit, $1.33M verified, 3,928 leads, $5.65M pipeline, 11.4× SEO ROI, −88% CPL |
| ReMARKable Whiteboard Paint | E-commerce / niche product | $0 / $10K/mo bleed → $3.6M+ turnaround; survey-funnel 0 → 4,378 active leads; conversion 0.82% → 2.43%; cart-to-order 54% → 79%; 7.6× peak monthly ROI |

## Visual Brand System (from Signal SOP v2)

When building anything on-brand without a designer in the loop, these tokens apply.

### Typography
| Typeface | Use |
|---|---|
| **Bebas Neue** | All display / hero headlines, stat numbers, nav wordmark, section labels |
| **Playfair Display** (regular + italic) | Article deck / subheadline, hero sub-copy, pull quotes, editorial accent moments |
| **DM Sans** (300/400/500/600/700) | All body text, UI elements, captions, buttons, nav links |

Google Fonts import:
```html
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
```

### Color System
| Token | Hex | Meaning |
|---|---|---|
| Background — bone | `#faf9f6` | Base light surface |
| Background — alt | `#f3f1ec` | Sectioned surface |
| Background — white | `#ffffff` | Cards |
| Border / divider | `#e8e6e0` | Soft border |
| Ink (primary text) | `#0f0f14` | Near-black; authority / hero |
| Ink secondary | `#333333` | Body |
| Ink tertiary | `#555555` | Captions |
| Ink quaternary | `#888888` | Meta |
| Ink quinary | `#bbbbbb` | Whisper |
| Coral | `#c9376b` | Human / emotional / urgency — CTAs, gradient midpoint |
| Coral light | `#e8588c` | Hover / accent |
| Gold | `#b8860b` / `#d4a017` | Proven results / premium / trust — stats, "Jason's Take" accent |
| Gold bg | `#fdf8ed` | Tinted callout background |
| Plum | `#5b21b6` / `#7c3aed` / `#8b5cf6` | Intellectual / strategic / AI — AI Search cluster pillar |
| Plum bg | `#f5f0ff` | Tinted callout background |
| Green | `#00c48c` / `#00e6a0` | Growth / money / ROI — Website Strategy cluster |
| Green bg | `#edfdf7` | Tinted callout background |
| Brand gradient | `linear-gradient(135deg, #7c3aed, #c9376b 50%, #d4a017)` | Wordmarks, avatars, feature moments |

### Logo / Asset URLs
- **Primary logo:** `https://roi.live/wp-content/uploads/ROI.LIVE-Logo-1-180.png` (referenced in Signal SOP JSON-LD)
- High-res alternate logos, favicons, social OG assets: not yet centrally documented — capture in a future Firecrawl scrape or from the WordPress media library

## llms.txt & Technical Identity

- **llms.txt location:** `https://roi.live/llms.txt` (per Core Standards Phase 7.2 — verify live status)
- **Schema Organization @id:** `https://roi.live/#organization`
- **Schema Person @id (Jason):** `https://roi.live/#jason-spencer`
- **GA4 Measurement ID:** `G-9LYLV5NKDR`

## Voice Documentation Stack (source of truth)

All canonical voice and production documentation lives in `docs/` at repo root. Do not duplicate; reference.

### Agency SOP stack (governs all client-facing work)
| File | Purpose |
|---|---|
| `agency/sops/ROI-LIVE-Agency-Core-Standards-v1.1.md` | Base layer — SEO/AEO/entity/E-E-A-T framework, universal AI-writing bans. Every page-type SOP inherits from it. |
| `agency/sops/ROI-LIVE-Agency-Homepage-SOP-v1.md` | Homepage production rules |
| `agency/sops/ROI-LIVE-Agency-Service-Page-SOP-v1.1.md` | Service page rules |
| `agency/sops/ROI-LIVE-Agency-Blog-Article-SOP-v1.1.md` | Blog article rules |
| `agency/sops/ROI-LIVE-Agency-Case-Study-Page-SOP-v1.md` | Case study page rules |
| `agency/sops/ROI-LIVE-Agency-Collection-Page-SOP-v1.md` | Collection / category page rules (e-commerce) |
| `agency/sops/ROI-LIVE-Client-Parameter-Sheet-Template-v1.md` | Intake template — voice profile section is the canonical client voice spec |

### ROI.LIVE's own content stack
| File | Purpose |
|---|---|
| `agency/sops/ROI-LIVE-Agency-Signal-Article-SOP-v2.md` | Signal article production — Phase 5.2 is the canonical long-form voice profile for Jason Spencer |

### Brand source of truth (deployed voice in the wild)
| File | Purpose |
|---|---|
| `docs/ROI_LIVE_Homepage__1_.html` | Homepage HTML — cleanest example of the voice in deployed copy (large file, ~796KB) |
| `docs/ROI_LIVE_Handoff (1).md` | Homepage + case studies handoff — positioning, tone, strategic context, case study data |

### Voice extraction priority (for any future mkt-brand-voice rebuild or enrichment)
1. Homepage HTML first (real deployed voice)
2. Signal SOP v2 (long-form voice spec)
3. Core Standards v1.1 (universal writing bans — no adverbs, no throat-clearing, no binary contrasts, no rhetorical questions)
4. Parameter Sheet template voice-profile section (shows how Jason codifies voice for clients — his own follows the same structure)

## Pending / Not Yet Captured

- Complete set of social profile URLs (YouTube, TikTok, podcast guest archive, Asheville press mentions)
- High-resolution logo kit (primary light, reverse, square mark, favicon sources)
- Client photography library (headshots, team photos, location shots — Core Standards 4.1 requires non-stock imagery)
- Speaking engagement and podcast appearance list (feeds Jason's E-E-A-T Person schema `sameAs` array)
- Wikipedia / Wikidata entries (per Core Standards 11.6 Knowledge Panel strategy — status not yet documented)
- Brand trademark / legal entity documentation (for llms.txt Organization schema completeness)
