import { isAbsolute } from 'node:path';
import { readJsonFileWithBom } from '../../shared/atomic-json.js';
import { paths } from '../../shared/paths.js';
import { settingsTarget } from '../../shared/settings-document.js';
import type { SelectableProvider } from './provider-dispatch.js';

export const MODEL_PROFILES_SETTING = 'CLAUDE_MEM_MODEL_PROFILES';
const KEY_REFERENCE = /^CMEM_PROFILE_KEY_[A-Z0-9_]{1,96}(?<!_ENDPOINT)$/;
export const MAIN_MODEL_ROLES = ['observer', 'summary', 'compression'] as const;
export type MainModelRole = typeof MAIN_MODEL_ROLES[number];
type ProfileAuth = 'api-key' | 'none' | 'claude-login' | 'chatgpt' | 'aws-sso';

type Route =
  | { provider: 'openai-compatible' | 'openrouter' | 'gemini'; auth: 'api-key' | 'none'; endpoint: string; apiKey: string }
  | { provider: 'claude'; auth: 'api-key'; apiKey: string; executable: string }
  | { provider: 'claude'; auth: 'claude-login'; authHome: string; executable: string }
  | { provider: 'claude'; auth: 'aws-sso'; executable: string; awsPath: string; awsProfile: string; awsConfigFile: string; region: string }
  | { provider: 'codex'; auth: 'chatgpt'; executable: string; authHome: string };

export type ModelProfile = Readonly<Route & { id: string; model: string }>;
export type ProfileIssue = 'profile_required' | 'invalid_profile' | 'unsupported_route' | 'credential_unavailable';
type Selection =
  | { state: 'configured'; profile: ModelProfile; inherited: boolean }
  | { state: 'paused'; issue: ProfileIssue; inherited: boolean };
export type MainProfileSnapshot = Readonly<Record<MainModelRole, Selection>>;
export type ModelRoleStatus = { inherited: boolean } & (
  | { state: 'configured'; profileId: string; provider: SelectableProvider; model: string; auth: ProfileAuth }
  | { state: 'paused'; issue: ProfileIssue }
);

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function matches(value: unknown, pattern: RegExp): value is string {
  return typeof value === 'string' && pattern.test(value);
}

function absolutePath(value: unknown): value is string {
  return typeof value === 'string' && !/[\x00-\x1f]/.test(value) && isAbsolute(value) &&
    (process.platform !== 'win32' || /^[a-z]:[\\/]/i.test(value));
}

function executablePath(value: unknown): value is string {
  return absolutePath(value) && (process.platform !== 'win32' || /\.exe$/i.test(value));
}

function endpointUrl(value: unknown): URL | undefined {
  if (typeof value !== 'string') return;
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/\.$/, '');
    if (url.username || url.password || url.search || url.hash ||
        host === 'cmem.ai' || host.endsWith('.cmem.ai')) return;
    if (url.protocol === 'https:' || (url.protocol === 'http:' && host === '127.0.0.1')) return url;
  } catch {
    return;
  }
}

function resolveRoute(input: Record<string, unknown>, env: NodeJS.ProcessEnv): Route | ProfileIssue {
  const { provider, auth, endpoint, keyEnv, executable, authHome, awsPath, awsProfile, awsConfigFile, region, model } = input;
  switch (provider) {
    case 'claude':
      if (!executablePath(executable) || endpoint !== undefined) return 'invalid_profile';
      if (auth === 'aws-sso') {
        if (!matches(model, /^(?:[a-z]{2,}-)?(?:[a-z]+\.)?anthropic\.claude-[\w.-]+(?::\d+)?$/) &&
            !matches(model, /^arn:aws(?:-[a-z]+)?:bedrock:[a-z0-9-]+:\d{12}:(?:application-)?inference-profile\/[\w.:-]+$/)) return 'invalid_profile';
        if (!executablePath(awsPath) || !absolutePath(awsConfigFile) ||
            !matches(awsProfile, /^[\w.-]{1,80}$/) || !matches(region, /^[a-z]{2}(?:-[a-z]+)+-\d+$/)) return 'invalid_profile';
        return { provider, auth, executable, awsPath, awsProfile, awsConfigFile, region };
      }
      if (!matches(model, /^claude-[\w.-]+-\d[\w.-]*$/) || model.endsWith('-latest')) return 'invalid_profile';
      if (auth === 'claude-login') {
        return absolutePath(authHome) ? { provider, auth, authHome, executable } : 'invalid_profile';
      }
      if (auth !== 'api-key') return 'unsupported_route';
      if (!matches(keyEnv, KEY_REFERENCE)) return 'invalid_profile';
      const claudeKey = selectedKey(env, keyEnv, input);
      return claudeKey && endpointUrl(env[`${keyEnv}_ENDPOINT`])?.href === 'https://api.anthropic.com/'
        ? { provider, auth, apiKey: claudeKey, executable } : 'credential_unavailable';
    case 'codex':
      if (auth !== 'chatgpt') return 'unsupported_route';
      return executablePath(executable) && absolutePath(authHome)
        ? { provider, auth, executable, authHome } : 'invalid_profile';
    case 'openai-compatible':
    case 'openrouter':
    case 'gemini':
      if (auth === 'none' && provider === 'openai-compatible') {
        const url = endpointUrl(endpoint);
        return url?.hostname === '127.0.0.1' ? { provider, auth, endpoint: url.href, apiKey: '' } : 'unsupported_route';
      }
      if (auth !== 'api-key') return 'unsupported_route';
      break;
    default:
      return 'unsupported_route';
  }

  if (!matches(keyEnv, KEY_REFERENCE)) return 'invalid_profile';
  const apiKey = selectedKey(env, keyEnv, input);
  if (!apiKey) return 'credential_unavailable';
  if (provider === 'gemini') {
    const googleEndpoint = 'https://generativelanguage.googleapis.com/';
    if (endpoint !== undefined || !matches(model, /^gemini-[a-z0-9][a-z0-9.-]*$/)) return 'invalid_profile';
    return endpointUrl(env[`${keyEnv}_ENDPOINT`])?.href === googleEndpoint
      ? { provider, auth, endpoint: googleEndpoint, apiKey } : 'credential_unavailable';
  }
  const url = endpointUrl(endpoint);
  if (!url) return 'invalid_profile';
  if (endpointUrl(env[`${keyEnv}_ENDPOINT`])?.href !== url.href) return 'credential_unavailable';
  return { provider, auth, endpoint: url.href, apiKey };
}

function selectedKey(env: NodeJS.ProcessEnv, keyEnv: string, input: Record<string, unknown>): string | undefined {
  const key = env[keyEnv];
  if (!key || /[\s,]/.test(key) || key.startsWith('cm_pro_') || key === input.model || key === input.id) return;
  return key;
}

function resolveProfile(input: unknown, env: NodeJS.ProcessEnv, inherited: boolean): Selection {
  const paused = (issue: ProfileIssue): Selection => ({ state: 'paused', issue, inherited });
  if (!isRecord(input) || !matches(input.id, /^[a-z0-9][a-z0-9_-]{0,63}$/) ||
      !matches(input.model, /^[A-Za-z0-9][A-Za-z0-9._:/-]{0,239}$/)) return paused('invalid_profile');
  if (/^(?:auto|default|latest|openrouter\/(?:auto|free))$/i.test(input.model)) return paused('unsupported_route');
  const route = resolveRoute(input, env);
  if (typeof route === 'string') return paused(route);
  const allowed = new Set(['id', 'provider', 'model', 'auth', ...Object.keys(route)]);
  allowed.delete('apiKey');
  if (route.auth === 'api-key') allowed.add('keyEnv');
  if (route.provider === 'gemini') allowed.delete('endpoint');
  if (Object.keys(input).some(key => !allowed.has(key))) return paused('invalid_profile');
  return { state: 'configured', profile: Object.freeze({ ...route, id: input.id, model: input.model }), inherited };
}

export function resolveMainProfiles(raw: unknown, env: NodeJS.ProcessEnv): MainProfileSnapshot {
  const absent = raw === undefined || raw === '';
  let parsed: unknown = raw;
  if (typeof raw === 'string' && !absent) {
    try { parsed = JSON.parse(raw); } catch { parsed = null; }
  }
  if (!isRecord(parsed) || Object.keys(parsed).some(key => key !== 'default' && !MAIN_MODEL_ROLES.some(role => role === key))) {
    const paused: Selection = { state: 'paused', issue: absent ? 'profile_required' : 'invalid_profile', inherited: true };
    return { observer: paused, summary: paused, compression: paused };
  }
  const defaultSelection = Object.hasOwn(parsed, 'default')
    ? resolveProfile(parsed.default, env, true)
    : { state: 'paused', issue: 'profile_required', inherited: true } as const;
  const roleSelection = (role: MainModelRole): Selection => defaultSelection.state === 'configured' && Object.hasOwn(parsed, role)
    ? resolveProfile(parsed[role], env, false) : defaultSelection;
  return { observer: roleSelection('observer'), summary: roleSelection('summary'), compression: roleSelection('compression') };
}

export function readMainProfiles(settingsPath = paths.settings(), env = process.env): MainProfileSnapshot {
  let raw: unknown = env[MODEL_PROFILES_SETTING];
  if (raw === undefined) {
    try {
      raw = settingsTarget(readJsonFileWithBom<Record<string, unknown>>(settingsPath))[MODEL_PROFILES_SETTING];
    } catch (error) {
      if ((error as NodeJS.ErrnoException)?.code !== 'ENOENT') raw = null;
    }
  }
  return resolveMainProfiles(raw, env);
}

export function describeModelRole(selection: Selection): ModelRoleStatus {
  if (selection.state === 'paused') return { ...selection };
  const { id, provider, model, auth } = selection.profile;
  return { state: 'configured', profileId: id, provider, model, auth, inherited: selection.inherited };
}
