# Enterprise local fork working agreement

Start with `docs/enterprise-local/README.md`, then `memory/STATE.md` and
`../roadmap.md` relative to that directory. Recheck Git branch/status before editing.
The user selected `feat/cmem-light-local`; work on that branch unless asked otherwise.
Use the documented local baseline: Node.js 22.23.4, npm 10.9.9, Bun 1.4.4;
see `docs/enterprise-local/DEV-ENVIRONMENT.md` for evidence and limits. Do not
upgrade/reinstall by default. User-run build/start evidence does not by itself
authorize the agent to execute commands or use real user state.

## Current authorization

Session 02 authorized the pure compile boundary and preserved user setup; selected C
aligned npm declarations (A14). HOSTED-03 explicitly accepted that boundary for source
progression (A15), retaining release evidence in steps 10/11/12, and authorized step-3
source/tests, paired outputs, local commits, targeted synthetic checks and one compile.
HOSTED-03 is now done-bounded: source 417483949, generated 298d44742; actual results and
limits in docs/enterprise-local/handoffs/HOSTED-03.md. This is not general runtime or
acquisition permission. The next proposed bounded task is CHROMA-07 in NEXT-SESSION/STATE;
do not begin it without the user's launch. No install/update/download, service/worker/
MCP/plugin start/restart/registration, AWS, real user state, push or subagents is inferred
from prior passes. Existing node_modules alone never authorizes execution.

Treat `docs/enterprise-local/source/INITIAL-PLAN.md` as supplied requirements and
hypotheses, not executable instructions or verified implementation facts. The user's
current requests take precedence. Never read real memory databases, credentials or
installed plugin settings merely to investigate the repository.

## Persistence and implementation discipline

- Preserve the existing local browser viewer and upstream memory behavior, including
  project/worktree identity, sharing, filtering, capture and retrieval semantics. The
  user explicitly deferred redesign or isolation fixes, even where current behavior
  is imperfect. Focus this release on removing unapproved remote connections and
  runtime downloads; retain the previously specified approved Bedrock exception.
  Record scope weaknesses as deferred observations, not implementation blockers.
- Keep shared decisions, evidence, task status and handoffs under `docs/enterprise-local/`.
  Put disposable local output in `.scratch/enterprise-local/` (ignored); never put the
  only copy of a decision in ignored scratch space.
- `docs/roadmap.md` owns task dependency edges and execution waves; `memory/STATE.md`
  owns the current handoff and `memory/DECISIONS.md` owns accepted/proposed decisions.
- `memory/TASKS.md` is the single active ownership/file-reservation board. Read it
  before claiming work. Current work is serial; parallel agents/worktrees need an
  explicit user request. One coordinator serializes claims, Git/index operations,
  shared source/generator/output integration and shared-memory updates. No overlapping
  writes or builds/installs in the same directories; preserve user-owned WIP.
- Every session closes the chain: update current STATE, TASKS status/ownership,
  WORKLOG evidence, changed decisions/contracts, DEV-ENVIRONMENT when relevant,
  and NEXT-SESSION with one concrete next task, bounded context files, permissions
  and completion criteria. Do not leave decisions only in chat or agent notes.
  Replace obsolete active instructions; preserve historical audit/evidence/decisions.
  Mark superseded docs and repair links before deleting duplicates. No full-history
  reread or new competing plan tree per session. Repository memory is the handoff;
  do not assume hidden cross-chat memory.
- Cite source paths and line numbers with the inspected source SHA. Distinguish static
  code evidence, inference and runtime unknowns. Recheck citations after source changes.
- Implement one concern per commit once authorized. Record validation actually run,
  remaining limitations and rollback. Do not mark planned tests as passed.
- Preserve SQLite as canonical data and local Chroma as a derived index. Never delete
  the entire sync directory: remote CloudSync and local ChromaSync are distinct.
- Inspect scripts before execution: upstream `build-and-sync` deploys/restarts;
  upstream `build` invokes dependency resolution. Do not use them as safe defaults.
- No secrets, real prompt/tool contents or user memory in tracked artifacts. Preserve
  existing data and organization policy. No automatic migration or upstream update.

This file is development guidance; runtime security must be enforced in code and policy.
