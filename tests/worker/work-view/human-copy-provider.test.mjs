import { expect, test } from 'bun:test';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readMainProfiles } from '../../../src/services/worker/model-profiles.js';
import { configuredHumanCopyProvider } from '../../../src/services/worker/http/routes/WorkViewRoutes.js';

test('legacy copy credentials do not enable a route, and an existing opt-out survives until an override is selected', () => {
  const dir = mkdtempSync(join(tmpdir(), 'copy-profile-'));
  try {
    const path = join(dir, 'settings.json');
    const write = env => writeFileSync(path, JSON.stringify({ env }));
    const copy = configuredHumanCopyProvider({ snapshot: () => readMainProfiles(path, {}) }, path);
    write({ CLAUDE_MEM_WORK_VIEW_COPY_PROVIDER: 'openrouter', CLAUDE_MEM_OPENROUTER_API_KEY: 'unused-legacy-key' });
    expect(copy.isAvailable()).toBe(false);
    const profile = { id: 'copy-test', model: 'synthetic-copy', provider: 'openai-compatible', auth: 'none', endpoint: 'http://127.0.0.1:44982/v1' };
    write({ CLAUDE_MEM_WORK_VIEW_COPY_PROVIDER: 'off', CLAUDE_MEM_MODEL_PROFILES: { default: profile } });
    expect(copy.isAvailable()).toBe(false);
    expect(copy.isOff()).toBe(true);
    write({ CLAUDE_MEM_WORK_VIEW_COPY_PROVIDER: 'off', CLAUDE_MEM_MODEL_PROFILES: { default: profile, copy: profile } });
    expect(copy.isAvailable()).toBe(true);
    expect(copy.isOff()).toBe(false);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
