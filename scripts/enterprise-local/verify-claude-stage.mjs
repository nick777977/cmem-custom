import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { lstatSync, readdirSync, readFileSync, realpathSync } from 'node:fs';
import { join, win32 } from 'node:path';
import { parseArgs } from 'node:util';

const inventoryUrl = new URL('../../docs/enterprise-local/artifacts/claude-windows-x64-inventory.json', import.meta.url);
const bindingFile = 'cmem-light-local.json';
const boundFiles = new Set([bindingFile, 'catalog/plugin/hooks/hooks.json', 'catalog/plugin/.mcp.json']);
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const digest = bytes => ({ bytes: Buffer.byteLength(bytes), sha256: sha256(bytes) });

function literalPath(value) {
  assert(/^[a-z]:[\\/]/i.test(value ?? '') && !/[\x00-\x1f"'\`$%!*?<>|;&^]/.test(value),
    'Expected a literal local Windows drive path');
  return win32.resolve(value);
}

function listFiles(root, relative = '') {
  assert(lstatSync(join(root, relative)).isDirectory(), 'Expected a regular stage directory');
  return readdirSync(join(root, relative)).flatMap(name => {
    const path = relative ? `${relative}/${name}` : name;
    const stat = lstatSync(join(root, path));
    if (stat.isDirectory()) return listFiles(root, path);
    assert(stat.isFile(), `Unexpected non-regular stage entry: ${path}`);
    return [path];
  });
}

function normalized(path, bytes, { root, node, bun, port }) {
  if (!boundFiles.has(path)) return bytes;
  let value = bytes.toString('utf8');
  for (const [name, binding] of Object.entries({ ROOT: root, NODE: node, BUN: bun })) {
    value = value.replaceAll(JSON.stringify(binding).slice(1, -1), `@@${name}@@`);
  }
  return path === bindingFile ? value.replace(`"port": ${port}`, '"port": "@@PORT@@"') : value;
}

function main() {
  assert(process.platform === 'win32' && process.arch === 'x64', 'Windows x64 Node is required');
  const { values } = parseArgs({ options: {
    candidate: { type: 'string' }, 'bound-root': { type: 'string' }, bun: { type: 'string' },
    port: { type: 'string' }, record: { type: 'boolean' }, build: { type: 'string' }, renderer: { type: 'string' },
  } });
  const candidate = literalPath(values.candidate);
  assert.equal(candidate, realpathSync(candidate), 'Candidate must be a canonical local directory');
  const root = literalPath(values['bound-root'] ?? candidate);
  const node = realpathSync(process.execPath);
  const bun = realpathSync(literalPath(values.bun));
  const port = Number(values.port);
  assert(Number.isInteger(port) && port >= 1024 && port <= 65535, 'Specify the staged port');
  const paths = listFiles(candidate).sort();
  assert.deepEqual(JSON.parse(readFileSync(join(candidate, bindingFile), 'utf8')),
    { kind: 'cmem-light-claude-private', root, bun, node, port }, 'Stage binding mismatch');
  const files = paths.map(path => {
    const bytes = readFileSync(join(candidate, path));
    return { path, ...digest(normalized(path, bytes, { root, node, bun, port })),
      ...(boundFiles.has(path) && { reference: digest(bytes) }) };
  });
  const toolHashes = { node: sha256(readFileSync(node)), bun: sha256(readFileSync(bun)) };
  const exact = files.map(({ path, bytes, sha256, reference }) => ({ path, ...(reference ?? { bytes, sha256 }) }));
  const stageSha256 = sha256(JSON.stringify(exact));
  if (values.record) {
    for (const sha of [values.build, values.renderer]) assert(/^[a-f0-9]{40}$/.test(sha ?? ''), 'Supply full build and renderer Git SHAs');
    return { schemaVersion: 1, source: { pairedBuild: values.build, renderer: values.renderer, platform: 'win32-x64' },
      prerequisites: {
        node: { version: process.versions.node, sha256: toolHashes.node },
        bun: { version: '1.4.4', sha256: toolHashes.bun },
        windows: 'x64, ordinary user, canonical local paths, one dedicated loopback port and writable worker data',
        claudeCode: 'Target version and policy pending. Requires --plugin-dir, Windows exec-form hooks, stdio MCP and CLAUDE_PLUGIN_ROOT for both.',
        chroma: 'Separate CPython 3.13.15 Windows x64 wheelhouse and local MiniLM inputs in windows-x64-inventory.json',
        worker: 'Explicit model/auth profile. No profile, credentials, Python environment, model weights or database bundled.',
      },
      files, referenceStageSha256: stageSha256,
    };
  }
  const inventory = JSON.parse(readFileSync(inventoryUrl, 'utf8'));
  assert.equal(inventory.schemaVersion, 1, 'Unsupported Claude stage inventory schema');
  assert.deepEqual(paths, inventory.files.map(file => file.path), 'Stage file set mismatch');
  assert.deepEqual(toolHashes, { node: inventory.prerequisites.node.sha256, bun: inventory.prerequisites.bun.sha256 },
    'Runtime executable hash mismatch');
  for (const [i, { path, bytes, sha256 }] of files.entries()) {
    assert.equal(bytes, inventory.files[i].bytes, `Size mismatch: ${path}`);
    assert.equal(sha256, inventory.files[i].sha256, `SHA-256 mismatch: ${path}`);
  }
  return { source: inventory.source, files: exact, stageSha256 };
}

try {
  process.stdout.write(JSON.stringify(main(), null, 2) + '\n');
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
