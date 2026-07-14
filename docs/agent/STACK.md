# Stack — current vs future

## Current (production)

Paradise Spas is a **vanilla HTML/CSS/JS** dealer site on **Cloudflare Pages**, with a **Pages Function** lead API at `/api/lead`.

| Piece | Location |
|-------|----------|
| Static site | `apps/site/` |
| Lead API | `apps/site/functions/` |
| Inventory data | `apps/site/js/inventory-hot-tubs.js` (hardcoded JS, not a database) |
| Deploy | Wrangler → Pages project `paradise-spas` |

**Do not** introduce React, Next.js, Vue, or a Convex backend for routine content, inventory, or lead-API tasks.

## Future intent (not started)

| Intent | Status |
|--------|--------|
| Next.js website | Planned later — **no scaffold in this repo yet** |
| Vercel hosting | Planned with Next — Cloudflare remains live until cutover |
| Convex / SaaS platform | Out of scope for this client site unless explicitly approved |

Agents must treat **current** as the source of truth. Do not scaffold `apps/web`, change deploy targets, or migrate `/api/lead` unless a human opens a dedicated migration task.

## Agent tooling (not runtime)

Cloudflare / GitHub / Exa / Ref / optional Convex **MCP** servers help agents research and operate. They are not the live stack. See [`../tooling/`](../tooling/).
