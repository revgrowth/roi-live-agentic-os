---
name: viz-image-gen
version: 1.0.0
description: >
  Interactive visual direction and image generation via GPT Image or Gemini.
  Uses the 6-Element Framework (Subject, Framing, Lighting, Mood, Medium, Style)
  to guide users through visual decisions before constructing model-specific prompts.
  Supports 10 style presets as pre-filled framework configurations, reference image
  analysis, multi-generation comparison sets, and model recommendation with override.
  Triggers on: "generate an image", "create an infographic", "image gen",
  "notebook sketch", "comic strip", "hand-drawn diagram", "visual for",
  "make an image of", "illustrated diagram", "sketchnote", "storyboard",
  "generate a visual", "image of", "draw me", "GPT image", "Gemini image".
  Also use when any skill needs a visual asset generated.
  Does NOT trigger for Excalidraw diagrams (use viz-excalidraw-diagram),
  charts/graphs, slide decks, or text-only content.
---

# Image Generation — Interactive Visual Direction

Generate images using GPT Image 2 or Gemini 3 Pro Image. The skill's value is in the **visual direction experience** — guiding users through the 6-Element Framework to make intentional creative decisions before constructing model-specific prompts.


## Paths

Read `skill-pack/config/sys-config.md` → `## Paths` section before any path-dependent step. It resolves `{decoupled_base}`, `{env_file}`, `{brand_context}`, and `{projects_base}` to absolute paths set by the installer. Substitute these placeholders wherever they appear below.

## Context Needs

| File | Load level | Purpose |
|------|-----------|---------|
| `context/learnings.md` | `## viz-image-gen` section | Apply previous feedback |

No brand_context files needed. This skill produces visuals, not branded copy.

## Dependencies

| Skill | Required? | What it provides | Without it |
|-------|-----------|-----------------|------------|
| `str-trending-research` | Optional | Researches prompt techniques, visual styles, and model-specific patterns for unfamiliar styles | Fall back to built-in reference files only |
| `tool-web-screenshot` | Optional | Captures a live web page as a source image for annotation, reference, or composition | User must provide their own screenshot/image |
| `tool-video-screenshots` | Optional | Extracts key frames from a video as source images for annotation or reference | User must provide their own screenshot/image |
| `tool-screenshot-annotator` | Optional | Pixel-perfect programmatic annotations (numbered circles, highlight boxes) on real images | Falls back to GPT/Gemini image editing with source modification risk |
| `viz-excalidraw-diagram` | Optional | Excalidraw JSON diagrams rendered to PNG via Playwright | Falls back to GPT/Gemini diagram generation with no JSON source |

## Step 0: Check API Keys

Check which backends are available:

- **GPT:** `OPENAI_API_KEY` in `{env_file}` — from https://platform.openai.com/
- **Gemini:** `GEMINI_API_KEY` in `{env_file}` — free at https://ai.google.dev/

At least one must be set. If both are available, recommend per Step 4. If only one is available, use that one and note the limitation.

## Step 1: Read Learnings

Read `context/learnings.md` → `## viz-image-gen` for previous feedback on styles, prompt patterns, or quality issues.

## Step 2: Understand & Guide

This is the interactive heart of the skill. Detect the user's clarity level and adapt.

### Quick Mode (skip to Step 3)

Activate when the user provides:
- A detailed description with clear visual intent
- An explicit style reference ("cinematic Blade Runner style")
- A specific preset name ("use the UGC influencer style")

→ Move directly to building the Visual Breakdown.

### Guided Mode

Activate when the request is vague or open-ended ("image of a desk setup", "something for my social media"). Ask smart questions based on image type:

**1. Source & reference check:**
> "Are we working from something real (a web page, a video, an existing screenshot) or creating from scratch?"
- **From a URL:** Use `tool-web-screenshot` to capture the page, then use it as `--input-image` for annotation/composition
- **From a video:** Use `tool-video-screenshots` to extract key frames, then use as `--input-image`
- **From an existing file:** User provides the path directly
- **From scratch:** Pure generation — continue to style questions
- **Style reference only:** Analyse it through the 6-Element Framework (see Reference Image Analysis below)

**Product Shoot Mode** — activate when the user provides a product image and wants multiple consistent shots (e.g. "hero shot and lifestyle", "product shoot", "4 product shots", "all angles"):
1. Read `references/style-product-shoot.md` for the full workflow
2. Analyse the reference image and build a **Product Lock Description**
3. Present the shot list (Hero, Detail, Flat Lay, Lifestyle, Group, Unboxing) — user picks which
4. Generate each shot individually with the Product Lock prepended and reference image as `--input-image`
5. Offer grid composite after all shots are done
6. Skip the rest of Guided Mode — Product Shoot Mode has its own framework presets per shot type

**2. Style direction** (present 3-4 options relevant to their subject):
> "What vibe are you going for?"
> - [Option A — brief, concrete description]
> - [Option B — brief, concrete description]
> - [Option C — brief, concrete description]
> - Something else — describe it

**3. Framing** (if not obvious from context):
> "How should this be framed?"
> - Close-up detail shot
> - Medium shot (waist-up for people)
> - Wide environmental shot
> - [Other relevant option for their subject]

**4. Multi-generation offer:**
> "Do you want to compare multiple directions? I can generate 2-3 variations."

Keep it conversational — 2-3 questions max per round. Don't interrogate. Use what you can infer and confirm.

### Reference Image Analysis

When the user provides a reference image:
1. Analyse it through the 6 elements
2. Present the breakdown back:
> "I see: [subject], [framing], [lighting], [mood], [medium], [style] — should I match this closely or use it as a starting point?"
3. Use their answer to set framework parameters

## Step 3: Build Visual Breakdown

Read `references/visual-framework.md` for the full 6-Element Framework.

Before any prompt is written, construct a **Visual Breakdown** (max 15 lines) documenting all framework decisions:

```
Subject: [what's in the image, specific details]
Framing: [camera angle, distance, lens, aspect ratio]
Lighting: [light setup, direction, quality]
Mood: [emotional tone]
Medium: [physical/digital substrate]
Style: [aesthetic reference]
---
Aspect Ratio: [ratio]
Model: [GPT/Gemini + one-line reasoning]
Key Details: [2-3 specific details that make this unique]
```

**Show this to the user for approval before proceeding.** They can adjust any element. This is the creative direction gate.

If the request maps to a preset style, load the relevant `references/style-*.md` file and use its framework presets as the starting point, adjusting for the specific request.

## Step 4: Model Recommendation

Read `references/model-selection.md` for the full decision matrix. Present the recommendation with reasoning but let the user override:

> "I'd recommend **[Model]** for this — [one-line reason]. Want to go with that, try [other model] instead, or compare both?"

**Quick rules from shootout evidence:**
- **GPT wins:** Close-up realism, hyperreal fantasy, text/typography, instruction following, product labels, macro detail (5/9 tests)
- **Gemini wins:** Cinematic/atmospheric scenes, anime/cel-shaded (artifact-free) (2/9 tests)
- **True ties:** UGC lifestyle, luxury product shots (2/9 tests)

For multi-generation comparison sets: generate the same Visual Breakdown on both backends, or vary the framework choices across generations.

## Step 5: Construct the Prompt

Read the relevant style file from `references/style-*.md` if using a preset. For freeform work, read `references/visual-framework.md` for construction rules.

### Source Image Mode vs From-Scratch Mode

**Critical distinction:** When a source image is provided (screenshot, video frame, user photo, or any existing image), determine the correct route using this decision table:

#### Annotation Routing Decision

| Scenario | Route to | Why |
|----------|----------|-----|
| Real screenshot/video frame + callouts, circles, highlights, numbered annotations | `tool-screenshot-annotator` | Programmatic RGBA overlay — pixel-perfect source preservation guaranteed |
| Real source + artistic hand-drawn annotation explicitly requested (e.g. "red marker circles", "hand-drawn arrows") | `viz-image-gen` with explicit warning | User accepts modification risk — warn first |
| From-scratch technical diagram with annotations | `viz-image-gen` | Pure generation, no source to preserve |
| From-scratch any style | `viz-image-gen` | Pure generation |
| Product reference image + multiple shots requested | Product Shoot Mode (see Step 2) | Consistency workflow, not annotation |

**Route to `tool-screenshot-annotator` (default for real images + annotations):**
1. Capture the source image via `tool-web-screenshot` or `tool-video-screenshots` (or user provides it)
2. Read the captured screenshot to identify what needs annotating — UI elements, key areas, text, buttons
3. Build a `tool-screenshot-annotator` JSON spec with percentage-based coordinates for each annotation (circles at element centers, highlight boxes around regions)
4. Run `tool-screenshot-annotator` to produce the annotated output
5. Source image is preserved perfectly — no AI modification of any pixel

**Route to `viz-image-gen` with warning (artistic annotation on real source):**
1. Before proceeding, tell the user: "GPT/Gemini image editing will modify the base image — faces, text, and details may change. For pixel-perfect annotations, I can use `tool-screenshot-annotator` instead. Want to proceed with AI editing or switch to programmatic annotations?"
2. If user proceeds: apply Source Image Rules below
3. If user switches: follow the `tool-screenshot-annotator` route above

**Source Image Rules (when using viz-image-gen on real sources):**
1. The base image must remain **pixel-perfect unchanged** — all existing people, faces, text, UI elements, layouts, logos, and content stay exactly as they are
2. The prompt must ONLY describe what to **add on top** — annotation layers, markup, callouts, highlights
3. Never instruct the model to "recreate", "enhance", "improve", or "modify" the base image
4. Explicitly state in the prompt: "Do not alter, modify, or regenerate any part of the original image. Keep all existing people, text, and content exactly as they appear. Only add the following overlay annotations..."
5. If the result shows source modification (changed faces, altered text, shifted layout), flag it and re-route to `tool-screenshot-annotator`

**From-Scratch Rules (pure generation):**

Convert the approved Visual Breakdown into a **single dense paragraph** prompt where every framework decision is embedded as specific visual description. Rules:

1. Every element must be represented — no defaults by omission
2. Specificity over adjectives — "neon teal reflecting off wet pavement" not "dramatic lighting"
3. Single flowing paragraph — no bullets, no labels visible to the model
4. 80-250 words of precise visual description

### Model-Specific Prompting Rules

**For GPT** (read `references/prompt-patterns-gpt.md`):
- Use structured labeled segments for complex requests
- Put the most important elements first
- Include intended use case
- For exact text: `Include ONLY this text (verbatim): "X"`
- Spell tricky words letter-by-letter

**For Gemini** (read `references/prompt-patterns-gemini.md`):
- Write narrative, descriptive paragraphs
- Use positive framing: describe what you want, not what to avoid
- Be spatially specific
- Quote exact text in quotation marks

Use `references/modifiers.md` for reliable modifiers organised by framework element.

## Step 6: Generate

### GPT Backend

```bash
uv run ".claude/skills/viz-image-gen/scripts/generate_image_gpt.py" \
  --prompt "FULL CONSTRUCTED PROMPT" \
  --filename "{projects_base}/viz-image-gen/{YYYY-MM-DD}/{descriptive-name}.png" \
  --size 1536x1024 \
  --quality high
```

Options: `--size` (1024x1024/1536x1024/1024x1536/auto), `--quality` (low/medium/high/auto), `--background` (transparent/opaque/auto), `--format` (png/jpeg/webp), `--input-image`/`-i`

### Gemini Backend

```bash
uv run ".claude/skills/viz-image-gen/scripts/generate_image_gemini.py" \
  --prompt "FULL CONSTRUCTED PROMPT" \
  --filename "{projects_base}/viz-image-gen/{YYYY-MM-DD}/{descriptive-name}.png" \
  --resolution 1K \
  --aspect-ratio 16:9
```

Options: `--resolution` (1K/2K/4K), `--aspect-ratio`, `--input-image`/`-i` (up to 14)

**Do NOT read the generated image back.** Report the saved path only.

## Step 7: Save and Report

Save to: `{projects_base}/viz-image-gen/{YYYY-MM-DD}/{descriptive-name}.png`

The script automatically creates a companion `.log.md` file next to the image with the prompt and generation parameters.

Tell the user the full absolute file path so they can view it. Note which backend was used.

## Step 8: Enrich the Generation Log

After generation succeeds, edit the `.log.md` file's `## Reasoning` section:

```markdown
## Reasoning

### Visual Direction
[Quick or Guided mode? What questions were asked? What did the user choose?]

### Framework Decisions
[The Visual Breakdown that was approved]

### Backend Selection
[Why this backend — e.g., "GPT: hyperreal portrait, detail is priority"]

### Style Selection
[Which style preset or freeform approach, and why]

### References Consulted
[Which reference files informed the prompt]

### Research
[If trending research was done, note findings. Otherwise "None — direct prompt construction"]

### Iteration History
[If revision, note what changed. Otherwise "First attempt"]
```

## Step 9: Feedback

Ask: "How does this look? Want to adjust any of the visual direction, try a different style, or generate another variation?"

Log feedback to `context/learnings.md` → `## viz-image-gen` with date and context.

---

## Style Presets (Quick Reference)

Presets are pre-filled 6-Element Framework configurations. See `references/styles.md` for the index and `references/style-*.md` for full detail.

| Preset | Best for | Style file |
|--------|----------|-----------|
| UGC / Influencer | Product-in-hand, social content, authentic selfie | `style-ugc-influencer.md` |
| Cinematic | Film stills, atmospheric scenes, neon noir | `style-cinematic.md` |
| Anime / Illustration | Ghibli, Shinkai, cel-shading, ink wash | `style-anime-illustration.md` |
| Hyperreal Portrait | Fantasy characters, extreme detail, RPG art | `style-hyperreal-portrait.md` |
| Macro Close-Up | Eye detail, skin texture, product texture | `style-macro-closeup.md` |
| Product / Luxury | Premium product photography, editorial | `style-product-luxury.md` |
| Text / Typography | Posters, brand assets, graphics with text | `style-text-typography.md` |
| Technical Annotation | Architecture diagrams, red-lined schematics | `style-technical-annotation.md` |
| Notebook Sketch | Sketchnotes, educational content, summaries | `style-notebook-sketch.md` |
| Comic / Storyboard | Sequential panels, step-by-step stories | `style-comic-storyboard.md` |
| Product Shoot | Multi-shot product photography from one reference | `style-product-shoot.md` |

---

## Rules

*Updated when the user flags issues. Read before every run.*

- **2026-05-06 — Source image preservation:** When annotating over screenshots, video frames, or any existing image, the base image must remain pixel-perfect unchanged. All existing people, faces, text, UI elements, and content must stay exactly as they are. The prompt must ONLY describe overlay annotations to add on top. Always include explicit preservation language: "Do not alter, modify, or regenerate any part of the original image." If faithful preservation cannot be guaranteed, recommend `tool-screenshot-annotator` as a programmatic alternative.
- **2026-05-06 — Annotation routing:** Real screenshots/video frames needing callouts, circles, or highlights must route to `tool-screenshot-annotator` by default (programmatic overlays, zero source modification). Only route to GPT/Gemini editing when the user explicitly requests artistic/hand-drawn annotation style — and warn about modification risk first.
- **2026-05-06 — Product Shoot Mode:** When a user provides a product image and wants multiple shots, activate Product Shoot Mode (Step 2). Build a Product Lock Description from the reference, generate each shot individually with the lock prepended and reference as `--input-image`. Never batch multiple shot types in one prompt.

---

## Self-Update

If the user flags an issue — wrong style, bad composition, missed detail — update the `## Rules` section immediately with the correction and today's date.
