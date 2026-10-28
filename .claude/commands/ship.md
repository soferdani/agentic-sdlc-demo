Run the whole loop for one ticket without stopping: intent, spec, plan, code, tests, PR. The only human gate is the PR.

Input: $ARGUMENTS — a ticket id from `docs/tickets.md` (e.g. `MON-102`).

Use this only for small, well-described tickets. Everything you write goes on the feature branch, not on `main`.

Steps:
1. Read the ticket in `docs/tickets.md`, CLAUDE.md, `src/` and `test/`.
2. Create branch `feature/<ticket-id>-<slug>` from `main` (`git checkout -b feature/<ticket-id>-<slug> main`). If the branch exists, stop and say so.
3. Write `docs/specs/<slug>.md` from `docs/templates/spec.md` with `status: accepted` and `accepted-by: /ship (unattended)`. Put every assumption you had to make under "Open questions" so the reviewer sees them.
4. Write `docs/plans/<slug>.md` with `status: accepted`: files to change, tests to add, order of work, risks.
5. Commit spec and plan: `<ticket-id>: spec + plan (unattended)`.
6. Implement exactly the plan. Run `npm test` until green. Do not weaken or delete tests. If you depart from the plan, update the plan file in the same commit and say why.
7. Commit in small steps with `<ticket-id>: <what>` messages.
8. Push and open a PR with `gh pr create`. PR body: link to the spec and plan, what changed, the assumptions from "Open questions", how to verify locally (exact commands). If `gh` is missing, print the branch name instead.
9. Run the checklist in REVIEW.md against your own diff and post the ranked findings as the first PR comment, headed "Self-review (not an approval)".
10. STOP. Print the PR URL and: "Pull the branch, run it, approve or comment with what to change."

Never merge. Never touch `main`.
