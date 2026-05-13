#!/usr/bin/env node
/**
 * validate-keywords.js — full keyword validation pipeline for AEO/SEO content planning.
 *
 * Combines keyword-overview + serp-advanced for a list of deliverables (e.g. a
 * cluster map) and produces a single markdown table with volume, KD, intent,
 * SERP features, AI Overview presence, AIO citation domains, and the top-10
 * organic competitors per keyword.
 *
 * Idempotent — every paid call is persisted per-keyword. Re-runs reuse cached
 * data unless --force.
 *
 * Usage:
 *   node validate-keywords.js --input cluster-map.json --output-dir projects/
 *   node validate-keywords.js --keywords "frac plug,wireline" --output-dir projects/
 *
 * --input format:
 *   [
 *     { "id": 1, "cluster": "Cluster A", "type": "pillar", "title": "...", "keyword": "frac plug" },
 *     ...
 *   ]
 *
 *   Or a flat list of keyword strings.
 *
 * Options:
 *   --input <path>            JSON file: array of deliverables OR array of keyword strings
 *   --keywords <csv>          Inline keyword list (alternative to --input)
 *   --keywords-file <path>    Newline-separated keyword list
 *   --output-dir <path>       Default "projects/tool-dataforseo/"
 *   --output-name <str>       Markdown filename stem (default "keyword-validation")
 *   --location-code <int>     Default 2840
 *   --language-code <str>     Default "en"
 *   --force                   Re-call API even if cached
 *   --env <path>              Path to .env
 *   --delay-ms <int>          Inter-SERP-request delay (default 400)
 *
 * Output:
 *   {output-dir}/raw/keyword-overview.json    — overview snapshot
 *   {output-dir}/raw/serp/{slug}.json         — one file per keyword
 *   {output-dir}/{output-name}.md             — combined validation table
 *
 * Cost: roughly $0.0001/keyword (overview) + $0.002–$0.003/keyword (SERP).
 * 50 keywords ≈ $0.10–$0.15.
 */

const fs = require('fs');
const path = require('path');
const {
  DEFAULT_LOCATION_CODE,
  DEFAULT_LANGUAGE_CODE,
  getCredentials,
  keywordOverview,
  serpOrganicAdvanced,
  summariseOverview,
  summariseSerp,
  slugify,
  ensureDir,
  parseArgs,
  readKeywordList,
} = require('./lib/client');

function loadDeliverables(args) {
  if (args.input) {
    const raw = JSON.parse(fs.readFileSync(args.input, 'utf8'));
    if (!Array.isArray(raw)) throw new Error('--input must be a JSON array');
    if (raw.length === 0) throw new Error('--input array is empty');
    if (typeof raw[0] === 'string') {
      return raw.map((kw, i) => ({ id: i + 1, cluster: 'All', type: 'item', title: kw, keyword: kw }));
    }
    return raw.map((d, i) => ({
      id: d.id ?? i + 1,
      cluster: d.cluster || 'All',
      type: d.type || 'item',
      title: d.title || d.keyword,
      keyword: d.keyword,
    }));
  }
  const list = readKeywordList(args);
  if (list && list.length > 0) {
    return list.map((kw, i) => ({ id: i + 1, cluster: 'All', type: 'item', title: kw, keyword: kw }));
  }
  return null;
}

const fmt = (n) => (n === null || n === undefined) ? '—' : (typeof n === 'number' ? n.toLocaleString() : String(n));

function buildMarkdown({ deliverables, overviewMap, serpMap, locationCode, languageCode }) {
  const uniqueKeywords = [...new Set(deliverables.map(d => d.keyword))];
  const lines = [];
  lines.push('# Keyword Validation');
  lines.push('');
  lines.push('**Source:** DataForSEO Labs Google Keyword Overview + SERP Organic Live Advanced');
  lines.push(`**Location:** ${locationCode}  **Language:** ${languageCode}`);
  lines.push(`**Run date:** ${new Date().toISOString().slice(0, 10)}`);
  lines.push(`**Total deliverables:** ${deliverables.length}`);
  lines.push(`**Unique keywords queried:** ${uniqueKeywords.length}`);
  lines.push('');
  lines.push('## Validation Flags');
  lines.push('');
  lines.push('- `LOW_VOLUME` — search volume under 100/month');
  lines.push('- `HIGH_KD` — keyword difficulty above 70');
  lines.push('- `AIO_PRESENT` — AI Overview present in SERP');
  lines.push('');

  // Group by cluster (preserve order of first appearance).
  const clusterOrder = [];
  const byCluster = new Map();
  for (const d of deliverables) {
    if (!byCluster.has(d.cluster)) { clusterOrder.push(d.cluster); byCluster.set(d.cluster, []); }
    byCluster.get(d.cluster).push(d);
  }

  for (const cluster of clusterOrder) {
    lines.push(`## ${cluster}`);
    lines.push('');
    lines.push('| # | Type | Title | Keyword | Volume | KD | Competition | Intent | SERP Features | AIO | Flags |');
    lines.push('|---|---|---|---|---:|---:|---|---|---|:---:|---|');
    for (const d of byCluster.get(cluster)) {
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

  // Flagged sections.
  lines.push('## Flagged for Discussion');
  lines.push('');
  const lowVol = [], highKd = [], noData = [];
  for (const d of deliverables) {
    const ov = overviewMap.get(d.keyword);
    if (!ov || (ov.search_volume === null && ov.keyword_difficulty === null)) { noData.push(d); continue; }
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
  if (noData.length === 0) lines.push('_None._');
  else for (const d of noData) lines.push(`- #${d.id} \`${d.keyword}\` — no overview row (${d.title})`);
  lines.push('');

  // AIO presence.
  lines.push('## AI Overview Presence');
  lines.push('');
  const withAio = deliverables.filter(d => serpMap.get(d.keyword)?.ai_overview?.present);
  if (withAio.length === 0) {
    lines.push('_No AI Overview detected._');
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

  // Top organic per keyword.
  lines.push('## Top Organic Domains Per Keyword');
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
  const args = parseArgs(process.argv);
  const deliverables = loadDeliverables(args);
  if (!deliverables) {
    console.error('ERROR: provide --input <json>, --keywords "k1,k2,...", or --keywords-file <path>');
    process.exit(2);
  }

  const locationCode = parseInt(args['location-code'] || DEFAULT_LOCATION_CODE, 10);
  const languageCode = args['language-code'] || DEFAULT_LANGUAGE_CODE;
  const outputDir = path.resolve(args['output-dir'] || 'projects/tool-dataforseo');
  const outputName = args['output-name'] || 'keyword-validation';
  const force = !!args.force;
  const delayMs = parseInt(args['delay-ms'] || 400, 10);

  const rawDir = path.join(outputDir, 'raw');
  const serpDir = path.join(rawDir, 'serp');
  ensureDir(outputDir);
  ensureDir(rawDir);
  ensureDir(serpDir);

  const uniqueKeywords = [...new Set(deliverables.map(d => d.keyword))];
  let creds = null;
  const overviewFile = path.join(rawDir, 'keyword-overview.json');

  // ---------- Overview ----------
  let overviewJson;
  if (!force && fs.existsSync(overviewFile)) {
    console.log(`[overview] using cached ${path.relative(process.cwd(), overviewFile)}`);
    overviewJson = JSON.parse(fs.readFileSync(overviewFile, 'utf8'));
  } else {
    try { creds = getCredentials({ envPath: args.env }); }
    catch (e) { console.error('ERROR:', e.message); process.exit(2); }
    console.log(`[overview] calling DataForSEO for ${uniqueKeywords.length} keywords...`);
    try {
      overviewJson = await keywordOverview(uniqueKeywords, { locationCode, languageCode, creds });
    } catch (e) {
      console.error('[overview] FAILED:', e.message);
      process.exit(3);
    }
    fs.writeFileSync(overviewFile, JSON.stringify(overviewJson, null, 2));
    console.log(`[overview] saved keyword-overview.json`);
  }
  const overviewMap = summariseOverview(overviewJson);
  console.log(`[overview] rows with data: ${overviewMap.size} / ${uniqueKeywords.length}`);

  // ---------- SERP per keyword ----------
  const serpMap = new Map();
  let cached = 0, called = 0, failed = 0;
  for (let i = 0; i < uniqueKeywords.length; i++) {
    const kw = uniqueKeywords[i];
    const file = path.join(serpDir, `${slugify(kw)}.json`);

    if (!force && fs.existsSync(file)) {
      try {
        const json = JSON.parse(fs.readFileSync(file, 'utf8'));
        const summary = summariseSerp(json);
        serpMap.set(kw, summary);
        cached++;
        const aio = summary.ai_overview?.present ? ' [AIO]' : '';
        console.log(`[${i + 1}/${uniqueKeywords.length}] cached "${kw}"${aio}`);
        continue;
      } catch (e) {
        console.log(`[${i + 1}/${uniqueKeywords.length}] cache for "${kw}" unreadable, re-calling...`);
      }
    }

    if (!creds) {
      try { creds = getCredentials({ envPath: args.env }); }
      catch (e) { console.error('ERROR:', e.message); process.exit(2); }
    }

    process.stdout.write(`[${i + 1}/${uniqueKeywords.length}] SERP "${kw}" ... `);
    try {
      const json = await serpOrganicAdvanced(kw, { locationCode, languageCode, creds });
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
    if (i < uniqueKeywords.length - 1) await new Promise(r => setTimeout(r, delayMs));
  }
  console.log(`[serp] cached: ${cached}  called: ${called}  failed: ${failed}`);

  const md = buildMarkdown({ deliverables, overviewMap, serpMap, locationCode, languageCode });
  const mdPath = path.join(outputDir, `${outputName}.md`);
  fs.writeFileSync(mdPath, md);
  console.log(`[md] wrote ${path.relative(process.cwd(), mdPath)}`);
  console.log(`[done] ${new Date().toISOString()}`);
})().catch(e => {
  console.error('FATAL:', e);
  process.exit(1);
});
