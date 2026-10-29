Implement an accepted plan end to end and open a PR. Do not approve or merge.

Input: $ARGUMENTS — the feature slug (matches `docs/specs/<slug>.md` and `docs/plans/<slug>.md`).

Preconditions (stop and say so if any fails):
- `docs/plans/<slug>.md` exists and its header says `status: accepted`.
- Working tree is clean.

Steps:
1. Create branch `feature/<ticket-id>-<slug>` from the main branch, following the branch convention in CLAUDE.md if there is one.
2. Commit `docs/intent.md`, the spec and the plan on that branch: `<ticket-id>: intent + spec + plan`.
3. Implement exactly the plan. If reality forces a departure, update `docs/plans/<slug>.md` in the same commit and say why.
4. Run the test, build and lint commands from CLAUDE.md until green. Fix what you broke. Do not weaken or delete tests.
5. Commit in small steps with `<ticket-id>: <what>` messages.
6. Push and open a PR with the CLI this repo uses (`gh pr create`, `glab mr create`, `az repos pr create`). If none is available, print the branch name and stop. PR body: link to the spec and plan, what changed, how to verify locally (exact commands), anything you were unsure about.
7. Run the checklist in REVIEW.md against your own diff and post the ranked findings as the first PR comment, headed "Self-review (not an approval)".
8. STOP. Print the PR URL and: "Pull the branch, run it, approve or comment what to change."
