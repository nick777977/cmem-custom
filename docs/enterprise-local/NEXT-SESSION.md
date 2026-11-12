# Continue in Claude Code — target entry, then CLAUDE-WINDOWS-VERIFY

**Owner launch, 2026-11-12:** continue development/implementation/testing in
Claude Code, already using Bedrock on the other machine. First read the full
[bootstrap prompt](CLAUDE-CODE-BOOTSTRAP.md) after the AGENTS entry order.
It supplies the repository map, factual critical-review method and per-session
handoff/next-prompt protocol. This is not a restart of the roadmap. Make one
bounded review of current plan/code/environment, fix necessary active doc or
command contradictions, then proceed to the next actual target assertion.

At transfer entry: `feat/cmem-light-local`, HEAD
`afcf03689c0ab3749c5bdc8930e45fadf309223f`; owner-untracked
`cmem-light.code-workspace` preserved unread. Recheck actual HEAD/status.
Some historical IDs below are absent here; bootstrap §5 and target transfer
note give observed content checks and actual available candidates. Do not
rewrite old receipts or equate commits from matching content. Cleanup is
integrated; no extra cleanup review, agent merge/switch/push is requested.

**Completed preparation on the previous machine:** files-only
preparation is complete: current 80-file Claude inventory reviewed and normal
verification PASS. [Target procedure and actual results](handoffs/CLAUDE-WINDOWS-VERIFY.md)
· [review/delta/limitations](artifacts/claude-windows-verify-preparation.json).
No Claude/worker/Chroma process or inference ran. The two historical raw-source
receipt mismatches are recorded there; do not reopen cleanup or chase old hashes.
The next observable product task is actual target verification after confirming
environment/executable/version/policy/runtime and host test model scope. The
working development chat's Bedrock route does not authorize new child/worker
inference tests. Owner reports Windows PowerShell `claude`, globally npm-installed
Anthropic Claude Code, Bedrock/AWS SSO. Resolve its actual approved shim/entrypoint/
platform/version on target rather than asking the owner about implementation
internals or assuming a native `.exe` installation. Worker live-profile intent
is still undecided: explain generation versus local MiniLM search before asking
for that choice. Do independent preparation while missing inputs are resolved.

This restores the next task from pre-cleanup commit
`a9364604d026d79be8ab771ecb861688972d169c`: **step 11, actual Claude Code CLI
verification on the intended Windows instance**. It is target acceptance;
implement a further source fix only if that check exposes a concrete defect.
The cleanup side task did not finish this host check or change the goal/route.

## Entry and bounded context

Follow AGENTS start order: enterprise-local README → newest active STATE section
→ docs/roadmap, then newest TASKS ownership section. Do not reread historical
STATE entries or the cleanup failure logs as unfinished work.

Before writing or running anything, inspect branch/HEAD/status and confirm:

```powershell
git branch --show-current
git status --short
git merge-base --is-ancestor codex/repository-cleanup-plan HEAD
```

The branch must be `feat/cmem-light-local`. Preserve WIP. If the cleanup ref is
present, ancestry must return exit 0. A missing ref on a transferred checkout
requires checking available merge/history/content evidence, not assuming a
missing integration or creating a fake ref. If integration is actually absent,
report it; do not merge/switch/restart cleanup. A regular owner merge counts.

Read only the task-relevant bundle after the entry files:

- [Step 11 remaining outcomes](../roadmap.md#what-remains-in-step-11).
- [Bootstrap](CLAUDE-CODE-BOOTSTRAP.md), only for this first cross-tool session;
  replace this launcher with one concrete next task at session close.
- [Current target procedure](handoffs/CLAUDE-WINDOWS-VERIFY.md): fresh destination
  receipt, host isolation/fake worker recipe, assertion matrix and missing inputs.
- [Target runbook](WINDOWS-LOCAL-SETUP.md#claude-code-and-bedrock-preparation),
  [profile contract](LLM-PROFILES.md) and [validation scope](VALIDATION.md),
  limited to target execution/profile/cleanup requirements.
- [Current readiness](cleanup/MERGE-READINESS.md) and
  [current cleanup receipt](artifacts/windows-x64-cleanup-receipt.json): reuse
  the latest source/build evidence. Consult the per-file JSON only for a
  changed/failing retained check.
- [Claude staging contract](handoffs/CLAUDE-WINDOWS-STAGE.md) and
  [recovery contract](handoffs/RECOVERY-11-LOCAL.md), only when needed for the
  corresponding target assertion. Their old inventories are historical.

## One task: verify the current build through the real Claude host

1. Establish the authorized target Windows x64 machine, ordinary-user token,
   approved Claude executable/version and managed plugin/hook/MCP policy. Keep
   Node 22.23.4/npm 10.9.9/Bun 1.4.4/Python 3.13.15 where applicable; no automatic
   upgrades or reinstall. This launcher does not grant corporate execution,
   real-state inspection or live inference by itself. If the intended machine
   or runtime scope is unavailable, prepare the exact target procedure and
   record the missing target/input; do not substitute direct hook mocks for
   real host acceptance or repeat generic audits.
2. Stage the **merged current compiled plugin** at the real target destination
   and verify it against the reviewed current Claude inventory before execution.
   The local preparation receipt does not certify another destination. The
   historical cleanup receipt certifies only its exact reference roots and has
   two raw source-input mismatches in the merged checkout (see current review).
   The pre-cleanup recovery inventory is preserved in Git. Inspect the renderer and
   `verify-claude-stage.mjs --record` path, compare copied files with the merged
   plugin and review any further inventory delta before accepting/updating it. Record
   full source/build/renderer SHAs and selected executable hashes. Do not weaken
   a verifier to accept stale/moved bytes. No rebuild is needed merely because
   a fast-forward changes the branch name; rebuild only if actual inputs change
   or the target requires it, then refresh paired outputs/evidence.
3. Under the target launch's explicit scope, use disposable HOME/config/data,
   a dedicated loopback worker, prepared local Chroma and deterministic fake
   worker generation. Use session-scoped `--plugin-dir` loading where managed
   policy allows it; do not modify the normal installation. Verify **actual
   Claude CLI loading and dispatch**, stdin/argv/context/timeouts, eight retained
   event mappings as supported by that CLI, stdio MCP and stopped/wrong-worker
   refusal. Record unsupported/restricted events honestly.
4. Exercise two synthetic projects with one worker: capture observations and
   summaries, SQLite/FTS and semantic search/filtering, viewer/My Work, restart
   and data-preserving removal. Check a subdirectory launch and project/worktree
   attribution separately from the two-project case. Preserve existing sharing/
   identity semantics. Use deadlines, ordinary owned-child cleanup and verify
   released processes/ports while retaining the synthetic SQLite data.

The host may need its own model activity to dispatch real tool hooks. The fake
worker endpoint does not authorize or simulate the host's model. Before any live
host/worker call, agree the exact model/auth/destination, synthetic payload and
small budget. Interactive Claude Bedrock/AWS SSO and the worker's selected
Bedrock profile are **separate** checks; no account/model fallback or credential
copying/printing. No public publication, CMEM signup or real-memory migration.

## Reuse completed evidence; finish with an observable result

Cleanup evidence: 373 selected Bun tests/27 files, four Node host/recovery tests,
both typechecks/guarded compile and copied-build real Chroma/viewer/recovery/
restart PASS. Seven outputs paired in `dff499e45`; current source/gate
`974d779e4`. Full 1,069-file suite NOT RUN. Reuse these checks; replay affected
ones only for changes, failures or material target differences. Local Better
Auth session HTTP 500 is separate and unused by the selected flow; no signup/
schema migration is a prerequisite. Codex CLI coverage is accepted; Codex
Desktop, CI/distribution, coupled pruning and SQLite-only mode remain deferred.

Completion: a target handoff names CLI/version/policy, exact stage receipt,
actual PASS/FAIL/NOT RUN by outcome, host-versus-worker model scope, two-project/
worktree coverage and cleanup/data-preservation results. Fix demonstrated
defects minimally with paired outputs and affected checks. Update STATE/TASKS/
WORKLOG/DECISIONS, roadmap status and NEXT-SESSION. No merge/push by the agent.

After this target check, continue the existing route: separately scoped Bedrock
acceptance for each selected surface and remaining declared step-11 cases, then
step 12 daily setup/update/rollback instructions. Do not mark those complete
from cleanup or synthetic loopback evidence.
