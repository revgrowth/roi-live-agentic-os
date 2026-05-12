# Blue Tree — Errata Consolidated Register

**Last updated:** 2026-05-12
**Maintained by:** Jason Spencer
**Authority:** Single source of truth for all known errata across sitemap, briefs, voice profile, and transcripts. Cross-referenced from `engagement-status.md` (Website build section) and the brief production workflow.

## How to use

When working on any Blue Tree deliverable, check this register before touching a source-of-truth file. Items are tagged by domain (S = sitemap, B = brief, V = voice profile, T = transcript) and numbered. Each entry carries: status (Open / Resolved), priority (Hi / Med / Low), affected files, description, resolution path or audit-trail note.

When a new erratum surfaces, add it here and add a one-line breadcrumb in the affected source file pointing back to this register.

## Resolution workflow

1. Surface the erratum in working session; capture here under Open with priority.
2. Route to the right owner (Maureen for client-side facts, Jason for ROI.LIVE methodology, Jérôme for architecture).
3. When resolved, move from Open to the audit-trail section at the bottom with date and ruling.
4. If the resolution cascades (e.g., voice profile change forces sitemap or brief change), document the cascade chain in the audit-trail entry.
5. Production work never goes ahead while a Hi-priority erratum is Open on a touched file.

---

## Open items

### Sitemap errata

| ID | Priority | File | Description | Resolution path |
|---|---|---|---|---|
| S5 | Med | `inputs/sitemap-and-implementation-plan-v2.1.md` Pools cluster row 7 | "Spa & Hot Tub Integration" listed as Pools cluster page. Blue Tree's spa scope is ambiguous (integration with pool yes; standalone hot-tub install [TBD]). | Maureen ruling on scope; if scope-restricted, narrow page positioning to spa-integrated-with-pool only. |
| S6 | Low (no-action) | `inputs/sitemap-and-implementation-plan-v2.1.md` (and 30 creative briefs) | Many internal references use "BT Landscaping" or "Blue Tree Landscaping" as title prefix or doc tag. v1.1 §1.1 allows "Blue Tree Landscaping" in origin story and schema; internal references are not customer-facing. | No action required for internal tooling; flagged for awareness during external-facing copy lifts. |

### Brief errata

_None open. B1 and B2 resolved 2026-05-12 — see Resolved section below._

### Transcript errata

| ID | Priority | File | Description | Resolution path |
|---|---|---|---|---|
| T1 | Low | `inputs/source-materials/voice-transcripts-13-recordings.md` | Recording 8 has a duplicate header at lines 2379 and 2802. The transcript content is intact; only the header is duplicated. | Jason cleanup pass when next touching the transcripts file; no impact on derived voice profile. |

### Pending client decisions

These are not errata in the strict sense (no document is wrong) but are open client-side decisions whose resolution may force document updates:

- **Spa scope** (links to S5): does Blue Tree install standalone hot tubs or only spa-integrated-with-pool? Decision drives sitemap page positioning. (Maureen / Jeff)
- **Skippack volume claim**: pending verification before use per v1.1 §19. (Maureen)
- **PLNA award details**: year and award name pending. (Maureen)
- **Suburban Home and Garden award details**: year and category pending. (Maureen)
- **Lehigh and Berks County expansion timing**: approved but not launched. ICP and positioning copy for those counties is gated. (Maureen / Jeff)

---

## Resolved (audit trail)

### Voice profile errata

| ID | Priority | File | Description | Resolved | Date | Notes |
|---|---|---|---|---|---|---|
| V1 | Hi | `brand_context/voice-profile-full-v1.1.md` §2.4 | "Element of surprise is minimal" listed as Jeff signature phrase. Provenance not traceable to transcripts. | RESOLVED | 2026-05-12 | Removed from signature phrases. v1.2 §2.4 note documents the removal. §2.6 retains the pricing-transparency principle without verbatim quote attribution. |
| V2 | Hi | `brand_context/voice-profile-full-v1.1.md` §4.2 + §16.2 | Same "element of surprise" phrase referenced in §4.2 Core Values row and §16.2 Preferred phrases table. | RESOLVED | 2026-05-12 | §4.2 row replaced with "We price transparently. The bid is the price." §16.2 entry removed. Phase 3 Task 0.2. |
| V3 | Med | `brand_context/voice-profile-full-v1.1.md` §18.12 | Navigation Phases reference pointed to a separate artifact that does not exist. | RESOLVED | 2026-05-12 | Reference neutralized; content absorbed into the main guide. Phase 2B Edit 2 + cascade. |
| V4 | Low | `brand_context/voice-profile-full-v1.1.md` §1 source list | Original source list said "20 completed creative briefs." Actual count is 30 canonical briefs per `creative-briefs/INDEX.md`. | RESOLVED | 2026-05-12 | Updated to "30 canonical" with link to INDEX.md. |
| V5 | Hi | `brand_context/voice-profile-full-v1.1.md` §19 | Version status tagging needed v1.2 marked Current and v1.1 marked Superseded. | RESOLVED | 2026-05-12 | §19 updated; v1.2 marked Current 2026-05-12; v1.1 marked Superseded by v1.2. Phase 3 Task 0.1. |

### Sitemap errata

| ID | Priority | File | Description | Resolved | Date | Notes |
|---|---|---|---|---|---|---|
| S1 | Med | `inputs/sitemap-and-implementation-plan-v2.1.md` | "Healthy Yard" singular appeared in v2.1 sitemap (pillar URL `/healthy-yard/` and references). v1.1 §11.2 mandates "Healthy Yards" plural always. | RESOLVED | 2026-05-12 | Resolved in sitemap v2.2 (2026-05-12). All references replaced with "Healthy Yards" and `/healthy-yards/`. Cascade: pillar URL, operation tag, navigation label, cluster URL prefix, blog category tags, internal linking diagram, deferred-pages note. |
| S2 | Med | `inputs/sitemap-and-implementation-plan-v2.1.md` | "Sprinkler System Installation" listed as Landscapes cluster page (#41 in Phase 1 launch). v1.1 §11.2 bans this as a service not offered. Drip irrigation is the supported service per §10.2. | RESOLVED | 2026-05-12 | Resolved in sitemap v2.2 (2026-05-12). Cluster page removed. Landscapes cluster dropped from 8 to 7. Total cluster count dropped from 29 to 28. Total launch page count dropped from 80 to 79. Cascade: renumbered downstream cluster pages, updated Tier 1 / Tier 2 page-range numbers, updated all "29 / 80" count references in current sections (preserved v2.1 historical change-summary blocks unchanged for audit). Deferred-pages note updated to reflect removal. |
| S3 | Med | `inputs/sitemap-and-implementation-plan-v2.1.md` lines 115, 580 | Jeff Mattiola bio URL listed as `/about/team/jeff-downie/` and `/about/team/jeff-downie/-incorrect`. Should be `/about/team/jeff-mattiola/` per v1.1 §1 identity essentials. | RESOLVED | 2026-05-12 | Resolved in sitemap v2.2 (2026-05-12). Both instances replaced with `/about/team/jeff-mattiola/`. |
| S4 | Low | `inputs/sitemap-and-implementation-plan-v2.1.md` line 118 | Author bio URL spelled "mark-paisley" but v1.1 §3 and brand_context spell "Mark Peasley". | RESOLVED | 2026-05-12 | Resolved in sitemap v2.2 (2026-05-12). All "Paisley" / "paisley" instances replaced with "Peasley" / "peasley" (canonical spelling per v1.1 §3 and parameter sheet §3.4). |

### Brief errata

| ID | Priority | File | Description | Resolved | Date | Notes |
|---|---|---|---|---|---|---|
| B1 | Low | `inputs/source-materials/creative-briefs/why-choose-blue-tree.md` | Brief asserted "15 years" tenure-related stat; v1.1 §1.6 power statistics use 13 to 14 year average tenure. Possible mix-up with 15-year pool construction track record. | RESOLVED | 2026-05-12 | Resolved in brief direct edit (2026-05-12). "15 years" tenure references replaced with "13 to 14 years" per v1.1 §1.6. Frontmatter `last_errata_correction` line added. |
| B2 | Low | `inputs/source-materials/creative-briefs/faqs.md` | Brief referenced "seven degreed designers" in multiple places. v1.1 §1.6 says "8 or more designers and sales professionals on staff." | RESOLVED | 2026-05-12 | Resolved in brief direct edit (2026-05-12). "Seven degreed designers" replaced with "Eight or more designers and sales professionals on staff" per v1.1 §1.6 and §6.1 Tier 2. Frontmatter `last_errata_correction` line added. |

---

## Notes on cascading edits

Phase 3 Task 0.4 authorization permits cascading internal-consistency edits across documents when an erratum is resolved. Document the cascade chain in the audit-trail entry for the resolved item.

When Phase 3 work was executed, the following cascading edits were performed:

- None within Phase 3 Task 1-5 — only fresh-build derivations of context files. v1.1 cleanup (V1, V2, V5) was completed in Task 0 by the main thread before subagent dispatch.

When Phase 4 work was executed (2026-05-12), the following cascading edits were performed:

- **S1 cascade (Healthy Yard → Healthy Yards):** sitemap v2.2 — pillar URL `/healthy-yard/` → `/healthy-yards/`, operation tag label, cluster section header and all 4 cluster row URLs, navigation diagram, deferred-pages section, blog category tags on rows 12 and 13. v1.1 §10.4 and §11.2 were already correct; this aligns the sitemap with the voice profile.
- **S2 cascade (Sprinkler System Installation removed):** sitemap v2.2 — Landscapes cluster row 8 removed; cluster count 8 → 7. Total cluster count 29 → 28 in section header and "Service Cluster Pages (28 pages — pages 26-53)" line. Downstream cluster page numbers renumbered (Pools 26-33 unchanged; Landscapes 34-40 unchanged with row 41 removed; Hardscapes 41-47 shifted down by 1; Healthy Yards 48-51 shifted down by 1; Premier Outdoor Services 52-53 shifted down by 1). County pages 54-58, Tier 1 59-70, Tier 2 71-79 shifted down by 1. Launch total 80 → 79 on the "LAUNCH TOTAL" line and the "Page Count Note" 80-page cap note. "29 launch cluster pages" line in NEXT STEPS § updated to 28. "29 service cluster pages live on Day 1" line in commentary § updated to 28. Deferred-pages note for "Irrigation System Repair" updated to reflect removal. Em dash in same sentence replaced with comma to maintain v1.1 §11.3 compliance.
- **S3 cascade (jeff-downie → jeff-mattiola):** sitemap v2.2 — both instances replaced. Parameter sheet §3.1 already names the corrected URL with an erratum note pointing to S3; that note remains accurate.
- **S4 cascade (Mark Paisley → Mark Peasley):** sitemap v2.2 — bio row name and URL slug corrected. Parameter sheet §3.4 already uses "Mark Peasley" with an erratum note pointing to S4; that note remains accurate. Editorial overlay review chain uses the corrected name.
- **B1 cascade (15 years → 13 to 14 years):** brief direct edit — two "15 years" tenure references replaced. Power statistics in v1.1 §1.6 already correct.
- **B2 cascade (seven → eight or more):** brief direct edit — four "seven degreed designers" references replaced. Power statistics in v1.1 §1.6 already correct.

If a future ruling on S5 (Spa & Hot Tub Integration scope) requires sitemap changes, expect cascades to: the Pools cluster row 7 page positioning copy; any future creative brief on `/pools/spa-hot-tub/`; voice profile §10.1 pool offerings list; parameter sheet 6.7 offerings list.
