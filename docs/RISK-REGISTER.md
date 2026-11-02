# Risk register

Baseline: [BASELINE.md](BASELINE.md). Priority below means release relevance, not an
estimated probability. Static capability is verified where cited; exploitation and
actual historical traffic are not established. Completed bounded mitigations are in
STATE/handoffs (hosted, telemetry, Chroma refusal, compile). Remaining rows are risks,
not claims that everything is still unimplemented. A19/A20 supersede Bedrock-only
policy: [LLM-PROFILES](enterprise-local/LLM-PROFILES.md),
[VALIDATION](enterprise-local/VALIDATION.md).

| ID | Risk / evidence | Required control and proof | Gate |
|---|---|---|---|
| R01 | Hosted E01/E02 source removed by HOSTED-03; exact-release runtime closure remains | Remove client + routes + jobs + UI; legacy credentials inert in tests | Release blocker |
| R02 | E03/E04 Node sinks removed by TELEMETRY-04; dependency/OS closure remains | Remove transports and package closure; error/shutdown traffic capture | Release blocker |
| R03 | Cloud sync push/pull/realtime, E05 | Remove remote lifecycle; retain Chroma/outbox compatibility | Release blocker |
| R04 | Unselected provider/model/account via dispatch, tier aliases, env/auth fallback or separate background clients, E06/E07/E20 | Explicit role/profile/model/auth resolution for ALL calls; retain adapters; no implicit switching, scoped credentials, negative auth/legacy/redirect tests and live rows | Blocks intended profile acceptance |
| R05 | uvx acquisition removed/source launch refused by CHROMA-07; local artifacts/model/E11 remain unverified | Pinned local Python/model, hash checks, forced telemetry-off, cold-start network proof | Release blocker |
| R06 | Remote Chroma/embedding and server runtime configuration, E09/E10/E16 | Reject remote modes before client construction, remove unreachable packaged closures | Release blocker |
| R07 | Upstream/global launcher and runtime repair, E12/E13/E14 | Unique identity, absolute bundle paths, local preflight, coexistence test | Blocks installation |
| R08 | Historical acquiring build split by A11; root lock/provenance and future CI acquisition remain unresolved, E15 | Pure compile boundary, reviewed lockfiles/lifecycles/artifact origin | Blocks install/build approval |
| R09 | Raw capture privacy not established; log redaction != capture policy | Review existing capture against per-profile allowed LLM payloads; preserve existing controls; separately scope any required policy change | Blocks real corporate payloads pending policy review, not local-memory redesign |
| R10 | Basename identities and optional retrieval scope | Preserve upstream behavior per A06; regression coverage only; record weaknesses for later consideration | Deferred, not a release blocker in this scope |
| R11 | Configurable listener, local API and browser surface, E17/E18 | Reject non-loopback, audit existing guards, destructive-route/browser asset tests | Release blocker |
| R12 | Existing limits/locks do not prove recovery/concurrency | Queue/crash/replay tests, singleton lock recovery, Windows process-tree cleanup | Blocks reliability acceptance |
| R13 | Generated bundles retain removed code | Generator/output changes, clean build manifest, bundle reachability review | Blocks artifact acceptance |
| R14 | Corporate network, model, retention and plugin policy UNKNOWN | User/IT provides scoped approved configuration; no guessed endpoint list | Blocks deployment/real E2E |
| R15 | Untrusted memory instructions mistaken for source truth | Historical labeling and prompt-injection fixtures; code/Git remain canonical | Blocks retrieval acceptance |
| R16 | Compile/unit-green hides runtime path/import/ABI/lifecycle errors | V3 actual compiled entrypoints, V4 real local-index E2E; fail readiness/deadline/cleanup, not only mocks | Blocks runtime acceptance |
| R17 | Broad upstream CI installs/downloads or publishes code/assets/secrets without approval | Approved D12 runner, pinned pre-provisioned inputs, scoped workflow triggers, no automatic cloud jobs, least privilege and no PR credentials | Blocks fork CI execution |
| R18 | Keeping adapters is mistaken for universal provider/auth/model support | Publish per-route capability/mock/live matrix; reject unsupported combinations; unavailable Bedrock remains pending | Blocks unsupported support claims |

References E01–E22 resolve to [EGRESS-INVENTORY.md](EGRESS-INVENTORY.md).

## Blockers by stage

Planning has no blocker. Current PLAN-ADAPT-05 is documentation-only; existing
source/check permissions belonged to their completed launches. No fresh runtime,
acquisition, live provider access, CI upload/provisioning or deployment is authorized.
Known compile and fixture evidence remains valid within its prior scope. Future V3
compiled-process tests use synthetic state without provider credentials, and V4 uses
a fake loopback LLM plus actual approved local Chroma assets. Bedrock is unavailable
now and its V5 row stays pending; source/mock work need not wait. Live tests need the
chosen profile's nonsecret settings, synthetic payload scope and explicit auth/network
permission. Final deployment needs private-plugin/data policy and exact-artifact
process-tree egress/install evidence.

Rollback must preserve data. Prefer reverting the isolated source commit and rebuilding
the matching artifact. Do not revert database schemas or point upstream at fork data
automatically; initial release avoids destructive migrations and uses fresh test data.
