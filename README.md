# Paradise Spas — Client Website

Static dealer website for **Paradise Spas** (Minot, ND), hosted on Cloudflare Pages.

**Live site:** https://www.paradisespas.com  
**Hosting:** Cloudflare Pages + Pages Functions (`/api/lead`)

This repo is the **current client site**, not a SaaS platform. Runtime is vanilla HTML/CSS/JS — no Convex backend, no React/Next app in production.

## Repo layout

| Path | What |
|------|------|
| `apps/site/` | Live website + Cloudflare Pages Functions |
| `apps/dashboard/` | ROAS dashboard / tracking / lead-insurance SOPs |
| `packages/agency-starter/` | Reusable lead stack for **other** clients (secondary) |
| `docs/` | Agent orientation, ops, tooling, plans, archive |
| `AGENTS.md` | Instructions for coding agents |

Open this repository at the **root** in Cursor.

## Documentation

| Doc | Purpose |
|-----|---------|
| [docs/agent/](docs/agent/) | Agent orientation — stack, map, conventions |
| [docs/ops/ARCHITECTURE.md](docs/ops/ARCHITECTURE.md) | What runs in production today |
| [docs/ops/DEPLOYMENT.md](docs/ops/DEPLOYMENT.md) | Preview and production deploy |
| [docs/ops/ENVIRONMENT.md](docs/ops/ENVIRONMENT.md) | Env vars by layer |
| [docs/ops/CLIENT-OPERATIONS.md](docs/ops/CLIENT-OPERATIONS.md) | Routine content updates |
| [docs/ops/INVENTORY-UPDATE.md](docs/ops/INVENTORY-UPDATE.md) | Product/pricing in JS |
| [docs/ops/QA-CHECKLIST.md](docs/ops/QA-CHECKLIST.md) | Pre/post deploy smoke tests |
| [docs/ops/LEAD-RECOVERY.md](docs/ops/LEAD-RECOVERY.md) | Missed GHL lead reimport |
| [docs/PLAYBOOK.md](docs/PLAYBOOK.md) | Conversion playbook (strategy) |
| [docs/tooling/](docs/tooling/) | MCP / Cursor machine setup |

Historical plans and research: `docs/archive/` — not day-to-day ops.  
Active plans: `docs/plans/`.

## What's on the live site

- Homepage, inventory, category pages (hot tubs, swim spas, saunas)
- Product detail pages, financing, contact, Find My Spa quiz
- GHL popup + native gate forms
- Thank-you page with conversion tracking ($950 Lead event)
- Meta Pixel, GA4, Clarity, call-click tracking
- Lead vault API (Google Sheets → GHL → Meta CAPI)

## Deploy (Paradise Spas)

```bash
npm install
cp .env.example .env.local   # add CLOUDFLARE_API_TOKEN — never commit
npm run verify:deploy
npm run preview:deploy       # test first
npm run deploy               # production
```

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local dev with Functions — **port 8788** |
| `npm run dev:static` | Static only — port 4321 (no `/api/lead`) |
| `npm run preview:deploy` | Cloudflare preview |
| `npm run deploy` | Production |

See [docs/ops/DEPLOYMENT.md](docs/ops/DEPLOYMENT.md).

## Key files

| File | Purpose |
|------|---------|
| `apps/site/style.css` | Site styling |
| `apps/site/js/inventory-hot-tubs.js` | Inventory product data |
| `apps/site/js/ghl-modal.js` | GHL popup modal |
| `apps/site/js/lead-form.js` | Native gate form handler |
| `apps/site/functions/api/lead.js` | Lead vault API |
| `apps/site/_redirects` | URL redirects |
| `apps/dashboard/LEAD_INSURANCE_OWNER_SETUP.md` | Lead API env setup |

## Reusable kit (other clients)

To bootstrap a **new** non-Paradise site, use `packages/agency-starter/` — see [packages/agency-starter/README.md](packages/agency-starter/README.md).  
Paradise Spas source of truth remains `apps/site/` (may diverge from the kit).

## Cursor / MCP (agents only)

MCP servers (Cloudflare, GitHub, Exa, Ref) help **developers and agents** — they are not part of the live site runtime.  
Convex MCP is optional tooling; this repo has no Convex backend.  
Setup: [docs/tooling/MCP-VITAL-SETUP.md](docs/tooling/MCP-VITAL-SETUP.md), [docs/tooling/TASK-12-CURSOR-CLOUDFLARE-SETUP.md](docs/tooling/TASK-12-CURSOR-CLOUDFLARE-SETUP.md).
