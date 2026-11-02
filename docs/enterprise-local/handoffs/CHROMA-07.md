# CHROMA-07: source refusal complete; local activation pending artifacts

Date: 2026-11-02. Branch `feat/cmem-light-local`. One coordinator, serial, no agents.
Entry **46c12bfe7640824dde13d051286096a01577ce2f**, clean index/worktree.
**S = 8fa9979797b5478ec8b36eebd6c52533112aec83** (source/tests).
**G = b8734d9b25e6e6e890ae4d3c4f7864cf48d3a4bf** (paired generated outputs).
Documentation commit follows G in Git history.

## Outcome and limit

Step 7 is **done-bounded for source refusal**, not operational Chroma integration.
Manager E08 runtime package resolution and E09 HTTP launch were removed. E10/E11
cannot run: every production launch explicitly refuses pending approved artifacts/API.
No approved executable, Python/Chroma/native dependency closure, model files or actual
offline embedding/telemetry API evidence were supplied. U1/D9 remain **UNKNOWN**.
An existing Python/cache/model installation is neither evidence nor authorization.

Setting an absolute executable does **not** enable Chroma in this revision. All
candidates refuse with `LOCAL_CHROMA_ARTIFACT_CONTRACT_UNVERIFIED`. No config boolean
or self-attested manifest can authorize launch. No Python API, model hash, compatibility
or telemetry-disable mechanism was invented. Prior 0.2.6/1.5.9 constants are historical
store metadata only. Health exposes `localRuntime=artifact-contract-unverified`;
compatibility prewarm diagnostics say stopped, with no prewarm process.

D11 remains open. No new SQLite-only product mode, successful-indexing substitution,
queue acknowledgement or capture/retrieval policy was added. Configuration/artifact
refusal is a distinct `ChromaLocalRuntimeError`, checked on every call before cached
connection/backoff handling. Existing callers' error/unavailability behavior remains;
this does not establish that every UI caller displays the refusal. SQLite stays
canonical, Chroma derived. Existing corrupt-index rebuild behavior is retained;
this task does not repair runtime assets or change identity/data/schema/cloud sync.

## Static source contract

Repository-relative paths/lines refer to inspected **S**, not runtime observations.

| Source path:line | Implemented behavior |
|---|---|
| `src/services/sync/ChromaLocalRuntime.ts:18` | Local mode only; remote/unknown modes reject, including legacy config. |
| `src/services/sync/ChromaLocalRuntime.ts:25` | Only default is a collection-function candidate; vendor/unknown names reject. The name certifies no offline behavior. |
| `src/services/sync/ChromaLocalRuntime.ts:33` | Requires absolute local adapter path; no PATH/UNC discovery or interpreter/package-manager substitution. Then refuses every candidate before stat/cache/execution pending real artifact/API evidence. |
| `src/services/sync/ChromaMcpManager.ts:224` | Gate precedes cleanup/store reads/lock/supervision/transport, including cached/repeated calls; refusal does not become transient backoff. |
| `src/services/sync/ChromaMcpManager.ts:274,306` | Retained serial persistent-store/stdio lifecycle consumes an internal Node launch description. No production function returns one yet; tests mock this boundary. No guessed Python command is emitted. |
| `src/services/sync/ChromaMcpManager.ts:841` | Rejects settings and explicit embedding_function_name overrides before client access. |
| `src/services/sync/ChromaSync.ts:385` | Revalidates settings before cached collection reuse. Names, payloads, watermarks, query/filter logic retained. |
| `src/shared/SettingsDefaultsManager.ts:303,602` | New empty EXECUTABLE declaration; UVX_PATH stays inert for round-trip compatibility. No discovery/migration. |

Removed manager code: uvx/Python/dependency arguments, HTTP launch/host/SSL/tenant/
database/API-key arguments, executable/PATH probing, prewarm/circuit breaker, uv scratch
deletion, assumed telemetry environment flags and certificate acquisition via uvx.
Local lock/store protection, mutation serialization, cancellation, process identity
and teardown remain behind the closed gate. ChromaSync is retained; CloudSync is step 5.
Other bootstrap/telemetry/provider paths in broad bundles remain their owning steps.

## Required inputs before enabling Chroma

A separately launched step-7 follow-up requires:

- Explicit approved local artifact/executable paths and read/inspection permission.
  Acquisition needs separate approved sources/lifecycle permission, if requested.
- Exact resolved Python/MCP/Chroma/native graph, hashes/licenses, supported Windows/
  architecture combinations and store compatibility. Old uvx constraints are insufficient.
- Actual adapter source/CLI/MCP schemas and launch/environment API. `LocalChromaLaunch`
  is an internal TypeScript shape, not a Python contract or approval manifest.
- Model/tokenizer/native-file manifest/hashes and API evidence for explicit local-only
  loading, missing/corrupt-file refusal, no downloader/repair/provider fallback, and
  safe existing-collection embedding metadata. No unapproved cache search.
- Telemetry implementation for that artifact and its supported enforced disable API
  across boot/index/query/error/shutdown. An assumed env flag is insufficient.
- Separate real-process smoke/traffic permission with disposable data. Full OS/runtime
  acceptance stays in step 11; closure/provenance/reproducibility/packaging in 10/12.

D1/D9/U1 and D11 remain open. Step 10's finalized Python/model contract prerequisite
is not satisfied by this source refusal. Dependency graph/waves are unchanged.

## Checks actually run

Existing exact Node **22.23.4**, npm **10.9.9**, Bun **1.4.4** verified. No upgrade/install.
Selected fixtures/preload/subprocess/env/network behavior read before execution.
Synthetic HOME/USERPROFILE/config/data/TEMP/TMP/APPDATA/LOCALAPPDATA and isolated npm
configs/cache/offline environment under `.scratch/enterprise-local/chroma-07`.
Process-local PATH only; inherited AWS/Anthropic/Claude/CMEM/Codex overrides removed,
then synthetic paths set. Root preload mocks PostHog and real-Claude-login readiness.

Final **127 PASS, 0 FAIL, 383 assertions**, ten separate Bun runs, exit 0. Separate
processes prevent global lifecycle mocks leaking authorization into real-manager tests.
Each command: `bun test --preload ./.scratch/enterprise-local/chroma-07/test-guard.ts
--timeout 20000 tests/services/sync/<name>.test.ts` (line-wrapped here).

| Test basename | PASS | Evidence |
|---|---:|---|
| chroma-local-runtime | 8 | Actual manager refuses missing/cold/corrupt/present synthetic executable fixtures; zero SDK transport/client construction; legacy uvx, remote and direct provider overrides reject; no repair/fallback. |
| chroma-mcp-manager-path | 18 | Absolute local path rule; relative/UNC/PATH, package managers, shells and interpreter entries reject. |
| chroma-mcp-manager-ssl | 4 | Legacy remote rejects even loopback with either SSL setting; unknown mode rejects. |
| chroma-mcp-manager-cwd | 1 | Retained transport cwd isolation; removed acquisition helpers. |
| chroma-sync-embedding-function | 8 | Default request with mocked manager; five vendors/unknown name reject before tools; cached collection revalidates. |
| chroma-mcp-manager-singleton | 51 | Synthetic launch/SDK/process/supervisor/identity mocks: mutation serialization, retry/timeouts, cancellation, lock/store, crash/teardown. No Python. |
| chroma-query-postfilter | 21 | Existing project/merged/type/platform/filter query semantics with synthetic corpus. |
| chroma-sqlite-id-lookup | 6 | Existing typed lookup/deletion/merge selection with synthetic documents. |
| chroma-sync-state-atomic | 6 | Disposable checkpoint persistence/error regressions. |
| chroma-sync-state-shape | 4 | Disposable malformed-checkpoint handling. |

Guard rejects fetch and Bun/child_process subprocesses; no forbidden operation recorded.
Lifecycle fixtures replace real process-table/kill calls and subprocess identities.
Removed expectations concern acquisition/prewarm/cache deletion and remote mode.
These are Node refusal fixtures, **not** actual Python/model cold-cache tests.

Initial test run: two Windows fixture assertions expected OS-signal recording although
source called mocked killProcessTree; assertions now check that mock's target. Final
51 lifecycle checks pass. No real process signaled. Initial editing accidentally removed
three generation/identity fields; restored before test execution. Artifact checker
initially assumed map sourcesContent; corrected to source-list/emitted-gate and syntax
checks because generated maps omit it. No embedded-source byte equivalence claim.

## One compile and paired artifacts

**One** reviewed `npm.cmd run build:compile`: PASS exit 0. Unchanged BUILD-02 Node guard,
synthetic env above, empty npm configs/cache, offline=true, audit/fund/update-notifier=false.
Existing local inputs sufficed; missing inputs would fail without repair. Generator/
distribution/attribution/Rule A checks passed. No preparation/lock resolution/build-and-sync/
dev/runtime repair/deploy/service command. No second compile.

Trace: nine Node initializations, spawn=5, execFileSync=1, exec=1, execFile=1; local
generators/esbuild/tsc/Vite and Vite's net use query. No Node socket/acquisition/deploy
event. This is not OS/native/shell-wide network enforcement or capture.

All **16 input/sentinel hashes** match pre/post compile and HOSTED-03 final values;
the unchanged table is in [HOSTED-03](HOSTED-03.md#input-preservation-and-evidence-fingerprints).
Includes manifests/locks/trust/allowlist guard, installed lock metadata and selected
compiler files. No deliberate installed-tree/dependency/trust/lock/version mutation;
this is not an exhaustive installed-tree, provenance or reproducibility proof.

**192** pre-existing tracked outputs: **177 unchanged, 15 modified, zero added/deleted**.
G contains six plugin/scripts CJS/map pairs: context-generator, context-read-worker,
mcp-server, server-service, transcript-watcher, worker-service; plus
plugin/sqlite/SessionStore.js/map and plugin/skills/request-progress/scripts/request-groups.mjs.
Extra paired targets inline SettingsDefaultsManager; no SQLite/progress behavior source
changed. Classic viewer/My Work assets unchanged. Ignored CLI outputs rebuilt by compile
are not asserted release artifacts. Generated syntax, map source-list/emitted refusal,
npm-map consistency PASS. Source/test whitespace PASS. Known generated-worker dependency
trailing whitespace at line 143 retained verbatim; maps omit sourcesContent.

Git index initially denied by sandbox read-only .git. Authorized local writes succeeded
through escalation, with hooks/signing disabled per command; no approval rejection/push.
Compile used exact S bytes before S was recorded; source/index equality checked.

Disposable evidence SHA-256; results/decisions above are durable:

| Evidence | SHA-256 |
|---|---|
| tests.log (ten final file logs) | 0bf2cda0c02d57eda575c8b305c514dbd8a9401cf0a79e489209c5f7dc25ead9 |
| compile.log | 5eb39a6783e61992ec7aef90ca9099239adf2266a3fb82bb8d4a7687016ab56d |
| compile-guard.cjs | 851d5c238998758aab8b79757cb68c2ba67e7a5c764affee2fd5733180c76115 |
| children.jsonl | a7b9c9f0db5e223c571b2d3415b6a6479a66e630b848c49bf5573d58d53a805a |
| validation.json | 3721dbd748b49a67d03e2ce140c0e9e28155c305faa22a2339eb4736727e05da |

## Rollback and next task

Revert **G then S**, resolving only later overlap. This restores unsafe uvx/remote
capability; do not run the restored runtime against real state. No reset/clean/reinstall/
data deletion required. Preserve SQLite, derived Chroma, installed inputs and prior
setup/trust/compile/hosted commits; then adjust docs to the rollback state.

Stop here. No actual Python/model/Claude Code/Bedrock smoke, full runtime/OS-egress,
artifact compatibility, services/MCP/plugin registration, AWS/live inference, real
user assets/state/credentials, acquisition, push, branches/worktrees or agents.
Next independent task: **TELEMETRY-04 / step 4**, awaiting explicit launch of
[NEXT-SESSION](../NEXT-SESSION.md). Step-7 activation remains pending U1/D9.

Session-close checks PASS: 15 changed/new Markdown files, 81 relative file links valid;
S citations rechecked; source/generated worktree clean; all 16 input fingerprints
unchanged. Dependency graph/execution waves identical to entry after CRLF normalization.
Documentation whitespace PASS. Reservations released; docs commit follows S/G.
