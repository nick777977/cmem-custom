import { expect, it, spyOn } from 'bun:test';
import { telemetryBuffer } from '../../src/services/telemetry/buffer';
import { captureEvent, shutdownTelemetry } from '../../src/services/telemetry/telemetry';
it('shutdown never drains, flushes or starts a client, including late and repeated calls', async () => {
  const flush = spyOn(telemetryBuffer, 'flush').mockImplementation(() => { throw Error('no flush'); });
  const drain = spyOn(telemetryBuffer, 'drainAllSessions').mockImplementation(() => { throw Error('no drain'); });
  try {
    telemetryBuffer.record('session_compressed', 1, { outcome: 'error' });
    await Promise.all([shutdownTelemetry(), shutdownTelemetry()]);
    captureEvent('worker_stopped'); await shutdownTelemetry();
    expect(flush).not.toHaveBeenCalled(); expect(drain).not.toHaveBeenCalled();
  } finally { flush.mockRestore(); drain.mockRestore(); }
});
