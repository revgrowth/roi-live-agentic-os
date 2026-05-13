#!/usr/bin/env node
/**
 * serp-advanced.js — SERP Organic Live Advanced for one or more keywords.
 *
 * For each keyword: pulls Google SERP with all rich-feature metadata (AI Overview,
 * featured snippet, video, PAA, knowledge graph, etc.), top organic results, and
 * AI Overview citation domains.
 *
 * Each keyword's raw response is persisted IMMEDIATELY to disk so a mid-run
 * crash cannot vaporise paid output. Re-runs skip cached files unless --force.
 *
 * Usage:
 *   node serp-advanced.js --keywords "frac plug"
 *   node serp-advanced.js --keywords "frac plug,wireline,bridge plug"
 *   node serp-advanced.js --keywords-file keywords.txt --output-dir projects/raw/serp/
 *
 * Options:
 *   --keywords <csv>          Comma-separated keyword list
 *   --keywords-file <path>    Newline-separated keyword list (# lines ignored)
 *   --location-code <int>     Default 2840 (United States)
 *   --language-code <str>     Default "en"
 *   --device <str>            Default "desktop"
 *   --depth <int>             Default 20 (organic results to fetch)
 *   --output-dir <path>       Default "projects/tool-dataforseo/serp/"
 *   --force                   Re-call API even if cached files exist
 *   --no-aio                  Disable async AI Overview fetch (faster, less data)
 *   --env <path>              Path to .env
 *   --delay-ms <int>          Inter-request delay (default 400)
 *
 * Output:
 *   {output-dir}/{slug}.json   — one file per keyword (raw response)
 *   {output-dir}/summary.md    — human-readable feature + AIO summary
 *
 * Cost: ~$0.002–$0.003 per keyword. AI Overview async adds latency, no extra cost.
 */

const fs = require('fs');
const path = require('path');
const {
  DEFAULT_LOCATION_CODE,
  DEFAULT_LANGUAGE_CODE,
  getCredentials,
  serpOrganicAdvanced,
  summariseSerp,
  slugify,
  ensureDir,
  parseArgs,
  readKeywordList,
} = require('./lib/client');

(async () => {
  const args = parseArgs(process.argv);
  const keywords = readKeywordList(args);
  if (!keywords || keywords.length === 0) {
    console.error('ERROR: provide --keywords "k1,k2,..." or --keywords-file <path>');
    process.exit(2);
  }

  const locationCode = parseInt(args['location-code'] || DEFAULT_LOCATION_CODE, 10);
  const languageCode = args['language-code'] || DEFAULT_LANGUAGE_CODE;
  const device = args.device || 'desktop';
  const depth = parseInt(args.depth || 20, 10);
  const loadAsyncAiOverview = !args['no-aio'];
  const outputDir = path.resolve(args['output-dir'] || 'projects/tool-dataforseo/serp');
  const force = !!args.force;
  const delayMs = parseInt(args['delay-ms'] || 400, 10);

  ensureDir(outputDir);

  let creds = null;
  const summaries = new Map();
  let cached = 0, called = 0, failed = 0;

  for (let i = 0; i < keywords.length; i++) {
    const kw = keywords[i];
    const file = path.join(outputDir, `${slugify(kw)}.json`);

    if (!force && fs.existsSync(file)) {
      try {
        const json = JSON.parse(fs.readFileSync(file, 'utf8'));
        const summary = summariseSerp(json);
        summaries.set(kw, summary);
        cached++;
        const aio = summary.ai_overview?.present ? ' [AIO]' : '';
        console.log(`[${i + 1}/${keywords.length}] cached "${kw}"${aio}`);
        continue;
      } catch (e) {
        console.log(`[${i + 1}/${keywords.length}] cache for "${kw}" unreadable, re-calling...`);
      }
    }

    if (!creds) {
      try { creds = getCredentials({ envPath: args.env }); }
      catch (e) { console.error('ERROR:', e.message); process.exit(2); }
    }

    process.stdout.write(`[${i + 1}/${keywords.length}] SERP "${kw}" ... `);
    try {
      const json = await serpOrganicAdvanced(kw, { locationCode, languageCode, device, depth, loadAsyncAiOverview, creds });
      // Persist immediately.
      fs.writeFileSync(file, JSON.stringify(json, null, 2));
      const summary = summariseSerp(json);
      summaries.set(kw, summary);
      called++;
      const aio = summary.ai_overview?.present ? ' [AIO]' : '';
      console.log(`ok (${(summary.features || []).length} features)${aio}`);
    } catch (e) {
      console.log(`FAIL: ${e.message}`);
      summaries.set(kw, { error: e.message, features: [], ai_overview: null, top_organic: [] });
      failed++;
    }
    if (i < keywords.length - 1) await new Promise(r => setTimeout(r, delayMs));
  }
  console.log(`[serp] cached: ${cached}  called: ${called}  failed: ${failed}`);

  // Summary markdown.
  const lines = [];
  lines.push('# SERP Organic Advanced — Summary');
  lines.push('');
  lines.push(`**Source:** DataForSEO SERP Google Organic Live Advanced`);
  lines.push(`**Location:** ${locationCode}  **Language:** ${languageCode}  **Device:** ${device}`);
  lines.push(`**Run date:** ${new Date().toISOString().slice(0, 10)}`);
  lines.push(`**Keywords queried:** ${keywords.length}`);
  lines.push('');
  lines.push('| Keyword | Features | AIO | Top Domains (1–5) |');
  lines.push('|---|---|:---:|---|');
  for (const kw of keywords) {
    const s = summaries.get(kw) || {};
    const features = (s.features || []).filter(f => f !== 'organic').join(', ') || '—';
    const aio = s.ai_overview?.present ? 'YES' : '—';
    const top = (s.top_organic || []).slice(0, 5).map(r => r.domain).filter(Boolean).join(', ') || '—';
    lines.push(`| \`${kw}\` | ${features} | ${aio} | ${top} |`);
  }
  lines.push('');

  // AIO citation roll-up.
  const withAio = keywords.filter(kw => summaries.get(kw)?.ai_overview?.present);
  if (withAio.length > 0) {
    lines.push('## AI Overview Citations');
    lines.push('');
    lines.push('| Keyword | Citation Domains |');
    lines.push('|---|---|');
    for (const kw of withAio) {
      const refs = summaries.get(kw).ai_overview.references || [];
      const domains = [...new Set(refs.map(r => r.domain).filter(Boolean))].slice(0, 10).join(', ') || '_no citation refs returned_';
      lines.push(`| \`${kw}\` | ${domains} |`);
    }
    lines.push('');
  }

  const mdPath = path.join(outputDir, 'summary.md');
  fs.writeFileSync(mdPath, lines.join('\n'));
  console.log(`[serp] wrote ${path.relative(process.cwd(), mdPath)}`);
})().catch(e => {
  console.error('FATAL:', e);
  process.exit(1);
});
