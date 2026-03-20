---
name: "Nano Banana Trending Research"
time: "every_10m"
days: "daily"
active: "false"
model: "sonnet"
---

You are running as a scheduled job for Agentic OS.

Read CLAUDE.md for system context.

Task: Run the str-trending-research skill on a topic related to AI image generation with Google Gemini's image model (known in this project as "nano banana"). Read `.claude/skills/str-trending-research/SKILL.md` for the full methodology.

Pick ONE fresh topic from this list that hasn't been researched recently in `projects/str-trending-research/`. Choose whichever feels most timely:

- AI image generation prompt engineering techniques (JSON prompts, structured metadata)
- Gemini image generation vs Midjourney vs FLUX vs other models in 2026
- AI-generated product photography and e-commerce visuals
- Text-in-image generation quality across AI models
- AI image generation for social media content creation
- Photorealistic AI portraits and headshots trends
- AI image generation API pricing and rate limits comparison
- Using AI image generation for brand assets and marketing materials

Run the full research methodology: search Reddit, X, and the web for discussions from the last 30 days. Synthesize findings weighted by engagement. Save the research brief to `projects/str-trending-research/` using the skill's standard output format and naming convention.

Skip the "Offer Next Steps" stage — this is a headless job, there's no user to interact with.

If anything fails, note the error in the output file and save what you have.
