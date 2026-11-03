import { spawnHidden } from '../../shared/spawn.js';
import { sanitizeEnv } from '../../supervisor/env-sanitizer.js';
import { existsSync } from 'fs';
import { join } from 'path';
import { styleText } from 'node:util';
import { ensureServerEmbedder, getBunPath, hasServerEmbedder } from '../install/setup-runtime.js';
import { npmPackageRootDirectory } from '../utils/paths.js';
import { SettingsDefaultsManager } from '../../shared/SettingsDefaultsManager.js';
import { resolvePluginRoot, buildWorkerUrl } from '../../shared/worker-utils.js';
import { isConnectionRefusedError } from '../../shared/connection-errors.js';

/**
 * The plugin root the worker spawns from — the shared resolveWorkerScript()
 * oracle (cache, marketplace, or dev checkout) — or exit(1) when none exists.
 * A cache-only install the hooks run from is therefore not "not installed".
 */
function pluginRootOrExit(): string {
  const resolved = resolvePluginRoot();
  if (!resolved) {
    console.error(styleText('red', 'claude-mem is not installed.'));
    console.error(`Run: ${styleText('bold', 'npx claude-mem install')}`);
    process.exit(1);
  }
  return resolved.root;
}

function resolveBunOrExit(): string {
  const bunPath = getBunPath();
  if (!bunPath) {
    console.error(styleText('red', 'Bun not found.'));
    console.error('Install Bun: https://bun.sh');
    console.error('After installation, restart your terminal.');
    process.exit(1);
  }
  return bunPath;
}

function workerServiceScriptPath(pluginRoot: string): string {
  return join(pluginRoot, 'scripts', 'worker-service.cjs');
}

function serverServiceScriptPath(pluginRoot: string): string {
  // Plan §1c line 149: prefer the renamed `server-service.cjs`, but fall
  // back to the legacy `server-beta-service.cjs` for installed plugin
  // caches that pre-date the rename (forced reinstall not required).
  const scriptsDir = join(pluginRoot, 'scripts');
  const renamed = join(scriptsDir, 'server-service.cjs');
  if (existsSync(renamed)) {
    return renamed;
  }
  return join(scriptsDir, 'server-beta-service.cjs');
}

function packagePluginScriptPath(scriptName: string): string {
  return join(npmPackageRootDirectory(), 'plugin', 'scripts', scriptName);
}

/**
 * Spawn a plugin .cjs script under Bun with inherited stdio, exiting this
 * process with the child's exit code. `args[0]` is the script path. Sanitizes
 * host CLI bleed-through and Anthropic credentials before launch; credentials
 * are re-read from ~/.claude-mem/.env at SDK spawn time (#2357 / #2375).
 */
function spawnPlugin(bunPath: string, args: string[], cwd: string, startFailureLabel = 'Bun'): void {
  const child = spawnHidden(bunPath, args, {
    stdio: 'inherit',
    cwd,
    env: sanitizeEnv(process.env),
  });

  child.on('error', (error) => {
    console.error(styleText('red', `Failed to start ${startFailureLabel}: ${error.message}`));
    process.exit(1);
  });

  child.on('close', (exitCode) => {
    process.exit(exitCode ?? 0);
  });
}

function spawnBunWorkerCommand(command: string, extraArgs: string[] = []): void {
  const pluginRoot = pluginRootOrExit();
  const bunPath = resolveBunOrExit();
  const workerScript = workerServiceScriptPath(pluginRoot);

  if (!existsSync(workerScript)) {
    console.error(styleText('red', `Worker script not found at: ${workerScript}`));
    console.error('The installation may be corrupted. Try: npx claude-mem install');
    process.exit(1);
  }

  spawnPlugin(bunPath, [workerScript, command, ...extraArgs], pluginRoot);
}

function spawnBunServerCommand(command: string, extraArgs: string[] = []): void {
  const pluginRoot = pluginRootOrExit();
  const bunPath = resolveBunOrExit();
  const serverScript = serverServiceScriptPath(pluginRoot);

  if (!existsSync(serverScript)) {
    console.error(styleText('red', `Server script not found at: ${serverScript}`));
    console.error('The installation may be corrupted. Try: npx claude-mem install');
    process.exit(1);
  }

  spawnPlugin(bunPath, [serverScript, command, ...extraArgs], pluginRoot);
}

/**
 * Whether the server may search by meaning: CLAUDE_MEM_SERVER_VECTOR_SEARCH is
 * anything but 'false', read as the server reads it (vectorSearchMode).
 */
export function serverVectorSearchAllowed(): boolean {
  return SettingsDefaultsManager.get('CLAUDE_MEM_SERVER_VECTOR_SEARCH').toLowerCase() !== 'false';
}

/**
 * Start a server process, first installing the embedder the plugin install
 * leaves out (installPluginDependencies). Without it the server still runs,
 * searching by keyword only.
 */
async function spawnBunServerWithEmbedder(command: string, extraArgs: string[] = []): Promise<void> {
  const pluginRoot = pluginRootOrExit();
  const bunPath = resolveBunOrExit();
  // With search by meaning off, the server never loads the embedder, so the
  // install is skipped; the spawned server reads the same environment.
  if (!serverVectorSearchAllowed()) {
    spawnBunServerCommand(command, extraArgs);
    return;
  }
  try {
    if (!hasServerEmbedder(pluginRoot)) {
      console.error('Installing the embedder for search by meaning (about 300 MB, once)...');
    }
    await ensureServerEmbedder(pluginRoot, bunPath);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(styleText('yellow', `Could not install the embedder; the server will search by keyword only.\n${message}`));
  }
  spawnBunServerCommand(command, extraArgs);
}

export function runServerStartCommand(): void {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: private CLI runtime/diagnostics require approved explicit inputs; no host discovery, connection, spawn or repair.');
}

export function runServerStopCommand(): void {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: private CLI runtime/diagnostics require approved explicit inputs; no host discovery, connection, spawn or repair.');
}

export function runServerRestartCommand(): void {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: private CLI runtime/diagnostics require approved explicit inputs; no host discovery, connection, spawn or repair.');
}

export function runServerStatusCommand(): void {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: private CLI runtime/diagnostics require approved explicit inputs; no host discovery, connection, spawn or repair.');
}

// Phase 10 — start the BullMQ generation worker (no HTTP). Use this in
// Compose to scale generation horizontally while a single (or multiple)
// HTTP-only server replicas serve writes/reads.
export function runServerWorkerStartCommand(): void {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: private CLI runtime/diagnostics require approved explicit inputs; no host discovery, connection, spawn or repair.');
}

export function runStartCommand(): void {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: private CLI runtime/diagnostics require approved explicit inputs; no host discovery, connection, spawn or repair.');
}

export function runStopCommand(): void {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: private CLI runtime/diagnostics require approved explicit inputs; no host discovery, connection, spawn or repair.');
}

export function runRestartCommand(): void {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: private CLI runtime/diagnostics require approved explicit inputs; no host discovery, connection, spawn or repair.');
}

export function runStatusCommand(): void {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: private CLI runtime/diagnostics require approved explicit inputs; no host discovery, connection, spawn or repair.');
}

export function runServerApiKeyCommand(extraArgs: string[] = []): void {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: private CLI runtime/diagnostics require approved explicit inputs; no host discovery, connection, spawn or repair.');
}

export function runAdoptCommand(extraArgs: string[] = []): void {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: private CLI runtime/diagnostics require approved explicit inputs; no host discovery, connection, spawn or repair.');
}

export function runProjectCommand(extraArgs: string[] = []): void {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: private CLI runtime/diagnostics require approved explicit inputs; no host discovery, connection, spawn or repair.');
}

export function runCleanupCommand(extraArgs: string[] = []): void {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: private CLI runtime/diagnostics require approved explicit inputs; no host discovery, connection, spawn or repair.');
}

export function runMcpCommand(): void {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: private CLI runtime/diagnostics require approved explicit inputs; no host discovery, connection, spawn or repair.');
}

export function runHookCommand(extraArgs: string[] = []): void {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: private CLI runtime/diagnostics require approved explicit inputs; no host discovery, connection, spawn or repair.');
}

export async function runSearchCommand(queryParts: string[]): Promise<void> {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: private CLI runtime/diagnostics require approved explicit inputs; no host discovery, connection, spawn or repair.');
}

export function runTranscriptWatchCommand(): void {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: private CLI runtime/diagnostics require approved explicit inputs; no host discovery, connection, spawn or repair.');
}

// The worker script runs from the plugin root, so the directory the user ran
// this in travels as --cwd, as it does for adopt. Another checkout is chosen
// with --source, which resolves against this directory.
export function runMemoryIngestCommand(extraArgs: string[] = []): void {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: private CLI runtime/diagnostics require approved explicit inputs; no host discovery, connection, spawn or repair.');
}
