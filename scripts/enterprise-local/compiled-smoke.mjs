// V3 orchestration source. No CLI autorun and no ambient/native process adapter.
// Reuses worker-bundle-self-contained.test.ts's copied-bundle fixture, replacing
// its parent env spread with explicit synthetic paths and exact artifact hashes.
import { createHash } from 'node:crypto';
import { copyFileSync, mkdirSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import path from 'node:path';

export const deadlines = Object.freeze({ runMs: 15_000, cleanupMs: 5_000, maxOutputBytes: 64 * 1024 });
export const compiledEntries = ['claude-mem-launcher.cjs', 'ensure-launcher.cjs', 'worker-service.cjs', 'mcp-server.cjs', 'bun-runner.js', 'version-check.js', 'worker-wrapper.cjs', 'qoder-hook-launcher.cjs'];
const entries = compiledEntries;
const digest = file => createHash('sha256').update(readFileSync(file)).digest('hex');
function descendant(root, file) {
  const delta = path.relative(root, file);
  if (!delta || delta === '..' || delta.startsWith(`..${path.sep}`) || path.isAbsolute(delta)) throw new Error('OUTSIDE_OWNED_SANDBOX');
  return file;
}

/** Values supplied by the reviewed launch, never copied from process.env. */
export function syntheticEnvironment(root, tools) {
  if (!path.isAbsolute(root) || !path.isAbsolute(tools.node) || !path.isAbsolute(tools.bun)) throw new Error('ABSOLUTE_PATHS_REQUIRED');
  const env = {
    PATH: [...new Set([path.dirname(tools.node), path.dirname(tools.bun)])].join(path.delimiter),
    HOME: path.join(root, 'home'), USERPROFILE: path.join(root, 'home'),
    APPDATA: path.join(root, 'appdata'), LOCALAPPDATA: path.join(root, 'localappdata'),
    CLAUDE_CONFIG_DIR: path.join(root, 'config'), CODEX_HOME: path.join(root, 'codex'),
    CLAUDE_MEM_DATA_DIR: path.join(root, 'data'), TEMP: path.join(root, 'temp'), TMP: path.join(root, 'temp'),
    npm_config_userconfig: path.join(root, 'empty.npmrc'), npm_config_globalconfig: path.join(root, 'global.npmrc'),
    npm_config_cache: path.join(root, 'npm-cache'), npm_config_offline: 'true',
    npm_config_audit: 'false', npm_config_fund: 'false', npm_config_update_notifier: 'false',
    DO_NOT_TRACK: '1', CLAUDE_MEM_TELEMETRY_ENABLED: 'false', BUN_INSTALL_AUTO: 'disable',
  };
  if (tools.systemRoot !== undefined) {
    if (!path.isAbsolute(tools.systemRoot)) throw new Error('ABSOLUTE_SYSTEMROOT_REQUIRED');
    env.SystemRoot = tools.systemRoot;
  }
  return env;
}

/** Explicit existing output hashes are prerequisites, never discovered approval.
 * Caller supplies a fresh, exclusive sandbox under the task scratch directory.
 * There is deliberately no recursive delete: retain evidence until launch-owned
 * cleanup verifies descendants/reparse points and the process boundary is empty.
 */
export function prepareCopiedBundle({ workspace, sandbox, hashes, tools }) {
  const taskRoot = realpathSync(path.join(workspace, '.scratch', 'enterprise-local', 'windows-09e'));
  descendant(taskRoot, path.resolve(sandbox));
  const parent = realpathSync(path.dirname(sandbox));
  if (parent !== taskRoot) descendant(taskRoot, parent);
  // mkdir without recursive is an exclusive ownership claim; never reuse state.
  mkdirSync(sandbox);
  if (realpathSync(sandbox) !== path.resolve(sandbox)) throw new Error('REPARSE_SANDBOX_REFUSED');
  const bundle = path.join(sandbox, 'private bundle Юнікод');
  mkdirSync(bundle); mkdirSync(path.join(bundle, 'scripts'));
  for (const name of entries) {
    const source = path.join(workspace, 'plugin', 'scripts', name);
    if (!/^[a-f0-9]{64}$/.test(hashes[name] ?? '') || digest(source) !== hashes[name]) throw new Error(`ARTIFACT_HASH_MISMATCH: ${name}`);
    const target = path.join(bundle, 'scripts', name);
    copyFileSync(source, target);
    if (digest(target) !== hashes[name]) throw new Error(`COPY_HASH_MISMATCH: ${name}`);
  }
  const env = syntheticEnvironment(sandbox, tools);
  for (const directory of ['home', 'appdata', 'localappdata', 'config', 'codex', 'data', 'temp', 'npm-cache', 'node_modules']) mkdirSync(path.join(sandbox, directory));
  writeFileSync(env.npm_config_userconfig, ''); writeFileSync(env.npm_config_globalconfig, '');
  writeFileSync(path.join(env.CLAUDE_MEM_DATA_DIR, 'settings.json'), '{}\n');
  return { sandbox, bundle, env, tools, hashes: { ...hashes } };
}

export function leafCases(fixture, launcherProtocol) {
  if (!Number.isSafeInteger(launcherProtocol)) throw new Error('EXACT_PROTOCOL_REQUIRED');
  const base = { executable: fixture.tools.node, cwd: fixture.sandbox, env: fixture.env, stdin: '', ...deadlines };
  const script = name => path.join(fixture.bundle, 'scripts', name);
  return [
    { ...base, id: 'launcher-version', args: [script('claude-mem-launcher.cjs'), '--version'], expected: { exit: 0, stdout: `${launcherProtocol}\n`, stderr: '' }, evidence: 'load-only' },
    { ...base, id: 'preflight-controlled-refusal', args: [script('ensure-launcher.cjs')], expected: { exit: 0, systemMessageCode: 'PRIVATE_LAUNCH_POLICY_PENDING' }, evidence: 'controlled-refusal' },
    // This opt-out exits before settings/root/runtime discovery in the generated launcher.
    { ...base, id: 'hook-opt-out', env: { ...fixture.env, CLAUDE_MEM_DISABLE_TOOL_HOOKS: '1' }, args: [script('claude-mem-launcher.cjs'), 'hook', 'claude-code', 'observation'], expected: { exit: 0, stdout: '', stderr: '' }, evidence: 'no-op' },
  ];
}

/** Future compiled-process refusal cases, authored/tested with mocks only.
 * Never modify copied artifacts to fabricate stale-runtime acceptance evidence.
 * Stale here means an executing entry from a different explicit root; approved
 * runtime version/hash rejection still awaits the artifact contract.
 */
export function refusalCases(fixture) {
  const args = [path.join(fixture.bundle, 'scripts', 'claude-mem-launcher.cjs'), 'status'];
  const base = { executable: fixture.tools.node, cwd: fixture.sandbox, stdin: '', args, ...deadlines, evidence: 'controlled-refusal' };
  return [
    { ...base, id: 'launcher-root-required', env: fixture.env, code: 'LOCAL_BUNDLE_ROOT_REQUIRED' },
    { ...base, id: 'launcher-missing-bundle', env: { ...fixture.env, CLAUDE_MEM_BUNDLE_ROOT: path.join(fixture.sandbox, 'missing bundle') }, code: 'LOCAL_BUNDLE_MISSING' },
    { ...base, id: 'launcher-stale-entry', env: { ...fixture.env, CLAUDE_MEM_BUNDLE_ROOT: fixture.sandbox }, code: 'LOCAL_BUNDLE_STALE' },
    { ...base, id: 'launcher-unapproved-bundle', env: { ...fixture.env, CLAUDE_MEM_BUNDLE_ROOT: fixture.bundle }, code: 'PRIVATE_LAUNCH_POLICY_PENDING' },
  ].map(({ code, ...spec }) => ({ ...spec, expected: { exit: 1, stdout: '', stderrCode: code } }));
}

/** Copied wrapper negative specs only; no worker/MCP startup success implied. */
export function wrapperRefusalCases(fixture) {
  return ['bun-runner.js', 'version-check.js', 'worker-wrapper.cjs', 'qoder-hook-launcher.cjs'].flatMap(name => [
    ['interpreter-required', fixture.env, 'LOCAL_INTERPRETER_ABSOLUTE_REQUIRED'],
    ['interpreter-relative', { ...fixture.env, CLAUDE_MEM_NODE_EXECUTABLE: 'node' }, 'LOCAL_INTERPRETER_ABSOLUTE_REQUIRED'],
    ['interpreter-missing', { ...fixture.env, CLAUDE_MEM_NODE_EXECUTABLE: path.join(fixture.sandbox, 'missing-node.exe') }, 'LOCAL_INTERPRETER_MISSING'],
    ['interpreter-stale', { ...fixture.env, CLAUDE_MEM_NODE_EXECUTABLE: fixture.tools.bun }, 'LOCAL_INTERPRETER_STALE'],
    ['root-required', { ...fixture.env, CLAUDE_MEM_NODE_EXECUTABLE: fixture.tools.node }, 'LOCAL_BUNDLE_ROOT_REQUIRED'],
    ['missing-bundle', { ...fixture.env, CLAUDE_MEM_NODE_EXECUTABLE: fixture.tools.node, CLAUDE_MEM_BUNDLE_ROOT: path.join(fixture.sandbox, 'missing') }, 'LOCAL_BUNDLE_MISSING'],
    ['unapproved-bundle', { ...fixture.env, CLAUDE_MEM_NODE_EXECUTABLE: fixture.tools.node, CLAUDE_MEM_BUNDLE_ROOT: fixture.bundle }, 'PRIVATE_LAUNCH_POLICY_PENDING'],
  ].map(([suffix, env, code]) => ({
    id: `${name}-${suffix}`, executable: fixture.tools.node, args: [path.join(fixture.bundle, 'scripts', name)],
    cwd: fixture.sandbox, env, stdin: '', ...deadlines, evidence: 'controlled-refusal',
    expected: { exit: name === 'qoder-hook-launcher.cjs' ? 0 : 1, stdout: '', stderrCode: code },
  })));
}

function bounded(promise, ms, label) {
  let timer;
  return Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(label)), ms); })]).finally(() => clearTimeout(timer));
}

function validateSpec(spec) {
  if (!spec || typeof spec.id !== 'string' || !spec.id ||
      typeof spec.executable !== 'string' || !path.isAbsolute(spec.executable) ||
      typeof spec.cwd !== 'string' || !path.isAbsolute(spec.cwd) ||
      !Array.isArray(spec.args) || !spec.args.every(arg => typeof arg === 'string') ||
      !spec.env || typeof spec.env !== 'object' || Array.isArray(spec.env) ||
      !Object.values(spec.env).every(value => typeof value === 'string') ||
      typeof spec.stdin !== 'string' || !spec.expected || !Number.isInteger(spec.expected.exit) ||
      spec.expected.exit < 0 || spec.expected.exit > 255) throw new Error('INVALID_CASE_SPEC');
  for (const key of ['runMs', 'cleanupMs', 'maxOutputBytes']) {
    if (!Number.isSafeInteger(spec[key]) || spec[key] <= 0 || spec[key] > deadlines[key]) throw new Error(`INVALID_CASE_LIMIT: ${key}`);
  }
  for (const key of ['stdout', 'stderr', 'stderrCode', 'systemMessageCode']) {
    if (key in spec.expected && typeof spec.expected[key] !== 'string') throw new Error(`INVALID_EXPECTATION: ${key}`);
  }
}

/** Mock orchestration only. A returned object is an unverified ownership claim,
 * not native admission. Capture cleanup methods independently, even on malformed
 * handles; attempt release after stop failure/timeout. Sync launch refusal (or no
 * usable handle) leaves ownership UNKNOWN, never inferred released. Timers bound
 * asynchronous waits, not synchronous JS or cancellation of a pending callback.
 * Native atomic admission/OS egress/DNS/descendant and release proof is absent.
 */
export async function runCase(spec, adapter) {
  if (!adapter || !['mock', 'native'].includes(adapter.kind) || typeof adapter.launch !== 'function') throw new Error('BLOCKED: APPROVED_PROCESS_ADAPTER_REQUIRED');
  // There is no implemented OS-owned-tree/egress/DNS adapter. A caller-supplied
  // label or a method returning true cannot certify that boundary.
  if (adapter.kind === 'native') throw new Error('BLOCKED: NATIVE_OS_BOUNDARY_NOT_IMPLEMENTED');
  validateSpec(spec); // No launch on invalid inputs; not an OS/security approval.
  let owned, stop, release, primaryError;
  let primaryFailed = false;
  let ownership = 'unknown';
  const cleanupFailures = [];
  const capture = (method, phase) => {
    try {
      const callback = owned[method];
      if (typeof callback !== 'function') throw new Error(`INVALID_OWNED_HANDLE: ${method}`);
      return callback.bind(owned);
    } catch (error) { cleanupFailures.push({ phase, error }); }
  };
  try {
    owned = adapter.launch(spec);
    if (!owned || typeof owned !== 'object') throw new Error('INVALID_OWNED_HANDLE');
    ownership = 'returned-unverified';
    stop = capture('stopOwnedTree', 'stop');
    release = capture('assertReleased', 'release');
    if (typeof owned.then === 'function') {
      // Async launch cannot transfer ownership synchronously; drain rejection only.
      Promise.resolve(owned).catch(() => {});
      ownership = 'unknown';
      throw new Error('INVALID_OWNED_HANDLE: async launch');
    }
    const completion = owned.completion;
    if (!completion || typeof completion.then !== 'function') throw new Error('INVALID_OWNED_HANDLE: completion');
    // Consume completion even when cleanup methods are malformed/rejected.
    const pending = Promise.resolve(completion);
    if (cleanupFailures.length) {
      pending.catch(() => {});
      throw new Error('INVALID_OWNED_HANDLE: cleanup');
    }
    const result = await bounded(pending, spec.runMs, 'PROCESS_DEADLINE');
    if (!result || !Number.isInteger(result.exit) || typeof result.stdout !== 'string' || typeof result.stderr !== 'string') throw new Error('INVALID_PROCESS_RESULT');
    if (Buffer.byteLength(result.stdout) + Buffer.byteLength(result.stderr) > spec.maxOutputBytes) throw new Error('OUTPUT_LIMIT');
    if (result.signal || result.exit !== spec.expected.exit) throw new Error('UNEXPECTED_PROCESS_EXIT');
    for (const key of ['stdout', 'stderr']) if (key in spec.expected && result[key] !== spec.expected[key]) throw new Error(`UNEXPECTED_${key.toUpperCase()}`);
    if (spec.expected.stderrCode && !result.stderr.startsWith(`cmem-light: ${spec.expected.stderrCode}:`)) throw new Error('MISSING_CONTROLLED_REFUSAL');
    if (spec.expected.systemMessageCode) {
      const parsed = JSON.parse(result.stdout);
      if (typeof parsed.systemMessage !== 'string' || !parsed.systemMessage.includes(`${spec.expected.systemMessageCode}:`) || !result.stderr.includes(`${spec.expected.systemMessageCode}:`)) throw new Error('MISSING_CONTROLLED_REFUSAL');
    }
  } catch (error) {
    primaryFailed = true;
    primaryError = error;
  }
  for (const [phase, callback, label] of [['stop', stop, 'CLEANUP_DEADLINE'], ['release', release, 'RELEASE_DEADLINE']]) {
    if (!callback) continue; // Missing/throwing members already recorded separately.
    try {
      const result = await bounded(Promise.resolve().then(callback), spec.cleanupMs, label);
      if (result === false) throw new Error(phase === 'release' ? 'OWNED_RESOURCES_REMAIN' : 'STOP_NOT_CONFIRMED');
    } catch (error) { cleanupFailures.push({ phase, error }); }
  }
  if (primaryFailed || cleanupFailures.length) {
    const failures = [...(primaryFailed ? [{ phase: 'primary', error: primaryError }] : []), ...cleanupFailures];
    const failure = new AggregateError(failures.map(item => item.error),
      failures.map(item => `${item.phase}: ${String(item.error)}`).join('; '));
    Object.assign(failure, { primaryFailed, primaryError, cleanupFailures, ownership, cleanup: 'unproved' });
    throw failure;
  }
  return { status: 'PASS', level: 'V1', substituted: true, id: spec.id, evidence: spec.evidence, readiness: false };
}
