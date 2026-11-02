/** Removed CLI transport. Legacy instrumentation remains safe to await. */
export async function captureCliEvent(
  _event: string,
  _props?: Record<string, unknown>,
  _opts?: { person?: boolean }
): Promise<void> {}
