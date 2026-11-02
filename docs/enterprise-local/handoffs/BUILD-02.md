# BUILD-02: compile boundary and local validation

Date: 2026-11-02. Branch: `feat/cmem-light-local`. Single coordinator; no subagents.
Entry HEAD: `4d773b4b790879d993fb5bfbd6bef6003cf16594`.
User explicitly launched Session 02 and authorized step-2 source/build/check changes,
reviewed baseline commits and existing dependencies. No installation, service or AWS
execution, real user state, push or step 3 was authorized or performed.

## Commits and source evidence

| Commit | Concern / provenance |
|---|---|
| `49e4f65e1` | Six user setup inputs, manifests and lock; exact ten-file handoff hash comparison passed before staging |
| `ce7ded4dc` | Four user worker/watcher bundles/maps; Node syntax and v3 map parsing passed; original build provenance is user-reported |
| `153a9953c3e62534ff3b96afc228645b88911399` | Pure compile source and six boundary checks |
| `705cd1dc9a6dcf805d9748cc85715239f13eac7e` | Existing committed-bundle fixture uses native git/tar instead of MSYS shell |

At source SHA `153a9953c3e62534ff3b96afc228645b88911399`:

- `package.json:74–77`: build delegates to build:compile; compile calls only manifest
  sync and build-hooks; viewer ci and plugin lock resolution are explicit preparation.
- `scripts/build-viewer.js:17–29,83–84`: local tsc/Vite preflight before viewer writes;
  only npm run build remains, retaining Windows shell/cwd/child error propagation.
- `scripts/build-hooks.js:558–584`: user trust JSON remains a generator input;
  generated allowScripts still uses the canonical map; viewer child is retained.
- `tests/infrastructure/build-compile-boundary.test.mjs:11,71–101`: script/lifecycle
  contract, three missing-input combinations, Windows cwd with spaces, retained assets,
  single build child and nonzero failure without retry. npm/esbuild are inert stand-ins.

At SHA `705cd1dc9a6dcf805d9748cc85715239f13eac7e`,
`tests/infrastructure/committed-plugin-bundles.test.ts:14–19` registers temp cleanup
before direct git archive/tar calls. No application source or runtime semantics changed.

## Execution environment

cwd for all commands below: `C:/0/ai/claude/claude-mem-custom/cmem-light`.
Initial PATH resolved Volta shims to Node 24.22.2/npm 11.19.1 and no Bun. No build
ran with those versions. Existing exact tools were located and verified:

- Node: `C:/Users/MykolaPushnikov/AppData/Local/Volta/tools/image/node/22.23.4/node.exe`.
- npm: sibling `npm.cmd`, bundled npm **10.9.9**.
- Bun: `C:/Users/MykolaPushnikov/.bun/bin/bun.exe`, **1.4.4 (38afee6c8)**.

Only each command's process PATH was prefixed with those directories. No persistent
PATH/registry/tool installation changes. Narrow local metadata reviewed: esbuild 0.28.2,
TypeScript 6.0.3, Vite 8.3.4, React/Tailwind Vite plugins and Rolldown 1.2.14;
repo generators/attribution helpers, viewer Vite config and test preload/fixtures.
This is not a transitive dependency-security audit.

## Actual checks

| Command / check | Result | Limits |
|---|---|---|
| Hash comparison of all 10 USER-SETUP paths against DEV-ENVIRONMENT | PASS, exact SHA-256 matches | Preserved, not reattributed to agent compilation |
| `node --check plugin/scripts/worker-service.cjs` and watcher equivalent; JSON map parsing | PASS, 840/167 map sources, no sourcesContent | Parse only; no runtime load |
| `node --test tests/infrastructure/build-compile-boundary.test.mjs` | PASS **6/6** | Disposable fake npm/esbuild; actual script, not real compilers |
| `npm.cmd run build:compile` at source `153a9953c` | PASS, exit 0 | Existing inputs; instrumentation boundaries below |
| Distribution, bundle integrity, hook-template and Pi/DSH attribution checks within compile | PASS | Build verification, not memory behavior/acceptance |
| `node scripts/check-postinstall-allowlist.js` | **FAIL**, exit 1, root declaration drift only | Pre-existing onnxruntime-node/msgpackr-extract additions; no guard/trust changes made |
| Original `bun test tests/infrastructure/committed-plugin-bundles.test.ts` | Fixture FAIL before assertions | MSYS NtCreateDirectoryObject access denied; no bundle failure established |
| Same Bun command after native extraction fix | PASS **21/21**, 41 assertions | HEAD `153a9953c` blobs; test patch then committed as `705cd1dc9`; syntax only |
| `worker-bundle-self-contained.test.ts` | NOT RUN | Executes runtime hook; runtime child closure not approved as compile-only |
| Full npm test, workers/MCP/plugins, real memory, Bedrock/Chroma | NOT RUN | Outside this increment |

The initial instrumented compile attempt failed in Node preload setup because
NODE_OPTIONS consumed backslashes in the harness path. No generators ran then.
Changing only that temporary path to forward slashes yielded the successful run.
The original generated user worker has existing trailing whitespace; its initial
git diff --check failed. Bytes were preserved. Source/test/docs diff checks pass;
this whitespace result is not represented as a clean baseline check.

### Compile process evidence and boundaries

Compile used synthetic HOME/USERPROFILE/CLAUDE_CONFIG_DIR/CLAUDE_MEM_DATA_DIR under
`.scratch/enterprise-local/build-02/home`. npm user/global config pointed at empty
scratch files, cache/logs at scratch, with offline=true, audit/fund/update notifier
disabled. Bun bundle fixtures also used synthetic HOME/data/temp. No installed
settings, credentials or memory databases were inspected or loaded.

Disposable `compile-guard.cjs` was inherited through NODE_OPTIONS. It logged Node
argv/cwd and child_process calls, rejected ci/install/lock-generator/deployment/
binary-compile commands, and replaced Node Socket.connect with a throwing tripwire.
Observed: 9 Node initializations; spawn 5, execFileSync 1, exec 1, execFile 1
(exec internally records execFile too). The complete observed command classes were:

```text
npm-prefix.js; npm-cli.js run build:compile
cmd /d /s /c "node scripts/sync-plugin-manifests.js && node scripts/build-hooks.js"
node scripts/sync-plugin-manifests.js
node scripts/build-hooks.js
node scripts/build-viewer.js
local @esbuild/win32-x64/esbuild.exe --service=0.28.2 --ping (viewer + hook builder)
npm run build (cwd src/ui/my-work; Windows shell)
npm-prefix.js; npm-cli.js run build
cmd /d /s /c "tsc -b && vite build"
local typescript/bin/tsc -b
local vite/bin/vite.js build
net use (Vite Windows mapped-path normalization; exec + internal execFile)
```

No installer, lock resolution, sync/restart/registration/runtime repair command or
Node socket trip appeared. Vite's installed `dist/node/chunks/node.js:2457–2491`
(local version 8.3.4, not Git-tracked source) explains `net use`: it maps UNC paths
to drive letters. Its output was not logged or used as repository evidence.

**Limits:** Node tripwires are not an OS firewall/process or packet capture; native
executables, shell grandchildren and other network APIs are outside full coverage.
No full no-egress/offline-enforcement claim. The harness is validation only, not a
product runtime security boundary. Existing services were not queried or changed.

199 tracked plugin/openclaw-dist/dsh-lib files were hashed before/after with zero
differences; Git showed no generated delta or new untracked outputs. Ignored dist
outputs were compiled and checked by the build, not included in this 199-file claim.
All 15 input/sentinel hashes below were unchanged through compile. This includes
root/viewer installed-lock metadata and compiler entry files, not an exhaustive
installed-tree hash. TypeScript/Vite compiler-cache writes remain permitted.
Same-environment output replay is established; clean/reproducible closure is not.

## Input fingerprints (SHA-256)

Root package-lock is existing ignored user input; hash recorded without tracking or
regenerating it. Hashes are local input fingerprints, not approval of registries/scripts.

```text
dcdaa006f8b245ece40c6f3c5b7f9217204f597a891bb88514f5a0f0bf4c981d  package.json
e0d20fdfc4b9ade7bf007152c76cf33247c9d72951a86c088a94aa0eb886a16d  scripts/build-viewer.js
98eca741aa7461a87ab28ce0c8108f9503581ee2ed706f4e1918f5ffd490aa7d  scripts/build-hooks.js
036ff6bd4fbd6fc3c854f2d4123eb106825d2558e8b703f8250df06d719ac0f8  scripts/plugin-trusted-dependencies.json
d588a608ac5357a9471eb16f77c08fa37113c152458a5828f6fbe6fb67020058  scripts/postinstall-allowlist.js
a5a974e20d9a0b0e9e217d62597afabacf93699c6c7748c91897032f488b04df  plugin/package.json
8db1a1527dd3a784622fcbe1ed7d036b67c0b807f7fd28a6aa9faa5f8bc2388e  plugin/bun.lock
52f962015654cdf33c008e1f5cf786a2786ec96113dd1484e37880bd8613ed99  package-lock.json
2759077e8ffdb654ce09fc40ebcfcb59c99dab81cce79d435bba541b9b3098ae  src/ui/my-work/package.json
ec0f529c410222930462e8994e33a2367450c1d179b75dc0df969dfb4599c1e3  src/ui/my-work/package-lock.json
11b9f03d031d670fa4968e8217c08c378786c03c9ebb50a2a21147a344584e79  node_modules/.package-lock.json
47cc1cd49a4cbc7ba06bbb02ebe6fff29aaf3414b395f865e399ee563a45bdad  src/ui/my-work/node_modules/.package-lock.json
9d0bc453f4e791553c4cc2298ba023b409241fd9801e494741666eb0f6051490  node_modules/esbuild/package.json
8d5fa5bd883fec0979fc2004f1fe1d99aef40570155d550eadc0b03b55513bf0  src/ui/my-work/node_modules/typescript/bin/tsc
de5833362e640673962f16e255bf8738d4380a68601b9af26217eee4e1bac36d  src/ui/my-work/node_modules/vite/bin/vite.js
```

Disposable evidence directory: `.scratch/enterprise-local/build-02/`; compile.log
SHA-256 `10e9e38417377f798c0c1256c19728d9ab6302ec3de4f6b9611d3ae6fa07e225`,
children.jsonl `fea50398b071d59d3243eae3ee5c6f60854a00ec49944c7a7a626c28a4bda775`,
harness `851d5c238998758aab8b79757cb68c2ba67e7a5c764affee2fd5733180c76115`.
This tracked report retains the conclusions even if scratch disappears.

## Pending policy and next task

No consistency change is required to compile. Root's two extra allowScripts entries
remain as preserved user setup, canonical map/guard unchanged. Narrow static review
found onnxruntime-node 1.23.2 postinstall `node ./script/install`, whose script describes
optional NuGet binary downloads; msgpackr-extract 3.0.4 install invokes
node-gyp-build-optional-packages 5.2.2, which can fall back to node-gyp rebuild.
Those scripts were READ, never executed. This does not establish a reason to expand
the canonical policy (especially under npm 10.9.9) or alter Bun trust JSON.

Installed-file evidence is outside Git: ONNX package.json:21 and
script/install.js:9–16,61–85; msgpackr-extract package.json:12 and
node-gyp-build-optional-packages/bin.js:7–17,21–47. Vite mapped-path evidence above
uses the same installed-file fingerprint convention:

```text
ceec2185556f4a6589ac92c9fd84645a4cb394394bf31bceb9c35c8bc63762b0  node_modules/onnxruntime-node/package.json
4c97bb4a70454c18caea9217cc5da39a35e4e53ea6ee8454ed864fdabfc46b2d  node_modules/onnxruntime-node/script/install.js
5cc88f0f15a0b54d9bb55b7aba652b792342199d77a8402727b76f0a53f9c2d1  node_modules/msgpackr-extract/package.json
b6c3ee58c7199854c80d2a6a7a67292ec6c9be9b6de2125c8f8370afc3c6bff4  node_modules/node-gyp-build-optional-packages/bin.js
dab5039168ce4526f98058d84e31bf79eeed8eba558a9a27db570df893326364  src/ui/my-work/node_modules/vite/dist/node/chunks/node.js
```

Next **BUILD-02-TRUST**: bounded consistency/policy review of these existing inputs;
produce a concrete reconciliation with explicit treatment of user choices. No automatic
trust expansion, guard weakening, lock resolution or reinstall. Step 2 remains in
progress until this and its offline/provenance acceptance limits are resolved or
explicitly dispositioned. No move to step 3 in this session.

Rollback: revert `153a9953c` to restore former build wiring (including acquisition),
then avoid executing that old build. `705cd1dc9` is an independent test-only revert.
There is no new generated-output delta to undo. Preserve baseline commits
`49e4f65e1`/`ce7ded4dc`, dependencies, installed runtime and user data. Docs must record
any future rollback. No reset/clean/data/service operation is part of rollback.
