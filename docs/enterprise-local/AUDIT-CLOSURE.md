# Session 01: bounded static audit closure

Date: 2026-10-30. Branch: `feat/cmem-light-local`; clean entry HEAD:
`2f061267628a74384fff08fc79b163cc9038bc88`.
All source citations in this document refer to inspected source SHA
`d7c2da3e5f9397b394dbc6b6966f4b261b489f7b`. Git comparison showed only guidance,
ignore rules and documentation added since that SHA; application source is unchanged.
Existing [E01–E18](../EGRESS-INVENTORY.md) were reused, not reinvestigated.

**Verdict: bounded static audit complete.** All eight areas have a bounded disposition
and the first patch is defined below. Full P1, dependency/runtime audit, source/bundle
equivalence and release acceptance remain pending. This verdict authorizes no execution
or implementation and makes no zero-telemetry or enterprise-safety claim.

Research used one consolidated pass over the eight areas and one targeted pass over
the newly exposed build, background inference, spool and post-storage boundaries;
within the two-pass / 45-minute ceiling. No subagents, initial-plan reread, dependency
tree scan, network, application scripts, tests or installed-user-data inspection.

## Coverage and limits

`reviewed-static` means a source path exists under its stated trigger, not observed
execution. Conditional paths are reachable capabilities even when disabled by default.

| Area | Disposition | Evidence covered and explicit limit |
|---|---|---|
| A — entrypoints/generators | reviewed-static | Root `package.json:29,74`; `plugin/hooks/hooks.json`, `plugin/.mcp.json`; launcher/worker/MCP and generator mapping below. E12–E16. Existing generated artifacts are not proven equivalent to source; no installed registration inspected. |
| B — hosted/telemetry/cloud | reviewed-static | Reuse E01–E05: setup intent/import routes, CLI and worker sinks, CloudSync lifecycle/push/pull/realtime. Historical 503 and actual uploads remain UNKNOWN. Additional reachable exports are E22, not local ChromaSync. |
| C — inference/auth/custom/connectors | reviewed-static | Reuse both Claude SDK call sites in E07 and dispatch alternatives E06. E16 expanded through hook/MCP server selection and explicit server command; E20 covers independent My Work inference. Server internals beyond this boundary are not-in-runtime-slice for the intended local artifact, but remain reachable in the current broad distribution until removed. No recursive server/harness product audit or external custom-module inspection. |
| D — Chroma/embedding/telemetry | reviewed-static | Reuse E08–E11: stdio uvx, remote configuration, embedding names, inherited telemetry flag. Python implementation, actual ONNX model/downloader and analytics closure are deferred-unavailable (U1/U2). Env flags are not runtime evidence. |
| E — bootstrap/update/repair/Windows | reviewed-static | Reuse E12–E14; `ensure-launcher.ts` -> `install-launcher.ts:703,776,813` can compile/place launcher and update PATH; Windows registry helper at `:424`. New worker tree-sitter provisioning E21. `plugin/scripts/bun-runner.js:165,225` reports missing Bun and spawns it; its bun.sh diagnostic string is not itself a download. Actual Windows lifecycle untested. |
| F — viewer/HTTP remote boundary | reviewed-static | Classic viewer, My Work React sources, template/TV assets, worker route registration and Host/Origin middleware. E17–E19. Both mounted GitHub star widgets fetch remotely; local fonts, relative API/SSE and data URLs distinguished from requests. No general CRUD pentest or memory isolation redesign. Third-party browser bundle behavior deferred to U2/U3. |
| G — build/install/generated/dependencies | reviewed-static | Root/plugin manifests, tracked plugin lock and My Work lock declarations; generators and imports, viewer subprocess chain. E15/E21. My Work lock declares install scripts (`package-lock.json:3675,5427`); root/plugin trust/allowScripts and ONNX overrides are declarations only. Root lock is not tracked. Dependency lifecycle implementations, licenses/SBOM and executable hashes are deferred-unavailable, not inferred from lock metadata. |
| H — retained memory chain | reviewed-static | Hook handler -> durable spool -> shared ingest -> queue -> observer -> SQLite -> Chroma and retrieval, below. Local project/worktree/filter semantics retained. Post-storage external connectors E22 are separable from canonical storage, local indexing and SSE. Crash/concurrency/privacy behavior remains runtime UNKNOWN. |

## Reachability and owning steps

Destination/payload detail for unchanged rows remains in the existing inventory.
Steps below refer to the sole dependency graph in [roadmap.md](../roadmap.md);
these are ownership assignments within existing steps, not new dependency edges.

| E-ID | Static reachability / action | Next owning step |
|---|---|---|
| E01 | Setup scan POST -> HostedIntent; remove hosted routes/callers/client | 3 |
| E02 | Setup/history-import wiring -> import client; remove upload lifecycle | 3 |
| E03 | Worker boot/logger/error/shutdown -> PostHog sink; remove remote bridge/jobs, retain local logs | 4 |
| E04 | Hook/CLI instrumentation -> CLI capture fetch; remove sink | 4 |
| E05 | Configured worker/DB -> CloudSync/SyncClient; remove remote lifecycle/outbox production, preserve schema/local index | 5 |
| E06 | Worker provider dispatch/fallback/probes -> alternate inference; reject/remove alternatives | 6 |
| E07 | Claude session and standalone query -> SDK/env/auth; replace permissive configuration with approved Bedrock-only path | 6; live proof 11 |
| E08 | Chroma stdio start -> uvx resolution; replace with pre-provisioned absolute executable | 7 |
| E09 | Chroma remote mode -> configurable HTTP service; reject remote config | 7 |
| E10 | Chroma collection/index/query -> embedding selection; retain verified local model only; Python behavior UNKNOWN | 7, U1 |
| E11 | Chroma child inherited env -> possible analytics; enforce supported disable contract; actual transport UNKNOWN | 7, U1 |
| E12 | Distributed installer install/update/repair/auth -> bootstrap/package/OAuth; replace with local preflight | 9; acquisition policy U4 |
| E13 | Hooks/MCP -> launcher/cache fallback and Setup dependency install; replace with deterministic bundle paths | 9 |
| E14 | SessionStart ensure-launcher -> compile/place/PATH; replace runtime repair with local preflight | 9 |
| E15 | Build -> viewer npm ci AND lock generator bun install; split acquisition/compile/deploy | 2; final closure 10 |
| E16 | Hook runtime selector and MCP -> ServerClient; explicit worker `server` command -> server-service; remove remote selection/shipped server reachability | 10 |
| E17 | Worker configurable bind/public URL/origins and HTTP clients; retain local API and guards, reject remote config | 8 |
| E18 | Mounted viewer widgets -> GitHub API; hosted UI actions -> setup APIs/navigation; remove unapproved automatic requests/actions, retain local viewer/assets | 8 (assets/widgets), 3 (hosted actions), 6 (judge now E20) |
| E19 | Hook spool upload -> configured worker host; remove remote transport, retain filesystem handoff/nudge | 8 |
| E20 | My Work refresh/copy/judges -> independent SDK/CLI/API inference; constrain retained inference to validated approved backend, remove alternatives | 6 |
| E21 | Worker boot/repair -> tree-sitter installer/download; replace with checked pre-provisioned executable | 9; artifact closure 10/12 |
| E22 | Stored observation/session completion -> Telegram/Notion/webhook; remove external connector callers/transports/jobs | 10, separate concern from package pruning |

### New/changed evidence chains

- **E15 expanded:** `package.json:74` build -> `scripts/build-hooks.js:576` viewer
  child -> `scripts/build-viewer.js:71` **npm ci**, then `:72` npm run build;
  My Work `package.json:8` runs `tsc -b && vite build`. This can acquire registry
  packages and execute dependency lifecycles during a purported compile.
  Separately `scripts/gen-plugin-lockfile.cjs:57` runs bun install --ignore-scripts.
  Remove both acquisition calls from compile; retain explicit preparation only.
  Regression: trace complete child process tree with network blocked after authorization.
- **E16 clarified:** hook `runtime-selector.ts:39,94` and MCP
  `src/servers/mcp-server.ts:267,273` reach server-client; its `:462,487` constructs
  dynamic base URL + path and sends requests. `worker-service.ts:1398` can spawn
  server-service; `src/server/runtime/ServerService.ts:469` loads
  `create-server-service.ts`, which opens Postgres (`:202`), configures Redis (`:522`),
  primes embeddings (`:255`) and loads env-selected custom provider modules (`:390,509`).
  Server endpoint/module behavior is UNKNOWN outside that boundary. Do not remove
  shared worker `ServerV1Routes`/SQLite code by directory name. Future proof: legacy
  server settings/commands cannot activate this closure in the final local artifact.
- **E18 resolved in part:** classic `Header.tsx:119` ->
  `GitHubStarsButton.tsx:26`; My Work `App.tsx:233` -> `components/bits.tsx:241`:
  browser GET to `api.github.com/repos/thedotmack/claude-mem`, carrying ordinary
  request metadata, not an explicit memory upload. Remove automatic fetches.
  Documentation/social/repository hrefs are navigation; provider preset URLs are
  configuration data, not immediate requests. My Work `NavbarLogo` external image
  (`components/aceternity/resizable-navbar.tsx:239`) is not mounted by inspected App
  (imports only Navbar/NavBody); final tree-shaking remains U3. Local template font
  URLs and TV relative fetch/SSE are retained. No minified correspondence asserted.
- **E19 new:** `src/cli/handlers/observation.ts:29` ->
  `src/cli/spool-hook-event.ts:199,155` -> remote transport selector
  `src/shared/hook-spool-remote.ts:105` -> upload POST (`spool-hook-event.ts:41`)
  via worker URL construction (`src/shared/worker-utils.ts:481`). Dynamic worker
  host, raw capture envelope/auth; remote upload helper can spawn `upload-spool`
  (`spool-hook-event.ts:125`). Receiver `HookSpoolRoutes.ts:21,27,50` accepts
  token-authorized remote ingestion. Reject remote configuration/transport and
  receiver access while preserving local spool files, replay and nudge. Future
  proof: legacy host/token/HTTP-transport settings cannot send capture off-machine.
- **E20 new (supersedes the judge UNKNOWN portion of E18):** registered
  `WorkViewRoutes.ts:354,369,371` refresh -> `agent-runner/run.ts:313,317,328` ->
  detected Claude/Codex/Gemini with fallback on failure. Claude uses fresh OAuth env
  (`run.ts:96`) and a separate SDK query (`:148` options); CLI subprocess helper is
  `agent-runner/detect.ts:89`. Detection itself can sign in via a Gemini headless
  probe (`detect.ts:323`). Local CLI location does not establish local inference.
  Refresh input includes prompt-derived work context. Additional refresh judges
  (`WorkViewRoutes.ts:370`, `work-view/request-judge.mjs:148,158,176`,
  `focus-judge.mjs:77`) POST context to OpenRouter `/api/alpha/decisions` or
  configured gateway `/decisions`. Copy worker (`WorkViewRoutes.ts:295,418,423` ->
  `human-copy-worker.mjs:63,92`) POSTs display-summary inputs to configured
  OpenRouter/OpenAI-compatible chat endpoint, independently of main observer
  selection. Retain local viewer/data/rules and existing memory semantics; enforce
  approved auth/backend for retained inference rather than assuming E07 covers it.
  Future proof: refresh, detection, copy and judges cannot bypass Bedrock-only policy
  on legacy credentials, settings or failures; synthetic payload policy still U5.
- **E21 new:** `worker-service.ts:786` ->
  `worker/tree-sitter-cli-provisioning.ts:27` ->
  `smart-file-read/tree-sitter-cli-provision.ts:110,292` executes package-local
  install.js in staging. This downloads executable bytes according to that
  dependency's implementation (not inspected; exact release URL UNKNOWN).
  Linux-only fallback uses `:140,172` fetch and source-pinned conda.anaconda.org
  URLs (`tree-sitter-cli-checksums.ts:56,61`); Windows has the primary installer
  path. Checksums and usability probes do not prohibit acquisition. Replace boot/
  repair provisioning with offline asset verification; retain smart parsing and
  Read Gate behavior when assets are available. Future proof: missing/corrupt binary
  gives a clear local error without downloads, install.js or package manager spawn.
- **E22 new:** after SQLite storage, `worker/agents/ResponseProcessor.ts:915,932,940`
  invokes optional Telegram alerts, Grok brainbeat and Notion export. Session wrap-up
  also reaches `SessionManager.ts:413,422` -> `TelegramWrapupNotifier.ts` -> shared
  Telegram transport. Boundaries: `integrations/telegram-transport.ts:13,14`
  (`api.telegram.org/bot…/sendMessage`); `NotionExporter.ts:486,491,537`
  (`api.notion.com/v1`, token-enabled queued/retried observation/page export);
  `GrokBotBrainbeat.ts:54,80,97` (configured webhook, observation metadata and
  optional secret). Payload classes: observation text/metadata and formatted session
  summaries. Remove these outbound callers, formatting-only inference where no
  longer needed, transports and retries. `GrokBotAwarenessPusher.ts:104,119` and
  GrokBotIndexWriter write local files; their names are not proof of network activity.
  Keep local effects unless separately scoped. Future proof: saved connector secrets
  and summary/observation events trigger no remote delivery and cannot break storage.

Existing HTTP guards are retained: `worker-service.ts:409` supplies origin policy;
`services/server/Server.ts:362–368` installs Host, foreign-page DELETE and CORS guards.
`worker/http/middleware.ts:144–147` also accepts IP Host values, and configurable
allowed origins/public URL extend trust (`worker/http/origin-policy.ts:23–49`). These
guards are not a loopback-only bind guarantee; E17 owns remote-config rejection.

## Local core preservation boundary

`cli/handlers/observation.ts:29,35` writes the capture payload through HookSpool;
`worker/hook-spool-drain.ts:18,32` hands it to shared ingest. Existing private-tag
handling is at `worker/http/shared.ts:288,296`, before `:344` queues observations,
not proof of redaction before the original spool write. Record this as a deferred
policy observation; no DLP or capture rewrite is introduced.

`SessionManager.ts:475,835` owns durable enqueue/drain; Claude response processing
calls `ResponseProcessor.ts:757` SQLite store, then `:780` confirms the batch and
`:1113` syncs Chroma independently of `:1137` CloudSync notify. Keep acknowledgement,
deduplication, retries, SSE and timestamp ordering. `DatabaseManager.ts:46,51,59,68`
separates SessionStore/ChromaSync from conditional CloudSync and shared device identity.
Do not delete the sync directory or alter memory identity/schema. Retrieval retains
`worker/search/strategies/ChromaSearchStrategy.ts:125` query and SQLite hydration /
fallback through the existing search strategies. Live recovery and query evidence
are U6; current project/worktree sharing and optional filters remain as accepted A06.

## Deferred register

All rows below are **UNKNOWN**, not failed or passed tests.

| ID / question | Why unavailable here | Next step / owner / required authorization |
|---|---|---|
| U1 — Python/Chroma embedding downloader, telemetry destinations, ONNX model/API/version/hash | Python artifact sources/resolved environment not supplied; flags and uvx constraints are insufficient | 7: implementing agent researches approved artifacts; owner supplies artifact/model policy. Acquisition/inspection of supplied packages only when authorized; cold-cache execution separately authorized. |
| U2 — npm/native/transitive behavior and lifecycle implementations | Only repo manifests/locks inspected; existing node_modules deliberately unused and untrusted | 2 preparation, 7 model, 10 closure, 12 SBOM: agent + artifact/security owner; approved acquisition/source review, licenses and hashes. No installation assumed. |
| U3 — generated bundles match source and contain no stale dynamic clients/assets | Committed minified artifacts are not a clean-build proof | 2 build and 10 final artifact: agent; explicit build permission with trusted pre-provisioned inputs, inspect emitted artifacts/hashes; do not execute shipped entrypoints merely to compile. |
| U4 — mirror/toolchain/root lock/native lifecycle approval | Root lock untracked; corporate artifact sources and executable/tool versions unconfirmed (D1/D9) | Before any preparation/build: owner approves source/lifecycle policy, agent pins inputs in a separate concern. Does not block drafting/editing the pure-compile boundary. |
| U5 — Bedrock model/Region/auth and allowed capture/refresh/copy payloads, retention/data location | Organization decisions D2/D7/D8 and actual credentials are outside repo; real user data intentionally uninspected | 6 config / 11 live acceptance / 12 operations: human owner; nonsecret approved values, explicit AWS/network permission and synthetic payload approval before live calls. |
| U6 — actual traffic, no-download startup, queue/retrieval/viewer/Windows behavior | No execution or fresh disposable environment authorized; dependency availability UNKNOWN | 9 launcher, 11 acceptance: agent; explicit install/test/app/network-monitor permissions as applicable, disposable profile and approved upstream coexistence (D5). D11 degraded-mode decision belongs to 7. |
| U7 — server custom modules, unused harnesses and full route/dependency security proof | Deliberately outside bounded local slice; current broad bundles still expose server command | 10: agent proves excluded entrypoints/closure; review an external module only if retained and explicitly supplied. 8 targeted remote-access checks; a full pentest needs separate scope. |

## First patch contract — step 2, source edits still unauthorized

One concern: separate compile from acquisition and deployment. No feature removal,
dependency upgrade/pinning, runtime launcher change or packaging minimization in this
patch. There is no unresolved source question blocking its definition.

| File | Exact intended change / retained boundary |
|---|---|
| `package.json` scripts (`:74–78`) | Add `build:compile` = `node scripts/sync-plugin-manifests.js && node scripts/build-hooks.js`; make `build` call `npm run build:compile`. Move the lock generation invocation to explicit `build:prepare:plugin-lock` = `node scripts/gen-plugin-lockfile.cjs`. Add explicit `build:prepare:viewer` = `npm --prefix src/ui/my-work ci --no-audit --no-fund`. Neither preparation command is called by build/compile. Preparation remains permission/policy gated. |
| `scripts/build-viewer.js:69–72` | Remove npm ci from the build function. Keep the local npm run build subprocess (tsc -b then Vite) with its cwd/error propagation/Windows invocation. Preflight `src/ui/my-work/node_modules/typescript/bin/tsc` and `src/ui/my-work/node_modules/vite/bin/vite.js` before building; missing inputs fail with a preparation-required diagnostic and no install/repair fallback. Current My Work manifest has no prebuild/postbuild hooks. |
| `scripts/build-hooks.js` | No source edit initially: retain viewer child, source generators/verifiers, all existing bundle targets, integrity/attribution checks and error propagation. No regeneration flag automatically added. Recheck only if the implementation changes this boundary. |
| `scripts/gen-plugin-lockfile.cjs`, sync/restart scripts | Keep available as explicitly invoked preparation/deployment tools; no call from compile. Existing build-and-sync/dev remain deployment paths and are never acceptance commands for compile. Binary compile/release/prepublish scripts are excluded from this first workflow. |

Source generators and output contract (paths are checkout-relative, never installed):

- `scripts/sync-plugin-manifests.js:10–24,154–164`: root/bundled Claude, Codex,
  Qoder manifests, Claude marketplace metadata, Grok, DSH, OpenClaw and Cursor
  manifests. This is local manifest writing, distinct from sync-marketplace deployment.
- `scripts/build-hooks.js:483–571`: `plugin/package.json`; native allowlist source
  `scripts/postinstall-allowlist.js`. `src/build/hook-shell-template.ts` is compiled
  in memory (`:344`) to verify hooks/MCP strings. `--write-shell-templates` can write
  the manifests in `shellTemplateManifest` (`:150` onward); default compile verifies
  them. Step 9 must change this generator and generated strings together.
- `build-hooks.js:588–1044`: worker, context-read-worker, server-service, MCP,
  context-generator, transcript-watcher, claude-mem-launcher, ensure-launcher CJS
  under `plugin/scripts/` with source maps where configured; SQLite SessionStore /
  observations/files sibling JS modules (`:707–708`); bundled request-progress
  `plugin/skills/request-progress/scripts/request-groups.mjs` (`:752`);
  `dist/npx-cli/index.js`, `dist/bug-report/index.js`.
- Existing broad harness outputs are retained in compile for this first boundary:
  `openclaw/dist/index.js`, `dist/opencode-plugin/index.js`, `dist/pi-extension/`
  bundle/notices, `dsh/lib/index.js` and DSH manifest update (`:1060–1107`), plus
  `plugin/skills/how-it-works/onboarding-explainer.md` (`:1117`). Inclusion in a
  compile output is not approval to ship/execute it; minimization belongs to step 10.
- `scripts/build-viewer.js:17–85`: `plugin/ui/viewer-bundle.js`, viewer.html, tv.html,
  local fonts/icons and `plugin/ui/work-view/*`; `src/ui/my-work/vite.config.ts:11`
  writes the latter and clears only that output directory. My Work
  `tsconfig.app.json:3` / `tsconfig.node.json:3` name build metadata under its local
  `node_modules/.tmp/`; allow these compiler cache writes, not dependency acquisition.
  Record actual generated delta after authorized build. No viewer deletion/replacement.
- `plugin/bun.lock` is preparation output, explicitly excluded from compile writes.
  Root lock creation/pinning is a separate approved preparation concern. Do not
  silently resolve a new graph to make compile succeed.

Acceptance after source-edit authorization: inspect the diff and the above subprocess
chain; compile has no ci/install/lock generation, sync-marketplace, worker start/restart,
registration/PATH/registry changes, or runtime repair. Missing inputs fail locally.
All runtime features and generated outputs remain paired with their existing sources.
Third-party compiler/plugin execution still depends on U2/U4; splitting commands is
not proof of a trusted or reproducible build.

Execution validation is **pending**: after separate build/toolchain authorization,
run only `npm run build:compile` with approved local inputs and network blocked;
observe child processes, compare output/lock hashes, confirm no installed-tree/service
mutation. Inspect missing-dependency behavior in a disposable checkout, without
renaming/removing this checkout's node_modules. Relevant existing checks for a later
authorized check session: `bun test tests/infrastructure/committed-plugin-bundles.test.ts`
and `bun test tests/infrastructure/worker-bundle-self-contained.test.ts`, after fixture
inspection (they spawn processes). Root `npm test` dispatches `scripts/test-lanes.ts`
and is not a documentation check or a safe default. No checks above ran this session.

Rollback: revert the single build-boundary source commit and its intentionally changed
generated/doc outputs; no installed data, services or registration to undo. Any artifact
acquisition/pinning must be independently committed and reverted as a matched set.

Next minimal step: a separately launched Session 02 with explicit permission for only
the source edits above and their local commit. Builds, installs, tests, application,
AWS/network and deployment remain separately unauthorized. Stop after this report.
