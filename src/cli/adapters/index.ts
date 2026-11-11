import type { PlatformAdapter } from '../types.js';
import { claudeCodeAdapter } from './claude-code.js';
import { codexAdapter } from './codex.js';
import { rawAdapter } from './raw.js';

export function getPlatformAdapter(platform: string): PlatformAdapter {
  switch (platform) {
    case 'claude':
    case 'claude-code': return claudeCodeAdapter;
    case 'codex': return codexAdapter;
    case 'raw': return rawAdapter;
    default: throw new Error(`Unsupported local host: ${platform}`);
  }
}
export { claudeCodeAdapter, codexAdapter, rawAdapter };
