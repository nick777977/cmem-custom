# User-controlled LLM profiles and task routing

Accepted target contract, 2026-11-02, decisions A19/A20. PROFILE-06A and
PROFILE-06B implement this configuration for the local worker. A28 requires an
explicit profile in the private Codex launcher.

A27 clarification (2026-11-04): Codex/ChatGPT login is the first local live-test
route. Claude Code Enterprise through AWS Bedrock/AWS SSO remains a required
supported route; preserve other explicitly selected compatible adapters. Host
integration and the background memory model are distinct selections. Do not hardwire
Codex test choices into the installer or let host login implicitly select observer
provider/model. Build/install/run are ordinary-user Windows operations, no admin/UAC.
Necessary dependency and local embedding-model downloads/bootstrap are permitted;
special native OS sandbox/CI proof is deferred from first functional delivery.
The Codex CLI check is sufficient for the current Codex target. Claude Code
on the intended Windows instance is next. Its local plugin loading and the
worker's generative profile are separate checks. Any future live worker
check needs a confirmed model, auth route and budget. The historical Luna
proposal spent zero turns.
[Decision and prior scope](memory/DECISIONS.md#a30--separate-model-roles-and-confirm-the-live-profile-2026-11-10)
· [Windows Bedrock preparation](WINDOWS-LOCAL-SETUP.md#claude-code-and-bedrock-preparation).
Supersedes the Bedrock-only target in the supplied initial plan and old session
prompts. Historical evidence/commits remain unchanged. Dependencies and execution
waves live only in [roadmap](../roadmap.md); runtime evidence requirements live in
[VALIDATION](VALIDATION.md). No permission to read credentials or run models is granted here.

## Outcome and scope

The owner chooses exactly where each model task runs and can see the effective
provider, model and auth mode before enabling it. Bedrock remains a supported
route to verify separately. Preserve existing Claude Code and Codex integrations,
provider adapters, memory/viewer behavior and local SQLite/Chroma architecture.
Do not replace working SDKs/providers just to introduce configuration flexibility.

Remote inference is allowed only through explicitly enabled owner-configured profiles
and approved auth/infrastructure routes. An explicitly selected Anthropic/OpenAI/
other service is an intentional external provider; an unselected gateway, model or
account is forbidden. No CMEM account, trial, plugin subscription, hidden free model,
model discovery request, telemetry or cloud corpus sync is required. Provider access
itself can still require the owner's account, entitlement or API billing.

This is configurable model routing, not a promise that every adapter supports every
model, API protocol, credential type or SSO implementation. Unsupported combinations
must be rejected locally before sending input. Keep technical compatibility and
organization approval separate from the user's choice of a profile.

## Separate the host, observer and embeddings

| Layer | Responsibility | Policy |
|---|---|---|
| Interactive host | Claude Code/Codex session where the owner works | Existing host integration remains; its login/model does not silently choose observer routing |
| Memory observer | Extract observations, compress fields, create session summaries | Explicit default profile/model, with optional explicit role overrides |
| Other model jobs | Knowledge/standalone work, viewer refresh, copy and judges | Same profile policy; no independent detector or preset may bypass it |
| Embeddings | Turn documents/queries into vectors for Chroma search | `paraphrase-multilingual-MiniLM-L12-v2` in the local Chroma sidecar. Runs on CPU through ONNX. Setup can obtain the packages and weights under A27. |
| Persistence/API/viewer | Canonical SQLite/FTS5, derived Chroma, local UI and spool | Local; existing identity/sharing/filter semantics retained |

A user may deliberately make the observer match the host's provider, or choose a
different configured profile. Initial implementation should use one explicit global
observer default plus role overrides, reusing existing config. Do not invent automatic
per-project/worktree/host credential selection or change memory identity. Per-host
routing, if needed later, must be explicit and separately scoped.

For example, the worker can turn a tool event into a short observation and
write it to SQLite. MiniLM then embeds that text locally. When the user
searches, MiniLM embeds the query locally and Chroma finds similar records.
The verified loopback run used an imitation of the first step and the real
local encoder for both embedding operations. Daily use of automatic observation
and summary generation requires a compatible generative worker profile chosen
by the owner. The staged artifact check did not choose that profile.
[Exact-artifact evidence](handoffs/VERIFY-11-LOCAL.md).

Owner clarification, 2026-11-12: the development Claude Code is globally
npm-installed and launched as `claude` from Windows PowerShell with Bedrock/
AWS SSO. This does not select the memory worker's generation route. Explain
that the worker is the local background application process; a generative
profile writes observations/summaries, while MiniLM embeds text for search.
The owner requests that explanation before choosing. No live worker model,
provider or budget was selected by this clarification. Local embedding asset
preparation is a separate setup step; npm dependency installation alone does
not certify that those runtime/model assets are prepared on the target.

The original Claude-Mem already used a generative observer. "Separate role"
means additional requests, not a mandatory different model, account, service
or subscription. One explicit default can reuse the owner's chosen Bedrock
account/model for observation and summary; target support is still unverified.
The fork's real change is explicit profile admission instead of upstream's
implicit defaults/auth discovery/fallback. [Source comparison and explanation](handoffs/UPSTREAM-MEMORY-FLOW.md).

## Profile contract

The table defines the contract for all retained model jobs. The worker and its
background jobs use the [settings representation below](#main-worker-configuration).

| Field/concept | Requirement |
|---|---|
| Stable local ID and label | Chosen by user; labels never used as destinations or auth sources |
| Adapter and protocol | Claude SDK/CLI, Codex app-server, existing compatible HTTP adapter, etc.; explicit supported combination |
| Destination | Provider route/base URL or AWS Region/inference profile, including a deliberately approved corporate gateway when used |
| Auth mode/reference | Exactly one intended account/credential path; no secret values in logs, diagnostics, exported settings or tracked examples |
| Default model | Explicit choice before sends; no implicit vendor/preset/free/cheapest or CLI-default model for paid/data-bearing work |
| Allowed role models | Only explicit role overrides; aliases/tiers resolve before send inside this set |
| Enabled/validated state | Distinguish configured, locally validated, live-tested, unavailable and disabled; local validation is not live proof |
| Request options | Bounded timeout/retry/concurrency/token budget, reasoning options only if supported; normal retries keep the same resolved profile/model |

Auth references may resolve to existing env/config or credential mechanisms with
scoped read permission. Reuse a safe existing implementation; do not copy all host
settings/credentials into a worker or probe accounts just because a CLI is installed.
A profile must not inherit another profile's API key, OAuth token or AWS variables.
Keep approved proxy/CA support without broad credential/environment inheritance.

Changing the endpoint requires revalidation of credential binding. Reject credentials
that belong to another service; do not follow cross-origin redirects carrying auth or
content. No API key, OAuth token, query-secret URL or raw memory enters diagnostics.
Exact endpoint/network approval is profile-specific; do not invent AWS/auth allowlists.

## Main worker configuration

`CLAUDE_MEM_MODEL_PROFILES` accepts a JSON object in `settings.json`, including
the existing `env` wrapper. The process environment accepts the same object as
a JSON string and takes precedence over the entire file value. The private
Windows launcher accepts this object with `--profile` and passes through only
the API key references that the selected profiles name.

```json
{
  "default": {
    "id": "local-test",
    "provider": "openai-compatible",
    "model": "synthetic-observer",
    "auth": "none",
    "endpoint": "http://127.0.0.1:43984/v1"
  },
  "summary": {
    "id": "local-summary",
    "provider": "openai-compatible",
    "model": "synthetic-summary",
    "auth": "none",
    "endpoint": "http://127.0.0.1:43984/v1"
  }
}
```

`default` is required. The override keys are `observer`, `summary`,
`compression`, `refresh`, `copy`, `requestJudge`, `focusJudge`, `knowledge`
and `telegramWrapup`. Each override is a complete profile. Omission inherits
the default. Optional jobs accept the string `"off"`. An invalid override
stays paused. A missing or invalid default blocks admission. An invalid
observer selection also blocks the session generator. An unavailable compressor
keeps the existing local field truncation.

| Provider | Auth | Additional required fields and binding |
|---|---|---|
| `openai-compatible` | `api-key` | `endpoint`, `keyEnv`. The endpoint serves chat completions. |
| `openai-compatible` | `none` | `endpoint` on `127.0.0.1`. |
| `openrouter` | `api-key` | `endpoint`, `keyEnv`. Select a single model and a chat-completions endpoint. |
| `gemini` | `api-key` | `keyEnv` bound to `https://generativelanguage.googleapis.com/`. |
| `claude` | `api-key` | Absolute Claude `executable` and `keyEnv` bound to `https://api.anthropic.com/`. |
| `claude` | `claude-login` | Absolute Claude `executable` and selected `authHome` with usable native OAuth credentials. Windows and Linux use the selected directory's `.credentials.json`. |
| `claude` | `aws-sso` | Absolute Claude `executable`, AWS CLI `awsPath`, `awsConfigFile`, selected `awsProfile` and `region`. Select a Bedrock model ID or inference-profile ARN. The selected IAM Identity Center profile supplies temporary credentials. |
| `codex` | `chatgpt` | Absolute Codex `executable` and selected `authHome` with native ChatGPT login. |

Every profile also requires a lowercase local `id`, `provider`, `model` and
`auth`. Use a concrete model identifier accepted by the selected adapter.
On Windows the native executable fields require local drive paths to `.exe`
files. Profile API keys stay in the worker process environment. For a
`keyEnv` value of `CMEM_PROFILE_KEY_WORK`, set that variable to the key and
`CMEM_PROFILE_KEY_WORK_ENDPOINT` to the approved base URL or fixed provider
origin. Changing the destination requires updating the binding. HTTP is
accepted on `127.0.0.1`. Use HTTPS elsewhere. The HTTP adapters refuse
redirects and profile URLs reject embedded credentials, query strings, fragments
and CMEM endpoints. The named AWS SSO profile should already be signed in using
the normal AWS mechanism. The worker resolves that profile's short-lived
credentials through AWS CLI `configure export-credentials`.
[AWS CLI reference](https://docs.aws.amazon.com/cli/latest/reference/configure/export-credentials.html).

Legacy `CLAUDE_MEM_PROVIDER`, provider model defaults, key pools, tier aliases
and quota-fallback settings do not enable local worker inference. To migrate,
write the explicit profile and selected auth reference. Existing settings and
SQLite rows need no schema migration. A repaired profile can resume queued
work on the next event or through the existing local processing retry.

`GET /api/health` exposes `ai.roles` with the effective profile ID, model,
provider, auth, inheritance and configuration state. Failures use safe
categories. Credentials, auth directories, endpoints and raw transport errors
stay out of this status. `configured` describes local selection. Native login
availability and remote entitlement are checked by the selected transport.
In `/viewer`, **Settings → Local runtime** displays the effective roles from
this response. The panel is read-only. Edit `CLAUDE_MEM_MODEL_PROFILES` in
the worker settings or environment, then recheck status. The **Advanced**
provider controls are legacy settings. The panel reports the local Chroma
embedding and query status separately from the worker and host model choices.
See [PROFILE-06A](handoffs/PROFILE-06A.md) and [PROFILE-06B](handoffs/PROFILE-06B.md)
for the evidence boundaries.

### Background capability and migration

| Role key | Local worker behavior |
|---|---|
| `refresh` | One profile per run across goals, grouping, review, focus placement and story. Claude can use Read, Grep and Glob inside the ledger only. Other adapters receive the prepared evidence inline and have no file tools. The worker runs the existing validators and saves the result. |
| `copy` | Uses the selected text adapter and the existing copy validator and cache. Legacy copy-provider and copy-model settings cannot select a model. A legacy copy opt-out remains effective until an explicit `copy` override. |
| `requestJudge`, `focusJudge` | Each requires an override using `openrouter` or `openai-compatible` with the full compatible endpoint ending in `/decisions`. Set the explicit model and bind any key to that exact URL. A Decisions endpoint is unsupported for text roles. If a judge is unavailable, the existing local rules and separately selected refresh steps still apply. |
| `knowledge` | Requires the selected Claude route because prime and query resume a local SDK conversation. Prime an existing corpus once under the selected profile before asking it questions. Legacy sessions and sessions for another profile stay stored until a successful prime replaces their binding. |
| `telegramWrapup` | Reports `unsupported_capability` under the local-only delivery policy. Stored summaries remain local. The formatter is withheld before any model or Telegram call. |

An inherited `refresh` or `copy` profile can send its normal task input to the
selected model. Set the role to `"off"` to pause it. The existing
`CLAUDE_MEM_WORK_VIEW_AUTO_REFRESH=false` setting stops scheduled refresh.
Refresh never loads host plugins or MCP. The local worker and interactive host
retain their existing memory search entrypoints.

## Roles and effective settings

One default covers ordinary use. Advanced settings expose which task uses which
profile/model; no need to force users to configure every role separately.

| Logical role | Source scope / expected policy |
|---|---|
| observer | Observation extraction and observer conversation |
| summary | Session summary; inherits observer default unless explicitly overridden |
| compression | Field/history compression; inherits observer default unless explicitly overridden |
| standalone / knowledge | Retained standalone prompts/KnowledgeAgent; same resolved-policy boundary |
| viewer refresh | Existing refresh agent tasks; preserve permitted file-tool scope and local results |
| viewer copy | Human-readable summary/copy generation; same policy, preserve existing cached content on failure |
| viewer judges | Request/focus/grouping decisions; no hardcoded Jev/OpenRouter model or separate endpoint default |

The table uses logical names. The configuration section defines the setting keys.
The local-only delivery policy leaves connector-only inference unavailable.

Settings/status must show role -> effective profile -> model -> auth mode, inheritance
and disabled/error state. Secret values never appear. Reuse existing settings/status
surfaces; add only needed fields and labels. Do not create a separate dashboard or
redesign viewer. Clearly distinguish host model, observer model and embedding model.
For optional jobs, explicit off is visible. A missing required observer pauses relevant
work without falsely reporting generated/indexed memory; preserve pending queue/data.
No silent disabling of a retained feature to avoid implementing its configured route.

Example intent (not executable config):

| Role | User selection | Effective behavior |
|---|---|---|
| All default roles | work-bedrock + owner-selected model | All model tasks use that configured Bedrock/auth route |
| summary override | personal-codex + owner-selected model | Only summary uses this explicitly chosen Codex login/model |
| viewer copy override | direct-openai + owner-selected model | Only copy uses the explicit OpenAI-compatible API route/key |
| Remaining roles | inherit | Use the displayed default; never a preset provider discovered elsewhere |

No specific current model ID is prescribed; verify supported IDs/parameters on the
chosen account when live tests become possible. No model-list probing during startup.

## Provider retention and compatibility matrix

Target capability rows below describe work to preserve/validate, not successful runtime tests.

| Route | Existing evidence at source 48feeab56 | Target / remaining validation |
|---|---|---|
| Claude via AWS Bedrock | ClaudeProvider uses existing SDK; env/auth paths require the original E07 hardening review | Retain explicit AWS profile/Region/model selection; preserve approved SSO/proxy/CA; forbid substituting direct Anthropic or personal login on failure |
| Claude via direct Anthropic API | Existing EnvManager explicit-key/base-URL branch | Retain deliberate API profile; keep its key/endpoint isolated from OAuth/AWS profiles |
| Claude via Claude Code login | Existing OAuth path | Retain supported native login flow only when selected; exact platform/version/account behavior needs fixtures and live proof |
| Codex via ChatGPT login | CodexAppServerClient.ts:376-377 explicitly requires ChatGPT auth | Retain app-server isolation and selectable model; existing API-key mode is not supported by this adapter |
| OpenAI API / compatible HTTP | OpenAICompatProvider.ts implements chat/completions-shaped requests | Retain explicit URL/key/model; validate protocol and streaming/options. Do not claim Responses-only models/endpoints work or add a new API stack without need |
| Existing Gemini/OpenRouter/other compatible presets | SelectableProvider union and existing adapters | Retain optional explicit selections where compatible; no auto-enable/preset default/CMEM gateway or required registration; untested rows remain unverified |

Native login, OAuth, API key and AWS SSO are different mechanisms, not interchangeable
choices for every provider. A selected backend that cannot perform a retained role must
produce an explicit unsupported-capability result before dispatch. Reuse the existing
one-shot/standalone paths where possible; adapt missing role support with thin wrappers,
not a second independent routing system.

## Resolution, failure and security requirements

1. Resolve role/default/override to one immutable request snapshot: profile, model,
   destination, auth mode and request limits. Validate before credential/network/process
   dispatch. In-flight jobs keep their resolved route; settings changes apply to new jobs.
2. Audit every model entrypoint, including observer and standalone SDK queries, summary
   tier aliases, compression, KnowledgeAgent, refresh, copy, request/focus judges, legacy
   quota routing and retry/recovery paths. No path may call an unrelated transport first.
3. Never choose the first installed/logged-in CLI, default provider, free model, preset,
   alternate account or secondary key simply because the configured profile failed.
4. First implementation has **no automatic cross-profile/model/auth fallback**. Reject or
   visibly pause on bad config, unavailable login, expired SSO, quota, timeout, unsupported
   model or malformed reply; bounded same-profile retries remain. An optional future
   explicit fallback chain needs its own task/contract and is not required for this release.
5. Credential refresh belonging to the selected login/profile is distinct from switching
   auth. Permit supported same-profile refresh; never silently login or switch credential
   types. A27 permits reviewed dependency/model bootstrap, not hidden account repair.
   Use the authorized selected login through its normal mechanism; do not print secrets.
6. Legacy settings cannot revive cmem.ai trials/gateway probes, default quota fallback,
   secondary providers, hardcoded judge models or auto-selected tier aliases. Display
   migration-required/invalid state where necessary; no auto-migration of user state.
   Produce synthetic legacy fixtures and explicit conversion guidance.
7. Retain SDK/Codex tool lockdown, recursion guard and bounded file permissions for refresh.
   Observer must not inherit arbitrary host MCP/plugins/hooks/settings. A local LLM API
   explicitly selected by the owner is allowed; a remote corpus server remains outside scope.
8. Local diagnostics record safe role/profile IDs, resolved model/auth mode, request outcome
   and attempted fallback refusal. Do not emit telemetry or raw prompts/tool output/secrets.

## MCP boundary

Keep own local mcp-search and reviewed local Chroma MCP over stdio. Third-party
open-source packages/model weights can run locally after artifact approval; that does
not imply a third-party network service. No external MCP subscription/service is a
required dependency of the retained memory core. Extra user MCP tools in the interactive
host are separate and must not be inherited by observer/refresh accidentally. Their
existence is neither permission to connect nor a reason to remove local memory tools.
Actual shipped child/network closure is still a step-10/11 proof, not established here.

WINDOWS-09C S bc3275b4c retires plugin signup/bootstrap callers and gates legacy
host/CLI startup; retained provider/native-login implementation files are unchanged.
This does not implement profile role/model/auth/fallback policy or remove local MCP
tools. Parser grammar use explicitly refuses pending approved assets. No provider
login, auth reads, inference or actual MCP process was run; step 6 remains open.
[Bounded evidence and limitations](handoffs/WINDOWS-09C.md).

## Evidence and implementation economy

WINDOWS-09D B855ef7d6e/S236dd661c/H2935e19d0 also refuses independent installer
provider selection/default credential validation, browser/settings/worker-stop and
plugin signup response admission. Dormant bootstrap imports retired; existing
Claude/Bedrock/API/Codex ChatGPT/OpenAI-compatible and native-provider login files
preserved. Unbound host templates and explicit interpreter paths do not authorize
login or interpreter execution. Step6 role/model/auth/fallback policy remains open;
no provider run or local MCP protocol success is claimed.
[Historical source evidence](handoffs/WINDOWS-09D.md).

WINDOWS-09E H98a6d019c changes only common mock harness/tests. Admission and cleanup
failure handling supplies V1 evidence; no provider/native-login implementation, model/
auth routing, local MCP tool or application behavior changed. No auth/inference/MCP
process or real credentials/state read. Native remains BLOCKED; step6 stays open.
[Historical bounded evidence](handoffs/WINDOWS-09E.md).

WINDOWS-09F aebc55e99 is source/official Windows API review only; no provider/auth/
model/MCP implementation changed or executed. A19/A20 and native-login routes remain;
no CMEM account is a product requirement. Working local Chroma/user-chosen models
remain product goals, not outcomes proved by OS API review. U1/D9 and step6 remain
open; no hidden profile fallback or SQLite-only success introduced.
[Current bounded evidence](handoffs/WINDOWS-09F.md).

Inspected source **48feeab567995de81d501b74007694b5ee95a880**, static only:

| Path:line | Finding |
|---|---|
| src/services/worker/provider-dispatch.ts:59,104,116,406 | Existing adapters and implicit quota/gateway fallback need controlled selection |
| src/shared/EnvManager.ts:335,387 | Existing selected explicit credential / OAuth branches require profile isolation |
| src/services/worker/OpenAICompatProvider.ts:4,624,630 | Existing compatible chat-completions adapter/Authorization/model fields |
| src/services/worker/ClaudeProvider.ts:475,501,1079,1082 | Session and standalone SDK calls must share profile enforcement |
| src/services/worker/OpenAICompatibleProvider.ts:548,634-641 | Compression and summary tier can create separate model sends |
| src/services/worker/CodexAppServerClient.ts:167,187,376-377 | MCP isolation plus ChatGPT-login-only adapter constraint |
| src/services/agent-runner/run.ts:103,328 | Background refresh detects usable agents and iterates fallbacks |
| src/services/worker/http/routes/WorkViewRoutes.ts:301,339,380 | Copy/refresh/judge wiring independent of main observer |
| src/services/work-view/request-judge.mjs:176,190 | Settings client and OpenRouter-specific judge/model path |
| src/services/work-view/human-copy-worker.mjs:63,96 | Separate HTTP call and fallbackModels body |
| src/sdk/hardened-options.ts:233,241-243 | Retain tool/MCP/settings isolation |

PROFILE-06A and PROFILE-06B close the bounded local worker and request-progress
entrypoints. Step 10 owns admission of the separately built server and dormant
setup/installer helpers before they can enter a release bundle. Step 11 owns
per-provider live evidence. See [VALIDATION](VALIDATION.md) and the
[PROFILE-06B evidence](handoffs/PROFILE-06B.md).
