// Synthetic HTTP route fixture only: no worker/service process, credentials, transcript scan or agent.
import { mock } from 'bun:test';
import express from 'express';
import { Database } from 'bun:sqlite';
import { mkdirSync, mkdtempSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { WorkViewRoutes } from '../../src/services/worker/http/routes/WorkViewRoutes.js';
export async function hostedRoutes() {
  const root = resolve('.scratch/enterprise-local/hosted-03/fixtures'); mkdirSync(root, { recursive: true });
  const dir = mkdtempSync(join(root, 'routes-')), databasePath = join(dir, 'source.db');
  const db = new Database(databasePath);
  db.exec('CREATE TABLE work_state_entries (id INTEGER PRIMARY KEY, project TEXT, list_name TEXT, fields TEXT, created_at_epoch INTEGER)');
  db.query('INSERT INTO work_state_entries VALUES (1,?,?,?,?)').run('synthetic-project', 'synthetic-work', JSON.stringify({
    task: 'Local task', status: 'done', request_id: 'local', human_request: 'Synthetic local request', request_complete: true,
  }), 1_700_000_000_000);
  const forbidden = mock(() => { throw Error('Forbidden setup client called'); });
  const routes = new WorkViewRoutes({ databasePath, reviewPath: ':memory:', ledgerDir: null, humanCopy: null, autoRefresh: null,
    setupStatePath: join(dir, 'setup-state.json'), settingsPath: join(dir, 'settings.json'),
    setupScan: { start: forbidden, state: forbidden, setExtractor: forbidden, subscribe: forbidden } as never,
    hostedIntent: { run: forbidden, state: forbidden } as never,
    historyImport: { start: forbidden, state: forbidden, subscribe: forbidden } as never });
  const app = express(); app.use(express.json()); routes.setupRoutes(app);
  const server = app.listen(0, '127.0.0.1'); await new Promise<void>(resolve => server.once('listening', resolve));
  const address = server.address(); if (!address || typeof address === 'string') throw Error('No fixture port');
  const origin = 'http://127.0.0.1:'+address.port;
  const original = globalThis.fetch;
  const remote = mock(() => { throw Error('Forbidden outbound fetch'); });
  // Every fetch in this fixture goes through this tripwire; only its exact loopback origin is permitted.
  const transport = mock((input: any, init?: RequestInit) => {
    if (new URL(String(input)).origin !== origin) return remote();
    return original(input, init);
  });
  globalThis.fetch = transport as typeof fetch;
  return { dir, origin, forbidden, remote, transport,
    get: (path: string) => fetch(origin+path),
    post: (path: string, body: unknown = {}, extra = {}) => fetch(origin+path, { method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: origin, Authorization: 'Bearer synthetic-old-token', ...extra }, body: JSON.stringify(body) }),
    async close() { globalThis.fetch = original; routes.close(); db.close(); await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve())); },
  };
}
