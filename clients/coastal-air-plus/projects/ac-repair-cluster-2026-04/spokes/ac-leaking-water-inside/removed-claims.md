# Removed Claims — AC Leaking Water Inside

**Spoke:** AC Leaking Water Inside
**Slug:** `/blog/ac-leaking-water-inside/`
**Drafted:** 2026-05-11
**Mode:** delta refresh of comprehensive existing live page (~3,557 words, Derrick Hall byline, 2026-03-17 publish)
**Rule applied:** zero-fabrication, zero-flags

Unlike Spokes 1 and 2 (where the legacy live posts were content shells), this spoke's legacy live page contained substantive body copy with several quantified claims that needed to be removed under the session no-fabrication rule. The removals below are the deltas from the existing live page that ship in the new draft.

---

## Quantified claims removed from the existing live page

### From the existing live lead paragraph
- "**5–20 gallons of condensate per day during peak summer**" — `/blog/ac-leaking-water-inside/` existing live page opening — removed. The exact daily condensate volume depends on system tonnage, run time, and outdoor dewpoint; the existing claim was not sourced and the range is wide enough to imply false precision. Replaced with qualitative "high volume" / "meaningful volume" framing.
- "**Significantly more moisture from the air than systems in drier regions**" — retained as qualitative ("significantly more" is comparative-qualitative, not a stat) but the comparative claim would benefit from inline psychrometric citation in polish.

### From the existing live "Why South Carolina Homes See More AC Water Leaks" section
- Any percentage figure on Lowcountry humidity averages — if present in the existing live page, would need NOAA NCEI sourcing.
- Any annual cooling-season days count for the Charleston/Summerville metro — same NOAA source path.

### Cost-related (likely in the existing live page; explicitly omitted in new draft)
- Specific dollar range for drain line clearing — "What an AC water-leak repair involves / Drain line clearing" — Coastal flat-rate sheet.
- Specific dollar range for drain pan replacement — "What an AC water-leak repair involves / Drain pan replacement" — same source.
- Specific dollar range for condensate pump replacement — same — same source.
- Diagnostic fee for a water-leak service call — "Past these causes? Tell us what's happening" callout — Coastal published fee.

### Component-lifespan claims
- Drain pan rust-through service life (galvanized vs plastic) — "2. Cracked or rusted drain pan" — would need manufacturer durability data or Coastal internal MTBF.
- Condensate pump expected service life — "5. Condensate pump failure" — manufacturer published data per Little Giant, Diversitech, etc.
- Algae buildup rate in coastal SC condensate lines — "1. Clogged condensate drain line" — would need a microbiology source or Coastal internal service-history analysis.

### Statistic / industry-benchmark claims
- Percentage of water-leak calls that resolve at the drain line clearing step — "1. Clogged condensate drain line" — Coastal internal service-call log analysis. Current framing "single most common cause" is qualitative.
- Mold-onset time after a sustained leak in coastal humidity — "Should I be worried about mold from an AC leak?" FAQ and "When an AC water leak becomes an emergency" — current "24 hours" threshold is general industry guidance but is sourceable from CDC, EPA, or IICRC water damage classification standards.

### Response-time claims
- Specific same-day SLA window for Summerville and Charleston routes — final callout — Coastal published SLA.

---

## Claims retained that need verification before polish

These are in the new draft and represent general HVAC service practice or factual statements, but they would benefit from inline source hooks in the polish pass to clear Citation Discipline SOP §7.4:

- **"Bleach in the drain line can disrupt septic biology"** — "1. Clogged condensate drain line" — general septic-system maintenance guidance. EPA or local health department septic guidance would source this directly.
- **"Pollen seasons run heavy from late February through May, with a secondary peak in fall"** — "How to prevent AC water leaks in the Lowcountry" — sourceable from National Allergy Bureau / SC Department of Natural Resources pollen reporting.
- **"24 hours" mold-onset threshold** — "Should I be worried about mold from an AC leak?" — IICRC S500 water damage standard or EPA mold guidance.

---

## What stayed (mechanism descriptions, not stat claims)

- "Evaporator coil runs below dewpoint of return air, condensation forms" — psychrometrics, no source needed.
- "Algae thrives in warm dark wet conditions" — basic microbiology.
- "Drainage path: drain pan → condensate line → optional pump → exit point" — system description.
- "Float switch triggers shutdown when pan fills" — component description.
- "Plastic vs galvanized drain pan failure modes" — material engineering description.

---

## Structural delta from existing live page

Beyond claim removals, the new draft differs from the live page in these structural ways:

| Element | Existing live | New draft |
|---|---|---|
| H1 | "Why Is My AC Leaking Water Inside My House?" | "Why Is My AC Leaking Water Inside My House? A Lowcountry Diagnostic Guide" — added the Lowcountry positioning to differentiate from generic competitors |
| Author | Person: Derrick Hall → /author/revgrowth/ (broken bio URL) | Organization: Coastal Carolina Comfort — same E-E-A-T fix as Spokes 1 and 2 |
| Schema canonical | Likely had the doubled-slug pattern observed on Spokes 1 and 2 | Fixed to `/blog/ac-leaking-water-inside/` |
| Schema types | Likely BlogPosting + Trustindex Organization only | Article + FAQPage + BreadcrumbList — HowTo intentionally omitted since the diagnostic is "identify which of 5 causes" rather than a linear procedure |
| Hub-link block | May be absent or inconsistent | Both Summerville and Charleston as absolute URLs in widget 2 |
| Sibling spokes | "Related Reading" section unknown structure | 3 sibling cards (AC frozen evap coil, AC won't turn on, AC not cooling) — cluster-aware selection |
| Visible byline | Derrick Hall | `[AUTHOR — credentials TBD]` placeholder |
