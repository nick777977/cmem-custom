import { describe, expect, it, mock } from 'bun:test';
import { runBrowserSetup, shouldUseBrowserSetup, waitForBackgroundWorkToFinish } from '../../src/npx-cli/install/browser-setup.js';

describe('local fork browser boundary', () => {
  for (const input of [
    { interactive: true, runtime: 'worker', setupComplete: false },
    { interactive: true, runtime: 'worker', setupComplete: true },
    { interactive: false, runtime: 'worker', setupComplete: false },
    { interactive: true, runtime: 'server', setupComplete: false },
    { interactive: true, runtime: 'worker', setupComplete: false, provider: 'claude' },
  ] as const) it('never selects hosted setup: '+JSON.stringify(input), () => {
    expect(shouldUseBrowserSetup(input)).toBe(false);
  });
  it('rejects direct legacy invocation before any side effect', async () => {
    const effect = mock(() => { throw Error('Forbidden callback'); });
    await expect(runBrowserSetup({ workerBaseUrl: 'https://legacy.invalid', openBrowser: effect,
      log: { info: effect, warn: effect }, applyChoice: effect, fetch: effect as typeof fetch,
      sleep: effect, checkout: { run: effect, reopen: effect } })).rejects.toThrow('disabled');
    expect(effect).toHaveBeenCalledTimes(0);
  });
  it('never polls a retired setup endpoint to decide a worker restart', async () => {
    const effect = mock(() => { throw Error('Forbidden callback'); });
    await expect(waitForBackgroundWorkToFinish({ workerBaseUrl: 'https://legacy.invalid',
      log: { info: effect, warn: effect }, fetch: effect as typeof fetch, sleep: effect })).rejects.toThrow('disabled');
    expect(effect).toHaveBeenCalledTimes(0);
  });
});

import { settingsChangesNeedingRestart } from '../../src/npx-cli/install/browser-setup.js';
describe('settingsChangesNeedingRestart', () => {
  const before = JSON.stringify({ CLAUDE_MEM_WORKER_PORT: '37896', CLAUDE_MEM_RUNTIME: 'worker' });
  it('At Home needs no restart: the worker reads the provider, auth method and model live, and sync stays off', () => {
    // What useSubscriptionAuth() writes (buildAnthropicMaxLocalSettings): the scenario (b) settings file.
    const atHome = JSON.stringify({
      CLAUDE_MEM_WORKER_PORT: '37896', CLAUDE_MEM_RUNTIME: 'worker', CLAUDE_MEM_PROVIDER: 'claude', CLAUDE_MEM_CLAUDE_AUTH_METHOD: 'subscription',
      CLAUDE_MEM_MODEL: 'claude-sonnet-5', CLAUDE_MEM_CLOUD_SYNC_TOKEN: '', CLAUDE_MEM_CLOUD_SYNC_USER_ID: '', CLAUDE_MEM_CLOUD_SYNC_HUB_URL: '',
      CLAUDE_MEM_CLOUD_SYNC_DEVICE_ID: '', CLAUDE_MEM_CLOUD_SYNC_DEVICE_NAME: '', CLAUDE_MEM_PRO_MEMORY_KEY: '', CLAUDE_MEM_PRO_MEMORY_BASE_URL: '', CLAUDE_MEM_PRO_MEMORY_MODEL: '',
    });
    expect(settingsChangesNeedingRestart(before, atHome)).toEqual([]);
    expect(settingsChangesNeedingRestart('', JSON.stringify({ CLAUDE_MEM_PROVIDER: 'claude', CLAUDE_MEM_CLOUD_SYNC_DEVICE_NAME: '' }))).toEqual([]);
    expect(settingsChangesNeedingRestart(before, before)).toEqual([]);
  });
  it('turning cloud sync on (On The Go paid) needs a restart: the worker sets up sync only at boot', () => {
    const paid = JSON.stringify({ CLAUDE_MEM_WORKER_PORT: '37896', CLAUDE_MEM_CLOUD_SYNC_TOKEN: 't', CLAUDE_MEM_CLOUD_SYNC_USER_ID: 'u', CLAUDE_MEM_CLOUD_SYNC_HUB_URL: 'https://cmem.ai/api/sync' });
    expect(settingsChangesNeedingRestart(before, paid)).toEqual(['CLAUDE_MEM_CLOUD_SYNC_HUB_URL', 'CLAUDE_MEM_CLOUD_SYNC_TOKEN', 'CLAUDE_MEM_CLOUD_SYNC_USER_ID']);
  });
  it('any other setting the worker reads at boot needs a restart', () => {
    expect(settingsChangesNeedingRestart(before, JSON.stringify({ CLAUDE_MEM_WORKER_PORT: '37896', CLAUDE_MEM_RUNTIME: 'worker', CLAUDE_MEM_CHROMA_ENABLED: 'false' }))).toEqual(['CLAUDE_MEM_CHROMA_ENABLED']);
  });
});
