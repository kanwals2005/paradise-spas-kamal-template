# Conventions

## Git

- Base branch: `master`
- Agent branches: `cursor/<descriptive-slug>-d10c` (Cloud) or `agent/<scope>-<slug>` (local)
- One concern per PR; prefer draft PRs; humans merge

## Secrets

Never commit: `.env`, `.env.local`, `.cursor/mcp.json`, GA4 credential JSON, API tokens.

Templates: `.env.example`, `.cursor/mcp.json.example`, `apps/dashboard/lead-api.env.example`.

## Stack discipline

Follow [`STACK.md`](./STACK.md). Routine Paradise work stays on the Cloudflare static site + Pages Functions.
