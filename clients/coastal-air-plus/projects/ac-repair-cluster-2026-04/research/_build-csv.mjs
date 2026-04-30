#!/usr/bin/env node
// Build keyword-validation CSV from the saved keyword-overview-us.json.
// Queried at US national (2840). The "location" column tracks cluster-cohort
// geo (Both / Charleston / Summerville), not queried geo — see NOTES.md for
// the cohort-vs-queried distinction.

import fs from 'node:fs';
import path from 'node:path';

const root = path.dirname(new URL(import.meta.url).pathname).replace(/^\//, '');
const inputJson = path.join(root, 'keyword-overview-us.json');
const outputCsv = path.join(root, 'keyword-validation-2026-04-30.csv');

const cohorts = [
  { geo: 'Both', keywords: [
    'ac not cooling', 'ac blowing warm air', 'ac frozen', 'ac leaking water',
    'ac making strange noises', 'ac short cycling', "ac won't turn on",
    'ac running but no air from vents',
    'trane ac repair', 'carrier ac repair', 'goodman ac repair',
    'lennox ac repair', 'rheem ac repair', 'york ac repair',
  ]},
  { geo: 'Summerville', keywords: [
    'ac repair cane bay', 'ac repair nexton', 'ac repair summers corner',
    'ac repair wescott plantation', 'ac repair knightsville',
    'ac repair carnes crossroads', 'ac repair historic downtown summerville',
  ]},
  { geo: 'Charleston', keywords: [
    'ac repair mount pleasant sc', 'ac repair daniel island',
    'ac repair james island', 'ac repair west ashley',
    'ac repair johns island', 'ac repair north charleston',
  ]},
];

const raw = JSON.parse(fs.readFileSync(inputJson, 'utf8'));
const items = raw?.tasks?.[0]?.result?.[0]?.items || [];
const map = new Map();
for (const it of items) {
  map.set(it.keyword, {
    sv: it.keyword_info?.search_volume ?? '',
    cpc: it.keyword_info?.cpc ?? '',
    comp: it.keyword_info?.competition_level ?? '',
    kd: it.keyword_properties?.keyword_difficulty ?? '',
  });
}

const csvEscape = (v) => {
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const rows = [['keyword','location','search_volume','cpc','competition','keyword_difficulty']];
let zeroCount = 0;
for (const cohort of cohorts) {
  for (const kw of cohort.keywords) {
    const r = map.get(kw);
    if (!r) {
      zeroCount++;
      rows.push([kw, cohort.geo, '', '', '', '']);
    } else {
      rows.push([kw, cohort.geo, r.sv, r.cpc, r.comp, r.kd]);
    }
  }
}

fs.writeFileSync(outputCsv, rows.map(r => r.map(csvEscape).join(',')).join('\n') + '\n');
console.log(`Wrote ${outputCsv}`);
console.log(`Total rows: ${rows.length - 1}, with data: ${rows.length - 1 - zeroCount}, no measurable volume: ${zeroCount}`);
console.log(`API cost: $${raw.cost} (top-level), $${raw.tasks[0].cost} (task)`);
