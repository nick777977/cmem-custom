// Reviewed selected local gate, not the full suite or CI. No install or inference.
import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const repo = fileURLToPath(new URL('../../', import.meta.url));
const { values } = parseArgs({ options: {
  bun: { type: 'string' }, python: { type: 'string' },
  file: { type: 'string', multiple: true }, label: { type: 'string', default: 'gate' },
} });
assert.equal(process.platform, 'win32', 'This gate records the Windows baseline');
assert.equal(process.version, 'v22.23.4');
assert(values.bun && values.python, 'Supply the existing --bun and --python executable paths');
assert(/^[a-z0-9-]+$/.test(values.label));
const bun = resolve(values.bun), python = resolve(values.python);
const system = process.env.SystemRoot;
assert(system);
const token = spawnSync(join(system, 'System32/WindowsPowerShell/v1.0/powershell.exe'), ['-NoProfile', '-NonInteractive', '-Command',
  "if ([Security.Principal.WindowsPrincipal]::new([Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) { exit 1 }"],
{ encoding: 'utf8', windowsHide: true, timeout: 10000 });
assert.equal(token.status, 0, 'Administrator token or unavailable token check refused');

// Pin the original 22 failures, independent of subsequent report verdicts.
const original = JSON.parse(readFileSync(new URL('../../docs/enterprise-local/cleanup/merge-verification-results.json', import.meta.url)));
const retained = original.final.filter(row => row.status !== 0).map(row => row.file);
assert.equal(retained.length, 22, 'Historical baseline manifest changed');
const extra = ['tests/services/sqlite/connection-lifecycle.test.ts', 'tests/write-json-file-atomic.test.ts',
  'tests/work-view/request-groups.test.ts', 'tests/enterprise-local/cleanup-reference.test.mjs',
  'tests/infrastructure/cleanup-v12_4_3.test.ts'];
const files = values.file ?? [...retained, ...extra];
for (const file of files) assert([...retained, ...extra].includes(file), `Unreviewed file: ${file}`);

const logRoot = join(repo, '.scratch/enterprise-local/windows-regression-gate/');
mkdirSync(logRoot, { recursive: true });
const logs = mkdtempSync(join(logRoot, `${values.label}-`));
// Outside the checkout: filesystem project discovery intentionally ignores Git ceilings.
const stateRoot = mkdtempSync(join(tmpdir(), 'cmem-windows-regression-'));
const results = [];
try {
  for (const name of ['home', 'config', 'data', 'temp', 'appdata', 'codex', 'npm-cache']) mkdirSync(join(stateRoot, name));
  const empty = join(stateRoot, 'empty.npmrc'); writeFileSync(empty, '');
  const globalNpm = join(stateRoot, 'global.npmrc'); writeFileSync(globalNpm, '');
  const globalGit = join(stateRoot, 'empty.gitconfig'); writeFileSync(globalGit, '');
  // Allowlist, never inherit provider keys, login tokens, proxy hooks or NODE_OPTIONS.
  const baseEnv = {
    SystemRoot: system, WINDIR: system, ComSpec: join(system, 'System32/cmd.exe'), PATHEXT: '.COM;.EXE;.BAT;.CMD',
    PATH: [dirname(process.execPath), dirname(bun), dirname(python), join(system, 'System32'), 'C:/Program Files/Git/cmd'].join(delimiter),
    HOME: join(stateRoot, 'home'), USERPROFILE: join(stateRoot, 'home'),
    APPDATA: join(stateRoot, 'appdata'), LOCALAPPDATA: join(stateRoot, 'appdata'),
    TEMP: join(stateRoot, 'temp'), TMP: join(stateRoot, 'temp'),
    CLAUDE_CONFIG_DIR: join(stateRoot, 'config'), CODEX_HOME: join(stateRoot, 'codex'),
    CLAUDE_MEM_DATA_DIR: join(stateRoot, 'data'), CLAUDE_MEM_WORKER_AUTOSTART: 'false',
    BUN_INSTALL_AUTO: 'disable', DO_NOT_TRACK: '1', CLAUDE_MEM_TELEMETRY_ENABLED: 'false',
    CMEM_TEST_NODE: process.execPath,
    PYTHONUTF8: '1', PYTHONDONTWRITEBYTECODE: '1', PYTHONNOUSERSITE: '1',
    GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: globalGit, GIT_TERMINAL_PROMPT: '0',
    npm_config_userconfig: empty, npm_config_globalconfig: globalNpm, npm_config_cache: join(stateRoot, 'npm-cache'),
    npm_config_offline: 'true', npm_config_audit: 'false', npm_config_fund: 'false', npm_config_update_notifier: 'false',
  };
  for (const [tool, args, expected] of [[bun, ['--version'], '1.4.4'], [python, ['--version'], 'Python 3.13.15'],
    [process.execPath, [join(dirname(process.execPath), 'node_modules/npm/bin/npm-cli.js'), '--version'], '10.9.9']]) {
    const result = spawnSync(tool, args, { env: baseEnv, encoding: 'utf8', timeout: 10000, windowsHide: true });
    assert.equal(result.status, 0, `${expected} version probe failed: ${result.stderr}`); assert.equal(result.stdout.trim(), expected);
  }
  for (const file of files) {
    const state = mkdtempSync(join(stateRoot, 'file-'));
    for (const name of ['home', 'config', 'codex', 'data', 'appdata', 'temp']) mkdirSync(join(state, name));
    const env = { ...baseEnv, HOME: join(state, 'home'), USERPROFILE: join(state, 'home'),
      APPDATA: join(state, 'appdata'), LOCALAPPDATA: join(state, 'appdata'), TEMP: join(state, 'temp'), TMP: join(state, 'temp'),
      CLAUDE_CONFIG_DIR: join(state, 'config'), CODEX_HOME: join(state, 'codex'), CLAUDE_MEM_DATA_DIR: join(state, 'data') };
    const started = Date.now(); let output = '', timedOut = false;
    const child = spawn(bun, ['test', '--timeout', '20000', './' + file], { cwd: repo, env, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
    const timer = setTimeout(() => {
      timedOut = true;
      // Ordinary user cleanup of this still-owned child and descendants only.
      spawnSync(join(system, 'System32/taskkill.exe'), ['/PID', String(child.pid), '/T', '/F'], { windowsHide: true, timeout: 10000 });
    }, 90000);
    child.stdout.on('data', data => { output += data; }); child.stderr.on('data', data => { output += data; });
    const status = await new Promise((done, reject) => {
      child.once('error', reject); child.once('close', done);
    }).finally(() => clearTimeout(timer));
    writeFileSync(join(logs, file.replaceAll('/', '_') + '.log'), output);
    const row = { file, status, timedOut, ms: Date.now() - started,
      pass: Number(output.match(/(\d+) pass\b/)?.[1] ?? 0), fail: Number(output.match(/(\d+) fail\b/)?.[1] ?? 0), skip: Number(output.match(/(\d+) skip\b/)?.[1] ?? 0) };
    results.push(row); console.log(JSON.stringify(row));
    writeFileSync(join(logs, 'results.json'), JSON.stringify({ node: process.version, bun: '1.4.4', python: '3.13.15', sourceHead: spawnSync('git', ['rev-parse', 'HEAD'], { cwd: repo, env, encoding: 'utf8' }).stdout.trim(), results }, null, 2));
  }
} finally {
  // This root was created above, contains only synthetic state, and is never a user data root.
  rmSync(stateRoot, { recursive: true, force: true });
}
console.log(JSON.stringify({ logs, files: results.length, failedFiles: results.filter(r => r.status !== 0 || r.timedOut).length }));
process.exitCode = results.some(r => r.status !== 0 || r.timedOut) ? 1 : 0;
