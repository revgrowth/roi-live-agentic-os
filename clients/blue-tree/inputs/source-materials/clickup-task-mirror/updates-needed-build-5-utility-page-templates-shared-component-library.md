---
clickup_task_id: 86ah0d4zr
clickup_url: https://app.clickup.com/t/86ah0d4zr
name: Build 5 Utility Page Templates + Shared Component Library
status: updates needed
priority: normal
assignees: Raja Sheryar
due_date: 2026-04-27
date_created: 2026-04-21
date_updated: 2026-04-21
archived_to_repo: 2026-05-12
---

# Build 5 Utility Page Templates + Shared Component Library

## Build 5 Utility Page Templates + Shared Component Library

### Summary
Build 5 unique Breakdance page templates for the Blue Tree site's Phase 0 utility pages, plus a shared component library that these templates (and all future templates) pull from. Each page has its own creative brief with full section specs, content direction, and technical requirements.

### Shared Component Library (build first)
Before building any of the 5 templates, build the reusable components these templates share with each other and with the service pillar page templates. See **Blue_Tree_Shared_Component_Library_v1.md** for full specs.

**13 components to build as reusable Breakdance blocks:**
1. Hero Block — H1 + subheadline + trust bar + dual CTA (used on every page)
2. Trust Logo Strip — grayscale logo row, hover to color (pillar pages, portfolio, location pages)
3. CTA Block — 3 variants: mid-page, final (dark bg), inline (all pages, 2–6 per page)
4. FAQ Accordion — expandable Q&A with FAQPage schema output (pillar, utility, location, blog)
5. Service Tile Grid — responsive card grid with icon + headline + copy + link (multiple uses)
6. Testimonial Block — quote + attribution + optional photo/rating (pillar, location, case study)
7. Warranty / Comparison Table — responsive data table (pillar guarantee sections, Service Hub)
8. Operation Tag Filter Bar — pill buttons filtering page content via WP taxonomy (portfolio, reviews, blog)
9. Stat Bar — 3–6 large number blocks with labels (about, careers, our story)
10. Cross-Pillar Integration Grid — 4 sibling pillar cards (all pillar pages)
11. Mobile Sticky CTA Bar — fixed bottom CTA on mobile, appears on scroll (long pages)
12. Photo Gallery Grid + Lightbox — masonry grid, lazy load, lightbox with social share (portfolio, case studies)
13. Map Block — branded SVG map variant + Google Maps embed variant (service areas, contact)

### 5 Page Templates to Build

Each page requires its own template. They do not share templates with each other or with any existing page template. Each assembles from the shared components above plus page-specific layout.

**1. Portfolio Photo Gallery** (`/portfolio/`)
- Creative brief:  
- Components: Hero, Trust Logo Strip, Operation Tag Filter Bar, Photo Gallery Grid + Lightbox, CTA Block ×2, Mobile Sticky CTA
- Key feature: Masonry photo grid with lightbox and per-image social sharing (Facebook, Pinterest, Instagram, Houzz). Filterable by 5 Operation Tags. Lazy loading with Load More.
- Word count: ~400 words (visual-first page)
- URL migration: 6 legacy gallery URLs → /portfolio/

**2. Our Process** (`/about/our-process/`)
- Creative brief:  
- Components: Hero, Service Tile Grid ×2 (5-division overview + 8-step process), FAQ Accordion (4 Q&As), CTA Block ×2, Mobile Sticky CTA
- Key feature: Three-phase visual timeline (Design → Build → Maintain) + 8-step numbered process with connecting line/flow visual. Explains how the 5 divisions connect.
- Word count: ~1,200–1,500 words
- Schema: WebPage, BreadcrumbList, FAQPage, optional HowTo

**3. Service Areas Hub** (`/service-areas/`)
- Creative brief:  
- Components: Hero, Map Block (branded SVG), Service Tile Grid ×2 (county cards + pillar overview), CTA Block
- Key feature: Custom branded SVG map of 5-county service area (NOT a Google Maps embed). County cards link to child pages (Phase 1 — links inactive at Phase 0 launch). Featured communities list grouped by county.
- Word count: ~600–800 words
- Note: County/town child page links are inactive at Phase 0 launch. Cards render without link styling until county pages publish in Phase 1 Sprint 2.

**4. Careers** (`/careers/`)
- Creative brief:  
- Components: Hero, Stat Bar, Service Tile Grid (job listing card variant), CTA Block
- Key feature: Job listing cards filterable by department. Cards use the Service Tile Grid shell but with unique anatomy: position title, department, type (full-time/seasonal), description, Apply button. Must support 0–10 listings with a fallback state.
- Word count: ~500–800 words + dynamic job listings
- Schema: WebPage, BreadcrumbList, JobPosting (per listing)
- Pending: 4 items need client confirmation before job listings populate (open positions, application method, benefits, department structure)

**5. Financing** (`/financing/`)
- Creative brief:  
- Components: Hero, Warranty/Comparison Table (financing options variant), FAQ Accordion (4 Q&As), CTA Block ×2, Mobile Sticky CTA
- Key feature: Financing options section with placeholder structure for third-party partner details + Blue Tree payment schedule + phased construction alternative. Clean, professional layout — no aggressive sales styling.
- Word count: ~600–900 words
- Schema: WebPage, BreadcrumbList, FAQPage
- Pending: 5 items need client confirmation before financing details populate (partner, terms, process, promotions, minimums). The phased construction section is permanent content regardless.

### Acceptance Criteria
- [ ] All 13 shared components built as reusable Breakdance blocks/template parts
- [ ] All 5 page templates built and functional in Breakdance
- [ ] Each template populates with content from its creative brief
- [ ] FAQ accordions generate matching FAQPage JSON-LD
- [ ] Operation Tag filter bar on Portfolio page filters correctly across 5 tags
- [ ] Photo Gallery lightbox works on desktop and mobile with social share buttons
- [ ] Service Areas branded SVG map renders correctly across breakpoints
- [ ] Careers job listing cards support 0-listing fallback state
- [ ] Mobile sticky CTA appears/disappears correctly on scroll
- [ ] All pages pass Core Web Vitals targets (LCP < 2.5s, CLS < 0.1, INP < 100ms)
- [ ] All pages responsive at 320px, 768px, 1024px, 1440px
- [ ] BreadcrumbList schema on all 5 pages

### Attachments
- Blue_Tree_Shared_Component_Library_v1.md
- Creative_Brief___Portfolio_Photo_Gallery_v1.md
- Creative_Brief___Our_Process_v1.md
- Creative_Brief___Service_Areas_Hub_v1.md
- Creative_Brief___Careers_v1.md
- Creative_Brief___Financing_v1.md
- Blue Tree Client Parameter Sheet v1.0 (for design tokens, brand rules, and global specs)
