# ROI.LIVE Agency Playbook

Agency-level standards, SOPs, methodologies, and templates. These apply to 
all client work unless explicitly overridden in `clients/{client}/standards/`.

## Inheritance model
Agency Core Standards (base layer)
↓
Page-type SOPs (inherit from Core, override where needed)
↓
Client-specific overrides (inherit from Page-type SOPs, rare)

Read from top down. A blog article execution reads:
1. Agency Core Standards
2. Blog Article SOP
3. Client brand context
4. Any client-specific override (rare)

## Core Standards — read on every engagement

**`sops/ROI-LIVE-Agency-Core-Standards-v1.1.md`**
Baseline framework for all client work. Covers:
- SEO philosophy
- Entity SEO (Casey Keith method)
- E-E-A-T framework
- Information Gain framework
- AEO/GEO patterns
- AI search optimization and llms.txt
- AI Writing Artifact Bans (universal Stop Slop enforcement)
- Client parameter intake

Every SOP below inherits from this. Read first, always.

## Page-type SOPs — load when building that page type

| Building this | Load this SOP |
|---|---|
| Homepage | `sops/ROI-LIVE-Agency-Homepage-SOP-v1.md` |
| Service page | `sops/ROI-LIVE-Agency-Service-Page-SOP-v1.1.md` |
| Blog article | `sops/ROI-LIVE-Agency-Blog-Article-SOP-v1.1.md` |
| Case study | `sops/ROI-LIVE-Agency-Case-Study-Page-SOP-v1.md` |
| Collection page | `sops/ROI-LIVE-Agency-Collection-Page-SOP-v1.md` |

## Client setup

**`sops/ROI-LIVE-Client-Parameter-Sheet-Template-v*.md`**
Fill in for every new client engagement. Captures the client parameters 
referenced in §2 of Core Standards.

Location: `clients/{client-name}/client-parameter-sheet.md`

## Gaps to fill (TODO)

These page types are in scope but don't have SOPs yet. Execute using Core 
Standards + closest existing SOP as reference until written:

- [ ] About page SOP
- [ ] Location/Geo page SOP (currently executing using Service Page + Core)
- [ ] Product page SOP (for e-commerce clients)

## When there's no SOP for what you're building

Fall back to Core Standards. Flag the gap to Jason. If the pattern recurs, 
it becomes a new SOP.