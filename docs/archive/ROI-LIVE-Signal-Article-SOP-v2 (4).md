# ROI.LIVE — The Signal: Article Creation SOP
**Version:** 2.0 — March 2026
**Applies to:** All articles published under The Signal (roi.live/the-signal)
**Owner:** Jason Spencer, Founder — ROI.LIVE

> This document is the complete process for building every Signal article: research, SEO architecture, entity optimization, design system, content rules, schema, and QA. Follow this in full for every article in any topical authority cluster and any future Signal content.

---

## TABLE OF CONTENTS

1. Phase 1 — Pre-Build Research
2. Phase 2 — URL, Title & Keyword Architecture
3. Phase 3 — Article Page Structure
4. Phase 4 — Casey Keith Entity SEO Rules (Non-Negotiable)
5. Phase 5 — Content Writing Rules & Brand Voice
6. Phase 6 — Internal Linking Architecture
7. Phase 7 — Schema / Technical SEO Spec
8. Phase 8 — Design System & Visual Standards
9. Phase 9 — Article Layout Blueprint
10. Phase 10 — Per-Article Accent Color System
11. Phase 11 — QA Verification Checklist
12. Reference: Live Articles & Cluster Map

---

## Phase 1 — Pre-Build Research

Do this before writing a single word or line of code.

### 1.1 Keyword Research
- Identify the **primary keyword** for the article
- Confirm monthly search volume via SE Ranking, DataForSEO, or equivalent tool — **never estimate or fabricate volume numbers**
- Note 3–5 **semantic variant keywords** with validated volume
- Identify where this article sits in its **topical cluster** — pillar or supporting

### 1.2 Read Existing Live Articles
- Pull and read every article already published in ALL clusters (not just the one this article belongs to)
- Note which articles are already live so internal linking is precise and non-duplicative
- Map which related articles will go in the **Related Intelligence** section (must be 3 different articles, none duplicated within a page)

### 1.3 Forward-Link Map
- Reference the full cluster map to identify future articles that should receive forward links
- Even unwritten articles get forward-linked using their planned URL slug — treating the full cluster as already existing for crawling and topical authority purposes

---

## Phase 2 — URL, Title & Keyword Architecture

### 2.1 URL Slug Rules
- **Format:** `/blog/primary-keyword-phrase`
- Keyword-first, all lowercase, hyphens between words
- No stop words unless essential for readability

### 2.2 Title Tag Rules
- **Primary keyword must appear first** in the title tag
- Follow with a colon and brand/benefit framing
- Format: `Primary Keyword: Compelling Benefit or Context`

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
- Minimum 2 H2s or H3s must contain related entity terms relevant to the article's cluster
- For the AI Search cluster: GEO, AEO, schema markup, structured data, topical authority
- For the Website Strategy cluster: conversion rate optimization, website architecture, local SEO, brand voice, website ROI
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
  ├── Article JSON-LD schema (with mainEntityOfPage, image, article-specific mentions)
  ├── FAQPage JSON-LD schema
  ├── BreadcrumbList JSON-LD schema
  └── Google Fonts: Bebas Neue + Playfair Display + DM Sans

<body>
  ├── Fixed Navigation Bar (nav) — blog-article version with absolute URLs + "The Signal" link
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
  │    │    ├── Intro paragraph (primary keyword in first sentence, ROI.LIVE in first sentence)
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
  │         ├── Book A Strategy Call CTA
  │         └── Cluster Index (links to related articles)
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
- Vary the phrasing: "Jason Spencer, Founder of ROI.LIVE," "ROI.LIVE Founder Jason Spencer," "Jason Spencer runs website audits as the first step..."

### 4.3 "We" Violations
- **Zero bare "we" references** in article body
- Only acceptable use: grammatically required first-person inside a visible FAQ answer where "we" = ROI.LIVE and the brand name was just stated
- Every other instance: replace with ROI.LIVE or Jason Spencer

### 4.4 AI Writing Artifact Prohibition
- Zero em-dashes used as stylistic crutches (— replacing a comma or period)
- Zero AI-signature phrases. Banned list:
  - "it's worth noting," "it's important to," "in today's landscape," "delve into," "straightforward," "game-changer," "revolutionize," "navigate," "leverage," "at its core," "let that sink in," "here's the thing," "the uncomfortable truth is," "let me be clear," "at the end of the day," "and that's okay," "this is where it gets interesting," "when it comes to," "it turns out that," "the reality is," "what makes X unique"
  - Cluster-specific bans (Website Strategy cluster): "in today's digital age," "online presence," "digital footprint," "robust solution," "seamless experience," "cutting-edge," "state-of-the-art," "world-class," "holistic approach," "empower your business"
- Zero "period + lowercase" grammar artifacts from AI text generation
- Zero dramatic one-word fragment sentences ("Purpose. Clarity. Impact.")
- Zero binary contrast structures ("It's not X. It's Y.")
- Writing must sound like a knowledgeable human expert, not a language model

---

## Phase 5 — Content Writing Rules & Brand Voice

### 5.1 Audience
Write for **business owners and growth-minded executives**, not SEO professionals or web developers. Assume they are smart but not technical. Every concept must connect back to business outcomes: revenue, leads, competitive advantage, brand reach.

### 5.2 Jason Spencer's Voice Profile

Jason Spencer's writing voice has these characteristics. Every article on The Signal should read as if Jason wrote it:

**Tone:** Down to earth. The guy across the table who makes complex things simple without dumbing them down. Not academic. Not salesy. Conversational authority — the kind earned by doing the work across dozens of industries for 30+ years, from corporate boardrooms to solo startups that failed and taught him more than the wins.

**Method:** Data-led. Jason removes opinions, subjectiveness, preferences, and emotion from strategy decisions. He uses math and logic to make the case for the right path. Numbers go first. Then the explanation of what the numbers mean. Then the recommendation. The reader sees the math and arrives at the conclusion before Jason states it — that is the goal.

**Perspective:** Broad and cross-industry. Jason has worked with e-commerce brands, local service contractors, niche product companies, HVAC businesses, home decor brands, landscapers, and more. He draws parallels between industries. He explains how a conversion principle that worked for an e-commerce brand applies to an HVAC company's website. This cross-pollination of experience is the brand's intellectual edge.

**What it sounds like:**
- Short sentences mixed with longer ones. Rhythm matters.
- Specific numbers instead of vague claims. "$38,000 left on the table" beats "significant revenue loss."
- Analogies grounded in business reality, not tech jargon. Compare website investment to hiring a salesperson, not to "digital ecosystems."
- Questions directed at the reader's situation, not rhetorical flourishes. "What does your website convert at? If you don't know, that's the first problem."
- First-person in the "Jason's Take" section. Third-person attribution everywhere else.

**What it does NOT sound like:**
- LinkedIn thought-leadership posts from 2019
- Marketing agency brochure copy
- An AI writing assistant with no editorial direction
- A textbook or academic paper
- A hype-driven sales page with countdown timers

### 5.3 Keyword Density
- Primary keyword in: title, H1, meta description, first 100 words, and 2+ H2/H3 headings
- Primary keyword appears naturally throughout body — aim for **30–50 instances** across a pillar article, **15–25** in a supporting article
- Semantic variants woven throughout — never force them

### 5.4 Word Count
- **Pillar article:** 3,500–5,000 words
- **Supporting article:** 2,000–2,800 words

### 5.5 Writing Structure Per Article
Every article should contain:

1. **Opening hook** — lead with the business problem or a specific number. Not a definition. Not a history lesson. The reader should feel their situation described in the first two sentences.
2. **What it means for the reader** — connect the topic to revenue, leads, or competitive position. Make it personal to their business.
3. **The data / research layer** — specific statistics, benchmarks, studies. Real numbers with sources. Search the web for current data before writing. Never fabricate statistics.
4. **The mechanism** — how it works, explained plainly. Use the simplest accurate language. If a concept needs a technical term, define it in the same sentence.
5. **What to do about it** — numbered or stepped action framework. Practical. Specific enough that a business owner could act on step 1 today.
6. **Jason Spencer's Take** — first-person expert commentary from Jason, named and attributed, speaking directly to the reader
7. **FAQ block** — 4–5 natural questions a business owner would actually ask. Each answer must mention ROI.LIVE or Jason Spencer at least once.
8. **Related Intelligence** — 3 cards linking to cluster articles

### 5.6 Stat Strip (Top of Article)
Every article opens with a 4-stat strip below the hero. Stats must be:
- Real, sourced, and current (search for data before building)
- Framed as business stakes, not technical trivia
- Example: "73% of AI Overview citations come from outside the top 10 organic results"

### 5.7 Mid-Article Pillar Callout (Supporting Articles Only)
Supporting articles must contain a styled callout block mid-article driving readers back to the pillar:

> **Related:** [Pillar article title] → `/blog/[pillar-slug]`
> One sentence explaining why the pillar completes the picture.

### 5.8 Mid-Article CTA Banner
Every article contains one inline CTA banner, positioned approximately two-thirds through the article:
- Headline: provocative, stakes-based (e.g., "Invisible to AI. Visible to Competitors.")
- Subtext: 1–2 sentences connecting the article topic to what ROI.LIVE does
- Button: "BOOK MY STRATEGY CALL →" linking to `https://roi.live/book`

---

## Phase 6 — Internal Linking Architecture

### 6.1 Rules
- Every article links to **every other live article** at least once in the body — this applies across ALL clusters, not just the article's own cluster
- **13–32 contextual internal links** per article (more for pillar, fewer for supporting)
- All anchor text must be **descriptive and keyword-rich** — never "click here," "learn more," or bare URLs
- No duplicate anchor text for the same destination URL within a single article

### 6.2 Cross-Cluster Linking Rule
Every article, regardless of which cluster it belongs to, must link to **at least 2 articles from each other live cluster.** This builds topical bridges between clusters and prevents content silos. A Website Strategy article must link to at least 2 AI Search articles. An AI Search article must link to at least 2 Website Strategy articles. As new clusters launch, this rule expands.

### 6.3 Anchor Text Formula
`[what the linked article explains or proves]`

**Good examples:**
- "how citation share is calculated and why it's replacing traditional rank tracking"
- "the revenue gap between template websites and sites built on SEO, AEO, and CRO foundations"
- "a full topical authority cluster, like the one this article is part of"

**Never use:**
- "this article"
- "learn more here"
- "click here"
- bare URLs

### 6.4 Related Intelligence Section (End of Article)
- 3 cards only, each linking to a different live article
- Cards must be non-duplicative: no article can point to the same related card that another live article already uses as its primary card
- Each card includes: article title, 1-sentence description teaser, accent-colored arrow
- Cards can link to articles in any cluster — cross-cluster cards are encouraged

### 6.5 Cross-Link Symmetry Rule
Every live article must link to every other live article. As new articles publish, go back and add contextual links in all prior articles.

---

## Phase 7 — Schema / Technical SEO Spec

### 7.1 Article JSON-LD (Required)

**CRITICAL: Update the `mentions` array and `about` property for every article.** Do not copy the template mentions from other articles. Each article must list the specific entities it discusses.

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "[Article Title]",
  "description": "[Meta description text]",
  "url": "https://roi.live/blog/[slug]",
  "datePublished": "[YYYY-MM-DD]",
  "dateModified": "[YYYY-MM-DD]",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://roi.live/blog/[slug]"
  },
  "image": "https://roi.live/wp-content/uploads/[og-image].jpg",
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
  "about": {
    "@type": "Thing",
    "name": "[Primary topic entity — e.g., 'Small Business Website Cost' or 'AI Search Optimization']"
  },
  "mentions": [
    { "@type": "Thing", "name": "[Entity 1 discussed in THIS article]" },
    { "@type": "Thing", "name": "[Entity 2 discussed in THIS article]" },
    { "@type": "Thing", "name": "[Entity 3 discussed in THIS article]" },
    { "@type": "Thing", "name": "[Entity 4 discussed in THIS article]" }
  ],
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": [".article-intro", ".jasons-take-body"]
  }
}
```

**Notes on `speakable`:** The `cssSelector` values point to the opening paragraph (`.article-intro`) and the Jason Spencer's Take body text (`.jasons-take-body`). These are the two sections most likely to be quoted by AI voice assistants and conversational AI. Ensure the corresponding HTML elements use these class names.

**Notes on `about`:** This tells search engines and AI systems what the article's primary subject is. Use the primary topic as a named entity.

**Notes on `mentions`:** List 4–6 entities that the article substantively discusses. These should be proper nouns or recognized concepts (e.g., "Conversion Rate Optimization," "Google Business Profile," "Local SEO," "Schema Markup"). Do NOT list generic terms like "marketing" or "business."

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
  ]
}
```

### 7.3 BreadcrumbList JSON-LD (Required)
Every article must include BreadcrumbList schema matching the visible breadcrumb bar:
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://roi.live"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "The Signal",
      "item": "https://roi.live/the-signal"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "[Article Title]",
      "item": "https://roi.live/blog/[slug]"
    }
  ]
}
```

### 7.4 `<head>` Tag Checklist
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

<!-- GA4 Tracking -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-9LYLV5NKDR"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-9LYLV5NKDR');
</script>

<script type="application/ld+json">/* Article JSON-LD */</script>
<script type="application/ld+json">/* FAQPage JSON-LD */</script>
<script type="application/ld+json">/* BreadcrumbList JSON-LD */</script>
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
  --bg: #faf9f6;
  --alt: #f3f1ec;
  --w: #fff;
  --bdr: #e8e6e0;
  --ink: #0f0f14;

  /* Text */
  --ink2: #333;
  --ink3: #555;
  --ink4: #888;
  --ink5: #bbb;

  /* Brand Accent Colors */
  --coral: #c9376b;
  --coral-l: #e8588c;
  --gold: #b8860b;
  --gold-l: #d4a017;
  --gold-bg: #fdf8ed;
  --plum: #5b21b6;
  --plum-l: #8b5cf6;
  --plum-bg: #f5f0ff;
  --green: #00C48C;
  --green-l: #00E6A0;
  --green-bg: #edfdf7;

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
| **Purple #7C3AED** | Intellectual, strategic, AI/tech | AI Search cluster pillar, primary brand moments |
| **Coral #C9376B** | Human, emotional, urgency | CTAs, highlights, gradient midpoint |
| **Gold #D4A017** | Proven results, premium, trust | Stats, callout values, "take" sections |
| **Green #00C48C** | Growth, money, ROI, conversion | Website Strategy cluster |
| **Near Black #0F0F14** | Authority, premium, editorial | Hero backgrounds, dark sections |
| **Gradient** | Brand identity, full-spectrum | Wordmarks, avatars, feature moments |

### 8.4 Hero Section Design Spec
- **Background:** `#0f0f14` (near black)
- **Grid overlay:** `1px` lines at `55px` intervals, `rgba(255,255,255,.012)`
- **Accent orb:** 440–460px, `filter: blur(70px)`, animated float (`translateY(-25px) scale(1.05)` over 8–10s, `ease-in-out`, `infinite alternate`) — color matches the article's cluster accent
- **Hero badge:** Pill-shaped, accent color background tint, pulsing dot + category label in Bebas Neue caps
- **H1:** White, Bebas Neue or DM Sans Bold at `clamp(2.5rem, 5vw, 4.5rem)`
- **Deck:** Playfair Display italic, `rgba(255,255,255,.52)`, max 620px wide
- **Author block:** Avatar with gradient background, initials "JS", Jason Spencer name + title
- **Date + read time:** `rgba(255,255,255,.28)`, 0.68rem, uppercase

### 8.5 Reading Progress Bar
```css
background: linear-gradient(90deg, #7c3aed, #c9376b, #d4a017);
position: fixed; top: 0; left: 0; height: 2px; z-index: 999;
```
JS: `prog.style.width = (scrollTop / (scrollHeight - clientHeight)) * 100 + '%'`

### 8.6 Scroll Reveal Animations
```css
.reveal { opacity: 0; transform: translateY(28px); transition: all .85s cubic-bezier(.16,1,.3,1); }
.reveal.v { opacity: 1; transform: translateY(0); }
.d1 { transition-delay: .08s; }
.d2 { transition-delay: .17s; }
.d3 { transition-delay: .26s; }
.d4 { transition-delay: .35s; }
.d5 { transition-delay: .44s; }
```

### 8.7 Body Typography Spec
```css
.article-body p { font-size: clamp(.97rem, 1.1vw, 1.08rem); line-height: 1.82; color: var(--ink2); margin-bottom: 1.5rem; }
.article-body h2 { font-family: 'DM Sans', sans-serif; font-size: clamp(1.35rem, 2.2vw, 1.75rem); font-weight: 700; color: var(--ink); margin: 3rem 0 1rem; }
.article-body h3 { font-size: clamp(1.1rem, 1.5vw, 1.3rem); font-weight: 700; color: var(--ink); margin: 2.2rem 0 .85rem; }
.article-body strong { font-weight: 700; color: var(--ink); }
```

---

## Phase 9 — Article Layout Blueprint

### 9.1 Two-Column Layout
```css
.article-wrap { display: grid; grid-template-columns: 1fr 320px; gap: 4rem; max-width: 1140px; }
@media (max-width: 900px) { .article-wrap { grid-template-columns: 1fr; } }
```

### 9.2 Sticky Sidebar Contents (in order)
1. **Table of Contents** — links to each H2 section via `#id`, smooth scroll
2. **Key Stat Callout** — one powerful statistic from the article, styled with accent color
3. **Quick-Win Checklist** — 4–5 action items a reader can do today
4. **Book A Strategy Call CTA** — brand gradient button, routes to `https://roi.live/book`
5. **Cluster Index** — links to 4 related cluster articles (not the same as Related Intelligence cards)

### 9.3 Related Intelligence Cards (End of Article)
- Section label: "RELATED INTELLIGENCE" in Bebas Neue
- 3-column card grid
- Each card: article title (bold), 1-sentence teaser, accent-colored arrow "→"
- Hover: `transform: translateY(-4px)` + box shadow

---

## Phase 10 — Per-Article Accent Color System

Each article has a unique accent color that flows through its hero orb, hero badge, stats strip numbers, sidebar CTA hover state, and Related Intelligence card arrows.

**AI Search Cluster:**
| Article | Accent Color |
|---|---|
| Pillar: AI Search Optimization | Purple `#7c3aed` / Gradient |
| What Is GEO | Purple + Green |
| AI Overviews vs Rankings | Teal / Cyan `#0891b2` |
| Citation Share | Gold `#d4a017` |

**Website Strategy Cluster:**
| Article | Accent Color |
|---|---|
| Pillar: Small Business Website Cost | Green `#00C48C` |
| Future supporting articles | Assign unique accent per article — avoid repeating adjacent combos |

**Rule:** No two adjacent articles in The Signal hub should share the same accent color.

---

## Phase 11 — QA Verification Checklist

Run every item before an article is considered complete.

### SEO / Technical
- [ ] Title tag is keyword-first
- [ ] Meta description is 140–160 characters, keyword in first 20 words
- [ ] Canonical URL is correct absolute path
- [ ] One H1 only — semantic keyword variation, not exact title repeat
- [ ] H2/H3s contain at least 2 entity terms relevant to the article's cluster
- [ ] Primary keyword in first 100 words of article body
- [ ] OG tags present: type, title, description, URL, image, site_name
- [ ] Twitter Card tags present
- [ ] Article JSON-LD present with: author `@id`, `sameAs`, `mentions` array (article-specific), `mainEntityOfPage`, `image`, `about`, `speakable`
- [ ] FAQPage JSON-LD present matching visible FAQ block
- [ ] BreadcrumbList JSON-LD present matching visible breadcrumb bar
- [ ] Reading progress bar included
- [ ] GA4 tracking script present with Measurement ID G-9LYLV5NKDR
- [ ] Breadcrumb present below hero

### Entity SEO (Casey Keith Rules)
- [ ] ROI.LIVE **bolded** minimum 25 times in article content
- [ ] ROI.LIVE appears in the first sentence of the article body
- [ ] Zero bare "we" violations (only exception: FAQ answers, grammatically required)
- [ ] Jason Spencer named with credentials minimum 12 times
- [ ] Zero AI artifact phrases (check against the full banned list in Phase 4.4)
- [ ] Primary keyword confirmed in: title, H1, first paragraph, 2+ headings
- [ ] Primary keyword count checked via grep or find-in-page (pillar: 30–50; supporting: 15–25)
- [ ] `.article-intro` class on opening paragraph (for speakable schema)
- [ ] `.jasons-take-body` class on Jason's Take text (for speakable schema)

### Internal Linking
- [ ] Every other live article in SAME cluster linked at least once in body
- [ ] At least 2 articles from EACH other live cluster linked in body (cross-cluster rule)
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
- [ ] Sidebar contains: TOC, stat callout, checklist, CTA, cluster index
- [ ] Jason Spencer's Take section present and styled
- [ ] FAQ block visible on page (4–5 questions)
- [ ] Mid-article CTA banner present
- [ ] Scroll reveal animations on all major content blocks
- [ ] Accent color matches the article's assigned color (not duplicating adjacent articles)
- [ ] Mobile responsive: single column below 900px

---

## Quick Reference: The Non-Negotiables

These 6 things override everything else if time is short:

1. **ROI.LIVE bolded 25+ times, in the first sentence**
2. **Jason Spencer named 12+ times with credentials**
3. **Zero "we" — always the brand name**
4. **Keyword in title (first word or first phrase), H1, and first paragraph**
5. **FAQPage JSON-LD + Article JSON-LD + BreadcrumbList JSON-LD on every article**
6. **`mentions` array updated per article — never copied from another article's template**

Everything else is important. These 6 are the floor.

---

*Version 2.0 — March 2026 — ROI.LIVE / Jason Spencer*
*Changes from v1.0: Added BreadcrumbList schema, mainEntityOfPage, image, speakable, about property to Article JSON-LD. Added brand voice profile (Phase 5.2). Expanded banned-phrases list with cluster-specific additions. Added cross-cluster linking rule (Phase 6.2). Updated QA checklist. Added green (#00C48C) to color system for Website Strategy cluster.*
