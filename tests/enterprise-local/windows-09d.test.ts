import { describe, expect, it } from 'bun:test';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
import { buildExecHook, buildEnsureLauncherExecHook, buildHostRefusalPayload, buildCodexWindowsCommand, buildShellCommand, explicitHostInterpreter, standaloneRefusalWrappers } from '../../src/build/hook-shell-template.js';
import { shellTemplateManifest, verifyClaudeCodeRuntimeHooksAreExecForm } from '../../scripts/build-hooks.js';
import * as diagnostics from '../../src/npx-cli/commands/doctor.js';
import * as runtime from '../../src/npx-cli/commands/runtime.js';

const root = path.resolve('.scratch/enterprise-local/windows-09d/synthetic bundle Юнікод');
const node = path.join(root, 'tools', 'node.exe');
const poison = new Proxy({}, { get() { throw Error('unexpected input/callback/state access'); } });
// Authored source only: never evaluate emitted wrappers or application bundles.
function runGate(env: object, fs: any, options: { executable?: string; payload?: string; argv?: string[] } = {}) {
  let stderr = '', stdout = '', exit: number | undefined;
  const halt = {};
  try {
    vm.runInNewContext(options.payload ?? buildHostRefusalPayload(false), {
      require: (name: string) => name === 'node:path' ? path : name === 'node:fs' ? fs : (() => { throw Error(name); })(),
      process: { env, execPath: options.executable ?? node, argv: options.argv ?? [],
        stderr: { write: (s: string) => { stderr += s; } }, stdout: { write: (s: string) => { stdout += s; } },
        exit: (n: number) => { exit = n; throw halt; } },
    }, { timeout: 1000 });
  } catch (error) { if (error !== halt) throw error; }
  return { exit, stdout, stderr };
}
const present = { realpathSync: (value: string) => value, statSync: () => ({ isFile: () => true }) };
const env = { CLAUDE_MEM_NODE_EXECUTABLE: node, CLAUDE_MEM_BUNDLE_ROOT: root };

describe('WINDOWS-09D explicit interpreter / disabled host source contract', () => {
  it('renders literal absolute structured argv, including spaces and Unicode, without shell substitution', () => {
    expect(explicitHostInterpreter('C:/runtime Юнікод/node.exe', 'win32')).toBe('C:\\runtime Юнікод\\node.exe');
    expect(explicitHostInterpreter('/runtime Юнікод/node', 'posix')).toBe('/runtime Юнікод/node');
    const hook = buildExecHook(['hook','claude-code','context'], { path: node, platform: 'win32' });
    expect(hook.command).toBe(node); expect(hook.args[0]).toBe('-e');
    expect(runGate({ CLAUDE_MEM_BUNDLE_ROOT: root }, present, { payload: hook.args[1] })).toMatchObject({ exit: 0, stdout: '', stderr: expect.stringContaining('PRIVATE_LAUNCH_POLICY_PENDING:') });
  });
  it('rejects missing/relative, drive-relative, UNC, traversal and substitution/quoting inputs at render time', () => {
    for (const value of ['', 'node', 'C:node.exe', '\\node.exe', '\\\\server\\node.exe', 'C:/a/../node.exe', 'C:/a/./node.exe', 'C:/x/%NODE%.exe', 'C:/x/$NODE.exe', 'C:/x/"node.exe', 'C:/x/node.exe;exit', 'C:/x/node.exe\n']) expect(() => explicitHostInterpreter(value, 'win32')).toThrow('LOCAL_INTERPRETER_');
    for (const value of ['node','//host/node','/a/../node','/a/$NODE','/a/node;exit']) expect(() => explicitHostInterpreter(value,'posix')).toThrow('LOCAL_INTERPRETER_');
    expect(() => explicitHostInterpreter('/node', 'unknown' as any)).toThrow('LOCAL_INTERPRETER_PLATFORM_REQUIRED');
  });
  it('refuses missing/relative interpreter before filesystem or ambient discovery', () => {
    for (const value of [undefined,'','node','\\\\server\\share\\node.exe','//server/share/node.exe']) expect(runGate({ CLAUDE_MEM_NODE_EXECUTABLE: value }, poison)).toMatchObject({ exit: 1, stdout: '', stderr: expect.stringContaining('LOCAL_INTERPRETER_ABSOLUTE_REQUIRED:') });
  });
  it('refuses missing/aliased/foreign executable before inspecting bundle assets', () => {
    expect(runGate(env, { realpathSync() { throw Error('missing'); } }).stderr).toContain('LOCAL_INTERPRETER_MISSING:');
    expect(runGate(env, { realpathSync: () => node + '-alias' }).stderr).toContain('LOCAL_INTERPRETER_STALE:');
    const reads: string[] = [];
    expect(runGate(env, { realpathSync: (p: string) => { reads.push(p); return p; } }, { executable: node + '-foreign' }).stderr).toContain('LOCAL_INTERPRETER_STALE:');
    expect(reads).toEqual([node,node+'-foreign']);
  });
  it('keeps exact present interpreter/bundle unapproved, preserving root/stale refusal and empty stdout', () => {
    expect(runGate({ CLAUDE_MEM_NODE_EXECUTABLE: node }, present).stderr).toContain('LOCAL_BUNDLE_ROOT_REQUIRED:');
    expect(runGate(env, { ...present, realpathSync: (p: string) => { if (p === root) throw Error('missing'); return p; } }).stderr).toContain('LOCAL_BUNDLE_MISSING:');
    expect(runGate(env, { ...present, realpathSync: (p: string) => p === root ? root + '-alias' : p }).stderr).toContain('LOCAL_BUNDLE_STALE:');
    const result = runGate(env, present);
    expect(result.stderr).toContain('Memory readiness is not established.');
    expect(result.stderr.endsWith('\n')).toBe(true);
    expect(result).toMatchObject({ exit: 1, stdout: '', stderr: expect.stringContaining('PRIVATE_LAUNCH_POLICY_PENDING:') });
    expect(runGate(env,present,{payload:buildHostRefusalPayload(false,[],'version-check.js'),argv:['node',path.join(root,'foreign.js')]}).stderr).toContain('LOCAL_BUNDLE_STALE:');
  });
  it('preserves authored hook opt-out before interpreter/root access and nonblocking gate envelope', () => {
    const payload = buildExecHook(['hook','claude-code','observation']).args[1];
    expect(runGate({CLAUDE_MEM_DISABLE_TOOL_HOOKS:'1'},poison,{payload})).toEqual({exit:0,stdout:'',stderr:''});
    expect(runGate({},poison,{payload})).toMatchObject({exit:0,stdout:'',stderr:expect.stringContaining('LOCAL_INTERPRETER_ABSOLUTE_REQUIRED:')});
  });
  it('pairs retained canonical hosts and MCP interpreter, leaving structured paths unbound', () => {
    const manifest = shellTemplateManifest(buildShellCommand,buildCodexWindowsCommand,buildExecHook,buildEnsureLauncherExecHook);
    for (const [file,spec] of Object.entries(manifest) as any) {
      const parsed = JSON.parse(readFileSync(file,'utf8'));
      if (spec.kind === 'mcp') {
        expect(parsed.mcpServers['mcp-search']).toMatchObject({command:'',args:['-e',spec.command]});
        expect(spec.interpreter).toBe('');
      }
      for (const [loc,expected] of Object.entries(spec.execEntries ?? {}) as any) {
        const [e,g,h] = loc.split('.'); expect(parsed.hooks[e][g].hooks[h]).toEqual(expected.entry);
        expect(expected.entry.command).toBe('');
      }
      if (spec.execEntries) verifyClaudeCodeRuntimeHooksAreExecForm(parsed,spec.execEntries,buildEnsureLauncherExecHook(),file);
      for (const [loc,expected] of Object.entries(spec.commands ?? {}) as any) {
        const [e,g,h] = loc.split('.'); expect(parsed.hooks[e][g].hooks[h].command).toBe('exit 1');
        if (expected.commandWindows) expect(parsed.hooks[e][g].hooks[h].commandWindows).toBe('exit 1');
      }
    }
    const altered = JSON.parse(readFileSync('plugin/hooks/hooks.json','utf8'));
    altered.hooks.Stop[0].hooks[0].command = 'node';
    expect(() => verifyClaudeCodeRuntimeHooksAreExecForm(altered,manifest['plugin/hooks/hooks.json'].execEntries,buildEnsureLauncherExecHook(),'synthetic')).toThrow('must be exec form');
    for (const [file,source] of Object.entries(standaloneRefusalWrappers())) {
      expect(readFileSync(file,'utf8')).toBe(source); expect(source.startsWith('#!')).toBe(false);
      expect(source).not.toMatch(/child_process|spawn|fetch\(|\/bin\/sh|env node/);
    }
  });
});

describe('WINDOWS-09D direct helper refusal (no installer/application imports)', () => {
  it('rejects each installer operation before argument/default/callback/state inspection', async () => {
    const file = 'src/npx-cli/commands/install.ts', text = readFileSync(file,'utf8');
    const tree = ts.createSourceFile(file,text,ts.ScriptTarget.Latest,true);
    const names = ['disableClaudeAutoMemory','makeIDETask','claudeCodeInstallCommand','writeTrimmedMarketplaceManifest','writeTrimmedMarketplacePackageJson','mergeSettings','openBrowser','promptProvider','overwriteWithWorkerStopped','requireWorkerStopped','validateNonInteractiveProvider','waitForReturnToOpenBrowser','workerShutdownFailure','buildSyncConnectionSettings','buildTrialReadySettings','parseInstallerOAuthStartBody','parseTrialReadyBody','startInstallerOAuthPairing','waitForInstallerPairing','completeInstallerOAuthLogin','offerDeferredLogin','activateBrowserEnrollment','completeCmemTrialPairing','runInstallCommand','runRepairCommand'];
    for (const name of names) {
      const declaration = tree.statements.find((n: any) => ts.isFunctionDeclaration(n) && n.name?.text === name) as ts.FunctionDeclaration;
      expect(declaration).toBeDefined(); expect(declaration.body!.statements.length).toBe(1);
      expect(ts.isThrowStatement(declaration.body!.statements[0])).toBe(true);
      const js = ts.transpileModule(declaration.getText(tree),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
      const box = { exports: {}, process: poison } as any;
      vm.runInNewContext(js,box,{timeout:1000});
      const action = box.exports[name];
      if (ts.getModifiers(declaration)?.some(m => m.kind === ts.SyntaxKind.AsyncKeyword)) {
        await expect(action(poison,poison,poison,poison)).rejects.toThrow('LOCAL_RUNTIME_UNAPPROVED:');
        await expect(action()).rejects.toThrow('LOCAL_RUNTIME_UNAPPROVED:');
      } else {
        expect(() => action(poison,poison,poison,poison)).toThrow('LOCAL_RUNTIME_UNAPPROVED:');
        expect(() => action()).toThrow('LOCAL_RUNTIME_UNAPPROVED:');
      }
    }
    const emitted = ts.transpileModule(text,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
    expect(emitted).not.toMatch(/require\(["'].*(?:paths|worker|shutdown|setup-runtime|EnvManager|settings|process-registry|auth)[^"']*["']\)/);
    expect(text).not.toMatch(/spawnHidden|holdSpawnLock|runNpmStrict|installClaudeCode|installCodexCli|readPersistedInstallerSettings|pollInstallerPairingOnce|requireInstallerOAuthLogin/);
  });
  it('refuses runtime exports without private discovery/spawn/embedder/import implementations', async () => {
    for (const [name,action] of Object.entries(runtime)) {
      if (action.constructor.name === 'AsyncFunction') await expect((action as any)(poison)).rejects.toThrow('LOCAL_RUNTIME_UNAPPROVED:');
      else expect(() => (action as any)(poison)).toThrow('LOCAL_RUNTIME_UNAPPROVED:');
    }
    expect(readFileSync('src/npx-cli/commands/runtime.ts','utf8')).not.toMatch(/\bimport\b|spawnHidden|ensureServerEmbedder|resolvePluginRoot|SettingsDefaultsManager/);
  });
  it('returns required diagnostic failure even for present/success-shaped unapproved input', async () => {
    for (const name of ['probeChromaDiagnostics','pluginRootCheck','treeSitterCliCheck','marketplaceManifestCheck','hookLauncherCheck','claudeCodeVersionCheck']) {
      const result = await (diagnostics as any)[name](poison,poison);
      for (const row of Array.isArray(result) ? result : [result]) expect(row).toMatchObject({status:'fail',required:true,detail:expect.stringContaining('LOCAL_DIAGNOSTICS_UNAPPROVED:')});
      const noInput = await (diagnostics as any)[name]();
      for (const row of Array.isArray(noInput) ? noInput : [noInput]) expect(row.status).toBe('fail');
    }
    await expect(diagnostics.runDoctorCommand()).rejects.toThrow('LOCAL_RUNTIME_UNAPPROVED:');
    expect(readFileSync('src/npx-cli/commands/doctor.ts','utf8')).not.toMatch(/\bfetch\b|readFileSync|statSync|currentLauncherHostEnvironment|probeLauncherVersion|readProcessTablePosix/);
  });
});
