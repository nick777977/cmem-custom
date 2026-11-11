// Read-only repository analysis. Runs no application/build/test/install code.
// Usage: <Node 22.23.4> docs/enterprise-local/cleanup/analyze.mjs <output-directory>
// Writes reports only to an explicitly selected workspace-local output directory.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const out = path.resolve(root, process.argv[2] ?? '.scratch/enterprise-local/repository-cleanup');
const relativeOut = path.relative(root, out);
if (!relativeOut || relativeOut.startsWith('..') || path.isAbsolute(relativeOut)) throw new Error('Select a workspace-local report directory');
const require = createRequire(path.join(root, 'package.json'));
const ts = require('typescript'); // Existing compiler API, no project modules executed.
const base = 'a9364604d026d79be8ab771ecb861688972d169c';
const raw = execFileSync('git', ['ls-tree', '-r', '-l', '-z', base], { cwd: root, maxBuffer: 8 * 1024 * 1024 }).toString();
const files = raw.split('\0').filter(Boolean).map(record => {
  const [header, file] = record.split('\t');
  const [mode, kind, blob, size] = header.trim().split(/\s+/);
  if (kind !== 'blob') throw new Error(`Non-blob entry: ${file}`);
  return { file, blob, mode, bytes: Number(size) };
});
const tracked = new Set(files.map(f => f.file));
const textCache = new Map();
function read(file) {
  if (!tracked.has(file)) throw new Error('Read outside baseline tracked set');
  if (fs.lstatSync(path.join(root, file)).isSymbolicLink()) throw new Error(`Symlink: ${file}`);
  if (!textCache.has(file)) textCache.set(file, fs.readFileSync(path.join(root, file), 'utf8'));
  return textCache.get(file);
}
const code = files.filter(({file,mode}) => mode !== '120000' && /\.(?:[cm]?[jt]sx?)$/.test(file)
  && !file.startsWith('plugin/') && !file.startsWith('openclaw/dist/') && !file.endsWith('.d.ts'));
function resolveModule(from, spec) {
  if (!spec.startsWith('.')) return null;
  const stem = path.posix.normalize(path.posix.join(path.posix.dirname(from), spec));
  const replaced = stem.replace(/\.(?:js|jsx|mjs|cjs)$/, '');
  return [stem, ...['.ts','.tsx','.mts','.cts','.js','.jsx','.mjs','.cjs','.json'].map(ext => replaced + ext),
    ...['ts','tsx','js','mjs'].map(ext => `${stem}/index.${ext}`)].find(p => tracked.has(p)) ?? null;
}
const edges = [], external = [], unresolved = [], computed = [];
for (const {file} of code) {
  const sf = ts.createSourceFile(file, read(file), ts.ScriptTarget.Latest, true);
  function add(node, literal, kind, typeOnly = false) {
    const line = sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1;
    if (!ts.isStringLiteralLike(literal)) { computed.push({file,line,kind}); return; }
    const spec = literal.text;
    const to = resolveModule(file, spec);
    if (to) edges.push({from:file,to,line,kind,typeOnly});
    else if (spec.startsWith('.')) unresolved.push({file,line,spec,kind});
    else external.push({file,line,spec,kind,typeOnly});
  }
  function visit(n) {
    if (ts.isImportDeclaration(n)) add(n,n.moduleSpecifier,'import',!!n.importClause?.isTypeOnly);
    else if (ts.isExportDeclaration(n) && n.moduleSpecifier) add(n,n.moduleSpecifier,'export',n.isTypeOnly);
    else if (ts.isCallExpression(n) && (n.expression.kind === ts.SyntaxKind.ImportKeyword
      || (ts.isIdentifier(n.expression) && n.expression.text === 'require'))) {
      if (n.arguments[0]) add(n,n.arguments[0],n.expression.kind === ts.SyntaxKind.ImportKeyword ? 'dynamic-import' : 'require');
    }
    ts.forEachChild(n,visit);
  }
  visit(sf);
}
const roots = ['src/services/worker-service.ts','src/servers/mcp-server.ts',
  'src/services/context/context-read-worker.ts','src/ui/viewer/index.tsx',
  'src/ui/my-work/src/main.tsx','src/services/work-view/request-groups-cli.mjs'];
const outgoing = new Map(), incoming = new Map();
for (const e of edges) {
  outgoing.set(e.from,[...(outgoing.get(e.from) ?? []), e.to]);
  incoming.set(e.to,[...(incoming.get(e.to) ?? []), e]);
}
const reached = new Set(), pending = roots.filter(p=>tracked.has(p));
while (pending.length) {
  const p = pending.pop();
  if (reached.has(p)) continue;
  reached.add(p); pending.push(...(outgoing.get(p) ?? []));
}
const hostRoots = ['.cursor-plugin/','.grok-plugin/','.qoder-plugin/','claude-mem-cursor/',
  'claude-mem-grok-bot/','cursor-hooks/','openclaw/','omp/','hermes/','ods/','pi/','dsh/',
  'ragtime/','cowork/','.agent/','.windsurf/','src/integrations/dsh-plugin/',
  'src/integrations/opencode-plugin/','src/integrations/pi-extension/'];
const hostSource = /^(?:src\/services\/integrations\/(?:Cursor|GrokBot|OpenClaw|OpenCode|PiInstaller|Omp|Hermes|DeepSeekHarness|Kimi|AntigravityCli|T3Code|Windsurf)|src\/cli\/adapters\/(?:cursor|kimi|antigravity-cli|windsurf)\.|scripts\/grok-bot-)/;
const legal = /(^|\/)(?:LICENSE(?:\.[^/]+)?|NOTICE(?:\.[^/]+)?|THIRD-PARTY-LICENSE[^/]*|TYPEBOX-LICENSE[^/]*|TYPEBOX-PROVENANCE\.json)$/i;
function group(file) {
  if (legal.test(file) || file.includes('/vendor/provenance')) return 'P-LEGAL';
  if (file.startsWith('plugin/')) return 'R-ARTIFACT';
  if (file.startsWith('docs/') || file.startsWith('plans/') || file.startsWith('.plan/')
    || file.startsWith('.maestro/') || file.startsWith('.agent-jobs/')
    || /\.mdx?$/.test(file) && !['AGENTS.md','CLAUDE.md','WARP.md','SECURITY.md'].includes(file)) return 'P-DOCS';
  if (file.startsWith('.github/')) return 'P-CI';
  if (['AGENTS.md','CLAUDE.md','WARP.md','SECURITY.md'].includes(file) || file.startsWith('.claude/')) return 'P-GUIDANCE';
  if (hostRoots.some(p=>file.startsWith(p)) || hostSource.test(file)) return 'C-HOST';
  if (file.startsWith('workers/sync-hub/') || file.startsWith('services/sync-api/')) return 'C-CLOUD';
  if (file.startsWith('docker/') || ['.dockerignore','Dockerfile.test-installer','docker-compose.yml','docker-compose.e2e.yml'].includes(file)
    || file === 'scripts/e2e-server-docker.sh') return 'C-DOCKER';
  if (file.startsWith('install/') || file.startsWith('scripts/translate-readme/')
    || ['.translation-cache.json','scripts/discord-release-notify.js','scripts/generate-changelog.js'].includes(file)) return 'C-PUBLISH';
  if (file.startsWith('tests/') || file.startsWith('evals/') || file.startsWith('fixtures/')) return 'R-TEST';
  if (reached.has(file)) return 'K-LOCAL';
  return 'R-SOURCE';
}
fs.mkdirSync(out,{recursive:true});
const inventory = ['path\tbase_bytes\tgit_blob\tgit_mode\tgroup\tliteral_closure\tincoming_module_edges',
  ...files.map(f=>[f.file,f.bytes,f.blob,f.mode,group(f.file),reached.has(f.file)?'yes':'no',(incoming.get(f.file)??[]).length].join('\t'))].join('\n')+'\n';
fs.writeFileSync(path.join(out,'inventory.tsv'),inventory);
fs.writeFileSync(path.join(out,'module-edges.json'),JSON.stringify({base,roots,edges,external,unresolved,computed},null,2)+'\n');
const sum = (list) => ({files:list.length,bytes:list.reduce((n,f)=>n+f.bytes,0)});
const groups = Object.fromEntries([...new Set(files.map(f=>group(f.file)))].sort().map(g=>[g,sum(files.filter(f=>group(f.file)===g))]));
const byRoot = Object.fromEntries([...new Set(files.map(f=>f.file.split('/')[0]))].sort().map(g=>[g,sum(files.filter(f=>f.file.split('/')[0]===g))]));
const summary = {base,typescript:ts.version,total:sum(files),codeFiles:code.length,
  roots: roots.map(file=>({file,present:tracked.has(file)})),literalClosure:reached.size,
  edges:edges.length,externalReferences:external.length,unresolvedRelative:unresolved.length,
  computedModuleCalls:computed.length,groups,byRoot,
  pdfs:sum(files.filter(f=>f.file.startsWith('plans/')&&f.file.endsWith('.pdf'))),
  coreWarnings:files.filter(f=>reached.has(f.file)&&(/^(src\/server\/|src\/storage\/postgres\/|src\/services\/sync\/)/.test(f.file))).map(f=>f.file)};
fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify(summary,null,2)+'\n');
console.log(JSON.stringify(summary,null,2));
