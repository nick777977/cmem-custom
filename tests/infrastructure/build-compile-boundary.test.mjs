import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = fileURLToPath(new URL('../../', import.meta.url));

test('compile entrypoints exclude explicit dependency preparation and lifecycle hooks', () => {
  const { scripts } = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
  assert.equal(scripts.build, 'npm run build:compile');
  assert.equal(scripts['build:compile'], 'node scripts/sync-plugin-manifests.js && node scripts/build-hooks.js');
  assert.equal(scripts['build:prepare:plugin-lock'], 'node scripts/gen-plugin-lockfile.cjs');
  assert.equal(scripts['build:prepare:viewer'], 'npm --prefix src/ui/my-work ci --no-audit --no-fund');
  for (const name of ['prebuild', 'postbuild', 'prebuild:compile', 'postbuild:compile']) {
    assert.equal(scripts[name], undefined, `unexpected lifecycle hook: ${name}`);
  }
  const viewer = JSON.parse(readFileSync(path.join(root, 'src/ui/my-work/package.json'), 'utf8'));
  assert.equal(viewer.scripts.build, 'tsc -b && vite build');
  assert.equal(viewer.scripts.prebuild, undefined);
  assert.equal(viewer.scripts.postbuild, undefined);
});

// Execute the real viewer script in a disposable tree. Both esbuild and npm are
// inert stand-ins: no compiler, package manager, worker or user state is invoked.
function fixture(t, { missing = [], npmExit = 0 } = {}) {
  const dir = mkdtempSync(path.join(tmpdir(), 'cmem compile fixture '));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const put = (file, content) => {
    const target = path.join(dir, file);
    mkdirSync(path.dirname(target), { recursive: true });
    writeFileSync(target, content);
  };
  put('package.json', '{"type":"module"}');
  put('scripts/build-viewer.js', readFileSync(path.join(root, 'scripts/build-viewer.js')));
  put('node_modules/esbuild/package.json', '{"type":"module","exports":"./index.js"}');
  put('node_modules/esbuild/index.js', `
    import { writeFileSync } from 'node:fs';
    export async function build(options) {
      console.log('fixture:esbuild');
      writeFileSync(options.outfile, '// fixture bundle');
    }
  `);
  for (const file of ['typescript/bin/tsc', 'vite/bin/vite.js']) {
    if (!missing.includes(file)) put(`src/ui/my-work/node_modules/${file}`, '// fixture compiler');
  }
  put('src/ui/viewer-template.html', '<html>viewer fixture</html>');
  put('src/ui/tv.html', '<html>tv fixture</html>');
  put('src/ui/viewer/assets/fonts/fixture.woff2', 'fixture font');
  put('src/ui/icon-thick-fixture.svg', '<svg/>');
  mkdirSync(path.join(dir, 'plugin/ui'), { recursive: true });
  mkdirSync(path.join(dir, 'home'), { recursive: true });
  put('bin/npm.cmd', `@echo off\r\necho fixture:npm:%*\r\necho fixture:cwd:%CD%\r\nexit /b ${npmExit}\r\n`);
  put('bin/npm', `#!/bin/sh\necho "fixture:npm:$*"\necho "fixture:cwd:$PWD"\nexit ${npmExit}\n`);
  if (process.platform !== 'win32') chmodSync(path.join(dir, 'bin/npm'), 0o755);
  // Only the fixture npm is visible. cmd.exe is located through ComSpec on Windows.
  const env = {
    ...process.env, PATH: path.join(dir, 'bin'),
    HOME: path.join(dir, 'home'), USERPROFILE: path.join(dir, 'home'),
    CLAUDE_MEM_DATA_DIR: path.join(dir, 'data'),
  };
  const result = spawnSync(process.execPath, [path.join(dir, 'scripts/build-viewer.js')], {
    cwd: dir, env, encoding: 'utf8', timeout: 15_000,
  });
  assert.equal(result.error, undefined);
  return { dir, ...result };
}

for (const missing of [
  ['typescript/bin/tsc'], ['vite/bin/vite.js'], ['typescript/bin/tsc', 'vite/bin/vite.js'],
]) {
  test(`missing ${missing.join(' + ')} fails before output or subprocess`, t => {
    const result = fixture(t, { missing });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Dependency preparation is required/);
    for (const file of missing) assert.ok(result.stderr.includes(file));
    assert.doesNotMatch(result.stdout, /fixture:esbuild|fixture:npm/);
    assert.equal(existsSync(path.join(result.dir, 'plugin/ui/viewer-bundle.js')), false);
  });
}

test('viewer runs only npm run build in My Work cwd and preserves local assets', t => {
  const result = fixture(t);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /fixture:npm:run build/);
  assert.ok(result.stdout.includes(`fixture:cwd:${path.join(result.dir, 'src/ui/my-work')}`));
  assert.equal((result.stdout.match(/fixture:npm:/g) || []).length, 1);
  for (const file of ['viewer.html', 'tv.html', 'assets/fonts/fixture.woff2', 'icon-thick-fixture.svg']) {
    assert.ok(existsSync(path.join(result.dir, 'plugin/ui', file)), file);
  }
});

test('viewer propagates a failed local build without success or retry', t => {
  const result = fixture(t, { npmExit: 17 });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Failed to build viewer/);
  assert.doesNotMatch(result.stdout, /React viewer built successfully/);
  assert.equal((result.stdout.match(/fixture:npm:/g) || []).length, 1);
});
