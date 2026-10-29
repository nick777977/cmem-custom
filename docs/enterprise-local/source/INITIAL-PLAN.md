# Claude-mem Enterprise Local Fork: Initial Architecture, Security Audit and Implementation Plan

**Document type:** Engineering handoff / initial implementation plan for Codex  
**Prepared:** 2026-10-29  
**Project:** Local, security-hardened fork of [`thedotmack/claude-mem`](https://github.com/thedotmack/claude-mem)  
**Target environment:** Windows Enterprise Cloud PC, PowerShell, Claude Code with AWS Bedrock through corporate AWS SSO / `AWS_PROFILE`  
**Document status:** Planning baseline. **Not** a completed source audit or proof of zero egress.  
**Primary task for the next agent:** Inspect the **already cloned local repository**, pin the actual commit, produce an evidence-based network/security inventory **before modifying implementation code**.

> **Critical instruction for Codex:** This document is a planning input, not an authoritative description of the current checked-out source. Filenames, configuration keys, defaults, version-specific claims, release contents and behavior must be verified against the actual checkout. Distinguish `VERIFIED IN CHECKOUT`, `DOCUMENTED UPSTREAM`, `INFERRED`, and `UNKNOWN`. Never implement a speculative deletion without tracing its callers, runtime dependencies and tests.

---

## Краткое резюме для владельца проекта

Этот handoff предназначен для **Codex в уже клонированном репозитории claude-mem**. Основная часть технического задания написана на английском, чтобы её было удобно использовать как прямые инструкции агенту; требования, план и критерии приёмки остаются теми же, что обсуждались на русском.

**Цель:** создать внутренний форк claude-mem для Windows Enterprise Cloud PC, который работает только с Claude Code, сохраняет память в локальной SQLite/FTS5 и локальной Chroma с локальной embedding-моделью, а для LLM-компрессии использует только утверждённый AWS Bedrock через действующие SSO/AWS_PROFILE. Удаляются hosted onboarding, CMEM Pro, PostHog, облачная синхронизация, внешние inference-провайдеры, регистрации, обновления и загрузки зависимостей во время работы.

**Важная граница:** полностью локальное хранение не означает полностью offline-инференс. Для создания observations часть исходных данных передаётся в одобренную Bedrock-модель. Разрешённость такой передачи нужно подтвердить корпоративной политикой. Отсутствие остальных исходящих соединений должно доказываться как изменениями кода, так и тестами/сетевыми ограничениями.

**Подтверждённый контекст:** локальные процессы Bun/Node разрешены; Claude Code работает через AWS Bedrock и SSO/AWS_PROFILE; пользователь уже клонировал upstream в проект Codex. Ранее была установлена версия claude-mem 15.4.0 с работавшим локальным worker. HTTP 503 приходил от hosted setup из-за ограничения дневного бюджета anonymous setup, а не из-за локальной SQLite. Факт и содержимое возможной отправки данных этим setup отдельно не доказаны.

**Как действовать:**

1. **P0:** определить точный commit/branch/status локального checkout, сохранить существующие изменения и не затронуть текущую рабочую память.
2. **P1:** провести фактический аудит всей цепочки вызовов и исходящего трафика, включая зависимости, Bun worker, Claude observer, Python Chroma, браузерные bundles и Windows launcher. Подготовить `EGRESS-INVENTORY.md` и сопутствующие документы.
3. **P2–P3:** последовательно убрать удалённые сервисы и обеспечить единственный Bedrock provider без fallback.
4. **P4–P5:** подготовить полностью локальную Chroma/ONNX и собственный PowerShell-installer, который не обращается к внешнему marketplace и не скачивает компоненты в runtime.
5. **P6–P8:** усилить project scope, защиту данных и loopback HTTP, выполнить end-to-end/egress testing, собрать воспроизводимую поставку и rollback.

**Что нельзя делать сразу:** удалять каталоги по названию (например, весь `src/services/sync`, где могут сосуществовать cloud sync и локальный ChromaSync), запускать installer или `uvx` без аудита, автоматически переключать Git tag, ломать существующий plugin, менять корпоративные настройки безопасности, заявлять «нулевая телеметрия» без динамической проверки.

**Первое задание Codex:** строго **P0 + P1 без изменений application source**. Готовый prompt расположен в разделе 9.2. После первого аудита нужно сверить предположения этого плана с реальным checkout, и только затем выдавать последовательные задания на реализацию.

---

## 0. Executive decision record

### 0.1 Desired outcome

Build a reproducible, locally installed, intentionally reduced fork of `claude-mem` that:

1. Integrates with **Claude Code only**. Other harness integrations (Codex, Cursor, etc.) are not product requirements; **Codex is used to develop the fork**, not as a runtime memory client.
2. Uses the existing **AWS Bedrock** enterprise pathway for observer/summarization inference. Authentication remains the organization's approved **AWS SSO / `AWS_PROFILE`** flow. No independent commercial inference subscription, personal API key or fallback provider.
3. Keeps **sessions, tool events, observations, summaries, SQLite/FTS5 data, Chroma vector data, embedding model files, queue state and logs on the Cloud PC** in approved local directories.
4. Runs **Chroma locally and persistently** with a **pre-provisioned local embedding model**; no Chroma Cloud, online model resolution or runtime package downloads.
5. Removes the **implementation and reachability** of hosted onboarding, CMEM Pro, hosted My Work/reveal/extraction, cloud sync, PostHog and other telemetry, external login/registration, unnecessary cross-harness integrations, remote update mechanisms and unnecessary third-party providers.
6. Does not register an external marketplace or silently run the upstream cached plugin. Uses a locally built, independently identifiable plugin and deterministic file paths.
7. Permits network traffic only to **organization-approved AWS Bedrock, AWS authentication and infrastructure endpoints** where explicitly required. All other outbound traffic is denied/monitored through approved corporate controls.
8. Works with multiple concurrent Claude Code sessions and repositories without accidental project-memory mixing or duplicate workers.
9. Is maintainable as a **small, reviewable, auditable fork**, with tests, dependency pinning, a software bill of materials (SBOM), installation/rollback documentation and repeatable build steps.

### 0.2 Important distinction: local storage is not zero network

- **Local storage**: SQLite and Chroma reside on the local filesystem.
- **Local computation**: Bun worker, Chroma MCP, embedding inference and most indexing execute locally.
- **Approved remote inference**: Claude observer sends necessary prompt/tool-derived content to the organization's Bedrock endpoint.
- **No unapproved external egress**: Must be **demonstrated by runtime monitoring and enforceable network policy**, not merely by configuration flags or source scanning.

The target is **local-first with Bedrock-only approved inference**, **not 100% air-gapped inference**. Even though memory files remain local, approved observer prompts leave the local machine for AWS inference. AWS regional routing, tenancy and the exact payload policy require enterprise confirmation.

### 0.3 Non-goals for the first release

- Replacing the Claude Agent SDK with a new, custom Bedrock API implementation unless the existing provider cannot meet the policy and tests.
- Designing a shared, internet-facing, multi-user memory service.
- Rebuilding the entire application or rewriting the SQLite schema without a verified need.
- Keeping every hosted My Work/Focus feature at any cost.
- Cross-organization or cross-client memory sharing.
- Automatically migrating historic memory before the new build has passed security and functional acceptance.
- Claiming that plugin source alone can guarantee no unauthorized egress from all transitive dependencies or the existing Claude Code client.

### 0.4 Prior observed installation state (evidence supplied by user)

At the earlier installation attempt, screenshots showed an installed `claude-mem` **v15.4.0**, locally functioning launcher and worker, successful plugin/marketplace registration, Bun and uv installed, and an interactive browser setup page at `127.0.0.1:37777/?setup=1`.

The hosted setup page displayed:

> `Hosted setup failed (HTTP 503): The daily budget for anonymous hosted setup has been reached. Try again after 00:00 UTC; your install has not received another allowance.`

**Interpretation with high confidence:** The HTTP 503 was returned by a hosted setup budget gate. It is not, by itself, evidence that SQLite, Bun, Chroma, the local worker or Bedrock failed. It also does **not prove which historical prompts or other data, if any, had already been uploaded**. The fact that a user-facing anonymous-telemetry checkbox was unchecked does not establish that separate hosted setup calls had been disabled.

This fork should prevent the hosted setup path from being invoked at all.

**Current workstation context:** The user has already cloned the repository in a Codex working project. **Do not run `git clone`, `git checkout`, forced resets, destructive upgrades or installs without first examining that working tree.** The selected upstream tag/commit may differ from the earlier installed plugin. Read the actual repository state first.

---

## 1. Hard constraints and security invariants

### 1.1 Environment

| Dimension | Confirmed requirement / assumption |
|---|---|
| Host OS | Corporate-managed Windows Cloud PC |
| Shell | PowerShell, not a required Bash-based workflow |
| Runtime processes | Local Node/Bun/Python subprocesses are permitted in principle |
| Coding agent | Claude Code, enterprise deployment |
| Runtime model access | AWS Bedrock via working corporate SSO and `AWS_PROFILE` |
| Development agent | Codex in the cloned repository |
| Data persistence | Local filesystem only |
| Primary database | Local SQLite with FTS5 |
| Vector database | Local persistent Chroma |
| Embeddings | Local model, pre-provisioned, no runtime downloads |
| Hosted memory / subscriptions | Forbidden |
| Telemetry / cloud sync | Forbidden |
| Marketplace / remote auto-update | Forbidden for the fork's runtime |
| Corporate policies | Must be obeyed; do not bypass managed plugin, network, execution or endpoint controls |

### 1.2 Fail-closed rules

1. Unknown provider -> **startup/config validation error**, never hosted fallback.
2. Missing or expired Bedrock SSO -> **visible actionable error**, no alternate credentials/provider.
3. Missing local Chroma executable or ONNX model -> **clear error** or explicitly approved SQLite-only degradation; never network download.
4. Missing local worker/plugin file -> **error**, not GitHub/npm/PyPI fetch.
5. Unrecognized remote URL or base URL -> reject, not silently accept.
6. Attempt to bind HTTP worker to `0.0.0.0` or non-loopback -> reject at config validation.
7. User not authorized to install/register plugin -> stop and seek approved administrator workflow, not an alternate bypass.
8. Failed SQLite/Chroma index update -> preserve canonical SQLite events and expose degraded status; don't falsely claim fully indexed memory.
9. Egress-policy failure -> deployment failure, even if the app functionally works.
10. Raw tool outputs and secrets -> treat as sensitive even if retained locally; redact/limit before storing and before sending to Bedrock as required.

### 1.3 Allowed versus forbidden network categories

| Category | Runtime policy | Notes |
|---|---|---|
| `127.0.0.1` / loopback IPC | Allowed | Worker/viewer/MCP internals; audit exposed endpoints |
| AWS Bedrock model inference | Allowed if explicitly approved | Region, model/inference profile, IAM, payload policy |
| AWS SSO / STS / corporate identity | Allowed if needed and approved | Exact endpoints depend on enterprise SSO setup |
| Corporate proxy/CA/DNS/security tooling | Allowed per IT policy | Should not be disabled to achieve this project |
| `cmem.ai` / CMEM Pro | Forbidden | No hosted onboarding, inference, registration or sync |
| PostHog / telemetry sinks | Forbidden | Includes transitive telemetry in Chroma |
| Chroma Cloud | Forbidden | Local `PersistentClient`/MCP only |
| OpenRouter / Gemini / direct Anthropic API | Forbidden for observer | The corporate Claude Code Bedrock path remains allowed |
| GitHub, npm, PyPI, Hugging Face, S3 model download | Forbidden **during runtime** | Approved package/artifact fetching may occur at build time |
| Remote plugin marketplaces / update checks | Forbidden | Immutable local artifact |
| Other unknown destinations | Forbidden until reviewed | No default allow of arbitrary HTTPS |

**Do not hardcode an AWS endpoint allowlist based on guesswork.** Obtain precise approved Region/service routes from enterprise IAM/network owners. The Bedrock and SSO flows can differ by configuration and corporate gateway.

---

## 2. Mental model of the system being retained

The desired retained logical pipeline is:

```text
Claude Code (Windows, Bedrock SSO)
   |
   | local lifecycle hooks / transcript capture
   v
Local claude-mem launcher + Bun worker [127.0.0.1 only]
   |                         |
   | canonical durable data  | bounded observer tasks
   v                         v
SQLite / FTS5          Claude provider subprocess
   |                         |
   |                         +--> approved AWS Bedrock inference
   |
   +--> local Chroma synchronization
              |
              v
      Chroma MCP, local persistent data
              |
              v
       ONNX CPU embedding model
              |
              v
        semantic retrieval
   |
   v
SessionStart context / scoped search / timeline / observation hydration
```

Retain and test these concepts (actual implementation must be confirmed in checkout):

- Hook-driven capture of significant Claude Code activity.
- Durable raw event or tool-use storage.
- Bounded background observer processing and compressed observations.
- End-of-session summaries / checkpoints.
- Canonical SQLite + FTS5 retrieval.
- Local SQLite-to-Chroma indexing, where Chroma is a **derived index**, not the sole canonical copy.
- Progressive retrieval: compact search results -> timeline -> detailed observations -> raw tool event when explicitly needed.
- Project/session/agent metadata and per-project retrieval.
- Worker process stability under concurrent sessions.

**Critical separations**:

- Episodic memory is **not** current code truth. The codebase, Git, database schema and tests remain canonical for current state.
- Episodic memory is **not** a distributed lock manager or a live multi-agent task coordinator.
- Project filter is **not** automatically a security authorization boundary.
- A browser UI at `localhost` is still an HTTP attack surface and may be accessible by other same-user processes.

---

## 3. Threat model and data classification

### 3.1 Assets to protect

1. Corporate source code, proprietary documentation, architecture diagrams and incident notes.
2. User prompts and Claude Code conversation content.
3. Raw tool calls/outputs (including potentially sensitive `.env`, config, SQL results, stack traces).
4. Observations and summaries, which can reconstruct confidential project details.
5. SQLite database and SQLite WAL/shm files.
6. Chroma persistent directory, metadata and embeddings.
7. Local ONNX embedding models and packaged Python/Node/Bun dependencies.
8. AWS profile names, IAM metadata, SSO tokens/credentials and corporate proxy settings.
9. Local worker HTTP routes, MCP tool access and log files.
10. Install/update scripts, plugin manifests and generated JS/CJS bundles.

### 3.2 Threats / failure modes

- Explicit hosted setup uploading historical prompts.
- Telemetry services invoked even when a main application flag is disabled.
- Hidden providers or fallback API clients.
- Auto-updates/installers fetching unreviewed code.
- Chroma telemetry independent of claude-mem settings.
- Default embedding model download upon first use.
- `uvx` resolving/upgrading Python packages at runtime.
- Launcher mistakenly resolving old upstream marketplace/cache directories.
- Windows shell quoting/command injection or unexpected `cmd.exe` processing.
- Observer subprocess environment leaking credentials, or stripping required Bedrock settings.
- Worker/observer recursively triggering its own hooks.
- Stale or cross-project memory injected into another codebase.
- Secret-containing raw outputs saved or transmitted to Bedrock.
- Viewer HTTP routes allowing destructive actions or DNS-rebinding/CSRF misuse.
- Open loopback API accessible by other local applications.
- Zombie Chroma processes / duplicate workers / SQLite lock contention.
- Malicious instructions in stored observations treated as authority (prompt injection).
- Offline tests passing with a warm cache but failing after a clean install.

### 3.3 Enforcement hierarchy

1. Code removal and compile-time exclusion of unwanted modules.
2. Strict allowlist configuration validation and no provider fallback.
3. Pinned, hash-verified dependencies and offline runtime packaging.
4. Loopback-only binding and local filesystem access controls.
5. Corporate process/network policy and egress logging.
6. Automated integration tests for disallowed endpoints and downloads.
7. Application env flags (`DO_NOT_TRACK`, etc.) as defense-in-depth, **not** primary enforcement.

### 3.4 Evidence labels to use in all audit outputs

- **VERIFIED IN CHECKOUT**: file path, line, branch/tag/commit, executable test or inspected behavior.
- **DOCUMENTED UPSTREAM**: supported by a dated upstream page, issue, release or official dependency document; may not match current commit.
- **INFERRED**: reasonable interpretation of code paths/architecture but not directly shown.
- **UNKNOWN**: source inaccessible, runtime behavior untested, documentation conflicting or incomplete.

Do not invent line numbers, route names, stable IDs or exact public endpoints. Record discrepancies.

---

## 4. Preliminary network and dependency surface inventory

This is the **starting hypothesis inventory**, not the complete audit. Codex must trace **every reachable path** in the actual checkout, including UI bundles, compiled runtime and transitive packages.

| ID | Surface | Potential action / data | Proposed disposition | Code areas to inspect | Required proof |
|---|---|---|---|---|---|
| N01 | Browser hosted setup / Reveal | Historical prompts or derived intents to hosted extraction | **REMOVE** | installer, setup routes, UI | No route/call path or bundle reference remains |
| N02 | CMEM Pro | Hosted inference, account pairing, trial, login | **REMOVE** | provider registry, installer, settings, viewer | Unsupported provider fails closed |
| N03 | PostHog | Event analytics, error reporting | **REMOVE** | telemetry module, dependency graph | No runtime PostHog import/client/call |
| N04 | Cloud sync | Prompts, narratives, summaries to sync hub | **REMOVE** | sync client, worker lifecycle, routes | No hub connectivity even if old credentials exist |
| N05 | Hosted My Work / Jev / Focus paths | Remote intent extraction/decisions | **REMOVE remote implementation** | worker/routes/UI | Local memory continues without hosted features |
| N06 | OpenRouter, Gemini, non-Bedrock providers | Inference to third parties | **REMOVE** | provider modules/factory/defaults | Only Bedrock-approved Claude observer accepted |
| N07 | Telegram, Grok, unnecessary integrations | Extra connectors/egress | **REMOVE** | background services/settings | Not in reachable runtime graph |
| N08 | Marketplace/update/version checks | Fetch/install upstream plugin or binaries | **REPLACE** | installer, scripts, manifests | All executable paths resolve inside local bundle |
| N09 | Chroma telemetry | Independent ChromaDB analytics | **DISABLE + TEST** | Chroma launcher + Python config | No telemetry attempts in offline/runtime capture |
| N10 | Chroma embeddings downloads | ONNX/model fetched from third-party/CDN/S3 | **REPLACE with local packaged model** | Chroma EF, model cache | Cold-start offline indexing works |
| N11 | `uvx` / `npx` / auto-repair at runtime | Download/resolve packages | **REMOVE from runtime** | MCP launcher, hooks, scripts | No runtime package-manager invocation |
| N12 | Claude observer AWS Bedrock | Prompt/tool summaries to corporate model | **RETAIN, STRICTLY SCOPE** | Claude provider, env sanitizer | Approved account, Region, model, no fallback |
| N13 | Loopback worker HTTP / MCP | Local capture/query/viewer operations | **RETAIN/HARDEN** | worker routes, viewer, MCP server | Binds loopback only; route security tests |
| N14 | External viewer assets | Fonts, scripts, analytics, image fetching | **REMOVE/BUNDLE LOCAL** | built UI/CSS/HTML | Viewer loads offline without third-party requests |
| N15 | Logs/crash reports | Sensitive data on disk or remote reporters | **LOCAL ONLY** | logger/errors | No remote log sink; tested redaction |
| N16 | GitHub/npm/PyPI build-time fetches | Software supply chain | **ALLOW only in approved build stage** | scripts, lockfiles, CI | Pinned/hash-verified approved sources |
| N17 | Other packages' postinstall / runtime clients | Hidden network & native binaries | **AUDIT/RESTRICT** | transitive dependencies | SBOM + lifecycle/traffic review |
| N18 | Existing upstream plugin installation | Duplicate hooks, wrong worker, wrong data path | **ISOLATE/DISABLE for testing** | Claude settings/installed plugins | Only fork is active in test session |

### 4.1 Candidate locations: verify, do not assume

- `src/npx-cli/commands/install.ts`
- `src/npx-cli/commands/telemetry.ts`
- `src/services/telemetry/`
- `src/services/worker-service.ts`
- `src/services/worker/http/routes/`
- `src/services/worker/DatabaseManager.ts`
- `src/services/worker/ClaudeProvider.ts` or earlier `src/services/worker/SDKAgent.ts`
- `src/supervisor/env-sanitizer.ts`
- `src/services/sync/ChromaMcpManager.ts`
- `src/services/sync/ChromaSync.ts`
- `src/shared/SettingsDefaultsManager.ts`
- `src/ui/viewer/`
- `src/sdk/prompts.ts`
- `src/servers/mcp-server.ts`
- `plugin/.claude-plugin/plugin.json`
- `plugin/.mcp.json`
- `plugin/hooks/hooks.json`
- `plugin/scripts/`
- `scripts/build-hooks.js`
- `package.json`, lockfiles and built `.cjs` files

A source path listed here may be absent or renamed. Codex must produce an exact source map rather than forcing the old file structure.

### 4.2 Initial static-search commands (PowerShell)

Run from the existing repository **after** documenting its status. These are discovery-only commands and do not prove safety:

```powershell
# Check exact checkout before any changes.
git status --short
git rev-parse HEAD
git branch --show-current
git describe --tags --always --dirty

# Candidate external endpoint references.
git grep -n -I -E 'https?://|wss?://|posthog|cmem\.ai|openrouter|telemetry|cloud.sync'

# Dynamic network and subprocess execution paths.
git grep -n -I -E 'fetch\(|axios|WebSocket|EventSource|spawn\(|execFile\(|uvx|npx|npm install|bun install'

# Installer, hosted setup and update paths.
git grep -n -I -E 'autoUpdate|version.check|oauth|signup|pairing|checkout|model.download|setup'
```

Also inspect **generated bundles** and **dependency package entrypoints**. A source-only grep misses dynamic URL construction, native library behavior, subprocess downloads and external assets referenced after build.

### 4.3 Required `docs/EGRESS-INVENTORY.md` schema

Each finding must record:

- ID, exact `file:line`, function, checked-out commit.
- How the call becomes reachable (CLI command, hook, worker start, HTTP route, scheduled job, UI action).
- DNS/hostname/URL/protocol, or dynamically constructed destination.
- Data sent (prompts, raw tool output, compressed observation, credentials, telemetry metadata, etc.).
- Which process sends it (Bun, Node, Python, browser, CLI child).
- Whether the call is allowed, forbidden, or unknown.
- Removal/replacement strategy and downstream callers affected.
- A unit/integration/network test that detects regressions.
- Evidence category and source link when external.

**Definition of complete P1:** no unclassified *known/reachable* network-capable code path remains. Residual unknowns must be explicitly recorded and escalated; never claim mathematically exhaustive safety from grep alone.

---
## 5. Detailed modification workstreams

> These are proposed engineering changes, not permission to change all files immediately. Each workstream begins with reading the actual source and tests and ends with a small isolated commit. Avoid blanket `git rm` of a directory until dependencies are understood.

### 5.1 W1: Hosted onboarding, usage scan, Reveal and registration

**Desired behavior:** Installation of the fork cannot scan historical prompts for cloud processing, redirect a browser to hosted setup, create OAuth pairing requests, initiate trials, register accounts or ask for a CMEM subscription.

**Inspect and trace:**

- All CLI installer modes and interactive prompts.
- Setup browser routes and UI requests, especially paths triggered from `/?setup=1`.
- `Scan`/`Reveal` usage analysis, any collection of historical Claude/Codex prompts, hosted intent extraction.
- Enrollment, OAuth, pairing, magic-link, checkout and subscription UX.
- Hosted My Work/Focus/reveal request builders and background invocations.
- Cached setup state, tokens and access credentials.

**Proposed patches:**

1. Replace the interactive hosted installer with a local deterministic installer (W8).
2. Remove hosted setup routes and browser components, not just their visual links.
3. Remove remote onboarding clients and remote intent-extraction jobs.
4. Remove hosted feature flags and provider selections from the UI/settings API.
5. Retain standard local Claude Code `SessionStart`, tool capture, summarization and memory retrieval.
6. Make legacy hosted credentials inert. Do not contact a service to revoke them from the installer; provide a separate compliance/manual review path if data may already have been sent.

**Acceptance tests:**

- Installation succeeds with no network except approved build-time artifact access.
- Opening the local viewer never triggers `cmem.ai`.
- Passing old hosted setup URLs/credentials does not activate any hosted path.
- Static and dynamic call graph contains no reachable hosted onboarding client.
- Local memory still captures/retrieves after removal.

**Source precedent:** Upstream release notes for v15.2.0 described a browser-based Scan/Reveal with hosted prompt extraction. Check this against the pinned source. Reference: <https://github.com/thedotmack/claude-mem/releases>.

### 5.2 W2: Remove PostHog and remote error reporting while retaining local diagnostics

**Inspect:** telemetry instrumentation, event sinks, PostHog SDK, consent management, error reporter, telemetry CLI, logs, worker initialization and UI flags.

**Approach:**

1. Preserve local structured log interfaces (`Logger` / instrumentation interfaces) where they are used for diagnostics.
2. Replace remote telemetry sinks with local-only implementations rather than disabling all logging globally.
3. Remove PostHog initialization, queue flushers, event upload and retry mechanisms.
4. Remove unused telemetry dependencies and hosted error-report transport.
5. Generate and inspect final bundles to ensure no reachable PostHog code is packaged.
6. Keep standard `DO_NOT_TRACK=1` / `CLAUDE_MEM_TELEMETRY=0` as defense in depth if supported, but **do not rely on flags as the isolation mechanism**.
7. Redact local logs and avoid secrets in errors/diagnostics.

**Acceptance:** `posthog` absent from reachable runtime dependency graph; no PostHog DNS/HTTP attempts under boot, capture, errors and shutdown; local logs still provide actionable diagnostics.

### 5.3 W3: Remove cloud sync but preserve local Chroma sync

**Beware of naming collision:** `CloudSync` and `ChromaSync` are not the same thing. A naive removal of `src/services/sync/` could destroy the required local vector indexing system.

**Proposed patches:**

- Remove remote sync hub client, remote polling/WebSocket, registration, credentials and sync routes.
- Remove cloud-sync UI and settings keys after mapping migrations/backward-compatibility.
- Keep SQLite durable-write semantics, `ChromaSync`, `ChromaMcpManager` and any local retry/outbox logic required for indexing.
- Ensure a crash can be recovered by rebuilding Chroma from SQLite without network access.
- Decide whether cloud-sync schema columns should remain unused for backward compatibility or be removed in a later migration. **Prefer no destructive migration in first release**.

**Acceptance:** adding old cloud tokens to a test configuration does not enable a network call; local SQLite -> Chroma indexing works and resumes after interrupted writes; user memory remains readable.

### 5.4 W4: Claude-only observer through corporate AWS Bedrock

**Allowed logical provider:** Claude Agent SDK/CLI invoking corporate Bedrock (not direct Anthropic API).

**Do not confuse three identifiers:**

- `CLAUDE_MEM_PROVIDER=claude` names claude-mem's observer implementation.
- `CLAUDE_CODE_USE_BEDROCK=1` tells the Claude Code/SDK environment to use Bedrock.
- AWS Bedrock model ID/inference profile is tenant- and region-specific. Alias `haiku` may work but must be tested in the approved account; do not invent a profile ARN.

**Provider hardening:**

1. Reduce provider factory/registry to a single configured `claude` implementation. Delete Gemini/OpenRouter/CMEM Pro paths once dependencies are traced.
2. Require Bedrock explicitly in observer process; reject Anthropic API/API-base URL overrides.
3. Use an **allowlisted environment builder**, not indiscriminate `process.env` copying and not over-aggressive sanitization.
4. Pass required AWS settings carefully: `AWS_PROFILE`, `AWS_REGION`/`AWS_DEFAULT_REGION`, `AWS_CONFIG_FILE`, `AWS_SHARED_CREDENTIALS_FILE` where applicable, `CLAUDE_CODE_USE_BEDROCK`, and approved proxy/CA variables. The exact allowlist must be grounded in the enterprise configuration.
5. Respect existing AWS SSO credential process and corporate authorization. Do not store AWS tokens in claude-mem settings or logs.
6. Confirm availability of the selected Haiku-class model through actual Claude Code + Bedrock calls. Start with a single approved model and no automatic tier-based provider fallback.
7. Ensure worker and child observer do not invoke recursive memory hooks. Prevent runaway agent loops and queue explosions.
8. Handle expired SSO sessions, denied IAM calls, bad model profiles, throttling, timeouts and network failures explicitly.
9. Ensure no accidental fallback to an Anthropic subscription, direct API key or third-party provider.
10. Observe retries and concurrency. Keep bounded observer workers and non-destructive queue persistence.

**Specific questions to inspect:**

- Does the installed Claude Code environment get Bedrock credentials from `settings.json`, process env, managed policy, or all three?
- Which variables are stripped by `sanitizeEnv()`? Do they include Bedrock flags, AWS profile paths, Git Bash path on Windows, enterprise CA/proxy settings?
- Which Claude CLI path does the worker spawn? Does it inadvertently use a different `claude` executable?
- Can the chosen model identifier resolve to an unintended provider?
- What payloads does the observer send? Can DLP/redaction be applied before the Bedrock request?
- What behavior occurs after 5/50/500 queued tool events and during process restart?

**Acceptance matrix:**

| Test | Expected outcome |
|---|---|
| Valid AWS SSO/profile and approved model | Observation + summary saved |
| SSO expired | Clear failure, no provider fallback or secret logging |
| AWS permission denied | Error surfaced, queued data safely retained |
| Invalid model ID/inference profile | Explicit error, no second provider |
| `ANTHROPIC_API_KEY` present accidentally | Not used by fork observer |
| `OPENROUTER_API_KEY` present accidentally | Not used by fork observer |
| Proxy/CA required | Approved settings propagated, no bypass |
| Child Claude process triggers hooks recursively | Test fails if recursion occurs; guard installed |
| Multiple concurrent sessions | Stable queue, no duplication/data corruption |
| Worker shutdown/restart | Queue/retry semantics verified |

**Potential code areas:** Claude provider/agent, env sanitizer, model resolver, supervisor/worker process spawn, hook logic, queue. The source structure varies by version.

### 5.5 W5: Offline persistent Chroma + local embeddings

**Hard requirements:** Chroma persistence and all embedding computation are local. No account creation, Chroma Cloud, runtime `uvx` download or model download.

**Proposed implementation:**

1. Select and pin specific compatible versions of `chroma-mcp`, `chromadb`, Python and ONNX-related packages based on local checkout compatibility tests.
2. Build/pre-provision a dedicated Python environment at approved build time. **Do not resolve arbitrary packages from `uvx` at runtime**.
3. Invoke the package's local executable or module through an absolute local path, ideally a direct process spawn with an argument array rather than `cmd.exe /c` string interpolation.
4. Use local MCP stdio transport and local Chroma persistent directory.
5. Explicitly disable Chroma anonymous telemetry through supported library settings and environment (e.g. verify `ANONYMIZED_TELEMETRY=FALSE` and the exact Chroma API version; `Settings(anonymized_telemetry=False)` only if exposed/usable by the chosen launcher).
6. Bundle the embedding model locally. The upstream default may use `all-MiniLM-L6-v2` via ONNX; verify actual selected embedding function/model in pinned `chroma-mcp`/`chromadb`.
7. Record model origin, version, license and SHA-256 checksum. Avoid allowing fallback model downloads on cache miss.
8. Place model/cache and Chroma persistence under approved local directories. Decide whether models are bundled or preloaded via IT-managed cache; do not depend on an interactive user's already warm cache.
9. Add fail-closed startup validation for missing packages/model files.
10. Ensure Chroma is a derived index that can be recreated from SQLite; keep deterministic embedding dimensionality and collection naming.
11. Verify process-tree cleanup on Windows during normal exit, crash and repeated restarts.
12. Avoid running a new Chroma server for each Claude Code session; centralize it behind the local worker where feasible.

**Environment toggles worth testing, not sufficient by themselves:**

```powershell
$env:ANONYMIZED_TELEMETRY = "FALSE"
$env:UV_OFFLINE = "1"
$env:HF_HUB_OFFLINE = "1"
$env:HF_HUB_DISABLE_TELEMETRY = "1"
```

Important: `HF_HUB_OFFLINE` is **not a general network firewall** and might not stop Chroma's default ONNX downloader if that component uses its own download implementation. Actual cold-start, no-network tests are mandatory.

**Windows risks to inspect:**

- `uvx` launcher path and Python runtime selection.
- `cmd.exe` quoting of version constraints containing `>=` or `<`.
- Smart App Control/Defender policy against generated/unsigned executables.
- Python 32/64-bit and native `onnxruntime` compatibility.
- File locking of Chroma SQLite/data directories.
- Orphan `python.exe`, `uv.exe` or MCP children.
- Vector-model changes requiring collection re-indexing.

**Acceptance:** On a clean Windows test profile, fully preprovisioned Chroma starts without public internet, indexes a document/observation, answers semantic queries, persists across restart and generates no third-party DNS/HTTP requests. At least one test **deletes the warm cache** and installs only the official offline bundle into the profile.

### 5.6 W6: Local-only installation, plugin identity and generated code

**Goal:** The running plugin is unambiguously the private fork; registration cannot initiate upstream installation or automatic updates.

**Inspect:** plugin manifest, `.mcp.json`, hooks JSON, scripts and binary launchers, upstream marketplace registration, cached plugin paths, version checks, auto-repair, `npx`/`uvx` invocations, build artifact copying.

**Proposed patches:**

1. Rename plugin ID and command namespace to a clearly internal identifier, e.g. `claude-mem-enterprise-local` (subject to manifest constraints).
2. Remove the external `thedotmack` marketplace registration and `autoUpdate: true` behavior.
3. Remove dynamic resolution to upstream cache/marketplace paths. Resolve only into local installed bundle.
4. Remove runtime `npx ... install`, `uvx ...`, GitHub release lookups, auto-repair downloads and update prompts.
5. Ensure `.mcp.json` points at the fork's own server/launcher.
6. Provide a local PowerShell installer with preflight validation, checksum checks, idempotence, dry-run and rollback.
7. During development use official `claude --plugin-dir <local-plugin-folder>` if allowed by enterprise managed settings; do not use this as a workaround for explicit corporate restrictions.
8. Check compiled `.cjs` and UI bundles because a source patch can leave stale generated code.
9. Disable the old installed upstream plugin **only in the approved test environment**, after documenting and backing up prior settings. Do not wipe user memory or the original installation unexpectedly.
10. Provide deterministic versioning and an internal provenance record embedding the commit and build manifest.

**Proposed scripts for the final distributable** (to be implemented, not assumed upstream):

```text
scripts/install-local.ps1
scripts/uninstall-local.ps1
scripts/verify-local.ps1
scripts/diagnose-local.ps1
scripts/build-offline-bundle.ps1
```

**Acceptance:** Installation from a vetted local bundle on a clean approved test profile requires no public service, uses no external marketplace, never runs the upstream plugin, creates local data directories and survives reboot/restart. It must support uninstall/rollback without destructive database removal unless explicitly requested.

### 5.7 W7: Scope isolation, privacy controls and loopback API

**Project identity and cross-session behavior:**

- Confirm how project identity is derived: Git root/path, remote URL, worktree, explicit environment or other settings.
- Use one canonical project resolver across writing, SessionStart, MCP search and Chroma metadata.
- Test two repositories with identical leaf directory names.
- Test two worktrees of a repository with conflicting branch facts; choose explicit desired isolation behavior.
- Test several simultaneous Claude Code sessions in one repository.
- Explicitly filter retrieval by project and relevant agent/session metadata rather than depending solely on LLM selection.
- Make cross-project retrieval intentional, off by default for initial deployment. Do not assume a project filter prevents a malicious same-user local process from reading another project.

**Data minimization:**

- Exclude sensitive paths and common secret files from capture where possible.
- Redact known credential patterns in tool inputs/outputs before durable persistence and before Bedrock observer input (note redaction can be imperfect).
- Keep strict event size limits and avoid logging raw tokens or sensitive request/response bodies.
- Test that private tags/other user privacy syntax, if supported, cannot be bypassed by adjacent tool output.
- Define local retention policy and backup/restore behavior; do not accidentally back up memory to prohibited cloud profile sync.
- Treat retrieved observations as **untrusted historical data**, not instructions or present-tense truth.

**Loopback HTTP/viewer:**

- Bind to `127.0.0.1` only; reject unexpected bind addresses.
- Audit all routes, including destructive routes, setup endpoints, log clearing and configuration mutation.
- Review CORS, Origin/Host validation, DNS rebinding, CSRF, path traversal and local process attack surfaces.
- Ensure viewer JS/fonts/images/CSS are bundled locally and avoid remote content security policy exceptions.
- Consider local per-install authorization for sensitive endpoints if compatible with hooks/MCP; document any residual same-user attack surface.

**Acceptance:** No accidental project mixing in test scenarios; no arbitrary external UI resources; no non-loopback listener; secrets not present in sample logs/observations under known test patterns; sensitive routes restricted appropriately.

### 5.8 W8: Reproducible packaging, SBOM and long-term maintenance

Bundle should contain reviewed artifacts, not compile from arbitrary remote sources at runtime:

```text
claude-mem-enterprise-local/
  plugin/
  runtime/
  python-env/
  models/
  scripts/
    install-local.ps1
    uninstall-local.ps1
    verify-local.ps1
    diagnose-local.ps1
  docs/
    BASELINE.md
    EGRESS-INVENTORY.md
    ARCHITECTURE-LOCAL.md
    RISK-REGISTER.md
    SECURITY.md
    BEDROCK.md
    CHROMA-OFFLINE.md
    INSTALL-WINDOWS.md
    ROLLBACK.md
  checksums.sha256
  THIRD_PARTY_NOTICES.md
  sbom.json
```

- Pin source commit and package lockfiles.
- Review all npm/Python lifecycle scripts/native packages.
- Record the dependency licenses and model licenses. The repo's Apache-2.0 license does not grant automatic unrestricted redistribution rights for all bundled transitive components or models.
- Generate dependency inventory/SBOM and scan it via approved tooling.
- Build in an approved environment with deterministic inputs as far as possible.
- Separate **development/build** network policy from **installed runtime** network policy.
- Keep an update strategy: review/select upstream security fixes manually, re-run the full test matrix; never auto-merge and auto-deploy upstream.
- Document data directory paths, migration, backups and rollback.

---

## 6. Phased delivery plan (P0–P8)

Do **not** combine all phases into one giant patch. The developer reviews the output of each phase before approving the next.

### P0. Repository baseline and safe working state

**Input:** Already cloned repository in Codex project.

**Tasks:**

1. Read `git status --short`, branch, current SHA, tags and uncommitted edits.
2. Never overwrite local user modifications. If changes exist, ask how to preserve them; optionally create a reviewed baseline branch/worktree.
3. Record source commit SHA and whether it is exactly v15.4.0, v15.5.0 or something else. The earlier installed plugin was v15.4.0; current repo may not be.
4. Record `package.json`, lockfiles, toolchain versions, plugin file structure and `AGENTS.md`/repository instructions.
5. Map core data flow, provider registry, hooks, build scripts, plugin installation paths and Chroma manager.
6. Back up existing `~/.claude-mem` only with explicit user authorization; do not read confidential contents or import real production memory for testing.
7. Establish an isolated **test user-data directory** for the fork, separate from installed upstream memory.
8. Run only safe, locally permitted, baseline validation after approval; do not install dependencies yet if supply-chain policy is unclear.

**Artifacts:** `docs/BASELINE.md`, exact source manifest, initial architecture diagram.

**Gate:** Reproducible source baseline known; no existing work lost; test environment separated from production memory.

### P1. Full egress/source/dependency audit

**Tasks:**

1. Trace all external network-capable source paths and process spawns.
2. Identify UI client-side network paths and generated bundles.
3. Inspect npm/Python dependencies, postinstall scripts and native-model downloads.
4. Verify provider-specific auth fallbacks and env sanitization.
5. Trace old marketplace resolution and automatic update behavior.
6. Trace local Chroma telemetry, model download and process lifecycle.
7. Record all targets with data payload/risk/decision/tests.
8. Verify existing upstream issues or docs for suspected v15.4.0 behavior; do not treat stale `main` snippets as checked-out code.
9. Produce a smallest-safe-change dependency graph and patch sequence.

**Artifacts:**

- `docs/EGRESS-INVENTORY.md`
- `docs/ARCHITECTURE-LOCAL.md`
- `docs/RISK-REGISTER.md`
- `docs/PATCH-SEQUENCE.md`

**Gate:** No unresolved high-severity reachable outbound code path. UNKNOWN entries explicitly documented. **No application source edits during the initial P0/P1 task.**

### P2. Remove hosted/cloud/telemetry modules

**Tasks:** W1 + W2 + W3, with small commits per subsystem.

**Tests:** No hosted setup/CMEM Pro/CloudSync/PostHog path; loopback worker and SQLite still operate; provider registry fails closed; leftover credentials do not trigger requests.

**Gate:** Local worker passes existing tests; regression tests against forbidden destinations pass; code and compiled artifacts do not include reachable removed modules.

### P3. Bedrock-only Claude observer

**Tasks:** W4, after P2 provider cleanup. Preserve existing Claude SDK where viable.

**Tests:** Approved SSO/model, expired SSO, bad Region/model/permission, missing credentials, recursive hooks, concurrent requests, queue behavior, no fallback.

**Gate:** A real approved Bedrock observer call generates durable observation/summary, and network logs show only approved traffic.

### P4. Chroma offline and local embeddings

**Tasks:** W5. Freeze Python dependency set and model artifact; remove runtime `uvx` fetch; handle Windows process tree.

**Tests:** Cold-cache offline start, encode/index/query, persistence, restart, no telemetry, no cloud, no download, process cleanup.

**Gate:** Semantic search works on clean Windows test installation with external internet blocked.

### P5. Install/plugin hardening

**Tasks:** W6. Unique plugin, deterministic paths, no marketplace/update, PowerShell scripts.

**Tests:** Dry run, install, re-install, verify, uninstall, rollback, policy-denied scenario, old upstream coexistence tests.

**Gate:** The local fork can be loaded independently of external marketplace and cannot silently execute upstream plugin files.

### P6. Security and reliability hardening

**Tasks:** W7. Project scope, DLP filters, API protection, secret-safe logging, concurrency and recovery.

**Tests:** Project collisions, worktrees, simultaneous sessions, malformed settings, prompt injection regression, secret redaction, loopback binding, route authorization, crash recovery.

**Gate:** All defined security/regression tests green; residual risks documented.

### P7. Dynamic network egress proof and integrated E2E

**Two environments:**

**A. Fully offline local subsystem:** no public internet, mock observer; worker + SQLite + Chroma + local search/viewer must pass with no external attempts.

**B. Bedrock-approved inference:** allow only organization-approved Bedrock/auth/company infrastructure; run actual Claude Code session and observer. Capture connection/process/DNS events using approved EDR/proxy/firewall methods.

Test startup, fresh cache, indexed events, semantic queries, prompts, errors, restarts, exceptions, shutdown and install/upgrade actions.

**Gate:** Actual runtime destinations match approved allowlist; any unexplained destination is a release blocker. A one-time PowerShell `Get-NetTCPConnection` snapshot **does not** prove no egress.

### P8. Distribution, documentation, acceptance, rollback

**Tasks:** W8, generate checksums/SBOM/licensing, sign package if required, provide corporate installation guide, support diagnostics, manual update/release process.

**Gate:** Fresh Windows Cloud PC test profile installs from approved offline bundle, no hosted registration, full E2E functionality, auditable network behavior, intact data, documented rollback.

### 6.1 Delivery-order summary

| Phase | Primary artifact | Must prove | Next phase blocked until |
|---|---|---|---|
| P0 | Baseline + pinned SHA | No user work lost | Actual checkout understood |
| P1 | Network inventory | Egress surface classified | High-risk unknowns investigated |
| P2 | Cloud-free worker | Removed paths do not execute | SQLite baseline still works |
| P3 | Bedrock observer | Approved inference saves memory | No fallback/auth leakage |
| P4 | Offline Chroma | No runtime downloads/telemetry | Cold-start semantic search passes |
| P5 | Local installer | No marketplace/update | Correct fork loaded |
| P6 | Hardened runtime | Scope/privacy/HTTP/concurrency | Security suite passes |
| P7 | Network audit evidence | Unapproved egress = zero observed/enforced | Egress acceptance signed off |
| P8 | Release bundle | Reproducible, reversible install | Enterprise policy approvals complete |

---
## 7. Test strategy, acceptance matrix and release evidence

### 7.1 Testing principles

- Prefer deterministic unit tests for config/provider restrictions, path resolution and forbidden URL blocking.
- Use local fake HTTP endpoints/servers in tests to **prove** that forbidden clients cannot be invoked; do not actually contact forbidden production services.
- Use mocked AWS SDK/Claude provider tests for negative and fault-injection cases; reserve real Bedrock calls for approved E2E.
- Use a disposable local test database and Chroma directory, never real `.claude-mem` user data.
- Exercise all known process starts: installer, launcher, hooks, worker, MCP server, Python Chroma child, viewer, observer child and shutdown.
- For privacy tests, use synthetic tokens, fake secrets and fixture prompts, not real customer data.
- Pin test dependencies and ensure testing itself does not trigger package downloading.
- Monitor network **process trees**, not just the parent `bun.exe`.

### 7.2 Detailed validation matrix

| ID | Layer | Test | Pass condition |
|---|---|---|---|
| T01 | Config | Provider set to missing/unknown provider | Reject before inference; no network |
| T02 | Config | Old CMEM Pro key/cloud token present | No hosted client constructed or called |
| T03 | Config | External base URL supplied | Reject or ignore with explicit error |
| T04 | Config | `worker_host=0.0.0.0` | Startup fails with clear message |
| T05 | Install | Clean local install using offline bundle | No public downloads or hosted setup |
| T06 | Install | Re-run local install | Idempotent; no duplicate hooks or data wipe |
| T07 | Plugin | Existing upstream cache also present | Runtime resolves only private fork |
| T08 | Plugin | Enterprise managed policy denies local plugin | Stops; does not bypass policy |
| T09 | Telemetry | Normal startup, event capture, errors, exit | No analytics/remote crash-report attempts |
| T10 | Hosted | Attempt browser `/setup` or legacy action | No hosted request; deprecated route absent/safe |
| T11 | Cloud sync | Legacy sync credentials exist | No external sync attempt |
| T12 | Bedrock | Correct SSO/profile/Region/model | Observer persists observation and summary |
| T13 | Bedrock | SSO expired | Error, no fallback or secret leak |
| T14 | Bedrock | Access denied / bad model identifier | Correct error, no alternate provider |
| T15 | Bedrock | Unexpected `ANTHROPIC_API_KEY` present | Fork observer does not use it |
| T16 | Bedrock | Approved corporate proxy and CA | Child process uses approved settings |
| T17 | Capture | Secret in synthetic tool output | Sanitized/blocked per approved capture policy |
| T18 | Capture | Very large tool output | Limit applied; no out-of-bounds memory pressure |
| T19 | Capture | Observer hooks recursion attempt | Prevented; bounded process/queue count |
| T20 | SQLite | Concurrent sessions write | No corruption, stable identities |
| T21 | SQLite | Restart during queue processing | Durable state recovered; no silent data loss |
| T22 | Scope | Two same-name repositories | Correct distinct project identity |
| T23 | Scope | Two concurrent worktrees | Defined separation/inheritance behavior |
| T24 | Scope | Unscoped MCP search | Explicit safe default; no unintended cross-project output |
| T25 | Chroma | Cold-cache offline boot | No model/package download attempts |
| T26 | Chroma | Add item, query semantic search | Expected vector result |
| T27 | Chroma | Persist and restart | Index and collection remain valid |
| T28 | Chroma | Missing local model file | Fail closed, no external fetch |
| T29 | Chroma | Disable analytics | No telemetry attempts from Python child |
| T30 | Chroma | Worker crashes/restarts several times | No orphan Chroma/MCP processes |
| T31 | Retrieval | Search -> timeline -> detail | Correct project, useful provenance |
| T32 | Retrieval | Stale memory conflicts with current code | Retrieval is labeled historical; not canonical truth |
| T33 | Viewer | Load all pages with internet blocked | Assets/local API work without external fetch |
| T34 | Viewer | Malformed Host/Origin/CSRF requests | Rejected according to implemented controls |
| T35 | Viewer | Destructive routes | Require applicable local authorization/guard |
| T36 | OS | Windows PowerShell-only invocation | Correct quoting and process paths |
| T37 | OS | Spaces/Unicode in user/repo paths | Startup and index paths remain correct |
| T38 | OS | Normal shutdown/reboot | Clean process exit and durable data |
| T39 | Egress | Fully offline local subsystem with mock model | Zero external connection attempts |
| T40 | Egress | Bedrock E2E with corporate allowlist | Only approved AWS/auth infrastructure endpoints |
| T41 | Supply chain | Runtime missing dependency | Fail clearly; never download |
| T42 | Build | Generated `.cjs` diff and SBOM review | No stale hosted/runtime code unexpectedly included |
| T43 | Backup | Backup/restore SQLite + Chroma | Data recovered; index can be rebuilt |
| T44 | Upgrade | Manually cherry-pick vetted upstream security patch | No reintroduction of cloud provider/telemetry |
| T45 | Security | Prompt injection in historical observation | Retrieved text not treated as high-priority instruction |

### 7.3 Egress evidence package

At P7 retain evidence approved by IT/security:

- Commit SHA, package hash manifest, exact model and dependency versions.
- Runtime process tree and executable paths.
- Timestamped DNS, process network and/or proxy/EDR events for a bounded test window.
- Approved destination allowlist (host/port/protocol/service rationale).
- Captures for idle startup, initial SessionStart, tool activity, summarization, semantic search, local viewer, error handling and shutdown.
- Proof of blocked/unattempted forbidden hosts, or negative tests with monitoring that could have detected them.
- Documented residual limits of the monitoring method.
- Explicit signoff, not an assertion of absolute mathematical proof of zero traffic.

**Warning:** A single `Get-NetTCPConnection` snapshot can miss short-lived requests. It also does not identify hostnames or payloads; use approved enterprise tooling for stronger evidence.

### 7.4 Performance, quality and operational evals

After functional/security acceptance, assess whether memory actually helps engineering work:

- Observation generation success rate and failure reasons.
- Queue depth and oldest-event age under concurrent sessions.
- Median/P95 observer latency and Bedrock token/cost usage.
- SessionStart injection latency and token budget.
- Retrieval precision@5 for known past decisions.
- Cross-project contamination rate (target 0 in isolated-mode tests).
- Stale-memory citation rate vs current code state.
- Chroma query latency, CPU/RAM, index growth.
- Storage growth by `tool_uses`, observations, logs and vectors.
- Recovery/re-index duration and backup integrity.
- End-to-end repeat-investigation time and engineering task outcomes.

Do not recommend switching embedding model or observer model until these metrics show the current design fails the user requirements.

---

## 8. Windows PowerShell runbook for the **initial audit only**

These commands are intentionally **read-only**, apart from creating documentation in subsequent approved Codex tasks. Run in the repository already cloned in the Codex environment. No network call or dependency install should be performed merely to audit.

### 8.1 Confirm location, version, status

```powershell
Get-Location
$PSVersionTable.PSVersion

Get-Command git,node,npm,bun,python,uv,uvx,claude -ErrorAction SilentlyContinue |
    Select-Object Name,Source

git rev-parse --show-toplevel
git status --short
git branch --show-current
git rev-parse HEAD
git describe --tags --always --dirty

Get-ChildItem -Name
```

Do not automatically switch to `v15.4.0`. If the current tree is newer or contains changes, Codex should first document the situation and propose safe branch/worktree options.

### 8.2 Find plugin and build entrypoints

```powershell
Get-ChildItem -Recurse -File -Include package.json,plugin.json,hooks.json,.mcp.json,AGENTS.md |
    Select-Object FullName

if (Test-Path .\package.json) {
    $pkg = Get-Content .\package.json -Raw | ConvertFrom-Json
    $pkg | Select-Object name,version,scripts
}

if (Test-Path .\plugin\.claude-plugin\plugin.json) {
    Get-Content .\plugin\.claude-plugin\plugin.json -Raw
}
```

`Get-ChildItem -Recurse` can be slow if `node_modules` is already installed. Codex may narrow it to tracked files (`git ls-files`) instead; do not search confidential external directories or user profiles without approval.

### 8.3 Static suspicious API patterns

```powershell
# Inspect source endpoints and first-party network clients.
git grep -n -I -E 'https?://|wss?://|posthog|cmem\.ai|cloud.sync|telemetry'

# Find process launchers and runtime dependency installers.
git grep -n -I -E 'fetch\(|WebSocket|spawn\(|exec\(|execFile\(|uvx|npx|npm install|pip install'

# Look for plugin registrations, installers, update jobs.
git grep -n -I -E 'marketplace|autoUpdate|version.check|oauth|setup|hosted|cloud|update'

# Find Chroma and embedding configuration.
git grep -n -I -E 'Chroma|chroma|embedding|MiniLM|ONNX|ANONYMIZED_TELEMETRY'
```

Expected false positives: documentation URLs, test fixtures, local HTTP routes and harmless string literals. Classify by reachability, not string presence.

### 8.4 Inspect model/Bedrock handling

```powershell
git grep -n -I -E 'CLAUDE_CODE_USE_BEDROCK|AWS_PROFILE|AWS_REGION|AWS_DEFAULT_REGION|AWS_CONFIG_FILE|AWS_SHARED_CREDENTIALS_FILE'
git grep -n -I -E 'sanitizeEnv|ANTHROPIC_API_KEY|OPENROUTER_API_KEY|CLAUDE_MEM_PROVIDER|CLAUDE_MEM_MODEL'
```

When reporting environment variables, do **not** print tokens or full credential contents. Reporting the *names* of variables and their safe applicability is sufficient for initial P1.

### 8.5 Inspect version-specific upstream docs and build outputs

At this stage, read existing local documentation and tests; record differences from this handoff. Do not start `npm install`, `uvx`, `npx` or `bun install` until the build/supply-chain policy is approved. Do not assume the repository's default `npm run build` is side-effect-free; inspect script definitions first.

### 8.6 Repository protection guidance

- Keep original checkout/branch untouched until P0 is approved.
- Prefer a new `enterprise/local-only` feature branch **after** confirming repository state.
- Commit one concern at a time, with tests and a rollback note.
- Avoid modifying `.claude` managed organization settings or machine-wide firewall policy without authorization.
- Never paste real corporate credentials, tokens, live source text or proprietary prompts into audit documents.

---

## 9. Codex operating contract and first handoff task

### 9.1 Non-negotiable instructions for Codex

1. Inspect local files, local repo instructions (`AGENTS.md`, etc.), branch and SHA before recommending changes.
2. Treat this document as **requirements and hypotheses**, not source truth. Prefer repository code and tests over remembered upstream docs.
3. Do not browse/fetch/install unless the task and enterprise policy explicitly allow it.
4. Do not run arbitrary curl-to-shell / PowerShell `irm | iex` installers.
5. Do not delete or overwrite existing user memory, plugin installs, AWS configuration, local credentials, project changes or enterprise policy.
6. Do not change application source in Task 01 (P0+P1); first deliver evidence-based audit artifacts.
7. Do not assume a clean checkout, working dependencies or administrative rights.
8. No unsupported claims about zero telemetry or guaranteed security.
9. Label uncertainties and preserve exact code evidence for each claim.
10. Plan changes in independent, regression-tested commits with explicit user approval between phases.
11. Treat both source and binary artifacts as supply-chain inputs; investigate package lifecycle scripts and generated output.
12. Security boundaries must be enforced by code/config validation and corporate networking, never only by prompt instructions to Claude.

### 9.2 Ready-to-paste Task 01 prompt for Codex

```text
ROLE: Principal engineer and security-focused repository auditor.

CONTEXT:
You are in an already-cloned local copy of thedotmack/claude-mem.
Read CLAUDE_MEM_ENTERPRISE_LOCAL_INITIAL_PLAN.md first.
Do not assume this checkout is exactly upstream v15.4.0 or that proposed
paths and behavior in the plan match the current branch.

GOAL:
Prepare a precise, evidence-based architecture/security handoff for a
Windows Enterprise local-only fork of claude-mem. Runtime integration must
be Claude Code only, via corporate AWS Bedrock SSO/AWS_PROFILE. Keep
SQLite/FTS5 and local persistent Chroma/ONNX. Remove or replace hosted
setup, CMEM Pro, cloud sync, PostHog, third-party observer providers,
remote registration/marketplace/update, runtime downloads and other
unapproved network clients. Bedrock/auth infrastructure is the only
approved category of external model traffic, subject to enterprise policy.

TASK SCOPE: P0 + P1 ONLY. DO NOT MODIFY APPLICATION SOURCE.

1. Read local repo instructions and inspect git status, SHA, branch, tags,
   package scripts, lockfiles and plugin/worker structures. Preserve any
   existing uncommitted changes. Do not automatically checkout or reset.
2. Map the real capture -> worker -> observer -> SQLite -> Chroma ->
   retrieval pipeline at this checkout.
3. Locate every reachable network call and background process: URL
   clients, dynamic destinations, installed packages, postinstall scripts,
   hosted browser setup/reveal, PostHog, cloud sync, CMEM Pro, external
   provider fallbacks, Chroma telemetry, model downloads, uvx/npx,
   marketplace/update, browser external assets and error reporting.
4. Trace auth/environment propagation of Claude Code Bedrock observer,
   including AWS_PROFILE, SSO, Region, model aliases, proxy/CA,
   environment sanitization, Windows launchers and recursive hooks.
5. Analyze SQLite as canonical storage, local Chroma synchronization,
   project identity/scope and multiple concurrent Claude Code sessions.
6. Inspect relevant compiled/runtime bundles as well as TypeScript source.
7. For each network/path finding, record exact file/line/function, trigger,
   caller, destination, payload, process, risk, disposition (remove,
   replace, retain), dependency impact, test and evidence quality.
8. Identify source-level discrepancies with the initial plan, and update
   the design recommendations instead of forcing assumed paths.
9. Propose a small, ordered commit-by-commit patch sequence with tests,
   prerequisites, acceptance criteria, rollback and unresolved questions.

DELIVERABLES:
- docs/BASELINE.md
- docs/EGRESS-INVENTORY.md
- docs/ARCHITECTURE-LOCAL.md
- docs/RISK-REGISTER.md
- docs/PATCH-SEQUENCE.md

EVIDENCE LABELS:
VERIFIED IN CHECKOUT / DOCUMENTED UPSTREAM / INFERRED / UNKNOWN.

SAFETY:
No source edits, network downloads, package installs, service restarts,
registry/marketplace changes, user-data reads, destructive commands or
AWS inference without explicit permission. Do not print secrets.

STOP CONDITION:
Return a concise P0/P1 audit report with highest-risk paths, gaps, exact
source citations and the recommended first implementation commit. Ask
for approval before making source changes.
```

### 9.3 What Codex should report back after Task 01

1. Exact commit, tag and working tree status.
2. Which paths/features in this plan exist or do not exist.
3. Top 10 security/egress risks with concrete source links/locations.
4. Specific observed implementation of hosted browser setup and why HTTP 503 occurred, if code supports it.
5. Whether PostHog/CMEM Pro/cloud sync can be removed without breaking local memory.
6. Actual Bedrock observer invocation and credential propagation.
7. Actual Chroma version/embedding function, installation method and offline requirements.
8. Precise Windows plugin launcher/registration behavior.
9. Which dependencies and processes can still initiate network traffic after a source-only patch.
10. The smallest safe first code change, tests to add, and explicit approval request.

---

## 10. Decisions and clarifications still required

These decisions are intentionally open. Work may progress through P0/P1 without answering all of them.

### D1. Offline runtime versus fully offline build

**Recommended default:** Approved connected build/staging system may fetch **reviewed, pinned, hash-verified** packages and ONNX model artifacts. Delivered Windows runtime makes no downloads. If absolutely no build-time external network is permitted, prepare and sign a full offline dependency bundle from a separate authorized supply-chain process.

**User confirmation needed:** Which repositories/artifact servers are approved for sourcing Node/Python/Bun/ONNX dependencies, and can an internal artifact mirror be used?

### D2. Observer data allowed to leave Cloud PC for Bedrock

**Recommended default:** Use only enterprise-approved Bedrock accounts/Regions/models, and implement a capture policy before observer submission.

**User confirmation needed:** Are raw tool outputs, full prompts, SQL results and proprietary source excerpts allowed to reach the approved Bedrock model, or must they first be redacted/filtered? This may materially alter capture design.

### D3. Project security scope

**Recommended default:** One user-local memory instance per permitted security domain, strict project filtering in ordinary retrieval. For different clients/tenants with contractual isolation, separate OS identity/container and storage/processes, not merely a `project` column.

**User confirmation needed:** Are repositories all inside one corporate confidentiality boundary or do client/team isolation requirements exist?

### D4. Git worktree identity

**Recommended default:** Keep worktree-aware separation when branch facts may conflict, while allowing narrowly scoped parent-repo retrieval only after verifying project resolver behavior.

**User confirmation needed:** Should multiple worktrees of one repository share one memory, or have branch-specific memories?

### D5. Installed upstream plugin coexistence

**Recommended default:** Disable upstream plugin in the *test* Claude Code session and run the private fork against a fresh test data directory. Preserve the original installation/data until migration and rollback are validated.

**User confirmation needed:** Which existing installed plugin registrations are managed by IT vs user-level, and can the private plugin be loaded through `--plugin-dir`?

### D6. Local worker API and viewer

**Recommended default:** Keep a loopback-only viewer for observability with extra route guards. If policy prefers a headless implementation, drop the viewer and reduce HTTP surface further.

**User confirmation needed:** Is a browser-based local viewer required, or is CLI/MCP retrieval sufficient?

### D7. Model selection and cost

**Recommended default:** Start with a single approved Bedrock Haiku-class model/inference profile, without tier routing. Add mixed-model routing only after reliability/cost/quality evaluation.

**User confirmation needed:** Exact allowed AWS Region, SSO profile conventions and approved model or inference profile. No need to share secrets.

### D8. Data retention and backup

**Recommended default:** Retain no more sensitive raw tool data than necessary, encrypted disk, corporate-approved backup destination, documented deletion/rebuild and separately protected test fixtures.

**User confirmation needed:** Required retention, whether roaming profile/OneDrive sync is enabled, and whether local SQLite/chroma data may be backed up by enterprise tooling.

---

## 11. Risk register seed

| Risk | Likelihood / severity (preliminary) | Mitigation | Evidence/test |
|---|---|---|---|
| Hosted setup sends history | Known feature / High impact | Remove hosted flow | No reachable route/network attempt |
| Telemetry in dependencies | Medium / High | Inspect + disable/remove + network deny | Child-process egress monitoring |
| Default Chroma model download | High for cold cache / Medium-High | Ship local model and preflight check | Cold-cache offline test |
| Runtime `uvx` invokes PyPI | Medium-High / High | Absolute preinstalled Python entrypoint | Runtime trace; no package manager invocation |
| Bedrock env stripped in child | Known class / High | Verified env allowlist and SSO test | E2E observation persisted |
| Unwanted observer fallback | Possible / High | Single provider, fail closed | Invalid-auth tests |
| Duplicate upstream and fork hooks | Possible / High | Unique plugin ID, isolation test | Inspect active plugin paths/processes |
| Unsafe local HTTP routes | Possible / Medium-High | Loopback, route audit, local auth | Host/Origin/security tests |
| Cross-project leakage | Known architecture class / High | Canonical project ID + scoped retrieval | Same-name repo/worktree tests |
| Secrets persisted in raw tool use | High if no filters / High | Capture exclusion and redaction | Synthetic-secret fixtures |
| Recursive observer hooks | Known issue class / High | Child env guards, process limits | Recursion/queue stress test |
| Chroma orphan processes | Known Windows class / Medium | Process-tree lifecycle cleanup | Repeated restart monitoring |
| Windows launcher quoting | Medium / Medium | Direct arg-array spawn, path tests | Spaces/Unicode/shell-metachar tests |
| SQLite/Chroma partial failure | Possible / Medium | SQLite canonical, rebuild index | Crash/recovery tests |
| Build artifacts retain old code | Medium / High | Clean rebuild and bundle inspection | Artifact diff/source map checks |
| Upstream security fix missed | Ongoing / Medium-High | Manual tracked patch review | Version/patch review checklist |
| Regulatory/enterprise policy conflict | Unknown / High | IT review, no bypass | Approval evidence |

These ratings are hypotheses only; update them from concrete source/evidence during P1.

---

## 12. Reference materials and verification queue

### 12.1 Primary project and platform

- [claude-mem repository](https://github.com/thedotmack/claude-mem)
- [claude-mem releases](https://github.com/thedotmack/claude-mem/releases)
- [claude-mem configuration docs](https://github.com/thedotmack/claude-mem/blob/main/docs/public/configuration.mdx)
- [claude-mem telemetry docs](https://github.com/thedotmack/claude-mem/blob/main/docs/public/telemetry.mdx)
- [claude-mem installation docs](https://github.com/thedotmack/claude-mem/blob/main/docs/public/installation.mdx)
- [SettingsDefaultsManager source](https://github.com/thedotmack/claude-mem/blob/main/src/shared/SettingsDefaultsManager.ts)
- [Worker source (candidate)](https://github.com/thedotmack/claude-mem/blob/main/src/services/worker-service.ts)
- [ChromaMcpManager source (candidate)](https://github.com/thedotmack/claude-mem/blob/main/src/services/sync/ChromaMcpManager.ts)
- [Official Claude Code: AWS Bedrock](https://code.claude.com/docs/en/amazon-bedrock)
- [Official Claude Code: plugins](https://code.claude.com/docs/en/plugins)
- [Official Claude Code: memory](https://code.claude.com/docs/en/memory)
- [Chroma documentation](https://docs.trychroma.com/)
- [chroma-mcp source repository](https://github.com/chroma-core/chroma-mcp)

**Version warning:** Paths ending in `/blob/main/` reflect moving upstream files. These links are **reference leads**, not immutable evidence. During P0 resolve equivalent paths on the chosen commit and use commit-specific URLs in actual audit reports.

### 12.2 Upstream issues worth checking against exact code

Use issue history as evidence of failure classes, **not** proof that the current checkout is still vulnerable:

- [Project identity normalization](https://github.com/thedotmack/claude-mem/issues/3608)
- [Cross-project MCP search behavior](https://github.com/thedotmack/claude-mem/issues/3764)
- [Historical cross-project search issue](https://github.com/thedotmack/claude-mem/issues/1911)
- [Bedrock-related behavior: search issues](https://github.com/thedotmack/claude-mem/issues?q=Bedrock)
- [Chroma issues on Windows](https://github.com/thedotmack/claude-mem/issues?q=Chroma+Windows)
- [Windows / Python / uvx issues](https://github.com/thedotmack/claude-mem/issues?q=uvx+Windows)
- [Recursive observer/queue issues](https://github.com/thedotmack/claude-mem/issues?q=recursive+observer)
- [Hosted setup issues](https://github.com/thedotmack/claude-mem/issues?q=hosted+setup)

### 12.3 Claims requiring source confirmation in the cloned checkout

| Claim from preliminary review | What Codex must verify |
|---|---|
| Interactive hosted Reveal can upload filtered historical prompts | Exact route/client, payload and trigger |
| Installer defaults or nudges to CMEM Pro | Exact CLI prompts and version behavior |
| PostHog telemetry is present | Init, env flags, sinks and dependency reachability |
| Cloud sync transmits prompts/narratives | Exact serialization and worker triggers |
| Chroma runs via `uvx` | Actual launcher and dependency versions |
| Default Chroma ONNX model may download | Selected embedding function, cache and downloader |
| Chroma telemetry defaults/flags | Library version + effective runtime settings |
| Bedrock credentials/flags passed through sanitization | Actual spawn environment and SDK behavior |
| `autoUpdate` and upstream cache resolver exist | Installer/manifest resolution in chosen checkout |
| Project filters can be optional/unscoped | Actual MCP API and default request handling |
| Local viewer exposed on worker port | Routes, binding and authentication |
| v15.5.0 includes security change to `/api/logs/clear` | Actual release diff; cherry-pick decision |

If a claim is not supported, update/remove it. **Do not assume that filenames or behavior observed in a prior upstream version survive unchanged.**

---

## 13. Definition of Done for the entire project

Do not describe the fork as 'fully local', 'zero telemetry' or 'enterprise-safe' until all of these are true:

- [ ] Exact source SHA, build SHA/checksums, model versions and lockfiles are pinned.
- [ ] No reachable hosted onboarding, CMEM Pro, PostHog or cloud-sync code remains in packaged runtime.
- [ ] Only Claude Code hook/MCP integration is active.
- [ ] Observer uses only the organization's approved Bedrock + SSO path.
- [ ] Missing Bedrock credentials/model fail closed, without fallback.
- [ ] SQLite/FTS5 captures sessions and provides durable historical retrieval.
- [ ] Chroma and ONNX embeddings are persistent and entirely local.
- [ ] Chroma starts from a cold cache with no internet or model download.
- [ ] All runtime dependencies and model files are pre-provisioned and verified.
- [ ] No external marketplace, background update or runtime `npx`/`uvx` package resolution.
- [ ] Plugin launches the fork's own generated code, not stale cached upstream files.
- [ ] Worker is loopback-only and local routes are reviewed.
- [ ] Cross-project and multi-session behavior passes regression tests.
- [ ] Synthetic secret capture, logs and observer submission are tested.
- [ ] Windows PowerShell deployment/restart/uninstall/rollback works on clean profile.
- [ ] Network tests demonstrate only approved AWS/auth/company endpoints with the inference path enabled, and zero unapproved destinations in all tested paths.
- [ ] Security and enterprise approval, residual risks and evidence limits are documented.
- [ ] SBOM, third-party licenses, dependency checksums, installation guide and rollback plan are supplied.

---

## 14. Immediate next action

**Do this next, and only this:** Give Codex this file in the already cloned repository and assign **Task 01 (P0 + P1)** from Section 9.2. Codex should first return a source-grounded audit and patch sequence, not start deleting modules.

Only after reviewing `docs/EGRESS-INVENTORY.md`, `docs/ARCHITECTURE-LOCAL.md` and `docs/RISK-REGISTER.md` should the user approve implementation work on the first removal subsystem.

**Preferred engineering principle:** preserve a small, proven capture/retrieval core; physically remove disallowed network-capable features; make external model access explicit and auditable; prove offline local operation and approved Bedrock-only inference with tests.
