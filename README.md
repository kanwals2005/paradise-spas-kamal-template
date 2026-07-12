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
| `docs/` | Architecture, deployment, operations, QA |
| `AGENTS.md` | Instructions for coding agents |

Open this repository at the **root** in Cursor.

## Documentation

| Doc | Purpose |
|-----|---------|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | What runs in production today |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Preview and production deploy |
| [docs/ENVIRONMENT.md](docs/ENVIRONMENT.md) | Env vars by layer |
| [docs/CLIENT-OPERATIONS.md](docs/CLIENT-OPERATIONS.md) | Routine content updates |
| [docs/INVENTORY-UPDATE.md](docs/INVENTORY-UPDATE.md) | Product/pricing in JS |
| [docs/QA-CHECKLIST.md](docs/QA-CHECKLIST.md) | Pre/post deploy smoke tests |
| [docs/LEAD-RECOVERY.md](docs/LEAD-RECOVERY.md) | Missed GHL lead reimport |
| [docs/PLAYBOOK.md](docs/PLAYBOOK.md) | Conversion playbook (strategy) |

Historical agent implementation plans: `docs/superpowers/plans/` — not day-to-day ops.

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

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

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
Setup: [docs/MCP-VITAL-SETUP.md](docs/MCP-VITAL-SETUP.md), [docs/TASK-12-CURSOR-CLOUDFLARE-SETUP.md](docs/TASK-12-CURSOR-CLOUDFLARE-SETUP.md).
