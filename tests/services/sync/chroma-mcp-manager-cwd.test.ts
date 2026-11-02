import { describe, it, expect } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('retained synthetic transport cwd isolation', () => {
  it('keeps the transport cwd outside project .env discovery', () => {
    const source = readFileSync(join(import.meta.dir, '../../../src/services/sync/ChromaMcpManager.ts'), 'utf8');
    const block = source.match(/new StdioClientTransport\(\s*\{([\s\S]*?)\}\s*\)/);
    expect(block).not.toBeNull();
    expect(block![1]).toContain('cwd: os.homedir()');
    expect(source).not.toMatch(/execSync|buildLauncherPrefix|getUvxBinDirs|resolveUvxCommand|sweepUvBuildsScratch/);
  });
});
