---
name: production-deploy-checklist
description: Run verify and preview steps before production deploy of apps/site to Cloudflare Pages.
---

# Production deploy checklist

1. Read `docs/DEPLOYMENT.md` and `docs/QA-CHECKLIST.md`.
2. Run `npm run check:structure` and `npm run verify:deploy`.
3. Confirm deploy targets `apps/site` — not repo root.
4. Run `npm run preview:deploy` first.
5. Smoke test preview URL: homepage, inventory, `/api/lead`, one form submit if credentials exist.
6. Only then run `npm run deploy` for production.
7. Re-smoke test `https://www.paradisespas.com`.
8. Do not change `package.json` deploy scripts or `wrangler.jsonc` unless explicitly asked.
