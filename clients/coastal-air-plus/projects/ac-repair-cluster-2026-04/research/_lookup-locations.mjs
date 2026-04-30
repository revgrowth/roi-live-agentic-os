#!/usr/bin/env node
// One-shot helper: find DataForSEO location codes for Charleston, SC and
// Summerville, SC. Free endpoint (/v3/serp/google/locations), no charge.
// Run from repo root:
//   node clients/coastal-air-plus/projects/ac-repair-cluster-2026-04/research/_lookup-locations.mjs

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { getCredentials } = require('../../../../../.claude/skills/tool-dataforseo/scripts/lib/client.js');

const creds = getCredentials();
const auth = 'Basic ' + Buffer.from(`${creds.login}:${creds.password}`).toString('base64');

const res = await fetch('https://api.dataforseo.com/v3/serp/google/locations', {
  headers: { Authorization: auth },
});
const json = await res.json();

if (json.status_code !== 20000) {
  console.error(`API status ${json.status_code}: ${json.status_message}`);
  process.exit(1);
}

const all = json.tasks?.[0]?.result || [];
const sc = all.filter(l =>
  /,\s*South Carolina,?\s*United States/i.test(l.location_name) ||
  /^South Carolina,/i.test(l.location_name)
);

const matches = sc.filter(l =>
  /charleston|summerville|north charleston/i.test(l.location_name)
);

console.log(`Total SC locations: ${sc.length}`);
console.log(`Charleston / Summerville matches: ${matches.length}`);
console.log('---');
for (const m of matches) {
  console.log(`${m.location_code}\t${m.location_type}\t${m.location_name}`);
}
