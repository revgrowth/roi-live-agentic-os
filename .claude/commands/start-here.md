# /start-here

The entry point for every session. Detects state and routes accordingly.

## Mode Detection

Check whether `brand_context/` exists and contains populated files.
- No brand_context/ files → First-run mode
- Files exist → Returning mode

---

## First-Run Mode

### Step 1: Project Scan

Check what exists:
- `brand_context/` files (which ones, which are missing)
- `context/USER.md` (populated or template?)
- `.claude/skills/` (which skills are installed)

Show the user a brief honest state: "Starting fresh — I don't have any brand context yet."

### Step 2: Core Questions

Ask these four questions. No more than four before doing work.

1. "What does your business do? One sentence."
2. "Who's your ideal customer — who do you help?"
3. "What makes you different from the alternatives?"
4. "How do you want to come across? (e.g. direct, warm, authoritative, playful)"

Capture answers. You'll use them to build brand_context/.

### Step 3: Collect Brand Assets + URL Extraction

Ask: "Got a website, LinkedIn, YouTube, or any other brand links I should know about?"

If yes:
- Save all provided URLs and handles to `brand_context/assets.md`
- Use web_fetch to retrieve content from provided URLs
- Extract 5-10 gold-standard sentences that represent their voice
- Note what makes each sentence representative

If no: skip URL extraction, but still create `brand_context/assets.md` with empty fields so it's ready for later.

### Step 4: Local File Scan (Conditional)

If the user mentions they have existing copy, docs, or emails:
"Want to share any files? I can scan them for voice patterns."

If yes: read provided files, extract voice signals and strong sentences.

### Step 5: Build brand_context/

Run the foundation skill methodologies to create the brand files.
Use answers from Step 2 + extracted content from Steps 3-4.

Read each skill's SKILL.md for the full methodology:
- `.claude/skills/mkt-brand-voice/SKILL.md` → produces `voice-profile.md` + `samples.md`
- `.claude/skills/mkt-positioning/SKILL.md` → produces `positioning.md`
- `.claude/skills/mkt-icp/SKILL.md` → produces `icp.md`

Create `context/learnings.md` with sections matching installed skill folder names (e.g., `## mkt-brand-voice`).

### Step 6: Update context/USER.md

Populate context/USER.md with what you've learned:
- Name and business from the conversation
- Communication style signals observed
- Role (founder / marketer / agency / student)

### Step 7: Show Results

Show actual excerpts — not just filenames.

Example format:
```
Here's what I built:

**Your voice:** [2-sentence excerpt from voice-profile.md]
**Your positioning:** [one-line statement from positioning.md]
**Your ICP:** [primary pain statement from icp.md]

Everything's saved in brand_context/. I'll use this in every skill going forward.
```

### Step 8: Dynamic Skill Showcase

Scan `.claude/skills/` for all installed skills.
Read each skill's frontmatter to get name and description.
Group by category (foundation / execution / other).

Present what's available, framed around this specific business:

```
Here's what I can do for [business name]:

**Foundation** (done)
✓ mkt-brand-voice, mkt-positioning, mkt-icp — complete

**Growth Marketing**
- [skill]: [what it does for their specific business]
- [skill]: [what it does for their specific business]
```

End with ONE recommendation based on business context:
"Given you're [situation], I'd start with [skill] — [reason]."

Do NOT present a menu and ask them to pick. Recommend.

---

## Returning Mode

### Step 1: Run session checks

Check freshness, gaps, available skills per CLAUDE.md Session Start protocol.

### Step 2: Brief Status

Show what you know: "I know your brand. [1-sentence summary of their positioning]."

Mention any stale files or gaps if present (once, with opportunity framing).

### Step 3: Route or Recommend

If user has a clear task → execute it using the relevant skill.
If user is open → recommend the highest-leverage next action based on what's missing or what learnings suggest.

---

## Anti-Patterns

1. Never ask more than 4 questions before doing work
2. Never present a skill menu — recommend, don't ask
3. Never rebuild brand_context/ without explicitly asking first
4. Never give generic recommendations — tie them to the specific business
5. Never silently produce generic output when context is missing — note the gap
6. Never use a hardcoded skill list — always scan `.claude/skills/` dynamically
7. Frame gaps as opportunities, not failures
