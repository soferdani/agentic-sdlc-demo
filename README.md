# agentic-sdlc-demo

A hands-on kit for the agentic SDLC loop with [Claude Code](https://claude.com/claude-code):
**ticket → PRD → plan → PR**, with a human gate at each step and the agent doing the work in between.

The app is deliberately tiny: an invoices list served by `node:http`, tested with `node:test`, zero dependencies.
You will not write code today. You will accept or reject what the agent writes.

## Before the workshop (5 minutes)

You need: **Node 20+**, **git**, **Claude Code** (logged in), and ideally the **GitHub CLI** (`gh`, logged in).

1. Make your own copy of this repo. Pick one:

   ```bash
   # with gh (recommended: you get your own repo, PRs open there)
   gh repo create agentic-sdlc-demo --template soferdani/agentic-sdlc-demo --public --clone
   cd agentic-sdlc-demo
   ```
   Or on GitHub click **Use this template → Create a new repository**, then clone yours.
   Or, without GitHub: `git clone https://github.com/soferdani/agentic-sdlc-demo` (you can still do everything except open a PR).

2. Check your setup:

   ```bash
   npm run doctor
   npm test        # 5 tests should pass
   npm start       # open http://localhost:3000, then Ctrl+C
   ```

If `doctor` prints `All good`, you are ready.

## The workshop (about 30 minutes)

Open Claude Code inside the repo:

```bash
claude
```

Pick a ticket in `docs/tickets.md`. Start with **MON-101** (filter invoices by status). Then follow the loop.

### 1. Ticket → PRD

```
/prd MON-101
```

The agent writes `docs/intent.md` and `docs/specs/invoice-status-filter.md`, commits them, and **stops** with a list of open questions.

**Your job (gate 1):** open the spec. Answer each open question in the file, delete the ones you don't care about,
change `status: draft` to `status: accepted`, and commit:

```bash
git commit -am "MON-101: accept spec"
```

### 2. PRD → plan

```
/plan invoice-status-filter
```

The agent reads the code and writes `docs/plans/invoice-status-filter.md`: files to change, tests to add, order of work, risks. Commits, **stops**.

**Your job (gate 2):** read the plan. If something is wrong, tell the agent in the chat and let it rewrite the plan. When you agree, set `status: accepted` and commit:

```bash
git commit -am "MON-101: accept plan"
```

### 3. Plan → PR

```
/implement invoice-status-filter
```

The agent creates a branch, writes the code and tests, runs `npm test` until green, pushes, opens a PR, posts a self-review ranked by `REVIEW.md`, and **stops**.

### 4. Review like a human

```bash
git checkout feature/MON-101-invoice-status-filter
npm test
npm start       # try http://localhost:3000/api/invoices?status=open
```

**Your job (gate 3):** read the diff. Did it build what the spec says, nothing more? If yes, approve the PR.
If not, do **not** fix the code by hand. Comment on the PR (or tell the agent in the chat) what to change, and run `/implement` again.

Done? Go back to `main` and take **MON-103** (it is a trap).

**Next: [the loop in your own repo](docs/your-repo.md)** (10–15 min): install the kit from `kit/`, paste a real Monday ticket, get a PRD and a plan against your real code.

Finished early, or want the advanced part? **[Two tickets at once, unattended](docs/parallel.md)**: `/ship` runs the whole loop with the PR as the only gate, a Stop hook keeps it honest, and two agents work in parallel worktrees.

## Stuck?

- **The agent wrote code during `/prd` or `/plan`.** Tell it: "You skipped a gate. Revert and follow the command." Then ask the facilitator.
- **`/implement` says the plan is not accepted.** Open `docs/plans/<slug>.md` and check `status: accepted` is on the first lines, and that you committed.
- **`gh pr create` fails.** Run `gh auth login`, or skip the PR: the branch is on your machine, review it with `git diff main`.
- **Tests fail and the agent keeps looping.** Stop it (Esc), read the failing test yourself, and tell the agent what the test expects. Do not let it delete the test.
- **Hook blocked a file.** Good. That is `.claude/hooks/protect_paths.js` doing its job. Ask why the agent wanted to touch it.
- **Start over.** See "Reset" below.

## What is in the repo

```
CLAUDE.md                     conventions the agent reads every session
REVIEW.md                     the checklist every PR is reviewed against
.claude/commands/prd.md       /prd <ticket>     -> docs/intent.md + docs/specs/<slug>.md, then STOPS
.claude/commands/plan.md      /plan <slug>      -> docs/plans/<slug>.md, then STOPS
.claude/commands/implement.md /implement <slug> -> branch, code, tests, PR, then STOPS
.claude/commands/ship.md      /ship <ticket>    -> the whole loop unattended, PR is the only gate (docs/parallel.md)
.claude/settings.json         hooks: cannot touch secrets; cannot finish with red tests. Allow-list for unattended runs
docs/tickets.md               four tickets standing in for the Monday board
docs/templates/spec.md        the PRD template
scripts/doctor.js             npm run doctor: checks your setup
.github/workflows/ci.yml      npm test on every PR
kit/                          the five files to copy into your own repo (kit/install.js)
```

Three rules the repo enforces: nothing is implemented without an accepted plan; the agent opens PRs but never approves or merges them; findings rank, humans decide.

To make rule two physical in your own repo: Settings → Branches → protect `main` → require a PR, the `test` check, and one approval.

## Reset

```bash
git checkout main
git branch -D feature/MON-101-invoice-status-filter
git log --oneline            # find the "intent + spec", "accept", "plan" commits
git revert --no-edit <oldest-sha>^..<newest-sha>
```

Or the blunt way: delete `docs/intent.md`, `docs/specs/*.md`, `docs/plans/*.md` and commit.
