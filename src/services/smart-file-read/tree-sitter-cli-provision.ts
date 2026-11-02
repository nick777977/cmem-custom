// Compatibility entrypoint for existing installer/worker callers. Acquisition,
// staging, chmod/rename and conda fallback were retired in WINDOWS-09.
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, realpathSync, statSync } from 'node:fs';
import { isAbsolute, join, relative, sep } from 'node:path';
import { treeSitterBinaryName } from './tree-sitter-bin-name.js';
import { pinnedTreeSitterExecutableSha256, type GlibcCompatibleTreeSitterBuild } from './tree-sitter-cli-checksums.js';

export const TREE_SITTER_CLI_CANNOT_RUN = 'cannot run on this system';
export interface TreeSitterCliVersionProbe { usable: boolean; reason?: string }
export type TreeSitterProbeExec = (
  file: string, args: readonly string[],
  options: { encoding: 'utf-8'; timeout: number; windowsHide: boolean },
  callback: (error: NodeJS.ErrnoException | null, stdout: string | Buffer, stderr: string | Buffer) => void,
) => { stdin?: { end(): void } | null } | undefined;

function probeText(value: unknown): string {
  if (value == null) return '';
  return Buffer.isBuffer(value) ? value.toString('utf8') : String(value);
}

/** Only a bounded version probe; callers verify bytes BEFORE invoking it. */
export async function answersTreeSitterVersion(
  executablePath: string,
  execFileImpl: TreeSitterProbeExec = execFile as unknown as TreeSitterProbeExec,
): Promise<TreeSitterCliVersionProbe> {
  return new Promise(resolve => {
    try {
      const child = execFileImpl(executablePath, ['--version'], {
        encoding: 'utf-8', timeout: 10_000, windowsHide: true,
      }, (error, stdout, stderr) => {
        if (!error && /^tree-sitter \d+\.\d+\.\d+(?:\s|$)/.test(probeText(stdout).trim())) {
          resolve({ usable: true });
        } else {
          resolve({ usable: false, reason: probeText(stderr).trim().split('\n')[0] || error?.message.split('\n')[0] || undefined });
        }
      });
      child?.stdin?.end();
    } catch (error) {
      resolve({ usable: false, reason: (error instanceof Error ? error.message : String(error)).split('\n')[0] });
    }
  });
}

export function treeSitterCliBinaryPath(pluginRoot: string): string {
  return join(pluginRoot, 'node_modules', 'tree-sitter-cli', treeSitterBinaryName());
}

/** Historical callback shape retained for source compatibility; never called. */
export interface GlibcCompatibleFallback {
  buildFor: (version: string) => GlibcCompatibleTreeSitterBuild | undefined;
  download: (url: string, timeoutMs: number) => Promise<Buffer>;
}
export type TreeSitterCliBinarySource = 'already-usable';

/** Local static evidence only: no execution, network, PATH search or writes.
 * Repository pins are integrity comparisons, not new provenance approval.
 */
export function verifyLocalTreeSitterCli(
  pluginRoot: string,
  pinnedSha256ForVersion: (version: string) => string | undefined = pinnedTreeSitterExecutableSha256,
): string {
  const refuse = (detail: string): never => {
    throw new Error(`LOCAL_TREE_SITTER_UNAVAILABLE: ${detail}; supply approved bundle-local assets. Runtime installation/repair is disabled.`);
  };
  if (!isAbsolute(pluginRoot)) return refuse('plugin root must be absolute');
  try {
    const root = realpathSync(pluginRoot);
    const cliDir = join(root, 'node_modules', 'tree-sitter-cli');
    const binary = treeSitterCliBinaryPath(root);
    // Reject links escaping the exact bundle. Do not inspect their targets.
    for (const file of [join(cliDir, 'package.json'), binary]) {
      const delta = relative(root, realpathSync(file));
      if (isAbsolute(delta) || delta === '..' || delta.startsWith(`..${sep}`)) return refuse('asset escapes bundle');
      if (!statSync(file).isFile()) return refuse('asset is not a regular file');
    }
    const version = JSON.parse(readFileSync(join(cliDir, 'package.json'), 'utf8')).version;
    if (typeof version !== 'string') return refuse('invalid package version');
    const expected = pinnedSha256ForVersion(version);
    if (!expected || !/^[a-f0-9]{64}$/i.test(expected)) return refuse('no pinned executable for version/platform');
    const actual = createHash('sha256').update(readFileSync(binary)).digest('hex');
    if (actual !== expected.toLowerCase()) return refuse('executable hash mismatch');
    return binary;
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('LOCAL_TREE_SITTER_UNAVAILABLE:')) throw error;
    return refuse('missing, unreadable or invalid local artifact');
  }
}

export async function isTreeSitterCliBinaryUsable(pluginRoot: string): Promise<boolean> {
  try { return (await answersTreeSitterVersion(verifyLocalTreeSitterCli(pluginRoot))).usable; }
  catch { return false; }
}

/** Kept for existing callers, but now check-only. Missing/stale bytes never run. */
export async function ensureTreeSitterCliBinary(
  pluginRoot: string,
  _installTimeoutMs: number,
  pinnedSha256ForVersion: (version: string) => string | undefined = pinnedTreeSitterExecutableSha256,
  _glibcFallback?: GlibcCompatibleFallback,
): Promise<TreeSitterCliBinarySource> {
  const binary = verifyLocalTreeSitterCli(pluginRoot, pinnedSha256ForVersion);
  const probe = await answersTreeSitterVersion(binary);
  if (!probe.usable) throw new Error(`LOCAL_TREE_SITTER_UNAVAILABLE: verified executable ${TREE_SITTER_CLI_CANNOT_RUN}; runtime repair is disabled.`);
  return 'already-usable';
}
