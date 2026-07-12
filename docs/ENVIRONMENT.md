# Paradise Spas — Environment variables

Three separate layers — do not mix them.

## 1. Wrangler deploy auth (local only)

**File:** `.env.local` (gitignored) — template in `.env.example`

| Variable | Used by |
|----------|---------|
| `CLOUDFLARE_ACCOUNT_ID` | Wrangler deploy |
| `CLOUDFLARE_API_TOKEN` | `npm run deploy`, `npm run preview:deploy` |

Create token: Cloudflare Dashboard → My Profile → API Tokens.  
Minimum: Account → Cloudflare Pages → Edit; User → Memberships → Read.

These variables are **not** read by the live site or `/api/lead`.

## 2. Pages runtime (production + preview)

**Set in:** Cloudflare Dashboard → Workers & Pages → paradise-spas → Settings → Environment variables

**Template:** `apps/dashboard/lead-api.env.example`

| Variable | Required | Purpose |
|----------|----------|---------|
| `GOOGLE_SHEETS_ID` | Yes | Lead vault sheet |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Yes | Sheet write access |
| `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` | Yes | Sheet auth |
| `GHL_API_TOKEN` | Recommended | GHL contact create/update |
| `GHL_LOCATION_ID` | Recommended | Paradise GHL location |
| `ALLOWED_ORIGIN` | Recommended | CORS — `https://www.paradisespas.com` |
| `ALERT_EMAIL` | Recommended | GHL failure alerts |
| `TURNSTILE_SECRET_KEY` | Optional | Spam protection (skipped if unset) |
| `RESEND_API_KEY` | Optional | Reliable alert emails |
| `META_CAPI_ACCESS_TOKEN` | Optional | Server-side Meta Lead events |
| `META_PIXEL_ID` | Optional | Defaults to site pixel if unset |

Full setup: [apps/dashboard/LEAD_INSURANCE_OWNER_SETUP.md](../apps/dashboard/LEAD_INSURANCE_OWNER_SETUP.md)

## 3. Local Pages dev (Wrangler)

**File:** `apps/site/.dev.vars` (gitignored) — copy from `apps/dashboard/lead-api.env.example`

Used by `npm run dev` on port 8788 so `/api/lead` works locally.

## 4. GA4 reporting scripts (local only)

**Used by:** `npm run ga4:funnel`, `npm run ga4:pages`

| Variable | Purpose |
|----------|---------|
| `GA4_CREDENTIALS_PATH` | Path to service account JSON |
| `GA4_PROPERTY_ID` | Optional override (default in script) |

Never commit `*-ga4*.json` or credential files.

## 5. Cursor MCP / agent tooling (local only)

**Not used by the live website.**

Export in shell profile (`~/.bashrc` / `~/.zshrc`); restart Cursor after changes.

| Variable | Server |
|----------|--------|
| `GITHUB_PERSONAL_ACCESS_TOKEN` | GitHub MCP |
| `GH_TOKEN` | Cloud Agents PR creation (same PAT) |
| `EXA_API_KEY` | Exa research MCP |
| `REF_API_KEY` | Ref docs MCP |

Cloudflare MCP servers use OAuth in Cursor (not env vars).

Convex MCP runs via `npx convex mcp start` — optional agent tooling; **no Convex project in this repo**.

Setup: [MCP-VITAL-SETUP.md](./MCP-VITAL-SETUP.md)

## Quick reference

| Layer | Where secrets live | Affects live site? |
|-------|-------------------|-------------------|
| Deploy | `.env.local` | Only deploy CLI |
| Runtime | Cloudflare Pages env | Yes — forms, leads |
| Local dev | `apps/site/.dev.vars` | Local only |
| GA4 scripts | Local JSON path | Reports only |
| MCP | Shell env + `.cursor/mcp.json` | Agents only |
