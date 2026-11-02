# BUILD-02-TRUST: lifecycle policy review, owner choice pending

Date: 2026-11-02. Branch: `feat/cmem-light-local`; single coordinator, serial.
Inspected repository source SHA: `66a4c961da95d21526d00c44cad26199b8eda59e`
(S below). Entry Git status was clean. This report and memory updates are the only
changes. Baseline `49e4f65e1`/`ce7ded4dc`, compile `153a9953c` and fixture
`705cd1dc9` are preserved; their work was not repeated.

## Result and recommendation

The known drift is exactly two root `allowScripts` keys: `onnxruntime-node` and
`msgpackr-extract`. Canonical and generated plugin maps each contain 28 entries;
root contains 30. The user JSON, generated plugin Bun trust list and lock trust list
already agree as sets: **26 names**. Root Bun trust is a separate, unchanged 11-name
list. Neither extra is in root Bun trust; ONNX is in plugin Bun trust, msgpackr is not.

Recommend **option A** below: explicitly approve removal of only the two root map
extras to restore the existing canonical contract, retain the entire user trust JSON
and its generator/manifest/lock pairing, and continue to prohibit lifecycle execution.
No install, lock resolution, compile or runtime test is necessary for this reconciliation.
This is a declaration repair with a deliberately retained Bun capability, not enterprise
approval of the scripts in that list. Owner selection has **not** been received.

No map/list/guard/generator/manifest/lock was changed. The last actual guard result is
Session 02 **FAIL exit 1**; this review did not rerun it or relabel it PASS. Step 2
remains in progress. Separate OS-offline, root-lock/provenance and runtime gates stay open.

## Repository evidence and trust surfaces

All references in this section are static code at S, not runtime observations.

| Surface | Evidence at S | Effect and boundary |
|---|---|---|
| Compile/preparation | `package.json:74-77`; `scripts/build-hooks.js:558-584` | Compile reads JSON and emits plugin manifest; it does not install dependencies. Viewer ci and plugin-lock preparation are separate explicit commands. No permission to run either is inferred here. |
| Root npm map | `package.json:224-255` | 28 canonical names plus the two extras at 253-254. Declaration for newer npm, not an npm 10 enforcement mechanism. |
| Canonical map | `scripts/postinstall-allowlist.js:22-60` | 28 names; no ONNX/msgpackr. Name-based permissions are not version/hash-scoped. Existing entries are retained, not newly certified. |
| Guard | `scripts/check-postinstall-allowlist.js:27-67,85-130` | Checks lifecycle metadata only for plugin direct `dependencies`, resolving manifests from root dev node_modules; skips missing manifests. Then requires exact canonical root/plugin keys and true values. Does not check Bun trust, optional-only or transitive closure. Do not weaken it. |
| Bun JSON/generator | `scripts/plugin-trusted-dependencies.json:1-28`; `scripts/build-hooks.js:558-579` | JSON has 26 names. Generator unions literal tree-sitter-cli (already present) with JSON; it does not copy root Bun trust or derive Bun trust from npm canonical map. |
| Plugin declarations | `plugin/package.json:7-42,43-100` | 26-name Bun list; 28-name canonical npm map. ONNX is a transitive of optional transformers with an override to 1.23.2, not a direct `dependencies` entry. |
| Lock | `plugin/bun.lock:40-71,82,192` | Same 26-name trust set, separate order; ONNX 1.23.2 has hasInstallScript. No msgpackr-extract entry found. This is a comparison of existing metadata, not a new dependency graph. |
| Lock generation | `scripts/gen-plugin-lockfile.cjs:36-60` | Invokes Bun version then bun install --ignore-scripts. Suppression does not make resolution offline; do not invoke it for a trust review. |
| Runtime installer boundary | `src/npx-cli/install/setup-runtime.ts:420-438` | Inspected Bun dependency-install call passes frozen-lockfile and ignore-scripts. This single call is not a proof about every runtime installer/repair path; those remain in later increments. |

The canonical file/generator/guard comments about npm 11.16+ do **not** describe the
selected npm 10.9.9 baseline. Equal npm maps and a passing guard would still not enforce
script suppression on npm 10 or audit the Bun list. Compile success supplies no reason
to grant an install permission.

## Package manager semantics, separately established

**npm 10.9.9 — static local implementation plus primary v10 documentation.** The selected
toolchain npm package identifies version 10.9.9; bundled Arborist is 8.0.5. In its
`lib/arborist/rebuild.js:147-167`, dependency preinstall/install/postinstall execution is
gated by ignoreScripts, not either manifest trust field; `:280-330` queues and runs the
package scripts. A symbol search of npm `lib/`, Arborist `lib/` and config `lib/` found
no allowScripts, trustedDependencies or allow-scripts implementation. npm install/ci
also gate the root lifecycle on ignore-scripts (`lib/commands/install.js:101,152-170`;
`ci.js:102-124`). Config definition `definitions.js:859-870` defaults ignore-scripts
to false. Thus neither adding nor removing these two map keys selectively permits or
blocks them under npm 10.9.9. Future preparation must use explicit script suppression
unless a separate exact lifecycle execution is authorized; no preparation ran here.
The flag does not prohibit explicitly invoked npm run scripts or provide a network
sandbox. [npm v10 config](https://docs.npmjs.com/cli/v10/using-npm/config/#ignore-scripts),
[npm v10 lifecycle order](https://docs.npmjs.com/cli/v10/using-npm/scripts/#life-cycle-operation-order).

**Bun 1.4.4 — primary documentation pinned to the release tag.**
The release's [lifecycle documentation](https://raw.githubusercontent.com/oven-sh/bun/bun-v1.4.4/docs/pm/lifecycle.mdx)
at lines 29-57 describes name-based explicit trust, lock recording, and the distinction
between omitted, nonempty and empty lists: an explicit list replaces built-in defaults.
Lines 60-86 describe ignore-scripts suppression. Trusting a package permits that
package's lifecycle; it is not a network/destination restriction or a hash-scoped approval.
Root and plugin install contexts carry different lists. Do not assume plugin trust
extends root trust, or that trusting a parent makes all its dependencies trusted. A
trusted script can itself launch children such as npx or node-gyp; Bun's list is not
a sandbox for those children. An explicit list also means absent defaults such as sharp
are not implicitly trusted; do not auto-add them. Version is the Session 02 verified
1.4.4 baseline; no Bun install/trust command or lifecycle fixture was run in this review.
The documented behavior is not a dynamic test of this machine or its installed state.

## Purpose and reachable lifecycle of the two extras

Installed files below are ignored/local inputs, identified by SHA-256 in the evidence
appendix, never treated as Git-pinned vendor source. No package was imported/executed.

**onnxruntime-node 1.23.2.** Purpose: native ONNX binding for the optional Node
transformers/embedder surface (`plugin/package.json:35-41`, S); that is separate from
the later Python Chroma/model contract. Permission is for dependency preparation,
not for the already prepared pure compile or ordinary inference calls. Manifest
`node_modules/onnxruntime-node/package.json:14-21` declares postinstall node ./script/install.
That loads global-agent, install-utils and install-metadata (`script/install.js:19-29`),
then parses flags, checks local-install context/platform/files and may call installPackages
(`:64-134`). Normal Windows x64/arm64 requirements are empty
(`install-metadata.js:10-16`); default execution reaches the empty-file early exit, so a
Windows NuGet download is **not** implied by this script. This is a static branch result,
not proof of any prior install or native-binary availability.

Linux/x64 requires cuda12; missing files can resolve/download/extract NuGet packages.
Metadata `:46-54` names NuGet/public nightly feed endpoints; the inspected versions
file `:7` selects regular nuget 1.23.1. `install-utils.js:13-46,86-107,111-153` uses HTTPS
and writes/extracts downloaded files; `:235-299` handles install/CUDA flags. Legacy
CUDA autodetection can spawn nvcc --version (`:209-229`). The skip flag is not a manager
security boundary and bootstrap/imports precede that early exit. Name-only trust would
cover changed package versions and other OS contexts too. Full helper/global-agent/zip
closure, artifact integrity and actual environment remain unverified; no feed was contacted.

**msgpackr-extract 3.0.4.** Purpose: optional native string-extraction acceleration for
msgpackr. Local `bullmq/package.json:75-81` depends on msgpackr;
`msgpackr/package.json:89-91` declares the optional extractor, and
`msgpackr/node-index.js:10-23` catches unavailable native acceleration. This supports
an optional-acceleration inference, not a measured runtime/performance claim. The package
is not in the plugin lock/trust list inspected here; do not add it there to repair root drift.

Manifest `msgpackr-extract/package.json:11-13,24-43` invokes
node-gyp-build-optional-packages 5.2.2. Its `bin.js:7-18` shells out to the native build
test; `build-test.js:8-19` can load the addon via the loader. On failure, or a
build-from-source flag, `bin.js:21-47,67-79` can spawn node-gyp[.cmd] rebuild (Windows
shell, or a resolved Node/node-gyp path); this invocation supplies no extra pre/post
commands. The loader searches local builds/prebuilds and platform optional packages
(`node-gyp-build.js:27-99`), not a lifecycle downloader. Executing the test nevertheless
loads native code. npm's bundled node-gyp `lib/configure.js:27,112,314` can locate Python/
Visual Studio and spawn Python; `lib/install.js:200-220,262-267,290-328` can fetch Node
headers/libraries/checksums. Actual node-gyp resolution, tool availability, cache and
chosen prebuild are UNKNOWN. No rebuild/test/download was run. Publisher prebuild/
download/publish commands in the manifest are not part of the declared install chain.

## Current JSON: every retained permission accounted for

This table covers all 26 JSON names at S. Purpose is provision of a CLI/native binding
for later syntax/parse behavior, except ONNX as above. **None of these lifecycle
permissions is needed to rerun compile against the prepared inputs.** Runtime may
need already prepared artifacts; that does not require executing their installer at
runtime. No grammar removal or behavior redesign is proposed.

| Permission(s) | Local lifecycle and reachable child class | Disposition in recommended A |
|---|---|---|
| @derekstride/tree-sitter-sql | install npx --yes --package=tree-sitter-cli@v0.24.7 -- tree-sitter generate && node-gyp-build. npx may acquire/execute the requested CLI, then native build chain. Installed manifest :8, hash below. | Preserve declared capability; no execution approval. An explicit acquisition path, not safe merely because native. |
| @tree-sitter-grammars/tree-sitter-{lua,markdown,toml,yaml,zig} | Each install is node-gyp-build; local native test, then conditional node-gyp rebuild. | Preserve all five names; no new lifecycle approval. |
| tree-sitter-{bash,c,cpp,css,go,haskell,java,javascript,kotlin,php,python,ruby,rust,scala,scss,swift,typescript} | Each install is node-gyp-build, same conditional native test/build class. Swift also declares tree-sitter-cli ^0.23 (:52); trusting the CLI name is not version-specific. | Preserve all seventeen names; existing nested/alternate CLI behavior is not certified. |
| tree-sitter | Root top-level package manifest is absent. Native parser binding is the intended role, inferred from canonical/generator context, not inspected lifecycle fact. | Retain name; local lifecycle UNKNOWN. No searching installed plugin/user state or acquisition to fill the gap. |
| tree-sitter-cli | Root installed 0.26.13 manifest :29 uses node install.js; installer :53-78 removes old executable and downloads/decompresses a GitHub release, follows redirects (:85-98). Plugin manifest/lock instead pin 0.26.9; root script evidence does not certify that version, nested ^0.23 or npx 0.24.7. | Preserve name/literal generator seed; do not run any version. |
| onnxruntime-node | postinstall as detailed above. | Preserve current Bun name explicitly as a capability; not a grant to use it. |

Representative local node-gyp-build **4.8.4**: `package.json:28-31` maps bin/test;
`bin.js:7-45,66-67` tests prebuilds or spawns node-gyp rebuild; `build-test.js:8-19`
loads an addon through `index.js:1-6` / `node-gyp-build.js:19-73`. This establishes a
reachable child class, not identity of every nested resolution. Local manifest lines/
hashes below give exact individual script evidence. No existing canonical-only
esbuild/@biomejs/biome/better-sqlite3 permission is expanded or recertified. This is
not a lifecycle audit of every dependency, model or runtime entrypoint.

## Concrete policy choices (one owner decision)

| Option | Exact subsequent reconciliation | Consequences / remaining risk |
|---|---|---|
| **A — recommended: canonical root, preserved Bun setup** | Remove only root allowScripts.onnxruntime-node and .msgpackr-extract; leave the 28-name canonical list/guard and generated plugin npm map unchanged. Preserve JSON, generator, plugin Bun list and lock byte-for-byte. No dependency or installed-artifact deletion. | Eliminates known root drift with no trust expansion, resolution or setup rebuild. npm 10 selective enforcement remains absent. Existing 26-name Bun capability, including ONNX/SQL/CLI risks, remains active on an unguarded future bun install; policy forbids that execution pending separate approval. This is not machine-wide enforcement. |
| B — narrow ONNX capability as well | A plus remove only onnxruntime-node from JSON, generated plugin trustedDependencies and lock trustedDependencies together (26 -> 25); preserve JSON file/generator and all grammar/CLI names. No change to dependency versions, overrides, integrities or resolution graph. | Revokes one actual Bun permission, retains installed artifacts; future ONNX preparation may need an approved pre-provisioning path. SQL/CLI/native-build capabilities remain. Paired lock treatment needs exact Bun-aware static review, not a blind JSON edit or install. No such patch is authorized by this report. |
| C — broaden canonical to the two extras | Add both names to canonical; generated plugin allowScripts becomes 30; root 30 remains. Retain Bun JSON/list/lock 26 (do not add msgpackr to Bun). | Makes guard consistent by widening name-based permissions for supporting npm versions in both contexts, including optional/transitive cases the guard does not audit. No demonstrated compile need, no effect on npm 10 suppression, no approved acquisition sources. **Not recommended.** |

All options retain baseline commits and actual installed files. None approves installs,
downloads, running scripts, AWS, runtime services or step 3. Keeping current declarations
unchanged pending selection is the current state, not a fourth claimed fix. Owner question:
**Choose A (remove only the two root extras, preserve all Bun setup), B (also revoke
ONNX Bun trust), or C (explicitly broaden canonical npm permissions)?**

After an explicit choice, one serial BUILD-02-TRUST-APPLY concern can implement only
that selected declaration delta, inspect/execute the existing read-only guard directly
with the exact Node binary, compare trust sets and changed paths, and record actual
results. For A, no generator/lock/compile invocation is needed: their inputs/outputs
already agree. Static in-memory removal of the two root extras should make the map
equal canonical; an actual future guard PASS must be recorded separately.

Rollback of a future policy patch: revert that isolated commit only, preserving baseline
and installed artifacts/data; expect restored root drift if reverting A. Review-only
docs rollback is a docs revert; no runtime state to undo. No reset/clean/service action.
Do not infer root-lock provenance, OS-offline acceptance or full reproducibility from
any option. Roadmap dependency edges/waves remain unchanged.

## Checks actually performed and limits

- Read-only manifests/scripts and set comparisons: root-only extras exactly ONNX/msgpackr;
  plugin npm map equals canonical; JSON/plugin/lock Bun sets all equal (26).
  Proposed A was also compared in memory: removing only those two root keys yields
  28 canonical true entries (PASS structural comparison; no file write/guard run).
- Targeted local file fingerprints collected; Session 02's two manifest/script hashes
  still match. Tracked source declarations retain their recorded hashes below.
- Primary npm v10 and release-tagged Bun 1.4.4 docs read via web; no package acquisition.
- Docs link/whitespace/path checks and final Git scope/status are recorded in WORKLOG.
  No compile, guard, package script, native load, lifecycle test, installer, lock
  resolution, version command, service, real settings/data, AWS or push ran here.
- Actual prior installer flags/environment/traffic and full native/child closure remain
  UNKNOWN. This report is neither no-egress nor runtime acceptance.

## Input evidence appendix

Tracked inputs at S (SHA-256; unchanged throughout this review):

```text
dcdaa006f8b245ece40c6f3c5b7f9217204f597a891bb88514f5a0f0bf4c981d  package.json
d588a608ac5357a9471eb16f77c08fa37113c152458a5828f6fbe6fb67020058  scripts/postinstall-allowlist.js
9b28be193552d510f20e1b9133f27694854fd79f13702356c0fa6d942b5cbc89  scripts/check-postinstall-allowlist.js
98eca741aa7461a87ab28ce0c8108f9503581ee2ed706f4e1918f5ffd490aa7d  scripts/build-hooks.js
036ff6bd4fbd6fc3c854f2d4123eb106825d2558e8b703f8250df06d719ac0f8  scripts/plugin-trusted-dependencies.json
a5a974e20d9a0b0e9e217d62597afabacf93699c6c7748c91897032f488b04df  plugin/package.json
8db1a1527dd3a784622fcbe1ed7d036b67c0b807f7fd28a6aa9faa5f8bc2388e  plugin/bun.lock
38ad94cef2529e024edd90c7dde72c3ca5194cba0880253dd4b8dada64d6d97d  scripts/gen-plugin-lockfile.cjs
```

Local manifest and helper fingerprints follow. These identify inspected bytes only;
they are not registry provenance or permission to execute. Paths are repository-relative
unless under NPM, the exact toolchain npm directory from DEV-ENVIRONMENT.

| Package (`node_modules/<name>/package.json`) | Version | Lifecycle line | SHA-256 |
|---|---|---|---|
| `@derekstride/tree-sitter-sql` | 0.3.11 | 8 | `e4b01b5e1826a7fe0bb332f09e33e4296c97acfcb17ce05d870eda3ef1338182` |
| `@tree-sitter-grammars/tree-sitter-lua` | 0.4.1 | 48 | `6ebfdb46ed8c3a0d69b9e644d76eea4a11e82ad0b0012e534ee03b901674b39c` |
| `@tree-sitter-grammars/tree-sitter-markdown` | 0.3.2 | 45 | `4cc54bfbb566b637038fb4e8996d46e218052935a4d00f86b77a8cc939eabf30` |
| `@tree-sitter-grammars/tree-sitter-toml` | 0.7.0 | 58 | `2b5a98ea10e2266178da669605f2ee65d9bbfd60b85307d6dde7bc35004ab0a2` |
| `@tree-sitter-grammars/tree-sitter-yaml` | 0.7.1 | 55 | `6abef4dd5cbc62ffc8d35a02aaab6e471224102892f180cc66f264f85c78bd4c` |
| `@tree-sitter-grammars/tree-sitter-zig` | 1.1.2 | 51 | `3d19c349d741fe74a908d0226a5196b204483711cd7ce2bedaf62bb5961dac45` |
| `onnxruntime-node` | 1.23.2 | 21 | `ceec2185556f4a6589ac92c9fd84645a4cb394394bf31bceb9c35c8bc63762b0` |
| `tree-sitter` | UNKNOWN | manifest absent | Not available |
| `tree-sitter-bash` | 0.25.1 | 54 | `757d74350c9a8cf2635010326ef3b28b59c392e705906af4d98e5a45fcaff32d` |
| `tree-sitter-c` | 0.24.1 | 54 | `2ce1a96088083cd4006539032ec4c4ca40ced6e0ae410c97e211f65db26de8fe` |
| `tree-sitter-cli` | 0.26.13 | 29 | `400e98ef60792cebd184600c3a8362a698c7f10f12aa3c122dd07c47586b29b5` |
| `tree-sitter-cpp` | 0.23.4 | 55 | `bfde98d506b0847f2093336e5b4d7394dd311e78da69e22e5ecd73fba6db6066` |
| `tree-sitter-css` | 0.25.0 | 59 | `074f92a25e9272478986165fd7673889676aaaeb9163bdcba068798c185a74ca` |
| `tree-sitter-go` | 0.25.0 | 54 | `63e08578adc8af9f86e45dc3127bc61722b4abb9c2e78cf6e1cc0b121f132f82` |
| `tree-sitter-haskell` | 0.23.1 | 58 | `9fb932ca69323e81a1f7dd8c01cf710cedfaf19fa3b2989ec954d28337c95d21` |
| `tree-sitter-java` | 0.23.5 | 64 | `c0c99e633aa28b2c1c58e61f91211391a9363d7d532aa5795bf4003f2dc14dba` |
| `tree-sitter-javascript` | 0.25.0 | 54 | `6a1b9e54d5b3a44b88d849e3799dc25682da7bcd26a70a425971277e0bc32462` |
| `tree-sitter-kotlin` | 0.3.8 | 9 | `efe610bfd5e451c2aef360a38bcbc8b0fac08f579d3267d68624f3c0735a6a8d` |
| `tree-sitter-php` | 0.24.2 | 74 | `f8264526c8c1c1c051fcf33b3f87c7591720af339f15bef2e041f853fdb8fb06` |
| `tree-sitter-python` | 0.25.0 | 54 | `cc682da95140c947fa0d67f9307e2017def0b4584c15b60386344ac78853d1a8` |
| `tree-sitter-ruby` | 0.23.1 | 72 | `07fb6a02a020df5fcedd8cc968b266de69eb6e5a1f1e43bd7c5817306339019c` |
| `tree-sitter-rust` | 0.24.0 | 58 | `58a2042ba3e6930f4cc34412fad2525da503c5de034b6050fdb096bfe5b31ead` |
| `tree-sitter-scala` | 0.24.0 | 47 | `b095ceaca5d10db1766bd864021ebca09fa15be98daffbfe2815c11dedd64e3a` |
| `tree-sitter-scss` | 1.0.0 | 44 | `54e98062a571d17679b85c3f8da6cc37a2693c65783ef8bc6359435240f6e328` |
| `tree-sitter-swift` | 0.7.1 | 8 | `e0a88ef9e581536189714c5ca52d1cea883a2ab6e865e09f20c7d55fc6c56c3f` |
| `tree-sitter-typescript` | 0.23.2 | 55 | `26892ef49837678a747f81e344ed26938ec5804e29e003ad34fd5a3c87c68baf` |

Other local inputs (SHA-256):

```text
4c97bb4a70454c18caea9217cc5da39a35e4e53ea6ee8454ed864fdabfc46b2d  node_modules/onnxruntime-node/script/install.js
2cfbb2fcf1f170d5da564c0be3222821050bcbd282c9e0493e9433649ac2f130  node_modules/onnxruntime-node/script/install-metadata.js
9cdf5fa6b060a77a1e10b0098da9c9695b848667e0b02ebdeece7f6c9b82fd37  node_modules/onnxruntime-node/script/install-metadata-versions.js
b8890f3eb40b50b5e4ca61d6b6b328d017660319ee326ca3db00709de1218579  node_modules/onnxruntime-node/script/install-utils.js
5cc88f0f15a0b54d9bb55b7aba652b792342199d77a8402727b76f0a53f9c2d1  node_modules/msgpackr-extract/package.json
a2b9244e83810de461c09f0cd3629899619bf145a40bc05af44553faf40b9ff5  node_modules/msgpackr-extract/index.js
f40262ff4f97d13035800c0a3370b84e8406e0db31ada4d087a6e6e5c6f43b2d  node_modules/msgpackr/package.json
e6217b2b310e751aff02243feb2d318828121fa4d393ac45691aed8d55bc2b49  node_modules/msgpackr/node-index.js
803a117c988c59f9d27c5033dcf0ddde35439cab94ec2ad8fd4ff5e6fb72b677  node_modules/bullmq/package.json
939e18b5652b4cd288a9ff263ddd9be1101b0503903794b9f8feb2603461e1a4  node_modules/node-gyp-build-optional-packages/package.json
b6c3ee58c7199854c80d2a6a7a67292ec6c9be9b6de2125c8f8370afc3c6bff4  node_modules/node-gyp-build-optional-packages/bin.js
34c19ff8b6675d6d27c63a7df44d77a442805eeea8756d1c89e0264f4a3028f6  node_modules/node-gyp-build-optional-packages/build-test.js
a7ed0d5ae218a19bdbdf15a590d0893790ddf536313b66a787554693cfaae078  node_modules/node-gyp-build-optional-packages/index.js
21145626bbb3122baf79f196087f05d6f1eeb7b9c65c037ced6940c5c6113440  node_modules/node-gyp-build-optional-packages/node-gyp-build.js
9e8def3fbf123e28aa1ca4b6aa557fba4e66eecf6e86d170b61ec1c7ed51305d  node_modules/node-gyp-build/package.json
dc022adc093b9b79e1a0ef4b6bc3e6a52e3d627102113dad4afacbbe81f13a26  node_modules/node-gyp-build/bin.js
34c19ff8b6675d6d27c63a7df44d77a442805eeea8756d1c89e0264f4a3028f6  node_modules/node-gyp-build/build-test.js
a7ed0d5ae218a19bdbdf15a590d0893790ddf536313b66a787554693cfaae078  node_modules/node-gyp-build/index.js
134f0585f7c665db89f332a379158c6f113274422e42aaf54e0aa9d5ac37f577  node_modules/node-gyp-build/node-gyp-build.js
73d1683164f768b0ba4dfce14d66ee0887bb97a3dc1256d3f3dd36700ddaaa78  node_modules/tree-sitter-cli/install.js
ca7a6d5da8e9ce79d231c8492399cf5f32da75b5bfca8145f83cc1db4bf2e4c1  NPM/package.json
a55e3255bb1b87b11133b119d77604ca22e447e122585c591901e5403f51672f  NPM/node_modules/@npmcli/arborist/package.json
e22b111f61b4cf0a27958b41923824fc8ef85ab51c8d1f9878bfb7078c95ae90  NPM/node_modules/@npmcli/arborist/lib/arborist/rebuild.js
79164e3881df94b91226fecfbb40133ab1f26d6bf66953f37f72dc1dd5bb9610  NPM/node_modules/@npmcli/config/lib/definitions/definitions.js
338a549e0f597045b834ea7f110311e772c4e437f2e6ea739ef2b5435f77dc64  NPM/lib/commands/install.js
bcfc4af77f38db1caf32aa29d77e968a35620657bc1ea3dca6ec6f723d78d3cf  NPM/lib/commands/ci.js
5bc4290c65d392e1c448f41de5716edcef93512ead61befb064154342c6aa990  NPM/node_modules/node-gyp/lib/install.js
288d0fe172eec490db22183f1b74097beb2bddf65bc0b346985dac8bfbb7a3e5  NPM/node_modules/node-gyp/lib/configure.js
```

NPM = `C:/Users/MykolaPushnikov/AppData/Local/Volta/tools/image/node/22.23.4/node_modules/npm`.
