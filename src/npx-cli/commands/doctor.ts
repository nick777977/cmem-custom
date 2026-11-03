/**
 * `npx claude-mem doctor` — a minimal diagnostic that probes every layer an
 * operator would otherwise check by hand (#2548). Read-only: it never mutates
 * state. Exits 0 when all REQUIRED checks pass, 1 otherwise, so it is CI/script
 * friendly.
 */

import { existsSync, readFileSync, readdirSync, realpathSync, statSync } from 'fs';
import { isAbsolute, join, posix as posixPath, win32 as windowsPath } from 'path';
import { styleText } from 'node:util';
import { IS_WINDOWS, marketplaceDirectory, readPluginVersion } from '../utils/paths.js';
import { formatHostForUrl, getWorkerHost, getWorkerPort, resolvePluginRoot, type PluginRootResolution } from '../../shared/worker-utils.js';
import { getBunVersion, getUvVersion, isInstallCurrent } from '../install/setup-runtime.js';
import { treeSitterCliBinaryPath } from '../../services/smart-file-read/tree-sitter-cli-provision.js';
import { checkTreeSitterCliLoadable, TREE_SITTER_CLI_PATH_WORKAROUND } from '../../services/smart-file-read/tree-sitter-bin-path.js';
import { resolveDataDir } from '../../shared/paths.js';
import { paths } from '../../shared/paths.js';
import { findOrphanedChromaRoots, readProcessTablePosix } from '../../supervisor/orphan-chroma-sweep.js';
import { isPidAlive } from '../../supervisor/process-registry.js';
import { USER_SETTINGS_PATH } from '../../shared/paths.js';
import { SettingsDefaultsManager } from '../../shared/SettingsDefaultsManager.js';
import { SNAPSHOT_FILE_PATTERN } from '../../services/backup/snapshot-files.js';
import { checkWindowsGitBash } from '../utils/windows-git-bash-preflight.js';
import {
  claudeCodeVersionTooOldWarning,
  detectClaudeCodeVersion,
  MINIMUM_CLAUDE_CODE_VERSION_FOR_EXEC_FORM_HOOKS,
} from '../install/claude-code-version.js';
import {
  currentLauncherHostEnvironment,
  findExecutableOnPath,
  probeLauncherVersion,
  resolveLauncherBinaryPath,
  type LauncherHostEnvironment,
} from '../../launcher/install-launcher.js';
import { LAUNCHER_PROTOCOL } from '../../launcher/launcher-protocol.js';

type CheckStatus = 'ok' | 'warn' | 'fail';

export interface CheckResult {
  name: string;
  status: CheckStatus;
  detail: string;
  /** When false, a 'fail' does not affect the overall exit code. */
  required: boolean;
}

/** The worker's `health.chroma` block from /api/admin/doctor. */
interface ChromaCrashState {
  count: number;
  lastExit: {
    timestamp: string;
    code: number | null;
    signal: string | null;
  } | null;
  chromaMcpVersion: string;
  dependencyOverrides: string[];
  /** uvx prewarm circuit breaker (#4108); absent from older workers. */
  prewarm?: {
    consecutiveFailures: number;
    state: 'ok' | 'paused' | 'stopped';
  };
  /** A collection dropped as corrupt and rebuilt from SQLite (#3202); absent from older workers. */
  collectionDrop?: {
    collection: string;
    droppedAt: string;
    documentCount: number | null;
    error: string;
  } | null;
}

function probeVersion(bin: 'bun' | 'uv'): string | null {
  try {
    return bin === 'bun' ? getBunVersion() : getUvVersion();
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.warn(`[doctor] Failed to probe \`${bin} --version\`:`, err);
    return null;
  }
}

async function probeWorkerHealth(workerHost: string, workerPort: string): Promise<{
  status: CheckStatus;
  detail: string;
  workerUrl: string;
}> {
  const workerUrl = `http://${formatHostForUrl(workerHost)}:${workerPort}`;
  const res = await fetch(`${workerUrl}/api/health`, {
    signal: AbortSignal.timeout(3000),
  });
  if (res.ok) {
    return { status: 'ok', detail: `healthy at ${workerUrl}`, workerUrl };
  }
  return { status: 'warn', detail: `reachable but unhealthy (HTTP ${res.status}) at ${workerUrl}`, workerUrl };
}

function isChromaCrashState(value: unknown): value is ChromaCrashState {
  if (!value || typeof value !== 'object') return false;
  const state = value as Partial<ChromaCrashState>;
  return typeof state.count === 'number' && Number.isInteger(state.count) && state.count >= 0 && Array.isArray(state.dependencyOverrides)
    && typeof state.chromaMcpVersion === 'string'
    && (state.lastExit === null || (typeof state.lastExit === 'object' && state.lastExit !== null
      && typeof state.lastExit.timestamp === 'string'
      && (typeof state.lastExit.code === 'number' || state.lastExit.code === null)
      && (typeof state.lastExit.signal === 'string' || state.lastExit.signal === null)))
    && (state.prewarm === undefined || (typeof state.prewarm === 'object' && state.prewarm !== null
      && typeof state.prewarm.consecutiveFailures === 'number'
      && ['ok', 'paused', 'stopped'].includes(state.prewarm.state)))
    && (state.collectionDrop === undefined || state.collectionDrop === null
      || (typeof state.collectionDrop === 'object'
        && typeof state.collectionDrop.collection === 'string'
        && typeof state.collectionDrop.droppedAt === 'string'
        && (typeof state.collectionDrop.documentCount === 'number' || state.collectionDrop.documentCount === null)));
}

/**
 * The direct child is uvx, not python, so a crash in chroma-mcp (e.g. a
 * SIGSEGV in the engine) usually reaches the worker as uvx's exit code; a
 * signal only shows when uvx itself was killed.
 */
function describeChromaExit(lastExit: NonNullable<ChromaCrashState['lastExit']>): string {
  return lastExit.signal ? `signal ${lastExit.signal}` : `exit code ${lastExit.code ?? 'unknown'}`;
}

/**
 * Warn rows from the worker's /api/admin/doctor `health.chroma` block. These
 * are optional: any failure yields no rows and never changes the worker's
 * own status.
 */
export async function probeChromaDiagnostics(workerUrl: string): Promise<CheckResult[]> {
  try {
    const response = await fetch(`${workerUrl}/api/admin/doctor`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!response.ok) {
      return [];
    }
    const diagnostics = await response.json() as { health?: { chroma?: unknown } };
    const chroma = diagnostics?.health?.chroma;
    return isChromaCrashState(chroma) ? chromaDiagnosticChecks(chroma) : [];
  } catch {
    // Diagnostics are optional and must not change worker health status.
    return [];
  }
}

/** Warn rows for the worker's Chroma child exits and prewarm breaker, if any. */
function chromaDiagnosticChecks(chroma: ChromaCrashState): CheckResult[] {
  const checks: CheckResult[] = [];
  if (chroma.count > 0 && chroma.lastExit) {
    checks.push({
      name: 'Chroma child exits',
      status: 'warn',
      detail: `${chroma.count} unexpected exit(s) since the worker started, last by ${describeChromaExit(chroma.lastExit)} at ${chroma.lastExit.timestamp}; chroma-mcp ${chroma.chromaMcpVersion}; overrides: ${chroma.dependencyOverrides.join(', ')}`,
      required: false,
    });
  }
  if (chroma.prewarm && chroma.prewarm.state !== 'ok') {
    checks.push({
      name: 'Chroma prewarm',
      status: 'warn',
      detail: chroma.prewarm.state === 'stopped'
        ? `stopped after ${chroma.prewarm.consecutiveFailures} consecutive uvx failures — fix uv or free disk space, then run \`npx claude-mem restart\``
        : `paused after ${chroma.prewarm.consecutiveFailures} consecutive uvx failures; retrying with a growing cooldown`,
      required: false,
    });
  }
  if (chroma.collectionDrop) {
    const drop = chroma.collectionDrop;
    checks.push({
      name: 'Chroma collection',
      status: 'warn',
      detail: `${drop.collection} had a corrupt HNSW segment and was dropped at ${drop.droppedAt} (${drop.documentCount ?? 'unknown'} documents); it is being rebuilt from SQLite, so semantic search results are incomplete until that finishes`,
      required: false,
    });
  }
  return checks;
}

async function probeChromaCensus(): Promise<CheckResult> {
  const name = 'Chroma processes';
  if (IS_WINDOWS) {
    return { name, status: 'ok', detail: 'not checked on Windows', required: false };
  }
  let registered = 0;
  try {
    const registryPath = paths.supervisorRegistry();
    if (existsSync(registryPath)) {
      const raw = JSON.parse(readFileSync(registryPath, 'utf-8')) as { processes?: Record<string, { type?: string }> };
      registered = Object.values(raw.processes ?? {}).filter((p) => p.type === 'chroma').length;
    }
  } catch {
    // unreadable registry: report from the process table alone
  }
  try {
    const rows = await readProcessTablePosix();
    const { roots, orphans } = findOrphanedChromaRoots(rows, { isAlive: isPidAlive, selfPid: process.pid });
    const detail = `${roots.length} live chroma-mcp tree(s), ${registered} registered, ${orphans.length} orphaned`;
    if (orphans.length > 0) {
      return {
        name,
        status: 'warn',
        detail: `${detail} — orphans are reaped at the next worker start (claude-mem worker restart)`,
        required: false,
      };
    }
    return { name, status: 'ok', detail, required: false };
  } catch (error) {
    return {
      name,
      status: 'warn',
      detail: `could not read the process table: ${error instanceof Error ? error.message : String(error)}`,
      required: false,
    };
  }
}

const MISSING_DEPENDENCIES_SHOWN = 5;

/** The "Plugin installed" row: root, version and dependency completeness. Exported for tests. */
export function pluginRootCheck(resolution: PluginRootResolution | null): CheckResult {
  const name = 'Plugin installed';
  if (!resolution) {
    return { name, status: 'fail', detail: 'run `npx claude-mem install`', required: true };
  }
  const where = resolution.version ? `${resolution.root} (v${resolution.version})` : resolution.root;
  const missing = resolution.missingDependencies;
  if (missing.length === 0) {
    return { name, status: 'ok', detail: where, required: true };
  }
  const shown = missing.slice(0, MISSING_DEPENDENCIES_SHOWN).join(', ');
  const more = missing.length > MISSING_DEPENDENCIES_SHOWN ? `, +${missing.length - MISSING_DEPENDENCIES_SHOWN} more` : '';
  return {
    name,
    status: 'fail',
    detail: `${where} — missing ${shown}${more} — run \`npx claude-mem repair\``,
    required: true,
  };
}

/**
 * The "tree-sitter CLI" row for the plugin root the worker runs from. It
 * checks only the selected bundle's verified executable. Legacy PATH input is
 * ignored; missing/stale/unselected bytes produce a diagnostic, never repair.
 */
export async function treeSitterCliCheck(pluginRoot: string, searchPath: string = process.env.PATH ?? ''): Promise<CheckResult> {
  const name = 'tree-sitter CLI';
  const packageLocalBinPath = treeSitterCliBinaryPath(pluginRoot);
  const check = checkTreeSitterCliLoadable(packageLocalBinPath, searchPath);
  if (check.loadable) {
    return {
      name,
      status: 'ok',
      detail: packageLocalBinPath,
      required: false,
    };
  }
  const problem = check.reason ?? 'LOCAL_TREE_SITTER_UNAVAILABLE';
  return {
    name,
    status: 'warn',
    detail: `${problem}; ${TREE_SITTER_CLI_PATH_WORKAROUND}`,
    required: false,
  };
}

/** The "Marketplace manifest" row. Exported for tests. */
export function marketplaceManifestCheck(marketplaceDir: string): CheckResult {
  const manifestPath = join(marketplaceDir, '.claude-plugin', 'marketplace.json');
  return existsSync(manifestPath)
    ? { name: 'Marketplace manifest', status: 'ok', detail: manifestPath, required: false }
    : {
        name: 'Marketplace manifest',
        status: 'warn',
        detail: 'missing — Claude Code may not find the plugin; run `npx claude-mem install`',
        required: false,
      };
}

/**
 * PATH minus the directories whose `claude-mem` resolves to the running CLI, when that CLI is npx's temporary copy
 * (`<cache>/_npx/<hash>/node_modules`). No persistent PATH points into npx's cache, so hooks never reach it. A global
 * or local install of the CLI stays: hooks do reach it, and it is not the launcher.
 */
function pathWithoutRunningCli(pathValue: string, platform: NodeJS.Platform, runningCliPath: string | undefined): string {
  const platformPath = platform === 'win32' ? windowsPath : posixPath;
  const runningCli = runningCliPath ? realPathOrNull(runningCliPath) : null;
  if (!runningCli || !runningCli.includes(`${platformPath.sep}_npx${platformPath.sep}`)) return pathValue;
  return pathValue
    .split(platformPath.delimiter)
    .filter(directory => !directoryRunsCli(directory.trim(), platform, runningCli))
    .join(platformPath.delimiter);
}

/**
 * True when `claude-mem` in `directory` is the running CLI. On POSIX, npx's `node_modules/.bin/claude-mem` is a
 * symlink to it. On Windows, npm writes `claude-mem.cmd` / `claude-mem.ps1` wrappers instead, whose script path
 * points at that same file.
 */
function directoryRunsCli(directory: string, platform: NodeJS.Platform, runningCli: string): boolean {
  if (!directory) return false;
  if (platform !== 'win32') return realPathOrNull(join(directory, 'claude-mem')) === runningCli;
  return ['claude-mem.cmd', 'claude-mem.ps1'].some((shimFileName) => {
    const shimPath = windowsPath.join(directory, shimFileName);
    let shimText: string;
    try {
      shimText = readFileSync(shimPath, 'utf-8');
    } catch {
      return false;
    }
    return windowsShimScriptPaths(shimPath, shimText).some((scriptPath) => realPathOrNull(scriptPath) === runningCli);
  });
}

/**
 * Script paths a Windows npm cmd-shim (`.cmd` / `.ps1`) launches, resolved
 * against the shim's directory. npm's wrapper and `process.argv[1]` are
 * different files: the wrapper is `claude-mem.cmd`, and argv is
 * `dist/npx-cli/index.js`. Exported for tests.
 */
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

function realPathOrNull(path: string): string | null {
  try {
    return realpathSync(path);
  } catch {
    return null;
  }
}

/**
 * The "Hook launcher" row: where `claude-mem` resolves on PATH, the protocol it
 * prints, and one timed `--version` round trip. Hooks call `claude-mem` in exec
 * form, so a missing launcher surfaces in Claude Code as
 * `Executable not found in $PATH: "claude-mem"` on every hook. Required: a
 * missing launcher, or a `claude-mem` on PATH that is not the launcher, fails
 * doctor. An older protocol only warns, because the SessionStart self-heal
 * (ensure-launcher.cjs) replaces it on the next startup. Exported for tests.
 *
 * `npx claude-mem doctor` runs with npx's own `node_modules/.bin` first on PATH, where `claude-mem` is this CLI.
 * Hooks run outside npx, so when this CLI (`runningCliPath`) is npx's copy, PATH directories that resolve to it
 * are skipped.
 */
export function hookLauncherCheck(
  host: LauncherHostEnvironment = currentLauncherHostEnvironment(),
  runningCliPath: string | undefined = process.argv[1],
): CheckResult {
  const name = 'Hook launcher';
  const reinstallHint = 'run `npx claude-mem install`';
  const searchPath = pathWithoutRunningCli(host.environmentVariables.PATH ?? '', host.platform, runningCliPath);
  const launcherOnPath = findExecutableOnPath('claude-mem', searchPath, host.platform);
  if (!launcherOnPath) {
    const placedBinaryPath = resolveLauncherBinaryPath(host);
    return {
      name,
      status: 'fail',
      detail: existsSync(placedBinaryPath)
        ? `installed at ${placedBinaryPath} but its directory is not on PATH — open a new terminal, or ${reinstallHint}`
        : `claude-mem not on PATH — hooks fail with 'Executable not found in $PATH: "claude-mem"'; ${reinstallHint}`,
      required: true,
    };
  }
  const probeStartedAt = performance.now();
  const { protocol: printedProtocol, failure: probeFailure } = probeLauncherVersion(launcherOnPath);
  const roundTripMilliseconds = Math.round(performance.now() - probeStartedAt);
  if (printedProtocol === null) {
    return {
      name,
      status: 'fail',
      detail: `${launcherOnPath} did not report a launcher protocol (--version ${probeFailure}); ${reinstallHint}`,
      required: true,
    };
  }
  if (printedProtocol !== LAUNCHER_PROTOCOL) {
    return {
      name,
      status: 'warn',
      detail: `${launcherOnPath} speaks protocol ${printedProtocol}, expected ${LAUNCHER_PROTOCOL}; ${reinstallHint}`,
      required: true,
    };
  }
  return {
    name,
    status: 'ok',
    detail: `${launcherOnPath} (protocol ${printedProtocol}, --version ${roundTripMilliseconds} ms)`,
    required: true,
  };
}

/**
 * The "Claude Code version" row. Warns below the exec-form minimum, because an
 * older Claude Code ignores the hooks' `args` and runs bare `claude-mem`,
 * which captures nothing. Not required: a missing or unparseable version
 * passes silently. Exported for tests.
 */
export function claudeCodeVersionCheck(detectedClaudeCodeVersion: string | undefined): CheckResult {
  const name = 'Claude Code version';
  const tooOldWarning = claudeCodeVersionTooOldWarning(detectedClaudeCodeVersion);
  if (tooOldWarning) return { name, status: 'warn', detail: tooOldWarning, required: false };
  return {
    name,
    status: 'ok',
    detail: detectedClaudeCodeVersion
      ? `${detectedClaudeCodeVersion} (hooks need ${MINIMUM_CLAUDE_CODE_VERSION_FOR_EXEC_FORM_HOOKS}+)`
      : 'not detected (claude not on PATH)',
    required: false,
  };
}

export async function runDoctorCommand(): Promise<void> {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: private CLI runtime/diagnostics require approved explicit inputs; no host discovery, connection, spawn or repair.');
}
