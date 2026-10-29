# Step 2 — Accepted spec → plan

Input: the feature slug (matches `docs/specs/<slug>.md`).

Preconditions (stop and say so if any fails):
- `docs/specs/<slug>.md` exists and its header says `status: accepted`.

1. Read the spec, CLAUDE.md, and the source and test folders. Read only; change nothing.
2. Write `docs/plans/<slug>.md` with header `status: draft` and these sections:
   - **Files to change**: each with one line on what changes and why. Real paths.
   - **Tests to add**: name each test and what it asserts.
   - **Order of work**: small steps, each leaves the test suite green.
   - **Risks / what I am unsure about.**
3. Show the plan.
4. STOP. Say: "Review the plan, set status: accepted, then run the implement step."

Do not write code. Do not create a branch.

Tip for the human: if the plan names the wrong files, that is a missing line in CLAUDE.md. Add it, then ask for the plan again.
