# agentic-sdlc-demo

Live demo of an agentic SDLC loop with [Claude Code](https://claude.com/claude-code):
**Monday ticket → PRD → plan → PR**, with a human gate at each step and the agent doing the work in between.

The app is deliberately tiny: an invoices list served by `node:http`, tested with `node:test`, zero dependencies.
The interesting part is everything around it.

```
CLAUDE.md                     conventions the agent reads every session
REVIEW.md                     the checklist every PR is reviewed against
.claude/commands/prd.md       /prd <ticket>     -> docs/intent.md + docs/specs/<slug>.md, then STOPS
.claude/commands/plan.md      /plan <slug>      -> docs/plans/<slug>.md, then STOPS
.claude/commands/implement.md /implement <slug> -> branch, code, tests, PR, then STOPS
.claude/settings.json         hook: the agent cannot touch .env / secrets
docs/tickets.md               four tickets standing in for the Monday board
docs/templates/spec.md        the PRD template
.github/workflows/ci.yml      npm test on every PR
```

## Run the app

```bash
npm test      # 5 tests
npm start     # http://localhost:3000
```

## The demo (about 8 minutes)

Prerequisites: Node 20+, `gh auth login`, Claude Code installed. Start on a clean `main`.

```
claude
```

1. **Ticket to PRD.** `/prd MON-101`
   The agent writes `docs/intent.md` and `docs/specs/invoice-status-filter.md`, commits, and stops with a list of open questions.
   *Human gate 1:* answer the questions in the spec, set `status: accepted`, commit.

2. **Spec to plan.** `/plan invoice-status-filter`
   The agent reads the code and writes `docs/plans/invoice-status-filter.md` (files, tests, order, risks). Commits, stops.
   *Human gate 2:* read the plan, set `status: accepted`, commit.

3. **Plan to PR.** `/implement invoice-status-filter`
   The agent branches, codes, runs `npm test` until green, pushes, opens the PR with `gh`, posts a self-review ranked by `REVIEW.md`, and stops.

4. **Review.** Pull the branch, run it, look at the diff.
   *Human gate 3:* approve, or comment what to change and run `/implement` again.

```bash
git fetch && git checkout feature/MON-101-invoice-status-filter
npm test && npm start
```

## Three rules the repo enforces

- Nothing is implemented without an accepted plan.
- The agent opens PRs; it never approves or merges them. Branch protection on `main` makes that physical.
- Findings rank, humans decide.

## Reset between runs

```bash
git checkout main
git branch -D feature/MON-101-invoice-status-filter
git revert <the intent/spec/plan commits>
```
