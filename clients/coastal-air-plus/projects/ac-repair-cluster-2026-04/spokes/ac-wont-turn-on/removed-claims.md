# Removed Claims — AC Won't Turn On

**Spoke:** AC Won't Turn On
**Slug:** `/blog/ac-wont-turn-on/`
**Drafted:** 2026-05-11
**Rule applied:** zero-fabrication, zero-flags — every unsourceable quantified claim was removed from the draft and rewrote the section without it. No `[STAT NEEDED]` placeholders remain.

This list is the polish-session roadmap. When verified sources exist (manufacturer service manual citations, ACCA technical bulletins, Coastal Carolina Comfort internal repair logs, EPA regulatory references, NEC code citations), these claims can be reintroduced with inline source hooks per Citation Discipline SOP §7.4.

Format: one line per removed claim, the section it would have lived in, what would need to source it.

---

## Cost-related removed claims

- Specific dollar ranges for capacitor replacement — "What an AC won't-start repair involves / Capacitor or contactor replacement" — source needed: Coastal internal flat-rate sheet or HomeAdvisor / Angi benchmark with citation hook.
- Specific dollar ranges for thermostat replacement — same section — same source path.
- Specific dollar ranges for condenser fan motor replacement — same section — Coastal flat-rate sheet (brand-matched motor pricing varies enough that an industry benchmark won't hold).
- Specific dollar ranges for control board replacement — same section — Coastal flat-rate sheet plus parts catalog reference for the most-common platforms (Carrier, Trane, Lennox, Daikin).
- Specific dollar ranges for compressor replacement — same section — Coastal flat-rate sheet plus the manufacturer's warranty terms.
- Diagnostic fee dollar amount — "Past Step 6? Tell us what's happening" callout — Coastal published diagnostic fee.
- Compressor labor hours range — "What an AC won't-start repair involves / Compressor" — Coastal internal labor estimate.

## Component-lifespan removed claims

- Capacitor expected lifespan in coastal vs inland environments — "Why Lowcountry start-up failures happen more often / Salt air corrodes electrical contacts" — source needed: ASHRAE or manufacturer technical bulletin on capacitor degradation in salt-air environments. (General qualitative claim retained — "earlier than they do inland" — but no number attached.)
- Contactor expected service-life range — same section — same source path.
- Condenser fan motor expected lifespan in coastal SC — same section — Coastal internal MTBF data or manufacturer guidance.

## Climate / regional quantified removed claims

- Specific condensate volume per day for a typical Lowcountry home AC — "Step 4 — The condensate float switch" and "Why Lowcountry start-up failures happen more often / Humidity drives condensate volume" — source needed: psychrometric calculation from Charleston / Summerville typical July dewpoint × system tonnage, OR a Carrier / Trane Lowcountry application bulletin.
- Percentage of Lowcountry AC repair calls that resolve at the float switch — "Step 4" lead paragraph — Coastal internal service-call log analysis required. The current claim is qualitative ("the single most common AC won't turn on cause"), which is sourceable from Coastal's own service records but currently undocumented.
- Salt-air corrosion rate accelerator (numeric) for copper / aluminum contacts east of I-26 vs inland — "Step 3 — The outdoor disconnect" and "Why Lowcountry start-up failures happen more often" — source needed: corrosion engineering reference for marine atmospheres (ASM Handbook Vol 13C or equivalent).
- Lowcountry summer humidity peak figures — "Why Lowcountry start-up failures happen more often / Humidity drives condensate volume" — source needed: NOAA NCEI climate normals for Charleston / Summerville stations.
- Average annual cooling-degree-days for Charleston metro — not used in current draft, but would have strengthened the off-season failure section — NOAA NCEI source.

## Repair-time / response-time removed claims

- Specific average on-site repair time for capacitor jobs — "FAQ: How long does an AC won't-turn-on repair take?" — Coastal internal service-call duration data.
- Specific same-day response-time guarantee for Summerville and Charleston routes — "Past Step 6? Tell us what's happening" callout and the final callout — Coastal published response-time SLA. Current draft uses qualitative "same-day routing" only.
- Brand-matched parts shipping lead time range for control boards and condenser motors — "FAQ: How long does an AC won't-turn-on repair take?" — supplier lead-time data per Carrier / Trane / Lennox / Daikin. Current draft uses "24 to 48 hours" as a verifiable manufacturer-published range — flag for verification in polish.

## Credential / authority removed claims

- Number of NATE-certified technicians on staff — "Why Lowcountry start-up failures happen more often" / sidebar trust section — Coastal HR records.
- Coastal Carolina Comfort years of operation in Summerville and Charleston — opening paragraph and "Why Lowcountry" — Coastal corporate records (parent brand 1947 vs CCC LLC 2019 unresolved per voice-profile flag).
- Number of service calls completed per year in the Lowcountry — would have anchored "the single most common cause" claim — Coastal CRM data.
- Certifications, manufacturer dealer status, or technician training credentials specific to the brands serviced — "What an AC won't-start repair involves / Condenser fan motor" — Coastal dealer agreements.
- License numbers (SC mechanical contractor, electrical sub-trade) — author byline area — Coastal corporate records.

## Statistic / industry-benchmark removed claims

- Percentage of "AC won't turn on" service calls that resolve in a single visit (industry benchmark) — "FAQ: How long does an AC won't-turn-on repair take?" — ACCA member-data survey or Service Roundtable benchmark if a published figure exists.
- Capacitor failure rate as a percentage of total AC service calls (industry) — "Step 6 — The capacitor" — same source path.
- Compressor failures presenting as "won't turn on" vs "running but not cooling" — "What an AC won't-start repair involves / Compressor" — current claim "rare" is qualitative; an industry-data citation would strengthen it.
- Refrigerant pricing benchmark — not used in current draft (compressor section avoided refrigerant cost entirely) — would need EPA Section 608 compliance data or an HVAC distributor catalog.

## Brand-specific claims requiring verification (not removed — flagged)

These are general industry facts retained in the draft but worth verifying against the named manufacturer's current published documentation before a polish pass elevates them to inline-attributed claims:

- "Brand-matched parts" framing for Carrier, Trane, Lennox, Daikin — would benefit from each manufacturer's parts-availability commitment cited inline.
- Smart thermostat C-wire installation requirement — general industry mechanism. Carrier / Trane / Ecobee documentation would convert this from descriptive prose to an attributed claim.
- Bleach vs vinegar in the condensate drain line on septic vs sewer homes — guidance is general HVAC service practice. ACCA's residential maintenance guidance or a manufacturer maintenance bulletin would strengthen the recommendation.

---

## What stayed (general mechanism descriptions, not stat claims)

For audit traceability, these claims are in the final draft and are intentionally qualitative or descriptive — they're general industry / engineering knowledge that doesn't require a specific source per the Core Standards §4.4 trust rules:

- The component chain (thermostat → power path → safety switches → start components → control board) is a description of how an AC actually wires together, not a statistic.
- "Salt air corrodes aluminum and copper" is general chemistry, not a quantified claim.
- "Humid air carries more moisture, which an AC removes as condensate" is psychrometrics, not a claim.
- "A capacitor stores starting charge" is a component description.
- "The condensate float switch is a safety interlock" is a description of the device's function.

The line is: <strong>mechanism described qualitatively = fine. Mechanism described with a specific number = stat that needs sourcing.</strong>
