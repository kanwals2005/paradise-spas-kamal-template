---
name: lead-reimport
description: Reimport missed leads from Google Sheets CSV into GHL using scripts/reimport-missed-leads.mjs.
---

# Lead reimport

1. Read `docs/LEAD-RECOVERY.md`.
2. Export **Missed Leads** tab from Lead Vault as CSV.
3. Run `scripts/reimport-missed-leads.mjs` with `GHL_API_TOKEN` and `GHL_LOCATION_ID` in env — never commit tokens.
4. Do not re-submit leads through the live form (avoids duplicate Meta events).
5. Mark sheet rows `reimported=yes` after success.
6. Do not call `/api/lead` for recovery.
