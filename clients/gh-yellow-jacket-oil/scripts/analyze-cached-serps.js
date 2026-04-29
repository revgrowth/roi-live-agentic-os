#!/usr/bin/env node
/**
 * analyze-cached-serps.js — produce competitor audit + AEO opportunity map from
 * cached DataForSEO SERP responses. Pure file processing — no API calls.
 *
 * Reads:
 *   projects/cluster-map.json
 *   projects/raw/serp/{slug}.json   (one per unique keyword)
 *
 * Writes:
 *   projects/competitor-audit.md
 *   projects/aeo-opportunity-map.md
 *
 * Re-run anytime the cached SERP data is refreshed (e.g. after the monthly cron).
 *
 * Usage: node scripts/analyze-cached-serps.js [--input <path>] [--serp-dir <path>] [--output-dir <path>]
 */

const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith('--')) args[key] = true;
      else { args[key] = next; i++; }
    }
  }
  return args;
}

const args = parseArgs(process.argv);
const PROJECTS_DIR = path.resolve(__dirname, '..', 'projects');
const INPUT = path.resolve(args.input || path.join(PROJECTS_DIR, 'cluster-map.json'));
const SERP_DIR = path.resolve(args['serp-dir'] || path.join(PROJECTS_DIR, 'raw', 'serp'));
const OUT_DIR = path.resolve(args['output-dir'] || PROJECTS_DIR);

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const stripWww = (d) => (d || '').toLowerCase().replace(/^www\./, '');

// Competitors to audit. Match on root domain after stripping www. The display
// name is what shows up in markdown; the domains array catches all known
// corporate variants for that competitor.
const COMPETITORS = [
  { name: 'WellBoss',         domains: ['wellboss.com'] },
  { name: 'Repeat Precision', domains: ['repeatprecision.com'] },
  { name: 'DynaEnergetics',   domains: ['dynaenergetics.com'] },
  { name: 'Hunting Titan',    domains: ['huntingplc.com', 'hunting-intl.com'] },
];
const GH_DOMAIN = 'ghdiv.com';

// Substring patterns that indicate the AIO is interpreting the keyword for a
// non-oilfield audience. If a meaningful share of the citation domains match
// these patterns, the keyword is flagged as INTENT MISMATCH — meaning the
// AEO target is fighting a different dominant intent on Google's side and
// production strategy should account for that.
const NON_OILFIELD_PATTERNS = [
  // Aquarium / coral / reef interpretation of "frac plug" / "frag plug"
  /aquarium/i, /reef/i, /coral/i, /aquatic/i, /\bfish/i, /fragbox/i,
  // Ammunition / shotgun / hunting interpretation of "shot density"
  /federalpremium/i, /apexmunition/i, /nwtf/i, /ducks\.org/i, /\bammo/i, /shotgun/i,
  // Telecom / regulatory interpretation of "wireline"
  /^fcc\.gov$/i, /telecom/i,
];

// Domains we consider unambiguously oilfield-relevant. Used to distinguish
// "AIO has some oilfield context" from "AIO is entirely a different industry".
const OILFIELD_PATTERNS = [
  /slb\.com$/i, /bakerhughes/i, /halliburton/i, /weatherford/i, /huntingplc/i,
  /repeatprecision/i, /dynaenergetics/i, /wellboss/i, /ghdiv/i, /onepetro/i,
  /spe\b/i, /jpt\.spe/i, /aapg/i, /oilandgas/i, /perforat/i, /\bfrac\b/i,
  /wireline/i, /completion/i, /oiltools/i, /downhole/i,
];

function classifyAioIntent(refDomains) {
  if (!refDomains || refDomains.length === 0) return { mismatch: false, score: 0, hits: [] };
  const total = refDomains.length;
  const nonOil = [];
  let oilfield = 0;
  for (const d of refDomains) {
    if (NON_OILFIELD_PATTERNS.some(p => p.test(d))) nonOil.push(d);
    if (OILFIELD_PATTERNS.some(p => p.test(d))) oilfield++;
  }
  const nonOilShare = nonOil.length / total;
  // Heuristic: ≥30% non-oilfield citations AND no tracked competitor cited =
  // intent is interpreted in the wrong industry. If oilfield-strong domains
  // are present alongside, the AIO is mixed (still publishable, but worth a
  // note); if oilfield is zero, it's a hard mismatch.
  const mismatch = nonOilShare >= 0.30;
  return {
    mismatch,
    nonOilShare,
    nonOilHits: nonOil,
    oilfieldCount: oilfield,
    hard: mismatch && oilfield === 0,
  };
}

function loadDeliverables() {
  const raw = JSON.parse(fs.readFileSync(INPUT, 'utf8'));
  if (!Array.isArray(raw)) throw new Error('cluster-map.json must be an array');
  return raw;
}

function loadSerp(keyword) {
  const file = path.join(SERP_DIR, `${slugify(keyword)}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function extractSerp(json) {
  const r = json?.tasks?.[0]?.result?.[0];
  if (!r) return null;
  const items = r.items || [];

  const organic = items
    .filter(i => i?.type === 'organic')
    .map(i => ({ rank: i.rank_absolute, domain: stripWww(i.domain), url: i.url, title: i.title }))
    .filter(i => i.domain);

  let aio = null;
  for (const item of items) {
    if (item?.type === 'ai_overview') {
      const refs = item.references && item.references.length
        ? item.references
        : (item.items || []).flatMap(i => i.references || []);
      // Dedup by domain (one AIO can cite the same domain multiple times).
      const seen = new Set();
      const refDomains = [];
      for (const r of refs) {
        const d = stripWww(r.domain);
        if (!d || seen.has(d)) continue;
        seen.add(d);
        refDomains.push({ domain: d, source: r.source || null, url: r.url || null });
      }
      aio = { present: true, references: refDomains };
      break;
    }
  }
  return { organic, aio };
}

function loadAll() {
  const deliverables = loadDeliverables();
  const byKeyword = new Map();
  for (const d of deliverables) {
    if (byKeyword.has(d.keyword)) continue;
    const json = loadSerp(d.keyword);
    if (!json) {
      byKeyword.set(d.keyword, null);
      continue;
    }
    byKeyword.set(d.keyword, extractSerp(json));
  }
  return { deliverables, byKeyword };
}

// ---------- Task 2: Competitor audit ----------

function competitorAudit(deliverables, byKeyword) {
  const sections = [];
  sections.push('# Competitor Content Audit — Yellow Jacket Phase 1 Keywords');
  sections.push('');
  sections.push('**Source:** Cached DataForSEO SERP Organic Live Advanced (`projects/raw/serp/`)');
  sections.push('**Method:** Top-10 organic results parsed per keyword, plus AI Overview citation domains where present.');
  sections.push(`**Run date:** ${new Date().toISOString().slice(0, 10)}`);
  sections.push(`**Deliverables analyzed:** ${deliverables.length}`);
  sections.push('');
  sections.push('**Competitors tracked:**');
  sections.push('');
  for (const c of COMPETITORS) sections.push(`- **${c.name}** — \`${c.domains.join('`, `')}\``);
  sections.push('');
  sections.push('**Notes on interpretation.** Rank 1–3 is a strong organic position; rank 4–10 is on-page-1; ranks 11–20 are page-2 (still measured here because DataForSEO returned `depth: 20`). AIO citation is a separate signal — a competitor can be cited in the AI Overview without ranking organically, and vice versa. Both matter for AEO planning.');
  sections.push('');
  sections.push('---');
  sections.push('');

  // Build per-competitor data.
  const tally = new Map();
  for (const c of COMPETITORS) tally.set(c.name, { ranks: [], aioCitations: [], domains: c.domains });

  // Iterate deliverables (one row per deliverable, even if keyword repeats).
  for (const d of deliverables) {
    const data = byKeyword.get(d.keyword);
    if (!data) continue;

    for (const c of COMPETITORS) {
      // Best organic rank for this competitor on this keyword.
      const matches = (data.organic || []).filter(o => c.domains.includes(o.domain));
      if (matches.length > 0) {
        const best = matches.reduce((a, b) => a.rank < b.rank ? a : b);
        tally.get(c.name).ranks.push({ deliverable: d, rank: best.rank, url: best.url, title: best.title });
      }
      // AIO citation for this competitor on this keyword.
      if (data.aio?.present) {
        const cited = (data.aio.references || []).find(r => c.domains.includes(r.domain));
        if (cited) {
          tally.get(c.name).aioCitations.push({ deliverable: d, url: cited.url, source: cited.source });
        }
      }
    }
  }

  // Headline summary.
  sections.push('## Headline Summary');
  sections.push('');
  sections.push('| Competitor | Top-20 organic appearances | Top-10 (page 1) | Top-3 (strong) | AIO citations |');
  sections.push('|---|---:|---:|---:|---:|');
  for (const c of COMPETITORS) {
    const t = tally.get(c.name);
    const top10 = t.ranks.filter(r => r.rank <= 10).length;
    const top3 = t.ranks.filter(r => r.rank <= 3).length;
    sections.push(`| ${c.name} | ${t.ranks.length} | ${top10} | ${top3} | ${t.aioCitations.length} |`);
  }
  sections.push('');

  // Per-competitor detail.
  for (const c of COMPETITORS) {
    const t = tally.get(c.name);
    sections.push(`## ${c.name}`);
    sections.push('');
    if (t.ranks.length === 0 && t.aioCitations.length === 0) {
      sections.push(`_No top-10 organic appearances and no AIO citations across the 32 keywords. ${c.name} is not visible in this content area as of this snapshot._`);
      sections.push('');
      continue;
    }

    if (t.ranks.length > 0) {
      sections.push('### Organic appearances (top 20 — DataForSEO `depth: 20`)');
      sections.push('');
      sections.push('| Deliverable # | Cluster | Keyword | Rank | URL |');
      sections.push('|---:|---|---|---:|---|');
      // Sort by rank ascending, then deliverable id.
      const sorted = [...t.ranks].sort((a, b) => a.rank - b.rank || a.deliverable.id - b.deliverable.id);
      for (const r of sorted) {
        const url = (r.url || '').replace(/\|/g, '\\|').slice(0, 100);
        sections.push(`| ${r.deliverable.id} | ${r.deliverable.cluster} | \`${r.deliverable.keyword}\` | ${r.rank} | ${url} |`);
      }
      sections.push('');

      // Owned keywords (top 3 organic).
      const owned = t.ranks.filter(r => r.rank <= 3);
      sections.push('### Keywords this competitor "owns" (top-3 organic)');
      sections.push('');
      if (owned.length === 0) {
        sections.push('_None. No top-3 organic positions across the 32 keywords._');
      } else {
        for (const o of owned.sort((a, b) => a.rank - b.rank)) {
          sections.push(`- #${o.deliverable.id} \`${o.deliverable.keyword}\` — rank ${o.rank} (${o.deliverable.title})`);
        }
      }
      sections.push('');
    }

    if (t.aioCitations.length > 0) {
      sections.push('### AI Overview citations');
      sections.push('');
      sections.push('| Deliverable # | Cluster | Keyword | Source |');
      sections.push('|---:|---|---|---|');
      for (const a of t.aioCitations.sort((a, b) => a.deliverable.id - b.deliverable.id)) {
        const src = (a.source || '—').replace(/\|/g, '\\|').slice(0, 60);
        sections.push(`| ${a.deliverable.id} | ${a.deliverable.cluster} | \`${a.deliverable.keyword}\` | ${src} |`);
      }
      sections.push('');
    }
  }

  // Cross-competitor view per deliverable.
  sections.push('---');
  sections.push('');
  sections.push('## Per-Deliverable Competitor Map');
  sections.push('');
  sections.push('Each row shows the best organic rank achieved by each competitor for that deliverable\'s keyword. Empty cells mean no top-10 presence. The AIO column lists which tracked competitors are cited in the AI Overview (if present).');
  sections.push('');
  sections.push('| # | Cluster | Keyword | WellBoss | Repeat Precision | DynaEnergetics | Hunting Titan | AIO citations (tracked competitors) |');
  sections.push('|---:|---|---|:---:|:---:|:---:|:---:|---|');
  for (const d of deliverables) {
    const data = byKeyword.get(d.keyword);
    const cells = [];
    let aioCellParts = [];
    for (const c of COMPETITORS) {
      if (!data) { cells.push('—'); continue; }
      const matches = (data.organic || []).filter(o => c.domains.includes(o.domain));
      cells.push(matches.length > 0 ? String(matches.reduce((a, b) => a.rank < b.rank ? a : b).rank) : '—');
      if (data.aio?.present) {
        const cited = (data.aio.references || []).find(r => c.domains.includes(r.domain));
        if (cited) aioCellParts.push(c.name);
      }
    }
    const aioCell = aioCellParts.length > 0 ? aioCellParts.join(', ') : '—';
    sections.push(`| ${d.id} | ${d.cluster} | \`${d.keyword}\` | ${cells.join(' | ')} | ${aioCell} |`);
  }
  sections.push('');

  return sections.join('\n');
}

// ---------- Task 3: AEO opportunity map ----------

function aeoOpportunityMap(deliverables, byKeyword) {
  const sections = [];
  sections.push('# AEO Opportunity Map — Yellow Jacket Phase 1 Keywords');
  sections.push('');
  sections.push('**Source:** Cached DataForSEO SERP Organic Live Advanced (`projects/raw/serp/`)');
  sections.push('**Method:** AI Overview presence + citation domains parsed per keyword, joined against tracked competitor and G&H domains.');
  sections.push(`**Run date:** ${new Date().toISOString().slice(0, 10)}`);
  sections.push(`**Deliverables analyzed:** ${deliverables.length}`);
  sections.push('');
  sections.push('## Classification');
  sections.push('');
  sections.push('Every deliverable is classified into one of these lanes (a single keyword can hit multiple — order is by urgency):');
  sections.push('');
  sections.push('1. **PRIORITY (Repeat Precision in AIO).** Repeat Precision is the engagement\'s declared urgency driver. Any keyword where they are cited in the AI Overview is a top-priority production target.');
  sections.push('2. **PRIORITY (Other tracked competitor in AIO).** WellBoss, DynaEnergetics, or Hunting Titan are cited. Same urgency logic but slightly lower than Repeat Precision per the engagement brief.');
  sections.push('3. **G&H BASELINE (`ghdiv.com` already cited).** G&H is in the AIO citation set. Defend, refresh, and add depth.');
  sections.push('4. **OPEN LANE (AIO present, no tracked competitor cited).** AI Overview exists but none of the four tracked competitors hold it. Win-it-first opportunity.');
  sections.push('5. **NO-AIO LANE (no AI Overview present).** Traditional organic SEO play; AEO not active here yet but worth claiming early — Google adds AIO to keywords incrementally.');
  sections.push('');

  // Build classified buckets.
  const buckets = {
    priorityRepeat: [],
    priorityOther: [],
    ghBaseline: [],
    openLane: [],
    noAio: [],
    noData: [],
  };

  // Per-deliverable analysis (one row per deliverable, may dupe keywords).
  const rows = [];

  const competitorByDomain = new Map();
  for (const c of COMPETITORS) for (const d of c.domains) competitorByDomain.set(d, c);

  for (const d of deliverables) {
    const data = byKeyword.get(d.keyword);
    if (!data) {
      buckets.noData.push(d);
      rows.push({ d, status: 'NO DATA', refs: [], ghCited: false, competitors: [] });
      continue;
    }
    if (!data.aio?.present) {
      buckets.noAio.push(d);
      rows.push({ d, status: 'NO-AIO', refs: [], ghCited: false, competitors: [] });
      continue;
    }
    const refs = data.aio.references || [];
    const refDomains = refs.map(r => r.domain);
    const ghCited = refDomains.includes(GH_DOMAIN);
    const citedCompetitors = [];
    const seen = new Set();
    for (const rd of refDomains) {
      const c = competitorByDomain.get(rd);
      if (c && !seen.has(c.name)) { seen.add(c.name); citedCompetitors.push(c.name); }
    }

    let status;
    if (citedCompetitors.includes('Repeat Precision')) {
      buckets.priorityRepeat.push(d);
      status = 'PRIORITY (Repeat Precision)';
    } else if (citedCompetitors.length > 0) {
      buckets.priorityOther.push(d);
      status = `PRIORITY (${citedCompetitors.join(', ')})`;
    } else {
      buckets.openLane.push(d);
      status = 'OPEN LANE';
    }
    if (ghCited) buckets.ghBaseline.push(d);
    rows.push({ d, status, refs: refDomains, ghCited, competitors: citedCompetitors });
  }

  // Intent-mismatch detection.
  const intentFlags = new Map();
  for (const d of deliverables) {
    const data = byKeyword.get(d.keyword);
    if (!data?.aio?.present) continue;
    const refDomains = (data.aio.references || []).map(r => r.domain);
    const flag = classifyAioIntent(refDomains);
    if (flag.mismatch) intentFlags.set(d.id, { d, flag, refDomains });
  }

  if (intentFlags.size > 0) {
    sections.push('## ⚠️ Intent Ambiguity Flags');
    sections.push('');
    sections.push('On these keywords, the AI Overview\'s citation set is dominated by domains from a different industry — meaning Google currently interprets the keyword for a non-oilfield audience. Targeting these for AEO requires either keyword refinement (longer-tail, e.g. `oilfield frac plug` instead of `frac plug`) or accepting that organic SEO may rank but AIO citations will not flow until intent shifts.');
    sections.push('');
    sections.push('**`hard` = AIO contains zero oilfield-relevant domains. Treat as a strong signal to refine the target keyword before producing content.**');
    sections.push('');
    sections.push('| # | Keyword | Title | Non-oilfield share | Likely interpretation | Hard? |');
    sections.push('|---:|---|---|---:|---|:---:|');
    for (const [, info] of intentFlags) {
      const { d, flag, refDomains } = info;
      // Best-guess label of what the AIO interpretation is.
      let interp = '_mixed_';
      if (refDomains.some(d => /aquarium|reef|coral|fragbox/i.test(d))) interp = 'Coral / saltwater aquarium';
      else if (refDomains.some(d => /federalpremium|apexmunition|nwtf|ducks/i.test(d))) interp = 'Hunting / shotgun ammunition';
      else if (refDomains.some(d => /^fcc\.gov$|telecom/i.test(d))) interp = 'Telecom / regulatory';
      const pct = (flag.nonOilShare * 100).toFixed(0);
      sections.push(`| ${d.id} | \`${d.keyword}\` | ${d.title} | ${pct}% | ${interp} | ${flag.hard ? 'YES' : '—'} |`);
    }
    sections.push('');
    sections.push('**Strategic implication.** Targeting these head-term keywords for AEO at face value is leverage-poor. Recommended actions: (1) re-target with oilfield-qualifying long-tail variants (`frac plug for completions`, `shot density perforating`, `oilfield wireline`), (2) keep the head-term page for organic SEO leverage but do not measure AEO citation share against it until the AIO interpretation shifts, (3) flag this in the next Kelly review — these are SOW-committed deliverables and the keyword choice may need adjustment.');
    sections.push('');
  }

  // Headline counts.
  sections.push('## Headline Counts');
  sections.push('');
  sections.push('| Lane | Count |');
  sections.push('|---|---:|');
  sections.push(`| PRIORITY — Repeat Precision in AIO | ${buckets.priorityRepeat.length} |`);
  sections.push(`| PRIORITY — Other tracked competitor in AIO | ${buckets.priorityOther.length} |`);
  sections.push(`| G&H baseline (\`ghdiv.com\` cited in AIO) | ${buckets.ghBaseline.length} |`);
  sections.push(`| OPEN LANE — AIO present, no tracked competitor | ${buckets.openLane.length} |`);
  sections.push(`| NO-AIO — AIO not present in SERP | ${buckets.noAio.length} |`);
  sections.push(`| NO DATA — SERP cache missing | ${buckets.noData.length} |`);
  sections.push('');
  sections.push(`**Total:** ${deliverables.length}. Note: PRIORITY and G&H BASELINE can overlap — a keyword where both Repeat Precision and \`ghdiv.com\` are cited counts in both the priority bucket and the baseline.`);
  sections.push('');

  // Lane sections.
  function laneSection(title, items, includeRefs = true, intro) {
    sections.push(`## ${title}`);
    sections.push('');
    if (intro) { sections.push(intro); sections.push(''); }
    if (items.length === 0) { sections.push('_None._'); sections.push(''); return; }
    if (!includeRefs) {
      sections.push('| # | Cluster | Keyword | Title |');
      sections.push('|---:|---|---|---|');
      for (const d of items) sections.push(`| ${d.id} | ${d.cluster} | \`${d.keyword}\` | ${d.title} |`);
    } else {
      sections.push('| # | Cluster | Keyword | Title | AIO Citation Domains |');
      sections.push('|---:|---|---|---|---|');
      for (const d of items) {
        const data = byKeyword.get(d.keyword);
        const refs = (data?.aio?.references || []).map(r => r.domain).slice(0, 8);
        sections.push(`| ${d.id} | ${d.cluster} | \`${d.keyword}\` | ${d.title} | ${refs.join(', ') || '—'} |`);
      }
    }
    sections.push('');
  }

  laneSection(
    'PRIORITY 1 — Repeat Precision in AIO',
    buckets.priorityRepeat,
    true,
    'Per the engagement brief, Repeat Precision\'s growing AI visibility is the urgency driver. Each of these keywords is a content target where displacing or joining the citation set is the strategic goal. Production order should weight these first within their respective clusters, paired with the cluster\'s pillar so the spoke pulls authority signals from a strong hub.',
  );

  laneSection(
    'PRIORITY 2 — Other tracked competitors in AIO',
    buckets.priorityOther,
    true,
    'WellBoss, DynaEnergetics, or Hunting Titan are cited. Strategic priority is real but slightly behind Repeat Precision — these are also AEO-active, but the engagement positions Repeat Precision as the most direct AI-citation threat.',
  );

  laneSection(
    'G&H BASELINE — ghdiv.com already cited in AIO',
    buckets.ghBaseline,
    true,
    '`ghdiv.com` is already cited by Google\'s AI Overview on these keywords. This is the floor — content here should be defended (no thin pages, no broken links, schema kept current) and refreshed periodically. Losing one of these baselines is a measurable regression to track in the monthly cron.',
  );

  laneSection(
    'OPEN LANE — AIO present, no tracked competitor cited',
    buckets.openLane,
    true,
    'An AI Overview exists but none of the four tracked competitors hold it. These are highest-leverage win-it-first opportunities — comprehensive, well-cited content here can take a citation slot before any tracked competitor moves in. Look at the existing citation domains: who is currently being cited and what kind of source are they (encyclopedia, vendor, journal, .gov)? Match or exceed that source quality.',
  );

  laneSection(
    'NO-AIO LANE — AI Overview not present in SERP',
    buckets.noAio,
    false,
    'No AI Overview on this keyword right now. Treat as classic organic SEO play and a forward-looking AEO claim — Google adds AIO to keywords incrementally, so being the strongest organic answer when AIO arrives is the leverage. The internal linking architecture should still pass authority to these pages.',
  );

  if (buckets.noData.length > 0) {
    laneSection(
      'NO DATA — SERP cache missing',
      buckets.noData,
      false,
      'No cached SERP JSON found for these keywords. Action: re-run `validate-keywords.js` for them, or check `projects/raw/serp/` directly.',
    );
  }

  // Production-order recommendation.
  sections.push('## Suggested Production Order');
  sections.push('');
  sections.push('Production order combining AEO urgency (this map) with the linking architecture\'s wave plan:');
  sections.push('');
  sections.push('1. **Build pillars first** (#1, #9, #17) regardless of lane — pillars are gravity wells for the entire cluster.');
  sections.push('2. **Within each cluster, prioritise PRIORITY 1 spokes** (Repeat Precision in AIO) so the highest-urgency citation displacement happens earliest.');
  sections.push('3. **Then PRIORITY 2 spokes** (other tracked competitors in AIO).');
  sections.push('4. **Then OPEN LANE spokes** — these are easier wins because no tracked competitor is defending the citation, but they are also less urgent because no defection signal has fired.');
  sections.push('5. **G&H BASELINE spokes** require maintenance, not net-new production — schedule refreshes via the Phase 2 retainer\'s 2-content-refreshes-per-month line.');
  sections.push('6. **NO-AIO spokes last** within their cluster — still produce them, but they sit lower on the AEO urgency board.');
  sections.push('7. **Glossary entries follow Wave 2** of the linking architecture regardless of AEO classification — they exist to back-link and disambiguate, not to drive AEO citation independently.');
  sections.push('');

  return sections.join('\n');
}

// ---------- Run ----------

(function main() {
  const { deliverables, byKeyword } = loadAll();

  const auditMd = competitorAudit(deliverables, byKeyword);
  fs.writeFileSync(path.join(OUT_DIR, 'competitor-audit.md'), auditMd);
  console.log('wrote competitor-audit.md');

  const aeoMd = aeoOpportunityMap(deliverables, byKeyword);
  fs.writeFileSync(path.join(OUT_DIR, 'aeo-opportunity-map.md'), aeoMd);
  console.log('wrote aeo-opportunity-map.md');

  // Quick console summary so the orchestrator gets headline counts without
  // reading the whole markdown file.
  let orgCount = { WellBoss: 0, 'Repeat Precision': 0, DynaEnergetics: 0, 'Hunting Titan': 0 };
  let aioCount = { ...orgCount };
  let aioPresent = 0, ghBaseline = 0, openLane = 0, priorityRepeat = 0;
  for (const d of deliverables) {
    const data = byKeyword.get(d.keyword);
    if (!data) continue;
    for (const c of COMPETITORS) {
      if ((data.organic || []).some(o => c.domains.includes(o.domain))) orgCount[c.name]++;
      if (data.aio?.present && (data.aio.references || []).some(r => c.domains.includes(r.domain))) aioCount[c.name]++;
    }
    if (data.aio?.present) aioPresent++;
    if (data.aio?.present && (data.aio.references || []).some(r => r.domain === GH_DOMAIN)) ghBaseline++;
    if (data.aio?.present && !COMPETITORS.some(c => (data.aio.references || []).some(r => c.domains.includes(r.domain)))) openLane++;
    if (data.aio?.present && (data.aio.references || []).some(r => r.domain === 'repeatprecision.com')) priorityRepeat++;
  }
  console.log('\n--- Headline ---');
  console.log(`AIO present: ${aioPresent} / ${deliverables.length} deliverables`);
  console.log(`G&H baseline (ghdiv.com cited): ${ghBaseline}`);
  console.log(`PRIORITY (Repeat Precision in AIO): ${priorityRepeat}`);
  console.log(`OPEN LANE (AIO, no tracked competitor): ${openLane}`);
  console.log('Organic top-20 appearances:', orgCount);
  console.log('AIO citation appearances:', aioCount);
})();
