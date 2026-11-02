import { describe, expect, it, mock } from 'bun:test';
import { runBrowserSetup, shouldUseBrowserSetup, waitForBackgroundWorkToFinish } from '../../src/npx-cli/install/browser-setup.js';

it('cannot open or reopen checkout even with retained account callbacks', async () => {
  const transport = mock(async () => Response.json({ choice: { branch: 'go', memoryBilling: 'hosted' },
    checkout: { state: 'requested', requests: 2 }, alreadyPro: true }));
  const checkout = mock(async () => true), reopen = mock(() => {}), apply = mock(async () => 'go-awaiting-checkout' as const);
  const open = mock(() => {});
  await expect(runBrowserSetup({ workerBaseUrl: 'http://127.0.0.1:1', fetch: transport as typeof fetch,
    openBrowser: open, log: { info() {}, warn() {} }, applyChoice: apply,
    checkout: { run: checkout, reopen } })).rejects.toThrow('disabled');
  for (const callback of [transport, checkout, reopen, apply, open]) expect(callback).toHaveBeenCalledTimes(0);
});
