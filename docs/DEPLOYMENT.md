# Paradise Spas — Deployment

Deploy root is always **`apps/site`**, never the repository root.

## Prerequisites

1. `npm install` (once)
2. Copy `.env.example` → `.env.local` and set `CLOUDFLARE_API_TOKEN` (never commit)
3. Confirm structure: `npm run check:structure`
4. Confirm deploy config: `npm run verify:deploy`

See [ENVIRONMENT.md](./ENVIRONMENT.md) for variable details.

## Local development

| Command | Port | What it runs |
|---------|------|--------------|
| `npm run dev` | **8788** | Wrangler Pages dev — static site **and** `/api/lead` Functions |
| `npm run dev:static` | 4321 | Static files only — **no** lead API |

Use **8788** when testing forms or inventory gate. Port 4321 will not serve `/api/lead`.

Local lead API needs Pages env vars in `apps/site/.dev.vars` (see `apps/dashboard/lead-api.env.example`).

## Safe deploy flow

Always preview before production:

```bash
npm run verify:deploy
npm run preview:deploy
# Smoke test preview URL (see QA-CHECKLIST.md)
npm run deploy
```

| Command | Target |
|---------|--------|
| `npm run preview:deploy` | Cloudflare Pages preview branch |
| `npm run deploy` | Production (`paradise-spas` project) |

Deploy scripts load Wrangler credentials from `.env.local` via `dotenv-cli`. They do **not** upload Cloudflare Pages runtime secrets (GHL, Sheets, etc.) — those are set in the Cloudflare dashboard.

## Cloudflare dashboard (if using Git-connected builds)

**Workers & Pages → paradise-spas → Settings → Builds:**

| Setting | Value |
|---------|--------|
| Build command | *(empty — static site)* |
| Build output directory | `apps/site` |

If output was previously `/` (repo root), fix it before the next git-triggered deploy.

## Post-deploy smoke test

Minimum checks after preview or production:

- `/` loads
- `/hot-tubs/`, `/inventory.html`, `/inventoryredrivervalleyfair/` load
- `/api/lead` responds (OPTIONS or configured POST test)
- Form submit reaches Sheets + GHL (see [QA-CHECKLIST.md](./QA-CHECKLIST.md))

## Rollback

1. Cloudflare Dashboard → **Workers & Pages → paradise-spas → Deployments**
2. Find the last known-good deployment
3. **Rollback to this deployment**

Or redeploy a known-good git commit with `npm run deploy`.

## Notes (do not change without approval)

- Git default branch is `master`; deploy script uses `--branch main` for Pages upload semantics — document only, not a reason to rename branches casually.
- `wrangler` is pinned to `latest` in `package.json` — consider pinning in a separate chore if deploy reproducibility becomes an issue.

## Related

- [TASK-12-CURSOR-CLOUDFLARE-SETUP.md](./TASK-12-CURSOR-CLOUDFLARE-SETUP.md)
- [QA-CHECKLIST.md](./QA-CHECKLIST.md)
