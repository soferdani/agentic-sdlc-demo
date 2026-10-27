Implement an accepted plan end to end and open a PR. Do not approve or merge.

Input: $ARGUMENTS — the feature slug (matches `docs/specs/<slug>.md` and `docs/plans/<slug>.md`).

Preconditions (stop and say so if any fails):
- `docs/plans/<slug>.md` exists and its header says `status: accepted`.
- Working tree is clean on `main`.

Steps:
1. Create branch `feature/<ticket-id>-<slug>` from `main`.
2. Implement exactly the plan. If reality forces a departure, update `docs/plans/<slug>.md` in the same commit and say why.
3. Run `npm test` until green. Fix what you broke. Do not weaken or delete tests.
4. Commit in small steps with `<ticket-id>: <what>` messages.
5. Push and open a PR with `gh pr create` against this repository's own `main`. If `gh` is missing or not logged in, skip the PR: say so, print the branch name, and tell the human to review with `git diff main`. PR body: link to the spec and plan, what changed, how to verify locally (exact commands), and anything you were unsure about.
6. Run the checklist in REVIEW.md against your own diff and post the ranked findings as the first PR comment, headed "Self-review (not an approval)".
7. STOP. Print the PR URL and: "Pull the branch, run it, approve or comment with @claude and what to change."
