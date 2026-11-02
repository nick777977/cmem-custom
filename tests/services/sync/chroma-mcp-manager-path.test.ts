import { describe, it, expect } from 'bun:test';
import path from 'node:path';
import { requireApprovedLocalChromaRuntime } from '../../../src/services/sync/ChromaLocalRuntime.js';

describe('Chroma executable has no discovery or acquisition fallback', () => {
  for (const value of ['', 'chroma-mcp', './adapter', 'C:adapter.exe', '\\\\server\\share\\adapter.exe', '//server/share/adapter']) {
    it(`rejects non-local/relative executable ${JSON.stringify(value)}`, () => {
      expect(() => requireApprovedLocalChromaRuntime({ CLAUDE_MEM_CHROMA_EXECUTABLE: value })).toThrow('absolute pre-provisioned local executable');
    });
  }
  for (const name of ['uv.exe', 'uvx.exe', 'pip.exe', 'pipx.exe', 'python.exe', 'python3.13.exe', 'npm.cmd', 'npx.cmd', 'bun.exe', 'cmd.exe', 'pwsh.exe', 'sh']) {
    it(`rejects acquisition/interpreter entry ${name}`, () => {
      expect(() => requireApprovedLocalChromaRuntime({ CLAUDE_MEM_CHROMA_EXECUTABLE: path.resolve(name) })).toThrow('not an interpreter, shell or package manager');
    });
  }
});
