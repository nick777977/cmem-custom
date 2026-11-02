import { afterEach, expect, it, mock, spyOn } from 'bun:test';
import { buildSync } from 'esbuild';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
// Compile only pure setup compatibility exports and the inert page; never start a browser or server.
const compiled = buildSync({ stdin: { resolveDir: resolve(import.meta.dir, '../../../src/ui/my-work'), loader: 'tsx', contents: `
  import React from 'react'; import { renderToStaticMarkup } from 'react-dom/server';
  import SetupPage from './src/setup/setup-page';
  export { localSetupSource, setupPending } from './src/setup/setup-data';
  export const render = () => renderToStaticMarkup(<SetupPage onComplete={() => {}} />);
` }, tsconfig: resolve(import.meta.dir, '../../../src/ui/my-work/tsconfig.app.json'),
  bundle: true, write: false, format: 'cjs', platform: 'node', jsx: 'automatic', define: { 'process.env.NODE_ENV': '"production"' },
}).outputFiles[0].text;
function fixture() { const module = { exports: {} as any }; new Function('module','exports','require',compiled)(module,module.exports,createRequire(import.meta.url)); return module.exports; }
afterEach(() => mock.restore());
it('retired page and every setup action produce zero transport or event-stream dispatch', async () => {
  const app = fixture(), network = spyOn(globalThis, 'fetch').mockImplementation(async () => { throw Error('Forbidden request'); });
  const originalStream = globalThis.EventSource;
  const stream = mock(() => { throw Error('Forbidden event stream'); }); globalThis.EventSource = stream as never;
  try {
    expect(app.render()).toContain('Open local viewer'); expect(app.render()).not.toContain('Checkout');
    expect(await app.setupPending()).toBe(false);
    let latest: any; const stop = app.localSetupSource.subscribe((data: any) => { latest = data; });
    expect(latest.scan.error).toContain('disabled'); stop();
    for (const [action, args] of [['retryScan',[]],['setImproveProduct',[true]],['choose',[{ branch:'go',memoryBilling:'hosted' }]],['checkout',[]],['complete',[[]]],['startHistoryImport',[]]] as const) {
      await expect(app.localSetupSource[action](...args)).rejects.toThrow('disabled');
    }
    expect(network).toHaveBeenCalledTimes(0); expect(stream).toHaveBeenCalledTimes(0);
  } finally { globalThis.EventSource = originalStream; }
});
it('preserves local search and note requests on the retained source', async () => {
  const app = fixture(); const urls: string[] = [];
  const network = spyOn(globalThis, 'fetch').mockImplementation(async (url, init) => {
    urls.push(String(url));
    return Response.json(init?.method === 'POST' ? { success: true, id: 7 } : {});
  });
  await app.localSetupSource.search('synthetic');
  expect(await app.localSetupSource.keepNote({ title: 'Synthetic', project: 'synthetic-project' }, 'Synthetic note')).toBe(7);
  await app.localSetupSource.forgetNote(7);
  expect(network).toHaveBeenCalledTimes(3); expect(urls[0]).toContain('/api/search');
  expect(urls[1]).toBe('/api/memory/save'); expect(urls[2]).toBe('/api/observation/7');
});
it('actual App no longer imports the funnel, including for old setup URLs', () => {
  const app = readFileSync(resolve(import.meta.dir,'../../../src/ui/my-work/src/App.tsx'),'utf8');
  expect(app).not.toContain("import('@/setup/setup-page')"); expect(app).not.toContain("get('setup')"); expect(app).toContain('return <WorkApp />');
});
