import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from 'bun:test';
import { Database } from 'bun:sqlite';
import type { Request, Response } from 'express';
import { SessionStore } from '../../../../src/services/sqlite/SessionStore.js';
import { DataRoutes } from '../../../../src/services/worker/http/routes/DataRoutes.js';
import { logger } from '../../../../src/utils/logger.js';

describe('DataRoutes local delete APIs', () => {
  let db: Database;
  let store: SessionStore;
  let handlers: Map<string, (req: Request, res: Response) => void>;
  let broadcasts: Array<Record<string, unknown>>;
  // Stands in for the worker's ChromaSync; null means "Chroma not configured".
  let chromaSync: { deleteRowDocuments: (docType: string, sqliteId: number) => Promise<number> } | null;
  let chromaCalls: Array<{ docType: string; sqliteId: number }>;

  beforeEach(() => {
    db = new Database(':memory:');
    store = new SessionStore(db);

    db.prepare(`
      INSERT INTO sdk_sessions
        (content_session_id, memory_session_id, project, started_at, started_at_epoch, status)
      VALUES ('content-delete', 'memory-delete', 'project-delete',
              '2026-07-20T00:00:00.000Z', 1752969600000, 'completed')
    `).run();
    db.prepare(`
      INSERT INTO observations
        (memory_session_id, project, type, title, created_at, created_at_epoch)
      VALUES ('memory-delete', 'project-delete', 'discovery', 'delete me',
              '2026-07-20T00:00:00.000Z', 1752969600000)
    `).run();
    db.prepare(`
      INSERT INTO session_summaries
        (memory_session_id, project, request, created_at, created_at_epoch)
      VALUES ('memory-delete', 'project-delete', 'delete summary',
              '2026-07-20T00:00:00.000Z', 1752969600000)
    `).run();
    db.prepare(`
      INSERT INTO user_prompts
        (session_db_id, content_session_id, prompt_number, prompt_text, created_at, created_at_epoch)
      VALUES (1, 'content-delete', 1, 'delete prompt',
              '2026-07-20T00:00:00.000Z', 1752969600000)
    `).run();

    broadcasts = [];
    chromaCalls = [];
    chromaSync = {
      deleteRowDocuments: mock((docType: string, sqliteId: number) => {
        chromaCalls.push({ docType, sqliteId });
        return Promise.resolve(1);
      }),
    };
    const routes = new DataRoutes(
      {} as any,
      { getSessionStore: () => store, getChromaSync: () => chromaSync } as any,
      { getSession: () => undefined } as any,
      { broadcast: (event: Record<string, unknown>) => { broadcasts.push(event); } } as any,
      {} as any,
      Date.now(),
    );
    handlers = new Map();
    routes.setupRoutes({
      get: mock(() => {}),
      post: mock(() => {}),
      delete: mock((path: string, handler: (req: Request, res: Response) => void) => {
        handlers.set(path, handler);
      }),
    } as any);
  });

  afterEach(() => {
    db.close();
  });

  it('deletes local observations, summaries, and prompts without queuing tombstones', () => {
    const cases = [
      ['/api/observation/:id', 'observation', 'observations'],
      ['/api/summary/:id', 'summary', 'session_summaries'],
      ['/api/prompt/:id', 'prompt', 'user_prompts'],
    ] as const;

    for (const [path, kind, table] of cases) {
      let status = 200;
      let responseBody: any;
      const response = {
        status(code: number) { status = code; return this; },
        json(value: unknown) { responseBody = value; return this; },
      } as unknown as Response;
      handlers.get(path)!({ params: { id: '1' }, path } as unknown as Request, response);

      expect(status).toBe(200);
      expect(responseBody).toMatchObject({ success: true, id: '1', kind, entity_rev: null });
      expect(db.prepare(`SELECT COUNT(*) AS n FROM ${table}`).get()).toEqual({ n: 0 });
    }

    expect(db.prepare('SELECT id FROM sync_content_outbox').all()).toEqual([]);
    // Open viewer tabs are told after each committed delete.
    expect(broadcasts).toEqual([
      { type: 'item_deleted', itemType: 'observation', id: 1 },
      { type: 'item_deleted', itemType: 'summary', id: 1 },
      { type: 'item_deleted', itemType: 'prompt', id: 1 },
    ]);
  });

  it('broadcasts nothing when the delete is refused', () => {
    const call = (path: string, id: string) => {
      let status = 200;
      const response = {
        status(code: number) { status = code; return this; },
        json() { return this; },
      } as unknown as Response;
      handlers.get(path)!({ params: { id }, path } as unknown as Request, response);
      return status;
    };

    // A row synced from another device is not deletable here.
    db.prepare(`UPDATE observations SET origin_device_id = 'other-device' WHERE id = 1`).run();
    expect(call('/api/observation/:id', '1')).toBe(404);
    expect(call('/api/summary/:id', '999')).toBe(404);
    expect(broadcasts).toEqual([]);
  });

  it('deletes the removed row\'s fragments from Chroma, scoped by doc_type', () => {
    // Observation and summary id spaces overlap, so the cleanup must be
    // scoped per doc_type, not by sqlite_id alone.
    const cases = [
      ['/api/observation/:id', 'observation'],
      ['/api/summary/:id', 'session_summary'],
      ['/api/prompt/:id', 'user_prompt'],
    ] as const;

    for (const [path, docType] of cases) {
      let status = 200;
      let responseBody: any;
      const response = {
        status(code: number) { status = code; return this; },
        json(value: unknown) { responseBody = value; return this; },
      } as unknown as Response;
      handlers.get(path)!({ params: { id: '1' }, path } as unknown as Request, response);

      expect(status).toBe(200);
      expect(responseBody).toMatchObject({ success: true, id: '1' });
    }

    expect(chromaCalls).toEqual([
      { docType: 'observation', sqliteId: 1 },
      { docType: 'session_summary', sqliteId: 1 },
      { docType: 'user_prompt', sqliteId: 1 },
    ]);
  });

  it('still deletes the row when Chroma is not configured', () => {
    chromaSync = null;
    let status = 200;
    let responseBody: any;
    const response = {
      status(code: number) { status = code; return this; },
      json(value: unknown) { responseBody = value; return this; },
    } as unknown as Response;

    handlers.get('/api/observation/:id')!({ params: { id: '1' }, path: '/api/observation/:id' } as unknown as Request, response);

    expect(status).toBe(200);
    expect(responseBody).toMatchObject({ success: true, id: '1', kind: 'observation' });
    expect(db.prepare('SELECT COUNT(*) AS n FROM observations').get()).toEqual({ n: 0 });
    expect(chromaCalls).toEqual([]);
  });

  it('keeps the delete successful when the Chroma cleanup fails', async () => {
    chromaSync = { deleteRowDocuments: mock(() => Promise.reject(new Error('chroma down'))) };
    const warn = spyOn(logger, 'warn').mockImplementation(() => {});
    let status = 200;
    let responseBody: any;
    const response = {
      status(code: number) { status = code; return this; },
      json(value: unknown) { responseBody = value; return this; },
    } as unknown as Response;

    handlers.get('/api/observation/:id')!({ params: { id: '1' }, path: '/api/observation/:id' } as unknown as Request, response);

    expect(status).toBe(200);
    expect(responseBody).toMatchObject({ success: true, id: '1', kind: 'observation' });
    expect(db.prepare('SELECT COUNT(*) AS n FROM observations').get()).toEqual({ n: 0 });

    // The failure is swallowed into a warning, asynchronously.
    await new Promise(resolve => setImmediate(resolve));
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  function deleteSession(): { status: number; body: any } {
    let status = 200;
    let body: any;
    const response = {
      status(code: number) { status = code; return this; },
      json(value: unknown) { body = value; return this; },
    } as unknown as Response;
    handlers.get('/api/sessions/:platformSource/:contentSessionId')!(
      { params: { platformSource: 'claude', contentSessionId: 'content-delete' } } as unknown as Request,
      response,
    );
    return { status, body };
  }

  it('deletes every child row\'s Chroma fragments when a session is deleted', async () => {
    const { status, body } = deleteSession();

    expect(status).toBe(200);
    expect(body).toMatchObject({ success: true, deletedCounts: { observations: 1, summaries: 1, prompts: 1 } });

    // Cleanup runs in the background, one row at a time.
    for (let i = 0; i < 5; i++) await new Promise(resolve => setImmediate(resolve));
    expect(chromaCalls).toEqual([
      { docType: 'observation', sqliteId: 1 },
      { docType: 'session_summary', sqliteId: 1 },
      { docType: 'user_prompt', sqliteId: 1 },
    ]);
  });

  it('keeps the session delete successful and cleans the remaining rows when a Chroma cleanup fails', async () => {
    const attempted: string[] = [];
    chromaSync = {
      deleteRowDocuments: mock((docType: string) => {
        attempted.push(docType);
        return docType === 'observation' ? Promise.reject(new Error('chroma down')) : Promise.resolve(1);
      }),
    };
    const warn = spyOn(logger, 'warn').mockImplementation(() => {});

    const { status, body } = deleteSession();

    expect(status).toBe(200);
    expect(body).toMatchObject({ success: true });
    expect(db.prepare('SELECT COUNT(*) AS n FROM sdk_sessions').get()).toEqual({ n: 0 });

    for (let i = 0; i < 5; i++) await new Promise(resolve => setImmediate(resolve));
    expect(attempted).toEqual(['observation', 'session_summary', 'user_prompt']);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});
