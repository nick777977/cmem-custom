# Reviewable commit and validation plan

Dependencies and waves are owned only by [roadmap.md](roadmap.md). This file expands
each increment into logical commits, acceptance and rollback. Only work explicitly
checked below has been performed; other candidates/tests remain planned. Split further if a commit cannot
be reviewed or reverted independently; do not make large directory deletions first.

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

Session 02 implemented and checked the source boundary; **step 2 remains in progress**.
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
- [ ] Allowlist consistency/policy: root's preserved onnxruntime-node/msgpackr-extract
  entries differ from the canonical list. Actual guard FAIL exit 1. No automatic
  trust expansion/removal or weakened check. **BUILD-02-TRUST** review is complete:
  [policy options/evidence](enterprise-local/handoffs/BUILD-02-TRUST.md), P09 recommends
  removing only root extras while preserving Bun JSON/plugin/lock. Owner choice and
  BUILD-02-TRUST-APPLY remain pending; no reconciliation applied or new guard PASS.
- [ ] OS-offline/complete child-traffic evidence, clean source/dependency closure,
  root-lock provenance and full reproducibility remain open. Node instrumentation
  observed no install/lock/deploy/socket event, but Vite invoked net use and native/
  shell coverage is incomplete. Do not label this full no-egress acceptance.

Worker self-contained runtime-hook fixture and full suites were not run. No services,
AWS, runtime repair, registration, fresh acquisition or real user state were used.
Retain viewer and memory/project/worktree semantics. Steps 3+ are not started here.

Rollback: revert `153a9953c` for build wiring (then do not run the restored acquiring
build); `705cd1dc9` is an independent test-only revert. No generated delta to undo.
Keep user baseline commits/dependencies/data. Dependency-policy/pinning work is a
separate concern after review; no reinstall merely to obtain a green guard.

## 3. Hosted setup and historical import removal

Candidates: remove hosted intent/import route + clients; remove related browser setup,
registration/trial UI and remote work-view actions with callers. Keep local memory API.
Acceptance: legacy URLs/tokens cannot create a remote request; local capture/search
still works; generated runtime closure has no reachable hosted client. Planned validation:
adapt `tests/npx-cli/browser-setup*.test.ts`, `tests/worker/http/routes/setup-*.test.ts`,
`tests/work-view/hosted-intent.test.ts`; replace hosted expectations with rejection tests.
Rollback: revert paired caller/client change, preserving test database.

## 4. Telemetry removal with diagnostics preserved

Candidates: remove worker sink/jobs/logger exception bridge; remove CLI sink/commands;
defer shared package pruning to step 10. Acceptance: useful local logs, no upload or
flush on boot/capture/error/exit. Planned validation: targeted `tests/telemetry/`, CLI
tests and later process-tree traffic. Rollback: revert source concern only.

## 5. Cloud removal with local indexing intact

Candidates: remove cloud push/pull/realtime/routes/lifecycle; stop remote outbox
production while preserving SQLite schema/device compatibility and Chroma synchronization.
Acceptance: old token/hub settings inert, no remote client; durable events and index
rebuild/restart preserved. Planned validation: DatabaseManager/SQLite/sync fixtures,
including `tests/services/sync/chroma-sync-reconcile.test.ts`. Rollback: preserve data;
revert source, no destructive down migration.

## 6. Bedrock-only observer

Candidates: strict provider/runtime/model/base-URL validator; explicit allowed environment
and no OAuth/direct-key substitution; cover session and standalone SDK invocations;
remove quota/gateway provider switching and preserve bounded retries/isolation.
Acceptance: absent/invalid/expired auth fails visibly without alternate provider;
required approved proxy/CA/AWS config preserved; recursive hooks prevented. Planned
validation: `tests/supervisor/env-sanitizer.test.ts`, `tests/worker/provider-dispatch.test.ts`,
`tests/claude-provider-*.test.ts`, SDK option tests. Real Bedrock evidence waits for
step 11 and approved privacy rules. Rollback: revert source artifact, retain pending events.

## 7. Offline Chroma and model

Candidates: reviewed Python/model dependency manifest and hashes; replace uvx with
absolute local executable/argument-array spawn; reject remote Chroma and embedding
providers; enforce telemetry disable; validate model presence and process lifecycle.
Acceptance: local cold-cache index/query/restart without downloads; missing asset fails
clearly; no orphan processes. Planned validation: `tests/services/sync/chroma-mcp-manager-*.test.ts`,
embedding-function tests and `tests/integration/chroma-windows-lifecycle.test.ts`.
Never clear a real user's cache; use disposable fixtures. Rollback: retain canonical
SQLite and rebuild derived Chroma using a compatible model/version.

## 8. Local API/viewer boundary; preserve memory behavior

Candidates: reject non-loopback/config overrides, retain existing Host/Origin guards,
review sensitive routes and bundle viewer assets locally. Keep the local browser viewer.
Do not rewrite capture, project/worktree identity, sharing, optional query filtering or
retrieval semantics. Existing scope weaknesses are deferred, not acceptance failures
for this release. Preserve current privacy controls; a new capture/DLP subsystem is not
scheduled. Review allowed payloads before real Bedrock testing and separately surface
any policy incompatibility requiring a behavior change.
Acceptance: no unapproved remote API/assets, local viewer works, existing memory behavior
has no regression caused by egress removal. Planned validation: existing project/MCP/
retrieval regression tests and targeted local HTTP/viewer tests; no new isolation
guarantee. Rollback: revert the isolated boundary change; no identity/data migration.

## 9. Deterministic private Windows plugin

Candidates: private plugin ID and absolute bundle-local launcher/MCP/hook paths;
remove Bash Setup/cache fallback/self-repair downloads/runtime compile; local PowerShell
preflight/install/uninstall/verify with dry-run and rollback. Change generator sources
alongside generated manifests. Acceptance: stale upstream coexistence cannot redirect
execution; spaces/Unicode work; missing tools produce errors; no registry/marketplace
mutation at session start. Test approved disposable profile only. Rollback: restore
documented test registration; preserve both existing upstream data and fork data.

## 10. Minimal packaged closure

Candidates: remove unused non-Claude/server/custom-provider runtime and connectors
from reachable entrypoints; prune dependencies and regenerate reviewed locks; generate
clean worker/MCP/UI artifacts with provenance. Reachability review comes before bulk
folder removal; keeping non-shipped upstream source may reduce maintenance risk.
Acceptance: no stale prohibited clients in runtime closure; hashes/build inputs recorded;
no external viewer asset loads. Planned validation: bundle self-contained tests,
postinstall allowlist checks after authorization, artifact/source closure inspection.
Rollback: restore matched source+lock+artifact set, never mix old/new bundles.

## 11. Integrated acceptance

Candidate: `test: add offline and approved Bedrock acceptance evidence`.
Run appropriate existing tests plus meaningful negative cases above, then two environments:
fully offline with fake observer; approved Bedrock/auth with synthetic payloads and
process-tree DNS/connection evidence. Include cold cache, concurrent sessions, crash
recovery, queue replay, history retrieval and viewer. IP §7 T01–T45 is a source checklist,
adapted to A06/A07: project/worktree/capture cases verify preserved behavior, not newly
invented isolation or DLP guarantees. Record deferred weaknesses instead of making them
release blockers; add missing egress cases rather than assuming broad suites cover them.
Acceptance: exact tested artifact/source/locks/model hashes, logs sanitized, unexplained
destination blocks release. A TCP snapshot is insufficient. No code rollback needed
for a failed test; diagnose and fix the isolated owning change.

## 12. Distribution and operational handoff

Candidates: offline Windows bundle and checksums/SBOM/notices; installation/Bedrock/
Chroma/retention/support/rollback docs; clean-profile install/uninstall/reinstall check.
Acceptance: final signed/approved artifact where required, policy-compliant deployment,
data-preserving rollback, manual upstream security-update process. Rerun installation
acceptance on the exact final bundle; no automatic production migration or push/release.

## Validation discipline

Every future commit records tests actually run, blocked checks and evidence limits in
the worklog. Existing tests are leads, not baseline passes. Tests can invoke subprocesses
and network too: inspect fixtures and lane definitions before execution. Use fresh
isolated home/data/model-cache paths and synthetic content. Authorization is bounded
by the current user launch and [handoff](enterprise-local/memory/STATE.md). Session 02
compile/focused results above are completed evidence; BUILD-02-TRUST performed only
read-only review/docs. Other checks remain planned unless explicitly recorded as run.
