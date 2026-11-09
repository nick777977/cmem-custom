# Next implementation: CLOUD-05 — local corpus without cloud sync

WINDOWS-09-LOCAL is complete for the tested private Codex CLI lane.
[Runbook](WINDOWS-LOCAL-SETUP.md), [evidence](handoffs/WINDOWS-09-LOCAL.md).
The installed synthetic worker is stopped. Step 5 is next in the existing
[roadmap](../roadmap.md).

1. Recheck feat/cmem-light-local, Git status and HEAD. Read AGENTS, STATE,
   TASKS, the roadmap step 5 and the relevant egress inventory and patch
   sequence entries. Claim the concrete source/test/output paths before edits.
2. Trace DatabaseManager, worker startup, SyncClient and CloudSync routes.
   Remove cloud corpus sync admission, start/stop/pull/send and remote-only
   routes from the local worker. Previously configured tokens, endpoints and
   queued operations must not cause an outbound attempt. Preserve SQLite
   ownership, data and read compatibility, local ChromaSync, and the existing
   project/viewer behavior. Scope the delta to the local worker and record
   any remaining separate server-side routes as inventory.
3. Run focused legacy-settings and queue regression checks, root/viewer
   typechecks and reviewed build:compile. Use the private installer and
   disposable data for a bounded compiled-worker check if authorized in the
   launch. Use a loopback fixture. A sandbox EACCES is not a passing runtime
   result. Approved sandbox expansion is separate from Windows admin rights.
4. Close STATE, TASKS, WORKLOG, decisions/contracts and NEXT-SESSION. Then
   advance to explicit provider role routing in step 6. Python Chroma and
   offline embedding setup remain step 7. The prior Python probe found no
   Chroma packages. Bun SQLite 3.53.4/WAL/reopen/FTS5 is already verified.

One coordinator on the selected branch. No real corpus, external registration,
public marketplace, push, AWS execution or admin/UAC. No live inference needed
for this task. The existing gpt-6-luna synthetic allowance has three turns
unused. Prove the selected route supports the no-retry constraint before using
it. The installed Codex CLI rejected overrides for the built-in OpenAI provider.
