/** WINDOWS-09C: legacy private installer compatibility API.
 * All operations refuse before argument inspection or host discovery.
 * D5 remains proposed. No native probe/compiler/registry/codesign/cleanup runner.
 * Signatures remain for existing callers; no deployment success is represented.
 */
export interface LauncherHostEnvironment {
  homeDirectory: string;
  platform: NodeJS.Platform;
  /** Mutated in place when PATH setup succeeds, like the original rc appender did. */
  environmentVariables: NodeJS.ProcessEnv;
}

export function currentLauncherHostEnvironment(): LauncherHostEnvironment {
  throw new Error('PRIVATE_INSTALL_POLICY_PENDING: D5 ownership/loading and approved immutable inputs are unresolved; no discovery, probe, compile, registry, codesign, repair or removal.');
}

export interface LauncherInstallLogger {
  info(message: string): void;
  success(message: string): void;
  warn(message: string): void;
}

export function resolveLauncherBinDirectory(host: LauncherHostEnvironment): string {
  throw new Error('PRIVATE_INSTALL_POLICY_PENDING: D5 ownership/loading and approved immutable inputs are unresolved; no discovery, probe, compile, registry, codesign, repair or removal.');
}

export function launcherBinaryFileName(platform: NodeJS.Platform): string {
  throw new Error('PRIVATE_INSTALL_POLICY_PENDING: D5 ownership/loading and approved immutable inputs are unresolved; no discovery, probe, compile, registry, codesign, repair or removal.');
}

export function resolveLauncherBinaryPath(host: LauncherHostEnvironment): string {
  throw new Error('PRIVATE_INSTALL_POLICY_PENDING: D5 ownership/loading and approved immutable inputs are unresolved; no discovery, probe, compile, registry, codesign, repair or removal.');
}

export function buildLauncherCompileArguments(launcherBundlePath: string, outfilePath: string): string[] {
  throw new Error('PRIVATE_INSTALL_POLICY_PENDING: D5 ownership/loading and approved immutable inputs are unresolved; no discovery, probe, compile, registry, codesign, repair or removal.');
}

export interface LauncherVersionProbe {
  /** The protocol the binary printed for `--version`, or null when it printed none. */
  protocol: number | null;
  /** Why no protocol came back (exit status, signal, spawn error, last stderr line); null on success. */
  failure: string | null;
  /** The process never started (spawn error). */
  failedToStart: boolean;
}

export function probeLauncherVersion(
  binaryPath: string,
  timeoutMs: number = 10_000,
): LauncherVersionProbe {
  throw new Error('PRIVATE_INSTALL_POLICY_PENDING: D5 ownership/loading and approved immutable inputs are unresolved; no discovery, probe, compile, registry, codesign, repair or removal.');
}

export function findExecutableOnPath(
  executableName: string,
  pathValue: string,
  platform: NodeJS.Platform,
  windowsPathExtensions: string = '.COM;.EXE;.BAT;.CMD',
): string | null {
  throw new Error('PRIVATE_INSTALL_POLICY_PENDING: D5 ownership/loading and approved immutable inputs are unresolved; no discovery, probe, compile, registry, codesign, repair or removal.');
}

export function detectShellConfigFile(
  homeDirectory: string,
  shellEnvironmentValue: string,
  platform: NodeJS.Platform,
): { path: string; shell: 'zsh' | 'bash' | 'fish' } {
  throw new Error('PRIVATE_INSTALL_POLICY_PENDING: D5 ownership/loading and approved immutable inputs are unresolved; no discovery, probe, compile, registry, codesign, repair or removal.');
}

export function shellPathSetupMarkerComment(purposeLabel: string): string {
  throw new Error('PRIVATE_INSTALL_POLICY_PENDING: D5 ownership/loading and approved immutable inputs are unresolved; no discovery, probe, compile, registry, codesign, repair or removal.');
}

export type ShellPathSetupOutcome =
  | 'already-on-path'
  | 'rc-file-already-configured'
  | 'rc-file-updated'
  | 'rc-file-update-failed';

export function ensureLocalBinOnShellPath(options: {
  purposeLabel: string;
  logger: LauncherInstallLogger;
  host?: LauncherHostEnvironment;
}): ShellPathSetupOutcome {
  throw new Error('PRIVATE_INSTALL_POLICY_PENDING: D5 ownership/loading and approved immutable inputs are unresolved; no discovery, probe, compile, registry, codesign, repair or removal.');
}

export function appendDirectoryToWindowsPathValue(
  existingPathValue: string,
  directory: string,
): { alreadyPresent: boolean; updatedPathValue: string } {
  throw new Error('PRIVATE_INSTALL_POLICY_PENDING: D5 ownership/loading and approved immutable inputs are unresolved; no discovery, probe, compile, registry, codesign, repair or removal.');
}

export interface PowerShellRunResult {
  status: number | null;
  stdout: string;
  stderr: string;
  /** Spawn failure or timeout (spawnSync's `error`), so "exit null" never hides the cause. */
  spawnErrorMessage: string | null;
}

export type PowerShellRunner = (script: string, extraEnvironment: Record<string, string>) => PowerShellRunResult;

export function resolveCompileBunPath(
  bunPath: string,
  platform: NodeJS.Platform,
  runPowerShell: PowerShellRunner,
): string {
  throw new Error('PRIVATE_INSTALL_POLICY_PENDING: D5 ownership/loading and approved immutable inputs are unresolved; no discovery, probe, compile, registry, codesign, repair or removal.');
}

export const WINDOWS_USER_PATH_APPEND_SCRIPT = "throw 'PRIVATE_INSTALL_POLICY_PENDING: registry changes disabled'";

export type WindowsPathSetupOutcome = 'already-on-user-path' | 'user-path-updated' | 'user-path-update-failed';

export function ensureDirectoryOnWindowsUserPath(options: {
  directory: string;
  logger: LauncherInstallLogger;
  host?: LauncherHostEnvironment;
  runPowerShell?: PowerShellRunner;
}): WindowsPathSetupOutcome {
  throw new Error('PRIVATE_INSTALL_POLICY_PENDING: D5 ownership/loading and approved immutable inputs are unresolved; no discovery, probe, compile, registry, codesign, repair or removal.');
}

export type LauncherCompileRunner = (bunPath: string, compileArguments: string[], workingDirectory: string) => {
  status: number | null;
  stderr: string;
};

export type LauncherBunVersionReader = (bunPath: string) => string | null;

export type LauncherCodesignRunner = (binaryPath: string) => {
  status: number | null;
  stderr: string;
};

export function createAdhocCodesigner(
  runCommand: (codesignArguments: readonly string[]) => ReturnType<LauncherCodesignRunner>,
): LauncherCodesignRunner {
  return () => { throw new Error('PRIVATE_INSTALL_POLICY_PENDING: D5 ownership/loading and approved immutable inputs are unresolved; no discovery, probe, compile, registry, codesign, repair or removal.'); };
}

export type LauncherEnsureInvocationContext = 'npx-installer' | 'session-start-self-heal';

export type LauncherEnsureStatus =
  | 'already-current'
  | 'newer-protocol-kept'
  | 'installed'
  | 'bun-not-found'
  | 'foreign-binary-kept';

export interface LauncherEnsureResult {
  status: LauncherEnsureStatus;
  binaryPath: string;
  pathSetupOutcome: ShellPathSetupOutcome | WindowsPathSetupOutcome | null;
}

export function ensureLauncherOnPath(options: {
  pluginRoot: string;
  resolveBunPath: () => string | null;
  logger: LauncherInstallLogger;
  invocationContext: LauncherEnsureInvocationContext;
  host?: LauncherHostEnvironment;
  runCompile?: LauncherCompileRunner;
  readBunVersion?: LauncherBunVersionReader;
  runCodesign?: LauncherCodesignRunner;
  runPowerShell?: PowerShellRunner;
}): LauncherEnsureResult {
  throw new Error('PRIVATE_INSTALL_POLICY_PENDING: D5 ownership/loading and approved immutable inputs are unresolved; no discovery, probe, compile, registry, codesign, repair or removal.');
}

export interface LauncherRemovalResult {
  removedBinaryPath: string | null;
  /** The PATH line uninstall leaves in place, for the user to remove by hand. */
  pathCleanupHint: string | null;
}

export function removeInstalledLauncher(host?: LauncherHostEnvironment): LauncherRemovalResult {
  throw new Error('PRIVATE_INSTALL_POLICY_PENDING: D5 ownership/loading and approved immutable inputs are unresolved; no discovery, probe, compile, registry, codesign, repair or removal.');
}
