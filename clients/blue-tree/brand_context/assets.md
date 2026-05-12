# Blue Tree Outdoor Living — Brand Assets

**Last derived:** 2026-05-12
**Source:** Raja Sheryar (designer), confirmed 2026-05-12 + Figma + Google Drive folder structure
**Status:** Phase 1 color and typography rule-book applied. Home + core page templates approved. Inner + About template family in active design.

## Color tokens

| Role | Token name | Hex |
|---|---|---|
| Primary Green | `--bt-green` | `#285140` |
| Primary Blue | `--bt-blue-primary` | `#0F2537` |
| Light Blue | `--bt-blue-light` | `#005CB9` |
| Accent Orange | `--bt-orange` | `#FB8C00` |
| White | `--bt-white` | `#FFFFFF` |
| Off-White | `--bt-off-white` | `#DBDBDB` |

**Source:** Raja Sheryar (designer), confirmed 2026-05-12.

## Typography

| Role | Family | Weights |
|---|---|---|
| H1 | Archivo | Bold, ExtraBold |
| H2 (primary) | Archivo | Bold |
| H2 (visual hierarchy variant) | SF Pro | Bold |
| H3 | SF Pro | Semibold, Bold |
| H4 | SF Pro | Semibold, Bold |
| Body | SF Pro | Regular, Medium |

**Hierarchy rule:** Raja's H2 variant call — SF Pro Bold replaces Archivo Bold for H2 in any composition where Archivo H2 would clash visually with the Archivo H1 above it. Default to Archivo Bold for H2 otherwise.

**Source:** Raja Sheryar (designer), confirmed 2026-05-12.

## Logo files

Google Drive folder structure provided by client 2026-05-12.

| Asset | Drive ID |
|---|---|
| **Drive root (Blue Tree)** | [1Q7f-aUqkSrnafDfB1uO9eMue-iqd2km-](https://drive.google.com/drive/folders/1Q7f-aUqkSrnafDfB1uO9eMue-iqd2km-) |
| Brand Guideline & Logo folder | 1GoVgEewKumTnoeql98UEVob8hKaLjsSf |
| Logos subfolder | 1I99P7JyddwpsRkkkxYWAT-6Kz4WhUE8L |
| Primary logo, color, WEBP | 1NLwm9cheiSlG0yPh0SaxojCXtD9ffqhe |
| Primary logo, color, SVG (PNG embedded inside) | 15CD_YdW4zBt9zwejiA9_E1yEPLt1WWOj |
| White-out logo, WEBP | 1BhRSGISNDjXCl3ZACqAZ0zLijOFsh4M6 |
| Footer logo (blue), WEBP | 1kjQojNNOvOvsVDl2sojKSjEEreUCUWtV |
| Logo with tagline, EPS | 1dsUPm4YB3j1o2rwHXZ8htQoSReVgDJGa |
| Rectangle logo, JPG | 1q7V5R7OnWJ5OPnbG81MOWWMwv21eoPsq |
| White background variant, JPG | 15ra_HAFnRv5ObcDhsXo-X4hFy1YWDp2G |
| Images & Videos folder | 15ZDZmD2HW64Cuh2hozv1Kc-xmqv9_dCK |

## Design system source of truth

- **Figma:** https://www.figma.com/design/leXDzLrKd1zucGnwQbTWOB/Blue-Tree
- **Coverage:** Home, Services (4 templates), Inner (10+ templates), About (10+ templates)
- **Access:** Read access via Figma MCP connector (active in Claude Teams)

## Dev environment

- **Staging URL:** https://bluetree.tempurl.host
- **Crawl status:** `robots.txt` disallows. Correct for staging. Do not change until cutover.
- **Live site:** https://bluetreelandscaping.com (the source of truth for currently-live content and live-site audit work)

## Template-to-page mapping

Per the creative-brief index, each canonical brief maps to one or more sitemap URLs and to one Figma template family.

See `clients/blue-tree/inputs/source-materials/creative-briefs/INDEX.md` for the canonical brief-to-sitemap mapping. The Figma file holds the design template families that those briefs target. Phase 1 home and core page templates are approved; inner and About template families are in active design.

When building a page brief for content or visual design, cross-reference:

1. The canonical creative brief in `creative-briefs/` for content scope and conversion spine.
2. The Figma template for the matching page type (home, services, inner, about).
3. The voice profile (`voice-profile.md` index or `voice-profile-full-v1.1.md`) for prose voice and compliance rules.

## Open items

These are flagged for follow-up; do not block work but log questions to the client when relevant work surfaces them.

- **SF Pro web-license verification.** SF Pro is Apple's system font. Confirm web embedding license is in place before the site launches publicly. If embedding rights are not confirmed, fall back to a close substitute (Inter, IBM Plex Sans, or another grotesque sans-serif).
- **Vector master files for the logo lockup.** The Drive folder has WEBP, JPG, and EPS variants and a SVG with PNG embedded inside. A true vector SVG master (paths, no embedded PNG) is preferred for arbitrary scaling and for emerging build targets.
- **Brand guidelines PDF.** The "Brand Guideline & Logo" folder is named for one but no consolidated PDF guidelines file has been confirmed yet. Confirm whether Raja or the previous design vendor produced one; if not, consider commissioning a short brand standards doc.
- **Photography license.** Existing photography on bluetreelandscaping.com appears to be a mix of project photography and stock. Confirm rights, retention, and usage scope for any photo brought into the new site.
- **Asset versioning.** No version manifest exists for the Drive folder. As Phase 1 builds out, recommend a simple `assets-manifest.md` that records filename, version, last-updated date, and approved use for each asset.
- **Trustindex widget styling tokens.** Live Google rating renders via Trustindex (v1.1 §1.8). Visual treatment (color, badge size, placement) needs Raja sign-off so it sits inside the design system rather than visually breaking it.
- **Favicon and social/OG image set.** Not yet inventoried in the Drive folder. Need: 32x32, 192x192, 512x512 favicons; OG image (1200x630); square share image (1080x1080) for LinkedIn and Instagram.

## Asset gaps surfaced

- Drive folder is shallow on completed-project photography. v1.1 §15.5 already flagged that full case studies are a Phase 1 deliverable; matching photography is part of that gap.
- No documented icon system for service-pillar use (5 pillars need consistent iconography for hero strips, value-prop blocks, navigation, etc.). Currently using emoji placeholders in home-page-creative.md.
- No headshot inventory mapped to team-page bios. v1.1 §19 pending items lists Jeff Mattiola headshot as "pending; Maureen believes it exists" and Cliff / John Mattiola / Kempton / Fred bios pending.
- Logo with tagline EPS is the only file with the "Pools · Landscapes · Hardscapes" descriptor confirmed in-file. The primary logo color variants do not embed the descriptor; check usage rules with Raja for which lockup goes where.
