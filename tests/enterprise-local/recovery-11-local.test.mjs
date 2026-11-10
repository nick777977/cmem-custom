import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { once } from 'node:events';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { stageLocalInstall } from '../../scripts/enterprise-local/codex-local.mjs';

const bundle = fileURLToPath(new URL('../../plugin', import.meta.url));
const scratch = fileURLToPath(new URL('../../.scratch/enterprise-local/recovery-11-local/', import.meta.url));
const recoveryPath = '/api/processing/recovery';

async function until(probe, label, ms = 12_000) {
  const end = Date.now() + ms;
  do {
    const value = await probe();
    if (value) return value;
    await delay(75);
  } while (Date.now() < end);
  throw new Error('Timed out waiting for ' + label);
}

async function listen(server) {
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  return server.address().port;
}

test('staged Codex hooks recover only selected work, with no automatic resend or duplicate commit', {
  timeout: 105_000,
}, async t => {
  assert.equal(process.platform, 'win32');
  const bun = process.env.CMEM_STAGE_TEST_BUN;
  assert(bun, 'Set CMEM_STAGE_TEST_BUN to the pinned Bun executable');
  mkdirSync(scratch, { recursive: true });
  const fixture = mkdtempSync(join(scratch, 'fixture '));
  const root = join(fixture, 'Codex stage');
  const cwd = join(fixture, 'synthetic project');
  mkdirSync(cwd);
  const reservation = createServer();
  const port = await listen(reservation);
  await new Promise(resolve => reservation.close(resolve));
  const base = 'http://127.0.0.1:' + port;
  const binding = stageLocalInstall({ root, bundle, port, bun, codex: process.execPath });
  const launcher = join(root, 'codex-local.mjs');
  const marker = join(root, 'worker-active', 'pid');
  const database = join(root, 'data', 'claude-mem.db');
  const { hooks } = JSON.parse(readFileSync(join(root, 'catalog/plugin/hooks/codex-hooks.json'), 'utf8'));
  const env = Object.fromEntries(['SystemRoot', 'WINDIR', 'ComSpec', 'PATH', 'PATHEXT'].map(key => [key, process.env[key]]));
  env.PATH = join(env.SystemRoot, 'System32');
  env.CLAUDE_MEM_OPENAI_COMPAT_API_KEY = 'fixture-key';
  const procOptions = { cwd, env, windowsHide: true, encoding: 'utf8', timeout: 12_000 };
  const launch = (...args) => spawnSync(binding.node, [launcher, ...args], procOptions);

  function hook(event, sessionId, extra) {
    const command = hooks[event][0].hooks[0].commandWindows;
    const input = JSON.stringify({ session_id: sessionId, cwd, hook_event_name: event, turn_id: sessionId, ...extra });
    const result = spawnSync(command, { ...procOptions, shell: env.ComSpec, input: input + '\n' });
    assert.equal(result.status, 0, result.stderr);
    assert.doesNotThrow(() => JSON.parse(result.stdout));
  }
  function observe(sessionId, label) {
    hook('PostToolUse', sessionId, {
      tool_name: 'Edit', tool_use_id: 'use-' + label,
      tool_input: { file_path: join(cwd, 'fixture.txt'), old_string: 'old', new_string: 'case-' + label },
      tool_response: 'fixture edit complete',
    });
  }
  function sql(query) {
    const db = new DatabaseSync(database, { readOnly: true });
    try { return db.prepare(query).all(); } finally { db.close(); }
  }
  const rows = () => sql('SELECT id, type, state FROM generation_recovery ORDER BY id');
  const resultCounts = () => [
    sql('SELECT id FROM observations').length, sql('SELECT id FROM session_summaries').length,
  ];
  async function request(path, body, expected = 200) {
    const response = await fetch(base + path, {
      signal: AbortSignal.timeout(4000), redirect: 'error',
      ...(body === undefined ? {} : { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
    });
    assert.equal(response.status, expected, path);
    return response;
  }
  const list = async () => (await (await request(recoveryPath)).json()).items;
  async function recover({ id, version }, expected, acknowledgeUnknown = false) {
    return (await request(recoveryPath, { id, version, acknowledgeUnknown }, expected)).json();
  }

  let fault;
  let owner;
  let closed;
  let logs;
  const calls = [];
  const invalid = [];
  const provider = createServer(async (req, res) => {
    try {
      assert.equal(req.url, '/v1/chat/completions');
      assert.equal(req.method, 'POST');
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const text = Buffer.concat(chunks).toString();
      assert(!text.includes('synthetic-private-marker'));
      const { model, messages } = JSON.parse(text);
      assert.equal(model, 'synthetic-recovery');
      calls.push(fault ?? 'success');
      if (fault === '401') return res.writeHead(401).end();
      if (fault === 'redirect') return res.writeHead(307, { Location: '/must-not-follow' }).end();
      if (fault === 'hold') return;
      const latest = messages.at(-1).content;
      const label = /case-(auth|redirect|interrupt)/.exec(latest)?.[1];
      const content = label
        ? '<observation><type>discovery</type><title>Recovered ' + label + '</title><narrative>Synthetic result.</narrative></observation>'
        : '<summary><request>Recovered summary</request><investigated>Fixture.</investigated><learned>Fixture.</learned><completed>Done.</completed><next_steps>None.</next_steps><notes>Fixture.</notes></summary>';
      res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({ choices: [{ message: { content } }] }));
    } catch (error) {
      invalid.push(error.message);
      res.writeHead(400).end();
    }
  });
  const providerPort = await listen(provider);
  const profile = join(fixture, 'profile.json');
  writeFileSync(profile, JSON.stringify({
    provider: 'openai-compatible', model: 'synthetic-recovery', baseUrl: 'http://127.0.0.1:' + providerPort + '/v1',
  }));

  async function start() {
    logs = '';
    owner = spawn(binding.node, [launcher, 'start', '--profile', profile, '--lifecycle-only'], {
      cwd, env, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'],
    });
    closed = once(owner, 'close');
    for (const stream of [owner.stdout, owner.stderr]) stream.on('data', bytes => { logs += bytes; });
    await until(() => {
      assert.equal(owner.exitCode, null, logs);
      return existsSync(marker);
    }, 'staged worker readiness', 33_000);
    const health = await (await request('/api/health')).json();
    assert.equal(health.pid, Number(readFileSync(marker, 'utf8')));
    assert.equal(health.workerPath.toLowerCase(), join(root, 'catalog/plugin/scripts/worker-service.cjs').toLowerCase());
    return health.pid;
  }
  async function stop(interruptPid) {
    if (interruptPid === undefined) {
      const result = launch('stop');
      assert.equal(result.status, 0, result.stderr);
    } else {
      assert.equal(interruptPid, Number(readFileSync(marker, 'utf8')));
      process.kill(interruptPid, 'SIGKILL');
    }
    await until(() => owner.exitCode !== null || owner.signalCode !== null, 'owned worker launcher exit', 18_000);
    const [exitCode] = await closed;
    if (interruptPid === undefined) assert.equal(exitCode, 0, logs);
    else assert.notEqual(exitCode, 0, logs);
    assert(!existsSync(marker));
    owner = null;
  }

  try {
    await start();
    const auth = await fetch(base + '/api/auth/get-session', { signal: AbortSignal.timeout(4000) });
    t.diagnostic('Separate in-checkout local auth HTTP ' + auth.status);
    await auth.body.cancel();
    for (const [index, label] of ['auth', 'redirect'].entries()) {
      fault = index === 0 ? '401' : 'redirect';
      hook('UserPromptSubmit', 'recovery-' + label, { prompt: 'Synthetic ' + label });
      observe('recovery-' + label, label);
      await until(async () => (await list()).length === index + 1, label + ' recoverable refusal');
    }
    hook('UserPromptSubmit', 'recovery-private', { prompt: '<private>synthetic-private-marker</private>' });
    await request('/api/processing', { isProcessing: false });
    assert.deepEqual(calls, ['401', 'redirect']);
    assert.deepEqual(resultCounts(), [0, 0]);
    await stop();
    assert.deepEqual(rows().map(row => row.state), ['outcome_unknown', 'outcome_unknown']);

    fault = 'hold';
    const pid = await start();
    const firstItems = await list();
    assert.equal(firstItems.length, 2);
    assert.equal((await recover(firstItems[0], 409)).status, 'acknowledgement_required');
    assert.deepEqual(calls, ['401', 'redirect']);
    hook('UserPromptSubmit', 'recovery-interrupt', { prompt: 'Synthetic interruption' });
    observe('recovery-interrupt', 'interrupt');
    await until(() => calls.length === 3, 'dispatched request without a reply');
    hook('Stop', 'recovery-interrupt', { last_assistant_message: 'Synthetic wrapup after interruption.' });
    await until(() => rows().some(row => row.type === 'summarize' && row.state === 'undispatched'), 'durable unsent summary');
    await stop(pid);
    assert.deepEqual(resultCounts(), [0, 0]);

    fault = undefined;
    await start();
    const items = await list();
    assert.deepEqual(items.map(item => [item.type, item.state]), [
      ['observation', 'outcome_unknown'], ['observation', 'outcome_unknown'],
      ['observation', 'outcome_unknown'], ['summarize', 'undispatched'],
    ]);
    assert(!JSON.stringify(items).includes('fixture.txt'));
    await request('/api/processing', { isProcessing: false });
    assert.deepEqual(calls, ['401', 'redirect', 'hold']);
    for (const [index, item] of items.entries()) {
      await recover(item, 202, item.state === 'outcome_unknown');
      await until(() => rows().find(row => row.id === item.id)?.state === 'completed', 'durable result commit');
      await recover(item, 404, true);
      assert.equal(calls.length, 4 + index);
    }
    assert.deepEqual(resultCounts(), [3, 1]);
    assert.equal(sql('SELECT payload FROM generation_recovery WHERE payload IS NOT NULL').length, 0);
    assert.deepEqual(await list(), []);
    await stop();

    await start();
    assert.deepEqual(await list(), []);
    for (const item of items) await recover(item, 404, true);
    observe('recovery-auth', 'auth');
    await request('/api/processing', { isProcessing: false });
    assert.equal(calls.length, 7);
    assert.deepEqual(resultCounts(), [3, 1]);
    assert.deepEqual(sql("SELECT DISTINCT project FROM observations UNION SELECT DISTINCT project FROM session_summaries")
      .map(row => row.project), ['synthetic project']);
    assert.deepEqual(invalid, []);
    await stop();
  } finally {
    if (owner && owner.exitCode === null && owner.signalCode === null) {
      launch('stop');
      await until(() => owner.exitCode !== null || owner.signalCode !== null, 'failure cleanup', 18_000).catch(() => {
        if (existsSync(marker)) process.kill(Number(readFileSync(marker, 'utf8')), 'SIGKILL');
      });
    }
    provider.closeAllConnections();
    await new Promise(resolve => provider.close(resolve));
  }
});
