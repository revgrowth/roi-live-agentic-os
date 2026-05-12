# Fractional CMO Dashboard — Blue Tree

**Workstream:** Service line 4 of 11 — Fractional CMO + Growth Strategy Consulting (see `clients/blue-tree/brand_context/services.md`)
**Cadence:** Monthly
**Owner:** Jason Spencer, ROI.LIVE
**Client side:** Jeff Mattiola, Jérôme Besnard, Maureen Mattiola
**Engagement reference:** `clients/blue-tree/context/engagement-status.md`

## Purpose

This is the project workspace for the monthly Fractional CMO dashboard cycle delivered to Blue Tree leadership. It holds SOPs, canonical numbers, source data, and cycle deliverables.

## Folder structure

```
fractional-cmo-dashboard/
├── README.md                          (this file)
├── sops/
│   ├── dashboard-monthly-update-sop-v1.md       (main monthly cycle SOP)
│   └── attribution-standardization-sop-v1.md    (channel attribution rules; merges into main SOP at Phase 2.7)
├── canonical-numbers/                 (reconciled month-end numbers; one folder per cycle)
├── source-data/                       (raw extracts from WhatConverts, CRM, Google Ads, Meta Ads Manager)
└── deliverables/                      (final dashboard outputs and client emails per cycle)
    └── 2026-05/                       (May 2026 cycle)
```

## Workflow per cycle

1. **Source data collection** (Phase 1 of main SOP) — pull WhatConverts CSV, CRM lead export, Google Ads and Meta Ads Manager exports into `source-data/{YYYY-MM}/`.
2. **Attribution standardization** — apply `sops/attribution-standardization-sop-v1.md` rules to normalize source / medium values across WhatConverts and Jérôme's CRM before any aggregation.
3. **Canonical numbers** — produce reconciled monthly numbers in `canonical-numbers/{YYYY-MM}/`; these are the single source of truth for that cycle.
4. **Dashboard refresh** — update the Google Sheet (link [TBD]) tab-by-tab per main SOP Phase 3-5.
5. **Copy refresh** — narrative copy under Stop Slop rules per main SOP Phase 6 and Appendix B.
6. **QA** — main SOP Phase 7.
7. **Client email + delivery** — main SOP Phase 8.
8. **Cycle closeout** — archive deliverable into `deliverables/{YYYY-MM}/` with cycle README per main SOP Phase 9.

## Active open items

- Main SOP v1 and Attribution SOP v1 currently sit as two parallel documents. Merge decision pending Jason: keep parallel (v1 main + v1 attribution-update) or unify into v1.1 at next revision.
- Single-client status — this engagement is the only ROI.LIVE FCMO dashboard cycle in production. Promotion candidate G6 (FCMO Dashboard SOP) holds until a second client demands the cadence; at that point the SOPs migrate to `/agency/sops/`.
- June 2026 cycle target completion: 2026-07-03.

## Status table

| Item | Status | Notes |
|---|---|---|
| Main SOP | Active v1 | See `sops/dashboard-monthly-update-sop-v1.md` |
| Attribution SOP | Active v1 | See `sops/attribution-standardization-sop-v1.md`; first-applied May 2026 cycle |
| May 2026 cycle | Complete (placeholder cycle README) | See `deliverables/2026-05/README.md` |
| June 2026 cycle | Not yet started | Target completion 2026-07-03 |
| Promotion to agency-level | Hold | G6 candidate — single instance |
