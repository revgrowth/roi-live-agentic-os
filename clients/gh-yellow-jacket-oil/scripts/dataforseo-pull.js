#!/usr/bin/env node
/**
 * One-shot DataForSEO pull for Yellow Jacket Oil Tools Phase 1 keyword validation.
 *
 * Idempotent — paid output is persisted per-keyword the moment a call returns,
 * and existing files are reused without re-calling the API. A mid-run crash
 * cannot vaporise paid data: each call writes to disk before the next call
 * starts.
 *
 * Disk layout under projects/raw/:
 *   keyword-overview.json                  — single canonical overview snapshot
 *   serp/{keyword-slug}.json               — one file per SERP keyword
 *
 * Reads DATAFORSEO_LOGIN / DATAFORSEO_PASSWORD from ../../.env (root-level Agentic OS .env).
 *
 * Usage: node scripts/dataforseo-pull.js [--force-overview] [--force-serp <keyword>]
 *
 * Throwaway helper. The durable version lives in .claude/skills/tool-dataforseo/.
 */

const fs = require('fs');
const path = require('path');

const ROOT_ENV = path.resolve(__dirname, '..', '..', '..', '.env');
const PROJECTS_DIR = path.resolve(__dirname, '..', 'projects');
const RAW_DIR = path.join(PROJECTS_DIR, 'raw');
const SERP_DIR = path.join(RAW_DIR, 'serp');
const OVERVIEW_FILE = path.join(RAW_DIR, 'keyword-overview.json');

// CLI flags.
const FORCE_OVERVIEW = process.argv.includes('--force-overview');
const FORCE_SERP_FLAG_INDEX = process.argv.indexOf('--force-serp');
const FORCE_SERP_KW = FORCE_SERP_FLAG_INDEX > -1 ? process.argv[FORCE_SERP_FLAG_INDEX + 1] : null;

function loadEnv(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const env = {};
  for (const line of content.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let v = m[2];
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    env[m[1]] = v;
  }
  return env;
}

const env = loadEnv(ROOT_ENV);
const LOGIN = env.DATAFORSEO_LOGIN;
const PASSWORD = env.DATAFORSEO_PASSWORD;

if (!LOGIN || !PASSWORD || LOGIN.includes('your-email') || PASSWORD.includes('your-api-password')) {
  console.error('ERROR: DATAFORSEO_LOGIN / DATAFORSEO_PASSWORD missing or unset in', ROOT_ENV);
  process.exit(2);
}

const AUTH = 'Basic ' + Buffer.from(`${LOGIN}:${PASSWORD}`).toString('base64');
const LOCATION_CODE = 2840; // United States
const LANGUAGE_CODE = 'en';

// 32 deliverables from cluster-map.md, mapped to their target keyword.
const DELIVERABLES = [
  { id: 1,  cluster: 'Perforating Gun Systems', type: 'pillar',   title: 'The Complete Guide to Perforating Guns',                keyword: 'perforating gun' },
  { id: 2,  cluster: 'Perforating Gun Systems', type: 'spoke',    title: 'Hollow Carrier vs. Expendable Guns',                    keyword: 'hollow carrier gun' },
  { id: 3,  cluster: 'Perforating Gun Systems', type: 'spoke',    title: 'Oriented Perforating: Why Placement Precision Matters', keyword: 'oriented perforating' },
  { id: 4,  cluster: 'Perforating Gun Systems', type: 'spoke',    title: 'Wireline vs. TCP Perforating',                          keyword: 'wireline perforating' },
  { id: 5,  cluster: 'Perforating Gun Systems', type: 'spoke',    title: 'Shaped Charges Explained',                              keyword: 'shaped charge' },
  { id: 6,  cluster: 'Perforating Gun Systems', type: 'spoke',    title: 'Perforating Gun Safety',                                keyword: 'perforating gun safety' },
  { id: 7,  cluster: 'Perforating Gun Systems', type: 'spoke',    title: 'How to Choose a Perforating Gun Manufacturer',          keyword: 'perforating gun manufacturers' },
  { id: 8,  cluster: 'Perforating Gun Systems', type: 'spoke',    title: 'Shot Density & Phasing',                                keyword: 'shot density perforating' },
  { id: 9,  cluster: 'Frac Plug Technology',    type: 'pillar',   title: 'Complete Guide to Frac Plugs',                          keyword: 'frac plug' },
  { id: 10, cluster: 'Frac Plug Technology',    type: 'spoke',    title: 'Composite vs. Dissolvable Frac Plugs',                  keyword: 'composite frac plug' },
  { id: 11, cluster: 'Frac Plug Technology',    type: 'spoke',    title: 'Dissolvable Frac Plug Technology',                      keyword: 'dissolvable frac plug' },
  { id: 12, cluster: 'Frac Plug Technology',    type: 'spoke',    title: 'Hybrid Frac Plugs',                                     keyword: 'hybrid frac plug' },
  { id: 13, cluster: 'Frac Plug Technology',    type: 'spoke',    title: 'Plug-and-Perf Completions',                             keyword: 'plug and perf' },
  { id: 14, cluster: 'Frac Plug Technology',    type: 'spoke',    title: 'Frac Plug Setting Procedures',                          keyword: 'frac plug setting tool' },
  { id: 15, cluster: 'Frac Plug Technology',    type: 'spoke',    title: 'Frac Plug Failures: Root Causes',                       keyword: 'frac plug failure' },
  { id: 16, cluster: 'Frac Plug Technology',    type: 'spoke',    title: 'How to Choose a Frac Plug',                             keyword: 'frac plug companies' },
  { id: 17, cluster: 'Wireline & Completions',  type: 'pillar',   title: 'Wireline Operations',                                   keyword: 'wireline operations' },
  { id: 18, cluster: 'Wireline & Completions',  type: 'spoke',    title: 'Well Completion Types',                                 keyword: 'well completion' },
  { id: 19, cluster: 'Wireline & Completions',  type: 'spoke',    title: 'Bridge Plug Applications',                              keyword: 'bridge plug' },
  { id: 20, cluster: 'Wireline & Completions',  type: 'spoke',    title: 'Multi-Stage Completion Optimization',                   keyword: 'multi-stage completion' },
  { id: 21, cluster: 'Glossary', type: 'glossary', title: 'Perforating Gun',                  keyword: 'perforating gun definition' },
  { id: 22, cluster: 'Glossary', type: 'glossary', title: 'Frac Plug',                        keyword: 'frac plug definition' },
  { id: 23, cluster: 'Glossary', type: 'glossary', title: 'Shaped Charge',                    keyword: 'shaped charge' },
  { id: 24, cluster: 'Glossary', type: 'glossary', title: 'Bridge Plug',                      keyword: 'bridge plug' },
  { id: 25, cluster: 'Glossary', type: 'glossary', title: 'Plug and Perf',                    keyword: 'plug and perf' },
  { id: 26, cluster: 'Glossary', type: 'glossary', title: 'Shot Density',                     keyword: 'shot density' },
  { id: 27, cluster: 'Glossary', type: 'glossary', title: 'Wireline',                         keyword: 'wireline' },
  { id: 28, cluster: 'Glossary', type: 'glossary', title: 'Oriented Perforating',             keyword: 'oriented perforating' },
  { id: 29, cluster: 'Glossary', type: 'glossary', title: 'Composite Frac Plug',              keyword: 'composite frac plug' },
  { id: 30, cluster: 'Glossary', type: 'glossary', title: 'TCP (Tubing Conveyed Perforating)', keyword: 'tcp perforating' },
  { id: 31, cluster: 'Glossary', type: 'glossary', title: 'Casing Collar Locator',            keyword: 'casing collar locator' },
  { id: 32, cluster: 'Glossary', type: 'glossary', title: 'Frac Ball',                        keyword: 'frac ball' },
];

const UNIQUE_KEYWORDS = [...new Set(DELIVERABLES.map(d => d.keyword))];

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

async function call(endpoint, body) {
  const res = await fetch(`https://api.dataforseo.com/v3/${endpoint}`, {
    method: 'POST',
    headers: { 'Authorization': AUTH, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${JSON.stringify(json).slice(0, 500)}`);
  if (json.status_code !== 20000) throw new Error(`API status ${json.status_code}: ${json.status_message}`);
  return json;
}

async function keywordOverview(keywords) {
  const body = [{
    keywords,
    location_code: LOCATION_CODE,
    language_code: LANGUAGE_CODE,
    include_serp_info: false,
    include_clickstream_data: false,
  }];
  return call('dataforseo_labs/google/keyword_overview/live', body);
}

async function serpAdvanced(keyword) {
  const body = [{
    keyword,
    location_code: LOCATION_CODE,
    language_code: LANGUAGE_CODE,
    device: 'desktop',
    os: 'windows',
    depth: 20,
    load_async_ai_overview: true,
  }];
  return call('serp/google/organic/live/advanced', body);
}

function summariseSerp(serpJson) {
  const result = serpJson?.tasks?.[0]?.result?.[0];
  if (!result) return { error: 'no result', features: [], ai_overview: null, top_organic: [] };
  const items = result.items || [];

  const featureSet = new Set();
  let aiOverview = null;

  for (const item of items) {
    if (!item || !item.type) continue;
    featureSet.add(item.type);
    if (item.type === 'ai_overview') {
      const refs = item.references
        || (item.items?.flatMap(i => i.references || i.links || []))
        || [];
      aiOverview = {
        present: true,
        async_ai_overview: !!item.async_ai_overview,
        references: refs.map(r => ({
          source: r.source || r.domain || null,
          domain: r.domain || null,
          url: r.url || null,
          title: r.title || null,
        })),
        text_excerpt: (item.markdown || (item.items || []).map(i => i.text || '').join(' ').slice(0, 500)) || null,
      };
    }
  }

  const topOrganic = items
    .filter(i => i?.type === 'organic')
    .slice(0, 10)
    .map(i => ({ rank: i.rank_absolute, domain: i.domain, url: i.url, title: i.title }));

  return {
    se_results_count: result.se_results_count || null,
    item_types: result.item_types || [...featureSet],
    features: [...featureSet],
    ai_overview: aiOverview,
    top_organic: topOrganic,
  };
}

function summariseOverview(overviewJson) {
  const items = overviewJson?.tasks?.[0]?.result?.[0]?.items || [];
  const map = new Map();
  for (const it of items) {
    const ki = it.keyword_info || {};
    const kp = it.keyword_properties || {};
    const ksi = it.search_intent_info || {};
    map.set(it.keyword, {
      search_volume: ki.search_volume ?? null,
      cpc: ki.cpc ?? null,
      competition: ki.competition ?? null,
      competition_level: ki.competition_level ?? null,
      keyword_difficulty: kp.keyword_difficulty ?? null,
      main_intent: ksi.main_intent ?? null,
      foreign_intent: ksi.foreign_intent ?? null,
    });
  }
  return map;
}

function fmt(n) {
  if (n === null || n === undefined) return '—';
  if (typeof n === 'number') return n.toLocaleString();
  return String(n);
}

function findExistingOverview() {
  // Prefer canonical name; fall back to any timestamped keyword-overview*.json
  // (legacy from the earlier run).
  if (fs.existsSync(OVERVIEW_FILE)) return OVERVIEW_FILE;
  const legacy = fs.readdirSync(RAW_DIR)
    .filter(f => /^keyword-overview.*\.json$/.test(f))
    .map(f => path.join(RAW_DIR, f))
    .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
  return legacy[0] || null;
}

function buildMarkdown(deliverables, overviewMap, serpMap) {
  const lines = [];
  lines.push('# Keyword Validation — Yellow Jacket Oil Tools Phase 1');
  lines.push('');
  lines.push('**Source:** DataForSEO Labs Google Keyword Overview + SERP Organic Live Advanced');
  lines.push(`**Location:** United States (location_code ${LOCATION_CODE})`);
  lines.push(`**Language:** ${LANGUAGE_CODE}`);
  lines.push(`**Run date:** ${new Date().toISOString().slice(0, 10)}`);
  lines.push(`**Total deliverables:** ${deliverables.length}`);
  lines.push(`**Unique keywords queried:** ${UNIQUE_KEYWORDS.length}`);
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## Validation Flags');
  lines.push('');
  lines.push('- `LOW_VOLUME` — search volume under 100/month (needs discussion before production)');
  lines.push('- `HIGH_KD` — keyword difficulty above 70 (needs discussion before production)');
  lines.push('- `AIO_PRESENT` — AI Overview present in SERP (priority AEO target)');
  lines.push('');
  lines.push('---');
  lines.push('');

  const byCluster = new Map();
  for (const d of deliverables) {
    if (!byCluster.has(d.cluster)) byCluster.set(d.cluster, []);
    byCluster.get(d.cluster).push(d);
  }

  for (const [cluster, items] of byCluster) {
    lines.push(`## ${cluster}`);
    lines.push('');
    lines.push('| # | Type | Title | Keyword | Volume | KD | Competition | Intent | SERP Features | AIO | Flags |');
    lines.push('|---|---|---|---|---:|---:|---|---|---|:---:|---|');
    for (const d of items) {
      const ov = overviewMap.get(d.keyword) || {};
      const srp = serpMap.get(d.keyword) || { features: [], ai_overview: null };
      const flags = [];
      if (ov.search_volume !== null && ov.search_volume !== undefined && ov.search_volume < 100) flags.push('LOW_VOLUME');
      if (ov.keyword_difficulty !== null && ov.keyword_difficulty !== undefined && ov.keyword_difficulty > 70) flags.push('HIGH_KD');
      if (srp.ai_overview?.present) flags.push('AIO_PRESENT');
      const aio = srp.ai_overview?.present ? 'YES' : '—';
      const features = (srp.features || []).filter(f => f !== 'organic').join(', ') || '—';
      lines.push(
        `| ${d.id} | ${d.type} | ${d.title} | \`${d.keyword}\` | ${fmt(ov.search_volume)} | ${fmt(ov.keyword_difficulty)} | ${ov.competition_level || '—'} | ${ov.main_intent || '—'} | ${features} | ${aio} | ${flags.join(', ') || '—'} |`,
      );
    }
    lines.push('');
  }

  lines.push('---');
  lines.push('');
  lines.push('## Flagged for Discussion');
  lines.push('');
  const lowVol = [];
  const highKd = [];
  const noData = [];
  for (const d of deliverables) {
    const ov = overviewMap.get(d.keyword);
    if (!ov || (ov.search_volume === null && ov.keyword_difficulty === null)) {
      noData.push(d);
      continue;
    }
    if (ov.search_volume !== null && ov.search_volume !== undefined && ov.search_volume < 100) lowVol.push({ d, vol: ov.search_volume });
    if (ov.keyword_difficulty !== null && ov.keyword_difficulty !== undefined && ov.keyword_difficulty > 70) highKd.push({ d, kd: ov.keyword_difficulty });
  }
  lines.push('### LOW_VOLUME (<100/mo)');
  lines.push('');
  if (lowVol.length === 0) lines.push('_None._');
  else for (const { d, vol } of lowVol) lines.push(`- #${d.id} \`${d.keyword}\` — ${fmt(vol)}/mo (${d.title})`);
  lines.push('');
  lines.push('### HIGH_KD (>70)');
  lines.push('');
  if (highKd.length === 0) lines.push('_None._');
  else for (const { d, kd } of highKd) lines.push(`- #${d.id} \`${d.keyword}\` — KD ${kd} (${d.title})`);
  lines.push('');
  lines.push('### No Overview Data Returned');
  lines.push('');
  lines.push('_DataForSEO Labs returns no row when a keyword has insufficient volume to be tracked. Treat as a soft LOW_VOLUME signal — the keyword exists in SERPs but the Labs index has no measurable search volume._');
  lines.push('');
  if (noData.length === 0) lines.push('_None._');
  else for (const d of noData) lines.push(`- #${d.id} \`${d.keyword}\` — no overview row (${d.title})`);
  lines.push('');

  lines.push('---');
  lines.push('');
  lines.push('## AI Overview Presence (Priority AEO Targets)');
  lines.push('');
  const withAio = deliverables.filter(d => serpMap.get(d.keyword)?.ai_overview?.present);
  if (withAio.length === 0) {
    lines.push('_No AI Overview detected on any of the 32 keywords._');
  } else {
    lines.push('| # | Keyword | Title | AIO Citation Domains |');
    lines.push('|---|---|---|---|');
    for (const d of withAio) {
      const refs = serpMap.get(d.keyword).ai_overview.references || [];
      const domains = [...new Set(refs.map(r => r.domain).filter(Boolean))].slice(0, 8).join(', ') || '_no citation refs returned_';
      lines.push(`| ${d.id} | \`${d.keyword}\` | ${d.title} | ${domains} |`);
    }
  }
  lines.push('');

  lines.push('---');
  lines.push('');
  lines.push('## Top 10 Organic Domains Per Keyword (Competitor Audit Input)');
  lines.push('');
  for (const d of deliverables) {
    const srp = serpMap.get(d.keyword);
    if (!srp || !srp.top_organic?.length) continue;
    lines.push(`### #${d.id} \`${d.keyword}\``);
    lines.push('');
    lines.push('| Rank | Domain | Title |');
    lines.push('|---:|---|---|');
    for (const r of srp.top_organic) {
      const title = (r.title || '').replace(/\|/g, '\\|').slice(0, 100);
      lines.push(`| ${r.rank ?? '—'} | ${r.domain ?? '—'} | ${title} |`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

(async () => {
  if (!fs.existsSync(RAW_DIR)) fs.mkdirSync(RAW_DIR, { recursive: true });
  if (!fs.existsSync(SERP_DIR)) fs.mkdirSync(SERP_DIR, { recursive: true });

  // ---------- Keyword overview (single shot, cacheable) ----------
  let overviewJson;
  const existing = !FORCE_OVERVIEW ? findExistingOverview() : null;
  if (existing) {
    console.log(`[overview] using cached ${path.relative(RAW_DIR, existing)}`);
    overviewJson = JSON.parse(fs.readFileSync(existing, 'utf8'));
    // Normalise filename: write to canonical OVERVIEW_FILE if it isn't already there.
    if (existing !== OVERVIEW_FILE) {
      fs.copyFileSync(existing, OVERVIEW_FILE);
      console.log(`[overview] copied to canonical keyword-overview.json`);
    }
  } else {
    console.log(`[overview] calling DataForSEO for ${UNIQUE_KEYWORDS.length} keywords...`);
    try {
      overviewJson = await keywordOverview(UNIQUE_KEYWORDS);
      // Persist BEFORE doing anything else.
      fs.writeFileSync(OVERVIEW_FILE, JSON.stringify(overviewJson, null, 2));
      console.log(`[overview] saved keyword-overview.json`);
    } catch (e) {
      console.error('[overview] FAILED:', e.message);
      process.exit(3);
    }
  }
  const overviewMap = summariseOverview(overviewJson);
  console.log(`[overview] rows with data: ${overviewMap.size} / ${UNIQUE_KEYWORDS.length}`);

  // ---------- SERP per keyword (cached individually) ----------
  const serpMap = new Map();
  let cached = 0;
  let called = 0;
  let failed = 0;
  for (let i = 0; i < UNIQUE_KEYWORDS.length; i++) {
    const kw = UNIQUE_KEYWORDS[i];
    const slug = slugify(kw);
    const file = path.join(SERP_DIR, `${slug}.json`);
    const isForced = FORCE_SERP_KW && FORCE_SERP_KW.toLowerCase() === kw.toLowerCase();

    if (!isForced && fs.existsSync(file)) {
      try {
        const json = JSON.parse(fs.readFileSync(file, 'utf8'));
        const summary = summariseSerp(json);
        serpMap.set(kw, summary);
        cached++;
        const aio = summary.ai_overview?.present ? ' [AIO]' : '';
        console.log(`[${i + 1}/${UNIQUE_KEYWORDS.length}] cached "${kw}"${aio}`);
        continue;
      } catch (e) {
        console.log(`[${i + 1}/${UNIQUE_KEYWORDS.length}] cache for "${kw}" unreadable, re-calling...`);
      }
    }

    process.stdout.write(`[${i + 1}/${UNIQUE_KEYWORDS.length}] SERP "${kw}" ... `);
    try {
      const json = await serpAdvanced(kw);
      // Persist immediately — paid output never lives only in memory.
      fs.writeFileSync(file, JSON.stringify(json, null, 2));
      const summary = summariseSerp(json);
      serpMap.set(kw, summary);
      called++;
      const aio = summary.ai_overview?.present ? ' [AIO]' : '';
      console.log(`ok (${(summary.features || []).length} features)${aio}`);
    } catch (e) {
      console.log(`FAIL: ${e.message}`);
      serpMap.set(kw, { error: e.message, features: [], ai_overview: null, top_organic: [] });
      failed++;
    }
    await new Promise(r => setTimeout(r, 400));
  }
  console.log(`[serp] cached: ${cached}  called: ${called}  failed: ${failed}`);

  // ---------- Markdown ----------
  const md = buildMarkdown(DELIVERABLES, overviewMap, serpMap);
  const outFile = path.join(PROJECTS_DIR, 'keyword-validation.md');
  fs.writeFileSync(outFile, md);
  console.log(`[md] wrote ${path.relative(PROJECTS_DIR, outFile)}`);

  console.log(`[done] ${new Date().toISOString()}`);
})().catch(e => {
  console.error('FATAL:', e);
  process.exit(1);
});
