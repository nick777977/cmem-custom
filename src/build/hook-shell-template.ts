/** Canonical host gates for the blocked private candidate (WINDOWS-09C).
 * No host/cache/cwd/global launcher discovery, application load or child process.
 * The host Node interpreter remains a deployment prerequisite, not approved here.
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
export function buildHostRefusalPayload(nonblocking: boolean, args: string[] = [], entryName?: string): string {
  const optOut = optOutVariable(args);
  return (optOut ? `if(process.env.CLAUDE_MEM_DISABLE_TOOL_HOOKS==='1'||process.env.${optOut}==='1')process.exit(0);` : '')
    + `var p=require('node:path'),f=require('node:fs'),r=process.env.CLAUDE_MEM_BUNDLE_ROOT,c='LOCAL_BUNDLE_ROOT_REQUIRED';`
    + `if(r&&p.isAbsolute(r)){c='LOCAL_BUNDLE_MISSING';try{var root=f.realpathSync(r),entry=p.join(r,'scripts','claude-mem-launcher.cjs');`
    + `if(root!==p.resolve(r)){c='LOCAL_BUNDLE_STALE';}else if(f.statSync(entry).isFile()){c='PRIVATE_LAUNCH_POLICY_PENDING';`
    + (entryName ? `if(!process.argv[1]||f.realpathSync(process.argv[1])!==p.join(root,'scripts',${JSON.stringify(entryName)}))c='LOCAL_BUNDLE_STALE';` : '')
    + `}}catch(e){c='LOCAL_BUNDLE_MISSING';}}`
    + `process.stderr.write('cmem-light: '+c+': private host entry disabled; approved runtime/loading/assets required. Memory readiness is not established.\\n');`
    + `process.exit(${nonblocking ? 0 : 1});`;
}

export interface ExecHookCommand { command: string; args: string[] }
// Runs an inert gate, never the on-PATH claude-mem launcher or an application.
// Exact interpreter packaging/loading awaits D5. Do not register this candidate.
export const CLAUDE_MEM_LAUNCHER_COMMAND = 'node';
export function buildExecHook(workerServiceArguments: string[]): ExecHookCommand {
  return { command: CLAUDE_MEM_LAUNCHER_COMMAND, args: ['-e', buildHostRefusalPayload(true, workerServiceArguments)] };
}
export function buildEnsureLauncherExecHook(): ExecHookCommand {
  return buildExecHook([]);
}
export function buildCodexWindowsCommand(workerArgs: string[], _options: { requireDependencies?: boolean } = {}): string {
  return 'node -e "' + buildHostRefusalPayload(true, workerArgs).replace(/"/g, '\\"') + '"';
}
export function buildShellCommand(options: ShellTemplateOptions): string {
  const payload = buildHostRefusalPayload(options.host === 'codex-cli', options.trailingCommand);
  if (options.host === 'mcp') return payload;
  const body = 'node -e ' + "'" + payload.replace(/'/g, "'\\''") + "'";
  return "/bin/sh -c '" + body.replace(/'/g, "'\\''") + "'";
}

export function standaloneRefusalWrappers(): Record<string, string> {
  return Object.fromEntries(['bun-runner.js', 'version-check.js', 'worker-wrapper.cjs', 'qoder-hook-launcher.cjs']
    .map(name => ['plugin/scripts/' + name, '#!/usr/bin/env node\n// Generated private refusal; source: src/build/hook-shell-template.ts\n'
      + buildHostRefusalPayload(name === 'qoder-hook-launcher.cjs', [], name) + '\n']));
}
