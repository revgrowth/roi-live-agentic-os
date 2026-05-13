# Client: Blue Tree Outdoor Living

Client-specific operating instructions for Blue Tree Outdoor Living. These layer on top of the root `AGENTS.md` and the agency SOPs in `/agency/sops/`. Where rules conflict, the inheritance order below governs.

**Client folder:** `clients/blue-tree/`
**Engagement type:** Full-stack growth partnership (11 service lines)
**Engagement start:** 2025-07-30
**Last updated:** 2026-05-12
**Owner:** Jason Spencer (ROI.LIVE)

---

## Inheritance order

When rules conflict, later items override earlier items:

1. Agency Core Standards — `agency/sops/ROI-LIVE-Agency-Core-Standards-v1.1.md`
2. Page-type SOP — load the matching SOP from `agency/sops/` when working on a specific page type (Homepage, Service, Blog, Case Study, Collection)
3. Agency Citation Discipline SOP — `agency/sops/ROI-LIVE-Agency-Citation-Discipline-SOP-v1.md`
4. Blue Tree editorial overlay — `clients/blue-tree/standards/editorial-overlay.md`
5. Blue Tree voice profile — `clients/blue-tree/brand_context/voice-profile-full-v1.1.md` (v1.2 Current) + tight index `voice-profile.md`
6. Blue Tree client parameter sheet — `clients/blue-tree/standards/client-parameter-sheet.md`
7. Current session instructions

Blue Tree-specific overrides (next section) are stricter than agency defaults. They never relax an agency rule; they only tighten or specify.

---

## Blue Tree-specific overrides

These are the rules that differ from agency default. Codify before any content production.

### Brand name discipline (v1.1 §1.1, §11.2, §16.1)

- Customer-facing copy uses **Blue Tree Outdoor Living** or the short reference **Blue Tree**.
- **Blue Tree Landscaping** is the legal entity. It appears only in the origin story, footer legal block, and JSON-LD schema fields. Never in body copy outside those uses.
- Tagline (verbatim): **Pools · Landscapes · Hardscapes**.

### Em-dash ban (v1.1 §11.3)

- **Zero em dashes.** Anywhere. Replace with comma, period, parenthesis, or rewrite.
- This is stricter than agency default. No exceptions for pull quotes, captions, or headings.

### Healthy Yards plural (v1.1 §10.4, §11.2)

- The pillar name is **Healthy Yards** (plural). Singular **Healthy Yard** is banned in customer-facing prose.
- Pillar URL: `/healthy-yards/`.
- This rule cascades through every brief, sitemap reference, and navigation label.

### Geographic rule (v1.1 §11.6)

| Form | When to use |
|---|---|
| **Southeastern PA** | Short, catch-all. Hero subheadlines, meta descriptions. |
| **Montgomery, Bucks, Chester, Delaware, and Philadelphia Counties** | Full list. Service area sections, footers, schema. |
| **The five Southeastern PA counties we serve** | Conversational body copy. |
| **Montgomery County alone** | NEVER use this form alone. Always pair with Southeastern PA or the full list. |

Lehigh and Berks Counties are approved for future expansion. Do not list them in customer-facing copy until launch.

### Tenure number annual update (v1.1 §1.6, §1.7)

- Current: **43 years** in business (founded 1983), **13 to 14 year** average employee tenure, **15 years** pool construction track record.
- Increment annually each January. Updated annually by Jason; tracked in `engagement-status.md` Recurring deliverables calendar.
- Never use **40 years** or **15 years** for employee tenure (15 is pool construction, not employee tenure).

### Author attribution = schema author (v1.1 §14, §18)

- Author named in JSON-LD `author` writes in their own voice per the team voice profiles in v1.1 §2 and §3.
- Blue Tree operates a multi-author E-E-A-T model. No bare "we" in body copy outside override.
- SME author list:
  - Jeff Mattiola — pool construction, leadership, pricing, multi-decade client stories
  - Jérôme Besnard — sales process, buyer guides; reviewer for pool content
  - Chad Ochnich — hardscape (ICPI certified); reviewer for hardscape and outdoor structural content
  - Mark Peasley — turf care, lawn, pest control, Healthy Yards content
  - [Lead Designer TBD] — landscape design, garden design, planting content

### Stat-strip statistics use-verbatim (v1.1 §1.6)

The power statistics in v1.1 §1.6 are used verbatim. Do not paraphrase, round, or restate:

- 43 years in business (founded 1983 in Norristown)
- 70 to 90 employees (seasonal)
- 13 to 14 year average employee tenure
- 8 or more designers and sales professionals on staff
- 15 years pool construction track record
- 5 counties served (Montgomery, Bucks, Chester, Delaware, Philadelphia)
- Lifetime structural warranty on pool shells

When a number is unconfirmed or pending verification (Skippack volume, PLNA award year, etc.), mark `[TBD]` and do not approximate.

---

## Context Matrix

| Skill | voice-profile | positioning | icp | agency | samples | assets | learnings |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| `mkt-brand-voice` | **writes** | summary | — | — | **writes** | **writes** | `## mkt-brand-voice` |
| `mkt-positioning` | — | **writes** | full | — | — | — | `## mkt-positioning` |
| `mkt-icp` | — | summary | **writes** | — | — | — | `## mkt-icp` |
| `mkt-copywriting` | full | angle only | full | core + page-SOP + editorial overlay | yes | — | `## mkt-copywriting` |
| `mkt-content-repurposing` | full | — | — | core + page-SOP | yes | — | `## mkt-content-repurposing` |
| `mkt-ugc-scripts` | full | angle only | language section | core-only | tone refs | — | `## mkt-ugc-scripts` |
| `str-trending-research` | — | — | language section | — | — | — | `## str-trending-research` |
| `tool-humanizer` | full | — | — | core-only (§8) + editorial overlay | tone refs | — | `## tool-humanizer` |
| `str-ai-seo` | tone only | summary | full | core + page-SOP + citation discipline + editorial overlay | — | — | `## str-ai-seo` |
| `viz-stitch-design` | tone only | summary | language section | — | — | yes | `## viz-stitch-design` |
| `viz-interface-design` | tone only | summary | language section | — | — | yes | `## viz-interface-design` |
| `meta-wrap-up` | — | — | — | — | — | — | `## meta-wrap-up` |

**Matrix key:** `writes` = creates file | `full` = entire file | `summary` = 1-2 sentences | `tone only` = tone + vocabulary | `language section` = words-they-use section | `angle only` = chosen angle paragraph | `core-only` = Core Standards only | `core + page-SOP + editorial overlay` = Core Standards + matching page-type SOP + Blue Tree editorial overlay.

**Agency column rule (Blue Tree-specific):** Every execution skill that produces customer-facing copy or schema-citable content loads the Blue Tree editorial overlay (`clients/blue-tree/standards/editorial-overlay.md`) on top of agency files. Foundation skills do not.

**Learnings rule:** Every skill reads and writes to its own section in `clients/blue-tree/context/learnings.md`. Cross-skill insights go under `# General`.

---

## Active workstreams

Single source of truth: `clients/blue-tree/context/engagement-status.md`.

Brief one-liner snapshot for fast orientation:

- 11 active service lines (SEO/AEO/GBP, Google Ads, META Ads, FCMO, Data + Attribution, Email/Klaviyo, Organic Social, Ad Creative, Website Build, AI Brand Voice Agent, Branding)
- Website build is the largest workstream. 79 pages Phase 1 (or 21 quick-launch subset) week of 2026-05-25
- Voice profile v1.2 Current; pending Jérôme, Maureen, Jeff sign-off
- FCMO monthly cadence; next cycle June 2026 target 2026-07-03

For any decision that depends on workstream state, read `engagement-status.md` before acting.

---

## Key contacts

| Name | Role | Side | Function |
|---|---|---|---|
| Maureen Mattiola | Office Manager (on staff since 2016) | Blue Tree | Primary day-to-day contact for client input, approvals, asset retrieval |
| Jérôme Besnard | Sales Manager | Blue Tree | Sitemap architecture, sales process input, voice review |
| Jeff Mattiola | Founder / President / Co-Owner | Blue Tree | Final owner sign-off, brand-voice authority, founder voice samples. Partners with Chad since 1995. |
| Chad Ochnich | Vice President / Co-Owner | Blue Tree | Hardscape division authority, ICPI certification holder. Partners with Jeff since 1995. |
| Raja Sheryar | Designer | ROI.LIVE | Design system, Figma templates, brand assets |
| Jason Spencer | Founder | ROI.LIVE | Full-stack growth lead, FCMO, account owner |

---

## Where things live

```text
clients/blue-tree/
├── AGENTS.md                                 <- this file (client operating instructions)
├── CLAUDE.md                                 <- Claude wrapper importing AGENTS.md
├── brand_context/                            <- brand DNA (voice, positioning, ICP, samples, assets, services)
│   ├── voice-profile-full-v1.1.md            <- v1.2 Current — authoritative voice DNA
│   ├── voice-profile.md                      <- tight session-loadable index
│   ├── positioning.md
│   ├── icp.md
│   ├── samples.md
│   ├── assets.md
│   └── services.md
├── context/
│   ├── engagement-status.md                  <- 11-service-line workstream status
│   ├── errata-consolidated.md                <- single source of truth for known errata
│   ├── learnings.md
│   ├── communications/                       <- drafted client / partner messages awaiting send
│   ├── memory/                               <- daily session memory
│   └── onboarding/                           <- onboarding artifacts and notes
├── standards/
│   ├── client-parameter-sheet.md             <- Blue Tree parameter sheet (per agency template)
│   └── editorial-overlay.md                  <- Blue Tree editorial overlay (citation, review chain, hallucination catalog, YMYL)
├── inputs/
│   ├── sitemap-and-implementation-plan-v2.1.md
│   └── source-materials/                     <- creative briefs, voice transcripts, meeting notes
└── projects/                                 <- Blue Tree deliverables (briefs, FCMO dashboards, etc.)
```

Skills, shared methodology, and agency SOPs live at the repo root and `/agency/`.

---

## Errata workflow

Single source of truth: `clients/blue-tree/context/errata-consolidated.md`.

When working on any Blue Tree deliverable:

1. Check `errata-consolidated.md` for open errata on any file you're about to touch.
2. If a Hi-priority erratum is Open on the file, do not proceed. Resolve first.
3. If a Med or Low erratum is Open and your edit doesn't overlap, proceed. Log a breadcrumb in the affected file pointing back to the register.
4. When you resolve an erratum, move the row from Open to Resolved with date and cascade chain.
5. Cascading edits across files are authorized when an erratum is resolved. Document the cascade chain in the audit-trail entry.

Domain tags: **S** = sitemap, **B** = brief, **V** = voice profile, **T** = transcript.

---

## Things to NEVER do

1. **Never** write "Blue Tree Landscaping" in customer-facing body copy. Origin story and schema only.
2. **Never** write "Healthy Yard" singular. The pillar is "Healthy Yards" plural always.
3. **Never** write "Outdoor Concierge." It was renamed "Premier Outdoor Services" in sitemap v2.1.
4. **Never** use an em dash. Anywhere. Comma, period, parenthesis, or rewrite.
5. **Never** write "Montgomery County" standalone. Pair with "Southeastern PA" or the full five-county list.
6. **Never** write "Founded in Skippack." Blue Tree was founded in Norristown in 1983; the Skippack HQ dates to 2008.
7. **Never** write "40 years" or "15 years" employee tenure. Current is 43 years in business and 13 to 14 year average employee tenure.
8. **Never** name a service Blue Tree doesn't offer (pool emergency repair, sprinkler system installation, smart irrigation controllers, standalone hot tub install pending S5 ruling).
9. **Never** use a high-pressure closer CTA ("Get Started Now," "Call Today"). Form-first only ("Request a Free Consultation"). Phone in footer only.
10. **Never** edit the voice profile, sitemap, parameter sheet, or any creative brief without checking `errata-consolidated.md` first and logging a cascade chain when changes propagate.

---

*Last updated 2026-05-12 by Jason Spencer.*
