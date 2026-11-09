import { createHash } from 'node:crypto';
import { query } from '@anthropic-ai/claude-agent-sdk';
import { buildHardenedSdkOptions } from '../../../sdk/hardened-options.js';
import { isAuthFailureObserverOutput } from '../../../sdk/output-classifier.js';
import { SettingsDefaultsManager } from '../../../shared/SettingsDefaultsManager.js';
import { createSdkSpawnFactory, waitForSlot } from '../../../supervisor/process-registry.js';
import { AppError } from '../../server/ErrorHandler.js';
import { nextStandaloneSessionId, prepareClaudeProfile, RecordedProfileFailure, type MainWorkerProfiles } from '../MainWorkerProfiles.js';
import type { ModelProfile } from '../model-profiles.js';
import { ClassifiedProviderError } from '../provider-errors.js';
import { resolveLlmTimeoutMs } from '../retry.js';
import type { CorpusStore } from './CorpusStore.js';
import { CorpusRenderer } from './CorpusRenderer.js';
import type { CorpusFile, QueryResult } from './types.js';

type ClaudeProfile = Extract<ModelProfile, { provider: 'claude' }>;

/** Retry only the SDK's specific missing-transcript failure. */
export function isSessionResumeError(error: unknown): boolean {
  return /No conversation found with session ID/.test(error instanceof Error ? error.message : String(error));
}

function sessionBinding(profile: ClaudeProfile): string {
  return createHash('sha256').update(JSON.stringify(profile, (key, value) => key === 'apiKey' ? undefined : value)).digest('hex');
}

function profileFailure(error: unknown): never {
  if (!(error instanceof RecordedProfileFailure)) throw error;
  const setup = ['profile_required', 'invalid_profile', 'unsupported_route', 'unsupported_capability',
    'credential_unavailable', 'disabled', 'setup_required'].includes(error.issue);
  throw new AppError(error.message, setup ? 424 : error.issue === 'auth_invalid' ? 401 : 502, 'KNOWLEDGE_PROFILE_FAILED');
}

export interface KnowledgeAgentCallOptions {
  abortController?: AbortController;
}

export class KnowledgeAgent {
  private readonly renderer = new CorpusRenderer();

  constructor(private corpusStore: CorpusStore, private profiles: MainWorkerProfiles, private sdkQuery = query) {}

  private run<T>(snapshot: ReturnType<MainWorkerProfiles['snapshot']>, options: KnowledgeAgentCallOptions,
    task: (profile: ClaudeProfile, env: NodeJS.ProcessEnv, signal: AbortSignal) => Promise<T>): Promise<T> {
    return this.profiles.runRole(snapshot, 'knowledge', options.abortController?.signal, resolveLlmTimeoutMs(),
      async (profile, signal) => {
        if (profile.provider !== 'claude') throw new Error('unsupported_capability');
        return task(profile, await prepareClaudeProfile(profile, signal), signal);
      }).catch(profileFailure);
  }

  private primePrompt(corpus: CorpusFile): string {
    return [
      corpus.system_prompt, '', 'Here is your complete knowledge base:', '', this.renderer.renderCorpus(corpus), '',
      'Acknowledge what you have received. Summarize the key themes and topics you can answer questions about.',
    ].join('\n');
  }

  async prime(corpus: CorpusFile, options: KnowledgeAgentCallOptions = {}): Promise<string> {
    return this.run(this.profiles.snapshot(), options, async (profile, env, signal) => {
      const result = await this.turn(this.primePrompt(corpus), profile, env, signal);
      this.saveSession(corpus, result.session_id, profile, signal);
      return result.session_id;
    });
  }

  async query(corpus: CorpusFile, question: string, options: KnowledgeAgentCallOptions = {}): Promise<QueryResult> {
    const snapshot = this.profiles.snapshot();
    const selected = snapshot.knowledge;
    if (selected.state === 'configured' && selected.profile.provider === 'claude') {
      if (!corpus.session_id) throw new AppError('Prime this corpus before asking a question.', 409, 'CORPUS_NOT_PRIMED');
      if (corpus.session_profile !== sessionBinding(selected.profile)) {
        throw new AppError('Prime this corpus with the selected knowledge profile.', 409, 'CORPUS_PROFILE_CHANGED');
      }
    }
    return this.run(snapshot, options, async (profile, env, signal) => {
      let result: QueryResult;
      try {
        result = await this.turn(question, profile, env, signal, corpus.session_id!);
      } catch (error) {
        signal.throwIfAborted();
        if (!isSessionResumeError(error)) throw error;
        const primed = await this.turn(this.primePrompt(corpus), profile, env, signal);
        this.saveSession(corpus, primed.session_id, profile, signal);
        result = await this.turn(question, profile, env, signal, primed.session_id);
      }
      if (result.session_id !== corpus.session_id) this.saveSession(corpus, result.session_id, profile, signal);
      return result;
    });
  }

  reprime(corpus: CorpusFile, options: KnowledgeAgentCallOptions = {}): Promise<string> {
    return this.prime(corpus, options);
  }

  private saveSession(corpus: CorpusFile, sessionId: string, profile: ClaudeProfile, signal: AbortSignal): void {
    signal.throwIfAborted();
    const updated = { ...corpus, session_id: sessionId, session_profile: sessionBinding(profile) };
    this.corpusStore.write(updated);
    Object.assign(corpus, updated);
  }

  private async turn(prompt: string, profile: ClaudeProfile, env: NodeJS.ProcessEnv, signal: AbortSignal, resume?: string): Promise<QueryResult> {
    signal.throwIfAborted();
    const controller = new AbortController();
    const abort = () => controller.abort();
    signal.addEventListener('abort', abort, { once: true });
    const id = nextStandaloneSessionId();
    try {
      const slot = await waitForSlot(() => parseInt(SettingsDefaultsManager.get('CLAUDE_MEM_MAX_CONCURRENT_AGENTS'), 10) || 2, signal, id);
      try {
        signal.throwIfAborted();
        const options = buildHardenedSdkOptions({
          source: 'KnowledgeAgent', model: profile.model, env, pathToClaudeCodeExecutable: profile.executable,
          abortController: controller, resume,
          spawnClaudeCodeProcess: createSdkSpawnFactory(id, slot, [], { executable: profile.executable, env }),
        });
        let sessionId = resume;
        let answer = '';
        let successful = false;
        try {
          for await (const message of this.sdkQuery({ prompt, options: { ...options, maxTurns: 1 } })) {
            if (message.session_id) sessionId = message.session_id;
            if (message.type !== 'result') continue;
            successful = message.subtype === 'success' && !message.is_error;
            const details = 'errors' in message ? message.errors.join('\n') : message.result;
            if (!successful) {
              if (isSessionResumeError(details)) throw new Error('No conversation found with session ID');
              if (isAuthFailureObserverOutput(details)) {
                throw new ClassifiedProviderError('Knowledge authentication failed', { kind: 'auth_invalid', cause: null });
              }
              throw new Error('Knowledge request failed');
            }
            answer = details;
          }
        } catch (error) {
          if (!successful) throw error;
        }
        signal.throwIfAborted();
        if (!successful || !sessionId || (resume && !answer.trim())) throw new Error('Knowledge request ended without a usable result');
        return { answer, session_id: sessionId };
      } finally {
        slot.release();
      }
    } finally {
      signal.removeEventListener('abort', abort);
    }
  }
}
