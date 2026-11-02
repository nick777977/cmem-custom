# HOSTED-03: hosted setup and historical upload retired

Date: 2026-11-02. Branch `feat/cmem-light-local`, one coordinator, serial, no agents.
Entry `f7df0cccdf31a9f3519af598b1209c4a51968333`, clean index/worktree.
**S = `4174839497f8cc1247b864bd1c889e2a2b649738`** (source/tests).
**G = `298d447423c2ebf7404ce79329683484902080b7`** (paired generated outputs).
Documentation commit follows G in Git history.

## Outcome and contract

Step 3 is **done-bounded**: retained CLI/worker/viewer entrypoints cannot dispatch
E01 hosted extraction or E02 history upload. The user explicitly accepted P10 as A15:
step 2 is **boundary accepted for source progression, release evidence pending**.
No graph edge/wave changed. Neither step is shipped/full no-egress acceptance.

The live E01/E02 chains were rechecked at entry, rather than repeating the full audit:
WorkViewRoutes wired SetupScan to HostedIntent (entry lines 438–453, 577–580), whose
run posted compressed prompts to `/api/pro/intent` (entry hosted-intent.ts:171).
WorkerService constructed HistoryImport (entry worker-service.ts:601–605); the setup
import route invoked it (entry WorkViewRoutes.ts:597,624–633), and history-import.ts:101–118
read observations and posted them to the configured origin's `/api/import`.

All paths below are repository-relative; line citations are inspected at **S** unless
explicitly marked **G**. They are static source evidence; test observations are separate.

| Path:line | Implemented behavior |
|---|---|
| `src/services/worker/http/routes/WorkViewRoutes.ts:500` | Every method on `/api/setup` and descendants returns 410 after the retained loopback guard. This covers state, scan, preferences, choice, installer, checkout, import, complete and unknown legacy suffixes. No setup state/settings/history read, scanner, extractor, upload, SSE subscription or fallback. |
| `src/services/worker/http/routes/WorkViewRoutes.ts:238,324,369,528` | Legacy injected clients/paths are ignored; no client construction or scan callback. Stale/corrupt hosted markers cannot pause local refresh/copy. The explicit local auto-refresh off setting remains effective; local extraction snapshot remains, with scan=null. |
| `src/services/worker-service.ts:581` | WorkViewRoutes retains local work-state writes and the existing ViewerRoutes registration at :590; SetupScan and HistoryImport boot wiring/imports removed. No capture/storage/search/sync/schema implementation changed. |
| `src/services/work-view/hosted-intent.ts:28` | Compatibility class rejects even empty/signed-in calls before credentials, origin, database, filesystem, saved response or fetch access. No provider fallback or replay of historical hosted output. |
| `src/services/setup/history-import.ts:22,39` | Local own-history counts retained; uploader is an inert rejecting compatibility class. Old tokens are never read or used. Existing local data is not migrated/deleted. |
| `src/npx-cli/commands/install.ts:2977,3024` | Browser funnel/start-pairing/checkout handoff and its restart branch removed from the actual installer caller. Retained terminal provider flow remains. |
| `src/npx-cli/install/browser-setup.ts:14,50,84` | Predicate always false; direct setup/polling helpers reject before transport/browser/checkout/apply callbacks. |
| `src/ui/my-work/src/App.tsx:98` | Always mounts WorkApp, including old `?setup=1` URLs. No lazy import or registration gate. |
| `src/ui/my-work/src/setup/setup-page.tsx:1`; `setup-data.ts:111` | Compatibility page has only a local-viewer action. Pending=false without a request; all hosted actions reject, subscription opens no EventSource or request. Local search, save-note and delete-note methods remain at :129–136. Other setup/work-view utilities and assets in source are preserved. |

`src/services/worker/http/routes/DataRoutes.ts:236` is the **local** `/api/import`
receiver; it is intentionally retained. A URL substring alone cannot distinguish it
from the removed outbound E02 client. Telemetry E03/E04, cloud sync E05, terminal
installer/OAuth/bootstrap E12, existing background inference E20, viewer GitHub requests
and later artifact pruning remain their owning increments. Removing the obsolete setup
pause lets retained local refresh/copy run under existing settings; it does not establish
Bedrock-only enforcement. No agent/inference job ran during this task.

## Validation actually run

Exact existing executables: Node **22.23.4**, bundled npm **10.9.9**, Bun **1.4.4**
(`38afee6c8`), verified by version commands. Process-local PATH prefixed the documented
Node directory and `.bun/bin`; no permanent environment/toolchain changes.

Before execution, selected tests/preload, fixtures and subprocess/env/network behavior
were read. All HOME/USERPROFILE, Claude config, data, TEMP/TMP, APPDATA/LOCALAPPDATA
pointed under `.scratch/enterprise-local/hosted-03`. AWS/Anthropic/Claude/CMEM/Codex
environment overrides were removed from these child environments, then synthetic
paths set. No real settings, credentials, transcripts or memory were read. DO_NOT_TRACK
was set; the existing root preload mocks PostHog and Claude login readiness.

Final targeted run: **58 PASS, 0 FAIL, 249 assertions, 11 files; exit 0**.

```text
bun test --preload ./.scratch/enterprise-local/hosted-03/test-guard.ts --timeout 20000
  tests/npx-cli/browser-setup.test.ts
  tests/npx-cli/browser-setup-checkout.test.ts
  tests/npx-cli/browser-setup-install.test.ts
  tests/work-view/hosted-intent.test.ts
  tests/services/setup/history-import.test.ts
  tests/worker/http/routes/setup-scan-routes.test.ts
  tests/worker/http/routes/setup-state-routes.test.ts
  tests/worker/http/routes/setup-extraction-routes.test.ts
  tests/ui/my-work/hosted-setup.test.ts
  tests/worker/http/routes/work-view-routes.test.ts
  src/ui/my-work/src/setup/setup-search.test.ts
```

The command above is line-wrapped for readability. The disposable preload allows fetch
only to 127.0.0.1 HTTP and rejects Bun subprocesses. UI esbuild only compiles fixture
components; no browser or application is started. Synthetic HTTP fixtures bind ephemeral
loopback ports and use local SQLite fixtures; they never instantiate WorkerService.
The old broad installer subprocess fixture was replaced by a static actual-caller
regression, **not** presented as an executed install/Claude Code acceptance test.

Negative proof includes explicit zero-call assertions on global/injected transport,
credential/database callbacks, scanner/extractor/import methods, checkout/reopen,
browser/apply callbacks and EventSource, including synthetic signed-in and old-token
inputs. See tests/work-view/hosted-intent.test.ts:6, services/setup/history-import.test.ts:5,
npx-cli/browser-setup.test.ts:14, browser-setup-checkout.test.ts:4,
ui/my-work/hosted-setup.test.ts:17, and the shared route fixture
tests/fixtures/hosted-03-routes.ts:1. Route negative assertions are at
setup-scan-routes.test.ts:9, setup-state-routes.test.ts:16, setup-extraction-routes.test.ts:15
under tests/worker/http/routes/. These are not merely removed happy-path expectations.

Retained regressions exercise local work/evidence, review persistence across fixture
restart, source health/SSE, ordering/sharing/filter-related existing projections,
local counts, search and note save/delete. Unrelated assertions in work-view-routes
remain; two Windows fixture adjustments finalize SQLite handles before directory
cleanup and close the fixture reader before deleting its database (:60,:380).
No production SQLite behavior changed to make these tests pass.

Intermediate failures, resolved before the final run: unnamed Express wildcard was
replaced by an exact setup-prefix RegExp; an incorrect new fixture field assertion was
corrected; Windows SQLite cleanup was adapted as above. Sandbox loopback fetch returned
EACCES, so the same isolated tests ran with approved execution outside the sandbox.
No automatic approval rejection occurred. No service/worker/plugin was started.

### One authorized compile and generated checks

After application source changed, **one** `npm.cmd run build:compile` ran at S:
**PASS exit 0**. Local viewer tsc/Vite, all bundle-integrity/distribution/attribution
and Rule A checks passed. No preparation, installer, lock resolution, runtime repair,
build-and-sync, deployment or restart command ran. Missing inputs would have failed;
the existing local inputs sufficed.

Compile used empty scratch npm user/global config, scratch npm cache, offline=true,
audit/fund/update-notifier=false, synthetic paths above and the unchanged BUILD-02
Node preload (`NODE_OPTIONS=--require=<forward-slash absolute scratch guard path>`).
Observed trace: 9 Node initializations, spawn=5, execFileSync=1, exec=1, execFile=1.
Children were local esbuild, viewer npm run build -> tsc/Vite, generators and Vite's
`net use` drive query. No Node socket event or forbidden acquisition/deploy child.
This is **not OS/process-wide network capture or enforcement**; native/shell network
coverage and full runtime acceptance remain step 11.

Built-in-only artifact checks **PASS exit 0**: worker vm.Script parse; worker source map
excludes hosted-intent/history-import/setup-scan; `/api/pro/intent` absent from worker;
actual emitted UI/index contains no setup API/dynamic chunks; referenced JS exists;
Node `--check` on the new UI JS passes. Root/plugin npm maps still match (30 entries).
An initial overbroad `/api/import` substring assertion hit the retained local receiver;
it was corrected to the mapped outbound-client closure test, without deleting local API.

At G, `plugin/ui/work-view/index.html:8` points at `assets/index-DInrJkv2.js`.
Generated delta: worker CJS/map + HTML modified, new main JS replaces old main JS,
and seven additional obsolete setup-only chunks/font/images removed by Vite's existing
emptyOutDir behavior (eight deletions total including old main JS). **12 files** in G.
Of 199 pre-existing tracked outputs, 188 stayed byte-identical, 3 changed and 8 were
removed; one new JS was added. Classic viewer, manifests/locks and other bundles unchanged.
Ignored dist/npx-cli was rebuilt by compile but is not claimed as a tracked release artifact.

Source/test whitespace checks PASS. Generated worker `git diff --check` reports a
trailing-whitespace warning at worker-service.cjs:143 in emitted dependency text,
consistent with the known generated-baseline limitation. Generator bytes were retained,
not hand-formatted; this is not a clean generated-whitespace claim.

## Input preservation and evidence fingerprints

All **16** selected input/sentinel hashes matched before/after compile; no missing input.
The first 15 are the BUILD-02 fingerprint set, at the accepted C revisions for canonical
and plugin npm maps, plus the unchanged allowlist guard. No dependency/trust/version/
lock/graph change. This is a sentinel check, not an exhaustive installed-tree or clean
root-lock provenance proof. Compiler cache writes are allowed.

```text
dcdaa006f8b245ece40c6f3c5b7f9217204f597a891bb88514f5a0f0bf4c981d package.json
e0d20fdfc4b9ade7bf007152c76cf33247c9d72951a86c088a94aa0eb886a16d scripts/build-viewer.js
98eca741aa7461a87ab28ce0c8108f9503581ee2ed706f4e1918f5ffd490aa7d scripts/build-hooks.js
036ff6bd4fbd6fc3c854f2d4123eb106825d2558e8b703f8250df06d719ac0f8 scripts/plugin-trusted-dependencies.json
68cdc604841bdb93e805af79a9f7040ddee43f8c74cace231f03a9d93e2730d9 scripts/postinstall-allowlist.js
d54291d304e4d47208c83b3380e1ff53568de57d2fa08397bc5d936493f552d7 plugin/package.json
8db1a1527dd3a784622fcbe1ed7d036b67c0b807f7fd28a6aa9faa5f8bc2388e plugin/bun.lock
52f962015654cdf33c008e1f5cf786a2786ec96113dd1484e37880bd8613ed99 package-lock.json (existing ignored input)
2759077e8ffdb654ce09fc40ebcfcb59c99dab81cce79d435bba541b9b3098ae src/ui/my-work/package.json
ec0f529c410222930462e8994e33a2367450c1d179b75dc0df969dfb4599c1e3 src/ui/my-work/package-lock.json
11b9f03d031d670fa4968e8217c08c378786c03c9ebb50a2a21147a344584e79 node_modules/.package-lock.json
47cc1cd49a4cbc7ba06bbb02ebe6fff29aaf3414b395f865e399ee563a45bdad src/ui/my-work/node_modules/.package-lock.json
9d0bc453f4e791553c4cc2298ba023b409241fd9801e494741666eb0f6051490 node_modules/esbuild/package.json
8d5fa5bd883fec0979fc2004f1fe1d99aef40570155d550eadc0b03b55513bf0 src/ui/my-work/node_modules/typescript/bin/tsc
de5833362e640673962f16e255bf8738d4380a68601b9af26217eee4e1bac36d src/ui/my-work/node_modules/vite/bin/vite.js
9b28be193552d510f20e1b9133f27694854fd79f13702356c0fa6d942b5cbc89 scripts/check-postinstall-allowlist.js
```

Scratch evidence under `.scratch/enterprise-local/hosted-03/` is disposable; the
decisions, results and limits above are the durable record. SHA-256:

```text
e2173e0d0193013e56e35044fcb49014dd2d8a25c7fb4cb3c0c4fb1985401a50 tests.log
319220371d8b7d6a11964d88c91adb13aedcca52d8db63d05979077716845c17 compile.log
418645f0a2f5183d13004031423942d878be31758820c2606fe05ba19971bb4b children.jsonl
851d5c238998758aab8b79757cb68c2ba67e7a5c764affee2fd5733180c76115 compile-guard.cjs
dd634323a515e520aeed445b589c4a4cf55ff5958dc10c551ba5970a2bb49b90 plugin/scripts/worker-service.cjs
18ebae8ad29262415122139185812832d57679ccf7aee415be0262d6e8d4b501 plugin/scripts/worker-service.cjs.map
6d2db59355f9ab27f8bebe7de2defcd7fd98eb6a2a45c5d9b2ca0137c45a893c plugin/ui/work-view/assets/index-DInrJkv2.js
4d047c7f8d10cafad7319b1805b4d710372eebaa38e8b68876fe59f6ed393827 plugin/ui/work-view/index.html
```

## Completion, limits, rollback and next task

All five HOSTED-03 bounded criteria are met: E01/E02 disconnected and inert; actual
negative/local regression passes; source/generated pair and compile; preserved inputs;
logical commits, citations, rollback and updated shared handoff. No install/download/
upgrade, AWS/live inference, services, plugin registration, real user state, push,
branch/worktree or subagent. The Codex-hook fixture was not used.

Full capture -> SQLite -> Chroma search -> restart/retrieval -> viewer -> approved
Bedrock smoke, OS-wide egress and source/native/Python/model/artifact provenance are
**UNKNOWN / pending**, assigned to steps 7/10/11/12 as appropriate. Other remote
clients remain open in their own steps. This task does not finish the fork.

Rollback: revert **G then S** (paired artifacts then source/tests), resolve only later
overlap if any. This restores hosted capability; do not run restored hosted setup
against real state. Preserve 49e4f65e1/ce7ded4dc/153a9953c/8bc557532, dependencies,
locks and SQLite/Chroma data. No reset/clean/reinstall/service operation is required.

Stop here. One next proposed bounded task is **CHROMA-07**, roadmap step 7: local
pre-provisioned Chroma/embedding integration, no asset acquisition without separate
explicit source/lifecycle permission. See [NEXT-SESSION](../NEXT-SESSION.md).

Session-close checks: 14 changed/new Markdown files, 66 relative file links valid;
source citations rechecked against S and HTML citation against G; all 16 input
fingerprints still unchanged. Roadmap dependency graph and execution waves are
byte-identical to entry after normalizing CRLF. Documentation whitespace checks pass.
