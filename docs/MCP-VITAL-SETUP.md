# Vital MCP setup (home machine)

**Agent tooling only** — MCP servers help Cursor read docs, open PRs, and research APIs. They are **not** part of the Paradise Spas live site runtime.

| Server | Needed for client site? |
|--------|-------------------------|
| Cloudflare MCP | Useful — deploy docs, builds, `/api/lead` logs |
| GitHub MCP | Useful — PRs and repo ops |
| Exa / Ref | Optional — external research |
| Convex MCP | **Optional** — no `convex/` backend in this repo today |

Authenticate **GitHub**, **Exa**, and **Ref** as needed. Convex is optional unless you add a Convex project later.  
Cloudflare MCP servers use OAuth in Cursor (section 3 below).

Do **not** commit `.cursor/mcp.json` or API tokens.

See also: [ARCHITECTURE.md](./ARCHITECTURE.md), [ENVIRONMENT.md](./ENVIRONMENT.md).

---

## 1. Copy the template

```bash
cp .cursor/mcp.json.example .cursor/mcp.json
```

---

## 2. Set environment variables (shell profile)

Add to `~/.zshrc` or `~/.bashrc`, then **restart Cursor** (env is read at launch):

```bash
# GitHub MCP — fine-grained PAT: Contents + Pull requests (read/write) on paradise-spas-kamal-template
export GITHUB_PERSONAL_ACCESS_TOKEN="github_pat_..."

# Exa — https://dashboard.exa.ai/api-keys
export EXA_API_KEY="..."

# Ref — https://ref.tools/
export REF_API_KEY="..."
```

Optional: also set `GH_TOKEN` to the same value as `GITHUB_PERSONAL_ACCESS_TOKEN` so Cloud Agents can create PRs via `gh` CLI.

---

## 3. Authenticate each server in Cursor

**Customize → Tools & MCP** (or Settings → MCP). After reload, each server should show a **green dot** (connected), not `needsAuth` or error.

| Server | How to authenticate |
|--------|---------------------|
| **Cloudflare-docs** | Click **Connect** → complete OAuth in browser |
| **Cloudflare-bindings** | Click **Connect** → OAuth |
| **Cloudflare-builds** | Click **Connect** → OAuth |
| **convex** | *(Optional)* Runs `npx convex mcp start` for agent tooling only — this Paradise Spas repo has no Convex backend. Skip unless you are working on a separate Convex project. |
| **github** | Uses `GITHUB_PERSONAL_ACCESS_TOKEN` from step 2. Create PAT: https://github.com/settings/tokens — scopes: **repo**, **read:org** (if org repos). Official docs: https://github.com/github/github-mcp-server/blob/main/docs/installation-guides/install-cursor.md |
| **exa** | Uses `EXA_API_KEY` from step 2 |
| **Ref** | Uses `REF_API_KEY` from step 2 |

---

## 4. Verify (quick tests)

In Cursor chat, try one prompt per tool:

| Server | Test prompt |
|--------|-------------|
| github | *List open pull requests on kanwals2005/paradise-spas-kamal-template* |
| exa | *Use Exa: current Wrangler Pages deploy syntax for a subdirectory* |
| Ref | *Use Ref to verify Cloudflare Pages monorepo build output directory* |
| convex | *(Optional)* Skip for Paradise Spas unless adding a Convex backend in a future phase |

Research policy: `.cursor/rules/50-research-exa.mdc` (Exa → Parallel → Ref order when external research is needed).

---

## 5. Troubleshooting

| Symptom | Fix |
|---------|-----|
| `needsAuth` on Cloudflare | Click Connect next to that server; complete OAuth |
| github red / no tools | Confirm `GITHUB_PERSONAL_ACCESS_TOKEN` is set; reload Cursor; PAT not expired |
| exa / Ref rate limit | Add your own API key (free tier limits apply without key) |
| convex fails to start | `npx convex login`; ensure Node 18+; try `/add-plugin convex` |
| Env vars not picked up | Quit Cursor fully and reopen (not just reload window) |

### GitHub MCP Docker fallback (if HTTP fails)

Requires Docker Desktop. In local `.cursor/mcp.json` only:

```json
"github": {
  "command": "docker",
  "args": [
    "run", "-i", "--rm",
    "-e", "GITHUB_PERSONAL_ACCESS_TOKEN",
    "ghcr.io/github/github-mcp-server"
  ],
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "${env:GITHUB_PERSONAL_ACCESS_TOKEN}"
  }
}
```

### Exa / Ref stdio fallback

See `docs/TASK-12-CURSOR-CLOUDFLARE-SETUP.md` section 8.

---

## 6. Cloud Agents (optional)

For agents to create PRs, add `GH_TOKEN` (same PAT) to your **Cursor Cloud environment** secrets in cursor.com settings — the built-in GitHub integration token often cannot create PRs.
