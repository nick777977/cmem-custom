# Decision log

## Accepted from the user's current request

| ID | Decision | Reason / authority |
|---|---|---|
| A01 | Work on existing `feat/cmem-light-local`; no new branch or checkout | User created the fork branch and asked to use it |
| A02 | Keep durable memory under tracked `docs/enterprise-local/`; root `AGENTS.md` points there | User requested repository-local persistence and logical commits |
| A03 | This session changes documentation only; no installs/builds/app/tests/AWS | Explicit current user restriction; implementation authorization remains pending |
| A04 | Preserve supplied plan verbatim, verify hypotheses against pinned source | User asked to adapt after investigation and distinguish document instructions from request |
| A05 | No installed memory/credential/config reads or machine-wide changes needed for planning | Repository evidence is sufficient for this phase |
| A06 | Retain the local browser viewer and existing upstream project/worktree memory behavior, including current sharing/filter defaults | User clarification on 2026-10-30: no rewrite even if separation is imperfect; reconsider later |
| A07 | Prioritize removal of unapproved remote connections/downloads while preserving local memory functionality | User clarification; approved corporate Bedrock remains the previously specified inference exception |
| A08 | Maintain self-contained repo memory throughout implementation: TASKS owns active ownership/reservations; STATE/DECISIONS/WORKLOG/affected contracts/NEXT-SESSION close every session; one coordinator integrates parallel results | User request 2026-11-02 to preserve decisions/context across fresh sessions and prevent duplicate/conflicting agent work. Parallelism still requires explicit dispatch authorization; board alone does not start agents |
| A09 | Use Node.js 22.23.4, npm 10.9.9, Bun 1.4.4 as the local fork development baseline; preserve user-installed dependencies, no automatic upgrade/reinstall | User supplied successful build/start evidence and exact Node/npm output on 2026-11-02; Bun version is in build log. Node 20/24 attempts reportedly failed; not a full compatibility claim |

## Proposed architecture, pending confirmation/implementation

| ID | Proposal | Reason / unresolved part |
|---|---|---|
| P01 | Retain SQLite/FTS5 + persistent local Chroma and existing Claude SDK | Matches supplied objective; runtime compatibility unverified |
| P02 | Single Claude observer, explicit Bedrock enforcement, strict env, no fallback | Current dispatch/env permit broader behavior; exact enterprise values pending |
| P03 | Private identity such as `cmem-light-local`, fresh separate data path | Prevent upstream cache/data collision; final ID/path and plugin policy pending |
| P04 | Superseded by A06: retain local viewer | Remove its hosted routes/actions and external assets while preserving local functionality |
| P05 | Rejected for this release: introduce separate repository/worktree scopes | A06 preserves upstream identity, sharing and filtering behavior; scope redesign deferred |
| P06 | Separate build acquisition from compile; pre-provision Python/model | Current build/uvx can resolve dependencies; approved mirror/model artifacts pending |
| P07 | Review existing capture and allowed Bedrock payload before live corporate inference | No new capture/redaction redesign is scheduled; any required policy-driven behavior change must be separately scoped |
| P08 | Preserve schema compatibility; avoid destructive migration in initial release | Preserve existing identity semantics too; no identity migration is planned |

Formal ADRs should be added when architectural choices are accepted, with alternatives
and consequences. Do not label these proposals as implemented safeguards.
