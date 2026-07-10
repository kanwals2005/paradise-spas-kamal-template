---
name: new-landing-page
description: Create a new campaign landing page under apps/site/campaigns with tracking, form wiring, and redirects.
---

# New landing page

1. Copy a similar campaign folder under `apps/site/campaigns/<slug>/`.
2. Reuse `/js/ghl-modal.js`, `/js/lead-form.js`, `/js/call-tracking.js`, `/js/pricing-tracking.js`.
3. Put images in `apps/site/campaigns/<slug>/` or `apps/site/assets/` (not repo root).
4. Add `_redirects` aliases if a short public URL is required.
5. Update `sitemap.xml` if the page should be indexed.
6. Open a PR from `master` with only campaign files + redirects.
