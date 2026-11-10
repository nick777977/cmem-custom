# Next implementation — CODEX-11-HOST

Continue on `feat/cmem-light-local` with one coordinator. Check branch, status
and HEAD. Read [STATE](memory/STATE.md), [TASKS](memory/TASKS.md),
[step 11 status](../roadmap.md#what-remains-in-step-11),
[WINDOWS-09-LOCAL](handoffs/WINDOWS-09-LOCAL.md), and
[VERIFY-11-LOCAL](handoffs/VERIFY-11-LOCAL.md).

Verify local plugin loading in the Codex surface intended for daily use.
Confirm whether that surface is Desktop or CLI if the choice is unclear.
The private CLI already loaded the plugin from a dedicated catalog, exposed
its MCP tools and discovered the hooks. It saved and retrieved synthetic
SQLite memory and was removed without deleting the data. Reuse that
evidence if the tested CLI is the intended surface. If Desktop is the
target, check the Desktop loading mechanism under a fresh bounded launch.

For any new runtime, verify the [pinned stage](handoffs/ARTIFACT-10-LOCAL.md#recheck-on-a-matching-windows-x64-host)
before opening the candidate. Use disposable home, config, data and loopback
ports. For a separately authorized host registration, verify that the
intended host loads the staged plugin, discovers its hooks and calls the
staged MCP server. Save and retrieve one synthetic note. Exercise a supported
hook lifecycle event that needs no live turn, if the host exposes one.
Record separately hooks discovered by the host, hooks dispatched by the
host and commands invoked directly by the fixture. Verify removal, preservation
of synthetic data and bounded cleanup. If the host cannot be tested with
disposable state, document the concrete limitation and stop that lane.

Use a simulated worker model on `127.0.0.1` for any generation fixture.
Chroma already uses real local MiniLM. No generative model or live budget is
selected. If a live worker test is requested later, get explicit scope for
the model, auth, payload and budget. For the native Codex route this includes
proving resend/fallback behavior through the worker, queue and app-server.
The earlier Luna and Haiku references are historical model candidates.
[A30](memory/DECISIONS.md#a30--separate-model-roles-and-confirm-the-live-profile-2026-11-10).

Close this task with evidence for the intended surface or a specific
loading/cleanup blocker. Keep the verified local workflow result, the
failed pending-event recovery case and the separate local auth defect
visible. Before daily-use acceptance, decide whether events waiting after a
provider failure must survive worker shutdown. Stored SQLite records and
Chroma vectors survived the verified restart. Claude Code with AWS Bedrock
is a separate check in its authorized environment. D11 stays deferred.

This handoff does not authorize host registration or a new runtime launch.
Obtain scope as needed. No live inference, real state, admin/UAC, AWS, CI,
push, publication or agents in this task.
