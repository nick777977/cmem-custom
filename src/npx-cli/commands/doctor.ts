/** WINDOWS-09D: refused diagnostics; no application runtime imports. */
import { win32 as windowsPath } from 'node:path';
import type { PluginRootResolution } from '../../shared/worker-utils.js';
import type { LauncherHostEnvironment } from '../../launcher/install-launcher.js';

type CheckStatus = 'ok' | 'warn' | 'fail';

export interface CheckResult {
  name: string;
  status: CheckStatus;
  detail: string;
  /** When false, a 'fail' does not affect the overall exit code. */
  required: boolean;
}

export async function probeChromaDiagnostics(workerUrl: string): Promise<CheckResult[]> {
  return [{ name: 'Private runtime diagnostics', status: 'fail', required: true, detail: 'LOCAL_DIAGNOSTICS_UNAPPROVED: explicit approved runtime/artifacts required; no host/PATH/settings/worker probe.' }];
}

export function pluginRootCheck(resolution: PluginRootResolution | null): CheckResult {
  return { name: 'Private runtime diagnostics', status: 'fail', required: true, detail: 'LOCAL_DIAGNOSTICS_UNAPPROVED: explicit approved runtime/artifacts required; no host/PATH/settings/worker probe.' };
}

export async function treeSitterCliCheck(pluginRoot: string, searchPath?: string): Promise<CheckResult> {
  return { name: 'Private runtime diagnostics', status: 'fail', required: true, detail: 'LOCAL_DIAGNOSTICS_UNAPPROVED: explicit approved runtime/artifacts required; no host/PATH/settings/worker probe.' };
}

export function marketplaceManifestCheck(marketplaceDir: string): CheckResult {
  return { name: 'Private runtime diagnostics', status: 'fail', required: true, detail: 'LOCAL_DIAGNOSTICS_UNAPPROVED: explicit approved runtime/artifacts required; no host/PATH/settings/worker probe.' };
}

export function windowsShimScriptPaths(shimPath: string, shimText: string): string[] {
  const shimDirectory = windowsPath.dirname(shimPath);
  const targets: string[] = [];
  const seen = new Set<string>();
  const add = (scriptPath: string) => {
    const trimmed = scriptPath.trim().replace(/^["']|["']$/g, '');
    if (!trimmed || !/\.js$/i.test(trimmed)) return;
    const resolved = windowsPath.isAbsolute(trimmed)
      ? windowsPath.normalize(trimmed)
      : windowsPath.normalize(windowsPath.join(shimDirectory, trimmed));
    const key = resolved.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    targets.push(resolved);
  };

  // cmd-shim: `"%_prog%"  "%dp0%\..\claude-mem\dist\npx-cli\index.js" %*`
  for (const match of shimText.matchAll(/%dp0%\\+([^"%\r\n]+)/gi)) add(match[1]);
  // cmd-shim .ps1: `& "node$exe" "$basedir/../claude-mem/dist/npx-cli/index.js" $args`
  for (const match of shimText.matchAll(/\$basedir[\\/]+([^"'\s]+)/gi)) add(match[1]);
  return targets;
}

export function hookLauncherCheck(
  host?: LauncherHostEnvironment,
  runningCliPath?: string,
): CheckResult {
  return { name: 'Private runtime diagnostics', status: 'fail', required: true, detail: 'LOCAL_DIAGNOSTICS_UNAPPROVED: explicit approved runtime/artifacts required; no host/PATH/settings/worker probe.' };
}

export function claudeCodeVersionCheck(detectedClaudeCodeVersion: string | undefined): CheckResult {
  return { name: 'Private runtime diagnostics', status: 'fail', required: true, detail: 'LOCAL_DIAGNOSTICS_UNAPPROVED: explicit approved runtime/artifacts required; no host/PATH/settings/worker probe.' };
}

export async function runDoctorCommand(): Promise<void> {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: private CLI runtime/diagnostics require approved explicit inputs; no host discovery, connection, spawn or repair.');
}
