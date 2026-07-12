# Connect Cloudflare MCP (Tools & MCP)

Step-by-step for **Paradise Spas** on your **home Cursor Desktop**.  
OAuth happens in your browser — the agent cannot click Connect for you.

**Agent tooling only.** Cloudflare MCP helps inspect deployments and `/api/lead` logs. Production deploy still uses `npm run deploy` and `.env.local` — not MCP OAuth.

See [ARCHITECTURE.md](./ARCHITECTURE.md) for what runs on the live client site.

---

## What you need Cloudflare MCP for (this repo)

| Server | Auth | Why for Paradise Spas |
|--------|------|------------------------|
| **Cloudflare-docs** | None | Wrangler, Pages, Functions docs — works immediately |
| **Cloudflare-builds** | OAuth **Connect** | Inspect `paradise-spas` Pages deployments |
| **Cloudflare-bindings** | OAuth **Connect** | KV/D1/R2 — not used by Paradise site today |
| **Cloudflare-observability** | OAuth **Connect** | Logs/analytics for `/api/lead` Pages Functions |

Deploy still uses `npm run deploy` + `.env.local` — MCP is for **agent tools**, not a replacement for Wrangler auth.

---

## Step 1 — Install Cloudflare plugin

In Cursor chat:

```txt
/add-plugin cloudflare
```

Or: **Customize → Marketplace → search "Cloudflare" → Install**.

This registers Cloudflare **Skills** (wrangler, workers-best-practices) and MCP server URLs.

Official guide: https://developers.cloudflare.com/agent-setup/cursor/

---

## Step 2 — Copy MCP config

From repo root:

```bash
cp .cursor/mcp.json.example .cursor/mcp.json
```

`.cursor/mcp.json` is gitignored. It should already list these Cloudflare URLs:

```json
"Cloudflare-docs": { "url": "https://docs.mcp.cloudflare.com/mcp" },
"Cloudflare-bindings": { "url": "https://bindings.mcp.cloudflare.com/mcp" },
"Cloudflare-builds": { "url": "https://builds.mcp.cloudflare.com/mcp" },
"Cloudflare-observability": { "url": "https://observability.mcp.cloudflare.com/mcp" }
```

---

## Step 3 — Reload Cursor

**File → Reload Window** (or quit Cursor fully and reopen).

---

## Step 4 — Connect OAuth servers (the important part)

1. Open **Customize → Tools & MCP** (or **Settings → Tools & MCP**).
2. Find each Cloudflare server in the list.
3. For any server showing **needsAuth**, **Connect**, or a yellow/red status:
   - Click **Connect** (or the pencil → Connect).
   - A browser tab opens → **log in to Cloudflare** (Alex@increaseroas.com / Increase ROAS account).
   - Choose permissions — allow access to the account that owns **paradise-spas**.
   - Approve and return to Cursor.
4. Repeat for **each** server that needs auth:
   - Cloudflare-bindings
   - Cloudflare-builds
   - Cloudflare-observability

**Cloudflare-docs** should show **green / ready** with no Connect step (public docs).

---

## Step 5 — Verify green dots

| Server | Expected status |
|--------|-----------------|
| Cloudflare-docs | Green — no OAuth |
| Cloudflare-builds | Green after Connect |
| Cloudflare-bindings | Green after Connect |
| Cloudflare-observability | Green after Connect |

Test prompts in chat:

```txt
Search Cloudflare docs: Pages Functions directory structure for a monorepo with apps/site
```

```txt
Use Cloudflare builds MCP: show recent deployments for project paradise-spas
```

```txt
Use Cloudflare observability: recent errors for paradise-spas Pages Functions
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Server not in list | Run `/add-plugin cloudflare`; confirm `.cursor/mcp.json` exists; reload Cursor |
| Connect button missing | Update Cursor to latest; use `?expand=1` reload; check JSON is valid |
| OAuth loops / fails | Log out of Cloudflare in browser; try incognito; Connect again |
| Wrong account | Use the Cloudflare account with `paradise-spas` (Increase ROAS) |
| docs works, others don't | Only docs is public — bindings/builds/observability need OAuth each |
| Still `needsAuth` after Connect | Quit Cursor completely; reopen; Connect again |

### Invalid JSON in mcp.json

```bash
python3 -m json.tool .cursor/mcp.json
```

### Separate from Wrangler deploy token

| Auth | Used for |
|------|----------|
| **MCP OAuth** | Cursor agent tools (builds, logs, bindings) |
| **CLOUDFLARE_API_TOKEN** in `.env.local` | `npm run deploy` / Wrangler CLI |

You need **both** for full workflow: deploy via Wrangler, debug via MCP.

---

## Optional: full Cloudflare API (Code Mode)

For advanced agent access to all Cloudflare API endpoints:

```json
"cloudflare-api": {
  "url": "https://mcp.cloudflare.com/mcp"
}
```

Add to **local** `.cursor/mcp.json` only if you need DNS/WAF/R2 management from chat. Requires OAuth Connect. Not required for Paradise Spas static site + Pages deploy.

---

## Checklist

- [ ] `/add-plugin cloudflare` installed
- [ ] `cp .cursor/mcp.json.example .cursor/mcp.json`
- [ ] Cursor reloaded
- [ ] Cloudflare-docs = green
- [ ] Cloudflare-builds = Connected
- [ ] Cloudflare-bindings = Connected
- [ ] Cloudflare-observability = Connected
- [ ] `.env.local` has `CLOUDFLARE_API_TOKEN` for deploy
