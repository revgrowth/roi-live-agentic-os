---
content_drop: job-openings
for_page: /careers/
for_clickup_task: 86afpp7jb (Careers Page Template)
sourced_from: https://bluetreelandscaping.com/careers/ (live site)
captured: 2026-05-13
captured_by: Claude (under Jason direction)
status: raw — voice-profile cleanup not yet applied
notes: |
  This file gives Raja the 4 real job listings + benefits content needed to fix P13 (BLOCK #1 Stephen Roehm placeholder on all 4 cards + BLOCK #2 "[Pending confirmation]" benefits placeholders).
  Job descriptions are verbatim from the current live site. Benefits are consistent across all 4 jobs and can be promoted to a sitewide "Working at Blue Tree" benefits block to remove repetition.
  Known issues to flag:
    - Lawn Care Technician shows "Date Job is Available: May 19, 2025" — past date; confirm with Maureen whether this listing should still be active or refresh the date
    - Apply links on live site are placeholder "(#)" — real apply target needed (form on the page? email? external ATS?). Confirm with Maureen.
    - Pay range only shown for Lawn Care Technician ($25–$30/hr) — confirm whether the other 3 should show ranges too
    - Brand voice cleanup needed on "Blue Tree Landscaping" body usage in the Lawn Care intro paragraph and in the company-culture statement
---

# Job Openings — Phase 0 Content Drop

## Summary

**4 active job openings**, all based at Schwenksville HQ, all full-time:

| Job Title | Department | Pay range | Job Type |
|---|---|---|---|
| Lawn Care Technician | Turf Care | $25–$30/hr + OT | Full-time (Seasonal: March–December) |
| Pool Service Technician | Pool Services | TBD | Full-time |
| Hardscape Foreperson | Hardscaping | TBD | Full-time |
| Landscape Foreperson | Landscaping | TBD | Full-time |

## Company-wide benefits (consistent across all 4 jobs)

Replace the deployed `[Pending confirmation — health insurance, dental, vision details TBD]` and `[Pending confirmation — PTO, holidays, sick days TBD]` blocks with this real list:

- Healthcare, Dental & Vision
- PTO (Paid Time Off)
- 401K
- Paid Holidays

Suggestion: lift this into a single "Working at Blue Tree — Benefits" block above or below the openings, since it's identical for every role. Then each individual job card can omit the benefits section and just reference the shared block. Less repetition, cleaner build.

## Company-culture statement (verbatim from live site)

> "Join Our Growing Blue Tree Landscaping Team! We're on the lookout for passionate, driven individuals ready to make an impact."

**Voice note:** This statement uses "Blue Tree Landscaping" in customer-facing copy — copy-production should sweep to "Blue Tree" or "Blue Tree Outdoor Living" before launch.

## Individual job listings (verbatim from live site)

---

### 1. Lawn Care Technician

**Department:** Turf Care
**Job Type:** Full-time (Seasonal: March–December)
**Location:** Schwenksville, PA 19473
**Pay range:** $25–$30 per hour (with overtime available)
**Date Job is Available:** May 19, 2025 *(FLAG: past date — confirm with Maureen whether to refresh or remove)*

**Description:**

Blue Tree Landscaping is a locally owned and operated landscaping and lawn care company committed to providing exceptional service to our clients. We're looking for motivated, hardworking individuals to join our growing team.

As a Lawn Care Technician, you will be responsible for maintaining the health and appearance of our clients' natural grass spaces. Duties include fertilizing, weed control, aerating, seeding, and operating various lawn care equipment. Our customer base includes residential homes, commercial properties, and local athletic fields.

**Educational Requirements**
- High school diploma or equivalent preferred

**Experience Requirements**
- A self-motivated individual who can work independently
- Strong customer service and communication skills
- A basic understanding of turfgrass management
- A valid driver's license and clean driving record
- A commitment to quality work and reliability

**Voice note for copy-production:** "Blue Tree Landscaping is a locally owned..." → swap to "Blue Tree is a locally owned..." per v1.1 §1.1 (legal entity stays in JSON-LD / footer only).

---

### 2. Pool Service Technician

**Department:** Pool Services
**Job Type:** Full-time
**Location:** Schwenksville, PA 19473

**Description:**

We're looking for a dependable and detail-oriented Pool Service Technician to join our growing team. In this role, you'll be responsible for the cleaning, maintenance, and servicing of residential swimming pools.

**What We're Looking For:**
- A self-motivated individual who can work independently
- Strong customer service and communication skills
- A basic understanding of pool equipment and water chemistry is a plus — but not required
- Prior pool service experience is preferred, though we offer full training for the right candidate

**Requirements:**
- A valid driver's license and clean driving record
- A commitment to quality work and reliability

**Voice note for copy-production:** em-dash present in "water chemistry is a plus — but not required" — sweep per v1.1 §11.3.

---

### 3. Hardscape Foreperson

**Department:** Hardscaping
**Job Type:** Full-time
**Location:** Schwenksville, PA 19473

**Description:**

**Qualifications:**
- Perform assigned work on a daily basis inclusive of hardscape and masonry construction process and techniques, etc.
- Ensure quality control standards are being met
- Minimum 2 years experience operating equipment
- MUST have a valid drivers license

**Voice note for copy-production:** "MUST" caps + "drivers license" missing apostrophe — copy-production cleanup.

---

### 4. Landscape Foreperson

**Department:** Landscaping
**Job Type:** Full-time
**Location:** Schwenksville, PA 19473

**Description:**

**Qualifications:**
- 2+ years of experience as a crew leader
- Experience working with and managing a crew
- Detailed oriented with good communication skills
- Experience with equipment operation
- Clean & Valid PA Drivers License with reliable transportation

**Voice note for copy-production:** "Detailed oriented" → "Detail-oriented"; "Drivers License" missing apostrophe.

---

## Reconciliation notes (for Maureen + Jason)

1. **Apply mechanism** — live-site Apply links are placeholders `(#)`. Confirm with Maureen: form-on-page, email-to address, external ATS link, or some other path?
2. **Pay ranges for 3 of 4 jobs** — only Lawn Care Technician shows $25–$30/hr. Confirm whether Pool Service / Hardscape Foreperson / Landscape Foreperson should show pay ranges too. Best practice for SEO + applicant transparency is yes.
3. **Lawn Care Technician availability date** — listing says "May 19, 2025" which is past. Either evergreen this listing (remove the date) or refresh to a current open-from date.
4. **Are there other openings not on the live careers page?** — Maureen to confirm the 4 listed here are the complete set, or send additions.
5. **General application slot** — deployed page mentions "General Application Form" section. Brief Meet the Team / Careers spec mentions this. Confirm the general application form exists and accepts non-specific submissions.

## Voice profile cleanup checklist (copy-production team)

Before final launch (2026-05-22 internal QA), copy-production should sweep the job listings for:
- [ ] "Blue Tree Landscaping" → "Blue Tree" or "Blue Tree Outdoor Living" in Lawn Care intro + culture statement
- [ ] Em-dash in Pool Service "water chemistry is a plus — but not required" → comma or rewrite
- [ ] "Detailed oriented" → "Detail-oriented" (Landscape Foreperson)
- [ ] Apostrophes on "Drivers License" → "Driver's License" (Hardscape + Landscape Foreperson)
- [ ] "MUST" all-caps softened (Hardscape Foreperson) — could be styled as bold rather than caps
- [ ] Sentence-case the bullet labels and ensure parallel structure across the 4 listings
- [ ] Decide on single benefits block vs per-job repetition (recommend single block — see top of file)

## JobPosting schema (per overlay)

Each job listing should render with `JobPosting` schema. Minimum required fields:
- `title` — Job title (e.g., "Lawn Care Technician")
- `description` — Full description
- `hiringOrganization` — Blue Tree Outdoor Living (with `alternateName: Blue Tree Landscaping` matching GBP)
- `jobLocation` — 4494 Skippack Pike, Schwenksville, PA 19473
- `employmentType` — FULL_TIME
- `datePosted` — Real current date
- `validThrough` — If known (e.g., end-of-season)
- `baseSalary` — Hourly $25-$30 for Lawn Care; TBD for others
- `qualifications` — Bullet list
- `responsibilities` — Bullet list (where applicable)
