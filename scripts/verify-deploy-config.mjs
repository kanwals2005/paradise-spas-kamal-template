import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const siteRoot = path.join(root, "apps/site");
const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));

let failed = false;

function fail(message) {
  console.error("FAIL:", message);
  failed = true;
}

function ok(message) {
  console.log("OK:", message);
}

const deploy = packageJson.scripts?.deploy ?? "";
const preview = packageJson.scripts?.["preview:deploy"] ?? "";

if (!deploy.includes("apps/site")) {
  fail(`package.json deploy script must target apps/site. Got: ${deploy}`);
} else {
  ok("package.json deploy targets apps/site");
}

if (!preview.includes("apps/site")) {
  fail(`package.json preview:deploy must target apps/site. Got: ${preview}`);
} else {
  ok("package.json preview:deploy targets apps/site");
}

const requiredSiteFiles = [
  "index.html",
  "functions/api/lead.js",
  "_redirects",
  "robots.txt",
  "sitemap.xml",
];

for (const rel of requiredSiteFiles) {
  const full = path.join(siteRoot, rel);
  if (!fs.existsSync(full)) {
    fail(`missing apps/site/${rel}`);
  }
}

if (requiredSiteFiles.every((rel) => fs.existsSync(path.join(siteRoot, rel)))) {
  ok("apps/site has index.html, functions, redirects, robots, sitemap");
}

const forbiddenAtRepoRoot = ["index.html", "functions", "style.css"];
for (const rel of forbiddenAtRepoRoot) {
  if (fs.existsSync(path.join(root, rel))) {
    fail(`repo root still has ${rel} — deploy root must be apps/site only`);
  }
}

if (!forbiddenAtRepoRoot.some((rel) => fs.existsSync(path.join(root, rel)))) {
  ok("repo root is not the Pages deploy root");
}

const wranglerConfig = path.join(siteRoot, "wrangler.jsonc");
if (!fs.existsSync(wranglerConfig)) {
  fail("missing apps/site/wrangler.jsonc");
} else {
  ok("apps/site/wrangler.jsonc present");
}

if (failed) {
  console.error("\nDeploy config verification failed.");
  process.exit(1);
}

console.log("\nDeploy config verification passed.");
console.log("Production deploy: npm run deploy");
console.log("Preview deploy:    npm run preview:deploy");
console.log("Pages project:     paradise-spas");
console.log("Deploy directory:  apps/site (static + functions/)");
