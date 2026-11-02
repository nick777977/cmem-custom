import { expect, it, describe } from 'bun:test';
import { Database } from 'bun:sqlite';
import * as usage from '../../src/services/telemetry/work-state';
import { workStatePlatform, workStateTool, workStateOutcome } from '../../src/shared/work-state-telemetry';
const saved = { content: [{ type: 'text', text: 'Saved to "progress" in project.' }] };
describe('retired work-state usage collection', () => {
  it('does not create telemetry tables or read a DB even for privacy receipts', () => {
    const db = new Database(':memory:');
    const a = { contentSessionId: 'synthetic', enqueuedAtEpochMs: Date.now() };
    usage.recordWorkStatePrivacy(db, a, false); usage.recordWorkStatePrivacy(db, a, true);
    usage.recordWorkStatePrompt(db, a, 1); usage.recordWorkStateInstruction(db, a, 'returned', 'receipt');
    usage.recordWorkStateTool(db, a, 'tool', 'work_state_write', saved);
    usage.recordWorkStateMcp(db, 'write', 'error', 'receipt');
    expect(usage.isPublicWorkStateTurn(db, a)).toBe(false);
    expect(db.query("SELECT name FROM sqlite_master WHERE type='table'").all()).toEqual([]);
    db.close();
  });
  it('uses finite platform names and exact tracked tool names', () => {
    expect(workStatePlatform(undefined)).toBe('unknown');
    expect(workStatePlatform('secret-custom-platform')).toBe('other');
    expect(workStatePlatform('claude-code')).toBe('claude');
    expect(workStatePlatform('omp')).toBe('omp');
    expect(workStateTool('mcp__mcp_search__work_state_read')).toBe('read');
    expect(workStateTool('functions.update_plan')).toBe('native_todo');
    expect(workStateTool('Write')).toBeNull();
    expect(workStateTool('work_state_write_suffix')).toBeNull();
  });

  it('classifies only explicit receipts, preserving ambiguous outcomes', () => {
    expect(workStateOutcome('write', saved)).toBe('ok');
    expect(workStateOutcome('write', { isError: true, content: [] })).toBe('error');
    expect(workStateOutcome('write', { content: [{ type: 'text', text: 'Not saved: this project is excluded from claude-mem (CLAUDE_MEM_EXCLUDED_PROJECTS).' }] })).toBe('excluded');
    expect(workStateOutcome('write', { content: [{ type: 'text', text: 'Work state is turned off (CLAUDE_MEM_WORK_STATE_ENABLED=false).' }], isError: true })).toBe('disabled');
    expect(workStateOutcome('write', {})).toBe('unknown');
    expect(workStateOutcome('write', undefined)).toBe('unknown');
  });
});
