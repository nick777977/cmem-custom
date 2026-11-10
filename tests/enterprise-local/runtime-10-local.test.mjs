import { afterEach, describe, expect, test } from 'bun:test';
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { stageLocalInstall } from '../../scripts/enterprise-local/codex-local.mjs';

const plugin = fileURLToPath(new URL('../../plugin/', import.meta.url));
const readJson = file => JSON.parse(readFileSync(file, 'utf8'));
const roots = [];
function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'cmem-local-admission-'));
  roots.push(root);
  return root;
}

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

test.skipIf(process.platform !== 'win32')('the private catalog stages only local entrypoints and binds its hooks', () => {
  const root = fixture();
  const bundle = join(root, 'transfer');
  mkdirSync(bundle);
  for (const entry of ['.codex-plugin', 'hooks', 'modes', 'scripts', 'skills', 'sqlite', 'ui']) {
    cpSync(join(plugin, entry), join(bundle, entry), { recursive: true });
  }
  writeFileSync(join(bundle, 'scripts', 'server-beta-service.cjs'), 'throw new Error("unexpected launch")');
  const manifestFile = join(bundle, '.codex-plugin', 'plugin.json');
  const manifest = readJson(manifestFile);
  writeFileSync(manifestFile, JSON.stringify({
    ...manifest, hooks: './unreviewed-hooks.json', mcpServers: './unreviewed-mcp.json', apps: './unreviewed-apps.json',
  }));
  const hooksFile = join(bundle, 'hooks', 'codex-hooks.json');
  const catalog = readJson(hooksFile);
  catalog.hooks.SessionStart[0].hooks[0].commandWindows = 'unreviewed-command';
  catalog.hooks.SessionStart[0].hooks[0].args = ['unreviewed-arg'];
  catalog.hooks.PreCompact = catalog.hooks.SessionStart;
  writeFileSync(hooksFile, JSON.stringify(catalog));

  const config = stageLocalInstall({
    root: join(root, 'private install'), codex: process.execPath, bun: process.execPath, bundle, port: 43985,
  });
  const staged = join(config.root, 'catalog', 'plugin');
  for (const file of [
    'scripts/worker-service.cjs', 'scripts/mcp-server.cjs', 'scripts/context-read-worker.cjs',
    'scripts/chroma-local.py', 'sqlite/SessionStore.js', 'ui/viewer.html',
    'skills/request-progress/scripts/request-groups.mjs', 'skills/owner-goals/scripts/save_goals.py',
  ]) {
    expect(readFileSync(join(staged, file)).equals(readFileSync(join(bundle, file)))).toBe(true);
  }
  for (const file of [
    'scripts/server-service.cjs', 'scripts/server-service.cjs.map', 'scripts/server-beta-service.cjs',
    'scripts/transcript-watcher.cjs', 'scripts/bun-runner.js', 'dist/npx-cli',
    'skills/cloud-sync', 'skills/backup-setup',
  ]) {
    expect(existsSync(join(staged, file))).toBe(false);
  }
  const stagedManifest = readJson(join(staged, '.codex-plugin', 'plugin.json'));
  expect(stagedManifest.hooks).toBe('./hooks/codex-hooks.json');
  expect(stagedManifest.mcpServers).toBe('./.mcp.json');
  expect(stagedManifest).not.toHaveProperty('apps');
  const { hooks } = readJson(join(staged, 'hooks', 'codex-hooks.json'));
  expect(Object.keys(hooks)).toEqual([
    'SessionStart', 'UserPromptSubmit', 'PreToolUse', 'PostToolUse', 'Stop', 'PostCompact', 'SubagentStart',
  ]);
  expect(hooks.SessionStart[0].matcher).toBe(catalog.hooks.SessionStart[0].matcher);
  expect(hooks.SessionStart[0].hooks[0]).toEqual({
    type: 'command', timeout: 20, command: 'exit 1',
    commandWindows: `"${config.node}" "${join(config.root, 'codex-local.mjs')}" hook context`,
  });
  expect(readJson(join(staged, '.mcp.json')).mcpServers).toEqual({
    'mcp-search': { type: 'stdio', command: config.node, args: [join(config.root, 'codex-local.mjs'), 'mcp'] },
  });
});

describe('compiled worker admission', () => {
  test.each([
    ['server', 'start'], ['server', 'stop'], ['server', 'restart'], ['server', 'status'],
    ['server', 'keys', 'rotate'], ['server', 'jobs', 'status'], ['server-start'], ['server-jobs', 'status'],
  ].map(args => [args.join(' '), args]))('refuses %s before running a neighboring server', (_label, args) => {
    const root = fixture();
    const worker = join(root, 'worker-service.cjs');
    cpSync(join(plugin, 'scripts', 'worker-service.cjs'), worker);
    for (const script of ['server-service.cjs', 'server-beta-service.cjs']) {
      writeFileSync(join(root, script), 'console.log("SERVER_EXECUTED");');
    }
    const run = spawnSync(process.execPath, [worker, ...args], {
      cwd: root, timeout: 10_000, encoding: 'utf8', windowsHide: true,
      env: {
        SystemRoot: process.env.SystemRoot, WINDIR: process.env.WINDIR,
        HOME: root, USERPROFILE: root, APPDATA: root, LOCALAPPDATA: root, TEMP: root, TMP: root,
        CLAUDE_CONFIG_DIR: join(root, 'config'), CLAUDE_MEM_DATA_DIR: join(root, 'data'),
        CLAUDE_MEM_RUNTIME: 'worker', CLAUDE_MEM_WORKER_AUTOSTART: 'false', BUN_INSTALL_AUTO: 'disable',
      },
    });
    expect(run.error).toBeUndefined();
    expect(run.status).toBe(1);
    expect(run.stderr).toContain('LOCAL_WORKER_ONLY');
    expect(run.stdout).not.toContain('SERVER_EXECUTED');
  });
});
