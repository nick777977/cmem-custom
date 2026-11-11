import { test, expect } from 'bun:test';
import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { verifyCleanupReference } from '../../scripts/enterprise-local/verify-cleanup-reference.mjs';

test('cleanup reference verifies source/build bytes and rejects stale, moved, extra and altered files', () => {
  const parent = mkdtempSync(join(tmpdir(), 'cleanup-reference-'));
  try {
    const repo = join(parent, 'repo'), root = join(parent, 'stage');
    mkdirSync(repo); mkdirSync(join(root, 'catalog'), { recursive: true });
    writeFileSync(join(repo, 'input'), 'source'); writeFileSync(join(root, 'catalog', 'file'), 'source');
    const hash = value => createHash('sha256').update(value).digest('hex');
    const sourceInputs = [{ path: 'input', sha256: hash('source') }];
    const files = [{ path: 'catalog/file', bytes: 6, sha256: hash('source'), kind: 'copied', source: 'input' }];
    const receipt = { schemaVersion: 1, sourceInputs, sourceDigest: hash(JSON.stringify(sourceInputs)), referenceRoot: root,
      claudeReferenceRoot: root, files, claudeFiles: files, sha256: hash(JSON.stringify(files)), claudeSha256: hash(JSON.stringify(files)) };
    expect(verifyCleanupReference(receipt, { repo }).files).toBe(1);
    expect(verifyCleanupReference(receipt, { repo, host: 'claude' }).files).toBe(1);
    expect(() => verifyCleanupReference(receipt, { repo, candidate: join(parent, 'other') })).toThrow('destination-bound');
    writeFileSync(join(root, 'catalog', 'file'), 'alter!');
    expect(() => verifyCleanupReference(receipt, { repo })).toThrow('Stage hash mismatch');
    writeFileSync(join(root, 'catalog', 'file'), 'source'); writeFileSync(join(root, 'catalog', 'extra'), 'x');
    expect(() => verifyCleanupReference(receipt, { repo })).toThrow('Catalog file set mismatch');
    rmSync(join(root, 'catalog', 'extra')); writeFileSync(join(repo, 'input'), 'changed');
    expect(() => verifyCleanupReference(receipt, { repo })).toThrow('Source hash mismatch');
    const escaped = [{ path: '../input', sha256: hash('source') }];
    expect(() => verifyCleanupReference({ ...receipt, sourceInputs: escaped, sourceDigest: hash(JSON.stringify(escaped)) }, { repo })).toThrow('escaped root');
  } finally { rmSync(parent, { recursive: true, force: true }); }
});
