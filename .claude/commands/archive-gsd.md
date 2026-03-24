# /archive-gsd

Archive the current GSD project's `.planning/` directory so you can start a new one.

## What This Does

1. Finds the active GSD project by scanning `projects/briefs/*/brief.md` for a brief with `level: 3` and `status: active`
2. Moves `.planning/` into that project's folder as `planning-archive/`
3. Updates the brief's frontmatter from `status: active` to `status: complete`
4. Reports where everything was moved

## Steps

### Step 1: Find the active GSD project

Scan `projects/briefs/*/brief.md` for a file with `level: 3` and `status: active` in its YAML frontmatter.

- **Found one** → continue to Step 2
- **Found none** → check if `.planning/` exists:
  - `.planning/` exists but no matching brief → ask: "There's a `.planning/` directory but no matching project brief. Which project folder should I archive it into?" Let the user specify a project name, then create `projects/briefs/{name}/planning-archive/` and move `.planning/` there.
  - No `.planning/` at all → tell the user: "No active GSD project found — nothing to archive."
- **Found multiple** → ask the user which one to archive (this shouldn't happen, but handle it gracefully)

### Step 2: Confirm with the user

Show what will happen:

> "I'll archive the GSD project **{project-name}**:"
> - Move `.planning/` → `projects/briefs/{project-name}/planning-archive/`
> - Update `projects/briefs/{project-name}/brief.md` status to `complete`
>
> "Go ahead?"

Wait for confirmation before proceeding.

### Step 3: Archive

1. Move the directory: `mv .planning/ projects/briefs/{project-name}/planning-archive/`
2. Update the brief's YAML frontmatter: change `status: active` to `status: complete`
3. Verify the move succeeded (check that `projects/briefs/{project-name}/planning-archive/` exists and `.planning/` is gone)

### Step 4: Report

> "Done. Your GSD project **{project-name}** is archived."
>
> - Planning archive: `projects/briefs/{project-name}/planning-archive/`
> - Brief: `projects/briefs/{project-name}/brief.md` (status: complete)
> - Project outputs are still in `projects/briefs/{project-name}/`
>
> "You're free to start a new GSD project with `/gsd:new-project`."

## Anti-Patterns

- Never delete `.planning/` — always move it
- Never archive without user confirmation
- Never archive if `.planning/` doesn't exist
