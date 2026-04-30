# Green Llama Clean — Open Items

Captured from the 2026-04-29 onboarding plus merged from the source package's prior open-items doc. Stale items from the package are marked.

## From onboarding (2026-04-29)

### 1. Performance Lab pillar remediation

The published pillar at greenllamaclean.com (mirror at [`brand_context/reference/samples/pillar-performance-lab-2026-Q1.md`](../brand_context/reference/samples/pillar-performance-lab-2026-Q1.md)) does not meet the agency Citation Discipline SOP or the GL Blog Content SOP v1.1 standard:

- Sources are dumped at the bottom; no inline citation hooks
- Word count ~1,400, under agency e-comm pillar band (2,500–3,500)
- Em-dashes throughout, violating the GLC overlay full ban

**Action:** Rewrite with inline citation hooks tying specific claims to specific sources. Expand to 2,500–3,500 words. Strip em-dashes. Republish with a `dateModified` update per Core Standards §15.4.

**Block:** Do NOT write or publish new spokes that link to this pillar until remediation is complete. New spokes inherit the credibility hit.

**Owner:** TBD — currently Jason / Jason's family member per existing GLC content production setup.

### 2. Voice Charter v5.0 conversation with Kay's team

The AI Voice Charter v5.0 at [`brand_context/reference/voice-charter-v5.md`](../brand_context/reference/voice-charter-v5.md) includes a "fear · guilt · belonging · pride · joy" emotional-targeting framework and a "1 emotional hook per 150 words" rule. These are out of step with:

- 2024 FTC Green Guides update on substantiation requirements for eco/health claims
- Google's E-E-A-T quality framework (fear-based framing as a credibility signal against the brand for YMYL-adjacent content)
- AI Overview citation patterns (favor measured evidence-based language)

For an EWG-Verified women-owned eco brand, the Charter creates strategic risk in any channel.

**Action:** Schedule a separate review with Kay's team to revise the Charter. Not blocking onboarding.

**Boundary:** The Voice Charter v5.0 does NOT propagate to other ROI.LIVE clients. It stays GLC-internal until revised. Capture this rule wherever client-onboarding templates live.

### 3. Client Parameter Sheet build

Per agency standard ([`agency/README.md`](../../../agency/README.md)), every active client should have `client-parameter-sheet.md` filled from [`agency/sops/ROI-LIVE-Client-Parameter-Sheet-Template-v1.md`](../../../agency/sops/ROI-LIVE-Client-Parameter-Sheet-Template-v1.md). GLC does not have one yet.

**Action:** Build `clients/green-llama-clean/client-parameter-sheet.md` in a follow-up session. Scope: brand identity, expert entity (Kay + Matt + Beth), voice profile, design tokens (already extracted into `assets.md`), business context (DTC e-commerce, US national, primary CTA = product purchase), technical (GA4 ID, GSC property, schema `@id` values, sitemap, Shopify platform).

### 4. Scientific Sources verification

[`brand_context/scientific-sources.md`](../brand_context/scientific-sources.md) reconciles two source files in the original packages. Every URL needs to be tested against the live site to confirm currency. Some agency database URLs (EPA, ChemExpo) restructure regularly.

**Action:** Verify each URL resolves. Flag dead or paywalled sources. Capture Wayback snapshots per agency Citation Discipline SOP §5.6. Update the verification date in `scientific-sources.md` when complete.

### 5. Existing client learnings.md was contaminated with ROI.LIVE-flavored content

Discovered at onboarding: `clients/green-llama-clean/context/learnings.md` (pre-onboarding state, dated 2026-04-22) contained ROI.LIVE positioning/voice/icp learnings, not GLC content. Looks like scaffold content that did not get cleaned during the original `add-client.sh` run.

**Action (taken in this onboarding):** Replaced contents with a clean GLC-scoped scaffold + folded in the GLC-specific KEY_LEARNINGS from the source package + added the onboarding-day learnings. The original ROI.LIVE-flavored content is preserved in git history if needed.

**Open question for Jason:** Other client folders may have the same scaffold contamination. Worth checking `clients/*/context/learnings.md` across active clients in a separate session.

### 6. Citation Discipline SOP back-fill across other clients

Now that the Citation Discipline SOP exists at agency level, every other active client (Coastal Air Plus, FBC, ROI.LIVE, G&H/Yellow Jacket, ALVARA, etc.) eventually needs an editorial overlay matching the same pattern as [`brand_context/sops/GL_Editorial_Overlay_v1.md`](../brand_context/sops/GL_Editorial_Overlay_v1.md).

**Action:** Back-fill task for a separate session. Not in scope for this onboarding.

---

## Agency-infrastructure items discovered during this onboarding (NOT GLC-specific)

These items surfaced during GLC onboarding but apply to the agency / repo as a whole. Captured here because GLC was the discovery surface; ownership is agency-level.

### A1. Master client status registry — repo-level

No `STATUS.md` or `clients/README.md` exists in the repo. The Claude.ai project file `AGENTIC-OS-CONTEXT.md` carries client status (Active / Scaffolded but inactive structure) but it isn't version-controlled and isn't visible to repo-only sessions (Claude Code, Codex, anyone running locally without the Claude.ai project loaded).

**Decision needed:** create a repo-level status file (mirroring the project file's Active / Scaffolded structure), or rely on the project file alone with explicit acceptance of its limitations.

**Action:** Out of scope for GLC onboarding. Flagged for next agency-infrastructure session.

### A2. Scaffold contamination across other clients

Discovered during this onboarding: `clients/green-llama-clean/context/learnings.md` contained ROI.LIVE-flavored learnings before this session replaced them. Likely contamination from the `add-client.sh` scaffold step.

**Hypothesis:** the other 8 scaffolded clients (blue-tree, coastal-air-plus, eastside-microblading, gh-yellow-jacket-oil, rage-create, tailgate-fix, thp-homes, training, plus alvara/french-broad-chocolates if they were scaffolded the same way) may carry the same ROI.LIVE-flavored content in `context/learnings.md`.

**Action:** Quick audit task in a separate session. Grep `clients/*/context/learnings.md` for "ROI.LIVE" and clean up matches. Update `add-client.sh` if the contamination originates there. Out of scope for GLC onboarding.

---

## Merged from source package — `OPEN_ITEMS_AND_NEXT_STEPS.md` (status as of package export)

> The package was exported some weeks before the 2026-04-29 onboarding. Several items below are stale (Mother's Day past, April deadlines elapsed). Not all items have been re-verified; treat this section as a **historical snapshot to triage**, not as the current state of work.

### SEO content cluster

| Item | Status (per package) | Re-triage |
|---|---|---|
| Publish 6-article batch (definitional, do-they-work, room-by-room, transition, allergies/asthma, 2026 buyer's guide) | Drafted, awaiting Kay/Matt review | **VERIFY:** which articles published, which still pending |
| Anchor text refresh on existing internal links | Scoped, not started | **STILL OPEN** |
| Cross-cluster link funneling (surface cleaners cluster → pillar) | Scoped, not started | **STILL OPEN** |
| Verify [STAT NEEDED] flags before publish | In progress | **NOW ENFORCED** by agency Citation Discipline SOP §5 hard gate |

Recommended publish order from package: 1 → 6 → 2 → 3 → 4 → 5, spaced 5–7 days apart.

### Email/SMS strategy

| Item | Status (per package) | Re-triage |
|---|---|---|
| Mother's Day campaign launch | April 27, 2026 | **STALE** — date passed |
| Email 1–4 build for Week 1 May | Awaiting build | **VERIFY** |
| Subscription landing page | Awaiting build | **VERIFY** |
| Father's Day "Dad's Kit" bundle in Shopify | Awaiting build (Mike) | **STILL OPEN** |
| Gift wrapping checkout option | Due April 25 | **STALE** — verify if shipped |
| Gift order tagging in Shopify | Due April 25 | **STALE** — verify if shipped |
| Digital gift card product configured | Awaiting build (Mike) | **VERIFY** |
| Healthy Home Tips for Families content | Due April 23 (Kay) | **STALE** — verify if delivered |
| Q3 preview content approval | Awaiting (Kay) | **VERIFY** |
| Referral program mechanics ($10/$10) | Awaiting | **VERIFY** |

### Dashboard and analytics

| Item | Status (per package) | Re-triage |
|---|---|---|
| Static HTML dashboard committed to client | Done | **DONE** |
| Bot/international traffic filtering (Cloudflare + Turnstile + Signifyd) | Recommendation made, implementation pending (Mike) | **VERIFY** |
| "Build Your Bundle" button UI update (desktop) | In progress (Jason) | **VERIFY** |
| Subscription platform migration evaluation (SKIO vs. Seal) | Mike evaluating | **VERIFY** |
| Live dashboard with password protection | Not started | **STILL OPEN** |

### Client relationship

| Item | Status (per package) | Re-triage |
|---|---|---|
| Alignment call between Jason's family member and GLC team | Offered, not yet scheduled | **STILL OPEN** — high-leverage |
| Source audit on latest blog batch | In progress | **VERIFY** |
| Follow-up strategy meeting (~2 weeks post March 20) | Should be scheduled | **VERIFY** if held |

### Decisions still to make (per package)

- **Subscription platform migration timing.** SKIO is the recommendation. Longer delay = harder migration as subscriber base grows.
- **Content cadence.** Current contract: 4 articles/week. Open question whether to renegotiate for fewer, higher-quality articles.
- **Returning customer rate measurement convention.** Order-level (Shopify default) vs. customer-level. Confirm Kay's preference.

### Watch list (per package, verify currency)

- "Non toxic cleaning products" cluster recovery: top 5 within 60–90 days post 6-article publish
- Klaviyo click rate progression: 0.69% (April baseline) → 1.5% (end of June) → 3.5% (full-year)
- CVR distortion from bot traffic: pre/post implementation comparison
- Returning customer AOV ($38.91) vs new customer AOV ($44.74): close the gap

### Risks and open questions (per package)

- Live dashboard re-deployment requires password protection + security incident root cause addressed
- Hallucinated citations risk: `[STAT NEEDED]` protocol now in place; final test is the next batch passing Kay's review
- Klaviyo deliverability at growing send volume (33 emails + 11 SMS in May, same in June)
- Four-articles-per-week structural pressure on quality control
