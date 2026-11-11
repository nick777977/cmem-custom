import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { lstatSync, readFileSync, readdirSync, realpathSync } from 'node:fs';
import { isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const checkout = fileURLToPath(new URL('../../', import.meta.url));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');

function inside(root, path) {
  assert(typeof path === 'string' && path.length && !isAbsolute(path), 'Expected a relative receipt path');
  const file = resolve(root, path);
  const rel = relative(root, file);
  assert(rel && rel !== '..' && !rel.startsWith('../') && !rel.startsWith('..\\') && !isAbsolute(rel), 'Receipt path escaped root');
  // Reject junctions/symlinks at every path component, including directories.
  let current = root;
  for (const name of rel.split(/[\\/]/)) {
    current = join(current, name);
    assert(!lstatSync(current).isSymbolicLink(), `Non-regular receipt path: ${path}`);
  }
  assert(lstatSync(file).isFile(), `Expected a regular receipt file: ${path}`);
  return file;
}

function catalogFiles(root, path = 'catalog') {
  assert(lstatSync(join(root, path)).isDirectory() && !lstatSync(join(root, path)).isSymbolicLink(), 'Expected a regular catalog');
  return readdirSync(join(root, path), { withFileTypes: true }).flatMap(entry => {
    assert(!entry.isSymbolicLink(), 'Catalog links are not supported');
    const name = `${path}/${entry.name}`;
    if (entry.isDirectory()) return catalogFiles(root, name);
    assert(entry.isFile(), `Unexpected catalog entry: ${name}`);
    return [name];
  }).sort();
}

/** Exact historical synthetic references only. No rebinding or transfer claim. */
export function verifyCleanupReference(receipt, { repo = checkout, host = 'codex', candidate } = {}) {
  assert.equal(receipt.schemaVersion, 1);
  assert(['codex', 'claude'].includes(host), 'Expected codex or claude');
  assert.equal(hash(JSON.stringify(receipt.sourceInputs)), receipt.sourceDigest, 'Source-list digest mismatch');
  for (const input of receipt.sourceInputs) {
    assert.equal(hash(readFileSync(inside(repo, input.path))), input.sha256, `Source hash mismatch: ${input.path}`);
  }
  const root = host === 'codex' ? receipt.referenceRoot : receipt.claudeReferenceRoot;
  assert(isAbsolute(root) && resolve(root) === realpathSync(root), 'Expected canonical reference root');
  assert.equal(resolve(candidate ?? root), resolve(root), 'Receipt is destination-bound; a different candidate needs a new binding/inventory');
  const entries = host === 'codex' ? receipt.files : receipt.claudeFiles;
  const digest = host === 'codex' ? receipt.sha256 : receipt.claudeSha256;
  assert.equal(hash(JSON.stringify(entries)), digest, 'Stage-list digest mismatch');
  assert.equal(new Set(entries.map(e => e.path)).size, entries.length, 'Duplicate stage entry');
  const rootFiles = readdirSync(root, { withFileTypes: true }).filter(e => !e.isDirectory()).map(e => e.name).sort();
  assert.deepEqual(rootFiles, entries.filter(e => !e.path.includes('/')).map(e => e.path).sort(), 'Stage root file set mismatch');
  assert.deepEqual(catalogFiles(root), entries.filter(e => e.path.startsWith('catalog/')).map(e => e.path).sort(), 'Catalog file set mismatch');
  for (const entry of entries) {
    const bytes = readFileSync(inside(root, entry.path));
    assert.equal(bytes.length, entry.bytes, `Size mismatch: ${entry.path}`);
    assert.equal(hash(bytes), entry.sha256, `Stage hash mismatch: ${entry.path}`);
    if (entry.kind === 'copied') assert.equal(hash(readFileSync(inside(repo, entry.source))), entry.sha256, `Build hash mismatch: ${entry.source}`);
  }
  return { scope: 'exact cleanup reference; runtime data excluded; no portable inventory or SBOM claim', host,
    sourceCommit: receipt.sourceCommit, sourceInputs: receipt.sourceInputs.length, files: entries.length, sha256: digest };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const { values } = parseArgs({ options: { host: { type: 'string', default: 'codex' }, candidate: { type: 'string' } } });
    const receipt = JSON.parse(readFileSync(new URL('../../docs/enterprise-local/artifacts/windows-x64-cleanup-receipt.json', import.meta.url), 'utf8'));
    console.log(JSON.stringify(verifyCleanupReference(receipt, values), null, 2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
