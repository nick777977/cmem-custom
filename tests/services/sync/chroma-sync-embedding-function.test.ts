import { afterAll, beforeEach, describe, it, expect, mock } from 'bun:test';
import * as realChromaMcpManager from '../../../src/services/sync/ChromaMcpManager.js';
import * as realSettingsDefaultsManager from '../../../src/shared/SettingsDefaultsManager.js';
const managerSnapshot = { ...realChromaMcpManager };
const settingsSnapshot = { ...realSettingsDefaultsManager };
const createCalls: Array<Record<string, unknown>> = [];
let settings: Record<string, string> = {};
mock.module('../../../src/services/sync/ChromaMcpManager.js', () => ({
  ChromaMcpManager: { getInstance: () => ({ callTool: async (_tool: string, args: Record<string, unknown>) => { createCalls.push(args); return {}; } }) },
}));
mock.module('../../../src/shared/SettingsDefaultsManager.js', () => ({
  ...settingsSnapshot,
  SettingsDefaultsManager: Object.create(settingsSnapshot.SettingsDefaultsManager, { loadFromFile: { value: () => settings } }),
}));
import { ChromaSync } from '../../../src/services/sync/ChromaSync.js';
beforeEach(() => { createCalls.length = 0; settings = {}; });
afterAll(() => {
  mock.module('../../../src/services/sync/ChromaMcpManager.js', () => managerSnapshot);
  mock.module('../../../src/shared/SettingsDefaultsManager.js', () => settingsSnapshot);
});
describe('ChromaSync local embedding candidate', () => {
  it('retains default collection request with a mocked, already-verified manager', async () => {
    await new ChromaSync('project').ensureCollectionExists();
    expect(createCalls).toEqual([{ collection_name: 'cm__project', embedding_function_name: 'default' }]);
  });
  for (const provider of ['openai', 'cohere', 'jina', 'voyageai', 'roboflow', 'multilingual']) {
    it(`rejects ${provider} before any collection tool`, async () => {
      settings = { CLAUDE_MEM_CHROMA_EMBEDDING_FUNCTION: provider };
      await expect(new ChromaSync('project').ensureCollectionExists()).rejects.toThrow('embedding function is forbidden');
      expect(createCalls).toHaveLength(0);
    });
  }
  it('revalidates legacy config even after a collection was cached', async () => {
    const sync = new ChromaSync('project');
    await sync.ensureCollectionExists();
    settings = { CLAUDE_MEM_CHROMA_MODE: 'remote' };
    await expect(sync.ensureCollectionExists()).rejects.toThrow('Remote Chroma is forbidden');
    expect(createCalls).toHaveLength(1);
  });
});
