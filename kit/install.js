// Copies the kit into a repo. Never overwrites an existing file.
// Usage, from the root of YOUR repo:  node <path-to-agentic-sdlc-demo>/kit/install.js
const fs = require("node:fs");
const path = require("node:path");

const src = __dirname;
const dst = process.cwd();
const files = [
  ".claude/commands/prd.md",
  ".claude/commands/plan.md",
  ".claude/commands/implement.md",
  "docs/templates/spec.md",
  "REVIEW.md",
];

if (!fs.existsSync(path.join(dst, ".git"))) {
  console.error("Run this from the root of your repo (no .git folder here).");
  process.exit(1);
}

for (const rel of files) {
  const to = path.join(dst, rel);
  if (fs.existsSync(to)) {
    console.log(`  kept     ${rel} (already exists, not touched)`);
    continue;
  }
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(path.join(src, rel), to);
  console.log(`  added    ${rel}`);
}
for (const d of ["docs/specs", "docs/plans"]) fs.mkdirSync(path.join(dst, d), { recursive: true });

console.log("\nDone. Open Claude Code here and run:  /prd <paste a ticket from Monday>");
