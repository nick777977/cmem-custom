import { expect, test } from 'bun:test';
import {
  chromeExecutablePath, compileBrowserFixture, connectToPage, failOnCiWithoutChrome,
  FIXTURE_PAGE_HTML, htmlResponse, launchChrome, scriptResponse, withTimeout,
} from '../../helpers/chrome-devtools';

failOnCiWithoutChrome('CI requires Chrome or Chromium for the local runtime status regression.');

(chromeExecutablePath ? test : test.skip)('shows degraded-worker profiles and rechecks Chroma independently', async () => {
  const bundle = compileBrowserFixture(`
    import React from 'react';
    import { createRoot } from 'react-dom/client';
    import { LocalRuntimeStatus } from './src/ui/viewer/components/LocalRuntimeStatus';
    createRoot(document.getElementById('root')).render(<LocalRuntimeStatus />);
  `);
  let probes = 0;
  const server = Bun.serve({ hostname: '127.0.0.1', port: 0, fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === '/fixture.js') return scriptResponse(bundle);
    if (url.pathname === '/api/health') return Response.json({ ai: { roles: {
      observer: { state: 'configured', profileId: 'observer-fixture', model: 'synthetic-model',
        auth: 'api-key', provider: 'openai-compatible', inherited: true, lastFailure: 'invalid_reply' },
      summary: { state: 'paused', issue: 'credential_unavailable', inherited: false },
      copy: { state: 'paused', issue: 'disabled', inherited: false },
    } } }, { status: 503 });
    if (url.pathname === '/api/chroma/status' && url.searchParams.get('deep') === 'true') {
      probes++;
      if (probes === 1) return Response.json({ status: 'unhealthy', localRuntime: 'setup-required' });
      if (probes === 2) return Response.json({ status: 'unhealthy', localRuntime: 'connected', connected: true,
        probe: { ok: false, stage: 'query', error: 'C:/synthetic-credentials/secret.json' } });
      return Response.json({ status: 'healthy', localRuntime: 'connected', connected: true, probe: { ok: true, stage: 'done' } });
    }
    return htmlResponse(FIXTURE_PAGE_HTML);
  } });
  const pageUrl = server.url.href;
  let chrome: ReturnType<typeof launchChrome> | undefined;
  let page: Awaited<ReturnType<typeof connectToPage>> | undefined;
  try {
    chrome = launchChrome(pageUrl, { remoteDebugging: true, extraFlags: ['--proxy-server=http://127.0.0.1:1'] });
    page = await withTimeout(connectToPage(chrome, pageUrl), 15000, 'Local runtime fixture did not load');
    const waitForStatus = async (text: string) => {
      for (const deadline = Date.now() + 8000; Date.now() < deadline;) {
        const status = await withTimeout(page!.evaluate(`(() => {
          const button = document.querySelector('.local-runtime-status button');
          return button && !button.disabled ? document.body.innerText : '';
        })()`), 2000, 'Runtime status evaluation timed out').catch(error => {
          if (!/context was destroyed|Cannot find context/.test(String(error))) throw error;
          return '';
        });
        if (status?.includes(text)) return status;
        await Bun.sleep(50);
      }
      throw new Error(`Local runtime fixture did not show ${text}`);
    };
    const missing = await waitForStatus('Setup required');
    expect(missing).toContain('observer-fixture · synthetic-model · openai-compatible · api-key');
    expect(missing).toContain('Inherits default · Configured · Last failure: invalid reply');
    expect(missing).toMatch(/Selected credential or endpoint binding unavailable\s*Role override/);
    expect(missing).toMatch(/Card copy\s*Off/);

    await page.evaluate('document.querySelector(".local-runtime-status button").click()');
    const failed = await waitForStatus('Semantic query failed');
    expect(failed).not.toContain('synthetic-credentials');
    expect(failed).not.toContain('probe passed');

    await page.evaluate('document.querySelector(".local-runtime-status button").click()');
    expect(await waitForStatus('Semantic search probe passed')).not.toContain('Setup required');
    expect(probes).toBe(3);
  } finally {
    page?.close();
    await chrome?.close();
    server.stop(true);
  }
}, 55000);
