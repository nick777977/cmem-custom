import { afterEach, expect, it, mock, spyOn } from 'bun:test';
import { existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import * as telemetry from '../../src/services/telemetry/telemetry';
import { captureCliEvent } from '../../src/services/telemetry/cli-telemetry';
import { getTelemetryApiKey, getTelemetryHost } from '../../src/services/telemetry/common';
import { useTempHookSpoolDataDir } from '../helpers/temp-hook-spool';
const calls: string[] = [];
const hit = (kind: string) => () => { calls.push(kind); throw Error('forbidden ' + kind); };
mock.module('posthog-node', () => ({ PostHog: class {
  constructor() { hit('constructor')(); }
  capture = hit('capture'); captureException = hit('exception');
  flush = hit('flush'); shutdown = hit('shutdown');
} }));
afterEach(() => mock.restore());
for (const debug of ['0', '1']) it('worker and CLI never construct/send even with opt-in, debug=' + debug, async () => {
  const temporary = useTempHookSpoolDataDir();
  const env = { ...process.env };
  try {
    process.env.CLAUDE_MEM_TELEMETRY = '1';
    process.env.CLAUDE_MEM_TELEMETRY_ERRORS = '1';
    process.env.CLAUDE_MEM_TELEMETRY_DEBUG = debug;
    process.env.CLAUDE_MEM_TELEMETRY_HOST = 'https://synthetic.invalid';
    process.env.CLAUDE_MEM_TELEMETRY_KEY = 'synthetic-key';
    process.env.DO_NOT_TRACK = '0';
    writeFileSync(join(temporary.dataDir, 'telemetry.json'), JSON.stringify({ enabled: true, installId: 'legacy', decidedAt: '' }));
    const fetchSpy = spyOn(globalThis, 'fetch').mockImplementation(hit('fetch') as any);
    const timer = spyOn(globalThis, 'setInterval').mockImplementation(hit('interval') as any);
    const timeout = spyOn(globalThis, 'setTimeout').mockImplementation(hit('timeout') as any);
    const stderr = spyOn(process.stderr, 'write').mockImplementation(() => true);
    const listeners = ['uncaughtException', 'unhandledRejection'].map(name => process.listenerCount(name));
    const payload = new Proxy({}, { get: hit('payload read'), ownKeys: hit('payload enumerate') as any });
    telemetry.enableExceptionAutocaptureForWorker();
    expect(telemetry.hasTelemetryConsent()).toBe(false);
    for (let i = 0; i < 50; i++) {
      telemetry.captureEvent('worker_started', payload, { person: true });
      telemetry.captureException(payload, payload);
      await captureCliEvent('hook_failed', payload, { person: true });
    }
    expect(telemetry.__errorBeforeSendForTests(payload)).toBeNull();
    await telemetry.shutdownTelemetry();
    telemetry.captureEvent('late_error', payload);
    await captureCliEvent('worker_start_failed', payload);
    await telemetry.shutdownTelemetry();
    expect(getTelemetryHost()).toBe(''); expect(getTelemetryApiKey()).toBe('');
    expect(calls).toEqual([]);
    expect(fetchSpy).not.toHaveBeenCalled(); expect(timer).not.toHaveBeenCalled();
    expect(timeout).not.toHaveBeenCalled(); expect(stderr).not.toHaveBeenCalled();
    expect(['uncaughtException', 'unhandledRejection'].map(name => process.listenerCount(name))).toEqual(listeners);
  } finally { mock.restore(); process.env = env; temporary.restore(); }
});
it('capture never bootstraps an install ID or inspects corrupt telemetry config', async () => {
  const temporary = useTempHookSpoolDataDir();
  try {
    telemetry.captureEvent('install_complete'); await captureCliEvent('install_failed');
    expect(existsSync(join(temporary.dataDir, 'telemetry.json'))).toBe(false);
    mkdirSync(join(temporary.dataDir, 'telemetry.json'));
    expect(() => telemetry.captureException(new Error('synthetic failure'))).not.toThrow();
    await captureCliEvent('uninstall');
    await telemetry.shutdownTelemetry();
    expect(calls).toEqual([]);
  } finally { temporary.restore(); }
});
