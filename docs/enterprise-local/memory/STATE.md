# Current handoff

Updated: 2026-11-02 after BUILD-02-TRUST-APPLY. Branch `feat/cmem-light-local`.
Current source commit: `8bc557532108bc68fb516f6fce9549dd1b9a7b6e`; docs commit follows
in Git log. Entry was `6aa253dfb`, clean. Single coordinator, serial.

## Goal and preserved behavior

A Windows Claude Code fork keeps memory in local SQLite/FTS5 and persistent Chroma,
with local embeddings and viewer. Remove hosted onboarding/registration, telemetry,
cloud sync and runtime downloads; retain only approved corporate Bedrock/auth traffic
for observer inference. Preserve capture/retrieval, project/worktree identity, sharing
and filtering semantics. SQLite is canonical; Chroma is derived. No redesign/migration.

## Completed evidence

- User setup preserved in `49e4f65e1` (inputs/trust/generator/manifests/lock) and
  `ce7ded4dc` (four bundles/maps), after exact ten-file fingerprints matched.
- `153a9953c` separates pure compile from explicit viewer/plugin-lock preparation.
  Existing exact Node 22.23.4/npm 10.9.9/Bun 1.4.4 paths are in DEV-ENVIRONMENT.
- Session 02 agent compile PASS, 6 boundary + 21 syntax checks PASS; 199 tracked
  outputs and 15 selected inputs/sentinels unchanged. Not replayed for trust declarations.
  [Detailed historical evidence](../handoffs/BUILD-02.md).
- Historical lifecycle review in `6aa253dfb`: npm/Bun semantics and narrow local
  script evidence. Recommendation A was not adopted; no further A/B/C question.
- **Owner explicitly selected C**, implemented `8bc557532`: add ONNX/msgpackr to
  canonical and plugin npm allowScripts, retain root entries. Actual reviewed guard
  **PASS exit 0**, canonical/root/plugin = 30 true entries. Generator/format/preserved
  plugin fields and 26-name JSON/plugin/lock Bun pairing PASS; five preserved input
  hashes unchanged. Only two declaration files changed; no install/compile/runtime.
  [Current evidence/rollback](../handoffs/BUILD-02-TRUST-APPLY.md), accepted A14.

## Open limits, kept separate from the completed declaration fix

Roadmap step 2 remains **in progress**, not shipped/full acceptance. Compile has no
observed install/lock/deploy/Node socket event, but native/OS-wide traffic enforcement
and capture are incomplete. Clean root-lock/dependency/artifact provenance and full
reproducibility remain unproved. No worker/Claude Code memory/SQLite/Chroma/viewer/
Bedrock runtime acceptance has run. The user-reported prior worker ready is separate.

npm 10 does not enforce allowScripts as a selective lifecycle filter. C expands the
name-based declaration for supporting npm versions; no installation/lifecycle execution
was approved or run. Bun trust/setup remain unchanged. Enterprise acquisition sources,
Python/model assets, actual native closure and release evidence stay pending.

No services/worker/MCP/plugin start/restart, AWS/live inference, real settings/data/
credentials, push, new branch/worktree/subagent or step 3 ran. No active reservations.

## One next task

**HOSTED-03**, awaiting explicit user launch of [NEXT-SESSION](../NEXT-SESSION.md).
That single launcher first explicitly accepts the existing compile boundary for source
progression (proposed P10), carrying OS/no-egress proof to 11 and root/dependency/artifact
provenance to 10/12; then implements step 3 in the same session. This avoids another
review-only/compile-replay session. It has not been authorized/executed by this task.
No graph edges/waves change and no release evidence is declared passed.

Scope: E01/E02 hosted setup/history upload and their CLI/viewer callers. Keep local
memory and viewer; use affected synthetic negative/regression tests, then one authorized
compile because application source actually changed. Do not reinstall, rerun the full
audit, repeat the trust interview or require Codex-hook fixture execution to edit Claude
Code hosted paths. Acceptance: hosted operations cannot send requests; relevant local
paths pass regressions; source/generated output paired; durable evidence and rollback.
Chroma offline integration remains step 7, full end-to-end/network acceptance step 11.

Context: AGENTS -> README -> STATE -> roadmap step 2/3/graph -> TASKS -> DECISIONS
A14/P10 -> DEV-ENVIRONMENT current section -> BUILD-02-TRUST-APPLY -> PATCH-SEQUENCE §3
-> EGRESS-INVENTORY E01/E02 and affected source/tests only. Do not reread whole history.
Close STATE/TASKS/WORKLOG/DECISIONS/affected contracts/environment/NEXT-SESSION every time.
