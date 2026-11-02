import { afterEach, expect, it, mock, spyOn } from 'bun:test';
import { Database } from 'bun:sqlite';
import { HistoryImport, readHistoryCounts } from '../../../src/services/setup/history-import.js';
afterEach(() => mock.restore());
for (const savedToken of [null, 'synthetic-old-token']) it('cannot upload history, including with saved token '+savedToken, async () => {
  const token = mock(() => savedToken), access = mock(() => { throw Error('Forbidden database or origin access'); });
  const remote = mock(async () => Response.json({}));
  const globalTransport = spyOn(globalThis, 'fetch').mockImplementation(remote as typeof fetch);
  const client = new HistoryImport({ token, origin: access, openDatabase: access, fetch: remote as typeof fetch });
  expect(() => client.start()).toThrow('disabled');
  expect(await client.finished()).toMatchObject({ state: 'failed', sent: 0, imported: 0 });
  for (const callback of [token, access, remote, globalTransport]) expect(callback).toHaveBeenCalledTimes(0);
});
it('keeps local own-history counts without changing stored observations', () => {
  const db = new Database(':memory:');
  try {
    db.exec("CREATE TABLE observations (project TEXT, memory_session_id TEXT, origin_device_id TEXT); INSERT INTO observations VALUES ('one','s1',NULL),('two','s2',NULL),('two','s2','other-device')");
    expect(readHistoryCounts(db)).toEqual({ projects: 2, sessions: 2, observations: 2 });
    expect(db.query('SELECT COUNT(*) AS count FROM observations').get()).toEqual({ count: 3 });
  } finally { db.close(); }
});
