# Facilitator notes

One line to say at the start: **"You are not writing code today. You are accepting or rejecting what the agent writes. Three gates: intent, plan, PR."**

## Timing (30 min hands-on after the talk)

| min | what |
|---|---|
| 0–5 | everyone runs `npm run doctor`, `npm test`, `claude`. Fix setups. |
| 5–10 | `/prd MON-101`. Watch for: agent writing code, agent not stopping, spec longer than one screen. |
| 10–13 | gate 1: they answer open questions, set accepted, commit. |
| 13–18 | `/plan`, gate 2. Ask one pair to read their plan aloud. |
| 18–25 | `/implement`. Pairs that finish early take MON-102 or MON-104. |
| 25–30 | gate 3: pull, run, diff. Ask: "Who found something the self-review missed?" |

## Walking around: what to look for

- Someone editing code by hand. Stop them. Fix the spec, the plan, or CLAUDE.md, rerun.
- `/prd` with no open questions. Ask what the agent silently decided (page UI? case-insensitive status?).
- Agent weakened a test to go green. Point at CLAUDE.md "Never". Have them tell the agent.
- MON-103: the "bug" is not real (the page already uses the sorted list). The right outcome is a test proving it, and no code change. Whoever "fixes" it added a bug.

## Known traps

- No `gh` or not logged in: the PR step fails. Fine, review with `git diff main` instead.
- Corporate proxy blocks Claude login: pair them with someone whose laptop works.
- Windows: everything is Node, no bash needed. Hooks run with `node`.
- Agent runs `/implement` before the plan is accepted: the command checks for `status: accepted` but a model can ignore it. That moment is the lesson: hooks and branch protection are the real guardrails, prompts are not.

## Reset for the next group

See README "Reset". Or delete the repo copy and recreate from the template.
