# VERIFY-11-LOCAL

Windows x64, 2026-11-10, one coordinator. Entry was clean on
`feat/cmem-light-local` at `045ac7a0559a4c7125a90ebddf0d5f49bf37fd80`.
The compiled candidate is paired with `2bb4746b2d1ab20f06501b80358cbc6ecbe490d9`.
Source citations below refer to that paired build. The inventory verifier is
from the entry SHA. V3 private-entrypoint and V4 simulated-workflow results
below are bounded. The exact-artifact verification run is complete. V4 is
the synthetic end-to-end memory workflow with real local storage and search.
Its full matrix remains open because refused work did not survive shutdown
and other cases below were outside the run. V5 is a separate live-provider
check and was not run.

## Artifact and setup

The [staging-only procedure](ARTIFACT-10-LOCAL.md#recheck-on-a-matching-windows-x64-host)
produced fresh pre-registration receipts before the candidate was opened or
run. The main attempt `run-1b53c6d2` used worker port 56685. Its receipt matched
81 files, 30 directories, 93 wheels, two model files and the pinned Node, Bun,
Codex, CPython and `python313.dll` hashes. The inventory SHA-256 was
`c81096230aa257675165646b5fbb2e34b1f6e2bd97f0d115fca35e0e1e85e2dd`.
The bound file-list SHA-256 was
`40d332155e01469cdef3fc3f06a8cb38728c48d139c20cf3ba90a2c569f668de`.
Raw receipt and sanitized runtime observations are in
`.scratch/enterprise-local/verify-11-local/run-1b53c6d2/`.

The independent Chroma inputs were reused. The two model files were copied and
rehashed. A fresh scratch venv was installed from the existing wheelhouse with
`--no-index --require-hashes --only-binary=:all:` and passed `pip check`.
The requirements file matched the documented CRLF SHA-256. The original
wheelhouse and model were read-only inputs. Settings, keys, captured content,
home, application data and temp paths were task-owned. The first sandboxed run
bound the worker and opened SQLite, but the launcher could not confirm readiness
and forced termination. The port rebound successfully. The scoped reruns
asserted an ordinary-user token and used only the fixture runtime and data.

## Runtime observations

| Check | Observed result |
|---|---|
| Private launcher | `host --version` ran pinned Codex `0.167.0-alpha.3.2`. Hook and MCP commands refused a stopped worker. Missing model profile and standalone server commands refused. Foreground worker start and stop passed. |
| Hook capture | Direct staged commands exercised all seven hook types with synthetic Codex envelopes. Two simultaneous observation hooks produced SQLite observation IDs 1 and 2. The Stop hook produced summary ID 1. Both sessions kept the fixture project and `codex` source. A fully private prompt marker was absent from stored prompt text and from the model bodies seen by the fixture. The unrelated project filter excluded the observation. No linked-worktree fixture or identity migration was exercised. |
| Other entrypoints | The staged context reader returned a positive read-only SQLite check from its Bun worker thread. Staged MCP stdio initialized, listed 19 tools, saved note ID 3 and retrieved it through `dumb_search`. Its process exited on EOF. The staged Python adapter served Chroma over stdio. |
| Model dispatch | The synthetic server checked each request's loopback peer, path, selected model and synthetic key binding. Two observer requests and one explicit summary override succeeded. The 401 and redirect cases each sent one request to the observer route, reached no fallback or redirect destination and created no additional observation or summary. |
| Search and restart | FTS5 matched the English observation, and the tested Russian FTS token returned zero rows. Chroma returned the expected SQLite observation and summary IDs for Russian paraphrases. Restart preserved the three observations, one summary and the same 11 Chroma embedding IDs and sequence IDs, with no extra model request. |
| Missing and corrupt input | An absent tokenizer reported `setup-required` and created no vector DB. Corrupting the scratch copy reported `setup-required` with a SHA-256 mismatch. Canonical rows survived, and the restored model copy matched its original hash. Both refusal boots made zero model calls. On a new empty index, Chroma connected with zero collections and the deep probe failed at `query`. The same probe passed after indexing. |
| Refused queue replay | **Failed.** The two refused events were visible in `queueDepth` before stopping. After graceful shutdown there were zero `pending_messages` rows. A subsequent start reported queue depth zero with the successful observations and summary still present. The worker uses a RAM buffer and disposes pending work on session teardown. [Buffer](../../../src/services/worker/SessionMessageBuffer.ts#L51) · [Shutdown disposal](../../../src/services/worker/SessionManager.ts#L728). |
| Viewer | The worker served `/viewer` and `/viewer-bundle.js` with HTTP 200 after restart. A separate headless Chrome check used a loopback bridge that injected a DOM probe into the HTML response and forwarded the original viewer bundle. The observation rendered and Settings → Local runtime showed both selected profiles and **Semantic search probe passed**. The probe recorded 19 page resource entries at the bridge origin. Direct DevTools and DOM-dump fixtures did not complete. |
| Retained local auth | `GET /api/auth/get-session` returned HTTP 500. The stderr stack showed Better Auth resolving from the ancestor checkout's `node_modules` and reporting a schema mismatch. The staged candidate omits those packages. This run establishes the in-checkout behavior, and the result outside that module-resolution tree remains unverified. [Lazy route](../../../src/server/auth/BetterAuthRoutes.ts#L15). |

The launcher, hook commands and MCP were invoked from the staged install, with
no host registration. Their ownership and routing follow the paired
[worker start](../../../scripts/enterprise-local/codex-local.mjs#L287) and
[host entry](../../../scripts/enterprise-local/codex-local.mjs#L343) paths.
The version probe created a `tmp` directory in the disposable Codex home.
There was no Codex config or auth file there. Post-run hashes matched all
81 staged payload files and both original and restored model copies. No
tracked source, generated bundle, inventory or lockfile was changed by this check.

## Process and network evidence

Task-filtered Toolhelp process snapshots and IPv4/IPv6 TCP tables sampled startup,
Chroma, MCP, the browser, provider-error and shutdown phases. Observed TCP peer
addresses for the sampled owned processes were loopback. The Python child had
an internal loopback pair. The fake provider logged the selected requests and
the local deny proxy recorded attempted Chrome background requests to Google
service hosts, including before navigation. The proxy rejected HTTP requests
and closed CONNECT attempts. This is application traffic and process evidence
at the sampled coverage, with no continuous DNS, UDP, native traffic or
OS-level containment proof. Brief children or sockets can fall between samples.

Successful worker stops released the launcher control directory and Chroma
writer lock. Owned Chrome trees from failed browser fixtures were terminated.
The sampled child PIDs were gone and the worker and fixture loopback listeners
could be rebound after cleanup. Disposable evidence and databases remain in
scratch. No rollback of tracked runtime files is required. Keep the original
Chroma inputs and data stores intact.

## Remaining acceptance

The pending-event result concerns work whose observation or summary has yet
to be generated. It makes recovery after a provider error and restart
unreliable for those events. Stored observations, summaries and Chroma
vectors remained available. Decide before daily-use acceptance whether the
current limitation is acceptable. If durability is required, scope recovery
separately from this artifact test. Durable retention and automatic resend
are independent requirements. A future check must avoid duplicates and
respect the selected route's resend policy.

Additional V4 cases still unexercised include linked-worktree sharing,
provider timeout/429/malformed/unknown-model/unreachable responses and an
index fault. The auth endpoint is a separate defect. The tested memory flow
does not depend on that endpoint. Its behavior outside the checkout remains
unverified.

Next verify the intended Codex host with simulated generation. The live
worker profile is a separate selection under [A30](../memory/DECISIONS.md#a30--separate-model-roles-and-confirm-the-live-profile-2026-11-10).
The earlier Luna test used zero live turns. Claude Code and AWS Bedrock
remain separate. D11 stays deferred and D12/formal distribution remain optional.
