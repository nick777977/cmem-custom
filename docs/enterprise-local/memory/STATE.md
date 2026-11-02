# Current handoff

Updated: 2026-11-02 after CHROMA-07. Branch feat/cmem-light-local.
Source/tests **8fa9979797b5478ec8b36eebd6c52533112aec83**; paired generated **b8734d9b25e6e6e890ae4d3c4f7864cf48d3a4bf**.
Documentation commit follows in Git. Entry 46c12bfe7 was clean.
One coordinator, serial; no active work or reservations.

## Goal and retained behavior

Retain local viewer, canonical SQLite/FTS5 and local Chroma derived index; approved
corporate Bedrock/auth is the intended sole remote inference exception. Preserve
capture/retrieval, project/worktree identity, sharing/filter semantics. No migration,
isolation redesign or new SQLite-only product mode (D11 remains open).

## Completed boundaries

- Preserved setup 49e4f65e1/ce7ded4dc; pure compile 153a9953c, fixture 705cd1dc9;
  A14/C 8bc557532 declaration alignment. No baseline/trust replay needed.
- A15: step 2 boundary accepted for source progression; release evidence pending.
  OS/runtime remains 11; closure/provenance/reproducibility remains 10/12.
- HOSTED-03 source 417483949 / generated 298d44742, E01/E02 retired; 58 targeted
  tests and one compile PASS. [Prior evidence](../handoffs/HOSTED-03.md).
- CHROMA-07 **source refusal done-bounded; activation pending U1/D9** (A17).
  Manager uvx resolution/prewarm/cache sweep/certificate acquisition and HTTP launch
  removed. Remote/unknown modes and vendor embeddings reject, including legacy config
  and direct tool overrides. New absolute local executable setting has no discovery /
  repair/fallback. Every launch refuses pending approved artifact/API evidence before
  store/lock/process/transport. Merely setting a path cannot enable it. Default
  embedding name certifies no offline behavior. D11 unselected; error remains explicit.
- Actual checks: **127 PASS, 0 FAIL, 383 assertions**, ten isolated test files;
  **one compile PASS**, exact Node 22.23.4/npm 10.9.9/Bun 1.4.4. Mocks/synthetic
  state only; no Python/model process. 16 inputs unchanged vs HOSTED-03 and before /
  after compile. 192 outputs: 177 unchanged, 15 paired modifications, zero added/deleted;
  UI unchanged. [Exact source lines/checks/rollback](../handoffs/CHROMA-07.md).

## Open limits

No approved Python/Chroma/MCP/native/model paths or offline API supplied. U1/D9 remain
UNKNOWN; no model hashes, supported telemetry flag or compatibility invented. Activation
needs explicit artifact/read permission, resolved graph/hashes/licenses, real local-only
model/telemetry API and existing-collection compatibility, then separately authorized
runtime smoke. Internal Node launch description is not a Python API/approval manifest.
Step 10's finalized step-7 contract prerequisite remains open; graph/waves unchanged.

D11 remains open; no new successful SQLite-only fallback policy. Existing callers'
error/unavailability handling retained. No full capture -> SQLite -> Chroma query /
restart -> viewer -> Bedrock acceptance or real settings/credentials/memory access.
Compile Node instrumentation observed no socket/acquisition/deploy event; native/shell
coverage incomplete (Vite net use query observed). Generated-worker whitespace warning
retained. Installed-tree/native/Python/model provenance and reproducibility unproved.
No acquisition/lock resolution, services/worker/MCP/plugin start/registration, AWS,
real user state, push, new branch/worktree or agents.

## One next task

**TELEMETRY-04 / roadmap step 4**, awaiting explicit launch of
[NEXT-SESSION](../NEXT-SESSION.md): remove Node remote telemetry, retain local diagnostics.
Only E03/E04 and direct callers/tests; do not activate Chroma, acquire artifacts,
repeat baseline/trust/hosted/Chroma work or start step 5/6/9.
Read AGENTS -> README -> STATE -> roadmap step 4/graph -> TASKS -> relevant decisions /
current environment -> CHROMA-07 limits -> PATCH-SEQUENCE section 4 -> E03/E04 and
corresponding audit notes. Close STATE/TASKS/WORKLOG/DECISIONS/contracts/environment /
NEXT-SESSION again.
