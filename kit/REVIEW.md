# REVIEW.md — what every PR is checked against

Rank findings by severity. Findings never approve; a code owner does.

1. **Matches the spec and plan.** Anything built that the spec does not ask for? Anything asked for that is missing?
2. **Bugs.** Null paths, off-by-one, unhandled errors, concurrency on shared state.
3. **Security.** Input validation at the boundary, no secrets, no raw SQL from user input, authorisation on every new endpoint.
4. **Tests.** New behaviour has a test; bug fixes have the failing-then-passing test; tests assert behaviour, not implementation.
5. **Conventions.** The rules in CLAUDE.md and `.claude/rules/`.
6. **Plan drift.** If the code departs from `docs/plans/<feature>.md`, the plan file was updated in the same PR.

Output: a ranked list, each item with file:line and a one-line fix. End with one of: "no blocking findings" / "blocking: <n>".
