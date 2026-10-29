// Installs the loop as slash commands into a repo. Never overwrites an existing file.
// Usage, from the root of YOUR repo:  node <path-to-skill>/scripts/install.js
const fs = require("node:fs");
const path = require("node:path");

const assets = path.join(__dirname, "..", "assets");
const dst = process.cwd();
const files = [
  ["commands/prd.md", ".claude/commands/prd.md"],
  ["commands/plan.md", ".claude/commands/plan.md"],
  ["commands/implement.md", ".claude/commands/implement.md"],
  ["spec.md", "docs/templates/spec.md"],
  ["REVIEW.md", "REVIEW.md"],
];

if (!fs.existsSync(path.join(dst, ".git"))) {
  console.error("Run this from the root of your repo (no .git folder here).");
  process.exit(1);
}

for (const [from, rel] of files) {
  const to = path.join(dst, rel);
  if (fs.existsSync(to)) {
    console.log(`  kept     ${rel} (already exists, not touched)`);
    continue;
  }
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(path.join(assets, from), to);
  console.log(`  added    ${rel}`);
}
for (const d of ["docs/specs", "docs/plans"]) fs.mkdirSync(path.join(dst, d), { recursive: true });

console.log("\nDone. Open your agent here and run:  /prd <paste a ticket>");
