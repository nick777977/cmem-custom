# Current handoff

Updated: 2026-11-02 after PLAN-ADAPT-05 (documentation only).
Branch feat/cmem-light-local; clean entry 48feeab567995de81d501b74007694b5ee95a880.
Application source/tests remain 0abd4180b1971802d7939acba04d46960c4e8c14;
paired generated remains 6bb7c6995ea47e92ae0176bc88eac75bae871290.
Plan documentation commit follows in Git. Single coordinator, serial; no active work
or reservations after closure. No source/runtime/CI execution in this adaptation.

## Accepted target correction

A19 replaces Bedrock-only with explicit owner-controlled provider/auth/model profiles
for ALL retained model tasks: observer, summary/compression, standalone/knowledge,
viewer refresh/copy/judges. Keep compatible Claude/Bedrock, Claude API/login, Codex
ChatGPT login, direct OpenAI-compatible API and other existing explicitly configured
adapters. One default plus visible role overrides; no automatic model/provider/account
fallback or plugin subscription/signup. No universal auth/model compatibility promise.
[LLM-PROFILES](../LLM-PROFILES.md) is the canonical target, **not implemented yet**.
Do not prune Codex/API/auth support in WINDOWS-09 or step 10 under obsolete instructions.

A20 adds [VALIDATION](../VALIDATION.md): distinguish focused fixtures, real compile /
typecheck, actual compiled-process smoke, fake-LLM local E2E with real approved Chroma,
live per-profile proof and exact-package install/rollback. Author reusable harness/CI
in step 9; add early scoped process checkpoints, finalize fork CI/closure in 10 and
exact-artifact proof in 11/12. Bedrock currently unavailable; mock/process work can
proceed without it, while its live row stays pending. Current launch is docs-only:
no new runtime, runner provisioning, hosted CI upload or live auth permission.

Local viewer, SQLite/FTS5 canonical data, Chroma derived index/local embeddings,
capture/retrieval/project/worktree/sharing/filter semantics remain unchanged (A06).
No new degraded SQLite-only product mode, automatic migration or hidden remote MCP.

## Completed evidence — preserved, not rerun

- Baseline/setup A14/C and pure-compile A15 source progression accepted. OS/full
  runtime evidence stays 11; closure/provenance/reproducibility stays 10/12.
- HOSTED-03 S 417483949 / G 298d44742: E01/E02 retired, 58 tests + one compile PASS.
- CHROMA-07 S 8fa997979 / G b8734d9b2: source refusal, 127 tests + one compile PASS;
  activation still blocked by U1/D9. [Limits](../handoffs/CHROMA-07.md), D11 open.
- TELEMETRY-04 S 0abd4180b / G 6bb7c6995: Node E03/E04 transports/jobs inert,
  local diagnostics retained; 206 tests / 728 assertions + one real compile PASS,
  16 inputs unchanged. [Evidence](../handoffs/TELEMETRY-04.md).
- PLAN-ADAPT-05: source/workflow static inspection and document consistency/preservation
  checks only. New profiles, process smoke/CI and live model support have NOT been
  implemented/validated by the new documents. [Handoff](../handoffs/PLAN-ADAPT-05.md).

## Open limits and authorization

No current full compiled-worker/MCP/host lifecycle, local-index E2E, live selected
profile or OS-wide egress acceptance. Existing compiles are real but insufficient
for runtime proof. Upstream CI uses acquisition/different tool versions and broad
runtime lanes; do not execute it as the default fork CI. D12 runner policy is open.
U1/D9 local Python/model/artifact/API evidence, D11, D5 registration and profile-specific
payload/auth/network/data policies remain scoped gates. No guessed model/endpoint.
No acquisition/install/update, service/worker/MCP/plugin start/registration, live
AWS/OpenAI/Claude/Codex login/inference, real settings/credentials/memory/installed
assets, push, new branch/worktree or agents authorized by this adaptation.

## One next task

**WINDOWS-09 source increment + early compiled-smoke/CI harness authoring**, awaiting
explicit launch of [NEXT-SESSION](../NEXT-SESSION.md). Preserve all A19 provider adapters;
remove runtime acquisition/private path fallback, not supported selected-provider auth.
Current prompt allows source/test/fixture/harness/workflow definition and one reviewed
compile after source edits when launched; actual runtime/CI execution remains separate.
Read AGENTS -> README -> STATE -> roadmap step 9/graph -> TASKS -> A19/A20 ->
LLM-PROFILES relevant boundary / VALIDATION V1-V3 + CI -> DEV-ENVIRONMENT current ->
PLAN-ADAPT-05 -> TELEMETRY-04/CHROMA-07 limits -> PATCH-SEQUENCE 9 -> E12/E13/E14/E21.
No full history or repeat audit; close shared memory and emit the next concrete bounded
prompt. Step 6 now PROFILE-06A/06B if needed; do not launch it during WINDOWS-09.
