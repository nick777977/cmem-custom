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
| CHROMA-07 / 7 | done-bounded source refusal; activation pending U1/D9 | 2026-11-02 coordinator; feat/cmem-light-local; entry 46c12bfe7; serial | None active; reservations released. Historical exact scope below and S/G. | Source 8fa997979, generated b8734d9b2; 127 tests / 383 assertions + one compile PASS; 16 inputs unchanged. A17, handoffs/CHROMA-07.md. No approved artifact/API or real Python smoke. |
| TELEMETRY-04 / 4 | ready-unclaimed; awaiting user launch | None; serial current branch | None | NEXT-SESSION: E03/E04 Node telemetry removal, retain local diagnostics; no runtime/acquisition inferred. |

Normal statuses: ready-unclaimed -> claimed -> in-progress -> review -> done. Blocked
names a specific condition and next independent action. Historical bounded completion
and user-wip are exceptions, not shipped implementation. A claim records date, owner,
source HEAD, expected writes and one next step. Read fresh Git/board first; no implicit
ownership from an old chat. User owns USER-SETUP until an explicit handoff.

## CHROMA-07 reservation history — all released

Initial claim before source edits: src/services/sync/{ChromaMcpManager.ts,ChromaSync.ts,
ChromaLocalRuntime.ts}; src/shared/SettingsDefaultsManager.ts; tests/services/sync/
{chroma-local-runtime,chroma-sync-embedding-function}.test.ts; .scratch/enterprise-local/
chroma-07/; AGENTS.md; docs/{roadmap.md,PATCH-SEQUENCE.md,EGRESS-INVENTORY.md};
docs/enterprise-local/{README.md,AUDIT-CLOSURE.md,DEV-ENVIRONMENT.md,NEXT-SESSION.md,
handoffs/CHROMA-07.md,memory/STATE.md,memory/TASKS.md,memory/DECISIONS.md,memory/WORKLOG.md}.

CHROMA-07 reservation extension before edits: tests/services/sync/chroma-mcp-manager-
{singleton,path,cwd,ssl}.test.ts. Replace obsolete acquisition/remote expectations;
retain mocked transport lifecycle coverage with a synthetic launch contract. This
fixture is not Python API evidence and cannot enable a production launch.

CHROMA-07 compile reservation extension (serial generator lane, before compile):
plugin/scripts/{claude-mem-launcher,context-generator,context-read-worker,ensure-launcher,
mcp-server,server-service,transcript-watcher,worker-service}.cjs and each matching .cjs.map;
plugin/scripts/{bun-runner.js,qoder-hook-launcher.cjs,statusline-counts.js,version-check.js,
worker-wrapper.cjs}; plugin/ui/viewer-bundle.js; existing plugin/ui/work-view/index.html
and its referenced assets (new content-hash name, if emitted, reserved as paired output).
Other generator outputs are fingerprinted and expected unchanged; inspect and extend
this reservation before retaining any additional delta. No generator source/manifest/
lock/trust changes are authorized by this reservation.

CHROMA-07 post-compile review extension before staging/retaining: plugin/skills/
request-progress/scripts/request-groups.mjs and plugin/sqlite/SessionStore.js{,.map}.
These declared build-hooks targets also inline SettingsDefaultsManager; the exact
delta is the new executable default/updated comments, not a SQLite or progress change.
Documentation extension: docs/ARCHITECTURE-LOCAL.md, to retire direct-Python launch
wording while the supported artifact interface remains unknown.
Final documentation reservation extension before edits: docs/enterprise-local/
SESSION-PROMPTS.md, replacing its obsolete current CHROMA-07 launcher reference.

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

## Minimal context for proposed TELEMETRY-04

- AGENTS -> README -> STATE -> roadmap step 4/graph -> TASKS.
- DECISIONS A06/A07/A09/A14/A15/A16/A17; current environment; NEXT-SESSION.
- CHROMA-07 handoff limits; PATCH-SEQUENCE section 4; E03/E04 and corresponding
  existing AUDIT-CLOSURE notes, then telemetry/direct caller/tests after a new claim.

No whole-history or baseline/trust/hosted/Chroma replay. No real user state or runtime
starts. Parallelism requires explicit user request; the board grants no permission.

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
