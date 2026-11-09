# Next implementation — CHROMA-07-LOCAL

Continue step 7 on `feat/cmem-light-local` with one coordinator. Recheck branch,
status and HEAD. Read [STATE](memory/STATE.md), [TASKS](memory/TASKS.md), step 7
and D9/D11 in the [roadmap](../roadmap.md), and the historical
[CHROMA-07 boundary](handoffs/CHROMA-07.md). Reserve exact source, tests, emitted
files and task-owned scratch before edits.

Select compatible Python, Chroma and embedding artifacts for ordinary-user
Windows x64. Trace `src/services/sync/ChromaLocalRuntime.ts`,
`ChromaMcpManager.ts`, `ChromaSync.ts` and the worker startup/search callers.
Verify package and model versions, provenance, hashes, local storage,
telemetry settings and the supported embedding/MCP API against primary sources
and synthetic fixtures. Use an isolated user/project-local Python environment
and explicitly selected local model files. Necessary acquisition during setup
falls under A27. Runtime starts from local artifacts and requires local
embedding inference. Missing or invalid assets produce a local setup error.

Implement and verify one local activation path. Preserve SQLite as canonical
and Chroma as a rebuildable derived index. Use only synthetic rows under
`.scratch/enterprise-local/chroma-07-local/`. Exercise local embed, index,
query, shutdown and reopen with a selected loopback LLM or model work disabled
where the fixture permits. Verify no remote embedding or automatic download
during runtime. Keep D11 open and distinguish any unavailable path from actual
persistent Chroma success. Run affected tests, typechecks, guarded compile and
the bounded copied-worker check within the launch. Record pairing, validation,
rollback, STATE/TASKS/WORKLOG and a concrete next task.

[PROFILE-06B](handoffs/PROFILE-06B.md) closes the bounded local profile slice.
All three approved `gpt-6-luna` turns remain unused. The exact route still
needs proof that automatic retries can be disabled before any live turn.
Preserve the private Windows install and prior synthetic SQLite evidence.
No real corpus or credentials, external registration, public marketplace,
push, corporate AWS execution or admin/UAC.
