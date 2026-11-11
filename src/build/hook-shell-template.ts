/** Canonical host gates for the blocked private candidate (WINDOWS-09D).
 * No host/cache/cwd/global launcher discovery, application load or child process.
 * Unbound structured commands are empty, non-runnable templates; host behavior is untested.
 * Shell entries refuse using the host's exit builtin, without selecting a shell.
 * Do not register these templates. A rendered literal path is not approval.
 * Old discovery/spawn options are accepted for source compatibility and ignored.
 */
export type ShellTemplateHost = 'claude-code-setup' | 'codex-cli' | 'mcp';
export interface ShellTemplateOptions {
  host: ShellTemplateHost;
  requireFile: string;
  requireFileSecondary?: string;
  requireDependencies?: boolean;
  trailingCommand?: string[];
  extraEnv?: Record<string, string>;
  trailingJson?: object;
  notFoundMessage: string;
  mcpExtraCandidates?: string[];
  mcpExtraCacheRoots?: string[];
}

function optOutVariable(args: string[]): string | undefined {
  if (args.at(-3) !== 'hook') return undefined;
  return args.at(-1) === 'observation' ? 'CLAUDE_MEM_DISABLE_OBSERVATION'
    : args.at(-1) === 'file-context' ? 'CLAUDE_MEM_DISABLE_FILE_CONTEXT' : undefined;
}

/** Dependency-free JS, also used for legacy standalone wrapper refusals.
 * Presence never becomes approval; no artifact/provenance success branch.
 */
export function buildHostRefusalPayload(nonblocking: boolean, args: string[] = [], entryName?: string, interpreterPath?: string): string {
  const optOut = optOutVariable(args);
  return (optOut ? `if(process.env.CLAUDE_MEM_DISABLE_TOOL_HOOKS==='1'||process.env.${optOut}==='1')process.exit(0);` : '')
    + `var p=require('node:path'),f=require('node:fs'),n=${interpreterPath === undefined ? 'process.env.CLAUDE_MEM_NODE_EXECUTABLE' : JSON.stringify(interpreterPath)},r=process.env.CLAUDE_MEM_BUNDLE_ROOT,c='LOCAL_INTERPRETER_ABSOLUTE_REQUIRED',valid=false;`
    + `function localAbsolute(v){return typeof v==='string'&&p.isAbsolute(v)&&p.resolve(v)===v&&!/^[\\\\/]{2}/.test(v);}`
    + `if(localAbsolute(n)){c='LOCAL_INTERPRETER_MISSING';try{if(f.realpathSync(n)!==n||f.realpathSync(process.execPath)!==n){c='LOCAL_INTERPRETER_STALE';}else{valid=true;c='LOCAL_BUNDLE_ROOT_REQUIRED';}}catch(e){c='LOCAL_INTERPRETER_MISSING';}}`
    + `if(valid&&localAbsolute(r)){c='LOCAL_BUNDLE_MISSING';try{var root=f.realpathSync(r),entry=p.join(r,'scripts','claude-mem-launcher.cjs');`
    + `if(root!==p.resolve(r)){c='LOCAL_BUNDLE_STALE';}else if(f.statSync(entry).isFile()){c='PRIVATE_LAUNCH_POLICY_PENDING';`
    + (entryName ? `if(!process.argv[1]||f.realpathSync(process.argv[1])!==p.join(root,'scripts',${JSON.stringify(entryName)}))c='LOCAL_BUNDLE_STALE';` : '')
    + `}}catch(e){c='LOCAL_BUNDLE_MISSING';}}`
    + `process.stderr.write('cmem-light: '+c+': private host entry disabled; approved runtime/loading/assets required. Memory readiness is not established.\\n');`
    + `process.exit(${nonblocking ? 0 : 1});`;
}

export interface ExecHookCommand { command: string; args: string[] }
// Runs an inert gate, never the on-PATH claude-mem launcher or an application.
// Exact interpreter packaging/loading awaits D5. Do not register this candidate.
export const CLAUDE_MEM_LAUNCHER_COMMAND = '';
/** Source rendering only. No env/host substitution, filesystem probe or approval.
 * Accept a fully qualified literal Windows drive path or POSIX path; reject UNC,
 * drive-relative/root-relative Windows paths, aliases and shell metacharacters.
 * Runtime version/hash/ABI admission is absent: the payload always refuses.
 */
export function explicitHostInterpreter(value: string, platform: 'win32' | 'posix'): string {
  if (platform !== 'win32' && platform !== 'posix') throw new Error('LOCAL_INTERPRETER_PLATFORM_REQUIRED');
  if (typeof value !== 'string' || !value || /[\x00-\x1f\x7f"'`$%!*?<>|;&{}]/.test(value)) throw new Error('LOCAL_INTERPRETER_LITERAL_REQUIRED');
  const parts = value.replace(/\\/g, '/').split('/');
  if (parts.some(part => part === '.' || part === '..')) throw new Error('LOCAL_INTERPRETER_ABSOLUTE_REQUIRED');
  if (platform === 'win32' ? !/^[A-Za-z]:[\\/][^:]+\.exe$/.test(value)
    : !value.startsWith('/') || value.startsWith('//') || value.includes('\\') || value.includes(':')) {
    throw new Error('LOCAL_INTERPRETER_ABSOLUTE_REQUIRED');
  }
  return platform === 'win32' ? value.replace(/\//g, '\\') : value;
}
export function buildExecHook(workerServiceArguments: string[], interpreter?: { path: string; platform: 'win32' | 'posix' }): ExecHookCommand {
  const command = interpreter ? explicitHostInterpreter(interpreter.path, interpreter.platform) : CLAUDE_MEM_LAUNCHER_COMMAND;
  return { command, args: ['-e', buildHostRefusalPayload(true, workerServiceArguments, undefined, interpreter ? command : undefined)] };
}
export function buildEnsureLauncherExecHook(): ExecHookCommand {
  return buildExecHook([]);
}
export function buildCodexWindowsCommand(workerArgs: string[], _options: { requireDependencies?: boolean } = {}): string {
  return 'exit 1'; // Unsupported shell binding: no cmd/PATH/env expansion of an interpreter.
}
export function buildShellCommand(options: ShellTemplateOptions): string {
  if (options.host === 'mcp') return buildHostRefusalPayload(false);
  return 'exit 1'; // Host-owned shell builtin only; no /bin/sh, substitution or child.
}

export function standaloneRefusalWrappers(): Record<string, string> {
  return Object.fromEntries(['bun-runner.js', 'version-check.js', 'worker-wrapper.cjs']
    .map(name => ['plugin/scripts/' + name, '// Generated private refusal; source: src/build/hook-shell-template.ts\n'
      + buildHostRefusalPayload(false, [], name) + '\n']));
}
