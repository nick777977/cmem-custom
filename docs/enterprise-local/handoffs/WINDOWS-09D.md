# WINDOWS-09D — explicit interpreter and independent helper refusal

2026-11-03, feat/cmem-light-local, one coordinator, serial. Clean entry
**8b39d1f86aff635ae1660a12fa79c656a513db71**. Exact TASKS claim preceded edits.
No agents/branches/worktrees/other steps. **Partial step 9; do not activate.**

| Snapshot | Concern |
|---|---|
| **B 855ef7d6e7d5a5b34de694d8b7636cf92f70155e** | Host interpreter/refusal source, generator and eight paired configs/wrappers |
| **S 236dd661ce44333c0f4f7b715469a5f61e2a44e6** | Independent installer/diagnostic refusals; final application source |
| **H 2935e19d04e6d05dbebef89cef96695e7d95cbf9** | V1 tests and interpreter-negative copied-wrapper specs |

One compile at H emitted **no tracked delta**. B already contains all eight paired
changes; no empty generated commit or new provenance success was invented. Docs
follow H. All application/generator/harness bytes remain at H after compile.

Preserved historical evidence: WINDOWS-09 S0d0a4b176/G004588740/Hf2c722fad;
WINDOWS-09B launcher e9c8038ca/bootstrap 8bbf2830c/S e3d91a505/H bbc3847e9/
G 62a468f6d; WINDOWS-09C host 2d8688e78/CLI 4945a916e/utilities c9978be26/
S bc3275b4c/H abfce3963/G 4ac6ad868. Their handoffs are unchanged historical evidence.

## Static source boundary (inspected at S)

| Path:line | Result and limit |
|---|---|
| src/build/hook-shell-template.ts:31 | Authored JS refusal accepts an explicit interpreter path (literal renderer input, or CLAUDE_MEM_NODE_EXECUTABLE for direct wrappers). Requires normalized local absolute spelling; refuses UNC, relative/missing/aliased/foreign executable before bundle inspection. Compares real paths to process.execPath. No subprocess, application load, acquisition or repair. These checks run after an interpreter is already executing; they are **not pre-execution artifact admission**. |
| src/build/hook-shell-template.ts:48 | Canonical structured command is empty: an intentionally unbound, non-runnable template, not a guessed runtime path, namespace or environment-substitution promise. Real host behavior with this invalid/unbound command is untested; never register it or describe it as successful hook execution. |
| src/build/hook-shell-template.ts:54 | Source renderer validates explicit literal Windows drive-absolute .exe or POSIX path, preserving spaces/Unicode and rejecting traversal, UNC, shell/substitution metacharacters and unknown platforms. This only renders structured argv for an inert gate; no filesystem/version/hash/ABI approval, registration or application launch follows. |
| src/build/hook-shell-template.ts:72 | Codex Windows/POSIX and Setup shell forms are constant exit 1. No bare node, /bin/sh selection, environment expansion, command quoting or runtime fallback. Host-provided shell behavior remains untested. Unsupported shell binding refuses; it is not silently converted to a successful no-op. |
| src/build/hook-shell-template.ts:80 | Four standalone wrappers have no env-node shebang. They require an explicitly supplied interpreter when invoked directly, then only refuse. Present matching paths still produce PRIVATE_LAUNCH_POLICY_PENDING; version/hash/ABI approval is absent, never implied by presence. |
| scripts/build-hooks.js:259 | Qoder joins the canonical exec manifest: empty interpreter plus inline refusal, no QODER_PLUGIN_ROOT-to-wrapper hosting. Existing matchers/timeouts/env retained. MCP interpreter is also canonical/unbound. |
| scripts/build-hooks.js:314 | Structured entry verification compares canonical entries; :377 verifies MCP command and complete -e argv. Bare-node or alternate command edits are rejected by pairing checks. |
| src/npx-cli/commands/install.ts:28 | Auto-memory settings, IDE task construction, installer command generation, marketplace writers, mergeSettings (:53), browser (:71), provider prompt (:76), worker stop/overwrite (:359/:369), credential/default-provider validation (:379) refuse before argument/default/callback/state access. mergeSettings has no eager user-settings default. |
| src/npx-cli/commands/install.ts:118 | Plugin signup response admission and trial response parsing (:218) now refuse too, allowing state-reading gateway/TeamBrain runtime imports to be removed rather than loaded by a direct helper import. CMEM activation builders (:203/:211), worker failure helper (:342) and command roots (:405/:410) refuse. Types and pure formatting/body helpers remain; no provider login implementation was removed. |
| src/npx-cli/commands/runtime.ts:1 | All private discovery/spawn/server-embedder bodies and runtime imports retired. serverVectorSearchAllowed explicitly refuses rather than reading settings or enabling keyword-only fallback; existing run* refusals retained. |
| src/npx-cli/commands/doctor.ts:16 | Independent Chroma/root/grammar/marketplace/launcher/version diagnostics return required fail/LOCAL_DIAGNOSTICS_UNAPPROVED without probes or eager host/PATH defaults. Private HTTP/census/fs/version implementations removed. Only pure Windows shim-text parsing remains; external types are type-only imports. |

Direct source-consumer trace only: installer IDE/marketplace/settings/provider/worker
helpers had internal consumers in install.ts; browser export additionally has
teambrain.ts callers (:581/:819 at S), which now receive the explicit refusal.
Diagnostic helpers and serverVectorSearchAllowed have no other source consumers.
IDE/native-provider modules formerly dynamically imported by makeIDETask were not
deleted or certified safe for arbitrary independent execution. Existing upstream
tests expecting installer success are superseded for this blocked candidate, not run
or reported green. No whole-suite or broad inventory rerun.

Envelope distinction: protocol-3 launcher/ensure-launcher bytes remain unchanged.
The authored JS hook gate retains exit 0/empty stdout and early opt-out. **Unbound
structured templates cannot promise that envelope on real hosts**; shell entries
explicitly fail. This is a deliberate pre-binding refusal, not usable integration
or a runtime safeguard. D5 private registered namespace and explicit absolute
unpacked-path options both remain proposed; no loading identity was selected.

## Harness (inspected at H)

scripts/enterprise-local/compiled-smoke.mjs:45 confines fixture ownership to
.scratch/enterprise-local/windows-09d. At :97, 28 wrapper negative specs cover
missing/relative/missing-file/stale interpreter, missing root/bundle and unapproved
bundle. Tool strings in tests are synthetic; copied outputs are hashed, never
evaluated. Native-kind rejection at :129 stays unconditional before launch:
NATIVE_OS_BOUNDARY_NOT_IMPLEMENTED. No native label/callback attestation yields V3.
MCP initialize/list-tools and worker startup/lifecycle success are not fabricated.

## Checks actually run

Reviewed test files/imports, fixtures, VM/extracted-body behavior, copied-artifact
cleanup, preload/network/process tripwires, compile scripts and exact inputs first.
Existing Node **22.23.4**, npm **10.9.9**, Bun **1.4.4 (38afee6c8)** verified; no
upgrade/install, dependency resolution or lock mutation.

All synthetic state under .scratch/enterprise-local/windows-09d. Ambient env cleared;
process-local explicit tool/Windows PATH; synthetic HOME/USERPROFILE/APPDATA/
LOCALAPPDATA/CODEX_HOME/CLAUDE_CONFIG_DIR/data/temp; empty npm user/global configs,
isolated cache/offline/audit/fund/update settings; BUN_INSTALL_AUTO=disable. No real
settings/credentials/CODEX_HOME/memory/models/caches or installed runtime assets read.
Approved existing compiler/lock sentinels only, not an installed-tree audit.

- `bun test --preload ./.scratch/enterprise-local/windows-09d/test-guard.ts --timeout 20000 tests/enterprise-local/windows-09d.test.ts tests/enterprise-local/compiled-smoke.test.ts`: **20 PASS / 433 assertions**, zero forbidden tripwire events. Authored JS uses VM fs/process mocks; installer declarations are extracted/transpiled with existing TypeScript and invoked with poisoned inputs, without importing the installer/application. Diagnostic/runtime modules have no application runtime value imports. Copied artifacts are exercised only through mocks: V1/substituted/readiness false.
- Exact Node `node_modules/typescript/bin/tsc --noEmit`: **FAIL exit 2**, only unchanged TS2345 at ChromaMcpManager 227/842 and ChromaSync 385. Full diagnostic bytes equal 09C. Viewer `--noEmit -p src/ui/viewer/tsconfig.json`: **PASS**. Final source checked, no Chroma workaround.
- **ONE** `npm.cmd run build:compile`: **PASS exit 0**, unchanged BUILD-02 guard SHA-256 `851d5c238998758aab8b79757cb68c2ba67e7a5c764affee2fd5733180c76115`. Nine Node initializations, five spawns, one execFileSync/exec/execFile: reviewed local compilers/generators/tsc/Vite and known net use query. No Node socket/acquisition/deploy event. Native/shell/OS-wide egress unproved.
- Canonical pairing PASS inside compile. Four standalone wrappers parsed with vm.Script **without evaluation**. No application/generator/harness edits after compile. Tests not redundantly replayed after compile: fingerprints prove all their source/copied-output inputs unchanged.
- PowerShell planner and fork CI unchanged: source-only BLOCKED D5 and manual-only/unconditional BLOCKED D12. No planner mutation, provisioning/job/dispatch/upload/push or CI execution. Upstream triggers still require review before any future authorized push.

One initial V1 run failed because Bun toMatchObject altered an assertion target
before a subsequent string assertion; assertion order corrected, then final source
checks passed. A PowerShell brace-path parse error occurred before any command ran;
a JSONL summary initially treated multiple records as one JSON document, corrected
in a built-in-only checker. No repair/acquisition or permission expansion resulted.
Git index write was sandbox-denied, then authorized escalation created the local
commits with hooks/signing disabled. No automatic-review rejection or push.

V1 PASS; V2 compile/viewer PASS, root baseline FAIL. **V3/V4/V5/V6 NOT RUN.** No
actual generated hook/worker/MCP/service/listener/process smoke, auth/inference/AWS,
Python/model process, acquisition, real state, registration or machine PATH/registry.

## Preservation and paired output evidence

**19 inputs unchanged across compile**; vs 09C, 18 unchanged and only intentional
scripts/build-hooks.js delta. Manifest/lock/trust/compiler/guard unchanged. **869
source/config sentinels unchanged across compile**, including provider/native-login,
SDK, workflows, UI, identity and generators. Vs 09C only eight intended source/test
files differ (one new test). No identity or protocol delta. Not supply-chain proof.

**192/192 tracked outputs unchanged during compile**; entry-to-B delta is exactly
eight canonical configs/wrappers. No tracked output added/deleted, no compiled CJS/map
delta. Ignored NPX CLI rebuilt but is not a tracked release artifact. Worker/MCP/
protocol-3 launcher/preflight/UI bytes preserved. SQLite remains canonical, Chroma
derived; identity/sharing/filter/capture/retrieval semantics untouched. A19/A20 intact;
step-6 profile/model/auth/fallback enforcement not implemented. U1/D9 activation
blocked, D11 open; no SQLite-only success. A15 steps 10/11/12 remain open.

| Paired artifact at B/H | SHA-256 |
|---|---|
| plugin/.mcp.json | ac9ed2288e1ff3fccf4eabc4cfeb36eae168c04f274a77042bfb8c6220aba313 |
| plugin/hooks/codex-hooks.json | 0f23c6ddb9a82d9d6f7adcf7ba1cfdd7a22457bf3b080d2eb98c71578c763ac4 |
| plugin/hooks/hooks.json | 38f3ac08488f70ae24aa4ebc8b3cd469edc4ac9431826b8ec667db5c29dd62bf |
| plugin/hooks/qoder-hooks.json | 2d4487741b453a79f4590830dbaae4349ceca088b21c5e4f1eccea0e4277aa00 |
| plugin/scripts/bun-runner.js | a01ef3f77ead51b59d4199e0501b95ff5da9cace5665904c6cbe2479b43afe65 |
| plugin/scripts/qoder-hook-launcher.cjs | 7977c0e30afd0bdea8ceb857ba392c4a65a4b75b3934f2570a3c4fbe1b35983c |
| plugin/scripts/version-check.js | fa2caff5d799a363bad3b5b9f1c365b9f63cd0526604e1f9e4223e9bd51ca018 |
| plugin/scripts/worker-wrapper.cjs | a51b4c0e97c0ae213980665770b59bedc8d7fd13e8e861deb3a764f797fef579 |

Scratch compile.log `af39fb5a12f36c3200ba0ec55d86ecb03441305e2049b235e69998f1f27800d9`;
children.jsonl `b869cfea819508eef7d98d3b211b0dec65d1243044c0ba8f330460098315c841`;
tests.log `d0c404ce3729acd111cac458f17a2d926db0c8d7cd97dbf36c5acf8b9561a2d5`;
root diagnostic `5a60165e303aef0b1c0c1b60fbfac26b4884373842bc3a562d8eb6899d3f85e0`.
Conclusions are durable here; scratch is not a future prerequisite.

## Exact remaining source gaps

1. **Pre-execution interpreter/host admission remains absent.** Explicit path
   rendering and post-load realpath checks do not approve or freeze runtime bytes.
   Need concrete approved immutable runtime/hash/version/ABI/closure and supported
   host binding/loading/quoting contracts. Host substitution is unsupported; unbound
   templates are not load-tested. D5 options remain proposed, no registration. No
   approval manifest or runtime permission was inferred from existing executables.
2. **No native OS substrate/adapter exists.** runCase rejects native at H :129.
   Missing source: reviewed native helper/API and artifact contract; atomic owned-tree
   admission before any child code (including launch failure); descendant identity
   resistant to PID reuse/breakaway; inherited OS egress **and DNS** denial before
   execution; bounded startup/deadline/stream capture; every-path owned-tree stop plus
   OS empty-tree/listener/handle/boundary-release evidence. A Node wrapper or callback
   returning true cannot supply this. No actual V3 proposal until immutable artifacts,
   implemented native adapter/OS boundary, permissions and cleanup readiness all exist.
3. **Common harness failure handling is still only a mock contract.** At H
   scripts/enterprise-local/compiled-smoke.mjs:130 launch is outside try; at :143
   stop failure/timeout prevents the subsequent release assertion at :144. No native
   leak is possible in this session because native is rejected, but these paths need
   a source state machine and honest fault evidence before accepting a native adapter.
   Preserve primary and cleanup failures, validate ownership/completion handles, and
   attempt bounded release assertions on every acquired-ownership path. This is the
   next useful source-only slice, not an OS proof or a new nominal native adapter.
4. **Artifacts and real protocol/lifecycle specs absent.** Approved grammar/native/
   query/Chroma closure remains U1/D9; MCP initialize/list-tools and worker lifecycle
   success/failure expectations must derive from concrete approved inputs. Mock
   wrapper strings cannot certify these protocols. V4 needs approved Chroma assets.

One next prompt: **WINDOWS-09E remaining source — common harness admission/teardown
failure paths**, using the same runner/tests and unbound-host refusal contract.
No other step, general audit, runtime/CI/provider/acquisition/registration launch.

## Rollback

Revert H 2935e19d0, S 236dd661c, B 855ef7d6e in reverse order, reviewing later
overlap. B source/generator/eight paired outputs are one concern; no generated
follow-up commit exists. This restores legacy helper/interpreter exposure, not
runtime permission. Preserve 09/09B/09C and user state; no reset/clean/reinstall.
STATE/TASKS/WORKLOG/DECISIONS/contracts/environment/NEXT-SESSION close the chain;
reservations released. Step 9 remains partial.

Documentation closure PASS: 14 Markdown files / 114 relative links / 32 pinned-SHA
line assertions; balanced fences/whitespace. Roadmap graph and seven historical
handoffs unchanged; application/harness/paired outputs still match H. Final local
documentation commit follows this verification, hooks/signing disabled.
