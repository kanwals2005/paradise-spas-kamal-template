import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "AGENTS.md",
  "apps/site/index.html",
  "apps/site/functions/api/lead.js",
  "apps/site/js/lead-form.js",
  "apps/site/style.css",
  "apps/dashboard/README.md",
  "packages/agency-starter/README.md",
  "docs/PLAYBOOK.md",
  ".cursor/rules/00-project-overview.mdc",
  ".cursorignore",
];

const forbiddenAtRoot = [
  "index.html",
  "functions",
  "style.css",
  "agency-starter",
  "dashboard",
  "DEALERSHIP_CONVERSION_PLAYBOOK.md",
];

let failed = false;
for (const rel of required) {
  if (!fs.existsSync(path.join(root, rel))) {
    console.error("MISSING:", rel);
    failed = true;
  }
}
for (const rel of forbiddenAtRoot) {
  if (fs.existsSync(path.join(root, rel))) {
    console.error("SHOULD NOT EXIST AT ROOT:", rel);
    failed = true;
  }
}

if (failed) {
  process.exit(1);
}
console.log("Structure check passed.");
