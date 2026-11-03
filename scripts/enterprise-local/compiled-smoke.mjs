// V3 orchestration source. No CLI autorun and no ambient/native process adapter.
// Reuses worker-bundle-self-contained.test.ts's copied-bundle fixture, replacing
// its parent env spread with explicit synthetic paths and exact artifact hashes.
import { createHash } from 'node:crypto';
import { copyFileSync, mkdirSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import path from 'node:path';

export const deadlines = Object.freeze({ runMs: 15_000, cleanupMs: 5_000, maxOutputBytes: 64 * 1024 });
const entries = ['claude-mem-launcher.cjs', 'ensure-launcher.cjs', 'worker-service.cjs'];
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
  const taskRoot = realpathSync(path.join(workspace, '.scratch', 'enterprise-local', 'windows-09b'));
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

function bounded(promise, ms, label) {
  let timer;
  return Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(label)), ms); })]).finally(() => clearTimeout(timer));
}

/** Required adapter contract: launch returns synchronously an owned process-tree
 * handle (never throws after creating an unowned child). Completion captures both
 * streams within maxOutputBytes. stopOwnedTree and assertReleased target only that
 * OS-owned tree, including on timeout/exit/error; no image-name or global port kill.
 * A separately approved native adapter/OS egress boundary is required for actual V3.
 * This session tests with mocks only, and supplies no production security bypass.
 */
export async function runCase(spec, adapter) {
  if (!adapter || !['mock', 'native'].includes(adapter.kind) || typeof adapter.launch !== 'function') throw new Error('BLOCKED: APPROVED_PROCESS_ADAPTER_REQUIRED');
  const owned = adapter.launch(spec);
  try {
    const result = await bounded(owned.completion, spec.runMs, 'PROCESS_DEADLINE');
    if (result.signal || result.exit !== spec.expected.exit) throw new Error('UNEXPECTED_PROCESS_EXIT');
    if (Buffer.byteLength(result.stdout) + Buffer.byteLength(result.stderr) > spec.maxOutputBytes) throw new Error('OUTPUT_LIMIT');
    for (const key of ['stdout', 'stderr']) if (key in spec.expected && result[key] !== spec.expected[key]) throw new Error(`UNEXPECTED_${key.toUpperCase()}`);
    if (spec.expected.stderrCode && !result.stderr.startsWith(`cmem-light: ${spec.expected.stderrCode}:`)) throw new Error('MISSING_CONTROLLED_REFUSAL');
    if (spec.expected.systemMessageCode) {
      const parsed = JSON.parse(result.stdout);
      if (typeof parsed.systemMessage !== 'string' || !parsed.systemMessage.includes(`${spec.expected.systemMessageCode}:`) || !result.stderr.includes(`${spec.expected.systemMessageCode}:`)) throw new Error('MISSING_CONTROLLED_REFUSAL');
    }
    return { status: 'PASS', level: adapter.kind === 'mock' ? 'V1' : 'V3', substituted: adapter.kind === 'mock', id: spec.id, evidence: spec.evidence, readiness: false };
  } finally {
    await bounded(Promise.resolve().then(() => owned.stopOwnedTree()), spec.cleanupMs, 'CLEANUP_DEADLINE');
    await bounded(Promise.resolve().then(() => owned.assertReleased()), spec.cleanupMs, 'OWNED_RESOURCES_REMAIN');
  }
}
