# Next implementation — CLAUDE-WINDOWS-STAGE

Continue on `feat/cmem-light-local` with one coordinator. Check branch, status
and HEAD. Read [STATE](memory/STATE.md), [TASKS](memory/TASKS.md),
[step 11](../roadmap.md#what-remains-in-step-11),
[Windows preparation](WINDOWS-LOCAL-SETUP.md#claude-code-and-bedrock-preparation),
and [VERIFY-11-LOCAL](handoffs/VERIFY-11-LOCAL.md). A31 accepts the existing
Codex CLI result and takes Codex Desktop out of the current delivery path.

The current development Windows machine has Codex only. Claude Code CLI,
its target version and the corporate Bedrock session are inputs for later
target acceptance. Start the source and staging work on the development
machine using the documented local toolchain and disposable fixtures.

## One source task

Prepare a private, stage-only Claude Code CLI plugin directory on the
development machine for later use on the intended Windows instance. Use the
existing compiled worker, Claude hook
adapter, stdio MCP and local viewer. The Codex stage is a reference for
allowlisted files, path binding, worker ownership and rollback. It currently
binds Codex hooks. The canonical Claude hooks and MCP commands in the
checkout are still unbound. Keep the Claude stage separate from the accepted
Codex artifact.
[Codex staging](../../scripts/enterprise-local/codex-local.mjs#L170)
· [Claude hook manifest](../../plugin/hooks/hooks.json)
· [MCP manifest](../../plugin/.mcp.json).

1. Review the documented session-scoped local loading and hook/MCP format
   for native Windows Claude CLI. If the target version is known, use its
   documented contract. Otherwise record the command format used for the
   fixtures as provisional and continue the source and staging work.
   Confirm the actual CLI version, command behavior and managed plugin/trust
   policy during the target test. An Anthropic-hosted session on a different
   machine requires a separate plan.
2. Reuse the smallest existing staging and owned-worker paths that fit.
   Render explicit hook and MCP commands for the Claude adapter, preserve
   event and working-directory semantics, and use the same local SQLite,
   Chroma and MiniLM. Keep the worker loopback-only. Keep install and startup
   free of account signup, automatic acquisition and hidden fallback.
3. Run focused source and staging checks under the applicable launch. Use
   synthetic fixtures to verify allowlisted contents, Windows paths with
   spaces, refusal for invalid bindings or a missing worker, and existing
   Codex staging behavior. Document the later two-project host test with
   simulated worker generation. Distinguish fixture commands from actual
   Claude CLI hook dispatch.
4. Record a separate step-10 receipt for the Claude stage with the source
   build, bound files, exact hashes and prerequisites. The Codex receipt is
   a reference. Keep any provisional CLI version or policy assumptions
   visible. Re-stage and refresh the receipt after changes to relevant
   emitted files, including any shared worker change from recovery work,
   before verifying the exact artifact on the target.

Completion on this machine is a bound test stage, a receipt and focused
fixture results, with target version and runtime checks listed separately
as pending. Report any concrete input or policy constraint that prevents
staging. The next implementation launch must set its exact scope.

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
  verify the current receipt and confirm the intended CLI version and
  managed policy. Check private plugin loading, real hook dispatch, MCP,
  two synthetic projects, search and data-preserving removal. Then check the host's
  interactive Bedrock route and, if selected, the worker's explicit Bedrock
  profile as separate results. AWS SSO authorizes model calls. Windows and
  Claude Code policy govern project, hook and MCP access. Confirm model,
  profile, region, payload, retry behavior and budget before live calls.
  The [runbook template](WINDOWS-LOCAL-SETUP.md#claude-code-and-bedrock-preparation)
  supplies placeholders. Use the verified results for the operating guide.

Scope the development launch to source, guarded compile if needed, staging
and focused fixtures. Claude Code installation, runtime and registration,
corporate AWS calls, live inference and real state access require separate
scope. No admin/UAC, CI, push, publication or agents. D11 stays deferred.
