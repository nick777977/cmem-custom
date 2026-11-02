import type { SetupCheckoutState, SetupChoice, SetupInstallerStage, SetupStateView } from '../../shared/setup-state.js';
import { SettingsDefaultsManager } from '../../shared/SettingsDefaultsManager.js';
import { settingsTarget, type SettingsDocument } from '../../shared/settings-document.js';

/** On The Go checkout on the existing pairing path (funnel Phase 8). */
export interface BrowserCheckout {
  /** Opens the pairing's checkout and waits for it however long it takes; true once paid and the settings are saved. */
  run: () => Promise<boolean>;
  /** The page asked again while a checkout is open: open the same checkout page again. */
  reopen: () => void;
}

/** Compatibility predicate: hosted browser setup is never selected in the local fork. */
export function shouldUseBrowserSetup(_input: {
  interactive: boolean;
  provider?: string;
  noAutoStart?: boolean;
  runtime: 'worker' | 'server';
  setupComplete: boolean;
}): boolean {
  return false; // The local fork never launches hosted setup.
}

export interface BrowserSetupDeps {
  /** e.g. http://127.0.0.1:37777 */
  workerBaseUrl: string;
  openBrowser: (url: string) => void;
  log: { info: (message: string) => void; warn: (message: string) => void };
  /** Applies the choice and returns the stage to report. Throwing reports `failed` and ends the hand-off. */
  applyChoice: (choice: SetupChoice, state: SetupStateView) => Promise<SetupInstallerStage>;
  /** Runs when the page asks for checkout after the choice left the installer at `go-awaiting-checkout`. */
  checkout?: BrowserCheckout;
  fetch?: typeof fetch;
  sleep?: (ms: number) => Promise<void>;
  pollIntervalMs?: number;
}

export interface BrowserSetupOutcome {
  choice: SetupChoice;
  stage: SetupInstallerStage;
  state: SetupStateView;
  /** On The Go only: the checkout finished and the CMEM Pro settings were saved. */
  checkoutPaid: boolean;
}

export function setupPageUrl(workerBaseUrl: string): string {
  return `${workerBaseUrl}/?setup=1`;
}

export async function runBrowserSetup(_deps: BrowserSetupDeps): Promise<BrowserSetupOutcome> {
  // Fail before browser, transport, account, installer or polling callbacks can run.
  throw new Error('Hosted browser setup is disabled in this local fork. Use the local viewer.');
}

/**
 * Settings a running worker reads from settings.json each time it uses them (provider-dispatch, the Claude provider),
 * so At Home's choice (provider, Claude auth method, model) takes effect with no restart.
 */
const SETTINGS_THE_WORKER_READS_LIVE = new Set(['CLAUDE_MEM_PROVIDER', 'CLAUDE_MEM_CLAUDE_AUTH_METHOD', 'CLAUDE_MEM_MODEL']);
const CLOUD_SYNC_SETTING_PREFIX = 'CLAUDE_MEM_CLOUD_SYNC_';

function effectiveSettings(snapshot: string): Record<string, string> {
  const document = snapshot.trim() ? settingsTarget(JSON.parse(snapshot.replace(/^\uFEFF/, '')) as SettingsDocument) : {};
  return { ...SettingsDefaultsManager.getAllDefaults(), ...document } as unknown as Record<string, string>;
}

const cloudSyncOn = (settings: Record<string, string>) => Boolean(settings.CLAUDE_MEM_CLOUD_SYNC_TOKEN && settings.CLAUDE_MEM_CLOUD_SYNC_USER_ID
  && String(settings.CLAUDE_MEM_CLOUD_SYNC_HUB_URL ?? '').trim());

/**
 * The settings the browser setup changed that the running worker only reads when it starts (cloud sync is set up at
 * boot), so they need a worker restart. Empty means the worker already runs with the new settings: no restart.
 * Cloud sync's keys count only when sync is on before or after (At Home writes them empty over the defaults).
 */
export function settingsChangesNeedingRestart(before: string, after: string): string[] {
  const previous = effectiveSettings(before), next = effectiveSettings(after);
  const syncMatters = cloudSyncOn(previous) || cloudSyncOn(next);
  return [...new Set([...Object.keys(previous), ...Object.keys(next)])].filter(key => String(previous[key] ?? '') !== String(next[key] ?? ''))
    .filter(key => !SETTINGS_THE_WORKER_READS_LIVE.has(key) && (syncMatters || !key.startsWith(CLOUD_SYNC_SETTING_PREFIX)))
    .sort();
}

/** Retired polling helper; no legacy setup request or worker restart is attempted. */
export async function waitForBackgroundWorkToFinish(_deps: Pick<BrowserSetupDeps, 'workerBaseUrl' | 'log' | 'fetch' | 'sleep' | 'pollIntervalMs'>): Promise<void> {
  throw new Error('Hosted browser setup is disabled in this local fork.');
}
