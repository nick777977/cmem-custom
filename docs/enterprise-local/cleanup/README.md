# Repository cleanup proposal

Status: **PLAN ONLY — no deletion approved or performed.** Updated 2026-11-11.
Branch: `codex/repository-cleanup-plan`.
Inspected baseline: `a9364604d026d79be8ab771ecb861688972d169c`.
This is a separate maintenance task. It does not advance or replace
[`docs/roadmap.md`](../../roadmap.md) or its next Claude target check.

## Agreed scope

The owner requested a small, local-first checkout, with an analysis and discussion
before implementation. In this chat the owner confirmed:

- Retain **Codex CLI and Claude Code CLI** as the two target hosts.
- Treat other host integrations as removal candidates. Keep the existing selected
  LLM providers/auth methods, including Claude Enterprise/Bedrock/AWS SSO, Codex
  login, direct API and OpenAI-compatible routes. Host integration and model
  provider are different things.
- Keep `plans/`, including its PDFs, until a separate agreement.
- Preserve implementation records, useful documentation, ADRs, configuration and
  CI/CD. Do not continue the main implementation in this chat.
- A separate branch, planning documents and local analysis tools are permitted.
  Deletion and application changes wait for plan discussion and approval.

Recommended execution scope: retire unneeded hosts first; then remove detached
cloud/deployment components. Treat standalone server pruning as a separate,
conditional step. Keep every documentation/licensing file by default, even
inside a candidate directory. No wholesale directory removal from this proposal.

## What the index establishes

[`inventory.tsv`](inventory.tsv) accounts for **all 2,997 baseline tracked files**,
178,676,910 Git-blob bytes (**170.40 MiB**). Each row records path, baseline blob
ID, Git mode, classification and literal-module reachability. It is a review
index, **not an executable deletion allowlist**. Sizes exclude Git history,
installed dependencies and ignored output. Working-tree CRLF sizes can differ.

The existing TypeScript 6.0.3 parser inspected 1,997 JS/TS source/test/tool files
and found 6,133 local module edges. Six local entrypoints conservatively reach
463 files, including type imports and inactive branches. Eleven reached files
are host-removal candidates that need call-site changes first.

| Baseline group | Files | MiB | Interpretation |
|---|---:|---:|---|
| Protected docs/guidance/CI/licenses | 429 | 129.40 | Keep; includes all `plans/` and historical records |
| Other-host candidates, `C-HOST` | 290 | 2.88 | Need generator, registration and caller changes |
| Cloud-service candidates, `C-CLOUD` | 62 | 1.06 | Sync hub/API implementation, excluding protected documents |
| Docker candidates, `C-DOCKER` | 12 | 0.04 | Configuration/scripts need CI dependency resolution |
| Publication-tool candidates, `C-PUBLISH` | 9 | 0.03 | Public installer/translation/release helpers, conditional |
| Local literal closure, `K-LOCAL` | 452 | 4.41 | Retain; eleven other reached files are in `C-HOST` |
| Built plugin/resources, `R-ARTIFACT` | 193 | 19.10 | Keep unless a specific retired target is proven detachable |
| Remaining source/config, `R-SOURCE` | 368 | 4.45 | Review, not proof of unused code |
| Remaining tests/evaluations/fixtures, `R-TEST` | 1,182 | 9.03 | Keep until their exact retired subject is established |

The first candidate buckets total **373 files / 4.01 MiB**, about **2.35%** of
baseline tracked bytes. This is a ceiling for these buckets, before preserving
cross-cutting configuration or other required files; not promised savings.
The standalone server CJS/map pair is another **4.04 MiB**, conditional below.

Eight PDFs occupy **117.31 MiB**, about 69% of baseline bytes. They stay.
Consequently a conservative code cleanup can noticeably reduce maintenance
surface, but cannot honestly promise a tiny checkout. Removing tracked files
later would not remove their old blobs from `.git` or full clones. No history
rewrite, garbage collection or local cache purge belongs to this plan.

## Protected material

1. Preserve the whole `docs/enterprise-local/` tree: memory, original supplied
   plan, handoffs, inventories/SBOM, contracts and environment evidence. Preserve
   `docs/{roadmap,BASELINE,ARCHITECTURE-LOCAL,EGRESS-INVENTORY,PATCH-SEQUENCE,RISK-REGISTER}.md`.
2. Preserve `docs/adr/`, all remaining `docs/`, `plans/`, `.plan/`, `.maestro/`,
   `.agent-jobs/`, `CHANGELOG.md`, `RECEIPT-JOIN.md`, the telemetry audit report,
   Markdown/MDX documentation anywhere, and current agent guidance. In particular,
   `plans/local-human-work-*` and `docs/expense-pricing/` are not disposable.
3. Preserve every `.github/` file, including CI, Windows checks, the local blocked
   skeleton and publishing/deployment definitions. Obsolete *jobs/references* may
   need coordinated edits after approval; deleting the workflow files is not proposed.
4. Preserve `LICENSE`, `NOTICE`, `docs/license.md`, all nested attribution/license
   and provenance files, and retained code's attribution headers. The small byte
   saving does not justify pruning these. Keep copied notices if their original
   integration code is removed; any later consolidation is a separately reviewed task.
5. Preserve `.claude-plugin/`, `.codex-plugin/`, `.agents/plugins/marketplace.json`,
   their retained plugin equivalents and Claude/Codex hook/MCP inputs. Local
   configuration/catalog use does not imply public marketplace publication.
6. Preserve SQLite schema/migrations, recovery/spool, identity/worktree/sharing,
   filtering, import/export/backup, FTS5/search, local Chroma, model profiles,
   local viewer and My Work, mode languages, skills and required fonts/images.
7. Keep the development/runtime configuration and relevant tests. Root and
   nested package manifests, lockfiles, compiler/test configuration and lifecycle
   trust lists require dependency review; their names do not make them disposable.

Do not inspect or clean real memories, credentials, registrations or unrelated
settings. `.git/`, `node_modules/`, `.scratch/`, ignored `dist/`, ignored root
`package-lock.json`, venv/model assets and plugin data are **outside deletion
scope**. The index intentionally does not crawl these directories. They can
contain useful rollback inputs or user data. No `git clean` or blanket cache purge.

## Candidate batches and required companion changes

Paths below are selectors for review. The TSV supplies exact baseline files;
protected rows always override a selector. A file marked `C-*` still requires
inspection of incoming runtime, build, test, resource and CI references.

| Batch | Candidate paths | Work required before removal |
|---|---|---|
| H1: Cursor/Grok host packages | `.cursor-plugin/`, `.grok-plugin/`, `claude-mem-cursor/`, `claude-mem-grok-bot/`, `cursor-hooks/` | Remove required manifest reads/writes in `scripts/sync-plugin-manifests.js`; update package contents/scripts, installer host choices and tests. Preserve Markdown/attributions. |
| H2: other external hosts | `.qoder-plugin/`, `openclaw/`, `omp/`, `hermes/`, `ods/`, `pi/`, `dsh/`, `ragtime/`, `cowork/`, `.agent/`, `.windsurf/` | Retire corresponding build/install contracts and CI references. `cowork` is a separate plugin, not the retained Claude Code CLI target. Keep shared helper code until all callers are checked. Preserve documents, licenses and provenance. |
| H3: embedded host implementation | `src/integrations/{dsh-plugin,opencode-plugin,pi-extension}/`; non-target `src/cli/adapters/{cursor,kimi,antigravity-cli,windsurf}.ts`; host-specific installer/index/pusher modules in `src/services/integrations/`; `scripts/grok-bot-*` | First detach adapter registries, worker imports/dispatch and installer enumeration. Review common `harness-worker.ts`, integration types/path helpers, utility callers and platform normalization separately. Keep raw/common parsing and existing stored platform identifiers where needed for old memories. |
| H4: generated host output | `plugin/.qoder-plugin/`, `plugin/qoder.mcp.json`, Qoder hook JSON and `qoder-hook-launcher.cjs`; OpenClaw output; generated OpenCode/Pi/DSH output | Stop generation and checks for retired targets first. Some output is ignored and remains outside this deletion task. Review enterprise-local mock fixtures that currently name Qoder; preserve common refusal tests and their historical handoffs. |
| C1: cloud service projects | `workers/sync-hub/`, `services/sync-api/`, cloud-only matrix scripts | Retire dependent CI jobs/scripts and host-package references. Keep README/docs and existing memory/schema/legacy queues. This is cloud implementation code, not local Chroma. |
| C2: legacy cloud modules | `src/services/sync/{CloudSync,SyncClient,SyncApply}.ts`, their exclusive helpers and cloud/TeamBrain routes | Conditional additional review, not included in the 373-file count. Prove zero retained consumers after C1 and inspect `SyncApply` side effects. Keep canonical content parsing, local Chroma, legacy data compatibility and no-egress regression coverage. |
| D1: Docker path | `docker/`, `.dockerignore`, `Dockerfile.test-installer`, `docker-compose{,.e2e}.yml`, `scripts/e2e-server-docker.sh` | Retained CI currently references Docker/Postgres/E2E inputs. Update affected jobs/references together while preserving workflow files and Docker docs. No Docker execution, engine uninstall, volume/data deletion or service change. |
| P1: public deployment helpers | `install/`, `scripts/{discord-release-notify,generate-changelog}.js`, `scripts/translate-readme/`, root `.translation-cache.json` | Confirm no retained local setup caller; coordinate Vercel/npm/release workflow references and package scripts. Preserve changelog/translations/docs, private Windows setup and build tools. Do not run public publishing/deploy/sync/restart helpers. |

H3 examples include `CursorHooksInstaller`, `GrokBot{Installer,IndexWriter,AwarenessPusher,Brainbeat}`,
`OpenClawInstaller`, `OpenCodeInstaller`, `PiInstaller`, `OmpHooksInstaller`,
`HermesInstaller`, `DeepSeekHarnessInstaller`, `KimiHooksInstaller`,
`AntigravityCliHooksInstaller`, and `T3CodeInstaller`. Shared integrations such as
`McpIntegrations`, Notion/Telegram, CCS alignment and generic parsing are **review**,
not blanket removals. The two-host decision does not by itself remove existing
viewer/background behavior or permit schema/identity redesign.

There is no tracked gRPC host plugin. There is a Grok Bot plugin. Chroma's pinned
Python dependencies include `grpcio` and an OTLP gRPC package; these are not host
plugins and must not be removed by name matching.

## Conditional server and dependency reduction

The standalone server is outside the local delivery target, but `src/server/`
is not a removable unit. The local worker directly registers `BetterAuthRoutes`
and `ServerV1Routes` and uses the SQLite API-key service. Shared middleware and
SQLite storage also remain live. The existing local auth HTTP 500 is a separate
known defect, not a justification to delete its endpoint during cleanup.

After H/C/D, assess these narrower candidates: `src/server/{runtime,generation,jobs,compat,mcp,services}/`,
Postgres-only routes/middleware, `src/storage/postgres/`,
`src/services/vector/`, standalone-server NPX commands, and
`plugin/scripts/server-service.cjs{,.map}`. The current literal local closure
does not reach the Postgres/vector directories, but build/NPX/test/runtime
selection still does. Remove only after detaching those entrypoints. Keep
`src/server/auth/`, `ServerV1Routes`, common middleware, queue-health types and
`src/storage/sqlite/` until a specific replacement is explicitly needed.

| Dependency family | Proposed treatment |
|---|---|
| `pg`, `@types/pg`, `bullmq`, `ioredis` | Candidates only after Postgres/server CLI and all callers are removed. Queue-engine labels/settings may still need compatibility. |
| `@huggingface/transformers`, ONNX/sharp options | Review after standalone `LocalEmbedder` removal. Preserve Python MiniLM/Chroma and all still-used external declarations; same word “embedding” does not imply same runtime. |
| `typebox` | Candidate after Pi source/build/installer consumers and attribution preflight are retired. Preserve provenance/licenses. |
| `posthog-node`, optional telemetry externals | Candidate after confirming imports across source, build, tests and manifests. Preserve inert/no-egress API and local diagnostics currently covered by regression tests. |
| Tree-sitter grammars/CLI, `parse5`, `postcss`, `unified`, remark packages | Keep initially: smart file reading/exploration remains in scope. No blanket pruning of parser dependencies because some old activation paths refuse. |
| Better Auth packages | Keep: local worker imports them. Fixing or removing local auth is separate work. |
| Claude SDK, MCP SDK, esbuild, TypeScript, React/viewer dependencies, zod | Keep where retained profiles/build/UI use them. An SDK in `devDependencies` can be bundled into the runtime. |

Update root and nested manifests, generator templates, package contents,
allowScripts/trustedDependencies, lockfiles and SBOM together for the dependency
actually removed. Review installed-tree size separately if later requested;
no savings estimate for `node_modules` was measured here. No general upgrade,
reinstall, `npm prune` or mass dependency fixer is proposed.

## Short execution plan and commit boundaries

This document is the maintenance plan; do not create a second SDD pipeline,
feature task tree, graph database or new main-roadmap steps for cleanup.

| Step | Proposed commit/result | Completion condition |
|---|---|---|
| 0 — this chat | `docs(cleanup): index repository and propose local-only pruning` | Baseline index, evidence, protected set and candidate plan recorded. No product edits/deletions. |
| 1 — after approval | `refactor(hosts): retain Claude Code and Codex integrations` | H1–H4 detached atomically from generators/registries/callers, then exact non-protected files removed. Retained host/profile tests pass; source and emitted files paired. |
| 2 — after step 1 | `chore(local): retire detached cloud and deployment components` | C/D/P subset agreed in advance; all retained CI files accounted for and live references repaired. Keep shared sync/schema, docs, licenses and local setup. Pair any generated changes. |
| 3 — conditional | `refactor(runtime): remove standalone server-only closure` | Proceed only when scoped path analysis shows no retained runtime/build/resource consumers. Keep shared auth/API/SQLite. Otherwise defer this step and close the useful cleanup already completed. |
| 4 — closeout | `docs(cleanup): record verified contents and maintenance handoff` | Exact removals/savings/tests/limitations recorded; refreshed current build inventory if bytes changed; original receipts/history retained. Main roadmap resumes only on user request. |

Dependency pruning belongs with the slice that retires its last consumer; add a
separate commit only for an independent concern. Source/build pairs belong to
the same concern, not a broken source commit followed by unrelated regeneration.
Batch directories by concern: one reviewed compile per source slice, no compile
per directory and no repeated full repository audit. No pushes/remote jobs.

## Removal gate and validation

Before **each** implementation slice:

1. Recheck branch/HEAD/status and the ownership board; stop for conflicting WIP.
   Regenerate the baseline comparison for changed paths rather than treating this
   snapshot as a permanent allowlist.
2. Produce the exact path list and companion edits; reject protected/docs/license
   rows and overlapping shared code. Check AST incoming edges, literal/resource
   paths, package contents, shell/Python entrypoints, generators, tests and CI.
   A search hit in a historical pinned report is evidence, not a runtime caller.
3. Capture protected-file blob/hash identities and current artifact inputs.
   Preserve all historical SHA/line evidence. For a moved/retired source link,
   add a small path-to-baseline-SHA mapping here; do not rewrite historical results.
4. Review the selected check scripts' subprocess/environment/data behavior.
   Use the existing pinned tools and disposable task state. No broad upstream
   build-and-sync/install/test/deploy command by implication.

For **code slices**, run relevant unit/contract checks, both existing typecheck
targets and one guarded `build:compile`. Also exercise retained smart-file-read,
backup/recovery/SQLite, profiles/no-egress and host contracts when their callers
change. Inspect emitted deltas, syntax and bundle input exclusions. Do not delete
tests simply to turn a failure green; retain tests of shared behavior and remove
only cases whose subject the approved slice intentionally retires.

At **final acceptance**, review and run a bounded copied-build fixture: foreground
worker readiness/shutdown, direct Claude/Codex hook commands, MCP initialize/list,
synthetic capture and recovery, SQLite/FTS, real prepared local Chroma retrieval
and restart, and viewer/My Work assets. Use loopback model responses and owned
child cleanup. This does not establish real Claude CLI/Bedrock target acceptance
or OS-wide egress proof; those remain on the original roadmap. No live inference,
corporate AWS, real memory or installed-user configuration is needed for cleanup.

Refresh current stage receipts/SBOM when their contents change, while retaining
the prior artifact record and its actual test evidence. New build hashes cannot
inherit old runtime PASS labels. If compiled tests cannot run, record the exact
gap rather than claiming cleanup verified.

For this **planning commit**, only analyzer/report integrity, protected-change
review and `git diff --check` are appropriate. Build, typecheck, application tests,
runtime, CI and live provider checks are **not run**.

Rollback uses a reviewed revert of the particular cleanup commit after checking
later changes, never a hard reset/clean over user WIP. Existing private installs
and data remain untouched; revert source and paired generated output together.

## Next action in this chat

Discuss and adjust steps 1–2, particularly the handling of obsolete CI jobs while
keeping workflow files. Approve an exact first host-removal slice before code
changes. PDFs, license pruning, history rewriting, CI execution and the main
Claude/Bedrock target check are not part of that approval.

Detailed evidence and analyzer limits: [EVIDENCE.md](EVIDENCE.md).
