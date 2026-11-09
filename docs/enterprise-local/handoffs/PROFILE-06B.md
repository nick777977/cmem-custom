# PROFILE-06B evidence

2026-11-09, one coordinator on `feat/cmem-light-local`. Clean entry
`ee4f7dfbf04cece361ecb7b8901eecdc7829f214`. Inspected and tested source,
focused tests and matching emitted files
`616c51272ed09459043d4c2e2b5718bef4d5c720`.

## Local worker and standalone judge

- The [shared resolver](../../../src/services/worker/model-profiles.ts#L138)
  validates the selected role, protocol and destination before use. Health
  reports effective choices and safe refusal categories through the
  [shared dispatch boundary](../../../src/services/worker/MainWorkerProfiles.ts#L195).
  Invalid overrides pause without selecting the default. Changes to background
  roles do not recycle an active observer.
- The [refresh runner](../../../src/services/agent-runner/run.ts#L104) keeps one
  profile for the job. The existing validators still perform the saves. Its
  Claude route preserves path-checked Read, Grep and Glob under the ledger and
  disables plugin/MCP inheritance. Codex uses the existing no-tool app-server
  adapter. The other adapters also receive prepared evidence inline. Each prompt
  has a deadline, and the job has a 30-minute ceiling. The local
  [goals helper](../../../src/services/work-view/refresh-task.ts#L246) receives
  a limited runtime environment and the loopback worker address.
- [Card copy](../../../src/services/worker/http/routes/WorkViewRoutes.ts#L252)
  uses the selected text route and existing validation/cache. It keeps the copy
  instructions separate from the untrusted evidence. The cache is retained on
  failure and when explicitly off. Existing copy opt-outs still apply until an
  explicit role override.
- [Both judges](../../../src/services/worker/http/routes/WorkViewRoutes.ts#L288)
  use the [Decisions client](../../../src/services/work-view/request-judge.mjs#L133)
  with a selected full endpoint and model. The client sends at most once per
  question, refuses redirects and keeps error bodies out of diagnostics. The
  [bundled request-progress CLI](../../../src/services/work-view/request-groups.mjs#L891)
  uses the same selection. The calibration helper uses the same focus selection.
  Local rules and the separately selected refresh jobs keep their existing
  behavior when a judge is unavailable.
- [Knowledge](../../../src/services/worker/knowledge/KnowledgeAgent.ts#L59)
  requires a Claude profile with a resumable SDK conversation. It resolves auth
  through the same selected native route, uses the existing hardened SDK
  settings, and keeps the corpus and session binding local. An existing
  unbound or differently bound session requires prime before query.
- The local worker reports `telegramWrapup: unsupported_capability` when a
  profile is configured. Its former implicit formatter route is removed.
  The [profile-mode observation processor](../../../src/services/worker/agents/ResponseProcessor.ts#L917)
  also suppresses Telegram alerts, Grok Bot notifications and Notion export.
  The local notification utilities and their injected-transport tests remain
  available for other explicitly owned paths.

## Executed validation

- 143 focused tests and 764 assertions passed across 12 files, plus 3 setup
  route loopback tests and 18 assertions. Fake HTTP and SDK checks exercised
  refresh, copy, request and focus judging, knowledge, cache retention and
  capability refusals. The Windows file-tool fixture covered direct and
  relative traversal. Creating a junction in the sandbox returned EPERM, so
  the symlink escape case runs on supported non-Windows test hosts.
- Root and viewer typechecks passed. The final guarded compile passed with
  Node 22.23.4, npm 10.9.9 and Bun 1.4.4. It preserved 19 build inputs and 2022
  source sentinels. Three of 192 tracked outputs changed against the entry
  bundle. The worker CJS/map and bundled request-progress CLI were emitted
  together. The worker SHA-256 is
  `01ab9765fe78e895105a41a9a6ef34a6683f03af8c0e0cf84e90eca593a6483f`.
  The generated worker retains the compiler's whitespace in bundled
  third-party code. Authored source and docs pass whitespace checks.
- The ordinary-user copied-worker check passed under
  `.scratch/enterprise-local/profile-06b/compiled-6rjHVP/`. It used a
  byte-identical copy, an isolated home and synthetic SQLite data, with
  Chroma disabled. Legacy-only and missing-key selections sent zero requests.
  The fixture received six exact loopback requests, for compression,
  observation, summary, copy, HTTP 401 and the refused redirect. The legacy
  endpoint and redirect target received zero. The worker cached valid copy,
  hid it on opt-out, preserved the cache and refused the unsupported knowledge
  HTTP operation with 424. Health reported safe role status. Both failed
  observation batches remained queued. The owned worker exited cleanly.
  Reopening SQLite found the synthetic observation and summary. Preliminary
  fixture runs corrected the card lookup and cache polling. The copy fixture
  also caught an adapter framing issue that was fixed before the final build.

No external provider, native login or AWS inference was run. All three approved
`gpt-6-luna` turns remain unused. Although the worker disables its own retries
on the selected native Codex wrapper, the tested Codex CLI rejects zero-retry
overrides for its built-in provider. The exact route still requires proof
before any live inference. The fixture does not provide OS-wide egress proof
or live evidence for the native SDK, Chroma or other providers.

## Follow-up ownership and rollback

| Owner | Boundary |
|---|---|
| Step 7 | Select and activate local Chroma and offline embeddings. [Next session](../NEXT-SESSION.md) |
| Step 8 | Local API/viewer and profile settings presentation. If refresh needs local MCP search beyond prepared evidence, bind only the reviewed local read tools without loading the host plugin. The standalone request-progress `record-focus` worker URL is part of this API boundary. |
| Step 10 | Keep the separately built [server provider factory](../../../src/server/runtime/create-server-service.ts#L290), its custom provider module and the dormant [installer loopback probe](../../../src/npx-cli/cmem-memory-credentials.ts#L115) outside the verified local worker lane. Gate or migrate them before release admission. Review the unused native agent detector and its runtime-root helper before pruning. |
| Step 11 | Validate exact intended provider and auth routes. Native Codex needs the zero-retry proof first. Corporate Bedrock remains with the authorized corporate environment. |

Revert `616c51272` as a unit with its emitted files while the worker is stopped.
Keep the existing SQLite, settings, corpus files and caches. Review legacy
settings before starting a reverted worker because the earlier background
routes can select providers and credentials independently.
