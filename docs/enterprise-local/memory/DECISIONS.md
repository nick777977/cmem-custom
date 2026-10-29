# Decision log

## Accepted from the user's current request

| ID | Decision | Reason / authority |
|---|---|---|
| A01 | Work on existing `feat/cmem-light-local`; no new branch or checkout | User created the fork branch and asked to use it |
| A02 | Keep durable memory under tracked `docs/enterprise-local/`; root `AGENTS.md` points there | User requested repository-local persistence and logical commits |
| A03 | This session changes documentation only; no installs/builds/app/tests/AWS | Explicit current user restriction; implementation authorization remains pending |
| A04 | Preserve supplied plan verbatim, verify hypotheses against pinned source | User asked to adapt after investigation and distinguish document instructions from request |
| A05 | No installed memory/credential/config reads or machine-wide changes needed for planning | Repository evidence is sufficient for this phase |

## Proposed architecture, pending confirmation/implementation

| ID | Proposal | Reason / unresolved part |
|---|---|---|
| P01 | Retain SQLite/FTS5 + persistent local Chroma and existing Claude SDK | Matches supplied objective; runtime compatibility unverified |
| P02 | Single Claude observer, explicit Bedrock enforcement, strict env, no fallback | Current dispatch/env permit broader behavior; exact enterprise values pending |
| P03 | Private identity such as `cmem-light-local`, fresh separate data path | Prevent upstream cache/data collision; final ID/path and plugin policy pending |
| P04 | Retain local viewer by default | Useful diagnostics; user preference pending, remove hosted routes regardless |
| P05 | Separate repository and worktree scopes by default | Avoid conflicting memories; sharing/isolation requirements pending |
| P06 | Separate build acquisition from compile; pre-provision Python/model | Current build/uvx can resolve dependencies; approved mirror/model artifacts pending |
| P07 | Capture policy before durable spool and real observer submission | Local log redaction does not prove safe capture; payload/retention policy pending |
| P08 | Preserve schema compatibility; avoid destructive migration in initial release | Protect data and rollback; identity/index rebuild design still needed |

Formal ADRs should be added when architectural choices are accepted, with alternatives
and consequences. Do not label these proposals as implemented safeguards.
