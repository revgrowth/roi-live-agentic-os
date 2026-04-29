# DataForSEO API Guide

Reference for the two endpoints this skill calls. Read before tweaking the scripts.

**API host:** `https://api.dataforseo.com/v3`
**Auth:** HTTP Basic — `Authorization: Basic base64(login:password)`
**Pricing summary (live endpoints, as of 2026-04):**
- `dataforseo_labs/google/keyword_overview/live` — ~$0.0001 per keyword (1 task can carry up to 1000)
- `serp/google/organic/live/advanced` — ~$0.002 per request, AI Overview async adds ~$0.00075. Plan ~$0.003/kw to be safe.

Always check the latest pricing at https://dataforseo.com/pricing — these numbers change.

---

## Endpoint 1: Keyword Overview (Live)

**Path:** `/v3/dataforseo_labs/google/keyword_overview/live`
**Method:** POST

Bulk lookup for search volume, keyword difficulty, competition, CPC, and search intent.

### Request body (array — single task)

```json
[{
  "keywords": ["frac plug", "wireline", "perforating gun"],
  "location_code": 2840,
  "language_code": "en",
  "include_serp_info": false,
  "include_clickstream_data": false
}]
```

### Key request fields

| Field | Notes |
|---|---|
| `keywords` | Up to 1000 per task. Lowercase recommended. |
| `location_code` | 2840 = United States. Codes: https://docs.dataforseo.com/v3/dataforseo_labs/google/locations_and_languages/live/ |
| `language_code` | "en" for English. |
| `include_serp_info` | Adds top-10 organic results to the overview row. We use the dedicated SERP endpoint instead — keep this off. |
| `include_clickstream_data` | Paid add-on. Off by default. |

### Response shape (relevant slices)

```jsonc
{
  "status_code": 20000,                          // anything else = error
  "tasks": [{
    "result": [{
      "items": [{
        "keyword": "frac plug",
        "keyword_info": {
          "search_volume": 260,
          "cpc": 4.52,
          "competition": 0.04,
          "competition_level": "LOW"
        },
        "keyword_properties": {
          "keyword_difficulty": 0
        },
        "search_intent_info": {
          "main_intent": "transactional",
          "foreign_intent": ["informational", "commercial"]
        }
      }]
    }]
  }]
}
```

**Important:** keywords with insufficient measured volume return **no row at all** — the items array silently omits them. Always reconcile the request keywords against returned `item.keyword` values; treat missing keywords as a soft "no measurable volume" signal, not as an error.

---

## Endpoint 2: SERP Google Organic Live Advanced

**Path:** `/v3/serp/google/organic/live/advanced`
**Method:** POST

One keyword per request. Returns the full SERP including AI Overview, featured snippet, video, PAA, knowledge graph, popular products, related searches, and depth-N organic results.

### Request body

```json
[{
  "keyword": "frac plug",
  "location_code": 2840,
  "language_code": "en",
  "device": "desktop",
  "os": "windows",
  "depth": 20,
  "load_async_ai_overview": true
}]
```

### Key request fields

| Field | Notes |
|---|---|
| `keyword` | One keyword per request. |
| `device` | `desktop` or `mobile`. AI Overview presence sometimes differs by device — check both for high-stakes keywords. |
| `depth` | Organic results returned. 20 covers top 2 SERP pages. Costs the same regardless of depth. |
| `load_async_ai_overview` | **Set true** to fetch the full AI Overview content + citation references. Without this, you only get the AIO snippet stub. |

### Response shape (relevant slices)

```jsonc
{
  "status_code": 20000,
  "tasks": [{
    "result": [{
      "se_results_count": 1240000,
      "item_types": ["organic", "ai_overview", "people_also_ask", "video"],
      "items": [
        {
          "type": "ai_overview",
          "async_ai_overview": true,
          "items": [/* AIO content blocks with text */],
          "references": [
            { "source": "WellBoss", "domain": "wellboss.com", "url": "https://...", "title": "..." }
          ]
        },
        { "type": "organic", "rank_absolute": 1, "domain": "example.com", "url": "...", "title": "..." },
        { "type": "video", ... },
        { "type": "people_also_ask", ... }
      ]
    }]
  }]
}
```

### Detecting AI Overview citations

Iterate `result.items` for `type === "ai_overview"`. The `references` array (or, in some response variants, references nested inside child `items`) carries the cited domains. Both shapes are observed in production — handle both.

### SERP feature inventory

Common `item.type` values to expect: `organic`, `ai_overview`, `featured_snippet`, `knowledge_graph`, `people_also_ask`, `video`, `short_videos`, `images`, `popular_products`, `product_considerations`, `local_pack`, `related_searches`, `discussions_and_forums`, `scholarly_articles`, `top_stories`.

---

## Rate limits & retry guidance

- DataForSEO documents 30 simultaneous live API requests per IP. The scripts in this skill run serial with a 400 ms delay — well within the limit.
- `load_async_ai_overview: true` increases per-request latency by ~3–8s. Expect ~5–10s per SERP call end-to-end.
- Status code `20000` = success. Anything else (especially `40000`–`50000`) is an error — do not retry blindly; the API returns rich error messages in `status_message`.

---

## Idempotency notes

The skill scripts persist every paid response **before the next call starts**. If a run crashes, the next run reads cached files from disk and only calls the API for keywords that don't have a cached file yet. This is not optional — the prior version of the client-level helper script lost ~$0.10 of paid output to a mid-run filesystem reset. The cache-first design exists to make that class of incident impossible.

To force a re-call: pass `--force` to any of the three scripts. Avoid this unless you have a specific reason (e.g., you suspect SERPs have changed materially since the cached pull).

---

## Useful follow-ups (not implemented here)

- **Domain rank overview:** `/v3/dataforseo_labs/google/domain_rank_overview/live` — for competitor audit, get aggregate organic stats for a domain.
- **Ranked keywords:** `/v3/dataforseo_labs/google/ranked_keywords/live` — for a domain, list every keyword it ranks for. Useful for competitor gap analysis.
- **Backlinks summary:** `/v3/backlinks/summary/live` — domain authority signals.
- **AI mode SERP:** `/v3/serp/google/ai_mode/live/advanced` — emerging AI mode SERP, useful as Google rolls it out.

These are obvious next-skill additions when the engagement requires deeper competitor or backlink analysis.
