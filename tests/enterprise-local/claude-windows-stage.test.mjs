import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { once } from 'node:events';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, join } from 'node:path';
import { createInterface } from 'node:readline';
import { DatabaseSync } from 'node:sqlite';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { stageClaudePlugin, stageLocalInstall } from '../../scripts/enterprise-local/codex-local.mjs';

const bundle = fileURLToPath(new URL('../../plugin', import.meta.url));
const scratch = process.env.CMEM_STAGE_TEST_SCRATCH ?? fileURLToPath(new URL('../../.scratch/enterprise-local/claude-windows-stage/', import.meta.url));
const inventory = JSON.parse(readFileSync(new URL('../../docs/enterprise-local/artifacts/windows-x64-cleanup-receipt.json', import.meta.url)));
const bun = process.env.CMEM_STAGE_TEST_BUN;
const read = file => JSON.parse(readFileSync(file, 'utf8'));
const plugin = root => join(root, 'catalog', 'plugin');
const launcher = root => join(root, 'claude-local.mjs');
const settings = env => ({ env, encoding: 'utf8', windowsHide: true, timeout: 12_000 });

function fixture() {
  assert.equal(process.platform, 'win32');
  assert(bun, 'Set CMEM_STAGE_TEST_BUN to the pinned Bun executable');
  mkdirSync(scratch, { recursive: true });
  return mkdtempSync(join(scratch, 'fixture '));
}

function entries(root, path = '') {
  return readdirSync(join(root, path), { withFileTypes: true }).flatMap(entry => {
    const name = path ? `${path}/${entry.name}` : entry.name;
    if (entry.isDirectory()) return entries(root, name);
    assert(entry.isFile());
    return [name];
  }).sort();
}

test('Claude copy uses the reviewed runtime files and only Claude host bindings', () => {
  const parent = fixture();
  const root = join(parent, 'private Claude stage');
  const config = stageClaudePlugin({ root, bundle, port: 43985, bun });
  const copied = inventory.files.filter(file => file.kind === 'copied' && file.path.startsWith('catalog/plugin/'));
  assert.deepEqual(entries(root), [
    'catalog/plugin/.claude-plugin/plugin.json', 'catalog/plugin/.mcp.json', 'catalog/plugin/hooks/hooks.json',
    'claude-local.mjs', 'cmem-light-local.json', ...copied.map(file => file.path),
  ].sort());
  for (const file of copied) assert.deepEqual(readFileSync(join(root, file.path)), readFileSync(join(bundle, file.path.slice(15))));
  const { hooks } = read(join(plugin(root), 'hooks/hooks.json'));
  const upstream = read(join(bundle, 'hooks/hooks.json')).hooks;
  const events = {
    SessionStart: 'context', UserPromptSubmit: 'session-init', PreToolUse: 'file-context',
    PostToolUse: 'observation', PostToolUseFailure: 'observation', Stop: 'summarize',
    SubagentStop: 'subagent-stop', SessionEnd: 'session-end',
  };
  assert.deepEqual(Object.keys(hooks), Object.keys(events));
  for (const [event, handler] of Object.entries(events)) {
    const group = upstream[event][event === 'SessionStart' ? 1 : 0];
    const { timeout, async } = group.hooks[0];
    assert.deepEqual(hooks[event], JSON.parse(JSON.stringify([{
      matcher: group.matcher, hooks: [{ type: 'command', command: config.node, args: [launcher(root), 'hook', handler], timeout, async }],
    }])));
  }
  const mcp = read(join(plugin(root), '.mcp.json')).mcpServers;
  for (const source of ['startup', 'resume', 'clear', 'compact']) {
    const active = hooks.SessionStart.filter(group => !group.matcher || new RegExp(`^(?:${group.matcher})$`).test(source));
    assert.equal(active.length, source === 'resume' ? 0 : 1);
    if (active.length) {
      assert.deepEqual(active[0].hooks[0].args, [launcher(root), 'hook', 'context']);
      assert.equal(active[0].hooks[0].timeout, 60);
      assert.equal(active[0].hooks[0].async, undefined);
    }
  }
  assert(!JSON.stringify(hooks).includes('claude-mem start'));
  assert.deepEqual(mcp, { 'mcp-search': { type: 'stdio', command: config.node, args: [launcher(root), 'mcp'] } });
  assert.throws(() => stageClaudePlugin({ root, bundle, port: 43985, bun }), /EEXIST/);
  assert.throws(() => stageClaudePlugin({ root: join(parent, 'new'), bundle, port: 43985, bun: 'bun.exe' }), /literal local Windows/);
  for (const entry of [hooks.SessionStart[0].hooks[0], mcp['mcp-search']]) {
    const run = spawnSync(entry.command, entry.args, { ...settings({ CLAUDE_PLUGIN_ROOT: plugin(root) }), input: '{}\n' });
    assert.equal(run.status, 1, run.stderr);
    assert.match(run.stderr, /Start the dedicated local worker/);
    assert.equal(run.stdout, '');
  }
  assert.deepEqual(entries(join(root, 'data')), []);
  const moved = join(parent, 'relocated raw copy');
  cpSync(root, moved, { recursive: true });
  for (const entry of [hooks.SessionStart[0].hooks[0], mcp['mcp-search']]) {
    const run = spawnSync(entry.command, entry.args, { ...settings({ CLAUDE_PLUGIN_ROOT: plugin(moved) }), input: '{}\n' });
    assert.equal(run.status, 1, run.stderr);
    assert.match(run.stderr, /Claude plugin root does not match the bound stage/);
    assert.equal(run.stdout, '');
  }
  const run = spawnSync(config.node, [launcher(moved), 'mcp'], settings());
  assert.equal(run.status, 1, run.stderr);
  assert.match(run.stderr, /Invalid Claude stage binding/);
  assert.equal(run.stdout, '');
});

async function openLoopback(server) {
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  return server.address().port;
}

async function withDeadline(promise, ms) {
  const timer = new AbortController();
  try {
    return await Promise.race([promise, delay(ms, undefined, { signal: timer.signal }).then(() => {
      throw new Error(`Timed out after ${ms} ms`);
    })]);
  } finally {
    timer.abort();
  }
}

async function probeMcp(entry, cwd, env) {
  const child = spawn(entry.command, entry.args, { cwd, env, windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'] });
  const closed = once(child, 'close');
  let stderr = '';
  child.stderr.on('data', chunk => { stderr += chunk; });
  const reader = createInterface({ input: child.stdout });
  try {
    const responses = reader[Symbol.asyncIterator]();
    child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'initialize', params: {
      protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'windows-stage-fixture', version: '1' },
    } }) + '\n');
    assert(JSON.parse((await withDeadline(responses.next(), 8000)).value).result.serverInfo);
    child.stdin.write('{"jsonrpc":"2.0","method":"notifications/initialized"}\n{"jsonrpc":"2.0","id":2,"method":"tools/list"}\n');
    const response = JSON.parse((await withDeadline(responses.next(), 5000)).value);
    assert(response.result.tools.some(tool => tool.name === 'save_memory'));
    child.stdin.end();
    assert.deepEqual(await withDeadline(closed, 5000), [0, null], stderr);
  } finally {
    reader.close();
    child.stdin.destroy();
    if (child.exitCode === null && child.signalCode === null) child.kill();
  }
}

for (const host of ['claude-code', 'codex']) {
  test(`the compiled ${host} hook and MCP use the staged foreground worker`, async () => {
    const parent = fixture();
    const claude = host === 'claude-code';
    const reservation = createServer();
    const port = await openLoopback(reservation);
    await new Promise(resolve => reservation.close(resolve));
    const root = join(parent, `private ${host} stage`);
    const config = (claude ? stageClaudePlugin : stageLocalInstall)({ root, bundle, port, bun, codex: process.execPath });
    const entry = join(root, claude ? 'claude-local.mjs' : 'codex-local.mjs');
    const activePid = join(root, 'worker-active', 'pid');
    const project = join(parent, 'synthetic project');
    const nested = join(project, 'nested cwd');
    mkdirSync(nested, { recursive: true });
    let requests = 0;
    const sentinel = createServer((_request, response) => { requests++; response.writeHead(500).end(); });
    const modelPort = await openLoopback(sentinel);
    const profile = join(parent, 'fixture profile.json');
    writeFileSync(profile, JSON.stringify({ provider: 'openai-compatible', model: 'synthetic-never-called',
      baseUrl: `http://127.0.0.1:${modelPort}/v1` }));
    const env = Object.fromEntries(['SystemRoot', 'WINDIR', 'ComSpec', 'PATH', 'PATHEXT'].map(key => [key, process.env[key]]));
    env.CLAUDE_MEM_OPENAI_COMPAT_API_KEY = 'synthetic-fixture-key';
    if (claude) env.CLAUDE_PLUGIN_ROOT = plugin(root);
    const owner = spawn(config.node, [entry, 'start', '--profile', profile, '--lifecycle-only'], {
      ...settings(env), cwd: parent, stdio: ['ignore', 'pipe', 'pipe'],
    });
    const closed = once(owner, 'close');
    let logs = '';
    for (const stream of [owner.stdout, owner.stderr]) stream.on('data', chunk => { logs += chunk; });
    try {
      const deadline = Date.now() + 33_000;
      while (!existsSync(activePid) && owner.exitCode === null && Date.now() < deadline) await delay(100);
      assert(existsSync(activePid), logs);
      if (claude) {
        const other = join(parent, 'wrong Claude worker stage');
        stageClaudePlugin({ root: other, bundle, port, bun });
        mkdirSync(join(other, 'worker-active'));
        cpSync(activePid, join(other, 'worker-active', 'pid'));
        const run = spawnSync(config.node, [launcher(other), 'mcp'], settings({ ...env, CLAUDE_PLUGIN_ROOT: plugin(other) }));
        assert.equal(run.status, 1, run.stderr);
        assert.match(run.stderr, /Start the dedicated local worker/);
        assert.equal(run.stdout, '');
      }
      const manifest = read(join(plugin(root), 'hooks', claude ? 'hooks.json' : 'codex-hooks.json'));
      const hook = manifest.hooks.UserPromptSubmit[0].hooks[0];
      const input = JSON.stringify({ session_id: 'synthetic-stage-session', hook_event_name: 'UserPromptSubmit',
        cwd: nested, prompt: 'Synthetic Windows stage prompt' }) + '\n';
      const result = claude
        ? spawnSync(hook.command, hook.args, { ...settings({ ...env, CLAUDE_PROJECT_DIR: project }), cwd: nested, input })
        : spawnSync(hook.commandWindows, { ...settings(env), shell: env.ComSpec, cwd: nested, input });
      assert.equal(result.status, 0, result.stderr);
      assert.doesNotThrow(() => JSON.parse(result.stdout));
      const db = new DatabaseSync(join(root, 'data', 'claude-mem.db'), { readOnly: true });
      try {
        const session = db.prepare('SELECT cwd, platform_source FROM sdk_sessions WHERE content_session_id = ?').get('synthetic-stage-session');
        assert(session, 'Expected the compiled hook to record a session');
        assert.equal(session.cwd, realpathSync(claude ? project : nested));
        assert.equal(session.platform_source, claude ? 'claude' : 'codex');
      } finally {
        db.close();
      }
      await probeMcp(read(join(plugin(root), '.mcp.json')).mcpServers['mcp-search'], nested, env);
      assert.equal(requests, 0);
    } finally {
      if (owner.exitCode === null && owner.signalCode === null) {
        const stop = spawnSync(config.node, [entry, 'stop'], settings(env));
        assert.equal(stop.status, 0, stop.stderr);
      }
      try {
        assert.deepEqual(await withDeadline(closed, 18_000), [0, null], logs);
        assert(!existsSync(dirname(activePid)), logs);
      } finally {
        sentinel.close();
      }
    }
  });
}
