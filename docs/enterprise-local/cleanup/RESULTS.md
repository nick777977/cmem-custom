# Cleanup implementation results

2026-11-11. Entry `8b93ceb3db870bbbb766aebf51df65abc6c745e1`,
branch `codex/repository-cleanup-plan`. Three bounded cleanup slices completed.
Baseline paths, byte sizes and historical source citations remain in the
immutable inventory and EVIDENCE. Main roadmap unchanged.

## Slice 1

Removed 42 exact manifest paths, 123,131,173 baseline Git-blob bytes:
eight PDFs, 13 automation files, 12 Docker inputs and nine publication helpers.
Retained presentation Markdown, local test/build/setup commands and
`.github/copilot-instructions.md`. Removed exclusive release/translation/Docker
npm commands and release configuration. No directories/data/cache were purged.

Validation: package JSON parse, retained local command declarations and
`git diff --check` PASS. No source/runtime changes in this slice;
compile/typecheck/runtime NOT RUN (not required for this detached slice).

## Slice 2

Retired the manifest-listed extra host implementations/packages and their
exclusive tests, including Qoder generated hooks/wrapper and Pi/DSH/OpenCode
build/preflight helpers. Kept `.agent`/`.windsurf` agent guidance and common
parsers, compatibility identifiers, provider/auth code and local data behavior.
Registry now accepts Claude Code, Codex and explicit raw inputs; unsupported
hosts are rejected. Removed Cursor/Grok storage notifications and installer
dispatch/callers. Product display metadata, private catalog and viewer/My Work
use `cmem-light`; removed author/social/promotion/star UI and star API fetch.
Technical identities and core legal/font notices are preserved.

Validation: 160 focused tests / 1,078 assertions PASS; root and viewer
typechecks PASS. Guarded compile PASS after correcting an initially missed
Qoder wrapper preflight. Final compile preserves 19 inputs and 2,023 source
sentinels. Compile trace shows no acquisition/deployment or Node sockets.
Worker/UI bundles and generated manifests are paired with source. No retired
host build target was recreated.

Five older hook-format assertions also FAIL: four in
`tests/cli/adapters/claude-code-session-start.test.ts` and one in
`tests/shared/host-hook-limits.test.ts`. They expect runnable legacy command
strings in canonical hooks that have intentionally been unbound since before
cleanup. Both canonical hook files and the four-assertion test have zero delta
from entry HEAD. Kept these shared checks visible; current canonical-template
and compiled admission tests pass. Direct bound-host runtime checks below pass.

## Slice 3 and final validation

Removed `workers/sync-hub/`, `services/sync-api/`, the two cloud matrix tools
and their exclusive test, standalone bundle/map/build target, Postgres operator
CLI and its exclusive test. Worker delegation, NPX server command and standalone
server/BullMQ generation entrypoints now refuse. Local SQLite API-key/auth,
shared HTTP/API/viewer and storage remain. Removed unused `np` and Pi `typebox`
declarations after their last code/build consumers retired. Existing installed
dependencies and ignored locks were not changed.

Root README now describes the local fork and links to the authoritative local
runbook; its original technical content remains in `README.upstream.md`,
explicitly historical. Retained technical documents were not broadly rewritten.

| Check | Actual result |
|---|---|
| Slice 3 focused worker/profile/recovery/admission checks | PASS: 99 tests / 497 assertions across five files; a requested nonexistent `cloud-05.test.ts` filter matched no file and is not counted |
| Retained CloudSync/storage regressions (injected fake transports) | PASS: 91 tests / 482 assertions; retained source contracts, not real cloud execution |
| Independent retired server/generation launch | PASS: 5 tests / 7 assertions |
| Root and viewer typecheck | PASS on completed source |
| Final guarded compile | PASS: 19 inputs and 1,946 source sentinels unchanged across compile; no retired build target recreated |
| Direct private Claude/Codex hooks and stdio MCP; recovery | PASS: four Node fixtures, fresh owned state, zero live provider calls; recovery deliberately committed three observations and one summary without automatic resend or duplicate commit |
| Final copied-worker fixture | PASS: start/health/stop, concurrent Codex capture, SQLite/FTS, context reader, MCP save/search, real local Chroma multilingual retrieval/filtering/restart |
| Viewer and My Work browser rendering | PASS: both show `cmem-light`; page resources stayed on loopback; inspected pages exposed no remote links; local profile and Chroma status rendered |
| Provider fault and shutdown preservation | PASS: fake 401/307 sent no fallback/redirect requests; two unknown outcomes remained in `generation_recovery`, with zero active pending rows after shutdown |
| Final child/port cleanup | PASS: 25 sampled owned PIDs exited; four fixture ports rebound; staged files remained byte-identical |
| Separate local auth | Existing HTTP 500 reproduced; NOT FIXED |
| Source/document diff whitespace | PASS; full diff check reports one esbuild-generated worker line with trailing whitespace, preserved verbatim with its source map |
| Whole upstream suite / CI / real host registration / Claude CLI / AWS / live inference | NOT RUN |

The large runtime fixture initially reached the end of successful capture,
search/restart and browser checks, then failed an obsolete pre-RECOVERY assertion
that refused work stays in the active queue. Corrected only the disposable fixture
to inspect durable recovery; a fresh run passed. Initial missed Qoder preflight,
manifest-fixture catalog input and retired webhook expectations were corrected
before their final passing checks. The five shared legacy hook assertions above
remain visible failures, not silently removed tests.

The final standalone generation-helper refusal is excluded from local bundles.
Its focused check and repeated final compile passed with **identical runtime
bytes**, preserving the new copied-build runtime attribution. Node/npm/Bun remain
22.23.4 / 10.9.9 / 1.4.4; no downloads or toolchain changes were needed.

Browser background requests to Google endpoints were blocked by the fixture's
loopback proxy; application page resource origins were local. Node-level build
guards and sampled child TCP/PID checks are bounded observations, not an OS-wide
firewall/DNS/crash-isolation proof.

## Actual removals and receipts

Deleted **487 baseline files, 132,312,367 Git-blob bytes (126.18 MiB)**.
This is deleted-file content, not net checkout/clone/install-size savings;
Git history, caches and installed dependencies remain. A regenerated hashed
My Work asset is a replacement, not an extra removal saving.

Of the 440 manifest candidates, 438 were removed:

| Category | Files | Baseline bytes |
|---|---:|---:|
| PDFs | 8 | 123,009,837 |
| Automation | 13 | 47,989 |
| Docker | 12 | 43,662 |
| Publication helpers | 9 | 29,685 |
| Extra hosts | 290 | 3,019,528 |
| Cloud projects | 62 | 1,110,745 |
| Retired package documents | 36 | 236,710 |
| Retired package notices | 8 | 39,400 |

The remaining 49 deletions are their exclusive tests/helpers, Qoder outputs,
standalone bundle/map, operator CLI and unused presentation component. Exact
paths and original blobs are recoverable from the cleanup commits and baseline
inventory. Kept two candidate agent-guidance files:
`.agent/rules/claude-mem-context.md` and `.windsurf/rules/claude-mem-context.md`.

[Current receipt](../artifacts/windows-x64-cleanup-receipt.json) hashes 81 Codex
and 80 Claude reference-stage files, with current source-input hashes. It is
destination-bound to these synthetic reference stages, not a portable artifact
or refreshed SBOM. Codex file-set digest:
`1f93fab07e5d3e563e54c95da9855f70d5aa3704839a305fd0e867e952d5cfa9`;
Claude digest:
`3d09fec77c7517b16ca0c80fd53ba3bb5b9538c0f4909d6cff6b44dd9fdf34fc`.
Source-input digest:
`eec8e0837c5026ef51cca1cacabee551e01ede509edc31637d2f8272ebea4915`.
Previous inventories/SBOM/handoffs stay unchanged and **do not validate the new
bytes**. Their older verifiers can reject this build; target transfer requires
a new destination binding and an appropriately refreshed inventory.

## Explicitly retained and deferred

- `src/server/runtime/`, `src/server/services/`, `src/server/queue/`,
  `src/storage/postgres/`, associated classes/tests and `pg`/BullMQ/ioredis/
  standalone embedder dependencies remain. Shared local API/auth/storage imports
  and retained source tests still use this graph; full pruning needs a separate
  refactor. Normal standalone launch/build/delegation is retired.
- Legacy `src/services/sync/CloudSync.ts`, `SyncApply.ts` and related schema,
  outbox and tests remain. Local worker cloud activation was already disabled;
  no data migration or sync-directory deletion. ChromaSync stays local.
- Optional legacy settings, compatibility platform IDs/transcript parsers,
  `McpIntegrations.ts`, CCS/cache helpers and their source tests remain outside
  the removed host registry/CLI. Broad integration/settings refactoring is
  deferred; this is not a claim that every old host name disappeared.
- `@huggingface/transformers`/ONNX, parser/SDK/UI/auth dependencies and Python
  Chroma gRPC remain where retained source/build/runtime still requires them.
- Five stale shared hook tests need alignment to current canonical and bound
  host fixtures. Real Claude CLI/Bedrock target acceptance and local-auth HTTP
  500 remain separate work. Missing/corrupt-model checks were not repeated in
  this final fixture; prepared model files were read and hash-verified only.

All enterprise-local historical evidence, roadmap/ADRs, presentation Markdown,
core LICENSE/NOTICE, modes/skills and retained fonts were preserved. No real
installation, memory, credentials, model assets, ignored locks, venv, wheelhouse,
node_modules or Git history was cleaned. No push, agents, worktrees or UAC.

Rollback: reviewed revert of the relevant cleanup commit; no reset/clean.
