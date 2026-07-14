---
name: form-qa
description: QA inventory gate, native forms, GHL modal, and /api/lead after form or lead API changes.
---

# Form QA

1. Read `docs/QA-CHECKLIST.md` and `apps/dashboard/FORM_GATE_QA.md`.
2. Use `npm run dev` (port 8788) with `apps/site/.dev.vars` for local lead API tests.
3. Test inventory gate unlock → Sheet row → GHL contact → unlock UI.
4. Test GHL modal from a pricing CTA on homepage or inventory.
5. Verify tags in GHL match `apps/site/functions/lib/ghl.js` `tagsForSource()`.
6. Confirm Meta CAPI only fires when GHL succeeds (not on duplicates).
7. If GHL fails intentionally, confirm Missed Leads tab + alert path per `docs/LEAD-RECOVERY.md`.
