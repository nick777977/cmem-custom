# WINDOWS-09-LOCAL evidence

2026-11-09, one coordinator on `feat/cmem-light-local`. Entry
`34f908ae6a6288da08a4550023f47d779b4120f9`, source and paired build
`ef815b29a90ec324b90ea549dee3630d7563f987`.

The [Windows setup runbook](../WINDOWS-LOCAL-SETUP.md) uses a fresh root, direct
Windows executables and the local Codex CLI catalog. The installation keeps
the catalog, Codex home, worker data and launcher together. The generated
Codex commands point at the copied compiled entrypoints through the launcher.
No application config or memory in the normal user profile was used for the
installation or lifecycle checks. The native model catalog was queried
separately through the authorized normal CLI auth path.

## Source at ef815b29a

- [codex-local.mjs:138](../../../scripts/enterprise-local/codex-local.mjs#L138)
  validates and copies the bundle, binds the canonical Codex hook events and
  MCP entry to literal paths, then installs through Codex's local catalog.
  The bundle includes the context reader required by SessionStart and FTS5.
  The existing unbound distribution templates remain inputs to this setup.
- [codex-local.mjs:61](../../../scripts/enterprise-local/codex-local.mjs#L61)
  pins loopback, local worker runtime, cloud/export settings and disabled
  quota fallback in the private launch environment.
  [Line 86](../../../scripts/enterprise-local/codex-local.mjs#L86) requires
  explicit observer provider and model. The local fixture used OpenAI-compatible
  on loopback. Codex is also an explicit launcher choice. Shared provider
  adapters, including Claude/Bedrock, were left in place.
- [codex-local.mjs:236](../../../scripts/enterprise-local/codex-local.mjs#L236)
  owns the foreground worker and checks its PID and path before readiness
  or shutdown. [Line 292](../../../scripts/enterprise-local/codex-local.mjs#L292)
  connects host entrypoints only when the intended worker is running.
  The hook keeps the host cwd for attribution and the MCP uses its usual
  cwd/roots resolution.
- [Server.ts:292](../../../src/services/server/Server.ts#L292) skips the legacy
  Bun Windows handle scan in external worker mode. The real scan reproduced
  native `STATUS_INVALID_HANDLE` on this Windows build before JS could catch it.
  [Line 522](../../../src/services/server/Server.ts#L522) delegates restart to the
  external manager. [worker-service.ts:1906](../../../src/services/worker-service.ts#L1906)
  refuses a port collision in that mode instead of attempting reclaim.
- [ChromaLocalRuntime.ts:4](../../../src/services/sync/ChromaLocalRuntime.ts#L4)
  narrows the settings input to the fields the local runtime actually reads.
  This resolves the three baseline TS2345 errors. The runtime still requires
  a concrete Python and embedding contract.

## Checks run

| Check | Actual result |
|---|---|
| Tools | Node 22.23.4, npm 10.9.9 and Bun 1.4.4 via direct paths. Codex desktop binary 0.167.0-alpha.3.2 had replaced the earlier 0.166 alpha path. Windows x64 10.0.26200. |
| Source and compile | Root and viewer typechecks pass. Six isolated test files pass, 70 tests and 697 assertions, zero tripwire events. Reviewed guarded `build:compile` passes. Final application compile kept 19 inputs and 870 source sentinels byte-identical across compile. Four of 192 tracked outputs changed, worker and server CJS/map pairs. Existing generated minifier whitespace retained. Installed compatible dependencies reused. |
| Registration and transfer | Local `plugin marketplace add` and `plugin add` passed in dedicated homes. A transferred bundle and launcher in a separate directory installed at a path containing spaces on the same matching Windows x64 host. No checkout dependency tree was copied. The final launcher, worker, MCP and context reader bytes matched the source or compiled checkout artifacts. |
| Lifecycle | Node and Bun loopback connects returned `EACCES` inside the Codex execution sandbox. An initial unsandboxed request was rejected by auto-review citing PHASE1-ALIGN. Reviewed narrower synthetic runs were approved. The tests asserted no administrator role before launch, with no UAC, machine configuration or service install. Two worker-only start/stop cycles reached SQLite readiness, served the viewer, refused duplicate start and unmanaged restart, and exited gracefully with listener and control lock gone. |
| Codex and memory | In the final copied installation, real Codex app-server listed seven installed hooks and loaded the compiled MCP tools. The discovered Windows SessionStart command ran with synthetic stdin. A Codex app-server thread with no turn called `save_memory` and `dumb_search` and retrieved the synthetic observation from SQLite. Viewer HTTP and graceful stop passed. No model POST reached the loopback fixture. The hook trust prompt remains a normal user action in Codex. Automatic hook dispatch in a real turn was not exercised. |
| Uninstall | Three earlier disposable registrations were removed with native CLI commands. The dedicated SQLite data remained. The final tested synthetic registration is stopped and retained under `.scratch/enterprise-local/windows-09-local/portable final`. |
| Live budget | Native `debug models` returned 10 entries including exact `gpt-6-luna`. This catalog does not establish account entitlement. Strict startup config rejects overrides of the built-in OpenAI provider, so zero request and stream retries could not be set for the normal ChatGPT route. Zero of three approved inference requests were used. No fallback or AWS call. |

This is bounded real host and worker evidence. Step 7 Chroma and local
embeddings, provider policy across all worker roles, observed network closure,
capture and model-backed summaries, cross-machine transfer, and final artifact
acceptance remain open. The lifecycle fixture disabled Chroma explicitly. The
initial dedicated CLI profile does not activate the desktop user's main profile.

The exact transferred worker, MCP and context reader SHA-256 digests were
`b038bcee776f969f8f82187baa863d0696aae63bf45d7eeb47062a9ecfce3b91`,
`c842d292e6a67b43c1256efcceeea5695529b9a69edc5625e98eb687936a8125` and
`d3120be4c2837732cf4074cc21a88673277e06715b557fc53a7eb91eac911574`.

To roll back an install, stop it and use the launcher uninstall command.
It removes the dedicated Codex registrations while preserving local data.
The paired source/build commit can be reverted as a unit. Historical Windows
source and mock evidence remains available. The next source task is CLOUD-05.

[OpenAI Docs on local catalogs](https://developers.openai.com/plugins/build/plugins) ·
[Catalog and entitlement distinction](https://developers.openai.com/siwc/token-sharing-open-source/codex-app-server)
