# Next implementation — RECOVERY-11-LOCAL

Continue on `feat/cmem-light-local` with one coordinator. Check branch,
HEAD and status. Read [STATE](memory/STATE.md), [TASKS](memory/TASKS.md),
[step 11](../roadmap.md#what-remains-in-step-11),
[VERIFY-11-LOCAL](handoffs/VERIFY-11-LOCAL.md) for the failing case, and
[CLAUDE-WINDOWS-STAGE](handoffs/CLAUDE-WINDOWS-STAGE.md) for the current
Windows stage and its paired inventory.

## One source task

Implement deliberate recovery of pending generation after worker restart.
Trace the existing hook spool, worker queue, session storage and transcript
recovery for the two synthetic cases lost on graceful stop. Reuse their
durable state and idempotency where possible. Preserve capture exclusions,
project/worktree identity and the existing SQLite/Chroma responsibilities.

- After restart, surface recoverable work and distinguish events that were
  never dispatched from requests whose outcome could not be determined.
- Recover on deliberate action. Store the resulting observation or summary
  at most once, including repeated recovery requests or a restart around
  commit. Keep completed items out of the replay set.
- An ambiguous provider outcome must not trigger an automatic resend on
  startup or retry. Check interruption after dispatch, before a durable
  result, and recovery after an already committed result. Do not restore
  the old blind startup sweep.
- Verify with a disposable local worker and deterministic synthetic
  loopback responses. Keep the separate local auth HTTP 500 visible.
  If the shared worker or any staged byte changes, pair the emitted
  build and re-stage and re-pin the Claude copy before target verification.
  Repeat affected Codex CLI-path regressions.

The next launch scopes source, guarded compile, staging and synthetic
runtime checks. No Claude CLI, registration, AWS, live models, real state,
admin/UAC, CI, agents, publication or push in that recovery launch.
D11 remains deferred.

## After recovery

On the separately authorized Windows instance, verify the refreshed
receipt, actual CLI version and managed plugin/trust policy. Test local
loading, real hook dispatch, MCP and search across two synthetic projects
with simulated worker generation. Check data-preserving removal.
The [target runbook](WINDOWS-LOCAL-SETUP.md#claude-code-and-bedrock-preparation)
lists the steps. The interactive Bedrock route and the worker's explicit
Bedrock profile are separate live results. Confirm model, AWS profile,
region, payload, retry behavior and budget before any live calls. Codex
Desktop is outside the current route.
