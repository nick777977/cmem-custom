# Next implementation — CHROMA-07-LOCAL

Continue step 7 on `feat/cmem-light-local` with one coordinator. Recheck branch,
status and HEAD. Read [STATE](memory/STATE.md), [TASKS](memory/TASKS.md), step 7
and D9/D11 in the [roadmap](../roadmap.md), and the historical
[CHROMA-07 boundary](handoffs/CHROMA-07.md). Reserve exact source, tests, emitted
files and task-owned scratch before edits.

The first candidate is **`paraphrase-multilingual-MiniLM-L12-v2`** running
locally on ordinary-user Windows x64. Use it for the first compatibility and
retrieval checks. The worker currently has a gated Chroma `default` route.
The same model name in the separate server's model table does not configure
the worker. Trace `src/services/sync/{ChromaLocalRuntime,ChromaMcpManager,ChromaSync}.ts`
and the worker startup/search callers. Verify how the chosen Chroma API binds
the same model to both index writes and query embedding. Record any concrete
compatibility failure before reconsidering the candidate.

Verify Python, Chroma and model versions, provenance, hashes, licenses,
storage paths, telemetry controls and the supported offline API against
primary sources and synthetic fixtures. Use an isolated user/project-local
Python environment. A27 permits acquisition during setup. Stage the weights
once via a separate documented preparation procedure with exact commands
and paths. The [private fork install](WINDOWS-LOCAL-SETUP.md#prepare-the-build)
continues to use the compiled checkout and local Codex catalog. Keep model
acquisition separate from npm compile, private registration and worker startup.
Missing or invalid assets produce a local setup error.

Implement and verify one local activation path. SQLite remains canonical and
Chroma indexes the worker's stored observations, summaries and prompts.
Use only synthetic rows under `.scratch/enterprise-local/chroma-07-local/`.
Index a relevant English memory and unrelated distractors, then assert that
a Russian paraphrase retrieves the expected SQLite ID through the actual
Chroma route. Restart the owned processes and repeat against the persistent
index using the staged local weights, with external network access denied
where the fixture permits. Check missing-asset refusal, telemetry and runtime
download behavior. Use model work disabled or a selected loopback LLM as needed.
Cloud embedding providers and whole-repository source indexing are outside this
slice. Keep D11 open and distinguish any unavailable path from actual
persistent Chroma success.

Run affected tests, typechecks, guarded compile and the bounded copied-worker
check within the launch. Record pairing, validation, rollback and the verified
separate preparation instructions. Close STATE/TASKS/WORKLOG with one next task.

[PROFILE-06B](handoffs/PROFILE-06B.md) closes the bounded local profile slice.
All three approved `gpt-6-luna` turns remain unused. The exact route still
needs proof that automatic retries can be disabled before any live turn.
Preserve the private Windows install and prior synthetic SQLite evidence.
No real corpus or credentials, external registration, public marketplace,
push, corporate AWS execution or admin/UAC.
