# Enterprise local fork: project memory

Goal: Windows local-first memory with existing Claude Code/Codex integrations,
canonical SQLite/FTS5, persistent local Chroma/embedding assets and local viewer.
The owner explicitly chooses provider, model and auth for every LLM task, with one
default and optional role overrides. A19 supersedes Bedrock-only; no hidden model,
account/gateway fallback, CMEM registration/subscription, telemetry or cloud sync.
Local persistence does not imply offline generative inference.

**Current plan authority: A27 (2026-11-04).** Build/install/bootstrap may download
necessary dependencies and local embedding assets. Everything must build/install/run
under an ordinary Windows user without admin/UAC. Test Codex first here; retain
Claude Code Enterprise/Bedrock/AWS SSO. Load our local build through local host
configuration/catalog, with no public publication or CMEM account. OS sandbox proof
and CI are deferred from phase-one prerequisites; bounded real lifecycle and memory
checks remain required. Old refusal work below is historical, not desired functionality.
[Current handoff](memory/STATE.md), [phase-one route](../roadmap.md),
[acceptance contract](VALIDATION.md), [next source task](NEXT-SESSION.md).

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
Historical first slice; later WINDOWS-09B result follows.
[Evidence, open gaps and rollback](handoffs/WINDOWS-09.md). No actual V3/runtime/CI run.

Earlier **WINDOWS-09B** (closure 2026-11-03): explicit-root protocol-3 launcher refusal,
automatic runtime/install entrypoint refusal, parser CLI PATH/module fallback removed.
S e3d91a505 / H bbc3847e9 / G 62a468f6d; 19 tests/112 assertions and one compile/viewer
PASS; root three unchanged TS2345. 19 inputs unchanged, four paired output sets changed,
UI/identity/locks/trust/generators preserved. Full step 9 remains partial: host templates,
Setup/version-check, old utilities/grammar paths and native adapter still open.
[Historical evidence/gaps/rollback](handoffs/WINDOWS-09B.md).

Earlier **WINDOWS-09C**: S bc3275b4c/H abfce3963/G 4ac6ad868. Canonical host/
Setup/wrappers and CLI command roots refuse; plugin signup/bootstrap, legacy native
installer runners and grammar module/build/query fallback retired. 20 V1 tests /
234 assertions, one compile/viewer PASS; root same three baseline TS2345. 19 inputs
unchanged across compile, 868 source sentinels unchanged; MCP pair emitted, seven
canonical host outputs regenerated. No V3/readiness. Host interpreter/loading,
independent helper APIs, native OS adapter and artifact/spec prerequisites remain.
[Exact evidence/gaps/rollback](handoffs/WINDOWS-09C.md). Next proposed launch:
**WINDOWS-09D remaining source**, subsequently completed within the boundary below.

Earlier **WINDOWS-09D**: host/source/eight paired outputs B855ef7d6e, final source
S236dd661c, tests/harness H2935e19d0. Explicit literal interpreter rendering, unbound
structured host commands, shell exit1, no bare node or /bin/sh/Qoder wrapper hosting.
Independent installer/runtime/diagnostic operations refuse; dormant bootstrap removed,
native-provider login files preserved. 20 V1 tests/433 assertions, one compile/viewer
PASS; root same three TS2345. 19 inputs/869 source sentinels/192 outputs unchanged
across compile; no generated follow-up commit. No real host envelope/loading proof,
native adapter/artifacts/admission/cleanup/protocol specs remain blocked; step9 partial.
[Historical evidence/gaps/rollback](handoffs/WINDOWS-09D.md).

Earlier **WINDOWS-09E H98a6d019c**: common mock runner validates admission/handles,
retains primary plus cleanup failures and attempts bounded release after failed/
timed-out stop. Sync launch refusal means ownership unknown, never OS cleanup success.
16 V1 tests/337 assertions PASS, zero forbidden tripwire events. No application or
generated changes, compile/typecheck or real child; 09D evidence preserved. Native
remains BLOCKED; step9 partial. [Exact evidence/gaps/rollback](handoffs/WINDOWS-09E.md).
That next review was completed below.

Latest **WINDOWS-09F aebc55e99**: bounded source/Microsoft API feasibility review
complete at R1ca61590d. Concrete job admission, security/network, stream/deadline and
cleanup primitives mapped to missing native/artifact/ABI/DNS/crash-release inputs.
No source/generated edit, test/compile/typecheck/runtime/CI. **Full step9 BLOCKED**:
host commands still intentionally unbound/exit1 and D5 unselected; a working local
install cannot be claimed under those retained constraints. No generic review replay
queued. Next useful source: local host binding after scope/input resolution.
[Exact findings/limits/rollback](handoffs/WINDOWS-09F.md), [single prompt](NEXT-SESSION.md).

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
