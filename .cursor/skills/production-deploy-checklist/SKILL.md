---
name: production-deploy-checklist
description: Preview then promote apps/site to Cloudflare Pages — verify, QA, and production deploy.
---

# Production deploy checklist

Includes preview deploy. There is no separate `deploy-preview` skill.

1. Read `docs/ops/DEPLOYMENT.md` and `docs/ops/QA-CHECKLIST.md`.
2. Run `npm run check:structure` and `npm run verify:deploy`.
3. Confirm deploy targets `apps/site` — not repo root (`package.json` / Wrangler).
4. Preview first:

```bash
npm install
# CLOUDFLARE_ACCOUNT_ID + token via .env.local or env
npm run preview:deploy
```

5. Smoke test preview URL: homepage, inventory, `/api/lead`, one form submit if credentials exist.
6. Only then run `npm run deploy` for production.
7. Re-smoke test `https://www.paradisespas.com`.
8. Do not change `package.json` deploy scripts or `wrangler.jsonc` unless explicitly asked.
