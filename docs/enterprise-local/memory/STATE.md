# Current handoff

Updated: 2026-11-02 after TELEMETRY-04. Branch feat/cmem-light-local.
Source/tests **0abd4180b1971802d7939acba04d46960c4e8c14**; paired generated **6bb7c6995ea47e92ae0176bc88eac75bae871290**.
Entry 1f41cec12 clean; documentation commit follows in Git.
One coordinator, serial; no active work or reservations.

## Goal and retained behavior

Local viewer, canonical SQLite/FTS5 and local Chroma derived index; approved corporate
Bedrock/auth is the intended remote inference exception. Preserve capture/retrieval,
project/worktree identity, sharing/filter defaults. No migration/isolation redesign.

## Completed bounded work

- Baseline/setup, A14/C declaration consistency and A15 source progression accepted.
  No replay needed; OS/runtime gates stay in 11, closure/provenance/reproducibility 10/12.
- HOSTED-03 S 417483949 / G 298d44742: E01/E02 retired; 58 tests + one compile PASS.
- CHROMA-07 S 8fa997979 / G b8734d9b2: source refusal done-bounded, local activation
  pending approved artifact/API U1/D9. 127 tests + one compile PASS; no real Python/model.
  [Exact Chroma limits](../handoffs/CHROMA-07.md). D11 stays open; no SQLite-only mode.
- TELEMETRY-04 S 0abd4180b / G 6bb7c6995: **E03/E04 Node sinks/jobs removed**.
  Worker/CLI/backfill transport inert, legacy opt-in cannot enable it; no autocapture,
  payload buffers, telemetry timers/flush, installer prompt or analytics spool/receipts.
  Local file/stderr diagnostics, optional sink API and memory/viewer behavior retained.
  **206 tests / 728 assertions PASS, zero FAIL, 18 isolated files; one compile PASS**.
  Exact Node 22.23.4/npm 10.9.9/Bun 1.4.4; synthetic state and mocked lifecycle only.
  16 input sentinels unchanged vs CHROMA-07/pre/post; 14 generated modifications,
  178/192 unchanged, no additions/deletions, UI unchanged. [Evidence/rollback](../handoffs/TELEMETRY-04.md).

## Open limits

No actual runtime/full memory/Chroma/Bedrock smoke or OS-wide no-egress evidence.
Node compile instrumentation has native/shell limits; known Vite net use query and
emitted-worker whitespace warning retained. posthog-node declarations/tree retained
for step 10; installed dependency/native/Python/model provenance remains unproved.
Chroma artifact/API/telemetry contract U1/D9, D11 and step-10 prerequisite remain open.
No acquisition/install/update, service/worker/MCP/plugin start/registration, AWS,
real user settings/credentials/memory, push, new branch/worktree or agents.
Roadmap graph/waves unchanged; E05+ work not started by TELEMETRY-04.

## One next task

**WINDOWS-09 / roadmap wave 4, step 9**, awaiting explicit user launch of
[NEXT-SESSION](../NEXT-SESSION.md). Deterministic private Windows launcher/hook/MCP
paths and refusal of runtime acquisition/repair. D5/actual registration remains gated.
Read AGENTS -> README -> STATE -> roadmap step 9/graph -> TASKS -> relevant decisions /
current environment -> TELEMETRY-04 and CHROMA-07 limits -> PATCH-SEQUENCE section 9 ->
E12/E13/E14/E21 and audit notes. No baseline/trust/hosted/Chroma/telemetry replay.
