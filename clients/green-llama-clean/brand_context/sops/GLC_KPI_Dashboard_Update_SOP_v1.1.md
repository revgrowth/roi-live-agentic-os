# GLC KPI Dashboard: Monthly Update SOP — v1.1

**Owner:** Jason Spencer · ROI Live
**Client:** Green Llama Clean (GLC)
**Artifact updated:** `green-llama-dashboard.html` (static HTML, committed to client)
**Cadence:** Monthly (mid-month review pull + month-end final close)
**Audience for this SOP:** Claude Code agent operating inside the GLC agentic OS, with Jason in the loop for source uploads and approvals.

**Version:** 1.1 (2026-05-01) — Adds extraction-rigor protocol, source-figure matrix gate, blocking sanity tripwires, stale-value sweep, and render-and-read final review. These additions came directly from failure modes observed on the 2026-04-30 month-end close run.

---

## 0. Purpose

Refresh every metric, date stamp, comparison window, and chart on the GLC KPI dashboard so the artifact reflects the most recent closed period available, with rigorous YoY math and zero stale references. The dashboard is a client-facing trust artifact. Data integrity is the gate. **If a number cannot be verified, it does not ship.**

---

## 1. Run Metadata (set this at the top of every run)

[Section unchanged from v1. See `GLC_KPI_Dashboard_Update_SOP.md` for the metadata table and example.]

---

## 2. Pre-flight Checklist

[Section unchanged from v1.]

---

## 3. Date Framing Rules (CRITICAL)

[Section unchanged from v1.]

---

## 4. Month-End Transition Logic

[Section unchanged from v1.]

---

## 5. Data Extraction by Source

[Section 5.1–5.6 unchanged from v1. **Section 5.7 added below** — Extraction Rigor Protocol.]

### 5.7 Extraction Rigor Protocol (NEW in v1.1)

These rules apply to every screenshot, CSV, or report the agent processes. Failures on the 2026-04-30 run traced to skipping or rationalizing past these rules. They are not optional.

#### 5.7.1 Resolution gate

If a critical figure on a screenshot is below ~200px wide on screen (rough rule: text smaller than 8pt), the agent must request a re-shot at higher resolution before extracting. No reading from tab-thumbnail or low-res preview images. The agent must explicitly state to the user: "Image quality insufficient for cell N — please re-shot."

#### 5.7.2 Cell-by-cell extraction with explicit citation

For every tabular report (GA4 channel groups, GSC queries, Klaviyo campaigns, Shopify analytics, SE Ranking position tables, Seal admin), the agent extracts cells using this format:

```
[source-file or screenshot ID] · [row label] × [column header] = [value]
```

Example:
```
scr 114533 · Total row × Sessions col = 11,092
scr 114533 · Total row × Total revenue col = $8,034.02
scr 114533 · Organic Search row × Sessions col = 3,744
scr 114533 · Organic Search row × Total revenue col = $2,160.11
```

Every figure that ends up in §6 calculations or on the dashboard must trace back to one of these citations. **No exceptions.** Notes are working memory; the citation is the audit trail.

#### 5.7.3 Digit-by-digit transcription with read-back

When extracting a number from a screenshot:

1. Read each digit out loud (mentally) as you write it.
2. Write the value.
3. Re-read the value against the source. Confirm digit count and exact match.
4. Speed-reading is forbidden. Pattern-matching ("number that starts with $1 in the revenue column") fails on similar-shaped numbers like `$8,034` vs `$19,772`.

#### 5.7.4 No-extrapolation rule for headline figures

A headline figure on the dashboard must come from a directly-read source cell. Never compute headline figures as `total × share` or other extrapolations.

If a derived figure is needed (e.g., a ratio across two sources), it must:
- Carry a tilde (`~`) prefix
- Have a footnote stating its inputs
- Be labeled "derived" in the source-figure matrix (§6.A below)

Example violations from 2026-04-30 run:
- ❌ "Apr organic GA4 revenue ~$8,663 = Shopify $13,654 × 63.4% session share" (extrapolation pretending to be GA4 data)
- ✅ "Apr organic GA4 revenue $2,160.11 — scr 114533 · Organic Search row × Total revenue col"

#### 5.7.5 Re-pull-on-insert rule

Every figure copied from extraction notes to the dashboard at §7 must be re-verified against its primary source citation at copy time. The extraction file is not authoritative — only the source citation is. If the agent cannot re-verify the source at insert time, the figure does not ship.

This rule exists because the failure mode "I wrote it down once, therefore it's correct" caused 12+ stale dashboard tiles on the 2026-04-30 run.

---

## 6. Calculation Conventions

[Sections 6.1–6.4 unchanged from v1. **Sections 6.A, 6.B added below.**]

### 6.A Source-Figure Matrix (NEW in v1.1) — required artifact

Before any §7 dashboard editing, the agent produces a source-figure matrix as a markdown table. It lists every key figure that will appear on the dashboard, with its source citation (§5.7.2 format) and a sign-off column.

```
| Figure | Source citation | Value | Sign-off |
|---|---|---|---|
| Apr 2026 GA4 organic sessions | scr 114533 · Organic Search row × Sessions col | 3,744 | ☐ |
| Apr 2026 GA4 organic revenue | scr 114533 · Organic Search row × Total revenue col | $2,160.11 | ☐ |
| Apr 2025 GA4 organic sessions | scr 114745 · Organic Search row × Sessions col | 2,889 | ☐ |
| Apr 2025 GA4 organic revenue | scr 114745 · Organic Search row × Total revenue col | $2,835.25 | ☐ |
| Apr 2026 Shopify total sales | shopify-extraction.md · Apr 2026 Header KPIs | $13,654.09 | ☐ |
| ...every other key figure... | | | |
```

The agent presents this matrix to Jason for sign-off before proceeding to §7. Sign-off should take 5 minutes — Jason spot-checks 3–5 high-leverage figures against the source. Any contested figure halts the run until re-verified.

The matrix is saved as `[run-date]_source-figure-matrix.md` alongside the extraction files.

### 6.B YoY Math Audit Trail (NEW in v1.1)

For every YoY % shown on the dashboard, the agent records the math in the source-figure matrix or an adjacent calculation log:

```
Apr 2026 organic sessions YoY:
  3,744 / 2,889 - 1 = 0.2960 = +29.6%
  Source A: scr 114533 (Apr 2026)
  Source B: scr 114745 (Apr 2025)
```

This makes every YoY claim auditable in 30 seconds. Catches misreads early when the math doesn't match an intuited expectation.

---

## 6.C Sanity-Check Tripwires (NEW in v1.1) — these are blockers, not flags

The agent runs these checks after §6 calculations, before §7 editing. **A failed check halts the run until re-verified — it does not pass through with a "flagged for next run" note.**

### Tripwire 1 — GA4 ≤ Shopify storefront revenue

For DTC stores selling exclusively through Shopify, GA4 storefront-attributed revenue must be ≤ Shopify storefront revenue (Total Sales). Cookie consent gaps, tracking loss, and ad-blocker prevalence push GA4 below Shopify, never above. If `GA4 revenue > Shopify revenue × 1.05`: **STOP**. Re-verify the GA4 read.

Worked example from 2026-04-30 run: agent's first read showed GA4 Apr 2026 revenue $19,772 vs Shopify $13,654 (+45%). Should have been a hard stop. Was rationalized as "GA4 captures non-storefront events." Wrong. Re-pull confirmed actual GA4 = $8,034 (59% of Shopify, correct direction).

### Tripwire 2 — Channel sums equal Total

For any GA4 channel-group report, sum of channel rows must equal the Total row within ±2%. If not, the agent has misread one or more cells. Re-extract.

### Tripwire 3 — Same number across "different" extractions

If a re-pulled metric returns a value within 0.5% of the prior wrong value, the agent has likely re-read its own notes rather than the new source. Re-verify by digit-by-digit read against the new screenshot.

Worked example from 2026-04-30 run: agent's "corrected" GA4 revenue read of $19,771.79 was within 0.001% of the original wrong $19,771.81. Should have triggered an immediate re-read. Did not. Wrong number propagated to 12+ dashboard locations.

### Tripwire 4 — YoY directional sanity

If a metric's YoY % is more than 2× another peer metric's YoY (e.g., +309% organic sessions when total sessions YoY is +130%), the underlying numbers must be re-verified. Single-metric outliers are usually misreads.

### Tripwire 5 — Single-source claim cross-verification

For any single-source metric (e.g., GA4 attributed revenue) where a peer source exists (Shopify, Klaviyo), the agent must compute the variance and confirm it is within typical attribution gap (±15% sessions, ±25% revenue). Outside that range = re-verify.

---

## 7. Tab-by-Tab Update Procedure

[Section unchanged from v1.]

---

## 8. QA Checklist (the gate)

[Sections 8.1–8.4, 8.6, 8.7 unchanged from v1. **Sections 8.5 amended; 8.X, 8.Y added.**]

### 8.5 Reconciliation Pass — AMENDED in v1.1

The agent computes and displays this reconciliation table to Jason for sign-off before publish:

| Metric | Source A | Source B | Variance | Tolerance | Verdict |
|---|---|---|---|---|---|
| `CURRENT_MONTH` revenue | Shopify | GA4 | computed | ±5% | PASS / **HALT** |
| `CURRENT_MONTH` orders | Shopify | Klaviyo placed-order events | computed | ±10% | PASS / **HALT** |
| Organic sessions | GSC | GA4 | computed | ±15% | PASS / **HALT** |

**v1.1 change:** Outside-tolerance variance is no longer a flag-for-next-run. It is a **HALT**. The run does not proceed to §9 publish until either:
- The variance is brought within tolerance via re-extraction (preferred), or
- Jason explicitly approves the variance with a stated rationale (which is recorded in the run log)

The 2026-04-30 run had a +44.8% GA4-vs-Shopify revenue variance (way outside ±5%) and proceeded to publish. v1.1 prevents this by making the gate mechanical, not advisory.

### 8.X Stale-Value Sweep (NEW in v1.1)

After every figure correction during §7 editing, the agent runs a `grep` against the dashboard for:

1. The OLD value (every variant: with comma, without comma, rounded, etc.)
2. Related percentages derived from the old value
3. Related YoY claims based on the old value
4. Dependent ratios (revenue/session, click rate, etc.)

Example from 2026-04-30 run: agent corrected organic revenue $8,663 → $2,160.11. Should have triggered greps for:
- `8663`, `8,663` (the value)
- `12239`, `12,239` (the wrong-related session count)
- `63.4`, `63.43` (the wrong session share)
- `309%`, `205%` (the wrong YoY claims)
- `4.23×`, `~38,043` (the wrong derived ROI multiples)

Failure to grep → the SEO tab kpi pill at line 414 stayed wrong even after the user-flagged correction. v1.1 makes this grep sweep mandatory after each correction.

### 8.Y Render-and-Read Final Pass (NEW in v1.1)

Before §9 publish, the agent (or Jason if agent cannot render) opens the rendered HTML in a browser, screenshots each tab, and reads each screenshot fresh — as if seeing the dashboard for the first time. The agent looks for:

- Numbers that don't match the source-figure matrix
- Narrative claims that contradict the data ("recovering" when data shows decline)
- Stale period labels
- YoY directions that don't sanity-check

This final pass catches what targeted greps miss. The 2026-04-30 run had a stale "12,239 / +309% YoY" tile that visual review caught and grep didn't (because the right CSS class wrapped wrong content).

If the agent cannot render the HTML directly (CLI environment), the agent must explicitly state to Jason: "Cannot perform §8.Y render pass from CLI — please screenshot each tab and review before publish." Publish does not proceed without this acknowledgment.

---

## 9. Publish & Deliver

[Section unchanged from v1.]

---

## 10. Common Errors & Recovery

[Section 10 augmented with v1.1 entries below.]

| Error | Symptom | Recovery |
|---|---|---|
| GA4 read same value across "different" pulls | A "corrected" figure matches the prior wrong figure within 0.5% | The agent re-read its own notes, not the new screenshot. Re-extract digit-by-digit per §5.7.3. |
| Headline figure derived instead of read | Tilde missing on what should be a derived figure; or no source citation | Replace with directly-read cell value per §5.7.4. If derivation is necessary, mark with tilde and footnote. |
| Stale figure caught by user post-publish | User flags a tile that still shows old data | Run §8.X grep sweep against the OLD value family. Re-publish. Add the missed grep pattern to next-run's checklist. |
| Reconciliation flag escalated past gate | Figure is published despite §8.5 variance outside tolerance | This is a v1.1 SOP violation. The run should have halted at §8.5. Re-pull the source data and re-publish; record the violation in the run log under "Process flags." |
| Apr 2 / Mar 19 / mid-month date stuck on closed-month tile | Static date label in a card not updated | Add the date pattern (`Apr [0-9]+, [year]`) to the §8.X grep sweep checklist for next run. |

---

## Appendix D: Failure Modes Recorded From 2026-04-30 Run (NEW in v1.1)

These are the specific failure modes that triggered v1.1. Documenting them so future runs can pattern-match early.

### D.1 GA4 channel-group misread

**What happened:** Agent extracted "Apr 2026 GA4 = 19,295 sessions / $19,771.79 revenue" from a low-res screenshot. Actual values from a re-shot screenshot: 11,092 sessions / $8,034.02 revenue. Both readings claimed to be "April 2026" — same window, different numbers.

**Root cause:** Agent referenced its own extraction notes ($19,771.81 from a prior wrong pull) instead of re-reading the new screenshot. The "corrected" $19,771.79 was within 0.001% of the original wrong value — a confabulation, not a fresh read.

**Prevention rules:** §5.7.3 (digit-by-digit), §5.7.5 (re-pull-on-insert), §6.C Tripwire 3 (same number across different extractions).

### D.2 Headline figure extrapolation

**What happened:** SEO ROI card showed "Apr organic revenue ~$8,663" computed as `Shopify total $13,654 × organic session share 63.4%`. Actual GA4 organic revenue: $2,160.11 (75% lower than the extrapolation).

**Root cause:** Agent treated session share as a proxy for revenue share. They are not equivalent — channel-specific CVR and AOV vary widely. The actual GA4 cell was directly readable but never read.

**Prevention rules:** §5.7.4 (no-extrapolation rule).

### D.3 Stale-tile after correction

**What happened:** Agent corrected organic GA4 revenue $8,663 → $2,160 in one location (SEO ROI card) but missed updating the SEO tab kpi pill at line 414 which still showed "12,239 sessions · 63.4% · +309% YoY". User caught it post-publish.

**Root cause:** Agent didn't grep for related stale values after the primary correction.

**Prevention rules:** §8.X stale-value sweep.

### D.4 Reconciliation variance ignored

**What happened:** §8.5 reconciliation showed +44.8% GA4-over-Shopify revenue variance (vs ±5% tolerance). Agent labeled as "explainable — GA4 captures non-storefront events" and proceeded to publish.

**Root cause:** §8.5 in v1 treated outside-tolerance as a flag-for-next-run, not a halt. Agent rationalized past the warning.

**Prevention rules:** §8.5 amendment (v1.1) — outside-tolerance is a halt, not a flag.

### D.5 Visual-only stale tile

**What happened:** A kpi pill showed correct CSS structure but contained stale numbers ("12,239 / +309% YoY"). Targeted grep with focus on the corrected figure family didn't catch it because the wrong content used different patterns than the agent searched.

**Root cause:** No final visual review of the rendered HTML. Agent claimed publish-ready without screenshotting each tab.

**Prevention rules:** §8.Y render-and-read final pass.

---

**End of SOP v1.1.**

For prior version see `GLC_KPI_Dashboard_Update_SOP.md` (v1.0). v1.1 supersedes v1.0.
