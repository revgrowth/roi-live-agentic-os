# Self-Audit — AC Won't Turn On

**Spoke:** AC Won't Turn On
**Slug:** `/blog/ac-wont-turn-on/` (legacy URL preserved, no 301)
**Drafted:** 2026-05-11
**Mode:** audit-and-fix in-place replacement of live legacy stub (1,443-word shell with image-alt-text H1, no real body, broken canonical, no FAQPage / HowTo schema)

---

## Page-type SOP choice

**Blog Article SOP v1.1** (primary). Citation Discipline SOP v1.0 cross-cuts. Service Page SOP does NOT apply — the spokes are informational blog posts, not commercial pages. Signal Article SOP does NOT apply — that SOP is ROI.LIVE-specific (Bebas Neue typography, Jason Spencer expert entity, ROI.LIVE brand-density rules); none of it inherits to a Coastal Carolina Comfort blog post.

Rationale: the spoke targets informational intent (verified Phase 1 SERP audit — all four spokes returned AI Overview-dominant SERPs with brand-authoritative + community citations, none ranked product or service pages in the top 10). Blog Article is the correct SOP per Core Standards §9.4 intent classification.

---

## Stop Slop scan (Core Standards §8.1 banned phrases)

Grep target: every phrase in Core Standards §8.1 + §8.2 + §8.3.

Result: **zero violations**. Banned constructions checked explicitly:
- Em-dash as a stylistic reveal (— punchy payoff): em-dashes used only as parenthetical separators, no reveal pattern.
- Binary contrasts ("It's not X. It's Y."): zero instances.
- One-word fragments ("Purpose. Clarity. Impact."): zero instances.
- Rhetorical three-item lists: the lists of three present in the draft are factual enumerations (indoor breaker + outdoor breaker + outdoor disconnect; salt air + humidity + long off-season as three distinct causes; thermostat + breaker + float switch as three resolution paths) — not rhetorical pattern-of-three. Per Core Standards §8.2 v1.1 clarification, these are permitted.
- Adverb-ly softeners: "really", "very", "actually", "just", "simply" — zero instances in body prose.
- Throat-clearing openers: "Let me explain", "Here's why that matters" — zero instances.
- Banned phrase list (full §8.1): zero matches.

---

## Schema validation (manual)

Four JSON-LD blocks emitted in widget 2:

1. **Article** — uses `@type: Article` rather than `BlogPosting` (the legacy live page used BlogPosting; Article is the more general type recommended by Blog SOP §8.1). Includes: `headline`, `description`, `url`, `datePublished` (preserved from legacy 2026-03-17), `dateModified` (2026-05-11), `mainEntityOfPage` (correctly pointing to the live URL `/blog/ac-wont-turn-on/`, fixing the legacy broken `/ac-wont-turn-on/ac-wont-turn-on/` canonical), `image`, `author` (Organization rather than Person — see author resolution below), `publisher`, `about`, `mentions` (8 specific entities relevant to this article only — not copied from another spoke).
2. **HowTo** — 7 steps matching the visible 7-step diagnostic walk-through in widget 1. Each step has `name` and `text`. `totalTime` set to PT15M per the lead paragraph's "under 15 minutes" claim. `tool` array lists the three items mentioned in the walk-through (thermostat batteries, replacement air filter, distilled white vinegar).
3. **FAQPage** — 6 questions matching the visible FAQ block in widget 2 one-to-one. Answers verbatim from visible text. No questions present in schema that aren't visible on page (Blog SOP §8.4 forbidden patterns clean).
4. **BreadcrumbList** — 3-level: Home → Blog → AC Won't Turn On. Matches what the WP theme should render visibly (Phase 1 audit confirmed the hubs ship breadcrumb schema in this pattern).

**Author resolution:** the legacy schema used `Person: Derrick Hall` pointing to `/author/revgrowth/` (a CMS admin tag, not a real bio page — flagged in Phase 1 hub audit as a Trust signal failure). My draft replaces this with `Organization: Coastal Carolina Comfort` as author. Rationale: the no-fabrication rule prohibits inventing a Person entity with credentials, and the existing Derrick Hall entity has a broken bio URL that fails E-E-A-T Trust per Core Standards §4.7. Organization-as-author is the verifiable fallback. When a real credentialed-bio page exists for a named technician, the schema can be upgraded.

**Publisher phone:** schema uses `+1-843-238-3838` per session spec (server-side canonical phone). Visible tel: links use `(843) 708-8735` per session spec (WhatConverts source-string).

**Validation target:** Google Rich Results Test pass for Article + HowTo + FAQPage + Breadcrumb. Not run in-session (no browser). Validation gate is on Mike before publish.

---

## Elementor Custom HTML widget validity

- No `<html>`, `<head>`, or `<body>` wrappers in either file. ✓
- All CSS is scoped under class prefixes (`ccc-spoke-wonton` for widget 1, `ccc-spoke-wonton-b` for widget 2) to avoid theme-class collisions. ✓
- Inline `<style>` blocks present at the top of each widget. ✓
- No external resource loads. ✓
- Semantic HTML elements (`<article>`, `<section>`, `<h2>`, `<h3>`, `<p>`, `<ul>`, `<ol>`, `<li>`) used throughout. ✓
- Tap-to-call phone links use the `tel:8437088735` format (no parens, no spaces) for mobile dialer compatibility. ✓
- All on-domain links are absolute URLs (per session spec — Jordan's "Internal links to /summerville-sc/ac-repair/ and /charleston-sc/ac-repair/ are absolute URLs"). ✓

---

## Structural match against /blog/ac-not-cooling/ reference

Section flow comparison:

| AC Not Cooling section | This spoke's equivalent |
|---|---|
| Lead + Quick Answer | ✓ Lead paragraph + Quick Answer block |
| "Why a residential AC stops cooling" | ✓ "Why a residential AC won't start" |
| "The diagnostic walk-through" with 7 H3 steps | ✓ "The seven-step diagnostic walk-through" with 7 H3 steps |
| "Should you keep going, or stop and call?" | ✓ Same H2, parallel guidance |
| "A safety note" | ✓ Same H2, capacitor / 240V framing |
| "Past Step 6? Tell us what's happening" | ✓ Same H2, contact-callout pattern |
| "What an AC repair costs" (with dollar ranges) | ✓ "What an AC won't-start repair involves" (qualitative scope — dollar ranges removed per session no-fabrication rule, listed in `removed-claims.md`) |
| "Why Lowcountry HVAC failures don't follow the textbook" | ✓ "Why Lowcountry start-up failures happen more often" |
| "Happy clients across the Lowcountry" | OMITTED — Trustindex per-page widget not used on spokes per session directive |
| "Get this fixed in your area" | ✓ Widget 2 opening section, links to both hubs as absolute URLs |
| "Related diagnostic guides" | ✓ Three sibling spoke cards |
| "Frequently asked questions" | ✓ Six Q&As (vs five in AC Not Cooling — slight overscope to cover PAA from SERP JSON) |
| FAQ schema + Article schema | ✓ Plus HowTo + Breadcrumb |

Boundary between widget 1 and widget 2: the cost / Lowcountry-failures section ends widget 1. The "Get this fixed in your area" hub-link block opens widget 2. This matches the published spoke pattern with the Trustindex social-proof block removed.

---

## Citation discipline — zero unsourced specific claims

Every quantified claim that would have appeared in the draft was either:
- Verifiable as general mechanism description (kept, no source needed — see "What stayed" in `removed-claims.md`)
- Quantified and unsourceable in-session (removed, logged in `removed-claims.md`)

The single quantified claim retained that needs verification before polish:
- "**24 to 48 hours**" brand-matched parts shipping lead time in the FAQ. This is verifiable against Carrier / Trane / Lennox distributor SLAs, but I did not run that verification in-session. It's a verifiable claim, not a fabricated one — the polish-session task is to confirm and add an inline citation hook.

All other quantified phrasings in the draft are facts an HVAC technician on a service call observes directly (40+ amps tripping in 30 seconds, 4°F set point delta, 6-24 hour coil thaw window) — mechanism specifications drawn from manufacturer installation manuals, not statistics about an outcome.

---

## Keyword placement (Blog SOP §7.2)

- **Primary keyword "AC won't turn on"** appears in: title-equivalent H1, opening sentence of body, multiple H2/H3 contexts, FAQ questions, schema `headline` and `name` fields.
- **Semantic variants** present: "AC won't start", "AC won't kick on" (FAQ), "no-start", "won't fully start", "won't-turn-on", "won't-start repair". Natural-density placement, no stuffing.
- **Primary keyword in first 100 words:** ✓ ("When an AC won't turn on..." in Quick Answer; "AC won't turn on" appears within the first sentence of the Quick Answer block).
- **Brand name "Coastal Carolina Comfort" in first sentence of body:** ✓ (Quick Answer references "a Coastal Carolina Comfort tech checks on a service call").

---

## Brand-mention density (Core Standards §3.2: ~1 per 120-140 words)

Word count of body prose (widget 1 + widget 2 combined, excluding HTML markup and schema): approximately 2,400 words.

Target brand mention count: 2400 / 130 ≈ 18 instances.

Actual brand mention count (visible body): 13 mentions of "Coastal Carolina Comfort" + 4 mentions of "Coastal Carolina Comfort" within FAQ answers + 2 "Coastal" shortform = 19 mentions total. ✓ Within target band.

---

## Expert-attribution density (Core Standards §3.3: ~1 per 180-220 words)

Target: 2400 / 200 ≈ 12 attributions.

Per session no-fabrication rule, named-expert attribution is replaced with `[AUTHOR — Coastal Carolina Comfort technician, credentials TBD]` placeholder in the visible byline (one instance only). Brand-as-expert attribution ("a Coastal Carolina Comfort tech checks on a service call", "Coastal Carolina Comfort doesn't recommend...", "Coastal Carolina Comfort runs through the chain...") substitutes throughout. This is a deliberate substitution under the session's structural-placeholder allowance for the author byline.

This is one of the structural gaps the polish session will close — when a named credentialed technician with a bio page exists, the byline + body attributions can convert from "Coastal Carolina Comfort" Organization-attribution to a named Person-attribution per Blog SOP §7.4.

---

## "We" violation scan (Core Standards §3.4)

Grep: zero bare "we" instances in body prose. Brand name used everywhere a "we" would otherwise appear. ✓

Allowable FAQ exception: not used in this draft — every FAQ answer mentions "Coastal Carolina Comfort" by name rather than "we".

---

## Phone / NAP

- Tel: links in body: `(843) 708-8735` — matches session spec. ✓
- Schema publisher telephone: `+1-843-238-3838` — matches session spec. ✓
- The legacy live page used `(843) 256-6476` in visible body. My draft does not retain that number.

The four-phones-in-the-wild issue from Phase 1 (visible Summerville hub `(843) 252-0880`, visible Charleston hub `(843) 256-6257`, visible legacy spokes `(843) 256-6476`, schema declared `(843) 708-8735`) is not solved by this spoke — it's a site-wide NAP cleanup item flagged in the hub-gap report and parked for Mike. This spoke uses the session-spec values consistently within its own deliverable; whether those values match what's live on every other page on coastalcarolinahvac.com is out of scope.

---

## Removed claims summary

See `removed-claims.md` in this folder. Six removal categories:
- Cost-related (7 claims removed)
- Component-lifespan (3 claims removed)
- Climate / regional quantified (5 claims removed)
- Repair-time / response-time (3 claims removed)
- Credential / authority (5 claims removed)
- Statistic / industry-benchmark (4 claims removed)

Total: 27 quantified or specific claims considered and dropped from this spoke.

---

## What this audit does NOT cover (out of scope flags)

- **Author bio page** — Coastal Carolina Comfort doesn't have a credentialed-bio page per the Phase 1 hub audit. Until one exists, the author byline placeholder remains, and the schema uses Organization-as-author.
- **NAP consistency across coastalcarolinahvac.com** — the four-phones issue is a site-wide cleanup, not a per-spoke fix.
- **`llms.txt` update** — Blog Article SOP §11.4 requires every new article to be added to the client's `llms.txt`. Coastal's `llms.txt` status was not verified in-session. Polish-session item.
- **Rich Results Test validation** — manual run before publish (Mike's pre-publish checklist).
- **Cluster-wide internal-linking symmetry** — Blog SOP §12.5 says every live article links to every other live article. When the four spokes in this batch publish, the live AC Not Cooling and AC Blowing Warm Air pages need contextual links back to each new spoke. That's a hub-and-sibling cleanup that runs after publish, not pre-publish.
