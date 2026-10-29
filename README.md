# agentic-sdlc-demo

**Ticket → PRD → plan → PR. The agent does the work, a human says yes three times.**

[![tests](https://github.com/soferdani/agentic-sdlc-demo/actions/workflows/ci.yml/badge.svg)](https://github.com/soferdani/agentic-sdlc-demo/actions/workflows/ci.yml)
[![license: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Agent Skills](https://img.shields.io/badge/skill-agentic--sdlc--loop-8A2BE2)](skills/agentic-sdlc-loop/SKILL.md)
![zero dependencies](https://img.shields.io/badge/dependencies-0-success)

Most "AI coding" setups put the human in the wrong place: watching the agent type, nudging it line by line.
This repo puts the human at three gates instead, and lets the agent run alone between them.

```
 ticket ──► intent + spec ──┤gate 1├──► plan ──┤gate 2├──► branch + tests + PR ──┤gate 3├──► merge
             (agent)        accept    (agent)  accept        (agent)              human review
```

Every step ends as a **file in git** (`docs/intent.md`, `docs/specs/<slug>.md`, `docs/plans/<slug>.md`, a PR).
The next step refuses to run until a human flips `status: draft` to `status: accepted`. The agent never approves or merges its own work.

It ships as three things, pick what you need:

| | What | For |
|---|---|---|
| **Skill** | [`skills/agentic-sdlc-loop/`](skills/agentic-sdlc-loop/SKILL.md), one `SKILL.md` in the [Agent Skills](https://agentskills.io) format | Claude Code, Cursor, Copilot, Codex CLI, Gemini CLI, any agent that reads skills |
| **Slash commands** | `/prd`, `/plan`, `/implement`, `/ship` + `REVIEW.md` + a spec template, installed by [`kit/install.js`](kit/install.js) | Claude Code users who want the steps as separate commands |
| **Demo repo** | A 100-line invoices app, 4 tickets, hooks, CI, branch protection notes | Trying the loop in 10 minutes, or running a [team workshop](docs/workshop.md) |

## Try it in 10 minutes

You need Node 20+, git, and [Claude Code](https://claude.com/claude-code). `gh` (GitHub CLI) if you want the PR step.

```bash
gh repo create agentic-sdlc-demo --template soferdani/agentic-sdlc-demo --public --clone
cd agentic-sdlc-demo
npm run doctor     # checks node, git, gh, claude
npm test           # 5 tests pass
claude
```

Then inside Claude Code:

```
/prd MON-101            # ticket → docs/intent.md + docs/specs/<slug>.md, then STOPS with open questions
```
Answer the questions in the spec, set `status: accepted`, commit.
```
/plan <slug>            # spec → docs/plans/<slug>.md (files, tests, order, risks), then STOPS
```
Read it, set `status: accepted`, commit.
```
/implement <slug>       # plan → branch, code, tests green, push, PR + ranked self-review, then STOPS
```
Pull the branch, run it, approve or comment. **Do not fix the code by hand.** If it's wrong, fix the spec, the plan, or `CLAUDE.md`, and run again. That is the habit the loop is teaching.

Done? Take `MON-103`. It's a trap.

## Use it in your own repo

**As a skill** (any agent that supports `SKILL.md`): copy `skills/agentic-sdlc-loop/` into your agent's skills folder
(`.claude/skills/` for Claude Code), then ask: *"run the loop on this ticket: …"*. The skill reads the state of `docs/` and knows which step is next.

**As slash commands** (Claude Code): from the root of your repo

```bash
node <path-to-this-repo>/kit/install.js
```

adds five files and never overwrites anything you already have:

```
.claude/commands/prd.md        .claude/commands/plan.md        .claude/commands/implement.md
docs/templates/spec.md         REVIEW.md
```

First run on a real ticket: pick something half-a-day sized, paste it into `/prd`, read the open questions.
Those are the decisions you would have made silently while coding. See [docs/your-repo.md](docs/your-repo.md).

## Make the gates physical

A prompt that says "stop" is a request. These make it a rule:

- **Stop hook** [`.claude/hooks/tests_before_stop.js`](.claude/hooks/tests_before_stop.js): the agent cannot end its turn while `npm test` is red. (Checked: green → exit 0, red → exit 2, re-entry → exit 0, no infinite loop.)
- **PreToolUse hook** [`.claude/hooks/protect_paths.js`](.claude/hooks/protect_paths.js): the agent cannot edit `.env*`, `secrets.json`, certificates.
- **Allow-list** in [`.claude/settings.json`](.claude/settings.json): test, commit, push, `gh pr` run without prompts; everything else asks.
- **Branch protection** on `main`: require a PR, the `test` check, one approval. Settings → Branches. Now the agent *can't* merge, whatever the prompt says.
- **`REVIEW.md`**: the checklist every PR is ranked against. Findings rank; a code owner decides.

## Unattended: two tickets at once

Once the artifacts and guardrails exist, the three gates can collapse to one (the PR) and you can run agents in parallel worktrees:

```bash
claude -w mon-102      # terminal 1
/ship MON-102
claude -w mon-104      # terminal 2
/ship MON-104
```

Walk away. Come back to two PRs, each with its spec, plan and assumptions on the branch. [docs/parallel.md](docs/parallel.md).

## What's in the repo

```
skills/agentic-sdlc-loop/     the skill: SKILL.md + references/ (one file per step) + assets/ + scripts/install.js
kit/                          the same loop as five plain files + kit/install.js
.claude/commands/             /prd  /plan  /implement  /ship
.claude/hooks/                protect secrets · tests must pass before the agent may stop
.claude/settings.json         hooks + allow-list for unattended runs
CLAUDE.md                     conventions the agent reads every session (+ "Known mistakes", append as they happen)
REVIEW.md                     the PR checklist
docs/tickets.md               four tickets standing in for the board (MON-101..104)
docs/templates/spec.md        the one-screen PRD template
docs/workshop.md              run this as a 30-min hands-on with your team · docs/facilitator.md · docs/your-repo.md · docs/parallel.md
src/  test/                   the invoices app: node:http + node:test, zero dependencies
```

## Why it's shaped like this

- **Files, not chat.** Intent, spec and plan live in git next to the code. Reviewable, diffable, blame-able. A chat transcript is none of those.
- **Open questions are the product of step 1.** A spec with no open questions means the agent guessed. Make it list what it decided alone.
- **Wrong file in the plan = missing line in `CLAUDE.md`.** Every mistake becomes one line under "Known mistakes". The repo gets smarter; the prompts don't grow.
- **The agent never grades itself.** It posts a ranked self-review headed "not an approval". A human approves.

Built for a workshop with an enterprise dev team in Israel (Oct 2026), based on the [AI-native SDLC playbook](https://claude.com/resources/articles/the-ai-native-sdlc-playbook). If you run it with your team, I'd like to hear what broke: open an issue.

## Contributing

Issues and PRs welcome. Keep the app tiny and dependency-free. A new ticket in `docs/tickets.md` should be buildable by the agent in a few minutes and have a clear "done when".
If the loop fails in your repo in an interesting way, that story is worth more than a feature; open an issue.

If this saved you an afternoon, a ⭐ helps other teams find it.

MIT © [Dani Sofer](https://www.soferdani.com)
