import { ensureTreeSitterCliBinary, type GlibcCompatibleFallback } from '../smart-file-read/tree-sitter-cli-provision.js';
import { pinnedTreeSitterExecutableSha256 } from '../smart-file-read/tree-sitter-cli-checksums.js';

export type TreeSitterCliProvisioningOutcome = 'already-usable';

/** Compatibility name: verifies existing bundle-local bytes, never provisions. */
export async function provisionTreeSitterCliForPluginRoot(
  pluginRoot: string,
  pinnedSha256ForVersion: (version: string) => string | undefined = pinnedTreeSitterExecutableSha256,
  glibcFallback?: GlibcCompatibleFallback,
): Promise<TreeSitterCliProvisioningOutcome> {
  return ensureTreeSitterCliBinary(pluginRoot, 10_000, pinnedSha256ForVersion, glibcFallback);
}
