import { findClaudeExecutable as defaultFindClaudeExecutable } from '../../shared/find-claude-executable.js';
import type { SettingsDefaults } from '../../shared/SettingsDefaultsManager.js';
import { logger } from '../../utils/logger.js';
import {
  clearDependencyStatus,
  recordChromaVectorSearchUnavailable,
  recordClaudeCliSetupRequired,
  snapshotDependencyHealth,
  type DependencyHealthSnapshot,
} from '../../shared/dependency-health.js';
import { requireApprovedLocalChromaRuntime } from '../sync/ChromaLocalRuntime.js';
import { clearClaudeCliSelfHealAttempts } from './stale-spawn-recovery.js';

interface ClassifiedClaudeSetupError {
  kind: string;
  message: string;
}

export interface WorkerDependencyPreflightOptions {
  settings: Partial<Pick<SettingsDefaults, 'CLAUDE_MEM_PROVIDER' | 'CLAUDE_MEM_CHROMA_ENABLED'
    | 'CLAUDE_MEM_CHROMA_MODE' | 'CLAUDE_MEM_CHROMA_EMBEDDING_FUNCTION' | 'CLAUDE_MEM_CHROMA_RUNTIME_DIR'>>;
  classifyClaudeError: (error: unknown) => ClassifiedClaudeSetupError;
  findClaudeExecutable?: () => string;
}

export function runWorkerDependencyPreflight(options: WorkerDependencyPreflightOptions): DependencyHealthSnapshot {
  const provider = options.settings.CLAUDE_MEM_PROVIDER || 'claude';

  if (provider === 'claude') {
    const findClaudeExecutable = options.findClaudeExecutable ?? (() => defaultFindClaudeExecutable('WORKER'));
    try {
      findClaudeExecutable();
      clearDependencyStatus('claude_cli');
      clearClaudeCliSelfHealAttempts();
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      const classified = options.classifyClaudeError(error);
      const message = classified.kind === 'setup_required'
        ? classified.message
        : `Claude CLI preflight failed: ${err.message}`;
      logger.warn('WORKER', 'Claude CLI dependency preflight failed', {
        kind: classified.kind,
      }, err);
      recordClaudeCliSetupRequired(message);
    }
  } else {
    clearDependencyStatus('claude_cli');
  }

  clearDependencyStatus('uvx');
  if (options.settings.CLAUDE_MEM_CHROMA_ENABLED !== 'false') {
    try {
      requireApprovedLocalChromaRuntime(options.settings);
      // The manager clears the status after a successful real handshake.
    } catch (error) {
      recordChromaVectorSearchUnavailable(error instanceof Error ? error.message : String(error));
    }
  } else {
    clearDependencyStatus('chroma');
  }

  return snapshotDependencyHealth();
}
