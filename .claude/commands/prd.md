Turn a Monday ticket into a committed intent and a PRD, then stop for human acceptance.

Input: $ARGUMENTS — a ticket id from `docs/tickets.md` (e.g. `MON-101`), or pasted ticket text.

Steps:
1. Read the ticket. If an id was given, find it in `docs/tickets.md`. If the Monday MCP is connected and a Monday item id was given, fetch the item instead.
2. Write `docs/intent.md`: the ask in the requester's own words, who asked, why now, what "done" looks like for them. Do not add scope.
3. Read CLAUDE.md, `src/` and `test/` so the PRD fits the real code.
4. Write `docs/specs/<feature-slug>.md` from `docs/templates/spec.md`. Keep it under one screen. Fill "Open questions" with every decision you are not sure about. Never guess silently.
5. Commit both files on `main` with message `<ticket-id>: intent + spec`.
6. STOP. Print the open questions and say: "Answer these, delete what you don't need, set status: accepted, commit, then run /plan <slug>."

Do not write code. Do not create a branch.
