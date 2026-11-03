# Development baseline and user-provided execution evidence

Updated: 2026-11-03. Supersedes the pre-install assumption in the 2026-10-30 launcher.
This is not full runtime acceptance. Session 02 subsequently ran authorized step-2
compile/targeted checks; see the current section below and [BUILD-02](handoffs/BUILD-02.md).

## Preferred local toolchain

Latest **WINDOWS-09E** (2026-11-03): H98a6d019c, harness/tests only. Existing Bun
1.4.4+38afee6c8 verified; Node22.23.4/npm10.9.9 baseline retained, not re-executed.
One affected-file V1 run: 16 PASS/337 assertions, zero forbidden process/network/
listener/fetch events. Synthetic allowlist state only windows-09e scratch; no real
assets/state or application/generated child. No compile/typecheck replay, install,
dependency resolution or toolchain change. 09D one-compile/19-input/869-source/192-output
evidence below preserved, not repeated. Native remains BLOCKED, V3-V6/CI NOT RUN;
step9 partial. Next WINDOWS-09F remaining-source OS substrate/API and artifact-interface
review. [Actual checks, limits and rollback](handoffs/WINDOWS-09E.md).

Earlier **WINDOWS-09D** (2026-11-03): B855ef7d6e/S236dd661c/H2935e19d0. Exact
existing Node22.23.4/npm10.9.9/Bun1.4.4 verified, no install/update/resolution. 20 V1
tests/433 assertions PASS; zero process/network/listener/fetch tripwire events.
Authored-source VM/extracted installer bodies/copied-artifact mocks only; no emitted
application executed. Root --noEmit FAIL exit2, exactly three baseline TS2345 at
ChromaMcpManager227/842, ChromaSync385, diagnostic bytes equal09C; viewer PASS.
One reviewed build:compile PASS with unchanged BUILD-02 guard; 9 Node inits/5 spawns/
one execFileSync/exec/execFile, local compilers/generators/Vite net use, no Node socket
event. Not native/shell/OS-wide no-egress. 19 inputs/869 source sentinels/192 tracked
outputs unchanged across compile; no emitted tracked delta/new generated commit.
Eight canonical outputs paired in B before compile, only intentional build-hooks input
delta vs09C; manifests/locks/trust/compiler/identity/protocol/UI/provider files preserved.
Synthetic allowlist state exclusively windows-09d scratch; empty npm configs/isolated
cache/offline, process-local PATH, no real state/assets read. No postcompile source/
generator/harness edits or redundant test replay. Unbound host templates are not
runtime-ready, native BLOCKED; V3-V6/CI NOT RUN. Step9 partial, U1/D9/D11/D12/A15
10/11/12 open. [Exact evidence/limits/rollback](handoffs/WINDOWS-09D.md). Next:
WINDOWS-09E remaining source, common harness admission/teardown failures only.

Earlier **WINDOWS-09C** (2026-11-03): S bc3275b4c/H abfce3963/G 4ac6ad868;
host/generator 2d8688e78, CLI 4945a916e, installer utilities c9978be26. Exact existing
Node22.23.4/npm10.9.9/Bun1.4.4 verified. 20 isolated source/mock tests / 234 assertions
PASS; ten affected copied-artifact mock cases repeated after G PASS / 107 assertions,
not thirty unique tests. Zero process/network/listener/fetch tripwire events.
One reviewed build:compile PASS, unchanged BUILD-02 guard; 9 Node inits/5 spawns/
one execFileSync/exec/execFile, local compilers/generators/Vite net use only. No Node
socket event, not OS/native/shell no-egress proof. Final viewer --noEmit PASS;
root FAIL exit2, same three TS2345 ChromaMcpManager227/842 and ChromaSync385, full
diagnostic bytes equal 09B. No Chroma workaround, toolchain/dependency/lock change.

Synthetic env/state only under .scratch/enterprise-local/windows-09c, ambient env
cleared, process-local exact PATH, empty npm configs/cache/offline. No installed
user assets/settings/auth read. 19 input/compiler sentinels unchanged across compile;
vs 09B only intentional scripts/build-hooks.js delta, 18 preserved. 868 source/config
sentinels unchanged across compile. 192 outputs: 190 unchanged/MCP CJS-map pair
modified; seven host configs/wrappers paired earlier from canonical source. UI,
worker, protocol-3 launcher/preflight, identity/locks/trust/provider/native-login
implementations preserved. Native-kind adapter blocked before launch. V3-V6/CI
NOT RUN; no actual generated process, auth/inference/AWS/acquisition/registration.
[Exact commands/hashes/limits/rollback](handoffs/WINDOWS-09C.md). Full step9 remains
partial; next WINDOWS-09D remaining source. No application/harness/generator edit
after compile. A15 10/11/12 and U1/D9/D11/D12 remain open.

Earlier **WINDOWS-09B**: S e3d91a505/H bbc3847e9/G 62a468f6d; exact existing
Node 22.23.4/npm 10.9.9/Bun 1.4.4 verified, no install/update. 19 reviewed inert/mock
tests/112 assertions PASS; affected nine copied-artifact mock tests rerun after
compile PASS (57 assertions; repeated cases, not 28 unique tests). Zero forbidden
process/network/listener operations. One reviewed build:compile PASS with unchanged
BUILD-02 guard; viewer --noEmit PASS; root FAIL with exactly three baseline TS2345
(ChromaMcpManager 227/842, ChromaSync 385), text matches WINDOWS-09. No new overlay.
19 inputs unchanged across compile and vs previous; 866 selected tracked source/
config sentinels unchanged across compile. 184/192 outputs unchanged, four expected
CJS/map pairs changed. Generators, manifests/locks/trust/identity/UI unchanged;
protocol 2 -> 3 explicitly separate from identities/locks. All synthetic env/state
under .scratch/enterprise-local/windows-09b; same exact tool paths/allowlist/guard,
empty isolated npm configs/cache/offline. Nine Node inits/five spawns, one
execFileSync/exec/execFile including known Vite net use, no Node socket event;
not native/shell/OS-wide no-egress. No actual generated process/CI/model/auth/user
state or installed asset inspection beyond the 19 approved sentinels. Closure
resumed 2026-11-03 at identical checkout/fingerprints, no test/compile reruns.
[Exact commands/hashes/limits/rollback](handoffs/WINDOWS-09B.md). Full step 9 open;
next WINDOWS-09C remaining source. Root typecheck and A15 release gates remain open.

Earlier **WINDOWS-09**: S0d0a4b176/G004588740/Hf2c722fad; exact baseline verified,
no install/update. 17 reviewed inert/mock tests / 53 assertions PASS, four expected
PowerShell planner refusals plus parser PASS, one reviewed pure compile PASS. Viewer
typecheck PASS; root FAIL (three baseline TS2345, same entry Git-source overlay).
19 selected inputs unchanged across compile, 188/192 tracked outputs unchanged; two
expected CJS/map pairs changed. Generator comments are the only intentional difference
from the prior 16-input set. No manifest/lock/trust/compiler mutation. Added root compiler
sentinels: bin/tsc 8d5fa5bd883fec0979fc2004f1fe1d99aef40570155d550eadc0b03b55513bf0,
lib/tsc.js 2cffde0b8c6760dfb0b5b0382bbb7e00ba6a8b2d981b9205b256a700a481d983,
lib/_tsc.js 1c59e77a54b186ec43fa7f3e0d3c4bb15ca5eb5ba43e96b1d3a267139eddd3e3.
Allowlist env replaced ambient inheritance; synthetic CODEX_HOME/home/config/data/temp,
isolated npm config/cache/offline, unchanged BUILD-02 guard. No actual generated process,
MCP/worker/hook/service/listener/CI/live provider or installed model/assets inspection.
CI is a blocked source skeleton. [Commands, hashes, bounds](handoffs/WINDOWS-09.md).
Earlier sections below are historical evidence, not a claim of current readiness.

Use these exact known-working versions for local fork development until an accepted
decision changes the baseline (A09). Do not upgrade/reinstall by default.

| Tool | Version | Evidence received 2026-11-02 |
|---|---|---|
| Node.js | **22.23.4** | User supplied `node -v` -> `v22.23.4` |
| npm | **10.9.9** | User supplied `npm -v` -> `10.9.9` |
| Bun | **1.4.4**, build `38afee6c8` | Build transcript, final lock-generation step |
| Vite | 8.3.4 | My Work production build transcript |

User reports unsuccessful attempts on Node 24 and possibly 20; exact patch versions
and errors were not supplied. Prefer the baseline above; do not declare all other
versions incompatible. Root `package.json:68–70` still has broader engine ranges;
the earlier docs task did not change engine/toolchain configuration. Session 02 verified
exact local executables below; historical user-run executable paths were not logged.

## Evidence received, not rerun

Exact execution timestamp and tested source/lock hashes were not recorded. Build attachment
`Pasted text.txt` SHA-256:
`eed04974771e3640e6aa1ae0be62453db03494556e74271aac70a544be209782`.
This sanitized summary is durable; the external attachment is not a future prerequisite.

```text
npm run build
> node scripts/sync-plugin-manifests.js && node scripts/build-hooks.js && node scripts/gen-plugin-lockfile.cjs
added 478 packages in 26s
> my-work-wireframe@0.0.0 build
> tsc -b && vite build
vite v8.3.4 building client environment for production...
✓ 2921 modules transformed.
✓ built in 1.80s
✓ All required distribution files present
✓ Rule A shell templates match the canonical generator
✅ All build targets compiled successfully!
bun install v1.4.4 (38afee6c8)
Checked 90 installs across 96 packages (no changes) [36.00ms]
✓ plugin/bun.lock generated

npm run worker:start
> bun plugin/scripts/worker-service.cjs start
[SETTINGS] Created settings file with defaults: <user-home>/.claude-mem/settings.json
{"continue":true,"status":"ready","suppressOutput":true}

node -v
v22.23.4
npm -v
10.9.9
```

| Scenario | Result / provenance | Limit |
|---|---|---|
| Dependency preparation | USER-REPORTED successful; viewer install and plugin package check visible in log | Full root install commands, resolved root graph, registry and lifecycle history not supplied |
| Existing `npm run build` | USER-LOG completed all configured targets; no failure shown | Includes acquisition; not pure/offline compile proof; exit code/tested commit not recorded |
| Viewer, distribution/template checks | USER-LOG success | Build checks, not application/regression tests |
| `npm run worker:start` | USER-LOG `status: ready`, defaults creation reported | No independent health/viewer/capture/SQLite/Chroma/Bedrock/egress evidence; current process state UNKNOWN |
| Automated tests / pure compile / no-download startup | PENDING | No supplied results; agent did not run them |

Non-fatal warnings: deprecated tsparticles packages; Vite future native config-loader
warning for __dirname; large UI chunk; advisory worker/MCP/watcher bundle sizes.
Do not turn warnings into unsolicited upgrades/redesign. The user-run worker may have
initialized normal state; do not read/stop/restart/delete/reuse it for tests without authorization.

## Historical Git and source delta before Session 02

Branch `feat/cmem-light-local`; entry HEAD
`62e79cceb26abb5bc8117ecd11f798ce38f30f60`. No newer commit visible, despite the user's
recollection of committing. **9 tracked modified files + 1 untracked source input**,
nothing staged. Preserve them. A later docs commit does not include these source changes.

| Files | Inspected change / purpose |
|---|---|
| `package.json:250–251` | Root allowScripts adds onnxruntime-node and msgpackr-extract |
| `src/ui/my-work/package.json` | Version-qualified allowScripts entry for @tsparticles/engine@3.9.1 |
| `scripts/build-hooks.js:558–573`, new `scripts/plugin-trusted-dependencies.json` | Generator merges file-supplied native list into Bun trustedDependencies, preserving it across generated manifest writes |
| `plugin/package.json`, `plugin/bun.lock` | Expanded trustedDependencies; tracked lock diff changes trust list, not package versions/integrities |
| Worker/transcript-watcher CJS + .map files | Rebuilt output changes; no source-by-source equivalence or dependency-security proof; minified diff not recursively audited |

**Known baseline issue — static, not a run test:** root allowScripts includes two names
absent from `scripts/postinstall-allowlist.js`. Generator still derives plugin allowScripts
from that list. `scripts/check-postinstall-allowlist.js:98–130` requires exact root/plugin
key equality, so the current root declaration would hit drift check if execution reaches
it. Not run. New Bun trust JSON is a policy input, not proof of approved downloads/scripts.
Review actual necessary scripts/npm/Bun behavior before changing policy; do not weaken
the guard or automatically trust every package to obtain a green check.

Working-tree fingerprints at inspection (SHA-256; not immutable source commits):

| Path | SHA-256 |
|---|---|
| package.json | fa640c8d41150f4eee3a52fdfb1a4fb121bce9e8c8a021d3554ef25e9baed08c |
| plugin/bun.lock | 8db1a1527dd3a784622fcbe1ed7d036b67c0b807f7fd28a6aa9faa5f8bc2388e |
| plugin/package.json | a5a974e20d9a0b0e9e217d62597afabacf93699c6c7748c91897032f488b04df |
| scripts/build-hooks.js | 98eca741aa7461a87ab28ce0c8108f9503581ee2ed706f4e1918f5ffd490aa7d |
| scripts/plugin-trusted-dependencies.json | 036ff6bd4fbd6fc3c854f2d4123eb106825d2558e8b703f8250df06d719ac0f8 |
| src/ui/my-work/package.json | 2759077e8ffdb654ce09fc40ebcfcb59c99dab81cce79d435bba541b9b3098ae |
| plugin/scripts/worker-service.cjs | d716fd596efabb9aa3afd0b8f02f5a715db1c819c022c58c0d640970a27ee053 |
| plugin/scripts/worker-service.cjs.map | baf333f85c5d17a203280d4ae9f425a12f1535b28e5e533d653c03b66f8d6a95 |
| plugin/scripts/transcript-watcher.cjs | bccb20b10bb3dbaa30690433e60c16820abe422bd4fdfc89429dc6c0174d5230 |
| plugin/scripts/transcript-watcher.cjs.map | c0282f56196c1969922e83dc81c7ba9330f6ea3fc12b55ffde09d901ab5b86b5 |

Suggested titles; no history rewrite or user source commit in this docs session:

- Inputs/generator/manifests/lock: `build: configure native dependency lifecycle permissions`.
- Four rebuilt CJS/map files, after provenance check: `build: refresh worker and transcript watcher bundles`.
- If kept as one setup snapshot: `build: configure native install permissions and refresh plugin bundles`.

These subjects describe setup, not egress removal/full test success/completed step 2.
Only explain original install errors in a body when the actual errors are available.

## Historical Session 02 environment and results

Entry `4d773b4b7`; baseline inputs preserved in `49e4f65e1`, four bundles/maps in
`ce7ded4dc`. All 10 historical hashes matched. Compile source is
`153a9953c3e62534ff3b96afc228645b88911399`; test fixture update is `705cd1dc9`.
No user source WIP remains from the historical list. Trust JSON and its generator
wiring are retained. No dependency installation/update or lock resolution ran.

Default PATH had Node 24.22.2/npm 11.19.1 Volta shims and no Bun. Correct local
tools are already present; use only a process-local PATH prefix, without Volta/nvm
switch/install or permanent PATH writes:

```powershell
$toolDir = 'C:/Users/MykolaPushnikov/AppData/Local/Volta/tools/image/node/22.23.4'
$env:PATH = $toolDir + ';C:/Users/MykolaPushnikov/.bun/bin;' + $env:PATH
node --version    # verified v22.23.4
npm.cmd --version # verified 10.9.9, bundled under the same toolDir
bun --version     # verified 1.4.4 (38afee6c8)
```

Agent `npm.cmd run build:compile` passed, as did 6 inert boundary checks and 21
committed-bundle syntax checks. Generator/distribution/template/attribution checks
passed inside compile. 199 tracked outputs and 15 selected input/sentinel hashes
were unchanged. The existing ignored root `package-lock.json` fingerprint is recorded
in BUILD-02; it was not added to Git or regenerated. Cache writes are permitted;
there was no exhaustive dependency-tree hash or clean-build provenance proof.

Compile used synthetic HOME/config/data, empty npm user/global config, scratch npm
cache/offline mode and Node-level child/network tripwires. Observed children included
local esbuild/tsc/Vite and Vite's `net use` mapped-path query; no installer, lock
resolution, deploy/restart/runtime-repair command or Node socket event. OS-wide
network enforcement/capture remains pending; do not claim full no-egress.

Allowlist guard was now RUN: **FAIL exit 1, root drift**, exactly the known two extra
entries. Canonical list/guard were not changed. onnxruntime-node 1.23.2's postinstall
can acquire optional NuGet binaries; msgpackr-extract 3.0.4's installer can fall back
to node-gyp rebuild (narrow static local-script evidence, no execution/approval).
BUILD-02-TRUST subsequently reviewed consistency/policy below; no trust expansion/removal.

Initial trace preload quoting failure and MSYS fixture failure, native fixture fix,
all commands/hashes/limits and rollback are tracked in [BUILD-02](handoffs/BUILD-02.md).
Worker self-contained runtime-hook test, full suites, live memory/inference and
OS-offline evidence remain pending. Do not use build-and-sync, worker commands,
preparation commands or real user state as compile checks.

## Historical BUILD-02-TRUST review (no execution)

Snapshot only: the later owner choice/application is recorded in the current section
below. Pending recommendation A and guard FAIL here describe that earlier review.

Review source/entry `66a4c961da95d21526d00c44cad26199b8eda59e`; clean entry status,
same branch and baseline. Read-only local package/toolchain implementation inspection
and primary npm v10 / release-tagged Bun 1.4.4 documentation; no version command,
compile, guard, installer, dependency resolution, lifecycle or runtime command rerun.
Existing exact toolchain paths above remain authoritative; default PATH unchanged.

Canonical and plugin npm maps have 28 names, root has the same plus ONNX/msgpackr.
JSON/generated-plugin/lock Bun trust sets already match (26); root Bun trust remains
11 names. npm 10.9.9 does not filter lifecycle by allowScripts/trustedDependencies;
its ignore-scripts defaults false. Bun 1.4.4 explicit trust replaces built-in defaults;
ignore-scripts suppresses lifecycle independently. Neither setting is a network sandbox.
Existing preparation commands remain acquisition surfaces, not safe compile checks.

ONNX 1.23.2 default Windows requirements are empty (static branch evidence), while
Linux/CUDA can download NuGet assets. msgpackr-extract can test/load native code and
fall back to node-gyp; trusted SQL grammar can run npx --yes and CLI installer can
download GitHub binaries. Root tree-sitter manifest is missing; installed CLI 0.26.13
does not certify plugin-pinned 0.26.9/nested CLI scripts. No new compatibility claim.

Recommendation P09/A awaits owner: remove only the two root extras, retain JSON,
generator, plugin trust/lock unchanged; no script execution authorized by preservation.
Alternatives B/C, per-permission evidence, local hashes, risks and rollback:
[BUILD-02-TRUST](handoffs/BUILD-02-TRUST.md). Actual guard remains Session 02 FAIL,
not a new run. Setup/source/lock hashes unchanged. Root-lock/provenance, OS-offline
and full runtime acceptance remain separate pending gates; step 2 is not complete.

## Historical BUILD-02-TRUST-APPLY: selected C, guard PASS

Source `8bc557532108bc68fb516f6fce9549dd1b9a7b6e`; entry `6aa253dfb`, clean worktree.
Explicit user choice C retained root ONNX/msgpackr entries and added the same two
names to canonical and plugin allowScripts. Node 22.23.4 was invoked directly from
the exact toolchain path above (`--version` and reviewed guard); PATH unchanged.
Actual guard **PASS exit 0**, reporting 26 plugin direct dependencies and matching
30-entry canonical/root/plugin maps. This supersedes Session 02's drift failure.

Inline Node built-in-only checks **PASS**: map/generator formatting, plugin fields
unchanged outside allowScripts, 26-name JSON/plugin/lock Bun pairing, five preserved
input SHA-256 fingerprints. Root manifest, guard, generator, trust JSON and Bun lock
unchanged. Dependencies/versions/bundles/setup preserved; no generator/full compile,
install, lock resolution, lifecycle, native load, service/runtime or AWS execution.
Compile/6+21 prior checks were not replayed for this declaration-only change.

Exact diff/commands/hashes/limits/rollback and next proposal:
[BUILD-02-TRUST-APPLY](handoffs/BUILD-02-TRUST-APPLY.md). C settles declarations only,
not npm 10 selective enforcement, enterprise acquisition sources or permission to run
scripts. OS-offline, clean root-lock/dependency provenance and runtime acceptance stay
open. At that session close HOSTED-03 was proposed; its later explicit launch and
actual results are recorded below. No toolchain upgrade/reinstall or further policy
choice is needed. Step 2 has no shipped/full release acceptance.

## Historical HOSTED-03 environment and results

Source/tests `4174839497f8cc1247b864bd1c889e2a2b649738`; generated
`298d447423c2ebf7404ce79329683484902080b7`. Entry `f7df0cccd` was clean.
User explicitly accepted P10/A15: tested compile boundary is sufficient for source
progression; release evidence remains pending in steps 10/11/12. No edge/wave change.

Exact existing Node 22.23.4/npm 10.9.9/Bun 1.4.4 verified; process-local PATH only.
58 tests / 249 assertions PASS, 0 FAIL, exit 0; one reviewed build:compile PASS exit 0.
Synthetic HOME/config/data/temp/appdata and isolated npm config/cache/offline mode
under .scratch/enterprise-local/hosted-03. Inspected tests mock remote clients; HTTP
fixtures bind ephemeral loopback only. Sandbox denied loopback with EACCES; the same
isolated checks passed outside sandbox with approved execution. No worker/service/
plugin or agent job started. Windows fixture SQLite finalization/unlink fixes only;
no production DB change. No automatic approval rejection.

Compile reused the unchanged BUILD-02 Node guard: 9 Node initializations, 5 spawns,
one execFileSync, exec and execFile; local generators/esbuild/tsc/Vite and net use.
No Node socket or forbidden acquisition/deploy child. OS/native/shell coverage remains
incomplete. Worker/UI syntax and mapped hosted closure checks PASS. Generated worker
diff has an emitted trailing-whitespace warning; bytes preserved, not hand-formatted.

All 16 selected inputs/sentinels unchanged, including existing ignored root lock,
root/viewer installed lock metadata, compiler files, npm/Bun policy and manifests.
199 pre-existing tracked outputs: 188 unchanged, 3 modified, 8 removed; one new UI JS.
Only worker CJS/map and My Work outputs committed as G. No dependency installation,
download/update, lock resolution, trust/version change, services, AWS, real state or
push. Installed-tree/provenance/reproducibility and full memory/Chroma/Bedrock acceptance
remain unproved. Exact commands, hashes, generated delta, failures resolved and rollback:
[HOSTED-03](handoffs/HOSTED-03.md). Next proposed task: CHROMA-07, no acquisition implied.

## Current CHROMA-07 environment and results

Source/tests 8fa9979797b5478ec8b36eebd6c52533112aec83; generated b8734d9b25e6e6e890ae4d3c4f7864cf48d3a4bf.
Entry 46c12bfe7 clean, selected branch. Existing Node 22.23.4/npm 10.9.9/Bun 1.4.4
verified; process-local PATH and synthetic HOME/config/data/temp/appdata/npm config /
cache/offline environment under .scratch/enterprise-local/chroma-07. No upgrade/install,
lock resolution, trust/dependency/version change or installed-user Python/model read.

127 tests / 383 assertions PASS, zero FAIL, ten separate Bun runs. Python/SDK/process /
supervisor/identity mocks, no forbidden fetch/subprocess operation recorded. One reviewed
compile PASS with unchanged BUILD-02 guard: nine Node inits, five spawns, one execFileSync /
exec/execFile, local compilers and Vite net use query. No Node socket/acquisition/deploy
event; native/shell/OS-wide no-egress unproved. All 16 inputs/sentinels match HOSTED-03
and pre/post compile. 192 tracked outputs: 177 unchanged, 15 modified, none added/deleted;
UI unchanged. Generated syntax, source-list/emitted-gate and npm-map checks PASS. Maps
omit sourcesContent; no embedded-source equality proof. Worker whitespace warning retained.

All local Chroma launches explicitly blocked: no approved executable/dependency/model
paths or actual offline embedding/telemetry API supplied. U1/D9 and D11 open; no model
hash/compatibility/telemetry flag invented. Actual runtime/no-egress stays 11; closure /
provenance/reproducibility stays 10/12. Exact contract, checks, initial fixture/checker
failures resolved, Git sandbox escalation, evidence hashes and rollback:
[CHROMA-07](handoffs/CHROMA-07.md). Next proposed task: TELEMETRY-04.

## TELEMETRY-04 current validation — 2026-11-02

S 0abd4180b1971802d7939acba04d46960c4e8c14; G 6bb7c6995ea47e92ae0176bc88eac75bae871290. Existing exact Node 22.23.4/npm 10.9.9/Bun 1.4.4 verified; no toolchain/dependency change.
206 tests / 728 assertions PASS, zero FAIL, 18 isolated Bun files; one reviewed
build:compile PASS. Synthetic HOME/config/data/npm config/cache/offline env; SDK /
network/subprocess tripwires and mocked lifecycle, direct handlers without listeners.
Local logs and hook failure diagnostics checked. Initial synthetic-request /
Windows cooldown / identity-mock fixture issues resolved; details in handoff.
16 inputs unchanged against CHROMA-07 and pre/post compile; 14/192 generated changes,
178 unchanged, zero added/deleted, UI unchanged. Five CJS/map pairs, request-groups
and three logger map-only changes. No PostHog SDK in ten available map closures.
Node guard: 9 inits, 5 spawns, one execFileSync/exec/execFile, including Vite net use;
no socket/acquisition/deploy event observed, not OS/native/shell no-egress proof.
Known generated-worker whitespace retained. No acquisition, real state/assets,
services, Python/model, AWS or push. E11/U1/D9/D11 and release gates remain open.
[Commands, hashes, limits and rollback](handoffs/TELEMETRY-04.md).

## PLAN-ADAPT-05 current planning boundary — 2026-11-02

Inspected repository source/workflows at 48feeab567995de81d501b74007694b5ee95a880.
Documentation-only adaptation A19/A20; no source/generated/dependency/toolchain change.
No new application test, typecheck, compile, service, CI or model call was run. Prior
206-test TELEMETRY-04 and prior real compile evidence remains exactly as recorded;
it is not upgraded to current full runtime acceptance.

New [LLM-PROFILES](LLM-PROFILES.md) preserves explicitly selected compatible adapters
and visible role/model/auth routing. [VALIDATION](VALIDATION.md) distinguishes existing
unit/mock/compile evidence from required actual compiled-process, fake-LLM real-local-
index E2E, live per-profile and exact-install proof. Bedrock is currently unavailable;
its live row remains pending, while credential-free process/mock work can proceed
when explicitly launched. Chroma activation/assets remain blocked by U1/D9, D11 open.

Static CI review: upstream ci.yml uses Node 20/Bun latest/npm install and broad lanes;
windows.yml uses Node 22 range, downloaded Bun installer/npm install. Neither is an
approved fork validation run. Target exact Node 22.23.4/npm 10.9.9/Bun 1.4.4 and approved
pre-provisioned runner inputs; D12 runner/network/hosted upload policy open. Prepare
runner/config with step 9, finalize closure/CI with 10 and actual exact-artifact proof
in 11/12. Existing runtime integration fixtures require env/subprocess review before
reuse. Details/evidence scope in [PLAN-ADAPT-05](handoffs/PLAN-ADAPT-05.md).

Documentation closure only: 19 Markdown files / 123 relative links / 15 source-line
assertions PASS; no source/workflow/generated changes, six prior handoffs and original
plan unchanged. Installed tree was not inspected/rehashed. No new application typecheck,
test, compile or runtime/CI/provider validation was performed.
