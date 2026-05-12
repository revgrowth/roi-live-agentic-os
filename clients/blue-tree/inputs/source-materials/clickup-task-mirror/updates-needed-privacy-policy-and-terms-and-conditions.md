---
clickup_task_id: 86ah0d9p5
clickup_url: https://app.clickup.com/t/86ah0d9p5
name: Privacy Policy and Terms and Conditions
status: updates needed
priority: normal
assignees: Raja Sheryar
due_date: 2026-04-27
date_created: 2026-04-21
date_updated: 2026-04-28
archived_to_repo: 2026-05-12
---

# Privacy Policy and Terms and Conditions

## Build Privacy Policy + Terms of Service Pages

### Summary
Build 1 shared legal text page template, then populate 2 pages: Privacy Policy and Terms of Service. Both use the same minimal template — full-width body text with heading hierarchy, no hero images, no CTAs, no trust bars. These are E-E-A-T trust signal pages linked from the footer on every page across the site.

### Template Spec
Minimal long-form text page. Shared by both legal pages.

**Layout:**
- Breadcrumb (Home > Page Title)
- "Last Updated: [Month Year]" — muted text, prominent at top
- H1 page title
- Body content with H2/H3 heading hierarchy
- No hero image, no background image
- No CTA blocks, no trust bars, no sidebar
- Full-width body text, max line length ~70 characters
- Body font size 16–18px, line height 1.7–1.8
- Generous section spacing between H2 blocks
- Print-friendly (no background colors)

**Footer integration:**
- Both pages linked from footer on every page sitewide
- Footer links: "Privacy Policy" and "Terms of Service"

### Pages to Build

**1. Privacy Policy** (`/privacy-policy/`)
- Creative brief: Creative_Brief___Privacy_Policy_v1.md
- Full page copy included in the brief — implement as-is
- ~2,300 words across 12 sections
- Replaces existing privacy policy page (URL stays the same, content is a complete rewrite)
- Sections: Information We Collect, How We Use Your Information, Cookies and Tracking Technologies, Online Advertising, How We Share Your Information, Text Messaging (SMS), Data Retention, Data Security, Children's Privacy, Your Choices, State Privacy Rights, Third-Party Links, Changes, Contact
- Schema: WebPage + BreadcrumbList

**2. Terms of Service** (`/terms-of-service/`)
- Creative brief: Creative_Brief___Terms_of_Service_v1.md
- Full page copy included in the brief — implement as-is
- ~2,100 words across 14 numbered sections
- New page (does not exist on current site)
- Sections: Website Use, Consultation Requests and Estimates, Project Engagement Terms, Warranties, Payment Terms, Intellectual Property, Limitation of Liability, Indemnification, Dispute Resolution, Third-Party Links, Communications, Modifications, Severability, Entire Agreement
- Schema: WebPage + BreadcrumbList

### Important Notes
- ⚠️ Both pages are pending legal review by the client's PA attorney before final publication. Build and stage the pages — do not publish until client confirms legal review is complete.
- Copy in the briefs is final draft pending legal review. No content changes should be made by the dev team — any edits come from the legal review process.
- The Privacy Policy references specific third-party services (GA4, Meta Pixel, ClickCease, Trustindex, GoHighLevel). Confirm these are accurate at time of launch.
- One placeholder in each brief: "[privacy contact email — confirm with client]" and "[general contact email — confirm with client]" — need client confirmation before publish.

### Acceptance Criteria
- [ ] Legal text page template built in Breakdance
- [ ] Privacy Policy populated with brief copy at /privacy-policy/
- [ ] Terms of Service populated with brief copy at /terms-of-service/
- [ ] Both pages linked from footer on every page sitewide
- [ ] "Last Updated: April 2026" visible at top of both pages
- [ ] BreadcrumbList schema on both pages
- [ ] Heading hierarchy correct (H1 > H2 > H3)
- [ ] Print-friendly styling
- [ ] Responsive at all breakpoints (320px, 768px, 1024px, 1440px)
- [ ] Pages staged but NOT published until client confirms legal review complete

### Attachments
-  
-
