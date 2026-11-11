# Next target check — CLAUDE-WINDOWS-VERIFY

**Separate cleanup launch, 2026-11-11:** on `codex/repository-cleanup-plan`, use
[the implementation prompt](cleanup/NEXT-SESSION.md), [final plan](cleanup/README.md),
[exact candidates](cleanup/removal-targets.tsv) and ownership board. The owner
now approves CI/CD and eight presentation PDF removal, non-target host retirement,
custom local branding and detachable server/cloud deployment cleanup. Keep local
tests/build, useful development records, the two target hosts and selected
provider/auth routes. Preserve actual retained-code provenance as the plan's
explicit exception to blanket author removal. Implement the three slices in one
bounded session; defer invasive shared refactors, do not seek repeated scope
approval. This pointer does not start/replace the main target below.

Continue on `feat/cmem-light-local` with one coordinator. Check branch,
HEAD and status. Read [STATE](memory/STATE.md), [TASKS](memory/TASKS.md),
[step 11](../roadmap.md#what-remains-in-step-11),
[recovery evidence](handoffs/RECOVERY-11-LOCAL.md) and the
[refreshed Claude inventory](artifacts/claude-windows-x64-inventory.json).
Use the [Windows target runbook](WINDOWS-LOCAL-SETUP.md#claude-code-and-bedrock-preparation).

## One task on the separately authorized Windows instance

Stage and verify the paired private Claude plugin on the intended
ordinary-user Windows x64 instance. Record the actual Claude Code CLI
version and the managed plugin, hook and MCP trust policy that applies.
Use a dedicated worker and disposable state with deterministic loopback
worker generation. Verify real CLI loading and hook dispatch, stdio MCP,
search through the local worker across two synthetic projects, and
data-preserving removal. Use the prepared local Chroma assets for search.
Record project/worktree coverage separately from the two-project fixture.
Include the receipt hash, actual passed checks and any remaining target
restrictions in the handoff. Keep the separate local auth HTTP 500 visible.

Target CLI execution and any registration require the target launch's
explicit scope. Use the session-scoped private load described in the
runbook. The interactive Bedrock route and the worker's explicit Bedrock
profile require separate live results. Confirm model, AWS profile, region,
payload, retry behavior and budget before any live calls.
D11 remains deferred. Codex Desktop is outside this route.
