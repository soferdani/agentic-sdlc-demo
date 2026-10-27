// Checks that everything the workshop needs is installed. Run: npm run doctor
const { execSync } = require("node:child_process");

function has(cmd) {
  try {
    return execSync(cmd, { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  } catch {
    return null;
  }
}

const checks = [
  ["Node 20+", () => (parseInt(process.versions.node) >= 20 ? `v${process.versions.node}` : null), "install from https://nodejs.org"],
  ["git", () => has("git --version"), "install from https://git-scm.com"],
  ["git identity", () => has("git config user.email"), 'git config --global user.email "you@example.com" && git config --global user.name "Your Name"'],
  ["GitHub CLI (gh)", () => has("gh --version")?.split("\n")[0], "install from https://cli.github.com, then: gh auth login"],
  ["gh logged in", () => (has("gh auth status") !== null ? "ok" : null), "gh auth login"],
  ["Claude Code", () => has("claude --version"), "npm install -g @anthropic-ai/claude-code, then run: claude (and log in)"],
];

let bad = 0;
for (const [name, fn, fix] of checks) {
  const v = fn();
  if (v) console.log(`  ok   ${name}  (${v})`);
  else {
    bad++;
    console.log(`  MISSING  ${name}  ->  ${fix}`);
  }
}
console.log(bad === 0 ? "\nAll good. Run: claude" : `\n${bad} thing(s) to fix before the workshop. gh is optional if you skip the PR step.`);
