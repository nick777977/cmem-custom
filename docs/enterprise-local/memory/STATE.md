# Current handoff

Updated: 2026-11-02 after HOSTED-03. Branch `feat/cmem-light-local`.
Source/tests **`4174839497f8cc1247b864bd1c889e2a2b649738`**; paired generated
**`298d447423c2ebf7404ce79329683484902080b7`**. Docs commit follows in Git log.
Entry `f7df0cccd` was clean. One coordinator, serial; no active reservations.

## Goal and preserved behavior

Windows Claude Code memory fork: local SQLite/FTS5 canonical data, persistent local
Chroma derived index/embeddings and viewer; approved corporate Bedrock/auth is the
intended sole remote inference exception. Preserve capture/retrieval, project/worktree
identity, sharing and filtering semantics. No isolation redesign or migration.
Other remote clients/downloads remain open in their owning roadmap increments.

## Completed and accepted

- User setup preserved in `49e4f65e1` inputs/trust/manifests/lock and `ce7ded4dc`
  bundles/maps. Pure compile boundary `153a9953c`, Windows syntax fixture `705cd1dc9`.
  Historical compile + 6 boundary / 21 syntax checks PASS; no setup replay needed.
- Selected C/A14 `8bc557532` aligns canonical/root/plugin npm allowScripts (30);
  actual historical guard PASS. Bun JSON/plugin/lock trust stays 26 names. No new
  permission choice. [Trust evidence](../handoffs/BUILD-02-TRUST-APPLY.md).
- **P10 explicitly accepted as A15 by the user's HOSTED-03 launch:** step 2 is
  **boundary accepted for source progression, release evidence pending**. No graph
  edge/wave change; no shipped/full no-egress acceptance and no install to close it.
- **HOSTED-03 done-bounded (A16):** all legacy /api/setup methods return 410 after
  loopback checks; hosted extraction/history clients reject before credentials/data/
  transport; worker scan/upload and CLI browser/checkout wiring removed. Viewer opens
  local work even for ?setup=1, without registration. Inert UI setup actions cannot
  dispatch. Local search/note/count utilities, local import receiver and other local
  viewer/memory behavior retained. Source-only setup utilities were not bulk-deleted.
- Actual final checks: **58 targeted tests PASS, 0 FAIL, 249 assertions**; **one**
  reviewed compile PASS with exact Node 22.23.4/npm 10.9.9/Bun 1.4.4. Synthetic paths,
  mocks and loopback fixtures only. Windows SQLite fixture cleanup adapted. Worker/UI
  syntax and mapped hosted closure checks PASS; source/generated pair committed.
- All **16** selected input/sentinel hashes unchanged. Of 199 pre-existing tracked
  outputs, 188 unchanged, 3 modified and 8 removed; one new main UI JS. Generated
  delta limited to worker CJS/map and My Work assets/HTML. Manifests/locks/trust,
  dependencies and user baseline preserved. [Exact evidence/paths/rollback](../handoffs/HOSTED-03.md).

## Limits that remain open

Compile Node tripwires saw no socket/acquisition/deploy event; local esbuild/tsc/Vite
and Vite's net use query observed. Native/shell/OS traffic coverage is incomplete.
Generated worker diff has an emitted trailing-whitespace warning; output kept verbatim.
No clean root-lock/dependency/native/Python/model provenance, reproducibility or release
closure is established. Acquisition still needs approved sources/lifecycle beforehand.

No full Claude Code capture -> SQLite -> Chroma search -> restart/retrieval -> viewer
-> approved Bedrock acceptance ran. No services/worker/MCP/plugin start/restart,
registration, AWS/live inference, real settings/credentials/memory, installs/downloads,
push, new branch/worktree or agents. Synthetic HTTP tests needed execution outside the
sandbox because sandbox loopback fetch returned EACCES; no approval rejection occurred.
The Codex-hook fixture was not used as a substitute for Claude Code acceptance.

Telemetry/cloud sync/other inference/viewer network/bootstrap paths remain later work;
HOSTED-03 removes E01/E02 only. Retained refresh/copy follows existing settings;
Bedrock-only enforcement is not yet implemented. Full OS/runtime acceptance belongs
to 11; root-lock/dependency/artifact provenance/reproducibility to 10/12.

## One next task

**CHROMA-07**, roadmap step 7, **awaiting user launch** of [NEXT-SESSION](../NEXT-SESSION.md).
Use absolute pre-provisioned local Chroma/Python/embedding assets, no runtime package
resolution/model download or remote mode. Inspect only E08–E11 and their affected live
source/tests/contracts. Do not acquire assets or reuse real user installation/state.
Unavailable approved artifacts/interfaces are an explicit unknown/failure, not an
invitation to download or fabricate compatibility. No step 7 work ran in HOSTED-03.

Context: AGENTS -> README -> STATE -> roadmap step 7/graph -> TASKS -> DECISIONS
A06/A07/A09/A14/A15/A16 -> DEV-ENVIRONMENT current section -> HOSTED-03 handoff limits ->
PATCH-SEQUENCE §7 -> EGRESS-INVENTORY E08–E11 -> affected source/tests only.
Close STATE/TASKS/WORKLOG/DECISIONS/affected contracts/environment/NEXT-SESSION each session.
