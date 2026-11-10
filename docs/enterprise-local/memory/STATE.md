# Current handoff

Updated 2026-11-10 on feat/cmem-light-local by one coordinator. A27 and A29–A31 define current scope.
Historical blanket refusals and native-sandbox prerequisites are superseded.

The target is daily local use from this checkout. The owner accepts the
existing Codex CLI host result and sets aside Codex Desktop. Next prepare
and fingerprint the Claude Code plugin on the development Windows machine,
which has Codex only. Verify Claude Code CLI loading and its AWS Bedrock
route later on the authorized instance where the projects and worker run.
The daily-use handoff covers setup, updates and data-preserving rollback.
[Local route](../../roadmap.md) · [A31](DECISIONS.md#a31--accept-the-codex-cli-check-and-target-claude-code-on-windows-2026-11-10).

VERIFY-11-LOCAL completed the exact-artifact test run on Windows x64.
Direct Codex hooks and MCP, simulated observer and summary profiles, FTS5,
real Chroma search and persistence, missing/corrupt model refusal and a
browser rendering probe passed within their fixture scope. Two events
waiting for generation after provider errors disappeared on graceful
shutdown. Committed observations, summaries and the index survived. That
failed case keeps the full local workflow matrix (V4) open. Implement and
test deliberate recovery before daily-use acceptance. The retained
auth endpoint separately returned HTTP 500 when it resolved Better Auth
from the checkout. The tested hooks, search and viewer work independently.
[Runtime evidence and coverage](../handoffs/VERIFY-11-LOCAL.md).

The private Windows x64 candidate has a byte-level inventory and CycloneDX
SBOM at the paired `2bb4746b2` build. The transferred stage and its raw copy
matched across all 81 files. The verifier checked the separate 93-wheel
Chroma input and two model files. The remaining provenance items apply to a
formal distribution if requested. [Inventory, verification and limits](../handoffs/ARTIFACT-10-LOCAL.md).
The closeout reran the copy fixture and tested the documented staging-only
procedure for a fresh candidate. D11 and D12 do not block step 11's local
loopback verification with real Chroma.

The private Windows installer stages the reviewed local worker, MCP, context
reader and Chroma adapter with its selected assets and skills. Worker mode
refuses standalone server delegation. The guarded build verifies that the
worker excludes the server factory and that both the worker and NPX CLI exclude
the dormant installer credential probe. Source and paired build `2bb4746b2`.
21 focused tests, both typechecks and the copied-worker lifecycle passed.
[Checks, separate legacy test failures and rollback](../handoffs/RUNTIME-10-LOCAL.md).

The local viewer now shows effective worker profiles and Chroma search health
under **Settings → Local runtime**. A copied compiled worker and Chrome on
Windows x64 showed setup required with missing assets. With the prepared
runtime, the viewer showed a passing semantic query probe and the search API
returned the expected SQLite observation for a Russian paraphrase. The
loopback provider received zero requests. Source and paired build `2b77e9331`.
54 focused tests and 237 assertions, both typechecks and the guarded build
passed. [Checks and rollback](../handoffs/VIEWER-08-LOCAL.md).

The worker now indexes SQLite observations, summaries and prompts with
`paraphrase-multilingual-MiniLM-L12-v2` in local persistent Chroma on Windows
x64. The copied compiled worker retrieved the expected SQLite observation
from a Russian paraphrase before and after restart. Missing and corrupt
assets produced a setup error. The legacy store and checkpoint were preserved.
Source and paired build `c476b5cd0`. D11 remains open.
[Preparation](../WINDOWS-LOCAL-SETUP.md#prepare-local-chroma),
[provenance and checks](../handoffs/CHROMA-07-LOCAL.md).

The local worker now resolves refresh, copy, request and focus judges, and
knowledge through explicit profiles. The separate request-progress judge
command shares that policy. Unsupported capabilities pause before dispatch.
Telegram wrap-up has a visible local-only refusal. Cached copy, corpus files
and the private Windows setup stay local. Source and paired build `616c51272`.
146 focused tests and 782 assertions, root/viewer typechecks, guarded compile
and the copied-worker loopback check passed. SQLite reopened after shutdown.
[Configuration](../LLM-PROFILES.md#background-capability-and-migration) and
[evidence and ownership boundaries](../handoffs/PROFILE-06B.md).

The main worker requires an explicit default model profile and accepts optional
observer, summary and field compression overrides. Its health response shows
the effective role choices and safe failure categories. Legacy settings alone
pause model work with the queue intact. A copied compiled worker routed all
three roles to synthetic loopback endpoints, preserved failed work and stored
an observation and summary in SQLite. Source and paired build `534de7911`.
165 focused tests / 501 assertions, root/viewer typechecks and guarded compile
passed. [Configuration](../LLM-PROFILES.md#main-worker-configuration) and
[evidence and limits](../handoffs/PROFILE-06A.md).

The local worker no longer registers cloud corpus sync or TeamBrain proxy
routes or runs push, pull or realtime. Old settings and both legacy queues
were inert across two starts of a copied private install. SQLite data and
legacy device identity remain readable. The worker stopped cleanly and the
disposable registration was removed. [CLOUD-05 evidence](../handoffs/CLOUD-05.md).

Private Codex CLI registration from a transferred copy passed. A non-admin
worker reached SQLite readiness, served the viewer and stopped cleanly. Codex
app-server loaded MCP and saved and retrieved a synthetic observation without a
turn. Seven hooks were discovered and the Windows SessionStart command was
exercised directly. Codex still requires normal hook trust review. Three earlier
test registrations were removed with their SQLite data retained. Final synthetic
installation is stopped. [Setup](../WINDOWS-LOCAL-SETUP.md) and
[evidence](../handoffs/WINDOWS-09-LOCAL.md).

Guarded compile, root/viewer typechecks and 70 targeted tests passed. The
worker's external mode skips the legacy handle scan that crashed under Bun and
refuses port reclaim. Transfer was tested on the same x64 Windows host.

PHASE1-ALIGN changed the plan and ran tool probes. PHASE1-DATA-CHECK recorded the
then-proposed live test scope and checked embedded SQLite and Chroma package presence. No application,
harness, generated, manifest or lock change. Claims released at closure.

## Accepted first deliverable

Local checkout -> necessary dependency/runtime/model bootstrap -> local build ->
local Codex host integration -> SQLite + real Chroma + local embeddings + selected
LLM observation/summary + search/restart/viewer. No CMEM account/signup/SAML,
telemetry, cloud corpus sync, hidden gateway or model/account fallback. Downloads
needed for setup are allowed. No public marketplace publishing.

Everything must build/install/run as an ordinary Windows user: no admin/UAC,
machine PATH/registry/system services. Prefer user/project-local tools, venv/config/
data. Support a transferred build on matching Windows/architecture/native/runtime
inputs; actual portability test required. Codex is the first local test surface;
retain Claude Code Enterprise through Bedrock/AWS SSO and other explicitly selected
compatible adapters. Host choice must not silently choose background model/auth.
Special native Job/AppContainer/WFP/DNS/crash-proof isolation and CI are deferred
from phase-one gates. Ordinary deadlines, owned process/file cleanup and real memory
acceptance remain mandatory. Existing source refusals are implementation gaps to fix.

## Prior phase-one checks

Direct desktop Codex executable: codex-cli 0.166.0-alpha.6; --help, app-server --help,
plugin --help exit0. Node22.23.4/npm10.9.9/Bun1.4.4/Python3.13.15 version probes
exit0. Eight inert probes, synthetic empty HOME/CODEX_HOME/env/data/temp/npm configs
in .scratch/enterprise-local/phase1-align; no timeout/kill needed. A ninth authorized
native login-status probe returned exit0/CHATGPT_LOGIN_PRESENT; only sanitized mode
was retained. No model catalog, credential-file inspection/copying, inference, real memories, app-server/service/
worker/MCP/listener, dependency install or compile/typecheck/test replay. No Windows
elevation was requested in those probes.

PHASE1-DATA-CHECK at 4df2b8f5e confirmed Bun SQLite 3.53.4, WAL, file reopen and
FTS5 query on a synthetic file. Neither chromadb nor chroma-mcp package metadata
was found in the selected Python 3.13 installation, its ordinary user site or
the repo .venv/venv paths. No SQLite system installation was needed. Local Chroma
and embedding verification came later in CHROMA-07-LOCAL and VERIFY-11-LOCAL.
WINDOWS-09-LOCAL corrected the three SettingsDefaults TS2345
errors. 09/09B/09C/09D/09E/09F
commits and exact previous source/compile evidence preserved.

## Auth/model decisions

Chroma already uses the local MiniLM embedding model. The Windows user's
file permissions and Claude Code's plugin/trust policy govern local
project access. Interactive Claude Code Bedrock auth and the worker's
explicit Bedrock profile are separate. No live model or budget is selected
for the next task. [Windows profile template](../WINDOWS-LOCAL-SETUP.md#claude-code-and-bedrock-preparation).

## One next implementation task

**CLAUDE-WINDOWS-STAGE: bind a private Claude Code CLI stage and record its
receipt on the development Windows machine.** The current renderer binds
Codex hooks. Prepare the Claude hook and MCP bindings using synthetic
fixtures. [NEXT-SESSION](../NEXT-SESSION.md) defines scope and completion.
Keep the actual Claude CLI version, managed policy, host runtime and AWS
checks pending. Implement pending-event recovery before daily use and
refresh the receipt if the staged worker changes.
[Local delivery route](../../roadmap.md).
