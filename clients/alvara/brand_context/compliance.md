# ALVARA Compliance Reference

Source: Section 8 of `inputs/alvara-context-dump.md`.

ALVARA is a dietary supplement with structure/function claims. Cleared claim categories: stress resilience, cellular energy, immune adaptability, deep sleep. FDA disclaimer is on the product page.

This file is mandatory pre-publication review for any ALVARA content carrying a health-benefit claim, comparative claim, or testimonial. Run the checklist below before shipping.

---

## Pre-publication checklist (grep target — run on every health-benefit content task)

```
[COMPLIANCE-CHECKLIST]
[ ] No claim treats MycoNectar as a treatment, cure, or prevention for any disease
[ ] All health-benefit language uses structure/function framing (e.g. "supports healthy X")
[ ] No claim crosses into FTC violation territory (no "treats," "cures," or unsourced "boosts")
[ ] Comparative claims have a sourced reference filed, or the claim is removed
[ ] Testimonial claims sourced and verified, with substantiation on file
[ ] Reconnection Ritual / Vitality Reclaimed creative routed through high-risk ad-account workflow
[ ] Google Ads supplement certification active for paid Google Shopping / Search
[ ] Meta backup Business Manager access confirmed before high-risk angle launch
[ ] FDA disclaimer present on every page that carries a structure/function claim
[ ] Trademark status confirmed for any term used as a proper noun (ALVARA, MycoNectar, The Nectary)
[ ] Counsel review completed where the trigger list below applies
[/COMPLIANCE-CHECKLIST]
```

If any item fails, the content does not ship. Route to founder review and counsel review before publication.

Grep usage: `grep -A 12 "COMPLIANCE-CHECKLIST" clients/alvara/brand_context/compliance.md`

---

## FDA / FTC red lines

| Claim | Status |
|---|---|
| "Supports healthy testosterone levels" | Compliant |
| "Boosts testosterone" | Gray area |
| "Treats low testosterone" | Violates FTC, triggers warning letters and ad account shutdowns |

Every ad creative, landing page, email sequence, and social post touching health benefits goes through compliance review before publication. Build the regulatory checkpoint into the content approval workflow.

---

## Comparative-claim verification protocol

Active flag: the "3× more potent than competitors" claim appears on the alvara.life homepage as of last review and is unsourced. This needs sourcing or removal before any ROI.live content references it.

Protocol for any comparative claim ALVARA or ROI.live publishes:

1. Identify the comparison brand and the specific claim language
2. Source the supporting evidence (third-party lab test, peer-reviewed publication, or supplier-provided ingredient potency data with chain-of-custody)
3. File the source reference in `inputs/prior-work/compliance/comparative-claims/`
4. If no defensible source exists, route the claim to ALVARA counsel review or remove the claim
5. Do not publish a comparative claim without a documented source on file

---

## Testimonial sourcing protocol

Strong testimonials live on alvara.life as user testimonials ("testosterone went back up," "regulate my moon cycle"). These hold as user-submitted content on the brand's owned channel. Where ROI.live picks up testimonial language for content, the source needs verification. FTC has been active in this category.

Protocol for any testimonial used in ROI.live-produced content:

1. Confirm the testimonial source is a real customer with permission to publish
2. Confirm the result is typical, or carry the FTC-required typicality disclosure ("results not typical")
3. File substantiation (intake form with before/after data and signed contact-permission record) in `inputs/prior-work/compliance/testimonials/`
4. Avoid extracting clinical-sounding language from a user testimonial into ad copy without confirming the underlying mechanism
5. Default position: testimonials live in owned channels. Paid ads do not use them as evidence.

---

## Ad-account risk by campaign angle

The two highest-risk campaign angles for Meta account shutdowns:

- **Angle 01 (Vitality Reclaimed):** testosterone / energy for men
- **Angle 03 (Reconnection Ritual):** couples / libido

Mitigation rules for high-risk angles:

- Separate high-risk angles into dedicated ad accounts
- Slow warm-up with low spend ramp
- Maintain backup Business Manager access at all times
- Write softer in paid channels. Reserve direct claim language for owned channels (email, owned landing pages, founder content).
- Google Ads supplement certification is required across all angles for paid Google Search and Shopping

Other angles (02, 04, 05, 06, 07, 08, 09, 10): not classified in the context dump. Default to standard supplement-compliance posture: Google Ads supplement certification, FDA disclaimer, structure/function claim language. Route any new angle to counsel review where the claim category falls outside the cleared list.

---

## Counsel-review trigger list

Route to ALVARA's counsel before publication when any of the following apply:

- Comparative claim referencing a named competitor brand
- Testimonial language presented as evidence in paid creative
- Structure/function language outside the cleared claim categories (stress resilience, cellular energy, immune adaptability, deep sleep)
- Any new ingredient claim sourced from a non-FDA-cleared mechanism
- Any health claim referencing pediatric, geriatric, pregnancy, or pre-existing-condition populations
- Any B2B or wholesale collateral that carries a different claim profile from DTC content

---

## Trademark filing status

ALVARA, MycoNectar, and The Nectary need trademark filings before traction creates squat risk. Cost: $250-$350 per mark through USPTO. Investor due diligence will ask about IP protection.

| Mark | Status | Owner action |
|---|---|---|
| ALVARA | Filing status TBD | Confirm with Jared |
| MycoNectar | Filing status TBD | Confirm with Jared |
| The Nectary | Filing status TBD | Confirm with Jared |

Open item tracked in `projects/growth/engagement-status.md`.

---

## Compliance review workflow

1. ROI.live drafts the content task
2. Content owner runs the pre-publication checklist at the top of this file
3. Any failed check goes to founder and counsel review
4. Comparative or testimonial claims run through the verification protocols above
5. High-risk angle creative goes through the dedicated-ad-account workflow before launch
6. Approved content ships, with substantiation filed in `inputs/prior-work/compliance/`
