import { describe, it, expect } from 'bun:test';
import { readFileSync, existsSync, mkdtempSync, mkdirSync, writeFileSync, rmSync, utimesSync, chmodSync, realpathSync } from 'fs';
import { tmpdir } from 'os';
import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  buildCodexWindowsCommand,
  buildEnsureLauncherExecHook,
  buildExecHook,
  buildShellCommand,
} from '../../src/build/hook-shell-template.js';
import { HOOK_TIMEOUTS } from '../../src/shared/hook-constants.js';
import { stageClaudePlugin, stageLocalInstall } from '../../scripts/enterprise-local/codex-local.mjs';
import { FILE_CONTEXT_WORKER_BUDGET_MS } from '../../src/cli/handlers/file-context.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../..');

function readJson(relativePath: string): any {
  return JSON.parse(readFileSync(path.join(projectRoot, relativePath), 'utf-8'));
}

function commandHooksFrom(relativePath: string): string[] {
  const parsed = readJson(relativePath);
  return Object.values(parsed.hooks ?? {}).flatMap((matchers: any) =>
    matchers.flatMap((matcher: any) =>
      (matcher.hooks ?? [])
        .filter((hook: any) => hook.type === 'command')
        .map((hook: any) => String(hook.command ?? ''))
    )
  );
}

function commandHookEntriesFrom(relativePath: string): any[] {
  const parsed = readJson(relativePath);
  return Object.values(parsed.hooks ?? {}).flatMap((matchers: any) =>
    matchers.flatMap((matcher: any) =>
      (matcher.hooks ?? []).filter((hook: any) => hook.type === 'command')
    )
  );
}

function mcpStartupCommandFrom(relativePath: string): string {
  const parsed = readJson(relativePath);
  return parsed.mcpServers['mcp-search'].args[1];
}

function installFakeNvmNode(home: string, version: string): string {
  const nodeBin = path.join(home, '.nvm', 'versions', 'node', `v${version}`, 'bin');
  mkdirSync(nodeBin, { recursive: true });
  const nodePath = path.join(nodeBin, 'node');
  writeFileSync(nodePath, '#!/bin/sh\nprintf "NODE=%s\\nPATH=%s\\n" "$0" "$PATH"\n');
  chmodSync(nodePath, 0o755);
  return nodeBin;
}

// Canonical manifests are inert templates. Check operational argv on disposable
// destination-bound copies, without starting a worker or registering a host.
function withBoundHooks(host: 'claude' | 'codex', check: (hooks: any) => void) {
  const parent = mkdtempSync(path.join(tmpdir(), 'distribution-bound-'));
  const root = path.join(parent, 'literal stage');
  try {
    const input = { root, bundle: path.join(projectRoot, 'plugin'), port: 43985, bun: process.execPath };
    if (host === 'claude') stageClaudePlugin(input);
    else stageLocalInstall({ ...input, codex: process.execPath }); // Literal fixture executable, never invoked.
    const file = path.join(root, 'catalog/plugin/hooks', host === 'claude' ? 'hooks.json' : 'codex-hooks.json');
    check(JSON.parse(readFileSync(file, 'utf8')).hooks);
  } finally { rmSync(parent, { recursive: true, force: true }); }
}


describe('Plugin Distribution - Skills', () => {
  const skillPath = path.join(projectRoot, 'plugin/skills/mem-search/SKILL.md');
  const modeCreatorPath = path.join(projectRoot, 'plugin/skills/mode-creator/SKILL.md');

  it('should include plugin/skills/mem-search/SKILL.md', () => {
    expect(existsSync(skillPath)).toBe(true);
  });

  it('should have valid YAML frontmatter with name and description', () => {
    const content = readFileSync(skillPath, 'utf-8');

    expect(content.startsWith('---\n')).toBe(true);

    const frontmatterEnd = content.indexOf('\n---\n', 4);
    expect(frontmatterEnd).toBeGreaterThan(0);

    const frontmatter = content.slice(4, frontmatterEnd);
    expect(frontmatter).toContain('name:');
    expect(frontmatter).toContain('description:');
  });

  it('should reference the 3-layer search workflow', () => {
    const content = readFileSync(skillPath, 'utf-8');
    expect(content).toContain('search');
    expect(content).toContain('timeline');
    expect(content).toContain('get_observations');
  });

  it('should include the mode creator workflow and installers', () => {
    expect(existsSync(modeCreatorPath)).toBe(true);
    expect(existsSync(path.join(projectRoot, 'plugin/skills/mode-creator/scripts/install-mode.mjs'))).toBe(true);
    expect(existsSync(path.join(projectRoot, 'plugin/skills/mode-creator/scripts/configure-telegram.mjs'))).toBe(true);
  });
});

describe('Plugin Distribution - Required Files', () => {
  const requiredFiles = [
    'plugin/hooks/hooks.json',
    'plugin/hooks/codex-hooks.json',
    'plugin/.claude-plugin/plugin.json',
    'plugin/.codex-plugin/plugin.json',
    'plugin/.mcp.json',
    'plugin/sqlite/SessionStore.js',
    'plugin/sqlite/observations/files.js',
    'plugin/skills/mem-search/SKILL.md',
    'plugin/skills/mode-creator/SKILL.md',
    '.agents/plugins/marketplace.json',
  ];

  for (const filePath of requiredFiles) {
    it(`should include ${filePath}`, () => {
      const fullPath = path.join(projectRoot, filePath);
      expect(existsSync(fullPath)).toBe(true);
    });
  }
});

describe('Plugin Distribution - Codex Marketplace', () => {
  it('points Codex at the bundled plugin root', () => {
    const marketplacePath = path.join(projectRoot, '.agents/plugins/marketplace.json');
    const marketplace = JSON.parse(readFileSync(marketplacePath, 'utf-8'));

    expect(marketplace.plugins[0].source.path).toBe('./plugin');
  });

  it('ships Codex hooks with only Codex-supported root keys', () => {
    const codexHooks = readJson('plugin/hooks/codex-hooks.json');
    expect(Object.keys(codexHooks).sort()).toEqual(['hooks']);
  });

  it('re-injects Codex memory on every SessionStart source that starts a fresh context', () => {
    // Codex emits startup, resume, clear and compact (SessionStartSource in
    // codex-rs/hooks/src/events/session_start.rs). clear and compact both hand
    // the model an empty context, so the injection hook has to run for them or
    // the session continues with no memory.
    const codexHooks = readJson('plugin/hooks/codex-hooks.json');
    const matchers = codexHooks.hooks.SessionStart.map((entry: any) => entry.matcher);

    expect(matchers).toHaveLength(1);
    for (const source of ['startup', 'resume', 'clear', 'compact']) {
      expect(matchers[0].split('|')).toContain(source);
    }
  });

  it("binds every Codex compaction and subsequent tool use without changing their matchers", () => {
    withBoundHooks('codex', hooks => {
      expect(hooks.PostCompact).toHaveLength(1);
      expect(hooks.PostCompact[0].matcher).toBeUndefined();
      expect(hooks.PostCompact[0].hooks[0].commandWindows).toContain(' hook post-compact');
      expect(hooks.PostToolUse[0].matcher).toBe('.*');
      expect(hooks.PostToolUse[0].hooks[0].commandWindows).toContain(' hook observation');
    });
  });

  it("binds Codex subagent memory context for every agent type", () => {
    withBoundHooks('codex', hooks => {
      expect(hooks.SubagentStart).toHaveLength(1);
      expect(hooks.SubagentStart[0].matcher).toBeUndefined();
      expect(hooks.SubagentStart[0].hooks).toHaveLength(1);
      expect(hooks.SubagentStart[0].hooks[0].commandWindows).toContain(' hook subagent-context');
    });
  });

  it("bounds the bound Codex observation to five seconds without asynchronous dispatch", () => {
    withBoundHooks('codex', hooks => {
      expect(hooks.PostToolUse[0].hooks[0].commandWindows).toContain(' hook observation');
      expect(hooks.PostToolUse[0].hooks[0].timeout).toBe(5);
      for (const event of Object.keys(hooks)) expect(hooks[event][0].hooks[0]).not.toHaveProperty('async');
    });
  });

  it("sets the Codex marker in the bound launcher rather than a shell environment prefix", () => {
    const launcher = readFileSync(path.join(projectRoot, 'scripts/enterprise-local/codex-local.mjs'), 'utf8');
    expect(launcher).toContain("env.CLAUDE_MEM_CODEX_HOOK = '1'");
    for (const entry of commandHookEntriesFrom('plugin/hooks/codex-hooks.json')) {
      expect(entry.command).toBe('exit 1'); expect(entry.commandWindows).toBe('exit 1');
    }
  });

  it("binds literal Windows executable and stage paths without POSIX discovery", () => {
    withBoundHooks('codex', hooks => {
      for (const group of Object.values(hooks) as any[]) {
        const entry = group[0].hooks[0];
        expect(entry.command).toBe('exit 1');
        expect(entry.commandWindows).toMatch(/^"[A-Za-z]:.*\.exe" ".*codex-local\.mjs" hook [a-z-]+$/);
        for (const token of ['$(', '$' + '{', '[ -', 'export PATH', 'command -v', 'plugins/cache', 'marketplaces']) expect(entry.commandWindows).not.toContain(token);
      }
    });
  });

  it('ships a single Codex SessionStart command', () => {
    const codexHooks = readJson('plugin/hooks/codex-hooks.json');
    expect(codexHooks.hooks.SessionStart[0].hooks).toHaveLength(1);
    expect(codexHooks.hooks.SessionStart[0].hooks[0].command).not.toContain('version-check.js');
    expect(codexHooks.hooks.SessionStart[0].hooks[0].commandWindows).not.toContain('version-check.js');
  });

  it("canonical MCP stays unbound and requires explicit local admission", () => {
    const mcp = readJson('plugin/.mcp.json').mcpServers['mcp-search'];
    expect(mcp.command).toBe(''); expect(mcp.args[0]).toBe('-e');
    expect(mcp.args[1]).toContain('LOCAL_INTERPRETER_ABSOLUTE_REQUIRED');
    expect(mcp.args[1]).toContain('PRIVATE_LAUNCH_POLICY_PENDING');
    for (const token of ['plugins/cache', 'marketplaces', 'process.cwd', 'mcp-server.cjs']) expect(mcp.args[1]).not.toContain(token);
  });
});


describe('Plugin Distribution - hooks.json Integrity', () => {
  it('should have valid JSON in hooks.json', () => {
    const hooksPath = path.join(projectRoot, 'plugin/hooks/hooks.json');
    const content = readFileSync(hooksPath, 'utf-8');
    const parsed = JSON.parse(content);
    expect(parsed.hooks).toBeDefined();
  });

  it("routes every bound Claude event through its literal dedicated launcher", () => {
    withBoundHooks('claude', hooks => {
      const handlers = { SessionStart: 'context', UserPromptSubmit: 'session-init', PostToolUse: 'observation', PostToolUseFailure: 'observation', PreToolUse: 'file-context', Stop: 'summarize', SubagentStop: 'subagent-stop', SessionEnd: 'session-end' };
      expect(Object.keys(hooks).sort()).toEqual(Object.keys(handlers).sort());
      for (const [event, handler] of Object.entries(handlers)) {
        expect(hooks[event]).toHaveLength(1); expect(hooks[event][0].hooks).toHaveLength(1);
        expect(hooks[event][0].hooks[0].command).toBe(process.execPath);
        expect(hooks[event][0].hooks[0].args.slice(1)).toEqual(['hook', handler]);
        expect(path.isAbsolute(hooks[event][0].hooks[0].args[0])).toBe(true);
      }
    });
  });

  it("canonical startup preflight stays inert and private binding omits self-heal", () => {
    const parsed = readJson('plugin/hooks/hooks.json');
    expect(parsed.hooks.SessionStart[2]).toEqual({ matcher: 'startup', hooks: [{ type: 'command', ...buildEnsureLauncherExecHook(), timeout: 180 }] });
    expect(parsed.hooks.SessionStart[2].hooks[0].command).toBe('');
    withBoundHooks('claude', hooks => { expect(hooks.SessionStart).toHaveLength(1); expect(hooks.SessionStart[0].matcher).toBe('startup|clear|compact'); });
  });

  // Setup is retained as an inert shell-form refusal (it fires only on
  // `claude --init` / `--maintenance`, SPIKE item 8), so the defensive bash
  // no-discovery contract is pinned on it alone.
  const setupCommand = () => String(readJson('plugin/hooks/hooks.json').hooks.Setup[0].hooks[0].command);

  it("Setup refuses without environment or PATH discovery", () => {
    expect(String(readJson('plugin/hooks/hooks.json').hooks.Setup[0].hooks[0].command)).toBe('exit 1');
  });

  it("Setup never falls back to a marketplace", () => {
    expect(String(readJson('plugin/hooks/hooks.json').hooks.Setup[0].hooks[0].command)).toBe('exit 1');
  });

  it("Setup never chooses either cache or marketplace", () => {
    expect(String(readJson('plugin/hooks/hooks.json').hooks.Setup[0].hooks[0].command)).toBe('exit 1');
  });

  it('should not spawn a login shell to rebuild PATH in the Setup hook (#3190)', () => {
    expect(setupCommand()).not.toContain('SHELL -lc');
  });

  it("Setup never repairs NVM or modifies PATH", () => {
    expect(String(readJson('plugin/hooks/hooks.json').hooks.Setup[0].hooks[0].command)).toBe('exit 1');
  });
});

describe('Plugin Distribution - Startup Root Resolution', () => {
  it("MCP canonical payload gates literal interpreter and bundle paths without loading a server", () => {
    const command = mcpStartupCommandFrom('plugin/.mcp.json');
    expect(command).toContain('process.env.CLAUDE_MEM_NODE_EXECUTABLE');
    expect(command).toContain('process.env.CLAUDE_MEM_BUNDLE_ROOT');
    expect(command).toContain('LOCAL_BUNDLE_STALE');
    expect(command).not.toContain("require(p.resolve"); expect(command).not.toContain('mcp-server.cjs');
  });

  it("canonical Codex commands refuse without implicit root fallbacks", () => {
    for (const entry of commandHookEntriesFrom('plugin/hooks/codex-hooks.json')) { expect(entry.command).toBe('exit 1'); expect(entry.commandWindows).toBe('exit 1'); }
  });

  it("Setup uses the refusing shell builtin with no implicit configuration root", () => {
    expect(String(readJson('plugin/hooks/hooks.json').hooks.Setup[0].hooks[0].command)).toBe('exit 1');
  });
});

describe('Plugin Distribution - canonical MCP admission', () => {
  // Evaluate the payload with an explicitly selected interpreter, since the
  // shipped template's empty command is intentionally not executable.
  const { args } = readJson('plugin/.mcp.json').mcpServers['mcp-search'];

  function launchMcpServer(pluginRootFor: ((sandbox: string) => string) | null) {
    const sandbox = mkdtempSync(path.join(tmpdir(), 'claude-mem-mcp-launch-'));
    try {
      mkdirSync(path.join(sandbox, 'fixture', 'scripts'), { recursive: true });
      writeFileSync(path.join(sandbox, 'fixture', 'scripts', 'mcp-server.cjs'), 'process.stdout.write(String(process.pid));\n');
      // An empty HOME and config dir, so no real install can satisfy a candidate.
      const home = path.join(sandbox, 'home');
      const configDir = path.join(sandbox, 'claude-config');
      mkdirSync(home);
      mkdirSync(configDir);
      const env: Record<string, string | undefined> = { ...process.env, HOME: home, USERPROFILE: home, CLAUDE_CONFIG_DIR: configDir };
      delete env.CLAUDE_PLUGIN_ROOT;
      delete env.PLUGIN_ROOT;
      if (pluginRootFor) env.CLAUDE_PLUGIN_ROOT = pluginRootFor(sandbox);
      return spawnSync(process.execPath, args, { cwd: sandbox, env, encoding: 'utf-8', timeout: 20000 });
    } finally {
      rmSync(sandbox, { recursive: true, force: true });
    }
  }

  it("canonical MCP refuses an absolute legacy plugin root without loading it", () => {
    const result = launchMcpServer(sandbox => path.join(sandbox, 'fixture'));
    expect(result.status, result.stderr).toBe(1); expect(result.stdout).toBe(''); expect(result.stderr).toContain('LOCAL_INTERPRETER_ABSOLUTE_REQUIRED');
  });

  it("canonical MCP refuses a relative legacy plugin root without cwd discovery", () => {
    const result = launchMcpServer(() => './fixture');
    expect(result.status).toBe(1); expect(result.stdout).toBe(''); expect(result.stderr).toContain('LOCAL_INTERPRETER_ABSOLUTE_REQUIRED');
  });

  it("canonical MCP exits one with an admission error when no root is supplied", () => {
    const result = launchMcpServer(null);
    expect(result.status).toBe(1); expect(result.stdout).toBe(''); expect(result.stderr).toContain('LOCAL_INTERPRETER_ABSOLUTE_REQUIRED');
  });
});

describe('Plugin Distribution - package.json Files Field', () => {
  it('runs bug-report from the bundled distribution entry', () => {
    const packageJson = readJson('package.json');

    expect(packageJson.scripts['bug-report']).toBe('node dist/bug-report/index.js');
    expect(packageJson.files).toContain('dist');
  });

  it('should include bundled plugin entries in root package.json files field', () => {
    const packageJsonPath = path.join(projectRoot, 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    expect(packageJson.files).toBeDefined();
    expect(packageJson.files).toContain('plugin/.codex-plugin');
    expect(packageJson.files).toContain('plugin/.mcp.json');
    expect(packageJson.files).toContain('plugin/hooks');
    expect(packageJson.files).toContain('plugin/skills');
    expect(packageJson.files).toContain('plugin/scripts/*.cjs');
    expect(packageJson.files).toContain('plugin/sqlite');
  });

  it('npm tarball includes generated runtime entries and the Claude marketplace root manifests (#3424)', () => {
    const node = process.env.CMEM_TEST_NODE ?? Bun.which('node');
    expect(node).toBeTruthy();
    const result = spawnSync(node!, [path.join(path.dirname(node!), 'node_modules/npm/bin/npm-cli.js'), 'pack', '--dry-run', '--json', '--ignore-scripts', '--offline'], {
      cwd: projectRoot,
      timeout: 20000, windowsHide: true,
      encoding: 'utf-8',
    });

    expect(result.status).toBe(0);
    const packed = JSON.parse(result.stdout);
    // npm 12 keys pack results by package name; older npm returns an array.
    const artifact = Array.isArray(packed) ? packed[0] : packed[readJson('package.json').name];
    const filePaths = new Set(artifact.files.map((file: { path: string }) => file.path));

    expect(filePaths.has('dist/bug-report/index.js')).toBe(true);
    expect(filePaths.has('plugin/sqlite/SessionStore.js')).toBe(true);
    expect(filePaths.has('plugin/sqlite/observations/files.js')).toBe(true);
    expect(filePaths.has('.claude-plugin/marketplace.json')).toBe(true);
    expect(filePaths.has('.claude-plugin/plugin.json')).toBe(true);
  });
});

describe('Plugin Distribution - Build Script Verification', () => {
  it('should verify distribution files in build-hooks.js', () => {
    const buildScriptPath = path.join(projectRoot, 'scripts/build-hooks.js');
    const content = readFileSync(buildScriptPath, 'utf-8');

    expect(content).toContain('plugin/skills/mem-search/SKILL.md');
    expect(content).toContain('plugin/hooks/hooks.json');
    expect(content).toContain('plugin/sqlite/SessionStore.js');
    expect(content).toContain('plugin/sqlite/observations/files.js');
    expect(content).toContain('plugin/.claude-plugin/plugin.json');
    expect(content).toContain('dist/bug-report/index.js');
  });
});

describe('Plugin Distribution - Setup Hook (#1547)', () => {
  it('should not reference removed setup.sh in Setup hook', () => {
    const hooksPath = path.join(projectRoot, 'plugin/hooks/hooks.json');
    const content = readFileSync(hooksPath, 'utf-8');
    expect(content).not.toContain('setup.sh');
  });

  it("Setup refuses automatic version/bootstrap execution", () => {
    expect(String(readJson('plugin/hooks/hooks.json').hooks.Setup[0].hooks[0].command)).toBe('exit 1');
  });

  it('version-check.js referenced by Setup hook should exist on disk', () => {
    const versionCheckPath = path.join(projectRoot, 'plugin/scripts/version-check.js');
    expect(existsSync(versionCheckPath)).toBe(true);
  });
});

describe('Plugin Distribution - Non-blocking bookkeeping hooks (#3206)', () => {
  it("bound Claude bookkeeping preserves async flags and handler argv", () => {
    withBoundHooks('claude', hooks => {
      for (const [event, handler] of Object.entries({ PostToolUse: 'observation', PostToolUseFailure: 'observation', Stop: 'summarize', SessionEnd: 'session-end', SubagentStop: 'subagent-stop' })) {
        const entry = hooks[event][0].hooks[0]; expect(entry.args.slice(1)).toEqual(['hook', handler]); expect(entry.async).toBe(true);
      }
      expect(hooks.PostToolUseFailure[0].matcher).toBe('*');
    });
  });

  it("bound Claude startup uses synchronous context/prompt capture with an independently started worker", () => {
    withBoundHooks('claude', hooks => {
      expect(hooks.SessionStart).toHaveLength(1); expect(hooks.SessionStart[0].hooks).toHaveLength(1);
      expect(hooks.SessionStart[0].matcher).toBe('startup|clear|compact');
      expect(hooks.SessionStart[0].hooks[0].args.slice(1)).toEqual(['hook', 'context']);
      expect(hooks.SessionStart[0].hooks[0]).not.toHaveProperty('async');
      expect(hooks.SessionStart[0].hooks[0].timeout).toBe(60);
      expect(hooks.UserPromptSubmit[0].hooks[0].args.slice(1)).toEqual(['hook', 'session-init']);
      expect(hooks.UserPromptSubmit[0].hooks[0]).not.toHaveProperty('async');
    });
  });

  it('keeps the PreToolUse Read file-context hook synchronous so the File Read Gate can deny', () => {
    const hooksPath = path.join(projectRoot, 'plugin/hooks/hooks.json');
    const parsed = JSON.parse(readFileSync(hooksPath, 'utf-8'));

    const preToolUseGroup = parsed.hooks.PreToolUse[0];
    const fileContext = preToolUseGroup.hooks[0];

    const matcher = new RegExp(preToolUseGroup.matcher);
    for (const tool of ['Read', 'Grep', 'Glob', 'memory_search', 'memory', 'mcp__native__memory_search']) {
      expect(matcher.test(tool)).toBe(true);
    }
    expect(matcher.test('save_memory')).toBe(false);
    expect(fileContext).toMatchObject(buildExecHook(['hook', 'claude-code', 'file-context']));
    // Claude Code ignores permissionDecision from an async hook, so an async
    // file-context hook could never block a whole-file Read.
    expect(fileContext).not.toHaveProperty('async');
  });
});

// ---------------------------------------------------------------------------
// Spawn-contract templating (plans/02-spawn-contract-templating.md)
// ---------------------------------------------------------------------------

const ccTrailing = (...tail: string[]) => [
  'node', '"$_P/scripts/bun-runner.js"', '"$_P/scripts/worker-service.cjs"', ...tail,
];
// Claude Code runtime hooks are exec form: the whole entry is canonical.
const claudeExecHook = (workerServiceArguments: string[], entryOptions: Record<string, unknown>) => ({
  type: 'command', ...buildExecHook(workerServiceArguments), ...entryOptions,
});
const codexHook = (tail: string[]) => buildShellCommand({
  host: 'codex-cli', requireFile: 'bun-runner.js', requireFileSecondary: 'worker-service.cjs',
  trailingCommand: ccTrailing(...tail), notFoundMessage: 'claude-mem: plugin scripts not found',
  extraEnv: { CLAUDE_MEM_CODEX_HOOK: '1' },
  requireDependencies: true,
});
const codexHookPair = (tail: string[], entryOptions: Record<string, unknown> = {}) => ({
  command: codexHook(tail),
  commandWindows: buildCodexWindowsCommand(tail, { requireDependencies: true }),
  ...entryOptions,
});

const SESSION_INIT_HOOK_TIMEOUT_SECONDS = 15;
const SESSION_INIT_HOOK_PATH = 'UserPromptSubmit.0.0';
const FILE_CONTEXT_HOOK_TIMEOUT_SECONDS = 15;
const FILE_CONTEXT_HOOK_PATH = 'PreToolUse.0.0';

type RuleAExpectation = string | { command: string; commandWindows?: string; timeout?: number };

const SETUP_SHELL_COMMAND = buildShellCommand({
  host: 'claude-code-setup', requireFile: 'version-check.js',
  trailingCommand: ['node', '"$_P/scripts/version-check.js"'],
  notFoundMessage: 'claude-mem: version-check.js not found',
});

const CLAUDE_EXEC_EXPECTATIONS: Record<string, Record<string, unknown>> = {
  // `start` already prints its own single, valid status JSON
  // (buildStatusOutput → {"continue":true,"status":"ready","suppressOutput":true}),
  // so nothing may append a second stdout document: two concatenated JSON
  // objects are invalid, so Claude Code would ignore suppressOutput and render
  // the raw JSON at the top of every session.
  'SessionStart.0.0': claudeExecHook(['start'], { timeout: 60, async: true }),
  'SessionStart.1.0': claudeExecHook(['hook', 'claude-code', 'context'], { timeout: 60 }),
  // Synchronous on purpose: only a sync hook's systemMessage is shown to the
  // user, and ensure-launcher.cjs reports a failed self-heal that way.
  'SessionStart.2.0': { type: 'command', ...buildEnsureLauncherExecHook(), timeout: 180 },
  'UserPromptSubmit.0.0': claudeExecHook(['hook', 'claude-code', 'session-init'], { timeout: SESSION_INIT_HOOK_TIMEOUT_SECONDS }),
  'PostToolUse.0.0': claudeExecHook(['hook', 'claude-code', 'observation'], { timeout: 120, async: true }),
  'PostToolUseFailure.0.0': claudeExecHook(['hook', 'claude-code', 'observation'], { timeout: 120, async: true }),
  // Synchronous so the File Read Gate can deny a whole-file Read.
  'PreToolUse.0.0': claudeExecHook(['hook', 'claude-code', 'file-context'], { timeout: FILE_CONTEXT_HOOK_TIMEOUT_SECONDS }),
  'Stop.0.0': claudeExecHook(['hook', 'claude-code', 'summarize'], { timeout: 120, async: true }),
  // Records that a subagent finished, so My Work stops showing it as working.
  'SubagentStop.0.0': claudeExecHook(['hook', 'claude-code', 'subagent-stop'], { timeout: 30, async: true }),
  'SessionEnd.0.0': claudeExecHook(['hook', 'claude-code', 'session-end'], { async: true }),
};

const RULE_A_EXPECTATIONS: Record<string, Record<string, RuleAExpectation>> = {
  'plugin/hooks/hooks.json': {
    'Setup.0.0': SETUP_SHELL_COMMAND,
  },
  'plugin/hooks/codex-hooks.json': {
    'SessionStart.0.0': codexHookPair(['hook', 'codex', 'context']),
    'UserPromptSubmit.0.0': codexHookPair(['hook', 'codex', 'session-init']),
    'PreToolUse.0.0': codexHookPair(['hook', 'codex', 'file-context']),
    'PostToolUse.0.0': codexHookPair(
      ['hook', 'codex', 'observation'],
      { timeout: 5 },
    ),
    'Stop.0.0': codexHookPair(['hook', 'codex', 'summarize']),
    'PostCompact.0.0': codexHookPair(['hook', 'codex', 'post-compact']),
    'SubagentStart.0.0': codexHookPair(['hook', 'codex', 'subagent-context']),
  },
};

const MCP_EXPECTED = buildShellCommand({
  // The mcp Node launcher derives its module target from requireFile; it ignores
  // trailingCommand, so none is passed (see buildMcpNodeLauncher).
  host: 'mcp', requireFile: 'mcp-server.cjs',
  notFoundMessage: 'claude-mem: mcp server not found',
  mcpExtraCandidates: ['$PWD/plugin', '$PWD'],
  mcpExtraCacheRoots: [
    '$HOME/.codex/plugins/cache/claude-mem-local/claude-mem',
    '$HOME/.codex/plugins/cache/thedotmack/claude-mem',
  ],
});

function hookEntryByPath(parsed: any, dottedPath: string): any | null {
  const [event, groupIdx, hookIdx] = dottedPath.split('.');
  return parsed.hooks?.[event]?.[Number(groupIdx)]?.hooks?.[Number(hookIdx)] ?? null;
}

function hookCommandByPath(parsed: any, dottedPath: string): string | null {
  return hookEntryByPath(parsed, dottedPath)?.command ?? null;
}

describe('Spawn-Contract Templating - Rule A generator parity', () => {
  for (const [filePath, commands] of Object.entries(RULE_A_EXPECTATIONS)) {
    for (const [dottedPath, expected] of Object.entries(commands)) {
      it(`${filePath} [${dottedPath}] equals buildShellCommand output`, () => {
        const parsed = readJson(filePath);
        const entry = hookEntryByPath(parsed, dottedPath);
        const expectedCommand = typeof expected === 'string' ? expected : expected.command;
        expect(entry?.command ?? null).toBe(expectedCommand);
        if (typeof expected !== 'string' && expected.commandWindows !== undefined) {
          expect(entry?.commandWindows ?? null).toBe(expected.commandWindows);
        }
        if (typeof expected !== 'string' && expected.timeout !== undefined) {
          expect(entry?.timeout ?? null).toBe(expected.timeout);
        }
      });
    }
  }

  for (const [dottedPath, expectedEntry] of Object.entries(CLAUDE_EXEC_EXPECTATIONS)) {
    it(`plugin/hooks/hooks.json [${dottedPath}] equals the exec-form generator output`, () => {
      expect(hookEntryByPath(readJson('plugin/hooks/hooks.json'), dottedPath)).toEqual(expectedEntry);
    });
  }

  it('plugin/.mcp.json mcp-search command equals buildShellCommand output', () => {
    const parsed = readJson('plugin/.mcp.json');
    expect(parsed.mcpServers['mcp-search'].args[1]).toBe(MCP_EXPECTED);
  });

  it('bounds the Claude Code UserPromptSubmit hook below the legacy 60 second stall (#3434)', () => {
    const parsed = readJson('plugin/hooks/hooks.json');
    expect(hookEntryByPath(parsed, SESSION_INIT_HOOK_PATH)?.timeout).toBe(SESSION_INIT_HOOK_TIMEOUT_SECONDS);
    // The session-init budget must fit inside the host timeout with room for
    // launcher and bun startup.
    expect(HOOK_TIMEOUTS.SESSION_INIT_REQUEST_MAX).toBeLessThan(SESSION_INIT_HOOK_TIMEOUT_SECONDS * 1000);
    // Codex keeps its bounded startup (15 s wait + 2 s request) under 20 s.
    const codex = readJson('plugin/hooks/codex-hooks.json');
    expect(hookEntryByPath(codex, SESSION_INIT_HOOK_PATH)?.timeout).toBeGreaterThan(
      (HOOK_TIMEOUTS.POST_SPAWN_WAIT + 2_000) / 1000,
    );
  });

  it('bounds the synchronous Claude Code PreToolUse Read hook below the legacy 60 second stall', () => {
    const parsed = readJson('plugin/hooks/hooks.json');
    const timeoutSeconds = hookEntryByPath(parsed, FILE_CONTEXT_HOOK_PATH)?.timeout;
    expect(timeoutSeconds).toBe(FILE_CONTEXT_HOOK_TIMEOUT_SECONDS);
    // The handler's worker budget must fit inside the host timeout with room
    // for shell, node and bun startup.
    expect(timeoutSeconds).toBeGreaterThan(FILE_CONTEXT_WORKER_BUDGET_MS / 1000 + 5);
  });

  it("canonical commands never leak unresolved host placeholders or run discovery", () => {
    for (const entries of Object.values(RULE_A_EXPECTATIONS)) for (const value of Object.values(entries)) {
      const command = typeof value === 'string' ? value : value.command; expect(command).toBe('exit 1');
    }
    expect(MCP_EXPECTED).not.toContain('$' + '{CLAUDE_PLUGIN_ROOT}');
    expect(MCP_EXPECTED).not.toContain('process.env.CLAUDE_PLUGIN_ROOT');
    expect(MCP_EXPECTED).toContain('process.env.CLAUDE_MEM_BUNDLE_ROOT');
  });
});

describe('Spawn-Contract Templating - canonical refusal matrix', () => {
  // These replace the nine old implicit-discovery scenarios one-for-one.
  // The contract now refuses every such source; private binding is tested above.
  for (const scenario of ['absolute host root', 'host root without cache scan',
    'host missing dependencies beside a cache', 'Windows host without dependencies',
    'Windows host with dependencies', 'cache only', 'orphaned newer cache',
    'no candidate', 'NVM-only PATH']) {
    it(`refuses ${scenario} without loading candidates or rebuilding PATH`, () => {
      const parent = mkdtempSync(path.join(tmpdir(), 'distribution-refusal-'));
      try {
        const home = path.join(parent, 'home'); mkdirSync(home);
        const marker = path.join(parent, 'loaded');
        const root = path.join(parent, 'plugin');
        const cache = path.join(home, '.claude/plugins/cache/thedotmack/claude-mem/99.0.0');
        const writeCandidate = (candidate: string) => {
          mkdirSync(path.join(candidate, 'scripts'), { recursive: true });
          for (const name of ['version-check.js', 'bun-runner.js', 'worker-service.cjs', 'mcp-server.cjs', 'claude-mem-launcher.cjs']) {
            writeFileSync(path.join(candidate, 'scripts', name), `require('fs').writeFileSync(${JSON.stringify(marker)}, 'loaded');\n`);
          }
        };
        if (scenario !== 'no candidate') { writeCandidate(root); writeCandidate(cache); }
        if (scenario.includes('with dependencies')) mkdirSync(path.join(root, 'node_modules'));
        if (scenario === 'orphaned newer cache') { writeFileSync(path.join(cache, '.orphaned_at'), '1'); utimesSync(cache, new Date(0), new Date(0)); }
        if (scenario === 'NVM-only PATH') { installFakeNvmNode(home, '18.20.0'); installFakeNvmNode(home, '20.11.0'); }
        const env = { ...process.env, HOME: home, USERPROFILE: home, CLAUDE_CONFIG_DIR: path.join(home, '.claude'),
          CLAUDE_PLUGIN_ROOT: scenario === 'cache only' ? '' : root, PLUGIN_ROOT: root,
          CLAUDE_MEM_NODE_EXECUTABLE: process.execPath, CLAUDE_MEM_BUNDLE_ROOT: root };
        const commands = [readJson('plugin/hooks/hooks.json').hooks.Setup[0].hooks[0].command,
          ...commandHooksFrom('plugin/hooks/codex-hooks.json')];
        for (const command of commands) {
          expect(command).toBe('exit 1');
          const result = process.platform === 'win32'
            ? spawnSync(process.env.ComSpec!, ['/d', '/c', command], { env, timeout: 3000, windowsHide: true, encoding: 'utf8' })
            : spawnSync('/bin/sh', ['-c', command], { env, timeout: 3000, encoding: 'utf8' });
          expect(result.status).toBe(1); expect(result.stdout).toBe('');
        }
        const mcp = readJson('plugin/.mcp.json').mcpServers['mcp-search'];
        expect(mcp.command).toBe('');
        const gate = spawnSync(process.execPath, mcp.args, { env, timeout: 3000, windowsHide: true, encoding: 'utf8' });
        expect(gate.status).toBe(1); expect(gate.stdout).toBe('');
        expect(gate.stderr).toMatch(/PRIVATE_LAUNCH_POLICY_PENDING|LOCAL_BUNDLE_MISSING/);
        expect(existsSync(marker)).toBe(false);
      } finally { rmSync(parent, { recursive: true, force: true }); }
    });
  }
});

describe('Spawn-Contract Templating - Rule B installers bake absolute paths', () => {
  const installerFiles = [
    'src/services/integrations/McpIntegrations.ts',
  ];

  for (const file of installerFiles) {
    it(`${file} emits no raw \${CLAUDE_PLUGIN_ROOT} placeholder`, () => {
      const content = readFileSync(path.join(projectRoot, file), 'utf-8');
      expect(content).not.toMatch(/\$\{CLAUDE_PLUGIN_ROOT\}/);
    });
  }
});
