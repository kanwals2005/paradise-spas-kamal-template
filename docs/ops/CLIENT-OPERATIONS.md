# Paradise Spas — Client operations

Routine content and business-info updates for the live site. No framework or backend changes required for these tasks.

## Business info (phone, address, hours, email)

1. Search the repo for current values — do not guess.
   - Phone: `7017145879`, `701-714-5879`
2. Update across `apps/site/**/*.html` and any campaign pages.
3. Check footer, contact page, schema/JSON-LD if present, and click-to-call links.
4. Update `apps/dashboard/README.md` ID table only if ops docs reference changed values.

## Branding (logos, colors)

| Item | Location |
|------|----------|
| Logos | `apps/site/assets/brand/` |
| Primary colors | `apps/site/style.css` — `#0d4cae`, `#F0A500` |
| Page-specific CSS | `apps/site/css/` |

Replace image files; keep filenames or update all HTML references.

## Page copy (homepage, categories, products)

| Page type | Location |
|-----------|----------|
| Homepage | `apps/site/index.html` |
| Categories | `apps/site/hot-tubs/`, `swim-spas/`, `saunas/` |
| Products | `apps/site/product*.html` |
| Financing / contact | `apps/site/financing.html`, `contact.html` |

Match existing HTML patterns. Prefer absolute paths: `/js/...`, `/assets/...`, `/style.css`.

## Campaign / fair pages

Live campaign URLs today (not under `campaigns/` yet):

- `apps/site/redrivervalleyfair/`
- `apps/site/inventoryredrivervalleyfair/`
- `apps/site/hot-tub-offer/`

New campaigns: use `apps/site/campaigns/<slug>/` per `.cursor/skills/new-landing-page`.

## Tracking and forms

Do **not** invent new pixel or form IDs. Search existing files.

| Change | See also |
|--------|----------|
| GA4, Meta, Clarity | `.cursor/skills/tracking-id-change` |
| GHL form / chat widget | Search `iz3wpzwCI9GQhR3wlwbV`, `6a4454fd638eec5af4195a51` |
| Thank-you Lead value | `apps/site/thank-you.html` (currently `$950`) |

Dashboard SOPs: `apps/dashboard/PARADISE_SPAS_TRACKING_AND_LEADS_SOP.md`

## Inventory and pricing

Product list and prices are in JavaScript, not a database:

- `apps/site/js/inventory-hot-tubs.js`

See [INVENTORY-UPDATE.md](./INVENTORY-UPDATE.md).

## When to involve a developer

- Lead API behavior, GHL tags, or new form sources → `apps/site/functions/`
- New env vars in Cloudflare Pages
- New redirects → `apps/site/_redirects`
- Sitemap changes → `apps/site/sitemap.xml`
- Deploy to production

## When **not** to expand scope

- Do not add React, Next, or Convex for a copy/price update.
- Do not move `functions/` out of `apps/site/`.
- Do not duplicate lead-stack logic into `packages/agency-starter` for Paradise changes — `apps/site` is source of truth.

## Deploy after content changes

```bash
npm run verify:deploy
npm run preview:deploy
# QA per docs/ops/QA-CHECKLIST.md
npm run deploy
```

See [DEPLOYMENT.md](./DEPLOYMENT.md).
