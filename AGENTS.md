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
npm run check:structure   # verify monorepo layout
npm run verify:deploy     # verify deploy targets apps/site
npm run deploy            # production Pages deploy of apps/site
npm run preview:deploy    # preview branch deploy
npm run ga4:funnel        # GA4 funnel report (needs credentials)
```

## Cursor + Cloudflare (Task 12 — human setup)
See `docs/TASK-12-CURSOR-CLOUDFLARE-SETUP.md`. Summary: open repo at root, run `/add-plugin cloudflare`, copy `.cursor/mcp.json.example` → `.cursor/mcp.json`, OAuth-connect MCP servers, confirm GitHub default branch is `master`, run `npm run verify:deploy` before production deploy.

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
| Campaign landers | `apps/site/` (existing) or `apps/site/campaigns/` (new) |
| Analytics SOPs | `apps/dashboard/` |
| New non-dealer client kit | `packages/agency-starter/` |
| Conversion strategy prose | `docs/PLAYBOOK.md` |

## Cursor Cloud specific instructions

Deps are `npm install` at repo root (installs `wrangler` + `dotenv-cli` only; no build step, no lint/test suite). `npm run check:structure` and `npm run verify:deploy` are the only "check" commands.

**Run the site + lead API locally (single dev process):**
```bash
cd apps/site && npx wrangler pages dev . --ip 127.0.0.1 --port 8788 --compatibility-date=2026-07-07
```
Serves the static site and the `/api/lead` Pages Function together on `http://127.0.0.1:8788`.

Non-obvious gotchas:
- **Run from `apps/site`, not the repo root.** `wrangler pages dev apps/site` from the root does NOT read `apps/site/wrangler.jsonc` and logs `No Functions. Shimming...` (the lead API won't load). Running with cwd=`apps/site` (`wrangler pages dev .`) picks up the config and `functions/`.
- **Override the compatibility date.** The bundled local `workerd` runtime lags the calendar; it currently supports dates only up to ~`2026-07-07`, while `wrangler.jsonc` sets a newer date. Without `--compatibility-date=<supported date>` the runtime fails to start (`newest date supported by this server binary is ...`). This is dev-only; do not lower the date in `wrangler.jsonc`.
- **`POST /api/lead` returns HTTP 503 "Lead vault is not configured yet" by design** when Google Sheets secrets are absent (the only hard dependency). This is expected in the cloud env; the frontend shows the message gracefully. To exercise the full success path, add `GOOGLE_SHEETS_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` (and optional GHL/Turnstile/Meta/Resend keys — see `apps/dashboard/lead-api.env.example`) to `apps/site/.dev.vars` (Wrangler auto-loads it). All non-Sheets integrations degrade gracefully when unset.
- `npm run deploy` / `preview:deploy` need Cloudflare creds in `.env.local` and are not required for local dev.
