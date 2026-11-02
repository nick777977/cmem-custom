import { existsSync, realpathSync, statSync } from 'node:fs';
import { dirname, isAbsolute, join } from 'node:path';

export interface LocalLauncherPreflight {
  status: 'blocked';
  code: 'LOCAL_BUNDLE_MISSING' | 'PRIVATE_LAUNCH_POLICY_PENDING';
  message: string;
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
