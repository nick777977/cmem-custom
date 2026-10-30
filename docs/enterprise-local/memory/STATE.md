# Current handoff

Updated: 2026-10-30. Phase: bounded static audit complete; implementation unauthorized.
Source inspected: `d7c2da3e5f9397b394dbc6b6966f4b261b489f7b` on
`feat/cmem-light-local`. Documentation commits follow that source SHA; use Git log for
their IDs. Recheck branch/status and source drift at the start of the next session.

## Completed

- [x] Read the entire supplied initial plan in bounded sections and preserve it locally.
- [x] Establish clean initial checkout, version, scripts, locks and instructions.
- [x] Investigate observer/env, local/remote sync, hosted/telemetry, launcher/build paths.
- [x] Record cited preliminary inventory, risks and architecture discrepancies.
- [x] Write ordered roadmap, dependencies, parallel lanes and commit acceptance/rollback plan.
- [x] Establish tracked project memory and ignored scratch directory.
- [x] Complete Session 01's bounded eight-area static audit and first patch contract:
  [AUDIT-CLOSURE.md](../AUDIT-CLOSURE.md). Reuse source evidence; no source drift at
  entry HEAD `2f061267628a74384fff08fc79b163cc9038bc88`.
- [x] Assign E01–E22 reachability/actions/owners and U1–U7 deferred evidence gates.

## Not completed

- [ ] Full P1 source/route/generated/dependency closure audit (see inventory checklist).
- [ ] Corporate artifact, inference payload, model/Region and retention decisions.
- [ ] Disposable runtime test environment / upstream plugin coexistence configuration.
- [ ] Any application implementation, dependency installation or baseline runtime validation.
- [ ] Any build, test, Chroma/Bedrock call, worker startup or network proof.

The existing `node_modules/` was present before this work; it was not installed or used.
User clarification after Session 01: they have not installed this fork's dependencies.
The observed directory remains unverified; no working development environment follows
from its existence. See [next-session prompt](../NEXT-SESSION.md) for dependency gates.
No claim of zero telemetry, offline runtime or enterprise acceptance is justified yet.

## Next action

Session 01 is finished; stop here. Next task, only when separately launched and
authorized: `SESSION-PROMPTS.md` Session 02, roadmap step 2. Read AGENTS.md, this
handoff, accepted decisions, AUDIT-CLOSURE's first patch/U2–U4 and PATCH-SEQUENCE §2;
do not repeat the full audit or load the initial plan.

Recommended launcher: [NEXT-SESSION.md](../NEXT-SESSION.md), main prompt (explicit
future source-edit authorization plus development-preparation contract). Its optional
block can additionally authorize dependency preparation/build/targeted checks after
the user fills allowed sources/lifecycles. Writing that template grants no permission
to execute it now. Keep current no-install/build/test/source-change restrictions.

Exact first source concern: `package.json` build/compile/preparation scripts and
`scripts/build-viewer.js` (remove embedded npm ci, retain local compiler/Vite with
missing-input preflight). Keep build-hooks generators/outputs and all runtime features.
Plugin lock generation is explicit preparation, never compile. Marketplace sync/restart
remain separate deployment commands. No implementation was made in Session 01.

Acceptance next: static compile subprocess chain has no install/lock resolution/
sync/restart/registration; missing dependencies fail locally. Request authorization
for source edits/local commit when that next session starts. Builds, installs, tests,
application, AWS/network and deployment still need their relevant explicit permission;
trusted toolchain/artifact policy precedes any execution. No blocker to defining or
editing that source boundary; unavailable dependencies are not permission to install.

New audit leads for later owning steps: remote spool E19 (8); independent refresh/
copy/judge SDK/CLI/API paths E20 (6); worker tree-sitter download E21 (9); conditional
Telegram/Notion/webhook exports E22 (10, separate concern). E15 now includes viewer
npm ci; E16 server/custom-module boundary and E18 mounted GitHub fetches are clarified.
Details, paths/source SHA, payload classes, future proof and U1–U7 are in the closure.
No graph dependencies changed; roadmap step 1's broader policy contract remains open.

Confirmed scope: keep the local browser viewer and existing memory/project/worktree
behavior, including imperfect current separation. No scope, capture or retrieval
rewrite. Focus on unapproved network removal and local runtime assets; approved
Bedrock remains the existing inference exception. See A06/A07. This clarification
does not authorize source changes, installation or execution.

Full P1, dependency/model/native review, source/bundle provenance and real traffic
remain open. Corporate policy questions are staged to their owners in the closure;
do not turn deferred project/worktree isolation or payload observations into an
unrequested redesign. Do not begin by deleting large feature directories.

## How to resume

Read root AGENTS.md -> this file -> `docs/roadmap.md` -> the relevant inventory and patch
section. Resolve only decisions blocking the next increment. Update task checkboxes,
decision status and WORKLOG with each logical commit. Never mark mocked/source-inspected
behavior as successful live runtime evidence.
