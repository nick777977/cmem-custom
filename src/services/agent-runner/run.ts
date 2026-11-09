import { realpathSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { query } from '@anthropic-ai/claude-agent-sdk';
import { buildHardenedSdkOptions } from '../../sdk/hardened-options.js';
import { createSdkSpawnFactory, waitForSlot } from '../../supervisor/process-registry.js';
import { SettingsDefaultsManager } from '../../shared/SettingsDefaultsManager.js';
import { nextStandaloneSessionId, prepareClaudeProfile, RecordedProfileFailure, type MainWorkerProfiles } from '../worker/MainWorkerProfiles.js';
import type { MainProfileSnapshot, ModelProfile } from '../worker/model-profiles.js';
import { resolveLlmTimeoutMs } from '../worker/retry.js';

export type RefreshAgent = Exclude<ModelProfile['provider'], 'claude'> | 'claude-code';
export type AnswerSchema = Record<string, unknown>;
export type AskAgent = (prompt: string, answerSchema?: AnswerSchema) => Promise<string>;

export interface AgentTask {
  reason: string;
  cwd: string;
  readableFolders: string[];
  run: (ask: AskAgent, agent: RefreshAgent) => Promise<string>;
  prepare?: () => Promise<void>;
}

export interface AgentRunResult {
  state: 'ok' | 'failed' | 'waiting-for-agent';
  agent: RefreshAgent | null;
  result: string | null;
  error: string | null;
  attempts: Array<{ agent: RefreshAgent; error: string }>;
}

const FILE_TOOLS = ['Read', 'Grep', 'Glob'];

/** `path` with every existing link resolved; the part that does not exist yet is kept as written. */
function realPath(path: string): string {
  try { return realpathSync(path); }
  catch {
    const parent = dirname(path);
    return parent === path ? path : join(realPath(parent), relative(parent, path));
  }
}

/** True when the file tool call stays inside `folders`: its path (relative to `cwd`) and, for Glob, its pattern. */
export function fileToolStaysInside(toolName: string, input: Record<string, unknown>, cwd: string, folders: string[]): boolean {
  const named = toolName === 'Read' ? input.file_path : input.path ?? cwd;
  if (typeof named !== 'string' || !named) return false;
  const inside = (path: string) => {
    const real = realPath(resolve(cwd, path));
    return folders.some(folder => { const from = relative(realPath(resolve(folder)), real); return from === '' || (!from.startsWith('..') && !isAbsolute(from)); });
  };
  if (!inside(named)) return false;
  // A Glob pattern is matched from its path; an absolute or climbing pattern could leave it.
  if (toolName === 'Glob' && (typeof input.pattern !== 'string' || isAbsolute(input.pattern) || input.pattern.split(/[\\/]/).includes('..'))) return false;
  return true;
}

/** Retain the checked read-only file tools on Claude, with no inherited plugins or MCP. */
function claudeAsk(task: AgentTask, profile: Extract<ModelProfile, { provider: 'claude' }>, env: NodeJS.ProcessEnv,
  jobSignal: AbortSignal, timeoutMs: number, sdkQuery: typeof query): AskAgent {
  return async (prompt, schema) => {
    const signal = AbortSignal.any([jobSignal, AbortSignal.timeout(timeoutMs)]);
    const controller = new AbortController();
    const abort = () => controller.abort();
    signal.throwIfAborted();
    signal.addEventListener('abort', abort, { once: true });
    const sessionId = nextStandaloneSessionId();
    try {
      const slot = await waitForSlot(() => parseInt(SettingsDefaultsManager.get('CLAUDE_MEM_MAX_CONCURRENT_AGENTS'), 10) || 2, signal, sessionId);
      try {
        signal.throwIfAborted();
        const options = buildHardenedSdkOptions({
          source: 'Observer', model: profile.model, env, pathToClaudeCodeExecutable: profile.executable,
          cwd: task.cwd, abortController: controller, thinking: 'omit',
          spawnClaudeCodeProcess: createSdkSpawnFactory(sessionId, slot, ['--no-session-persistence'], { executable: profile.executable, env }),
        });
        options.tools = FILE_TOOLS;
        options.disallowedTools = options.disallowedTools?.filter(tool => !FILE_TOOLS.includes(tool));
        options.permissionMode = 'default';
        options.persistSession = false;
        const deny = options.canUseTool!;
        options.canUseTool = async (name, input, context) => FILE_TOOLS.includes(name) && fileToolStaysInside(name, input, task.cwd, task.readableFolders)
          ? { behavior: 'allow', updatedInput: input }
          : deny(name, input, context);
        let answer = '';
        for await (const message of sdkQuery({ prompt: withSchema(prompt, schema), options })) {
          if (message.type === 'result' && message.subtype === 'success' && !message.is_error) answer = message.result;
        }
        signal.throwIfAborted();
        if (!answer.trim()) throw new Error('Refresh received no answer');
        return answer;
      } finally {
        slot.release();
      }
    } finally {
      signal.removeEventListener('abort', abort);
    }
  };
}

function withSchema(prompt: string, schema?: AnswerSchema): string {
  return schema ? prompt + '\n\nReturn JSON matching this schema:\n' + JSON.stringify(schema) : prompt;
}

/** One admitted profile for the entire job. Each prompt has its own request deadline. */
export async function runAgentTask(task: AgentTask, profiles: MainWorkerProfiles, snapshot: MainProfileSnapshot,
  sdkQuery = query): Promise<AgentRunResult> {
  let agent: RefreshAgent | null = null;
  try {
    return await profiles.runRole(snapshot, 'refresh', undefined, 30 * 60_000, async (profile, signal) => {
      const timeoutMs = resolveLlmTimeoutMs();
      const ask = profile.provider === 'claude'
        ? claudeAsk(task, profile, await prepareClaudeProfile(profile, signal), signal, timeoutMs, sdkQuery)
        : async (prompt: string, schema?: AnswerSchema) => {
          const requestSignal = AbortSignal.any([signal, AbortSignal.timeout(timeoutMs)]);
          const result = await profiles.queryText(profile, [{ role: 'user', content: withSchema(prompt, schema) }], requestSignal, timeoutMs);
          requestSignal.throwIfAborted();
          if (!result.content.trim()) throw new Error('Refresh received no answer');
          return result.content;
        };
      agent = profile.provider === 'claude' ? 'claude-code' : profile.provider;
      await task.prepare?.();
      signal.throwIfAborted();
      const result = await task.run(ask, agent);
      return { state: 'ok', agent, result: result.slice(0, 4000), error: null, attempts: [] };
    });
  } catch (failure) {
    const error = failure instanceof RecordedProfileFailure ? failure.message : 'refresh: provider_error';
    return { state: agent ? 'failed' : 'waiting-for-agent', agent, result: null, error, attempts: agent ? [{ agent, error }] : [] };
  }
}
