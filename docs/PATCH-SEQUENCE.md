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

Candidates: remove cloud push/pull/realtime/routes/lifecycle; stop remote outbox
production while preserving SQLite schema/device compatibility and Chroma synchronization.
Acceptance: old token/hub settings inert, no remote client; durable events and index
rebuild/restart preserved. Planned validation: DatabaseManager/SQLite/sync fixtures,
including `tests/services/sync/chroma-sync-reconcile.test.ts`. Rollback: preserve data;
revert source, no destructive down migration.

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

CHROMA-07 **source refusal done-bounded**, not operational activation. Source
8fa997979, paired generated b8734d9b2; [evidence/rollback](enterprise-local/handoffs/CHROMA-07.md).

- [x] Remove manager uvx/package resolution, prewarm/cache deletion, certificate
  acquisition and HTTP launch; reject legacy remote/unknown modes and vendor embeddings.
- [x] New absolute local executable setting, no discovery/repair/fallback. All candidates
  refuse before store/client/process pending actual approved artifact/embedding/telemetry
  API evidence. No config flag or self-attested manifest can unblock this boundary.
- [x] 127 mocked/synthetic tests / 383 assertions PASS; one compile PASS; 16 inputs
  unchanged and 15 generated outputs paired. Existing query/filter/typed selection,
  checkpoint, writer-lock/mutation/teardown regressions checked with fixtures.
- [ ] U1/D9: approved paths, resolved Python/native/model graph/hashes/licenses and
  supported offline embedding/telemetry-disable API evidence. No artifacts supplied.
- [ ] Actual cold-cache index/query/restart/telemetry/error/no-orphan evidence requires
  separate approved assets/runtime permission. No real Python process ran. D11 open.

Full runtime/OS acceptance stays 11; closure/provenance/reproducibility stays 10/12.
Graph/waves unchanged. Rollback G then S restores unsafe resolution/remote capability;
retain SQLite/Chroma data, never delete the sync directory or real cache. Next independent
increment is in current STATE/NEXT-SESSION; do not rerun completed TELEMETRY-04.

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

Latest **WINDOWS-09D** B855ef7d6e/S236dd661c/H2935e19d0: literal absolute
interpreter source rendering, canonical structured commands unbound/empty, shell
exit1, no bare node, /bin/sh or Qoder wrapper hosting. Independent installer helpers
and diagnostics refuse; private runtime/bootstrap/probe bodies/imports retired.
20 V1 tests/433 assertions, one compile/viewer PASS; root same three TS2345. 19 inputs/
869 source sentinels/192 outputs unchanged across compile; eight canonical outputs
paired in B, no generated follow-up commit. Host binding/runtime approval and native
OS/artifact/protocol prerequisites remain; **WINDOWS-09E remaining source** owns common
harness admission/teardown failures. No registration, actual V3 or full step9 closure.
[Exact evidence/gaps/rollback](enterprise-local/handoffs/WINDOWS-09D.md).

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

Prove reachability before pruning. Keep SDK/Codex/API modules and dependencies required
by any retained explicit profile/role or host integration. Remove unused remote-memory
server/cloud/telemetry/connector/setup/recovery capabilities and proved-unused modules,
not entire non-Claude directories by name. Local ChromaSync is distinct from CloudSync.

Pin approved artifact/dependency closure, SBOM/licenses and sources; reviewed lock/trust
work needs explicit acquisition/resolution scope, not a compile side effect. Generate
matched entrypoint/manifest/UI artifacts and record all hashes. Reject stale clients /
hardcoded model routes and unsupported adapter combinations. Preserve selected-profile
config and safe diagnostics; include no fake credentials/test bypass in release.

Finalize/reuse step-9 runner and fork CI lane with approved D12 runner/provisioning policy:
exact tools, reviewed V1/typecheck/V2/V3 commands, no ambient secrets or network package
resolution, no deploy/sync/publish. V4 with fake LLM + real approved local Chroma is a
required package-candidate check once prerequisites exist, independent of Bedrock.
Review upstream CI/publish/deploy triggers before any authorized push; do not launch
existing acquiring workflows by default. Missing assets/CI stages stay explicit pending.
Acceptance: exact closure and source/generated pairing; needed adapters preserved,
reviewed CI evidence/stage report, no unapproved application destination. V5 live and
final OS evidence remain 11. Rollback matched source/locks/artifacts, preserve all data.

## 11. Exact-artifact runtime, E2E and selected-profile acceptance

Use VALIDATION V3-V6 against the exact step-10 candidate. Earlier checkpoint evidence
must be repeated if relevant emitted bytes changed. Real compiled-process startup/MCP /
worker/API/viewer/stop is required; unit mocks/typecheck/compile are not runtime proof.

V4 without Bedrock: fake loopback LLM with explicit test profiles, actual approved local
Chroma/embedding assets, synthetic hook capture -> SQLite -> observations/summaries ->
index/query -> restart/replay -> viewer. Check errors, private input, unchanged identity /
sharing/filter semantics, concurrency, missing/corrupt assets, bounded retries/cleanup.
This is not a new degraded production mode; blocked Chroma cannot pass full V4.

V5: separate actual provider/auth/model rows for intended enabled profiles, including
Bedrock/SSO when available, selected Claude/Codex logins and direct API paths. Unsupported
combinations reject. Failures cannot switch to another profile/model/account; optional
role overrides must be explicit and observable. No live credentials in CI PR jobs or
tracked evidence. Currently unavailable Bedrock stays NOT RUN/BLOCKED; one live backend
cannot certify another. Reuse fixture/process work meanwhile rather than wait on AWS.

Process-tree DNS/connection and browser request evidence across startup/capture/index/
query/error/shutdown is needed for final egress conclusions, including SDK/CLI/native
children and auth refresh. Node tripwires/TCP snapshots alone are insufficient. Sanitize
logs and record exact hashes, command, environment and tested topology. Unexplained
application destination blocks release. Retained capture/DLP/identity redesign remains
out of scope. Diagnose failures in their owning increment; no fake green from skipped jobs.

## 12. Distribution, configuration and operational handoff

Verified offline Windows bundle, checksums/SBOM/licenses and approved artifact sources;
local install/verify/uninstall/reinstall and data-preserving rollback on exact final
hashes. Document default/role profile setup, explicit model/auth selection, local Chroma
assets, payload/retention rules and troubleshooting. No plugin registration/subscription
or third-party MCP service required; chosen providers may require owner entitlement.

Publish tested support matrix by adapter/auth/model/platform, distinguish mocked from
live rows and identify unavailable Bedrock or other routes. Regular use requires the
intended profile's actual evidence plus local memory/index and install acceptance.
A separately agreed preview on another validated route does not certify Bedrock.
No automatic migration/update or upstream/fork data merging. No push/deployment inferred.
Final approved package must preserve useful local behavior and all configured retained
routes, rather than silently return to a single-provider distribution.

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
