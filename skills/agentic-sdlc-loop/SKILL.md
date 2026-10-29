---
name: agentic-sdlc-loop
description: Runs a software ticket through the agentic SDLC loop with human gates. Ticket → intent + PRD (stop) → plan (stop) → branch, code, tests, PR (stop). Use when the user gives you a ticket, feature request, bug report or Monday/Jira item and wants it built spec-first, or says "run the loop", "/prd", "/plan", "/implement", "take this ticket end to end". The agent never approves or merges its own work.
license: MIT
compatibility: Designed for Claude Code. Works in any agent that can read/write files and run git. A PR CLI (gh, glab, az) is needed for the last step.
metadata:
  author: soferdani
  version: "1.0"
  source: https://github.com/soferdani/agentic-sdlc-demo
---

# Agentic SDLC loop

One ticket in, one pull request out, three places where a human says yes.
You do the work in between. You never approve your own work.

```
ticket ──► docs/intent.md + docs/specs/<slug>.md ──STOP──► docs/plans/<slug>.md ──STOP──► branch + tests + PR ──STOP
              (gate 1: spec accepted)                 (gate 2: plan accepted)          (gate 3: human reviews PR)
```

Every step ends in a file in git. The next step refuses to run until a human
has set `status: accepted` in the previous file. That is the whole mechanism.

## Which step am I on?

Decide from the files, not from the conversation:

| State | Do |
|---|---|
| No `docs/specs/<slug>.md` for this ticket | **Step 1: PRD** (`references/prd.md`) |
| Spec exists, header says `status: draft` | Stop. Tell the human to answer the open questions and set `status: accepted`. |
| Spec `accepted`, no `docs/plans/<slug>.md` | **Step 2: plan** (`references/plan.md`) |
| Plan exists, `status: draft` | Stop. Tell the human to review it and set `status: accepted`. |
| Plan `accepted`, no feature branch yet | **Step 3: implement** (`references/implement.md`) |
| PR open | Stop. Say: "Pull the branch, run it, approve or comment what to change." |

If the user asks for a specific step by name (`/prd`, `/plan`, `/implement`), run that step and check its preconditions first.

## Rules that hold on every step

- **Read before you write.** CLAUDE.md first, then the code the ticket touches.
- **Never guess silently.** Every decision you were unsure about goes under "Open questions" in the spec. A human answers or deletes them.
- **Do not add scope.** The ticket is the ask. The spec is one screen.
- **No code before an accepted plan.** Steps 1 and 2 are read-only on the codebase.
- **Never weaken or delete a test** to get green. Bug fix = failing test first.
- **Never approve, merge, or self-review as if it were an approval.** Open the PR, post findings ranked by `assets/REVIEW.md` under the heading "Self-review (not an approval)", and stop.
- **If you depart from the plan while building, update the plan file in the same commit** and say why.

## Files this skill writes

```
docs/intent.md              the ask in the requester's own words, who, why now, what "done" looks like
docs/specs/<slug>.md        the PRD, from assets/spec.md  (status: draft → accepted by the team lead)
docs/plans/<slug>.md        files to change, tests to add, order of work, risks (status: draft → accepted)
feature/<ticket-id>-<slug>  the branch; commits prefixed <ticket-id>:
```

`<slug>` is a short kebab-case feature name you choose from the ticket (e.g. `invoice-status-filter`). Reuse it for all three files.

## Optional: install as slash commands

For teams that prefer `/prd`, `/plan`, `/implement` as separate commands, run from the root of the target repo:

```
node <path-to-this-skill>/scripts/install.js
```

It copies the three commands, `REVIEW.md` and `docs/templates/spec.md` into the repo and never overwrites an existing file.

## Make the gates physical

The skill asks you to stop. The repo should make it impossible not to: protect `main` (require a PR, a green test check, one approval), and add a Stop hook that refuses to end the session while tests are red. A reference implementation of both lives in the source repo.

Source and a runnable demo app: https://github.com/soferdani/agentic-sdlc-demo
