# Agent Loading Instructions

This file tells a Claude Code agent how to bootstrap into this project.

---

## On First Load

Read these files in order. Do NOT skip ahead.

```
1. 00_index/README.md
2. 01_instructions/PROJECT_INSTRUCTIONS.md
3. 01_instructions/WRITING_RULES.md
4. 02_memory/USER_MEMORY.md
5. 03_strategy_docs/MASTER_FEEDBACK_TRACKER.md
6. 05_sops/AGENCY_CORE_STANDARDS_v1.1.md
7. 05_sops/RFP_SUCCESS_WEBSITE_CONTENT_SOP_v1.2.md
8. 03_strategy_docs/BRAND_VOICE_DNA_v2.2.md
9. 03_strategy_docs/SITEMAP_v10.md
10. 03_strategy_docs/PAGE_TEMPLATE_MAP_v1.0.md
11. 05_sops/CLIENT_PARAMETER_SHEET_v1.0.md
12. 07_chat_history/SESSION_SUMMARIES.md
```

Files 13+ are reference materials loaded on demand:
- `04_creative_briefs/CREATIVE_BRIEF_HOMEPAGE_v1.0.md` — Homepage reference
- `04_creative_briefs/CREATIVE_BRIEF_T4_CASE_STUDY_v1.0.md` — Case study template reference
- `05_sops/AGENCY_SERVICE_PAGE_SOP_v1.1.md` — Loaded when building any service page
- `03_strategy_docs/ADVISEMENT_SERVICES_COMPLETE_GUIDE.md` — Loaded when working on advisement-related content
- `06_source_materials/*` — Audio transcriptions and team Q&A — loaded when authoring evaluator-perspective content

---

## When Building Any New Page

Load the page-type SOP + the strategy docs + the relevant source materials, in this order:

1. The page-type SOP (Service Page SOP for T2/T3, T4 brief for case studies, etc.)
2. The companion creative brief if one exists for the template
3. The relevant cluster source materials (audio transcriptions for evaluator content, Anna's doc for compliance content, Susan's doc for SLED process content)
4. The Master Feedback Tracker (always, for non-negotiables)
5. The Brand Voice DNA Guide (always, for tone and language)
6. The Sitemap (for URL architecture and internal linking)
7. The Client Parameter Sheet (for any client-specific values: stats, schema IDs, design tokens)

---

## When Drafting Prose

Every paragraph of prose must pass:

1. **The Lisa Voice Test** — Read it aloud. Does it sound like RFP-expert Lisa Rehurek speaking?
2. **The Anti-Slop Filter** — Run against `01_instructions/WRITING_RULES.md` banned phrases and structures
3. **The Information Gain Test** — Does this paragraph add something the public web doesn't already have?
4. **The Archetype Test** — Which of the five customer archetypes is this paragraph speaking to?

---

## When Modifying or Adding to the Project

- Bump version numbers when modifying SOPs (v1.2 → v1.3)
- Add entries to the Master Feedback Tracker when new Lisa corrections come in
- Add entries to Open Items / move to Resolved Items as decisions land
- Keep this dump current — when new artifacts get produced (creative briefs, case studies, audits), add them to the appropriate folder

---

## Common Pitfalls to Avoid

1. **Using 78% win rate** — it's 76%+. Always.
2. **Using 26+ years** — it's 30+. Always. Lisa, not the company.
3. **Saying "Full Response Management"** — discontinued. Win Strategist services only.
4. **Saying "federal"** — not a market. No federal positioning anywhere.
5. **Forgetting the ® symbol** — required on every public brand mention.
6. **Forgetting "RFP-expert" prefix on first Lisa mention** — per Master Feedback Tracker §2.2.
7. **Calling services by old names** — Evaluator's Eye Audit (not Proposal Audit), Win Strategy Review (not Strategic & Compliance Review), Embedded Content Refinement (not Content Refinement).
8. **Writing with AI tells** — banned words/phrases per WRITING_RULES.md.
9. **Writing pages that don't pass the Delta Test** — defer publication. Don't ship MEDIUM or LOW information gain.
10. **Capitalizing D.A.R.E. wrong** — it's `D.A.R.E.` with periods, always.

---

## Working Style (Reminder)

Jason works directively. Source documents contain the answers. Don't ask clarifying questions unless the source documents genuinely don't resolve the question.

Output to markdown by default. Word docs only when handoff requires it (e.g., to Raja or Lisa for document-form review).

When generating deliverables, use the `present_files` tool to share them. Outputs go to `/mnt/user-data/outputs/`.
