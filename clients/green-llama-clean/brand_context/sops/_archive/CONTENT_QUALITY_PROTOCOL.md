# Content Quality Protocol

The operational protocol for ensuring blog content meets Green Llama's standards before publish. This is the response to the March 20, 2026 content quality incident — Kay raised concerns about hallucinated citations in AI-generated content. This protocol exists to make sure that does not happen again.

## The non-negotiables

### 1. Never fabricate a statistic

If a claim cannot be sourced cleanly to a Tier 1 source, the claim does not appear in the article. Period.

### 2. Never cite a study you have not verified

Every cited study must be:
- Real (the DOI or PubMed ID resolves)
- Accessible (someone reviewing can open it)
- Relevant (the study actually says what the article claims it says)
- Current (publication date and any retractions checked)

### 3. The [STAT NEEDED] flag is the only acceptable response to uncertainty

When writing and a statistic would strengthen the argument but cannot be sourced cleanly, the inline flag is:

```
[STAT NEEDED: specific claim that needs sourcing]
```

The flag is non-removable until a verified citation replaces it or the claim is removed.

## Review chain

Every article passes through three levels before publish:

### Level 1 — Author review (before submission)

The article author runs the pre-submission checklist:

- [ ] All citations have working URLs
- [ ] All cited studies have been opened and confirmed to support the claim made
- [ ] No `[STAT NEEDED]` flags are unresolved
- [ ] No hallucinated quotes or attributions
- [ ] Byline matches exactly: "Kay Baker, MS, OTR/L | Reviewed by Matthew Keasey, Ph.D."
- [ ] Voice rules from `WRITING_RULES.md` and the blog SOP applied
- [ ] Product mentions verified against current site inventory

### Level 2 — Scientific review (Matt)

For any article containing scientific claims:

- Citations verified by Matt as accurate to the source
- Claims that go beyond what the source actually says get flagged for revision
- Suggested additional citations from Matt's expertise are integrated where they strengthen the article

### Level 3 — Editorial review (Kay)

Before publish:

- Brand voice review — does this sound like Green Llama
- Product accuracy — every product claim, certification, and price is current
- Strategic alignment — does this article serve the topical cluster and brand positioning

## Source verification process

When the author or reviewer encounters a citation, the verification steps are:

1. **Open the URL.** Confirm the page loads.
2. **Read the source.** Skim or read enough to confirm the claim made in the article matches what the source actually says.
3. **Check publication date.** Use sources within the past 5 years where possible. Flag older sources for currency review.
4. **Check for retractions.** PubMed and major journals flag retracted studies. Do not cite retracted work.
5. **Document the verification.** A brief comment in the draft (or a tracked change) noting "verified [date]" helps reviewers downstream.

## Tier 1 sources — quick reference

These are the acceptable Tier 1 sources for Green Llama content:

| Source | Use for |
|---|---|
| EPA (epa.gov) | Indoor air quality, VOCs, Safer Choice product list, regulatory thresholds |
| NIH / PubMed | Peer-reviewed studies on health, toxicology, allergens |
| EWG (ewg.org) | Healthy Cleaning database, ingredient ratings, consumer-facing guidance |
| Peer-reviewed journals | Direct DOI links for specific findings |
| OSHA | Workplace exposure data, occupational health |
| CDC | Public health data, household chemical exposure |
| NFPA / ASTM | Safety standards (where relevant) |
| Recognized industry bodies | Specific certifications (Leaping Bunny, MADE SAFE, etc.) |

## What is not Tier 1

- Wikipedia (treat as a starting point, never as a source)
- Marketing blogs from competitor or unrelated brands
- Generic ".org" sites without subject authority
- LLM-generated summaries presented as research
- Press releases as the sole source for a scientific claim
- Trade publications without independent peer review

## When a claim is contested or uncertain

Some claims are scientifically contested or in the gray zone of "consensus emerging." For those:

- Acknowledge the state of the evidence in the article ("research is emerging" / "preliminary studies suggest")
- Cite the strongest available evidence on each side where appropriate
- Avoid stating a contested claim as settled fact
- Flag for Matt's review with `[CONTESTED CLAIM — need scientific reviewer input]`

## When a citation is missing but the claim is widely accepted

Some claims are common knowledge in the field (basic chemistry, well-established public health facts) and do not strictly require citation. For those, use editorial judgment:

- If the claim is genuinely common knowledge to the target audience, it can stand without citation
- If the claim is common knowledge to subject experts but not to general readers, a citation strengthens the article
- When in doubt, cite

## The alignment call protocol

Per K's suggestion at the March 20, 2026 meeting, a 30-minute alignment call between the content production team (Jason's family member) and the Green Llama team is on the horizon. The call is meant to:

- Establish the no-go list directly (claims, language, product positioning that should never appear)
- Calibrate the brand voice in real-time
- Build a direct communication channel for questions during production
- Reduce the back-and-forth corrections that currently happen post-draft

This call is one of the most leveraged interventions available. A 30-minute conversation tends to solve more than weeks of post-hoc corrections.

## What to do when a quality issue is caught post-publish

If a hallucinated citation, factual error, or significant brand voice issue is caught after publish:

1. **Pull the article from the index.** 301 redirect to the pillar or unpublish.
2. **Notify Kay immediately.** Direct, concise, no excuses. Specify the issue, the impact, and the corrective plan.
3. **Audit adjacent articles** by the same author or in the same batch for similar issues.
4. **Update the protocol** if the issue reveals a gap in the review process.
5. **Republish corrected content** with a publication date update once verified.

## The accountability principle

When an article fails to meet these standards, the response is to own it directly with the client. No deflection, no excuse-making, no minimization. The pattern from the March 20 follow-up email is the working model: acknowledge specifically what went wrong, explain the structural reasons without using them as excuses, commit to concrete fixes, and follow through.
