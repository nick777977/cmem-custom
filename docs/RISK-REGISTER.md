# Risk register

Baseline: [BASELINE.md](BASELINE.md). Priority below means release relevance, not an
estimated probability. Static capability is verified where cited; exploitation and
actual historical traffic are not established. No mitigation is implemented yet.

| ID | Risk / evidence | Required control and proof | Gate |
|---|---|---|---|
| R01 | Hosted extraction and separate history upload, E01/E02 | Remove client + routes + jobs + UI; legacy credentials inert in tests | Release blocker |
| R02 | Independent CLI/worker telemetry, E03/E04 | Remove transports and package closure; error/shutdown traffic capture | Release blocker |
| R03 | Cloud sync push/pull/realtime, E05 | Remove remote lifecycle; retain Chroma/outbox compatibility | Release blocker |
| R04 | Claude provider is not Bedrock enforcement; env/auth fallback, E06/E07 | Approved env/Region/model; no direct key/OAuth/provider fallback; negative auth tests | Blocks real inference |
| R05 | Runtime uvx and local model cold-cache uncertainty, E08/E10/E11 | Pinned local Python/model, hash checks, forced telemetry-off, cold-start network proof | Release blocker |
| R06 | Remote Chroma/embedding and server runtime configuration, E09/E10/E16 | Reject remote modes before client construction, remove unreachable packaged closures | Release blocker |
| R07 | Upstream/global launcher and runtime repair, E12/E13/E14 | Unique identity, absolute bundle paths, local preflight, coexistence test | Blocks installation |
| R08 | Build silently resolves packages; root lock absent from tracked files, E15 | Pure compile boundary, reviewed lockfiles/lifecycles/artifact origin | Blocks install/build approval |
| R09 | Raw capture privacy not established; log redaction != capture policy | Review existing capture against allowed Bedrock payloads; preserve existing controls; separately scope any required policy change | Blocks real corporate payloads pending policy review, not local-memory redesign |
| R10 | Basename identities and optional retrieval scope | Preserve upstream behavior per A06; regression coverage only; record weaknesses for later consideration | Deferred, not a release blocker in this scope |
| R11 | Configurable listener, local API and browser surface, E17/E18 | Reject non-loopback, audit existing guards, destructive-route/browser asset tests | Release blocker |
| R12 | Existing limits/locks do not prove recovery/concurrency | Queue/crash/replay tests, singleton lock recovery, Windows process-tree cleanup | Blocks reliability acceptance |
| R13 | Generated bundles retain removed code | Generator/output changes, clean build manifest, bundle reachability review | Blocks artifact acceptance |
| R14 | Corporate network, model, retention and plugin policy UNKNOWN | User/IT provides scoped approved configuration; no guessed endpoint list | Blocks deployment/real E2E |
| R15 | Untrusted memory instructions mistaken for source truth | Historical labeling and prompt-injection fixtures; code/Git remain canonical | Blocks retrieval acceptance |

References E01–E18 resolve to [EGRESS-INVENTORY.md](EGRESS-INVENTORY.md).

## Blockers by stage

Planning has no blocker. Deeper static P1 can proceed without dependencies or secrets.
Installing/building/testing is currently explicitly unauthorized by the user; this is
a work boundary, not a tool failure. Artifact sourcing and lifecycle policy must also
be settled before acquisition. Real Bedrock tests additionally need approved synthetic
payloads, model/profile/Region and network/auth policy. Final deployment needs approved
plugin loading, data location/retention and process-tree egress evidence.

Rollback must preserve data. Prefer reverting the isolated source commit and rebuilding
the matching artifact. Do not revert database schemas or point upstream at fork data
automatically; initial release avoids destructive migrations and uses fresh test data.
