# Preliminary static egress and process inventory

Source SHA: `d7c2da3e5f9397b394dbc6b6966f4b261b489f7b`. All cited paths are
VERIFIED IN CHECKOUT by static inspection; actual invocation/traffic is UNKNOWN.
This is a bounded reconnaissance inventory, not completed P1 or proof of zero egress.
Functions and triggers below identify code reachability, not observed user activity.

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
| E14 | `plugin/scripts/ensure-launcher.cjs:8` generated self-heal; source `src/launcher/install-launcher.ts` | Bun compile, user PATH/registry effects; startup launcher | Replace runtime repair with approved build/install preflight | Full source trace pending; test startup cannot compile or modify registry |
| E15 | `package.json` scripts; `scripts/gen-plugin-lockfile.cjs:57`; `scripts/build-hooks.js:483,576` | Package resolution and generated manifests/UI/bundles; Node/Bun build processes | Build-only acquisition requires explicit authorization; split from compile/deploy | Root lock/pinning strategy and native lifecycles; verify compile performs no package resolution or deployment |
| E16 | `src/cli/handlers/observation.ts:96,112`; server-runtime branch | Configurable server client; raw tool input/output and cwd; hook process | External server runtime forbidden; remove worker-to-server switching/client reachability | Server auth/Postgres/Redis/custom provider surfaces require closure audit; malformed runtime setting must reject |
| E17 | `src/services/server/Server.ts:274,362`; `SettingsDefaultsManager.ts:437,441` | Loopback HTTP default, configurable host/origins; local memory/API data; worker/browser | Retain and harden; explicit rejection of non-loopback config | Existing guards present; Host/Origin/CSRF/destructive routes/auth coverage needs route-by-route review |
| E18 | `plugin/ui/`, `src/ui/viewer/`, `src/services/work-view/request-judge.mjs:50` | Browser assets/remote content and OpenRouter decision URL capability; browser/worker reachability partly UNKNOWN | Bundle local assets; remove hosted decision paths | Follow all UI dynamic clients and generated bundles; browser offline request capture and asset audit |

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
