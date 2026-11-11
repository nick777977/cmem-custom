# Cleanup merge readiness — 2026-11-11

**Recommendation: merge is recommended for the bounded cleanup scope.**
The retained Windows regression gate is closed: **373 PASS / 0 FAIL in 27 Bun
files**, including all 22 originally failing files and five focused dependencies.
Root/viewer typechecks and guarded compile pass. A fresh copied build passes
capture/search/recovery, prepared real Chroma, viewer/My Work and restart.
Four separate Node host/recovery tests pass. No merge or push was performed.

This supersedes the earlier no-merge assessment. It is not a full-suite or
target-host acceptance claim. Local Better Auth sessions still fail separately
and are not consumed by the selected memory/viewer flow.

Entry: clean `e113238ade58c8dcd25a5127d9a796b71d8ee124`, existing
`codex/repository-cleanup-plan`. Inspected final source/tests:
`974d779e40e85b345149c86a37363cdf78fc31b9`. Concern commits:

- `dff499e45`: SQLite/atomic-write lifecycle, WAL fixture and seven paired outputs.
- `974d779e4`: reproducible isolated gate and portable/current template contracts.

[Current per-file results, attempts and runtime evidence](windows-regression-results.json)
retain test/log hashes and distinguish sandbox denials from ordinary-user results.
[Original attempts and baseline comparisons](merge-verification-results.json)
are preserved verbatim: 1,806 PASS / 90 FAIL / 3 SKIP in the earlier 220-file
selection. Baseline means the prior plain tracked-file snapshot of
`a9364604d026d79be8ab771ecb861688972d169c` (`feat/cmem-light-local`), not a Git
worktree or a fresh baseline replay here. The prior 198 passing files are not
relabeled as rerun. Retries replace a file's result; they are not summed.

## Reproduction and corrections

Before application edits, four fresh isolated files reproduced the failure:
WAL swap 11 PASS/1 FAIL, FTS probe 0/2, writer-version 0/15 and My Work refresh
25/1. The scratch reproducer reused log filenames on later attempts; the initial
counts are retained from observed command output, with the original report
preserving the earlier failure/baseline provenance.

At inspected SHA `974d779e4`:

- `src/services/sqlite/SessionStore.ts:255,331,4607`,
  `SessionSearch.ts:121,132,1230` and `connection.ts:143,148,162,167` release
  internally opened connections on initialization refusal and use Bun's strict
  close to finalize native statements at explicit shutdown. Injected connections
  remain caller-owned on constructor failure; successful explicit close keeps
  its existing shared-connection semantics. Cached statement references clear.
- The orphan-FK boot case traced one extra owner:
  `src/services/infrastructure/CleanupV12_4_3.ts:110,184,209`. Only its three
  closes changed; cleanup policy/selection did not. Raw fixture handles and
  the two previously unowned journal-mode probes now also close strictly.
- `src/services/work-view/request-groups.mjs:190` reuses
  `src/shared/atomic-json.ts:146`: unique same-directory temporary file,
  complete write/fsync/close, bounded Windows rename retry, cleanup and
  propagated errors. Scheduler/backoff assertions remain.
- The old WAL fixture kept an idle connection open: Windows refused moving its
  WAL before the injected final-rename failure. The replacement uses closed real
  crashed-WAL bytes, injects only checkpoint failure and asserts actual parking/
  rollback of both sidecars and readable committed rows. Standalone snapshot
  validation and filesystem operations remain real. A separate Windows case
  asserts idle-connection refusal/data preservation. `restore-swap.ts:29` adds
  the child-job seam; the default remains the real SQLite job.
- `tests/infrastructure/plugin-distribution.test.ts:60,606` checks operational
  argv on disposable destination-bound copies and replaces the nine old discovery
  scenarios one-for-one with refusal/no-load scenarios. All 80 common tests
  remain; matchers, async ordering, context/request limits and MCP admission are
  asserted. Offline npm dry-run uses selected Node/npm, ignores scripts and has
  a deadline. Worker/MCP version assertions remain; the transcript CLI has no
  reachable release-version consumer, so esbuild drops its unused define.

No schema, search, project/worktree identity, provider fallback, privacy or
auth/signup behavior was relaxed. No pruning was repeated.

## Every original failed-file row

Paths are relative to `tests/`; counts are final tests, not assertions.

| File | PASS | Disposition |
|---|---:|---|
| `backup/pending-restore.test.ts` | 8 | Owned absolute snapshot path; traversal/absolute/nested-name refusal retained. |
| `backup/restore-swap.test.ts` | 13 | WAL commits, snapshots, counters, rollback and busy/release assertions pass; idle Windows refusal added. |
| `services/sqlite/search-fts-any-term-bounded.test.ts` | 13 | Strict read-only fixture close; term/time bounds retained. |
| `services/sqlite/search-fts-any-term-evidence.test.ts` | 20 | Strict read-only fixture close; evidence/results retained. |
| `services/sqlite/search-fts-partial-setup.test.ts` | 4 | Fixture/failed-open resources release; partial-FTS assertions retained. |
| `services/sqlite/search-fts-probe-scope.test.ts` | 2 | Multi-connection probe/search and immediate directory release pass. |
| `services/sqlite/timeline-anchor-tie-boundary.test.ts` | 4 | Owned temp path replaces `/tmp`; epoch ties retained, cleanup errors propagate. |
| `sqlite/native-prompt-identity.test.ts` | 3 | Receipt/dedup/restart and file release pass. |
| `sqlite/session-store-fts-triggers.test.ts` | 7 | Migration/trigger repair and file release pass. |
| `sqlite/session-store-orphan-fk-repair.test.ts` | 4 | Boot cleanup owners release; repaired data/cascade assertions retained. |
| `sqlite/session-store-v7-rebuild-keeps-cascade.test.ts` | 4 | Strict fixture close; cascade assertions retained. |
| `sqlite/session-store-v7-rebuild-keeps-columns.test.ts` | 2 | Strict fixture close; column/data assertions retained. |
| `sqlite/session-store-writer-version.test.ts` | 15 | Refused-open/raw/journal handles release; stamp/no-write/race assertions retained. |
| `sqlite/unicode-title-key-upgrade.test.ts` | 3 | Unicode migration/rollback and file release pass. |
| `sqlite/writer-check-busy-timeout.test.ts` | 1 | Strict raw close, bounded lock child and failure cleanup; actual waiting assertion retained. |
| `worker/search/chroma-category-identity.test.ts` | 2 | Overlapping category IDs/search and shared-DB close pass. |
| `work-view/auto-refresh.test.ts` | 26 | Atomic status, one-run scheduling, failure backoff and timer error handling pass. |
| `work-view/seed-focus-areas.test.ts` | 9 | Strict fixture close; suggestion/undo assertions retained. |
| `work-view/request-first.test.ts` | 19 | External TEMP, explicit no-repository assertion; synthetic Git/worktree identity retained. |
| `work-view/skill-scripts-python.test.ts` | 55 | Python-local winter/summer UTC fixtures round-trip to 08:00 and check local date cutoffs; privacy/config-dir assertions retained. |
| `infrastructure/plugin-distribution.test.ts` | 80 | Current inert/private-bound contract; all common tests retained; offline packaging passes. |
| `infrastructure/version-consistency.test.ts` | 15 | Version-bearing bundles checked; transcript expectation follows its reachable contract. |

Five related files add 64 PASS: connection lifecycle (7), atomic writer (16),
request groups (33), reference-verifier mutations (1), one-time cleanup (7).
Windows stat/chmod is checked against its actual mode; POSIX 0600 remains
required on POSIX. Inherited POSIX-only ACL/symlink branches return on Windows
and are not Windows ACL proof.

## Reproduce the selected gate

Use existing Node 22.23.4/npm 10.9.9/Bun 1.4.4/Python 3.13.15; no install/update:

```powershell
& '<Node 22.23.4>/node.exe' scripts/enterprise-local/windows-regression-gate.mjs `
  --bun '<existing Bun>/bun.exe' --python '<Python 3.13.15>/python.exe'
```

Optional `--file tests/...` selects only a reviewed manifest entry; `--label`
names a new results folder. The runner refuses administrator tokens, allowlists
environment variables without inherited provider credentials/proxies and isolates
HOME/config/data/TEMP/npm/Git configuration per file. Synthetic state outside Git
is removed on exit; logs remain under `.scratch/enterprise-local/windows-regression-gate/`.
Each test has a 20s default timeout, each file a 90s deadline with ordinary owned
child-tree cleanup. Generation/provider HTTP in the fixtures is fake loopback only.

Sandbox filesystem/loopback restrictions produced separate EPERM/EACCES attempts.
Reviewed reruns used ordinary Windows tokens with an explicit Administrator-token
refusal. Sandbox relaxation did not elevate Windows privileges.

## Build, copied runtime and receipt

| Check | Actual result |
|---|---|
| Root/viewer typecheck | PASS separately. |
| Guarded compile | PASS; 19 tool/dependency inputs and 1,943 tracked source sentinels unchanged across compile. Seven of 186 tracked outputs changed, paired in `dff499e45`. No install/sync/restart/network child. Compiler-emitted embedded-string whitespace retained. |
| Test partition | PASS partition only: 1,069 files = 1,045 fast + 24 integration; no overlap/missing entries. Full lanes NOT RUN. |
| Separate host/recovery | 4 Node tests PASS: bound Claude/Codex hooks/MCP, stopped/wrong worker refusal, interrupted work, explicit recovery and no automatic resend/duplicate commit. Not actual CLI registration/loading. |
| Fresh copied build | PASS: prompt/tool capture, private prompt omission, three observations including MCP save, one summary, scoped FTS, Russian semantic observation/summary queries, context-reader thread and MCP initialization/listing. |
| Real prepared Chroma/restart | PASS: existing multilingual MiniLM/runtime, persistent 11-row derived index, committed rows/index unchanged across restart, zero provider sends on restart. No acquisition or real memories. |
| Browser viewer/My Work | PASS: viewer/settings profiles/healthy-Chroma status and My Work render with local resource origins/no remote links. Background browser requests blocked by fixture proxy; no OS-wide egress proof. |
| Copied-build recovery | PASS: 401/redirect survive stop; acknowledgement required; two selected results commit once; repeat selections refuse, payloads clear, next restart sends nothing. |
| Owned cleanup | PASS: 37 sampled child PIDs exited, four ports rebound, worker markers/Chroma writer lock removed. Not crash-proof OS isolation. |
| Local Better Auth session | FAIL separately: `/api/auth/get-session` HTTP 500; selected memory/viewer flow does not consume it. |
| Current references | PASS: 813 source inputs, 81 Codex/80 Claude files; receipt refreshed for these exact new stages. |

[Current receipt](../artifacts/windows-x64-cleanup-receipt.json): Codex digest
`4b9aad2ab25698a51ff9b4d249d1205965665e271282435518e0b16d8ea57150`, Claude
`2b80c30cef6f595bec2ece7bdfc49f9f09f9faa82a2324b817d18369fadd8be5`.
`verify-cleanup-reference.mjs` still checks only the exact receipt roots. New
stages were bound/inventoried before verification; it was not weakened to accept
moved bytes. Old inventories/SBOM remain historical; transfer needs a new receipt.

## Remaining limits and next action

No retained-gate merge blocker remains. Merge is recommended for cleanup because
the identified failures now pass their final behavior/resource assertions and
changed runtime bytes passed the copied local workflow. This does not establish
project-wide correctness or daily-use acceptance on the intended host.

Local Better Auth session clients still cannot obtain a session: define that
separate local contract before implementing/testing it on synthetic state.
No signup/real DB migration; Codex/ChatGPT login and AWS SSO are separate and were
not exercised. Coupled pruning, formal distribution/CI and real Claude CLI/Bedrock
remain separate. Full suite/broader browser matrix NOT RUN. The prior transient
recovery fetch failure remains historical; both new recovery checks passed.

Next: the owner will merge manually; [commands](NEXT-SESSION.md). No additional
cleanup-review session is required. After actual integration, resume the
[main step-11 handoff](../NEXT-SESSION.md), with current-build target inventory
refresh inside that task. The agent has not merged or pushed.
Rollback: revert the concern commit with paired outputs, then restage/reissue
the receipt. No data/schema migration or real-state rollback is involved.
