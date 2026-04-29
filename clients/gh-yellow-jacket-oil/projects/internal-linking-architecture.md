# Internal Linking Architecture — Yellow Jacket Oil Tools Phase 1

**Source:** `projects/cluster-map.md` (32 deliverables)
**Last updated:** 2026-04-28
**Status:** Architecture only — link copy, anchor text, and final URL slugs are pre-production drafts. All anchor text and final URLs require Kelly's approval before publishing.

---

## Purpose

Define the link relationships between the 32 Phase 1 pieces so that:

1. Each pillar accumulates topical authority from its spokes.
2. Each spoke earns context from its pillar and depth from glossary terms.
3. The glossary functions as a definitional substrate that AI systems can cite in isolation while still pulling readers back into the cluster.
4. Cross-cluster bridges exist where an engineer's real workflow crosses topics (plug-and-perf is the canonical example) — but bridges are deliberate, not promiscuous.

This document does not draft on-page copy. It maps the graph.

---

## Working URL Pattern (Provisional)

Until CMS access is confirmed and Kelly approves the URL structure, treat these as placeholders:

- Pillars: `/learn/{cluster-slug}/`
- Spokes: `/learn/{cluster-slug}/{spoke-slug}/`
- Glossary: `/glossary/{term-slug}/`

Slugs follow keyword form (kebab-case). Final slugs route through Kelly before publication.

---

## Cluster Hubs

| Cluster | Pillar # | Pillar Title | Spokes | Glossary Anchors |
|---|---|---|---|---|
| 1 — Perforating Gun Systems | 1 | The Complete Guide to Perforating Guns | 2, 3, 4, 5, 6, 7, 8 | 21, 23, 26, 28, 30, 31 |
| 2 — Frac Plug Technology | 9 | Complete Guide to Frac Plugs | 10, 11, 12, 13, 14, 15, 16 | 22, 25, 29, 32 |
| 3 — Wireline & Completions | 17 | Wireline Operations | 18, 19, 20 | 24, 27 |

---

## Cluster 1 — Perforating Gun Systems

### Hub: #1 Pillar — The Complete Guide to Perforating Guns

**Outbound (must link):**
- All 7 cluster-1 spokes (#2–#8) from in-body sections that introduce each sub-topic
- Glossary anchors for first-mention of: perforating gun (#21), shaped charge (#23), shot density (#26), oriented perforating (#28), TCP perforating (#30), casing collar locator (#31)
- Cross-cluster: #13 plug-and-perf spoke (the operational context for perforating)
- Cross-cluster: #17 wireline operations pillar (conveyance overview)

**Inbound (link target from):**
- Every spoke #2–#8 (back-link to pillar from intro)
- Cluster-2 pillar #9 (single contextual link for plug-and-perf cross-reference)
- Cluster-3 pillar #17 (when wireline conveyance discusses perforating)
- Glossary entries #21, #28 — "see also: complete perforating gun guide"

### Spokes

| # | Title | Outbound Links | Inbound Links |
|---|---|---|---|
| 2 | Hollow Carrier vs. Expendable Guns | Pillar #1; spoke #5 (shaped charge); spoke #7 (manufacturers); glossary #21 | Pillar #1; spokes #4, #7 |
| 3 | Oriented Perforating | Pillar #1; spoke #8 (shot density); cluster-2 spoke #13 (plug-and-perf); glossary #28 | Pillar #1; spokes #4, #8; glossary #28 |
| 4 | Wireline vs. TCP Perforating | Pillar #1; spoke #2 (carrier types); spoke #3 (oriented); cluster-3 pillar #17 (wireline operations); glossary #27 (wireline), #30 (TCP) | Pillar #1; cluster-3 pillar #17; glossary #27, #30 |
| 5 | Shaped Charges Explained | Pillar #1; spoke #2 (carrier types); spoke #8 (shot density); glossary #23 | Pillar #1; spokes #2, #8; glossary #23 |
| 6 | Perforating Gun Safety | Pillar #1; spoke #4 (conveyance); spoke #7 (manufacturers); glossary #21 | Pillar #1; spoke #7 |
| 7 | How to Choose a Perforating Gun Manufacturer | Pillar #1; spoke #2 (carrier types); spoke #6 (safety); cluster-2 spoke #16 (frac plug companies — counterpart decision framework) | Pillar #1; spokes #2, #6; cluster-2 spoke #16 |
| 8 | Shot Density & Phasing | Pillar #1; spoke #3 (oriented); spoke #5 (shaped charges); glossary #26 | Pillar #1; spokes #3, #5; glossary #26 |

---

## Cluster 2 — Frac Plug Technology

### Hub: #9 Pillar — Complete Guide to Frac Plugs

**Outbound (must link):**
- All 7 cluster-2 spokes (#10–#16) from in-body sections
- Glossary anchors for first-mention of: frac plug (#22), plug and perf (#25), composite frac plug (#29), frac ball (#32)
- Cross-cluster: #1 perforating gun pillar (operational pairing context)
- Cross-cluster: #13 plug-and-perf spoke is the canonical bridge — this is the workflow that joins clusters 1 and 2

**Inbound (link target from):**
- Every spoke #10–#16 (back-link from intro)
- Cluster-1 pillar #1 and spoke #3 (oriented perforating) for the plug-and-perf bridge
- Cluster-3 pillar #17 (when stage isolation discussion requires frac plug context)
- Glossary entries #22, #25, #29

### Spokes

| # | Title | Outbound Links | Inbound Links |
|---|---|---|---|
| 10 | Composite vs. Dissolvable Frac Plugs | Pillar #9; spoke #11 (dissolvable deep-dive); spoke #12 (hybrid); glossary #29 (composite) | Pillar #9; spokes #11, #12, #16 |
| 11 | Dissolvable Frac Plug Technology | Pillar #9; spoke #10 (composite comparison); spoke #15 (failure modes); glossary #22 | Pillar #9; spokes #10, #12, #16 |
| 12 | Hybrid Frac Plugs | Pillar #9; spoke #10; spoke #11; glossary #22, #29 | Pillar #9; spokes #10, #11, #16 |
| 13 | Plug-and-Perf Completions | Pillar #9; spoke #14 (setting tool); cluster-1 pillar #1; cluster-1 spoke #3 (oriented); cluster-3 spoke #20 (multi-stage); glossary #25 | Pillar #9; spokes #14, #15; cluster-1 pillar #1; cluster-3 pillar #17, spoke #20 |
| 14 | Frac Plug Setting Procedures | Pillar #9; spoke #13 (plug-and-perf); cluster-3 pillar #17 (wireline); glossary #27 (wireline), #25 (plug and perf) | Pillar #9; spoke #13; cluster-3 pillar #17 |
| 15 | Frac Plug Failures: Root Causes | Pillar #9; spoke #10 (material trade-offs); spoke #11 (dissolvable considerations); spoke #16 (vendor selection) | Pillar #9; spoke #16 |
| 16 | How to Choose a Frac Plug | Pillar #9; spoke #10; spoke #11; spoke #12; spoke #15 (failure-mode considerations); cluster-1 spoke #7 (perforating gun manufacturer counterpart) | Pillar #9; cluster-1 spoke #7 |

---

## Cluster 3 — Wireline & Completions

### Hub: #17 Pillar — Wireline Operations

**Outbound (must link):**
- All 3 cluster-3 spokes (#18–#20)
- Glossary anchors for first-mention of: bridge plug (#24), wireline (#27)
- Cross-cluster: #1 perforating gun pillar (wireline-conveyed perforating)
- Cross-cluster: #4 wireline vs. TCP spoke (conveyance comparison)
- Cross-cluster: #14 frac plug setting tool (wireline-set frac plug deployment)
- Cross-cluster: #13 plug-and-perf (the operations workflow)

**Inbound (link target from):**
- Spokes #18, #19, #20 (back-link from intro)
- Cluster-1 spoke #4 (wireline vs. TCP)
- Cluster-2 spoke #13 (plug-and-perf), #14 (setting procedures)
- Glossary #27

### Spokes

| # | Title | Outbound Links | Inbound Links |
|---|---|---|---|
| 18 | Well Completion Types | Pillar #17; spoke #19 (bridge plug isolation); spoke #20 (multi-stage); cluster-2 spoke #13 (plug-and-perf as completion method) | Pillar #17; spoke #20 |
| 19 | Bridge Plug Applications | Pillar #17; spoke #18 (completion context); cluster-2 pillar #9 (frac plug vs. bridge plug distinction); glossary #24 | Pillar #17; spoke #18; glossary #24 |
| 20 | Multi-Stage Completion Optimization | Pillar #17; spoke #18 (completion types); cluster-1 pillar #1 (perforating per stage); cluster-2 spoke #13 (plug-and-perf as the multi-stage workflow); cluster-2 pillar #9 (plug selection per stage) | Pillar #17; spoke #18; cluster-2 spoke #13 |

---

## Glossary Linking Rules

Glossary entries are short definitional pages. Their internal-link role:

- **Each glossary entry must back-link** to the pillar(s) where the term is most central, and to 1–2 spokes that show the term in operational context. No more than 4 outbound links per glossary entry to keep them tight and citation-friendly.
- **First mention of any glossary term in any pillar or spoke must link to the glossary entry.** This is enforced editorially, not optionally.
- Glossary entries should not link to each other unless the relationship is direct (e.g., #25 plug and perf → #29 composite frac plug is allowed because plug-and-perf operations require frac plugs; #27 wireline → #30 TCP is allowed as the conveyance contrast).

| # | Term | Primary Hub | Secondary Spokes (max 2) | Cross-Glossary (allowed) |
|---|---|---|---|---|
| 21 | Perforating Gun | #1 | #2, #6 | #23 (shaped charge), #28 (oriented) |
| 22 | Frac Plug | #9 | #10, #11 | #25 (plug and perf), #29 (composite) |
| 23 | Shaped Charge | #1 | #5, #8 | #21 |
| 24 | Bridge Plug | #17 | #19 | #22 (frac plug — disambiguation: bridge ≠ frac) |
| 25 | Plug and Perf | #9 | #13, #14 | #22, #29 |
| 26 | Shot Density | #1 | #8 | #28 (oriented), #23 (shaped charge) |
| 27 | Wireline | #17 | #4, #14 | #30 (TCP — conveyance contrast) |
| 28 | Oriented Perforating | #1 | #3, #8 | #21, #26 |
| 29 | Composite Frac Plug | #9 | #10, #12 | #22, #25 |
| 30 | TCP (Tubing Conveyed Perforating) | #1 | #4 | #27 |
| 31 | Casing Collar Locator | #1 | #4, #6 | #27 |
| 32 | Frac Ball | #9 | #11, #12 | #22, #29 |

---

## Cross-Cluster Bridges (The Critical Edges)

These edges are the difference between three siloed clusters and one integrated knowledge graph. AI systems reward graph density at topical intersections.

| Edge | Type | Why It Exists |
|---|---|---|
| #1 ↔ #9 | Pillar ↔ Pillar | Perforating guns and frac plugs are the two halves of a plug-and-perf job. Each pillar must have a clearly-marked section that links to the other. |
| #13 → #1, #3, #17, #20 | Spoke fan-out | Plug-and-perf is the single most central node in the entire graph. It is the workflow that uses both clusters simultaneously. Treat #13 as the hub of hubs. |
| #4 ↔ #17 | Spoke ↔ Pillar | Wireline vs. TCP is a conveyance discussion. The Wireline Operations pillar is the natural counterpart. |
| #14 ↔ #17 | Spoke ↔ Pillar | Frac plug setting requires wireline conveyance. |
| #20 ↔ #1, #9, #13 | Spoke ↔ multiple | Multi-stage optimization is where stage count, frac plug selection, and perforating decisions all collide. |
| #7 ↔ #16 | Spoke ↔ Spoke | Vendor selection frameworks share evaluation logic across both product lines. Linking these signals "decision framework" topical authority on both sides. |
| #11 → #15 | Spoke → Spoke | Dissolvable plug performance and failure-mode analysis are the same conversation in different framings. |

**Rule:** Every cross-cluster link should answer the question "would an engineer reading this actually click this next?" If not, drop it. Do not pad cross-cluster links for "internal linking" sake — Google Quality Rater guidelines and AEO citation patterns penalize navigational filler.

---

## Anchor Text Guidance (Non-Final)

- Use the target page's primary keyword or a close natural variant as anchor text where it reads naturally. No exact-match anchor stuffing — vary by intent.
- Glossary back-links: anchor on the term itself ("composite frac plug").
- Pillar back-links from spokes: anchor on the topical phrase, not the page title ("perforating gun selection guide" not "Click here for our complete guide").
- Cross-cluster bridges: anchor on the action verb or workflow phrase ("setting a frac plug with wireline", "perforating between stages") to signal contextual relevance.

Final anchor text approval routes through Kelly with the article draft.

---

## Link-Build Sequence (Production Order Implication)

Internal links cannot exist before their targets exist. Recommended production sequence so links go live as soon as content is published:

1. **Wave 1 — Pillars first (#1, #9, #17).** Pillars are the gravity wells. Spokes can stub-link to pillars while pillars are still in review, but pillar pages must be live (or in CMS draft with final URL locked) before spoke production starts.
2. **Wave 2 — Glossary (#21–#32).** Short, fast to produce, definitional. Build them next so spokes can link to real glossary URLs at first publish, not retroactively.
3. **Wave 3 — Spokes by cluster.** Cluster 1 spokes #2–#8, then Cluster 2 #10–#16, then Cluster 3 #18–#20. Within each cluster, build #13 (plug-and-perf) early — it is the densest cross-cluster bridge node.
4. **Wave 4 — Backlink reconciliation.** After all 32 are published, audit pillar pages for missing back-links from late-arriving spokes and add them.

This sequence is provisional. Final wave order routes through Kelly + the production calendar Kelly is building for her management presentation.

---

## Open Questions for Kelly

- URL structure approval: `/learn/{cluster}/{spoke}/` vs. `/{cluster}/{spoke}/` vs. flat `/articles/{slug}/`
- Glossary location: `/glossary/{term}/` vs. embedded in pillar tables of contents vs. both
- Anchor-text policy for E-E-A-T author bios: do author bio pages exist? (Per `assets.md`, Engineer / Sales Lead / Kelly bios are still to-build.)
- Whether existing G&H site pages should be linked into this graph (e.g., M1NT product pages, perforating gun product pages) — this depends on CMS access and Kelly's preference for keeping editorial content separate from product pages.
