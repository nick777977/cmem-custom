# WINDOWS-09B — private launcher and bootstrap/parser refusal slice

2026-11-02 launch, closure resumed 2026-11-03; feat/cmem-light-local, single
coordinator, no agents/branches/worktrees. Clean entry
**e27548d5450c7f91ea64004db851152a73a8a0db**. This is **partial step 9**.

| Commit | Concern |
|---|---|
| e9c8038ca2bee37454acc055ef4be4fbdf0ad343 | Explicit private launcher diagnostic, protocol 3 |
| 8bbf2830c0adf3b606262c4a85c7e6c23d386444 | Automatic setup/runtime and launcher-install entrypoint refusal |
| **S = e3d91a50505849fba6f509d9eca7d4a3ce9416b7** | Bundle-local CLI selection and direct doctor caller; final application source snapshot |
| **H = bbc3847e91091f01eb224124efc2210ac3c78770** | Inert source tests and copied-artifact refusal specs |
| **G = 62a468f6d061a5f10ccc5f5c341dc819bc11bf18** | Eight paired generated outputs from one reviewed compile |

Documentation commit follows G. Earlier [WINDOWS-09](WINDOWS-09.md)
S0d0a4b176/G004588740/Hf2c722fad remains historical evidence; its SessionStart
refusal, check-only parser acquisition helper and harness ownership contract are
preserved. No runtime acceptance is added here.

## Implemented source boundary — inspected at S

| Path:line | Static result |
|---|---|
| src/launcher/claude-mem-launcher.ts:5 | Calls static planning only; no child_process, Bun discovery, host settings, worker import, stdin/data writes or BUN_BE_BUN fallback. |
| src/launcher/local-preflight.ts:19 | Only CLAUDE_MEM_BUNDLE_ROOT selects an exact absolute unpacked plugin directory. Ignore CLAUDE_PLUGIN_ROOT/PLUGIN_ROOT/cache/PATH/cwd discovery. Missing/relative root -> LOCAL_BUNDLE_ROOT_REQUIRED; missing entry/root -> LOCAL_BUNDLE_MISSING; foreign executing entry/root alias -> LOCAL_BUNDLE_STALE. Present siblings still -> PRIVATE_LAUNCH_POLICY_PENDING. No launch branch. |
| src/launcher/local-preflight.ts:52 | Previous SessionStart sibling-file preflight remains always blocked. File presence cannot approve integrity/runtime/loading or memory readiness. |
| src/launcher/launcher-protocol.ts:12 | Protocol explicitly bumped 2 -> 3 for the changed diagnostic contract. This is not a plugin ID, registration, manifest or lock delta. |
| src/npx-cli/index.ts:94 | Default/install/repair/update/upgrade refuse before dynamic installer/auth/IDE imports. Help now describes the blocked private candidate instead of advertising automatic signup/repair/PATH setup. |
| src/npx-cli/install/setup-runtime.ts:8 | Compatibility acquisition APIs reject LOCAL_RUNTIME_UNAPPROVED; no runtime/tool lookup/version process, download, package install, marker writes, credential/settings read or vector opt-out success. Queries return null/false, never approved/current. |
| src/npx-cli/commands/install.ts:2651 | Direct runInstallCommand wrapper refuses; runRepairCommand at 3285 also refuses. Historical inner helpers remain, see gaps below. |
| src/launcher/install-launcher.ts:241 | Shell PATH setup refuses before reading options; Windows PATH at 404, ensureLauncherOnPath at 638 and removal at 667 also refuse before inspection/callbacks. No D5 registration/removal ownership guessed. |
| src/services/smart-file-read/tree-sitter-bin-path.ts:9 | CLI lookup requires the explicit root and existing local version/hash verifier. No createRequire CLI/module lookup, bare executable or PATH fallback. Legacy resolver signatures only validate the exact selected path. Missing/corrupt/unpinned bytes never reach the version probe. |
| src/services/smart-file-read/tree-sitter-bin-path.ts:119 | Diagnostic check catches resolution refusal, reports unavailable and never probes another executable. Existing bounded load/version probe retained after verification. Repository pins are byte comparisons, not new provenance approval. |
| src/npx-cli/commands/doctor.ts:246 | Direct parser diagnostic caller reports the selected-bundle refusal instead of throwing or recommending PATH/repair. Other doctor checks are unchanged and not approved to run. |

Hook refusal preserves exit 0/empty stdout plus diagnostic stderr, so the host can
continue without falsely reporting capture/readiness. Non-hook launcher commands
refuse exit 1/empty stdout. Version prints `3\n`; observation/file-context opt-out
exits silently before root access. Neither branch starts an application process.

No private ID/loading choice was made. `CLAUDE_MEM_BUNDLE_ROOT` is a source-level
explicit directory input, not an accepted artifact/activation manifest or D5 policy.
The two concrete D5 loading/registration options in WINDOWS-09 remain proposed.

## Exact remaining source gaps — not global enforcement

At S, only direct callers/configs were traced; no new general audit:

1. **E13 host templates and wrappers remain legacy.**
   `src/build/hook-shell-template.ts:238,302,367,436,439,449` still emits MCP/cache/
   shell/on-PATH/global-node entrypoints. `plugin/hooks/`, `plugin/.mcp.json`,
   `plugin/scripts/bun-runner.js` and other host launch wrappers are unchanged.
   They can select an upstream launcher or bypass the changed private launcher.
   The canonical generator verification PASS proves current pairing only, not the
   desired private-path policy. No generator source or identity manifest changed.
2. **E12 Setup/version-check and dormant installer helpers remain.**
   `plugin/scripts/version-check.js:13,29` retains install/discovery behavior;
   Setup still reaches that unchanged file through legacy templates. At
   `src/npx-cli/commands/install.ts:1679,2655,3216`, OAuth/native-install/inner
   helpers remain in source behind refused install/repair wrappers. They were not
   imported/executed in tests and are not certified inert as independent exports.
   Retire plugin signup/bootstrap callers without deleting selected-provider
   native login implementation. Other CLI commands still need bounded review;
   `src/npx-cli/commands/runtime.ts:17` uses the old shared root resolver before
   the now-unavailable Bun query. Do not execute these commands.
3. **E14 historical installer utilities remain source.**
   `src/launcher/install-launcher.ts:332,376,501` still contains a compile-path
   helper, registry-script constant and injected codesign factory. The four
   mutation entrypoints now refuse; that is not full removal of every utility or
   a working install/verify/uninstall/rollback implementation. PowerShell planner
   remains unchanged source-only BLOCKED D5, not run again.
4. **E21 grammar resolution/build remains.** CLI PATH/module fallback is removed,
   but `src/services/smart-file-read/parser.ts:81,91` still resolves grammar
   packages through the module system; `parser.ts:435,449,491` retains grammar
   library build/query paths and fallback. No parser/grammar process ran. Resolve
   this with pre-provisioned artifact/refusal evidence, not runtime compile/repair
   or a test bypass. The bundle-local CLI verifier cannot approve provenance or
   the complete grammar/native closure.
5. **Native V3 adapter is not authored.** Reused orchestration still has no
   default spawn/native ownership/OS-egress implementation. Its existing
   `kind: 'native'` label alone is not proof of ownership or egress enforcement.
   Approved immutable inputs, OS child-tree admission, DNS/network boundary,
   startup-failure/timeout cleanup and release assertions remain prerequisites.
   Runtime-version/hash stale cases, MCP initialize/list-tools and worker lifecycle
   cases also remain. Do not promote V1 mocks to V3.

These are the next same-step source continuation. Do not activate this candidate
or mark full step 9 complete. A19/A20 and step-6 role/model/auth/fallback work remain
unchanged; retained Claude/Bedrock/API/login/Codex ChatGPT/OpenAI-compatible provider
implementation files were not edited. Viewer, SQLite canonical/Chroma derived,
identity/sharing/filter/capture/retrieval source semantics were not redesigned.
U1/D9 activation refusal and D11 remain; no SQLite-only success mode was added.

## Checks actually run

All selected test/preload imports, process/network seams and compile scripts were
reviewed before execution. Existing tools verified: Node **22.23.4**, npm **10.9.9**,
Bun **1.4.4 (38afee6c8)**. No dependency/toolchain change or input repair.

Scratch wrappers clear ambient env, then allow only explicit exact tool/Windows
entries and synthetic HOME/USERPROFILE/APPDATA/LOCALAPPDATA/CLAUDE_CONFIG_DIR/
CODEX_HOME/data/temp under `.scratch/enterprise-local/windows-09b`. Empty isolated
npm configs/cache, offline/audit/fund/update settings and BUN_INSTALL_AUTO=disable.
No real credentials/settings/assets were copied. Guards are supplementary Node/Bun
instrumentation, not OS-wide egress evidence.

- `bun test --preload ./.scratch/enterprise-local/windows-09b/test-guard.ts --timeout 20000 tests/enterprise-local/windows-09b.test.ts tests/enterprise-local/compiled-smoke.test.ts`:
  **19 PASS / 0 FAIL / 112 assertions**. Ten source-refusal cases plus nine mock
  orchestration cases; tripwire log has zero forbidden process/socket/listener/fetch
  operations. No generated file was evaluated or executed.
- After emission, affected `compiled-smoke.test.ts` alone: **9 PASS / 57 assertions**
  against fresh copied actual G hashes. This repeats nine of the above nineteen,
  not 28 distinct tests. Zero forbidden operations again. New four specs are
  root-required/missing-bundle/stale-entry/unapproved-bundle; mocked only.
- Direct exact Node `node_modules/typescript/bin/tsc --noEmit`: **FAIL**, only the
  three known TS2345 at ChromaMcpManager 227/842 and ChromaSync 385. Full diagnostic
  text matches the retained WINDOWS-09 run; no new baseline overlay/type suppression
  or Chroma source edit. Viewer `--noEmit -p src/ui/viewer/tsconfig.json`: **PASS**.
  No application imports executed by these compiler invocations.
- **One** reviewed `npm.cmd run build:compile`: **PASS exit 0**, unchanged BUILD-02
  guard SHA-256 `851d5c238998758aab8b79757cb68c2ba67e7a5c764affee2fd5733180c76115`.
  Nine Node inits, five spawns, one execFileSync/exec/execFile; local generators,
  esbuild/tsc/Vite including known Vite `net use`. No Node socket event; native/
  shell grandchildren and OS-wide traffic remain outside this guard's proof.
- Generated CJS syntax parsed with vm.Script without evaluation; launcher/preflight
  maps exclude install-launcher/tool-path/bun-runtime/worker/EnvManager; launcher
  excludes child_process/os imports. Parser refusal markers present in worker/MCP,
  conda implementation absent. Maps omit sourcesContent; no embedded-source equality
  claim. Compiler-emitted bytes/whitespace preserved.
- Fork CI remains unchanged manual-only/unconditional **BLOCKED D12**, no actions,
  runner provisioning, upload, dispatch or job. Read-only trigger review retained
  upstream CI/Windows push/PR acquisition risks and npm-publish push/npm acquisition
  risk; no workflow change or execution. Review all upstream triggers before push.

V1 PASS. V2 compile/viewer PASS, root typecheck FAIL (known baseline). V3/V4/V5/V6
NOT RUN; V3 blocked by remaining source/native adapter/launch, V4 by U1/D9. Bedrock
unavailable and unnecessary for these checks. No real auth/inference/AWS, actual
hook/worker/MCP/service/listener/process smoke or Python/model process.

## Preservation and artifact identity

**19 input/compiler sentinels unchanged** across compile and against WINDOWS-09.
**866 selected tracked source/config sentinels unchanged** across compile (including
retained provider/native-login source, workflows, source/generator and identity
manifests). The new test was untracked during that snapshot and subsequently
committed in H; the 866 count is not an exhaustive installed-tree proof.
Existing root/plugin/viewer manifests, locks, lifecycle trust/guard unchanged.
No dependency graph/lock resolution or private plugin identity delta. Source protocol
3 is explicitly separate from those identities/locks.

**192 tracked outputs: 184 unchanged, eight modified, zero added/deleted.** Only
launcher, ensure-launcher, worker-service and mcp-server CJS/map pairs changed.
All hook/MCP configs, other wrappers and UI output bytes unchanged. Ignored NPX CLI
also compiled, not a tracked release artifact. No unexpected emitted delta retained.

| Artifact at G | SHA-256 |
|---|---|
| plugin/scripts/claude-mem-launcher.cjs | 0ae2dd99852bb4cb033f144837e36073816eeb626e7717c727887aa29b1d147e |
| plugin/scripts/claude-mem-launcher.cjs.map | 1b2fcb524cff31560b762ae8d6523cd8d927d37ef8b7132ae55f1d515bc7eff7 |
| plugin/scripts/ensure-launcher.cjs | 81f63fe2030512145342a148c2e14c157c7e9035fa9de1dc75cbbc26de1f5357 |
| plugin/scripts/ensure-launcher.cjs.map | 55ed10684c692dc45590b6ab47ac267223a2ffd4639da6f63425187a929519ca |
| plugin/scripts/mcp-server.cjs | c6ef8549f5f639df8b9b6a43170467b8ef053c3d03565fa31041f110b2c91afc |
| plugin/scripts/mcp-server.cjs.map | c6d227b29e31c05781f7477a2c71044643c4c507cd6ca538415bd90da9ae0e9a |
| plugin/scripts/worker-service.cjs | 55bf36ae64eb11c6c85fb87c04a3ed6e81fdcad4f9984d1d17844e24672dd68a |
| plugin/scripts/worker-service.cjs.map | b072c0f89b285f3e91a719e5a1c31bde78ea5c0393ad2155ec8ba05a9f80ddc1 |

Disposable evidence hashes (conclusions above are tracked): compile.log
`1c3026acc2c3350c0b6ecda168c306f4979c7a9094815cc35caae612bbdf8278`;
children.jsonl `78f95c2ed8d132f8ccffb4e555801ce3418ce77d30a8170cf333917e1aaa9286`;
tests.log `f6e5ff98d072c418d36ca99406bdad4c50b7eac215851d1e59631f5762d392cb`;
postcompile-tests.log `d007808ab6e8ce6619d1d0830261696052379b510beab455163ef618b991de17`.

## Rollback and next launch

Revert G, H, S, bootstrap 8bbf2830c, launcher e9c8038ca in reverse order, reviewing
later overlap. Source/generated form one candidate; never run an intermediate
mismatch. Reversion restores unsafe legacy discovery/bootstrap and is not runtime
approval. No reset/clean/reinstall or real data/settings/registration rollback.
Preserve S0d0a4b176/G004588740/Hf2c722fad and earlier safeguards.

First local git add failed with sandbox index.lock permission denial, before any
commit. Authorized escalation then created the five local commits with hooks/signing
disabled; no automatic-review rejection, push or history rewrite. After the chat
resumed on 2026-11-03, branch/HEAD/status and source fingerprints matched; no test,
typecheck, compile or application process rerun on resume.

Shared STATE/TASKS/WORKLOG/DECISIONS/contracts/environment/NEXT-SESSION are updated
at closure; reservations released. **Next: WINDOWS-09C remaining source**, same
step 9, using [NEXT-SESSION](../NEXT-SESSION.md). Finish direct hook/MCP/Setup/grammar
refusal paths and native-adapter prerequisites before proposing a separate V3 launch.
No other step or runtime/acquisition/registration/CI/user-state permission inferred.

Closure validation PASS: 14 changed/new Markdown files, 106 relative links, 39
source-SHA line assertions, balanced fences and documentation whitespace. Roadmap
dependency graph and six historical contracts/handoffs unchanged. Application/
harness/generated worktree matches G; no application source edit or compile rerun
after the validated build. Docs commit follows these checks.
