# Current handoff

Updated 2026-11-02 after WINDOWS-09 bounded source increment. feat/cmem-light-local;
clean entry 7d5f83cac2d9ca7694316bbc5d93bf8ca2ba9818. Single coordinator, serial.
S **0d0a4b176**, G **004588740**, H **f2c722fad**; docs commit follows in Git.
No active reservations after closure. [Evidence/rollback](../handoffs/WINDOWS-09.md).

## Latest outcome and exact limits

Partial step 9: SessionStart ensure-launcher no longer compiles, discovers Bun or
mutates PATH/registry. Sibling-file preflight always reports blocked (missing files
or PRIVATE_LAUNCH_POLICY_PENDING), not readiness. Tree-sitter's ensure/provision
helpers now verify exact local package/version/pinned hash before a bounded probe;
missing/stale assets refuse, installer/download/conda/staging removed from that helper.
Worker retains existing optional-parser warning; Chroma gate unchanged.

Only two generated CJS/map pairs changed, 188/192 outputs unchanged. Manifests/locks/
trust/guard preserved; 19 selected sentinels unchanged across the one compile.
All A19 adapters/native login, viewer and memory identity/filter semantics retained.

V3 orchestration source copies actual generated hashes into synthetic spaces/Unicode
bundle, builds an env allowlist, defines three leaf cases and bounded owned-tree
adapter contract. Mock adapters explicitly report V1. No native/default adapter;
actual process smoke BLOCKED until reviewed process/OS boundary and explicit launch.
PowerShell source planner is BLOCKED D5 for all four actions, zero mutations.
Manual CI source skeleton unconditionally blocks D12; stage commands are comments,
no provisioning/checkout/install/upload/deploy or CI run.

Actual checks: **17 PASS / 53 assertions**, four PowerShell dry-runs + parser PASS,
one build:compile PASS; viewer typecheck PASS. **Root typecheck FAIL**, three existing
TS2345 in ChromaMcpManager 227/842, ChromaSync 385; identical Git-blob overlay baseline.
Generated syntax/closure/input preservation checks PASS; no test forbidden operation.
Compile guard recorded local tool children, no Node socket; not OS-wide egress proof.
No generated entrypoint, worker/hook/MCP/service/listener/Python/model process executed.

## Still open

E12 CLI/bootstrap, E13 launcher/hook/MCP upstream/global/cache fallback and remaining
E14 install-launcher paths are **not removed**. E21 parser PATH/module fallback also
remains; helper acquisition refusal is not complete E21 closure. Old hook configs and
launcher can still select upstream/global paths. Always-blocked preflight does not
enforce a perimeter around other hooks. No private ID/runtime integrity/registration
contract has been selected. D5 options are concrete in the handoff, not accepted.
Do not activate this partial candidate or treat it as full step-9 completion.

A19/A20 and [LLM-PROFILES](../LLM-PROFILES.md)/[VALIDATION](../VALIDATION.md) remain targets:
retain compatible Claude/Bedrock/API/login, Codex ChatGPT login, OpenAI-compatible and
other explicitly selected adapters. Step 6 role/profile/fallback enforcement unimplemented.
Chroma U1/D9 activation remains blocked; D11 stays open; no SQLite-only success mode.
D12 runner/upload, per-profile real payload/auth/network policy and release gates open.

Preserved earlier evidence: BUILD-02/A14/A15 compile boundary; HOSTED-03 S417483949 /
G298d44742; CHROMA-07 S8fa997979 / Gb8734d9b2 source refusal; TELEMETRY-04 S0abd4180b /
G6bb7c6995 Node telemetry retirement; PLAN-ADAPT-05 A19/A20 target correction. Do not rerun.
No full V3/V4/V5/V6, install/rollback, OS-egress/provenance/reproducibility acceptance.

## One next task

**WINDOWS-09B source continuation**, awaiting explicit [NEXT-SESSION](../NEXT-SESSION.md)
launch. Finish deterministic private entrypoint paths and remaining bootstrap/refusal
work, pair generators/outputs, preserve adapters; native process adapter may be authored
but not executed. D5/D12 remain scoped gates, not grounds to guess identity/runner.
No runtime/acquisition/CI/services/registration/live auth/user state/push/agents/worktrees
permission follows from this handoff. Do not start another roadmap step.
