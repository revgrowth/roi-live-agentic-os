#!/usr/bin/env node
// Fetch the 2 candidate batch-3 spoke URLs via Firecrawl /v2/scrape.
// Saves snapshots into the same live-spoke-snapshots/ folder used in batch 2.
// Patterned on _fetch-live-spokes.mjs (batch 2).

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { loadEnv } = require('../../../../../.claude/skills/tool-dataforseo/scripts/lib/client.js');

const env = loadEnv();
const apiKey = process.env.FIRECRAWL_API_KEY || env.FIRECRAWL_API_KEY;
if (!apiKey) {
  console.error('FIRECRAWL_API_KEY missing from .env');
  process.exit(1);
}

const root = path.dirname(new URL(import.meta.url).pathname).replace(/^\//, '');
const outDir = path.join(root, 'live-spoke-snapshots');
fs.mkdirSync(outDir, { recursive: true });

const today = '2026-05-12';

const targets = [
  { url: 'https://coastalcarolinahvac.com/blog/ac-making-noise/', slug: 'ac-making-noise', role: 'target' },
  { url: 'https://coastalcarolinahvac.com/blog/ac-running-not-cooling/', slug: 'ac-running-not-cooling', role: 'target' },
];

for (const t of targets) {
  console.log(`Fetching ${t.url}...`);
  const res = await fetch('https://api.firecrawl.dev/v2/scrape', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url: t.url,
      formats: ['markdown', 'html', 'rawHtml', 'links'],
      onlyMainContent: false,
      timeout: 30000,
      removeBase64Images: true,
    }),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    console.error(`FAIL ${t.url}: HTTP ${res.status}`, JSON.stringify(json).slice(0, 500));
    continue;
  }

  const data = json.data || {};
  const meta = data.metadata || {};
  const md = data.markdown || '';
  const html = data.html || '';
  const rawHtml = data.rawHtml || '';
  const links = data.links || [];

  const out = [];
  out.push(`# Live Fetch: ${t.url}`);
  out.push('');
  out.push(`**Role:** ${t.role}`);
  out.push(`**Fetched:** ${today} via Firecrawl /v2/scrape`);
  out.push(`**HTTP status:** ${meta.statusCode || 'n/a'}`);
  out.push('');
  out.push('## Metadata');
  out.push('');
  out.push('```json');
  out.push(JSON.stringify({
    title: meta.title,
    description: meta.description,
    ogTitle: meta.ogTitle,
    ogDescription: meta.ogDescription,
    ogImage: meta.ogImage,
    canonical: meta.canonical || meta['og:url'],
    language: meta.language,
    sourceURL: meta.sourceURL,
    modifiedTime: meta['article:modified_time'] || meta.modifiedTime,
    publishedTime: meta['article:published_time'] || meta.publishedTime,
    author: meta['article:author'] || meta.author,
  }, null, 2));
  out.push('```');
  out.push('');

  const schemaSource = rawHtml || html;
  const schemaMatches = schemaSource.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || [];
  out.push(`## JSON-LD schema blocks detected: ${schemaMatches.length}`);
  out.push('');
  if (schemaMatches.length > 0) {
    schemaMatches.forEach((m, i) => {
      const inner = m.replace(/<script[^>]*>/, '').replace(/<\/script>/, '').trim();
      out.push(`### Schema block ${i + 1}`);
      out.push('');
      out.push('```json');
      try {
        out.push(JSON.stringify(JSON.parse(inner), null, 2));
      } catch (e) {
        out.push(inner.slice(0, 4000));
      }
      out.push('```');
      out.push('');
    });
  }

  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
  const h2s = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
  const h3s = [...html.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
  out.push('## Heading outline');
  out.push('');
  out.push(`**H1 (${h1s.length}):**`);
  h1s.forEach(h => out.push(`- ${h}`));
  out.push('');
  out.push(`**H2 (${h2s.length}):**`);
  h2s.forEach(h => out.push(`- ${h}`));
  out.push('');
  out.push(`**H3 (${h3s.length}):**`);
  h3s.forEach(h => out.push(`- ${h}`));
  out.push('');

  const phoneMatches = [...new Set((md.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g) || []))];
  out.push(`## Phone numbers in body (deduped): ${phoneMatches.length}`);
  phoneMatches.forEach(p => out.push(`- ${p}`));
  out.push('');

  const wordCount = md.split(/\s+/).filter(Boolean).length;
  out.push(`## Word count (markdown body, rough): ${wordCount}`);
  out.push('');

  out.push('## Markdown content (full)');
  out.push('');
  out.push(md);

  const outFile = path.join(outDir, `${t.slug}-fetched-${today}.md`);
  fs.writeFileSync(outFile, out.join('\n'));
  console.log(`Saved ${outFile}`);
  console.log(`  H1=${h1s.length} H2=${h2s.length} H3=${h3s.length} schemas=${schemaMatches.length} words=${wordCount} phones=${phoneMatches.length}`);
}
