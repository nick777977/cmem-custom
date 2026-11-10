import { describe, it, expect, beforeEach } from 'bun:test';
import { runWorkerDependencyPreflight } from '../../src/services/worker/dependency-preflight.js';
import {
  getDependencyStatus,
  recordDependencyStatus,
  resetDependencyStatusesForTesting,
} from '../../src/shared/dependency-health.js';

function classifier(error: unknown): { kind: string; message: string } {
  return {
    kind: error instanceof Error && /Claude executable not found/.test(error.message)
      ? 'setup_required'
      : 'transient',
    message: error instanceof Error ? error.message : String(error),
  };
}

describe('worker dependency preflight', () => {
  beforeEach(() => {
    resetDependencyStatusesForTesting();
  });

  it('reports missing local Chroma assets and ignores stale uvx status', () => {
    recordDependencyStatus('uvx', 'vector_search_unavailable', 'old failure');
    let claudeChecked = false;
    const snapshot = runWorkerDependencyPreflight({
      settings: { CLAUDE_MEM_PROVIDER: 'gemini', CLAUDE_MEM_CHROMA_ENABLED: 'true' },
      classifyClaudeError: classifier,
      findClaudeExecutable: () => {
        claudeChecked = true;
        throw new Error('Claude should not be checked for Gemini');
      },
    });
    expect(claudeChecked).toBe(false);
    expect(snapshot.degraded).toBe(true);
    expect(getDependencyStatus('uvx')).toBeNull();
    expect(getDependencyStatus('chroma')).toMatchObject({ kind: 'vector_search_unavailable' });
    expect(getDependencyStatus('chroma')?.message).toContain('LOCAL_CHROMA_SETUP_REQUIRED');
    expect(getDependencyStatus('chroma')?.remediation).toContain('CLAUDE_MEM_CHROMA_RUNTIME_DIR');
  });

  it('clears stale Chroma diagnostics when explicitly disabled', () => {
    recordDependencyStatus('chroma', 'vector_search_unavailable', 'old failure');
    const snapshot = runWorkerDependencyPreflight({
      settings: { CLAUDE_MEM_PROVIDER: 'gemini', CLAUDE_MEM_CHROMA_ENABLED: 'false' },
      classifyClaudeError: classifier,
    });
    expect(snapshot.degraded).toBe(false);
    expect(getDependencyStatus('chroma')).toBeNull();
  });

  it('clears stale Claude CLI setup status when a non-Claude provider is selected', () => {
    recordDependencyStatus('claude_cli', 'setup_required', 'old failure');

    runWorkerDependencyPreflight({
      settings: {
        CLAUDE_MEM_PROVIDER: 'openrouter',
        CLAUDE_MEM_CHROMA_ENABLED: 'false',
      },
      classifyClaudeError: classifier,
      findClaudeExecutable: () => {
        throw new Error('Claude should not be checked for OpenRouter');
      },
    });

    expect(getDependencyStatus('claude_cli')).toBeNull();
  });

  it('records Claude CLI setup_required when Claude is selected and discovery fails', () => {
    runWorkerDependencyPreflight({
      settings: {
        CLAUDE_MEM_PROVIDER: 'claude',
        CLAUDE_MEM_CHROMA_ENABLED: 'false',
      },
      classifyClaudeError: classifier,
      findClaudeExecutable: () => {
        throw new Error('Claude executable not found. Please install Claude Code CLI.');
      },
    });

    expect(getDependencyStatus('claude_cli')).toMatchObject({
      dependency: 'claude_cli',
      kind: 'setup_required',
      message: 'Claude executable not found. Please install Claude Code CLI.',
    });
    expect(getDependencyStatus('claude_cli')?.remediation).toContain('Claude Code CLI');
  });
});
