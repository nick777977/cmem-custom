import { expect, it } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { query } from '@anthropic-ai/claude-agent-sdk';
import { runAgentTask } from '../../../src/services/agent-runner/run.js';
import { ClaudeProvider } from '../../../src/services/worker/ClaudeProvider.js';
import { MainWorkerProfiles } from '../../../src/services/worker/MainWorkerProfiles.js';
import { resolveMainProfiles } from '../../../src/services/worker/model-profiles.js';

it('selected Claude refresh only allows checked read-only tools in the ledger, including link checks', async () => {
  const root = mkdtempSync(join(tmpdir(), 'agent-profile-'));
  try {
    const cwd = join(root, 'work-view');
    mkdirSync(cwd);
    const canLink = process.platform !== 'win32';
    if (canLink) symlinkSync(root, join(cwd, 'escape'), 'dir');
    const executable = join(root, 'claude.exe');
    writeFileSync(executable, '');
    const profile = { id: 'refresh-fixture', provider: 'claude', auth: 'api-key', model: 'claude-fixture-4', executable, keyEnv: 'CMEM_PROFILE_KEY_REFRESH' };
    const snapshot = resolveMainProfiles({ default: profile }, {
      CMEM_PROFILE_KEY_REFRESH: 'synthetic-refresh-key', CMEM_PROFILE_KEY_REFRESH_ENDPOINT: 'https://api.anthropic.com/',
    });
    const profiles = new MainWorkerProfiles(null!, null!, new ClaudeProvider(null!, null!), {} as never);
    const optionsSeen: Array<Parameters<typeof query>[0]> = [];
    const sdk = (async function* (input: Parameters<typeof query>[0]) {
      optionsSeen.push(input);
      yield { type: 'result', subtype: 'success', result: 'synthetic answer' };
    }) as unknown as typeof query;
    const result = await runAgentTask({ reason: 'fixture', cwd, readableFolders: [cwd], run: async ask => ask('Synthetic request') }, profiles, snapshot, sdk);
    expect(result).toMatchObject({ state: 'ok', agent: 'claude-code', result: 'synthetic answer' });
    expect(optionsSeen).toHaveLength(1);
    const options = optionsSeen[0].options!;
    expect(options).toMatchObject({
      pathToClaudeCodeExecutable: executable, model: profile.model, settingSources: [], strictMcpConfig: true,
      mcpServers: {}, allowedTools: [], tools: ['Read', 'Grep', 'Glob'], persistSession: false,
      env: { ANTHROPIC_API_KEY: 'synthetic-refresh-key', ANTHROPIC_BASE_URL: 'https://api.anthropic.com', CLAUDE_MEM_INTERNAL: '1' },
    });
    expect(options.plugins).toBeUndefined();
    const tool = (name: string, input: Record<string, unknown>) => options.canUseTool!(name, input, {} as never);
    expect(await tool('Read', { file_path: join(cwd, 'evidence.json') })).toMatchObject({ behavior: 'allow' });
    expect(await tool('Grep', { path: cwd })).toMatchObject({ behavior: 'allow' });
    for (const [name, input] of [
      ['Read', { file_path: join(root, 'settings.json') }],
      ['Read', { file_path: join(cwd, '..', 'settings.json') }],
      ['Glob', { path: cwd, pattern: '../*.json' }],
      ['Write', { file_path: join(cwd, 'evidence.json') }],
      ['Bash', {}],
      ['mcp__external__read', {}],
    ] as const) {
      expect(await tool(name, input)).toMatchObject({ behavior: 'deny' });
    }
    if (canLink) expect(await tool('Read', { file_path: join(cwd, 'escape', 'settings.json') })).toMatchObject({ behavior: 'deny' });
  } finally {
    // Unlink the test-owned junction before removing the scratch tree.
    rmSync(join(root, 'work-view', 'escape'), { force: true });
    rmSync(root, { recursive: true, force: true });
  }
});
