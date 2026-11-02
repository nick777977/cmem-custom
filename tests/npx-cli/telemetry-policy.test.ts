import { expect, it, spyOn } from 'bun:test';
import { readdirSync } from 'node:fs';
import { runTelemetryCommand } from '../../src/npx-cli/commands/telemetry';
import { useTempHookSpoolDataDir } from '../helpers/temp-hook-spool';

it('status, enable and disable report fork policy without prompting or writing config', async () => {
  const temporary = useTempHookSpoolDataDir();
  const output = spyOn(console, 'log').mockImplementation(() => {});
  try {
    for (const command of [[], ['status'], ['enable'], ['disable'], ['ENABLE']]) {
      await runTelemetryCommand(command);
    }
    expect(output).toHaveBeenCalledTimes(5);
    for (const [line] of output.mock.calls) expect(line).toContain('DISABLED by local fork policy');
    expect(readdirSync(temporary.dataDir)).toEqual([]);
  } finally { output.mockRestore(); temporary.restore(); }
});

it('unknown commands return a failing exit code without terminating the process', async () => {
  const previous = process.exitCode;
  const output = spyOn(console, 'error').mockImplementation(() => {});
  try {
    await runTelemetryCommand(['unknown']);
    expect(process.exitCode).toBe(1);
    expect(output).toHaveBeenCalledTimes(1);
  } finally { process.exitCode = previous ?? 0; output.mockRestore(); }
});
