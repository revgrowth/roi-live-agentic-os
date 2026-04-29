#!/usr/bin/env node
/**
 * keyword-overview.js — bulk keyword research via DataForSEO Labs.
 *
 * Pulls search volume, keyword difficulty, competition, CPC, and search intent
 * for a list of keywords. Single API call (DataForSEO Labs supports up to 1000
 * keywords per task).
 *
 * Usage:
 *   node keyword-overview.js --keywords "frac plug,wireline,perforating gun"
 *   node keyword-overview.js --keywords-file path/to/keywords.txt
 *   node keyword-overview.js --keywords "frac plug" --location-code 2840 --language-code en
 *
 * Options:
 *   --keywords <csv>          Comma-separated keyword list (mutually exclusive with --keywords-file)
 *   --keywords-file <path>    Newline-separated keyword list (# lines ignored)
 *   --location-code <int>     Default 2840 (United States)
 *   --language-code <str>     Default "en"
 *   --output-dir <path>       Default "projects/tool-dataforseo/"
 *   --output-name <str>       Filename stem (default "keyword-overview")
 *   --force                   Re-call API even if cached file exists
 *   --env <path>              Path to .env (auto-discovered if omitted)
 *
 * Output:
 *   {output-dir}/{output-name}.json         — raw DataForSEO response
 *   {output-dir}/{output-name}.md           — human-readable table
 *
 * Cost: ~$0.0001 per keyword. 100 keywords ≈ $0.01.
 */

const fs = require('fs');
const path = require('path');
const {
  DEFAULT_LOCATION_CODE,
  DEFAULT_LANGUAGE_CODE,
  getCredentials,
  keywordOverview,
  summariseOverview,
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
  const outputDir = path.resolve(args['output-dir'] || 'projects/tool-dataforseo');
  const outputName = args['output-name'] || 'keyword-overview';
  const force = !!args.force;

  ensureDir(outputDir);
  const jsonPath = path.join(outputDir, `${outputName}.json`);
  const mdPath = path.join(outputDir, `${outputName}.md`);

  let raw;
  if (!force && fs.existsSync(jsonPath)) {
    console.log(`[overview] using cached ${path.relative(process.cwd(), jsonPath)}`);
    raw = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  } else {
    let creds;
    try { creds = getCredentials({ envPath: args.env }); }
    catch (e) { console.error('ERROR:', e.message); process.exit(2); }

    console.log(`[overview] calling DataForSEO for ${keywords.length} keywords...`);
    try {
      raw = await keywordOverview(keywords, { locationCode, languageCode, creds });
    } catch (e) {
      console.error('[overview] FAILED:', e.message);
      process.exit(3);
    }
    fs.writeFileSync(jsonPath, JSON.stringify(raw, null, 2));
    console.log(`[overview] saved ${path.relative(process.cwd(), jsonPath)}`);
  }

  const map = summariseOverview(raw);
  console.log(`[overview] rows with data: ${map.size} / ${keywords.length}`);

  // Markdown table.
  const fmt = (n) => (n === null || n === undefined) ? '—' : (typeof n === 'number' ? n.toLocaleString() : String(n));
  const lines = [];
  lines.push(`# Keyword Overview`);
  lines.push('');
  lines.push(`**Source:** DataForSEO Labs Google Keyword Overview Live`);
  lines.push(`**Location:** ${locationCode}`);
  lines.push(`**Language:** ${languageCode}`);
  lines.push(`**Run date:** ${new Date().toISOString().slice(0, 10)}`);
  lines.push(`**Keywords queried:** ${keywords.length}`);
  lines.push(`**Rows returned:** ${map.size}`);
  lines.push('');
  lines.push('| Keyword | Volume | KD | Competition | CPC | Intent |');
  lines.push('|---|---:|---:|---|---:|---|');
  for (const kw of keywords) {
    const r = map.get(kw);
    if (!r) {
      lines.push(`| \`${kw}\` | — | — | — | — | _no data_ |`);
      continue;
    }
    lines.push(`| \`${kw}\` | ${fmt(r.search_volume)} | ${fmt(r.keyword_difficulty)} | ${r.competition_level || '—'} | ${fmt(r.cpc)} | ${r.main_intent || '—'} |`);
  }
  lines.push('');

  fs.writeFileSync(mdPath, lines.join('\n'));
  console.log(`[overview] wrote ${path.relative(process.cwd(), mdPath)}`);
})().catch(e => {
  console.error('FATAL:', e);
  process.exit(1);
});
