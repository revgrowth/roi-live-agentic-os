# Blue Tree Onboarding, Phase 1 Conflict Map

**Branch:** feature/onboard-blue-tree
**Date:** 2026-05-12
**Phase:** 1 of 4 (Intake + Source Archival + Conflict Map)

## Summary

Twenty findings across seven dimensions. The biggest issue is Sitemap v2.1, which still carries banned content (singular "Healthy Yard" pillar URL, "Sprinkler System Installation" cluster page, "Jeff Downie" surname in a team-bio URL, "Mark Paisley" misspelling) that v1.1 and the Client Feedback Master Reference both explicitly prohibit. The next biggest issue is the absence of a ROI.LIVE Client Parameter Sheet for Blue Tree, which v1.1 §1 names as a source but which does not exist as a standalone document. Five promotion candidates surfaced for cross-client SOPs.

---

## Findings

### A. DNA Guide v1.1 vs. Legacy Brand Voice & Style Guide

**Finding A1: Em-dash treatment is inverted between versions**

- **Type:** CONFLICT
- **What:** v1.1 bans em dashes outright; the legacy guide mandates them.
- **v1.1 says:** §11.3 "Em dashes are banned in all Blue Tree copy. The brand writes without them." Compliance check in §18.6 and §18.13 returns the document for revision on any em-dash character.
- **Legacy says:** §2 "Em-dash: Use a single em-dash (—) with no spaces on either side for emphasis."
- **Proposed resolution:** v1.1 supersedes. Legacy file is properly classified as `LEGACY-v0` and archived in `inputs/source-materials/`. No action needed beyond confirming the legacy file is never loaded as authoritative.

**Finding A2: Primary brand name rule reversed**

- **Type:** CONFLICT
- **What:** v1.1 forbids "Blue Tree Landscaping" in customer-facing copy outside the origin story; the legacy guide uses "Blue Tree Landscaping" as the primary brand name throughout.
- **v1.1 says:** §1.1 "The phrase 'Blue Tree Landscaping' never appears in customer-facing body copy outside the origin story and schema fields. Every brief must pass a find-and-replace audit before delivery."
- **Legacy says:** Title and §7 use "Blue Tree Landscaping" as the primary name. Example copy in §4.5 attributes a 5-Star Review to "Blue Tree" but the surrounding guide is written under the legacy banner.
- **Proposed resolution:** v1.1 supersedes. No further action; legacy is archived.

**Finding A3: Tenure number outdated in legacy**

- **Type:** CONFLICT
- **What:** Legacy uses "more than 40 years"; v1.1 mandates 43 years (current year minus 1983).
- **v1.1 says:** §1.6 "43 years in business (founded 1983)" and §11.2 bans "40 years."
- **Legacy says:** §1 "For more than 40 years, Blue Tree has shaped the outdoor spaces of historic Philadelphia suburbs."
- **Proposed resolution:** v1.1 supersedes. Legacy archived.

**Finding A4: Banned-phrase list expanded in v1.1**

- **Type:** GAP (in legacy)
- **What:** v1.1 §11.2 and §16.1 ban roughly 50 phrases (game-changer, lean into, deep dive, seamless, elevate, robust, vibrant, crafted, tailored, strives to, endeavors to, etc.). Legacy contains no banned-phrase list and actively uses several of them in example copy ("crafted" in §4.1, "vibrant" in §4.4, "engineered for elegance" pull-quote style headlines in §4.2).
- **v1.1 says:** §11.2, §11.4, §16.1.
- **Legacy says:** §4.1 hero copy "Custom pools, timeless landscaping, and premium hardscapes—crafted by the experts."
- **Proposed resolution:** v1.1 supersedes. No further action.

**Finding A5: Geographic rule consistent across both**

- **Type:** (no conflict)
- **What:** Both forbid "Montgomery County" alone and require "Southeastern PA" or the full county list. v1.1 §11.6 matches Legacy §3 exactly on this rule.
- **Proposed resolution:** None. Carry forward.

**Finding A6: Tagline absent from legacy**

- **Type:** GAP (in legacy)
- **What:** v1.1 establishes the "Pools · Landscapes · Hardscapes" tagline. Legacy has no tagline.
- **v1.1 says:** §1.5.
- **Proposed resolution:** v1.1 supersedes. Legacy archived.

### B. DNA Guide v1.1 vs. Sitemap v2.1

**Finding B1: "Healthy Yard" pillar URL is singular, but v1.1 mandates plural**

- **Type:** CONFLICT
- **What:** Sitemap pillar #4 uses `/healthy-yard/` (singular) and references "Healthy Yard Cluster" throughout. v1.1 §10.4 mandates "Healthy Yards" (plural) and §11.2 bans the singular form.
- **v1.1 says:** §10.4 "URL: /healthy-yards/. Operation Tag: Healthy Yards (PLURAL, never singular)." §18.3 compliance check requires plural everywhere including URL, body, nav, and operation tags.
- **Sitemap says:** Lines 145 (pillar URL), 65 (operation tag), 199, 203-206, 364-365, 463, 508 use the singular.
- **Proposed resolution:** Sitemap v2.1 needs revision to plural everywhere. Needs Jason ruling on whether to fix sitemap before Phase 2 or treat v1.1 as authoritative and flag for the website-build phase.

**Finding B2: "Sprinkler System Installation" listed as a launch cluster page**

- **Type:** CONFLICT
- **What:** Sitemap Landscapes Cluster page #8 (line 180, 494) lists "Sprinkler System Installation" at `/landscapes/sprinkler-systems/`. v1.1 §10.2, §11.2, and §18.3 all explicitly prohibit this service. Client Feedback Master Reference §4 also lists this URL as confirmed-omit.
- **v1.1 says:** §10.2 "Services NOT included (must not appear on Landscapes pages): Sprinkler System Installation."
- **Feedback ref says:** "Specifically confirmed omit (do not include these pages): `/landscapes/sprinkler-systems/`."
- **Sitemap says:** Listed as one of 8 launch cluster pages.
- **Proposed resolution:** Sitemap v2.1 has a math error and a content error. Either the page count drops to 28 launch clusters or another cluster is promoted from the post-launch list. Needs Jason ruling.

**Finding B3: "Jeff Downie" surname used in author-bio URL**

- **Type:** CONFLICT
- **What:** Sitemap line 115 lists Jeff's author bio URL as `/about/team/jeff-downie/`. v1.1 §11.2 explicitly bans "Jeff Downie" and §16.1 lists it as a banned phrase that maps to "Jeff Mattiola." §18.2 compliance check requires the surname Mattiola.
- **v1.1 says:** Banned in §11.2, §16.1, §18.2.
- **Sitemap says:** `/about/team/jeff-downie/`.
- **Proposed resolution:** Sitemap typo, change to `/about/team/jeff-mattiola/`. Needs Jason confirmation but the rule is unambiguous.

**Finding B4: "Mark Paisley" misspelling in sitemap**

- **Type:** CONFLICT
- **What:** Sitemap line 118 lists `Mark Paisley Bio` at `/about/team/mark-paisley/`. v1.1 names him "Mark Peasley" throughout (§3.3, §15.2, etc.) and §18.8 compliance check requires correct spelling.
- **v1.1 says:** "Mark Peasley, Turfcare Manager."
- **Sitemap says:** "Mark Paisley."
- **Proposed resolution:** Sitemap typo. Change to `/about/team/mark-peasley/`. Needs Jason confirmation.

**Finding B5: All 5 sitemap pillars have v1.1 voice coverage**

- **Type:** (no conflict, confirmation)
- **What:** All five pillars (Pools, Landscapes, Hardscapes, Healthy Yards, Premier Outdoor Services) have voice coverage in v1.1 §10. Each has positioning, pricing range, lead designer attribution, differentiators, and objection handling.
- **Proposed resolution:** None.

**Finding B6: Spa & Hot Tub Integration appears in sitemap with no voice coverage**

- **Type:** GAP
- **What:** Sitemap line 165 and 481 lists "Spa & Hot Tub Integration" `/pools/spa-hot-tub/` as a Pools cluster page. v1.1 §10.1 describes the Pools pillar but does not mention spa or hot tub. The Pillar 1 §10.1 service description omits spas.
- **v1.1 says:** Silent on spa/hot tub.
- **Sitemap says:** Existing page, in launch.
- **Proposed resolution:** Confirm whether Blue Tree does spa/hot tub integration. If yes, v1.1 needs a §10.1 addendum. If no, sitemap drops the page. Needs Jason ruling.

**Finding B7: Editorial Standards page added with no voice rule**

- **Type:** GAP
- **What:** Sitemap line 121-129 introduces an Editorial Standards page at `/about/editorial-standards/` documenting content creation process, fact-checking, and author qualification. v1.1 has no editorial-standards content rule, no schema spec, and no voice rule for this page type.
- **v1.1 says:** Silent.
- **Sitemap says:** 300-500 words, every blog post links to it.
- **Proposed resolution:** This is a Phase 2 deliverable. Flag for editorial overlay design in Phase 4. Promotion candidate (see G).

**Finding B8: Voice rules in v1.1 §5.6 (Email/Newsletter), §5.7 (Social), §5.9 (Educational Video) have no sitemap implementation surface**

- **Type:** GAP
- **What:** v1.1 §5 defines voice for email/newsletter, social media, and educational video. Sitemap is website-only. These channels need an implementation plan that lives outside the sitemap.
- **Proposed resolution:** Phase 3 engagement-status will flag the multi-channel scope. No action in Phase 1.

### C. DNA Guide v1.1 vs. Client Feedback Master Reference

**Finding C1: Chad Ochnich join date conflict (1994 vs. 1995)**

- **Type:** CONFLICT (resolved in v1.1, feedback ref stale)
- **What:** Feedback ref §2 and team-section say Chad came on "mid-1990s, specifically 1995." v1.1 §1.7 and §3.1 say 1994, with the note "live site confirmed; old reference documents listing 1995 are incorrect."
- **v1.1 says:** 1994.
- **Feedback ref says:** 1995.
- **Proposed resolution:** v1.1 supersedes (live-site verified). Feedback ref is the older source and should be flagged as a v1.0 input. No further action.

**Finding C2: Chad's residence conflict**

- **Type:** CONFLICT
- **What:** Feedback ref §"Team & Family Details" says "Chad is NOT in Upper Providence Township anymore, do not use that location reference." v1.1 §3.1 says "Lives in Upper Providence with wife Anique and two children."
- **v1.1 says:** Upper Providence (verified against bluetreelandscaping.com/about/meet-the-team/ as of 2026-05-12).
- **Feedback ref says:** Do NOT use Upper Providence.
- **Proposed resolution:** v1.1 reverses feedback-ref rule on live-site evidence. **Needs Jason ruling.** Either the live site is current and the feedback ref is stale, or the feedback ref reflects more recent client guidance that hasn't reached the live site. This affects Chad's bio prose and Meet-the-Team page.

**Finding C3: Justin and Christopher disambiguation reversed**

- **Type:** CONFLICT
- **What:** Feedback ref §"Team & Family Details" says "Do NOT mention: Justin or Chris, no recordings were done by them, not confirmed team members." v1.1 §3.6 (Justin Acal), §3.7 (Christopher DiVito), and §3.14 (Justin Ryen) deploy all three as named team members with full bios, live-site verified.
- **v1.1 says:** Disambiguated: Justin Acal (joined 2019, Rutgers), Justin Ryen (joined 2025), Christopher DiVito (Temple BSLA). Reference §19 change-log item 6.
- **Feedback ref says:** Do not mention.
- **Proposed resolution:** v1.1 supersedes (live-site verified). No further action; v1.1 §19 already documents the override.

**Finding C4: "More projects in Skippack than any other town" claim status**

- **Type:** AMBIGUITY (carried forward)
- **What:** Feedback ref §"Skippack Page" flags this claim as "NOT confirmed as correct, do not use without client verification." v1.1 §19 pending items list says "Pending verification before use, owner Maureen."
- **v1.1 says:** Pending, do not use until verified.
- **Feedback ref says:** Do not use until verified.
- **Proposed resolution:** Both agree. Do not use in Phase 2 deliverables. Carry to engagement-status.md as an open item.

**Finding C5: Address, founding date, team roster alignment**

- **Type:** (no conflict, confirmation)
- **What:** Physical address (4494 Skippack Pike, Schwenksville, PA 19473), founding (1983, Norristown), Skippack move (2008), 43 years, four kids (Andrew, David, John, Meg) align between v1.1 §1.7 and feedback ref §2.
- **Proposed resolution:** None.

**Finding C6: "Cliff" and "John Mattiola" bio status**

- **Type:** AMBIGUITY (carried forward)
- **What:** Feedback ref §"Team & Family Details" says both bios "coming soon, placeholder confirmed." v1.1 §19 pending items confirms both as TBD, owner Maureen.
- **Proposed resolution:** No conflict, just an open thread. Phase 2 cannot ship Cliff or John Mattiola author pages until bios arrive.

**Finding C7: Steven Wolaniuk testimonial absorbed**

- **Type:** (no conflict, confirmation)
- **What:** Feedback ref appended the Steven Wolaniuk review at the bottom. v1.1 §15.4 integrated it into the proof library with use-by-page recommendations.
- **Proposed resolution:** None. v1.1 absorbs the input.

### D. DNA Guide v1.1 vs. Voice Transcripts (Spot Check)

**Finding D1: "We build what we design" verified in transcripts**

- **Type:** (no conflict, confirmation)
- **What:** v1.1 §2.4 lists this as Jeff's lead signature phrase. Transcripts line 2341 contains the exact phrase in Jeff's voice during a discussion of differentiation.
- **Proposed resolution:** None.

**Finding D2: "All you have in life is your reputation. Don't screw it up." verified in transcripts**

- **Type:** (no conflict, confirmation)
- **What:** v1.1 §2.4 cites this as a phrase from Jeff's father. Transcripts line 2149 has "All you have in your in life is your reputation. Don't screw it up." in Jeff's narration about his father.
- **Proposed resolution:** None. Transcribed verbatim with minor disfluency cleanup in v1.1.

**Finding D3: "The element of surprise is minimal" not found in transcripts**

- **Type:** AMBIGUITY
- **What:** v1.1 §2.4 lists this as a signature Jeff phrase and §2.6 attributes it to his pricing-transparency principle. A grep of the transcripts for "element of surprise" returns zero matches. The phrase may have originated in the Client Parameter Sheet v1.0 or a creative brief rather than a transcribed quote.
- **v1.1 says:** Listed as a signature phrase.
- **Transcripts say:** No occurrence.
- **Proposed resolution:** Needs Jason ruling. Either (a) confirm provenance (Parameter Sheet v1.0 or a creative brief), (b) treat it as a paraphrase of Jeff's broader pricing-transparency theme rather than a verbatim quote, or (c) drop from the signature-phrases list in v1.1 §2.4 and keep only as a paraphrasable principle in §2.6.

### E. Citation Discipline SOP Applicability

**Finding E1: Content types in scope for citation discipline**

- **Type:** (scope statement)
- **What:** Blog posts (15 at full architecture), pillar pages (5), cluster pages (29 at launch + 26 post-launch), Service Hub FAQ page, Service Hub Care Instructions, Service Hub Warranties, Author Bio pages, and Editorial Standards page all need citation discipline. Glossary content lives inside v1.1 §11.8 currently but a standalone glossary page is not in the sitemap.
- **Proposed resolution:** Phase 4 editorial overlay will encode the SOP. Flag glossary page as a possible sitemap addition.

**Finding E2: Tier 1/2/3 source mapping is partial**

- **Type:** GAP
- **What:** v1.1 §15 inventories proof points but does not classify them by source tier. Available sources Blue Tree has access to:
  - **Tier 1 (peer-reviewed, government, primary):** USDA Zone 6b/7a hardiness data (USDA); township impervious-surface codes (municipal ordinance); APSP/CBP standards documents; ICPI installation specs; NALP and PLNA standards.
  - **Tier 2 (trade authorities, certification bodies):** APSP, ICPI, CBP, NALP, PLNA publications; Penn State Cooperative Extension; Rutgers Cooperative Extension; Pool & Hot Tub Alliance.
  - **Tier 3 (vendor/brand documentation):** Jandy/Fluidra equipment manuals; supplier specs (A&B Natural Stone, local nurseries).
  - **First-party (highest authority for Blue Tree-specific claims):** v1.1, audio transcripts, completed projects portfolio, warranty documents, live-site testimonials, Trustindex review data.
- **Proposed resolution:** Phase 4 builds a source-tier table for the Editorial Standards page. **Promotion candidate** (see G).

**Finding E3: YMYL boundary for landscape and pool content**

- **Type:** AMBIGUITY
- **What:** Landscape and pool topics cross into YMYL (your-money-or-your-life) territory in three places:
  1. **Mosquito and tick control:** Chemical application advice has health implications. Mark Peasley (Turfcare Manager, ~20 years industry, university research background) is the qualified expert author.
  2. **Pool safety:** Drowning-prevention, fence-code compliance, electrical-grounding code, chemical handling. John Kostesich (24+ years, APSP, CBP) is the qualified author.
  3. **Drainage/grading:** Improper grading creates structural risk to homes. v1.1 doesn't name a dedicated drainage expert; design-side leads (Andrew Mattiola, Christopher DiVito, Justin Acal) and production-side leads (Chad, James, Mike Wadsworth) share the topic.
- **Proposed resolution:** Phase 4 editorial overlay specifies the author/reviewer pairing for each YMYL topic and ties it to schema author and reviewedBy fields. **Promotion candidate** (see G).

### F. Missing Inputs

**Finding F1: ROI.LIVE Client Parameter Sheet for Blue Tree does not exist as a standalone document**

- **Type:** GAP
- **What:** v1.1 §1 source list references "ROI.LIVE Client Parameter Sheet for Blue Tree Outdoor Living v1.0" as a consolidated source. No standalone parameter sheet exists at `clients/blue-tree/` or in `inputs/source-materials/`. The agency template is at `agency/sops/ROI-LIVE-Client-Parameter-Sheet-Template-v1.md`.
- **Proposed resolution:** **Needs Jason ruling.** Two options:
  - (a) Treat the parameter sheet as fully absorbed into v1.1 and skip creation. Risk: future skills that load the parameter sheet per the agency Context Matrix will fall back to silent gap.
  - (b) Build `clients/blue-tree/standards/client-parameter-sheet.md` from the agency template by extracting the relevant sections from v1.1 (brand identity, voice profile, service offerings, conversion preferences, etc.). This is roughly a Phase 4 deliverable but Jason should confirm before Phase 2 begins.

**Finding F2: `voice-transcripts-13-recordings.md` and `voice-recordings-reference.md` are byte-identical duplicates**

- **Type:** AMBIGUITY (naming)
- **What:** Both files are 145577 bytes with identical MD5 hash `d6a1e14461c5ccddbfa2b8653f57c5b8`. The two filenames suggest two different roles (raw transcript vs. a reference index), but the contents are the same file copied under two names.
- **Proposed resolution:** **Needs Jason ruling.** Three options:
  - (a) Keep one canonical name (`voice-transcripts-13-recordings.md`), delete the other.
  - (b) Replace `voice-recordings-reference.md` with an actual reference index (recording-by-recording summary with speaker, date, topic, and timestamp anchors).
  - (c) Confirm the two names are intentional aliases and leave both.

**Finding F3: No 20 creative briefs are in source-materials**

- **Type:** GAP
- **What:** v1.1 §1 cites "20 completed creative briefs (Phase 0)" as a consolidated source. None of the briefs are archived in `inputs/source-materials/`. The Client Feedback Master Reference §"Process" assumes the briefs exist.
- **Proposed resolution:** **Needs Jason ruling.** Either (a) confirm the briefs were absorbed into v1.1 and don't need archival, or (b) drop them into `inputs/source-materials/creative-briefs/` for traceability.

**Finding F4: Live-site audit (May 12, 2026) not archived**

- **Type:** GAP
- **What:** v1.1 §1 cites "Full live-site audit of bluetreelandscaping.com (May 12, 2026)" as a consolidated source. The audit document itself is not in `inputs/source-materials/`.
- **Proposed resolution:** **Needs Jason ruling.** Same options as F3 (absorbed or archive).

**Finding F5: Client Feedback Navigation Phases (April 16, 2026) not archived**

- **Type:** GAP
- **What:** v1.1 §18.12 compliance check requires this document to be loaded. v1.1 §1 lists it as a source. Document is not in `inputs/source-materials/`.
- **Proposed resolution:** **Needs Jason ruling.** Either drop it in, or remove the §18.12 reference from v1.1 if the navigation-phases content was fully absorbed.

### G. Promotion Candidates

**Finding G1: Voice Attribution Hierarchy is cross-client SOP material**

- **Type:** PROMOTION-CANDIDATE
- **What:** v1.1 §3.21 defines a three-tier voice attribution hierarchy (named subject-matter expert → founder default → brand voice for utility pages) tied to schema author. This is a reusable pattern.
- **Proposed promotion:** `agency/sops/ROI-LIVE-Agency-Voice-Attribution-SOP-v1.md`. Generalize the rule, keep the Blue Tree §3.21 as the canonical example.

**Finding G2: Schema-author / prose-voice alignment rule**

- **Type:** PROMOTION-CANDIDATE
- **What:** v1.1 §3.21 closing rule and §18.9 / §18.10 compliance checks enforce that the JSON-LD author field must match the prose voice. v1.1 §18.10 also enforces speakable schema targeting and FAQPage schema. This is a Core Standards add-on.
- **Proposed promotion:** Add a section to `agency/sops/ROI-LIVE-Agency-Core-Standards-v1.1.md` titled "Schema-Voice Alignment" or build a standalone `agency/sops/ROI-LIVE-Agency-Schema-Voice-Alignment-SOP-v1.md`.

**Finding G3: Multi-author E-E-A-T architecture**

- **Type:** PROMOTION-CANDIDATE
- **What:** v1.1 §3 plus sitemap §"Individual Author Bio Pages" and §"Editorial Standards" together define a multi-author E-E-A-T architecture: named subject-matter experts get bio pages with credentials and "Articles by Name" sections, every blog post carries Written-By and Reviewed-By credit. Several other ROI.LIVE clients with deeper team rosters (and future clients in YMYL adjacent verticals) would benefit from this pattern.
- **Proposed promotion:** `agency/sops/ROI-LIVE-Agency-Multi-Author-E-E-A-T-Architecture-SOP-v1.md`.

**Finding G4: Source-tier mapping for trade-vertical clients**

- **Type:** PROMOTION-CANDIDATE
- **What:** Finding E2 introduces a Tier 1/2/3 + first-party source map customized for landscape/pool. The mapping pattern (peer-reviewed → trade certification → vendor doc → first-party portfolio) is reusable for any home-services or trade-vertical client. GLC promoted a Citation Discipline SOP from a similar gap.
- **Proposed promotion:** Either extend the existing `agency/sops/ROI-LIVE-Citation-Discipline-SOP*.md` (if it exists) with a "Trade-Vertical Source Tier" appendix, or stand up `agency/sops/ROI-LIVE-Agency-Trade-Vertical-Source-Tier-SOP-v1.md`.

**Finding G5: YMYL boundary protocol for landscape/pool/lawn**

- **Type:** PROMOTION-CANDIDATE
- **What:** Finding E3 identifies three YMYL adjacencies (chemical application, pool safety, drainage/grading). The protocol of pairing topic → qualified author → reviewer is a reusable pattern for trade-vertical clients whose advice touches safety.
- **Proposed promotion:** `agency/sops/ROI-LIVE-Agency-Trade-Vertical-YMYL-Protocol-SOP-v1.md`.

---

## Open Questions for Jason

1. **Sitemap v2.1 has four hard conflicts with v1.1 (B1 Healthy Yard singular, B2 Sprinkler page kept, B3 jeff-downie URL, B4 mark-paisley URL). Fix the sitemap before Phase 2 begins, or treat v1.1 as authoritative and queue sitemap corrections for the website-build phase?** (Finding B1, B2, B3, B4.)

2. **Spa & Hot Tub Integration: is this a Blue Tree service?** v1.1 §10.1 omits it; sitemap launch list keeps it. (Finding B6.)

3. **Chad's residence: live-site verified (v1.1) or feedback-ref rule (do not use Upper Providence)?** This affects Chad's bio prose and Meet-the-Team. (Finding C2.)

4. **"The element of surprise is minimal" provenance: confirm origin (parameter sheet, creative brief, paraphrase) or drop from §2.4 signature phrases?** (Finding D3.)

5. **ROI.LIVE Client Parameter Sheet for Blue Tree: absorbed into v1.1 and skipped, or built from the agency template?** (Finding F1.)

6. **`voice-transcripts-13-recordings.md` and `voice-recordings-reference.md` are byte-identical. Keep one, replace one with a real index, or leave both?** (Finding F2.)

7. **20 creative briefs, live-site audit, Client Feedback Navigation Phases: archive into `inputs/source-materials/` or treat as fully absorbed into v1.1?** (Findings F3, F4, F5.)

8. **Promotion candidates: which of the five (G1 Voice Attribution, G2 Schema-Voice, G3 Multi-Author E-E-A-T, G4 Source-Tier, G5 YMYL Protocol) should advance to draft SOPs after Phase 4?** Or treat as a single bundled Blue-Tree-derived promotion package?

9. **Scaffold contamination in `clients/blue-tree/context/learnings.md`: lines 11-14, 22-23, 27-28, 32, 40, 44, 62 carry ROI.LIVE-specific learnings from the ROI.LIVE client onboarding. Wipe and reset to a clean per-client learnings shell, or migrate selectively?** (Reported in Task 1.)
