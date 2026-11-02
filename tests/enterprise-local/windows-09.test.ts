import { afterAll, describe, expect, it } from 'bun:test';
import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { isAbsolute, join, relative, resolve, sep } from 'node:path';
import { inspectLocalLauncherBundle } from '../../src/launcher/local-preflight.js';
import { ensureTreeSitterCliBinary, treeSitterCliBinaryPath, verifyLocalTreeSitterCli } from '../../src/services/smart-file-read/tree-sitter-cli-provision.js';
import { provisionTreeSitterCliForPluginRoot } from '../../src/services/worker/tree-sitter-cli-provisioning.js';

const task = resolve('.scratch/enterprise-local/windows-09');
mkdirSync(task, { recursive: true });
const root = mkdtempSync(join(task, 'refusal-'));
afterAll(() => {
  const delta = relative(realpathSync(task), realpathSync(root));
  if (!delta || isAbsolute(delta) || delta.startsWith(`..${sep}`) || delta === '..') throw new Error('unsafe test cleanup');
  rmSync(root, { recursive: true });
});
function fixture(name: string, bytes = 'synthetic executable - never run') {
  const bundle = join(root, name);
  const cli = join(bundle, 'node_modules', 'tree-sitter-cli');
  mkdirSync(cli, { recursive: true });
  writeFileSync(join(cli, 'package.json'), JSON.stringify({ version: 'synthetic' }));
  writeFileSync(treeSitterCliBinaryPath(bundle), bytes);
  return { bundle, hash: createHash('sha256').update(bytes).digest('hex') };
}

describe('WINDOWS-09 mutation-free refusal', () => {
  it('refuses missing/relative launcher entry without env/cache discovery', () => {
    for (const entry of [undefined, 'ensure-launcher.cjs', join(root, 'missing.cjs')]) expect(inspectLocalLauncherBundle(entry).code).toBe('LOCAL_BUNDLE_MISSING');
  });
  it('does not claim a present bundle is ready or choose a private identity', () => {
    const scripts = join(root, 'bundle spaces Юнікод', 'scripts');
    mkdirSync(scripts, { recursive: true });
    for (const file of ['ensure-launcher.cjs', 'claude-mem-launcher.cjs', 'worker-service.cjs']) writeFileSync(join(scripts, file), 'inert');
    expect(inspectLocalLauncherBundle(join(scripts, 'ensure-launcher.cjs'))).toMatchObject({ status: 'blocked', code: 'PRIVATE_LAUNCH_POLICY_PENDING' });
    rmSync(join(scripts, 'worker-service.cjs'));
    expect(inspectLocalLauncherBundle(join(scripts, 'ensure-launcher.cjs')).code).toBe('LOCAL_BUNDLE_MISSING');
  });
  it('refuses missing tree-sitter without executing, downloading or reading fallback getters', async () => {
    const fallback = { get buildFor(): never { throw new Error('fallback inspected'); }, get download(): never { throw new Error('download inspected'); } };
    await expect(ensureTreeSitterCliBinary(join(root, 'absent'), 1, () => undefined, fallback)).rejects.toThrow('LOCAL_TREE_SITTER_UNAVAILABLE');
    await expect(provisionTreeSitterCliForPluginRoot(join(root, 'absent'))).rejects.toThrow('LOCAL_TREE_SITTER_UNAVAILABLE');
  });
  it('rejects corrupt/unpinned bytes before the version-probe process boundary', async () => {
    const { bundle } = fixture('corrupt');
    await expect(ensureTreeSitterCliBinary(bundle, 1, () => '0'.repeat(64))).rejects.toThrow('hash mismatch');
    await expect(ensureTreeSitterCliBinary(bundle, 1, () => undefined)).rejects.toThrow('no pinned executable');
    expect(() => verifyLocalTreeSitterCli('relative')).toThrow('must be absolute');
  });
  it('validates matching synthetic bytes without executing them (not readiness)', () => {
    const { bundle, hash } = fixture('valid');
    expect(verifyLocalTreeSitterCli(bundle, version => version === 'synthetic' ? hash : undefined)).toBe(treeSitterCliBinaryPath(bundle));
  });
  it('refuses invalid manifest and non-file assets without repair', () => {
    const { bundle, hash } = fixture('manifest');
    writeFileSync(join(bundle, 'node_modules', 'tree-sitter-cli', 'package.json'), '{');
    expect(() => verifyLocalTreeSitterCli(bundle, () => hash)).toThrow('invalid local artifact');
    expect(readFileSync(treeSitterCliBinaryPath(bundle), 'utf8')).toBe('synthetic executable - never run');
    writeFileSync(join(bundle, 'node_modules', 'tree-sitter-cli', 'package.json'), JSON.stringify({ version: 'synthetic' }));
    rmSync(treeSitterCliBinaryPath(bundle));
    mkdirSync(treeSitterCliBinaryPath(bundle));
    expect(() => verifyLocalTreeSitterCli(bundle, () => hash)).toThrow('not a regular file');
  });
});
