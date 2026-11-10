# CLAUDE-WINDOWS-STAGE — Windows x64 private stage

This handoff records the original stage. The current inventory uses the
paired recovery build. [Refreshed stage and checks](RECOVERY-11-LOCAL.md).

Closed 2026-11-10 on `feat/cmem-light-local`. Entry
`327980a4f4a45d41edfda005f80b765371c5a646`, renderer and tests
`fc0484bf6e48440875207fb2bc3a67194e5e5a90`, paired compiled plugin
`2bb4746b2d1ab20f06501b80358cbc6ecbe490d9` (15.5.0).
The entire tracked `plugin/` tree matches the paired build. The stage
uses the previously compiled worker, SQLite and local Chroma integration.
This session used the existing Node 22.23.4 and Bun 1.4.4 binaries.

## Step 9 — staging and command fixtures

At renderer SHA above, the [Claude renderer](../../../scripts/enterprise-local/codex-local.mjs#L270)
writes a private plugin under `catalog/plugin`, a root-local launcher and
binding metadata. It reads the existing compiled hook metadata and preserves
matchers, timeouts and async settings for eight capture/context events.
SessionStart context keeps the original startup/clear/compact matcher.
Setup and the legacy SessionStart autostart/preflight groups are omitted.
The plugin manifest uses Claude's default hook, MCP and skills locations.

The [shared worker lifecycle](../../../scripts/enterprise-local/codex-local.mjs#L371)
starts the copied worker in the foreground with the selected model profile,
loopback and private data. The [bound entries](../../../scripts/enterprise-local/codex-local.mjs#L427)
require Claude Code's `CLAUDE_PLUGIN_ROOT` to match the bound directory,
then require the worker's PID marker and matching health PID and compiled path.
Hook stdin passes through to Bun and the existing Claude adapter. The
launcher preserves `CLAUDE_PROJECT_DIR`, the original working directory
and the tool hook opt-outs. Other host environment variables, including
the host's auth configuration, stay outside the hook/MCP environment.
MCP runs over stdio against the same worker.

| Check | Actual result |
| --- | --- |
| Source syntax and paired outputs | Node syntax checks and Git whitespace check passed. No tracked plugin/build output changed, so no compile was needed. |
| Stage layout and refusal | Exact allowlist matched. Absolute executable and argument paths with spaces worked. Existing destination, relative executable, wrong host plugin root, relocated launcher, missing worker and matching PID with the wrong worker path were refused. |
| Direct Claude and Codex Windows commands | Three Node fixture tests passed on the ordinary-user loopback rerun. The compiled Claude exec-form and Codex `commandWindows` prompt hooks wrote synthetic sessions to SQLite with the expected cwd and platform source. Both compiled MCP processes answered initialize/tools-list, exited on EOF and used the private foreground worker. Workers stopped and released their active markers. The synthetic loopback model sentinel received zero requests. Chroma was disabled for these narrow lifecycle checks. |
| Codex admission regression | Nine tests, 55 assertions passed in `runtime-10-local.test.mjs` with local scratch TEMP/TMP. The first run inherited an unsuitable TEMP path and its staging test failed path validation. |
| Sandbox limit | The default sandbox run passed staging and failed to confirm worker readiness for both hosts. The ordinary-user loopback rerun above passed without Windows elevation. |

The test drives the emitted commands directly. It uses no Claude CLI or
Codex CLI process, no plugin registration, no user memory or authentication
state, and no AWS or live model. The prior accepted Codex CLI host result
remains tied to its original artifact. Fresh Codex staging from the new
shared launcher changes the launcher bytes, so replay the old Codex
receipt with its [pinned renderer](ARTIFACT-10-LOCAL.md#recheck-on-a-matching-windows-x64-host).

## Step 10 — separate Claude inventory

The original Claude Windows x64 inventory at commit `922eeb841`
records the source and renderer SHAs, 80 staged files, prerequisite Node
and Bun hashes, separate local Chroma assets and the provisional Claude
host contract. All 75 shared copied files matched the prior Codex receipt.
The exact reference stage SHA-256 is
`cd6c19192bdba5af1577f654e88602fe730341aef1e163d51c98104f4227f554`.
The hooks, MCP definition and binding metadata have exact reference
hashes and hashes with the destination parameters normalized. A raw
transfer verified byte-for-byte with the original binding. Without that
binding it was rejected. A separately re-bound stage verified and only
those three hashes changed. A modified hook manifest was rejected.

Use the [setup commands](../WINDOWS-LOCAL-SETUP.md#claude-code-and-bedrock-preparation)
for a new destination. After a reviewed renderer or compiled-output
change, use the following on a newly staged tree and review the inventory
diff before accepting it. Supply full Git SHAs for the paired build and
renderer. Verify again with the reviewed inventory before execution.

```powershell
& $node scripts/enterprise-local/verify-claude-stage.mjs `
  --candidate $claudeStage --bun $bun --port $port `
  --record --build $pairedBuildSha --renderer $rendererSha
```

The reference copy is under
`.scratch/enterprise-local/claude-windows-stage/bound Claude stage/`.
The tracked inventory is reproducible from a clean stage. Store the
fresh exact receipt outside the stage tree before adding settings or data.
For rollback, stop the owned worker and omit the session's `--plugin-dir`.
Use a newly bound stage for a different executable or destination. Preserve
existing worker data when rolling back.

## Pending on the intended Windows instance

The fixture assumes documented Windows exec-form command hooks and
stdio MCP with a session-scoped `--plugin-dir` and `CLAUDE_PLUGIN_ROOT`
exported to both. Confirm the actual Claude Code version supports all eight
events, this format and the managed plugin,
hook and MCP trust policy. In particular, verify cold-start timing and
actual async and SessionEnd dispatch. Run the documented two-project
fixture with real local Chroma, simulated worker generation and a separate
scope for any model activity by the Claude host. Bedrock for the host
and for the worker are separate acceptance checks.
[Claude hook reference](https://code.claude.com/docs/en/hooks#exec-form-and-shell-form)
· [Plugin loading](https://code.claude.com/docs/en/plugins)
· [Plugin manifest reference](https://code.claude.com/docs/en/plugins-reference).

Step 11 recovery and the refreshed receipt are recorded separately. The
auth HTTP 500 remains open. [Recovery evidence](RECOVERY-11-LOCAL.md)
· [Next launch](../NEXT-SESSION.md).
