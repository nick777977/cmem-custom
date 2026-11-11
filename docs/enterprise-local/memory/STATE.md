# Current handoff

2026-11-11 **CLEANUP-MERGE-VERIFY completed; merge NOT recommended yet.**
Source/tests `f6f49db53`, verifier `d9fa7f90f` on the existing cleanup branch.
The five known hook assertions are closed. Direct bound Claude/Codex hooks/MCP
pass; recovery passes on a fresh rerun after an initial connection failure.
Both typechecks and guarded compile pass; 19 inputs, 1,941 tracked source
sentinels and all 186 tracked outputs remain unchanged across compile.
Current reference verification passes 811 original source inputs and exact
81 Codex/80 Claude files. Old inventories/SBOM remain historical.

The expanded selected Bun checks finish at 1,806 PASS / 90 FAIL / 3 SKIP
across 220 files; this is not the full 1,068-file suite. Most residual failures
reproduce on the target snapshot or inspect unchanged obsolete templates.
Windows SQLite file release, restore sidecars and My Work atomic-write tests
still fail, alongside nonportable fixture and resource-contract expectations.
The retained gate is not green; inherited origin alone does not close it.
Local Better Auth session HTTP 500 is reproduced and not used by the selected
memory/viewer scenario; it is a separate nonblocking cleanup defect, unrelated
to Codex/ChatGPT login and AWS SSO. No real DB migration is justified.

[Verdict, behavior matrix, every failure's impact and next action](../cleanup/MERGE-READINESS.md)
· [Exact selected results](../cleanup/merge-verification-results.json)
· [Next task: close the retained Windows regression gate](../cleanup/NEXT-SESSION.md).
No merge/push, real state, live inference, AWS or task branch/worktree changes.
Reservations released. **Earlier active cleanup instructions below are historical
and superseded by this handoff.** Main-roadmap/target-host work did not advance.

2026-11-11 **CLEANUP tree/explanation follow-up**: at `0622cc22f`, removed
116 unnecessary empty project directories; rescan found zero eligible empty
directories. Ignored/dependency/runtime/data trees were excluded, and no
application bytes changed. User requests concise Russian explanations that
identify each unresolved component, impact and next action; recorded in AGENTS.

The auth failure is the worker's **local `GET /api/auth/get-session`**:
synthetic logs show Better Auth's missing user/session/account/API-key/team
tables. It is unrelated to Codex/ChatGPT login or AWS SSO. The tested memory,
MCP and viewer paths worked independently. Five failed checks expect obsolete
literal/autostart hook commands, not the current separately started foreground
worker and destination-bound hooks. Full suite was not run.

**Recommendation: finish pre-merge validation on the cleanup branch first**;
no merge performed. `feat/cmem-light-local` was an ancestor at inspection,
so fast-forward is possible but does not establish functional readiness.
[Next-session prompt](../cleanup/NEXT-SESSION.md) now covers retained local
test lanes, the five failed assertions, local auth impact, current artifact
verification and an explicit merge-readiness verdict. Coupled legacy source
refactoring and real Claude/Bedrock execution are not automatic prerequisites.
[Explanation/evidence](../cleanup/RESULTS.md#tree-follow-up-and-explanation-2026-11-11).
Reservations released. Earlier narrower next-task wording below is superseded.

2026-11-11 side task: **REPOSITORY-CLEANUP implemented** on
`codex/repository-cleanup-plan`, entry `8b93ceb3d`, paired source/output
`007a128e5`. Three bounded slices
retired automation/eight PDFs, extra host packages and standalone/cloud
build/launch. Deleted 487 baseline files / 132,312,367 bytes; 438/440 exact
candidates removed, with two agent-guidance files kept. UI/private display
metadata uses `cmem-light`; technical identities/providers/auth and local
memory behavior remain. Coupled legacy source/dependencies are explicitly
retained, not claimed fully pruned. [Actual results](../cleanup/RESULTS.md).

Both typechecks/guarded compile, focused checks, direct bound Claude/Codex
hooks/MCP, durable recovery and real local Chroma/FTS/restart passed. Browser
viewer/My Work render with local resources. Five old hook-format assertions
remain failures and local auth still returns HTTP 500. The new
[current receipt](../artifacts/windows-x64-cleanup-receipt.json) covers exact
synthetic reference stages; older inventories/SBOM stay historical and do not
validate these bytes. Real CLI registration/Claude/Bedrock acceptance did not
advance. No real installation/data, toolchain, model or ignored cache changes.

[Next cleanup task](../cleanup/NEXT-SESSION.md): align the five retained
hook-format assertions with the current canonical/private-bound contracts.
Main roadmap/Claude target below is unchanged. Reservations released.

Updated 2026-11-10 on feat/cmem-light-local by one coordinator. A27 and A29–A31 define current scope.
Historical blanket refusals and native-sandbox prerequisites are superseded.

The target is daily local use from this checkout. The owner accepts the
existing Codex CLI host result and sets aside Codex Desktop. The private
Claude Code CLI stage is prepared and fingerprinted. Verify actual Claude
CLI loading and its AWS Bedrock route later on the authorized instance
where the projects and worker run. The daily-use handoff covers setup,
updates and data-preserving rollback.
[Local route](../../roadmap.md) · [A31](DECISIONS.md#a31--accept-the-codex-cli-check-and-target-claude-code-on-windows-2026-11-10).

RECOVERY-11-LOCAL completed the paired implementation at `bc8ae2f57`.
The worker retains accepted pending generation in SQLite and exposes
undispatched and unknown outcomes for deliberate recovery. Staged loopback
checks passed after graceful stop and interruption before a result. Four
selected items committed three observations and a summary. Startup and
ordinary retry sent zero repeats. The 80-file Claude inventory was
refreshed and verified. The separate local auth HTTP 500 remains open.
[Checks and rollback](../handoffs/RECOVERY-11-LOCAL.md).

CLAUDE-WINDOWS-STAGE completed the bounded Windows x64 staging and receipt
checks. Renderer `fc0484bf6` binds eight Claude hook events and stdio MCP
to the foreground loopback worker from paired build `2bb4746b2`. Direct
Claude/Codex command fixtures passed SQLite prompt capture and MCP
initialization/listing without model requests. Invalid binding, missing
worker and wrong worker path were refused. The 80-file Claude inventory
verified reference, raw transfer and fresh binding. Real Claude CLI
version, managed policy, loading and hook dispatch remain target checks.
[Evidence](../handoffs/CLAUDE-WINDOWS-STAGE.md).

VERIFY-11-LOCAL completed the exact-artifact test run on Windows x64.
Direct Codex hooks and MCP, simulated observer and summary profiles, FTS5,
real Chroma search and persistence, missing/corrupt model refusal and a
browser rendering probe passed within their fixture scope. Two events
waiting for generation after provider errors disappeared on graceful
shutdown. Committed observations, summaries and the index survived. That
failed case was addressed by RECOVERY-11-LOCAL above. Other cases keep
the full local workflow matrix (V4) open. The retained
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
explicit Bedrock profile are separate. The target host fixture uses
simulated worker generation first.
[Windows profile template](../WINDOWS-LOCAL-SETUP.md#claude-code-and-bedrock-preparation).

## One next target task

**CLAUDE-WINDOWS-VERIFY** checks the refreshed stage on the separately
authorized Windows instance. Confirm CLI version and managed trust policy.
Run real hook dispatch, MCP, synthetic two-project search and data-preserving
removal with simulated worker generation.
[Scope and completion](../NEXT-SESSION.md).
