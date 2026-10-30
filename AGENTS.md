# Enterprise local fork working agreement

Start with `docs/enterprise-local/README.md`, then `memory/STATE.md` and
`../roadmap.md` relative to that directory. Recheck Git branch/status before editing.
The user selected `feat/cmem-light-local`; work on that branch unless asked otherwise.

## Current authorization

The current phase permits repository inspection, planning documents and logical local
commits only. Do not install dependencies, build, execute application scripts, start or
restart services, run tests, invoke AWS, register plugins, or change application source
until the user authorizes the relevant next phase. A pre-existing `node_modules/` does
not constitute permission to use it. Do not push without authorization.

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
