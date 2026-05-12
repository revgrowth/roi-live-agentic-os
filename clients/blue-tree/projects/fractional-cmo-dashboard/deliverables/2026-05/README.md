# May 2026 FCMO Cycle — Blue Tree

**Status:** Complete (placeholder cycle metadata; final artifacts to be paste-in by Jason)
**Cycle window:** April 2026 reporting month, delivered early May 2026
**Owner:** Jason Spencer, ROI.LIVE
**Client side:** Jeff Mattiola, Jérôme Besnard, Maureen Mattiola

## Cycle highlights

- **First-applied attribution SOP.** This is the first cycle in which `sops/attribution-standardization-sop-v1.md` was applied end-to-end. The rules corrected a silent misattribution of 3 of 4 Meta Ads pool wins (previously categorized as "Other" because of varying ad-set names used as `medium` values).
- **Case study:** META misattribution — see attribution SOP Rule 1 (Meta Ads paid) for the canonical pattern; ad-set-named medium values (`pool services`, `landscaping services`, `landscaping/hardscaping services`, `new leads ad set`, `landscaping`, `pool`, `paid`, plus `cpc`) all collapse to Meta Ads when source is `facebook`, `fb`, `instagram`, or `ig` and medium is not in the organic/referral/email exclusion set.

## Deliverables checklist (placeholders)

- [ ] `source-data/2026-04/` — WhatConverts CSV, CRM export, Google Ads export, Meta Ads Manager export.
- [ ] `canonical-numbers/2026-04/` — reconciled month-end numbers.
- [ ] Dashboard refresh — Google Sheet tabs updated per main SOP Phase 3-5.
- [ ] Narrative copy — Phase 6, Stop Slop applied.
- [ ] QA pass — Phase 7.
- [ ] Client email — Phase 8.
- [ ] Cycle closeout note — Phase 9.

All artifacts are paste-in pending from Jason's local working files. This README exists so the cycle folder is discoverable and the directory structure is in place.

## References

- `clients/blue-tree/projects/fractional-cmo-dashboard/README.md`
- `clients/blue-tree/projects/fractional-cmo-dashboard/sops/dashboard-monthly-update-sop-v1.md`
- `clients/blue-tree/projects/fractional-cmo-dashboard/sops/attribution-standardization-sop-v1.md`
- `clients/blue-tree/context/engagement-status.md` (FCMO section)
