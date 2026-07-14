---
name: tracking-id-change
description: Change GA4, Meta Pixel, Clarity, or GHL form/chat IDs across apps/site consistently.
---

# Tracking ID change

1. Search repo for current IDs before replacing (GA4, Pixel, Clarity, GHL form, chat widget).
2. Update every HTML `<head>` and relevant JS that references the old ID.
3. Check `apps/site/thank-you.html` for Lead event value and event names.
4. Check `apps/site/js/call-tracking.js` and `pricing-tracking.js` — usually no ID change needed.
5. Update `apps/dashboard/README.md` ID table if ops docs must match.
6. Align Cloudflare Pages env if Meta CAPI pixel ID changes (`META_PIXEL_ID`).
7. QA per `docs/ops/QA-CHECKLIST.md` tracking section after preview deploy.
