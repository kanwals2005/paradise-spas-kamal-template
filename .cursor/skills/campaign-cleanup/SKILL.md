---
name: campaign-cleanup
description: Review demo, test, or ended campaign pages under apps/site for noindex, archive, or removal decisions.
---

# Campaign cleanup

1. List campaign/test paths: `redrivervalleyfair/`, `inventoryredrivervalleyfair/`, `hot-tub-offer/`, `inventory-gate-demo.html`, `chat-widget-test/`.
2. Confirm with human whether page is still live, seasonal, or obsolete.
3. If obsolete: remove from `sitemap.xml`, add noindex meta, or document archive — do not delete live URLs without redirect plan.
4. If seasonal fair ended: consider redirect in `_redirects` to inventory or homepage.
5. Do not move campaigns to a new framework — stay in static HTML.
6. Document decision in PR description; update `docs/ops/QA-CHECKLIST.md` demo table if policy changes.
