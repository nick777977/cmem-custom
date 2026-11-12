# CLAUDE-WINDOWS-VERIFY — preparation and target procedure

2026-11-11. **Target acceptance NOT RUN.** The owner confirms that Claude
will run on another Windows host and requests preparation here. Its approved
CLI path/version, managed policy, runtime paths and live host scope are not yet
available. Do not replace this check with direct hook fixtures.

**Owner target clarification, 2026-11-12:** launch is `claude` in Windows
PowerShell, Anthropic Claude Code installed globally through npm, auth through
Bedrock/AWS SSO. Actual CLI command resolution/version/platform is unobserved.
Resolve the approved npm shim and underlying executable/script on target before
using direct exec-form assumptions below. Do not reinstall merely to obtain
an assumed `.exe`, weaken binding checks or ask the owner to guess internals.
Superseding owner selection A40: automatic observations/summaries are required;
use Haiku through that existing Claude Code installation and the same approved
Bedrock/SSO access. Provider/family is decided. Exact approved model ID/inference
profile/region and bounded live-test payload/budget remain target inputs; no
live acceptance or AWS execution here. Keep Codex and ordinary Claude login
routes. Fake worker generation for the first host check is still a test seam,
not the final daily-use setup.

**Transfer note, 2026-11-12:** development is continuing in Claude Code on the
other machine. First use [the bootstrap prompt](../CLAUDE-CODE-BOOTSTRAP.md).
Some historical commit IDs below are absent from the current Git object store;
their cause is unknown. At transfer entry `afcf03689c0ab3749c5bdc8930e45fadf309223f`,
available build candidate `b5b988931312e2b45b7b7e311250b3d148d122bc` has the
same recorded plugin tree `96b9e22d975767da37850eb3e85ba85f05ef04c9`;
renderer candidate is `d4e8259ae3d70f8f5bc4bc269ae6d2004051ce7f`, with the
recorded file SHA-256. All 76 copied-source hashes match the cleanup file
receipt. These are fresh content checks, not proof of identical historical
commits or a rerun of runtime acceptance. Preserve the old receipt metadata;
record actual resolvable SHAs separately. Reconfirm these candidates on target
before using the commands. Do not blindly run a diff against an absent object.

## Completed here: files only

Entry was clean `feat/cmem-light-local` at
`68d08474ffa0936779086a648bb54ef9bd940b9b`, the owner's regular merge with
parents `a9364604d026d79be8ab771ecb861688972d169c` and
`dacfdcd9d13e90710893d938099af981c10ab691`. Cleanup ancestry returned 0.
The local token is ordinary user, Windows x64. `claude` was absent from PATH;
no search of user installation/settings/auth directories was performed.

The whole tracked `plugin/` tree is unchanged from paired build
`dff499e45c3116d8cb8936733d0edf8f220797a6`; its Git tree is
`96b9e22d975767da37850eb3e85ba85f05ef04c9`. The renderer is unchanged from
`a5c3c236423401affc62ef8ab8ee3e6485b28cf2`. No compile was necessary.

The [review](../artifacts/claude-windows-verify-preparation.json) records
75 copied plugin files byte-equal to the current merged plugin and cleanup
file hashes, the byte-equal copied renderer, and four reviewed generated
files: manifest, hooks, MCP and binding. All 80 files passed the existing
unmodified verifier **without `--record`** after inventory review.

- [Reviewed current inventory](../artifacts/claude-windows-x64-inventory.json):
  SHA-256 `08dba457d9d931605816df6015db4b2fbcd0c8a5a02d8eb5c8f3ba67e5bcff21`.
- [Exact local preparation receipt](../artifacts/claude-windows-verify-preparation-receipt.json):
  stage digest `f3eec86c0c75b26202cebd762f364f49ae802ffdc4430d54012cf98a7eb235a1`.
- Local root: `.scratch/enterprise-local/claude-windows-verify/current Claude stage`,
  bound to port 58951. This is a files-only reference, not the other host's stage.
- Node 22.23.4 SHA-256
  `dccc52de28d8df2ee22d2062424f8c563070d95d8ad70c54c4bf01d590dec14f`;
  Bun 1.4.4 SHA-256
  `cb1d8e6564e655e49d30cead359750a1cbbd12f42651caa4b62244d7bd93c244`.
  Canonical local executable paths are in the review. Nothing was upgraded.

The historical recovery inventory had ten changed normalized paths, plus a
replacement Work View JS asset (one removed/one added). Changes cover cleanup
metadata/renderer, worker/context/SQLite/resource handling, request groups and
viewer/Work View. The full before/after list is in the review. The three
normalized destination-bound files are unchanged; no verifier rule was relaxed.

**Historical source receipt limitation:** 811/813 raw source-input hashes
match. `scripts/sync-plugin-manifests.js` and `src/cli/adapters/index.ts` do
not match the cleanup receipt's raw hashes. Their Git blobs at cleanup source
`974d779e40e85b345149c86a37363cdf78fc31b9` and entry HEAD are identical, and
their current text matches those blobs after newline normalization. Exact
historical working bytes were not reconstructed; the raw receipt check is
not PASS. Do not edit those files to chase a historical hash. Current compiled
bytes, renderer and copied-file hashes match independently. The cleanup
receipt remains unchanged; this limitation is recorded separately.

No worker, Chroma, Claude host, browser, provider, AWS or authentication
process ran here. No loopback listener or memory database was created. Reuse
the completed cleanup tests/build/runtime results; no tests or full suite were
replayed. This preparation does not add target runtime evidence.

Static source citations, inspected at `68d08474ffa0936779086a648bb54ef9bd940b9b`:
[renderer](../../../scripts/enterprise-local/codex-local.mjs#L270),
[bound host admission](../../../scripts/enterprise-local/codex-local.mjs#L427),
[record mode](../../../scripts/enterprise-local/verify-claude-stage.mjs#L63),
[normal verification](../../../scripts/enterprise-local/verify-claude-stage.mjs#L77),
[summary protocol marker](../../../src/sdk/prompts.ts#L8).
These are source facts, not actual Claude dispatch evidence.

## 1. Fill the target record before execution

The authorized operator supplies these nonsecret values. Missing fields keep
the corresponding check NOT RUN, rather than triggering automatic discovery
of real settings or credentials.

| Field | Required value |
|---|---|
| Target | Approved Windows x64 instance; CLI, worker, projects and Chroma on that instance |
| Token | Ordinary Windows user; reject an elevated token; no UAC/system service/machine configuration |
| Tools | Absolute approved Claude `.exe`, CLI version/hash; direct Node 22.23.4, npm 10.9.9, Bun 1.4.4 and CPython 3.13.15 where applicable |
| Policy | Owner/admin confirms session `--plugin-dir`, exec-form hooks, all supported event names, stdio MCP and synthetic tool permissions; retain managed policy |
| Local paths | Trusted checkout at this preparation or a later reviewed documentation-only commit, new task root, free worker/fake-model ports, prepared target-local Chroma runtime |
| Host model | Exact model ID, auth route, destination/region, synthetic prompt/tool payload and explicit small spend/turn/time budget; no fallback |
| Worker model | Only the deterministic loopback fixture below for this host check; zero live worker budget |
| Later live checks | Interactive Bedrock and worker Bedrock each need separate approved profile/model/region/auth/budget; neither is authorized by this procedure |

Do not copy an installed Python venv or a bound stage from another machine.
Reuse compatible verified target assets. If Chroma is absent, inspect and scope
the existing [preparation command](../WINDOWS-LOCAL-SETUP.md#prepare-local-chroma)
before running it; no upgrade/reinstall by default. No CMEM signup or migration.

Before a live call, agree a concrete model and budget with the owner. A
suggested *budget shape*, not authorization, is at most 4 short host sessions,
12 tool actions total, 10 minutes/session and a small owner-set monetary cap.
If that cannot cover subagent/compact/refusal cases, record them NOT RUN and
scope another bounded call. Do not silently enlarge it. CLI cost estimates
and `--max-budget-usd` in print mode are not exact billing guarantees.

## 2. Stage at the real destination and record its receipt

All remaining commands are **for the authorized target**, not instructions
to run on the preparation machine. Start in the trusted checkout. Replace
placeholders with confirmed values. Keep evidence outside the stage so the
fresh inventory's exact file set can be verified before settings/data exist.

```powershell
$ErrorActionPreference = 'Stop'
if ([Security.Principal.WindowsPrincipal]::new(
  [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole(
  [Security.Principal.WindowsBuiltInRole]::Administrator)) { throw 'Ordinary user required' }
if ([Runtime.InteropServices.RuntimeInformation]::OSArchitecture -ne 'X64') { throw 'Windows x64 required' }
if ((git branch --show-current) -ne 'feat/cmem-light-local') { throw 'Wrong branch' }
git status --short
# Confirm these actual available refs/content on the target first; see transfer note.
$integrationRef = '70913ce5132c185845a5af5b45dff0f53618794f'
$pairedBuildSha = 'b5b988931312e2b45b7b7e311250b3d148d122bc'
$rendererSha = 'd4e8259ae3d70f8f5bc4bc269ae6d2004051ce7f'
git merge-base --is-ancestor $integrationRef HEAD
if ($LASTEXITCODE -ne 0) { throw 'Integration evidence missing/unresolved; review actual history before continuing' }
$sourceHead = git rev-parse HEAD
git diff --exit-code $pairedBuildSha HEAD -- plugin
if ($LASTEXITCODE -ne 0) { throw 'Build changed: review before staging' }
git diff --exit-code $rendererSha HEAD -- scripts/enterprise-local/codex-local.mjs
if ($LASTEXITCODE -ne 0) { throw 'Renderer changed: review before staging' }
# Stop if tracked WIP affects the bundle/renderer/inventory; preserve all WIP.
git diff --exit-code -- plugin scripts/enterprise-local/codex-local.mjs docs/enterprise-local/artifacts/claude-windows-x64-inventory.json
if ($LASTEXITCODE -ne 0) { throw 'Preserve and resolve relevant WIP before staging' }
git diff --cached --exit-code -- plugin scripts/enterprise-local/codex-local.mjs docs/enterprise-local/artifacts/claude-windows-x64-inventory.json
if ($LASTEXITCODE -ne 0) { throw 'Preserve and resolve relevant staged WIP before staging' }
$node = '<approved direct Node 22.23.4 node.exe>'
$bun = '<approved direct Bun 1.4.4 bun.exe>'
$claudeExecutable = '<approved absolute claude.exe>'
$taskRoot = '<new absolute task folder outside real projects and system TEMP>'
$chromaRuntime = '<prepared runtime on this target>'
$port = 58951       # select/check free ports on this target
$fixturePort = 58952
if (Test-Path -LiteralPath $taskRoot) { throw 'Use a new task root' }
New-Item -ItemType Directory -Path $taskRoot | Out-Null
$claudeStage = Join-Path $taskRoot 'Claude stage'
$evidence = Join-Path $taskRoot 'evidence'
New-Item -ItemType Directory -Path $evidence | Out-Null
Get-FileHash -Algorithm SHA256 -LiteralPath $node,$bun,$claudeExecutable
& $node --version
& $bun --version
# Check versions/hashes against the reviewed inputs before continuing.
$boundClaudePluginDirectory = & $node scripts/enterprise-local/codex-local.mjs stage-claude `
  --root $claudeStage --bun $bun --port $port
if ($LASTEXITCODE -ne 0) { throw 'Staging failed' }
$receipt = & $node scripts/enterprise-local/verify-claude-stage.mjs `
  --candidate $claudeStage --bun $bun --port $port
if ($LASTEXITCODE -ne 0) { throw 'Verification failed: do not run or weaken the verifier' }
[IO.File]::WriteAllText((Join-Path $evidence 'stage-receipt.json'),
  ($receipt -join "`n") + "`n", [Text.UTF8Encoding]::new($false))
```

The new target receipt must have 80 files and its **own** stage digest. Path
and port rebinding alone can pass the current normalized inventory. Different
runtime executable hashes or changed bytes require a reviewed fresh inventory
using the existing `--record` procedure in the runbook, not an exception in
the verifier. Record full source/build/renderer SHAs, inventory hash and CLI
hash/version. Do not run the historical Codex artifact verifier against this
Claude stage to certify Chroma assets: its plugin inventory is a different build.

## 3. Prepare isolated host execution and the fake worker model

Create `project-a` and `project-b` under `$taskRoot`, outside the checkout,
HOME and TEMP. Give each its own synthetic Git repository, a committed
`fixture.txt` and `src` subdirectory. Use task-only Git config/identity; no
remote, global config changes or real repository worktree. A's fixture says
`CMEM_A: solar sensor calibration`; B's says `CMEM_B: water pump inspection`.
Later create a detached linked worktree **of synthetic A only** for the
separate attribution case; do not make a task worktree of this repository.

Launch child processes with an environment allowlist: Windows system paths,
approved executable directories, stage-local HOME/USERPROFILE/APPDATA/
LOCALAPPDATA/TEMP/TMP and `CLAUDE_CONFIG_DIR=<stage>/home/.claude`, plus only
the separately approved host auth selectors. Do not inherit provider keys,
proxy/gateway variables, NODE_OPTIONS or ordinary host config. Git discovery
must stay in the synthetic repositories. For CLI `--version`/`--help`, use
the same empty synthetic configuration with no auth selectors and a 15-second
deadline. Confirm the installed CLI's flags before launching a session.
Do not print auth status/token files or copy SSO caches into the test home.
If the approved login cannot work with this isolation, stop for a target auth
scope; using a normal HOME is not an automatic fallback.

For a concrete allowlisted host launch, save this as `$taskRoot/run-host.mjs`.
It does not load a plugin unless passed the plugin flag. Auth variable names
are supplied explicitly after agreement; their values are never logged.

```javascript
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
const [configFile, ...args] = process.argv.slice(2);
const c = JSON.parse(readFileSync(configFile, 'utf8'));
assert(process.platform === 'win32' && process.arch === 'x64');
assert(Number.isInteger(c.deadlineSeconds) && c.deadlineSeconds > 0 && c.deadlineSeconds <= 600);
const system = process.env.SystemRoot;
const env = {
  SystemRoot: system, WINDIR: system, ComSpec: join(system, 'System32/cmd.exe'),
  PATHEXT: '.COM;.EXE;.BAT;.CMD',
  PATH: [dirname(process.execPath), ...c.toolDirectories, join(system, 'System32')].join(';'),
  HOME: join(c.stage, 'home'), USERPROFILE: join(c.stage, 'home'),
  APPDATA: join(c.stage, 'home/appdata'), LOCALAPPDATA: join(c.stage, 'home/localappdata'),
  TEMP: join(c.stage, 'temp'), TMP: join(c.stage, 'temp'),
  CLAUDE_CONFIG_DIR: join(c.stage, 'home/.claude'),
  DO_NOT_TRACK: '1', DISABLE_TELEMETRY: '1', DISABLE_ERROR_REPORTING: '1',
  DISABLE_AUTOUPDATER: '1', CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: '1'
};
const selectable = new Set(['AWS_PROFILE', 'AWS_REGION', 'AWS_DEFAULT_REGION',
  'AWS_CONFIG_FILE', 'AWS_SHARED_CREDENTIALS_FILE', 'CLAUDE_CODE_USE_BEDROCK',
  'CLAUDE_CODE_OAUTH_TOKEN', 'ANTHROPIC_API_KEY', 'ANTHROPIC_AUTH_TOKEN', 'ANTHROPIC_BASE_URL']);
for (const name of c.authEnvNames) {
  assert(selectable.has(name) && process.env[name], 'Unapproved or missing auth selector');
  env[name] = process.env[name];
}
const child = spawn(c.claude, args, { cwd: c.cwd, env, stdio: 'inherit', windowsHide: false });
let closed = false;
const stopOwned = () => {
  if (!closed && child.pid) spawnSync(join(system, 'System32/taskkill.exe'),
    ['/PID', String(child.pid), '/T', '/F'], { windowsHide: true, timeout: 10000, stdio: 'ignore' });
};
const timer = setTimeout(stopOwned, c.deadlineSeconds * 1000);
process.once('SIGINT', stopOwned); process.once('SIGTERM', stopOwned);
child.once('error', () => { closed = true; clearTimeout(timer); process.exitCode = 1; });
child.once('exit', code => { closed = true; clearTimeout(timer); process.exitCode = code ?? 1; });
```

Save `host-launch.json` outside the stage with confirmed absolute paths:

```json
{
  "claude": "<approved claude.exe>",
  "stage": "<claudeStage>",
  "cwd": "<taskRoot>/project-a",
  "toolDirectories": ["<approved Git cmd directory>", "<approved Git Bash bin directory>", "<Bun directory>"],
  "authEnvNames": [],
  "deadlineSeconds": 15
}
```

Run `& $node (Join-Path $taskRoot 'run-host.mjs') <host-launch.json> --version`
and then `--help`. For live sessions, review only the selected auth variable
names/destination, change `deadlineSeconds` to the agreed bound (maximum 600)
and set `cwd` for each synthetic case. This wrapper's forced cleanup is an
ordinary owned-child fallback, not crash-proof containment; still verify PID
and port release. Do not use an inherited normal-shell Claude command instead.

The worker launcher already constructs its private environment. Put only this
synthetic configuration in `<stage>/data/settings.json` while stopped:

```json
{
  "CLAUDE_MEM_CHROMA_ENABLED": "true",
  "CLAUDE_MEM_CHROMA_RUNTIME_DIR": "<prepared target-local runtime>"
}
```

Save the following as `$taskRoot/fake-generation.mjs`. Set the phase file to
`A` or `B` before the corresponding session; this fixture does not inspect or
print request contents. It only handles the worker's explicitly selected
OpenAI-compatible protocol, never Claude's host model protocol.

```javascript
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFileSync, writeFileSync } from 'node:fs';
const [portText, phaseFile, countsFile] = process.argv.slice(2);
const port = Number(portText);
assert(Number.isInteger(port) && port >= 1024 && port <= 65535);
const counts = { observation: 0, summary: 0, rejected: 0 };
const server = createServer(async (req, res) => {
  try {
    assert.equal(req.socket.remoteAddress, '127.0.0.1');
    assert.equal(req.method, 'POST');
    assert.equal(req.url, '/v1/chat/completions');
    assert.equal(req.headers.authorization, 'Bearer synthetic-target-key');
    const chunks = []; let size = 0;
    for await (const chunk of req) {
      size += chunk.length; assert(size <= 2_000_000); chunks.push(chunk);
    }
    const body = JSON.parse(Buffer.concat(chunks).toString());
    assert.equal(body.model, 'synthetic-claude-target');
    const phase = readFileSync(phaseFile, 'utf8').trim();
    assert(['A', 'B'].includes(phase));
    const latest = body.messages.at(-1).content;
    assert.equal(typeof latest, 'string');
    const summary = latest.includes('MODE SWITCH: PROGRESS SUMMARY');
    const text = phase === 'A' ? 'Solar sensor calibration CMEM_A' : 'Water pump inspection CMEM_B';
    const content = summary
      ? `<summary><request>${text}</request><investigated>Synthetic fixture.</investigated><learned>${text}</learned><completed>Read fixture.</completed><next_steps>None.</next_steps><notes>Target test.</notes></summary>`
      : `<observation><type>discovery</type><title>${text}</title><narrative>${text}. Synthetic fixture only.</narrative><facts><fact>${text}</fact></facts></observation>`;
    counts[summary ? 'summary' : 'observation']++;
    writeFileSync(countsFile, JSON.stringify(counts));
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ choices: [{ message: { content } }] }));
  } catch {
    counts.rejected++; writeFileSync(countsFile, JSON.stringify(counts));
    if (!res.headersSent) res.writeHead(400); res.end();
  }
});
server.requestTimeout = 10_000;
server.listen(port, '127.0.0.1');
setTimeout(() => { server.closeAllConnections(); server.close(); }, 30 * 60_000);
```

Write a `fixture-profile.json` outside the stage:

```json
{
  "provider": "openai-compatible",
  "model": "synthetic-claude-target",
  "baseUrl": "http://127.0.0.1:<fixturePort>/v1"
}
```

Use `--check` on this saved script first. Start it in an owned foreground
terminal with arguments `$fixturePort`, `$taskRoot/phase.txt` and
`$evidence/fake-counts.json`:

```powershell
Set-Content -LiteralPath (Join-Path $taskRoot 'phase.txt') -Value 'A' -Encoding ascii
& $node (Join-Path $taskRoot 'fake-generation.mjs') $fixturePort `
  (Join-Path $taskRoot 'phase.txt') (Join-Path $evidence 'fake-counts.json')
```

In another owned
terminal set only the synthetic worker key
`CLAUDE_MEM_OPENAI_COMPAT_API_KEY=synthetic-target-key`, then run:

```powershell
$claudeLauncher = Join-Path $claudeStage 'claude-local.mjs'
& $node $claudeLauncher start --profile (Join-Path $taskRoot 'fixture-profile.json')
```

Do not pass `--lifecycle-only`: it disables Chroma. Wait at most 60 seconds
for `/api/health` and `/api/readiness`, and record PID, compiled worker path,
Chroma status and owned process tree. A failed boot is FAIL with logs/cleanup,
not permission to start another worker or use another model. Deep Chroma
query acceptance is checked after the first indexed memory.

## 4. Actual Claude loading and dispatch

Only after host model/auth/payload/budget agreement, launch the approved CLI
from synthetic A with the isolated environment, a 10-minute session deadline
and normal tool permissions. Use its installed-version-supported equivalent of:

```powershell
& $node (Join-Path $taskRoot 'run-host.mjs') (Join-Path $taskRoot 'host-launch.json') `
  --plugin-dir $boundClaudePluginDirectory --model '<approved exact host model>'
```

No bypass-permissions flag, global plugin registration, auto-update or
`--fallback-model`. Confirm managed settings/trust using the host's supported
UI; retain only sanitized policy/version facts. Store debug evidence only for
these synthetic sessions, outside the stage, using flags supported by this
CLI. Do not manually set `CLAUDE_PLUGIN_ROOT` to fake successful host export.

Ask the host to read only `fixture.txt`, run `cat fixture.txt` with its
approved Bash tool and deliberately attempt `cat missing-target-file` once.
The actions are read-only within the synthetic repository. Ask it to use the
loaded memory MCP search tool for `CMEM_A`. End its turn, then exit normally.
After the worker queue drains, record synthetic SQL rows and Chroma results.
Set phase B and repeat from B using the **same running worker**. Wait for A's
generation to finish before changing phase. Each session must create its own
observation and summary with the appropriate project association.

| Event → handler | Evidence required from actual host |
|---|---|
| SessionStart → context | Startup dispatch; stdin session/cwd/event; recalled A context in a later A session |
| UserPromptSubmit → session-init | Synthetic submitted prompt maps to the host session and Claude source |
| PreToolUse → file-context | Matching Bash call dispatch and context output; record nonmatching tool behavior |
| PostToolUse → observation | Successful tool input/result capture, SQLite observation and local index |
| PostToolUseFailure → observation | Failed read's error/interruption fields and resulting capture, without fabricated success |
| Stop → summarize | Actual turn completion dispatch and committed summary |
| SubagentStop → subagent-stop | Only if supported/policy/budget explicitly includes one synthetic subagent; otherwise NOT RUN/restricted |
| SessionEnd → session-end | Normal exit dispatch; async drain/cleanup timing from the installed CLI |

Compare actual argv with the reviewed exec-form command/args, stdin envelope,
cwd/CLAUDE_PROJECT_DIR and bound root. Record each event's actual duration,
stdout context and configured timeout/async fields. Configuration preservation
alone is not proof of timeout expiry. If no bounded expiry case is exercised,
mark that subcase NOT RUN. Never modify the staged hook commands to make the
host appear to dispatch correctly. Record rejected/unsupported events by name,
CLI diagnostic and practical missing behavior.

In the host's MCP UI confirm the loaded stdio server and tool list; invoke
search through Claude, not a standalone MCP driver. Save the tool result's
synthetic observation ID and match it to SQLite and the selected project.

## 5. Memory, identity, refusal, restart and removal assertions

1. Inspect **only `<stage>/data/claude-mem.db`**, using the copied SQLite
   helpers/Bun in read-only mode. Record session/project/source, observation
   IDs and summary IDs. Use `/api/search` or the host MCP for FTS and semantic
   queries; record requested filter, returned IDs and mode. A's explicit
   filter must exclude unrelated B rows, and vice versa. Russian paraphrases
   such as `калибровка солнечного датчика` and `осмотр водяного насоса` must
   retrieve the intended indexed rows. Check `/api/chroma/status?deep=true`.
2. Open only `http://127.0.0.1:<port>/viewer` and the local My Work view.
   Confirm both synthetic projects, observations/summaries, filters and local
   runtime status. Record local resource origins; no full OS egress claim.
   The separate unused Better Auth session HTTP 500 is not a signup or schema
   migration prerequisite for this flow.
3. With phase A, launch a separate Claude session from `project-a/src`.
   Verify stored project anchoring matches A. Separately use a detached linked
   worktree of synthetic A; record its cwd, project key, shared-root key and
   existing sharing/filter results. Do not equate two independent repositories
   with the worktree case or redesign identity semantics.
4. Close Claude; wait for accepted captures/generation to drain (60 seconds
   maximum). Record SQLite IDs/counts and fake request counts. Stop via
   `& $node $claudeLauncher stop`; verify launcher/worker/Chroma owned children,
   active marker and listener are released within 15 seconds. Restart the same
   stage/profile/data, without a Claude prompt first. IDs/data/index should
   persist and startup must not silently resend generation. Recheck searches.
   Use the [deliberate recovery contract](RECOVERY-11-LOCAL.md) only if dormant
   receipts exist; never acknowledge unknown outcomes automatically.
5. For **actual host refusal**, stop the worker and launch a bounded host
   session with the same plugin. Its hooks/MCP must refuse the stopped worker;
   no worker autostart or generation. This can still cost a host model call:
   include it in the agreed host budget. Test wrong-worker identity separately
   with an owned loopback health decoy and task-only PID marker at this stage;
   its PID may match but `workerPath` must differ. The real Claude dispatch
   must refuse it. Restore/remove only the test marker, stop the decoy and
   verify no extra worker was started. If this fixture is not scoped/prepared
   on the target, record wrong-worker NOT RUN, not PASS from direct fixtures.
6. Close Claude and stop owned worker/fake endpoint/decoy. Prefer graceful
   exit; after the deadline terminate only recorded still-owned descendants,
   never all `node`, `bun`, `python` or `claude` processes. Verify each PID exit
   and free worker/fake ports by a temporary loopback bind/close. Keep SQLite,
   WAL/SHM if present, recovery state and index. For removal, omit
   `--plugin-dir` on the next session; confirm plugin/MCP absence in that host
   session. No normal installation was registered or removed. Reopen the
   synthetic DB read-only and compare retained IDs/counts. Do not recursively
   delete the stage/data as a removal test.

## Target result to return

For every row report PASS / FAIL / NOT RUN, with evidence path and practical
impact: CLI/policy/loading; eight events individually; argv/stdin/context/
timeout/async; MCP through host; stopped/wrong-worker refusal; two projects;
subdirectory; linked worktree/sharing; SQLite/FTS/semantic filters; viewer/My
Work; restart/recovery; removal/data preservation; owned-process/port cleanup.
All of these are currently **NOT RUN on the target**.

Include full source/build/renderer SHAs, target executable hashes/version,
target receipt/inventory hash, exact host model/auth/destination and budget
used, fake-worker counts and zero live worker calls. Record both Bedrock
surfaces separately as NOT RUN unless separately authorized and actually
tested. Do not mark step 11 or daily-use step 12 complete from this preparation.
No new source fix or merge is recommended from files-only evidence; cleanup
integration is already complete. Fix only a demonstrated target defect, with
paired outputs and affected checks. No agent merge/push.

The procedure follows the current official [CLI reference](https://code.claude.com/docs/en/cli-reference),
[exec-form hook contract](https://code.claude.com/docs/en/hooks#exec-form-and-shell-form)
and [settings precedence](https://code.claude.com/docs/en/settings#settings-precedence),
and [traffic/update environment controls](https://code.claude.com/docs/en/env-vars),
consulted 2026-11-11. These establish the documented mechanisms, not support
or managed permissions in the unobserved target version.
