import { describe, expect, it } from 'bun:test';
import { readFileSync } from 'fs';
import { claudeCodeAdapter } from '../../../src/cli/adapters/claude-code.js';

const baseInput = {
  hook_event_name: 'SessionStart',
  session_id: 'session-start-source',
  cwd: process.cwd(),
};

describe('Claude Code SessionStart source', () => {
  for (const source of ['startup', 'resume', 'clear', 'compact']) {
    it(`preserves ${source} when normalizing the hook input`, () => {
      expect(claudeCodeAdapter.normalizeInput({ ...baseInput, source }).sessionSource).toBe(source);
    });
  }

  it('drops missing, unknown, and non-string sources', () => {
    for (const source of [undefined, null, '', 'archive', 42, { source: 'resume' }]) {
      expect(claudeCodeAdapter.normalizeInput({ ...baseInput, source }).sessionSource).toBeUndefined();
    }
  });
});

interface SessionStartGroup {
  matcher?: string;
  hooks: Array<{ command: string; args?: string[]; async?: boolean; timeout?: number }>;
}

const { hooks } = JSON.parse(readFileSync(
  new URL('../../../plugin/hooks/hooks.json', import.meta.url),
  'utf-8',
)) as { hooks: { SessionStart: SessionStartGroup[] } };

function groupsForSource(source: string): SessionStartGroup[] {
  return hooks.SessionStart
    .filter(group => !group.matcher || new RegExp(`^(?:${group.matcher})$`).test(source));
}

describe('Claude Code canonical SessionStart templates (private binding required)', () => {
  it('matches resume only to the inert lifecycle template, without timeline injection', () => {
    expect(groupsForSource('resume')).toEqual([hooks.SessionStart[0]]);
    expect(hooks.SessionStart[0].hooks[0].async).toBe(true);
  });

  for (const source of ['startup', 'clear', 'compact']) {
    it(`reserves synchronous context on ${source} without enabling canonical autostart`, () => {
      const groups = groupsForSource(source);
      expect(groups).toEqual(source === 'startup' ? hooks.SessionStart : hooks.SessionStart.slice(0, 2));
      const context = groups.filter(group => group.matcher === 'startup|clear|compact');
      expect(context).toHaveLength(1);
      expect(context[0].hooks[0].async).toBeUndefined();
      expect(context[0].hooks[0].timeout).toBe(60);
      for (const group of groups) for (const hook of group.hooks) {
        expect(hook.command).toBe('');
        expect(hook.args?.[0]).toBe('-e');
        expect(hook.args?.[1]).toContain('PRIVATE_LAUNCH_POLICY_PENDING');
      }
    });
  }
});
