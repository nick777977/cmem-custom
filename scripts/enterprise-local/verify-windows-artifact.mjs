import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createReadStream, lstatSync, readdirSync, readFileSync, realpathSync } from 'node:fs';
import { dirname, extname, join, win32 } from 'node:path';
import { parseArgs } from 'node:util';

const inventoryUrl = new URL('../../docs/enterprise-local/artifacts/windows-x64-inventory.json', import.meta.url);
const { values } = parseArgs({ options: {
  candidate: { type: 'string' }, 'bound-root': { type: 'string' }, port: { type: 'string' },
  codex: { type: 'string' }, bun: { type: 'string' },
  python: { type: 'string' }, wheels: { type: 'string' }, model: { type: 'string' },
} });

function literalPath(value) {
  assert(/^[a-z]:[\\/]/i.test(value ?? '') && !/[\x00-\x1f"'`$%!*?<>|;&^]/.test(value),
    'Expected an explicit local Windows drive path');
  return win32.resolve(value);
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

async function fileHash(file) {
  assert(lstatSync(file).isFile(), `Expected a regular file: ${file}`);
  const hash = createHash('sha256');
  for await (const bytes of createReadStream(file)) hash.update(bytes);
  return hash.digest('hex');
}

function listTree(root) {
  const files = [];
  const directories = [];
  function visit(relative) {
    const directory = join(root, relative);
    assert(lstatSync(directory).isDirectory(), `Expected a regular directory: ${directory}`);
    for (const name of readdirSync(directory)) {
      const entry = relative ? `${relative}/${name}` : name;
      const stat = lstatSync(join(root, entry));
      if (stat.isDirectory()) {
        directories.push(entry);
        visit(entry);
      } else {
        assert(stat.isFile(), `Unexpected non-regular entry: ${entry}`);
        files.push(entry);
      }
    }
  }
  visit('');
  return { files: files.sort(), directories: directories.sort() };
}

async function verifyTree(root, entries, expectedDirectories, bindings = {}) {
  const actual = listTree(root);
  assert.deepEqual(actual.files, entries.map(entry => entry.path).sort(), 'File set mismatch');
  assert.deepEqual(actual.directories, [...expectedDirectories].sort(), 'Directory set mismatch');
  const receipt = [];
  for (const entry of entries) {
    let { bytes, sha256: expected } = entry;
    if (entry.template !== undefined) {
      assert.equal(sha256(entry.template), expected, `Template hash mismatch: ${entry.path}`);
      const rendered = entry.template.replace(/@@(ROOT|NODE|BUN|CODEX)@@|"@@(PORT)@@"/g,
        (_, pathKey, portKey) => portKey ? String(bindings.PORT) : JSON.stringify(bindings[pathKey]).slice(1, -1));
      bytes = Buffer.byteLength(rendered);
      expected = sha256(rendered);
    }
    const file = join(root, entry.path);
    assert.equal(lstatSync(file).size, bytes, `Size mismatch: ${entry.path}`);
    const hash = await fileHash(file);
    assert.equal(hash, expected, `SHA-256 mismatch: ${entry.path}`);
    receipt.push({ path: entry.path, bytes, sha256: hash });
  }
  return receipt;
}

async function verifyTool(file, expected) {
  const path = literalPath(realpathSync(literalPath(file)));
  assert.equal(extname(path).toLowerCase(), extname(expected.file), `Tool file type mismatch: ${expected.name}`);
  assert.equal(await fileHash(path), expected.sha256, `Tool SHA-256 mismatch: ${expected.name}`);
  return path;
}

async function main() {
  assert(process.platform === 'win32' && process.arch === 'x64', 'Windows x64 Node is required');
  const inventoryBytes = readFileSync(inventoryUrl);
  const inventory = JSON.parse(inventoryBytes.toString('utf8'));
  assert.equal(inventory.schemaVersion, 1, 'Unsupported inventory schema');
  const candidate = literalPath(values.candidate);
  const boundRoot = literalPath(values['bound-root'] ?? candidate);
  const port = Number(values.port);
  assert(Number.isInteger(port) && port >= 1024 && port <= 65535, 'Specify the staged port');
  const tools = Object.fromEntries(inventory.tools.map(tool => [tool.id, tool]));
  const bindings = {
    ROOT: boundRoot, PORT: port,
    NODE: await verifyTool(process.execPath, tools.node),
    BUN: await verifyTool(values.bun, tools.bun),
    CODEX: await verifyTool(values.codex, tools.codex),
  };
  const files = await verifyTree(candidate, inventory.files, inventory.directories, bindings);
  let chroma = null;
  if (values.python || values.wheels || values.model) {
    assert(values.python && values.wheels && values.model, 'Specify all three Chroma input paths');
    const python = await verifyTool(values.python, tools.python);
    await verifyTool(join(dirname(python), 'python313.dll'), tools.pythonDll);
    chroma = {
      wheels: await verifyTree(literalPath(values.wheels), inventory.chroma.wheels, []),
      model: await verifyTree(literalPath(values.model), inventory.chroma.model, []),
    };
  }
  const receipt = {
    source: inventory.source, inventorySha256: sha256(inventoryBytes),
    files, sha256: sha256(JSON.stringify(files)), chroma,
  };
  process.stdout.write(JSON.stringify(receipt, null, 2) + '\n');
}

main().catch(error => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
