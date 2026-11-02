# WINDOWS-09 — bounded refusal and smoke/CI source increment

2026-11-02; feat/cmem-light-local, one coordinator, serial, no agents/worktrees.
Clean entry **7d5f83cac2d9ca7694316bbc5d93bf8ca2ba9818**.
**S = 0d0a4b176e12945f6ade3088456d73436f38649d** (application source/tests).
**G = 0045887401cbfe23e2b9ef324720ff60383c78a1** (paired generated outputs).
**H = f2c722fad7aa274c38a2bf1fb21b9e04f1bff20f** (harness/planner/CI source).
Documentation commit follows H. This is **partial step 9**, not full WINDOWS-09 closure.

## Implemented boundary — static evidence at S

| Source path:line | Result |
|---|---|
| src/launcher/ensure-launcher.ts:5 | SessionStart calls only sibling-file preflight, prints one systemMessage JSON plus stderr and exits 0, preserving the host's nonblocking envelope. No Bun discovery, compile, installed-launcher execution, PATH/registry/rc changes or repair recommendation. |
| src/launcher/local-preflight.ts:15 | Resolves only its own executing script's physical directory. Missing/non-file/escaped sibling -> LOCAL_BUNDLE_MISSING. Present files -> PRIVATE_LAUNCH_POLICY_PENDING. Every result is blocked; existence is not stale/integrity/runtime/registration proof. No host settings/cache read. |
| src/services/smart-file-read/tree-sitter-cli-provision.ts:60 | Exact supplied absolute bundle root; regular package/executable inside it; package version and existing pinned platform SHA before any version probe. Missing/corrupt/unpinned assets refuse with LOCAL_TREE_SITTER_UNAVAILABLE. No installer/download/conda/staging/chmod/rename/PATH lookup here. |
| src/services/smart-file-read/tree-sitter-cli-provision.ts:97 | Compatibility ensure function now check-only; only verified bytes reach the existing bounded 10-second --version probe. Historical fallback callback shape retained but never accessed/called. |
| src/services/worker/tree-sitter-cli-provisioning.ts:7 | Worker compatibility wrapper only delegates to check-only verification. Missing package is explicit unavailable, not successful provisioning. |
| src/services/worker-service.ts:746 | Existing optional-parser warning/lifecycle retained, with local-assets/no-repair diagnostic. No new SQLite-only memory success mode, Chroma bypass, readiness substitution or provider changes. |
| scripts/build-hooks.js:115 | Existing ensure-launcher target still produces the paired CJS/map from source. Descriptions updated; canonical hook/MCP templates, timeout and identity unchanged. |

E14 SessionStart mutation chain and E21 acquisition helper are removed in this slice.
**Remaining E14 installer entrypoints and E21 parser PATH/module fallback are not closed.**
E12 CLI/bootstrap, E13 hooks/MCP/launcher/global/cache resolvers, native launcher installer
and version-check/runtime setup remain reachable outside this slice. Do not run them.
Old install/repair diagnostics in those other paths remain WINDOWS-09B work.
The preflight intentionally does not activate a bundle or suppress all other hooks.
Its warning is not a global enforcement boundary around the unchanged legacy launcher.

No private identity manifest delta or dependency graph change. Existing Claude/Bedrock,
Claude API/login, Codex ChatGPT login, OpenAI-compatible and other adapters remain intact.
LLM-PROFILES routing/fallback enforcement stays step 6, not implemented here. Viewer,
SQLite/Chroma identity/sharing/filter/capture/retrieval source untouched. Chroma's
LOCAL_CHROMA_ARTIFACT_CONTRACT_UNVERIFIED remains; U1/D9/D11 still open.

## Reusable process harness and CI source at H — runtime NOT RUN

`scripts/enterprise-local/compiled-smoke.mjs:18,43,67,91` reuses the reviewed
`tests/infrastructure/worker-bundle-self-contained.test.ts` copied-bundle approach.
The older fixture remains unchanged and was NOT RUN. New fixture copies exact supplied
hashes of actual generated launcher/preflight/worker into `private bundle Юнікод/scripts`.
No TypeScript application import stands in for those candidate entrypoints.

The harness exports env/fixture/case/orchestration functions; no CLI autorun or native
default adapter. Explicit tools.node/tools.bun must be absolute, supplied by the launch.
Env allowlist has only those tool directories in PATH, synthetic HOME/USERPROFILE,
APPDATA/LOCALAPPDATA/config/CODEX_HOME/data/temp/npm config/cache, telemetry opt-out and
offline settings; optional explicit SystemRoot. No parent env spread, credentials,
NODE_OPTIONS, plugin root override or real settings. Ancestor node_modules and Node-only
leaf commands avoid Bun auto-install; env hints alone are not acquisition/egress proof.

Planned exact leaf commands (NOT RUN), where `$copy` is the exclusive synthetic bundle,
`$node` is the separately approved exact Node executable and protocol is **2**:

| Command argument array under `$node` | Expected output / evidence |
|---|---|
| `["$copy/scripts/claude-mem-launcher.cjs", "--version"]` | exit 0, stdout `2\n`, empty stderr; load-only |
| `["$copy/scripts/ensure-launcher.cjs"]` | exit 0, exactly one JSON systemMessage containing PRIVATE_LAUNCH_POLICY_PENDING plus matching stderr; controlled refusal, never readiness |
| `["$copy/scripts/claude-mem-launcher.cjs", "hook", "claude-code", "observation"]` with synthetic CLAUDE_MEM_DISABLE_TOOL_HOOKS=1 | exit 0, empty stdout/stderr; opt-out before root/settings/Bun lookup; no-op only |

Empty stdin, 15-second completion deadline, 64-KiB total captured output limit;
stop-owned-tree and assert-released each have a 5-second deadline. No ports/listeners
are allocated by these cases; expected owned ports = zero. MCP initialize/list-tools,
worker readiness/API/restart, missing/stale runtime and Chroma refusal process cases
remain source/runtime continuations; the three leaf specs are not complete V3 coverage.

An adapter must synchronously return an OS-owned process-tree handle, capture bounded
streams and implement stopOwnedTree/assertReleased. No image-name kill, global worker
stop or borrowed port. A future native adapter must enforce/verify OS child ownership,
egress/DNS and descendant cleanup, including startup/timeout/failure; none is supplied
as a runnable default. **Actual V3 is BLOCKED by that reviewed adapter/process scope**.
Mock adapters report V1/substituted=true, never V3. Preserve failure logs/hashes before
verified cleanup. Fixture creation claims an exclusive descendant of task scratch,
checks parent physical containment; it deliberately retains files and has no recursive
delete. Future launch cleanup must verify task-owned descendants/reparse points first.

PowerShell planner `scripts/enterprise-local/windows-bundle.ps1` only emits BLOCKED
D5/zero-mutation JSON and exit 1 for Install/Verify/Uninstall/Rollback. This is a
reviewable source planner, not an installer or an implemented rollback journal.

`.github/workflows/fork-local-validation.yml:3,12,19`: manual-only workflow_dispatch,
permissions {}, unresolved unapproved self-hosted Windows label, 15-minute job timeout,
exact Node 22.23.4/npm 10.9.9/Bun 1.4.4 declarations, unconditional blocking preflight.
V1/V2/V3 commands/stage contracts are comments, NOT executable jobs; no checkout/setup/
install/upload/deploy action. D12 runner/artifact/network/retention policy is unknown.
This skeleton cannot pass as a green fork lane; neither dispatch nor provisioning ran.
Existing upstream CI/Windows/acquisition/publish triggers remain unchanged and require
review before any push/PR; no CI execution/upload/push in this session.

## D5 concrete options — proposed, no selection inferred

1. A private host plugin ID and private marketplace/cache namespace, explicitly
   registered from a verified bundle; approve exact IDs and upstream coexistence/
   disable procedure first. Journal only registration/files owned by this install.
2. An explicit absolute unpacked-bundle load path with host-supplied root, no global
   launcher/PATH installation; confirm both supported hosts' loading/substitution and
   update/unload behavior before adopting. Missing root must refuse, never search cache.

Either preserves existing memory identity/data semantics (A06); plugin registration
identity is a different concern. Neither option approves data-path migration or actual
registration. D5 blocks install/activate/rollback against user state, not independent
source refusal. WINDOWS-09B should implement path refusal without guessing these IDs.

## Checks actually performed

Exact tools verified: Node 22.23.4, npm 10.9.9, Bun 1.4.4 (38afee6c8).
All tests, preload, selected subprocess/env/network behavior reviewed before running.
Synthetic state under `.scratch/enterprise-local/windows-09`; process env cleared then
rebuilt from explicit tool/Windows OS entries plus synthetic homes/config/data/temp and
empty isolated npm configs/cache/offline mode. No real CODEX_HOME or assets inspected.

Commands below were run through reviewed scratch wrappers using absolute exact tools:

- `bun test --preload ./.scratch/enterprise-local/windows-09/test-guard.ts --timeout 20000 tests/enterprise-local/windows-09.test.ts tests/enterprise-local/compiled-smoke.test.ts tests/services/smart-file-read/tree-sitter-probe-output.test.ts`: final **17 PASS / 0 FAIL / 53 assertions**. Six refusal tests, eight mock orchestration tests, three existing async Buffer/string probe callback tests. Guard recorded zero forbidden subprocess/socket/listener/fetch operations. Earlier 16/49 pass preceded extra non-file/async cleanup assertions and final generated copies; do not sum duplicate runs.
- Direct `node node_modules/typescript/bin/tsc --noEmit`: **FAIL**, exactly three TS2345 at ChromaMcpManager 227/842 and ChromaSync 385 (SettingsDefaults vs Record). Compiler-host Git-blob overlay of entry S sources gives identical diagnostics. New preflight excluded from baseline root list; no checkout/source mutation/application execution. First overlay driver attempt had wrong relative compiler path and failed before checking; corrected run establishes comparison. No type suppression/guard weakening or Chroma edit.
- Direct `node node_modules/typescript/bin/tsc --noEmit -p src/ui/viewer/tsconfig.json`: **PASS**. No root npm pre/post typecheck hooks; direct compiler invocation, no application imports executed.
- `windows-bundle.ps1 -Action <Install|Verify|Uninstall|Rollback> -BundleRoot <scratch synthetic bundle> -TargetRoot <scratch synthetic target>`: parser **PASS**, four expected exit-1 BLOCKED dry-runs, zero mutations; neither named source/target directory created.
- **One** `npm.cmd run build:compile`: **PASS exit 0**, unchanged reviewed BUILD-02 guard; no preparation/lock resolution/install/deploy command. Nine Node inits, spawn=5, execFileSync=1, exec=1, execFile=1, including local esbuild/tsc/Vite and known Vite `net use`. No Node socket event. Native/shell grandchildren are outside guard coverage: no OS-wide no-egress assertion.
- Generated syntax parsed without evaluating; ensure map no longer includes install-launcher/tool-path/bun-runtime; changed maps exclude conda implementation, emitted refusal markers present. Maps omit sourcesContent: no embedded-source byte-equivalence claim. Manual CI trigger/blocker source checks PASS.

V1 PASS; V2 compile/viewer PASS **but root typecheck FAIL (unchanged baseline)**.
Actual V3 NOT RUN/BLOCKED adapter+runtime authorization; V4 BLOCKED U1/D9, V5/V6 NOT RUN.
Bedrock unavailable; never required or reported tested. No full memory/runtime readiness.

## Preservation and paired outputs

19 selected input/sentinel fingerprints unchanged across compile; old 16-input set
matches TELEMETRY-04 except intentional build-hooks.js source comments. Existing root/
plugin/viewer manifests, locks, canonical trust/allowlist/guard and installed lock/compiler
sentinels preserved. Three added root compiler sentinels cover tsc shim/lib/implementation.
This is not an exhaustive installed-tree, dependency provenance or reproducibility proof.

192 tracked outputs: **188 unchanged, four modified**, no added/deleted output. Only
ensure-launcher.cjs/map and worker-service.cjs/map changed; hook/MCP configs, all UI and
other generated entrypoints remain byte-identical. Ignored NPX CLI was also compiled;
not a tracked release artifact. Its retained installation paths are not endorsed.

| Artifact | SHA-256 at G |
|---|---|
| plugin/scripts/ensure-launcher.cjs | 98635b602e0473ed574de16f93a036eda9cd47b2f5a42a38a49e429fc8ba0072 |
| plugin/scripts/ensure-launcher.cjs.map | a0a9294f3970569dab8e790a91e5237550dd6cb0dcf4619ae465fdb81127d219 |
| plugin/scripts/worker-service.cjs | 5eb137c767f109c45aa285fc457df62351b6deb43ca370c26e9cbd728249ccc3 |
| plugin/scripts/worker-service.cjs.map | 57a0b07cefe8d0b68082ab74ba4db7c68a6caafe99107f3c9a5876a1d786fdd9 |

Disposable evidence fingerprints; conclusions above are tracked and sufficient:

| Evidence | SHA-256 |
|---|---|
| tests.log | 52b7cc1e88a5877a9016bbe833c978cd2ab3e9d3f8903f6e961855dfbbb0566d |
| compile.log | 40fa327e70968c941599be23308ff83c1b889db7140169ac98d000a8fbbf5c24 |
| compile-guard.cjs | 851d5c238998758aab8b79757cb68c2ba67e7a5c764affee2fd5733180c76115 |
| children.jsonl | a199209934e935630d64c4502fc797bd9454cffe6098188f842eec6ecc7c5ea3 |

## Rollback and next task

Revert H (harness/CI/planner), then G then S as matched source/generated concerns,
resolving only subsequent overlap. Reverting S restores unsafe repair/acquisition;
the restored configuration is not approved for runtime. Preserve baseline/trust/locks,
installed inputs, all real data and previous protections. No reset/clean/reinstall.
Local commits used hooks/signing disabled; no push or history rewrite.

Closure checks PASS: 14 changed/new Markdown files, 99 relative links, 14 source-SHA
line assertions, balanced fences and documentation/source whitespace. Roadmap graph
unchanged; INITIAL-PLAN, LLM-PROFILES and three prior handoffs unchanged. Source/harness/
generated worktree matches S/G/H; no additional application edit after the compile.
Compiler-emitted dependency whitespace is preserved verbatim, never hand-fixed.

Shared memory/contracts updated and reservations released. **Next: WINDOWS-09B source
continuation**, with [NEXT-SESSION](../NEXT-SESSION.md). Finish private deterministic
launcher/hook/MCP paths and E12/bootstrap/remaining E14/E21 refusal before proposing
actual V3. Do not begin other roadmap steps or run this candidate's processes.
