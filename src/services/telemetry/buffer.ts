/**
 * Compatibility facade for existing memory/session callers. Telemetry buffering
 * is removed: no retained payloads, rollups, timers, dispatch or shutdown flush.
 */
export type RollupReason = 'session_end' | 'worker_shutdown' | 'safety_flush';
export const telemetryBuffer = {
  record(_event: 'session_compressed' | 'context_injected' | 'work_state_usage',
    _sessionDbId: number | null, _props: Record<string, unknown>): void {},
  flushSession(_sessionDbId: number, _reason: RollupReason): boolean { return false; },
  drainAllSessions(_reason: RollupReason): void {},
  safetyFlush(): void {},
  flush(): void {},
  start(_intervalMs?: number): void {},
  stop(): void {},
  __resetForTests(): void {},
  __activeSessionBucketCount(): number { return 0; },
};
