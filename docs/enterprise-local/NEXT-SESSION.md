# Next implementation — VIEWER-08-LOCAL

Continue step 8 on `feat/cmem-light-local` with one coordinator. Recheck branch,
status and HEAD. Read [STATE](memory/STATE.md), [TASKS](memory/TASKS.md), step 8
of the [roadmap](../roadmap.md), [CHROMA-07-LOCAL](handoffs/CHROMA-07-LOCAL.md),
[PROFILE-06B](handoffs/PROFILE-06B.md) and the relevant local setup and profile
configuration sections. Reserve the actual viewer/API, test and emitted paths
before edits.

Make the local viewer expose the worker's effective profile choices and the
existing Chroma runtime/search health clearly. Verify the UI can distinguish
a prepared runtime with actual semantic retrieval from missing or invalid
local assets. Keep existing project/worktree identity, sharing, filtering,
capture and retrieval semantics. D11 remains open. Keep secret values and
credential paths out of viewer output.

Use only a copied compiled worker and synthetic data in a task-owned scratch
directory on Windows x64. Reuse the verified local Chroma setup and local
loopback fixtures. No external registration, provider inference, real corpus
or credentials, corporate AWS execution, admin/UAC, push or additional agents.
All three approved `gpt-6-luna` turns remain unused. The exact native route
still needs proof that automatic retries can be disabled before any live turn.

Completion requires the affected API/viewer tests and typechecks, a paired
guarded build and a bounded copied-worker/browser check of both Chroma states.
Update STATE, TASKS, WORKLOG and the handoff with the actual results.
