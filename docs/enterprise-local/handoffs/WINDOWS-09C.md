# WINDOWS-09C — remaining host/bootstrap/grammar refusal slice

2026-11-03, feat/cmem-light-local, one coordinator, serial, no agents/branches/
worktrees. Clean entry **59c7094820cb623496c478d06ad845e89b0f7e4a**. Claim recorded
in TASKS before source edits. **Partial step 9; no activation or V3 evidence.**

| Commit | Concern |
|---|---|
| 2d8688e781d287f4d5e28985f3f834a454f845b6 | Canonical host gates and seven paired configs/wrappers |
| 4945a916e5193f6dee9cc1dde476c2103ea10b22 | CLI dispatcher/direct runtime/doctor and plugin signup/bootstrap refusal |
| c9978be26a5b27c99b3a2baf3f5aa7c6139e600b | Legacy installer utilities retired to refusing compatibility APIs |
| **S bc3275b4c3c3a0a0335322a8ac5a14e07a245e28** | Grammar/native build/query refusal; final application source snapshot |
| **H abfce3963340a06ecd9b6b3112fb4e87764bfc57** | Source/mock tests, wrapper specs and native-kind rejection |
| **G 4ac6ad868704f76f2b31da4b28bddc3407a6631b** | MCP CJS/map pair from one reviewed compile |

Documentation follows G. Preserve WINDOWS-09 S0d0a4b176/G004588740/Hf2c722fad and
WINDOWS-09B launcher e9c8038ca, bootstrap 8bbf2830c, S e3d91a505/H bbc3847e9/
G 62a468f6d. Their pinned handoffs remain historical, not current source line maps.

## Static source boundary (inspected at S)

| Path:line | Result and limit |
|---|---|
| src/build/hook-shell-template.ts:29 | Authored inert JS gate reads only explicit CLAUDE_MEM_BUNDLE_ROOT and selected paths. Missing/relative root, missing launcher, root alias/foreign wrapper entry, and present-but-unapproved root refuse. No worker/MCP require, cache/global launcher/cwd/host-root discovery, acquisition, repair or child process. Presence is never artifact approval. |
| src/build/hook-shell-template.ts:45 | Claude exec hooks use Node with the inert inline gate, no on-PATH claude-mem application launcher. Runtime hook envelope is exit 0/empty stdout/diagnostic stderr; observation/file-context opt-out precedes root access. SessionStart inline refusal emits no ready/capture JSON. Original compiled protocol-3 launcher and ensure-launcher preflight remain unchanged. |
| src/build/hook-shell-template.ts:51 | Codex Windows and POSIX templates emit the same refusal. MCP inline gate and Setup fail exit 1/empty stdout; no require of mcp-server or version-check. Interpreter/shell selection is still a gap below. |
| src/build/hook-shell-template.ts:61 | bun-runner.js, version-check.js, worker-wrapper.cjs and qoder-hook-launcher.cjs are generated standalone refusal gates. No Bun discovery, setup install, dependency probe, cwd repair, worker restart/tree kill or bootstrap. Qoder refusal exits 0 with empty stdout; other direct wrappers exit 1. |
| scripts/build-hooks.js:330 | Canonical verification checks host entries and all four wrapper bytes. Regeneration mode shares the same source. Old required cache/fixBrokenScriptPath assertions replaced by refusal/explicit-root assertions; no trust/manifest generator policy change. |
| src/npx-cli/index.ts:94 | All non-help/version commands refuse before dynamic installer/runtime/doctor/IDE/registration imports, including uninstall/prune. This broad dispatcher refusal prevents selecting a legacy command accidentally. No default provider/login is selected. |
| src/npx-cli/commands/runtime.ts:143 | All exported run* command bodies refuse before discovery, HTTP, state reads or spawn, including MCP/hook/search/worker aliases. Private old helpers remain dormant; this is not certification of arbitrary independent imports. |
| src/npx-cli/commands/doctor.ts:431 | Direct runDoctorCommand refuses before host/worker/Chroma census. Other diagnostic helper exports remain, see gaps. |
| src/npx-cli/commands/install.ts:1679 | Plugin signup start, wait (1877), complete (1889), deferred offer (1970), enrollment activation (1992) and trial completion (1996) bodies are explicit refusals. Install/repair inner bodies (2437/2441) no longer contain their bootstrap implementations. Other legacy helper exports remain. Provider native-login implementation files are preserved. |
| src/launcher/install-launcher.ts:1 | No imports or private native runners remain. Compatibility operations reject before option/host inspection. Compile arguments/probe/PATH lookup/short-name/codesign APIs cannot invoke injected runners; registry script is only a throw. Removal has no default host discovery. Historical success type labels cannot be returned by these refusing implementations. |
| src/services/smart-file-read/parser.ts:866 | parseFile and parseFilesBatch (870) throw LOCAL_GRAMMAR_UNAPPROVED; unfold inherits that refusal. Grammar module resolution, data-dir library cache, source-mtime build, native build/query and -p fallback removed. No silent empty/partial-symbol success or invented approved grammar manifest. Pure formatting/symbol helpers retained. |

The source generator was applied under the isolated task env using a reviewed
scratch script importing only the pure template and build manifest (buildHooks
autorun guard stays false). Seven paired outputs are plugin/.mcp.json,
plugin/hooks/{hooks,codex-hooks}.json and the four wrappers. Qoder config itself is
unchanged; its existing wrapper now refuses. No real host process was exercised.

## Harness (inspected at H)

scripts/enterprise-local/compiled-smoke.mjs:9 copies eight exact hashed outputs,
including MCP and four wrappers, exclusively below task scratch windows-09c.
At :97 twelve wrapper root-required/missing/unapproved negative specs supplement
the prior launcher missing/stale/refusal specs. No runtime-version/provenance success
or worker/MCP initialize/list-tools success is fabricated.

At :121 native-kind adapters are unconditionally BLOCKED
NATIVE_OS_BOUNDARY_NOT_IMPLEMENTED before launch. Only mock orchestration can report
PASS, always V1/substituted/readiness false. A native label or self-attested methods
cannot yield V3. Existing deadlines/output limit/owned cleanup error handling remain.

## Checks actually run

Reviewed tests, imports, fixtures, preload, generator and child/network behavior
before execution. Existing exact tools verified Node **22.23.4**, npm **10.9.9**,
Bun **1.4.4 (38afee6c8)**; no installation/update or dependency/lock resolution.

Scratch env clears ambient variables, then permits only explicit Windows/tool PATH
and synthetic HOME/USERPROFILE/APPDATA/LOCALAPPDATA/CODEX_HOME/CLAUDE_CONFIG_DIR/
data/temp under `.scratch/enterprise-local/windows-09c`. Empty npm user/global
configs, isolated cache/offline/audit/fund/update settings; BUN_INSTALL_AUTO=disable.
No real settings, credentials, memory, Python/model/assets or caches inspected/copied.

- `bun test --preload ./.scratch/enterprise-local/windows-09c/test-guard.ts --timeout 20000 tests/enterprise-local/windows-09c.test.ts tests/enterprise-local/compiled-smoke.test.ts`: **20 PASS, 0 FAIL, 234 assertions** at final source. Source gates run in VM with mocked fs/process, never emitted application code; CLI refusal bodies inspected with TypeScript AST without importing installers. Zero process/socket/listener/fetch tripwire operations.
- Following new emission, `compiled-smoke.test.ts` alone: **10 PASS, 107 assertions** against copied exact current hashes, mock-only, zero tripwire operations. These repeat ten of the twenty tests, not thirty unique tests. Earlier smaller reruns occurred while source/tests changed; they are not added to the unique count.
- Exact Node `node_modules/typescript/bin/tsc --noEmit`: **FAIL exit 2**, precisely three unchanged TS2345 at ChromaMcpManager 227/842 and ChromaSync 385. Full diagnostic bytes equal 09B. Viewer `--noEmit -p src/ui/viewer/tsconfig.json`: **PASS**. Final typecheck repeated after direct CLI source edits; no application runtime imported or Chroma workaround applied.
- **ONE** `npm.cmd run build:compile`: **PASS exit 0**, unchanged BUILD-02 guard SHA-256 `851d5c238998758aab8b79757cb68c2ba67e7a5c764affee2fd5733180c76115`. Nine Node initializations, five spawns, one execFileSync/exec/execFile; local compiler/generator/tsc/Vite and known Vite net use query. No Node socket/acquisition/deploy event. Native/shell/OS-wide egress remains unproved.
- Five changed JS/CJS artifacts parsed with vm.Script **without evaluation**; MCP has grammar refusal marker. Map has no sourcesContent, so no embedded-source equivalence claim. Canonical pairing passed within compile. No application/harness/generator edits after compile.
- PowerShell planner unchanged, source-only BLOCKED D5; no redundant planner execution. Fork CI unchanged/manual-only/unconditional BLOCKED D12. Retain 09B trigger review; all relevant upstream triggers still need review before any future push. No CI job, provisioning, dispatch or upload.

One scratch editor initially used the wrong relative TypeScript module path and
failed before writing; corrected locally without repair/acquisition. Patch-context
failures made no changes. Initial Git index write was sandbox denied; authorized
escalation created local commits with hooks/signing disabled. No automatic-review
rejection, history rewrite or push.

V1 PASS; V2 compile/viewer PASS, root baseline FAIL. **V3/V4/V5/V6 NOT RUN**.
Bedrock unnecessary for these checks. No actual generated hook/worker/MCP/service/
listener/process smoke, native grammar/Python/model process, auth/inference/AWS.

## Preservation and paired outputs

19 input/compiler sentinels unchanged **across compile**. Compared with 09B, 18
unchanged; the only intentional input-sentinel delta is scripts/build-hooks.js.
Manifests/locks/trust/guard/compiler bytes preserved. 868 selected tracked source/
config sentinels unchanged across compile, including providers/native-login, SDK,
workflows, UI, identity manifests and generators. This is not installed-tree or
supply-chain provenance proof. No plugin identity or launcher protocol delta.

192 tracked outputs: **190 unchanged, two modified during compile**, zero added/
deleted. Only MCP CJS/map pair changed; worker, protocol-3 launcher and compiled
preflight bytes unchanged. Total entry-to-G generated/config delta is nine files:
the seven canonical host outputs plus that MCP pair. Ignored NPX CLI compiled but
is not a tracked release artifact. Viewer/SQLite/Chroma/provider sources and existing
identity/sharing/filter/capture/retrieval semantics were not redesigned. Parser
unavailability is now explicit. U1/D9 activation stays blocked; no SQLite-only bypass.

| Artifact at G | SHA-256 |
|---|---|
| plugin/scripts/mcp-server.cjs | c842d292e6a67b43c1256efcceeea5695529b9a69edc5625e98eb687936a8125 |
| plugin/scripts/mcp-server.cjs.map | 7e0a05d2ca6877a1580b468dd4a98010070025f8fff0a497805c294e1d0f46e0 |
| plugin/scripts/bun-runner.js | 2f52a15211d5c31c977e46c18b4f8813b83174ef840e12599e302ed80b1b7a15 |
| plugin/scripts/version-check.js | 38fb836b4c15a8bb1413a842826bc71f8106f49a0d0fde3e6fd9a170e2d3ac89 |
| plugin/scripts/worker-wrapper.cjs | 4ae5f3fd17e32c151d1a8ddf37e295d14601ddc88a13eeb7d216520dda8e70a6 |
| plugin/scripts/qoder-hook-launcher.cjs | 055a99315c97e0726ab920106be47667b93c8f8dd8251fee962d6fc975886e9e |

Disposable evidence: compile.log `8c69e10a55ab25197e62ed0d81e1c06aae5f44187b2f8f4d91a5e5ca01f9b876`;
children.jsonl `64ab5f883eb5e5d54c3029c6f220719f28bc0498918a9baf5b3df2f3b421fa8e`;
tests.log `43cfe82d72139184fe45cc808c85197564c3b03a9cab98bc0a7dfc187eacc626`;
postcompile-tests.log `42e218ff58c8b388351a73e73a1c4b4c82e1a460fd07d53d3f4908bb471d6011`.
Durable conclusions are here; scratch files are not future prerequisites.

## Exact remaining same-step gaps and next task

1. **Host interpreter/loading**: src/build/hook-shell-template.ts:44 still emits
   bare node; :51 Windows command quoting and :54 POSIX /bin/sh hosting remain
   unproved on actual hosts. Standalone shebangs/Qoder config also use host Node.
   Application discovery/launch bypasses were removed, but this does not pin or
   approve that interpreter. Finish an explicit absolute runtime/path input and
   refusal/substitution contract without guessing private registration or approving
   bytes by file presence. Preserve both proposed D5 options in WINDOWS-09: private
   registered namespace vs explicit absolute unpacked path. Neither is selected.
2. **Dormant direct helper APIs**: install.ts still exports makeIDETask (:293),
   marketplace writers (:798/:825), mergeSettings (:955), openBrowser (:1160),
   promptProvider (:1177), worker-stop helpers (:2117/:2158). runtime.ts private
   helper bodies and doctor.ts diagnostic exports (:130/:246/:268/:365) also remain
   behind refused command roots. No blanket independent-import safety claim. Trace
   only their direct consumers before retiring/gating leftovers; preserve native
   provider login implementation and selected-provider auth support. No new audit.
3. **Native V3 adapter**: no implementation. Required before any actual launch:
   atomic owned Windows process-tree admission before code runs (including startup
   failure), descendant tracking without PID-reuse/global-name kills, OS-enforced
   inherited egress and DNS denial before resume, bounded output/timeout, teardown
   and OS empty-tree/listener/handle/boundary-release assertions on every path.
   Current Node orchestration cannot supply those OS guarantees; adding attested
   callbacks or a native label would not implement them. This session therefore
   blocks native adapters instead of authoring a nominal adapter with fake proof.
4. **Artifacts/specs**: exact runtime version/hash/ABI and grammar/native/query
   approved closure still absent. No activation manifest invented. MCP initialize/
   list-tools and worker lifecycle refusal/startup-failure specs remain to author
   once prerequisites are concrete. Current negative wrapper specs are V1 only.

Next single task: **WINDOWS-09D remaining source**, under NEXT-SESSION; finish the
explicit interpreter/direct-helper source boundary and native adapter prerequisites.
Not a V3 launch. Actual runtime stays blocked until approved immutable artifacts,
implemented OS ownership/egress/DNS boundary, launch permission and verified cleanup
contract are all ready. Step 6 profiles, D5/D9/D11/D12 and A15 steps 10/11/12 stay open.

## Rollback

Revert G, H, S, c9978be26, 4945a916e, 2d8688e78 in reverse order, reviewing later
overlap; source/generator/paired outputs form one candidate. Reversion restores
unsafe legacy discovery/bootstrap/build paths, not runtime approval. Preserve all
09/09B earlier commits. No reset/clean/reinstall, registration or real-state rollback.
Shared STATE/TASKS/WORKLOG/DECISIONS/contracts/environment/NEXT-SESSION close this
session; reservations released. Full step 9 remains partial.

Closure checks PASS: 14 changed/new Markdown files, 107 relative links, 21 pinned
source-SHA line assertions, balanced fences and documentation whitespace. Roadmap
dependency graph and six historical handoffs unchanged; application/harness/paired
outputs match G. Checker initially trimmed a leading source newline; corrected the
checker, with no source edit. Documentation commit follows closure verification.
