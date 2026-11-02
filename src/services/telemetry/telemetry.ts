/**
 * Compatibility boundary for the local fork. Remote telemetry is removed.
 * No SDK, consent/config lookup, payload inspection, timers or process hooks.
 * Local diagnostics continue through logger; these entrypoints discard input.
 */
export function hasTelemetryConsent(): boolean { return false; }
export function enableExceptionAutocaptureForWorker(): void {}
export function captureException(_err: unknown, _ctx?: Record<string, unknown>): void {}
export function captureEvent(
  _event: string,
  _props?: Record<string, unknown>,
  _opts?: { person?: boolean }
): void {}
export async function shutdownTelemetry(): Promise<void> {}

/** Retained test seams; no client or autocapture state exists. */
export function __resetTelemetryForTests(): void {}
export function __errorBeforeSendForTests(_event: unknown): null { return null; }
