import { describe, expect, it } from 'bun:test';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
import { buildHostRefusalPayload, buildExecHook, buildShellCommand, buildCodexWindowsCommand, standaloneRefusalWrappers } from '../../src/build/hook-shell-template.js';
import { parseFile, parseFilesBatch } from '../../src/services/smart-file-read/parser.js';
import { buildLauncherCompileArguments, probeLauncherVersion, findExecutableOnPath, resolveCompileBunPath, createAdhocCodesigner, WINDOWS_USER_PATH_APPEND_SCRIPT } from '../../src/launcher/install-launcher.js';
import { shellTemplateManifest, verifyClaudeCodeRuntimeHooksAreExecForm } from '../../scripts/build-hooks.js';
import { buildEnsureLauncherExecHook } from '../../src/build/hook-shell-template.js';

// Evaluate authored JS with mocked process/fs only. Never read/evaluate emitted apps.
function runGate(payload: string, env: object, fs: any, argv: string[] = []) {
  let stderr = '', stdout = '', exit: number | undefined;
  const halt = {};
  try {
    vm.runInNewContext(payload, { require: (name: string) => name === 'node:path' ? path : name === 'node:fs' ? fs : (() => { throw Error(name); })(),
      process: { env, argv, stderr: { write: (s: string) => { stderr += s; } }, stdout: { write: (s: string) => { stdout += s; } }, exit: (n: number) => { exit = n; throw halt; } } }, { timeout: 1000 });
  } catch (error) { if (error !== halt) throw error; }
  return { stderr, stdout, exit };
}
const root = path.resolve('.scratch/enterprise-local/windows-09c/mock bundle Юнікод');
const poison = new Proxy({}, { get() { throw Error('unexpected discovery/process/callback'); } });
const missing = { realpathSync() { throw Error('missing'); } };
const present = { realpathSync: (value: string) => value, statSync: () => ({ isFile: () => true }) };
const guardedEnv = (value?: string) => new Proxy({ CLAUDE_MEM_BUNDLE_ROOT: value }, { get(target: any, name: string) {
  if (name !== 'CLAUDE_MEM_BUNDLE_ROOT') throw Error('ambient env: ' + name); return target[name];
} });

describe('WINDOWS-09C authored host source gates (V1, mocked fs/process)', () => {
  it('requires explicit absolute root before filesystem discovery, independent of host roots', () => {
    for (const value of [undefined, '', 'relative']) expect(runGate(buildHostRefusalPayload(false), guardedEnv(value), poison)).toMatchObject({ exit: 1, stdout: '', stderr: expect.stringContaining('LOCAL_BUNDLE_ROOT_REQUIRED:') });
  });
  it('distinguishes missing, aliased/stale and present-but-unapproved assets without loading', () => {
    expect(runGate(buildHostRefusalPayload(false), guardedEnv(root), missing).stderr).toContain('LOCAL_BUNDLE_MISSING:');
    expect(runGate(buildHostRefusalPayload(false), guardedEnv(root), { realpathSync: () => root + '-other' }).stderr).toContain('LOCAL_BUNDLE_STALE:');
    const result = runGate(buildHostRefusalPayload(false), guardedEnv(root), present);
    expect(result).toMatchObject({ exit: 1, stdout: '' }); expect(result.stderr).toContain('PRIVATE_LAUNCH_POLICY_PENDING:');
    expect(result.stderr).toContain('Memory readiness is not established.');
    expect(result.stderr.endsWith('\n')).toBe(true);
  });
  it('refuses a directly invoked wrapper from a foreign executing entry', () => {
    expect(runGate(buildHostRefusalPayload(false, [], 'version-check.js'), guardedEnv(root), present, ['node', path.join(root, 'foreign.js')]).stderr).toContain('LOCAL_BUNDLE_STALE:');
  });
  it('keeps hook refusal nonblocking with empty stdout and opt-out before root read', () => {
    expect(runGate(buildExecHook(['hook','codex','context']).args[1], guardedEnv(), poison)).toMatchObject({ exit: 0, stdout: '', stderr: expect.stringContaining('LOCAL_BUNDLE_ROOT_REQUIRED:') });
    for (const event of ['observation','file-context']) expect(runGate(buildExecHook(['hook','codex',event]).args[1], { CLAUDE_MEM_DISABLE_TOOL_HOOKS: '1' }, poison)).toEqual({ exit: 0, stdout: '', stderr: '' });
  });
  it('generates every canonical host entry without app/cache/global launcher/PATH repair', () => {
    const manifest = shellTemplateManifest(buildShellCommand, buildCodexWindowsCommand, buildExecHook, buildEnsureLauncherExecHook);
    const encoded = JSON.stringify(manifest);
    for (const forbidden of ['plugins/cache','marketplaces','child_process','spawnSync','require(\'os\')','BUN_BE_BUN','export PATH','process.cwd','CLAUDE_PLUGIN_ROOT','PLUGIN_ROOT']) expect(encoded).not.toContain(forbidden);
    for (const [file, spec] of Object.entries(manifest) as any) {
      const parsed = JSON.parse(readFileSync(file, 'utf8'));
      for (const [location, expected] of Object.entries(spec.execEntries ?? {}) as any) {
        const [event,g,h] = location.split('.'); expect(parsed.hooks[event][g].hooks[h]).toEqual(expected.entry);
      }
      if (spec.execEntries) verifyClaudeCodeRuntimeHooksAreExecForm(parsed, spec.execEntries, buildEnsureLauncherExecHook(), file);
      for (const [location, expected] of Object.entries(spec.commands ?? {}) as any) {
        const [event,g,h] = location.split('.'); const entry = parsed.hooks[event][g].hooks[h];
        expect(entry.command).toBe(typeof expected === 'string' ? expected : expected.command);
        if (expected.commandWindows) expect(entry.commandWindows).toBe(expected.commandWindows);
      }
      if (spec.kind === 'mcp') expect(parsed.mcpServers['mcp-search'].args[1]).toBe(spec.command);
    }
    const legacy = JSON.parse(readFileSync('plugin/hooks/hooks.json','utf8'));
    legacy.hooks.Stop[0].hooks[0].command = 'claude-mem';
    expect(() => verifyClaudeCodeRuntimeHooksAreExecForm(legacy, manifest['plugin/hooks/hooks.json'].execEntries, buildEnsureLauncherExecHook(), 'mock')).toThrow('must be exec form');
  });
  it('pairs all four standalone refusals without installer/runtime imports or repair', () => {
    for (const [file, source] of Object.entries(standaloneRefusalWrappers())) {
      expect(readFileSync(file,'utf8')).toBe(source);
      expect(source).not.toMatch(/child_process|createRequire|spawn|fixBrokenScriptPath|\.claude|node_modules|fetch\(/);
    }
  });
});
describe('grammar and installer source refusal', () => {
  it('rejects parser operations without module/native build/query or partial success', () => {
    for (const file of ['sample.ts','sample.py','sample.md','unknown.xyz']) expect(() => parseFile('synthetic', file)).toThrow('LOCAL_GRAMMAR_UNAPPROVED:');
    expect(() => parseFilesBatch([{ absolutePath: root, relativePath: 'sample.ts', content: 'synthetic' }])).toThrow('LOCAL_GRAMMAR_UNAPPROVED:');
    const parser = readFileSync('src/services/smart-file-read/parser.ts','utf8');
    expect(parser).not.toMatch(/createRequire|execFileSync|resolveDataDir|grammarLibOptOut|ensureGrammarLib|--grammar-path|"-p"/);
  });
  it('refuses legacy compile/probe/codesign utilities before callbacks or PATH reads', () => {
    for (const action of [() => buildLauncherCompileArguments('', ''), () => probeLauncherVersion(''), () => findExecutableOnPath('', poison as any, 'win32'), () => resolveCompileBunPath('', 'win32', poison as any), () => createAdhocCodesigner(poison as any)('')]) expect(action).toThrow('PRIVATE_INSTALL_POLICY_PENDING:');
    expect(WINDOWS_USER_PATH_APPEND_SCRIPT).toBe("throw 'PRIVATE_INSTALL_POLICY_PENDING: registry changes disabled'");
  });
  it('pins plugin signup/bootstrap exported bodies to refusal, leaving native provider files separate', () => {
    const file = 'src/npx-cli/commands/install.ts', text = readFileSync(file,'utf8');
    const tree = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
    const names = ['startInstallerOAuthPairing','waitForInstallerPairing','completeInstallerOAuthLogin','offerDeferredLogin','activateBrowserEnrollment','completeCmemTrialPairing','runInstallCommandInner','runRepairCommandInner'];
    for (const name of names) {
      const declaration = tree.statements.find((node: any) => ts.isFunctionDeclaration(node) && node.name?.text === name) as any;
      expect(declaration.body.statements.length).toBe(1);
      expect(ts.isThrowStatement(declaration.body.statements[0])).toBe(true);
    }
    expect(readFileSync('src/npx-cli/index.ts','utf8')).toContain("if (!['help', '--help', '-h', 'version', '--version', '-v'].includes(command)) refuseAutomaticPluginSetup();");
  });
  it('refuses direct runtime and doctor command roots as well as the CLI dispatcher', () => {
    for (const file of ['src/npx-cli/commands/runtime.ts','src/npx-cli/commands/doctor.ts']) {
      const tree = ts.createSourceFile(file, readFileSync(file,'utf8'), ts.ScriptTarget.Latest, true);
      const roots = tree.statements.filter((node: any) => ts.isFunctionDeclaration(node) && node.name.text.startsWith('run') && ts.getModifiers(node)?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)) as any;
      expect(roots.length).toBeGreaterThan(0);
      for (const root of roots) {
        expect(root.body.statements.length).toBe(1);
        expect(ts.isThrowStatement(root.body.statements[0])).toBe(true);
      }
    }
  });
});
