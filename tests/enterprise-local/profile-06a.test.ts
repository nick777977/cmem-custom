import { afterEach, expect, spyOn, test } from 'bun:test';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { ActiveSession } from '../../src/services/worker-types.js';
import { ClaudeProvider } from '../../src/services/worker/ClaudeProvider.js';
import { CodexAppServerClient } from '../../src/services/worker/CodexAppServerClient.js';
import { CodexProvider } from '../../src/services/worker/CodexProvider.js';
import { GeminiProvider } from '../../src/services/worker/GeminiProvider.js';
import { MainWorkerProfiles } from '../../src/services/worker/MainWorkerProfiles.js';
import { OpenAICompatProvider } from '../../src/services/worker/OpenAICompatProvider.js';
import { OpenRouterProvider } from '../../src/services/worker/OpenRouterProvider.js';
import type { ProfileTurnRequest } from '../../src/services/worker/OpenAICompatibleProvider.js';
import { describeModelRole, readMainProfiles, resolveMainProfiles } from '../../src/services/worker/model-profiles.js';

const observer = {
  id: 'observer-fixture', provider: 'openai-compatible', model: 'observer-model', auth: 'api-key',
  keyEnv: 'CMEM_PROFILE_KEY_OBSERVER_KEY', endpoint: 'http://127.0.0.1:7000/v1',
};
const summary = {
  id: 'summary-fixture', provider: 'openrouter', model: 'summary-model', auth: 'api-key',
  keyEnv: 'CMEM_PROFILE_KEY_SUMMARY_KEY', endpoint: 'https://summary.example.invalid/api/v1',
};
const compression = {
  id: 'compression-fixture', provider: 'gemini', model: 'gemini-fixture', auth: 'api-key', keyEnv: 'CMEM_PROFILE_KEY_GEMINI_KEY',
};
const credentialEnv = {
  CMEM_PROFILE_KEY_OBSERVER_KEY: 'synthetic-observer-key', CMEM_PROFILE_KEY_OBSERVER_KEY_ENDPOINT: observer.endpoint,
  CMEM_PROFILE_KEY_SUMMARY_KEY: 'synthetic-summary-key', CMEM_PROFILE_KEY_SUMMARY_KEY_ENDPOINT: summary.endpoint,
  CMEM_PROFILE_KEY_GEMINI_KEY: 'synthetic-gemini-key', CMEM_PROFILE_KEY_GEMINI_KEY_ENDPOINT: 'https://generativelanguage.googleapis.com/',
};
const request: ProfileTurnRequest = {
  session: { sessionDbId: 1, contentSessionId: 'synthetic', project: 'fixture' } as ActiveSession,
  history: [{ role: 'user', content: 'Synthetic test content.' }],
  signal: new AbortController().signal, timeoutMs: 3000, label: { kind: 'observation', sessionId: 'fixture' },
};

function createRouter() {
  // These tests use the adapters' production request paths. Session storage is exercised by the compiled fixture.
  const claude = new ClaudeProvider(null!, null!);
  const codex = new CodexProvider(null!, null!);
  const router = new MainWorkerProfiles(null!, null!, claude, {
    codex, gemini: new GeminiProvider(null!, null!), openrouter: new OpenRouterProvider(null!, null!),
    'openai-compatible': new OpenAICompatProvider(null!, null!),
  });
  return { claude, codex, router };
}

const originalFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = originalFetch; });

test('requires a complete default and leaves an invalid override paused', () => {
  const missing = resolveMainProfiles(undefined, { CLAUDE_MEM_PROVIDER: 'claude', CLAUDE_MEM_MODEL: 'old-default' });
  expect(missing.observer).toEqual({ state: 'paused', issue: 'profile_required', inherited: true });
  const invalidDefault = resolveMainProfiles({ default: { ...observer, model: '' }, summary }, credentialEnv);
  expect(invalidDefault.summary).toEqual({ state: 'paused', issue: 'invalid_profile', inherited: true });
  const resolved = resolveMainProfiles({ default: observer, summary: { ...summary, keyEnv: 'CMEM_PROFILE_KEY_MISSING_KEY' } }, credentialEnv);
  expect(describeModelRole(resolved.observer)).toEqual({
    state: 'configured', inherited: true, profileId: observer.id, provider: observer.provider, model: observer.model, auth: observer.auth,
  });
  expect(resolved.compression).toEqual(resolved.observer);
  expect(resolved.summary).toEqual({ state: 'paused', issue: 'credential_unavailable', inherited: false });
});

test('rejects endpoint rebinding, gateway keys, implicit models and unsupported auth', () => {
  for (const [profile, issue] of [
    [{ ...observer, endpoint: 'https://another.example.invalid/v1' }, 'credential_unavailable'],
    [{ ...observer, endpoint: 'https://api.cmem.ai/v1' }, 'invalid_profile'],
    [{ ...observer, endpoint: 'https://fixture.example.invalid/?key=synthetic' }, 'invalid_profile'],
    [{ ...observer, auth: 'chatgpt' }, 'unsupported_route'],
    [{ ...summary, model: 'openrouter/auto' }, 'unsupported_route'],
    [{ ...summary, model: 'one,two' }, 'invalid_profile'],
    [{ ...observer, apiKey: 'inline-secret' }, 'invalid_profile'],
  ] as const) {
    expect(resolveMainProfiles({ default: profile }, credentialEnv).observer).toMatchObject({ state: 'paused', issue });
  }
  expect(resolveMainProfiles({ default: observer }, { ...credentialEnv, CMEM_PROFILE_KEY_OBSERVER_KEY: 'cm_pro_synthetic' }).observer)
    .toMatchObject({ state: 'paused', issue: 'credential_unavailable' });
});

test('reads wrapped settings without changing the file and gives the explicit environment value precedence', () => {
  const root = mkdtempSync(join(tmpdir(), 'profile-06a-'));
  try {
    const path = join(root, 'settings.json');
    const settings = { CLAUDE_MEM_MODEL_PROFILES: { default: { ...observer, model: 'stale-model' } },
      env: { CLAUDE_MEM_MODEL_PROFILES: { default: observer } }, hooks: {} };
    writeFileSync(path, JSON.stringify(settings));
    expect(describeModelRole(readMainProfiles(path, credentialEnv).observer)).toMatchObject({ model: observer.model });
    const env = { ...credentialEnv, CLAUDE_MEM_MODEL_PROFILES: JSON.stringify({ default: summary }) };
    expect(describeModelRole(readMainProfiles(path, env).observer)).toMatchObject({ model: summary.model });
    expect(readMainProfiles(path, { ...env, CLAUDE_MEM_MODEL_PROFILES: '' }).observer).toMatchObject({ issue: 'profile_required' });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('dispatches each role through its real HTTP adapter using only the selected tuple', async () => {
  const { router } = createRouter();
  const calls: Array<{ url: string; model?: string; headers: Headers; redirect?: RequestRedirect; models?: string[] }> = [];
  globalThis.fetch = (async (url, init) => {
    const body = JSON.parse(String(init?.body));
    calls.push({ url: String(url), model: body.model, models: body.models, headers: new Headers(init?.headers), redirect: init?.redirect });
    return String(url).includes('googleapis.com')
      ? Response.json({ candidates: [{ content: { parts: [{ text: 'Compressed.' }] } }] })
      : Response.json({ choices: [{ message: { content: 'Answered.' } }] });
  }) as typeof fetch;
  const snapshot = resolveMainProfiles({ default: observer, summary, compression }, credentialEnv);
  const model = await router.send(snapshot, 'observer', request, {});
  expect(model.servedModel).toBe(observer.model);
  await router.send(snapshot, 'summary', { ...request, label: { ...request.label, kind: 'summary' } }, {});
  await router.send(snapshot, 'compression', { ...request, label: { ...request.label, kind: 'field_compression' } }, {});
  expect(calls.map(call => [call.url, call.model, call.models, call.redirect])).toEqual([
    [`${observer.endpoint}/chat/completions`, observer.model, undefined, 'error'],
    [`${summary.endpoint}/chat/completions`, summary.model, undefined, 'error'],
    ['https://generativelanguage.googleapis.com/v1beta/models/gemini-fixture:generateContent', undefined, undefined, 'error'],
  ]);
  expect(calls[0].headers.get('authorization')).toBe(`Bearer ${credentialEnv.CMEM_PROFILE_KEY_OBSERVER_KEY}`);
  expect(calls[1].headers.get('authorization')).toBe(`Bearer ${credentialEnv.CMEM_PROFILE_KEY_SUMMARY_KEY}`);
  expect(calls[2].headers.get('x-goog-api-key')).toBe(credentialEnv.CMEM_PROFILE_KEY_GEMINI_KEY);
});

test('refuses missing routes and reports selected provider failures without exposing secrets', async () => {
  const { router } = createRouter();
  const issues: string[] = [];
  const worker = { recordAiInteraction: ({ error }: { error?: string }) => { if (error) issues.push(error); } };
  let sends = 0;
  globalThis.fetch = (async () => {
    sends++;
    return new Response(`rejected ${credentialEnv.CMEM_PROFILE_KEY_OBSERVER_KEY}; Synthetic test content.`, { status: 401 });
  }) as typeof fetch;
  const missing = resolveMainProfiles({ default: observer }, {});
  await expect(router.send(missing, 'observer', request, worker)).rejects.toThrow('credential_unavailable');
  expect(sends).toBe(0);
  const selected = resolveMainProfiles({ default: observer, summary }, credentialEnv);
  router.snapshot = () => selected;
  await expect(router.send(selected, 'observer', request, worker)).rejects.toThrow('observer: auth_invalid');
  expect(sends).toBe(1);
  expect(issues).toEqual(['observer: credential_unavailable', 'observer: auth_invalid']);
  const status = router.status();
  expect(status.observer).toMatchObject({ auth: 'api-key', lastFailure: 'auth_invalid' });
  expect(status.summary).toMatchObject({ inherited: false, model: summary.model });
  const json = JSON.stringify(status);
  for (const secret of [credentialEnv.CMEM_PROFILE_KEY_OBSERVER_KEY, observer.endpoint, observer.keyEnv, 'Synthetic test content.']) {
    expect(json).not.toContain(secret);
  }
});

test('passes the exact Claude and Codex route to native adapters and refuses missing native credentials', async () => {
  const { router, claude, codex } = createRouter();
  const home = mkdtempSync(join(tmpdir(), 'profile-native-'));
  const claudeQuery = spyOn(claude, 'queryProfileTurn').mockResolvedValue('Claude answer.');
  const codexProfile = { id: 'native-codex', provider: 'codex', auth: 'chatgpt', model: 'codex-fixture-model',
    executable: process.execPath, authHome: home };
  const claudeApi = { id: 'direct-claude', provider: 'claude', auth: 'api-key', model: 'claude-sonnet-4-6',
    executable: process.execPath, keyEnv: 'CMEM_PROFILE_KEY_CLAUDE_FIXTURE_KEY' };
  const claudeLogin = { id: 'native-claude', provider: 'claude', auth: 'claude-login', model: claudeApi.model,
    executable: process.execPath, authHome: home };
  try {
    for (const profile of [codexProfile, claudeLogin, {
      id: 'bedrock-fixture', provider: 'claude', auth: 'aws-sso', model: 'us.anthropic.claude-sonnet-4-6',
      executable: process.execPath, awsPath: process.execPath, awsConfigFile: join(home, 'missing-config'),
      awsProfile: 'fixture', region: 'us-east-1',
    }]) {
      const snapshot = resolveMainProfiles({ default: profile }, {});
      expect(snapshot.observer.state).toBe('configured');
      await expect(router.send(snapshot, 'observer', request, {})).rejects.toThrow('observer: setup_required');
    }
    expect(claudeQuery).not.toHaveBeenCalled();
    const native = spyOn(CodexAppServerClient.prototype, 'runTurn').mockResolvedValue({ content: 'Codex answer.' });
    try {
      const snapshot = resolveMainProfiles({ default: claudeApi, summary: codexProfile }, {
        CMEM_PROFILE_KEY_CLAUDE_FIXTURE_KEY: 'synthetic-claude-key', CMEM_PROFILE_KEY_CLAUDE_FIXTURE_KEY_ENDPOINT: 'https://api.anthropic.com/',
      });
      await router.send(snapshot, 'observer', request, {});
      const [, , model, executable, env] = claudeQuery.mock.calls[0];
      expect(model).toBe(claudeApi.model);
      expect(executable).toBe(claudeApi.executable);
      expect(env).toMatchObject({ ANTHROPIC_API_KEY: 'synthetic-claude-key', ANTHROPIC_BASE_URL: 'https://api.anthropic.com' });
      expect(env.CLAUDE_CODE_OAUTH_TOKEN).toBeUndefined();
      expect(env.AWS_PROFILE).toBeUndefined();
      await router.send(snapshot, 'summary', request, {});
      expect(native.mock.calls[0][0]).toMatchObject({ model: codexProfile.model, codexPath: process.execPath, nativeCodexHome: home });
    } finally {
      native.mockRestore();
    }
  } finally {
    claudeQuery.mockRestore();
    await codex.close();
    rmSync(home, { recursive: true, force: true });
  }
});
