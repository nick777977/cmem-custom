// Private tree-sitter resolution. No module/PATH/cwd/cache fallback.
// Hash verification precedes every use; version probes remain bounded. Repository
// pins establish byte identity, not artifact provenance or memory readiness.
import { execFileSync } from 'node:child_process';
import { accessSync, constants, statSync } from 'node:fs';
import { isAbsolute } from 'node:path';
import { verifyLocalTreeSitterCli } from './tree-sitter-cli-provision.js';

export function resolveTreeSitterBinPath(platform: NodeJS.Platform = process.platform): string {
  if (platform !== process.platform) throw new Error('LOCAL_TREE_SITTER_UNAVAILABLE: platform mismatch');
  return verifyLocalTreeSitterCli(process.env.CLAUDE_MEM_BUNDLE_ROOT ?? '');
}

// Compatibility signatures; legacy PATH inputs are deliberately never used.
export function resolveTreeSitterBinPathFor(packageLocalBinPath: string, _searchPath: string): string {
  const verified = resolveTreeSitterBinPath();
  if (!isAbsolute(packageLocalBinPath) || verified !== packageLocalBinPath) {
    throw new Error('LOCAL_TREE_SITTER_UNAVAILABLE: path is outside the selected bundle');
  }
  return verified;
}
export function pickTreeSitterBinPath(packageLocalBinPath: string, _binName: string, searchPath: string): string {
  return resolveTreeSitterBinPathFor(packageLocalBinPath, searchPath);
}
export function isTreeSitterCliAvailable(resolvedBinPath?: string, _searchPath = ''): boolean {
  try { return resolvedBinPath === undefined ? Boolean(resolveTreeSitterBinPath()) : resolveTreeSitterBinPathFor(resolvedBinPath, '') === resolvedBinPath; }
  catch { return false; }
}
export const TREE_SITTER_CLI_PATH_WORKAROUND = 'supply approved bundle-local tree-sitter assets; automatic repair is disabled';

const TREE_SITTER_LOAD_PROBE_TIMEOUT_MS = 2_000;
const TREE_SITTER_VERSION_OUTPUT = /^tree-sitter (\d+)\.(\d+)\.(\d+)(?:\s|$)/;

export interface TreeSitterCliLoadCheck {
  /** A tree-sitter CLI binary file was found (it may still not run). */
  present: boolean;
  /** The binary executed and answered `--version` as a compatible tree-sitter. */
  loadable: boolean;
  /** Why the binary is absent or not loadable; undefined when loadable. */
  reason?: string;
}

interface CachedLoadCheck {
  mtimeMs: number;
  mode: number;
  check: TreeSitterCliLoadCheck;
}

// The --version probe spawns a process, so it runs at most once per binary
// state: results are cached per process keyed by resolved path + mtime + mode.
// A worker provisioning a replacement (new mtime) or a `chmod +x` repairing
// permissions (new mode) is re-probed, while the hot path pays one statSync +
// Map lookup. Note the cache is per process: each PreToolUse hook invocation
// is a fresh process, so a qualifying Read pays one ~millisecond spawn; the
// 2s probe timeout above bounds the worst case of a stalled binary.
const loadCheckCache = new Map<string, CachedLoadCheck>();

/**
 * True when the OS would execute this file. On Windows there is no POSIX exec
 * bit, so existence decides and CreateProcess reports the real failure.
 */
export function isExecutableFile(filePath: string): boolean {
  if (process.platform === 'win32') return true;
  try {
    accessSync(filePath, constants.X_OK);
    return true;
  } catch {
    return false;
  }
}

function firstStderrLine(error: unknown): string {
  const stderr = (error as { stderr?: unknown } | null)?.stderr;
  const text = typeof stderr === "string" ? stderr
    : stderr instanceof Buffer ? stderr.toString("utf-8")
    : "";
  return text.trim().split("\n")[0] ?? "";
}

function probeTreeSitterCliLoadable(absoluteBinPath: string): TreeSitterCliLoadCheck {
  try {
    const stdout = execFileSync(absoluteBinPath, ["--version"], {
      encoding: "utf-8",
      timeout: TREE_SITTER_LOAD_PROBE_TIMEOUT_MS,
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
    });
    const version = TREE_SITTER_VERSION_OUTPUT.exec(stdout.trim());
    if (version) {
      // parser.ts uses query --grammar-path / --lib-path / --lang-name,
      // which first appeared in tree-sitter 0.26.0.
      if (Number(version[1]) === 0 && Number(version[2]) < 26) {
        return {
          present: true,
          loadable: false,
          reason: `tree-sitter CLI at ${absoluteBinPath} is ${version[1]}.${version[2]}.${version[3]}; smart parsing requires tree-sitter >= 0.26.0`,
        };
      }
      return { present: true, loadable: true };
    }
    return {
      present: true,
      loadable: false,
      reason: `tree-sitter CLI at ${absoluteBinPath} ran but did not answer --version as tree-sitter`,
    };
  } catch (error) {
    const detail = firstStderrLine(error)
      || (error instanceof Error ? error.message.split("\n")[0] : String(error));
    return {
      present: true,
      loadable: false,
      reason: `tree-sitter CLI at ${absoluteBinPath} could not be executed`
        + (detail ? `: ${detail}` : ""),
    };
  }
}

/** Never probe an unverified path, even when a legacy caller supplies PATH. */
export function checkTreeSitterCliLoadable(resolvedBinPath?: string, _searchPath = ''): TreeSitterCliLoadCheck {
  try {
    const verified = resolvedBinPath === undefined ? resolveTreeSitterBinPath() : resolveTreeSitterBinPathFor(resolvedBinPath, '');
    return loadCheckFor(verified);
  } catch {
    return { present: false, loadable: false, reason: 'LOCAL_TREE_SITTER_UNAVAILABLE: missing, stale or unapproved bundle-local executable; no PATH/module fallback or repair' };
  }
}

function loadCheckFor(absoluteBinPath: string): TreeSitterCliLoadCheck {
  let stats: { mtimeMs: number; mode: number };
  try {
    const s = statSync(absoluteBinPath);
    stats = { mtimeMs: s.mtimeMs, mode: s.mode };
  } catch {
    return {
      present: false,
      loadable: false,
      reason: `tree-sitter CLI not found at ${absoluteBinPath}`,
    };
  }
  const cached = loadCheckCache.get(absoluteBinPath);
  if (cached && cached.mtimeMs === stats.mtimeMs && cached.mode === stats.mode) return cached.check;
  const check = probeTreeSitterCliLoadable(absoluteBinPath);
  loadCheckCache.set(absoluteBinPath, { mtimeMs: stats.mtimeMs, mode: stats.mode, check });
  return check;
}


export function treeSitterCliUnavailableMessage(check: TreeSitterCliLoadCheck = checkTreeSitterCliLoadable()): string | null {
  if (check.loadable) return null;
  return check.reason ?? 'LOCAL_TREE_SITTER_UNAVAILABLE: supply approved bundle-local assets; automatic repair is disabled';
}
