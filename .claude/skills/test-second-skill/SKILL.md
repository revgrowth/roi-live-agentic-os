---
name: test-second-skill
description: >
  A second test skill for verifying the update script detects multiple new
  upstream skills correctly. Triggers on: "second test skill". This skill does
  nothing useful — it exists purely for testing the update and install flow.
  Do NOT trigger for any real user task.
---

# Test Second Skill

Another placeholder skill for testing that `scripts/update.sh` correctly detects and offers multiple new skills from the catalog.

## Methodology

1. **Acknowledge** — Tell the user this is a test skill with no real functionality.
2. **Confirm** — Report that the skill was invoked successfully.
3. **Done** — No output is produced.
