<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Git commit rules

When asked to commit, review ALL uncommitted changes and commit them as a series of logical commits following Conventional Commits 1.0.0 (https://www.conventionalcommits.org/en/v1.0.0/).

### Workflow
1. Run `git status`, read the real diffs (`git diff`, staged and unstaged), and list untracked files. Do not guess from file names.
2. Run `git log --oneline -15` and reuse the scopes and style already in the history.
3. Group changes: one logical unit per commit. Related changes (for example a new token and the component that uses it) go in the SAME commit. Unrelated changes go in separate commits. If one file mixes units, split it with `git add -p`.
4. Order commits so foundations (config, tokens, dependencies, shared utilities) come before the code that depends on them. Each commit should leave the project in a working state.
5. Do not create one giant commit, and do not create tiny meaningless commits.
6. At the end, run `git status` (the tree should be clean, or explain what was left out and why) and `git log --oneline` to show the new commits.

### Message format
```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```
- Types: feat, fix, refactor, style, docs, test, chore, perf, build, ci, revert.
- Scope: short lowercase noun (auth, design-tokens, navbar, layout, deps). Omit only if none fits.
- Description: English, imperative mood ("add", not "added"), lowercase first letter, no trailing period, max 72 characters.
- Add a body only when the "why" is not obvious. Explain WHY, not what.
- Breaking changes: add `!` after the type/scope and a `BREAKING CHANGE:` footer.

### Safety
- Never use `git add .` or `git add -A`. Stage files or hunks explicitly.
- Never commit secrets or local files (.env*, keys, tokens, build output, node_modules, .next, editor files). If found, stop and tell the user.
- Never push, amend, rebase, reset, or rewrite history. Create new local commits only.
- Never use `--no-verify`. If a hook fails, fix the cause or report it.
- If a change is half-finished or ambiguous, ask before committing it.
- Do not edit file contents just to make a commit cleaner.