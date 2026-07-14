# Task 12 — Cursor + Cloudflare setup (human steps)

Complete these on your **local Cursor Desktop** after merging the monorepo migration.

**Scope:** This configures **developer/agent tooling** for the Paradise Spas client site. It does not add Convex, React, or a SaaS backend. Production runtime remains `apps/site` on Cloudflare Pages.

Client-site ops docs: [ARCHITECTURE.md](../ops/ARCHITECTURE.md), [DEPLOYMENT.md](../ops/DEPLOYMENT.md), [ENVIRONMENT.md](../ops/ENVIRONMENT.md).

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
3. For each Cloudflare server, click **Connect** and complete OAuth when prompted:

| Server | OAuth required? |
|--------|-----------------|
| `Cloudflare-docs` | No — works immediately |
| `Cloudflare-builds` | Yes — Pages deployment insights |
| `Cloudflare-bindings` | Yes — KV/D1/R2 bindings *(not used by Paradise site today)* |
| `Cloudflare-observability` | Yes — logs for Pages Functions |

**Full walkthrough:** [`CLOUDFLARE-MCP-CONNECT.md`](./CLOUDFLARE-MCP-CONNECT.md)

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
cp .env.example .env.local
# Edit .env.local — add your CLOUDFLARE_API_TOKEN (never commit this file)
npm run verify:deploy   # sanity check
npm run preview:deploy  # safe test first
npm run deploy          # production
```

Deploy scripts load credentials from `.env.local` via `dotenv-cli`.  
Create your token: **Cloudflare Dashboard → My Profile → API Tokens → Create Token**.

**Minimum permissions** (Paradise Spas / Wrangler Pages deploy):

| Permission | Access | Why |
|------------|--------|-----|
| Account → Cloudflare Pages | Edit | Deploy `apps/site`, list deployments |
| Account → Workers Scripts | Edit | Pages Functions under `apps/site/functions/` |
| User → Memberships | Read | Wrangler resolves account ID |

Optional (if agents manage env vars): Account → Cloudflare Pages → Edit already covers secret list/set via Wrangler.

Account ID for this project is in `.env.example` / `apps/site/wrangler.jsonc`.

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

Add to `.cursor/mcp.json` (local only) as needed — e.g. GitLab, **Parallel**.  
Do not commit tokens; use OAuth or `${env:VAR_NAME}` interpolation per Cursor docs.

**Parallel** (section 7) = broad web search for general research.  
For code-aware research and doc verification, see section 8 (Exa + Ref).

## 8. Exa + Ref research (project-scoped)

The repo templates **Exa** and **Ref** in `.cursor/mcp.json.example` for research that needs code context or official doc verification.  
Rule `.cursor/rules/50-research-exa.mdc` applies automatically when these servers are connected.

| Tool | Role |
|------|------|
| **Parallel** (section 7) | Broad web search — general facts, news, competitor pages |
| **Exa** | Code context — libraries, APIs, implementation patterns |
| **Ref** | Doc verification — official docs when Exa/Parallel conflict |

### Step table

| Step | Action |
|------|--------|
| 1 | Get API keys: [Exa dashboard](https://dashboard.exa.ai/) → API keys; [ref.tools](https://ref.tools/) → API keys |
| 2 | Export locally (never commit): `export EXA_API_KEY="..."` and `export REF_API_KEY="..."` (add to `~/.bashrc`, `~/.zshrc`, or your shell profile) |
| 3 | Copy MCP config: `cp .cursor/mcp.json.example .cursor/mcp.json` |
| 4 | Reload Cursor (or reload window) |
| 5 | **Customize → Tools & MCP** — confirm **exa** and **Ref** show connected (not `needsAuth` / error) |
| 6 | Test with a prompt such as: *"What is the Wrangler Pages deploy syntax when the site lives in a subdirectory like `apps/site`?"* — expect Exa code context and/or Ref doc citations |

### Stdio fallback (optional)

If HTTP MCP fails, add stdio entries to your local `.cursor/mcp.json` instead:

| Server | Command | Env |
|--------|---------|-----|
| Exa | `npx -y exa-mcp-server` | `EXA_API_KEY` |
| Ref | `npx ref-tools-mcp@latest` | `REF_API_KEY` |

Keep `.cursor/mcp.json` gitignored; never commit API keys.

## 9. Vital MCPs: GitHub, Exa, Ref (Convex optional)

**Full step-by-step:** [`MCP-VITAL-SETUP.md`](./MCP-VITAL-SETUP.md)

Quick checklist for your **home machine** (agent tooling — not live site runtime):

| Server | Auth method | Paradise client site |
|--------|-------------|----------------------|
| **GitHub** | `export GITHUB_PERSONAL_ACCESS_TOKEN=...` | Recommended for PRs |
| **Exa** | `export EXA_API_KEY=...` | Optional research |
| **Ref** | `export REF_API_KEY=...` | Optional doc verify |
| **Convex** | `npx convex login` + `/add-plugin convex` | **Optional** — no Convex backend in this repo |
| **Cloudflare** (×4) | OAuth **Connect** in Tools & MCP | Useful for deploy/logs |

```bash
cp .cursor/mcp.json.example .cursor/mcp.json
# Add exports to ~/.zshrc, quit and reopen Cursor
# Customize → Tools & MCP → green dots on all servers
```

For Cloud Agents to open PRs, also set `GH_TOKEN` in your Cursor cloud environment (same PAT).

## 10. Historical plans

`docs/archive/plans/` contains past migration and MCP setup plans. Use [ARCHITECTURE.md](../ops/ARCHITECTURE.md) and [DEPLOYMENT.md](../ops/DEPLOYMENT.md) for current client-site operations.
