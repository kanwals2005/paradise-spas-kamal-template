# Paradise Spas — Inventory updates

Inventory is **hardcoded in JavaScript**, not stored in Convex or any database.

## Source of truth

**File:** `apps/site/js/inventory-hot-tubs.js`

| Array | Used on |
|-------|---------|
| `HOT_TUB_PRODUCTS` | Main inventory, category pages using dynamic render |
| `FAIR_ONLY_PRODUCTS` | Fair inventory gate pages (`inventory-gate-fair` body class) |

`apps/site/inventory.html` also contains static HTML cards for some sections — check both the JS renderer and inline HTML when updating.

## Product object fields

Typical fields in `HOT_TUB_PRODUCTS`:

| Field | Example | Notes |
|-------|---------|-------|
| `badge` | `'Family Favorite'` | Card label |
| `title` | `'Artesian South Seas 748B Deluxe'` | Display name |
| `retail` | `13799` | Number, no `$` |
| `our` | `11799` | Sale price |
| `monthly` | `119` | Financing display |
| `capacity` | `'6–7 Person'` | |
| `bestUse` | `'Family Seating'` | |
| `benefit` | `'Strong Therapy'` | |
| `outcome` | Long description string | |
| `image` | `'/assets/products/...'` | Absolute path under `apps/site/assets/` |
| `seats` | `'6-7'` | Filter chip value |
| `chips` | `['family-favorites']` | Filter categories |

Fair-only products may add: `fairFinancingOnly`, `fairCta`, `fairMicro`.

## Images

Put new product images under `apps/site/assets/products/` or `assets/lifestyle/`.  
Use absolute paths in JS: `/assets/products/filename.png`.

## Filters and chips

Filter UI reads `chips` arrays. Keep chip slugs consistent with existing entries (`budget-friendly`, `loungers`, `family-favorites`, etc.).

## Fair vs standard inventory

- Standard pages: `getProducts()` returns `HOT_TUB_PRODUCTS`
- Fair pages (`IS_FAIR_PAGE`): returns shuffled `FAIR_ONLY_PRODUCTS`

Do not mix fair SKUs into `HOT_TUB_PRODUCTS` unless they should appear on the main inventory page.

## After editing

1. Test locally: `npm run dev` → http://localhost:8788/inventory.html
2. Test fair page if changed: `/inventoryredrivervalleyfair/`
3. Confirm gate unlock still works (form → `/api/lead`)
4. Preview deploy → production per [DEPLOYMENT.md](./DEPLOYMENT.md)

## Future note

Moving inventory to Convex or a CMS is a **separate approved project** — not part of routine client operations. Until then, edit `inventory-hot-tubs.js` only.

## Agent skill

Use `.cursor/skills/update-inventory` for step-by-step agent workflow.
