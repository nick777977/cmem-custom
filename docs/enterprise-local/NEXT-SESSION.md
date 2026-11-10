# Next implementation — ARTIFACT-10-LOCAL

Continue step 10 on `feat/cmem-light-local` with one coordinator. Recheck
branch, status and HEAD. Read [STATE](memory/STATE.md), [TASKS](memory/TASKS.md),
[RUNTIME-10-LOCAL](handoffs/RUNTIME-10-LOCAL.md), step 10 of the
[patch sequence](../PATCH-SEQUENCE.md#10-retained-runtime-closure-artifact-and-fork-ci)
and the [Chroma inputs](handoffs/CHROMA-07-LOCAL.md).

Produce a verifiable artifact inventory and SBOM for the exact private
Windows x64 distribution. Start from the staging allowlist and paired build.
Separate staged bytes, build-only dependencies, bundled libraries, selected
user-level executables and the independently prepared Chroma wheels/model.
Record SHA-256, version, source and license for admitted inputs and outputs.
List missing provenance explicitly. Keep the standalone server, legacy
installer and other excluded entrypoints outside the candidate.

Reserve exact paths before edits. Use reviewed existing inputs and task-owned
scratch under a fresh launch. Verify that a matching copied candidate matches
the inventory byte for byte and that out-of-lane files are rejected or excluded.
Record D12 inputs still requiring approval. This task prepares step 11's
exact-artifact verification and leaves D11 open.

Use the existing user-level Windows toolchain. This handoff grants no
registration, admin/UAC, CI dispatch, publication, push, external inference,
real state or additional agents. All three approved `gpt-6-luna` turns remain
unused. Prove retry disablement on the exact native route before a live turn.
