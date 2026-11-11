import { describe, expect, it } from 'bun:test';
import { Database } from 'bun:sqlite';
import { mkdtempSync, renameSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { SessionStore } from '../../../src/services/sqlite/SessionStore.js';
import { SessionSearch } from '../../../src/services/sqlite/SessionSearch.js';
import { LATEST_SCHEMA_VERSION, openGuardedSqliteDatabase, SchemaNewerThanBinaryError } from '../../../src/services/sqlite/connection.js';

describe('deterministic SQLite ownership', () => {
  for (const kind of ['store', 'search'] as const) {
    it(`${kind} close finalizes live statements and releases the file before GC`, () => {
      const dir = mkdtempSync(join(tmpdir(), 'sqlite-owned-close-'));
      const path = join(dir, 'memory.db');
      try {
        const store = new SessionStore(path);
        const owner = kind === 'store' ? store : new SessionSearch(store.db);
        const statement = store.db.prepare('SELECT 42 AS answer');
        expect(statement.get()).toEqual({ answer: 42 });
        owner.close();
        expect(statement.isFinalized).toBe(true);
        expect(() => statement.get()).toThrow();
        // Existing explicit close semantics also permit closing shared owners twice.
        store.close();
        renameSync(path, join(dir, 'released.db'));
      } finally { rmSync(dir, { recursive: true, force: true }); }
    });
  }

  for (const open of [(path: string) => new SessionStore(path), (path: string) => new SessionSearch(path), openGuardedSqliteDatabase]) {
    it(`${open.toString().slice(0, 65)} releases its own refused open`, () => {
      const dir = mkdtempSync(join(tmpdir(), 'sqlite-refused-close-'));
      const path = join(dir, 'memory.db');
      try {
        const raw = new Database(path);
        raw.run(`PRAGMA user_version = ${LATEST_SCHEMA_VERSION + 1}`);
        raw.close(true);
        expect(() => open(path)).toThrow(SchemaNewerThanBinaryError);
        renameSync(path, join(dir, 'refused.db'));
      } finally { rmSync(dir, { recursive: true, force: true }); }
    });
  }

  for (const Type of [SessionStore, SessionSearch]) {
    it(`${Type.name} leaves an injected connection with its caller on refusal`, () => {
      const raw = new Database(':memory:');
      try {
        raw.run(`PRAGMA user_version = ${LATEST_SCHEMA_VERSION + 1}`);
        expect(() => new Type(raw)).toThrow(SchemaNewerThanBinaryError);
        expect(raw.query('PRAGMA user_version').get()).toEqual({ user_version: LATEST_SCHEMA_VERSION + 1 });
      } finally { raw.close(true); }
    });
  }
});
