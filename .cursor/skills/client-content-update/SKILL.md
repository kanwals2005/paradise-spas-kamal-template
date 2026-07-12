---
name: client-content-update
description: Update Paradise Spas business info, branding, or page copy in apps/site HTML/CSS.
---

# Client content update

1. Read `docs/CLIENT-OPERATIONS.md`.
2. Search repo for existing phone, address, email, and tracking values — do not invent.
3. Edit `apps/site/**/*.html` and `apps/site/style.css` as needed.
4. Keep absolute asset paths: `/js/`, `/css/`, `/assets/`, `/style.css`.
5. Update `apps/site/sitemap.xml` if URLs or indexing change.
6. Update `apps/site/_redirects` if URL aliases change.
7. Open PR from `master` with site files only — no `packages/agency-starter` unless asked.
