# Enterprise local fork working agreement

Start with `docs/enterprise-local/README.md`, then `memory/STATE.md` and
`../roadmap.md` relative to that directory. Recheck Git branch/status before editing.
The user selected `feat/cmem-light-local`; work on that branch unless asked otherwise.
Use the documented local baseline: Node.js 22.23.4, npm 10.9.9, Bun 1.4.4;
see `docs/enterprise-local/DEV-ENVIRONMENT.md` for evidence and limits. Do not
upgrade/reinstall by default. User-run build/start evidence does not by itself
authorize the agent to execute commands or use real user state.

## Current authorization

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
prerequisites remain. See docs/enterprise-local/handoffs/WINDOWS-09D.md; next WINDOWS-09E source-only
continuation awaits explicit launch. Do not activate this partial candidate.
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
  runtime downloads. A19 supersedes the prior Bedrock-only exception: permit only
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
