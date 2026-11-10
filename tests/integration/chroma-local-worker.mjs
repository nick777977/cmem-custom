import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { once } from 'node:events';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:net';
import { basename, join, resolve } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

const [scratch, bun, runtime] = process.argv.slice(2);
assert.equal(process.platform, 'win32');
assert.equal(resolve(runtime), resolve(scratch), 'Fixture may only move its task-owned tokenizer');
const root = mkdtempSync(join(scratch, 'copied-worker-'));
const dirs = Object.fromEntries(['data', 'home', 'temp', 'codex', 'appdata', 'localappdata', 'claude']
  .map(name => [name, join(root, name)]));
for (const dir of Object.values(dirs)) mkdirSync(dir);
const bundle = join(root, 'plugin');
cpSync(resolve('plugin'), bundle, { recursive: true, filter: source => basename(source) !== 'node_modules' });
const worker = join(bundle, 'scripts/worker-service.cjs');
for (const file of ['worker-service.cjs', 'chroma-local.py']) {
  assert(readFileSync(join(bundle, 'scripts', file)).equals(readFileSync(join('plugin/scripts', file))));
}
const reservation = createServer().listen(0, '127.0.0.1');
await once(reservation, 'listening');
const { port } = reservation.address();
await new Promise(resolve => reservation.close(resolve));
const base = `http://127.0.0.1:${port}`;
const project = 'chroma-07-synthetic';
const tokenizer = join(runtime, 'model/tokenizer.json');
const held = `${tokenizer}.fixture-held`;
const storeDir = join(dirs.data, 'chroma-minilm-v1');
const vectorDb = join(storeDir, 'chroma.sqlite3');
const sqlite = join(dirs.data, 'claude-mem.db');
const legacyCheckpoint = join(dirs.data, 'chroma-sync-state.json');
const legacyStore = join(dirs.data, 'chroma');
const legacyBytes = JSON.stringify({ [project]: { observations: 999, summaries: 999, prompts: 999 } });
mkdirSync(legacyStore);
writeFileSync(join(legacyStore, 'fixture-sentinel'), 'legacy store retained');
writeFileSync(legacyCheckpoint, legacyBytes);
assert(existsSync(tokenizer) && !existsSync(held));

const settings = {
  CLAUDE_MEM_DATA_DIR: dirs.data, CLAUDE_MEM_CHROMA_ENABLED: 'true',
  CLAUDE_MEM_CHROMA_MODE: 'local', CLAUDE_MEM_CHROMA_RUNTIME_DIR: runtime,
  CLAUDE_MEM_WORKER_HOST: '127.0.0.1', CLAUDE_MEM_WORKER_PORT: String(port),
  CLAUDE_MEM_WORKER_AUTOSTART: 'false', CLAUDE_MEM_BACKUP_ENABLED: 'false',
  CLAUDE_MEM_TRANSCRIPTS_ENABLED: 'false', CLAUDE_MEM_WORK_VIEW_AUTO_REFRESH: 'false',
  CLAUDE_MEM_WORK_VIEW_COPY_PROVIDER: 'off',
};
writeFileSync(join(dirs.data, 'settings.json'), JSON.stringify({ env: settings }));
const env = {
  PATH: [process.env.PATH, join(process.env.SystemRoot, 'System32/WindowsPowerShell/v1.0')].join(';'),
  SystemRoot: process.env.SystemRoot, WINDIR: process.env.WINDIR,
  HOME: dirs.home, USERPROFILE: dirs.home, TEMP: dirs.temp, TMP: dirs.temp,
  APPDATA: dirs.appdata, LOCALAPPDATA: dirs.localappdata, CLAUDE_CONFIG_DIR: dirs.claude,
  CODEX_HOME: dirs.codex, CLAUDE_MEM_RUNTIME: 'worker', BUN_INSTALL_AUTO: 'disable',
  DO_NOT_TRACK: '1', CLAUDE_MEM_TELEMETRY_ENABLED: 'false',
  HTTP_PROXY: 'http://127.0.0.1:1', HTTPS_PROXY: 'http://127.0.0.1:1',
  NO_PROXY: '127.0.0.1', ...settings,
};

let child;
let exited;
let logs = '';
async function request(route, body, timeout = 35000) {
  const response = await fetch(base + route, {
    signal: AbortSignal.timeout(timeout), redirect: 'error',
    ...(body === undefined ? {} : {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    }),
  });
  assert(response.ok, `${route} returned ${response.status}`);
  return response.json();
}

async function until(check, label, timeout = 45000) {
  for (const deadline = Date.now() + timeout; Date.now() < deadline;) {
    const result = await check().catch(() => null);
    if (result) return result;
    if (child.exitCode !== null) throw new Error(`Worker exited during ${label}`);
    await delay(200);
  }
  throw new Error(`Timed out waiting for ${label}`);
}

async function start() {
  child = spawn(bun, [worker, '--daemon'], { cwd: dirs.data, env, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
  exited = once(child, 'close');
  for (const stream of [child.stdout, child.stderr]) stream.on('data', chunk => { logs += String(chunk); });
  await until(() => request('/api/readiness', undefined, 1000), 'readiness', 15000);
  const health = await request('/api/health');
  assert.equal(health.pid, child.pid);
  assert.equal(health.workerPath.toLowerCase(), worker.toLowerCase());
  assert.equal(health.ai.roles.observer.issue, 'profile_required');
}

async function stop() {
  await request('/api/admin/shutdown', {}, 5000);
  assert.deepEqual(await Promise.race([exited, delay(60000, null, { ref: false })]), [0, null]);
  child = null;
  assert(!existsSync(join(storeDir, '.claude-mem-chroma-writer.lock')), 'Chroma lock survived worker shutdown');
}

function readDb(file, sql) {
  const code = 'import {Database} from "bun:sqlite"; const db = new Database(process.argv[1], {readonly:true}); console.log(JSON.stringify(db.query(process.argv[2]).all())); db.close();';
  const result = spawnSync(bun, ['--eval', code, file, sql], { cwd: dirs.data, env, encoding: 'utf8', timeout: 8000 });
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout);
}

function workerLog() {
  const dir = join(dirs.data, 'logs');
  return logs + readdirSync(dir).filter(file => file.endsWith('.log'))
    .map(file => readFileSync(join(dir, file), 'utf8')).join('\n');
}

const relevant = 'The solar-powered pump irrigates a greenhouse using rainwater.';
const russian = 'Как теплица поливается дождевой водой с помощью насоса на солнечной энергии?';
const search = (query, type) => request('/api/search?' + new URLSearchParams({
  query, project, type, limit: '1', orderBy: 'relevance', format: 'json',
}));

try {
  renameSync(tokenizer, held);
  await start();
  const missing = await request('/api/chroma/status');
  assert.equal(missing.localRuntime, 'setup-required');
  assert.match(missing.details, /missing or empty.*tokenizer\.json/);
  assert(!existsSync(vectorDb));

  const epoch = Date.now();
  const timestamp = new Date(epoch).toISOString();
  const contentSessionId = 'chroma-fixture-content';
  const memorySessionId = 'chroma-fixture-memory';
  const row = { memory_session_id: memorySessionId, project, created_at: timestamp, created_at_epoch: epoch };
  const imported = await request('/api/import', {
    sessions: [{ content_session_id: contentSessionId, memory_session_id: memorySessionId, project,
      user_prompt: 'Synthetic fixture', platform_source: 'codex', status: 'active',
      started_at: timestamp, started_at_epoch: epoch }],
    observations: [relevant, 'A violin quartet performs Baroque music.', 'The accounting team closed its quarterly ledger.']
      .map((text, index) => ({ ...row, type: 'discovery', title: text, narrative: text, created_at_epoch: epoch + index })),
    summaries: [{ ...row, request: 'Analyze Antarctic penguin migration.', learned: 'Penguins swim between islands.' }],
    prompts: [{ content_session_id: contentSessionId, prompt_number: 1, prompt_text: 'How do volcanic islands form?',
      created_at: timestamp, created_at_epoch: epoch }],
  });
  for (const [kind, count] of [['observations', 3], ['summaries', 1], ['prompts', 1]]) {
    assert.equal(imported.stats[kind + 'Imported'], count, JSON.stringify(imported));
  }
  const [expected] = readDb(sqlite, 'SELECT id FROM observations ORDER BY id');
  assert.equal((await search(russian, 'observations')).totalResults, 0, 'SQLite alone matched the fixture');
  await stop();

  writeFileSync(tokenizer, 'corrupt synthetic tokenizer');
  await start();
  const corrupt = await request('/api/chroma/status');
  assert.equal(corrupt.localRuntime, 'setup-required');
  assert(!existsSync(vectorDb));
  assert.match(workerLog(), /SHA-256 mismatch for tokenizer\.json/);
  await stop();
  renameSync(held, tokenizer);

  async function assertRetrieval() {
    const status = await request('/api/chroma/status?deep=true');
    assert.equal(status.status, 'healthy', JSON.stringify(status));
    const observation = await until(async () => (await search(russian, 'observations')).observations[0], 'Russian observation');
    assert.equal(observation.id, expected.id);
    assert.equal(observation.title, relevant);
    await until(async () => (await search('Как мигрируют антарктические пингвины?', 'sessions')).sessions[0], 'summary');
    await until(async () => (await search('Как образуются вулканические острова?', 'prompts')).prompts[0], 'prompt');
  }

  await start();
  await assertRetrieval();
  await stop();
  const indexSnapshot = () => readDb(vectorDb, 'SELECT embedding_id, seq_id FROM embeddings ORDER BY embedding_id');
  const before = indexSnapshot();
  for (const prefix of ['obs_', 'summary_', 'prompt_']) assert(before.some(row => row.embedding_id.startsWith(prefix)));
  await start();
  await assertRetrieval();
  await stop();
  assert.deepEqual(indexSnapshot(), before, 'Restart unexpectedly rewrote the stored vectors');
  assert.equal(readFileSync(legacyCheckpoint, 'utf8'), legacyBytes);
  assert.equal(readFileSync(join(legacyStore, 'fixture-sentinel'), 'utf8'), 'legacy store retained');
  assert.doesNotMatch(workerLog(), /uvx executable not found/);
  assert(!/LOCAL_CHROMA_NETWORK_DENIED|Downloading.*(?:model|onnx)/i.test(workerLog()));
  assert(!existsSync(join(dirs.home, '.cache', 'chroma')));
  console.log(`PASS: copied worker, missing and corrupt setup refusal, SQLite ID ${expected.id}, all three row kinds, persistent vectors after restart. Evidence: ${root}`);
} finally {
  if (child && child.exitCode === null && child.signalCode === null) {
    await stop().catch(() => {
      if (child?.pid && child.exitCode === null && child.signalCode === null) {
        spawnSync('taskkill.exe', ['/pid', String(child.pid), '/t', '/f'], { env, timeout: 10000, windowsHide: true });
      }
    });
  }
  if (existsSync(held)) renameSync(held, tokenizer);
  writeFileSync(join(root, 'worker.log'), logs);
}
