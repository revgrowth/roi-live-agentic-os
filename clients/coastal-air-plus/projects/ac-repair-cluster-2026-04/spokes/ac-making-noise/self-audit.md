# Self-Audit — AC Making Strange Noises

**Spoke:** AC Making Strange Noises
**Slug:** `/blog/ac-making-noise/` (legacy URL preserved, no 301)
**Drafted:** 2026-05-12
**Mode:** audit-and-fix in-place replacement of live legacy stub (1,437 words, 1 H2, image-alt-text H1, broken canonical `/ac-making-noise/ac-making-noise/`, BlogPosting + Trustindex Organization schema only — same shell profile as batch-2 ac-wont-turn-on)
**Audit pattern:** mirrors batch-2 self-audits

---

## Page-type SOP choice

**Blog Article SOP v1.1** (primary), Citation Discipline SOP v1.0 cross-cutting. Informational intent, AIO presence assumed by proxy (Path B — no paid DataForSEO this session). Cluster strategy classifies this spoke as informational symptom-diagnostic; the live-post existence on coastalcarolinahvac.com confirms HVAC home-AC intent classification.

---

## Stop Slop scan

Zero §8.1 banned-phrase violations. Zero §8.2 banned-structure violations (no binary contrasts, no em-dash reveals, no rhetorical one-word fragments). Rule-of-three check: the lists of three in body prose (cause-categories per sound, decision rules, Lowcountry-failure reasons) are factual enumerations passing §8.2 v1.1 factual-enumeration test. Zero §8.3 voice violations.

Specific banned phrases grep-checked: "lean into", "delve into", "navigate the complex landscape", "robust solution", "at its core", "when it comes to", "the reality is", "it turns out that", "what makes X unique" — none present.

---

## Schema validation (manual)

Three JSON-LD blocks emitted in widget 2:

1. **Article** — uses `@type: Article` (the legacy live page used BlogPosting; Article is the more general type recommended by Blog SOP §8.1). Fixes broken canonical (legacy `/ac-making-noise/ac-making-noise/` → live URL `/blog/ac-making-noise/`). Article-specific `mentions` array (9 entities: blower motor bearings, run capacitor, contactor, refrigerant leak, compressor, high-pressure cutoff switch, EPA Section 608, Summerville, Charleston — none copied from another spoke). `author: Organization` (Coastal Carolina Comfort) — broken `Person: Derrick Hall → /author/revgrowth/` removed (same E-E-A-T fix as batch-2 spokes).
2. **FAQPage** — 6 Qs matching widget 2 visible FAQ one-to-one. Answers verbatim from visible text.
3. **BreadcrumbList** — Home → Blog → AC Making Strange Noises.

**HowTo intentionally omitted.** The diagnostic shape is "match the sound to the cause" — a taxonomy, not a linear procedure. Same schema-shape decision as batch-2 AC Leaking Water Inside, which used the 5-causes taxonomy. HowTo schema fits procedures; this spoke fits Article + FAQPage cleanly. Trade-off: less HowTo-specific AEO surface area, but cleaner schema-to-content semantic alignment.

Schema publisher telephone: `+1-843-238-3838` per session spec.

---

## Elementor widget validity

All standard gates pass: no html/head/body wrappers, scoped CSS (`.ccc-spoke-noise` and `.ccc-spoke-noise-b`), inline styles, semantic HTML (`<article>`, `<section>`, `<h2>`, `<h3>`), tap-to-call format `tel:8437088735`, absolute on-domain URLs.

New style elements vs batch-2 spokes:
- `.ccc-spoke-sound` — bordered card treatment for each sound diagnostic (mirrors the `.ccc-spoke-cause` pattern from batch-2 AC Leaking Water Inside, accent color shifted).
- `.ccc-sound-label` — small pill-shaped label naming each sound (Grinding, Buzzing, etc.) in caps for visual scanability.
- `.ccc-spoke-warning` — red-bordered block for the high-pressure-cutoff safety callout and the electrical-buzzing safety reminder.
- Accent color rust/brown `#946530` — distinct from batch-2 (deep blue, light blue, teal, plum) and from spoke 2 (planned forest green). No adjacent-spoke duplication.

---

## Structural match against batch-2 spokes

| Section | Batch-2 pattern | This spoke |
|---|---|---|
| H1 + Quick Answer | ✓ | ✓ |
| "How to use this diagnostic" / orienting section | n/a (batch 2 used "Why X happens") | ✓ — explicit listening framing since the diagnostic is sound-based |
| Diagnostic body | 7-step procedural (Spokes 1, 2, 4) or 5-cause taxonomy (Spoke 3) | 9-sound taxonomy (similar to Spoke 3's pattern) |
| Should you keep going, or stop and call? | ✓ | ✓ |
| Safety note | ✓ | ✓ (red-bordered block on electrical buzzing + refrigerant hissing) |
| Phone-routing callout | ✓ | ✓ |
| What a repair involves (qualitative scope) | ✓ | ✓ |
| Why Lowcountry X happens more often | ✓ | ✓ |
| Hub-link block (widget 2) | ✓ | ✓ |
| Sibling spoke cards | ✓ 3 cards | ✓ 3 cards (AC won't turn on, AC short cycling, AC frozen evaporator coil) |
| FAQ (6) | ✓ | ✓ |
| Schema | Article + HowTo + FAQPage + Breadcrumb (or Article + FAQPage + Breadcrumb for taxonomy spokes) | Article + FAQPage + Breadcrumb (taxonomy spoke) |

---

## Citation discipline

Per session no-fabrication rule, all unsourced quantified claims removed. See "Removed claims" section below.

Retained claims that need inline-citation polish (sourceable but not yet cited):

- "**EPA Section 608**" refrigerant-handling reference (verifiable at epa.gov; polish task adds the inline hook)
- "**R-22 phased out for new equipment**" (verifiable EPA reference)
- "**R-410A or R-454B**" current-refrigerant identifiers (verifiable manufacturer documentation)
- "**ECM vs PSC blower motors**" component categorization (verifiable HVAC industry standard)
- "**Pollen seasons in Summerville and Charleston**" timing claim — sourceable from National Allergy Bureau / SC DNR pollen reporting

---

## Keyword placement (Blog SOP §7.2)

- **Primary keyword "AC making strange noises"** in H1, schema headline, first 100 words (Quick Answer opens with the sound-to-cause mapping; "AC noise" semantic variants present), FAQ questions. Semantic variants: "AC making noise", "AC strange sound", "AC weird noises", "AC making sounds", "noisy AC", "AC sounds"
- **Primary keyword in first 100 words:** ✓ (Quick Answer block names the symptom and its cluster of causes)
- **Brand name "Coastal Carolina Comfort" in first sentence of body:** ✓ (Quick Answer references "Coastal Carolina Comfort diagnoses each of these on the first visit")

---

## Brand-mention density

Body word count ~2,700 (widget 1 + widget 2 prose, excluding markup/schema). Target per Blog SOP §7.3 / Core Standards §3.2: 1 per 120-140 words ≈ 20 mentions.

Actual: 17 "Coastal Carolina Comfort" + 1 "Coastal" shortform = 18 mentions. Slightly below target but within reasonable variance for a symptom diagnostic that prioritizes mechanism descriptions over brand insertion. Polish task: add 2-3 brand mentions in the "What a repair involves" section to tighten density to ~21.

---

## Expert attribution

Same pattern as batch-2 spokes: `[AUTHOR — Coastal Carolina Comfort technician]` placeholder in visible byline (1 instance); brand-as-expert attribution substitutes throughout. Polish task: convert to named-Person attribution when a credentialed bio page exists.

---

## "We" violation scan

Zero bare "we" instances in body prose. ✓

---

## Phone / NAP

- Tel: links in body: `(843) 708-8735` ✓ per session spec
- Schema publisher telephone: `+1-843-238-3838` ✓ per session spec
- Legacy live page used `(843) 256-6476` in visible body (per Phase 1 audit and the May 12 snapshot). Removed from this deliverable.

The 5-phones-in-the-wild issue from Phase 1 is not solved by this spoke — site-wide NAP cleanup remains a pre-publish item flagged in the hub-gap report.

---

## Removed claims

The polish-session roadmap. Each claim below was considered, would have strengthened the section, and was removed because no source could be verified in-session.

### Cost-related removed claims

- Specific dollar range for capacitor replacement — "What an AC noise repair involves / Electrical repair" — Coastal flat-rate sheet.
- Specific dollar range for contactor replacement — same section — same source.
- Specific dollar range for blower motor replacement (ECM vs PSC split) — "What an AC noise repair involves / Motor or bearing replacement" — Coastal flat-rate sheet + manufacturer parts catalog.
- Specific dollar range for condenser fan motor replacement — same section — same source path.
- Specific dollar range for refrigerant leak repair plus recharge — "What an AC noise repair involves / Refrigerant leak repair plus recharge" — distributor pricing per refrigerant type + Coastal labor.
- Specific dollar range for duct sealing service — "What an AC noise repair involves / Duct sealing" — Coastal flat-rate.
- Diagnostic fee for an AC noise service call — "Localized the sound? Tell us what you heard" callout — Coastal published fee.

### Component-lifespan removed claims

- Blower motor bearing service life under Lowcountry humidity stress — "Why Lowcountry AC systems develop noise problems sooner / Humidity stresses bearings" — manufacturer reliability data or Coastal internal MTBF.
- Capacitor service life under salt-air corrosion conditions — "Why Lowcountry / Salt air accelerates electrical contact corrosion" — corrosion engineering reference for marine atmospheres.
- Outdoor contactor terminal service life vs inland — same section — same source path.
- Older single-stage vs newer variable-speed system noise baseline — "How loud is too loud" FAQ — manufacturer dB ratings would source this.

### Climate / regional quantified removed claims

- Specific Lowcountry pollen-season timing in days/weeks — "Why Lowcountry / Outdoor cabinets accumulate debris fast" — National Allergy Bureau / SC DNR data.
- Specific average annual debris-load on outdoor cabinets in coastal SC vs inland — same section — would require a specialized field study.
- Specific humidity peaks for Summerville and Charleston — would have strengthened "Humidity stresses bearings" — NOAA NCEI station data.

### Industry-benchmark removed claims

- Percentage of AC noise calls resolved at the filter-replacement step (whistling) — "Whistling" sound block — Coastal CRM data or ACCA industry benchmark.
- Percentage of noise calls that originate in the outdoor unit vs indoor air handler — "How to use this diagnostic" section — Coastal CRM analysis.
- Compressor failure modes presenting as banging vs as no-start — "Banging or clanking" sound block + "What sound does a failing AC compressor make?" FAQ — compressor manufacturer warranty data.

### Response-time / SLA removed claims

- Same-day SLA window for Summerville and Charleston routes — final callout + "Get this fixed in your area" — Coastal published SLA.
- Single-visit completion rate for AC noise repairs — qualitative "single-visit repair on most platforms" claim retained; specific percentage removed — Coastal CRM data.

### Credential / authority removed claims

- Number of EPA Section 608 certified Coastal techs — "Refrigerant leak repair" scope section — Coastal HR records.
- Number of NATE-certified techs on staff — would have strengthened the trust framing if included — Coastal HR records.
- Coastal years of operation in Summerville and Charleston — opening paragraph and "Why Lowcountry" — Coastal corporate records (parent brand 1947 vs CCC LLC 2019 timing unresolved).
- Brand-matched parts shipping lead time — "Motor or bearing replacement" scope — Carrier / Trane / Lennox / Daikin distributor SLAs.

### Total

24 quantified claims considered and dropped + 5 retained claims flagged for inline-citation polish = 29 polish-session targets for this spoke.

---

## What stayed (mechanism descriptions, not stat claims)

- "Bearings have a sealed lubricant pack; once that pack fails, the bearings grind" — basic mechanical wear description.
- "Capacitor delivers start charge to the motor" — component function.
- "Refrigerant under pressure escapes through small holes with a characteristic sustained sound" — physics/acoustics description.
- "High-pressure safety switch activates when pressure exceeds design limits" — safety-system mechanism description.
- "Salt air accelerates electrical contact corrosion" — general chemistry, not quantified.
- "Sealed bearings rely on their lubricant pack staying inside the housing" — general mechanical description.

The line: <strong>mechanism described qualitatively = retained. Mechanism described with a specific number = removed.</strong>

---

## Out-of-scope flags

Same as batch-2 spokes:
- Author bio page does not exist; Organization-as-author retained in schema.
- NAP consistency across coastalcarolinahvac.com is a site-wide cleanup item (5 phones in the wild — Phase 1 issue).
- `llms.txt` update is a polish-session item (Blog Article SOP §11.4).
- Rich Results Test validation runs pre-publish.
- Cluster-wide internal-linking symmetry runs post-publish (existing live posts need contextual links back to this updated spoke).

---

## Conclusion

Spoke 1 audit cleared. Legacy 1,437-word shell replaced with a comprehensive ~2,700-word sound-by-sound diagnostic, schema upgraded from BlogPosting+Trustindex-Organization to Article+FAQPage+BreadcrumbList, broken canonical fixed, author resolved to Organization (no fabricated Person), session-spec phones applied, zero `[STAT NEEDED]` flags, 24 unsourced claims removed and tracked. No structural pattern issues that would roll forward to Spoke 2.
