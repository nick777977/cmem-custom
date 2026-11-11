# Cleanup analysis evidence

Date: 2026-11-11. Inspected source SHA:
`a9364604d026d79be8ab771ecb861688972d169c`.
All source line references below refer to this SHA, not a future cleaned build.
The checkout was clean on `feat/cmem-light-local` before creating the explicitly
requested `codex/repository-cleanup-plan` branch. No subagents/worktrees were used.

## Source findings

| Evidence at inspected SHA | Implication |
|---|---|
| `package.json:75` (`build:compile`); `scripts/sync-plugin-manifests.js:121` required-input loop | Build requires Qoder/Grok/DSH/OpenClaw/Cursor manifests. Delete callers/targets together, not host directories first. |
| `scripts/build-hooks.js:11,482,483,1138,1142` | Pi/DSH build helpers and attribution preflight are mandatory; Pi/DSH target retirement must remove the preflight dependencies as well as output. |
| `scripts/build-hooks.js:1098,1123` | OpenClaw/OpenCode builds have existence guards. These guards do not make the separate manifest sync optional. |
| `scripts/build-hooks.js:268,1180` | Qoder hook generation and verification remain part of compile. |
| `src/cli/adapters/index.ts:3,6,16` | Target-host narrowing requires adapter imports and switch cases, not only package metadata deletion. Preserve common/raw handling. |
| `src/services/worker-service.ts:91,98,99,400,605` | Local worker uses Better Auth, SQLite API-key helpers and ServerV1Routes. `src/server/` cannot be removed wholesale. |
| `src/services/worker-service.ts:102,110,885,887,1656` | Cursor installer/dispatch and Grok index watcher are referenced by the retained worker. Unused outer host packages do not imply detached worker code. |
| `src/services/sqlite/SessionStore.ts:69`; `src/services/worker/http/routes/DataRoutes.ts:25` | CanonicalContent is part of retained SQLite/data behavior. |
| `src/services/sync/ChromaSync.ts:5`; `src/services/worker/DatabaseManager.ts:6,38` | Shared string-list parsing and local Chroma are live. The `sync/` directory must remain. |
| `scripts/enterprise-local/codex-local.mjs:35,53` | Private stage copies named worker/MCP/context/SQLite/skills files and complete `modes`/`ui` directories. Asset/mode cleanup must inspect staging as well as imports. |
| `scripts/enterprise-local/compiled-smoke.mjs:9,98` | Historical/current shared admission fixtures name Qoder wrappers; adapt live fixture expectations during retirement without deleting common lifecycle coverage or historical evidence. |
| `.github/workflows/ci.yml:77,87,179,226,294,371` | CI still references OpenClaw, Cowork, cloud services and Docker. Workflow preservation requires coordinated job/reference treatment. |
| `.github/workflows/deploy-install-scripts.yml:20`; `.github/workflows/ods-native.yml:5` | Public deploy and ODS workflows also depend on candidate code. Keep files; do not silently leave functional jobs pointing at deleted inputs. |
| `.github/workflows/fork-local-validation.yml:4,14,25` | Local validation skeleton remains manual, unprovisioned and deliberately blocked. No runner/CI activation is needed for cleanup. |
| `.github/workflows/ci.yml:3`; `.github/workflows/npm-publish.yml:4` | Other upstream definitions have automatic event triggers. Analysis/commit does not run them; there was no push or publication. |
| `scripts/chroma-local-requirements.txt:25,50` | gRPC packages are pinned Chroma dependencies, not a gRPC plugin. No tracked filename matched `*grpc*`. |
| `src/server/auth/BetterAuthRoutes.ts:19`; `src/server/auth/auth.ts:4` | Better Auth is a retained local route dependency despite the independently recorded HTTP 500. |
| `scripts/harness-plugin-build-options.js:24,46` | Pi/DSH license/provenance inputs are checked by the build. Preserve notices and retire build preflights deliberately. |

All baseline paths and their Git object identities are in
[`inventory.tsv`](inventory.tsv). The TSV excludes this chat's new planning files
because its denominator is the pinned 2,997-file baseline. None of its group
labels authorizes deletion.

## Reproduction and limits

[`analyze.mjs`](analyze.mjs) uses Node built-ins, `git ls-tree` and the existing
TypeScript compiler API. Executed with the documented direct binary:

```powershell
& 'C:\Users\MykolaPushnikov\AppData\Local\Volta\tools\image\node\22.23.4\node.exe' `
  docs/enterprise-local/cleanup/analyze.mjs `
  .scratch/enterprise-local/repository-cleanup
```

Node reported `v22.23.4`; parser package reports TypeScript `6.0.3`. No tool was
downloaded, installed or upgraded. The script reads baseline-tracked source in
the working tree; rerun only on unchanged baseline source, or revise the source
pin and compare first. It never imports or executes project application modules,
compiler project plugins, tests, build generators, install scripts or profiles.
It writes reports only to the selected workspace-local output directory.

Final run: 2,997 indexed files; 1,997 parsed code files; 6,133 resolved local
module edges; 4,780 non-relative module references; 463 conservatively reached
files from the six entrypoints listed in the analyzer; 3 unresolved relative
references; 51 computed module calls. The 11 reached `C-HOST` modules require
rewiring. Other groups are mutually exclusive policy classifications, not a
complete semantic liveness proof. A mixed type import can conservatively retain
an entire module. Reachability does not establish that a branch executes.

Resolved module edges, external references, computed calls and unresolved paths
were written to scratch `module-edges.json`; counts/group/root statistics to
scratch `summary.json`. The durable TSV and these findings are sufficient to
resume; scratch is disposable and contains no sole copy of a scope decision.

The three unresolved relative references are:

- `openclaw/test-sse-consumer.js:2`, generated `./dist/index.js` absent from tracked baseline.
- `scripts/export-memories.ts:10`, `./types/export.js`; needs manual review if the script is touched.
- `tests/services/sync/chroma-mcp-manager-singleton.test.ts:341`, a `.ts?bound-to-child-…` query-suffixed import used by a fixture.

Computed application/tool loading outside tests includes the in-memory build
module and standalone server custom-provider loading. Python/shell/HTML/CSS,
package exports, manifests, filesystem paths, JSON resources, fixtures and CI
were reviewed at the key entrypoints, not resolved by the JS module graph.
No “zero inbound edges means delete” rule is used. The graph excludes emitted
plugin/OpenClaw bundles and ordinary `.d.ts` declarations; tracked Git symlinks
are inventoried without following their targets.

## Work performed and checks

- Read the project entry/handoff/roadmap/ownership/environment documents.
- Read-only tracked-path, byte-size, manifest/generator, host, local runtime,
  licensing-file and CI reference inspection using Git, PowerShell and `rg`.
- Created only planning/analyzer/index documents and small shared-memory pointers.
  The main roadmap, source, package/lockfiles, generated outputs and workflows
  were not edited. No file was deleted.
- Initial analyzer refused a Git symlink in an evaluation fixture. It was
  corrected to inventory symlink blobs without parsing/following them; final
  analysis succeeded. This was tooling validation, not an application test.
- Report integrity passed: 2,997 unique rows, byte/closure totals matched, all
  baseline `docs/`, `plans/` and `.github/` entries protected, and the durable TSV
  matched its scratch original. Product/build/workflow/main-roadmap paths had
  zero Git delta; `git diff --check` passed. No build/typecheck/application
  test/runtime/CI/live inference.

The 8 retained PDFs alone occupy 123,009,837 Git-blob bytes. First candidate
buckets total 4,203,620 bytes. The conditional server bundle/map pair occupies
4,233,696 bytes. These are source-tree figures, not install size, transitive
dependency size or eventual clone savings. Runtime correctness after removal
is unknown until the proposed implementation gates actually run.
