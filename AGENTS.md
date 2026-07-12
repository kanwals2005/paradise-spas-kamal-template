# AGENTS.md — Paradise Spas client website

## What this repo is

**Paradise Spas client site** — static Cloudflare Pages dealer website + Pages Functions lead API + dashboard SOPs.

- **Production stack:** vanilla HTML/CSS/JS in `apps/site` — no React/Vue/Next unless a human explicitly asks.
- **Not in production:** Convex database, SaaS platform, multi-tenant backend.

## Current runtime vs agent tooling

| Layer | In production? | Location |
|-------|----------------|----------|
| Static site + lead API | Yes | `apps/site/`, `apps/site/functions/` |
| Inventory data | Yes (hardcoded JS) | `apps/site/js/inventory-hot-tubs.js` |
| Dashboard SOPs | Ops only | `apps/dashboard/` |
| Agency starter kit | Other clients | `packages/agency-starter/` |
| Convex / Exa / Ref / GitHub MCP | **Agents only** | `.cursor/mcp.json` (local) |
| Cloudflare MCP | **Agents only** | deploy still uses Wrangler + `.env.local` |

Do not infer that Convex MCP presence means a Convex backend should be added.

## Open Cursor at the repository root

Never open only `apps/site/` as the workspace root — you will lose monorepo context.

## Layout

- `apps/site/` — live website + `functions/` (Pages project root)
- `apps/dashboard/` — Looker/GHL/GA4 SOPs (markdown + Apps Script)
- `packages/agency-starter/` — portable lead-stack kit for **other** clients (secondary)
- `scripts/` — GA4 reports / lead reimport
- `docs/` — architecture, deployment, client operations, QA
- `docs/PLAYBOOK.md` — conversion playbook (load only when asked)
- `docs/superpowers/plans/` — historical implementation plans, not current ops
- `.cursor/rules/` — always-on guardrails
- `.cursor/skills/` — on-demand maintenance workflows

## Client-site docs (read first for maintenance)

| Task | Doc / skill |
|------|-------------|
| Architecture | `docs/ARCHITECTURE.md` |
| Deploy | `docs/DEPLOYMENT.md`, skill `production-deploy-checklist` |
| Env vars | `docs/ENVIRONMENT.md` |
| Content updates | `docs/CLIENT-OPERATIONS.md`, skill `client-content-update` |
| Inventory | `docs/INVENTORY-UPDATE.md`, skill `update-inventory` |
| Forms / leads | skill `form-qa`, `apps/dashboard/LEAD_INSURANCE_OWNER_SETUP.md` |
| QA | `docs/QA-CHECKLIST.md` |

## Commands

```bash
npm install
npm run check:structure   # verify monorepo layout
npm run verify:deploy     # verify deploy targets apps/site
npm run dev               # local Pages + Functions (port 8788)
npm run preview:deploy    # preview branch deploy
npm run deploy            # production Pages deploy of apps/site
npm run ga4:funnel        # GA4 funnel report (needs credentials)
```

## Agent tooling setup (optional, local machine)

- Research policy: `.cursor/rules/50-research-exa.mdc`
- MCP template: copy `.cursor/mcp.json.example` → `.cursor/mcp.json` (gitignored)
- Auth guide: `docs/MCP-VITAL-SETUP.md` — GitHub, Exa, Ref env vars; Cloudflare OAuth; Convex MCP is optional
- Cloudflare: `docs/TASK-12-CURSOR-CLOUDFLARE-SETUP.md`

## Non-negotiables

1. Pages Functions stay at `apps/site/functions/` (same project as HTML).
2. Never commit `.env`, `.env.local`, GA4 JSON keys, or `.cursor/mcp.json` secrets.
3. Prefer `/js/...` and `/assets/...` absolute paths in HTML.
4. Tracking IDs and GHL form IDs: search existing files; do not invent new ones.
5. Branch from `master`; one focused PR per change.
6. Do not add Convex, React, or SaaS architecture for routine client-site tasks.

## Where to look

| Task | Start here |
|------|------------|
| Homepage / inventory / products | `apps/site/` |
| Lead API / GHL / Sheets / CAPI | `apps/site/functions/` |
| Campaign landers | `apps/site/` (existing) or `apps/site/campaigns/` (new) |
| Analytics SOPs | `apps/dashboard/` |
| New non-dealer client kit | `packages/agency-starter/` |
| Conversion strategy prose | `docs/PLAYBOOK.md` |
