# CLAUDE.md — agentic-sdlc-demo

## What this is
A tiny invoices service used to demonstrate the agentic SDLC loop:
Monday ticket → `docs/intent.md` → `docs/specs/<feature>.md` → `docs/plans/<feature>.md` → branch + tests → PR.
Humans accept the intent, accept the plan, and approve the PR. The agent does everything in between.

## Stack & commands
- Node 20+, zero dependencies. `node:http` server, `node:test` tests.
- Run: `npm start` (http://localhost:3000). Test: `npm test`.
- Run `npm test` before claiming anything is done.

## Conventions
- Branch: `feature/<ticket-id>-<slug>` from `main`. One ticket per branch.
- Commits: `<ticket-id>: <what changed>`.
- API lives under `/api/...`, query params are camelCase, responses are JSON.
- Business logic goes in `src/invoices.js`; `src/server.js` only routes and renders.
- Every behaviour change ships with a test in `test/`. Bug fix = failing test first.

## Artifacts (the SDLC loop)
- `docs/intent.md` — the ask, in the requester's words. Accepted by the product owner.
- `docs/specs/<feature>.md` — the PRD. `status: draft` until a human sets `status: accepted`.
- `docs/plans/<feature>.md` — the plan. Implementation happens only from an accepted plan.
- If you depart from the plan while building, update the plan file in the same commit and say why.

## Never
- Touch `.env*` or `config/secrets.json` (a hook blocks it anyway).
- Delete or weaken a test to make the suite green.
- Approve, merge, or self-review a PR as if it were an approval. Open it and stop.

## Known mistakes (append as they happen)
- (none yet)
