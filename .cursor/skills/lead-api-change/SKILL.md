---
name: lead-api-change
description: Change Cloudflare Pages lead API validation, GHL mapping, Sheets backup, or Meta CAPI.
---

# Lead API change

1. Edit `apps/site/functions/api/lead.js` and/or `apps/site/functions/lib/*`.
2. Keep CORS via `lib/cors.js`. Validate with `lib/validate.js`.
3. Mirror any source-name mappings in dashboard SOPs if user-facing.
4. Never commit secrets; document new env var names in `apps/dashboard/LEAD_INSURANCE_OWNER_SETUP.md`.
5. Test with a dry request plan; deploy via `npm run preview:deploy` when credentials exist.
