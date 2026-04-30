# Green Llama Clean — Scientific Sources

> Approved Tier 1/2 source databases for GLC content production. Reconciled from two source files in the source packages (identical content; URL formatting differed). Last verified: 2026-04-29 (initial reconciliation; per-URL live-resolution check still required — see Open item below).

## Tier 1 sources (preferred)

| Source | URL | Use for |
|---|---|---|
| Environmental Working Group | https://www.ewg.org/ | Healthy Cleaning database, ingredient ratings, consumer-facing hazard guidance |
| EPA Safer Choice | https://www.epa.gov/saferchoice/safer-ingredients | Safer Choice product list, approved ingredient list |
| NCBI PubMed | https://www.ncbi.nlm.nih.gov/ | Peer-reviewed medical and toxicology literature; primary database for any health/safety claim |
| ChemExpo Knowledgebase | https://comptox.epa.gov/chemexpo | Chemical exposure data, EPA's CompTox Chemicals Dashboard |
| PubChem | https://pubchem.ncbi.nlm.nih.gov/ | Chemical structure, biological activity, and toxicity data |

## Verification protocol

Every URL above must be tested against the live site before being cited in published content. Per the agency Citation Discipline SOP §5 (Source Verification Hard Gate):

- Open the URL in a browser within 24 hours of submission
- Confirm the page loads to the cited content
- For agency-specific databases (EPA IRIS, ChemExpo, PubChem): navigate to the cited entry through the site nav rather than trusting an AI-generated path
- Capture a Wayback Machine snapshot at archive.org/wayback for non-DOI sources at the time of verification (per agency SOP §5.6)

## Per-claim sourcing

These root databases are starting points. Every individual claim in published content cites the specific study, report, or chemical entry, not the database root. Per [`sops/GL_Blog_Content_SOP_v1_1.md`](./sops/GL_Blog_Content_SOP_v1_1.md) §Citation Format and the agency Citation Discipline SOP §7, full APA citations with working hyperlinks appear in the article's Sources section.

## Other Tier 1 / Tier 2 sources used in past GL content

Not in the original sources list but referenced by past content production:

- FDA (https://www.fda.gov/) — for any food-contact or cosmetic-overlap claims
- CDC (https://www.cdc.gov/) — public health and household chemical exposure data
- OSHA (https://www.osha.gov/) — occupational exposure data. **Important:** occupational data does NOT extend to household-use claims without a separate household-specific source.
- WHO (https://www.who.int/) — international body for health claims
- FTC Green Guides (https://www.ftc.gov/news-events/topics/truth-advertising/green-guides) — substantiation rules for environmental marketing claims
- Leaping Bunny / Cruelty Free International (https://www.leapingbunny.org/) — certification verification

## Sources expressly NOT acceptable for GLC content

Per [`sops/GL_Blog_Content_SOP_v1_1.md`](./sops/GL_Blog_Content_SOP_v1_1.md) §Source Hierarchy:

- AI-generated summaries (ChatGPT, Claude, Gemini, Perplexity output is a starting point, not a source)
- Wikipedia (acceptable as a starting point only; never as the cited source)
- Marketing blogs from competitors or unrelated brands
- Press releases as the sole source for a scientific claim
- Generic .org sites without named subject authority
- Social media posts as primary sources

## Open item

The original two source-list files in the source packages were identical content with cosmetic URL-formatting differences. This reconciled version is the canonical source list going forward.

**Pending verification (open-items.md item 4):** Each URL above needs a live-resolution check, with a Wayback snapshot captured for non-DOI URLs. EPA paths in particular restructure regularly. The verification date at the top of this file should be updated when that check completes.

If new Tier 1/2 sources are vetted and added to GLC content production, append them above and note the date.
