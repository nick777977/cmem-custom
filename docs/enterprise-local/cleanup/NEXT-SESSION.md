# Next session — close the retained Windows regression gate

The pre-merge verification launch is completed. The five original hook checks
are closed; deletion and runtime-output work must not be repeated. The current
recommendation is **do not merge yet**. Read [MERGE-READINESS](MERGE-READINESS.md)
and [per-file attempts](merge-verification-results.json), not the old five-failure
summary. This is a bounded test/resource-lifecycle task, not further pruning.

## One task

Make the retained local Windows regression gate reproducible and resolve its
remaining failures without weakening behavior assertions. Start with SQLite
connection/statement ownership, WAL restore and My Work atomic JSON writes;
the same failures reproduce on the target snapshot. Then correct only the
nonportable fixture/unchanged-template expectations that prevent this gate from
expressing the current local contract. Finish with an updated readiness verdict.

## Context and scope

- Follow AGENTS start order, then current STATE/TASKS and MERGE-READINESS.
- Stay on codex/repository-cleanup-plan; inspect HEAD/status and preserve WIP.
  One coordinator, no agents, task branches/worktrees, merge or push.
- Source: src/services/sqlite/{SessionStore,SessionSearch,connection}.ts,
  src/services/backup/{restore-swap,snapshot-files}.ts,
  src/services/work-view/{request-groups,auto-refresh-worker}.mjs and only
  dependencies needed to trace the recorded failure. Inspect before extending.
- Tests: the 22 failed-file rows in MERGE-READINESS, with exact assertions and
  baseline attempts in the JSON. Preserve search, identity/worktree, restore,
  privacy, context/timeouts and stopped-worker assertions. Do not merely add
  sleeps, suppress errors or delete common tests to turn the gate green.
- Existing Node 22.23.4/npm 10.9.9/Bun 1.4.4 and Python 3.13.15. No upgrade,
  install/update, CI/deploy, model download or real data migration by default.
- Use fresh task-owned state. A fixture inside this checkout can inherit the
  enclosing Git project; make no-repository cases explicit. Python on Windows
  does not implement a POSIX TZ environment override; preserve intended date
  behavior with an appropriate portable fixture.

## Checks and completion

Inspect selected commands/fixtures first. Isolate HOME/config/data/TEMP and all
credentials; use fake loopback generation only, ordinary Windows user tokens,
deadlines and owned-child cleanup. No admin/UAC, machine PATH/registry/services,
real installation/settings/memories, signup, live inference or AWS. Sandbox
relaxation for reviewed filesystem/loopback checks must not elevate Windows.

Reproduce the resource failure before the minimal correction. Run affected
local checks with their final assertions, both typechecks and guarded compile
if source/build inputs change. If shipped runtime bytes change, refresh the
appropriate current staging receipt and run one inspected copied-build fixture
with capture/search/recovery, viewer/My Work, prepared real Chroma and restart.
The current exact-reference verifier cannot validate a moved/new stage.

Keep local Better Auth sessions as a separate defect: the chosen viewer/memory
flow does not consume them; no signup/schema migration is needed for this gate.
Do not make coupled legacy pruning or real Claude/Bedrock acceptance a cleanup
prerequisite. Record actual PASS/FAIL/NOT RUN, baseline provenance and practical
impact, update MERGE-READINESS plus STATE/TASKS/WORKLOG/DECISIONS/NEXT-SESSION,
and create concern commits with paired outputs when necessary. End with an
explicit recommendation; never perform merge or push automatically.
