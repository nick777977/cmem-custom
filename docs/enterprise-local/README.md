# Enterprise local fork: project memory

Goal: Windows local-first memory with existing Claude Code/Codex integrations,
canonical SQLite/FTS5, persistent local Chroma/embedding assets and local viewer.
The owner explicitly chooses provider, model and auth for every LLM task, with one
default and optional role overrides. A19 supersedes Bedrock-only; no hidden model,
account/gateway fallback, CMEM registration/subscription, telemetry or cloud sync.
Local persistence does not imply offline generative inference.

Accepted target contracts A19/A20 (not implemented yet): [LLM-PROFILES](LLM-PROFILES.md),
[VALIDATION](VALIDATION.md). Current adaptation [PLAN-ADAPT-05](handoffs/PLAN-ADAPT-05.md)
was documentation-only. Later WINDOWS-09 source/compile evidence is below; no runtime,
CI, login or real user-state access was performed.

## Current local development baseline

Use **Node.js 22.23.4, npm 10.9.9, Bun 1.4.4** for this fork. User-provided logs
show successful dependency preparation/build and worker:start returning ready;
Session 02 pure compile and focused checks pass; owner-selected C restores
lifecycle declaration consistency (guard PASS). HOSTED-03 is done-bounded: 58 targeted
tests and one compile PASS, source/generated paired; step 2 boundary explicitly accepted
for source progression. OS-offline/provenance and full memory acceptance remain pending. See [BUILD-02](handoffs/BUILD-02.md) and the current
[policy application](handoffs/BUILD-02-TRUST-APPLY.md).
See [HOSTED-03 evidence](handoffs/HOSTED-03.md) and [DEV-ENVIRONMENT.md](DEV-ENVIRONMENT.md) for evidence, warnings, preserved setup and
limitations. Other attempted Node versions were unsuccessful for the user; this is
not a complete compatibility matrix. Do not reinstall/update by default.

Current CHROMA-07: source 8fa997979, generated b8734d9b2; 127 targeted tests /
383 assertions and one compile PASS, 16 inputs unchanged. Acquisition/remote launch
removed; **local Chroma activation blocked** pending approved Python/model/offline
embedding/telemetry API evidence U1/D9. No actual Chroma acceptance.
[Contract/limits](handoffs/CHROMA-07.md).

TELEMETRY-04: source 0abd4180b / generated 6bb7c6995; E03/E04 Node telemetry
removed, local diagnostics retained. 206 tests / 728 assertions and one compile PASS;
16 inputs unchanged. [Evidence/limits](handoffs/TELEMETRY-04.md). No full runtime claim.

WINDOWS-09 partial source: S0d0a4b176 / G004588740; harness Hf2c722fad. SessionStart
compile/PATH repair and parser-helper acquisition removed, blocked local preflight.
17 tests / 53 assertions, one compile and viewer typecheck PASS; root typecheck has
three unchanged baseline TS2345. Harness mock-only; CI source manual-only BLOCKED D12.
Private resolver/bootstrap completion remains **WINDOWS-09B**, next proposed source task.
[Evidence, open gaps and rollback](handoffs/WINDOWS-09.md). No actual V3/runtime/CI run.

## Reading order

For a fresh session start with [STATE](memory/STATE.md), then the current
[NEXT-SESSION](NEXT-SESSION.md) and [TASKS ownership board](memory/TASKS.md).
[Session prompts](SESSION-PROMPTS.md) retain stage templates/history. Read only
the current task's context bundle, not the whole history or initial plan.

1. [Current handoff](memory/STATE.md): completed work, limitations, next action.
2. [Roadmap](../roadmap.md): increments, dependency graph and parallel lanes.
3. Current target contracts: [LLM profiles](LLM-PROFILES.md),
   [runtime/CI evidence levels](VALIDATION.md); read task-relevant sections.
4. [Baseline](../BASELINE.md) and [static inventory](../EGRESS-INVENTORY.md).
5. [Architecture](../ARCHITECTURE-LOCAL.md), [risks](../RISK-REGISTER.md),
   [commit sequence](../PATCH-SEQUENCE.md).
6. [Decision log](memory/DECISIONS.md) and [session history](memory/WORKLOG.md).
7. [Original supplied plan](source/INITIAL-PLAN.md): preserved verbatim; not an
   instruction to execute its commands or evidence that its hypotheses are true.

Use `docs/` rather than an additional `Documents/` tree so existing documentation
conventions remain usable. Root `AGENTS.md` is the entry point for later coding sessions.
English technical documents are retained for agent handoffs; user communication is Russian.

## Status conventions

Roadmap `idea` means implementation has not started; size is a preliminary scope estimate,
not a delivery promise. Checkboxes in the state/patch documents record actual progress.
`VERIFIED IN CHECKOUT` means source inspection at the pinned SHA, never a successful
runtime test unless explicitly stated. `INFERRED` and `UNKNOWN` retain uncertainty.

The original planning/audit sessions ran no application/tests. Later user-run evidence
is recorded separately in DEV-ENVIRONMENT, not retrospectively credited to those agents.
Shared memory is tracked in Git; temporary output goes to `.scratch/enterprise-local/`.
The local SDD defaults file is ignored and is not an authorization source. Follow the
TASKS session-close protocol so current state, decisions, evidence and next launcher
remain sufficient for a fresh chat; do not rely on implicit cross-chat memory.
