# Paradise Spas — Lead recovery

When GHL fails but the lead vault succeeds, the lead is safe in Google Sheets. Use this guide to recover missed contacts.

## How leads are stored

1. Every submit → **All Leads** tab (must succeed for visitor success response)
2. GHL failure → row also copied to **Missed Leads** tab + optional email alert

Architecture: [apps/dashboard/LEAD_INSURANCE_PLAN.md](../../apps/dashboard/LEAD_INSURANCE_PLAN.md)  
Setup: [apps/dashboard/LEAD_INSURANCE_OWNER_SETUP.md](../../apps/dashboard/LEAD_INSURANCE_OWNER_SETUP.md)

## When to reimport

- GHL was down or rate-limited during a campaign
- `ghl_status` = `FAILED` in All Leads but row exists
- Missed Leads tab has rows with `reimported` empty

## Manual reimport script

**Script:** `scripts/reimport-missed-leads.mjs`

Exports a CSV from the **Missed Leads** tab, then:

```bash
GHL_API_TOKEN=pit-... GHL_LOCATION_ID=NpZCArkZIoHhOIl8Qjd1 \
  node scripts/reimport-missed-leads.mjs "path/to/Missed Leads.csv"
```

### What the script does

- Upserts contacts directly to GHL API
- Adds tags: `website-form`, `lead-api`, `fair-inventory-unlock`, `missed-lead-reimport`
- Skips rows already marked `reimported=yes`
- Skips test emails (`@example.com`)

### What the script does NOT do

- Does **not** call `/api/lead` again
- Does **not** fire Meta CAPI or Pixel events
- Does **not** add new vault rows

Mark rows `reimported=yes` in the sheet after successful run.

## Do not

- Re-submit the same lead through the live form just to “fix” GHL — may duplicate Meta events
- Delete All Leads rows — they are the audit trail
- Put `GHL_API_TOKEN` in git or commit CSV exports with PII

## Alerts

If `ALERT_EMAIL` and `RESEND_API_KEY` are set, GHL failures trigger email alerts. Check inbox before bulk reimport.

## Agent skill

Use `.cursor/skills/lead-reimport` for agent-guided recovery.
