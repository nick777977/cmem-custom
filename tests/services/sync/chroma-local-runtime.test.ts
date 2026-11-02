import { afterAll, beforeEach, describe, expect, it, mock } from 'bun:test';
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import * as realSettings from '../../../src/shared/SettingsDefaultsManager.js';
import * as realStdio from '@modelcontextprotocol/sdk/client/stdio.js';
import * as realClient from '@modelcontextprotocol/sdk/client/index.js';
import * as realLogger from '../../../src/utils/logger.js';
const snapshots = [{ ...realSettings }, { ...realStdio }, { ...realClient }, { ...realLogger }];
let settings: Record<string, string> = {};
let transports = 0, clients = 0;
mock.module('../../../src/shared/SettingsDefaultsManager.js', () => ({
  ...snapshots[0], SettingsDefaultsManager: Object.create(realSettings.SettingsDefaultsManager, { loadFromFile: { value: () => settings } }),
}));
mock.module('@modelcontextprotocol/sdk/client/stdio.js', () => ({ ...snapshots[1], StdioClientTransport: class { constructor() { transports++; throw Error('must not construct transport'); } } }));
mock.module('@modelcontextprotocol/sdk/client/index.js', () => ({ ...snapshots[2], Client: class { constructor() { clients++; throw Error('must not construct client'); } } }));
mock.module('../../../src/utils/logger.js', () => ({ logger: { debug() {}, info() {}, warn() {}, error() {}, failure() {} } }));
import { ChromaMcpManager } from '../../../src/services/sync/ChromaMcpManager.js';
import { ChromaLocalRuntimeError, requireApprovedLocalChromaRuntime } from '../../../src/services/sync/ChromaLocalRuntime.js';
const root = path.resolve('.scratch/enterprise-local/chroma-07/fixtures');
mkdirSync(root, { recursive: true });
beforeEach(async () => { await ChromaMcpManager.reset(); settings = {}; transports = clients = 0; });
afterAll(async () => {
  await ChromaMcpManager.reset();
  mock.module('../../../src/shared/SettingsDefaultsManager.js', () => snapshots[0]);
  mock.module('@modelcontextprotocol/sdk/client/stdio.js', () => snapshots[1]);
  mock.module('@modelcontextprotocol/sdk/client/index.js', () => snapshots[2]);
  mock.module('../../../src/utils/logger.js', () => snapshots[3]);
});
describe('unverified local Chroma never launches', () => {
  for (const asset of ['missing', 'cold-cache', 'corrupt', 'present']) {
    it(`blocks ${asset} assets before client/store/process, without repair`, async () => {
      const executable = path.join(root, asset, 'adapter.exe');
      if (asset === 'present' || asset === 'corrupt') {
        mkdirSync(path.dirname(executable), { recursive: true });
        writeFileSync(executable, asset === 'corrupt' ? 'invalid executable' : 'synthetic fixture, never executable');
      }
      settings = { CLAUDE_MEM_CHROMA_EXECUTABLE: executable, CLAUDE_MEM_CHROMA_UVX_PATH: path.join(root, 'uvx.exe') };
      const before = existsSync(executable) ? readFileSync(executable, 'utf8') : null;
      const manager = ChromaMcpManager.getInstance();
      await expect(manager.callTool('chroma_list_collections', {})).rejects.toThrow('LOCAL_CHROMA_ARTIFACT_CONTRACT_UNVERIFIED');
      await expect(manager.callTool('chroma_query_documents', { query_texts: ['synthetic query'] })).rejects.toThrow('LOCAL_CHROMA_ARTIFACT_CONTRACT_UNVERIFIED');
      expect(transports).toBe(0); expect(clients).toBe(0);
      expect(existsSync(executable) ? readFileSync(executable, 'utf8') : null).toBe(before);
    });
  }
  it('does not let legacy uvx configuration authorize execution', async () => {
    settings = { CLAUDE_MEM_CHROMA_UVX_PATH: path.join(root, 'uvx.exe') };
    await expect(ChromaMcpManager.getInstance().callTool('chroma_list_collections', {})).rejects.toThrow('absolute pre-provisioned');
    expect(transports).toBe(0);
  });
  it('rejects direct tool provider override before transport', async () => {
    await expect(ChromaMcpManager.getInstance().callTool('chroma_create_collection', { embedding_function_name: 'openai' })).rejects.toThrow('embedding function is forbidden');
    expect(transports).toBe(0);
  });
  it('rejects remote configuration at the actual manager boundary', async () => {
    settings = { CLAUDE_MEM_CHROMA_MODE: 'remote', CLAUDE_MEM_CHROMA_HOST: 'remote.invalid', CLAUDE_MEM_CHROMA_API_KEY: 'fixture' };
    await expect(ChromaMcpManager.getInstance().callTool('chroma_query_documents', {})).rejects.toThrow('Remote Chroma is forbidden');
    expect(transports).toBe(0); expect(clients).toBe(0);
  });
  it('unknown contract is a configuration refusal, not a new transient SQLite-only mode', () => {
    expect(() => requireApprovedLocalChromaRuntime({ CLAUDE_MEM_CHROMA_EXECUTABLE: path.join(root, 'adapter.exe') })).toThrow(ChromaLocalRuntimeError);
  });
});
