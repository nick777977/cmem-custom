# TELEMETRY-04 — Node telemetry removed; local diagnostics retained

2026-11-02; one coordinator, serial, branch feat/cmem-light-local.
Entry **1f41cec12dd1c7f4e2a3ec70cd6aab1edf4140d4**, clean.
Source/tests **0abd4180b1971802d7939acba04d46960c4e8c14** (S); paired generated **6bb7c6995ea47e92ae0176bc88eac75bae871290** (G).
Explicit user launch of NEXT-SESSION step 4; no agents/branches/worktrees.
Status: **done-bounded** for E03/E04 Node dispatch, not full runtime/release acceptance.

## Source contract — VERIFIED IN CHECKOUT at S

- `src/services/telemetry/telemetry.ts:1–18`: no SDK/imports, config lookup,
  payload processing, client, hooks, timers, buffer or flush. captureEvent and
  captureException are inert; autocapture and repeated/late shutdown are inert.
- `src/services/telemetry/cli-telemetry.ts:2–6`: awaited CLI API retained without
  fetch, deadline timer, ID/config read or remote fallback. This also covers hook,
  installer/uninstaller and worker-spawner failure instrumentation.
- `src/services/telemetry/backfill.ts:478`: the independent historical PostHog
  client/job is retired; no DB scan, marker read/write or debug payload. Exported
  local calculation helpers remain for compatibility; worker no longer imports them.
- `src/services/telemetry/buffer.ts:1–18`: no payload storage, session rollup,
  interval/safety sweep or drain/flush. Session/context callers keep their API.
- `src/services/telemetry/consent.ts:16–26`: unconditional fork-policy OFF,
  including legacy saved enabled=true and TELEMETRY/ERRORS env opt-in. Legacy config
  helpers remain callable; persisting an enabled field cannot change effective policy.
  `common.ts:13–16` returns empty key/host regardless of legacy overrides.
- `src/services/worker-service.ts:639,920–922`: start has no logger exception bridge,
  supervisor telemetry reporter, lifecycle DB stats collection, telemetry-buffer start
  or backfill job. Local initialization/watchers and diagnostics remain.
  `:1159–1164,1895–1896` retain shutdown/error call shapes into inert APIs.
- `src/utils/logger.ts:74,435,441`: local file/stderr logging and optional
  swallow-all error-sink API retained; worker installs no remote sink. Logger edits
  are comments only. No log payload policy/retention redesign.
- `src/npx-cli/commands/telemetry.ts:2–11`: status/enable/disable truthfully report
  disabled fork policy, without prompt/config write. Unknown command sets exitCode 1.
  `commands/install.ts:3196` removes telemetry consent prompt; help describes fixed
  policy. Other installer/account/bootstrap behavior remains for step 9.
- `src/cli/work-state-telemetry.ts:25,41` checks fixed policy without loading saved
  config; no analytics spool/nudge. `src/services/telemetry/work-state.ts:31,74`
  gates analytics DB receipts, including the former opt-out privacy receipt write.
  Actual work-state/model context and ordinary observation spool/storage remain.

Static direct caller review covered worker boot/error/shutdown, SessionManager,
ClaudeProvider, GeneratorRunner, ResponseProcessor, Search/Session/WorkView routes,
hookCommand, worker-utils, installer/uninstaller and worker-spawner. None can opt
back into a removed sink. No CloudSync, Bedrock, launcher/bootstrap, viewer network,
SQLite schema, index, identity/sharing/filter or capture/retrieval source redesign.

## Actually executed checks

Existing Node **22.23.4**, npm **10.9.9**, Bun **1.4.4** verified. Reviewed fixtures
before execution. Synthetic HOME/USERPROFILE/config/data/temp/appdata/npm config /
cache under `.scratch/enterprise-local/telemetry-04/`; offline npm, audit/fund /
update notifier off, process-local PATH, credential/provider env cleared.
Each test file ran in its own Bun process with a reviewed preload blocking fetch,
Node sockets/listeners, child_process, Bun spawn/connect/listen/serve. No worker,
service, Python/model/MCP/plugin or actual inference started.

Final latest file results: **206 PASS, zero FAIL, 728 assertions; 18 files**.
Commands: exact Bun executable, `test --preload
./.scratch/enterprise-local/telemetry-04/test-guard.ts --timeout 20000
tests/<file>.test.ts` (one command, line-wrapped here).
Runner and per-file logs are disposable; conclusions persist here.

| File (under tests/, .test.ts) | PASS | Assertions |
|---|---:|---:|
| telemetry-telemetry-client | 3 | 23 |
| telemetry-error-capture | 1 | 8 |
| telemetry-shutdown | 1 | 2 |
| telemetry-buffer | 1 | 4 |
| telemetry-consent | 20 | 96 |
| telemetry-backfill | 15 | 96 |
| telemetry-work-state | 3 | 16 |
| telemetry-work-state-hook | 11 | 30 |
| telemetry-work-state-ingest | 14 | 57 |
| telemetry-install-stats | 5 | 25 |
| telemetry-scrub | 28 | 70 |
| telemetry-error-scrub | 47 | 112 |
| telemetry-skill-id | 12 | 36 |
| npx-cli-telemetry-policy | 2 | 9 |
| npx-cli-telemetry-scrub-installer-keys | 1 | 3 |
| services-worker-spawner | 26 | 98 |
| services-worker-shutdown-sequence | 12 | 32 |
| shared-worker-utils-fail-loud | 4 | 11 |

Negative evidence includes hostile input getters, legacy opt-in/key/host/debug,
zero constructors/capture/exception/flush/shutdown/transport, no process autocapture
listeners or telemetry timer, no first-use ID/config bootstrap, corrupt config /
markers, repeated/late shutdown, inert backfill without DB access, no buckets /
telemetry tables and no telemetry spool. Real local logger writes info/warn/error /
failure without a sink and when an optional sink throws. Hook failure retains its
nonblocking envelope and local diagnostic. Real registered SessionRoutes handlers /
validation run on synthetic request/response objects, with no HTTP listener;
public/private prompts, replay, queued tool timing, skip filters and durable memory
spool/ingestion remain covered. Identity resolution and lifecycle/providers are mocked.
This is bounded regression evidence, not live memory acceptance.

Initial fixture corrections: one remaining default-on expectation; missing req.query
in synthetic requests; Bun process.exitCode restoration; Windows spawner test leaked
its synthetic cooldown marker across scenarios. Reset now removes only that test-owned
marker; no production spawner edit. Initial guarded tests blocked 16 Git lookup
subprocess attempts from identity resolution (none executed); fixtures now explicitly
mock project identity. Corrected affected reruns have empty operation traces. Initial
failures were resolved; final counts above are not a sum of duplicate attempts.

## Single compile and generated pairing

One `npm.cmd run build:compile` at S, **PASS exit 0**. Reviewed build scripts and
unchanged BUILD-02 guard; no prepare/install/lock-resolution/deploy command. Inputs
were already present. Nine Node inits, five spawn events, one execFileSync, exec and
execFile; local generators/esbuild/tsc/Vite, including the known Vite `net use`
query. No Node socket/acquisition/deploy event observed. Native/shell grandchildren
are not fully covered; no OS-wide no-egress claim.

**16 inputs unchanged** pre/post compile and against CHROMA-07. Selected compiler /
installed-lock sentinels are not an exhaustive installed-tree/provenance proof.

| Input/sentinel | SHA-256 |
|---|---|
| package.json | dcdaa006f8b245ece40c6f3c5b7f9217204f597a891bb88514f5a0f0bf4c981d |
| scripts/build-viewer.js | e0d20fdfc4b9ade7bf007152c76cf33247c9d72951a86c088a94aa0eb886a16d |
| scripts/build-hooks.js | 98eca741aa7461a87ab28ce0c8108f9503581ee2ed706f4e1918f5ffd490aa7d |
| scripts/plugin-trusted-dependencies.json | 036ff6bd4fbd6fc3c854f2d4123eb106825d2558e8b703f8250df06d719ac0f8 |
| scripts/postinstall-allowlist.js | 68cdc604841bdb93e805af79a9f7040ddee43f8c74cace231f03a9d93e2730d9 |
| plugin/package.json | d54291d304e4d47208c83b3380e1ff53568de57d2fa08397bc5d936493f552d7 |
| plugin/bun.lock | 8db1a1527dd3a784622fcbe1ed7d036b67c0b807f7fd28a6aa9faa5f8bc2388e |
| package-lock.json | 52f962015654cdf33c008e1f5cf786a2786ec96113dd1484e37880bd8613ed99 |
| src/ui/my-work/package.json | 2759077e8ffdb654ce09fc40ebcfcb59c99dab81cce79d435bba541b9b3098ae |
| src/ui/my-work/package-lock.json | ec0f529c410222930462e8994e33a2367450c1d179b75dc0df969dfb4599c1e3 |
| node_modules/.package-lock.json | 11b9f03d031d670fa4968e8217c08c378786c03c9ebb50a2a21147a344584e79 |
| src/ui/my-work/node_modules/.package-lock.json | 47cc1cd49a4cbc7ba06bbb02ebe6fff29aaf3414b395f865e399ee563a45bdad |
| node_modules/esbuild/package.json | 9d0bc453f4e791553c4cc2298ba023b409241fd9801e494741666eb0f6051490 |
| src/ui/my-work/node_modules/typescript/bin/tsc | 8d5fa5bd883fec0979fc2004f1fe1d99aef40570155d550eadc0b03b55513bf0 |
| src/ui/my-work/node_modules/vite/bin/vite.js | de5833362e640673962f16e255bf8738d4380a68601b9af26217eee4e1bac36d |
| scripts/check-postinstall-allowlist.js | 9b28be193552d510f20e1b9133f27694854fd79f13702356c0fa6d942b5cbc89 |

G contains **14 modified / 178 unchanged of 192 tracked outputs**, no added/deleted
tracked output; UI unchanged. Five script CJS/map pairs, request-groups.mjs and three
map-only edits. server-service.cjs, SessionStore.js and observations/files.js bytes
unchanged; source lists in their changed maps unchanged (logger line mappings moved).
Generated syntax and ten available map source lists checked; no PostHog SDK source
in these closures, no retired backfill/install-stats in worker map, default PostHog
host/key absent in changed emitted code. Chroma refusal marker retained. Maps without
sourcesContent do not independently establish embedded-source equality. Ignored CLI/harness outputs were compiled too. dist/npx-cli/index.js syntax PASS,
fixed policy text present and former telemetry host/key/SDK name absent; SHA-256
479b2bb19dc8dcf47d88bdf2ba5262fc41cb6e468bd08df19ac680c1dd26018d. This ignored output is not a tracked shipping artifact; final packaging /
provenance remains step 10/12.
Known generated-worker trailing-whitespace warning retained; source/test whitespace
PASS. Never hand-edit emitted bundles to silence it.

Evidence fingerprints (SHA-256):

| Evidence | SHA-256 |
|---|---|
| compile.log | 600312c2160cfe9114719187db1dbc33bb1788b7ad7334092c0468c8dfef33c3 |
| compile-guard.cjs | 851d5c238998758aab8b79757cb68c2ba67e7a5c764affee2fd5733180c76115 |
| children.jsonl | 0af4674d5d398174c4446cde4e4dade00707c95d47b9cf93c5c8ffee28b515a1 |

## Limits, rollback and next increment

posthog-node remains declared/installed; dependency/lock pruning belongs to step 10.
Python telemetry E11 remains unverified and Chroma activation blocked by U1/D9;
D11 stays open. Other remote capabilities E05+ and release gates are unchanged.
No full capture -> SQLite -> Chroma -> restart -> viewer -> approved Bedrock smoke,
real settings/credentials/memory access, artifact acquisition, machine registration,
AWS, push or OS-wide/provenance/reproducibility acceptance.

Rollback: revert **G then S** as matched local concerns; preserve baseline, locks,
installed assets and all user data. Reverting S restores remote telemetry capability;
rollback is not a safe-to-run release configuration. Documentation commit follows S/G.
Current shared memory/affected contracts updated; reservations released at closure.
Next proposed launch: **WINDOWS-09 / step 9**, the other roadmap wave-4 increment,
source-only deterministic private Windows paths/bootstrap refusal. D5/actual private
registration policy remains a separate user gate; do not install/register/start it.
