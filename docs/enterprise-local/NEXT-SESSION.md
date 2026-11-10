# Next implementation — CLAUDE-WINDOWS-STAGE

Continue on `feat/cmem-light-local` with one coordinator. Check branch, status
and HEAD. Read [STATE](memory/STATE.md), [TASKS](memory/TASKS.md),
[step 11](../roadmap.md#what-remains-in-step-11),
[Windows preparation](WINDOWS-LOCAL-SETUP.md#claude-code-and-bedrock-preparation),
and [VERIFY-11-LOCAL](handoffs/VERIFY-11-LOCAL.md). A31 accepts the existing
Codex CLI result and takes Codex Desktop out of the current delivery path.

## One source task

Prepare a private, stage-only Claude Code CLI plugin directory for the
intended Windows instance. Use the existing compiled worker, Claude hook
adapter, stdio MCP and local viewer. The Codex stage is a reference for
allowlisted files, path binding, worker ownership and rollback. It currently
binds Codex hooks. The canonical Claude hooks and MCP commands in the
checkout are still unbound. Keep the Claude stage separate from the accepted
Codex artifact.
[Codex staging](../../scripts/enterprise-local/codex-local.mjs#L170)
· [Claude hook manifest](../../plugin/hooks/hooks.json)
· [MCP manifest](../../plugin/.mcp.json).

1. Confirm the intended native Windows Claude CLI version and its documented
   session-scoped local loading and hook/MCP command format. Verify support
   against the intended version, including Windows quoting and approved
   plugin/trust policy. Use the official local-directory mechanism when
   permitted. If the target is an Anthropic-hosted session on another
   machine, stop and scope that different environment.
2. Reuse the smallest existing staging and owned-worker paths that fit.
   Render explicit hook and MCP commands for the Claude adapter, preserve
   event and working-directory semantics, and use the same local SQLite,
   Chroma and MiniLM. Keep the worker loopback-only. Keep install and startup
   free of account signup, automatic acquisition and hidden fallback.
3. Complete the stage with focused source/staging checks under the applicable
   launch. Verify allowlisted contents and a receipt for the Claude stage,
   correct Windows paths including spaces, safe refusal for invalid bindings
   or an unavailable worker, and unchanged Codex staging behavior. Document
   how to exercise the stage later using synthetic projects and a simulated
   worker model. Distinguish direct fixture calls from real host dispatch.

Completion is a testable bound stage with evidence and an explicit list of
what still needs actual Claude CLI execution, or a concrete version/policy
blocker. The next implementation launch must set its exact scope.

## Keep these follow-ups on the route

- **Pending-event recovery before daily use.** VERIFY-11-LOCAL saw two
  provider-refused events disappear from the RAM queue on graceful shutdown.
  Committed SQLite rows and Chroma vectors survived. Trace the existing hook
  spool and transcript recovery path with synthetic events. Implement the
  smallest deliberate recovery that preserves capture policy and identity.
  Verify that restart exposes recoverable work, deliberate replay stores it
  without duplicates, and no request is automatically resent after an
  ambiguous outcome. Avoid restoring the old blind startup queue sweep.
  Keep the separate local auth HTTP 500 visible.
- **Claude host and Bedrock acceptance.** On the authorized Windows instance,
  first check private plugin loading, real hook dispatch, MCP, two synthetic
  projects, search and data-preserving removal. Then check the host's
  interactive Bedrock route and, if selected, the worker's explicit Bedrock
  profile as separate results. AWS SSO authorizes model calls. Windows and
  Claude Code policy govern project, hook and MCP access. Confirm model,
  profile, region, payload, retry behavior and budget before live calls.
  The [runbook template](WINDOWS-LOCAL-SETUP.md#claude-code-and-bedrock-preparation)
  supplies placeholders. Use the verified results for the operating guide.

This handoff does not authorize registration, Claude runtime, corporate AWS
calls, live inference, real state access, admin/UAC, CI, push, publication
or agents. D11 stays deferred.
