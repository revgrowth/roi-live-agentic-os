# Jordan — Daily Workflow

**Audience:** Jordan Spencer
**Primary client:** Coastal Air Plus
**Last updated:** April 27, 2026

This guide walks you through your daily rhythm working in Agentic OS. Every term gets defined the first time it appears. Run this every workday. After two weeks, the pattern becomes automatic.

---

## Quick Glossary

These terms appear throughout this guide. Read them once, then reference back when needed.

**Agentic OS** — the operating system Jason built that contains all of ROI.LIVE's clients, brand context, SOPs, and AI-assisted workflows. It lives in the folder `~/agentic/agentic-os` on your computer.

**Repo (short for "repository")** — a folder that's tracked by Git. Every file change inside the folder gets recorded so you can see history, undo mistakes, and collaborate with others. The agentic-os folder is a repo.

**Git** — the system that tracks changes to files inside a repo. When you "commit" something to Git, you're saving a snapshot of your work at that moment.

**GitHub** — a website that hosts repos online. The agentic-os repo lives at `https://github.com/revgrowth/roi-live-agentic-os`. Your computer has a copy locally; GitHub has the master copy. You sync between them using `git pull` (download) and `git push` (upload).

**Branch** — a parallel version of the repo where you can work without affecting the main version. Think of it like a Google Doc — when you start a new task, you create a "copy" called a branch, do your work there, and only merge it back into the main version when it's ready. Multiple people can work on different branches at the same time without stepping on each other's changes.

**main (the main branch)** — the canonical, "this is the official version" branch. Your work happens on your own branch, and when it's reviewed and approved, it gets merged into main.

**Pull Request (PR)** — when you finish work on your branch and want it merged into main, you open a Pull Request on GitHub. It's a formal "please review my work and merge it" request. Jason reviews, suggests changes if needed, and clicks merge when approved.

**Commit** — a saved snapshot of your work. You commit at meaningful checkpoints (finished a section, completed a deliverable). Each commit has a message describing what changed.

**Push** — uploading your local commits to GitHub so they're backed up and visible to Jason.

**Pull** — downloading updates from GitHub to your local computer. You pull at the start of every day to get whatever Jason or others have committed since you last worked.

**Claude Code** — the command-line tool you use to do AI-assisted work. You launch it with the `claude` command inside whichever folder you're working in. The folder you launch from determines what context loads.

**Client folder** — each client (Coastal Air Plus, French Broad Chocolates, ROI.LIVE itself, etc.) has its own folder under `clients/`. Working on Coastal Air Plus means launching Claude Code from `clients/coastal-air-plus/` so it loads CAP's specific brand context.

**Brand context** — the files inside a client folder under `brand_context/` that describe how that client sounds, who they're talking to, what they stand for. Claude Code loads these automatically when you launch it from that client's folder.

**SOP (Standard Operating Procedure)** — a documented set of rules for how to do a specific type of work. Lives under `agency/sops/`. Examples: how to write a Signal article, how to write a service page, how to run an AEO audit.

**Memory file** — a daily journal Claude Code writes for itself in `context/memory/{date}.md`. It captures what you worked on each day so future-you (or future-Claude) can recall context. It's how the system "remembers" across sessions.

**Wrap up** — a command you type into Claude Code at end of day. It triggers the wrap-up process: capturing learnings, updating the memory file, and setting tomorrow's session up for a clean start.

---

## Your Setup

You have three things running together:

1. **Your computer** — has a local copy of the agentic-os repo at `~/agentic/agentic-os`. This is where you do all your work.
2. **GitHub** — has the canonical online copy of the repo. You sync your local copy with GitHub multiple times a day.
3. **Claude Code** — runs on your computer, reads files from your local repo, helps you do AI-assisted work.

The flow looks like this:

```
GitHub (online)
    ↓ git pull (download Jason's updates each morning)
Your computer (~/agentic/agentic-os)
    ↑ git push (upload your work each evening)
GitHub (online)
```

---

## Start of Day — The Morning Sync

Run this every workday before any Claude Code session. About 5 minutes total.

### Step 1: Open Git Bash

Git Bash is the terminal program where you type git commands. Find it in your Windows start menu and open it.

You'll see a prompt that looks something like:
```
jordan@COMPUTER MINGW64 ~
$
```

The `~` means you're in your home folder. The `$` is where you type commands.

### Step 2: Navigate to the agentic-os folder

Type:
```bash
cd ~/agentic/agentic-os
```

`cd` stands for "change directory" — it's how you move between folders in the terminal.

After running this, your prompt should show:
```
jordan@COMPUTER MINGW64 ~/agentic/agentic-os (main)
$
```

The `(main)` in parentheses tells you which branch you're currently on. Right now you're on the main branch.

### Step 3: Make sure you're on the main branch

Type:
```bash
git checkout main
```

`git checkout` switches between branches. If you were already on main, this does nothing. If you were on a different branch (like yesterday's work branch), this switches you back to main.

You always start each day on main, then create a new branch for today's work.

### Step 4: Pull the latest changes from GitHub

Type:
```bash
git pull origin main
```

Breaking this down:
- `git pull` = download updates
- `origin` = the nickname for "the GitHub repo this folder is connected to"
- `main` = the branch to pull from

Translation: "Download the latest version of the main branch from GitHub."

You'll see output describing what got updated. Something like:
```
Updating a1b2c3d..e4f5g6h
Fast-forward
 clients/coastal-air-plus/projects/seo-strategy.md  | 12 +++++++-----
 1 file changed, 7 insertions(+), 5 deletions(-)
```

This tells you Jason updated a file in Coastal Air Plus. Now your local copy matches the canonical version on GitHub.

**If `git pull` shows merge conflicts** (it'll say "CONFLICT" in the output), stop and message Jason. Don't try to resolve conflicts on main yourself.

### Step 5: Check your memory file from your last session

In VS Code, open this file:

```
clients/coastal-air-plus/context/memory/{most-recent-date}.md
```

The filename uses the date in YYYY-MM-DD format. So if your last session was April 24, the file is `2026-04-24.md`.

Read it. This is your past-self handing off context to your present-self. It tells you:
- What you finished
- What's in progress
- What was waiting on a decision or input
- Any open questions for Jason

If your most recent memory file is older than 2-3 days, you're returning after a break. Spend an extra 5 minutes reading the previous 1-2 memory files too. Context is fragile and worth re-loading before producing.

### Step 6: Check ClickUp for task updates

Open ClickUp. Look at your tasks for Coastal Air Plus. Note any:
- New tasks assigned to you
- Status changes on existing tasks
- Comments from Jason on past work
- Tasks marked "blocked" — these need a decision before you can move forward

If anything is urgent, address it before starting your planned work.

### Step 7: Pick today's task and create your branch

Pick the highest-priority task you can finish (or finish a meaningful chunk of) today.

Now create a new branch for that task:

```bash
git checkout -b jordan/coastal-air-plus/short-task-description
```

Breaking this down:
- `git checkout -b` = "create a new branch and switch to it"
- `jordan/coastal-air-plus/short-task-description` = the branch name

Branch naming rules:
- Always start with `jordan/` (so it's clear who owns it)
- Then `coastal-air-plus/` (the client)
- Then a short, lowercase, hyphenated description of the task

Examples:
- `jordan/coastal-air-plus/summerville-service-page`
- `jordan/coastal-air-plus/keyword-research-q2`
- `jordan/coastal-air-plus/blog-spring-maintenance`

After running this, your prompt updates to show the new branch:

```
jordan@COMPUTER MINGW64 ~/agentic/agentic-os (jordan/coastal-air-plus/summerville-service-page)
$
```

You're now working in your own parallel version of the repo. Anything you do here doesn't affect main until you decide to merge it.

**Why branches matter:** When you work on a branch, you can experiment, make mistakes, even break things — and none of it touches the main version. When you push your branch to GitHub and Jason reviews it, only the changes Jason approves get merged into main. Branches are the safety net that lets you work confidently.

### Step 8: Move into the client folder and launch Claude Code

```bash
cd ~/agentic/agentic-os/clients/coastal-air-plus
claude
```

Two important things:

**Why you `cd` into the client folder before launching Claude Code:** Claude Code loads context based on which folder you launched it from. Launching from `clients/coastal-air-plus/` means it auto-loads:
- Coastal Air Plus brand context (voice, positioning, ICP, samples)
- Coastal Air Plus's past memory and learnings
- The agency-wide standards inherited from the parent folder
- All the SOPs

If you launch Claude Code from the wrong folder, it loads the wrong context, and you'll get generic output. Always `cd` first.

**Why `claude` starts silent:** The first time you ran `/start-here` (during onboarding), the system populated brand context. From then on, Claude Code launches silently into a normal prompt because the system detects "this client is set up, no first-run interview needed."

You're ready to work.

---

## During the Work — The Discipline

These aren't optional. They're how you produce work that ships.

### Don't trust the prompt

When Jason gives you a task, your first 5 minutes are reconnaissance, not execution. Before drafting anything, ask Claude Code:

```
Before doing any work on this task, scan the project for:
1. Has this content already been written or partially written?
2. What existing brand context applies?
3. What inputs am I missing that aren't in this brief?
4. What's the SOP that governs this deliverable type?

Surface findings before drafting anything.
```

This is called Phase 0 reconnaissance. It catches duplicate work, missing inputs, and SOP gaps before you've sunk an hour into the wrong direction. Jason has caught duplicate articles, broken pillar links, and stale SOP references using exactly this pattern. It's not optional.

### When you're stuck, don't grind

If you're stuck for more than 30 minutes on the same problem, stop and ask. Either:
- Ask Claude Code in the session for a different angle
- Message Jason with what you've tried and where you're stuck
- Move to a different task and come back fresh

Grinding past 30 minutes of stuck doesn't produce better work.

### Push back on Claude Code's drafts

First drafts are never shippable. When Claude Code produces something:
- Read it out loud — does it sound like the brand voice?
- Run it past the SOP — does it follow the rules?
- Check the citations — is everything sourced?
- Cut 30% — first drafts are always too long

If a draft is generic, push back: "That section is generic — load the ICP more fully and rewrite." If it has banned phrases, point them out: "There's a 'data-driven' in paragraph 3 — fix and check the rest." If sources are missing, demand them: "Stat in section 4 has no citation. Source it or remove."

You're the editor. Claude Code is a fast writer that needs direction.

### Save outputs to files instead of reading them in the terminal

When Claude Code is producing something longer than 15 lines, ask it to save the output to a file:

```
After completing this analysis, save the full output to context/notes/2026-04-27_audit-results.md so I can read it formatted.
```

Then open that file in VS Code with proper markdown rendering. Way easier than reading streaming terminal output.

### Make checkpoint commits as you complete chunks

A "commit" is a saved snapshot. Don't wait until end-of-day to commit — commit whenever you finish a meaningful chunk (a draft, a section, a research output).

To make a commit:

```bash
git add .
git commit -m "Draft v1 of Summerville service page hero section"
```

Breaking this down:
- `git add .` = "stage all my changed files for commit" (the dot means "everything in current folder and below")
- `git commit -m "..."` = "create a commit with this message"

The message should describe what you accomplished. Make it specific enough that future-you (or Jason) understands what changed.

These checkpoint commits stay on your local computer for now. You don't push them to GitHub until end-of-day. They're for safety and mental clarity.

---

## End of Day — The Wrap Up

Run this every workday before closing your laptop. 10-15 minutes.

### Step 1: Run the wrap-up command in Claude Code

In your active Claude Code session, type:

```
wrap up
```

This triggers a special process called `meta-wrap-up`. It will:
- Capture what you accomplished today
- Log learnings into `context/learnings.md` if you discovered anything new
- Update today's memory file in `context/memory/`
- Flag open threads or decisions waiting on someone
- Set up tomorrow's session for a clean start

**Let it complete fully.** Don't interrupt. Don't close the terminal mid-wrap-up. The wrap-up is what makes tomorrow start cleanly. Skipping it means tomorrow morning you'll waste 20 minutes re-loading context.

If wrap-up asks you questions ("Should I log this as a learning?"), answer them. Default to "yes" on logging learnings. Better to over-document than under-document.

### Step 2: Exit Claude Code

When wrap-up finishes, type:

```
exit
```

Or press Ctrl+C twice. You're back at the regular Git Bash prompt.

### Step 3: Check what's changed

```bash
cd ~/agentic/agentic-os
git status
```

`git status` shows which files have changed since your last commit. You should see:
- Files modified by your day's work
- Files modified by wrap-up (memory file, possibly learnings.md)

If something unexpected appears, look closely before committing. If you're not sure, message Jason before continuing.

### Step 4: Stage and commit your day's work

```bash
git add clients/coastal-air-plus/
git status
git commit -m "Clear description of what was built today"
```

Breaking this down:
- `git add clients/coastal-air-plus/` = stage everything inside the Coastal Air Plus folder for commit
- `git status` (run a second time) = verify what got staged before committing
- `git commit -m "..."` = create the commit with a descriptive message

Commit message guidance:
- **Good:** "Draft Summerville service page — hero, services list, FAQ"
- **Good:** "Keyword research for Q2 blog topics: completed 12 candidates"
- **Bad:** "EOD work" (tells Jason nothing)
- **Bad:** "stuff" (worthless to future-you)

If you're mid-task and not at a clean stopping point, commit anyway with a clear message. WIP stands for "work in progress":

```bash
git commit -m "WIP: Summerville service page — hero done, services section in progress"
```

WIP commits are fine on your own branch. Jason understands the workflow.

### Step 5: Push your branch to GitHub

```bash
git push origin jordan/coastal-air-plus/your-branch-name
```

Breaking this down:
- `git push` = upload my commits to GitHub
- `origin` = the GitHub repo this folder is connected to
- `jordan/coastal-air-plus/your-branch-name` = which branch to push

If this is the first time you're pushing this branch, add `-u`:

```bash
git push -u origin jordan/coastal-air-plus/your-branch-name
```

The `-u` sets up a connection so future pushes are just `git push` without the long argument.

After pushing, your work is backed up on GitHub. Even if your laptop dies tonight, your work survives.

### Step 6: Update ClickUp

Note status changes on your ClickUp tasks:
- Mark anything you completed as Done
- Update any in-progress tasks with a brief status note
- Flag any tasks where you're blocked waiting on a decision

This is how Jason knows what's moving and what's waiting on him.

### Step 7: Open or update a Pull Request when work is review-ready

If today's work completed a deliverable (not WIP), open a Pull Request on GitHub for Jason to review:

1. Go to https://github.com/revgrowth/roi-live-agentic-os in your browser
2. A yellow banner appears saying your branch had recent pushes — click "Compare & pull request"
3. Title: clear deliverable description (e.g., "Summerville Service Page — first draft")
4. Description: what you built, what feedback you want, any caveats or open questions
5. Click "Create pull request"
6. Tag Jason for review

If the PR is mid-task and not ready for review, leave the branch on GitHub but don't open the PR yet. Open it when you've reached a review-able stopping point.

After Jason reviews and clicks "Merge pull request", your work becomes part of the main branch. Tomorrow morning when you `git pull origin main`, it'll be in your local copy too.

### Step 8: Send Jason a brief end-of-day note

Quick message in Teams or however you communicate:
- What you completed today
- What you're working on tomorrow
- Anything blocked or needing his input

Three sentences max. This isn't a status report — it's a handoff.

Example:
> "Finished first draft of the Summerville service page (PR open). Tomorrow I'm starting on the Asheville service page using the same template. No blockers right now — Mike's intake doc filled in the warranty specifics I needed."

---

## When Things Go Wrong

### `git pull` shows merge conflicts
A merge conflict means two people changed the same lines of the same file. Stop. Message Jason. Don't try to resolve on main yourself yet.

### Claude Code returns generic output
Push back harder. "This is generic. Load brand_context/voice-profile.md fully and rewrite section 2 in Mike's voice with a specific receipt-style example."

### Source files referenced in an SOP don't exist
Stop and message Jason. SOP path drift is a known issue — better to flag it than work around it.

### You committed something sensitive (API key, password, internal file)
Tell Jason immediately. Don't push if you haven't yet. If you already pushed, rotate the credential and Jason will help clean the git history. Hiding mistakes makes them worse.

### You broke something
Tell Jason what broke and what you tried. Be specific. "I think I broke the Coastal Air Plus brand_context — voice-profile.md has weird markdown rendering after my edit" is useful. "Something's wrong" is not.

### You're stuck on a git command
Don't guess. Don't try random commands. Stop and ask Jason, or ask Claude Code: "I ran X and got Y error, what does this mean?" Random git commands can lose work permanently.

---

## Quick Reference Card

After two weeks, you won't read the full guide anymore — you'll glance at this card.

**Morning (5 min):**
```bash
cd ~/agentic/agentic-os
git checkout main
git pull origin main
git checkout -b jordan/coastal-air-plus/{task-name}
cd clients/coastal-air-plus
claude
```
Then read the most recent memory file and check ClickUp.

**During work:**
- Phase 0 reconnaissance before any execution
- 30-minute stuck rule — ask, don't grind
- Push back on first drafts
- Save long outputs to files
- Checkpoint commits as you complete chunks:
  ```bash
  git add .
  git commit -m "Description of what changed"
  ```

**End of day (10-15 min):**

In Claude Code:
```
wrap up
exit
```

In Git Bash:
```bash
cd ~/agentic/agentic-os
git status
git add clients/coastal-air-plus/
git commit -m "Clear description"
git push origin jordan/coastal-air-plus/{your-branch-name}
```

Then update ClickUp, open PR if review-ready, send Jason an EOD note.
