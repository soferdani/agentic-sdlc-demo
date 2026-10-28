Turn a ticket into a committed-ready intent and a PRD, then stop for human acceptance.

Input: $ARGUMENTS — the ticket text pasted from Monday (title, description, any comments). If a Monday MCP is connected and an item id was given, fetch the item instead.

Steps:
1. Read the ticket. Do not add scope.
2. Read CLAUDE.md and the parts of the code the ticket touches, so the PRD fits the real system. Read only.
3. Write `docs/intent.md`: the ask in the requester's own words, who asked, why now, what "done" looks like for them.
4. Write `docs/specs/<feature-slug>.md` from `docs/templates/spec.md`. Keep it under one screen. Fill "Open questions" with every decision you are not sure about. Never guess silently.
5. Do not commit. Show both files.
6. STOP. Print the open questions and say: "Answer these in the spec, delete what you don't need, set status: accepted, then run /plan <slug>."

Do not write code. Do not create a branch.
