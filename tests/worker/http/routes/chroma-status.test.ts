import express from 'express';
import { afterEach, expect, mock, spyOn, test } from 'bun:test';
import { ChromaMcpManager } from '../../../../src/services/sync/ChromaMcpManager';
import { ChromaRoutes } from '../../../../src/services/worker/http/routes/ChromaRoutes';
import { SettingsDefaultsManager } from '../../../../src/shared/SettingsDefaultsManager';

afterEach(() => mock.restore());

async function readStatus(query = '') {
  const app = express();
  new ChromaRoutes().setupRoutes(app);
  const server = app.listen(0, '127.0.0.1');
  await new Promise<void>(resolve => server.once('listening', resolve));
  try {
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('Missing test address');
    const response = await fetch(`http://127.0.0.1:${address.port}/api/chroma/status${query}`, { signal: AbortSignal.timeout(5000) });
    expect(response.status).toBe(200);
    return await response.json();
  } finally {
    server.closeAllConnections();
    await new Promise<void>(resolve => server.close(() => resolve()));
  }
}

test('setup failure keeps the safe diagnostic and skips a second connection attempt', async () => {
  spyOn(SettingsDefaultsManager, 'loadFromFile').mockReturnValue(SettingsDefaultsManager.getAllDefaults());
  const probeSemanticSearch = mock();
  spyOn(ChromaMcpManager, 'getInstance').mockReturnValue({
    isHealthy: async () => false,
    getCrashState: () => ({ localRuntime: 'setup-required', setupError: 'Missing local tokenizer.json' }),
    probeSemanticSearch,
  } as unknown as ChromaMcpManager);

  expect(await readStatus('?deep=true')).toMatchObject({
    status: 'unhealthy', connected: false, deep: true, localRuntime: 'setup-required',
    details: 'Missing local tokenizer.json', probe: { ok: false, stage: 'connect' },
  });
  expect(probeSemanticSearch).not.toHaveBeenCalled();
});

test('deep status distinguishes a tool connection from a semantic query and omits raw errors', async () => {
  spyOn(SettingsDefaultsManager, 'loadFromFile').mockReturnValue(SettingsDefaultsManager.getAllDefaults());
  const probeSemanticSearch = mock(async () => ({
    ok: false, stage: 'query', collections: 2, queryLatencyMs: 12, error: 'C:/synthetic-auth/.credentials.json',
  }));
  spyOn(ChromaMcpManager, 'getInstance').mockReturnValue({
    isHealthy: async () => true,
    getCrashState: () => ({ localRuntime: 'connected' }),
    probeSemanticSearch,
  } as unknown as ChromaMcpManager);

  expect(await readStatus()).toMatchObject({ status: 'healthy', connected: true, deep: false });
  expect(probeSemanticSearch).not.toHaveBeenCalled();
  const status = await readStatus('?deep=true');
  expect(status).toMatchObject({ status: 'unhealthy', connected: true, deep: true, localRuntime: 'connected' });
  expect(status.probe).toEqual({ ok: false, stage: 'query', collections: 2, queryLatencyMs: 12 });
  expect(JSON.stringify(status)).not.toContain('synthetic-auth');
});
