# User-controlled LLM profiles and task routing

Accepted target contract, 2026-11-02, decisions A19/A20. **Not implemented yet.**
Supersedes the Bedrock-only target in the supplied initial plan and old session
prompts. Historical evidence/commits remain unchanged. Dependencies and execution
waves live only in [roadmap](../roadmap.md); runtime evidence requirements live in
[VALIDATION](VALIDATION.md). No permission to read credentials or run models is granted here.

## Outcome and scope

The owner chooses exactly where each model task runs and can see the effective
provider, model and auth mode before enabling it. Bedrock is a likely first profile,
not the sole supported route. Preserve existing Claude Code and Codex integrations,
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
| Embeddings | Turn documents/queries into vectors for Chroma search | Separately approved local embedding model/runtime; no remote embedding API or runtime download |
| Persistence/API/viewer | Canonical SQLite/FTS5, derived Chroma, local UI and spool | Local; existing identity/sharing/filter semantics retained |

A user may deliberately make the observer match the host's provider, or choose a
different configured profile. Initial implementation should use one explicit global
observer default plus role overrides, reusing existing config. Do not invent automatic
per-project/worktree/host credential selection or change memory identity. Per-host
routing, if needed later, must be explicit and separately scoped.

## Profile contract

This is a logical contract, **not an already accepted JSON/settings schema**. Step 6
chooses the smallest compatible representation in existing settings and reports the
exact migration/validation contract before retaining source changes. No new config
service, plugin framework, secret store or provider rewrite is required by this plan.

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

These role names are planning vocabulary, not mandated public setting keys. At step 6
trace actual callers and collapse aliases that share behavior; do not add roles with no
retained caller. Inference solely formatting a removed outbound connector can be removed
with that connector, rather than introducing a new role for it.

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
   auth. Permit supported same-profile refresh; never silently repair/login/download or
   switch credential types. User-owned real auth reads and outbound refresh need scope.
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
[Current source evidence](handoffs/WINDOWS-09D.md).

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

Step 6 should deliver two bounded increments if needed: PROFILE-06A (shared resolution,
legacy rejection, main observer/summary/compression and effective status) then PROFILE-06B
(background/standalone/copy/judges and all retained provider-role coverage). Avoid one
large rewrite. Step 10 may prune a dependency only after proving it is not needed by any
retained configured route. Test exact subprocess options and no-send failures as well as
pure resolver units. See [VALIDATION](VALIDATION.md) for runtime/CI obligations and
[PLAN-ADAPT-05](handoffs/PLAN-ADAPT-05.md) for this documentation-only change.
