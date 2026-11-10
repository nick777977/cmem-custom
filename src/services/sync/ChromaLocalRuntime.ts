import path from 'node:path';
import { statSync } from 'node:fs';
import { getPackageRoot, paths } from '../../shared/paths.js';
import type { SettingsDefaults } from '../../shared/SettingsDefaultsManager.js';

type LocalChromaConfiguration = Partial<Pick<SettingsDefaults,
  'CLAUDE_MEM_CHROMA_MODE' | 'CLAUDE_MEM_CHROMA_EMBEDDING_FUNCTION' | 'CLAUDE_MEM_CHROMA_RUNTIME_DIR'>>;

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
  // The worker's historical selector maps to the packaged local MiniLM adapter.
  // The adapter never passes "default" to Chroma's embedding-function registry.
  if (name !== 'default') {
    throw new ChromaLocalRuntimeError('Remote or unverified Chroma embedding function is forbidden; use the local default');
  }
}

export function requireApprovedLocalChromaRuntime(settings: LocalChromaConfiguration): LocalChromaLaunch {
  assertLocalChromaConfiguration(settings);
  const runtimeDir = settings.CLAUDE_MEM_CHROMA_RUNTIME_DIR || '';
  if (process.platform !== 'win32' || process.arch !== 'x64') {
    throw new ChromaLocalRuntimeError('LOCAL_CHROMA_SETUP_REQUIRED: this runtime requires Windows x64');
  }
  if (!/^[a-z]:[\\/]/i.test(runtimeDir)) {
    throw new ChromaLocalRuntimeError('LOCAL_CHROMA_SETUP_REQUIRED: set CLAUDE_MEM_CHROMA_RUNTIME_DIR to the absolute local drive path prepared by prepare-local-chroma.ps1');
  }
  const command = path.join(runtimeDir, 'venv', 'Scripts', 'python.exe');
  const modelDir = path.join(runtimeDir, 'model');
  const adapter = path.join(getPackageRoot(), 'scripts', 'chroma-local.py');
  for (const file of [command, path.join(modelDir, 'model.onnx'), path.join(modelDir, 'tokenizer.json'), adapter]) {
    let stat;
    try {
      stat = statSync(file, { throwIfNoEntry: false });
    } catch {
      throw new ChromaLocalRuntimeError(`LOCAL_CHROMA_SETUP_REQUIRED: cannot read local Chroma file ${path.basename(file)}`);
    }
    if (!stat?.isFile() || stat.size === 0) {
      throw new ChromaLocalRuntimeError(`LOCAL_CHROMA_SETUP_REQUIRED: missing or empty local Chroma file ${path.basename(file)}`);
    }
  }
  return {
    command,
    args: ['-I', '-B', adapter, '--model-dir', modelDir, '--data-dir', path.resolve(paths.chroma())],
    env: {
      ANONYMIZED_TELEMETRY: 'False',
      OTEL_SDK_DISABLED: 'true',
      HF_HUB_DISABLE_TELEMETRY: '1',
      HF_HUB_OFFLINE: '1',
    },
  };
}
