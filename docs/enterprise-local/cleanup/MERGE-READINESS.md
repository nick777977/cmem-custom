# Cleanup merge readiness — 2026-11-11

**Recommendation: do not merge yet.** The five originally reported hook checks
are closed, both typechecks and the guarded compile pass, and the exact cleanup
runtime files remain unchanged. Direct bound Claude/Codex hooks, MCP and the
separate recovery rerun pass. Broader retained checks are still red: the latest
reviewed selection has **1,806 PASS / 90 FAIL / 3 SKIP across 220 Bun test files**,
198 files passing. These are selected local checks, not the whole suite.

Most remaining failures reproduce on the merge target or concern unchanged old
templates. They are not evidence of a new cleanup runtime regression. Nevertheless,
the retained Windows regression gate cannot presently give a reliable green
result for database teardown/restore and My Work writes. Resolve that bounded
gate and the additional obsolete resource assertions before recommending merge;
do not use the earlier five-failure count as an exhaustive readiness statement.

Entry: clean `493e20b76055a20bfcacec183cacb4bd9f7940b0` on
`codex/repository-cleanup-plan`. Target:
`a9364604d026d79be8ab771ecb861688972d169c` (`feat/cmem-light-local`).
Inspected source/test/verifier SHA:
`d9fa7f90f62af1f36046bd343a4b79e2f54d70d3`.
The target remains an ancestor; topology permits a later fast-forward but does
not establish readiness. No merge, push, new branch, worktree or agent was used.

Concern commits:

- `f6f49db53`: retained canonical/bound hook checks and removed-feature resources.
- `d9fa7f90f`: exact cleanup reference verifier and mutation/refusal checks.

[Machine-readable results](merge-verification-results.json) retain every selected
file, original attempts, latest reruns, baseline comparisons and the exact names
of all remaining distribution assertions. Counts replace earlier attempts per
file; retries are never added together to inflate coverage. Raw synthetic logs
and disposable baseline snapshot are in
`.scratch/enterprise-local/cleanup-merge-verify/`.

## Behavior and evidence

| Retained behavior | Actually executed / result | Limit or next action |
|---|---|---|
| Claude/Codex adapter normalization and canonical hook event/context/time limits | PASS: contracts selection, 133 tests, 1 skip; final focused hook/verifier run 17 PASS | Original four lifecycle/literal-command assertions and timeout lookup now follow inert templates and destination binding. Neither template is activated. |
| Private bound hooks and MCP | PASS: 3 Node tests; literal executable/stage commands, Claude startup/clear/compact context and resume exclusion, inherited 60s timeout, all 8 Claude event mappings, stopped worker/wrong binding refusal, prompt capture/platform/cwd and MCP initialization/listing | Direct commands, not actual Claude CLI loading. Existing Codex admission check also verifies its 20s bound context timeout. |
| Explicit provider/model/auth profiles | PASS: PROFILE-06A/06B and local admission, including mocked Claude/Codex/Gemini/OpenRouter/OpenAI-compatible paths and no-fallback/error admission | Synthetic/injected transports, zero live provider inference. Provider login and AWS SSO were not exercised. |
| SQLite, capture, FTS, migrations and backup/restore | MIXED: original storage selection 512 PASS / 47 FAIL in 81 files; many failed assertions occur during Windows file cleanup | Failure-by-file disposition below. Successful snapshot/restore tests do not establish that every teardown/sidecar case works. |
| Context, filtering, sharing and semantic-search logic | MIXED initially; 69-file selection plus inspected loopback reruns passed the network cases; remaining Chroma category tests fail during SQLite file cleanup | Includes merged project keys, scoped FTS, semantic filtered candidates/pagination, concurrent revisions and local-runtime missing-asset refusal. No identity/sharing redesign. |
| Durable pending-work recovery | PASS on fresh separate Node rerun: deliberate recovery, interruption, three observations/one summary, no startup resend or duplicate commit | First combined attempt failed with `fetch failed` while polling recovery. Fresh rerun passed unchanged; cause of that connection failure is unproved, so preserve the flaky attempt. |
| Local viewer/My Work logic | MIXED: 51-file original selection, loopback and Python reruns; current failures below | Browser rendering of viewer/settings/My Work is prior exact-byte evidence in RESULTS, not a newly run browser matrix. |
| Real Chroma persistence/search/restart | NOT RUN anew; prior cleanup runtime PASS retained | Compile changed zero runtime bytes; verifier revalidated the stages against the earlier receipt. No new prepared-model/venv or Python/Chroma-process claim. |
| Local API-key authorization | PASS: 15 tests | Uses the SQLite API-key service, separate from Better Auth browser sessions. |
| Better Auth `GET /api/auth/get-session` | FAIL: HTTP 500 in copied recovery worker; fresh direct disposable DB probe throws `SCHEMA_MISMATCH` | Separate inherited defect; not a Codex/ChatGPT login or AWS SSO error. See below. |
| Manifests/resources | MIXED: final 61 PASS / 34 FAIL in 2 files | Removed only retired hosts/server expectations; kept common tests. Remaining legacy commands and packaging/version assumptions listed below. |
| Root and viewer typecheck | PASS, separately executed | Node 22.23.4 with existing dependencies. |
| Guarded `build:compile` | PASS: 19 dependency/tool inputs, 1,941 tracked source sentinels and all 186 tracked outputs unchanged across compile | First sandbox attempt refused writing `.agents/plugins/marketplace.json`. Ordinary-user guarded rerun passed; no install/sync/restart/network child. New verifier/test are verification-only, outside shipped runtime. |
| Test-lane manifest | PASS: 1,068 files = 1,044 fast + 24 integration; no overlap/missing entries | This checks partitioning only. The full lanes were not run. Node-specific host fixtures were invoked with Node and explicit Bun/scratch inputs. |

## Remaining failed checks and their origin

The baseline is a plain tracked-file snapshot of the target, not another Git
worktree. Twenty failing current files were replayed against its source under
fresh synthetic state: 19 failed, one passed. The latter is an intermittent
Windows file-cleanup failure. A second controlled current/baseline comparison
with the existing Python and synthetic config inputs reproduced the same two
My Work assertion failures. No real installation, memory or credentials were read.

For the table below, **baseline** means runtime reproduction on that snapshot;
**static unchanged** means inspected equal source/build inputs, not a baseline
runtime PASS or FAIL. The underlying storage/backup/sync/work-view source trees,
auth files and the listed original tests have no cleanup delta. This narrows
attribution; it does not excuse a broken retained behavior.

| File under `tests/` | Latest failed tests | Actual issue / origin | Impact and concrete next action |
|---|---:|---|---|
| `backup/pending-restore.test.ts` | 1 | Root-relative `/data` expected path omits Windows drive; baseline same | Test portability; use a canonical task-owned absolute fixture path and preserve traversal refusal. Other seven restore cases pass. |
| `backup/restore-swap.test.ts` | 1 | Windows refuses moving a live WAL before the injected rename failure; baseline same | Sidecar rollback case is unverified; determine real open handles and preserve the original DB/WAL before changing fixture or code. |
| `services/sqlite/search-fts-any-term-bounded.test.ts` | 1 | File cleanup reports EBUSY; baseline same | Read-only search case cannot close green; finalize test/production SQLite resources before deleting the owned folder. |
| `services/sqlite/search-fts-any-term-evidence.test.ts` | 1 | File cleanup EBUSY; baseline same | Same boundary for evidence search; retain query/result assertions. |
| `services/sqlite/search-fts-partial-setup.test.ts` | 1 | File cleanup EBUSY; baseline same | Partial-FTS setup regression gate remains red; inspect the live connections/statements. |
| `services/sqlite/search-fts-probe-scope.test.ts` | 2 | File cleanup EBUSY; baseline same | Both multi-connection probe checks fail teardown; distinguish assertion success from resource release. |
| `services/sqlite/timeline-anchor-tie-boundary.test.ts` | 4 | Hardcoded `/tmp/...db` cannot open on this Windows fixture; baseline same | Epoch tie behavior not tested by these cases; replace only the nonportable fixture path. |
| `sqlite/native-prompt-identity.test.ts` | 2 | File cleanup EBUSY; baseline same | Receipt/restart cases have cleanup failure; close all SQLite handles without changing dedup/identity semantics. |
| `sqlite/session-store-fts-triggers.test.ts` | 7 | File cleanup EBUSY; baseline same | Migration/FTS repair tests cannot complete cleanly; inspect ownership/finalization, then replay all seven. |
| `sqlite/session-store-orphan-fk-repair.test.ts` | 4 | File cleanup EBUSY; baseline same | Foreign-key repair gate remains red; preserve migration/data assertions. |
| `sqlite/session-store-v7-rebuild-keeps-cascade.test.ts` | 4 | File cleanup EBUSY; baseline same | Cascade migration gate remains red; same handle audit. |
| `sqlite/session-store-v7-rebuild-keeps-columns.test.ts` | 2 | File cleanup EBUSY; baseline same | Column-preservation gate remains red; same handle audit. |
| `sqlite/session-store-writer-version.test.ts` | 15 | File cleanup EBUSY; baseline same | Writer-version admission checks are obscured by teardown errors; finalize resources and rerun. |
| `sqlite/unicode-title-key-upgrade.test.ts` | 1 | File cleanup EBUSY; baseline same | Unicode upgrade case remains red; keep distinct-title/rollback assertions. |
| `sqlite/writer-check-busy-timeout.test.ts` | 1 | Initial EBUSY teardown; baseline rerun passes | Intermittent release behavior, not a proven timeout regression; reproduce and verify handle release rather than adding blind sleeps. |
| `worker/search/chroma-category-identity.test.ts` | 2 | EBUSY after closing store/search; persists outside sandbox and on baseline | Assertions about overlapping category IDs ran, but cleanup failed; resolve shared-connection statement ownership. |
| `work-view/auto-refresh.test.ts` | 1 | Windows EPERM replacing `refresh.json.tmp`; baseline same; different scheduler case can fail on a rerun | Retained atomic status write is unreliable in this test environment; isolate writer/timer overlap and ownership before a minimal fix. |
| `work-view/seed-focus-areas.test.ts` | 4 | EBUSY removing SQLite fixture; baseline same | Suggested areas/undo gate cannot finish cleanly; same resource-release investigation. |
| `work-view/request-first.test.ts` | 1 | Expected no project, got enclosing `cmem-light`; controlled baseline same | Task scratch lives inside this repository and filesystem project discovery sees it. Isolate the no-repository fixture without changing product worktree semantics. An initial additional cleanup EPERM disappeared on rerun. |
| `work-view/skill-scripts-python.test.ts` | 1 | Python on Windows ignores the POSIX `TZ=America/New_York` expectation; controlled baseline same, 54 other cases PASS | Test cannot assert 08:00 NY while child formats host-local 13:00. Make timezone fixture portable. Initial missing-Python PATH and inherited synthetic config errors were resolved only in the runner. |
| `infrastructure/plugin-distribution.test.ts` | 33 | 32 expect old auto-launch/cache/PATH/self-heal commands; canonical hooks/MCP are unchanged from target. One `npm pack --dry-run` case times out at 5s | Static inherited contract mismatch, plus unverified packaging fixture. Align common checks with canonical refusal + private binding, retaining event/argv/time/refusal behavior; run packaging separately with a reviewed deadline. All exact assertion names are in JSON. |
| `infrastructure/version-consistency.test.ts` | 1 | Transcript-watcher bundle does not contain the version string expected by the test; bundle unchanged from target | Not a cleanup byte regression. Verify whether the symbol is intentionally tree-shaken or part of a runtime contract, then correct the test/build contract. |

Initial EACCES errors on owned loopback HTTP requests were sandbox restrictions.
The inspected ordinary-user reruns passed those request/response checks; they
are not included as final product failures. The Chroma watermark test passed
with a reviewed 20s test deadline instead of 5s, with unchanged assertions.
No broad suite retry or arbitrary dependency/tool upgrade was used.

## Local auth disposition

At inspected SHA `d9fa7f90f`, `src/services/worker-service.ts:389` lazily supplies
the local worker connection to `BetterAuthRoutes`;
`src/server/auth/BetterAuthRoutes.ts:12,22,31` constructs/mounts the handler;
`src/server/auth/auth.ts:10,13,16` uses that DB with API-key and organization/team
plugins. The normal SessionStore/storage schema does not create Better Auth's
`user`, `session`, `account`, `verification`, `apikey`, `organization`, `team`,
`teamMember`, `member`, `invitation` tables. Lazy initialization checks that
schema and fails on the first request. These files/schema and the route mounting
are unchanged by cleanup. Earlier pinned runtime logs already recorded the same
missing-table list; this session reproduced it only on disposable data.

Source search found no `/api/auth` session-client call in the retained viewer or
My Work. Hooks/MCP, SQLite/FTS/search and deliberate recovery passed independently
while this endpoint returned 500. `src/server/auth/sqlite-api-key-service.ts:11`
uses the independent local storage auth repository (`api_keys`,
`src/storage/sqlite/schema.ts:119`); its 15 focused tests pass.

Thus local browser-session authentication is unusable, but it is **not needed by
the selected loopback memory/viewer scenario and is not a cleanup merge blocker
on its own**. Any client that relies on that endpoint cannot obtain a session.
Keep it as a separate defect: first define the intended local session-auth
contract, then implement/test explicit local behavior on synthetic state.
Do not follow the library's printed `npx auth migrate` advice on a real DB and do
not add CMEM signup/cloud auth. Codex/ChatGPT login and AWS SSO are unaffected
by this database-schema error and were not tested here.

## Build and receipt disposition

New command (using the pinned ordinary-user Node executable):

```powershell
node scripts/enterprise-local/verify-cleanup-reference.mjs
node scripts/enterprise-local/verify-cleanup-reference.mjs --host claude
```

At inspected SHA `d9fa7f90f`, the verifier checks the original 811 receipt source
inputs (`:41`), exact reference destination (`:47`), root/catalog file sets
(`:52`) and stage/copied-build hashes. Unit checks reject changed source,
altered bytes, extra catalog files, path escape and another destination.
Both references passed against the existing receipt: 81 Codex / 80 Claude files,
with the exact digests in RESULTS. The newly added verifier/test do not change
shipped runtime inputs; the historical receipt is preserved verbatim.

The old Windows inventory, Claude inventory and SBOM remain historical. Their
default verifiers are not silently redirected to new bytes. This new tool
validates only the original cleanup references, excluding runtime data, and
does not certify an arbitrary new installation, dependencies or model files.
A moved/fresh target still needs staging, destination binding and a refreshed
appropriate inventory. This limitation does not block a source-branch merge.

No copied runtime byte changed in this session. Therefore the earlier real
Chroma/FTS/restart and browser-rendering evidence remains attributed to those
same verified files; it is not relabeled as a new run. Full acquisition,
redistribution/SBOM rebuilding and corporate execution are outside this task.

## What blocks the recommendation and what does not

**Blocker for the current readiness recommendation:** the retained Windows gate
still has unexplained/unfixed file-release and atomic-write failures, nonportable
fixtures and additional common contract assertions. Their inherited origin
reduces cleanup-regression suspicion but does not produce a green acceptance
result. Next task: close this bounded Windows regression gate without weakening
behavior assertions, then repeat the affected checks and issue a new verdict.
The earlier recovery connection failure also remains a fixture reliability
observation, despite the successful fresh rerun.

**Nonblocking deferrals for cleanup:** unused local Better Auth sessions, retained
coupled legacy source/dependencies, current receipt's nonportable scope, actual
Claude CLI/Bedrock target acceptance and formal distribution/CI. These were not
added as new cleanup prerequisites. Full 1,068-file suite, all browser tests,
smart-file-read grammar builds and actual host registration were NOT RUN: they
include separate tool/build/runtime requirements and were not blindly authorized
by lane membership. Untested interactions remain a coverage risk; passing the
selected files is not a project-wide health claim.

All execution used ordinary Windows user tokens (explicit Administrator-token
refusal), fresh synthetic state, bounded requests and existing tools. Sandbox
loopback/build-write refusals were followed by inspected normal-user reruns;
no UAC, machine PATH/registry, system services, live inference, AWS, credentials,
real memories, installs or downloads were involved. Hook/recovery fixtures
completed owned-worker shutdown/removal of their active markers.

Rollback: revert the relevant concern commit after review; no data/schema
migration or runtime output rollback is needed for these verification changes.
