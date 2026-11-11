# Manual merge — cleanup complete

**Cleanup implementation and WINDOWS-REGRESSION-GATE are complete. Merge is
recommended; the owner will perform it manually.** No additional cleanup-review
session is queued. [Readiness and limits](MERGE-READINESS.md) ·
[Current results](windows-regression-results.json).

This file is the one-time integration note. **After merge, give the next session
[the main NEXT-SESSION.md](../NEXT-SESSION.md)** to resume the roadmap, rather
than launching another cleanup task from this file.

## Owner-run PowerShell commands

At inspection, `feat/cmem-light-local` is still
`a9364604d026d79be8ab771ecb861688972d169c` and is an ancestor of the cleanup
branch. A fast-forward preserves the reviewed commits and requires no conflict
resolution. From this checkout, after the documentation update is committed:

```powershell
if (git status --porcelain) { throw 'Working tree has changes; preserve them before merging.' }
git switch feat/cmem-light-local
if ($LASTEXITCODE -ne 0) { throw 'Branch switch failed; stop here.' }
git merge --ff-only codex/repository-cleanup-plan
if ($LASTEXITCODE -ne 0) { throw 'Fast-forward refused; stop and inspect branch divergence.' }
git branch --show-current
git status --short
git log -1 --oneline
git merge-base --is-ancestor codex/repository-cleanup-plan HEAD
if ($LASTEXITCODE -ne 0) { throw 'Cleanup branch is not fully integrated.' }
```

Expected result: branch `feat/cmem-light-local`, no short-status output and
ancestry exit 0. `--ff-only` moves the target to the cleanup tip without a merge
commit/editor; it never resolves divergence automatically. An owner-created
ordinary merge commit is also acceptable if it retains the cleanup ancestry.
No push or branch deletion is needed for the next local session. Do not use
reset/force/squash to bypass a refused fast-forward.

The agent does not execute these commands or claim the merge happened. The next
session verifies the actual branch/status/ancestry before doing roadmap work.

## What resumes after merge

The pre-cleanup main handoff at `a9364604d` named **CLAUDE-WINDOWS-VERIFY**,
step 11: real Claude Code CLI loading/hooks/MCP and the synthetic local memory
workflow on the intended Windows instance. That is still next. Source fixes
follow only from concrete target failures. Bedrock host/worker acceptance and
step 12 daily setup/update/rollback follow under their original scopes.

Reuse 373 selected Bun tests/27 files, four Node host/recovery tests,
typechecks/guarded compile and copied-build real-Chroma/viewer/recovery/restart
evidence. Full suite NOT RUN; unused Better Auth session HTTP 500 remains
separate. Do not repeat deletion, closed hook checks or resource fixes.

The current cleanup receipt covers 813 source inputs and exact 81/80-file
reference stages. The old Claude inventory cannot certify the changed build;
target staging must refresh/review its destination-bound inventory before
execution. This prerequisite belongs inside the resumed target task, not a
new cleanup loop. See the main handoff for the bounded context and completion
criteria. No real state, signup, AWS/live inference or registration is authorized
by this manual merge note.
