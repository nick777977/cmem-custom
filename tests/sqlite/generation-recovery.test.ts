import { expect, test } from 'bun:test';
import { Database } from 'bun:sqlite';
import { SessionStore } from '../../src/services/sqlite/SessionStore.js';
import { GenerationRecovery } from '../../src/services/sqlite/GenerationRecovery.js';

test('the spool receipt survives a redrain, while later identical summaries still queue', () => {
  using db = new Database(':memory:');
  const store = new SessionStore(db);
  const sessionId = store.createSDKSession('synthetic', 'project', 'prompt');
  const journal = new GenerationRecovery(db);
  const message = { type: 'summarize', last_assistant_message: 'Done.' } as const;
  const id = journal.accept(sessionId, message, 10, 'same-spool-name');
  expect(id).toBeGreaterThan(0);
  expect(journal.accept(sessionId, message, 10, 'same-spool-name')).toBe(0);
  expect(journal.accept(sessionId, message, 11, 'same-spool-name')).toBeGreaterThan(id);
});

test('a summary and its completion receipt roll back together', () => {
  using db = new Database(':memory:');
  const store = new SessionStore(db);
  const sessionId = store.createSDKSession('synthetic', 'project', 'prompt');
  const memoryId = store.ensureMemorySessionIdRegistered(sessionId, 'memory', 37777)!;
  const journal = new GenerationRecovery(db);
  const id = journal.accept(sessionId, { type: 'summarize' }, 10, 'summary');
  journal.markDispatch([id]);
  const save = () => store.storeObservations(memoryId, 'project', [], {
    request: 'request', investigated: 'investigated', learned: 'learned',
    completed: 'completed', next_steps: 'next', notes: null,
  }, 1, 0, 10, 'fixture-model', { generationIds: [id] });
  db.exec(`CREATE TRIGGER fail_completion BEFORE UPDATE OF state ON generation_recovery
    WHEN NEW.state = 'completed' BEGIN SELECT RAISE(ABORT, 'synthetic failure'); END`);
  expect(save).toThrow('synthetic failure');
  expect(db.query('SELECT id FROM session_summaries').all()).toHaveLength(0);
  expect(journal.get(id)?.state).toBe('outcome_unknown');
  db.exec('DROP TRIGGER fail_completion');
  expect(save().summaryId).not.toBeNull();
  expect(journal.get(id)).toBeNull();
  expect(journal.list()).toEqual([]);
  expect(journal.accept(sessionId, { type: 'summarize' }, 10, 'summary')).toBe(0);
  expect(save).toThrow('already completed');
  expect(db.query('SELECT id FROM session_summaries').all()).toHaveLength(1);
});
