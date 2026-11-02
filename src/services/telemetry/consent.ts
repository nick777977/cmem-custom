import { join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';
import { randomUUID } from 'crypto';
import { resolveDataDir } from '../../shared/paths.js';
import { readJsonSafe } from '../../utils/json-utils.js';
import { logger } from '../../utils/logger.js';

export type TelemetryConfig = {
  /** Explicit user decision. Absent = no decision recorded; the opt-out default applies. */
  enabled?: boolean;
  installId: string;
  decidedAt: string;
};

const TELEMETRY_CONFIG_FILENAME = 'telemetry.json';

/** Fork policy is unconditional; legacy opt-in cannot enable a transport. */
export type TelemetryConsentSource = 'fork-policy';
export type TelemetryConsentExplanation = { enabled: boolean; source: TelemetryConsentSource };
export function explainTelemetryConsent(
  _env: NodeJS.ProcessEnv, _config: TelemetryConfig | null
): TelemetryConsentExplanation { return { enabled: false, source: 'fork-policy' }; }
export function resolveTelemetryConsent(_env: NodeJS.ProcessEnv, _config: TelemetryConfig | null): boolean {
  return false;
}
export function isErrorTelemetryEnabled(_env: NodeJS.ProcessEnv): boolean { return false; }

/** Absolute path of telemetry.json inside the claude-mem data dir. */
export function getTelemetryConfigPath(): string {
  return join(resolveDataDir(), TELEMETRY_CONFIG_FILENAME);
}

/**
 * Reads telemetry.json from the data dir. Returns null if the file is
 * missing, corrupt, or malformed — never throws.
 */
export function loadTelemetryConfig(): TelemetryConfig | null {
  let raw: Partial<TelemetryConfig> | null;
  try {
    raw = readJsonSafe<Partial<TelemetryConfig> | null>(getTelemetryConfigPath(), null);
  } catch (error) {
    // Corrupt JSON — treat as no recorded consent
    const err = error instanceof Error ? error : new Error(String(error));
    logger.warn('SYSTEM', 'Telemetry: corrupt telemetry.json; treating as no recorded consent', undefined, err);
    return null;
  }
  if (!raw || typeof raw !== 'object') return null;
  if (typeof raw.installId !== 'string') return null;
  // enabled may be absent (no decision recorded — default applies), but a
  // present non-boolean value means the file is malformed.
  if (raw.enabled !== undefined && typeof raw.enabled !== 'boolean') return null;
  return {
    enabled: raw.enabled,
    installId: raw.installId,
    decidedAt: typeof raw.decidedAt === 'string' ? raw.decidedAt : '',
  };
}

export function saveTelemetryConfig(config: TelemetryConfig): void {
  const dataDir = resolveDataDir();
  mkdirSync(dataDir, { recursive: true });
  writeFileSync(join(dataDir, TELEMETRY_CONFIG_FILENAME), JSON.stringify(config, null, 2) + '\n');
}

/**
 * Returns the stable anonymous install ID, generating and persisting one on
 * first use. Records ONLY the ID — never a consent decision — so the opt-out
 * default (and any future default change) still applies to this install.
 */
export function getOrCreateInstallId(): string {
  const existing = loadTelemetryConfig();
  if (existing?.installId) return existing.installId;

  const installId = randomUUID();
  saveTelemetryConfig({
    installId,
    decidedAt: '',
  });
  return installId;
}
