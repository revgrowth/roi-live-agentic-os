# Rank tracker: build on DataForSEO vs keep SE Ranking

Checked 26 September 2026 from public pages only. No DataForSEO account was opened. No paid API call was made.

## Summary

A daily in-house tracker on DataForSEO costs about **$333 to $1,085 a month** at today's volume, against **$236** on SE Ranking.
Double the keywords and the questions and that range is about **$666 to $2,169 a month**. Triple them and it is about **$999 to $3,254**.
The low number is first-page ranks on the cheap queue. The high number is top-100 ranks, the depth SE Ranking lists, at the low end of AI fees that DataForSEO does not publish as a flat rate.
The faster queue, with those AI fees at the high end of public provider rates, is about **$2,519 / $5,038 / $7,557** a month at 1x / 2x / 3x. Checking once a week instead of every day cuts any of these bills to about one-seventh, so about **$48 to $155** at today's volume.
Keep SE Ranking. The $89 AI add-on renews on 13 October 2026, and the public pages disagree on whether that $89 is 200 checks a month or a daily prompt allowance, so confirm the unit on the billing screen before it renews.

## How the $236 bill is split

Receipts, as given for this report:

| Line | Amount | Billing day |
| --- | ---: | --- |
| Pro plan, 2,000 keywords | $119 | 13th |
| AI Search add-on | $89 | 14th, renews 13 October 2026 |
| 500 extra keywords | $28 | 15th |
| **Total** | **$236** | |

Slots in use: **2,288 of 2,500** keyword slots, checked daily, city-level, Google and Bing. **250** AI prompt/question slots: ChatGPT and Google AI Mode at city level, and Google AI Overview, Gemini, and Perplexity at US level.

## 1. Public prices used

Prices below were read from DataForSEO's site on 26 September 2026. A month in the cost tables is 365/12 = **30.42 days**.

### Minimum payment

| Rule | Amount | Source |
| --- | ---: | --- |
| Minimum payment | $50 | https://dataforseo.com/pricing and https://dataforseo.com/help-center/minimum-payment |
| Monthly subscription for SERP | none | https://dataforseo.com/help-center/making-a-payment-changing-details-refunds — funds stay on the balance until spent |
| Old $100/month commitment for LLM Mentions and Backlinks | removed 1 July 2026 | https://dataforseo.com/update/pricing-update-in-dataforseo-apis |

The November 2025 LLM Mentions launch post still describes the $100 commitment. The 1 July 2026 update is the later page and is the one used here.

### Google and Bing organic SERP

One SERP page is 10 results. City targeting uses `location_code`. That parameter is not in the cost-multiplier table, so a city location does not add a fee on top of the page price.

| Queue | Turnaround on the page | Price per page (10 results) | Per 1,000 pages | Source |
| --- | --- | ---: | ---: | --- |
| Standard, normal | about 5 minutes; target 45 minutes | $0.0006 | $0.60 | https://dataforseo.com/pricing/serp/google-organic-serp-api and https://dataforseo.com/pricing/serp/bing-organic-serp-api |
| Priority (high) | up to about 1 minute | $0.0012 | $1.20 | same two pages (HTML; the prices sit in separate columns) |
| Live | up to about 6 seconds | $0.002 | $2.00 | same two pages |

Google and Bing organic use the same three page prices.

**Top 100 costs 10 pages, and two official pages disagree on the extra pages.**

The help-center FAQ updated 2 July 2026 bills every page at the full page price. For 100 results that is:

| Queue | 100 results (10 pages) | Source |
| --- | ---: | --- |
| Standard, normal | 10 × $0.0006 = **$0.006** | https://dataforseo.com/help-center/serp-api-pricing-depth-update-faq |
| Priority | 10 × $0.0012 = **$0.012** | same FAQ |
| Live | 10 × $0.002 = **$0.020** | same FAQ |

The 16 September 2025 update post, still online, says extra pages are 25% off (`each next page = 0.75 × base price`). On that older rule, 100 results on the normal queue cost $0.00465, not $0.006. Source: https://dataforseo.com/update/important-serp-api-remains-fully-operational-pricing-update

The cost tables use the **2 July 2026 FAQ** (the higher number), so the budget is the current help-center example. If the 25% discount is still applied at billing time, top-100 keyword cost is about 22.5% lower ($647 a month instead of $835 at 1x, normal queue). Unused pages are refunded when a SERP runs out of results, which is common on local queries, so the top-100 figure is a ceiling for a `depth: 100` setting.

### Google AI Overview

There is no separate AI Overview product with its own price. AI Overview is an item inside Google Organic SERP.

Cached overviews come back in the normal organic response at the organic page price. Asynchronous overviews need `load_async_ai_overview` (the pricing page lists this as `load_async_overview`). The pricing page says that parameter **adds one base price**. The help-center example: a normal-queue request at $0.0006 plus the flag costs **$0.0012**. The extra is refunded when no asynchronous overview is returned. Live docs state an extra **$0.002**, which is one live base price.

Sources:

- https://dataforseo.com/help-center/how-to-scrape-google-ai-overviews-with-serp-api
- https://dataforseo.com/pricing/serp/google-organic-serp-api
- https://docs.dataforseo.com/v3/serp/google/organic/live/advanced/

This report prices each AI Overview question as one US organic page plus one base-price surcharge, and treats that surcharge as charged. Real invoices will be lower on the days Google serves a cached overview.

### Google AI Mode

Separate endpoint. Price is per SERP page. These tables assume one page per question. Asking for more depth bills extra (docs: every 20 desktop results or every 10 mobile results).

| Queue | Per page | Per 1,000,000 pages | Source |
| --- | ---: | ---: | --- |
| Standard | $0.0012 | $1,200 | https://dataforseo.com/pricing/google-serp/google-ai-mode-serp-api |
| Priority | $0.0024 | $2,400 | same |
| Live | $0.004 | $4,000 | same |

Location is a normal SERP `location_code`, so city-level AI Mode does not add a location fee.

### LLM Responses (ChatGPT, Gemini, Perplexity, Claude)

This is the product that sends a prompt and returns the model's answer. It is the closest match to a daily AI-question check.

| Method | Who | DataForSEO fee | What else you pay | Turnaround | Source |
| --- | --- | --- | --- | --- | --- |
| Live | ChatGPT, Gemini, Claude, Perplexity | $0.0006 per task | the LLM provider's own charge | up to 120 seconds | https://dataforseo.com/pricing/ai-optimization/llm-responses |
| Standard | ChatGPT, Gemini, Claude | $0.0002 per task | $0.01 is prepaid, then adjusted to the real LLM charge | up to 72 hours | same, and https://dataforseo.com/help-center/how-the-price-for-using-llm-responses-endpoints-is-calculated |

Perplexity is Live only. Source: https://docs.dataforseo.com/v3/ai_optimization/llm_responses/overview/

The $0.01 on the standard queue is a prepayment, not the price. If the model costs less, the difference is refunded. If it costs more, the extra is charged. A standard task that is still unfinished after 72 hours is failed and the $0.01 is refunded. That window is too slow to rely on for a check that has to land the same day.

City support, from the docs:

- ChatGPT: `web_search_city` plus country code, and only when web search is on. https://docs.dataforseo.com/v3/ai_optimization/chat_gpt/llm_responses/live/
- Perplexity: country code only (`web_search_country_iso_code`). No city field. Sonar models search the web by default. https://docs.dataforseo.com/v3/ai_optimization/perplexity/llm_responses/live/
- Gemini: `web_search` true/false. No city field on the live docs page. https://docs.dataforseo.com/v3/ai_optimization/gemini/llm_responses/live/

That matches the current setup: ChatGPT at city level, Gemini and Perplexity at US level.

**The LLM provider portion is not a DataForSEO flat rate.** DataForSEO passes through the provider bill in a field called `money_spent`. The ranges below are from the providers' own public pages. They are marked UNVERIFIED as a DataForSEO invoice, because the model DataForSEO selects, the token count, and how many web searches one question fires are not on a DataForSEO price card.

| Engine | Verified provider piece | UNVERIFIED range used in the tables | Why the range is that wide | Source |
| --- | --- | --- | --- | --- |
| ChatGPT with web search | $10 per 1,000 tool calls = **$0.01 per search** | **$0.01 to $0.05** per question | Search-content tokens are extra. One question can fire more than one search. The $0.01 is one search with tokens ignored, so it is a floor, not a quote. | https://developers.openai.com/api/docs/pricing |
| Gemini with Google Search grounding | Gemini 3: **$14 per 1,000** search queries ($0.014) after a free allotment. Gemini 2.5: **$35 per 1,000** grounded prompts ($0.035). | **$0.014 to $0.035** per question | One Gemini 3 prompt can run several search queries. The free allotment sits on a Google account. Whether DataForSEO's account still has free queries left is unknown, so the tables use the paid rate. | https://ai.google.dev/gemini-api/docs/pricing |
| Perplexity Sonar | Request fee **$5 / $8 / $12 per 1,000** for low / medium / high context. Their own short Sonar example totals **$0.00542**. Sonar Pro's short low-context example totals about **$0.019**. | **$0.00542 to $0.020** per question | A tracking prompt with a longer answer costs more than the short sample. | https://docs.perplexity.ai/docs/getting-started/pricing |

### LLM Mentions (not used in the cost tables)

LLM Mentions is a stored index of past AI answers, not a button that asks ChatGPT a question in a given city today. The launch post limits it to Google AI Overview (locations they list) and ChatGPT in the US. Price on the current pricing page: **$0.10 per request + $0.001 per returned row**. The page's calculator widget also rendered a "$0.05" summary that does not match those unit prices, so that widget total is ignored.

Sources:

- https://dataforseo.com/pricing/ai-optimization/llm-mentions
- https://dataforseo.com/update/introducing-llm-mentions-api

It is the wrong product for "check these 250 questions every day in these cities." It could later answer "where do models already mention this brand," which is a different job.

## 2. Assumptions behind the cost tables

Every figure below follows these rules. Change one of them and the bill moves.

1. **2,288 is a phrase count, and each phrase is checked on Google and on Bing.** That is 2,288 × 2 = **4,576 SERP tasks a day** at 1x. This matches legacy SE Ranking Pro, where one keyword counted as one slot no matter how many engines it used, and it matches the request to account for both engines. If the 2,288 already includes the Google/Bing split, keyword dollars are half of what is shown.
2. **One device.** Desktop only. Tracking mobile as well doubles the keyword tasks.
3. **City location is free** on organic SERP and on AI Mode. The fee is the page price.
4. **Top 100 is the comparable keyword product**, because the SE Ranking price page lists Google Top 100 tracking. First-page (`depth: 10`) is shown beside it as the cheap setting. Top 100 uses the July 2026 full-price-per-page rule.
5. **250 questions, and each question is one slot with one city (C = 1).** Each day that is:
   - 250 ChatGPT calls at that slot's city
   - 250 Google AI Mode calls at that slot's city
   - 250 Google AI Overview calls, United States
   - 250 Gemini calls, United States
   - 250 Perplexity calls, United States
   - **1,250 AI calls a day**
6. **How many cities each prompt fans out to is unknown.** C = 1 is the base. C = 5 and C = 10 are the range. Only ChatGPT and AI Mode multiply by C. AI Overview, Gemini, and Perplexity stay at one US check, because that is how the current setup is described.
7. **2x and 3x multiply the 2,288 phrases and the 250 questions. They do not multiply C.** More clients add more phrases and more questions. They do not, in these tables, add more cities per question. City growth is the separate C table.
8. **Cheapest queue** means Standard normal for SERP, AI Mode, and AI Overview, and the Standard LLM fee for ChatGPT and Gemini. Perplexity stays on Live because that is the only method. **Faster queue** means Priority for SERP products. Live is a third column, not the "faster queue" in the comparison tables.
9. **Low AI** uses the bottom of the provider ranges ($0.01, $0.014, $0.00542). **High AI** uses the top ($0.05, $0.035, $0.020). Both ends are UNVERIFIED as a DataForSEO invoice.
10. **No map-grid product, no backlink API, no site audit API.** Those are not in the dollar tables. Section 6 says what disappears with them.

## 3. Cost tables

Dollars are per month (365/12 days), rounded to the nearest dollar. Daily cost is in the 1x breakout.

### 1x breakout, C = 1 (250 questions, one city)

| Piece | Calls per day | Standard, low AI | Priority, high AI | Live, high AI |
| --- | ---: | ---: | ---: | ---: |
| Keywords, first page, Google + Bing | 4,576 | $84 | $167 | $278 |
| Keywords, top 100, Google + Bing | 4,576 | $835 | $1,670 | $2,784 |
| Google AI Mode, city | 250 | $9 | $18 | $30 |
| Google AI Overview, US, page 1 + surcharge | 250 | $9 | $18 | $30 |
| ChatGPT, city, web search | 250 | $78 | $385 | $385 |
| Gemini, US, web search | 250 | $108 | $271 | $271 |
| Perplexity, US, Live only | 250 | $46 | $157 | $157 |
| **AI questions subtotal** | **1,250** | **$250** | **$849** | **$873** |
| **Total if keywords are first page** | | **$333** | **$1,016** | **$1,151** |
| **Total if keywords are top 100** | | **$1,085** | **$2,519** | **$3,657** |

Row amounts are rounded to the nearest dollar. Totals are the unrounded sum, then rounded, so a column of rounded rows can miss the total by $1. The two keyword rows are alternatives. A total uses one of them, not both.

The AI subtotal at the low end (**$250**) is already more than the **$89** add-on. Top-100 keywords on the cheap queue (**$835**) are already more than the whole **$236** bill.

### 1x, 2x, 3x per month, C = 1

| Scale | Keyword slots in use | AI slots | Daily, first page, cheap queue, low AI | Daily, top 100, cheap queue, low AI | Daily, top 100, faster queue, high AI | Weekly, top 100, cheap queue, low AI |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 1x | 2,288 | 250 | $333 | $1,085 | $2,519 | $155 |
| 2x | 4,576 | 500 | $666 | $2,169 | $5,038 | $310 |
| 3x | 6,864 | 750 | $999 | $3,254 | $7,557 | $465 |
| SE Ranking today | 2,288 of 2,500 | 250 | **$236** | **$236** | **$236** | **$236** |

Weekly is the daily month divided by 7. The same ratio applies to the first-page column: about **$48 / $95 / $143** a month at 1x / 2x / 3x.

At 2x and 3x, DataForSEO stays linear. SE Ranking does not. Section 4 has the public plan steps.

### If each question fans out to more than one city

Only ChatGPT and AI Mode grow with the city count. This table is 1x, Standard queue, top-100 keywords, low AI fees. 2x and 3x multiply the whole row.

| Cities per question (C) | AI calls per day | Month, top 100, cheap queue, low AI | Extra vs C = 1 |
| ---: | ---: | ---: | ---: |
| 1 (base assumption) | 1,250 | $1,085 | — |
| 5 | 3,250 | $1,431 | +$346 |
| 10 | 5,750 | $1,865 | +$780 |
| 20 | 10,750 | $2,732 | +$1,647 |

Each added city, on all 250 questions, adds about **$87 a month** at the low ChatGPT rate and about **$391 a month** at the high rate, on the cheap SERP queue. At the high rate, C = 10 is thousands of dollars a month of AI alone. The city count has to be counted in the SE Ranking projects before anyone treats $1,085 as the bill.

### What would change the bill the most

| If this is true | Effect |
| --- | --- |
| The 2,288 already includes Google and Bing as separate slots | Keyword dollars drop by half |
| Mobile is tracked as well as desktop | Keyword dollars double |
| Local SERPs return fewer than 10 pages and the refund lands | Top-100 keyword dollars fall toward the first-page price. They do not fall below it |
| The September 2025 25% extra-page discount is still applied | Top-100 keyword dollars fall about 22.5% ($835 becomes $647 at 1x, normal queue) |
| ChatGPT fires several web searches per question | The $0.05 high end is too low. Each extra search adds $0.01 plus tokens, before 250 questions and 30.42 days |
| C is really 10, not 1 | Add about $780 a month at the low rate, 1x, on top of the $1,085 |

## 4. Side by side with SE Ranking

### What the public site sells now

Fetched from https://seranking.com/subscription.html on 26 September 2026. The live price page does not list a Pro plan.

| Plan | Monthly | Annual, per month | Keywords, daily | Prompts, daily | Projects | Seats | History | Guest links |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |
| Core | $129 | $103.20 | 2,000 | 100 | 10 | 1 | 6 months | not in the Core feature list |
| Growth | $279 | $223.20 | 5,000 | 250 | 30 | 3 | all-time | yes |
| Enterprise | custom | custom | custom | custom | custom | custom | custom | custom |

Other public add-ons on that page:

| Add-on | Price on the page | Note |
| --- | ---: | --- |
| Extra keywords | from $22.40 (Core), from $32 (Growth) | The page does not say how many keywords that dollar figure buys |
| Extra manager seat | from $16 | |
| Agency Pack | $69/month | Annual billing only. White label, 30 client seats, scheduled reports |
| Data API | from $179/month | Annual billing only |

The help article on extra keywords says the purchase step is 100 keywords on Core, 500 on Growth, and 500 on legacy Pro. It does not, in the text retrieved for this report, attach a dollar amount to the step. Source: https://help.seranking.com/hc/en-us/articles/18503246465692-How-to-purchase-additional-keywords

So **"from $22.40" and "from $32" are not a verified per-500 price.** Any SE Ranking total below that needs those two numbers multiplied is marked UNVERIFIED.

The receipt price of **$28 for 500 extra keywords ($0.056 each)** is real for the current Pro account. It is not on the public price page, so it is not used as the price of a future pack.

### Legacy counting vs the new plans

This changes 2x and 3x.

SE Ranking's billing FAQ says legacy plans (Essential, Pro, Business) counted one phrase as one keyword even when it was tracked on Google and Bing. New plans count **phrase × target**. Their example: "phone repair" in Boston on Google and Bing is 1 keyword on a legacy plan and 2 keywords on a new plan. Source: https://help.seranking.com/hc/en-us/articles/16332687136924-Payment-and-billing-details-FAQ

If every one of the 2,288 phrases is on Google and Bing at one city and one device, a move onto Core or Growth consumes **4,576 keyword units**, not 2,288.

| Scale | Phrases if Pro-style counting still applied | New-plan units if each phrase is on Google and Bing | Growth's 5,000 keywords |
| --- | ---: | ---: | --- |
| 1x | 2,288 | 4,576 | fits, with 424 units spare |
| 2x | 4,576 | 9,152 | short by 4,152 |
| 3x | 6,864 | 13,728 | short by 8,728 |

Project count is unknown. Core allows 10 projects. Growth allows 30. An agency account that already has more than 10 client projects does not fit on Core even before the keyword math.

### 1x, 2x, 3x on public tiers

| Scale | What fits the keyword volume | Verified monthly price | Prompt gap | Versus $236 |
| --- | --- | ---: | --- | --- |
| 1x, if Pro can stay as billed | current stack | **$236** | the $89 line, see section 5 | the bill today |
| 1x, repriced to public Growth, monthly | 4,576 new-plan units fit in 5,000 | **$279** | 250 included prompts match 250 slots only if a "prompt" is not multiplied by the 5 LLMs | **+$43** |
| 1x, Growth, annual | same | **$223.20** | same prompt question | **−$12.80**, paid upfront for the year |
| 1x, Core | 2,000 keywords and 10 projects | **$129** plus extras | 100 prompts vs 250 slots | Core's included limits do not cover today's volume. Extra-keyword dollars are UNVERIFIED |
| 2x on Growth monthly | 5,000 included, 4,152 short | **$279 + UNVERIFIED extras** | 500 prompts vs 250 included. No public extra-prompt price on the subscription page | keyword extras unknown |
| 3x on Growth monthly | 5,000 included, 8,728 short | **$279 + UNVERIFIED extras** | 750 prompts vs 250 included | Enterprise territory |

Illustration only, not a quote: if "from $32" were the price of one Growth step of 500 keywords, 2x would need 9 steps ($288) and the keyword plan would be $279 + $288 = **$567** a month before extra prompts. 3x would need 18 steps ($576) and the keyword plan would be **$855** a month before extra prompts. Those two totals are UNVERIFIED. They exist so a 2x conversation has a floor to argue from, not a number to approve.

DataForSEO at the same scales, daily top 100, cheap queue, low AI, C = 1: **$1,085 / $2,169 / $3,254**. That is above Growth's verified $279 at 1x, and it stays above any plausible SE Ranking keyword pack unless the in-house tracker drops to first page or to a weekly check.

Weekly top-100 on DataForSEO at low AI is **$155 / $310 / $465**. At 1x that is under the $236 bill and under Growth at $279, and it still drops site audit, backlinks, guest links, and the report history.

## 5. Is the $89 a separate 200-prompt add-on?

**The $89 matches the published price of the AI Search add-on. The unit inside it is in conflict, and it should be treated as unresolved until someone opens the billing screen.**

The help-center article, as indexed in search on 26 September 2026, says:

- 200 checks = **$89/month** ($71.20 on annual)
- 450 checks = **$179** ($143.20 annual)
- 1,000 checks = **$345** ($276 annual)
- **1 check = 1 prompt on 1 AI platform**
- Their example: one prompt on all five engines (AI Overviews, AI Mode, ChatGPT, Perplexity, Gemini) uses **five checks**
- The table header in that article is **"Checks per month"**

Source: https://help.seranking.com/hc/en-us/articles/22120452776476-AI-Search-Add-on

That page returned a Cloudflare check when fetched directly, so the table above is from the indexed article text, not from a live render in a browser. Re-open it before 13 October.

The public subscription page, fetched live the same day, does not list that $89 add-on. It folds prompts into the plan: Core 100 prompts a day, Growth 250 prompts a day, and a separate row for "LLMs to track: 5." A third-party change log (PulseSignal) says the $89 add-on disappeared from the price page. That third-party note is not a SE Ranking source. The useful fact is the one on SE Ranking's own pages: the price page and the help article describe different units.

What that means for the 250 slots:

| Reading | Does $89 cover 250 slots? |
| --- | --- |
| $89 buys 200 checks **per month**, and one check is one prompt on one engine | No. 250 prompts × 5 engines = 1,250 checks a month, which is above the 1,000-check pack at $345, and it is not a daily check. 200 checks a month is about 7 checks a day. |
| $89 buys 200 prompts, and the five engines are included | The 250 slots are 50 over the pack. The next published step in the help article is 450 checks at $179, and "checks" may not mean "prompts." |
| The new plan language is what they will renew onto: prompts **per day**, five LLMs included | Growth's 250 daily prompts would match the slot count. That plan is $279 a month for the whole tool, not $89 on top of Pro. Whether engine × city is included in the 250 is not stated. |

The receipt proves the account is being charged $89 under the name AI Search. It does not prove that 250 questions are checked every day on five engines inside that $89. Those can both be true: the line item is $89, and the daily fan-out the owner asked about is larger than the allowance.

A related help article says the AI Search add-on includes SE Visible at no extra charge. Source: https://help.seranking.com/hc/en-us/articles/22266372506524-SE-Visible-FAQ

## 6. Storage on A6, and the Google Sheets limit

Store the database on the A6 machine. Send a compressed file to Google Drive each day as the backup. Drive is the copy. It is a poor place to query from.

Recommended export: one **Parquet** file per day, or **CSV.gz** if Parquet is awkward on Windows. One file per day, named by date, under a Drive folder per client or per month. A Sheet that people open should be a latest-rank snapshot that gets replaced, not an ever-growing history.

### Rows

| Level | Keyword tasks per day (Google + Bing) | Rank rows per day | Rank rows per year | Full top-100 result rows per day | Full top-100 rows per year | AI answer rows per day at C = 1 | AI answer rows per year |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1x | 4,576 | 4,576 | 1,670,240 | 457,600 | 167,024,000 | 1,250 | 456,250 |
| 2x | 9,152 | 9,152 | 3,340,480 | 915,200 | 334,048,000 | 2,500 | 912,500 |
| 3x | 13,728 | 13,728 | 5,010,720 | 1,372,800 | 501,072,000 | 3,750 | 1,368,750 |

A rank row is one phrase, one engine, one day. A full SERP row is one of up to 100 results inside that task. An AI row is one prompt, one engine, one location, one day.

### Disk, approximate

Byte assumptions, stated so the gigabytes can be redone: rank row 500 to 1,000 bytes; SERP result row 350 bytes; AI answer 4,000 to 8,000 bytes of text. Indexes on a rank database often land near another copy of the table. Parquet or gzip on URL-and-text data is often 5 to 10 times smaller. That compression factor is a typical ratio, not a test on this data. Buy disk for the uncompressed database.

| Level | Rank-only database per year | Rank file with indexes, rough | Full top-100 table per year, uncompressed | Full top-100, if compression is 5–10× | AI text per year |
| --- | --- | --- | --- | --- | --- |
| 1x | 0.8 to 1.7 GB | 2 to 4 GB | 58 GB | about 6 to 12 GB | 1.8 to 3.6 GB |
| 2x | 1.7 to 3.3 GB | 4 to 7 GB | 117 GB | about 12 to 23 GB | 3.6 to 7.3 GB |
| 3x | 2.5 to 5.0 GB | 5 to 10 GB | 175 GB | about 18 to 35 GB | 5.5 to 11 GB |

SQLite is the right store for rank snapshots (about 1.7 million rows a year at 1x). DuckDB is the right store if the full top-100 result rows are kept (167 million rows a year at 1x). Either one runs on Windows. The choice is the disk on A6, which this report does not know. A 58 GB table plus indexes needs a machine with well over 100 GB free before 2x or 3x is considered.

### Google Sheets will hit 10 million cells

A Sheet cell limit of 10 million is a hard stop if history is appended.

Rank history assumed at 10 columns: date, client, keyword, engine, location, device, rank, url, title, flags.

| Level | Rank cells per day | Days until 10 million, daily append | Days until 10 million, weekly append | Rank + AI in one sheet (AI at 8 columns), daily |
| --- | ---: | ---: | ---: | ---: |
| 1x | 45,760 | **219 days** | about 4.2 years | **179 days** |
| 2x | 91,520 | **109 days** | about 2.1 years | **90 days** |
| 3x | 137,280 | **73 days** | about 1.4 years | **60 days** |

Full top-100 results in a Sheet, 8 columns, at 1x: **3,660,800 cells a day**. The sheet fills on **day 3**. At 2x it fills on **day 2**. At 3x it fills on **day 1**.

A Sheet that is overwritten with the latest rank only, and does not keep history, stays at 45,760 cells at 1x (91,520 at 2x, 137,280 at 3x). That fits. The limit is the history, not the latest view.

## 7. Build and upkeep hours

One person who already knows Python, SQLite or DuckDB, and the Windows Task Scheduler. Hours are a range for the scope named, not a quote from a vendor.

| Initial build | Hours |
| --- | ---: |
| Keyword fetcher: Standard queue, retries, city location codes, Google and Bing, depth switch | 20–30 |
| AI fetchers: AI Mode, AI Overview flag, ChatGPT, Gemini, Perplexity, with a hard daily spend cap | 25–40 |
| Database schema, retention, and a way to re-run a failed day | 10–15 |
| Scheduler on A6, logs, and a failure notice | 6–10 |
| Daily Parquet or CSV.gz upload to Drive | 8–12 |
| Import of the current keyword and prompt lists, including the city on each row | 8–15 |
| A basic internal report: latest rank, rank change, and whether the brand was cited | 15–25 |
| **Usable internal tracker** | **90–150** |
| Client-ready white-label reports that stand in for SE Ranking's | another 40–80 |

| Upkeep | Hours |
| --- | --- |
| First three months: failed days, parser breaks, cost surprises | 10–20 per month |
| After that, if the schema stays still: failed tasks, the odd API field change, Drive auth | 4–10 per month |

DataForSEO changed organic billing on 19 September 2025 and posted another pricing update on 1 July 2026. Parser and price maintenance is the ongoing cost, not the Windows box. A spend cap in the account dashboard matters more than a dashboard chart, because a depth or a web-search setting left on the wrong value bills every keyword every day.

## 8. What drops if SE Ranking goes away

The DataForSEO prices in this report buy rank rows and AI answers. They do not buy the rest of the subscription.

| Capability | On the current SE Ranking plans | In the DataForSEO build priced here |
| --- | --- | --- |
| Daily rank, city, Google and Bing | included in the keyword slots | priced in section 3 |
| Google Top 100 | listed on the price page | the $835/month line at 1x, or less when short SERPs are refunded |
| SERP features (packs, snippets, and the rest) | in the rank tracker | available in the organic response if someone parses and stores the items. Parsing time is in the build hours. It is easy to store only the rank and lose the features |
| AI Overview, AI Mode, ChatGPT, Gemini, Perplexity | the $89 add-on, unit unresolved | priced in section 3, and likely more expensive per day |
| Site audit | Core 250,000 pages/month, Growth 2,000,000 | not priced. A separate On-Page API |
| Backlink research and monitoring | listed on Core and Growth. Credit limits were not in the fetched price table | not priced. Backlinks API is a different product. The old $100/month commitment on it was removed 1 July 2026. Per-request prices were not pulled for this report |
| Guest / client share links | Growth, not listed as a Core bullet | gone, unless a report file is emailed or put in a shared Drive folder |
| White-label reports | Agency Pack is $69/month, annual billing only, on the current price page. Whether legacy Pro already includes white-label PDFs has to be checked in the account | gone until someone builds them (the extra 40–80 hours) |
| Historical rank continuity | Core 6 months, Growth all-time | starts at zero on cutover day. Export before any cancellation. The price page caps data export at 50,000 rows on Core and 100,000 rows on Growth, so a full history may take more than one export |
| Local pack / map grid | Local & Map Rank Tracker is listed at 1,500 keywords, with 3 locations included and extra locations from $18.40 | a local pack can appear as an item inside organic SERP. A map grid is a different DataForSEO product and is not in these tables |
| Share of Voice, keyword and competitor research | listed | not in these tables |
| Page-change monitoring | Growth | not in these tables |
| Content articles | 25 on Core, 50 on Growth | not relevant to the tracker, and gone with the plan |
| SE Visible | included with the AI Search add-on, per the help article | gone with the add-on |
| Someone else to fix a failed morning check | included | the 4–10 hours a month |

## 9. Three options

### Option 1 — Full build

Replace SE Ranking with the A6 tracker.

Daily top-100 parity is about **$1,085 a month** at 1x on the cheap queue and the low AI rates, before audit, backlinks, map grids, and client reports. First-page daily is about **$333**, which still beats $236 only if the AI rates stay at the low end and the lost tools are worth $0. Weekly top-100 is about **$155** at the low end, which is the only full-replacement shape that clearly costs less than $236, and it is a weekly product plus a home-built report.

Choose this only after a written list of who uses audit, backlinks, guest links, and white-label reports comes back empty, and after the city count is known.

### Option 2 — Full keep

Stay on SE Ranking at **$236**.

This is the option that matches the owner's question. A like-for-like daily check of every keyword to top 100, on Google and Bing, plus every AI question on the five surfaces, costs more at DataForSEO than the tool that already does it. 2x and 3x get more expensive in both places. They get expensive faster at DataForSEO, because the API bill scales in a straight line and the AI provider fees scale with it.

### Option 3 — Hybrid

Two hybrids were asked about. Neither one is a saving at daily parity.

**Keep the keywords in SE Ranking, move the AI questions to DataForSEO.** The low estimate for the 250 questions at one city is about **$250 a month**, against **$89**. The high estimate is about **$850**. This hybrid spends more. It is a scope increase if the $89 pack is really 200 checks a month, because DataForSEO would then be checking questions that SE Ranking is not checking every day.

**Keep the AI questions in SE Ranking, move the keywords to DataForSEO.** Top-100 daily keywords are about **$835 a month**, against **$147** ($119 + $28). First-page daily keywords are about **$84**, which is less than the keyword lines, and it gives up top 100. Weekly top-100 keywords are about **$119**, in line with the Pro plan alone, and the audit, backlinks, and reports still have to live somewhere.

The hybrid that is worth doing is smaller than a migration. Keep SE Ranking as the system of record. If a client needs a question the allowance will not cover, run that question through DataForSEO Live with a spend cap. The minimum payment is $50. Use that deposit as the pilot ceiling, read the real `money_spent` on a few dozen prompts, and only then revisit a migration. That measurement replaces the UNVERIFIED $0.01 to $0.05 ChatGPT range with an invoice.

### Recommendation

**Full keep.** Do not build the tracker to save money. Do not move the AI questions onto DataForSEO as a swap for the $89. The open decision is the renewal, not a build.

### Decide these before 13 October 2026

1. Renew or cancel the **$89 AI Search add-on**. It renews on 13 October 2026. Cancelling it does not require a replacement tracker.
2. On the billing screen, write down the unit the $89 actually buys: **200 checks per month**, or **prompts per day**, and whether one prompt on five engines counts as five. The public help article and the public price page disagree.
3. Count, from the projects, three numbers that this report had to assume: phrases that are on both Google and Bing, devices per phrase, and cities per AI prompt. Those three numbers move the DataForSEO bill by more than the SE Ranking subscription.
4. Ask SE Ranking whether the **Pro plan at $119** renews, or whether the account will be moved to Core at $129 or Growth at $279. The public site no longer lists Pro. Growth at $223.20 a month on annual billing is $12.80 under today's $236 and holds 5,000 new-plan keyword units, which covers today's Google-plus-Bing volume if the project count is within 30. That is a renewal conversation, not a build.
5. If a DataForSEO test is wanted after those answers, cap it at the **$50 minimum deposit** and a few dozen real prompts. Do not turn on a daily job for 4,576 keywords until the `depth` setting and the web-search setting have been read back from a small invoice.

---

seat=Cursor cloud agent, paid_api_calls=0
