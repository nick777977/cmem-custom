import { describe, expect, it } from 'bun:test';
import { startCommandWantsDaemon, runServerServiceCli, runServerGenerationWorker } from '../../src/server/runtime/ServerService.js';

describe('retired standalone launch', () => {
  it('rejects server CLI launch before creating its runtime graph', async () => {
    await expect(runServerServiceCli(['start', '--daemon'])).rejects.toThrow('LOCAL_WORKER_ONLY');
  });
  it('rejects the independent BullMQ generation entrypoint', async () => {
    await expect(runServerGenerationWorker()).rejects.toThrow('LOCAL_WORKER_ONLY');
  });
});

// #2444 — `start` must be FOREGROUND by default (usable under systemd
// Type=simple) and detach only when `--daemon` is explicitly passed.
describe('server CLI start mode (#2444)', () => {
  it('runs in the foreground by default (no flags)', () => {
    expect(startCommandWantsDaemon([])).toBe(false);
  });

  it('detaches into a daemon only when --daemon is passed', () => {
    expect(startCommandWantsDaemon(['--daemon'])).toBe(true);
    expect(startCommandWantsDaemon(['-d'])).toBe(true);
  });

  it('ignores unrelated flags and stays foreground', () => {
    expect(startCommandWantsDaemon(['--verbose'])).toBe(false);
    expect(startCommandWantsDaemon(['--port', '9999'])).toBe(false);
  });
});
