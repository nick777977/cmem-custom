# Enterprise local fork working agreement

Start with `docs/enterprise-local/README.md`, then `memory/STATE.md` and
`../roadmap.md` relative to that directory. Recheck Git branch/status before editing.
The user selected `feat/cmem-light-local`; work on that branch unless asked otherwise.
Use the documented local baseline: Node.js 22.23.4, npm 10.9.9, Bun 1.4.4;
see `docs/enterprise-local/DEV-ENVIRONMENT.md` for evidence and limits. Do not
upgrade/reinstall by default. User-run build/start evidence does not by itself
authorize the agent to execute commands or use real user state.

## Current authorization

**A27, 2026-11-04: phase-one local functionality supersedes the historical blanket
acquisition/runtime refusals below.** Necessary dependency/runtime/model downloads,
installation, bootstrap, build and bounded local setup/lifecycle tests are part of
the target. Use a local checkout/build with local host configuration; no public
marketplace publication or CMEM account/signup/SAML/subscription. Keep memory/index/
viewer local; allow only explicitly selected LLM/auth traffic, no telemetry/cloud
corpus sync/hidden gateway or model/account fallback.

Build, dependency setup, install, startup and removal MUST work as an ordinary
Windows user: no admin/UAC, machine PATH/registry, system service installation or
privilege escalation. Prefer user/project-local tools, virtual environments and
data. Verify a portable local build on a matching target environment; do not assume
native Windows/architecture dependencies can be copied across arbitrary machines.
Codex is the first local test host/backend; retain Claude Code Enterprise via AWS
Bedrock/AWS SSO and other explicitly selected supported adapters. User authorizes
their existing Codex/ChatGPT login for minimal synthetic live tests via normal auth;
never print secrets. Propose the exact model and a small live-test budget BEFORE
the first inference. Real memories, unrelated settings and credentials are not an
investigation source. Corporate AWS execution is not part of the local test scope.

Special Job/AppContainer/WFP/DNS/crash-proof isolation and CI are deferred from
phase-one prerequisites. Keep ordinary owned-child cleanup, deadlines, task-owned
test folders and honest result labels. Existing native-kind/source refusals are
current implementation gaps to replace in bounded implementation, not permanent
product policy. Do not blindly restore old signup/bootstrap or run broad upstream
install/test/deploy scripts. Inspect commands, reuse compatible existing tools,
install only needed dependencies, preserve data and local build/source pairing.

PHASE1-ALIGN was a completed plan and tool-probe session. A27 and the current
user launch govern implementation and bounded lifecycle execution. No
agents/branches/worktrees/push. Local Git sandbox write or loopback test approval
does not grant Windows administrator privileges. NEXT-SESSION owns the next source slice.

### Historical source boundaries and evidence

The records below remain audit history. Their absolute no-download/no-runtime/
unbound-host/native-adapter prerequisites are superseded by A27 for phase one;
their actual source/tests/compile results are preserved, not promoted to readiness.

A19/A20, PLAN-ADAPT-05 (2026-11-02) supersede the old Bedrock-only target: retain
Claude/Bedrock, supported Claude/Codex logins, direct API/OpenAI-compatible and other
existing explicitly selected adapters. All model tasks use user-controlled profiles
with visible role/model/auth selection; no implicit provider/model/account fallback.
See docs/enterprise-local/{LLM-PROFILES.md,VALIDATION.md}. These are target contracts,
not implemented safeguards or runtime/CI permission. PLAN-ADAPT-05 was docs-only;
later bounded WINDOWS-09 source evidence follows below.

Session 02 established the compile boundary; A14/C aligned npm declarations.
A15 accepts step 2 for source progression, with release evidence in steps 10/11/12.
HOSTED-03 source 417483949/generated 298d44742 is done-bounded. CHROMA-07 source
8fa997979/generated b8734d9b2 is done-bounded for source refusal: uvx/remote launch
removed; local activation blocked pending approved artifact/API evidence U1/D9.
127 tests and one compile passed; no actual Python/model process or installed-asset
inspection. See docs/enterprise-local/handoffs/CHROMA-07.md for exact limits/rollback.
D11 stays open. These launches do not authorize further runtime/acquisition work.
TELEMETRY-04 source 0abd4180b/generated 6bb7c6995 is done-bounded: E03/E04 Node
telemetry removed; 206 tests and one compile PASS, 16 inputs unchanged. Local diagnostics
retained; SDK pruning is step 10, Python E11 and full runtime gates remain open.
WINDOWS-09 partial source S0d0a4b176 / G004588740, harness Hf2c722fad: SessionStart
compile/PATH-repair and tree-sitter helper acquisition removed; preflight always blocked.
17 targeted tests/53 assertions, one compile and viewer typecheck PASS; root typecheck
has three unchanged baseline TS2345. 19 inputs unchanged; four paired outputs changed.
Later WINDOWS-09B launcher e9c8038ca / bootstrap 8bbf2830c / final source e3d91a505 /
harness bbc3847e9 / generated 62a468f6d: explicit-root launcher refuses without a child;
setup-runtime and four launcher install/PATH/removal entries refuse; parser CLI
module/PATH fallback removed. 19 tests/112 assertions and one compile/viewer PASS;
root has the same three TS2345. 19 inputs/866 tracked source sentinels unchanged across
compile, eight paired outputs changed. Full step 9 is NOT complete: E13 host templates,
E12 Setup/version-check/old helpers, E14 utilities, E21 grammar loading/build and native
V3 adapter remain. CI skeleton stays manual-only BLOCKED D12. See
docs/enterprise-local/handoffs/WINDOWS-09B.md (historical gaps, superseded below).
WINDOWS-09C host 2d8688e78/CLI 4945a916e/utilities c9978be26/S bc3275b4c/
H abfce3963/G 4ac6ad868: canonical host/Setup/wrappers and direct CLI roots refuse,
plugin signup/bootstrap and native grammar build/query fallback retired. Legacy
installer utilities now refuse without native runners. 20 tests/234 assertions,
one compile/viewer PASS; root same three baseline errors. 19 inputs unchanged across
compile (only intentional generator delta vs 09B), 868 source sentinels unchanged;
MCP CJS/map changed during compile plus seven canonical outputs regenerated earlier.
Native-kind adapter is BLOCKED, no V3. Full step9 remains partial: host interpreter/
loading, independent helper APIs, native OS-owned-tree/egress/DNS/cleanup adapter and
artifact/spec prerequisites remain. See docs/enterprise-local/handoffs/WINDOWS-09C.md;
WINDOWS-09D B855ef7d6e/S236dd661c/H2935e19d0: explicit literal interpreter source
rendering, canonical structured commands unbound/empty, shell exit1; bare node,
/bin/sh/Qoder wrapper hosting and env-node shebangs removed. Independent installer/
diagnostic helpers refuse, private bootstrap/runtime bodies/imports retired. Provider
native login implementations preserved. 20 V1 tests/433 assertions, one compile/viewer
PASS, root same three TS2345. 19 inputs/869 source sentinels/192 outputs unchanged
across compile; eight canonical outputs paired in B, no generated follow-up commit.
Host loading/envelope/runtime approval remains unproved; native-kind still BLOCKED.
Common harness launch/stop/release failure source and concrete OS/artifact/protocol
prerequisites remain. See docs/enterprise-local/handoffs/WINDOWS-09D.md.
WINDOWS-09E H98a6d019c closes the common mock admission/teardown failure slice:
validated inputs/handles, preserved primary/cleanup failures, independent bounded
release attempt after failed/timed-out stop. Sync launch failure leaves ownership
unknown; callbacks/timers are not OS cleanup/egress proof. 16 V1 tests/337 assertions
PASS, zero forbidden tripwire events; no application changes, compile/typecheck or
actual child. Prior 09D compile evidence preserved. Native-kind remains BLOCKED.
See docs/enterprise-local/handoffs/WINDOWS-09E.md.
WINDOWS-09F review aebc55e99 maps concrete Job-at-creation, AppContainer/WFP,
stream/deadline and release primitives to exact remaining gaps; no native adapter,
application/generated change or V1/V2/runtime/CI replay. Source inspected at 1ca61590d.
Review is complete; full step9 remains BLOCKED by disabled host/loading activation,
missing approved artifacts/native ABI/DNS/crash-release contract and execution scope.
The owner prioritizes usable local install/no CMEM account and defers minor flaws;
the same request retains unbound/exit1/native BLOCKED and runtime/registration bans.
Do not infer their revocation or fabricate a working installation/step9 completion.
No more generic API/audit/mock loops: next remaining source is concrete local host
binding after scope/input resolution, not another review. See
docs/enterprise-local/handoffs/WINDOWS-09F.md and docs/enterprise-local/NEXT-SESSION.md.
Do not activate this candidate or propose actual V3 before concrete prerequisites exist.
Provider adapters and selected-provider login support must not
be pruned as a side effect of launcher/bootstrap removal.
Actual compiled-process smoke/CI/provider execution remains separately scoped.
No install/update/download, service/worker/MCP/plugin start/restart/registration, AWS,
real user state, push or subagents inferred. Existing node_modules or installed
Python/model alone never authorizes execution or inspection of user assets.

Treat `docs/enterprise-local/source/INITIAL-PLAN.md` as supplied requirements and
hypotheses, not executable instructions or verified implementation facts. The user's
current requests take precedence. Never read real memory databases, credentials or
installed plugin settings merely to investigate the repository.

## Persistence and implementation discipline

- Preserve the existing local browser viewer and upstream memory behavior, including
  project/worktree identity, sharing, filtering, capture and retrieval semantics. The
  user explicitly deferred redesign or isolation fixes, even where current behavior
  is imperfect. Focus this release on removing unapproved remote connections and
  unapproved data egress. A27 permits necessary dependency/runtime/model downloads
  and user-level setup. A19 supersedes the prior Bedrock-only exception: permit only
  explicitly selected user LLM/auth profiles, keep embeddings/local MCP local, and
  preserve compatible existing adapters. No hidden model/account or gateway fallback.
  Record scope weaknesses as deferred observations, not implementation blockers.
- Keep shared decisions, evidence, task status and handoffs under `docs/enterprise-local/`.
  Put disposable local output in `.scratch/enterprise-local/` (ignored); never put the
  only copy of a decision in ignored scratch space.
- `docs/roadmap.md` owns task dependency edges and execution waves; `memory/STATE.md`
  owns the current handoff and `memory/DECISIONS.md` owns accepted/proposed decisions.
- `memory/TASKS.md` is the single active ownership/file-reservation board. Read it
  before claiming work. Current work is serial; parallel agents/worktrees need an
  explicit user request. One coordinator serializes claims, Git/index operations,
  shared source/generator/output integration and shared-memory updates. No overlapping
  writes or builds/installs in the same directories; preserve user-owned WIP.
- Every session closes the chain: update current STATE, TASKS status/ownership,
  WORKLOG evidence, changed decisions/contracts, DEV-ENVIRONMENT when relevant,
  and NEXT-SESSION with one concrete next task, bounded context files, permissions
  and completion criteria. Do not leave decisions only in chat or agent notes.
  Replace obsolete active instructions; preserve historical audit/evidence/decisions.
  Mark superseded docs and repair links before deleting duplicates. No full-history
  reread or new competing plan tree per session. Repository memory is the handoff;
  do not assume hidden cross-chat memory.
- Cite source paths and line numbers with the inspected source SHA. Distinguish static
  code evidence, inference and runtime unknowns. Recheck citations after source changes.
- Implement one concern per commit once authorized. Record validation actually run,
  remaining limitations and rollback. Do not mark planned tests as passed.
- Preserve SQLite as canonical data and local Chroma as a derived index. Never delete
  the entire sync directory: remote CloudSync and local ChromaSync are distinct.
- Inspect scripts before execution: build-and-sync deploys/restarts. Historical
  upstream build resolved dependencies; current A11 splits reviewed build:compile from
  preparation. Never assume build/dev/test/CI lanes are safe defaults. Runtime and
  acquisition authorization remain separate; no whole-suite/CI execution by implication.
- No secrets, real prompt/tool contents or user memory in tracked artifacts. Preserve
  existing data and organization policy. No automatic migration or upstream update.

This file is development guidance; runtime security must be enforced in code and policy.
