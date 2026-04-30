#!/usr/bin/env node
// Analyze the 4 SERP responses for intent + AIO citations + PAA/related mining.
// Outputs structured JSON for human review and feeds the intent-summary.md.

import fs from 'node:fs';
import path from 'node:path';

const root = path.dirname(new URL(import.meta.url).pathname).replace(/^\//, '');
const serpDir = path.join(root, 'serp');
const slugs = ['ac-not-cooling', 'ac-blowing-warm-air', 'ac-won-t-turn-on', 'ac-frozen'];
const labels = {
  'ac-not-cooling': 'ac not cooling',
  'ac-blowing-warm-air': 'ac blowing warm air',
  'ac-won-t-turn-on': "ac won't turn on",
  'ac-frozen': 'ac frozen',
};

// Domain heuristics for intent classification.
const HVAC_HOME_DOMAINS = new Set([
  'carrier.com','trane.com','lennox.com','goodmanmfg.com','rheem.com','york.com',
  'angi.com','homeguide.com','hvac.com','familyhandyman.com','bobvila.com',
  'thisoldhouse.com','hgtv.com','homedepot.com','lowes.com',
  'reddit.com','quora.com','energystar.gov','pv.com',
  'service-experts.com','onehourheatandair.com','aireserv.com',
  'fixr.com','homeadvisor.com','thumbtack.com',
]);
const AUTO_AC_DOMAINS = new Set([
  'kbb.com','autozone.com','jdpower.com','repairpal.com','carmax.com',
  'edmunds.com','yourmechanic.com','firestonecompleteautocare.com',
  'aamco.com','meineke.com','jiffylube.com',
]);
const REFRIGERATION_DOMAINS = new Set([
  'whirlpool.com','ge.com','samsung.com','frigidaire.com','sub-zero.com',
]);

function classifyDomain(domain) {
  if (!domain) return 'other';
  const d = domain.toLowerCase();
  if (AUTO_AC_DOMAINS.has(d) || /\bauto\b|\bcar\b|\bvehicle\b/.test(d)) return 'automotive';
  if (REFRIGERATION_DOMAINS.has(d)) return 'refrigeration';
  if (HVAC_HOME_DOMAINS.has(d)) return 'hvac_home';
  // Heuristic for HVAC contractor / local company sites
  if (/(hvac|heating|cooling|air|comfort|climate)/.test(d)) return 'hvac_home';
  return 'other';
}

function classifyTitle(title) {
  if (!title) return null;
  const t = title.toLowerCase();
  if (/\bcar\b|\bauto\b|\bvehicle\b/.test(t)) return 'automotive';
  if (/refriger|fridge|freezer/.test(t)) return 'refrigeration';
  if (/window unit|portable ac|home ac|central air|hvac|heat pump|condens|evaporat|thermostat/.test(t)) return 'hvac_home';
  return null;
}

const NOISE_PATTERNS = /noise|noisy|sound|loud|rattl|hum|squeal|whistl|click|buzz|bang|clank|scrape|grind/i;
const AIRFLOW_PATTERNS = /no air|air flow|airflow|weak air|blowing air|vents not blowing|vents blow|low air|not blowing/i;

const results = [];
const noiseFinds = [];
const airflowFinds = [];

for (const slug of slugs) {
  const file = path.join(serpDir, `${slug}.json`);
  const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
  const cost = raw.cost ?? raw.tasks?.[0]?.cost;
  const result = raw.tasks?.[0]?.result?.[0];
  const items = result?.items || [];

  // Top 10 organic
  const organic = items.filter(i => i.type === 'organic').slice(0, 10);
  const intentClasses = organic.map(o => {
    const td = classifyTitle(o.title);
    const dd = classifyDomain(o.domain);
    return td || dd;
  });
  const intentCounts = intentClasses.reduce((acc, c) => { acc[c] = (acc[c] || 0) + 1; return acc; }, {});
  const dominant = Object.entries(intentCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'unknown';

  // AIO
  const aioItem = items.find(i => i.type === 'ai_overview');
  let aioCitations = [];
  let aioPresent = false;
  if (aioItem) {
    aioPresent = true;
    const refs = aioItem.references || (aioItem.items || []).flatMap(i => i.references || []);
    aioCitations = refs.map(r => r.domain).filter(Boolean);
  }

  // Top 3 unique citation domains
  const top3Citations = [...new Set(aioCitations)].slice(0, 3);

  // PAA mining
  const paaItem = items.find(i => i.type === 'people_also_ask');
  const paaQuestions = (paaItem?.items || []).map(p => p.title || p.question || '').filter(Boolean);

  // Related searches mining
  const relatedItem = items.find(i => i.type === 'related_searches');
  const relatedQueries = (relatedItem?.items || []).flatMap(r => r.title ? [r.title] : (Array.isArray(r) ? r : [])).filter(Boolean);
  // Some response shapes: items array of strings
  const relatedFlat = relatedItem?.items?.filter(x => typeof x === 'string') || [];

  for (const q of paaQuestions) {
    if (NOISE_PATTERNS.test(q)) noiseFinds.push({ src: `PAA:${slug}`, q });
    if (AIRFLOW_PATTERNS.test(q)) airflowFinds.push({ src: `PAA:${slug}`, q });
  }
  for (const q of [...relatedQueries, ...relatedFlat]) {
    if (NOISE_PATTERNS.test(q)) noiseFinds.push({ src: `REL:${slug}`, q });
    if (AIRFLOW_PATTERNS.test(q)) airflowFinds.push({ src: `REL:${slug}`, q });
  }

  results.push({
    keyword: labels[slug],
    cost,
    aio_present: aioPresent,
    aio_citation_count: aioCitations.length,
    aio_top3_domains: top3Citations,
    organic_top10_domains: organic.map(o => o.domain),
    intent_classification: intentCounts,
    dominant_intent: dominant,
    paa_count: paaQuestions.length,
    related_count: relatedQueries.length + relatedFlat.length,
  });
}

console.log('=== PER-KEYWORD ANALYSIS ===');
console.log(JSON.stringify(results, null, 2));
console.log('');
console.log('=== TOTAL COST ===');
const totalCost = results.reduce((s, r) => s + (r.cost || 0), 0);
console.log(`$${totalCost.toFixed(4)}`);
console.log('');
console.log('=== NOISE-RELATED PAA/RELATED FINDS ===');
console.log(JSON.stringify(noiseFinds, null, 2));
console.log('');
console.log('=== AIRFLOW-RELATED PAA/RELATED FINDS ===');
console.log(JSON.stringify(airflowFinds, null, 2));
