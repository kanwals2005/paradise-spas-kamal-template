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
- Research policy (Exa / Parallel / Ref): `.cursor/rules/50-research-exa.mdc` — applies when tasks need external docs, not for local code edits.
- Vital MCP auth (Convex, GitHub, Exa, Ref): `docs/MCP-VITAL-SETUP.md` — copy `.cursor/mcp.json.example` → `.cursor/mcp.json`, set env vars, Connect in Tools & MCP.

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
