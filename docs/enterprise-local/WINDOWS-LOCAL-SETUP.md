# Private CLI plugin setup on Windows

**Current cleanup reference check, 2026-11-11:** use the pinned Node with
`scripts/enterprise-local/verify-cleanup-reference.mjs` and optionally
`--host claude`. This verifies the original cleanup reference destination,
811 receipt source inputs and copied-build hashes; it refuses another path.
It does not refresh a portable inventory or the old SBOM. Runtime bytes stayed
unchanged during merge verification. [Current readiness](cleanup/MERGE-READINESS.md)
still recommends closing the retained Windows regression gate before merge.

**Cleanup branch, 2026-11-11:** new source/bundles use `cmem-light` display
metadata and retain only Claude Code/Codex hosts. The old inventories/SBOM and
their verifier defaults describe earlier bytes. The
[cleanup receipt](artifacts/windows-x64-cleanup-receipt.json) covers the exact
new synthetic reference stages; it is destination-bound, not a transfer receipt.
Do not present an old inventory as valid for a new build. Refresh destination
binding/inventory before target transfer. [Checks and limits](cleanup/RESULTS.md).

The launcher installs a copy of this checkout's compiled plugin under a new
user-writable directory. It registers `claude-mem@cmem-light-private` in a
dedicated Codex CLI home. The launcher runs the worker in the foreground on
IPv4 loopback and binds the installed hooks and MCP entry to that instance.
Codex requires the user to review and trust plugin hooks in `/hooks`.

This setup covers the Windows host and worker lifecycle. SQLite is embedded in
Bun. Chroma uses the separately prepared Windows x64 runtime below.
Use synthetic data for setup acceptance until the remaining phase-one checks
are complete. See [WINDOWS-09-LOCAL evidence](handoffs/WINDOWS-09-LOCAL.md).

The fork build and registration copy the compiled worker and its Python adapter.
Prepare Python packages and embedding weights separately on the target machine.

The private catalog includes the worker, search MCP, context reader, SQLite
helpers, viewer and modes. It exposes the memory search, smart explore,
knowledge agent, request progress and owner goals skills. The launcher generates
the hook and MCP commands for that installation. Standalone server, legacy
installer and other host artifacts stay outside the catalog.
[Package boundary and checks](handoffs/RUNTIME-10-LOCAL.md).

## Prepare the build

Use direct user-accessible Node 22.23.4, npm 10.9.9, Bun 1.4.4 and Codex
executables. Use their matching Windows architecture. Registration was tested
with Codex CLI 0.167.0-alpha.3.2. Check `codex plugin add --help` and
`codex plugin marketplace add --help` on the target if the CLI differs.

From the checkout in a regular PowerShell terminal, use the existing
dependencies when available. For a fresh dependency tree only, the separate
preparation commands are `npm.cmd ci --ignore-scripts --no-audit --no-fund` and
`npm.cmd --prefix src/ui/my-work ci --ignore-scripts --no-audit --no-fund`.
The compile command is `npm.cmd run build:compile`. Keep the chosen Node
directory first on this terminal's PATH for npm and build subprocesses.
Compilation does not use the marketplace synchronization or worker restart scripts.

## Prepare local Chroma

Run once from the checkout in an ordinary PowerShell terminal. Use the direct
64-bit CPython 3.13.15 executable installed for your user. Substitute its actual
path. Keep this venv on the machine where you create it.

```powershell
$python = 'C:\Tools\Python313\python.exe'
$chromaRuntime = Join-Path $env:LOCALAPPDATA 'cmem-light\chroma-runtime'
& .\scripts\prepare-local-chroma.ps1 -Python $python -RuntimeDir $chromaRuntime
```

The preparation script installs the [hash-locked Windows wheels](../../scripts/chroma-local-requirements.txt)
from PyPI into `$chromaRuntime\venv` and verifies dependencies with `pip check`.
It stages the pinned model into `$chromaRuntime\model\model.onnx` and
`$chromaRuntime\model\tokenizer.json` over HTTPS. It verifies SHA-256 before
moving each partial file into place and reuses assets whose hashes match.
The wheel lock and publisher revision are recorded in
[CHROMA-07-LOCAL](handoffs/CHROMA-07-LOCAL.md).

After private registration, add these values to `$local\data\settings.json`
while the worker is stopped. Preserve other settings. Replace the path with
the value printed by the preparation command and escape backslashes in JSON.

```json
{
  "CLAUDE_MEM_CHROMA_ENABLED": "true",
  "CLAUDE_MEM_CHROMA_RUNTIME_DIR": "C:\\Users\\You\\AppData\\Local\\cmem-light\\chroma-runtime"
}
```

Start the private worker without `--lifecycle-only` to exercise Chroma.
Open `http://127.0.0.1:<port>/viewer`, using the port selected at registration,
then **Settings → Local runtime**. The panel runs the same
semantic query probe as `/api/chroma/status?deep=true`. Check after at least
one memory is indexed. A missing or invalid asset appears as **Setup required**.
Use **Recheck status** after preparing assets or indexing a memory. Worker startup
never invokes the preparation script. Keep `claude-mem.db` as the canonical
data. The derived vector store is `$local\data\chroma-minilm-v1` and its
checkpoint is `$local\data\chroma-minilm-v1-sync-state.json`.

## Register the local copy

Select a new directory and a free local port. Set the three executable paths to
direct `.exe` files on this machine.

```powershell
$node = 'C:\Tools\node-v22.23.4\node.exe'
$bun = 'C:\Tools\bun-1.4.4\bun.exe'
$codex = 'C:\Tools\codex\codex.exe'
$local = Join-Path $env:LOCALAPPDATA 'cmem-light-private'
$port = 43985

& $node .\scripts\enterprise-local\codex-local.mjs install --root $local --codex $codex --bun $bun --port $port
$launcher = Join-Path $local 'codex-local.mjs'
& $node $launcher host plugin list
```

For a transfer to matching Windows, carry `codex-local.mjs` and the compiled
`plugin` tree. Pass `--bundle` with the absolute path to the transferred
`plugin` folder and provide direct executable paths on the destination.
The installer renders absolute commands for the destination. Install a fresh
copy after moving the files or changing executable paths.

## Start and stop

Save the observer choice in a small JSON file. The host and observer choices
are separate. For a synthetic lifecycle test, choose an owned loopback fake
LLM endpoint and a synthetic model. For example, with a test server on port
43984 the file can contain:

```json
{"provider":"openai-compatible","baseUrl":"http://127.0.0.1:43984/v1","model":"synthetic-test-only"}
```

In the worker terminal, set a dummy key for that test server and start the
foreground process. `--lifecycle-only` is for loopback test profiles and
disables vector search only for that process.

```powershell
$env:CLAUDE_MEM_OPENAI_COMPAT_API_KEY = 'synthetic-key'
& $node $launcher start --profile C:\Tests\observer.json --lifecycle-only
```

For the Codex observer path, use `provider: "codex"`, the exact chosen `model`
and an explicit `authHome` pointing at a Codex home with native ChatGPT login.
Use `host login` to sign in to the dedicated host profile if you choose it.
For an explicitly selected OpenAI-compatible HTTPS endpoint, supply the key
through the same environment variable and select the endpoint and model in the
profile. No default observer profile is generated by the installer. Claude
Code/Bedrock/AWS SSO and the other supported routes can use the full profile
object as the `--profile` file. The full object also supports summary and
compression overrides. Check `/api/health` for the effective choices.
[Full profile configuration](LLM-PROFILES.md#main-worker-configuration).

With the worker ready, use another ordinary PowerShell terminal with the same
`$node` and `$launcher` variables. Open Codex in the intended project and review
the generated hooks through `/hooks`. Open the memory viewer through the
running worker at `http://127.0.0.1:<port>/viewer`. With the example port above,
the address is `http://127.0.0.1:43985/viewer`. The root URL opens My Work.
The HTML file in the build is a template that depends on the viewer bundle
and the worker's same-origin API. Open the worker URL in your browser.

```powershell
& $node $launcher host -C C:\Tests\synthetic-project
& $node $launcher stop
```

Close the Codex session before unregistering the plugin. `stop` signals the
launcher for this installation, which verifies its worker identity before
sending the loopback shutdown. The foreground command reports failure if it
has to force-terminate the child. If the launcher itself was terminated
abruptly, verify that its worker and port are gone before clearing a stale
`worker-active` control directory. No port reclaim is needed.

```powershell
& $node $launcher uninstall
```

This removes the two Codex registrations. The dedicated profile, copied files
and SQLite data stay under `$local` for inspection and backup.

[Local plugin catalogs in OpenAI Docs](https://developers.openai.com/plugins/build/plugins)

## Recover pending generation

With the private worker running, list available receipts from the same
machine. The response contains item IDs, versions, session IDs, event types
and timestamps. Use the port bound to this worker.

```powershell
$recovery = 'http://127.0.0.1:43985/api/processing/recovery'
(Invoke-RestMethod $recovery).items | Format-Table
```

Review the selected profile in `/api/health` before authorizing a new call.
`undispatched` means the worker never admitted the generation request to the
transport. `outcome_unknown` means it reached that boundary and the worker
has no committed result. The provider may already have processed or billed
the call. Explicitly acknowledge that possibility to resend such an item.
Use the ID and version from the list and recover related observations before
their summary.

```powershell
$id = 1       # Use the selected item's ID.
$version = 0  # Use the selected item's version.
Invoke-RestMethod $recovery -Method Post -ContentType 'application/json' -Body (
  @{ id = $id; version = $version; acknowledgeUnknown = $false } | ConvertTo-Json
)
```

HTTP 202 means the item was queued for processing. A stale or already queued
selection returns 409, and a completed or unavailable item returns 404.
The list omits work already buffered in the live worker and completed
receipts. Restart leaves previously accepted work available for this action.
The API uses the worker's local control surface. The separate Better Auth
HTTP 500 observed in the checkout remains open.
[Recovery checks](handoffs/RECOVERY-11-LOCAL.md).

## Claude Code and Bedrock preparation

Stage and verify the private copy on a matching Windows x64 host with
the pinned direct Node and Bun executables. Use a new destination with an
existing parent, a free loopback port, and the paired compiled `plugin/`
directory. Staging only writes files. The renderer prints the directory
to pass to Claude Code later. The exact receipt should be stored outside
the staged tree and created before adding settings or starting the worker.
[Stage evidence](handoffs/CLAUDE-WINDOWS-STAGE.md)
· [Claude inventory](artifacts/claude-windows-x64-inventory.json).

```powershell
$boundClaudePluginDirectory = & $node scripts/enterprise-local/codex-local.mjs stage-claude `
  --root $claudeStage --bun $bun --port $port
if ($LASTEXITCODE -ne 0) { throw 'Claude stage failed' }
$receipt = & $node scripts/enterprise-local/verify-claude-stage.mjs `
  --candidate $claudeStage --bun $bun --port $port
if ($LASTEXITCODE -ne 0) { throw 'Claude stage verification failed' }
$receipt | Set-Content -LiteralPath $receiptPath -Encoding utf8
```

The bindings use absolute paths. Re-stage at the intended destination
and verify again after moving the tree or changing paths or port. If a
new compiled worker or renderer changes staged bytes, review the diff
and regenerate the inventory from a clean verified stage before target
acceptance. A raw transfer can be checked for byte equality with
`--bound-root` set to the original destination. It still needs binding
at the operational location.

### Windows host and project access

- Run Claude Code CLI, the worker and the local Chroma sidecar on the
  Windows instance that holds the projects. The desktop or remote IDE can
  provide the terminal session. Loopback refers to that Windows instance.
- Use the Windows user's existing permissions for the approved project
  directories. Test two synthetic project directories with the same private
  plugin and worker. Verify existing project/worktree attribution and
  search filters. Keep managed Claude Code plugin/trust policy in force.
- Use separate scratch Claude configuration, worker data and ports during
  verification. Keep the normal installation and memory stores available.
  Use a session-scoped local plugin load where policy permits it. Validate
  the intended Claude CLI version's flag and hook schema.
  [Claude Code settings scopes](https://code.claude.com/docs/en/settings)
  · [Claude CLI plugin flags](https://code.claude.com/docs/en/cli-reference).

On the authorized target, confirm the exact Claude CLI version and managed
policy for session-local plugins, Windows exec-form hooks (`command` plus
`args`) and stdio MCP. Both entry points expect the CLI to export
`CLAUDE_PLUGIN_ROOT`. Keep a scoped Claude configuration for the test.
Set up local Chroma and stage-specific settings as above, then start the
worker in a dedicated terminal with an explicit loopback fixture profile.
Wait for readiness before loading the plugin.

```powershell
$claudeLauncher = Join-Path $claudeStage 'claude-local.mjs'
& $node $claudeLauncher start --profile $fixtureProfile
```

Use the approved Claude executable from each synthetic project directory.
The host's own model activity requires separate scope.

```powershell
& $claudeExecutable --plugin-dir $boundClaudePluginDirectory
```

Check actual SessionStart, prompt, tool success/failure, Stop and end
dispatch with the intended CLI. Verify the two projects' stored sessions,
observation/summary capture, SQLite and semantic search filters, and MCP
search. Include a subdirectory launch to verify project anchoring. Record
async hook timing and trust prompts, and keep the same worker for both
projects. Close both sessions and run `& $node $claudeLauncher stop`. Confirm
the process and listener exit. Future sessions can omit `--plugin-dir`;
keep the stage's `data` directory for data-preserving rollback.
[Hook execution forms](https://code.claude.com/docs/en/hooks#exec-form-and-shell-form)
· [Plugin loading](https://code.claude.com/docs/en/plugins).

### Two Bedrock settings surfaces

For the interactive CLI, use the organization's approved Bedrock mode and
AWS IAM Identity Center session. The documented manual configuration selects
Bedrock mode with `CLAUDE_CODE_USE_BEDROCK=1` and an explicit `AWS_PROFILE`.
Confirm the effective Bedrock region and model or inference profile with the
organization. IAM Identity Center and Bedrock can use different regions.
Keep authentication in the host's normal approved flow.
[Claude Code on Amazon Bedrock](https://code.claude.com/docs/en/amazon-bedrock).

If the memory worker should generate observations and summaries through
Bedrock as well, its separate profile has this shape. Replace each placeholder
with a confirmed input before enabling it. Keep credentials out of the file.

```json
{
  "default": {
    "id": "windows-bedrock-observer",
    "provider": "claude",
    "auth": "aws-sso",
    "executable": "<absolute path to approved Claude executable>",
    "awsPath": "<absolute path to approved AWS CLI executable>",
    "awsConfigFile": "<absolute path to approved AWS configuration>",
    "awsProfile": "<approved IAM Identity Center profile name>",
    "region": "<approved Bedrock region>",
    "model": "<approved Bedrock model ID or inference-profile ARN>"
  }
}
```

The worker invokes the selected AWS CLI/profile to obtain temporary
credentials in its own process environment. An explicit AWS config path
selects configuration. Verify separately that the worker can use the
approved SSO session under its scoped Windows environment, including the
expired-session result. Use the same approved AWS identity as the
interactive host only if that is the selected worker profile. Never copy
SSO cache files into the stage or include credential output in evidence.
[Profile contract](LLM-PROFILES.md#main-worker-configuration)
· [Worker credential resolver](../../src/services/worker/MainWorkerProfiles.ts#L79).

First verify the bound hooks, MCP, local data and search with synthetic
inputs and a loopback worker model. Test the interactive host's Bedrock
route and the worker's Bedrock route as separate results in the authorized
environment. Local MiniLM handles embeddings throughout. Close the test
session and stop the owned worker. Verify cleanup and preserve SQLite data.
[Next launch](NEXT-SESSION.md).
