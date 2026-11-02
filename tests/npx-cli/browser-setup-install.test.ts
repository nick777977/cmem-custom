// Static caller regression: never execute the broad installer or its acquisition/service paths here.
import { expect, it } from 'bun:test';
import { readFileSync } from 'node:fs';
it('the actual installer no longer imports or invokes the hosted browser handoff', () => {
  const source = readFileSync(new URL('../../src/npx-cli/commands/install.ts', import.meta.url), 'utf8');
  for (const removed of ['runBrowserSetup', 'shouldUseBrowserSetup', 'startOnTheGoPairing', 'startSetupSession', 'browserOutcome']) {
    expect(source).not.toContain(removed);
  }
  expect(source).toContain('const selectedProvider = await terminalAccountAndProvider();');
});
