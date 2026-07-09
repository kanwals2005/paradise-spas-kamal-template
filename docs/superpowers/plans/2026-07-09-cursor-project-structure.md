# Cursor-Friendly Project Structure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganize the Paradise Spas / hot-tub dealer website monorepo into a Cursor-native layout (AGENTS.md, versioned `.cursor/` rules & skills, asset isolation, clear app boundaries) so Cloud Agents and local agents can edit the site, lead API, campaigns, and agency kit without drowning in binaries or marketing docs.

**Architecture:** Keep a **single Cloudflare Pages project** for the live site (HTML + `functions/` must stay colocated for Pages Functions). Move the site into `apps/site/`, keep dashboard SOPs and agency-starter as sibling packages, put human playbooks under `docs/`, and put agent operating instructions in root `AGENTS.md` + `.cursor/rules` + `.cursor/skills`. Trunk is `master`; agents always branch off `master` with short-lived `cursor/<scope>-<slug>-d10c` (or `agent/<scope>-<slug>`) branches and open PRs.

**Tech Stack:** Static HTML/CSS/JS, Cloudflare Pages + Pages Functions (Wrangler), GoHighLevel forms/webhooks, Meta Pixel / GA4 / Clarity, Cursor rules/skills/MCP, optional Cloudflare Cursor plugin.

**Research basis:** Deep research run `trun_4a050d7e3090454892326cdc9e03560e` (July 2026) saved at `docs/research/cursor-project-org-july-2026.json`. Primary sources: [Cursor Rules](https://cursor.com/docs/rules), [Cursor Skills](https://cursor.com/docs/skills), [AGENTS.md](https://agents.md/), [Cursor Ignore](https://cursor.com/docs/reference/ignore-file), [Cloud Agents](https://cursor.com/docs/cloud-agent), [Cloudflare Pages monorepos](https://developers.cloudflare.com/pages/configuration/monorepos/), [Cursor + Cloudflare](https://developers.cloudflare.com/agent-setup/cursor/).

---

## A–Z mental model (read before touching files)

### What each layer is for

| Layer | Path | When it loads | Put here | Never put here |
|-------|------|---------------|----------|----------------|
| Human README | `README.md` | Humans on GitHub | What the product is, quick start, live URL | Long SOPs, pixel IDs walls, agent conventions |
| Agent README | `AGENTS.md` | Every agent session (nearest wins) | Build/deploy commands, map of apps, “do not invent React”, where secrets live | Full playbook prose, binary paths lists |
| Always-on rules | `.cursor/rules/*.mdc` (`alwaysApply: true` or globs) | Injected when matched | Hard guardrails (no secrets in HTML, functions stay with site, commit style) | Multi-page tutorials |
| On-demand skills | `.cursor/skills/<name>/SKILL.md` | When task matches `description` | Step-by-step workflows (new landing page, new client from agency-starter, lead API change) | One-line “always do X” (that’s a rule) |
| MCP | `.cursor/mcp.json` + plugins | When tools are called | Cloudflare / GitLab / Parallel / GHL tools | Business logic |
| Ignore | `.cursorignore` + `.cursorindexingignore` | Indexing + context | Large images, research dumps, lockfile noise | Source HTML/JS the agent must edit |
| Docs | `docs/**` | Only when opened / linked | Playbook, research, this plan | Runtime site assets |

### Correct setup order (already partly done for you)

1. Open Cursor at **repo root** (never only `apps/site/`).
2. `AGENTS.md` + `.cursorignore`.
3. Versioned `.cursor/rules/*.mdc`.
4. Install Cloudflare plugin / MCP (user machine: `/add-plugin cloudflare`).
5. Domain skills under `.cursor/skills/`.
6. Branching + Cloud Agent env last.

### Branching model for this repo

- **Trunk:** `master` (current default; do **not** rename in this plan unless a separate chore is approved).
- **Agent / feature branches:** `cursor/<descriptive-slug>-d10c` (Cloud Agent convention already used) or `agent/<scope>-<slug>` for local work.
- **Always branch from `master`**, never from another feature branch.
- **One concern per PR** during migration (phases below).
- **Humans merge;** agents open draft PRs.
- **Parallel agents:** use separate git worktrees, one branch each.

### Critical Cloudflare constraint (overrides generic monorepo advice)

Pages Functions are served from the **same** Pages project as the static files and must live at `<pages-project-root>/functions/`. Today deploy is:

```bash
npx wrangler pages deploy . --project-name paradise-spas --branch main
```

After migration, deploy becomes:

```bash
npx wrangler pages deploy apps/site --project-name paradise-spas --branch main
```

with `apps/site/functions/` containing the lead API. Do **not** split `functions/` into a second Pages app in this plan (YAGNI for a single-domain dealer site).

### Current pain (why we migrate)

Today the repo root mixes ~15+ MB of product PNGs, campaign folders, `dashboard/` SOPs, `agency-starter/`, `functions/`, and `DEALERSHIP_CONVERSION_PLAYBOOK.md` next to every HTML page. Agents open the root and burn context on binaries and marketing prose. `.gitignore` currently ignores **all of `.cursor/`**, so rules/skills cannot be shared with Cloud Agents — that must be fixed.

---

## Target tree (concrete)

```
paradise-spas-website/   # open Cursor HERE
├── AGENTS.md
├── README.md
├── package.json                 # root scripts: deploy site, ga4 reports
├── package-lock.json
├── .gitignore                   # secrets yes; .cursor/rules+skills NO
├── .cursorignore
├── .cursorindexingignore
├── .cursor/
│   ├── rules/
│   │   ├── 00-project-overview.mdc
│   │   ├── 10-static-html-site.mdc
│   │   ├── 20-pages-functions.mdc
│   │   ├── 30-tracking-and-leads.mdc
│   │   └── 40-git-and-prs.mdc
│   ├── skills/
│   │   ├── new-landing-page/SKILL.md
│   │   ├── new-client-from-agency-starter/SKILL.md
│   │   ├── lead-api-change/SKILL.md
│   │   └── deploy-preview/SKILL.md
│   ├── mcp.json.example         # committed template (no secrets)
│   └── environment.json         # optional Cloud Agent bootstrap
├── apps/
│   ├── site/                    # Cloudflare Pages project root
│   │   ├── AGENTS.md
│   │   ├── index.html
│   │   ├── contact.html
│   │   ├── financing.html
│   │   ├── inventory.html
│   │   ├── thank-you.html
│   │   ├── product*.html
│   │   ├── _redirects
│   │   ├── robots.txt
│   │   ├── sitemap.xml
│   │   ├── style.css
│   │   ├── css/                 # gate / fair / inventory CSS
│   │   ├── js/                  # all site JS (was root *.js)
│   │   ├── assets/
│   │   │   ├── brand/           # logos, trust badges
│   │   │   ├── lifestyle/
│   │   │   ├── products/
│   │   │   ├── reviews/
│   │   │   └── showroom/
│   │   ├── hot-tubs/
│   │   ├── swim-spas/
│   │   ├── saunas/
│   │   ├── find-my-spa/
│   │   ├── campaigns/
│   │   │   ├── redrivervalleyfair/
│   │   │   ├── inventoryredrivervalleyfair/
│   │   │   ├── hot-tub-offer/
│   │   │   └── chat-widget-test/   # or archive under docs/ if unused
│   │   └── functions/
│   │       ├── api/lead.js
│   │       └── lib/*.js
│   └── dashboard/               # SOPs + Apps Script (not a Pages app)
│       ├── AGENTS.md
│       ├── README.md
│       ├── *.md                 # existing SOP files
│       └── ghl-lead-sync/
├── packages/
│   └── agency-starter/          # portable kit (was /agency-starter)
│       ├── AGENTS.md
│       └── …existing kit files…
├── scripts/                     # stays at root (shared)
│   ├── ga4-funnel-report.mjs
│   └── reimport-missed-leads.mjs
├── docs/
│   ├── PLAYBOOK.md              # was DEALERSHIP_CONVERSION_PLAYBOOK.md
│   ├── research/
│   │   └── cursor-project-org-july-2026.json
│   └── superpowers/plans/
│       └── 2026-07-09-cursor-project-structure.md  # this file
└── .github/                     # optional later: CODEOWNERS, CI
```

### Path rewrite rules (agents must follow during migration)

| Old path | New path |
|----------|----------|
| `/*.html` (site pages) | `apps/site/*.html` |
| `/*.js` (site scripts) | `apps/site/js/*.js` |
| `style.css`, gate CSS | `apps/site/style.css`, `apps/site/css/*` |
| product/lifestyle/logo images | `apps/site/assets/{products,lifestyle,brand,reviews,showroom}/` |
| `hot-tubs/`, `swim-spas/`, `saunas/`, `find-my-spa/` | `apps/site/<same>/` |
| `redrivervalleyfair/`, `hot-tub-offer/`, etc. | `apps/site/campaigns/<name>/` |
| `functions/` | `apps/site/functions/` |
| `dashboard/` | `apps/dashboard/` |
| `agency-starter/` | `packages/agency-starter/` |
| `DEALERSHIP_CONVERSION_PLAYBOOK.md` | `docs/PLAYBOOK.md` |
| `scripts/` | `scripts/` (unchanged) |

HTML that today uses `../foo.js` from category folders must become `../js/foo.js` (or root-absolute `/js/foo.js` if you standardize on absolute paths in Task 6). Prefer **root-absolute** `/js/...` and `/assets/...` after the move so campaign depth does not break paths.

---

## File map (create / modify)

| File | Responsibility |
|------|----------------|
| `AGENTS.md` | Cross-tool agent entry: map, commands, non-negotiables |
| `apps/site/AGENTS.md` | Site-only: HTML patterns, asset folders, deploy |
| `apps/dashboard/AGENTS.md` | Docs-only: do not invent site HTML here |
| `packages/agency-starter/AGENTS.md` | How to copy kit into a new client |
| `.cursor/rules/*.mdc` | Always-on / glob Cursor guardrails |
| `.cursor/skills/*/SKILL.md` | On-demand procedures |
| `.cursorignore` | Keep binaries out of agent context |
| `.gitignore` | Stop ignoring versioned `.cursor` content; keep secrets ignored |
| `package.json` | Point deploy at `apps/site` |
| `README.md` | Update paths for humans |
| `apps/site/_redirects` | Preserve existing redirects; add campaign path redirects if URLs change |
| `docs/PLAYBOOK.md` | Moved conversion playbook |

---

## Task 0: Branch hygiene + stop ignoring agent config

**Files:**
- Modify: `.gitignore`
- Create: `.cursorignore`
- Create: `.cursorindexingignore`
- Create: `.cursor/rules/.gitkeep` (temporary; replaced in Task 8)

- [ ] **Step 1: Confirm you are on the plan branch**

```bash
git -C /workspace rev-parse --abbrev-ref HEAD
# Expected: cursor/cursor-project-structure-plan-d10c (or your working branch)
```

- [ ] **Step 2: Rewrite `.gitignore` so rules/skills can be committed**

Replace `.gitignore` contents with:

```gitignore
.DS_Store
.wrangler/
node_modules/
*.log

# Secrets / credentials (never commit)
.env
.env.*
*-ga4*.json
ga4-credentials.json
**/paradise-ga4.json

# Local Cursor MCP secrets (use mcp.json.example in git)
.cursor/mcp.json

# Optional local-only Cursor state
.cursor/*.local.*
```

- [ ] **Step 3: Create `.cursorignore`**

```gitignore
# Large media — agents edit HTML/JS, not binary pixels
apps/site/assets/
**/assets/
*.png
*.jpg
*.jpeg
*.webp
*.gif
*.mp4
*.pdf

# Research dumps / lock noise
docs/research/*.json
package-lock.json
node_modules/
.wrangler/
```

- [ ] **Step 4: Create `.cursorindexingignore`**

```gitignore
# Inherit gitignore semantics; reinforce binaries
apps/site/assets/
docs/research/
*.png
*.jpg
*.jpeg
*.webp
*.gif
*.mp4
```

- [ ] **Step 5: Commit**

```bash
mkdir -p .cursor/rules
touch .cursor/rules/.gitkeep
git add .gitignore .cursorignore .cursorindexingignore .cursor/rules/.gitkeep
git commit -m "chore: version Cursor ignore files and allow committing rules"
```

---

## Task 1: Root AGENTS.md + human README pointer

**Files:**
- Create: `AGENTS.md`
- Modify: `README.md`

- [ ] **Step 1: Create root `AGENTS.md` (keep under ~8 KiB)**

```markdown
# AGENTS.md — Paradise Spas / dealer website template

## What this repo is
Static Cloudflare Pages dealer site (Paradise Spas) + Pages Functions lead API +
agency-starter kit + dashboard SOPs. **Vanilla HTML/CSS/JS only** in `apps/site`.
Do not introduce React/Vue/Next unless a human explicitly asks.

## Open Cursor at the repository root
Never open only `apps/site/` as the workspace root — you will lose monorepo context.

## Layout
- `apps/site/` — live website + `functions/` (Pages project root)
- `apps/dashboard/` — Looker/GHL/GA4 SOPs (markdown + Apps Script)
- `packages/agency-starter/` — portable lead-stack kit for other clients
- `scripts/` — GA4 reports / lead reimport
- `docs/PLAYBOOK.md` — conversion playbook (load only when asked)
- `.cursor/rules/` — always-on guardrails
- `.cursor/skills/` — on-demand workflows

## Commands
```bash
npm install
npm run deploy            # production Pages deploy of apps/site
npm run preview:deploy    # preview branch deploy
npm run ga4:funnel        # GA4 funnel report (needs credentials)
```

## Non-negotiables
1. Pages Functions stay at `apps/site/functions/` (same project as HTML).
2. Never commit `.env`, GA4 JSON keys, or `.cursor/mcp.json` secrets.
3. Prefer `/js/...` and `/assets/...` absolute paths in HTML after migration.
4. Tracking IDs and GHL form IDs: search existing files; do not invent new ones.
5. Branch from `master`; one focused PR per change.

## Where to look
| Task | Start here |
|------|------------|
| Homepage / inventory / products | `apps/site/` |
| Lead API / GHL / Sheets / CAPI | `apps/site/functions/` |
| Campaign landers | `apps/site/campaigns/` |
| Analytics SOPs | `apps/dashboard/` |
| New non-dealer client kit | `packages/agency-starter/` |
| Conversion strategy prose | `docs/PLAYBOOK.md` |
```

- [ ] **Step 2: Add a short “Agent / structure” section to the top of `README.md` after the live site line**

Insert after the hosting line:

```markdown
## Repo layout (for humans + Cursor)

| Path | What |
|------|------|
| `apps/site/` | Website + Cloudflare Pages Functions |
| `apps/dashboard/` | ROAS dashboard / tracking SOPs |
| `packages/agency-starter/` | Copy-paste lead stack for other sites |
| `docs/PLAYBOOK.md` | Conversion playbook |
| `AGENTS.md` | Instructions for coding agents |

Open this repository at the **root** in Cursor.
```

- [ ] **Step 3: Commit**

```bash
git add AGENTS.md README.md
git commit -m "docs: add AGENTS.md and document monorepo layout"
```

---

## Task 2: Create destination directories (empty scaffold)

**Files:**
- Create directories under `apps/site`, `apps/dashboard`, `packages`

- [ ] **Step 1: Create scaffold**

```bash
mkdir -p \
  apps/site/{js,css,assets/{brand,lifestyle,products,reviews,showroom},campaigns,functions} \
  apps/dashboard \
  packages \
  docs
```

- [ ] **Step 2: Add placeholder `apps/site/AGENTS.md`**

```markdown
# apps/site — Cloudflare Pages project

Deploy root for Wrangler: `apps/site`.
Static HTML + `functions/` live here together.
Assets: `assets/`; scripts: `js/`; campaign landers: `campaigns/`.
```

- [ ] **Step 3: Commit**

```bash
git add apps packages docs
git commit -m "chore: scaffold apps/site, apps/dashboard, packages"
```

---

## Task 3: Move Pages Functions into `apps/site/functions`

**Files:**
- Move: `functions/**` → `apps/site/functions/**`

- [ ] **Step 1: Move with git**

```bash
git mv functions/api apps/site/functions/api
git mv functions/lib apps/site/functions/lib
rmdir functions 2>/dev/null || true
```

- [ ] **Step 2: Verify imports still resolve relative to each other**

```bash
rg -n "from '\\./|from \"\\./|require\\(" apps/site/functions || true
ls -R apps/site/functions
# Expected: api/lead.js and lib/{alert,cors,ghl,meta-capi,sheets,validate}.js
```

- [ ] **Step 3: Commit**

```bash
git add -A apps/site/functions
git status
git commit -m "refactor: colocate Pages Functions under apps/site"
```

---

## Task 4: Move site JS and CSS

**Files:**
- Move root `*.js` site scripts → `apps/site/js/`
- Move CSS → `apps/site/` or `apps/site/css/`

- [ ] **Step 1: Move JS**

```bash
git mv call-tracking.js category-page.js fair-in-person-modal.js fair-nurture.js \
  ghl-modal.js inventory-gate.js inventory-hot-tubs.js lead-form.js native-form.js \
  pricing-tracking.js product-page.js rrvf-fair-countdown.js traffic-attribution.js \
  view-content.js apps/site/js/
```

- [ ] **Step 2: Move CSS**

```bash
git mv style.css apps/site/style.css
git mv fair-nurture.css inventory-gate.css inventory-gate-fair.css inventory-hot-tubs.css \
  apps/site/css/
```

- [ ] **Step 3: Commit**

```bash
git commit -m "refactor: move site JS/CSS under apps/site"
```

---

## Task 5: Move HTML pages and category folders

**Files:**
- Move root HTML + category dirs into `apps/site/`

- [ ] **Step 1: Move top-level HTML**

```bash
git mv index.html contact.html financing.html inventory.html thank-you.html \
  inventory-gate-demo.html product.html product-artesian-748b.html \
  product-osaki-chair.html product-pro6-sauna.html product-swim-spa.html \
  apps/site/
```

- [ ] **Step 2: Move category / quiz folders**

```bash
git mv hot-tubs swim-spas saunas find-my-spa apps/site/
```

- [ ] **Step 3: Move campaigns**

```bash
git mv redrivervalleyfair inventoryredrivervalleyfair \
  redrivervalleyavailableinventoryonly hot-tub-offer chat-widget-test \
  apps/site/campaigns/
```

- [ ] **Step 4: Move redirects + SEO files**

```bash
git mv _redirects robots.txt sitemap.xml apps/site/
```

- [ ] **Step 5: Commit**

```bash
git commit -m "refactor: move HTML, categories, and campaigns under apps/site"
```

---

## Task 6: Move assets + rewrite HTML/CSS/JS references

**Files:**
- Move images into `apps/site/assets/...`
- Modify: every HTML/CSS/JS under `apps/site` that references old paths
- Modify: `apps/site/_redirects` if campaign URLs must stay stable

- [ ] **Step 1: Move brand / lifestyle / product / review / showroom assets**

```bash
# Brand
git mv paradiselogo.svg paradiselogofooter.svg logo.png logo-header.png \
  footer-logo.webp footer-logo-transparent.png \
  "trust badge.png" trust-badge-30-years.png \
  "hot tub store coupon.png" apps/site/assets/brand/ 2>/dev/null || true

# Lifestyle + hero
git mv lifestyle-hot-tub.png lifestyle-massage-chair.png lifestyle-sauna.png \
  lifestyle-swim-spa.png hero-storefront.png rrvf-fair-teaser.png \
  apps/site/assets/lifestyle/

# Products
git mv product-*.png apps/site/assets/products/

# Reviews
git mv review-carol.png review-katie.png review-stephanie.png \
  apps/site/assets/reviews/

# Showroom
git mv showroom-interior.webp showroom-staff.webp apps/site/assets/showroom/
```

Rename files with spaces to kebab-case while moving if still present:

```bash
cd apps/site/assets/brand
[ -f "trust badge.png" ] && git mv "trust badge.png" trust-badge.png
[ -f "hot tub store coupon.png" ] && git mv "hot tub store coupon.png" hot-tub-store-coupon.png
cd /workspace
```

- [ ] **Step 2: Standardize script/link tags to absolute paths**

In all `apps/site/**/*.html`, rewrite:

| Old pattern | New pattern |
|-------------|-------------|
| `src="call-tracking.js"` / `src="../call-tracking.js"` | `src="/js/call-tracking.js"` |
| `src="../ghl-modal.js"` etc. | `src="/js/<file>.js"` |
| `href="style.css"` / `href="../style.css"` | `href="/style.css"` |
| `href="inventory-gate.css"` | `href="/css/inventory-gate.css"` |
| `src="../paradiselogo.svg"` | `src="/assets/brand/paradiselogo.svg"` |
| `src="../lifestyle-*.png"` | `src="/assets/lifestyle/..."` |
| `src="../product-*.png"` | `src="/assets/products/..."` |
| `src="../review-*.png"` | `src="/assets/reviews/..."` |
| `src="../showroom-*.webp"` | `src="/assets/showroom/..."` |

Run a mechanical pass (review diff carefully):

```bash
# Example: rewrite common script refs (adjust after inspecting rg results)
rg -l 'src="(\.\./)?(call-tracking|ghl-modal|lead-form|native-form|pricing-tracking|traffic-attribution|view-content|category-page|product-page|inventory-gate|inventory-hot-tubs|fair-nurture|fair-in-person-modal|rrvf-fair-countdown)\.js' apps/site
```

Prefer a small Node rewrite script committed under `scripts/rewrite-asset-paths.mjs` if the file count is large; otherwise use targeted search-replace per folder (`index.html`, `hot-tubs/`, campaigns).

- [ ] **Step 3: Preserve public URLs for campaigns**

If production currently serves `/redrivervalleyfair/` at repo root, either:

**Option A (preferred):** keep physical folder at `apps/site/redrivervalleyfair/` (not under `campaigns/`) so URLs stay identical, **or**

**Option B:** add `_redirects` / duplicate path aliases.

If you already moved under `campaigns/`, add to `apps/site/_redirects`:

```
/redrivervalleyfair /campaigns/redrivervalleyfair/ 301
/redrivervalleyfair/ /campaigns/redrivervalleyfair/ 301
/inventoryredrivervalleyfair /campaigns/inventoryredrivervalleyfair/ 301
/inventoryredrivervalleyfair/ /campaigns/inventoryredrivervalleyfair/ 301
/hot-tub-offer /campaigns/hot-tub-offer/ 301
/hot-tub-offer/ /campaigns/hot-tub-offer/ 301
/redrivervalleyavailableinventoryonly /campaigns/inventoryredrivervalleyfair/ 301
/redrivervalleyavailableinventoryonly/ /campaigns/inventoryredrivervalleyfair/ 301
```

(Keep existing lines from the old `_redirects`.)

- [ ] **Step 4: Smoke-check for leftover root-relative broken refs**

```bash
rg -n 'src="\.\./[a-z].*\.(js|css|png|svg|webp|jpg)"' apps/site || true
rg -n 'href="\.\./.*\.(css)"' apps/site || true
# Expected: no matches (or only intentional external/docs links)
```

- [ ] **Step 5: Commit**

```bash
git add apps/site
git commit -m "refactor: relocate assets and rewrite site paths to /js and /assets"
```

---

## Task 7: Move dashboard, agency-starter, playbook; update package.json

**Files:**
- Move: `dashboard/` → `apps/dashboard/`
- Move: `agency-starter/` → `packages/agency-starter/`
- Move: `DEALERSHIP_CONVERSION_PLAYBOOK.md` → `docs/PLAYBOOK.md`
- Modify: `package.json`
- Modify: path references inside moved READMEs

- [ ] **Step 1: Move packages**

```bash
git mv dashboard apps/dashboard
git mv agency-starter packages/agency-starter
git mv DEALERSHIP_CONVERSION_PLAYBOOK.md docs/PLAYBOOK.md
```

- [ ] **Step 2: Update root `package.json` scripts**

```json
{
  "name": "hot-tub-dealer-website-template",
  "private": true,
  "scripts": {
    "deploy": "npx wrangler pages deploy apps/site --project-name paradise-spas --branch main",
    "preview:deploy": "npx wrangler pages deploy apps/site --project-name paradise-spas --branch preview",
    "ga4:funnel": "node scripts/ga4-funnel-report.mjs",
    "ga4:pages": "node scripts/ga4-funnel-report.mjs --all-pages",
    "check:structure": "node scripts/check-structure.mjs"
  },
  "devDependencies": {
    "wrangler": "latest"
  }
}
```

- [ ] **Step 3: Fix internal doc links**

In `packages/agency-starter/README.md`, change `../dashboard/` references to `../../apps/dashboard/`.

In `apps/dashboard/README.md`, change site file references like `` `call-tracking.js` `` to `` `apps/site/js/call-tracking.js` ``.

- [ ] **Step 4: Add nested AGENTS.md files**

`apps/dashboard/AGENTS.md`:

```markdown
# apps/dashboard
Markdown SOPs + `ghl-lead-sync` Apps Script for Looker / GHL / GA4.
Do not put live website HTML here. Site code lives in `apps/site/`.
```

`packages/agency-starter/AGENTS.md`:

```markdown
# packages/agency-starter
Portable lead stack for non-dealer sites. Copy into a new project root.
Canonical dealer implementation lives in `apps/site/` (may diverge — prefer site as source of truth for Paradise).
```

- [ ] **Step 5: Commit**

```bash
git add package.json apps/dashboard packages/agency-starter docs/PLAYBOOK.md
git commit -m "refactor: move dashboard, agency-starter, and playbook out of site root"
```

---

## Task 8: Cursor rules (always-on / glob)

**Files:**
- Create: `.cursor/rules/00-project-overview.mdc`
- Create: `.cursor/rules/10-static-html-site.mdc`
- Create: `.cursor/rules/20-pages-functions.mdc`
- Create: `.cursor/rules/30-tracking-and-leads.mdc`
- Create: `.cursor/rules/40-git-and-prs.mdc`
- Delete: `.cursor/rules/.gitkeep`

- [ ] **Step 1: Write `00-project-overview.mdc`**

```markdown
---
description: Repo map and non-negotiables for Paradise Spas dealer template
alwaysApply: true
---

# Project overview

- Read `AGENTS.md` first. Open the workspace at the repo root.
- Live site + Pages Functions: `apps/site/`.
- SOPs: `apps/dashboard/`. Portable kit: `packages/agency-starter/`.
- Playbook: `docs/PLAYBOOK.md` — open only when the task is conversion strategy.
- Vanilla HTML/CSS/JS only in `apps/site` unless a human explicitly requests a framework.
```

- [ ] **Step 2: Write `10-static-html-site.mdc`**

```markdown
---
description: HTML/CSS/JS conventions for apps/site
globs:
  - apps/site/**/*.{html,css,js}
alwaysApply: false
---

# Static site conventions

- Prefer absolute asset paths: `/js/...`, `/css/...`, `/assets/...`, `/style.css`.
- Reuse existing modal/form patterns (`ghl-modal.js`, `lead-form.js`, `native-form.js`).
- Do not inline huge base64 images; put files under `apps/site/assets/`.
- Match existing brand colors in `style.css` (`#0d4cae`, `#F0A500`) unless asked to rebrand.
- Keep category pages consistent with `hot-tubs/`, `swim-spas/`, `saunas/`.
```

- [ ] **Step 3: Write `20-pages-functions.mdc`**

```markdown
---
description: Cloudflare Pages Functions lead API rules
globs:
  - apps/site/functions/**/*.js
alwaysApply: false
---

# Pages Functions

- Functions MUST remain under `apps/site/functions/` (same Pages project as HTML).
- Reuse `lib/validate.js`, `lib/ghl.js`, `lib/sheets.js`, `lib/meta-capi.js`, `lib/cors.js`, `lib/alert.js`.
- Never log PII (phone/email) in full. Never commit API keys — use Pages env vars.
- Await all async work. Keep handlers small; put logic in `lib/`.
```

- [ ] **Step 4: Write `30-tracking-and-leads.mdc`**

```markdown
---
description: Tracking pixels, GA4 events, GHL form IDs
globs:
  - apps/site/**/*.{html,js}
  - apps/dashboard/**/*.md
alwaysApply: false
---

# Tracking & leads

- Do not invent new Meta Pixel / GA4 / Clarity / GHL IDs — search the repo for current values.
- Thank-you conversion value and event names must stay consistent with `thank-you.html` and dashboard SOPs.
- Call / pricing events live in `apps/site/js/call-tracking.js` and `pricing-tracking.js`.
```

- [ ] **Step 5: Write `40-git-and-prs.mdc`**

```markdown
---
description: Branching and PR expectations for agents
alwaysApply: true
---

# Git & PRs

- Base branch: `master`.
- Branch naming: `cursor/<descriptive-slug>-d10c` (Cloud) or `agent/<scope>-<slug>` (local).
- One concern per PR. Prefer draft PRs from agents; humans merge.
- Do not commit secrets, GA4 credential JSON, or `.cursor/mcp.json`.
```

- [ ] **Step 6: Commit**

```bash
git rm -f .cursor/rules/.gitkeep 2>/dev/null || true
git add .cursor/rules
git commit -m "feat: add Cursor project rules for site, functions, tracking, git"
```

---

## Task 9: Cursor skills (on-demand)

**Files:**
- Create: `.cursor/skills/new-landing-page/SKILL.md`
- Create: `.cursor/skills/new-client-from-agency-starter/SKILL.md`
- Create: `.cursor/skills/lead-api-change/SKILL.md`
- Create: `.cursor/skills/deploy-preview/SKILL.md`

- [ ] **Step 1: `new-landing-page/SKILL.md`**

```markdown
---
name: new-landing-page
description: Create a new campaign landing page under apps/site/campaigns with tracking, form wiring, and redirects.
---

# New landing page

1. Copy a similar campaign folder under `apps/site/campaigns/<slug>/`.
2. Reuse `/js/ghl-modal.js`, `/js/lead-form.js`, `/js/call-tracking.js`, `/js/pricing-tracking.js`.
3. Put images in `apps/site/campaigns/<slug>/` or `apps/site/assets/` (not repo root).
4. Add `_redirects` aliases if a short public URL is required.
5. Update `sitemap.xml` if the page should be indexed.
6. Open a PR from `master` with only campaign files + redirects.
```

- [ ] **Step 2: `new-client-from-agency-starter/SKILL.md`**

```markdown
---
name: new-client-from-agency-starter
description: Bootstrap a new non-dealer client site from packages/agency-starter using CLIENT.config.json.
---

# New client from agency-starter

1. Read `packages/agency-starter/README.md` and `CLIENT.config.json`.
2. Copy kit into the new site root (or new repo) — do not overwrite Paradise `apps/site` unless asked.
3. Fill config; wire snippets into HTML; set Pages env for lead API.
4. Follow `apps/dashboard/AGENCY_TRACKING_AND_LEADS_SOP.md` for tracking.
```

- [ ] **Step 3: `lead-api-change/SKILL.md`**

```markdown
---
name: lead-api-change
description: Change Cloudflare Pages lead API validation, GHL mapping, Sheets backup, or Meta CAPI.
---

# Lead API change

1. Edit `apps/site/functions/api/lead.js` and/or `apps/site/functions/lib/*`.
2. Keep CORS via `lib/cors.js`. Validate with `lib/validate.js`.
3. Mirror any source-name mappings in dashboard SOPs if user-facing.
4. Never commit secrets; document new env var names in `apps/dashboard/LEAD_INSURANCE_OWNER_SETUP.md`.
5. Test with a dry request plan; deploy via `npm run preview:deploy` when credentials exist.
```

- [ ] **Step 4: `deploy-preview/SKILL.md`**

```markdown
---
name: deploy-preview
description: Deploy a Cloudflare Pages preview of apps/site with Wrangler.
---

# Deploy preview

```bash
npm install
export CLOUDFLARE_ACCOUNT_ID=...
npm run preview:deploy
```

Confirm `package.json` deploys `apps/site`, not repo root.
```

- [ ] **Step 5: Commit**

```bash
git add .cursor/skills
git commit -m "feat: add Cursor skills for landers, agency kit, lead API, deploy"
```

---

## Task 10: Structure check script + MCP example + environment stub

**Files:**
- Create: `scripts/check-structure.mjs`
- Create: `.cursor/mcp.json.example`
- Create: `.cursor/environment.json`

- [ ] **Step 1: Write `scripts/check-structure.mjs`**

```javascript
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "AGENTS.md",
  "apps/site/index.html",
  "apps/site/functions/api/lead.js",
  "apps/site/js/lead-form.js",
  "apps/site/style.css",
  "apps/dashboard/README.md",
  "packages/agency-starter/README.md",
  "docs/PLAYBOOK.md",
  ".cursor/rules/00-project-overview.mdc",
  ".cursorignore",
];

const forbiddenAtRoot = [
  "index.html",
  "functions",
  "style.css",
  "agency-starter",
  "dashboard",
  "DEALERSHIP_CONVERSION_PLAYBOOK.md",
];

let failed = false;
for (const rel of required) {
  if (!fs.existsSync(path.join(root, rel))) {
    console.error("MISSING:", rel);
    failed = true;
  }
}
for (const rel of forbiddenAtRoot) {
  if (fs.existsSync(path.join(root, rel))) {
    console.error("SHOULD NOT EXIST AT ROOT:", rel);
    failed = true;
  }
}

if (failed) {
  process.exit(1);
}
console.log("Structure check passed.");
```

- [ ] **Step 2: Run the check (expect fail until migration complete; after Task 7 it should pass)**

```bash
node scripts/check-structure.mjs
# Expected after full migration: "Structure check passed."
```

- [ ] **Step 3: Add `.cursor/mcp.json.example`**

```json
{
  "mcpServers": {
    "cloudflare-docs": {
      "command": "npx",
      "args": ["-y", "@cloudflare/mcp-server-cloudflare"],
      "env": {}
    }
  }
}
```

(Adjust to match the user’s already-installed MCP servers; this file is a template only.)

- [ ] **Step 4: Add `.cursor/environment.json` stub for Cloud Agents**

```json
{
  "snapshot": "OPTIONAL_SNAPSHOT_ID",
  "install": "npm install",
  "terminals": []
}
```

- [ ] **Step 5: Commit**

```bash
git add scripts/check-structure.mjs .cursor/mcp.json.example .cursor/environment.json package.json
git commit -m "chore: add structure check script and Cursor env/MCP templates"
```

---

## Task 11: Final verification + README path sweep

**Files:**
- Modify: any remaining docs still pointing at old paths
- Test: structure check, ripgrep for stale paths

- [ ] **Step 1: Stale path scan**

```bash
rg -n 'DEALERSHIP_CONVERSION_PLAYBOOK|/agency-starter|functions/api/lead|call-tracking\\.js' \
  README.md AGENTS.md apps/dashboard packages/agency-starter docs || true
```

Update any hits to new paths.

- [ ] **Step 2: Run structure check**

```bash
npm run check:structure
# Expected: Structure check passed.
```

- [ ] **Step 3: Confirm root is clean of site runtime files**

```bash
ls -1
# Expected top-level: AGENTS.md, README.md, apps, packages, scripts, docs, package.json, .cursor*, .git*
# Not expected: index.html, style.css, functions/, product-*.png
```

- [ ] **Step 4: Commit doc fixes if any**

```bash
git add -A
git status
git commit -m "docs: finish path updates after Cursor-oriented restructure"
```

- [ ] **Step 5: Push branch**

```bash
git push -u origin HEAD
```

---

## Task 12 (human / local Cursor): Plugins, MCP, branching defaults

Not fully automatable in Cloud without your Cursor UI — do this on your machine after the PR merges (or in parallel).

- [ ] **Step 1: Open repo at root in Cursor Desktop**

- [ ] **Step 2: Install Cloudflare plugin** (`/add-plugin cloudflare`) per [Cursor + Cloudflare](https://developers.cloudflare.com/agent-setup/cursor/)

- [ ] **Step 3: Copy `.cursor/mcp.json.example` → `.cursor/mcp.json` and wire your existing MCP servers (GitLab, Parallel, Cloudflare, etc.). Keep `mcp.json` gitignored.

- [ ] **Step 4: Confirm GitHub/GitLab default branch is `master` and Cloud Agents base on `master`

- [ ] **Step 5: Optional: add CODEOWNERS requiring human review for `apps/site/functions/**`

---

## Migration order summary (one PR stream or stacked PRs)

| Order | Task | Why this order |
|------:|------|----------------|
| 0 | Ignore + allow versioning `.cursor` | Agents need rules in git before/while moving code |
| 1 | AGENTS.md | Context before file moves |
| 2 | Scaffold dirs | Destinations exist |
| 3 | Move `functions/` | Highest-risk deploy coupling |
| 4 | Move JS/CSS | Before HTML rewrites |
| 5 | Move HTML/campaigns | Needs JS/CSS destinations |
| 6 | Move assets + rewrite paths | Noisiest; after HTML locations known |
| 7 | Move dashboard / agency / playbook + package.json | Clears root; fixes deploy root |
| 8 | Rules | Tree stable → globs correct |
| 9 | Skills | Depend on final paths |
| 10 | check-structure + env templates | Locks the contract |
| 11 | Verify + push | Proof |
| 12 | Human MCP/plugin | Local secrets |

---

## Self-review (plan author checklist)

1. **Spec coverage:** Research asked for target tree, setup order, branching, rules/skills/MCP split, asset isolation, Cloudflare Pages reality — all covered; functions stay colocated with site (corrected from research’s optional second Pages app).
2. **Placeholder scan:** No TBD/TODO steps; file bodies included.
3. **Consistency:** Trunk is `master`; deploy path is `apps/site`; absolute `/js` + `/assets` path strategy is consistent across tasks.
4. **YAGNI:** No pnpm workspaces, no second Pages project, no React, no forced `main` rename.

---

## Execution handoff

Plan complete and saved to `docs/superpowers/plans/2026-07-09-cursor-project-structure.md`.

**Two execution options:**

1. **Subagent-Driven (recommended)** — dispatch a fresh subagent per task, review between tasks, fast iteration (`superpowers:subagent-driven-development`).
2. **Inline Execution** — execute tasks in this session with checkpoints (`superpowers:executing-plans`).

Which approach?
