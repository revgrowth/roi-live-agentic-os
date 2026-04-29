# AEO Opportunity Map — Yellow Jacket Phase 1 Keywords

**Source:** Cached DataForSEO SERP Organic Live Advanced (`projects/raw/serp/`)
**Method:** AI Overview presence + citation domains parsed per keyword, joined against tracked competitor and G&H domains.
**Run date:** 2026-04-29
**Deliverables analyzed:** 32

## Classification

Every deliverable is classified into one of these lanes (a single keyword can hit multiple — order is by urgency):

1. **PRIORITY (Repeat Precision in AIO).** Repeat Precision is the engagement's declared urgency driver. Any keyword where they are cited in the AI Overview is a top-priority production target.
2. **PRIORITY (Other tracked competitor in AIO).** WellBoss, DynaEnergetics, or Hunting Titan are cited. Same urgency logic but slightly lower than Repeat Precision per the engagement brief.
3. **G&H BASELINE (`ghdiv.com` already cited).** G&H is in the AIO citation set. Defend, refresh, and add depth.
4. **OPEN LANE (AIO present, no tracked competitor cited).** AI Overview exists but none of the four tracked competitors hold it. Win-it-first opportunity.
5. **NO-AIO LANE (no AI Overview present).** Traditional organic SEO play; AEO not active here yet but worth claiming early — Google adds AIO to keywords incrementally.

## ⚠️ Intent Ambiguity Flags

On these keywords, the AI Overview's citation set is dominated by domains from a different industry — meaning Google currently interprets the keyword for a non-oilfield audience. Targeting these for AEO requires either keyword refinement (longer-tail, e.g. `oilfield frac plug` instead of `frac plug`) or accepting that organic SEO may rank but AIO citations will not flow until intent shifts.

**`hard` = AIO contains zero oilfield-relevant domains. Treat as a strong signal to refine the target keyword before producing content.**

| # | Keyword | Title | Non-oilfield share | Likely interpretation | Hard? |
|---:|---|---|---:|---|:---:|
| 9 | `frac plug` | Complete Guide to Frac Plugs | 71% | Coral / saltwater aquarium | YES |
| 26 | `shot density` | Shot Density | 57% | Hunting / shotgun ammunition | YES |

**Strategic implication.** Targeting these head-term keywords for AEO at face value is leverage-poor. Recommended actions: (1) re-target with oilfield-qualifying long-tail variants (`frac plug for completions`, `shot density perforating`, `oilfield wireline`), (2) keep the head-term page for organic SEO leverage but do not measure AEO citation share against it until the AIO interpretation shifts, (3) flag this in the next Kelly review — these are SOW-committed deliverables and the keyword choice may need adjustment.

## Headline Counts

| Lane | Count |
|---|---:|
| PRIORITY — Repeat Precision in AIO | 5 |
| PRIORITY — Other tracked competitor in AIO | 6 |
| G&H baseline (`ghdiv.com` cited in AIO) | 3 |
| OPEN LANE — AIO present, no tracked competitor | 14 |
| NO-AIO — AIO not present in SERP | 7 |
| NO DATA — SERP cache missing | 0 |

**Total:** 32. Note: PRIORITY and G&H BASELINE can overlap — a keyword where both Repeat Precision and `ghdiv.com` are cited counts in both the priority bucket and the baseline.

## PRIORITY 1 — Repeat Precision in AIO

Per the engagement brief, Repeat Precision's growing AI visibility is the urgency driver. Each of these keywords is a content target where displacing or joining the citation set is the strategic goal. Production order should weight these first within their respective clusters, paired with the cluster's pillar so the spoke pulls authority signals from a strong hub.

| # | Cluster | Keyword | Title | AIO Citation Domains |
|---:|---|---|---|---|
| 7 | Perforating Gun Systems | `perforating gun manufacturers` | How to Choose a Perforating Gun Manufacturer | huntandhunt.com, ghdiv.com, osoperf.com, perf.com, dynaenergetics.com, bakerhughes.com, swmtx.com, mordorintelligence.com |
| 8 | Perforating Gun Systems | `shot density perforating` | Shot Density & Phasing | slb.com, glossary.slb.com, iaeme.com, corelab.com, repeatprecision.com |
| 15 | Frac Plug Technology | `frac plug failure` | Frac Plug Failures: Root Causes | onepetro.org, repeatprecision.com, matthewacrump.com, linkedin.com, jpt.spe.org, youtube.com |
| 16 | Frac Plug Technology | `frac plug companies` | How to Choose a Frac Plug | repeatprecision.com, halliburton.com, wildcatoiltools.com, atlasfibre.com, ghdiv.com, youtube.com, thewellboss.com, rockwestcomposites.com |
| 22 | Glossary | `frac plug definition` | Frac Plug | repeatprecision.com, halliburton.com, wingoil.com, vertechs.com, youtube.com, eureka.patsnap.com, linkedin.com, tiktok.com |

## PRIORITY 2 — Other tracked competitors in AIO

WellBoss, DynaEnergetics, or Hunting Titan are cited. Strategic priority is real but slightly behind Repeat Precision — these are also AEO-active, but the engagement positions Repeat Precision as the most direct AI-citation threat.

| # | Cluster | Keyword | Title | AIO Citation Domains |
|---:|---|---|---|---|
| 1 | Perforating Gun Systems | `perforating gun` | The Complete Guide to Perforating Guns | epa.gov, ghdiv.com, youtube.com, slb.com, huntingplc.com, indiamart.com |
| 3 | Perforating Gun Systems | `oriented perforating` | Oriented Perforating: Why Placement Precision Matters | halliburton.com, corelab.com, bakerhughes.com, perforators.org, slb.com, sciencedirect.com, youtube.com, huntingplc.com |
| 5 | Perforating Gun Systems | `shaped charge` | Shaped Charges Explained | en.wikipedia.org, explosives.net, apps.dtic.mil, reddit.com, sciencedirect.com, huntingplc.com, ebad.com, dynaenergetics.com |
| 23 | Glossary | `shaped charge` | Shaped Charge | en.wikipedia.org, explosives.net, apps.dtic.mil, reddit.com, sciencedirect.com, huntingplc.com, ebad.com, dynaenergetics.com |
| 28 | Glossary | `oriented perforating` | Oriented Perforating | halliburton.com, corelab.com, bakerhughes.com, perforators.org, slb.com, sciencedirect.com, youtube.com, huntingplc.com |
| 31 | Glossary | `casing collar locator` | Casing Collar Locator | glossary.slb.com, huntingplc.com, welltec.com, instagram.com, weatherford.com, corelab.com, onepetro.org, vigoroiltools.com |

## G&H BASELINE — ghdiv.com already cited in AIO

`ghdiv.com` is already cited by Google's AI Overview on these keywords. This is the floor — content here should be defended (no thin pages, no broken links, schema kept current) and refreshed periodically. Losing one of these baselines is a measurable regression to track in the monthly cron.

| # | Cluster | Keyword | Title | AIO Citation Domains |
|---:|---|---|---|---|
| 1 | Perforating Gun Systems | `perforating gun` | The Complete Guide to Perforating Guns | epa.gov, ghdiv.com, youtube.com, slb.com, huntingplc.com, indiamart.com |
| 7 | Perforating Gun Systems | `perforating gun manufacturers` | How to Choose a Perforating Gun Manufacturer | huntandhunt.com, ghdiv.com, osoperf.com, perf.com, dynaenergetics.com, bakerhughes.com, swmtx.com, mordorintelligence.com |
| 16 | Frac Plug Technology | `frac plug companies` | How to Choose a Frac Plug | repeatprecision.com, halliburton.com, wildcatoiltools.com, atlasfibre.com, ghdiv.com, youtube.com, thewellboss.com, rockwestcomposites.com |

## OPEN LANE — AIO present, no tracked competitor cited

An AI Overview exists but none of the four tracked competitors hold it. These are highest-leverage win-it-first opportunities — comprehensive, well-cited content here can take a citation slot before any tracked competitor moves in. Look at the existing citation domains: who is currently being cited and what kind of source are they (encyclopedia, vendor, journal, .gov)? Match or exceed that source quality.

| # | Cluster | Keyword | Title | AIO Citation Domains |
|---:|---|---|---|---|
| 4 | Perforating Gun Systems | `wireline perforating` | Wireline vs. TCP Perforating | slb.com, bakerhughes.com, youtube.com, horizontalwireline.com, vigoroiltools.com, linkedin.com, facebook.com, en.wikipedia.org |
| 9 | Frac Plug Technology | `frac plug` | Complete Guide to Frac Plugs | youtube.com, bulkreefsupply.com, saltwateraquarium.com, amazon.com, coralvue.com, reefcreators.com, fragbox.ca |
| 11 | Frac Plug Technology | `dissolvable frac plug` | Dissolvable Frac Plug Technology | halliburton.com, vertechs.com, nineenergyservice.com, slb.com, thewellboss.com, youtube.com |
| 13 | Frac Plug Technology | `plug and perf` | Plug-and-Perf Completions | youtube.com, bakerhughes.com, thewellboss.com, linkedin.com, accendoreliability.com, vigoroiltools.com, slb.com, vertechs.com |
| 17 | Wireline & Completions | `wireline operations` | Wireline Operations | en.wikipedia.org, aiu.edu, sciphilconf.berkeley.edu, oilandgasoverview.com, youtube.com, axisofs.com, slb.com, reddit.com |
| 18 | Wireline & Completions | `well completion` | Well Completion Types | water.ca.gov, en.wikipedia.org, epa.gov, wiki.aapg.org, sciencedirect.com, slb.com, youtube.com, jjtamez.com |
| 19 | Wireline & Completions | `bridge plug` | Bridge Plug Applications | bakerhughes.com, alphaoiltools.com, silver-fox.net, slb.com, glossary.slb.com, dloiltools.com, oilfieldserviceprofessionals.com, halliburton.com |
| 21 | Glossary | `perforating gun definition` | Perforating Gun | slb.com, collinsdictionary.com, epa.gov, en.wikipedia.org, glossary.slb.com, linkedin.com, aoghs.org, sciencedirect.com |
| 24 | Glossary | `bridge plug` | Bridge Plug | bakerhughes.com, alphaoiltools.com, silver-fox.net, slb.com, glossary.slb.com, dloiltools.com, oilfieldserviceprofessionals.com, halliburton.com |
| 25 | Glossary | `plug and perf` | Plug and Perf | youtube.com, bakerhughes.com, thewellboss.com, linkedin.com, accendoreliability.com, vigoroiltools.com, slb.com, vertechs.com |
| 26 | Glossary | `shot density` | Shot Density | facebook.com, youtube.com, nwtf.org, ducks.org, syrenusa.com, federalpremium.com, apexmunition.com |
| 27 | Glossary | `wireline` | Wireline | klx.com, bakerhughes.com, fcc.gov, aiu.edu, youtube.com, mcclainoiltools.com, tiktok.com, en.wikipedia.org |
| 30 | Glossary | `tcp perforating` | TCP (Tubing Conveyed Perforating) | youtube.com, slb.com, renegadewls.com, jetresearch.com, perf.com, glossary.slb.com, bighornwireline.com, psemc.com |
| 32 | Glossary | `frac ball` | Frac Ball | bakerhughes.com, craigtechnologies.com, wingoil.com, parker.com, precisionplasticball.com, youtube.com, drakeplastics.com, daviesmolding.com |

## NO-AIO LANE — AI Overview not present in SERP

No AI Overview on this keyword right now. Treat as classic organic SEO play and a forward-looking AEO claim — Google adds AIO to keywords incrementally, so being the strongest organic answer when AIO arrives is the leverage. The internal linking architecture should still pass authority to these pages.

| # | Cluster | Keyword | Title |
|---:|---|---|---|
| 2 | Perforating Gun Systems | `hollow carrier gun` | Hollow Carrier vs. Expendable Guns |
| 6 | Perforating Gun Systems | `perforating gun safety` | Perforating Gun Safety |
| 10 | Frac Plug Technology | `composite frac plug` | Composite vs. Dissolvable Frac Plugs |
| 12 | Frac Plug Technology | `hybrid frac plug` | Hybrid Frac Plugs |
| 14 | Frac Plug Technology | `frac plug setting tool` | Frac Plug Setting Procedures |
| 20 | Wireline & Completions | `multi-stage completion` | Multi-Stage Completion Optimization |
| 29 | Glossary | `composite frac plug` | Composite Frac Plug |

## Suggested Production Order

Production order combining AEO urgency (this map) with the linking architecture's wave plan:

1. **Build pillars first** (#1, #9, #17) regardless of lane — pillars are gravity wells for the entire cluster.
2. **Within each cluster, prioritise PRIORITY 1 spokes** (Repeat Precision in AIO) so the highest-urgency citation displacement happens earliest.
3. **Then PRIORITY 2 spokes** (other tracked competitors in AIO).
4. **Then OPEN LANE spokes** — these are easier wins because no tracked competitor is defending the citation, but they are also less urgent because no defection signal has fired.
5. **G&H BASELINE spokes** require maintenance, not net-new production — schedule refreshes via the Phase 2 retainer's 2-content-refreshes-per-month line.
6. **NO-AIO spokes last** within their cluster — still produce them, but they sit lower on the AEO urgency board.
7. **Glossary entries follow Wave 2** of the linking architecture regardless of AEO classification — they exist to back-link and disambiguate, not to drive AEO citation independently.
