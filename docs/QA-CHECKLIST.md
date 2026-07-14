# Paradise Spas — QA checklist

Use before and after preview/production deploys.

## Pre-deploy (local or CI)

- [ ] `npm run check:structure` passes
- [ ] `npm run verify:deploy` passes
- [ ] Changes are in `apps/site/` (not repo root)
- [ ] No secrets staged (`.env.local`, `.cursor/mcp.json`, GA4 JSON)

## Preview deploy

```bash
npm run preview:deploy
```

Note the preview URL from Wrangler output.

### Pages (load without console errors)

- [ ] `/` homepage
- [ ] `/inventory.html` or `/inventory`
- [ ] `/hot-tubs/`, `/swim-spas/`, `/saunas/`
- [ ] `/contact.html`, `/financing.html`
- [ ] `/find-my-spa/`
- [ ] `/inventoryredrivervalleyfair/` (if fair season)
- [ ] `/thank-you.html`
- [ ] At least one `product*.html` page

### Forms and lead API

- [ ] Inventory gate: submit unlock form → success message
- [ ] Sheet row appears in Lead Vault (`All Leads` tab)
- [ ] GHL contact created with expected tags (if GHL configured)
- [ ] Inventory unlocks (localStorage or redirect flow)
- [ ] GHL modal form still opens from pricing CTAs
- [ ] `/api/lead` returns 503 only when Sheets env is intentionally missing (not in production)

### Tracking (use GA4 Realtime + Meta Test Events)

- [ ] Phone tap fires `click_call`
- [ ] Pricing CTA fires `pricing_click`
- [ ] Form success fires `generate_lead` on thank-you (where applicable)
- [ ] Fair unlock fires `fair_inventory_unlock` (fair pages)
- [ ] No duplicate Lead events for one submission

### Redirects

- [ ] `/hot-tubs.html` → `/hot-tubs/` (301)
- [ ] Fair redirect aliases in `_redirects` work

## Production deploy

Only after preview QA passes:

```bash
npm run deploy
```

- [ ] Confirm deployment in Cloudflare dashboard
- [ ] Repeat smoke test on `https://www.paradisespas.com`
- [ ] Submit one real test lead (or internal test) and verify Sheet + GHL

## Post-deploy monitoring (first 24h)

- [ ] Cloudflare observability / Functions logs — no spike in `/api/lead` errors
- [ ] GHL workflow notifications still fire for fair/inventory tags
- [ ] Looker / GA4 counts align with expectations (next business day)

## Demo / test pages

These exist in the repo — decide whether they should be public:

| Path | Risk |
|------|------|
| `inventory-gate-demo.html` | Demo only |
| `chat-widget-test/` | Test only |

If not needed in production, consider noindex or removal in a separate change.

## Related

- [DEPLOYMENT.md](./DEPLOYMENT.md)
- [apps/dashboard/FORM_GATE_QA.md](../apps/dashboard/FORM_GATE_QA.md)
- [LEAD-RECOVERY.md](./LEAD-RECOVERY.md)
