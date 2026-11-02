# Development baseline and user-provided execution evidence

Updated: 2026-11-02. Supersedes the pre-install assumption in the 2026-10-30 launcher.
This is not full runtime acceptance. Current agent session: file/Git inspection and docs only.

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
this docs task did not change engine/toolchain configuration. Next execution session
checks resolved paths/versions first; historical successful executable paths were not logged.

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

## Git and source delta at inspection

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

## Next validation contract

Do not reinstall by default. Use the user-prepared environment after the new session
explicitly authorizes local build/targeted tests. Confirm tool paths/versions and local
compiler files without credential/settings reads; dependency metadata review stays narrow.
First preserve/reconcile user WIP, then implement step 2. Existing `package.json:74`
still calls lock generation; `scripts/build-viewer.js:71` still calls npm ci. Successful
upstream build removes neither call. Preserve new trust JSON as a required generator input.

No fresh acquisition/global tools/Python/models/service/AWS needed by default. Missing
inputs: record exact command/input/permission and continue independent source work.
Each check records command/cwd/source and lock hashes/result/evidence path. Offline,
no-egress, reproducibility and full runtime acceptance remain separate gates.
