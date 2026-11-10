# Next implementation — RUNTIME-10-LOCAL

Start step 10 on `feat/cmem-light-local` with one coordinator. Recheck branch,
status and HEAD, then read [STATE](memory/STATE.md), [TASKS](memory/TASKS.md),
the step 10 [roadmap](../roadmap.md) and [patch sequence](../PATCH-SEQUENCE.md#10-retained-runtime-closure-artifact-and-fork-ci),
and the step 10 follow-up in [PROFILE-06B](handoffs/PROFILE-06B.md).

Make the phase-one local package and launcher admit only the reviewed local
worker path. Start with the separate server provider factory and the dormant
installer credential probe identified in PROFILE-06B. Trace their actual
entrypoints and either exclude them from the local package path or add an
explicit local refusal at the admission boundary. Preserve the retained
worker's explicit profiles and native adapters. Reserve exact source, test
and emitted paths before edits.

Under a fresh user launch, prove the boundary with focused route/launcher
tests, root and viewer typechecks, a guarded paired build and a copied-bundle
local startup and stop with synthetic data. Record which separately built
entrypoints remain outside the local acceptance lane. Artifact provenance,
SBOM and D12 CI admission still belong to step 10. Keep D11 open.

Use the existing user-level Windows toolchain. No real state, registration,
admin/UAC, CI dispatch, push, external provider traffic or additional agents
are implied by this handoff. All three approved `gpt-6-luna` turns remain
unused. Prove retry disablement on the exact native route before a live turn.
