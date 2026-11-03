import { existsSync, realpathSync, statSync } from 'node:fs';
import { dirname, isAbsolute, join, resolve } from 'node:path';

export interface LocalLauncherPreflight {
  status: 'blocked';
  code: 'LOCAL_BUNDLE_MISSING' | 'PRIVATE_LAUNCH_POLICY_PENDING';
  message: string;
}

export interface PrivateLauncherPlan {
  exit: number;
  stdout: string;
  stderr: string;
}

/** Static planning seam. CLAUDE_MEM_BUNDLE_ROOT is the exact unpacked plugin
 * directory, not a repo/cache/host ID. Other root variables are ignored.
 */
export function planPrivateLauncher(
  args: string[], entryFile: string | undefined, env: NodeJS.ProcessEnv, protocol: number,
): PrivateLauncherPlan {
  if (args[0] === '--version') return { exit: 0, stdout: `${protocol}\n`, stderr: '' };
  const hook = args[0] === 'hook';
  const optOut = args[2] === 'observation' ? 'CLAUDE_MEM_DISABLE_OBSERVATION'
    : args[2] === 'file-context' ? 'CLAUDE_MEM_DISABLE_FILE_CONTEXT' : undefined;
  if (hook && optOut && (env.CLAUDE_MEM_DISABLE_TOOL_HOOKS === '1' || env[optOut] === '1')) {
    return { exit: 0, stdout: '', stderr: '' };
  }
  const refuse = (code: string, detail: string): PrivateLauncherPlan => ({
    exit: hook ? 0 : 1, stdout: '',
    stderr: `cmem-light: ${code}: ${detail} Memory readiness is not established.\n`,
  });
  const root = env.CLAUDE_MEM_BUNDLE_ROOT;
  if (!root || !isAbsolute(root)) return refuse('LOCAL_BUNDLE_ROOT_REQUIRED', 'Supply an explicit absolute private bundle root; no discovery or repair.');
  if (!entryFile || !isAbsolute(entryFile)) return refuse('LOCAL_BUNDLE_MISSING', 'Absolute executing entry is required.');
  try {
    // Reject root aliases and stale entries before reading sibling contents.
    const physicalRoot = realpathSync(root);
    if (physicalRoot !== resolve(root) || dirname(realpathSync(entryFile)) !== join(physicalRoot, 'scripts')) {
      return refuse('LOCAL_BUNDLE_STALE', 'Executing entry does not belong to the exact supplied bundle.');
    }
  } catch { return refuse('LOCAL_BUNDLE_MISSING', 'Private bundle/entry is missing or unreadable.'); }
  const check = inspectLocalLauncherBundle(entryFile);
  return refuse(check.code, check.message);
}

/** Inspect only the executing bundle's siblings, never host settings/cache/PATH.
 * Presence is not integrity, approved runtime provenance or registration evidence.
 * Until WINDOWS-09B supplies the private resolver/artifact contract every result
 * stays blocked, including present files; no inferred D5 identity or readiness.
 */
export function inspectLocalLauncherBundle(entryFile: string | undefined): LocalLauncherPreflight {
  const missing = (): LocalLauncherPreflight => ({
    status: 'blocked', code: 'LOCAL_BUNDLE_MISSING',
    message: 'Required local launcher/worker bundle is missing or invalid. Supply a reviewed private bundle; no automatic repair.',
  });
  if (!entryFile || !isAbsolute(entryFile)) return missing();
  try {
    const scripts = dirname(realpathSync(entryFile));
    for (const name of ['claude-mem-launcher.cjs', 'worker-service.cjs']) {
      const target = join(scripts, name);
      if (!existsSync(target) || !statSync(target).isFile() || dirname(realpathSync(target)) !== scripts) return missing();
    }
  } catch { return missing(); }
  return {
    status: 'blocked', code: 'PRIVATE_LAUNCH_POLICY_PENDING',
    message: 'Files are present; deterministic private entrypoints/runtime integrity and D5 registration policy remain pending. Memory readiness is not established.',
  };
}
