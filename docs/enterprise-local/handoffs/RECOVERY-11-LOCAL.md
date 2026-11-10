# RECOVERY-11-LOCAL — deliberate pending generation recovery

Closed 2026-11-10 on `feat/cmem-light-local`. Entry `922eeb841`.
Paired source, tests and emitted plugin `bc8ae2f5770798435f0cefd0cd6f929a26620cd6`.

## Handoff and commit boundaries

At the paired SHA, [spool drain](../../../src/services/worker/hook-spool-drain.ts#L19)
passes the original spool key and time through the existing ingest. The
[observation ingest](../../../src/services/worker/http/shared.ts#L347)
and [summary ingest](../../../src/services/worker/http/shared.ts#L446)
apply the existing admission and privacy checks before persisting the
sanitized payload. The [receipt](../../../src/services/sqlite/GenerationRecovery.ts#L39)
is durable before the spool is acknowledged. The same spool key and
enqueue time deduplicate a redrain. Session-scoped tool-use IDs also
deduplicate captures from sources that share an ID.

The transcript processor [uses the same observation ingest or spool](../../../src/services/transcripts/processor.ts#L579)
and [spools summaries](../../../src/services/transcripts/processor.ts#L677).
The original fixture used Codex hooks with the transcript watcher disabled.
Those hooks already delivered their payloads. The missing durability was
between spool acknowledgement and result storage. The recovery path uses
the receipt from that handoff and does not scan transcripts or replay the
retired `pending_messages` table.

The [worker keeps the running queue in RAM](../../../src/services/worker/SessionManager.ts#L96)
and exposes dormant receipts through the [local processing API](../../../src/services/worker/http/routes/SessionRoutes.ts#L566).
Profile adapters record dispatch admission before handing off the request.
A failure or interruption after this point leaves `outcome_unknown` when
no result is committed. The local operator selects the current receipt
version and explicitly acknowledges a possible repeat provider call.
`undispatched` is available without that acknowledgement. The
[result transaction](../../../src/services/sqlite/SessionStore.ts#L4243)
completes the receipt together with the observation or summary. Completed
receipts retain dedup metadata and clear the payload. SQLite stays canonical
and the existing Chroma indexing follows storage.
[Operator commands](../WINDOWS-LOCAL-SETUP.md#recover-pending-generation).

## Checks

| Check | Actual result |
| --- | --- |
| Refusals and restart | The staged Codex commands reproduced 401 and 307. Both receipts survived graceful shutdown as `outcome_unknown`. Startup and the ordinary retry endpoint sent zero repeat requests. The unacknowledged recovery request returned 409. |
| Dispatch without a result | The loopback server held an observation request after receiving it. A following summary was recorded as `undispatched`. The test terminated the owned worker PID. After restart the observation was `outcome_unknown` and the summary was still `undispatched`. |
| Results and duplicate requests | Four deliberate actions made four provider calls and committed three observations and one summary in the original project. Repeated selections returned 404 before and after another restart. Repeating a captured tool-use ID sent zero new calls. The transaction test forced receipt completion to fail and observed zero committed summary rows until a successful save. A second save using the completed receipt rolled back. |
| Affected host-path regressions | Four Node fixtures passed on ordinary-user Windows loopback. These include the recovery fixture, staging and binding refusals, direct Claude and Codex prompt commands, and both stdio MCP initialization and tool-list paths. Ten focused Bun files passed with 189 tests and 794 assertions, including spool and transcript retry, response processing, profile routing, Codex provider and compiled worker admission. |
| Build | Root and viewer typechecks and guarded `build:compile` passed with Node 22.23.4, npm 10.9.9 and Bun 1.4.4. The final compile preserved 19 build inputs and 2,035 source sentinels. Eight emitted files differ from entry across the worker, MCP, transcript watcher and SessionStore pairs. Generated minifier whitespace is retained. |
| Retained local auth | `GET /api/auth/get-session` still returned HTTP 500 with the in-checkout Better Auth schema mismatch. Recovery and the hook/MCP checks used the local worker independently. |

The compiled recovery fixture used SQLite with Chroma disabled and used
the OpenAI-compatible loopback profile. The earlier Chroma and Codex CLI
results remain tied to the artifact from [VERIFY-11-LOCAL](VERIFY-11-LOCAL.md).
The native provider dispatch boundaries have source coverage here. Actual
Claude CLI, AWS Bedrock, linked-worktree recovery and the broader V4 matrix
remain outside this run.

## Refreshed Claude receipt

The [80-file inventory](../artifacts/claude-windows-x64-inventory.json)
pins the paired build above and renderer
`fc0484bf6e48440875207fb2bc3a67194e5e5a90`. Four normalized staged files
changed from the original inventory. The reference and raw transfer both
verified as `d6eb46155ee516d6c390c79da376f775f85990758670715137a80f1cd7b853a3`.
Rebinding at a separate path and port verified with only the three binding
files changed. The staged reference and exact receipts are in
`.scratch/enterprise-local/recovery-11-local/`.

For rollback, stop the owned worker and restore the earlier paired stage
with its matching inventory at `922eeb841`. Preserve the data directory,
including the additive recovery table. The earlier worker ignores the
receipts and does not provide the recovery API. The separately authorized
[target launch](../NEXT-SESSION.md) owns Claude CLI loading and dispatch.
