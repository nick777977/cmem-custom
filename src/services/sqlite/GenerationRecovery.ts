import type { Database } from 'bun:sqlite';
import type { PendingMessage, PendingMessageWithId } from '../worker-types.js';

type RecoveryState = 'undispatched' | 'outcome_unknown';

export interface RecoveryItem {
  id: number;
  sessionDbId: number;
  type: PendingMessage['type'];
  enqueuedAt: number;
  state: RecoveryState;
  version: number;
}

const columns = `id, session_db_id AS sessionDbId, type, enqueued_at AS enqueuedAt, state, version`;

/** Durable handoff receipts for the explicit-profile worker. The live queue stays in RAM. */
export class GenerationRecovery {
  constructor(private readonly db: Database) {
    db.exec(`
      CREATE TABLE IF NOT EXISTS generation_recovery (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_db_id INTEGER NOT NULL REFERENCES sdk_sessions(id) ON DELETE CASCADE,
        type TEXT NOT NULL,
        enqueued_at INTEGER NOT NULL,
        state TEXT NOT NULL CHECK (state IN ('undispatched', 'outcome_unknown', 'completed')),
        version INTEGER NOT NULL DEFAULT 0,
        payload TEXT,
        spool_key TEXT,
        tool_use_id TEXT,
        UNIQUE (session_db_id, spool_key, enqueued_at),
        UNIQUE (session_db_id, tool_use_id)
      );
      CREATE INDEX IF NOT EXISTS idx_generation_recovery_pending
        ON generation_recovery(id) WHERE state != 'completed';
    `);
  }

  accept(sessionDbId: number, message: PendingMessage, enqueuedAt: number, spoolKey?: string): number {
    // A spool filename can be reused for a later hook with identical content.
    // The file's original enqueue timestamp stays stable until it is removed.
    const row = this.db.query(`
      INSERT INTO generation_recovery (session_db_id, type, enqueued_at, state, payload, spool_key, tool_use_id)
      VALUES (?, ?, ?, 'undispatched', ?, ?, ?) ON CONFLICT DO NOTHING RETURNING id
    `).get(sessionDbId, message.type, enqueuedAt, JSON.stringify(message), spoolKey ?? null, message.toolUseId || null) as
      { id: number } | null;
    return row?.id ?? 0;
  }

  list(): RecoveryItem[] {
    return this.db.query(`
      SELECT ${columns} FROM generation_recovery WHERE state != 'completed' ORDER BY id
    `).all() as RecoveryItem[];
  }

  get(id: number): (RecoveryItem & { message: PendingMessage }) | null {
    const row = this.db.query(`
      SELECT ${columns}, payload FROM generation_recovery WHERE id = ? AND state != 'completed'
    `).get(id) as (RecoveryItem & { payload: string }) | null;
    if (!row) return null;
    const { payload, ...item } = row;
    return { ...item, message: JSON.parse(payload) as PendingMessage };
  }

  authorize(id: number, version: number): boolean {
    // Consume this operator action once, even if another restart occurs before dispatch.
    return this.db.query(`
      UPDATE generation_recovery SET version = version + 1
      WHERE id = ? AND version = ? AND state != 'completed'
    `).run(id, version).changes === 1;
  }

  markDispatch(ids: number[]): void {
    const update = this.db.query("UPDATE generation_recovery SET state = 'outcome_unknown', version = version + 1 WHERE id = ? AND state != 'completed'");
    this.db.transaction(() => {
      for (const id of ids) {
        if (update.run(id).changes !== 1) throw new Error('Generation recovery receipt missing at dispatch');
      }
    })();
  }
}

/** Call inside the SQLite result transaction. Keep only receipt metadata for dedup. */
export function completeGeneration(db: Database, ids: readonly number[]): number {
  if (ids.length === 0) return 0;
  const complete = db.query("UPDATE generation_recovery SET state = 'completed', payload = NULL WHERE id = ? AND state != 'completed'");
  let count = 0;
  for (const id of ids) count += complete.run(id).changes;
  return count;
}

export function generationIds(messages: PendingMessageWithId[]): number[] {
  return messages.flatMap(message => message._generationId === undefined ? [] : [message._generationId]);
}
