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

## Third segment (10–15 min): the loop in their own repo

Script in `docs/your-repo.md`. This is the one to run; the parallel segment below is a bonus for the fast ones.

| min | what |
|---|---|
| 0–2 | everyone opens their own repo and runs `node <demo>/kit/install.js`. No Node: copy the five files from `kit/`. |
| 2–7 | `/prd <pasted Monday ticket>`. Walk around: is the ticket small enough? Did it stop? Read one open-questions list aloud. |
| 7–12 | they answer, set accepted, `/plan <slug>`. Ask each person: "did it name the right files?" Every wrong file is a CLAUDE.md line, write it now. |
| 12–15 | close: "you just wrote the PRD and plan for a real ticket. Tomorrow, `/implement`. Send me the PR." |

Traps: someone picks a project-sized ticket (make them pick a smaller one); a repo with no CLAUDE.md (`/init` first); the agent writes code during `/prd` (tell it to revert, follow the command); huge monorepo (add "Relevant area: ..." to the ticket text).

## Bonus segment (12–15 min): two tickets at once, unattended

For the people who finished, or as the closing segment after the talk. Script in `docs/parallel.md`.

| min | what |
|---|---|
| 0–2 | say the one line: "the gates don't disappear, they move to the PR. What makes that safe is the harness, not the prompt." Point at the Stop hook and the allow-list in `.claude/settings.json`. |
| 2–4 | everyone: two terminals, `claude -w mon-102` + `/ship MON-102`, `claude -w mon-104` + `/ship MON-104`. |
| 4–10 | agents run. Walk around. Ask people to watch for the Stop hook firing (red tests → sent back). |
| 10–15 | `gh pr list`, open one PR each, read the "Open questions" in the spec. Ask: "which assumption would you have made differently?" |

Traps: trust dialog not accepted (allow-list ignored, agent asks for every command: answer yes, carry on); `gh` not logged in (branch exists locally, review with `git diff main`); two agents finish within seconds of each other and both PRs are fine, which makes the point better than any slide.

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

See docs/workshop.md "Reset". Or delete the repo copy and recreate from the template.
