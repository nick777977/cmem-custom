# Build, runtime and CI evidence contract

Accepted validation plan, 2026-11-02, A20. V3-V6 remain planned/not run; bounded
WINDOWS-09/09B/09C/09D V1/V2 and 09E V1 results and harness/CI source are distinguished below.
Execution needs the applicable user launch and isolated assets/permissions. This file
owns validation levels and pass criteria; [roadmap](../roadmap.md) alone owns dependency
edges/waves, and [LLM-PROFILES](LLM-PROFILES.md) owns model routing policy.

## What has actually been tested

| Evidence | Result already recorded | What it does not establish |
|---|---|---|
| BUILD-02 | Pure compile boundary, focused fixtures and committed bundle syntax PASS | Whole-OS no-egress, supply-chain provenance or runtime functionality |
| HOSTED-03 | 58 isolated tests + one real compile PASS | Full installed memory flow or actual model access |
| CHROMA-07 | 127 mocked/synthetic tests + one real compile PASS | Approved Python/model, running Chroma or embeddings |
| TELEMETRY-04 | 206 tests / 728 assertions + one real compile PASS | Full worker/MCP/host process-tree lifecycle or provider auth correctness |
| Previous user build/start | User-reported build and worker ready; preserved separately | Current source/artifact, full memory/Chroma/provider acceptance |
| WINDOWS-09 source/harness | 17 V1 tests / 53 assertions, compile/viewer typecheck PASS; root three unchanged baseline TS2345 | No actual generated process, readiness or complete private path proof |
| WINDOWS-09B source/harness | 19 V1 tests / 112 assertions, one compile/viewer PASS; root same three errors; eight paired outputs changed, 19 inputs preserved | Explicit-root refusal is not a global boundary around remaining host templates/Setup/grammar; no V3/readiness |
| WINDOWS-09C source/harness | 20 V1 tests / 234 assertions, one compile/viewer PASS; root same three errors; MCP pair emitted plus seven canonical host outputs; 19 inputs/868 source sentinels stable across compile | Refusal only; host interpreter/loading, independent helpers, native OS boundary and artifacts/specs remain; no V3/readiness |
| WINDOWS-09D source/harness | B855ef7d6e/S236dd661c/H2935e19d0; 20 V1 tests/433 assertions, one compile/viewer PASS; root same three errors; 19 inputs/869 source sentinels/192 outputs stable across compile, eight canonical outputs paired in B | Literal interpreter rendering and unbound host templates are not pre-execution approval or host loading/envelope proof; native/artifact/protocol prerequisites and common harness teardown failures remain |
| Fork-specific CI and actual process smoke | Source authored; runtime/CI NOT RUN, native adapter and D12 pending | Manual-only workflow unconditionally blocks; no green CI or V3 evidence |
| WINDOWS-09E common mock harness | H98a6d019c, 16 V1 tests/337 assertions PASS; no application/generated change, compile/typecheck NOT RUN | Sync launch ownership unknown; independent stop/release and preserved failures are mock orchestration, not native ownership/egress/cleanup proof |
| WINDOWS-09F OS API review | aebc55e99, V0 source/Microsoft API feasibility at R1ca61590d; no source/generated changes; V1-V6/CI NOT RUN | JOB_LIST/AppContainer/WFP/stream/release primitives are candidate design evidence, not approved artifacts/ABI, native enforcement, DNS/crash/cleanup proof or a working host binding |

These are real tests and real compilation, not mere source review. Worker bundles are
compiled by esbuild; the viewer also invokes its TypeScript/Vite build. This is not a
substitute for root typecheck or executing the compiled worker. Existing tests often
mock process/network/provider boundaries. A successful build can still contain a
runtime import, path, ABI, lifecycle, configuration or auth error.

Current baseline is Node 22.23.4, npm 10.9.9, Bun 1.4.4. Preserve existing local inputs;
no reinstall/download/update to make validation green. Missing/corrupt dependencies
are explicit failures with a separate acquisition request, not automatic repair.

## Validation levels and honest result labels

| Level | Runs what | Pass criteria | Earliest owning checkpoint |
|---|---|---|---|
| V0 static/contract | Source, entrypoints, generators, policy, config and artifact lists | No unowned inference/network route; source-SHA citations; changed scope known | Each increment |
| V1 focused behavior | Reviewed isolated unit/route/adapter fixtures with mock transport/process | Meaningful success/failure/legacy assertions; no real assets/accounts; no-send negatives | Each source increment |
| V2 compile/typecheck | Exact local build:compile, approved typecheck and syntax/closure checks | Exit 0; no install/deploy/lock resolution; expected generated delta and preserved input hashes | Each application-source increment under its build permission |
| V3 compiled-process smoke | Actual generated launcher/CLI/hook/MCP/worker entrypoints on a disposable profile | Expected exit/JSON/readiness/diagnostic, bounded time, no external traffic/repair/orphans; distinguish stubbed components | Step 9 starts safe entrypoint/failure smoke; repeat relevant slices after 5/6/8 |
| V4 local memory E2E | Compiled worker + explicit loopback mock LLM + actual approved local Chroma/model | Synthetic capture -> SQLite -> observation/summary -> index -> query -> restart/replay -> viewer; no unapproved remote traffic | Once 5/6/7/8/9 prerequisites permit; before accepting step-10 package |
| V5 live selected profile | One real chosen provider/auth/model using synthetic content | Actual login/auth/model/transport and failure behavior verified, no profile escape | Step 6/11 when that profile's access is explicitly available |
| V6 exact release/install | Exact packaged hashes on clean disposable Windows profile | Install/verify/uninstall/reinstall/rollback, process-tree egress and all required selected-profile evidence | Steps 11/12 |

V3 is not automatically full memory readiness. Loading a module or seeing /health
cannot replace V4. V4's fake LLM is not Bedrock/OpenAI/Codex authentication proof.
A fake Chroma adapter is useful V1/V3 evidence but cannot pass real-index V4.
Do not implement a new production SQLite-only success mode as a testing shortcut;
D11 remains open. V3 may verify the current controlled Chroma refusal while U1/D9
block activation, with that expected refusal explicitly reported.

Each result has one of PASS, FAIL, BLOCKED (named missing prerequisite), NOT RUN or
NOT APPLICABLE (explained). An unavailable/omitted/conditional job is never counted as
PASS. Record commit, source/output/input hashes, command, exact versions, isolated
paths, actual process scope, evidence level, failures/retries, cleanup and limits.
For a multi-provider artifact, publish a per-route matrix; one working provider cannot
certify the rest. Avoid claiming tested model IDs/auth modes not actually exercised.

## V1/V2: extend existing checks, keep feedback short

Reuse reviewed tests and tools; do not introduce another test framework or full CI
system. Run the smallest meaningful affected suite per increment. Read fixtures first:
full upstream fast/integration lanes are not permission-safe defaults. They can launch
workers, browsers, grammars, installers, Docker or network. Explicitly review file lists,
subprocess/env behavior and native/runtime dependencies before including them.

Planned source gates include policy resolver/default/role overrides; unsupported
provider/model/protocol; legacy settings; SDK isolation; endpoint/key binding;
queue/privacy/filter/replay regressions; launcher paths and missing inputs. Typecheck
is a separate gate: package.json:113 currently defines root and viewer tsc --noEmit.
It was not run under PLAN-ADAPT-05; WINDOWS-09 subsequently ran reviewed direct compiler
commands: viewer PASS, root FAIL with identical entry-baseline diagnostics. See
[WINDOWS-09](handoffs/WINDOWS-09.md). Review pre/post scripts and installed inputs
before authorizing it. Record existing unrelated failures against a baseline rather
than weakening types, guards or tests to obtain a green run.

Compile is the reviewed build:compile path only. Capture pre/post manifest/lock/trust/
compiler/input/output hashes; compare expected generated changes, syntax and packaged
closure. No build-and-sync, dev, package resolution, publish or implicit registration.
Rebuild/test again only after a relevant change or failed check warrants it. Node
tripwires supplement isolation; native/shell children require OS-level controls for a
full no-egress assertion.

## V3: actual compiled entrypoints, bounded before all features are finished

Create a reusable fixture runner, owned initially by step 9 and reused by subsequent
steps. Exercise copied generated files from a synthetic private bundle path, rather
than just importing TypeScript or unit-mocking an entire WorkerService.

WINDOWS-09 Hf2c722fad authors `scripts/enterprise-local/compiled-smoke.mjs` with
copied generated hashes, explicit env allowlist and three leaf specs. Its orchestration
was tested with mocks labelled V1/substituted. No native adapter/default spawn is supplied;
owned-tree/OS-egress implementation and missing/stale/MCP/worker cases remain continuation
work. Actual V3 NOT RUN. [Exact commands/deadlines/ownership](handoffs/WINDOWS-09.md).
WINDOWS-09B H bbc3847e9 reuses that fixture under task scratch windows-09b and adds
four non-hook launcher specs: missing explicit root, missing bundle, stale entry from
another root and present-but-unapproved bundle. Mock-only tests against copied G
hashes PASS; no native adapter or actual process. Stale entry is not runtime hash/
version integrity evidence. Other missing/stale/MCP/worker cases, OS boundary and
owned-tree cleanup implementation remain. The adapter's native kind label alone is
not approval/enforcement. [Historical 09B results/gaps](handoffs/WINDOWS-09B.md).

WINDOWS-09C H abfce3963 uses task scratch windows-09c, copies eight exact hashed
outputs and adds twelve wrapper root-required/missing/unapproved negative specs.
Its 20 tests remain V1 (ten copied-artifact mock tests repeated after G). Source
gates exercise mocked fs/process; installer/CLI bodies are inspected without importing
installer state. Native-kind adapters now unconditionally reject before launch with
NATIVE_OS_BOUNDARY_NOT_IMPLEMENTED. Only mocks can report PASS/V1/substituted; no
native label or self-attested callbacks produce V3. Native OS admission/descendant
ownership/egress/DNS/startup-failure/timeout/cleanup implementation, approved immutable
inputs and MCP/worker lifecycle specs still required. No generated process executed.
[Latest evidence and exact gaps](handoffs/WINDOWS-09C.md).

WINDOWS-09D H2935e19d0 uses only windows-09d scratch and extends wrapper negative
specs to 28 interpreter/root cases. Authored-source V1 exercises explicit/missing/
relative/UNC/stale interpreter inputs and independent helper refusal, with no emitted
application evaluation. Canonical Claude/Qoder/MCP commands are empty/unbound;
Codex/Setup shell entries exit1. Do not register these templates or treat failure to
bind an interpreter as tested host lifecycle. Four wrappers have no env-node shebang.
Paths/realpath identity never approve runtime version/hash/ABI. 20 tests/433 assertions,
one compile/viewer PASS, root baseline FAIL; all compile input/source/output sentinels
stable, so no redundant postcompile test replay. Native-kind still unconditionally
BLOCKED. At 09D, launch ownership uncertainty and release after failed/timed-out stop
remained source gaps; 09E below addresses mock orchestration, without OS cleanup proof.

WINDOWS-09E H98a6d019c addresses that common mock failure gap: case/handle validation,
sync launch refusal, completion/startup/result/deadline/output errors and independent
bounded stop/release with all errors retained. Release is attempted even after stop
failure/timeout; invalid/missing callbacks fail. Sync launch without a handle means
ownership unknown, not released. Separate per-stage timers do not preempt synchronous
JS, cancel pending callbacks or bound native startup/live streams. 16 V1 tests/337
assertions PASS; no actual child, compile/typecheck or application/generated change.
Native-kind at scripts/enterprise-local/compiled-smoke.mjs:146 (H) remains unconditionally
BLOCKED. No callback/native label approves OS ownership, inherited egress/DNS denial
or owned-tree/listener/handle/boundary cleanup. Next remaining source reviews concrete
OS substrate/API and artifact-interface inputs; actual V3 cannot be proposed before
approved immutable artifacts, implemented native adapter/OS boundary, permissions
and cleanup readiness. [Exact evidence/gaps/rollback](handoffs/WINDOWS-09E.md).
MCP initialize/list-tools and worker lifecycle success specs remain unimplemented,
not conditionally green. [Historical exact evidence/gaps](handoffs/WINDOWS-09E.md).

WINDOWS-09F aebc55e99 completes the bounded Microsoft API review: JOB_LIST assigns
before initial-thread execution, while job membership alone does not establish
network/DNS/broker isolation. Dynamic WFP filter teardown and job kill-on-close
have no reviewed joint crash-order guarantee; OS termination/cancel requests are
not release barriers. Exact primitive/order/error/artifact/ABI/evidence gaps are
in [WINDOWS-09F](handoffs/WINDOWS-09F.md). This is V0 only; no native adapter, approval
manifest, source delta or actual V1-V6/CI run. Full step9 remains BLOCKED; a source
review cannot make deliberately unbound/exit1 host commands function. No further
generic review/mock-hardening loop is required; next useful source is concrete
local host binding after scope/inputs. Actual V3 still requires approved immutable
artifacts, implemented native adapter/OS boundary, permissions and cleanup readiness.
No all-path cleanup success, MCP lifecycle spec or worker success inferred.

Required cases, selected according to implemented features:

- Node/Bun entrypoint parsing/loading and help/version/no-op hook commands under the
  intended executable, from spaces/Unicode paths. No package auto-install, global/PATH
  fallback, upstream cache, inherited plugin configuration or real host profile.
- Missing runtime/bundle/config returns a clear bounded nonzero/structured failure;
  no download, repair, subprocess search or hidden provider. Test expected refusal
  where Chroma is intentionally blocked; do not call that successful startup.
- Local own MCP starts via the exact copied stdio entrypoint with synthetic config,
  performs initialize/list-tools and a harmless synthetic request, then closes cleanly.
  Do not invoke a host's unrelated MCP servers or installed plugin settings.
- When safe prerequisites exist: spawn compiled worker, wait for readiness with a
  deadline, exercise allowed loopback API and local viewer assets, stop/restart and
  verify the owned process tree exits. Capture stderr, exit status, handle/PID ownership
  and response content. Missing exports, native ABI/import errors, stale bundles and
  async startup failures must fail the run, not be swallowed as a skip.
- A separate bad-config/error-path run must prove no network client or alternate
  provider/account/model is attempted; startup and shutdown must remain bounded.

The runner gets an explicit env allowlist with synthetic HOME/USERPROFILE/APPDATA/
LOCALAPPDATA/CLAUDE_CONFIG_DIR/CODEX_HOME/data/temp/npm config/cache; no ambient AWS,
OpenAI, Anthropic, gateway tokens or real memory. Do not copy the full parent env.
Disposable test credential files contain synthetic values only. Bind mock endpoints
on loopback with explicit ports allocated to the run; synthetic hosts/HTTP are fixture
exceptions, not production validation bypasses. Disable external network at the
approved process/OS boundary; inspect DNS, redirects and child processes too.

Own every child/port/file created and clean only verified descendants/task paths.
No killing existing workers or processes by image name, no changing real registration,
PATH/registry, caches or user installation. Bound readiness/stop deadlines and preserve
failure evidence before cleanup. Do not add a hidden production test override to
bypass profile or Chroma enforcement; fixture injection belongs at reviewed adapter
seams, is labelled as substituted evidence and is excluded from release packaging.

## V4: real local workflow without a cloud account

Use an explicit test profile directed to a loopback OpenAI-compatible mock server,
with deterministic structured observation/summary responses. This exercises real
HTTP serialization, compiled provider routing/parsing, durable storage and recovery
without spending tokens or needing Bedrock. Fixture protocol support is not proof of
all provider-specific SDK/CLI flows; those have their own adapter/process tests.

With approved local Python/Chroma/embedding artifacts and runtime permission, check:

1. Feed synthetic prompt/tool events through retained hook/MCP/spool entrypoints;
   assert canonical SQLite observations/summaries and existing privacy/project filters.
2. Confirm every mock LLM request matches the resolved role/profile/model and contains
   only intended synthetic payload; explicit role overrides reach only their mock route.
3. Query the actual derived index and SQLite/FTS, verify expected retrieval identifiers
   and unchanged viewer/API content, without asserting new isolation guarantees.
4. Restart the owned processes; confirm persistence, queue replay/deduplication,
   index checkpoint recovery and no duplicated stores. Cover bounded concurrent sessions.
5. Simulate auth/timeout/429/bad response/unknown model, refused redirect and unreachable
   endpoint; no unselected model/key/provider, hidden telemetry/cloud/MCP or retry storm.
6. Test empty/cold approved model cache, corrupted/missing artifact and index failure:
   fail visibly without acquisition, deletion of canonical data or false success.
7. Capture process-tree/network evidence across boot/capture/index/query/error/shutdown;
   show the approved loopback topology and explain all other attempts. Browser requests
   count too; bundling assets alone does not prove the viewer makes no external call.

If local assets are unavailable, V4 is BLOCKED by U1/D9, with earlier evidence retained.
An isolated SQLite/queue test is valuable but must not be renamed full memory acceptance.

## V5: unavailable Bedrock and honest supported-provider status

Bedrock access is currently unavailable per the user; do not block V1-V3, CI fixture
work or mock-LLM testing on AWS credentials. Bedrock live status remains NOT RUN/BLOCKED
until account/Region/model/profile/payload/network permission is supplied. Do not
request real credentials in tracked files or reuse the user's running environment.

Use synthetic content for each approved live route. Verify both a small successful
observation/summary and failure behavior, auth refresh and no fallback. AWS SSO,
Claude login, Codex ChatGPT login, direct Anthropic key and OpenAI-compatible key are
separate rows. Unsupported combinations are rejected, not called tested support.
Only an actually validated profile is enabled for regular use under its policy.
A documented preview on another tested route can be evaluated separately; it does
not certify Bedrock, and no release targeting Bedrock passes while its row is open.

## Fork CI design and ownership

Existing upstream workflows are evidence leads, not the fork validation contract.
At source 48feeab567995de81d501b74007694b5ee95a880:

| Path:line | Static finding |
|---|---|
| .github/workflows/ci.yml:18,23,30,44,50 | Node 20, Bun latest, npm install, typecheck and build; later broad test lanes |
| .github/workflows/windows.yml:23,30,34,37,39 | Windows runner, Node 22 range, downloaded Bun installer, npm install and build |
| package.json:74-77,113,116-117 | Pure compile/preparation split, typecheck and upstream fast/integration commands |
| tests/infrastructure/worker-bundle-self-contained.test.ts:25,32,38-39 | Existing compiled-hook child fixture; copies bundle but inherits broad env, needs adaptation before reuse |
| tests/integration/worker-api-endpoints.test.ts:1 | Existing in-process WorkerService/API tests are not exact-artifact process proof |

Plan one fork Windows validation lane using existing tools and pre-provisioned approved
runner inputs. Prepare its harness/config with step 9, run reviewed available checks at
subsequent implementation checkpoints, finalize dependency/provenance pinning in 10,
and consume exact-artifact evidence in 11/12. This is an added checkpoint within existing
steps, not a new independent roadmap or a requirement to wait until step 11 to detect
runtime failures. Source-only launch can author the runner/workflow but cannot execute
services or change runners without runtime authorization.

- Pin the known toolchain exactly; Windows is required for Windows lifecycle claims.
  Optional Linux checks supplement it without replacing Windows evidence.
- Separate dependency/runner provisioning from the validation job. No npm install,
  Bun installer, uvx, model download, preparation or registry lookup during verification.
  Supply a reviewed closure from approved artifacts; missing inputs fail clearly.
- Reuse V1-V3 runner commands locally and in CI. Avoid two divergent test pipelines.
  Run targeted typecheck/tests, pure compile, emitted-source/closure checks, then actual
  compiled-process smoke. Add V4 only when its local assets and runtime scope are present.
- Default CI lane has no live provider credentials and denies external egress. Live V5
  is an explicitly launched restricted job/profile, never an untrusted PR secret job.
- Review upstream workflow triggers before the first authorized push/PR: preserve useful
  tests but prevent broad acquiring/deploying/cloud jobs from becoming the default fork
  gate. Do not run all existing workflows merely because they are present. Existing
  publish/deploy workflows require separate review, not a trial execution.
- Prefer a trusted self-hosted/offline or otherwise explicitly approved runner. Do not
  upload private code/assets/logs to a hosted CI by implication. Workflow actions,
  runner image and any allowed CI control-plane/artifact traffic need approved pinned
  inputs; distinguish that traffic from the application's denied egress. An isolated
  application job does not mean its CI controller is offline.
- Least-privilege job permissions, bounded time, no secrets on untrusted changes,
  sanitized logs, immutable artifact hashes and evidence retention. No publish,
  marketplace sync, registration, services deployment or push from the validation job.
- Report unit/compile/process/mock-E2E/live-provider stages separately. A green lane
  with unavailable Bedrock/Chroma stages cannot be displayed as full release readiness.

PLAN-ADAPT-05 changed no workflow/runner. WINDOWS-09 Hf2c722fad subsequently added
`.github/workflows/fork-local-validation.yml`: manual-only, unapproved runner label,
exact version declarations and unconditional D12 failure; stage commands are comments,
no actions/provisioning/upload/deploy. This is a blocked source skeleton, not executable
approved CI. Existing upstream triggers remain unchanged and must be reviewed before push.
CI provisioning/execution and runtime permissions remain explicit future launches.
Final step 12 reruns against the exact installable bundle; any relevant rebuilt byte
invalidates the corresponding earlier artifact evidence and requires the affected
checks again, rather than accepting an old green run.
