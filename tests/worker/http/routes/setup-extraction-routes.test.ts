import { expect, it } from 'bun:test';
import { hostedRoutes } from '../../../fixtures/hosted-03-routes.js';
it('keeps local work readable and reviews durable while hosted extraction is unreachable', async () => {
  const f = await hostedRoutes();
  try {
    const view = await (await f.get('/api/work-view')).json() as any;
    expect(view.source.connected).toBe(true); expect(view.setup.scan).toBe(null);
    const item = view.humanRequests[0]; expect(view.humanRequests).toHaveLength(1);
    expect(item.lifecycle.complete).toBe(true);
    expect((await f.post('/api/setup/scan')).status).toBe(410);
    expect((await f.post('/api/work-view/review', { requestId: item.id, expectedFingerprint: item.contentFingerprint, checked: true })).status).toBe(200);
    const after = await (await f.get('/api/work-view')).json() as any;
    expect(after.humanRequests[0].review.checked).toBe(true);
    expect(after.humanRequests[0].contentFingerprint).toBe(item.contentFingerprint);
    expect(f.forbidden).toHaveBeenCalledTimes(0); expect(f.remote).toHaveBeenCalledTimes(0);
  } finally { await f.close(); }
});
