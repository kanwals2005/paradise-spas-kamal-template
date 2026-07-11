# Exa + Ref Project Research Setup

> **For agentic workers:** REQUIRED SUB-SKILL: Use subagent-driven-development — one implementer subagent per task, then spec review, then code quality review. Branch from `master`.

**Goal:** Wire Exa and Ref into this repo the same way Cloudflare is wired — committed templates + always-on project rule that tells agents *when* to research, not to research on every prompt.

**Architecture:** Two layers stay separate:

| Layer | Path | Purpose |
|-------|------|---------|
| Policy | `.cursor/rules/50-research-exa.mdc` | When to use Exa / Parallel / Ref |
| Template | `.cursor/mcp.json.example` | MCP wiring with `${env:...}` placeholders |
| Local secrets | `.cursor/mcp.json` (gitignored) | Human copies template + sets API keys |

| Tool | Role in this project |
|------|----------------------|
| **Exa MCP** | Code/library/API context (`get_code_context_exa` first) |
| **Parallel** (existing plugin) | General web search / deep research (`parallel-web-search` skill) |
| **Ref MCP** | Official docs verification only (`ref_search_documentation`, `ref_read_url`) |

**Non-goals:** No API keys in git; no changes to `scripts/check-structure.mjs` required paths.

---

## Task 0: Branch hygiene

- [x] Confirm on latest `master`
- [x] Create branch: `cursor/exa-ref-project-setup-d10c`
- [x] Run `npm run check:structure` — baseline pass

---

## Task 1: Add research rule

**Create:** `.cursor/rules/50-research-exa.mdc`

---

## Task 2: Update MCP example template

**Edit:** `.cursor/mcp.json.example` — add Exa + Ref with `${env:EXA_API_KEY}` and `${env:REF_API_KEY}`

---

## Task 3: Update Task 12 human guide

**Edit:** `docs/TASK-12-CURSOR-CLOUDFLARE-SETUP.md` — section 8 for Exa/Ref

---

## Task 4: Update AGENTS.md

Add one bullet pointing to `.cursor/rules/50-research-exa.mdc`

---

## Task 5: Verification, commit, PR

- `npm run check:structure` and `npm run verify:deploy`
- Ensure `.cursor/mcp.json` not staged
- Push and open draft PR to `master`
