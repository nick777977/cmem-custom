# Development baseline and user-provided execution evidence

Updated: 2026-11-02. Supersedes the pre-install assumption in the 2026-10-30 launcher.
This is not full runtime acceptance. Session 02 subsequently ran authorized step-2
compile/targeted checks; see the current section below and [BUILD-02](handoffs/BUILD-02.md).

## Preferred local toolchain

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

## Current Session 02 environment and results

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

## Current BUILD-02-TRUST-APPLY: selected C, guard PASS

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
open. Step 2 is not fully complete/shipped. NEXT-SESSION proposes one implementation
session HOSTED-03 with explicit limited step-2 progression acceptance (P10); it has
not been launched. No toolchain upgrade/reinstall or further policy choice is needed.
