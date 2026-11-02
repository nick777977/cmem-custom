# PLAN-ADAPT-05 — flexible LLM routing and staged runtime/CI validation

2026-11-02. Documentation-only user launch; one coordinator, serial.
Branch feat/cmem-light-local; clean inspected entry
48feeab567995de81d501b74007694b5ee95a880. Local documentation commit follows in Git.
Application source/tests stay S 0abd4180b1971802d7939acba04d46960c4e8c14;
paired generated stays G 6bb7c6995ea47e92ae0176bc88eac75bae871290.

## User outcome and accepted correction

The owner can choose which provider, model and auth route performs each model task,
with one default and explicit advanced overrides, instead of being limited to
Claude through Bedrock. Bedrock is likely the first intended route, not compulsory.
Keep supported Claude/Codex/API integrations and useful local behavior. No hidden
third model/provider/account/gateway, required CMEM registration/subscription,
telemetry, cloud corpus sync or runtime acquisition.

A19 replaces Bedrock exclusivity in A07/P02/initial-plan W4. A20 adds real compiled-
process smoke and CI/local E2E checkpoints without mistaking mocks/compile for runtime
acceptance. Both are target requirements, **not implemented or tested by this session**.
Original source/INITIAL-PLAN.md and historical source-pinned handoffs remain intact.

## Review conclusions

It is not too late: the existing SelectableProvider union still includes Claude,
Codex, Gemini, OpenRouter and OpenAI-compatible; step 6 provider removal was not
implemented. Existing telemetry/hosted removal and local-Chroma refusal do not need
reverting. Keep those boundaries. This change does not restore remote Chroma,
remote embeddings, hosted signup or automatic provider fallback.

There are independent inference surfaces beyond the main observer. Source review
identified both Claude SDK call sites, summary tier selection, field compression,
Codex app-server auth/isolation, refresh's usable-agent fallback loop and separate
copy/request/focus-judge wiring. All require shared explicit policy. Retaining files
alone is not evidence that every provider supports every role or login method.
Codex's present app-server adapter rejects API-key login; direct compatible HTTP is
a separate route. No specific model IDs, protocol expansions or universal SSO are promised.

Local memory and model inference are separate. SQLite/viewer/spool remain local;
Chroma's approved local embedding model is distinct from a selected summarization LLM.
Own local mcp-search and Chroma MCP remain; no external MCP service is required by the
new target. Third-party code/weights running locally are still artifact dependencies
requiring provenance/offline checks. Host MCP/tools must not leak into observer.

## Canonical contracts and consistency updates

- [LLM-PROFILES](../LLM-PROFILES.md): explicit profile/auth/destination/model,
  role inheritance/overrides, effective safe status, adapter compatibility, no implicit
  fallback/default/probing, legacy refusal/migration guidance, MCP boundaries and source
  citations. Initial design is minimal reuse of current settings/transports, not a
  mandatory new config schema/framework. No automatic user-state migration.
- [VALIDATION](../VALIDATION.md): completed evidence vs V0-V6 planned levels, early
  actual compiled-entrypoint tests, synthetic process/env/cleanup controls, mock-LLM
  E2E with actual approved local Chroma, separate live-provider rows, exact-install
  acceptance and fork CI/runner policy. Bedrock currently unavailable, not certified
  by a mock or by another backend. U1/D9 assets still block actual Chroma E2E.
- [Roadmap](../../roadmap.md): still 12 numbered steps; 6 now profile routing for all
  retained model jobs, 9 adds reusable early process/CI harness authoring, 10 retains
  required adapters and finalizes artifact/CI, 11/12 require per-route runtime/install
  evidence. Added explicit 6 -> 8 dependency for profile settings/status contract.
  Existing wave order retained; test checkpoints belong inside steps, not a new tree.
  Step 1 status reconciled with TASKS: bounded static audit done, broader gates open.
  Step 10 size S -> M provisionally reflects retained-provider/CI/provenance scope.
- PATCH-SEQUENCE/architecture/inventory/risks now match A19/A20. E06/E07/E20 policies
  retain explicit routes; E12 distinguishes CMEM bootstrap/signup from supported native
  provider auth. E16 remote-memory server and E22 outbound connectors remain separate
  removals; no blanket deletion of non-Claude modules. Audit/baseline receive clearly
  labelled current overrides, preserving original findings/source citations.
- AGENTS/README/STATE/TASKS/DECISIONS/DEV-ENVIRONMENT/current session templates and
  NEXT-SESSION aligned. No active instruction should prune retained adapters as
  Bedrock-only work. New contracts are linked from the entrypoint and task context.

## Why tests/compile are necessary but insufficient

TELEMETRY-04 ran 206 real tests/728 assertions and one real compile, not just source
inspection. Earlier hosted/Chroma/compile results remain valid within their scopes.
They did not exercise the current full compiled worker/MCP/host lifecycle, actual
Python/local index, real model auth or exact installed memory path. Root typecheck
was not run in this adaptation; viewer's build-time typecheck is not that gate.

Plan now requires actual generated-entrypoint smoke early, then fake loopback LLM
requests through real compiled routing/storage/index/restart/viewer with approved
local assets, and actual live tests for profiles intended for regular use. CI should
reuse the same bounded commands with exact tools, isolated state and no live PR
credentials. An unavailable job/asset/profile stays NOT RUN/BLOCKED, not green PASS.

Upstream CI was inspected only. ci.yml currently uses Node 20, Bun latest, npm install
and broad test lanes; windows.yml downloads Bun and installs dependencies. These are
not approved fork CI defaults. D12 explicitly gates runner inputs/location/network /
control plane and hosted code/artifact uploads. Author a minimal reusable lane under
step 9; no runner provisioning, actions dispatch, push or workflow execution now.

## Inspected source evidence

All citations below are static at **48feeab567995de81d501b74007694b5ee95a880**.
Contracts contain fuller targeted callsite lists; no installed user assets were read.

| Path:line | Meaning |
|---|---|
| src/services/worker/provider-dispatch.ts:59,116,406 | Existing provider choices and implicit quota selection |
| src/services/worker/ClaudeProvider.ts:501,1079 | Separate main/standalone SDK sends |
| src/services/worker/OpenAICompatibleProvider.ts:548,634-641 | Compression and separate summary model configuration |
| src/services/worker/CodexAppServerClient.ts:167,187,376-377 | MCP isolation / current ChatGPT-only login constraint |
| src/services/agent-runner/run.ts:103,328 | Auto-detection/fallback for background agent runs |
| src/services/worker/http/routes/WorkViewRoutes.ts:301,339,380 | Separate copy/refresh/judge entrypoints |
| src/services/work-view/request-judge.mjs:176,190 | Configured and hardcoded OpenRouter judge path |
| src/services/work-view/human-copy-worker.mjs:63,96 | Separate compatible HTTP client with fallback model body |
| src/sdk/hardened-options.ts:233,241-243 | Preserve observer tool/MCP/settings isolation |
| .github/workflows/ci.yml:18,23,30,44,50 | Upstream tool versions, acquisition, typecheck and build |
| .github/workflows/windows.yml:23,30,34,37,39 | Windows runner/tool range and acquisition |
| tests/infrastructure/worker-bundle-self-contained.test.ts:25,32,38-39 | Existing emitted-hook fixture is a reuse lead but inherits parent env |

## Boundaries and rollback

Only planning/memory Markdown files changed; no application/test/generator/workflow /
package/lock/trust/generated output changed. Installed inputs were not written,
inspected or rehashed in this docs-only session; no installed-tree preservation proof
is newly claimed. No tests, typecheck,
compile, runtime/services/worker/MCP/plugin, Python/model, real credentials/settings /
memory, live provider/auth/AWS, downloads/install/update/lock resolution, CI job /
runner/upload, push, branches/worktrees or subagents. Read-only Git/source/workflow
inspection and local document checks/commit only. No claim of implemented security,
working profiles, green fork CI, full no-egress or release readiness.

Rollback this documentation commit only restores the previous target instructions;
do not revert S/G or completed hosted/telemetry/Chroma protections. No data migration,
artifact regeneration or installed-state cleanup needed. Do not restore obsolete
Bedrock-only instructions without a new explicit user policy decision.

## Next single launcher

[WINDOWS-09 source/harness increment](../NEXT-SESSION.md): deterministic private paths,
preflight/refusal, preserve all A19 adapters and author reviewed V3/fork-CI sources.
One reviewed compile after application changes and reviewed inert/mock checks when
explicitly launched; no actual built process/CI/live model run under that source
prompt. Finish source prerequisites and emit a concrete subsequent process-smoke
launch with exact artifact/env/process/port/cleanup scope. If source work needs a
continuation, record it honestly. No source/runtime task begins in this adaptation.

## Actual document validation and closure

Static document validator PASS: 19 changed/new Markdown files, 123 relative file links,
balanced code fences, no replacement characters, whitespace clean. Fifteen exact source /
workflow line assertions rechecked at entry SHA. Scope check confirms zero source/test /
generator/workflow/package/lock/generated delta. Six prior tracked handoffs and supplied
INITIAL-PLAN bytes match entry. Roadmap remains 12 numbered steps; edge diff is exactly
added s6 -> s8, no removed edges. Entry branch/HEAD rechecked; no user WIP overwritten.
Validator first found a missing explicit A20 identifier in README, corrected before final
PASS; new source/CI citations were tightened to actual command lines. No application
runtime or test claim derives from these checks. Disposable validator/report under
.scratch/enterprise-local/plan-adapt-05; conclusions persist here and WORKLOG.

STATE/TASKS/WORKLOG/DECISIONS/contracts/environment/NEXT-SESSION closed; all reservations
released, WINDOWS-09 ready-unclaimed. Documentation commit follows in Git history.
Source/generated bytes stay at S/G above; no next-task execution or push.

Final manual review also found and replaced the obsolete active short BUILD-02-TRUST
launcher at the bottom of SESSION-PROMPTS with the current WINDOWS-09 source scope.
Historical completed templates remain labelled; no completed task is relaunched.
