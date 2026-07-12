---
name: update-inventory
description: Update hot tub or fair inventory products in apps/site/js/inventory-hot-tubs.js without changing backend architecture.
---

# Update inventory

1. Read `docs/INVENTORY-UPDATE.md`.
2. Edit `apps/site/js/inventory-hot-tubs.js` only — `HOT_TUB_PRODUCTS` or `FAIR_ONLY_PRODUCTS`.
3. Use absolute image paths under `/assets/`.
4. Check `apps/site/inventory.html` for any static cards that duplicate changed products.
5. Test with `npm run dev` on port 8788 — not `dev:static`.
6. Do not add Convex, a CMS, or move inventory to a database unless explicitly requested.
