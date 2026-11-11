# Shared execution board

Updated: 2026-11-10. Single place for active ownership and file reservations.
Dependencies/waves remain solely in [roadmap](../../roadmap.md); decisions in
[DECISIONS](DECISIONS.md); current resumable handoff in [STATE](STATE.md).
This board does not grant permission or duplicate the dependency graph.

## Current ownership

2026-11-11 **WINDOWS-REGRESSION-GATE**, done-bounded by one coordinator
at clean `e113238ade58c8dcd25a5127d9a796b71d8ee124` on
`codex/repository-cleanup-plan`. Reserve SQLite SessionStore/SessionSearch/
connection, backup restore-swap/snapshot-files, work-view request-groups/
auto-refresh-worker and inspected dependencies needed for resource ownership;
the 22 failed test files in cleanup/MERGE-READINESS, focused lifecycle tests,
a reproducible isolated gate runner, paired compile outputs/current staging
receipt, and cleanup readiness/results plus README/DEV-ENVIRONMENT/NEXT-SESSION
and memory STATE/TASKS/WORKLOG/DECISIONS. Scratch:
`.scratch/enterprise-local/windows-regression-gate/`. First reproduce SQLite,
WAL and atomic-write failures, then make minimal corrections and replay final
assertions. No agents/branches/worktrees, merge/push, install/update, real
state/credentials, inference or AWS. Runtime checks use only synthetic owned
state, fake loopback generation and previously prepared local Chroma assets.
Reservation extended after the first gate trace: the orphan-FK boot case calls
`src/services/infrastructure/CleanupV12_4_3.ts`, whose own prepared statements
survive non-strict close. Change only its three connection closes, with
`tests/infrastructure/cleanup-v12_4_3.test.ts`; no cleanup policy/data changes.
Also reserve `tests/write-json-file-atomic.test.ts` to express preservation of
the actual Windows file mode without claiming POSIX ACL semantics.
Completed: `dff499e45` resource source/seven paired outputs, `974d779e4`
reproducible gate and fixtures. 373 PASS/0 FAIL in 27 Bun files; both
typechecks/guarded compile PASS. Fresh copied-build real Chroma/viewer/
capture/search/recovery/restart PASS, 37 sampled PIDs exited/four ports rebound;
four separate Node host/recovery checks PASS. Current receipt 813 inputs and
81/80 stage files verifies. Merge recommended for bounded cleanup, no merge/push.
Reservations released. Next ready-unclaimed: owner-directed integration review,
not another source slice. [Verdict](../cleanup/MERGE-READINESS.md).
The claim/reservation text above records this session's original scope.

2026-11-11 **CLEANUP-MERGE-VERIFY**, done-bounded by one coordinator from clean
`493e20b76055a20bfcacec183cacb4bd9f7940b0` on
`codex/repository-cleanup-plan`. Reserve the two retained hook test files,
`tests/enterprise-local/claude-windows-stage.test.mjs`, applicable retained
resource assertions, current cleanup receipt/verifier tests and scripts,
`cleanup/MERGE-READINESS.md`, cleanup/main next-session pointers and
`memory/{STATE,TASKS,WORKLOG,DECISIONS}.md`, README/runbook/environment status.
Review local lanes and auth source; run bounded synthetic checks in fresh
`.scratch/enterprise-local/cleanup-merge-verify/`. No agents, merge, push,
real state, registration, AWS or live inference. Extend reservation before
any application/generated changes. Next: align hook contracts and map lanes.
Compile reservation: fingerprint all tracked plugin outputs, 19 reviewed
tool/dependency inputs and tracked source/test sentinels. Expect no runtime
output delta; no generation target, lock, dependency or application edit.
Completed: hook/resource tests `f6f49db53`, verifier `d9fa7f90f`; both
typechecks/guarded compile and exact reference verification pass, no runtime
output delta. Expanded selection has 1,806 PASS/90 FAIL/3 SKIP, with baseline
comparisons, direct host PASS and recovery fresh-rerun PASS. Verdict: do not
merge yet; close retained Windows test gate. [Full disposition](../cleanup/MERGE-READINESS.md).
Reservations released; next task ready-unclaimed in cleanup/NEXT-SESSION.
The reservation/next-action wording above records the original claim only.

2026-11-11 **CLEANUP tree and explanation follow-up**, done by one
coordinator at clean `0622cc22f` on `codex/repository-cleanup-plan`.
Reserve unnecessary empty project directories (never ignored/runtime/data or
dependency trees), `AGENTS.md`, `cleanup/{RESULTS,NEXT-SESSION}.md`,
`memory/{STATE,TASKS,WORKLOG,DECISIONS}.md` and the main next-session pointer.
Read only synthetic fixture logs and relevant auth/test source to explain
remaining checks, merge readiness and the local auth failure. No product edits,
runtime restart, broad test run, real auth/data, branch switch or merge.
Removed 116 exact empty directories; zero eligible empties on rescan.
Documented specific Better Auth schema error, legacy hook expectations,
focused/full-suite limits and recommendation to finish validation before merge.
User communication requirements are now in AGENTS. Reservations released.
Next ready-unclaimed task: [pre-merge verification](../cleanup/NEXT-SESSION.md).

2026-11-11 **REPOSITORY-CLEANUP implementation**, done-bounded. One
coordinator on `codex/repository-cleanup-plan`, entry `8b93ceb3d`.
Three concerns remove PDF/automation, extra hosts/presentation and detachable
standalone/cloud build/launch. All 438 removable candidates and 49 extra
exclusive test/helper/output files deleted; two agent-guidance candidates kept.
Source, generators and paired outputs retained with checks and current receipt.
Reservation extended to root README, its historical technical archive and the
Windows runbook receipt warning. No main-roadmap edits, agents/worktrees/push,
real installation/data/inference or toolchain changes. [Results](../cleanup/RESULTS.md)
records successful local checks, five stale shared assertions, existing auth
HTTP 500 and coupled source/dependency deferrals. All reservations released.
Next task is ready-unclaimed: [align retained hook tests](../cleanup/NEXT-SESSION.md).

2026-11-11 **REPOSITORY-CLEANUP final plan**, done by one coordinator from
clean `683bd9062` on `codex/repository-cleanup-plan`. Reserve
`docs/enterprise-local/cleanup/` and brief updates to
`memory/{STATE,TASKS,DECISIONS,WORKLOG}.md` and `NEXT-SESSION.md`.
Owner now requests removal of CI/CD, presentation PDFs and detachable non-local
components in the next implementation session, with local build/tests retained.
This turn wrote only the final plan, 440-path candidate manifest and next-session
prompt. No product changes/deletion or runtime. CI/PDF preservation instructions
are superseded; core provenance remains an explicit plan exception to blanket
author removal. [Next implementation launch](../cleanup/NEXT-SESSION.md) executes
the three bounded slices with local checks; defer costly shared refactors.
Reservations released.

2026-11-11 **REPOSITORY-CLEANUP planning**, historical, superseded by final plan
above. Done by one coordinator on
`codex/repository-cleanup-plan`, from clean `a9364604d026d79be8ab771ecb861688972d169c`.
The owner explicitly requested this separate branch and analysis before deletion.
Reserve `docs/enterprise-local/cleanup/`, task scratch under
`.scratch/enterprise-local/repository-cleanup/`, and brief session records in
`memory/{STATE,TASKS,WORKLOG,DECISIONS}.md` and `NEXT-SESSION.md`.
No source/dependency/build edits, deletion, application execution or main-roadmap
progress in this task. Indexed 2,997 baseline files and 6,133 literal module edges.
The owner confirmed two target hosts and preservation of plans/PDFs. The
[proposal and evidence](../cleanup/README.md) await discussion and approval of
the exact first implementation slice. Reservations released.

2026-11-10 **RECOVERY-11-LOCAL**, done-bounded. One coordinator on clean
`feat/cmem-light-local` at `922eeb841a74e4ca59303048e36722f35355e8fc`.
Reserve the worker session, provider dispatch, response storage and spool handoff
paths, focused recovery fixtures, the guarded compile outputs and the Claude
inventory. Use `.scratch/enterprise-local/recovery-11-local/` for synthetic
staging and runtime. Paired `bc8ae2f57`, focused and staged checks
passed, and the Claude inventory is refreshed. Reservations released.
[Evidence](../handoffs/RECOVERY-11-LOCAL.md) · [Next target](../NEXT-SESSION.md).

2026-11-10 **CLAUDE-WINDOWS-STAGE**, done-bounded. One coordinator on clean
`feat/cmem-light-local` at `327980a4f4a45d41edfda005f80b765371c5a646`.
Reserve `scripts/enterprise-local/{codex-local,verify-claude-stage}.mjs`,
`tests/enterprise-local/claude-windows-stage.test.mjs`,
`.scratch/enterprise-local/claude-windows-stage/`, and
`docs/{roadmap,PATCH-SEQUENCE}.md` plus
`docs/enterprise-local/{README,WINDOWS-LOCAL-SETUP,NEXT-SESSION,SESSION-PROMPTS,DEV-ENVIRONMENT,VALIDATION}.md`,
`memory/{STATE,TASKS,WORKLOG}.md`, `handoffs/{CLAUDE-WINDOWS-STAGE,ARTIFACT-10-LOCAL}.md`
and `artifacts/claude-windows-x64-inventory.json`. Staged and pinned the
private Claude copy using renderer `fc0484bf6` and paired build `2bb4746b2`.
Bound command and receipt checks passed. Real Claude CLI version, policy,
loading and hooks await the target. [Evidence](../handoffs/CLAUDE-WINDOWS-STAGE.md).
Reservations released. [RECOVERY-11-LOCAL](../handoffs/RECOVERY-11-LOCAL.md) followed.

2026-11-10 **CLAUDE-WINDOWS-STAGE launch alignment**, done. One
coordinator on clean `feat/cmem-light-local` at `2caef143d`. Reserve
`docs/{roadmap,PATCH-SEQUENCE}.md` and
`docs/enterprise-local/{README,NEXT-SESSION,SESSION-PROMPTS,WINDOWS-LOCAL-SETUP,memory/STATE,memory/TASKS,memory/WORKLOG}.md`.
Separated source/staging and the step-10 receipt from target CLI/Bedrock
acceptance. Corrected the README status and aligned steps 9–12.
Documentation only. Reservations released.
[CLAUDE-WINDOWS-STAGE](../handoffs/CLAUDE-WINDOWS-STAGE.md) followed.

2026-11-10 **CLI target and Claude Windows preparation**, done. One
coordinator on clean `feat/cmem-light-local` at `26cf8b536`.
Reserve `docs/{roadmap,PATCH-SEQUENCE}.md`,
`docs/enterprise-local/{README,LLM-PROFILES,NEXT-SESSION,SESSION-PROMPTS,VALIDATION,WINDOWS-LOCAL-SETUP,handoffs/VERIFY-11-LOCAL}.md`
and `memory/{DECISIONS,STATE,TASKS,WORKLOG}.md`. Prepare the host and
worker profile examples, preserve recovery evidence and align the next
implementation task. Documentation scope. A31 accepts the existing CLI
result and records the Windows target. Added private-load and AWS SSO
profile templates. Reservations released.
[CLAUDE-WINDOWS-STAGE](../handoffs/CLAUDE-WINDOWS-STAGE.md) followed.
Pending-event recovery remains an implementation task before daily use.

2026-11-10 **VERIFY-11-LOCAL closeout**, done. One coordinator on
`feat/cmem-light-local` at `045ac7a05`, with the previous session's
uncommitted verification docs. Reserve those files, `docs/PATCH-SEQUENCE.md`
and `docs/enterprise-local/{README,LLM-PROFILES,memory/DECISIONS,handoffs/ARTIFACT-10-LOCAL}.md`
for the model-role clarification, acceptance status, next launch and local commit.
Recorded A30 and separated the finished test run from the open daily-use
criteria. Reservations released. A31 supersedes the then-proposed
CODEX-11-HOST task.

2026-11-10 **VERIFY-11-LOCAL**, closed with bounded results. One coordinator on clean
`feat/cmem-light-local` at `045ac7a0559a4c7125a90ebddf0d5f49bf37fd80`.
Reserve fresh fixtures and receipts under `.scratch/enterprise-local/verify-11-local/`
and the step 11 handoff, `NEXT-SESSION.md`, `DEV-ENVIRONMENT.md`,
`VALIDATION.md`, `memory/{STATE,TASKS,WORKLOG}.md` and `docs/roadmap.md` for
closeout. Extend to `SESSION-PROMPTS.md` for the next-task link. Read the
pinned stage inputs and prepared wheelhouse/model. Stage
without registration and require a successful receipt before candidate runtime.
The staged private runtime passed capture, retrieval, restart and viewer
checks with real local Chroma and simulated model roles. Queue replay failed
across a graceful stop and local auth returned HTTP 500. See
[runtime evidence](../handoffs/VERIFY-11-LOCAL.md). Reservations released.
See the closeout above for the current next task.

2026-11-10 **Local-use plan alignment**, done. One coordinator at
`3ff812350b842812446ee9e769d8ada28f6e3d24` on clean `feat/cmem-light-local`.
Reserve `docs/{roadmap,PATCH-SEQUENCE}.md`,
`docs/enterprise-local/{README,VALIDATION,NEXT-SESSION}.md`,
`docs/enterprise-local/handoffs/ARTIFACT-10-LOCAL.md` and
`docs/enterprise-local/memory/{STATE,TASKS,DECISIONS,WORKLOG}.md`.
Documentation only. Clarify the local completion path, optional automation and
distribution, and the scope of the Chroma and artifact checks.
Reservations released. [VERIFY-11-LOCAL](../handoffs/VERIFY-11-LOCAL.md) followed.

2026-11-10 **ARTIFACT-10-LOCAL**, done-bounded. One coordinator on clean
`feat/cmem-light-local` at `cb9738a2778860b66ed604c887b243231d39935a`.

- Verification: `scripts/enterprise-local/verify-windows-artifact.mjs`.
- Deliverables: `docs/enterprise-local/artifacts/windows-x64-inventory.json`,
  `docs/enterprise-local/artifacts/windows-x64-sbom.json`, and
  `docs/enterprise-local/handoffs/ARTIFACT-10-LOCAL.md`.
- Closure: `docs/roadmap.md`, `docs/PATCH-SEQUENCE.md`,
  `docs/enterprise-local/{NEXT-SESSION,DEV-ENVIRONMENT}.md`, and
  `docs/enterprise-local/memory/{STATE,TASKS,WORKLOG}.md`.
- Closure link alignment also reserves `docs/enterprise-local/SESSION-PROMPTS.md`
  and `docs/enterprise-local/handoffs/RUNTIME-10-LOCAL.md`.
- Disposable copies, build attribution probes, wheel metadata, and comparison
  receipts: `.scratch/enterprise-local/artifact-10-local/`. Read existing paired
  outputs, dependencies and prepared Chroma input files. Any attribution replay
  writes only to task scratch. No application, lock or tracked build-output edits.

The 81-file transferred stage and raw copy matched the inventory. The verifier
rejected out-of-lane and altered candidates. [Evidence and provenance gaps](../handoffs/ARTIFACT-10-LOCAL.md).
Reservations released. [VERIFY-11-LOCAL](../handoffs/VERIFY-11-LOCAL.md) followed.

2026-11-10 **ARTIFACT-10-LOCAL closeout**, done. One coordinator at
`cb9738a27` on the same branch. The only incoming changes are this task's
uncommitted deliverables and handoff updates. Reuse the existing synthetic
copy fixture in `.scratch/enterprise-local/artifact-10-local/`. Reserve
`docs/enterprise-local/handoffs/ARTIFACT-10-LOCAL.md`,
`docs/enterprise-local/NEXT-SESSION.md`, and
`docs/enterprise-local/memory/{STATE,TASKS,WORKLOG}.md` for closeout edits.
The fixture rerun and the documented fresh staging procedure passed. All
reservations released. The local artifact commit includes the verifier,
inventory, SBOM and handoff. Step 11 continued in VERIFY-11-LOCAL.

2026-11-10 **RUNTIME-10-LOCAL**, done-bounded. One coordinator on clean
`feat/cmem-light-local` at `d26953ec07659fc52c88ac772396fef8514c9610`.

- Source: `scripts/enterprise-local/codex-local.mjs`, `scripts/build-hooks.js`,
  `src/services/worker-service.ts`.
- Test: `tests/enterprise-local/runtime-10-local.test.mjs`. Guard and lifecycle
  fixture use `.scratch/enterprise-local/runtime-10-local/`.
- Expected emitted changes: `plugin/scripts/worker-service.cjs` and
  `plugin/scripts/worker-service.cjs.map`. The reviewed compile also rewrites
  its other declared outputs, including ignored `dist/npx-cli/index.js`.
  Fingerprint tracked outputs and extend the claim before retaining other deltas.
- Closure: `docs/roadmap.md`, `docs/PATCH-SEQUENCE.md`,
  `docs/enterprise-local/{DEV-ENVIRONMENT,NEXT-SESSION,SESSION-PROMPTS,WINDOWS-LOCAL-SETUP}.md`,
  `docs/enterprise-local/memory/{STATE,TASKS,WORKLOG}.md` and
  `docs/enterprise-local/handoffs/RUNTIME-10-LOCAL.md`.

Source, focused tests and paired worker outputs in `2bb4746b2`. The copied
private launcher passed the synthetic lifecycle with zero provider or legacy
server requests. [Evidence and separate legacy test failures](../handoffs/RUNTIME-10-LOCAL.md).
Reservations released. [ARTIFACT-10-LOCAL](../handoffs/ARTIFACT-10-LOCAL.md) followed.

2026-11-10 **VIEWER-08-LOCAL documentation clarification**, one coordinator on
clean `feat/cmem-light-local` at `1a4497f2fb3d1a36b340df142673b886844c2daa`.
Reserved `docs/roadmap.md`, `docs/enterprise-local/WINDOWS-LOCAL-SETUP.md` and
`docs/enterprise-local/memory/{TASKS,WORKLOG}.md` to clarify the worker-served
Viewer URL and why step 10 follows the completed private CLI and viewer slices.
Documentation corrected and reservations released.

2026-11-10 **VIEWER-08-LOCAL**, done-bounded. One coordinator on clean
`feat/cmem-light-local` at `47e990374abb39bc4afe560b0f2a45dd4c45da6e`.
Step 8 reserved the following paths before editing.

- Viewer `src/ui/viewer/components/{ContextSettingsModal,LocalRuntimeStatus,GitHubStarsButton}.tsx`
  and `src/ui/viewer-template.html`.
- API `src/services/worker/http/routes/{ChromaRoutes,SettingsRoutes}.ts`.
- Tests `tests/worker/http/routes/chroma-status.test.ts`,
  `tests/settings-routes-settings-document.test.ts`, and
  `tests/ui/viewer/local-runtime-status.browser.test.ts`. Extend before edit to
  `tests/helpers/chrome-devtools.ts` for explicit Windows Chrome selection.
  Windows fixture cleanup also owns its browser child tree and bounded retries
  for transient profile/DevTools file locks.
  Extend to `tests/ui/viewer/settings-{save-draft,claude-auth-method}.browser.test.ts`
  to scope their readiness selectors to the editable settings fieldset.
  Copied-worker and browser
  fixture, build guards and disposable evidence under `.scratch/enterprise-local/viewer-08-local/`.
- Serial compile writes the declared build targets. Expected paired deltas are
  `plugin/scripts/worker-service.cjs{,.map}`, `plugin/ui/viewer-bundle.js`
  and `plugin/ui/viewer.html`. Fingerprint all tracked outputs and review any
  additional delta before retaining it.
- Closure `docs/roadmap.md`, `docs/enterprise-local/{WINDOWS-LOCAL-SETUP,LLM-PROFILES,DEV-ENVIRONMENT,NEXT-SESSION,SESSION-PROMPTS}.md`,
  `docs/enterprise-local/memory/{STATE,TASKS,WORKLOG}.md` and
  `docs/enterprise-local/handoffs/VIEWER-08-LOCAL.md`.

Paired implementation `2b77e9331`. Focused API and browser tests, both
typechecks, guarded compile and both copied-worker browser states passed.
[Evidence and limits](../handoffs/VIEWER-08-LOCAL.md). Reservations released.
[RUNTIME-10-LOCAL](../NEXT-SESSION.md) is ready-unclaimed.

2026-11-10 **CHROMA-07-LOCAL**, done-bounded. One coordinator on clean
`feat/cmem-light-local` at `80a6b0868867ad017a19580a7fedb8e334cd647d`.
Step 7 reserves:

- `src/services/sync/{ChromaLocalRuntime,ChromaMcpManager,ChromaSync}.ts`,
  `src/services/sync/ChromaSyncState.ts`, `src/services/worker-service.ts`,
  `src/shared/{paths,SettingsDefaultsManager}.ts`,
  `src/services/worker/http/routes/ChromaRoutes.ts`,
  `plugin/scripts/chroma-local.py`, `scripts/prepare-local-chroma.ps1`,
  `scripts/chroma-local-requirements.txt`.
- `tests/services/sync/{chroma-local-runtime,chroma-mcp-manager-path,chroma-mcp-manager-ssl,chroma-sync-embedding-function}.test.ts`
  plus `tests/services/sync/{chroma-mcp-manager-singleton,chroma-sync-watermarks,chroma-sync-state-atomic,chroma-sync-state-shape}.test.ts`
  and `tests/integration/chroma-local-worker.mjs`. Scratch, venv, wheel/model
  staging, synthetic home/data and copied worker under
  `.scratch/enterprise-local/chroma-07-local/`.
- Compile lane reserves `plugin/scripts/{context-generator,context-read-worker,mcp-server,server-service,transcript-watcher,worker-service}.cjs`
  and each matching `.cjs.map`, `plugin/sqlite/SessionStore.js{,.map}`, and
  `plugin/skills/request-progress/scripts/request-groups.mjs`. Fingerprint the
  remaining outputs and review any additional delta before retaining it.
- `docs/roadmap.md`, `docs/enterprise-local/{README,WINDOWS-LOCAL-SETUP,DEV-ENVIRONMENT,NEXT-SESSION}.md`,
  `docs/enterprise-local/handoffs/CHROMA-07-LOCAL.md` and
  `docs/enterprise-local/memory/{STATE,TASKS,DECISIONS,WORKLOG}.md`.

Paired implementation `c476b5cd0`. Preparation, focused tests, guarded build,
and copied-worker retrieval and restart are recorded in
[CHROMA-07-LOCAL](../handoffs/CHROMA-07-LOCAL.md). Reservations released.
Followed by [VIEWER-08-LOCAL](../handoffs/VIEWER-08-LOCAL.md).

Compile review extended the reservation to
`plugin/sqlite/observations/files.js{,.map}` for the inlined settings change.
Copied-worker review extended the reservation to
`src/services/worker/dependency-preflight.ts`, `src/shared/dependency-health.ts`
and `tests/worker/dependency-preflight.test.ts` to replace obsolete uvx advice.
Session close adds `docs/PATCH-SEQUENCE.md` and
`docs/enterprise-local/SESSION-PROMPTS.md` to refresh the step 7 and next-task links.

2026-11-10 completed **CHROMA-07-LOCAL handoff alignment** claim. One coordinator
on clean `feat/cmem-light-local` at `b34f55189dfca2b1411bee89d72fbad9b38365c5`.
Documentation scope: `docs/{roadmap,PATCH-SEQUENCE}.md`,
`docs/enterprise-local/{NEXT-SESSION,SESSION-PROMPTS,WINDOWS-LOCAL-SETUP}.md` and
`docs/enterprise-local/memory/{STATE,TASKS,DECISIONS,WORKLOG}.md`.
Documentation reservations released. The implementation claim remains unassigned.

2026-11-09 completed **PROFILE-06B** claim. One coordinator on clean
`feat/cmem-light-local` at `ee4f7dfbf04cece361ecb7b8901eecdc7829f214`.
Source reservation history:

- `src/services/agent-runner/run.ts`, `src/services/work-view/refresh-task.ts`,
  `src/services/work-view/python.ts` for the local goals helper environment,
  `src/services/work-view/{human-copy-worker,request-judge,focus-judge}.{mjs,d.mts}`,
  `src/services/work-view/request-groups.mjs`, `scripts/calibrate-focus-routing.mjs`
- `src/services/worker/{model-profiles,MainWorkerProfiles,OpenAICompatibleProvider,ClaudeProvider,CodexProvider}.ts`,
  `src/services/worker/http/routes/{WorkViewRoutes,SessionRoutes}.ts`,
  `src/services/worker/knowledge/{KnowledgeAgent,types}.ts`,
  `src/services/worker/agents/ResponseProcessor.ts`,
  `src/services/{worker-service,worker-types,server/Server}.ts`,
  `scripts/enterprise-local/codex-local.mjs`
- Tests `tests/enterprise-local/{profile-06a,profile-06b}.test.ts`,
  `tests/services/agent-runner/{run,extraction-input}.test.ts`,
  `tests/work-view/{auto-refresh,request-judge,focus-judge}.test.ts`,
  `tests/worker/work-view/{human-copy-provider,human-copy-worker}.test.mjs`,
  `tests/integrations/telegram-wrapup-notifier.test.ts`
- Reviewed compile owns `plugin/scripts/{worker-service,server-service}.cjs`
  and their maps, and `plugin/skills/request-progress/scripts/request-groups.mjs`.
  Fingerprint tracked inputs, source and all tracked outputs. Extend this claim
  before retaining any other output. Scratch `.scratch/enterprise-local/profile-06b/`.
- Closure `docs/roadmap.md`, `docs/enterprise-local/{README,LLM-PROFILES,VALIDATION,DEV-ENVIRONMENT,NEXT-SESSION,SESSION-PROMPTS}.md`,
  `docs/enterprise-local/memory/{STATE,TASKS,WORKLOG,DECISIONS}.md`
  and `docs/enterprise-local/handoffs/{PROFILE-06A,PROFILE-06B}.md`.

Source, tests and paired output `616c51272`. 146 focused tests and 782
assertions across two runs, both typechecks, guarded compile and the copied
worker loopback check passed. All reservations released. CHROMA-07-LOCAL is
next and unclaimed. [Evidence](../handoffs/PROFILE-06B.md).

2026-11-09 completed **PROFILE-06A** claim, one coordinator on clean
`feat/cmem-light-local` at `f1f6ce61221ac92fc05330c6410aefbc886c7fde`.
Source reserved: `src/services/worker/{provider-dispatch,model-profiles,MainWorkerProfiles,OpenAICompatibleProvider,OpenAICompatProvider,OpenRouterProvider,GeminiProvider,CodexProvider,CodexAppServerClient,ClaudeProvider,streamed-chat-completion}.ts`,
`src/services/worker/{http/routes/SessionRoutes,session/GeneratorRunner}.ts`,
`src/services/{worker-service,server/Server}.ts`, `src/shared/oauth-token.ts`,
and `scripts/enterprise-local/codex-local.mjs` for private launcher compatibility.
The shared response boundary and session state are also reserved in
`src/services/worker/agents/ResponseProcessor.ts` and `src/services/worker-types.ts`.
`src/supervisor/process-registry.ts` is reserved for explicit Claude launch options.
Focused tests: `tests/enterprise-local/profile-06a.test.ts`; scratch:
`.scratch/enterprise-local/profile-06a/`. Serial compile owns the worker CJS/map
pair, with all other tracked outputs and build inputs checked for changes before
retaining any delta. Docs: `docs/roadmap.md`, `docs/enterprise-local/{LLM-PROFILES,
WINDOWS-LOCAL-SETUP,NEXT-SESSION}.md`, `memory/{STATE,TASKS,WORKLOG,DECISIONS}.md`
and `handoffs/PROFILE-06A.md` under `docs/enterprise-local/`.
Compile review also reserves `plugin/scripts/server-service.cjs.map`. The
standalone server CJS did not change. The shared spawn registry and HTTP
completion imports account for the map change.
Closure also updates README, SESSION-PROMPTS, VALIDATION and the CLOUD-05
handoff link under `docs/enterprise-local/`. Source, tests and emitted files
are paired in `534de7911`. The copied worker passed its loopback fixture and
stopped. Reservations released. [PROFILE-06B](../handoffs/PROFILE-06B.md) followed this slice.

2026-11-09 completed **WINDOWS-09-LOCAL** claim at 34f908ae6 on feat/cmem-light-local.
One coordinator. Source and paired artifacts in ef815b29a. Synthetic checks ran
under .scratch/enterprise-local/windows-09-local/. Reservations released. The final
synthetic profile remains registered and stopped.

2026-11-09 completed **CLOUD-05** claim at 7b7e5cbdb on feat/cmem-light-local,
one coordinator. Source, focused tests and five emitted pairs in e87ef65ae.
The compiled test used a fresh private catalog under
.scratch/enterprise-local/cloud-05/ and removed its registration after stop.
Reservations released. PROFILE-06A followed this slice.

2026-11-09 completed claim: **PHASE1-DATA-CHECK**, serial coordinator, clean entry
4df2b8f5ef3fb9b79b9f7401bd1fb42bc6936328. Read source only. Check Bun SQLite/FTS5
with synthetic files and query Chroma package metadata from the selected Python
installation and its ordinary user site. Record approved model/budget and checks
in memory/{STATE,TASKS,WORKLOG,DECISIONS}.md, DEV-ENVIRONMENT.md, NEXT-SESSION.md,
VALIDATION.md and LLM-PROFILES.md. Scratch: .scratch/enterprise-local/phase1-data-check/.
No application changes, real data, Chroma service or model requests in this slice.
SQLite 3.53.4/WAL/reopen/FTS5 passed. Checked Python metadata lacked both packages.
Model and budget approved. Reservations released. WINDOWS-09-LOCAL remains next.

2026-11-04 completed claim: **PHASE1-ALIGN**, coordinator serial on feat/cmem-light-local,
clean entry d055fea4c3487e6010bbb35adb6f69c68b578215. Scope: align the existing plan
with the owner's clarified local-install/Codex-first target; bounded CLI/tool
availability checks only, no application execution, credentials or inference.
Reserved: AGENTS.md; docs/{roadmap,PATCH-SEQUENCE}.md; docs/enterprise-local/
{README,VALIDATION,LLM-PROFILES,DEV-ENVIRONMENT,NEXT-SESSION,SESSION-PROMPTS}.md;
memory/{STATE,TASKS,WORKLOG,DECISIONS}.md; disposable checks only
.scratch/enterprise-local/phase1-align/. No new plan tree, app/harness/generated/
manifest/lock edits, agents/branches/worktrees or real host configuration writes.
Next: inspect actual Codex CLI version/help with empty synthetic HOME/CODEX_HOME,
record selected-auth/model questions without treating unanswered choices as approval.
Reservation extension after explicit user reply (2026-11-04): one native
`codex login status` read-only probe through normal current-user authentication.
Only sanitized auth-mode/presence evidence retained; never inspect token files,
print raw output, start app-server or send inference. All build/setup/run acceptance
must be no-admin; user authorized current login but requested model/budget first.
Completed plan/contract updates, eight version/help probes and one sanitized native
login-status probe. No implementation/inference. All reservations released; actual
checks are in DEV-ENVIRONMENT/WORKLOG. Next WINDOWS-09-LOCAL is ready-unclaimed.

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
| TELEMETRY-04 / 4 | done-bounded | Coordinator finished; feat/cmem-light-local; serial; entry 1f41cec12 | None active; all reservations released | S 0abd4180b / G 6bb7c6995; 206 tests / 728 assertions + one compile PASS; 16 inputs unchanged. A18, handoffs/TELEMETRY-04.md. No runtime/acquisition. |
| PLAN-ADAPT-05 / coordination, steps 6/10/11/12 | done; documentation only | Coordinator finished; feat/cmem-light-local; entry 48feeab56 clean | None active; reservations released | A19/A20, LLM-PROFILES/VALIDATION, updated roadmap/prompts; 19 Markdown files / 123 links / 15 source citations checked; no source/runtime/CI change. handoffs/PLAN-ADAPT-05.md; docs commit follows in Git. |
| WINDOWS-09 / 9 | done-bounded partial source; full step open | Coordinator finished; feat/cmem-light-local; serial; entry 7d5f83cac | None active; reservations released | S0d0a4b176/G004588740/Hf2c722fad; 17 tests/53 assertions + one compile/viewer PASS, root three baseline errors; handoffs/WINDOWS-09.md. V3/CI NOT RUN. |
| WINDOWS-09B / 9 continuation | done-bounded partial source | Coordinator finished; feat/cmem-light-local; serial; clean entry e27548d545 | None active; reservations released | Launcher e9c8038ca, bootstrap 8bbf2830c, S e3d91a505 / H bbc3847e9 / G 62a468f6d. 19 tests/112 assertions, one compile/viewer PASS, root three known errors. handoffs/WINDOWS-09B.md; V3/CI NOT RUN. |
| WINDOWS-09C / 9 continuation | done-bounded partial source | Coordinator finished; feat/cmem-light-local; serial; clean entry 59c709482 | None active; all released | Host 2d8688e78/CLI 4945a916e/utilities c9978be26/S bc3275b4c/H abfce3963/G 4ac6ad868. 20 tests/234 assertions, one compile/viewer PASS; root same baseline. handoffs/WINDOWS-09C.md. No V3/CI. |
| WINDOWS-09D / 9 continuation | done-bounded partial source | Coordinator finished 2026-11-03; feat/cmem-light-local; serial; clean entry 8b39d1f86 | None active; all released | B855ef7d6e/S236dd661c/H2935e19d0; 20 tests/433 assertions, one compile/viewer PASS, root baseline FAIL; 19 inputs/869 source sentinels/192 outputs unchanged across compile. handoffs/WINDOWS-09D.md. No V3/CI. |
| WINDOWS-09E / 9 continuation | done-bounded partial source | Coordinator finished 2026-11-03; feat/cmem-light-local; serial; clean entry b9e683b75 | None active; all released | H98a6d019c, 16 V1 tests/337 assertions PASS, zero tripwire events; no application/generated delta or compile/typecheck. handoffs/WINDOWS-09E.md. No V3/CI. |
| WINDOWS-09F / 9 continuation | done-review; full step9 BLOCKED | Coordinator finished 2026-11-03; feat/cmem-light-local; serial; entry R1ca61590d | None active; all released | Review aebc55e99; no source/test/build/runtime. Concrete APIs mapped; host activation/native artifact-ABI-DNS-crash-release/execution inputs missing. handoffs/WINDOWS-09F.md. |
| PHASE1-ALIGN / coordination | done; plan and inert CLI checks | Coordinator finished 2026-11-04; feat/cmem-light-local; entry d055fea4c | None; all released | A27 permits necessary bootstrap/downloads and no-admin local functionality; Codex0.166.0-alpha.6/help/tool versions and ChatGPT-login presence verified; no app/code/inference. |
| WINDOWS-09-LOCAL / 9 | done-bounded | Coordinator finished; feat/cmem-light-local; entry 34f908ae6 | None active | ef815b29a, 70 tests, typechecks, compile, private catalog/real worker and MCP SQLite checks, transfer on matching host, uninstall. [Evidence](../handoffs/WINDOWS-09-LOCAL.md). No live inference. |
| CLOUD-05 / 5 | done-bounded | Coordinator finished; feat/cmem-light-local; entry 7b7e5cbdb | None active | e87ef65ae, focused checks and guarded compile, compiled restart with legacy settings and two inert outboxes. [Evidence](../handoffs/CLOUD-05.md). |
| PROFILE-06A / 6 | done-bounded | Coordinator finished; feat/cmem-light-local | None | Main worker observation, summary and compression at `534de7911`. [Evidence](../handoffs/PROFILE-06A.md). |
| PROFILE-06B / 6 | done-bounded | Coordinator finished; feat/cmem-light-local | None | Background and standalone judge paths, explicit capability refusals, copied worker evidence at `616c51272`. [Evidence](../handoffs/PROFILE-06B.md). |
| CHROMA-07-LOCAL / 7 | ready-unclaimed | None; serial selected branch | None | Local multilingual MiniLM first. Verify bilingual retrieval and persistent offline Chroma with separately staged assets. [Next session](../NEXT-SESSION.md). |

## WINDOWS-09F reservation history — all released

Claimed after clean branch/status/HEAD recheck at 1ca61590d18ebc80e2ef3e2aea74b89ffe54cf3a.
One coordinator, serial. Read-only: existing compiled-smoke runner, Windows planner,
direct launcher/host source and official Microsoft Win32/WFP API documentation.
Write scope: docs/enterprise-local/handoffs/WINDOWS-09F.md; AGENTS.md;
docs/{roadmap,PATCH-SEQUENCE}.md; docs/enterprise-local/{README,VALIDATION,
LLM-PROFILES,DEV-ENVIRONMENT,NEXT-SESSION,SESSION-PROMPTS}.md;
memory/{STATE,TASKS,WORKLOG,DECISIONS}.md; scratch only
.scratch/enterprise-local/windows-09f/. No application/harness/generator/output edit
or execution reserved. Extend exact reservation before any justified source delta.
Review APIs/order/failure/ABI/artifact requirements and record concrete BLOCKED inputs;
no nominal adapter/approval manifest. Owner prioritizes usable local install without
CMEM registration and avoiding further generic review loops; explicit runtime,
registration/acquisition/CI prohibitions and native BLOCKED remain in force.
Completed source/API review aebc55e99; no source reservation extension necessary,
no code/test/build/runtime execution. Documentation closure only; all paths released.
Full step9 BLOCKED, not a usable installation. Next action needs concrete scope/inputs.

## WINDOWS-09E reservation history — all released

Claimed at clean b9e683b75ed43c154a274c66fd599a200f666de8 after branch/status/HEAD
recheck and before edits; explicit 2026-11-03 user launch.
One coordinator, serial, no agents/branches/worktrees or other steps. Harness:
scripts/enterprise-local/compiled-smoke.mjs; tests/enterprise-local/compiled-smoke.test.ts.
Reuse existing copied-artifact mocks and dependencies. Scratch only
.scratch/enterprise-local/windows-09e/ (reviewed guard/run scripts and synthetic state).
No application/generator/output edits, compile/typecheck or real child execution planned.
Docs: AGENTS.md; docs/{roadmap,PATCH-SEQUENCE}.md; docs/enterprise-local/
{README,VALIDATION,LLM-PROFILES,DEV-ENVIRONMENT,NEXT-SESSION,SESSION-PROMPTS}.md;
memory/{STATE,TASKS,WORKLOG,DECISIONS}.md; handoffs/WINDOWS-09E.md.
Completed H98a6d019c: validate admission/owned handle, preserve primary plus independent
bounded stop/release failures. Sync launch failure means ownership unknown, never
OS cleanup success. 16 V1 tests/337 assertions PASS; native absent/BLOCKED, historical
commits preserved. No application/generator/output edit or compile/typecheck; docs
closure follows H. All reservations released; next WINDOWS-09F is unclaimed.

## WINDOWS-09D reservation history — all released

Claimed after clean branch/status/HEAD recheck, before edits. Source:
src/build/hook-shell-template.ts; scripts/build-hooks.js; src/npx-cli/commands/
{install,runtime,doctor}.ts. Only their direct consumers inspected; native provider
login implementations and adapters excluded. Paired canonical outputs: plugin/.mcp.json,
plugin/hooks/{hooks,codex-hooks,qoder-hooks}.json; plugin/scripts/{bun-runner.js,
version-check.js,worker-wrapper.cjs,qoder-hook-launcher.cjs}. Tests:
tests/enterprise-local/windows-09d.test.ts, compiled-smoke.test.ts; harness
scripts/enterprise-local/compiled-smoke.mjs (scratch-root and refusal specs only;
native remains BLOCKED). One compile integration lane: fingerprint all tracked
plugin/openclaw/dist/dist/dsh-lib outputs; retain only reviewed paired changes,
extend claim before retaining any unexpected delta. No manifests/locks/trust/identity/
provider/viewer source changes. Scratch exclusively .scratch/enterprise-local/windows-09d.
Docs: AGENTS.md; docs/{roadmap,PATCH-SEQUENCE}.md; docs/enterprise-local/{README,
LLM-PROFILES,VALIDATION,DEV-ENVIRONMENT,NEXT-SESSION,SESSION-PROMPTS}.md,
memory/{STATE,TASKS,WORKLOG,DECISIONS}.md and handoffs/WINDOWS-09D.md.
Native OS substrate/artifact contract absent: document exact source gaps, no nominal
adapter or runtime activation. Existing 09/09B/09C commits preserved.

## WINDOWS-09C reservation history — all released

Claimed after branch/status/HEAD recheck, before source edits. E13 canonical source
src/build/hook-shell-template.ts and scripts/build-hooks.js; paired plugin/hooks/
{hooks,codex-hooks,qoder-hooks}.json, plugin/.mcp.json; direct wrappers plugin/scripts/
{bun-runner.js,version-check.js,worker-wrapper.cjs,qoder-hook-launcher.cjs} and their
generator source under scripts/ (extend exact paths before editing once traced).
E12 direct src/npx-cli/{index.ts,commands/{runtime,doctor,install}.ts}; E14
src/launcher/install-launcher.ts; E21 src/services/smart-file-read/parser.ts.
Tests tests/enterprise-local/windows-09c.test.ts and compiled-smoke.test.ts;
scripts/enterprise-local/compiled-smoke.mjs (contract review; adapter only if bounded).
Disposable state/evidence .scratch/enterprise-local/windows-09c/ only.
Serial emission lane: all tracked plugin/, openclaw/dist/, dist/dsh-lib outputs
fingerprinted; retain only reviewed paired deltas, extend reservation before any
unexpected output. Manifests/locks/trust/compiler/identity are preservation sentinels,
not edit targets. No provider/native-login/Chroma/viewer/identity semantics changes.
Docs: AGENTS.md, docs/{roadmap,PATCH-SEQUENCE}.md, docs/enterprise-local/
{README,LLM-PROFILES,VALIDATION,DEV-ENVIRONMENT,NEXT-SESSION,SESSION-PROMPTS}.md,
memory/{STATE,TASKS,WORKLOG,DECISIONS}.md and handoffs/WINDOWS-09C.md.
No application runtime, native adapter execution, CI dispatch or D5 registration.
Retained source edits were the exact reserved paths; no new source generator path
was needed. CLI direct runtime/doctor bodies included; no provider implementation
reserved or edited. Canonical seven outputs paired in 2d8688e78, compile MCP pair
in G. All other tracked outputs unchanged. Documentation closure follows G.

## WINDOWS-09B reservation history — all released

Claimed after branch/status/HEAD recheck, before edits. No agents/branches/worktrees.
Source: src/launcher/{claude-mem-launcher.ts,local-preflight.ts,install-launcher.ts,
launcher-protocol.ts}; protocol bump is an explicit launcher contract delta, not a
plugin identity/manifest/lock delta.
src/npx-cli/{index.ts,commands/install.ts,commands/doctor.ts,install/setup-runtime.ts};
doctor.ts is the direct parser diagnostic caller, reserved before its update.
src/services/smart-file-read/tree-sitter-bin-path.ts.
Tests/harness: tests/enterprise-local/{windows-09b.test.ts,compiled-smoke.test.ts};
scripts/enterprise-local/compiled-smoke.mjs; .scratch/enterprise-local/windows-09b/.
Serial compile integration: fingerprint all tracked plugin/, openclaw/dist/,
dist/dsh-lib outputs; expected launcher/preflight/worker/MCP CJS/map pairs and ignored
NPX CLI. Extend reservation before retaining any other emitted change. No manifest,
lock, trust, generator or identity change planned. Existing E13 host templates and
native V3 adapter may remain next source work; no runtime activation claim.
Docs: AGENTS.md; docs/{roadmap.md,PATCH-SEQUENCE.md,EGRESS-INVENTORY.md};
docs/enterprise-local/{README.md,VALIDATION.md,DEV-ENVIRONMENT.md,NEXT-SESSION.md,
SESSION-PROMPTS.md,handoffs/WINDOWS-09B.md,memory/STATE.md,memory/TASKS.md,
memory/DECISIONS.md,memory/WORKLOG.md}. Completed bounded source/tests/G above;
all expected eight emitted outputs retained, no reservation extension needed.
No generator/manifest/lock/trust/private identity change; protocol bumped explicitly.
Exact remaining source gaps and rollback in handoffs/WINDOWS-09B.md. Current next
context is WINDOWS-09C/NEXT-SESSION; no active owner/reservations after closure.

## WINDOWS-09 reservation history — all released

Claimed after clean branch/HEAD check at 7d5f83cac2d9ca7694316bbc5d93bf8ca2ba9818.
Source: src/launcher/{ensure-launcher.ts,local-preflight.ts};
src/services/smart-file-read/tree-sitter-cli-provision.ts;
src/services/worker/{tree-sitter-cli-provisioning.ts}; src/services/worker-service.ts;
scripts/build-hooks.js (preflight description only).
Tests/harness: tests/enterprise-local/{windows-09.test.ts,compiled-smoke.test.ts};
scripts/enterprise-local/{compiled-smoke.mjs,windows-bundle.ps1};
.github/workflows/fork-local-validation.yml; .scratch/enterprise-local/windows-09/.
Compile integration lane: fingerprint all tracked plugin/, openclaw/dist/, dist/dsh-lib/
outputs; expected ensure-launcher.cjs/map, worker-service.cjs/map and ignored NPX CLI.
Review/extend before retaining other emitted deltas. No manifest/lock/trust edit.
Docs: AGENTS.md; docs/{roadmap.md,PATCH-SEQUENCE.md,EGRESS-INVENTORY.md};
docs/enterprise-local/{README.md,VALIDATION.md,DEV-ENVIRONMENT.md,NEXT-SESSION.md,
SESSION-PROMPTS.md,handoffs/WINDOWS-09.md,memory/STATE.md,memory/TASKS.md,
memory/DECISIONS.md,memory/WORKLOG.md}.
Completed bounded scope in S/G/H above; only four expected generated outputs changed.
No extra generated reservation needed. Source/generated reviewed; mock/compile/typecheck
results and limitations in handoff. E12/E13 and remaining private resolver/identity/native
adapter work explicitly deferred to WINDOWS-09B. No active reservation after closure.

## PLAN-ADAPT-05 reservation history — all released

Claimed at 48feeab567995de81d501b74007694b5ee95a880 after branch/status check.
Reserved: AGENTS.md; docs/{roadmap.md,PATCH-SEQUENCE.md,ARCHITECTURE-LOCAL.md,
RISK-REGISTER.md,EGRESS-INVENTORY.md,BASELINE.md}; docs/enterprise-local/{README.md,
AUDIT-CLOSURE.md,DEV-ENVIRONMENT.md,NEXT-SESSION.md,SESSION-PROMPTS.md,LLM-PROFILES.md,
VALIDATION.md,handoffs/PLAN-ADAPT-05.md,memory/STATE.md,memory/TASKS.md,
memory/DECISIONS.md,memory/WORKLOG.md}; .scratch/enterprise-local/plan-adapt-05/.
Read-only source/workflow inspection; historical source-pinned records and
source/INITIAL-PLAN.md preserved verbatim. Contracts/instructions aligned, document
checks PASS; no active reservation or application/runtime work. Local docs commit
follows in Git; rollback/limitations are in handoffs/PLAN-ADAPT-05.md.

## TELEMETRY-04 reservation history — all released

Claimed 2026-11-02 at clean 1f41cec12dd1c7f4e2a3ec70cd6aab1edf4140d4.
Source: src/services/telemetry/; src/services/worker-service.ts; src/utils/logger.ts;
src/cli/work-state-telemetry.ts; src/npx-cli/{index.ts,commands/telemetry.ts,commands/install.ts}.
Tests: tests/telemetry/; tests/fixtures/telemetry-04-*.ts; tests/npx-cli/telemetry-*.test.ts;
tests/utils/logger-*.test.ts (only if expectations require adjustment).
Disposable checks: .scratch/enterprise-local/telemetry-04/.
Documentation: AGENTS.md; docs/{roadmap.md,PATCH-SEQUENCE.md,EGRESS-INVENTORY.md,ARCHITECTURE-LOCAL.md};
docs/enterprise-local/{README.md,AUDIT-CLOSURE.md,DEV-ENVIRONMENT.md,NEXT-SESSION.md,
SESSION-PROMPTS.md,handoffs/TELEMETRY-04.md,memory/STATE.md,memory/TASKS.md,
memory/DECISIONS.md,memory/WORKLOG.md}.
Completed: S/G and checks in handoff; no active ownership. Historical claims below.

Validation reservation extension before edits: tests/services/worker-spawner.test.ts,
tests/preload.ts and bunfig.toml (mock evidence/comments only). Spawner tests will
delegate their capture spy to the real inert CLI boundary; retain mocked lifecycle.

Compile reservation (serial, before single reviewed build:compile): tracked generated
outputs under plugin/, openclaw/dist/ and dist/dsh-lib/ are fingerprinted; expected
deltas are plugin/scripts/*.cjs{,.map}, plugin/sqlite/SessionStore.js{,.map} and
plugin/skills/request-progress/scripts/request-groups.mjs from shared logger/CLI imports.
UI/manifests/locks/hooks and other generated files must stay unchanged; review and
explicitly extend scope before retaining an unexpected delta. No generator source,
manifest, lock or trust edits. No installed asset inspection beyond the approved
16 build input/compiler sentinels. Generated entrypoints will not be executed.

Post-compile review extension before retaining/staging: plugin/sqlite/observations/
files.js.map. Like server-service.cjs.map and SessionStore.js.map, its paired JS is
unchanged; only logger source line/name mappings move after comment cleanup. Review
these source lists and preserve compiler-emitted bytes; no SQLite behavior edit.

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

## Minimal context for proposed local host-binding source

- AGENTS -> README -> STATE -> roadmap step 9/graph/checkpoints -> TASKS.
- DECISIONS A19/A20/A26 and preserved invariants; current environment; NEXT-SESSION.
- LLM-PROFILES scope/auth/MCP and VALIDATION V1-V3/CI; current environment;
  PATCH-SEQUENCE section9 and 09F exact native/host/artifact/protocol inputs.
- No repeated API/audit/mock checks; concrete host binding needs source-scope and
  approved inputs first. Current unbound/exit1/native/runtime prohibitions persist.

Read handoffs/WINDOWS-09F.md first for completed API review and exact inputs;
do not repeat its checks/audit by default. Current NEXT-SESSION owns one bounded launch.

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
