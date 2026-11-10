# Decision log

## Accepted from the user's current request

| ID | Decision | Reason / authority |
|---|---|---|
| A01 | Work on existing `feat/cmem-light-local`; no new branch or checkout | User created the fork branch and asked to use it |
| A02 | Keep durable memory under tracked `docs/enterprise-local/`; root `AGENTS.md` points there | User requested repository-local persistence and logical commits |
| A03 | Historical planning/audit sessions were docs-only | Superseded for Session 02's bounded step-2 implementation/checks by A10; still no general runtime authorization |
| A04 | Preserve supplied plan verbatim, verify hypotheses against pinned source | User asked to adapt after investigation and distinguish document instructions from request |
| A05 | No installed memory/credential/config reads or machine-wide changes needed for planning | Repository evidence is sufficient for this phase |
| A06 | Retain the local browser viewer and existing upstream project/worktree memory behavior, including current sharing/filter defaults | User clarification on 2026-10-30: no rewrite even if separation is imperfect; reconsider later |
| A07 | Historical inference exception superseded by A19; retain removal of unapproved remote connections/downloads while preserving local memory functionality | User clarification; approved corporate Bedrock remains the previously specified inference exception |
| A08 | Maintain self-contained repo memory throughout implementation: TASKS owns active ownership/reservations; STATE/DECISIONS/WORKLOG/affected contracts/NEXT-SESSION close every session; one coordinator integrates parallel results | User request 2026-11-02 to preserve decisions/context across fresh sessions and prevent duplicate/conflicting agent work. Parallelism still requires explicit dispatch authorization; board alone does not start agents |
| A09 | Use Node.js 22.23.4, npm 10.9.9, Bun 1.4.4 as the local fork development baseline; preserve user-installed dependencies, no automatic upgrade/reinstall | User supplied successful build/start evidence and exact Node/npm output on 2026-11-02; Bun version is in build log. Node 20/24 attempts reportedly failed; not a full compatibility claim |
| A10 | Session 02 may preserve reviewed USER-SETUP in separate local commits, edit step-2 source/build/check code, use existing dev dependencies and run corrected compile/reviewed focused local checks | Explicit user launch 2026-11-02; excludes acquisition, runtime services/hooks outside reviewed checks, real settings/data, AWS, push and step 3. Results in handoffs/BUILD-02.md |
| A11 | Compile generates/verifies with local inputs only; viewer ci and plugin lock resolution are explicit preparation commands; missing local viewer compilers fail without auto-repair | Implemented 153a9953c with user's first-patch contract; compile/fixtures pass. Does not establish approved dependency policy or OS-level no-egress |
| A12 | Preserve existing user lifecycle policy separately; do not auto-expand canonical allowlist or weaken its guard to hide known drift | Session 02: guard confirms root drift. No consistency mutation needed by compile; bounded BUILD-02-TRUST is next. Bun JSON remains generator input |
| A13 | BUILD-02-TRUST was a serial read-only lifecycle/policy review with docs commits; no automatic trust change or script execution | Explicit user launch 2026-11-02. Review complete in [BUILD-02-TRUST](../handoffs/BUILD-02-TRUST.md); its formerly pending selection is now settled by A14. Existing setup/baseline preserved; step 2 remains in progress |
| A14 | Owner selected C: preserve root ONNX/msgpackr allowScripts and add both names to canonical/plugin npm declarations; retain guard and all Bun trust/lock/setup | Explicit user instruction after concrete alternatives, 2026-11-02. Implemented `8bc557532`; guard PASS exit 0 (30 entries), 26-name Bun pairing/five unchanged input hashes PASS. Supersedes pending P09; no acquisition/lifecycle/runtime execution approved. [Evidence](../handoffs/BUILD-02-TRUST-APPLY.md) |
| A15 | Accept the tested pure compile boundary for source progression; step 2 release evidence remains pending | Explicit HOSTED-03 user launch 2026-11-02 accepts P10. OS/process-wide no-egress and full runtime acceptance stay in 11; clean root-lock/dependency/artifact provenance/reproducibility stay in 10/12 before delivery. No edge/wave change, no acquisition approval or install to close step 2. |
| A16 | Retire E01/E02 and hosted browser setup without changing local memory/viewer semantics | Explicit bounded HOSTED-03 launch. Implemented source/tests 417483949 and generated 298d44742; legacy setup API returns 410, clients/helpers inert, worker/CLI/UI wiring removed. 58 targeted tests and one compile PASS; no service, real data, AWS, dependency/trust/lock change. [Evidence/rollback](../handoffs/HOSTED-03.md). |
| A17 | Remove E08 runtime acquisition/E09 remote launch; explicitly refuse all local Chroma launches until approved artifact/API evidence exists | Explicit bounded user launch 2026-11-02. Source 8fa997979, generated b8734d9b2; 127 tests + one compile PASS, 16 inputs unchanged. No actual Python/model process, guessed API/hash or telemetry safeguard. U1/D9 and D11 open; no graph/wave/release gate change. [Evidence/rollback](../handoffs/CHROMA-07.md). |
| A18 | Remove E03/E04 Node worker/CLI/backfill telemetry and jobs; retain local diagnostics and compatible inert instrumentation | Explicit TELEMETRY-04 launch 2026-11-02. S 0abd4180b / G 6bb7c6995; 206 tests + one compile PASS; 16 inputs unchanged. Legacy opt-in cannot enable transport. SDK declaration pruning stays step 10; Python E11/runtime/no-egress gates unchanged. [Evidence/rollback](../handoffs/TELEMETRY-04.md). |
| A19 | Replace Bedrock-only target with explicit user provider/auth/model profiles for all retained LLM tasks; keep compatible Claude/Codex/API and optional existing adapters | User clarification and explicit plan-adaptation launch 2026-11-02. One default plus visible per-role overrides, no implicit fallback/auto-selected model/account/gateway; local embeddings/MCP/persistence and removal of telemetry/hosted signup/cloud sync retained. Supersedes exclusivity in A07/P02 and initial-plan W4, not prior source evidence. [Contract](../LLM-PROFILES.md). Not implemented yet. |
| A20 | Add early actual compiled-process smoke, credential-free local mock-LLM E2E and fork CI; keep live evidence per intended profile separate | User requests robust runtime/CI validation despite no current Bedrock access. Prior focused fixtures/real compiles remain recorded; root typecheck and new V3-V6 checks are pending. Reuse harnesses/known tools, approved pre-provisioned Windows runner, no hidden acquisition/upload/services; unavailable Bedrock or Chroma stays explicit pending. [Contract](../VALIDATION.md). This launch changes documentation only; runtime/CI/live execution still needs scoped launch. |

### A21 — WINDOWS-09 bounded source launch and result (accepted 2026-11-02)

Explicit user authorization: serial step-9 source/test/generator changes, isolated
mock checks, reviewed typecheck and one pure compile; author V3/PowerShell/fork-CI
sources without actual processes/CI/registration/acquisition/user-state access.
Implemented S0d0a4b176/G004588740/Hf2c722fad: SessionStart compile/PATH-repair and
tree-sitter helper acquisition removed; preflight remains blocked. 17 tests/53
assertions, compile/viewer PASS; root typecheck FAIL with identical three baseline
errors. Private paths/bootstrap/remaining fallbacks/native process adapter require
WINDOWS-09B; step 9 not complete. D5 proposals in [handoff](../handoffs/WINDOWS-09.md)
are not selected; D12 CI remains blocked. No provider pruning or A19/A20 weakening.
No graph/wave change, runtime permission, new SQLite-only mode or release acceptance.

### A22 — WINDOWS-09B bounded source continuation (accepted launch 2026-11-02; closed 2026-11-03)

Explicit serial source/mock/typecheck/one-compile launch; user resumed exact pending
Git/document closure on 2026-11-03, no new runtime scope. Launcher e9c8038ca,
bootstrap 8bbf2830c, final source S e3d91a505 / H bbc3847e9 / G 62a468f6d.
Explicit CLAUDE_MEM_BUNDLE_ROOT and protocol 3 define only static path/refusal input,
not private ID/loading or artifact approval. Setup/runtime and launcher-install
mutation entrypoints refuse; parser CLI module/PATH fallback removed. 19 V1 tests,
one compile/viewer PASS; root three unchanged baseline errors. E13 host templates,
E12 Setup/old helpers, E14 utilities, E21 grammar loading/build and native V3 adapter
remain same-step source work (WINDOWS-09C). No full step 9, global launch perimeter,
readiness, D5 selection, D12 runner, SQLite-only mode or step-6 provider policy claim.
A19/A20/U1/D9/D11/A15 gates preserved. No graph/wave change or new dependency/identity
manifest/lock delta. [Evidence, exact gaps and rollback](../handoffs/WINDOWS-09B.md).

### A23 — WINDOWS-09C bounded source continuation (accepted 2026-11-03)

Explicit serial source/mock/typecheck/one-compile launch, no runtime/CI/registration/
acquisition/user-state/agent/worktree scope. Host 2d8688e78, CLI 4945a916e, utilities
c9978be26, S bc3275b4c/H abfce3963/G 4ac6ad868. Canonical hosts/Setup/wrappers,
direct CLI command roots and plugin signup/bootstrap refuse. Legacy installer native
runners and grammar module/build/query fallback removed; parser explicitly refuses
without approved closure. No invented artifact approval or symbol-less success.
Native-kind adapter unconditionally BLOCKED before launch; only mocks produce V1,
never V3 by label. 20 V1 tests/234 assertions, one compile/viewer PASS; root three
unchanged baseline TS2345. 19 inputs/868 source sentinels unchanged across compile;
vs 09B only intentional build-hooks input delta. MCP pair emitted, seven canonical
host outputs paired earlier. Host interpreter/loading, independent helper APIs,
native OS adapter and artifact/spec prerequisites remain WINDOWS-09D source work.
Step9 partial; D5 options proposed, D12 blocked, A19/A20/U1/D9/D11/A15 preserved.
No graph, identity/protocol, lock/trust, provider/native-login or memory/viewer change.
[Evidence, exact gaps and rollback](../handoffs/WINDOWS-09C.md).

### A24 — WINDOWS-09D interpreter/direct-helper source continuation (2026-11-03)

Explicit serial source/mock/typecheck/one-compile launch, no runtime/CI/registration/
acquisition/user-state/agent/worktree scope. B855ef7d6e pairs source/generator with
eight canonical outputs; S236dd661c retires independent installer/private runtime/
diagnostic operations and dormant bootstrap; H2935e19d0 adds source/mock refusals.
No bare node, /bin/sh selection or Qoder root-to-wrapper hosting. Canonical structured
commands intentionally unbound/empty; shell entries exit1. Literal absolute path
rendering and post-load realpath checks always refuse and do not approve interpreter
execution/version/hash/ABI. No real host loading/envelope claim, D5 options unselected.
Signup response admission refuses so direct helper imports no longer load gateway/
TeamBrain settings; retained provider/native-login implementations remain untouched.
Native adapter still BLOCKED, with exact OS/artifact/admission/cleanup gaps. Common
runner launch/stop/release failure handling needs remaining source (WINDOWS-09E),
never a nominal native label or self-attested success. 20 V1 tests/433 assertions,
one compile/viewer PASS; root three baseline TS2345. 19 inputs/869 source sentinels/
192 outputs unchanged across compile; no new generated commit. Step9 partial,
A19/A20/U1/D9/D11/D12/A15 retained, no graph/identity/protocol/lock/trust changes.
[Evidence, source citations, limitations and rollback](../handoffs/WINDOWS-09D.md).

### A25 — WINDOWS-09E common mock failure handling (2026-11-03)

Explicit serial harness/test-only launch. H98a6d019c validates case/handle admission,
captures sync launch/completion failures and retains primary plus independent bounded
stop/release errors. Release is attempted after failed/timed-out stop; missing cleanup
members fail. Sync launch failure leaves ownership unknown and cleanup unproved.
Callbacks and JS timers do not prove OS ownership, cancellation, live stream bounds,
inherited egress/DNS denial or native resource release. Native-kind remains BLOCKED;
no nominal adapter/approval manifest or image-name/PID/global-port kill introduced.
16 V1 tests/337 assertions PASS, zero forbidden tripwire events; no application/
generated delta, compile/typecheck replay or actual child. All 09/09B/09C/09D evidence
preserved. Step9 partial; concrete OS substrate/API, immutable artifact and host/protocol
contracts remain prerequisites. Next WINDOWS-09F reviews those concrete remaining-source
inputs, not actual V3. A19/A20/U1/D9/D11/D12/A15 and D5 proposals unchanged; no graph,
provider/native-login, identity/memory/viewer, locks/trust/toolchain change.
[Exact evidence, source citations, limitations and rollback](../handoffs/WINDOWS-09E.md).

### A26 — WINDOWS-09F review closure and practical-install priority (2026-11-03)

Explicit serial source/API review at R1ca61590d, evidence aebc55e99. Concrete Microsoft
JOB_LIST/AppContainer/WFP/stream/wait/accounting primitives mapped to unresolved
native artifact/ABI/OS/DNS/broker/crash/release inputs; no nominal adapter, approved
manifest or source/runtime/CI execution. Review complete, full step9 BLOCKED.
Owner requests prompt completion of a usable local plugin without CMEM signup,
local Chroma and chosen LLM/auth, allowing minor flaws to be deferred. This does not
establish an accepted waiver of the same request's explicit unbound/exit1/native
BLOCKED and no-runtime/registration constraints. A scope clarification was requested;
an unanswered option is not permission or selection. No artificial step9 completion.
No more generic API/audit/mock loop: next useful source is local host binding after
concrete scope, host/artifact inputs and corresponding source authorization. No other
step executed or graph changed. A19/A20/D5/U1/D9/D11/D12/A15 and prior evidence retained.
[Source/API findings, exact missing inputs and rollback](../handoffs/WINDOWS-09F.md).

### A27 — functional phase one, Codex first, no administrator rights (2026-11-04)

Owner clarification supersedes prior blanket dependency/runtime download and
startup/registration bans: necessary packages/runtimes/build tools/local embedding
weights may be downloaded and installed; bootstrap must prepare a usable local
build. No CMEM registration/account/SAML/subscription, telemetry, cloud corpus sync,
unselected external service or model/account fallback. Local plugin configuration/
catalog is allowed; no public marketplace publication required or authorized.

Build, dependency installation, plugin setup and runtime must work under an ordinary
Windows user without admin/UAC, machine PATH/registry or system services. Prefer
user/project-local tools/venv/data. Support transferring a prepared local build to
corporate Windows with matching architecture/native/runtime prerequisites; verify
portability rather than promising arbitrary-machine copying. Agent selects necessary
compatible dependencies and records inputs; user need not supply Windows API/ABI or
package hashes. Existing compatible baseline is preserved, no upgrade by default.

Codex is first local host and memory-model test route; preserve Claude Code Enterprise
through Bedrock/AWS SSO and explicitly selected existing adapters. The owner explicitly
authorizes their current Codex login for minimal synthetic live tests with low token
usage, and requests an exact economical model/limit proposal before inference.
Proposed gpt-6-luna and maximum three short turns are not yet approved/entitlement-
verified. No live model/manual credential inspection in PHASE1-ALIGN; the authorized
native login-status check returned sanitized ChatGPT-login presence only. No corporate AWS run
authorized here; no credential contents in chat or tracked evidence.

Strong native Job/AppContainer/WFP/DNS/crash-proof boundary and CI are deferred
from phase-one prerequisites. Retain bounded ordinary lifecycle/owned cleanup,
synthetic tests, actual local Chroma and honest V1/V2/V3/V4/V5 distinctions. Current
source refusals/native BLOCKED remain implementation gaps, not final policy; no
mock relabelling or false readiness. Historical A21-A26 checks/commits are preserved.
Current task updates the existing plan/checks tools; it does not implement or close
steps5/6/7/8/9, change application behavior or deploy to the user's main profile.

A27 follow-up (2026-11-09): user accepted gpt-6-luna and an initial limit of three
short synthetic live turns using the authorized Codex login. Check model availability
first. No automatic retries, fallback or use of actual memories. This is test scope,
not a new production model default. Zero live turns used in PHASE1-DATA-CHECK.
The model and budget are historical context for the previous test proposal.
[A30](#a30--separate-model-roles-and-confirm-the-live-profile-2026-11-10) governs the next launch.

### A28 — private Codex CLI install and external worker lifecycle (2026-11-09)

WINDOWS-09-LOCAL implements D5 for the tested Codex CLI lane. Install under a
new user-writable root, use a private local catalog and dedicated Codex home,
and render absolute hook/MCP commands from the copied build. The user reviews
hook trust through Codex. The foreground launcher owns the worker and its
shutdown. The normal profile and other provider adapters remain separate.
The observer uses an explicitly selected profile independent of the host login.
The lifecycle fixture uses a loopback endpoint and explicitly disables Chroma.
The remaining Claude host and full packaged acceptance are later checks.
[Evidence and limits](../handoffs/WINDOWS-09-LOCAL.md).

### A29 — prioritize local operation (2026-11-10)

The owner clarified the working target: build from the checkout and connect the
local plugin to Codex or Claude Code with AWS Bedrock. The current delivery path
uses direct local checks. Continuous integration (CI) and a separately packaged
distribution are outside this path. Keep the existing workflow source as history
and reopen D12 only if automated runs are requested. Preserve the verified build
inventory and its software bill of materials (SBOM) as evidence for the tested
copy. Distribution provenance, notice delivery and full SBOM schema validation
apply to a separate distribution if requested.

Keep SQLite as the source of stored memory and Chroma as the local semantic
search index. The current plan checks real Chroma and a visible setup error
when its files are missing. D11 remains a deferred product-mode decision.
Finish local verification, then document setup, updates and rollback. Codex
desktop and Claude Code/Bedrock require separate evidence in their intended
environments. Existing login, retry, network and data boundaries still apply.
[Local delivery route](../../roadmap.md), [next launch](../NEXT-SESSION.md).

### A30 — separate model roles and confirm the live profile (2026-11-10)

The selected embedding model is local multilingual MiniLM
(`paraphrase-multilingual-MiniLM-L12-v2`, CPU ONNX). The Chroma sidecar uses
it to convert memory text and search queries to vectors. This is the
implemented and verified step 7 selection. The Codex or Claude Code host
is where the user works. A separately configured memory worker can use a
generative model to extract observations from captured events and write
summaries. Host login, embedding model and worker generation are three
separate settings.

The earlier Luna entry concerned a possible live check of Codex-backed
worker generation. The initial Haiku recommendation concerned worker
generation via Claude Code and AWS Bedrock. Neither is needed for Chroma
embeddings. The earlier Luna budget was unused. Treat both model names as
historical candidates. No live worker model, auth route or budget carries
forward as an active selection. Use a simulated model for host verification.
If a live worker check is requested later, confirm its model, provider,
auth, synthetic payload and budget in a fresh launch. Prove resend and
fallback behavior on the chosen route before using the live budget.
[Model roles](../LLM-PROFILES.md#separate-the-host-observer-and-embeddings).

### A31 — accept the Codex CLI check and target Claude Code on Windows (2026-11-10)

The owner accepts the existing Codex CLI install, hook discovery, MCP and
removal evidence for the Codex host. Codex Desktop implementation and
verification are outside the current delivery path. The CLI and Claude Code
share the memory worker, SQLite, Chroma and viewer. Claude Code has its own
plugin loading, hook payloads and MCP configuration to verify.

The next host target is Claude Code CLI running on the intended Windows
instance, alongside the local worker and the projects that Windows user is
allowed to access. A remote IDE can connect to that instance. The target is
defined by where the CLI process and files are located. A separate
Anthropic-hosted session would need its own setup and scope.

Claude Code's AWS Bedrock authorization covers its interactive model calls.
Local hook execution, MCP and memory use the Windows user's access and
Claude Code's plugin/trust policy. If worker generation also uses Bedrock,
configure the worker's AWS IAM Identity Center profile, region and model
explicitly. The two processes can use the same approved AWS profile by
choice. Local SQLite, Chroma and MiniLM stay on the Windows instance.
Corporate AWS use requires a separately scoped launch.

The failed pending-event recovery case stays in the implementation plan.
Establish and test a deliberate recovery path before daily-use acceptance.
Keep capture filters and project/worktree identity, avoid duplicates and
avoid automatically resending work whose provider outcome was ambiguous.
The local auth HTTP 500 stays a separate issue. [Step 11](../../roadmap.md#what-remains-in-step-11)
· [Windows preparation](../WINDOWS-LOCAL-SETUP.md#claude-code-and-bedrock-preparation).

### CLOUD-05 implementation boundary (2026-11-09)

Apply A27 to the local worker by removing the cloud push/pull lifecycle,
sync status and TeamBrain proxy routes, and new cloud mutation production.
Keep the existing SQLite schema, persisted device ID, origin data and legacy
queue rows. Remove the startup outbox purge so switching to this fork does
not discard queued history. Clear the obsolete sync-health banner state.
Keep the existing cloud-disabled deletion guard for previously acknowledged
rows and the ownership checks for replicated rows. Local remaps keep their
existing project predicates and Chroma metadata reconciliation.
[Validation and rollback](../handoffs/CLOUD-05.md).

### PROFILE-06A implementation of A19 and A27 (2026-11-09)

Use `CLAUDE_MEM_MODEL_PROFILES` in the existing worker settings or process
environment. One required default supplies omitted role overrides. A present
invalid override pauses that route. HTTP API keys are referenced by environment
name and bound to the selected destination by a companion environment value.
The profile path bypasses legacy provider, tier, credential and gateway fallback.
For Claude, the existing hardened one-shot SDK path serves each role through
the shared worker queue. AWS SSO resolves the selected named profile through
the explicit AWS CLI and passes its temporary credentials to Claude. Status is
read-only and excludes credentials and destination paths. The exact schema and
remaining compatibility work are in the [profile contract](../LLM-PROFILES.md#main-worker-configuration).

### PROFILE-06B implementation of A19 and A27 (2026-11-09)

Background jobs use the same required default and complete optional overrides.
Decisions roles require an explicitly bound Decisions endpoint. Knowledge
requires Claude's resumable SDK capability and a local profile binding.
Refresh retains the read-only file checks for Claude and passes prepared
evidence to adapters without file tools. It loads no host plugin or MCP.
The local-only delivery policy refuses Telegram wrap-up before model dispatch.
Other outbound notification/export callbacks do not run in profile-mode
observation processing. The local worker and standalone judge are the
verified boundary. [Configuration](../LLM-PROFILES.md#background-capability-and-migration)
and [remaining ownership](../handoffs/PROFILE-06B.md).

### Step 7 initial model and setup boundary (2026-11-10)

Use `paraphrase-multilingual-MiniLM-L12-v2` as the first local Chroma
compatibility candidate. Verify Russian-to-English retrieval and persistent
offline use on synthetic memory records. Keep the one-time preparation of
Python/Chroma packages and model weights in a separate reproducible guide,
with acquisition permitted by A27. Build and register the copied fork through
the existing private local catalog. Worker startup uses staged local artifacts.
Cloud embeddings and whole-repository source indexing are outside step 7.
Generative LLM selection continues to follow A19 independently.

Source evidence at `b34f55189` lists multilingual MiniLM in the separate
[server model table](../../../src/services/vector/models.ts#L48). Its default
is `all-MiniLM-L6-v2`. The worker's
[local Chroma gate](../../../src/services/sync/ChromaLocalRuntime.ts#L37)
still refuses activation. Selection as the first candidate records priority,
with compatibility and actual offline retrieval to be established in
[CHROMA-07-LOCAL](../handoffs/CHROMA-07-LOCAL.md).

### Step 7 runtime selection and store identity (2026-11-10)

D9 is resolved for the verified Windows x64 stack. Use CPython 3.13.15,
Chroma 1.5.9 and the pinned MiniLM CPU ONNX assets. The worker's historical
`default` selector maps to one packaged encoder for writes and queries.
Each collection carries the encoder identity. A separate derived store and
checkpoint preserve the old index and ensure the worker backfills SQLite
under the selected model. The old automatic v12.4.3 cleanup is retired at
worker startup. The explicit maintenance command remains available.
[Runtime evidence](../handoffs/CHROMA-07-LOCAL.md). D11 remains open.

## Proposed architecture, pending confirmation/implementation

| ID | Proposal | Reason / unresolved part |
|---|---|---|
| P01 | Retain SQLite/FTS5 + persistent local Chroma and existing Claude SDK | Matches supplied objective; runtime compatibility unverified |
| P02 | Superseded by accepted A19: user-controlled model profiles and roles across retained adapters | Preserve isolation and reject implicit model/account/auth switching; implementation and actual profile evidence pending. No longer a Bedrock-only provider-removal instruction. |
| P03 | A28 implements private Codex identity `claude-mem@cmem-light-private` with fresh dedicated profile and data path | Full release identity and target portability remain in step 12 |
| P04 | Superseded by A06: retain local viewer | Remove its hosted routes/actions and external assets while preserving local functionality |
| P05 | Rejected for this release: introduce separate repository/worktree scopes | A06 preserves upstream identity, sharing and filtering behavior; scope redesign deferred |
| P06 | Compile boundary A11; CHROMA-07-LOCAL activates the pinned Windows runtime with separate setup | Exact release and native egress acceptance remain with steps 10–12 |
| P07 | Review existing capture and allowed per-profile payload before live inference | No new capture/redaction redesign is scheduled; any required policy-driven behavior change must be separately scoped |
| P08 | Preserve schema compatibility; avoid destructive migration in initial release | Preserve existing identity semantics too; no identity migration is planned |
| P09 | Historical recommendation A not adopted; owner selected and implemented C under A14 | No pending choice. Preserve [review](../handoffs/BUILD-02-TRUST.md) as evidence of alternatives/risks; latest result in [BUILD-02-TRUST-APPLY](../handoffs/BUILD-02-TRUST-APPLY.md) |
| P10 | Accepted as A15 by explicit HOSTED-03 launch; no longer pending | Source progression only; OS/runtime no-egress and clean dependency/artifact evidence remain release gates in 11 and 10/12. Acquisition still requires separate approved sources/lifecycle permission. |

Formal ADRs should be added when architectural choices are accepted, with alternatives
and consequences. Do not label these proposals as implemented safeguards.
