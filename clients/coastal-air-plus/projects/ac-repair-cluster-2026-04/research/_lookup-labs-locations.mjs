#!/usr/bin/env node
// One-shot helper: find valid DataForSEO Labs location codes for SC entries.
// Free endpoint (/v3/dataforseo_labs/locations_and_languages), no charge.

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { getCredentials } = require('../../../../../.claude/skills/tool-dataforseo/scripts/lib/client.js');

const creds = getCredentials();
const auth = 'Basic ' + Buffer.from(`${creds.login}:${creds.password}`).toString('base64');

const res = await fetch('https://api.dataforseo.com/v3/dataforseo_labs/locations_and_languages', {
  headers: { Authorization: auth },
});
const json = await res.json();

if (json.status_code !== 20000) {
  console.error(`API status ${json.status_code}: ${json.status_message}`);
  process.exit(1);
}

const all = json.tasks?.[0]?.result || [];
const sc = all.filter(l =>
  /south carolina/i.test(l.location_name) ||
  /charleston|summerville/i.test(l.location_name)
);

console.log(`Total Labs locations: ${all.length}`);
console.log(`SC / Charleston / Summerville matches: ${sc.length}`);
console.log('---');
for (const m of sc) {
  console.log(`${m.location_code}\t${m.location_type}\t${m.location_name}`);
}

console.log('---');
const us = all.find(l => l.location_code === 2840);
console.log(`US baseline: ${us ? `${us.location_code}\t${us.location_type}\t${us.location_name}` : '(not found)'}`);
