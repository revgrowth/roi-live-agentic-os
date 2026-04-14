---
name: ops-new-feature
description: Start or finish a feature. Starting creates a feature branch and changelog entry. Finishing confirms with the user, merges to the target branch, and cleans up. Triggers on "new feature", "start feature", "add feature", "begin work on", "start working on", "finish feature", "done with feature", "merge feature", "feature done", "merge this".
---

# New Feature

Start or finish a feature branch with changelog tracking.

## Workflow

### 1. Gather Details

Ask for two things if not already provided:

- **Feature name** — short, kebab-case slug (e.g., `notification-system`). Suggest one based on what the user describes.
- **Description** — one plain-English sentence describing what this adds, changes, or fixes. Written for someone who uses the product, not someone who reads the code.

### 2. Determine the Change Type

Map the description to a Keep a Changelog category:

| Category | When to use |
|----------|-------------|
| **Added** | New functionality that didn't exist before |
| **Changed** | Existing behaviour that works differently now |
| **Improved** | Existing functionality that works better (performance, UX, reliability) |
| **Fixed** | Something that was broken and now works correctly |
| **Removed** | Functionality that has been taken out |
| **Deprecated** | Functionality that still works but will be removed in future |

Default to **Added** if unclear. The user can override.

### 3. Create the Branch

```bash
git checkout -b feature/{feature-name}
```

Branch off whatever branch the user is currently on (usually `dev`). If they're on `main`, warn them and suggest branching off `dev` instead.

### 4. Update CHANGELOG.md

Add the entry under `## Unreleased` in the appropriate category section. If the category section doesn't exist yet under Unreleased, create it.

**Format:**
```markdown
## Unreleased
### Added
- {Description} — one clear sentence
```

If there are already items under Unreleased, append to the right category. Don't remove existing entries.

### 5. Commit

```bash
git add CHANGELOG.md
git commit -m "changelog: add {feature-name} to unreleased"
```

### 6. Confirm

Tell the user:
- The branch name
- The changelog entry that was added
- Remind them to merge to `dev` when the feature is done

---

## Finishing a Feature

Triggered when the user says "done with this feature", "merge this", "finish feature", "feature done", or similar — while on a `feature/*` branch.

### 1. Confirm the Branch

Check the current branch. If it's not a `feature/*` branch, ask which feature branch they mean. Never run the finish flow on `dev` or `main`.

### 2. Show What's in the Feature

Display:
- The changelog entry from the `## Unreleased` section that was added when the feature started
- The number of commits on this branch since it diverged from the target
- Any uncommitted changes (warn if there are any — they should commit or stash first)

### 3. Confirm the Merge Target

Determine the target branch — usually `dev`. Check by looking at where the feature branched from:

```bash
git log --oneline feature-branch --not dev | wc -l
```

Ask the user: "Merge `feature/{name}` into `dev`? (Y/n)"

Do not proceed without explicit confirmation.

### 4. Merge

```bash
git checkout dev
git merge feature/{name} --no-ff -m "merge: feature/{name} into dev"
```

Use `--no-ff` so the merge is always visible in history. If there are conflicts, stop and tell the user — never force-resolve.

### 5. Clean Up

Ask: "Delete the `feature/{name}` branch? (Y/n)"

Only delete on confirmation:
```bash
git branch -d feature/{name}
```

### 6. Confirm

Tell the user:
- The merge is complete
- The changelog entry is now on `dev` under Unreleased
- Remind them that `/release` will bundle all unreleased entries into a version when they're ready

---

## Quick-Fix Mode

Triggered when the user says `/new-feature --quick` or "quick fix" for trivial one-file changes.

### 1. Gather Details

Same as the standard flow — get a feature name and description.

### 2. Express Lifecycle

Run the full branch lifecycle in one flow:

```bash
git checkout -b feature/{feature-name}
```

Make the change (user directs what to edit), then:

```bash
# Update changelog
git add CHANGELOG.md {changed-files}
git commit -m "fix: {description}"

# Merge back immediately
git checkout dev
git merge feature/{feature-name} --no-ff -m "merge: feature/{feature-name} into dev"
git branch -d feature/{feature-name}
```

### 3. Confirm

Tell the user the fix is merged to `dev` and the feature branch is cleaned up. Remind them the changelog entry is under Unreleased.

**When NOT to use quick-fix:** If the change touches more than ~3 files, or if it's in Zone 3 (command-centre code), suggest the standard flow instead.

---

## Rules

- Never create a branch if one with the same name already exists — ask the user what to do
- Never modify entries outside the `## Unreleased` section
- Keep descriptions in plain English — no technical jargon, no file paths, no commit hashes
- One feature = one changelog entry. If the feature has sub-parts, describe the whole thing in one sentence
- If `CHANGELOG.md` doesn't exist, create it with the standard header and an Unreleased section
- If `VERSION` doesn't exist, create it with `0.1.0`
- Never merge without explicit user confirmation
- Never force-resolve merge conflicts — stop and explain
- Never delete a branch without asking
- Never merge to `main` — features merge to `dev`. The user promotes `dev` to `main` via `/release` or manually
