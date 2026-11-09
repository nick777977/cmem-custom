import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { readSelectedClaudeLogin } from '../../shared/oauth-token.js';
import { paths } from '../../shared/paths.js';
import { ENV_PROXY_VARS } from '../../supervisor/env-sanitizer.js';
import { logger } from '../../utils/logger.js';
import type { ActiveSession } from '../worker-types.js';
import type { ClaudeProvider } from './ClaudeProvider.js';
import type { DatabaseManager } from './DatabaseManager.js';
import type { SessionManager } from './SessionManager.js';
import type { WorkerRef } from './agents/index.js';
import { resolveContextWindowTokens } from './context-window.js';
import { describeModelRole, readMainProfiles, type MainModelRole, type MainProfileSnapshot, type ModelProfile } from './model-profiles.js';
import { OpenAICompatibleProvider, type ProfileRun, type ProfileTurnRequest, type ProviderQueryResult } from './OpenAICompatibleProvider.js';
import { ClassifiedProviderError, isClassified } from './provider-errors.js';
import type { SelectableProvider } from './provider-dispatch.js';
import { resolveLlmTimeoutMs } from './retry.js';

const runFile = promisify(execFile);
const RUNTIME_ENV = new Set([
  'PATH', 'PATHEXT', 'SYSTEMROOT', 'WINDIR', 'COMSPEC', 'HOME', 'USERPROFILE',
  'APPDATA', 'LOCALAPPDATA', 'TEMP', 'TMP', 'LANG', 'NODE_EXTRA_CA_CERTS', 'SSL_CERT_FILE',
  'SSL_CERT_DIR', 'CLAUDE_CODE_GIT_BASH_PATH',
]);

function nativeRuntimeEnv(): NodeJS.ProcessEnv {
  return Object.fromEntries(Object.entries(process.env).filter(([key]) =>
    RUNTIME_ENV.has(key.toUpperCase()) || ENV_PROXY_VARS.has(key)));
}

function setupFailure(message: string): ClassifiedProviderError {
  return new ClassifiedProviderError(message, { kind: 'setup_required', cause: null });
}

class RecordedProfileFailure extends ClassifiedProviderError {
  constructor(role: MainModelRole, issue: string) {
    super(`${role}: ${issue}`, { kind: 'setup_required', cause: null });
  }
}

function requireExecutable(file: string): void {
  if (!statSync(file, { throwIfNoEntry: false })?.isFile()) throw setupFailure('Selected executable unavailable');
}

/** Only accept a named IAM Identity Center configuration. Other AWS chains may run commands or switch accounts. */
function requireSsoProfile(config: string, profile: string): void {
  function section(name: string): Map<string, string> {
    const lines = config.split(/\r?\n/);
    const header = `[${name}]`;
    const start = lines.findIndex(line => line.trim() === header);
    if (start < 0 || lines.slice(start + 1).some(line => line.trim() === header)) throw setupFailure('Invalid AWS SSO profile');
    const values = new Map<string, string>();
    for (const line of lines.slice(start + 1)) {
      if (line.trim().startsWith('[')) break;
      if (!line.trim() || /^[\s]*[#;]/.test(line)) continue;
      const entry = /^\s*([a-z_]+)\s*=\s*(\S.*?)\s*$/.exec(line);
      if (!entry || values.has(entry[1])) throw setupFailure('Invalid AWS SSO profile');
      values.set(entry[1], entry[2]);
    }
    return values;
  }
  const selected = section(profile === 'default' ? 'default' : `profile ${profile}`);
  const allowed = ['sso_session', 'sso_account_id', 'sso_role_name', 'sso_region', 'sso_start_url', 'region', 'output'];
  if ([...selected.keys()].some(key => !allowed.includes(key)) ||
      !/^\d{12}$/.test(selected.get('sso_account_id') ?? '') || !selected.get('sso_role_name')) {
    throw setupFailure('Invalid AWS SSO profile');
  }
  const session = selected.get('sso_session');
  const sso = session ? section(`sso-session ${session}`) : selected;
  if ((session && [...sso.keys()].some(key => !['sso_region', 'sso_start_url', 'sso_registration_scopes'].includes(key))) ||
      !sso.get('sso_region') || !sso.get('sso_start_url')?.startsWith('https://')) {
    throw setupFailure('Invalid AWS SSO profile');
  }
}

async function bedrockCredentials(profile: Extract<ModelProfile, { auth: 'aws-sso' }>, signal: AbortSignal): Promise<NodeJS.ProcessEnv> {
  const emptyConfig = process.platform === 'win32' ? 'NUL' : '/dev/null';
  try {
    requireExecutable(profile.awsPath);
    requireSsoProfile(readFileSync(profile.awsConfigFile, 'utf8'), profile.awsProfile);
    const awsEnv = {
      AWS_SHARED_CREDENTIALS_FILE: emptyConfig, AWS_EC2_METADATA_DISABLED: 'true', AWS_MAX_ATTEMPTS: '1',
    };
    const { stdout } = await runFile(profile.awsPath, [
      'configure', 'export-credentials', '--profile', profile.awsProfile, '--format', 'process', '--no-cli-pager', '--no-cli-auto-prompt',
    ], {
      cwd: paths.dataDir(), env: { ...nativeRuntimeEnv(), ...awsEnv, AWS_CONFIG_FILE: profile.awsConfigFile },
      signal, timeout: 15_000, maxBuffer: 16_384, windowsHide: true,
    });
    const auth = JSON.parse(stdout);
    if (auth?.Version !== 1 || typeof auth.AccessKeyId !== 'string' || !auth.AccessKeyId ||
        typeof auth.SecretAccessKey !== 'string' || !auth.SecretAccessKey ||
        typeof auth.SessionToken !== 'string' || !auth.SessionToken || !(Date.parse(auth.Expiration) > Date.now())) {
      throw setupFailure('Selected AWS SSO credentials unavailable');
    }
    return {
      ...awsEnv, AWS_CONFIG_FILE: emptyConfig, AWS_REGION: profile.region, CLAUDE_CODE_USE_BEDROCK: '1',
      AWS_ACCESS_KEY_ID: auth.AccessKeyId, AWS_SECRET_ACCESS_KEY: auth.SecretAccessKey, AWS_SESSION_TOKEN: auth.SessionToken,
    };
  } catch {
    signal.throwIfAborted();
    throw setupFailure('Selected AWS SSO credentials unavailable');
  }
}

async function claudeEnv(profile: Extract<ModelProfile, { provider: 'claude' }>, signal: AbortSignal): Promise<NodeJS.ProcessEnv> {
  const env = {
    ...nativeRuntimeEnv(),
    CLAUDE_CONFIG_DIR: join(paths.dataDir(), 'observer-profile-runtime'),
    CLAUDE_MEM_INTERNAL: '1',
    CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: '1',
    DISABLE_AUTOUPDATER: '1',
    ANTHROPIC_DEFAULT_SONNET_MODEL: profile.model,
    ANTHROPIC_DEFAULT_OPUS_MODEL: profile.model,
    ANTHROPIC_DEFAULT_HAIKU_MODEL: profile.model,
    ANTHROPIC_SMALL_FAST_MODEL: profile.model,
    CLAUDE_CODE_SUBAGENT_MODEL: profile.model,
  };
  switch (profile.auth) {
    case 'api-key':
      return { ...env, ANTHROPIC_API_KEY: profile.apiKey, ANTHROPIC_BASE_URL: 'https://api.anthropic.com' };
    case 'claude-login': {
      const login = await readSelectedClaudeLogin(profile.authHome);
      if (login.kind !== 'present') throw setupFailure('Selected Claude Code login unavailable');
      return { ...env, CLAUDE_CODE_OAUTH_TOKEN: login.token };
    }
    case 'aws-sso':
      return { ...env, ...await bedrockCredentials(profile, signal) };
  }
}

class ProfileClaudeProvider extends OpenAICompatibleProvider<{ apiKey: string; model: string }> {
  protected readonly providerName = 'Claude';
  protected readonly syntheticIdPrefix = 'claude-profile';
  protected readonly forwardEmptyMessageResponse = true;
  protected override readonly rejectAbortedObservation = true;

  constructor(db: DatabaseManager, sessions: SessionManager, private readonly claude: ClaudeProvider) {
    super(db, sessions);
  }

  protected getConfig(): never { throw this.missingApiKeyError(); }
  protected query(): never { throw this.missingApiKeyError(); }
  protected missingApiKeyError(): Error { return setupFailure('Explicit Claude profile required'); }
  protected estimateTokens(text: string): number { return Math.ceil(text.length / 4); }
  protected buildLastUsage(): undefined { return undefined; }

  protected override profileConfig(profile: ModelProfile) {
    return { apiKey: 'explicit-profile', model: profile.model };
  }

  override async queryProfile(profile: ModelProfile, request: ProfileTurnRequest): Promise<ProviderQueryResult> {
    if (profile.provider !== 'claude') throw setupFailure('Claude profile required');
    requireExecutable(profile.executable);
    const env = await claudeEnv(profile, request.signal);
    request.signal.throwIfAborted();
    const prompt = this.conversationToOpenAIMessages(request.history)
      .map(message => `${message.role.toUpperCase()}:\n${message.content}`).join('\n\n');
    const content = await this.claude.queryProfileTurn(prompt, request.session, profile.model, profile.executable, env, request.signal);
    return { content };
  }
}

type ProfileAdapter = Pick<OpenAICompatibleProvider<{ apiKey: string; model: string }>, 'startProfileSession' | 'queryProfile'>;
type Adapters = Record<SelectableProvider, ProfileAdapter>;

export class MainWorkerProfiles {
  private readonly adapters: Adapters;
  private readonly failures = new Map<MainModelRole, { fingerprint: string; issue: string }>();

  constructor(db: DatabaseManager, sessions: SessionManager, claude: ClaudeProvider, adapters: Omit<Adapters, 'claude'>) {
    this.adapters = { ...adapters, claude: new ProfileClaudeProvider(db, sessions, claude) };
  }

  snapshot = readMainProfiles;

  fingerprint(snapshot: MainProfileSnapshot): string {
    return createHash('sha256').update(JSON.stringify(snapshot)).digest('hex');
  }

  status() {
    const snapshot = this.snapshot();
    const fingerprint = this.fingerprint(snapshot);
    const statusFor = (role: MainModelRole) => {
      const failure = this.failures.get(role);
      return { ...describeModelRole(snapshot[role]), ...(failure?.fingerprint === fingerprint ? { lastFailure: failure.issue } : {}) };
    };
    return { observer: statusFor('observer'), summary: statusFor('summary'), compression: statusFor('compression') };
  }

  async startSession(snapshot: MainProfileSnapshot, session: ActiveSession, worker: WorkerRef): Promise<void> {
    if (snapshot.observer.state !== 'configured') throw setupFailure('Observer profile is paused');
    const { profile } = snapshot.observer;
    const run: ProfileRun = {
      contextWindow: () => resolveContextWindowTokens(profile.provider === 'claude' || profile.provider === 'gemini'
        ? profile.provider : 'openrouter', profile.model),
      timeoutMs: resolveLlmTimeoutMs(),
      send: (role, request) => this.send(snapshot, role, request, worker),
    };
    await this.adapters[profile.provider].startProfileSession(profile, session, worker, run);
  }

  async send(snapshot: MainProfileSnapshot, role: MainModelRole, request: ProfileTurnRequest, worker: WorkerRef): Promise<ProviderQueryResult> {
    const selection = snapshot[role];
    if (selection.state === 'paused') {
      this.recordIssue(worker, role, selection.issue);
      throw new RecordedProfileFailure(role, selection.issue);
    }
    const { profile } = selection;
    const timeout = AbortSignal.timeout(request.timeoutMs);
    try {
      const signal = AbortSignal.any([request.signal, timeout]);
      signal.throwIfAborted();
      const result = await this.adapters[profile.provider].queryProfile(profile, { ...request, signal });
      signal.throwIfAborted();
      if (!result.content.trim()) throw new ClassifiedProviderError('Empty provider reply', { kind: 'unrecoverable', cause: null });
      if (this.failures.get(role)?.fingerprint === this.fingerprint(snapshot)) this.failures.delete(role);
      return { ...result, servedModel: result.servedModel ?? profile.model, profileProvider: profile.provider };
    } catch (error) {
      request.signal.throwIfAborted();
      const kind = timeout.aborted ? 'timeout' : isClassified(error) ? error.kind : 'provider_error';
      this.failures.set(role, { fingerprint: this.fingerprint(snapshot), issue: kind });
      this.recordIssue(worker, role, kind, profile);
      // Provider error bodies, URLs, command lines and child stderr can contain secrets or user text.
      throw new RecordedProfileFailure(role, kind);
    }
  }

  recordSessionFailure(snapshot: MainProfileSnapshot, session: ActiveSession, error: unknown, worker: WorkerRef): void {
    if (error instanceof RecordedProfileFailure) return;
    const role = session.lastGeneratorSource === 'summarize' ? 'summary' : 'observer';
    const selection = snapshot[role];
    const issue = isClassified(error) && error.code === 'profile_invalid_reply' ? 'invalid_reply' : 'processing_failed';
    this.failures.set(role, { fingerprint: this.fingerprint(snapshot), issue });
    this.recordIssue(worker, role, issue, selection.state === 'configured' ? selection.profile : undefined);
  }

  recordIssue(worker: WorkerRef, role: MainModelRole, issue: string, profile?: ModelProfile): void {
    const route = profile ? { profileId: profile.id, provider: profile.provider, model: profile.model, auth: profile.auth } : {};
    logger.warn('SESSION', 'Model profile paused', { role, issue, ...route });
    worker.recordAiInteraction?.({ success: false, provider: profile?.provider ?? 'unconfigured', error: `${role}: ${issue}` });
  }
}
