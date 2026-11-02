import { expect, it } from 'bun:test';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { hostedRoutes } from '../../../fixtures/hosted-03-routes.js';
import { defaultAutoRefresh } from '../../../../src/services/worker/http/routes/WorkViewRoutes.js';
it('old choices, paid checkout and tokens cannot restart hosted setup or history upload', async () => {
  const f = await hostedRoutes();
  const saved = JSON.stringify({ status: 'pending', choice: { branch: 'go', memoryBilling: 'hosted' }, checkout: { state: 'paid' } });
  const statePath = join(f.dir, 'setup-state.json'); writeFileSync(statePath, saved);
  try {
    expect((await f.get('/api/setup/state')).status).toBe(410);
    for (const path of ['choice', 'installer', 'checkout', 'import', 'complete', 'unknown', '']) {
      expect((await f.post('/api/setup/'+path, { token: 'synthetic', branch: 'go' })).status).toBe(410);
    }
    expect(readFileSync(statePath, 'utf8')).toBe(saved);
    expect(f.forbidden).toHaveBeenCalledTimes(0); expect(f.remote).toHaveBeenCalledTimes(0);
  } finally { await f.close(); }
});
it('local refresh ignores stale or corrupt hosted markers but respects its local off switch', async () => {
  const f = await hostedRoutes(), settings = join(f.dir, 'settings.json'), state = join(f.dir, 'setup-state.json');
  writeFileSync(state, '{synthetic corrupt marker}'); writeFileSync(join(f.dir, 'setup-session.json'), JSON.stringify({ pid: process.pid }));
  let setupReads = 0;
  const refresh = defaultAutoRefresh(f.dir, settings, state, () => { setupReads++; return true; }, () => '', () => ({ placed: 0, focusAreaIds: [] }));
  try {
    const enabled = () => (refresh as unknown as { enabled: () => boolean }).enabled();
    writeFileSync(settings, JSON.stringify({ CLAUDE_MEM_WORK_VIEW_AUTO_REFRESH: 'true' })); expect(enabled()).toBe(true);
    writeFileSync(settings, JSON.stringify({ CLAUDE_MEM_WORK_VIEW_AUTO_REFRESH: 'false' })); expect(enabled()).toBe(false);
    expect(setupReads).toBe(0); expect(f.remote).toHaveBeenCalledTimes(0);
  } finally { refresh.close(); await f.close(); }
});
it('retired setup paths retain the local host boundary', async () => {
  const f = await hostedRoutes();
  try { expect((await f.post('/api/setup/import', {}, { Host: 'foreign.invalid' })).status).toBe(403);
    expect(f.forbidden).toHaveBeenCalledTimes(0); expect(f.remote).toHaveBeenCalledTimes(0);
  } finally { await f.close(); }
});
