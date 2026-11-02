import { expect, it, spyOn } from 'bun:test';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { logger } from '../../src/utils/logger';
import { DATA_DIR } from '../../src/shared/paths';
import { captureException } from '../../src/services/telemetry/telemetry';
import { postHogConstructorCalls, postHogExceptionCalls } from '../preload';
it('local info/warn/error/failure logs survive inert and failing optional error sinks', () => {
  const stderr = spyOn(process.stderr, 'write').mockImplementation(() => true);
  try {
    logger.setErrorSink(captureException);
    logger.info('SYSTEM', 'telemetry-04-local-info');
    logger.warn('SYSTEM', 'telemetry-04-local-warning');
    logger.error('SYSTEM', 'telemetry-04-local-error', {}, new Error('synthetic error'));
    logger.setErrorSink(() => { throw Error('synthetic optional sink failure'); });
    expect(() => logger.failure('SYSTEM', 'telemetry-04-local-failure', {}, new Error('synthetic failure'))).not.toThrow();
    logger.setErrorSink(null);
    logger.error('SYSTEM', 'telemetry-04-local-no-sink');
    const logs = readdirSync(join(DATA_DIR, 'logs')).map(name => readFileSync(join(DATA_DIR, 'logs', name), 'utf8')).join('');
    for (const level of ['info', 'warning', 'error', 'failure', 'no-sink']) expect(logs).toContain('telemetry-04-local-' + level);
    expect(postHogConstructorCalls).toHaveLength(0); expect(postHogExceptionCalls).toHaveLength(0);
  } finally { logger.setErrorSink(null); stderr.mockRestore(); }
});
