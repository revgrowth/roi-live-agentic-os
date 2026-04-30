# ROI.LIVE Agency Citation Discipline SOP
**Version:** 1.0 — April 2026
**Applies to:** Every piece of content produced by ROI.LIVE that contains factual claims, statistics, study references, or external attributions — on any client website, in any channel
**Owner:** Jason Spencer, Founder — ROI.LIVE
**Inherits from:** ROI.LIVE Agency Core Standards v1.1 (Phase 4 E-E-A-T, Phase 8 Stop Slop, Phase 16 Quality Gates)
**Status:** Cross-cutting SOP. Applies in addition to the page-type SOP for the content being produced. When a page-type SOP requires citations, this document specifies how those citations are sourced, verified, formatted, and reviewed.

> This document codifies the citation discipline framework. It exists because hallucinated citations from AI-assisted content production are the single highest-risk failure mode in modern editorial work. Every client engagement that produces content with factual claims operates under this SOP. Per-client overlays add specifics; this document is the baseline.

---

## TABLE OF CONTENTS

1. The Five Citation Discipline Principles
2. Three-Tier Source Hierarchy
3. The [STAT NEEDED] Flag Protocol
4. Hallucination Pattern Catalog
5. Source Verification Hard Gate
6. Three-Level Review Chain
7. Citation Format Standard
8. Legislative & Regulatory Citation Rules
9. Pre-Submission Checklist
10. Per-Client Implementation
11. Document Relationships

---

## Phase 1 — The Five Citation Discipline Principles

These five principles override all other content production rules when they intersect. A piece of content that meets every other quality bar but violates one of these principles does not publish.

### 1.1 Zero Fabrication
Every statistic, study reference, and data point must be real and verifiable in a primary source. AI tools (Claude, ChatGPT, Gemini, and others) frequently generate plausible-sounding citations — real journal names, realistic author names, believable numbers — that do not exist. This is hallucination. It is the highest-risk failure mode.

### 1.2 Verify Before Citing
Every cited source must be verified before it lands in a draft:
- The DOI or URL resolves to the source
- The title, author list, year, journal, and finding match the claim
- The source actually says what the article claims it says
- The source has not been retracted

A source that is not verified is not citable.

### 1.3 Attribution Precision
If an organization said X about Y, that attribution cannot be repurposed to claim X about Z. If the EPA classifies a chemical as "likely human carcinogen," that is the language used — not "probable" or "known." If a study examined occupational exposure, that finding does not transfer to household-use claims without a separate source addressing household use. If a study used adult subjects, that finding does not transfer to claims about children without a source that addresses children. Animal-study evidence is disclosed as such.

### 1.4 Strength of Evidence Honesty
Association is not causation. Preliminary evidence is not consensus. Contested science is acknowledged as contested. The strength of the evidence is represented accurately or the claim does not run.

### 1.5 No Unresolved Placeholders in Submitted Drafts
The [STAT NEEDED] flag is a drafting tool. It must never appear in a draft submitted to the client or pushed to review. Every placeholder is resolved before submission: filled with a verified citation, or rewritten to remove the need for the statistic.

---

## Phase 2 — Three-Tier Source Hierarchy

Every citation comes from a tier defined here. Per-client overlays specify additional preferred sources within each tier (e.g., a sustainability brand adds EWG; an HVAC brand adds ACCA; a supplements brand adds NIH ODS).

### 2.1 Tier 1 — Preferred
- Peer-reviewed journals accessible via PubMed, Google Scholar, or publisher with DOI
- Government and regulatory bodies: EPA, FDA, NIH, CDC, OSHA, FTC, state legislative databases
- Recognized standards organizations: ASTM, NFPA, ISO, IEEE, ANSI, AICPA
- International bodies with technical standing: WHO, OECD, IPCC

### 2.2 Tier 2 — Acceptable
- University research from `.edu` domains with a named researcher
- Established professional and industry bodies appropriate to the topic (named explicitly in the per-client overlay)
- Established consumer or sector databases with known methodology (named explicitly in the per-client overlay)

### 2.3 Tier 3 — Use With Caution
- Major news outlets (NYT, Reuters, AP, BBC, FT, WSJ) when reporting on a primary source. Always trace back to the underlying study and cite that primary source. Do not cite the news outlet as the source of the finding.

### 2.4 Never Acceptable
- AI-generated summaries presented as sources (ChatGPT, Claude, Gemini, Perplexity output is not a source)
- Wikipedia as a primary source (Wikipedia is a starting point only)
- Blog posts from competitors or unrelated brands
- Press releases as the sole source for a scientific or technical claim
- Social media posts (Reddit, Facebook, X, LinkedIn) as primary sources
- Generic ".org" sites without named subject authority

### 2.5 Per-Client Tier Mapping
The per-client overlay (`clients/{client}/brand_context/sops/{client}_Editorial_Overlay_v*.md`) specifies the tier mapping for that client's domain — which sources are explicitly preferred, which third-party databases are accepted, and which fall outside the bar for that engagement.

---

## Phase 3 — The [STAT NEEDED] Flag Protocol

When a writer encounters a sentence that would benefit from a statistic or data point but cannot verify a clean source within the verification window, the inline flag is:

```
[STAT NEEDED: specific claim that needs sourcing]
```

### 3.1 Verification Window
A typical verification window is 5–10 minutes per claim using approved Tier 1/2 sources. Domains with deep regulatory complexity may require longer (paywalled journals, deep regulatory documents, primary-source chasing through aggregator chains); per-client overlays document the override (see Phase 10).

If a verified source is not located within the window, the writer either:
- Inserts a [STAT NEEDED] flag and continues drafting, returning later
- Rewrites the passage to remove the need for the statistic, using general scientific principles, certification references, or qualitative statements grounded in known facts

### 3.2 Resolution Before Submission
Every [STAT NEEDED] flag is resolved before the draft moves out of authoring. Resolution means one of:
- Verified citation inserted
- Passage rewritten to remove the stat
- Stat removed without replacement

A [STAT NEEDED] flag in a submitted draft is a Phase 5 (Source Verification Hard Gate) failure.

### 3.3 Tracking
Drafts in active production carry [STAT NEEDED] flags inline. Reviewers search for the literal string before passing the draft forward.

---

## Phase 4 — Hallucination Pattern Catalog

These are universal patterns that recur across AI-assisted content production. Per-client overlays append client-specific incident learnings to the bottom of this catalog as they accumulate.

### 4.1 Universal Hallucination Patterns

- Citing a real journal with a fabricated study title, author list, or finding
- Generating a plausible-sounding statistic that cannot be traced to any real source
- Using a statistic from a secondary or advocacy source and attributing it to the underlying primary data
- Applying occupational exposure research to household use without disclosure
- Applying adult-subject research to claims about children without a source
- Extrapolating from animal studies to human health claims without disclosing animal-study origin
- Stating that an organization recommends X when the organization has made no such recommendation
- Using the wrong regulatory classification language (e.g., "probable" instead of "likely")
- Presenting one side of a contested debate as settled consensus
- Citing a retired or superseded policy document as current guidance
- Leaving [STAT NEEDED] placeholders in submitted drafts, treating the placeholder as finished work

(For legislative and regulatory citation hallucinations specifically, including wrong bill numbers, wrong statute sections, and broken .gov URLs, see Phase 8.)

### 4.2 Per-Client Incident Catalog
Each per-client overlay maintains an appendix that adds specific hallucinations caught in that client's content production, with the date, the false claim, and the corrected version. The catalog grows as the engagement matures. This is the most valuable artifact of any long-running client relationship: the post-incident learnings that keep the same mistake from recurring.

---

## Phase 5 — Source Verification Hard Gate

Every draft passes this gate before submission. A single failure blocks submission.

### 5.1 URL & DOI Verification
- Open every URL in the Sources section in a browser
- Confirm each URL loads to the correct source (not a 404, not a redirect to a search page, not a different document)
- For .gov URLs: navigate to the page through the agency's site rather than trusting the AI-generated path. Government sites restructure frequently.
- For DOI links: confirm the DOI resolves to the publisher page

### 5.2 Statistic Verification
- For each cited statistic: locate the specific number in the source
- Confirm the number matches the claim made in the draft
- Confirm the surrounding context in the source supports the way the claim is framed

### 5.3 Attribution Verification
- For each cited author or organization: confirm the named entity actually published the claim
- For organizational guidance: confirm the guidance is current and not superseded

### 5.4 [STAT NEEDED] Sweep
- Search the document for the literal string `[STAT NEEDED`
- Zero matches before submission

### 5.5 Documentation
- For each verified source, note the verification date in working notes (a comment or tracked change is sufficient; this is not the published Sources section)
- A draft without verification documentation does not pass the gate

### 5.6 Source Archival
Government and corporate web pages restructure regularly. .gov URLs in particular die after agency redesigns; FTC, EPA, and state legislative URLs all break across site refreshes. Source rot is a citation-quality failure waiting to happen.

For non-DOI sources cited in published content:
- Capture a Wayback Machine snapshot at archive.org/wayback at the time of verification
- Note the snapshot URL in working notes alongside the original
- If the original URL later dies, the article updates to point to the snapshot

DOI-backed sources do not require Wayback archival, since DOI resolution is a permanent identifier maintained by the publisher.

If Wayback Machine is unavailable at verification time, document the attempt (timestamp, original URL, unavailability reason) in working notes and capture the snapshot when service returns. The verification gate passes on documented attempt; the snapshot URL gets backfilled when Wayback is reachable.

---

## Phase 6 — Three-Level Review Chain

Every piece of content with factual claims passes through three review levels. Per-client overlays fill in the named individuals who hold each role.

### 6.1 Level 1 — Author (pre-submission)
The author runs the Phase 9 pre-submission checklist before passing the draft forward. Self-review is non-optional. The author is the first line of defense against hallucinations.

### 6.2 Level 2 — Subject Matter Reviewer
A reviewer with subject-matter credentials in the topic domain reviews:
- Each cited source for accuracy and currency
- Each claim for accuracy of attribution
- Each claim for evidence-strength honesty (association vs. causation, preliminary vs. consensus, animal vs. human)
- Each claim for precision of language (regulatory classifications, etc.)
- Suggested additional citations where they strengthen the article

For YMYL or YMYL-adjacent content, the Subject Matter Reviewer must hold documented credentials in the relevant field (per Core Standards Phase 4.5). For other content, a senior practitioner in the topic domain suffices.

### 6.3 Level 3 — Editorial Lead
The Editorial Lead reviews:
- Brand voice fit
- Strategic alignment with the topical cluster and brand positioning
- Final accuracy of all product references, certifications, and pricing
- Final pre-publish gate per Core Standards Phase 16.1

### 6.4 Level Mapping in Per-Client Overlays
The per-client overlay names the individual or role for each level. For solo-founder clients, Levels 2 and 3 may be the same person. For larger clients with internal scientific or technical teams, Level 2 may be that internal team. The chain is documented; the level count is fixed.

**Solo-reviewer cooling period.** Where Levels 2 and 3 are held by the same person, a minimum 24-hour cooling period between reviews is required. The same reviewer catches more on a second pass after time away. The cooling period is documented in the per-client overlay alongside the reviewer's name.

---

## Phase 7 — Citation Format Standard

Every piece of content with citations carries an end-of-content Sources section. Citations follow APA format with working hyperlinks.

### 7.1 Journal Article Format
```
Author, A. A., & Author, B. B. (Year). Title of article. Journal Name, volume(issue), page numbers. https://doi.org/xxxxx
```

### 7.2 Government / Organizational Source Format
```
Organization Name. (Year). Title of document. https://www.example.gov/page
```

### 7.3 Web Page Without Publication Date
```
Organization Name. (n.d.). Title of page. https://www.example.com/page
```
Include the date the page was accessed for sources updated regularly.

### 7.4 Inline Citation Hooks
Every factual claim in body prose **must include** an inline attribution that makes the source identifiable:
- "According to EPA data..."
- "[Author year] found that..."
- "[Organization]'s [year] [report name] reported..."

Inline hooks are the AEO mechanism for source attribution. Without them, AI answer engines extract claims but cannot trace them back. Hookless claims are extractable but unattributable, which weakens the citation's E-E-A-T contribution to zero. This is a hard requirement, not a stylistic preference.

### 7.5 Sources Section Placement
The Sources section appears after the FAQ and before any Related Reading or Related Content section.

---

## Phase 8 — Legislative & Regulatory Citation Rules

AI tools generate plausible but incorrect government citations more often than fabricated journal articles. The risk is asymmetric: a wrong bill number in published content is a credibility hit that propagates across AI Overview citations and is hard to fully remediate.

### 8.1 Mandatory Verification Steps
- Bill numbers verified against the actual legislative database for the jurisdiction (congress.gov for federal; state legislative info portals for state-level; equivalents for international)
- Statute section numbers verified against the enrolled version of the law
- Every .gov URL tested by clicking through within 24 hours of submission
- For agency-specific databases (EPA IRIS, FTC document portal, FDA Orange Book, etc.): navigate to the cited page through the agency's site nav rather than trusting an AI-generated URL path

### 8.2 Common Wrong-Citation Patterns
- Wrong bill numbers (e.g., AB-1743 when the correct bill is SB-258)
- Wrong statute section numbers
- 404'ing EPA IRIS chemical landing pages from wrong URL path formats
- Outdated FTC document URLs from prior site redesigns
- Wrong state legislative database URL structures

### 8.3 Per-Client Regulatory Mapping
Per-client overlays document the specific regulatory bodies relevant to that client's domain (FTC Green Guides for sustainability brands, ACCA for HVAC, FDA for supplements, OSHA for safety, etc.) and the canonical URL paths for each.

---

## Phase 9 — Pre-Submission Checklist

The author runs this checklist before passing the draft to Level 2 review. A single failure blocks submission.

### Source Accuracy
- [ ] Every factual claim has a verified source with a working URL or DOI
- [ ] Every cited study confirmed to exist via PubMed, Google Scholar, or publisher
- [ ] Zero fabricated statistics, study titles, or author names
- [ ] Evidence strength accurately represented (association vs. causation, animal vs. human, preliminary vs. consensus)
- [ ] Attribution precise (organization said exactly what is claimed)
- [ ] Contested science acknowledged as contested
- [ ] Zero `[STAT NEEDED]` or other placeholder tags remaining

### URL & Citation Verification
- [ ] Every URL in Sources opened in a browser within the past 24 hours
- [ ] Every URL loads to the correct source, not a 404 or redirect to a search page
- [ ] Every DOI resolves to the publisher page
- [ ] Wayback snapshot captured for every non-DOI source (Phase 5.6)
- [ ] Legislative bill numbers and statute sections verified against the legislative database
- [ ] All .gov URLs confirmed current (not redirecting to 404 or wrong page)

### Citation Format
- [ ] Sources section uses APA format
- [ ] Every citation includes a working hyperlink
- [ ] Inline attribution hooks present for every body-prose factual claim
- [ ] Sources section placed after FAQ, before Related Reading

### Process
- [ ] Verification dates documented in working notes
- [ ] Wayback snapshot URLs noted alongside originals in working notes
- [ ] Hallucination pattern catalog (universal + client-specific) reviewed against the draft
- [ ] Author signs off in writing (commit message, email, comment) before passing to Level 2

---

## Phase 10 — Per-Client Implementation

Each client engagement carries a per-client editorial overlay document at `clients/{client}/brand_context/sops/{client}_Editorial_Overlay_v*.md` that fills in:

1. **Tier mapping** — which Tier 1/2/3 sources are explicitly preferred for this client's domain
2. **Review chain names** — who holds Level 1, 2, and 3 for this client
3. **Per-client hallucination catalog** — incidents caught and the corrections, growing over time
4. **Per-client regulatory mapping** — the specific regulatory bodies and canonical URL paths relevant to the client's content
5. **Per-client banned attribution patterns** — claims this client has specifically flagged as inappropriate (e.g., "no liquid product references" for Green Llama)
6. **Verification window override** — if the standard 5–10 minute window is inappropriate for the client's domain, document the override

Reference implementation: `clients/green-llama-clean/brand_context/sops/GL_Editorial_Overlay_v1.md`.

---

## Phase 11 — Document Relationships

This SOP is cross-cutting. It applies in addition to the page-type SOP for whatever content is being produced.

```
ROI.LIVE Agency Core Standards v1.1
├── Phase 4 — E-E-A-T (this SOP implements the Trust signal layer)
├── Phase 8 — Stop Slop (this SOP enforces evidence honesty in voice)
└── Phase 16 — Quality Gates (this SOP defines the citation portion)

ROI.LIVE Agency Citation Discipline SOP v1.0  ← THIS DOCUMENT
└── applies to:
    ├── Blog Article SOP (every cited statistic and claim)
    ├── Service Page SOP (data claims about service outcomes)
    ├── Case Study Page SOP (every result claim and metric)
    ├── Homepage SOP (any data claim on the homepage)
    ├── Collection / Product Page SOPs (ingredient claims, certifications)
    └── any future page-type SOP that involves data claims

Per-client editorial overlays
└── inherit from this SOP, fill in tier mapping, review chain, and incident catalog for the specific engagement
```

---

*Version 1.0 — April 2026 — ROI.LIVE / Jason Spencer*
*Codified from the Green Llama Clean post-incident learning trajectory (March–April 2026).*
