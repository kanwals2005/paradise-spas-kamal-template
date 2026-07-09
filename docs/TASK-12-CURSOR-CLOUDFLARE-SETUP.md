# Task 12 — Cursor + Cloudflare setup (human steps)

Complete these on your **local Cursor Desktop** after merging the monorepo migration.

## 1. Open the repo correctly

- Clone/pull latest `master` (or your migration branch).
- In Cursor: **File → Open Folder** → select the **repository root** (where `AGENTS.md` and `apps/` live).
- Do **not** open only `apps/site/` as the workspace.

## 2. Install the Cloudflare plugin (recommended)

In Cursor chat or command palette:

```txt
/add-plugin cloudflare
```

Or: **Customize → Marketplace → search "Cloudflare" → Install**.

This installs Cloudflare **Skills** (wrangler, workers-best-practices, etc.) and registers MCP servers.  
Docs: https://developers.cloudflare.com/agent-setup/cursor/

## 3. Local MCP config (already templated)

The repo ships `.cursor/mcp.json.example`. Your machine should have a **local** copy:

```bash
cp .cursor/mcp.json.example .cursor/mcp.json
```

`.cursor/mcp.json` is **gitignored** (secrets/OAuth stay local).

After copying (or if this workspace already created it for you):

1. Restart Cursor (or reload window).
2. Open **Customize → Tools & MCP**.
3. For each Cloudflare server (`Cloudflare-docs`, `Cloudflare-bindings`, `Cloudflare-builds`), click **Connect** and complete OAuth when prompted.

If a server shows `needsAuth`, that is normal until you authorize once.

## 4. Confirm Cloud Agents base on `master`

Verified for this repo (July 2026): GitHub default branch is **`master`**.

Double-check in GitHub:

1. Repo → **Settings → General → Default branch** → must be `master`.
2. When starting a **Cloud Agent**, confirm it says it will branch from `master` (not a feature branch).
3. Merge the migration PR into `master` before asking agents to do production deploy work.

Repo rule (`.cursor/rules/40-git-and-prs.mdc`): agents branch from `master`.

## 5. Cloudflare Pages deploy root = `apps/site`

This project uses **direct Wrangler upload** (not a separate build step):

```bash
npm install
export CLOUDFLARE_ACCOUNT_ID=your_account_id
export CLOUDFLARE_API_TOKEN=your_api_token   # or wrangler login
npm run verify:deploy   # sanity check
npm run preview:deploy  # safe test first
npm run deploy          # production
```

`package.json` deploys **`apps/site`** — that folder contains `index.html`, `functions/`, `_redirects`, etc.

### If you also use Git-connected Pages builds (dashboard)

In **Cloudflare Dashboard → Workers & Pages → paradise-spas → Settings → Builds**:

| Setting | Value |
|---------|--------|
| Root directory | *(leave empty — repo root)* |
| Build command | *(empty — static site, no build)* |
| Build output directory | `apps/site` |

If builds were previously pointed at `/` (repo root), update to `apps/site` **before** the next git-triggered deploy.

### Wrangler config

`apps/site/wrangler.jsonc` documents the Pages project name and compatibility flags.  
Deploy still uses `npm run deploy` from repo root.

## 6. Quick verification checklist

```bash
npm run check:structure   # monorepo layout
npm run verify:deploy     # deploy targets apps/site
```

Manual smoke test after preview deploy:

- `/` homepage loads
- `/hot-tubs/`, `/redrivervalleyfair/`, `/inventoryredrivervalleyfair/` load
- `/api/lead` still reachable (Pages Functions under `apps/site/functions/`)

## 7. Optional: enable other MCP servers you already use

Add to `.cursor/mcp.json` (local only) as needed — e.g. GitLab, Parallel.  
Do not commit tokens; use OAuth or `${env:VAR_NAME}` interpolation per Cursor docs.
