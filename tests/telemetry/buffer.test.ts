import { expect, it, spyOn } from 'bun:test';
import { telemetryBuffer as buffer } from '../../src/services/telemetry/buffer';
import * as telemetry from '../../src/services/telemetry/telemetry';
it('session, context and work-state callers retain no buckets or flush jobs', () => {
  const dispatch = spyOn(telemetry, 'captureEvent');
  const interval = spyOn(globalThis, 'setInterval');
  try {
    buffer.start(1); buffer.start();
    for (let id = 0; id < 1200; id++) {
      buffer.record('session_compressed', id, { tokens_input: 5, outcome: 'error' });
      buffer.record('context_injected', null, { outcome: 'ok' });
      buffer.record('work_state_usage', null, { captured_tool_count: 1 });
    }
    expect(buffer.__activeSessionBucketCount()).toBe(0);
    expect(buffer.flushSession(1, 'session_end')).toBe(false);
    buffer.safetyFlush(); buffer.flush(); buffer.drainAllSessions('worker_shutdown');
    buffer.stop(); buffer.__resetForTests();
    expect(interval).not.toHaveBeenCalled(); expect(dispatch).not.toHaveBeenCalled();
  } finally { interval.mockRestore(); dispatch.mockRestore(); }
});
