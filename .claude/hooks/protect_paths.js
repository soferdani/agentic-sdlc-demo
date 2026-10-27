// PreToolUse hook: block the agent from editing secrets. Exit 2 = block, 0 = allow.
let raw = "";
process.stdin.on("data", (c) => (raw += c));
process.stdin.on("end", () => {
  let path = "";
  try {
    path = JSON.parse(raw).tool_input?.file_path || "";
  } catch {}
  if (/(\.env(\.|$)|secrets\.json$|\.pem$|\.pfx$)/i.test(path)) {
    console.error(`Blocked by hook: ${path} is a protected file (see CLAUDE.md > Never).`);
    process.exit(2);
  }
  process.exit(0);
});
