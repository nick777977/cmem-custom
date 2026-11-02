import { expect, it } from 'bun:test';
import { hostedRoutes } from '../../../fixtures/hosted-03-routes.js';
it('retires scan, retry and preferences without touching the scanner, extractor or transport', async () => {
  const f = await hostedRoutes();
  try {
    expect((await f.get('/api/setup/scan')).status).toBe(410);
    for (const body of [{}, { improveProduct: true }, { improveProduct: false }]) expect((await f.post('/api/setup/scan', body)).status).toBe(410);
    expect((await f.post('/api/setup/scan/preferences', { improveProduct: true })).status).toBe(410);
    expect(f.forbidden).toHaveBeenCalledTimes(0); expect(f.remote).toHaveBeenCalledTimes(0);
  } finally { await f.close(); }
});
