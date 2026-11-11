import { spawn, spawnSync } from 'node:child_process';
import { cpSync, existsSync, lstatSync, mkdirSync, readdirSync, readFileSync, realpathSync, rmdirSync, rmSync, writeFileSync } from 'node:fs';
import { basename, dirname, isAbsolute, join, resolve, win32 } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const here = fileURLToPath(new URL('.', import.meta.url));
const script = fileURLToPath(import.meta.url);
const marketplace = 'cmem-light-private';
const claudeKind = 'cmem-light-claude-private';
const pluginId = 'claude-mem@' + marketplace;
const hostSettings = ['-c', 'analytics.enabled=false', '-c', 'feedback.enabled=false'];
const hookEvents = {
  SessionStart: 'context',
  UserPromptSubmit: 'session-init',
  PreToolUse: 'file-context',
  PostToolUse: 'observation',
  Stop: 'summarize',
  PostCompact: 'post-compact',
  SubagentStart: 'subagent-context',
};
const claudeHookEvents = {
  SessionStart: 'context',
  UserPromptSubmit: 'session-init',
  PreToolUse: 'file-context',
  PostToolUse: 'observation',
  PostToolUseFailure: 'observation',
  Stop: 'summarize',
  SubagentStop: 'subagent-stop',
  SessionEnd: 'session-end',
};
// The repository build also emits standalone runtimes and installer tools.
// Only the files used by the private worker and its local skills are staged.
const runtimeFiles = [
  'scripts/worker-service.cjs',
  'scripts/mcp-server.cjs',
  'scripts/context-read-worker.cjs',
  'scripts/chroma-local.py',
  'sqlite/SessionStore.js',
  'sqlite/SessionStore.js.map',
  'sqlite/observations/files.js',
  'sqlite/observations/files.js.map',
  'skills/mem-search/SKILL.md',
  'skills/smart-explore/SKILL.md',
  'skills/knowledge-agent/SKILL.md',
  'skills/request-progress/SKILL.md',
  'skills/request-progress/scripts/request-groups.mjs',
  'skills/owner-goals/SKILL.md',
  'skills/owner-goals/scripts/export_owner_prompts.py',
  'skills/owner-goals/scripts/save_goals.py',
];
const runtimeDirectories = ['modes', 'ui'];
const metadata = 'cmem-light-local.json';
const readJson = file => JSON.parse(readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
const writeJson = (file, value) => writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });

function windowsPath(value) {
  // Use the same literal-drive path policy as the Codex cmd.exe binding.
  if (!/^[a-z]:[\\/]/i.test(value ?? '') || /[\x00-\x1f"'`$%!*?<>|;&^]/.test(value)) {
    throw new Error('Expected a literal local Windows drive path');
  }
  return win32.resolve(value);
}

function executable(value) {
  const file = realpathSync(windowsPath(value));
  if (!/\.exe$/i.test(file) || !lstatSync(file).isFile()) throw new Error('Select a direct .exe');
  return windowsPath(file);
}

function stageRoot(root) {
  root = windowsPath(root);
  return windowsPath(join(realpathSync(dirname(root)), basename(root)));
}

function validatePort(port) {
  if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Specify a free port from 1024 to 65535');
}

function checkBundle(source, checkChildren = false) {
  for (const file of runtimeFiles) {
    if (!lstatSync(join(source, file)).isFile() || (checkChildren && realpathSync(join(source, file)) !== join(source, file))) {
      throw new Error(`Expected a regular bundle file: ${file}`);
    }
  }
  for (const dir of runtimeDirectories) {
    const path = join(source, dir);
    if (!lstatSync(path).isDirectory()) throw new Error(`Expected a bundle directory: ${dir}`);
    if (checkChildren) checkRegularTree(path);
  }
}

function checkRegularTree(directory) {
  for (const name of readdirSync(directory)) {
    const path = join(directory, name);
    const stat = lstatSync(path);
    if (stat.isDirectory()) checkRegularTree(path);
    else if (!stat.isFile()) throw new Error(`Expected a regular bundle entry: ${path}`);
  }
}

function copyRuntime(source, plugin) {
  for (const file of runtimeFiles) cpSync(join(source, file), join(plugin, file));
  for (const dir of runtimeDirectories) cpSync(join(source, dir), join(plugin, dir), { recursive: true });
}

function baseEnv(root) {
  const env = {};
  for (const key of ['SystemRoot', 'WINDIR', 'ComSpec', 'PATHEXT', 'PATH']) {
    if (process.env[key]) env[key] = process.env[key];
  }
  return {
    ...env,
    HOME: join(root, 'home'),
    USERPROFILE: join(root, 'home'),
    APPDATA: join(root, 'home', 'appdata'),
    LOCALAPPDATA: join(root, 'home', 'localappdata'),
    TMP: join(root, 'temp'),
    TEMP: join(root, 'temp'),
    CODEX_HOME: join(root, 'codex'),
    CLAUDE_CONFIG_DIR: join(root, 'home', '.claude'),
    DO_NOT_TRACK: '1',
    BUN_INSTALL_AUTO: 'disable',
  };
}

function appEnv(root, port) {
  return {
    ...baseEnv(root),
    CLAUDE_MEM_DATA_DIR: join(root, 'data'),
    CLAUDE_MEM_WORKER_HOST: '127.0.0.1',
    CLAUDE_MEM_WORKER_PORT: String(port),
    CLAUDE_MEM_RUNTIME: 'worker',
    CLAUDE_MEM_WORKER_AUTOSTART: 'false',
    CLAUDE_MEM_CHROMA_MODE: 'local',
    CLAUDE_MEM_CLOUD_SYNC_TOKEN: '',
    CLAUDE_MEM_CLOUD_SYNC_USER_ID: '',
    CLAUDE_MEM_CLOUD_SYNC_HUB_URL: '',
    CLAUDE_MEM_TEAMBRAIN_URL: '',
    CLAUDE_MEM_TEAMBRAIN_TEAM_ID: '',
    CLAUDE_MEM_NOTION_ENABLED: 'false',
    CLAUDE_MEM_GROK_BOT_AWARENESS_ENABLED: 'false',
    CLAUDE_MEM_GROK_BOT_WEBHOOK_URL: '',
    CLAUDE_MEM_TRANSCRIPTS_ENABLED: 'false',
    CLAUDE_MEM_WORK_VIEW_AUTO_REFRESH: 'false',
    CLAUDE_MEM_WORK_VIEW_COPY_PROVIDER: 'off',
    CLAUDE_MEM_QUOTA_FALLBACK_PROVIDER: 'off',
    CLAUDE_MEM_QUOTA_FALLBACK_AUTH_METHOD: '',
  };
}

function profileEnv(profile, config) {
  if (profile && Object.hasOwn(profile, 'default')) {
    const env = { CLAUDE_MEM_MODEL_PROFILES: JSON.stringify(profile) };
    for (const role of ['default', 'observer', 'summary', 'compression', 'refresh', 'copy', 'requestJudge', 'focusJudge', 'knowledge']) {
      const selected = profile[role];
      if (selected?.auth !== 'api-key' || !/^CMEM_PROFILE_KEY_[A-Z0-9_]{1,96}(?<!_ENDPOINT)$/.test(selected.keyEnv)) continue;
      for (const name of [selected.keyEnv, `${selected.keyEnv}_ENDPOINT`]) {
        if (process.env[name] !== undefined) env[name] = process.env[name];
      }
    }
    return env;
  }
  if (typeof profile.model !== 'string' || !profile.model.trim()) {
    throw new Error('The observer profile requires an explicit model');
  }
  if (profile.provider === 'codex') {
    return {
      CLAUDE_MEM_MODEL_PROFILES: JSON.stringify({ default: {
        id: 'private-codex', provider: 'codex', model: profile.model, auth: 'chatgpt',
        executable: config.codex, authHome: realpathSync(windowsPath(profile.authHome)),
      } }),
    };
  }
  if (profile.provider === 'openai-compatible') {
    const url = new URL(profile.baseUrl);
    const hostname = url.hostname.replace(/\.$/, '');
    if (hostname === 'cmem.ai' || hostname.endsWith('.cmem.ai')) {
      throw new Error('The private launcher does not support CMEM endpoints');
    }
    if (url.username || url.password || url.search || url.hash ||
        (url.protocol !== 'https:' && !(url.protocol === 'http:' && url.hostname === '127.0.0.1'))) {
      throw new Error('Use an explicit HTTPS endpoint or a 127.0.0.1 HTTP endpoint');
    }
    const key = process.env.CLAUDE_MEM_OPENAI_COMPAT_API_KEY;
    if (!key?.trim()) throw new Error('Set CLAUDE_MEM_OPENAI_COMPAT_API_KEY for the selected endpoint');
    return {
      CLAUDE_MEM_MODEL_PROFILES: JSON.stringify({ default: {
        id: 'private-api', provider: 'openai-compatible', model: profile.model, auth: 'api-key',
        endpoint: url.href, keyEnv: 'CMEM_PROFILE_KEY_PRIVATE',
      } }),
      CMEM_PROFILE_KEY_PRIVATE: key,
      CMEM_PROFILE_KEY_PRIVATE_ENDPOINT: url.href,
    };
  }
  throw new Error('Select a codex or openai-compatible observer profile for this launcher');
}

function cli(config, root, args, interactive = false) {
  const result = spawnSync(config.codex, [...hostSettings, ...args], {
    cwd: join(root, 'workspace'),
    env: baseEnv(root),
    stdio: interactive ? 'inherit' : 'pipe',
    windowsHide: !interactive,
    timeout: interactive ? undefined : 30_000,
    encoding: 'utf8',
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`Codex ${args.slice(0, 3).join(' ')} failed (exit ${result.status})${interactive ? '' : ': ' + result.stderr.trim()}`);
  }
  return result.stdout;
}

export function stageLocalInstall({ root, codex, bun, port, bundle }) {
  validatePort(port);
  const config = { kind: marketplace, codex: executable(codex), bun: executable(bun), node: executable(process.execPath), port };
  const source = realpathSync(windowsPath(bundle));
  const { name, version, description, author, homepage, repository, license, keywords, interface: presentation } =
    readJson(join(source, '.codex-plugin', 'plugin.json'));
  const catalog = readJson(join(source, 'hooks', 'codex-hooks.json'));
  if (name !== 'claude-mem') throw new Error('Expected the compiled claude-mem plugin directory');
  const hooks = {};
  root = stageRoot(root);
  for (const [event, handler] of Object.entries(hookEvents)) {
    const groups = catalog.hooks?.[event];
    const entries = groups?.[0]?.hooks;
    if (groups?.length !== 1 || entries?.length !== 1 || entries[0]?.type !== 'command') {
      throw new Error(`Unexpected build hook shape for ${event}`);
    }
    const { matcher } = groups[0];
    const { timeout } = entries[0];
    // Codex uses cmd.exe for commandWindows. The launcher forwards the hook
    // envelope on stdin and spawns Bun without a shell.
    hooks[event] = [{ matcher, hooks: [{
      type: 'command', timeout, command: 'exit 1',
      commandWindows: `"${config.node}" "${join(root, 'codex-local.mjs')}" hook ${handler}`,
    }] }];
  }
  checkBundle(source);
  mkdirSync(root); // A dedicated, new root prevents overwriting a user's Codex profile.
  writeJson(join(root, metadata), config);
  for (const dir of ['home/appdata', 'home/localappdata', 'temp', 'workspace', 'codex', 'data',
    'catalog/.agents/plugins', 'catalog/plugin/.codex-plugin', 'catalog/plugin/hooks', 'catalog/plugin/scripts']) {
    mkdirSync(join(root, dir), { recursive: true });
  }
  const plugin = join(root, 'catalog', 'plugin');
  copyRuntime(source, plugin);
  cpSync(script, join(root, 'codex-local.mjs'));
  writeJson(join(plugin, 'hooks', 'codex-hooks.json'), { hooks });
  writeJson(join(plugin, '.mcp.json'), { mcpServers: { 'mcp-search': {
    type: 'stdio',
    command: config.node,
    args: [join(root, 'codex-local.mjs'), 'mcp'],
  } } });
  writeJson(join(plugin, '.codex-plugin', 'plugin.json'), {
    name, version, description, author, homepage, repository, license, keywords, interface: presentation,
    skills: './skills/', mcpServers: './.mcp.json', hooks: './hooks/codex-hooks.json',
  });
  writeJson(join(root, 'catalog', '.agents', 'plugins', 'marketplace.json'), {
    name: marketplace,
    interface: { displayName: 'cmem-light' },
    plugins: [{ name: 'claude-mem', source: { source: 'local', path: './plugin' },
      policy: { installation: 'AVAILABLE', authentication: 'ON_INSTALL' }, category: 'Productivity' }],
  });
  return { ...config, root };
}

export function stageClaudePlugin({ root, bun, port, bundle }) {
  validatePort(port);
  root = stageRoot(root);
  const source = realpathSync(windowsPath(bundle));
  const config = { kind: claudeKind, root, bun: executable(bun), node: executable(process.execPath), port };
  const { name, version, description, author, homepage, repository, license, keywords } =
    readJson(join(source, '.claude-plugin', 'plugin.json'));
  if (name !== 'claude-mem') throw new Error('Expected the compiled claude-mem plugin directory');
  const catalog = readJson(join(source, 'hooks', 'hooks.json'));
  const launcher = join(root, 'claude-local.mjs');
  const hooks = {};
  for (const [event, handler] of Object.entries(claudeHookEvents)) {
    // SessionStart's other groups are legacy autostart and installer preflight.
    const group = catalog.hooks?.[event]?.[event === 'SessionStart' ? 1 : 0];
    const entry = group?.hooks?.[0];
    if (group?.hooks?.length !== 1 || entry?.type !== 'command' ||
        (event === 'SessionStart' && group.matcher !== 'startup|clear|compact')) {
      throw new Error(`Unexpected Claude build hook shape for ${event}`);
    }
    const { matcher } = group;
    const { timeout, async } = entry;
    hooks[event] = [{ matcher, hooks: [{
      type: 'command', command: config.node, args: [launcher, 'hook', handler], timeout, async,
    }] }];
  }
  checkBundle(source, true);
  mkdirSync(root);
  const plugin = join(root, 'catalog', 'plugin');
  for (const dir of ['home/appdata', 'home/localappdata', 'temp', 'data',
    'catalog/plugin/.claude-plugin', 'catalog/plugin/hooks', 'catalog/plugin/scripts']) {
    mkdirSync(join(root, dir), { recursive: true });
  }
  copyRuntime(source, plugin);
  writeJson(join(plugin, '.claude-plugin', 'plugin.json'), {
    name, version, description, author, homepage, repository, license, keywords,
  });
  writeJson(join(plugin, 'hooks', 'hooks.json'), { hooks });
  writeJson(join(plugin, '.mcp.json'), { mcpServers: { 'mcp-search': {
    type: 'stdio', command: config.node, args: [launcher, 'mcp'],
  } } });
  cpSync(script, launcher);
  writeJson(join(root, metadata), config);
  return config;
}

function install(options) {
  const config = stageLocalInstall(options);
  const { root } = config;
  // Keep all CLI configuration under the installation. Codex owns the catalog
  // and cache registration, including uninstall.
  const catalogPath = join(root, 'catalog');
  cli(config, root, ['plugin', 'marketplace', 'add', catalogPath]);
  try {
    cli(config, root, ['plugin', 'add', pluginId]);
  } catch (error) {
    try {
      cli(config, root, ['plugin', 'marketplace', 'remove', marketplace]);
    } catch (rollback) {
      throw new AggregateError([error, rollback], 'Plugin add and catalog rollback failed');
    }
    throw error;
  }
  console.log(`Installed ${pluginId} in ${join(root, 'codex')}`);
}

async function ownedHealth(config, pid, resource = '/api/health', method = 'GET') {
  const response = await fetch(`http://127.0.0.1:${config.port}${resource}`, {
    method, signal: AbortSignal.timeout(750), redirect: 'error',
  });
  if (!response.ok) return false;
  const result = await response.json();
  return resource === '/api/health'
    ? result.pid === pid && result.workerPath?.toLowerCase() === workerPath(config.root).toLowerCase()
    : result.status === 'shutting_down';
}

const workerPath = root => join(root, 'catalog', 'plugin', 'scripts', 'worker-service.cjs');
const active = root => join(root, 'worker-active');

function usingLock(root, callback) {
  const lock = active(root);
  mkdirSync(lock);
  return (async () => {
    try {
      return await callback(lock);
    } finally {
      for (const name of ['pid', 'stop']) rmSync(join(lock, name), { force: true });
      rmdirSync(lock);
    }
  })();
}

function launch(command, args, options) {
  const child = spawn(command, args, { ...options, windowsHide: true });
  const done = new Promise(resolve => {
    child.once('error', error => resolve({ error }));
    child.once('exit', code => resolve({ code }));
  });
  return { child, done };
}

async function runWorker(config, profile, lifecycleOnly) {
  const { root } = config;
  if (lifecycleOnly && (profile.provider !== 'openai-compatible' || new URL(profile.baseUrl).hostname !== '127.0.0.1')) {
    throw new Error('The lifecycle fixture requires a loopback OpenAI-compatible endpoint');
  }
  const env = { ...appEnv(root, config.port), ...profileEnv(profile, config) };
  if (lifecycleOnly) env.CLAUDE_MEM_CHROMA_ENABLED = 'false';
  return usingLock(root, async lock => {
    const { child, done } = launch(config.bun, [workerPath(root), '--daemon'], {
      cwd: join(root, 'data'), env, stdio: ['ignore', 'inherit', 'inherit'],
    });
    let stopping = false;
    let result;
    done.then(value => { result = value; });
    const stop = () => { stopping = true; };
    process.on('SIGINT', stop);
    process.on('SIGTERM', stop);
    const requested = () => stopping || existsSync(join(lock, 'stop'));
    try {
      const deadline = Date.now() + 30_000;
      while (!requested() && !result && Date.now() < deadline) {
        if (await ownedHealth(config, child.pid).catch(() => false)) {
          const response = await fetch(`http://127.0.0.1:${config.port}/api/readiness`, {
            signal: AbortSignal.timeout(750), redirect: 'error',
          }).catch(() => null);
          const ready = response?.ok;
          await response?.body?.cancel();
          if (ready) {
            writeFileSync(join(lock, 'pid'), String(child.pid), { flag: 'wx' });
            console.log(`Worker ready at http://127.0.0.1:${config.port}/`);
            while (!requested() && !result) await delay(200);
            break;
          }
        }
        await delay(200);
      }
      if (!requested()) throw result?.error ?? new Error(`Worker stopped or failed readiness (exit ${result?.code ?? 'timeout'})`);
    } finally {
      process.off('SIGINT', stop);
      process.off('SIGTERM', stop);
      if (!result && await ownedHealth(config, child.pid).catch(() => false)) {
        await ownedHealth(config, child.pid, '/api/admin/shutdown', 'POST').catch(() => false);
        await Promise.race([done, delay(12_000, undefined, { ref: false })]);
      }
      if (!result) {
        child.kill();
        if (!await Promise.race([done.then(() => true), delay(3000, false, { ref: false })])) {
          child.unref();
          throw new Error('Worker exit could not be confirmed');
        }
        throw new Error('Worker required forced termination');
      }
    }
  });
}

async function hostEntry(config, command, args) {
  const { root } = config;
  const claude = config.kind === claudeKind;
  const events = claude ? claudeHookEvents : hookEvents;
  if (claude) {
    const loaded = process.env.CLAUDE_PLUGIN_ROOT;
    const expected = join(root, 'catalog', 'plugin');
    if (!loaded || windowsPath(loaded).toLowerCase() !== expected.toLowerCase()) {
      throw new Error('Claude plugin root does not match the bound stage. Load the plugin from its staged directory.');
    }
  }
  const pidFile = join(active(root), 'pid');
  const pid = existsSync(pidFile) && Number(readFileSync(pidFile, 'utf8'));
  if (!Number.isSafeInteger(pid) || pid < 1 || !await ownedHealth(config, pid).catch(() => false)) {
    throw new Error('Start the dedicated local worker before opening the plugin');
  }
  const env = appEnv(root, config.port);
  const options = { env, stdio: 'inherit' };
  let invocation;
  if (command === 'hook' && args.length === 1 && Object.values(events).includes(args[0])) {
    if (claude) {
      for (const key of ['CLAUDE_PROJECT_DIR', 'CLAUDE_MEM_DISABLE_TOOL_HOOKS',
        'CLAUDE_MEM_DISABLE_OBSERVATION', 'CLAUDE_MEM_DISABLE_FILE_CONTEXT']) {
        if (process.env[key] !== undefined) env[key] = process.env[key];
      }
    } else {
      env.CLAUDE_MEM_CODEX_HOOK = '1';
    }
    env.CLAUDE_MEM_HOOK_ORIGINAL_CWD = process.cwd();
    invocation = launch(config.bun, [workerPath(root), 'hook', claude ? 'claude-code' : 'codex', args[0]], {
      ...options, cwd: join(root, 'data'),
    });
  } else if (command === 'mcp' && args.length === 0) {
    invocation = launch(config.node, [join(root, 'catalog', 'plugin', 'scripts', 'mcp-server.cjs')], options);
  } else {
    throw new Error('Unknown host entry');
  }
  const stop = () => invocation.child.kill();
  process.once('SIGINT', stop);
  process.once('SIGTERM', stop);
  const result = await invocation.done;
  if (result.error) throw result.error;
  process.exitCode = result.code ?? 1;
}

async function main() {
  if (process.platform !== 'win32') throw new Error('This installer targets Windows');
  const [command, ...args] = process.argv.slice(2);
  if (command === 'stage-claude') {
    const { values } = parseArgs({ args, options: {
      root: { type: 'string' }, bun: { type: 'string' }, port: { type: 'string' }, bundle: { type: 'string' },
    } });
    const { root } = stageClaudePlugin({ ...values, port: Number(values.port), bundle: values.bundle ?? resolve(here, '../../plugin') });
    console.log(join(root, 'catalog', 'plugin'));
    return;
  }
  if (command === 'install') {
    const { values } = parseArgs({ args, options: {
      root: { type: 'string' }, codex: { type: 'string' }, bun: { type: 'string' },
      port: { type: 'string' }, bundle: { type: 'string' },
    } });
    install({ ...values, root: windowsPath(values.root), port: Number(values.port), bundle: values.bundle ?? resolve(here, '../../plugin') });
    return;
  }
  const root = realpathSync(here);
  const stored = readJson(join(root, metadata));
  const config = { ...stored, root };
  const claude = config.kind === claudeKind;
  if (claude) {
    validatePort(config.port);
    if (stored.root !== root || script !== join(root, 'claude-local.mjs') ||
        config.node !== executable(process.execPath) || config.bun !== executable(config.bun)) {
      throw new Error('Invalid Claude stage binding. Re-stage at the intended path with the selected executables.');
    }
  } else if (config.kind !== marketplace || !isAbsolute(root)) {
    throw new Error('Run the installer or stage-claude first');
  }
  if (command === 'hook' || command === 'mcp') return hostEntry(config, command, args);
  if (command === 'host' && !claude) {
    cli(config, root, args, true);
  } else if (command === 'start') {
    const { values } = parseArgs({ args, options: { profile: { type: 'string' }, 'lifecycle-only': { type: 'boolean' } } });
    if (!values.profile) throw new Error('Specify --profile with an explicit observer model and auth route');
    await runWorker(config, readJson(resolve(values.profile)), values['lifecycle-only']);
  } else if (command === 'stop' && args.length === 0) {
    writeFileSync(join(active(root), 'stop'), '', { flag: 'wx' });
  } else if (command === 'uninstall' && !claude && args.length === 0) {
    await usingLock(root, async () => {
      cli(config, root, ['plugin', 'remove', pluginId]);
      cli(config, root, ['plugin', 'marketplace', 'remove', marketplace]);
      console.log('Removed Codex registration. Installation files and local data are preserved.');
    });
  } else {
    throw new Error(claude ? 'Commands for the Claude stage: start, stop' : 'Commands: install, stage-claude, start, stop, host, uninstall');
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === realpathSync(process.argv[1])) {
  main().catch(error => {
    console.error(`cmem-light: ${error.message}`);
    process.exitCode = 1;
  });
}
