import type { Database } from 'bun:sqlite';

export interface SetupHistoryCounts { projects: number; sessions: number; observations: number }

export interface HistoryImportState {
  state: 'idle' | 'running' | 'done' | 'failed';
  total: number;
  sent: number;
  /** Observations cmem.ai wrote (new to the account). */
  imported: number;
  /** Observations cmem.ai already had, or could not read. */
  skipped: number;
  percent: number;
  error: string | null;
  startedAt: string | null;
  finishedAt: string | null;
}

/** Observations this machine wrote itself (not ones synced in from another device). */
const OWN_OBSERVATIONS = 'FROM observations WHERE origin_device_id IS NULL';

export function readHistoryCounts(database: Database): SetupHistoryCounts {
  const row = database.prepare(`SELECT COUNT(*) AS observations, COUNT(DISTINCT project) AS projects, COUNT(DISTINCT memory_session_id) AS sessions ${OWN_OBSERVATIONS}`)
    .get() as { observations: number; projects: number; sessions: number };
  return { projects: row.projects, sessions: row.sessions, observations: row.observations };
}

export interface HistoryImportOptions {
  openDatabase: () => Database;
  /** e.g. https://cmem.ai */
  origin: () => string;
  /** The installer's setup token (CLAUDE_MEM_CLOUD_SYNC_TOKEN); null when this machine has no CMEM Pro connection. */
  token: () => string | null;
  fetch?: typeof fetch;
  now?: () => number;
}

/** Inert compatibility boundary: old tokens cannot authorize history upload. */
export class HistoryImport {
  constructor(_options: HistoryImportOptions) {}
  state(): HistoryImportState {
    return { state: 'failed', total: 0, sent: 0, imported: 0, skipped: 0, percent: 0,
      error: 'Hosted history upload is disabled in this local fork.', startedAt: null, finishedAt: null };
  }
  subscribe(_listener: (state: HistoryImportState) => void): () => void { return () => {}; }
  start(): HistoryImportState { throw new Error(this.state().error!); }
  async finished(): Promise<HistoryImportState> { return this.state(); }
}
