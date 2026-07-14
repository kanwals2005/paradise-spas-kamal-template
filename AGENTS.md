# AGENTS.md — Paradise Spas / Kamal

## Mission

Dealer client site for Paradise Spas: static HTML lead capture → Cloudflare Pages Function → Google Sheets vault → GoHighLevel → Meta CAPI. Preserve lead reliability and Day-2 updateability.

## Non-goals (this tree)

- Do not rewrite the live Pages site as Next.js or move hosting unless the user explicitly scopes that work.
- Do not treat Convex / Vercel as production dependencies of the current site.
- Do not invent product features not requested by the client.

## Where truth lives

| Need | Path |
|------|------|
| Product orientation | [docs/agent/README.md](docs/agent/README.md) |
| Stack (Cloudflare / Convex / future Next) | [docs/agent/STACK.md](docs/agent/STACK.md) |
| Full path map | [docs/agent/NAVIGATION.md](docs/agent/NAVIGATION.md) |
| Naming / no-redundancy | [docs/agent/CONVENTIONS.md](docs/agent/CONVENTIONS.md) |
| Architecture & lead pipeline | [docs/ops/ARCHITECTURE.md](docs/ops/ARCHITECTURE.md) |
| Deploy / promote / rollback | [docs/ops/DEPLOYMENT.md](docs/ops/DEPLOYMENT.md) |
| Env & secrets | [docs/ops/ENVIRONMENT.md](docs/ops/ENVIRONMENT.md) |
| Inventory edits | [docs/ops/INVENTORY-UPDATE.md](docs/ops/INVENTORY-UPDATE.md) |
| QA before promote | [docs/ops/QA-CHECKLIST.md](docs/ops/QA-CHECKLIST.md) |
| Lead recovery | [docs/ops/LEAD-RECOVERY.md](docs/ops/LEAD-RECOVERY.md) |
| Client weekly ops | [docs/ops/CLIENT-OPERATIONS.md](docs/ops/CLIENT-OPERATIONS.md) |
| MCP / tooling | [docs/tooling/](docs/tooling/) |
| Human playbook | [docs/PLAYBOOK.md](docs/PLAYBOOK.md) |
| Active plans | [docs/plans/](docs/plans/) |
| Structure guard | `npm run check:structure` · path map in [docs/agent/NAVIGATION.md](docs/agent/NAVIGATION.md) |

## Hard constraints

1. Prefer updating inventory / copy over new frameworks.
2. Never break `/api/lead` Sheets → GHL → Meta order.
3. Never commit secrets; use Wrangler secrets / `.env.local` (gitignored).
4. Secrets and durable lead state stay outside ephemeral Workers memory — see ops Architecture.
5. Preview before promote; run `npm run verify:deploy` and QA when changing site or Functions.

## Agent workflow (progressive disclosure)

1. Read this file, then [docs/agent/README.md](docs/agent/README.md) if stacking or paths are unclear.
2. Load only the ops doc required for the task (deploy, inventory, lead recovery, etc.).
3. Prefer a matching skill under [`.cursor/skills/`](.cursor/skills/) before inventing a procedure.
4. Nested `AGENTS.md` under `apps/*` and `packages/agency-starter/` — package deltas only.
5. If documentation disagrees with `apps/site` or Workers code, **code wins**; update the doc.

## Verification

```bash
npm run check:structure
npm run verify:deploy
```

Promote only after preview + QA ([docs/ops/QA-CHECKLIST.md](docs/ops/QA-CHECKLIST.md)).
