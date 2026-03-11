---
name: mkt-brand-voice
description: >
  Extract or build a brand's voice so every skill writes in their style.
  Triggers on: "brand voice", "writing style", "make this sound like me",
  "define our voice", "analyze my content", "voice guide", "how should we
  sound", "tone of voice", "brand personality", "analyze my website".
  Four modes: Import (existing brand guidelines), Extract (analyze existing
  content), Build (interview from scratch), Auto-Scrape (URL provided,
  skill researches). Produces
  brand_context/voice-profile.md and brand_context/samples.md.
  Foundation skill — run before any execution skill that reads voice context.
  Does NOT trigger for positioning, audience research, or keyword work.
---

# Brand Voice

## Outcome

Files saved to `brand_context/`:
- `voice-profile.md` — the full voice system (tone, vocabulary, rhythm, platform rules)
- `samples.md` — 5-10 gold-standard sentences with source and reason noted
- `assets.md` — (Auto-Scrape only, if Firecrawl available) visual brand assets auto-discovered from URL: logo, colors, fonts, brand traits. Reports what was found and what wasn't.

The voice profile includes a structured JSON data block validated against `brand_context/schemas/voice-profile.schema.json`. This enables downstream skills and automation to read voice data programmatically.

Any skill can reference these to write on-brand without asking the user about voice again.

## Context Needs

| File | Load level | How it shapes this skill |
|------|-----------|--------------------------|
| `brand_context/positioning.md` | Summary | Informs voice positioning — a challenger brand sounds different from a trusted advisor |
| `context/learnings.md` | `## mkt-brand-voice` section | Apply any previous corrections before starting |

Load if they exist. Proceed without them if not.

---

## Before You Start

**Check if `brand_context/voice-profile.md` exists.**

If it exists → **Update mode.** Read the existing profile, show a one-paragraph summary of the current voice, and ask what they'd like to change. Don't rebuild from scratch. Before overwriting any section, show what changed and confirm.

If it doesn't exist → **Mode selection.** Ask:

> "How do you want to set up your voice?
> 1. I have brand guidelines — import them and I'll map everything across
> 2. I have content samples — paste them and I'll extract your voice
> 3. Start from scratch — I'll ask a few questions and build it
> 4. Here's my URL — research it yourself"

If the user provides a URL in their first message, skip mode selection and go directly to Auto-Scrape. If they attach or paste a structured brand guide, go directly to Import.

---

## Mode 1: Import

Best for: brands that already have voice/tone guidelines, brand books, or style guides.

**Accepts:** Pasted text, PDF, or any document containing existing brand voice guidelines.

**Process:**
1. Read the provided guidelines fully
2. Map their structure into the voice-profile.md format (see `references/voice-profile-template.md`)
3. Flag any gaps — common missing pieces: real samples, anti-patterns (what the brand does NOT sound like), platform-specific rules, vocabulary lists
4. Present a summary: "Here's what your guidelines cover and what's missing"
5. **Enrich offer:** Ask if they want to layer on additional sources to fill gaps and add real-world samples:
   - "Want me to pull from your LinkedIn, website, or other content to add real samples and fill the gaps?"
   - If yes → run Auto-Scrape or Extract on the additional sources, then merge findings into the imported profile
   - If no → proceed with what's there, noting gaps in the profile

**Merge rules when enriching:**
- The imported guidelines are the authority — enriched content fills gaps, it doesn't override
- If enriched content contradicts the guidelines, flag it: "Your guidelines say X but your LinkedIn sounds more like Y — which is the real you?"
- Samples from real content always go to `samples.md`, even when the guidelines provided example copy

---

## Mode 2: Extract

Best for: raw content — website copy, emails, social posts, newsletters, transcripts.

**Sample gate:** Minimum 3 samples OR 500+ total words. Under 500 words → offer Quick mode (top 5 traits + 3 rules) or ask for more content.

**Sample priority — most to least authentic:**
1. Slack messages or casual emails (raw, unedited)
2. Podcast or call transcripts
3. Social posts (LinkedIn, Twitter)
4. Website copy (most edited, least authentic)

**Run the extraction:**
Read `references/extraction-guide.md` for the full methodology — 6 dimensions, phrase harvesting, confidence zone mapping, anti-pattern sourcing, and self-critique checklist.

After analyzing, collect 5-10 sentences that best represent the voice for `samples.md`.

---

## Mode 3: Build

Best for: starting fresh, or existing content is too generic to reliably extract from.

Read `references/build-questions.md` for the full question bank and synthesis process.

Ask a maximum of 8 questions — prioritize based on what you already know from context. If positioning.md is loaded, skip questions it already answers.

After building, ask the user for 2-3 sample sentences in their voice for `samples.md`.

---

## Mode 4: Auto-Scrape

Best for: user provides a URL and wants research done for them.

### Scraping Strategy

Try sources in this order, using the cheapest tool that works:

1. **WebFetch first** (free) — try homepage, About page, 2-3 blog posts, LinkedIn
2. **If WebFetch fails** (JS-heavy site, bot protection, empty content) → fall back to `tool-firecrawl-scraper` skill
   - Check `.env` for `FIRECRAWL_API_KEY` first
   - If missing, tell the user: "This site needs Firecrawl to scrape properly. Add `FIRECRAWL_API_KEY=fc-your-key` to your `.env` file (free tier at firecrawl.dev)."
   - If present, use Firecrawl scrape endpoint with `formats=["markdown"]`

### Brand Asset Extraction

When a URL is provided, also run **Firecrawl branding extraction** (if API key available) to auto-discover visual brand assets:

```
formats=["branding"]  →  colors, fonts, logos, spacing, brand traits
```

Report back to the user:
> **Found from your site:**
> - Logo: [URL or "not found"]
> - Primary colors: [hex values or "not found"]
> - Fonts: [font names or "not found"]
> - Brand traits: [if detected]
>
> **Couldn't find automatically:**
> - [List anything missing — social handles, brand photography, etc.]
>
> You can add these manually to `brand_context/assets.md`.

If Firecrawl isn't available, skip branding extraction and note: "I couldn't auto-detect your visual brand assets. You can add them manually to `brand_context/assets.md` later."

### Voice Extraction Process

1. Fetch content from: homepage, About page, 2-3 blog posts, LinkedIn bio + recent posts, Twitter/X
2. Report what was found (pages, word count, quality signal)
3. Feed all content into Extract mode (Mode 2)
4. Follow up with 2-3 gap-filling questions: evolution intent, hated phrases, voice inspiration

### Fallback

If both WebFetch and Firecrawl are unavailable: "I can't access URLs in this environment — want to paste your content or answer a few questions instead?"

---

## Step 5: Voice Test (All Modes)

After producing any voice profile, validate before saving. Do not skip.

Write 3 samples using the extracted or built profile:
- A 3-4 sentence email opening
- A social post (match their most-used platform)
- A landing page headline + 2 supporting sentences

Ask: *"Does this sound like you when you're not overthinking it?"*

- **Yes** → save
- **Close but off** → ask what's wrong, adjust specific sections, retest
- **Not right** → ask for an example that IS right, re-extract from it

Cap at 3 rounds. If still unresolved, offer to save current version and refine over time using `/brand-voice` again.

---

## Step 6: Save Output

**`brand_context/voice-profile.md`**
Read `references/voice-profile-template.md` for the exact format. All sections required.
Include a structured JSON data block at the end (inside a `<details>` tag) that conforms to `brand_context/schemas/voice-profile.schema.json`. Read the schema before generating the JSON to ensure all required fields are present.

**`brand_context/samples.md`**
5-10 sentences. For each, note: source type, and why it's representative.

```
## [Source] — [e.g., email to list / LinkedIn post / homepage]
"[Sentence exactly as written]"
*Why it's representative: [1 sentence]*
```

After saving, show the user actual excerpts — not just confirmation of file paths.

---

## Rules

*Updated automatically when the user flags issues. Read before every run.*

---

## Self-Update

If the user flags an issue with the output — wrong tone, bad format, missing context, incorrect assumption — update the `## Rules` section in this SKILL.md immediately with the correction and today's date. Don't just log it to learnings; fix the skill so it doesn't repeat the mistake.

---

## Troubleshooting

**Not enough samples:** Request more content, or switch to Build mode.
**Voice feels generic after extraction:** Website copy is often sanitised. Ask for emails or Slack messages.
**User can't decide on tone:** Write two contrasting versions of the same sentence, ask which is closer.
**Positioning not loaded:** Proceed, but note it would sharpen the voice positioning.
**Profile already exists but user wants to start over:** Confirm before overwriting. Offer to save old version with a date suffix.
