# Enterprise local fork: project memory

Goal: a Windows Claude Code memory plugin with local SQLite/FTS5 and persistent
Chroma/ONNX; only explicitly approved Bedrock/auth infrastructure may receive observer
traffic. Local persistence does not imply offline inference.

## Current local development baseline

Use **Node.js 22.23.4, npm 10.9.9, Bun 1.4.4** for this fork. User-provided logs
show successful dependency preparation/build and worker:start returning ready;
Session 02 pure compile and focused checks now pass; lifecycle drift, OS-offline proof
and full memory acceptance remain pending. See [BUILD-02](handoffs/BUILD-02.md).
See [DEV-ENVIRONMENT.md](DEV-ENVIRONMENT.md) for evidence, warnings, preserved setup and
limitations. Other attempted Node versions were unsuccessful for the user; this is
not a complete compatibility matrix. Do not reinstall/update by default.

## Reading order

For a fresh session start with [STATE](memory/STATE.md), then the current
[NEXT-SESSION](NEXT-SESSION.md) and [TASKS ownership board](memory/TASKS.md).
[Session prompts](SESSION-PROMPTS.md) retain stage templates/history. Read only
the current task's context bundle, not the whole history or initial plan.

1. [Current handoff](memory/STATE.md): completed work, limitations, next action.
2. [Roadmap](../roadmap.md): increments, dependency graph and parallel lanes.
3. [Baseline](../BASELINE.md) and [static inventory](../EGRESS-INVENTORY.md).
4. [Architecture](../ARCHITECTURE-LOCAL.md), [risks](../RISK-REGISTER.md),
   [commit sequence](../PATCH-SEQUENCE.md).
5. [Decision log](memory/DECISIONS.md) and [session history](memory/WORKLOG.md).
6. [Original supplied plan](source/INITIAL-PLAN.md): preserved verbatim; not an
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
