---
created: 2026-04-26
source: Delta Audit spoke article upgrade (`projects/briefs/delta-audit-spoke/`)
website-repo: C:\Users\jason\.gemini\antigravity\scratch\roi-live
findings: 5
---

# Signal Cluster — Repo-Level Issues Surfaced During Delta Audit Spoke Upgrade

Five findings outside the scope of a single article. Each one needs a separate decision/fix, ideally before the next Signal cluster article ships so the same patterns don't have to be re-discovered.

---

## F1 — SOP URL convention does not match deployed reality

**Severity:** High — silently affects every internal link suggestion and every sitemap entry going forward.

**What the SOP says:** Signal Article SOP v2.0 references article URLs as `/blog/{slug}` in multiple places (internal-linking section, sitemap examples, schema URL fields).

**What is actually deployed:** Every Signal article on roi.live lives at the root path `/{slug}` — no `/blog/` prefix. Confirmed across 30+ deployed articles. URL rewriting is handled by `.htaccess`, which strips the `.html` extension and serves files from the root directory.

**Examples on the deployed site:**
- `/information-gain-seo` (pillar)
- `/content-audit-information-gain` (this spoke)
- `/skyscraper-technique-dead`
- `/citation-share-metric-replaces-rankings`
- `/entity-authority-ai-search`

**Fix needed:**
1. Update Signal Article SOP v2.0 to use `/{slug}` everywhere `/blog/{slug}` currently appears
2. Update any internal-linking templates, sitemap examples, and schema URL examples
3. Add an explicit note in Phase 11 QA: "Verify URL matches deployed pattern `/{slug}`, not `/blog/{slug}`"

**Why this matters:** Without the SOP fix, Claude Code (or any future agent) will keep proposing `/blog/` paths, breaking internal linking and producing non-functional canonical URLs. Catching this in Phase 11 is too late — it should be baked into the SOP before generation.

---

## F2 — `/zero-click-searches-strategy` broken link in pillar

**Severity:** High — broken internal link from the cluster's primary entry point.

**Where:** `/information-gain-seo` (pillar article) links to `/zero-click-searches-strategy` in the body. That destination does not exist on the deployed site.

**What's there:** No file matching `zero-click-searches-strategy` was found in the website repo. No redirect rule. No similarly-named slug. The link is dead.

**Fix options:**
1. **Replace** the anchor with a link to an existing related article (closest live match: `citation-share-metric-replaces-rankings` covers similar territory)
2. **Build** the article — slug suggests a future spoke on zero-click search strategy, which is a viable cluster topic anyway
3. **Remove** the anchor entirely and rephrase the surrounding sentence

**Recommendation:** Option 1 (replace) immediately to stop the bleed; flag option 2 as a future article candidate in the Information Gain cluster roadmap.

**Why this matters:** Pillar pages get the most traffic in the cluster and are the primary entry point for AI Overview citations. A broken internal link from the pillar damages crawl signals and hands users a 404 on the most-visited page in the cluster.

---

## F3 — Emerald accent color (`#10b981`) not in SOP color system

**Severity:** Medium — design system drift. Not a blocker, but compounds over time.

**What the SOP says:** The Signal Article SOP color system documents the accent palette as gold (`#b8860b` / `#d4a017`), violet (`#7c3aed`), pink (`#c9376b`), and amber (`#d4a017`). Emerald is not in the documented palette.

**What's actually deployed:** The pillar article `/information-gain-seo` uses emerald `#10b981` as its accent color throughout (cards, buttons, callouts, gradient stops). This was inherited and used as the source-of-truth pattern for all subsequent pillar work.

**The collision:** When patching the spoke article, the CSS variable `--em` for emerald collided with the gold-themed spoke. We resolved it locally by switching the spoke to use `--gold` consistently while leaving the pillar callout block hardcoded to emerald (visual identity preservation). But the SOP and the deployment now diverge.

**Fix options:**
1. **Document emerald** in the SOP color system as the cluster pillar accent (codifies what's already deployed)
2. **Repaint the pillar** to use a documented color (high effort, breaks visual continuity)
3. **Add a "cluster anchor color" rule** to the SOP — each cluster gets one anchor color, pillar uses it dominantly, spokes use it sparingly in pillar-callout blocks only

**Recommendation:** Option 3. It generalizes to future clusters and matches the pattern that's already emerging on the deployed site.

**Why this matters:** Without documentation, the next agent painting a spoke will either repeat the collision we just resolved or accidentally invent a new accent color. Locking the rule prevents both failure modes.

---

## F4 — Sitemap entries with `/blog/` prefix for files served from root

**Severity:** High — sitemap likely producing 404s on submission, hurting indexing.

**What's there:** `sitemap.xml` in the website repo contains entries with `/blog/{slug}` paths for some Signal articles, while the actual files are served from `/{slug}` per `.htaccess`. The mismatch is partial — some entries are correct, some are wrong.

**Direct consequence:** Google fetches the URL listed in the sitemap. For mismatched entries, that URL 404s. Search Console reports `Submitted URL not found (404)` and the article is excluded from indexing for that submission. The article is still discoverable via internal links and may get indexed via crawl, but the sitemap signal is wasted at best and a negative signal at worst.

**Fix needed:**
1. Audit `sitemap.xml` against deployed reality (every entry should match what `.htaccess` actually serves)
2. Standardize all entries to `/{slug}` (the deployed pattern)
3. Re-submit sitemap to Search Console after fix
4. Add Phase 11 QA item: "After deploy, verify sitemap entry for new article matches the deployed URL pattern"

**Why this matters:** Linked to F1. Whatever produced the bad sitemap entries will keep producing them until the SOP fix lands. The sitemap audit is the cleanup; the SOP fix is the prevention.

---

## F5 — Pillar `/information-gain-seo` carries 4 stats without source attribution

**Severity:** Required — fix this before the next AI Overview citation cycle.

**What's there:** The pillar article displays 4 statistics in its hero stat strip (the same 4 the spoke now reuses for entity reinforcement: 30-50% drop, 22% drop, 96.55%, 82%). On the pillar, none of them carry visible source citations. They appear as bare numbers with labels.

**Why this is now a flagged issue:** During the spoke's Improvement 3 patch, we added inline source citations to all 4 stats (SISTRIX for 1 + 2, Ahrefs 2023 for 3, BrightEdge via SEJ for 4). The spoke now models the citation pattern; the pillar — the higher-traffic page in the cluster — does not.

**The risk:** AI Overviews and Perplexity-class citation engines weight provenance heavily. A page presenting 4 statistics without attribution reads as "synthesized claims" to a citation model and gets cited less often than a page where every claim has a visible source. This is exactly the citation share metric the cluster preaches — and the pillar is failing the standard the cluster sets.

**Fix needed (Required):**
1. Backport the citation pattern from `/content-audit-information-gain` to `/information-gain-seo`
2. Specifically: add inline source attribution to all 4 stat strip statistics using the same publishers and dates the spoke uses (SISTRIX × 2, Ahrefs 2023, BrightEdge via SEJ)
3. Use the same visual treatment: `<sup class="cite">` linking to the source URL, with a small footer-style citation block if needed
4. Verify with the spoke's QA pattern (banned-phrase scan, link check, schema mention update)

**Effort:** ~30 min for the citation patch on the pillar. No structural HTML changes needed; just adding `<sup>` links and a citations block.

**Why this is Required, not High-leverage:** The pillar is the primary citation target for the entire cluster. Every spoke links back to it. If the pillar gets cited at a lower rate because of missing provenance, the entire cluster's AEO performance is capped at the pillar's citation rate. Fix this before the next core update or the next spoke ships.

**SOP candidate:** Add to Signal Article SOP Phase 11: "Every visible statistic must carry a visible source citation (publisher + date + link). No bare numbers. This is non-negotiable for AEO."

---

## Summary

| # | Finding | Severity | Effort | Fix order |
|---|---|---|---|---|
| F5 | Pillar missing stat citations | **Required** | 30 min | First — affects cluster ceiling |
| F1 | SOP `/blog/` convention wrong | High | 15 min | Second — prevents future drift |
| F4 | Sitemap entries with bad prefix | High | 30 min | Third — depends on F1 |
| F2 | Broken `/zero-click-searches-strategy` link | High | 5 min (replace) | Fourth — small immediate fix |
| F3 | Emerald not in SOP color system | Medium | 20 min | Fifth — codification, not urgent |

Total estimated effort: ~100 min to clear all five findings. Recommend doing them in one session before the next Signal article ships.
