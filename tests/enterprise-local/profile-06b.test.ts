import { afterEach, expect, test } from 'bun:test';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { query } from '@anthropic-ai/claude-agent-sdk';
import { runAgentTask, type AgentTask } from '../../src/services/agent-runner/run.js';
import { ClaudeProvider } from '../../src/services/worker/ClaudeProvider.js';
import { CodexProvider } from '../../src/services/worker/CodexProvider.js';
import { GeminiProvider } from '../../src/services/worker/GeminiProvider.js';
import { MainWorkerProfiles } from '../../src/services/worker/MainWorkerProfiles.js';
import { OpenAICompatProvider } from '../../src/services/worker/OpenAICompatProvider.js';
import { OpenRouterProvider } from '../../src/services/worker/OpenRouterProvider.js';
import { configuredHumanCopyProvider } from '../../src/services/worker/http/routes/WorkViewRoutes.js';
import { KnowledgeAgent } from '../../src/services/worker/knowledge/KnowledgeAgent.js';
import type { CorpusFile } from '../../src/services/worker/knowledge/types.js';
import { readMainProfiles, resolveMainProfiles } from '../../src/services/worker/model-profiles.js';
import { jevClientFromSelection, jevJudge } from '../../src/services/work-view/request-judge.mjs';
import { jevFocusJudge } from '../../src/services/work-view/focus-judge.mjs';

const scratch = () => mkdtempSync(join(tmpdir(), 'profile-06b-'));
const local = (model: string) => ({
  id: model, model, provider: 'openai-compatible', auth: 'none', endpoint: `http://127.0.0.1:49514/${model}/v1`,
});
const createRouter = () => new MainWorkerProfiles(null!, null!, new ClaudeProvider(null!, null!), {
  codex: new CodexProvider(null!, null!), gemini: new GeminiProvider(null!, null!), openrouter: new OpenRouterProvider(null!, null!),
  'openai-compatible': new OpenAICompatProvider(null!, null!),
});
const fixtureEnv = { CLAUDE_MEM_PROVIDER: 'openrouter', OPENROUTER_API_KEY: 'legacy-ignored' };
const originalFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = originalFetch; });

test('refresh prepares only after admission and keeps the profile selected at job start', async () => {
  const router = createRouter();
  const selected = resolveMainProfiles({ default: local('default-model'), refresh: local('refresh-model') }, fixtureEnv);
  const absent = resolveMainProfiles(undefined, fixtureEnv);
  const calls: Array<{ url: string; body: any; redirect?: RequestRedirect }> = [];
  const events: string[] = [];
  globalThis.fetch = (async (url, init) => {
    events.push('send');
    calls.push({ url: String(url), body: JSON.parse(String(init?.body)), redirect: init?.redirect });
    return Response.json({ choices: [{ message: { content: '{"ok":true}' } }] });
  }) as typeof fetch;
  const task: AgentTask = {
    cwd: 'unused', readableFolders: [], reason: 'fixture',
    prepare: async () => { events.push('prepare'); router.snapshot = () => absent; },
    run: async ask => {
      events.push('run');
      expect(await ask('First request', { type: 'object' })).toBe('{"ok":true}');
      return ask('Second request');
    },
  };
  expect(await runAgentTask(task, router, absent)).toMatchObject({ state: 'waiting-for-agent', error: 'refresh: profile_required' });
  expect(events).toEqual([]);
  expect(await runAgentTask(task, router, selected)).toMatchObject({ state: 'ok', agent: 'openai-compatible' });
  expect(events).toEqual(['prepare', 'run', 'send', 'send']);
  expect(calls.map(({ url, body, redirect }) => [url, body.model, body.models, redirect])).toEqual([
    [local('refresh-model').endpoint + '/chat/completions', 'refresh-model', undefined, 'error'],
    [local('refresh-model').endpoint + '/chat/completions', 'refresh-model', undefined, 'error'],
  ]);
  expect(calls[0].body.messages[0].content).toContain('Return JSON matching this schema');
  const failed = await runAgentTask({ ...task, prepare: async () => { throw new Error('private path'); } }, router, selected);
  expect(failed).toMatchObject({ state: 'failed', error: 'refresh: provider_error' });
  expect(calls).toHaveLength(2);
});

test('copy selects an override, reports safe failures, and honors explicit off without sending', async () => {
  const root = scratch();
  try {
    const settings = join(root, 'settings.json');
    const keyEnv = 'CMEM_PROFILE_KEY_COPY';
    const copy = { ...local('copy-model'), auth: 'api-key', keyEnv };
    const secret = 'synthetic-copy-key';
    const env = { ...fixtureEnv, [keyEnv]: secret, [keyEnv + '_ENDPOINT']: copy.endpoint };
    const router = createRouter();
    router.snapshot = (path = settings) => readMainProfiles(path, env);
    const provider = configuredHumanCopyProvider(router, settings);
    let calls = 0;
    globalThis.fetch = (async (url, init) => {
      expect(String(url)).toBe(copy.endpoint + '/chat/completions');
      expect(new Headers(init?.headers).get('authorization')).toBe(`Bearer ${secret}`);
      const body = JSON.parse(String(init?.body));
      expect(body.model).toBe(copy.model);
      expect(body.models).toBeUndefined();
      expect(init?.redirect).toBe('error');
      expect(body.messages[0]).toMatchObject({ role: 'system', content: expect.stringContaining('original.text') });
      expect(body.messages[1].role).toBe('user');
      return ++calls === 1 ? Response.json({ choices: [{ message: { content: '{"title":"Synthetic copy"}' } }] })
        : new Response(`echo ${secret} and private copy text`, { status: 401 });
    }) as typeof fetch;
    const write = (value: unknown) => writeFileSync(settings, JSON.stringify({ env: { CLAUDE_MEM_MODEL_PROFILES: value } }));
    writeFileSync(settings, 'null');
    await expect(provider({})).rejects.toThrow('copy: invalid_profile');
    write({ default: local('main'), copy });
    expect(provider.isAvailable?.()).toBe(true);
    expect(await provider({ original: { text: 'Synthetic ask' } })).toMatchObject({ output: { title: 'Synthetic copy' }, model: copy.model });
    await expect(provider({})).rejects.toThrow('copy: auth_invalid');
    expect(router.status().copy).toMatchObject({ lastFailure: 'auth_invalid', inherited: false });
    for (const hidden of [secret, copy.endpoint, keyEnv, 'private copy text']) {
      expect(JSON.stringify(router.status())).not.toContain(hidden);
    }
    write({ default: local('main'), copy: 'off' });
    expect(provider.isOff?.()).toBe(true);
    await expect(provider({})).rejects.toThrow('copy: disabled');
    write({ default: local('main'), copy: { ...copy, endpoint: local('other').endpoint } });
    await expect(provider({})).rejects.toThrow('copy: credential_unavailable');
    expect(calls).toBe(2);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('request and focus judges send only to their bound Decisions endpoints', async () => {
  const router = createRouter();
  const judge = (model: string) => ({ ...local(model), endpoint: `http://127.0.0.1:49514/${model}/decisions` });
  const requestJudge = judge('request-model'), focusJudge = judge('focus-model');
  const selected = resolveMainProfiles({ default: local('main'), requestJudge, focusJudge }, fixtureEnv);
  const calls: Array<[string, string]> = [];
  const fetchImpl = (async (url, init) => {
    const body = JSON.parse(String(init?.body));
    calls.push([String(url), body.model]);
    expect(init?.redirect).toBe('error');
    expect(new Headers(init?.headers).has('authorization')).toBe(false);
    const name = Object.keys(body.questions)[0];
    return Response.json({ model: 'untrusted-response-model', answers: { [name]: { type: 'choice', choice: 'none', probabilities: { none: 0.9 } } } });
  }) as typeof fetch;
  const context = { worktree: null, started: null, asks: ['Synthetic ask'], agent_recorded: [] };
  const request = await router.runRole(selected, 'requestJudge', undefined, 2000, async (_, signal) =>
    jevJudge(jevClientFromSelection(selected.requestJudge, { signal, fetchImpl })).judge({ conversationKey: 'c', context },
      [{ groupId: 'g', title: 'Synthetic candidate', anchor: 'a', context: { ...context, title: 'Synthetic candidate' } }]));
  const focus = await router.runRole(selected, 'focusJudge', undefined, 2000, async (_, signal) =>
    jevFocusJudge(jevClientFromSelection(selected.focusJudge, { signal, fetchImpl })).pick({ ...context, title: 'Synthetic request' },
      [{ focusAreaId: 'fa', name: 'Synthetic area' }]));
  expect(request).toMatchObject({ requestId: null, confidence: 0.9 });
  expect(focus).toMatchObject({ focusAreaId: 'other', confidence: 0.9 });
  expect(request?.evidence).toContain('request-model');
  expect(focus.evidence).toContain('focus-model');
  const noDecisions = resolveMainProfiles({ default: local('main'), focusJudge: local('chat-only') }, fixtureEnv);
  expect(() => jevClientFromSelection(noDecisions.focusJudge, { fetchImpl })).toThrow('unsupported_capability');
  await expect(router.runRole(noDecisions, 'requestJudge', undefined, 2000, async () => { throw new Error('unexpected dispatch'); }))
    .rejects.toThrow('requestJudge: unsupported_capability');
  expect(calls).toEqual([[requestJudge.endpoint, requestJudge.model], [focusJudge.endpoint, focusJudge.model]]);
});

test('knowledge validates resumable capability and exact Claude auth before any SDK turn', async () => {
  const root = scratch();
  try {
    const executable = join(root, 'claude.exe');
    writeFileSync(executable, '');
    const authHome = join(root, 'missing-native-login');
    const profile = { id: 'corpus-fixture', provider: 'claude', model: 'claude-fixture-4', auth: 'api-key', executable, keyEnv: 'CMEM_PROFILE_KEY_CORPUS' };
    const router = createRouter();
    const store: CorpusFile[] = [];
    const turns: Array<Parameters<typeof query>[0]> = [];
    const sdk = (async function* (input: Parameters<typeof query>[0]) {
      turns.push(input);
      yield { type: 'result', subtype: 'success', result: 'Synthetic answer', session_id: 'synthetic-native-session' };
    }) as unknown as typeof query;
    const knowledge = new KnowledgeAgent({ write: (corpus: CorpusFile) => store.push(corpus) } as never, router, sdk);
    const corpus: CorpusFile = {
      name: 'fixture', version: 1, created_at: '', updated_at: '', description: 'Synthetic only', filter: {},
      stats: { observation_count: 0, token_estimate: 0, date_range: { earliest: '', latest: '' }, type_breakdown: {} },
      system_prompt: 'Synthetic knowledge prompt', observations: [], session_id: 'legacy-session',
    };
    router.snapshot = () => resolveMainProfiles({ default: local('main') }, fixtureEnv);
    await expect(knowledge.prime(corpus)).rejects.toThrow('knowledge: unsupported_capability');
    router.snapshot = () => resolveMainProfiles({ default: local('main'), knowledge: {
      id: profile.id, model: profile.model, provider: 'claude', auth: 'claude-login', authHome, executable,
    } }, fixtureEnv);
    await expect(knowledge.prime(corpus)).rejects.toThrow('knowledge: setup_required');
    expect(turns).toHaveLength(0);
    expect(store).toHaveLength(0);
    const credentials = { CMEM_PROFILE_KEY_CORPUS: 'synthetic-claude-key', CMEM_PROFILE_KEY_CORPUS_ENDPOINT: 'https://api.anthropic.com/' };
    router.snapshot = () => resolveMainProfiles({ default: local('main'), knowledge: profile }, credentials);
    await expect(knowledge.query(corpus, 'Synthetic question')).rejects.toThrow('Prime this corpus with the selected knowledge profile');
    expect(turns).toHaveLength(0);
    expect(await knowledge.reprime(corpus)).toBe('synthetic-native-session');
    expect(await knowledge.query(corpus, 'Synthetic question')).toMatchObject({ answer: 'Synthetic answer' });
    expect(turns).toHaveLength(2);
    expect(turns[0].options).toMatchObject({
      model: profile.model, pathToClaudeCodeExecutable: executable, strictMcpConfig: true, mcpServers: {},
      tools: [], settingSources: [], maxTurns: 1, env: { ANTHROPIC_API_KEY: credentials.CMEM_PROFILE_KEY_CORPUS, ANTHROPIC_BASE_URL: 'https://api.anthropic.com' },
    });
    expect(turns[0].options?.resume).toBeUndefined();
    expect(turns[1].options?.resume).toBe('synthetic-native-session');
    expect(JSON.stringify(store)).not.toContain(credentials.CMEM_PROFILE_KEY_CORPUS);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('Telegram wrap-up is a visible pre-dispatch capability refusal even with an explicit valid profile', async () => {
  const router = createRouter();
  const snapshot = resolveMainProfiles({ default: local('main'), telegramWrapup: local('telegram') }, fixtureEnv);
  router.snapshot = () => snapshot;
  expect(router.status().telegramWrapup).toEqual({ state: 'paused', issue: 'unsupported_capability', inherited: false });
  let sent = false;
  await expect(router.runRole(snapshot, 'telegramWrapup', undefined, 1000, async () => { sent = true; })).rejects.toThrow('telegramWrapup: unsupported_capability');
  expect(sent).toBe(false);
});
