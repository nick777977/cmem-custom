---
status: living
updated_at: 2026-11-09
---

# Enterprise local memory roadmap

This decomposition does not authorize execution. Current handoff: [STATE](enterprise-local/memory/STATE.md).
A19/A20 supersede the former Bedrock-only target; original supplied requirements and
source-pinned historical reports remain audit evidence, not current instructions.

## Destination

A private Windows local-first memory plugin retains Claude Code/Codex integrations,
existing memory/viewer behavior, canonical SQLite/FTS5 and offline persistent Chroma.
Every model task uses an explicit user-selected provider/auth/model profile, with
visible role overrides and no hidden model/account/gateway fallback. It installs
reversibly from a verified bundle with functional and egress evidence for the tested
configuration. Bedrock is a likely initial profile, not the sole supported backend.

Scope contracts: [LLM profiles](enterprise-local/LLM-PROFILES.md),
[build/runtime/CI evidence](enterprise-local/VALIDATION.md). These expand requirements;
this file alone owns task dependency edges and execution waves.

## Steps

Sizes are provisional. Done-bounded means a documented source/testing boundary;
no implementation step is shipped and unavailable runtime evidence remains open.
IP = [preserved initial plan](enterprise-local/source/INITIAL-PLAN.md), overridden by
A06/A07/A19/A20 where indicated. Source/runtime statuses are deliberately separate.

| # | Step | Source / current authority | Size | Status |
|---|---|---|:---:|---|
| 1 | Close static audit and agree runtime/artifact contract | IP P0/P1; A19/A20; inventory | S | bounded audit done (AUDIT-01); broader policy/artifact/runtime closure remains assigned below |
| 2 | Compile locally without install, sync or restart | IP W8; A11/A14/A15 | S | boundary accepted for source progression; release provenance/OS evidence pending in 10/11/12 |
| 3 | Local memory without hosted setup/history import | IP W1; A16 | S | done-bounded; HOSTED-03 S 417483949 / G 298d44742, 58 tests + compile PASS |
| 4 | Local diagnostics without remote telemetry | IP W2; A18 | S | done-bounded; TELEMETRY-04 S 0abd4180b / G 6bb7c6995, 206 tests + compile PASS |
| 5 | Local SQLite/Chroma without cloud sync | IP W3; A27 | S | done-bounded for local worker. Legacy credentials and queues inert in compiled loopback checks. Real Chroma activation remains step 7. [CLOUD-05](enterprise-local/handoffs/CLOUD-05.md) |
| 6 | User-controlled LLM profiles for every retained model task | A19; LLM-PROFILES replaces IP W4 Bedrock-only | M | not started; reuse existing adapters; split PROFILE-06A/06B if needed |
| 7 | Chroma retrieves from verified local runtime/model assets | IP W5; A17 | M | source refusal done-bounded, S 8fa997979 / G b8734d9b2, 127 tests + compile PASS; activation/contract U1/D9 open |
| 8 | Local API/viewer and safe effective profile settings | IP W7; A06/A07/A19 | S | not started; retain identity/sharing/filter/capture/retrieval behavior |
| 9 | User-level Windows local build/setup and host integration | IP W6; A20/A21-A28 | M | done-bounded for private Codex CLI on Windows x64. ef815b29a verified local catalog, worker, SQLite MCP save/search, viewer, matching-host copy and uninstall without admin/UAC. Desktop and Claude host acceptance remain open. |
| 10 | Approved retained-provider runtime closure and reproducible fork CI/artifact | IP W8; A19/A20 | M | not started; preserve needed SDK/Codex/API adapters, prune proved-unused closures only |
| 11 | Exact-artifact local E2E, egress and selected-profile acceptance | IP P6/P7; A20 | M | not started; mock/offline checks independent of Bedrock availability; live rows separately gated |
| 12 | Verified Windows bundle, SBOM, install/rollback and profile runbook | IP P8; A19/A20 | S | not started; deployment requires the intended profile's actual live evidence |

## Phase-one delivery route (A27, 2026-11-04)

One practical end-to-end target using the existing numbered steps, no new pipeline:

1. Step9: make user-level dependency preparation/bootstrap, local build paths and
   Codex local integration work. Inspect selected inputs/scripts first; no UAC,
   machine PATH/registry/system services or public marketplace/CMEM account. Preserve
   Claude Code host support. Replace deliberate refusals with actual local behavior.
2. Steps5/6: finish cloud-sync removal and explicit role/model/auth routing; reuse
   Codex ChatGPT-login and Claude/Bedrock/AWS SSO adapters. Local Codex tests must not
   hardwire the product to OpenAI. Keep existing memory/viewer semantics.
3. Step7: choose/install a compatible user-local Python/Chroma/embedding closure,
   disable telemetry, load embeddings locally and fix actual compatibility errors.
   Downloads during setup are allowed; missing assets get actionable setup errors.
4. Step8 and checkpoints in9/11: real compiled startup, MCP and worker lifecycle,
   capture -> SQLite -> selected-model observation/summary -> Chroma index/search ->
   restart -> retrieval/viewer, using disposable data and owned-process cleanup.
5. Steps10/12: package the local build and prerequisites with a reproducible user-level
   setup/run/rollback guide; validate transfer on matching Windows/architecture/runtime.
   Corporate Bedrock/SSO live proof happens in the authorized corporate environment.

Necessary dependency/runtime/model acquisition and local host configuration are
allowed parts of setup. Strong Job/AppContainer/WFP/DNS/crash-proof containment,
CI provisioning/hosted publishing and exhaustive release provenance are deferred
from first functional acceptance. Ordinary deadlines/cleanup and no unapproved
memory/telemetry/model fallback are retained. No SQLite-only substitute for Chroma.
Current Codex login is authorized for minimal synthetic live tests; exact model and
budget must be proposed first. PHASE1-ALIGN only checked native login presence after
authorization; no inference or manual credential-file inspection.

Completed evidence and input-preservation limits remain in [DEV-ENVIRONMENT](enterprise-local/DEV-ENVIRONMENT.md)
and the HOSTED-03 / CHROMA-07 / TELEMETRY-04 handoffs. Do not repeat completed source
work. Chroma refusal is not operational activation; step 10's local artifact/model
contract prerequisite is still open. D11 does not become a SQLite-only product mode.

## Validation checkpoints during development

Tests, compile and bounded Windows private Codex lifecycle have run. Full
release-artifact install and live model access remain open. Use runtime feedback
within the remaining increments:

- Step 9 has historical mock runner and CI source evidence. WINDOWS-09-LOCAL
  adds real compiled worker and Codex/MCP checks in a dedicated installation.
  The formal release and CI lanes remain separate.
- Steps 5/6/8 run affected V1/V2 checks and, when authorized/safe, relevant V3 slices.
  Step 6 proves profile routing/no-send failure behavior without cloud accounts.
- Once 5/6/7/8/9 prerequisites are available, V4 runs real local memory/index/restart
  with a loopback fake LLM. Approved local Chroma assets remain necessary.
- Step 10 finalizes exact closure and CI pinning/provenance; step 11 tests those exact
  bytes. V5 live evidence is per provider/auth/model; unavailable Bedrock stays pending.
- Step 12 verifies the exact installable bundle and rollback. A mock-backed green CI
  is useful confidence, never a substitute for live evidence of a route used in production.

All checks require reviewed fixture/env/subprocess behavior and the applicable launch.
No CI runner provisioning, hosted upload, push, live credentials or service start is
implied by adding checkpoints. [VALIDATION](enterprise-local/VALIDATION.md) owns levels,
commands-to-review, fixture requirements, failure labels and acceptance criteria.

## Scope and implementation economy

Retain existing provider/SDK implementations and host integrations where they meet
explicit selection and isolation. Do not create a provider framework, new secret store,
new database architecture or replacement UI. One default profile plus optional role
selection is the initial flexible configuration; no automatic host/project inference.
Every model task, including background jobs, shares enforcement. Unsupported adapter /
auth/protocol/model combinations fail visibly; no promise of universal compatibility.

No mandatory CMEM registration/subscription, hidden free model, external MCP service,
cloud corpus sync, telemetry or runtime acquisition. An intentionally chosen external
LLM/auth service is allowed under its explicit profile; third-party local libraries /
embedding weights need approved artifacts, not remote subscriptions. Extra interactive
host tools are separate from the plugin's isolated observer tool surface.

Out of scope remains a remote/multi-user memory server, automatic historical migration,
organization policy changes, fully offline generative inference as a requirement,
project/worktree identity redesign, mandatory new query filters or a new capture/DLP
subsystem. Existing weaknesses are deferred per A06. Local embedding inference remains
required; this is separate from the selected summary LLM.

## Open decisions

| ID | Question | Owner | Blocks |
|---|---|---|---|
| D1 | A27 permits required dependency/tool/model downloads; choose compatible versions and official or enterprise-approved sources, document lifecycle. CI runner policy remains D12 | agent; user supplies enterprise restrictions if applicable | concrete dependency setup, 7/10/12 |
| D2 | Allowed stored/LLM payloads per enabled profile and role? | human | real data/live tests, 8/11 |
| D5 | A28 verifies dedicated Codex CLI local catalog and rollback. Confirm desktop and Claude Code local directory loading and target coexistence on their intended hosts | agent; user-level target scope | remaining host and packaged acceptance, 11/12 |
| D7 | Exact selected profile(s): auth mode, endpoint/Region, model, proxy/CA and allowed infrastructure? No secrets in docs | human | actual live provider rows, 6/11 |
| D8 | Approved local data location, retention/backup rules? | human | deployment, 8/12 |
| D9 | Select/test compatible Python/Chroma/local embedding packages and versions; record source/license/hash/API as engineering work under A27 download permission, no manual user-supplied ABI required | agent | functioning local Chroma, 7/V4/10/12 |
| D10 | Complete remaining dynamic clients/entrypoints/connectors and retained-provider closure? | agent | 1/10 |
| D11 | Missing Chroma may enter explicitly visible SQLite-only degraded product mode? Still unselected | human | proposed product-mode change, 7/11 |
| D12 | Approved CI execution location, runner inputs/network/control plane and artifact retention? | human | actual CI provisioning/execution and hosted uploads, 9/10 |

These are scoped gates, not a new up-front interview. Bedrock is unavailable now;
continue source, fixtures and isolated process test preparation. Do not invent a model,
account or auth permission; do not request a credential dump. Per-profile live checks
remain pending until explicitly available. D9 research still requires artifact-read
permission; installed files alone are not permission.

## Decisions and retained evidence

[A19/A20](enterprise-local/memory/DECISIONS.md) supersede Bedrock exclusivity and add
staged runtime/CI requirements. A01/A02 branch/memory, A06/A07 local behavior and egress
scope, A09 toolchain, A11/A14/A15 compile boundary, A16/A17/A18 remain in force within
their documented bounds. The original plan and historical evidence are not rewritten.

## Dependency graph

Single source of dependency edges. Compared with the prior plan, step 6's outcome is
profile policy for all retained adapters, step 10 retains that closure, and step 11
validates selected routes. New 6 -> 8 edge represents effective profile settings/status
contract needed before finishing the local API/UI boundary; no extra numbered step.
Early validation checkpoints are work inside their owning increments, not permission
or a duplicate execution graph.

~~~mermaid
flowchart TD
  s1["1 Audit and contract"] -->|reviewed entrypoints and artifact policy| s2["2 Pure compile boundary"]
  s2 -->|build without reinstall or deploy| s3["3 Remove hosted setup"]
  s2 -->|validate transport removal| s4["4 Remove telemetry"]
  s2 -->|validate database and index wiring| s5["5 Remove cloud sync"]
  s2 -->|validate retained adapters| s6["6 Explicit LLM profiles"]
  s2 -->|user-level local runtime and model setup| s7["7 Local Chroma"]
  s2 -->|preserve local API and viewer| s8["8 Local API and viewer"]
  s6 -->|effective profile config and safe status contract| s8
  s2 -->|deterministic local build and host setup| s9["9 User-level Windows setup"]
  s3 -->|hosted closure removed| s10["10 Retained runtime closure and fork CI"]
  s4 -->|telemetry closure removed| s10
  s5 -->|cloud closure removed| s10
  s6 -->|all model roles and retained adapters finalized| s10
  s7 -->|Python and local model contract finalized| s10
  s8 -->|API and viewer boundary finalized| s10
  s9 -->|local host integration and bounded lifecycle verified| s10
  s10 -->|test exact packaged entrypoints| s11["11 Exact-artifact E2E and profile evidence"]
  s11 -->|functional and egress evidence for intended profiles| s12["12 Release and rollback"]
~~~

## Execution path

One coordinator, serial on the selected branch. Parallel symbols below describe
independent zones, not permission to start agents/worktrees. Shared settings/worker /
generator/index integration is always serialized. Runtime sublaunches need their
own concrete reviewed scope and cleanup/evidence contract.

| Wave | Steps | Owned zone / checkpoint | Unlocks |
|:---:|---|---|---|
| 1 | 1 | Existing audit/contracts; targeted new deltas only | Agreed evidence/policy |
| 2 | 2 | Existing scripts/compile boundary, retain inputs | Safe compile |
| 3 | 3 and 7 | Hosted done; Chroma source refusal done, activation awaits D9 | Hosted-free core and eventual local-index candidate |
| 4 | 4 and 9 | Telemetry done; Windows launcher/generators/CLI preflight; author synthetic process/CI runner, scoped early V3 when launched | Deterministic entrypoints and quick runtime feedback |
| 5 | 5 | DatabaseManager/CloudSync/SyncClient/routes and worker; V1/V2, safe V3 slice | Local data without cloud sync |
| 6 | 6 | Existing providers/dispatch/env/settings/roles and effective status; PROFILE-06A then 06B if needed; V1/V2/V3 | All model tasks obey explicit profiles |
| 7 | 8 | Worker API/viewer network and profile settings presentation, identity semantics retained; V3/browser checks | Local-only interface with visible routing |
| 8 | 10 | Scripts/manifests/locks/artifacts; retained dependency closure, CI pinning/provisioning gate; V4 as prerequisites permit | Reviewed exact artifact |
| 9 | 11 | Exact artifact, disposable local E2E, process-tree/network evidence, separate V5 rows | Tested configuration; unavailable live routes remain pending |
| 10 | 12 | Windows bundle/SBOM/runbook/install/rollback on exact final hashes | Release candidate for validated profiles |

Remaining implementation covers 6/7/8 memory/model/index wiring, followed by
local artifact/E2E/install acceptance in 10/11/12. The
[next implementation prompt](enterprise-local/NEXT-SESSION.md) is PROFILE-06A.
The tested Windows lane and its limitations are recorded in
[WINDOWS-09-LOCAL](enterprise-local/handoffs/WINDOWS-09-LOCAL.md).

## Shipped

None. [WORKLOG](enterprise-local/memory/WORKLOG.md) records actual work;
[VALIDATION](enterprise-local/VALIDATION.md) separates completed evidence from plans.
