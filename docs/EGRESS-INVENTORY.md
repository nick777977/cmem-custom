# Preliminary static egress and process inventory

Source SHA: `d7c2da3e5f9397b394dbc6b6966f4b261b489f7b`. All cited paths are
VERIFIED IN CHECKOUT by static inspection; actual invocation/traffic is UNKNOWN.
This is a bounded reconnaissance inventory, not completed P1 or proof of zero egress.
Functions and triggers below identify code reachability, not observed user activity.
Session 01's [bounded closure](enterprise-local/AUDIT-CLOSURE.md) adds coverage,
reachability/owning steps for every E-ID, E15/E16/E18 refinements and E19–E22.
The source SHA is unchanged; dependency and runtime proof remain pending.

## Reachable capability register

| ID | Evidence / caller / trigger | Destination and payload / process | Policy and disposition | Dependency impact and future regression proof |
|---|---|---|---|---|
| E01 | `WorkViewRoutes.ts:453,577` under `src/services/worker/http/routes/` wires setup scan extractor to `HostedIntent.run`; `src/services/work-view/hosted-intent.ts:171` | `${origin}/api/pro/intent`; compressed historical prompt-derived extraction input and auth; worker | Forbidden: remove routes, extractor and remote UI actions | SetupScan/worker/viewer callers; legacy setup request must never construct outbound request |
| E02 | `src/services/worker-service.ts:601`; `src/services/setup/history-import.ts:101`; WorkViewRoutes at `:597` | `${origin}/api/import`; historical memory upload using cloud token; worker | Forbidden: remove import wiring/client independently of E01 | HistoryImport routes and setup state; old setup token must be inert |
| E03 | `src/services/telemetry/telemetry.ts:1,78,514,586`; worker logger bridge `worker-service.ts:665`, buffer `:1003` | Default `https://us.i.posthog.com` from `telemetry/common.ts:21`; events/exceptions/install metadata; worker | Forbidden: remove transport, jobs and SDK; retain local logging | Telemetry instrumentation callers/build closure; boot/error/shutdown must produce no analytics attempt |
| E04 | `src/services/telemetry/cli-telemetry.ts:75` invokes fetch to configured telemetry host | `${host}/capture/`; CLI events; CLI process | Forbidden: remove CLI transport too | CLI consent/settings/commands; CLI tests and packaged entrypoint closure |
| E05 | `worker-service.ts:859,939,1051`; `src/services/sync/CloudSync.ts:637,1022,1674`; `SyncClient.ts` | Dynamic hub; `/v1/sync/status`, `/v1/sync/ops`, realtime/polling; corpus mutations and auth; worker | Forbidden: remove remote sync lifecycle/routes/clients | DatabaseManager outbox flags/device identity; preserve schema/Chroma; old tokens, restart, retries must not connect |
| E06 | `src/services/worker/provider-dispatch.ts:232,336,412`; instantiated providers `worker-service.ts:337` | Gateway/third-party model APIs, dynamic compatible endpoints; observer content/keys; worker or child | Forbidden except restricted Claude/Bedrock path: remove dispatch alternatives and fallback/probing | SessionRoutes, settings, quota routing, UI; unsupported provider, legacy keys and failures must fail closed |
| E07 | `src/services/worker/ClaudeProvider.ts:436,475,501,1069`; `src/shared/EnvManager.ts:230,306,368`; `src/supervisor/env-sanitizer.ts:42,60` | SDK child inherits broad env and possible OAuth/key fallback; exact selected endpoint UNKNOWN; observer content | Retain only approved Bedrock/auth; build strict env and config validation for BOTH observer call sites | Preserve hardened SDK options and recursion guard; valid/expired SSO, overrides, direct keys, proxy/CA tests |
| E08 | `src/services/sync/ChromaMcpManager.ts:1015` builds uvx arguments; stdio transport `:449` | Runtime Python package resolution; package indexes/cache; uvx/Python subprocess | Replace with absolute pre-provisioned executable | Pin full compatible dependency graph; cold-cache test must not spawn package manager |
| E09 | `ChromaMcpManager.ts:657` remote HTTP mode; `src/shared/SettingsDefaultsManager.ts:570` | Configurable host/SSL/tenant/database/key; vectors/query/corpus; Python | Remote mode forbidden: reject config, keep persistent local mode | Startup/Chroma settings; remote host/API-key legacy fixtures rejected |
| E10 | `src/services/sync/ChromaSync.ts:176,406`; default setting `SettingsDefaultsManager.ts:585` | Embedding names include default/openai/cohere/jina/voyageai/roboflow; external embedding text if selected; Python | Restrict to verified local embedding function/model | Actual default Python model/download behavior UNKNOWN; inspect Python artifacts; missing-model/cold-cache tests |
| E11 | `ChromaMcpManager.ts:2245` assigns telemetry off only if inherited value unset | Python Chroma analytics destination/payload UNKNOWN without dependency inspection | Enforce supported disable setting and validate packaged dependency | Env alone insufficient; monitor Python child under boot/index/query/error/shutdown |
| E12 | `src/npx-cli/install/setup-runtime.ts:138,176,427`; `src/npx-cli/commands/install.ts:649,1700,1872` | Bun/uv/Claude bootstrap, npm/Bun packages and CMEM OAuth endpoints; installer/process commands | Replace installer with local preflight; remove remote setup/auth/bootstrap | Dependency acquisition becomes approved build-time step; installer fixture must reject missing files without download |
| E13 | `plugin/hooks/hooks.json:12,27,54`; `plugin/scripts/version-check.js:13,235`; `plugin/.mcp.json:9` | Setup package installation; global launcher, upstream cache/marketplace fallback; Node/Bun/shell | Replace with deterministic private bundle resolution | Generator and generated hooks/MCP must agree; test upstream coexistence, spaces/Unicode, missing bundle |
| E14 | `plugin/scripts/ensure-launcher.cjs:8` generated self-heal; `src/launcher/install-launcher.ts:424,703,776,813` | Bun compile, user PATH/registry effects; startup launcher | Replace runtime repair with approved build/install preflight | Bounded source trace in closure; test startup cannot compile or modify registry |
| E15 | `package.json:74`; `scripts/gen-plugin-lockfile.cjs:57`; `scripts/build-hooks.js:576`; `scripts/build-viewer.js:71,72` | Viewer npm ci, plugin bun install, generated manifests/UI/bundles; Node/Bun build processes | Build-only acquisition requires explicit authorization; split both install paths from compile/deploy | Step 2; exact first patch in closure; root lock/native behavior remains pending |
| E16 | `src/cli/handlers/observation.ts:96,112`; server-runtime branch | Configurable server client; raw tool input/output and cwd; hook process | External server runtime forbidden; remove worker-to-server switching/client reachability | Server auth/Postgres/Redis/custom provider surfaces require closure audit; malformed runtime setting must reject |
| E17 | `src/services/server/Server.ts:274,362`; `SettingsDefaultsManager.ts:437,441` | Loopback HTTP default, configurable host/origins; local memory/API data; worker/browser | Retain and harden; explicit rejection of non-loopback config | Existing guards present; Host/Origin/CSRF/destructive routes/auth coverage needs route-by-route review |
| E18 | `src/ui/viewer/components/Header.tsx:119` -> `GitHubStarsButton.tsx:26`; `src/ui/my-work/src/App.tsx:233` -> `components/bits.tsx:241` | Mounted browser widgets GET GitHub API; hosted actions/navigation and provider strings distinguished in closure; judge moved to E20 | Remove automatic remote fetches/hosted actions; preserve local assets/viewer | Steps 8/3; source/bundle equivalence and browser request capture pending |
| E19 | `src/cli/spool-hook-event.ts:41,125,155,199`; `src/shared/hook-spool-remote.ts:105`; `HookSpoolRoutes.ts:21` | Configured worker host; raw capture envelope/auth; HTTP upload and upload-spool child, conditional on remote transport | Remove remote spool transport/receiver access; retain durable local spool/nudge | Step 8; legacy host/token/HTTP settings must not upload; see closure chain |
| E20 | `WorkViewRoutes.ts:295,354,370,418`; `src/services/agent-runner/run.ts:96,313,328`; `work-view/request-judge.mjs:158`; `human-copy-worker.mjs:92` | Independent refresh SDK/CLI inference with fallback; OpenRouter/gateway decisions and compatible chat; prompt-derived work/copy context | Constrain retained background inference to approved backend/auth; preserve local viewer/data/rules and memory semantics | Step 6; covers E18 judge reachability; legacy settings/probes/errors must not bypass Bedrock-only policy |
| E21 | `src/services/worker-service.ts:786`; `worker/tree-sitter-cli-provisioning.ts:27`; `smart-file-read/tree-sitter-cli-provision.ts:110,140,292` | Runtime install.js executable download; Linux conda-forge fallback; dependency-selected primary URL UNKNOWN | Replace startup/repair acquisition with pre-provisioned verified binary | Step 9, final artifact 10/12; missing/corrupt binary must not download or spawn installer |
| E22 | `worker/agents/ResponseProcessor.ts:915,932,940`; `worker/SessionManager.ts:413,422`; integrations `telegram-transport.ts:13`, `NotionExporter.ts:491`, `GrokBotBrainbeat.ts:54` | Telegram, Notion and configured webhook; observation text/metadata and session wrap-up; conditional settings, retries | Remove outbound connector callers/transports/jobs; retain storage/index/SSE and local file integrations | Step 10 as separate concern; saved secrets/events must not deliver remotely or break local storage |

## Exact source discrepancies and limits

- `ClaudeProvider.ts` exists; this is not an older SDKAgent-only checkout.
- There are Codex and generic OpenAI-compatible providers, a separate server runtime,
  alternate Chroma embedding providers and remote Chroma mode. All enlarge the plan's scope.
- Chroma launcher pins `chroma-mcp==0.2.6`, `chromadb==1.5.9` but also requests
  `onnxruntime>=1.20`, `protobuf<7`, `pydantic<2.14` (`ChromaMcpManager.ts:131,1015`).
  These are source launch constraints, not proof of installed/resolved Python versions.
- Windows uvx is already resolved directly (`ChromaMcpManager.ts:2089`); do not assume
  every Windows Chroma call goes through `cmd.exe`.
- HostedIntent forwards remote non-OK status/body (`hosted-intent.ts:179`). The exact
  daily-budget message in the supplied plan was not found in inspected service sources.
  Historical upload occurrence, response cause and remote budget logic remain UNKNOWN.
- Existing compiled worker/MCP and launcher files were sampled, not exhaustively audited.
  Their content and lockfile correspondence must be verified after an authorized clean build.

## Unfinished P1 checklist

This is the full-program backlog, not an instruction to close everything in one
read-only session. Session 01 closed the bounded static slice in
`enterprise-local/AUDIT-CLOSURE.md`, including explicit limits. Unavailable dependencies, artifact
equivalence and dynamic evidence remain later gates. An attributed UNKNOWN may
complete that session's handoff without completing full P1.

- [ ] Enumerate all process/network call sites and route/client reachability, including
  server/custom-provider, connectors, update/repair and dynamically built destinations.
- [ ] Trace capture spool -> ingest -> queue -> observer -> durable storage in detail,
  including redaction before spool and sensitive error payloads.
- [ ] Review every packaged UI fetch/asset and worker administrative endpoint.
- [ ] Inspect approved resolved npm/Python/native dependency sources/lifecycle scripts,
  embedding downloader and telemetry implementations; reconcile licenses and hashes.
- [ ] Account for all generated entrypoints and establish deterministic provenance.
- [ ] Only later, after authorization: process-tree traffic, cold-cache, concurrency and
  actual approved Bedrock evidence. Static scanning cannot close these items.

No external documentation was fetched. Supplied links remain research leads; none is
presented here as independently verified DOCUMENTED UPSTREAM evidence.
