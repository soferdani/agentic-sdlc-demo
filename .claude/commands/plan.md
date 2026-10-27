Write an implementation plan from an accepted spec, then stop for human acceptance.

Input: $ARGUMENTS — the feature slug (matches `docs/specs/<slug>.md`).

Preconditions (stop and say so if any fails):
- `docs/specs/<slug>.md` exists and its header says `status: accepted`.

Steps:
1. Read the spec, CLAUDE.md, `src/` and `test/`. Read only; change nothing.
2. Write `docs/plans/<slug>.md` with header `status: draft` and these sections:
   - Files to change (each with one line on what changes and why)
   - Tests to add (name each test and what it asserts)
   - Order of work (small steps, each leaves `npm test` green)
   - Risks / what I am unsure about
3. Commit it on `main` with message `<ticket-id>: plan`.
4. STOP. Say: "Review the plan, set status: accepted, commit, then run /implement <slug>."

Do not write code. Do not create a branch.
