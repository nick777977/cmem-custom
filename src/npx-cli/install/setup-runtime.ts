/** Legacy installer compatibility API. Acquisition and runtime discovery are
 * retired. Until an approved bundle/runtime contract exists, presence/version
 * markers cannot authorize execution, registration, repair or success.
 */
import type { InstallSummary } from './error-reporter.js';
import type { ErrorSeverity } from './error-taxonomy.js';

export function refuseAutomaticPluginSetup(): never {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: supply a reviewed private bundle and approved runtime/artifact contract; automatic download/install/compile/repair/login/registration is disabled (D5/U1/D9).');
}
export function platformBunRemediation(): string { return 'Supply approved bundle-local Bun assets; automatic installation/repair is disabled.'; }
export function platformUvRemediation(): string { return 'Local Chroma activation remains blocked by U1/D9; automatic installation/repair is disabled.'; }
export function bunCommonPaths(_env: NodeJS.ProcessEnv = {}): string[] { return []; }
export function uvCommonPaths(_env: NodeJS.ProcessEnv = {}): string[] { return []; }
export function getBunPath(): string | null { return null; }
export function getBunVersion(): string | null { return null; }
export function getUvVersion(): string | null { return null; }
export function verifyCriticalModules(_targetDir: string): void { refuseAutomaticPluginSetup(); }
export async function ensureBun(_summary?: InstallSummary): Promise<{ bunPath: string; version: string }> { return refuseAutomaticPluginSetup(); }
export async function ensureUv(_summary?: InstallSummary, _options: { allowVectorSearchOptOut?: boolean } = {}): Promise<{ uvPath: string; version: string }> { return refuseAutomaticPluginSetup(); }
export async function installPluginDependencies(_targetDir: string, _bunPath: string, _options: { optional?: boolean } = {}): Promise<void> { refuseAutomaticPluginSetup(); }
export function hasServerEmbedder(_pluginRoot: string): boolean { return false; }
export async function ensureServerEmbedder(_pluginRoot: string, _bunPath: string): Promise<void> { refuseAutomaticPluginSetup(); }
export async function provisionTreeSitterCli(
  _targetDir: string, _severity: ErrorSeverity.ABORT | ErrorSeverity.WARN_CONTINUE,
  _summary: InstallSummary, _installTimeoutMs?: number,
): Promise<boolean> { return refuseAutomaticPluginSetup(); }
interface MarkerSchema { version: string; bun?: string; uv?: string; installedAt?: string }
// Legacy markers are not approved-runtime evidence. Do not read/write user state.
export function readInstallMarker(_targetDir: string): MarkerSchema | null { return null; }
export function writeInstallMarker(_targetDir: string, _version: string, _bunVersion: string, _uvVersion: string): void { refuseAutomaticPluginSetup(); }
export function isInstallCurrent(_targetDir: string, _expectedVersion: string): boolean { return false; }
