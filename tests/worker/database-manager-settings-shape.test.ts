import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { Database } from 'bun:sqlite';
import { existsSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { DatabaseManager } from '../../src/services/worker/DatabaseManager.js';
import { DB_PATH, USER_SETTINGS_PATH } from '../../src/shared/paths.js';

/**
 * A settings.json the old viewer saved: claude-mem's keys live in the `env`
 * block of a wrapped document, and the viewer also wrote copies at the ROOT,
 * secrets as `****` masks and the sync fields blank. A fully configured
 * nested connection still has to be inert when the local worker opens it.
 */
function writeOldViewerSettings(): void {
  writeFileSync(USER_SETTINGS_PATH, JSON.stringify({
    theme: 'dark',
    CLAUDE_MEM_OPENROUTER_API_KEY: '****',
    CLAUDE_MEM_CLOUD_SYNC_TOKEN: '',
    CLAUDE_MEM_CLOUD_SYNC_USER_ID: '',
    CLAUDE_MEM_CLOUD_SYNC_HUB_URL: '',
    CLAUDE_MEM_CHROMA_ENABLED: 'false',
    env: {
      CLAUDE_MEM_OPENROUTER_API_KEY: 'synthetic-provider-key',
      CLAUDE_MEM_CLOUD_SYNC_TOKEN: 'synthetic-sync-token',
      CLAUDE_MEM_CLOUD_SYNC_USER_ID: 'user-1',
      CLAUDE_MEM_CLOUD_SYNC_HUB_URL: 'http://127.0.0.1:1',
      CLAUDE_MEM_CLOUD_SYNC_DEVICE_ID: '00000000-0000-4000-8000-000000000001',
      CLAUDE_MEM_CHROMA_ENABLED: 'false',
    },
  }), 'utf-8');
}

function removeDatabaseFiles(): void {
  for (const suffix of ['', '-wal', '-shm']) rmSync(`${DB_PATH}${suffix}`, { force: true });
}

describe('DatabaseManager local startup with legacy settings', () => {
  let savedSettings: string | null = null;
  let manager: DatabaseManager | null = null;

  beforeEach(() => {
    savedSettings = existsSync(USER_SETTINGS_PATH) ? readFileSync(USER_SETTINGS_PATH, 'utf-8') : null;
    removeDatabaseFiles();
  });

  afterEach(async () => {
    await manager?.close();
    manager = null;
    Bun.gc(true);
    removeDatabaseFiles();
    if (savedSettings === null) rmSync(USER_SETTINGS_PATH, { force: true });
    else writeFileSync(USER_SETTINGS_PATH, savedSettings, 'utf-8');
  });

  it('retains device identity and existing queues, and writes no new ops', async () => {
    writeOldViewerSettings();
    manager = new DatabaseManager();
    await manager.initialize();
    await manager.close();

    // An op queued while sync ran, not yet acknowledged by the hub.
    const db = new Database(DB_PATH);
    db.prepare('INSERT INTO sync_outbox (op_uuid, body, created_at_epoch) VALUES (?, ?, ?)')
      .run('legacy-mutation', JSON.stringify({ op: 'set_title' }), Date.now());
    db.prepare(`
      INSERT INTO sync_content_outbox
        (entity_id, kind, origin_local_id, entity_rev, body, operation_sha256, deleted, created_at_epoch)
      VALUES ('legacy-entity', 'observation', '42', '2', '{}', 'legacy-sha', 1, ?)
    `).run(Date.now());
    db.close(true);

    manager = new DatabaseManager();
    await manager.initialize();

    expect(manager.getLocalSyncDeviceId()).toBe('00000000-0000-4000-8000-000000000001');
    const store = manager.getSessionStore();
    const id = store.createSDKSession('local-session', 'local-project', 'local prompt', 'Local title');
    expect(store.getSessionById(id)?.custom_title).toBe('Local title');
    store.appendWorkStateEntry({ project: 'local-project', listName: 'tasks', fields: { task: 'verify' } });
    expect(store.getWorkStateEntries(['local-project'])).toHaveLength(1);
    expect(store.db.prepare('SELECT op_uuid FROM sync_outbox').all()).toEqual([{ op_uuid: 'legacy-mutation' }]);
    expect(store.db.prepare('SELECT entity_id, deleted FROM sync_content_outbox').all())
      .toEqual([{ entity_id: 'legacy-entity', deleted: 1 }]);
  });
  it('purges linked tool_uses past CLAUDE_MEM_TOOL_USES_RETENTION_DAYS at start, and keeps unlinked ones', async () => {
    writeFileSync(USER_SETTINGS_PATH, JSON.stringify({ CLAUDE_MEM_TOOL_USES_RETENTION_DAYS: '30' }), 'utf-8');
    manager = new DatabaseManager();
    await manager.initialize();
    await manager.close();

    const dayMs = 24 * 60 * 60 * 1000;
    const db = new Database(DB_PATH);
    const insert = db.prepare(
      `INSERT INTO tool_uses (tool_use_id, content_session_id, project, tool_name, observation_id, created_at, created_at_epoch)
       VALUES (?, 'content-session-a', 'claude-mem', 'Read', ?, ?, ?)`
    );
    const old = Date.now() - 90 * dayMs;
    const recent = Date.now() - dayMs;
    const insertObservation = db.prepare(
      "INSERT INTO observations (id, memory_session_id, project, type, created_at, created_at_epoch) VALUES (?, 'm', 'p', 'discovery', ?, ?)"
    );
    insertObservation.run(7, new Date(old).toISOString(), old);
    insertObservation.run(8, new Date(recent).toISOString(), recent);
    insert.run('old-linked', 7, new Date(old).toISOString(), old);
    insert.run('old-unlinked', null, new Date(old).toISOString(), old);
    insert.run('recent-linked', 8, new Date(recent).toISOString(), recent);
    db.close(true);

    manager = new DatabaseManager();
    await manager.initialize();

    const reopened = new Database(DB_PATH, { readonly: true });
    const ids = (reopened.prepare('SELECT tool_use_id FROM tool_uses ORDER BY id').all() as Array<{ tool_use_id: string }>)
      .map(row => row.tool_use_id);
    reopened.close(true);
    expect(ids).toEqual(['old-unlinked', 'recent-linked']);
  });

  it('keeps every tool_uses row when the retention setting is left at its default', async () => {
    writeFileSync(USER_SETTINGS_PATH, JSON.stringify({}), 'utf-8');
    manager = new DatabaseManager();
    await manager.initialize();
    await manager.close();

    const old = Date.now() - 400 * 24 * 60 * 60 * 1000;
    const db = new Database(DB_PATH);
    db.prepare(
      `INSERT INTO tool_uses (tool_use_id, content_session_id, project, tool_name, observation_id, created_at, created_at_epoch)
       VALUES ('old-linked', 'content-session-a', 'claude-mem', 'Read', 7, ?, ?)`
    ).run(new Date(old).toISOString(), old);
    db.close(true);

    manager = new DatabaseManager();
    await manager.initialize();

    const reopened = new Database(DB_PATH, { readonly: true });
    const { n } = reopened.prepare('SELECT COUNT(*) AS n FROM tool_uses').get() as { n: number };
    reopened.close(true);
    expect(n).toBe(1);
  });
  it('starts with an unquoted numeric CLAUDE_MEM_TOOL_USES_RETENTION_DAYS and applies it', async () => {
    writeFileSync(USER_SETTINGS_PATH, JSON.stringify({ CLAUDE_MEM_TOOL_USES_RETENTION_DAYS: 30 }), 'utf-8');
    manager = new DatabaseManager();
    await manager.initialize();
    await manager.close();

    const old = Date.now() - 90 * 24 * 60 * 60 * 1000;
    const db = new Database(DB_PATH);
    db.prepare("INSERT INTO observations (id, memory_session_id, project, type, created_at, created_at_epoch) VALUES (7, 'm', 'p', 'discovery', ?, ?)")
      .run(new Date(old).toISOString(), old);
    db.prepare(
      `INSERT INTO tool_uses (tool_use_id, content_session_id, project, tool_name, observation_id, created_at, created_at_epoch)
       VALUES ('old-linked', 'content-session-a', 'claude-mem', 'Read', 7, ?, ?)`
    ).run(new Date(old).toISOString(), old);
    db.close(true);

    manager = new DatabaseManager();
    await manager.initialize();

    const reopened = new Database(DB_PATH, { readonly: true });
    const { n } = reopened.prepare('SELECT COUNT(*) AS n FROM tool_uses').get() as { n: number };
    reopened.close(true);
    expect(n).toBe(0);
  });
});
