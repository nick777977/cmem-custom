# Current handoff

Updated 2026-11-04 after PHASE1-ALIGN. feat/cmem-light-local, one coordinator serial;
clean entry/source inspected d055fea4c3487e6010bbb35adb6f69c68b578215. A27 is current
scope; historical blanket refusals and native-sandbox prerequisites are superseded.
Current task changed docs/plan only and ran inert version/help probes. No application,
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

## Checks actually performed

Direct desktop Codex executable: codex-cli 0.166.0-alpha.6; --help, app-server --help,
plugin --help exit0. Node22.23.4/npm10.9.9/Bun1.4.4/Python3.13.15 version probes
exit0. Eight inert probes, synthetic empty HOME/CODEX_HOME/env/data/temp/npm configs
in .scratch/enterprise-local/phase1-align; no timeout/kill needed. A ninth authorized
native login-status probe returned exit0/CHATGPT_LOGIN_PRESENT; only sanitized mode
was retained. No model catalog, credential-file inspection/copying, inference, real memories, app-server/service/
worker/MCP/listener, dependency install or compile/typecheck/test replay. No Windows
elevation requested; no-admin full setup acceptance is still pending.

Chroma/embedding/SQLite runtime readiness and chosen Python compatibility remain
unverified. Three previous TS2345 errors are SettingsDefaults vs Record<string,string>
type mismatches, not missing Chrome. Last application compile/viewer checks passed;
root typecheck failed those three; no new app result claimed. 09/09B/09C/09D/09E/09F
commits and exact previous source/compile evidence preserved.

## Auth/model decisions

User authorizes existing Codex/ChatGPT login for minimal synthetic live tests via
normal auth, with low token usage. They request model and budget proposal BEFORE
inference. Candidate gpt-6-luna is documented for economical summarization/extraction,
but account availability is unverified; proposed initial maximum three short turns,
no automatic retries/fallback, report usage. No model selected or live call yet.
Corporate Bedrock/SSO live acceptance remains for the authorized corporate environment.
No further general policy questions; model selection remains the narrow live gate.

## One next implementation task

**WINDOWS-09-LOCAL: user-level local bootstrap/build and Codex host binding.**
[NEXT-SESSION](../NEXT-SESSION.md) gives bounded source/validation scope. Fix relevant
type incompatibility, replace disabled local paths with real no-admin setup; preserve
CMEM removal and existing providers. Do not restore the old installer wholesale.
Then follow the existing [phase-one roadmap](../../roadmap.md) across steps5/6/7/8
and actual local acceptance/packaging. No new review tree or OS-sandbox loop.
Step9 is still incomplete; no working setup, Chroma or full memory acceptance claimed.
