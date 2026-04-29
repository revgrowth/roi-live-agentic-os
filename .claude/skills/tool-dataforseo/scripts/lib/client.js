// Minimal DataForSEO HTTP client + .env loader. Shared by the three scripts in
// .claude/skills/tool-dataforseo/scripts/. Zero npm dependencies — uses Node 18+
// native fetch, fs, and path.

const fs = require('fs');
const path = require('path');

const DEFAULT_LOCATION_CODE = 2840; // United States
const DEFAULT_LANGUAGE_CODE = 'en';
const DEFAULT_BASE = 'https://api.dataforseo.com/v3';

function findEnvFile(startDir) {
  // Walk up from startDir looking for .env. Stop at filesystem root.
  let dir = path.resolve(startDir);
  for (let i = 0; i < 10; i++) {
    const candidate = path.join(dir, '.env');
    if (fs.existsSync(candidate)) return candidate;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

function loadEnv(envPath) {
  const file = envPath || findEnvFile(process.cwd()) || findEnvFile(__dirname);
  if (!file) throw new Error('Could not locate .env file. Pass --env <path> or set DATAFORSEO_LOGIN / DATAFORSEO_PASSWORD in the environment.');
  const content = fs.readFileSync(file, 'utf8');
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

function getCredentials({ envPath } = {}) {
  // Prefer process.env so callers can override; fall back to .env file.
  let login = process.env.DATAFORSEO_LOGIN;
  let password = process.env.DATAFORSEO_PASSWORD;
  if (!login || !password) {
    const env = loadEnv(envPath);
    login = login || env.DATAFORSEO_LOGIN;
    password = password || env.DATAFORSEO_PASSWORD;
  }
  if (!login || !password || login.includes('your-email') || password.includes('your-api-password')) {
    throw new Error('DATAFORSEO_LOGIN / DATAFORSEO_PASSWORD missing or unset. Add them to your .env file (see .env.example).');
  }
  return { login, password };
}

function authHeader(login, password) {
  return 'Basic ' + Buffer.from(`${login}:${password}`).toString('base64');
}

async function call(endpoint, body, { login, password, base = DEFAULT_BASE } = {}) {
  const res = await fetch(`${base}/${endpoint}`, {
    method: 'POST',
    headers: { 'Authorization': authHeader(login, password), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${JSON.stringify(json).slice(0, 500)}`);
  }
  if (json.status_code !== 20000) {
    throw new Error(`API status ${json.status_code}: ${json.status_message}`);
  }
  return json;
}

async function keywordOverview(keywords, opts = {}) {
  const body = [{
    keywords,
    location_code: opts.locationCode ?? DEFAULT_LOCATION_CODE,
    language_code: opts.languageCode ?? DEFAULT_LANGUAGE_CODE,
    include_serp_info: !!opts.includeSerpInfo,
    include_clickstream_data: !!opts.includeClickstream,
  }];
  return call('dataforseo_labs/google/keyword_overview/live', body, opts.creds);
}

async function serpOrganicAdvanced(keyword, opts = {}) {
  const body = [{
    keyword,
    location_code: opts.locationCode ?? DEFAULT_LOCATION_CODE,
    language_code: opts.languageCode ?? DEFAULT_LANGUAGE_CODE,
    device: opts.device ?? 'desktop',
    os: opts.os ?? 'windows',
    depth: opts.depth ?? 20,
    load_async_ai_overview: opts.loadAsyncAiOverview ?? true,
  }];
  return call('serp/google/organic/live/advanced', body, opts.creds);
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
      const refs = item.references || (item.items?.flatMap(i => i.references || i.links || [])) || [];
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

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith('--')) {
        args[key] = true;
      } else {
        args[key] = next;
        i++;
      }
    } else {
      args._.push(a);
    }
  }
  return args;
}

function readKeywordList(args) {
  if (args.keywords) {
    return args.keywords.split(',').map(s => s.trim()).filter(Boolean);
  }
  if (args['keywords-file']) {
    const txt = fs.readFileSync(args['keywords-file'], 'utf8');
    return txt.split(/\r?\n/).map(s => s.trim()).filter(s => s && !s.startsWith('#'));
  }
  return null;
}

module.exports = {
  DEFAULT_LOCATION_CODE,
  DEFAULT_LANGUAGE_CODE,
  loadEnv,
  getCredentials,
  call,
  keywordOverview,
  serpOrganicAdvanced,
  summariseOverview,
  summariseSerp,
  slugify,
  ensureDir,
  parseArgs,
  readKeywordList,
};
