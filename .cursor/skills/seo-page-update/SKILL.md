---
name: seo-page-update
description: Update page titles, meta descriptions, sitemap, and redirects for apps/site pages.
---

# SEO page update

1. Edit `<title>` and `<meta name="description">` in the target HTML under `apps/site/`.
2. Add or update entry in `apps/site/sitemap.xml` if the page should be indexed.
3. Add 301 rules to `apps/site/_redirects` for renamed or aliased URLs.
4. Confirm `apps/site/robots.txt` still allows the path.
5. Match existing URL patterns (trailing slashes on category folders).
6. Preview deploy and verify redirects and sitemap URLs resolve.
