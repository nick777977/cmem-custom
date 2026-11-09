import path from 'node:path';
import type { SettingsDefaults } from '../../shared/SettingsDefaultsManager.js';

type LocalChromaConfiguration = Partial<Pick<SettingsDefaults,
  'CLAUDE_MEM_CHROMA_MODE' | 'CLAUDE_MEM_CHROMA_EMBEDDING_FUNCTION' | 'CLAUDE_MEM_CHROMA_EXECUTABLE'>>;

/** Node-side launch description only; this is not a Python API or an approval manifest. */
export interface LocalChromaLaunch {
  command: string;
  args: string[];
  env: Record<string, string>;
}

export class ChromaLocalRuntimeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ChromaLocalRuntimeError';
  }
}

/** Validate even legacy configuration before touching a client, store or executable. */
export function assertLocalChromaConfiguration(settings: LocalChromaConfiguration): void {
  if ((settings.CLAUDE_MEM_CHROMA_MODE || 'local') !== 'local') {
    throw new ChromaLocalRuntimeError('Remote Chroma is forbidden; CLAUDE_MEM_CHROMA_MODE must be local');
  }
  assertLocalEmbeddingFunction(settings.CLAUDE_MEM_CHROMA_EMBEDDING_FUNCTION || 'default');
}

export function assertLocalEmbeddingFunction(name: unknown): void {
  // "default" is only the retained collection name. It does NOT certify that
  // the Python implementation is local/offline; the launch gate below blocks it too.
  if (name !== 'default') {
    throw new ChromaLocalRuntimeError('Remote or unverified Chroma embedding function is forbidden; only default may be considered after artifact verification');
  }
}

export function requireApprovedLocalChromaRuntime(settings: LocalChromaConfiguration): LocalChromaLaunch {
  assertLocalChromaConfiguration(settings);
  const executable = settings.CLAUDE_MEM_CHROMA_EXECUTABLE || '';
  if (!path.isAbsolute(executable) || executable.startsWith('\\\\') || executable.startsWith('//')) {
    throw new ChromaLocalRuntimeError('Set CLAUDE_MEM_CHROMA_EXECUTABLE to an absolute pre-provisioned local executable; PATH, UNC and uvx resolution are forbidden');
  }
  if (/^(?:uvx?|pip\d*|pipx|python\d*(?:\.\d+)*|npm|npx|bun|cmd|powershell|pwsh|sh|bash)(?:\.(?:exe|cmd|bat))?$/i.test(path.basename(executable))) {
    throw new ChromaLocalRuntimeError('Chroma executable must be the reviewed local adapter, not an interpreter, shell or package manager');
  }
  // U1/D9: no approved Python/Chroma/model artifacts or supported offline API
  // were supplied. Do not stat/search caches, run --help, construct guessed
  // Python flags, trust a self-attested config, or repair missing assets.
  // A future reviewed implementation must verify the entire local asset and
  // embedding/telemetry contract before returning a launch description.
  throw new ChromaLocalRuntimeError(
    'LOCAL_CHROMA_ARTIFACT_CONTRACT_UNVERIFIED: Chroma startup blocked. Approved executable/dependency/model hashes and supported offline embedding/telemetry API evidence are required; no install, download, repair or fallback was attempted'
  );
}
