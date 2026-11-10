# Reviewable commit and validation plan

Dependencies and waves are owned only by [roadmap.md](roadmap.md). This file expands
each increment into logical commits, acceptance and rollback. Only work explicitly
checked below has been performed; other candidates/tests remain planned. Split further if a commit cannot
be reviewed or reverted independently; do not make large directory deletions first.

A19/A20 (2026-11-02) supersede the old Bedrock-only target. Keep all explicitly
selected compatible provider routes; remove unrequested/implicit routing. Canonical
contracts: [LLM-PROFILES](enterprise-local/LLM-PROFILES.md) and
[VALIDATION](enterprise-local/VALIDATION.md). Original checked evidence is unchanged.

## Current documentation work

- [x] Baseline, original plan, project-memory entrypoint and operating boundary.
- [x] Static reconnaissance, target architecture, risk register, roadmap and handoff.

## 1. Close audit and runtime contract

Session 01 result: **bounded static audit complete**, recorded in
[AUDIT-CLOSURE.md](enterprise-local/AUDIT-CLOSURE.md). All eight areas have coverage
and limits; E01–E22 have reachability/disposition/owning steps; generated entrypoints
and the first patch are mapped. E19 remote spool, E20 background inference, E21
tree-sitter runtime provisioning and E22 outbound connectors extend the preliminary
inventory. Reuse those chains in their owning steps, without another broad audit.

Full P1/dependency/runtime acceptance and corporate runtime/artifact agreement remain
pending. Closure U1–U7 assign unavailable Python/native/model/traffic/provenance evidence
and policy questions to later owners/permissions. No source change, install, build,
test or application execution occurred. Step 1's broader contract is not marked shipped.

## 2. Pure compile boundary

Session 02 implemented and checked the source boundary. HOSTED-03 user launch now
accepts it for source progression (A15); **release evidence remains pending**.
See [BUILD-02 evidence](enterprise-local/handoffs/BUILD-02.md),
[DEV-ENVIRONMENT](enterprise-local/DEV-ENVIRONMENT.md) and
[TASKS](enterprise-local/memory/TASKS.md). The historical first-patch contract in
AUDIT-CLOSURE is retained as a snapshot, not a current permission source.

- [x] Preserve all user setup: `49e4f65e1` inputs/trust/manifests/lock and
  `ce7ded4dc` bundles/maps, after all 10 handoff fingerprints matched.
- [x] `153a9953c`: build delegates to build:compile; only local manifest/bundle
  generators are called. Explicit build:prepare:viewer owns ci; explicit
  build:prepare:plugin-lock owns lock resolution. Neither is called by compile.
- [x] Viewer preflights local tsc/Vite, removes embedded ci, retains Windows cwd/
  invocation/error behavior, all viewer assets and generator/verifier targets.
- [x] Agent compile PASS with exact existing Node 22.23.4/npm 10.9.9/Bun 1.4.4;
  all distribution/template/integrity/attribution checks passed. 199 tracked outputs
  and 15 input/sentinel hashes unchanged; no generated delta.
- [x] 6 inert boundary fixtures and 21 committed-bundle syntax checks PASS.
  `705cd1dc9` replaces the latter fixture's MSYS shell pipeline with native git/tar.
- [x] Allowlist consistency: owner explicitly selected C (A14); `8bc557532` adds
  onnxruntime-node/msgpackr-extract to canonical/plugin maps, preserving root setup.
  Actual guard **PASS exit 0**, 30 matching entries. Guard/generator/JSON/Bun trust/lock
  unchanged; plugin delta only allowScripts. [Application evidence and rollback](enterprise-local/handoffs/BUILD-02-TRUST-APPLY.md).
- [ ] OS-offline/complete child-traffic evidence, clean source/dependency closure,
  root-lock provenance and full reproducibility remain open. Node instrumentation
  observed no install/lock/deploy/socket event, but Vite invoked net use and native/
  shell coverage is incomplete. Do not label this full no-egress acceptance.

The declaration subtask is done. P10 was explicitly accepted as A15 by HOSTED-03:
source progression may continue, with OS/no-egress acceptance retained in step 11
and clean dependency/artifact provenance in 10/12. No release evidence passed through
this disposition. Graph edges/waves are unchanged; no install is needed to close step 2.

Worker self-contained runtime-hook fixture and full suites were not run. No services,
AWS, runtime repair, registration, fresh acquisition or real user state were used.
Retain viewer and memory/project/worktree semantics. Steps 3+ are not started here.

Rollback: revert `153a9953c` for build wiring (then do not run the restored acquiring
build); `705cd1dc9` is an independent test-only revert. No generated delta to undo.
Keep user baseline commits/dependencies/data. For C rollback, revert `8bc557532` only;
the old root drift returns. Acquisition-source approval/pinning is still separate;
no reinstall is needed to obtain a green guard.

## 3. Hosted setup and historical import removal

**HOSTED-03 done-bounded**, source/tests `417483949`, generated `298d44742`.
All legacy setup API methods return 410 after loopback checks. Worker scan/extractor/
history-upload wiring and installer browser/checkout handoff removed; direct clients
reject before credential/data/transport access. Viewer always opens local work, even
with ?setup=1; retired UI source cannot dispatch. Local search/note utilities, viewer,
capture/storage/retrieval and local DataRoutes /api/import receiver retained.

Actual validation: 58 targeted synthetic tests PASS, including explicit zero-call
transport/client negatives and local work/review/search regressions; one reviewed
compile PASS; generated syntax/closure checks PASS; 16 input fingerprints unchanged.
No dependency/trust/lock changes or runtime/service/acquisition. Full memory/Bedrock/
OS-egress acceptance remains step 11. [Evidence, citations, generated delta and limits](enterprise-local/handoffs/HOSTED-03.md).
Rollback: revert generated G then source/tests S; preserve local data and user baseline.
This restores hosted capability, so do not run restored setup against real state.

## 4. Telemetry removal with diagnostics preserved

Done-bounded: TELEMETRY-04 S 0abd4180b / G 6bb7c6995 removes worker/CLI/backfill
transports, worker bridge/jobs and telemetry buffer/timers. Compatible APIs and
status/enable/disable command remain inert; legacy opt-in cannot enable transport.
Local diagnostics and existing memory/viewer behavior retained. 206 tests / 728
assertions + one compile PASS; 16 inputs unchanged. SDK dependency pruning stays 10,
OS/process-tree runtime acceptance 11. [Evidence/rollback G then S](enterprise-local/handoffs/TELEMETRY-04.md).

## 5. Cloud removal with local indexing intact

Done-bounded for the local worker. Removed cloud push, pull, realtime, sync
status and TeamBrain proxy registration. SQLite schema, device identity and
legacy queue contents remain readable. Local writes and remaps do not create
new cloud mutations. Local Chroma reconciliation is covered by fixtures.
An installed worker passed startup, read/write, restart and shutdown with
legacy settings and queues in a loopback fixture. Real Chroma rebuild remains
step 7. Revert the paired source and artifacts together and preserve the data.
[Evidence and rollback](enterprise-local/handoffs/CLOUD-05.md).

## 6. Explicit user LLM profiles for every retained model task

Target [LLM-PROFILES](enterprise-local/LLM-PROFILES.md), replacing the former Bedrock-only
candidate. Preserve Claude/Bedrock, direct Claude, supported native logins, Codex and
OpenAI-compatible/other existing explicitly configured adapters. No CMEM trial/gateway,
implicit login discovery, quota fallback or unrequested model/account switching.

Smallest implementation first: reuse existing settings, SDK/Codex/API transports and
safe auth mechanisms; one default profile with optional role overrides. Resolve and
validate destination/auth/model before any send. Preserve same-profile bounded retries,
credential refresh and existing SDK/tool/MCP/recursion protections. Do not promise every
provider/auth/protocol combination works. Model tier aliases and legacy settings cannot
bypass the profile policy. Expose safe effective role/profile/model/auth state using the
existing settings/status surface; never return secret values.

Suggested bounded commits (split sessions only if needed):
- PROFILE-06A: contract/config resolution, synthetic legacy conversion/refusal, scoped
  auth/env isolation, observer + summary/compression routing, effective status and tests.
- PROFILE-06B: standalone/KnowledgeAgent, background refresh/copy/request/focus judges;
  remove independent defaults/hardcoded models/agent probing fallback. Reuse selected
  adapters with thin role wrappers instead of another provider framework. Retained
  features must work through their configured route or expose an explicit unsupported
  result, without silently replacing or disabling them.

Acceptance: all retained data-bearing model calls use resolved request snapshots;
wrong/expired/missing auth, unsupported models/protocols, quota, redirect, bad replies
and timeouts never send via another profile/key/model. User explicitly picks all role
overrides; default configuration needs only one profile/model. No user-state migration.
V1/V2 plus authorized V3 mock/profile failure checks; V4 with fake loopback LLM when
prerequisites exist. V5 live rows are separate: Bedrock unavailable does not block
source/mock tests, but remains unverified. Rollback matched source/generated concerns,
preserve pending events and all local data. See VALIDATION for CI/runtime scope.

## 7. Offline Chroma and model

CHROMA-07-LOCAL **done-bounded** for Windows x64, paired implementation
`c476b5cd0`. [Preparation](enterprise-local/WINDOWS-LOCAL-SETUP.md#prepare-local-chroma)
and [evidence and rollback](enterprise-local/handoffs/CHROMA-07-LOCAL.md).

- [x] Remove manager uvx/package resolution, prewarm/cache deletion, certificate
  acquisition and HTTP launch; reject legacy remote/unknown modes and vendor embeddings.
- [x] Bind the prepared local Python and model files. Both directions use the
  same encoder and explicit Chroma vectors. Resolve D9 for the tested stack.
- [x] Verify missing and corrupt assets, synthetic indexing and bilingual search,
  persistence across restart, and ordinary owned-process shutdown on Windows x64.
- [ ] Exact release closure, native egress proof and transfer remain in steps 10–12.
  D11 remains open.

Historical source refusal 8fa997979 and paired build b8734d9b2 recorded 127 tests,
383 assertions and the compile boundary. [Historical evidence](enterprise-local/handoffs/CHROMA-07.md).
The current rollback is the paired MiniLM commit and retains both derived stores
and canonical SQLite.

## 8. Local API/viewer boundary; preserve memory behavior

Candidates: reject non-loopback/config overrides, retain existing Host/Origin guards,
review sensitive routes and bundle viewer assets locally. Keep the local browser viewer.
Do not rewrite capture, project/worktree identity, sharing, optional query filtering or
retrieval semantics. Existing scope weaknesses are deferred, not acceptance failures
for this release. Preserve current privacy controls; a new capture/DLP subsystem is not
scheduled. Review allowed payloads per role/profile before real provider testing and separately surface
any policy incompatibility requiring a behavior change.
Present effective profile/model/auth/inheritance and disabled/error state, redact secrets;
no new dashboard or identity filtering. Profile config contract depends on step 6.
Acceptance: no unapproved remote API/assets, local viewer works, existing memory behavior
has no regression caused by egress removal. Planned validation: existing project/MCP/
retrieval regression tests and targeted local HTTP/viewer tests; no new isolation
guarantee. Rollback: revert the isolated boundary change; no identity/data migration.

## 9. Deterministic private Windows plugin and early process validation

**A27 phase-one override (2026-11-04):** finish functional user-level local setup,
not another refusal/sandbox review. Necessary dependency/runtime/model installation
and bootstrap are allowed. Replace unbound/exit1 and unconditional local runtime
refusals through bounded source changes; preserve removal of CMEM signup, telemetry,
cloud corpus sync and hidden provider fallback. Codex first locally, Claude Code/
Bedrock/SSO retained; use local catalog/config, no public publication. Build/install/
run must require no admin/UAC or machine changes. Special OS isolation and CI are
deferred from phase-one gates. Real bounded setup/lifecycle/memory acceptance is
still required; old evidence below remains historical and step9 is not yet complete.

WINDOWS-09 **partial** S0d0a4b176 / G004588740 / Hf2c722fad: SessionStart compile/PATH
repair and tree-sitter helper acquisition removed; diagnostic preflight always blocked.
17 tests/53 assertions + one compile/viewer typecheck PASS; root has three unchanged
baseline TS2345. Mock harness/PowerShell planner/manual BLOCKED CI source authored;
actual V3/CI NOT RUN. E12/E13/private resolvers, remaining installer E14/parser E21
fallbacks and native process adapter were assigned to **WINDOWS-09B** below. No full step-9 closure.
[Evidence and rollback](enterprise-local/handoffs/WINDOWS-09.md).

Later **WINDOWS-09B** (2026-11-03 closure), S e3d91a505/H bbc3847e9/G 62a468f6d:
explicit-root launcher always refuses, no discovery/child; automatic setup/runtime
and four launcher install/PATH/removal entries refuse; parser CLI module/PATH fallback
removed. 19 V1 tests/112 assertions, one compile/viewer PASS; root same three errors.
19 inputs preserved; eight paired outputs changed, all generators/configs/UI unchanged.
**WINDOWS-09C remaining source**: E13 templates/wrappers, E12 Setup/version-check/
old helpers, E14 utilities, E21 grammar module/build paths and native adapter. Old
templates can bypass new launcher; no activation or full step-9/V3/CI claim.
[Exact limits/rollback](enterprise-local/handoffs/WINDOWS-09B.md). Graph unchanged.

Earlier **WINDOWS-09C**: S bc3275b4c/H abfce3963/G 4ac6ad868. Canonical host/
Setup/wrappers, direct CLI roots and plugin signup/bootstrap refuse; E14 native
installer runners and E21 grammar module/build/query fallback retired. 20 V1 tests /
234 assertions, one compile/viewer PASS; root same three baseline errors. 19 inputs
and 868 source sentinels unchanged across compile; MCP pair emitted plus seven
canonical host outputs regenerated. Native-kind adapter explicitly BLOCKED; no V3.
**WINDOWS-09D remaining source** owns host interpreter/loading, independent helper
APIs and native OS adapter/artifact/spec prerequisites. Full step9 remains partial.
[Exact evidence/gaps/rollback](enterprise-local/handoffs/WINDOWS-09C.md).

Earlier **WINDOWS-09D** B855ef7d6e/S236dd661c/H2935e19d0: literal absolute
interpreter source rendering, canonical structured commands unbound/empty, shell
exit1, no bare node, /bin/sh or Qoder wrapper hosting. Independent installer helpers
and diagnostics refuse; private runtime/bootstrap/probe bodies/imports retired.
20 V1 tests/433 assertions, one compile/viewer PASS; root same three TS2345. 19 inputs/
869 source sentinels/192 outputs unchanged across compile; eight canonical outputs
paired in B, no generated follow-up commit. Host binding/runtime approval and native
OS/artifact/protocol prerequisites remain; **WINDOWS-09E remaining source** owns common
harness admission/teardown failures. No registration, actual V3 or full step9 closure.
[Exact evidence/gaps/rollback](enterprise-local/handoffs/WINDOWS-09D.md).

Earlier **WINDOWS-09E H98a6d019c** closes common mock admission/teardown failure
source: validate inputs/handle, retain primary and cleanup errors, attempt bounded
release after failed/timed-out stop. Sync launch failure leaves ownership unknown;
callbacks/timers prove no native ownership/egress/cleanup. 16 V1 tests/337 assertions
PASS; no application/generated delta, compile/typecheck or actual child. 09D compile
and preservation evidence unchanged. Native-kind still BLOCKED; full step9 open.
Next **WINDOWS-09F remaining source** reviews concrete native OS substrate/API and
artifact-interface prerequisites; no nominal adapter or actual V3 before readiness.
[Exact evidence/gaps/rollback](enterprise-local/handoffs/WINDOWS-09E.md). Graph unchanged.

Latest **WINDOWS-09F aebc55e99** completes the bounded source/Microsoft API review
at R1ca61590d: JOB_LIST closes the create-then-assign initial-thread gap; jobs alone
do not provide egress/DNS or broker/cleanup isolation. Concrete AppContainer/WFP,
stream/wait/accounting primitives and missing artifact/ABI/crash/release inputs are
mapped in [the review](enterprise-local/handoffs/WINDOWS-09F.md). No adapter or code
edit/test/compile/runtime/CI. Full step9 BLOCKED: unbound host/loading activation,
approved native/runtime contract and actual execution scope absent. Owner's practical
local-install priority does not revoke the explicit preserved refusals/bans. No more
generic audit/review/mock loop; next useful source is local host binding after concrete
scope/inputs. Graph unchanged; no other step executed or artificial completion.

Private ID and bundle-local launcher/MCP/hooks; remove upstream/global cache fallback,
Bash Setup/runtime install/update/self-repair compile. Local PowerShell preflight /
install/verify/uninstall/rollback tooling as source/dry-run first. Generators and emitted
outputs stay paired. Preserve existing host integrations and every retained LLM adapter;
launcher work must not hardwire Bedrock, discard Codex/OpenAI or initiate provider login.
D5 still gates actual registration/PATH/registry/marketplace changes.

Author/review a reusable compiled-entrypoint smoke runner and fork CI lane definition
as part of this increment, using VALIDATION V3. Adapt existing bundle fixtures rather
than inherit broad env or automatically run upstream integration lanes. Pin known
Node/npm/Bun and require pre-provisioned inputs. CI setup/execution/hosted upload is
separately gated by D12; no workflow execution implied by writing its source.

Source-only launch may produce fixtures/harness/workflow without starting worker/MCP.
A later explicit V3 sublaunch exercises copied emitted entrypoints under synthetic
HOME/config/data, no model credentials/remote access: help/no-op/path/missing-tool /
controlled-refusal and safe local stdio/API lifecycle slices. Actual full memory readiness
requires V4; preserve Chroma refusal and do not invent a SQLite-only mode. Spaces/Unicode,
coexistence, no runtime acquisition, exit/status/stderr/deadlines and owned-child cleanup
must be tested at the appropriate level. Missing prerequisites are named, not auto-repaired.
Rollback source/generated and only test-owned registration if separately authorized;
preserve existing upstream/fork data and user install.

## 10. Retained runtime closure, artifact and fork CI

[RUNTIME-10-LOCAL](enterprise-local/handoffs/RUNTIME-10-LOCAL.md) closed the
private launcher admission slice. The standalone server and installer CLI
are outside the staged package, the compiled worker refuses server delegation
in worker mode, and the build checks the excluded sources.
[ARTIFACT-10-LOCAL](enterprise-local/handoffs/ARTIFACT-10-LOCAL.md) pins the
Windows x64 candidate and its separate inputs, records the CycloneDX SBOM and
verifies the transferred bytes. This completes the local inventory slice.
The software bill of materials (SBOM) records what the tested build contains.

Prove reachability before pruning. Keep SDK/Codex/API modules and dependencies required
by any retained explicit profile/role or host integration. Remove unused remote-memory
server/cloud/telemetry/connector/setup/recovery capabilities and proved-unused modules,
not entire non-Claude directories by name. Local ChromaSync is distinct from CloudSync.

Pin approved artifact/dependency closure, SBOM/licenses and sources; reviewed lock/trust
work needs explicit acquisition/resolution scope, not a compile side effect. Generate
matched entrypoint/manifest/UI artifacts and record all hashes. Reject stale clients /
hardcoded model routes and unsupported adapter combinations. Preserve selected-profile
config and safe diagnostics; include no fake credentials/test bypass in release.

For local use, match the compiled output to its source, retain the intended
adapters and identify the files the launcher actually installs. Step 11 runs
the full local workflow with a simulated model and real Chroma. Roll back the
matching source and build together and preserve all data.

Continuous integration (CI) is optional automation under A29. If requested
later, reopen D12 for the runner, permitted commands, pinned tools and inputs,
secrets and network boundaries, and artifact retention. Review upstream
test/publish/deploy triggers before any authorized push. Those workflows are
outside local acceptance.

## 11. Exact-artifact runtime, E2E and selected-profile acceptance

Verify the [inventory receipt](enterprise-local/handoffs/ARTIFACT-10-LOCAL.md#recheck-on-a-matching-windows-x64-host)
before using VALIDATION V3-V6 against the exact step-10 candidate. Earlier checkpoint evidence
must be repeated if relevant emitted bytes changed. Real compiled-process startup/MCP /
worker/API/viewer/stop is required; unit mocks/typecheck/compile are not runtime proof.

V4 without Bedrock: fake loopback LLM with explicit test profiles, actual approved local
Chroma/embedding assets, synthetic hook capture -> SQLite -> observations/summaries ->
index/query -> restart/replay -> viewer. Check errors, private input, unchanged identity /
sharing/filter semantics, concurrency, missing/corrupt assets, bounded retries/cleanup.
VERIFY-11-LOCAL finished the exact-artifact run. The successful memory path
passed. Two pending events were lost on graceful shutdown, so the V4 recovery
case failed. The retained local auth endpoint is a separate private-entrypoint
defect. See [observations and remaining tests](enterprise-local/handoffs/VERIFY-11-LOCAL.md)
and [step 11 status](roadmap.md#what-remains-in-step-11).

V5: separate actual provider/auth/model rows for intended enabled profiles, including
Bedrock/SSO when available, selected Claude/Codex logins and direct API paths. Unsupported
combinations reject. Failures cannot switch to another profile/model/account; optional
role overrides must be explicit and observable. No live credentials in CI PR jobs or
tracked evidence. Currently unavailable Bedrock stays NOT RUN/BLOCKED; one live backend
cannot certify another. Reuse fixture/process work meanwhile rather than wait on AWS.
Under A30, the next Codex host check uses a simulated worker model. Confirm
the exact generative model, auth, synthetic payload and budget only for a
separately requested live check. Local MiniLM handles Chroma embeddings.

Process-tree DNS/connection and browser request evidence across startup/capture/index/
query/error/shutdown is needed for final egress conclusions, including SDK/CLI/native
children and auth refresh. Node tripwires/TCP snapshots alone are insufficient. Sanitize
logs and record exact hashes, command, environment and tested topology. Unexplained
application destination blocks release. Retained capture/DLP/identity redesign remains
out of scope. Diagnose failures in their owning increment; no fake green from skipped jobs.

## 12. Distribution, configuration and operational handoff

Document the Windows checkout build and local plugin setup for each verified
host. Exercise install, update or reinstall, removal and rollback with local
data preserved. Record the selected model and authentication, Chroma setup,
data location and retention, and troubleshooting. Local host registration
uses the local build. Selected model providers may require owner entitlement.

Record tested combinations by adapter, authentication, model and platform.
Distinguish simulated from live results and identify unavailable routes. Regular use requires the
intended profile's actual evidence plus local memory/index and install acceptance.
A separately agreed preview on another validated route does not certify Bedrock.
Keep upgrades and migration explicit and preserve existing data.

If a separate distribution is requested, verify the transferable bundle on its
matching target, close source and license-notice gaps, validate the SBOM format
and record final checksums and rollback. A local checkout install does not
require this packaging work.

## Validation discipline

[VALIDATION](enterprise-local/VALIDATION.md) is the canonical evidence-level contract.
A20 adds early real process checks and fork CI to existing steps; it does not grant
current runtime/acquisition permission. Source-only, compiled-process, fake-LLM E2E
and live-profile results must stay separate; a green compile or mock is insufficient.

Every future commit records tests actually run, blocked checks and evidence limits in
the worklog. Existing tests are leads, not baseline passes. Tests can invoke subprocesses
and network too: inspect fixtures and lane definitions before execution. Use fresh
isolated home/data/model-cache paths and synthetic content. Authorization is bounded
by the current user launch and [handoff](enterprise-local/memory/STATE.md). Session 02
compile/focused results above are completed evidence; BUILD-02-TRUST performed only
read-only review/docs. Other checks remain planned unless explicitly recorded as run.
