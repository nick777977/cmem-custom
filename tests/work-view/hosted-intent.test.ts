import { afterEach, expect, it, mock, spyOn } from 'bun:test';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { HostedIntent } from '../../src/services/work-view/hosted-intent.js';
import type { OwnerPrompt } from '../../src/services/prompt-import/index.js';
afterEach(() => mock.restore());
for (const signedIn of [false, true]) it('rejects extraction without transport, credential or database access; signed in='+signedIn, async () => {
  const root = resolve('.scratch/enterprise-local/hosted-03/fixtures'); mkdirSync(root, { recursive: true });
  const dir = mkdtempSync(join(root, 'intent-'));
  const pending = join(dir, 'hosted-intent-pending.json'); writeFileSync(pending, '{synthetic interrupted response}');
  const credentials = mock(() => ({ token: signedIn ? 'synthetic-token' : '', userId: signedIn ? 'synthetic-user' : '' }));
  const access = mock(() => { throw Error('Forbidden data or origin access'); });
  const remote = mock(async () => Response.json({}));
  const globalTransport = spyOn(globalThis, 'fetch').mockImplementation(remote as typeof fetch);
  const client = new HostedIntent({ credentials, origin: access, intentConfigPath: join(dir, 'intent.json'), ledgerDir: dir,
    openDatabase: access, appendWorkStateEntry: access, homeProject: access, fetch: remote as typeof fetch });
  for (const prompts of [[], [{ text: 'synthetic prompt', sessionId: 'synthetic-session' } as OwnerPrompt]]) {
    await expect(client.run(prompts, true)).rejects.toThrow('disabled');
  }
  for (const callback of [credentials, access, remote, globalTransport]) expect(callback).toHaveBeenCalledTimes(0);
  expect(client.state()).toMatchObject({ state: 'failed', step: null, startedAt: null });
  expect(readFileSync(pending, 'utf8')).toBe('{synthetic interrupted response}');
});
