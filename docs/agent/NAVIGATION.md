# Navigation — capabilities

Open the workspace at the **repo root** (not `apps/site/` alone).

| Need | Start here |
|------|------------|
| Homepage / category / product pages | `apps/site/` |
| Inventory & fair product data | `apps/site/js/inventory-hot-tubs.js` — see [`../ops/INVENTORY-UPDATE.md`](../ops/INVENTORY-UPDATE.md) |
| Lead API (Sheets → GHL → Meta CAPI) | `apps/site/functions/` — see [`../ops/LEAD-RECOVERY.md`](../ops/LEAD-RECOVERY.md) |
| Campaign landers | Existing URLs under `apps/site/<name>/` or new under `apps/site/campaigns/` |
| Analytics / Looker / GHL SOPs | `apps/dashboard/` |
| Portable kit for **other** clients | `packages/agency-starter/` (Paradise source of truth stays `apps/site`) |
| Conversion strategy prose | `docs/PLAYBOOK.md` (only when asked) |
| Deploy / env / QA | [`../ops/`](../ops/) |
| MCP / Cursor auth | [`../tooling/`](../tooling/) |
| Historical plans / research | `docs/archive/` |

Demo/test pages (`inventory-gate-demo.html`, `chat-widget-test/`) may still be public — do not delete without redirects; use skill `campaign-cleanup` for decisions.

Agency-adjacent SOPs (non-Paradise daily) may live under `apps/dashboard/AGENCY_*.md` — prefer Paradise-specific SOPs for client work.
