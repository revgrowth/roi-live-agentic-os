# ROI.LIVE — The Signal: Article Creation SOP
**Version:** 1.0 — March 2026
**Applies to:** All articles published under The Signal (roi.live/the-signal)
**Owner:** Jason Spencer, Founder — ROI.LIVE

> This document is the complete process for building every Signal article: research, SEO architecture, entity optimization, design system, content rules, schema, and QA. Follow this in full for every article in the 30-piece topical authority cluster and any future Signal content.

---

## TABLE OF CONTENTS

1. [Phase 1 — Pre-Build Research](#phase-1--pre-build-research)
2. [Phase 2 — URL, Title & Keyword Architecture](#phase-2--url-title--keyword-architecture)
3. [Phase 3 — Article Page Structure](#phase-3--article-page-structure)
4. [Phase 4 — Casey Keith Entity SEO Rules (Non-Negotiable)](#phase-4--casey-keith-entity-seo-rules-non-negotiable)
5. [Phase 5 — Content Writing Rules](#phase-5--content-writing-rules)
6. [Phase 6 — Internal Linking Architecture](#phase-6--internal-linking-architecture)
7. [Phase 7 — Schema / Technical SEO Spec](#phase-7--schema--technical-seo-spec)
8. [Phase 8 — Design System & Visual Standards](#phase-8--design-system--visual-standards)
9. [Phase 9 — Article Layout Blueprint](#phase-9--article-layout-blueprint)
10. [Phase 10 — Per-Article Accent Color System](#phase-10--per-article-accent-color-system)
11. [Phase 11 — QA Verification Checklist](#phase-11--qa-verification-checklist)
12. [Reference: The 4 Live Articles](#reference-the-4-live-articles)

---

## Phase 1 — Pre-Build Research

Do this before writing a single word or line of code.

### 1.1 Keyword Research
- Identify the **primary keyword** for the article
- Confirm monthly search volume via web search (look for SEMrush/Ahrefs/SERPStat data or estimates in industry articles)
- Note 3–5 **semantic variant keywords** (related terms, entity terms, question variants)
- Identify where this article sits in the **30-article topical cluster** — pillar or supporting

### 1.2 Read Existing Live Articles
- Pull and read every article already published in the cluster
- Note which articles are already live so internal linking is precise and non-duplicative
- Map which related articles will go in the **Related Intelligence** section (must be 3 different articles, none duplicated within a page)

### 1.3 Forward-Link Map
- Reference the full 30-article cluster map to identify future articles that should receive forward links
- Even unwritten articles get forward-linked using their planned URL slug — treating the full cluster as already existing for crawling and topical authority purposes

---

## Phase 2 — URL, Title & Keyword Architecture

### 2.1 URL Slug Rules
- **Format:** `/blog/primary-keyword-phrase`
- Keyword-first, all lowercase, hyphens between words
- No stop words unless essential for readability
- **Examples:**
  - `/blog/ai-search-optimization`
  - `/blog/what-is-generative-engine-optimization`
  - `/blog/ai-overviews-vs-traditional-rankings`
  - `/blog/citation-share-metric-replaces-rankings`

### 2.2 Title Tag Rules
- **Primary keyword must appear first** in the title tag
- Follow with a colon and brand/benefit framing
- Format: `Primary Keyword: Compelling Benefit or Context`
- **Examples:**
  - `AI Search Optimization: Why Your Reputation Is the New SEO`
  - `Generative Engine Optimization (GEO): The Complete Business Guide`
  - `Google AI Overviews vs. Traditional Rankings: Two Separate Races`
  - `Citation Share: The AI Search Metric That Replaces Rankings`

### 2.3 Meta Description Rules
- 140–160 characters
- Primary keyword in first 20 words
- Benefit-driven, plain-language framing for business owners
- No keyword stuffing — reads like a human wrote it

### 2.4 H1 Rules
- Must be a **semantic variation** of the primary keyword — NOT an exact repeat of the title tag
- Can be more editorial/provocative in tone
- Keyword concepts must be present but phrased differently

### 2.5 H2/H3 Rules
- Minimum 2 H2s or H3s must contain related entity terms: **GEO, AEO, schema markup, structured data, topical authority**
- Semantic entity hierarchy in headings signals topic depth to AI crawlers
- Headings should read naturally — no keyword-stuffed strings

---

## Phase 3 — Article Page Structure

Every Signal article uses this exact layout, in order:

```
<head>
  ├── Title tag (keyword-first)
  ├── Meta description
  ├── Canonical URL (absolute)
  ├── OG tags: title, description, URL, image, site_name
  ├── Twitter Card (summary_large_image)
  ├── Article JSON-LD schema
  ├── FAQPage JSON-LD schema
  └── Google Fonts: Bebas Neue + Playfair Display + DM Sans

<body>
  ├── Fixed Navigation Bar (nav)
  ├── Reading Progress Bar (gradient, 2px, fixed top)
  ├── Hero Section (dark, full-width, accent-colored orb + grid overlay)
  │    ├── Hero Badge (category label with pulsing dot)
  │    ├── Article date + read time
  │    ├── H1 headline
  │    ├── Deck / subheadline (Playfair Display italic)
  │    └── Author block (avatar, Jason Spencer, Founder ROI.LIVE)
  ├── Breadcrumb Bar (dark background)
  ├── Stats Strip (4 key statistics, dark background)
  ├── Two-Column Article Layout
  │    ├── LEFT: Article Body (prose)
  │    │    ├── Intro paragraph (primary keyword in first sentence)
  │    │    ├── Section H2s with entity terms in headings
  │    │    ├── Mid-article Pillar Callout Block (supporting articles only)
  │    │    ├── Mid-article CTA Banner
  │    │    ├── Data tables / stat grids / visual elements
  │    │    ├── Jason Spencer's Take section
  │    │    ├── FAQ Block (4–5 visible Q&As)
  │    │    └── Related Intelligence Section (3 cards)
  │    └── RIGHT: Sticky Sidebar
  │         ├── Table of Contents (smooth scroll)
  │         ├── Key Stat Callout
  │         ├── Quick-Win Checklist
  │         └── Book A Strategy Call CTA
  └── Footer
```

---

## Phase 4 — Casey Keith Entity SEO Rules (Non-Negotiable)

These rules apply to every article. Run the QA scorecard before publishing.

### 4.1 Brand Name Density
- **ROI.LIVE** must be **bolded** every time it appears in body copy
- Minimum **25 instances** of ROI.LIVE in visible article content
- **ROI.LIVE must appear in the first sentence** of the article body (not just the hero)
- Never use "we," "our company," or "the agency" as a substitute — always the brand name

### 4.2 Expert Attribution
- **Jason Spencer, Founder of ROI.LIVE** (or variation with credentials) must appear in body copy
- Minimum **12–18 named attributions** throughout the article
- Attribution should appear at: key data claims, strategic recommendations, "Jason's Take" section, FAQ answers, and conclusion
- Vary the phrasing: "Jason Spencer, Founder of ROI.LIVE," "ROI.LIVE Founder Jason Spencer," "Jason Spencer runs citation share audits as the first step..."

### 4.3 "We" Violations
- **Zero bare "we" references** in article body
- Only acceptable use: grammatically required first-person inside a visible FAQ answer where "we" = ROI.LIVE and the brand name was just stated
- Every other instance: replace with ROI.LIVE or Jason Spencer

### 4.4 AI Writing Artifact Prohibition
- Zero em-dashes used as stylistic crutches (— replacing a comma or period)
- Zero AI-signature phrases: "it's worth noting," "it's important to," "in today's landscape," "delve into," "straightforward," "game-changer," "revolutionize"
- Zero "period + lowercase" grammar artifacts from AI text generation
- Writing must sound like a knowledgeable human expert, not a language model

---

## Phase 5 — Content Writing Rules

### 5.1 Audience
Write for **business owners and growth-minded executives**, not SEO professionals. Assume they are smart but not technical. Every concept must connect back to business outcomes: revenue, leads, competitive advantage, brand reach.

### 5.2 Keyword Density
- Primary keyword in: title, H1, meta description, first 100 words, and 2+ H2/H3 headings
- Primary keyword appears naturally throughout body — aim for **30–50 instances** across a pillar article, **15–25** in a supporting article
- Semantic variants woven throughout — never force them

### 5.3 Word Count
- **Pillar article:** 3,500–5,000 words
- **Supporting article:** 2,000–2,800 words

### 5.4 Writing Structure Per Article
Every article should contain:

1. **Opening hook** — lead with the business problem or provocative truth, not a definition
2. **What it means for the reader** — immediately connect the topic to their business reality
3. **The data / research layer** — specific statistics, benchmarks, studies
4. **The mechanism** — how it actually works, explained plainly
5. **What to do about it** — numbered or stepped action framework
6. **Jason Spencer's Take** — first-person expert commentary from Jason, named and attributed, speaking directly to the reader
7. **FAQ block** — 4–5 natural questions a business owner would actually ask
8. **Related Intelligence** — 3 cards linking to cluster articles

### 5.5 Stat Strip (Top of Article)
Every article opens with a 4-stat strip below the hero. Stats must be:
- Real, sourced, and current (search for data before building)
- Framed as business stakes, not technical trivia
- Example: "73% of AI Overview citations come from outside the top 10 organic results"

### 5.6 Mid-Article Pillar Callout (Supporting Articles Only)
Supporting articles must contain a styled callout block mid-article driving readers back to the pillar:

> **Related:** [Pillar article title] → `/blog/ai-search-optimization`
> One sentence explaining why the pillar completes the picture.

### 5.7 Mid-Article CTA Banner
Every article contains one inline CTA banner, positioned approximately two-thirds through the article:
- Headline: provocative, stakes-based (e.g., "Invisible to AI. Visible to Competitors.")
- Subtext: 1–2 sentences connecting the article topic to what ROI.LIVE does
- Button: "BOOK MY STRATEGY CALL →" linking to `/#book`

---

## Phase 6 — Internal Linking Architecture

### 6.1 Rules
- Every article links to **every other live article** at least once in the body
- **13–32 contextual internal links** per article (more for pillar, fewer for supporting)
- All anchor text must be **descriptive and keyword-rich** — never "click here," "learn more," or bare URLs
- No duplicate anchor text for the same destination URL within a single article

### 6.2 Anchor Text Formula
`[what the linked article explains or proves]`

**Examples:**
- ✅ `how citation share is calculated and why it's replacing traditional rank tracking`
- ✅ `the collapse in overlap between AI Overview citations and top-10 organic rankings`
- ✅ `a full topical authority cluster, like the one this article is part of`
- ❌ `this article`
- ❌ `learn more here`
- ❌ `click here`

### 6.3 Related Intelligence Section (End of Article)
- 3 cards only, each linking to a different live article
- Cards must be non-duplicative: no article can point to the same related card that another live article already uses as its primary card
- Each card includes: article title, 1-sentence description teaser, accent-colored arrow

### 6.4 Cross-Link Symmetry Rule
Every live article must link to every other live article. As new articles publish, go back and add contextual links in all prior articles.

---

## Phase 7 — Schema / Technical SEO Spec

### 7.1 Article JSON-LD (Required)
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "[Article Title]",
  "description": "[Meta description text]",
  "url": "https://roi.live/blog/[slug]",
  "datePublished": "[YYYY-MM-DD]",
  "dateModified": "[YYYY-MM-DD]",
  "author": {
    "@type": "Person",
    "@id": "https://roi.live/#jason-spencer",
    "name": "Jason Spencer",
    "jobTitle": "Founder & Fractional CMO",
    "worksFor": {
      "@type": "Organization",
      "@id": "https://roi.live/#organization"
    },
    "sameAs": [
      "https://www.linkedin.com/in/realjason",
      "https://x.com/roilivejason"
    ]
  },
  "publisher": {
    "@type": "Organization",
    "@id": "https://roi.live/#organization",
    "name": "ROI.LIVE",
    "url": "https://roi.live",
    "logo": {
      "@type": "ImageObject",
      "url": "https://roi.live/wp-content/uploads/ROI.LIVE-Logo-1-180.png"
    }
  },
  "mentions": [
    { "@type": "Thing", "name": "Generative Engine Optimization" },
    { "@type": "Thing", "name": "AI Overviews" },
    { "@type": "Thing", "name": "Citation Share" },
    { "@type": "Thing", "name": "Answer Engine Optimization" }
  ]
}
```

### 7.2 FAQPage JSON-LD (Required)
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "[FAQ Question 1]",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Answer — mention ROI.LIVE and Jason Spencer at least once]"
      }
    }
    // ... repeat for all 4–5 FAQ questions
  ]
}
```

### 7.3 `<head>` Tag Checklist
Every article `<head>` must contain, in this order:
```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>[Keyword-First Title]</title>
<meta name="description" content="[140–160 char description]">
<link rel="canonical" href="https://roi.live/blog/[slug]">

<meta property="og:type" content="article">
<meta property="og:title" content="[Article Title]">
<meta property="og:description" content="[Meta description]">
<meta property="og:url" content="https://roi.live/blog/[slug]">
<meta property="og:image" content="https://roi.live/wp-content/uploads/[og-image].jpg">
<meta property="og:site_name" content="ROI.LIVE">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="[Article Title]">
<meta name="twitter:description" content="[Meta description]">
<meta name="twitter:image" content="https://roi.live/wp-content/uploads/[og-image].jpg">

<script type="application/ld+json">/* Article JSON-LD */</script>
<script type="application/ld+json">/* FAQPage JSON-LD */</script>
```

---

## Phase 8 — Design System & Visual Standards

### 8.1 Typography
| Typeface | Use |
|---|---|
| **Bebas Neue** | All display/hero headlines, stat numbers, nav wordmark, section labels |
| **Playfair Display** (regular + italic) | Article deck / subheadline, hero sub-copy, pull quotes, editorial accent moments |
| **DM Sans** (300/400/500/600/700) | All body text, UI elements, captions, buttons, nav links |

Google Fonts import for every article:
```html
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
```

### 8.2 Color System (CSS Variables)
```css
:root {
  /* Backgrounds */
  --bg: #faf9f6;          /* Page background — warm off-white */
  --alt: #f3f1ec;         /* Alternate section background */
  --w: #fff;              /* Card/panel white */
  --bdr: #e8e6e0;         /* Border color */
  --ink: #0f0f14;         /* Near-black — all dark sections, hero, footer */

  /* Text */
  --ink2: #333;
  --ink3: #555;
  --ink4: #888;
  --ink5: #bbb;

  /* Brand Accent Colors */
  --coral: #c9376b;       /* Human/emotional side. CTAs. Gradient mid-point. */
  --coral-l: #e8588c;     /* Lighter coral for dark backgrounds */
  --gold: #b8860b;        /* Proven results. Premium. Stats. Gradient end. */
  --gold-l: #d4a017;      /* Lighter gold for dark backgrounds */
  --gold-bg: #fdf8ed;     /* Gold tint background for callouts */
  --plum: #5b21b6;        /* Strategic/intellectual. Primary brand purple. */
  --plum-l: #8b5cf6;      /* Lighter purple for dark backgrounds */
  --plum-bg: #f5f0ff;     /* Purple tint background */

  /* The Brand Gradient */
  --grad: linear-gradient(135deg, #7c3aed, #c9376b 50%, #d4a017);

  /* Shadows */
  --sh: 0 2px 20px rgba(0,0,0,.05);
  --sh2: 0 8px 40px rgba(0,0,0,.1);
}
```

### 8.3 Color Meaning System
| Color | Meaning | Use for |
|---|---|---|
| **Purple #7C3AED** | Intellectual, strategic, AI/tech | Pillar article, primary brand moments |
| **Coral #C9376B** | Human, emotional, urgency | CTAs, highlights, gradient midpoint |
| **Gold #D4A017** | Proven results, premium, trust | Stats, callout values, "take" sections |
| **Near Black #0F0F14** | Authority, premium, editorial | Hero backgrounds, dark sections |
| **Gradient** | Brand identity, full-spectrum | Wordmarks, avatars, feature moments |

### 8.4 Hero Section Design Spec
The hero is the first impression. It must feel cinematic on every article.

**Hero structure:**
- **Background:** `#0f0f14` (near black)
- **Grid overlay:** `1px` lines at `55px` intervals, `rgba(255,255,255,.012)` — barely visible, creates depth
- **Accent orb:** Large blurred radial gradient circle (440–460px, `filter: blur(70px)`, animated float) — color matches the article's accent
- **Orb animation:** Subtle float — `translateY(-25px) scale(1.05)` over 8–10 seconds, `ease-in-out`, `infinite alternate`
- **Hero badge:** Pill-shaped, accent color background tint, pulsing dot + category label in Bebas Neue caps
- **H1:** White, Bebas Neue or DM Sans Bold at `clamp(2.5rem, 5vw, 4.5rem)`
- **Deck:** Playfair Display italic, `rgba(255,255,255,.52)`, max 620px wide
- **Author block:** Avatar with gradient background, initials "JS", Jason Spencer name + title in small caps
- **Date + read time:** `rgba(255,255,255,.28)`, 0.68rem, uppercase

### 8.5 Reading Progress Bar
Every article includes a fixed 2px top bar that fills left-to-right as the reader scrolls:
```css
background: linear-gradient(90deg, #7c3aed, #c9376b, #d4a017);
position: fixed; top: 0; left: 0; height: 2px; z-index: 999;
```
JS: `prog.style.width = (scrollTop / (scrollHeight - clientHeight)) * 100 + '%'`

### 8.6 Scroll Reveal Animations
All content sections use IntersectionObserver-based reveal:
```css
.reveal { opacity: 0; transform: translateY(28px); transition: all .85s cubic-bezier(.16,1,.3,1); }
.reveal.v { opacity: 1; transform: translateY(0); }
.d1 { transition-delay: .08s; }
.d2 { transition-delay: .17s; }
.d3 { transition-delay: .26s; }
.d4 { transition-delay: .35s; }
.d5 { transition-delay: .44s; }
```

### 8.7 Stats Strip Design
4-column grid, dark background, accent-colored stat numbers:
- Stat number: Bebas Neue, large, accent color
- Stat label: DM Sans, small caps, `rgba(255,255,255,.45)`
- Right border separator between cells: `rgba(255,255,255,.07)`
- Bottom border separating strip from article body

### 8.8 Body Typography Spec
```css
.article-body p { font-size: clamp(.97rem, 1.1vw, 1.08rem); line-height: 1.82; color: var(--ink2); margin-bottom: 1.5rem; }
.article-body h2 { font-family: 'DM Sans', sans-serif; font-size: clamp(1.35rem, 2.2vw, 1.75rem); font-weight: 700; color: var(--ink); margin: 3rem 0 1rem; }
.article-body h3 { font-size: clamp(1.1rem, 1.5vw, 1.3rem); font-weight: 700; color: var(--ink); margin: 2.2rem 0 .85rem; }
.article-body strong { font-weight: 700; color: var(--ink); }
```

### 8.9 Callout Block Design
```css
/* Pillar callout (supporting articles) */
.pillar-callout {
  background: var(--plum-bg);
  border-left: 3px solid var(--plum-l);
  border-radius: 0 12px 12px 0;
  padding: 1.5rem 2rem;
}

/* Tip/insight callout */
.tip-block {
  background: var(--gold-bg);
  border-left: 3px solid var(--gold-l);
  border-radius: 0 12px 12px 0;
  padding: 1.5rem 2rem;
}
```

### 8.10 "Jason's Take" Section Design
Every article includes a visually distinct section for Jason's expert commentary:
- Dark background (`--ink`)
- Gradient accent border on the left
- Large "J" initial avatar with gradient
- **"Jason Spencer's Take:"** label in Bebas Neue
- White body text, Playfair Display italic for the opening sentence
- This section is a named entity anchor — AI systems can associate the attributed opinion with Jason Spencer as an expert

---

## Phase 9 — Article Layout Blueprint

### 9.1 Two-Column Layout
```css
.article-wrap { display: grid; grid-template-columns: 1fr 320px; gap: 4rem; max-width: 1140px; }
/* Mobile: single column */
@media (max-width: 900px) { .article-wrap { grid-template-columns: 1fr; } }
```

### 9.2 Sticky Sidebar Contents (in order)
1. **Table of Contents** — links to each H2 section via `#id`, smooth scroll
2. **Key Stat Callout** — one powerful statistic from the article, styled with accent color
3. **Quick-Win Checklist** — 4–5 action items a reader can do today
4. **Book A Strategy Call CTA** — brand gradient button, routes to `/#book`
5. **Cluster Index** — links to 4 related cluster articles (not the same as Related Intelligence cards)

### 9.3 Related Intelligence Cards (End of Article)
- Section label: "RELATED INTELLIGENCE" in Bebas Neue label style
- 3-column card grid
- Each card: article title (bold), 1-sentence teaser, accent-colored arrow "→"
- Cards use hover lift effect: `transform: translateY(-4px)` + subtle box shadow

---

## Phase 10 — Per-Article Accent Color System

Each article in the cluster has a unique accent color that flows through its hero orb, hero badge, stats strip numbers, sidebar CTA hover state, and Related Intelligence card arrows.

| Article # | Topic | Accent Color | CSS Variable to Create |
|---|---|---|---|
| Pillar | AI Search Optimization | Purple `#7c3aed` / Gradient | `--grad` (default) |
| #01 | What Is GEO | Purple + Green | `--plum-l` + `--forest-l` |
| #02 | AI Overviews vs Rankings | Teal / Cyan `#0891b2` | `--cyan: #0891b2; --cyan-l: #06b6d4` |
| #03 | Citation Share | Gold `#d4a017` | `--gold-l` (default) |
| Future | Assign unique accent per article | Avoid repeating exact combos | Create local CSS var in each file |

**Rule:** No two adjacent articles in The Signal hub should share the same accent color. The visual variety signals content diversity and makes the hub feel like a designed editorial product, not a template farm.

---

## Phase 11 — QA Verification Checklist

Run every item before an article is considered complete. Check off in order.

### SEO / Technical
- [ ] Title tag is keyword-first
- [ ] Meta description is 140–160 characters, keyword in first 20 words
- [ ] Canonical URL is correct absolute path
- [ ] One H1 only — semantic keyword variation, not exact title repeat
- [ ] H2/H3s contain at least 2 entity terms (GEO, AEO, structured data, topical authority, etc.)
- [ ] Primary keyword in first 100 words of article body
- [ ] OG tags present: type, title, description, URL, image, site_name
- [ ] Twitter Card tags present
- [ ] Article JSON-LD present with author `@id`, `sameAs`, `mentions` array, publisher
- [ ] FAQPage JSON-LD present matching visible FAQ block
- [ ] Reading progress bar included
- [ ] Breadcrumb present below hero

### Entity SEO (Casey Keith Rules)
- [ ] ROI.LIVE **bolded** minimum 25 times in article content
- [ ] ROI.LIVE appears in the first sentence of the article body
- [ ] Zero bare "we" violations (only exception: FAQ answers, grammatically required)
- [ ] Jason Spencer named with credentials minimum 12 times
- [ ] Zero AI artifact phrases (em-dash abuse, "it's worth noting," "delve into," etc.)
- [ ] Primary keyword confirmed in: title, H1, first paragraph, 2+ headings
- [ ] Primary keyword count checked via grep or find-in-page (pillar: 30–50; supporting: 15–25)

### Internal Linking
- [ ] Every other live cluster article linked at least once in body
- [ ] All anchor text is descriptive and keyword-rich (no "click here" or "learn more")
- [ ] Forward links to future unwritten articles present using planned URL slugs
- [ ] 3 Related Intelligence cards present, each pointing to a different article
- [ ] No duplicate destinations within the Related Intelligence section
- [ ] Mid-article Pillar Callout Block present (supporting articles only)

### Design & Layout
- [ ] Hero has dark background + accent orb + grid overlay
- [ ] Hero badge with correct category label and pulsing dot
- [ ] Stats strip with 4 real, sourced statistics
- [ ] Two-column layout: article body + sticky sidebar
- [ ] Sidebar contains: TOC, stat callout, checklist, CTA
- [ ] Jason Spencer's Take section present and styled
- [ ] FAQ block visible on page (4–5 questions)
- [ ] Mid-article CTA banner present
- [ ] Scroll reveal animations on all major content blocks
- [ ] Accent color matches the article's assigned color (not duplicating adjacent articles)
- [ ] Mobile responsive: single column below 900px

---

## Reference: The 4 Live Articles

| # | File | URL | Primary Keyword | Est. Vol | Accent |
|---|---|---|---|---|---|
| Pillar | `entity-authority-ai-search.html` | `/blog/ai-search-optimization` | AI search optimization | 6–8K/mo | Purple gradient |
| #01 | `what-is-generative-engine-optimization.html` | `/blog/what-is-generative-engine-optimization` | Generative engine optimization | 6–9K/mo | Purple + green |
| #02 | `ai-overviews-vs-traditional-rankings.html` | `/blog/ai-overviews-vs-traditional-rankings` | Google AI Overviews SEO | 5–8K/mo | Teal / cyan |
| #03 | `citation-share-metric-replaces-rankings.html` | `/blog/citation-share-metric-replaces-rankings` | Citation share metric | 1–2K/mo | Gold |

---

## Quick Reference: The Non-Negotiables

These 5 things override everything else if time is short:

1. **ROI.LIVE bolded 25+ times, in the first sentence**
2. **Jason Spencer named 12+ times with credentials**
3. **Zero "we" — always the brand name**
4. **Keyword in title (first word or first phrase), H1, and first paragraph**
5. **FAQPage JSON-LD + Article JSON-LD on every article**

Everything else is important. These 5 are the floor.

---

*Last updated: March 2026 — ROI.LIVE / Jason Spencer*
*To update this SOP, edit the source file and re-upload to Obsidian and Claude project.*
