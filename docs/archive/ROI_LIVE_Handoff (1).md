# ROI.LIVE Homepage & Case Studies — Handoff Document

## PROJECT OVERVIEW
Custom HTML homepage for **ROI.LIVE** (Jason's Fractional CMO personal/agency site) plus four standalone case study pages. Deployed via JavaScript redirect on a WordPress "NEW Home" page using Breakdance builder. All images are base64-embedded. Heavy inline `style` attributes throughout require attribute-value CSS selectors and `!important` overrides for responsive CSS.

---

## OUTPUT FILES (all in `/mnt/user-data/outputs/`)
| File | Description | Status |
|------|-------------|--------|
| `home_updated.html` | ROI.LIVE homepage | **Needs ReMARKable integration** |
| `East_Perry_Case_Study.html` | East Perry case study | Final |
| `Blue_Tree_Case_Study.html` | Blue Tree case study | Final |
| `CCC_Case_Study.html` | Coastal Carolina Comfort case study | Final |
| `ReMARKable_Case_Study.html` | ReMARKable Whiteboard Paint case study | **Needs revenue number rework** |

Working copies also exist in `/home/claude/`.

---

## WHAT'S BEEN BUILT

### 1. RESPONSIVENESS ENGINE (all 5 pages)
- Root font scales: 16px → 17.5 → 19 → 20.5 → 24px at 1440/1680/1920/2560px
- Containers widen: 1140 → 1280 → 1400 → 1540 → 1800px
- All fixed font-sizes converted to `clamp()`
- Mobile breakpoints: 1100px, 900px, 768px, 480px
- Touch device hover effects disabled

### 2. VIDEO TESTIMONIALS LIGHTBOX (homepage)
- Lisa Rehurek (self-hosted MP4) and Justin Erb (YouTube) as compact 200px-tall thumbnail cards
- Play button overlay, fullscreen lightbox modal, autoplay, Escape/click-outside to close
- CSS: `.tc-vid`, `.tc-vid-thumb`, `.tc-vid-play`, `.vl-overlay`, `.vl-content`, `.vl-close`
- JS: `openLightbox(id)`, `closeLightbox(event)`

### 3. INDUSTRY BENCHMARK COMPARISONS (all case study pages)
Animated horizontal bar charts (IntersectionObserver scroll-triggered). Each page has ROI.LIVE vs industry average metrics.

### 4. BASE64 IMAGES (all external hotlinks eliminated)
- Blue Tree: Pool photo
- East Perry: Sheepskin rug lifestyle photo
- CCC: HVAC technician photo
- ReMARKable: Product can + whiteboard wall photos

### 5. HOMEPAGE STRUCTURE (current state)
- **Case study cards**: East Perry, Blue Tree, CCC (3 cards — ReMARKable NOT yet added)
- **Combined stats strip**: $7.3M+ EP, 293× BT pool ROAS, $993K CCC profit, 3 industries, 9,000+ leads, $13.8M+ combined
- **Benchmark section**: 3-column grid (EP / BT / CCC)
- **Marquee ticker**: 3 clients' headline stats
- **FAQ**: mentions CCC/HVAC
- **Lightbox video testimonials**: Lisa + Justin

---

## KEY CLIENT DATA

### East Perry (E-commerce/Home Décor)
$396K → $2.57M, 6.5× growth, 8.64× MER, $7.3M+ influenced, 1,756% SEO ROI, 51.2% email revenue, $674K contribution profit

### Blue Tree Landscaping (Local Service)
$4.38M total revenue, 36× paid ROAS, 47× Google ROAS, $3.23M pool revenue, 350 deals, $12.7M pipeline, 293× pool Google ROAS, $988/pool sale

### Coastal Carolina Comfort (HVAC)
$2.18M 2025 revenue, 4.45× ROAS, $993K net profit, $1.33M verified, 3,928 leads, $5.65M pipeline, 11.4× SEO ROI, −88% CPL

### ReMARKable Whiteboard Paint (E-commerce/Niche Product)
**⚠️ REVENUE NUMBERS NEED REWORK — see "Pending Tasks" below**

Current numbers in the case study file:
- 2013: $0 (came to ROI.LIVE bleeding $10K/mo to non-performing agency)
- 2014: $250K ← just added in last session
- 2015: $500K ← just added in last session  
- 2016: $783,422
- 2017: $918,116
- 2018: $950,187 (projected) ← **NEEDS UPDATE TO $1.2M**

Other metrics (may need recalculation once total revenue updates):
- $724K net profit in 2017 alone
- 21% YoY revenue growth (2016→2017)
- Proprietary survey lead funnel: 0 → 4,378 active leads; 30–50% of monthly revenue
- Conversion rate: 0.82% → 2.43% (+196%); Cart-to-order: 54% → 79% (+46%)
- Channel breakdown: SEO +180% traffic YoY, Retargeting 8.6× peak ROI, Google Ads 5.1× peak ROAS, Email $14 CPA, Amazon 4.8× peak ROAS
- Peak Monthly ROI: 7.6×

**Turnaround origin story** is woven throughout:
- Hero: "$0 REVENUE. $10K/MO BLEEDING OUT. THEN → $3.6M"
- Origin section: "2013: Burning Cash. Zero Revenue. No Way Forward."
- Revenue bar chart starts with red $0 bar for 2013
- Closing: "ROI.LIVE fired the old agency, stopped the bleeding, and built every channel from scratch"

---

## PENDING TASKS

### Task 1: Rework ReMARKable Case Study Revenue Numbers
- Update 2018 revenue from $950,187 (projected) to **$1.2M actual**
- Recalculate total revenue: $0 + $250K + $500K + $783K + $918K + $1.2M = **~$3.65M** (verify and update all "$3.6M+" references)
- Update all derivative numbers throughout the case study (hero KPIs, section headers, closing stats, bar chart, narrative text, benchmark comparisons)
- The revenue bar chart JS is at approximately line 426-460 in `ReMARKable_Case_Study.html` — `maxRev` needs updating from 950187 to 1200000, and the 2018 bar data needs the new value

### Task 2: Integrate ReMARKable into ROI.LIVE Homepage
This means adding ReMARKable everywhere the other 3 case studies appear:
1. **New case study card** (4th card) — matching the `.cs-card` pattern used by EP/BT/CCC, needs `.cs-card-rm` accent bar class, ReMARKable product/wall base64 image, KPI chips, "READ FULL CASE STUDY →" button linking to the case study HTML
2. **Stats strip** — update from 3 to 4 clients, update combined totals, update industry count
3. **Benchmark section** — add ReMARKable column (4-column grid), with its key metrics vs industry
4. **Marquee ticker** — add ReMARKable headline stats
5. **FAQ** — mention ReMARKable/e-commerce niche product
6. **Any other cross-references** to "3 clients" → "4 clients", combined revenue totals, etc.

---

## TECHNICAL NOTES

### File Navigation
- The HTML files are very large (thousands of lines). Use `sed -n '[start],[end]p'` via bash to read specific line ranges — the `view` tool truncates mid-file content.
- Use `grep -n` with targeted keywords to locate sections before extracting with `sed`.

### Image Handling
- All images are base64 data URIs embedded directly in the HTML
- ImageMagick for resizing; Python regex scripts for base64 replacement by `alt` attribute matching

### CSS Pattern
- Heavy inline `style` attributes → use attribute-value CSS selectors: `div[style*="grid-template-columns:repeat(4,1fr)"]`
- Always use `!important` overrides for responsive rules
- Never modify HTML structure; CSS-only solutions preferred

### Homepage CSS Classes
- `.cs-card` — case study card container
- `.cs-card-ep`, `.cs-card-bt`, `.cs-card-ccc` — accent bar color classes (need `.cs-card-rm` for ReMARKable)
- `.cs-card-img`, `.cs-card-body`, `.cs-card-tag`, `.cs-card-title`, `.cs-card-desc`, `.cs-card-kpis`, `.cs-card-kpi`
- `.btn-case-study` — pink/magenta CTA button (East Perry style)
- `.btn-case-study-pool` — cyan CTA button (Blue Tree)
- `.btn-case-study-hvac` — blue CTA button (CCC)
- `.stats-strip` — combined stats grid

### Deployment
- WordPress + Breakdance builder
- JavaScript redirect serves the custom HTML from a "NEW Home" page

---

## TRANSCRIPT ARCHIVE
Previous session transcripts are in `/mnt/transcripts/` with a catalog at `journal.txt` in that directory.
