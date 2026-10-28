// Stop hook: the agent may not finish while `npm test` is red.
// Exit 2 = block stopping and show stderr to the agent. Exit 0 = allow.
const { execSync } = require("node:child_process");

let raw = "";
process.stdin.on("data", (c) => (raw += c));
process.stdin.on("end", () => {
  let payload = {};
  try {
    payload = JSON.parse(raw);
  } catch {}
  // Already sent back once for this stop: don't loop forever.
  if (payload.stop_hook_active) process.exit(0);

  try {
    execSync("npm test", { stdio: ["ignore", "pipe", "pipe"], timeout: 120000 });
    process.exit(0);
  } catch (e) {
    const out = (e.stdout?.toString() || "") + (e.stderr?.toString() || "");
    const tail = out.split("\n").filter(Boolean).slice(-25).join("\n");
    console.error(`Stop hook: npm test is failing. Fix it before finishing. Do not delete or weaken tests.\n${tail}`);
    process.exit(2);
  }
});
