/** WINDOWS-09D: refusing installer APIs; native provider login is separate. */
import * as p from '@clack/prompts';
import { styleText } from 'node:util';
import { type UsageSummary } from '../install/usage-summary.js';
import type { ErrorSeverity } from '../install/error-taxonomy.js';
import { type InstallSummary } from '../install/error-reporter.js';
import { type DeliveredCmemMemoryCredentials } from '../cmem-memory-credentials.js';
import { type TeamBrainTeamRef } from '../../shared/teambrain.js';
import { relayedLine } from '../../shared/relayed-text.js';
import type { shutdownWorkerAndWait, ShutdownBlocker } from '../../services/install/shutdown-helper.js';
import { type PidInfo } from '../../supervisor/process-registry.js';

const isInteractive = process.stdin.isTTY === true;

interface TaskDescriptor {
  title: string;
  task: (message: (msg: string) => void) => Promise<string>;
}

export const log = {
  info: (msg: string) => isInteractive ? p.log.info(msg) : console.log(`  ${msg}`),
  success: (msg: string) => isInteractive ? p.log.success(msg) : console.log(`  ${msg}`),
  warn: (msg: string) => isInteractive ? p.log.warn(msg) : console.warn(`  ${msg}`),
  error: (msg: string) => isInteractive ? p.log.error(msg) : console.error(`  ${msg}`),
};

/** Refusing compatibility API; never performs the legacy installer operation. */
export function disableClaudeAutoMemory(): boolean {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: installer helper disabled; no settings, IDE/marketplace, browser, provider selection or worker mutation. Selected-provider native login is separate.');
}

/** Refusing compatibility API; never performs the legacy installer operation. */
export function makeIDETask(ideId: string, summary: InstallSummary, dshProfile?: string): TaskDescriptor | null {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: installer helper disabled; no settings, IDE/marketplace, browser, provider selection or worker mutation. Selected-provider native login is separate.');
}

/** Refusing compatibility API; never performs the legacy installer operation. */
export function claudeCodeInstallCommand(windows?: boolean): string {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: plugin installer/bootstrap disabled; selected-provider native login is separate.');
}

/** Refusing compatibility API; never performs the legacy installer operation. */
export function writeTrimmedMarketplaceManifest(marketplaceDir: string): void {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: installer helper disabled; no settings, IDE/marketplace, browser, provider selection or worker mutation. Selected-provider native login is separate.');
}

/** Refusing compatibility API; never performs the legacy installer operation. */
export function writeTrimmedMarketplacePackageJson(packageRoot: string, marketplaceDir: string): void {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: installer helper disabled; no settings, IDE/marketplace, browser, provider selection or worker mutation. Selected-provider native login is separate.');
}

/** Refusing compatibility API; never performs the legacy installer operation. */
export function mergeSettings(
  updates: Record<string, string>,
  settingsPath?: string,
): boolean {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: installer helper disabled; no settings, IDE/marketplace, browser, provider selection or worker mutation. Selected-provider native login is separate.');
}

type ProviderId = 'claude' | 'codex' | 'gemini' | 'openrouter' | 'openai-compatible' | 'host';

// Phase 1d: Persisted DB literals (`server_beta_schema_migrations`, job_type
// enums, `server-beta-worker` lockedBy marker) are intentionally preserved in
// the source code; runtime-selector dual-accepts both `'server'` and
// `'server-beta'` settings values, but the installer writes the new canonical
// form `'server'` going forward (settings keys: CLAUDE_MEM_SERVER_{URL,
// API_KEY,PROJECT_ID}).
type RuntimeId = 'worker' | 'server';

/** Refusing compatibility API; never performs the legacy installer operation. */
export function openBrowser(url: string): void {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: installer helper disabled; no settings, IDE/marketplace, browser, provider selection or worker mutation. Selected-provider native login is separate.');
}

/** Refusing compatibility API; never performs the legacy installer operation. */
export async function promptProvider(
  options: InstallOptions,
  /**
   * Null only when login was skipped for an explicit local provider.
   * That path cannot reach the CMEM branch below, which
   * re-checks rather than assuming.
   */
  pairing: InstallerOAuthPairing | null,
  version: string,
): Promise<ProviderId> {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: installer helper disabled; no settings, IDE/marketplace, browser, provider selection or worker mutation. Selected-provider native login is separate.');
}

type InstallerPollStage = 'awaiting_login' | 'awaiting_checkout' | 'awaiting_approval';

/** `teambrain_seat`: a TeamBrain seat, which grants cloud sync and no CMEM Pro observer. */
type TrialPlan = 'trial' | 'pro' | 'none' | 'teambrain_seat';

/**
 * What a poll loop waits for. `login` returns once the browser signs in;
 * `enrollment` (CMEM Pro) and `teambrain_join` only once credentials are ready.
 */
export type InstallerPairingPhase = 'login' | 'enrollment' | 'teambrain_join';

export interface InstallerOAuthPairing {
  pairingId: string;
  secret: string;
  userCode: string;
  authorizationUrl: string;
  checkoutUrl: string;
  pollIntervalMs: number;
  /**
   * Absolute epoch ms after which polling stops, derived from the server's
   * `expires_in` at parse time and clamped to OAUTH_POLL_BUDGET_MAX_MS.
   * Undefined when the server did not report one (fallback budget applies).
   */
  expiresAt?: number;
  /** Defensive compatibility for a server that returns ready during login. */
  delivered?: TrialReadyResult;
}

/** Pure parser used by the mock-server contract tests. */
export function parseInstallerOAuthStartBody(body: unknown): InstallerOAuthPairing | null {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: plugin signup response admission disabled; selected-provider native login is separate.');
}

export type OAuthStartFailure = 'http_error' | 'network' | 'timeout' | 'bad_body' | 'credentials';

// Why the most recent startInstallerOAuthPairing() returned null. A closed enum
// for the installer_oauth_start_failed telemetry event — never a URL, status
// text, or error message.
let lastStartFailure: OAuthStartFailure | null = null;

let lastStartErrorMessage: string | null = null;

export function lastOAuthStartFailure(): OAuthStartFailure | null {
  return lastStartFailure;
}

/** User-visible server/configuration details stay out of the telemetry failure enum. */
export function lastOAuthStartErrorMessage(): string | null {
  return lastStartErrorMessage;
}

export type InstallState = 'fresh' | 'update';

/**
 * What this install tells cmem.ai alongside the sign-in start request: whether
 * it ran over an existing install, and the numbers-only local usage summary
 * (see install/usage-summary.ts). Set once by the install command before any
 * pairing starts; both are optional on the wire and omitted when unknown.
 */
let signupContext: { installState?: InstallState; usageSummary?: UsageSummary | null } = {};

export function setInstallerSignupContext(ctx: { installState?: InstallState; usageSummary?: UsageSummary | null }): void {
  signupContext = { ...ctx };
}

/**
 * Pure: the JSON body for POST /api/installer/oauth/start. `teamInvite` is
 * the TeamBrain invite token a `teambrain_join` pairing carries; it travels
 * only in this POST body, never in a URL.
 */
export function buildInstallerOAuthStartBody(
  source: string,
  deviceName: string,
  ctx: { installState?: InstallState; usageSummary?: UsageSummary | null } = {},
  teamInvite?: string,
): Record<string, unknown> {
  return {
    source,
    device_name: deviceName,
    ...(ctx.installState ? { install_state: ctx.installState } : {}),
    ...(ctx.usageSummary ? { usage_summary: ctx.usageSummary } : {}),
    ...(teamInvite ? { team_invite: teamInvite } : {}),
  };
}

/** Refusing compatibility API; never performs the legacy installer operation. */
export async function startInstallerOAuthPairing(
  opts: { source?: string; timeoutMs?: number; teamInvite?: string } = {},
): Promise<InstallerOAuthPairing | null> {
  throw new Error("LOCAL_RUNTIME_UNAPPROVED: plugin signup/bootstrap is disabled; selected-provider native login is separate.");
}

/**
 * Everything a ready poll delivers. The memory credentials are staged before
 * provider activation so one-shot delivery cannot be lost after enrollment.
 */
export interface TrialReadyResult {
  userId: string;
  setupToken: string;
  hubUrl: string;
  /**
   * The CMEM Pro observer credentials, or null when the server sent none: a
   * sync-only account (a TeamBrain seat), which keeps its own observer.
   */
  memory: DeliveredCmemMemoryCredentials | null;
  plan: TrialPlan;
  trialEndsAt: string | null;
  /** The TeamBrain team a `teambrain_join` pairing joined, when the server names it. */
  team: TeamBrainTeamRef | null;
  /** Where that team's TeamBrain API lives, when the server says. */
  teambrainUrl: string | null;
}

/** Refusing compatibility API; never performs the legacy installer operation. */
export function buildSyncConnectionSettings(
  result: Pick<TrialReadyResult, 'userId' | 'setupToken' | 'hubUrl'>,
  deviceName?: string,
): Record<string, string> {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: plugin installer/bootstrap disabled; selected-provider native login is separate.');
}

/** Refusing compatibility API; never performs the legacy installer operation. */
export function buildTrialReadySettings(
  result: TrialReadyResult,
  deviceName?: string,
): Record<string, string> {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: plugin installer/bootstrap disabled; selected-provider native login is separate.');
}

export function parseTrialReadyBody(body: unknown): TrialReadyResult | null {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: plugin signup response admission disabled; selected-provider native login is separate.');
}

export type InstallerPollOutcome =
  | { kind: 'authenticated'; userId: string }
  | { kind: 'pending'; stage: InstallerPollStage }
  | ({ kind: 'ready' } & TrialReadyResult)
  /** The server refused a TeamBrain join (team full, invite no longer valid, ...): final. */
  | { kind: 'join_failed'; reason: string; message: string | null }
  | { kind: 'gone' }
  | { kind: 'unreachable' };

/** What to say for a refused join when the server sent no words of its own. */
const JOIN_FAILED_FALLBACKS: Record<string, string> = {
  team_full: 'the team has no free seat. Ask its owner to add one.',
  invite_invalid: 'the invite is no longer valid. Ask the team owner for a new invite link.',
  team_inactive: 'the team is not active.',
  not_a_member: 'this account is not a member of the team.',
};

/** One line for a refused join: the server's own words when it sent them, and its reason code. */
export function joinFailedMessage(outcome: { reason: string; message: string | null }): string {
  const said = relayedLine(outcome.message) || JOIN_FAILED_FALLBACKS[outcome.reason] || 'cmem.ai refused the join.';
  const reason = relayedLine(outcome.reason);
  return `Could not join the team: ${said}${reason && reason !== 'unknown' ? ` (${reason})` : ''}`;
}

/** Refusing compatibility API; never performs the legacy installer operation. */
export async function waitForInstallerPairing(
  pairing: InstallerOAuthPairing,
  phase: InstallerPairingPhase,
  version: string,
): Promise<InstallerPollOutcome | null> {
  throw new Error("LOCAL_RUNTIME_UNAPPROVED: plugin signup/bootstrap is disabled; selected-provider native login is separate.");
}

/** Refusing compatibility API; never performs the legacy installer operation. */
export async function completeInstallerOAuthLogin(
  pairing: InstallerOAuthPairing,
  version: string,
): Promise<boolean> {
  throw new Error("LOCAL_RUNTIME_UNAPPROVED: plugin signup/bootstrap is disabled; selected-provider native login is separate.");
}

/** Refusing compatibility API; never performs the legacy installer operation. */
export async function waitForReturnToOpenBrowser(message: string): Promise<void> {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: installer helper disabled; no settings, IDE/marketplace, browser, provider selection or worker mutation. Selected-provider native login is separate.');
}

/** Refusing compatibility API; never performs the legacy installer operation. */
export async function offerDeferredLogin(options: InstallOptions, version: string): Promise<void> {
  throw new Error("LOCAL_RUNTIME_UNAPPROVED: plugin signup/bootstrap is disabled; selected-provider native login is separate.");
}

export function noteDeviceCode(
  pairing: InstallerOAuthPairing,
  instruction: string = 'Enter this code in the browser to approve this device.',
): void {
  const message = [
    styleText(['bold', 'cyan'], pairing.userCode),
    '',
    instruction,
  ].join('\n');
  if (isInteractive) p.note(message, 'Your device code');
  else log.info(`Device code: ${pairing.userCode}`);
}

/** Refusing compatibility API; never performs the legacy installer operation. */
export function activateBrowserEnrollment(result: TrialReadyResult): ProviderId | null {
  throw new Error("LOCAL_RUNTIME_UNAPPROVED: plugin signup/bootstrap is disabled; selected-provider native login is separate.");
}

/** Refusing compatibility API; never performs the legacy installer operation. */
export async function completeCmemTrialPairing(
  pairing: InstallerOAuthPairing,
  version: string,
): Promise<TrialReadyResult | null> {
  throw new Error("LOCAL_RUNTIME_UNAPPROVED: plugin signup/bootstrap is disabled; selected-provider native login is separate.");
}

/**
 * Whether an install still has an account question to answer.
 *
 * `--provider claude` and `--provider host` are exempt: they use the user's
 * existing local credentials and need no claude-mem account. `gemini`,
 * `openrouter` and `codex` are NOT exempt — openrouter is the transport for
 * the cmem gateway, so an explicit `openrouter` install may still be reaching
 * cmem.ai, and gemini and codex are bring-your-own providers that sign in
 * like any other. With no flag at all the provider screen can still offer
 * CMEM Pro, so login must happen first.
 */
export function providerNeedsAccount(provider: InstallOptions['provider']): boolean {
  return provider !== 'claude' && provider !== 'host';
}

export interface InstallOptions {
  ide?: string;
  dshProfile?: string;
  /**
   * `openai-compatible` is never a flag value: it is only ever kept from
   * settings.json by a non-interactive run (`providerSource: 'persisted'`).
   */
  provider?: 'claude' | 'codex' | 'gemini' | 'openrouter' | 'openai-compatible' | 'host';
  /**
   * How `provider` was decided. `flag` for an explicit `--provider` (and the
   * grok-bot implicit cmem default set in index.ts), `default` when a fresh
   * non-interactive run fell back to claude, `persisted` when a non-interactive
   * run reused the provider already in settings, `prompt` for the interactive
   * multiselect, `browser` for the install funnel's At Home choice. Reported on
   * install_completed as `provider_source`.
   */
  providerSource?: 'flag' | 'default' | 'persisted' | 'prompt' | 'browser';
  model?: string;
  noAutoStart?: boolean;
  disableAutoMemory?: boolean;
  // #2543 — non-interactive runtime selection. `server` is the operator-facing
  // alias for the canonical `server-beta` runtime id.
  runtime?: 'worker' | 'server' | 'server-beta';
  // Base URL the server runtime (and the injected IDE MCP config) targets.
  serverUrl?: string;
}

/** Refusing compatibility API; never performs the legacy installer operation. */
export function workerShutdownFailure(
  blocker: ShutdownBlocker,
  port: number | string,
): { severity: ErrorSeverity; cause: string; remediation: string } {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: plugin installer/bootstrap disabled; selected-provider native login is separate.');
}

/** Evidence sources for the installer's worker stop, injectable so tests never touch a real worker. */
export interface WorkerStopDeps {
  stopWorker?: typeof shutdownWorkerAndWait;
  /** The live, verified PID-file owner, or null. */
  readOwnedWorker?: () => PidInfo | null;
  /** How long to wait for the spawn lock; defaults to the lock's staleness window. */
  spawnLockWaitMs?: number;
}

/** Refusing compatibility API; never performs the legacy installer operation. */
export async function overwriteWithWorkerStopped(
  port: number | string,
  summary: InstallSummary,
  overwrite: () => Promise<void>,
  deps: WorkerStopDeps = {},
): Promise<void> {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: installer helper disabled; no settings, IDE/marketplace, browser, provider selection or worker mutation. Selected-provider native login is separate.');
}

/** Refusing compatibility API; never performs the legacy installer operation. */
export async function requireWorkerStopped(
  port: number | string,
  phase: 'pre-overwrite' | 'provider-cutover',
  summary: InstallSummary,
  deps: WorkerStopDeps = {},
): Promise<void> {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: installer helper disabled; no settings, IDE/marketplace, browser, provider selection or worker mutation. Selected-provider native login is separate.');
}

/** Refusing compatibility API; never performs the legacy installer operation. */
export function validateNonInteractiveProvider(
  options: InstallOptions,
  summary: InstallSummary,
): void {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: installer helper disabled; no settings, IDE/marketplace, browser, provider selection or worker mutation. Selected-provider native login is separate.');
}

/**
 * Whether the installer leaves the worker for the user to start. A fresh
 * non-interactive install skips it, but an update or reinstall must not: the
 * overwrite already stopped the old worker, so skipping would leave none
 * running. Exported for tests.
 */
export function shouldSkipWorkerAutostart(input: {
  interactive: boolean;
  noAutoStart?: boolean;
  runtime: RuntimeId;
  alreadyInstalled: boolean;
}): boolean {
  // The server runtime is brought up via its own stack (Docker pg+redis +
  // `claude-mem server start`), never the worker-service spawner (#2543).
  if (input.noAutoStart || input.runtime === 'server') return true;
  return !input.interactive && !input.alreadyInstalled;
}

/** Refusing compatibility API; never performs the legacy installer operation. */
export async function runInstallCommand(options: InstallOptions = {}): Promise<void> {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: plugin installer/bootstrap disabled; selected-provider native login is separate.');
}

/** Refusing compatibility API; never performs the legacy installer operation. */
export async function runRepairCommand(): Promise<void> {
  throw new Error('LOCAL_RUNTIME_UNAPPROVED: plugin installer/bootstrap disabled; selected-provider native login is separate.');
}
