# Shared execution board

Updated: 2026-11-02. Single place for active ownership and file reservations.
Dependencies/waves remain solely in [roadmap](../../roadmap.md); decisions in
[DECISIONS](DECISIONS.md); current resumable handoff in [STATE](STATE.md).
This board does not grant permission or duplicate the dependency graph.

## Current ownership

| ID / parent step | Status | Owner / branch / worktree | Reserved files | Evidence / handoff |
|---|---|---|---|---|
| AUDIT-01 / 1 | done-bounded | Historical session; feat/cmem-light-local | None active | f9f2b2efe, AUDIT-CLOSURE; full dependency/runtime gates open |
| USER-SETUP / 2 prerequisites | done-preserved | Session 02 coordinator; feat/cmem-light-local | None active | Exact 10 handoff hashes matched; inputs 49e4f65e1, bundles ce7ded4dc; provenance/limits in BUILD-02 |
| DOC-HANDOFF-03 / coordination | done | Documentation session 2026-11-02; feat/cmem-light-local; entry 62e79cceb | None active | Evidence, A08/A09 and next launcher persisted; links/whitespace and 10 user-file hashes checked; docs commit follows entry (see Git log); USER-SETUP untouched |
| BUILD-02 / 2 | boundary accepted for source progression; release evidence pending | Session 02 coordinator finished; feat/cmem-light-local; entry 4d773b4b7 | None active | 153a9953c compile boundary, 705cd1dc9 fixture; compile PASS, 6+21 PASS. Original drift FAIL now superseded by 8bc557532 guard PASS. OS-offline/provenance gates open; P10 explicitly accepted as A15 in HOSTED-03 |
| BUILD-02-TRUST / 2 | done-bounded; owner chose C subsequently | 2026-11-02 coordinator; feat/cmem-light-local; entry 66a4c961d; serial | None active | Historical review 6aa253dfb. Recommendation A not adopted; explicit C implemented below. No pending A/B/C question |
| BUILD-02-TRUST-APPLY / 2 | done | 2026-11-02 coordinator; feat/cmem-light-local; entry 6aa253dfb; serial | None active; reservations released | 8bc557532: canonical/root/plugin npm = 30, actual guard PASS; five preserved input hashes and 26-name Bun pairing PASS. Evidence in handoffs/BUILD-02-TRUST-APPLY.md; docs commit follows source in Git log. No install/lifecycle/compile/runtime or step 3 |
| HOSTED-03 / 3 | done-bounded | 2026-11-02 coordinator; feat/cmem-light-local; entry f7df0cccd; serial | None active; reservations released. Written source/test/artifact scope recorded in 417483949/298d44742 and handoff; includes setup-data.ts, tests/fixtures/hosted-03-routes.ts and Windows work-view fixture adjustments. Documentation scope extended to ARCHITECTURE-LOCAL.md and SESSION-PROMPTS.md to retire stale active instructions. | Source/tests 417483949, generated 298d44742; 58 tests PASS, one compile PASS, 16 inputs unchanged; A15/A16 and handoffs/HOSTED-03.md. No acquisition/services/real state. |
| CHROMA-07 / 7 | ready-unclaimed; awaiting user launch | None; serial current branch | None | NEXT-SESSION: pre-provisioned local Chroma/embedding integration, synthetic checks only; no downloads or actual runtime inferred from this proposal. |

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

## Minimal context for proposed CHROMA-07

- AGENTS -> README -> STATE -> roadmap step 7/graph -> TASKS.
- DECISIONS A06/A07/A09/A14/A15/A16; DEV-ENVIRONMENT current section; NEXT-SESSION.
- HOSTED-03 handoff limits; PATCH-SEQUENCE §7; EGRESS-INVENTORY E08–E11 and the
  corresponding existing AUDIT-CLOSURE notes only.
- ChromaMcpManager/ChromaSync/settings/direct callers and affected tests; repository
  artifact contracts if present. No real installed-user assets/config/database reads.

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
