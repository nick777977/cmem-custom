# Reviewable commit and validation plan

Dependencies and waves are owned only by [roadmap.md](roadmap.md). This file expands
each increment into candidate logical commits, acceptance and rollback. No listed
application patch or future test has been performed. Split further if a commit cannot
be reviewed or reverted independently; do not make large directory deletions first.

## Current documentation work

- [x] Baseline, original plan, project-memory entrypoint and operating boundary.
- [x] Static reconnaissance, target architecture, risk register, roadmap and handoff.

## 1. Close audit and runtime contract

Candidate: `docs(audit): close runtime entrypoint and artifact inventory`.
Finish all unchecked P1 items in EGRESS-INVENTORY, reconcile generated entrypoints,
record approved policy values without secrets, and define test data paths and validation
commands by reading scripts. Acceptance: every known reachable capability classified
or explicitly blocked, high-risk unknowns assigned. No source change or install needed.

## 2. Pure compile boundary

Candidates: `build: separate compile from dependency resolution and deployment`;
`build: pin reviewed development and plugin dependency inputs`.
Inspect viewer subprocesses, manifest generators and native lifecycle scripts. Introduce
an explicit compile-only workflow, distinct approved dependency preparation, no sync or
restart. Acceptance later: compile cannot invoke installers, alter plugin registration
or restart services; reproducible lock inputs. Requires explicit install/build permission
and artifact policy before executing anything. Do not assume `--ignore-scripts` means
no network. Rollback: revert build changes; do not alter installed runtime.

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

## 8. Privacy, scope and HTTP

Candidates: capture limits/redaction/exclusions before spool/persistence and observer;
canonical repository/worktree identities and required query scope; local-only runtime
and API validation with existing Host/Origin protections retained; secret-safe diagnostics.
Acceptance: synthetic secrets follow approved policy, same-name repos/worktrees behave
as decided, no unscoped accidental results, non-loopback/config overrides rejected,
destructive routes guarded. Planned validation: `tests/utils/project-name-*.test.ts`,
`tests/servers/mcp-project-cwd.test.ts`, retrieval/HTTP tests, synthetic privacy fixtures.
Rollback: keep identity/schema compatibility map; do not merge or rewrite user corpora.

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
recovery, queue replay, history retrieval and viewer. IP §7 T01–T45 remains the acceptance
queue; add missing cases rather than claiming broad suites cover them automatically.
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
isolated home/data/model-cache paths and synthetic content. Current authorization is
documentation only; all checks above are deferred.
