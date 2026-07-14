# Paradise Spas — Architecture (current)

This repo is the **Paradise Spas client website**, not a SaaS platform.

## Current runtime

```
Visitor
  → apps/site (static HTML/CSS/JS on Cloudflare Pages)
  → /api/lead (Pages Function)
  → Google Sheets lead vault (required)
  → GoHighLevel contacts API (recommended)
  → Meta Conversions API (optional)
  → GA4 / Clarity / Meta Pixel (client-side)
```

There is **no Convex backend**, **no database**, and **no React/Next app** in production today.

## Repo layers

| Layer | Path | Role |
|-------|------|------|
| Live site | `apps/site/` | Cloudflare Pages deploy root; HTML + `functions/` |
| Lead API | `apps/site/functions/` | `/api/lead` — Sheets vault, GHL, Meta CAPI |
| Inventory | `apps/site/js/inventory-hot-tubs.js` | Hardcoded product data (not DB-backed) |
| Ops SOPs | `apps/dashboard/` | Looker, GHL sync, lead insurance setup |
| Reusable kit | `packages/agency-starter/` | Copy-paste lead stack for **other** clients |
| Scripts | `scripts/` | GA4 reports, missed-lead reimport |
| Agent rules | `.cursor/rules/` | Guardrails for agents |
| Agent skills | `.cursor/skills/` | On-demand maintenance workflows |

## What is NOT production architecture

These exist for **Cursor agents and developers**, not for site visitors:

| Tool | Purpose |
|------|---------|
| Convex MCP | Agent tooling only — no `convex/` backend in this repo |
| Exa / Ref MCP | External research when editing docs or integrations |
| GitHub MCP | PRs and repo operations from Cursor |
| Cloudflare MCP | Docs, builds, logs — deploy still uses Wrangler + `.env.local` |

Do not add Convex, React, or a multi-tenant backend unless a human explicitly approves a separate project phase.

## Critical constraint

Pages Functions **must** stay under `apps/site/functions/` in the same Cloudflare Pages project as the static HTML. Do not split functions into a separate deploy target.

## Related docs

- [DEPLOYMENT.md](./DEPLOYMENT.md) — how to deploy safely
- [ENVIRONMENT.md](./ENVIRONMENT.md) — env vars by layer
- [INVENTORY-UPDATE.md](./INVENTORY-UPDATE.md) — how inventory is maintained today
- [apps/dashboard/LEAD_INSURANCE_OWNER_SETUP.md](../../apps/dashboard/LEAD_INSURANCE_OWNER_SETUP.md) — lead API setup
- [docs/agent/STACK.md](../agent/STACK.md) — current vs future stack

Historical plans: `docs/archive/plans/` — not current operating instructions.
