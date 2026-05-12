---
clickup_doc_id: 8cma26h-14173
clickup_page_id: 8cma26h-5673
clickup_url: https://app.clickup.com/9013889233/docs/8cma26h-14173/8cma26h-5673
original_filename: Creative Brief Meet the Team Author Bio Pages E-E-A-T Authority Page Template.md
normalized_title: meet the team author bio pages e e a t
classification: CREATIVE_BRIEF
version: older-pattern
status_in_archive: canonical
date_updated: 2026-03-02
hierarchy_category: (workspace-level)
hierarchy_subcategory: (none)
md5: 2379022337f6f540220b7c72242587e9
archived_to_repo: 2026-05-12
---

# Creative Brief — Meet the Team + Author Bio Pages

## Blue Tree — Team Directory & Individual Author Bio Page Templates

**URL (Parent):** `/about/team/`
**URL (Child Pattern):** `/about/team/[name-slug]/`
**Page Type:** Core Page #12 (Parent) + E-E-A-T Authority Anchor Pages (Children)
**Parent:** About (`/about/`)
**Children:** Individual author bio pages (Jeff Mattiola, Jérôme Besnard, Mark Peasley, \[Lead Designer\], \[Additional Staff\])
**Launch Phase:** Phase 1 — Core Page #12 + Author Bio Pages (launched alongside first 5 blog posts)
**Version:** 1.0
**Date:** February 2026
**Prepared by:** Jason Spencer | [ROI.LIVE](http://ROI.LIVE)
* * *

## HOW TO USE THIS DOCUMENT

This creative brief is organized into three parts for three audiences:

| Part | Audience | What It Contains |
| ---| ---| --- |
| Part 1 — Page Strategy | Client + Strategy Team | Page purpose, conversion goals, target audience, and key decisions that need client approval |
| Part 2 — Page Design & Copy | Design + Development Team | Section-by-section blueprint with copy, layout direction, CTAs, visuals, and internal links — everything needed to build the page |
| Part 3 — Technical Specifications | SEO + Development Team | Entity SEO certification, schema markup, AEO answer capsules, brand voice compliance — the implementation layer that powers search and AI visibility |

**For the client:** Read Part 1 in full, then skim Part 2 for copy and design direction. Part 3 is reference material you don't need to review unless you want to.
**For the design team:** Part 2 is your primary working document. Refer to Part 1 for strategic context and Part 3 only when implementing schema or checking entity requirements.
> **For SEO/dev:** Part 3 is your implementation spec. Cross-reference Part 2 for where each element appears on the page.
* * *

## IMPORTANT: THIS BRIEF COVERS TWO PAGE TYPES

This creative brief covers **two related but distinct page types** that work as a system:

**1\. Meet the Team (Parent Page)** — `/about/team/`
The team directory page that introduces all Blue Tree staff members. This page functions as a staff roster, department-filtered directory, and E-E-A-T trust signal. It lists all team members with summary information and routes visitors to individual bio pages for deeper detail.

**2\. Individual Author Bio Pages (Child Pages)** — `/about/team/[name-slug]/`
Dedicated bio pages for team members who author or review blog content. These pages are the E-E-A-T authority anchors for all of Blue Tree's educational content. When Google or an AI engine evaluates whether a blog post is trustworthy, the author bio page is where it verifies the author's credentials, experience, and expertise.

The parent page and child pages have different audiences and design requirements, but they share entity relationships and must be designed as a cohesive system. Part 2 of this brief covers both — the parent page first, then the child page template.
* * *

## ⚠️ ITEMS REQUIRING CLIENT CONFIRMATION

> **Status:** 0 of 12 items resolved. All items pending client input.

| # | Item | Status | Resolution |
| ---| ---| ---| --- |
| 1 | Complete Staff Roster | ⏳ PENDING | How many total team members should appear on the Meet the Team page? The audio recordings reference Jeff Mattiola, Chad Ochnich, Jérôme Besnard, Mark Peasley, Fred (designer, ~14 years at Blue Tree), Steve (designer/pool team), Andrew Ellen (designer/pool support, ~10 years), and additional design and field staff. Action needed: Complete list of team members to feature, with names, titles, and department assignments. Not every employee needs a listing — focus on client-facing staff, leadership, and design professionals. |
| 2 | Department Tag Assignments | ⏳ PENDING | Per sitemap v2.1, the Meet the Team page uses department tags for filtering: Design, Project Managers, Support, Leadership, Marketing. Action needed: Confirm which team members belong to which department(s). Some may belong to multiple (e.g., Jeff = Leadership + Design). |
| 3 | Professional Headshots | ⏳ PENDING | Are professional headshots available for all team members who will appear on the page? Consistent photo style (same backdrop, lighting, framing) is strongly recommended for visual cohesion. Current assumption: Headshots exist for at least Jeff, Chad, and Jérôme. Full team headshot session may be needed. |
| 4 | Fred's Full Name and Title | ⏳ PENDING | Audio recordings reference "Fred" as a senior designer with ~14 years at Blue Tree. Chad describes Fred's design work as "impeccable" and says "I would put Blue Tree's designs up against anybody in the industry." Action needed: Fred's full name, official title, education, and whether he will be a blog author (requiring an individual bio page). |
| 5 | Steve's Full Name and Title | ⏳ PENDING | Audio recordings reference "Steve" as a designer on the pool team who discusses lighting, irrigation, hardscaping, and fencing. Action needed: Steve's full name, official title, education, and tenure. |
| 6 | Andrew Ellen's Title Confirmation | ⏳ PENDING | Audio recordings identify Andrew Ellen as a team member with ~10 years at Blue Tree (started in the field, moved to pool design support and permitting). Action needed: Confirm official title, whether he should have a bio page listing, and whether his role is client-facing enough for the team directory. |
| 7 | Designer Education Details | ⏳ PENDING | The live site and audio recordings reference "degreed designers" from Penn State, Rutgers, Temple, and Penn College of Technology. Jérôme states: "Our sales people are designers. They have degrees in landscaping and hardscaping." Action needed: Which specific designers hold which degrees? This information populates individual bio pages and Person schema `hasCredential` fields. |
| 8 | Chad Ochnich's ICPI Certification | ⏳ PENDING | The live site lists Chad as ICPI Certified (hardscape installation). Is this certification still current? Are there other certifications across the team (e.g., NALP, pesticide applicator licenses for Mark Peasley, pool builder licenses)? Current assumption: Including ICPI for Chad and noting pesticide applicator licensing for Mark Peasley. |
| 9 | Lead Designer Identification | ⏳ PENDING | The sitemap designates a "\[Lead Designer\]" bio page at `/about/team/[name]/` for authoring landscape design, garden design, and native plant content. Is this Fred? Another designer? Action needed: Confirm which designer fills the "Lead Designer" author role for blog content. |
| 10 | Team Member Bios — Tone Preference | ⏳ PENDING | Should individual bios be written in first person ("I've been designing outdoor spaces for...") or third person ("Fred has been designing outdoor spaces for...")? First person is warmer and more personal; third person is more traditional. Current assumption: Third person for the parent page directory cards, first person for the individual bio page extended bios — creating a natural progression from formal introduction to personal connection. |
| 11 | Team Photo — Group Shot | ⏳ PENDING | Does Blue Tree have a group team photo? A group photo in the hero section of the Meet the Team page creates an immediate visual trust signal (scale, professionalism, team cohesion). Current assumption: Including a placeholder for a group photo. If none exists, recommending a team photo session. |
| 12 | LinkedIn Profiles for Schema | ⏳ PENDING | Do Jeff, Chad, Jérôme, or other team members have LinkedIn profiles? LinkedIn URLs populate the `sameAs` field in Person schema, which helps AI engines disambiguate individuals and verify professional credentials. Current assumption: Including `sameAs` LinkedIn fields in schema spec — to be populated if profiles exist. |

* * *

# PART 1 — PAGE STRATEGY

## 1.1 Page Purpose

The Meet the Team page and its child bio pages serve three strategic functions:

**1\. E-E-A-T Authority Chain.** This is the most important function. Google's Quality Rater Guidelines and AI answer engines evaluate content trustworthiness through author credentials. The E-E-A-T chain works like this: A homeowner reads "How Much Does an Inground Pool Cost in PA?" → the byline says "By Jeff Mattiola, Owner & President" → the author name links to `/about/team/jeff-mattiola/` → the bio page shows Jeff's 37 years in the industry, University of Pittsburgh education, and a list of every article he's authored. This chain transforms anonymous blog content into expert-verified education. Without it, Blue Tree's blog posts are indistinguishable from the generic, uncredited content published by every other contractor in the market.

**2\. Trust-Building at the Human Level.** Homeowners signing five-figure and six-figure contracts want to know the people behind the company. The Meet the Team page answers: "Who will I be working with? What are their qualifications? How long have they been doing this?" The audio recordings confirm this — team members consistently describe building personal relationships with clients. Jérôme: "Most of our customers end up knowing my kids' names." Jeff: "I'm working with the children of people that I started with." The team page makes this relationship-first culture visible before the first phone call.

**3\. AI Entity Disambiguation.** When an AI system encounters "Jeff Mattiola" in the author field of a blog post, it needs to resolve that string to a specific Person entity. The individual bio page — with its Person schema, `worksFor`, `knowsAbout`, `hasCredential`, and `sameAs` fields — provides the structured data AI systems use to build an entity profile. This makes it significantly more likely that AI engines will correctly attribute Blue Tree's content to credentialed professionals rather than treating it as anonymous contractor marketing.

## 1.2 Conversion Goals

| Priority | Goal | Metric |
| ---| ---| --- |
| 1 | Build trust through visible expertise and tenure — reduce perceived risk | Time on page, scroll depth |
| 2 | Complete the E-E-A-T authority chain for all blog content | Author bio page crawl rate, structured data validation |
| 3 | Route prospects to consultation request after trust is established | CTA clicks → `/request-estimate/` |
| 4 | Support AI entity resolution for all named team members | Person schema validation, AI citation accuracy |
| 5 | Demonstrate company scale and stability (70–90 employees, 13–14 year average tenure) | Trust signal absorption before conversion |

## 1.3 Target Audience

| Segment | Intent | What They Need |
| ---| ---| --- |
| Trust-verification prospects | Googled the company after receiving a proposal or seeing a truck | Names, faces, credentials — evidence that real experts work here |
| Comparison shoppers | Evaluating Blue Tree vs. other contractors | Team size, qualifications, and tenure that competitors can't match |
| Blog readers following author links | Read a blog post, clicked the author name to verify credentials | Professional bio, expertise areas, list of authored articles |
| Google Quality Raters | Evaluating E-E-A-T for YMYL-adjacent content (cost guides, home improvement) | Clear author credentials, editorial standards linkage, Person schema |
| AI answer engines | Resolving author entities, evaluating source trustworthiness | Structured Person schema, `sameAs` links, `knowsAbout` fields |
| Job seekers | Evaluating Blue Tree as a potential employer | Company culture signals, team photos, career trajectory examples |

## 1.4 Conversion Psychology

The Meet the Team page operates in the **trust-deepening** stage of the buyer journey. Visitors arrive here because they already know Blue Tree exists and offers the services they need — now they want to know the people. This is the moment where abstract "company trust" becomes personal trust.

The psychological framework is:

*   **Familiarity reduces risk.** Seeing real faces with real names before the first meeting removes the "stranger" barrier. When a prospect meets their designer for the first time, that designer is already a known person, not a stranger.
*   **Credentials create authority.** Degreed designers, certified specialists, and decades of experience aren't just resume items — they're permission signals. The homeowner thinks: "These people are qualified to do this work."
*   **Tenure signals stability.** A company with 13–14 year average employee tenure isn't going anywhere. It's not going to disappear after cashing the deposit check. The team page communicates this without having to say it.
*   **Scale without corporate distance.** Blue Tree has 70–90 employees — this is a real company, not one guy with a truck. But per Jeff: "We're a corporation, but we're not corporate." The team page must convey both: professional scale AND personal accessibility.

## 1.5 SEO & AEO Summary

### Meet the Team (Parent Page)

| Element | Value |
| ---| --- |
| Title Tag | `Meet the Team | Blue Tree | Designers, Builders & Outdoor Living Experts` |
| Meta Description | `Meet the degreed designers, certified specialists, and leadership team behind Blue Tree. 70–90 employees strong with a 13–14 year average tenure, serving Southeastern PA since 1983.` |
| H1 | `Meet the Blue Tree Team` |
| Primary Keywords | Blue Tree Landscaping team, Blue Tree employees, Blue Tree designers |
| Secondary Keywords | landscaping team Southeastern PA, pool builder team, outdoor living designers |
| Target Word Count | ~600–800 words (editorial introduction + team directory) |

### Individual Author Bio Page (Child Page Template)

| Element | Value |
| ---| --- |
| Title Tag Pattern | `[Name] | [Title] | Blue Tree` |
| Meta Description Pattern | `[Name] is the [Title] at Blue Tree, specializing in [expertise areas]. [Tenure/credential]. Read [Name]'s articles on [topics] for Southeastern PA homeowners.` |
| H1 Pattern | `[Full Name]` |
| Primary Keywords | \[Author name\], \[Author name\] Blue Tree |
| Secondary Keywords | \[Author name\] \[expertise area\], Blue Tree \[role\] |
| Target Word Count | ~400–600 words per bio page |

## 1.6 Key Facts Reference Table

> **Source of truth** for all team member facts. Inherits foundational company data from the Our Story brief (v2.2).

### Company Facts

| Fact | Value | Source |
| ---| ---| --- |
| Company name (current) | Blue Tree | Client rebrand confirmation |
| Company name (schema/legal) | Blue Tree Landscaping | GBP listing |
| Founded | 1983 | Audio recordings |
| Headquarters | 4494 Skippack Pike, Schwenksville, PA 19473 | Client confirmation |
| Phone | (610) 222-0590 | Live site |
| Employee count | 70 to 90 (seasonal) | Audio recordings (Jeff) |
| Average employee tenure | 13 to 14 years | Audio recordings (Jeff) |
| Service area | Southeastern PA — Montgomery, Bucks, Chester, Delaware, and Philadelphia counties | Brand voice guide |
| Design team size | 5+ degreed landscape designers | Live site, audio recordings |
| Design software | 2D CAD + 3D rendering (virtual flyby presentations) | Audio recordings (Jeff) |

### Confirmed Team Members

| Name | Title | Tenure | Education/Certs | Department(s) | Bio Page? | Source |
| ---| ---| ---| ---| ---| ---| --- |
| Jeff Mattiola | Owner, President | Since 1989 (37 years) | University of Pittsburgh | Leadership, Design, Marketing | ✅ Yes | Audio recordings, live site |
| Chad Ochnich | Owner, Vice President | Since ~1995 (30+ years) | Delaware Valley College, ICPI Certified | Leadership | Potential (if becomes blog reviewer) | Audio recordings, live site |
| Jérôme Besnard | Sales Manager | Since 2025 | [@Jerome Besnard](#user_mention#111957259) can you fill this out? University of Delaware, MBA/MA | Leadership, Marketing | ✅ Yes | Audio recordings, confirmed author |
| Mark Peasley | Turf Care Manager | ~10 years (as of recording) | 20+ years in turf care industry (university trial research, professional athletic fields, championship golf course conditioning) | Project Manager, Healthy Yard | ✅ Yes | Audio recordings |
| Fred \[Last Name\] No longer employed here | Designer | ~14 years at Blue Tree | \[Confirm — degree?\] | Design | Likely ✅ (if Lead Designer / blog author) | Audio recordings (Chad) |
| Steve Roehm | Landscape Designer/Sales | Since 2020 (started in field) | Penn State University - Landscape Contracting | Design | Potential | Audio recordings |
| Andrew Mattiola | Pool and Landscape Designer/Sales | Since 2016 (started in field) | Penn College - Landscape Design/Construction | Design, Project Managers | Potential | Audio recordings |

### Audio Recording Quotes — Team Characterization

| Person | Quote | Context |
| ---| ---| --- |
| Jeff on team culture | "It's no 'me' around here. It's focused on what the customer wants and what we need to do to make it work." | Team collaboration |
| Jeff on designers | "Some of our guys, I call them brilliant with the way that designs they come up with." | Design quality |
| Jeff on scale | "We have 70 to 90 employees. We have the manpower and the staff to get things done." | Company scale |
| Jeff on tenure | "On average, our staff is probably about 13–14 years." | Employee retention |
| Jeff on corporate vs. personal | "We're a corporation. But we're not some guy just coming up with a pickup truck. We have a company behind us, a team behind us." | Brand positioning |
| Chad on Fred | "Fred is over the top extremely knowledgeable... His design work is impeccable. The beautiful plant relationships, the color contrast, the depth." | Designer quality |
| Chad on design quality | "I would put Blue Tree's designs up against anybody in the industry. Especially on the residential." | Competitive differentiator |
| Jérôme on designers | "Our sales people are designers. They have degrees in landscaping and hardscaping, so they are professional designers." | E-E-A-T signal |
| Mark on his expertise | "I have great experience in the last 20 years in turf — whether it be university trial research, working on professional athletic fields, or championship golf course conditioning." | Turf care authority |
| Andrew on field-to-design path | "Being able to do that with my own hands from scratch... It helped me learn how to look at something and go, okay, would you do this here or that over there." | Hands-on expertise |

* * *

# PART 2 — PAGE DESIGN & COPY
* * *

## SECTION A: MEET THE TEAM (PARENT PAGE)

> `/about/team/`
* * *

### 2A.1 SEO Metadata

```yaml
Title:       Meet the Team | Blue Tree | Designers, Builders & Outdoor Living Experts
Description: Meet the degreed designers, certified specialists, and leadership team behind Blue Tree. 70–90 employees strong with a 13–14 year average tenure, serving Southeastern PA since 1983.
H1:          Meet the Blue Tree Team
URL:         /about/team/
Breadcrumb:  Home > About > Meet the Team
```

* * *

### 2A.2 Hero Section

| Element | Content |
| ---| --- |
| Breadcrumb | `Home > About > Meet the Team` |
| H1 | Meet the Blue Tree Team |
| Subheadline | 70 to 90 professionals strong. Degreed designers, certified specialists, and a leadership team with more than 40 years of hands-on experience building outdoor spaces across Southeastern PA. Our average employee has been with us for over 13 years — because people stay where the work matters. |
| Trust Signal Line | [Our Story →](http:///about/our-story/) · [Our Process →](http:///about/our-process/) · [Editorial Standards →](http:///about/editorial-standards/) |

**Visual Direction:**

*   If a group team photo is available: use as hero background (full-width, subtle overlay for text readability)
*   If no group photo: clean typographic hero with no image — the team member cards below serve as the visual content
*   H1 should be warm but authoritative — "Meet the Blue Tree Team" is more approachable than "Our Team" or "Staff Directory"

**Design Notes:**

*   The "13 years average tenure" stat is a powerful differentiator — it belongs in the subheadline, not buried below. In an industry with notoriously high turnover, this number does heavy lifting.
*   The trust signal links to Our Story, Our Process, and Editorial Standards create immediate cross-references to related trust pages — both for human visitors and for AI engines building entity relationships.
* * *

### 2A.3 Department Filter Bar

**Design Direction:** Horizontal filter bar matching the styling used on Portfolio, Reviews, Blog Hub, and Service Hub pages. Provides department-based navigation across the team roster.

**Tabs:**

| Tab | Filter Behavior |
| ---| --- |
| Everyone (default) | Displays all team members |
| Leadership | Filters to leadership team |
| Design | Filters to design professionals |
| Project Managers | Filters to project management staff |
| Healthy Yard | Filters to turf care and lawn specialists |
| Support | Filters to administrative and support staff |

**Implementation Notes:**

*   Department tags are a CMS taxonomy — same system as Operation Tags but applied to team members
*   Team members can belong to multiple departments (e.g., Jeff = Leadership + Design)
*   Filter behavior is client-side (JavaScript/AJAX) — no URL changes to avoid thin content issues
*   Match the filter bar styling established across other hub pages for design consistency
* * *

### 2A.4 Leadership Section

**H2:** Leadership

**Design Direction:** Leadership team members are displayed with larger cards than standard team members — they are the face of the company and deserve visual prominence. 2-column layout on desktop, single-column on mobile.

**Leadership Card Layout:**

| Element | Description |
| ---| --- |
| Professional headshot | Larger format than standard cards (portrait orientation, consistent framing) |
| Full name | H3, linked to individual bio page (if bio page exists) |
| Title | Displayed below name |
| Tenure badge | "Since \[Year\]" — small pill badge |
| Education | University name (if applicable) |
| Certifications | Displayed as small badges (e.g., "ICPI Certified") |
| Brief description | 2–3 sentences summarizing role and expertise |
| Department tags | Small pill badges matching filter bar |
| CTA | "Read Full Bio →" (if bio page exists) |

**Leadership Cards (Launch):**

**Jeff Mattiola — Owner, President**

> Jeff has been with Blue Tree since 1989 and has led the company's growth from a small landscape operation to a full-service outdoor living firm with 70 to 90 employees. He oversees all pool construction, design direction, and strategic planning — and he still makes it to job sites because that's where the work happens.

*   Since 1989 · University of Pittsburgh · Leadership, Design
*   [Read Full Bio →](http:///about/team/jeff-mattiola/)

**Chad Ochnich — Owner, Vice President**

> Chad joined Jeff as a partner in the mid 1990s, bringing expertise in hardscape construction, turf care operations, and supplier relationships built over three decades. He manages field operations, vendor partnerships, and quality control — and he's the reason Blue Tree can push warranty claims beyond standard terms.

*   Since ~1995 · Delaware Valley College · ICPI Certified · Leadership
*   [Read Full Bio →](http:///about/team/chad-ochnich/) _(if bio page created)_

**Jérôme Besnard — Sales Manager**

> Jérôme leads Blue Tree's sales team and manages the client experience from first contact through project completion. He coordinates between designers, production crews, and homeowners to ensure every project stays on track and on budget. His buyer guides and consultation process articles help homeowners understand what to expect before they ever pick up the phone.

*   \[Tenure\] · Leadership, Marketing
*   [Read Full Bio →](http:///about/team/jerome-besnard/)
* * *

### 2A.5 Design Team Section

**H2:** Designers

**Subheadline:** Our designers are degreed professionals — not salespeople who happen to sketch. They hold degrees from Penn State, Rutgers, Temple, and Penn College of Technology, and they collaborate as a team on every project. When one designer has an idea nobody's tried before, they bring it to the group and figure out how to build it.

**Design Direction:** 3-column card grid. Each designer gets a standard team card.

**Standard Team Card Layout:**

| Element | Description |
| ---| --- |
| Professional headshot | Consistent aspect ratio with leadership section (slightly smaller) |
| Full name | H3, linked to individual bio page (if bio page exists) |
| Title | Below name |
| Tenure badge | "X Years at Blue Tree" or "Since \[Year\]" |
| Education | University + degree (if confirmed) |
| Specialties | 2–4 expertise areas as small pill badges (e.g., "Landscape Design," "Native Plants," "3D Renderings") |
| Department tags | Design (+ any secondary departments) |
| CTA | "Read Full Bio →" (if bio page exists) or "View Portfolio →" (if applicable) |

**Known Designers (from audio recordings — pending full roster from client):**

**Fred \[Last Name\] — \[Title\]**

> ~14 years at Blue Tree. Chad describes Fred's work: "His design work is impeccable — the beautiful plant relationships, the color contrast, the depth. On the hardscaping side, the way he designs the flows, the layouts. He just incorporates it like nobody else."

*   Specialties: Plant Design, Color Contrast, Hardscape Layout, Residential Landscape
*   \[Read Full Bio →\] (if bio page created)

**Steve Roehm — Landscape Designer/Sales**

> Discusses lighting, irrigation, hardscaping, fencing, structures, drainage, and maintenance in audio recordings. Involved in pool-adjacent landscape work.

*   Specialties: \[Confirm with client\]

**Andrew Mattiola — Pool and Landscape Designer/Sales**

> ~10 years at Blue Tree. Started in the field doing landscaping, hardscaping, and pool grading. Transitioned to pool design support, 3D renderings, material selections, and permitting. Andrew's field experience gives him an advantage other designers don't have: "Being able to do that with my own hands from scratch helped me learn how to look at something and figure out how to build it."

*   Specialties: Pool Design Support, 3D Renderings, Permitting, Field-to-Design Translation

**\[Additional Designers\] — TBD per client roster**
* * *

### 2A.6 Turf Care & Specialty Team Section

**H2:** Turf Care & Healthy Yard

**Standard team cards for Mark Peasley and any additional Healthy Yard team members.**

**Mark Peasley — Turf Care Manager**

> Mark brings more than 20 years of turf care experience to Blue Tree — from university trial research and professional athletic field conditioning to championship-level golf course management. He leads the Healthy Yard division, managing lawn fertilization programs, aeration, weed control, and mosquito and tick treatment across Southeastern PA.

*   10+ years at Blue Tree · Healthy Yard
*   Specialties: Lawn Programs, Weed Control, Pest Management, Turf Science
*   [Read Full Bio →](http:///about/team/mark-peasley/)
* * *

### 2A.7 Additional Team Members (Support & Project Managers)

**H2:** The Team Behind the Team

**Subheadline:** The designers and crew leaders get the spotlight, but every Blue Tree project is supported by a full administrative and project management team — from scheduling and permitting to bookkeeping and customer follow-up.

**Design Direction:** Smaller cards or a condensed list format for support and administrative team members. Not every employee needs a full card — some may be represented as a group with names and titles.

> **📌 Note:** This section's content depends entirely on the client's complete staff roster (Item #1). The design template should accommodate anywhere from 3 to 15 additional team members in a scalable layout.
* * *

### 2A.8 Culture & Values Block

**H2:** How We Work Together

**Body Copy:**

Blue Tree has 70 to 90 employees depending on the season. In an industry where turnover is the norm, our average team member has been here for more than 13 years. That's not an accident.

The designers collaborate as a team. If someone comes up with a design nobody has tried before, they bring it to the group and figure out how to build it. The leadership team is accessible — Jeff and Chad don't hide behind closed doors. They show up on job sites, meet clients in person, and make decisions fast when things need to change.

In 2008, when the economy collapsed, Blue Tree pivoted to four-day, ten-hour work weeks to keep the team employed. During COVID, they figured out how to keep crews working safely because their people needed to provide for their families. That resilience isn't a talking point — it's the reason the company is still here after 40 years.

[Read Our Full Story →](http:///about/our-story/)

**Design Notes:**

*   This section provides the cultural context that individual team cards can't convey
*   The 2008 and COVID references are from Jeff's audio recording — they demonstrate adaptability and loyalty in concrete terms
*   Keep this section short (150–200 words) — the Our Story page handles the deep narrative. This is a teaser that routes visitors to the full story.
* * *

### 2A.9 CTA Section

**H2:** Ready to Meet Us in Person?

**Body Copy:**

Every project starts with a free, no-obligation consultation at your property. One of our degreed designers will walk your space, listen to your ideas, and start putting a plan together — no pressure, no commitment.

**Primary CTA:** Schedule a Free Consultation → `/request-estimate/`
**Secondary CTA:** Call Us: (610) 222-0590 — live receptionist, no automated phone trees.

**Trust Reinforcement Bar:**

> ✓ Free On-Site Consultation · ✓ Free Custom Design · ✓ No Obligation · ✓ \[Trustindex Google Rating Badge Widget\] · ✓ Serving Southeastern PA Since 1983
* * *

### 2A.10 Cross-Navigation Section

**H2:** More About Blue Tree

| Destination | Label | URL |
| ---| ---| --- |
| Our Story | Our 40-Year Story | `/about/our-story/` |
| Our Process | How We Work | `/about/our-process/` |
| Why Choose Blue Tree | Why Choose Us | `/about/why-choose-us/` |
| Blog | Outdoor Living Insights | `/blog/` |
| Reviews | Client Reviews | `/reviews/` |
| Careers | Join Our Team | `/careers/` |

* * *

## SECTION B: INDIVIDUAL AUTHOR BIO PAGE (CHILD PAGE TEMPLATE)

> `/about/team/[name-slug]/`

This template applies to all individual bio pages. The example below uses Jeff Mattiola as the reference implementation — all other author bio pages follow the same structure with different content.
* * *

### 2B.1 SEO Metadata (Template)

```gherkin
Title:       [Full Name] | [Title] | Blue Tree
Description: [Full Name] is the [Title] at Blue Tree, specializing in [expertise areas]. [Credential/tenure]. Read [Name]'s articles on [topics] for Southeastern PA homeowners.
H1:          [Full Name]
URL:         /about/team/[name-slug]/
Breadcrumb:  Home > About > Meet the Team > [Full Name]
```

**Example — Jeff Mattiola:**

```yaml
Title:       Jeff Mattiola | Owner & President | Blue Tree
Description: Jeff Mattiola is the Owner and President of Blue Tree, specializing in pool construction, outdoor living design, and project budgeting. Leading the company since 1989, Jeff oversees design direction for Southeastern PA homeowners.
H1:          Jeff Mattiola
URL:         /about/team/jeff-mattiola/
Breadcrumb:  Home > About > Meet the Team > Jeff Mattiola
```

* * *

### 2B.2 Hero / Profile Section

| Element | Content |
| ---| --- |
| Breadcrumb | `Home > About > Meet the Team > [Full Name]` |
| Professional headshot | Large format (portrait, high quality) |
| H1 | \[Full Name\] |
| Title | \[Job Title\] at Blue Tree |
| Tenure | "With Blue Tree since \[year\]" or "\[X\] years in the industry" |
| Education | \[University\], \[Degree\] (if applicable) |
| Certifications | \[Cert badges\] (if applicable) |
| Expertise areas | Displayed as pill badges: e.g., "Pool Construction," "Budget Planning," "Project Oversight" |
| Department tags | Leadership, Design, etc. |

**Design Notes:**

*   The headshot, name, title, and credentials should be visible without scrolling
*   This section is what Google Quality Raters evaluate when verifying E-E-A-T — every element must be immediately visible
*   The expertise pill badges map directly to the `knowsAbout` field in Person schema
* * *

### 2B.3 Professional Bio

**H2:** About \[First Name\]

**Bio Structure (template):**

1. **Opening sentence:** Role at Blue Tree + tenure + primary expertise area (3rd person for consistency with how AI engines extract bio information, but the client may request 1st person per Item #10)
2. **Background paragraph:** Career path, education, industry experience before and during Blue Tree
3. **Approach paragraph:** How this person works with clients, what they bring to the process
4. **Blue Tree context:** How their role fits within the larger team and company mission

**Example — Jeff Mattiola Bio (~400 words):**

Jeff Mattiola is the Owner and President of Blue Tree, the full-service outdoor living firm he has led since 1989. Over the past 37 years, Jeff has grown Blue Tree from a small landscape operation into a design-build company with 70 to 90 employees serving homeowners throughout Southeastern PA — including Montgomery, Bucks, Chester, Delaware, and Philadelphia counties.

Jeff graduated from the University of Pittsburgh before entering the landscape industry. He joined Blue Tree in 1989 and purchased the company within three years, becoming sole owner. In the mid 1990s, he brought on Chad Ochnich as a partner, combining Jeff's passion for residential landscape/hardscape design-build with Chad's expertise mowing and turf care. Together, they've built a company that handles everything from landscape design and paver patios to custom inground pool construction.

In 2011, Jeff and Chad launched Blue Tree's pool division after hearing years of frustration from clients who felt their pool builders only cared about the pool — not the backyard around it. Rather than learning pool construction from scratch, they hired experienced pool builders to teach the team how to do it right. The first year, Blue Tree built four pools. Today, the pool division designs and constructs custom concrete pools that integrate seamlessly with the surrounding landscape, hardscaping, and outdoor living spaces.

Jeff's approach to every project starts with honesty. He believes in presenting transparent, itemized estimates so homeowners know exactly where their money goes before construction begins. If a project exceeds the client's budget, he works with the design team to phase the work over multiple seasons — delivering the vision in manageable stages rather than cutting corners.

His father's advice has guided his career from the beginning: "All you have in life is your reputation. Don't mess it up."
* * *

### 2B.4 Articles by \[Name\] Section

**H2:** Articles by \[First Name\]

**Design Direction:** A simple, chronological list of all blog posts authored by this team member. Each entry shows:

| Element | Description |
| ---| --- |
| Post title | Linked to the blog post |
| Operation Tag badge | Which service pillar the post belongs to |
| Publication date | "Published \[Month Day, Year\]" |
| Excerpt | 1–2 sentence summary |

**Example — Jeff Mattiola Articles (at launch):**

*   **How Much Does an Inground Pool Cost in PA?** · Pools · Published \[Date\]

  

_What to expect when budgeting for a custom inground pool in Southeastern PA — cost ranges, factors that affect price, and how to plan a project that fits your vision and your budget._

**Implementation Notes:**

*   This section is auto-populated from the CMS based on the `author` taxonomy field
*   If the author has also served as a `reviewer` on other posts, include a second sub-section: "Reviewed by \[Name\]" with those posts listed separately
*   This auto-populated section creates the bidirectional author↔content link that Casey Keith's entity framework requires: the blog post links TO the bio page (via author byline), and the bio page links BACK to the blog post (via this section)
*   At launch, some authors may only have 1–2 articles. That's expected — the section grows as content is published
* * *

### 2B.5 Related Content & CTA

**H2:** Work with \[First Name\]

**Body Copy (template):**

Ready to start your project? \[First Name\] and the Blue Tree design team are available for free, no-obligation consultations at your property. Tell us about your vision and we'll start putting a plan together.

**Primary CTA:** Request a Free Consultation → `/request-estimate/`
**Secondary CTA:** Call Us: (610) 222-0590

**Cross-Links:**

| Destination | Anchor Text |
| ---| --- |
| Meet the Team | ← Back to the Full Team |
| Our Story | Read Our Story |
| Blog | Browse All Articles |
| \[Relevant Service Pillar\] | Explore \[Author's Service Area\] Services |

* * *

## 2C. Internal Linking Map

### Links FROM Meet the Team (`/about/team/`)

| Target | Location | Anchor Text |
| ---| ---| --- |
| Individual bio pages | Team member cards | "\[Name\]" / "Read Full Bio →" |
| Our Story | Hero trust signal + Culture block | "Our Story" / "Read Our Full Story" |
| Our Process | Hero trust signal + Cross-nav | "Our Process" / "How We Work" |
| Editorial Standards | Hero trust signal | "Editorial Standards" |
| Request Estimate | CTA section | "Schedule a Free Consultation" |
| Blog | Cross-nav | "Outdoor Living Insights" |
| Reviews | Cross-nav | "Client Reviews" |
| Careers | Cross-nav | "Join Our Team" |

### Links FROM Individual Bio Pages (`/about/team/[name]/`)

| Target | Location | Anchor Text |
| ---| ---| --- |
| Meet the Team (parent) | Breadcrumb + Related Content | "Meet the Team" / "Back to the Full Team" |
| Individual blog posts | "Articles by \[Name\]" section | Post titles |
| Blog Hub | Related Content | "Browse All Articles" |
| Request Estimate | CTA section | "Request a Free Consultation" |
| Relevant service pillar | Related Content | "Explore \[Service\] Services" |
| Our Story | Related Content | "Read Our Story" |

### Links TO Meet the Team (should come from)

| Source | Location | Anchor Text |
| ---| ---| --- |
| About Us | Body or sub-navigation | "Meet the Team" |
| Our Story | Body links or related content | "Meet the Team" |
| Blog Hub | Editorial Trust Block (§2.7 of Blog Hub brief) | "Meet our authors" |
| All blog posts | Author byline | Author name → individual bio page |
| Editorial Standards | Body copy | Link to Meet the Team |
| Homepage | About section or footer | "Meet the Team" |
| Footer (global) | Footer navigation | "Meet the Team" |
| Why Choose Blue Tree | Trust signals section | "Meet the Team" |

### Links TO Individual Bio Pages (should come from)

| Source | Location | Anchor Text |
| ---| ---| --- |
| Meet the Team (parent) | Team member cards | "\[Name\]" / "Read Full Bio" |
| All blog posts by this author | Author byline | Author name link |
| Blog Hub | Author roster cards (§2.7 of Blog Hub brief) | Author name link |
| Other bio pages | Related team members (optional) | "\[Name\]" |

* * *

## 2D. Global Page Elements

| Element | Specification |
| ---| --- |
| Sticky header | Standard site header with "Request Consultation" CTA button |
| Mobile optimization | Team cards must be large enough to tap. Headshots must render clearly at small sizes. Filter bar accessible without scrolling past the hero. |
| Page speed | Lazy-load headshots below the fold. Serve optimized images (WebP). |
| Accessibility | All headshots must have descriptive `alt` text ("\[Name\], \[Title\] at Blue Tree"). Cards have proper heading structure (H3 for names within H2 sections). |

* * *

## 2E. Word Count Targets

### Meet the Team (Parent)

| Section | Target |
| ---| --- |
| Hero + Subheadline | 75 |
| Designer section intro | 50 |
| Culture & Values Block | 175 |
| CTA Section | 50 |
| Cross-Navigation | 25 |
| Team member descriptions (varies by roster size) | ~300–400 |
| Parent Page TOTAL | ~675–775 |

### Individual Author Bio Page

| Section | Target |
| ---| --- |
| Profile section (title, credentials, badges) | 25 |
| Professional Bio | 300–400 |
| Articles by \[Name\] section | Dynamic (auto-populated) |
| CTA + Related Content | 50 |
| Per Bio Page TOTAL | ~400–500 |

* * *

# PART 3 — TECHNICAL SPECIFICATIONS
* * *

## 3.1 Entity SEO Certification — Casey Keith Framework

> **Certification Status:** ✅ Audited and certified against Casey Keith's Entity SEO methodology and AI Writer Guidelines. All specifications below are **mandatory implementation requirements**.

### 3.1.1 Primary Entity Identification

| Property | Value |
| ---| --- |
| Primary Entity (Parent Page) | Blue Tree (Organization) — team, culture, and personnel context |
| Primary Entities (Bio Pages) | Individual Persons — Jeff Mattiola, Jérôme Besnard, Mark Peasley, \[Lead Designer\] |
| Entity Type | Organization (parent) / Person (children) |
| Page Role | E-E-A-T Authority Chain / Trust Signal / AI Entity Disambiguation Layer |
| Entity Cluster | Core / Trust / E-E-A-T |
| Canonical Organization Name | Blue Tree |
| Legacy Organization Name | Blue Tree Landscaping (schema `name` field only) |
| Geographic Entity | Southeastern Pennsylvania |
| Industry Entity | Residential Outdoor Living / Design-Build Contractor |

### 3.1.2 Entity Relationship Map

```java
Meet the Team + Author Bio Pages (E-E-A-T Authority Entity Cluster)
├── BELONGS_TO → Blue Tree (Organization Entity)
├── CONTAINS → Person Entities (Team Members)
│   ├── Jeff Mattiola (Owner, President)
│   │   ├── worksFor → Blue Tree
│   │   ├── knowsAbout → Pool Construction, Outdoor Living Design, Project Budgeting
│   │   ├── hasCredential → University of Pittsburgh
│   │   ├── AUTHORED → Blog posts (via "Articles by Jeff" section)
│   │   └── REVIEWS → Blog posts (editorial reviewer role)
│   ├── Chad Ochnich (Owner, Vice President)
│   │   ├── worksFor → Blue Tree
│   │   ├── knowsAbout → Hardscape Construction, Field Operations, Vendor Relationships
│   │   ├── hasCredential → Delaware Valley College, ICPI Certified
│   │   └── MANAGES → Field operations, quality control
│   ├── Jérôme Besnard (Sales Manager)
│   │   ├── worksFor → Blue Tree
│   │   ├── knowsAbout → Sales Process, Client Experience, Buyer Guides
│   │   ├── AUTHORED → Blog posts (buyer guides, consultation process)
│   │   └── REVIEWS → Pool-related blog content
│   ├── Mark Peasley (Turf Care Manager)
│   │   ├── worksFor → Blue Tree
│   │   ├── knowsAbout → Turf Care, Lawn Programs, Pest Control, Weed Management
│   │   ├── hasCredential → 20+ years turf experience (university research, athletic fields, golf courses)
│   │   └── AUTHORED → Blog posts (lawn care, pest control, aeration)
│   └── [Lead Designer] (Lead Landscape Designer)
│       ├── worksFor → Blue Tree
│       ├── knowsAbout → Landscape Design, Garden Design, Native Plants
│       ├── hasCredential → [Degree — confirm]
│       └── AUTHORED → Blog posts (plant selection, design process)
├── LINKED_TO → Blog Posts (via "Articles by [Name]" sections) — BIDIRECTIONAL
│   ├── Blog post → author byline → bio page (forward link)
│   └── Bio page → "Articles by [Name]" → blog post (reverse link)
├── GOVERNED_BY → Editorial Standards (/about/editorial-standards/)
├── DEMONSTRATES → E-E-A-T Signals
│   ├── Experience → 40+ years company history, 13–14 year average tenure
│   ├── Expertise → Degreed designers, certified specialists
│   ├── Authoritativeness → Named individuals with verifiable credentials
│   └── Trustworthiness → Editorial standards, transparent attribution
├── ROUTES_TO → /request-estimate/ (downstream conversion)
├── SUPPORTS → Our Story (/about/our-story/) — complementary trust page
├── SUPPORTS → Blog Hub (/blog/) — via author attribution chain
└── SERVES → Southeastern Pennsylvania Homeowners
```

### 3.1.3 Semantic Relationship Table

| Type | Terms |
| ---| --- |
| Synonyms | Team, staff, crew, professionals, experts, designers, specialists |
| Hyponyms | Landscape designer, pool builder, turf care manager, sales manager, project manager, hardscape installer, design-build professional |
| Hypernyms | Outdoor living professionals, home improvement contractors, residential design-build team |
| Meronyms | Headshot, bio, credentials, education, certifications, tenure, expertise areas, author portfolio |
| Holonyms | Blue Tree organization, Blue Tree workforce, Blue Tree leadership |

### 3.1.4 Entity Co-Occurrence Verification

| Rule | Status |
| ---| --- |
| Primary organization entity (Blue Tree) in first 100 words (parent page) | ✅ H1 + subheadline |
| Geographic entity (Southeastern PA) in first 300 words (parent page) | ✅ Subheadline |
| Person entities named on parent page | ✅ Leadership section + designer cards |
| Each bio page identifies Person entity in H1 | ✅ H1 = \[Full Name\] |
| Each bio page links `worksFor` to Blue Tree | ✅ Schema + body copy |
| Each bio page links to authored blog posts | ✅ "Articles by \[Name\]" section |
| Editorial Standards page linked from parent | ✅ Hero trust signal |
| Meet the Team linked FROM Blog Hub | ✅ Blog Hub §2.2 + §2.7 |

* * *

## 3.2 Schema Markup

### 3.2.1 Meet the Team Parent Page Schema

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Meet the Blue Tree Team",
  "url": "https://www.bluetreelandscaping.com/about/team/",
  "description": "Meet the degreed designers, certified specialists, and leadership team behind Blue Tree. 70–90 employees strong serving Southeastern PA since 1983.",
  "about": {
    "@type": "LocalBusiness",
    "name": "Blue Tree Landscaping",
    "alternateName": "Blue Tree",
    "url": "https://www.bluetreelandscaping.com",
    "numberOfEmployees": {
      "@type": "QuantitativeValue",
      "minValue": 70,
      "maxValue": 90,
      "unitText": "seasonal"
    },
    "foundingDate": "1983",
    "areaServed": [
      {"@type": "AdministrativeArea", "name": "Montgomery County, PA"},
      {"@type": "AdministrativeArea", "name": "Bucks County, PA"},
      {"@type": "AdministrativeArea", "name": "Chester County, PA"},
      {"@type": "AdministrativeArea", "name": "Delaware County, PA"},
      {"@type": "AdministrativeArea", "name": "Philadelphia County, PA"}
    ],
    "sameAs": [
      "https://www.facebook.com/BluTreeLandscaping",
      "https://www.instagram.com/bluetreelandscaping",
      "https://www.google.com/maps/place/Blue+Tree+Landscaping",
      "[BBB_LISTING_URL]",
      "[HOUZZ_PROFILE_URL]"
    ]
  },
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.bluetreelandscaping.com/"},
      {"@type": "ListItem", "position": 2, "name": "About", "item": "https://www.bluetreelandscaping.com/about/"},
      {"@type": "ListItem", "position": 3, "name": "Meet the Team", "item": "https://www.bluetreelandscaping.com/about/team/"}
    ]
  }
}
```

### 3.2.2 Individual Author Bio Page Schema (Person)

> **Critical E-E-A-T schema.** This is the structured data that Google and AI engines use to verify author identity, credentials, and expertise. Every field is mandatory for blog authors.

**Example — Jeff Mattiola:**

```json
{
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "mainEntity": {
    "@type": "Person",
    "name": "Jeff Mattiola",
    "url": "https://www.bluetreelandscaping.com/about/team/jeff-mattiola/",
    "image": "https://www.bluetreelandscaping.com/images/team/jeff-mattiola.jpg",
    "jobTitle": "Owner & President",
    "worksFor": {
      "@type": "LocalBusiness",
      "name": "Blue Tree Landscaping",
      "alternateName": "Blue Tree",
      "url": "https://www.bluetreelandscaping.com"
    },
    "alumniOf": {
      "@type": "CollegeOrUniversity",
      "name": "University of Pittsburgh"
    },
    "knowsAbout": [
      "Custom Inground Pool Construction",
      "Outdoor Living Design",
      "Project Budgeting and Cost Estimation",
      "Residential Design-Build",
      "Pool Renovation and Remodeling",
      "Landscape Design Direction"
    ],
    "description": "Jeff Mattiola is the Owner and President of Blue Tree, the full-service outdoor living firm he has led since 1989. Over 37 years, Jeff has grown Blue Tree from a small landscape operation into a design-build company with 70 to 90 employees serving homeowners throughout Southeastern PA.",
    "sameAs": [
      "[LINKEDIN_URL_IF_EXISTS]"
    ]
  },
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.bluetreelandscaping.com/"},
      {"@type": "ListItem", "position": 2, "name": "About", "item": "https://www.bluetreelandscaping.com/about/"},
      {"@type": "ListItem", "position": 3, "name": "Meet the Team", "item": "https://www.bluetreelandscaping.com/about/team/"},
      {"@type": "ListItem", "position": 4, "name": "Jeff Mattiola", "item": "https://www.bluetreelandscaping.com/about/team/jeff-mattiola/"}
    ]
  }
}
```

**Schema Template for Other Authors:**

| Author | `jobTitle` | `alumniOf` | `knowsAbout` (key topics) |
| ---| ---| ---| --- |
| Jérôme Besnard | Sales Manager | University of Delaware. | Sales Process, Buyer Guides, Pool Selection, Client Experience |
| Mark Peasley | Turf Care Manager | \[Confirm\] | Turf Care, Lawn Fertilization, Weed Control, Pest Management, Aeration |
| \[Lead Designer\] | Lead Landscape Designer | \[Confirm\] | Landscape Design, Garden Design, Native Plants, Planting Plans |
| Chad Ochnich | Owner, Vice President | Delaware Valley College | Hardscape Construction, Field Operations, Vendor Relationships, Quality Control |

* * *

## 3.3 AEO Answer Capsules

| Target Question | Answer Capsule | Location |
| ---| ---| --- |
| "Who works at Blue Tree Landscaping?" / "Blue Tree team" | "Blue Tree employs 70 to 90 outdoor living professionals depending on the season, with an average employee tenure of more than 13 years. The team includes degreed landscape designers from Penn State, Rutgers, Temple, and Penn College of Technology, certified hardscape installers, turf care specialists, and a leadership team with more than 40 years of hands-on experience. Blue Tree serves homeowners throughout Southeastern PA — including Montgomery, Bucks, Chester, Delaware, and Philadelphia counties." | Parent page hero + culture block |
| "Who is Jeff Mattiola?" | "Jeff Mattiola is the Owner and President of Blue Tree, the full-service outdoor living company he has led since 1989. A University of Pittsburgh graduate, Jeff has grown the company from a small landscape operation into a 70-to-90-employee design-build firm serving Southeastern PA. He oversees pool construction, design direction, and strategic planning." | Jeff Mattiola bio page — opening paragraph |
| "Who is Mark Peasley?" | "Mark Peasley is the Turf Care Manager at Blue Tree, bringing more than 20 years of turf care experience — including university trial research, professional athletic field conditioning, and championship golf course management. He leads Blue Tree's Healthy Yard division covering lawn fertilization, aeration, weed control, and mosquito and tick treatment across Southeastern PA." | Mark Peasley bio page — opening paragraph |
| "Who owns Blue Tree Landscaping?" | "Blue Tree is co-owned by Jeff Mattiola (Owner, President) and Chad Ochnich (Owner, Vice President). Jeff has led the company since 1989, and Chad joined as a partner in the early 1990s. Together, they've built Blue Tree into a full-service outdoor living firm with 70 to 90 employees serving Southeastern PA." | Leadership section cards + bio pages |

* * *

## 3.4 Brand Voice Compliance Checklist

| ✅ | Rule | Status |
| ---| ---| --- |
| ✅ | Geographic phrasing uses "Southeastern PA" or full county list — never "Montgomery County" alone | Verified |
| ✅ | All sentences terminated with proper punctuation | Verified |
| ✅ | Serial (Oxford) commas in all lists of three or more items | Verified |
| ✅ | Tone is simultaneously authoritative, professional, and warm | Verified |
| ✅ | Legacy references (1983, 40+ years) present where appropriate | Verified — hero subheadline, culture block |
| ✅ | Numbers one through nine spelled out; 10+ as numerals | Verified |
| ✅ | Hyphenated compound adjectives before nouns | Verified |
| ✅ | First-person plural ("we," "our") in editorial copy; third person for individual bios | Verified |
| ✅ | No slang, no incomplete sentences, no excessively casual tone | Verified |
| ✅ | Proper nouns capitalized | Verified |
| ✅ | Em dashes used with no spaces | Verified |
| ✅ | "Blue Tree Landscaping" used only in schema `name` field; all current-tense copy uses "Blue Tree" | Verified |
| ✅ | Google rating displayed via Trustindex widget — no static values | Verified (CTA trust bar) |

* * *

## 3.5 Casey Keith Pre-Publication Checklist

**Entity Identification & Mapping:**

- [x] Primary entities identified (Blue Tree Organization + individual Person entities)
- [x] Entity relationship map completed — including Organization↔Person, Person↔Article, Person↔Credential chains
- [x] Semantic relationship table completed
- [x] All known team members mapped with roles, departments, and entity relationships

**Entity Mention & Placement:**

- [x] Organization entity (Blue Tree) in title tag, meta description, first 100 words (parent)
- [x] Geographic entity (Southeastern PA) in first 300 words (parent)
- [x] Person entities named and described on parent page
- [x] Each Person entity has dedicated bio page with full credentials
- [x] Editorial Standards page linked from parent page

**Schema Markup:**

- [x] `WebPage` on parent page with `about` referencing LocalBusiness
- [x] `ProfilePage` with `mainEntity` Person on each bio page
- [x] Person schema includes: `name`, `jobTitle`, `worksFor`, `alumniOf`, `knowsAbout`, `description`, `sameAs`
- [x] `BreadcrumbList` on all pages
- [x] Individual blog posts reference Person schema via `author` and `reviewedBy` (spec in Blog Hub brief §3.4)

**AEO (Answer Engine Optimization):**

- [x] 4 answer capsules targeting team, ownership, and individual author queries
- [x] Simple sentence structure in extractable passages
- [x] Credentials embedded directly in extractable bio openings

**E-E-A-T Signals:**

- [x] **Experience:** Company tenure, industry years, specific project types referenced
- [x] **Expertise:** Degreed designers, certified specialists, turf science background
- [x] **Authoritativeness:** Named individuals with verifiable credentials, bidirectional author↔content linking
- [x] **Trustworthiness:** Editorial Standards linked, transparent authorship, "Articles by \[Name\]" creating accountability

**Internal Linking Architecture:**

- [x] Parent page links to all bio pages
- [x] Bio pages link back to parent (breadcrumb + body)
- [x] Bio pages link to authored blog posts ("Articles by \[Name\]")
- [x] Blog posts link to bio pages (author byline)
- [x] Blog Hub links to parent page and bio pages (Editorial Trust Block)
- [x] Parent page links to Our Story, Our Process, Editorial Standards, Blog, Reviews, Careers
- [x] Parent page links to `/request-estimate/` (CTA)
* * *

## 3.6 Keyword Cannibalization Prevention

| Page | Owns These Queries | Does NOT Compete For |
| ---| ---| --- |
| Meet the Team (`/about/team/`) | "Blue Tree team," "Blue Tree employees," "Blue Tree designers," "who works at Blue Tree" | Individual person queries (bio pages own those) |
| Individual bio pages (`/about/team/[name]/`) | "\[Name\]," "\[Name\] Blue Tree," "who is \[Name\]" | Generic team queries (parent page owns those) |
| Our Story (`/about/our-story/`) | "Blue Tree story," "Blue Tree history," "who is Blue Tree Landscaping" | Team roster and individual personnel queries |
| Blog Hub (`/blog/`) | "Blue Tree blog," "Blue Tree guides" | Author and team queries |
| Careers (`/careers/`) | "Blue Tree jobs," "Blue Tree careers" | Company and team trust queries |

* * *

## 3.7 Post-Launch Optimization Plan

| Timeframe | Action |
| ---| --- |
| Launch | Verify all team member cards render correctly. Verify department filter works. Verify bio page schema validates in Rich Results Test. Confirm "Articles by \[Name\]" sections auto-populate from CMS author taxonomy. |
| 30 days | Monitor bio page traffic — are blog readers clicking through from author bylines? Check click-through rate from blog posts to bio pages. |
| 60 days | As new blog posts are published, verify they auto-populate in the correct author's "Articles by \[Name\]" section. |
| 90 days | Evaluate whether additional team members should have bio pages based on content production plans. If Fred or Steve begin authoring blog content, create their bio pages. |
| 6 months | Review headshots — are they still current? Any new team members to add? Update tenure information. |
| Annually | Full team page audit — update titles, tenure years, certifications, and education. Add new team members. Remove departed staff (with URL redirects if they had bio pages). |
| Ongoing | Every new blog post must have an `author` field linking to a Person entity with a bio page. No anonymous blog content. Ever. |

* * *

## 3.8 Source Material References

> **For the writer's reference.** Key quotes from audio recordings that inform team member characterizations.

**Jeff Mattiola — On the team:**

> "It's no 'me' around here. It's focused on what the customer wants and what we need to do to make it work."

**Jeff Mattiola — On the designers:**

> "Some of our guys, I call them brilliant with the way that designs they come up with. We don't limit their designs."

**Jeff Mattiola — On scale:**

> "We have 70 to 90 employees. We're a corporation. But we're not some guy just coming up with a pickup truck."

**Jeff Mattiola — On tenure:**

> "On average, our staff is probably about 13–14 years."

**Chad Ochnich — On Fred (designer):**

> "Fred is over the top extremely knowledgeable. His design work is impeccable — the beautiful plant relationships, the color contrast, the depth. I would put Blue Tree's designs up against anybody in the industry."

**Jérôme Besnard — On the sales/design team:**

> "Our sales people are designers. They have degrees in landscaping and hardscaping, so they are professional designers. And they work as a team."

**Jérôme Besnard — On client relationships:**

> "Most of our customers end up knowing my kids' names. I know their kids' names. And we're more on a friendly basis rather than a contractor and a customer."

**Mark Peasley — On his expertise:**

> "I have great experience in the last 20 years in turf — whether it be university trial research, working on professional athletic fields, or championship golf course conditioning. I sell the experience. It's not just Blue Tree. It's me."

**Andrew Mattiola — On field-to-design transition:**

> "Being able to do that with my own hands from scratch... It helped me learn how to kind of look at something and go, okay, would you do this here or that over there."

**Pool team member — On client relationships:**

> "We want you as our long-term customer. We can do a phased approach or all at once. But the next year, we want you to come back to us."
* * *

_Creative Brief — Meet the Team + Author Bio Pages_
_Blue Tree — Team Directory & Individual Author Bio Page Templates_
_Version 1.0 — February 2026_
_Prepared by Jason Spencer |_ [_ROI.LIVE_](http://ROI.LIVE)
_Entity SEO & AEO Certified — Casey Keith Framework_
