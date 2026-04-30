# Learnings Journal — Green Llama Clean

> Auto-maintained by Agentic OS skills. Newest entries at the bottom of each section.
> Skills append here after deliverable feedback. Never delete entries.
> Section headings match skill folder names exactly. New skills add their own section when created.
> Skills read only their own section before running. Cross-skill insights go in `general`.

---

# General

## What works well

- 2026-04-29: Treat GLC blog content as YMYL-adjacent. The audience touches children, vulnerable populations, and chemical safety. Apply Core Standards §4.5 elevated review, ChemExpo / EWG / PubChem / EPA Tier 1 sourcing, and the agency Citation Discipline SOP three-level review chain (Author → Matt → Kay).
- 2026-04-29: Em-dashes are fully banned anywhere in GLC editorial. Use spaced en-dash or restructure. Stricter than Core Standards §8.2 baseline. Also a strong AI-detection countermeasure since LLMs over-produce em-dashes.
- 2026-04-29: "We" is permitted in body copy (DTC override per Core §3.4). Kay and Matt are named explicitly at attribution moments: every key data claim, every Expert Take, every FAQ answer.
- 2026-04-29: Voice Charter v5.0 emotional-targeting framework (fear · guilt · belonging · pride · joy) is NOT active for blog editorial. Charter applies to social and brand-campaign channels only. Bake this rule into every skill that loads voice context for GLC.

### From the source package — Key Learnings (folded in)

#### On data integrity

- Shopify analytics defaults to period-over-period, not year-over-year. Verify YoY math against prior-year same-period figures. A YoY misread inflated one dashboard metric by 600%+.
- Returning customer rate is order-level by Shopify default, not customer-level. Always label which view is being used.
- Tilde (`~`) prefix means derived (calculated, not pulled directly). Asterisk (`*`) on MER figures with footnote noting calculation scope.
- Chart.js fails silently in hidden tab contexts: canvas inside an inactive tab renders to zero height. Use inline SVG or initialize charts only when the tab activates.

#### On content quality

- Hallucinated citations are existential to the brand. Kay flagged this on the March 20, 2026 call. The `[STAT NEEDED]` flag is the response: never invent a statistic, always flag uncertainty for human review.
- Tier 1 sourcing with real, verifiable URLs is required. EPA, NIH, peer-reviewed studies, EWG, recognized industry bodies. Generic .org sources do not count.
- Quantity vs. quality is a real tradeoff. Four articles per week compresses quality control. Verified sources, tighter review, clear escalation when something looks off pre-publish.
- A 30-minute alignment call between Jason's family member and the GLC team solves more than weeks of post-hoc corrections.

#### On SEO and topical authority

- Core update drops signal cluster gaps, not pillar weakness. When a site reaches #3 then drops after a Google core update, the pillar is rarely the problem. The cluster is missing intent angles.
- Four jobs-to-be-done for "non toxic cleaning products": (1) understand what the term means, (2) get a vetted product list by category, (3) confirm products work, (4) switch a routine.
- Cross-cluster link funneling. Articles in adjacent clusters should link to the pillar of the cluster being prioritized for ranking recovery.
- Anchor text matters more than people think. Swapping generic anchors for exact-match anchors is one of the highest-leverage cluster interventions.
- Publish order: definitional → freshness → credibility → utility. For the six-article fill: definitional anchor → 2026 buyer's guide → "do they work" → room-by-room → transition → audience-specific. Spaced 5–7 days apart.

#### On email/SMS performance

- Click rate is the structural bottleneck. Open rates 30–37% paired with click rates 0.5–0.7% point to email body design and CTA placement, not subject lines or audience quality.
- Win-back outperforms everything else per recipient. April Lap Re-engage hit $34.49 RPR vs. campaign average $0.07: a 492x productivity difference.
- Segment-specific sends beat broadcast. April VIP and ACT-targeted emails pulled 36–43% open rates vs. 30–31% for ALL SUBS.
- SMS click rate is 6–9x email click rate. SMS carries every deadline and flash offer.
- Above-the-fold CTA within 150 words. Single biggest structural fix.
- Triple CTA structure: primary button at top → secondary text link mid-email → primary button repeat at close.
- Image-resistant CTA. Gmail and Outlook block images by default. Primary CTA must render as HTML text and a button, not an embedded image.

#### On client communication

- Address bad news directly in writing. Soften nothing material. Acknowledge the problem in specific terms ("hallucinated citations," not "quality issues").
- Recap meetings in the order they happened. Topic-by-topic recap that mirrors meeting flow gives the client a single forwardable document.
- Owners and dates on every action item. Concrete dates, never relative.
- Data points anchored to source. Cite where the metric came from (Shopify, Klaviyo, GSC).

#### On revenue trajectory modeling

- Five levers to $30K/mo: paid ads (~$5,500/mo at maturity, 3-month ramp), Klaviyo consistent cadence (~$2,300/mo, immediate), AOV/CVR optimization (~$2,200/mo, 3-month ramp), subscription growth (~$2,390/mo at +10% subscriber growth), SKIO migration retention (~$800/mo, month 4+).
- Baseline organic growth ~2.5%/mo compound in plateau phase. Hits $30K naturally in back half of 2027.
- All levers stacked: $30K reachable in 12–14 months with realistic ramp curves.
- New customer AOV ($44.74) exceeds returning customer AOV ($38.91). Untapped upsell opportunity in moving returning customers back toward bundle/add-on purchases.

#### On client relationships

- Jason's family member needs guardrails, not removal. The path is: verified sources required, tighter review, alignment call between the family member and the GLC team.
- Bot/international traffic distorts CVR. Cloudflare + Turnstile + Signifyd is the recommended stack.
- The "Build Your Bundle" button is a CRO problem. Placement, color, discount label all need updating on desktop. Mobile is constrained by the hamburger menu.
- Subscription platform migration is time-sensitive. Moving from Seal to SKIO gets harder as the subscriber base grows.

## What doesn't work well

- 2026-04-29: Voice Charter v5.0 fear/guilt emotional triggers in blog content. Out of step with FTC Green Guides substantiation standards and AEO citation patterns. Don't use in editorial.
- 2026-04-29: Three-item rhetorical lists ("Purpose. Clarity. Impact." pattern). Banned per Core §8.2. Three-item factual enumerations (acidic/alkaline/neutral; proteases/amylases/lipases) are permitted. See clarification logged 2026-04-29.

---

# Individual Skills

## mkt-brand-voice

- 2026-04-29: When loading GLC voice, use this hierarchy: (1) `voice-profile.md` index, (2) `sops/GL_Editorial_Overlay_v1.md` rule layer, (3) `voice-profile-full.md` for deep reference. Do NOT load `reference/voice-charter-v5.md` for blog editorial: Charter applies to non-blog channels only.

## mkt-positioning

- 2026-04-29: GLC primary angle = "Science-led non-toxic cleaning, formulated by a chemist." Founder-credentialed E-E-A-T (Kay's OT, Matt's Ph.D.) is the strongest differentiator. Refillable + EWG Verified + Women-Owned + Tennessee manufacturing are the supporting pillars.

## mkt-icp

- 2026-04-29: Three-segment ICP by need state, not demo. Primary: health-first parents. Secondary: eco-conscious lifestyle buyers. Tertiary: sensitivity / health-condition driven (asthma, dermatitis). Cross-segment language: "plant- and mineral-based," "EWG Verified," "free from [specific named chemicals]," "compostable," founder credentials.

## mkt-copywriting

## mkt-content-repurposing

## mkt-ugc-scripts

## str-trending-research

## str-ai-seo

- 2026-04-29: For GLC, AEO content runs through agency Citation Discipline SOP. Inline citation hooks ("According to EPA data...", "[Author year] found...") are mandatory: they're the AEO mechanism for source attribution. Hookless claims are extractable but not traceable to source.

## tool-humanizer

- 2026-04-29: GLC has em-dash full ban (stricter than Core baseline). Run `tool-humanizer` deep mode with the GLC overlay loaded; the em-dash check is an additional pass on top of standard Stop Slop scan.

## tool-firecrawl-scraper

## tool-stitch

## tool-dataforseo

- 2026-04-29: GLC's existing topical map and entity-SEO strategy live in `brand_context/reference/`. New keyword research for GLC verifies against the existing cluster plan first; new clusters expand from the eight existing clusters (Eco-Friendly Cleaning, Natural Cleaning Products, Conscious Consumer's Guide, Performance Lab, Sustainable Laundry Room, Symptom Bridge, Toxicology Report, Zero Waste Kitchen) plus the planned six (R1-R6).

## tool-youtube

## viz-nano-banana

- 2026-04-29: GLC image hard rules: NO liquid bottles, NO plastic packaging, NO product mockups unsupported by verified product data, NO text overlay in AI-generated images. USE: natural materials, botanicals, abstract/architectural visuals, powder textures, clean fabrics. The brand is anti-liquid as a model: depicting liquid contradicts the brand identity.

## viz-ugc-heygen

## viz-stitch-design

## viz-interface-design

- 2026-04-29: GLC design system is documented in `brand_context/assets.md`. Greens scale (g0-g9), earth-tone accents (sage / kraft / terra / amber / cream), Playfair Display + DM Sans, max width 780px. Component class inventory present: .hero, .stats, .aeo, .gw, .dim, .sc, .tl, .co, .voice, .cta, .faq, .cn, .qs, .fail, .rel, .prod, .sticky-bar.

## viz-excalidraw-diagram

## meta-skill-creator

## meta-wrap-up

## meta-goal-breakdown

## ops-cron

## ops-new-feature

## ops-release
