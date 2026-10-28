# Quick win: the loop in your own repo (10–15 minutes)

You ran the loop on a toy. Now run the first two steps on **your repo** with a **real ticket** from your Monday board.
No code gets written today. You leave with a PRD and a plan the agent wrote against your actual codebase, with the questions it could not answer.

You need: your repo open, Claude Code working in it, and a `CLAUDE.md` with the test command (from the onboarding exercise; if you don't have one, run `/init` first, two minutes).

## 1. Install the kit (1 minute)

From the root of your repo:

```bash
node <path-to-agentic-sdlc-demo>/kit/install.js
```

It adds five files and never overwrites anything you already have:

```
.claude/commands/prd.md         /prd       ticket -> docs/intent.md + docs/specs/<slug>.md, then STOPS
.claude/commands/plan.md        /plan      spec -> docs/plans/<slug>.md, then STOPS
.claude/commands/implement.md   /implement plan -> branch, code, tests, PR, then STOPS
docs/templates/spec.md          the PRD template
REVIEW.md                       what every PR is checked against
```

No Node on this machine? Copy those five files from the `kit/` folder by hand.

## 2. Ticket → PRD (5 minutes)

Pick a **small, real** ticket from Monday: a half-day feature, not a project. Copy its title, description and comments.

```bash
claude
```
```
/prd <paste the ticket text here>
```

The agent reads your code, writes `docs/intent.md` and `docs/specs/<slug>.md`, and **stops** with a list of open questions.

Read the open questions. That list is the point: these are the decisions you would have made silently while coding.
Answer them in the spec, delete the ones you don't care about, change `status: draft` to `status: accepted`.

## 3. PRD → plan (5 minutes)

```
/plan <slug>
```

The agent writes `docs/plans/<slug>.md`: the files it would change, with real paths, the tests it would add, the order, the risks.

Check one thing: **did it name the right files?** If not, that is a line missing from CLAUDE.md (a gotcha, a misleading folder). Tell the agent, let it rewrite the plan, and add the line to CLAUDE.md.

## 4. Stop here

Commit the three files on a branch, or paste the spec into the Monday item as its description. Tomorrow, when you have an hour: set the plan to `accepted` and run `/implement <slug>`. You already know what it will do.

## Stuck?

- **"Working tree is clean" or branch errors.** `/prd` and `/plan` do not touch git. Only `/implement` does.
- **The spec is three screens long.** Tell the agent: "Under one screen. Move detail to the plan."
- **No open questions.** Ask it: "What did you decide on your own? List it." There is always something.
- **The plan names files that don't exist or are legacy.** Good catch. That is your CLAUDE.md gotcha for today.
- **Your repo is huge and `/prd` reads for ages.** Add to the ticket text: "Relevant area: src/<module>". Point, don't let it wander.
