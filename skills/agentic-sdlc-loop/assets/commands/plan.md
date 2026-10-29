Write an implementation plan from an accepted spec, then stop for human acceptance.

Input: $ARGUMENTS — the feature slug (matches `docs/specs/<slug>.md`).

Preconditions (stop and say so if any fails):
- `docs/specs/<slug>.md` exists and its header says `status: accepted`.

Steps:
1. Read the spec, CLAUDE.md, and the code the spec touches. Read only; change nothing.
2. Write `docs/plans/<slug>.md` with header `status: draft` and these sections:
   - Files to change: each with its real path and one line on what changes and why
   - Tests to add: name each test and what it asserts, using the test command from CLAUDE.md
   - Order of work: small steps, each leaving the test suite green
   - Risks / what I am unsure about
3. Do not commit. Show the file.
4. STOP. Say: "Review the plan. If a file or step is wrong, tell me and I will rewrite it. When you agree, set status: accepted, then run /implement <slug>."

Do not write code. Do not create a branch.
