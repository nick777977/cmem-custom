/** Inert compatibility boundary. Hosted extraction is unavailable in the local fork. */
import type { OwnerPrompt } from '../prompt-import/index.js';
import type { LedgerDatabase } from './request-groups.mjs';

export interface HostedIntentState {
  state: 'idle' | 'running' | 'ok' | 'failed';
  reason: 'setup-scan'; step: 'goals' | null; agent: null;
  startedAt: string | null; finishedAt: string | null; error: string | null;
}
export interface HostedIntentOptions {
  origin: () => string;
  credentials: () => { token: string; userId: string };
  /** Legacy configuration path; never read. */
  intentConfigPath?: string;
  ledgerDir: string;
  openDatabase: () => LedgerDatabase & { close(): void };
  appendWorkStateEntry: (entry: { project: string; listName: string; fields: Record<string, string | number | boolean | null> }) => void;
  homeProject: () => string;
  /** This worker's sync device id, so my-focus rows replay in the same order the worker's snapshot uses. */
  localDeviceId?: () => string;
  fetch?: typeof fetch;
  now?: () => number;
  timezoneOffsetMinutes?: () => number;
}

export const HOSTED_SETUP_DISABLED = 'Hosted setup is disabled in this local fork. Open the local viewer to use existing memory.';

export class HostedIntent {
  constructor(_options: HostedIntentOptions) {}
  state(): HostedIntentState {
    return { state: 'failed', reason: 'setup-scan', step: null, agent: null,
      startedAt: null, finishedAt: null, error: HOSTED_SETUP_DISABLED };
  }
  async run(_ownerPrompts: OwnerPrompt[], _improveProduct: boolean): Promise<void> {
    // Do not read credentials, saved responses, prompts or settings; never fall back to another provider.
    throw new Error(HOSTED_SETUP_DISABLED);
  }
}
