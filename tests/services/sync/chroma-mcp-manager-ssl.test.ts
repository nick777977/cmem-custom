import { describe, it, expect } from 'bun:test';
import { assertLocalChromaConfiguration } from '../../../src/services/sync/ChromaLocalRuntime.js';

describe('legacy remote Chroma is forbidden', () => {
  for (const ssl of ['', 'true', 'false']) {
    it(`rejects remote even with loopback host and SSL=${ssl}`, () => {
      expect(() => assertLocalChromaConfiguration({
        CLAUDE_MEM_CHROMA_MODE: 'remote', CLAUDE_MEM_CHROMA_HOST: '127.0.0.1',
        CLAUDE_MEM_CHROMA_SSL: ssl, CLAUDE_MEM_CHROMA_API_KEY: 'synthetic-key',
      })).toThrow('Remote Chroma is forbidden');
    });
  }
  it('rejects an unknown mode rather than choosing local or HTTP', () => {
    expect(() => assertLocalChromaConfiguration({ CLAUDE_MEM_CHROMA_MODE: 'auto' })).toThrow('must be local');
  });
});
