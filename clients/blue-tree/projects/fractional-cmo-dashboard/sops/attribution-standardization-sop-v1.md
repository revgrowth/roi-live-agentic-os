# SOP Update — Channel Attribution Standardization

Append to existing SOP at Phase 2.7 (or create new Phase 2.7a).

Reason for update: source field values vary widely between WhatConverts and Jerome's CRM, and within each system. Multiple Facebook variants caused the May 2026 cycle to silently miscategorize 3 of 4 Meta Ads pool wins as "Other" before correction. Locking attribution rules prevents this from recurring.

## Rule 1 — WhatConverts attribution (canonical)

After loading WhatConverts CSV (skip first row, use second row as header, dedupe duplicate Date column), normalize source and medium to lowercase and strip whitespace before applying these rules in order:

```
1. Meta Ads (paid)
   IF source IN ('facebook', 'fb', 'instagram', 'ig')
      AND medium NOT IN ('organic', 'referral', '(none)', 'email')
   THEN channel = Meta Ads

   Note: Meta uses ad-set names as medium values. Known seen values:
   'cpc', 'pool services', 'landscaping services', 'landscaping/hardscaping services',
   'new leads ad set', 'landscaping', 'pool', 'paid'.
   The "not in" list catches the organic/referral/email cases. All paid variants pass.

2. Google Ads (paid)
   IF source = 'google' AND medium = 'cpc'
   THEN channel = Google Ads

3. Google Organic
   IF source = 'google' AND medium = 'organic'
   THEN channel = Google Organic

4. GBP (Google Business Profile)
   IF source = 'gmb'
   THEN channel = GBP

5. Bing Organic
   IF source = 'bing' AND medium = 'organic'
   THEN channel = Bing Organic

6. Direct
   IF source = '(direct)' OR medium = '(none)'
   THEN channel = Direct

7. Referral (organic)
   IF medium = 'referral'
   THEN channel = Referral

8. Email
   IF medium = 'email' OR source = 'klaviyo' OR source = 'email marketing'
   THEN channel = Email

9. Other
   Anything else. Log the source/medium combo for review; new variants get added here.
```

## Rule 2 — Jerome's CRM attribution (canonical)

Jerome's source field is freeform-tagged by the sales team. Variants seen as of May 2026:

```
Meta Ads:    'Facebook ads', 'Facebook Ad', 'Facebook', 'Facebook Instant Form', 'm.facebook.com'
Google Ads:  'Google Ads'
Google Org:  'Google organic', 'Google Organic'
GBP:         'Google Business Profile organic', 'Google Business Profile', 'Google Business Profile Organic'
Bing Org:    'Bing organic'
Direct:      '(direct)', 'Direct', 'direct'
Referral:    'Referral', 'Referred', 'Referred by HOA', 'Referred by the HOA'
Existing:    'Existing customer', 'Existing Customer', 'Existing', 'Past customer'
Email:       'Email campaign', 'Klaviyo'
Seen Trucks: 'Seen trucks', 'Seen Trucks'
Other:       'Website', 'Other'
```

Apply with case-insensitive contains-match in this order:

```
1. Meta Ads:        source contains 'facebook' OR 'meta' OR 'instagram' OR 'm.facebook.com'
2. Google Ads:      source contains 'google ads' (lowercase)
3. GBP:             source contains 'google business' OR equals 'gmb'
4. Google Organic:  source contains 'google organic' (after step 1-3 fall-through)
5. Bing Organic:    source contains 'bing' AND 'organic'
6. Direct:          source IN ('(direct)', 'direct') (case-insensitive)
7. Referral:        source contains 'referral' OR 'referred'
8. Email:           source contains 'klaviyo' OR 'email'
9. Existing:        source contains 'existing' OR 'past customer'
10. Seen Trucks:    source contains 'seen trucks'
11. Website:        source contains 'website'
12. Unknown:        empty source field
13. Other:          anything else
```

## Rule 3 — Google Ads campaign ID resolution

WhatConverts stores Google Ads campaign references as numeric IDs. Without a map, text-only pool detection misses leads from pool-dedicated campaigns whose form-fill data is empty.

Maintain `Blue_Tree_Campaign_ID_Map.md` in the project. Each cycle:

1. List all distinct Google Ads campaign IDs in the WhatConverts data.
2. Cross-check against the map.
3. If any ID is missing from the map, request a Google Ads platform screenshot and add the ID with name + pool classification before continuing.
4. Apply campaign-ID auto-classification before text-detection fallback (per the map's "How to apply" section).

## Rule 4 — Pool detection (final)

After channel attribution and campaign-ID resolution:

**WhatConverts side:**
1. If Google Ads campaign ID auto-classifies the lead → use that classification.
2. Else, build a text blob from: Notes, Spotted Keywords, Call Transcription, Message, Keyword. Add Campaign field for Meta Ads (Meta encodes pool intent in the campaign name).
3. Strip the WhatConverts greeting `maintaining beautiful landscapes, custom pools and patios` (case-insensitive, flexible whitespace).
4. Pool keyword set: `pool`, `spa`, `jacuzzi`, `hot tub`, `plunge`, `swim`. Match anywhere in the blob.

**Jerome's CRM side (strict):**
1. If `Operation(s)` contains `pool installation` OR `pool renovation` → POOL.
2. If `Operation(s)` is blank, fall back to: Opportunity Name, Project name, or Project Description contains any of: `new pool`, `pool install`, `pool renovation`, `plunge pool`, `inground pool`, `in-ground pool`. → POOL.
3. **Do NOT count** as pool: `safety pool fence`, pool maintenance, pool service, pool opening, pool closing, pool repair, pool equipment.

## Rule 5 — Revenue extraction from Jerome's CRM

Use `Total contract amount` first. Fall back to `Lead Value` only if `Total contract amount` is blank. Don't use `Lead Value` when `Total contract amount` is populated — the two diverge significantly on signed deals.

## Rule 6 — Date attribution methodology choice

When a lead originates in one year and closes in the next (e.g., Smock — 2025 Meta lead, Jan 1 2026 close), two attribution views are valid. Document which is in use for each section:

- **Lead-origination date**: revenue counts in the year/month the lead came in. Used in funnel-conversion sections (Lead → Quote → Win rates).
- **Close date**: revenue counts in the year/month the contract was signed. Used in cost-per-acquisition and ROAS sections.

Both views should be available, clearly labeled, and the methodology noted in any section that uses one or the other.

## Cycle-end check

Before marking a cycle complete:

1. Diff source-field variant list against this SOP. Any new variants → add to Rule 2 list and re-classify the affected rows.
2. Diff Google Ads campaign IDs against `Blue_Tree_Campaign_ID_Map.md`. Any new IDs → add and re-classify.
3. Run the canonical attribution + pool detection. Save the per-channel pool lead counts and pool revenue figures as the cycle's source-of-truth before any narrative writing.
