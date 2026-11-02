# Shared execution board

Updated: 2026-11-02. Single place for active ownership and file reservations.
Dependencies/waves remain solely in [roadmap](../../roadmap.md); decisions in
[DECISIONS](DECISIONS.md); current resumable handoff in [STATE](STATE.md).
This board does not grant permission or duplicate the dependency graph.

## Current ownership

| ID / parent step | Status | Owner / branch / worktree | Reserved files | Evidence / handoff |
|---|---|---|---|---|
| AUDIT-01 / 1 | done-bounded | Historical session; feat/cmem-light-local | None active | f9f2b2efe, AUDIT-CLOSURE; full dependency/runtime gates open |
| USER-SETUP / 2 prerequisites | user-wip | User; feat/cmem-light-local; current checkout | Root/My Work/plugin manifests, plugin/bun.lock, build-hooks, trust JSON, worker/watcher bundles/maps | DEV-ENVIRONMENT fingerprints: 9 tracked changes + 1 new input at entry; docs agent does not claim/commit them |
| DOC-HANDOFF-03 / coordination | done | Documentation session 2026-11-02; feat/cmem-light-local; entry 62e79cceb | None active | Evidence, A08/A09 and next launcher persisted; links/whitespace and 10 user-file hashes checked; docs commit follows entry (see Git log); USER-SETUP untouched |
| BUILD-02 / 2 | ready-unclaimed | None | None yet; prospective package.json/build-viewer overlap USER-SETUP | Claim after preserving/reconciling user baseline; pure compile + focused validation; NEXT-SESSION |

Normal statuses: ready-unclaimed -> claimed -> in-progress -> review -> done. Blocked
names a specific condition and next independent action. Historical bounded completion
and user-wip are exceptions, not shipped implementation. A claim records date, owner,
source HEAD, expected writes and one next step. Read fresh Git/board first; no implicit
ownership from an old chat. User owns USER-SETUP until an explicit handoff.

## Coordination protocol

1. One coordinator writes this board and serializes claims/merges/shared handoffs.
   Reserve paths before dispatch, link task to roadmap step and bounded context bundle,
   verify acknowledgement. Current work is serial; this board does not start agents.
2. Parallel work requires explicit user request and disjoint writes or explicitly approved
   separate branches/worktrees. No simultaneous shared-file edits on one checkout.
   Git add/commit/index operations are coordinator-only and serial.
3. Generators/outputs/manifests/locks share an integration lane. Reserve build/install
   directories too; no concurrent installs/builds overwriting artifacts. Never reset
   another owner’s changes. Source identity and generated provenance stay paired.
4. Agents read assigned context/decisions/constraints/E/U IDs, then report through
   `handoffs/<TASK-ID>.md` if needed: base/source SHA, paths, actual checks, limitations,
   proposed merge order. No real prompts/memory/credentials in tracked evidence.
5. Coordinator integrates serially, reviews overlap, runs only authorized checks and
   updates board/STATE/WORKLOG/affected contract/NEXT-SESSION. Graph edges change only
   when dependencies change; decisions go in DECISIONS, not only agent notes.
6. Do not steal stale claims by time alone: check owner/Git, record cancellation/handoff
   before reassignment, explicitly release unused paths on blocked work.

## Minimal context for BUILD-02

- AGENTS -> enterprise-local README -> STATE -> roadmap step 2/graph.
- TASKS reservations; accepted DECISIONS.
- DEV-ENVIRONMENT: toolchain, supplied evidence, WIP and guard drift.
- NEXT-SESSION active prompt; PATCH-SEQUENCE §2.
- AUDIT-CLOSURE first patch and E15/U2–U4 only; changed build sources.

No whole initial plan/WORKLOG/minified bundles/old chats. New tasks need their own
similarly bounded context bundle from the coordinator, not repeated project discovery.

## Session close and document maintenance

Before ending: persist task status/ownership; compact current STATE; append actual work
to WORKLOG; record accepted/proposed/superseded DECISIONS; update affected contracts and
NEXT-SESSION with one next task, context files, permissions and completion criteria.
Final response reports commits, validation and the same next step.

Replace obsolete active STATE/NEXT-SESSION instructions; preserve WORKLOG, pinned-SHA
audit snapshots and decision history. Mark replacement/link it before removing duplicate
docs and repair incoming links. No new parallel planning tree for each chat. Files are
durable memory when a session opens this repo and follows AGENTS; no invisible automatic
cross-chat memory is assumed. Later explicit parallel work uses this same board.
