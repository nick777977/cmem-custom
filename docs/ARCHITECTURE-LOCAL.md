# Architecture: retained core and proposed boundaries

Evidence baseline: [BASELINE.md](BASELINE.md). Current code and target design are
separate below. Full runtime/egress correctness is still unproved; completed bounded
tests and real compiles remain in the linked handoffs. A19/A20 now supersede the
former Bedrock-only target, not its historical evidence. See
[LLM-PROFILES](enterprise-local/LLM-PROFILES.md) and
[VALIDATION](enterprise-local/VALIDATION.md) for the accepted target contracts.

## Implemented hosted boundary (2026-11-02)

HOSTED-03 source `417483949` and generated `298d44742` disconnect E01/E02:
WorkViewRoutes.ts:500 tombstones all legacy setup APIs; worker-service.ts:581 keeps
local work/viewer wiring without setup clients; App.tsx:98 always mounts local work.
Direct compatibility clients and UI actions reject without reading credentials or
sending requests. Stale setup state no longer gates retained local refresh/copy.
Local counts/search/note utilities, local import receiver, SQLite canonical/Chroma
derived data and project/worktree/sharing/filter/capture/retrieval semantics retained.
58 targeted synthetic tests and one compile pass; full network/runtime acceptance
and inference enforcement are pending. [Evidence and exact paths](enterprise-local/handoffs/HOSTED-03.md).

## Implemented Chroma source refusal (2026-11-02)

CHROMA-07 source 8fa997979 / generated b8734d9b2 removes manager resolution/prewarm /
cache/certificate acquisition and HTTP launch. Legacy remote/vendor embedding settings
reject. All local activation is blocked pending approved executable/dependency/model /
offline embedding/telemetry API evidence; a path/config cannot self-enable it. Local
index/lock/mutation/teardown logic retained with synthetic lifecycle tests. 127 tests /
one compile PASS; no actual Python/model or full memory smoke. U1/D9/D11 open.
[Contract/limits](enterprise-local/handoffs/CHROMA-07.md).

## Implemented Node telemetry boundary (2026-11-02)

TELEMETRY-04 S 0abd4180b / G 6bb7c6995 removes E03/E04 worker/CLI/backfill
transports and jobs; compatible inert instrumentation cannot be enabled by legacy
settings/env. Local logger and normal memory/viewer behavior retained. SDK pruning
stays step 10; Python telemetry/Chroma U1/D9, D11 and actual runtime gates unchanged.
206 targeted tests / one compile PASS. [Evidence](enterprise-local/handoffs/TELEMETRY-04.md).

## Retained structure — historical baseline citations

The source references in this structure list retain the SHA in BASELINE; use current
contracts and task-specific source inspection for implementation.

- `plugin/hooks/hooks.json`: lifecycle hooks call the on-PATH launcher, a Bash-based
  Setup resolver and startup launcher repair. `plugin/.mcp.json` contains local and
  upstream-cache fallback resolution. Windows-only PowerShell deployment is not yet met.
- `src/cli/handlers/observation.ts:44` onward: recursive-memory-tool exclusion,
  project/agent filtering, log redaction and event dispatch; worker mode spools events,
  while a separate server-runtime branch can send event payloads remotely.
- `src/services/worker-service.ts:335` onward: shared database/session manager and
  several observer providers; routes are assembled in `registerRoutes` at line 530.
- `src/services/worker/DatabaseManager.ts:25`: guarded SQLite connection, SessionStore,
  SessionSearch, conditional ChromaSync and separately conditional CloudSync. Cloud sync
  also affects outbox creation and local device identity; removal needs those callers.
- `src/services/sqlite/SessionStore.ts`, `SessionSearch.ts`, `tool-uses.ts` and
  `src/services/context/ContextBuilder.ts`: storage/search/context code areas to retain
  and trace fully before edits. Exact durability/replay behavior still needs audit.
- `src/services/sync/ChromaSync.ts` and `ChromaMcpManager.ts`: local derived index and
  child MCP lifecycle. Keep these distinct from `CloudSync.ts` / `SyncClient.ts`.
- `src/services/worker/http/routes/SearchRoutes.ts`, `src/servers/mcp-server.ts` and
  context handlers form retrieval surfaces. Scope must be consistent on each surface.
- `src/services/server/Server.ts:362` already applies worker Host/Origin guards when
  an origin policy is supplied. Do not design as if the checkout had no HTTP defenses.

## Proposed target — not yet implemented

```text
Claude Code / Codex hooks and local MCP (private local plugin)
  -> existing capture behavior and privacy controls, preserved
  -> loopback worker -> canonical SQLite/FTS5 + durable queue
                    -> shared role/profile resolution and validation
                       -> explicit selected adapter + model + isolated auth
                          (Bedrock / Claude login or API / Codex login /
                           OpenAI-compatible API / explicitly enabled adapters)
                    -> refresh / copy / judges / standalone model work
                       -> the same profile policy; no hidden model/fallback
                    -> one persistent local Chroma MCP process
                       -> pre-provisioned ONNX model, no downloader
  <- existing search scope / timeline / detail / SessionStart context
  <- retained local viewer with bundled assets and guarded sensitive routes
```

Security posture: reject unselected or unsupported adapter/auth/model/destination and
non-loopback worker bind; explicit user-configured LLM/auth destinations are allowed.
No implicit provider/model/credential or hosted fallback; explicit failure for missing local executables/models; keep queued
data recoverable without reporting successful indexing. A SQLite-only degraded mode
requires a deliberate product decision; it is not a substitute for shipping Chroma.

Retain the existing Claude SDK unless a verified constraint requires replacement.
Use a reviewed absolute local adapter executable and argument array only after the
actual Python/embedding/telemetry API and compatible artifacts are verified;
do not turn the plan's guessed ONNX model into a pinned dependency without evidence.

Fresh fork/test data must be separate from upstream memory. Initial implementation
must avoid destructive SQLite schema changes; remove hosted behavior first, retain
inert compatibility fields where necessary. Historical-data migration is deferred.

## Changes to the supplied plan

1. Introduce a build-without-install/deploy boundary before any trial build.
2. Audit server runtime, Codex and generic OpenAI-compatible dispatch too, beyond the
   older plan's Gemini/OpenRouter list. Removing extra harness folders alone is insufficient.
3. Isolate plugin identity/paths early for development; complete the installer later.
4. Review existing capture payloads for each selected profile before real inference. The user
   deferred memory/capture redesign; do not introduce a new DLP subsystem implicitly.
   Redacted logs alone do not establish redacted stored/observer data.
5. Keep existing SDK/Codex/API adapters; use minimal shared profile validation and
   explicit role overrides, not a provider rewrite. Preserve tool/MCP isolation.
6. Add early compiled-process and credential-free mock-LLM tests/CI within existing
   steps. Root typecheck, build, process smoke, real local-index E2E and live-profile
   acceptance are distinct; unavailable Bedrock does not block earlier levels.
7. Preserve current Host/Origin controls and assess their coverage instead of replacing
   them blindly. The supplied 503 explanation remains historical, not a new diagnosis.

## Remaining policy decisions

See [decision log](enterprise-local/memory/DECISIONS.md). Main gates: approved artifact
sources; selected-profile auth/endpoint/model/payloads (AWS details when selected);
CI runner/network/artifact policy; plugin-loading permission;
local retention/backup policy. Viewer retention and unchanged project/worktree behavior
are settled by A06. No canonical identity rewrite, mandatory query-scope change or
identity migration is planned; record existing weaknesses for possible later work.
No precise AWS endpoint list or organizational approval is inferred from source code.
