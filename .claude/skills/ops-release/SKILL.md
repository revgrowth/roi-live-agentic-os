---
name: ops-release
description: Cut a release by finalising the changelog, bumping the version, and tagging. Moves all Unreleased entries into a dated version section, updates the VERSION file, commits, and creates a git tag. Use when ready to ship, version, or release. Triggers on "release", "cut a release", "bump version", "ship it", "new version", "tag a release".
---

# Release

Finalise the changelog, bump the version number, and tag the release.

## Workflow

### 1. Show What's Unreleased

Read `CHANGELOG.md` and display everything under `## Unreleased`. If there's nothing there, tell the user there's nothing to release and stop.

### 2. Suggest a Version Bump

Read the current version from the `VERSION` file.

Apply simple versioning rules:

| Change types present | Bump | Example |
|---------------------|------|---------|
| Only **Fixed** | Patch | 1.2.0 → 1.2.1 |
| **Added**, **Changed**, **Improved**, or **Removed** | Minor | 1.2.1 → 1.3.0 |
| User says "breaking" or "major" | Major | 1.3.0 → 2.0.0 |

Show the suggestion and let the user confirm or override. For example:
> Current version: 1.2.0. This release has new features, so I'd suggest **1.3.0**. Sound right?

### 3. Finalise the Changelog

Replace the `## Unreleased` content with a placeholder and create a new versioned section:

```markdown
## Unreleased

_Nothing yet — use `/new-feature` to start something._

## v{new-version} — {YYYY-MM-DD}
### Added
- Whatever was listed under Unreleased
### Fixed
- Whatever was listed under Unreleased
```

Keep the category grouping exactly as it was. Just move it from Unreleased into the new version block, inserted between the Unreleased section and the previous version.

### 4. Update VERSION

Write the new version number (without the `v` prefix) to the `VERSION` file.

### 5. Commit and Tag

```bash
git add CHANGELOG.md VERSION
git commit -m "release: v{new-version}"
git tag v{new-version}
```

### 6. Confirm

Tell the user:
- The new version number
- A summary of what's in the release
- Remind them that this doesn't push — they decide when to `git push --tags` or merge to `main`

## Rules

- Never push to a remote — that's the user's decision
- Never merge branches — this skill only handles the version/changelog/tag
- Never modify past version entries in the changelog
- If `VERSION` doesn't exist, ask the user what version to start at (suggest `0.1.0`)
- If `CHANGELOG.md` doesn't exist, tell the user to run `/new-feature` first
- The date on the version entry is always today's date
- Keep the same plain-English tone — no commit hashes, no file paths in the changelog
