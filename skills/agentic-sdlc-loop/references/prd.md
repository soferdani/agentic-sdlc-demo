# Step 1 — Ticket → intent + PRD

Input: the ticket text (title, description, comments) or an item id if a tracker tool is connected.

Preconditions: none. This step does not touch git branches and writes no code.

1. Read the ticket. Do not add scope.
2. Read CLAUDE.md and the parts of the code the ticket touches. Read only.
3. Write `docs/intent.md`: the ask in the requester's own words, who asked, why now, what "done" looks like for them.
4. Write `docs/specs/<slug>.md` from `assets/spec.md` (copy it to `docs/templates/spec.md` if the repo has none). Under one screen. Fill "Open questions" with every decision you are not sure about. Never guess silently.
5. Do not commit unless the repo's conventions say to. Show both files.
6. STOP. Print the open questions and say: "Answer these in the spec, delete what you don't need, set status: accepted, then run the plan step."

Do not write code. Do not create a branch.
