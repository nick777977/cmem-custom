# Next session — review cleanup integration

**WINDOWS-REGRESSION-GATE is complete. Merge is recommended for the bounded
cleanup scope; no merge or push was performed.** Do not repeat deletion, the
five original hook checks or the resource fixes as unfinished work.

## One next task

Review this branch for owner-directed integration. Follow AGENTS start order,
then TASKS and [MERGE-READINESS](MERGE-READINESS.md). Read
[current results](windows-regression-results.json); the earlier
[attempts/baseline](merge-verification-results.json) remain historical.

Stay on `codex/repository-cleanup-plan`; inspect HEAD/status and preserve WIP.
Source/runtime fix `dff499e45`, portable gate `974d779e4`. One coordinator,
no agents, task branches/worktrees, automatic merge or push. Recheck that
`feat/cmem-light-local` remains an ancestor. Integration needs an explicit owner
instruction; readiness alone is not that instruction.

## Evidence to reuse

- All 22 original failed files plus five focused dependencies: 373 PASS,
  zero failures in 27 Bun files. Root/viewer typechecks and guarded compile
  PASS; seven outputs paired. Full 1,069-file suite NOT RUN.
- Fresh copied-build capture/search/recovery, real prepared Chroma,
  viewer/My Work/restart PASS; 37 sampled PIDs exited and four ports rebound.
  Four separate Node host/recovery tests PASS.
- Current receipt covers 813 source inputs and 81 Codex/80 Claude files at
  exact synthetic reference roots. Old inventories/SBOM are historical.
  Transfer/new destination requires new staging/binding/inventory.

Read-only reference check: pinned Node with
`scripts/enterprise-local/verify-cleanup-reference.mjs`, then `--host claude`.
For changed source/tests only, inspect commands first and use
`scripts/enterprise-local/windows-regression-gate.mjs --bun <existing exe>
--python <existing exe>`. It isolates state, refuses administrator tokens and
installs nothing. Rebuild/restage/check copied runtime if shipped bytes change.
Never investigate real memories, settings or credentials.

## Completion and separate work

Complete the next task with an explicit integration disposition and resulting
HEAD/status; update STATE/TASKS/WORKLOG and this handoff. Do not merge/push unless
explicitly requested. No further cleanup source slice is queued.

Local Better Auth sessions remain HTTP 500 and unused by the selected flow;
define their local contract separately before relying on them. No signup or real
schema migration. Real Claude CLI/Bedrock/AWS/provider auth/live inference,
distribution/CI and coupled pruning are separate launches, not prerequisites
for cleanup. The main target-host task did not advance.
