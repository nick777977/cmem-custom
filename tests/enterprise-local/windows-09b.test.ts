import { afterAll, afterEach, describe, expect, it } from 'bun:test';
import { mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { isAbsolute, join, relative, resolve, sep } from 'node:path';
import { inspectLocalLauncherBundle, planPrivateLauncher } from '../../src/launcher/local-preflight.js';
import { LAUNCHER_PROTOCOL } from '../../src/launcher/launcher-protocol.js';
import * as setup from '../../src/npx-cli/install/setup-runtime.js';
import { ensureDirectoryOnWindowsUserPath, ensureLauncherOnPath, ensureLocalBinOnShellPath, removeInstalledLauncher } from '../../src/launcher/install-launcher.js';
import { checkTreeSitterCliLoadable, isTreeSitterCliAvailable, pickTreeSitterBinPath, resolveTreeSitterBinPath, resolveTreeSitterBinPathFor, treeSitterCliUnavailableMessage } from '../../src/services/smart-file-read/tree-sitter-bin-path.js';
import { treeSitterCliBinaryPath } from '../../src/services/smart-file-read/tree-sitter-cli-provision.js';

const task = resolve('.scratch/enterprise-local/windows-09b');
mkdirSync(task, { recursive: true });
const root = mkdtempSync(join(task, 'private paths Юнікод '));
const originalRoot = process.env.CLAUDE_MEM_BUNDLE_ROOT;
afterEach(() => {
  if (originalRoot === undefined) delete process.env.CLAUDE_MEM_BUNDLE_ROOT;
  else process.env.CLAUDE_MEM_BUNDLE_ROOT = originalRoot;
});
afterAll(() => {
  const delta = relative(realpathSync(task), realpathSync(root));
  if (!delta || isAbsolute(delta) || delta === '..' || delta.startsWith(`..${sep}`)) throw Error('unsafe test cleanup');
  rmSync(root, { recursive: true });
});
function bundle(name: string) {
  const directory = join(root, name);
  const scripts = join(directory, 'scripts');
  mkdirSync(scripts, { recursive: true });
  for (const file of ['claude-mem-launcher.cjs', 'ensure-launcher.cjs', 'worker-service.cjs']) writeFileSync(join(scripts, file), 'inert - never executed');
  return { directory, scripts, entry: join(scripts, 'claude-mem-launcher.cjs') };
}
const run = (args: string[], entry: string | undefined, env: NodeJS.ProcessEnv = {}) => planPrivateLauncher(args, entry, env, LAUNCHER_PROTOCOL);

describe('WINDOWS-09B private launcher (static source seam, V1)', () => {
  it('preserves version and opt-out before any root/host/runtime getter', () => {
    const env = new Proxy({}, { get() { throw Error('ambient discovery'); } });
    expect(run(['--version'], undefined, env)).toEqual({ exit: 0, stdout: '3\n', stderr: '' });
    const disabled = { CLAUDE_MEM_DISABLE_TOOL_HOOKS: '1', get CLAUDE_MEM_BUNDLE_ROOT(): never { throw Error('root read'); } };
    for (const event of ['observation', 'file-context']) expect(run(['hook', 'claude-code', event], undefined, disabled)).toEqual({ exit: 0, stdout: '', stderr: '' });
  });
  it('ignores global/upstream/host roots instead of selecting a different bundle', () => {
    const upstream = bundle('upstream exists');
    for (const selected of [undefined, 'relative', '']) {
      const result = run(['status'], upstream.entry, {
        CLAUDE_MEM_BUNDLE_ROOT: selected, CLAUDE_PLUGIN_ROOT: upstream.directory, PLUGIN_ROOT: upstream.directory,
        get CLAUDE_CONFIG_DIR(): never { throw Error('host settings read'); },
        get PATH(): never { throw Error('PATH read'); },
        get HOME(): never { throw Error('home read'); },
      });
      expect(result.exit).toBe(1);
      expect(result.stdout).toBe('');
      expect(result.stderr).toContain('LOCAL_BUNDLE_ROOT_REQUIRED:');
    }
  });
  it('distinguishes missing bundle and a stale entry from another root', () => {
    const selected = bundle('selected');
    const foreign = bundle('foreign');
    expect(run(['status'], selected.entry, { CLAUDE_MEM_BUNDLE_ROOT: join(root, 'absent') }).stderr).toContain('LOCAL_BUNDLE_MISSING:');
    expect(run(['status'], foreign.entry, { CLAUDE_MEM_BUNDLE_ROOT: selected.directory }).stderr).toContain('LOCAL_BUNDLE_STALE:');
    expect(run(['status'], undefined, { CLAUDE_MEM_BUNDLE_ROOT: selected.directory }).stderr).toContain('LOCAL_BUNDLE_MISSING:');
  });
  it('never equates present files with approved runtime or memory readiness', () => {
    const f = bundle('complete bundle spaces');
    const result = run(['start'], f.entry, { CLAUDE_MEM_BUNDLE_ROOT: f.directory });
    expect(result).toMatchObject({ exit: 1, stdout: '' });
    expect(result.stderr).toContain('PRIVATE_LAUNCH_POLICY_PENDING:');
    expect(result.stderr).toContain('Memory readiness is not established');
    // Preserve WINDOWS-09 SessionStart's always-blocked sibling preflight.
    expect(inspectLocalLauncherBundle(join(f.scripts, 'ensure-launcher.cjs'))).toMatchObject({ status: 'blocked', code: 'PRIVATE_LAUNCH_POLICY_PENDING' });
    rmSync(join(f.scripts, 'worker-service.cjs'));
    expect(run(['start'], f.entry, { CLAUDE_MEM_BUNDLE_ROOT: f.directory }).stderr).toContain('LOCAL_BUNDLE_MISSING:');
  });
  it('preserves nonblocking hook envelope without claiming capture success', () => {
    const result = run(['hook', 'codex', 'context'], undefined);
    expect(result.exit).toBe(0);
    expect(result.stdout).toBe('');
    expect(result.stderr).toContain('LOCAL_BUNDLE_ROOT_REQUIRED:');
  });
});

describe('retired automatic bootstrap entrypoints (no processes or user state)', () => {
  it('does not discover/probe runtimes or accept legacy install markers', () => {
    const poison = new Proxy({}, { get() { throw Error('env inspected'); } });
    expect(setup.bunCommonPaths(poison)).toEqual([]);
    expect(setup.uvCommonPaths(poison)).toEqual([]);
    expect(setup.getBunPath()).toBeNull();
    expect(setup.getBunVersion()).toBeNull();
    expect(setup.getUvVersion()).toBeNull();
    expect(setup.readInstallMarker(root)).toBeNull();
    expect(setup.isInstallCurrent(root, 'legacy')).toBe(false);
    expect(setup.hasServerEmbedder(root)).toBe(false);
  });
  it('refuses every acquisition API even with vector opt-out or optional packages', async () => {
    const calls = [() => setup.ensureBun(), () => setup.ensureUv(undefined, { allowVectorSearchOptOut: true }),
      () => setup.installPluginDependencies(root, 'unused', { optional: true }), () => setup.ensureServerEmbedder(root, 'unused'),
      () => setup.provisionTreeSitterCli(root, 'abort' as any, { warnings: [], failedIDEs: [] })];
    for (const call of calls) await expect(call()).rejects.toThrow('LOCAL_RUNTIME_UNAPPROVED:');
    expect(() => setup.verifyCriticalModules(root)).toThrow('LOCAL_RUNTIME_UNAPPROVED:');
    expect(() => setup.writeInstallMarker(root, 'x', 'y', 'z')).toThrow('LOCAL_RUNTIME_UNAPPROVED:');
  });
  it('refuses launcher compile/PATH/removal before reading callbacks or host', () => {
    const poison = new Proxy({}, { get() { throw Error('installer option read'); } });
    for (const call of [ensureDirectoryOnWindowsUserPath, ensureLauncherOnPath, ensureLocalBinOnShellPath, removeInstalledLauncher]) {
      expect(() => call(poison as any)).toThrow('PRIVATE_INSTALL_POLICY_PENDING:');
    }
  });
});

describe('parser bundle-local selection, no PATH/module fallback', () => {
  it('never returns a bare executable or probes a legacy PATH entry', () => {
    delete process.env.CLAUDE_MEM_BUNDLE_ROOT;
    const fake = treeSitterCliBinaryPath(root);
    mkdirSync(join(root, 'node_modules', 'tree-sitter-cli'), { recursive: true });
    writeFileSync(fake, 'inert PATH executable');
    expect(() => resolveTreeSitterBinPath()).toThrow('LOCAL_TREE_SITTER_UNAVAILABLE:');
    expect(() => resolveTreeSitterBinPathFor(fake, root)).toThrow('LOCAL_TREE_SITTER_UNAVAILABLE:');
    expect(() => pickTreeSitterBinPath(fake, 'tree-sitter', root)).toThrow('LOCAL_TREE_SITTER_UNAVAILABLE:');
    expect(isTreeSitterCliAvailable('tree-sitter', root)).toBe(false);
    expect(checkTreeSitterCliLoadable(fake, root)).toMatchObject({ present: false, loadable: false });
  });
  it('rejects missing/stale/unpinned local bytes before the subprocess boundary', () => {
    const f = bundle('parser corrupt');
    process.env.CLAUDE_MEM_BUNDLE_ROOT = f.directory;
    const cli = join(f.directory, 'node_modules', 'tree-sitter-cli');
    mkdirSync(cli, { recursive: true });
    const exe = treeSitterCliBinaryPath(f.directory);
    for (const version of ['0.26.9', 'unapproved']) {
      writeFileSync(join(cli, 'package.json'), JSON.stringify({ version }));
      writeFileSync(exe, 'synthetic corrupt executable');
      expect(() => resolveTreeSitterBinPath()).toThrow('LOCAL_TREE_SITTER_UNAVAILABLE:');
      expect(checkTreeSitterCliLoadable()).toMatchObject({ present: false, loadable: false });
      expect(treeSitterCliUnavailableMessage()).toContain('no PATH/module fallback or repair');
      expect(readFileSync(exe, 'utf8')).toBe('synthetic corrupt executable');
    }
  });
});
