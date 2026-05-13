# Self-Audit — AC Not Blowing Air

**Spoke:** AC Not Blowing Air
**Slug:** `/blog/ac-not-blowing-air/` — **new slug, no legacy post** (404 confirmed via WebFetch)
**Drafted:** 2026-05-12
**Mode:** **draft fresh** (no audit-and-fix delta — this spoke didn't exist live before this session)
**Audit pattern:** mirrors batch-2 + spoke-1 self-audits

---

## Page-type SOP choice

**Blog Article SOP v1.1** (primary), Citation Discipline SOP v1.0 cross-cutting. Informational symptom-diagnostic intent.

**Distinct from `/blog/ac-running-not-cooling/`** (the live comprehensive post about the warm-air overlap symptom). This spoke covers the no-airflow symptom — system runs but vents are silent — which is mechanically distinct from "running but air comes out warm." The intro paragraph names the distinction explicitly so readers route to the correct spoke based on symptom presentation.

---

## Stop Slop scan

Zero §8.1 banned-phrase violations. Zero §8.2 banned-structure violations. Rule-of-three check: the three-item lists in body prose (two underlying conditions, three Lowcountry reasons, repair scope categories) are factual enumerations passing §8.2 v1.1 factual-enumeration test. Zero §8.3 voice violations.

Banned phrases grep-checked: "delve into", "navigate the complex landscape", "robust solution", "seamless experience", "at its core", "when it comes to" — none present.

---

## Schema validation (manual)

Four JSON-LD blocks emitted in widget 2:

1. **Article** — fresh datePublished `2026-05-12` (this is a new post). Article-specific mentions array (9 entities: blower motor, blower capacitor, air filter, evaporator coil, supply ductwork, thermostat fan setting, ECM motor, Summerville, Charleston — none copied from spoke 1 or batch-2 spokes). `author: Organization` per session pattern.
2. **HowTo** — 7 steps matching widget 1's 7-step diagnostic walk-through. `totalTime: PT15M`. `tool` array lists the two items mentioned in the walk-through (replacement air filter, flashlight).
3. **FAQPage** — 6 Qs matching visible FAQ one-to-one.
4. **BreadcrumbList** — Home → Blog → AC Not Blowing Air.

**HowTo IS included for this spoke** (unlike Spoke 1 noises which omitted HowTo). The diagnostic is a linear seven-step procedure, not a branching taxonomy — same shape as batch-2 AC won't turn on, AC frozen evaporator coil, AC short cycling. HowTo schema fits cleanly.

Schema publisher telephone: `+1-843-238-3838` per session spec.

---

## Elementor widget validity

All standard gates pass. New style element vs prior spokes:
- `.ccc-spoke-step` — used for the 7 diagnostic step H3 headings (parallel to batch-2's `.ccc-spoke-step` pattern).
- Accent color forest green `#1f6c3e` — distinct from all prior spokes (deep blue, light blue, teal, plum, rust). No adjacent-spoke duplication.

---

## Structural match against published spokes

| Section | Pattern | This spoke |
|---|---|---|
| H1 + Quick Answer | ✓ | ✓ |
| Distinction-from-overlap paragraph | new for this spoke | ✓ (names the difference from /ac-running-not-cooling/) |
| "Why X happens" framing | ✓ batch-2 | ✓ |
| 7-step linear diagnostic walk-through | batch-2 ac-wont-turn-on / ac-frozen / ac-short-cycling pattern | ✓ |
| Should you keep going, or stop and call? | ✓ | ✓ |
| Safety note | ✓ | ✓ (red-bordered block on opening the blower compartment with power on) |
| Phone-routing callout | ✓ | ✓ |
| What a repair involves (qualitative) | ✓ | ✓ |
| Lowcountry-failure context | ✓ | ✓ |
| Hub-link block | ✓ | ✓ |
| Sibling spoke cards | ✓ 3 cards | ✓ 3 cards (AC frozen evap coil, AC making noise, AC won't turn on) |
| FAQ (6) | ✓ | ✓ |
| Schema | Article + HowTo + FAQPage + BreadcrumbList (procedural diagnostic) | ✓ all 4 schemas |

---

## Citation discipline

Per session no-fabrication rule, all unsourced quantified claims removed. See "Removed claims" section below.

Retained claims that need inline-citation polish:
- "**Pollen seasons (late February through May, secondary peak in fall)**" — sourceable from National Allergy Bureau / SC DNR pollen reporting
- "**ECM vs PSC blower motors**" component categorization — verifiable manufacturer documentation
- "**Lowcountry blowers run more total hours per cooling season**" comparative claim — qualitative as written but would benefit from regional cooling-degree-day comparison data from NOAA NCEI

---

## Keyword placement

- **Primary keyword "AC not blowing air"** in H1, schema headline, first 100 words (Quick Answer mentions "When an AC runs but no air comes from the vents..." — primary phrasing in first sentence). Semantic variants: "no air from vents", "AC running but no air", "AC not blowing", "vents not blowing", "no airflow from AC".
- **Primary keyword in first 100 words:** ✓ (Quick Answer block)
- **Brand name "Coastal Carolina Comfort" in first sentence of body content:** ✓ (Quick Answer references Coastal Carolina Comfort diagnostic order)

---

## Brand-mention density

Body word count ~2,600 (widget 1 + widget 2 prose, excluding markup/schema). Target per Blog SOP §7.3: ~20 mentions.

Actual: 17 "Coastal Carolina Comfort" + 1 "Coastal" shortform = 18 mentions. Same slight-undercount pattern as Spoke 1 — polish task: add 2-3 mentions in the "What a no-airflow repair involves" section to tighten density to ~21.

---

## Expert attribution

Same pattern: `[AUTHOR — Coastal Carolina Comfort technician]` placeholder, brand-as-expert throughout. Polish task.

---

## "We" violation scan

Zero bare "we" instances. ✓

---

## Phone / NAP

- Tel: links: `(843) 708-8735` ✓ per session spec
- Schema publisher: `+1-843-238-3838` ✓ per session spec
- No legacy phone to compare against — this is a fresh draft.

---

## Removed claims

The polish-session roadmap. Each claim was considered, would have strengthened the section, and was removed because no source could be verified in-session.

### Cost-related removed claims

- Specific dollar range for blower capacitor replacement — "What a no-airflow repair involves / Blower capacitor replacement" — Coastal flat-rate sheet.
- Specific dollar range for blower motor replacement (ECM vs PSC split) — same section — Coastal flat-rate + manufacturer parts pricing.
- Specific dollar range for duct repair (flex disconnect, trunk seam, inside-wall) — same section — Coastal flat-rate.
- Specific dollar range for thermostat replacement with C-wire installation — same section — Coastal flat-rate.
- Specific dollar range for control board / ECM controller replacement — same section — brand-specific parts pricing.
- Diagnostic fee — "Past Step 6" callout — Coastal published fee.

### Component-lifespan removed claims

- Blower capacitor service life under Lowcountry humidity / salt-air conditions — "Why Lowcountry / Humidity drives blower bearing wear" — manufacturer reliability data.
- Blower motor service life ECM vs PSC — would have strengthened the "Motor replacement" section — manufacturer published service life.
- Flex duct connection service life in attic temperatures — "Why Lowcountry / Attic ductwork takes a beating" — manufacturer guidance or Coastal internal MTBF.

### Climate / regional quantified removed claims

- Specific Lowcountry attic peak temperatures — "Attic ductwork takes a beating" — NOAA NCEI station + attic-microclimate study.
- Specific Lowcountry cooling-season hours vs inland — "Humidity drives blower bearing wear" — NOAA cooling-degree-day data.
- Specific pollen-season filter-loading rate vs national 60-day standard — "Pollen seasons clog filters faster" — filter manufacturer differential-pressure data + regional pollen counts.

### Industry-benchmark removed claims

- Percentage of no-airflow calls that resolve at the filter step — "Step 2 — Air filter" — Coastal CRM analysis.
- Percentage of no-airflow calls attributable to capacitor failure — "Step 5 — Listen for the blower motor" — Coastal CRM analysis.
- Industry-standard healthy static pressure range for residential systems — "Step 7 — Stop and call" / "Inspect accessible ductwork" — ACCA Manual D reference.

### Response-time / SLA removed claims

- Same-day SLA window for Summerville and Charleston routes — final callout — Coastal published SLA.
- Single-visit completion rate for no-airflow repairs — qualitative "most no-airflow repairs finish in one visit" retained; specific percentage removed — Coastal CRM data.
- Brand-matched part lead time for control boards / ECM controllers — "Control board or ECM controller diagnosis" — distributor lead-time data.

### Credential / authority removed claims

- Coastal years of operation — Coastal corporate records.
- Number of NATE-certified techs on staff — Coastal HR records.
- Dealer status for variable-speed equipment brands — Coastal dealer agreements.

### Total

19 quantified claims considered and dropped + 3 retained claims flagged for inline-citation polish = 22 polish-session targets for this spoke.

---

## What stayed (mechanism descriptions, not stat claims)

- "Return air enters through the return grille, passes through the air filter, crosses the evaporator coil, gets pushed by the blower through the supply ductwork, exits through supply registers" — airflow-loop description, basic HVAC mechanism.
- "Capacitor stores electrical charge to start the motor" — component function.
- "Sealed motor bearings rely on their lubricant pack staying inside the housing" — general mechanical description.
- "Flex duct connections come loose from thermal cycling" — physical mechanism, no quantification.
- "Closing supply registers reduces airflow across the coil and can cause freeze-up" — HVAC airflow principle.

---

## Out-of-scope flags

Same as Spoke 1 and batch-2 spokes:
- Author bio page does not exist; Organization-as-author retained in schema.
- NAP consistency across coastalcarolinahvac.com is a site-wide cleanup.
- `llms.txt` update is a polish-session item.
- Rich Results Test validation runs pre-publish.
- Cluster-wide internal-linking symmetry post-publish: when this spoke ships, update the live `/blog/ac-frozen-evaporator-coil/`, `/blog/ac-making-noise/`, and `/blog/ac-wont-turn-on/` posts to add reciprocal sibling links to `/blog/ac-not-blowing-air/`. (Same for other cluster-peer spokes.)

---

## Conclusion

Spoke 2 audit cleared. New ~2,600-word draft at a fresh slug (`/blog/ac-not-blowing-air/`), distinct from the existing `/blog/ac-running-not-cooling/` (which is the warm-air overlap symptom). Full schema set (Article + HowTo + FAQPage + BreadcrumbList). Session-spec phones applied. Zero `[STAT NEEDED]` flags. 19 unsourced claims removed and tracked.

**Symptom-spoke cohort status:** With this spoke and Spoke 1 drafted, the 8 symptom spokes from the cluster strategy are now complete — AC not cooling, AC blowing warm air (both live pre-batch-2), AC won't turn on, AC frozen evaporator coil, AC leaking water inside, AC short cycling (batch 2), AC making strange noises, AC not blowing air (batch 3).
