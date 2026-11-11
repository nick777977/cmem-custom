#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const write = (file, value) => fs.writeFileSync(path.join(root, file), JSON.stringify(value, null, 2) + '\n');
const pkg = read('package.json');
const description = 'cmem-light — local memory for Claude Code and Codex CLI';
for (const file of ['.claude-plugin/plugin.json', 'plugin/.claude-plugin/plugin.json', '.codex-plugin/plugin.json', 'plugin/.codex-plugin/plugin.json']) {
  const plugin = read(file);
  // Technical identity is retained for private staging and existing hosts.
  Object.assign(plugin, { name: pkg.name, version: pkg.version, description, license: pkg.license, keywords: pkg.keywords });
  for (const key of ['author', 'homepage', 'repository']) delete plugin[key];
  if (file.includes('.codex-plugin/')) {
    plugin.interface = { ...plugin.interface, displayName: 'cmem-light', shortDescription: description,
      longDescription: 'cmem-light preserves local coding-session memory across Claude Code and Codex CLI sessions.' };
    delete plugin.interface.developerName;
    delete plugin.interface.websiteURL;
  }
  write(file, plugin);
}
const marketplace = read('.claude-plugin/marketplace.json');
marketplace.owner = { name: 'Local fork maintainers' };
marketplace.metadata = { ...marketplace.metadata, description };
marketplace.plugins = marketplace.plugins.filter(plugin => plugin.name === pkg.name).map(plugin => ({ ...plugin, version: pkg.version, description }));
write('.claude-plugin/marketplace.json', marketplace);
const catalog = read('.agents/plugins/marketplace.json');
catalog.interface = { ...catalog.interface, displayName: 'cmem-light' };
write('.agents/plugins/marketplace.json', catalog);
console.log('Synced retained local host manifests');
