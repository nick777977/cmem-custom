# PROFILE-06A evidence

2026-11-09, one coordinator on `feat/cmem-light-local`. Clean entry
`f1f6ce61221ac92fc05330c6410aefbc886c7fde`. Source, focused tests and emitted
files `534de79111eed1c392266470a7c25caac8f6d4ae`.

## Main worker boundary

- The [profile resolver](../../../src/services/worker/model-profiles.ts#L135)
  requires a complete default and accepts explicit role overrides. The
  [settings reader](../../../src/services/worker/model-profiles.ts#L153)
  honors the existing wrapped shape and a whole-object environment override.
  Credentials stay in the selected native source or bound key environment.
- [SessionRoutes](../../../src/services/worker/http/routes/SessionRoutes.ts#L265)
  checks admission before creating a generator. The selected generation
  keeps its profile snapshot. New work can switch it at the existing queue
  boundary. [GeneratorRunner](../../../src/services/worker/session/GeneratorRunner.ts#L223)
  releases claimed work on failure. The main worker
  [disables the legacy fallback callbacks](../../../src/services/worker-service.ts#L317).
- The [shared session loop](../../../src/services/worker/OpenAICompatibleProvider.ts#L170)
  routes observation, [compression](../../../src/services/worker/OpenAICompatibleProvider.ts#L220)
  and [summary](../../../src/services/worker/OpenAICompatibleProvider.ts#L638)
  to the selected adapters. The HTTP route uses a single bound credential and
  [refuses redirects](../../../src/services/worker/streamed-chat-completion.ts#L245).
  Malformed main worker output preserves queued work at the
  [response boundary](../../../src/services/worker/agents/ResponseProcessor.ts#L472).
- [Claude](../../../src/services/worker/ClaudeProvider.ts#L1133) uses the
  existing hardened SDK one-shot with worker-managed conversation history.
  This changes Claude's observer transport from a long-running SDK stream
  to one SDK call per model task. CLI conversation persistence and the
  streaming observer's usage accounting are outside that route. The
  [spawn wrapper](../../../src/supervisor/process-registry.ts#L875) passes the
  selected executable and environment and suppresses raw child stderr.
  The [Bedrock route](../../../src/services/worker/MainWorkerProfiles.ts#L79)
  accepts only the selected IAM Identity Center profile, obtains temporary
  credentials through the explicit AWS CLI and supplies those credentials
  and the explicit Region to the existing Claude SDK.
  [AWS CLI reference](https://docs.aws.amazon.com/cli/latest/reference/configure/export-credentials.html),
  [Claude Code Bedrock configuration](https://code.claude.com/docs/en/amazon-bedrock).
- [Codex app-server](../../../src/services/worker/CodexAppServerClient.ts#L530)
  confirms the selected model before sending the turn. Its child is scoped to
  the selected native login. Missing login files refuse before spawn.
  Changes to the selected login file restart an existing child on the next
  turn. No native login or model entitlement was exercised in this slice.
- [Health status](../../../src/services/worker-service.ts#L382) reports effective
  role IDs, model, adapter, auth mode, inheritance and safe failure categories.
  The [private launcher](../../../scripts/enterprise-local/codex-local.mjs#L86)
  translates its earlier two profile inputs and accepts the full profile set.
  [Configuration](../LLM-PROFILES.md#main-worker-configuration).

## Validation

- 165 focused tests and 501 assertions across nine files passed. The six new
  tests cover resolution, actual HTTP dispatch through fake fetch, exact
  native adapter options, missing native credentials, safe status and
  same-route failures. Two existing socket-dependent OpenAI-compatible
  test files passed with disposable loopback access. An initial sandboxed
  socket case saw zero requests and failed before that rerun.
- Root and viewer typechecks and guarded `npm run build:compile` passed with
  Node 22.23.4, npm 10.9.9 and Bun 1.4.4. The 19 build inputs and 872 source
  sentinels were stable across compile. Three of 192 tracked outputs changed.
  The worker CJS and source map changed together. The standalone server map
  source list and paired CJS bytes were unchanged. Shared source changes
  moved mappings in its map. The worker SHA-256 was
  `3dfce7ce6cfa642bf141764129a07cedd5e1988bb9ec484723e32dcf19e2bbb5`.
- The sandboxed Bun positive control returned EACCES. The approved ordinary
  Windows user run used a byte-identical copy under
  `.scratch/enterprise-local/profile-06a/compiled-hdV5ct/`. The test copied
  the bundle and started that worker directly. It used a disposable home,
  no private catalog registration and disabled Chroma. Preliminary fixtures
  corrected a blocking loopback control and replaced a payload that exceeded
  the existing compressor's input limit.
- The final compiled check verified ownership and readiness, zero sends for
  legacy-only and missing-key profiles, and retained buffered work. Repairing
  the profile resumed it. The fixture received exactly five requests, one
  for each selected compression, observer, summary, 401 and redirect route.
  Requests used the expected path, model and key. The redirect target and
  legacy endpoint received zero requests. Both failure batches stayed queued.
  The profile keys and echoed failure text stayed out of health and worker
  logs. The worker exited cleanly and reopening SQLite found one synthetic
  observation and one summary.

No live inference, AWS execution, credential inspection, real corpus,
registration or Windows elevation. All three approved `gpt-6-luna` turns
remain unused. The built-in Codex provider still lacks proof that automatic
retries can be disabled on the exact route. The loopback fixture proves only
the exercised routes and processes. Native login, Bedrock and real model
compatibility still need their own evidence.

## Rollback and next work

Revert `534de7911` with its paired output and launcher. Keep SQLite and
settings. A reverted worker can use legacy implicit selection and fallback,
so review those settings while the worker is stopped before restarting it.

The main worker's Telegram wrap-up formatter is withheld with a local
unavailable diagnostic pending explicit routing. Other background paths and
standalone helpers remain outside this evidence boundary. Continue
[PROFILE-06B](../NEXT-SESSION.md) for refresh, copy, judging, knowledge, wrap-up
and standalone work. Chroma and offline embedding setup stay in step 7.
