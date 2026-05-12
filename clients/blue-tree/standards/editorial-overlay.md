# Blue Tree Outdoor Living — Editorial Overlay

**Version:** 1.0
**Effective:** 2026-05-12
**Owner:** Jason Spencer (ROI.LIVE)
**Status:** Active for Phase 1 launch and forward

This overlay sits on top of `agency/sops/ROI-LIVE-Agency-Citation-Discipline-SOP-v1.md`. Where the overlay tightens an agency rule, the overlay governs for Blue Tree work. Where the overlay is silent, the agency Citation Discipline SOP governs.

## Inheritance statement

Blue Tree's editorial overlay inherits from the **ROI.LIVE Agency Citation Discipline SOP v1.0**. The agency SOP defines source-tier conventions, attribution patterns, and the universal hallucination ban. This overlay adds:

- A trade-vertical source tier mapping specific to outdoor living, pool construction, landscape architecture, and pesticide application.
- A named review chain matched to Blue Tree's multi-author E-E-A-T model.
- A Blue Tree hallucination catalog covering the 14 most likely fabrication patterns surfaced during voice DNA extraction and brief production.
- A YMYL boundary protocol for pool safety, chemical application, and drainage/grading topics.
- A pre-publication checklist that consolidates Core Standards Phase 18, Citation Discipline SOP, and Blue Tree-specific overrides.

## Source tier mapping

Citations on Blue Tree content must come from sources in this tier order. Higher tiers preferred; lower tiers acceptable when higher-tier sources are not available for the specific claim.

### Tier 1 — Government, academic, primary regulator

- **EPA.gov** — pesticide application standards, mosquito and tick control labeling, water quality
- **PA DEP** (Pennsylvania Department of Environmental Protection) — stormwater management, drainage, watershed regulations applicable to Southeastern PA
- **USDA Plant Hardiness Zone Map** — Zone 6b and 7a definitions, plant suitability
- **Penn State Extension** — turf science, plant disease, integrated pest management, soil testing for the Southeastern PA region
- **CDC** — tick-borne disease prevalence (Lyme, anaplasmosis, babesiosis in PA), mosquito-borne arbovirus surveillance
- **National Weather Service / NOAA** — Southeastern PA climate data, frost-free dates, precipitation norms
- **Local municipality codes** — township-specific impervious surface ordinances, pool permit requirements, variance application procedures (Skippack, Lower Providence, Worcester, Schwenksville, etc.)

### Tier 2 — Trade association, certification body, peer-reviewed industry standard

- **ICPI** (Interlocking Concrete Pavement Institute) — paver installation standards, base preparation specifications
- **APSP** (Association of Pool & Spa Professionals; now PHTA — Pool & Hot Tub Alliance) — pool construction certifications, builder qualifications, water chemistry standards
- **NALP** (National Association of Landscape Professionals) — industry safety standards, certified landscape technician programs
- **PLNA** (Pennsylvania Landscape and Nursery Association) — state-level industry recognition, regional plant standards
- **ANSI / NSPI / NSPF** — pool safety standards, electrical codes for pool equipment
- **IRC / IBC** (International Residential / Building Code chapters adopted by PA) — structural, electrical, plumbing where applicable to outdoor structures
- **Penn State, Rutgers, Temple, Penn College of Technology, Delaware Valley College** — published degree-program curricula referenced for credential validation

### Tier 3 — Manufacturer specification, branded technical documentation

- **Jandy** (Fluidra) — pool equipment specifications, warranty terms, installation requirements
- **A&B Natural Stone** — material specifications, supplier-published technical data
- Plant supplier nursery catalogs — botanical accuracy, hardiness verification
- Other named-supplier documentation used in Blue Tree's installs

### First-party — Blue Tree's own verified data

- **v1.1 §1.6 power statistics** — verbatim use only (43 years, 13 to 14 year tenure, 70 to 90 employees, 8 or more designers, 15 years pool construction, 5 counties)
- **v1.1 §15 proof points library** — testimonials, named client stories, named long-tenure employees
- **Warranty matrix** (v1.1 §7.3) — lifetime structural, 10-year Quality Finish, 3-year Jandy workmanship, 2-year hardscape and electrical, 1-year one-time plant replacement, re-treatment guarantee on pest control
- **Project portfolio** — completed Blue Tree work documented in Drive folder (photo evidence required for case studies)
- **Team credentials** — degrees and certifications verified through v1.1 §3 roster and §14 ghostwriting rules

First-party data is the strongest authority signal Blue Tree carries. Use it whenever a claim involves Blue Tree's own operations.

## Named review chain

Every piece of customer-facing content launches with a named author and a named reviewer matched to topic. Review precedes publication.

| Content topic | Primary author | Required reviewer | Backup reviewer |
|---|---|---|---|
| Pool construction (gunite, shotcrete) | Jeff Mattiola | Mike Wadsworth or John Kostesich | Chad Ochnich |
| Pool equipment (Jandy), water chemistry | Jeff Mattiola | Jérôme Besnard | Mike Wadsworth |
| Pool design process, pricing | Jeff Mattiola | Jérôme Besnard | — |
| Hardscape (patios, walls, fire features) | Chad Ochnich | James Gonczkowski or Justin Ryen | Jeff Mattiola |
| Landscape design, planting, garden | [Lead Designer TBD] | Fred Barberra | Jeff Mattiola |
| Turf care, lawn programs | Mark Peasley | Jeff Mattiola | Fred Barberra |
| Pesticide application (mosquito, tick) | Mark Peasley | Jeff Mattiola | — |
| Drainage and grading | Jeff Mattiola | Chad Ochnich | Mark Peasley |
| Sales process, buyer guides | Jérôme Besnard | Jeff Mattiola | — |

**Solo-reviewer cooling period:** When the primary author and the required reviewer are the same person (which happens when Jeff authors and Jeff is the only available SME on a topic), the content must sit for a minimum of **24 hours** between draft completion and review. Same-day self-review is not acceptable for YMYL topics.

**Reviewer attribution:** Schema `reviewedBy` (Person) and on-page "Reviewed by" credit name the reviewer. Both must match the named author in JSON-LD.

## Hallucination catalog

These are the 14 most likely fabrication patterns when drafting Blue Tree content. Each row names the pattern, the safe replacement, and the verification source.

| # | Hallucination pattern | Safe replacement | Verification source |
|---|---|---|---|
| 1 | "Founded in Skippack" | "Founded in 1983 in Norristown, PA. Headquartered in Skippack since 2008." | v1.1 §1.7 |
| 2 | "40 years in business" / generic decade rounding | "43 years in business (increment annually each January)" | v1.1 §1.6 |
| 3 | "15 year average employee tenure" | "13 to 14 year average employee tenure" | v1.1 §1.6 (B1 errata) |
| 4 | "Seven designers" / "seven degreed designers" | "Eight or more designers and sales professionals on staff" | v1.1 §1.6 (B2 errata) |
| 5 | "Healthy Yard" singular | "Healthy Yards" plural always | v1.1 §10.4, §11.2 |
| 6 | "Outdoor Concierge" | "Premier Outdoor Services" | sitemap v2.1, v1.1 §10.5 |
| 7 | Em dash anywhere | Comma, period, parenthesis, or rewrite | v1.1 §11.3 |
| 8 | "Montgomery County" standalone | Pair with "Southeastern PA" or full five-county list | v1.1 §11.6 |
| 9 | "Lehigh County" or "Berks County" in current service area | Treat as future expansion. Do not list until launch. | v1.1 §11.6 |
| 10 | Pool emergency repair, sprinkler system installation, smart irrigation controllers, standalone hot tub install (S5 pending) | "We don't do that. We refer to a trusted specialist." | v1.1 §7.5, §11.2 |
| 11 | "Element of surprise is minimal" Jeff quote | Removed (V1 errata). Pricing transparency principle stays: "We price transparently. The bid is the price." | v1.1 §2.4, §2.6 (v1.2 cleanup) |
| 12 | Generic award claim (e.g., "award-winning") | Name the award and the year, or omit. PLNA and Suburban Home and Garden specifics pending Maureen. | v1.1 §19 open items |
| 13 | Generic "we" in body copy | Replace with "Blue Tree" or named author voice. Multi-author E-E-A-T model. | v1.1 §14 |
| 14 | Skippack volume claim ("We've installed X pools in Skippack") | Mark `[TBD pending Maureen verification]` until volume claim is verified. | v1.1 §19 open items |

When drafting, scan against this catalog before delivery. The pre-publication checklist below references each row.

## YMYL boundary protocol

Blue Tree content is YMYL on three topic clusters. Elevated standards apply.

### Pool safety

- Drowning risk, electrical safety around water, gas equipment for heaters, and structural integrity of in-ground pools sit in safety-critical territory.
- Cite Tier 1 (CDC, EPA, local township codes) and Tier 2 (APSP/PHTA, NSPI/NSPF, ANSI) sources for any safety claim.
- Disclaimer required on pool construction content: "Township permits, impervious surface calculations, and engineering review may vary by municipality. Project pricing reflects expected permitting in our service area; specific requirements are confirmed during site evaluation."
- Required reviewer: Mike Wadsworth or John Kostesich (pool construction managers, combined 44+ years).
- Never recommend DIY pool electrical work, gas line work, or chemical-system modification. Refer to licensed specialist.

### Chemical application

- Mosquito and tick control, lawn fertilization, and pesticide-related content trigger YMYL standards.
- Cite Tier 1 (EPA, CDC, Penn State Extension) sources for application standards, label compliance, and disease prevalence.
- Disclaimer required on pesticide application content: "Mosquito and tick control includes organic and synthetic options. Discuss program selection with our turf care team based on property characteristics and household sensitivities."
- Required reviewer: Mark Peasley (Turfcare Manager, nearly two decades, Penn State). Jeff Mattiola as backup.
- Never state that a treatment is safe for pets or children without naming the specific product class and citing the EPA tolerance.
- Re-treatment guarantee may be referenced (v1.1 §7.3) but is not a substitute for citation on efficacy claims.

### Drainage / grading

- Drainage solutions, stormwater management, and grading work touch township ordinances, watershed regulations, and structural integrity of adjacent foundations.
- Cite Tier 1 (PA DEP, municipality codes) and Tier 2 (relevant IRC chapters) sources for any code-related claim.
- Disclaimer required on drainage / grading content: "Stormwater management and grading requirements vary by township and watershed designation. Site evaluation determines applicable codes and permitting before installation begins."
- Required reviewer: Chad Ochnich for hardscape-adjacent drainage; Mark Peasley for turf-adjacent drainage.
- Never state that a drainage fix will resolve a foundation issue without naming a licensed structural engineer's role.

## Pre-publication checklist

Every customer-facing piece of Blue Tree content runs through this 13-item checklist before publish. Checklist failures block publication.

1. **Zero em dashes** anywhere in the content (body, headings, captions, alt text, meta).
2. **Brand name discipline.** "Blue Tree Landscaping" appears only in origin story or schema. Body copy uses "Blue Tree Outdoor Living" or "Blue Tree."
3. **Healthy Yards is plural** everywhere it appears. URL is `/healthy-yards/`. Singular form does not appear.
4. **"Outdoor Concierge" does not appear.** Replaced by "Premier Outdoor Services" sitewide.
5. **Geographic phrasing** follows v1.1 §11.6. "Montgomery County" never appears alone.
6. **Founding facts.** "Founded in 1983 in Norristown." Skippack referenced as the 2008 HQ move, never as the founding location.
7. **Tenure numbers.** 43 years in business, 13 to 14 year average employee tenure, 15 years pool construction. No "40 years," no "15 year tenure."
8. **CTA discipline.** Form-first ("Request a Free Consultation"). Phone in footer only. No "Get Started Now" or closer-style CTA.
9. **Voice attribution matches schema.** Named author writes in their own voice per v1.1 §2 and §3. JSON-LD `author` and on-page "Written by" match.
10. **Reviewer named.** JSON-LD `reviewedBy` and on-page "Reviewed by" credit name a reviewer per the review chain table above. For YMYL content, the reviewer matches the topic-specific reviewer.
11. **Solo-reviewer cooling period observed.** If the author and reviewer are the same person on YMYL content, the 24-hour minimum between draft completion and review is logged.
12. **Citations match the source tier mapping.** Every claim that needs a citation has one, in the highest tier available. First-party data (warranty matrix, v1.1 §1.6 power statistics, named clients) is preferred for Blue Tree's own operations.
13. **Hallucination catalog scan.** Run the content against the 14-row catalog above. No row triggers.

## Phase 4 commitment statement

Blue Tree Outdoor Living and ROI.LIVE commit to the editorial discipline codified in this overlay for the Phase 1 launch and all subsequent production. Voice profile v1.2 sign-offs from Jérôme Besnard, Maureen Mattiola, and Jeff Mattiola gate Phase 1 publish. The named review chain, hallucination catalog, and YMYL protocol are not aspirational; they are the production standard.

## Changelog

### v1.0 — 2026-05-12

- Initial publication.
- Inherits from agency Citation Discipline SOP v1.0.
- Source tier mapping covers outdoor living, pool construction, landscape architecture, and pesticide application.
- Named review chain mapped to the 11-person SME roster in v1.1 §3.
- Hallucination catalog seeded with 14 patterns surfaced during voice DNA extraction (v1.1 §1.6, §11.2, §16.1) and brief errata B1, B2.
- YMYL protocol covers pool safety, chemical application, drainage and grading.
- Pre-publication checklist consolidates Core Standards Phase 18, Citation Discipline SOP, and Blue Tree overrides.
