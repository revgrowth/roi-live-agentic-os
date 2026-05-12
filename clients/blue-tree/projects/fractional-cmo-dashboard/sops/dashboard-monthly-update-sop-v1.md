# Blue Tree Marketing Dashboard
## Monthly Update Standard Operating Procedure

**Owner:** Jason Spencer, ROI.live
**Client:** Blue Tree Landscaping (Maureen, Jeff)
**Cadence:** Monthly, on or near the 1st of each month
**Cycle target:** Complete update + client email within 3 business days of month end

---

## Table of Contents

1. [Cycle Overview](#1-cycle-overview)
2. [Phase 1: Source Data Collection](#phase-1-source-data-collection)
3. [Phase 2: Data Processing & Canonical Numbers](#phase-2-data-processing--canonical-numbers)
4. [Phase 3: Tab-by-Tab Update Specifications](#phase-3-tab-by-tab-update-specifications)
5. [Phase 4: Calculations Refresh](#phase-4-calculations-refresh)
6. [Phase 5: Chart & Visual Updates](#phase-5-chart--visual-updates)
7. [Phase 6: Copywriting Refresh](#phase-6-copywriting-refresh)
8. [Phase 7: Full QA Process](#phase-7-full-qa-process)
9. [Phase 8: Email Composition & Delivery](#phase-8-email-composition--delivery)
10. [Phase 9: Cycle Closeout](#phase-9-cycle-closeout)
11. [Appendix A: Methodology Reference](#appendix-a-methodology-reference)
12. [Appendix B: Stop Slop Writing Rules](#appendix-b-stop-slop-writing-rules)
13. [Appendix C: QA Checklist (Print Version)](#appendix-c-qa-checklist-print-version)
14. [Appendix D: Lead Matching Cascade](#appendix-d-lead-matching-cascade)

---

## 1. Cycle Overview

The dashboard is a 7-tab interactive HTML report covering 13 rolling months of performance data. Every month end, every chart, table, KPI, and narrative block needs review and update. The four critical principles for any monthly cycle:

**Principle 1: Recompute from raw, never edit numbers in place.** Every dashboard number must trace back to a fresh canonical computation from source files. String-replace edits on prior values cause silent drift.

**Principle 2: Cross-tab consistency.** The same number cannot appear with different values in different tabs. If 76 New Construction pool leads YTD shows in the hero, it must show 76 in every other reference.

**Principle 3: Apples-to-apples comparisons.** YoY claims compare same-month-to-same-month or same-period-to-same-period. CPL claims use the same denominator on both years.

**Principle 4: Stop Slop writing.** Every line of client-facing copy follows the writing rules in Appendix B.

### What gets updated each cycle

- **Charts & graphs:** Every chart adds the new month's data point. Year-over-year overlays update where applicable.
- **KPIs:** Top-line, channel-level, pool-pipeline, and benchmark KPIs all recompute.
- **YTD stats:** Every "year-to-date" figure shifts forward as the new month adds in.
- **YoY stats for the new month:** Side-by-side comparison of new month vs same month one year prior.
- **Narrative copy:** Hero subtitles, bottom-line blocks, section ledes, and chart annotations rewrite to match new data.
- **Email:** Two variants (full + concise) drafted fresh each cycle.

### Files involved

```
/home/claude/dashboard/
├── dashboard.html              ← Shell (tabs, header, footer)
├── tab1_overview.html          ← Performance
├── tab2_pool.html              ← Pool Pipeline
├── tab3_channels.html          ← Where Leads Come From
├── tab4_website.html           ← Website Activity
├── tab5_seo.html               ← SEO & Local
├── tab5_pipeline.html          ← Active Pipeline
├── tab6_benchmarks.html        ← How We Compare
├── dashboard_final.html        ← Merged output (regenerated each merge)
└── canonical_numbers.json      ← Fresh data from raw sources, used for QA

/mnt/user-data/outputs/
└── Blue_Tree_Dashboard_[Month]_[Year].html   ← Final deliverable
```

---

## Phase 1: Source Data Collection

Collect every source file before touching the dashboard. Missing inputs cause partial updates that introduce drift.

### 1.1 Inputs from Jerome (Blue Tree CRM)

Request the following exports for the most recent month end:

| File | Content | Used for |
|---|---|---|
| **lead_export_[date].csv** (current year) | All WhatConverts leads from Jan 1 of current year through last day of new month | Lead volume, channel attribution, pool detection, all month-by-month tables |
| **lead_export_[date].csv** (prior year) | All WhatConverts leads from prior year (full year, for YoY same-month comparisons) | YoY comparisons, prior-year baselines |
| **opportunities.csv** | Active CRM opportunities (proposals + won deals) | Pipeline value, won contracts, source attribution |
| **won_jobs_export.csv** | All won jobs from prior year through current period (for total business revenue) | Marketing as % of total business revenue, denominator for benchmarks |

**Note on WhatConverts CSV format:** The first row is a category header ("All Leads", date range). The actual column headers sit on row 2. Always skip row 1 and use row 2 as headers. There is also a duplicate "Date" column at positions 9 and ~117 that requires first-occurrence-only header indexing during parsing.

**Note on white-label:** WhatConverts is referenced as "RG Tracking" in all client-facing materials. Internal SOPs and code can use the platform's actual name.

### 1.2 Inputs from Ad Platforms

Pull confirmed spend numbers from the platforms themselves, not from estimates:

| Source | What to capture | Format |
|---|---|---|
| **Google Ads dashboard** | Monthly spend breakdown for the new month + YTD total | Screenshot of the monthly breakdown table |
| **Meta Ads Manager** | Monthly spend breakdown for the new month + YTD total | Screenshot of the monthly breakdown table |

If platform data is not available for any month, use the prior dashboard's estimate and flag the gap in the methodology note.

### 1.3 Inputs from GA4 & Search Console

| Source | Export | Used for |
|---|---|---|
| **GA4** | Sessions by channel, conversion events, top landing pages, monthly traffic trend | Tab 4 (Website Activity) |
| **Google Search Console** | Top performing keywords, click-through rates, impression trends (zip download) | Tab 5 (SEO & Local) |

### 1.4 Inputs from SEO Tools

| Source | Export | Used for |
|---|---|---|
| **SeRanking** | Position tracking detailed export (CSV) | Keyword position changes, ranking distribution |
| **GBP Insights** | Map pack appearances, profile views, calls, direction requests | Tab 5 GBP performance section |

### 1.5 Pre-flight check

Before starting Phase 2, verify:

- [ ] Current-year WhatConverts file present and parseable
- [ ] Prior-year WhatConverts file present (for YoY)
- [ ] Latest opportunities export from Jerome
- [ ] Confirmed Google Ads spend for new month
- [ ] Confirmed Meta Ads spend for new month
- [ ] GA4 export downloaded
- [ ] Search Console export downloaded
- [ ] SeRanking export downloaded
- [ ] Last cycle's dashboard HTML available for diff comparison

If any source is missing, request from Jerome before proceeding.

---

## Phase 2: Data Processing & Canonical Numbers

This phase produces a single source-of-truth JSON file that every tab will reference. Never compute the same number twice.

### 2.1 Build the canonical numbers script

Run the canonical computation script (template in `/home/claude/canonical_numbers.py`). It must produce:

```json
{
  "[year]": {
    "total_uq_leads": int,
    "pool_leads": int,
    "pool_subcategories": {"New Construction": int, ...},
    "channels": {"Google Ads": int, "Meta Ads": int, ...},
    "pool_channels": {"Google Ads": int, "Meta Ads": int, ...},
    "monthly": {"2026-01": int, "2026-02": int, ...},
    "pool_monthly": {"2026-01": int, ...},
    "monthly_by_channel": {"2026-01": {"Google Ads": int, ...}, ...}
  },
  "[new_month]": {
    "total_uq_leads": int,
    "pool_leads": int,
    "channels": {...},
    "pool_channels": {...}
  },
  "[same_month_prior_year]": {
    "total_uq_leads": int,
    "pool_leads": int,
    "channels": {...}
  },
  "spend": {
    "current_year_ytd_google_ads": float,
    "current_year_ytd_meta_ads": float,
    "current_year_ytd_seo_retainer": float,
    "current_year_ytd_marketing_retainer": float,
    "current_year_ytd_total": float,
    "new_month_google_ads": float,
    "new_month_meta_ads": float
  },
  "filter_diagnostics": {
    "total_whatconverts_leads": int,
    "pass_status_unique": int,
    "pass_quotable_yes": int,
    "excluded_spam_no_real_signal": int,
    "excluded_job_seeker_no_project": int,
    "excluded_wrong_number": int,
    "cross_channel_dupes_consolidated": int,
    "long_window_dupes_consolidated": int,
    "excluded_existing_customer_service": int,
    "final_qualified_leads": int,
    "verification_exclusion_rate_pct": float,
    "thresholds_passed": bool
  },
  "pool_funnel": {
    "pool_leads_by_month_channel": {"2026-01": {"Google Ads": 0, ...}, ...},
    "pool_quotes_count_by_month_channel": {"2026-04": {"Google Ads": 1, "GBP": 1, ...}, ...},
    "pool_quotes_value_by_month_channel": {"2026-04": {"Google Ads": 111554.00, "GBP": 4654.00, ...}, ...},
    "pool_wins_count_by_month_channel": {"2026-04": {"GBP": 1, ...}, ...},
    "pool_wins_value_by_month_channel": {"2026-04": {"GBP": 4654.00, ...}, ...},
    "ytd_pool_leads_total": int,
    "ytd_pool_quotes_count": int,
    "ytd_pool_quotes_value": float,
    "ytd_pool_wins_count": int,
    "ytd_pool_wins_value": float,
    "ytd_lead_to_quote_rate_pct": float,
    "ytd_quote_to_win_rate_pct": float,
    "pool_opps_detail": [
      {"name": "...", "stage": "...", "channel": "...", "value": float,
       "subtype": "New Construction|Renovation|Maintenance|Repair|Other Pool",
       "proposal_date": "YYYY-MM-DD", "won_date": "YYYY-MM-DD"}
    ]
  },
  "crm": {
    "ytd_won_total": float,
    "ytd_won_count": int,
    "ytd_pipeline_total": float,
    "ytd_pipeline_count": int,
    "won_by_source": {...},
    "pipeline_by_source": {...},
    "lost_total": float,
    "lost_count": int
  }
}
```

### 2.2 Lead filtering and qualification

The dashboard counts only de-duplicated, qualified marketing leads. WhatConverts tagging does most of the work, but the pipeline includes verification layers to catch slippage and three forms of deduplication that go beyond what WhatConverts handles natively.

**The base filter (foundation, non-negotiable):**

```
Status == "Unique" AND Quotable == "Yes"
```

This filter must apply to every lead count in every tab. Below is what each part does and what it does not catch.

#### 2.2.1 What WhatConverts handles

**`Status = "Unique"` covers:**
- Same phone number calling more than once within the WhatConverts dedup window (typically 30-60 days)
- Same email submitting multiple forms within the dedup window
- Repeat lead detection within the configured platform window

**`Status = "Unique"` does NOT cover:**
- Long-window repeats (someone who calls in March then again in October)
- Cross-channel duplicates (same person fills Meta form AND calls tracking number same day)
- Household-member duplicates (husband fills form, wife calls 2 weeks later)

**`Quotable = "Yes"` is meant to cover:**
- Spam calls
- Vendor / sales solicitations
- Job seeker inquiries
- Wrong number / butt dial calls
- Bot calls

`Quotable` is a human-applied or rule-based tag inside WhatConverts. Its accuracy depends on whoever is reviewing leads tagging them correctly. The verification layers below catch tagging gaps.

#### 2.2.2 Verification Layer 1: Spam pattern scan

Run this regex scan against every UQ lead's combined text fields (transcripts, notes, messages, lead summary, call transcription, voicemail transcription). Any matches trigger a manual review flag.

```python
spam_patterns = [
    (r'\bseo\b|search engine optim', 'SEO sales pitch'),
    (r'increase your (traffic|leads|sales|revenue|ranking)', 'Sales solicitation'),
    (r'I (can|would like to) help you (with|grow|increase)', 'Sales solicitation'),
    (r'I work with (companies|businesses) like yours', 'Sales solicitation'),
    (r'grow your (business|revenue|customer)', 'Sales solicitation'),
    (r'on behalf of', 'Third-party solicitation'),
    (r'merchant (services|cash|account)', 'Merchant services spam'),
    (r'business (loan|funding|capital|line of credit)', 'Loan spam'),
    (r'lower your (credit card|interest|processing)', 'Financial spam'),
    (r'google (listing|verification|business profile)\s+(scam|expir|verif)', 'GBP scam'),
    (r'extended (warranty|car warranty)', 'Warranty spam'),
    (r'reaching out to (offer|introduce|share)', 'Cold outreach'),
    (r'we (provide|offer|specialize in) (marketing|advertising|leads)', 'Marketing vendor'),
]
```

A flagged lead with NO pool/landscape/maintenance keywords present is almost certainly a false positive in the qualified bucket. Exclude from the dashboard count and log to diagnostics.

A flagged lead WITH pool/landscape keywords is usually the spam regex catching a coincidental phrase. Include in the dashboard count but log for awareness.

#### 2.2.3 Verification Layer 2: Job seeker scan

```python
job_seeker_patterns = [
    (r'\blooking for (work|a job|employment|opportunit)', 'Job seeker'),
    (r'\bapply(ing)? for (a |the )?(position|job|work)', 'Job application'),
    (r'I have experience (in|with) landscap', 'Landscape job seeker'),
    (r'\bmy resume', 'Resume submission'),
    (r'\bany (positions|openings|jobs) available', 'Job inquiry'),
    (r'\bcareer opportunit', 'Career inquiry'),
    (r'\bhiring\b.*\?', 'Hiring inquiry'),
    (r'\bwork for (you|your company)', 'Job seeker'),
    (r'currently employed (at|with)', 'Job seeker'),
]
```

Job seekers with NO project keywords get excluded. Job-seeker phrasing combined with project keywords ("I have experience in landscaping and want a quote on my own pool") gets reviewed manually.

#### 2.2.4 Verification Layer 3: Wrong number / misdial scan

```python
wrong_number_patterns = [
    (r'wrong number', 'Wrong number'),
    (r'sorry.*wrong\s+(number|company|address)', 'Wrong number'),
    (r'I was trying to (call|reach)\s+(?!blue tree)', 'Misdialed'),
    (r'I dialed the wrong', 'Misdialed'),
    (r'\bbutt[\s-]?dial', 'Butt dial'),
]
```

Exclude all matches. These are not leads.

#### 2.2.5 Verification Layer 4: Cross-channel deduplication

Within the YTD window, identify leads that appear under multiple channels with the same identifying information. This catches the "submitted Meta form AND called tracking number" scenario.

```python
def find_cross_channel_dupes(leads):
    """Group leads by normalized phone + email. Flag groups with multiple channels."""
    groups = defaultdict(list)
    for l in leads:
        if l.phone_norm:
            groups[('phone', l.phone_norm)].append(l)
        if l.email_norm and not is_generic_email(l.email_norm):
            groups[('email', l.email_norm)].append(l)
    
    cross_channel = []
    for key, lead_list in groups.items():
        if len(lead_list) > 1:
            channels = set(l.channel for l in lead_list)
            if len(channels) > 1:
                cross_channel.append({
                    'identifier': key,
                    'leads': sorted(lead_list, key=lambda x: x.date),
                    'channels': channels
                })
    return cross_channel
```

**Attribution rule when a cross-channel duplicate is found:**

- Count the contact ONCE in total UQ leads (not N times)
- Attribute to the FIRST-TOUCH channel (earliest date) for primary attribution
- Record the other channel touches in `multi_touch_channels` for the multi-touch view
- Reduce the per-channel count for the later-touch channels by the duplicate count

This prevents inflated lead counts when the same person engages multiple channels.

#### 2.2.6 Verification Layer 5: Long-window duplicate detection

Beyond WhatConverts' native Status=Unique window, scan the full year for the same phone or email appearing in multiple `Unique` records.

```python
def find_long_window_dupes(leads, window_days=365):
    """Find leads with same phone or email that WhatConverts marked Unique
    but are within window_days of each other."""
    # Implementation walks sorted leads and identifies pairs within the window
```

**Treatment of long-window dupes:**

- If the gap is < 90 days: probably the same inquiry, count as 1
- If the gap is 90-180 days: possibly the same person re-engaging, review manually
- If the gap is > 180 days: count as 2 separate inquiries (legitimate re-engagement)

#### 2.2.7 Verification Layer 6: Existing-customer service-call detection

Cross-reference each UQ lead against the CRM contact list. Existing customers calling for NEW projects should still count as leads. Existing customers calling about ONGOING work should not.

```python
service_call_keywords = [
    'follow up on', 'check on', 'status of (my|our)',
    'when (will|can) you (start|finish|complete)',
    'invoice', 'billing', 'payment',
    'last year you', 'you did our', 'previous (job|project|service)',
    'warranty', 'return.*check', 'come back to'
]
```

Combined logic:

```python
def is_existing_customer_service_call(lead, crm_contacts):
    is_in_crm = (
        lead.phone_norm in crm_contacts.phone_index or
        lead.email_norm in crm_contacts.email_index
    )
    if not is_in_crm:
        return False  # New contact, real lead
    has_service_signals = any(re.search(kw, lead.text.lower()) for kw in service_call_keywords)
    has_new_project_signals = any(kw in lead.text.lower() for kw in ['new', 'add', 'install', 'build', 'design', 'estimate', 'quote'])
    return has_service_signals and not has_new_project_signals
```

Existing-customer service calls get excluded from the dashboard's lead count. Existing customers asking about new projects stay in the count.

#### 2.2.8 Filter cascade order

Apply the filters in this exact sequence:

```
Step 1: Apply Status=Unique AND Quotable=Yes (WhatConverts foundation)
Step 2: Run spam pattern scan, exclude matches without pool/landscape signals
Step 3: Run job seeker scan, exclude matches without project signals
Step 4: Run wrong-number scan, exclude all matches
Step 5: Run cross-channel dedup, consolidate to first-touch
Step 6: Run long-window dedup, consolidate or split by gap rules
Step 7: Run existing-customer service-call scan, exclude service calls only
Step 8: Final qualified lead count
```

#### 2.2.9 Cycle diagnostics

Every cycle, log filter diagnostics and check against thresholds:

```
Filter diagnostics for [Month] [Year] cycle:
  Total WhatConverts leads:        X
  Pass Status=Unique:              Y  (Y/X = A%)
  Pass Quotable=Yes:               Z  (Z/Y = B%)
  Excluded as spam (no real signal): a
  Excluded as job-seeker:          b
  Excluded as wrong-number:        c
  Cross-channel dupes consolidated: d
  Long-window dupes consolidated:  e
  Excluded as existing-customer-service: f
  Final qualified leads:           Q
  Verification layer exclusion rate: (a+b+c+d+e+f) / Z = N%
```

**Diagnostic thresholds:**

| Metric | Healthy range | Action if outside range |
|---|---|---|
| Quotable=Yes pass rate | 60-85% of Unique | Below 60%: WhatConverts may be over-tagging spam. Review tagging rules with platform admin. Above 85%: tagging may be too lenient, run spot-check on 20 random Quotable=Yes leads. |
| Verification layer exclusion rate | 0-3% | Above 3%: WhatConverts tagging quality has degraded. Investigate before publishing. Above 5%: hold the dashboard send and reconcile with Jerome. |
| Cross-channel dupes consolidated | 0-2% | Above 2%: aggressive multi-channel campaigns are double-counting. Verify channel-level numbers. |
| Long-window re-engagements | 0-5% | Above 5%: customers may be re-entering the funnel. Check if attribution is making sense. |

The current cycle baseline (May 2026) shows: 0.8% verification layer exclusion rate, 0% cross-channel dupes, 0% long-window dupes. Future cycles should track close to this baseline. A jump from 0.8% to 5% week-over-week is a signal that tagging quality has slipped and needs attention.

#### 2.2.10 What stays excluded from the dashboard but logged

Some lead-like records get excluded from the dashboard count but get logged for awareness:

- Job seekers with no project signal: log to operations for HR pipeline tracking
- Vendor solicitations: log for vendor-block-list maintenance
- Existing-customer service calls: log for customer-success team visibility

These logs are not part of the client deliverable. They support the operational hygiene of the lead intake process.

### 2.3 Channel attribution rules

Apply this exact mapping to every WhatConverts row:

| Source | Medium | Maps to |
|---|---|---|
| google | cpc | Google Ads |
| facebook / meta / instagram | (any) | Meta Ads |
| gmb / google business | (any) | GBP |
| google | organic | Google Organic |
| bing | (any) | Bing Organic |
| (direct) or empty | (direct) or empty | Direct |
| (any) | referral | Referral |
| klaviyo | (any) | Email |
| (any) | email | Email |
| Other combinations | | Other |

### 2.4 Pool detection

A lead is classified as a pool lead if EITHER condition is true:

**Condition A: Form field signal.** The lead form contains a non-empty value in any of these fields: `Custom Pools`, `Pool Services`, `Pool Renovation`.

**Condition B: Keyword match.** After stripping the WhatConverts phone greeting (regex below), the concatenated text from the columns listed in Appendix A contains any of these keywords: `pool`, `spa`, `jacuzzi`, `swim`, `plunge`, `dunk`, `pmax`, `infinity edge`, `fiberglass`, `gunite`, `vinyl liner`.

**Greeting strip regex (critical):**
```python
greeting_re = re.compile(
    r'thank you for calling blue tree.*?'
    r'(?:\?|how can|how may|landscape|month|today|name|help|leave a message)',
    re.IGNORECASE | re.DOTALL
)
```

Without this strip, the phone greeting "maintaining beautiful landscapes, custom pools and patios" produces false positives on every single transcript.

### 2.5 Pool subcategorization

For each lead classified as a pool lead, assign one of: `New Construction`, `Renovation`, `Maintenance`, `Repair`, `Other Pool`.

**Priority order (form fields first, then keywords):**

1. `Custom Pools` form field present → New Construction
2. `Pool Renovation` form field present → Renovation
3. `Pool Services` form field present → Maintenance
4. NC keywords match (`build`, `install`, `new pool`, `design`, `custom pool`, `gunite`, `fiberglass`, `vinyl liner`, `inground`, `pmax`, `plunge`, `infinity edge`) → New Construction
5. Renovation keywords match (`renov`, `remodel`, `resurface`, `replaster`, `rebuild`, `redo`) → Renovation
6. Repair keywords match (`repair`, `leak`, `broken`, `fix`, `pump`, `filter`, `heater`, `crack`) → Repair
7. Maintenance keywords match (`opening`, `closing`, `service`, `clean`, `chemical`, `algae`) → Maintenance
8. None of the above → Other Pool

**Methodology note:** The keyword-based categorization carries inherent variance. Two reasonable methodologies (NC priority vs NC exclusion) can produce 40% different NC counts. Document the methodology used in the dashboard footer and stick with it across cycles. Switching methodology mid-cycle creates apparent month-over-month changes that are classification noise, not real shifts.

### 2.6 CRM dedup logic

The opportunities export from Jerome can contain duplicate opportunity records (same deal appearing in multiple weekly snapshots). Dedup logic:

1. Lowercase the opportunity name as the dedup key
2. When duplicates exist, prefer the record with the most-progressed stage:
   - `Won` > `Lost` > `Proposed` > `Active`
3. Keep the deal value from the preferred record

This produces a clean opportunity list where each deal appears once.

### 2.7 Revenue attribution: dual system

Every closed deal and active proposal needs one of seven channel tags: Google Ads, Meta Ads, GBP, Google Organic, Direct, Referral, Other. Two parallel systems combine to assign each one. Both are required because each catches what the other misses.

**System 1: Jerome's CRM source field (first-touch tagging).**
Jerome's team tags each opportunity with a source at intake. This is the cleanest single signal because it reflects what the customer said when they first reached out. Use this as the default attribution.

**System 2: WhatConverts cross-match (marketing-influence verification).**
Match every CRM opportunity back to a WhatConverts lead record using the matching cascade in **Appendix D**. The cross-match catches three failure modes that pure source-field tagging misses:

1. **Household member attribution.** Mr. Berzins fills out the Google Ads landing form and starts the conversation. Mrs. Berzins becomes the contract signer. The CRM tags the won deal under her name as "Existing customer" or "Direct" because she's the one on the contract. Cross-matching the household by surname + phone area + email domain attributes the deal back to its Google Ads origin.
2. **Source field gaps.** When intake forgets to tag a source, or tags it wrong, cross-matching against the actual marketing touchpoint corrects the record.
3. **Multi-touch verification.** When Jerome tags a deal as "Direct" but the contact has 4 prior Meta Ads form submissions, the cross-match flags this for review.

**Combine the two systems with this rule:**

```
For each opportunity:
  match = run_match_cascade(opp, whatconverts_leads)  # Appendix D
  if match.confidence >= 0.85:
    attributed_channel = match.lead.channel
    attribution_method = "cross_match_" + match.tier
  elif jerome_source_field is not empty:
    attributed_channel = map_jerome_source_to_channel(jerome_source_field)
    attribution_method = "jerome_source"
  elif match.confidence >= 0.60:
    attributed_channel = match.lead.channel
    attribution_method = "cross_match_low_confidence"
    flag_for_review = true
  else:
    attributed_channel = "Other / Unknown"
```

**Two reporting figures, both valid:**

- **First-touch attribution** (Jerome's source field only): tracks how customers self-identify their entry point. Useful for intake QA.
- **Marketing-influenced attribution** (cross-match cascade): tracks every deal where a marketing channel produced an identifiable touchpoint, including household-member matches. This is the figure used for ROI calculations because it captures the full contribution of the marketing program.

**Historical methodology note:**
Earlier 2025 dashboards used cross-match alone with looser rules and produced inflated attribution ($316K marketing-attributable revenue 2026 YTD). Switching to Jerome's source field alone produced $295K. Running the proper cascade in Appendix D produces a defensible figure between the two, with each match labeled by tier and confidence. Document which figure is in the dashboard and which methodology produced it. Switching mid-cycle creates apparent revenue shifts that are actually attribution methodology changes, not real performance moves.

### 2.8 Pool funnel computation

The Pool Pipeline tab requires four stages of data computed by channel × month: pool leads, pool quotes sent, pool jobs won, and rollup conversion rates.

**Stage 1: Pool Leads** (from WhatConverts, broad scope)

Use the standard pool detection from section 2.4 (form fields + keyword matching with greeting strip). Group by month and by channel. This produces the pool leads grid.

**Stage 2: Pool Quotes Sent** (from CRM, strict scope)

Strict pool filter for opportunities:

```python
def is_pool_opp_strict(o):
    """Check ONLY project name and description fields. Tags and notes are too broad."""
    text = ' | '.join([
        o.get('Opportunity Name',''),
        o.get('Project name',''),
        o.get('Project Description','')
    ]).lower()
    pool_kws = ['pool','spa','jacuzzi','gunite','fiberglass','plunge','dunk pool','infinity edge','pmax']
    return any(k in text for k in pool_kws)
```

For every opportunity passing this filter:
- A "quote" exists when `Proposal sent/presentation date` is non-empty
- Bucket by the proposal date's month
- Bucket by the channel mapped from `source` field
- Sum count and `Lead Value`

**Stage 3: Pool Jobs Won** (from CRM, strict scope)

Same strict pool filter. For each pool opp at stage `Job won` or `Won`:
- Bucket by `Project won date` month
- Bucket by channel from `source`
- Sum count and `Lead Value`

**Stage 4: Conversion rates rollup**

Per channel YTD:
- Lead → Quote rate = (channel quotes count) / (channel pool leads count) × 100
- Quote → Win rate = (channel wins count) / (channel quotes count) × 100, or "cycle running" if quotes count is 0

**Why two different scopes (broad leads, strict opps):**

Pool leads are inquiries. Someone asking "do you do pool maintenance" counts. The broad WhatConverts pool detection captures these.

Pool opportunities are projects with proposals. A spring cleanup at a property that happens to have a pool is not pool work; it's landscape work for a pool customer. The strict filter (project name/description) keeps the funnel honest by excluding incidental pool-customer business.

**Data limitation to document:**

The current opportunities export from Jerome contains recent activity, not historical. To populate 2025 monthly quotes and wins for the same channel × month tables, request a historical CRM export covering all opportunities created or won in 2025 with source field, proposal date, and won date populated. Until then, the 2025 columns in the funnel tables stay empty and the methodology note discloses this.

### 2.9 Save canonical JSON

Save the output to `/home/claude/canonical_numbers.json`. Every subsequent phase reads from this file, not from raw CSVs.

---

## Phase 3: Tab-by-Tab Update Specifications

For each tab, the section below lists every element that needs review and update each cycle. Work the tabs in order. Save after each tab.

### 3.1 Tab 1: Performance (Overview)

**Hero left side:**
- Eyebrow: `[Year] YEAR-TO-DATE · THROUGH [Month] [Day]` → updates with new period
- Headline: rewrite each cycle to match the dominant story (record month, milestone, milestone hit, etc.)
- Subtitle: 2-3 sentences setting up the campaign-defining metric. Pull the month's strongest YoY beat.

**Hero ROI panel (right side):**
- Campaign-defining metric value: full-campaign ROI multiple (e.g., 15.6x)
- Industry context band: 4-8x typical, 10x+ top decile (landscape/outdoor living)
- Three sub-cards: prior year, current YTD, full campaign. Each shows multiple, invested $, won + pipeline $.

**Big Picture cards:**
- 5 stat cards: total leads YTD, pace projection, pool leads YTD, NC pool leads, marketing investment

**Channel snapshot:**
- 4 small cards: Google Ads, Meta Ads, SEO/GBP, Combined. Each shows: leads, spend, won, ROAS multiple.

**Bottom line:**
- 4-5 sentence narrative paragraph synthesizing the month's story for leadership. Lead with the strongest number. Mention any active deal worth flagging (e.g., Berzins $112K).

**Numbers to refresh:**
- All YTD lead counts (total + per channel)
- Spend YTD per channel
- Won and pipeline values per channel
- Full-campaign ROI multiple
- Pace projection (current pace × remaining months / current run rate)
- YoY % vs prior year same period

### 3.2 Tab 2: Pool Pipeline

**Hero stats row:**
- Pool leads YTD (e.g., 163)
- New Construction pool leads YTD (e.g., 76)
- Largest active pool deal (name + dollar value)
- April pool leads (current month)

**Pool funnel:**
- 4-stage funnel: Total pool leads → NC leads → Quotes sent → Won deals
- Each stage shows count and conversion rate to next stage

**Full pool funnel section (channel × month detail):**

This section was added to address the gap of not being able to see by-channel and by-month data for the three funnel stages. Every cycle must update all four tables below, plus the YTD summary funnel card.

1. **YTD Pool Funnel summary card.** Three big-number cards: Pool Leads / Quotes Sent (with $) / Jobs Won (with $). Plus a context callout explaining where the funnel sits in the sales cycle.

2. **Pool Leads by Channel × Month table.** Rows are channels (Google Ads, Meta Ads, Direct, GBP, Google Organic, Referral, Other, Bing). Columns are months (last 4 to 13 months depending on cycle). Bottom row is monthly totals.

3. **Pool Quotes Sent by Channel × Month table.** Same structure. Each cell shows count / dollar value. Empty cells get an em-dash. Right-most columns show YTD count and YTD dollars.

4. **Pool Jobs Won by Channel × Month table.** Same structure. Won date used for the month bucket, not lead date.

5. **Channel Funnel Summary table (YTD rollup).** One row per channel showing: Pool Leads, Quotes #, Quote $, Wins #, Won $, Lead → Quote rate, Quote → Win rate. Channels with 0 quotes or wins display "cycle running" instead of 0% to avoid implying poor performance during natural sales cycle delays.

6. **Methodology note (gray-bordered block).** Explains the scope of "pool" used in each part of the funnel:
   - **Pool leads** use the broad WhatConverts pool detection (any pool / spa / jacuzzi / related keyword)
   - **Pool quotes and wins** use a stricter filter requiring "pool" in the project name or description, so SCU jobs and patio repairs for pool customers are excluded from funnel activity
   - Includes a note about needing 2025 historical CRM exports from Jerome to populate prior-year quote and win history

**Pool subcategories visualization** (existing chart with subcategories breakdown)

**Pool by channel table:**
- One row per channel showing: 2025 pool leads, 2026 YTD pool leads, % share of YTD, conversion to NC

**Paid pool campaigns table:**
- Named campaigns from Google Ads and Meta Ads
- Show pool leads per campaign
- Subtotal note: "Total paid pool leads YTD = X. The N named campaigns above account for Y%."

**Pool acquisition costs (cost-per-pool-lead) table:**
- 2025 spend / 2025 pool leads / 2025 CPL per channel
- 2026 YTD spend / 2026 pool leads / 2026 CPL per channel
- Combined row

**Pool acquisition KPI cards (3):**
1. Cost per pool lead, YoY: shows current $, prior year $, % change
2. Cost per pool sale (2025 baseline): $X per pool, $87K avg deal, ~35x return
3. Pool ROAS (2025 baseline): 35x

**Goal scenarios table (3 rows):**
- Conservative (20% close rate): leads needed, current count, gap, projected close timing
- Realistic (25% close rate): same
- Strong (30% close rate): same

**Goal progress bar:**
- "X of 48 builds signed" with % complete and Q1 pace target

**Monthly pool leads by channel table:**
- 13-month table (one row per month) showing leads by channel
- Add the new month as a new row
- Verify sums match canonical totals

**Same-month YoY comparison block (e.g., April 2025 vs April 2026):**
- Total qualified leads, pool leads, paid channel leads, combined ad spend, cost per paid lead, cost per pool lead
- Each with prior year, current year, % change, narrative explanation

**Numbers to refresh:**
- Pool leads YTD and by subcategory
- Full pool funnel: leads, quotes (count + $), wins (count + $) - all four tables
- Channel funnel summary with conversion rates
- Pool by channel (current and prior year columns)
- Named campaign volumes
- Spend and CPL calculations
- Goal scenario math (re-derive from new NC count)
- Monthly table (add row for new month)
- Same-month YoY block (compare new month to same month prior year)

### 3.3 Tab 3: Where Leads Come From (Channels)

**Hero:**
- Eyebrow + headline + lede
- ROI panel: Marketing investment YTD, marketing-attributable return (signed contracts + active proposals + total potential)

**Channel KPI cards (4 cards):**
- Google Ads: leads, spend, won (with deal count), ROAS
- Meta Ads: leads, spend, won, ROAS
- SEO/GBP: bundled investment ($6K share of retainer), won, ROAS
- Combined: total leads, total invested, total won + pipeline, ROAS

**Channel chart cards (4 cards), current canonical structure:**
- Header layout: 4 columns (Total Spend | Total Leads | Won | Pipeline)
- Won column in green (var(--good))
- Pipeline column in pool blue (var(--pool-deep))
- Below the chart: annotation explaining what's in Won and what's in Pipeline

**ROAS table (full-data view):**
- One row per channel + breakdown rows
- Columns: Spend, Leads, Pool leads, Won contracts, Pipeline value, Closed-basis ROAS, Potential ROAS
- Marketing-attributable totals row
- Methodology footnote (excludes existing-customer revenue)

**Numbers to refresh:**
- Each channel's lead count (YTD + prior year for YoY)
- Each channel's spend YTD
- Each channel's won and pipeline values from CRM (System 1)
- ROAS calculations (recompute, do not edit in place)
- Combined campaign totals
- Channel chart annotations (rewrite to reflect new attribution)

### 3.4 Tab 4: Website Activity

**Hero stats:**
- Sessions YTD, conversion rate, conversions count
- YoY comparisons

**Channel sessions table:**
- Sessions per channel, conversion rate per channel, conversions per channel, YoY change

**Top pages:**
- Most-visited pages with sessions and conversion contribution

**Numbers to refresh:**
- All session counts and conversion rates from GA4
- YoY comparisons against prior year same period

### 3.5 Tab 5: SEO & Local

**Keyword performance:**
- Top ranking keywords with positions
- Position changes vs prior month
- Map pack appearances
- Keyword universe size

**GBP performance:**
- Profile views, direction requests, calls
- Map pack appearance count

**Search visibility:**
- Visibility score trend
- New keywords entering top 20
- Keywords lost from top 20

**Numbers to refresh:**
- Position data from SeRanking
- GBP insights numbers
- Search Console keyword data

### 3.6 Tab 6: Active Pipeline

**Won YTD card:**
- Total won value, count of deals, average deal size

**Won by source table:**
- One row per source: deal count, total value
- Must sum to Jerome's reported won total exactly

**Active pipeline by source table:**
- One row per source: deal count, total value
- Largest single deal callout (e.g., Berzins $112K)

**Lost / Other:**
- Lost deals count and value (if material)

**Numbers to refresh:**
- All values from latest CRM export
- Source attribution from Jerome's source field (not cross-match)
- Verify rows sum to total

### 3.7 Tab 7: How We Compare (Benchmarks)

**Strategic benchmark band:**
- Marketing as % of attributed revenue (e.g., 6.4%)
- Industry typical range for landscape/outdoor living (5-10%)
- Verdict callout (lean / typical / aggressive)

**Methodology note (orange-bordered block):**
- Explanation of attributed-revenue vs total-business-revenue calculation
- Jerome's CRM data context (current YTD won + pipeline totals)
- Disclosure of data gaps (e.g., 2025 full-year total business numbers)

**Tactical benchmarks (CPL cards):**
- Google Ads CPL vs landscape industry range
- Meta Ads CPL vs landscape industry range
- Pool CPL vs pool/spa industry range (LocaliQ baseline)

**Sources block:**
- List the benchmark publishers used (Halstead Media, Leads4Build, Improve & Grow, Lawn Launch, Pool Founder, LocaliQ)

**Numbers to refresh:**
- Marketing % calculation (recompute from updated spend and revenue)
- Per-channel CPL (recompute from updated spend / leads)
- Update methodology note with latest CRM totals from Jerome

---

## Phase 4: Calculations Refresh

Every formula in the dashboard. Use this as the verification list.

### 4.1 Lead volume

| Calculation | Formula |
|---|---|
| Total UQ leads YTD | Count of WhatConverts rows where Status=Unique AND Quotable=Yes within current year date range |
| YoY total leads % | (current YTD - prior year same period) / prior year same period × 100 |
| Pace projection | YTD leads × (12 / months elapsed) |
| YoY pace vs prior full year | Pace projection / prior year full total |

### 4.2 CPL (Cost Per Lead)

| Calculation | Formula | Denominator note |
|---|---|---|
| All-services CPL (paid only) | Total ad spend / Total paid channel leads | Paid leads = Google Ads + Meta Ads only |
| Pool CPL (paid only) | Total ad spend / Total paid pool leads | Same denominator scope |
| Per-channel CPL | Channel spend / Channel leads | Both numbers from same channel only |
| Cost per qualified lead (vs all leads) | Total ad spend / Total UQ leads (all channels) | Different metric, do not mix with paid-only |

**Critical:** Never mix paid-only spend with total-leads denominator (or vice versa). YoY CPL claims must use the same denominator on both years. Mixed-denominator math produces false signals.

### 4.3 ROAS / ROI

| Calculation | Formula |
|---|---|
| Channel ROAS (closed-only) | Won contracts revenue / Channel spend |
| Channel ROAS (potential, including pipeline) | (Won + active pipeline) / Channel spend |
| Full campaign ROI | (All marketing-attributed revenue, won + pipeline, full 13 months) / (All marketing spend, full 13 months) |
| Current-year ROI | (Current year won + pipeline) / (Current year YTD spend) |

**Display rounding:** Always show ROI to 1 decimal place (e.g., 8.6x not 8.5x). Recompute from raw numbers, do not approximate. $316,611 / $36,728 = 8.62x → 8.6x.

### 4.4 Pool pipeline math

| Calculation | Formula |
|---|---|
| Leads needed for X% close to 48 builds | 48 / X |
| Leads still needed | Leads needed - Current NC leads YTD |
| Months to close gap at current pace | Leads still needed / Current monthly NC pace |
| Cost per pool sale | Total pool ad spend / Total pool deals signed |
| Pool ROAS | Total pool revenue / Total pool ad spend |

### 4.5 Marketing as % of revenue

| Calculation | Formula |
|---|---|
| Mkt % attributed revenue (YTD) | YTD total marketing spend / YTD marketing-attributed revenue |
| Mkt % attributed revenue (campaign) | Full-campaign spend / Full-campaign attributed revenue |
| Mkt % total business revenue (YTD) | YTD spend / Jerome's YTD total business activity |

**Attributed vs total:** These produce different percentages. Always label which denominator is in use. Industry benchmarks (5-10% for landscape) are calculated against total business revenue, so the "vs benchmark" callout requires the total-business denominator when available.

### 4.6 YoY for the new month

For every metric in the new month, compute:

```
YoY % change = (new month value - same month prior year) / same month prior year × 100
```

If prior year same month value is zero (e.g., paid campaigns weren't running), report as "first full month" rather than computing a percentage.

---

## Phase 5: Chart & Visual Updates

Every chart needs new data points and verified rendering.

### 5.1 Chart.js charts to update

| Chart ID | What it shows | Update needed |
|---|---|---|
| `chartMonthlyLeads` | 13-month stacked bar of UQ leads by channel | Add new month bar, update channel splits |
| `chartGoogle` | 13-month bar (leads) + line (spend) for Google Ads | Add new month, update Apr [year] label |
| `chartMeta` | Same for Meta Ads | Add new month |
| `chartSEO` | Same for SEO + GBP + Organic | Add new month |
| `chartCombined` | Same for Combined Campaign | Add new month |
| `chartPoolType` | Pool subcategory donut/bar | Update with new totals |
| `chartPoolMonthly` | Monthly pool leads | Add new month |
| `chartChannelMix` | Channel mix doughnut | Update with new YTD totals |

### 5.2 Chart data location

Chart data lives in the `<script>` block at the bottom of the merged `dashboard_final.html`. Each chart has a `const` array of monthly values (e.g., `chartGoogleData`, `chartMetaData`). Find each constant, append the new month's value, verify the labels array also extends.

### 5.3 Tables that grow each month

The 13-month rolling tables shed the oldest month and add the newest:

- Tab 2: Monthly pool leads by channel (one row per month)
- Tab 4: Monthly sessions and conversions (if present)

When the rolling window shifts, document the months covered in the section lede.

### 5.4 Visual verification with Playwright

Run a screenshot verification script for every tab:

```python
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width': 1440, 'height': 900})
    page.goto(f"file:///mnt/user-data/outputs/Blue_Tree_Dashboard_[Month]_[Year].html")
    page.wait_for_load_state('networkidle', timeout=15000)
    page.wait_for_timeout(2000)
    for tab in ['overview','pool','channels','website','seo','pipeline','benchmarks']:
        page.click(f'button[data-tab="{tab}"]')
        page.wait_for_timeout(1500)
        page.screenshot(path=f'/home/claude/qa_{tab}.png', full_page=True)
```

Review every screenshot. Look for: cropped charts, missing data points, misaligned tables, color inconsistencies.

### 5.5 Mobile responsiveness check

Repeat the screenshot run at 480px width. Verify:

- Stat rows wrap cleanly (no overflow)
- Tables either scroll horizontally or restructure
- Hero text remains readable
- Charts scale or scroll
- Tab navigation still works

---

## Phase 6: Copywriting Refresh

Numbers update from the canonical script; words do not. Every cycle, rewrite or verify the narrative blocks below.

### 6.1 Narrative blocks that need monthly attention

| Tab | Element | Approach |
|---|---|---|
| 1 | Hero subtitle | Lead with the month's most striking fact. Two short sentences. |
| 1 | Bottom-line block | 4-5 sentences synthesizing the month. Mention top deal or proposal. |
| 1 | Hero ROI panel callouts | Update industry context (4-8x typical, 10x+ top decile) and sub-card narratives |
| 2 | Pool hero subtitle | Pool demand framing tied to 48-build target. Use projected math. |
| 2 | Section ledes (each section title's intro paragraph) | Refresh to match new data trends |
| 2 | Goal scenarios narratives ("Need X more...") | Recompute timing claims from new pace |
| 2 | Same-month YoY block intro | Frame the comparison clearly |
| 3 | Channel hero copy | Reflect any narrative shifts (channel pulled ahead, channel paused, etc.) |
| 3 | Channel KPI card "What's notable" lines | Pull the most interesting fact from each channel's data |
| 3 | Channel chart annotations | Explain the won + pipeline split in plain language |
| 6 | Methodology note (orange block) | Update Jerome's CRM totals when received |
| 6 | Strategic benchmark verdict | Rewrite the green callout to match the new % |

### 6.2 Stop Slop writing rules

Every line of client-facing copy follows the rules in **Appendix B**. Run the Stop Slop scan as part of QA.

### 6.3 Tone and framing

This is a marketing agency performance report, not a sales team update. Lead with: **lead volume, CPL, ROAS, pipeline value**. Avoid:

- Operational language (campaigns paused, ad errors, budget limitations)
- Sales-team metrics (close rates, sales calls, follow-up cadence)
- Internal-team language (we built, our team, our process)

The client cares about: was the marketing investment worth it, what came in, what's coming next.

### 6.4 What never changes month-to-month

These elements stay stable across cycles unless data forces a change:

- Industry benchmark sources (Halstead Media, Leads4Build, etc.)
- Pool sales cycle reference (3-6 months)
- 48-build goal number for 2026
- $87K average pool deal size (until Jerome reports a different figure)

---

## Phase 7: Full QA Process

Every cycle ends with this six-step QA. No exceptions, no shortcuts. Skipping QA is how stale numbers reach the client.

### Step 1: Recompute from raw

Run the canonical numbers script fresh. Compare its output to last cycle's numbers and to the dashboard's current numbers. Any unexplained variance is a flag.

```python
# Pseudocode
canonical = compute_canonical_numbers(raw_csvs)
last_cycle = load_json('canonical_numbers_prior.json')
print(diff(canonical, last_cycle))
```

If pool subcategory counts differ from last cycle by more than 10%, verify the methodology hasn't drifted. Document in cycle notes.

**Filter diagnostics check (mandatory):**

Run the verification layers from Phase 2.2 and check each diagnostic against its threshold:

- [ ] Quotable=Yes pass rate within 60-85% range
- [ ] Verification layer exclusion rate within 0-3% range
- [ ] Cross-channel dupes consolidated within 0-2% range
- [ ] Long-window re-engagements within 0-5% range
- [ ] Spam pattern scan returns no high-confidence false positives in qualified bucket
- [ ] Job seeker scan returns no entries with project signals
- [ ] Wrong-number scan returns clean (zero in final count)

If any diagnostic falls outside its healthy range, hold the dashboard send and reconcile before proceeding. The cycle notes file should record any threshold breach and the resolution.

### Step 2: Tab-by-tab verification

For each of 7 tabs, check every visible number against the canonical JSON:

- [ ] Tab 1 Performance: hero stats, ROI panel, big picture cards, channel snapshot, bottom line
- [ ] Tab 2 Pool Pipeline: hero, funnel, all tables, KPI cards, goal scenarios, monthly table, YoY block
- [ ] Tab 3 Channels: hero ROI panel, 4 KPI cards, 4 chart cards (won + pipeline split), ROAS table, methodology footnote
- [ ] Tab 4 Website: hero, channel sessions, top pages
- [ ] Tab 5 SEO & Local: keywords, GBP, visibility
- [ ] Tab 6 Active Pipeline: won YTD, won-by-source, pipeline-by-source, lost
- [ ] Tab 7 Benchmarks: strategic benchmark, methodology note, tactical CPL cards, sources

### Step 3: Math check

Verify these calculations by hand. Run them on a calculator or in a Python REPL, not from memory:

- [ ] Each per-channel CPL: spend / leads
- [ ] All-services CPL: total paid spend / total paid leads
- [ ] Pool CPL: pool ad spend / paid pool leads
- [ ] Each ROAS: revenue / spend
- [ ] Full-campaign ROI multiple
- [ ] Current-year ROI multiple
- [ ] YoY % change for each compared metric (verify denominator is same period)
- [ ] Goal scenario "need X more" math: target - current
- [ ] Goal timing math: leads needed / monthly pace
- [ ] Funnel conversion rates: each stage / prior stage
- [ ] Marketing % of revenue: spend / revenue (specify which revenue denominator)

### Step 4: Cross-tab consistency

Pick 5-7 numbers that appear in multiple tabs. Verify each appears with the same value everywhere:

- [ ] Total UQ leads YTD (should match in Tab 1 hero, Tab 4 if shown, internal calculations)
- [ ] Pool leads YTD (Tab 1 big picture, Tab 2 hero, Tab 6 if referenced)
- [ ] NC pool leads YTD (Tab 1, Tab 2 hero, goal scenarios)
- [ ] Marketing investment YTD (Tab 1, Tab 3, Tab 6 methodology)
- [ ] Won + pipeline marketing-attributable (Tab 1, Tab 3, Tab 6)
- [ ] Full-campaign ROI multiple (Tab 1 hero, Tab 6 verdict)
- [ ] Average deal size if mentioned ($87K)

### Step 5: Visual rendering check

Run the Playwright screenshot script. Review every screenshot:

- [ ] No truncated text in any tab
- [ ] All charts render with full data
- [ ] No overlapping elements
- [ ] Color coding consistent (won = green, pipeline = blue, paid = orange line)
- [ ] Mobile (480px) renders cleanly across all tabs
- [ ] Tab navigation works (every tab clickable)
- [ ] No console errors in browser dev tools

### Step 6: Stop Slop copywriting scan

Run a scripted scan against the Stop Slop banned-phrase list:

```python
banned_phrases = [
    "Here's the thing", "Let that sink in", "It's worth noting",
    "Let me be clear", "At the end of the day", "Navigate the complex landscape",
    "Lean into", "Unpack", "Double down", "Deep dive", "Game-changer",
    "Move the needle", "At its core", "In today's world", "When it comes to",
    "It turns out that", "The reality is", "What makes X unique",
    "This is where it gets interesting", "And that's okay"
]
banned_structures = ["—", "It's not X. It's Y", "Not because X. Because Y."]

for phrase in banned_phrases:
    if phrase.lower() in dashboard_html.lower():
        print(f"FLAG: '{phrase}' found")
```

Manual scan for: -ly adverbs, three-item lists (use two), softeners (just, simply, actually, really, very, quite, perhaps, certainly), passive voice, throat-clearing openers, em-dash reveals.

### Step 7: Final pre-send check

- [ ] Dashboard file copied to `/mnt/user-data/outputs/Blue_Tree_Dashboard_[Month]_[Year].html`
- [ ] File size sanity check (typical 480-510KB)
- [ ] File opens cleanly in browser
- [ ] Email composed in two variants (full + concise)
- [ ] Email numbers match dashboard numbers exactly
- [ ] Subject line uses correct month and date
- [ ] Maureen and Jeff are addressed by name

---

## Phase 8: Email Composition & Delivery

### 8.1 Email structure (always two variants)

**Full version (~5 paragraphs):**

1. Open: link to dashboard, one-line context
2. Headline number for the cycle (campaign-defining metric, hero stat, or major milestone)
3. Recent month recap (volume, CPL, ROAS, pipeline)
4. Pool pipeline status (NC count, projection vs goal, deal flow)
5. What's new in this cycle (changes from prior dashboard, methodology updates, key context shifts)
6. Sign-off

**Concise version (~3 paragraphs):**

1. Headline number + open
2. Recent month + pool pipeline (combined)
3. What's new + sign-off

### 8.2 Subject line format

```
[Month] recap and the [Date] dashboard
```

Example: "April recap and the May 1 dashboard"

### 8.3 Email writing rules

- Apply Stop Slop rules (Appendix B)
- Lead each section with a number, not a transition
- Specific over generic ("the Berzins $112K proposal" not "a large pool deal")
- No CTAs that demand reply ("happy to walk through" is fine, "please let me know" is throat-clearing)
- Sign Jason

### 8.4 What goes in the email vs the dashboard

| Goes in email | Stays in dashboard |
|---|---|
| Top 3-5 numbers | All numbers |
| Active deals to flag | Methodology details |
| What changed this cycle | Historical context |
| Brief narrative | Charts and tables |
| Direct call-out for any required client action | Channel attribution detail |

### 8.5 Delivery

Use the message_compose_v1 tool to draft both variants. Provide the `summary_title`, both labeled variants, and the subject line. Jason reviews both and picks one for that month's send (alternate between them or choose based on who is reading).

---

## Phase 9: Cycle Closeout

### 9.1 Cycle notes file

After delivery, write a brief cycle notes file documenting:

- Date sent
- Variant chosen (full or concise)
- Any methodology changes vs prior cycle
- Any data anomalies flagged
- Open items for next cycle (e.g., 2025 total business numbers still pending from Jerome)

Save as `cycle_notes_[YYYY-MM].md` alongside the dashboard files.

### 9.2 Hand-off log

If the cycle was run by someone other than Jason, log:

- Who ran it
- Time spent (target: 4-6 hours total)
- Any decisions made that need Jason review

### 9.3 Source data archive

Archive the raw input files for the cycle:

```
/archive/[YYYY-MM]/
├── lead_export_[date].csv
├── opportunities_[date].csv
├── google_ads_spend_[date].png
├── meta_ads_spend_[date].png
├── ga4_export_[date].csv
├── search_console_[date].zip
└── cycle_notes_[YYYY-MM].md
```

Keeping archived inputs lets a future cycle reproduce any prior month's numbers if questions arise.

### 9.4 Pending items rolled forward

Any item flagged as pending in this cycle's notes carries to next cycle's pre-flight check:

- Outstanding data from Jerome (2025 total business revenue, etc.)
- Methodology decisions needing client review
- Dashboard structural changes deferred

---

## Appendix A: Methodology Reference

### A.1 WhatConverts text columns scanned for keyword detection

```python
text_cols = [
    'Spotted Keywords', 'Notes', 'Message',
    'Describe your project', 'Describe your project*',
    'How can we help you?*', 'Lead Summary',
    'Keyword Detection', 'Intent Detection', 'Topic Detection',
    'Call Transcription', 'Voicemail Transcription',
    'Lead Page', 'Landing Page',
    'Keyword', 'Campaign', 'Source', 'Subject'
]
```

### A.2 Pool form field columns

```python
form_field_cols_pool = ['Custom Pools', 'Pool Services', 'Pool Renovation']
```

### A.3 Greeting strip regex

```python
greeting_re = re.compile(
    r'thank you for calling blue tree.*?'
    r'(?:\?|how can|how may|landscape|month|today|name|help|leave a message)',
    re.IGNORECASE | re.DOTALL
)
```

### A.4 Pool detection keywords

```python
pool_kws = [
    'pool', 'spa', 'jacuzzi', 'swim', 'plunge', 'dunk',
    'pmax', 'infinity edge', 'fiberglass', 'gunite', 'vinyl liner'
]
```

### A.5 Pool subcategorization keywords

```python
nc_kws = [
    'build', 'install', 'new pool', 'design', 'custom pool',
    'gunite', 'fiberglass', 'vinyl liner', 'inground',
    'in-ground', 'in ground', 'estimate for a pool',
    'quote for a pool', 'put in a pool', 'put a pool',
    'add a pool', 'pmax', 'plunge', 'dunk pool', 'infinity edge'
]
reno_kws = ['renov', 'remodel', 'resurface', 'replaster', 'rebuild', 'redo']
repair_kws = ['repair', 'leak', 'broken', 'fix', 'pump', 'filter', 'heater', 'crack']
maint_kws = ['opening', 'closing', 'service', 'clean', 'chemical', 'algae']
```

### A.6 Channel attribution rules

| Source field | Medium field | Channel |
|---|---|---|
| google | cpc | Google Ads |
| facebook, meta, instagram | (any) | Meta Ads |
| gmb, google business | (any) | GBP |
| google | organic | Google Organic |
| bing | (any) | Bing Organic |
| (direct), empty | (direct), empty | Direct |
| (any) | referral | Referral |
| klaviyo | (any) | Email |
| (any) | email | Email |
| Any other combination | | Other |

### A.7 CRM dedup logic

Key: lowercased opportunity name
Stage priority for keeping: Won > Lost > Proposed > Active

### A.8 Standard spend split

Total marketing investment = Google Ads spend + Meta Ads spend + SEO retainer + Marketing retainer.
Confirm SEO retainer amount each cycle (as of May 2026: $1,500/month).
Confirm marketing retainer amount each cycle (as of May 2026: $4,197/month).
Marketing investment monthly = ad spend + $1,500 + $4,197.

### A.9 Display formatting rules

- Dollar amounts ≥$1,000,000: display as $1.07M, not $1,070K
- Dollar amounts $1,000 to $999,999: display as $477K, not $477,234 (use approximate)
- Dollar amounts < $1,000: display as $937, not $0.9K
- Percentages: 1 decimal place, max (e.g., 6.4%, not 6.42%)
- ROI multiples: 1 decimal place (8.6x, not 8.62x)
- Approximate values: prefix with `~` (e.g., ~$934K)
- Use plain language labels: "all-services CPL" not "blended CPL"

---

## Appendix B: Stop Slop Writing Rules

These rules apply to every word of client-facing copy in the dashboard and email.

### B.1 Banned phrases (never use)

- Here's the thing
- Let that sink in
- The uncomfortable truth is
- It's worth noting
- Let me be clear
- At the end of the day
- And that's okay
- It's not this, but that
- Navigate the complex landscape
- Lean into
- Unpack
- Double down
- Deep dive
- Game-changer
- Move the needle
- At its core
- In today's world
- When it comes to
- It turns out that
- The reality is
- What makes X unique
- This is where it gets interesting

### B.2 Banned structures

- Binary contrasts ("It's not X. It's Y.")
- Dramatic one-word fragments ("Purpose. Clarity. Impact.")
- Negative listings ("Not because X. Because Y.")
- Rhetorical questions answered immediately
- Three-item lists (use two)
- Em-dash reveals
- Pull-quote-ready sentences

### B.3 Banned word categories

- All adverbs (-ly words)
- Softeners: just, simply, actually, really, very, quite, perhaps, certainly
- Throat-clearing openers
- Meta-commentary: "Let me explain", "Here's why that matters"
- Passive voice
- Narrator-from-a-distance voice ("One might argue")

### B.4 Always do

- Vary sentence length
- State facts directly
- Trust the reader
- End paragraphs differently each time
- If it sounds like a pull-quote, rewrite it

### B.5 Self-check before delivering

- [ ] Three consecutive sentences same length → break one
- [ ] Paragraph ends with punchy one-liner → vary it
- [ ] Em-dash before a reveal → remove it
- [ ] Explaining a metaphor → trust it to land
- [ ] Banned phrase scan returns clean
- [ ] -ly adverb scan returns clean

---

## Appendix C: QA Checklist (Print Version)

Print this page. Walk through it on the final dashboard before delivery. Check each box only after manual verification, not from memory.

### Phase 1: Inputs

- [ ] WhatConverts CSV (current year) loaded
- [ ] WhatConverts CSV (prior year) loaded
- [ ] Opportunities CSV from Jerome loaded
- [ ] Won-jobs export from Jerome (if available)
- [ ] Google Ads spend confirmed (screenshot saved)
- [ ] Meta Ads spend confirmed (screenshot saved)
- [ ] GA4 export downloaded
- [ ] Search Console export downloaded
- [ ] SeRanking export downloaded
- [ ] GBP insights captured

### Phase 2: Canonical Computation

- [ ] canonical_numbers.json regenerated from raw
- [ ] Diff vs prior cycle reviewed (no unexplained variance)
- [ ] Pool subcategorization methodology verified (no drift)
- [ ] Filter diagnostics within healthy thresholds (Quotable pass rate, verification exclusion rate, cross-channel dupes, long-window dupes)
- [ ] Spam pattern scan: no high-confidence false positives
- [ ] Job seeker scan: clean
- [ ] Wrong number scan: clean
- [ ] Cross-channel dupes consolidated to first-touch
- [ ] Long-window dupes resolved per gap rules
- [ ] Existing-customer service calls excluded

### Phase 3: Tab Updates

- [ ] Tab 1 Performance: all elements updated
- [ ] Tab 2 Pool Pipeline: all elements updated, monthly table extended
- [ ] Tab 2 Pool Funnel section: YTD summary card updated (leads / quotes # & $ / wins # & $)
- [ ] Tab 2 Pool Leads by Channel × Month table: extended with new month
- [ ] Tab 2 Pool Quotes by Channel × Month table: extended with new month, dollar amounts verified
- [ ] Tab 2 Pool Wins by Channel × Month table: extended with new month, dollar amounts verified
- [ ] Tab 2 Channel Funnel Summary table: conversion rates recomputed
- [ ] Tab 3 Channels: all 4 chart cards updated, won/pipeline split correct
- [ ] Tab 4 Website: GA4 numbers refreshed
- [ ] Tab 5 SEO & Local: keyword and GBP data refreshed
- [ ] Tab 6 Active Pipeline: CRM numbers refreshed
- [ ] Tab 7 Benchmarks: methodology note updated with current Jerome totals

### Phase 4: Calculations

- [ ] Lead volume YoY calculated
- [ ] All CPL calculations verified (same denominator on both years)
- [ ] All ROAS calculations verified
- [ ] Marketing % of revenue calculated (label which denominator)
- [ ] Pool pipeline math verified (need-X-more, timing claims)
- [ ] All YoY % changes verified

### Phase 5: Visuals

- [ ] All Chart.js charts updated with new month
- [ ] Monthly tables extended with new row
- [ ] Playwright screenshot run completed
- [ ] Mobile (480px) screenshot run completed
- [ ] All screenshots reviewed (no truncation, no overlap, no missing data)

### Phase 6: Copy

- [ ] Tab 1 hero subtitle rewritten
- [ ] Tab 1 bottom-line block rewritten
- [ ] Tab 2 pool hero rewritten
- [ ] All section ledes verified or refreshed
- [ ] Channel chart annotations verified
- [ ] Methodology note (Tab 7) updated

### Phase 7: QA

- [ ] Recompute from raw: pass
- [ ] Tab-by-tab verification: pass
- [ ] Math check: pass
- [ ] Cross-tab consistency: pass
- [ ] Visual rendering: pass
- [ ] Stop Slop scan: pass
- [ ] Final pre-send check: pass

### Phase 8: Email

- [ ] Full version drafted
- [ ] Concise version drafted
- [ ] Subject line set
- [ ] Numbers in email match dashboard
- [ ] Maureen and Jeff addressed by name
- [ ] Stop Slop scan on email: pass

### Phase 9: Closeout

- [ ] Final HTML in /mnt/user-data/outputs/
- [ ] Cycle notes file written
- [ ] Source data archived
- [ ] Pending items logged for next cycle

---

**Total cycle time target: 4 to 6 hours.**

If a cycle exceeds 8 hours, document the cause in cycle notes and identify which phase ran long. Most overruns come from missing source data (Phase 1) or methodology debate (Phase 2). Investing time in clean inputs at the front saves time at every later phase.

---

## Appendix D: Lead Matching Cascade

This appendix specifies the matching rules used in Phase 2.7 to cross-reference CRM opportunities with WhatConverts leads. The goal is the highest possible match rate without false positives. Every match returns a tier label and a confidence score so the attribution decision is auditable.

### D.1 Why this needs more than name + phone + email

Real-world attribution data has eight common failure patterns that simple matching misses:

1. **Husband-wife household.** Mike Berzins fills out the Google Ads form. Sarah Berzins signs the contract. CRM has "Sarah Berzins" with no phone match to the WhatConverts record under "Mike Berzins."
2. **Phone format inconsistency.** WhatConverts captures `(610) 555-1234`. Jerome's CRM stores `610.555.1234` or `+16105551234`. Exact-string match fails.
3. **Email aliasing.** Lead used `mike.berzins@gmail.com`. CRM has `mberzins@gmail.com`. Both belong to the same person.
4. **Nickname variation.** Lead is "Bob Smith." CRM contact is "Robert Smith." Or "Mike" / "Michael," "Jen" / "Jennifer," "Liz" / "Elizabeth."
5. **Title prefixes.** Lead is "Mr. John Doe." CRM is "John Doe."
6. **Maiden name change.** Lead came in 8 months ago as "Jane Williams." CRM contact is now "Jane Williams-Smith" or "Jane Smith."
7. **Multi-touch contacts.** Lead has 5 WhatConverts records across 3 channels (Google Ads form, GBP call, Meta lead form). CRM has one opportunity.
8. **B2B with personal name on opportunity.** WhatConverts captures the company "Smith Landscaping LLC." CRM opportunity is in the personal name "Bob Smith."

The cascade below catches all eight patterns.

### D.2 Field normalization (run before any matching)

**Phone normalization:**

```python
def normalize_phone(p):
    """Strip all non-digit characters, take last 10 digits."""
    if not p:
        return None
    digits = re.sub(r'\D', '', str(p))
    if len(digits) >= 10:
        return digits[-10:]  # Handles +1 country code
    return None  # Invalid phone, do not match on this field
```

**Email normalization:**

```python
def normalize_email(e):
    """Lowercase, strip whitespace, strip dot-aliasing for gmail."""
    if not e or '@' not in e:
        return None
    e = e.strip().lower()
    local, domain = e.split('@', 1)
    if domain == 'gmail.com':
        local = local.replace('.', '')  # Gmail ignores dots
        local = local.split('+')[0]      # Strip +alias
    return f"{local}@{domain}"

GENERIC_EMAILS = {'info@', 'contact@', 'admin@', 'office@', 'sales@', 'no-reply@', 'noreply@'}

def is_generic_email(e):
    """Generic mailbox emails are too noisy to match on."""
    if not e:
        return True
    return any(e.startswith(g) for g in GENERIC_EMAILS)
```

**Name normalization:**

```python
TITLES = {'mr', 'mrs', 'ms', 'miss', 'dr', 'sir', 'madam', 'rev', 'prof'}
NICKNAMES = {
    'mike': 'michael', 'bob': 'robert', 'rob': 'robert', 'bobby': 'robert',
    'liz': 'elizabeth', 'beth': 'elizabeth', 'lizzie': 'elizabeth',
    'jen': 'jennifer', 'jenny': 'jennifer',
    'bill': 'william', 'will': 'william', 'billy': 'william',
    'jim': 'james', 'jimmy': 'james',
    'tom': 'thomas', 'tommy': 'thomas',
    'dave': 'david', 'davey': 'david',
    'rick': 'richard', 'dick': 'richard', 'rich': 'richard', 'richie': 'richard',
    'kate': 'katherine', 'katie': 'katherine', 'kathy': 'katherine',
    'sue': 'susan', 'suzie': 'susan',
    'pat': 'patrick', 'patty': 'patricia',
    'tony': 'anthony', 'nick': 'nicholas', 'chris': 'christopher',
    'matt': 'matthew', 'sam': 'samuel', 'ben': 'benjamin',
    'dan': 'daniel', 'danny': 'daniel',
    'steve': 'steven', 'pete': 'peter', 'andy': 'andrew',
    'joe': 'joseph', 'tony': 'anthony'
}

def normalize_name(n):
    """Lower, strip titles and punctuation, expand nicknames."""
    if not n:
        return ''
    n = n.lower().strip()
    # Strip business suffixes
    n = re.sub(r'\b(llc|inc|llp|corp|co|ltd|company|landscaping|enterprises)\b\.?', '', n)
    # Strip titles
    parts = n.split()
    parts = [p for p in parts if p.rstrip('.') not in TITLES]
    # Strip punctuation per token
    parts = [re.sub(r'[^\w\-]', '', p) for p in parts]
    parts = [p for p in parts if p]
    # Expand nicknames on first name only
    if parts and parts[0] in NICKNAMES:
        parts[0] = NICKNAMES[parts[0]]
    return ' '.join(parts)

def get_first_name(n):
    parts = normalize_name(n).split()
    return parts[0] if parts else ''

def get_surname(n):
    """Return the LAST token. For hyphenated surnames, return the full hyphenated form."""
    parts = normalize_name(n).split()
    if not parts:
        return ''
    last = parts[-1]
    return last  # 'williams-smith' stays intact for partial-match logic
```

**Address normalization (when available):**

```python
def normalize_address(addr):
    """Lower, strip apt/unit, normalize street suffixes."""
    if not addr:
        return None
    addr = addr.lower().strip()
    addr = re.sub(r'\b(apt|unit|suite|ste|#)\s*[\w\d]+', '', addr)
    addr = re.sub(r'\bst\b', 'street', addr)
    addr = re.sub(r'\brd\b', 'road', addr)
    addr = re.sub(r'\bave\b', 'avenue', addr)
    addr = re.sub(r'\bln\b', 'lane', addr)
    addr = re.sub(r'\bdr\b', 'drive', addr)
    return re.sub(r'\s+', ' ', addr).strip()
```

### D.3 The seven-tier matching cascade

For each CRM opportunity, run through tiers in order. Stop at the first tier that returns a match. Higher tiers have higher confidence.

**Tier 1: Phone exact match (confidence 1.0)**

```
opp.phone_norm == lead.phone_norm
AND both are 10 digits
```

Highest confidence. Phone numbers are the most reliable identifier. Skip if either side is missing or invalid.

**Tier 2: Email exact match (confidence 0.95)**

```
opp.email_norm == lead.email_norm
AND neither is a generic mailbox (info@, contact@, etc.)
```

Skip generic emails. Personal addresses are reliable. Family-shared emails (one address for husband and wife) get correctly attributed at this tier.

**Tier 3: Full name exact match within 180 days (confidence 0.85)**

```
opp.name_norm == lead.name_norm
AND |opp.created_date - lead.date| <= 180 days
AND name is not in COMMON_NAMES_BLOCKLIST
```

Common-name blocklist prevents false positives like "John Smith" matching the wrong person. The blocklist contains the 50 most common first+last name combinations in the service area. When a name is on the list, require Tier 4 or higher matching to be safe.

**Tier 4: Surname + household proxy (confidence 0.80)**

This is the household-member tier. Catches husband-wife and parent-adult-child scenarios.

```
opp.surname == lead.surname (after normalization, including hyphenated)
AND at least one of:
  (a) Same email domain (excluding gmail/yahoo/hotmail/outlook/aol/icloud)
  (b) Same normalized address (street + city)
  (c) Phone numbers share first 7 digits (area code + exchange)
  (d) Both have phone numbers in the same town/zip
AND |opp.created_date - lead.date| <= 365 days
```

The household-proxy signals filter out unrelated people who happen to share a surname. Mr. and Mrs. Berzins at the same address with phones starting `610-555-x` get matched. Two unrelated Berzins families in different towns do not.

**Tier 5: Phone first-7 + first name match (confidence 0.75)**

Catches phone format variations and partial captures.

```
opp.phone_norm[:7] == lead.phone_norm[:7]
AND opp.first_name == lead.first_name (normalized, with nicknames expanded)
AND |opp.created_date - lead.date| <= 180 days
```

This catches the case where a phone number was entered slightly differently or only partially captured.

**Tier 6: Fuzzy name + same town + close dates (confidence 0.65)**

```
name_similarity(opp.name_norm, lead.name_norm) >= 0.85
AND opp.town == lead.town
AND |opp.created_date - lead.date| <= 90 days
```

Use Levenshtein ratio or RapidFuzz for `name_similarity`. Catches typos (Berzins / Berzens), missing characters, and middle-name variations.

**Tier 7: Maiden / married name shift (confidence 0.60)**

```
opp.first_name == lead.first_name
AND opp.surname overlaps with lead.surname (one contains the other, or hyphenated form contains both)
AND opp.phone_norm == lead.phone_norm OR same address
AND |opp.created_date - lead.date| <= 730 days
```

Catches "Jane Williams" → "Jane Williams-Smith" or "Jane Smith" when the same phone or address connects them.

**No match (confidence 0.0)**

If none of the seven tiers fire, the opportunity has no marketing-touchpoint match. Fall back to Jerome's source field tagging.

### D.4 Disambiguation rules

When one opportunity matches multiple WhatConverts leads (or vice versa):

**Rule 1: Highest tier wins.** A Tier 1 match beats a Tier 4 match every time, regardless of date.

**Rule 2: Within the same tier, closest date wins.** Among Tier 4 matches, pick the lead with the smallest `|opp.created_date - lead.date|`.

**Rule 3: Multi-touch capture.** When an opportunity has 3+ matching leads across multiple channels, record the FIRST-TOUCH lead (earliest date) as the primary attribution. Record the others as supporting touches in a `multi_touch_channels` array. This lets the dashboard show first-touch attribution by default but enables a multi-touch view when needed.

**Rule 4: Manual review threshold.** If two matches at the same tier have dates within 7 days of each other, flag the opportunity for human review. Output the candidates and let Jason resolve.

### D.5 Confidence threshold rules

Each tier's confidence score determines how the attribution is used:

| Confidence | Use the cross-match? | Override Jerome's source? |
|---|---|---|
| 1.0 (Tier 1) | Yes | Yes if Jerome's source is blank or "Other" |
| 0.95 (Tier 2) | Yes | Yes if Jerome's source is blank or "Other" |
| 0.85 (Tier 3) | Yes | Yes if Jerome's source is blank, otherwise no |
| 0.80 (Tier 4) | Yes | Only if Jerome's source is blank or "Existing Customer" with a household-member match (this catches husband-wife flips) |
| 0.75 (Tier 5) | Yes if Jerome's source is blank | No |
| 0.65 (Tier 6) | Flag for review | No |
| 0.60 (Tier 7) | Flag for review | No |
| < 0.60 | No | Use Jerome's source as-is |

The override rule for Tier 4 + "Existing Customer" is the key fix for the household-member problem. When Jerome's intake person sees "Sarah Berzins" and tags her as Existing Customer (because she's already in the system), but Mr. Berzins came in fresh from Google Ads three months ago, the cross-match catches the household connection and re-tags the deal to Google Ads.

### D.6 Output format

For each opportunity, produce a record:

```json
{
  "opportunity_id": "OPP-2026-1234",
  "opportunity_name": "Sarah Berzins",
  "opportunity_value": 112000,
  "opportunity_stage": "Proposed",
  "opportunity_created": "2026-04-12",
  "jerome_source": "Existing Customer",

  "matched_lead_id": "WC-2026-04-08-001",
  "matched_lead_name": "Mike Berzins",
  "matched_lead_date": "2026-04-08",
  "match_tier": "tier_4_surname_household",
  "match_confidence": 0.80,
  "match_signals": ["surname_match", "phone_first_7_match", "address_match"],

  "attributed_channel": "Google Ads",
  "attributed_campaign": "Pool PMax",
  "attribution_method": "cross_match_tier_4_overrides_existing_customer",

  "multi_touch_channels": ["Google Ads", "Meta Ads"],

  "review_flag": false,
  "review_notes": null
}
```

This output format makes every attribution decision auditable. Six months from now, when someone asks "why did the Berzins deal get attributed to Google Ads when the CRM had it as Existing Customer," the answer is in the record.

### D.7 Match rate targets

A healthy attribution run should produce these match rates against the latest opportunities export:

| Bucket | Target match rate |
|---|---|
| Won deals with Jerome source = paid channel | 95%+ Tier 1-3 match (verifies Jerome's tagging) |
| Won deals with Jerome source = Direct or Existing | 40-60% match at Tier 4 or higher (reveals hidden marketing influence) |
| Active pipeline | 80%+ at Tier 1-3 (recent leads, easier to match) |
| Lost deals | Same as won deals |

**Match rate diagnostics:**

If overall match rate is below 60% for won deals, something is wrong:
- WhatConverts data may not cover the full year of activity
- Phone or email fields may be missing from CRM
- Lead intake may be capturing different fields than the matching cascade expects

Log these diagnostics every cycle. A drop in match rate from 75% to 50% between cycles signals a data quality issue worth investigating before publishing the dashboard.

### D.8 What does NOT get matched

Some opportunities legitimately have no WhatConverts touchpoint:

- True existing customers (10+ year relationships, never went through any tracked marketing channel)
- Word-of-mouth referrals where the referrer called instead of the new customer
- Walk-in business at events
- B2B partnerships negotiated directly

For these, Jerome's source field is the only signal available. The dashboard should label these as "Direct / Referral / Existing" rather than counting them in marketing-attributed revenue.

### D.9 Implementation pattern

The matching script is a separate Python module (recommend `lead_matcher.py`) that takes:
- WhatConverts CSV path (or pre-loaded canonical leads)
- CRM opportunities CSV path
- Optional: prior cycle's match results (for stability checking)

And outputs:
- `matches.json` with one record per opportunity
- `match_diagnostics.txt` with match rate by tier and review flags
- `attribution_summary.json` with channel-level revenue rollups

Run the matcher as the first step of Phase 2 after canonical numbers are computed. The match results feed every revenue attribution number on Tab 3 and Tab 6.

---

*Last updated: May 2026 cycle. Next review: November 2026 (six-month review).*
