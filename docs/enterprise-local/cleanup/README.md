# Local repository cleanup — final execution plan

Updated 2026-11-11. Status: **three bounded slices implemented**.
See [actual results, failures and deferred source](RESULTS.md) and the
[follow-up task](NEXT-SESSION.md). The plan below preserves the approved scope
and planning rationale; its future-tense launch text is historical.
Branch: `codex/repository-cleanup-plan`; planning baseline `683bd9062`.
Inspected application source: `a9364604d026d79be8ab771ecb861688972d169c`.
This replaces the initial proposal in `683bd9062`; it does not advance
[`docs/roadmap.md`](../../roadmap.md).

## Outcome and authority

One working session should remove the large, easy, non-local pieces and keep a
working local worker/build/test path. The owner has now selected:

- Remove all CI/CD workflows and hosting/release automation. Keep local build,
  test, setup and verification scripts.
- Keep Codex CLI and Claude Code CLI. Retire other host integrations without
  removing supported LLM providers or their explicitly selected auth routes.
- Remove all eight upstream presentation PDFs (117.31 MiB). Retain technical
  Markdown, our implementation records, ADRs and useful AI-development context.
- Remove Docker/cloud deployment and standalone server/scaling features where
  they separate cheaply from the local worker. Shared local API/auth/storage stay.
- Give the product the local display name **cmem-light** and remove upstream
  promotional/person metadata from product surfaces. Do not do a global rename
  or fabricate an original author for borrowed code.

The owner also requested deleting all licensing/author information. This plan
makes a narrower implementation choice: remove product-facing personal/marketing
metadata and notices belonging solely to completely removed code; retain core
`LICENSE`/`NOTICE`, provenance and notices for code/fonts still present. This is
an explicit plan exception, not a claim that the owner approved preserving them.
There is no requirement to display the upstream author's name in the UI. Apache
2.0 section 4 addresses redistribution; private local use does not make the UI
an attribution panel. See [the actual license](https://www.apache.org/licenses/LICENSE-2.0).
Do not claim the entire fork was originally written by its local maintainers.

The next-session prompt launches these approved cleanup categories. Do not ask
for the same scope confirmation again. If a candidate needs invasive changes,
leave that candidate and record the reason; finish the independent easy work.
No deletion is performed by the current planning turn.

## Reuse the existing index

- [inventory.tsv](inventory.tsv): immutable 2,997-file baseline, blob IDs and
  conservative reachability. Its old `P-CI` and PDF protection labels are
  **superseded**, not current deletion policy.
- [removal-targets.tsv](removal-targets.tsv): 440 exact baseline candidates,
  127,537,948 bytes (121.63 MiB), with a dependency gate for each path.
- [EVIDENCE.md](EVIDENCE.md): inspected source references and graph limits.
- [NEXT-SESSION.md](NEXT-SESSION.md): self-contained implementation launch prompt.

The target manifest is a review input, not a bulk-delete script. It includes
38 documents and eight notices owned only by retired packages. Preserve them
if any retained code still uses them. It excludes additional conditional
server/cloud internals and edits to shared files. No automatic "unused file"
fixer, semantic-index service, tool installation or full-history reread is needed.

| Candidate category | Files | Baseline bytes | Gate |
|---|---:|---:|---|
| Presentation PDFs | 8 | 123,009,837 | Not a runtime/build input; retain accompanying Markdown |
| GitHub workflows/funding/issue templates | 13 | 47,989 | Preserve local check commands and useful agent guidance |
| Other host implementation/packages | 290 | 3,019,528 | Detach generators/registries/callers first |
| Cloud-service implementation | 62 | 1,110,745 | No retained local consumers |
| Docker inputs | 12 | 43,662 | Remove dead package scripts/references, never volumes/data |
| Publication helpers | 9 | 29,685 | Keep private local setup/build tooling |
| Retired package documentation | 38 | 237,102 | Only with its completely retired package |
| Retired package notices | 8 | 39,400 | Only with its completely retired code and build preflight |

These are candidate bytes, not guaranteed savings. The server bundle/map pair
is a further conditional 4,233,696 bytes (4.04 MiB). The eight PDFs provide the
main certain byte reduction; do not spend a session chasing kilobytes. Deleting
checkout files does not erase Git history. No history rewrite/GC/cache purge.

## Keep intact

- All `docs/enterprise-local/` memory, original requirements, handoffs, contracts,
  inventories/SBOM and this cleanup handoff. Original evidence remains pinned.
- `docs/adr/`, main roadmap/audit/architecture/risk documents, technical Markdown
  in `plans/` (especially local-human-work and Endless Mode), `.plan/`, `.maestro/`,
  `.agent-jobs/`, useful `docs/`, changelog and `RECEIPT-JOIN.md`.
- `AGENTS.md`, applicable agent guidance and `.github/copilot-instructions.md`.
  The latter is an agent instruction, not CI; the other 13 `.github/` files retire.
- SQLite/FTS5, schema and old data compatibility, queue/recovery/spool, project/
  worktree identity/sharing/filtering, backup/import/export and capture/retrieval.
- Local Chroma/MiniLM, models/runtime inputs, viewer/My Work, skills, modes,
  required resources/fonts and selected provider/auth implementations.
- Claude/Codex local manifests/catalog, hooks/MCP, guarded compile and relevant
  local tests. Marketplace-shaped metadata can be needed for private loading.
- Core legal/provenance files and notices for retained code/fonts. Nested notices
  may retire with wholly removed implementations, not while attribution is live.

Do not inspect/change real memories, credentials, registrations or unrelated
settings. Do not purge `.git/`, `node_modules/`, `.scratch/`, ignored `dist/`,
ignored root lockfiles, virtual environments, prepared wheelhouse/model assets
or plugin data. No admin/UAC, machine PATH/registry/service changes, push, CI,
AWS or live inference. Existing private installs stay untouched.

## Three execution slices

### 1. Easy size and automation removal

Remove the eight manifest-listed PDFs; retain their Markdown companions. Remove
all ten `.github/workflows/*.yml`, `FUNDING.yml` and the two issue templates.
Remove Docker/Compose, public installer/Vercel and detached publish/release/
translation helpers. Preserve local tests/typecheck/build/setup scripts; remove
only the npm scripts/config used exclusively by retired automation. In particular,
`build:compile`, the guarded generators, viewer preparation, local Chroma setup,
private staging and verification remain. Keep root npm packaging config if still
used by local install rather than deleting it for its filename.

Do not copy the workflows into a new active automation tree; Git retains their
history. Historical references can stay with their pinned source SHA. Repair
current setup/build instructions where a removed command would mislead users.
Commit one concern: `chore(cleanup): remove presentations and hosted automation`.
No application runtime/compile is required for a purely detached data/config
commit; run affected static/local-command contract checks if tooling changed.

### 2. Retire extra hosts and rebrand product surfaces

Remove manifest-listed non-target host packages: Cursor, Grok Bot, Qoder,
OpenClaw, OMP, Hermes, ODS, Pi, DSH, Ragtime, Cowork and their host-only assets.
First update `scripts/sync-plugin-manifests.js`, build target/preflight lists,
package contents/scripts, installer selection, adapter registries and worker
callers. Eleven host candidates are currently in the local literal closure.
Do not delete their files before rewiring those callers. Retire relevant Qoder/
Pi/DSH outputs and their exclusive tests/preflights with the feature.

Retain common parsing and stored platform identifiers where old records need
compatibility. Keep providers (Claude/Bedrock, Codex, Gemini, OpenRouter,
OpenAI-compatible and the existing explicitly selected supported adapters).
Do not redesign provider/model selection, local viewer or database architecture.

Set display names/title/description to `cmem-light` in retained manifests, private
catalog presentation and viewer. Remove upstream personal `author`/
`developerName`/author-URL fields when optional, or use an accurate neutral local
maintainer label where the schema requires a value. Remove upstream GitHub-star,
promotion/sponsor/social links from live product UI. Do not invent a repository
URL. Fix the generator source so compile does not restore old presentation.

For economy retain technical `claude-mem` IDs, environment keys, paths, wire/
database fields, command aliases, plugin identifiers and test fixtures where
renaming would require migration. The private staging code checks
`name === 'claude-mem'` (`scripts/enterprise-local/codex-local.mjs:223` at source
`a9364604d`); changing the display name does not require changing that identity.
Keep historical author/URL references in immutable records and actual notices.
No mass copyright/comment/string replacement. Optional logo redesign is deferred.

Run focused retained-host/profile tests, both typechecks and one guarded compile
for this completed source slice. Keep source and reviewed outputs paired.
Commit: `refactor(cleanup): retain local hosts and customize presentation`.

### 3. Detach server/cloud implementation and finish

Remove `workers/sync-hub/`, `services/sync-api/` and cloud-only matrix tools after
caller review. Never delete `src/services/sync/` wholesale: local Chroma and
canonical SQLite parsing use it. Preserve old queues/data/schema and no-egress
regressions even when legacy cloud implementation is removed.

For standalone server, retire its build target/output, CLI/delegation surface,
Postgres/BullMQ launch and deploy helpers. Cheap refusal/unsupported-command
handling can remain instead of a replacement runtime framework. Remove server-
only source/dependencies only after their last retained source/build/test caller
is gone. Keep shared `src/server/auth/`, local `ServerV1Routes`, request middleware,
queue-health types and SQLite storage. The separate local-auth HTTP 500 remains
an existing defect; this cleanup must not conceal it or claim to fix it.

If complete source-tree pruning would require extensive shared refactoring,
stop that subtask after safely detaching the standalone build/launch, retain its
remaining source/dependencies and list them as deferred. Apply the same rule to
deep legacy cloud internals and broad optional integration settings. Do not
remove useful tests just to hide a regression. A test exclusively for a retired
feature can retire; shared behavior and enterprise-local evidence remain.

Prune a dependency with its last consumer, not by package-name matching. `pg`,
BullMQ/Redis, standalone JS embedding and Pi TypeBox are candidates; keep Better
Auth, needed SDKs/UI/build/parser dependencies, inert telemetry contracts and
Python Chroma's gRPC dependencies. Update generator manifests/trust lists/locks
only where the completed slice requires it. No upgrades or general reinstall.
If this would trigger unrelated lock churn/acquisition, leave that pruning step.

Run relevant checks and one guarded compile if source/build inputs changed.
Run the final copied-build acceptance below. Commit source and paired outputs
as `refactor(cleanup): detach standalone deployment runtime`; include closeout
records in that commit or one small documentation commit if clearer.

## Final acceptance and session limits

Reuse existing focused fixtures. Inspect selected commands before execution;
no broad `build-and-sync`, upstream installer, whole test suite or hosted lane.
Use baseline Node 22.23.4/npm 10.9.9/Bun 1.4.4. Review setup scripts if an essential
input is missing; install only what the completed local check actually needs.

Verify: retained host/manifests and profiles; both typechecks; clean guarded
compile with no recreation of removed targets; emitted syntax/input guards;
then bounded copied-worker start/health/stop, direct Claude/Codex hooks and MCP,
synthetic SQLite/FTS capture/recovery, viewer/My Work resources, and prepared
real local Chroma retrieval/restart with a loopback model fixture. Use fresh
owned scratch, deadlines and owned-child cleanup; no registration or user data.
Ask only for a genuinely new privilege/live-account action, never repeat the
approved cleanup scope. Do not equate sandbox approval with Windows elevation.

Use a single final runtime fixture where possible. Do not replay every historical
verification. New output bytes need new evidence; old PASS labels are not inherited.
If a check cannot run, record its exact limit. No claim of real Claude CLI/Bedrock
acceptance or "all bugs fixed". Keep the existing local auth defect visible.

At closeout record actual deletions/bytes, retained deferred files and validation
in one `RESULTS.md`, update shared memory and the next task, and refresh any
changed current artifact receipt while preserving its old evidence (a versioned
new receipt is acceptable). Do not distribute an old receipt as valid for new
bytes. Check protected documents for unintended loss and current links for breakage;
use baseline SHA/manifest paths for historical deleted-file references.

One coordinator; no agents, new branches/worktrees or pushes. No more inventory
project, SDD tree, new dependency tooling or exhaustive reformatting. Target three
reviewable concern commits, not one commit per folder. Finish easy approved work
and report deferred coupled work honestly if the session cannot safely do all of it.
Rollback is a reviewed revert of the affected source/output commit; never hard
reset/clean over WIP. The main roadmap remains unchanged throughout cleanup.
