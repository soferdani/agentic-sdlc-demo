# Quick win: two tickets at once, unattended (12 minutes)

You did one ticket with three gates. Now the leap: once the artifacts and guardrails exist, the gates can move to the PR,
and you can run several agents in parallel while you do something else.

What makes this safe is not the prompt. It is the harness:

- `/ship` writes spec and plan on the branch, so the reviewer sees every assumption.
- A **Stop hook** (`.claude/hooks/tests_before_stop.js`) refuses to let the agent finish while `npm test` is red.
- A **PreToolUse hook** blocks secrets. Branch protection means nobody merges without a human.
- Each agent works in its own **git worktree**, so two agents never touch the same files.

## Do it

Start on a clean `main`. You must have opened `claude` in this repo once and accepted the trust dialog, otherwise the allow-list is ignored and the agent will stop to ask. Open **two terminals** in the repo.

Terminal 1:

```bash
claude -w mon-102
```
```
/ship MON-102
```

Terminal 2:

```bash
claude -w mon-104
```
```
/ship MON-104
```

Each `claude -w <name>` creates a separate worktree (a second checkout of the repo) and opens Claude Code in it.
The allow-list in `.claude/settings.json` lets the agent run tests, commit, push and open the PR without asking.
Walk away. Come back in 5 to 8 minutes.

## While it runs

Watch one of the terminals. You should see, in order: branch created, spec and plan committed, code and tests, `npm test` green,
push, `gh pr create`, a self-review comment. If it tries to finish with red tests, the Stop hook sends it back. That is the moment to point at.

## Review

```bash
gh pr list
gh pr checkout <number>
npm test && npm start
```

Read the "Open questions" in the spec first. Those are the decisions the agent made for you. Agree? Approve. Disagree? Comment what to change and run `/implement <slug>` in that worktree.

Clean up:

```bash
git worktree list
git worktree remove .claude/worktrees/mon-102
git worktree remove .claude/worktrees/mon-104
```

## The point

Writing code was never the bottleneck. Your attention is. This setup spends it in one place: the PR.
Before you run this on a real repo, answer the five questions: does the agent know when it is done, can it check itself,
what may it touch, what stops it, who approves. Here the answers are: the spec, `npm test`, its own branch, the Stop hook and the allow-list, you.
