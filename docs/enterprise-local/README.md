# Enterprise local fork: project memory

Goal: a Windows Claude Code memory plugin with local SQLite/FTS5 and persistent
Chroma/ONNX; only explicitly approved Bedrock/auth infrastructure may receive observer
traffic. Local persistence does not imply offline inference.

## Reading order

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

No application runtime or tests were executed in this planning session. Shared memory
is tracked in Git; temporary artifacts go to `.scratch/enterprise-local/`. The local
SDD defaults file is ignored and is not an authorization source.
