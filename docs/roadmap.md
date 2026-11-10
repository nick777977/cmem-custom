---
status: living
updated_at: 2026-11-10
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
configuration. Claude Code with Bedrock remains a separate route to verify.

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
| 6 | User-controlled LLM profiles for every retained model task | A19; LLM-PROFILES replaces IP W4 Bedrock-only | M | Done-bounded for the local worker and request-progress CLI. PROFILE-06A covers observer, summary and field compression. PROFILE-06B covers refresh, copy, judges, knowledge and the Telegram refusal. Step 10 owns separate server/helper admission and step 11 owns live provider evidence. [Evidence](enterprise-local/handoffs/PROFILE-06B.md) |
| 7 | Chroma retrieves from verified local runtime/model assets | IP W5; A17/A27 | M | Done-bounded for Windows x64 with separately staged multilingual MiniLM and persistent synthetic retrieval. [CHROMA-07-LOCAL](enterprise-local/handoffs/CHROMA-07-LOCAL.md). |
| 8 | Local API/viewer and safe effective profile settings | IP W7; A06/A07/A19 | S | Done-bounded for the local viewer on Windows x64. Settings shows effective role choices and Chroma health. A copied worker and browser distinguished missing assets from a passing probe backed by semantic retrieval. [VIEWER-08-LOCAL](enterprise-local/handoffs/VIEWER-08-LOCAL.md) |
| 9 | User-level Windows local build/setup and host integration | IP W6; A20/A21-A28/A31 | M | Codex CLI host check accepted for this delivery. The private Claude Code Windows stage and direct command fixtures are complete. Actual Claude CLI loading and dispatch are step-11 target checks. [CLAUDE-WINDOWS-STAGE](enterprise-local/handoffs/CLAUDE-WINDOWS-STAGE.md) |
| 10 | Pin the compiled files used by the private local install | IP W8; A19/A20; A29/A31 | M | The Codex inventory and SBOM cover that stage and shared Windows x64 inputs. The separate 80-file Claude inventory passed raw-copy and re-binding checks. Refresh it if recovery work changes any staged bytes. [Claude inventory](enterprise-local/artifacts/claude-windows-x64-inventory.json) |
| 11 | Verify local memory, Claude Code CLI and the selected Bedrock route | IP P6/P7; A20; A29–A31 | M | Exact Codex-stage verification is complete for the successful memory path. Implement pending-event recovery. Verify the intended Claude Code host and Bedrock separately in the authorized environment. [Remaining work](#what-remains-in-step-11) |
| 12 | Document regular local setup, updates and data-preserving rollback | IP P8; A19/A20; A29 | S | Pending step 11. Formal packaging and redistribution are optional follow-up work. |

## Phase-one delivery route (A27, 2026-11-04)

One practical end-to-end target using the existing numbered steps, no new pipeline:

1. Step9: make user-level dependency preparation/bootstrap, local build paths and
   Codex local integration work. Inspect selected inputs/scripts first; no UAC,
   machine PATH/registry/system services or public marketplace/CMEM account. Preserve
   Claude Code host support. Replace deliberate refusals with actual local behavior.
2. Steps5/6: finish cloud-sync removal and explicit role/model/auth routing; reuse
   Codex ChatGPT-login and Claude/Bedrock/AWS SSO adapters. Local Codex tests must not
   hardwire the product to OpenAI. Keep existing memory/viewer semantics.
3. Step7: verify `paraphrase-multilingual-MiniLM-L12-v2` first with a compatible
   user-local Python/Chroma runtime. Document the one-time asset preparation
   separately from the fork install. Verify bilingual retrieval and restart
   offline with synthetic memory records. Missing assets get actionable setup errors.
4. Step8 and checkpoints in9/11: real compiled startup, MCP and worker lifecycle,
   capture -> SQLite -> selected-model observation/summary -> Chroma index/search ->
   restart -> retrieval/viewer, using disposable data and owned-process cleanup.
5. Steps 10/12: identify the files the local install uses and finish the user-level
   build, setup, update and rollback instructions. Verify Claude Code with Amazon
   Web Services (AWS) Bedrock and corporate single sign-on in its authorized
   environment. A bundle for redistribution is a separate deliverable if requested.

Necessary dependency/runtime/model acquisition and local host configuration are
allowed parts of setup. Continuous integration (CI) means running checks
automatically on a separate machine through a workflow. The local path runs the
required checks directly. CI, hosted publishing, exhaustive distribution
provenance and stronger operating-system containment are outside this local
completion path. Ordinary deadlines, cleanup and limits on network use still
apply. Chroma is part of full local acceptance.
Codex CLI has supplied the local host baseline. Claude Code CLI on the
intended Windows instance is the second host. Its interactive Bedrock
settings and the worker's generative profile are separate choices. The
Claude plugin preparation is complete on the development Windows machine.
Use simulated worker generation for the
separately scoped host test. Any live worker check needs an explicit model,
auth route and budget.
[A31](enterprise-local/memory/DECISIONS.md#a31--accept-the-codex-cli-check-and-target-claude-code-on-windows-2026-11-10).

Completed evidence and input-preservation limits remain in [DEV-ENVIRONMENT](enterprise-local/DEV-ENVIRONMENT.md)
and the HOSTED-03 / CHROMA-07 / TELEMETRY-04 handoffs. Do not repeat completed source
work. Step 10 pins the Codex artifact and shared Windows x64 Chroma inputs
and records the Claude stage's separate receipt.
A SQLite-only product mode (D11) stays outside current scope. The local setup
reports missing Chroma assets and preserves SQLite data.

## What remains in step 11

| Check | Status and impact |
|---|---|
| Exact Windows build and successful local memory flow | **Verification complete.** The staged build captured synthetic tool events and stored observations and a summary in SQLite. The local MiniLM encoder and real Chroma supported semantic retrieval after restart. MCP, viewer and cleanup were exercised. |
| Recovery of events waiting for generation | **Failed. Implementation required before daily use.** Two events stayed in the in-memory queue after a simulated 401 and redirect, then disappeared on graceful stop. Committed SQLite records and the derived index survived. Verify whether the intended host's existing transcript/spool can support a deliberate recovery operation under the current capture policy. Implement the smallest verified path. Check restart, exactly-once storage when recovering, and no automatic resend after an ambiguous provider outcome. |
| Private worker auth endpoint | **Separate defect.** The retained local endpoint returned HTTP 500 when it loaded Better Auth from the checkout. Hook capture, MCP, local search and viewer worked independently. Resolve the route before relying on it. |
| Codex CLI host | **Accepted.** Reuse the private CLI install, hook discovery, MCP and removal evidence. Codex Desktop is outside the current scope. Repeat affected CLI regressions if shared runtime or staging changes. |
| Claude Code CLI on Windows | **Pending target runtime.** The bound local stage and receipt passed steps 9 and 10 fixtures. Verify the intended CLI's actual version, managed policy, loading, hook dispatch and project/worktree behavior in a separately authorized runtime launch with simulated worker generation. |
| Bedrock in the corporate environment | **Separate checks.** Confirm Claude Code's interactive Bedrock route and test the worker's explicit Bedrock profile if that profile is selected. Record model, AWS profile/region, SSO behavior and approved scope for each. Keep embeddings and storage on the Windows instance. |

The local synthetic workflow is called V4 in the validation contract. Its full
matrix also includes worktree sharing, more provider failure modes and index
failure. The [verification handoff](enterprise-local/handoffs/VERIFY-11-LOCAL.md)
lists the cases actually executed and the coverage limits.

## Validation checkpoints during development

Tests, compile and the bounded private Windows Codex lifecycle have run.
The local success path is verified on the pinned candidate. The full local
validation matrix and intended host checks remain open as described above.
Use runtime feedback within the remaining increments:

- Step 9 has historical mock runner and CI source evidence. WINDOWS-09-LOCAL
  adds real compiled worker and Codex/MCP checks in a dedicated installation.
  The formal release and CI lanes remain separate.
- Steps 5/6/8 run affected V1/V2 checks and, when authorized/safe, relevant V3 slices.
  Step 6 proves profile routing/no-send failure behavior without cloud accounts.
- Once 5/6/7/8/9 prerequisites are available, V4 runs real local memory/index/restart
  with a loopback fake LLM. Approved local Chroma assets remain necessary.
- Step 10 identifies the tested build. Step 11 exercises those files locally.
  Actual provider tests (V5) apply to each selected provider, login and model.
  The Bedrock check runs separately when the authorized environment is available.
- Step 12 finishes setup and rollback for daily use. If a transferable distribution
  is requested, verify that package separately on its intended target.

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
| D5 | A28/A31 cover the Codex CLI target. Confirm private Claude Code CLI loading, managed policy and coexistence on the intended Windows instance. | agent; user-level target scope | Claude Code host acceptance, 9/11/12 |
| D7 | Choose a generative worker profile and approved auth/destination if a live test is requested. The local embedding model is already selected. | human | only the applicable live provider rows, 11 |
| D8 | Approved local data location, retention/backup rules? | human | deployment, 8/12 |
| D9 | Resolved for the tested Windows x64 Chroma/MiniLM stack. Versions, sources, hashes, licenses and APIs are in [CHROMA-07-LOCAL](enterprise-local/handoffs/CHROMA-07-LOCAL.md). | agent | exact release closure and transfer, 10/12 |
| D10 | Complete remaining dynamic clients/entrypoints/connectors and retained-provider closure? | agent | 1/10 |
| D11 | Optional SQLite-only operation when Chroma is unavailable. Deferred for local use | human | only a future change to product behavior |
| D12 | Optional automated checks. Reopen runner and hosted artifact policy if CI is requested | human | only CI provisioning/execution and hosted uploads |

These are scoped gates, not a new up-front interview. Bedrock is unavailable now;
continue source, fixtures and isolated process test preparation. Do not invent a model,
account or auth permission; do not request a credential dump. Per-profile live checks
remain pending until explicitly available.

## Decisions and retained evidence

[A19/A20](enterprise-local/memory/DECISIONS.md) supersede Bedrock exclusivity and add
staged runtime checks. A29 sets CI and distribution aside for local use.
A30 separates the embedding model, host and live worker profile. A31 accepts
Codex CLI coverage and selects Claude Code CLI on the Windows instance.
A01/A02 branch/memory, A06/A07 local behavior and egress
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
  s3 -->|hosted closure removed| s10["10 Verified local build contents"]
  s4 -->|telemetry closure removed| s10
  s5 -->|cloud closure removed| s10
  s6 -->|all model roles and retained adapters finalized| s10
  s7 -->|Python and local model contract finalized| s10
  s8 -->|API and viewer boundary finalized| s10
  s9 -->|private host bindings and staging checks| s10
  s10 -->|test exact packaged entrypoints| s11["11 Exact-artifact E2E and profile evidence"]
  s11 -->|functional and traffic evidence for intended profiles| s12["12 Daily setup, update and rollback"]
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
| 3 | 3 and 7 | Hosted removal and bounded Windows local Chroma activation complete | Hosted-free core and persistent local index |
| 4 | 4 and 9 | Telemetry removal, Windows launcher and early checks of compiled local processes | Deterministic entrypoints and quick runtime feedback |
| 5 | 5 | DatabaseManager/CloudSync/SyncClient/routes and worker; V1/V2, safe V3 slice | Local data without cloud sync |
| 6 | 6 | Existing providers/dispatch/env/settings/roles and effective status. PROFILE-06A then PROFILE-06B, V1/V2/V3 | All model tasks obey explicit profiles |
| 7 | 8 | Worker API/viewer network and profile settings presentation, identity semantics retained; V3/browser checks | Local-only interface with visible routing |
| 8 | 10 | Build scripts, manifests, dependency records and inventory of the local install | Verified local build contents |
| 9 | 9 → 10 → 11 | Claude Code Windows stage and receipt prepared → implement pending-event recovery and re-pin any changed staged files → verify the exact stage on the intended Claude host → verify Bedrock under separate scope | Host loading and recovery evidence, then approved live results |
| 10 | 12 | Local Windows build, install, configuration, update and data-preserving rollback instructions | Daily local use with validated profiles |

The bounded checks for step 8 and the Codex CLI part of step 9 are complete.
Step 9 established the private Codex CLI and worker baseline on Windows x64.
Step 10 pinned and verified the Codex candidate and separate Chroma assets.
VERIFY-11-LOCAL exercised those bytes with real Chroma and a simulated model. The
[next implementation prompt](enterprise-local/NEXT-SESSION.md) covers the
Claude Code Windows staging and its receipt. Actual Claude CLI loading and
Bedrock remain pending on the authorized target.
[Windows CLI evidence and limits](enterprise-local/handoffs/WINDOWS-09-LOCAL.md).

## Shipped

None. [WORKLOG](enterprise-local/memory/WORKLOG.md) records actual work;
[VALIDATION](enterprise-local/VALIDATION.md) separates completed evidence from plans.
